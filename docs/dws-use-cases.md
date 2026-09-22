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

## Revision (2026-09-23): Standalone Activities, not Workflow wrappers, for #1/#2/#3/#6

HIC shared Temporal's Standalone Activities GA writeup, which clarified something this
session's first pass got architecturally wrong: #3 (social publish) and #2 (TED
ingestion) were built as thin Workflows whose only job was `sleep` or fan-out looping —
exactly the case the article says doesn't need a Workflow. `client.activity.start()`'s
own `startDelay` option replaces the sleep; submitting one Standalone Activity per TED
notice, each keyed by its own Activity ID, replaces the fan-out loop (Temporal isolates
each job's outcome from the others by construction, no Workflow loop needed for that).
\#1 (email) and #6 (Stripe) were never wrapped in Workflows to begin with, so they only
needed real starter functions instead of being called ad hoc.

**Changed:** added `src/temporal/standalone.ts` (shared `client.activity.start`/`execute`
helper) and `src/temporal/starters/{email,social,ted,stripe}.starter.ts`. Superseded
`social-publish.workflow.ts` and `ted-batch-ingest.workflow.ts` renamed to `_OLD` (CLAUDE.md
Rule 6 — rename over delete) and dropped from `workflows/index.ts`. #4 (report schedule)
and #5 (DocuSign poll) are unchanged — both genuinely coordinate multiple steps/waits,
which is exactly where the article says a Workflow remains the right tool.

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
- **Shipped:** `src/temporal/activities/email.activities.ts` (`sendEmailActivity`) +
  `src/temporal/starters/email.starter.ts` (`startSendEmailJob`, a true Standalone
  Activity submit — no Workflow wrapper, since sending one email is one step). Caller
  supplies a stable `idempotencyKey` that becomes the Activity ID. Not yet wired to
  replace `email-queue.service.ts` call sites — that's a follow-up cutover once a live
  server exists to validate against; the Redis outbox keeps running until then.

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
  `src/temporal/starters/ted.starter.ts` (`startTedNoticeIngestJob` /
  `startTedBatchIngestJobs`) — each notice is submitted as its own Standalone Activity,
  Activity ID = the TED notice number, so a re-poll seeing the same notice again joins
  the existing job instead of double-submitting; a bad notice's failure never touches the
  others since there's no shared Workflow loop to fail through. Supersedes the earlier
  `tedBatchIngestWorkflow` (now `ted-batch-ingest.workflow_OLD.ts`, unwired) — see the
  2026-09-23 revision note above.

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
  classifies platform errors retryable vs. non-retryable) + `src/temporal/starters/social.starter.ts`
  (`startSocialPublishJob`) — submits a Standalone Activity using `startDelay` for the
  scheduled-time gap, Activity ID = `social-${post.id}`. Supersedes the earlier
  `socialPublishWorkflow` (now `social-publish.workflow_OLD.ts`, unwired) — a Workflow
  whose only job was `sleep` then call one Activity didn't need to be a Workflow; see the
  2026-09-23 revision note above.

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
  wraps the existing `billing.service` handlers) + `src/temporal/starters/stripe.starter.ts`
  (`startStripeEventJob`, a Standalone Activity keyed by `stripe-${event.id}` —
  Temporal's own idConflictPolicy/idReusePolicy reject a redelivered event that already
  succeeded, which is the "stable update ID" dedup the article describes). **Not wired
  into the live webhook route** — that route is payment-critical and already does
  signature verification + an idempotency-check middleware synchronously in the request
  cycle; rewiring it to call `startStripeEventJob` instead is a follow-up change
  requiring its own review, not a same-session swap. The starter exists so that
  follow-up only has to change the route, not build the processing logic from scratch.

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

## 9. Human-in-the-loop approval gates — Implemented (2026-09-24, new use case)

- **Source:** HIC shared temporalio/ai-cookbook's `agents/human_in_the_loop_python`
  example — a Signal handler + `wait_condition()` pattern for pausing an agent workflow
  until a human approves or rejects, at zero compute cost while waiting.
- **Current tech:** DWS6 already has several human-approval gates, all synchronous and
  in-chat: the blog-draft-gate hook (Non-Negotiable Rule 13 — "show text, stop, ask" in
  the same Claude Code turn), the Session Learning Outcome Rule's step 5 ("ask HIC one
  real decision question"), and RED-zone thesis-structural-edit approval. None of these
  produce a durable, queryable record independent of the chat session.
