import React from 'react';
import { Footprints, ArrowRight } from 'lucide-react';

interface CouchTo5KBannerProps {
  onStartCouch: () => void;
}

export const CouchTo5KBanner: React.FC<CouchTo5KBannerProps> = ({ onStartCouch }) => {
  return (
    <section className="border-b border-strava/30 bg-gradient-to-r from-strava/[0.08] via-strava/[0.04] to-transparent py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-8 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Footprints className="w-5 h-5 text-strava" />
            <span className="text-[10px] font-space text-strava tracking-[0.4em] uppercase font-bold">
              For first-time runners
            </span>
          </div>

          <h2
            className="italic-heavy leading-[0.88] tracking-tighter mb-3"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
          >
            COUCH TO <span className="text-strava">FIRST 5K.</span>
          </h2>

          <p className="text-muted text-base md:text-lg font-light leading-relaxed max-w-2xl">
            Never run a step before? An 8-week run-walk plan that finishes on a 5K. No pace zones. No jargon. Three sessions a week, starting with 30 seconds of running at a time.{' '}
            <span className="text-fg font-medium">This is where runners are made.</span>
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-[11px] font-space text-faint">
            <span>· 8 weeks</span>
            <span>· 3 days / week</span>
            <span>· Starts at a walk</span>
            <span>· Ends at a 5K finish</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-shrink-0">
          <button
            onClick={onStartCouch}
            className="group relative bg-strava italic-heavy text-on-brand py-4 px-10 text-base overflow-hidden transition-all whitespace-nowrap shadow-[0_16px_48px_rgba(204,255,0,0.25)] hover:shadow-[0_20px_50px_rgba(204,255,0,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              START HERE <ArrowRight className="w-4 h-4" />
            </span>
            <div className="absolute inset-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
          </button>
          <span className="text-[10px] font-space text-faint tracking-widest uppercase text-center">
            3 questions · 30 seconds
          </span>
        </div>
      </div>
    </section>
  );
};
