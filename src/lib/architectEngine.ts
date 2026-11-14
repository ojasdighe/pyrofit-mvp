import {
  DistanceKey,
  FitnessLevelKey,
  FitnessLevelInfo,
  GeneratedPlan,
  MethodologyInfo,
  MethodologyKey,
  PhaseKey,
  PlanInputs,
  PlanWeek,
  WorkoutArchetype,
  WorkoutSegment,
  WorkoutZoneKey,
} from '../types/architect';

export const DIST_KM: Record<DistanceKey, number> = {
  '5k': 5,
  '10k': 10,
  Half: 21.0975,
  '42k': 42.195,
  Ultra: 50,
};

export const PEAK_VOL_BY_DIST: Record<DistanceKey, number> = {
  '5k': 55,
  '10k': 70,
  Half: 85,
  '42k': 100,
  Ultra: 130,
};

export const MIN_START_VOL: Record<DistanceKey, number> = {
  '5k': 15,
  '10k': 20,
  Half: 25,
  '42k': 35,
  Ultra: 50,
};

export const MAX_LONG_RUN: Record<DistanceKey, number> = {
  '5k': 14,
  '10k': 18,
  Half: 24,
  '42k': 34,
  Ultra: 42,
};

export const TAPER_WEEKS: Record<DistanceKey, number> = {
  '5k': 1,
  '10k': 1,
  Half: 2,
  '42k': 3,
  Ultra: 3,
};

export const FITNESS_MULTIPLIERS: Record<FitnessLevelKey, FitnessLevelInfo> = {
  NOVICE: {
    volume: 0.45,
    easyPad: 1.2,
    label: 'Absolute beginner',
    desc: 'First time running or returning from injury',
    paceToleranceSec: 25,
  },
  BEGINNER: {
    volume: 0.7,
    easyPad: 1.08,
    label: 'Beginner',
    desc: 'Running < 6 months or < 20km/week',
    paceToleranceSec: 20,
  },
  INTERMEDIATE: {
    volume: 0.9,
    easyPad: 1.03,
    label: 'Intermediate',
    desc: '1–3 years, 30–60km/week',
    paceToleranceSec: 15,
  },
  ADVANCED: {
    volume: 1,
    easyPad: 1,
    label: 'Advanced',
    desc: '3+ years, 60–100km/week',
    paceToleranceSec: 10,
  },
  ELITE: {
    volume: 1.15,
    easyPad: 0.98,
    label: 'Elite',
    desc: 'Competitive, 100km+/week',
    paceToleranceSec: 5,
  },
};

export const RUN_ARCHETYPES: Record<WorkoutZoneKey, WorkoutArchetype> = {
  EASY: {
    name: 'Easy Run',
    rpe: '3–4',
    color: '#CCFF00',
    colorMuted: 'rgba(204,255,0,0.15)',
    what: 'Aerobic base building.',
    why: 'Grows mitochondria and capillary networks at low cardiac cost.',
  },
  RECOVERY: {
    name: 'Recovery Run',
    rpe: '2–3',
    color: '#5E5E5E',
    colorMuted: 'rgba(94,94,94,0.15)',
    what: 'Active restoration.',
    why: 'Blood flow without structural stress. Non-negotiable after quality days.',
  },
  TEMPO: {
    name: 'Tempo Run',
    rpe: '7–8',
    color: '#FF9800',
    colorMuted: 'rgba(255,152,0,0.15)',
    what: 'Lactate threshold training.',
    why: 'Teaches your body to clear lactate faster at higher speeds.',
  },
  INTERVAL: {
    name: 'Intervals',
    rpe: '9',
    color: '#FF3D3D',
    colorMuted: 'rgba(255,61,61,0.15)',
    what: 'VO₂max expansion.',
    why: 'Raises your aerobic ceiling. Heart stroke volume and fast-twitch recruitment.',
  },
  LONG: {
    name: 'Long Run',
    rpe: '4–5',
    color: '#FFFFFF',
    colorMuted: 'rgba(255,255,255,0.1)',
    what: 'Structural durability.',
    why: 'Connective tissue conditioning and fat oxidation at race conditions.',
  },
  HILL: {
    name: 'Hill Repeats',
    rpe: '8–9',
    color: '#C084FC',
    colorMuted: 'rgba(192,132,252,0.15)',
    what: 'Neuromuscular power.',
    why: 'Speedwork with lower injury risk. Forces high knee drive and hip extension.',
  },
  PROGRESSION: {
    name: 'Progression Run',
    rpe: '5→8',
    color: '#00E5FF',
    colorMuted: 'rgba(0,229,255,0.15)',
    what: 'Pacing intelligence.',
    why: 'Trains the shift from aerobic to threshold mid-run. Race-specific adaptation.',
  },
  REST: {
    name: 'Full Rest',
    rpe: '0',
    color: '#2a2a2a',
    colorMuted: 'rgba(42,42,42,0.3)',
    what: 'Full recovery.',
    why: 'Adaptation happens between sessions — not during them.',
  },
  RUN_WALK: {
    name: 'Run-Walk',
    rpe: '3–4',
    color: '#CCFF00',
    colorMuted: 'rgba(204,255,0,0.15)',
    what: 'Foundation session.',
    why: 'Run-walk intervals let you cover distance without the joint stress of continuous running.',
  },
};

export const PHASE_META: Record<PhaseKey, { label: string; desc: string }> = {
  BASE: {
    label: 'BASE PHASE',
    desc: 'Build the engine. Aerobic volume dominates. No heroics.',
  },
  BUILD: {
    label: 'BUILD PHASE',
    desc: 'Introduce quality. Threshold and interval work begins.',
  },
  PEAK: {
    label: 'PEAK PHASE',
    desc: 'Maximum training stress. This is where champions are made.',
  },
  TAPER: {
    label: 'TAPER PHASE',
    desc: 'Trust the work. Reduce volume, sharpen race-pace neurology.',
  },
  FOUNDATION: {
    label: 'FOUNDATION',
    desc: 'Build the habit. The running engine comes later.',
  },
  STRETCH: {
    label: 'STRETCH',
    desc: 'Closer to continuous. Trust the process.',
  },
};

