import { PersonaDimensions } from '../types';
import colorPalette from '../../reference/color_palette.json';

export interface EmotionColor {
    name: string;
    primary: string;
    gradient: string[];
    glow: string;
    description: string;
}

export interface MixedEmotion {
    emotions: Array<{ name: string; weight: number; color: string }>;
    dominantColor: string;
    blendedColor: string;
}

/**
 * Maps personality dimensions to Inside Out emotion colors
 */
export function getEmotionFromDimensions(dimensions: PersonaDimensions): EmotionColor {
    const { extraversion, emotionality, warmth, conscientiousness, confidence } = dimensions;

    let dominantEmotion = 'joy';

    if (emotionality > 0.6) {
        dominantEmotion = 'anxiety';
    }
    else if (extraversion < 0.4 && emotionality > 0.4) {
        dominantEmotion = 'sadness';
    }
    else if (warmth > 0.6 && extraversion > 0.6) {
        dominantEmotion = 'joy';
    }
    else if (warmth < 0.4 && confidence < 0.4) {
        dominantEmotion = 'embarrassment';
    }
    else if (conscientiousness > 0.7 && emotionality > 0.3) {
        dominantEmotion = 'anxiety';
    }
    else if (confidence < 0.3 && emotionality > 0.5) {
        dominantEmotion = 'fear';
    }
    else if (Math.abs(extraversion - 0.5) < 0.2 && Math.abs(warmth - 0.5) < 0.2) {
        dominantEmotion = 'envy';
    }

    return colorPalette.emotions[dominantEmotion as keyof typeof colorPalette.emotions];
}

/**
 * Get mixed emotions from post - Inside Out style where memories can have multiple emotions
 */
export function getMixedEmotionsFromPost(sentiment: number, intensity: number, text: string): MixedEmotion {
    const emotions: Array<{ name: string; weight: number; color: string }> = [];

    // Analyze text for emotion keywords
    const textLower = text.toLowerCase();

    // Joy indicators
    const joyKeywords = ['happy', 'excited', 'great', 'amazing', 'wonderful', 'love', 'awesome', '😊', '😄', '🎉', '❤️'];
    const joyScore = joyKeywords.filter(word => textLower.includes(word)).length;

    // Sadness indicators
    const sadnessKeywords = ['sad', 'miss', 'lost', 'gone', 'cry', 'tear', 'lonely', '😢', '😞', '💔'];
    const sadnessScore = sadnessKeywords.filter(word => textLower.includes(word)).length;

    // Anxiety indicators
    const anxietyKeywords = ['worry', 'anxious', 'stress', 'nervous', 'afraid', 'scared', 'panic', '😰', '😨'];
    const anxietyScore = anxietyKeywords.filter(word => textLower.includes(word)).length;

    // Multiple emotions present - mixed memory!
    if (sentiment > 0.3) {
        emotions.push({
            name: 'joy',
            weight: Math.min(sentiment * intensity, 1.0),
            color: colorPalette.emotions.joy.primary
        });
    }

    if (sentiment < -0.2) {
        emotions.push({
            name: 'sadness',
            weight: Math.min(Math.abs(sentiment) * intensity, 1.0),
            color: colorPalette.emotions.sadness.primary
        });
    }

    if (intensity > 0.6) {
        emotions.push({
            name: 'anxiety',
            weight: intensity * 0.8,
            color: colorPalette.emotions.anxiety.primary
        });
    }

    if (anxietyScore > 0) {
        emotions.push({
            name: 'anxiety',
            weight: Math.min(anxietyScore * 0.3, 1.0),
            color: colorPalette.emotions.anxiety.primary
        });
    }

    if (sadnessScore > 0) {
        emotions.push({
            name: 'sadness',
            weight: Math.min(sadnessScore * 0.3, 1.0),
            color: colorPalette.emotions.sadness.primary
        });
    }

    // If no strong emotions detected, default to neutral joy
    if (emotions.length === 0) {
        emotions.push({
            name: 'joy',
            weight: 0.5,
            color: colorPalette.emotions.joy.primary
        });
    }

    // Normalize weights
    const totalWeight = emotions.reduce((sum, e) => sum + e.weight, 0);
    emotions.forEach(e => e.weight = e.weight / totalWeight);

    // Sort by weight
    emotions.sort((a, b) => b.weight - a.weight);

    // Blend colors
    const blendedColor = blendColors(emotions.map(e => ({ color: e.color, weight: e.weight })));

    return {
        emotions,
        dominantColor: emotions[0].color,
        blendedColor
    };
}

/**
 * Get emotion color for a specific post (legacy compatibility)
 */
export function getEmotionFromPost(sentiment: number, intensity: number): EmotionColor {
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
        return colorPalette.emotions.joy;
    }
}

/**
 * Blend multiple colors based on weights - creates gradient-like mixed emotions
 */
function blendColors(colors: Array<{ color: string; weight: number }>): string {
    let r = 0, g = 0, b = 0;

    colors.forEach(({ color, weight }) => {
        const rgb = hexToRgb(color);
        r += rgb.r * 255 * weight;
        g += rgb.g * 255 * weight;
        b += rgb.b * 255 * weight;
    });

    const toHex = (n: number) => {
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Blend multiple emotion colors based on weights (legacy)
 */
export function blendEmotionColors(emotions: Array<{ emotion: string; weight: number }>): string {
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
