/**
 * PYROFIT MVP — Gear & Running Lab View
 * Author: Ojas Ulhas Dighe
 * Date: 2026-11-15
 * Description: Evidence-based laboratory desk providing independent head-to-head comparisons for
 *              carbon race shoes, multi-band GPS watches, and 10 world-class training philosophies.
 */

import React, { useState } from 'react';
import { Layers, Watch, GitCompare, Flag, ArrowRight, Zap, ShieldCheck, HeartPulse, Dumbbell } from 'lucide-react';

interface GearLabViewProps {
  onOpenFuelSchemes: () => void;
  onOpenInjuries: () => void;
  onOpenExercises: () => void;
  onOpenCalculators: () => void;
  onOpenEventCatalogue: () => void;
  onBackToPlans: () => void;
  onGoToFuel: () => void;
}

type LabTab = 'shoes' | 'watches' | 'methodologies';

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
  { name: 'Nike Vaporfly 3', stack: '40/32 mm', drop: '8 mm', weight: '187 g', price: '₹18,000', bestFor: 'Race day 5K–marathon', rating: '★★★★★', note: 'ZoomX foam + carbon plate. Gold standard road racer.' },
  { name: 'Nike Alphafly 3', stack: '44/35 mm', drop: '9 mm', weight: '220 g', price: '₹22,000', bestFor: 'Marathon PB attempts', rating: '★★★★★', note: 'Dual Zoom Air pods + Flyplate. Maximum energy return.' },
  { name: 'Adidas Adizero Adios Pro 3', stack: '41/31 mm', drop: '10 mm', weight: '192 g', price: '₹16,500', bestFor: 'Marathon, 10K–HM', rating: '★★★★★', note: 'Lightstrike Pro + EnergyRods 2.0. Exceptional forefoot pop.' },
  { name: 'Asics Metaspeed Sky+', stack: '40/33 mm', drop: '7 mm', weight: '194 g', price: '₹17,000', bestFor: 'Stride-style runners', rating: '★★★★☆', note: 'FF Turbo foam. High carbon plate positioning for long strides.' },
  { name: 'Saucony Endorphin Pro 3', stack: '39/32 mm', drop: '8.5 mm', weight: '195 g', price: '₹14,000', bestFor: 'Marathon, value pick', rating: '★★★★☆', note: 'PWRRUN PB foam. Most accessible carbon super-shoe.' },
  { name: 'Saucony Kinvara 14', stack: '33/27 mm', drop: '4 mm', weight: '211 g', price: '₹9,500', bestFor: 'Daily tempo, speed work', rating: '★★★★☆', note: 'Low-drop non-plated trainer. Builds foot & calf strength.' },
  { name: 'Nike Pegasus 41', stack: '33/23 mm', drop: '10 mm', weight: '283 g', price: '₹11,000', bestFor: 'Easy + recovery miles', rating: '★★★★☆', note: 'ReactX foam. Proven high-durability daily workhorse.' },
  { name: 'Brooks Ghost 16', stack: '33/23 mm', drop: '12 mm', weight: '281 g', price: '₹12,000', bestFor: 'Neutral daily miles', rating: '★★★★☆', note: 'DNA Loft v3 nitrogen-infused cushion. Extremely reliable.' },
  { name: 'Brooks Glycerin 21', stack: '36/26 mm', drop: '10 mm', weight: '298 g', price: '₹14,000', bestFor: 'Max cushion recovery', rating: '★★★★☆', note: 'Plush ride. Protects joints on recovery runs after hard blocks.' },
  { name: 'HOKA Clifton 9', stack: '36/30 mm', drop: '5 mm', weight: '252 g', price: '₹13,000', bestFor: 'Long easy runs', rating: '★★★★☆', note: 'Early-stage meta-rocker geometry. Smooth transition.' },
];

const watches = [
  { name: 'Garmin Forerunner 965', battery: '31 hrs GPS', gps: 'Multi-band', metrics: 'Full VO₂, HRV, Load, Recovery, Maps', price: '₹69,990', bestFor: 'Serious marathoners', note: 'Top training ecosystem. Bright AMOLED touch display.' },
  { name: 'Garmin Forerunner 265', battery: '20 hrs GPS', gps: 'Multi-band', metrics: 'VO₂, HRV, Load, Morning Report', price: '₹47,990', bestFor: 'Intermediate runners', note: 'AMOLED screen. Best balance of weight, price, and metrics.' },
  { name: 'Garmin Fenix 8', battery: '90 hrs GPS', gps: 'Multi-band', metrics: 'Full suite + maps + solar + dive', price: '₹1,00,000+', bestFor: 'Ultra / adventure', note: 'Titanium bezel, sapphire lens. Heavy-duty endurance tank.' },
  { name: 'COROS Pace 3', battery: '38 hrs GPS', gps: 'Dual-frequency', metrics: 'VO₂, EvoLab, Training Load', price: '₹22,990', bestFor: 'Value performance', note: '30g featherweight. Unbeatable battery-to-rupee ratio.' },
  { name: 'COROS Apex 2', battery: '75 hrs GPS', gps: 'Dual-frequency', metrics: 'VO₂, EvoLab, Global Maps', price: '₹42,990', bestFor: 'Trail & 100K ultras', note: 'Titanium durability. UltraMax battery modes.' },
  { name: 'Suunto Race', battery: '50 hrs GPS', gps: 'Dual-frequency', metrics: 'VO₂, TrainingPeaks sync, Maps', price: '₹52,990', bestFor: 'TrainingPeaks users', note: 'Digital crown control. Superb native TrainingPeaks metrics.' },
  { name: 'Apple Watch Ultra 2', battery: '36 hrs GPS', gps: 'Dual-frequency', metrics: 'HR, SpO₂, ECG, Health suite', price: '₹89,900', bestFor: 'Apple ecosystem', note: '3,000 nit screen. Unrivaled smartwatch, basic load analysis.' },
  { name: 'Polar Vantage V3', battery: '43 hrs GPS', gps: 'Dual-frequency', metrics: 'Optical running power, recovery', price: '₹59,900', bestFor: 'Physiology purists', note: 'Wrist-based running power without pods. Deep sleep staging.' },
];

