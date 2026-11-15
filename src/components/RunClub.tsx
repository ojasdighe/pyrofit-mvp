import React from 'react';
import { Footprints, Megaphone, Users } from 'lucide-react';

export const RunClub: React.FC = () => {
  return (
    <section id="run-club" className="py-24 px-8 md:px-20 border-t border-border bg-carbon">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="flex-1">
            <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-4">
              Run with us
            </div>
            <h2
              className="italic-heavy leading-[0.88] tracking-tighter mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
            >
              JOIN THE<br />
              <span className="text-faint">PACK.</span>
            </h2>
            <p className="text-muted text-base font-light leading-relaxed mb-6 max-w-md">
              The PYROFIT run club is where the plans meet the pavement. Weekly group runs, race-day meetups, and a crew that actually shows up.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-muted text-sm font-light">
                <Footprints className="w-4 h-4 text-strava flex-shrink-0" />
                <span>Weekly runs — show up, keep pace, get better</span>
              </li>
              <li className="flex items-center gap-3 text-muted text-sm font-light">
                <Megaphone className="w-4 h-4 text-strava flex-shrink-0" />
                <span>Stay updated on races, routes, and meetups</span>
              </li>
              <li className="flex items-center gap-3 text-muted text-sm font-light">
                <Users className="w-4 h-4 text-strava flex-shrink-0" />
                <span>Train with runners who take the craft seriously</span>
              </li>
            </ul>

            <a
              href="https://www.strava.com/clubs/2068012"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-[#FC4C02] text-white italic-heavy py-4 px-10 text-sm tracking-wider relative overflow-hidden transition-all shadow-[0_8px_32px_rgba(252,76,2,0.3)] hover:shadow-[0_12px_40px_rgba(252,76,2,0.45)]"
            >
              <svg className="w-5 h-5 fill-current relative z-10" viewBox="0 0 24 24">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              <span className="relative z-10 font-bold">JOIN PYROFIT RUN CLUB</span>
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </a>
          </div>

          <div className="flex-shrink-0 w-full md:w-64 space-y-4">
            <div className="bg-surface border border-border p-6 flex items-center gap-4">
              <div className="italic-heavy text-2xl text-strava">WEEKLY</div>
              <div className="text-[10px] font-space text-faint uppercase tracking-widest">
                Group runs
              </div>
            </div>
            <div className="bg-surface border border-border p-6 flex items-center gap-4">
              <div className="italic-heavy text-2xl text-strava">FREE</div>
              <div className="text-[10px] font-space text-faint uppercase tracking-widest">
                To join
              </div>
            </div>
            <div className="bg-surface border border-border p-6 flex items-center gap-4">
              <div className="italic-heavy text-2xl text-strava">IRL</div>
              <div className="text-[10px] font-space text-faint uppercase tracking-widest">
                Real runs, real people
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
