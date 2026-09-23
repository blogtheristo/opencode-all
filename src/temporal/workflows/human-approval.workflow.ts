/**
 * Temporal Workflow — Human-in-the-Loop Approval Gate (Use case #9)
 *
 * TypeScript port of the pattern in temporalio/ai-cookbook
 * (agents/human_in_the_loop_python): a Signal handler receives the human's
 * decision, `condition()` pauses the workflow at zero compute cost until a
 * decision arrives or a timeout elapses, and the whole wait is a durable,
 * queryable, audited record — unlike DWS6's current "stop and ask in this
 * chat turn" gates (blog-draft-gate hook, Session Learning Outcome Rule
 * step 5), which only work if the HIC is in that live session and leave no
 * record if the session ends before they answer.
 *
 * Deliberately NOT wired into the blog-draft-gate hook or any other
 * compliance-critical RED-zone gate this session — those are policy-
 * enforced elsewhere (CLAUDE.md Non-Negotiable Rule 13) and a cutover needs
 * its own review. This is the general-purpose building block; see
 * docs/dws-use-cases.md use case #9.
 */
import {
  condition,
  defineQuery,
  defineSignal,
  proxyActivities,
  setHandler,
} from '@temporalio/workflow';
import type * as emailActivities from '../activities/email.activities.js';
import { TASK_QUEUES } from '../task-queues.js';

export interface ApprovalDecision {
  approved: boolean;
  decidedBy: string;
  note?: string;
  decidedAt?: string;
}

export interface HumanApprovalWorkflowInput {
  /** What's being approved — shown to the approver, stored in the durable record. */
  summary: string;
  requestedBy: string;
  /** Optional — if set, the workflow emails the approver when it starts waiting. */
  approverEmail?: string;
  /**
   * How long to wait for a decision before timing out. DWS approvals are
   * async human review (hours to days), not a live agent loop — default is
   * 7 days, not the cookbook's 5-minute demo default.
   */
  timeoutMs?: number;
}

export type HumanApprovalOutcome = 'approved' | 'rejected' | 'timed_out';

export interface HumanApprovalWorkflowResult {
  outcome: HumanApprovalOutcome;
  decision?: ApprovalDecision;
}

export const approvalDecisionSignal = defineSignal<[ApprovalDecision]>('approvalDecision');
export const approvalStateQuery = defineQuery<{ pending: boolean; decision?: ApprovalDecision }>(
  'approvalState',
);

const DEFAULT_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const { sendEmailActivity } = proxyActivities<typeof emailActivities>({
  taskQueue: TASK_QUEUES.EMAIL,
  startToCloseTimeout: '30 seconds',
  retry: { initialInterval: '5 seconds', maximumAttempts: 3 },
});

export async function humanApprovalWorkflow(
  input: HumanApprovalWorkflowInput,
): Promise<HumanApprovalWorkflowResult> {
  let decision: ApprovalDecision | undefined;

  setHandler(approvalDecisionSignal, (received) => {
    decision = { ...received, decidedAt: received.decidedAt ?? new Date().toISOString() };
  });
  setHandler(approvalStateQuery, () => ({ pending: decision === undefined, decision }));

  if (input.approverEmail) {
    // Best-effort notification — a failed send should not block the wait
    // itself; the approval record is durable regardless of whether the
    // email arrives.
    try {
      await sendEmailActivity({
        from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
        to: input.approverEmail,
        subject: `Approval needed: ${input.summary}`,
        html: `<p>${input.requestedBy} requested approval: <strong>${input.summary}</strong></p>`,
        text: `${input.requestedBy} requested approval: ${input.summary}`,
      });
    } catch {
      // Notification failure is not fatal to the approval gate itself.
    }
  }

  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const decided = await condition(() => decision !== undefined, timeoutMs);

  if (!decided || !decision) {
    return { outcome: 'timed_out' };
  }

  return { outcome: decision.approved ? 'approved' : 'rejected', decision };
}