export const METHODOLOGIES: Record<MethodologyKey, MethodologyInfo> = {
  AUTO: {
    name: 'Pick for me',
    volMult: 1,
    description: "We'll choose the right method from your profile.",
    plainEn: 'Not sure? We will pick the best fit based on your experience and race.',
    logic: 'auto',
  },
  NORWEGIAN: {
    name: 'Norwegian Model',
    volMult: 1,
    description: 'Double Threshold precision training.',
    plainEn: "Two fast workouts a week at 'comfortably hard'. How Ingebrigtsen trains.",
    logic: 'double-threshold',
  },
  LYDIARD: {
    name: 'Lydiard',
    volMult: 1.1,
    description: 'Massive aerobic base before sharpening.',
    plainEn: 'Run a lot, slowly, for a long time. Then sharpen. The classic.',
    logic: 'base-first',
    baseRatio: 0.55,
  },
  VDOT: {
    name: 'Daniels VDOT',
    volMult: 1,
    description: 'Science-based pace zones from VO₂max.',
    plainEn: 'Math-backed pace zones calibrated from your goal time. Safest default.',
    logic: 'pacing-science',
  },
  MAFFETONE: {
    name: 'Maffetone (MAF)',
    volMult: 1,
    description: '180-minus-age HR ceiling. Slow is fast.',
    plainEn: 'Never let your heart rate go above (180 minus your age). Great for injury-prone runners.',
    logic: 'heart-rate-cap',
  },
  HANSONS: {
    name: 'Hansons',
    volMult: 1,
    description: 'Long run capped at 26km. Cumulative fatigue.',
    plainEn: 'Marathon specialty. Long runs capped so every day of the week matters.',
    logic: 'cumulative-fatigue',
    maxLR: 26,
  },
  VAN_AAKEN: {
    name: 'Van Aaken',
    volMult: 1.2,
    description: '95% slow aerobic volume + sprint neurology.',
    plainEn: "Almost all slow + tiny sprints. The 'no junk miles' method.",
    logic: 'slow-fast',
  },
  FIRST: {
    name: 'FIRST (3+2)',
    volMult: 0.8,
    description: '3 quality days + 2 cross-train. Efficiency.',
    plainEn: 'Three runs a week plus biking or swimming. For the time-crunched.',
    logic: 'efficiency',
    maxQuality: 3,
  },
  KENYAN: {
    name: 'Kenyan Progression',
    volMult: 1.05,
    description: 'Intuitive warm-up to race pace. Pacing IQ.',
    plainEn: 'Every run starts slow and gets faster. Builds race instinct.',
    logic: 'intuitive-prog',
  },
  GALLOWAY: {
    name: 'Galloway Run-Walk',
    volMult: 0.85,
    description: 'Strategic walk breaks. Running for life.',
    plainEn: 'Run 4 minutes, walk 1. Repeat. Best for new runners — you will finish.',
    logic: 'run-walk-run',
  },
  EKIDEN: {
    name: 'Japanese Ekiden',
    volMult: 1.15,
    description: 'High-volume Gasshuku group sessions.',
    plainEn: 'Lots of running. Japanese relay-team style — only if you already run 60+ km/wk.',
    logic: 'high-vol',
  },
};

export const autoResolveMethodology = (
  fitnessLevel: FitnessLevelKey,
  dist: DistanceKey,
  volume?: number
): MethodologyKey => {
  if (fitnessLevel === 'NOVICE' || !volume || volume <= 0) return 'GALLOWAY';
  if (fitnessLevel === 'BEGINNER') {
    if (dist === '5k' || dist === '10k') return 'LYDIARD';
    if (dist === '42k' || dist === 'Ultra') return 'GALLOWAY';
    return 'LYDIARD';
  }
  if (fitnessLevel === 'ADVANCED' || fitnessLevel === 'ELITE') {
    if (dist === '5k' || dist === '10k') return 'NORWEGIAN';
    if (dist === '42k' || dist === 'Ultra') return 'HANSONS';
    return 'NORWEGIAN';
  }
  if (dist === '42k' || dist === 'Ultra') return 'HANSONS';
  return 'VDOT';
};

export const autoMethodReason = (
  fitness: FitnessLevelKey,
  dist: DistanceKey,
  chosen: MethodologyKey
): string => {
  const reasons: Record<string, string> = {
    GALLOWAY: 'Run-walk-run is the safest foundation for anyone starting from zero.',
    LYDIARD: "You're new enough that the biggest unlock is more aerobic volume, not more speed.",
    VDOT: "VDOT's pace zones give you a clean, measurable target for every workout.",
    HANSONS: 'Hansons caps the long run so every day of the week matters — ideal for the marathon.',
    NORWEGIAN: 'At your level, two threshold workouts a week is the fastest lever for race-day speed.',
    EKIDEN: 'Ekiden high-volume suits your existing aerobic base.',
  };
  return reasons[chosen] || `We picked ${chosen} based on your profile.`;
};

export const parseTime = (val: string | null | undefined): number | null => {
  if (!val || !String(val).trim()) return null;
  const t = String(val).trim();
  if (!/^[\d:]+$/.test(t)) return null;
  const parts = t.split(':').map((x) => parseInt(x, 10));
  if (parts.some((x) => isNaN(x) || x < 0)) return null;
  if (parts.length === 2 && parts[1] >= 60) return null;
  if (parts.length === 3 && (parts[1] >= 60 || parts[2] >= 60)) return null;
  if (parts.length === 3) return 3600 * parts[0] + 60 * parts[1] + parts[2];
  if (parts.length === 2) return 60 * parts[0] + parts[1];
  return null;
};

