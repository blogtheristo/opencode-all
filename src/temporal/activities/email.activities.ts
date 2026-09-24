/**
 * Temporal Activity — Transactional Email Send (Use case #1)
 *
 * Standalone Activity wrapping the existing SES/SMTP sendEmail(). Intended
 * to replace the Redis Streams outbox in src/services/email-queue.service.ts:
 * Temporal's RetryPolicy (see worker.ts) replaces the fixed max-3-retries
 * consumer-group loop, and the Activity's own history is the DLQ — no
 * separate `email:dead-letters` stream to inspect.
 *
 * Runs applyEmailHardRules() (use case #12) before every send — a
 * deterministic, escalate-only-to-block safety net enforcing CLAUDE.md's
 * Secret Egress Rules and Sender Identity Rule at runtime, not just by
 * convention. See guardrails/hard-rules.ts.
 */
import { ApplicationFailure } from '@temporalio/activity';
import { sendEmail, type SendEmailOptions } from '../../utils/send-email.js';
import { applyEmailHardRules } from '../guardrails/hard-rules.js';

export interface SendEmailActivityResult {
  ok: true;
  auditId?: string;
}

/** Hard bounces / bad-address errors are not worth Temporal's retry backoff. */
function isNonRetryableSmtpError(error: string | undefined): boolean {
  return /invalid recipient|mailbox.*(unavailable|not found)|550|551|553/i.test(error || '');
}

export async function sendEmailActivity(
  options: SendEmailOptions,
): Promise<SendEmailActivityResult> {
  const guard = applyEmailHardRules(options);
  if (guard.blocked) {
    throw ApplicationFailure.create({
      message: `Email blocked by hard-rules guardrail: ${guard.reasons.join(', ')}`,
      type: 'HardRuleBlocked',
      nonRetryable: true,
    });
  }

  const { ok, error, auditId } = await sendEmail(options);

  if (!ok) {
    throw ApplicationFailure.create({
      message: `sendEmail failed: ${error || 'unknown error'}`,
      type: 'EmailDeliveryError',
      nonRetryable: isNonRetryableSmtpError(error),
    });
  }

  return { ok: true, auditId };
}
