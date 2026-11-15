/**
 * PYROFIT MVP — Curated Sample Plans Modal
 * Author: Ojas Ulhas Dighe
 * Date: 2026-11-15
 * Description: 8 curated running training blueprints across 7 methodologies with distance filter pills and generator links.
 */

import React, { useState } from 'react';
import { X, Zap, Clock, BarChart2, User } from 'lucide-react';

interface SamplePlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGenerator: (mode?: 'standard' | 'couch') => void;
}

const plans = [
  {
    name: '12-Week Half Marathon — Norwegian',
    distance: 'Half Marathon',
    duration: '12 weeks',
    methodology: 'Norwegian Doubles',
    level: 'Intermediate',
    weeklyKm: '55–70 km',
    desc: 'Lactate threshold doubles, polarised intensity. Best for runners 1:40–2:10.',
    color: 'text-orange-400',
  },
  {
    name: '16-Week Marathon — Lydiard',
    distance: 'Marathon',
    duration: '16 weeks',
    methodology: 'Lydiard Base',
    level: 'Intermediate',
    weeklyKm: '80–110 km',
    desc: 'Aerobic base → anaerobic sharpening → coordination phase. Classic periodisation.',
    color: 'text-orange-400',
  },
  {
    name: '8-Week 5K — VDOT',
    distance: '5K',
    duration: '8 weeks',
    methodology: 'Jack Daniels VDOT',
    level: 'Beginner',
    weeklyKm: '25–40 km',
    desc: 'E-pace → M-pace → T-pace → I-pace progressions calibrated to your VDOT score.',
    color: 'text-blue-400',
  },
  {
    name: '20-Week Marathon — Pfitzinger 70',
    distance: 'Marathon',
    duration: '20 weeks',
    methodology: 'Pfitzinger',
    level: 'Advanced',
    weeklyKm: '90–115 km',
    desc: 'Pfitz 70-mile plan. High volume, medium-long runs, lactate threshold focus.',
    color: 'text-red-400',
  },
  {
    name: '12-Week 10K — Hansons',
    distance: '10K',
    duration: '12 weeks',
    methodology: 'Hansons',
    level: 'Intermediate',
    weeklyKm: '60–80 km',
    desc: 'Cumulative fatigue training. SOS days (Speed / Strength / MP). No taper shock.',
    color: 'text-orange-400',
  },
  {
    name: '18-Week Marathon — Maffetone MAF',
    distance: 'Marathon',
    duration: '18 weeks',
    methodology: 'Maffetone MAF',
    level: 'Beginner',
    weeklyKm: '50–75 km',
    desc: '100% aerobic training at 180–age BPM. Builds fat-burning engine over 18 weeks.',
    color: 'text-blue-400',
  },
  {
    name: '14-Week Half — Galloway Run-Walk',
    distance: 'Half Marathon',
    duration: '14 weeks',
    methodology: 'Galloway',
    level: 'Beginner',
    weeklyKm: '30–50 km',
    desc: 'Run-walk intervals allow anyone to finish a half. Low injury risk. No experience needed.',
    color: 'text-blue-400',
  },
  {
    name: '8-Week Couch to 5K',
    distance: '5K',
    duration: '8 weeks',
    methodology: 'Run-Walk Ramp',
    level: 'Absolute Beginner',
    weeklyKm: '8–20 km',
    desc: '3 sessions/week. Walk 60 s, run 60 s — ramps to 30 min non-stop run by Week 8.',
    color: 'text-green-400',
  },
];

const levelColor: Record<string, string> = {
  'Absolute Beginner': 'bg-green-400/15 text-green-400 border border-green-400/30',
  Beginner: 'bg-blue-400/15 text-blue-400 border border-blue-400/30',
  Intermediate: 'bg-orange-400/15 text-orange-400 border border-orange-400/30',
  Advanced: 'bg-red-400/15 text-red-400 border border-red-400/30',
};

export const SamplePlansModal: React.FC<SamplePlansModalProps> = ({
  isOpen,
  onClose,
  onOpenGenerator,
}) => {
  const [filter, setFilter] = useState<string>('All');
  const filters = ['All', '5K', '10K', 'Half Marathon', 'Marathon'];

  if (!isOpen) return null;

  const visible = filter === 'All' ? plans : plans.filter(p => p.distance === filter);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="max-w-5xl mx-auto my-8 bg-carbon border border-border p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-strava font-space text-[9px] tracking-[0.5em] uppercase mb-1">
              Pyrofit · Sample Plans
            </div>
            <h2 className="italic-heavy text-3xl md:text-4xl text-fg">
              SAMPLE <span className="text-strava">PLANS</span>
            </h2>
            <p className="text-muted text-sm mt-2 font-light">
              8 curated plans across 7 methodologies. Load instantly or customise with the Blueprint Generator.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-fg transition-colors mt-1"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-space uppercase tracking-widest transition-colors ${
                filter === f
                  ? 'bg-strava text-on-brand'
                  : 'border border-border text-muted hover:border-strava/50 hover:text-fg'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Plan cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visible.map((plan, i) => (
            <div
              key={i}
              className="bg-surface border border-border p-5 hover:border-strava/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="italic-heavy text-base leading-snug group-hover:text-strava transition-colors">
                    {plan.name}
                  </h3>
                  <span
                    className={`shrink-0 text-[9px] font-space uppercase tracking-wider px-2 py-0.5 ${levelColor[plan.level]}`}
                  >
                    {plan.level}
                  </span>
                </div>
                <p className="text-muted text-xs font-light leading-relaxed mb-4">
                  {plan.desc}
                </p>
                <div className="flex flex-wrap gap-3 text-[10px] font-space text-faint">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {plan.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart2 className="w-3 h-3" /> {plan.weeklyKm}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {plan.methodology}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => { onClose(); onOpenGenerator('standard'); }}
                  className="text-[10px] font-space uppercase tracking-widest text-strava hover:text-fg transition-colors flex items-center gap-1"
                >
                  Customise in Generator →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-fg font-space text-sm uppercase tracking-wider font-bold">
              Want a plan built around YOU?
            </div>
            <div className="text-muted text-xs mt-1 font-light">
              Enter your race, fitness level and schedule — the Blueprint Generator does the rest.
            </div>
          </div>
          <button
            onClick={() => { onClose(); onOpenGenerator('standard'); }}
            className="bg-strava text-on-brand italic-heavy px-8 py-3 text-sm font-black hover:bg-white transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <User className="w-4 h-4" /> BUILD MY PLAN
          </button>
        </div>
      </div>
    </div>
  );
};
