import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { adviseDictionaryTerm } from '../../agents/dictionary-kya-jev.js';
import { issueKyaVerdict } from '../../security/runtime-auth.js';
import type { AgentRuntimeContext } from '../../agents/types.js';
import type { LLMClient } from '../../agents/llm-client.js';

const ROOT = join(__dirname, '../../..');
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
  return { name: 'dictionary-advisory', autonomyPhase: 'silent_pilot', kya };
}

describe('dictionary kya-jev advisory', () => {
  it('refuses unsigned or missing KYA — same A2 gate as kya-jev', async () => {
    const client = fakeClient(['{"decision":"no","probabilityYes":0.1,"confidence":0.2}']);
    await expect(
      adviseDictionaryTerm(
        client,
        { kind: 'sv_display_safe', state: '{"sv":"Suverän"}' },
        undefined,
      ),
    ).rejects.toThrow(/KYA verdict/);
    await expect(
      adviseDictionaryTerm(
        client,
        { kind: 'sv_display_safe', state: '{"sv":"Suverän"}' },
        runtimeWith({ decision: 'allowed', trustScore: 99 }),
      ),
    ).rejects.toThrow(/signature verification/);
  });

  it('returns advisory-only result under a signed allowed verdict', async () => {
    const client = fakeClient(['{"decision":"no","probabilityYes":0.05,"confidence":0.4}']);
    const out = await adviseDictionaryTerm(
      client,
      { kind: 'sv_display_safe', state: '{"sv":"Suverän"}' },
      runtimeWith(issueKyaVerdict({ decision: 'allowed', trustScore: 80 })),
    );
    expect(out.actionable).toBe(false);
    expect(out.result.calibration).toBe('self-reported-uncalibrated');
    expect(out.result.decision).toBe('no');
  });

  it('dictionary SKU and price match products.json (no invented price)', () => {
    const dict = JSON.parse(
      readFileSync(join(ROOT, 'docs/localization/dws-dictionary.json'), 'utf8'),
    ) as {
      kyaJev: { sku: string; specVersion: string };
      shared: { sku_kya_jev_001: { en: string } };
    };
    const products = JSON.parse(
      readFileSync(join(ROOT, 'dws10.com/config/products.json'), 'utf8'),
    ) as { products: Record<string, { price: number; currency: string }> };
    expect(dict.kyaJev.specVersion).toBe('0.6');
    expect(dict.kyaJev.sku).toBe('KYA-JEV-001');
    expect(dict.shared.sku_kya_jev_001.en).toBe('KYA-JEV-001');
    expect(products.products['KYA-JEV-001'].price).toBe(99);
    expect(products.products['KYA-JEV-001'].currency).toBe('EUR');
  });
});
