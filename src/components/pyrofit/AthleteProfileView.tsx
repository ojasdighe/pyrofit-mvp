/**
 * PYROFIT MVP — Full Athlete Fueling Profile View
 * Author: Ojas Ulhas Dighe
 * Date: 2026-11-15
 * Description: Profile setup covering physical details, GI sensitivity, dietary exclusions, anti-doping filters,
 *              race targets, and self-service AI Sports Scientist configuration (OpenAI, Gemini, Anthropic, Mistral).
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Activity,
  Beaker,
  ShieldCheck,
  Settings2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Bot,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import {
  FullAthleteProfile,
  Sport,
  Experience,
  Goal,
  GISensitivity,
  Diet,
  Allergen,
  CaffeineUse,
  BrandOriginPref,
  TrainingPhase,
  ProductTier,
} from '../../types/pyrofit';
import { getOrCreateAthleteId } from '../../lib/telemetryLogger';
import { sqliteEngine } from '../../lib/sqliteEngine';
import { aiConfigManager, PROVIDER_DEFAULTS, type AIProvider } from '../../lib/aiConfig';

// ── AI Config Card ────────────────────────────────────────────────────────────

function AIConfigCard() {
  const [provider, setProvider] = useState<AIProvider>(() => aiConfigManager.getConfig().provider);
  const [apiKey, setApiKey] = useState(() => aiConfigManager.getConfig().apiKey ?? '');
  const [baseURL, setBaseURL] = useState(() => aiConfigManager.getConfig().baseURL ?? '');
  const [model, setModel] = useState(() => aiConfigManager.getConfig().model ?? '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleProviderChange = (p: AIProvider) => {
    setProvider(p);
    const defaults = PROVIDER_DEFAULTS[p];
    setBaseURL(defaults.baseURL ?? '');
    setModel(defaults.model ?? '');
    if (p !== 'custom' && p !== 'freellm') setApiKey('');
  };

  const handleSave = () => {
    aiConfigManager.setConfig({ provider, apiKey, baseURL, model });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isConfigured = aiConfigManager.isConfigured() && provider !== 'freellm';

  return (
    <div className="border-t border-border pt-8 mt-4">
      <div className={sectionHeaderCls}>
        <Bot className="w-4 h-4" /> AI SPORTS SCIENTIST — API CONFIGURATION
      </div>
      <div className="p-5 bg-surface border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-fg text-sm font-space font-bold">AI Copilot Provider</div>
            <div className="text-faint text-xs font-light mt-0.5">
              Powers the AI Sports Scientist chat and race-day briefings. Without a key, pre-written scientific fallbacks are used — no functionality is lost.
            </div>
          </div>
          <span className={`text-[10px] font-space uppercase px-2 py-0.5 border ${
            isConfigured
              ? 'text-strava border-strava/40 bg-strava/10'
              : 'text-faint border-border bg-carbon'
          }`}>
            {isConfigured ? '● Connected' : '○ Fallback mode'}
          </span>
        </div>

        {/* Provider selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(['openai', 'gemini', 'anthropic', 'mistral', 'custom'] as AIProvider[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleProviderChange(p)}
              className={`px-3 py-2 text-[11px] font-space uppercase tracking-wider border transition-colors ${
                provider === p
                  ? 'border-strava bg-strava/10 text-strava font-bold'
                  : 'border-border text-muted hover:border-strava/40 hover:text-fg'
              }`}
            >
              {p === 'openai' ? 'OpenAI' : p === 'gemini' ? 'Gemini' : p === 'anthropic' ? 'Anthropic' : p === 'mistral' ? 'Mistral' : 'Custom'}
            </button>
          ))}
        </div>

        {/* API Key */}
        <div>
          <label className="block text-xs font-space text-faint uppercase tracking-wider mb-1.5">API Key</label>
          <div className="flex gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === 'openai' ? 'sk-...' : provider === 'gemini' ? 'AIza...' : provider === 'anthropic' ? 'sk-ant-...' : 'Your API key'}
              className="flex-1 bg-carbon border border-border px-3 py-2 text-xs font-space text-fg focus:border-strava outline-none placeholder:text-faint"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="px-3 border border-border text-faint hover:text-fg transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Base URL — shown for custom */}
        {provider === 'custom' && (
          <div>
            <label className="block text-xs font-space text-faint uppercase tracking-wider mb-1.5">Base URL</label>
            <input
              type="text"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="https://your-api.com/v1"
              className="w-full bg-carbon border border-border px-3 py-2 text-xs font-space text-fg focus:border-strava outline-none placeholder:text-faint"
            />
          </div>
        )}

        {/* Model */}
        <div>
          <label className="block text-xs font-space text-faint uppercase tracking-wider mb-1.5">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={PROVIDER_DEFAULTS[provider]?.model ?? 'model name'}
            className="w-full bg-carbon border border-border px-3 py-2 text-xs font-space text-fg focus:border-strava outline-none placeholder:text-faint"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-[10px] font-space text-faint leading-relaxed max-w-sm">
            Key stored in localStorage only. Never transmitted to Pyrofit servers. Calls go directly to the provider.
          </div>
          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-5 py-2 text-xs font-space uppercase tracking-wider font-bold transition-colors ${
              saved
                ? 'bg-strava/20 text-strava border border-strava/40'
                : 'bg-strava text-on-brand hover:bg-white'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            {saved ? 'Saved ✓' : 'Save Config'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Profile Completeness Helper ──────────────────────────────────────────────

export function computeProfileCompleteness(p: Partial<FullAthleteProfile>): number {
  const fields: (keyof FullAthleteProfile)[] = [
    'sport', 'experience', 'goal', 'weight_kg', 'gi_sensitivity',
    'diet', 'caffeine_use', 'brand_origin_pref', 'budget_tier',
    'anti_doping_status', 'weekly_volume_hrs', 'training_phase',
  ];
  // allergies counts as filled if array exists (even empty = conscious choice)
  const allergyFilled = Array.isArray(p.allergies);
  const filled = fields.filter((f) => {
    const v = p[f];
    return v !== undefined && v !== null && v !== '';
  }).length + (allergyFilled ? 1 : 0);
  return Math.round((filled / (fields.length + 1)) * 100);
}

export function getMissingProfileFields(p: Partial<FullAthleteProfile>): string[] {
  const fieldMap: { key: keyof FullAthleteProfile; label: string }[] = [
    { key: 'sport', label: 'Sport' },
    { key: 'experience', label: 'Experience Level' },
    { key: 'goal', label: 'Primary Goal' },
    { key: 'weight_kg', label: 'Body Weight' },
    { key: 'gi_sensitivity', label: 'GI Sensitivity' },
    { key: 'diet', label: 'Diet Type' },
    { key: 'caffeine_use', label: 'Caffeine Tolerance' },
    { key: 'brand_origin_pref', label: 'Brand Preference' },
    { key: 'budget_tier', label: 'Budget Tier' },
    { key: 'anti_doping_status', label: 'Anti-Doping Status' },
    { key: 'weekly_volume_hrs', label: 'Weekly Training Volume' },
    { key: 'training_phase', label: 'Training Phase' },
  ];
  const missing: string[] = fieldMap
    .filter(({ key }) => {
      const v = p[key];
      return v === undefined || v === null || v === '';
    })
    .map(({ label }) => label);
  if (!Array.isArray(p.allergies)) {
    missing.push('Allergies (confirm even if none)');
  }
  return missing;
}

// ── Props ────────────────────────────────────────────────────────────────────

interface AthleteProfileViewProps {
  initialProfile?: FullAthleteProfile | null;
  onProfileSaved: (profile: FullAthleteProfile) => void;
}

// ── Shared style helpers ─────────────────────────────────────────────────────

const sectionHeaderCls =
  'text-strava font-space text-[10px] tracking-[0.4em] uppercase font-bold flex items-center gap-2 mb-3';

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 text-left border transition-all text-xs font-space ${
        active
          ? 'border-strava bg-strava/10 ring-1 ring-strava text-fg font-bold'
          : 'border-border bg-carbon text-muted hover:border-border-bright hover:text-fg'
      }`}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-space tracking-[0.3em] uppercase text-muted mb-1.5">
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  className = '',
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === '' ? undefined : parseFloat(raw));
      }}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      className={`bg-carbon border border-border px-4 py-2 text-fg font-space text-sm focus:border-strava outline-none ${className}`}
    />
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export const AthleteProfileView: React.FC<AthleteProfileViewProps> = ({
  initialProfile,
  onProfileSaved,
}) => {
  const athlete_id = getOrCreateAthleteId();

  // ── Section A ──
  const [sport, setSport] = useState<Sport>(initialProfile?.sport ?? 'Running');
  const [experience, setExperience] = useState<Experience>(initialProfile?.experience ?? 'Intermediate');
  const [goal, setGoal] = useState<Goal>(initialProfile?.goal ?? 'Finish');

  // ── Section B ──
  const [weight_kg, setWeightKg] = useState<number>(initialProfile?.weight_kg ?? 70);
  const [sweat_rate, setSweatRate] = useState<number | undefined>(initialProfile?.sweat_rate_l_hr);
  const [gi_sensitivity, setGiSensitivity] = useState<GISensitivity>(
    initialProfile?.gi_sensitivity ?? 'None'
  );
  const [medHypertension, setMedHypertension] = useState<boolean>(
    initialProfile?.medical_flags?.hypertension ?? false
  );
  const [medDiabetes, setMedDiabetes] = useState<boolean>(
    initialProfile?.medical_flags?.diabetes ?? false
  );
  const [medRenal, setMedRenal] = useState<boolean>(
    initialProfile?.medical_flags?.renal ?? false
  );
  const [medNotes, setMedNotes] = useState<string>(
    initialProfile?.medical_flags?.notes ?? ''
  );

  // ── Section C ──
  const [diet, setDiet] = useState<Diet>(initialProfile?.diet ?? 'Omnivore');
  const [allergies, setAllergies] = useState<Allergen[]>(initialProfile?.allergies ?? []);
  const [caffeine_use, setCaffeineUse] = useState<CaffeineUse>(
    initialProfile?.caffeine_use ?? 'None'
  );
  const [anti_doping_status, setAntiDopingStatus] = useState<
    FullAthleteProfile['anti_doping_status']
  >(initialProfile?.anti_doping_status ?? 'Recreational');

  // ── Section D ──
  const [brand_origin_pref, setBrandOriginPref] = useState<BrandOriginPref>(
    initialProfile?.brand_origin_pref ?? 'ALL'
  );
  const [budget_tier, setBudgetTier] = useState<ProductTier>(
    initialProfile?.budget_tier ?? 'ALL'
  );
  const [currentSuppsRaw, setCurrentSuppsRaw] = useState<string>(
    (initialProfile?.current_supplements ?? []).join(', ')
  );

  // ── Section E ──
  const [weekly_volume_hrs, setWeeklyVolume] = useState<number>(
    initialProfile?.weekly_volume_hrs ?? 5
  );
  const [training_phase, setTrainingPhase] = useState<TrainingPhase>(
    initialProfile?.training_phase ?? 'Base'
  );
  const [event_date, setEventDate] = useState<string>(initialProfile?.event_date ?? '');
  const [event_distance_km, setEventDistanceKm] = useState<number | undefined>(
    initialProfile?.event_distance_km
  );
  const [sleep_hrs, setSleepHrs] = useState<number | undefined>(initialProfile?.sleep_hrs);
  const [recovery_score, setRecoveryScore] = useState<number>(
    initialProfile?.recovery_score ?? 7
  );
  const [fatigue_score, setFatigueScore] = useState<number>(
    initialProfile?.fatigue_score ?? 3
  );

  // ── UI state ──
  const [saved, setSaved] = useState(false);

  // Build a partial profile for the completeness badge
  const partial: Partial<FullAthleteProfile> = {
    sport, experience, goal, weight_kg, gi_sensitivity, diet, allergies,
    caffeine_use, brand_origin_pref, budget_tier, anti_doping_status,
    weekly_volume_hrs, training_phase,
  };
  const completeness = computeProfileCompleteness(partial);
  const missingFields = getMissingProfileFields(partial);

  // ── Save handler ─────────────────────────────────────────────────────────

  const handleSave = () => {
    const profile: FullAthleteProfile = {
      athlete_id,
      sport,
      experience,
      goal,
      weight_kg,
      sweat_rate_l_hr: sweat_rate,
      gi_sensitivity,
      diet,
      allergies,
      current_supplements: currentSuppsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      caffeine_use,
      brand_origin_pref,
      budget_tier,
      anti_doping_status,
      medical_flags: {
        hypertension: medHypertension,
        diabetes: medDiabetes,
        renal: medRenal,
        notes: medNotes,
      },
      weekly_volume_hrs,
      training_phase,
      event_date: event_date || undefined,
      event_distance_km,
      sleep_hrs,
      recovery_score,
      fatigue_score,
      carb_multiplier: initialProfile?.carb_multiplier ?? 1.0,
      sodium_multiplier: initialProfile?.sodium_multiplier ?? 1.0,
      filter_isotonic_only: initialProfile?.filter_isotonic_only ?? false,
      historical_cramping: initialProfile?.historical_cramping ?? false,
      total_workouts_logged: initialProfile?.total_workouts_logged ?? 0,
    };

    // 1. Persist to localStorage
    localStorage.setItem('pyrofit_full_profile_v2', JSON.stringify(profile));

    // 2. Sync to SQLite engine
    sqliteEngine.syncAthleteProfile({
      athlete_id: profile.athlete_id,
      athlete_weight_kg: profile.weight_kg,
      carb_multiplier: profile.carb_multiplier,
      sodium_multiplier: profile.sodium_multiplier,
      filter_isotonic_only: profile.filter_isotonic_only,
      historical_cramping: profile.historical_cramping,
      total_workouts_logged: profile.total_workouts_logged,
    });

    // 3. Callback
    onProfileSaved(profile);

    // 4. Show success banner briefly
    setSaved(true);
    setTimeout(() => setSaved(false), 5000);
  };

  // ── Allergen toggle ───────────────────────────────────────────────────────

  const toggleAllergen = (a: Allergen) => {
    setAllergies((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const anyMedFlag = medHypertension || medDiabetes || medRenal;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header with completeness badge */}
      <div className="bg-surface border border-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className={sectionHeaderCls}>
            <User className="w-4 h-4" />
            ATHLETE PROFILE
          </div>
          <h2 className="italic-heavy text-2xl md:text-3xl text-fg mt-1">
            FUELING <span className="text-strava">PROFILE SETUP</span>
          </h2>
          <p className="text-muted text-xs font-light mt-1">
            Complete your profile to unlock personalised carb, sodium, and hydration targets.
          </p>
        </div>

        {/* Completeness badge */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div
            className={`text-3xl font-black font-space ${
              completeness >= 80
                ? 'text-strava'
                : completeness >= 50
                ? 'text-[#FFA500]'
                : 'text-[#FF4444]'
            }`}
          >
            {completeness}%
          </div>
          <div className="text-[10px] font-space tracking-[0.3em] uppercase text-muted">
            Profile Complete
          </div>
          <div className="w-32 h-1.5 bg-carbon border border-border mt-1">
            <div
              className={`h-full transition-all ${
                completeness >= 80
                  ? 'bg-strava'
                  : completeness >= 50
                  ? 'bg-[#FFA500]'
                  : 'bg-[#FF4444]'
              }`}
              style={{ width: `${completeness}%` }}
            />
          </div>
          {completeness < 100 && missingFields.length > 0 && (
            <div className="mt-2 text-left">
              <div className="text-[9px] font-space text-faint uppercase tracking-wider mb-1">Still needed:</div>
              <ul className="space-y-0.5">
                {missingFields.slice(0, 4).map((f) => (
                  <li key={f} className="text-[10px] font-space text-muted flex items-center gap-1">
                    <span className="text-red-400">○</span> {f}
                  </li>
                ))}
                {missingFields.length > 4 && (
                  <li className="text-[10px] font-space text-faint">+{missingFields.length - 4} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── Section A — Identity & Sport ── */}
      <div className="bg-surface border border-border p-6 space-y-4">
        <div className={sectionHeaderCls}>
          <Activity className="w-4 h-4" />
          A — IDENTITY &amp; SPORT
        </div>

        {/* Sport */}
        <div>
          <FieldLabel>Sport</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(['Running', 'Cycling', 'Triathlon', 'Trail', 'Other'] as Sport[]).map((s) => (
              <OptionButton key={s} active={sport === s} onClick={() => setSport(s)}>
                {s}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <FieldLabel>Experience Level</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {(['Beginner', 'Intermediate', 'Elite'] as Experience[]).map((e) => (
              <OptionButton key={e} active={experience === e} onClick={() => setExperience(e)}>
                {e}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div>
          <FieldLabel>Primary Goal</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Finish', 'PR / Time Target', 'Base Building', 'Recovery'] as Goal[]).map((g) => (
              <OptionButton key={g} active={goal === g} onClick={() => setGoal(g)}>
                {g}
              </OptionButton>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section B — Body & Physiology ── */}
      <div className="bg-surface border border-border p-6 space-y-4">
        <div className={sectionHeaderCls}>
          <Beaker className="w-4 h-4" />
          B — BODY &amp; PHYSIOLOGY
        </div>

        {/* Weight */}
        <div>
          <FieldLabel>Body Weight (kg)</FieldLabel>
          <NumberInput
            value={weight_kg}
            onChange={(v) => setWeightKg(v ?? 70)}
            min={35}
            max={140}
            className="w-32"
          />
        </div>

        {/* Sweat rate */}
        <div>
          <FieldLabel>
            Custom Sweat Rate (l/hr) — overrides fluid formula when set
          </FieldLabel>
          <NumberInput
            value={sweat_rate}
            onChange={setSweatRate}
            min={0.3}
            max={3.0}
            step={0.1}
            placeholder="e.g. 1.2"
            className="w-36"
          />
        </div>

        {/* GI Sensitivity */}
        <div>
          <FieldLabel>GI Sensitivity</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {(['None', 'Mild', 'Severe / Bloating'] as GISensitivity[]).map((g) => (
              <OptionButton key={g} active={gi_sensitivity === g} onClick={() => setGiSensitivity(g)}>
                {g === 'Severe / Bloating' ? 'Sensitive Gut' : g}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Medical flags */}
        <div>
          <FieldLabel>Medical Flags</FieldLabel>
          <div className="flex flex-wrap gap-4 mb-3">
            {[
              { label: 'Hypertension', val: medHypertension, set: setMedHypertension },
              { label: 'Diabetes', val: medDiabetes, set: setMedDiabetes },
              { label: 'Renal', val: medRenal, set: setMedRenal },
            ].map(({ label, val, set }) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={val}
                  onChange={(e) => set(e.target.checked)}
                  className="accent-strava w-4 h-4"
                />
                <span className="text-xs font-space text-muted">{label}</span>
              </label>
            ))}
          </div>

          {anyMedFlag && (
            <div className="flex items-start gap-2 bg-[#FFA500]/10 border border-[#FFA500]/40 p-3 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#FFA500] shrink-0 mt-0.5" />
              <p className="text-[11px] font-space text-[#FFA500]">
                ⚠️ Medical flags active — consult your sports physician before modifying fueling protocols.
              </p>
            </div>
          )}

          <textarea
            value={medNotes}
            onChange={(e) => setMedNotes(e.target.value)}
            rows={2}
            placeholder="Additional notes (optional)…"
            className="w-full bg-carbon border border-border px-3 py-2 text-xs font-space text-fg focus:border-strava outline-none resize-none placeholder:text-faint"
          />
        </div>
      </div>

      {/* ── Section C — Dietary & Safety ── */}
      <div className="bg-surface border border-border p-6 space-y-4">
        <div className={sectionHeaderCls}>
          <ShieldCheck className="w-4 h-4" />
          C — DIETARY &amp; SAFETY
        </div>

        {/* Diet */}
        <div>
          <FieldLabel>Diet Type</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Omnivore', 'Vegetarian', 'Vegan', 'Jain'] as Diet[]).map((d) => (
              <OptionButton key={d} active={diet === d} onClick={() => setDiet(d)}>
                {d}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <FieldLabel>Allergies / Intolerances</FieldLabel>
          <div className="flex flex-wrap gap-3">
            {(['Dairy', 'Soy', 'Gluten', 'Nuts', 'Caffeine'] as Allergen[]).map((a) => (
              <label key={a} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allergies.includes(a)}
                  onChange={() => toggleAllergen(a)}
                  className="accent-strava w-4 h-4"
                />
                <span className="text-xs font-space text-muted">{a}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Caffeine use */}
        <div>
          <FieldLabel>Caffeine Tolerance</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['None', 'Low', 'Moderate', 'High'] as CaffeineUse[]).map((c) => (
              <OptionButton key={c} active={caffeine_use === c} onClick={() => setCaffeineUse(c)}>
                {c}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Anti-doping */}
        <div>
          <FieldLabel>Anti-Doping Status</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                'Recreational',
                'Tested / WADA-Informed Choice Only',
              ] as FullAthleteProfile['anti_doping_status'][]
            ).map((s) => (
              <OptionButton key={s} active={anti_doping_status === s} onClick={() => setAntiDopingStatus(s)}>
                {s}
              </OptionButton>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section D — Preferences & Budget ── */}
      <div className="bg-surface border border-border p-6 space-y-4">
        <div className={sectionHeaderCls}>
          <Settings2 className="w-4 h-4" />
          D — PREFERENCES &amp; BUDGET
        </div>

        {/* Brand origin */}
        <div>
          <FieldLabel>Brand Origin Preference</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'ALL' as BrandOriginPref, label: 'ALL' },
                { id: 'DOMESTIC_INDIA' as BrandOriginPref, label: '🇮🇳 India Only' },
                { id: 'INTERNATIONAL' as BrandOriginPref, label: '🌐 International' },
              ]
            ).map(({ id, label }) => (
              <OptionButton key={id} active={brand_origin_pref === id} onClick={() => setBrandOriginPref(id)}>
                {label}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Budget tier */}
        <div>
          <FieldLabel>Budget Tier</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { id: 'ALL' as ProductTier, label: 'ALL' },
                { id: 'L1' as ProductTier, label: 'L1: Premium Scientific' },
                { id: 'L2' as ProductTier, label: 'L2: Balanced Performance' },
                { id: 'L3' as ProductTier, label: 'L3: Value Essential' },
              ]
            ).map(({ id, label }) => (
              <OptionButton key={id} active={budget_tier === id} onClick={() => setBudgetTier(id)}>
                {label}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Current supplements */}
        <div>
          <FieldLabel>Current Supplements (comma-separated)</FieldLabel>
          <input
            type="text"
            value={currentSuppsRaw}
            onChange={(e) => setCurrentSuppsRaw(e.target.value)}
            placeholder="e.g. Creatine, Vitamin D, Omega-3"
            className="w-full bg-carbon border border-border px-4 py-2 text-xs font-space text-fg focus:border-strava outline-none placeholder:text-faint"
          />
        </div>
      </div>

      {/* ── Section E — Training Cycle ── */}
      <div className="bg-surface border border-border p-6 space-y-4">
        <div className={sectionHeaderCls}>
          <Calendar className="w-4 h-4" />
          E — TRAINING CYCLE
        </div>

        {/* Weekly volume */}
        <div>
          <FieldLabel>Weekly Training Volume (hrs)</FieldLabel>
          <NumberInput
            value={weekly_volume_hrs}
            onChange={(v) => setWeeklyVolume(v ?? 5)}
            min={1}
            max={40}
            className="w-28"
          />
        </div>

        {/* Training phase */}
        <div>
          <FieldLabel>Training Phase</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(['Base', 'Build', 'Peak', 'Taper', 'Race'] as TrainingPhase[]).map((p) => (
              <OptionButton key={p} active={training_phase === p} onClick={() => setTrainingPhase(p)}>
                {p}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Event date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Target Event Date (optional)</FieldLabel>
            <input
              type="date"
              value={event_date}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-carbon border border-border px-4 py-2 text-xs font-space text-fg focus:border-strava outline-none"
            />
          </div>

          <div>
            <FieldLabel>Event Distance (km, optional)</FieldLabel>
            <NumberInput
              value={event_distance_km}
              onChange={setEventDistanceKm}
              min={1}
              max={300}
              placeholder="e.g. 42.2"
              className="w-36"
            />
          </div>
        </div>

        {/* Sleep */}
        <div>
          <FieldLabel>Average Sleep (hrs, optional)</FieldLabel>
          <NumberInput
            value={sleep_hrs}
            onChange={setSleepHrs}
            min={3}
            max={12}
            step={0.5}
            placeholder="e.g. 7.5"
            className="w-28"
          />
        </div>

        {/* Recovery score slider */}
        <div>
          <FieldLabel>Recovery Score: {recovery_score} / 10</FieldLabel>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={recovery_score}
            onChange={(e) => setRecoveryScore(parseInt(e.target.value, 10))}
            className="w-full accent-strava cursor-pointer h-2 bg-carbon"
          />
          <div className="flex justify-between text-[10px] font-space text-faint mt-1">
            <span>1 (Very Low)</span>
            <span>10 (Fully Recovered)</span>
          </div>
        </div>

        {/* Fatigue score slider */}
        <div>
          <FieldLabel>Fatigue Score: {fatigue_score} / 10</FieldLabel>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={fatigue_score}
            onChange={(e) => setFatigueScore(parseInt(e.target.value, 10))}
            className="w-full accent-strava cursor-pointer h-2 bg-carbon"
          />
          <div className="flex justify-between text-[10px] font-space text-faint mt-1">
            <span>1 (Fresh)</span>
            <span>10 (Heavily Fatigued)</span>
          </div>
        </div>
      </div>

      {/* ── Save banner + CTA ── */}
      {saved && (
        <div className="flex items-center gap-2 bg-strava/10 border border-strava/40 px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-strava shrink-0" />
          <p className="text-[11px] font-space text-strava font-bold">
            ✓ Profile saved — your fueling recommendations are now personalized.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="bg-strava italic-heavy text-on-brand py-3 px-10 text-sm font-black shadow-[0_8px_30px_rgba(255,107,26,0.25)] hover:shadow-[0_12px_40px_rgba(255,107,26,0.4)] hover:bg-white transition-all"
        >
          SAVE PROFILE
        </button>
      </div>

      {/* ── AI Copilot Configuration ───────────────────────────────────────── */}
      <AIConfigCard />
    </div>
  );
};
