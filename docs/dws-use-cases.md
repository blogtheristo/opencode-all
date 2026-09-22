# DWS6 Use Cases for Temporal (Standalone Activities + Workflows)

Status: PENDING_REVIEW
Date: 2026-09-22
Author: Claude Code (Sonnet 5)
Source: `docs/field-notes/2026-09-22-temporal-use-cases.md` (initial research), expanded per
HIC request to gather every candidate use case across the DWS6 codebase.

Format per use case: **Current tech → Gaps → Proposed solution**.

## Implementation status (2026-09-22, same-session follow-up)

HIC asked to choose an implementation order and build all of it. Code for use cases
#1–#6 and #8 is now in `src/temporal/` (Activities, Workflows, worker bootstrap, Schedule
setup) — see "Implemented" markers below. **Not yet run against a live server**: this
sandbox has no Temporal deployment to connect to, so nothing here has executed against
real infrastructure. What was verified: `tsc --noEmit` passes on all new code, `eslint`
is clean, and the Activity wrapper logic (error classification, idempotent transforms) is
unit-tested directly (`src/__tests__/temporal-activities.test.ts`, 9/9 passing) without
needing a server — Activities are plain async functions. Standing up a self-hosted
Temporal server on DGX Spark and pointing `TEMPORAL_ADDRESS` at it is the next, separate
step before any of this runs for real; see `src/temporal/client.ts` for the env vars.

**Implementation order chosen** (cheapest/lowest-risk first, correctness-critical next,
biggest-lift last): #3 → #4 → #1 → #2 → #6 → #5 → #8, with #7 deferred as originally
scoped (see its section — no code changed there).

---

## 1. Transactional email delivery (SES/Proton send) — Implemented (order 3/7)

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
- **Shipped:** `src/temporal/activities/email.activities.ts` (`sendEmailActivity`). Not
  yet wired to replace `email-queue.service.ts` call sites — that's a follow-up cutover
  once a live server exists to validate against; the Redis outbox keeps running until then.

## 2. Sales/TED lead queue — Implemented (order 4/7)

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
- **Shipped:** `src/temporal/activities/ted.activities.ts` (`ingestTedNoticeActivity`) +
  `src/temporal/workflows/ted-batch-ingest.workflow.ts` (`tedBatchIngestWorkflow`, fans out
  one Activity per notice and collects per-notice failures without aborting the batch).

## 3. Social post scheduler — Implemented (order 1/7, pilot)

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
- **Shipped:** `src/temporal/activities/social.activities.ts` (`publishSocialPostActivity`,
  classifies platform errors retryable vs. non-retryable) + `src/temporal/workflows/social-publish.workflow.ts`
  (`socialPublishWorkflow`, durable `sleep` until scheduled time, then publish).

## 4. Firehorse report scheduler — Implemented (order 2/7)

- **Current tech:** `src/firehorse/report-scheduler.ts` — `node-cron`, polls
  `report_schedules` table hourly, does a compare-and-swap claim (advances `next_run_at`
  only if it still matches the value just read) before generating + emailing — this already
  rules out the double-send this note originally flagged as a gap. Corrected per Rule 12
  after reading the actual `claimSchedule()` implementation.
- **Gaps:** The claim happens _before_ generate/email, so a failure in either one silently
  drops that period's report — `next_run_at` has already moved on, and the only trace is a
  `logger.error`/`logger.warn` line; no retry on `sendEmail` failure inside the loop.
- **Proposed solution:** A genuine Temporal Workflow (`reportScheduleWorkflow`) sequencing
  claim → generate → email as one durable history — a crash between generate and email
  resumes from Temporal's replay instead of silently ending the run, and `emailReportActivity`
  gets a real retry policy instead of a single attempt. This is the strongest case in the
  survey for a real Workflow, not just a standalone Activity, because it's a multi-step
  sequence with a state transition that should stay consistent with the side effect.

## 5. DocuSign envelope send/status polling — Implemented (order 6/7)

- **Current tech:** `src/integrations/docusign/client.ts` + `index.ts`, invoked ad hoc via
  `/sign-document` skill (local-machine only, needs `DOCUSIGN_*` keys).
- **Gaps:** No automatic status polling — someone has to check DocuSign manually for
  signature completion; no retry on transient DocuSign API errors during send.
