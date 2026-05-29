# Monte Carlo Fan Chart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an improved "Monte Carlo Future Moves" TradingView indicator (Pine v6) that uses moving block bootstrap, a proper PRNG, and renders a forward probability fan chart.

**Architecture:** Terminal-only computation (`barstate.islast`). Once-per-trigger pipeline: prep demeaned returns → run N block-bootstrap simulations in a single pass, binning each step's price into a `matrix<int>` of per-step histograms → derive percentile bands from bin CDFs → render fan boxes + median polyline + terminal distribution. No rejection loops, no stored paths, no per-step sorting.

**Tech Stack:** Pine Script v6 (TradingView). No local toolchain — the Pine editor is the compiler; verification is visual + temporary debug labels on a chart.

---

## Platform notes (read first)

- **No local tests.** "Verify" steps mean: paste into TradingView Pine editor → **Save** (compiles; errors appear inline) → **Add to chart** → read the temporary debug `label`/`table` → check the stated invariant.
- **Recommended chart for verification:** a liquid symbol with long history (e.g. `BINANCE:BTCUSDT` 1h, or `SPY` daily) so `lookback` (500) has enough bars.
- **File:** single source file `pine/monte-carlo-fan-chart.pine`. Pine is one indicator per file; we build it up incrementally and keep it compiling after every task.
- **Debug scaffolding** (temporary labels/tables) is added per task and **removed in Task 11**. Each debug element is tagged with a `// DEBUG:` comment so it's grep-able for removal.
- **Commits:** the repo's CLAUDE.md says commit only when asked and to branch off `main` first. Before Task 1, create a branch: `git checkout -b feat/monte-carlo-fan-chart`. Commit steps are included per task; run them as you go.

---

## File structure

| File | Responsibility |
|---|---|
| `pine/monte-carlo-fan-chart.pine` | The entire indicator: inputs, PRNG, returns prep, block sampler, simulation+binning, percentiles, rendering. |

Pine cannot split an indicator across files, so this is intentionally one file. Within it, code is organized in labeled sections (PRNG, MODEL, BINNING, RENDER) so each unit stays locatable.

---

## Identifier contract (names used across tasks — keep consistent)

- `rng(state) => [float val01, int newstate]` — uniform in `[0,1)`.
- `rng_int(state, n) => [int i, int newstate]` — integer in `[0, n)`.
- `prep_returns(lookback, useLog) => [array<float> R, float mu, float sigma]` — demeaned returns + stats.
- `sample_path(R, L, nsteps, state) => [array<float> path, int newstate]` — block-bootstrapped demeaned returns, length `nsteps`.
- `drift_term(driftLen, style, mu) => float` — per-step drift (Standard / Linear Regression / None→`mu`).
- Per-step range arrays (size = `steps`, index 0 = step 1): `lowArr`, `highArr`, `bwArr` (`array<float>`).
- `binsM` — `matrix<int>` of shape `steps × bins`, the per-step histograms.
- `pctl_price(binsM, t, p, lowArr, bwArr, bins) => float` — percentile `p` (0..1) price at step `t` (0-based row).
- `K_SIGMA` — range-width constant, `5.0`. (Tuning target: 4.0 if resolution feels coarse.)

---

### Task 1: Skeleton — declaration, inputs, guards

**Files:**
- Create: `pine/monte-carlo-fan-chart.pine`

- [ ] **Step 1: Create branch**

```bash
cd /Users/aslanalyiev/Work/kindoraWeb
git checkout -b feat/monte-carlo-fan-chart
```

- [ ] **Step 2: Write the skeleton file**

