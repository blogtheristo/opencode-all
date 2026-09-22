/**
 * Client-side helper for the outreach approval+send Workflow — wires
 * outreach-full's Step 3 (see docs/dws-use-cases.md §10).
 */
import { getTemporalClient } from './client.js';
import { TASK_QUEUES } from './task-queues.js';
import { ticketId } from './ticket-id.js';
import {
  outreachApprovalSendWorkflow,
  type OutreachApprovalSendWorkflowInput,
} from './workflows/outreach-approval-send.workflow.js';

/**
 * Starts the approval+send Workflow and returns immediately — does NOT wait
 * for a human decision (that can take days). The caller (outreach-orchestrator
 * Step 3) gets back an ID to report to the human, not a delivery result.
 */
export async function startOutreachApprovalAndSend(
  input: OutreachApprovalSendWorkflowInput,
): Promise<{ workflowId: string; approvalRequestId: string }> {
  const client = await getTemporalClient();

  const handle = await client.workflow.start(outreachApprovalSendWorkflow, {
    workflowId: ticketId('outreach-send', input.approvalRequestId),
    taskQueue: TASK_QUEUES.OUTREACH,
    args: [input],
  });

  return { workflowId: handle.workflowId, approvalRequestId: input.approvalRequestId };
}
