import React from 'react';
import {
  Flame,
  Activity,
  Thermometer,
  Zap,
  Scale,
  ShieldAlert,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { IntensityLevel, ProductTier, WorkoutInputVector } from '../../types/pyrofit';
import { getTemperatureClimateLabel } from '../../lib/fuelEngine';

interface WorkoutConfiguratorProps {
  input: WorkoutInputVector;
  onChange: (updated: WorkoutInputVector) => void;
  onCalculate: () => void;
  filterIsotonicOnly: boolean;
}

export const WorkoutConfigurator: React.FC<WorkoutConfiguratorProps> = ({
  input,
  onChange,
  onCalculate,
  filterIsotonicOnly,
}) => {
  const climate = getTemperatureClimateLabel(input.temperature_celsius);

  const setField = <K extends keyof WorkoutInputVector>(key: K, val: WorkoutInputVector[K]) => {
    onChange({ ...input, [key]: val });
  };

  return (
    <div className="bg-carbon border border-border p-6 md:p-8 space-y-7 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-strava font-space text-[10px] tracking-[0.4em] uppercase font-bold">
            <Flame className="w-4 h-4 text-strava animate-pulse" />
            PYROFIT // PROTOCOL ENGINE v1.0
          </div>
          <h2 className="italic-heavy text-3xl md:text-4xl text-fg mt-1">
            WORKOUT &amp; <span className="text-strava">ATHLETE CONFIGURATOR</span>
          </h2>
          <p className="text-muted text-xs font-light">
            Calibrate deterministic carbohydrate, electrolyte, and hydration targets before your session.
          </p>
        </div>

        {filterIsotonicOnly && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF9800]/10 border border-[#FF9800]/40 text-[#FF9800] text-[11px] font-space font-bold uppercase rounded-sm">
            <ShieldAlert className="w-3.5 h-3.5" /> Gut-Safe Filter Active (Hydrogel / Isotonic Only)
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* 1. Workout Duration Slider */}
        <div className="p-4 bg-surface border border-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-space tracking-wider uppercase text-strava font-bold flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" /> Workout Duration (Minutes): {input.workout_duration_mins} mins
            </label>
            <span className="font-space text-sm font-bold text-fg">
              {(input.workout_duration_mins / 60).toFixed(1)} hrs
            </span>
          </div>

          <input
            type="range"
            min="30"
            max="300"
            step="15"
            value={input.workout_duration_mins}
            onChange={(e) => setField('workout_duration_mins', parseInt(e.target.value, 10))}
            className="w-full accent-strava cursor-pointer h-2 bg-carbon"
          />

          <div className="flex justify-between text-[10px] font-space text-faint mt-2">
            <span>30m (Sprint / Recovery)</span>
            <span>90m (Threshold block)</span>
            <span>180m (Marathon simulation)</span>
            <span>300m (Ultra)</span>
          </div>
        </div>

        {/* 2. Intensity Selection */}
        <div>
          <label className="block text-xs font-space tracking-wider uppercase text-strava font-bold mb-2 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Training Intensity Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'LOW', label: 'LOW INTENSITY', zone: 'Zone 1–2 Aerobic Base', factor: '0.8x burn' },
              { id: 'MID', label: 'MID INTENSITY', zone: 'Zone 3 Tempo / Marathon', factor: '1.0x baseline' },
              { id: 'HIGH', label: 'HIGH INTENSITY', zone: 'Zone 4–5 Threshold / Intervals', factor: '1.2x burn' },
            ].map((item) => {
              const active = input.intensity_level === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setField('intensity_level', item.id as IntensityLevel)}
                  className={`p-3.5 text-left border transition-all ${
                    active
                      ? 'border-strava bg-strava/10 ring-1 ring-strava'
                      : 'border-border bg-surface text-muted hover:border-border-bright hover:text-fg'
                  }`}
                >
                  <div className={`italic-heavy text-base ${active ? 'text-strava' : 'text-fg'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] font-space text-muted mt-1">{item.zone}</div>
                  <div className="text-[9px] font-space text-faint mt-0.5">{item.factor}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Ambient Temperature & Climate Tier */}
        <div className="p-4 bg-surface border border-border">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <label className="text-xs font-space tracking-wider uppercase text-strava font-bold flex items-center gap-2">
              <Thermometer className="w-3.5 h-3.5" /> Ambient Temperature (°C)
            </label>
            <span className={`text-[10px] font-space px-2.5 py-1 border font-bold uppercase ${climate.badgeColor}`}>
              {climate.label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={input.temperature_celsius}
                onChange={(e) => setField('temperature_celsius', parseFloat(e.target.value) || 20)}
                step="0.5"
                min="0"
                max="50"
                className="bg-carbon border border-border px-4 py-2.5 text-fg font-space text-lg font-bold w-32 focus:border-strava outline-none"
              />
              <span className="text-sm font-space text-muted">°Celsius</span>
            </div>

            <div className="text-[11px] font-space text-muted leading-relaxed">
              {input.temperature_celsius < 22 && 'Standard baseline sweat rate. Fluid loss ~500 ml/hr.'}
              {input.temperature_celsius >= 22 && input.temperature_celsius <= 30 && 'Moderate thermoregulatory demand. Sodium burn escalates by +20%.'}
              {input.temperature_celsius > 30 && 'Severe heat stress. Sodium requirement surges +40% with high sweat electrolyte dissipation.'}
            </div>
          </div>
        </div>

        {/* 4. Athlete Weight & Cramping History Switch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-surface border border-border">
            <label className="block text-xs font-space tracking-wider uppercase text-strava font-bold mb-2 flex items-center gap-2">
              <Scale className="w-3.5 h-3.5" /> Athlete Body Weight (kg)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={input.athlete_weight_kg}
                onChange={(e) => setField('athlete_weight_kg', parseFloat(e.target.value) || 70)}
                step="1"
                min="35"
                max="140"
                className="bg-carbon border border-border px-4 py-2 text-fg font-space text-base font-bold w-28 focus:border-strava outline-none"
              />
              <span className="text-xs font-space text-faint">Used for 1.0g/kg Pre-Workout Carb Priming</span>
            </div>
          </div>

          <div className="p-4 bg-surface border border-border flex items-center justify-between">
            <div>
              <div className="text-xs font-space tracking-wider uppercase text-strava font-bold flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Cramping Susceptibility
              </div>
              <div className="text-[10px] text-faint mt-1">
                Adds +200mg sodium/hr baseline protection
              </div>
            </div>

            <button
              type="button"
              onClick={() => setField('cramping_history', !input.cramping_history)}
              className={`px-4 py-2 text-xs font-space font-bold uppercase transition-all border ${
                input.cramping_history
                  ? 'border-strava bg-strava text-on-brand'
                  : 'border-border bg-carbon text-muted hover:text-fg'
              }`}
            >
              {input.cramping_history ? 'YES (CRAMP PRONE)' : 'NO (STANDARD)'}
            </button>
          </div>
        </div>

        {/* 5. Product Budget Tier Selector */}
        <div>
          <label className="block text-xs font-space tracking-wider uppercase text-strava font-bold mb-2">
            Preferred Product Formulation Tier
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'ALL', label: 'ALL TIERS', desc: 'Maurten, Unived, Fast&Up, Enerzal' },
              { id: 'L1', label: 'L1: PREMIUM SCIENTIFIC', desc: 'Maurten Hydrogel & Unived Elite' },
              { id: 'L2', label: 'L2: BALANCED PERFORMANCE', desc: 'Fast&Up Gels & Reload' },
              { id: 'L3', label: 'L3: VALUE ESSENTIAL', desc: 'Enerzal Isotonic Solutions' },
            ].map((t) => {
              const active = input.budget_tier_preference === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setField('budget_tier_preference', t.id as ProductTier)}
                  className={`p-3 text-left border text-xs font-space transition-all ${
                    active
                      ? 'border-strava bg-strava/15 text-fg font-bold'
                      : 'border-border bg-surface text-muted hover:text-fg'
                  }`}
                >
                  <div className="font-bold">{t.label}</div>
                  <div className="text-[9px] text-faint mt-1 line-clamp-1">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Session Type */}
      <div>
        <label className="block text-xs font-space tracking-wider uppercase text-strava font-bold mb-2">
          Session Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['Training', 'Race', 'Long Run', 'Recovery'] as const).map((t) => {
            const active = (input.session_type ?? 'Training') === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setField('session_type', t)}
                className={`p-3 text-left border text-xs font-space transition-all ${
                  active
                    ? 'border-strava bg-strava/15 text-fg font-bold'
                    : 'border-border bg-surface text-muted hover:text-fg'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Terrain */}
      <div>
        <label className="block text-xs font-space tracking-wider uppercase text-strava font-bold mb-2">
          Terrain
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['Road', 'Trail', 'Track', 'Treadmill'] as const).map((t) => {
            const active = (input.terrain ?? 'Road') === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setField('terrain', t)}
                className={`p-3 text-left border text-xs font-space transition-all ${
                  active
                    ? 'border-strava bg-strava/15 text-fg font-bold'
                    : 'border-border bg-surface text-muted hover:text-fg'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Fluid Access */}
      <div>
        <label className="block text-xs font-space tracking-wider uppercase text-strava font-bold mb-2">
          Fluid Access
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['Full', 'Limited', 'Self-Carry'] as const).map((f) => {
            const active = (input.fluid_access ?? 'Full') === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setField('fluid_access', f)}
                className={`p-3 text-left border text-xs font-space transition-all ${
                  active
                    ? 'border-strava bg-strava/15 text-fg font-bold'
                    : 'border-border bg-surface text-muted hover:text-fg'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* 9. Distance & Humidity (optional compact row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-surface border border-border">
          <label className="block text-xs font-space tracking-wider uppercase text-strava font-bold mb-2">
            Distance (km, optional)
          </label>
          <input
            type="number"
            value={input.distance_km ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setField('distance_km', v === '' ? undefined : parseFloat(v));
            }}
            min={0}
            max={300}
            step={0.5}
            placeholder="e.g. 42.2"
            className="bg-carbon border border-border px-4 py-2 text-fg font-space text-sm w-full focus:border-strava outline-none placeholder:text-faint"
          />
        </div>

        <div className="p-4 bg-surface border border-border">
          <label className="block text-xs font-space tracking-wider uppercase text-strava font-bold mb-2">
            Humidity (%, optional)
          </label>
          <input
            type="number"
            value={input.humidity_pct ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setField('humidity_pct', v === '' ? undefined : parseFloat(v));
            }}
            min={0}
            max={100}
            step={1}
            placeholder="e.g. 75"
            className="bg-carbon border border-border px-4 py-2 text-fg font-space text-sm w-full focus:border-strava outline-none placeholder:text-faint"
          />
        </div>
      </div>
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-[10px] font-space text-faint uppercase tracking-widest">
          Deterministic Mathematical Engine · Zero AI Guesswork · Sports Science Consensus
        </div>

        <button
          onClick={onCalculate}
          className="w-full sm:w-auto bg-strava italic-heavy text-on-brand py-4 px-12 text-lg font-black shadow-[0_12px_40px_rgba(204,255,0,0.3)] hover:shadow-[0_16px_50px_rgba(204,255,0,0.45)] hover:bg-white transition-all flex items-center justify-center gap-2"
        >
          CALCULATE FUELING PROTOCOL <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
