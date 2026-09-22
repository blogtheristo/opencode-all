# DWS6 Use Cases for Temporal (Standalone Activities + Workflows)

Status: PENDING_REVIEW
Date: 2026-09-22
Author: Claude Code (Sonnet 5)
Source: `docs/field-notes/2026-09-22-temporal-use-cases.md` (initial research), expanded per
HIC request to gather every candidate use case across the DWS6 codebase.

Format per use case: **Current tech → Gaps → Proposed solution**.

---

## 1. Transactional email delivery (SES/Proton send)

- **Current tech:** `src/utils/send-email.ts` (SMTP/SES direct, per-message) plus
  `src/services/email-queue.service.ts` (Redis Streams outbox, consumer group
  `email-workers`, DLQ `email:dead-letters`, max 3 retries, fallback to direct send when
  Redis is down).
- **Gaps:** Two parallel send paths (direct vs. queued) with different guarantees; Redis
  Streams retry is a fixed count with no exponential backoff or heartbeat visibility into a
  stuck consumer; DLQ recovery is manual; no single place to see "this email is retry 2 of 3,
  next attempt in 40s."
- **Proposed solution:** Replace the Redis Streams outbox with one standalone Activity per
  send (`sendEmailActivity`), configured with Temporal's built-in retry policy
  (exponential backoff, max attempts, non-retryable-error classification for hard bounces).
  Drop the custom consumer-group/DLQ code; Temporal's activity history is the DLQ. Keep
  Redis only if sub-100ms enqueue latency is required elsewhere.

## 2. Sales/TED lead queue

- **Current tech:** `src/construction-leads/sales-queue.ts` — Supabase-table-backed queue,
  live TED API pull or stored rows, no queue engine.
- **Gaps:** No retry on TED API failure (single `fetch`, error propagates to caller); no
  idempotency guard against re-inserting the same TED notice on a re-run; no
  visibility into partial failures across a batch of leads.
- **Proposed solution:** One standalone Activity per TED notice ingestion
  (`ingestTedNoticeActivity`), keyed by TED notice ID for idempotency (Temporal dedupes on
  Activity ID within a workflow, or use a signal-based dedup key). Batch polling becomes a
  short Workflow that fans out one Activity per notice, so a single bad notice doesn't kill
  the batch.

## 3. Social post scheduler

- **Current tech:** `src/social-scheduler/queue.ts` — Supabase `social_posts` table,
  `supabaseFetch` helper; publish path in `facebook-publisher.ts` / `x-publisher.ts`.
- **Gaps:** `supabaseFetch` on failure returns `null` and only `logger.warn`s
  (`queue.ts:37-41`) — the caller has no signal to retry; no retry/backoff on the publish
  call itself (rate-limited APIs like X/Facebook need this most); no scheduled-time
  durability if the process restarts between enqueue and scheduled publish time.
- **Proposed solution:** Standalone Activity per publish call (`publishSocialPostActivity`)
  with Temporal's `startDelay`/`ScheduleToStartTimeout` for the scheduled-time gap, and a
  retry policy tuned to each platform's rate-limit semantics (longer backoff for 429s).
  This was the pilot already recommended in the initial field note — kept as candidate #1.

## 4. Firehorse report scheduler

- **Current tech:** `src/firehorse/report-scheduler.ts` — `node-cron`, polls
  `report_schedules` table hourly, generates + emails a report, advances `next_run_at`.
- **Gaps:** If the process crashes between "generate report" and "advance next_run_at", a
  report can double-send on the next hourly tick (no transactional boundary across the two
  steps); no retry on `sendEmail` failure inside the loop — a bad recipient stalls nothing
  but silently drops that report for the period.
- **Proposed solution:** A genuine Temporal Workflow (`reportScheduleWorkflow`) using
  `sleep`-until-`next_run_at` plus two Activities (`generateReportActivity`,
  `emailReportActivity`) — Temporal's durable execution guarantees "advance next_run_at"
  only happens after the email Activity actually completes, closing the double-send gap for
  free. This is the strongest case in the survey for a real Workflow, not just a standalone
  Activity, because it's a multi-step sequence with a state transition that must be atomic
  with the side effect.

## 5. DocuSign envelope send/status polling

- **Current tech:** `src/integrations/docusign/client.ts` + `index.ts`, invoked ad hoc via
  `/sign-document` skill (local-machine only, needs `DOCUSIGN_*` keys).
- **Gaps:** No automatic status polling — someone has to check DocuSign manually for
  signature completion; no retry on transient DocuSign API errors during send.
