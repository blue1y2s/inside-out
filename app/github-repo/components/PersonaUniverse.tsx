import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { MemorySphere } from '../types';
import { MemorySphereMesh } from './MemorySphereMesh';
import { clsx } from 'clsx';

interface PersonaUniverseProps {
  spheres: MemorySphere[];
}

export const PersonaUniverse: React.FC<PersonaUniverseProps> = ({ spheres }) => {
  const [layoutMode, setLayoutMode] = useState<'timeline' | 'humanoid'>('timeline');

  return (
    <div className="w-full h-full relative bg-[#FDFCF5]">
      <Canvas
        camera={{ position: [0, 2, 16], fov: 35 }}
        gl={{ antialias: true, toneMappingExposure: 1.2 }}
        shadows
      >
        <color attach="background" args={['#FDFCF5']} />
        
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

        <group position={[0, -1, 0]}>
          {spheres.map(sphere => (
            <MemorySphereMesh key={sphere.id} data={sphere} mode={layoutMode} />
          ))}
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
          onClick={() => setLayoutMode(prev => prev === 'timeline' ? 'humanoid' : 'timeline')}
          className={clsx(
            "group flex items-center gap-3 px-8 py-4 rounded-full border shadow-2xl transition-all duration-500 ease-out backdrop-blur-md",
            layoutMode === 'humanoid' 
              ? "bg-gallery-charcoal/90 border-gallery-charcoal text-[#CCFF00]" 
              : "bg-white/80 border-white text-gallery-charcoal hover:scale-105"
          )}
        >
           {layoutMode === 'timeline' ? (
             <>
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#CCFF00]"></span>
                </span>
                <span className="font-serif font-bold text-lg tracking-wide uppercase">Construct Persona</span>
             </>
           ) : (
             <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span className="font-serif font-bold text-lg tracking-wide uppercase">Deconstruct</span>
             </>
           )}
        </button>
      </div>
    </div>
  );
};