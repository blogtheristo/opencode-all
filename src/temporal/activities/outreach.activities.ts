/**
 * Temporal Activity — Outreach Thread Send (wires outreach-full's Step 3 —
 * see docs/dws-use-cases.md §10)
 *
 * Thin wrap of the existing outreach-executor agent (fetch thread, send via
 * SES, update status, log activity — src/agents/outreach-executor.agent.ts)
 * via agentRegistry, the same way any in-process caller invokes it. No send
 * logic is duplicated here; this Activity only adds retry/durability around
 * the existing call, replacing the un-wired, retry-less
 * `agentRegistry.executeAgent('outreach-executor', ...)` call that
 * previously ran directly inside outreach-orchestrator.agent.ts's Step 3.
 */
import { ApplicationFailure } from '@temporalio/activity';
import { agentRegistry } from '../../agents/index.js';
import type { AgentContext } from '../../agents/types.js';

export interface SendOutreachThreadInput {
  threadId: string;
  toEmail: string;
  toName: string;
  channel: 'email' | 'linkedin';
  approvedBy: string;
  context: AgentContext;
}

export interface SendOutreachThreadResult {
  threadId: string;
  ok: boolean;
  detail: string;
}

export async function sendOutreachThreadActivity(
  input: SendOutreachThreadInput,
): Promise<SendOutreachThreadResult> {
  const response = await agentRegistry.executeAgent('outreach-executor', input.context, {
    threadId: input.threadId,
    toEmail: input.toEmail,
    toName: input.toName,
    channel: input.channel,
    approvedBy: input.approvedBy,
  });

  const result = response.result as { ok?: boolean; detail?: string };
  if (!result.ok) {
    throw ApplicationFailure.create({
      message: `Outreach send failed for thread ${input.threadId}: ${result.detail || 'unknown error'}`,
      type: 'OutreachSendError',
      nonRetryable: false,
    });
  }

  return { threadId: input.threadId, ok: true, detail: result.detail || 'sent' };
}
