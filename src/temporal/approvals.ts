/**
 * Client-side helpers for the human-approval Workflow (Use case #9).
 * See src/temporal/workflows/human-approval.workflow.ts.
 */
import { getTemporalClient } from './client.js';
import { ticketId } from './ticket-id.js';
import { TASK_QUEUES } from './task-queues.js';
import {
  type ApprovalDecision,
  approvalDecisionSignal,
  approvalStateQuery,
  humanApprovalWorkflow,
  type HumanApprovalWorkflowInput,
  type HumanApprovalWorkflowResult,
} from './workflows/human-approval.workflow.js';

export interface StartApprovalInput extends HumanApprovalWorkflowInput {
  /** Stable ID for this approval request — used to find/signal it later. */
  requestId: string;
}

/** Named-ticket Workflow ID for an approval request — also used by humanApprovalWorkflow's callers (e.g. outreach-approval-send.workflow.ts) to keep the two in sync. */
export function approvalWorkflowId(requestId: string): string {
  return ticketId('approval', requestId);
}

/** Starts the approval gate; does not wait for a decision. */
export async function startApprovalRequest(
  input: StartApprovalInput,
): Promise<{ workflowId: string }> {
  const client = await getTemporalClient();
  const { requestId, ...workflowInput } = input;
  const workflowId = approvalWorkflowId(requestId);

  await client.workflow.start(humanApprovalWorkflow, {
    workflowId,
    taskQueue: TASK_QUEUES.APPROVALS,
    args: [workflowInput],
  });

  return { workflowId };
}

/** Sends a human's decision to a pending approval request. */
export async function sendApprovalDecision(
  requestId: string,
  decision: ApprovalDecision,
): Promise<void> {
  const client = await getTemporalClient();
  const handle = client.workflow.getHandle(approvalWorkflowId(requestId));
  await handle.signal(approvalDecisionSignal, decision);
}

/** Reads current state (pending / decided) without waiting — safe to poll. */
export async function getApprovalState(
  requestId: string,
): Promise<{ pending: boolean; decision?: ApprovalDecision }> {
  const client = await getTemporalClient();
  const handle = client.workflow.getHandle(approvalWorkflowId(requestId));
  return handle.query(approvalStateQuery);
}

/** Waits for the workflow to complete (approved, rejected, or timed out). */
export async function awaitApprovalResult(requestId: string): Promise<HumanApprovalWorkflowResult> {
  const client = await getTemporalClient();
  const handle = client.workflow.getHandle(approvalWorkflowId(requestId));
  return handle.result();
}