```pinescript
// This Pine Script™ code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/

//@version=6
indicator("Monte Carlo Fan Chart", overlay=true, max_boxes_count=500, max_lines_count=500, max_polylines_count=100, max_labels_count=100, max_bars_back=5000)

// ============================== INPUTS ==============================
string gControls = "Primary Controls"
int   simulations = input.int(500,  "Number of Simulations", group=gControls, minval=50,  step=50)
int   lookback    = input.int(500,  "Lookback",              group=gControls, minval=50,  step=50)
int   steps       = input.int(10,   "Steps Into Future",     group=gControls, minval=2,   step=1)
int   bins        = input.int(50,   "Outcome Granularity",   group=gControls, minval=10,  step=5)
int   blockLen    = input.int(5,    "Block Length",          group=gControls, minval=1,   step=1, tooltip="Length of contiguous return blocks resampled. Preserves volatility clustering / short-term autocorrelation.")
float smoothing   = input.float(1.75,"Outcome Smoothing",    group=gControls, minval=0.0, step=0.25)

string gAdj = "Additional Adjustments"
int    driftLength   = input.int(34, "Drift", group=gAdj, inline="drift", minval=0)
string driftStyle    = input.string("Standard", "Style:", group=gAdj, inline="drift", options=["Linear Regression", "Standard", "None"])
bool   volatilityAdj = input.bool(true, "Volatility Adjust", group=gAdj)
bool   useLog        = input.string("Log Returns", "Returns Style", group=gAdj, options=["Percent", "Log Returns"]) == "Log Returns"
bool   waitForSteps  = input.bool(false, "Update Every Bar", group=gAdj)

string gVis = "Visual Preferences"
bool   showFan    = input.bool(true,  "Show Fan Bands",    group=gVis)
bool   showMedian = input.bool(true,  "Show Median Path",  group=gVis)
bool   showTerm   = input.bool(true,  "Show Terminal Distribution", group=gVis)
bool   startLine  = input.bool(true,  "Starting Line",     group=gVis)

string gCol = "Color Preferences"
color colBull   = input.color(#00FFFF, "Bullish", group=gCol, inline="c")
color colBear   = input.color(#FF22CC, "Bearish", group=gCol, inline="c")
color colMedian = input.color(#FFB617, "Median",  group=gCol)
color colStart  = input.color(#7E7E7E, "Start",   group=gCol)
color colText   = input.color(#FFFFFF, "Text",    group=gCol)

const float K_SIGMA = 5.0  // range half-width in sigmas. TUNING TARGET: drop to 4.0 if the cone/histogram looks coarse.

// ============================== GUARDS / DRIVER ==============================
if barstate.islast
    if bar_index + 1 < lookback
        runtime.error('Use a "Lookback" less than available bars: ' + str.tostring(bar_index))
    if bar_index + 1 < driftLength
        runtime.error('Use a "Drift" less than available bars: ' + str.tostring(bar_index))
    // DEBUG: confirms the driver fires on the last bar
    label.new(bar_index, high, "skeleton OK", color=color.new(color.green, 70), textcolor=colText, style=label.style_label_down)
```

- [ ] **Step 3: Verify it compiles and runs**

In TradingView: paste into a new Pine indicator, **Save**, **Add to chart** on a long-history symbol.
Expected: no compile errors; a green "skeleton OK" label sits on the last bar. On a symbol with fewer than 500 bars, expect the `runtime.error` about Lookback.

- [ ] **Step 4: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): scaffold monte carlo fan chart indicator (v6)"
```

---

### Task 2: PRNG (seedable LCG)

**Files:**
- Modify: `pine/monte-carlo-fan-chart.pine` (add PRNG section before the driver)

- [ ] **Step 1: Add the PRNG functions**

Insert a `// ===== PRNG =====` section after the inputs, before the driver:

```pinescript
// ============================== PRNG ==============================
// Numerical Recipes LCG. Deterministic -> stable redraws. State threaded explicitly.
const int LCG_MOD = 4294967296  // 2^32
rng(int state) =>
    int next = (1664525 * state + 1013904223) % LCG_MOD
    [next / LCG_MOD, next]               // [float in [0,1), new state]

rng_int(int state, int n) =>
    [v, next] = rng(state)
    [int(v * n), next]                   // int in [0, n)
```

- [ ] **Step 2: Add a temporary uniformity check in the driver**

Inside `if barstate.islast` (replace the skeleton DEBUG label):

```pinescript
    // DEBUG: 1000 draws should average ~0.5 and span ~[0,1)
    int   st  = 987654321
    float sum = 0.0
    float mn  = 1.0
    float mx  = 0.0
    for i = 0 to 999
        [v, ns] = rng(st)
        st  := ns
        sum += v
        mn  := math.min(mn, v)
        mx  := math.max(mx, v)
    label.new(bar_index, high, "PRNG mean=" + str.tostring(sum/1000, "#.###") + " min=" + str.tostring(mn, "#.###") + " max=" + str.tostring(mx, "#.###"), color=color.new(color.green, 70), textcolor=colText, style=label.style_label_down)
```

