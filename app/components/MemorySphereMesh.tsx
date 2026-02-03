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
  const innerGlowRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Random phase for independent organic movement
  const phase = useRef(Math.random() * 100);

  // Pre-calculate vectors
  const timelineVec = useMemo(() => new Vector3(...data.timelinePosition), [data.timelinePosition]);
  const humanoidVec = useMemo(() => new Vector3(...data.humanoidPosition), [data.humanoidPosition]);
  const castleVec = useMemo(() => new Vector3(...(data.castlePosition || data.timelinePosition)), [data.castlePosition, data.timelinePosition]);

  // Primary color
  const primaryColor = useMemo(() => new Color(data.color), [data.color]);

  // Secondary color for gradient (if mixed emotions)
  const secondaryColor = useMemo(() => {
    if (data.hasMixedEmotions && data.secondaryColor) {
      return new Color(data.secondaryColor);
    }
    // Create a slightly shifted version of primary color for depth
    const hsv = primaryColor.clone();
    hsv.offsetHSL(0.05, 0.1, -0.1); // Slight hue shift, more saturation, darker
    return hsv;
  }, [data.color, data.hasMixedEmotions, data.secondaryColor, primaryColor]);

  useFrame((state) => {
    if (!outerShellRef.current || !innerGlowRef.current) return;
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

    // Gentle rotation for organic feel
    outerShellRef.current.rotation.x = time * 0.15;
    outerShellRef.current.rotation.z = time * 0.1;

    // 4. Scale
    const baseScale = mode === 'humanoid' ? 0.8 : 1.0;
    const targetScale = (hovered ? 1.4 : 1.0) * baseScale;
    outerShellRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.1);

    // Sync inner glow with outer shell
    innerGlowRef.current.position.copy(outerShellRef.current.position);
    innerGlowRef.current.rotation.copy(outerShellRef.current.rotation);
    innerGlowRef.current.scale.copy(outerShellRef.current.scale);
  });

  // Strong inner glow for Inside Out effect
  const innerGlowIntensity = hovered ? 2.5 : 2.0;
  const outerEmissiveIntensity = hovered ? 0.8 : 0.5;

  return (
    <group>
      {/* Inner glowing core - vibrant saturated color(s) */}
      <mesh
        ref={innerGlowRef}
        position={data.timelinePosition}
        castShadow={false}
        receiveShadow={false}
      >
        <sphereGeometry args={[data.radius * 0.88, 32, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={innerGlowIntensity}
          transparent={false}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Secondary color layer for mixed emotions (creates gradient inside) */}
      {data.hasMixedEmotions && (
        <mesh
          position={data.timelinePosition}
          castShadow={false}
          receiveShadow={false}
        >
          <sphereGeometry args={[data.radius * 0.85, 32, 32]} />
          <meshStandardMaterial
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={innerGlowIntensity * 0.7}
            transparent
            opacity={0.5}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Outer glass shell - Inside Out style (semi-transparent) */}
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
          emissiveIntensity={outerEmissiveIntensity}

          // Glass-like but less transparent
          transparent
          opacity={0.4}
          transmission={0.5}
          thickness={0.8}
          roughness={0.1}
          metalness={0.0}

          // Reflective coating
          clearcoat={1.0}
          clearcoatRoughness={0.1}

          // Refraction
          ior={1.5}

          // Subtle iridescence for magical look
          iridescence={0.3}
          iridescenceIOR={1.4}
        />

        {hovered && (
          <Html distanceFactor={12} zIndexRange={[100, 0]}>
            <div className="glass-panel text-neutral-charcoal p-3 w-52 rounded-lg shadow-2xl transition-all duration-300 scale-100 opacity-100 bg-white/95 pointer-events-none">
              <div className="flex justify-between items-center mb-2 border-b border-neutral-border pb-2">
                <span className="text-[9px] uppercase tracking-widest text-neutral-charcoal font-bold opacity-60">
                  {data.post.category}
                </span>
                <div className="flex gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: data.color,
                      boxShadow: `0 0 8px ${data.color}`
                    }}
                  />
                  {data.hasMixedEmotions && data.secondaryColor && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: data.secondaryColor,
                        boxShadow: `0 0 8px ${data.secondaryColor}`
                      }}
                    />
                  )}
                </div>
              </div>
              <p className="text-xs font-serif italic text-neutral-charcoal leading-tight">
                "{data.post.originalText.substring(0, 80)}{data.post.originalText.length > 80 ? '...' : ''}"
              </p>
              {data.hasMixedEmotions && (
                <div className="mt-2 text-[8px] text-neutral-charcoal/60 uppercase tracking-wide">
                  Mixed Emotions
                </div>
              )}
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