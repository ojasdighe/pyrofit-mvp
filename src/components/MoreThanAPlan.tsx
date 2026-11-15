import React from 'react';
import { Activity, Users, TrendingUp, ArrowRight } from 'lucide-react';

interface MoreThanAPlanProps {
  onOpenGenerator: () => void;
}

export const MoreThanAPlan: React.FC<MoreThanAPlanProps> = ({ onOpenGenerator }) => {
  return (
    <section className="py-24 px-8 md:px-20 border-t border-border bg-bg/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-12">
          <div>
            <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-2">
              With a free account
            </div>
            <h2
              className="italic-heavy leading-[0.88] tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
            >
              MORE THAN<br />
              <span className="text-faint">A PLAN.</span>
            </h2>
            <p className="text-muted text-base font-light mt-4 max-w-md">
              A plan gets you started. PYROFIT keeps going — track every session, sharpen with a mentor, and grow season after season.
            </p>
          </div>
          <button
            onClick={onOpenGenerator}
            className="text-[10px] font-space tracking-[0.4em] text-strava uppercase border-b border-strava pb-1 hover:text-fg hover:border-white transition-all flex items-center gap-1"
          >
            See how it works <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-border p-8 group hover:border-strava/30 transition-all flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <Activity className="w-6 h-6 text-strava" />
              <span className="text-faint font-space text-[9px] tracking-[0.4em] uppercase">
                ATHLETE
              </span>
            </div>
            <h3 className="italic-heavy text-xl mb-3 group-hover:text-strava transition-colors">
              Track every session
            </h3>
            <p className="text-muted text-sm leading-relaxed font-light flex-1">
              Log sessions, connect your Garmin, Suunto, or COROS, and watch your fitness, weekly load, readiness, and PRs across any sport in one dashboard.
            </p>
          </div>

          <div className="bg-surface border border-border p-8 group hover:border-strava/30 transition-all flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <Users className="w-6 h-6 text-strava" />
              <span className="text-faint font-space text-[9px] tracking-[0.4em] uppercase">
                MENTOR
              </span>
            </div>
            <h3 className="italic-heavy text-xl mb-3 group-hover:text-strava transition-colors">
              Get mentored
            </h3>
            <p className="text-muted text-sm leading-relaxed font-light flex-1">
              Connect with a coach or mentor who proposes plan changes you approve, sends workouts, and trains your squad — you stay in total control.
            </p>
          </div>

          <div className="bg-surface border border-border p-8 group hover:border-strava/30 transition-all flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <TrendingUp className="w-6 h-6 text-strava" />
              <span className="text-faint font-space text-[9px] tracking-[0.4em] uppercase">
                PROGRESS
              </span>
            </div>
            <h3 className="italic-heavy text-xl mb-3 group-hover:text-strava transition-colors">
              Grow with it
            </h3>
            <p className="text-muted text-sm leading-relaxed font-light flex-1">
              Zones recalibrate as you improve. Pause for life, resume without losing your place. From first 5K to your next Marathon personal best.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <button
            onClick={onOpenGenerator}
            className="bg-strava italic-heavy text-on-brand py-4 px-10 text-base font-bold hover:bg-white transition-colors"
          >
            BUILD MY PLAN NOW →
          </button>
          <span className="text-[10px] font-space text-faint tracking-[0.3em] uppercase">
            Free to use · No account required · Push to your watch
          </span>
        </div>
      </div>
    </section>
  );
};
