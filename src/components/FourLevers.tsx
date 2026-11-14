import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FourLeversProps {
  onOpenGenerator: () => void;
}

export const FourLevers: React.FC<FourLeversProps> = ({ onOpenGenerator }) => {
  const levers = [
    {
      num: '01',
      title: 'CONSISTENCY',
      desc: 'Aerobic fitness is a debt that must be paid daily. STRIDD plans are built to be sustainable, not heroic.',
    },
    {
      num: '02',
      title: 'PERIODISATION',
      desc: 'Base, Build, Peak, Taper. We structure your cycle to reach maximum capacity on race day, not weeks before it.',
    },
    {
      num: '03',
      title: 'SPECIFICITY',
      desc: 'Every run has a job. If it is an easy run, run easy. If it is a threshold session, hit the pace. No junk miles.',
    },
    {
      num: '04',
      title: 'RECOVERY',
      desc: 'Adaptation happens while you sleep. Our algorithms force recovery weeks every 3-4 weeks to prevent overtraining.',
    },
  ];

  return (
    <section id="four-levers" className="py-24 px-8 md:px-20 border-t border-border bg-carbon">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-4">
              The Four Levers
            </div>
            <h2
              className="italic-heavy leading-[0.88] tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
            >
              FOUR LEVERS.<br />
              <span className="text-faint">ONE ENGINE.</span>
            </h2>
          </div>
          <button
            onClick={onOpenGenerator}
            className="hidden md:flex items-center gap-1 italic-heavy text-sm border-b border-border pb-1 text-faint hover:text-strava hover:border-strava transition-all uppercase"
          >
            Build your plan <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-surface-top border border-border">
          {levers.map((lever, idx) => (
            <div
              key={idx}
              className="p-8 bg-carbon hover:bg-surface transition-colors cursor-default"
            >
              <div className="italic-heavy text-4xl text-faint mb-4">{lever.num}</div>
              <div className="w-5 h-0.5 bg-strava mb-5"></div>
              <div className="italic-heavy text-base text-fg mb-3 leading-snug">
                {lever.title}
              </div>
              <p className="text-xs text-muted font-light leading-relaxed">
                {lever.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
