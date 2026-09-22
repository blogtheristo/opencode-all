/**
 * Standalone Activity starter — Stripe Webhook Side-Effects (Use case #6)
 *
 * Activity ID = the Stripe event ID, with the default idConflictPolicy
 * ('USE_EXISTING') and idReusePolicy ('ALLOW_DUPLICATE_FAILED_ONLY'): a
 * redelivered webhook for an event already succeeded is rejected as a
 * duplicate by Temporal itself — this is the "stable update ID" dedup the
 * Temporal blog describes, replacing the webhook middleware's own
 * hand-rolled idempotency-check table lookup. Still NOT wired into the live
 * route — see docs/dws-use-cases.md use case #6 for why that's a separate,
 * reviewed change.
 */
import type { ProcessStripeEventInput } from '../activities/stripe.activities.js';
import { submitStandaloneActivity, ticketId } from '../standalone.js';
import { TASK_QUEUES } from '../task-queues.js';

export async function startStripeEventJob(
  input: ProcessStripeEventInput,
): Promise<{ activityId: string }> {
  return submitStandaloneActivity({
    activity: 'processStripeEventActivity',
    taskQueue: TASK_QUEUES.STRIPE,
    id: ticketId('stripe', input.eventId),
    args: [input],
    startToCloseTimeout: '30 seconds',
    retry: { initialInterval: '5 seconds', maximumAttempts: 5 },
  });
}
