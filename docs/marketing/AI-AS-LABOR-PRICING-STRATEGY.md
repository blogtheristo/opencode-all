# Price AI Like Labor, Not Like a Tool

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/ai-pricing-labor-model-GeqbE | Date: 14.05.2026 | Changes: Initial creation — DWS marketing & pricing positioning shift from tool-pricing (SaaS seats / copilots) to labor-pricing (outcome- and FTE-equivalent units); reframes the DWS IQ 6 sales narrative for Q2/Q3 2026 against the SaaS-lens competitor baseline

Session Links & References:

- Claude Code (claude/ai-pricing-labor-model-GeqbE): https://github.com/blogtheristo/dws6/commits/claude/ai-pricing-labor-model-GeqbE
- View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/ai-pricing-labor-model-GeqbE/docs/marketing/AI-AS-LABOR-PRICING-STRATEGY.md

Document Status:

- Created: 14.05.2026
- Last Modified: 14.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

***

## The Headline

> **Stop pricing AI like a tool. Start pricing it like labor.**
>
> If AI can actually do the work, why are we still valuing it like a tool?

When software stops helping humans do the work and starts **doing the work itself**, that is not a feature upgrade. It is a business-model shift.

---

## The Lens Problem

Most founders, buyers, and investors still look at AI through a **SaaS lens**:

- Copilots that suggest.
- Productivity gains measured in minutes saved per knowledge worker.
- Pricing by seat, edition, or "AI add-on."
- Better UX wrapped around the same human workflow.

That lens is a category error once the software is doing the work. The right comparison is no longer Microsoft Office or Jira. It is the loaded cost of a billable hour, a junior analyst, a compliance officer, a site supervisor, or an outsourced BPO contract.

---

## The Shift in One Table

| Dimension | Tool Lens (SaaS, copilot)      | Labor Lens (agentic AI)                          |
| --------- | ------------------------------ | ------------------------------------------------ |
| Buyer     | IT / line-of-business admin    | Department head with a headcount budget          |
| Unit      | Seat, edition, feature flag    | Task completed, case closed, report delivered    |
| Anchor    | Other software                 | Loaded labor cost / consultancy day rate / BPO   |
| Pricing   | €X/user/month                  | €X/case, €X/report, €X/agent-month at SLA        |
| Value     | "X% faster for your team"      | "Replaces N FTEs at Y% of fully loaded cost"     |
| Procure   | Software budget                | Services / operations budget                     |
| Risk      | Adoption                       | Output quality, liability, audit trail           |
| Margin    | Compressed by seat saturation  | Anchored to human cost — expands as model costs drop |

When the unit of value is **the work itself**, the price ceiling is set by what that work costs today (human + overhead), not by what comparable software costs.

---

## Why This Matters for DWS IQ 6

DWS IQ 6 already crosses the line. It is not a copilot. The Skilled Agents — SiteSense, Material Oracle, Compliance, Schedule Genius, Themis as Case Coordinator — **produce the deliverable**: the site-safety score, the EN 15978 LCA report, the CSRD / CBAM gap analysis, the case plan with assigned sub-agents.

So our pricing has to stop apologizing for itself in SaaS units. The Blue / Green deployment standard (see `DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md`) defines **how** we release and charge across lifecycle. This document defines **what we are charging for** in the buyer's mental model: not a tool, but labor.

---

## The DWS Labor-Pricing Model

We expose three labor-shaped commercial units. They sit on top of, not in conflict with, the Blue/Green tiering.

### 1. Per-Outcome (the unit of work)

Price a **delivered artifact** at a fraction of its current human cost.

| Outcome                                | Human baseline (today)            | DWS price anchor       |
| -------------------------------------- | --------------------------------- | ---------------------- |
| EN 15978 carbon report (A1–D)          | 3–6 consultant days @ €1.2–1.8k/d | 10–20% of baseline     |
| CSRD double-materiality gap analysis   | 5–10 advisory days                | 10–20% of baseline     |
| Site-safety assessment (per site/day)  | 0.5–1 supervisor day              | 10–20% of baseline     |
| CBAM exposure assessment per product   | 2–4 trade-compliance days         | 10–20% of baseline     |

10–20% of the human baseline is the public anchor; the **gross margin sits above 80%** because the marginal cost is inference + a thin human-on-loop review. As model costs fall, margin expands; the price holds because the **anchor is labor, not compute**.

### 2. Per-Agent-Month (the unit of staffing)

Sell a Skilled Agent the way a customer would hire an FTE or retain a consultancy seat.

- One Skilled Agent at SLA = one named role on the org chart (e.g., "Material Oracle, ESG reporting analyst, EU coverage").
- Priced at **15–30% of the fully loaded cost** of the equivalent human role per month.
- Includes audit trail, KYA trust score (TC-0…TC-4), and Themis-coordinated escalation to humans.

