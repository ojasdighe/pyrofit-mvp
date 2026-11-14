/**
 * Pyrofit AI Sports Nutritionist & Copilot Service
 * Powered by FreeLLMAPI at http://localhost:3001/v1
 * Key: freellmapi-764e617a1de0fe333524b98de87ef1218cbb3b29681d7550
 */

import {
  AthleteProfileState,
  CalculatedHourlyTargets,
  PhaseStrategyPlan,
  WorkoutInputVector,
} from '../types/pyrofit';

// Minimal interface for the phase plan fields we actually reference
interface PhasePlanSummary {
  preWorkout?: { active?: boolean; timing?: string; carbs_target_g?: number };
  duringWorkout?: { interval_reminder?: string };
  postWorkout?: { protein_target_g?: number; carbs_target_g?: number };
  // snake_case aliases also accepted
  pre_workout?: { active?: boolean; timing_window?: string; carbs_target_g?: number };
  during_workout?: { interval_mins?: number };
  post_workout?: { protein_target_g?: number; carbs_target_g?: number };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

const API_KEY = 'freellmapi-764e617a1de0fe333524b98de87ef1218cbb3b29681d7550';
// In Vite dev server, /v1 is proxied to http://localhost:3001/v1. Fallback directly to localhost:3001 if needed.
const ENDPOINTS = [
  '/v1/chat/completions',
  'http://localhost:3001/v1/chat/completions',
];

/**
 * Low-level completion caller with retry & endpoint fallback
 */
export async function callFreeLLMAPI(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  maxTokens: number = 600
): Promise<string> {
  let lastError: any = null;

  for (const endpoint of ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'auto',
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`FreeLLMAPI responded with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content && typeof content === 'string') {
        return content.trim();
      }
    } catch (err) {
      lastError = err;
      // continue to next endpoint
    }
  }

  // If both endpoints failed (e.g. running outside of server or port mismatch), provide a sports science fallback
  console.warn('FreeLLMAPI endpoint unreachable, using scientific fallback:', lastError);
  return getFallbackScientificResponse(messages);
}

/**
 * Generate a comprehensive, personalized Race-Day Strategy Briefing
 */
export async function generateRaceDayBriefing(
  input: WorkoutInputVector,
  targets: CalculatedHourlyTargets,
  phasePlan: PhaseStrategyPlan | PhasePlanSummary,
  profile: AthleteProfileState
): Promise<string> {
  // Normalize camelCase and snake_case phase plan fields
  const preCarbs =
    (phasePlan as any).preWorkout?.carbs_target_g ??
    (phasePlan as any).pre_workout?.carbs_target_g ??
    Math.round(input.athlete_weight_kg);
  const preTiming =
    (phasePlan as any).preWorkout?.timing ??
    (phasePlan as any).pre_workout?.timing_window ??
    '45–60 min before start';
  const intervalMins =
    (phasePlan as any).duringWorkout?.interval_reminder ??
    (phasePlan as any).during_workout?.interval_mins ??
    45;
  const postProtein =
    (phasePlan as any).postWorkout?.protein_target_g ??
    (phasePlan as any).post_workout?.protein_target_g ??
    22;
  const postCarbs =
    (phasePlan as any).postWorkout?.carbs_target_g ??
    (phasePlan as any).post_workout?.carbs_target_g ??
    88;
  const systemPrompt = `You are the Lead Sports Nutritionist at Pyrofit. You provide elite, precise, and practical endurance fueling race-day briefings.
You translate exact mathematical calculations into actionable execution steps for runners and triathletes.
Be authoritative, clear, and structured. Use bullet points and bold highlights. Keep it within 350 words.`;

  const userPrompt = `Generate a personalized Race-Day Nutrition & Fueling Briefing for this athlete session:
- Duration: ${input.workout_duration_mins} minutes (${(input.workout_duration_mins / 60).toFixed(1)} hours)
- Target Intensity: ${input.intensity_level} (${targets.intensity_modifier}x multiplier)
- Ambient Temperature: ${input.temperature_celsius}°C (Environmental Factor E = ${targets.environmental_factor_E})
- Cramping History: ${input.cramping_history ? 'Yes (elevated sweat sodium loss)' : 'No'}
- Athlete Weight: ${input.athlete_weight_kg} kg
- Target Product Tier: ${input.budget_tier_preference}

Calculated Deterministic Targets:
- Hourly Carbohydrate Target: ${targets.carbs_hourly_g} g/hr
- Hourly Sodium Target: ${targets.sodium_hourly_mg} mg/hr
- Hourly Fluids Target: ${targets.fluids_hourly_ml} ml/hr
- Pre-Workout Carbs Target: ${preCarbs}g (${preTiming})
- During-Workout Rhythm: Every ${intervalMins} mins
- Post-Workout Target: ${postProtein}g protein + ${postCarbs}g carbs

Explain:
1. Why this specific hourly rate prevents the "bonk" under ${input.temperature_celsius}°C heat.
2. The exact timing rhythm (pre-load, during intervals, post-recovery).
3. Gut-comfort guidelines to maintain gastric emptying speed.`;

  return callFreeLLMAPI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], 800);
}

/**
 * Post-Workout Symptom Diagnostic Explainer
 */
export async function explainPostWorkoutSymptom(
  outcome: 'SEVERE_CRAMPING' | 'STOMACH_BLOATING' | 'ENERGY_CRASH' | 'OPTIMAL_FUELING',
  input: WorkoutInputVector,
  targets: CalculatedHourlyTargets,
  profile: AthleteProfileState
): Promise<string> {
  const systemPrompt = `You are a clinical sports physiologist specializing in endurance gastroenterology and electrolyte kinetics.
Analyze the athlete's post-workout symptom and explain why it occurred physiologically, referencing their specific workout conditions and why Pyrofit adjusted their algorithm multiplier. Keep it concise (2-3 paragraphs).`;

  const userPrompt = `The athlete completed a ${input.workout_duration_mins}-minute session at ${input.intensity_level} intensity in ${input.temperature_celsius}°C heat and logged the following outcome: ${outcome}.
Current state:
- Hourly Carbs: ${targets.carbs_hourly_g}g/hr (Multiplier: ${profile.carb_multiplier}x)
- Hourly Sodium: ${targets.sodium_hourly_mg}mg/hr (Multiplier: ${profile.sodium_multiplier}x)
- Isotonic Only Filter: ${profile.filter_isotonic_only ? 'Active' : 'Inactive'}

Explain:
1. Physiological mechanism of ${outcome} under ${input.temperature_celsius}°C conditions (sweat rates, osmolality, gastric emptying, or glycogen stores).
2. Why Pyrofit's algorithmic adjustment (${
    outcome === 'SEVERE_CRAMPING'
      ? '+15% Sodium Target'
      : outcome === 'STOMACH_BLOATING'
      ? 'Hydrogel / Isotonic Formulation Lock'
      : outcome === 'ENERGY_CRASH'
      ? '+15% Carb Hourly Target'
      : 'Baseline Validation'
  }) will prevent this on future runs.
3. One concrete tip for their next training session.`;

  return callFreeLLMAPI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], 600);
}

