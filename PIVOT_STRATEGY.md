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

| Country | Design-phase data | Design-phase LCA | Operations compliance |
|---------|-------------------|-------------------|-----------------------|
| Finland | Rakennustieto EPDs, CO2data.fi | One Click LCA | **Gap** |
| Sweden | Boverket, IVL EPDs | One Click LCA | **Gap** |
| Germany | ÖKOBAUDAT | One Click LCA | **Gap** |
| France | INIES | One Click LCA | **Gap** |
| Netherlands | NMD (Nationale Milieudatabase) | One Click LCA | **Gap** |
| Denmark | EPD Denmark | One Click LCA | **Gap** |
| Norway | EPD Norway | One Click LCA | **Gap** |
| All 27 | Each has national EPD databases | Consolidated by One Click LCA | **Every country has the same gap** |

Every country has mature design-phase tools. No country has automated operations compliance.
49,000 EU companies need CSRD filing. They've designed low-carbon buildings.
Now they need to prove they're operating them compliantly.

---

## 2. Positioning: Complete The Chain, Don't Compete With It

### The Positioning Statement

> **DWS IQ is the operations compliance layer for construction portfolios and industrial
> companies: it pulls ERP and project data, keeps CSRD/ETS/CBAM evidence continuously
> audit-ready, and monitors performance over time. We integrate with LCA tools
> (including One Click LCA) instead of competing with them.**

### What This Means In Practice

| LCA tools tell you... | DWS IQ tells the regulator... |
|------------------------|-------------------------------|
| What the building SHOULD emit (design) | What it ACTUALLY emits (operations) |
| Material carbon at construction (A1-A5) | Operational carbon over time (B1-B7) |
| One-time assessment at design | Continuous quarterly reporting |
| Architect/engineer is the user | CFO/sustainability director is the user |
| Manual, project-by-project | Automated, portfolio-wide |
| Data from BIM models | Data from ERP systems |

### The Concrete Integration Claim (For /buy Page)

> "Import One Click LCA building assessments and CO2data.fi emission factors.
> Connect to your ERP (SAP, IFS, Dynamics, Visma, Jeeves, Monitor).
> DWS IQ maps design-phase baselines to operational evidence,
> and auto-generates CSRD/ETS/CBAM reports every quarter."

This makes DWS IQ a **buyer** of One Click LCA outputs, not a competitor.
One Click LCA becomes a data source, like an ERP is a data source.

---

## 3. Connector Readiness: Where We Start

### ERP Connector Audit (Honest Assessment)

| Connector | Lines | Real API Paths | Auth | Data Mapping | Production Ready |
|-----------|-------|---------------|------|-------------|-----------------|
| IFS Cloud | 231 | Real IFS projection URLs | OAuth2 | 14-field asset mapping | **Closest** |
| SAP S/4HANA | 107 | Verifiably real OData | Basic + sap-client | None yet | Reads only |
| Dynamics 365 | 112 | Real MS identity URLs | OAuth2 (Azure AD) | None yet | Auth + 1 read |
| Monitor | 551 | Plausible | OAuth2 | Full bidirectional | Unverifiable endpoints |
| Visma | 99 | Plausible | OAuth2 (buggy) | None yet | Maybe 2 calls |
| Jeeves | 86 | Likely fabricated | API key | None yet | Unlikely |

**Shared fatal flaw:** No database persistence. Data is fetched, counted, logged, and discarded.
Every Supabase write is a `// TODO` comment.

### First Integration Target: IFS Cloud

**Why IFS first:**
- Most complete connector (real projection URLs, real OAuth2, actual field mapping)
- IFS dominates asset-intensive industries (construction, manufacturing, energy)
- IFS Cloud is the ERP of choice for NCC, Skanska, and Nordic infrastructure companies
- 5 of 6 sync methods make real HTTP calls

**What needs to happen to make IFS production-ready:**
1. Wire Supabase persistence (replace TODO comments) — 4-6h
2. Test against real IFS Cloud sandbox — 4h
3. Add data transformation for remaining entity types — 4h
4. Add retry/backoff for production reliability — 2h
5. **Total: ~2 days to first real ERP connection**

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

## 4. Three Products, Refined

### Product 1: Fleet Carbon Report (Proven)

| Attribute | Detail |
|-----------|--------|
| What | Automated Scope 1-2-3 emissions reporting for fleet/logistics |
| Buyer | Fleet managers, logistics CFOs |
| Price | €3,000/mo (€36k/year) |
| Why it sells | Already selling. Uber, Bolt, Kela. 100% retention. |
| ERP connector | SAP (transport mgmt) or IFS (asset-intensive) |

