import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CouchTo5KBanner } from './components/CouchTo5KBanner';
import { FourWaysIn } from './components/FourWaysIn';
import { TrainingScience } from './components/TrainingScience';
import { WhatYouGet } from './components/WhatYouGet';
import { MoreThanAPlan } from './components/MoreThanAPlan';
import { RunClub } from './components/RunClub';
import { GoDeeper } from './components/GoDeeper';
import { RunningLab } from './components/RunningLab';
import { FourLevers } from './components/FourLevers';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { PlanGeneratorModal } from './components/PlanGeneratorModal';
import { PlanViewerModal } from './components/PlanViewerModal';
import { CalculatorsModal } from './components/CalculatorsModal';
import { GeneratedPlan } from './types/architect';
import { generatePlan } from './lib/architectEngine';

export const App: React.FC = () => {
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [generatorMode, setGeneratorMode] = useState<'standard' | 'couch'>('standard');
  const [calculatorsOpen, setCalculatorsOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activePlan, setActivePlan] = useState<GeneratedPlan | null>(null);

  const handleOpenGenerator = (mode: 'standard' | 'couch' = 'standard') => {
    setGeneratorMode(mode);
    setGeneratorOpen(true);
  };

  const handlePlanGenerated = (plan: GeneratedPlan) => {
    setActivePlan(plan);
    setViewerOpen(true);
  };

  // Demo sample plan generation
  const handleLoadSamplePlan = () => {
    const sample = generatePlan({
      distance: 'Half',
      targetTime: '1:45:00',
      fitnessLevel: 'INTERMEDIATE',
      currentVolume: '35',
      duration: '12',
      schedule: ['Tue', 'Thu', 'Sat', 'Sun'],
      longDay: 'Sun',
      methodology: 'NORWEGIAN',
    });
    setActivePlan(sample);
    setViewerOpen(true);
  };

  return (
    <div className="min-h-screen bg-carbon text-fg selection:bg-strava selection:text-black">
      <Navbar
        onOpenGenerator={handleOpenGenerator}
        onOpenCalculators={() => setCalculatorsOpen(true)}
      />

      <main>
        <Hero
          onOpenGenerator={handleOpenGenerator}
          onOpenCalculators={() => setCalculatorsOpen(true)}
        />

        <CouchTo5KBanner onStartCouch={() => handleOpenGenerator('couch')} />

        <FourWaysIn
          onOpenGenerator={handleOpenGenerator}
          onOpenCalculators={() => setCalculatorsOpen(true)}
        />

        <TrainingScience />

        <WhatYouGet onOpenGenerator={handleOpenGenerator} />

        <MoreThanAPlan onOpenGenerator={() => handleOpenGenerator('standard')} />

        <RunClub />

        <GoDeeper
          onOpenCalculators={() => setCalculatorsOpen(true)}
          onOpenGenerator={handleOpenGenerator}
        />

        <RunningLab onOpenGenerator={() => handleOpenGenerator('standard')} />

        <FourLevers onOpenGenerator={() => handleOpenGenerator('standard')} />

        <Testimonials />

        <FAQ />
      </main>

      <Footer
        onOpenGenerator={() => handleOpenGenerator('standard')}
        onOpenCalculators={() => setCalculatorsOpen(true)}
      />

      {/* Floating Action Badge to View Active / Sample Plan */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 no-print">
        {activePlan ? (
          <button
            onClick={() => setViewerOpen(true)}
            className="bg-strava text-on-brand italic-heavy px-5 py-3 shadow-xl hover:scale-105 transition-all text-sm font-bold flex items-center gap-2 border border-black/20"
          >
            <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
            VIEW ACTIVE BLUEPRINT ({activePlan.distance.toUpperCase()})
          </button>
        ) : (
          <button
            onClick={handleLoadSamplePlan}
            className="bg-surface border border-strava/40 text-strava italic-heavy px-4 py-2.5 shadow-xl hover:bg-strava hover:text-on-brand transition-all text-xs font-bold"
          >
            ⚡ PREVIEW SAMPLE NORWEGIAN PLAN
          </button>
        )}
      </div>

      {/* Modals */}
      <PlanGeneratorModal
        isOpen={generatorOpen}
        initialMode={generatorMode}
        onClose={() => setGeneratorOpen(false)}
        onPlanGenerated={handlePlanGenerated}
      />

      <PlanViewerModal
        isOpen={viewerOpen}
        plan={activePlan}
        onClose={() => setViewerOpen(false)}
      />

      <CalculatorsModal
        isOpen={calculatorsOpen}
        onClose={() => setCalculatorsOpen(false)}
      />
    </div>
  );
};
export default App;
