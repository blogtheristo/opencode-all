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
| 2   | **Investor Outreach**            | `/investor-outreach` skill, `investor-outreach/INTRO_*.md`, SAFE round status field                     | Near-identical shape to Chapter 1 (WARM → CONTACTED → ... → CLOSED), same RED-zone email gate. Cheapest next chapter — mostly a relabel of Chapter 1's graph.                                                                                                                                                              |
| 3   | **Compliance Assessment**        | `/compliance-check`, `/workflow compliance-assessment` (emissions → regulatory → viability)             | Already a multi-agent DAG in `mcp-hub/workflows.py`; a procedural graph adds the missing "what if a step's data is missing/wrong" recovery paths the DAG doesn't model today.                                                                                                                                              |
| 4   | **Construction Site Assessment** | `/site-safety`, `/carbon-analysis`, `material-oracle`, `schedule-genius`, `/workflow construction-full` | Multi-agent fan-out today with no explicit error-recovery graph; weather/crane-risk inputs can be stale or missing mid-run.                                                                                                                                                                                                |
| 5   | **Content Publishing**           | `/blog-draft`, `docs/BLOG_STANDARD.md` §3.3                                                             | Already has its own hard RED gate (HIC must read full text before publish) — same pattern as Chapter 1's `HIC_APPROVAL_GATE`, different domain. Good proof that the gate pattern generalizes.                                                                                                                              |
| 6   | **Helpdesk Ticket Triage**       | `/helpdesk-triage` (resolve / reply / escalate / refund / upgrade-suggest)                              | Decision-tree shaped already; graph would make the escalation criteria explicit and auditable instead of one LLM judgment call.                                                                                                                                                                                            |
| 7   | **KYA Incident Response**        | `/kya` (trust score, IJS, leash snap)                                                                   | Done — `kya-incident-response.graph.json`, built jointly with Phase 1 of `docs/workflow-v2-jev-kya-integration-plan.md`. `ASSESS_TRUST` routes on the IJS table (Sovereign/Compliant/Partial/Exposed); `SNAP_EXECUTE` (the real TC-4 leash snap) is reachable only via `SNAP_DRY_RUN -> SNAP_CONFIRM`, the same structural pattern as `HIC_APPROVAL_GATE -> SEND` in Chapter 1. |
| 8   | **Case Coordination (Themis)**   | `/case-run`                                                                                             | Multi-agent, multi-deadline coordination across domains — the clearest "long-horizon, don't trust chat memory" case in the whole skill list.                                                                                                                                                                               |

**Recommendation:** Chapter 2 = Investor Outreach next. It reuses Chapter 1's
graph almost unchanged (swap `OutreachPipeline: 'customer'` for `'investor'`,
swap templates), so it's the fastest way to prove the pattern generalizes
before investing in a harder domain like Chapter 3 or 8.

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

1. The `runner.ts` approval-hash gate (flagged in the Chapter 1 scope doc) —
   the queue item's "approve" action needs something real to call.
2. A decision on where `ExecutionTrace` files persist for a web dashboard to
   read (currently `persistTrace()` writes local JSON; a web-visible surface
   needs Supabase, not a local file — likely a new `workflow_v2_runs` table
   following the same grant/RLS pattern as `outreach_threads`).

## HIC decision needed

1. Confirm Chapter 2 = Investor Outreach (or pick a different one from the table).
2. Confirm the Mission Control / Admin dashboard split above, so the
   `workflow_v2_runs` migration can be scoped correctly on the next pass.
