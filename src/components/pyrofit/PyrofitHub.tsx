import React, { useState, useEffect } from 'react';
import {
  Flame,
  Sliders,
  Sparkles,
  RotateCcw,
  BarChart3,
  Smartphone,
  Monitor,
  CheckCircle,
  Zap,
  Timer,
  ShoppingCart,
} from 'lucide-react';
import {
  AthleteProfileState,
  CalculatedHourlyTargets,
  WorkoutInputVector,
} from '../../types/pyrofit';
import {
  allocate3PhaseStrategy,
  calculateHourlyTargets,
  getRecommendedProductPlan,
} from '../../lib/fuelEngine';
import { getOrCreateAthleteId } from '../../lib/telemetryLogger';
import { sqliteEngine } from '../../lib/sqliteEngine';
import { WorkoutConfigurator } from './WorkoutConfigurator';
import { FuelingStrategyView } from './FuelingStrategyView';
import { AdaptiveFeedbackModal } from './AdaptiveFeedbackModal';
import { ManufacturerAnalyticsPortal } from './ManufacturerAnalyticsPortal';
import { AICopilotDrawer } from './AICopilotDrawer';
import { LiveFuelingTimer } from './LiveFuelingTimer';
import { CustomFuelStackBuilder } from './CustomFuelStackBuilder';

interface PyrofitHubProps {
  onBackToMain?: () => void;
}

