# Pyrofit — Complete User Guide

> Everything a new user needs to go from zero to race-ready in one read.

---

## Table of Contents

1. [What Is Pyrofit?](#1-what-is-pyrofit)
2. [Getting Started](#2-getting-started)
3. [The Five Tabs — Your Control Center](#3-the-five-tabs)
4. [Tab 1 — Athlete Profile](#4-tab-1--athlete-profile)
5. [Tab 2 — Session Planner](#5-tab-2--session-planner)
6. [Tab 3 — Product Compare](#6-tab-3--product-compare)
7. [Tab 4 — Post-Workout Feedback](#7-tab-4--post-workout-feedback)
8. [Tab 5 — B2B Analytics](#8-tab-5--b2b-analytics)
9. [Feature Launcher — The 5 Power Tools](#9-feature-launcher--the-5-power-tools)
10. [How the Fueling Math Works](#10-how-the-fueling-math-works)
11. [Understanding Your Results](#11-understanding-your-results)
12. [The Adaptive Learning Loop](#12-the-adaptive-learning-loop)
13. [Product Catalog & Buying](#13-product-catalog--buying)
14. [Practical Workflows — Step by Step](#14-practical-workflows--step-by-step)
15. [Frequently Asked Questions](#15-frequently-asked-questions)

---

## 1. What Is Pyrofit?

Pyrofit is a precision fueling calculator for endurance athletes — runners, cyclists, and triathletes. It answers the three questions that determine whether you finish strong or blow up:

- **How many grams of carbohydrate do I need per hour?**
- **How much sodium do I need to prevent cramps?**
- **How much fluid do I need to avoid dehydration?**

The answers are not guesswork. They are calculated from a deterministic math engine built on sports science consensus (ACSM guidelines, Jeukendrup multi-transportable carb research, Stull wet-bulb formula). Your weight, the temperature outside, how hard you're going, and how long you're running all feed into formulas that produce exact numbers.

Pyrofit also learns from your body. After each workout, you log how you felt. If you cramped, it raises your sodium target for the next session. If you bonked, it raises carbs. This feedback loop runs every time you use the app.

**What Pyrofit does NOT do:**
- It does not sell products. Every "Buy" button takes you to the official manufacturer's website.
- It does not store your data on a server. Everything is in your browser's local storage.
- It does not require an account, login, or payment.

---

## 2. Getting Started

### Launch the App

```bash
cd c:\Workspace\pyrofit_mvp
npm install        # first time only
npm run dev
```

Open `http://localhost:3000` in your browser.

You will land on the **Pyrofit homepage**. The primary CTA — **"OPEN PYROFIT"** — takes you directly into the fueling engine. Click it.

### First-Time Welcome Screen

The first time you open the Hub (no profile saved yet), you will see a **welcome card** instead of the full interface. It shows three steps:

1. Fill in your Athlete Profile
2. Configure your session
3. Get your targets and product recommendations

Below the steps is a single **"Set Up My Profile →"** button. Click it. This takes you to the Athlete Profile tab.

The full tab bar, feature launcher buttons, and advanced tools are intentionally hidden at this stage. They appear automatically once you have saved a profile and run your first calculation. This keeps the first experience clean.

---

## 3. The Five Tabs — Your Control Center

After saving your profile, the full Hub unlocks. A tab bar at the top gives access to five sections:

| Tab | What You Do Here |
|-----|-----------------|
| **Athlete Profile** | Enter your physical details, dietary needs, goals, and event date. This personalises every calculation. |
| **Session Planner** | Configure a specific workout (duration, intensity, temperature) and get your exact fueling protocol. |
| **Product Compare** | Browse and filter all 39 products in the catalog. Compare nutrition panels and cost-efficiency. |
| **Post-Workout** | Log how you felt after a session. The engine adjusts your targets for next time. |
| **History & Data** | View session history, feedback logs, product click telemetry, and export your data. |

Work through them in order the first time. After that, the Session Planner is where you'll spend most of your time.

---

## 4. Tab 1 — Athlete Profile

### Why This Matters

Your profile is the foundation. The session planner reads your body weight to calculate pre-workout carb priming (1g carbs per kg of body weight). It reads your cramping history to add a sodium buffer. It reads your dietary preferences to filter out products you can't eat.

A profile that is 0% complete gives you generic numbers. A profile that is 100% complete gives you numbers tuned to your body.

### The Completeness Badge

The top-right of the profile shows a percentage badge — red below 50%, amber 50–79%, green 80%+. Directly below the badge is a **"Still needed:"** list showing exactly which fields are still empty. Fill those fields and the list shrinks as the percentage rises. Aim for 80%+ before your first serious session calculation.

---

### Section A — Identity & Sport

**Sport** — Choose from: Running, Cycling, Triathlon, Trail, Other.  
Currently affects product filtering (future versions will adjust formulas per sport).

**Experience Level** — Choose one:
- **Beginner**: <1 year of structured training
- **Intermediate**: 1–5 years, completing events regularly
- **Elite**: Competitive, trained athlete with performance goals

**Primary Goal** — Choose one:
- **Finish**: Completing the event is the priority
- **PR / Time Target**: Racing for a personal best
- **Base Building**: Low-intensity volume phase
- **Recovery**: Active recovery, reduced load

---

### Section B — Body & Physiology

**Body Weight (kg)** — Enter your current body weight. The pre-workout carb priming formula multiplies this directly. If you weigh 70 kg, your pre-workout carb target is 70g. Keep this up to date.

**Custom Sweat Rate (L/hr)** — Optional. If you have had a sweat rate test done (sports lab or sweat patch), enter the result here. For example, `1.2` means you lose 1.2 litres of fluid per hour. When set, this overrides the default fluid formula. If you don't know your sweat rate, leave it blank and the engine uses a temperature-adjusted default.

> **How to estimate your sweat rate without a lab:**  
> Weigh yourself immediately before a 1-hour run. Drink nothing during the run. Weigh yourself immediately after. The difference in kg equals litres of sweat lost. A 1 kg drop ≈ 1 L/hr sweat rate.

**GI Sensitivity** — How sensitive is your stomach during exercise?
- **None**: No gut issues. Full product range available.
- **Mild**: Occasional nausea or minor discomfort.
- **Severe / Bloating**: Locks the product catalog to Hydrogel and Isotonic formulations only. These digest without causing osmotic distress in the gut.

**Medical Flags** — Tick any that apply:
- **Hypertension**: May affect sodium targets. See your sports physician.
- **Diabetes**: Carbohydrate timing is critical. Consult a sports dietitian.
- **Renal**: Kidney conditions can affect fluid and electrolyte protocols.

A warning banner appears whenever a medical flag is active. The engine still calculates, but you should verify recommendations with your doctor.

---

### Section C — Dietary & Safety

**Diet Type** — Filters the product catalog:
- **Omnivore**: No restrictions
- **Vegetarian**: Excludes products with animal-derived gelatin or meat-based ingredients
- **Vegan**: Excludes all animal products (dairy, gelatin, whey)
- **Jain**: Excludes root vegetables, certain additives; Jain-tagged products only

**Allergies / Intolerances** — Tick any that apply: Dairy, Soy, Gluten, Nuts, Caffeine.  
Ticking **Caffeine** filters out all products that contain caffeine. Ticking others flags products that are not certified free of that allergen (when product data confidence is HIGH).

**Caffeine Tolerance** — This determines whether caffeinated products are included:
- **None**: No caffeinated gels or drinks recommended
- **Low**: Only low-caffeine options (up to ~25mg per serving)
- **Moderate**: Standard caffeinated gels included
- **High**: Full caffeine range, including double-caffeine gels

**Anti-Doping Status** — Choose one:
- **Recreational**: No testing. Full product range.
- **Tested / WADA-Informed Choice Only**: The catalog is filtered to show only products that carry Informed Choice or Informed Sport certification. This protects competitive athletes from inadvertent doping violations.

---

### Section D — Preferences & Budget

**Brand Origin Preference** — Filter products by where they're made:
- **ALL**: Shows everything (39 products from India and internationally)
- **India Only**: 8 domestic brands — Unived, Fast&Up, Steadfast, Enerzal, Electral, Leap, MuscleBlaze, Cosmix
- **International**: 7 international brands — Maurten, SiS, GU, Precision Fuel & Hydration, Tailwind, Hammer, High5

**Budget Tier** — Filter by price/quality bracket:
- **ALL**: No filter
- **L1 — Premium Scientific**: Maurten Hydrogel, Unived Elite. Research-backed formulations. Highest cost.
- **L2 — Balanced Performance**: Fast&Up gels, SiS gels. Good performance, mid-range cost.
- **L3 — Value Essential**: Enerzal, Electral. Accessible products, budget-friendly.

**Current Supplements** — Type any supplements you currently use, comma-separated. For example: `Creatine, Vitamin D, Omega-3`. This is informational — the engine uses it for context in AI explanations.

---

### Section E — Training Cycle

**Weekly Training Volume (hrs)** — How many hours per week you currently train. Used for context in AI briefings.

**Training Phase** — Where you are in your annual plan:
- **Base**: Building aerobic foundation. Low intensity, high volume.
- **Build**: Increasing specific fitness. More threshold work.
- **Peak**: Highest quality sessions close to the event.
- **Taper**: Reducing volume before race day. Maintaining intensity.
- **Race**: Race week.

**Target Event Date** — Set this and a countdown timer appears at the top of the Hub. During race week (7 days out), the banner turns amber to alert you.

**Event Distance (km)** — Optional. Stored in your profile for context.

**Average Sleep (hrs)** — How much you sleep per night on average. Used in AI coaching context.

**Recovery Score (1–10)** — Slide to reflect how recovered you feel today. 10 = fully rested. 1 = extremely fatigued. This helps the AI tailor its advice.

**Fatigue Score (1–10)** — Slide to reflect accumulated training load. 1 = fresh. 10 = heavily loaded.

---

### Section F — AI Sports Scientist Configuration

At the bottom of the profile is the AI provider configuration. This determines which AI engine powers the chat and race briefing features.

**Providers available:** OpenAI, Gemini, Anthropic, Mistral, Custom.

1. Click your preferred provider button.
2. Enter your API key (the field is masked for security).
3. The model name auto-fills with a sensible default — you can change it.
4. Click **Save Config**.

The status badge shows **● Connected** when you have a valid key saved, or **○ Fallback mode** when no key is configured. Fallback mode still works — it uses scientifically accurate pre-written responses instead of live AI generation. No functionality breaks without an AI key.

Your API key is stored only in your browser's localStorage. It is never sent to Pyrofit's servers.

---

### Saving Your Profile

Click **SAVE ATHLETE PROFILE** at the bottom. A green confirmation banner appears and you are taken to the Session Planner tab.

Your profile is saved to localStorage. It persists across browser sessions. To update it, return to the Athlete Profile tab at any time and re-save.

---

## 5. Tab 2 — Session Planner

This is the core of Pyrofit. You configure a session, hit Calculate, and get your complete fueling protocol with specific products and timing.

The planner has two screens:

1. **Configurator** — Set up the session parameters
2. **Strategy View** — Your calculated fueling protocol

---

### Screen 1: Workout Configurator

The configurator has three **Required** fields that you must set before calculating, and an **Advanced Options** section that starts collapsed. You do not need to open Advanced Options to get a complete fueling protocol — the three required fields are sufficient.

#### Required Field 1: Workout Duration

A slider from 30 minutes to 300 minutes (5 hours), in 15-minute steps. Each field shows a small orange **Required** badge so you know immediately what matters.

**Why duration matters:**
- **≤ 60 min**: No carbohydrate fueling needed. Your muscle glycogen stores are sufficient.
- **61–120 min**: 30g carbs/hr × intensity modifier. Light fueling required.
- **121–180 min**: 60g carbs/hr × intensity modifier. Regular gel intake necessary.
- **> 180 min**: 90g carbs/hr (the biological ceiling). Maximum fueling required.

The hours equivalent is displayed next to the slider in real time.

---

#### Required Field 2: Training Intensity Level

Three options with their heart rate zone equivalents:

| Selection | Zones | Description | Use When |
|-----------|-------|-------------|----------|
| **LOW** | Zone 1–2, Aerobic Base | Lower carb burn rate | Easy runs, recovery, long slow distance |
| **MID** | Zone 3, Tempo / Marathon Pace | Standard burn rate | Steady-state, marathon-pace runs |
| **HIGH** | Zone 4–5, Threshold / Intervals | Higher carb burn rate | Tempo intervals, 10K pace, VO2max sessions |

If you're unsure, **MID** is the safe default for most training runs.

---

#### Required Field 3: Ambient Temperature

Enter the temperature in Celsius manually or use the **Live Weather Fetch** tool.

**Why temperature matters — the Environmental Factor (E):**

| Temperature | Category | Environmental Factor |
|-------------|----------|---------------------|
| < 22°C | Cool | 1.0× (baseline) |
| 22°C – 30°C | Moderate | 1.2× (+20% sodium and fluids) |
| > 30°C | Indian Summer / Extreme | 1.4× (+40% sodium and fluids) |

E multiplies your sodium and fluid targets. At 35°C your fluid requirement is 40% higher than at 18°C.

**Live Weather Fetch:**
1. Type a city name in the weather field (e.g., `Pune`, `Mumbai`, `Delhi`).
2. Press Enter or click **Fetch Live Weather**.
3. The app calls Open-Meteo's free API and fills in current temperature, humidity, and wet-bulb temperature automatically.
4. If the wet-bulb temperature is above 28°C, a warning appears — evaporative cooling is severely impaired at that level and risk of heat illness rises.

You can always override the fetched temperature manually.

---

#### Advanced Options (collapsed by default)

Click **"Advanced Options ▼"** to expand these fields. They add more context to your session but are not required to calculate a protocol.

#### Athlete Body Weight

Enter your weight in kg. The pre-workout carb priming target is `1.0g × weight_kg`. At 75 kg, you prime with 75g of carbs 45–60 minutes before the session starts.

This field auto-populates from your profile. If you've recently changed weight, update it here before calculating.

---

#### Cramping Susceptibility

Toggle between **NO (Standard)** and **YES (Cramp Prone)**.

When set to YES:
- An additional 200mg of sodium per hour is added to your baseline target.
- This provides protection against hyponatremia-related muscle cramping.

If you have experienced cramping in past sessions, turn this on. The adaptive feedback loop also does this automatically when you log a Cramping outcome after a session.

---

#### Preferred Product Formulation Tier

Filters the product recommendations shown in the Strategy View:
- **ALL TIERS**: Every product across all price points
- **L1**: Maurten, Unived Elite (hydrogel science, highest bioavailability)
- **L2**: Fast&Up, SiS, GU (reliable mainstream performance products)
- **L3**: Enerzal, Electral (accessible, budget-conscious options)

This does not affect your carb/sodium/fluid calculations. It only filters which products are shown.

---

#### Session Type, Terrain, Fluid Access

Three additional classifiers that log context to the session history and help the AI give more relevant advice:

**Session Type:** Training / Race / Long Run / Recovery  
**Terrain:** Road / Trail / Track / Treadmill  
**Fluid Access:** Full (aid stations) / Limited (some stations) / Self-Carry (vest/pack)

---

#### Optional Fields

**Distance (km):** If you know the planned distance, enter it. Logged to session history.  
**Humidity (%):** If you fetched live weather, this fills in automatically. Used for wet-bulb context in AI briefings.

---

#### Calculate Fueling Protocol Button

Click **CALCULATE FUELING PROTOCOL** when you have configured all relevant fields.

This action:
1. Runs all formulas with your inputs.
2. Logs the session to in-browser SQLite (visible in Session History below).
3. Takes you to Screen 2 — the Strategy View.

---

### Screen 2: Fueling Strategy View

This is your complete, executable fueling plan for the session.

---

#### The Three Metric Cards (top of page)

Three large cards show your hourly targets:

**Carbohydrate Burn Rate** (orange number, g/hr)  
The exact grams of carbohydrate you need to consume per hour. The card also shows your session total (hourly rate × hours).

**Sodium Replenishment** (amber number, mg/hr)  
The exact milligrams of sodium needed per hour to maintain plasma electrolyte balance. The card shows the formula used: `400mg × E_factor + cramping_buffer`.

**Hydration Target** (blue number, ml/hr)  
The millilitres of fluid per hour. If you set a custom sweat rate in your profile, that overrides the default formula. The card shows the session total (useful for pre-packing water bottles).

If you have adaptive multipliers active from previous feedback sessions (e.g., Carb ×1.15 from a past bonk), orange/amber badges appear next to the intensity and climate tags to show the adjustment is applied.

---

#### Phase 01 — Pre-Workout (Priming)

**Timing:** 45–60 minutes before you start.

**Active when:** Session duration is over 90 minutes. For sessions under 90 minutes, this phase is skipped — normal meals are sufficient.

**What it shows:**
- Carbohydrate priming target (1.0g × body weight kg)
- Hydration pre-load (300ml water)
- Dietary guidance: eat fast-digesting carbs only. Avoid fat, dairy protein, and fibre — these slow gastric emptying and can cause GI distress during the session.
- Recommended pre-workout products from the catalog.

**What to eat:**
- Rice cakes, white bread + jam, bananas, dates, sports bars with simple carbs.
- One energy gel counts (~22–25g carbs each).
- If using a product, click **BUY FROM OFFICIAL SITE** to visit the manufacturer's store.

---

#### Phase 02 — During Workout (Sustained Intake)

**Timing:** Every 40–45 minutes throughout the session.

**What it shows:**
- Hourly intake summary (carbs, sodium, fluids)
- The fueling rhythm: deploy one gel or fuel source every 45 minutes with 200–250ml of electrolyte drink.
- **Energy Gels & Fueling** — products filtered to match your targets, tier, and dietary preferences.
- **Electrolyte & Hydration Solutions** — drinks and powders.

**How to read the product cards:**
- **Tier badge** (L1/L2/L3): Quality/price tier.
- **Price badge** (₹ amount): Cost per serving.
- **Nutritional grid**: Carbs / Sodium / Protein per serving.
- **Serving pace** (shown when > 1): How many servings per hour to hit your carb target. For example, "~2 servings/hour" at 25g carbs per gel means take a gel every 30 minutes.
- **BUY FROM OFFICIAL SITE**: Opens the brand's official store. Never an Amazon or marketplace link.

---

#### Phase 03 — Post-Workout (Glycogen & Repair)

**Timing:** Within 30 minutes of finishing.

**What it shows:**
- Protein target: 22g (fast-absorbing whey isolate or plant peptide matrix)
- Carbohydrate replenishment: ~77g (3.5:1 carb-to-protein ratio)
- The 30-minute recovery window is when insulin sensitivity is highest — carbs taken now replenish glycogen 2–3× faster than carbs taken 2 hours later.
- Recovery products: protein powders and recovery drinks.

---

#### Reconfigure Button

Returns you to Screen 1 without losing your current settings. Adjust any parameter and recalculate.

---

#### Post-Workout Survey Button

Opens the adaptive feedback modal directly from the strategy view. After your session, click this to log how you felt and trigger the adaptive learning loop.

---

### Session History

Below the Strategy View (and also below the Configurator) is the **Recent Sessions** accordion panel.

Click the panel header to expand it. It shows the last 5 sessions you've calculated, with date, duration, intensity, temperature, calculated targets, and session type.

The **Load** button on any row restores those session parameters to the configurator so you can replicate a past session.

---

## 6. Tab 3 — Product Compare

The full 39-product catalog in one filterable, sortable grid. Use this when you want to research products independently of a session calculation.

---

### Filters (top bar)

**Category pills:**
- All
- Energy Gels
- Carbohydrate Drink Mixes
- Electrolyte & Hydration Products
- Recovery Nutrition
- Energy Bars & Chews

**Origin toggle:** ALL / 🇮🇳 India / 🌐 International

**Budget Tier:** ALL / L1 / L2 / L3

**Dietary filter checkboxes:** Vegan / Gluten-Free / Dairy-Free / Caffeine-Free

**Anti-Doping toggle:** When enabled, shows only Informed Choice / Informed Sport certified products.

---

### Sort Options

Sort the grid by cost-efficiency metrics:

| Sort | What It Means |
|------|---------------|
| **Cost per 25g carb** | ₹ per 25g of carbohydrate. Lower = cheaper fuel. |
| **Cost per 500mg sodium** | ₹ per 500mg of sodium. Lower = cheaper electrolytes. |
| **Cost per 20g protein** | ₹ per 20g of protein. Lower = cheaper recovery. |
| **Price** | Raw price per serving, lowest first. |

These metrics let you compare products fairly regardless of serving size. A gel with 22g carbs at ₹180 and a sachet with 50g carbs at ₹300 are hard to compare by price alone. Sorting by cost per 25g carb puts them on the same scale.

---

### Product Cards

Each card shows:
- Brand, tier badge, anti-doping badge (if certified)
- Product name and formulation type (Hydrogel, Isotonic Gel, Electrolyte Powder, etc.)
- Nutritional panel: Carbs / Sodium / Protein per serving, plus caffeine if applicable
- Price per serving in ₹
- Three cost-efficiency metrics
- Dietary tags (Vegan, Gluten-Free, etc.)
- **BUY FROM OFFICIAL SITE** button

---

### FDA-Style Nutrition Panel

Click **View Full Nutrition Panel** (or **Show Panel** button where available) on any product to see the complete nutrition breakdown in an FDA-style table: total fat, saturated fat, carbohydrates, sugars, protein, sodium, caffeine.

---

### Buying Products

Every **BUY FROM OFFICIAL SITE** button:
1. Records a telemetry event (product, your session context, timestamp) to localStorage and SQLite.
2. Opens the official manufacturer website in a new tab.
3. Never redirects to Amazon, Flipkart, Nykaa, or any marketplace. Products are only linked to brand-owned stores or official distributors.

---

## 7. Tab 4 — Post-Workout Feedback

This tab (and the floating **Post-Workout Survey** modal) is where the adaptive learning loop lives.

After every session, return here and log one of four outcomes:

---

### The Four Outcomes

**Severe Muscle Cramping** (amber)  
Involuntary calf, quad, or hamstring cramps during or after the session.

*Engine response:* Sodium multiplier increases by +0.15 (15%). If you were at 1.0×, it becomes 1.15×. Future sessions calculate 15% more sodium per hour automatically. The flag `historical_cramping` is set permanently — a +200mg sodium buffer is always applied going forward.

---

**Stomach Sloshing / Bloating** (blue)  
Gastric fullness, nausea, or gut distress during the session.

*Engine response:* The product catalog is locked to Hydrogel and Isotonic formulations only. These digest without osmotic disturbance. Standard hypertonic gels are hidden from your recommendations. The filter shows in the Session Planner as a yellow banner: "Gut-Safe Filter Active."

---

**Energy Crash / Bonk** (orange)  
Sudden fatigue, brain fog, or legs running out of fuel in the second half of the session.

*Engine response:* Carbohydrate multiplier increases by +0.15 (15%). If you were at 1.0×, it becomes 1.15×. Future sessions calculate 15% more carbs per hour automatically.

---

**Optimal Gut & Energy** (green)  
Everything worked. Steady pacing, zero GI issues, strong finish.

*Engine response:* No adjustment. Your current baseline is validated. The entry is logged to history to build a record of effective sessions.

---

### AI Physiological Explanation

After selecting an outcome, an **AI Physiological Explanation** button appears. Click it to get a detailed scientific explanation of why the symptom occurred and how the engine's adjustment will prevent it. This requires an AI provider to be configured in your profile. Without one, a pre-written scientific explanation is shown.

---

### Current Multiplier Badges

At the top of the feedback view you can see your live multipliers:
- **Carb Multiplier**: starts at 1.00×, increases with each Energy Crash logged
- **Sodium Multiplier**: starts at 1.00×, increases with each Cramping event logged
- **Hydrogel Lock**: OFF (normal) or ACTIVE (locked after a Bloating event)

---

### Reset Baselines

The **Reset Baselines** button (top-right of the feedback view) resets carb multiplier, sodium multiplier, and isotonic filter to their defaults (1.0×, 1.0×, OFF). Use this if you have improved your gut training significantly, changed products, or want to restart the adaptive process from scratch.

---

### Feedback History

Below the outcome selection, a table shows your complete feedback log — every outcome ever logged with its session context, before/after multipliers, and timestamp.

---

## 8. Tab 5 — History & Data

This tab (previously labelled "B2B Analytics") gives you visibility into your activity history and lets you export your data.

Every time anyone clicks a **BUY FROM OFFICIAL SITE** button, the following data is logged:
- Click ID (UUID)
- Product (brand, name, tier)
- Workout context (duration, intensity, temperature)
- Calculated targets at the time of click (carbs/hr, sodium/hr, fluids/hr)
- Official store URL
- Timestamp

This data never leaves your browser. It is stored in localStorage and the in-browser SQLite engine.

---

### Analytics Dashboard

The dashboard shows:
- **Total Clicks Recorded** — Number of outbound product interest events
- **Unique Brands Engaged** — How many different brands have been clicked
- **Most Recent Click** — The last product and brand that was clicked
- **Clicks by Brand** — Breakdown of which brands attracted the most clicks

Below the summary, a full event log table lists every click.

---

### Advanced / Export (collapsed accordion)

Click **"Advanced / Export ▼"** to expand the advanced features.

#### Inspect an Event

Click the **eye icon** on any event row to see the full telemetry payload in a modal — the complete JSON object that was recorded, including all workout context fields.

#### Export Options

**Download JSON**: Exports all telemetry events as a `.json` file.  
**Download CSV**: Exports the same data as a `.csv` spreadsheet (compatible with Excel and Google Sheets).

#### SQL Query Console

A live SQL terminal connected to the in-browser SQLite engine. Type SQL queries and press Enter to run them. Supported operations: `SELECT`, `INSERT INTO`, `UPDATE`, `DELETE FROM`, `SHOW TABLES`, `PRAGMA table_info(table_name)`.

Example queries are shown in the FAQ section.

```sql
-- Show all recorded tables
SHOW TABLES

-- View all click events
SELECT * FROM telemetry_events LIMIT 10

-- See which brands were most clicked
SELECT brand_name, COUNT(*) AS clicks FROM telemetry_events GROUP BY brand_name

-- Find all sessions longer than 2 hours
SELECT * FROM workout_sessions WHERE duration_mins > 120

-- View your feedback history
SELECT * FROM feedback_logs ORDER BY timestamp DESC LIMIT 20

-- View all products in the catalog
SELECT brand, name, tier, carbs_g, sodium_mg, price_inr FROM products ORDER BY carbs_g DESC

-- Check your athlete profile state
SELECT * FROM athlete_profiles
```

Supported SQL: `SELECT`, `INSERT INTO`, `UPDATE`, `DELETE FROM`, `SHOW TABLES`, `PRAGMA table_info(table_name)`.

---

### Clear All Data

The **Clear Data** button (requires confirmation) wipes all telemetry events. It does not affect your athlete profile, session history, or feedback logs.

## 9. Feature Launcher — The 5 Power Tools

After your first session calculation, a launcher bar appears above the tab bar with five quick-access buttons. These open overlay panels on top of whichever tab you're on.

> **First-time users:** Before you have calculated any session, this bar shows a single prompt — "Calculate your first session to unlock these tools →" — pointing you to the Session Planner. The tools unlock the moment you hit Calculate for the first time and stay unlocked permanently.

---

### AI Sports Scientist (orange sparkle)

A side-drawer chat interface with a context-aware sports science AI.

The AI knows your current session parameters — it reads your duration, intensity, temperature, and calculated targets before you even send a message.

**Two modes inside the drawer:**

**Copilot Chat:**  
Type any question about fueling, electrolytes, gut training, or race execution. The AI answers based on sports science literature and your specific session context. Quick-question buttons are shown on first open to give you a starting point:
- Why do I need electrolytes before I feel thirsty?
- How does heat affect carbohydrate oxidation rate?
- What is the difference between hydrogel and standard gel?
- When should I switch from glucose to glucose+fructose combo?
- What causes the "bonk" and how do I avoid it?
- How do I train my gut for 90g carbs per hour?

**Race Briefing:**  
Click the **Race Briefing** tab, then click **Generate AI Race-Day Briefing**. The AI produces a complete, structured briefing for your specific session: pre-load timing, during-race cadence, post-race recovery, and the physiological reasoning behind each recommendation. You can copy the briefing to your clipboard.

Both modes require an AI key configured in the Athlete Profile tab. Without one, pre-written scientific fallback responses are used.

---

### Live Fueling Timer (blue clock)

A countdown timer that tells you exactly when to fuel during your session.

**How it works:**
1. Click the button to open the timer panel.
2. The app pre-builds a checklist of fueling events for your session — based on your duration, interval rhythm (every 45 minutes), and recommended products.
3. Press **Play** to start the countdown.
4. The timer counts up. At each 45-minute mark, an audible beep fires (uses Web Audio API — allow audio in your browser).
5. A checklist item highlights when it's time to take a gel or drink.
6. Tick each item as you complete it.

**Volume control:** A speaker icon in the timer toggles the audio alert on/off.

**Use case:** Put this on a phone or tablet visible at your treadmill, indoor trainer, or for a supported outdoor long run where a crew member can see it.

---

### Custom Fuel Stack Builder (amber cart)

Build your own hourly fueling combination and validate it against your calculated targets.

**How it works:**
1. The panel shows all DURING-phase products from the catalog.
2. Click **+** to add a product to your stack. Click **−** to remove servings.
3. As you build, three gauges appear:
   - Carbs gauge: measures your stack's total carbs/hr against your target
   - Sodium gauge: measures sodium/hr against target
   - Fluids gauge (if applicable)
4. Each gauge has a **±15% tolerance window** — the green zone. If your stack lands within ±15% of target, the gauge turns green and a ✓ appears.
5. If you're under target (amber gauge), add more servings. If you're over (red gauge), remove some.

**Use case:** You want to mix a Maurten gel with Fast&Up Reload powder to hit your exact targets without overpaying for more product than you need.

---

### Race Simulator (orange gauge)

Simulates how your fueling targets change under three common race-day stress scenarios.

**Three toggles:**

**Heat Spike (+4°C):** Simulates the temperature rising 4 degrees above your configured baseline — a common scenario when morning race start conditions change by mid-race. Shows the new sodium and fluid targets.

**Pace Drop (−15% intensity):** Simulates slowing down or easing effort. Carbohydrate requirements drop proportionally. Useful for practicing decision-making on when to ease off fueling if you back off pace.

**GI Stress (stomach problems mid-race):** Caps carbohydrate intake at 60g/hr to protect the gut. Models the scenario where you must back off gel frequency due to nausea.

The simulator shows the delta (change) for each target — a red arrow down means the target drops, an up arrow means it rises. At the bottom, a **Crew Chief Directive** text block gives plain-language instructions for each active scenario combination.

**Use case:** Pre-race mental preparation. Run every scenario combination and know exactly how to adjust your fueling if conditions change on race day.

---

### Post-Workout Survey (purple rotation)

A quick-access shortcut to the adaptive feedback modal, identical to Tab 4 but as a floating overlay. Appears instantly from any tab.

---

## 10. How the Fueling Math Works

Understanding the formulas gives you confidence in the numbers and helps you explain them to a coach or nutritionist.

---

### Environmental Factor (E)

```
E = 1.0   if temperature < 22°C
E = 1.2   if 22°C ≤ temperature ≤ 30°C
E = 1.4   if temperature > 30°C
```

E multiplies both the sodium target and the fluid target. Heat means more sweat, more electrolyte loss, and more fluid need.

---

### Intensity Modifier (I)

```
I = 0.8  for LOW intensity (Zone 1–2)
I = 1.0  for MID intensity (Zone 3)
I = 1.2  for HIGH intensity (Zone 4–5)
```

I multiplies the carbohydrate base rate. The harder you work, the faster you burn glycogen.

---

### Hourly Carbohydrate Target

```
Duration ≤ 60 min  → 0 g/hr  (endogenous stores sufficient)
Duration 61–120 min → 30g/hr × I
Duration 121–180 min → 60g/hr × I
Duration > 180 min  → 90g/hr × I  (capped at 90g biological ceiling)
```

After applying the intensity modifier, the adaptive carb multiplier from your feedback history is applied:

```
Final carbs = min(raw_carbs × carb_multiplier, 90g)
```

The 90g ceiling is the maximum the human small intestine can absorb using glucose + fructose (GLUT5 + SGLT1 transport channels, per Jeukendrup 2004).

---

### Hourly Sodium Target

```
Sodium base = 400mg × E
Cramping buffer = 200mg (if cramping history = YES)
Final sodium = (sodium_base + cramping_buffer) × sodium_multiplier
```

---

### Hourly Fluid Target

```
If custom sweat rate is set:
  Fluids = sweat_rate_L_hr × 1000ml × E

If no custom sweat rate:
  Fluids = 500ml × E
```

---

### Pre-Workout Carb Priming

```
Pre-carbs = 1.0g × athlete_weight_kg
Active only when duration > 90 minutes
Timing: 45–60 minutes before start
```

---

### Post-Workout Recovery Targets

```
Protein = 22g  (fast-absorbing whey isolate or plant peptide)
Recovery carbs = 22g × 3.5 = 77g
Window = within 30 minutes post-exercise
```

---

## 11. Understanding Your Results

### What "Total Session" means

The strategy view shows both hourly rates and session totals:

- **Hourly carbs × (duration in hours)** = total carbs to consume during the workout
- **Hourly sodium × (duration in hours)** = total sodium to replace
- **Hourly fluids × (duration in hours)** = total fluid volume to drink

**Example:** 3-hour run, HIGH intensity, 32°C, 70 kg body weight, cramping history:
- E = 1.4 (>30°C)
- I = 1.2 (HIGH)
- Carbs: 90g × 1.2 = 108g → capped at 90g/hr → × 3h = **270g total**
- Sodium: (400 × 1.4 + 200) × 1.0 = 760mg/hr → × 3h = **2,280mg total**
- Fluids: 500 × 1.4 = 700ml/hr → × 3h = **2,100ml total**

That means roughly 11 gels (25g carbs each), 4–5 electrolyte sachets (500mg sodium each), and 2.1 litres of fluid. The strategy view does this arithmetic for you.

---

### Tier Badges Explained

| Badge | Colour | Meaning |
|-------|--------|---------|
| **L1** | Orange | Premium scientific. Maurten Hydrogel, Unived Elite. Research-validated formulations. |
| **L2** | Amber | Balanced performance. Fast&Up, SiS, GU. Proven in mass-market racing. |
| **L3** | Blue | Value essential. Enerzal, Electral. Accessible products for everyday training. |

---

### Anti-Doping Badge

A green **✓ Informed Choice** badge on a product means it has been third-party batch-tested for prohibited substances under the Informed Choice or Informed Sport certification programmes. If you are a competitive athlete subject to testing, only use certified products.

---

## 12. The Adaptive Learning Loop

The adaptive multipliers are the system's memory. They accumulate over sessions to build a fueling protocol tuned specifically to your body.

**How multipliers compound:**

If you log two Energy Crash outcomes:
- After 1st crash: carb_multiplier = 1.15
- After 2nd crash: carb_multiplier = 1.30
- After 3rd crash: carb_multiplier = 1.45

This continues until your body is adequately fueled or until you log an Optimal outcome (which does not change the multiplier, but validates the current level). There is no automatic ceiling — if you keep crashing, the system keeps raising targets.

**Recommendation:** Log at least 5–8 sessions before trusting the multipliers to have converged on your true fueling needs. Early sessions may overcorrect.

**When to reset:**
- If you change products (e.g., switching from hypertonic gels to hydrogel, your gut issues may resolve)
- If you trained your gut for 6 months and no longer get bloating
- If a multiplier feels too aggressive (e.g., 1.60× carbs feels excessive)

Use **Reset Baselines** in the feedback tab to return to 1.0× × 1.0× with filter off.

---

## 13. Product Catalog & Buying

### The 39 Products

The catalog covers five categories from 15 manufacturers:

**Domestic Indian brands (8):** Unived, Fast&Up, Steadfast Nutrition, Enerzal, Electral, Leap, MuscleBlaze, Cosmix

**International brands (7):** Maurten, Science in Sport (SiS), GU Energy, Precision Fuel & Hydration, Tailwind, Hammer Nutrition, High5

### The Outbound Link Rules

Every product link goes directly to the brand's own website. The app enforces this — it validates the URL is not from Amazon, Flipkart, Nykaa, Nutrabay, or any marketplace before allowing the redirect. If a product had a marketplace URL in the data, it would throw an error rather than redirect.

This design is intentional. Manufacturer websites have:
- Current pricing
- Full ingredient lists and certifications
- Direct warranty and freshness guarantees
- No counterfeit risk

### Cost-Efficiency Comparisons

The Product Compare tab lets you sort by cost per unit of nutrition:

**Cost per 25g carb** is the most useful for comparing energy products. If Maurten Gel 100 costs ₹350 and delivers 100g carbs (₹87.50 per 25g carbs), and Fast&Up Energy Gel costs ₹120 and delivers 22g carbs (₹136 per 25g carbs), Maurten is more cost-efficient per gram of carbohydrate despite the higher price.

---

## 14. Practical Workflows — Step by Step

### Workflow A: Your First Time Using Pyrofit

1. Open `http://localhost:3000` and click **"OPEN PYROFIT"**.
2. You see a welcome card: "Set up in 60 seconds" with three steps outlined.
3. Click **"Set Up My Profile →"**.
4. Fill in **Section A** (Sport, Experience, Goal) — these are the core fields.
5. Click **Save Athlete Profile** at the bottom. A green banner confirms.
6. You are taken to the **Session Planner** tab automatically.
7. The three **Required** fields are shown: Duration, Intensity, Temperature.
8. Set a 90-minute run at MID intensity in 25°C weather.
9. Click **Calculate Fueling Protocol**.
10. The strategy view appears with your three metric cards and three-phase plan.
11. Review the numbers. Scroll down to see recommended products.
12. The **Feature Launcher** bar now appears at the top with all five power tools unlocked.

That's it. You now know the core Pyrofit workflow.

### Workflow B: Planning a Half Marathon (21 km)
2. **Session Planner** → Set duration to 120 minutes (or your target finish time). Set intensity to MID. Enter race location, fetch live weather on race morning.
3. **Calculate Fueling Protocol**.
4. **Phase 01**: 60–65g carbs (1.0 × 65kg) 45 mins before start. Have a banana + gel.
5. **Phase 02**: ~45g/hr carbs, ~600mg/hr sodium. Take one gel (22g carbs) at 45 min and 90 min. Drink electrolyte drink at every aid station.
6. **Post-race**: Within 30 mins, 22g protein + 77g carbs.
7. After the race: Return to **Post-Workout tab**, log your outcome (Optimal / Cramped / Crashed / Bloated). The system will adjust next session.

---

### Workflow C: Hot-Weather Long Run (Indian Summer, 35°C, 3 hours)

1. **Session Planner** → Duration: 180 min. Intensity: MID. Temperature: 35°C (or fetch weather). Enable Cramping Susceptibility (hot weather increases cramp risk).
2. At 35°C, E = 1.4. Sodium target: (400 × 1.4 + 200) × multiplier = 760mg/hr minimum.
3. **Calculate** → Your fluid target will be ~700ml/hr. Prepare at least 2.1 litres.
4. **Custom Fuel Stack Builder** → Build a combination of electrolyte tabs + fast&up Reload powder that hits 760mg sodium/hr within ±15%.
5. **Live Fueling Timer** → Start the timer when you begin running. The 45-minute beep cadence will keep you on schedule.
6. After the run: Log feedback. If you still cramped despite the buffer, the system auto-increases sodium for next time.

---

### Workflow D: Race Week Taper

1. **Profile tab** → Update Training Phase to **Taper**. Set your Race Date. Update Recovery Score (should be rising through taper).
2. The race countdown banner appears at the top of the Hub.
3. **Session Planner** → Run taper sessions (shorter, lower intensity). Keep logging to maintain your feedback history.
4. **Day before race**: Run a 30-minute easy shakeout, calculate a 30-min LOW intensity session. No fueling needed during (sub-60min), but check your pre-race carb-loading target.
5. **Race morning**: Session Planner → Set exact race distance and expected finish time as duration. Fetch live weather. Calculate. This is your race-day fueling card.
6. **AI Sports Scientist** → Click Race Briefing tab → Generate AI Race-Day Briefing. Print or screenshot it for your crew.

---

### Workflow E: First Time, No Profile (Absolute Beginner)

1. Open the Hub. The app sends you to Profile tab automatically.
2. Fill in Sport, Experience, Goal, Weight. Leave everything else at defaults.
3. Click Save. You are taken to the Session Planner.
4. Set Duration to 60 minutes, Intensity to LOW, Temperature to 20°C.
5. Calculate. For a 60-minute easy run, your carb target is 0 g/hr — no fueling needed.
6. For your next run (90 min), calculate again. Now carbs will be 24g/hr (30g × 0.8 MID).
7. Log feedback after each run. After 3–5 sessions you'll start to see your multipliers stabilise.

---

## 15. Frequently Asked Questions

**Q: How do I get started if I'm completely new?**  
Open the app and click **"OPEN PYROFIT"**. You'll see a welcome card with three steps. Follow it — fill your profile, then configure a session, then calculate. The entire first workflow takes about 3–5 minutes. All advanced features unlock automatically after your first calculation.

**Q: Why are some buttons greyed out when I first open the Hub?**  
The AI Sports Scientist, Live Timer, Custom Fuel Stack, Race Simulator, and Post-Workout Survey buttons are intentionally locked until you have calculated at least one session. This keeps the interface clean on first use. Once you hit Calculate for the first time, they all unlock and stay unlocked.

**Q: What does "Advanced Options" mean?**  
The Session Planner shows three required fields by default: Duration, Intensity, and Temperature. Click the **Advanced Options** toggle to reveal optional settings like Cramping Susceptibility, Training Phase, and Altitude. These refine your fueling calculation but are not required for a basic session plan.

**Q: Does Pyrofit work for Cycling?**  
Yes. Select Cycling in your profile. The math engine applies equally to any endurance sport. Future versions will add cycling-specific carbohydrate oxidation rates.

**Q: Why is my carb target 0g/hr?**  
Your session is under 60 minutes. At that duration, your muscle glycogen stores are sufficient and exogenous carbs are not needed. This is correct per ACSM guidelines. If your session is 61 minutes or longer, carb fueling begins.

**Q: What does the ±15% tolerance mean in the Custom Stack Builder?**  
Sports science research shows that fueling within 85–115% of the calculated target delivers essentially the same physiological benefit as hitting it exactly. Anything within that window is a green result. The tolerance exists to make real-world product combinations practical — it's rarely possible to hit an exact number with a fixed serving size.

**Q: What is the wet-bulb temperature and why does it matter?**  
The wet-bulb temperature accounts for both heat and humidity. At high humidity, sweat evaporates more slowly, meaning the body cannot cool itself as effectively. When wet-bulb temperature exceeds 28°C, the warning banner in the weather panel will tell you. At that point, sodium targets are already at their maximum (E = 1.4 if temp >30°C) and you should consider reducing intensity.

**Q: My AI Sports Scientist shows "⚠️ AI offline" — what do I do?**  
No AI key is configured, or the configured provider is not reachable. Go to the Athlete Profile tab and configure an AI provider (OpenAI, Gemini, Anthropic, or Mistral). The fallback responses that appear when AI is offline are still scientifically accurate — they are pre-written from sports science literature.

**Q: Where is my data stored?**  
Entirely in your browser's `localStorage`. Nothing is sent to any external server except for:
- Open-Meteo API (free, no account) when you fetch live weather
- Your chosen AI provider when you use the AI Scientist (only if you configure one)
- The official manufacturer website when you click Buy (this opens their site, no data is sent)

**Q: Can I export my session data?**  
Yes. The B2B Analytics tab lets you export telemetry click events as JSON or CSV. For session and feedback data, use the SQL console: `SELECT * FROM workout_sessions` or `SELECT * FROM feedback_logs`, then copy the results.

**Q: Why do products only link to official manufacturer sites?**  
Product quality, freshness, and authenticity are guaranteed on official websites. Marketplace links introduce counterfeit risk. The app also explicitly blocks Amazon, Flipkart, Nykaa, and Nutrabay URLs from being clickable — the validation runs at click time.

**Q: Can I add my own products?**  
Not through the UI. The catalog is a curated set of 39 products with verified nutritional data. If you want to test a custom product's nutritional contribution, use the Custom Fuel Stack Builder — you can manually reference its nutrition panel and find the nearest catalog equivalent with similar macros.

**Q: Does the app work offline?**  
Most of it, yes. The fueling calculator, product catalog, session history, and feedback loop all work without an internet connection. Live weather fetch and AI features require internet. The app caches everything in localStorage, so your data persists.

**Q: I reset my baselines by mistake. Can I get them back?**  
No — there is no undo for the reset. The SQLite engine and localStorage are wiped to defaults (1.0×, 1.0×, isotonic filter off). You will need to re-log feedback sessions to rebuild your multipliers. This is by design — a reset is an intentional restart.

---

*Pyrofit is a decision-support tool, not a substitute for professional medical or nutritional advice. Always consult a sports dietitian or physician for significant medical conditions, extreme race distances, or elite competition.*
