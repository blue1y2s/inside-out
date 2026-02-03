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
  const outerShellRef = useRef<Mesh>(null);
  const primaryCoreRef = useRef<Mesh>(null);
  const secondaryCoreRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Random phase for independent organic movement
  const phase = useRef(Math.random() * 100);

  // Pre-calculate vectors
  const timelineVec = useMemo(() => new Vector3(...data.timelinePosition), [data.timelinePosition]);
  const humanoidVec = useMemo(() => new Vector3(...data.humanoidPosition), [data.humanoidPosition]);
  const castleVec = useMemo(() => new Vector3(...(data.castlePosition || data.timelinePosition)), [data.castlePosition, data.timelinePosition]);

  // Detect if this memory has mixed emotions from data
  const hasMixedEmotions = data.hasMixedEmotions || false;

  // Primary and secondary colors
  const primaryColor = useMemo(() => new Color(data.color), [data.color]);

  // Use secondary color from data if available, otherwise use a complementary color
  const secondaryColor = useMemo(() => {
    if (!hasMixedEmotions) return primaryColor;
    if (data.secondaryColor) return new Color(data.secondaryColor);

    // Fallback: generate complementary color
    const colorMap: Record<string, string> = {
      '#FFD700': '#4A90E2', // Joy + Sadness
      '#4A90E2': '#FFD700', // Sadness + Joy
      '#FF6B35': '#9B59B6', // Anxiety + Fear
      '#00D9B5': '#FFD700', // Envy + Joy
      '#FF9ECD': '#9B59B6', // Embarrassment + Fear
      '#E63946': '#FFD700', // Anger + Joy
      '#9B59B6': '#4A90E2', // Fear + Sadness
    };

    return new Color(colorMap[data.color] || '#4A90E2');
  }, [data.color, data.secondaryColor, hasMixedEmotions]);

  useFrame((state) => {
    if (!outerShellRef.current || !primaryCoreRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Determine Target Position
    let targetBase = timelineVec;
    if (mode === 'humanoid') targetBase = humanoidVec;
    if (mode === 'castle') targetBase = castleVec;

    // 2. Organic Float
    const floatAmp = mode === 'timeline' ? 0.2 : 0.05;
    const floatFreq = mode === 'timeline' ? 1.0 : 2.0;

    const floatY = Math.sin(time * floatFreq + phase.current) * floatAmp;
    const floatX = Math.cos(time * 0.5 + phase.current) * (floatAmp * 0.5);

    // 3. Interpolation
    const targetWithFloat = targetBase.clone().add(new Vector3(floatX, floatY, 0));
    const lerpSpeed = mode === 'timeline' ? 0.05 : 0.08;

    // Update outer shell
    outerShellRef.current.position.lerp(targetWithFloat, lerpSpeed);

    // Gentle rotation
    outerShellRef.current.rotation.x = time * 0.15;
    outerShellRef.current.rotation.z = time * 0.1;

    // 4. Scale
    const baseScale = mode === 'humanoid' ? 0.8 : 1.0;
    const targetScale = (hovered ? 1.4 : 1.0) * baseScale;
    outerShellRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.1);

    // Sync primary core with outer shell
    primaryCoreRef.current.position.copy(outerShellRef.current.position);
    primaryCoreRef.current.rotation.copy(outerShellRef.current.rotation);
    primaryCoreRef.current.scale.copy(outerShellRef.current.scale);

    // Position offset for mixed emotions (creates the overlapping venn diagram effect)
    if (hasMixedEmotions && secondaryCoreRef.current) {
      secondaryCoreRef.current.position.copy(outerShellRef.current.position);

      // Offset secondary core slightly to create overlap
      const offsetAmount = data.radius * 0.25;
      secondaryCoreRef.current.position.x += Math.cos(time * 0.3) * offsetAmount;
      secondaryCoreRef.current.position.z += Math.sin(time * 0.3) * offsetAmount;

      secondaryCoreRef.current.rotation.copy(outerShellRef.current.rotation);
      secondaryCoreRef.current.scale.copy(outerShellRef.current.scale);
    }
  });

  const emissiveIntensity = hovered ? 1.5 : 1.0;

  return (
    <group>
      {/* Primary emotion core */}
      <mesh
        ref={primaryCoreRef}
        position={data.timelinePosition}
        castShadow={false}
        receiveShadow={false}
      >
        <sphereGeometry args={[data.radius * 0.75, 32, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={hasMixedEmotions ? 0.7 : 0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Secondary emotion core (only for mixed emotions) */}
      {hasMixedEmotions && (
        <mesh
          ref={secondaryCoreRef}
          position={data.timelinePosition}
          castShadow={false}
          receiveShadow={false}
        >
          <sphereGeometry args={[data.radius * 0.75, 32, 32]} />
          <meshBasicMaterial
            color={secondaryColor}
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Outer glass shell - Inside Out style */}
      <mesh
        ref={outerShellRef}
        position={data.timelinePosition}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[data.radius, 64, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive={primaryColor}
          emissiveIntensity={emissiveIntensity * 0.3}

          // Glass-like properties
          transparent
          opacity={0.15}
          transmission={0.95}
          thickness={0.3}
          roughness={0.05}
          metalness={0.0}

          // Reflective coating
          clearcoat={1.0}
          clearcoatRoughness={0.05}

          // Refraction
          ior={1.45}

          // Subtle iridescence for that magical look
          iridescence={0.2}
          iridescenceIOR={1.3}
        />

        {hovered && (
          <Html distanceFactor={12} zIndexRange={[100, 0]}>
            <div className="glass-panel text-neutral-charcoal p-3 w-48 rounded-lg shadow-2xl transition-all duration-300 scale-100 opacity-100 bg-white/95 pointer-events-none">
              <div className="flex justify-between items-center mb-1 border-b border-neutral-border pb-1">
                <span className="text-[9px] uppercase tracking-widest text-neutral-charcoal font-bold opacity-60">{data.post.category}</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color, boxShadow: `0 0 6px ${data.color}` }}></div>
                  {hasMixedEmotions && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor.getStyle(), boxShadow: `0 0 6px ${secondaryColor.getStyle()}` }}></div>
                  )}
                </div>
              </div>
              <p className="text-xs font-serif italic text-neutral-charcoal leading-tight">"{data.post.originalText.substring(0, 50)}{data.post.originalText.length > 50 ? '...' : ''}"</p>
            </div>
          </Html>
        )}
      </mesh>

      {/* Outer glow halo effect - softer and more diffuse */}
      {mode !== 'humanoid' && (
        <mesh
          position={data.timelinePosition}
          castShadow={false}
          receiveShadow={false}
        >
          <sphereGeometry args={[data.radius * 1.2, 32, 32]} />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={hovered ? 0.12 : 0.06}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};