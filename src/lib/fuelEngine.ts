import {
  AthleteProfileState,
  CalculatedHourlyTargets,
  FeedbackOutcome,
  FuelProduct,
  IntensityLevel,
  PhaseStrategyPlan,
  WorkoutInputVector,
} from '../types/pyrofit';
import { SEED_PRODUCT_CATALOG } from '../data/productCatalog';

/**
 * Environmental Factor (E) based on ambient temperature
 */
export const calculateEnvironmentalFactor = (tempCelsius: number): number => {
  if (tempCelsius < 22) {
    return 1.0; // Cool
  }
  if (tempCelsius <= 30) {
    return 1.2; // Moderate
  }
  return 1.4; // Hot / Indian Summer
};

export const getTemperatureClimateLabel = (tempCelsius: number): { label: string; badgeColor: string } => {
  if (tempCelsius < 22) {
    return { label: 'Cool Climate (<22°C)', badgeColor: 'text-sky-400 border-sky-400/40 bg-sky-400/10' };
  }
  if (tempCelsius <= 30) {
    return { label: 'Moderate Heat (22°C–30°C)', badgeColor: 'text-amber-400 border-amber-400/40 bg-amber-400/10' };
  }
  return { label: 'Extreme / Indian Summer (>30°C)', badgeColor: 'text-[#FC4C02] border-[#FC4C02]/40 bg-[#FC4C02]/10' };
};

/**
 * Intensity Modifier (I_modifier)
 */
export const getIntensityModifier = (intensity: IntensityLevel): number => {
  switch (intensity) {
    case 'LOW':
      return 0.8;
    case 'MID':
      return 1.0;
    case 'HIGH':
      return 1.2;
    default:
      return 1.0;
  }
};

/**
 * Deterministic Hourly Macro Calculations
 */
export const calculateHourlyTargets = (
  input: WorkoutInputVector,
  profile: AthleteProfileState
): CalculatedHourlyTargets => {
  const E = calculateEnvironmentalFactor(input.temperature_celsius);
  const I_mod = getIntensityModifier(input.intensity_level);
  const D = input.workout_duration_mins;
  const C = input.cramping_history || profile.historical_cramping ? 1 : 0;

  // Hourly Carbohydrates (Carbs_base)
  let carbsBase = 0;
  if (D <= 60) {
    carbsBase = 0;
  } else if (D <= 120) {
    carbsBase = 30 * I_mod;
  } else if (D <= 180) {
    carbsBase = 60 * I_mod;
  } else {
    carbsBase = 90 * I_mod;
  }

  // Multiply by ML feedback adaptive multiplier and enforce 90g/hr biological ceiling
  const rawCarbsHourly = carbsBase * (profile.carb_multiplier || 1.0);
  const carbsHourly = Math.min(rawCarbsHourly, 90);

  // Hourly Sodium
  const rawSodiumHourly = (400 * E + C * 200) * (profile.sodium_multiplier || 1.0);
  const sodiumHourly = Math.round(rawSodiumHourly);

  // Hourly Fluids
  const fluidsHourly = Math.round(500 * E);

  return {
    environmental_factor_E: E,
    intensity_modifier: I_mod,
    carbs_base_g: Math.round(carbsBase),
    carbs_hourly_g: Math.round(carbsHourly),
    sodium_hourly_mg: sodiumHourly,
    fluids_hourly_ml: fluidsHourly,
  };
};

/**
 * 3-Phase Strategy Allocation
 */
export const allocate3PhaseStrategy = (
  input: WorkoutInputVector,
  targets: CalculatedHourlyTargets,
  profile: AthleteProfileState
): PhaseStrategyPlan => {
  const weight = input.athlete_weight_kg || profile.athlete_weight_kg || 70;
  const durationHours = input.workout_duration_mins / 60;

  // Pre-Workout: Active if D > 90 mins
  const preActive = input.workout_duration_mins > 90;
  const preCarbs = preActive ? Math.round(1.0 * weight) : 0;
  const preFluids = preActive ? 300 : 0;

  // During-Workout
  const duringActive = input.workout_duration_mins > 45;
  const totalCarbsDuring = Math.round(targets.carbs_hourly_g * durationHours);
  const totalSodiumDuring = Math.round(targets.sodium_hourly_mg * durationHours);
  const totalFluidsDuring = Math.round(targets.fluids_hourly_ml * durationHours);

  // Post-Workout (Recovery Phase within 30 mins)
  // Target: 20-25g protein, 3:1 or 4:1 carb-to-protein ratio
  const proteinTarget = 22;
  const recoveryCarbs = Math.round(proteinTarget * 3.5); // ~77g

  return {
    preWorkout: {
      active: preActive,
      timing: '45–60 minutes prior to session start',
      carbs_target_g: preCarbs,
      fluids_target_ml: preFluids,
      guidance: 'Fast gastric-emptying carbs. Strictly avoid dietary fat, dairy protein, and high fiber to prevent GI distress.',
    },
    duringWorkout: {
      active: duringActive,
      timing: 'Every 40–45 minutes throughout session',
      carbs_hourly_g: targets.carbs_hourly_g,
      sodium_hourly_mg: targets.sodium_hourly_mg,
      fluids_hourly_ml: targets.fluids_hourly_ml,
      total_carbs_g: totalCarbsDuring,
      total_sodium_mg: totalSodiumDuring,
      total_fluids_ml: totalFluidsDuring,
      interval_reminder: 'Deploy 1 gel packet every 45 mins with 200–250ml electrolyte fluid.',
    },
    postWorkout: {
      active: true,
      timing: 'Within 30 minutes of session completion',
      protein_target_g: proteinTarget,
      carbs_target_g: recoveryCarbs,
      ratio: '3.5:1 Carbohydrate-to-Protein',
      guidance: 'Rapid glycogen replenishment and muscle tissue repair. Consume fast-absorbing whey isolate or vegan plant peptide matrix.',
    },
  };
};

