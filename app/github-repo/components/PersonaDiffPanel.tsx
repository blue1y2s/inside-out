import React, { useMemo } from 'react';
import { PersonaDimensions, TargetPersona } from '../types';
import { computeDimensionDiff } from '../utils/personaDimensions';
import { clsx } from 'clsx';

interface PersonaDiffPanelProps {
  currentDimensions: PersonaDimensions | null;
  targetPersona: TargetPersona | null;
}

export const PersonaDiffPanel: React.FC<PersonaDiffPanelProps> = ({ currentDimensions, targetPersona }) => {
  const diffs = useMemo(() => {
    if (!currentDimensions || !targetPersona) return null;
    return computeDimensionDiff(currentDimensions, targetPersona.dimensions);
  }, [currentDimensions, targetPersona]);

  if (!currentDimensions) return <div className="text-gallery-charcoal/50 italic p-8">No seeds planted yet.</div>;
  if (!targetPersona) return <div className="text-gallery-charcoal/50 italic p-8">Select an ideal form to see growth gaps.</div>;

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar text-gallery-charcoal">
       <div className="mb-8">
        <h2 className="text-3xl font-serif text-gallery-charcoal mb-2">Growth Analysis</h2>
        <p className="text-gallery-charcoal/60 text-sm">Measuring the distance between current self and ideal self.</p>
      </div>

      <div className="space-y-8">
        {(Object.keys(currentDimensions) as Array<keyof PersonaDimensions>).map((key) => {
          const currentVal = currentDimensions[key];
          const targetVal = targetPersona.dimensions[key];
          const diff = targetVal - currentVal;
          const isAligned = Math.abs(diff) < 0.1;
          
          return (
            <div key={key} className="relative group">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold uppercase tracking-widest text-gallery-charcoal/40">{key}</span>
                <span className={clsx("font-serif text-2xl", isAligned ? "text-gallery-charcoal/40" : (diff > 0 ? "text-black" : "text-gallery-charcoal/60"))}>
                   {diff > 0 ? '+' : ''}{(diff * 100).toFixed(0)}%
                </span>
              </div>
              
              {/* Track */}
              <div className="h-4 w-full bg-white rounded-full relative overflow-hidden border border-white shadow-inner">
                
                {/* Current Value Bar */}
                <div 
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ 
                      width: `${currentVal * 100}%`,
                      backgroundColor: isAligned ? '#D6D3D1' : (diff > 0 ? '#FAFF00' : '#CCFF00'), // Grey, Yellow, Lime
                  }}
                />

                {/* Target Marker */}
                <div 
                  className="absolute top-0 bottom-0 w-[4px] bg-black z-20"
                  style={{ left: `${targetVal * 100}%` }}
                />
              </div>

              {/* Tooltip hint */}
              <div className="mt-1 text-right">
                <span className="text-[10px] text-gallery-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    Goal: {(targetVal * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};