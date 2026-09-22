<!-- Evidence: Tool=Claude Code Model=claude-sonnet-5 Agent=Claude Code Date=2026-09-24 -->

# Temporal Use Cases for DWS6 — Standalone Activities as Job Queue

## VERSION AND AGENT HISTORY

---

Version: 1.1
Tool: Claude Code (Sonnet 5)
Agent: Claude Code
Date: 2026-09-24
Changes: Addressed 4 unresolved Copilot review findings on PR #2068 — corrected the
publish-boundary claim (queue.ts has no publish step; publishing lives in
facebook-publisher.ts/x-publisher.ts, and no worker currently calls
getApprovedPosts()), added an explicit idempotency-key gate to the pilot
recommendation, corrected "non-durable queues" to the more precise "durable storage,
no durable execution/retry/dead-letter," and added the required field-note structure
(Author, Location, Context, Ontology Tags, The Story, The Insight, Next Steps) this
file was missing on first publish.

Version: 1.0 [not latest]
Tool: Claude Code (Sonnet 5)
Agent: Claude Code
Date: 2026-09-22
Changes: Initial research note evaluating Temporal's Standalone Activities pattern
against DWS6's hand-rolled queues, per HIC-supplied blog link.

---

## Author

Claude Code (Sonnet 5) — session `014HZLzKzjyQdn5UFL36CG25`

## Date

2026-09-22 (v1.0), revised 2026-09-24 (v1.1)

## Location

Espoo, Finland (HIC). Agent: Claude Code cloud session.

## Context

DWS6 backend engineering — job-queue/durable-execution architecture. Trigger: HIC-supplied
link, https://temporal.io/blog/a-better-job-queue-with-temporal-standalone-activities.
Follow-up work across this PR built out `src/temporal/` substantially beyond this note's
original research-only scope — see `docs/dws-use-cases.md` for the full, current picture;
this file stays as the dated record of the initial research turn.

## Ontology Tags

- **Geography:** N/A (internal engineering)
- **Sector:** Internal platform / DevOps
- **Entities:** Temporal.io, DWS6 backend, Supabase, DGX Spark
- **Temporal Context:** 2026-Q3, pre-DGX-Spark-deployment
- **Confidence:** High on codebase claims (grepped/read source); medium on Temporal's own
  behavior claims (verified against docs, not independently benchmarked)

## The Story

### 1. Source claim, verified

Temporal's "standalone activities" (GA since Temporal server 1.25 / SDKs mid-2025) let a
caller execute a single `Activity` directly — retries, timeouts, heartbeats, and history
included — without first authoring a `Workflow` to host it. Positioned as a drop-in
replacement for ad-hoc job queues (BullMQ/Celery/Sidekiq-style) where the durability and
observability of a workflow engine is wanted but the multi-step orchestration is not.
Verified against Temporal's own docs (`Activity Execution` / `Start Activity` API surface
exists in TS, Go, Python SDKs) — no reason to doubt the blog's technical claims. Not
independently benchmarked here.

### 2. Where DWS6 currently rolls its own job queue

Grep across `src/` turns up at least three hand-built queues, no shared abstraction. Their
rows are durable (Supabase-backed) — what's missing is durable _execution_: retry,
claim/dead-letter, and cross-restart resumption of an in-flight job, not storage:

| Queue                 | File                                                     | Backing store           | Retry/backoff                          | Dead-letter | Observability        |
| --------------------- | -------------------------------------------------------- | ----------------------- | -------------------------------------- | ----------- | -------------------- |
| Sales/TED lead queue  | `src/construction-leads/sales-queue.ts`                  | Supabase table          | None visible                           | None        | Supabase rows only   |
| Social post scheduler | `src/social-scheduler/queue.ts` (state only — see below) | Supabase `social_posts` | None (fetch fails → `null`, swallowed) | None        | `logger.warn` only   |
| Cron/scheduled work   | DGX Spark cron + GitHub Actions (per `/cron` skill)      | Filesystem/GHA          | Whatever the shell script does         | None        | Manual `cron status` |

**Correction from v1.0** (Copilot review finding): `src/social-scheduler/queue.ts` only
reads/writes the `social_posts` table (`enqueueDraft`, `getPendingDrafts`,
`getApprovedPosts`, `updatePostStatus`) — it has no publish step. The actual platform
calls live in `facebook-publisher.ts` (`publishToFacebook`) and `x-publisher.ts`
(`publishToX`). At the time of this note, grepping the codebase found no worker or
scheduled job invoking `getApprovedPosts()` — the queue table exists but nothing consumes
it yet. Any pilot targeting "the social publish step" means wrapping
`publishToFacebook`/`publishToX` directly, and building the claim/consume loop, not
replacing a publish step in `queue.ts` that doesn't exist. (This gap is exactly what the
later `src/temporal/starters/social.starter.ts` — built later in this same PR — fills:
`startSocialPublishJob` wraps `publishSocialPostActivity`, which itself wraps
`publishToFacebook`/`publishToX` directly.)

