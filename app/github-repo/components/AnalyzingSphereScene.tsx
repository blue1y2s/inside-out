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
            const startColor = new Color('#FDFCF5'); 
            const end = new Color(targetColor);
            materialRef.current.color.lerpColors(startColor, end, colorProgress);
        }
    }

    if (sphereRef.current) {
        sphereRef.current.rotation.y -= delta * 0.5;
        const pulse = 1 + Math.sin(newTime * 3) * 0.05;
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
            color="#FDFCF5" 
            roughness={0.2}
            metalness={0.1}
            clearcoat={1.0}
        />
      </mesh>
      
      <ContactShadows opacity={0.3} scale={10} blur={2.5} far={4} color="#D6D3D1" />

      {fragments.map((frag) => {
         const activeTime = Math.max(0, elapsed - frag.delay);
         const travelDuration = 1.2;
         const progress = Math.min(1, activeTime / travelDuration);
         const ease = 1 - Math.pow(1 - progress, 3); // Cubic out
         
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
                color="#1C1917" 
                fillOpacity={opacity}
                fontSize={0.5}
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                lookAt={[0,0,0] as any}
            >
                {frag.text}
            </Text>
         );
      })}

      <ambientLight intensity={0.9} color="#FFF7ED" />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#CCFF00" />
    </group>
  );
};

export const AnalyzingSphereScene: React.FC<AnalyzingSphereSceneProps> = (props) => {
  return (
    <div className="w-full h-full relative bg-[#FDFCF5]">
       <Canvas camera={{ position: [0, 2, 8] }}>
         <color attach="background" args={['#FDFCF5']} />
         <AnalyzingContent {...props} />
       </Canvas>
       <div className="absolute top-20 w-full text-center pointer-events-none">
          <div className="inline-flex flex-col items-center bg-white/40 backdrop-blur px-6 py-3 rounded-sm border border-white shadow-sm">
             <h2 className="text-gallery-charcoal text-sm font-medium tracking-wide mb-1">Absorbing</h2>
             <p className="text-gallery-charcoal/50 text-xs">Integrating thoughts into the collection...</p>
          </div>
       </div>
    </div>
  );
};