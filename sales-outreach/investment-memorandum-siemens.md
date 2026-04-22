<!--
VERSION AND AGENT HISTORY
Document: investment-memorandum-siemens.md
Version: 1.0
Last-Updated: 2026-04-22
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-haiku-4-5-20251001)
Purpose: Investment pitch memorandum for Siemens SI Building Nordics
         targeting Frida Ahlberg and TechSeed Nordics partnership.
Introduced-In: PR-pending (branch claude/fix-startup-funding-pitch-NnXAG)
Code-Version: 1.0
Branch: claude/fix-startup-funding-pitch-NnXAG
Date: 2026-04-22
Owner: risto.paarni@lifetime.fi
Recipient: Frida Ahlberg (Siemens SI Building Nordics)
Context: FY2025 CSRD Wave 2 reporting cycle; EPBD 2024 recast; EU Taxonomy Art. 7.1–7.7
-->

# Investment Memorandum: DWS IQ for Siemens SI Building Nordics

**Prepared for:** Frida Ahlberg, Siemens SI Building Nordics  
**From:** Risto Anton Päärni, Lifetime Oy  
**Date:** April 2026  
**Confidential**

---

## Executive Summary

DWS IQ is the missing operational layer for regulated industry. We turn compliance from manual overhead into infrastructure that lowers risk, cuts cost, and scales across EU, ASEAN, and US jurisdictions.

**For Siemens SI Building Nordics:** the opportunity is not compliance software — it is **less friction across industrial workflows, auditability, and cross-entity control.**

Building X, Desigo CC, and Navigator generate continuous telemetry. Today, that data is operationally useful but regulatory-reporting useless — it takes 4–6 months of manual work to translate sensor data into signed, audit-ready CSRD E1, EPBD 2024, and EU Taxonomy disclosure.

**DWS IQ operationalizes that translation in 90 seconds.** One command; signed output; zero spreadsheets.

**Pilot target:** 3–5 Nordic real-estate portfolios in FY2025 CSRD Wave 2 reporting cycle. **Measurable outcome:** submission-ready CSRD disclosure, EPBD energy-performance certificate, and EU Taxonomy alignment — all with full audit trail and KYA-governed control.

If pilot succeeds, distribution becomes the scaling channel: Siemens Building X → Desigo CC → Navigator → Xcelerator ecosystem.

---

## The Problem

Nordic real-estate is under regulatory convergence pressure:

| Regulation                        | Deadline                            | Scope                                                 | Current Friction                                    |
| --------------------------------- | ----------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| **CSRD Wave 2**                   | FY2025 reporting (due April 2026)   | All entities >250 employees or €50M revenue           | Manual mapping; 4–6 months per portfolio            |
| **EPBD 2024 Recast**              | Effective Jan 2025                  | All buildings >25 m² with EU>energy metering          | Retrofit-passport generation; fragmented tools      |
| **EU Taxonomy Art. 7.1–7.7**      | 2026 annual disclosure              | Real-estate: energy, water, waste, climate resilience | New metric calculation; no standard tools           |
| **EN 15978 Lifecycle Assessment** | 2026–2027 (Fit for 55 acceleration) | Major renovation; new construction                    | Embodied carbon; material tracking; retrofit impact |

**Current state:** Real-estate CFOs, sustainability officers, and operations teams spend €500K–€2M per year per portfolio on:

- Manual data collection from Building X, BMS, smart meters
- Excel-to-regulatory-template mapping
- External consultant reviews (PwC, EY, KPMG)
- Rework due to data gaps or regulatory interpretation changes

**The insight:** Siemens already sells the **data source** (Building X telemetry, Desigo controls). You have the data. The gap is **operationalizing it into regulatory output without leaving your ecosystem.**

---

## The Solution: DWS IQ for Building Operations

DWS IQ operationalizes compliance as a workflow layer inside Siemens' technology stack:

### Aegis — Regulation-to-Control Mapping

Building X sensor data → CSRD E1 disclosure  
Desigo HVAC setpoints → EPBD energy-performance certificate  
Facility maintenance logs → EU Taxonomy alignment metrics  
Material asset ledger → EN 15978 lifecycle carbon footprint

Each mapping is versioned, schema-bound, and audit-logged. No manual translation; no interpretation disputes.

### Sovereign Infra — Jurisdiction-Specific Workflows

- **EU (Finland, Sweden):** CSRD + EPBD 2024 + Taxonomy Art. 7.1–7.7 + EN 15978 (all standard)
- **ASEAN pilots:** Thailand energy disclosure, Singapore sustainability reporting
- **US alignment:** Energy Star / LEED integration (future)

Data never leaves the jurisdiction; all processing on EU-sovereign compute (Scaleway, Aiven, UpCloud, DGX Cloud Frankfurt).

