import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, MeshDistortMaterial } from '@react-three/drei';
import { Mesh, Vector3, Color } from 'three';
import { MemorySphere } from '../types';

interface MemorySphereMeshProps {
  data: MemorySphere;
  mode: 'timeline' | 'humanoid' | 'castle';
}

/**
 * MemorySphereMesh: A high-fidelity memory orb with emotion-based coloring.
 * Uses a glassy outer shell and a distorted, glowing inner core to simulate 
 * flowing "memory energy".
 */
export const MemorySphereMesh: React.FC<MemorySphereMeshProps> = ({ data, mode }) => {
  const outerShellRef = useRef<Mesh>(null);
  const primaryCoreRef = useRef<Mesh>(null);
  const secondaryCoreRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Random phase for independent movement
  const phase = useRef(Math.random() * 100);

  // Pre-calculate positions
  const timelineVec = useMemo(() => new Vector3(...data.timelinePosition), [data.timelinePosition]);
  const humanoidVec = useMemo(() => new Vector3(...data.humanoidPosition), [data.humanoidPosition]);
  const castleVec = useMemo(() => new Vector3(...(data.castlePosition || data.timelinePosition)), [data.castlePosition, data.timelinePosition]);

  // Vibrant colors for the core
  const primaryColor = useMemo(() => new Color(data.color), [data.color]);
  const secondaryColor = useMemo(() => {
    if (data.hasMixedEmotions && data.secondaryColor) {
      return new Color(data.secondaryColor);
    }
    return null;
  }, [data.secondaryColor, data.hasMixedEmotions]);

  useFrame((state) => {
    if (!outerShellRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Position Interpolation
    let targetBase = timelineVec;
    if (mode === 'humanoid') targetBase = humanoidVec;
    if (mode === 'castle') targetBase = castleVec;

    const floatAmp = mode === 'timeline' ? 0.2 : 0.05;
    const floatFreq = mode === 'timeline' ? 1.0 : 2.0;

    const floatY = Math.sin(time * floatFreq + phase.current) * floatAmp;
    const floatX = Math.cos(time * 0.5 + phase.current) * (floatAmp * 0.5);

    const targetWithFloat = targetBase.clone().add(new Vector3(floatX, floatY, 0));
    const lerpSpeed = mode === 'timeline' ? 0.05 : 0.1;

    outerShellRef.current.position.lerp(targetWithFloat, lerpSpeed);

    // Smooth group rotation
    const rotSpeed = 0.2 + (hovered ? 0.3 : 0);
    outerShellRef.current.rotation.y = time * rotSpeed;
    outerShellRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;

    // 2. Scaling
    const baseScale = mode === 'humanoid' ? 0.8 : 1.0;
    const targetScale = (hovered ? 1.5 : 1.0) * baseScale;
    outerShellRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);

    // Sync cores with shell
    if (primaryCoreRef.current) {
      primaryCoreRef.current.position.copy(outerShellRef.current.position);
      primaryCoreRef.current.rotation.copy(outerShellRef.current.rotation);
      primaryCoreRef.current.scale.copy(outerShellRef.current.scale);
    }
    if (secondaryCoreRef.current) {
      secondaryCoreRef.current.position.copy(outerShellRef.current.position);
      secondaryCoreRef.current.rotation.copy(outerShellRef.current.rotation);
      secondaryCoreRef.current.rotation.x += Math.PI; // Invert to see different distortion pattern
      secondaryCoreRef.current.scale.copy(outerShellRef.current.scale);
    }
  });

  const emissiveIntensity = hovered ? 4.0 : 2.5;

  return (
    <group>
      {/* 
          1. INNER CORE(S): Larger and more solid to provide the base "filling" color.
      */}
      <mesh ref={primaryCoreRef} position={data.timelinePosition}>
        <sphereGeometry args={[data.radius * 0.8, 32, 32]} />
        <MeshDistortMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={1.8} // Stronger glow for bloom
          distort={0.3}
          speed={2}
          roughness={0.4}
        />
      </mesh>

      {secondaryColor && (
        <mesh ref={secondaryCoreRef} position={data.timelinePosition}>
          <sphereGeometry args={[data.radius * 0.75, 32, 32]} />
          <MeshDistortMaterial
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={1.4} // Stronger glow for bloom
            distort={0.4}
            speed={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* 
          2. OUTER SHELL: Now tinted with the emotion color and less transparent
          to creates a "milky marble" or "frosted glass" look.
      */}
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
          color={primaryColor}
          transparent
          opacity={0.9}
          transmission={0.4}
          roughness={0.35} // Frosted glass look
          metalness={0.1}
          clearcoat={0.7} // Reduced from 1.0 for less plastic shine
          clearcoatRoughness={0.1}
          ior={1.5}
          thickness={data.radius * 2}
          attenuationColor={primaryColor}
          attenuationDistance={data.radius * 0.5} // More depth perception
        />

        {hovered && (
          <Html distanceFactor={12} zIndexRange={[100, 0]}>
            <div className="glass-panel text-neutral-charcoal p-4 w-60 rounded-xl shadow-2xl bg-white/95 pointer-events-none backdrop-blur-md border border-white/20">
              <div className="flex justify-between items-center mb-2 border-b border-neutral-border pb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">
                  {data.post.category}
                </span>
                <div className="flex gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: data.color, boxShadow: `0 0 10px ${data.color}` }} />
                  {data.hasMixedEmotions && data.secondaryColor && (
                    <div className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: data.secondaryColor, boxShadow: `0 0 10px ${data.secondaryColor}` }} />
                  )}
                </div>
              </div>
              <p className="text-xs font-serif italic leading-relaxed text-neutral-charcoal">
                "{data.post.originalText.substring(0, 100)}{data.post.originalText.length > 100 ? '...' : ''}"
              </p>
            </div>
          </Html>
        )}
      </mesh>

      {/* 
          3. HALO/BLOOM: Extra soft glow around the sphere.
      */}
      <mesh position={data.timelinePosition}>
        <sphereGeometry args={[data.radius * 1.3, 32, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={hovered ? 0.15 : 0.08}
          depthWrite={false}
          blending={2} // Additive blending
        />
      </mesh>
    </group>
  );
};