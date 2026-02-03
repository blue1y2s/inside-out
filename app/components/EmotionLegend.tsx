import React from 'react';
import { EMOTION_COLORS } from '../utils/colorMap';
import { useLanguage } from '../context/LanguageContext';

interface EmotionLegendProps {
    isVisible?: boolean;
}

const EMOTION_INFO = {
    joy: { label_en: 'Joy', label_zh: '快乐' },
    sadness: { label_en: 'Sadness', label_zh: '悲伤' },
    anxiety: { label_en: 'Anxiety', label_zh: '焦虑' },
    envy: { label_en: 'Envy', label_zh: '嫉妒' },
    embarrassment: { label_en: 'Embarrassment', label_zh: '尴尬' },
    anger: { label_en: 'Anger', label_zh: '愤怒' },
    fear: { label_en: 'Fear', label_zh: '恐惧' },
};

export function EmotionLegend({ isVisible = true }: EmotionLegendProps) {
    const { language } = useLanguage();

    if (!isVisible) return null;

    return (
        <div className="absolute bottom-24 left-6 z-20 bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-lg max-w-xs">
            <h3 className="text-sm font-bold mb-3 text-gallery-charcoal">
                {language === 'en' ? 'Emotion Colors' : '情绪色彩'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(EMOTION_INFO).map(([emotion, info]) => {
                    const color = EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS];
                    const label = language === 'en' ? info.label_en : info.label_zh;

                    return (
                        <div key={emotion} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full shadow-sm"
                                style={{
                                    backgroundColor: color,
                                    boxShadow: `0 0 8px ${color}40`
                                }}
                            />
                            <span className="text-xs text-gallery-charcoal/80">
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
            <p className="text-[10px] text-gallery-charcoal/60 mt-3 italic">
                {language === 'en'
                    ? 'Emotion-driven color visualization'
                    : '情绪驱动的色彩可视化'}
            </p>
        </div>
    );
}