### Connect — Siemens Integration Layer

- **Native connector:** Building X API → DWS IQ pipeline (real-time)
- **Writeback:** KYA-governed control — approved changes (maintenance work orders, renovation triggers, HVAC adjustments) flow back into Desigo CC
- **Audit trail:** Every metric linked to sensor source, calculation rule, regulatory basis, approver

---

## The Pilot: FY2025 CSRD Wave 2

**Start:** One business unit (SI Building Nordics)  
**Target:** 3–5 Nordic real-estate portfolios (mixed residential, commercial, industrial)  
**Success metric:** Signed, submission-ready CSRD disclosure with zero manual spreadsheet work

**Timeline:**

| Phase          | Duration | Outcome                                                                            |
| -------------- | -------- | ---------------------------------------------------------------------------------- |
| **Onboarding** | 2 weeks  | Connect Siemens Building X API; map data schema to CSRD/EPBD/Taxonomy              |
| **Pilot run**  | 4 weeks  | Generate Q4 2025 + FY2025 year-end reports; validate with customer CFO and auditor |
| **Sign-off**   | 1 week   | Regulatory submission ready; audit trail locked                                    |
| **Total**      | 7 weeks  | First portfolio reporting complete                                                 |

**Cost to pilot:** €120K (Siemens + Lifetime Oy joint investment)  
**Revenue from pilot:** €80K (3–5 portfolios × €15K–€25K per portfolio per year, minimum 2-year contract)  
**Payback:** < 8 months

---

## Why Siemens Wins

1. **Stickiness** — Building X becomes a compliance _requirement_, not a nice-to-have data source. Portfolio owners cannot switch to a competitor BMS without losing audit continuity.

2. **Margin expansion** — Compliance layer is a high-margin SaaS/services offering on top of hardware/software already sold. €15K–€25K annual recurring revenue per portfolio; 70%+ gross margin.

3. **Xcelerator extension** — Once the pattern (Building X → compliance automation) is proven, it scales to other Siemens products: NX digital manufacturing → supply-chain compliance; MindSphere sensors → predictive-maintenance audit requirements; Mobility fleet data → EU road-transport regulations.

4. **Partner differentiation** — TechSeed (systems integrator) remains the integration partner; DWS IQ is the compliance layer they resell. Three-party motion (Siemens / TechSeed / DWS IQ) is cleaner than two-party and unlocks sustainable channel margins for all three.

5. **Regulatory moat** — As EU regulations evolve (2026–2028 CSRD scope expansion, EPBD retrofit acceleration, Taxonomy sector-expansion), DWS IQ keeps your offering current without your team rewriting compliance logic every quarter.

---

## Investment Ask

**Series A: €8.5M**

Allocation:

| Workstream                                    | Cost  | Outcome                                                                      |
| --------------------------------------------- | ----- | ---------------------------------------------------------------------------- |
| **Product (DWS IQ v2.0)**                     | €2.8M | 12 Sovereign Infra modules; 8 ERP/BMS connectors; KYA auditability framework |
| **Siemens pilot (go-to-market)**              | €1.2M | 6 customer pilots; sales + delivery team; partner enablement                 |
| **Infrastructure (EU-sovereign compute)**     | €1.5M | DGX Cloud Frankfurt scaling; data residency compliance; geofencing           |
| **Partnerships (TechSeed, NVIDIA, auditors)** | €0.8M | Reseller agreements; NVIDIA NeMo integration; Big 4 auditor partnerships     |
| **Team (engineers, compliance specialists)**  | €2.2M | 12 FTEs; compliance regulatory specialists; Siemens integration engineers    |

**18-month outcome:** 40+ customers, €15M ARR, Series B ready.

---

## Next Steps

1. **30-min call** (week of 28 April) with you and TechSeed (Jacob Bentzel) to map:
   - 3–5 pilot portfolio candidates
   - Building X API access and data schema
   - Siemens internal regulatory approval process

2. **Data readiness assessment** (1 week post-call):
   - Confirm Building X data quality and completeness
   - Identify any missing data fields (e.g., material asset ledger for Taxonomy Art. 7.3)
   - Agree on data-export SLA

3. **Pilot contract** (2 weeks):
   - Joint investment terms
   - IP and disclosure agreements
   - Revenue-share model for future customers

4. **Kickoff** (week 1):
   - API integration
   - Regulatory schema mapping
   - Customer communication

---

## Contact

**Risto Anton Päärni**  
Founder & CEO, Lifetime Oy  
Email: risto.paarni@lifetime.fi  
Phone: +358 50 123 4567

---

**Confidential — Prepared for Frida Ahlberg (Siemens SI Building Nordics)**  
**Not for distribution without written permission from Lifetime Oy.**
