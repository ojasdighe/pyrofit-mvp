import {
  CalculatedHourlyTargets,
  FuelProduct,
  TelemetryPayload,
  WorkoutInputVector,
} from '../types/pyrofit';
import { sqliteEngine } from './sqliteEngine';

const TELEMETRY_STORAGE_KEY = 'pyrofit_telemetry_events_v1';
const ATHLETE_PROFILE_KEY = 'pyrofit_athlete_profile_v1';

export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `evt_${crypto.randomUUID()}`;
  }
  return `evt_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
};

export const getOrCreateAthleteId = (): string => {
  try {
    const existing = localStorage.getItem('pyrofit_athlete_id');
    if (existing) return existing;
    const newId = `ath_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString().slice(-4)}`;
    localStorage.setItem('pyrofit_athlete_id', newId);
    return newId;
  } catch {
    return 'ath_default_user';
  }
};

/**
 * Load all stored telemetry events
 */
export const getStoredTelemetryEvents = (): TelemetryPayload[] => {
  try {
    const raw = localStorage.getItem(TELEMETRY_STORAGE_KEY);
    if (!raw) {
      // Seed with sample manufacturer outbound leads for realistic analytics view
      const sampleEvents: TelemetryPayload[] = [
        {
          click_id: 'evt_sample_01',
          athlete_id: 'ath_mumbai_marathon_09',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          product_metadata: {
            product_id: 'prod_m1',
            brand_name: 'Maurten',
            product_name: 'GEL 100',
            tier: 'L1',
            official_target_url: 'https://www.maurten.com/products/gel-100',
          },
          workout_context: {
            duration_mins: 150,
            intensity: 'HIGH',
            temperature_celsius: 31.5,
            environmental_factor_E: 1.4,
            cramping_history_flag: false,
          },
          calculated_targets: {
            carbs_hourly_g: 90,
            sodium_hourly_mg: 560,
            fluids_hourly_ml: 700,
          },
        },
        {
          click_id: 'evt_sample_02',
          athlete_id: 'ath_bangalore_ultra_22',
          timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
          product_metadata: {
            product_id: 'prod_u1',
            brand_name: 'Unived',
            product_name: 'Elite Energy Gel',
            tier: 'L1',
            official_target_url: 'https://www.unived.in/product/unived-elite-energy-gel/',
          },
          workout_context: {
            duration_mins: 120,
            intensity: 'MID',
            temperature_celsius: 27.0,
            environmental_factor_E: 1.2,
            cramping_history_flag: true,
          },
          calculated_targets: {
            carbs_hourly_g: 60,
            sodium_hourly_mg: 680,
            fluids_hourly_ml: 600,
          },
        },
        {
          click_id: 'evt_sample_03',
          athlete_id: 'ath_delhi_half_55',
          timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
          product_metadata: {
            product_id: 'prod_f2',
            brand_name: 'Fast&Up',
            product_name: 'Reload Hydration',
            tier: 'L2',
            official_target_url: 'https://www.fastandup.in/products/reload-electrolyte-drink',
          },
          workout_context: {
            duration_mins: 90,
            intensity: 'HIGH',
            temperature_celsius: 33.0,
            environmental_factor_E: 1.4,
            cramping_history_flag: true,
          },
          calculated_targets: {
            carbs_hourly_g: 36,
            sodium_hourly_mg: 760,
            fluids_hourly_ml: 700,
          },
        },
      ];
      localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(sampleEvents));
      return sampleEvents;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading telemetry storage', err);
    return [];
  }
};

/**
 * Handle outbound referral link click with logging
 */
export const handleOutboundManufacturerClick = (
  product: FuelProduct,
  input: WorkoutInputVector,
  targets: CalculatedHourlyTargets,
  athleteId: string
): TelemetryPayload => {
  // 1. Prohibit marketplace links - enforce direct official manufacturer stores
  const blockedHosts = ['amazon', 'flipkart', 'myntra', 'snapdeal'];
  const isMarketplace = blockedHosts.some((h) => product.official_url.toLowerCase().includes(h));
  if (isMarketplace) {
    throw new Error('Violation: 3rd-party marketplace links are strictly prohibited by Pyrofit protocol.');
  }

  // 2. Build JSON telemetry payload exactly per Section 5 schema
  const payload: TelemetryPayload = {
    click_id: generateUUID(),
    athlete_id: athleteId,
    timestamp: new Date().toISOString(),
    product_metadata: {
      product_id: product.id,
      brand_name: product.brand,
      product_name: product.name,
      tier: product.tier,
      official_target_url: product.official_url,
    },
    workout_context: {
      duration_mins: input.workout_duration_mins,
      intensity: input.intensity_level,
      temperature_celsius: input.temperature_celsius,
      environmental_factor_E: targets.environmental_factor_E,
      cramping_history_flag: input.cramping_history,
    },
    calculated_targets: {
      carbs_hourly_g: targets.carbs_hourly_g,
      sodium_hourly_mg: targets.sodium_hourly_mg,
      fluids_hourly_ml: targets.fluids_hourly_ml,
    },
  };

  // 3. Persist locally
  try {
    const existing = getStoredTelemetryEvents();
    const updated = [payload, ...existing];
    localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to persist telemetry payload locally', e);
  }

  // 3b. Also write into SQLite engine
  try {
    sqliteEngine.logTelemetryEvent(payload);
  } catch {}

  // 4. Open external browser intent navigating directly to official_url
  if (typeof window !== 'undefined') {
    window.open(product.official_url, '_blank', 'noopener,noreferrer');
  }

  return payload;
};

/**
 * Clear or reset telemetry events
 */
export const clearTelemetryEvents = () => {
  try {
    localStorage.removeItem(TELEMETRY_STORAGE_KEY);
  } catch {}
};