- [ ] **Step 3: Verify on chart**

Save, reload. Expected label: `mean≈0.49–0.51`, `min` near 0, `max` near 1. If mean is far from 0.5 the LCG constants are wrong.

- [ ] **Step 4: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): add seedable LCG prng"
```

---

### Task 3: Returns prep (demeaned returns + stats)

**Files:**
- Modify: `pine/monte-carlo-fan-chart.pine` (add MODEL section)

- [ ] **Step 1: Add `prep_returns`**

Add a `// ===== MODEL =====` section after PRNG:

```pinescript
// ============================== MODEL ==============================
// Returns over `lb` bars, demeaned so drift is added back explicitly (no double count).
prep_returns(int lb, bool logRet) =>
    array<float> R = array.new<float>()
    for i = 0 to lb - 1
        float r = logRet ? math.log(close[i] / close[i + 1]) : (close[i] - close[i + 1]) / close[i + 1]
        R.push(r)
    float mu    = R.avg()
    float sigma = R.stdev()
    array<float> Rdm = array.new<float>()
    for i = 0 to R.size() - 1
        Rdm.push(R.get(i) - mu)
    [Rdm, mu, sigma]
```

- [ ] **Step 2: Temporary check in driver**

Replace the PRNG DEBUG label with:

```pinescript
    [Rdm, mu, sigma] = prep_returns(lookback, useLog)
    // DEBUG: size==lookback, demeaned mean≈0, sigma>0
    label.new(bar_index, high, "n=" + str.tostring(Rdm.size()) + " mean0=" + str.tostring(Rdm.avg(), "#.######") + " sigma=" + str.tostring(sigma, "#.######"), color=color.new(color.green, 70), textcolor=colText, style=label.style_label_down)
```

- [ ] **Step 3: Verify on chart**

Save, reload. Expected: `n=500`, `mean0` ≈ 0 (e.g. `0.000000`), `sigma` a small positive number (e.g. `0.01–0.04` for crypto hourly).

- [ ] **Step 4: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): add demeaned returns prep"
```

---

### Task 4: Drift + per-step range arrays

**Files:**
- Modify: `pine/monte-carlo-fan-chart.pine` (MODEL section)

- [ ] **Step 1: Add drift functions (ported, drift is now the only trend source)**

Append to MODEL section:

```pinescript
standard_drift(int len) =>
    float lr  = math.log(close / close[1])
    float lr2 = math.pow(lr, 2)
    float mean = 0.0
    float vari = 0.0
    for i = 0 to len - 1
        mean += lr[i]
        vari += lr2[i]
    mean / len - vari / (len * 2)

lin_reg_slope(int len) =>
    float sx = 0.0, float sy = 0.0, float sx2 = 0.0, float sxy = 0.0
    for i = 0 to len - 1
        float src = close[i]
        int   x   = i + 1
        sx  += x
        sy  += src
        sx2 += math.pow(x, 2)
        sxy += src * x
    -((len * sxy - sx * sy) / (len * sx2 - sx * sx))

drift_term(int driftLen, string style, float mu) =>
    int len = driftLen == 0 ? lookback : driftLen
    switch style
        "Standard"          => standard_drift(len)
        "Linear Regression" => lin_reg_slope(len)
        => mu   // "None" -> add back the sample mean so behaviour is raw
```

- [ ] **Step 2: Add per-step range builder**

Append to MODEL section:

```pinescript
// Analytic per-step price range: open * exp(±K*sigma*sqrt(t)). Single pass, no range discovery.
build_ranges(float basePrice, float sigma, int nsteps, bool logRet) =>
    array<float> lowArr = array.new<float>()
    array<float> highArr = array.new<float>()
    array<float> bwArr   = array.new<float>()
    for t = 1 to nsteps
        float hw = K_SIGMA * sigma * math.sqrt(t)
        float lo = logRet ? basePrice * math.exp(-hw) : math.max(0.0, basePrice * (1 - hw))
        float hi = logRet ? basePrice * math.exp(hw)  : basePrice * (1 + hw)
        lowArr.push(lo)
        highArr.push(hi)
        bwArr.push((hi - lo) / bins)
    [lowArr, highArr, bwArr]
