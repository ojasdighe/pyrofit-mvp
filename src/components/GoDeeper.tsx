/**
 * PYROFIT MVP — Go Deeper Resource Hub
 * Author: Ojas Ulhas Dighe
 * Date: 2026-11-15
 * Description: 11-card navigation grid mapping directly to dedicated modals: Fuel Schemes, Injury Prevention,
 *              Exercises, Sample Plans, Race Catalogue, and Head-to-Head Comparisons.
 */

import React from 'react';
import {
  Zap,
  Flag,
  Utensils,
  CupSoda,
  Plane,
  Dumbbell,
  Calculator,
  HeartPulse,
  GitCompare,
  Layers,
  Watch,
  ArrowRight,
} from 'lucide-react';

interface GoDeeperProps {
  onOpenCalculators: () => void;
  onOpenGenerator: (mode?: 'standard' | 'couch') => void;
  onOpenFuelSchemes: () => void;
  onOpenInjuries: () => void;
  onOpenExercises: () => void;
  onOpenSamplePlans: () => void;
  onOpenEventCatalogue: () => void;
  onOpenCompareMethods: () => void;
  onOpenShoeComparisons: () => void;
  onOpenWatchComparisons: () => void;
}

export const GoDeeper: React.FC<GoDeeperProps> = ({
  onOpenCalculators,
  onOpenGenerator,
  onOpenFuelSchemes,
  onOpenInjuries,
  onOpenExercises,
  onOpenSamplePlans,
  onOpenEventCatalogue,
  onOpenCompareMethods,
  onOpenShoeComparisons,
  onOpenWatchComparisons,
}) => {
  const cards = [
    {
      icon: Zap,
      title: 'SAMPLE PLANS',
      desc: 'Curated plans across 10 methodologies plus the Absolute Beginner Blueprint. Load instantly.',
      action: () => onOpenSamplePlans(),
      cta: 'Explore →',
    },
    {
      icon: Flag,
      title: 'EVENT CATALOGUE',
      desc: 'Berlin, Boston, Mumbai, Ladakh, UTMB. Course guides, BQ intel, travel specs.',
      action: () => onOpenEventCatalogue(),
      cta: 'Explore →',
    },
    {
      icon: Utensils,
      title: 'NUTRITION',
      desc: 'Periodised carbs, 120g/hr fueling, hydration, RED-S, India-aware plant-based notes.',
      action: () => onOpenFuelSchemes(),
      cta: 'Explore →',
    },
    {
      icon: CupSoda,
      title: 'FUEL COMPARE',
      desc: 'Gels, electrolytes, salt caps — carb-per-rupee and fructose ratios side-by-side.',
      action: () => onOpenFuelSchemes(),
      cta: 'Explore →',
    },
    {
      icon: Plane,
      title: 'TRAVEL PLANNER',
      desc: 'Plan your Major — cost, charity entries, tour operators, flight windows.',
      action: () => onOpenEventCatalogue(),
      cta: 'Explore →',
    },
    {
      icon: Dumbbell,
      title: 'EXERCISES',
      desc: 'Strength, mobility, drills. Search by muscle group and difficulty.',
      action: () => onOpenExercises(),
      cta: 'Explore →',
    },
    {
      icon: Calculator,
      title: 'CALCULATORS',
      desc: 'Race time predictor, pace converter, VDOT. Instant Jack Daniels & Riegel math.',
      action: onOpenCalculators,
      cta: 'Calculate →',
    },
    {
      icon: HeartPulse,
      title: 'INJURY PREVENTION',
      desc: "Runner's knee, IT band, plantar fasciitis. Cause, treatment, return protocols.",
      action: () => onOpenInjuries(),
      cta: 'Explore →',
    },
    {
      icon: GitCompare,
      title: 'COMPARE METHODS',
      desc: 'Daniels vs Lydiard. Hansons vs Galloway. Find the system that fits your goals.',
      action: () => onOpenCompareMethods(),
      cta: 'Explore →',
    },
    {
      icon: Layers,
      title: 'SHOE COMPARISONS',
      desc: 'Carbon-plate super-shoes vs daily trainers — stack, drop, weight and price, head-to-head.',
      action: () => onOpenShoeComparisons(),
      cta: 'Compare →',
    },
    {
      icon: Watch,
      title: 'WATCH COMPARISONS',
      desc: 'GPS running watches compared on battery life, accuracy, training metrics and value.',
      action: () => onOpenWatchComparisons(),
      cta: 'Compare →',
    },
  ];

  return (
    <section id="go-deeper" className="py-24 px-8 md:px-20 border-t border-border bg-carbon">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-3">
            Go Deeper
          </div>
          <h2
            className="italic-heavy leading-[0.88] tracking-tighter"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
          >
            GO<br />
            <span className="text-faint">DEEPER.</span>
          </h2>
          <p className="text-muted text-base font-light mt-4 max-w-md">
            Everything you need between the start line and the finish.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={card.action}
                className="cursor-pointer bg-surface border border-border p-6 group hover:border-strava/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <Icon className="w-7 h-7 text-strava mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="italic-heavy text-base mb-2 group-hover:text-strava transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-muted text-xs leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-5 text-[9px] font-space text-strava/70 uppercase tracking-widest group-hover:text-strava flex items-center gap-1 transition-colors">
                  {card.cta}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
