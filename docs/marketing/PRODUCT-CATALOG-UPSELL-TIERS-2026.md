# DWS IQ 6 — Product Catalog & Upsell Tiers 2026

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/ai-pricing-labor-model-GeqbE | Date: 14.05.2026 | Changes: Initial creation — actionable DWS IQ 6 product catalog with five upsell tiers (T0 Pilot → T1 Starter → T2 Pro → T3 Function → T4 Workforce), per-SKU pricing, explicit upsell paths, and bundle overlays. Synthesizes AI-AS-LABOR-PRICING-STRATEGY, SKILLED-AGENTS-PRICE-LIST-2026, and CONSULTING-PLUS-AGENTS-BUNDLES-2026 into one operating catalog for sales.

Session Links & References:

- Claude Code (claude/ai-pricing-labor-model-GeqbE): https://github.com/blogtheristo/dws6/commits/claude/ai-pricing-labor-model-GeqbE
- View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/ai-pricing-labor-model-GeqbE/docs/marketing/PRODUCT-CATALOG-UPSELL-TIERS-2026.md

Document Status:

- Created: 14.05.2026
- Last Modified: 14.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE (pricing as pilot/Blue until Green ratification)

***

## 1. The Five Upsell Tiers

| Tier | Name             | Status | Monthly band (€) | What the buyer gets                                                              | Buyer signal to move up                          |
|-----:|------------------|--------|------------------|----------------------------------------------------------------------------------|--------------------------------------------------|
|  T0  | **Pilot**        | Blue   | 0 – 999           | 30–90 days, single agent, capped outcomes, no SLA, watermarked outputs            | First signed output approved                     |
|  T1  | **Starter**      | Green  | 999 – 1,999       | One agent, metered per-outcome, basic SLA, EU residency                            | ≥3 outcomes/month for 2 consecutive months       |
|  T2  | **Pro**          | Green  | 1,999 – 3,999     | One agent, unlimited outcomes, enterprise SLA, audit pack, KYA TC-2+               | Second agent gets attached                       |
|  T3  | **Function**     | Green  | 3,999 – 8,499     | Function-as-a-Service bundle (2–4 agents) + Themis orchestration                  | Buyer is replacing a full role / advisory line   |
|  T4  | **Workforce**    | Green  | 19,990            | Full Skilled Workforce — 16 agents, Themis, premium SLA, EU AI Act co-sign        | Programmatic / CFO-CEO-led automation push       |

Annual prepay at every tier = 10× monthly (2 months free). Consulting/training bundles (see §4) are a separate land-motion overlay; they accelerate movement from T0 → T2 in one step.

---

## 2. Master Catalog — Single-Agent SKUs

Each row is a real, sellable SKU. Pilot prices today, Green ratification per `DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md`.

### 2.1 Compliance line (regulatory)

| SKU code     | Product                                | Tier | Price (€)         | Includes                                                              | Next upsell        |
|--------------|----------------------------------------|:----:|-------------------|-----------------------------------------------------------------------|--------------------|
| CMP-T0       | Compliance Agent — Pilot 60 days       | T0   | 0 (capped)        | 2 gap analyses, watermarked, no SLA                                   | CMP-T1             |
| CMP-T1       | Compliance Agent — Starter             | T1   | 1,499/mo          | 3 gap analyses/mo, basic SLA                                          | CMP-T2             |
| CMP-T2       | Compliance Agent — Pro                 | T2   | 2,999/mo          | Unlimited outcomes, audit pack, EU AI Act co-sign-ready               | ESG-T3 / SOV-T3    |
| CMP-OC-STD   | Outcome: CSRD/CBAM/AI Act gap (Std)    | meter| 999 / report      | Single-domain analysis                                                | CMP-T1 attach      |
| CMP-OC-ENT   | Outcome: same, Enterprise              | meter| 2,499 / report    | Audit pack, signed-off                                                | CMP-T2 attach      |

### 2.2 HSE line (site safety)

| SKU code     | Product                                | Tier | Price (€)         | Includes                                                              | Next upsell        |
|--------------|----------------------------------------|:----:|-------------------|-----------------------------------------------------------------------|--------------------|
| SS-T0        | SiteSense — Pilot 30 days              | T0   | 0 (1 site)        | 5 assessments, watermarked                                            | SS-T1              |
| SS-T1        | SiteSense — Starter                    | T1   | 1,499/mo          | 30 assessments/mo, 1 site                                             | SS-T2              |
| SS-T2        | SiteSense — Pro                        | T2   | 2,499/mo          | Unlimited sites, audit trail, EN 13001 crane warnings                 | CONSTR-T3          |
| SS-OC-STD    | Outcome: site-safety assessment        | meter| 49 / site/day     | Single-site daily score                                               | SS-T1 attach       |
| SS-OC-ENT    | Outcome: same, Enterprise              | meter| 99 / site/day     | Signed-off, insurance-ready                                           | SS-T2 attach       |