export const formatTime = (seconds: number): string => {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const formatPace = (secPerKm: number): string => {
  if (!Number.isFinite(secPerKm) || secPerKm <= 0) return '—';
  const s = Math.max(0, Math.round(secPerKm));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}/km`;
};

export const formatPaceRange = (sec: number, tolSec: number): string => {
  if (!Number.isFinite(sec) || sec <= 0) return '---';
  const a = Math.max(0, Math.round(tolSec));
  if (a === 0) return formatPace(sec);
  const low = Math.max(0, Math.round(sec - a));
  const high = Math.max(low + 1, Math.round(sec + a));
  const m1 = Math.floor(low / 60);
  const s1 = (low % 60).toString().padStart(2, '0');
  const m2 = Math.floor(high / 60);
  const s2 = (high % 60).toString().padStart(2, '0');
  return `${m1}:${s1}-${m2}:${s2}/km`;
};

export const riegel = (t1: number, d1: number, d2: number): number => {
  if (!t1 || !d1 || !d2 || !isFinite(t1) || !isFinite(d1) || !isFinite(d2) || d1 <= 0 || d2 <= 0 || t1 <= 0) {
    return 0;
  }
  return t1 * Math.pow(d2 / d1, 1.06);
};

export const predictFinishTime = (t1: number, d1: number, d2: number): string | null => {
  const r = riegel(t1, d1, d2);
  return r ? formatTime(r) : null;
};

export const resolveDistKm = (dist: DistanceKey, ultraDist?: string): number => {
  if (dist === 'Ultra') {
    const val = parseFloat(ultraDist || '');
    return isFinite(val) && val > 0 ? Math.min(val, 500) : 50;
  }
  return DIST_KM[dist] || 5;
};

export const computePaces = (
  targetTimeSec: number,
  distKm: number,
  fitnessLevel: FitnessLevelKey = 'INTERMEDIATE'
) => {
  if (!targetTimeSec || !distKm) return null;
  const marathonSec = riegel(targetTimeSec, distKm, 42.195) / 42.195;
  const racePace = targetTimeSec / distKm;
  const fit = FITNESS_MULTIPLIERS[fitnessLevel] || FITNESS_MULTIPLIERS.INTERMEDIATE;
  return {
    race: Math.round(racePace),
    marathon: Math.round(marathonSec),
    threshold: Math.round(0.955 * marathonSec),
    interval: Math.round(0.887 * marathonSec),
    easy: Math.round(1.22 * marathonSec * fit.easyPad),
    recovery: Math.round(1.33 * marathonSec * fit.easyPad),
    long: Math.round(1.2 * marathonSec * fit.easyPad),
  };
};

export const suggestTargetTimes = (
  time: number,
  fromDistKm: number,
  toDistKm: number,
  fitness: FitnessLevelKey = 'INTERMEDIATE'
) => {
  if (!time || !fromDistKm || !toDistKm) return null;
  const base = riegel(time, fromDistKm, toDistKm);
  const factor = {
    BEGINNER: 1.05,
    INTERMEDIATE: 1.0,
    ADVANCED: 0.99,
    ELITE: 0.98,
  }[fitness as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE'] || 1.0;
  return {
    conservative: Math.round(1.06 * base * factor),
    realistic: Math.round(base * factor),
    stretch: Math.round(0.96 * base * factor),
  };
};

export const getSessionMentoring = (zone: WorkoutZoneKey, age: number = 30) => {
  const maxHr = 220 - (age || 30);
  const hrRange = (l: number, h: number) => `${Math.round(maxHr * l)}–${Math.round(maxHr * h)} bpm`;
  const guide: Record<string, { hrZone: string; feel: string; landmark: string; warning: string }> = {
    EASY: {
      hrZone: `Z2 · ${hrRange(0.65, 0.75)}`,
      feel: 'Fully conversational. Easy sentences.',
      landmark: 'Can say full sentences without gasping.',
      warning: 'Slow down if breathing becomes laboured.',
    },
    RECOVERY: {
      hrZone: `Z1 · <${Math.round(0.65 * maxHr)} bpm`,
      feel: 'Effortless. Walk if needed.',
      landmark: 'HR should not climb. If it does, walk.',
      warning: 'Stop if any soreness sharpens mid-run.',
    },
    TEMPO: {
      hrZone: `Z4 · ${hrRange(0.82, 0.88)}`,
      feel: 'Comfortably uncomfortable. Short phrases only.',
      landmark: '2-word answers only. Breathing every 2 steps.',
      warning: 'Back off if pace drops >10 sec/km vs target.',
    },
    INTERVAL: {
      hrZone: `Z5 · ${hrRange(0.92, 0.97)}`,
      feel: 'Hard. Only grunts by rep 4+.',
      landmark: 'Breathing every stride. Tunnel vision is normal.',
      warning: 'Stop if form breaks down or nausea hits.',
    },
    LONG: {
      hrZone: `Z2–Z3 · ${hrRange(0.65, 0.78)}`,
      feel: 'Conversational first 60%. Focused last 20%.',
      landmark: 'Can hum for first half. Short words for last third.',
      warning: 'Stop if GI distress or HR >Z3 early in run.',
    },
    HILL: {
      hrZone: `Z4–Z5 · ${hrRange(0.85, 0.93)}`,
      feel: 'Hard on climbs. Fully recovered on descent.',
      landmark: 'Top of each hill near max effort. Walk down = recovery.',
      warning: 'Stop if Achilles or calf pain appears.',
    },
    PROGRESSION: {
      hrZone: `Z2→Z4 · ${hrRange(0.7, 0.87)}`,
      feel: 'Starts easy. Builds steadily to threshold.',
      landmark: 'Each km split should be 3–5 sec faster than previous.',
      warning: 'Abandon if target cannot be held by km 3.',
    },
  };
  return guide[zone] || guide.EASY;
};

export const buildSessionSegments = (
  zone: WorkoutZoneKey,
  paces: Record<string, number>,
  totalKm: number,
  phase: PhaseKey,
  logic: string,
  weekNum: number = 1,
  tolSec: number = 15
): WorkoutSegment[] => {
  const km = Math.max(0.2, parseFloat(String(totalKm)) || 0);
  const w = weekNum || 1;
  const round = (x: number) => Math.round(10 * Math.max(0.1, x)) / 10;

  let segs: WorkoutSegment[] = [];

  switch (zone) {
    case 'INTERVAL': {
      const repLabel = w <= 3 ? '400m' : w <= 7 ? '800m' : '1km';
      const repDist = w <= 3 ? 0.4 : w <= 7 ? 0.8 : 1.0;
      const reps = Math.max(3, Math.round(Math.max(0.8, 0.55 * km) / repDist));
      const jogDist = 0.5 * repDist;
      const restDist = Math.max(1.4, km - (reps * repDist + (reps - 1) * jogDist));
      const wu = round(0.55 * restDist);
      const cd = round(0.45 * restDist);
      segs.push({ zone: 'EASY', km: wu, label: 'Warm up', paceSec: paces.easy });
      for (let i = 0; i < reps; i++) {
        segs.push({ zone: 'INTERVAL', km: repDist, label: repLabel, paceSec: paces.interval });
        if (i < reps - 1) {
          segs.push({ zone: 'RECOVERY', km: round(jogDist), label: 'Jog', paceSec: paces.recovery });
        }
      }
      segs.push({ zone: 'EASY', km: cd, label: 'Cool down', paceSec: paces.easy });
      break;
    }
    case 'TEMPO': {
      const wu = round(Math.max(1, 0.2 * km));
      const cd = round(Math.max(1, 0.15 * km));
      if (logic === 'double-threshold') {
        const tKm = round(Math.max(1.5, (km - wu - cd - 0.5) / 2));
        segs = [
          { zone: 'EASY', km: wu, label: 'Warm up', paceSec: paces.easy },
          { zone: 'TEMPO', km: tKm, label: 'Threshold', paceSec: paces.threshold },
          { zone: 'RECOVERY', km: 0.5, label: 'Float', paceSec: paces.recovery },
          { zone: 'TEMPO', km: tKm, label: 'Threshold', paceSec: paces.threshold },
          { zone: 'EASY', km: cd, label: 'Cool down', paceSec: paces.easy },
        ];
      } else {
        const mode = w % 3;
        if (mode === 0) {
          const tKm = round(Math.max(2, km - wu - cd));
          segs = [
            { zone: 'EASY', km: wu, label: 'Warm up', paceSec: paces.easy },
            { zone: 'TEMPO', km: tKm, label: 'Continuous tempo', paceSec: paces.threshold },
            { zone: 'EASY', km: cd, label: 'Cool down', paceSec: paces.easy },
          ];
        } else if (mode === 1) {
          const tKm = round(Math.max(1, 0.22 * km));
          segs = [
            { zone: 'EASY', km: wu, label: 'Warm up', paceSec: paces.easy },
            { zone: 'TEMPO', km: tKm, label: 'Tempo', paceSec: paces.threshold },
            { zone: 'RECOVERY', km: 0.3, label: 'Float', paceSec: paces.recovery },
            { zone: 'TEMPO', km: tKm, label: 'Tempo', paceSec: paces.threshold },
            { zone: 'RECOVERY', km: 0.3, label: 'Float', paceSec: paces.recovery },
            { zone: 'TEMPO', km: tKm, label: 'Tempo', paceSec: paces.threshold },
            { zone: 'EASY', km: cd, label: 'Cool down', paceSec: paces.easy },
          ];
        } else {
          const tKm = round(Math.max(2, 0.35 * km));
          const mid = round(Math.max(0.5, km - wu - cd - 2 * tKm));
          segs = [
            { zone: 'EASY', km: wu, label: 'Warm up', paceSec: paces.easy },
            { zone: 'TEMPO', km: tKm, label: 'Threshold', paceSec: paces.threshold },
            { zone: 'EASY', km: mid, label: 'Easy', paceSec: paces.easy },
            { zone: 'TEMPO', km: tKm, label: 'Threshold', paceSec: paces.threshold },
            { zone: 'EASY', km: cd, label: 'Cool down', paceSec: paces.easy },
          ];
        }
      }
      break;
    }
    case 'LONG': {
      if (phase === 'PEAK' && w % 2 === 0) {
        const mpKm = round(0.2 * km);
        const lKm = round(0.65 * km);
        const midKm = round(Math.max(0.3, km - lKm - mpKm));
        segs = [
          { zone: 'LONG', km: lKm, label: 'Aerobic', paceSec: paces.long },
          { zone: 'EASY', km: midKm, label: 'Steady', paceSec: paces.easy },
          { zone: 'TEMPO', km: mpKm, label: 'MP finish', paceSec: paces.marathon },
        ];
      } else if (phase === 'BUILD') {
        const nsKm = round(0.25 * km);
        segs = [
          { zone: 'LONG', km: round(km - nsKm), label: 'Long aerobic', paceSec: paces.long },
          { zone: 'TEMPO', km: nsKm, label: 'Negative split', paceSec: paces.threshold },
        ];
      } else {
        segs = [{ zone: 'LONG', km: round(km), label: 'Long aerobic', paceSec: paces.long }];
      }
      break;
    }
    case 'HILL': {
      const wu = round(Math.max(1, 0.25 * km));
      const cd = round(Math.max(1, 0.15 * km));
      const reps = Math.max(6, Math.min(14, Math.round((phase === 'PEAK' ? 10 : 8) + (km - 8) * 0.5)));
      const segWork = Math.max(1, km - wu - cd) / reps;
      const up = Math.max(0.1, round(0.55 * segWork));
      const down = Math.max(0.1, round(0.45 * segWork));
      segs.push({ zone: 'EASY', km: wu, label: 'Warm up', paceSec: paces.easy });
      for (let i = 0; i < reps; i++) {
        segs.push({ zone: 'HILL', km: up, label: 'Hill sprint', paceSec: paces.interval });
        segs.push({ zone: 'RECOVERY', km: down, label: 'Walk down', paceSec: paces.recovery });
      }
      segs.push({ zone: 'EASY', km: cd, label: 'Cool down', paceSec: paces.easy });
      break;
    }
    case 'PROGRESSION': {
      const p1 = round(0.35 * km);
      const p2 = round(0.35 * km);
      const p3 = round(Math.max(0.3, km - p1 - p2));
      segs = [
        { zone: 'EASY', km: p1, label: 'Easy start', paceSec: paces.easy },
        { zone: 'LONG', km: p2, label: 'Build pace', paceSec: paces.long },
        { zone: 'TEMPO', km: p3, label: 'Threshold finish', paceSec: paces.threshold },
      ];
      break;
    }
    case 'RECOVERY': {
      segs = [{ zone: 'RECOVERY', km: round(km), label: 'Active recovery', paceSec: paces.recovery }];
      break;
    }
    default: {
      segs = [{ zone: 'EASY', km: round(km), label: 'Easy aerobic', paceSec: paces.easy }];
    }
  }

  return segs.map((s) => ({
    ...s,
    paceLowSec: Math.max(0, Math.round(s.paceSec - tolSec)),
    paceHighSec: Math.round(s.paceSec + tolSec),
  }));
};

export const buildSessionDesc = (
  zone: WorkoutZoneKey,
  paces: Record<string, number>,
  distKm: number,
  phase: PhaseKey,
  logic: string,
  age: number = 30,
  weekNum: number = 1
): string => {
  const pStr = (sec: number) => formatPace(sec);
  const s = Math.max(1, Math.round(distKm || 0));
  const u = weekNum || 1;

  switch (zone) {
    case 'INTERVAL': {
      const rep = u <= 3 ? '400m' : u <= 7 ? '800m' : '1km';
      const reps = Math.max(3, Math.round(Math.max(0.8, 0.55 * s) / (rep === '400m' ? 0.4 : rep === '800m' ? 0.8 : 1)));
      const wu = Math.max(1, Math.round(0.22 * s));
      const cd = Math.max(1, Math.round(0.18 * s));
      const rest = rep === '400m' ? '60s' : rep === '800m' ? '90s' : '2min';
      return `${s}km total · ${wu}km WU · ${reps}×${rep} @ ${pStr(paces.interval)} (${rest} jog) · ${cd}km CD`;
    }
    case 'TEMPO': {
      if (logic === 'double-threshold') {
        return `${s}km total · ${Math.max(3, Math.round(0.5 * s))}km @ ${pStr(paces.threshold)} · 5min easy · repeat`;
      }
      const mode = u % 3;
      if (mode === 0) {
        return `${s}km total · ${Math.max(3, Math.round(0.7 * s))}km continuous @ ${pStr(paces.threshold)}`;
      }
      if (mode === 1) {
        return `${s}km total · 3×${Math.max(1, Math.round(0.22 * s))}km @ ${pStr(paces.threshold)} · 2min float`;
      }
      return `${s}km total · ${Math.max(2, Math.round(0.35 * s))}km @ ${pStr(paces.threshold)} · 5min easy · ${Math.max(2, Math.round(0.35 * s))}km`;
    }
    case 'LONG': {
      if (phase === 'PEAK' && u % 2 === 0) {
        return `${s}km · first 65% @ ${pStr(paces.long)} · last 20% @ ${pStr(paces.threshold)} · gel every 45min`;
      }
      if (phase === 'BUILD') {
        return `${s}km @ ${pStr(paces.long)} · negative split last 25% · fueling practice`;
      }
      return `${s}km @ ${pStr(paces.long)} · fully aerobic · gel every 45min`;
    }
    case 'HILL': {
      const reps = Math.max(6, Math.min(14, Math.round((phase === 'PEAK' ? 10 : 8) + (s - 8) * 0.5)));
      const wu = Math.max(1, Math.round(0.25 * s));
      return `${s}km total · ${wu}km WU · ${reps}×${u > 6 ? '90s' : '60s'} uphill hard · walk down recovery · core circuit after`;
    }
    case 'PROGRESSION': {
      return `${s}km · start @ ${pStr(paces.easy)} → build each km → finish @ ${pStr(paces.threshold)}`;
    }
    case 'RECOVERY': {
      return `${s}km · very easy · conversational · HR < ${age ? 180 - age + 10 : 140}bpm · @ ${pStr(paces.recovery)}`;
    }
    default: {
      if (logic === 'heart-rate-cap') {
        return `${s}km · HR ≤ ${age ? 180 - age : 135}bpm · no exceptions · ~${pStr(paces.easy)}`;
      }
      if (logic === 'run-walk-run') {
        return `${s}km · 4 min run · 1 min walk · repeat · RPE 3–4`;
      }
      return `${s}km @ ${pStr(paces.easy)} · fully conversational · RPE 3–4`;
    }
  }
};

export const buildVolumeCurve = (
  weeks: number,
  startVol: number,
  peakVol: number,
  taperWeeks: number
): number[] => {
  const curve = Array(weeks).fill(0);
  const buildLen = weeks - taperWeeks;
  if (buildLen < 1) {
    return curve.map(() => startVol);
  }
  let rampCount = 0;
  for (let i = 1; i < buildLen; i++) {
    if (i % 4 !== 3) rampCount++;
  }
  let step = rampCount > 0 ? Math.pow(peakVol / startVol, 1 / rampCount) : 1;
  if (!isFinite(step) || step < 1) step = 1;
  if (step > 1.1) step = 1.1;

  let curr = startVol;
  curve[0] = startVol;
  for (let i = 1; i < buildLen; i++) {
    if (i % 4 === 3) {
      curve[i] = 0.78 * curr; // scheduled recovery week
    } else {
      curr = curr * step;
      curve[i] = curr;
    }
  }
  const peak = curr;
  const taperDrops = taperWeeks === 1 ? [0.6] : taperWeeks === 2 ? [0.75, 0.5] : [0.8, 0.6, 0.4];
  for (let i = 0; i < taperWeeks; i++) {
    curve[buildLen + i] = peak * (taperDrops[i] || 0.4);
  }
  return curve;
};

export const generateNovicePlan = (inputs: PlanInputs): GeneratedPlan => {
  const { motivation = 'FIRST_5K', startingPoint = 'WALK_OCC', schedule = ['Mon', 'Wed', 'Fri'], duration = '8' } = inputs;
  const numWeeks = Math.min(12, Math.max(6, parseInt(duration) || 8));

  const startConfig: Record<string, [number, number, number]> = {
    WALK_30: [60, 120, 6],
    WALK_OCC: [45, 180, 5],
    NO_EXERCISE: [30, 240, 5],
    INJURY: [30, 240, 4],
  };
  const [baseRunSec, baseWalkSec, baseCycles] = startConfig[startingPoint] || startConfig.WALK_OCC;

  const progression = [
    { runMult: 1, walkMult: 1, cyclesOverride: null, label: 'Build the habit' },
    { runMult: 2, walkMult: 0.75, cyclesOverride: null, label: 'Longer runs' },
    { runMult: 3, walkMult: 0.55, cyclesOverride: null, label: 'Longer runs' },
    { runMult: 5, walkMult: 0.45, cyclesOverride: 4, label: 'Stretch it' },
    { runMult: 7, walkMult: 0.4, cyclesOverride: 3, label: 'Bigger blocks' },
    { runMult: 10, walkMult: 0.3, cyclesOverride: 3, label: 'Confidence' },
    { runMult: 15, walkMult: 0.25, cyclesOverride: 2, label: 'Almost there' },
    { runMult: 30, walkMult: 0, cyclesOverride: 1, label: 'First 5K' },
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks: PlanWeek[] = [];
  const longDay = schedule[schedule.length - 1];

  for (let w = 1; w <= numWeeks; w++) {
    const progIdx = Math.min(w - 1, progression.length - 1);
    const prog = progression[progIdx];
    const runSec = Math.round(baseRunSec * prog.runMult);
    const walkSec = Math.max(0, Math.round(baseWalkSec * prog.walkMult));
    const cycles = prog.cyclesOverride || baseCycles;
    const continuous = walkSec === 0;

    let phase: PhaseKey = 'FOUNDATION';
    if (w >= 4) phase = 'BUILD';
    if (w >= 7) phase = 'STRETCH';

    const weekData: PlanWeek = {
      number: w,
      phase,
      phaseMeta: PHASE_META[phase],
      days: {},
      totalVolume: 0,
      qualitySessions: 0,
      targetVolume: 0,
    };

    daysOfWeek.forEach((day) => {
      if (!schedule.includes(day)) {
        weekData.days[day] = {
          archKey: 'REST',
          type: 'REST',
          dist: '0.0',
          pace: '---',
          rpe: '—',
          color: '#2a2a2a',
          colorMuted: 'rgba(42,42,42,0.3)',
          desc: 'Full rest. Your body is building new engines right now.',
          what: 'Full rest.',
          why: 'Adaptation happens between sessions — not during them.',
        };
        return;
      }

      const isLong = day === longDay;
      const dayCycles = isLong && !continuous ? cycles + 1 : cycles;
      const totalTimeMin = Math.round((dayCycles * (runSec + walkSec)) / 60);
      const estDistKm = Math.round((runSec * dayCycles * (8.5 / 3600) + walkSec * dayCycles * (5.5 / 3600)) * 10) / 10;

      const segs: WorkoutSegment[] = [];
      const runKm = Math.max(0.05, (8.5 / 3600) * runSec);
      const walkKm = Math.max(0.05, (5.5 / 3600) * walkSec);
      const fmtDuration = (sec: number) => (sec >= 60 ? `${Math.round(sec / 60)} min` : `${sec}s`);

      for (let i = 0; i < dayCycles; i++) {
        segs.push({
          zone: 'EASY',
          km: Math.round(10 * runKm) / 10,
          label: continuous ? 'Continuous run' : `Run ${fmtDuration(runSec)}`,
          paceSec: 0,
        });
        if (!continuous && walkSec > 0) {
          segs.push({
            zone: 'RECOVERY',
            km: Math.round(10 * walkKm) / 10,
            label: `Walk ${fmtDuration(walkSec)}`,
            paceSec: 0,
          });
        }
      }

      const rStr = runSec >= 60 ? `${Math.round(runSec / 60)} min` : `${runSec}s`;
      const wStr = walkSec >= 60 ? `${Math.round(walkSec / 60)} min` : walkSec > 0 ? `${walkSec}s` : '';
      const desc = continuous
        ? `Run ${rStr} continuous. No walking. You're doing this.`
        : `Run ${rStr}, walk ${wStr}. Repeat ${dayCycles}×. ${totalTimeMin} min total.`;

      weekData.days[day] = {
        archKey: continuous ? 'EASY' : 'RUN_WALK',
        type: continuous ? 'Continuous Run' : 'Run-Walk',
        dist: String(estDistKm),
        pace: 'Effort-based',
        rpe: '3–4',
        color: '#CCFF00',
        colorMuted: 'rgba(204,255,0,0.15)',
        desc,
        segments: segs,
        what: continuous
          ? 'Your first continuous run. This is the 5K.'
          : isLong
          ? 'Weekly long session. One extra cycle to stretch durability.'
          : 'Foundation session. Build the habit — show up, finish, rest.',
        why: 'Run-walk intervals let you cover distance without the joint stress of continuous running.',
        runWalk: {
          runSec,
          walkSec,
          cycles: dayCycles,
          timeMin: totalTimeMin,
          continuous,
        },
        mentoring: {
          hrZone: 'Effort-based (ignore HR)',
          feel: continuous ? 'Steady. Conversational.' : 'Easy running. Should feel almost too slow.',
          landmark: 'Can speak full sentences while running. If not, slow down.',
          warning: 'Stop if chest pain, dizziness, or sharp joint pain.',
        },
      };
      weekData.totalVolume += estDistKm;
    });

    weekData.totalVolume = Math.round(10 * weekData.totalVolume) / 10;
    weeks.push(weekData);
  }

  return {
    paces: {},
    pacesRaw: {},
    methodology: {
      name: 'Couch to 5K',
      volMult: 1,
      description: 'Run-walk progression for first-time runners.',
      plainEn: 'Eight weeks. One 5K finish. Starts at a walk, finishes on a 5K.',
      logic: 'run-walk-run',
    },
    fitnessLevel: FITNESS_MULTIPLIERS.NOVICE,
    distance: '5k',
    distKm: 5,
    targetTime: 'Finish',
    goalMode: 'FINISH',
    mode: 'COUCH_TO_5K',
    foundation: true,
    validation: { ok: true, errors: [], warnings: [] },
    weeks,
  };
};

