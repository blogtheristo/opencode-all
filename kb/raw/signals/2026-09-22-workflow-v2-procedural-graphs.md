# Workflow v2 — Procedural Graphs for long-horizon agents (Chapters 0–8)

**PR Link:** https://github.com/blogtheristo/dws6/pull/2059
**Branch:** `claude/workflow-v2-procedural-graphs-k2324l`
**Date:** 2026-09-22
**Status:** Open PR
**Field Note:** `docs/field-notes/2026-09-22-workflow-v2-procedural-graphs-nine-chapters.md`

## Summary

Implemented the "Procedural Graphs" pattern in `src/agents/workflow-v2/`: long-horizon
agent tasks track their state in an explicit, externally-persisted graph instead of
conversational memory. Executor role restricted to declared edges (runtime error on any
other transition); Refiner role rewrites the graph from execution traces. Nine domain
graphs shipped (Chapters 0–8).

## Key Work

- **Engine:** `types.ts`, `graph.ts`, `prompts.ts`, `runner.ts` — graph validation,
  transition enforcement, both role prompts, trace checkpointing. Reuses existing
  `LLMClient`, no new provider wiring.
- **Approval gate:** `ApprovalToken` / `computeApprovalHash` / `ApprovalRequiredError` —
  SHA-256 binds a human approval to the exact draft text plus graph/edge, so an approval
  cannot be replayed against a different draft. Enforces the RED-zone outbound-email rule
  in code rather than in a prompt.
- **Phase 1 (kya-jev):** `runExecutorStepTyped()` routes transitions through the existing
  `kya-jev` typed-decision primitive — a graph run now requires a signed KYA verdict to
  make any transition decision, and yields per-option probabilities for the Refiner.
- **Nine chapters:** B2B growth funnel (0), sales outreach (1), investor outreach (2),
  compliance assessment (3), construction site assessment (4), content publishing (5),
  helpdesk triage (6), KYA incident response (7), case coordination (8).

## Signals

- **Convergent discovery:** `DWS7_ROADMAP.md` Phase 4.1 had independently scoped the same
  problem months earlier (PR 138 Temporal.io orchestration, PR 146 human-in-the-loop
  approval), and Google Cloud's GITEX AI Türkiye framing named the same goals. Two
  unconnected sources on one problem shape = market-timing signal, captured as PhD
  Key Contribution #60 (`PHD_FIREHORSE_EN/FI` §14.54).
- **Gate node id as contract:** reusing the literal node id `HIC_APPROVAL_GATE` across
  chapters 1/2/5/6/8 meant each inherited runtime approval enforcement from
  `DEFAULT_GATED_NODE_IDS` with no engine change — an emergent property, not a designed one.
- **Read-only chapters need no gate:** Chapters 3 and 4 issue no outbound action; adding a
  gate would have been cargo-culting the pattern.

## Technical Details

- Files: `src/agents/workflow-v2/**`, `src/agents/workflow-v2/examples/*.graph.json`
- Tests: `src/__tests__/agents/workflow-v2.test.ts` — 51/51, deterministic and offline;
  gate tests verified non-vacuous by a temporary sabotage that failed 2 tests.
- Docs: `docs/workflow-v2-chapters-roadmap.md`,
  `docs/workflow-v2-sales-outreach-chapter-one.md`,
  `docs/workflow-v2-jev-kya-integration-plan.md`
- Thesis: V3Thesis_EN/FI §10.34, PHD_FIREHORSE_EN/FI §14.54 + KC #60 (lockstep v4.12)
- Roadmap: `DWS7_ROADMAP.md` v1.7.2 Phase 4.1 cross-references
- Admin: `Admin/ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md` v1.1 §11 (audit-trail view spec)

## Open

No chapter has been run for real. Blocked on the Mission Control approval queue and a
`workflow_v2_runs` Supabase table (`persistTrace()` writes local JSON today, which no web
dashboard can read). Applying that migration is RED-zone / HIC.
