import React, { useState } from 'react';
import { X, Check, AlertCircle, Sparkles, ChevronRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  DistanceKey,
  FitnessLevelKey,
  GeneratedPlan,
  MethodologyKey,
  PlanInputs,
} from '../types/architect';
import {
  DIST_KM,
  FITNESS_MULTIPLIERS,
  METHODOLOGIES,
  generatePlan,
} from '../lib/architectEngine';

interface PlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'standard' | 'couch';
  onPlanGenerated: (plan: GeneratedPlan) => void;
}

export const PlanGeneratorModal: React.FC<PlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'standard',
  onPlanGenerated,
}) => {
  const [mode, setMode] = useState<'standard' | 'couch'>(initialMode);

  // Standard inputs
  const [distance, setDistance] = useState<DistanceKey>('Half');
  const [ultraDist, setUltraDist] = useState('50');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevelKey>('INTERMEDIATE');
  const [goalMode, setGoalMode] = useState<'TIME' | 'FINISH'>('TIME');
  const [targetTime, setTargetTime] = useState('1:50:00');
  const [currentVolume, setCurrentVolume] = useState('35');
  const [duration, setDuration] = useState('12');
  const [schedule, setSchedule] = useState<string[]>(['Tue', 'Thu', 'Sat', 'Sun']);
  const [longDay, setLongDay] = useState('Sun');
  const [methodology, setMethodology] = useState<MethodologyKey>('AUTO');
  const [age, setAge] = useState('30');

  // Couch inputs
  const [motivation, setMotivation] = useState<'FIRST_5K' | 'WEIGHT' | 'FRIEND' | 'DOCTOR'>('FIRST_5K');
  const [startingPoint, setStartingPoint] = useState<'WALK_30' | 'WALK_OCC' | 'NO_EXERCISE' | 'INJURY'>('WALK_OCC');
  const [couchDays, setCouchDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    if (schedule.includes(day)) {
      if (schedule.length <= 3) return; // minimum 3 days
      const updated = schedule.filter((d) => d !== day);
      setSchedule(updated);
      if (longDay === day) {
        setLongDay(updated[updated.length - 1]);
      }
    } else {
      if (schedule.length >= 6) return; // max 6 days
      setSchedule([...schedule, day]);
    }
  };

  const toggleCouchDay = (day: string) => {
    if (couchDays.includes(day)) {
      if (couchDays.length <= 2) return;
      setCouchDays(couchDays.filter((d) => d !== day));
    } else {
      if (couchDays.length >= 4) return;
      setCouchDays([...couchDays, day]);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    let plan: GeneratedPlan;
    if (mode === 'couch') {
      plan = generatePlan({
        distance: '5k',
        fitnessLevel: 'NOVICE',
        currentVolume: '5',
        duration: '8',
        schedule: couchDays,
        longDay: couchDays[couchDays.length - 1],
        methodology: 'GALLOWAY',
        motivation,
        startingPoint,
      });
    } else {
      plan = generatePlan({
        distance,
        ultraDist,
        fitnessLevel,
        goalMode,
        targetTime: goalMode === 'TIME' ? targetTime : undefined,
        currentVolume,
        duration,
        schedule,
        longDay,
        methodology,
        age,
      });
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B1A', '#ffffff', '#1a0800'],
      });
    } catch {}

    onPlanGenerated(plan);
    onClose();
  };

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-carbon border border-border p-6 md:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted hover:text-fg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="text-strava font-space text-[9px] tracking-[0.5em] uppercase mb-1">
            ARCHITECT ENGINE // v3.5
          </div>
          <h2 className="italic-heavy text-3xl md:text-4xl text-fg">
            BUILD YOUR <span className="text-strava">RUNNING BLUEPRINT</span>
          </h2>
          <p className="text-muted text-xs font-light mt-1">
            Precision pacing zones, periodisation curves, and calibrated workouts in seconds.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-surface border border-border mb-6">
          <button
            type="button"
            onClick={() => setMode('standard')}
            className={`py-2 text-xs font-space font-bold uppercase tracking-wider transition-all ${
              mode === 'standard'
                ? 'bg-strava text-on-brand shadow-md'
                : 'text-muted hover:text-fg'
            }`}
          >
            Elite Blueprint (5K to Ultra)
          </button>
          <button
            type="button"
            onClick={() => setMode('couch')}
            className={`py-2 text-xs font-space font-bold uppercase tracking-wider transition-all ${
              mode === 'couch'
                ? 'bg-strava text-on-brand shadow-md'
                : 'text-muted hover:text-fg'
            }`}
          >
            Couch to 5K (First-Timer)
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {mode === 'couch' ? (
            /* COUCH TO 5K FORM */
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Motivation */}
              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  What is your primary motivation?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'FIRST_5K', label: 'Finish My First 5K' },
                    { id: 'WEIGHT', label: 'Fat Loss & Health' },
                    { id: 'FRIEND', label: 'Join Friends Running' },
                    { id: 'DOCTOR', label: "Doctor's Recommendation" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMotivation(m.id as any)}
                      className={`p-3 text-left border text-xs font-space transition-all ${
                        motivation === m.id
                          ? 'border-strava bg-strava/10 text-fg font-bold'
                          : 'border-border bg-surface text-muted hover:border-border-bright'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Starting Point */}
              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  What describes your starting activity level?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { id: 'WALK_30', label: 'Can briskly walk 30 mins easily' },
                    { id: 'WALK_OCC', label: 'Occasional light walks only' },
                    { id: 'NO_EXERCISE', label: 'Zero exercise in past 6 months' },
                    { id: 'INJURY', label: 'Returning cautiously after injury' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStartingPoint(s.id as any)}
                      className={`p-3 text-left border text-xs font-space transition-all ${
                        startingPoint === s.id
                          ? 'border-strava bg-strava/10 text-fg font-bold'
                          : 'border-border bg-surface text-muted hover:border-border-bright'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Training Days */}
              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Pick 3 Training Days (Rest days are mandatory between runs)
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {allDays.map((d) => {
                    const selected = couchDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleCouchDay(d)}
                        className={`py-3 text-center border text-xs font-space font-bold uppercase transition-all ${
                          selected
                            ? 'border-strava bg-strava text-on-brand'
                            : 'border-border bg-surface text-muted hover:text-fg'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* STANDARD BLUEPRINT FORM */
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Distance Selector */}
              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Target Distance
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { key: '5k', label: '5K', sub: '5 km' },
                    { key: '10k', label: '10K', sub: '10 km' },
                    { key: 'Half', label: 'Half Marathon', sub: '21.1 km' },
                    { key: '42k', label: 'Marathon', sub: '42.2 km' },
                    { key: 'Ultra', label: 'Ultra', sub: '50km+' },
                  ].map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setDistance(d.key as DistanceKey)}
                      className={`p-3 text-center border transition-all ${
                        distance === d.key
                          ? 'border-strava bg-strava text-on-brand'
                          : 'border-border bg-surface text-muted hover:text-fg hover:border-border-bright'
                      }`}
                    >
                      <div className="italic-heavy text-base leading-none">{d.label}</div>
                      <div className="text-[10px] font-space mt-1 opacity-70">{d.sub}</div>
                    </button>
                  ))}
                </div>
                {distance === 'Ultra' && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs font-space text-muted">Custom Distance (km):</span>
                    <input
                      type="number"
                      value={ultraDist}
                      onChange={(e) => setUltraDist(e.target.value)}
                      className="bg-surface border border-border px-3 py-1.5 text-fg text-sm w-28 focus:border-strava outline-none font-space"
                      min={50}
                      max={500}
                    />
                  </div>
                )}
              </div>

              {/* Goal Mode & Target Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                    Goal Strategy
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGoalMode('TIME')}
                      className={`py-2.5 px-3 border text-xs font-space font-bold transition-all ${
                        goalMode === 'TIME'
                          ? 'border-strava bg-strava/10 text-strava'
                          : 'border-border bg-surface text-muted'
                      }`}
                    >
                      Target Finish Time
                    </button>
                    <button
                      type="button"
                      onClick={() => setGoalMode('FINISH')}
                      className={`py-2.5 px-3 border text-xs font-space font-bold transition-all ${
                        goalMode === 'FINISH'
                          ? 'border-strava bg-strava/10 text-strava'
                          : 'border-border bg-surface text-muted'
                      }`}
                    >
                      Just Finish Healthy
                    </button>
                  </div>
                </div>

                {goalMode === 'TIME' && (
                  <div>
                    <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                      Target Time (hh:mm:ss or mm:ss)
                    </label>
                    <input
                      type="text"
                      value={targetTime}
                      onChange={(e) => setTargetTime(e.target.value)}
                      placeholder="e.g. 1:45:00 or 25:00"
                      className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-sm focus:border-strava outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Fitness Level & Weekly Mileage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                    Current Experience Level
                  </label>
                  <select
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value as FitnessLevelKey)}
                    className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-xs focus:border-strava outline-none"
                  >
                    <option value="BEGINNER">Beginner (&lt; 6 months, &lt; 20 km/wk)</option>
                    <option value="INTERMEDIATE">Intermediate (1–3 years, 30–60 km/wk)</option>
                    <option value="ADVANCED">Advanced (3+ years, 60–100 km/wk)</option>
                    <option value="ELITE">Elite / Competitive (100+ km/wk)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                    Current Weekly Volume (km)
                  </label>
                  <input
                    type="number"
                    value={currentVolume}
                    onChange={(e) => setCurrentVolume(e.target.value)}
                    className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-sm focus:border-strava outline-none"
                    min={10}
                    max={200}
                  />
                </div>
              </div>

              {/* Duration & Methodology */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                    Plan Duration (Weeks): {duration} weeks
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="24"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full accent-strava cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-space text-faint mt-1">
                    <span>6 wks (Fast tune)</span>
                    <span>12 wks (Recommended)</span>
                    <span>24 wks (Full cycle)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                    Training Methodology
                  </label>
                  <select
                    value={methodology}
                    onChange={(e) => setMethodology(e.target.value as MethodologyKey)}
                    className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-xs focus:border-strava outline-none"
                  >
                    <option value="AUTO">AUTO (Pick best fit for me)</option>
                    <option value="NORWEGIAN">Norwegian Double Threshold</option>
                    <option value="VDOT">Jack Daniels VDOT (Pacing Science)</option>
                    <option value="LYDIARD">Lydiard Aerobic Base</option>
                    <option value="MAFFETONE">Maffetone MAF (HR Ceiling)</option>
                    <option value="HANSONS">Hansons Marathon Method (Cumulative)</option>
                    <option value="KENYAN">Kenyan Progression Run</option>
                    <option value="FIRST">FIRST 3+2 (Time-Crunched)</option>
                    <option value="GALLOWAY">Galloway Run-Walk</option>
                    <option value="EKIDEN">Japanese Ekiden (High Volume)</option>
                  </select>
                </div>
              </div>

              {/* Schedule Days Picker */}
              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Select Training Days ({schedule.length} days selected, 3–6 recommended)
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {allDays.map((d) => {
                    const selected = schedule.includes(d);
                    const isLong = d === longDay;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={`py-3 px-1 text-center border text-xs font-space font-bold transition-all flex flex-col items-center justify-center ${
                          selected
                            ? 'border-strava bg-strava text-on-brand'
                            : 'border-border bg-surface text-muted hover:text-fg'
                        }`}
                      >
                        <span>{d}</span>
                        {isLong && selected && (
                          <span className="text-[8px] bg-black text-strava px-1 rounded-sm mt-0.5">
                            LONG
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Long Run Day selection */}
              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Primary Long Run Day
                </label>
                <div className="flex gap-2 flex-wrap">
                  {schedule.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setLongDay(d)}
                      className={`px-4 py-2 border text-xs font-space uppercase transition-all ${
                        longDay === d
                          ? 'border-strava bg-strava/15 text-strava font-bold'
                          : 'border-border bg-surface text-muted hover:text-fg'
                      }`}
                    >
                      {d} {longDay === d && '✓'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-space text-faint tracking-widest uppercase">
              100% Free · No credit card · Instant export
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto bg-strava italic-heavy text-on-brand py-4 px-12 text-lg font-black shadow-[0_12px_40px_rgba(255,107,26,0.3)] hover:shadow-[0_16px_50px_rgba(255,107,26,0.45)] hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              GENERATE BLUEPRINT <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
