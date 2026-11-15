# Pyrofit MVP — UX Findings

## HIGH

### H1: "OUTBOUND TELEMETRY PLATFORM" jargon in page title and banner
- **Where:** `src/components/pyrofit/PyrofitHub.tsx` (platform subtitle), `src/App.tsx` (top banner strip)
- **Problem:** The subtitle reads "ATHLETE FUELING & OUTBOUND TELEMETRY PLATFORM" and the top callout strip on the Plans page reads "PYROFIT ATHLETE FUELING & OUTBOUND TELEMETRY PLATFORM ACTIVE". "Outbound telemetry" means nothing to an athlete. It is internal product language for the B2B lead-tracking feature.
- **Why it matters:** A new user sees "OUTBOUND TELEMETRY" at the very first moment and has no idea what it means. It signals the app is complicated or is doing something to their data, which may feel invasive.
- **Fix:** Replace "OUTBOUND TELEMETRY" with plain language. Subtitle → "ATHLETE FUELING CALCULATOR". Banner strip → "PYROFIT FUELING CALCULATOR ACTIVE". Keep the sub-label (Exact Carbs g/hr, Sodium mg/hr, Fluids ml/hr) which is clear.

### H2: "Deterministic Mathematical Engine · Zero AI Guesswork" at the bottom of Session Planner CTA
- **Where:** `src/components/pyrofit/WorkoutConfigurator.tsx` (the grey text above the Calculate button)
- **Problem:** "Deterministic Mathematical Engine" is developer-speak. Athletes do not think in those terms; they want to know that the numbers are reliable. Putting this technical claim directly above the main CTA button is visual clutter that dilutes the action.
- **Why it matters:** The last thing a user reads before clicking the primary action should reinforce what they're about to get, not make them decode a phrase. It may cause hesitation.
- **Fix:** Replace with plain copy: "Science-based formula · Personalised to your body and conditions"

### H3: "ISOTONIC ONLY" gut-safe filter banner uses unexplained term
- **Where:** `src/components/pyrofit/WorkoutConfigurator.tsx` (the orange banner shown when `filterIsotonicOnly` is true)
- **Problem:** The banner says "Gut-Safe Filter On — only easy-to-digest products shown" which is actually good. However the badge in `FeedbackView.tsx` for the BLOATING outcome shows "Hydrogel Lock" and in `FeedbackView.tsx` the adaptive state panel shows "Hydrogel Lock" as the label for `filter_isotonic_only`. "Hydrogel" and "Isotonic" are not the same thing, and neither is explained for a non-sports-scientist.
- **Why it matters:** The disconnect between "Gut-Safe Filter" (clear) and "Hydrogel Lock" (jargon) in the adaptive state panel means a user who sees "Hydrogel Lock: ACTIVE" after submitting a bloating report does not know what changed or what to do about it.
- **Fix:** Rename "Hydrogel Lock" to "Gut-Safe Filter" everywhere it appears in `FeedbackView.tsx` to be consistent with the already-good WorkoutConfigurator label.

### H4: Post-Workout tab is ambiguous — unclear whether it means history OR a feedback form
- **Where:** `src/components/pyrofit/PyrofitHub.tsx` (tab label "Post-Workout")
- **Problem:** "Post-Workout" can mean "after the workout I just did" (which is the feedback form intent) or "history of past workouts" (which a user might also expect). The History & Data tab already holds some history. A new user choosing between "Post-Workout" and "History & Data" does not know which to click to log how they felt.
- **Why it matters:** Confusion at tab selection is a dead end. If they click the wrong tab, the adaptive feedback loop never fires and their profile never improves.
- **Fix:** Rename "Post-Workout" to "Rate My Session" to make the action crystal clear.

### H5: "History & Data" tab content is B2B/developer-focused — wrong audience framing
- **Where:** `src/components/pyrofit/ManufacturerAnalyticsPortal.tsx` (tab heading, KPI cards)
- **Problem:** The History & Data tab opens with "PYROFIT B2B // TELEMETRY & OUTBOUND REFERRAL ENGINE" and "MANUFACTURER LEAD INTELLIGENCE". KPI cards say "Zero Marketplace Leaks" and "Total Outbound Referrals". An athlete who navigates here expecting their training history sees a business dashboard framed entirely for manufacturers and developers.
- **Why it matters:** This completely breaks trust. A user who does not know the B2B model will think the app is a commercial data-harvesting tool rather than a training utility. It damages the core user experience.
- **Fix:** Replace the portal header copy with athlete-oriented framing: replace "PYROFIT B2B // TELEMETRY & OUTBOUND REFERRAL ENGINE" with "SESSION & PRODUCT HISTORY", replace "MANUFACTURER LEAD INTELLIGENCE" with "YOUR ACTIVITY LOG", and replace KPI card labels: "Total Outbound Referrals" → "Product Store Visits", "Zero Marketplace Leaks" → "Direct Brand Stores Only", "Scientific Tier (L1) Share" → "Premium Products Visited".

