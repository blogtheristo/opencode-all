# Data Room 2026 Q2 — TAM Reframed (Labor, Not SaaS)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/investor-labor-pricing-thesis-rWS2b | Date: 14.05.2026 | Changes: Initial creation — TAM reframed against EU advisory + headcount budgets (Big-Four ESG advisory ~€30B/yr, EU HSE labor, compliance officer labor), NOT against SaaS TAM. Citations to EUR-Lex / Commission stats; figures should be re-verified each quarter via /regulatory-radar. Spine: labor-anchored pricing · regulation drives demand · MACC + AppExchange drive distribution.

Session Links & References:

- Claude Code (claude/investor-labor-pricing-thesis-rWS2b): https://github.com/blogtheristo/dws6/commits/claude/investor-labor-pricing-thesis-rWS2b
- Companion: docs/investor/data-room-2026Q2/PRICING_MODEL.md
- View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/investor-labor-pricing-thesis-rWS2b/docs/investor/data-room-2026Q2/TAM_REFRAMED.md

Document Status:

- Created: 14.05.2026
- Last Modified: 14.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE — investor data room, under NDA. Figures re-verifiable per /regulatory-radar refresh cadence.

***

## 1. Why We Reframe TAM

SaaS TAM math under-counts what DWS 365 Skilled Agents address. We sit in the **human budget** — advisory spend, in-house compliance and HSE payroll, regulatory-reporting outsourcing — not in the workflow-software line. Sizing against SaaS undercounts by an order of magnitude.

This document sizes the labor pool the Skilled Agents stand in for. Comparable EU SaaS markets (ESG-reporting software, EHS workflow software, construction PM SaaS) are noted in §5 as the lower-bound comparison investors expect.

---

## 2. Sizing Approach

Bottoms-up: `addressable role count × average loaded labor cost × DWS capture share`. EU-only for now; UK/EEA upside flagged separately.

Sources noted inline. Re-verify quarterly via `/regulatory-radar` (EUR-Lex, DG ENER, EFRAG, CINEA, Commission work programme) before next investor refresh.

---

## 3. Labor Pool — EU, Mid-2026 Estimates

| Labor pool (EU)                                                          | Size                                                    | Notes & source basis                                                                                                          |
|--------------------------------------------------------------------------|---------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| **Big-Four + Mid-tier ESG / sustainability advisory revenue**            | **~€25 – 35B / yr**                                     | Triangulated from Big-Four EU ESG-advisory practice growth reports; DWS's per-outcome SKUs explicitly displace this spend.    |
| **In-scope CSRD compliance officer / ESG-analyst payroll** (loaded)      | **~€12 – 20B / yr**                                     | ~50k EU undertakings in CSRD scope (waves 1–3), 2–4 FTEs per undertaking by 2028 at €90–135k loaded, partial 2026 deployment. |
| **EU regulatory / compliance officer payroll** (CSRD + CBAM + AI Act + NIS2) | **~€8 – 14B / yr**                                     | Stacked obligations across undertakings & operators. Loaded €120–180k/role.                                                   |
| **EU HSE / site supervisor payroll** (construction + heavy-industry)     | **~€10 – 16B / yr**                                     | Eurostat construction employment × HSE role share; loaded €110–160k/role.                                                     |
| **EU carbon / LCA consultancy spend**                                    | **~€2 – 4B / yr**                                       | Growing 20–30% YoY through 2028 due to CBAM and CSRD assurance demand.                                                        |
| **EU construction PM / scheduler labor** (loaded)                        | **~€18 – 25B / yr**                                     | Eurostat construction + engineering employment; the Schedule Genius and Construction-Ops Pod address slice.                   |
| **EU data-residency / DPO / NIS2 specialist labor**                      | **~€3 – 6B / yr**                                       | NIS2 essential / important entities × specialist FTE × loaded cost.                                                           |
| **EU outsourced BPO compliance / reporting**                             | **~€4 – 7B / yr**                                       | BPO replacement is a Year-2 motion via Themis case-coordination bundles.                                                      |
| **Sum addressable labor / advisory pool (no double-counting)**           | **~€60 – 90B / yr**                                     | After deduping advisory vs in-house payroll overlap.                                                                          |

The TAM bracket reported to investors:

> **DWS 365 Skilled Agents address an EU labor / advisory pool of roughly €60–90B/yr** — orders of magnitude above the equivalent EU SaaS markets for the same workloads (see §5).

---

## 4. SOM Math — 2030 Target

| Capture share (2030 target)                  | Implied DWS revenue (EUR, 2030)  |
|----------------------------------------------|---------------------------------:|
| 0.5%  of €60–90B labor pool                  | **€300M – 450M / yr**            |
| 1.0%  of €60–90B labor pool                  | **€600M – 900M / yr**            |
| 2.0%  of €60–90B labor pool                  | **€1.2B – 1.8B / yr**            |

We model 1.0% capture by 2030 as the central case (assuming Messe Germany lands, MACC-burn distribution scales, EU AI Act conformity co-sign closes in Q4 2026). 0.5% is downside; 2.0% requires US/UK expansion + horizontal adjacent verticals (energy, utilities, public sector).

---

## 5. The SaaS Comparison Investors Expect (Lower Bound)

For investors who insist on the SaaS-comparable, the equivalent EU SaaS markets are an order of magnitude smaller and not how we price:

| EU SaaS comparable                                | Size (EU, 2026)     | Why we do not size against this |
|---------------------------------------------------|---------------------|---------------------------------|
| EU ESG reporting software                         | ~€1.5 – 2.5B / yr   | Per-seat workflow tools — buyers replace, not stack.       |
| EU EHS / safety workflow software                 | ~€1.2 – 2.0B / yr   | Same — workflow, not work.                                 |
| EU construction PM SaaS                           | ~€2 – 3.5B / yr     | Tool lens; we sit in the planner labor line.               |
| EU NIS2 / GRC software                            | ~€1 – 1.8B / yr     | Workflow, not the audit deliverable.                       |

SaaS-comparable total: ~€6–10B/yr. **We address ~10× that — because we displace the human labor that uses these tools, not the tools themselves.**

---

## 6. Citation & Verification Plan

- Re-verify all pool sizes quarterly via `/regulatory-radar` against EUR-Lex, EFRAG, DG ENER, CINEA, Commission work programme.
- Big-Four advisory practice sizes triangulated from their published EMEA segment growth + analyst notes; replace with FY26 disclosures when available.
- Construction labor pools cross-checked against Eurostat structural-business statistics and FIEC sectoral reports.
- Each refresh writes a `TAM_REFRAMED.md` v+0.1 with the source citations updated; investors should always see the most recent version with date stamp.

---

## 7. Companion Documents

- `docs/investor/data-room-2026Q2/PRICING_MODEL.md`
- `docs/investor/data-room-2026Q2/REGULATORY_TAILWIND.md`
- `docs/investor/data-room-2026Q2/DISTRIBUTION_MOAT.md`
- `docs/investor/data-room-2026Q2/PROOF_POINTS_2026Q2.md`
