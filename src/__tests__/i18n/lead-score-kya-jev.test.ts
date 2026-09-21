import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { adviseLeadScore } from '../../agents/lead-score-kya-jev.js';
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
  return { name: 'lead-score-advisory', autonomyPhase: 'silent_pilot', kya };
}

const nccState = JSON.stringify({
  name: 'NCC',
  domain: 'ncc.com',
  industry: 'construction',
  region: 'SE',
  regulations: ['CSRD', 'EU-Taxonomy'],
  icp: 'Nordic construction CSO CSRD',
});

describe('lead-score kya-jev advisory', () => {
  it('refuses unsigned or missing KYA', async () => {
    const client = fakeClient([
      '{"decision":"watch","probabilities":{"discard":0.1,"watch":0.8,"call":0.1},"confidence":0.4}',
    ]);
    await expect(
      adviseLeadScore(client, { kind: 'callback_priority', state: nccState }, undefined),
    ).rejects.toThrow(/KYA verdict/);
    await expect(
      adviseLeadScore(
        client,
        { kind: 'callback_priority', state: nccState },
        runtimeWith({ decision: 'allowed', trustScore: 99 }),
      ),
    ).rejects.toThrow(/signature verification/);
  });

  it('returns advisory-only score under a signed allowed verdict', async () => {
    const client = fakeClient([
      '{"decision":"call","probabilities":{"discard":0.05,"watch":0.2,"call":0.75},"confidence":0.5}',
    ]);
    const out = await adviseLeadScore(
      client,
      { kind: 'callback_priority', state: nccState },
      runtimeWith(issueKyaVerdict({ decision: 'allowed', trustScore: 80 })),
    );
    expect(out.actionable).toBe(false);
    expect(out.result.calibration).toBe('self-reported-uncalibrated');
    expect(out.result.decision).toBe('call');
  });
});