- **Proposed solution:** Standalone Activity for envelope creation
  (`createDocusignEnvelopeActivity`) plus a small Workflow that polls envelope status on a
  schedule (`docusignStatusPollWorkflow`, using Temporal's `sleep` in a loop) and fires a
  completion signal/webhook substitute when signed — removing the manual-check step
  entirely without standing up a new polling cron job.
- **Shipped:** `src/temporal/activities/docusign.activities.ts`
  (`createDocusignEnvelopeActivity`, `getDocusignEnvelopeStatusActivity`) +
  `src/temporal/workflows/docusign-status-poll.workflow.ts` (`docusignStatusPollWorkflow`,
  1-hour poll interval / 30-day max wait, both configurable per call).

## 6. Stripe webhook side-effects — Implemented (order 5/7, activity only)

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
- **Shipped:** `src/temporal/activities/stripe.activities.ts` (`processStripeEventActivity`,
  wraps the existing `billing.service` handlers). **Not wired into the live webhook route**
  — that route is payment-critical and already does signature verification + an
  idempotency-check middleware synchronously in the request cycle; rewiring it to
  start a Workflow instead is a follow-up change requiring its own review, not a
  same-session swap. The Activity exists so that follow-up only has to change the route,
  not build the processing logic from scratch.

## 7. Agent workflow engine (`WorkflowExecutor`) — Deferred, unchanged this session

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

## 8. Scheduled/cron work generally — Implemented (order 7/7, report-schedule only)

- **Current tech:** DGX Spark cron + GitHub Actions cron (per `/cron` skill), plus
  `node-cron` instances scattered in individual services (report-scheduler, etc.).
- **Gaps:** No unified retry/backoff/observability model across cron jobs; `/cron audit`
  is a manual status check, not a dashboard; a job that silently stops firing (crashed
  process, missed GHA run) has no alerting beyond someone noticing.
- **Proposed solution:** Temporal Schedules (server-side cron equivalent) for jobs that are
  candidates #1–#6 above naturally inherit this once migrated; for jobs that stay outside
  Temporal, no change recommended — don't migrate purely-internal housekeeping cron
  (backups, log rotation) that has no external side-effect and no retry need.
- **Shipped:** `src/temporal/schedules.ts` (`ensureReportSchedulePoll`, idempotent Schedule
  creation) + `src/temporal/workflows/report-schedule-poll.workflow.ts`
  (`reportSchedulePollWorkflow`, fetches due rows via
  `fetchDueReportSchedulesActivity` and runs one child `reportScheduleWorkflow` per row) —
  this is the direct hourly-cron replacement for #4. Run once via
  `npm run temporal:schedules:setup` against a live server; the other five use cases don't
  need a Schedule (they're triggered by an event — a scheduled post's send time, a TED poll,
  a webhook — not a cron tick).

---

## Cross-cutting notes

- **Infrastructure cost:** every use case above assumes one shared Temporal deployment
  (self-hosted on DGX Spark, Postgres-backed, per Rule 14 DGX-first cost governance), not
  one server per use case.
- **Sovereignty:** self-host only. Temporal Cloud (US SaaS) would need a CLOUD Act exposure
  review (`/sovereignty-assess`) before touching any customer PII — out of scope until a
  self-hosted pilot proves the pattern.
- **Sequencing:** built in the order #3 → #4 → #1 → #2 → #6 → #5 → #8 (cheapest first,
  correctness-critical next, biggest lift last). #7 (agent WorkflowExecutor) remains
  deferred — no code changed there this session; it needs its own scoped project once the
  rest has run against a live server.
- **How to run this for real:** stand up a self-hosted Temporal server on DGX Spark (not
  Temporal Cloud — see sovereignty note above), point `TEMPORAL_ADDRESS` at it, run
  `npm run temporal:worker` (starts one Worker polling all six task queues in
  `src/temporal/task-queues.ts`), then `npm run temporal:schedules:setup` once to create the
  report-schedule poll Schedule. None of this has been exercised against a live server in
  this session — see the Implementation status note above.

## HIC decision needed

Approve standing up a self-hosted Temporal server on DGX Spark so this code can actually
run? Nothing here executes against real infrastructure until that exists (see
Implementation status note). If approved, #7 (replacing the agent `WorkflowExecutor`) still
needs a separate scoping decision once #1–#6/#8 have proven out operationally.

## N/A items (Rule 12)

- KB update: N/A — code shipped but unexercised against live infra; will update `/kb` once
  a DGX Spark Temporal server exists and a first workflow has actually run.
- Calendar entry: N/A — no dated commitment; depends on HIC's DGX Spark provisioning decision above.
