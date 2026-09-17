# DWS IQ 6 — Enterprise Sales Funnel Workflow

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/exa-openclaw-integration-YnDpO | Date: 25.05.2026 | Changes: Initial creation. Sibling to docs/SALES_FUNNEL_WORKFLOW.md (the 14-step self-serve funnel). Five-step role-event-gated path for enterprise deals where the buyer is a 5-stage stakeholder set, not a single click-to-buy user. Five steps from Boardy proposal (2026-05-25), exit criteria + durations + CRM events + abort rules added per usability audit.

Session Links & References:

- Sibling: docs/SALES_FUNNEL_WORKFLOW.md (self-serve, €1 activation, 14 steps)
- Source: DWS_ROLES_REGISTRY.md (5 stages + 25 roles + industry variants)
- Worked example: sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md
- Reference: CYCLE_TIME_BENCHMARK_OUTOKUMPU_FORTA.md

Document Status:

- Created: 25.05.2026
- Language: English
- Publication Status: ACTIVE
- Document Type: Sales Workflow
- Owner: Risto Päärni

***

## 1. Purpose

Operational engine for enterprise-tier sales — deals where the buyer is a 5-stage stakeholder set (Sponsor / Owner / Approver / Driver / Sign-off) and the cycle is weeks to months, not minutes. Sibling to `docs/SALES_FUNNEL_WORKFLOW.md` (self-serve, €1 activation, 14 mechanical steps for single-buyer-click motions).

**Use this funnel when:** the prospect has a named captain hat in `industries.json`, the deal involves a multi-stakeholder approval chain, or the ARR per customer is >€50k.

**Use the self-serve funnel when:** the buyer can purchase via `dws10.com/buy/`, ARR per customer is <€25k, or no enterprise stakeholder mapping is needed.

## 2. Why a Separate Funnel — Different Origin, Different Ball Game

The self-serve funnel (`docs/SALES_FUNNEL_WORKFLOW.md`) was born from **master thesis goals** — proving the DWS platform can publish dynamic products to a live store at scale. Its measured outcomes (30/30 Google Merchant acceptance, 96% cycle-time reduction, 80% error reduction, 100% feed-generation automation) are master-thesis evidence per the `CLAUDE.md` Thesis Content Scope Rule (implementation-focused, tightly coupled to the current product version). It gates on **payment events** (Stripe activation, invoice creation) because the thesis goal was throughput and dynamic-product publishing, not stakeholder consensus.

The enterprise funnel is a **different ball game**: revenue-engine, multi-stakeholder, role-event-gated, 14–25 week cycle. Born from commercial necessity (the €900k ARR target), not from academic deliverable. It gates on **role events** (per-stakeholder confirmation, per-role-specific proof). Forcing enterprise deals through the self-serve path creates two failure modes: high-ARR buyers abandoning at €1-activation friction; and stakeholders outside the buying centre being asked to "click buy" outside their authority.

**The two funnels coexist by design, not by accident.** Self-serve continues to ship master-thesis throughput evidence and serves the SME / Tier-2 market. Enterprise serves the multi-stakeholder consensus motion that produces 15 wins × €60k = €900k from a smaller customer count. Conflating them — designing for one and force-fitting the other — is a category error.

| Dimension      | Self-serve (`SALES_FUNNEL_WORKFLOW.md`)             | Enterprise (this doc)                                     |
| -------------- | --------------------------------------------------- | --------------------------------------------------------- |
| Origin         | Master thesis — dynamic-product publishing at scale | Commercial — €900k ARR target via consensus selling       |
| Gates on       | Payment events (Stripe, invoice)                    | Role events (per-stakeholder confirmation)                |
| Buyer          | Single role, click-to-buy                           | 5-stage stakeholder set                                   |
| Cycle          | Minutes per buyer                                   | 14–25 weeks per buyer                                     |
| Evidence layer | Master thesis (implementation)                      | Operating model (multi-stakeholder pattern)               |
| What it proves | Platform can publish 30/30 products to live store   | Platform can close enterprise deals via role-event gating |

## 3. ARR Bridge

Enterprise path math toward the €900k Q4 2026 target (same target, different shape than self-serve):

| Path                         | Customers     | Avg ARR/customer | Total ARR | Cycle                     |
| ---------------------------- | ------------- | ---------------- | --------- | ------------------------- |
| Self-serve (existing)        | 45            | €20,000          | €900k     | minutes per buyer         |
| **Enterprise (this funnel)** | **15**        | **€60,000**      | **€900k** | **14–25 weeks per buyer** |
| Mix (realistic)              | 25 SS + 8 Ent | —                | €900k     | both paths active         |

Enterprise wins are 1/3 the count of self-serve wins for the same revenue. Pipeline math: ~30–45 prospects needed in this funnel to produce 15 wins (33–50% close rate from Step 2 onward; lower if measured from Step 0).

