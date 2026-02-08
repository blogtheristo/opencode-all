# DWS IQ 6 - Pivot Strategy: Follow The Revenue

**Date:** February 7, 2026
**Author:** Risto Anton Paarni
**Status:** PROPOSAL - For founder review and decision

---

## Executive Summary

DWS IQ has €84k ARR from 3 paying customers in logistics and healthcare.
Zero revenue from construction, despite the entire platform being built for construction.

This document proposes refocusing the product around what customers actually buy:
**automated compliance reporting that saves 40+ hours/month.**

---

## 1. The Problem: Building vs. Selling

### What We Built For

| Investment | Details |
|-----------|---------|
| 4 domains | dws6.com, dws10.com, onelifetime.world, lifetime.fi |
| 14 dashboard variants | v8, v9, v10, mobile, enterprise, store, watsonx, etc. |
| 137 landing pages | 12 industry verticals, product pages, compliance pages |
| 8 product lines | Report, Automation, DMS, Omnichannel, Fleet, Studios, Consulting, Agent Foundry |
| 5 AI agents | SiteSense, ScheduleGenius, MaterialOracle, CustomerSat, Viability |
| 6 ERP connectors | SAP, IFS, Dynamics, Visma, Jeeves, Monitor |
| 9 Python services | Report engine, automation, DMS, MCP hub, etc. |

**Target vertical:** Construction & infrastructure

### What Actually Sells

| Customer | Vertical | Annual Value | What They Buy |
|----------|----------|-------------|---------------|
| Uber Finland | Logistics | €70,000 | Fleet emissions reporting |
| Bolt Finland | Logistics | €60,000 | Fleet emissions reporting |
| Kela | Healthcare | €90,000 | Compliance automation |
| Construction A | Construction | €0 | Piloting (not converting) |
| Construction B | Construction | €0 | Piloting (not converting) |

**100% of revenue = logistics + healthcare compliance automation.**
**0% of revenue = construction.**

### The Competitor We Can't Beat

One Click LCA (Helsinki):
- €21.8M annual revenue
- 200+ employees
- $43.8M raised
- 250,000+ LCA datasets
- 170+ countries
- 20+ BIM integrations
- Clients: Siemens Energy, P&G, J&J, AECOM, WSP

We cannot out-build One Click LCA on construction LCA with a solo founder vs. 200+ people.
They have a 23-year head start from the same city.

---

## 2. Where The Market Actually Is

### Carbon Accounting SaaS Market (2025-2032)

| Segment | 2025 | 2032 | CAGR |
|---------|------|------|------|
| Carbon accounting software | $18.5B | $100.8B | 23.9% |
| ESG software | $4.1B | $10.3B | 16.6% |
| Sustainability platforms | $1.3B | $4.2B | 23% |

Source: Fortune Business Insights, Mordor Intelligence, IoT Analytics

### Competitor Landscape

| Company | Focus | Revenue | Raised | Gap We Can Fill |
|---------|-------|---------|--------|-----------------|
| Watershed | Enterprise emissions | Undisclosed | $225M | Too expensive for mid-market |
| Persefoni | Carbon accounting | $4.3M | $194M | No ERP integration, manual data |
| Sweep | Carbon management | Undisclosed | $100M | Enterprise-only, complex setup |
| Greenly | SME carbon accounting | €5.88M | $78.6M | No ERP connectors, basic automation |
| One Click LCA | Construction LCA | €21.8M | $43.8M | Construction-only, no fleet/logistics |

### The Gap Nobody Fills

**No competitor pulls compliance data directly from ERP systems.**

- Persefoni: Manual CSV upload
- Greenly: Manual data entry or accounting software sync
- Sweep: Manual + some API integrations
- Watershed: Enterprise integrations but $100k+ pricing

**We have 6 ERP connectors that pull data from source.** SAP, IFS, Dynamics 365, Visma, Jeeves, Monitor.
That's a real moat, especially for the Nordic/EU mid-market where these ERPs dominate.

---

## 3. The Pivot: Three Products, One Value Prop

### Value Proposition (One Sentence)

> "We connect to your ERP and automatically generate your compliance reports.
> Your team saves 40 hours per month. Setup takes 4 weeks."

### Product 1: Fleet Carbon Report

**The proven winner.** This is what Uber, Bolt, and Kela already pay for.

| Attribute | Detail |
|-----------|--------|
| What | Automated Scope 1-2-3 emissions reporting for fleet/logistics operators |
| Buyer | Fleet managers, logistics CFOs, sustainability directors |
| Price | €3,000/mo (€36k/year) |
| TAM | ~50,000 EU fleet operators under CSRD / Fit for 55 |
| Why it sells | Already selling. 100% retention. 40+ hours/month saved. |
| Existing code | Report Engine, SAP connector, Automation service, email delivery |

**Go-to-market:** Expand from Uber/Bolt reference cases to Nordic logistics companies.
Taxi Helsinki, PostNord, DB Schenker Nordics, Wolt, Bring.

