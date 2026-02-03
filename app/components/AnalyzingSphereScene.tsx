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
        const targetEmotionColor = new Color(targetColor);

        // Start with transparent white, gradually add emotion color
        materialRef.current.color.set('#ffffff');
        materialRef.current.emissive.lerp(targetEmotionColor, colorProgress);

        // Gradually increase opacity and emission as memories are absorbed
        (materialRef.current as any).opacity = 0.3 + (colorProgress * 0.7);
        (materialRef.current as any).emissiveIntensity = colorProgress * 1.5;
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
          opacity={0.3}
          roughness={0.1}
          metalness={0}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          ior={1.5}
        />
      </mesh>

      {/* No black shadows - use soft white reflection instead */}
      <ContactShadows opacity={0.08} scale={10} blur={4} far={4} color="#E5E5E5" />

      {fragments.map((frag) => {
        const activeTime = Math.max(0, elapsed - frag.delay);
        const travelDuration = 1.0;
        const progress = Math.min(1, activeTime / travelDuration);
        const ease = 1 - Math.pow(1 - progress, 4);

        const x = frag.startPos[0] * (1 - ease);
        const y = frag.startPos[1] * (1 - ease);
        const z = frag.startPos[2] * (1 - ease);

        const scale = (1 - ease) * 0.5;
        const opacity = 1 - ease;

        if (progress >= 1) return null;

        return (
          <Text
            key={frag.id}
            position={[x, y, z]}
            scale={[scale, scale, scale]}
            color="#ffffff"
            fillOpacity={opacity * 0.8}
            fontSize={0.35}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          >
            {frag.text}
          </Text>
        );
      })}

      {/* Bright, clean lighting - no dark elements */}
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={1.2} color={targetColor} />
    </group>
  );
};

export const AnalyzingSphereScene: React.FC<AnalyzingSphereSceneProps> = (props) => {
  return (
    <div className="w-full h-full relative bg-transparent">
      <Canvas camera={{ position: [0, 1, 6] }} gl={{ alpha: true, antialias: true }}>
        <color attach="background" args={['transparent']} />
        <AnalyzingContent {...props} />
      </Canvas>
    </div>
  );
};