# DWS IQ 6 - Pivot Strategy v2: The Operations Compliance Layer

**Date:** February 8, 2026
**Author:** Risto Anton Paarni
**Status:** ACCEPTED DIRECTION - Refine and execute

---

## Executive Summary

DWS IQ is not a building LCA tool. It is the **operations compliance layer** for companies
that already built, already operate, and now must report to regulators.

The design-phase carbon chain is owned (Rakennustieto EPDs → CO2data.fi → One Click LCA).
The operations-phase compliance chain is **empty across all 27 EU countries.**

DWS IQ fills that gap. We integrate with LCA tools instead of competing with them.

---

## 1. The Market Gap: Design vs. Operations

### The Finnish Construction Data Chain (Already Built)

```
DESIGN PHASE (OWNED)                    OPERATIONS PHASE (EMPTY)
────────────────────                    ────────────────────────
Rakennustieto                           ???
  RT cards (how to build)
  RTS EPDs (material carbon, EN 15804)
  150,000+ products with CO2 data
  40,000 Finnish professionals use daily
        ↓
CO2data.fi (SYKE)
  National emissions database
  GWP values per kg product (A1-A3)
  Conservative factor 1.2x
        ↓
One Click LCA
  Building LCA (design-phase carbon)     → DWS IQ
  250,000+ LCA datasets                    Pulls ERP + project data
  20+ BIM integrations                     Imports One Click LCA outputs
  140+ certifications                      Maps to CSRD evidence
  €21.8M revenue, 200+ people              Auto-generates recurring reports
        ↓                                   Monitors performance over time
Building gets designed + built                    ↓
        ↓                                Regulator gets audit-ready report
NOTHING HAPPENS ← The Gap                every quarter, automatically
```

### This Gap Exists Across All 27 EU Countries

| Country     | Design-phase data               | Design-phase LCA              | Operations compliance              |
| ----------- | ------------------------------- | ----------------------------- | ---------------------------------- |
| Finland     | Rakennustieto EPDs, CO2data.fi  | One Click LCA                 | **Gap**                            |
| Sweden      | Boverket, IVL EPDs              | One Click LCA                 | **Gap**                            |
| Germany     | ÖKOBAUDAT                       | One Click LCA                 | **Gap**                            |
| France      | INIES                           | One Click LCA                 | **Gap**                            |
| Netherlands | NMD (Nationale Milieudatabase)  | One Click LCA                 | **Gap**                            |
| Denmark     | EPD Denmark                     | One Click LCA                 | **Gap**                            |
| Norway      | EPD Norway                      | One Click LCA                 | **Gap**                            |
| All 27      | Each has national EPD databases | Consolidated by One Click LCA | **Every country has the same gap** |

Every country has mature design-phase tools. No country has automated operations compliance.
49,000 EU companies need CSRD filing. They've designed low-carbon buildings.
Now they need to prove they're operating them compliantly.

---

## 2. Positioning: Complete The Chain, Don't Compete With It

### The Positioning Statement

> **DWS IQ is the operations compliance layer for construction portfolios and industrial
> companies. It connects to three data sources (ERP systems, LCA tools, IoT/fleet
> telemetry) and produces three regulator-ready outputs (CSRD double materiality reports,
> ETS emissions declarations, CBAM quarterly import reports). Continuously. Automatically.
> We integrate with LCA tools (including One Click LCA) instead of competing with them.**

### The Three Data Sources → Three Reports

```
DATA SOURCES                         REGULATOR-READY REPORTS
─────────────                        ──────────────────────
1. ERP (IFS/SAP/Dynamics)            1. CSRD double materiality
   Purchase orders, asset registers,    (ESRS E1, annual)
   energy invoices, transport logs

2. LCA tools (One Click LCA)         2. ETS emissions declaration
   Design-phase baselines,              (Scope 1-2, annual + quarterly)
   material carbon (A1-A5)

3. Fleet/IoT telemetry               3. CBAM quarterly import report
   Vehicle emissions, site sensors,     (Scope 3 upstream, quarterly)
   operational energy meters
```

### What This Means In Practice

| LCA tools tell you...                   | DWS IQ tells the regulator...           |
| --------------------------------------- | --------------------------------------- |
| What the building SHOULD emit (design)  | What it ACTUALLY emits (operations)     |
| Material carbon at construction (A1-A5) | Operational carbon over time (B1-B7)    |
| One-time assessment at design           | Continuous quarterly reporting          |
| Architect/engineer is the user          | CFO/sustainability director is the user |
| Manual, project-by-project              | Automated, portfolio-wide               |
| Data from BIM models                    | Data from ERP systems                   |

### The Concrete Integration Claim (For /buy Page)

