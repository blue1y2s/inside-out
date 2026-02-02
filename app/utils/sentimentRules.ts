import { PostCategory } from '../types';

const POSITIVE_WORDS = ['happy', 'good', 'great', 'love', 'excited', 'proud', 'achieved', 'won', 'success', 'beautiful', 'thanks', 'grateful', 'fun', 'joy', 'smile', 'laugh'];
const NEGATIVE_WORDS = ['sad', 'bad', 'hate', 'angry', 'tired', 'fail', 'stupid', 'annoying', 'hurt', 'cry', 'worst', 'boring', 'stress', 'anxious', 'scared', 'pain'];

const HEDGING_WORDS = ['maybe', 'i think', 'sort of', 'kind of', 'guess', 'probably', 'might', 'just'];
const ABSOLUTE_WORDS = ['always', 'never', 'everyone', 'nobody', 'totally', 'completely', 'forever'];
const SELF_DEPRECATION_WORDS = ['stupid', 'idiot', 'fail', 'useless', 'mess', 'trash', 'dumb', 'clown'];

const CATEGORY_KEYWORDS: Record<PostCategory, string[]> = {
  rant: ['hate', 'annoying', 'stupid', 'worst', 'tired of', 'cant believe', 'angry', 'wtf', 'hell'],
  achievement: ['won', 'finished', 'completed', 'promotion', 'graduated', 'goal', 'finally', 'success'],
  relationship: ['friend', 'mom', 'dad', 'boyfriend', 'girlfriend', 'partner', 'husband', 'wife', 'family', 'parents', 'love', 'miss', 'we ', 'us '],
  reflection: ['think', 'feel', 'wonder', 'maybe', 'realize', 'learned', 'understand', 'mind', 'life'],
  daily: ['today', 'morning', 'coffee', 'gym', 'work', 'lunch', 'dinner', 'slept', 'traffic', 'weather'],
  other: []
};

/**
 * Calculates a sentiment score between -1 and 1
 */
function calculateSentiment(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Basic word count matching
  POSITIVE_WORDS.forEach(word => {
    if (lowerText.includes(word)) score += 0.3;
  });
  NEGATIVE_WORDS.forEach(word => {
    if (lowerText.includes(word)) score -= 0.3;
  });

  // Clamp between -1 and 1
  return Math.max(-1, Math.min(1, score));
}

/**
 * Calculates intensity based on length and punctuation
 */
function calculateIntensity(text: string): number {
  let intensity = 1;
  if (text.length > 50) intensity += 1;
  if (text.length > 100) intensity += 1;
  if (text.includes('!')) intensity += 1;
  if (text.includes('!!')) intensity += 1;
  return Math.min(5, intensity);
}

/**
 * Determines category based on keywords
 */
function determineCategory(text: string): PostCategory {
  const lowerText = text.toLowerCase();
  
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (cat === 'other') continue;
    if (keywords.some(k => lowerText.includes(k))) {
      return cat as PostCategory;
    }
  }
  return 'other'; // Default
}

export function analyzeTextRuleBased(text: string, index: number): {
  sentimentScore: number;
  intensity: number;
  category: PostCategory;
} {
  const sentimentScore = calculateSentiment(text);
  const intensity = calculateIntensity(text);
  const category = determineCategory(text);

  return { sentimentScore, intensity, category };
}

// --- Helpers for Phase 2 Insights ---

export function countHedgingWords(text: string): number {
  return HEDGING_WORDS.filter(w => text.toLowerCase().includes(w)).length;
}

export function countAbsolutes(text: string): number {
  return ABSOLUTE_WORDS.filter(w => text.toLowerCase().includes(w)).length;
}

export function countSelfDeprecation(text: string): number {
  return SELF_DEPRECATION_WORDS.filter(w => text.toLowerCase().includes(w)).length;
}
