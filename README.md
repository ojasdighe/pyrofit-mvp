# Pyrofit MVP — Precision Endurance Fueling & Outbound Lead Telemetry Platform

A full-stack web application for endurance athletes: science-backed fueling plans, a 39-product nutrition catalog from 15 official manufacturers, adaptive ML feedback, live weather integration, and a B2B brand telemetry portal.

---

## Quick Start

```bash
cd c:\Workspace\pyrofit_mvp
npm install
npm run dev
```

Open `http://localhost:3000`. FreeLLM API must be running on `http://localhost:3001` for AI features.

---

## Architecture Overview

### Core Math Engine (`src/lib/fuelEngine.ts`)
Fully deterministic — no AI estimation in any calculation.

| Formula | Rule |
|---|---|
| Environmental Factor E | T < 22°C → 1.0 · 22–30°C → 1.2 · >30°C → 1.4 |
| Intensity Modifier | LOW → 0.8 · MID → 1.0 · HIGH → 1.2 |
| Carbs/hr | ≤60min: 0g · 61-120min: 30g×I · 121-180min: 60g×I · >180min: 90g×I (90g ceiling) |
| Sodium/hr | (400mg × E + C × 200mg) × sodium_multiplier |
| Fluids/hr | 500ml × E (or sweat_rate_l_hr × 1000 × E if custom rate set) |

### 5-Tab Navigation
| Tab | Route | Purpose |
|---|---|---|
| Athlete Profile | `/profile` | Full Section 2.1/2.2 form — sport, body, dietary, preferences, training cycle, race countdown |
| Session Planner | `/planner` | Configurator + 3-phase fueling strategy + session history |
| Product Compare | `/compare` | 39-product filterable grid with FDA nutrition panels + cost-efficiency metrics |
| Post-Workout | `/feedback` | Adaptive ML feedback loop + AI physiological explainer |
| B2B Analytics | `/analytics` | Outbound click telemetry portal + JSON/CSV export |

### Feature Launcher
- **AI Sports Scientist** — context-aware chat + race-day briefing via FreeLLM API (`gemini-flash` / `auto`)
- **Live Fueling Timer** — real countdown with AudioContext beep alerts and fuel checklist
- **Custom Fuel Stack Builder** — build hourly combos with ±15% tolerance gauge validation
- **Race Day Simulator** — 3 scenario toggles (Heat Spike / Pace Drop / GI Stress) with deterministic crew-chief directive
- **Post-Workout Survey** — 4-outcome adaptive feedback modal

### Product Catalog (`src/data/productCatalog.ts`)
39 products across 5 categories, 15 manufacturers:

**Domestic (India):** Unived · Fast&Up · Steadfast Nutrition · Enerzal · Electral · Leap · MuscleBlaze · Cosmix

**International:** Maurten · Science in Sport · GU Energy · Precision Fuel & Hydration · Tailwind · Hammer Nutrition · High5

Every product includes full nutritional composition, `official_url` to manufacturer's store only (no marketplaces), `anti_doping_certified`, `dietary_tags`, and pre-computed cost-efficiency metrics (₹/25g carb, ₹/500mg Na, ₹/20g protein).

### Database (`src/lib/sqliteEngine.ts`)
In-browser SQLite engine backed by localStorage. Tables:
- `athlete_profiles` — full profile with ML multipliers
- `workout_sessions` — every calculated session logged on "Calculate"
- `telemetry_events` — outbound click records per spec Section 7
- `feedback_logs` — adaptive feedback history with before/after multipliers

### Live Weather (`src/lib/weatherService.ts`)
Open-Meteo geocoding + forecast APIs (free, no key). City name → lat/lon → current temperature, humidity, apparent temperature, wind speed. Wet-bulb temperature computed via Stull 2011 formula. Auto-fills planner on fetch.

### Adaptive ML Loop
Post-workout feedback updates persistent multipliers:
- **Cramping** → `sodium_multiplier += 0.15`
- **Bloating** → `filter_isotonic_only = true` (Hydrogel/Isotonic products only)
- **Energy Crash** → `carb_multiplier += 0.15`
- **Optimal** → validates current baseline

### Telemetry & B2B
Every "Buy from Official Store" click fires `handleOutboundManufacturerClick` which:
1. Validates `official_url` is not a marketplace (Amazon/Flipkart/Nykaa blocked)
2. Logs full payload to localStorage + SQLite
3. Opens manufacturer URL in new tab (`target="_blank" rel="noopener noreferrer"`)

---

## Non-Negotiable Constraints
- Zero in-app checkout or payment UI
- Official brand URLs only — no Amazon, Flipkart, Nykaa, or Nutrabay
- Product ranking by nutritional fit + cost-efficiency only — never by ratings or reviews
- All fueling calculations are deterministic code — no generative AI estimation

---

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS (custom dark design tokens)
- FreeLLM API (`http://localhost:3001/v1`) for AI features
- Open-Meteo (no key) for live weather
- localStorage-backed in-browser SQLite engine
