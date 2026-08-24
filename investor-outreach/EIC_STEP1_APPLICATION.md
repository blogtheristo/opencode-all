# EIC Accelerator Step 1 — Application Draft

***

# VERSION AND AGENT HISTORY

Version: 1.1
Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Opus 5) | Session: claude/traction-truth-reconciliation | Date: 29.07.2026 | Changes: Traction claims reconciled to docs/TRACTION_CANONICAL.md — retired the "6 paying customers / EUR 7k MRR / 100% retention / EUR 84k ARR" formulation, removed dispatch operators (Uber/Bolt/Kela/Taksi Helsinki/Limo Helsinki/Sixt) from software-customer lists, and restated traction as ~EUR 7,000/month services and transport revenue (not software revenue) plus two enterprise pilots contracted Q1/2026 at EUR 29,950 each (EUR 59,900 booked).
- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/add-qivalis-research-ePIAY | Date: 13.04.2026 | Changes: Initial draft — EIC Accelerator Step 1 based on 5-slide Hook Deck narrative (one-liner, cost moat, defensibility moat, Qivalis window, payment-agnostic infrastructure)

Document Status:

- Created: 13.04.2026
- Last Modified: 13.04.2026
- Language: English
- Publication Status: DRAFT — not yet submitted
- Classification: CONFIDENTIAL

Related Documents:

- docs/INVESTOR_HOOK_DECK.md (source narrative — Slides 0–5)
- investor-outreach/INVESTOR_MEMO.md (full investment case v5.2)
- investor-outreach/captain-deck.md (Captain-tier deck v1.2)

EIC Portal: https://eic.ec.europa.eu/eic-funding/eic-accelerator_en
EIC Accelerator Work Programme 2026: https://eic.ec.europa.eu/document/download/

***

## Application Metadata

| Field            | Value                                       |
| ---------------- | ------------------------------------------- |
| Programme        | EIC Accelerator                             |
| Step             | Step 1 (Short Application)                  |
| Company          | Lifetime Oy                                 |
| Y-tunnus         | 0772407-9                                   |
| Country          | Finland                                     |
| Stage            | Seed / Bridge to Series A                   |
| Sector           | Climate Tech / EU Compliance Infrastructure |
| Requested grant  | TBD — confirm before submission             |
| Requested equity | TBD — confirm before submission             |
| Contact          | risto.paarni@lifetime.fi                    |

---

## 1. Executive Summary

_(2500 characters max — current draft: ~1900 characters)_

Lifetime Oy builds **DWS IQ** — the compliance ledger for European industrial
payments. Every tonne of CO2 tracked like every euro: double-entry bookkeeping
for CBAM, CSRD, and ETS obligations, running where cloud cannot reach.

Fewer than ~5,000 large EU companies (post-Omnibus), with their value chains, must file CBAM declarations and CSRD sustainability
reports by 2026–2028. The current state: disconnected spreadsheets, manual
consultants, and compliance tools that require cloud connectivity at industrial
sites where connectivity is absent. The cost of failure is not just a reporting
gap — it is customs seizure, regulatory penalties, and audit liability under
EU AI Act Article 99.

DWS IQ solves this with three compounding moats:

**1. Carbon balance sheet infrastructure.** The first double-entry ledger for
CO2 — every CBAM import, ETS surrender, and CSRD disclosure produces a journal
entry. Same carbon, four regulatory touchpoints, one auditable ledger. Network
effect: each customer's verified emissions improve the accuracy of all other
customers' CBAM calculations.

**2. Edge AI at EUR 17,000/year.** NVIDIA Jetson Orin Nano delivers on-premise
AI inference at construction sites, factory floors, and vessels where cloud
costs EUR 350,000/year and latency is 2–5 seconds. DWS IQ operates under
100ms with zero cloud egress. EU AI Act compliant by design (Article 12 logging
shipped March 2026, five months ahead of enforcement).

**3. Payment-agnostic compliance layer.** Qivalis — a 12-bank European
consortium — launches a MiCA-compliant euro stablecoin in H2 2026. The
consortium banks are building payment infrastructure without a compliance layer.
DWS IQ records every CBAM, CSRD, and ETS obligation regardless of whether the
payment moves via Qivalis, SEPA, or any future rail. The compliance obligation
exists at the transaction level, not the rail level.

Current traction: two enterprise pilots contracted Q1/2026 at EUR 29,950 each (EUR 59,900 booked); ~EUR 7,000/month services and transport revenue (not software revenue), a fleet of skilled agents
operational across 25 EU-regulated industries. NVIDIA Connect ISV Partner.
Microsoft Founders Hub L1–L4. Three InvestEU Portal listings.

---

## 2. The Problem

_(1000 characters max — current draft: ~750 characters)_

EU industrial companies face three simultaneous compliance deadlines with no
unified infrastructure:

- **CBAM** (fully operational 2026): Steel, cement, aluminium, fertiliser, and
  electricity importers must declare embedded emissions per shipment. Default
  factors inflate costs by 20–40% vs. actual. Manual process: 8–12 hours per
  declaration.

- **CSRD** (wave 1: 2026, wave 2: 2027): Double materiality assessments,
  Scope 1/2/3 emissions, taxonomy alignment. Average enterprise cost with
  consultants: EUR 180,000–350,000/year.