### 2.3 Carbon / ESG line

| SKU code     | Product                                | Tier | Price (€)         | Includes                                                              | Next upsell        |
|--------------|----------------------------------------|:----:|-------------------|-----------------------------------------------------------------------|--------------------|
| MO-T0        | Material Oracle — Pilot 60 days        | T0   | 0 (1 project)     | 1 LCA report, watermarked                                             | MO-T1              |
| MO-T1        | Material Oracle — Starter              | T1   | 1,299/mo          | 2 LCA reports/mo                                                      | MO-T2              |
| MO-T2        | Material Oracle — Pro                  | T2   | 1,999/mo          | Unlimited LCA, EN 15978 A1–D, audit pack                              | ESG-T3             |
| ED-T1        | Emissions Data — Starter               | T1   | 999/mo            | Scope 1/2/3 dataset, monthly variance                                 | ED-T2              |
| ED-T2        | Emissions Data — Pro                   | T2   | 1,499/mo          | Unlimited datasets, supplier reach                                    | ESG-T3             |
| MO-OC-STD    | Outcome: LCA report (Std)              | meter| 499 / report      | Single project, EN 15978                                              | MO-T1 attach       |
| MO-OC-ENT    | Outcome: LCA report (Enterprise)       | meter| 999 / report      | Signed, supplier-data-validated                                       | MO-T2 attach       |

### 2.4 Construction line

| SKU code     | Product                                | Tier | Price (€)         | Includes                                                              | Next upsell        |
|--------------|----------------------------------------|:----:|-------------------|-----------------------------------------------------------------------|--------------------|
| SG-T1        | Schedule Genius — Starter              | T1   | 1,299/mo          | 2 project plans/mo                                                    | SG-T2              |
| SG-T2        | Schedule Genius — Pro                  | T2   | 1,999/mo          | Unlimited plans, risk-pass automation                                 | CONSTR-T3          |
| CONSTR-T2    | Construction Agent (bundle) — Pro      | T2   | 3,999/mo          | Safety + materials + plan in one assessment                           | CONSTR-T3          |
| LOG-T1       | Logistics — Starter                    | T1   | 1,299/mo          | 5 lanes                                                               | LOG-T2             |
| LOG-T2       | Logistics — Pro                        | T2   | 1,799/mo          | Unlimited lanes, ETA risk model                                       | CONSTR-T3          |

### 2.5 Sovereignty & Quality line

| SKU code     | Product                                | Tier | Price (€)         | Includes                                                              | Next upsell        |
|--------------|----------------------------------------|:----:|-------------------|-----------------------------------------------------------------------|--------------------|
| SOV-T1       | Sovereignty Monitor — Starter          | T1   | 1,299/mo          | Monthly DB assessment                                                 | SOV-T2             |
| SOV-T2       | Sovereignty Monitor — Pro              | T2   | 1,999/mo          | Continuous monitoring, NIS2 reports                                   | SOV-T3             |
| QG-T1        | Quality Gate — Starter                 | T1   | 999/mo            | Up to 10k verified outputs                                            | QG-T2              |
| QG-T2        | Quality Gate — Pro                     | T2   | 1,499/mo          | Unlimited outputs, schema/citation audit                              | (attached only)    |

### 2.6 Growth line (CRM-adjacent, Salesforce-listed)

| SKU code     | Product                                | Tier | Price (€)         | Includes                                                              | Next upsell        |
|--------------|----------------------------------------|:----:|-------------------|-----------------------------------------------------------------------|--------------------|
| CSAT-T1      | Customer Sat — Starter                 | T1   | 599/mo            | 1 cohort                                                              | CSAT-T2            |
| CSAT-T2      | Customer Sat — Pro                     | T2   | 999/mo            | Unlimited cohorts, churn flag                                         | GTM-T3             |
| LF-T1        | Lead Feedback — Starter                | T1   | 599/mo            | Weekly pipeline review                                                | LF-T2              |
| LF-T2        | Lead Feedback — Pro                    | T2   | 999/mo            | Continuous review, objection map                                      | GTM-T3             |
| CS-T1        | Competitor Surveillance — Starter      | T1   | 899/mo            | Monthly brief, 1 segment                                              | CS-T2              |
| CS-T2        | Competitor Surveillance — Pro          | T2   | 1,499/mo          | Continuous, multi-segment                                             | GTM-T3             |
| SEO-T1       | SEO Audit — Starter                    | T1   | 599/mo            | Quarterly audit                                                       | SEO-T2             |
| SEO-T2       | SEO Audit — Pro                        | T2   | 999/mo            | Monthly + recommendations                                             | GTM-T3             |

