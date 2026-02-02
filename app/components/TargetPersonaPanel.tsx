import React from 'react';
import { TargetPersona } from '../types';
import { getDefaultTargetPersonas } from '../utils/personaDimensions';
import { clsx } from 'clsx';

interface TargetPersonaPanelProps {
  currentTarget: TargetPersona | null;
  onTargetChange: (target: TargetPersona) => void;
}

export const TargetPersonaPanel: React.FC<TargetPersonaPanelProps> = ({ currentTarget, onTargetChange }) => {
  const presets = getDefaultTargetPersonas();

  return (
    <div className="h-full flex flex-col text-neutral-charcoal">
      <div className="mb-6">
        <h2 className="text-3xl font-serif text-neutral-charcoal mb-2">Ideal Form</h2>
        <p className="text-neutral-charcoal/60 text-sm">Choose the archetype you wish to grow towards.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {presets.map(p => (
          <div
            key={p.id}
            onClick={() => onTargetChange(p)}
            className={clsx(
              "cursor-pointer p-6 rounded-2xl border transition-all duration-300",
              currentTarget?.id === p.id
                ? "bg-white border-emotion-joy shadow-lg shadow-emotion-joy/20"
                : "bg-white/20 border-white hover:bg-white/50 hover:border-emotion-joy/50"
            )}
          >
            <div className="flex justify-between items-center mb-2">
              <div className={clsx("font-serif text-xl", currentTarget?.id === p.id ? "text-neutral-charcoal font-bold" : "text-neutral-charcoal")}>{p.name}</div>
              {currentTarget?.id === p.id && <div className="w-2 h-2 bg-emotion-joy rounded-full animate-pulse shadow-[0_0_8px_#FFD700]" />}
            </div>
            <div className="text-sm text-neutral-charcoal/80 leading-relaxed">{p.description}</div>
          </div>
        ))}

        <div className="mt-8 p-6 rounded-2xl border border-dashed border-neutral-border text-center bg-white/10">
          <p className="text-neutral-charcoal/50 text-sm">Pruning shears available in Pro version.</p>
        </div>
      </div>
    </div>
  );
};