/**
 * General AI Sports Scientist Copilot Q&A
 */
export async function askSportsScientist(
  question: string,
  history: ChatMessage[],
  context: {
    input: WorkoutInputVector;
    targets: CalculatedHourlyTargets;
    profile: AthleteProfileState;
  }
): Promise<string> {
  const systemPrompt = `You are Pyrofit's AI Sports Scientist. You assist endurance athletes with fueling strategies, gut training, electrolyte management, hydration osmolality, and race execution.
Current athlete context:
- Duration: ${context.input.workout_duration_mins} mins
- Intensity: ${context.input.intensity_level}
- Temperature: ${context.input.temperature_celsius}°C
- Hourly Targets: ${context.targets.carbs_hourly_g}g carbs, ${context.targets.sodium_hourly_mg}mg sodium, ${context.targets.fluids_hourly_ml}ml fluids
- Adaptive multipliers: Carb ${context.profile.carb_multiplier}x, Sodium ${context.profile.sodium_multiplier}x
- Isotonic only lock: ${context.profile.filter_isotonic_only ? 'Enabled' : 'Disabled'}

Provide scientifically grounded, actionable advice. Reference actual sports science guidelines (ACSM, Jeukendrup multi-transportable carbs, sodium sweat concentration).`;

  const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  // Include last 4 messages of history
  const recentHistory = history.slice(-4);
  for (const m of recentHistory) {
    messages.push({ role: m.role, content: m.content });
  }

  messages.push({ role: 'user', content: question });

  return callFreeLLMAPI(messages, 700);
}

/**
 * Fallback response if LLM server is temporarily offline
 */
function getFallbackScientificResponse(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): string {
  const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || '';

  if (lastUserMsg.includes('cramping') || lastUserMsg.includes('severe_cramping')) {
    return `### Physiological Analysis: Sweat Sodium Deficit
Under elevated temperatures, active endurance athletes lose between 600mg to 1500mg of sodium per liter of sweat. Muscle cramping frequently occurs when fluid is replaced with low-sodium water, diluting interstitial sodium concentrations (hyponatremia risk) and causing motor neuron hyperexcitability.

**Pyrofit Action:** We have automatically increased your sodium multiplier by +15%. For your next session, prioritize electrolyte formulas delivering at least 350-500mg sodium per 500ml bottle (such as Fast&Up Reload or Unived Elite).`;
  }

  if (lastUserMsg.includes('bloating') || lastUserMsg.includes('stomach_bloating')) {
    return `### Physiological Analysis: Osmotic Shock & Delayed Gastric Emptying
Gastric emptying slows dramatically when gut osmolarity exceeds 300 mOsm/kg or when core body temperature rises. Standard hypertonic sugar solutions pull water back into the intestinal lumen, causing fullness, sloshing, and nausea.

**Pyrofit Action:** Pyrofit has locked your recommendations exclusively to Hydrogel (Maurten GEL 100) and Isotonic formulations. Hydrogel encapsulates carbohydrates inside a biopolymer pectin-alginate matrix, bypassing the stomach into the small intestine where water and carbs are absorbed without osmotic distress.`;
  }

  if (lastUserMsg.includes('crash') || lastUserMsg.includes('energy_crash')) {
    return `### Physiological Analysis: Hepatic & Skeletal Glycogen Depletion
The human liver and skeletal muscle store approximately 400-500g of glycogen (1600-2000 kcal). At moderate-to-high intensity, carbohydrate oxidation rates reach 2.0g to 3.0g per minute. An energy crash (the "bonk") signals that exogenous carbohydrate intake fell below oxidation demand.

**Pyrofit Action:** We have increased your hourly carbohydrate target by +15%. Maintain a strict 40-minute fueling cadence to ensure a steady glucose flux to your active muscle beds.`;
  }

  return `### Sports Science Consultation
To maximize endurance performance while protecting gastrointestinal integrity:
1. **Multi-Transportable Carbohydrates:** Combine glucose and fructose (2:1 ratio) to utilize both SGLT1 and GLUT5 intestinal transporters, enabling absorption above 60g/hr up to 90g/hr.
2. **Hydration Kinetics:** Consume fluids in 150-200ml boluses every 15-20 minutes rather than large intermittent chugs.
3. **Electrolyte Osmolality:** In high temperatures (>30°C), elevate sodium concentration to prevent plasma volume drop and early cardiac drift.`;
}
