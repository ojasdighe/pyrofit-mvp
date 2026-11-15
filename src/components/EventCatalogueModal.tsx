import React, { useState } from 'react';
import { X, Flag, Calendar, MapPin, Star } from 'lucide-react';

interface EventCatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Event = {
  name: string;
  location: string;
  country: string;
  month: string;
  distance: string;
  category: 'India' | 'World Major' | 'Ultra' | 'Regional';
  difficulty: 'Moderate' | 'Hard' | 'Very Hard' | 'Extreme';
  bqQualifier: boolean;
  notes: string;
};

const events: Event[] = [
  { name: 'Boston Marathon', location: 'Boston, MA', country: '🇺🇸', month: 'April', distance: 'Marathon', category: 'World Major', difficulty: 'Hard', bqQualifier: true, notes: 'BQ qualifying standard required for entry' },
  { name: 'Berlin Marathon', location: 'Berlin', country: '🇩🇪', month: 'September', distance: 'Marathon', category: 'World Major', difficulty: 'Moderate', bqQualifier: true, notes: 'Fastest course globally. Ballot + charity entries' },
  { name: 'London Marathon', location: 'London', country: '🇬🇧', month: 'April', distance: 'Marathon', category: 'World Major', difficulty: 'Moderate', bqQualifier: true, notes: 'Charity guaranteed entry. Very popular ballot' },
  { name: 'Tokyo Marathon', location: 'Tokyo', country: '🇯🇵', month: 'March', distance: 'Marathon', category: 'World Major', difficulty: 'Moderate', bqQualifier: true, notes: 'Most oversubscribed ballot. Tour packages available' },
  { name: 'Chicago Marathon', location: 'Chicago, IL', country: '🇺🇸', month: 'October', distance: 'Marathon', category: 'World Major', difficulty: 'Moderate', bqQualifier: true, notes: 'Flat course. Good BQ attempt for intermediates' },
  { name: 'NYC Marathon', location: 'New York City', country: '🇺🇸', month: 'November', distance: 'Marathon', category: 'World Major', difficulty: 'Hard', bqQualifier: true, notes: 'Rolling hills. 9-time rejection guarantees entry' },
  { name: 'Tata Mumbai Marathon', location: 'Mumbai', country: '🇮🇳', month: 'January', distance: 'Marathon', category: 'India', difficulty: 'Moderate', bqQualifier: false, notes: "India's biggest. Sea Link route. Hot & humid" },
  { name: 'Airtel Delhi Half Marathon', location: 'New Delhi', country: '🇮🇳', month: 'October', distance: 'Half Marathon', category: 'India', difficulty: 'Moderate', bqQualifier: false, notes: 'Elite field. Iconic Nehru Place loop' },
  { name: 'Bengaluru Marathon', location: 'Bengaluru', country: '🇮🇳', month: 'October', distance: 'Marathon', category: 'India', difficulty: 'Moderate', bqQualifier: false, notes: 'Pleasant weather. Well-organised mass event' },
  { name: 'Goa River Marathon', location: 'Goa', country: '🇮🇳', month: 'December', distance: 'Marathon', category: 'India', difficulty: 'Moderate', bqQualifier: false, notes: 'Riverside trail. Cool December weather' },
  { name: 'AHM Pune Half Marathon', location: 'Pune', country: '🇮🇳', month: 'January', distance: 'Half Marathon', category: 'India', difficulty: 'Moderate', bqQualifier: false, notes: 'Growing field. Flat urban course' },
  { name: 'Ladakh Marathon', location: 'Leh, Ladakh', country: '🇮🇳', month: 'September', distance: 'Marathon', category: 'India', difficulty: 'Extreme', bqQualifier: false, notes: '3,500m altitude. Acclimatise 5+ days. Bucket list' },
  { name: 'Khardung La Challenge', location: 'Khardung La, Ladakh', country: '🇮🇳', month: 'August', distance: '72 km Ultra', category: 'Ultra', difficulty: 'Extreme', bqQualifier: false, notes: "5,359m peak. World's highest ultra. DNF rate >60%" },
  { name: 'UTMB Mont-Blanc', location: 'Chamonix', country: '🇫🇷', month: 'August', distance: '170 km Ultra', category: 'Ultra', difficulty: 'Extreme', bqQualifier: false, notes: 'ITRA points needed. 10,000m D+. The pinnacle' },
  { name: 'Comrades Marathon', location: 'KwaZulu-Natal', country: '🇿🇦', month: 'June', distance: '90 km Ultra', category: 'Ultra', difficulty: 'Very Hard', bqQualifier: false, notes: 'Up/Down alternates yearly. Sub-12h cutoff' },
  { name: 'Hyderabad 10K', location: 'Hyderabad', country: '🇮🇳', month: 'August', distance: '10K', category: 'India', difficulty: 'Moderate', bqQualifier: false, notes: 'Fast urban race. Good debut event for beginners' },
  { name: 'Kolkata 25K', location: 'Kolkata', country: '🇮🇳', month: 'December', distance: '25K', category: 'India', difficulty: 'Moderate', bqQualifier: false, notes: 'Heritage route through old Kolkata. Cool weather' },
  { name: 'Chennai Marathon', location: 'Chennai', country: '🇮🇳', month: 'January', distance: 'Marathon', category: 'India', difficulty: 'Hard', bqQualifier: false, notes: 'Hot & humid. Electrolyte strategy critical' },
];