### 2.7 Knowledge & Orchestration

| SKU code     | Product                                | Tier | Price (€)         | Includes                                                              | Next upsell        |
|--------------|----------------------------------------|:----:|-------------------|-----------------------------------------------------------------------|--------------------|
| DW-T1        | Deepwiki Extractor — Starter           | T1   | 599/mo            | 5 source packs                                                        | DW-T2              |
| DW-T2        | Deepwiki Extractor — Pro               | T2   | 799/mo            | Unlimited, structured outputs                                         | (attached only)    |
| VIA-T1       | Viability — Starter                    | T1   | 999/mo            | 1 go/no-go scoring per quarter                                        | VIA-T2             |
| VIA-T2       | Viability — Pro                        | T2   | 1,499/mo          | Continuous scoring + sensitivity                                      | (attached only)    |
| TH-T2        | Themis Coordinator — Pro               | T2   | 2,499/mo          | Case routing, sub-agent assignment, KYA chain                         | T3 / T4            |

---

## 3. Master Catalog — Function & Workforce Bundles (T3 / T4)

| SKU code   | Bundle                              | Tier | Price (€/mo) | Annual (€) | Agents included                                                              | Replaces (FTE)            |
|------------|-------------------------------------|:----:|-------------:|-----------:|------------------------------------------------------------------------------|---------------------------|
| ESG-T3     | ESG Function-as-a-Service           | T3   |        6,999 |     69,990 | Material Oracle + Emissions Data + Compliance + Themis                       | 1.5–2.0 ESG/Compliance    |
| HSE-T3     | HSE Function-as-a-Service           | T3   |        4,999 |     49,990 | SiteSense + Compliance (HSE scope) + Themis                                   | 1.0–1.5 HSE supervisors   |
| CONSTR-T3  | Construction Ops Pod                | T3   |        8,499 |     84,990 | Construction + Schedule Genius + Logistics + Themis                           | 2.0 PM/planner roles      |
| SOV-T3     | Sovereignty & Compliance Pack       | T3   |        5,499 |     54,990 | Sovereignty Monitor + Compliance + Quality Gate                               | 1.0 compliance + 0.3 DPO  |
| GTM-T3     | Go-to-Market Pod                    | T3   |        3,999 |     39,990 | SEO Audit + Competitor Surveil. + Lead Feedback + CSAT                        | 1.5 marketing/CS analysts |
| WF-T4      | Full Skilled Workforce              | T4   |       19,990 |    199,990 | All 16 agents, Themis-coordinated, premium SLA                                | 6–8 FTE                   |

### Industry Pod overlay (T3 vertical specialization, on top of CONSTR-T3 or ESG-T3)

| SKU code  | Industry Pod                | Wrapped agent(s)            | Add-on (€/mo) | Vertical buyer                |
|-----------|-----------------------------|-----------------------------|--------------:|-------------------------------|
| IND-MARS  | Mars — Construction         | CONSTR-T3 + vertical model  |          +999 | Construction COO              |
| IND-HELIOS| Helios — Energy             | ESG-T3 + energy model       |          +999 | Energy sustainability head    |
| IND-VULCAN| Vulcan — Steel              | ESG-T3 + ETS/CBAM model     |        +1,499 | Steel ESG / trade compliance  |
| IND-TALOS | Talos — Aluminium           | ESG-T3 + ETS/CBAM model     |        +1,499 | Aluminium ESG                 |
| IND-GAIA  | Gaia — Cement               | ESG-T3 + ETS/CBAM model     |        +1,499 | Cement ESG                    |
| IND-CERES | Ceres — Agri / Circular     | ESG-T3 + circular model     |          +999 | Agri / circular-economy lead  |
| IND-NEPTUN| Neptune — Maritime          | CONSTR-T3 + maritime model  |          +999 | Maritime ops director         |
| IND-PROM  | Prometheus — Hydrogen       | ESG-T3 + hydrogen model     |        +1,499 | Energy-transition lead        |
| IND-BESS  | BESS — Battery storage      | ESG-T3 + BESS model         |        +1,499 | BESS operator                 |

