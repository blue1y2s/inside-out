import { PersonaDimensions } from '../types';
import colorPalette from '../../reference/color_palette.json';

export interface EmotionColor {
    name: string;
    primary: string;
    gradient: string[];
    glow: string;
    description: string;
}

/**
 * Maps personality dimensions to Inside Out emotion colors
 * Based on the personality dimensions: extraversion, emotionality, warmth, conscientiousness, confidence
 */
export function getEmotionFromDimensions(dimensions: PersonaDimensions): EmotionColor {
    const { extraversion, emotionality, warmth, conscientiousness, confidence } = dimensions;

    // Determine dominant emotion based on personality dimensions
    let dominantEmotion = 'joy'; // default

    // High emotionality → Anxiety
    if (emotionality > 0.6) {
        dominantEmotion = 'anxiety';
    }
    // Low extraversion + high emotionality → Sadness
    else if (extraversion < 0.4 && emotionality > 0.4) {
        dominantEmotion = 'sadness';
    }
    // High warmth + high extraversion → Joy
    else if (warmth > 0.6 && extraversion > 0.6) {
        dominantEmotion = 'joy';
    }
    // Low warmth + low confidence → Embarrassment
    else if (warmth < 0.4 && confidence < 0.4) {
        dominantEmotion = 'embarrassment';
    }
    // High conscientiousness + moderate emotionality → Anxiety
    else if (conscientiousness > 0.7 && emotionality > 0.3) {
        dominantEmotion = 'anxiety';
    }
    // Low confidence + high emotionality → Fear
    else if (confidence < 0.3 && emotionality > 0.5) {
        dominantEmotion = 'fear';
    }
    // Moderate all traits → Envy (comparison, aspiration)
    else if (Math.abs(extraversion - 0.5) < 0.2 && Math.abs(warmth - 0.5) < 0.2) {
        dominantEmotion = 'envy';
    }

    return colorPalette.emotions[dominantEmotion as keyof typeof colorPalette.emotions];
}

/**
 * Get emotion color for a specific post based on its sentiment and content
 */
export function getEmotionFromPost(sentiment: number, intensity: number): EmotionColor {
    // sentiment: -1 (negative) to 1 (positive)
    // intensity: 0 to 1

    if (sentiment > 0.5 && intensity > 0.6) {
        return colorPalette.emotions.joy;
    } else if (sentiment < -0.5 && intensity > 0.5) {
        return colorPalette.emotions.sadness;
    } else if (sentiment < 0 && intensity > 0.7) {
        return colorPalette.emotions.anxiety;
    } else if (sentiment > 0 && intensity < 0.4) {
        return colorPalette.emotions.embarrassment;
    } else if (sentiment > 0.2 && sentiment < 0.6) {
        return colorPalette.emotions.envy;
    } else {
        // Default to a neutral emotion
        return colorPalette.emotions.joy;
    }
}

/**
 * Blend multiple emotion colors based on weights
 */
export function blendEmotionColors(emotions: Array<{ emotion: string; weight: number }>): string {
    // For now, return the dominant emotion's primary color
    // In the future, this could do actual color blending
    const dominant = emotions.reduce((prev, current) =>
        current.weight > prev.weight ? current : prev
    );

    return colorPalette.emotions[dominant.emotion as keyof typeof colorPalette.emotions].primary;
}

/**
 * Get all available emotions
 */
export function getAllEmotions(): Record<string, EmotionColor> {
    return colorPalette.emotions;
}

/**
 * Convert hex color to RGB for Three.js
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : { r: 1, g: 1, b: 1 };
}
