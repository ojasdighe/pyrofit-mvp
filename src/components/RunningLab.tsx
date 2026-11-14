import React from 'react';
import { Layers, GitCompare, Award, ArrowRight } from 'lucide-react';

interface RunningLabProps {
  onOpenGenerator: () => void;
}

export const RunningLab: React.FC<RunningLabProps> = ({ onOpenGenerator }) => {
  return (
    <section id="running-lab" className="py-24 px-8 md:px-20 border-t border-border bg-bg/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-4">
              The Running Lab · 490+ articles
            </div>
            <h2
              className="italic-heavy leading-[0.88] tracking-tighter mb-5"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
            >
              THE RUNNING<br />
              <span className="text-faint">LAB.</span>
            </h2>
            <p className="text-muted text-base font-light leading-relaxed max-w-md mb-8">
              Our evidence-first writing desk — hundreds of deep-dives on gear and shoes, race guides, head-to-head comparisons, injury science and how-tos. Researched, cited, and written for runners, not search engines.
            </p>
            <button
              onClick={onOpenGenerator}
              className="inline-flex items-center gap-2 bg-strava italic-heavy text-on-brand py-4 px-10 text-base font-bold hover:bg-white transition-colors"
            >
              ENTER THE LAB <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div
              onClick={onOpenGenerator}
              className="cursor-pointer bg-surface border border-border p-5 group hover:border-strava/30 transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-sm bg-strava/10 flex items-center justify-center text-strava group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="italic-heavy text-base group-hover:text-strava transition-colors leading-snug">
                  Gear &amp; shoes
                </div>
                <div className="text-faint text-xs font-light leading-snug mt-0.5">
                  161 shoe &amp; gear deep-dives with lab measurements
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-faint group-hover:text-strava group-hover:translate-x-1 transition-all" />
            </div>

            <div
              onClick={onOpenGenerator}
              className="cursor-pointer bg-surface border border-border p-5 group hover:border-strava/30 transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-sm bg-strava/10 flex items-center justify-center text-strava group-hover:scale-110 transition-transform">
                <GitCompare className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="italic-heavy text-base group-hover:text-strava transition-colors leading-snug">
                  Comparisons
                </div>
                <div className="text-faint text-xs font-light leading-snug mt-0.5">
                  Head-to-head, scored on the metrics that matter
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-faint group-hover:text-strava group-hover:translate-x-1 transition-all" />
            </div>

            <div
              onClick={onOpenGenerator}
              className="cursor-pointer bg-surface border border-border p-5 group hover:border-strava/30 transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-sm bg-strava/10 flex items-center justify-center text-strava group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="italic-heavy text-base group-hover:text-strava transition-colors leading-snug">
                  Best-of guides
                </div>
                <div className="text-faint text-xs font-light leading-snug mt-0.5">
                  Curated picks, zero affiliate bias or sponsored rankings
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-faint group-hover:text-strava group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
