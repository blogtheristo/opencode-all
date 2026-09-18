import { describe, expect, it } from 'vitest';
import { makeTypedDecision, type TypedDecisionRequest } from '../../agents/kya-jev.js';
import type { AgentRuntimeContext } from '../../agents/types.js';
import type { LLMClient } from '../../agents/llm-client.js';

function fakeClient(replies: string[]): LLMClient {
  let i = 0;
  return {
    chat: async () => ({
      content: replies[Math.min(i++, replies.length - 1)],
      model: 'test',
      inputTokens: 0,
      outputTokens: 0,
      stopReason: 'end_turn' as const,
    }),
  } as unknown as LLMClient;
}

const allowedRuntime: AgentRuntimeContext = {
  name: 'seo-audit',
  autonomyPhase: 'silent_pilot',
  kya: { decision: 'allowed', trustScore: 90 },
};

const deniedRuntime: AgentRuntimeContext = {
  name: 'seo-audit',
  autonomyPhase: 'silent_pilot',
  kya: { decision: 'denied' },
};

const choiceQuestion: TypedDecisionRequest = {
  state: 'page has no canonical tag',
  question: {
    kind: 'choice',
    prompt: 'classify issue severity',
    options: ['critical', 'warning', 'info'],
  },
};

describe('kya-jev', () => {
  it('refuses to run without an allowed KYA verdict', async () => {
    const client = fakeClient(['{}']);
    await expect(makeTypedDecision(client, choiceQuestion, undefined)).rejects.toThrow(
      /KYA verdict/,
    );
    await expect(makeTypedDecision(client, choiceQuestion, deniedRuntime)).rejects.toThrow(
      /KYA verdict/,
    );
  });

  it('parses a valid choice decision', async () => {
    const client = fakeClient([
      '{"decision":"critical","probabilities":{"critical":0.7,"warning":0.2,"info":0.1},"confidence":0.7}',
    ]);
    const result = await makeTypedDecision(client, choiceQuestion, allowedRuntime);
    expect(result.decision).toBe('critical');
    expect(result.abstained).toBe(false);
    expect(result.calibration).toBe('self-reported-uncalibrated');
    expect(result.confidence).toBeCloseTo(0.7);
  });

  it('retries once on malformed output then succeeds', async () => {
    const client = fakeClient([
      'not json at all',
      '{"decision":"warning","probabilities":{"critical":0.1,"warning":0.8,"info":0.1},"confidence":0.8}',
    ]);
    const result = await makeTypedDecision(client, choiceQuestion, allowedRuntime);
    expect(result.decision).toBe('warning');
  });

  it('abstains after exhausting retries on invalid decisions', async () => {
    const client = fakeClient([
      '{"decision":"not-an-option","confidence":0.9}',
      '{"decision":"nope","confidence":0.5}',
    ]);
    const result = await makeTypedDecision(client, choiceQuestion, allowedRuntime);
    expect(result.abstained).toBe(true);
    expect(result.decision).toBe('__ABSTAIN__');
  });

  it('handles boolean questions', async () => {
    const client = fakeClient(['{"decision":"yes","probabilityYes":0.9,"confidence":0.9}']);
    const result = await makeTypedDecision(
      client,
      { state: 'x', question: { kind: 'boolean', prompt: 'is this a duplicate?' } },
      allowedRuntime,
    );
    expect(result.decision).toBe('yes');
    expect(result.probabilityYes).toBeCloseTo(0.9);
  });
});
