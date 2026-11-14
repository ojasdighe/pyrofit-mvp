import React, { useState, useMemo } from 'react';
import {
  Plus,
  Minus,
  Target,
  CheckCircle,
  AlertTriangle,
  X,
  Flame,
  Droplets,
  Zap,
  ShoppingCart,
  Info,
} from 'lucide-react';
import { CalculatedHourlyTargets, FuelProduct } from '../../types/pyrofit';
import { SEED_PRODUCT_CATALOG } from '../../data/productCatalog';

interface CustomFuelStackBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  targets: CalculatedHourlyTargets;
}

interface StackItem {
  product: FuelProduct;
  qty: number;
}

const TOLERANCE = 0.15; // ±15%

function getTolerance(target: number): { min: number; max: number } {
  return {
    min: target * (1 - TOLERANCE),
    max: target * (1 + TOLERANCE),
  };
}

type MatchStatus = 'within' | 'low' | 'high' | 'zero';

function getMatchStatus(value: number, target: number): MatchStatus {
  if (target === 0) return 'zero';
  const { min, max } = getTolerance(target);
  if (value >= min && value <= max) return 'within';
  if (value < min) return 'low';
  return 'high';
}

function statusColor(status: MatchStatus): string {
  switch (status) {
    case 'within': return 'text-emerald-400';
    case 'low':    return 'text-amber-400';
    case 'high':   return 'text-red-400';
    default:       return 'text-muted';
  }
}

function statusBg(status: MatchStatus): string {
  switch (status) {
    case 'within': return 'bg-emerald-400/10 border-emerald-400/30';
    case 'low':    return 'bg-amber-400/10 border-amber-400/30';
    case 'high':   return 'bg-red-400/10 border-red-400/30';
    default:       return 'bg-surface border-border';
  }
}

function GaugeBar({
  value,
  target,
  unit,
  label,
  colorClass,
}: {
  value: number;
  target: number;
  unit: string;
  label: string;
  colorClass: string;
}) {
  if (target === 0) return null;
  const { min, max } = getTolerance(target);
  const status = getMatchStatus(value, target);
  const cappedValue = Math.min(value, target * 1.5);
  const pct = (cappedValue / (target * 1.5)) * 100;
  const minPct = (min / (target * 1.5)) * 100;
  const maxPct = (max / (target * 1.5)) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted font-space uppercase tracking-wider text-[10px]">{label}</span>
        <span className={`font-bold font-space ${statusColor(status)}`}>
          {value}{unit} / {target}{unit}
        </span>
      </div>
      <div className="relative h-4 bg-surface border border-border overflow-hidden">
        {/* Fill bar */}
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-300 ${
            status === 'within' ? 'bg-emerald-400/40' :
            status === 'high' ? 'bg-red-400/40' : 'bg-amber-400/40'
          }`}
          style={{ width: `${pct}%` }}
        />
        {/* Tolerance zone */}
        <div
          className="absolute top-0 h-full border-l border-r border-emerald-400/60 bg-emerald-400/10"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* Target tick */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-fg/40"
          style={{ left: `${(target / (target * 1.5)) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-faint font-space">
        <span>0</span>
        <span className="text-emerald-400/70">±15% zone: {Math.round(min)}–{Math.round(max)}{unit}</span>
        <span>{Math.round(target * 1.5)}{unit}</span>
      </div>
    </div>
  );
}

