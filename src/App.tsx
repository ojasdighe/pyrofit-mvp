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
import { FuelSchemesModal } from './components/FuelSchemesModal';
import { InjuriesModal } from './components/InjuriesModal';
import { ExercisesModal } from './components/ExercisesModal';
import { SamplePlansModal } from './components/SamplePlansModal';
import { EventCatalogueModal } from './components/EventCatalogueModal';
import { ComparePlansModal } from './components/ComparePlansModal';
import { PyrofitHub } from './components/pyrofit/PyrofitHub';
import { GeneratedPlan } from './types/architect';
import { generatePlan } from './lib/architectEngine';
import { Flame, Compass } from 'lucide-react';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'pyrofit'>('landing');
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [generatorMode, setGeneratorMode] = useState<'standard' | 'couch'>('standard');
  const [calculatorsOpen, setCalculatorsOpen] = useState(false);
  const [fuelSchemesOpen, setFuelSchemesOpen] = useState(false);
  const [injuriesOpen, setInjuriesOpen] = useState(false);
  const [exercisesOpen, setExercisesOpen] = useState(false);
  const [samplePlansOpen, setSamplePlansOpen] = useState(false);
  const [eventCatalogueOpen, setEventCatalogueOpen] = useState(false);
  const [comparePlansOpen, setComparePlansOpen] = useState(false);
  const [compareInitialTab, setCompareInitialTab] = useState<'methodologies' | 'shoes' | 'watches'>('methodologies');
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

  const handleOpenCompareMethods = () => { setCompareInitialTab('methodologies'); setComparePlansOpen(true); };
  const handleOpenShoeComparisons = () => { setCompareInitialTab('shoes'); setComparePlansOpen(true); };
  const handleOpenWatchComparisons = () => { setCompareInitialTab('watches'); setComparePlansOpen(true); };

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
        onOpenPyrofit={() => setViewMode(viewMode === 'pyrofit' ? 'landing' : 'pyrofit')}
        isPyrofitActive={viewMode === 'pyrofit'}
        onOpenFuelSchemes={() => setFuelSchemesOpen(true)}
        onOpenInjuries={() => setInjuriesOpen(true)}
        onOpenExercises={() => setExercisesOpen(true)}
      />

      {viewMode === 'pyrofit' ? (
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
            <button
              onClick={() => setViewMode('landing')}
              className="text-xs font-space uppercase tracking-widest text-muted hover:text-strava flex items-center gap-1.5 transition-colors"
            >
              ← Back to Overview
            </button>
            <span className="text-[10px] font-space text-faint uppercase">
              Zero In-App Checkout · Official Brand Direct Links Only
            </span>
          </div>

          <PyrofitHub onBackToMain={() => setViewMode('landing')} />
        </div>
      ) : (
        <main>
          {/* Top Pyrofit Callout Strip */}
          <div className="pt-16">
            <div
              className="border-b border-strava/30 px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs font-space bg-strava/5 cursor-pointer hover:bg-strava/10 transition-colors"
              onClick={() => setViewMode('pyrofit')}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-strava animate-pulse" />
                <span className="font-bold text-fg uppercase tracking-wider">
                  PYROFIT ATHLETE FUELING &amp; OUTBOUND TELEMETRY PLATFORM ACTIVE
                </span>
                <span className="hidden sm:inline text-faint">
                  — Calculate exact Carbs, Sodium &amp; Fluid targets + Direct brand links
                </span>
              </div>
              <span className="text-strava font-bold tracking-widest uppercase text-[11px] flex items-center gap-1">
                LAUNCH ENGINE →
              </span>
            </div>
          </div>

          <Hero
            onOpenGenerator={handleOpenGenerator}
            onOpenCalculators={() => setCalculatorsOpen(true)}
            onOpenPyrofit={() => setViewMode('pyrofit')}
          />

          {/* Pyrofit Interactive Section Callout inside landing */}
          <section className="py-16 px-8 md:px-20 border-b border-border bg-gradient-to-r from-strava/[0.08] via-carbon to-carbon">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="text-[10px] font-space text-strava tracking-[0.4em] uppercase font-bold flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-strava" /> SECTION 1–7 MVP SPECIFICATION
                </div>
                <h3 className="italic-heavy text-3xl md:text-4xl text-fg leading-tight">
                  PYROFIT: ATHLETE NUTRITION &amp; <span className="text-strava">OUTBOUND LEAD ENGINE</span>
                </h3>
                <p className="text-muted text-sm md:text-base font-light mt-3 leading-relaxed">
                  Calculates real-time carbohydrate (30–90g/hr), sodium (400–760mg/hr) and fluid (500–700ml/hr) requirements with temperature factors ($E$), intensity modifiers, 3-phase timeline strategy, and post-workout adaptive feedback loop.
                </p>
              </div>

              <button
                onClick={() => setViewMode('pyrofit')}
                className="bg-strava text-on-brand italic-heavy py-4 px-10 text-base font-black shadow-[0_16px_48px_rgba(255,107,26,0.25)] hover:bg-white hover:shadow-[0_20px_50px_rgba(255,107,26,0.4)] transition-all whitespace-nowrap flex items-center gap-2"
              >
                <span>OPEN PYROFIT FUELING HUB</span>
                <span>→</span>
              </button>
            </div>
          </section>

          <CouchTo5KBanner onStartCouch={() => handleOpenGenerator('couch')} />

          <FourWaysIn
            onOpenGenerator={handleOpenGenerator}
            onOpenCalculators={() => setCalculatorsOpen(true)}
          />

          <TrainingScience />

          <WhatYouGet onOpenGenerator={handleOpenGenerator} onOpenEventCatalogue={() => setEventCatalogueOpen(true)} onOpenCalculators={() => setCalculatorsOpen(true)} />

          <MoreThanAPlan onOpenGenerator={() => handleOpenGenerator('standard')} />

          <RunClub />

          <GoDeeper
            onOpenCalculators={() => setCalculatorsOpen(true)}
            onOpenGenerator={handleOpenGenerator}
            onOpenFuelSchemes={() => setFuelSchemesOpen(true)}
            onOpenInjuries={() => setInjuriesOpen(true)}
            onOpenExercises={() => setExercisesOpen(true)}
            onOpenSamplePlans={() => setSamplePlansOpen(true)}
            onOpenEventCatalogue={() => setEventCatalogueOpen(true)}
            onOpenCompareMethods={handleOpenCompareMethods}
            onOpenShoeComparisons={handleOpenShoeComparisons}
            onOpenWatchComparisons={handleOpenWatchComparisons}
          />

          <RunningLab onOpenGenerator={() => handleOpenGenerator('standard')} onOpenComparisons={() => setComparePlansOpen(true)} />

          <FourLevers onOpenGenerator={() => handleOpenGenerator('standard')} />

          <Testimonials />

          <FAQ />
        </main>
      )}

      <Footer
        onOpenGenerator={() => handleOpenGenerator('standard')}
        onOpenCalculators={() => setCalculatorsOpen(true)}
      />

      {/* Floating Action Badges */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 no-print">
        <button
          onClick={() => setViewMode(viewMode === 'pyrofit' ? 'landing' : 'pyrofit')}
          className="bg-strava text-on-brand italic-heavy px-4 py-3 shadow-2xl hover:scale-105 transition-all text-xs font-black flex items-center gap-2 border border-black/20"
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>{viewMode === 'pyrofit' ? 'SWITCH TO RUN BLUEPRINT' : 'OPEN PYROFIT ENGINE'}</span>
        </button>
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

      <FuelSchemesModal
        isOpen={fuelSchemesOpen}
        onClose={() => setFuelSchemesOpen(false)}
      />

      <InjuriesModal
        isOpen={injuriesOpen}
        onClose={() => setInjuriesOpen(false)}
      />

      <ExercisesModal
        isOpen={exercisesOpen}
        onClose={() => setExercisesOpen(false)}
      />
    </div>
  );
};
export default App;