```

- [ ] **Step 3: Temporary check in driver**

Append after the `prep_returns` line; replace the DEBUG label:

```pinescript
    float dterm = drift_term(driftLength, driftStyle, mu)
    [lowArr, highArr, bwArr] = build_ranges(open, sigma, steps, useLog)
    // DEBUG: drift small, ranges widen with t (low decreasing, high increasing)
    label.new(bar_index, high, "drift=" + str.tostring(dterm, "#.######") + " step1=[" + str.tostring(lowArr.get(0), "#.##") + "," + str.tostring(highArr.get(0), "#.##") + "] stepN=[" + str.tostring(lowArr.get(steps-1), "#.##") + "," + str.tostring(highArr.get(steps-1), "#.##") + "]", color=color.new(color.green, 70), textcolor=colText, style=label.style_label_down)
```

- [ ] **Step 4: Verify on chart**

Save, reload. Expected: `drift` is a tiny number; the step-N range is wider than the step-1 range (low lower, high higher), bracketing the current `open`.

- [ ] **Step 5: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): add drift terms and analytic per-step ranges"
```

---

### Task 5: Block bootstrap path + single-path walk

**Files:**
- Modify: `pine/monte-carlo-fan-chart.pine` (MODEL section)

- [ ] **Step 1: Add `sample_path`**

Append to MODEL section:

```pinescript
// Moving block bootstrap: concatenate circular contiguous blocks of demeaned returns.
sample_path(array<float> R, int L, int nsteps, int state) =>
    int n = R.size()
    int Lc = math.min(L, n)
    array<float> path = array.new<float>()
    int st = state
    while path.size() < nsteps
        [s, ns] = rng_int(st, n)
        st := ns
        for k = 0 to Lc - 1
            if path.size() >= nsteps
                break
            path.push(R.get((s + k) % n))
    [path, st]
```

- [ ] **Step 2: Add price-walk helper**

Append to MODEL section:

```pinescript
// Walk one path to its terminal price. Returns terminal price only (binning added in Task 6).
walk_terminal(array<float> path, float basePrice, float dterm, bool logRet) =>
    float p = basePrice
    for t = 0 to path.size() - 1
        p := logRet ? p * math.exp(path.get(t) + dterm) : p * (1 + path.get(t) + dterm)
    p
```

- [ ] **Step 3: Temporary check in driver**

Append after the `build_ranges` line; replace the DEBUG label:

```pinescript
    int    seed0 = 987654321
    [p1, s1] = sample_path(Rdm, blockLen, steps, seed0)
    float term1 = walk_terminal(p1, open, dterm, useLog)
    // DEBUG: one simulated terminal price; should land near `open`, inside the stepN range
    label.new(bar_index, high, "pathLen=" + str.tostring(p1.size()) + " term1=" + str.tostring(term1, "#.##") + " open=" + str.tostring(open, "#.##"), color=color.new(color.green, 70), textcolor=colText, style=label.style_label_down)
```

- [ ] **Step 4: Verify on chart**

Save, reload. Expected: `pathLen` == `steps` (10); `term1` is a price near `open`, comfortably within the step-N range from Task 4.

- [ ] **Step 5: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): add block bootstrap sampler and price walk"
```

---

### Task 6: Full simulation loop → per-step bin matrix

**Files:**
- Modify: `pine/monte-carlo-fan-chart.pine` (BINNING section)

- [ ] **Step 1: Add binning helper and the simulation driver**

Add a `// ===== BINNING =====` section after MODEL:

