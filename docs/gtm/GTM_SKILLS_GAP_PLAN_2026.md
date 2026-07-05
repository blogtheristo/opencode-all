# GTM Skills Gap Plan — Skills We Don't Have Yet, To Win More Deals

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/gtm-skills-planning-7ui3kd | Date: 01.07.2026 | Changes: Initial gap analysis of the existing GTM/sales stack (skills, agents, docs) and a prioritized, effort-scored plan for the skills that are missing. Planning-only — no skills codified yet, per the Skill Codification Rule.

Document Status:

- Created: 01.07.2026
- Last Modified: 01.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: INTERNAL
- Document Type: GTM Skills Roadmap

Related Documents:

- CLAUDE.md → "Skill Codification Rule" and "Agent Productization Rule"
- docs/DWS_SKILLS_GUIDE.md
- skills/manifest.json
- DWS_ROLES_REGISTRY.md
- DWS_TRUTH_STANDARD.md
- docs/sales/_, docs/gtm/_, docs/competitor-pricing-analysis-2026-Q1.md
- .claude/commands/regulatory-radar.md

---

## 0. What this document is

A gap analysis, not an implementation. Per CLAUDE.md's Skill Codification Rule
("Asked Twice = Failure"), a skill only gets codified into `skills/<name>/SKILL.md`
after it has been done manually 3–10 times and the human has approved the output.
Nothing below has cleared that bar yet. This document is step 0: naming the gaps
so the next 3–10 manual reps have a target to aim at.

**A note on provenance:** an earlier message in this session, sourced from an
external "Projects" input, claimed 9 sales skills already existed (`pipeline-review`,
`forecast`, `daily-briefing`, `call-prep`, `call-summary`, `draft-outreach`,
`account-research`, `competitive-intelligence`, `create-an-asset`) and specific
customer/pilot/partner facts. None of those skill names exist in `skills/manifest.json`
or `skills/`, and the customer facts were not independently verifiable from this
repo. That input was discarded. Everything below is grounded in an actual repo
survey (grep across `skills/`, `.claude/commands/`, `src/agents/`, `docs/`,
`DWS_*.md`) done in this session.

## 1. What already exists (so we don't rebuild it)

**Mature:** `/investor-outreach` (investor pipeline), 3 sales-strategy docs
(`docs/sales/ENTERPRISE_WINNING_SALES_STRATEGY.md`, `WINNING_SALES_STRATEGY.md`,
`LIFETIME_FLEET_PERSONAL_WINNING_SALES_STRATEGY.md`), `docs/competitor-pricing-analysis-2026-Q1.md`,
`customer-sat.agent.ts` (churn/health scoring), `viability.agent.ts` (ROI/NPV/carbon
credit scoring), `firehorse-report` skill (CSRD/ETS/CBAM/AI-Act compliance
reporting — sellable as a risk-removal claim), `DWS_ROLES_REGISTRY.md` (25-role ×
5-stage taxonomy every outreach motion should route through), `20-MOAT-FORTRESS.md`
(19 competitive moats, investor + buyer framing).

**Solid, not yet a skill:** `sales-outreach.agent.ts` (lead research + email
drafting), `lead-feedback.agent.ts` (closed-won → SEO keyword loop), TED
public-procurement lead pipeline (`src/construction-leads/`, `ted-lead-pipeline.ts`,
daily GitHub Action), `docs/partnerships/` (Qantic, Rightful Oy, xAI-Optimus deal docs).

**Spec exists, not built:** `/regulatory-radar` — status `slash-deferred` in
`skills/manifest.json`, implementation blocked on "datacentre-compliance PRD Gate 1"
(see `docs/DWS_SKILLS_GUIDE.md` v1.3 note). This is the closest thing to a
"regulatory deadline → urgency score" capability; **finish this one instead of
inventing a duplicate.**

## 2. Confirmed gaps, priority-ordered

Ordered by how directly each shortens or de-risks an active deal, using only
capabilities that grep-confirmed do not exist anywhere in the repo.

### 2.1 Battlecard generator (per competitor × per buyer role)

- **Gap:** `docs/competitor-pricing-analysis-2026-Q1.md` has the raw pricing
  comparison but nothing turns it into a live, role-targeted battlecard. No
  win/loss capture feeds it.
- **Skill shape:** input = competitor name + `DWS_ROLES_REGISTRY.md` role ID;
  output = objection/rebuttal card citing `20-MOAT-FORTRESS.md` moat numbers and
  the pricing doc, in the buyer's language (not investor language — export
  hygiene rule in `DWS_TRUTH_STANDARD.md` applies).
