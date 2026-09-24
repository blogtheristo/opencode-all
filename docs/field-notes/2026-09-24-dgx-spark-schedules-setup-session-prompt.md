<!-- Evidence: Tool=Claude Code Model=claude-sonnet-5 Agent=Claude Code Date=2026-09-24 -->

# Field Note — Ready-to-paste session prompt: finish DGX Spark Temporal activation

## VERSION AND AGENT HISTORY

---

Version: 1.0
Tool: Claude Code (Sonnet 5)
Agent: Claude Code
Date: 2026-09-24
Changes: Initial note — records the exact prompt to hand to a session with real DGX
Spark access to finish Temporal activation (Schedule setup + first live caller).

---

## Author

Claude Code (Sonnet 5) — session `014HZLzKzjyQdn5UFL36CG25`

## Date

2026-09-24

## Location

Espoo, Finland (HIC). Agent: Claude Code cloud session (no DGX Spark route — this note
exists because of that gap).

## Context

Follow-up to PR #2068 (Temporal use cases, merged) and PR #2070 (DGX Spark deployment —
`dws-temporal-postgres`/`dws-temporal` Healthy, `dws-temporal-worker` Started, per
`Admin/ADMIN_MANUAL.md` §"Temporal (DGX Spark self-hosted)"). Two steps from the original
activation plan are still open: the one-time Schedule setup, and wiring/proving a first
live caller. This session cannot run them — no `ssh` binary, no route to the DGX host
(`hostname` here reports `vm`, not `gn100-cb5d`). The prompt below is for whichever
session (OpenCode primary runtime, or a Claude Code session confirmed running directly on
the box — verify via `hostname`/IP match before trusting any such claim, per the pattern
PR #2070 used) actually has that access.

## Ontology Tags

- **Geography:** N/A (internal engineering)
- **Sector:** Internal platform / DevOps
- **Entities:** Temporal.io, DGX Spark (Acer Veriton GN100, `gn100-cb5d`), DWS6 backend
- **Temporal Context:** 2026-Q3, post-deployment, pre-first-live-job
- **Confidence:** High (all referenced commands/files exist and are merged on `main`)

## The Story

`docs/dws-use-cases.md` lists what's left after DGX Spark deployment: `npm run
temporal:schedules:setup` hasn't been run, and nothing yet submits a job to any of the six
task queues — the worker sits idle. `outreach-full` (use case #10) is wired end-to-end in
code and is the natural first live test, gated by `npm run temporal:approve`. Rather than
re-describe these steps informally, this note fixes the exact prompt so the next session
with real access can paste it and go, without re-deriving context this session already has.

## The Insight

Every DGX-dependent step this session has produced so far has needed a dedicated,
self-contained prompt for a _different_ session to execute, because this sandbox
structurally cannot reach the DGX host. Keeping that handoff prompt in the repo (not just
in chat, which the receiving session may not have access to) means it survives session
boundaries the same way `.claude/handoffs/` does — this is effectively a single-purpose
handoff scoped to one remaining task rather than a whole branch.

## Next Steps

1. Hand the prompt below to a session with confirmed DGX Spark access.
2. That session reports back: Schedule created (yes/no), first live job result
   (`outreach-full` run + `temporal:approve` outcome).
3. Once confirmed, `docs/dws-use-cases.md`'s "Not yet done" list for use case #8/#10
   should be updated to reflect it — that's this note's own follow-up, not done here.

## The prompt

```
Finish DGX Spark Temporal activation. PR #2068 shipped the code, PR #2070 deployed the
server (dws-temporal-postgres/dws-temporal Healthy, dws-temporal-worker Started — confirm
this is still true before proceeding, don't assume). Two steps remain, both documented in
docs/dws-use-cases.md and docs/field-notes/2026-09-23-temporal-dgx-spark-wiring-and-cost.md:

1. One-time Schedule setup (idempotent — safe to re-run if unsure whether it already
   happened):
     cd /path/to/dws6   # or wherever the deploy checkout lives, e.g. a worktree
     git fetch origin main && git checkout main && git pull
     npm run temporal:schedules:setup
   This creates the dws-report-schedule-poll Schedule (hourly, 0 * * * *) driving
   reportSchedulePollWorkflow — the cron replacement for
   src/firehorse/report-scheduler.ts. Confirm it was created (check for errors, or query
   the Schedule via Temporal CLI/UI if available).

2. First live caller — outreach-full is already wired end-to-end
   (src/agents/outreach-orchestrator.agent.ts Step 3 →
   src/temporal/workflows/outreach-approval-send.workflow.ts →
   humanApprovalWorkflow). To prove it works against the real server:
   a. Run outreach-full with autoSend=true and toEmail set (small test batch — 1-2
      leads, not a real campaign, this is a smoke test).
   b. Confirm it returns { pendingApproval: { approvalRequestId, workflowId } } instead
      of erroring.
   c. Run: npm run temporal:approve -- <approvalRequestId> --approve --by "<your name>"
   d. Confirm the send actually happens (check outreach_threads status, or SES delivery
      logs) and the Workflow completes with outcome: 'approved'.
   e. Also try the reject path once on a separate test request (--reject) to confirm
      that path doesn't send.

Do NOT wire any other use case's caller into production yet (Stripe webhook route,
BaseAgent.runLoop() cutover, DocuSign starter) — those are deliberately deferred, each
needing its own scoped review per docs/dws-use-cases.md.

Report back honestly: what you could actually verify vs. what you're taking on faith
(e.g. if you can't check SES delivery logs, say so rather than assuming the send worked
because the Workflow returned ok). If DGX access turns out not to be real in this session
either, say so immediately rather than guessing at what the steps would produce.
```
