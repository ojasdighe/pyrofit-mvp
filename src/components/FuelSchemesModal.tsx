import React, { useState } from 'react';
import { X, Zap, Droplets, Flame, Coffee, Apple, Info } from 'lucide-react';

interface FuelSchemesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'pre' | 'during' | 'post' | 'india';

const TABS: { id: Tab; label: string }[] = [
  { id: 'pre', label: 'Pre-Race' },
  { id: 'during', label: 'During Race' },
  { id: 'post', label: 'Post-Race Recovery' },
  { id: 'india', label: 'India-Specific Fuels' },
];

const duringData = [
  { duration: 'Under 60 min', carbs: '0g', sodium: '0–200mg', fluids: '300–400ml', note: 'Water only. No fueling needed.' },
  { duration: '60–90 min', carbs: '30g', sodium: '300mg', fluids: '400–500ml', note: 'Single gel or isotonic drink.' },
  { duration: '90–120 min', carbs: '45–60g', sodium: '400–500mg', fluids: '500ml', note: 'Gel every 30–35 min + electrolytes.' },
  { duration: '2–3 hours', carbs: '60g', sodium: '500–600mg', fluids: '500–600ml', note: 'Gel every 25 min. Add salt caps in heat.' },
  { duration: '3+ hours', carbs: '75–90g', sodium: '600–760mg', fluids: '600–700ml', note: 'Dual-source carbs (glucose + fructose). Mandatory sodium.' },
];

const fuelProducts = [
  { icon: Zap, name: 'Energy Gel', timing: 'Every 25–45 min', tip: '25–32g carbs per unit. Take with water, never alone.' },
  { icon: Droplets, name: 'Electrolyte Tabs', timing: '1 tab per 500ml water', tip: 'Sodium, potassium, magnesium. Essential in heat >28°C.' },
  { icon: Apple, name: 'Energy Chews', timing: 'Every 30 min', tip: 'Slower release than gels. Good for sensitive stomachs.' },
  { icon: Coffee, name: 'Isotonic Drink', timing: 'At aid stations', tip: '6–8% carb concentration. Easy on the GI tract.' },
  { icon: Flame, name: 'Salt Caps', timing: 'Every 60 min in heat', tip: '200–300mg sodium each. Prevents hyponatraemia in long events.' },
];

const indiaProducts = [
  { name: 'Enerzal', type: 'Isotonic Powder', carbs: '17g/serve', sodium: '460mg/serve', price: '₹20–30/sachet', where: 'Chemist, online' },
  { name: 'Unived Gels', type: 'Energy Gel', carbs: '25g/gel', sodium: '180mg/gel', price: '₹100–130/gel', where: 'Sports store, Unived.in' },
  { name: 'Fast&Up Reload', type: 'Electrolyte Tab', carbs: '7g/tab', sodium: '300mg/tab', price: '₹25–35/tab', where: 'Health stores, Amazon' },
  { name: 'MuscleBlaze Fuel One', type: 'Isotonic Drink Mix', carbs: '30g/serve', sodium: '350mg/serve', price: '₹35–50/serve', where: 'GNC, Flipkart' },
  { name: 'Steadfast Ionic Energy', type: 'Electrolyte + Carb', carbs: '22g/serve', sodium: '400mg/serve', price: '₹60–80/sachet', where: 'Steadfastnutrition.com' },
];

