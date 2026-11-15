import React, { useState } from 'react';
import {
  Flame,
  Droplets,
  Zap,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  RotateCcw,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  AthleteProfileState,
  CalculatedHourlyTargets,
  FuelProduct,
  PhaseStrategyPlan,
  WorkoutInputVector,
} from '../../types/pyrofit';
import { handleOutboundManufacturerClick } from '../../lib/telemetryLogger';

interface FuelingStrategyViewProps {
  input: WorkoutInputVector;
  targets: CalculatedHourlyTargets;
  phasePlan: PhaseStrategyPlan;
  profile: AthleteProfileState;
  recommendedProducts: {
    preProducts: FuelProduct[];
    duringGels: FuelProduct[];
    duringHydration: FuelProduct[];
    postProducts: FuelProduct[];
    recommendedServingQty: Record<string, number>;
  };
  onBackToConfig: () => void;
  onOpenFeedback: () => void;
  onTelemetryRecorded: () => void;
}

export const FuelingStrategyView: React.FC<FuelingStrategyViewProps> = ({
  input,
  targets,
  phasePlan,
  profile,
  recommendedProducts,
  onBackToConfig,
  onOpenFeedback,
  onTelemetryRecorded,
}) => {
  const [clickedProductIds, setClickedProductIds] = useState<string[]>([]);
  const [lastTelemetryNotice, setLastTelemetryNotice] = useState<string | null>(null);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);

  const handleProductClick = (product: FuelProduct) => {
    try {
      const payload = handleOutboundManufacturerClick(
        product,
        input,
        targets,
        profile.athlete_id
      );
      setClickedProductIds((prev) => [...prev, product.id]);
      setLastTelemetryNotice(
        `Store visit recorded (${payload.click_id.slice(0, 16)}…) → Opening ${product.brand} official store.`
      );
      onTelemetryRecorded();
    } catch (err: any) {
      setTelemetryError(err?.message ?? 'Telemetry recording failed. Please try again.');
      setTimeout(() => setTelemetryError(null), 4000);
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'L1':
        return 'bg-amber-400/10 text-amber-400 border-amber-400/40';
      case 'L2':
        return 'bg-sky-400/10 text-sky-400 border-sky-400/40';
      case 'L3':
        return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/40';
      default:
        return 'bg-surface text-muted border-border';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Telemetry Alert Banner if clicked */}
      {lastTelemetryNotice && (
        <div className="p-3 bg-strava/10 border border-strava/30 text-xs font-space text-strava flex items-center justify-between rounded-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-strava flex-shrink-0" />
            <span>{lastTelemetryNotice}</span>
          </div>
          <span className="text-[10px] text-faint uppercase tracking-wider">
            Takes you to the brand's official store — no in-app purchase
          </span>
        </div>
      )}

      {/* Telemetry Error Banner */}
      {telemetryError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs font-space text-red-400 flex items-center gap-2">
          <span className="font-bold">⚠</span>
          <span>{telemetryError}</span>
        </div>
      )}

      {/* Screen 2 Top Metric Targets Banner */}
      <div className="bg-carbon border border-border p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="text-strava font-space text-[10px] tracking-[0.5em] uppercase mb-1 font-bold">
              YOUR FUELING TARGETS
            </div>
            <h2 className="italic-heavy text-3xl md:text-4xl text-fg">
              HOURLY FUELING <span className="text-strava">PLAN</span>
            </h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[11px] font-space px-2.5 py-1 bg-surface border border-border text-muted">
                Duration: <strong className="text-fg">{input.workout_duration_mins} mins</strong>
              </span>
              <span className="text-[11px] font-space px-2.5 py-1 bg-surface border border-border text-muted">
                Intensity: <strong className="text-strava">{input.intensity_level} ({targets.intensity_modifier}x)</strong>
              </span>
              <span className="text-[11px] font-space px-2.5 py-1 bg-surface border border-border text-muted">
                Climate: <strong className="text-fg">{input.temperature_celsius}°C (Heat Factor: {targets.environmental_factor_E}×)</strong>
              </span>
              {profile.carb_multiplier !== 1 && (
                <span className="text-[11px] font-space px-2.5 py-1 bg-strava/15 border border-strava/40 text-strava font-bold">
                  Adaptive Carb: {profile.carb_multiplier.toFixed(2)}x
                </span>
              )}
              {profile.sodium_multiplier !== 1 && (
                <span className="text-[11px] font-space px-2.5 py-1 bg-amber-400/15 border border-amber-400/40 text-amber-400 font-bold">
                  Adaptive Sodium: {profile.sodium_multiplier.toFixed(2)}x
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToConfig}
              className="px-4 py-2 border border-border bg-surface hover:text-fg text-muted text-xs font-space font-bold uppercase transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" /> Reconfigure
            </button>
            <button
              onClick={onOpenFeedback}
              className="px-4 py-2 border border-strava/40 bg-strava/10 hover:bg-strava hover:text-on-brand text-strava text-xs font-space font-bold uppercase transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Post-Workout Survey
            </button>
          </div>
        </div>

        {/* 3 Large Hourly Rate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          {/* Card 1: Carbs */}
          <div className="p-5 bg-surface border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-muted mb-2">
                <span className="text-xs font-space tracking-wider uppercase font-bold text-fg">
                  Carbohydrate Burn Rate
                </span>
                <Flame className="w-4 h-4 text-strava" />
              </div>
              <div className="text-4xl font-space font-black text-strava">
                {targets.carbs_hourly_g} <span className="text-sm text-faint">g/hr</span>
              </div>
              <div className="text-[11px] font-space text-muted mt-2">
                {targets.carbs_hourly_g === 0
                  ? 'Session ≤60 mins: Endogenous muscle glycogen stores are sufficient.'
                  : `Base ${targets.carbs_base_g}g/hr adjusted for ${input.intensity_level} effort.`}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-[10px] font-space text-faint flex justify-between">
              <span>Session Total:</span>
              <span className="font-bold text-fg">{phasePlan.duringWorkout.total_carbs_g}g total</span>
            </div>
          </div>

          {/* Card 2: Sodium */}
          <div className="p-5 bg-surface border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-muted mb-2">
                <span className="text-xs font-space tracking-wider uppercase font-bold text-fg">
                  Sodium Replenishment
                </span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-4xl font-space font-black text-amber-400">
                {targets.sodium_hourly_mg} <span className="text-sm text-faint">mg/hr</span>
              </div>
              <div className="text-[11px] font-space text-muted mt-2">
                Base 400mg × Heat Factor: {targets.environmental_factor_E}×{' '}
                {input.cramping_history ? '+ 200mg cramping buffer' : ''}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-[10px] font-space text-faint flex justify-between">
              <span>Session Total:</span>
              <span className="font-bold text-fg">{phasePlan.duringWorkout.total_sodium_mg}mg total</span>
            </div>
          </div>

          {/* Card 3: Fluids */}
          <div className="p-5 bg-surface border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-muted mb-2">
                <span className="text-xs font-space tracking-wider uppercase font-bold text-fg">
                  Hydration Target
                </span>
                <Droplets className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-4xl font-space font-black text-sky-400">
                {targets.fluids_hourly_ml} <span className="text-sm text-faint">ml/hr</span>
              </div>
              <div className="text-[11px] font-space text-muted mt-2">
                How much fluid you lose to sweat per hour at {input.temperature_celsius}°C.
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-[10px] font-space text-faint flex justify-between">
              <span>Session Total:</span>
              <span className="font-bold text-fg">{phasePlan.duringWorkout.total_fluids_ml}ml total</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-PHASE TIMELINE STRATEGY ALLOCATION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-strava font-space text-[9px] tracking-[0.5em] uppercase font-bold">
              STEP-BY-STEP PLAN
            </div>
            <h3 className="italic-heavy text-2xl md:text-3xl text-fg">
              3-PHASE <span className="text-strava">FUELING TIMELINE</span>
            </h3>
          </div>
          <span className="text-xs font-space text-faint">
            Targeted macro delivery before, during &amp; after effort
          </span>
        </div>

        {/* Phase 1: Pre-Workout (Priming) */}
        <div className="p-6 bg-carbon border border-border shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 mb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="font-space text-xs font-bold bg-surface border border-border text-strava px-2.5 py-1 uppercase">
                PHASE 01
              </span>
              <div className="italic-heavy text-xl text-fg">PRE-WORKOUT</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="italic-heavy text-sm text-strava bg-strava/10 border border-strava/30 px-3 py-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 45–60 MIN BEFORE
              </div>
              <span className="text-xs font-space text-muted">{phasePlan.preWorkout.timing}</span>
            </div>
          </div>

          {phasePlan.preWorkout.active ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-surface border border-border">
                  <div className="text-xs font-space text-faint uppercase">Carbohydrate Priming Target</div>
                  <div className="text-2xl font-space font-bold text-strava mt-1">
                    {phasePlan.preWorkout.carbs_target_g}g Carbs
                  </div>
                  <div className="text-[11px] font-space text-muted mt-1">
                    Calibrated at 1.0g per kg body weight ({input.athlete_weight_kg} kg).
                  </div>
                </div>

                <div className="p-4 bg-surface border border-border">
                  <div className="text-xs font-space text-faint uppercase">Hydration Pre-Load</div>
                  <div className="text-2xl font-space font-bold text-sky-400 mt-1">
                    {phasePlan.preWorkout.fluids_target_ml}ml Water
                  </div>
                  <div className="text-[11px] font-space text-muted mt-1">
                    Drink slowly 45 mins prior to raise cellular plasma volume.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-surface border border-border text-xs text-muted font-light leading-relaxed">
                <strong className="text-fg font-medium">Dietary Guidance:</strong> {phasePlan.preWorkout.guidance}
              </div>

              {/* Pre-workout recommended products */}
              {recommendedProducts.preProducts.length > 0 && (
                <div className="pt-2">
                  <div className="text-[10px] font-space text-faint uppercase tracking-wider mb-2">
                    Recommended Pre-Workout Fuel (Direct Manufacturer Stores)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendedProducts.preProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        servingQty={1}
                        onBuyClick={() => handleProductClick(prod)}
                        isClicked={clickedProductIds.includes(prod.id)}
                        tierBadgeClass={getTierBadge(prod.tier)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-surface border border-border text-xs font-space text-muted leading-relaxed">
              Session duration is under 90 minutes. Pre-workout carb loading is non-essential. Maintain regular hydration with normal baseline meals.
            </div>
          )}
        </div>

        {/* Phase 2: During-Workout (Sustained) */}
        <div className="p-6 bg-carbon border border-border shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 mb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="font-space text-xs font-bold bg-strava text-on-brand px-2.5 py-1 uppercase">
                PHASE 02
              </span>
              <div className="italic-heavy text-xl text-fg">DURING WORKOUT</div>
            </div>
            <div className="italic-heavy text-sm text-strava bg-strava/10 border border-strava/30 px-3 py-1 flex items-center gap-1.5 font-bold">
              <Clock className="w-3.5 h-3.5 text-strava" /> THROUGHOUT THE SESSION
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-surface border border-border flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-xs font-space text-fg font-bold uppercase">
                  Hourly Intake Protocol ({targets.carbs_hourly_g}g Carbs · {targets.sodium_hourly_mg}mg Sodium · {targets.fluids_hourly_ml}ml Fluids)
                </div>
                <div className="text-xs text-muted font-light mt-0.5">
                  {phasePlan.duringWorkout.interval_reminder}
                </div>
              </div>
              <span
                className="text-[11px] font-space text-strava border border-strava/30 bg-strava/5 px-2.5 py-1 cursor-help"
                title="Products within 15% of your carb target — no need to match exactly."
              >
                ±15% Tolerance Window Compliant
              </span>
            </div>

            {/* Recommended Products for During Workout */}
            <div>
              <div className="text-[11px] font-space text-strava uppercase tracking-wider mb-2 font-bold">
                Energy Gels &amp; Fueling (Deploy every 40–45 mins)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {recommendedProducts.duringGels.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    servingQty={recommendedProducts.recommendedServingQty[prod.id] || 1}
                    onBuyClick={() => handleProductClick(prod)}
                    isClicked={clickedProductIds.includes(prod.id)}
                    tierBadgeClass={getTierBadge(prod.tier)}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[11px] font-space text-sky-400 uppercase tracking-wider mb-2 font-bold">
                Electrolyte &amp; Hydration Solutions
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {recommendedProducts.duringHydration.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    servingQty={1}
                    onBuyClick={() => handleProductClick(prod)}
                    isClicked={clickedProductIds.includes(prod.id)}
                    tierBadgeClass={getTierBadge(prod.tier)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 3: Post-Workout (Recovery) */}
        <div className="p-6 bg-carbon border border-border shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 mb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="font-space text-xs font-bold bg-surface border border-border text-emerald-400 px-2.5 py-1 uppercase">
                PHASE 03
              </span>
              <div className="italic-heavy text-xl text-fg">POST-WORKOUT RECOVERY</div>
            </div>
            <div className="italic-heavy text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> WITHIN 30 MIN AFTER
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-surface border border-border">
                <div className="text-xs font-space text-faint uppercase">Protein Target</div>
                <div className="text-2xl font-space font-bold text-emerald-400 mt-1">
                  {phasePlan.postWorkout.protein_target_g}g Protein
                </div>
                <div className="text-[10px] font-space text-faint mt-1">Fast-absorbing isolate</div>
              </div>

              <div className="p-4 bg-surface border border-border">
                <div className="text-xs font-space text-faint uppercase">Carbohydrate Replenishment</div>
                <div className="text-2xl font-space font-bold text-strava mt-1">
                  {phasePlan.postWorkout.carbs_target_g}g Carbs
                </div>
                <div className="text-[10px] font-space text-faint mt-1">3.5:1 Carb-to-Protein ratio</div>
              </div>

              <div className="p-4 bg-surface border border-border">
                <div className="text-xs font-space text-faint uppercase">Window of Opportunity</div>
                <div className="text-lg font-space font-bold text-fg mt-1">
                  Within 30 Mins
                </div>
                <div className="text-[10px] font-space text-faint mt-1">Peak insulin sensitivity</div>
              </div>
            </div>

            <div className="p-3 bg-surface border border-border text-xs text-muted font-light leading-relaxed">
              <strong className="text-fg font-medium">Recovery Guidance:</strong> {phasePlan.postWorkout.guidance}
            </div>

            {/* Post-Workout recommended products */}
            {recommendedProducts.postProducts.length > 0 && (
              <div className="pt-2">
                <div className="text-[10px] font-space text-faint uppercase tracking-wider mb-2">
                  Recovery Product (Direct Official Manufacturer Store)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendedProducts.postProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      servingQty={1}
                      onBuyClick={() => handleProductClick(prod)}
                      isClicked={clickedProductIds.includes(prod.id)}
                      tierBadgeClass={getTierBadge(prod.tier)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: FuelProduct;
  servingQty: number;
  onBuyClick: () => void;
  isClicked: boolean;
  tierBadgeClass: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  servingQty,
  onBuyClick,
  isClicked,
  tierBadgeClass,
}) => {
  return (
    <div className="p-4 bg-surface border border-border flex flex-col justify-between hover:border-strava/40 transition-all group">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-space font-bold text-strava uppercase tracking-widest">
            {product.brand}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-space px-2 py-0.5 border font-bold uppercase ${tierBadgeClass}`}>
              {product.tier}
            </span>
            <span className="text-[9px] font-space px-2 py-0.5 bg-carbon text-faint border border-border">
              ₹{product.price_inr}
            </span>
          </div>
        </div>

        <h4 className="italic-heavy text-lg text-fg group-hover:text-strava transition-colors leading-snug">
          {product.name}
        </h4>

        <div className="text-[10px] font-space text-muted mt-0.5 mb-3">
          {product.formulation_type} · {product.tag}
        </div>

        {/* Nutritional Specs */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-carbon border border-border text-center text-xs font-space mb-4">
          <div>
            <div className="text-faint text-[9px]">Carbs</div>
            <div className="font-bold text-fg">{product.carbs_g}g</div>
          </div>
          <div>
            <div className="text-faint text-[9px]">Sodium</div>
            <div className="font-bold text-amber-400">{product.sodium_mg}mg</div>
          </div>
          <div>
            <div className="text-faint text-[9px]">Protein</div>
            <div className="font-bold text-emerald-400">{product.protein_g}g</div>
          </div>
        </div>
      </div>

      <div>
        {servingQty > 1 && (
          <div className="text-[10px] font-space text-strava/80 mb-2">
            Target Pace: ~{servingQty} servings / hour
          </div>
        )}

        {/* Prominent Outbound Link Button */}
        <button
          onClick={onBuyClick}
          className="w-full bg-surface-high border border-strava/40 hover:bg-strava hover:text-on-brand text-fg italic-heavy py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
          title={`Opens official manufacturer page on ${new URL(product.official_url).hostname}`}
        >
          <span>BUY FROM OFFICIAL SITE</span>
          <ExternalLink className="w-3.5 h-3.5 text-strava group-hover/btn:text-on-brand transition-colors" />
        </button>

        <div className="text-[8px] font-space text-faint text-center mt-1.5 truncate">
          {new URL(product.official_url).hostname} · Opens brand's official store
        </div>
      </div>
    </div>
  );
};
