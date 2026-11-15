import React, { useState } from 'react';
import { X, Dumbbell, Search } from 'lucide-react';

interface ExercisesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Category = 'All' | 'Strength' | 'Mobility' | 'Drills' | 'Core';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface Exercise {
  name: string;
  category: Category;
  muscles: string;
  sets: string;
  difficulty: Difficulty;
  why?: string;
}

const EXERCISES: Exercise[] = [
  // Strength
  { name: 'Single-Leg Deadlift', category: 'Strength', muscles: 'Glutes, Hamstrings', sets: '3×8 each leg', difficulty: 'Intermediate', why: 'Prevents IT band & hip issues. Mimics single-leg stance in running.' },
  { name: 'Bulgarian Split Squat', category: 'Strength', muscles: 'Quads, Glutes', sets: '3×10 each leg', difficulty: 'Intermediate', why: 'Race-specific leg strength for uphills and acceleration.' },
  { name: 'Calf Raises (Eccentric)', category: 'Strength', muscles: 'Calves, Achilles', sets: '3×15 (slow lower)', difficulty: 'Beginner', why: 'Primary Achilles tendinopathy prevention. The Alfredson protocol.' },
  { name: 'Hip Thrust', category: 'Strength', muscles: 'Glutes', sets: '3×12', difficulty: 'Beginner', why: 'Glute activation directly transfers to faster cadence and push-off power.' },
  { name: 'Lateral Band Walk', category: 'Strength', muscles: 'Hip Abductors', sets: '2×20 steps each way', difficulty: 'Beginner', why: "Prevents runner's knee by improving hip abductor strength and stability." },
  { name: 'Nordic Curl', category: 'Strength', muscles: 'Hamstrings', sets: '3×6', difficulty: 'Advanced', why: 'Gold standard for hamstring injury resilience. High eccentric load.' },
  { name: 'Step-Up with Knee Drive', category: 'Strength', muscles: 'Quads, Glutes', sets: '3×10 each leg', difficulty: 'Beginner', why: 'Simulates stair-climbing mechanics. Great marathon-specific prep.' },
  // Mobility
  { name: '90/90 Hip Stretch', category: 'Mobility', muscles: 'Hip Flexors, External Rotators', sets: 'Hold 60s each side', difficulty: 'Beginner' },
  { name: "World's Greatest Stretch", category: 'Mobility', muscles: 'Hip, Thoracic Spine, Hamstrings', sets: '5 reps each side', difficulty: 'Beginner' },
  { name: 'Couch Stretch', category: 'Mobility', muscles: 'Hip Flexors, Quads', sets: 'Hold 2 min each side', difficulty: 'Beginner' },
  { name: 'Downward Dog to Low Lunge', category: 'Mobility', muscles: 'Full Posterior Chain', sets: '8 reps flow', difficulty: 'Beginner' },
  { name: 'Ankle CARs', category: 'Mobility', muscles: 'Ankles', sets: '10 circles each direction', difficulty: 'Beginner' },
  // Drills
  { name: 'High Knees', category: 'Drills', muscles: 'Hip Flexors, Cadence', sets: '2×20m', difficulty: 'Beginner' },
  { name: 'A-Skip', category: 'Drills', muscles: 'Form & Coordination', sets: '2×20m', difficulty: 'Beginner' },
  { name: 'Bounding', category: 'Drills', muscles: 'Power, Stride Length', sets: '2×30m', difficulty: 'Intermediate' },
  { name: 'Butt Kicks', category: 'Drills', muscles: 'Hamstrings, Cadence', sets: '2×20m', difficulty: 'Beginner' },
  // Core
  { name: 'Dead Bug', category: 'Core', muscles: 'Deep Core Stability', sets: '3×8 each side', difficulty: 'Beginner', why: 'Prevents lower back pain by training anti-extension core stability.' },
  { name: 'Pallof Press', category: 'Core', muscles: 'Anti-Rotation Core', sets: '3×10 each side', difficulty: 'Intermediate', why: 'Trains the core to resist rotation — critical for efficient running form.' },
  { name: 'Copenhagen Plank', category: 'Core', muscles: 'Adductors, Core', sets: '3×20s each side', difficulty: 'Advanced', why: 'Highest-load adductor exercise. Prevents groin strains in runners.' },
  { name: 'Single-Leg Glute Bridge', category: 'Core', muscles: 'Glutes, Posterior Chain', sets: '3×12 each side', difficulty: 'Beginner', why: 'Entry-level posterior chain activation. Good pre-run warm-up.' },
];

