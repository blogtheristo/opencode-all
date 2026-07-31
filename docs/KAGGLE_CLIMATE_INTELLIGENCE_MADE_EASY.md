# Climate Intelligence Made Easy

**Kaggle Summer School Writeup · May 14, 2026**
**Author:** Risto Anton Päärni — <https://www.kaggle.com/ristoprni>
**Follow-up to:** *DWS IQ Platform: Climate-Aware Multi-Agent AI for Construction*
(Nov 16, 2025 — archived at `docs/KAGGLE_DWS6_AGENTS_NOV2025.md`).

## Executive Summary

**Problem:** Open climate data is everywhere and useful nowhere. ERA5, EDGAR
v8, and the EU ETS registry each ship in their own schema, units, and
cadence — so every team rebuilds the same plumbing before they can ask the
actual question.

**Solution:** A single Kaggle notebook that compresses that plumbing into
reusable cells and emits a one-page exposure brief for an EU industrial site.
Three open datasets in, one decision-grade page out.

**Impact:** End-to-end run in <2 minutes on a free Kaggle kernel. The ingest
cells are the reusable core: the next question only needs the question, not
the plumbing.

## Problem

Climate intelligence work is mostly **plumbing, not modelling**:

- Units drift (kg vs t CO2e, scope-1 vs scope-2) and silently corrupt joins.
- Spatial resolution mismatches (ERA5 grid cells vs point coordinates) require
  a deliberate join policy.
- EU ETS installation IDs change over time and need a crosswalk to stay
  joinable to EDGAR sector medians.

The result: most "climate ML" notebooks spend 80% of their cells on ingest
and 20% on the actual finding.

## Solution

One notebook, three datasets, three steps:

1. **Normalize** everything to `tCO2e/year` before any join.
2. **Spatial-join** ERA5 to installation coordinates; trend the last 10
   summers vs the 1991–2020 baseline.
3. **Compare** the site's ETS surrenders to its EDGAR sector median and flag
   the gap.

Output template:

```
Title:        <one-line finding>
Dataset(s):   <links + version pins>
Method:       <3 bullets, no jargon>
Finding:      <number + unit + scope>
So what:      <who acts, by when, under which rule>
```

## Impact

**Reproducibility:** Version-pinned ERA5, EDGAR v8, and ETS registry pulls
re-run deterministically on a free Kaggle kernel.

**Reusability:** The ingest cells are written as small functions, so the next
notebook inherits the plumbing and starts from the question.

**Continuity:** Same data spine as the Nov 2025 DWS IQ capstone — Summer
School is the *make-it-easy* layer above the multi-agent platform underneath.

**Biggest lesson:** Unit hygiene beats model choice. Nearly every wrong
number traced back to a kg/t or scope-1/scope-2 mixup, not to the math.