export const GearLabView: React.FC<GearLabViewProps> = ({
  onOpenFuelSchemes,
  onOpenInjuries,
  onOpenExercises,
  onOpenCalculators,
  onOpenEventCatalogue,
  onBackToPlans,
  onGoToFuel,
}) => {
  const [tab, setTab] = useState<LabTab>('shoes');

  return (
    <div className="pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb & Navigation Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border flex-wrap gap-3">
        <button
          onClick={onBackToPlans}
          className="text-xs font-space uppercase tracking-widest text-muted hover:text-strava flex items-center gap-1.5 transition-colors"
        >
          ← Back to Training Plans
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-space text-faint uppercase hidden sm:inline">
            Zero Affiliate Bias · 100% Independent Laboratory Data
          </span>
          <button
            onClick={onGoToFuel}
            className="text-xs font-space font-bold uppercase tracking-wider px-3 py-1.5 bg-strava text-on-brand hover:bg-white transition-colors"
          >
            Open Fuel Engine →
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="mb-10">
        <div className="text-strava font-space text-[10px] tracking-[0.5em] uppercase font-bold mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-strava" /> THE EVIDENCE DESK · 490+ BENCHMARKS
        </div>
        <h1 className="italic-heavy text-4xl sm:text-5xl text-fg leading-none">
          GEAR &amp; <span className="text-strava">RUNNING LAB</span>
        </h1>
        <p className="text-muted text-sm sm:text-base font-light mt-3 max-w-3xl leading-relaxed">
          Side-by-side engineering comparisons for marathon racers: Carbon-plate super-shoes, multi-band GPS watches, and 10 world-class training philosophies. No sponsored reviews.
        </p>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <button
          onClick={onOpenEventCatalogue}
          className="p-4 bg-surface border border-border hover:border-strava/40 text-left transition-all group"
        >
          <Flag className="w-5 h-5 text-strava mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-space text-xs font-bold uppercase text-fg group-hover:text-strava transition-colors">
            Event Catalogue
          </div>
          <div className="text-[10px] text-faint mt-1">18 Major &amp; Indian Races</div>
        </button>

        <button
          onClick={onOpenFuelSchemes}
          className="p-4 bg-surface border border-border hover:border-strava/40 text-left transition-all group"
        >
          <Zap className="w-5 h-5 text-strava mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-space text-xs font-bold uppercase text-fg group-hover:text-strava transition-colors">
            Fuel Schemes
          </div>
          <div className="text-[10px] text-faint mt-1">Gels, electrolytes &amp; carbs</div>
        </button>

        <button
          onClick={onOpenInjuries}
          className="p-4 bg-surface border border-border hover:border-strava/40 text-left transition-all group"
        >
          <HeartPulse className="w-5 h-5 text-strava mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-space text-xs font-bold uppercase text-fg group-hover:text-strava transition-colors">
            Injury Protocols
          </div>
          <div className="text-[10px] text-faint mt-1">Prevention &amp; return criteria</div>
        </button>

        <button
          onClick={onOpenExercises}
          className="p-4 bg-surface border border-border hover:border-strava/40 text-left transition-all group"
        >
          <Dumbbell className="w-5 h-5 text-strava mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-space text-xs font-bold uppercase text-fg group-hover:text-strava transition-colors">
            Exercise Library
          </div>
          <div className="text-[10px] text-faint mt-1">20 running strength drills</div>
        </button>
      </div>

      {/* Main Comparison Section */}
      <div className="bg-carbon border border-border p-5 sm:p-8 shadow-2xl">
        {/* Tab Switcher */}
        <div className="flex border-b border-border mb-6 overflow-x-auto">
          {[
            { id: 'shoes' as LabTab, label: 'Carbon Race Shoes', icon: Layers },
            { id: 'watches' as LabTab, label: 'GPS Sports Watches', icon: Watch },
            { id: 'methodologies' as LabTab, label: 'Training Methodologies', icon: GitCompare },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-3 text-xs font-space uppercase tracking-widest font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  active
                    ? 'border-b-2 border-strava text-strava'
                    : 'border-b-2 border-transparent text-muted hover:text-fg'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ── SHOES TAB ─────────────────────────────────────────── */}
        {tab === 'shoes' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="text-[11px] font-space text-faint italic">
                All prices approximate India retail (MRP). Lab weights measured on men's US 9.
              </div>
              <div className="text-[11px] font-space text-strava/90 flex items-center gap-1 sm:hidden">
                ↔ Swipe horizontally to compare stack, drop &amp; weight
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[760px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal sticky left-0 bg-carbon z-20 shadow-[1px_0_0_0_#262626]">
                      Shoe Model
                    </th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Stack (Heel/Forefoot)</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Drop</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Weight</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Price (INR)</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Ideal Role</th>
                    <th className="pb-3 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Lab Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {shoes.map((s, i) => (
                    <tr key={i} className="border-b border-border/40 hover:bg-surface/50 transition-colors">
                      <td className="py-3.5 pr-4 sticky left-0 bg-carbon z-10 shadow-[1px_0_0_0_#262626]">
                        <div className="font-medium text-fg text-sm">{s.name}</div>
                        <div className="text-strava text-[10px] font-space">{s.rating}</div>
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-muted font-space">{s.stack}</td>
                      <td className="py-3.5 pr-4 text-xs text-muted">{s.drop}</td>
                      <td className="py-3.5 pr-4 text-xs text-muted font-space">{s.weight}</td>
                      <td className="py-3.5 pr-4 text-xs text-strava font-space font-bold">{s.price}</td>
                      <td className="py-3.5 pr-4 text-xs text-muted">{s.bestFor}</td>
                      <td className="py-3.5 text-muted text-xs font-light max-w-[220px]">{s.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── WATCHES TAB ───────────────────────────────────────── */}
        {tab === 'watches' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="text-[11px] font-space text-faint italic">
                GPS battery life based on multi-band/all-systems mode. Prices approximate India retail.
              </div>
              <div className="text-[11px] font-space text-strava/90 flex items-center gap-1 sm:hidden">
                ↔ Swipe horizontally to compare battery life &amp; metrics
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[760px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal sticky left-0 bg-carbon z-20 shadow-[1px_0_0_0_#262626]">
                      GPS Watch
                    </th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Battery (GPS)</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">GPS Chipset</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Key Athletic Metrics</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Price (INR)</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Best For</th>
                    <th className="pb-3 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Lab Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {watches.map((w, i) => (
                    <tr key={i} className="border-b border-border/40 hover:bg-surface/50 transition-colors">
                      <td className="py-3.5 pr-4 sticky left-0 bg-carbon z-10 shadow-[1px_0_0_0_#262626] font-medium text-fg text-sm">
                        {w.name}
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-muted font-space">{w.battery}</td>
                      <td className="py-3.5 pr-4">
                        <span className={`text-[10px] font-space uppercase px-2 py-0.5 border ${
                          w.gps === 'Multi-band'
                            ? 'text-strava border-strava/30 bg-strava/10'
                            : 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                        }`}>
                          {w.gps}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-muted max-w-[180px]">{w.metrics}</td>
                      <td className="py-3.5 pr-4 text-xs text-strava font-space font-bold">{w.price}</td>
                      <td className="py-3.5 pr-4 text-xs text-muted">{w.bestFor}</td>
                      <td className="py-3.5 text-muted text-xs font-light max-w-[220px]">{w.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── METHODOLOGIES TAB ─────────────────────────────────── */}
        {tab === 'methodologies' && (
          <div>
            <div className="text-[11px] font-space text-strava/90 mb-4 flex items-center gap-1 sm:hidden">
              ↔ Swipe horizontally to compare all 10 training systems
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[760px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal sticky left-0 bg-carbon z-20 shadow-[1px_0_0_0_#262626]">
                      Methodology
                    </th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Target Athlete</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Intensity Split</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Weekly Volume</th>
                    <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Difficulty</th>
                    <th className="pb-3 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Core Principle</th>
                  </tr>
                </thead>
                <tbody>
                  {methodologies.map((m, i) => (
                    <tr key={i} className="border-b border-border/40 hover:bg-surface/50 transition-colors">
                      <td className="py-3.5 pr-4 sticky left-0 bg-carbon z-10 shadow-[1px_0_0_0_#262626] font-medium text-fg text-sm">
                        {m.name}
                      </td>
                      <td className="py-3.5 pr-4 text-muted text-xs">{m.bestFor}</td>
                      <td className="py-3.5 pr-4 text-xs font-space text-strava font-bold">{m.intensity}</td>
                      <td className="py-3.5 pr-4 text-xs text-muted font-space">{m.weeklyVol}</td>
                      <td className="py-3.5 pr-4">
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
                      <td className="py-3.5 text-muted text-xs font-light max-w-[260px]">{m.keyFact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
