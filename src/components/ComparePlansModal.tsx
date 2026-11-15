import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ComparePlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'methodologies' | 'shoes' | 'watches';
}

type Tab = 'methodologies' | 'shoes' | 'watches';

/* ── DATA ─────────────────────────────────────────────────────────── */

const methodologies = [
  { name: 'Norwegian Doubles', bestFor: 'Sub-elite 5K–marathon', intensity: '80/20 LT-heavy', weeklyVol: '100–160 km', difficulty: 'Very Hard', keyFact: 'Twice-daily lactate-threshold sessions; zero junk miles.' },
  { name: 'Jack Daniels VDOT', bestFor: 'All levels, 5K–marathon', intensity: '70/30 mixed', weeklyVol: '50–130 km', difficulty: 'Intermediate', keyFact: 'Paces derived from VDOT score. E / M / T / I / R zones.' },
  { name: 'Lydiard Periodisation', bestFor: 'Marathon, long-course', intensity: '80/20 base-heavy', weeklyVol: '130–200 km', difficulty: 'Hard', keyFact: 'Aerobic base → anaerobic sharpening → coordination phase.' },
  { name: 'Maffetone MAF', bestFor: 'Injury-prone, ultra, beginners', intensity: '100% aerobic', weeklyVol: '50–100 km', difficulty: 'Easy', keyFact: 'Train at 180−age BPM ceiling. Builds fat-oxidation base.' },
  { name: 'Hansons Method', bestFor: '10K–marathon intermediates', intensity: '70/30 cumulative fatigue', weeklyVol: '80–120 km', difficulty: 'Intermediate', keyFact: 'No long run >26 km. Cumulative fatigue simulates late-race feel.' },
  { name: 'Pfitzinger (Pfitz)', bestFor: 'Competitive marathoners', intensity: '75/25', weeklyVol: '90–130 km', difficulty: 'Hard', keyFact: 'Medium-long runs + MLRs. Lactate threshold as cornerstone.' },
  { name: 'FIRST (3-day)', bestFor: 'Time-crunched runners', intensity: '60/40', weeklyVol: '40–65 km', difficulty: 'Intermediate', keyFact: '3 quality runs/week + 2 cross-training. No junk miles.' },
  { name: 'Galloway Run-Walk', bestFor: 'Beginners, injury comeback', intensity: '100% easy', weeklyVol: '25–55 km', difficulty: 'Easy', keyFact: 'Planned walk intervals prevent fatigue. Finish any distance.' },
  { name: 'Kenyan Style', bestFor: 'High-volume elites', intensity: '80/20 massive base', weeklyVol: '180–250 km', difficulty: 'Extreme', keyFact: 'Twice-daily easy running. Altitude. Community accountability.' },
  { name: 'Ekiden / Relay Focus', bestFor: 'Team relay runners', intensity: '70/30', weeklyVol: '60–90 km', difficulty: 'Intermediate', keyFact: 'Short burst specialty. High leg-speed, quick-recovery emphasis.' },
];

const shoes = [
  { name: 'Nike Vaporfly 3', stack: '40/32 mm', drop: '8 mm', weight: '187 g', price: '₹18,000', bestFor: 'Race day 5K–marathon', rating: '★★★★★', note: 'ZoomX foam + carbon plate. Gold standard race shoe.' },
  { name: 'Nike Alphafly 3', stack: '44/35 mm', drop: '9 mm', weight: '220 g', price: '₹22,000', bestFor: 'Marathon PB attempts', rating: '★★★★★', note: 'Air pods + carbon plate. Max cushion for long efforts.' },
  { name: 'Adidas Adizero Adios Pro 3', stack: '41/31 mm', drop: '10 mm', weight: '192 g', price: '₹16,500', bestFor: 'Marathon, 10K–HM', rating: '★★★★★', note: 'Lightstrike Pro + EnergyRods 2.0. Fast and forgiving.' },
  { name: 'Asics Metaspeed Sky+', stack: '40/33 mm', drop: '7 mm', weight: '194 g', price: '₹17,000', bestFor: 'Cadence-style runners', rating: '★★★★☆', note: 'FF Turbo foam. Sky+ suits long stride; Edge+ suits high cadence.' },
  { name: 'Saucony Endorphin Pro 3', stack: '39/32 mm', drop: '8.5 mm', weight: '195 g', price: '₹14,000', bestFor: 'Marathon, budget racer', rating: '★★★★☆', note: 'PWRRUN PB foam. Best value carbon racer.' },
  { name: 'Saucony Kinvara 14', stack: '33/27 mm', drop: '4 mm', weight: '211 g', price: '₹9,500', bestFor: 'Daily trainer, speed work', rating: '★★★★☆', note: 'Lightweight daily. Versatile for tempo + easy days.' },
  { name: 'Nike Pegasus 41', stack: '33/23 mm', drop: '10 mm', weight: '283 g', price: '₹11,000', bestFor: 'Easy + moderate runs', rating: '★★★★☆', note: 'ReactX foam. Workhorse trainer. High durability.' },
  { name: 'Brooks Ghost 16', stack: '33/23 mm', drop: '12 mm', weight: '281 g', price: '₹12,000', bestFor: 'Neutral daily trainer', rating: '★★★★☆', note: 'DNA Loft v3. Plush ride. Great for recovery runs.' },
  { name: 'Brooks Glycerin 21', stack: '36/26 mm', drop: '10 mm', weight: '298 g', price: '₹14,000', bestFor: 'Max cushion daily', rating: '★★★★☆', note: 'Most cushioned Brooks. Long run specialist.' },
  { name: 'HOKA Clifton 9', stack: '36/30 mm', drop: '5 mm', weight: '252 g', price: '₹13,000', bestFor: 'Recovery, long easy runs', rating: '★★★★☆', note: 'Plush meta-rocker ride. Gentle on legs after hard sessions.' },
];

