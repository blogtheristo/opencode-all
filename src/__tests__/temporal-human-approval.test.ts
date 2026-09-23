/**
 * Unit tests for src/temporal/approvals.ts — the client-side helpers around
 * the human-approval Workflow (see src/temporal/workflows/human-approval.workflow.ts,
 * a TS port of temporalio/ai-cookbook's human_in_the_loop_python example).
 * Mocks the Temporal client; verifies workflowId keying and call wiring,
 * not the Temporal runtime (needs a live server for that).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const startMock = vi.fn(async () => ({}));
const signalMock = vi.fn(async () => undefined);
const queryMock = vi.fn(async () => ({ pending: true }));
const resultMock = vi.fn(async () => ({ outcome: 'approved' }));
const getHandleMock = vi.fn(() => ({ signal: signalMock, query: queryMock, result: resultMock }));

vi.mock('../temporal/client.js', () => ({
  getTemporalClient: vi.fn(async () => ({
    workflow: { start: startMock, getHandle: getHandleMock },
  })),
}));

describe('temporal/approvals', () => {
  beforeEach(() => vi.clearAllMocks());

  it('starts the workflow with a namespaced workflowId derived from requestId', async () => {
    const { startApprovalRequest } = await import('../temporal/approvals.js');
    const { workflowId } = await startApprovalRequest({
      requestId: 'blog-2026-09-24-launch',
      summary: 'Publish launch post',
      requestedBy: 'agent',
    });

    expect(workflowId).toBe('approval-blog-2026-09-24-launch');
    expect(startMock).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        workflowId: 'approval-blog-2026-09-24-launch',
        taskQueue: 'dws-approvals',
      }),
    );
  });

  it('signals the correctly-keyed handle with the decision', async () => {
    const { sendApprovalDecision } = await import('../temporal/approvals.js');
    await sendApprovalDecision('blog-2026-09-24-launch', { approved: true, decidedBy: 'Risto' });

    expect(getHandleMock).toHaveBeenCalledWith('approval-blog-2026-09-24-launch');
    expect(signalMock).toHaveBeenCalledWith(expect.anything(), {
      approved: true,
      decidedBy: 'Risto',
    });
  });

  it('queries state without waiting', async () => {
    const { getApprovalState } = await import('../temporal/approvals.js');
    const state = await getApprovalState('blog-2026-09-24-launch');

    expect(state).toEqual({ pending: true });
    expect(queryMock).toHaveBeenCalled();
  });

  it('awaits the final result', async () => {
    const { awaitApprovalResult } = await import('../temporal/approvals.js');
    const result = await awaitApprovalResult('blog-2026-09-24-launch');

    expect(result).toEqual({ outcome: 'approved' });
  });
});