## 4. Step 0 — Qualify (prequel)

**Before** entering Step 1, the prospect must pass three checks:

- Industry maps to one of the 25 in `/INDUSTRIES.md`.
- Industry maps to one of the 16 captain hats in `dws10.com/config/industries.json` (or one of the 5 platform-only industries with platform offering scoped).
- ARR potential ≥ €50k (else route to self-serve funnel).

**Exit:** all three checks pass; prospect tagged with industry + captain hat in CRM.
**Typical duration:** 1 day.
**CRM event:** `Lead → Marketing Qualified Lead (MQL)`.
**Abort:** any check fails → route to self-serve or disqualify.

## 5. The 5 Steps

### Step 1 — Door #1 (pick the wedge role)

Pick the commercial wedge role — usually the person closest to revenue or risk in the prospect's org chart, per the revenue-lever rule (`DWS_ROLES_REGISTRY.md` §5).

- Look up industry in `DWS_ROLES_REGISTRY.md §4 Industry Variants` to find the standard door for that vertical (e.g. steel → R02 IP Director; chemicals → R03/R04; construction → R12; financial services → R23).
- Adjust for prospect specifics (some orgs have unusual structures — note the variant).
- Identify the named person via LinkedIn + company site; verify contact route.

**Exit:** one named human + verified contact route + door-rationale documented in `INTRO_<NAME>_<COMPANY>.md`.
**Typical duration:** 3–5 days.
**CRM event:** `MQL → Sales Qualified Lead (SQL)` — door assigned.
**Abort:** door candidate doesn't respond + no alternative door visible after 2 weeks → re-qualify at Step 0 or walk.

### Step 2 — Map the 5 buying stages

Identify Sponsor / Owner / Approver / Driver / Sign-off named humans at the prospect. Apply the **diagonal win-win** construction from `DWS_ROLES_REGISTRY.md` §2 — each role's "what you win" lights up someone else's "win you create for the rest of the company".

- Document each stakeholder in the `INTRO_<NAME>_<COMPANY>.md` file with per-role wedge framing.
- Stage progression order: Sponsor → Owner → Approver → Driver → Sign-off.

**Exit:** all 5 stages have a named human + a per-role "what they win + win they create" line in the INTRO file.
**Typical duration:** 1–2 weeks.
**CRM event:** `SQL → Discovery` — stakeholder map built.
**Abort:** 3+ stages cannot be mapped after 3 weeks → champion-only deal; either re-prove wedge at higher level or walk.

### Step 3 — Prove the wedge (one pain, one workflow, one number)

- **One concrete pain** visible to Door #1 today (not theoretical; cite the workflow they run weekly).
- **One specific workflow** that pain blocks (named, scoped, measurable).
- **One customer-specific number** — before-and-after on that workflow (e.g. CBAM declaration: 2 hours → 5 minutes per quote; disclosure cycle: 3 weeks → 1 day; Google Merchant acceptance: 85% → 100%).

Deliver via the relevant standard's Skill (`DWS_ROLES_REGISTRY.md` §5 naming pattern: `/<domain>-<artifact>-standard`) or a worked-example anonymized landing page on `dws10.com`.

**Exit:** Door #1 confirms in writing or call: "yes, that pain is real" + acknowledges the before/after number.
**Typical duration:** 2–3 weeks.
**CRM event:** `Discovery → Wedge Proven` — concrete-pain validated.
**Abort:** Door #1 cannot validate the number on their own workflow after 4 weeks → wedge is wrong; restart at Step 1 with different door or different wedge.

### Step 4 — Expand sideways (role-specific proof per stage)

Use Door #1 as advocate to reach Owner → Approver → Driver → Sign-off. Each stakeholder gets per-role framing from the diagonal win-win matrix in their INTRO file.

- **Order:** follow stage progression (Sponsor first, Sign-off last). Don't jump to Sign-off before Approver buys in — premature escalation kills deals.
- **Outokumpu 3-door pattern (proven):** Door #1 (IP/Legal) → Door #2 (Sustainability) → Door #3 (Sales Engineering). Adopt or adapt per industry variant.
- Each stakeholder needs at least one role-specific proof point — not the generic deck.

