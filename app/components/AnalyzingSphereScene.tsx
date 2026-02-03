import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, ContactShadows } from '@react-three/drei';
import { Color, Mesh, MeshPhysicalMaterial, Group } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { AnalyzedPost, ScenePhase } from '../types';

interface AnalyzingSphereSceneProps {
  scenePhase: ScenePhase;
  onPhaseChange: (next: ScenePhase) => void;
  posts: AnalyzedPost[];
}

const AnalyzingContent: React.FC<AnalyzingSphereSceneProps> = ({ scenePhase, onPhaseChange, posts }) => {
  const sphereRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshPhysicalMaterial>(null);
  const [elapsed, setElapsed] = useState(0);

  // Hanbaiyu (White Jade) Color Palette
  // Warm, milky white, not harsh clinical white
  const JADE_WHITE = new Color("#F9F9F7");
  const startColor = new Color("#FFFFFF");

  // Text fragments spiraling in
  const fragments = useMemo(() => {
    return posts.slice(0, 15).map((post, i) => {
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
    const progress = Math.min(newTime / (totalDuration * 0.8), 1); // Finish transition a bit early

    if (materialRef.current && sphereRef.current) {
      // 1. Opacity Transition: Transparent -> Solid
      // Starts at 0.1, ends at 1.0 (Solid Jade)
      const currentOpacity = 0.1 + (progress * 0.9);
      materialRef.current.opacity = currentOpacity;

      // 2. Transmission (The key to Jade look): High transmission (glassy) -> Low transmission (Milky/Solid)
      // Starts glass-like (0.8), becomes solid stone-like (0.2)
      materialRef.current.transmission = 0.8 - (progress * 0.6);

      // 3. Roughness: Starts perfect smooth -> becomes slightly organic/satin (Jade texture)
      materialRef.current.roughness = 0.1 + (progress * 0.2);

      // 4. Color: Pure White -> Warm Jade White
      materialRef.current.color.lerpColors(startColor, JADE_WHITE, progress);

      // Rotation & Pulse
      sphereRef.current.rotation.y -= delta * 0.5;
      // Gentle breathing, no crazy distortion
      const pulse = 1 + Math.sin(newTime * 2) * 0.02;
      sphereRef.current.scale.set(pulse, pulse, pulse);
    }

    if (newTime >= totalDuration) {
      onPhaseChange('universe');
    }
  });

  return (
    <>
      <EffectComposer disableNormalPass>
        <Bloom
          luminanceThreshold={0.9} // Only highlights glow
          mipmapBlur
          intensity={0.5} // Subtle luxury glow, not neon
          radius={0.4}
        />
      </EffectComposer>

      <group>
        {/* The "Hanbaiyu" Sphere - Single Mesh */}
        <mesh ref={sphereRef} castShadow receiveShadow>
          <sphereGeometry args={[1.2, 128, 128]} /> {/* High poly for smoothness */}
          <meshPhysicalMaterial
            ref={materialRef}
            transparent={true} // Needed for initial fade in
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.1} // Just a touch of inner light
            roughness={0.1}
            metalness={0.0}
            reflectivity={0.5}
            clearcoat={1.0} // Polymished surface
            clearcoatRoughness={0.1}
            transmission={0.8} // Starts transparent
            thickness={3.0} // Thick volume for raymarching feel
            ior={1.54} // Index of refraction for gemstone/ivory
            attenuationColor="#FFFFFF"
            attenuationDistance={2.0}
          />
        </mesh>

        {/* Soft elegant shadow */}
        <ContactShadows opacity={0.3} scale={8} blur={3} far={2} color="#A0A0A0" />

        {fragments.map((frag) => {
          const activeTime = Math.max(0, elapsed - frag.delay);
          const travelDuration = 1.0;
          const progress = Math.min(1, activeTime / travelDuration);
          const ease = 1 - Math.pow(1 - progress, 4);

          const x = frag.startPos[0] * (1 - ease);
          const y = frag.startPos[1] * (1 - ease);
          const z = frag.startPos[2] * (1 - ease);
          const scale = (1 - ease) * 0.4;
          const opacity = 1 - ease;

          if (progress >= 1) return null;

          return (
            <Text
              key={frag.id}
              position={[x, y, z]}
              scale={[scale, scale, scale]}
              color="#F0F0F0" // Subtle grey text, not stark white
              fillOpacity={opacity * 0.6}
              fontSize={0.3}
              anchorX="center"
              anchorY="middle"
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            >
              {frag.text}
            </Text>
          );
        })}

        {/* Studio Lighting for Jade Texture */}
        <ambientLight intensity={1.0} color="#FFFFFF" />
        <spotLight
          position={[5, 10, 5]}
          intensity={1.0}
          angle={0.5}
          penumbra={1}
          color="#FFEEDD" // Warm distinct light
          castShadow
        />
        <pointLight position={[-5, -2, -5]} intensity={0.5} color="#E0F7FA" /> // Cool rim light to define edge
      </group>
    </>
  );
};

export const AnalyzingSphereScene: React.FC<AnalyzingSphereSceneProps> = (props) => {
  return (
    <div className="w-full h-full relative bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{ alpha: true, antialias: true, toneMappingExposure: 1.2 }}
        shadows
      >
        <AnalyzingContent {...props} />
      </Canvas>
    </div>
  );
};