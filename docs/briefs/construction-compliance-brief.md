# CSRD + EPBD + Fit for 55: Compliance Architecture for Nordic Construction Groups

***

## VERSION AND AGENT HISTORY

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Date | 2026-04-02 |
| Author | Lifetime Oy |
| Owner | risto-001 |
| Status | Draft |
| Classification | Confidential — Gated Content (Free Account Required) |
| Introduced-In | PR-TBD |
| Branch | claude/quirky-shockley |

***

## 1. The Multi-Jurisdiction Data Problem

Nordic construction groups operating across Norway, Denmark, and Finland face a convergence of three EU regulatory frameworks — each requiring overlapping but differently structured emissions data from the same project portfolio.

### Regulatory Overlap

| Framework | What It Requires | Scope | Deadline |
|-----------|-----------------|-------|----------|
| **CSRD** (Directive 2022/2464) | ESRS E1 disclosures: Scope 1/2/3 by entity, double materiality assessment | Corporate-level, all large companies | Reporting year 2025 for large PIEs; 2026 for other large companies |
| **EPBD Recast** (Directive 2024/1275) | Whole-life carbon assessment per building, embodied carbon for new buildings >1,000 m² | Building-level | Embodied carbon reporting from 2028; whole-life carbon from 2030 |
| **Fit for 55 / ETS2** (Directive 2023/959) | Buildings sector under ETS2, carbon price exposure for cement, steel, aluminium | Sector-level, material procurement | ETS2 starts 2027; full implementation 2028 |

### The Convergence Problem

All three frameworks pull from the same project data but require different aggregations:

- **ESRS E1** wants Scope 1/2/3 emissions by legal entity across all projects
- **EPBD** wants whole-life carbon per individual building (EN 15978 stages A1-D)
- **EU Taxonomy** wants CapEx/OpEx alignment percentages per activity

A construction group managing 50+ active projects across 3 Nordic jurisdictions cannot produce these outputs from separate Excel workbooks. The data layer must be unified.

### Jurisdiction-Specific Implementations

| Country | National Standard | LCA Method | ERP Landscape |
|---------|------------------|------------|---------------|
| Norway | NS 3720:2018 | TEK17 + NS 3031 | Visma, Unit4 |
| Denmark | BR18 LCA (from 2023) | DS/EN 15978 + BR18 Annex 2 | Visma, Microsoft Dynamics |
| Finland | YM decree 2025 (embodied carbon) | EN 15978 + One Click LCA | Visma, IFS Cloud |

One data pipeline. Three jurisdiction-specific outputs.

***

## 2. The Data Layer: EN 15978 as Canonical Model

EN 15978:2011 provides the lifecycle assessment framework that satisfies all three regulatory outputs simultaneously. Every material quantity, energy use, and transport distance recorded once — allocated to ESRS, EPBD, and EU Taxonomy outputs downstream.

### Lifecycle Stages

| Stage | Description | Data Source |
|-------|-------------|-------------|
| **A1-A3** | Raw material supply, transport, manufacturing | Supplier EPDs (EN 15804+A2), CO2data.fi, Bauteileditor |
| **A4** | Transport to site | ERP logistics data, distance calculations |
| **A5** | Construction/installation | Site fuel consumption, waste records |
| **B1-B7** | Use phase (maintenance, repair, replacement, energy) | Building energy model, maintenance schedules |
| **C1-C4** | End-of-life (demolition, transport, waste processing, disposal) | National waste statistics, scenario modelling |
| **D** | Reuse/recovery/recycling potential | Material reuse rates, circular economy data |

### Required Data Points Per Project

**From ERP (Visma/IFS):**
- Project cost breakdowns by material category (concrete, steel, timber, insulation)
- Procurement records with supplier identification
- Site energy consumption (diesel, electricity kWh)
- Transport logs (material deliveries, distances)
- Waste disposal records and destinations

**From BIM/IFC (Tekla Structures, Revit):**
- Material quantities by element (m3 concrete, tonnes steel, m2 insulation)
- Building areas (gross, net, heated)
- Element specifications (concrete strength class, steel grade)

**From Supplier EPDs (EN 15804+A2):**
- Global Warming Potential per declared unit (kgCO2e/unit)
- EPD validity period and programme operator
- Transport scenario assumptions

### Emission Factor Sources

