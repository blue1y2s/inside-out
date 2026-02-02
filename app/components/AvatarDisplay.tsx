import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { MemorySphere, AvatarStats } from '../types';
import { getSphereColor, getAvatarBaseColor } from '../utils/colorMap';

interface AvatarDisplayProps {
  spheres: MemorySphere[];
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ spheres }) => {
  const groupRef = useRef<Group>(null);

  // Calculate statistics
  const stats: AvatarStats = useMemo(() => {
    if (spheres.length === 0) return { avgSentiment: 0, avgIntensity: 0, dominantCategory: 'other', postCount: 0 };
    
    const totalSentiment = spheres.reduce((sum, s) => sum + s.post.sentimentScore, 0);
    const totalIntensity = spheres.reduce((sum, s) => sum + s.post.intensity, 0);
    
    return {
      avgSentiment: totalSentiment / spheres.length,
      avgIntensity: totalIntensity / spheres.length,
      dominantCategory: 'other', // Simplified for MVP
      postCount: spheres.length
    };
  }, [spheres]);

  const mainColor = getSphereColor(stats.avgSentiment);
  const bodyColor = getAvatarBaseColor(stats.avgSentiment);
  
  const isNeon = mainColor === '#CCFF00';

  // Animation loop for breathing/floating
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Vertical float
    const hoverY = Math.sin(t) * 0.1;
    groupRef.current.position.y = (stats.avgSentiment * 0.5) + hoverY; // Higher sentiment = float higher

    // Subtle rotation
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
  });

  if (spheres.length === 0) return null;

  // Pose Calculations
  const isHappy = stats.avgSentiment > 0.2;
  const isSad = stats.avgSentiment < -0.2;

  // Head Rotation
  const headRotationX = isSad ? 0.3 : (isHappy ? -0.1 : 0);
  
  return (
    <group ref={groupRef} position={[0, 0, 2]}>
      {/* Head */}
      <mesh position={[0, 1.4, 0]} rotation={[headRotationX, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshPhysicalMaterial 
            color={mainColor} 
            emissive={mainColor} 
            emissiveIntensity={isNeon ? 0.6 : 0.1} 
            roughness={0.2}
            clearcoat={1.0}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.2, 32]} />
        <meshPhysicalMaterial 
            color={bodyColor} 
            roughness={0.4} 
            clearcoat={0.5}
        />
      </mesh>

      {/* Arms - Left */}
      <mesh 
        position={[-0.35, 0.8, 0]} 
        rotation={[0, 0, isSad ? -0.2 : (isHappy ? 0.5 : 0.2)]}
      >
        <capsuleGeometry args={[0.08, 0.8, 4, 8]} />
        <meshPhysicalMaterial color={bodyColor} roughness={0.4} />
      </mesh>

      {/* Arms - Right */}
      <mesh 
        position={[0.35, 0.8, 0]} 
        rotation={[0, 0, isSad ? 0.2 : (isHappy ? -0.5 : -0.2)]}
      >
        <capsuleGeometry args={[0.08, 0.8, 4, 8]} />
        <meshPhysicalMaterial color={bodyColor} roughness={0.4} />
      </mesh>

      {/* Base/Shadow Indicator */}
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial color={mainColor} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};