const CATEGORIES: Category[] = ['All', 'Strength', 'Mobility', 'Drills', 'Core'];

const difficultyBadge: Record<Difficulty, string> = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const categoryBadge: Partial<Record<Category, string>> = {
  Strength: 'bg-strava/10 text-strava border-strava/20',
  Mobility: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Drills: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Core: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export const ExercisesModal: React.FC<ExercisesModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = EXERCISES.filter((ex) => {
    const matchCat = category === 'All' || ex.category === category;
    const matchSearch = search === '' ||
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.muscles.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-w-6xl mx-auto my-8 bg-carbon border border-border p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-5 border-b border-border">
          <div>
            <div className="text-[10px] font-space text-strava tracking-[0.4em] uppercase mb-1 font-bold flex items-center gap-2">
              <Dumbbell className="w-3.5 h-3.5" /> Runner Strength & Mobility
            </div>
            <h2 className="italic-heavy text-3xl md:text-4xl text-fg">
              EXERCISE <span className="text-strava">LIBRARY</span>
            </h2>
            <p className="text-muted text-sm font-light mt-1 font-space">
              20 runner-specific exercises. Filter by category, search by muscle group.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-fg hover:bg-surface border border-border transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none" />
            <input
              type="text"
              placeholder="Search exercises or muscles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border pl-9 pr-4 py-2.5 text-sm text-fg font-space placeholder:text-faint focus:outline-none focus:border-strava/50 transition-colors"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 text-xs font-space uppercase tracking-widest font-bold border transition-all ${
                  category === cat
                    ? 'bg-strava text-on-brand border-strava'
                    : 'border-border text-muted hover:border-strava hover:text-strava'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="text-[10px] font-space text-faint uppercase tracking-widest mb-4">
          Showing {filtered.length} of {EXERCISES.length} exercises
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ex, i) => (
            <div
              key={i}
              className="bg-surface border border-border p-5 hover:border-strava/40 transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="italic-heavy text-base text-fg group-hover:text-strava transition-colors leading-snug">
                  {ex.name}
                </h3>
                <span className={`text-[9px] font-space uppercase tracking-wider px-2 py-0.5 border font-bold flex-shrink-0 ${categoryBadge[ex.category] || ''}`}>
                  {ex.category}
                </span>
              </div>

              <div className="text-xs text-muted font-space mb-3">{ex.muscles}</div>

              <div className="text-xs text-strava font-bold font-space mb-3">{ex.sets}</div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                <span className={`text-[9px] font-space uppercase tracking-widest px-2 py-0.5 border font-bold ${difficultyBadge[ex.difficulty]}`}>
                  {ex.difficulty}
                </span>
              </div>

              {ex.why && (
                <p className="text-xs text-faint font-light mt-3 italic leading-snug border-t border-border/40 pt-3">
                  {ex.why}
                </p>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted font-space text-sm">
            No exercises found for <strong className="text-fg">"{search}"</strong>. Try a different search term.
          </div>
        )}

        <div className="mt-8 p-4 bg-strava/5 border border-strava/20 text-center">
          <p className="text-xs text-faint font-space">
            <strong className="text-strava">Pro tip:</strong> Combine 2–3 strength exercises with 2–3 mobility drills into a 25-minute session. 2× per week is the minimum effective dose for injury prevention.
          </p>
        </div>
      </div>
    </div>
  );
};
