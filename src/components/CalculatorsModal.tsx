import React, { useState } from 'react';
import { X, Calculator, ArrowRight, Gauge, Activity } from 'lucide-react';
import { computePaces, formatPace, formatTime, parseTime, riegel } from '../lib/architectEngine';

interface CalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToPlan?: (time: string, dist: string) => void;
}

export const CalculatorsModal: React.FC<CalculatorsModalProps> = ({
  isOpen,
  onClose,
  onApplyToPlan,
}) => {
  const [tab, setTab] = useState<'riegel' | 'vdot' | 'pace'>('riegel');

  // Riegel Predictor State
  const [inputDist, setInputDist] = useState<number>(21.0975);
  const [inputTimeStr, setInputTimeStr] = useState('1:45:00');

  // Pace Converter State
  const [paceMin, setPaceMin] = useState('5');
  const [paceSec, setPaceSec] = useState('00');
  const [paceUnit, setPaceUnit] = useState<'km' | 'mi'>('km');

  if (!isOpen) return null;

  const inputSec = parseTime(inputTimeStr) || 6300;

  // Race predictions using Riegel formula
  const pred5k = riegel(inputSec, inputDist, 5);
  const pred10k = riegel(inputSec, inputDist, 10);
  const predHalf = riegel(inputSec, inputDist, 21.0975);
  const predFull = riegel(inputSec, inputDist, 42.195);
  const pred50k = riegel(inputSec, inputDist, 50);

  // Daniels VDOT paces
  const vdotPaces = computePaces(inputSec, inputDist, 'INTERMEDIATE') || {
    race: 300,
    marathon: 300,
    threshold: 285,
    interval: 260,
    easy: 360,
    recovery: 400,
    long: 360,
  };

  // Pace calculations
  const totalPaceSec = (parseInt(paceMin) || 0) * 60 + (parseInt(paceSec) || 0);
  const speedKmh = totalPaceSec > 0 ? (3600 / totalPaceSec) * (paceUnit === 'mi' ? 1.60934 : 1) : 0;
  const convertedPaceSec =
    paceUnit === 'km' ? Math.round(totalPaceSec * 1.60934) : Math.round(totalPaceSec / 1.60934);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-carbon border border-border p-6 md:p-8 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted hover:text-fg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <div className="text-strava font-space text-[9px] tracking-[0.5em] uppercase mb-1">
            RUNNING MATHEMATICS LAB
          </div>
          <h2 className="italic-heavy text-3xl md:text-4xl text-fg">
            TRAINING <span className="text-strava">CALCULATORS</span>
          </h2>
          <p className="text-muted text-xs font-light mt-1">
            Instant Riegel race time projections, Daniels VDOT pace zones, and velocity converters.
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-surface border border-border mb-6">
          <button
            type="button"
            onClick={() => setTab('riegel')}
            className={`py-2 text-xs font-space font-bold uppercase tracking-wider transition-all ${
              tab === 'riegel'
                ? 'bg-strava text-on-brand shadow-md'
                : 'text-muted hover:text-fg'
            }`}
          >
            Race Predictor
          </button>
          <button
            type="button"
            onClick={() => setTab('vdot')}
            className={`py-2 text-xs font-space font-bold uppercase tracking-wider transition-all ${
              tab === 'vdot'
                ? 'bg-strava text-on-brand shadow-md'
                : 'text-muted hover:text-fg'
            }`}
          >
            VDOT Pace Zones
          </button>
          <button
            type="button"
            onClick={() => setTab('pace')}
            className={`py-2 text-xs font-space font-bold uppercase tracking-wider transition-all ${
              tab === 'pace'
                ? 'bg-strava text-on-brand shadow-md'
                : 'text-muted hover:text-fg'
            }`}
          >
            Pace Converter
          </button>
        </div>

        {/* Tab 1: Race Predictor (Riegel) */}
        {tab === 'riegel' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Recent Race Distance
                </label>
                <select
                  value={inputDist}
                  onChange={(e) => setInputDist(parseFloat(e.target.value))}
                  className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-xs focus:border-strava outline-none"
                >
                  <option value={5}>5K (5.0 km)</option>
                  <option value={10}>10K (10.0 km)</option>
                  <option value={21.0975}>Half Marathon (21.1 km)</option>
                  <option value={42.195}>Marathon (42.2 km)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Finish Time (hh:mm:ss or mm:ss)
                </label>
                <input
                  type="text"
                  value={inputTimeStr}
                  onChange={(e) => setInputTimeStr(e.target.value)}
                  placeholder="e.g. 1:45:00"
                  className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-sm focus:border-strava outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-surface border border-border">
              <div className="text-[10px] font-space uppercase tracking-widest text-strava font-bold mb-4">
                Riegel Predicted Race Equivalents (T₂ = T₁ × [D₂/D₁]^1.06)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-carbon border border-border text-center">
                  <div className="text-[10px] font-space text-faint uppercase">5K</div>
                  <div className="text-lg font-space font-bold text-fg mt-1">{formatTime(pred5k)}</div>
                  <div className="text-[10px] font-space text-strava">{formatPace(pred5k / 5)}</div>
                </div>
                <div className="p-3 bg-carbon border border-border text-center">
                  <div className="text-[10px] font-space text-faint uppercase">10K</div>
                  <div className="text-lg font-space font-bold text-fg mt-1">{formatTime(pred10k)}</div>
                  <div className="text-[10px] font-space text-strava">{formatPace(pred10k / 10)}</div>
                </div>
                <div className="p-3 bg-carbon border border-border text-center">
                  <div className="text-[10px] font-space text-faint uppercase">Half</div>
                  <div className="text-lg font-space font-bold text-fg mt-1">{formatTime(predHalf)}</div>
                  <div className="text-[10px] font-space text-strava">{formatPace(predHalf / 21.0975)}</div>
                </div>
                <div className="p-3 bg-carbon border border-border text-center">
                  <div className="text-[10px] font-space text-faint uppercase">Marathon</div>
                  <div className="text-lg font-space font-bold text-fg mt-1">{formatTime(predFull)}</div>
                  <div className="text-[10px] font-space text-strava">{formatPace(predFull / 42.195)}</div>
                </div>
                <div className="p-3 bg-carbon border border-border text-center">
                  <div className="text-[10px] font-space text-faint uppercase">50K Ultra</div>
                  <div className="text-lg font-space font-bold text-fg mt-1">{formatTime(pred50k)}</div>
                  <div className="text-[10px] font-space text-strava">{formatPace(pred50k / 50)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: VDOT Pace Zones */}
        {tab === 'vdot' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Benchmark Race Distance
                </label>
                <select
                  value={inputDist}
                  onChange={(e) => setInputDist(parseFloat(e.target.value))}
                  className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-xs focus:border-strava outline-none"
                >
                  <option value={5}>5K</option>
                  <option value={10}>10K</option>
                  <option value={21.0975}>Half Marathon</option>
                  <option value={42.195}>Marathon</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Recent Time
                </label>
                <input
                  type="text"
                  value={inputTimeStr}
                  onChange={(e) => setInputTimeStr(e.target.value)}
                  className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-sm focus:border-strava outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-surface border border-border space-y-3">
              <div className="text-[10px] font-space uppercase tracking-widest text-strava font-bold mb-3">
                Calibrated Training Intensity Zones
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-carbon border border-border flex justify-between items-center">
                  <div>
                    <div className="font-space font-bold text-fg text-sm">Easy Aerobic (E)</div>
                    <div className="text-[10px] text-faint">Mitochondrial density, base volume</div>
                  </div>
                  <div className="text-right">
                    <div className="text-strava font-space font-bold">{formatPace(vdotPaces.easy)}</div>
                    <div className="text-[9px] text-faint">Z2 · RPE 3–4</div>
                  </div>
                </div>

                <div className="p-3 bg-carbon border border-border flex justify-between items-center">
                  <div>
                    <div className="font-space font-bold text-[#FF9800] text-sm">Lactate Threshold (T)</div>
                    <div className="text-[10px] text-faint">Lactate clearance capacity</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#FF9800] font-space font-bold">{formatPace(vdotPaces.threshold)}</div>
                    <div className="text-[9px] text-faint">Z4 · RPE 7–8</div>
                  </div>
                </div>

                <div className="p-3 bg-carbon border border-border flex justify-between items-center">
                  <div>
                    <div className="font-space font-bold text-[#FF3D3D] text-sm">VO₂max Interval (I)</div>
                    <div className="text-[10px] text-faint">Aerobic ceiling expansion</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#FF3D3D] font-space font-bold">{formatPace(vdotPaces.interval)}</div>
                    <div className="text-[9px] text-faint">Z5 · RPE 9</div>
                  </div>
                </div>

                <div className="p-3 bg-carbon border border-border flex justify-between items-center">
                  <div>
                    <div className="font-space font-bold text-fg text-sm">Marathon Pace (M)</div>
                    <div className="text-[10px] text-faint">Race specificity &amp; glycogen discipline</div>
                  </div>
                  <div className="text-right">
                    <div className="text-fg font-space font-bold">{formatPace(vdotPaces.marathon)}</div>
                    <div className="text-[9px] text-faint">Z3 · RPE 6</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Pace Converter */}
        {tab === 'pace' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Minutes
                </label>
                <input
                  type="number"
                  value={paceMin}
                  onChange={(e) => setPaceMin(e.target.value)}
                  className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-sm focus:border-strava outline-none"
                  min={2}
                  max={15}
                />
              </div>

              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Seconds
                </label>
                <input
                  type="number"
                  value={paceSec}
                  onChange={(e) => setPaceSec(e.target.value)}
                  className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-sm focus:border-strava outline-none"
                  min={0}
                  max={59}
                />
              </div>

              <div>
                <label className="block text-[11px] font-space tracking-wider uppercase text-strava mb-2">
                  Unit
                </label>
                <select
                  value={paceUnit}
                  onChange={(e) => setPaceUnit(e.target.value as 'km' | 'mi')}
                  className="w-full bg-surface border border-border px-4 py-2.5 text-fg font-space text-xs focus:border-strava outline-none"
                >
                  <option value="km">per kilometer (/km)</option>
                  <option value="mi">per mile (/mi)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-surface border border-border grid grid-cols-2 gap-4">
              <div className="p-4 bg-carbon border border-border text-center">
                <div className="text-[10px] font-space text-faint uppercase">
                  Equivalent in {paceUnit === 'km' ? 'Miles' : 'Kilometers'}
                </div>
                <div className="text-2xl font-space font-bold text-strava mt-2">
                  {Math.floor(convertedPaceSec / 60)}:{(convertedPaceSec % 60).toString().padStart(2, '0')}{' '}
                  <span className="text-xs text-muted">/{paceUnit === 'km' ? 'mi' : 'km'}</span>
                </div>
              </div>

              <div className="p-4 bg-carbon border border-border text-center">
                <div className="text-[10px] font-space text-faint uppercase">
                  Speed Velocity
                </div>
                <div className="text-2xl font-space font-bold text-fg mt-2">
                  {speedKmh.toFixed(2)} <span className="text-xs text-muted">km/h</span>
                </div>
                <div className="text-xs text-faint mt-1">
                  {(speedKmh / 1.60934).toFixed(2)} mph
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
