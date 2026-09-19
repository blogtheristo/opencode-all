import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { makeTypedDecision, type TypedDecisionRequest } from '../../agents/kya-jev.js';
import type { AgentRuntimeContext } from '../../agents/types.js';
import type { LLMClient } from '../../agents/llm-client.js';
import { issueKyaVerdict } from '../../security/runtime-auth.js';

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

const choiceQuestion: TypedDecisionRequest = {
  state: 'page has no canonical tag',
  question: {
    kind: 'choice',
    prompt: 'classify issue severity',
    options: ['critical', 'warning', 'info'],
  },
};

const ORIGINAL_SECRET = process.env.KYA_VERDICT_SIGNING_SECRET;

beforeEach(() => {
  process.env.KYA_VERDICT_SIGNING_SECRET = 'test-signing-secret-do-not-use-in-prod';
});

afterEach(() => {
  if (ORIGINAL_SECRET === undefined) delete process.env.KYA_VERDICT_SIGNING_SECRET;
  else process.env.KYA_VERDICT_SIGNING_SECRET = ORIGINAL_SECRET;
});

function runtimeWith(kya: AgentRuntimeContext['kya']): AgentRuntimeContext {
  return { name: 'seo-audit', autonomyPhase: 'silent_pilot', kya };
}

describe('kya-jev', () => {
  it('refuses to run with no verdict at all', async () => {
    const client = fakeClient(['{}']);
    await expect(makeTypedDecision(client, choiceQuestion, undefined)).rejects.toThrow(
      /KYA verdict/,
    );
    await expect(
      makeTypedDecision(
        client,
        choiceQuestion,
        runtimeWith(issueKyaVerdict({ decision: 'denied' })),
      ),
    ).rejects.toThrow(/KYA verdict/);
  });

  it('refuses a hand-constructed, unsigned "allowed" verdict — the actual A2 threat', async () => {
    const client = fakeClient(['{}']);
    const forged: AgentRuntimeContext = runtimeWith({ decision: 'allowed', trustScore: 100 });
    await expect(makeTypedDecision(client, choiceQuestion, forged)).rejects.toThrow(
      /signature verification/,
    );
  });

  it('refuses a tampered signed verdict (trustScore mutated after signing)', async () => {
    const client = fakeClient(['{}']);
    const verdict = issueKyaVerdict({ decision: 'allowed', trustScore: 10 });
    const tampered = { ...verdict, trustScore: 99 };
    await expect(makeTypedDecision(client, choiceQuestion, runtimeWith(tampered))).rejects.toThrow(
      /signature verification/,
    );
  });

  it('refuses any verdict when no signing secret is configured (fail closed)', async () => {
    delete process.env.KYA_VERDICT_SIGNING_SECRET;
    const client = fakeClient(['{}']);
    const verdict = issueKyaVerdict({ decision: 'allowed', trustScore: 90 }); // issued unsigned, secret missing
    await expect(makeTypedDecision(client, choiceQuestion, runtimeWith(verdict))).rejects.toThrow(
      /signature verification/,
    );
  });

  it('accepts a properly issued and signed "allowed" verdict', async () => {
    const client = fakeClient([
      '{"decision":"critical","probabilities":{"critical":0.7,"warning":0.2,"info":0.1},"confidence":0.7}',
    ]);
    const verdict = issueKyaVerdict({ decision: 'allowed', trustScore: 90 });
    const result = await makeTypedDecision(client, choiceQuestion, runtimeWith(verdict));
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
    const verdict = issueKyaVerdict({ decision: 'allowed' });
    const result = await makeTypedDecision(client, choiceQuestion, runtimeWith(verdict));
    expect(result.decision).toBe('warning');
  });

  it('abstains after exhausting retries on invalid decisions', async () => {
    const client = fakeClient([
      '{"decision":"not-an-option","confidence":0.9}',
      '{"decision":"nope","confidence":0.5}',
    ]);
    const verdict = issueKyaVerdict({ decision: 'allowed' });
    const result = await makeTypedDecision(client, choiceQuestion, runtimeWith(verdict));
    expect(result.abstained).toBe(true);
    expect(result.decision).toBe('__ABSTAIN__');
  });

  it('handles boolean questions', async () => {
    const client = fakeClient(['{"decision":"yes","probabilityYes":0.9,"confidence":0.9}']);
    const verdict = issueKyaVerdict({ decision: 'allowed' });
    const result = await makeTypedDecision(
      client,
      { state: 'x', question: { kind: 'boolean', prompt: 'is this a duplicate?' } },
      runtimeWith(verdict),
    );
    expect(result.decision).toBe('yes');
    expect(result.probabilityYes).toBeCloseTo(0.9);
  });
});
