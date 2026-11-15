import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Sliders,
  Sparkles,
  RotateCcw,
  BarChart3,
  BarChart2,
  CheckCircle,
  Zap,
  Timer,
  ShoppingCart,
  MessageSquare,
  User,
  ChevronDown,
  ChevronUp,
  Download,
  Gauge,
} from 'lucide-react';
import {
  AthleteProfileState,
  CalculatedHourlyTargets,
  WorkoutInputVector,
  FullAthleteProfile,
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
import { RaceSimulator } from './RaceSimulator';
import { AthleteProfileView, computeProfileCompleteness, getMissingProfileFields } from './AthleteProfileView';
import { ProductCompareView } from './ProductCompareView';
import { FeedbackView } from './FeedbackView';

type HubView = 'profile' | 'planner' | 'compare' | 'feedback' | 'analytics';
type PlannerScreen = 'config' | 'strategy';

// ── Profile mapper ────────────────────────────────────────────────────────────
const profileToAthleteState = (fp: FullAthleteProfile): AthleteProfileState => ({
  athlete_id: fp.athlete_id,
  athlete_weight_kg: fp.weight_kg,
  carb_multiplier: fp.carb_multiplier,
  sodium_multiplier: fp.sodium_multiplier,
  filter_isotonic_only: fp.filter_isotonic_only,
  historical_cramping: fp.historical_cramping,
  total_workouts_logged: fp.total_workouts_logged,
});

interface PyrofitHubProps {
  onBackToMain?: () => void;
}

export const PyrofitHub: React.FC<PyrofitHubProps> = () => {
  // ── Full profile from localStorage ───────────────────────────────────────
  const [fullProfile, setFullProfile] = useState<FullAthleteProfile | null>(() => {
    try {
      const raw = localStorage.getItem('pyrofit_full_profile_v2');
      if (raw) return JSON.parse(raw) as FullAthleteProfile;
    } catch {}
    return null;
  });

  // ── Has calculated at least once ─────────────────────────────────────────
  // Decision: this flag is intentionally never reset on profile save/update.
  // Its purpose is to ensure the user has run the workflow end-to-end at least
  // once before advanced features unlock. Because there is no profile-deletion
  // UI, the flag is only ever meaningful in the forward direction (first use).
  const [hasCalculated, setHasCalculated] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem('pyrofit_has_calculated') ?? 'false');
    } catch {
      return false;
    }
  });

  // ── Active view: default to 'profile' when no profile exists ─────────────
  const [activeView, setActiveView] = useState<HubView>(() =>
    fullProfile ? 'planner' : 'profile'
  );

  // ── Planner sub-screen ────────────────────────────────────────────────────
  const [plannerScreen, setPlannerScreen] = useState<PlannerScreen>('config');

  // ── Derived AthleteProfileState ───────────────────────────────────────────
  const [profile, setProfile] = useState<AthleteProfileState>(() => {
    if (fullProfile) return profileToAthleteState(fullProfile);
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

  // ── Workout input ─────────────────────────────────────────────────────────
  const [workoutInput, setWorkoutInput] = useState<WorkoutInputVector>({
    workout_duration_mins: 150,
    intensity_level: 'HIGH',
    temperature_celsius: 32,
    cramping_history: true,
    athlete_weight_kg: fullProfile?.weight_kg ?? 68,
    budget_tier_preference: 'ALL',
    session_type: 'Training',
    terrain: 'Road',
    fluid_access: 'Full',
  });

  // ── Modal states ──────────────────────────────────────────────────────────
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [liveTimerOpen, setLiveTimerOpen] = useState(false);
  const [stackBuilderOpen, setStackBuilderOpen] = useState(false);
  const [raceSimOpen, setRaceSimOpen] = useState(false);

  // ── Session history ───────────────────────────────────────────────────────
  const [sessionHistoryOpen, setSessionHistoryOpen] = useState(false);
  const [recentSessions, setRecentSessions] = useState<Record<string, any>[]>(() =>
    sqliteEngine.getWorkoutSessions(5)
  );

  // ── Race countdown ────────────────────────────────────────────────────────
  const [raceCountdown, setRaceCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);

  // ── Sweat rate injection + targets ───────────────────────────────────────
  const inputWithSweatRate = fullProfile?.sweat_rate_l_hr
    ? { ...workoutInput, _sweat_rate_l_hr: fullProfile.sweat_rate_l_hr }
    : workoutInput;
  const targets: CalculatedHourlyTargets = calculateHourlyTargets(
    inputWithSweatRate as WorkoutInputVector,
    profile
  );
  const phasePlan = allocate3PhaseStrategy(workoutInput, targets, profile);
  const recommendedProducts = getRecommendedProductPlan(targets, phasePlan, workoutInput, profile);

  const allDuringProducts = [
    ...recommendedProducts.duringGels,
    ...recommendedProducts.duringHydration,
  ];

  // ── Profile completeness badge ────────────────────────────────────────────
  const completeness = fullProfile ? computeProfileCompleteness(fullProfile) : 0;
  const missingFields = fullProfile ? getMissingProfileFields(fullProfile) : [];
  const pillColor =
    completeness >= 80
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
      : completeness >= 50
      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
      : 'bg-red-500/20 text-red-400 border-red-500/40';

  // ── Profile sync effect ───────────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem('pyrofit_athlete_profile_v1', JSON.stringify(profile));
      sqliteEngine.syncAthleteProfile(profile);
    } catch {}
  }, [profile]);

  // ── Race countdown effect ─────────────────────────────────────────────────
  useEffect(() => {
    if (!fullProfile?.event_date) {
      setRaceCountdown(null);
      return;
    }
    const update = () => {
      const now = Date.now();
      const target = new Date(fullProfile.event_date!).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setRaceCountdown(null);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setRaceCountdown({ days, hours, minutes });
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [fullProfile?.event_date]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleProfileSaved = (fp: FullAthleteProfile) => {
    localStorage.setItem('pyrofit_full_profile_v2', JSON.stringify(fp));
    setFullProfile(fp);
    setProfile(profileToAthleteState(fp));
    setActiveView('planner');
  };

  const handleProfileUpdated = (updated: AthleteProfileState, _notes?: string[]) => {
    setProfile(updated);
  };

  const handleCalculate = () => {
    sqliteEngine.logWorkoutSession({
      session_id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      athlete_id: profile.athlete_id,
      duration_mins: workoutInput.workout_duration_mins,
      intensity_level: workoutInput.intensity_level,
      temp_celsius: workoutInput.temperature_celsius,
      env_factor: targets.environmental_factor_E,
      carbs_hourly_g: targets.carbs_hourly_g,
      sodium_hourly_mg: targets.sodium_hourly_mg,
      fluids_hourly_ml: targets.fluids_hourly_ml,
      budget_tier: workoutInput.budget_tier_preference,
      cramping_history: workoutInput.cramping_history,
      session_type: workoutInput.session_type,
      terrain: workoutInput.terrain,
      distance_km: workoutInput.distance_km,
    });
    setRecentSessions(sqliteEngine.getWorkoutSessions(5));
    setPlannerScreen('strategy');
    setHasCalculated(true);
    localStorage.setItem('pyrofit_has_calculated', 'true');
  };

  const handleLoadSession = (sess: Record<string, any>) => {
    setWorkoutInput((prev) => ({
      ...prev,
      workout_duration_mins: sess.duration_mins,
      intensity_level: sess.intensity_level,
      temperature_celsius: sess.temp_celsius,
      cramping_history: sess.cramping_history === 1,
      budget_tier_preference: sess.budget_tier ?? 'ALL',
      session_type: sess.session_type ?? 'Training',
      terrain: sess.terrain ?? 'Road',
    }));
    setPlannerScreen('config');
  };

  // ── Race countdown banner helpers ─────────────────────────────────────────
  const eventDatePast =
    fullProfile?.event_date
      ? new Date(fullProfile.event_date).getTime() <= Date.now()
      : false;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Platform Title */}
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
      </div>

      {/* Race Countdown Banner */}
      {fullProfile?.event_date && (
        <div className="mb-4">
          {eventDatePast ? (
            <div className="px-4 py-2 bg-surface border border-border text-xs font-space text-muted">
              Race completed — log your feedback
            </div>
          ) : raceCountdown && raceCountdown.days <= 7 ? (
            <div className="px-4 py-2.5 bg-amber-500/15 border border-amber-500/50 text-amber-400 text-xs font-space font-bold flex items-center gap-2">
              🏁 RACE WEEK — {raceCountdown.days}d {raceCountdown.hours}h {raceCountdown.minutes}m to{' '}
              {fullProfile.event_date}
            </div>
          ) : raceCountdown ? (
            <div className="px-4 py-2 bg-strava/10 border border-strava/30 text-strava text-xs font-space font-bold">
              🏁 Race in {raceCountdown.days}d {raceCountdown.hours}h {raceCountdown.minutes}m
            </div>
          ) : null}
        </div>
      )}

      {/* First-open welcome card OR normal flow */}
      {!fullProfile ? (
        <div className="mb-8 p-8 bg-strava/5 border-2 border-strava/40 text-center space-y-5">
          <div className="text-strava font-space text-[10px] tracking-[0.5em] uppercase font-bold flex items-center justify-center gap-2">
            <Flame className="w-4 h-4" /> WELCOME TO PYROFIT
          </div>
          <h2 className="italic-heavy text-3xl text-fg">Set up in <span className="text-strava">60 seconds</span></h2>
          <p className="text-muted text-sm font-light max-w-lg mx-auto">
            Tell us about yourself and we'll calculate exact carb, sodium, and fluid targets personalised to your body and training load.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-left">
            <div className="p-3 bg-surface border border-border">
              <div className="text-strava font-space text-[10px] font-bold uppercase tracking-wider mb-1">Step 1</div>
              <div className="text-fg text-xs font-space">Fill in your Athlete Profile (sport, weight, goals)</div>
            </div>
            <div className="p-3 bg-surface border border-border">
              <div className="text-strava font-space text-[10px] font-bold uppercase tracking-wider mb-1">Step 2</div>
              <div className="text-fg text-xs font-space">Configure your session (duration, intensity, temp)</div>
            </div>
            <div className="p-3 bg-surface border border-border">
              <div className="text-strava font-space text-[10px] font-bold uppercase tracking-wider mb-1">Step 3</div>
              <div className="text-fg text-xs font-space">Get exact targets + product recommendations</div>
            </div>
          </div>
          <button
            onClick={() => setActiveView('profile')}
            className="bg-strava text-on-brand italic-heavy px-10 py-4 text-base font-black uppercase tracking-wider hover:bg-white transition-colors shadow-[0_12px_40px_rgba(255,107,26,0.3)]"
          >
            START: BUILD YOUR PROFILE →
          </button>
        </div>
      ) : (
        <>
          {/* Feature Launcher Bar */}
          <div className="flex flex-wrap gap-2 mb-6">
            {hasCalculated ? (
              <>
                <button
                  onClick={() => setAiCopilotOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-strava/50 bg-strava/10 hover:bg-strava/20 text-strava text-[11px] font-space font-bold uppercase tracking-wider transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Sports Scientist
                </button>
                <button
                  onClick={() => {
                    if (activeView !== 'planner') setActiveView('planner');
                    setPlannerScreen('strategy');
                    setTimeout(() => setLiveTimerOpen(true), 100);
                  }}
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
                  onClick={() => setRaceSimOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-strava/50 bg-strava/10 hover:bg-strava/20 text-strava text-[11px] font-space font-bold uppercase tracking-wider transition-all"
                >
                  <Gauge className="w-3.5 h-3.5" />
                  Race Simulator
                </button>
                <button
                  onClick={() => setFeedbackModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-[11px] font-space font-bold uppercase tracking-wider transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Post-Workout Survey
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-surface border border-border w-full">
                <Sliders className="w-4 h-4 text-strava shrink-0" />
                <span className="text-xs font-space text-muted">
                  <span className="text-fg font-bold">Calculate your first session</span> to unlock AI Sports Scientist, Live Timer, Custom Fuel Stack, Race Simulator, and Post-Workout Survey.
                </span>
                <button
                  onClick={() => setActiveView('planner')}
                  className="ml-auto shrink-0 px-4 py-2 bg-strava text-on-brand text-[11px] font-space font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Session Planner →
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* 5-Tab Navigation — only shown when profile exists */}
      {fullProfile && (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 bg-surface border border-border mb-8">
        {/* Profile tab */}
        <button
          onClick={() => setActiveView('profile')}
          className={`py-3 px-2 text-center text-xs font-space font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'profile'
              ? 'bg-strava text-on-brand shadow-lg'
              : 'text-muted hover:text-fg'
          }`}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span>Athlete Profile</span>
          {completeness > 0 && (
            <span
              className={`ml-1 px-1.5 py-0.5 text-[9px] border font-bold rounded-sm ${pillColor}`}
              title={missingFields.length > 0 ? `Missing: ${missingFields.slice(0, 5).join(', ')}` : 'Profile complete'}
            >
              {completeness}%
            </span>
          )}
        </button>

        {/* Planner tab */}
        <button
          onClick={() => setActiveView('planner')}
          className={`py-3 px-2 text-center text-xs font-space font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'planner'
              ? 'bg-strava text-on-brand shadow-lg'
              : 'text-muted hover:text-fg'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 shrink-0" />
          <span>Session Planner</span>
        </button>

        {/* Compare tab */}
        <button
          onClick={() => setActiveView('compare')}
          className={`py-3 px-2 text-center text-xs font-space font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'compare'
              ? 'bg-strava text-on-brand shadow-lg'
              : 'text-muted hover:text-fg'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 shrink-0" />
          <span>Product Compare</span>
        </button>

        {/* Post-workout tab */}
        <button
          onClick={() => setActiveView('feedback')}
          className={`py-3 px-2 text-center text-xs font-space font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'feedback'
              ? 'bg-strava text-on-brand shadow-lg'
              : 'text-muted hover:text-fg'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span>Post-Workout</span>
        </button>

        {/* Analytics tab */}
        <button
          onClick={() => setActiveView('analytics')}
          className={`py-3 px-2 text-center text-xs font-space font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'analytics'
              ? 'bg-strava text-on-brand shadow-lg'
              : 'text-muted hover:text-fg'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 shrink-0" />
          <span>History &amp; Data</span>
        </button>
      </div>
      )}

      {/* ── View Content ─────────────────────────────────────────────────────── */}

      {/* Profile View */}
      {activeView === 'profile' && (
        <AthleteProfileView
          initialProfile={fullProfile}
          onProfileSaved={handleProfileSaved}
        />
      )}

      {/* Planner View */}
      {activeView === 'planner' && (
        <div className="space-y-4">
          {/* Sweat rate override badge */}
          {fullProfile?.sweat_rate_l_hr && (
            <div className="px-4 py-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-space font-bold flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Custom sweat rate: {fullProfile.sweat_rate_l_hr} L/hr — fluid formula overridden
            </div>
          )}

          {/* Planner screens */}
          {plannerScreen === 'config' && (
            <WorkoutConfigurator
              input={workoutInput}
              onChange={setWorkoutInput}
              onCalculate={handleCalculate}
              filterIsotonicOnly={profile.filter_isotonic_only}
            />
          )}

          {plannerScreen === 'strategy' && (
            <FuelingStrategyView
              input={workoutInput}
              targets={targets}
              phasePlan={phasePlan}
              profile={profile}
              recommendedProducts={recommendedProducts}
              onBackToConfig={() => setPlannerScreen('config')}
              onOpenFeedback={() => setFeedbackModalOpen(true)}
              onTelemetryRecorded={() => {}}
            />
          )}

          {/* Session History Panel */}
          <div className="bg-surface border border-border">
            <button
              onClick={() => setSessionHistoryOpen(!sessionHistoryOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-space font-bold uppercase tracking-wider text-muted hover:text-fg transition-colors"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5" />
                Recent Sessions ({recentSessions.length})
              </span>
              {sessionHistoryOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {sessionHistoryOpen && (
              <div className="border-t border-border overflow-x-auto">
                {recentSessions.length === 0 ? (
                  <p className="p-4 text-center text-xs font-space text-faint">
                    No sessions logged yet. Click Calculate to record your first session.
                  </p>
                ) : (
                  <table className="w-full text-left text-xs font-space border-collapse">
                    <thead>
                      <tr className="bg-carbon text-faint uppercase text-[10px] border-b border-border">
                        <th className="p-3">Date / Time</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Intensity</th>
                        <th className="p-3">Temp</th>
                        <th className="p-3">Carbs/hr</th>
                        <th className="p-3">Sodium/hr</th>
                        <th className="p-3">Type</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentSessions.map((sess) => (
                        <tr key={sess.session_id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 text-faint whitespace-nowrap">
                            {sess.created_at
                              ? new Date(sess.created_at).toLocaleString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </td>
                          <td className="p-3">{sess.duration_mins}m</td>
                          <td className="p-3 text-strava font-bold">{sess.intensity_level}</td>
                          <td className="p-3">{sess.temp_celsius}°C</td>
                          <td className="p-3 text-strava">{sess.carbs_hourly_g}g</td>
                          <td className="p-3 text-amber-400">{sess.sodium_hourly_mg}mg</td>
                          <td className="p-3 text-muted">{sess.session_type ?? 'Training'}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleLoadSession(sess)}
                              className="px-2 py-1 text-[10px] font-space font-bold uppercase border border-border bg-carbon text-muted hover:text-fg hover:border-strava transition-all"
                            >
                              Load
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compare View */}
      {activeView === 'compare' && (
        <ProductCompareView athleteProfile={fullProfile} />
      )}

      {/* Feedback View */}
      {activeView === 'feedback' && (
        <FeedbackView
          workoutInput={workoutInput}
          targets={targets}
          currentProfile={profile}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <ManufacturerAnalyticsPortal onClose={() => setActiveView('planner')} />
      )}

      {/* ── Modals & Drawers ── */}

      <AdaptiveFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        workoutInput={workoutInput}
        currentProfile={profile}
        onProfileUpdated={handleProfileUpdated}
      />

      <AICopilotDrawer
        isOpen={aiCopilotOpen}
        onClose={() => setAiCopilotOpen(false)}
        input={workoutInput}
        targets={targets}
        phasePlan={phasePlan}
        profile={profile}
      />

      <LiveFuelingTimer
        isOpen={liveTimerOpen}
        onClose={() => setLiveTimerOpen(false)}
        input={workoutInput}
        targets={targets}
        recommendedProducts={allDuringProducts}
      />

      <CustomFuelStackBuilder
        isOpen={stackBuilderOpen}
        onClose={() => setStackBuilderOpen(false)}
        targets={targets}
      />

      {raceSimOpen && (
        <RaceSimulator
          isOpen={raceSimOpen}
          onClose={() => setRaceSimOpen(false)}
          input={workoutInput}
          targets={targets}
        />
      )}
    </div>
  );
};
