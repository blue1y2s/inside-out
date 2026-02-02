import React, { useState } from 'react';
import { SceneOrchestrator } from './components/SceneOrchestrator';
import { InputPanel } from './components/InputPanel';
import { TargetPersonaPanel } from './components/TargetPersonaPanel';
import { PersonaDiffPanel } from './components/PersonaDiffPanel';
import { LanguageInsightsPanel } from './components/LanguageInsightsPanel';
import { WhatIfStudio } from './components/WhatIfStudio';
import { ExitReflection } from './components/ExitReflection';
import { EmotionLegend } from './components/EmotionLegend';
import { MemoryBankPanel } from './components/MemoryBankPanel';
import { usePostAnalysis } from './hooks/usePostAnalysis';
import { layoutMemorySpheres } from './utils/layout3d';
import { computePersonaDimensions } from './utils/personaDimensions';
import { saveMemories, loadMemories, deleteMemory } from './utils/memoryStorage';
import { MemorySphere, AnalyzedPost, PersonaDimensions, TargetPersona, ScenePhase } from './types';
import { clsx } from 'clsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

type PresentationTab = 'target' | 'gap' | 'insights' | 'simulation' | 'memories' | 'hidden';

function AppContent() {
  const [scenePhase, setScenePhase] = useState<ScenePhase>('caged');
  const [analyzedPosts, setAnalyzedPosts] = useState<AnalyzedPost[]>([]);
  const [spheres, setSpheres] = useState<MemorySphere[]>([]);
  const [currentDimensions, setCurrentDimensions] = useState<PersonaDimensions | null>(null);

  // Initialize from storage
  React.useEffect(() => {
    const stored = loadMemories();
    if (stored.length > 0) {
      setAnalyzedPosts(stored);
      setSpheres(layoutMemorySpheres(stored));
      setCurrentDimensions(computePersonaDimensions(stored));
      setScenePhase('universe'); // Go straight to universe if we have memories
    }
  }, []);

  // Auto-save whenever analyzedPosts changes
  React.useEffect(() => {
    if (analyzedPosts.length > 0) {
      saveMemories(analyzedPosts);
    }
  }, [analyzedPosts]);
  const [targetPersona, setTargetPersona] = useState<TargetPersona | null>(null);

  // UI States
  const [activeTab, setActiveTab] = useState<PresentationTab>('target');
  const [uiHidden, setUiHidden] = useState(false);
  const [showExitReflection, setShowExitReflection] = useState(false);

  // Internationalization
  const { language, setLanguage, t } = useLanguage();

  // Extract state from the hook
  const { analyzePosts, isAnalyzing, error } = usePostAnalysis();

  const handleGenerate = async (lines: string[]) => {
    // If analysis is already running, avoid duplicate triggers
    if (isAnalyzing) return;

    try {
      const newAnalyzed = await analyzePosts(lines);

      if (newAnalyzed && newAnalyzed.length > 0) {
        // Accumulate Posts: Append new posts to existing ones
        // This setter will be called first to update the posts,
        // but the subsequent functional update for dimensions will use the *latest* state.
        // To avoid race conditions or stale data, we'll use a single functional update for posts
        // that also calculates dimensions.

        // Generate Spheres only for the NEW posts
        const newSpheres = layoutMemorySpheres(newAnalyzed);

        // Accumulate Spheres: Append new spheres to existing ones
        setSpheres(prev => [...prev, ...newSpheres]);

        // Re-calculate dimensions based on the FULL set of posts (prev + new)
        // We use a functional state update to ensure we have the latest accumulated data
        setAnalyzedPosts(prev => {
          const combinedPosts = [...prev, ...newAnalyzed];
          const dims = computePersonaDimensions(combinedPosts);
          setCurrentDimensions(dims);
          return combinedPosts;
        });

        setScenePhase('analyzing');
        setUiHidden(false);
      }
    } catch (e) {
      console.error("Generation failed:", e);
    }
  };

  const handleDeleteMemory = (id: string) => {
    const updatedPosts = deleteMemory(id);

    // Update state to reflect deletion
    setAnalyzedPosts(updatedPosts);
    setSpheres(layoutMemorySpheres(updatedPosts));
    setCurrentDimensions(computePersonaDimensions(updatedPosts));

    // If we deleted everything, go back to caged/input
    if (updatedPosts.length === 0) {
      setScenePhase('input');
      setUiHidden(false);
    }
  };

  // Debugging error logging
  if (error) {
    console.warn("Analysis had issues:", error);
  }

  const isInputPhase = scenePhase === 'input';
  const isUniversePhase = scenePhase === 'universe';

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-neutral-cream via-[#F5F0FF] to-[#E8F4FF] text-neutral-charcoal overflow-hidden font-sans">

      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <SceneOrchestrator
          scenePhase={scenePhase}
          onPhaseChange={setScenePhase}
          spheres={spheres}
          analyzedPosts={analyzedPosts}
        />
      </div>

      {/* Phase 1: Input Panel (Overlay) */}
      <InputPanel
        isExpanded={isInputPhase}
        onExpand={() => { }}
        onGenerate={handleGenerate}
        isLoading={isAnalyzing}
      />

      {/* Language Toggle (Bottom Right Corner) */}
      <div className="absolute bottom-6 right-6 z-40">
        <button
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-full text-neutral-charcoal border border-white hover:bg-white/80 transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          {language === 'en' ? 'EN / 中文' : '中文 / EN'}
        </button>
      </div>

      {/* Phase 2: Universe & Presentation Mode */}
      {isUniversePhase && !uiHidden && (
        <>
          {/* Main Floating Content Card */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl h-[65%] pointer-events-none z-10 flex flex-col justify-end pb-10">
            <div className="glass-panel w-full p-8 rounded-3xl shadow-2xl pointer-events-auto h-full overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700 bg-white/40">
              {activeTab === 'target' && (
                <TargetPersonaPanel currentTarget={targetPersona} onTargetChange={setTargetPersona} />
              )}
              {activeTab === 'gap' && (
                <PersonaDiffPanel currentDimensions={currentDimensions} targetPersona={targetPersona} />
              )}
              {activeTab === 'insights' && (
                <LanguageInsightsPanel posts={analyzedPosts} dimensions={currentDimensions} />
              )}
              {activeTab === 'simulation' && (
                <WhatIfStudio currentPosts={analyzedPosts} currentDimensions={currentDimensions} targetPersona={targetPersona} />
              )}
              {activeTab === 'memories' && (
                <MemoryBankPanel memories={analyzedPosts} onDelete={handleDeleteMemory} />
              )}
            </div>
          </div>

          {/* Bottom Tab Navigation */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-white/50 backdrop-blur-md rounded-full p-2 border border-white flex gap-2 shadow-lg">
              {(['target', 'gap', 'insights', 'simulation'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 capitalize",
                    activeTab === tab
                      ? "bg-emotion-joy/80 text-neutral-charcoal font-bold shadow-md shadow-emotion-joy/30 backdrop-blur-md"
                      : "text-neutral-charcoal hover:text-neutral-charcoal hover:bg-white/60"
                  )}
                >
                  {t(`tabs.${tab}`)}
                </button>
              ))}
              <button
                onClick={() => setActiveTab('memories')}
                className={clsx(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 capitalize",
                  activeTab === 'memories'
                    ? "bg-emotion-joy/80 text-neutral-charcoal font-bold shadow-md shadow-emotion-joy/30 backdrop-blur-md"
                    : "text-neutral-charcoal hover:text-neutral-charcoal hover:bg-white/60"
                )}
              >
                Memories
              </button>
            </div>
          </div>

          {/* Emotion Legend */}
          <EmotionLegend isVisible={!uiHidden} />
        </>
      )}

      {/* Top Left Controls */}
      <div className="absolute top-6 left-6 z-30">
        {isUniversePhase && (
          <button
            onClick={() => setScenePhase('input')}
            className="p-3 bg-white/30 backdrop-blur-md rounded-full text-neutral-charcoal hover:bg-white/60 transition-all border border-white shadow-sm group flex items-center gap-2 pr-5"
            title={t('app.revise')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
            <span className="font-serif font-bold text-sm">{t('app.revise')}</span>
          </button>
        )}
      </div>

      {/* Top Right Controls Group */}
      <div className="absolute top-6 right-6 z-30 flex gap-3">
        {isUniversePhase && (
          <button
            onClick={() => setShowExitReflection(true)}
            className="p-3 bg-white/30 backdrop-blur-md rounded-full text-neutral-charcoal hover:bg-white/60 transition-all border border-white shadow-sm group"
            title={t('app.end_session')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-emotion-anxiety transition-colors"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
          </button>
        )}

        {isUniversePhase && (
          <button
            onClick={() => setUiHidden(!uiHidden)}
            className="p-3 bg-white/30 backdrop-blur-md rounded-full text-neutral-charcoal hover:bg-emotion-joy hover:text-white transition-all border border-white shadow-sm"
            title={uiHidden ? "Show UI" : "Hide UI"}
          >
            {uiHidden ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
            )}
          </button>
        )}
      </div>

      <ExitReflection isOpen={showExitReflection} onClose={() => setShowExitReflection(false)} />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;