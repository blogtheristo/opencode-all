# Sales Battlecards — Manual Rep #1

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/gtm-skills-planning-7ui3kd | Date: 01.07.2026 | Changes: First manual rep of competitor battlecards per the Skill Codification Rule (GTM_SKILLS_GAP_PLAN_2026.md §2.1). 4 battlecards built from docs/competitor-pricing-analysis-2026-Q1.md pricing, 20-MOAT-FORTRESS.md moat numbers, and DWS_ROLES_REGISTRY.md role targeting.

Document Status:

- Created: 01.07.2026
- Last Modified: 01.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: INTERNAL
- Document Type: GTM Sales Battlecard

Related Documents:

- docs/gtm/GTM_SKILLS_GAP_PLAN_2026.md (§2.1 Battlecard generator)
- docs/competitor-pricing-analysis-2026-Q1.md
- 20-MOAT-FORTRESS.md
- DWS_ROLES_REGISTRY.md
- docs/gtm/PIPELINE_SNAPSHOT_2026-07-01.md (win/loss entries should feed corrections back here)

---

## How to use these

Each card targets one buyer role from `DWS_ROLES_REGISTRY.md`, because the
objection a CIO raises about Sweep is not the objection a CSO raises about it.
Cite moat numbers from `20-MOAT-FORTRESS.md`, not generic "AI capability"
claims — CLAUDE.md's drift guard on that file applies here too. No win/loss
data exists yet to validate these (see `PIPELINE_SNAPSHOT_2026-07-01.md` §0) —
treat every rebuttal below as a hypothesis to test on the next live objection,
not a proven line.

---

## Battlecard 1: vs. Greenly (Paris) — target R07/R08 (CSO / Head of Sustainability)

**Their pitch:** Entry-level GHG compliance tool, €3,500–€7,200/yr, 100+ generic
integrations.

**Why they win deals:** Cheapest sticker price in the category; "just get
compliant" buyers who haven't hit CSRD Wave 2 complexity yet.

**Why we win instead:**

- DWS IQ **Navigator €4,950 one-time pilot** (not annual) is cheaper than
  Greenly's _first-year_ annual (€5,800–€7,200) and doesn't bind to
  continuation — lower-risk entry, not a higher price.
- Greenly's "100+ generic integrations" are not Nordic-ERP-native (SAP, IFS,
  Visma, Monitor, Jeeves) — moat #12 (industrial/construction domain depth,
  10+ yrs) and #11 (Nordic languages) mean DWS setup time is materially
  shorter for a Nordic buyer.
- Greenly has no regulatory-lock-in story (moat S3): once a customer is
  mid-CSRD-cycle on a generic tool, they have nothing pulling them toward
  audit-defensible ETS/CBAM tracking (moat #18, KYA-governed, court-defensible
  audit trail).

**Objection to expect:** "Greenly is €2,000/yr cheaper at Premium tier."
**Rebuttal:** True in year one. Reframe on switching cost mid-CSRD-cycle
(moat S3) and ERP integration hours saved (quantify per prospect using the
TCO angle, not a generic claim).

**Do not claim:** That Greenly is technically worse at core GHG calculation —
no evidence for that in this repo. Compete on Nordic-ERP fit and regulatory
lock-in, not on core-feature superiority we haven't verified.

---

## Battlecard 2: vs. Sweep (Paris) — target R13/R14 (CIO / Head of IT)

**Their pitch:** €10,000–€80,000/yr scaling with company size; no known ERP
connectors, CSV/Excel workflow.

**Why they win deals:** Larger enterprise sales motion, brand recognition in
EU carbon-accounting space.

**Why we win instead:**

- CSV/Excel-only data entry is a CIO's nightmare at scale — it's manual
  reconciliation risk, not automation. DWS's native Nordic ERP connectors
  (SAP, IFS, Visma, Monitor, Jeeves) remove that step entirely.
