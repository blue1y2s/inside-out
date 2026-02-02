import { AnalyzedPost, MemorySphere } from '../types';
import { getSphereColor } from './colorMap';
import { Vector3 } from 'three';

function randomPointInSphere(center: Vector3, radius: number): [number, number, number] {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return [
    center.x + r * sinPhi * Math.cos(theta),
    center.y + r * sinPhi * Math.sin(theta),
    center.z + r * Math.cos(phi)
  ];
}

function randomPointInBox(center: Vector3, width: number, height: number, depth: number): [number, number, number] {
  return [
    center.x + (Math.random() - 0.5) * width,
    center.y + (Math.random() - 0.5) * height,
    center.z + (Math.random() - 0.5) * depth
  ];
}

function randomPointOnLine(start: Vector3, end: Vector3, jitter: number): [number, number, number] {
  const t = Math.random();
  const px = start.x + (end.x - start.x) * t;
  const py = start.y + (end.y - start.y) * t;
  const pz = start.z + (end.z - start.z) * t;
  
  return [
    px + (Math.random() - 0.5) * jitter,
    py + (Math.random() - 0.5) * jitter,
    pz + (Math.random() - 0.5) * jitter
  ];
}

function getHumanoidPosition(post: AnalyzedPost, index: number): [number, number, number] {
  const { category } = post;
  
  // 1. HEAD (Thinking): Reflection, Daily, or any 'Mind' related tasks
  // Center: (0, 1.6, 0), Radius: 0.25
  if (category === 'reflection' || category === 'daily') {
     return randomPointInSphere(new Vector3(0, 1.6, 0), 0.25);
  }

  // 2. HEART/TORSO (Feeling): Relationship, Rant, High Emotion
  // Box Volume: Center (0, 1.1, 0), W: 0.45, H: 0.6, D: 0.3
  if (category === 'relationship' || category === 'rant') {
     return randomPointInBox(new Vector3(0, 1.15, 0), 0.45, 0.6, 0.3);
  }

  // 3. LIMBS (Action): Achievement
  // Arms and Legs
  if (category === 'achievement') {
     const limbType = index % 4; // Distribute evenly among limbs
     
     // Left Arm
     if (limbType === 0) return randomPointOnLine(new Vector3(-0.25, 1.4, 0), new Vector3(-0.7, 0.9, 0.2), 0.15);
     // Right Arm
     if (limbType === 1) return randomPointOnLine(new Vector3(0.25, 1.4, 0), new Vector3(0.7, 0.9, 0.2), 0.15);
     // Left Leg
     if (limbType === 2) return randomPointOnLine(new Vector3(-0.15, 0.8, 0), new Vector3(-0.2, 0.0, 0), 0.15);
     // Right Leg
     if (limbType === 3) return randomPointOnLine(new Vector3(0.15, 0.8, 0), new Vector3(0.2, 0.0, 0), 0.15);
  }

  // 4. FALLBACK: Fill the body structure randomly if category is 'other' or undefined
  const fallbackZone = Math.random();
  if (fallbackZone < 0.2) return randomPointInSphere(new Vector3(0, 1.6, 0), 0.25); // Head
  if (fallbackZone < 0.6) return randomPointInBox(new Vector3(0, 1.15, 0), 0.45, 0.6, 0.3); // Torso
  // Legs fallback
  return randomPointOnLine(new Vector3(0, 0.8, 0), new Vector3((Math.random()-0.5)*0.5, 0, 0), 0.3);
}

export function layoutMemorySpheres(posts: AnalyzedPost[]): MemorySphere[] {
  const count = posts.length;
  
  return posts.map((post, i) => {
    // --- Timeline Layout ---
    const tX = (i - count / 2) * 0.6;
    const tY = post.sentimentScore * 3;
    const tZ = Math.cos(i * 0.2) * 2 - 2; 

    // --- Humanoid Layout ---
    const humanoidPos = getHumanoidPosition(post, i);

    const radius = 0.15 + (post.intensity / 5) * 0.25;

    return {
      id: post.id,
      post,
      radius,
      color: getSphereColor(post.sentimentScore, post.category),
      timelinePosition: [tX, tY, tZ],
      humanoidPosition: humanoidPos
    };
  });
}