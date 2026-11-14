# STRIDD (stridd.run) — High-Fidelity Clone

A pixel-perfect, fully-functional clone of **[STRIDD (stridd.run)](https://stridd.run)** — an elite running training plans & blueprints platform built on 10 training methodologies (Norwegian Double Threshold, Daniels VDOT, Lydiard Aerobic Base, Hansons Cumulative Fatigue, Maffetone MAF, Galloway Run-Walk, etc.).

---

## 🚀 Features Replicated

1. **Aesthetic & Design System**:
   - **Color Palette**: High-contrast dark carbon theme (`#080808`), Volt yellow / neon lime accent (`#CCFF00`), Strava orange (`#FC4C02`), dark surface cards (`#131313`, `#1a1a1a`), subtle borders (`#262626`).
   - **Typography**: Google Fonts `Oswald` (bold condensed italic display headings `italic-heavy`), `Inter` (body copy), and `Space Grotesk` (data labels, metrics, badges).
   - **Animated Marquee Ticker**: `STRIDD.RUN // FREE TO USE // OPTIONAL ACCOUNT // 10 METHODOLOGIES...`
   - **Service Notice**: Strava API sunset banner & Garmin / Suunto / COROS integration context.
   - **Interactive Theme Switcher**: Toggle between Dark mode (`#080808`) and Light mode.

2. **The Architect Engine (`src/lib/architectEngine.ts`)**:
   - **Jack Daniels VDOT Pacing**: Derives 7 calibrated training zones (Easy, Recovery, Tempo, Interval, Long, Marathon Pace, Hill).
   - **Riegel Race Prediction Formula**: $T_2 = T_1 \times (D_2 / D_1)^{1.06}$ for predicting finish times and equivalent performances.
   - **10 Methodologies**:
     - *Norwegian Model*: Double Threshold precision sessions.
     - *Daniels VDOT*: Pacing science calibrated from VO₂max.
     - *Lydiard*: Massive aerobic base before sharpening.
     - *Hansons*: Long run capped at 26km with cumulative fatigue.
     - *Maffetone (MAF)*: 180-minus-age heart rate ceiling.
     - *FIRST (3+2)*: 3 quality days + 2 cross-training.
     - *Kenyan Progression*: Progressive pace acceleration.
     - *Galloway Run-Walk*: Strategic walk breaks for beginners.
     - *Van Aaken*: 95% slow volume + sprint neurology.
     - *Japanese Ekiden*: High-volume group endurance blocks.
   - **Periodisation Curves**: Base, Build, Peak, Taper phases with scheduled recovery weeks every 3–4 weeks.

3. **Interactive Plan Generator (`PlanGeneratorModal.tsx`)**:
   - Distance selection (5K, 10K, Half Marathon, Marathon, Custom Ultra km).
   - Goal strategy (Target Finish Time vs. Just Finish Healthy).
   - Athlete fitness level calibration (Beginner, Intermediate, Advanced, Elite).
   - Custom weekly training days picker (Mon–Sun) with long run assignment.
   - Automatic or manual methodology assignment with explanatory reasoning.
   - Confetti celebration upon generation!

4. **Couch-to-5K Foundation Mode**:
   - Dedicated onboarding for complete beginners.
   - 4 Motivations (First 5K, Weight Loss, Running with Friends, Doctor's Orders).
   - 4 Activity levels (Brisk walker, Occasional walks, Zero exercise, Post-injury).
   - Progressive 8-week run-walk schedule with motivational coaching notes for each week.

5. **Full Weekly Schedule & Workout Inspector (`PlanViewerModal.tsx`)**:
   - Week-by-week selector ribbon.
   - Phase badge, target volume, and quality sessions counter.
   - 7-day workout cards with archetype color badges.
   - Expandable detailed session drawer:
     - Structured interval step breakdowns (Warm-up, Work reps, Recovery jogs, Cool-down).
     - Target pace range ($min/km$).
     - Physiological goals ("What" & "Why").
     - Heart rate targets & conversational effort landmarks.
   - CSV Export & Print view!

6. **Running Mathematics Calculators (`CalculatorsModal.tsx`)**:
   - **Race Predictor**: Instant Riegel projection across 5K, 10K, Half, Full, 50K.
   - **VDOT Pace Calculator**: Exact Jack Daniels training intensity zones.
   - **Pace Converter**: Min/km $\leftrightarrow$ Min/mile $\leftrightarrow$ km/h $\leftrightarrow$ mph.

7. **All Content Sections**:
   - Hero banner with split image & metric stats.
   - Four Ways In (Pick a race, Start from zero, Chase a VDOT, Train through life).
   - Training Science ("Every km has a job").
   - What You Get ("Your plan. Decoded.").
   - More Than A Plan.
   - STRIDD Run Club.
   - Go Deeper (11 interactive knowledge cards).
   - The Running Lab (Gear & shoe guides, comparisons, best-of).
   - The Four Levers (Consistency, Periodisation, Specificity, Recovery).
   - Real Athlete Testimonials (Sneha, Arjun, Meera, Vikram, Deepa, Karthik).
   - Accordion FAQ with all 11 questions.
   - Full Multi-column Footer.

---

## 🛠️ Quick Start

```bash
# Navigate to the project
cd C:\Users\ojasd\.gemini\antigravity\scratch\stridd-clone

# Start the development server
npm run dev

# Or preview the production build
npm run preview
```

Open `http://localhost:3000` in your browser.
