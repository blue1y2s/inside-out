import React from 'react';
import { AnalyzedPost } from '../types';
import { clsx } from 'clsx';
import { useLanguage } from '../context/LanguageContext';

interface MemoryBankPanelProps {
    memories: AnalyzedPost[];
    onDelete: (id: string) => void;
}

export const MemoryBankPanel: React.FC<MemoryBankPanelProps> = ({ memories, onDelete }) => {
    const { t } = useLanguage();

    if (memories.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-neutral-charcoal/50">
                <p className="italic">No memories stored yet.</p>
            </div>
        );
    }

    // Reverse to show newest first
    const sortedMemories = [...memories].reverse();

    return (
        <div className="h-full flex flex-col text-neutral-charcoal">
            <div className="mb-6">
                <h2 className="text-3xl font-serif text-neutral-charcoal mb-2">Long Term Memory</h2>
                <p className="text-neutral-charcoal/60 text-sm">Review, cherish, or choose to forget.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {sortedMemories.map((memory) => (
                    <div
                        key={memory.id}
                        className="p-4 rounded-xl bg-white/40 border border-white hover:bg-white/60 transition-all group relative"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={clsx(
                                "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                                // Simple color mapping for badges based on category/sentiment roughly
                                "bg-white/50 text-neutral-charcoal/70"
                            )}>
                                {memory.category}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(memory.id);
                                }}
                                className="text-neutral-charcoal/40 hover:text-red-500 transition-colors p-1"
                                title="Forget this memory"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </button>
                        </div>

                        <p className="text-sm font-serif text-neutral-charcoal/90 leading-relaxed italic">
                            "{memory.originalText}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
