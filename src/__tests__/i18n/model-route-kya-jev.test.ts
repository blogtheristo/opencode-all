import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { adviseModelRoute } from '../../agents/model-route-kya-jev.js';
import { selectModel } from '../../agents/model-selector.js';
import { issueKyaVerdict } from '../../security/runtime-auth.js';
import type { AgentRuntimeContext } from '../../agents/types.js';
import type { LLMClient } from '../../agents/llm-client.js';

const ORIGINAL_SECRET = process.env.KYA_VERDICT_SIGNING_SECRET;

beforeEach(() => {
  process.env.KYA_VERDICT_SIGNING_SECRET = 'test-signing-secret-do-not-use-in-prod';
});

afterEach(() => {
  if (ORIGINAL_SECRET === undefined) delete process.env.KYA_VERDICT_SIGNING_SECRET;
  else process.env.KYA_VERDICT_SIGNING_SECRET = ORIGINAL_SECRET;
});

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

function runtimeWith(kya: AgentRuntimeContext['kya']): AgentRuntimeContext {
  return { name: 'model-route-advisory', autonomyPhase: 'silent_pilot', kya };
}

describe('model-route kya-jev advisory', () => {
  it('refuses unsigned or missing KYA', async () => {
    const client = fakeClient([
      '{"decision":"stay","probabilities":{"stay":0.8,"escalate":0.1,"demote":0.1},"confidence":0.4}',
    ]);
    await expect(
      adviseModelRoute(client, { kind: 'tier_hint', state: '{}' }, undefined),
    ).rejects.toThrow(/KYA verdict/);
    await expect(
      adviseModelRoute(
        client,
        { kind: 'tier_hint', state: '{}' },
        runtimeWith({ decision: 'allowed', trustScore: 99 }),
      ),
    ).rejects.toThrow(/signature verification/);
  });

  it('does not change selectModel() and stays advisory', async () => {
    const picked = selectModel('seo-audit', { estimatedInputTokens: 1000 });
    const before = { ...picked };
    const client = fakeClient([
      '{"decision":"escalate","probabilities":{"stay":0.1,"escalate":0.8,"demote":0.1},"confidence":0.5}',
    ]);
    const out = await adviseModelRoute(
      client,
      {
        kind: 'tier_hint',
        state: JSON.stringify({
          agentName: 'seo-audit',
          modelId: picked.modelId,
          tier: picked.tier,
          contextWindow: picked.contextWindow,
          requiredContextTokens: picked.requiredContextTokens,
        }),
      },
      runtimeWith(issueKyaVerdict({ decision: 'allowed', trustScore: 80 })),
    );
    expect(out.actionable).toBe(false);
    expect(out.result.decision).toBe('escalate');
    expect(selectModel('seo-audit', { estimatedInputTokens: 1000 }).modelId).toBe(before.modelId);
  });
});
