# Temporal Use Cases for DWS6 — Standalone Activities as Job Queue

Status: PENDING_REVIEW
Date: 2026-09-22
Author: Claude Code (Sonnet 5)
Trigger: HIC-supplied link — https://temporal.io/blog/a-better-job-queue-with-temporal-standalone-activities

## 1. Source claim, verified

Temporal's "standalone activities" (GA since Temporal server 1.25 / SDKs mid-2025) let a
caller execute a single `Activity` directly — retries, timeouts, heartbeats, and history
included — without first authoring a `Workflow` to host it. Positioned as a drop-in
replacement for ad-hoc job queues (BullMQ/Celery/Sidekiq-style) where the durability and
observability of a workflow engine is wanted but the multi-step orchestration is not.
Verified against Temporal's own docs (`Activity Execution` / `Start Activity` API surface
exists in TS, Go, Python SDKs) — no reason to doubt the blog's technical claims. Not
independently benchmarked here.

## 2. Where DWS6 currently rolls its own job queue

Grep across `src/` turns up at least three hand-built, non-durable queues, no shared
abstraction:

| Queue                 | File                                                | Backing store           | Retry/backoff                          | Dead-letter | Observability        |
| --------------------- | --------------------------------------------------- | ----------------------- | -------------------------------------- | ----------- | -------------------- |
| Sales/TED lead queue  | `src/construction-leads/sales-queue.ts`             | Supabase table          | None visible                           | None        | Supabase rows only   |
| Social post scheduler | `src/social-scheduler/queue.ts`                     | Supabase `social_posts` | None (fetch fails → `null`, swallowed) | None        | `logger.warn` only   |
| Cron/scheduled work   | DGX Spark cron + GitHub Actions (per `/cron` skill) | Filesystem/GHA          | Whatever the shell script does         | None        | Manual `cron status` |

Each reimplements the same failure modes a job queue exists to solve: what happens on a
transient Supabase 5xx, a crashed worker mid-send, or a duplicate enqueue. Today the answer
in `queue.ts:37-41` is "log a warning and return null" — the caller has to notice.

## 3. Where standalone activities fit, concretely

Standalone activities are a good fit for **single-step, idempotency-sensitive, externally-
facing calls** DWS6 already has scattered around: SES send, Proton send, DocuSign envelope
creation, Stripe webhook side-effects, TED API polls, social post publish. Each of these is
exactly the shape the Temporal blog targets — one unit of work, needs retry/backoff/timeout,
does not need a multi-step saga.

They are a **poor fit** for the things DWS6 already models as multi-step: `case-run` (Themis
cross-agent coordination), `workflow` skill (multi-agent chaining), `swarm` patterns
(fan-out/tournament/loop-until-done) — those want real Workflows (durable, replayable
history across steps), not standalone Activities. Don't collapse that distinction when
scoping a pilot.

## 4. Cost/ops fit against current stack

- DWS6 runs "DGX-first agentic compute" (Rule 14) and Cloud Run secondary. Temporal needs a
  server (Temporal Cloud, or self-hosted on Postgres) — this is new infrastructure, not a
  library import. Self-hosting Temporal on DGX Spark is plausible (Postgres-backed, single
  binary) and keeps data in the sovereign tier; Temporal Cloud is US-hosted SaaS and would
  need a CLOUD Act exposure check before touching PII (`sovereignty-assess` skill applies).
- Current queues are Supabase-table-based, which is already the source of truth for most
  DWS6 state — a Temporal migration is additive infrastructure, not a replacement for
  Supabase, so the two would coexist (Temporal for execution durability, Supabase for
  record-of-truth rows the dashboard reads).

## 5. Recommendation (research only — no code changed this session)

Do not adopt yet. Candidate pilot, if HIC wants to spend a cycle: replace
`social-scheduler/queue.ts`'s publish step (SES/social API call, already single-purpose)
with one standalone Activity against a self-hosted Temporal-on-DGX-Spark instance, and
compare failure handling/observability against the status quo on 5–10 real posts before
deciding to expand. This matches the Skill Codification Rule's "manual run on 3–10 items
before codifying."

## HIC decision needed

Approve or reject: spend one cycle piloting standalone-activity replacement of the social
post publish step on self-hosted Temporal (DGX Spark), before any wider rollout decision?

## N/A items (Rule 12)

- KB update: N/A — research-only note, no new operational fact for `/kb` yet.
- Calendar entry: N/A — no dated commitment created; pilot is unscheduled pending HIC answer.
