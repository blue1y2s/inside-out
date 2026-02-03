
import React from 'react';
import { ScenePhase, MemorySphere, AnalyzedPost } from '../types';
import { CagedSphereScene } from './CagedSphereScene';
import { AnalyzingSphereScene } from './AnalyzingSphereScene';
import { PersonaUniverse } from './PersonaUniverse';

interface SceneOrchestratorProps {
  scenePhase: ScenePhase;
  onPhaseChange: (next: ScenePhase) => void;
  spheres: MemorySphere[];
  analyzedPosts: AnalyzedPost[];
}

export const SceneOrchestrator: React.FC<SceneOrchestratorProps> = ({ 
  scenePhase, 
  onPhaseChange, 
  spheres,
  analyzedPosts
}) => {
  switch (scenePhase) {
    case 'caged':
    case 'liberating':
      return (
        <CagedSphereScene 
          scenePhase={scenePhase} 
          onPhaseChange={onPhaseChange} 
        />
      );
    
    case 'analyzing':
      return (
        <AnalyzingSphereScene 
          scenePhase={scenePhase} 
          onPhaseChange={onPhaseChange} 
          posts={analyzedPosts}
        />
      );

    case 'input':
       // During input, we can show an empty universe or keep the liberated state.
       // For visual continuity, let's just show an empty universe background or 
       // a simple placeholder. However, the InputPanel sits ON TOP of this.
       // Let's render an empty universe to keep the background consistent and nice.
       return <PersonaUniverse spheres={[]} />;

    case 'universe':
    default:
      return <PersonaUniverse spheres={spheres} />;
  }
};