- **Proposed solution:** Standalone Activity for envelope creation
  (`createDocusignEnvelopeActivity`) plus a small Workflow that polls envelope status on a
  schedule (`docusignStatusPollWorkflow`, using Temporal's `sleep` in a loop) and fires a
  completion signal/webhook substitute when signed — removing the manual-check step
  entirely without standing up a new polling cron job.

## 6. Stripe webhook side-effects

- **Current tech:** `src/routes/stripe-webhook.routes.ts` +
  `src/middleware/stripe-webhook.middleware.ts` — signature verification then direct
  handling (billing updates, GTM event logging) in the request handler.
- **Gaps:** Side-effects (billing.service writes, gtm-event-logger) run synchronously in the
  webhook handler; a downstream failure (e.g. Supabase write fails) risks Stripe retrying
  the whole webhook and double-processing the parts that already succeeded, since there's no
  idempotency/step-tracking beyond the webhook's own event ID check (if any).
- **Proposed solution:** Webhook handler does only signature verification + immediate 200,
  then starts a standalone Activity (or short Workflow if >1 side-effect) keyed by the
  Stripe event ID as the Activity/Workflow ID — Temporal's ID-based dedup makes Stripe's
  at-least-once redelivery safe by construction, replacing manual event-ID-seen checks.

## 7. Agent workflow engine (`WorkflowExecutor`)

- **Current tech:** `src/agents/workflows.ts` — homegrown `WorkflowDefinition` /
  `WorkflowExecutor` used by `outreach-orchestrator.agent.ts` and the `/workflow` skill;
  supports step chaining, `inputFrom` data-passing, per-step `retry: { maxAttempts,
backoffMs }`, and an overall `timeoutMs`. Its own top comment states the goal is "properly
  resumable, retryable workflows."
- **Gaps:** This is a bespoke, in-memory re-implementation of exactly what Temporal
  Workflows provide — but without durable execution: a process crash mid-workflow loses all
  step state (no replay from history), retries are per-step timers rather than a
  server-tracked schedule, and there's no built-in visibility (no "which step is this
  outreach-full run on right now" query without grepping logs).
- **Proposed solution:** This is the highest-leverage migration candidate, not a quick pilot
  — replacing `WorkflowExecutor` with real Temporal Workflows would give every agent chain
  (`outreach-full`, `case-run`, `/swarm` patterns) durable replay, real query/signal support,
  and a UI (Temporal Web) for free. Recommend as a **second-phase** project after the
  standalone-Activity pilot (#3) validates the operational model, not a first move — this
  touches the core agent orchestration path DWS6 depends on daily.

## 8. Scheduled/cron work generally

- **Current tech:** DGX Spark cron + GitHub Actions cron (per `/cron` skill), plus
  `node-cron` instances scattered in individual services (report-scheduler, etc.).
- **Gaps:** No unified retry/backoff/observability model across cron jobs; `/cron audit`
  is a manual status check, not a dashboard; a job that silently stops firing (crashed
  process, missed GHA run) has no alerting beyond someone noticing.
- **Proposed solution:** Temporal Schedules (server-side cron equivalent) for jobs that are
  candidates #1–#6 above naturally inherit this once migrated; for jobs that stay outside
  Temporal, no change recommended — don't migrate purely-internal housekeeping cron
  (backups, log rotation) that has no external side-effect and no retry need.

---

## Cross-cutting notes

- **Infrastructure cost:** every use case above assumes one shared Temporal deployment
  (self-hosted on DGX Spark, Postgres-backed, per Rule 14 DGX-first cost governance), not
  one server per use case.
- **Sovereignty:** self-host only. Temporal Cloud (US SaaS) would need a CLOUD Act exposure
  review (`/sovereignty-assess`) before touching any customer PII — out of scope until a
  self-hosted pilot proves the pattern.
- **Sequencing:** #3 (social scheduler) remains the cheapest, lowest-blast-radius pilot
  (already recommended in the prior field note). #4 (report scheduler) is the strongest
  correctness case (closes a real double-send bug class). #7 (agent WorkflowExecutor) is the
  biggest win but the biggest lift — sequence it last, after the pilot proves the ops model.

## HIC decision needed

Which use case should the pilot target: #3 (social scheduler, cheapest) or #4 (report
scheduler, fixes an existing double-send risk)? Both are scoped as standalone-Activity-only
pilots; #7 (agent WorkflowExecutor) is explicitly deferred pending pilot results.

## N/A items (Rule 12)

- KB update: N/A — still research-stage; will update `/kb` once a pilot is approved and run.
- Calendar entry: N/A — no dated commitment; pilot start date depends on HIC's pilot choice above.
