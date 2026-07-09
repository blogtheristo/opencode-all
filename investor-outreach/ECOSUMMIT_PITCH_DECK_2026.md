# Ecosummit Pitch Deck — DWS IQ 6

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/update-pillar-1-messaging-63wXw | Date: 20.04.2026 | Changes: Initial creation — 10-slide Ecosummit pitch deck for October 7-8 2026 Berlin. Tuned for climate tech investor audience (no CBAM/CSRD explanations, leads with tariff risk, network effect as hero slide). Based on INVESTOR_HOOK_DECK.md v3.0 but reframed for 5-minute stage format.

Session Links & References:

- Source deck: docs/INVESTOR_HOOK_DECK.md (v3.0)
- Target event: Ecosummit.ai Berlin, October 7-8 2026
- Application: send PDF to Ecosummit (rolling, apply by September 2026)

Document Status:

- Created: 20.04.2026
- Last Modified: 20.04.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE — submit as PDF to Ecosummit

---

> **Format:** 10 slides · 5-minute stage pitch · recorded + published on YouTube
> **Audience:** Climate tech investors, corporate decarbonization leads, industrial VCs
> **Assumption:** Audience knows ETS, CBAM, CSRD, Taxonomy. Do not explain them — use them.
> **Round:** EUR 650K SAFE · EUR 3.8M cap · 18% discount · Series A 2026

---

## Slide 1 — Cover

**DWS IQ 6**
Carbon is the new VAT. We build the ledger.

Lifetime Oy · Finland · risto@lifetime.fi
Raising: EUR 650K SAFE · EUR 3.8M cap · 18% discount

---

## Slide 2 — The Regulatory Wave Has Already Hit

50,000+ EU companies face simultaneous obligations across four interlocking regulations:

- **ETS Phase 4** — free allocation tightening 2026–2030. Every tonne surrendered costs real money.
- **CBAM full implementation 2026** — steel, aluminium, cement, fertiliser, hydrogen, electricity. Default rates are wrong and expensive.
- **CSRD wave 2025–2028** — fewer than 5,000 large companies (post-Omnibus, >1,000 employees) filing double-materiality reports. Scope 3 requires supplier emission data.
- **EU Taxonomy** — alignment requires the same underlying carbon data as ETS, CBAM, and CSRD.

**The problem:** Same carbon. Four regulatory touchpoints. Four separate compliance silos. No shared ledger.

**The consequence:** Companies pay CBAM on default emission factors that are 30–60% higher than their suppliers' actual verified data. Every default factor used is a direct tariff overpayment.

---

## Slide 3 — The Tariff Trap: Default Rates vs Actual

CBAM uses default emission factors when actual verified data is unavailable.

| Sector              | CBAM Default Factor | Actual EU Average | Cost Gap per tonne    |
| ------------------- | ------------------- | ----------------- | --------------------- |
| Steel (basic iron)  | 1.894 tCO2/t        | 1.328 tCO2/t      | ~€33/tonne at €65 EUA |
| Cement (clinker)    | 0.766 tCO2/t        | 0.542 tCO2/t      | ~€15/tonne            |
| Aluminium (primary) | 6.745 tCO2/t        | 4.100 tCO2/t      | ~€172/tonne           |

_Sources: EU ETS Benchmark 2021-2025 (Reg. 2021/447), CBAM defaults (Reg. 2023/1773)_

A construction company importing 10,000 tonnes of steel per year and using the CBAM default rate overpays by **~€330,000/year** versus the verified supplier rate.

**DWS IQ 6 eliminates this gap — automatically.**

---

## Slide 4 — The Product: One Ledger, Four Regulations

**DWS IQ 6** is carbon balance sheet infrastructure.

Double-entry bookkeeping for CO2. Every compliance event produces a journal entry — debit or credit, in both EUR and tCO2e.

- ETS surrender → debit
- Free allocation received → credit
- CBAM certificate purchase → debit
- Taxonomy-aligned investment → credit

The same tonne flows across ETS, CBAM, CSRD, and Taxonomy — four regulations, one auditable ledger.

**What this replaces:**

- Manual CBAM certificate calculations in spreadsheets
- Disconnected CSRD Scope 3 data collection
- Siloed ETS registry reconciliation
- Consultant-led Taxonomy alignment assessments

**Delivery:** a fleet of skilled agents. Real-time. Edge-deployable on NVIDIA Jetson at industrial sites where cloud cannot reach. EUR 17K/year vs EUR 350K/year cloud-only alternatives.

---

## Slide 5 — The Network Effect (Hero Slide)

**When one customer's verified data improves another customer's compliance accuracy — automatically — you have infrastructure, not software.**

**Concrete example:**

A Finnish steel producer operates under EU ETS. Their verified surrender data — accepted as a Level 1 emission factor by the EUTL — is recorded in the DWS IQ carbon ledger.

A Nordic construction group imports structural steel from the same producer. Instead of the CBAM default factor (1.894 tCO2/t), they use the verified Level 1 factor (1.328 tCO2/t) pulled directly from the ledger.

**Result:** CBAM certificate cost estimate reduced by ~40%. Neither company negotiated or exchanged data directly. The ledger reconciled it automatically.

As more producers submit verified data, every downstream importer's CBAM calculation becomes more accurate — and cheaper.

**This is a carbon data network effect. No competitor has this. 3–5 years to replicate.**

---

## Slide 6 — Traction

Live. Paying. Retaining.

