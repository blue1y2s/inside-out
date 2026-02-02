import React, { useState } from 'react';
import { AnalyzedPost, PersonaDimensions, TargetPersona } from '../types';
import { usePostAnalysis } from '../hooks/usePostAnalysis';
import { computePersonaDimensions } from '../utils/personaDimensions';

interface WhatIfStudioProps {
  currentPosts: AnalyzedPost[];
  currentDimensions: PersonaDimensions | null;
  targetPersona: TargetPersona | null;
}

export const WhatIfStudio: React.FC<WhatIfStudioProps> = ({ currentPosts, currentDimensions, targetPersona }) => {
  const draftState = useState('');
  const draft = draftState[0];
  const setDraft = draftState[1];
  
  const [simulatedDims, setSimulatedDims] = useState<PersonaDimensions | null>(null);
  const { analyzePosts } = usePostAnalysis(); 

  const handleSimulate = () => {
    if (!draft.trim()) return;
    const newPostAnalysis = analyzePosts([draft])[0];
    const combinedPosts = [...currentPosts, newPostAnalysis];
    const newDims = computePersonaDimensions(combinedPosts);
    setSimulatedDims(newDims);
  };

  return (
    <div className="h-full flex flex-col text-gallery-charcoal">
       <div className="mb-6">
        <h2 className="text-3xl font-serif text-gallery-charcoal mb-2">Grafting Studio</h2>
        <p className="text-gallery-charcoal/60 text-sm">See how new thoughts reshape your inner landscape.</p>
      </div>
      
      <div className="flex-1 flex flex-col">
        <textarea
          className="w-full bg-white/40 border border-white p-6 text-lg text-gallery-charcoal mb-4 focus:border-gallery-lime outline-none resize-none rounded-xl h-40 placeholder-gallery-charcoal/40 font-serif shadow-inner"
          placeholder="Plant a new thought here..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        
        <button 
          onClick={handleSimulate}
          disabled={!draft}
          className="w-full py-3 bg-white border border-gallery-grey text-gallery-charcoal font-bold rounded-xl hover:bg-gallery-lime hover:border-gallery-lime hover:text-black transition-all disabled:opacity-50 mb-6 shadow-sm"
        >
          Simulate Growth
        </button>

        {simulatedDims && currentDimensions && (
          <div className="p-6 bg-white/30 rounded-xl border border-white">
              <h4 className="text-xs font-bold text-gallery-charcoal/40 uppercase mb-4 tracking-widest">Predicted Shift</h4>
              <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(simulatedDims) as Array<keyof PersonaDimensions>).map(k => {
                      const diff = simulatedDims[k] - currentDimensions[k];
                      if (Math.abs(diff) < 0.005) return null;
                      return (
                          <div key={k} className="flex justify-between text-sm">
                              <span className="text-gallery-charcoal/70 capitalize">{k}</span>
                              <span className={diff > 0 ? "text-black font-bold" : "text-gallery-charcoal/50"}>
                                  {diff > 0 ? "↑" : "↓"} {(Math.abs(diff) * 100).toFixed(2)}%
                              </span>
                          </div>
                      )
                  })}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};