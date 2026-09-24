/**
 * Unit tests for src/temporal/activities/agent-loop.activities.ts — the TS
 * port of temporalio/ai-cookbook's agentic_loop_tool_call_claude_python
 * Activities. Mocks the LLM client and tool executor; verifies wrapper
 * behavior (config-missing → non-retryable failure, call failure →
 * retryable failure), not the Temporal runtime.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../agents/llm-client.js', () => ({
  createLLMClient: vi.fn(),
}));

vi.mock('../agents/tools.js', () => ({
  executeTools: vi.fn(),
}));

describe('temporal/activities/agent-loop.activities', () => {
  beforeEach(() => vi.clearAllMocks());

  it('throws non-retryable when no LLM provider is configured', async () => {
    const { createLLMClient } = await import('../agents/llm-client.js');
    (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { callAgentLLMActivity } =
      await import('../temporal/activities/agent-loop.activities.js');
    await expect(
      callAgentLLMActivity({ agentModel: 'claude', messages: [], tools: [] }),
    ).rejects.toMatchObject({ nonRetryable: true });
  });

  it('returns the LLM response on success', async () => {
    const { createLLMClient } = await import('../agents/llm-client.js');
    const chat = vi.fn(async () => ({
      content: 'hello',
      model: 'claude-sonnet-5',
      inputTokens: 10,
      outputTokens: 5,
      stopReason: 'end_turn' as const,
    }));
    (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
      chat,
      model: 'claude-sonnet-5',
    });

    const { callAgentLLMActivity } =
      await import('../temporal/activities/agent-loop.activities.js');
    const result = await callAgentLLMActivity({
      agentModel: 'claude',
      messages: [{ role: 'user', content: 'hi' }],
      tools: [],
    });

    expect(result.content).toBe('hello');
    expect(chat).toHaveBeenCalledWith([{ role: 'user', content: 'hi' }], []);
  });

  it('throws a retryable failure when the LLM call itself errors', async () => {
    const { createLLMClient } = await import('../agents/llm-client.js');
    (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
      chat: vi.fn(async () => {
        throw new Error('timeout');
      }),
      model: 'claude-sonnet-5',
    });

    const { callAgentLLMActivity } =
      await import('../temporal/activities/agent-loop.activities.js');
    await expect(
      callAgentLLMActivity({ agentModel: 'claude', messages: [], tools: [] }),
    ).rejects.toMatchObject({ nonRetryable: false });
  });

  it('delegates tool execution to executeTools', async () => {
    const { executeTools } = await import('../agents/tools.js');
    (executeTools as ReturnType<typeof vi.fn>).mockResolvedValue([
      { toolCallId: 'call-1', name: 'query_database', result: { ok: true }, isError: false },
    ]);

    const { executeAgentToolCallsActivity } =
      await import('../temporal/activities/agent-loop.activities.js');
    const result = await executeAgentToolCallsActivity({
      toolCalls: [{ id: 'call-1', name: 'query_database', arguments: {} }],
      context: { projectId: 'p1', userId: 'u1', orgId: 'o1', sessionId: 's1' },
    });

    expect(result).toEqual([
      { toolCallId: 'call-1', name: 'query_database', result: { ok: true }, isError: false },
    ]);
  });
});
