/**
 * Temporal Activity — Stripe Webhook Side-Effects (Use case #6)
 *
 * Wraps the existing billing.service handlers as standalone Activities.
 * NOT YET WIRED into src/routes/stripe-webhook.routes.ts — that route
 * already does signature verification + an idempotency-check middleware
 * synchronously in the request/response cycle, which is payment-critical
 * and out of scope for a same-session rewire. This Activity is the
 * building block for a follow-up change: have the webhook route do only
 * verification + 200, then start a Workflow keyed by the Stripe event ID
 * (Temporal's own ID-based dedup would then replace the idempotencyCheck
 * middleware's manual event-ID-seen check).
 */
import { ApplicationFailure } from '@temporalio/activity';
import {
  handleInvoicePaymentSucceeded,
  handleInvoiceUncollectible,
} from '../../services/billing.service.js';
import logger from '../../utils/logger.js';

export interface ProcessStripeEventInput {
  eventId: string;
  eventType: 'invoice.payment_succeeded' | 'invoice.marked_uncollectible';
  invoiceId: string;
}

export async function processStripeEventActivity(input: ProcessStripeEventInput): Promise<void> {
  try {
    if (input.eventType === 'invoice.payment_succeeded') {
      await handleInvoicePaymentSucceeded(input.invoiceId);
    } else {
      await handleInvoiceUncollectible(input.invoiceId);
    }
    logger.info('Stripe event processed via Temporal activity', {
      eventId: input.eventId,
      eventType: input.eventType,
    });
  } catch (err) {
    throw ApplicationFailure.create({
      message: `Stripe event ${input.eventId} (${input.eventType}) processing failed: ${(err as Error).message}`,
      type: 'StripeEventProcessingError',
      nonRetryable: false,
    });
  }
}