- **ETS Phase IV** (2026–2030): Tightening caps, increasing surrender
  obligations. Real-time position tracking required to avoid over-surrender
  or under-compliance penalties.

No single platform connects these three obligations to the underlying
payment and supply chain transactions that generate them.

---

## 3. The Solution

_(1000 characters max — current draft: ~800 characters)_

DWS IQ is a multi-agent AI platform that converts every industrial
transaction into a compliance journal entry — automatically.

**How it works:**

1. A steel shipment is paid via SEPA, Qivalis, or ERP purchase order
2. DWS IQ reads the transaction and embedded emission data
3. Three journal entries are written in the same second:
   - CBAM obligation updated (tCO2e + EUR liability)
   - CSRD Scope 3 emission booked (double-entry ledger)
   - ETS account reconciled (surrender position updated)
4. Audit trail written to tamper-evident Article 12 log (7-year retention)

The platform runs on NVIDIA Jetson Orin Nano (EUR 500/device, 15W) — no
cloud egress, no latency, no CLOUD Act exposure. Model-agnostic: Claude,
Gemini, or any future frontier model can be swapped without rewriting
the compliance logic, which lives in the Lifetime World Model.

A fleet of skilled agents operational. 32 products shipped. 25 EU-regulated industries.

---

## 4. Innovation and Novelty

_(500 characters max — current draft: ~450 characters)_

Three validated innovations, each with academic citation:

1. **Carbon debit-credit ledger** — first application of double-entry
   bookkeeping principles (Pacioli 1494) to CO2 compliance. No competitor
   has this architecture. Metropolia University thesis 2026.

2. **6-layer harness engineering** — information architecture that raised
   AI compliance accuracy from 52.8% to 66.5% without model change.
   Published in master's thesis, Metropolia University 2026.

3. **Payment-agnostic compliance recording** — compliance obligations
   recorded at transaction level, independent of payment rail. First
   implementation of MiCA-aware industrial compliance ledger in Europe.

---

## 5. Market

_(1000 characters max — current draft: ~700 characters)_

**Total Addressable Market:**

- Fewer than ~5,000 large EU companies with direct CSRD obligations post-Omnibus (plus value-chain reporters)
- 4,000+ CBAM importers in steel, cement, aluminium, chemicals (2026 full enforcement)
- EUR 150B+ European compliance software market (Gartner 2025)

**Beachhead:** Nordic construction and industrial companies (500+ ICP
customers identified) — highest CBAM/CSRD exposure, highest digital
maturity, DWS home market.

**Payment tailwind:** Qivalis (12-bank consortium, H2 2026) creates
a new market segment: industrial companies processing payments on
Qivalis rails that need compliance recording. ECB CBDC (~2029) extends
this further. DWS IQ is payment-agnostic — it serves both Qivalis
customers and the Nordea/OP customer base outside the consortium.

**Competitive moat:** No competitor has edge AI + carbon ledger +
payment-agnostic compliance in one platform. Replicate time: 3–5 years
per pillar.

---

## 6. Team

_(500 characters max — current draft: ~400 characters)_

**Risto Päärni, CEO & Founder** — 35 years domain expertise in industrial
software, EU compliance, and AI systems. Master's thesis on AI harness
engineering (Metropolia University, 2026). PhD continuation planned
(LUT University, 2027). NVIDIA Connect ISV Partner, Microsoft Founders
Hub L1–L4. Zero prior VC backing — bootstrapped on ~EUR 7,000/month of services and transport revenue (not software revenue).

**Lucille Santiago** — Logistics & Office.

**Academic advisors:** Hannamari Robertsson (ESG & Business Consulting),
Dr. Jarno Varteva & Dr. Erkki Räsänen (Metropolia University).

First EUR 50K of raise funds senior technical hire Q3 2026.

---

## 7. Finance and Funding Ask

_(500 characters max — current draft: ~350 characters)_

**Current:** ~EUR 7,000/month services and transport revenue (not software revenue), March 2026; two enterprise pilots contracted Q1/2026 at EUR 29,950 each (EUR 59,900 booked).

**Active raise:** EUR 650K SAFE at EUR 3.8M valuation cap (20% discount).
Bridge to Series A targeting EUR 15M+ pre-money, Q3–Q4 2026.

**Use of EIC grant:** EU regulatory compliance R&D — Qivalis payment
integration layer, CBAM automated verification engine, CSRD taxonomy
alignment module.

**Use of EIC equity:** Senior technical hire, NVIDIA Jetson fleet
expansion, pilot customer acquisition across 3 additional EU markets
(Germany, Netherlands, Spain — aligned with Qivalis consortium geography).

---

## Submission Checklist

- [ ] Confirm EIC Accelerator 2026 Work Programme call deadline
- [ ] Register company on EIC Portal (eic.ec.europa.eu)
- [ ] Prepare pitch video (2 minutes max — Step 1 requirement)
- [ ] Confirm grant amount (EUR 0.5M–2.5M range for Step 1 pathway)
- [ ] Confirm equity component (EIC Fund takes minority stake)
- [ ] Legal review of SAFE terms vs. EIC equity structure compatibility
- [ ] Translate executive summary to submission language (EN confirmed)
- [ ] InvestEU Portal listing numbers: INPO-20254383 (cite in application)

---

_Draft 13.04.2026. Submit only after Risto review + legal sign-off._
_Do not submit without confirming current EIC call open/closed status._
