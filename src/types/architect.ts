export type DistanceKey = '5k' | '10k' | 'Half' | '42k' | 'Ultra';

export type FitnessLevelKey = 'NOVICE' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';

export type WorkoutZoneKey = 'EASY' | 'RECOVERY' | 'TEMPO' | 'INTERVAL' | 'LONG' | 'HILL' | 'PROGRESSION' | 'REST' | 'RUN_WALK';

export type MethodologyKey =
  | 'AUTO'
  | 'NORWEGIAN'
  | 'LYDIARD'
  | 'VDOT'
  | 'MAFFETONE'
  | 'HANSONS'
  | 'VAN_AAKEN'
  | 'FIRST'
  | 'KENYAN'
  | 'GALLOWAY'
  | 'EKIDEN';

export type PhaseKey = 'BASE' | 'BUILD' | 'PEAK' | 'TAPER' | 'FOUNDATION' | 'STRETCH';

export interface WorkoutArchetype {
  name: string;
  rpe: string;
  color: string;
  colorMuted: string;
  what: string;
  why: string;
}

export interface MethodologyInfo {
  name: string;
  volMult: number;
  description: string;
  plainEn: string;
  logic: string;
  baseRatio?: number;
  maxLR?: number;
  maxQuality?: number;
}

export interface FitnessLevelInfo {
  volume: number;
  easyPad: number;
  label: string;
  desc: string;
  paceToleranceSec: number;
}

export interface WorkoutSegment {
  zone: WorkoutZoneKey;
  km: number;
  label: string;
  paceSec: number;
  paceLowSec?: number;
  paceHighSec?: number;
}

export interface DayWorkout {
  archKey: WorkoutZoneKey;
  type: string;
  dist: string;
  distance_km?: number;
  pace: string;
  paceSec?: number;
  paceLowSec?: number;
  paceHighSec?: number;
  paceToleranceSec?: number;
  rpe: string;
  color: string;
  colorMuted: string;
  desc: string;
  what: string;
  why: string;
  segments?: WorkoutSegment[];
  mentoring?: {
    hrZone: string;
    feel: string;
    landmark: string;
    warning: string;
  };
  runWalk?: {
    runSec: number;
    walkSec: number;
    cycles: number;
    timeMin: number;
    continuous: boolean;
  };
  pm?: DayWorkout;
}

export interface PlanWeek {
  number: number;
  phase: PhaseKey;
  phaseMeta?: {
    label: string;
    desc: string;
  };
  weeklyMotivation?: string;
  days: Record<string, DayWorkout>;
  totalVolume: number;
  qualitySessions: number;
  targetVolume?: number;
}

export interface PlanInputs {
  distance: DistanceKey;
  ultraDist?: string;
  targetTime?: string;
  goalMode?: 'FINISH' | 'TIME';
  recentTime?: string;
  recentDist?: DistanceKey;
  fitnessLevel: FitnessLevelKey;
  currentVolume: string;
  duration: string;
  schedule: string[];
  longDay: string;
  hardDays?: string[];
  methodology: MethodologyKey;
  age?: string;
  doubles?: boolean;
  motivation?: 'FIRST_5K' | 'WEIGHT' | 'FRIEND' | 'DOCTOR';
  startingPoint?: 'WALK_30' | 'WALK_OCC' | 'NO_EXERCISE' | 'INJURY';
}

export interface GeneratedPlan {
  paces: Record<string, string>;
  pacesRaw: Record<string, number>;
  methodology: MethodologyInfo;
  fitnessLevel: FitnessLevelInfo;
  distance: DistanceKey;
  distKm: number;
  targetTime: string;
  goalMode: string;
  mode?: string;
  foundation?: boolean;
  autoResolved?: {
    from: string;
    to: string;
    reason: string;
    forced: boolean;
  } | null;
  validation: {
    ok: boolean;
    errors: string[];
    warnings: string[];
  };
  weeks: PlanWeek[];
}
