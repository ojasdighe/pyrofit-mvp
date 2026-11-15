import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface FooterProps {
  onOpenGenerator: () => void;
  onOpenCalculators: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGenerator, onOpenCalculators }) => {
  return (
    <footer className="border-t border-border mt-20">
      {/* Ready Banner */}
      <section
        className="py-28 px-8 md:px-20 border-b border-border text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,26,0.04) 0%, transparent 60%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-4">
            Ready?
          </div>
          <h2
            className="italic-heavy leading-[0.85] tracking-tighter mb-8"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
          >
            YOUR PLAN.<br />
            <span className="text-faint">YOUR PACE.</span>
          </h2>
          <button
            onClick={onOpenGenerator}
            className="group relative bg-strava italic-heavy text-on-brand py-5 px-16 text-xl overflow-hidden transition-all inline-flex items-center gap-2 shadow-[0_20px_60px_rgba(255,107,26,0.25)] hover:shadow-[0_24px_70px_rgba(255,107,26,0.45)]"
          >
            <span className="relative z-10 font-black">BUILD MY PLAN</span>
            <ArrowRight className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
          </button>
        </div>
      </section>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-12">
          <div className="max-w-md">
            <div className="italic-heavy text-3xl mb-1">
              <span className="text-fg">PYRO</span><span className="text-strava">FIT</span>
            </div>
            <div className="text-[11px] font-space tracking-widest text-faint uppercase mb-3">
              Precision Fueling · Smart Training · Race Ready
            </div>
            <p className="text-muted text-[13px] font-space leading-relaxed mb-6">
              Precision running training plans built on 10 elite methodologies. Free to use — build in your browser, or sign in to track your training, sync your watch, and get mentored.
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://instagram.com/pyrofit.run"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-faint hover:text-strava transition-colors group"
              >
                <svg className="w-4 h-4 fill-current text-strava" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span className="text-[11px] font-space uppercase tracking-widest group-hover:text-strava">
                  @pyrofit.run
                </span>
              </a>
              <a
                href="mailto:hello@pyrofit.run"
                className="inline-flex items-center gap-2 text-faint hover:text-strava transition-colors group"
              >
                <Mail className="w-4 h-4 text-strava" />
                <span className="text-[11px] font-space uppercase tracking-widest group-hover:text-strava">
                  hello@pyrofit.run
                </span>
              </a>
              <a
                href="https://www.strava.com/clubs/2068012"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-faint hover:text-strava transition-colors group"
              >
                <span className="text-xs font-bold text-strava">STR</span>
                <span className="text-[11px] font-space uppercase tracking-widest group-hover:text-strava">
                  Join Run Club
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 pb-10 border-b border-border">
          <div>
            <div className="text-strava font-space text-[10px] tracking-[0.4em] uppercase mb-4 font-bold">
              Plan
            </div>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={onOpenGenerator}
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Build my plan
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGenerator}
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Sample plans
                </button>
              </li>
              <li>
                <a
                  href="#training-science"
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Methodologies
                </a>
              </li>
              <li>
                <a
                  href="#four-levers"
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Run types
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenCalculators}
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Calculators
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-strava font-space text-[10px] tracking-[0.4em] uppercase mb-4 font-bold">
              Fuel &amp; Recovery
            </div>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#go-deeper"
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Nutrition
                </a>
              </li>
              <li>
                <a
                  href="#go-deeper"
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Fuel compare
                </a>
              </li>
              <li>
                <a
                  href="#go-deeper"
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Injuries
                </a>
              </li>
              <li>
                <a
                  href="#running-lab"
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Tips &amp; Science
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-strava font-space text-[10px] tracking-[0.4em] uppercase mb-4 font-bold">
              Race &amp; Travel
            </div>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#go-deeper"
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#go-deeper"
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  Marathon travel
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="font-space text-xs uppercase tracking-[0.2em] text-muted hover:text-strava transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-8 text-[10px] font-space uppercase tracking-[0.3em]">
          <a href="#how-it-works" className="text-faint hover:text-strava transition-colors">How it works</a>
          <a href="#four-levers" className="text-faint hover:text-strava transition-colors">Four Levers</a>
          <a href="#testimonials" className="text-faint hover:text-strava transition-colors">Athlete Stories</a>
          <a href="#faq" className="text-faint hover:text-strava transition-colors">FAQ</a>
          <a href="#" className="text-faint hover:text-strava transition-colors">Privacy</a>
          <a href="#" className="text-faint hover:text-strava transition-colors">Terms</a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between gap-3 text-[10px] font-space text-faint">
          <div>© 2026 PYROFIT · Precision Fueling · Smart Training</div>
          <div>Not medical advice · Consult a doctor before beginning a new training program</div>
        </div>
      </div>
    </footer>
  );
};