### Product 2: CSRD Autopilot (Expansion)

| Attribute | Detail |
|-----------|--------|
| What | ERP-connected CSRD data collection + automated quarterly reports |
| Buyer | Mid-market sustainability directors (250-5000 employees) |
| Price | €5,000/mo (€60k/year) |
| Why it sells | 49,000 EU companies must file. No tool automates data collection from ERP. |
| ERP connector | IFS, Dynamics 365, Visma (Nordic mid-market) |
| LCA integration | Import One Click LCA baselines as CSRD evidence |

### Product 3: Compliance Bridge (Enterprise)

| Attribute | Detail |
|-----------|--------|
| What | Full ERP-to-compliance pipeline: CSRD + ETS + CBAM continuous monitoring |
| Buyer | Enterprise sustainability directors at industrials |
| Price | €10,000/mo (€120k/year) |
| Why it sells | Persefoni = $55-250k/year with manual CSV. We pull from SAP/IFS automatically. |
| ERP connector | SAP S/4HANA primary, IFS Cloud secondary |
| LCA integration | Import One Click LCA + CO2data.fi for design-vs-actual comparison |

---

## 5. What Changes (Revised)

### KEEP (Construction Stays, Reframed)

| Keep | Reframe |
|------|---------|
| Construction vertical | Reframe from "building LCA" to "construction operations compliance" |
| SiteSense agent | Site operational monitoring (not design LCA) |
| ScheduleGenius agent | Project timeline compliance (delivery vs. plan) |
| MaterialOracle agent | Supply chain emissions (procurement, not design material selection) |
| CustomerSat agent | Rename to "Account Health" - works across all verticals |
| Viability agent | ROI/payback - works across all verticals |
| EN 15978 knowledge | Use for operational stages (B1-B7, C, D), not design stages (A1-A5) |
| All 6 ERP connectors | Core moat. Harden IFS first, then SAP, then rest. |

### FREEZE (Don't Delete, Stop Investing)

| Freeze | Why |
|--------|-----|
| Mobile app store submission | Web PMF first. TestFlight for demos. |
| Lifetime Studios / Consulting / Coin | Brand noise. Zero revenue. |
| 11 of 14 dashboard variants | Keep v10-react only. |
| BIM/IFC parser | That's One Click LCA's job. Import their output instead. |
| Building LCA calculations | That's One Click LCA's job. We consume, not produce. |

### CONSOLIDATE

| From | To | Reason |
|------|-----|--------|
| 4 domains | dws10.com (primary) + lifetime.fi (Finnish market) | One brand, one story |
| 14 dashboards | v10-react only | One frontend to maintain |
| 8 product lines | 3 products (Fleet, CSRD, Bridge) | One product catalog |

---

## 6. Revenue Model (12-Month)

| Product | Customers | Price/mo | MRR | Source |
|---------|----------|----------|-----|--------|
| Fleet Carbon Report | 10 | €3,000 | €30,000 | Nordic logistics |
| CSRD Autopilot | 5 | €5,000 | €25,000 | Finnish/Nordic mid-market |
| Compliance Bridge | 2 | €10,000 | €20,000 | Large industrials |
| Existing | 3 | various | €7,000 | Uber, Bolt, Kela |
| **Total** | **20** | | **€82,000** | **~€984k ARR** |

### Path: €84k → €984k ARR in 12 months

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
**workflow layer on top of the data layer.** The more LCA tools we integrate with,
the stickier we become. We don't need our own LCA database. We need to be the
place where all the data converges into a compliance report.

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
> €84k ARR, 100% retention, 3 paying customers, 40 hours/month saved per customer."

**For buyers:**
> "Connect your ERP. Import your building assessments.
> Get audit-ready compliance reports every quarter, automatically."

**For partners (One Click LCA, Rakennustieto):**
> "We take your design-phase data and turn it into ongoing operations compliance.
> Your output is our input. We grow each other's value."

---

## 9. Immediate Next Steps

| Priority | Action | Timeline |
|----------|--------|----------|
| 1 | Wire IFS Cloud connector to Supabase (make it real) | This week |
| 2 | Build One Click LCA import (CSV/API) | Next week |
| 3 | Update /buy page with operations compliance positioning | Next week |
| 4 | Contact One Click LCA for partnership conversation | This month |
| 5 | Build CSRD report template in Report Engine | This month |
| 6 | First real ERP-connected demo with IFS sandbox | End of Feb |

---

**Document Version:** 2.0
**Created:** February 7, 2026
**Last Updated:** February 8, 2026
**Status:** ACCEPTED DIRECTION - Operations compliance layer positioning
**Decision Owner:** Risto Anton Paarni
