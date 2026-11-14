import React, { useState } from 'react';
import {
  Zap,
  ShieldAlert,
  Flame,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Loader2,
} from 'lucide-react';
import {
  AthleteProfileState,
  CalculatedHourlyTargets,
  FeedbackOutcome,
  WorkoutInputVector,
} from '../../types/pyrofit';
import { applyAdaptiveFeedback } from '../../lib/fuelEngine';
import { explainPostWorkoutSymptom } from '../../lib/aiCopilot';
import { sqliteEngine } from '../../lib/sqliteEngine';

interface FeedbackViewProps {
  workoutInput: WorkoutInputVector;
  targets: CalculatedHourlyTargets;
  currentProfile: AthleteProfileState;
  onProfileUpdated: (updated: AthleteProfileState, notes: string[]) => void;
}

const HISTORY_KEY = 'pyrofit_feedback_history_v1';
const PROFILE_KEY = 'pyrofit_athlete_profile_v1';

interface FeedbackHistoryEntry {
  id: string;
  timestamp: string;
  duration_mins: number;
  intensity: string;
  outcome: FeedbackOutcome;
  notes: string[];
}

function loadHistory(): FeedbackHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw) as FeedbackHistoryEntry[];
  } catch {
    // ignore corrupt data
  }
  return [];
}

function appendHistory(entry: FeedbackHistoryEntry) {
  const existing = loadHistory();
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...existing]));
}

const OUTCOME_COLOR: Record<FeedbackOutcome, { active: string; hover: string; text: string }> = {
  CRAMPING: {
    active: 'border-amber-400 bg-amber-400/10 ring-1 ring-amber-400',
    hover: 'border-border bg-surface hover:border-amber-400/50',
    text: 'text-amber-400',
  },
  BLOATING: {
    active: 'border-sky-400 bg-sky-400/10 ring-1 ring-sky-400',
    hover: 'border-border bg-surface hover:border-sky-400/50',
    text: 'text-sky-400',
  },
  CRASH: {
    active: 'border-strava bg-strava/10 ring-1 ring-strava',
    hover: 'border-border bg-surface hover:border-strava/50',
    text: 'text-strava',
  },
  OPTIMAL: {
    active: 'border-emerald-400 bg-emerald-400/10 ring-1 ring-emerald-400',
    hover: 'border-border bg-surface hover:border-emerald-400/50',
    text: 'text-emerald-400',
  },
};

const OUTCOME_SYMPTOM_MAP: Record<
  FeedbackOutcome,
  'SEVERE_CRAMPING' | 'STOMACH_BLOATING' | 'ENERGY_CRASH' | 'OPTIMAL_FUELING'
> = {
  CRAMPING: 'SEVERE_CRAMPING',
  BLOATING: 'STOMACH_BLOATING',
  CRASH: 'ENERGY_CRASH',
  OPTIMAL: 'OPTIMAL_FUELING',
};