const watches = [
  { name: 'Garmin Forerunner 965', battery: '31 hrs GPS', gps: 'Multi-band', metrics: 'Full VO₂, HRV, Load, Recovery, Maps', price: '₹69,990', bestFor: 'Serious marathon training', note: 'Best training ecosystem. AMOLED screen.' },
  { name: 'Garmin Forerunner 265', battery: '20 hrs GPS', gps: 'Multi-band', metrics: 'VO₂, HRV, Load, Recovery', price: '₹47,990', bestFor: 'Intermediate runner value pick', note: 'AMOLED. Lighter and more affordable than 965.' },
  { name: 'Garmin Fenix 8', battery: '90 hrs GPS', gps: 'Multi-band', metrics: 'Full suite + maps + solar', price: '₹1,00,000+', bestFor: 'Ultra / adventure runner', note: 'Rugged, sapphire, solar. Overkill for road only.' },
  { name: 'COROS Pace 3', battery: '38 hrs GPS', gps: 'Dual-frequency', metrics: 'VO₂, EvoLab, Training Load', price: '₹22,990', bestFor: 'Budget performance pick', note: 'Best battery life per rupee. Nylon band essential.' },
  { name: 'COROS Apex 2', battery: '75 hrs GPS', gps: 'Dual-frequency', metrics: 'VO₂, EvoLab, Maps', price: '₹42,990', bestFor: 'Ultra / trail', note: 'Titanium bezel. Exceptional battery for trail ultras.' },
  { name: 'Suunto Race', battery: '50 hrs GPS', gps: 'Dual-frequency', metrics: 'VO₂, Training Peaks sync, Maps', price: '₹52,990', bestFor: 'TrainingPeaks users', note: 'AMOLED. Best native TrainingPeaks integration.' },
  { name: 'Apple Watch Ultra 2', battery: '36 hrs GPS', gps: 'Dual-frequency', metrics: 'HR, SpO₂, Crash detect, Health suite', price: '₹89,900', bestFor: 'Apple ecosystem runners', note: 'Best display & ecosystem. Lacks advanced training load.' },
  { name: 'Polar Vantage V3', battery: '43 hrs GPS', gps: 'Dual-frequency', metrics: 'Full suite, leg power, skin temp', price: '₹59,900', bestFor: 'Physiology-focused runners', note: 'Optical leg power unique. Recovery Pro very accurate.' },
];

/* ── COMPONENT ─────────────────────────────────────────────────────── */