- Sweep's pricing (€10k–€80k) already exceeds DWS **Nordic tier (€25,950/yr)**
  once a customer needs more than SME-scale — and Nordic tier includes custom
  integrations + SLA + dedicated support, not just software access.
- Moat #9 (multi-tenant architecture) and #16 (€3.50/month infra, 95% gross
  margin) mean DWS can hold pricing stable as the customer scales; a CSV-based
  competitor's manual-reconciliation cost scales linearly with data volume on
  the _customer's_ side, not just the vendor's.

**Objection to expect:** "Sweep has more brand recognition / bigger logos."
**Rebuttal:** Concede it — don't argue brand. Redirect to the ERP-integration
gap, which is a technical fact, not a perception fight.

---

## Battlecard 3: vs. Normative (Stockholm) — target R08 (Head of Sustainability, calculator-first buyer)

**Their pitch:** Free calculator entry point, €6,000–€36,000/yr standard,
Stockholm-based (Nordic credibility).

**Why they win deals:** Free tier gets budget-constrained sustainability teams
in the door before procurement even gets involved — hard to compete with
"free" on a first touch.

**Why we win instead:**

- Free calculators don't produce audit-defensible, submission-ready output —
  they produce estimates. Moat #18 (KYA-governed, court-defensible audit
  trail, <125ms leash-snap) is the thing a free tool structurally cannot
  match, because it requires the governance layer, not just the calculation.
- Normative is also Nordic-hosted, so "sovereignty" alone isn't a
  differentiator against them specifically — don't lead with moat #1/#19
  against this competitor. Lead with #18 (audit defensibility) and #6 (NIS2
  Article 21 expertise, 114 requirements) instead.

**Objection to expect:** "We can start free with Normative and upgrade only if
we need to."
**Rebuttal:** Ask what happens at first CSRD external assurance — does the
free-tier output survive an auditor's challenge? This is a discovery question,
not a claim; don't assert the answer without knowing their specific auditor
requirements.

---

## Battlecard 4: vs. Persefoni / Watershed (US, enterprise) — target R19 CRO / R23 CFO

**Their pitch:** Enterprise-grade, €50,000–€240,000/yr, US-based, no Nordic ERP
integration, CSV workflow (Persefoni) / limited API (Watershed).

**Why they win deals:** Enterprise credibility with US-headquartered or
US-investor-facing customers; broad feature set at the top end.

**Why we win instead:**

- DWS **Nordic tier (€25,950/yr)** is 2–9x cheaper than their enterprise
  bands, for a Nordic-domiciled customer who doesn't need US-market features.
- Neither competitor has Nordic ERP connectors — same integration gap as
  Sweep, sharper here because their price point implies enterprise-grade
  automation that a CSV workflow doesn't deliver.
- **US-hosted = CLOUD Act exposure.** For any customer with CISO/procurement
  sensitivity (moat #1, EU/Nordic operations; moat S1 sovereignty framing),
  this is a structural disqualifier for Persefoni/Watershed on regulated or
  critical-infrastructure accounts (see Kemira NIS2/CER angle in
  `sales-outreach/INTRO_MARIA_SEDERHOLM_KEMIRA.md` for the live version of
  this argument).

**Objection to expect:** "Watershed/Persefoni has more mature reporting
templates from a larger customer base."
**Rebuttal:** Legitimate — don't dismiss it. Counter on cost delta at Nordic
scale plus the CLOUD Act point, which is categorical, not a maturity
argument we'd need to out-feature them on.

---

## Open items for next rep

- No battlecard yet for the "build in-house" objection (R04 CTO) — the most
  likely objection at Outokumpu/Kemira/Siemens given their engineering depth.
  Build this next using moat #16 (€3.50/mo infra) and the 24–36 month /
  €3.05M–€8.35M replication-barrier framing from `20-MOAT-FORTRESS.md`.
- Every "objection to expect" above is a hypothesis. Update this file the
  first time a real deal actually surfaces one of these objections verbatim —
  log it in `PIPELINE_SNAPSHOT_2026-07-01.md` §2 first, then correct the card
  here.
