/**
 * Unit tests for the outreach-full Step 3 cutover (docs/dws-use-cases.md §10):
 * src/temporal/activities/outreach.activities.ts and src/temporal/outreach.ts.
 * Mocks agentRegistry and the Temporal client; verifies wiring, not the
 * Temporal runtime or the actual outreach-executor agent behavior (already
 * covered by its own agent's tests/logic).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../agents/index.js', () => ({
  agentRegistry: { executeAgent: vi.fn() },
}));

const startMock = vi.fn(async (_wf: unknown, opts: { workflowId: string }) => ({
  workflowId: opts.workflowId,
}));

vi.mock('../temporal/client.js', () => ({
  getTemporalClient: vi.fn(async () => ({ workflow: { start: startMock } })),
}));

describe('temporal/activities/outreach.activities', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns ok when outreach-executor succeeds', async () => {
    const { agentRegistry } = await import('../agents/index.js');
    (agentRegistry.executeAgent as ReturnType<typeof vi.fn>).mockResolvedValue({
      result: { ok: true, detail: 'sent via SES' },
    });

    const { sendOutreachThreadActivity } =
      await import('../temporal/activities/outreach.activities.js');
    const result = await sendOutreachThreadActivity({
      threadId: 't1',
      toEmail: 'buyer@example.com',
      toName: 'Buyer',
      channel: 'email',
      approvedBy: 'Risto',
      context: { projectId: 'p1', userId: 'u1', orgId: 'o1', sessionId: 's1' },
    });

    expect(result).toEqual({ threadId: 't1', ok: true, detail: 'sent via SES' });
    expect(agentRegistry.executeAgent).toHaveBeenCalledWith(
      'outreach-executor',
      expect.objectContaining({ sessionId: 's1' }),
      expect.objectContaining({ threadId: 't1', approvedBy: 'Risto' }),
    );
  });

  it('throws a retryable failure when outreach-executor reports a failed send', async () => {
    const { agentRegistry } = await import('../agents/index.js');
    (agentRegistry.executeAgent as ReturnType<typeof vi.fn>).mockResolvedValue({
      result: { ok: false, detail: 'SMTP timeout' },
    });

    const { sendOutreachThreadActivity } =
      await import('../temporal/activities/outreach.activities.js');
    await expect(
      sendOutreachThreadActivity({
        threadId: 't2',
        toEmail: 'buyer@example.com',
        toName: 'Buyer',
        channel: 'email',
        approvedBy: 'Risto',
        context: { projectId: 'p1', userId: 'u1', orgId: 'o1', sessionId: 's1' },
      }),
    ).rejects.toMatchObject({ nonRetryable: false });
  });
});

describe('temporal/outreach starter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keys the Workflow ID off approvalRequestId and returns immediately', async () => {
    const { startOutreachApprovalAndSend } = await import('../temporal/outreach.js');

    const result = await startOutreachApprovalAndSend({
      approvalRequestId: 'outreach-s1-123',
      threadIds: ['t1', 't2'],
      toEmail: 'buyer@example.com',
      toName: 'Buyer',
      channel: 'email',
      requestedBy: 'agent',
      context: { projectId: 'p1', userId: 'u1', orgId: 'o1', sessionId: 's1' },
    });

    expect(result).toEqual({
      workflowId: 'outreach-send-outreach-s1-123',
      approvalRequestId: 'outreach-s1-123',
    });
    expect(startMock).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        workflowId: 'outreach-send-outreach-s1-123',
        taskQueue: 'dws-outreach',
      }),
    );
  });
});
