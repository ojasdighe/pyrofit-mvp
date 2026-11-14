import React, { useState } from 'react';
import {
  X,
  Zap,
  ShieldAlert,
  Flame,
  CheckCircle,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  AthleteProfileState,
  FeedbackOutcome,
  WorkoutInputVector,
} from '../../types/pyrofit';
import { applyAdaptiveFeedback } from '../../lib/fuelEngine';
import { sqliteEngine } from '../../lib/sqliteEngine';

interface AdaptiveFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutInput: WorkoutInputVector;
  currentProfile: AthleteProfileState;
  onProfileUpdated: (updated: AthleteProfileState, notes: string[]) => void;
}

export const AdaptiveFeedbackModal: React.FC<AdaptiveFeedbackModalProps> = ({
  isOpen,
  onClose,
  workoutInput,
  currentProfile,
  onProfileUpdated,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<FeedbackOutcome | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<{
    profile: AthleteProfileState;
    notes: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleApplyFeedback = (outcome: FeedbackOutcome) => {
    setSelectedOutcome(outcome);
    const { updatedProfile, appliedNotes } = applyAdaptiveFeedback(
      currentProfile,
      outcome,
      workoutInput
    );
    setFeedbackResult({ profile: updatedProfile, notes: appliedNotes });
    onProfileUpdated(updatedProfile, appliedNotes);

    // Persist to SQLite
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
    } catch {}
  };

  const handleResetProfile = () => {
    const resetProfile: AthleteProfileState = {
      ...currentProfile,
      carb_multiplier: 1.0,
      sodium_multiplier: 1.0,
      filter_isotonic_only: false,
    };
    setSelectedOutcome(null);
    setFeedbackResult(null);
    onProfileUpdated(resetProfile, ['Adaptive parameters reset to clean baseline (1.0x).']);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-carbon border border-border p-6 md:p-8 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted hover:text-fg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="text-strava font-space text-[9px] tracking-[0.5em] uppercase mb-1 font-bold">
            ADAPTIVE LEARNING LOOP // SECTION 6 ML ENGINE
          </div>
          <h2 className="italic-heavy text-3xl text-fg">
            POST-WORKOUT <span className="text-strava">QUALITATIVE SURVEY</span>
          </h2>
          <p className="text-muted text-xs font-light mt-1">
            Log your physiological sensations. The engine automatically recalibrates sodium, carbohydrate, and formulation filters for future sessions.
          </p>
        </div>

        {/* Current State Badges */}
        <div className="p-3 bg-surface border border-border flex items-center justify-between flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-3 text-xs font-space">
            <span className="text-faint">Carb Multiplier:</span>
            <strong className="text-strava">{currentProfile.carb_multiplier.toFixed(2)}x</strong>
            <span className="text-faint">|</span>
            <span className="text-faint">Sodium Multiplier:</span>
            <strong className="text-amber-400">{currentProfile.sodium_multiplier.toFixed(2)}x</strong>
            <span className="text-faint">|</span>
            <span className="text-faint">Hydrogel Lock:</span>
            <strong className={currentProfile.filter_isotonic_only ? 'text-sky-400' : 'text-faint'}>
              {currentProfile.filter_isotonic_only ? 'ACTIVE' : 'OFF'}
            </strong>
          </div>

          <button
            onClick={handleResetProfile}
            className="text-[10px] font-space text-faint hover:text-strava uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset Baselines
          </button>
        </div>

        {/* 4 Outcome Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Option 1: Severe Cramping */}
          <button
            type="button"
            onClick={() => handleApplyFeedback('CRAMPING')}
            className={`p-4 text-left border transition-all ${
              selectedOutcome === 'CRAMPING'
                ? 'border-amber-400 bg-amber-400/10 ring-1 ring-amber-400'
                : 'border-border bg-surface hover:border-amber-400/50'
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

          {/* Option 2: Stomach Bloating */}
          <button
            type="button"
            onClick={() => handleApplyFeedback('BLOATING')}
            className={`p-4 text-left border transition-all ${
              selectedOutcome === 'BLOATING'
                ? 'border-sky-400 bg-sky-400/10 ring-1 ring-sky-400'
                : 'border-border bg-surface hover:border-sky-400/50'
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

          {/* Option 3: Energy Crash */}
          <button
            type="button"
            onClick={() => handleApplyFeedback('CRASH')}
            className={`p-4 text-left border transition-all ${
              selectedOutcome === 'CRASH'
                ? 'border-strava bg-strava/10 ring-1 ring-strava'
                : 'border-border bg-surface hover:border-strava/50'
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
              Sudden deceleration, heavy brain fog, or legs running out of glycogen late in the run.
            </p>
          </button>

          {/* Option 4: Optimal */}
          <button
            type="button"
            onClick={() => handleApplyFeedback('OPTIMAL')}
            className={`p-4 text-left border transition-all ${
              selectedOutcome === 'OPTIMAL'
                ? 'border-emerald-400 bg-emerald-400/10 ring-1 ring-emerald-400'
                : 'border-border bg-surface hover:border-emerald-400/50'
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

        {/* Real-time Applied Action Banner */}
        {feedbackResult && (
          <div className="p-4 bg-surface border border-strava/40 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="text-xs font-space font-bold text-strava uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-strava" />
              Algorithm Recalibration Executed
            </div>
            <ul className="space-y-1">
              {feedbackResult.notes.map((note, idx) => (
                <li key={idx} className="text-xs text-muted font-light">
                  • {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-[10px] font-space text-faint uppercase">
            Total sessions adapted: {currentProfile.total_workouts_logged}
          </span>
          <button
            onClick={onClose}
            className="bg-strava italic-heavy text-on-brand py-3 px-8 text-sm font-bold hover:bg-white transition-colors flex items-center gap-1.5"
          >
            APPLY &amp; CONTINUE <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
