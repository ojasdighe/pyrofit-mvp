/**
 * PYROFIT MVP — Global Navigation Bar
 * Author: Ojas Ulhas Dighe
 * Date: 2026-11-15
 * Description: Primary header with 4-pillar tabs, explore mega-menu, dark/light theme toggle,
 *              responsive mobile menu, and Blueprint Generator CTA.
 */

import React, { useState } from 'react';
import { Sun, Moon, Menu, X, ChevronDown, Flame, Compass, Dumbbell, HeartPulse, Flag } from 'lucide-react';

export type NavTab = 'plans' | 'fuel' | 'lab' | 'profile';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenGenerator: (mode?: 'standard' | 'couch') => void;
  onOpenCalculators: () => void;
  onOpenFuelSchemes?: () => void;
  onOpenInjuries?: () => void;
  onOpenExercises?: () => void;
  onOpenComparePlans?: (initialTab?: 'methodologies' | 'shoes' | 'watches') => void;
  onOpenEventCatalogue?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenGenerator,
  onOpenCalculators,
  onOpenFuelSchemes,
  onOpenInjuries,
  onOpenExercises,
  onOpenComparePlans,
  onOpenEventCatalogue,
}) => {
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
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-carbon/95 backdrop-blur-md h-16 border-b border-strava/20 flex items-center justify-between px-4 sm:px-6">
      {/* Brand */}
      <a
        href="#plans"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('plans');
        }}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="italic-heavy text-2xl sm:text-3xl tracking-widest leading-none">
          <span className="text-fg group-hover:text-white transition-colors">PYRO</span>
          <span className="text-strava">FIT</span>
        </div>
      </a>

      {/* Desktop Primary Navigation */}
      <div className="hidden lg:flex items-center gap-6">
        <button
          onClick={() => onSelectTab('plans')}
          className={`text-xs font-space tracking-[0.2em] font-bold py-1.5 transition-all ${
            currentTab === 'plans'
              ? 'text-strava border-b-2 border-strava'
              : 'text-muted hover:text-fg'
          }`}
        >
          TRAINING PLANS
        </button>

        <button
          onClick={() => onSelectTab('fuel')}
          className={`text-xs font-space tracking-[0.2em] font-bold py-1.5 transition-all flex items-center gap-1.5 ${
            currentTab === 'fuel'
              ? 'text-strava border-b-2 border-strava'
              : 'text-muted hover:text-fg'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-strava animate-pulse"></span>
          FUEL ENGINE
        </button>

        <button
          onClick={() => onSelectTab('lab')}
          className={`text-xs font-space tracking-[0.2em] font-bold py-1.5 transition-all ${
            currentTab === 'lab'
              ? 'text-strava border-b-2 border-strava'
              : 'text-muted hover:text-fg'
          }`}
        >
          GEAR &amp; LAB
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          className={`text-xs font-space tracking-[0.2em] font-bold py-1.5 transition-all ${
            currentTab === 'profile'
              ? 'text-strava border-b-2 border-strava'
              : 'text-muted hover:text-fg'
          }`}
        >
          ATHLETE PROFILE
        </button>

        <button
          onClick={onOpenCalculators}
          className="text-xs font-space tracking-[0.2em] font-bold text-muted hover:text-fg transition-colors"
        >
          CALCULATORS
        </button>

        {/* Explore Mega Menu */}
        <div
          className="relative"
          onMouseEnter={() => setExploreOpen(true)}
          onMouseLeave={() => setExploreOpen(false)}
        >
          <button className="text-xs font-space tracking-[0.2em] font-bold flex items-center gap-1 text-muted hover:text-fg transition-colors py-1.5">
            EXPLORE <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {exploreOpen && (
            <div className="absolute top-full right-0 mt-2 w-[760px] bg-bg border border-border p-6 shadow-2xl z-50 grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Column 1: TRAIN */}
              <div>
                <div className="text-[9px] font-space text-strava tracking-[0.4em] mb-3 pb-2 border-b border-border uppercase">
                  TRAIN
                </div>
                <div className="space-y-3">
                  <a href="#training-science" onClick={() => onSelectTab('plans')} className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">10 METHODOLOGIES</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Norwegian, VDOT, Lydiard, Hansons</div>
                  </a>
                  <a href="#four-levers" onClick={() => onSelectTab('plans')} className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">FOUR LEVERS</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Consistency, Periodisation, Specificity</div>
                  </a>
                  <button onClick={() => onOpenGenerator('couch')} className="text-left block w-full text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">COUCH TO 5K</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">8-week run-walk ramp for beginners</div>
                  </button>
                </div>
              </div>

              {/* Column 2: TOOLS & FUEL */}
              <div>
                <div className="text-[9px] font-space text-strava tracking-[0.4em] mb-3 pb-2 border-b border-border uppercase">
                  TOOLS &amp; FUEL
                </div>
                <div className="space-y-3">
                  <button onClick={onOpenCalculators} className="text-left block w-full text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">ZONE CALCULATORS</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Jack Daniels VDOT &amp; Riegel prediction</div>
                  </button>
                  <button onClick={() => onOpenFuelSchemes?.()} className="text-left block w-full text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">FUEL SCHEMES</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Pre, during, post &amp; India fuel guides</div>
                  </button>
                  <button onClick={() => onSelectTab('fuel')} className="text-left block w-full text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">FUEL STRATEGY ENGINE</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Carbs, sodium &amp; fluids per hour</div>
                  </button>
                </div>
              </div>

              {/* Column 3: GEAR & LAB */}
              <div>
                <div className="text-[9px] font-space text-strava tracking-[0.4em] mb-3 pb-2 border-b border-border uppercase">
                  GEAR &amp; COMPARISONS
                </div>
                <div className="space-y-3">
                  <button onClick={() => onOpenComparePlans?.('shoes')} className="text-left block w-full text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">CARBON SHOES</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Vaporfly, Alphafly, Adios Pro specs</div>
                  </button>
                  <button onClick={() => onOpenComparePlans?.('watches')} className="text-left block w-full text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">GPS WATCHES</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Garmin, COROS, Suunto, Polar</div>
                  </button>
                  <button onClick={() => onOpenEventCatalogue?.()} className="text-left block w-full text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">RACE CATALOGUE</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">World Majors, India events, Ultras</div>
                  </button>
                </div>
              </div>

              {/* Column 4: HEALTH & COMMUNITY */}
              <div>
                <div className="text-[9px] font-space text-strava tracking-[0.4em] mb-3 pb-2 border-b border-border uppercase">
                  HEALTH &amp; CLUB
                </div>
                <div className="space-y-3">
                  <button onClick={() => onOpenInjuries?.()} className="text-left block w-full text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">INJURY PREVENTION</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Protocols, rehab &amp; red flags</div>
                  </button>
                  <button onClick={() => onOpenExercises?.()} className="text-left block w-full text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">EXERCISE LIBRARY</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">20 strength, mobility &amp; drill guides</div>
                  </button>
                  <a href="#run-club" onClick={() => onSelectTab('plans')} className="block text-muted hover:text-fg transition-colors">
                    <div className="text-[11px] font-space tracking-[0.15em] font-bold uppercase">RUN CLUB</div>
                    <div className="text-[10px] text-faint mt-0.5 leading-snug">Weekly runs &amp; Strava pack</div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Blueprint CTA + Theme */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onOpenGenerator('standard')}
          className="hidden sm:inline-flex items-center gap-1.5 bg-strava text-on-brand italic-heavy px-4 py-2 text-xs font-black uppercase tracking-wider hover:bg-white transition-colors shadow-sm"
        >
          <span>BUILD BLUEPRINT</span>
          <span>→</span>
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Theme: ${theme}`}
          className="p-1.5 text-strava hover:text-fg transition-colors rounded-sm border border-border bg-surface"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 text-muted hover:text-fg transition-colors border border-border bg-surface"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 w-full bg-carbon border-b border-border p-5 flex flex-col gap-3 shadow-2xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-border">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('plans');
              }}
              className={`py-2.5 px-3 text-center text-xs font-space font-bold uppercase tracking-wider border transition-colors ${
                currentTab === 'plans' ? 'bg-strava text-on-brand border-strava' : 'border-border text-muted hover:text-fg'
              }`}
            >
              🏃 Plans
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('fuel');
              }}
              className={`py-2.5 px-3 text-center text-xs font-space font-bold uppercase tracking-wider border transition-colors ${
                currentTab === 'fuel' ? 'bg-strava text-on-brand border-strava' : 'border-border text-muted hover:text-fg'
              }`}
            >
              🔥 Fueling
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('lab');
              }}
              className={`py-2.5 px-3 text-center text-xs font-space font-bold uppercase tracking-wider border transition-colors ${
                currentTab === 'lab' ? 'bg-strava text-on-brand border-strava' : 'border-border text-muted hover:text-fg'
              }`}
            >
              ⚙️ Gear &amp; Lab
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('profile');
              }}
              className={`py-2.5 px-3 text-center text-xs font-space font-bold uppercase tracking-wider border transition-colors ${
                currentTab === 'profile' ? 'bg-strava text-on-brand border-strava' : 'border-border text-muted hover:text-fg'
              }`}
            >
              👤 Profile
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenGenerator('standard');
            }}
            className="bg-strava text-on-brand italic-heavy py-3 px-6 text-center text-sm font-bold shadow-md"
          >
            BUILD RUN BLUEPRINT →
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenGenerator('couch');
            }}
            className="border border-strava/40 text-strava italic-heavy py-2.5 px-6 text-center text-xs font-bold"
          >
            COUCH TO 5K PROGRAM
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCalculators();
            }}
            className="border border-border text-muted italic-heavy py-2.5 px-6 text-center text-xs font-bold hover:text-fg"
          >
            RUNNING CALCULATORS (VDOT &amp; RIEGEL)
          </button>

          <div className="pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs font-space tracking-widest text-muted">
            <button onClick={() => { setMobileMenuOpen(false); onOpenComparePlans?.('shoes'); }} className="text-left py-1 hover:text-strava">👟 SHOES</button>
            <button onClick={() => { setMobileMenuOpen(false); onOpenComparePlans?.('watches'); }} className="text-left py-1 hover:text-strava">⌚ WATCHES</button>
            <button onClick={() => { setMobileMenuOpen(false); onOpenFuelSchemes?.(); }} className="text-left py-1 hover:text-strava">🧪 FUEL SCHEMES</button>
            <button onClick={() => { setMobileMenuOpen(false); onOpenExercises?.(); }} className="text-left py-1 hover:text-strava">🏋️ EXERCISES</button>
            <button onClick={() => { setMobileMenuOpen(false); onOpenInjuries?.(); }} className="text-left py-1 hover:text-strava">🩺 INJURIES</button>
            <button onClick={() => { setMobileMenuOpen(false); onOpenEventCatalogue?.(); }} className="text-left py-1 hover:text-strava">🏁 EVENTS</button>
          </div>
        </div>
      )}
    </nav>
  );
};
