# Monte Carlo Future Moves — Improved Version (Design)

**Date:** 2026-05-29
**Target:** Pine Script v6, TradingView indicator (on-chart, `overlay=true`)
**Basis:** "Monte Carlo Future Moves [ChartPrime]" (Pine v5)

## Goal

Rebuild the ChartPrime Monte Carlo indicator to be (1) statistically sounder, (2) faster
under TradingView's loop/time limits, and (3) more informative visually — a forward
**fan chart** of probability instead of only a terminal-endpoint distribution.

## Why the original is weak

- **IID resampling.** Splits returns into independent up/down histograms and samples
  single returns independently. Discards volatility clustering and short-term
  autocorrelation — the dominant real structure in returns.
- **Rejection sampling.** Nested `while` loops re-roll until a bin "accepts." Slow
  (unbounded iterations per step), the main reason it can fail to load, and subtly biased.
- **Weak PRNG.** Custom recurrence `(3.1415926 * random % seed) * 271.828 % range` —
  poor statistical quality for Monte Carlo.
- **Drift double-counting risk.** Bootstraps raw returns (which already carry mean drift)
  *and* adds an explicit drift term.
- **Endpoint-only visual.** Shows where price lands, not how the cone widens over time.

## Decisions

| Question | Decision |
|---|---|
| Platform | Pine Script **v6**, TradingView, overlay |
| Resampling | **Moving block bootstrap** (circular), block length `L` |
| Rendering approach | **B** — per-step binned histograms → fan chart + terminal distribution |
| Drift | Bootstrap **demeaned** returns; add chosen drift term explicitly per step |
| Per-step range | **Analytic** (`open·exp(±k·σ·√t)`, k≈5) → single pass, no sort, no stored paths |

## Architecture / pipeline

Runs terminal-only (`barstate.islast`), throttled by `steps` / "Update Every Bar"
(unchanged from original).

```
returns prep (once)  →  N simulations (single pass)  →  per-step bins  →  render
```

No rejection loops, no per-step sorting, no stored full paths.

### Units

1. **`prng`** — seedable 64-bit LCG (Numerical Recipes constants:
   `x = (1664525·x + 1013904223) mod 2^32`). Deterministic seed → stable redraws.
   Returns `[value, new_state]`, state threaded through sims.
   *Interface:* `(state) -> [uniform float in [0,1), state]`; helper for `[0,n)` ints.
2. **`prep_returns`** — compute log/% returns over `lookback`, store array `R`;
   compute `μ`, `σ` (σ optionally EWMA via vol-adjust toggle); return demeaned `R' = R − μ`.
3. **`sample_block_path`** — given `R'`, `L`, `steps`, PRNG state: produce `steps`
   demeaned returns by concatenating circular contiguous blocks.
4. **`drift`** — Standard / Linear Regression / None (None → drift term = `μ`). Reused
   from original, but now the *only* source of trend.
5. **`simulate`** — walk one price path: `Pₜ = Pₜ₋₁·exp(R'ₜ + driftₜ)` (log) or
   `Pₜ = Pₜ₋₁·(1 + R'ₜ + driftₜ)` (%). Update per-step bins as it walks. Returns state.
6. **`bin_step`** — map a price at step `t` into one of `bins` bins over the analytic
   range for that step; clamp out-of-range into edge bins, count clamps.
7. **`percentiles_from_bins`** — for a step's bin counts, build CDF, return
   5/25/50/75/95 price levels.
8. **`render`** — fan boxes, median polyline, terminal distribution, deviation/start
   lines, labels.

## Model details

**Returns prep (once):**
- `Rᵢ = log(closeᵢ / closeᵢ₋₁)` (or `(closeᵢ − closeᵢ₋₁)/closeᵢ₋₁` for % style), over `lookback`.
- `μ = mean(R)`, `σ = stdev(R)` or EWMA σ when vol-adjust is on.
- `R'ᵢ = Rᵢ − μ`.

**Moving block bootstrap (`sample_block_path`):**
- Draw random start `s ∈ [0, len)`; emit `R'[(s+k) mod len]` for `k = 0..L−1`.
- Repeat until `steps` returns produced (truncate last block to fit).
- `L` clamped to `[1, lookback]`.

**Path walk (`simulate`):**
- Start at `open`.
- Each step: `next = add_returns(P, R'ₜ, style)` then `add_drift(next, driftₜ, drift_style)`.
- Drift term per step: Standard / LinReg value, or `μ` when style = "None".

## Binning & rendering (Approach B)

**Per-step bins:**
- For step `t` (1..steps): range `[open·exp(−k·σ·√t), open·exp(+k·σ·√t)]`, `k = 5`,
  divided into `bins` bins. (% style: linear equivalent `open·(1 ± k·σ·√t)`.)
  `k` is a hardcoded constant for now; leave a comment that **4 is the tuning target**
  if the cone/histogram resolution feels coarse (5 is the conservative default — almost
  nothing clamps, but the outer bins stay sparsely populated).
- Single pass: each simulation updates all `steps` bin-sets as it walks.
- Out-of-range outcomes clamp into the first/last bin; total clamp count tracked and
  surfaced via `log`/label if it exceeds a small threshold (e.g. >1% of sims) — never silent.

**Percentile bands:** per step, CDF over bin counts → 5/25/50/75/95 crossings → prices.

**Visuals:**
- **Fan chart** — stacked gradient `box`es between adjacent percentile levels, step to
  step, forming a widening cone. Budget ≈ `steps × 4` boxes (~40), well under the 500 cap.
- **Median path** — `polyline` through P50 across steps (v6).
- **Terminal distribution** — final step's bins as the horizontal right-edge histogram
  (preserves the original's signature look).
- Keep deviation lines, start line, smoothing (`sinc_filter` reused, optional), and all
  color inputs.

## Inputs

**New:** `Block Length` (int, default 5, min 1).
**New toggles:** `Show Fan Bands`, `Show Median Path`.
**Removed:** up/down polarity split, "Returns Granularity," rejection-sampling controls.
**Kept:** Number of Simulations, Lookback, Steps Into Future, Outcome Granularity (`bins`),
Outcome Smoothing, Drift + Style, Volatility Adjust, Returns Style, Precision,
Update Every Bar, all visual/orientation/color inputs.

## Edge cases

- **Insufficient bars** (`bar_index + 1 < lookback` or `< drift_length`) → `runtime.error`
  with guidance (as original).
- **Zero variance** (σ = 0) → degenerate flat cone; bands collapse to the drift line.
  Guard division by zero in bin width / range.
- **`L > lookback`** → clamp `L = lookback`.
- **Outliers beyond analytic range** → clamped to edge bins; surfaced when significant.

## Out of scope

- Standalone backtesting / Python port.
- Probability-of-touch alerts and signal generation (visual bands only for now).
- Spaghetti sample-path overlay (Approach C).

## Net effect vs. original

Sounder statistics (clustering + autocorrelation preserved, drift un-double-counted, real
PRNG), faster (rejection loops removed, single pass, no sorting), and a fan chart that
shows the probability cone widening over the forecast horizon.
