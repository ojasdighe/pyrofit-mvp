import React, { useState } from 'react';
import { X, Thermometer, TrendingDown, AlertTriangle, Gauge } from 'lucide-react';
import { WorkoutInputVector, CalculatedHourlyTargets, AthleteProfileState } from '../../types/pyrofit';
import { calculateHourlyTargets } from '../../lib/fuelEngine';

interface RaceSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  input: WorkoutInputVector;
  targets: CalculatedHourlyTargets;
}

export const RaceSimulator: React.FC<RaceSimulatorProps> = ({
  isOpen,
  onClose,
  input,
  targets,
}) => {
  const [racePos, setRacePos] = useState(0);
  const [heatSpike, setHeatSpike] = useState(false);
  const [paceDown, setPaceDown] = useState(false);
  const [stomachStress, setStomachStress] = useState(false);

  if (!isOpen) return null;

  // Live recalculation
  const baseProfile: AthleteProfileState = {
    carb_multiplier: 1.0,
    sodium_multiplier: 1.0,
    filter_isotonic_only: false,
    historical_cramping: false,
    athlete_weight_kg: input.athlete_weight_kg,
    athlete_id: 'sim',
    total_workouts_logged: 0,
  };

  const simTemp = input.temperature_celsius + (heatSpike ? 4 : 0);
  const simInput: WorkoutInputVector = { ...input, temperature_celsius: simTemp };
  let simTargets = calculateHourlyTargets(simInput, baseProfile);

  // Stomach stress: cap carbs at 60g/hr
  if (stomachStress) {
    simTargets = { ...simTargets, carbs_hourly_g: Math.min(simTargets.carbs_hourly_g, 60) };
  }

  // Pace drop: reduce carbs proportionally (intensity modifier -0.15, floor 0.6)
  if (paceDown) {
    const origI = targets.intensity_modifier;
    const newI = Math.max(0.6, origI - 0.15);
    const ratio = origI > 0 ? newI / origI : 1;
    simTargets = { ...simTargets, carbs_hourly_g: Math.round(simTargets.carbs_hourly_g * ratio) };
  }

  // Deltas
  const carbsDelta =
    targets.carbs_hourly_g > 0
      ? Math.round(((simTargets.carbs_hourly_g - targets.carbs_hourly_g) / targets.carbs_hourly_g) * 100)
      : 0;
  const sodiumDelta =
    targets.sodium_hourly_mg > 0
      ? Math.round(((simTargets.sodium_hourly_mg - targets.sodium_hourly_mg) / targets.sodium_hourly_mg) * 100)
      : 0;
  const fluidsDelta =
    targets.fluids_hourly_ml > 0
      ? Math.round(((simTargets.fluids_hourly_ml - targets.fluids_hourly_ml) / targets.fluids_hourly_ml) * 100)
      : 0;

  const anyToggle = heatSpike || paceDown || stomachStress;

  // Directive construction
  const directiveLines: string[] = [];
  if (anyToggle) {
    directiveLines.push(
      `⚡ RACE ALERT — ${racePos} min mark${heatSpike ? ' // Heat Spike' : ''}${paceDown ? ' // Pace Drop' : ''}${stomachStress ? ' // GI Stress' : ''}`
    );
    directiveLines.push('');
    directiveLines.push('IMMEDIATE ACTIONS:');
    if (stomachStress) {
      directiveLines.push('• Avoid solid bars — absorption ceiling dropped to 60g/hr');
      directiveLines.push('• Switch to isotonic gel only (25-30g carbs per serving)');
    }
    if (heatSpike) {
      directiveLines.push(
        `• Increase fluid intake: target now ${simTargets.fluids_hourly_ml}ml/hr (${fluidsDelta > 0 ? '+' : ''}${fluidsDelta}%)`
      );
    }
    if (sodiumDelta > 10) {
      directiveLines.push(`• Add electrolyte supplement — sodium now ${simTargets.sodium_hourly_mg}mg/hr`);
    }
    if (carbsDelta < -10) {
      directiveLines.push('• Take gel NOW — carb target reduced, increase frequency to maintain total intake');
    }
    if (paceDown && !stomachStress) {
      directiveLines.push('• Maintain fueling cadence despite pace drop — glycogen debt accumulates silently');
    }
    directiveLines.push('');
    directiveLines.push(`NEXT CHECK-IN: ${racePos + 15} min mark`);
  }

  const toggleClass = (active: boolean) =>
    active
      ? 'border-strava bg-strava/10 text-strava'
      : 'border-border bg-surface text-muted hover:border-border-bright hover:text-fg';

  const deltaDisplay = (delta: number, color: string) => {
    if (delta > 0)
      return <span className="text-red-400 font-bold font-space text-xs">+{delta}%</span>;
    if (delta < 0)
      return <span className="text-emerald-400 font-bold font-space text-xs">{delta}%</span>;
    return <span className={`${color} font-bold font-space text-xs`}>=</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-carbon border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-strava font-space text-[10px] tracking-[0.4em] uppercase font-bold mb-1">
              <Gauge className="w-4 h-4" />
              PYROFIT // RACE DAY
            </div>
            <h2 className="italic-heavy text-2xl text-strava">RACE DAY SIMULATOR</h2>
            <p className="text-muted text-xs font-space mt-1">
              Stress-test your fueling plan against race-day scenarios
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-fg transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Race Position Slider */}
          <div className="p-4 bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-space tracking-wider uppercase text-strava font-bold">
                Race Position
              </label>
              <span className="text-sm font-space font-bold text-fg">
                {racePos} min (~{(racePos / 10).toFixed(1)} mi)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={input.workout_duration_mins}
              step={5}
              value={racePos}
              onChange={(e) => setRacePos(parseInt(e.target.value, 10))}
              className="w-full accent-strava cursor-pointer h-2 bg-carbon"
            />
            <div className="bg-surface border border-border h-2 w-full">
              <div
                className="bg-strava h-2 transition-all"
                style={{ width: `${(racePos / input.workout_duration_mins) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-space text-faint">
              <span>Start</span>
              <span>Finish ({input.workout_duration_mins} min)</span>
            </div>
          </div>

          {/* Scenario Toggles */}
          <div className="space-y-2">
            <label className="block text-xs font-space tracking-wider uppercase text-strava font-bold">
              Race Scenarios
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Heat Spike */}
              <button
                type="button"
                onClick={() => setHeatSpike((v) => !v)}
                className={`p-3 text-left border transition-all ${toggleClass(heatSpike)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span className="italic-heavy text-sm">HEAT SPIKE</span>
                </div>
                <div className="text-[10px] font-space text-muted">+4°C added to ambient temperature</div>
              </button>

              {/* Pace Drop */}
              <button
                type="button"
                onClick={() => setPaceDown((v) => !v)}
                className={`p-3 text-left border transition-all ${toggleClass(paceDown)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span className="italic-heavy text-sm">PACE DROP</span>
                </div>
                <div className="text-[10px] font-space text-muted">
                  Fatigue detected — intensity modifier –0.15 (floor 0.6)
                </div>
              </button>

              {/* Stomach Stress */}
              <button
                type="button"
                onClick={() => setStomachStress((v) => !v)}
                className={`p-3 text-left border transition-all ${toggleClass(stomachStress)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="italic-heavy text-sm">STOMACH STRESS</span>
                </div>
                <div className="text-[10px] font-space text-muted">
                  GI distress — carb absorption ceiling drops to 60g/hr
                </div>
              </button>
            </div>
          </div>

          {/* Delta Comparison Cards */}
          <div className="grid grid-cols-3 gap-3">
            {/* Carbs */}
            <div className="p-3 bg-surface border border-border space-y-1">
              <div className="text-[10px] font-space uppercase tracking-wider text-strava font-bold">CARBS</div>
              <div className="text-xs font-space text-muted">
                {targets.carbs_hourly_g}g → <span className="text-strava font-bold">{simTargets.carbs_hourly_g}g</span>
              </div>
              <div className="text-[10px] font-space text-faint">g/hr</div>
              {deltaDisplay(carbsDelta, 'text-strava')}
            </div>

            {/* Sodium */}
            <div className="p-3 bg-surface border border-border space-y-1">
              <div className="text-[10px] font-space uppercase tracking-wider text-amber-400 font-bold">SODIUM</div>
              <div className="text-xs font-space text-muted">
                {targets.sodium_hourly_mg}mg → <span className="text-amber-400 font-bold">{simTargets.sodium_hourly_mg}mg</span>
              </div>
              <div className="text-[10px] font-space text-faint">mg/hr</div>
              {deltaDisplay(sodiumDelta, 'text-amber-400')}
            </div>

            {/* Fluids */}
            <div className="p-3 bg-surface border border-border space-y-1">
              <div className="text-[10px] font-space uppercase tracking-wider text-sky-400 font-bold">FLUIDS</div>
              <div className="text-xs font-space text-muted">
                {targets.fluids_hourly_ml}ml → <span className="text-sky-400 font-bold">{simTargets.fluids_hourly_ml}ml</span>
              </div>
              <div className="text-[10px] font-space text-faint">ml/hr</div>
              {deltaDisplay(fluidsDelta, 'text-sky-400')}
            </div>
          </div>

          {/* Crew Chief Directive */}
          <div className="space-y-2">
            <label className="block text-xs font-space tracking-wider uppercase text-strava font-bold">
              Crew Chief Directive
            </label>

            {!anyToggle ? (
              <div className="space-y-2">
                <div className="bg-emerald-500/10 border border-emerald-500/40 p-4">
                  <span className="text-emerald-400 text-xs font-space font-bold">
                    All systems nominal — plan is on target
                  </span>
                </div>
                <p className="text-muted text-xs font-space">
                  Activate a scenario above to generate a crew-chief directive.
                </p>
              </div>
            ) : (
              <div className="bg-surface border border-strava/40 p-4 space-y-1">
                {directiveLines.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith('⚡')
                        ? 'text-strava font-bold font-space text-xs tracking-wider'
                        : 'text-fg text-xs font-mono'
                    }
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