### Product 2: CSRD Autopilot

**The expansion play.** 49,000 EU companies must file CSRD for the first time in 2025-2026.

| Attribute | Detail |
|-----------|--------|
| What | Automated CSRD double materiality assessment + data collection + report generation |
| Buyer | Mid-market companies (250-5000 employees) newly obligated under CSRD |
| Price | €5,000/mo (€60k/year) |
| TAM | 49,000 companies * 10% addressable = 4,900 * €60k = €294M |
| Why it sells | Mandatory. No tooling. Greenly starts at €5k/year but doesn't automate data collection. |
| Existing code | ERP connectors, Viability agent, Report Engine |

**Go-to-market:** Finnish mid-market first (early CSRD adopters), then Nordics, then DACH.
Partner with accounting firms (BDO, Grant Thornton, KPMG Finland).

### Product 3: Compliance Bridge (Enterprise)

**The upsell.** ERP-to-compliance pipeline for large industrials.

| Attribute | Detail |
|-----------|--------|
| What | Connect SAP/IFS/Dynamics, auto-generate CSRD + ETS + CBAM reports |
| Buyer | Enterprise sustainability directors at manufacturing/industrial companies |
| Price | €10,000/mo (€120k/year) |
| TAM | ~5,000 large EU industrials * €120k = €600M |
| Why it sells | Persefoni charges $55-250k/year. Our edge: ERP integration, they require manual upload. |
| Existing code | All 6 ERP connectors, approval gates, scheduling, webhook middleware |
| Nordic ERP moat | Only platform with Visma + Jeeves + Monitor connectors (Nordic market leaders) |

**Go-to-market:** Target NCC, YIT, Skanska Nordics, Wärtsilä, Kone, Outokumpu.
Lead with the SAP connector for large enterprises, Nordic ERPs for mid-market.

---

## 4. What To Kill

### Products / Features To Cut

| Cut | Reason | Code Impact |
|-----|--------|-------------|
| Construction vertical focus | €0 revenue. One Click LCA owns it. | Keep code, deprioritize marketing |
| Mobile app (store submission) | Web PMF not proven. TestFlight for demos. | Freeze, don't delete |
| Lifetime Studios | No code, no revenue. Brand confusion. | Remove from landing pages |
| Lifetime Consulting | No code, no revenue. Brand confusion. | Remove from landing pages |
| Lifetime World Coin / LTWCash | Distraction from core business. | Remove references |
| Lifetime Agent Foundry | Brand concept, no product. | Remove from nav menus |
| 11 of 14 dashboards | Cognitive overhead. Keep v10-react only. | Archive, don't delete |
| 3 of 4 domains | Pick dws10.com (matches DWS IQ branding). | Redirect others |

### AI Agents To Repurpose

| Agent | Current Focus | Pivot |
|-------|--------------|-------|
| SiteSense | Construction sites | Repurpose for fleet depot monitoring |
| ScheduleGenius | Construction timelines | Repurpose for delivery route optimization |
| MaterialOracle | Building materials (EN 15978) | Repurpose for supply chain emissions |
| CustomerSat | Generic (keep as-is) | Rename to "Account Health" |
| Viability | Generic (keep as-is) | Keep for ROI calculations |

### Domains

| Domain | Decision | Reason |
|--------|----------|--------|
| dws10.com | **KEEP** (primary) | Matches DWS IQ branding, already has store |
| onelifetime.world | Redirect to dws10.com/about | Blog can move to dws10.com/blog |
| dws6.com | Redirect to dws10.com | Legacy, confusing numbering |
| lifetime.fi | Keep for Finnish market | Finnish-language compliance sales |

---

## 5. Revenue Model

### 12-Month Target (Feb 2026 - Feb 2027)

| Product | New Customers | Price/mo | Added MRR | Source |
|---------|--------------|----------|-----------|--------|
| Fleet Carbon Report | 10 | €3,000 | €30,000 | Nordic logistics |
| CSRD Autopilot | 5 | €5,000 | €25,000 | Finnish/Nordic mid-market |
| Compliance Bridge | 2 | €10,000 | €20,000 | Large industrials |
| **Existing customers** | 3 | various | €7,000 | Uber, Bolt, Kela |
| **Total MRR** | **20** | | **€82,000** | |
| **Total ARR** | | | **~€984,000** | |

### Unit Economics

| Metric | Fleet Carbon | CSRD Autopilot | Compliance Bridge |
|--------|-------------|----------------|-------------------|
| ACV | €36,000 | €60,000 | €120,000 |
| Setup time | 2-4 weeks | 4-6 weeks | 6-8 weeks |
| Gross margin | ~85% | ~80% | ~75% |
| Payback (CAC) | 2-3 months | 3-4 months | 4-6 months |
| LTV (3yr, 0% churn) | €108,000 | €180,000 | €360,000 |

### Blended ACV: €55,000

At 20 customers = ~€1.1M ARR. That's a Series A story.

---

