import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScenePhase } from '../types';
import { Mesh, MeshBasicMaterial } from 'three';
import { ContactShadows } from '@react-three/drei';
import { useLanguage } from '../context/LanguageContext';

interface CagedSphereSceneProps {
  scenePhase: ScenePhase;
  onPhaseChange: (next: ScenePhase) => void;
}

const CagedContent: React.FC<CagedSphereSceneProps> = ({ scenePhase, onPhaseChange }) => {
  const cubeRef = useRef<Mesh>(null);
  const sphereRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);

  const [elapsedTime, setElapsedTime] = useState(0);

  useFrame((state, delta) => {
    if (!cubeRef.current || !sphereRef.current) return;

    // Idle Animation
    if (scenePhase === 'caged') {
      cubeRef.current.rotation.y += delta * 0.1;
      cubeRef.current.rotation.x += delta * 0.05;

      const breath = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      sphereRef.current.scale.set(breath, breath, breath);
    }

    // Liberation Sequence
    if (scenePhase === 'liberating') {
      const newTime = elapsedTime + delta;
      setElapsedTime(newTime);

      const duration = 1.0;
      const progress = Math.min(newTime / duration, 1);

      // Expand Cube
      const scale = 1 + progress * 15;
      cubeRef.current.scale.set(scale, scale, scale);
      cubeRef.current.rotation.y += delta * 5;

      // Fade out Cube
      if (materialRef.current) {
        materialRef.current.opacity = (1 - progress) * 0.5;
      }

      // Sphere Activation
      const popScale = 1 + Math.sin(progress * Math.PI) * 0.3;
      sphereRef.current.scale.set(popScale, popScale, popScale);

      // Finish
      if (progress >= 1) {
        onPhaseChange('input');
      }
    }
  });

  const handleClick = () => {
    if (scenePhase === 'caged') {
      onPhaseChange('liberating');
    }
  };

  return (
    <group>
      {/* The Cage - Warm Grey Wireframe */}
      <mesh ref={cubeRef}>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#D6D3D1"
          wireframe={true}
          transparent={true}
          opacity={0.5}
        />
      </mesh>

      {/* The Soul Sphere - Neon Lime */}
      <mesh
        ref={sphereRef}
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshPhysicalMaterial
          color="#CCFF00"
          emissive="#CCFF00"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      <ContactShadows opacity={0.3} scale={10} blur={2.5} far={4} color="#D6D3D1" />

      {/* Studio Lighting - Warm & Soft */}
      <ambientLight intensity={0.9} color="#FFF7ED" />
      <directionalLight position={[5, 10, 5]} intensity={0.6} castShadow color="#FFFFFF" />
      <directionalLight position={[-5, 0, -5]} intensity={0.4} color="#FAFF00" />
    </group>
  );
};

export const CagedSphereScene: React.FC<CagedSphereSceneProps> = (props) => {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 6] }}>
        {/* Background removed for transparent gradient */}
        <CagedContent {...props} />
      </Canvas>

      {props.scenePhase === 'caged' && (
        <TranslatedStatus />
      )}
    </div>
  );
};

const TranslatedStatus: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="absolute bottom-20 w-full text-center pointer-events-none">
      <div className="inline-block px-6 py-4 rounded-full bg-white/40 border border-white shadow-sm backdrop-blur">
        <p className="text-neutral-charcoal/50 text-[10px] font-bold tracking-widest uppercase mb-1">{t('caged.status')}</p>
        <p className="text-neutral-charcoal text-sm font-medium">{t('caged.instruction')}</p>
      </div>
    </div>
  );
};