const difficultyColor: Record<string, string> = {
  Moderate: 'text-green-400 border-green-400/30 bg-green-400/10',
  Hard: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  'Very Hard': 'text-red-400 border-red-400/30 bg-red-400/10',
  Extreme: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
};

export const EventCatalogueModal: React.FC<EventCatalogueModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'All' | Event['category']>('All');
  const filters: Array<'All' | Event['category']> = ['All', 'India', 'World Major', 'Ultra', 'Regional'];

  if (!isOpen) return null;

  const visible = filter === 'All' ? events : events.filter(e => e.category === filter);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="max-w-6xl mx-auto my-8 bg-carbon border border-border p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-strava font-space text-[9px] tracking-[0.5em] uppercase mb-1">
              Pyrofit · Event Catalogue
            </div>
            <h2 className="italic-heavy text-3xl md:text-4xl text-fg">
              EVENT <span className="text-strava">CATALOGUE</span>
            </h2>
            <p className="text-muted text-sm mt-2 font-light">
              {events.length} races — World Majors, Indian headline events, ultras. Course intel, entry notes, difficulty ratings.
            </p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-fg transition-colors mt-1" aria-label="Close">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-space uppercase tracking-widest transition-colors ${
                filter === f
                  ? 'bg-strava text-on-brand'
                  : 'border border-border text-muted hover:border-strava/50 hover:text-fg'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="text-[11px] font-space text-strava/90 mb-3 flex items-center gap-1 sm:hidden">
          ↔ Swipe horizontally to view full race course intel
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px] sm:min-w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal sticky left-0 bg-carbon z-20 shadow-[1px_0_0_0_#262626]">Event</th>
                <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal hidden sm:table-cell">Location</th>
                <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal hidden md:table-cell">Month</th>
                <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal">Distance</th>
                <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal hidden lg:table-cell">Difficulty</th>
                <th className="pb-3 pr-4 text-[10px] font-space uppercase tracking-widest text-faint font-normal hidden lg:table-cell">BQ?</th>
                <th className="pb-3 text-[10px] font-space uppercase tracking-widest text-faint font-normal hidden xl:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((ev, i) => (
                <tr key={i} className="border-b border-border/40 hover:bg-surface/50 transition-colors">
                  <td className="py-3 pr-4 sticky left-0 bg-carbon z-10 shadow-[1px_0_0_0_#262626]">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{ev.country}</span>
                      <div>
                        <div className="font-medium text-fg text-sm leading-snug">{ev.name}</div>
                        <div className="text-faint text-[10px] font-space sm:hidden">{ev.location} · {ev.month}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted text-xs hidden sm:table-cell">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-faint" />
                      {ev.location}
                    </div>
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-muted text-xs">
                      <Calendar className="w-3 h-3 text-faint" />
                      {ev.month}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[10px] font-space uppercase tracking-wider text-strava border border-strava/30 bg-strava/10 px-2 py-0.5">
                      {ev.distance}
                    </span>
                  </td>
                  <td className="py-3 pr-4 hidden lg:table-cell">
                    <span className={`text-[10px] font-space uppercase tracking-wider border px-2 py-0.5 ${difficultyColor[ev.difficulty]}`}>
                      {ev.difficulty}
                    </span>
                  </td>
                  <td className="py-3 pr-4 hidden lg:table-cell">
                    {ev.bqQualifier
                      ? <Star className="w-4 h-4 text-strava fill-strava" />
                      : <span className="text-faint text-xs">—</span>
                    }
                  </td>
                  <td className="py-3 text-muted text-xs font-light leading-relaxed hidden xl:table-cell max-w-[200px]">
                    {ev.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-4 text-[10px] font-space text-faint">
          <div className="flex items-center gap-1.5"><Star className="w-3 h-3 text-strava fill-strava" /> BQ Qualifier (Boston Qualifying standard race)</div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">■</span> Extreme altitude/distance
            <span className="text-red-400">■</span> Very Hard
            <span className="text-orange-400">■</span> Hard
            <span className="text-green-400">■</span> Moderate
          </div>
        </div>
      </div>
    </div>
  );
};
