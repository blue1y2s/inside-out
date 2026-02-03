import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh, Vector3, Color } from 'three';
import { MemorySphere } from '../types';

interface MemorySphereMeshProps {
  data: MemorySphere;
  mode: 'timeline' | 'humanoid' | 'castle';
}

export const MemorySphereMesh: React.FC<MemorySphereMeshProps> = ({ data, mode }) => {
  const meshRef = useRef<Mesh>(null);
  const innerGlowRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Random phase for independent organic movement
  const phase = useRef(Math.random() * 100);

  // Pre-calculate vectors
  const timelineVec = useMemo(() => new Vector3(...data.timelinePosition), [data.timelinePosition]);
  const humanoidVec = useMemo(() => new Vector3(...data.humanoidPosition), [data.humanoidPosition]);
  const castleVec = useMemo(() => new Vector3(...(data.castlePosition || data.timelinePosition)), [data.castlePosition, data.timelinePosition]);

  // Parse multiple emotions from color if it contains gradient info
  // For now, we'll use the primary color but make it more vibrant and glowy
  const primaryColor = useMemo(() => new Color(data.color), [data.color]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Determine Target Position
    let targetBase = timelineVec;
    if (mode === 'humanoid') targetBase = humanoidVec;
    if (mode === 'castle') targetBase = castleVec;

    // 2. Organic Float Intensity
    const floatAmp = mode === 'timeline' ? 0.2 : 0.05;
    const floatFreq = mode === 'timeline' ? 1.0 : 2.0;

    const floatY = Math.sin(time * floatFreq + phase.current) * floatAmp;
    const floatX = Math.cos(time * 0.5 + phase.current) * (floatAmp * 0.5);

    // 3. Interpolation (Lerp)
    const currentPos = meshRef.current.position;
    const targetWithFloat = targetBase.clone().add(new Vector3(floatX, floatY, 0));

    const lerpSpeed = mode === 'timeline' ? 0.05 : 0.08;
    currentPos.lerp(targetWithFloat, lerpSpeed);

    // 4. Scale & Rotation
    const baseScale = mode === 'humanoid' ? 0.8 : 1.0;
    const targetScale = (hovered ? 1.4 : 1.0) * baseScale;

    // Gentle rotation for organic feel
    meshRef.current.rotation.x = time * 0.15;
    meshRef.current.rotation.z = time * 0.1;

    meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.1);

    // Sync inner glow with outer sphere
    if (innerGlowRef.current) {
      innerGlowRef.current.position.copy(meshRef.current.position);
      innerGlowRef.current.rotation.copy(meshRef.current.rotation);
      innerGlowRef.current.scale.copy(meshRef.current.scale);
    }
  });

  // Enhanced emissive for glowing effect
  const emissiveIntensity = hovered ? 1.2 : 0.8;
  const glowIntensity = hovered ? 2.0 : 1.5;

  return (
    <group>
      {/* Inner glowing core - saturated color */}
      <mesh
        ref={innerGlowRef}
        position={data.timelinePosition}
        castShadow={false}
        receiveShadow={false}
      >
        <sphereGeometry args={[data.radius * 0.85, 32, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glass shell - Inside Out style */}
      <mesh
        ref={meshRef}
        position={data.timelinePosition}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[data.radius, 64, 64]} />
        <meshPhysicalMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={emissiveIntensity}

          // Glass-like properties
          transparent
          opacity={0.3}
          transmission={0.9}
          thickness={0.5}
          roughness={0.05}
          metalness={0.0}

          // Reflective coating
          clearcoat={1.0}
          clearcoatRoughness={0.1}

          // Refraction
          ior={1.5}

          // Subtle iridescence
          iridescence={0.3}
          iridescenceIOR={1.3}

          // Allow light to pass through
          side={2} // DoubleSide
        />

        {hovered && (
          <Html distanceFactor={12} zIndexRange={[100, 0]}>
            <div className="glass-panel text-neutral-charcoal p-3 w-48 rounded-lg shadow-2xl transition-all duration-300 scale-100 opacity-100 bg-white/95 pointer-events-none">
              <div className="flex justify-between items-center mb-1 border-b border-neutral-border pb-1">
                <span className="text-[9px] uppercase tracking-widest text-neutral-charcoal font-bold opacity-60">{data.post.category}</span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color, boxShadow: `0 0 8px ${data.color}` }}></div>
              </div>
              <p className="text-xs font-serif italic text-neutral-charcoal leading-tight">"{data.post.originalText.substring(0, 50)}{data.post.originalText.length > 50 ? '...' : ''}"</p>
            </div>
          </Html>
        )}
      </mesh>

      {/* Outer glow halo effect */}
      {mode !== 'humanoid' && (
        <mesh
          position={data.timelinePosition}
          castShadow={false}
          receiveShadow={false}
        >
          <sphereGeometry args={[data.radius * 1.15, 32, 32]} />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={hovered ? 0.15 : 0.08}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};