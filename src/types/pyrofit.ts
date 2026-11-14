export type IntensityLevel = 'LOW' | 'MID' | 'HIGH';

export type ProductTier = 'ALL' | 'L1' | 'L2' | 'L3';

export type FuelPhaseType = 'PRE' | 'DURING' | 'POST';

export interface WorkoutInputVector {
  workout_duration_mins: number; // D
  intensity_level: IntensityLevel; // I
  temperature_celsius: number; // T
  cramping_history: boolean; // C
  athlete_weight_kg: number; // W
  budget_tier_preference: ProductTier;
  session_type?: 'Training' | 'Race' | 'Long Run' | 'Recovery';
  distance_km?: number;
  humidity_pct?: number;
  terrain?: 'Road' | 'Trail' | 'Track' | 'Treadmill';
  fluid_access?: 'Full' | 'Limited' | 'Self-Carry';
  wet_bulb_c?: number;
}

export interface CalculatedHourlyTargets {
  environmental_factor_E: number;
  intensity_modifier: number;
  carbs_base_g: number;
  carbs_hourly_g: number;
  sodium_hourly_mg: number;
  fluids_hourly_ml: number;
}

export interface PhaseStrategyPlan {
  preWorkout: {
    active: boolean;
    timing: string;
    carbs_target_g: number;
    fluids_target_ml: number;
    guidance: string;
  };
  duringWorkout: {
    active: boolean;
    timing: string;
    carbs_hourly_g: number;
    sodium_hourly_mg: number;
    fluids_hourly_ml: number;
    total_carbs_g: number;
    total_sodium_mg: number;
    total_fluids_ml: number;
    interval_reminder: string;
  };
  postWorkout: {
    active: boolean;
    timing: string;
    protein_target_g: number;
    carbs_target_g: number;
    ratio: string;
    guidance: string;
  };
}

export interface FuelProduct {
  id: string;
  brand: string;
  name: string;
  phase: FuelPhaseType;
  carbs_g: number;
  sodium_mg: number;
  fluids_ml: number;
  protein_g: number;
  tier: 'L1' | 'L2' | 'L3';
  formulation_type: string;
  official_url: string;
  price_inr: number;
  tag: string;
  manufacturer_slug: string;
  origin: 'DOMESTIC_INDIA' | 'INTERNATIONAL';
  category: 'Energy Gels' | 'Carbohydrate Drink Mixes' | 'Electrolyte & Hydration Products' | 'Recovery Nutrition' | 'Energy Bars & Chews';
  serving_size_g_or_ml?: number;
  calories_kcal?: number;
  sugars_g?: number;
  potassium_mg?: number;
  magnesium_mg?: number;
  caffeine_mg?: number;
  dietary_tags: string[];
  anti_doping_certified: boolean;
  data_confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  verified_date?: string;
  cost_per_25g_carb?: number | null;
  cost_per_500mg_sodium?: number | null;
  cost_per_20g_protein?: number | null;
}

export interface AthleteProfileState {
  athlete_id: string;
  athlete_weight_kg: number;
  carb_multiplier: number;
  sodium_multiplier: number;
  filter_isotonic_only: boolean;
  historical_cramping: boolean;
  total_workouts_logged: number;
}

export interface TelemetryPayload {
  click_id: string;
  athlete_id: string;
  timestamp: string;
  product_metadata: {
    product_id: string;
    brand_name: string;
    product_name: string;
    tier: string;
    official_target_url: string;
  };
  workout_context: {
    duration_mins: number;
    intensity: IntensityLevel;
    temperature_celsius: number;
    environmental_factor_E: number;
    cramping_history_flag: boolean;
  };
  calculated_targets: {
    carbs_hourly_g: number;
    sodium_hourly_mg: number;
    fluids_hourly_ml: number;
  };
}

export type FeedbackOutcome = 'CRAMPING' | 'BLOATING' | 'CRASH' | 'OPTIMAL';

// Aliases for compatibility with sqliteEngine / aiCopilot using snake_case field names
export interface PhaseStrategyPlanAlt {
  pre_workout: {
    active: boolean;
    timing_window: string;
    carbs_target_g: number;
    fluids_target_ml: number;
  };
  during_workout: {
    interval_mins: number;
    carbs_hourly_g: number;
    sodium_hourly_mg: number;
    fluids_hourly_ml: number;
  };
  post_workout: {
    protein_target_g: number;
    carbs_target_g: number;
  };
}

export interface PostWorkoutFeedbackEntry {
  feedback_id: string;
  timestamp: string;
  workout_duration_mins: number;
  intensity: IntensityLevel;
  outcome: FeedbackOutcome;
  adjustments_applied: string[];
}

// ── Section 2.1 / 2.2 — Full Athlete Profile ──
export type Sport = 'Running' | 'Cycling' | 'Triathlon' | 'Trail' | 'Other';
export type Experience = 'Beginner' | 'Intermediate' | 'Elite';
export type Goal = 'Finish' | 'PR / Time Target' | 'Base Building' | 'Recovery';
export type GISensitivity = 'None' | 'Mild' | 'Severe / Bloating';
export type Diet = 'Omnivore' | 'Vegetarian' | 'Vegan' | 'Jain';
export type Allergen = 'Dairy' | 'Soy' | 'Gluten' | 'Nuts' | 'Caffeine';
export type CaffeineUse = 'None' | 'Low' | 'Moderate' | 'High';
export type BrandOriginPref = 'ALL' | 'DOMESTIC_INDIA' | 'INTERNATIONAL';
export type AntiDopingStatus = 'Recreational' | 'Tested / WADA-Informed Choice Only';
export type TrainingPhase = 'Base' | 'Build' | 'Peak' | 'Taper' | 'Race';

export interface FullAthleteProfile {
  athlete_id: string;
  sport: Sport;
  experience: Experience;
  goal: Goal;
  weight_kg: number;
  sweat_rate_l_hr?: number;        // if set, overrides fluids formula
  gi_sensitivity: GISensitivity;
  diet: Diet;
  allergies: Allergen[];
  current_supplements: string[];
  caffeine_use: CaffeineUse;
  brand_origin_pref: BrandOriginPref;
  budget_tier: ProductTier;
  anti_doping_status: AntiDopingStatus;
  medical_flags: { hypertension: boolean; diabetes: boolean; renal: boolean; notes: string };
  weekly_volume_hrs: number;
  training_phase: TrainingPhase;
  event_date?: string;             // ISO date string — drives race countdown
  event_distance_km?: number;
  sleep_hrs?: number;
  recovery_score?: number;         // 1–10
  fatigue_score?: number;          // 1–10
  carb_multiplier: number;
  sodium_multiplier: number;
  filter_isotonic_only: boolean;
  historical_cramping: boolean;
  total_workouts_logged: number;
}
