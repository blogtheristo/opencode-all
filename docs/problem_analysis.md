# The 4-Week Analytics Problem: Why Traditional Data Science Breaks

**Document ID:** DWS-DS-ANALYSIS-001
**Version:** 1.0
**Date:** 2026-02-18
**Author:** DWS IQ 6 AI/DS Team
**Status:** Active

---

## Executive Summary

Enterprise analytics projects consistently take 3–4 weeks from raw data to actionable decision. This document maps the 7 failure points in the traditional cycle, quantifies their cost, and establishes the ROI baseline that the AI-assisted pipeline must beat.

---

## The 7 Failure Points

### Overview

| # | Stage | Avg Time | Failure Probability | Root Cause |
|---|-------|----------|-------------------|------------|
| 1 | Manual Data Extraction (ETL) | 3 days (24h) | 35% | Schema drift, access permissions, format inconsistencies |
| 2 | Schema Discovery & Cleaning | 2 days (16h) | 25% | Undocumented schemas, silent data corruption, encoding issues |
| 3 | Exploratory Analysis | 2 days (16h) | 20% | Analyst availability, confirmation bias, incomplete coverage |
| 4 | Model Selection & Tuning | 5 days (40h) | 30% | Trial-and-error hyperparameter search, overfitting, wrong metric |
| 5 | Result Interpretation | 2 days (16h) | 40% | Business translation gap — statistician ≠ domain expert |
| 6 | Stakeholder Communication | 1 day (8h) | 25% | Email/PPT cycle, revision loops, scheduling delays |
| 7 | Action Tracking | 1 day (8h) | 50% | Decisions lost in email threads, no ownership assignment |
| | **TOTAL** | **16 days (128h)** | **~94% compound** | |

*Compound failure probability: 1 - (0.65 × 0.75 × 0.80 × 0.70 × 0.60 × 0.75 × 0.50) = 1 - 0.0614 ≈ 94% chance at least one stage fails, causing rework. Effective cycle with rework: ~4 weeks.*

---

### 1. Manual Data Extraction (ETL Bottleneck)

**Time cost:** 24 hours (3 business days)
**Failure probability:** 35%

**What goes wrong:**
- Data lives in 3–7 different systems (ERP, CRM, IoT, spreadsheets)
- Access permissions take days to resolve in regulated industries
- Schema drift between extraction runs causes silent breakage
- Export formats inconsistent (CSV encoding, date formats, delimiter issues)

**EU industry context:** NIS2-regulated companies (logistics, energy) have additional data access controls that add 1–2 days to extraction timelines.

---

### 2. Schema Discovery & Cleaning

**Time cost:** 16 hours (2 business days)
**Failure probability:** 25%

**What goes wrong:**
- No data dictionary exists — analyst reverse-engineers column meanings
- Silent data corruption: `"N/A"` strings in numeric columns, mixed units (km vs miles)
- Encoding issues across systems (UTF-8 vs Latin-1)
- Date format ambiguity (`01/02/2026` — January 2nd or February 1st?)
- Outliers may be errors or genuine extreme values — domain expertise needed

---

### 3. Exploratory Analysis (Analyst Dependency)

**Time cost:** 16 hours (2 business days)
**Failure probability:** 20%

**What goes wrong:**
- Bottlenecked on analyst availability (most teams have 1–2 analysts for 5+ projects)
- Confirmation bias — analyst explores what they expect to find
- Incomplete variable coverage: with 50+ features, only 10–15 get examined
- Visualizations are ad hoc, inconsistent between projects
- No systematic feature interaction analysis

---

### 4. Model Selection & Tuning (Trial-and-Error)

**Time cost:** 40 hours (5 business days)
**Failure probability:** 30%

**What goes wrong:**
- Analyst tries 2–3 models based on personal preference, not systematic comparison
- Hyperparameter tuning is manual or uses grid search (computationally wasteful)
- Wrong evaluation metric selected (accuracy on imbalanced data)
- Overfitting not caught until production deployment
- No standardized model comparison framework

---

### 5. Result Interpretation (Business Translation Gap)

**Time cost:** 16 hours (2 business days)
**Failure probability:** 40% (highest individual failure rate)

