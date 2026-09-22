/**
 * Standalone Activity starter — Transactional Email (Use case #1)
 *
 * Call this from anywhere that currently calls sendEmail() directly (or the
 * Redis-Streams email-queue.service.ts) to get a durable job record instead.
 * `idempotencyKey` becomes the Activity ID: submitting the same key twice
 * while the first is still in flight joins it (USE_EXISTING) instead of
 * sending twice.
 */
import type { SendEmailOptions } from '../../utils/send-email.js';
import { submitStandaloneActivity } from '../standalone.js';
import { TASK_QUEUES } from '../task-queues.js';

export interface SendEmailJobInput {
  options: SendEmailOptions;
  /** Stable ID — e.g. `report-${scheduleId}-${period}`, `outreach-${leadId}-${step}`. */
  idempotencyKey: string;
}

export async function startSendEmailJob(input: SendEmailJobInput): Promise<{ activityId: string }> {
  return submitStandaloneActivity({
    activity: 'sendEmailActivity',
    taskQueue: TASK_QUEUES.EMAIL,
    id: input.idempotencyKey,
    args: [input.options],
    startToCloseTimeout: '30 seconds',
    retry: { initialInterval: '5 seconds', backoffCoefficient: 2, maximumAttempts: 5 },
  });
}
