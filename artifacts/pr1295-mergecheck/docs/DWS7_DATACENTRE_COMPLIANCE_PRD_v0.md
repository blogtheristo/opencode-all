# DWS IQ 7 Datacentre Compliance Agent — PRD v0 (1-page hypothesis)

---

# VERSION AND AGENT HISTORY

Version: 0.2

Sessions & Modifications:

- Version: 0.2 | Tool: Claude Code (Opus 4.7) | Session: claude/green-energy-roadmap-pEPPK | Date: 18.04.2026 | Changes: Confirmed GTM after buyer audit — Operations Manager as v0 ICP (budget owner, pain owner); added consultant channel as partner tier; added verbatim validation question to design-partner call script; rejected energy-intelligence positioning flip for v0 (kept for v1 upmarket).
- Version: 0.1 | Tool: Claude Code (Opus 4.7) | Session: claude/green-energy-roadmap-pEPPK | Date: 18.04.2026 | Changes: Initial 1-page product hypothesis per /plan-ceo-review RESHAPE verdict — frames datacentre EED 2024/1364 compliance as IQ 7 first vertical; defines ICP, wedge, MVP, pricing, open questions. Not a build commitment.

Session Links & References:

- Claude Code (claude/green-energy-roadmap-pEPPK): https://github.com/blogtheristo/dws6/commits/claude/green-energy-roadmap-pEPPK
- CEO review: /plan-ceo-review verdict RESHAPE (this session)
- Research input: docs/DWS7_HYDROGEN_SELVITYS.md
- Research input: docs/field-notes/2026-04-18-eu-green-hydrogen-additionality-finland-datacentres.md
- Parked: docs/DWS7_GREEN_ENERGY_ROADMAP.md

Document Status:

- Created: 18.04.2026
- Last Modified: 18.04.2026
- Language: English
- Publication Status: INTERNAL — PRD draft, NOT for public sites
- Build status: **HYPOTHESIS** — no engineering started, pending design-partner validation

---

## One-liner

**A DWS IQ 7 agent that turns any EU datacentre's BMS/PDU telemetry into a signed, Article-12-auditable EED 2024/1364 Annex I+II submission to the European database — with hydrogen and electrification readiness scored against the next Delegated Act.**

## Customer (ICP for v0)

Nordic **colocation** operator, **500 kW – 5 MW** IT load, 1–3 sites, no dedicated DCIM vendor, reporting manually via spreadsheet. Target geographies: FI, SE. Why: Nordic grid already green → they want to prove it, not just report it. Secondary: enterprise datacentres of Finnish industrials (Kesko, UPM, Metso) with private IT.

## Buyer & Sales Motion

**Primary buyer = Operations / Facility Manager.** At the ICP size (500 kW – 5 MW, 1–3 sites) no dedicated Sustainability/ESG role exists. The Ops Manager owns power, cooling, PUE, **and** the EED 2024/1364 reporting obligation because it sits in the facility-data job. They own the Ops budget line that currently pays for the spreadsheet work. €1,500/month/site is trivial against the consultant/spreadsheet hours they already spend.

**Pitch framing to Ops:** "Stop rebuilding the 15 May report. Signed, auditable output your board and Energimyndigheten accept. Next Delegated Act scored automatically so you're not surprised."

**Channel = external compliance consultants.** Boutique firms that currently run the 24-KPI spreadsheet as a service for 10–20 operators each. They are not buyers — they are a scaling channel. A "Partner Tier" with white-label output reaches 10–20 operators per relationship, faster than cold outreach. Priority partner-recruit after v0 validates.

**CRM segmentation:**

- **Primary v0:** `role=Operations Manager OR Facility Manager`, `company_type=colocation`, `geo=FI/SE`, `site_count≤3`, `IT_MW=0.5–5`
- **Partner tier:** `partner_type=compliance_consultant`, `served_operators≥5`
- **Parked (v1+):** `role=Head of Sustainability`, `company_type=enterprise_private_dc OR multi_site_colo`, `IT_MW>5` — different motion, different ACV (€30–60K/year), separate segment

**Positioning flip — rejected for v0.** Leading with "datacentre energy intelligence" widens the tent to CFO + Sustainability Director, but that audience does not exist at the v0 ICP. Flip is reserved for v1 when we move upmarket. v0 stays compliance-first because the 15 May deadline is the urgency driver.

## Problem

1. **Mandatory.** Commission Delegated Regulation (EU) 2024/1364 — in force 6 June 2024 — requires every EU datacentre ≥500 kW IT load to submit 24 KPIs to the European database. First deadline 15 Sep 2024. Annual cycle 15 May thereafter. Next cycle: 15 May 2027.
2. **24 KPIs across 3 blocks** (energy/sustainability, ICT, data traffic). Annex III defines calculated sustainability indicators. Annex IV defines public aggregation.
3. **Incumbents (Nlyte, RiT/XpedITe)** are DCIM vendors bolting compliance on top. Expensive, slow to configure, not EU-sovereign, no signed reasoning lineage.
4. **Penalties** are member-state-defined. Ireland already flags non-compliance publicly. Sweden's Energimyndigheten runs a national reporting scheme. This gets enforced.

## Wedge (v0 MVP)

**One colo site, one reporting cycle.** Ingest 1 year of BMS/PDU CSV exports → generate signed PDF report matching Annex I+II structure → emit European-database-ready JSON payload. Nothing else. No dashboard, no multi-site, no real-time monitoring.

