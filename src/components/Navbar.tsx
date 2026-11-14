import React, { useState } from 'react';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenGenerator: (mode?: 'standard' | 'couch') => void;
  onOpenCalculators: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGenerator, onOpenCalculators }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    const root = document.documentElement;
    if (nextTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-carbon/90 backdrop-blur-md h-16 border-b border-border flex items-center justify-between px-6">
      {/* Brand */}
      <a href="#" className="flex items-center gap-4 cursor-pointer">
        <div className="italic-heavy text-2xl tracking-widest leading-none">
          <span className="text-fg">STRI</span>
          <span className="text-strava">DD</span>
        </div>
      </a>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <button
          onClick={() => onOpenGenerator('standard')}
          className="text-xs font-space tracking-[0.3em] font-bold text-strava/90 hover:text-strava transition-colors"
        >
          BUILD MY PLAN
        </button>

        <button
          onClick={() => onOpenGenerator('couch')}
          className="text-xs font-space tracking-[0.3em] font-bold text-muted hover:text-fg transition-colors"
        >
          COUCH TO 5K
        </button>

        <button
          onClick={onOpenCalculators}
          className="text-xs font-space tracking-[0.3em] font-bold text-muted hover:text-fg transition-colors"
        >
          CALCULATORS
        </button>

        {/* Explore Mega Menu */}
        <div
          className="relative group"
          onMouseEnter={() => setExploreOpen(true)}
          onMouseLeave={() => setExploreOpen(false)}
        >
          <button className="text-xs font-space tracking-[0.3em] font-bold flex items-center gap-1 text-muted hover:text-fg transition-colors">
            EXPLORE <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {exploreOpen && (
            <div className="absolute top-full right-0 mt-2 w-[820px] bg-bg border border-border p-6 shadow-2xl z-50 grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Column 1: TRAIN */}
              <div>
                <div className="text-[9px] font-space text-strava tracking-[0.4em] mb-3 pb-2 border-b border-border uppercase">
                  TRAIN
                </div>
                <div className="space-y-3">
                  <a href="#how-it-works" className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">HOW IT WORKS</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">How STRIDD builds your blueprint</div>
                  </a>
                  <a href="#training-science" className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">METHODOLOGIES</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">10 elite training systems explained</div>
                  </a>
                  <a href="#four-levers" className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">FOUR LEVERS</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Consistency, Periodisation, Specificity</div>
                  </a>
                </div>
              </div>

              {/* Column 2: TOOLS */}
              <div>
                <div className="text-[9px] font-space text-strava tracking-[0.4em] mb-3 pb-2 border-b border-border uppercase">
                  TOOLS
                </div>
                <div className="space-y-3">
                  <button onClick={onOpenCalculators} className="text-left block w-full text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">CALCULATORS</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Race predictor, pace converter, VDOT</div>
                  </button>
                  <a href="#go-deeper" className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">FUEL COMPARE</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Gels, electrolytes, carbs side-by-side</div>
                  </a>
                  <a href="#go-deeper" className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">EXERCISES</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Strength, mobility, running drills</div>
                  </a>
                </div>
              </div>

              {/* Column 3: LIBRARY */}
              <div>
                <div className="text-[9px] font-space text-strava tracking-[0.4em] mb-3 pb-2 border-b border-border uppercase">
                  LIBRARY
                </div>
                <div className="space-y-3">
                  <a href="#running-lab" className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">RUNNING LAB</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">490+ shoe, gear &amp; biomechanics guides</div>
                  </a>
                  <a href="#go-deeper" className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">INJURIES</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Prevention &amp; recovery protocols</div>
                  </a>
                  <a href="#testimonials" className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">FROM THE FIELD</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Real athlete race breakdowns</div>
                  </a>
                </div>
              </div>

              {/* Column 4: COMMUNITY */}
              <div>
                <div className="text-[9px] font-space text-strava tracking-[0.4em] mb-3 pb-2 border-b border-border uppercase">
                  COMMUNITY
                </div>
                <div className="space-y-3">
                  <a href="#run-club" className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">RUN CLUB</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Weekly runs &amp; Strava pack</div>
                  </a>
                  <a href="#faq" className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">COMMON QUESTIONS</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">100% free, exportable, science-backed</div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme switcher */}
        <div className="flex items-center gap-4 pl-6 border-l border-border">
          <button
            type="button"
            onClick={toggleTheme}
            title={`Current theme: ${theme} (click to toggle)`}
            className="p-1.5 text-strava hover:text-fg transition-colors rounded-sm"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 text-strava hover:text-fg transition-colors"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-muted hover:text-fg transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-carbon border-b border-border p-6 flex flex-col gap-4 shadow-2xl z-50">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenGenerator('standard');
            }}
            className="bg-strava text-on-brand italic-heavy py-3 px-6 text-center text-sm font-bold"
          >
            BUILD MY PLAN
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenGenerator('couch');
            }}
            className="border border-strava/40 text-strava italic-heavy py-3 px-6 text-center text-sm font-bold"
          >
            COUCH TO 5K
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCalculators();
            }}
            className="border border-border text-muted italic-heavy py-3 px-6 text-center text-sm font-bold hover:text-fg"
          >
            RUNNING CALCULATORS
          </button>
          <div className="pt-4 border-t border-border flex flex-col gap-2 text-xs font-space tracking-widest text-muted">
            <a href="#training-science" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-strava">METHODOLOGIES</a>
            <a href="#four-levers" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-strava">THE FOUR LEVERS</a>
            <a href="#run-club" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-strava">STRIDD RUN CLUB</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-strava">FAQ</a>
          </div>
        </div>
      )}
    </nav>
  );
};
