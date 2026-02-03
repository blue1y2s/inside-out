import { useState, useCallback } from 'react';
import { AnalyzedPost } from '../types';
import { analyzeTextRuleBased } from '../utils/sentimentRules';
import { analyzePostsWithLLM } from '../utils/llmService';

export function usePostAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePosts = useCallback(async (lines: string[]): Promise<AnalyzedPost[]> => {
    setIsAnalyzing(true);
    setError(null);

    // Filter empty lines and take max 50
    const validLines = lines
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .slice(0, 50);

    if (validLines.length === 0) {
      setIsAnalyzing(false);
      return [];
    }

    try {
      // Attempt LLM Analysis
      const results = await analyzePostsWithLLM(validLines);
      return results;
    } catch (err) {
      console.warn("LLM Analysis failed, falling back to rules:", err);
      setError("AI connection failed. Using basic analysis instead.");

      // Fallback to local rules
      return validLines.map((line, index) => {
        const { sentimentScore, intensity, category } = analyzeTextRuleBased(line, index);

        return {
          id: `post-${index}-${Date.now()}`,
          originalText: line,
          sentimentScore,
          intensity,
          category,
          timestampIndex: index,
        };
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { analyzePosts, isAnalyzing, error };
}