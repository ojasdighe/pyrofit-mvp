import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
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
import { GearLabView } from './components/GearLabView';
import { PyrofitHub } from './components/pyrofit/PyrofitHub';
import { GeneratedPlan } from './types/architect';
import { generatePlan } from './lib/architectEngine';
import { Flame, Compass, ArrowRight, Layers, User } from 'lucide-react';

export const App: React.FC = () => {
  // ── Unified 4-Pillar Navigation State ──────────────────────────────────────
  const [activeTab, setActiveTab] = useState<NavTab>('plans');
  const [hubInitialView, setHubInitialView] = useState<'profile' | 'planner' | 'compare' | 'feedback' | 'analytics'>('planner');

  // ── Modals State ──────────────────────────────────────────────────────────
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

  // ── Browser Hash Routing & Deep Linking ───────────────────────────────────
  const syncHashToState = (hashStr: string) => {
    const raw = hashStr.replace(/^#\/?/, '').toLowerCase().trim();
    if (!raw) return;

    if (raw === 'plans' || raw === 'training') {
      setActiveTab('plans');
      closeAllModals();
    } else if (raw === 'fuel' || raw === 'fueling' || raw === 'planner') {
      setActiveTab('fuel');
      setHubInitialView('planner');
      closeAllModals();
    } else if (raw === 'profile' || raw === 'athlete') {
      setActiveTab('profile');
      setHubInitialView('profile');
      closeAllModals();
    } else if (raw === 'compare' || raw === 'products') {
      setActiveTab('fuel');
      setHubInitialView('compare');
      closeAllModals();
    } else if (raw === 'analytics') {
      setActiveTab('fuel');
      setHubInitialView('analytics');
      closeAllModals();
    } else if (raw === 'lab' || raw === 'gear') {
      setActiveTab('lab');
      closeAllModals();
    } else if (raw === 'shoes') {
      setCompareInitialTab('shoes');
      setComparePlansOpen(true);
    } else if (raw === 'watches') {
      setCompareInitialTab('watches');
      setComparePlansOpen(true);
    } else if (raw === 'methods') {
      setCompareInitialTab('methodologies');
      setComparePlansOpen(true);
    } else if (raw === 'events' || raw === 'races') {
      setEventCatalogueOpen(true);
    } else if (raw === 'exercises') {
      setExercisesOpen(true);
    } else if (raw === 'injuries') {
      setInjuriesOpen(true);
    } else if (raw === 'fuel-schemes' || raw === 'nutrition') {
      setFuelSchemesOpen(true);
    } else if (raw === 'calculators' || raw === 'vdot') {
      setCalculatorsOpen(true);
    } else if (raw === 'generator' || raw === 'blueprint') {
      setGeneratorMode('standard');
      setGeneratorOpen(true);
    } else if (raw === 'couch') {
      setGeneratorMode('couch');
      setGeneratorOpen(true);
    }
  };

  const closeAllModals = () => {
    setGeneratorOpen(false);
    setCalculatorsOpen(false);
    setFuelSchemesOpen(false);
    setInjuriesOpen(false);
    setExercisesOpen(false);
    setSamplePlansOpen(false);
    setEventCatalogueOpen(false);
    setComparePlansOpen(false);
    setViewerOpen(false);
  };

  useEffect(() => {
    if (window.location.hash) {
      syncHashToState(window.location.hash);
    }
    const onHashChange = () => {
      syncHashToState(window.location.hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const switchTab = (tab: NavTab, initialHub?: 'profile' | 'planner' | 'compare' | 'feedback' | 'analytics') => {
    setActiveTab(tab);
    if (initialHub) setHubInitialView(initialHub);
    window.location.hash = tab;
    closeAllModals();
  };

  const openModalWithHash = (hash: string, openAction: () => void) => {
    openAction();
    window.location.hash = hash;
  };

  const handleCloseModal = () => {
    closeAllModals();
    window.location.hash = activeTab;
  };

  // ── Generator & Plan Handlers ─────────────────────────────────────────────
  const handleOpenGenerator = (mode: 'standard' | 'couch' = 'standard') => {
    setGeneratorMode(mode);
    openModalWithHash(mode === 'couch' ? 'couch' : 'generator', () => setGeneratorOpen(true));
  };

  const handlePlanGenerated = (plan: GeneratedPlan) => {
    setActivePlan(plan);
    setViewerOpen(true);
  };

  const handleOpenCompareMethods = () => {
    setCompareInitialTab('methodologies');
    openModalWithHash('methods', () => setComparePlansOpen(true));
  };

  const handleOpenShoeComparisons = () => {
    setCompareInitialTab('shoes');
    openModalWithHash('shoes', () => setComparePlansOpen(true));
  };

  const handleOpenWatchComparisons = () => {
    setCompareInitialTab('watches');
    openModalWithHash('watches', () => setComparePlansOpen(true));
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
      {/* Unified Navbar with 4-Pillar Tabs */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={switchTab}
        onOpenGenerator={handleOpenGenerator}
        onOpenCalculators={() => openModalWithHash('calculators', () => setCalculatorsOpen(true))}
        onOpenFuelSchemes={() => openModalWithHash('fuel-schemes', () => setFuelSchemesOpen(true))}
        onOpenInjuries={() => openModalWithHash('injuries', () => setInjuriesOpen(true))}
        onOpenExercises={() => openModalWithHash('exercises', () => setExercisesOpen(true))}
        onOpenComparePlans={(subTab) => {
          if (subTab) setCompareInitialTab(subTab);
          openModalWithHash(subTab || 'methods', () => setComparePlansOpen(true));
        }}
        onOpenEventCatalogue={() => openModalWithHash('events', () => setEventCatalogueOpen(true))}
      />

      {/* ── PILLAR 1: FUEL ENGINE VIEW ────────────────────────────────────── */}
      {activeTab === 'fuel' && (
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-strava animate-pulse"></span>
              <span className="text-xs font-space uppercase tracking-widest text-strava font-bold">
                PRECISION FUELING ENGINE
              </span>
              <span className="hidden sm:inline text-faint text-xs font-space">
                · Carbs (g/hr) · Sodium (mg/hr) · Fluids (ml/hr) — personalised to you
              </span>
            </div>
            <button
              onClick={() => switchTab('plans')}
              className="text-xs font-space uppercase tracking-widest text-muted hover:text-strava flex items-center gap-1.5 transition-colors"
            >
              ← View Training Plans
            </button>
          </div>

          <PyrofitHub initialView={hubInitialView} onBackToMain={() => switchTab('plans')} />
        </div>
      )}

      {/* ── PILLAR 2: ATHLETE PROFILE VIEW ────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-strava" />
              <span className="text-xs font-space uppercase tracking-widest text-strava font-bold">
                ATHLETE PROFILE &amp; AI CONFIGURATION
              </span>
              <span className="hidden sm:inline text-faint text-xs font-space">
                · Your physiology baseline, dietary preferences &amp; AI settings
              </span>
            </div>
            <button
              onClick={() => switchTab('plans')}
              className="text-xs font-space uppercase tracking-widest text-muted hover:text-strava flex items-center gap-1.5 transition-colors"
            >
              ← View Training Plans
            </button>
          </div>

          <PyrofitHub initialView="profile" onBackToMain={() => switchTab('plans')} />
        </div>
      )}

      {/* ── PILLAR 3: GEAR & RUNNING LAB VIEW ─────────────────────────────── */}
      {activeTab === 'lab' && (
        <GearLabView
          onOpenFuelSchemes={() => openModalWithHash('fuel-schemes', () => setFuelSchemesOpen(true))}
          onOpenInjuries={() => openModalWithHash('injuries', () => setInjuriesOpen(true))}
          onOpenExercises={() => openModalWithHash('exercises', () => setExercisesOpen(true))}
          onOpenCalculators={() => openModalWithHash('calculators', () => setCalculatorsOpen(true))}
          onOpenEventCatalogue={() => openModalWithHash('events', () => setEventCatalogueOpen(true))}
          onBackToPlans={() => switchTab('plans')}
          onGoToFuel={() => switchTab('fuel')}
        />
      )}

      {/* ── PILLAR 4: TRAINING PLANS & SCIENCE OVERVIEW ────────────────────── */}
      {activeTab === 'plans' && (
        <main>
          {/* Top Fueling Callout Strip */}
          <div className="pt-16">
            <div
              className="border-b border-strava/30 px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs font-space bg-strava/5 cursor-pointer hover:bg-strava/10 transition-colors"
              onClick={() => switchTab('fuel')}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-strava animate-pulse" />
                <span className="font-bold text-fg uppercase tracking-wider">
                  PYROFIT FUELING CALCULATOR
                </span>
                <span className="hidden sm:inline text-faint">
                  — Calculate exact Carbs, Sodium &amp; Fluid targets + Direct brand links
                </span>
              </div>
              <span className="text-strava font-bold tracking-widest uppercase text-[11px] flex items-center gap-1">
                LAUNCH FUEL ENGINE →
              </span>
            </div>
          </div>

          <Hero
            onOpenGenerator={handleOpenGenerator}
            onOpenCalculators={() => openModalWithHash('calculators', () => setCalculatorsOpen(true))}
            onOpenPyrofit={() => switchTab('fuel')}
          />

          {/* Pyrofit Interactive Section Callout inside landing */}
          <section className="py-16 px-8 md:px-20 border-b border-border bg-gradient-to-r from-strava/[0.08] via-carbon to-carbon">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="text-[10px] font-space text-strava tracking-[0.4em] uppercase font-bold flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-strava" /> PRECISION FUELING PLATFORM
                </div>
                <h3 className="italic-heavy text-3xl md:text-4xl text-fg leading-tight">
                  PYROFIT: ENDURANCE ATHLETE <span className="text-strava">FUELING CALCULATOR</span>
                </h3>
                <p className="text-muted text-sm md:text-base font-light mt-3 leading-relaxed">
                  Calculates real-time carbohydrate (30–90g/hr), sodium (400–760mg/hr) and fluid (500–700ml/hr) requirements with temperature factors ($E$), intensity modifiers, 3-phase timeline strategy, and post-workout adaptive feedback loop.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => switchTab('fuel')}
                  className="bg-strava text-on-brand italic-heavy py-4 px-8 text-base font-black shadow-[0_16px_48px_rgba(255,107,26,0.25)] hover:bg-white hover:shadow-[0_20px_50px_rgba(255,107,26,0.4)] transition-all whitespace-nowrap flex items-center gap-2"
                >
                  <span>OPEN FUEL ENGINE</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => switchTab('lab')}
                  className="border border-strava/50 text-strava hover:bg-strava/10 italic-heavy py-4 px-6 text-base font-bold transition-all whitespace-nowrap"
                >
                  GEAR &amp; LAB
                </button>
              </div>
            </div>
          </section>

          <CouchTo5KBanner onStartCouch={() => handleOpenGenerator('couch')} />

          <FourWaysIn
            onOpenGenerator={handleOpenGenerator}
            onOpenCalculators={() => openModalWithHash('calculators', () => setCalculatorsOpen(true))}
          />

          <TrainingScience />

          <WhatYouGet
            onOpenGenerator={handleOpenGenerator}
            onOpenEventCatalogue={() => openModalWithHash('events', () => setEventCatalogueOpen(true))}
            onOpenCalculators={() => openModalWithHash('calculators', () => setCalculatorsOpen(true))}
          />

          <MoreThanAPlan onOpenGenerator={() => handleOpenGenerator('standard')} />

          <RunClub />

          <GoDeeper
            onOpenCalculators={() => openModalWithHash('calculators', () => setCalculatorsOpen(true))}
            onOpenGenerator={handleOpenGenerator}
            onOpenFuelSchemes={() => openModalWithHash('fuel-schemes', () => setFuelSchemesOpen(true))}
            onOpenInjuries={() => openModalWithHash('injuries', () => setInjuriesOpen(true))}
            onOpenExercises={() => openModalWithHash('exercises', () => setExercisesOpen(true))}
            onOpenSamplePlans={() => openModalWithHash('plans', () => setSamplePlansOpen(true))}
            onOpenEventCatalogue={() => openModalWithHash('events', () => setEventCatalogueOpen(true))}
            onOpenCompareMethods={handleOpenCompareMethods}
            onOpenShoeComparisons={handleOpenShoeComparisons}
            onOpenWatchComparisons={handleOpenWatchComparisons}
          />

          <RunningLab
            onOpenGenerator={() => handleOpenGenerator('standard')}
            onOpenComparisons={() => switchTab('lab')}
          />

          <FourLevers onOpenGenerator={() => handleOpenGenerator('standard')} />

          <Testimonials />

          <FAQ />
        </main>
      )}

      <Footer
        onOpenGenerator={() => handleOpenGenerator('standard')}
        onOpenCalculators={() => openModalWithHash('calculators', () => setCalculatorsOpen(true))}
      />

      {/* Floating Action Badge */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 no-print">
        {activeTab === 'plans' ? (
          <button
            onClick={() => switchTab('fuel')}
            className="bg-strava text-on-brand italic-heavy px-4 py-3 shadow-2xl hover:scale-105 transition-all text-xs font-black flex items-center gap-2 border border-black/20"
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>LAUNCH FUEL ENGINE</span>
          </button>
        ) : (
          <button
            onClick={() => switchTab('plans')}
            className="bg-strava text-on-brand italic-heavy px-4 py-3 shadow-2xl hover:scale-105 transition-all text-xs font-black flex items-center gap-2 border border-black/20"
          >
            <Compass className="w-4 h-4" />
            <span>VIEW TRAINING BLUEPRINTS</span>
          </button>
        )}

        {activePlan && (
          <button
            onClick={() => setViewerOpen(true)}
            className="bg-surface border border-strava/40 text-strava italic-heavy px-4 py-2.5 shadow-xl hover:bg-strava hover:text-on-brand transition-all text-xs font-bold flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-strava animate-ping"></span>
            ACTIVE PLAN ({activePlan.distance.toUpperCase()})
          </button>
        )}
      </div>

      {/* ── ALL MODALS WITH HASH RESTORE ──────────────────────────────────── */}
      <PlanGeneratorModal
        isOpen={generatorOpen}
        initialMode={generatorMode}
        onClose={handleCloseModal}
        onPlanGenerated={handlePlanGenerated}
      />

      <PlanViewerModal
        isOpen={viewerOpen}
        plan={activePlan}
        onClose={handleCloseModal}
      />

      <CalculatorsModal
        isOpen={calculatorsOpen}
        onClose={handleCloseModal}
      />

      <FuelSchemesModal
        isOpen={fuelSchemesOpen}
        onClose={handleCloseModal}
      />

      <InjuriesModal
        isOpen={injuriesOpen}
        onClose={handleCloseModal}
      />

      <ExercisesModal
        isOpen={exercisesOpen}
        onClose={handleCloseModal}
      />

      <SamplePlansModal
        isOpen={samplePlansOpen}
        onClose={handleCloseModal}
        onOpenGenerator={handleOpenGenerator}
      />

      <EventCatalogueModal
        isOpen={eventCatalogueOpen}
        onClose={handleCloseModal}
      />

      <ComparePlansModal
        isOpen={comparePlansOpen}
        onClose={handleCloseModal}
        initialTab={compareInitialTab}
      />
    </div>
  );
};

export default App;