Industry Pods do **not** sell standalone — they always sit on top of a T3 bundle as a vertical-specialization add-on. This avoids fragmenting the catalog into 9 verticals × 16 agents.

---

## 4. Land Overlay — Consulting / Training + Agent-to-Keep

These bundles **collapse the T0 → T2/T3 ladder into a single sale** by attaching a one-time engagement to a 12-month agent subscription. They are the highest-velocity entry SKUs.

| SKU code   | Bundle                              | Tier on landing | Engagement                       | Y1 (€)  | Y2+ (€/yr) |
|------------|-------------------------------------|:---------------:|----------------------------------|--------:|-----------:|
| LAND-AIL   | AI Literacy Bridge                  | T2 Compliance   | EU AI Act Literacy (20 seats)   |  34,990 |     29,990 |
| LAND-EUAI  | EU AI Act Compliance Sprint         | T2 Compliance   | 5-day senior sprint              |  39,990 |     29,990 |
| LAND-HSE   | Site Safety Bootcamp                | T2 SiteSense    | 3-day training + 2-day audit     |  29,990 |     24,990 |
| LAND-CSRD  | CSRD Reporting Accelerator          | T3 ESG          | 10-day ESG accelerator           |  89,990 |     69,990 |
| LAND-LCA   | Carbon Reporting Sprint             | T2 Material/ED  | 5-day LCA sprint                 |  49,990 |     39,990 |
| LAND-SOV   | Sovereignty & NIS2 Sprint           | T3 Sovereignty  | 5-day audit                      |  69,990 |     54,990 |
| LAND-OPS   | Construction Ops Pilot              | T3 Construction | 4–8 wk site pilot                | 109,990 |     84,990 |
| LAND-GTM   | Go-to-Market Sprint                 | T3 GTM          | 5-day sprint                     |  49,990 |     39,990 |
| LAND-THEMIS| Themis Coordinator Workshop        | T2 Themis       | 3-day workshop                   |  29,990 |     24,990 |
| LAND-WF    | Full Workforce Onboarding           | T4 Workforce    | 20-day onboarding                | 249,990 |    199,990 |

**Land-overlay rule (per `CONSULTING-PLUS-AGENTS-BUNDLES-2026.md` §5.1):** Pure consulting is offered only as an exception, priced **+25% over the bundle** so the bundle is always the rational pick.

---

## 5. Upsell Map (How an Account Climbs the Ladder)

```
                                              ┌────────────────────┐
                                              │ T4 Full Workforce  │  €199,990/yr
                                              │   16 agents + TH   │
                                              └─────────▲──────────┘
                                                        │
       ┌─────────────────────────────────┬──────────────┴─────────────────┬─────────────────────┐
       │                                 │                                │                     │
┌──────┴──────┐   ┌──────────────┐   ┌───┴──────────────┐   ┌─────────────┴────┐   ┌────────────┴─────┐
│ T3 ESG-FaaS │   │ T3 HSE-FaaS  │   │ T3 Construction  │   │ T3 Sovereignty   │   │ T3 GTM Pod       │
│ €69,990/yr  │   │ €49,990/yr   │   │ Ops Pod €84,990  │   │ Pack €54,990/yr  │   │ €39,990/yr       │
└──────▲──────┘   └──────▲───────┘   └───────▲──────────┘   └────────▲─────────┘   └─────────▲────────┘
       │                  │                  │                       │                        │
   ┌───┴────┐         ┌───┴────┐        ┌────┴────┐              ┌───┴────┐              ┌────┴────┐
   │T2 CMP, │         │T2 SS,  │        │T2 CONSTR│              │T2 SOV  │              │T2 SEO,  │
   │MO, ED  │         │CMP-HSE │        │SG, LOG  │              │CMP, QG │              │CS, CSAT,│
   │ Pro    │         │ Pro    │        │ Pro     │              │ Pro    │              │ LF Pro  │
   └───▲────┘         └───▲────┘        └────▲────┘              └───▲────┘              └────▲────┘
       │                  │                   │                      │                        │
   ┌───┴────┐         ┌───┴────┐        ┌────┴────┐              ┌───┴────┐              ┌────┴────┐
   │T1 Start│         │T1 Start│        │T1 Start │              │T1 Start│              │T1 Start │
   └───▲────┘         └───▲────┘        └────▲────┘              └───▲────┘              └────▲────┘
       │                  │                   │                      │                        │
   ┌───┴────┐         ┌───┴────┐        ┌────┴────┐              ┌───┴────┐              ┌────┴────┐
   │T0 Pilot│         │T0 Pilot│        │T0 Pilot │              │T0 Pilot│              │T0 Pilot │
   └────────┘         └────────┘        └─────────┘              └────────┘              └─────────┘

  ▲▲ LAND OVERLAY: Sprint / Accelerator / Bootcamp / Workshop / Onboarding
     collapses T0 → T2 (or → T3 for CSRD/Sovereignty/Construction) in a single sale.
```

