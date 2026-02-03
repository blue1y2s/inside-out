import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { MemorySphere } from '../types';
import { MemorySphereMesh } from './MemorySphereMesh';
import { BeliefStrands } from './BeliefStrands';
import { clsx } from 'clsx';

interface PersonaUniverseProps {
  spheres: MemorySphere[];
}

export const PersonaUniverse: React.FC<PersonaUniverseProps> = ({ spheres }) => {
  const [layoutMode, setLayoutMode] = useState<'timeline' | 'humanoid' | 'castle'>('timeline');

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 2, 16], fov: 35 }}
        gl={{ antialias: true, toneMappingExposure: 1.2 }}
        shadows
      >
        {/* Background removed for transparent gradient */}

        {/* Atmosphere */}
        <fog attach="fog" args={['#FDFCF5', 5, 40]} />
        <Sparkles count={100} scale={20} size={3} speed={0.4} opacity={0.2} color="#D6D3D1" />

        {/* Lighting Strategy */}
        <ambientLight intensity={0.7} color="#FFF7ED" />

        {/* Main Sun */}
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.2}
          color="#FFDEAD"
          castShadow
        />

        {/* Rim Light for depth */}
        <pointLight position={[-5, 2, -5]} intensity={1.5} color="#2E2EFF" />

        {/* Dynamic Center Light for Humanoid Mode */}
        {layoutMode === 'humanoid' && (
          <pointLight position={[0, 1, 1]} intensity={2} color="#FF0055" distance={6} decay={2} />
        )}

        {/* Post-processing: Bloom for inner glow */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={1.2} // Only very bright things glow
            mipmapBlur
            intensity={0.6} // Subtle soft glow
            radius={0.5}
          />
        </EffectComposer>

        <group position={[0, -1, 0]}>
          <ContactShadows
            opacity={0.3}
            scale={20}
            blur={2}
            far={4}
            resolution={256}
            color="#000000"
          />
          {spheres.map(sphere => (
            <MemorySphereMesh key={sphere.id} data={sphere} mode={layoutMode} />
          ))}
          <BeliefStrands spheres={spheres} visible={layoutMode === 'castle'} />
        </group>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={30}
          autoRotate={true}
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 1.5}
          target={[0, 1, 0]}
        />
      </Canvas>

      {/* Floating Action Button for Transformation */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setLayoutMode(prev => {
            if (prev === 'timeline') return 'humanoid';
            if (prev === 'humanoid') return 'castle';
            return 'timeline';
          })}
          className={clsx(
            "group flex items-center gap-3 px-8 py-4 rounded-full border shadow-2xl transition-all duration-500 ease-out backdrop-blur-md",
            layoutMode === 'humanoid'
              ? "bg-neutral-charcoal/90 border-neutral-charcoal text-[#CCFF00]"
              : layoutMode === 'castle'
                ? "bg-emotion-joy/90 border-emotion-joy text-neutral-charcoal shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                : "bg-white/80 border-white text-neutral-charcoal hover:scale-105"
          )}
        >
          {layoutMode === 'timeline' && (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#CCFF00]"></span>
              </span>
              <span className="font-serif font-bold text-lg tracking-wide uppercase">Construct Persona</span>
            </>
          )}
          {layoutMode === 'humanoid' && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><path d="M12 4v16"></path></svg>
              <span className="font-serif font-bold text-lg tracking-wide uppercase">Visit Sense of Self</span>
            </>
          )}
          {layoutMode === 'castle' && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-90 transition-transform"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span className="font-serif font-bold text-lg tracking-wide uppercase">Deconstruct Self</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};