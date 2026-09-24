# Workflow v2 — Chapter Roadmap

Each "chapter" is one procedural graph (`src/agents/workflow-v2/examples/*.graph.json`)
grounded in an existing DWS IQ domain that already has real, error-prone,
long-horizon state — not a new invented workflow. Naming: `Chapter <N>: <Name>`.

Cross-cutting plan (applies across chapters, not one graph):
`docs/workflow-v2-jev-kya-integration-plan.md` — typed, KYA-gated transition
decisions via the existing `kya-jev` primitive (`src/agents/kya-jev.ts`).

## Candidate chapter names

| #   | Name                                   | Grounded in (existing code/skill)                                                                                                           | Why it fits Procedural Graphs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0   | **B2B Growth Funnel**                  | `b2b-growth-funnel.graph.json` — Research → Strategy → Execution                                                                            | Done. Campaign-level graph, one layer above Chapter 1: defines ICP/decision-makers, picks channel(s), then hands off individual opportunities into Chapter 1's per-prospect graph at `EXECUTION → CAPTURE_OPPORTUNITY`. Numbered 0 because it sits above Chapter 1, not beside it — Chapter 1 is the first thing it calls.                                                                                                                                                                                               |
| 1   | **Sales Outreach**                     | `src/outreach/*` (`OutreachStatus` enum), `sales-outreach/*.md`                                                                             | Done — `sales-outreach.graph.json`, PR #2059. Hard RED gate at SEND.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2   | **Investor Outreach**                  | `/investor-outreach` skill, `investor-outreach/INTRO_*.md`, SAFE round status field                                                         | Done — `investor-outreach.graph.json`. Same 15-node shape as Chapter 1 (pipeline retargeted to `/investor-outreach`'s INTRO\_\*.md templates and CONTACTED/WARM/HOLD status vocabulary), same hard RED gate at SEND, terminal CONVERTED feeds the SAFE round instead of MRR.                                                                                                                                                                                                                                             |
| 3   | **Compliance Assessment**              | `/compliance-check`, `/workflow compliance-assessment` (emissions → regulatory → viability)                                                 | Done — `compliance-assessment.graph.json`. Keeps the emissions → regulatory → viability backbone and adds the recovery path the DAG lacks: every stage can route to `MISSING_DATA`, where a flagged default must be recorded for disclosure rather than silently substituted. Read-only assessment, so no approval gate.                                                                                                                                                                                                 |
| 4   | **Construction Site Assessment**       | `/site-safety`, `/carbon-analysis`, `material-oracle`, `schedule-genius`, `/workflow construction-full`                                     | Done — `construction-site-assessment.graph.json`. Sequences the three tracks so the cross-track dependency the parallel fan-out cannot express becomes explicit (a safety-driven worker-capacity cut now reaches `CHECK_SCHEDULE`), plus `STALE_INPUT_RECOVERY` on every measurement stage. Read-only assessment, so no approval gate.                                                                                                                                                                                   |
| 5   | **Content Publishing**                 | `/blog-draft`, `docs/BLOG_STANDARD.md` §3.3                                                                                                 | Done — `content-publishing.graph.json`. The strongest generalization proof for the gate pattern: Rule 13's loop (Draft → Show → Approve → Publish) maps onto `HIC_APPROVAL_GATE → PUBLISH`, every revision round re-enters the gate, and `POST_APPROVAL_EDIT` routes back to `DRAFT` instead of republishing.                                                                                                                                                                                                            |
| 6   | **Helpdesk Ticket Triage**             | `/helpdesk-triage` (resolve / reply / escalate / refund / upgrade-suggest)                                                                  | Done — `helpdesk-triage.graph.json`. `SEND_REPLY` sits behind `HIC_APPROVAL_GATE` (the agent never sends email); low-confidence / refund / escalate route to a terminal `ESCALATED` state where a human owns the ticket, and a follow-up reply re-enters `TRIAGE` rather than resending on the prior approval.                                                                                                                                                                                                           |
| 7   | **KYA Incident Response**              | `/kya` (trust score, IJS, leash snap)                                                                                                       | Done — `kya-incident-response.graph.json`, built jointly with Phase 1 of `docs/workflow-v2-jev-kya-integration-plan.md`. `ASSESS_TRUST` routes on the IJS table (Sovereign/Compliant/Partial/Exposed); `SNAP_EXECUTE` (the real TC-4 leash snap) is reachable only via `SNAP_DRY_RUN -> SNAP_CONFIRM`, the same structural pattern as `HIC_APPROVAL_GATE -> SEND` in Chapter 1.                                                                                                                                          |
| 8   | **Case Coordination (Themis)**         | `/case-run`                                                                                                                                 | Done — `case-coordination.graph.json`. Holds an open case across events via `AWAIT_NEXT_EVENT → DISPATCH_AGENTS` (re-entry, not restart), makes a partial agent set an explicit `AGENT_FAILURE` state instead of a silently short report, and gates HIGH-risk actions (`approval_required`) behind `HIC_APPROVAL_GATE → EXECUTE_ACTION`.                                                                                                                                                                                 |
| 9   | **Learning Outcome (Learn gate)**      | `DWS_LEARNING_STANDARD`, `.claude/hooks/session-stop.sh`                                                                                    | Done — `learning-outcome.graph.json`. Reflexive: the only chapter whose subject is the agent's own session, not a customer domain. Its gate is a **completion** gate, not an approval gate — nothing outbound is authorized, but `SESSION_END` is unreachable until a field note or `Learn/` HTML dated today exists (hook check H3) or a recorded exemption is in place. Models all three escape hatches and notes that they differ in auditability: the env-var opt-out leaves no repo-side record and is the weakest. |
| 10  | **Content Refinement Chain**           | HIC content strategy 24.09.2026 (`docs/proposals/2026-09-24-lifetime-fi-tulossivu-ehdotus.md` §10–§12), `content-pipeline` v1               | Done — `content-refinement-chain.graph.json`. One dws10.com hub page → lifetime.fi conclusion (WHY) → Journal deep text (UNDERSTAND) → social → translations → event → product link (BUY) → register row. Gate at `PUBLISH_JOURNAL` (Rule 13). `PUBLISH_FAILED` re-enters through the gate, never around it (the table-driven test caught the first draft doing exactly that). Parent of 11, 12, 13.                                                                                                                     |
| 11  | **Social Distribution**                | `src/social-scheduler/*`, `social_posts`, `publishSocialPostActivity` (Temporal #3), `approval-digest.ts`                                   | Done — `social-distribution.graph.json`. Weekly digest approval, gate at `SCHEDULE`; LinkedIn without an API adapter is delivered as a ready-to-paste block and marked manual, never skipped; `MEASURE` feeds comments back to Chapter 14 as observations.                                                                                                                                                                                                                                                               |
| 12  | **Translation Fan-out**                | `/multilingual`, `BLOG_STANDARD` §3.2.1, language folders fi/sv/en/de/fr                                                                    | Done — `translation-fanout.graph.json`. One run per language; stale-source detection by hash; lighter approval (translation, not content) but still a gate at `PUBLISH` — approval of the Finnish original is not approval of the Swedish text.                                                                                                                                                                                                                                                                          |
| 13  | **Seminar & Event**                    | Google Calendar/Meet, `sendEmailActivity` + hard rules (Temporal #1, #12), onelifetime.world/seminars                                       | Done — `seminar-event.graph.json`. Invitations gated at `SEND_INVITATIONS`; `AWAIT_EVENT` is a durable re-entry node; personalised follow-up re-enters the gate; interested participants are handed to Chapters 1/2, never sold to from here.                                                                                                                                                                                                                                                                            |
| 14  | **Observation & Market Signal Intake** | `docs/market-signals/` registry (new), Supabase `market_signals`, `signal-detector` skill, construction-leads / regulatory / Hilma packages | Done — `observation-market-signal-intake.graph.json`. Rung 0–1 of the ladder. Separates Reality / Observation / Market Signal / Hypothesis / Decision; gate at `DISPATCH_IMPACTS`; `REFINE_WORKFLOWS` hands accepted signals to the Refiner; status `implemented` only when every dispatched run is done, so the registry records impact, not just signals. First entry: `MS-2026-09-001` (customers buy a worldview, not a product description → role model v1.5).                                                      |

**Status (2026-09-24):** fifteen chapters (0–14) are shipped as graphs; 10–14 added 24.09.2026 from the content-strategy session.

**Status (2026-09-22):** all ten chapters (0–9) were shipped. The pattern
generalized across six distinct domains without changing the engine: outreach
(1, 2), assessment (3, 4), publishing (5), support (6), safety (7),
coordination (8) and the agent's own close-out process (9).

Two findings worth keeping:

- **Not every chapter needs a gate.** Chapters 3 and 4 are read-only assessments
  that issue no outbound action, so they carry no `HIC_APPROVAL_GATE`. Adding one
  would have been cargo-culting the pattern rather than applying it.
- **Gates come in three shapes, not one.** _Approval_ (chapters 1, 2, 5, 6, 8 —
  a human authorizes an outbound action), _confirmation_ (chapter 7 — a
  destructive action is confirmed, not drafted-and-approved), and _completion_
  (chapter 9 — nothing is authorized, but the work cannot be declared finished
  until an artefact exists). Only the first shape is what `HIC_APPROVAL_GATE`
  means; conflating the three would have produced a wrong graph for 7 and 9.
- **The gate node id is the contract.** Chapters 1, 2, 5, 6 and 8 all reuse the
  literal node id `HIC_APPROVAL_GATE`, which `DEFAULT_GATED_NODE_IDS` in
  `runner.ts` already enforces in code — so each new chapter inherited runtime
  approval enforcement for free, with no engine change. Chapter 7 uses its own
  `SNAP_CONFIRM` gate because a leash snap is confirmed, not drafted-and-approved.

Every gated action is covered by a table-driven test asserting it is structurally
unreachable except through its gate (`src/__tests__/agents/workflow-v2.test.ts`,
"gated actions are structurally unreachable except through their gate").

## The refinement ladder (HIC, 2026-09-24)

Workflow v2 does not start at rung 1. It starts at 0:

```
Reality → Observation → Market Signal → Insight → Decision → Action → Outcome
→ Evidence → Ontology/KB update → Learning → Improved Observation (→ Reality …)
```

It is a loop, not a line. Concretely for the weekly construction package:

```
Leads arrive → Observation registry → Evidence → Insight → Ontology/KB
("construction buys competitiveness, not compliance")
→ the NEXT construction lead is already assessed against that knowledge
```

HIC diagnosis: rungs 3–4 are strong (theses, whitepapers, ontologies, hubs). Rung 1 was not in
the operative workflow — the HIC was the system's only sense organ, and market signals changed
the system only when the HIC bypassed the v1 workflows by hand. Chapter 14 and
`docs/market-signals/` make rungs 0–2 explicit; Chapter 10 carries 3–7 across the One Lifetime
layers (dws10.com hubs = 2–3, onelifetime.world = 4, lifetime.fi = 5, HIC gate = 6, dws10.com
products/buy = 7); Chapter 11 `MEASURE` and Chapter 14 `EVALUATE`/`LEARN` close 8–10 together
with Chapter 9. Node descriptions in 10–14 carry their `Stage:` tag so the Refiner and the
dashboard can group by rung without an engine change.

## Pipeline view — the HIC's control panel, not a register (HIC + Copilot, 2026-09-24)

The Admin dashboard must answer four questions at one glance, in this order, and let the HIC
click any row through to its impact: **What does the market say? → What do we believe? → What
did we change? → Did it work?** A view that only lists signals, insights and evidence is a better
register, not a better control panel. Today a weekly construction-lead package arrives; the
system sees "27 leads" while the HIC sees "NIS2 interests more than CSRD; construction talks
about documentation, not emissions; small players fear tenders more than reporting". Those are
observations, not leads, and they are what disappears.

| Block              | Question                              | Rows (source)                                                                                                                                                                   | HIC action                                                       |
| ------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Reality**        | What is observed right now?           | counts per feed this week: construction leads, energy leads, compliance requests, lost opportunities, customer interviews (Supabase tables + `market_signals`)                  | open feed; capture an observation from it (Chapter 14 `CAPTURE`) |
| **Observations**   | What has the HIC / an agent noticed?  | `docs/market-signals/*.md` with status `observed` or `signal`: observation sentence, observer, age                                                                              | classify; formulate signal                                       |
| **Active signals** | Which observations are strengthening? | signals with `occurrences`, confidence and trend (↑/↓ over 4 weeks); e.g. sustainability → competitive edge, sovereignty → rising, impact data → rising                         | promote to strategic insight; merge duplicates                   |
| **Decisions**      | What did we decide to do?             | Chapter 14 runs at/after `HIC_APPROVAL_GATE`: insight, decision name, affected domains                                                                                          | accept / defer / reject; open the hypothesis                     |
| **Impact**         | Where does the decision show?         | the `impact:` rows of each accepted signal: target × status (lifetime.fi done, Journal in progress, LinkedIn not started, Meta not started, buy done) + Chapter 10–13 run nodes | open the chain run; approve a paused draft; reprioritise         |
| **Did it work?**   | Outcome and learning                  | Chapter 11 `MEASURE`, Chapter 14 `EVALUATE`: contacts by source, confirmed / refuted, revenue impact where known                                                                | close signal; send to Refiner                                    |

Header counters, so the whole pipe is one line: `Reality observed 42 · Signals accepted 17 ·
Hypotheses active 9 · Insights validated 4 · Workflow changes 3 · Content updates 8 · Offer
updates 2 · Revenue impact ?`.

**Traceability requirement (architecture, not a feature):** every market signal must be
traceable to impact end to end: Construction signal → Observation → Insight → Decision → Content
→ Product → Revenue. The `signal_id` is the join key across the registry file, Chapter 10–13
traces, the register row, UTM parameters on published content and the product link. If a row
cannot be clicked through to revenue (or to "no revenue yet"), that part of the pipe is still
in the HIC's head.

**Three rooms, not one panel.** Reality = Control Room (operational: what is happening now). Observations, active signals, decisions = Situation Room (strategic: what have we learned). Ontology KB = learning view (how the world model changed: old assumption → new observation → evidence → status validated). The registry's `*_at` fields make every row a temporal record, so any phenomenon can be read in time; that is a Temporal use case (`docs/dws-use-cases.md` #13/#14), and the dashboard is the first true pipe transparency. The step after this is Ontology KB receiving validated insights automatically (`KB_UPDATE`) so the Lifetime World Model changes from them.

Data contract: `GET /api/v1/backoffice/pipeline` (behind `requireBackofficeAdmin`) returns
the six blocks and the counters; the first implementation reads the registry front matter and
local traces (`src/agents/workflow-v2/pipeline.ts`), the durable version reads
`workflow_v2_runs`. Writes go through the approval-hash gate so a dashboard click is the same
audited decision as the CLI. Mission Control keeps the act-now queue; Admin gets this pipe.
First real run: Chapter 14 fed weekly by the construction-lead package.

## Placement decision (HIC, 2026-09-21)

Workflow v2 chapter runs — specifically anything sitting at a
`HIC_APPROVAL_GATE`-style node — **must surface on Mission Control and the
Admin dashboard**, not just as CLI output or a JSON trace file on disk.

- **Mission Control** (`dws6.com/dashboard/mission-control/mission-control.js`,
  mirrored in `landing-pages/dws6-com/dashboard/mission-control/`) already has
  the right shape for this: `CENTRES` (Investor / Partnership / Sales Centre),
  a shared queue, and `HIC_ACTIONS` ("Meeting / call", "Provision demo",
  "Close or kill", etc.). A graph paused at its approval gate is the same
  primitive as an existing Mission Control queue item — it needs one more
  `HIC_ACTIONS` entry (`approve_draft` / `reject_draft`) and a queue item shape
  carrying `{ graphName, runId, currentNode, draftText }`.
- **Admin dashboard** (`Admin/ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md`) is where the
  trace/audit view belongs — full `ExecutionTrace` history per run (which
  Refiner edits were applied, which runs succeeded/failed), not the
  in-the-moment approval action. Mission Control is the "act now" surface,
  Admin dashboard is the "audit after" surface. Same data (`ExecutionTrace`,
  `persistTrace`/`loadTrace` in `runner.ts`), two different views.

This is a placement decision, not yet implemented. Building it depends on:

1. ~~The `runner.ts` approval-hash gate~~ — **done**: `ApprovalToken` /
   `computeApprovalHash` / `ApprovalRequiredError` in `runner.ts`. The queue
   item's "approve" action now has something real to call.
2. A decision on where `ExecutionTrace` files persist for a web dashboard to
   read (currently `persistTrace()` writes local JSON; a web-visible surface
   needs Supabase, not a local file — likely a new `workflow_v2_runs` table
   following the same grant/RLS pattern as `outreach_threads`).

## HIC decision needed

1. All chapters 0–14 are shipped as graphs. Proposal: run Chapter 14 first, fed by the
   weekly construction-lead package, with the Admin dashboard pipeline view above as its
   surface — that needs the `workflow_v2_runs` table and the `/pipeline` endpoint.
2. Confirm the Mission Control / Admin dashboard split above, so the
   `workflow_v2_runs` migration can be scoped correctly on the next pass.