> "Import One Click LCA building assessments and CO2data.fi emission factors.
> Connect to your ERP (SAP, IFS, Dynamics, Visma, Jeeves, Monitor).
> DWS IQ maps design-phase baselines to operational evidence,
> and auto-generates CSRD/ETS/CBAM reports every quarter."

This makes DWS IQ a **buyer** of One Click LCA outputs, not a competitor.
One Click LCA becomes a data source, like an ERP is a data source.

**Why One Click LCA would partner with us (their incentive, not ours):**

1. **Stickiness** — Their customers finish design-phase LCA and churn. If DWS IQ
   imports their outputs for ongoing operations compliance, the customer keeps their
   One Click LCA subscription active to feed the compliance pipeline.
2. **Revenue share** — We send them referrals for design-phase assessments when our
   CSRD customers need baseline carbon data they don't have yet.
3. **Platform extension** — They've built 20+ BIM integrations. Adding an operations
   compliance partner extends their platform into a lifecycle they don't cover.
4. **No threat** — We don't do LCA. We don't compete on design. We're downstream.

---

## 3. Connector Readiness: Where We Start

### ERP Connector Audit (Honest Assessment)

| Connector    | Lines | Real API Paths           | Auth               | Data Mapping           | Production Ready       |
| ------------ | ----- | ------------------------ | ------------------ | ---------------------- | ---------------------- |
| IFS Cloud    | 231   | Real IFS projection URLs | OAuth2             | 14-field asset mapping | **Closest**            |
| SAP S/4HANA  | 107   | Verifiably real OData    | Basic + sap-client | None yet               | Reads only             |
| Dynamics 365 | 112   | Real MS identity URLs    | OAuth2 (Azure AD)  | None yet               | Auth + 1 read          |
| Monitor      | 551   | Plausible                | OAuth2             | Full bidirectional     | Unverifiable endpoints |
| Visma        | 99    | Plausible                | OAuth2 (buggy)     | None yet               | Maybe 2 calls          |
| Jeeves       | 86    | Likely fabricated        | API key            | None yet               | Unlikely               |

**Shared fatal flaw:** No database persistence. Data is fetched, counted, logged, and discarded.
Every Supabase write is a `// TODO` comment.

### First Integration Target: IFS Cloud

**Why IFS first:**

- Most complete connector (real projection URLs, real OAuth2, actual field mapping)
- IFS dominates asset-intensive industries (construction, manufacturing, energy)
- IFS Cloud is the ERP of choice for NCC, Skanska, and Nordic infrastructure companies
- 5 of 6 sync methods make real HTTP calls

**What needs to happen to make IFS production-ready:**

| Step | Task                                              | Estimate | Measurable Gate                                     |
| ---- | ------------------------------------------------- | -------- | --------------------------------------------------- |
| 1    | Wire Supabase persistence (replace TODO comments) | 4-6h     | `SELECT count(*) FROM erp_sync_log` returns > 0     |
| 2    | Test against real IFS Cloud sandbox               | 4h       | Fetch 1 real work order from IFS demo tenant        |
| 3    | Data transformation for remaining entity types    | 4h       | All 6 entity types produce valid JSONB rows         |
| 4    | Retry/backoff for production reliability          | 2h       | Automated retry on 429/503 with exponential backoff |

**Definition of "production-ready":** A cron job runs every 6 hours, pulls IFS data,
persists to Supabase, and the daily digest shows the latest sync timestamp.
Not "works in Postman." Not "I ran it once." Production = runs unattended.

**Total estimate: ~16h (2 full days).** This is engineering time, not calendar time.
If the IFS sandbox access takes 2 weeks to provision, the 2-day claim is meaningless.
Track sandbox access as a separate blocker.

### Second Integration Target: SAP S/4HANA

**Why SAP second:**

- Verifiably correct OData endpoints (API_PRODUCTION_ORDER_2_SRV)
- Largest ERP market share globally
- Enterprise customers (Compliance Bridge product) will expect SAP
- Needs data transformation layer added — 4-6h more work than IFS

### Integration Roadmap

```
Feb 2026:   IFS Cloud (read) ──── First real ERP connection
Mar 2026:   SAP S/4HANA (read) ── Enterprise market entry
Apr 2026:   Dynamics 365 (read) ── Mid-market expansion
Q3 2026:    Visma + Monitor ────── Nordic mid-market wedge
Q4 2026:    One Click LCA import ─ Design-to-operations bridge
```

---

## 4. Three Products: Wedge → Expand → Enterprise

Fleet is the wedge. It's selling today, it's proven, and it gets us into companies
that will need CSRD and full compliance later. Every fleet customer is a future
CSRD Autopilot upsell. Every CSRD customer operating at scale is a Compliance Bridge deal.

