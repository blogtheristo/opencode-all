/**
 * Temporal Workflow — Outreach Approval + Send (wires outreach-full's Step 3
 * — see docs/dws-use-cases.md §10)
 *
 * Composes humanApprovalWorkflow (use case #9) as a child Workflow with
 * sendOutreachThreadActivity (use case #1's send pattern, applied here) —
 * this is the real cutover the §10 audit flagged: outreach-orchestrator's
 * Step 3 used to trust a caller-supplied `approvedBy` string with no
 * independent record; that gate is now this Workflow's child
 * humanApprovalWorkflow, decided via `npm run temporal:approve`.
 */
import { executeChild, proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/outreach.activities.js';
import { humanApprovalWorkflow } from './human-approval.workflow.js';
import type { AgentContext } from '../../agents/types.js';

const { sendOutreachThreadActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
  retry: { initialInterval: '5 seconds', backoffCoefficient: 2, maximumAttempts: 5 },
});

export interface OutreachApprovalSendWorkflowInput {
  /**
   * Stable ID for the embedded approval request — becomes the child
   * Workflow's ID (`approval-${approvalRequestId}`), matching what
   * `npm run temporal:approve -- <requestId> --approve --by "<name>"`
   * (src/temporal/approvals.ts, use case #9) expects to find.
   */
  approvalRequestId: string;
  threadIds: string[];
  toEmail: string;
  toName: string;
  channel: 'email' | 'linkedin';
  requestedBy: string;
  approverEmail?: string;
  context: AgentContext;
  /** Approval wait timeout — defaults to humanApprovalWorkflow's own 7 days. */
  approvalTimeoutMs?: number;
}

export interface OutreachApprovalSendWorkflowResult {
  outcome: 'approved' | 'rejected' | 'timed_out';
  sent: Array<{ threadId: string; ok: boolean; detail: string }>;
  failedThreadIds: string[];
}

export async function outreachApprovalSendWorkflow(
  input: OutreachApprovalSendWorkflowInput,
): Promise<OutreachApprovalSendWorkflowResult> {
  const approval = await executeChild(humanApprovalWorkflow, {
    workflowId: `approval-${input.approvalRequestId}`,
    args: [
      {
        summary: `Send ${input.threadIds.length} outreach email(s) to ${input.toEmail} (requested by ${input.requestedBy})`,
        requestedBy: input.requestedBy,
        approverEmail: input.approverEmail,
        timeoutMs: input.approvalTimeoutMs,
      },
    ],
  });

  if (approval.outcome !== 'approved') {
    return { outcome: approval.outcome, sent: [], failedThreadIds: [] };
  }

  const sent: Array<{ threadId: string; ok: boolean; detail: string }> = [];
  const failedThreadIds: string[] = [];

  for (const threadId of input.threadIds) {
    try {
      const result = await sendOutreachThreadActivity({
        threadId,
        toEmail: input.toEmail,
        toName: input.toName,
        channel: input.channel,
        approvedBy: approval.decision?.decidedBy ?? input.requestedBy,
        context: input.context,
      });
      sent.push(result);
    } catch {
      failedThreadIds.push(threadId);
    }
  }

  return { outcome: 'approved', sent, failedThreadIds };
}