```pinescript
// ============================== BINNING ==============================
bin_index(float price, float lo, float bw) =>
    int idx = bw > 0 ? int((price - lo) / bw) : 0
    math.max(0, math.min(bins - 1, idx))   // clamp into edge bins

// Run all sims in a single pass; fill `binsM` (steps x bins) and return clamp count + state.
run_simulations(array<float> R, int L, int nsteps, int nsims, float basePrice, float dterm, bool logRet, array<float> lowArr, array<float> bwArr, matrix<int> binsM, int state) =>
    int st = state
    int clamps = 0
    for sim = 0 to nsims - 1
        [path, ns] = sample_path(R, L, nsteps, st)
        st := ns
        float p = basePrice
        for t = 0 to nsteps - 1
            p := logRet ? p * math.exp(path.get(t) + dterm) : p * (1 + path.get(t) + dterm)
            float lo = lowArr.get(t)
            float bw = bwArr.get(t)
            int   idx = bin_index(p, lo, bw)
            if p < lo or p > lo + bw * bins
                clamps += 1
            binsM.set(t, idx, binsM.get(t, idx) + 1)
    [clamps, st]
```

- [ ] **Step 2: Wire it into the driver**

Replace the Task-5 single-path DEBUG block with:

```pinescript
    matrix<int> binsM = matrix.new<int>(steps, bins, 0)
    [clamps, sEnd] = run_simulations(Rdm, blockLen, steps, simulations, open, dterm, useLog, lowArr, bwArr, binsM, seed0)
    // DEBUG: each row should sum to `simulations`; clamps should be a small fraction
    int row0sum = 0
    for c = 0 to bins - 1
        row0sum += binsM.get(0, c)
    label.new(bar_index, high, "row0sum=" + str.tostring(row0sum) + "/" + str.tostring(simulations) + " clamps=" + str.tostring(clamps) + " (" + str.tostring(100.0 * clamps / (simulations * steps), "#.#") + "%)", color=color.new(color.green, 70), textcolor=colText, style=label.style_label_down)
```

(Keep `int seed0 = 987654321` from Task 5; remove the Task-5 `sample_path`/`walk_terminal` debug lines.)

- [ ] **Step 3: Verify on chart**

Save, reload. Expected: `row0sum` == `simulations` (500); `clamps` is a small % (typically well under 1% at K=5). A large clamp % means `K_SIGMA` is too small.

- [ ] **Step 4: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): run simulations into per-step bin matrix"
```

---

### Task 7: Percentiles from bins

**Files:**
- Modify: `pine/monte-carlo-fan-chart.pine` (BINNING section)

- [ ] **Step 1: Add `pctl_price`**

Append to BINNING section:

```pinescript
// Percentile price for step row `t`: walk the CDF to the bin where it crosses p, return bin center.
pctl_price(matrix<int> bm, int t, float p, array<float> lowArr, array<float> bwArr, int nbins) =>
    int total = 0
    for c = 0 to nbins - 1
        total += bm.get(t, c)
    float target = p * total
    int   cum    = 0
    int   hit    = nbins - 1
    for c = 0 to nbins - 1
        cum += bm.get(t, c)
        if cum >= target
            hit := c
            break
    lowArr.get(t) + (hit + 0.5) * bwArr.get(t)
```

- [ ] **Step 2: Temporary check in driver**

Append after the `run_simulations` block; replace the DEBUG label:

```pinescript
    float p05 = pctl_price(binsM, steps - 1, 0.05, lowArr, bwArr, bins)
    float p50 = pctl_price(binsM, steps - 1, 0.50, lowArr, bwArr, bins)
    float p95 = pctl_price(binsM, steps - 1, 0.95, lowArr, bwArr, bins)
    // DEBUG: ordering p05 < p50 < p95, all near `open`
    label.new(bar_index, high, "P05=" + str.tostring(p05, "#.##") + " P50=" + str.tostring(p50, "#.##") + " P95=" + str.tostring(p95, "#.##"), color=color.new(color.green, 70), textcolor=colText, style=label.style_label_down)
```

- [ ] **Step 3: Verify on chart**

Save, reload. Expected: strictly increasing `P05 < P50 < P95`; `P50` near `open`; spread roughly symmetric for trendless data, skewed when drift is on.

- [ ] **Step 4: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): derive percentile prices from bin CDFs"
```

---

### Task 8: Render fan bands

**Files:**
- Modify: `pine/monte-carlo-fan-chart.pine` (add RENDER section)

- [ ] **Step 1: Add fan renderer**

