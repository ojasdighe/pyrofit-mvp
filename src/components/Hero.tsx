/**
 * PYROFIT MVP — Landing Page Hero Section
 * Author: Ojas Ulhas Dighe
 * Date: 2026-11-15
 * Description: Redesigned high-impact full-bleed hero with neon orange aesthetic, dynamic stats ribbon, and primary action CTAs.
 */

import React from 'react';

interface HeroProps {
  onOpenGenerator: (mode?: 'standard' | 'couch') => void;
  onOpenCalculators: () => void;
  onOpenPyrofit: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenGenerator, onOpenCalculators, onOpenPyrofit }) => {
  return (
    <div className="pt-16">
      {/* Ticker marquee */}
      <div
        className="h-9 flex items-center overflow-hidden border-b border-border relative z-20"
        style={{ background: 'rgba(255,107,26,0.04)' }}
      >
        <div className="animate-marquee font-space text-xs tracking-[0.5em] text-strava/80 uppercase">
          PYROFIT // PRECISION FUELING // SMART TRAINING // RACE READY // NEON ORANGE // 10 METHODOLOGIES // VDOT SCIENCE // LYDIARD BASE // PYROFIT // PRECISION FUELING // SMART TRAINING // RACE READY // NEON ORANGE // 10 METHODOLOGIES // VDOT SCIENCE // LYDIARD BASE //
        </div>
      </div>

      {/* Hero section: full-bleed centered layout */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden border-b border-border">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1600&auto=format&fit=crop"
          alt="Runner in motion on track"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.25)' }}
        />

        {/* Centered content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 flex flex-col items-center">
          <h1
            className="italic-heavy brand-glow text-fg mb-4 leading-[0.85] tracking-tighter"
            style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
          >
            FUEL. TRAIN. RACE.
          </h1>

          <p className="text-muted font-space text-sm tracking-[0.3em] uppercase mb-8">
            Science-backed running plans. Zero fluff.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={onOpenPyrofit}
              className="bg-strava italic-heavy text-on-brand py-4 px-10 text-lg font-black shadow-[0_16px_48px_rgba(255,107,26,0.35)] hover:shadow-[0_20px_60px_rgba(255,107,26,0.5)] transition-all"
            >
              OPEN PYROFIT
            </button>
            <button
              onClick={() => onOpenGenerator('standard')}
              className="border-2 border-strava/60 py-4 px-8 text-strava hover:bg-strava hover:text-on-brand transition-all italic-heavy text-lg"
            >
              BUILD MY PLAN
            </button>
            <button
              onClick={() => onOpenGenerator('couch')}
              className="italic-heavy text-lg border-2 border-strava/60 py-4 px-8 text-strava hover:bg-strava hover:text-on-brand hover:border-strava transition-all"
            >
              COUCH TO 5K
            </button>
          </div>

          {/* Sub-pills */}
          <div className="flex flex-wrap gap-2 justify-center">
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
        </div>

        {/* Stats bar pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-brand/30 bg-black/60 backdrop-blur-sm flex justify-center gap-6 sm:gap-16 py-4 sm:py-5 overflow-x-auto">
          <div className="text-center">
            <div className="italic-heavy text-3xl text-strava">10</div>
            <div className="text-[9px] font-space text-faint uppercase tracking-widest mt-0.5">Methodologies</div>
          </div>
          <div className="text-center">
            <div className="italic-heavy text-3xl text-strava">7</div>
            <div className="text-[9px] font-space text-faint uppercase tracking-widest mt-0.5">Workout Types</div>
          </div>
          <div className="text-center">
            <div className="italic-heavy text-3xl text-strava">40+</div>
            <div className="text-[9px] font-space text-faint uppercase tracking-widest mt-0.5">Long-form Guides</div>
          </div>
        </div>
      </section>
    </div>
  );
};