**What goes wrong:**
- Data scientist speaks in AUC-ROC, p-values, and feature importance scores
- Business stakeholder needs: "What should I do Monday morning?"
- Statistical significance ≠ business significance (p < 0.05 on a $12/year effect)
- Regulatory context missing — EU AI Act requires explainability for automated decisions
- No standardized format for translating model outputs to business recommendations

---

### 6. Stakeholder Communication (Email/PPT Cycle)

**Time cost:** 8 hours (1 business day)
**Failure probability:** 25%

**What goes wrong:**
- Analyst creates 30-slide deck, stakeholder reads 3 slides
- Email chain with attachments — version control nightmare
- CFO needs ROI numbers, CTO needs architecture, Ops needs action items — one deck can't serve all
- Meeting scheduling adds 2–5 day latency
- Feedback loop: "Can you also show X?" restarts the communication cycle

---

### 7. Action Tracking (Decisions Lost in Threads)

**Time cost:** 8 hours (1 business day)
**Failure probability:** 50% (catastrophic — this is where value dies)

**What goes wrong:**
- Analysis concludes with "we should optimize route X" — but who owns it?
- Decision recorded in meeting notes that no one revisits
- No link between the analysis insight and the operational change
- 3 months later: "Didn't we do some analysis on this?" — nobody can find it
- ROI of the entire analytics cycle: zero, because action was never taken

---

## Cost Model

### Assumptions

| Parameter | Value | Source |
|-----------|-------|--------|
| Senior data analyst day rate | €650/day | Finnish market, 2026 |
| Junior data analyst day rate | €400/day | Finnish market, 2026 |
| Blended analyst rate | €525/day | Weighted average |
| Stakeholder opportunity cost | €1,200/day | Manager-level, decision delay cost |
| Rework multiplier | 1.6× | Industry average for analytics rework |

### Total Cycle Cost (Traditional)

| Component | Days | Rate | Cost |
|-----------|------|------|------|
| Analyst time (16 days) | 16 | €525/day | €8,400 |
| Rework (1.6× on failed stages) | ~6 | €525/day | €3,150 |
| Stakeholder waiting cost | 20 | €1,200/day | €24,000 |
| **Total per analytics cycle** | | | **€35,550** |

### Annual Cost (Conservative)

| Scenario | Cycles/Year | Annual Cost |
|----------|------------|-------------|
| Small team (1 analyst, 6 projects) | 6 | €213,300 |
| Medium team (3 analysts, 18 projects) | 18 | €639,900 |
| Enterprise (10 analysts, 50 projects) | 50 | €1,777,500 |

---

## ROI Baseline for AI-Assisted Pipeline

The AI-assisted pipeline must demonstrate:

| Metric | Traditional | Target (AI-Assisted) | Improvement |
|--------|------------|---------------------|-------------|
| Cycle time | 4 weeks | < 15 minutes | 99.5% reduction |
| Analyst hours per cycle | 128h | < 2h (review only) | 98.4% reduction |
| Cost per cycle | €35,550 | < €500 (API + review) | 98.6% reduction |
| Failure/rework rate | 94% compound | < 10% | 84 pp reduction |
| Decision-to-action gap | Days/weeks | Same session | Near-zero |

**Break-even calculation:** If the AI pipeline costs €200/month (API + compute) and eliminates even 2 traditional cycles per year, ROI = (€71,100 - €2,400) / €2,400 = **2,862% annual ROI**.

---

## Target Customer Impact

| Customer | Industry | Primary Pain Point | Expected Savings |
|----------|----------|-------------------|-----------------|
| NCC | Construction | Project delay analytics (Stage 4–5) | €180K/year |
| T2H | Staffing/HR | Workforce demand forecasting (Stage 1–3) | €95K/year |
| Uber Taksi Helsinki | Logistics | Route optimization insights (Stage 5–7) | €120K/year |
| Bolt | Mobility | Dynamic pricing analysis (Stage 3–4) | €150K/year |
| Kela | Public Sector | Benefit fraud detection review (Stage 5–6) | €200K/year |

---

## Conclusion

The traditional analytics cycle is not slow because the math is hard — it's slow because every stage requires manual handoffs, human scheduling, and tribal knowledge. The AI-assisted pipeline attacks all 7 failure points simultaneously by automating the mechanical work (stages 1–4) and translating results into business language (stages 5–7), leaving humans to do what they're best at: validating insights and making decisions.
