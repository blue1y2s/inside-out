import { AnalyzedPost, PersonaDimensions, TargetPersona } from '../types';
import { countHedgingWords, countSelfDeprecation } from './sentimentRules';

/**
 * Heuristic function to map a collection of posts to 5 personality dimensions.
 * Returns values between 0 and 1.
 */
export function computePersonaDimensions(posts: AnalyzedPost[]): PersonaDimensions {
  if (posts.length === 0) {
    return { extraversion: 0.5, emotionality: 0.5, warmth: 0.5, conscientiousness: 0.5, confidence: 0.5 };
  }

  const count = posts.length;
  
  // 1. Extraversion: Relationship posts + exclamation marks + long texts
  const relationshipCount = posts.filter(p => p.category === 'relationship').length;
  const avgIntensity = posts.reduce((sum, p) => sum + p.intensity, 0) / count;
  const extraversionRaw = (relationshipCount / count) * 0.5 + (avgIntensity / 5) * 0.5;

  // 2. Emotionality: Variance of sentiment + count of high intensity rant/love
  const sentiments = posts.map(p => p.sentimentScore);
  const avgSent = sentiments.reduce((a, b) => a + b, 0) / count;
  const variance = sentiments.reduce((sum, val) => sum + Math.pow(val - avgSent, 2), 0) / count;
  const emotionalityRaw = Math.min(1, Math.sqrt(variance) * 2 + (avgIntensity > 3 ? 0.2 : 0));

  // 3. Warmth: Positive sentiment + Relationship - Rant
  const positiveRatio = posts.filter(p => p.sentimentScore > 0.2).length / count;
  const rantRatio = posts.filter(p => p.category === 'rant').length / count;
  const warmthRaw = Math.max(0, positiveRatio * 0.7 + (relationshipCount / count) * 0.3 - rantRatio * 0.4);

  // 4. Conscientiousness: Achievement + Reflection + Text Structure (approximated by length consistency)
  const achRefCount = posts.filter(p => ['achievement', 'reflection'].includes(p.category)).length;
  const conscientiousnessRaw = (achRefCount / count);

  // 5. Confidence: Achievement + low hedging + low self-deprecation
  const hedgingCount = posts.reduce((sum, p) => sum + countHedgingWords(p.originalText), 0);
  const selfDepCount = posts.reduce((sum, p) => sum + countSelfDeprecation(p.originalText), 0);
  // Fewer hedging/deprecation means higher confidence
  const confidenceRaw = 0.5 + (posts.filter(p => p.category === 'achievement').length / count) * 0.3 
                        - (hedgingCount / count) * 0.1 
                        - (selfDepCount / count) * 0.2;

  return {
    extraversion: clamp(extraversionRaw),
    emotionality: clamp(emotionalityRaw),
    warmth: clamp(warmthRaw),
    conscientiousness: clamp(conscientiousnessRaw),
    confidence: clamp(confidenceRaw),
  };
}

function clamp(val: number): number {
  return Math.max(0, Math.min(1, val));
}

export function getDefaultTargetPersonas(): TargetPersona[] {
  return [
    {
      id: 'elite',
      name: 'The Professional Elite',
      description: 'Disciplined, achievement-oriented, confident, and emotionally controlled.',
      colorHint: '#9BB4C3', // Focus / Rational Blue
      dimensions: {
        extraversion: 0.6,
        emotionality: 0.2,
        warmth: 0.4,
        conscientiousness: 0.9,
        confidence: 0.9,
      }
    },
    {
      id: 'warm',
      name: 'The Warm Connector',
      description: 'Empathetic, relationship-focused, open, and highly supportive.',
      colorHint: '#8FB6A5', // Calm / Green
      dimensions: {
        extraversion: 0.7,
        emotionality: 0.6,
        warmth: 0.9,
        conscientiousness: 0.5,
        confidence: 0.6,
      }
    },
    {
      id: 'observer',
      name: 'The Calm Observer',
      description: 'Reflective, low-profile, analytical, and emotionally steady.',
      colorHint: '#D3D4CE', // Structural Grey
      dimensions: {
        extraversion: 0.2,
        emotionality: 0.3,
        warmth: 0.5,
        conscientiousness: 0.7,
        confidence: 0.6,
      }
    },
    {
      id: 'creative',
      name: 'The Creative Spark',
      description: 'Expressive, high energy, emotionally varying, and authentic.',
      colorHint: '#E4CD8A', // Attention / Yellow
      dimensions: {
        extraversion: 0.6,
        emotionality: 0.8,
        warmth: 0.6,
        conscientiousness: 0.4,
        confidence: 0.7,
      }
    }
  ];
}

export function computeDimensionDiff(current: PersonaDimensions, target: PersonaDimensions): Record<keyof PersonaDimensions, number> {
  return {
    extraversion: target.extraversion - current.extraversion,
    emotionality: target.emotionality - current.emotionality,
    warmth: target.warmth - current.warmth,
    conscientiousness: target.conscientiousness - current.conscientiousness,
    confidence: target.confidence - current.confidence,
  };
}