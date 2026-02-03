import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface InputPanelProps {
  onGenerate: (text: string[]) => void;
  isExpanded: boolean;
  onExpand: () => void;
  isLoading?: boolean;
}

const PRESETS = [
  {
    title: "The Reflective Gardener",
    desc: "Growth, patience, and observation.",
    data: `The rain today felt nourishing, not gloomy.
My project is growing slowly, but the roots are strong.
I feel a bit wilted after that meeting.
Need to prune some bad habits this week.
Grateful for the sunshine this morning.
Patience is the hardest lesson to learn.`
  },
  {
    title: "The Stormy Creator",
    desc: "Intense bursts of energy and doubt.",
    data: `Why is everything a mess?!
I created something beautiful today, finally.
Everyone is moving too slow.
I love the chaos, but I hate the noise.
Feeling like a hurricane in a library.
Burnout is creeping in again.`
  },
  {
    title: "The Gentle Connector",
    desc: "Warmth, family, and soft bonds.",
    data: `Called mom today, her voice is home.
Worried about my friend, he seems distant.
Sunday brunch was lovely.
I miss the way we used to talk.
Sending love to everyone I know.
Hope I'm doing enough for them.`
  }
];

export const InputPanel: React.FC<InputPanelProps> = ({ onGenerate, isExpanded, onExpand, isLoading = false }) => {
  const [text, setText] = useState('');
  const { t } = useLanguage();

  const handleGenerate = () => {
    const lines = text.split('\n');
    onGenerate(lines);
  };

  const handlePreset = (presetText: string) => {
    if (isLoading) return;
    setText(presetText);
    setTimeout(() => {
      const lines = presetText.split('\n');
      onGenerate(lines);
    }, 100);
  };

  return (
    <div className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[420px] glass-panel p-8 flex flex-col z-20 shadow-2xl text-neutral-charcoal transition-all duration-700 ease-out transform ${isExpanded
      ? 'opacity-100 scale-100 pointer-events-auto'
      : 'opacity-0 scale-95 pointer-events-none'
      }`}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-serif font-bold text-neutral-charcoal tracking-tight mb-2">
          {t('input.title')}
        </h1>
        <p className="text-xs text-neutral-charcoal/50 font-sans tracking-widest uppercase font-semibold">
          {t('input.subtitle')}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1">
        {/* Preset Cards */}
        <div className="mb-6 space-y-3">
          <p className="text-[10px] text-neutral-charcoal/40 font-bold uppercase tracking-widest mb-2 text-center">
            {t('input.preset.title')}
          </p>
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handlePreset(p.data)}
              disabled={isLoading}
              className="w-full text-left p-4 rounded-2xl bg-white/40 hover:bg-white/70 border border-white/60 hover:border-white transition-all group shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <div className="font-serif text-lg font-semibold text-neutral-charcoal group-hover:text-black mb-1">
                {p.title}
              </div>
              <div className="text-xs text-neutral-charcoal/60 leading-relaxed">
                {p.desc}
              </div>
            </button>
          ))}
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-neutral-charcoal/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-2 text-[10px] text-neutral-charcoal/40 uppercase tracking-widest bg-opacity-0 backdrop-blur-sm">
              {t('input.custom.title')}
            </span>
          </div>
        </div>

        {/* Custom Input */}
        <div className="relative mb-6">
          <textarea
            className="w-full h-32 bg-white/50 border border-white/60 rounded-2xl p-4 text-neutral-charcoal text-sm focus:bg-white/70 focus:border-emotion-joy/50 focus:ring-0 focus:outline-none resize-none transition-all placeholder-neutral-charcoal/30 font-sans leading-relaxed shadow-inner"
            placeholder={t('input.placeholder')}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-2">
        <button
          onClick={handleGenerate}
          disabled={!text.trim() || isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emotion-joy to-[#FFC04C] text-neutral-charcoal/90 font-serif text-lg font-bold shadow-lg shadow-emotion-joy/20 hover:shadow-emotion-joy/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-neutral-charcoal/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="opacity-80 font-sans text-sm uppercase tracking-wide font-semibold">{t('input.button.analyzing')}</span>
            </>
          ) : (
            t('input.button.materialize')
          )}
        </button>

        <div className="mt-4 text-center">
          <p className="text-[9px] text-neutral-charcoal/30 tracking-widest uppercase font-medium">
            {t('input.footer')}
          </p>
        </div>
      </div>
    </div>
  );
};