This is the unit a Head of Sustainability or Head of HSE can put in a budget line they already own.

### 3. Per-Deployment (the unit of capability install)

The classic enterprise software shape, kept only for buyers who genuinely need it:

- One-time deployment fee.
- Required monthly subscription (per Dynamic Deployment Pricing Standard).
- Cloud / hardware as separate operating costs.

We **lead with outcome or agent-month**, and fall back to per-deployment when procurement insists.

What we explicitly do **not** sell:

- **Per-seat AI**. There are no seats. There are agents and outcomes. A customer is not buying access for 50 employees; they are buying the work that 1–3 FTEs used to produce.

---

## Messaging Shifts (Sales & Marketing)

Stop saying:

- "AI-powered platform"
- "Boosts productivity by X%"
- "Per-user / per-seat pricing"
- "Copilot for [role]"
- "Helps your team move faster"

Start saying:

- "DWS IQ 6 does the work."
- "One Skilled Agent replaces a junior analyst at ~20% of the cost — with audit trail."
- "Priced per report, not per seat."
- "Compare to consultancy day rate, not to SaaS."
- "Your sustainability function on subscription."

Anchor every quote against a **human baseline the buyer already pays for** — Big-Four advisory, in-house FTE loaded cost, or BPO contract — never against another SaaS tool.

---

## Why The SaaS Lens Compresses Us (and the labor lens does not)

| Force                                | SaaS-lens outcome                 | Labor-lens outcome                                          |
| ------------------------------------ | --------------------------------- | ----------------------------------------------------------- |
| Falling inference cost               | Seat price gets pushed down       | Margin expands; price holds against human cost              |
| Bundling by hyperscalers             | "Free with M365 / Workspace"      | Hyperscaler bundle does not deliver the audited deliverable |
| Open-source models                   | Commoditizes the copilot          | Skilled Agent + compliance posture remains the moat         |
| Per-seat saturation                  | Account caps out at headcount     | Outcome volume scales with cases / reports / sites          |
| EU AI Act / CSRD / CBAM obligation   | Pure tool can't sign off          | Skilled Agent + KYA + Themis produces the signed artifact   |

The labor lens turns every regulatory tailwind (EU AI Act, CSRD, CBAM, Fit for 55) into a **demand signal for the work**, not a feature checklist for the tool.

---

## Buyer & Budget Mapping

| Buyer                             | Budget line they own                | DWS labor unit to lead with               |
| --------------------------------- | ----------------------------------- | ----------------------------------------- |
| Head of Sustainability / ESG      | External advisory + reporting       | Per-outcome (CSRD / CBAM / LCA reports)   |
| HSE / Safety Director             | Site supervision + insurance        | Per-outcome (site-safety assessments)     |
| COO / Operations Director         | Headcount + BPO                     | Per-agent-month (Skilled Agent as role)   |
| CFO / CIO                         | Software + transformation           | Per-deployment + agent-month combo        |
| Innovation / R&D                  | Pilot budget                        | Blue pilot (per Dynamic Deployment Std.)  |

For the Q1/26 sales manifesto target list (NCC, Skanska, PORR, STRABAG, HOCHTIEF, etc.), the **Head of Sustainability** and **HSE Director** budget lines are the unlock — both are advisory-heavy, headcount-constrained, and under direct regulatory pressure.

---

## Investor Narrative

For PE meetings and the Messe round (see investor-outreach skill):

1. **The category is moving from tool to labor.** SaaS multiples ceiling out where labor multiples start.
2. **DWS is already on the labor side of the line.** Skilled Agents produce artifacts the buyer would otherwise pay people to produce.
3. **The price anchor is the human baseline,** which is 5–10× a comparable SaaS seat. Inference cost going to zero is a tailwind, not a threat.
4. **Regulation is the demand engine.** CSRD, CBAM, EU AI Act, and Fit for 55 mandate the work, then ask who can produce it with an audit trail. DWS IQ 6 + Themis + KYA is one of the few stacks that can sign.

---

## What Changes Next (Action Items)

1. Update `DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md` quote language to lead with **per-outcome / per-agent-month** and anchor against advisory day rate.
2. Audit `dws10.com/config/products.json` (and the `landing-pages/dws10-com/` mirror) so at least one Green product per Skilled Agent is published as **per-outcome** or **per-agent-month**, not only per-deployment.
3. Add labor-anchored comparison tables to public Store pages — never SaaS-anchored.
4. Brief investor-outreach INTRO notes with the "tool → labor" narrative as the headline thesis.
5. Reflect this in the master's thesis (implementation evidence — products, prices, conversions) and in the PhD thesis (scientific framing — category shift, regulatory tailwind, pricing-power thesis).

---

## Source

Conversation with @dhaber on what happens when software stops helping humans do the work — and starts doing the work itself.
