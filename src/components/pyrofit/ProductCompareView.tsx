import React, { useState, useMemo } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { SEED_PRODUCT_CATALOG } from '../../data/productCatalog';
import {
  handleOutboundManufacturerClick,
  getOrCreateAthleteId,
} from '../../lib/telemetryLogger';
import {
  CalculatedHourlyTargets,
  FuelProduct,
  FullAthleteProfile,
  WorkoutInputVector,
} from '../../types/pyrofit';

// ── Default contexts for telemetry ──────────────────────────────────────────

const DEFAULT_INPUT: WorkoutInputVector = {
  workout_duration_mins: 120,
  intensity_level: 'MID',
  temperature_celsius: 28,
  cramping_history: false,
  athlete_weight_kg: 70,
  budget_tier_preference: 'ALL',
};

const DEFAULT_TARGETS: CalculatedHourlyTargets = {
  environmental_factor_E: 1.2,
  intensity_modifier: 1.0,
  carbs_base_g: 60,
  carbs_hourly_g: 60,
  sodium_hourly_mg: 480,
  fluids_hourly_ml: 600,
};

// ── Types ────────────────────────────────────────────────────────────────────

interface ProductCompareViewProps {
  athleteProfile?: FullAthleteProfile | null;
}

type SortKey =
  | 'cost_per_25g_carb'
  | 'cost_per_500mg_sodium'
  | 'cost_per_20g_protein'
  | 'price_inr';

type OriginFilter = 'ALL' | 'DOMESTIC_INDIA' | 'INTERNATIONAL';
type TierFilter = 'ALL' | 'L1' | 'L2' | 'L3';

const CATEGORIES = [
  'All',
  'Energy Gels',
  'Carbohydrate Drink Mixes',
  'Electrolyte & Hydration Products',
  'Recovery Nutrition',
  'Energy Bars & Chews',
] as const;

const DIETARY_OPTIONS = ['Vegan', 'Gluten-Free', 'Dairy-Free', 'Caffeine-Free'] as const;

// ── Helper: format a nullable cost value ────────────────────────────────────

function fmt(val: number | null | undefined, decimals = 2): string {
  if (val == null) return '—';
  return `₹${val.toFixed(decimals)}`;
}

// ── Tier badge classes ───────────────────────────────────────────────────────

function tierBadgeClass(tier: 'L1' | 'L2' | 'L3'): string {
  switch (tier) {
    case 'L1':
      return 'bg-strava/10 text-strava border border-strava/40';
    case 'L2':
      return 'bg-amber-400/10 text-amber-400 border border-amber-400/40';
    case 'L3':
      return 'bg-sky-400/10 text-sky-400 border border-sky-400/40';
  }
}

// ── NutritionLabel sub-component ─────────────────────────────────────────────

