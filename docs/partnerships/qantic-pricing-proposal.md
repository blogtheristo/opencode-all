---
VERSION AND AGENT HISTORY
Document: Qantic × Lifetime Oy — Defensible Pricing Proposal
Version: 1.0
Created: 2026-03-21
Author: Claude Opus 4.6 (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: DRAFT — INTERNAL STRATEGY

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Build-vs-buy anchored pricing, honest COGS, three tiers

Document Status:
  - Last Modified: 21.03.2026
  - Classification: CONFIDENTIAL — Pricing Strategy
  - Publication Status: INTERNAL ONLY
---

# Qantic × Lifetime Oy — Defensible Pricing Proposal

## The Pricing Anchor: Build vs Buy

Compliance modelling is a debit-credit problem. The math is simple. Pricing must reflect this honestly — if we overprice, Thomas builds it himself in a quarter.

### What it costs Qantic to build it themselves

| Cost | Year 1 | Year 2+ |
|------|--------|---------|
| Junior dev (3 months, German salary) | €20,000 | €0 |
| Read + map 82 ESRS disclosures | included above | €0 |
| Emission factor DB (public data, manual) | €2,000 | €2,000 |
| EU regulation tracking (20% of one person) | €0 | €16,000 |
| Cloud hosting (basic) | €3,000 | €3,000 |
| **Total** | **€25,000** | **€21,000** |

### The breakeven rule

Our price per asset must satisfy:

**Our price × number of assets < €25,000 (year 1) and < €21,000 (ongoing)**

At 5 assets: must be under €5,000/asset year 1
At 10 assets: must be under €2,500/asset
At 50 assets: must be under €500/asset

If we price above this, the rational decision is to build.

---

## Our Actual COGS Per Asset

| Cost | EUR/asset/year | Notes |
|------|----------------|-------|
| Cloud compute (API calls) | €120 | Supabase + Cloud Run, amortized |
| Emission factor DB maintenance | €80 | Annual update cycle, allocated per asset |
| ESRS regulation tracking | €150 | EU regulation changes, allocated per asset |
| Support + SLA monitoring | €100 | Business hours CET, 99.5% uptime |
| **Total COGS** | **€450** | |

Gross margin target: 60-70%

---

## Pricing: Three Tiers

### Tier 1 — Per-Report (Phase 1, no integration)

For product deals before API exists. One-off compliance reports.

| Deliverable | Price | COGS | Margin |
|-------------|-------|------|--------|
| Single BESS compliance report (PDF) | €1,500 | €450 + €300 delivery | 50% |
| Annual compliance subscription (4 quarterly reports) | €4,800 | €450 + €600 delivery | 52% |

**Why this price:** A Big 4 consultant charges €15,000-€50,000 for one CSRD report. We're 10x cheaper. But Thomas could also just use a spreadsheet for one asset — so €1,500 is the "not worth my time to build" threshold.

### Tier 2 — Per-Asset API (Phase 2-3, integrated)

Q-System calls our API. Automated. No manual delivery.

| Assets | Price/asset/year | Total/year | vs Build cost |
|--------|------------------|------------|---------------|
| 1-5 | €1,200 | €1,200-€6,000 | Always cheaper than building |
| 6-15 | €900 | €5,400-€13,500 | Always cheaper than building |
| 16-50 | €600 | €9,600-€30,000 | Cheaper up to ~35 assets |
| 51+ | €400 | €20,400+ | Breakeven at ~52 assets |

**Volume discount logic:** At 50+ assets, Qantic could justify a full-time hire. But the hire still takes 3 months to build + doesn't include regulation tracking. The discount keeps "buy" rational up to ~80 assets.

**Minimum annual commitment: €6,000** (equivalent to 5 assets at Tier 1 pricing). Covers our fixed costs for maintaining the API endpoint, SLA, and regulation updates.

### Tier 3 — White-Label OEM (if Qantic resells as their own module)

Qantic brands it as "Q-System Compliance" and resells to their clients.

| Model | Price | Condition |
|-------|-------|-----------|
| Base platform fee | €12,000/year | Access to API + white-label rights |
| Per-asset on top | €400/asset/year | Same API, Qantic bills their client |
| Qantic's suggested resale | €1,500-€2,500/asset/year | Their margin, their problem |

**Why OEM is the best long-term play:**
- Qantic takes sales risk, we take engineering risk
- Their margin (€1,100-€2,100/asset) motivates them to sell
- We get guaranteed €12,000 + per-asset regardless of their pricing
- Non-compete is strongest here — they're reselling, not competing

---

## What We Do NOT Charge For

| Item | Why free |
|------|---------|
| Integration setup | Removes adoption friction |
| JSON format mapping | One-time, we need it too |
| Sandbox/test API | Let them validate before committing |
| First 2 assets | Trial period, prove value |

---

## Price Defense Matrix

For when Thomas pushes back on pricing:

| Objection | Response | Number |
|-----------|----------|--------|
| "We can build this ourselves" | "Yes, for €25k year 1 + €21k/year ongoing. Our API costs €6k-€13.5k/year for 5-15 assets. You break even at 35+ assets — do you have 35 CSRD clients today?" | Build cost > API cost for <35 assets |
| "€1,200/asset is too much" | "A Big 4 CSRD report costs €15,000-€50,000. We're 10x cheaper and automated." | 10x cheaper than alternative |
| "Why not revenue share?" | "Revenue share means we earn nothing until your clients pay. Per-asset means we both know the cost upfront. Predictable for both sides." | Predictability |
| "Can you go lower?" | "Below €900/asset our gross margin drops under 50%. We can't maintain the API, track regulation changes, and provide SLA below that. But we can offer 2 free trial assets." | €450 COGS floor |
| "We'll use a spreadsheet" | "Works for 1 asset. At 5+ assets with quarterly CSRD updates, manual tracking costs more in employee time than our API." | 5 assets = spreadsheet breakeven |

---

## Revenue Projections (Revised)

### Conservative: Tier 2 Per-Asset

| Year | Assets | Avg price/asset | Revenue | Notes |
|------|--------|-----------------|---------|-------|
| Year 1 | 3 | €1,500 (reports) | €4,500 | Phase 1 product deals |
| Year 1 | 2 | €1,200 (API trial) | €2,400 | Free trial converts |
| Year 2 | 10 | €900 | €9,000 | Referrals from Phase 1 |
| Year 3 | 20 | €750 (blended) | €15,000 | Organic growth |
| **3-year** | | | **€30,900** | |

### Optimistic: Tier 3 OEM

| Year | Base fee | Assets | Per-asset | Revenue | Notes |
|------|----------|--------|-----------|---------|-------|
| Year 1 | €0 | 5 | €1,200 | €6,000 | Proving phase |
| Year 2 | €12,000 | 15 | €400 | €18,000 | OEM signed |
| Year 3 | €12,000 | 40 | €400 | €28,000 | Qantic scales |
| **3-year** | | | | **€52,000** | |

### Why these numbers are lower than V5

V5 assumed per-seat SaaS at €300-€500/seat/month. That's enterprise software pricing for what is a debit-credit calculation. Defensible pricing is per-asset, anchored to build-vs-buy, and honest about the simplicity of the underlying math.

**€52k over 3 years is not exciting.** But it's real. And it comes with:
- Zero sales cost (Qantic sells)
- Channel lock-in (first mover in Q-System)
- Reference logos (MAN, Naturstrom)
- Regulation update revenue that compounds (ESRS changes annually)

---

## The Honest Bottom Line

This is not a €1M ARR product line. It's a €15-30k/year API revenue stream that:
1. Costs us almost nothing to maintain (already built)
2. Gives us energy sector reference clients
3. Creates a distribution channel we don't have to build
4. Generates case studies for direct enterprise sales

The real money is not in the Qantic API deal. It's in using Qantic clients as proof points to sell DWS IQ 6 directly to larger enterprises at full product pricing.

---

**Document Owner:** Product Strategy
**Contact:** risto@lifetime.fi
**Distribution:** INTERNAL ONLY — Lifetime Oy

© 2026 Lifetime Oy · Pricing Strategy · Confidential
