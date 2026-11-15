import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is PYROFIT really free to use?',
      a: 'Yes — PYROFIT is free to use. You can build a full plan in your browser without signing in, or create a free account to save and sync your plan, log your training, and connect your watch. See our Privacy Policy for what we store.',
    },
    {
      q: 'What do I get with a free PYROFIT account?',
      a: 'Building a plan needs no account. Sign in (free) to save and sync your plan across devices, log every session, connect your watch (direct Garmin, Suunto, COROS, and Intervals.icu), see your training analytics, and link up with a mentor for mentoring. Your data stays yours and is exportable any time.',
    },
    {
      q: 'Can I track my training and log my runs in PYROFIT?',
      a: 'Yes. With a free account, PYROFIT doubles as your training log — mark sessions complete, record distance, time and effort, and connect your watch so recent runs import automatically. Your athlete dashboard then shows weekly load, fitness trend, readiness, and how your pace zones are progressing.',
    },
    {
      q: 'Can I get a mentor or mentor on PYROFIT?',
      a: 'Yes. Once you have an account you can connect with a mentor. Your mentor sees your plan and recent training, proposes adjustments you approve, sends individual workouts, and can group you into a squad. You stay in control — nothing in your plan changes without your sign-off.',
    },
    {
      q: 'Which training methodology should I pick?',
      a: 'It depends on your experience and goal. Daniels VDOT suits most recreational runners targeting 5K–marathon. Norwegian Double Threshold works for intermediate runners wanting a polarised block. Lydiard is ideal if you are building a base for a marathon or ultra. Read the methodologies section for detailed comparisons.',
    },
    {
      q: 'How are my paces calculated?',
      a: "PYROFIT uses the Jack Daniels VDOT tables cross-checked with Riegel's race-prediction formula. You give us a recent race time — we compute VDOT, derive every training zone from it, and adjust the target zones across Base / Build / Peak / Taper phases.",
    },
    {
      q: 'Can I use PYROFIT for an ultramarathon?',
      a: 'Yes. PYROFIT supports 5K, 10K, half-marathon, marathon, 50K and 100K+ distances. Ultra plans emphasise time-on-feet, back-to-back long runs and strength-endurance work instead of pure pace work.',
    },
    {
      q: 'Does PYROFIT account for injury or illness?',
      a: 'The plan is a blueprint, not a prescription. If you are ill, injured or over-fatigued, skip the session or swap it for recovery. The plan is designed to tolerate a 10–15% deviation per week without losing fitness.',
    },
    {
      q: 'Can I export my plan to Garmin, Suunto, COROS, or Apple Health?',
      a: 'You can download your plan as a clean CSV spreadsheet or formatted printable PDF. Direct sync pushes structured interval steps directly to your GPS watch device.',
    },
    {
      q: 'How often should I regenerate my plan?',
      a: 'Every 4–6 weeks, or after a race, or whenever your fitness changes significantly. Re-enter your latest time trial or race result and PYROFIT will rebuild your zones.',
    },
    {
      q: 'What if I miss a workout?',
      a: "Don't redistribute missed volume. Continue the plan from the next scheduled session. The Architect is built to tolerate small gaps — what matters is consistency across weeks, not any single session.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-8 md:px-20 border-t border-border bg-carbon">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-4">
            Common questions
          </div>
          <h2
            className="italic-heavy leading-[0.88] tracking-tighter"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
          >
            KNOW<br />
            <span className="text-faint">BEFORE YOU RUN.</span>
          </h2>
        </div>

        <div className="space-y-px bg-surface-top border border-border">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-carbon transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 md:px-8 py-6 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="italic-heavy text-sm text-faint w-10 flex-shrink-0 pt-1">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h3 className="italic-heavy text-lg md:text-xl text-fg leading-tight pr-4">
                      {faq.q}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-faint transition-transform duration-300 flex-shrink-0 mt-1 ${
                      isOpen ? 'rotate-180 text-strava' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 md:px-8 pb-8 pl-16 md:pl-[72px] text-muted text-sm md:text-base leading-relaxed font-light animate-in fade-in duration-200">
                    <p className="max-w-3xl">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
