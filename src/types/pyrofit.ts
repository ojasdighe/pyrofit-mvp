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

export interface PostWorkoutFeedbackEntry {
  feedback_id: string;
  timestamp: string;
  workout_duration_mins: number;
  intensity: IntensityLevel;
  outcome: FeedbackOutcome;
  adjustments_applied: string[];
}