- **EUR 7K MRR** (March 2026) — 100% retention, zero churn
- **6 paying customers** across industrial verticals
- **25 EU-regulated industries** covered
- **a fleet of skilled agents** in production
- **13 open data sources** baked in (EUTL, ENTSO-E, EFRAG, Eurostat, EMBER, EEA)
- **3 InvestEU Portal listings** (INPO-20254383)
- **V1 public launch:** Arctic 15 Helsinki, June 15 2026

**Partners:** NVIDIA Connect, Microsoft Founders Hub (L1–L4), AWS Consulting Partner, Google, IBM Business Partner.

**Sales timeline:**

- June 15 – August 15: 2-month dedicated sprint
- Target: 25 customers × EUR 36K ACV = EUR 900K ARR
- Series A: Q3–Q4 2026 at EUR 15M+ pre-money

---

## Slide 7 — The Moat

Three pillars. Each takes years to build. Together they are infrastructure.

**Pillar 1 — Carbon Balance Sheet**
Avoid €millions in tariff exposure with real-time embedded carbon tariff automation (CBAM) + supply chain disclosure mapping (CSRD). Double-entry ledger with network effects. No competitor has this. 3–5 years to replicate.

**Pillar 2 — Lifetime World Model**
15,000+ EU regulatory documents indexed across 25 industries. Seven years and six platform versions to build. Not a fine-tuned GPT on PDFs — a regulatory intelligence graph that maps obligations across ETS, CBAM, CSRD, EPBD, and every Fit for 55 regulation simultaneously. 3–5 years to replicate.

**Pillar 3 — Edge AI + Model-Agnostic Orchestration**
NVIDIA Jetson inference at factory floors, construction sites, mid-ocean vessels — where cloud cannot reach. EUR 17K/year vs EUR 350K/year cloud. Swap any LLM tomorrow; the ledger still works. Built on Model Context Protocol (MCP). 2–3 years to replicate.

---

## Slide 8 — Market

**Post-Omnibus, ~5,000 large EU filers and their value chains need a carbon balance sheet by 2028.**

- CBAM full implementation: 2026 (steel, aluminium, cement, fertiliser, hydrogen, electricity)
- CSRD wave 1: 250 large companies filing 2025
- CSRD wave 2: fewer than 5,000 large companies (post-Omnibus, >1,000 employees) filing 2026–2028
- ETS Phase 4 tightening: annual Linear Reduction Factor raised to 4.3% (2024–2027), 4.4% (2028–2030)

**EU TAM: EUR 15–20B over 10 years**
(Source: Lifetime market model — compliance automation across 25 industries)

**Beachhead:** Nordic and DACH industrial companies (steel, construction, manufacturing) with active CBAM exposure and CSRD filing obligations. EUR 4,950 pilot → EUR 36K annual contract.

**Why now:** CBAM transitional period ended December 2025. Real financial penalties began January 2026. The market is not future — it is present.

---

## Slide 9 — Team

**Risto Päärni — Founder / CEO**
35 years in enterprise software and industrial ICT. M.Sc. Industrial Management. Built DWS IQ 6 solo — 1,030+ PRs, a fleet of skilled agents, edge AI on NVIDIA Jetson, three InvestEU validations. Encodes 35 years of industrial domain knowledge into agents.

**AI agents operating under Risto's editorial authority — this is the product in action:**

- Rocky — investor narrative, round positioning, pipeline qualification
- Marcus — technical DD, architecture, integration delivery
- Adrian — platform architecture, security framework, EU AI Act compliance
- Lucille Santiago — customer onboarding, investor welcome, operations

**Advisors:**

- Hannamari Robertsson — CEO, Robertsson Oy (ESG & Business Consulting)
- Dr. Jarno Varteva + Dr. Erkki Räsänen — Metropolia University of Applied Sciences

**First EUR 50K of raise funds senior human engineering hire (Q3 2026).**

**100% Finnish-owned. 100% EU data residency. Zero CLOUD Act exposure.**

---

## Slide 10 — The Ask

**EUR 650K SAFE · EUR 3.8M valuation cap · 18% discount**

Seat structure:

- Fleet Admiral — EUR 500K · 1 seat · Board observer, first right of refusal
- Captain — EUR 150K · Limited · Industry leadership, Situation Room access
- Industry Captain — EUR 50K · 8 seats · Named captain per EU industry vertical
- Deputy Captain — EUR 5K · 50 seats (hard cap) · Quarterly briefings, upgrade path

**Use of proceeds:**

- EUR 200K — Senior engineering hire (Q3 2026)
- EUR 200K — Sales sprint execution (June 15 – August 15 2026)
- EUR 150K — DWS 7 carbon ledger persistent infrastructure
- EUR 100K — EU market expansion (DACH, Nordics)

**Milestones this raise unlocks:**

- Arctic 15 public launch: June 15 2026
- EUR 900K ARR target: December 2026
- Series A: Q3–Q4 2026 at EUR 15M+ pre-money

Contact: risto@lifetime.fi | https://dws10.com/captain/index.html | linkedin.com/in/ristopaarni

---

**Related documents:**

- `docs/INVESTOR_HOOK_DECK.md` — General investor hook deck (v3.0)
- `investor-outreach/INVESTOR_MEMO.md` — Full investor memo (v5.2)
- `investor-outreach/V3-DWS-IQ6-InvestorPD_2026.md` — Detailed pitch deck with financials
