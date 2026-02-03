import React, { useMemo } from 'react';
import { AnalyzedPost, PersonaDimensions } from '../types';

interface LanguageInsightsPanelProps {
  posts: AnalyzedPost[];
  dimensions: PersonaDimensions | null;
}

export const LanguageInsightsPanel: React.FC<LanguageInsightsPanelProps> = ({ posts, dimensions }) => {
  const insights = useMemo(() => {
    if (posts.length === 0 || !dimensions) return [];
    
    const results: string[] = [];
    const count = posts.length;
    const rants = posts.filter(p => p.category === 'rant').length;
    const achievements = posts.filter(p => p.category === 'achievement').length;
    const relationships = posts.filter(p => p.category === 'relationship').length;

    if (rants > achievements * 2 && rants > 3) results.push(`Weeds of frustration (${((rants/count)*100).toFixed(0)}%) are choking celebration.`);
    if (achievements > rants * 3) results.push(`High achievement focus. Remember to water your emotional roots.`);
    if (relationships < 2) results.push(`Internal focus detected. The garden needs more social pollinators.`);
    if (dimensions.emotionality > 0.8) results.push(`High emotional winds detected. Intense passion, but potential instability.`);
    if (dimensions.confidence < 0.4) results.push(`Soft language ("maybe", "sort of") is shading your sunlight.`);
    if (results.length === 0) results.push(`The ecosystem is balanced and thriving.`);

    return results;
  }, [posts, dimensions]);

  if (!dimensions) return <div className="text-gallery-charcoal/50 italic p-8">No growth patterns yet.</div>;

  return (
    <div className="h-full text-gallery-charcoal">
      <div className="mb-6">
        <h2 className="text-3xl font-serif text-gallery-charcoal mb-2">Curator Notes</h2>
        <p className="text-gallery-charcoal/60 text-sm">Patterns emerging from the soil of your mind.</p>
      </div>
      
      <div className="space-y-4">
        {insights.map((text, i) => (
          <div key={i} className="bg-white/30 border border-white p-6 rounded-xl flex gap-4 items-start shadow-sm">
            <span className="text-gallery-lime text-3xl font-serif mt-[-8px]">“</span>
            <p className="text-gallery-charcoal font-serif leading-relaxed text-lg">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};