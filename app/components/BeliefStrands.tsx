import React, { useMemo } from 'react';
import { MemorySphere } from '../types';
import * as THREE from 'three';
import { extend, ReactThreeFiber } from '@react-three/fiber';
import { Line } from '@react-three/drei';

interface BeliefStrandsProps {
    spheres: MemorySphere[];
    visible: boolean;
}

export const BeliefStrands: React.FC<BeliefStrandsProps> = ({ spheres, visible }) => {
    // Filter for core memories (those at the bottom pool)
    // We identify them by their position (y < -8 approx)
    const strands = useMemo(() => {
        if (!visible) return [];

        const coreMemories = spheres.filter(s => s.castlePosition[1] < -8);
        const selfMemories = spheres.filter(s => s.castlePosition[1] > 4);

        if (coreMemories.length === 0 || selfMemories.length === 0) return [];

        // Calculate center of the "Self"
        const selfCenter = new THREE.Vector3(0, 8, 0);

        return coreMemories.map(core => {
            const start = new THREE.Vector3(...core.castlePosition);
            // Connect to the center, or to a specific node in the self? 
            // Let's connect to the center for the "main stem" look
            const end = selfCenter.clone();

            // Control points for a curved bezier-like line?
            // For simplicity, let's just do straight lines or simple curve vertices
            const curve = new THREE.QuadraticBezierCurve3(
                start,
                new THREE.Vector3(0, 0, 0), // Control point at center/origin
                end
            );

            return {
                id: core.id,
                color: core.color,
                points: curve.getPoints(20)
            };
        });
    }, [spheres, visible]);

    if (!visible) return null;

    return (
        <group>
            {strands.map((strand, i) => (
                <Line
                    key={strand.id}
                    points={strand.points}
                    color={strand.color}
                    lineWidth={1}
                    opacity={0.4}
                    transparent
                    vertexColors={false}
                />
            ))}
            {/* Central Pillar Glow - Glowing Gradient Blue */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.5, 4, 20]} />
                <meshBasicMaterial
                    color="#4A90E2"
                    opacity={0.15}
                    transparent
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
            {/* Inner brighter blue core for gradient effect */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.3, 2.5, 20]} />
                <meshBasicMaterial
                    color="#6CB4EE"
                    opacity={0.25}
                    transparent
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};