export const ComparePlansModal: React.FC<ComparePlansModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'methodologies',
}) => {
  const [tab, setTab] = useState<Tab>(initialTab);

  // Sync with prop changes (e.g. opened from Shoe card vs Watch card)
  React.useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'methodologies', label: 'Training Methods' },
    { id: 'shoes', label: 'Carbon Shoes' },
    { id: 'watches', label: 'GPS Watches' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="max-w-6xl mx-auto my-8 bg-carbon border border-border p-6 md:p-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-strava font-space text-[9px] tracking-[0.5em] uppercase mb-1">
              Pyrofit · Comparisons
            </div>
            <h2 className="italic-heavy text-3xl md:text-4xl text-fg">
              COMPARE <span className="text-strava">HEAD-TO-HEAD</span>
            </h2>
            <p className="text-muted text-sm mt-2 font-light">
              Training methods, carbon race shoes, and GPS watches — zero affiliate bias.
            </p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-fg transition-colors mt-1" aria-label="Close">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border mb-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-xs font-space uppercase tracking-widest transition-colors ${
                tab === t.id
                  ? 'border-b-2 border-strava text-strava'
                  : 'border-b-2 border-transparent text-muted hover:text-fg'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── METHODOLOGIES ─────────────────────────────────────────── */}
        {tab === 'methodologies' && (
          <div>
            <div className="text-[11px] font-space text-strava/90 mb-3 flex items-center gap-1 sm:hidden">
              ↔ Swipe horizontally to compare all parameters
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal sticky left-0 bg-carbon z-20 shadow-[1px_0_0_0_#262626]">
                      Method
                    </th>
                    {['Best For', 'Intensity Split', 'Weekly Volume', 'Difficulty', 'Key Principle'].map(h => (
                      <th key={h} className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {methodologies.map((m, i) => (
                    <tr key={i} className="border-b border-border/40 hover:bg-surface/50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-fg text-sm sticky left-0 bg-carbon z-10 shadow-[1px_0_0_0_#262626]">{m.name}</td>
                      <td className="py-3 pr-4 text-muted text-xs">{m.bestFor}</td>
                      <td className="py-3 pr-4 text-xs font-space text-strava">{m.intensity}</td>
                      <td className="py-3 pr-4 text-xs text-muted">{m.weeklyVol}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-[10px] font-space uppercase px-2 py-0.5 border ${
                          m.difficulty === 'Easy' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                          m.difficulty === 'Intermediate' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' :
                          m.difficulty === 'Hard' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' :
                          m.difficulty === 'Very Hard' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                          'text-purple-400 border-purple-400/30 bg-purple-400/10'
                        }`}>
                          {m.difficulty}
                        </span>
                      </td>
                      <td className="py-3 text-muted text-xs font-light">{m.keyFact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SHOES ─────────────────────────────────────────────────── */}
        {tab === 'shoes' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="text-[10px] font-space text-faint italic">
                All prices approximate India retail (MRP). Zero affiliate links — check brand websites for current pricing.
              </div>
              <div className="text-[11px] font-space text-strava/90 flex items-center gap-1 sm:hidden">
                ↔ Swipe horizontally to compare stack, drop &amp; weight
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal sticky left-0 bg-carbon z-20 shadow-[1px_0_0_0_#262626]">
                      Shoe
                    </th>
                    {['Stack (F/H)', 'Drop', 'Weight', 'India Price', 'Best For', 'Note'].map(h => (
                      <th key={h} className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shoes.map((s, i) => (
                    <tr key={i} className="border-b border-border/40 hover:bg-surface/50 transition-colors">
                      <td className="py-3 pr-4 sticky left-0 bg-carbon z-10 shadow-[1px_0_0_0_#262626]">
                        <div className="font-medium text-fg text-sm leading-snug">{s.name}</div>
                        <div className="text-strava text-[10px]">{s.rating}</div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted font-space">{s.stack}</td>
                      <td className="py-3 pr-4 text-xs text-muted">{s.drop}</td>
                      <td className="py-3 pr-4 text-xs text-muted">{s.weight}</td>
                      <td className="py-3 pr-4 text-xs text-strava font-space font-medium">{s.price}</td>
                      <td className="py-3 pr-4 text-xs text-muted">{s.bestFor}</td>
                      <td className="py-3 text-muted text-xs font-light">{s.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── WATCHES ───────────────────────────────────────────────── */}
        {tab === 'watches' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="text-[10px] font-space text-faint italic">
                Prices are India MRP. Battery life at GPS-only mode. Zero affiliate links.
              </div>
              <div className="text-[11px] font-space text-strava/90 flex items-center gap-1 sm:hidden">
                ↔ Swipe horizontally to compare battery &amp; metrics
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal sticky left-0 bg-carbon z-20 shadow-[1px_0_0_0_#262626]">
                      Watch
                    </th>
                    {['GPS Battery', 'GPS Quality', 'Key Metrics', 'India Price', 'Best For', 'Note'].map(h => (
                      <th key={h} className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {watches.map((w, i) => (
                    <tr key={i} className="border-b border-border/40 hover:bg-surface/50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-fg text-sm sticky left-0 bg-carbon z-10 shadow-[1px_0_0_0_#262626]">{w.name}</td>
                      <td className="py-3 pr-4 text-xs text-muted font-space">{w.battery}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-[10px] font-space uppercase px-2 py-0.5 border ${
                          w.gps === 'Multi-band'
                            ? 'text-strava border-strava/30 bg-strava/10'
                            : 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                        }`}>
                          {w.gps}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted max-w-[160px]">{w.metrics}</td>
                      <td className="py-3 pr-4 text-xs text-strava font-space font-medium">{w.price}</td>
                      <td className="py-3 pr-4 text-xs text-muted">{w.bestFor}</td>
                      <td className="py-3 text-muted text-xs font-light">{w.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border text-[10px] font-space text-faint">
          PYROFIT carries no affiliate relationships. All data is editorially independent.
        </div>
      </div>
    </div>
  );
};