export const FuelSchemesModal: React.FC<FuelSchemesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('pre');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-w-5xl mx-auto my-8 bg-carbon border border-border p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-5 border-b border-border">
          <div>
            <div className="text-[10px] font-space text-strava tracking-[0.4em] uppercase mb-1 font-bold flex items-center gap-2">
              <Flame className="w-3.5 h-3.5" /> Precision Fueling Guide
            </div>
            <h2 className="italic-heavy text-3xl md:text-4xl text-fg">
              FUEL <span className="text-strava">SCHEMES</span>
            </h2>
            <p className="text-muted text-sm font-light mt-1 font-space">
              Science-backed carbohydrate, sodium & fluid targets for every race distance.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-fg hover:bg-surface border border-border transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-8 overflow-x-auto border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-space tracking-[0.2em] uppercase font-bold whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border-strava text-strava'
                  : 'border-transparent text-muted hover:text-fg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PRE-RACE */}
        {activeTab === 'pre' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  time: 'T-3 Days',
                  title: 'Carb Loading Phase',
                  target: '8–10g / kg / day',
                  details: ['Rice, pasta, oats, bread — prioritise white/refined for fast absorption', 'Avoid high-fibre vegetables, beans, and legumes', 'Reduce training volume to 30–40% of normal', 'Hydrate consistently — pale yellow urine is the target'],
                  accent: 'border-l-strava',
                },
                {
                  time: 'T-1 Day',
                  title: 'Top-Up & Settle',
                  target: '6–8g / kg / day',
                  details: ['Light, familiar meals — no new foods', 'No heavy red meat or high-fat meals at dinner', 'Last long run should be 48–72hr before race', 'Electrolyte drink in the evening'],
                  accent: 'border-l-strava/60',
                },
                {
                  time: 'Race Morning (3–4hr)',
                  title: 'Pre-Race Meal',
                  target: '2–3g / kg carbs',
                  details: ['Banana + toast + sports drink is the classic formula', 'Add a small amount of protein (eggs, yoghurt) if tolerated', 'Avoid high-fat, high-fibre choices', 'Drink 500ml water on waking'],
                  accent: 'border-l-strava/40',
                },
                {
                  time: '30–60 min Before',
                  title: 'Activation Window',
                  target: '30g fast carbs',
                  details: ['One energy gel or isotonic sports drink', 'Avoid solid food this close to the gun', 'Sip water — no large volumes', 'Caffeine (3–6mg/kg) if used: take 60min before'],
                  accent: 'border-l-strava/20',
                },
              ].map((phase, i) => (
                <div key={i} className={`bg-surface border border-border border-l-4 ${phase.accent} p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-space text-strava uppercase tracking-widest font-bold">{phase.time}</span>
                    <span className="text-[10px] font-space text-fg font-bold bg-strava/10 px-2 py-0.5 border border-strava/20">{phase.target}</span>
                  </div>
                  <h3 className="italic-heavy text-base text-fg mb-3">{phase.title}</h3>
                  <ul className="space-y-1.5">
                    {phase.details.map((d, j) => (
                      <li key={j} className="text-xs text-muted font-light flex gap-2">
                        <span className="text-strava mt-0.5 flex-shrink-0">▸</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 p-4 bg-strava/5 border border-strava/20">
              <Info className="w-4 h-4 text-strava flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted font-space leading-relaxed">
                <strong className="text-fg">Glycogen storage limit:</strong> The human body stores roughly 400–500g of glycogen (1,600–2,000 kcal). Carb loading maximises this store. For events under 90 minutes, carb loading has negligible benefit — focus on the morning meal instead.
              </p>
            </div>
          </div>
        )}

        {/* DURING RACE */}
        {activeTab === 'during' && (
          <div className="space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead>
                  <tr className="bg-strava/10">
                    {['Duration', 'Carbs / hr', 'Sodium / hr', 'Fluids / hr', 'Strategy Note'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-space text-strava uppercase tracking-widest font-bold border-b border-border whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {duringData.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 font-space text-xs font-bold text-fg">{row.duration}</td>
                      <td className="px-4 py-3 font-space text-xs text-strava font-bold">{row.carbs}</td>
                      <td className="px-4 py-3 font-space text-xs text-muted">{row.sodium}</td>
                      <td className="px-4 py-3 font-space text-xs text-muted">{row.fluids}</td>
                      <td className="px-4 py-3 text-xs text-faint font-light">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <div className="text-[9px] font-space text-strava tracking-[0.4em] uppercase mb-4 font-bold">Fueling Product Formats</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {fuelProducts.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <div key={i} className="bg-surface border border-border p-4 hover:border-strava/30 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-strava/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-strava" />
                        </div>
                        <span className="italic-heavy text-sm text-fg">{p.name}</span>
                      </div>
                      <div className="text-[10px] font-space text-strava mb-1 font-bold">{p.timing}</div>
                      <p className="text-xs text-muted font-light">{p.tip}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-strava/5 border border-strava/20">
              <Info className="w-4 h-4 text-strava flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted font-space leading-relaxed">
                <strong className="text-fg">90g/hr ceiling:</strong> At 3+ hours, the gut can absorb up to 90g carbs/hr when combining glucose and fructose (2:1 ratio). Training the gut to handle this in long runs is mandatory — never test high-carb fueling for the first time on race day.
              </p>
            </div>
          </div>
        )}

        {/* POST-RACE */}
        {activeTab === 'post' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                {
                  window: '0–30 Minutes',
                  title: 'Glycogen Window',
                  items: ['0.8g/kg bodyweight carbohydrates', '20–25g high-quality protein', 'Chocolate milk (ideal ratio of carbs to protein)', 'Begin rehydrating with electrolytes immediately'],
                  badge: 'CRITICAL WINDOW',
                  badgeClass: 'bg-strava/20 text-strava border-strava/30',
                },
                {
                  window: '2–4 Hours',
                  title: 'Full Recovery Meal',
                  items: ['Balanced plate: rice/pasta + protein + vegetables', '1.5–2x normal meal size', 'Anti-inflammatory foods: berries, leafy greens, turmeric', 'Continue rehydrating — pale urine target'],
                  badge: 'PRIMARY MEAL',
                  badgeClass: 'bg-surface border-border text-muted',
                },
                {
                  window: '24–48 Hours',
                  title: 'Ongoing Recovery',
                  items: ['Normal eating — no aggressive restriction', 'Protein every 3–4 hours for muscle repair', 'Cold exposure within 30min post-race', 'Sleep 8–9 hours if possible'],
                  badge: 'REPAIR PHASE',
                  badgeClass: 'bg-surface border-border text-muted',
                },
              ].map((phase, i) => (
                <div key={i} className="bg-surface border border-border p-5">
                  <div className={`inline-block text-[9px] font-space uppercase tracking-widest px-2 py-0.5 border mb-3 font-bold ${phase.badgeClass}`}>
                    {phase.badge}
                  </div>
                  <div className="text-[9px] font-space text-faint uppercase tracking-widest mb-1">{phase.window}</div>
                  <h3 className="italic-heavy text-base text-fg mb-3">{phase.title}</h3>
                  <ul className="space-y-1.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className="text-xs text-muted font-light flex gap-2">
                        <span className="text-strava mt-0.5 flex-shrink-0">▸</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-surface border border-border p-5">
              <div className="text-[9px] font-space text-strava uppercase tracking-widest font-bold mb-4">Rehydration Formula</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="italic-heavy text-3xl text-strava mb-1">150%</div>
                  <div className="text-xs text-muted font-space">of body mass lost replace as fluid</div>
                </div>
                <div>
                  <div className="italic-heavy text-3xl text-fg mb-1">1.5L</div>
                  <div className="text-xs text-muted font-space">per kg of body weight lost</div>
                </div>
                <div>
                  <div className="italic-heavy text-3xl text-fg mb-1">+Na</div>
                  <div className="text-xs text-muted font-space">electrolytes mandatory to retain fluids</div>
                </div>
              </div>
              <p className="text-xs text-faint font-space mt-4 text-center">
                Weigh yourself before & after. Each kg lost ≈ 1L fluid deficit. Drink 1.5L for every 1kg lost.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Chocolate Milk', 'Rice + Eggs', 'Greek Yoghurt + Fruit', 'Banana + Peanut Butter'].map((food, i) => (
                <div key={i} className="bg-surface border border-border p-3 text-center hover:border-strava/30 transition-colors">
                  <div className="text-xs font-space text-muted font-bold">{food}</div>
                  <div className="text-[9px] text-faint mt-1">Top recovery food</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INDIA-SPECIFIC */}
        {activeTab === 'india' && (
          <div className="space-y-6">
            <p className="text-muted text-sm font-light font-space leading-relaxed max-w-2xl">
              Domestic Indian fuel options tested against international standards. All prices approximate retail (Nov 2026). Official store links — no marketplace redirects.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead>
                  <tr className="bg-strava/10">
                    {['Product', 'Type', 'Carbs/Serve', 'Sodium/Serve', 'Price', 'Where to Buy'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-space text-strava uppercase tracking-widest font-bold border-b border-border whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {indiaProducts.map((p, i) => (
                    <tr key={i} className="border-b border-border hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 font-space text-xs font-bold text-fg">{p.name}</td>
                      <td className="px-4 py-3 text-xs text-muted">{p.type}</td>
                      <td className="px-4 py-3 text-xs text-strava font-bold font-space">{p.carbs}</td>
                      <td className="px-4 py-3 text-xs text-muted font-space">{p.sodium}</td>
                      <td className="px-4 py-3 text-xs text-muted font-space">{p.price}</td>
                      <td className="px-4 py-3 text-xs text-faint">{p.where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface border border-border p-5">
                <div className="text-[9px] font-space text-strava uppercase tracking-widest font-bold mb-3">International Benchmarks</div>
                <div className="space-y-3">
                  {[
                    { brand: 'Maurten 100', carbs: '25g', sodium: '75mg', note: 'Hydrogel tech. Best GI tolerance.' },
                    { brand: 'SiS Beta Fuel', carbs: '40g/gel', sodium: '55mg', note: 'High-carb dual-source format.' },
                    { brand: 'Precision Fuel PF30', carbs: '30g', sodium: '175mg', note: "India runners' top choice." },
                    { brand: 'GU Energy Gel', carbs: '22g', sodium: '55mg', note: 'Most widely available globally.' },
                  ].map((b, i) => (
                    <div key={i} className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-fg font-space">{b.brand}</div>
                        <div className="text-[10px] text-faint">{b.note}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-strava font-bold">{b.carbs}</div>
                        <div className="text-[10px] text-faint">{b.sodium} Na</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-strava/5 border border-strava/20 p-5">
                <div className="text-[9px] font-space text-strava uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" /> What to Look For
                </div>
                <ul className="space-y-2">
                  {[
                    'Glucose + fructose blend for >60g/hr absorption',
                    'Sodium: at minimum 150mg per gel',
                    'Caffeine: 25–75mg per gel for late-race boost',
                    'Anti-doping certified (WADA/NSF) for competitive runners',
                    'Avoid sorbitol & inulin — common GI irritants',
                    'Osmolality 200–320 mOsm/kg for fastest gastric emptying',
                  ].map((tip, i) => (
                    <li key={i} className="text-xs text-muted font-light flex gap-2">
                      <span className="text-strava mt-0.5 flex-shrink-0">▸</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
