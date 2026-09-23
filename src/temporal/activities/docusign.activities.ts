/**
 * Temporal Activities — DocuSign Envelope Send + Status Poll (Use case #5)
 *
 * Removes the manual "go check DocuSign" step: envelope creation is a
 * standalone Activity, and a small poll Workflow (docusign-status-poll)
 * checks status on a schedule until the envelope reaches a terminal state.
 */
import { ApplicationFailure } from '@temporalio/activity';
import { DocuSignClient } from '../../integrations/docusign/client.js';
import type {
  CreateEnvelopeRequest,
  EnvelopeResult,
  EnvelopeStatusResult,
} from '../../integrations/docusign/types.js';
import logger from '../../utils/logger.js';

function client(): DocuSignClient {
  return DocuSignClient.fromEnv();
}

export async function createDocusignEnvelopeActivity(
  request: CreateEnvelopeRequest,
): Promise<EnvelopeResult> {
  try {
    const result = await client().sendEnvelope(request);
    logger.info('DocuSign envelope created via Temporal activity', {
      envelopeId: result.envelopeId,
      status: result.status,
    });
    return result;
  } catch (err) {
    throw ApplicationFailure.create({
      message: `DocuSign sendEnvelope failed: ${(err as Error).message}`,
      type: 'DocusignSendError',
      nonRetryable: false,
    });
  }
}

const TERMINAL_STATUSES = new Set(['completed', 'declined', 'voided']);

export function isTerminalEnvelopeStatus(status: string): boolean {
  return TERMINAL_STATUSES.has(status);
}

export async function getDocusignEnvelopeStatusActivity(
  envelopeId: string,
): Promise<EnvelopeStatusResult> {
  try {
    return await client().getEnvelopeStatus(envelopeId);
  } catch (err) {
    throw ApplicationFailure.create({
      message: `DocuSign getEnvelopeStatus failed for ${envelopeId}: ${(err as Error).message}`,
      type: 'DocusignStatusError',
      nonRetryable: false,
    });
  }
}
