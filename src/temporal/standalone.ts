/**
 * Standalone Activity submission helper.
 *
 * Wraps `client.activity.start()` (GA, `@temporalio/client` 1.24+ — see
 * https://docs.temporal.io/standalone-activity). A Standalone Activity is a
 * durable job record with no wrapping Workflow: Temporal records it before a
 * Worker ever picks it up, retries it per policy, and keeps the record
 * (status, error, result) for the namespace's retention period after it
 * closes. Use this for a single unit of work with no waits/steps to
 * coordinate — see docs/dws-use-cases.md for which use cases this fits
 * (email, TED ingestion, Stripe event processing, social publish) versus
 * which genuinely need a Workflow (report schedule, DocuSign poll).
 */
import type {
  ActivityIdConflictPolicy,
  ActivityIdReusePolicy,
  RetryPolicy,
} from '@temporalio/client';
import type { Duration } from '@temporalio/common/lib/time.js';
import { getTemporalClient } from './client.js';

export { ticketId } from './ticket-id.js';

export interface SubmitStandaloneActivityInput<A extends unknown[]> {
  activity: string;
  taskQueue: string;
  /** Stable business ID — this IS the idempotency key (see ActivityOptions.id). */
  id: string;
  args: A;
  retry?: RetryPolicy;
  startToCloseTimeout?: Duration;
  scheduleToCloseTimeout?: Duration;
  heartbeatTimeout?: Duration;
  /** Delay before the job becomes available to a Worker — not applied to retries. */
  startDelay?: Duration;
  /** Default 'USE_EXISTING': a second submit with the same ID joins the in-flight job instead of erroring. */
  idConflictPolicy?: ActivityIdConflictPolicy;
  /** Default 'ALLOW_DUPLICATE_FAILED_ONLY': a closed-but-failed ID can be resubmitted; a closed-and-succeeded one cannot (prevents accidental re-send). */
  idReusePolicy?: ActivityIdReusePolicy;
}

/** Fire-and-forget submit — returns once Temporal has durably recorded the job, does not wait for it to run. */
export async function submitStandaloneActivity<A extends unknown[]>(
  input: SubmitStandaloneActivityInput<A>,
): Promise<{ activityId: string; runId?: string }> {
  const client = await getTemporalClient();
  const handle = await client.activity.start(input.activity, {
    id: input.id,
    taskQueue: input.taskQueue,
    args: input.args,
    retry: input.retry,
    startToCloseTimeout: input.startToCloseTimeout,
    scheduleToCloseTimeout: input.scheduleToCloseTimeout,
    heartbeatTimeout: input.heartbeatTimeout,
    startDelay: input.startDelay,
    idConflictPolicy: input.idConflictPolicy ?? 'USE_EXISTING',
    idReusePolicy: input.idReusePolicy ?? 'ALLOW_DUPLICATE_FAILED_ONLY',
  });
  return { activityId: handle.activityId, runId: handle.runId };
}

/** Submit and await the result — use when the caller needs the outcome inline. */
export async function runStandaloneActivity<A extends unknown[], R>(
  input: SubmitStandaloneActivityInput<A>,
): Promise<R> {
  const client = await getTemporalClient();
  return client.activity.execute<R>(input.activity, {
    id: input.id,
    taskQueue: input.taskQueue,
    args: input.args,
    retry: input.retry,
    startToCloseTimeout: input.startToCloseTimeout,
    scheduleToCloseTimeout: input.scheduleToCloseTimeout,
    heartbeatTimeout: input.heartbeatTimeout,
    startDelay: input.startDelay,
    idConflictPolicy: input.idConflictPolicy ?? 'USE_EXISTING',
    idReusePolicy: input.idReusePolicy ?? 'ALLOW_DUPLICATE_FAILED_ONLY',
  });
}
