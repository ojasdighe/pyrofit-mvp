import React from 'react';
import { Flag, Footprints, Activity, PauseCircle, ArrowRight } from 'lucide-react';

interface FourWaysInProps {
  onOpenGenerator: (mode?: 'standard' | 'couch') => void;
  onOpenCalculators: () => void;
}

export const FourWaysIn: React.FC<FourWaysInProps> = ({ onOpenGenerator, onOpenCalculators }) => {
  return (
    <section className="py-20 px-8 md:px-20 border-t border-border bg-bg/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-10">
          <div>
            <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-2">
              How runners use STRIDD
            </div>
            <h2
              className="italic-heavy leading-[0.88] tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              FOUR WAYS IN.
            </h2>
          </div>
          <button
            onClick={() => onOpenGenerator('standard')}
            className="text-[10px] font-space tracking-[0.4em] text-strava uppercase border-b border-strava pb-1 hover:text-fg hover:border-white transition-all flex items-center gap-1"
          >
            Start building <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div
            onClick={() => onOpenGenerator('standard')}
            className="cursor-pointer text-left bg-surface border border-border p-6 group hover:border-strava/40 hover:bg-strava/[0.02] transition-all flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-4">
              <Flag className="w-5 h-5 text-strava" />
              <span className="text-[8px] font-space text-strava/60 tracking-widest uppercase">
                EVENT PICKER
              </span>
            </div>
            <h3 className="italic-heavy text-xl mb-2 group-hover:text-strava transition-colors">
              Pick a race
            </h3>
            <p className="text-muted text-xs leading-relaxed font-light flex-1">
              Berlin to Ladakh. We auto-fill distance, date, and methodology from a curated list of world Majors and Indian headliners.
            </p>
            <div className="text-[9px] font-space text-strava/70 uppercase tracking-widest mt-4 group-hover:text-strava flex items-center gap-1 transition-colors">
              Try it <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onOpenGenerator('couch')}
            className="cursor-pointer text-left bg-surface border border-border p-6 group hover:border-strava/40 hover:bg-strava/[0.02] transition-all flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-4">
              <Footprints className="w-5 h-5 text-strava" />
              <span className="text-[8px] font-space text-strava/60 tracking-widest uppercase">
                COUCH TO 5K
              </span>
            </div>
            <h3 className="italic-heavy text-xl mb-2 group-hover:text-strava transition-colors">
              Start from zero
            </h3>
            <p className="text-muted text-xs leading-relaxed font-light flex-1">
              Never run before? 8-week run-walk ramp. No pace zones, no jargon. Three sessions a week that build a runner.
            </p>
            <div className="text-[9px] font-space text-strava/70 uppercase tracking-widest mt-4 group-hover:text-strava flex items-center gap-1 transition-colors">
              Try it <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={onOpenCalculators}
            className="cursor-pointer text-left bg-surface border border-border p-6 group hover:border-strava/40 hover:bg-strava/[0.02] transition-all flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-5 h-5 text-strava" />
              <span className="text-[8px] font-space text-strava/60 tracking-widest uppercase">
                SCIENCE
              </span>
            </div>
            <h3 className="italic-heavy text-xl mb-2 group-hover:text-strava transition-colors">
              Chase a VDOT
            </h3>
            <p className="text-muted text-xs leading-relaxed font-light flex-1">
              Jack Daniels' single-number fitness score, computed from your goal time. Seven calibrated zones follow.
            </p>
            <div className="text-[9px] font-space text-strava/70 uppercase tracking-widest mt-4 group-hover:text-strava flex items-center gap-1 transition-colors">
              Try it <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onOpenGenerator('standard')}
            className="cursor-pointer text-left bg-surface border border-border p-6 group hover:border-strava/40 hover:bg-strava/[0.02] transition-all flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-4">
              <PauseCircle className="w-5 h-5 text-strava" />
              <span className="text-[8px] font-space text-strava/60 tracking-widest uppercase">
                RESILIENCE
              </span>
            </div>
            <h3 className="italic-heavy text-xl mb-2 group-hover:text-strava transition-colors">
              Train through life
            </h3>
            <p className="text-muted text-xs leading-relaxed font-light flex-1">
              Injury, travel, work crunch — pause the plan, resume when you're ready. Current-week pointer stays anchored to reality.
            </p>
            <div className="text-[9px] font-space text-strava/70 uppercase tracking-widest mt-4 group-hover:text-strava flex items-center gap-1 transition-colors">
              Try it <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