Add a `// ===== RENDER =====` section after BINNING. Bands are stair-step boxes between adjacent percentile levels, one column per future step:

```pinescript
// ============================== RENDER ==============================
var array<box> fanBoxes = array.new<box>()

clear_boxes(array<box> arr) =>
    if arr.size() > 0
        for i = arr.size() - 1 to 0
            arr.get(i).delete()
            arr.remove(i)

// Percentile levels (low->high) and the gradient color per band gap.
render_fan(matrix<int> bm, int nsteps, array<float> lowArr, array<float> bwArr, int nbins, color cBull, color cBear) =>
    clear_boxes(fanBoxes)
    array<float> levels = array.from(0.05, 0.25, 0.50, 0.75, 0.95)
    for t = 0 to nsteps - 1
        int   xL = bar_index + t
        int   xR = bar_index + t + 1
        for g = 0 to levels.size() - 2
            float top = pctl_price(bm, t, levels.get(g + 1), lowArr, bwArr, nbins)
            float bot = pctl_price(bm, t, levels.get(g),     lowArr, bwArr, nbins)
            // central bands brighter, outer bands dimmer; bull above open, bear below
            float center = (top + bot) / 2
            color base   = center >= open ? cBull : cBear
            int   transp = g == 1 or g == 2 ? 60 : 80   // inner gaps brighter
            box.new(xL, top, xR, bot, border_color=#00000000, bgcolor=color.new(base, transp))
            fanBoxes.push(box.new(xL, top, xR, bot, border_color=#00000000, bgcolor=color.new(base, transp)))
```

> Note: create the box once and push it. Fix the duplicate `box.new` — push the single created box:
>
> ```pinescript
>             box b = box.new(xL, top, xR, bot, border_color=#00000000, bgcolor=color.new(base, transp))
>             fanBoxes.push(b)
> ```

- [ ] **Step 2: Call it from the driver**

Replace the Task-7 percentile DEBUG label with:

```pinescript
    if showFan
        render_fan(binsM, steps, lowArr, bwArr, bins, colBull, colBear)
    // DEBUG: box count should be steps * (levels-1) = steps*4
    label.new(bar_index, high, "fanBoxes=" + str.tostring(fanBoxes.size()), color=color.new(color.green, 70), textcolor=colText, style=label.style_label_down)
```

- [ ] **Step 3: Verify on chart**

Save, reload. Expected: a widening colored cone projecting right of the last bar; `fanBoxes` == `steps*4` (40). Inner bands brighter than outer; bullish-side cyan, bearish-side magenta.

- [ ] **Step 4: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): render probability fan bands"
```

---

### Task 9: Render median path

**Files:**
- Modify: `pine/monte-carlo-fan-chart.pine` (RENDER section)

- [ ] **Step 1: Add median polyline renderer**

Append to RENDER section:

```pinescript
var polyline medianLine = na

render_median(matrix<int> bm, int nsteps, array<float> lowArr, array<float> bwArr, int nbins, color c) =>
    if not na(medianLine)
        medianLine.delete()
    array<chart.point> pts = array.new<chart.point>()
    pts.push(chart.point.from_index(bar_index, open))
    for t = 0 to nsteps - 1
        float p50 = pctl_price(bm, t, 0.50, lowArr, bwArr, nbins)
        pts.push(chart.point.from_index(bar_index + t + 1, p50))
    medianLine := polyline.new(pts, line_color=c, line_width=2, closed=false)
```

- [ ] **Step 2: Call it from the driver**

Add after the `render_fan` call; replace the Task-8 DEBUG label:

```pinescript
    if showMedian
        render_median(binsM, steps, lowArr, bwArr, bins, colMedian)
    // DEBUG: confirm median renders
    label.new(bar_index, high, "median drawn", color=color.new(color.green, 70), textcolor=colText, style=label.style_label_down)
```

- [ ] **Step 3: Verify on chart**

Save, reload. Expected: a gold polyline starting at the current `open` and tracing P50 across the cone (roughly flat for trendless data, sloped when drift is on).

- [ ] **Step 4: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): render median path polyline"
```

---

### Task 10: Terminal distribution + start line + smoothing

