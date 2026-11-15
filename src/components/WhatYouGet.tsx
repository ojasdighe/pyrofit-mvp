/**
 * PYROFIT MVP — What You Get Value Proposition
 * Author: Ojas Ulhas Dighe
 * Date: 2026-11-15
 * Description: 3-card core value showcase wired to Event Catalogue, Zone Calculators, and Couch-to-5K.
 */

import React from 'react';
import { Flag, Gauge, Footprints, ArrowRight } from 'lucide-react';

interface WhatYouGetProps {
  onOpenGenerator: (mode?: 'standard' | 'couch') => void;
  onOpenEventCatalogue?: () => void;
  onOpenCalculators?: () => void;
}

export const WhatYouGet: React.FC<WhatYouGetProps> = ({ onOpenGenerator, onOpenEventCatalogue, onOpenCalculators }) => {
  return (
    <section className="py-24 px-8 md:px-20 border-t border-border bg-carbon">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-3">
            What You Get
          </div>
          <h2
            className="italic-heavy leading-[0.88] tracking-tighter"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
          >
            YOUR PLAN.<br />
            <span className="text-faint">DECODED.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => onOpenEventCatalogue ? onOpenEventCatalogue() : onOpenGenerator('standard')}
            className="cursor-pointer bg-surface border border-border p-8 group hover:border-strava/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <Flag className="w-6 h-6 text-strava" />
                <span className="text-faint font-space text-[9px] tracking-[0.4em] uppercase">
                  EVENT PICKER
                </span>
              </div>
              <h3 className="italic-heavy text-xl mb-4 group-hover:text-strava transition-colors leading-snug">
                PICK YOUR RACE · PLAN BUILDS ITSELF
              </h3>
              <p className="text-muted text-sm leading-relaxed font-light">
                Pick from a curated list of world Majors and Indian headline races — Berlin, Boston, Ladakh, Mumbai, UTMB. We auto-fill distance, date, and recommend a methodology that fits the course.
              </p>
            </div>
            <div className="mt-6 text-[10px] font-space text-strava tracking-widest uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse events <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onOpenCalculators ? onOpenCalculators() : onOpenGenerator('standard')}
            className="cursor-pointer bg-surface border border-border p-8 group hover:border-strava/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <Gauge className="w-6 h-6 text-strava" />
                <span className="text-faint font-space text-[9px] tracking-[0.4em] uppercase">
                  ZONES
                </span>
              </div>
              <h3 className="italic-heavy text-xl mb-4 group-hover:text-strava transition-colors leading-snug">
                PACES · HR · FEEL — YOUR LANGUAGE
              </h3>
              <p className="text-muted text-sm leading-relaxed font-light">
                Seven calibrated zones from your VDOT score. Toggle between pace (min/km or min/mi), heart-rate zones, or pure effort-feel (RPE). Your plan speaks your athletic dialect.
              </p>
            </div>
            <div className="mt-6 text-[10px] font-space text-strava tracking-widest uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open calculators <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onOpenGenerator('couch')}
            className="cursor-pointer bg-surface border border-border p-8 group hover:border-strava/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <Footprints className="w-6 h-6 text-strava" />
                <span className="text-faint font-space text-[9px] tracking-[0.4em] uppercase">
                  COUCH TO 5K
                </span>
              </div>
              <h3 className="italic-heavy text-xl mb-4 group-hover:text-strava transition-colors leading-snug">
                STARTING FROM ZERO? SAME TOOL
              </h3>
              <p className="text-muted text-sm leading-relaxed font-light">
                8-week Couch-to-5K run-walk ramp for anyone who's never run a step. No jargon, no pace zones. Just 3 sessions a week that systematically build a real runner. Whether you're new to running, cycling, or triathlon — the same system works.
              </p>
            </div>
            <div className="mt-6 text-[10px] font-space text-strava tracking-widest uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Start couch plan <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
