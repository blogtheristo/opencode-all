/**
 * Temporal Workflow — DocuSign Send + Status Poll (Use case #5)
 *
 * Sends the envelope, then polls status every `pollIntervalMs` (default 1h)
 * until a terminal state or `maxWaitMs` (default 30 days) elapses. Replaces
 * the manual "check DocuSign" step with a durable, restart-safe poll loop —
 * a worker crash mid-poll just resumes from Temporal history on restart.
 */
import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from '../activities/docusign.activities.js';
import type {
  CreateEnvelopeRequest,
  EnvelopeStatusResult,
} from '../../integrations/docusign/types.js';

const { createDocusignEnvelopeActivity, getDocusignEnvelopeStatusActivity } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '1 minute',
  retry: { initialInterval: '10 seconds', maximumAttempts: 5 },
});

export interface DocusignStatusPollWorkflowInput {
  request: CreateEnvelopeRequest;
  pollIntervalMs?: number;
  maxWaitMs?: number;
}

const DEFAULT_POLL_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_MAX_WAIT_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function isTerminal(status: string): boolean {
  return status === 'completed' || status === 'declined' || status === 'voided';
}

export async function docusignStatusPollWorkflow(
  input: DocusignStatusPollWorkflowInput,
): Promise<EnvelopeStatusResult> {
  const pollIntervalMs = input.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const maxWaitMs = input.maxWaitMs ?? DEFAULT_MAX_WAIT_MS;

  const envelope = await createDocusignEnvelopeActivity(input.request);

  const deadline = Date.now() + maxWaitMs;
  let status: EnvelopeStatusResult = await getDocusignEnvelopeStatusActivity(envelope.envelopeId);

  while (!isTerminal(status.status) && Date.now() < deadline) {
    await sleep(pollIntervalMs);
    status = await getDocusignEnvelopeStatusActivity(envelope.envelopeId);
  }

  return status;
}