export const PyrofitHub: React.FC<PyrofitHubProps> = () => {
  const [activeScreen, setActiveScreen] = useState<'config' | 'strategy' | 'analytics'>('config');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [androidFrameMode, setAndroidFrameMode] = useState(false);

  // ── New feature modal states ──
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [liveTimerOpen, setLiveTimerOpen] = useState(false);
  const [stackBuilderOpen, setStackBuilderOpen] = useState(false);

  // Default Workout Input Vector
  const [workoutInput, setWorkoutInput] = useState<WorkoutInputVector>({
    workout_duration_mins: 150,
    intensity_level: 'HIGH',
    temperature_celsius: 32,
    cramping_history: true,
    athlete_weight_kg: 68,
    budget_tier_preference: 'ALL',
  });

  // Athlete Profile with ML Multipliers State
  const [profile, setProfile] = useState<AthleteProfileState>(() => {
    try {
      const saved = localStorage.getItem('pyrofit_athlete_profile_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      athlete_id: getOrCreateAthleteId(),
      athlete_weight_kg: 68,
      carb_multiplier: 1.0,
      sodium_multiplier: 1.0,
      filter_isotonic_only: false,
      historical_cramping: false,
      total_workouts_logged: 0,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('pyrofit_athlete_profile_v1', JSON.stringify(profile));
      sqliteEngine.syncAthleteProfile(profile);
    } catch {}
  }, [profile]);

  // Execute Deterministic Engine calculations
  const targets: CalculatedHourlyTargets = calculateHourlyTargets(workoutInput, profile);
  const phasePlan = allocate3PhaseStrategy(workoutInput, targets, profile);
  const recommendedProducts = getRecommendedProductPlan(targets, phasePlan, workoutInput, profile);

  const handleProfileUpdated = (updated: AthleteProfileState, _notes?: string[]) => {
    setProfile(updated);
  };

  const allDuringProducts = [
    ...recommendedProducts.duringGels,
    ...recommendedProducts.duringHydration,
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Platform Title & Subheader */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-strava font-space text-[10px] tracking-[0.5em] uppercase font-bold">
            <Flame className="w-4 h-4 text-strava" />
            PYROFIT MVP // ATHLETE FUELING &amp; OUTBOUND TELEMETRY PLATFORM
          </div>
          <h1 className="italic-heavy text-3xl sm:text-4xl text-fg mt-1">
            PRECISION ENDURANCE <span className="text-strava">FUELING ENGINE</span>
          </h1>
          <p className="text-muted text-xs font-light mt-1 max-w-2xl">
            Real-time carbohydrate, sodium &amp; fluid calculations derived from sports science consensus, paired with strict outbound official manufacturer telemetry and ML post-workout feedback.
          </p>
        </div>

        {/* View Mode & Nav Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAndroidFrameMode(!androidFrameMode)}
            className={`px-3 py-2 border text-xs font-space font-bold uppercase transition-all flex items-center gap-1.5 ${
              androidFrameMode
                ? 'border-strava bg-strava text-on-brand'
                : 'border-border bg-surface text-muted hover:text-fg'
            }`}
            title="Toggle Android Device Frame Preview"
          >
            {androidFrameMode ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            <span>{androidFrameMode ? 'Android Frame' : 'Full Canvas'}</span>
          </button>
        </div>
      </div>

      {/* ── Feature Launcher Bar ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setAiCopilotOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 border border-strava/50 bg-strava/10 hover:bg-strava/20 text-strava text-[11px] font-space font-bold uppercase tracking-wider transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Sports Scientist
        </button>
        <button
          onClick={() => { setActiveScreen('strategy'); setTimeout(() => setLiveTimerOpen(true), 100); }}
          className="flex items-center gap-1.5 px-3 py-2 border border-sky-500/50 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[11px] font-space font-bold uppercase tracking-wider transition-all"
        >
          <Timer className="w-3.5 h-3.5" />
          Live Fueling Timer
        </button>
        <button
          onClick={() => setStackBuilderOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-space font-bold uppercase tracking-wider transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Custom Fuel Stack
        </button>
        <button
          onClick={() => setFeedbackModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-[11px] font-space font-bold uppercase tracking-wider transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Post-Workout Survey
        </button>
      </div>

      {/* Screen Navigation Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-surface border border-border mb-8 max-w-3xl">
        <button
          onClick={() => setActiveScreen('config')}
          className={`py-3 px-2 text-center text-xs font-space font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeScreen === 'config'
              ? 'bg-strava text-on-brand shadow-lg'
              : 'text-muted hover:text-fg'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Screen 1: Configurator</span>
        </button>

        <button
          onClick={() => setActiveScreen('strategy')}
          className={`py-3 px-2 text-center text-xs font-space font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeScreen === 'strategy'
              ? 'bg-strava text-on-brand shadow-lg'
              : 'text-muted hover:text-fg'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Screen 2: Fueling Strategy</span>
        </button>

        <button
          onClick={() => setActiveScreen('analytics')}
          className={`py-3 px-2 text-center text-xs font-space font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeScreen === 'analytics'
              ? 'bg-strava text-on-brand shadow-lg'
              : 'text-muted hover:text-fg'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Screen 4: B2B Telemetry</span>
        </button>
      </div>

      {/* Android Device Mockup Frame Container if active */}
      <div className={androidFrameMode ? 'flex justify-center' : ''}>
        <div
          className={
            androidFrameMode
              ? 'w-full max-w-md bg-black border-[10px] border-[#1e1e1e] rounded-[42px] shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden relative'
              : 'w-full'
          }
        >
          {/* Android Status Bar Simulation */}
          {androidFrameMode && (
            <div className="h-8 bg-black flex items-center justify-between px-6 text-[10px] text-faint font-space border-b border-border/40 select-none">
              <span>9:41 AM</span>
              <div className="w-20 h-4 bg-black rounded-b-xl border border-border/40 absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#111]"></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Screen Content Render */}
          <div className={androidFrameMode ? 'p-3 max-h-[800px] overflow-y-auto' : ''}>
            {activeScreen === 'config' && (
              <WorkoutConfigurator
                input={workoutInput}
                onChange={setWorkoutInput}
                onCalculate={() => setActiveScreen('strategy')}
                filterIsotonicOnly={profile.filter_isotonic_only}
              />
            )}

            {activeScreen === 'strategy' && (
              <FuelingStrategyView
                input={workoutInput}
                targets={targets}
                phasePlan={phasePlan}
                profile={profile}
                recommendedProducts={recommendedProducts}
                onBackToConfig={() => setActiveScreen('config')}
                onOpenFeedback={() => setFeedbackModalOpen(true)}
                onTelemetryRecorded={() => {}}
              />
            )}

            {activeScreen === 'analytics' && (
              <ManufacturerAnalyticsPortal
                onClose={() => setActiveScreen('strategy')}
              />
            )}
          </div>

          {/* Android Navigation Bar Simulation */}
          {androidFrameMode && (
            <div className="h-10 bg-black flex items-center justify-around px-8 border-t border-border/40 select-none">
              <span className="w-3.5 h-3.5 border-l-2 border-b-2 border-faint rotate-45"></span>
              <span className="w-3.5 h-3.5 border-2 border-faint rounded-full"></span>
              <span className="w-3.5 h-3.5 border-2 border-faint rounded-sm"></span>
            </div>
          )}
        </div>
      </div>

      {/* ── All Modals & Drawers ── */}

      {/* Screen 3: Post-Workout Adaptive Survey Modal */}
      <AdaptiveFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        workoutInput={workoutInput}
        currentProfile={profile}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* AI Sports Scientist Copilot Drawer */}
      <AICopilotDrawer
        isOpen={aiCopilotOpen}
        onClose={() => setAiCopilotOpen(false)}
        input={workoutInput}
        targets={targets}
        phasePlan={phasePlan}
        profile={profile}
      />

      {/* Live Fueling Timer */}
      <LiveFuelingTimer
        isOpen={liveTimerOpen}
        onClose={() => setLiveTimerOpen(false)}
        input={workoutInput}
        targets={targets}
        recommendedProducts={allDuringProducts}
      />

      {/* Custom Fuel Stack Builder */}
      <CustomFuelStackBuilder
        isOpen={stackBuilderOpen}
        onClose={() => setStackBuilderOpen(false)}
        targets={targets}
      />
    </div>
  );
};
