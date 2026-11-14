import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Bell,
  CheckSquare,
  Square,
  Flame,
  Droplets,
  Zap,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CalculatedHourlyTargets, FuelProduct, WorkoutInputVector } from '../../types/pyrofit';

interface LiveFuelingTimerProps {
  isOpen: boolean;
  onClose: () => void;
  input: WorkoutInputVector;
  targets: CalculatedHourlyTargets;
  recommendedProducts: FuelProduct[];
}

interface FuelChecklistItem {
  id: string;
  label: string;
  productName: string;
  brand: string;
  timeMinutes: number;
  type: 'carbs' | 'sodium' | 'fluids' | 'pre' | 'post';
  checked: boolean;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function buildChecklist(
  input: WorkoutInputVector,
  targets: CalculatedHourlyTargets,
  products: FuelProduct[]
): FuelChecklistItem[] {
  const items: FuelChecklistItem[] = [];
  const totalMins = input.workout_duration_mins;
  const intervalMins = 45;
  const gel = products.find((p) => p.phase === 'DURING' && p.carbs_g > 15) ?? products[0];
  const hydration = products.find((p) => p.phase === 'DURING' && p.fluids_ml > 100) ?? products[1] ?? gel;

  if (totalMins > 90) {
    items.push({
      id: 'pre_carbs',
      label: 'Pre-Workout Carb Load',
      productName: 'Complex carbs + small gel',
      brand: 'Pre-Race',
      timeMinutes: -45,
      type: 'pre',
      checked: false,
    });
    items.push({
      id: 'pre_water',
      label: 'Pre-Workout Hydration (300ml)',
      productName: 'Water / Electrolyte Mix',
      brand: 'Pre-Race',
      timeMinutes: -30,
      type: 'fluids',
      checked: false,
    });
  }

  for (let t = intervalMins; t < totalMins; t += intervalMins) {
    const intervalNum = Math.floor(t / intervalMins);
    items.push({
      id: `during_gel_${t}`,
      label: `Fuel at ${t}-min mark`,
      productName: gel?.name || 'Energy Gel',
      brand: gel?.brand || '',
      timeMinutes: t,
      type: 'carbs',
      checked: false,
    });

    if (hydration && hydration.id !== gel?.id) {
      items.push({
        id: `during_hydration_${t}`,
        label: `Hydrate at ${t}-min mark (${targets.fluids_hourly_ml}ml)`,
        productName: hydration?.name || 'Electrolyte Drink',
        brand: hydration?.brand || '',
        timeMinutes: t,
        type: 'fluids',
        checked: false,
      });
    }

    if (input.cramping_history && intervalNum % 2 === 0) {
      items.push({
        id: `sodium_${t}`,
        label: `Extra Sodium at ${t}-min (cramping protocol)`,
        productName: 'Electrolyte Tab / Salt Caps',
        brand: 'Protocol',
        timeMinutes: t,
        type: 'sodium',
        checked: false,
      });
    }
  }

  items.push({
    id: 'post_recovery',
    label: 'Post-Workout Recovery',
    productName: 'Protein + Carb Mix (20-25g protein, 3:1 ratio)',
    brand: 'Post-Race',
    timeMinutes: totalMins + 20,
    type: 'post',
    checked: false,
  });

  items.sort((a, b) => a.timeMinutes - b.timeMinutes);
  return items;
}

export const LiveFuelingTimer: React.FC<LiveFuelingTimerProps> = ({
  isOpen,
  onClose,
  input,
  targets,
  recommendedProducts,
}) => {
  const [elapsed, setElapsed] = useState(0); // seconds
  const [running, setRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [checklist, setChecklist] = useState<FuelChecklistItem[]>([]);
  const [alerts, setAlerts] = useState<{ id: string; text: string; type: string }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const alertedItemsRef = useRef<Set<string>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (isOpen) {
      setChecklist(buildChecklist(input, targets, recommendedProducts));
      setElapsed(0);
      setRunning(false);
      alertedItemsRef.current.clear();
    }
  }, [isOpen, input, targets, recommendedProducts]);