| Data Type | Source | Reference |
|-----------|--------|-----------|
| Generic emission factors | EU ETS Benchmarks (Reg. 2021/447) | Cement clinker: 0.766 tCO2/t (2021-2025 benchmark) |
| Country grid electricity | EEA GHG Inventory 2024 | NO: 0.008 kgCO2/kWh, DK: 0.149 kgCO2/kWh, FI: 0.072 kgCO2/kWh |
| Concrete emission factors | CO2data.fi, EPD Norge, Dansk Beton | C30/37 ready-mix: ~280 kgCO2e/m3 (Nordic average) |
| Steel structural | EPD data, CBAM default values (Reg. 2023/1773) | Hot-rolled section: ~1.91 tCO2e/t (EU average) |

***

## 3. ERP Integration Architecture

### Data Flow

```
Visma/IFS (NO/DK/FI)
    |
    v
DWS IQ API (REST, JSON)
    |
    +---> MaterialOracle Agent
    |         |
    |         +---> EN 15978 Calculation Engine
    |         |         |
    |         |         +---> EPD Database Lookup
    |         |         +---> Emission Factor Matching
    |         |         +---> Lifecycle Stage Allocation
    |         |
    |         v
    |     Unified Carbon Dataset
    |         |
    |         +---> ESRS E1 Output (corporate-level, by entity)
    |         +---> EPBD Output (per-building, whole-life carbon)
    |         +---> EU Taxonomy Output (CapEx/OpEx alignment %)
    |
    +---> Dashboard (real-time project carbon tracking)
    +---> Firehorse Report Module (signed PDF reports)
```

### Connector Specifications

**Visma Business/Net Suite:**
- REST API v2 (OAuth 2.0)
- Endpoints: `/projects`, `/invoices`, `/costcenters`
- Mapping: Cost center → Material category → Emission factor
- Sync frequency: Daily batch (03:00 UTC) + on-demand

**IFS Cloud:**
- REST API (IFS Connect)
- Endpoints: `/ProjectCost`, `/PurchaseOrder`, `/WorkOrder`
- Mapping: Work order materials → BIM element quantities → EN 15978 stages
- Sync frequency: Real-time webhook on work order completion

### Key Principle

One data ingestion from ERP. Multiple regulatory outputs. No duplicate data entry across CSRD, EPBD, and EU Taxonomy reporting.

***

## 4. Pilot Program: 4 Weeks to First Multi-Jurisdiction Report

### Week 1 — Data Audit + Connector Setup

- Inventory existing data sources across NO/DK/FI ERP instances
- Configure Visma/IFS API connectors (read-only access)
- Map project cost categories to EN 15978 material categories
- Identify data gaps (missing EPDs, unmatched materials)

### Week 2 — Historical Baseline

- Select 1 reference project per country (recently completed, good data)
- Run EN 15978 calculation on historical data
- Produce baseline carbon footprint per project
- Validate against any existing LCA reports (One Click LCA, manual calculations)

### Week 3 — Live Monitoring

- Connect live project data feeds
- Dashboard access for sustainability team
- Automated alerts at 90% carbon budget threshold
- Real-time Scope 1/2/3 tracking across all active projects

### Week 4 — First Compliant Report

- Generate ESRS E1 disclosure draft (multi-entity, NO/DK/FI)
- Generate EPBD-ready building carbon assessment for reference projects
- EU Taxonomy alignment calculation (CapEx/OpEx)
- Team training session (2 hours)
- Handover: ongoing monitoring + quarterly report generation

### Investment

| Package | Price | Scope |
|---------|-------|-------|
| **Enterprise Navigator** (Pilot, 4 weeks) | EUR 24,900 | 1 country, 3 reference projects, full ERP connector setup. Deliverables: ESRS E1 draft, EPBD-ready assessment, EU Taxonomy calculation, team training. |
| **Enterprise Premium** (Annual) | EUR 49,900/year | All 3 jurisdictions (NO/DK/FI), unlimited projects, real-time dashboard, quarterly reports, dedicated support. |
| **Enterprise Nordic** (Full deployment) | EUR 89,900/year | Custom SLA, private cloud option, dedicated integration engineer. |

### Contact

Risto Paarni, CEO
Lifetime Oy
risto@lifetime.fi

***

## Document Footer

| Field | Value |
|-------|-------|
| Document | CSRD + EPBD + Fit for 55: Compliance Architecture for Nordic Construction Groups |
| Version | 1.0 |
| Date | 2026-04-02 |
| Publisher | Lifetime Oy |
| Classification | Confidential — Gated Content |
| Copyright | Lifetime Oy 2026. All rights reserved. |