**Success = 1 design partner submits their 15 May 2027 report using our output.**

## MVP Scope

**In (v0.1):**

- CSV ingestion from 5 common BMS vendors (Schneider EcoStruxure, Vertiv, ABB, Siemens, Honeywell)
- KPI calculation per Annex I (data collection) + Annex II (methodology)
- Signed PDF output (Article-12-style reasoning lineage)
- European-database JSON schema (Annex to 2024/1364)
- Hydrogen/electrification readiness score — 1 page appendix scoring the site against likely next Delegated Act dimensions (storage, back-up fuel, PPA additionality)

**Out (NOT v0.1):**

- Real-time telemetry, dashboards, multi-site, alerts
- Submission automation to the European database (manual upload in v0)
- CSRD/ESRS disclosure (separate IQ 6 agent)
- Building anything, owning anything, operating anything (green roadmap parked)

## Price Hypothesis

**€1,500 / month / site** — annual contract, €18K ARR per site. Compares to Nlyte enterprise tiers (~€50K+/year) and manual consultant (~€15–25K per report cycle). Needs 1 validation call to confirm.

## Competitive Positioning

| Vendor       | Model                      | DWS differentiator                               |
| ------------ | -------------------------- | ------------------------------------------------ |
| Nlyte        | DCIM + compliance module   | Compliance-first, signed lineage, EU-sovereign   |
| RiT XpedITe  | CSRD+EED combined platform | Agent-native MCP, per-site pricing, no DCIM lock |
| Spreadsheets | Free but painful           | Automation, audit trail, signature               |
| Consultants  | €15–25K/report             | Recurring SaaS, repeatable, faster               |

## Market Size

- EU datacentre installed base: **23.93 GW (2025) → 54.71 GW (2030)**, CAGR 17.98% (Mordor Intelligence 2025)
- EUDCA forecasts **€176B** investment 2026–2031
- Grid readiness is the constraint, not capital — compliance overhead therefore compounds
- Addressable sites ≥500 kW: rough order-of-magnitude ~3,000+ in EU (to be validated)
- If 1% penetration at €18K ARR → **€540K ARR.** If 5% → **€2.7M ARR.** Software-margin territory.

## Open Questions (Must Answer Before Build)

1. Can we get **3 design-partner letters** from Nordic colo operators by **1 October 2026**? If no → park vertical.
2. Does the European database accept third-party-generated JSON submissions, or does the operator always submit themselves? (Technical call to Commission DG ENER needed.)
3. What does Energimyndigheten (SE) require beyond EU baseline? National schemes may be our wedge.
4. Is signed Article-12 reasoning a _valued_ feature for datacentre buyers, or nice-to-have? (Validation calls.)
5. Build vs. partner: does Nlyte/RiT have an integration seam, or is this head-to-head?

## Design-Partner Call Script (Verbatim)

Every one of the 3 design-partner calls **must** ask this question, word-for-word, and log the answer in the CRM:

> **"Who in your org currently owns the 15 May EED submission — and do they have a separate budget line for it, or does it come out of Ops?"**

The answer decides whether €1,500/month/site is a trivial Ops line-item (1-call close, Ops-Manager-authorised) or a procurement cycle (multi-stakeholder, longer sales motion, possibly re-priced). If 3/3 answer "Ops budget", confirm the wedge. If 2+ answer "separate compliance budget" or "no budget — consultant eats it", re-examine the motion before Gate 1.

Additional call questions (lower priority, optional):

- What tool / spreadsheet / consultant do you use today for the 24 KPIs?
- Have you submitted for the 15 May 2025 and 15 May 2026 cycles? Any pain points?
- Would a signed PDF + European-database-ready JSON change the submission effort for you?
- Would you sign a design-partner letter for the 15 May 2027 cycle in exchange for free v0 usage and a reference-customer role?

## Strategic Fit (Brain-Memory-Body-Hands)

- **Brain:** new agent `datacentre-compliance` — extends the 16-agent TS suite
- **Memory:** add 24 EED KPIs + Annex III indicators to Lifetime World Model
- **Body:** signed PDF report via existing Firehorse Report Engine; JSON payload via new MCP tool
- **Hands:** BMS/PDU CSV ingest (v0); telemetry via MCP (v1)
- **Build for Agents:** `dws run datacentre-compliance --input '{"siteId": "...", "year": 2026}'` ✓

## Decision Gates

- **Gate 1 — 1 Oct 2026:** 3 design-partner letters signed? Yes → proceed to `/plan-eng-review`. No → park vertical.
- **Gate 2 — 1 Dec 2026:** Technical feasibility of signed JSON submission confirmed with DG ENER? Yes → build begins. No → re-scope as "report generator only".
- **Gate 3 — 1 Mar 2027:** First design-partner report generated, reviewed, accepted? Yes → commercial launch for 15 May 2027 cycle. No → iterate.

## Not in Scope (Explicit)

- DWS does not build, own, or operate datacentres. (Green roadmap parked per Arctic 15 audit.)
- DWS does not build or finance hydrogen infrastructure. (Hydrogen selvitys Track-2 economics do not pencil.)
- DWS does not replace DCIM. (We ride on top of it or on raw telemetry.)

---

_End of PRD v0.2 — no build authorised until Gate 1 passes._