- **Manual reps needed:** build 3–5 battlecards by hand for live deals first
  (e.g. next 3 enterprise prospects), get HIL sign-off on tone/accuracy, then
  codify.

### 2.2 RFP / tender compliance screener

- **Gap:** the TED lead pipeline sources public tenders (`src/construction-leads/`)
  but nothing screens a tender's requirement matrix against `DWS_STANDARDS_LIBRARY.md`
  certifications (ISO 27001, SOC 2, etc.) before bid-writing time is spent.
- **Skill shape:** input = tender requirement list; output = met/gap table per
  requirement + go/no-go recommendation. Cost-avoidance, not revenue — protects
  scarce bid-writing time.
- **Manual reps needed:** run against the next 3–5 TED-sourced tenders manually,
  compare screener verdicts to actual outcomes before trusting it.

### 2.3 Win/loss post-mortem capture

- **Gap:** no structured capture exists anywhere. This is foundational — the
  battlecard and pricing skills above both degrade without real win/loss signal
  feeding them.
- **Skill shape:** short structured interview template + pattern log, feeding
  `lead-feedback.agent.ts`'s existing closed-won loop (currently one-directional;
  this closes the loss side too).
- **Manual reps needed:** run the interview manually on the next 5 closed deals
  (won or lost) before templating.

### 2.4 Deal-desk / pricing consistency check

- **Gap:** enterprise/vertical pricing is scattered across
  `docs/sales/enterprise-pricing-construction.md`, `docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md`,
  `docs/competitor-pricing-analysis-2026-Q1.md`, and per-partnership docs, with
  no single source of truth. CLAUDE.md's pricing rule only covers
  `dws10.com/config/products.json` (store products) — enterprise quotes have no
  equivalent guardrail, so two reps (or two sessions of one founder) could quote
  differently.
- **Skill shape:** before a quote goes out, cross-check the number against every
  pricing doc above and flag drift; no discount-approval workflow needed yet at
  this deal volume — just a consistency gate.
- **Manual reps needed:** run manually on the next 3–5 outbound quotes.

### 2.5 Upsell/expansion signal scan

- **Gap:** `viability.agent.ts` computes ROI/payback for a prospect but nothing
  re-runs it against an existing customer to flag expansion timing. `customer-sat.agent.ts`
  flags churn risk but not growth opportunity — the inverse signal is unused.
- **Skill shape:** re-score an existing account through `viability.agent.ts`
  logic against a new module/tier; flag when the delta crosses a threshold worth
  a conversation.
- **Manual reps needed:** run against 3–5 active accounts before trusting the
  threshold.

### 2.6 Finish `/regulatory-radar` (not a new skill — unblock the existing one)

- **Gap:** already spec'd, blocked on "datacentre-compliance PRD Gate 1." Given
  the EPBD/ETS2/CBAM/CSRD/NIS2 deadline landscape is the actual qualification
  filter this company sells against (per `docs/gtm/steel-industry.md` and the
  compliance skill), this is worth unblocking before adding new regulatory
  tooling.
- **Action:** find out what Gate 1 requires and clear it, rather than building
  a second regulatory-deadline skill under a different name.

## 3. Explicitly not building

- **General lead-scoring / high-volume email sequencer.** `DWS_ROLES_REGISTRY.md`
  and the sales-strategy docs are built around narrow ICP gatekeeping (Door #1
  wedge per industry), not volume. A generic sequencer works against that model.
- **CRM bidirectional sync / territory & quota planning.** No evidence in this
  repo of multi-rep quota structures or an external CRM to sync against — building
  this now would be speculative infrastructure for a team size that doesn't exist
  yet. Revisit if headcount grows.
- **Contract lifecycle management (e-signature, renewal tracking).** No contract
  volume evidence in-repo to justify it yet; a checklist in the deal-desk skill
  (2.4) covers today's need.

## 4. Suggested order

1. **2.3 Win/loss capture** first — everything else gets better with real signal
   feeding it, and it costs almost nothing to start (a template + discipline).
2. **2.6 Unblock `/regulatory-radar`** — it's already 80% designed; finishing it
   beats starting something new.
3. **2.1 Battlecards** and **2.2 RFP screener** in parallel — both are direct
   deal-cycle accelerants once 3.1's win/loss data and existing docs are wired in.
4. **2.4 Deal-desk pricing check** and **2.5 Upsell scan** — lower urgency, do
   once the above are running.

## 5. Next step

Pick one item from §2, do it manually on the next 3–5 real deals per the
Skill Codification Rule, show the output, and only then draft the `SKILL.md` +
`.claude/commands/<name>.md` pair and register it in `skills/manifest.json` and
`docs/DWS_SKILLS_GUIDE.md`.