## 6. What Makes This Defensible

### Moat 1: ERP Connectors (Technical)

No carbon accounting competitor has all 6 Nordic ERPs:
- SAP S/4HANA (enterprise)
- IFS Cloud (asset-intensive)
- Microsoft Dynamics 365 (mid-market)
- **Visma** (Nordic market leader, 1M+ customers)
- **Jeeves** (Swedish mid-market)
- **Monitor ERP** (Nordic manufacturing)

Visma, Jeeves, and Monitor are Nordic-specific. Persefoni, Greenly, and Sweep don't touch them.
This is a real wedge into the Nordic mid-market.

### Moat 2: Regulatory Speed (Market)

Finland implements EU directives faster than most member states.
Finnish companies are the first to need CSRD tooling.
Being Finnish = first-mover advantage in mandatory compliance.

### Moat 3: Automation Depth (Product)

Competitors: Upload a CSV, get a report.
DWS IQ: Connect your ERP, reports generate automatically every month.

The difference is 40 hours/month of manual work eliminated. That's the retention driver (100%).

---

## 7. Implementation: What Changes In The Codebase

### Week 1-2: Consolidation

| Task | Hours | Impact |
|------|-------|--------|
| Consolidate to v10-react dashboard only | 8h | Single frontend to maintain |
| Add fleet-specific dashboard views (routes, fuel, emissions) | 12h | Product 1 differentiation |
| Repurpose SiteSense for depot/fleet monitoring | 4h | Agent reuse |
| Repurpose MaterialOracle for supply chain emissions | 4h | Agent reuse |
| Update landing pages: logistics/compliance focus | 8h | Go-to-market alignment |

### Week 3-4: Product Packaging

| Task | Hours | Impact |
|------|-------|--------|
| CSRD report template in Report Engine | 12h | Product 2 core |
| Automated monthly report generation (cron) | 6h | Automation value prop |
| Customer onboarding flow (dashboard wizard) | 8h | Reduce setup time |
| ERP connection wizard (guided setup) | 8h | Self-service where possible |

### Week 5-6: Go-to-Market

| Task | Hours | Impact |
|------|-------|--------|
| Case study page: Uber/Bolt fleet compliance | 4h | Social proof |
| ROI calculator landing page | 4h | Lead generation |
| Pricing page (3 tiers) | 4h | Conversion |
| Demo environment with sample fleet data | 6h | Sales enablement |

---

## 8. Decision Framework

### If This Pivot Is Accepted

1. **Freeze** construction-specific development
2. **Archive** (don't delete) unused dashboard variants
3. **Redirect** domains to dws10.com
4. **Update** investor materials with logistics/compliance focus
5. **Repurpose** AI agents for fleet/compliance use cases
6. **Build** fleet-specific dashboard views and CSRD templates

### If This Pivot Is Rejected

The alternative is to continue the current path:
- Continue building for construction with €0 construction revenue
- Compete with One Click LCA (€21.8M, 200+ people, same city)
- Maintain 4 domains, 14 dashboards, 8 product lines
- Hope construction pilots convert

This is a valid choice if there's strong conviction that construction will convert.
But the data doesn't support that conviction yet.

### The Middle Path

Keep construction as a future vertical but stop investing in it NOW:
1. Focus engineering on logistics/fleet (proven revenue)
2. Keep construction code frozen (don't delete)
3. Return to construction when ARR hits €500k+ from logistics
4. By then, you'll have revenue, team, and credibility to compete

---

## 9. Metrics To Track

### Leading Indicators (Monthly)

| Metric | Target | Why |
|--------|--------|-----|
| Qualified leads (logistics) | 5/month | Pipeline health |
| Demo requests | 10/month | Market interest |
| ERP connections deployed | 2/month | Product stickiness |
| Reports auto-generated | 50/month | Usage = retention |

### Lagging Indicators (Quarterly)

| Metric | Q1 Target | Q2 Target | Q3 Target | Q4 Target |
|--------|-----------|-----------|-----------|-----------|
| MRR | €15k | €30k | €55k | €82k |
| Customers | 5 | 10 | 15 | 20 |
| Churn | 0% | 0% | <5% | <5% |
| NRR | 100% | 110% | 115% | 120% |

---

## 10. The One-Liner Test

Every product needs to pass the "one-liner test" — can a non-technical buyer understand
what you sell in one sentence?

**Before:**
> "DWS IQ 6 is an enterprise-grade industrial climate intelligence and compliance platform
> for EU-regulated industries with a Brain-Memory-Body-Hands multi-agent AI ecosystem."

**After:**
> "We connect to your ERP and automatically generate your compliance reports.
> 40 hours saved per month. Setup in 4 weeks."

The first one sounds impressive at a tech conference.
The second one gets a CFO to say "yes."

---

**Document Version:** 1.0
**Created:** February 7, 2026
**Decision Required By:** February 14, 2026 (before Week 7 sprint begins)
**Decision Owner:** Risto Anton Paarni
