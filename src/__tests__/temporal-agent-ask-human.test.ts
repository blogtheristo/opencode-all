/**
 * Unit tests for the ask_human extension to agentLoopWorkflow (use case
 * #11's "agent→human" half — see docs/dws-use-cases.md's Ziggy's Durable
 * HITL Agents addendum). Covers src/temporal/agent-loop.ts's query/signal
 * helpers against a mocked client — not the Temporal runtime, and not the
 * in-workflow ask_human interception logic itself (that needs a live
 * Temporal Test Environment, unavailable in this sandbox — see the
 * activity-only test coverage note in agent-loop.workflow.ts's sibling
 * activities test for the same limitation applied consistently).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const signalMock = vi.fn(async () => undefined);
const queryMock = vi.fn(async () => 'What deadline should I use?');
const getHandleMock = vi.fn(() => ({ signal: signalMock, query: queryMock }));

vi.mock('../temporal/client.js', () => ({
  getTemporalClient: vi.fn(async () => ({ workflow: { getHandle: getHandleMock } })),
}));

describe('temporal/agent-loop — ask_human client helpers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reads the pending question via the correctly-keyed handle', async () => {
    const { getPendingAgentQuestion } = await import('../temporal/agent-loop.js');
    const question = await getPendingAgentQuestion('outreach-orchestrator-s1');

    expect(getHandleMock).toHaveBeenCalledWith('agent-loop-outreach-orchestrator-s1');
    expect(question).toBe('What deadline should I use?');
  });

  it('signals the answer via the correctly-keyed handle', async () => {
    const { answerAgentQuestion } = await import('../temporal/agent-loop.js');
    await answerAgentQuestion('outreach-orchestrator-s1', 'Use end of quarter.');

    expect(getHandleMock).toHaveBeenCalledWith('agent-loop-outreach-orchestrator-s1');
    expect(signalMock).toHaveBeenCalledWith(expect.anything(), 'Use end of quarter.');
  });
});
