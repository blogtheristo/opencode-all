# Workflow v2 — Chapter Roadmap

Each "chapter" is one procedural graph (`src/agents/workflow-v2/examples/*.graph.json`)
grounded in an existing DWS IQ domain that already has real, error-prone,
long-horizon state — not a new invented workflow. Naming: `Chapter <N>: <Name>`.

Cross-cutting plan (applies across chapters, not one graph):
`docs/workflow-v2-jev-kya-integration-plan.md` — typed, KYA-gated transition
decisions via the existing `kya-jev` primitive (`src/agents/kya-jev.ts`).

## Candidate chapter names

| #   | Name                             | Grounded in (existing code/skill)                                                                       | Why it fits Procedural Graphs                                                                                                                                                                                                                                                                                              |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | **B2B Growth Funnel**            | `b2b-growth-funnel.graph.json` — Research → Strategy → Execution                                        | Done. Campaign-level graph, one layer above Chapter 1: defines ICP/decision-makers, picks channel(s), then hands off individual opportunities into Chapter 1's per-prospect graph at `EXECUTION → CAPTURE_OPPORTUNITY`. Numbered 0 because it sits above Chapter 1, not beside it — Chapter 1 is the first thing it calls. |
| 1   | **Sales Outreach**               | `src/outreach/*` (`OutreachStatus` enum), `sales-outreach/*.md`                                         | Done — `sales-outreach.graph.json`, PR #2059. Hard RED gate at SEND.                                                                                                                                                                                                                                                       |
| 2   | **Investor Outreach**            | `/investor-outreach` skill, `investor-outreach/INTRO_*.md`, SAFE round status field                     | Done — `investor-outreach.graph.json`. Same 15-node shape as Chapter 1 (pipeline retargeted to `/investor-outreach`'s INTRO_*.md templates and CONTACTED/WARM/HOLD status vocabulary), same hard RED gate at SEND, terminal CONVERTED feeds the SAFE round instead of MRR.                                                                                                                                                              |
| 3   | **Compliance Assessment**        | `/compliance-check`, `/workflow compliance-assessment` (emissions → regulatory → viability)             | Done — `compliance-assessment.graph.json`. Keeps the emissions → regulatory → viability backbone and adds the recovery path the DAG lacks: every stage can route to `MISSING_DATA`, where a flagged default must be recorded for disclosure rather than silently substituted. Read-only assessment, so no approval gate. |
| 4   | **Construction Site Assessment** | `/site-safety`, `/carbon-analysis`, `material-oracle`, `schedule-genius`, `/workflow construction-full` | Done — `construction-site-assessment.graph.json`. Sequences the three tracks so the cross-track dependency the parallel fan-out cannot express becomes explicit (a safety-driven worker-capacity cut now reaches `CHECK_SCHEDULE`), plus `STALE_INPUT_RECOVERY` on every measurement stage. Read-only assessment, so no approval gate. |
| 5   | **Content Publishing**           | `/blog-draft`, `docs/BLOG_STANDARD.md` §3.3                                                             | Done — `content-publishing.graph.json`. The strongest generalization proof for the gate pattern: Rule 13's loop (Draft → Show → Approve → Publish) maps onto `HIC_APPROVAL_GATE → PUBLISH`, every revision round re-enters the gate, and `POST_APPROVAL_EDIT` routes back to `DRAFT` instead of republishing. |
| 6   | **Helpdesk Ticket Triage**       | `/helpdesk-triage` (resolve / reply / escalate / refund / upgrade-suggest)                              | Done — `helpdesk-triage.graph.json`. `SEND_REPLY` sits behind `HIC_APPROVAL_GATE` (the agent never sends email); low-confidence / refund / escalate route to a terminal `ESCALATED` state where a human owns the ticket, and a follow-up reply re-enters `TRIAGE` rather than resending on the prior approval. |
| 7   | **KYA Incident Response**        | `/kya` (trust score, IJS, leash snap)                                                                   | Done — `kya-incident-response.graph.json`, built jointly with Phase 1 of `docs/workflow-v2-jev-kya-integration-plan.md`. `ASSESS_TRUST` routes on the IJS table (Sovereign/Compliant/Partial/Exposed); `SNAP_EXECUTE` (the real TC-4 leash snap) is reachable only via `SNAP_DRY_RUN -> SNAP_CONFIRM`, the same structural pattern as `HIC_APPROVAL_GATE -> SEND` in Chapter 1. |
| 8   | **Case Coordination (Themis)**   | `/case-run`                                                                                             | Done — `case-coordination.graph.json`. Holds an open case across events via `AWAIT_NEXT_EVENT → DISPATCH_AGENTS` (re-entry, not restart), makes a partial agent set an explicit `AGENT_FAILURE` state instead of a silently short report, and gates HIGH-risk actions (`approval_required`) behind `HIC_APPROVAL_GATE → EXECUTE_ACTION`. |

**Status (2026-09-22):** all nine chapters (0–8) are shipped. The pattern
generalized across five distinct domains without changing the engine: outreach
(1, 2), assessment (3, 4), publishing (5), support (6), safety (7) and
coordination (8).

Two findings worth keeping:

- **Not every chapter needs a gate.** Chapters 3 and 4 are read-only assessments
  that issue no outbound action, so they carry no `HIC_APPROVAL_GATE`. Adding one
  would have been cargo-culting the pattern rather than applying it.
- **The gate node id is the contract.** Chapters 1, 2, 5, 6 and 8 all reuse the
  literal node id `HIC_APPROVAL_GATE`, which `DEFAULT_GATED_NODE_IDS` in
  `runner.ts` already enforces in code — so each new chapter inherited runtime
  approval enforcement for free, with no engine change. Chapter 7 uses its own
  `SNAP_CONFIRM` gate because a leash snap is confirmed, not drafted-and-approved.

Every gated action is covered by a table-driven test asserting it is structurally
unreachable except through its gate (`src/__tests__/agents/workflow-v2.test.ts`,
"gated actions are structurally unreachable except through their gate").

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

1. All chapters 0–8 are shipped as graphs. The open question is no longer *which
   chapter* but *which chapter to run for real first* — that needs the Mission
   Control / Admin dashboard surfaces plus the `workflow_v2_runs` table below.
2. Confirm the Mission Control / Admin dashboard split above, so the
   `workflow_v2_runs` migration can be scoped correctly on the next pass.