Each of these reimplements the same failure modes a job queue exists to solve: what
happens on a transient Supabase 5xx, a crashed worker mid-send, or a duplicate enqueue.
Today the answer in `queue.ts:37-41` is "log a warning and return null" — the caller has
to notice.

### 3. Where standalone activities fit, concretely

Standalone activities are a good fit for **single-step, idempotency-sensitive,
externally-facing calls** DWS6 already has scattered around: SES send, Proton send,
DocuSign envelope creation, Stripe webhook side-effects, TED API polls, social post
publish. Each of these is exactly the shape the Temporal blog targets — one unit of work,
needs retry/backoff/timeout, does not need a multi-step saga.

**Idempotency is not automatic from retries alone** (Copilot review finding): a retried
Activity only avoids duplicating the _external_ side effect if the call itself carries a
stable idempotency key the receiving system (SES, the social platform's API, DocuSign)
can dedupe on, or if the Activity ID is used with an appropriate Conflict/Reuse Policy so
Temporal itself refuses a second concurrent submission for the same logical job. Neither
`publishToFacebook`/`publishToX` nor DocuSign's envelope creation carries a
caller-supplied idempotency key today — a naive retry-on-timeout could duplicate a post or
envelope. **Any pilot must treat a stable idempotency key (or an explicit
dedup/claim record) as a gate, not an afterthought.** (Resolved in this PR's later work:
`src/temporal/ticket-id.ts`'s `ticketId(domain, businessKey)` convention plus each
starter's `idConflictPolicy`/`idReusePolicy` defaults give every Standalone Activity built
so far exactly this — see `docs/dws-use-cases.md`'s named-ticket addendum.)

They are a **poor fit** for the things DWS6 already models as multi-step: `case-run`
(Themis cross-agent coordination), `workflow` skill (multi-agent chaining), `swarm`
patterns (fan-out/tournament/loop-until-done) — those want real Workflows (durable,
replayable history across steps), not standalone Activities. Don't collapse that
distinction when scoping a pilot.

### 4. Cost/ops fit against current stack

- DWS6 runs "DGX-first agentic compute" (Rule 14) and Cloud Run secondary. Temporal needs
  a server (Temporal Cloud, or self-hosted on Postgres) — this is new infrastructure, not
  a library import. Self-hosting Temporal on DGX Spark is plausible (Postgres-backed,
  single binary) and keeps data in the sovereign tier; Temporal Cloud is US-hosted SaaS
  and would need a CLOUD Act exposure check before touching PII (`sovereignty-assess`
  skill applies).
- Current queues are Supabase-table-based, which is already the source of truth for most
  DWS6 state — a Temporal migration is additive infrastructure, not a replacement for
  Supabase, so the two would coexist (Temporal for execution durability, Supabase for
  record-of-truth rows the dashboard reads).

## The Insight

Standalone Activities close a real, specific gap — durable retry/claim/dead-letter for
single-step external calls DWS6 already makes — without requiring the heavier Workflow
authoring model DWS6's multi-agent orchestration genuinely needs elsewhere. The gap is
execution durability, not storage durability (DWS6's Supabase-backed queues already have
the latter). Where this note's originally-proposed pilot target (`social-scheduler`) got
the specific file boundary wrong, the underlying use case was still correct — later work
in this PR built the corrected version directly against the real publish calls.

## Next Steps

1. ~~Approve or reject: spend one cycle piloting standalone-activity replacement of the
   social post publish step on self-hosted Temporal (DGX Spark)~~ — superseded: this PR's
   later commits already built and tested that pilot (`src/temporal/starters/social.starter.ts`)
   plus five more use cases. See `docs/dws-use-cases.md` for current status and the live
   HIC decision points (DGX Spark server activation, which cutover to wire next).
2. Review/merge this PR.

## N/A items (Rule 12)

- KB update: N/A at v1.0 (research-only). Superseded by `docs/dws-use-cases.md`, which
  should be the `/kb` source once DGX Spark Temporal is live and a first workflow runs.
- Calendar entry: N/A — no dated commitment; see `docs/dws-use-cases.md` for the live
  HIC decision points this note's Next Steps now point to.