```
WEDGE                    EXPAND                   ENTERPRISE
Fleet Carbon Report      CSRD Autopilot           Compliance Bridge
€3,000/mo                €5,000/mo                €10,000/mo
────────────────────     ────────────────────     ────────────────────
2 contracted pilots      49,000 companies need    Replaces Persefoni
+ 4 landed accounts      No ERP automation exists ($55-250k, manual CSV)
                         Natural upsell from Fleet  Natural upsell from CSRD
```

### Product 1: Fleet Carbon Report (Wedge — Proven)

| Attribute          | Detail                                                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What               | Automated Scope 1-2-3 emissions reporting for fleet/logistics                                                                                               |
| Buyer              | Fleet managers, logistics CFOs                                                                                                                              |
| Price              | €3,000/mo (€36k/year)                                                                                                                                       |
| Why it's the wedge | Two enterprise pilots contracted Q1/2026 at €29,950 each (€59,900 booked), plus four smaller landed accounts. Gets us into companies. Shortest sales cycle. |
| Upsell path        | Fleet customer needs CSRD reporting → CSRD Autopilot                                                                                                        |
| ERP connector      | SAP (transport mgmt) or IFS (asset-intensive)                                                                                                               |

### Product 2: CSRD Autopilot (Expand — Mid-Market)

| Attribute       | Detail                                                                     |
| --------------- | -------------------------------------------------------------------------- |
| What            | ERP-connected CSRD data collection + automated quarterly reports           |
| Buyer           | Mid-market sustainability directors (250-5000 employees)                   |
| Price           | €5,000/mo (€60k/year)                                                      |
| Why it sells    | 49,000 EU companies must file. No tool automates data collection from ERP. |
| Upsell path     | CSRD customer also needs ETS/CBAM → Compliance Bridge                      |
| ERP connector   | IFS, Dynamics 365, Visma (Nordic mid-market)                               |
| LCA integration | Import One Click LCA baselines as CSRD evidence                            |

### Product 3: Compliance Bridge (Enterprise)

| Attribute       | Detail                                                                         |
| --------------- | ------------------------------------------------------------------------------ |
| What            | Full ERP-to-compliance pipeline: CSRD + ETS + CBAM continuous monitoring       |
| Buyer           | Enterprise sustainability directors at industrials                             |
| Price           | €10,000/mo (€120k/year)                                                        |
| Why it sells    | Persefoni = $55-250k/year with manual CSV. We pull from SAP/IFS automatically. |
| ERP connector   | SAP S/4HANA primary, IFS Cloud secondary                                       |
| LCA integration | Import One Click LCA + CO2data.fi for design-vs-actual comparison              |

---

## 5. What Changes (Revised)

### KEEP (Construction Stays, Reframed)

| Keep                  | Reframe                                                             |
| --------------------- | ------------------------------------------------------------------- |
| Construction vertical | Reframe from "building LCA" to "construction operations compliance" |
| SiteSense agent       | Site operational monitoring (not design LCA)                        |
| ScheduleGenius agent  | Project timeline compliance (delivery vs. plan)                     |
| MaterialOracle agent  | Supply chain emissions (procurement, not design material selection) |
| CustomerSat agent     | Rename to "Account Health" - works across all verticals             |
| Viability agent       | ROI/payback - works across all verticals                            |
| EN 15978 knowledge    | Use for operational stages (B1-B7, C, D), not design stages (A1-A5) |
| All 6 ERP connectors  | Core moat. Harden IFS first, then SAP, then rest.                   |

### FREEZE (Don't Delete, Stop Investing)

| Freeze                               | Why                                                      |
| ------------------------------------ | -------------------------------------------------------- |
| Mobile app store submission          | Web PMF first. TestFlight for demos.                     |
| Lifetime Studios / Consulting / Coin | Brand noise. Zero revenue.                               |
| 11 of 14 dashboard variants          | Keep v10-react only.                                     |
| BIM/IFC parser                       | That's One Click LCA's job. Import their output instead. |
| Building LCA calculations            | That's One Click LCA's job. We consume, not produce.     |

### CONSOLIDATE

| From            | To                                                 | Reason                   |
| --------------- | -------------------------------------------------- | ------------------------ |
| 4 domains       | dws10.com (primary) + lifetime.fi (Finnish market) | One brand, one story     |
| 14 dashboards   | v10-react only                                     | One frontend to maintain |
| 8 product lines | 3 products (Fleet, CSRD, Bridge)                   | One product catalog      |

---

## 6. Revenue Model (12-Month)

