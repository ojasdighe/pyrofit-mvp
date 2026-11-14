import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';

interface HeroProps {
  onOpenGenerator: (mode?: 'standard' | 'couch') => void;
  onOpenCalculators: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenGenerator, onOpenCalculators }) => {
  return (
    <div className="pt-16">
      {/* Ticker marquee */}
      <div
        className="h-9 flex items-center overflow-hidden border-b border-border relative z-20"
        style={{ background: 'rgba(204,255,0,0.04)' }}
      >
        <div className="animate-marquee font-space text-xs tracking-[0.5em] text-strava/80 uppercase">
          STRIDD.RUN // FREE TO USE // OPTIONAL ACCOUNT // 10 METHODOLOGIES // NORWEGIAN DOUBLE THRESHOLD // VDOT // LYDIARD BASE // PRECISION PACE ZONES // STRIDD.RUN // FREE TO USE // OPTIONAL ACCOUNT // 10 METHODOLOGIES // NORWEGIAN DOUBLE THRESHOLD // VDOT // LYDIARD BASE // PRECISION PACE ZONES //
        </div>
      </div>

      {/* Service Notice */}
      <section
        className="border-b border-border relative z-10"
        style={{ background: 'rgba(252,76,2,0.03)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="shrink-0 font-space text-[9px] tracking-[0.4em] uppercase text-[#FC4C02] whitespace-nowrap font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" /> SERVICE NOTICE
          </div>
          <div className="min-w-0">
            <div className="font-space text-sm font-bold tracking-wide text-fg">
              We asked Strava to run with us. They stopped to walk.
            </div>
            <p className="text-[13px] text-muted font-light leading-relaxed mt-1">
              We asked Strava to raise our athlete quota so more of you could sync your runs. The answer was no — delivered without a reason, an explanation, or so much as a stretch. It seems the developer community is no longer their pace group, so we've retired Strava API support and doubled down on direct watch integrations: Garmin, Suunto, COROS, and Intervals.icu. Onwards — mostly uphill, as intended.
            </p>
          </div>
        </div>
      </section>

      {/* Hero section with split image & copy */}
      <section className="relative min-h-[90vh] flex flex-col md:flex-row overflow-hidden border-b border-border">
        {/* Left Side: Runner Photo with Dark Overlays */}
        <div className="relative w-full md:w-[55%] min-h-[380px] md:min-h-full overflow-hidden order-1 md:order-none">
          <img
            src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1600&auto=format&fit=crop"
            alt="Runner in motion on track"
            className="w-full h-full object-cover object-center absolute inset-0 filter brightness-[0.55] contrast-[1.1] scale-105 hover:scale-100 transition-transform duration-1000"
          />
          <div
            className="absolute inset-0 md:hidden"
            style={{
              background: 'linear-gradient(to top, var(--bg) 30%, transparent 80%)',
            }}
          />
          <div
            className="hidden md:block absolute inset-y-0 right-0 w-36 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent, var(--bg))',
            }}
          />
          <div className="absolute top-6 left-6 font-space text-[10px] tracking-[0.4em] text-strava bg-black/60 backdrop-blur-sm px-3 py-1 border border-border">
            ATHLETIC ARCHITECTURE // 2026
          </div>
        </div>

        {/* Right Side: Hero Typography & CTAs */}
        <div className="relative z-10 flex flex-col justify-between w-full md:w-[45%] px-8 md:pl-14 md:pr-16 pt-12 pb-16 md:py-20 order-2 md:order-none bg-carbon">
          <div>
            <div className="text-strava font-space text-[10px] tracking-[0.6em] uppercase mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-strava animate-pulse"></span>
              PROTOCOL_ACTIVE // v3.5
            </div>

            <h1
              className="italic-heavy leading-[0.85] tracking-tighter mb-4 text-fg"
              style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
            >
              RUN OR RUST.
            </h1>

            <p className="text-faint font-space text-xs tracking-[0.3em] uppercase mb-8">
              Your training plan. Built on science. Ready in under 3 minutes.
            </p>

            <p className="text-base md:text-lg text-muted font-light leading-relaxed mb-10 max-w-md">
              Your next race deserves a real plan. Pick your distance, set your goal — STRIDD builds a personalised training blueprint in under 3 minutes. Free to use. Optional account for cloud sync. Your data, your control.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onOpenGenerator('standard')}
                className="group relative bg-strava italic-heavy text-on-brand py-4 px-10 text-lg overflow-hidden transition-all text-center font-black shadow-[0_16px_48px_rgba(204,255,0,0.25)] hover:shadow-[0_20px_60px_rgba(204,255,0,0.4)]"
              >
                <span className="relative z-10">BUILD MY PLAN</span>
                <div className="absolute inset-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
              </button>

              <button
                onClick={() => onOpenGenerator('couch')}
                className="group italic-heavy text-lg border-2 border-strava/50 py-4 px-8 text-strava hover:bg-strava hover:text-on-brand hover:border-strava transition-all text-center"
              >
                COUCH TO 5K
              </button>

              <button
                onClick={onOpenCalculators}
                className="group italic-heavy text-lg border-2 border-border py-4 px-6 text-muted hover:text-fg hover:border-fg transition-all text-center"
              >
                VDOT / CALCULATORS
              </button>
            </div>

            {/* Sub-pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              <a
                href="#go-deeper"
                className="border border-strava/30 bg-strava/5 text-strava/90 hover:bg-strava/10 px-4 py-2 italic-heavy text-xs tracking-[0.3em] transition-colors"
              >
                MARATHON TRAVEL →
              </a>
              <a
                href="#go-deeper"
                className="border border-strava/30 bg-strava/5 text-strava/90 hover:bg-strava/10 px-4 py-2 italic-heavy text-xs tracking-[0.3em] transition-colors"
              >
                NUTRITION SCIENCE →
              </a>
              <a
                href="#go-deeper"
                className="border border-strava/30 bg-strava/5 text-strava/90 hover:bg-strava/10 px-4 py-2 italic-heavy text-xs tracking-[0.3em] transition-colors"
              >
                FUEL COMPARE →
              </a>
            </div>

            <p className="text-faint font-space text-[10px] tracking-[0.4em] uppercase mt-5">
              Two paths. Same finish line.
            </p>

            <button
              onClick={() => onOpenGenerator('couch')}
              className="mt-3 text-[11px] font-space tracking-[0.25em] uppercase text-muted hover:text-strava border-b border-border hover:border-strava pb-1 transition-all inline-flex items-center gap-1.5 group"
            >
              Never run a step before?
              <span className="text-strava opacity-70 group-hover:opacity-100 flex items-center">
                Start here <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </button>

            <div className="flex items-center gap-6 mt-6 text-[10px] tracking-[0.2em] uppercase text-faint font-mono flex-wrap">
              <span>Free to use</span>
              <span className="text-faint">|</span>
              <a
                href="#run-club"
                className="text-strava hover:text-fg transition-colors underline-offset-4 hover:underline font-bold"
              >
                Built for serious runners
              </a>
              <span className="text-faint">|</span>
              <a href="#how-it-works" className="hover:text-fg transition-colors underline-offset-4 hover:underline">
                How it works →
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-8 pt-10 border-t border-border mt-10">
            <div>
              <div className="italic-heavy text-3xl text-strava">10</div>
              <div className="text-[9px] font-space text-faint uppercase tracking-widest mt-0.5">
                Methodologies
              </div>
            </div>
            <div>
              <div className="italic-heavy text-3xl text-strava">7</div>
              <div className="text-[9px] font-space text-faint uppercase tracking-widest mt-0.5">
                Workout Types
              </div>
            </div>
            <div>
              <div className="italic-heavy text-3xl text-strava">40+</div>
              <div className="text-[9px] font-space text-faint uppercase tracking-widest mt-0.5">
                Long-form Guides
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