### H6: Welcome card and Hub tab-bar both render simultaneously before profile is saved
- **Where:** `src/components/pyrofit/PyrofitHub.tsx`
- **Problem:** The welcome card (Step 1/2/3 guide) only renders when `!fullProfile`. That part is correct. However the welcome card is followed immediately by the Feature Launcher lock banner (which is also correct). But below both of those, the 5-tab navigation bar only renders when `fullProfile` is set — so when there is no profile the tab bar is hidden. This is actually correct behavior. However: when the user is on the Plans page and clicks any "LAUNCH FUEL ENGINE" link, `setHubInitialView` could be `'planner'` but the Hub defaults to `'profile'` when no fullProfile exists (the state initializer handles this). The welcome card still uses a full page width button "START: BUILD YOUR PROFILE →" but clicking it calls `setActiveView('profile')` while the profile view is *already the active view* (since default is 'profile' when no profile). So the welcome card button navigates to the profile tab, which is already active — this is not broken, but clicking the button while already on the profile tab just makes the welcome card disappear (correct) and reveals the profile form underneath. The actual problem is: the welcome card and the profile form are both rendered at the same time (the card is `mb-8` above the view content), creating a confusing page where the welcome card coexists with the profile form.
- **Why it matters:** The welcome card is meant to be a gate before the form, but both render simultaneously. Users see a "START: BUILD YOUR PROFILE →" button AND the form below it, which is redundant and confusing.
- **Fix:** When `!fullProfile` and `activeView === 'profile'`, hide the welcome card and show only the profile form. The welcome card should only show when `activeView` is NOT 'profile'. This way clicking the button transitions to the profile form cleanly.

---

## MEDIUM

### M1: "Wet-bulb temperature" mentioned in weather result but unexplained
- **Where:** `src/components/pyrofit/WorkoutConfigurator.tsx` (weather result display and warning)
- **Problem:** The weather fetch result shows "Wet-bulb 28°C" and the warning says "High wet-bulb temperature (Xᵒ C) — evaporative cooling is impaired." The term "wet-bulb temperature" is not understood by most recreational athletes.
- **Why it matters:** The warning is important for safety (heat illness risk), but users who do not understand the term will ignore it.
- **Fix:** Replace "Wet-bulb" with a plain-language label: "Feels-like (heat stress)" in the result display. Keep the warning but simplify: "Feels very hot even if the air temperature looks moderate — your body cannot cool itself through sweat efficiently. Increase fluid intake."

### M2: FeedbackView rendered in Post-Workout/Rate-My-Session tab has no entry guard — shows immediately after profile creation without any prior session
- **Where:** `src/components/pyrofit/FeedbackView.tsx`
- **Problem:** The Post-Workout tab is accessible as soon as a profile is saved (even before any session is calculated). Opening it before logging a first session shows outcome buttons (Cramping, Bloating, Crash, Optimal) with zero session context. Submitting an outcome here will mutate the profile multipliers based on a session that never happened (using the default `workoutInput` values, not any real session).
- **Why it matters:** An accidental click could push the carb or sodium multiplier up 15% before the user has even calculated their first session, creating miscalibrated future recommendations with no explanation.
- **Fix:** Add a guard: if `hasCalculated` is false, show an empty state in the feedback tab: "Log a session first — come back here after completing your first workout to teach the engine how your body responds."

### M3: "PHASE 01 / PHASE 02 / PHASE 03" labels are technical — timing/purpose not obvious at a glance
- **Where:** `src/components/pyrofit/FuelingStrategyView.tsx`
- **Problem:** Sections titled "PHASE 01", "PHASE 02", "PHASE 03" are fine structurally, but the phase timing ("45–60 min before", "Throughout session", "Within 30 min after") is buried in small text inside each section. A user scanning the results page cannot immediately orient where they are in time.
- **Why it matters:** Users may miss the pre-workout section timing if they open results right before a session. The timing context is critical for execution.
- **Fix:** Move the timing badge to be visually prominent in each phase header — same line as the PHASE 01/02/03 label, in a larger style, using plain English: "45–60 MIN BEFORE", "DURING THE SESSION", "WITHIN 30 MIN AFTER".

