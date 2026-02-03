export type PostCategory = 'daily' | 'rant' | 'reflection' | 'achievement' | 'relationship' | 'other';

export interface AnalyzedPost {
  id: string;
  originalText: string;
  sentimentScore: number; // -1 to 1
  intensity: number;      // 1 to 5
  category: PostCategory;
  timestampIndex: number;
}

export interface MemorySphere {
  id: string;
  post: AnalyzedPost;
  radius: number;
  color: string;
  timelinePosition: [number, number, number];
  humanoidPosition: [number, number, number];
}

export interface AvatarStats {
  avgSentiment: number;
  avgIntensity: number;
  dominantCategory: PostCategory;
  postCount: number;
}

// --- Phase 2: Dimensions & Targets ---

export interface PersonaDimensions {
  extraversion: number;      // 0-1: Interaction, external focus
  emotionality: number;      // 0-1: Intensity variance, volatility
  warmth: number;            // 0-1: Positive sentiment, relationship focus
  conscientiousness: number; // 0-1: Structure, reflection, achievement
  confidence: number;        // 0-1: Assertiveness vs hedging/self-deprecation
}

export interface TargetPersona {
  id: string;
  name: string;
  description: string;
  dimensions: PersonaDimensions;
  colorHint: string;
}

// --- Animation Phases ---

export type ScenePhase = 'caged' | 'liberating' | 'input' | 'analyzing' | 'universe';