### Trigger rules (when to push the next tier)

| From → To             | Trigger                                                                      |
|-----------------------|------------------------------------------------------------------------------|
| T0 → T1               | Customer approves first signed output                                        |
| T1 → T2               | ≥3 outcomes/month for 2 consecutive months, or audit-pack requested          |
| T2 → T3 (function)    | Second agent in same domain attached, or buyer mentions "function" / "team"  |
| T3 → T3 + Industry    | Vertical-specific question raised (steel ETS, hydrogen, BESS, etc.)          |
| T3 → T4 (Workforce)   | CFO / CEO joins the conversation, or 3+ T3 bundles in same account           |
| Any T → Land overlay  | Buyer pushes back on AI capability — anchor with a consult                   |

---

## 6. Channel Allocation per Tier

| Tier        | Direct  | Microsoft Agent 365 | Salesforce Agentforce | Partner trainers |
|-------------|:-------:|:-------------------:|:---------------------:|:----------------:|
| T0 Pilot    |   ✅    |          ✅          |           —          |        —         |
| T1 Starter  |   ✅    |          ✅          |          ✅           |        —         |
| T2 Pro      |   ✅    |          ✅          |          ✅           |        —         |
| T3 Function |   ✅    |          ✅          |          ✅ (GTM only)|        —         |
| T4 Workforce|   ✅    |          —           |           —          |        —         |
| Land overlay|   ✅    |    ✅ (services SKU)|           —          |    ✅ (LAND-AIL)  |

MACC-burn motion applies at every Marketplace-listed tier (T0–T3). AppExchange best fit is T1/T2 single-agent and T3 GTM Pod.

---

## 7. SKU → products.json Mapping (Implementation Note)

All SKUs land in `dws10.com/config/products.json` with the `landing-pages/dws10-com/config/products.json` mirror updated in the same commit (per CLAUDE.md Source-of-Truth Rule). Required fields per SKU:

- `sku` (e.g., `CMP-T2`, `ESG-T3`, `LAND-EUAI`)
- `name`
- `tier` (T0 / T1 / T2 / T3 / T4 / land)
- `productType` (subscription / metered-outcome / bundle / land)
- `price` (€)
- `priceUnit` (per-month / per-outcome / per-year)
- `priceVersion` (≥1.13 baseline, +0.01 per change)
- `deploymentColor` (blue / green)
- `agents[]` (which Skilled Agents are included)
- `replaces` (human role and FTE count — required for labor-anchored sales pages)
- `nextUpsellSku` (the recommended upsell target)

Pages must render the `replaces` field as the labor anchor line on the public price-list. **No SaaS comparison is ever shown** (per `AI-AS-LABOR-PRICING-STRATEGY.md`).

---

## 8. Open Questions

1. **Free Trial volume** — should T0 Pilot remain truly free or step to €499 setup fee to filter tire-kickers? Recommendation: keep free at named-account level, €499 for inbound self-serve.
2. **Industry Pod monetization** — confirm +€999/+€1,499 add-on bands with industry-vertical product managers (Mars, Helios, Vulcan, Talos, Gaia, Ceres, Neptune, Prometheus, BESS owners).
3. **Multi-site / multi-entity pricing** — for HSE-T3 and CONSTR-T3 at customers with >10 sites, define a per-site soft cap and per-site uplift.
4. **Partner-trainer rev-share** — accredited DWS partners earn 30% on LAND-AIL deliveries; gate by KYA TC-2+. Approval pending.
5. **AppExchange managed package** — single package vs. one per agent? Single package for T1/T2/T3 (GTM only) is cleaner for buyers and AppExchange review.

---

## 9. Companion Documents

- `docs/marketing/AI-AS-LABOR-PRICING-STRATEGY.md` — positioning thesis.
- `docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md` — per-agent labor-anchored prices + marketplace listings.
- `docs/marketing/CONSULTING-PLUS-AGENTS-BUNDLES-2026.md` — engagement-led land motion.
- `DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md` — Blue/Green governance and price-list versioning.
- `dws10.com/config/products.json` — single source of truth once ratified.