### M4: "ADAPTIVE STATE // CURRENT PROFILE MULTIPLIERS" in FeedbackView uses jargon
- **Where:** `src/components/pyrofit/FeedbackView.tsx`
- **Problem:** Section header "ADAPTIVE STATE // CURRENT PROFILE MULTIPLIERS" and the sub-heading "POST-WORKOUT QUALITATIVE SURVEY" use developer terminology. "Multipliers" and "adaptive state" are machine concepts.
- **Why it matters:** An athlete logging how their run felt does not need to see "multipliers". This creates cognitive friction.
- **Fix:** Replace "ADAPTIVE STATE // CURRENT PROFILE MULTIPLIERS" with "HOW YOUR PROFILE IS CALIBRATED". Replace "POST-WORKOUT QUALITATIVE SURVEY" with "HOW DID YOUR SESSION FEEL?".

### M5: ManufacturerAnalyticsPortal "Inspect JSON" button — developer tool exposed to all users
- **Where:** `src/components/pyrofit/ManufacturerAnalyticsPortal.tsx`
- **Problem:** Every row in the telemetry table has an "Inspect JSON" button that opens a raw JSON payload modal. This is a developer/B2B debugging tool but it is fully exposed to all users. Combined with column headers like "Payload", "Strict Schema Adherence: Section 5", it makes the tab feel like a debug console rather than user history.
- **Why it matters:** Athletes navigating "History & Data" to see their product clicks encounter raw JSON modals. This is confusing and reinforces the "am I being tracked?" concern.
- **Fix:** Move "Inspect JSON" behind the "Advanced / Export" accordion (where it belongs as a debug feature). In the main event table, replace the "Payload" column with a simpler "Details" link that shows only product name, brand, and timestamp in a clean modal — no raw JSON.

### M6: Session Planner shows "PYROFIT // PROTOCOL ENGINE v1.0" and "WORKOUT & ATHLETE CONFIGURATOR" as the form heading
- **Where:** `src/components/pyrofit/WorkoutConfigurator.tsx`
- **Problem:** The form title "WORKOUT & ATHLETE CONFIGURATOR" is engineering-flavored. The athlete profile is already on a separate tab, so calling the session planner an "ATHLETE CONFIGURATOR" is redundant and confusing — it implies you configure the athlete here, but you don't.
- **Why it matters:** Duplicate/misleading framing adds cognitive overhead.
- **Fix:** Replace heading with "PLAN YOUR SESSION" and subtitle with "Tell us about your upcoming workout to get your personalised fueling plan."

---

## LOW

### L1: "±15% Tolerance Window Compliant" in Strategy View — unexplained
- **Where:** `src/components/pyrofit/FuelingStrategyView.tsx`
- **Problem:** The badge "±15% Tolerance Window Compliant" means the product serving quantities are within 15% of the calculated target. The user has no context for what this means.
- **Fix:** Add a tooltip or plain note: "Products within 15% of your carb target — no need to match exactly."

### L2: "E = {targets.environmental_factor_E}" label in results header
- **Where:** `src/components/pyrofit/FuelingStrategyView.tsx`
- **Problem:** Showing `E = 1.4` in the climate badge uses internal variable notation. 
- **Fix:** Render it as "Heat Factor: 1.4×" for clarity.

### L3: "GI Sensitivity: Severe / Bloating" option text is awkward
- **Where:** `src/components/pyrofit/AthleteProfileView.tsx`
- **Problem:** "Severe / Bloating" mixes severity (Severe) with symptom (Bloating). "None / Mild / Severe" or "None / Mild / Sensitive Gut" would be cleaner.
- **Fix:** Change to "Sensitive Gut" (from "Severe / Bloating").

### L4: Clear button in ManufacturerAnalyticsPortal shows blank after first confirm click
- **Where:** `src/components/pyrofit/ManufacturerAnalyticsPortal.tsx`
- **Problem:** After clicking the Clear button once, `confirmClear` becomes true and the button renders only "Confirm?" with a Trash icon — the label disappears, leaving just an icon and "Confirm?" which is confusing.
- **Fix:** Always show the full label: "Clear All Data" on first click, "Confirm Clear?" on second click. Already handled with the icon — just ensure label text is always visible.

### L5: Mobile tab bar in Hub may clip text on small screens
- **Where:** `src/components/pyrofit/PyrofitHub.tsx`
- **Problem:** The 5-tab grid uses `grid-cols-2 sm:grid-cols-5`. On sm and below, the second row has only 1 tab (History & Data) which appears alone in a grid-cols-2 layout, taking half width. On very narrow screens, the tab text "Athlete Profile" and "History & Data" may be cut.
- **Fix:** Add `truncate` class to tab text spans, or switch to `text-[10px]` on xs screens.