| Product             | Customers  | Price/mo | MRR         | Source                                                                                              |
| ------------------- | ---------- | -------- | ----------- | --------------------------------------------------------------------------------------------------- |
| Fleet Carbon Report | 10         | €3,000   | €30,000     | Nordic logistics                                                                                    |
| CSRD Autopilot      | 5          | €5,000   | €25,000     | Finnish/Nordic mid-market                                                                           |
| Compliance Bridge   | 2          | €10,000  | €20,000     | Large industrials                                                                                   |
| Existing base       | —          | various  | €7,000      | Services + transport revenue (licensed transport operation + consulting) — **not** software revenue |
| **Total**           | **17 new** |          | **€82,000** | **~€984k ARR** (target)                                                                             |

> Baseline today (`docs/TRACTION_CANONICAL.md` §2): two enterprise pilots contracted Q1/2026 at €29,950 each (€59,900 booked), plus four smaller landed accounts. The €7,000/month line above is services and transport revenue, not platform revenue, and must not be presented as MRR.

### What the math actually is: 17 enterprise sales in 12 months

Be honest about what this table says. Reaching €984k means closing **17 new
contracts** (10 Fleet + 5 CSRD + 2 Bridge) at an average ACV of ~€53k.

That's 1.4 contracts/month. With a B2B compliance sale cycle of 3-6 months,
you need **50+ qualified leads** in the pipeline by month 3 to close 17 by month 12.

**The bottleneck is pipeline, not product.** The outreach CRM exists for this reason.
Fleet is the wedge because it has the shortest sales cycle (1-2 months — the pain
is immediate, the ROI is measurable in the first report).

### Pipeline targets to hit €984k ARR

```
MONTH   PIPELINE   CLOSED   ARR
1-3     50+ leads  3 Fleet  €9k/mo base + €7k existing = €16k/mo
4-6     80+ leads  4 Fleet, 2 CSRD  €34k/mo
7-9     100+ leads 3 Fleet, 2 CSRD, 1 Bridge  €59k/mo
10-12   120+ leads 0 Fleet, 1 CSRD, 1 Bridge  €82k/mo
```

---

## 7. Defensibility

### Moat 1: ERP Connectors

No carbon compliance competitor has Nordic ERP connectors:

- **Visma** — 1M+ Nordic customers, market leader
- **Jeeves** — Swedish mid-market manufacturing
- **Monitor** — Nordic manufacturing standard
- Plus SAP, IFS, Dynamics for enterprise

Persefoni, Greenly, Sweep = zero ERP connectors of any kind.

### Moat 2: Operations Compliance Position

One Click LCA answers: "What will this building emit?" (design)
DWS IQ answers: "What did this company actually emit?" (operations)

These are different questions, different buyers, different data sources, different cadence.
Design LCA is a one-time project. Operations compliance is a recurring subscription.
Recurring beats one-time for SaaS economics.

### Moat 3: Integration Position

By importing One Click LCA outputs as baseline evidence, DWS IQ becomes the
**workflow layer on top of the data layer.** The integration is mutually beneficial:
we reduce their churn (customers keep their LCA subscription to feed our compliance
pipeline) and they extend their platform into operations without building it themselves.

The more LCA tools we integrate with, the stickier we become. We don't need our own
LCA database. We need to be the place where all the data converges into a compliance report.

### Moat 4: Finland First-Mover

Finland implements EU directives before most member states.
Finnish companies need CSRD tooling first.
Build here, prove here, expand to EU-27 with Finnish reference customers.

---

## 8. The One-Liner (Final)

**For investors:**

> "DWS IQ is the operations compliance layer that sits between ERP systems
> and EU regulators. We pull data from SAP/IFS/Dynamics, integrate with
> LCA tools like One Click LCA, and auto-generate CSRD/ETS/CBAM reports.
> Two enterprise pilots contracted Q1/2026 at €29,950 each — €59,900 booked — plus four smaller landed accounts."

**For buyers:**

> "Connect your ERP. Import your building assessments.
> Get audit-ready compliance reports every quarter, automatically."

**For partners (One Click LCA, Rakennustieto):**

> "We take your design-phase data and turn it into ongoing operations compliance.
> Your output is our input. We grow each other's value."

---

## 9. Immediate Next Steps

| Priority | Action                                                  | Timeline   |
| -------- | ------------------------------------------------------- | ---------- |
| 1        | Wire IFS Cloud connector to Supabase (make it real)     | This week  |
| 2        | Build One Click LCA import (CSV/API)                    | Next week  |
| 3        | Update /buy page with operations compliance positioning | Next week  |
| 4        | Contact One Click LCA for partnership conversation      | This month |
| 5        | Build CSRD report template in Report Engine             | This month |
| 6        | First real ERP-connected demo with IFS sandbox          | End of Feb |

---

**Document Version:** 2.0
**Created:** February 7, 2026
**Last Updated:** February 8, 2026
**Status:** ACCEPTED DIRECTION - Operations compliance layer positioning
**Decision Owner:** Risto Anton Paarni
