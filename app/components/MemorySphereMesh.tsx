import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { MemorySphere } from '../types';

interface MemorySphereMeshProps {
  data: MemorySphere;
  mode: 'timeline' | 'humanoid';
}

export const MemorySphereMesh: React.FC<MemorySphereMeshProps> = ({ data, mode }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Random phase for independent organic movement
  const phase = useRef(Math.random() * 100);

  // Pre-calculate vectors
  const timelineVec = useMemo(() => new Vector3(...data.timelinePosition), [data.timelinePosition]);
  const humanoidVec = useMemo(() => new Vector3(...data.humanoidPosition), [data.humanoidPosition]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // 1. Determine Target Position
    const targetBase = mode === 'timeline' ? timelineVec : humanoidVec;

    // 2. Organic Float Intensity
    // Timeline = High float, Humanoid = Low float (tight structure)
    const floatAmp = mode === 'timeline' ? 0.2 : 0.01;
    const floatFreq = mode === 'timeline' ? 1.0 : 3.0;

    const floatY = Math.sin(time * floatFreq + phase.current) * floatAmp;
    const floatX = Math.cos(time * 0.5 + phase.current) * (floatAmp * 0.5);

    // 3. Interpolation (Lerp)
    // Smoothly transition current position to target
    const currentPos = meshRef.current.position;
    const targetWithFloat = targetBase.clone().add(new Vector3(floatX, floatY, 0));
    
    // Faster transition to humanoid for "snap" effect, slower back to timeline
    const lerpSpeed = mode === 'humanoid' ? 0.08 : 0.05;
    currentPos.lerp(targetWithFloat, lerpSpeed);
    
    // 4. Scale & Rotation
    // Humanoid mode spheres are slightly smaller to form a dense point cloud
    const baseScale = mode === 'humanoid' ? 0.8 : 1.0;
    const targetScale = (hovered ? 1.4 : 1.0) * baseScale;
    
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.z = time * 0.1;
    
    meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.1);
  });

  const isHighEnergy = data.color === '#FFFF00' || data.color === '#FF0055' || data.color === '#CCFF00';
  
  // Higher emissive in humanoid mode to look like glowing energy
  const emissiveInt = mode === 'humanoid' ? 0.8 : (hovered ? 0.6 : 0.2);

  return (
    <mesh
      ref={meshRef}
      position={data.timelinePosition} // Start at timeline
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[data.radius, 32, 32]} />
      <meshPhysicalMaterial 
        color={data.color} 
        emissive={data.color}
        emissiveIntensity={emissiveInt}
        roughness={0.2}
        metalness={0.1}
        transmission={0.1}
        thickness={1.0}
        clearcoat={1.0}
      />
      
      {hovered && (
        <Html distanceFactor={12} zIndexRange={[100, 0]}>
          <div className="glass-panel text-gallery-charcoal p-3 w-48 rounded-lg shadow-2xl transition-all duration-300 scale-100 opacity-100 bg-white/95 pointer-events-none">
            <div className="flex justify-between items-center mb-1 border-b border-gallery-grey pb-1">
               <span className="text-[9px] uppercase tracking-widest text-gallery-charcoal font-bold opacity-60">{data.post.category}</span>
               <div className="w-2 h-2 rounded-full" style={{backgroundColor: data.color}}></div>
            </div>
            <p className="text-xs font-serif italic text-gallery-charcoal leading-tight">"{data.post.originalText.substring(0, 50)}{data.post.originalText.length>50?'...':''}"</p>
          </div>
        </Html>
      )}
    </mesh>
  );
};