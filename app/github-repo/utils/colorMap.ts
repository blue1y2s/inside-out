import { PostCategory } from '../types';

export function getSphereColor(sentimentScore: number, category?: PostCategory): string {
  // "The Fire" - Rant / High Intensity
  if (category === 'rant') return '#FFFF00'; // Safety Yellow
  
  // "The Spark" - Achievement / Joy / Intense Action
  if (category === 'achievement') return '#FF0055'; // Electric Crimson
  
  // "The Stone" - Reflection / Sadness
  if (category === 'reflection') return '#2E2EFF'; // Deep Neon Blue

  // "The Growth" - Daily / Routine
  if (category === 'daily') return '#CCFF00'; // Neon Lime

  // "The Blood" - Relationship (often intense feeling)
  if (category === 'relationship') return '#FF0055'; // Electric Crimson (or Magenta if distinct, but using Crimson for intense feeling per request grouping)

  // Default Sentiment Fallbacks
  if (sentimentScore > 0.4) return '#FF0055'; // Intense Joy
  if (sentimentScore > 0.1) return '#CCFF00'; // Mild Positive / Growth
  if (sentimentScore < -0.2) return '#2E2EFF'; // Sadness / Deep Reflection
  
  return '#D1D5DB'; // Cool Grey (Neutral)
}

export function getAvatarBaseColor(sentimentScore: number): string {
  // Deprecated, but keeping valid return for safety
  return '#D1D5DB';
}