const OUTCOME_BADGE_LABEL: Record<FeedbackOutcome, string> = {
  CRAMPING: 'CRAMPING',
  BLOATING: 'BLOATING',
  CRASH: 'CRASH',
  OPTIMAL: 'OPTIMAL',
};

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  workoutInput,
  targets,
  currentProfile,
  onProfileUpdated,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<FeedbackOutcome | null>(null);
  const [appliedNotes, setAppliedNotes] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiError, setAiError] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<FeedbackHistoryEntry[]>(loadHistory);

  const handleSelectOutcome = async (outcome: FeedbackOutcome) => {
    // 1. Apply adaptive feedback
    const { updatedProfile, appliedNotes: notes } = applyAdaptiveFeedback(
      currentProfile,
      outcome,
      workoutInput
    );

    // 2. Show notes banner
    setSelectedOutcome(outcome);
    setAppliedNotes(notes);
    setAiExplanation(null);
    setAiError(false);

    // 3. Notify parent
    onProfileUpdated(updatedProfile, notes);

    // 4. Persist AthleteProfileState to localStorage
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));

    // 4b. Also patch FullAthleteProfile multipliers so they stay in sync
    try {
      const rawFull = localStorage.getItem('pyrofit_full_profile_v2');
      if (rawFull) {
        const fullProfile = JSON.parse(rawFull);
        fullProfile.carb_multiplier = updatedProfile.carb_multiplier;
        fullProfile.sodium_multiplier = updatedProfile.sodium_multiplier;
        fullProfile.filter_isotonic_only = updatedProfile.filter_isotonic_only;
        fullProfile.historical_cramping = updatedProfile.historical_cramping;
        fullProfile.total_workouts_logged = updatedProfile.total_workouts_logged;
        localStorage.setItem('pyrofit_full_profile_v2', JSON.stringify(fullProfile));
      }
    } catch {
      // non-fatal
    }

    // 5. Log to SQLite
    try {
      sqliteEngine.logFeedbackUpdate({
        athlete_id: currentProfile.athlete_id,
        outcome,
        workout_duration: workoutInput.workout_duration_mins,
        workout_intensity: workoutInput.intensity_level,
        workout_temp: workoutInput.temperature_celsius,
        carb_multiplier_before: currentProfile.carb_multiplier,
        carb_multiplier_after: updatedProfile.carb_multiplier,
        sodium_multiplier_before: currentProfile.sodium_multiplier,
        sodium_multiplier_after: updatedProfile.sodium_multiplier,
        isotonic_locked: updatedProfile.filter_isotonic_only,
      });
    } catch {
      // non-fatal
    }

    // 6. Append to localStorage history
    const entry: FeedbackHistoryEntry = {
      id: `fb_${Date.now()}`,
      timestamp: new Date().toISOString(),
      duration_mins: workoutInput.workout_duration_mins,
      intensity: workoutInput.intensity_level,
      outcome,
      notes,
    };
    appendHistory(entry);
    setHistoryEntries(loadHistory());

    // 7. Show AI loading spinner
    setAiLoading(true);

    // 8. Call explainPostWorkoutSymptom
    try {
      const explanation = await explainPostWorkoutSymptom(
        OUTCOME_SYMPTOM_MAP[outcome],
        workoutInput,
        targets,
        currentProfile
      );
      setAiExplanation(explanation);
    } catch {
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  };

  const handleResetBaselines = () => {
    const resetProfile: AthleteProfileState = {
      ...currentProfile,
      carb_multiplier: 1.0,
      sodium_multiplier: 1.0,
      filter_isotonic_only: false,
    };
    setSelectedOutcome(null);
    setAppliedNotes([]);
    setAiExplanation(null);
    setAiError(false);
    onProfileUpdated(resetProfile, ['Adaptive parameters reset to clean baseline (1.0x).']);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(resetProfile));
  };

  const last5 = historyEntries.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ── Current Adaptive State Panel ── */}
      <div className="bg-carbon border border-border p-5">
        <div className="text-strava font-space text-[9px] tracking-[0.5em] uppercase mb-3 font-bold">
          ADAPTIVE STATE // CURRENT PROFILE MULTIPLIERS
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {/* Carb Multiplier */}
          <div className="bg-surface border border-strava/30 p-3 text-center">
            <div className="text-[9px] font-space text-faint uppercase tracking-widest mb-1">
              Carb Multiplier
            </div>
            <div className="text-xl font-space font-bold text-strava">
              {currentProfile.carb_multiplier.toFixed(2)}x
            </div>
          </div>

          {/* Sodium Multiplier */}
          <div className="bg-surface border border-amber-400/30 p-3 text-center">
            <div className="text-[9px] font-space text-faint uppercase tracking-widest mb-1">
              Sodium Multiplier
            </div>
            <div className="text-xl font-space font-bold text-amber-400">
              {currentProfile.sodium_multiplier.toFixed(2)}x
            </div>
          </div>

          {/* Hydrogel Lock */}
          <div className="bg-surface border border-sky-400/20 p-3 text-center">
            <div className="text-[9px] font-space text-faint uppercase tracking-widest mb-1">
              Hydrogel Lock
            </div>
            <div
              className={`text-xl font-space font-bold ${
                currentProfile.filter_isotonic_only ? 'text-sky-400' : 'text-faint'
              }`}
            >
              {currentProfile.filter_isotonic_only ? 'ACTIVE' : 'OFF'}
            </div>
          </div>

          {/* Total Sessions */}
          <div className="bg-surface border border-border p-3 text-center">
            <div className="text-[9px] font-space text-faint uppercase tracking-widest mb-1">
              Total Sessions
            </div>
            <div className="text-xl font-space font-bold text-fg">
              {currentProfile.total_workouts_logged}
            </div>
          </div>
        </div>

        <button
          onClick={handleResetBaselines}
          className="text-[10px] font-space text-faint hover:text-strava uppercase tracking-wider flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset Baselines
        </button>
      </div>

      {/* ── 4 Outcome Cards ── */}
      <div>
        <div className="text-strava font-space text-[9px] tracking-[0.5em] uppercase mb-3 font-bold">
          POST-WORKOUT QUALITATIVE SURVEY
        </div>
        <p className="text-muted text-xs font-light mb-4">
          Log your physiological sensations. The engine automatically recalibrates sodium,
          carbohydrate, and formulation filters for future sessions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* CRAMPING */}
          <button
            type="button"
            onClick={() => handleSelectOutcome('CRAMPING')}
            className={`p-4 text-left border transition-all ${
              selectedOutcome === 'CRAMPING'
                ? OUTCOME_COLOR.CRAMPING.active
                : OUTCOME_COLOR.CRAMPING.hover
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-[9px] font-space text-amber-400 font-bold uppercase">
                +15% Sodium
              </span>
            </div>
            <div className="italic-heavy text-lg text-fg">Severe Muscle Cramping</div>
            <p className="text-xs text-muted font-light mt-1 leading-snug">
              Involuntary calf, quad, or hamstring twitches or lock-ups during or post-workout.
            </p>
          </button>

          {/* BLOATING */}
          <button
            type="button"
            onClick={() => handleSelectOutcome('BLOATING')}
            className={`p-4 text-left border transition-all ${
              selectedOutcome === 'BLOATING'
                ? OUTCOME_COLOR.BLOATING.active
                : OUTCOME_COLOR.BLOATING.hover
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <ShieldAlert className="w-5 h-5 text-sky-400" />
              <span className="text-[9px] font-space text-sky-400 font-bold uppercase">
                Hydrogel Lock
              </span>
            </div>
            <div className="italic-heavy text-lg text-fg">Stomach Sloshing / Bloat</div>
            <p className="text-xs text-muted font-light mt-1 leading-snug">
              Gastric distress, fullness, nausea, or delayed stomach emptying under heat.
            </p>
          </button>

          {/* CRASH */}
          <button
            type="button"
            onClick={() => handleSelectOutcome('CRASH')}
            className={`p-4 text-left border transition-all ${
              selectedOutcome === 'CRASH'
                ? OUTCOME_COLOR.CRASH.active
                : OUTCOME_COLOR.CRASH.hover
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-strava" />
              <span className="text-[9px] font-space text-strava font-bold uppercase">
                +15% Carbs
              </span>
            </div>
            <div className="italic-heavy text-lg text-fg">Energy Crash / Bonk</div>
            <p className="text-xs text-muted font-light mt-1 leading-snug">
              Sudden deceleration, heavy brain fog, or legs running out of glycogen late in the
              run.
            </p>
          </button>

          {/* OPTIMAL */}
          <button
            type="button"
            onClick={() => handleSelectOutcome('OPTIMAL')}
            className={`p-4 text-left border transition-all ${
              selectedOutcome === 'OPTIMAL'
                ? OUTCOME_COLOR.OPTIMAL.active
                : OUTCOME_COLOR.OPTIMAL.hover
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-[9px] font-space text-emerald-400 font-bold uppercase">
                Validated
              </span>
            </div>
            <div className="italic-heavy text-lg text-fg">Optimal Gut &amp; Energy</div>
            <p className="text-xs text-muted font-light mt-1 leading-snug">
              Steady pacing, zero gastrointestinal issues, strong finish feeling energized.
            </p>
          </button>
        </div>
      </div>

      {/* ── Applied Notes Banner ── */}
      {appliedNotes.length > 0 && (
        <div className="p-4 bg-surface border border-strava/40 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="text-xs font-space font-bold text-strava uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-strava" />
            Algorithm Recalibration Executed
          </div>
          <ul className="space-y-1">
            {appliedNotes.map((note, idx) => (
              <li key={idx} className="text-xs text-muted font-light">
                • {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── AI Physiologist Panel ── */}
      {aiLoading && (
        <div className="p-4 bg-surface border border-border flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-strava animate-spin flex-shrink-0" />
          <span className="text-sm text-muted font-light">
            AI Sports Physiologist analyzing...
          </span>
        </div>
      )}

      {!aiLoading && aiExplanation && (
        <div className="p-5 bg-surface border border-border space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-strava" />
            <span className="text-xs font-space font-bold text-strava uppercase tracking-widest">
              Physiological Analysis
            </span>
          </div>
          <p className="text-sm text-fg font-light leading-relaxed whitespace-pre-wrap">
            {aiExplanation}
          </p>
        </div>
      )}

      {!aiLoading && aiError && (
        <div className="p-4 bg-surface border border-amber-400/30 text-xs text-amber-400 font-light">
          AI explanation unavailable — check your connection to the FreeLLM API.
        </div>
      )}

      {/* ── Feedback History Panel ── */}
      <div className="bg-carbon border border-border p-5">
        <div className="text-strava font-space text-[9px] tracking-[0.5em] uppercase mb-4 font-bold">
          FEEDBACK HISTORY // LAST 5 SESSIONS
        </div>

        {last5.length === 0 ? (
          <p className="text-xs text-faint font-light">No feedback sessions logged yet.</p>
        ) : (
          <div className="space-y-3">
            {last5.map((entry) => {
              const color = OUTCOME_COLOR[entry.outcome];
              const notesText = entry.notes.join(' • ');
              const truncated =
                notesText.length > 80 ? notesText.slice(0, 80) + '…' : notesText;

              return (
                <div
                  key={entry.id}
                  className="bg-surface border border-border p-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2"
                >
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[9px] font-space font-bold uppercase px-2 py-0.5 border ${color.text} ${
                        entry.outcome === 'CRAMPING'
                          ? 'border-amber-400/40 bg-amber-400/10'
                          : entry.outcome === 'BLOATING'
                          ? 'border-sky-400/40 bg-sky-400/10'
                          : entry.outcome === 'CRASH'
                          ? 'border-strava/40 bg-strava/10'
                          : 'border-emerald-400/40 bg-emerald-400/10'
                      }`}
                    >
                      {OUTCOME_BADGE_LABEL[entry.outcome]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] font-space text-faint">
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      <span>Intensity: {entry.intensity}</span>
                      <span>{entry.duration_mins} min</span>
                    </div>
                    {truncated && (
                      <p className="text-xs text-muted font-light leading-snug">{truncated}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