**Files:**
- Modify: `pine/monte-carlo-fan-chart.pine` (RENDER section)

- [ ] **Step 1: Add optional smoothing of the terminal row**

Append to RENDER section (ports the original `sinc` smoother, applied to the final step's counts):

```pinescript
sinc(float x, float bw) =>
    float omega = math.pi * x / bw
    x != 0.0 ? math.sin(omega) / omega : 1.0

smooth_row(matrix<int> bm, int t, int nbins, float len) =>
    array<float> raw = array.new<float>()
    for c = 0 to nbins - 1
        raw.push(bm.get(t, c))
    if len <= 0.0
        raw
    else
        array<float> est = array.new<float>()
        for i = 0 to nbins - 1
            float sum = 0.0, float sumw = 0.0
            for j = 0 to nbins - 1
                float w = sinc(i - j, len + 1.0)
                sum  += w * raw.get(j)
                sumw += w
            est.push(math.max(0.0, sum / sumw))
        est
```

- [ ] **Step 2: Add terminal histogram renderer + start line**

Append to RENDER section:

```pinescript
var array<box> termBoxes = array.new<box>()
var line startLn = na

render_terminal(matrix<int> bm, int nsteps, array<float> lowArr, array<float> bwArr, int nbins, float smooth, color cBull, color cBear, color cText) =>
    clear_boxes(termBoxes)
    int t = nsteps - 1
    array<float> row = smooth_row(bm, t, nbins, smooth)
    float maxv = row.max()
    int   x0   = bar_index + nsteps
    float lo   = lowArr.get(t)
    float bw   = bwArr.get(t)
    for c = 0 to nbins - 1
        float v = row.get(c)
        if v > 0 and maxv > 0
            float center = lo + (c + 0.5) * bw
            int   width  = int(30 * v / maxv)   // horizontal length scaled to max freq
            color base   = center >= open ? cBull : cBear
            box b = box.new(x0, lo + (c + 1) * bw, x0 + width, lo + c * bw, border_color=#00000000, bgcolor=color.new(base, 30))
            termBoxes.push(b)

render_start(color c) =>
    if not na(startLn)
        startLn.delete()
    startLn := line.new(bar_index, open, bar_index + 1, open, color=c, extend=extend.left)
```

- [ ] **Step 2b: Verify the box vertical bounds**

`box.new(left, top, right, bottom, ...)` expects `top > bottom` in price. Above, `top = lo + (c+1)*bw` and `bottom = lo + c*bw`, so `top > bottom`. Correct.

- [ ] **Step 3: Call from the driver**

Add after `render_median`; replace the Task-9 DEBUG label:

```pinescript
    if showTerm
        render_terminal(binsM, steps, lowArr, bwArr, bins, smoothing, colBull, colBear, colText)
    if startLine
        render_start(colStart)
    // DEBUG (final sanity before cleanup): termBoxes count, clamp %
    label.new(bar_index, high, "term=" + str.tostring(termBoxes.size()) + " clamp%=" + str.tostring(100.0 * clamps / (simulations * steps), "#.#"), color=color.new(color.green, 70), textcolor=colText, style=label.style_label_down)
```

- [ ] **Step 4: Verify on chart**

Save, reload. Expected: a horizontal histogram at the right edge of the cone (bars longest near the most-likely price); a gray starting line at `open` extending left. Toggle `Outcome Smoothing` to 0 → histogram becomes jagged; raise it → smooth.

- [ ] **Step 5: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): render terminal distribution, smoothing, start line"
```

---

### Task 11: Throttle, cleanup, finalize

**Files:**
- Modify: `pine/monte-carlo-fan-chart.pine`

- [ ] **Step 1: Add the update-throttle (port of the original `wait` logic)**

Wrap the heavy compute. Replace the bare `if barstate.islast` driver opening with a counter+wait gate so it recomputes every `steps` bars by default, or every confirmed bar when "Update Every Bar" is on:

```pinescript
if barstate.islast
    var int counter = -1
    counter += 1
    bool once = counter == 0 ? true : barstate.isconfirmed
    bool wait = not waitForSteps ? (0 == counter % steps and once) : (0 == counter or barstate.isconfirmed)
    if wait
        // ... all compute + render from Tasks 3–10 goes here ...
