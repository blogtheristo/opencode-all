// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=pr-2125-review Date=2026-09-27
// Audit trail: git log -- src/__tests__/agents/browse-step-kya-jev.test.ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { adviseBrowseStep, MAX_CANDIDATES, MAX_HISTORY } from '../../agents/browse-step-kya-jev.js';
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

function fakeClient(replies: string[], seen: string[] = []): LLMClient {
  let i = 0;
  return {
    chat: async (messages: { content: string }[]) => {
      seen.push(messages[0].content);
      return {
        content: replies[Math.min(i++, replies.length - 1)],
        model: 'test',
        inputTokens: 0,
        outputTokens: 0,
        stopReason: 'end_turn' as const,
      };
    },
  } as unknown as LLMClient;
}

function signedRuntime(): AgentRuntimeContext {
  return {
    name: 'browse-step-advisory',
    autonomyPhase: 'silent_pilot',
    kya: issueKyaVerdict({ decision: 'allowed', trustScore: 80 }),
  };
}

const nodes = [
  { role: 'heading', name: 'Book a demo', level: 1 },
  { role: 'textbox', name: 'Email' },
  { role: 'button', name: 'Submit' },
  { role: 'link', name: '' },
];

describe('browse-step kya-jev advisory', () => {
  it('refuses without a signed KYA verdict', async () => {
    const client = fakeClient(['{"decision":"n0","confidence":0.5}']);
    await expect(adviseBrowseStep(client, { goal: 'g', nodes }, undefined)).rejects.toThrow(
      /KYA verdict/,
    );
  });

  it('offers only named actionable nodes and flags text fields', async () => {
    const seen: string[] = [];
    const client = fakeClient(['{"decision":"n0","confidence":0.7}'], seen);
    const out = await adviseBrowseStep(client, { goal: 'Book a demo', nodes }, signedRuntime());
    expect(seen[0]).toContain('"id":"n1","role":"button","name":"Submit"');
    expect(seen[0]).not.toContain('heading');
    expect(out.action).toEqual({ type: 'act', node: nodes[1], needsText: true });
    expect(out.actionable).toBe(false);
  });

  it('maps done, and turns abstention into stuck', async () => {
    const done = await adviseBrowseStep(
      fakeClient(['{"decision":"done","confidence":0.9}']),
      { goal: 'g', nodes },
      signedRuntime(),
    );
    expect(done.action).toEqual({ type: 'done' });

    const abstained = await adviseBrowseStep(
      fakeClient(['not json', '{"decision":"n99","confidence":0.9}']),
      { goal: 'g', nodes },
      signedRuntime(),
    );
    expect(abstained.result.abstained).toBe(true);
    expect(abstained.action).toEqual({ type: 'stuck' });
  });

  it('ignores malformed snapshot nodes instead of throwing', async () => {
    const seen: string[] = [];
    const malformed = [
      { role: 'button', name: undefined },
      { role: undefined, name: 'Missing role' },
      { role: 'button', name: 'Continue' },
    ] as unknown as typeof nodes;

    const out = await adviseBrowseStep(
      fakeClient(['{"decision":"n0","confidence":0.8}'], seen),
      { goal: 'Continue', nodes: malformed },
      signedRuntime(),
    );

    expect(seen[0]).not.toContain('Missing role');
    expect(out.action).toEqual({ type: 'act', node: malformed[2], needsText: false });
  });

  it('keeps only the most recent bounded history', async () => {
    const seen: string[] = [];
    const history = Array.from({ length: MAX_HISTORY + 5 }, (_, i) => `step-${i}`);

    await adviseBrowseStep(
      fakeClient(['{"decision":"done","confidence":0.8}'], seen),
      { goal: 'g', nodes, history },
      signedRuntime(),
    );

    expect(seen[0]).not.toContain('step-4"');
    expect(seen[0]).toContain('step-5"');
    expect(seen[0]).toContain(`step-${MAX_HISTORY + 4}`);
  });

  it('caps candidates so large pages stay a bounded choice', async () => {
    const seen: string[] = [];
    const many = Array.from({ length: MAX_CANDIDATES + 10 }, (_, i) => ({
      role: 'link',
      name: `L${i}`,
    }));
    await adviseBrowseStep(
      fakeClient(['{"decision":"stuck","confidence":0.5}'], seen),
      { goal: 'g', nodes: many },
      signedRuntime(),
    );
    expect(seen[0]).toContain(`"n${MAX_CANDIDATES - 1}"`);
    expect(seen[0]).not.toContain(`"n${MAX_CANDIDATES}"`);
  });
});