const NutritionLabel: React.FC<{ product: FuelProduct }> = ({ product }) => {
  const rows: Array<{ label: string; value: string }> = [
    {
      label: 'Total Carbohydrate',
      value: product.carbs_g != null ? `${product.carbs_g}g` : '—',
    },
    {
      label: 'Sugars',
      value: product.sugars_g != null ? `${product.sugars_g}g` : '—',
    },
    {
      label: 'Sodium',
      value: product.sodium_mg != null ? `${product.sodium_mg}mg` : '—',
    },
    {
      label: 'Potassium',
      value: product.potassium_mg != null ? `${product.potassium_mg}mg` : '—',
    },
    {
      label: 'Magnesium',
      value: product.magnesium_mg != null ? `${product.magnesium_mg}mg` : '—',
    },
    {
      label: 'Caffeine',
      value: product.caffeine_mg != null ? `${product.caffeine_mg}mg` : '—',
    },
    {
      label: 'Protein',
      value: product.protein_g != null ? `${product.protein_g}g` : '—',
    },
  ];

  return (
    <div className="border-2 border-black dark:border-fg/80 p-3 mt-3 font-space text-xs">
      {/* Header */}
      <div className="text-sm font-black leading-tight text-fg">Nutrition Facts</div>

      {/* Serving size */}
      <div className="flex justify-between mt-0.5 text-fg">
        <span>Serving size</span>
        <span>
          {product.serving_size_g_or_ml != null
            ? `${product.serving_size_g_or_ml}${product.fluids_ml > 0 ? 'ml' : 'g'}`
            : '1 serving'}
        </span>
      </div>

      {/* Thick divider */}
      <div className="border-t-4 border-black dark:border-fg/80 my-1" />

      {/* Calories */}
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-black text-fg">Calories</span>
        <span className="text-lg font-black text-fg">
          {product.calories_kcal != null ? product.calories_kcal : '—'}
        </span>
      </div>

      {/* Thin divider + daily value note */}
      <div className="border-t border-black dark:border-fg/60 my-1" />
      <div className="text-right text-muted" style={{ fontSize: '10px' }}>
        % Daily Value*
      </div>

      {/* Nutrient rows */}
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between border-t border-black/20 dark:border-fg/20 py-0.5 text-fg"
        >
          <span>{row.label}</span>
          <span className="font-semibold">{row.value}</span>
        </div>
      ))}

      {/* Fine print */}
      <div className="mt-1 text-muted" style={{ fontSize: '9px' }}>
        *Based on serving size
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const ProductCompareView: React.FC<ProductCompareViewProps> = () => {
  // ── Filter state ──
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [originFilter, setOriginFilter] = useState<OriginFilter>('ALL');
  const [tierFilter, setTierFilter] = useState<TierFilter>('ALL');
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('cost_per_25g_carb');

  // ── Compare select state ──
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [clickError, setClickError] = useState<string | null>(null);

  // ── Filtered + sorted products ──
  const displayedProducts = useMemo(() => {
    let list = [...SEED_PRODUCT_CATALOG];

    if (categoryFilter !== 'All') {
      list = list.filter((p) => p.category === categoryFilter);
    }
    if (originFilter !== 'ALL') {
      list = list.filter((p) => p.origin === originFilter);
    }
    if (tierFilter !== 'ALL') {
      list = list.filter((p) => p.tier === tierFilter);
    }
    if (dietaryFilters.length > 0) {
      list = list.filter((p) =>
        dietaryFilters.every((tag) => {
          if (tag === 'Caffeine-Free') return !p.caffeine_mg || p.caffeine_mg === 0;
          return p.dietary_tags.includes(tag);
        })
      );
    }

    list.sort((a, b) => {
      const av = a[sortKey] as number | null | undefined;
      const bv = b[sortKey] as number | null | undefined;
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return av - bv;
    });

    return list;
  }, [categoryFilter, originFilter, tierFilter, dietaryFilters, sortKey]);

  // ── Compare bar products ──
  const compareProducts = useMemo(
    () => compareIds.map((id) => SEED_PRODUCT_CATALOG.find((p) => p.id === id)!).filter(Boolean),
    [compareIds]
  );

  // ── Handlers ──
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev; // cap at 3
      return [...prev, id];
    });
  };

  const toggleDietary = (tag: string) => {
    setDietaryFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleBuyClick = (product: FuelProduct) => {
    try {
      handleOutboundManufacturerClick(
        product,
        DEFAULT_INPUT,
        DEFAULT_TARGETS,
        getOrCreateAthleteId()
      );
    } catch (err: any) {
      setClickError(err?.message ?? 'Failed to record click. Please try again.');
      setTimeout(() => setClickError(null), 4000);
    }
  };

  // ── Compare bar helpers ──
  const compareCols: Array<{
    key: keyof FuelProduct | 'cost_per_25g_carb' | 'cost_per_500mg_sodium' | 'cost_per_20g_protein';
    label: string;
    higherIsBetter: boolean;
    render: (p: FuelProduct) => string;
  }> = [
      {
        key: 'name',
        label: 'Product',
        higherIsBetter: false,
        render: (p) => `${p.brand} ${p.name}`,
      },
      {
        key: 'calories_kcal',
        label: 'Calories',
        higherIsBetter: true,
        render: (p) => (p.calories_kcal != null ? `${p.calories_kcal} kcal` : '—'),
      },
      {
        key: 'carbs_g',
        label: 'Carbs',
        higherIsBetter: true,
        render: (p) => `${p.carbs_g}g`,
      },
      {
        key: 'sodium_mg',
        label: 'Sodium',
        higherIsBetter: true,
        render: (p) => `${p.sodium_mg}mg`,
      },
      {
        key: 'protein_g',
        label: 'Protein',
        higherIsBetter: true,
        render: (p) => `${p.protein_g}g`,
      },
      {
        key: 'caffeine_mg',
        label: 'Caffeine',
        higherIsBetter: true,
        render: (p) => (p.caffeine_mg != null ? `${p.caffeine_mg}mg` : '—'),
      },
      {
        key: 'cost_per_25g_carb',
        label: 'Cost / 25g Carb',
        higherIsBetter: false,
        render: (p) => fmt(p.cost_per_25g_carb),
      },
      {
        key: 'cost_per_500mg_sodium',
        label: 'Cost / 500mg Na',
        higherIsBetter: false,
        render: (p) => fmt(p.cost_per_500mg_sodium),
      },
      {
        key: 'cost_per_20g_protein',
        label: 'Cost / 20g Protein',
        higherIsBetter: false,
        render: (p) => fmt(p.cost_per_20g_protein),
      },
      {
        key: 'price_inr',
        label: 'Price / serving',
        higherIsBetter: false,
        render: (p) => `₹${p.price_inr}`,
      },
    ];

  const isBestInRow = (
    rowKey: keyof FuelProduct | string,
    product: FuelProduct,
    higherIsBetter: boolean
  ): boolean => {
    if (compareProducts.length < 2) return false;
    if (rowKey === 'name') return false;

    const vals = compareProducts.map((p) => {
      const v = (p as any)[rowKey];
      return typeof v === 'number' ? v : null;
    });

    const defined = vals.filter((v): v is number => v !== null);
    if (defined.length === 0) return false;

    const productVal = (product as any)[rowKey];
    if (typeof productVal !== 'number') return false;

    const best = higherIsBetter ? Math.max(...defined) : Math.min(...defined);
    return productVal === best;
  };

  // ── Render ──
  return (
    <div className="relative min-h-screen bg-bg text-fg pb-48">
      {/* Inline error toast */}
      {clickError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-space px-4 py-2 flex items-center gap-2 shadow-lg">
          <span>⚠</span> {clickError}
        </div>
      )}
      {/* ── Sticky filter panel ── */}
      <div className="sticky top-0 z-30 bg-bg border-b border-border px-4 py-3 space-y-3">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${categoryFilter === cat
                  ? 'bg-strava text-on-brand border-strava'
                  : 'bg-surface border-border text-muted hover:border-strava/60'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Origin + Tier toggles */}
        <div className="flex flex-wrap gap-4">
          {/* Origin */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted mr-1">Origin:</span>
            {(['ALL', 'DOMESTIC_INDIA', 'INTERNATIONAL'] as OriginFilter[]).map((o) => (
              <button
                key={o}
                onClick={() => setOriginFilter(o)}
                className={`px-2.5 py-0.5 rounded text-xs border transition-colors ${originFilter === o
                    ? 'bg-strava text-on-brand border-strava'
                    : 'bg-surface border-border text-muted hover:border-strava/60'
                  }`}
              >
                {o === 'ALL' ? 'All' : o === 'DOMESTIC_INDIA' ? '🇮🇳 Domestic' : '🌐 International'}
              </button>
            ))}
          </div>

          {/* Tier */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted mr-1">Tier:</span>
            {(['ALL', 'L1', 'L2', 'L3'] as TierFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-2.5 py-0.5 rounded text-xs border transition-colors ${tierFilter === t
                    ? 'bg-strava text-on-brand border-strava'
                    : 'bg-surface border-border text-muted hover:border-strava/60'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary checkboxes + Sort */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">Dietary:</span>
            {DIETARY_OPTIONS.map((tag) => (
              <label key={tag} className="flex items-center gap-1 cursor-pointer text-xs text-fg">
                <input
                  type="checkbox"
                  checked={dietaryFilters.includes(tag)}
                  onChange={() => toggleDietary(tag)}
                  className="accent-strava"
                />
                {tag}
              </label>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted">Sort by:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-surface border border-border text-fg text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-strava"
            >
              <option value="cost_per_25g_carb">Cost per 25g Carb</option>
              <option value="cost_per_500mg_sodium">Cost per 500mg Sodium</option>
              <option value="cost_per_20g_protein">Cost per 20g Protein</option>
              <option value="price_inr">Price per serving</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedProducts.map((product) => {
          const isSelected = compareIds.includes(product.id);
          return (
            <div
              key={product.id}
              className={`bg-surface border p-4 rounded-lg flex flex-col gap-2 transition-colors ${isSelected ? 'border-strava' : 'border-border'
                }`}
            >
              {/* Row 1: compare checkbox + brand + name */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCompare(product.id)}
                  disabled={!isSelected && compareIds.length >= 3}
                  className="mt-1 accent-strava flex-shrink-0"
                  title={
                    !isSelected && compareIds.length >= 3
                      ? 'Maximum 3 products for comparison'
                      : 'Add to comparison'
                  }
                />
                <div className="min-w-0">
                  <div className="font-space text-xs text-muted uppercase tracking-wide truncate">
                    {product.brand}
                  </div>
                  <div className="font-space italic font-bold text-lg leading-tight text-fg">
                    {product.name}
                  </div>
                </div>
              </div>

              {/* Row 2: origin pill + tier badge + category tag */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-surface-high text-muted">
                  {product.origin === 'DOMESTIC_INDIA' ? '🇮🇳 Domestic' : '🌐 Intl'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tierBadgeClass(product.tier)}`}
                >
                  {product.tier}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-high border border-border text-muted">
                  {product.category}
                </span>
              </div>

              {/* Row 3: FDA-style Nutrition Facts */}
              <NutritionLabel product={product} />

              {/* Row 4: cost-efficiency metrics */}
              <div className="grid grid-cols-3 gap-1 mt-2 text-center text-[10px]">
                <div className="bg-surface-high rounded p-1">
                  <div className="text-muted leading-none mb-0.5">/ 25g Carb</div>
                  <div
                    className={
                      product.cost_per_25g_carb != null ? 'text-strava font-bold' : 'text-muted'
                    }
                  >
                    {fmt(product.cost_per_25g_carb)}
                  </div>
                </div>
                <div className="bg-surface-high rounded p-1">
                  <div className="text-muted leading-none mb-0.5">/ 500mg Na</div>
                  <div
                    className={
                      product.cost_per_500mg_sodium != null ? 'text-strava font-bold' : 'text-muted'
                    }
                  >
                    {fmt(product.cost_per_500mg_sodium)}
                  </div>
                </div>
                <div className="bg-surface-high rounded p-1">
                  <div className="text-muted leading-none mb-0.5">/ 20g Protein</div>
                  <div
                    className={
                      product.cost_per_20g_protein != null ? 'text-strava font-bold' : 'text-muted'
                    }
                  >
                    {fmt(product.cost_per_20g_protein)}
                  </div>
                </div>
              </div>

              {/* Row 5: dietary tags */}
              {product.dietary_tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.dietary_tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded-full border border-border bg-surface text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Row 6: anti-doping badge */}
              {product.anti_doping_certified && (
                <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold mt-0.5">
                  <ShieldCheck size={13} />
                  <span>Informed Sport Certified</span>
                </div>
              )}

              {/* Row 7: data confidence + verified date */}
              <div className="flex items-center gap-2 text-[10px] text-muted mt-0.5">
                <span
                  className={`px-1.5 py-0.5 rounded border ${product.data_confidence === 'HIGH'
                      ? 'border-emerald-400/40 text-emerald-400'
                      : product.data_confidence === 'MEDIUM'
                        ? 'border-amber-400/40 text-amber-400'
                        : 'border-red-400/40 text-red-400'
                    }`}
                >
                  {product.data_confidence} confidence
                </span>
                {product.verified_date && (
                  <span>Verified {product.verified_date}</span>
                )}
              </div>

              {/* Row 8: Buy button */}
              <button
                onClick={() => handleBuyClick(product)}
                className="mt-auto w-full flex items-center justify-center gap-1.5 bg-strava hover:bg-strava/90 text-on-brand text-xs font-bold py-2 rounded transition-colors"
              >
                Buy from Official Store
              </button>
            </div>
          );
        })}

        {displayedProducts.length === 0 && (
          <div className="col-span-full text-center text-muted py-16 text-sm">
            No products match the selected filters.
          </div>
        )}
      </div>

      {/* ── Sticky comparison bar ── */}
      {compareProducts.length >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border shadow-lg overflow-auto max-h-72">
          <div className="flex justify-between items-center px-4 py-2 border-b border-border">
            <span className="text-xs font-bold text-fg">
              Comparing {compareProducts.length} products
            </span>
            <button
              onClick={() => setCompareIds([])}
              className="flex items-center gap-1 text-xs text-muted hover:text-fg transition-colors"
            >
              <X size={12} /> Clear
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-space">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-1.5 text-left text-muted font-semibold w-36">Metric</th>
                  {compareProducts.map((p) => (
                    <th key={p.id} className="px-3 py-1.5 text-left font-bold text-fg">
                      {p.brand} {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareCols.map((col) => (
                  <tr key={col.label} className="border-b border-border/50">
                    <td className="px-3 py-1.5 text-muted font-semibold">{col.label}</td>
                    {compareProducts.map((p) => {
                      const best = isBestInRow(col.key as string, p, col.higherIsBetter);
                      return (
                        <td
                          key={p.id}
                          className={`px-3 py-1.5 ${best ? 'text-strava font-bold' : 'text-fg'}`}
                        >
                          {col.render(p)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