export const generatePlan = (inputs: PlanInputs): GeneratedPlan => {
  if (inputs.fitnessLevel === 'NOVICE') {
    return generateNovicePlan(inputs);
  }

  let {
    targetTime = '4:00:00',
    duration = '12',
    schedule = ['Tue', 'Thu', 'Sat', 'Sun'],
    longDay = 'Sun',
    currentVolume = '35',
    distance = 'Half',
    ultraDist = '50',
    fitnessLevel = 'INTERMEDIATE',
    goalMode = 'TIME',
    methodology = 'AUTO',
    age = '30',
  } = inputs;

  const originalMethod = methodology;
  if (methodology === 'AUTO') {
    methodology = autoResolveMethodology(fitnessLevel, distance, parseFloat(currentVolume));
  }

  // Default target times if finish mode
  if (goalMode === 'FINISH' || !targetTime) {
    const defaultTimes: Record<FitnessLevelKey, Record<DistanceKey, string>> = {
      NOVICE: { '5k': '40:00', '10k': '1:25:00', Half: '3:00:00', '42k': '6:00:00', Ultra: '8:00:00' },
      BEGINNER: { '5k': '35:00', '10k': '1:15:00', Half: '2:30:00', '42k': '5:15:00', Ultra: '7:00:00' },
      INTERMEDIATE: { '5k': '27:00', '10k': '55:00', Half: '2:00:00', '42k': '4:15:00', Ultra: '5:30:00' },
      ADVANCED: { '5k': '22:00', '10k': '46:00', Half: '1:40:00', '42k': '3:25:00', Ultra: '4:30:00' },
      ELITE: { '5k': '18:00', '10k': '37:00', Half: '1:25:00', '42k': '3:00:00', Ultra: '3:45:00' },
    };
    targetTime = defaultTimes[fitnessLevel]?.[distance] || '2:00:00';
  }

  const numWeeks = Math.min(52, Math.max(4, parseInt(duration) || 12));
  const distKm = resolveDistKm(distance, ultraDist);
  const targetTimeSec = parseTime(targetTime) || 7200;
  const rawPaces = computePaces(targetTimeSec, distKm, fitnessLevel) || {
    race: 300,
    marathon: 300,
    threshold: 285,
    interval: 260,
    easy: 360,
    recovery: 400,
    long: 360,
  };

  const methodObj = METHODOLOGIES[methodology] || METHODOLOGIES.VDOT;
  const fitObj = FITNESS_MULTIPLIERS[fitnessLevel] || FITNESS_MULTIPLIERS.INTERMEDIATE;
  const parsedAge = Math.max(15, Math.min(80, parseInt(age) || 30));

  const minStart = MIN_START_VOL[distance] || 25;
  const userVol = parseFloat(currentVolume);
  const startVol = Math.max(isFinite(userVol) && userVol > 0 ? userVol : minStart, minStart) * fitObj.volume;
  const peakVol = (PEAK_VOL_BY_DIST[distance] || 80) * fitObj.volume * (methodObj.volMult || 1);
  const taperLen = Math.min(TAPER_WEEKS[distance] || 2, Math.max(1, Math.floor(numWeeks / 4)));
  const volCurve = buildVolumeCurve(numWeeks, startVol, peakVol, taperLen);

  const maxLR = methodObj.maxLR ? Math.min(methodObj.maxLR, MAX_LONG_RUN[distance] || 30) : MAX_LONG_RUN[distance] || 30;

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks: PlanWeek[] = [];

  for (let w = 1; w <= numWeeks; w++) {
    // determine phase
    const buildWeeks = numWeeks - taperLen;
    let phase: PhaseKey = 'BASE';
    if (w > buildWeeks) phase = 'TAPER';
    else {
      const ratio = w / buildWeeks;
      if (ratio <= 0.3) phase = 'BASE';
      else if (ratio <= 0.75) phase = 'BUILD';
      else phase = 'PEAK';
    }

    const weekVol = volCurve[w - 1];
    const nonLongDays = schedule.filter((d) => d !== longDay);

    // Number of quality days
    let qualityCount = phase === 'PEAK' ? 2 : phase === 'BUILD' ? 1 : 0;
    if (methodObj.logic === 'double-threshold' && phase !== 'TAPER' && phase !== 'BASE') {
      qualityCount = 2;
    }
    if (nonLongDays.length > 0) {
      qualityCount = Math.min(qualityCount, nonLongDays.length);
    }

    // Pick quality workout days spaced apart
    const hardDaysPicked: string[] = [];
    for (let i = 0; i < nonLongDays.length && hardDaysPicked.length < qualityCount; i++) {
      const day = nonLongDays[i];
      const lastIdx = hardDaysPicked.length ? daysOfWeek.indexOf(hardDaysPicked[hardDaysPicked.length - 1]) : -99;
      if (Math.abs(daysOfWeek.indexOf(day) - lastIdx) > 1) {
        hardDaysPicked.push(day);
      }
    }

    // Allocate distances
    const lrFactor = phase === 'PEAK' ? 0.34 : phase === 'TAPER' ? 0.25 : 0.32;
    let longRunKm = Math.min(weekVol * lrFactor, maxLR);
    if (phase === 'TAPER') longRunKm = Math.min(longRunKm, 0.7 * maxLR);

    const qualityVolKm = 0.12 * weekVol;
    const remainingDays = Math.max(1, schedule.length - hardDaysPicked.length - 1);
    const easyDayVol = Math.max(3, (weekVol - longRunKm - qualityVolKm * hardDaysPicked.length) / remainingDays);

    const weekData: PlanWeek = {
      number: w,
      phase,
      phaseMeta: PHASE_META[phase],
      days: {},
      totalVolume: 0,
      qualitySessions: 0,
      targetVolume: Math.round(10 * weekVol) / 10,
    };

    daysOfWeek.forEach((day) => {
      if (!schedule.includes(day)) {
        weekData.days[day] = {
          archKey: 'REST',
          type: 'REST',
          dist: '0.0',
          pace: '---',
          rpe: '—',
          color: '#2a2a2a',
          colorMuted: 'rgba(42,42,42,0.3)',
          desc: 'Full recovery. Sleep, nutrition, mobility.',
          what: 'Full rest.',
          why: 'Structural repair happens here, not during the run.',
        };
        return;
      }

      let zone: WorkoutZoneKey = 'EASY';
      let dayDist = easyDayVol;

      if (day === longDay) {
        zone = 'LONG';
        dayDist = longRunKm;
      } else if (hardDaysPicked.includes(day)) {
        const qIdx = hardDaysPicked.indexOf(day);
        if (methodObj.logic === 'double-threshold') {
          zone = 'TEMPO';
        } else if (methodObj.logic === 'slow-fast' && phase === 'PEAK') {
          zone = 'HILL';
        } else {
          zone = qIdx === 0 ? (w % 2 === 0 ? 'INTERVAL' : 'TEMPO') : 'TEMPO';
        }
        dayDist = qualityVolKm;
        weekData.qualitySessions++;
      } else if (phase !== 'BASE' && schedule.length >= 5 && schedule.indexOf(day) % 3 === 0) {
        zone = 'RECOVERY';
        dayDist = Math.max(3, 0.6 * easyDayVol);
      }

      const archetype = RUN_ARCHETYPES[zone];
      const paceSec =
        zone === 'EASY'
          ? rawPaces.easy
          : zone === 'RECOVERY'
          ? rawPaces.recovery
          : zone === 'LONG'
          ? rawPaces.long
          : zone === 'INTERVAL' || zone === 'HILL'
          ? rawPaces.interval
          : rawPaces.threshold;

      const roundedDist = Math.max(2, Math.round(10 * dayDist) / 10);
      weekData.totalVolume += roundedDist;

      weekData.days[day] = {
        archKey: zone,
        type: archetype.name,
        dist: roundedDist.toFixed(1),
        distance_km: roundedDist,
        pace: formatPaceRange(paceSec, fitObj.paceToleranceSec),
        paceSec,
        paceLowSec: Math.max(0, paceSec - fitObj.paceToleranceSec),
        paceHighSec: paceSec + fitObj.paceToleranceSec,
        paceToleranceSec: fitObj.paceToleranceSec,
        rpe: archetype.rpe,
        color: archetype.color,
        colorMuted: archetype.colorMuted,
        desc: buildSessionDesc(zone, rawPaces, roundedDist, phase, methodObj.logic, parsedAge, w),
        segments: buildSessionSegments(zone, rawPaces, roundedDist, phase, methodObj.logic, w, fitObj.paceToleranceSec),
        what: archetype.what,
        why: archetype.why,
        mentoring: getSessionMentoring(zone, parsedAge),
      };
    });

    weekData.totalVolume = parseFloat(weekData.totalVolume.toFixed(1));
    weeks.push(weekData);
  }

  return {
    paces: {
      race: formatPace(rawPaces.race),
      easy: formatPace(rawPaces.easy),
      threshold: formatPace(rawPaces.threshold),
      interval: formatPace(rawPaces.interval),
      long: formatPace(rawPaces.long),
      recovery: formatPace(rawPaces.recovery),
      marathon: formatPace(rawPaces.marathon),
    },
    pacesRaw: rawPaces,
    methodology: methodObj,
    fitnessLevel: fitObj,
    distance,
    distKm,
    targetTime,
    goalMode,
    autoResolved:
      originalMethod === 'AUTO'
        ? {
            from: 'AUTO',
            to: methodology,
            reason: autoMethodReason(fitnessLevel, distance, methodology),
            forced: false,
          }
        : null,
    validation: { ok: true, errors: [], warnings: [] },
    weeks,
  };
};