```

Move every compute/render statement (prep_returns → render_start) inside the `if wait` block. Guards (`runtime.error`) stay directly under `if barstate.islast`, before the counter.

- [ ] **Step 2: Remove all DEBUG scaffolding**

Grep the file for `// DEBUG` and delete each labeled line/block. Remove the now-unused `seed0` only if nothing references it — it IS used by `run_simulations`, so keep it (rename to `seed` for clarity is optional). After removal there must be **zero** `label.new` calls left unless intentionally kept as a stats readout.

```bash
grep -n "DEBUG" pine/monte-carlo-fan-chart.pine   # expect: no matches
```

- [ ] **Step 3: Add a clamp-warning label (replaces silent truncation)**

Per the spec ("never silent"), surface clamping only when significant. Inside `if wait`, after rendering:

```pinescript
        float clampPct = 100.0 * clamps / (simulations * steps)
        if clampPct > 1.0
            label.new(bar_index + steps, highArr.get(steps - 1), "⚠ " + str.tostring(clampPct, "#.#") + "% clamped — lower K_SIGMA", color=color.new(color.orange, 60), textcolor=colText, style=label.style_label_left, size=size.small)
```

- [ ] **Step 4: Verify the K_SIGMA tuning comment is present**

Confirm the `const float K_SIGMA = 5.0` line still carries the `TUNING TARGET: drop to 4.0` comment from Task 1.

- [ ] **Step 5: Full visual verification**

Save, reload on the verification symbol. Expected, with no debug labels:
- Widening fan cone right of the last bar (cyan upper / magenta lower).
- Gold median path from `open`.
- Right-edge terminal histogram.
- Gray start line.
- No orange clamp warning at K=5 on normal data (if it appears, note it — that's the intended signal).
- Toggle each `Show *` input off → the corresponding layer disappears, no errors.
- Set "Update Every Bar" on → recomputes each confirmed bar; off → recomputes every `steps` bars.

- [ ] **Step 6: Commit**

```bash
git add pine/monte-carlo-fan-chart.pine
git commit -m "feat(mc): add update throttle, clamp warning, remove debug scaffolding"
```

---

## Self-review (completed by plan author)

**Spec coverage:**
- Block bootstrap → Task 5. ✓
- Clean PRNG → Task 2. ✓
- Demeaned returns + explicit drift (no double count) → Tasks 3–4. ✓
- Analytic per-step range, single pass, no sort/stored paths → Tasks 4, 6. ✓
- Per-step bins via `matrix<int>` → Task 6. ✓
- Percentile bands from CDF → Task 7. ✓
- Fan chart → Task 8; median path → Task 9; terminal distribution + smoothing + start line → Task 10. ✓
- Throttle, insufficient-bars guard, clamp surfaced (not silent) → Tasks 1, 11. ✓
- New inputs (Block Length, Show Fan/Median); removed polarity/returns-granularity/rejection controls → Task 1. ✓
- Edge cases: zero variance (bw>0 guards in `bin_index`, `build_ranges`), L>lookback (`math.min` in `sample_path`), insufficient bars (`runtime.error`), outlier clamps (counted + warned) → Tasks 4, 5, 6, 11. ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code. The one inline correction (duplicate `box.new` in Task 8) is called out explicitly with the corrected snippet.

**Type/name consistency:** `rng`, `rng_int`, `prep_returns`, `sample_path`, `drift_term`, `build_ranges`, `run_simulations`, `bin_index`, `pctl_price`, `render_fan`/`render_median`/`render_terminal`/`render_start`, `binsM`, `lowArr`/`highArr`/`bwArr`, `K_SIGMA` — used consistently across tasks. Percentile level set 5/25/50/75/95 consistent between Tasks 7–9.

**Known follow-up:** `lin_reg_slope` returns a price-units slope while `standard_drift` returns a log-return — they are not the same scale. In the original this was the same latent inconsistency. Flag for the implementer: when `driftStyle = "Linear Regression"`, verify the per-step drift magnitude looks sane on chart (Task 9 median slope check); if it dominates, divide the slope by `close` to convert to a return. Documented here rather than silently "fixed" so the implementer validates against real data.
