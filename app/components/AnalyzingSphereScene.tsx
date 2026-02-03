import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, ContactShadows } from '@react-three/drei';
import { Color, Mesh, MeshStandardMaterial } from 'three';
import { AnalyzedPost, ScenePhase } from '../types';
import { getSphereColor } from '../utils/colorMap';

interface AnalyzingSphereSceneProps {
  scenePhase: ScenePhase;
  onPhaseChange: (next: ScenePhase) => void;
  posts: AnalyzedPost[];
}

const AnalyzingContent: React.FC<AnalyzingSphereSceneProps> = ({ scenePhase, onPhaseChange, posts }) => {
  const sphereRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const [elapsed, setElapsed] = useState(0);

  const targetColor = useMemo(() => {
    if (posts.length === 0) return '#CCFF00';
    const avg = posts.reduce((sum, p) => sum + p.sentimentScore, 0) / posts.length;
    return getSphereColor(avg);
  }, [posts]);

  const fragments = useMemo(() => {
    return posts.slice(0, 15).map((post, i) => {
      // Spiral positioning
      const theta = (i / 15) * Math.PI * 4;
      const radius = 6;

      return {
        id: i,
        text: post.originalText.substring(0, 8) + "...",
        startPos: [
          radius * Math.cos(theta),
          (Math.random() - 0.5) * 6,
          radius * Math.sin(theta)
        ] as [number, number, number],
        delay: i * 0.1
      };
    });
  }, [posts]);

  useFrame((state, delta) => {
    if (scenePhase !== 'analyzing') return;

    const newTime = elapsed + delta;
    setElapsed(newTime);
    const totalDuration = 3.5;

    // Sphere Transformation
    if (materialRef.current) {
      const colorProgress = Math.max(0, (newTime - 1.0) / 1.5);
      if (colorProgress <= 1) {
        const end = new Color(targetColor);
        // Fade in color and emission
        materialRef.current.emissive.lerp(end, colorProgress * 0.5);
        // Keep it mostly white but tint it
        materialRef.current.color.lerp(end, colorProgress * 0.2);
        (materialRef.current as any).emissiveIntensity = colorProgress * 2.0;
      }
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.y -= delta * 0.8;
      const pulse = 1 + Math.sin(newTime * 4) * 0.03;
      sphereRef.current.scale.set(pulse, pulse, pulse);
    }

    if (newTime >= totalDuration) {
      onPhaseChange('universe');
    }
  });

  return (
    <group>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0}
          transparent
          transmission={0.9}
          thickness={1.5}
          roughness={0.05}
          metalness={0.02}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          ior={1.4}
          iridescence={0.4}
          iridescenceIOR={1.3}
        />
      </mesh>

      <ContactShadows opacity={0.15} scale={10} blur={3} far={4} color="#000000" />

      {fragments.map((frag) => {
        const activeTime = Math.max(0, elapsed - frag.delay);
        const travelDuration = 1.0;
        const progress = Math.min(1, activeTime / travelDuration);
        const ease = 1 - Math.pow(1 - progress, 4); // Quartic out

        const x = frag.startPos[0] * (1 - ease);
        const y = frag.startPos[1] * (1 - ease);
        const z = frag.startPos[2] * (1 - ease);

        const scale = (1 - ease) * 0.6;
        const opacity = 1 - ease;

        if (progress >= 1) return null;

        return (
          <Text
            key={frag.id}
            position={[x, y, z]}
            scale={[scale, scale, scale]}
            color="#ffffff"
            fillOpacity={opacity}
            fontSize={0.4}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          >
            {frag.text}
          </Text>
        );
      })}

      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={1} color={targetColor} />
    </group>
  );
};

export const AnalyzingSphereScene: React.FC<AnalyzingSphereSceneProps> = (props) => {
  return (
    <div className="w-full h-full relative bg-transparent">
      <Canvas camera={{ position: [0, 1, 6] }} gl={{ alpha: true, antialias: true }}>
        <AnalyzingContent {...props} />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-full shadow-2xl animate-pulse">
          <div className="w-48 h-48 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" />
        </div>
      </div>
      <div className="absolute top-20 w-full text-center pointer-events-none">
        <div className="inline-flex flex-col items-center">
          <h2 className="text-white text-xl font-light tracking-[0.3em] uppercase mb-2">Analyzing Consciousness</h2>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};