  const playBeep = useCallback((frequency = 880, duration = 0.3, pattern = 1) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      for (let i = 0; i < pattern; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = frequency;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.4 + duration);
        osc.start(ctx.currentTime + i * 0.4);
        osc.stop(ctx.currentTime + i * 0.4 + duration);
      }
    } catch (err) {
      // Audio API not available
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          const elapsedMins = next / 60;

          // Check upcoming fuel alerts (30 seconds before)
          setChecklist((items) => {
            items.forEach((item) => {
              if (
                !alertedItemsRef.current.has(item.id) &&
                !item.checked &&
                item.timeMinutes > 0
              ) {
                const secondsUntil = item.timeMinutes * 60 - next;
                if (secondsUntil <= 30 && secondsUntil > 0) {
                  alertedItemsRef.current.add(item.id);
                  playBeep(880, 0.3, 2);
                  setAlerts((a) => [
                    {
                      id: item.id + '_alert',
                      text: `⚡ ${item.label} in 30 seconds! Take ${item.productName}`,
                      type: item.type,
                    },
                    ...a.slice(0, 2),
                  ]);
                }
              }
            });
            return items;
          });

          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, playBeep]);

  const toggleCheck = (id: string) => {
    setChecklist((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    playBeep(1100, 0.15, 1);
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setChecklist(buildChecklist(input, targets, recommendedProducts));
    setAlerts([]);
    alertedItemsRef.current.clear();
  };

  const totalSecs = input.workout_duration_mins * 60;
  const progressPct = Math.min((elapsed / totalSecs) * 100, 100);
  const elapsedMins = elapsed / 60;
  const checklistDone = checklist.filter((c) => c.checked).length;

  const typeColor: Record<string, string> = {
    carbs: 'text-strava border-strava/30',
    sodium: 'text-amber-400 border-amber-400/30',
    fluids: 'text-sky-400 border-sky-400/30',
    pre: 'text-emerald-400 border-emerald-400/30',
    post: 'text-purple-400 border-purple-400/30',
  };
  const typeIcon: Record<string, React.ReactNode> = {
    carbs: <Flame className="w-3 h-3 text-strava" />,
    sodium: <Zap className="w-3 h-3 text-amber-400" />,
    fluids: <Droplets className="w-3 h-3 text-sky-400" />,
    pre: <Timer className="w-3 h-3 text-emerald-400" />,
    post: <Timer className="w-3 h-3 text-purple-400" />,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-bg border border-border shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-carbon flex-shrink-0">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-strava" />
            <div className="text-fg text-xs font-space font-bold uppercase tracking-wider">
              Live Fueling Companion
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className={`p-1 transition-colors ${soundEnabled ? 'text-strava' : 'text-faint hover:text-muted'}`}
              title={soundEnabled ? 'Mute alerts' : 'Enable alerts'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="text-muted hover:text-fg transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="p-4 bg-carbon border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <div className="font-mono text-4xl font-black text-fg tracking-tighter">
                {formatTime(elapsed)}
              </div>
              <div className="text-[10px] text-faint font-space uppercase">Elapsed</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!running && elapsed === 0) playBeep(660, 0.2, 3);
                  setRunning((r) => !r);
                }}
                className={`w-10 h-10 flex items-center justify-center border transition-all ${
                  running
                    ? 'border-strava/60 bg-strava/20 text-strava hover:bg-strava/30'
                    : 'border-strava bg-strava text-on-brand hover:bg-strava/90'
                }`}
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={reset}
                className="w-10 h-10 flex items-center justify-center border border-border text-muted hover:text-fg hover:border-fg/40 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <div className="font-mono text-4xl font-black text-muted tracking-tighter">
                {formatTime(Math.max(totalSecs - elapsed, 0))}
              </div>
              <div className="text-[10px] text-faint font-space uppercase">Remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-surface border border-border overflow-hidden">
            <div
              className="h-full bg-strava transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-faint font-space mt-1">
            <span>0 min</span>
            <span className="text-strava font-bold">{progressPct.toFixed(0)}%</span>
            <span>{input.workout_duration_mins} min</span>
          </div>

          {/* Macro Stats */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-surface border border-border p-2 text-center">
              <div className="text-strava text-sm font-black">{targets.carbs_hourly_g}g</div>
              <div className="text-[10px] text-faint uppercase">Carbs/hr</div>
            </div>
            <div className="bg-surface border border-border p-2 text-center">
              <div className="text-amber-400 text-sm font-black">{targets.sodium_hourly_mg}mg</div>
              <div className="text-[10px] text-faint uppercase">Sodium/hr</div>
            </div>
            <div className="bg-surface border border-border p-2 text-center">
              <div className="text-sky-400 text-sm font-black">{targets.fluids_hourly_ml}ml</div>
              <div className="text-[10px] text-faint uppercase">Fluids/hr</div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="px-3 py-2 space-y-1 flex-shrink-0">
            {alerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-2 bg-strava/10 border border-strava/30 text-strava text-[11px] font-space">
                <span>{a.text}</span>
                <button onClick={() => setAlerts((al) => al.filter((x) => x.id !== a.id))}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Fueling Checklist */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between flex-shrink-0 sticky top-0 bg-bg">
            <div className="text-[11px] font-space font-bold uppercase text-muted tracking-wider">
              Fueling Checklist
            </div>
            <span className="text-[11px] font-space text-strava font-bold">
              {checklistDone}/{checklist.length} done
            </span>
          </div>
          <div className="p-3 space-y-1.5">
            {checklist.map((item) => {
              const isUpcoming = !item.checked && item.timeMinutes > 0 && item.timeMinutes * 60 <= elapsed + 90;
              const isPast = !item.checked && item.timeMinutes > 0 && item.timeMinutes * 60 < elapsed - 60;

              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-2 p-2 border transition-all ${
                    item.checked
                      ? 'border-border bg-surface/50 opacity-50'
                      : isUpcoming
                      ? 'border-strava/50 bg-strava/5'
                      : isPast
                      ? 'border-red-500/30 bg-red-500/5'
                      : 'border-border'
                  }`}
                >
                  <button
                    onClick={() => toggleCheck(item.id)}
                    className={`flex-shrink-0 mt-0.5 ${item.checked ? 'text-strava' : 'text-muted hover:text-fg'}`}
                  >
                    {item.checked ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`flex items-center gap-1.5 text-[11px] font-space font-bold ${item.checked ? 'line-through text-faint' : 'text-fg'}`}>
                      {typeIcon[item.type]}
                      {item.label}
                      {isUpcoming && !item.checked && (
                        <span className="ml-1 text-[9px] bg-strava text-on-brand px-1.5 py-0.5 font-bold uppercase">
                          NOW
                        </span>
                      )}
                      {isPast && !item.checked && (
                        <span className="ml-1 text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 font-bold uppercase">
                          MISSED
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted mt-0.5">
                      {item.brand && <span className="text-strava/70">{item.brand} · </span>}
                      {item.productName}
                      {item.timeMinutes !== 0 && (
                        <span className="ml-2 text-faint">
                          @ {item.timeMinutes > 0 ? `${item.timeMinutes} min` : `${Math.abs(item.timeMinutes)} min before`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`text-[10px] font-space border px-1.5 py-0.5 flex-shrink-0 ${typeColor[item.type] || 'text-muted border-border'}`}>
                    {item.type.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
