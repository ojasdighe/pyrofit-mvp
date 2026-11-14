# STRIDD + PYROFIT MVP — Athlete Fueling & Outbound Lead Telemetry Platform

A comprehensive, enterprise-grade athlete endurance platform combining the **STRIDD Training Architect** with the **Pyrofit MVP** (Athlete Fueling & Outbound Lead Telemetry Platform).

---

## 🔥 Pyrofit MVP Architecture & Features

### 1. Zero In-App E-Commerce & Pure Outbound Manufacturer Referrals
- **Zero Transactions**: Pyrofit **never** handles payments, carts, or checkout flows.
- **Direct Official Webstores**: Every recommendation links exclusively to the manufacturer's verified web store (`maurten.com`, `unived.in`, `fastandup.in`, `enerzal.com`). 3rd-party marketplaces (Amazon, Flipkart) are strictly prohibited.
- **Telemetry Logger**: Every outgoing recommendation click records session context, product ID, tier, targets, and athlete ID before launching the external browser intent.

### 2. Deterministic Mathematical Calculation Engine (`src/lib/fuelEngine.ts`)
- **Environmental Factor ($E$)**:
  - $T < 22^\circ\text{C}$ (Cool): $E = 1.0$
  - $22^\circ\text{C} \le T \le 30^\circ\text{C}$ (Moderate): $E = 1.2$
  - $T > 30^\circ\text{C}$ (Hot / Indian Summer): $E = 1.4$
- **Intensity Modifier ($I_{\text{modifier}}$)**:
  - `LOW`: $0.8$
  - `MID`: $1.0$
  - `HIGH`: $1.2$
- **Hourly Carbohydrate Requirement**:
  - $D \le 60\text{m}$: $0\text{g/hr}$
  - $60 < D \le 120\text{m}$: $30\text{g} \times I_{\text{modifier}}$
  - $120 < D \le 180\text{m}$: $60\text{g} \times I_{\text{modifier}}$
  - $D > 180\text{m}$: $90\text{g} \times I_{\text{modifier}}$
  - $\text{Carbs}_{\text{hourly}} = \min(\text{Carbs}_{\text{base}} \times \text{carb\_multiplier}_{\text{ML}}, 90\text{g})$ (strict 90g/hr biological ceiling)
- **Hourly Sodium Requirement**:
  - $\text{Sodium}_{\text{hourly}} = [(400\text{mg} \times E) + (C \times 200\text{mg})] \times \text{sodium\_multiplier}_{\text{ML}}$
- **Hourly Fluid Requirement**:
  - $\text{Fluids}_{\text{hourly}} = 500\text{ml} \times E$

### 3. 3-Phase Timeline Strategy Allocation
1. **PRE-WORKOUT (Priming)**:
   - Active if $D > 90$ mins (45–60 mins prior).
   - $1.0\text{g Carbs / kg Body Weight} (1.0 \times W) + 300\text{ml Water}$.
   - Fast gastric-emptying carbs; avoid fats, proteins, and heavy fiber.
2. **DURING-WORKOUT (Sustained Intake)**:
   - Deployed in 40–45 minute intervals.
   - Exact hourly calculated $\text{Carbs}_{\text{hourly}}$, $\text{Sodium}_{\text{hourly}}$, and $\text{Fluids}_{\text{hourly}}$.
3. **POST-WORKOUT (Recovery Phase)**:
   - Within 30 minutes of session completion.
   - $20\text{g} - 25\text{g}$ protein with a $3:1$ to $4:1$ Carbohydrate-to-Protein ratio.

### 4. Product Catalog Schema & Seed Data (`src/data/productCatalog.ts`)
- **Maurten GEL 100** (`prod_m1`, L1, Hydrogel)
- **Unived Elite Energy Gel** (`prod_u1`, L1, Isotonic Gel)
- **Fast&Up Energy Gel** (`prod_f1`, L2, Standard Gel)
- **Fast&Up Reload Hydration** (`prod_f2`, L2, Electrolyte Effervescent)
- **Enerzal Energy Drink Powder** (`prod_e1`, L3, Isotonic Powder)
- **Unived RPRO Recovery Mix** (`prod_u2`, L1, Vegan Protein + Carb)
- **Maurten Drink Mix 160** (`prod_m2`, L1, Pre-Workout Priming)
- **Unived Pure Electrolyte Salt Caps** (`prod_u3`, L1, Pure Electrolytes)

### 5. Adaptive Post-Workout Machine Learning Feedback Loop
- **Severe Cramping**: Auto-adjusts sodium target baseline by $+15\%$ (`sodium_multiplier += 0.15`).
- **Stomach Bloating**: Locks catalog recommendations exclusively to Hydrogel & Isotonic formulations (`filter_isotonic_only = true`).
- **Energy Crash**: Auto-adjusts carbohydrate target by $+15\%$ (`carb_multiplier += 0.15`).
- **Optimal Fueling**: Logs verified protocol without negative adjustments.

### 6. Four Screen UI Architecture
- **Screen 1**: Workout & Profile Configurator (Duration slider, Intensity buttons, Temperature input with climate tags, Cramping history toggle, Tier selector).
- **Screen 2**: Calculated Fueling Strategy & Direct Store Links (3 large hourly target cards, 3-Phase timeline breakdown, product cards with **"Buy from Official Site"**).
- **Screen 3**: Post-Workout Adaptive Survey Modal (4 selectable outcomes, instant visual feedback, state updates).
- **Screen 4**: B2B Brand Data Analytics Portal (Manufacturer View: live outbound lead stream, JSON telemetry inspector, brand referral share breakdown).
- **Android Mobile Frame Preview Mode**: Toggle between full responsive canvas and an Android native mobile device frame with status bar simulation.

---

## 🏃‍♂️ Quick Start

```powershell
cd C:\Users\ojasd\.gemini\antigravity\scratch\stridd-clone
npm run dev
```

Open `http://localhost:3000` in your browser.
