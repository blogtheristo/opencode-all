/**
 * Client-side helpers for the human-approval Workflow (Use case #9).
 * See src/temporal/workflows/human-approval.workflow.ts.
 */
import { getTemporalClient } from './client.js';
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

/** Starts the approval gate; does not wait for a decision. */
export async function startApprovalRequest(
  input: StartApprovalInput,
): Promise<{ workflowId: string }> {
  const client = await getTemporalClient();
  const { requestId, ...workflowInput } = input;

  await client.workflow.start(humanApprovalWorkflow, {
    workflowId: `approval-${requestId}`,
    taskQueue: TASK_QUEUES.APPROVALS,
    args: [workflowInput],
  });

  return { workflowId: `approval-${requestId}` };
}

/** Sends a human's decision to a pending approval request. */
export async function sendApprovalDecision(
  requestId: string,
  decision: ApprovalDecision,
): Promise<void> {
  const client = await getTemporalClient();
  const handle = client.workflow.getHandle(`approval-${requestId}`);
  await handle.signal(approvalDecisionSignal, decision);
}

/** Reads current state (pending / decided) without waiting — safe to poll. */
export async function getApprovalState(
  requestId: string,
): Promise<{ pending: boolean; decision?: ApprovalDecision }> {
  const client = await getTemporalClient();
  const handle = client.workflow.getHandle(`approval-${requestId}`);
  return handle.query(approvalStateQuery);
}

/** Waits for the workflow to complete (approved, rejected, or timed out). */
export async function awaitApprovalResult(requestId: string): Promise<HumanApprovalWorkflowResult> {
  const client = await getTemporalClient();
  const handle = client.workflow.getHandle(`approval-${requestId}`);
  return handle.result();
}