**Exit:** at least 3 of 5 stages confirm wedge applies to them; 2+ stakeholders have requested follow-up artifacts (demo, pilot scope, technical conversation).
**Typical duration:** 4–6 weeks.
**CRM event:** `Wedge Proven → Consensus Building → Pre-Close`.
**Abort:** consensus stalls at one stage for 4+ weeks → escalate (Door #1 brings the blocker into a 3-way conversation) OR re-prove wedge at the blocking role's level OR walk.

### Step 5 — Close on pilot or paid standard

**Branch on prior precedent:**

- **First-of-industry → pilot.** 30–90 day validation. Named success criteria. Cost: free or token (€1 activation equivalent at enterprise scale = €5k–€15k pilot setup). Outcome: signed pilot contract.
- **Second+ in same industry → paid standard.** Pattern already proven; go direct to platform license or captain seat. Outcome: signed platform contract (€50k+ ARR) or captain seat commitment (€50k Platinum or €25k Deputy).

**Exit:** signed pilot OR signed platform/captain contract.
**Typical duration:** 4–8 weeks.
**CRM event:** `Pre-Close → Closed-Won`.
**Abort:** pilot agreed but unsigned 4 weeks after verbal yes → contract blocker; escalate via Sign-off role directly OR walk.

## 6. Abort Criteria (Cross-Cutting)

Across all steps, walk away or escalate when:

- **4+ weeks at one step with no role-event progress** → escalate to Door #1 for unblock or walk.
- **Door #1 disappears** (role change, departure, restructuring) → restart Step 1 with new door.
- **Champion-only consensus** (Owner engaged but won't introduce Approver) → re-prove wedge at Approver level; if still blocked, walk.
- **Sign-off blocks repeatedly** with the same objection → restart Step 1 with a different role as Door #1 in an adjacent function (e.g. if Sign-off is Legal and blocks, restart with R&D as new door).

Total typical cycle: **14–25 weeks** end-to-end (Step 0 → Step 5). Pipeline planning should assume 16 weeks median.

## 7. Worked Example — Outokumpu (Ari Hirvonen)

| Step                     | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Reference                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Step 0 — Qualify         | ✅ Done. Steel industry (Iron & Steel hat), Outokumpu in scope.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `INDUSTRIES.md` row 2                                                                                      |
| Step 1 — Door #1         | ✅ Done. R02 IP Director per §4 industry-variants standard door for steel. Named: Ari Hirvonen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md`                                                           |
| Step 2 — Map stages      | ✅ Done. All 5 stages mapped via the wedge-by-role matrix (14 roles across 5 stages).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | INTRO file §"Wedge by role"                                                                                |
| Step 3 — Prove wedge     | 🟡 In progress. Forta tenders currently leak CBAM, EPD, and Scope-3 disclosures without IP review, exposing scrap ratio, energy mix, recipe, and source country. The win is 2–6 weeks down to under 2 minutes per disclosure, plus 240–480 sales-engineering hours per rep per year. Modeled; awaiting Ari's confirmation against Outokumpu's actual baseline. Commercial-terms Reply 2 (€24k pilot) drafted 2026-05-25 but held on attachments; both attachments now exist (`PILOT_SHEET_OUTOKUMPU_FORTA.md`, `NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md`) — real remaining blocker is filling `[TBD]` fields, not missing artifacts. | `CYCLE_TIME_BENCHMARK_OUTOKUMPU_FORTA.md`, `LETTER_ARI_HIRVONEN_OUTOKUMPU_REPLY2_CLARIFICATION.md`         |
| Step 4 — Expand sideways | ⏳ Queued. 3-door plan: IP/Legal → Sustainability → Sales Engineering. Fourth, independent door identified 2026-07-01 via LinkedIn OSINT: Henri Simpanen, VP Kemi mine (R11 Plant Director) — construction/sovereignty wedge, held pending Ari handoff point.                                                                                                                                                                                                                                                                                                                                                                        | INTRO file §"Three doors"; `docs/field-notes/2026-07-01-outokumpu-henri-simpanen-kemi-mine-second-door.md` |
| Step 5 — Close           | ⏳ Not started. First-of-industry → pilot path.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | —                                                                                                          |

## 8. Implementation Checklist

- [ ] Add CRM custom fields for the 6 stages (Step 0 → Step 5) + role-event timestamps.
- [ ] Map each INTRO file's stakeholder matrix into CRM contact records.
- [ ] Wire role-event triggers (Door #1 confirmed, wedge validated, consensus reached) to dashboard.
- [ ] Build per-industry door-#1 lookup as a `/door-1` skill that reads `DWS_ROLES_REGISTRY.md §4` and returns the standard door for a given industry.
- [ ] Quarterly review of abort criteria — calibrate week thresholds against actual deal data once 3+ enterprise deals close.

## 9. Related Documents

- `docs/SALES_FUNNEL_WORKFLOW.md` — self-serve sibling (14 steps, €1 activation, click-to-buy).
- `DWS_ROLES_REGISTRY.md` — 25 roles, 5 stages, industry variants. Source of truth for stage definitions and door-#1 lookup.
- `INDUSTRIES.md` — 25 EU-regulated industries (canonical registry).
- `dws10.com/config/industries.json` — structured mirror; 16 captain hats with industry clustering.
- `sales-outreach/INTRO_<NAME>_<COMPANY>.md` — per-prospect stakeholder map (one file per active enterprise deal).
- `DWS_TRUTH_STANDARD.md` — §2 row 15 catalogs the role registry; §9 pilots the Skill/Workflow/Roles template that operational standards adopt.