/**
 * Filter & Recommend Products based on Macro Targets and Athlete Constraints
 */
export const getRecommendedProductPlan = (
  targets: CalculatedHourlyTargets,
  phase: PhaseStrategyPlan,
  input: WorkoutInputVector,
  profile: AthleteProfileState,
  catalog: FuelProduct[] = SEED_PRODUCT_CATALOG
): {
  preProducts: FuelProduct[];
  duringGels: FuelProduct[];
  duringHydration: FuelProduct[];
  postProducts: FuelProduct[];
  recommendedServingQty: Record<string, number>;
} => {
  // Filter by isotonic/hydrogel if bloating flag is active
  let pool = catalog;
  if (profile.filter_isotonic_only) {
    pool = pool.filter((p) =>
      ['Hydrogel', 'Isotonic Gel', 'Isotonic Powder', 'Vegan Protein + Carb'].some((type) =>
        p.formulation_type.toLowerCase().includes(type.toLowerCase())
      )
    );
  }

  // Filter by budget tier preference
  if (input.budget_tier_preference !== 'ALL') {
    pool = pool.filter((p) => p.tier === input.budget_tier_preference || p.phase === 'POST');
  }

  const preProducts = pool.filter((p) => p.phase === 'PRE');
  const duringGels = pool.filter((p) => p.phase === 'DURING' && p.carbs_g > 15);
  const duringHydration = pool.filter((p) => p.phase === 'DURING' && p.sodium_mg > 100);
  const postProducts = pool.filter((p) => p.phase === 'POST');

  // Estimate hourly serving quantities
  const servingQty: Record<string, number> = {};
  if (targets.carbs_hourly_g > 0) {
    duringGels.forEach((gel) => {
      // Calculate how many gels needed per hour to meet ~85%-115% of hourly carbs
      const qty = Math.max(1, Math.round(targets.carbs_hourly_g / (gel.carbs_g || 25)));
      servingQty[gel.id] = qty;
    });
  }

  return {
    preProducts,
    duringGels,
    duringHydration,
    postProducts,
    recommendedServingQty: servingQty,
  };
};

/**
 * Adaptive Feedback Loop State Transition (ML Logic)
 */
export const applyAdaptiveFeedback = (
  currentProfile: AthleteProfileState,
  outcome: FeedbackOutcome,
  workoutInput: WorkoutInputVector
): { updatedProfile: AthleteProfileState; appliedNotes: string[] } => {
  const updated: AthleteProfileState = { ...currentProfile };
  const appliedNotes: string[] = [];

  switch (outcome) {
    case 'CRAMPING': {
      // Auto-Adjust Sodium Target by +15% to +20% for future Mid/High sessions
      const delta = 0.15;
      updated.sodium_multiplier = parseFloat((updated.sodium_multiplier + delta).toFixed(2));
      updated.historical_cramping = true;
      appliedNotes.push(
        `Severe Cramping logged: Sodium baseline adjusted (+${Math.round(delta * 100)}%). New sodium multiplier: ${updated.sodium_multiplier.toFixed(2)}x.`
      );
      break;
    }
    case 'BLOATING': {
      // Lock product tiers to Hydrogel & Isotonic Formulations Only
      updated.filter_isotonic_only = true;
      appliedNotes.push(
        'Stomach Bloating logged: Product catalog filtered strictly to Hydrogel and Isotonic formulations to protect gut integrity.'
      );
      break;
    }
    case 'CRASH': {
      // Auto-Adjust Carb Target by +15% for matching workout profiles
      const delta = 0.15;
      updated.carb_multiplier = parseFloat((updated.carb_multiplier + delta).toFixed(2));
      appliedNotes.push(
        `Energy Crash logged: Carbohydrate fueling rate boosted (+${Math.round(delta * 100)}%). New carb multiplier: ${updated.carb_multiplier.toFixed(2)}x.`
      );
      break;
    }
    case 'OPTIMAL': {
      appliedNotes.push(
        'Optimal Fueling logged: Strategy verified. Current physiological baseline validated with zero negative gastrointestinal feedback.'
      );
      break;
    }
  }

  updated.total_workouts_logged += 1;
  return { updatedProfile: updated, appliedNotes };
};