export const CustomFuelStackBuilder: React.FC<CustomFuelStackBuilderProps> = ({
  isOpen,
  onClose,
  targets,
}) => {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<'ALL' | 'PRE' | 'DURING' | 'POST'>('DURING');

  const availableProducts = useMemo(() => {
    return selectedPhase === 'ALL'
      ? SEED_PRODUCT_CATALOG
      : SEED_PRODUCT_CATALOG.filter((p) => p.phase === selectedPhase);
  }, [selectedPhase]);

  const totals = useMemo(() => {
    return stack.reduce(
      (acc, item) => ({
        carbs: acc.carbs + item.product.carbs_g * item.qty,
        sodium: acc.sodium + item.product.sodium_mg * item.qty,
        fluids: acc.fluids + item.product.fluids_ml * item.qty,
        protein: acc.protein + item.product.protein_g * item.qty,
        cost: acc.cost + item.product.price_inr * item.qty,
      }),
      { carbs: 0, sodium: 0, fluids: 0, protein: 0, cost: 0 }
    );
  }, [stack]);

  const carbsStatus = getMatchStatus(totals.carbs, targets.carbs_hourly_g);
  const sodiumStatus = getMatchStatus(totals.sodium, targets.sodium_hourly_mg);
  const fluidsStatus = getMatchStatus(totals.fluids, targets.fluids_hourly_ml);

  const allWithin =
    targets.carbs_hourly_g === 0
      ? true
      : (carbsStatus === 'within' || carbsStatus === 'zero') &&
        (sodiumStatus === 'within' || sodiumStatus === 'zero') &&
        (fluidsStatus === 'within' || fluidsStatus === 'zero');

  const addProduct = (product: FuelProduct) => {
    setStack((s) => {
      const existing = s.find((x) => x.product.id === product.id);
      if (existing) {
        return s.map((x) => x.product.id === product.id ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...s, { product, qty: 1 }];
    });
  };

  const removeOne = (id: string) => {
    setStack((s) => {
      const existing = s.find((x) => x.product.id === id);
      if (!existing) return s;
      if (existing.qty <= 1) return s.filter((x) => x.product.id !== id);
      return s.map((x) => x.product.id === id ? { ...x, qty: x.qty - 1 } : x);
    });
  };

  const removeAll = (id: string) => setStack((s) => s.filter((x) => x.product.id !== id));

  const tierColors: Record<string, string> = {
    L1: 'text-amber-400 border-amber-400/40',
    L2: 'text-sky-400 border-sky-400/40',
    L3: 'text-emerald-400 border-emerald-400/40',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-bg border border-border shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-carbon flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-strava" />
            <div>
              <div className="text-fg text-xs font-space font-bold uppercase tracking-wider">Custom Fuel Stack Builder</div>
              <div className="text-faint text-[10px]">Build your hourly combo · ±15% tolerance validation</div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-fg transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0 flex-col md:flex-row">
          {/* Left: Product Catalog */}
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-border flex flex-col max-h-64 md:max-h-full">
            <div className="px-3 py-2 border-b border-border flex-shrink-0 bg-surface">
              <div className="text-[10px] font-space uppercase font-bold text-muted mb-1.5 tracking-wider">Phase Filter</div>
              <div className="flex gap-1 flex-wrap">
                {(['ALL', 'DURING', 'PRE', 'POST'] as const).map((phase) => (
                  <button
                    key={phase}
                    onClick={() => setSelectedPhase(phase)}
                    className={`text-[10px] font-space font-bold uppercase px-2 py-1 border transition-all ${
                      selectedPhase === phase
                        ? 'bg-strava text-on-brand border-strava'
                        : 'border-border text-muted hover:text-fg'
                    }`}
                  >
                    {phase}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {availableProducts.map((p) => {
                const inStack = stack.find((s) => s.product.id === p.id);
                return (
                  <div
                    key={p.id}
                    className="p-2.5 bg-surface border border-border hover:border-strava/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-fg text-[11px] font-bold font-space">{p.brand}</span>
                          <span className="text-muted text-[11px]">{p.name}</span>
                          <span className={`text-[9px] border px-1 font-space font-bold ${tierColors[p.tier] || 'text-muted border-border'}`}>
                            {p.tier}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {p.carbs_g > 0 && (
                            <span className="text-[9px] text-strava font-space">🔥 {p.carbs_g}g carbs</span>
                          )}
                          {p.sodium_mg > 0 && (
                            <span className="text-[9px] text-amber-400 font-space">⚡ {p.sodium_mg}mg Na</span>
                          )}
                          {p.fluids_ml > 0 && (
                            <span className="text-[9px] text-sky-400 font-space">💧 {p.fluids_ml}ml</span>
                          )}
                          {p.protein_g > 0 && (
                            <span className="text-[9px] text-purple-400 font-space">💪 {p.protein_g}g protein</span>
                          )}
                          <span className="text-[9px] text-faint font-space">₹{p.price_inr}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => addProduct(p)}
                        className="flex-shrink-0 w-7 h-7 bg-strava/10 border border-strava/40 hover:bg-strava hover:text-on-brand text-strava flex items-center justify-center transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {inStack && (
                      <div className="mt-1.5 text-[10px] font-space text-strava">
                        × {inStack.qty} in stack
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Stack + Gauges */}
          <div className="w-full md:w-1/2 flex flex-col max-h-64 md:max-h-full overflow-hidden">
            {/* Gauges */}
            <div className="p-3 border-b border-border bg-carbon flex-shrink-0 space-y-3">
              <div className={`flex items-center gap-2 p-2 border ${allWithin && stack.length > 0 ? 'bg-emerald-400/10 border-emerald-400/30' : 'bg-surface border-border'}`}>
                {allWithin && stack.length > 0 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Target className="w-4 h-4 text-muted flex-shrink-0" />
                )}
                <div className="text-[11px] font-space font-bold uppercase">
                  {allWithin && stack.length > 0 ? (
                    <span className="text-emerald-400">Stack is within ±15% tolerance!</span>
                  ) : stack.length === 0 ? (
                    <span className="text-muted">Add products to build your stack</span>
                  ) : (
                    <span className="text-amber-400">Adjust quantities to hit targets</span>
                  )}
                </div>
              </div>

              {targets.carbs_hourly_g > 0 && (
                <GaugeBar
                  value={Math.round(totals.carbs)}
                  target={targets.carbs_hourly_g}
                  unit="g"
                  label="Carbs/hr"
                  colorClass="bg-strava"
                />
              )}
              <GaugeBar
                value={Math.round(totals.sodium)}
                target={targets.sodium_hourly_mg}
                unit="mg"
                label="Sodium/hr"
                colorClass="bg-amber-400"
              />
              <GaugeBar
                value={Math.round(totals.fluids)}
                target={targets.fluids_hourly_ml}
                unit="ml"
                label="Fluids/hr"
                colorClass="bg-sky-400"
              />

              <div className="flex justify-between text-[11px] font-space pt-1 border-t border-border">
                <span className="text-muted">Estimated cost/hr</span>
                <span className="text-fg font-bold">₹{totals.cost}</span>
              </div>
            </div>

            {/* Stack Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {stack.length === 0 ? (
                <div className="p-4 text-center text-muted text-xs font-space">
                  <ShoppingCart className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  Your stack is empty. Add products from the left.
                </div>
              ) : (
                stack.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-2 p-2 bg-surface border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-fg font-space truncate">
                        {item.product.brand} {item.product.name}
                      </div>
                      <div className="text-[9px] text-muted mt-0.5">
                        {item.product.carbs_g > 0 && `${item.product.carbs_g * item.qty}g carbs · `}
                        {item.product.sodium_mg > 0 && `${item.product.sodium_mg * item.qty}mg Na · `}
                        ₹{item.product.price_inr * item.qty}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => removeOne(item.product.id)}
                        className="w-6 h-6 border border-border text-muted hover:text-fg flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-fg font-bold text-[12px] font-space w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => addProduct(item.product)}
                        className="w-6 h-6 border border-strava/40 text-strava hover:bg-strava/10 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeAll(item.product.id)}
                        className="w-6 h-6 border border-border text-faint hover:text-red-400 hover:border-red-400/30 flex items-center justify-center transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tolerance Legend */}
            <div className="p-2 border-t border-border flex gap-3 flex-wrap flex-shrink-0">
              <div className="flex items-center gap-1 text-[10px] font-space">
                <div className="w-2 h-2 bg-emerald-400/40 border border-emerald-400/60" />
                <span className="text-muted">±15% zone</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-space">
                <div className="w-0.5 h-3 bg-fg/40" />
                <span className="text-muted">Target</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-space text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                Under target
              </div>
              <div className="flex items-center gap-1 text-[10px] font-space text-red-400">
                <AlertTriangle className="w-3 h-3" />
                Over target
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