- **Gaps:** If the session ends (context limit, disconnect, HIC steps away) before the
  question is answered, the approval request has no independent existence — it has to be
  re-asked from scratch next session. There is no "list of things pending my approval"
  a HIC could check outside the specific chat that asked. No async, multi-day wait
  support (a HIC traveling for a week has no way to approve later without a new
  session re-deriving the same question).
- **Proposed / shipped solution:** `src/temporal/workflows/human-approval.workflow.ts`
  (`humanApprovalWorkflow`) — TypeScript port of the cookbook pattern: a
  `defineSignal`/`setHandler` pair receives the decision, `condition()` pauses the
  workflow (default 7-day timeout — DWS approvals are async human review, not the
  cookbook's 5-minute live-agent demo default) until a decision arrives or it times out,
  and a `defineQuery` exposes current state (`pending` / decided) for anyone to check
  without waiting. `src/temporal/approvals.ts` has the client-side helpers
  (`startApprovalRequest`, `sendApprovalDecision`, `getApprovalState`,
  `awaitApprovalResult`); `scripts/temporal-send-approval.ts`
  (`npm run temporal:approve -- <requestId> --approve --by "<name>"`) is the decision-
  sender CLI, mirroring the cookbook's own approval-signal-sender script.
- **Deliberately NOT wired into the blog-draft-gate hook or any other compliance-critical
  RED-zone gate this session** — those are policy-enforced by Non-Negotiable Rule 13 and
  a cutover needs its own review, same caution already applied to the Stripe webhook
  route (#6). This ships the general-purpose building block only.
- **4/4 unit tests passing** (`src/__tests__/temporal-human-approval.test.ts`) against a
  mocked client — workflowId keying, signal/query wiring. Not run against a live server
  (same caveat as every other use case — see Implementation status note above).

## 10. Agent Workflow v2 (`src/agents/workflows.ts`) — audit of steps needing Standalone Activities

HIC asked, since Workflow v2 (the `WorkflowExecutor`/`WorkflowDefinition` engine — use
case #7 above) is now live across sessions, which of its steps are actual candidates for
Standalone Activities. This is research only — no code changed for this section; #7
itself stays deferred (a full WorkflowExecutor→Temporal migration is still the
second-phase project it always was). What follows is a step-by-step audit of the six
workflows in `WORKFLOW_REGISTRY` (`src/agents/workflows.ts:177`).

Every `'agent'` and `'parallel'` step calls an in-process LLM agent
(`agentRegistry.executeAgent`) — not itself an external durable-job candidate; that's
what Standalone Activities inside the _agent's own_ tool calls would cover (a much
larger, separate audit). The candidates below are the steps that do or should perform
external I/O with no retry/durability today:

| Workflow                | Step                                                                                                                                                        | Type                                    | Why it's a candidate                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `outreach-full`         | Step 3 send (`outreach-executor`, called outside the declared `steps: []`, gated by `autoSend`/`approvedBy` strings — `outreach-orchestrator.agent.ts:181`) | plain `agentRegistry.executeAgent` call | The real email/LinkedIn send, with zero retry today. `approvedBy` is a caller-supplied string, not a durable approval record — this is exactly what use case #9's `humanApprovalWorkflow` should gate, and the send itself is exactly use case #1's `startSendEmailJob`. **Highest-value target of this audit** — both building blocks already exist, just not wired here. |
| `compliance-assessment` | `notify-complete` (`emit-event`, `workflows.ts:101`)                                                                                                        | emit-event                              | Dead end today — grepped for subscribers, found none. Not yet a candidate; becomes one the moment a real subscriber (e.g. "email the compliance officer") is added — build that subscriber as a Standalone Activity from the start, not another `logger.info` no-op.                                                                                                       |
| `construction-full`     | `notify-complete` (`workflows.ts:135`)                                                                                                                      | emit-event                              | Same as above — dead end, same recommendation if/when wired.                                                                                                                                                                                                                                                                                                               |
| `morning-intelligence`  | `notify-briefing-ready` (`morning-intelligence.ts:39`)                                                                                                      | emit-event                              | Same dead-end pattern. This one has an obvious real target already built elsewhere: `scripts/send-morning-brief-v2.ts` sends the actual morning briefing email — worth checking whether that script and this workflow are two paths to the same outcome that should converge on one `startSendEmailJob` call.                                                              |
| `content-pipeline`      | `notify-pipeline-ready` (`content-pipeline.ts:40`)                                                                                                          | emit-event                              | Same dead-end pattern.                                                                                                                                                                                                                                                                                                                                                     |
| `seo-pipeline`          | _(none)_                                                                                                                                                    | —                                       | No emit-event or send step at all — ends at `content-strategy`, a pure agent step. Not a candidate.                                                                                                                                                                                                                                                                        |

**Bottom line:** only one of the six workflows has a real, un-wired external action today
(`outreach-full`'s Step 3 send) — that's the one worth cutting over first, and it would
exercise both #1 and #9 together in one real caller. The four `emit-event` dead ends are
not candidates yet; they're the right _place_ to add a Standalone Activity the day a real
subscriber is built, so flag this table for whoever wires those events next rather than
letting them default to another synchronous, non-durable call.

## Cutover (2026-09-24): `outreach-full` Step 3 wired onto the approval Workflow

Done. `src/agents/outreach-orchestrator.agent.ts`'s Step 3 no longer trusts a
caller-supplied `approvedBy` string — it now starts
`outreachApprovalSendWorkflow` (`src/temporal/workflows/outreach-approval-send.workflow.ts`)
via `startOutreachApprovalAndSend()` (`src/temporal/outreach.ts`), fire-and-forget
(the orchestrator does not block on a human decision that can take days).

- **`outreachApprovalSendWorkflow`** composes `humanApprovalWorkflow` (use case #9) as a
  child Workflow — keyed `approval-${approvalRequestId}` so `npm run temporal:approve --
<approvalRequestId> --approve --by "<name>"` finds it exactly as documented for #9 —
  then, only on `approved`, sends each thread via **`sendOutreachThreadActivity`**
  (`src/temporal/activities/outreach.activities.ts`), a thin wrap of the _existing_
  `outreach-executor` agent through `agentRegistry.executeAgent()` — zero send logic
  duplicated, only retry/durability added around the existing call.
- **Response shape changed:** the orchestrator's `execute()` now returns
  `{ pendingApproval: { approvalRequestId, workflowId } }` instead of a synchronous
  `emailsSent` count — Step 3 starting no longer means Step 3 finished. The removed
  `approvedBy`-only trust gate and `validateAutoSend()` helper are gone; `approvedBy` (if
  passed) is now just a label for who requested the approval, not a bypass.
- **Failure isolation:** if Temporal is unreachable (no live server yet — see
  Implementation status note above), starting the approval Workflow throws, is caught,
  and surfaces as `approvalStartError` in the response — Steps 1-2's leads/drafts are
  still returned rather than the whole run failing.
- **3/3 new unit tests passing** (`src/__tests__/temporal-outreach.test.ts`), full suite
  still 1338/1338 passing after the change. Not run against a live server (same caveat
  as every other use case).

## 11. Agentic loop durability (`BaseAgent.runLoop()`) — Implemented (2026-09-24)

- **Source:** HIC shared temporalio/ai-cookbook's
  `agents/agentic_loop_tool_call_claude_python` example — a Temporal Workflow holds an
  observe-think-act loop, calling a Claude-API Activity and a tool-execution Activity
  repeatedly until the LLM stops requesting tools.
- **Current tech:** `BaseAgent.runLoop()` (`src/agents/base.agent.ts:89-258`) is the
  same pattern already, in-process: a `for` loop (default `maxIterations: 10`) calling
  `client.chat(messages, tools)` then `executeTools(toolCalls, context)`, breaking on
  `stopReason === 'end_turn'`. Every DWS7-generation agent that calls `runLoop()` uses
  this today.
- **Gaps:** No durability — a process crash/restart on iteration 7 of 10 loses the
  entire conversation and every LLM call already paid for (tokens spent, nothing to show
  for it). No mid-loop visibility beyond grepping logs or the Supabase iteration-log
  table after the fact; no way to inject a message mid-loop (a human correction, a
  priority interrupt) without killing and restarting the whole run.
- **Shipped:** `src/temporal/activities/agent-loop.activities.ts`
  (`callAgentLLMActivity`, `executeAgentToolCallsActivity` — thin wraps around the
  existing `createLLMClient`/`executeTools`, confirmed serializable: `AgentContext` and
  the LLM/tool types in `src/agents/types.ts` carry no live handles, so no adaptation
  was needed) + `src/temporal/workflows/agent-loop.workflow.ts` (`agentLoopWorkflow`,
  a line-for-line port of `runLoop()`'s loop body) + `src/temporal/agent-loop.ts`
  (`runAgentLoopWorkflow`, a drop-in-shaped client call). Tool list and `AgentContext`
  are resolved by the caller and passed in as plain data — the Workflow itself never
  imports `agents/tools.js` or `agents/llm-client.js` (real I/O, unsafe to pull into
  Temporal's deterministic workflow sandbox), matching the cookbook's own design of
  keeping tool resolution outside the loop.
- **Deliberately NOT wired into `BaseAgent.runLoop()` this session** — every live agent
  depends on `runLoop()` today; swapping its implementation is the same class of change
  as the `outreach-full` cutover in §10, and needs its own review before touching a path
  this central. This ships the durable building block only.
- **4/4 unit tests passing** (`src/__tests__/temporal-agent-loop.test.ts`) against
  mocked `llm-client`/`tools` modules. Not run against a live server (same caveat as
  every other use case — see Implementation status note above).

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
  Temporal Cloud — see sovereignty note above; wired in
  `infrastructure/dgx-spark/docker-compose.yml`, see
  `docs/field-notes/2026-09-23-temporal-dgx-spark-wiring-and-cost.md` for activation
  steps), point `TEMPORAL_ADDRESS` at it, run `npm run temporal:worker` (starts one
  Worker polling all six task queues in `src/temporal/task-queues.ts` — it registers
  Activities for every use case and the two remaining Workflows, #4 and #5), then `npm
run temporal:schedules:setup` once to create the report-schedule poll Schedule. Once
  the Worker is confirmed connected, call the `src/temporal/starters/*` functions from
  wherever each use case's job currently originates (e.g. `startSocialPublishJob` where
  `social-scheduler/queue.ts` currently enqueues a draft) — none of that caller-side
  wiring is done yet. None of this has been exercised against a live server in this
  session — see the Implementation status note above.

## HIC decision needed

Approve standing up a self-hosted Temporal server on DGX Spark so this code can actually
run? Nothing here executes against real infrastructure until that exists (see
Implementation status note). If approved, #7 (replacing the agent `WorkflowExecutor`) still
needs a separate scoping decision once #1–#6/#8 have proven out operationally.

## N/A items (Rule 12)

- KB update: N/A — code shipped but unexercised against live infra; will update `/kb` once
  a DGX Spark Temporal server exists and a first workflow has actually run.
- Calendar entry: N/A — no dated commitment; depends on HIC's DGX Spark provisioning decision above.

## Addendum (2026-09-24): Vercel AI SDK cookbook example evaluated, not adopted

HIC pointed at a third cookbook example, `agents/ai_sdk_by_vercel_typescript`, alongside
the observation that DWS6 already answers user questions via a local Ollama model. Worth
recording what was checked and why nothing changed here.

**What the example does:** wraps Vercel AI SDK's `generateText()` as a durable Temporal
Activity automatically, via `@temporalio/ai-sdk`'s `temporalProvider` + `AiSdkPlugin`
on the Worker — no manual `proxyActivities()` wrapping of the LLM call itself. Tools are
defined with the AI SDK's `tool()` + Zod schemas. **The example itself is hardcoded to
OpenAI's `gpt-4o-mini`** — it does not demonstrate Ollama or any local-model provider.

**Checked against DWS6's actual setup:** `src/agents/llm-client.ts:105-116,236-248`
already has first-class Ollama support (OpenAI-compatible endpoint at
`OLLAMA_BASE_URL`/v1, model from `OLLAMA_DEPLOYED_MODELS`), and
`infrastructure/dgx-spark/docker-compose.yml` sets `LLM_PRIMARY: ollama` on the backend
— confirms the "user questions run on local Ollama" premise is already true in the
running system, independent of anything built this session.

**Why not adopted:** use case #11 (`agentLoopWorkflow`) already gives the same
architectural benefit the cookbook example does — the LLM call as a durable Temporal
Activity — by wrapping DWS6's own `createLLMClient()`, which already speaks Ollama.
Pulling in `ai` + `@temporalio/ai-sdk` + `@ai-sdk/openai` (or a third-party Ollama AI-SDK
provider) would stand up a second, parallel LLM-abstraction layer next to the one DWS6
already has, purely to get a durability property #11 already delivers. That's the
premature-abstraction case CLAUDE.md's Engineering Discipline Rule 2 (simplicity first)
exists for — no new dependency, no new provider-config surface, no second thing to keep
in sync with `llm-client.ts`'s existing multi-provider priority logic (Anthropic > Groq

> Ollama > vLLM > OpenAI, per that file's own header comment; `LLM_PRIMARY=ollama` in
> the DGX compose env overrides that default for the backend/cron services specifically).

**If this changes:** revisit only if DWS6 ever needs an AI-SDK-specific capability
`llm-client.ts` doesn't have (e.g. AI SDK's built-in structured-output/streaming
ergonomics) — not for the durability property alone, which #11 already covers.
