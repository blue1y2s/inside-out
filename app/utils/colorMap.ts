import { PostCategory } from '../types';

/**
 * Emotion-Based Color System
 * Maps post categories and sentiment to emotion colors from the movie
 */

const EMOTION_COLORS = {
  joy: '#FFD700',        // Golden yellow - Achievement, positive daily moments
  sadness: '#4A90E2',    // Deep blue - Reflection, melancholy
  anxiety: '#FF6B35',    // Vibrant orange - Rants, high intensity worry
  envy: '#00D9B5',       // Cyan-green - Comparison, aspiration
  embarrassment: '#FF9ECD', // Soft pink - Vulnerability, self-consciousness
  anger: '#E63946',      // Intense red - Strong negative emotions
  fear: '#9B59B6',       // Purple - Uncertainty, caution
  neutral: '#A8B5C7'     // Soft grey-blue - Neutral/other
};

export function getSphereColor(sentimentScore: number, category?: PostCategory): string {
  // Category-based emotion mapping (emotional color palette)

  // "Rant" → Anxiety (nervous energy, tension)
  if (category === 'rant') return EMOTION_COLORS.anxiety;

  // "Achievement" → Joy (optimistic, energetic)
  if (category === 'achievement') return EMOTION_COLORS.joy;

  // "Reflection" → Sadness (introspective, calm)
  if (category === 'reflection') return EMOTION_COLORS.sadness;

  // "Daily" → Joy or Embarrassment (depending on sentiment)
  if (category === 'daily') {
    return sentimentScore > 0 ? EMOTION_COLORS.joy : EMOTION_COLORS.embarrassment;
  }

  // "Relationship" → varies by sentiment
  if (category === 'relationship') {
    if (sentimentScore > 0.3) return EMOTION_COLORS.joy;
    if (sentimentScore < -0.3) return EMOTION_COLORS.sadness;
    return EMOTION_COLORS.embarrassment;
  }

  // Sentiment-based fallback for uncategorized posts
  if (sentimentScore > 0.5) return EMOTION_COLORS.joy;
  if (sentimentScore > 0.1) return EMOTION_COLORS.envy;
  if (sentimentScore < -0.5) return EMOTION_COLORS.sadness;
  if (sentimentScore < -0.2) return EMOTION_COLORS.anxiety;

  return EMOTION_COLORS.neutral;
}

export function getAvatarBaseColor(sentimentScore: number): string {
  // Deprecated, but keeping valid return for safety
  return EMOTION_COLORS.neutral;
}

// Export emotion colors for use in other components
export { EMOTION_COLORS };