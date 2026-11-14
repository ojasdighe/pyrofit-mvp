import React from 'react';
import { ArrowRight } from 'lucide-react';

export const TrainingScience: React.FC = () => {
  return (
    <section id="training-science" className="py-24 px-8 md:px-20 overflow-hidden border-t border-border bg-carbon">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-start md:items-end justify-between">
        <div className="flex-1">
          <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-4">
            Training Science
          </div>
          <h2
            className="italic-heavy leading-[0.88] tracking-tighter"
            style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
          >
            EVERY KM<br />HAS A JOB.
          </h2>
        </div>

        <div className="flex-1 md:max-w-md">
          <p className="text-muted text-base md:text-lg leading-relaxed font-light mb-8">
            Most runners train hard. Few train <em className="text-fg font-normal not-italic">right</em>. STRIDD assigns a precise physiological purpose to each session — aerobic base, lactate threshold, VO₂max, neuromuscular power.
          </p>
          <a
            href="#four-levers"
            className="font-space text-[10px] tracking-[0.4em] text-strava uppercase border-b border-strava pb-1 hover:text-fg hover:border-white transition-all inline-flex items-center gap-1"
          >
            Explore training systems <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
