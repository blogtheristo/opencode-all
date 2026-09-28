import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { issueKyaVerdict } from '../../security/runtime-auth.js';
import type { LLMClient } from '../../agents/llm-client.js';
import { makeTypedDecision } from '../../agents/kya-jev.js';

function fakeClient(replies: string[]): LLMClient {
  let i = 0;
  return {
    chat: async () => ({
      content: replies[Math.min(i++, replies.length - 1)],
      model: 'test-model',
      inputTokens: 0,
      outputTokens: 0,
      stopReason: 'end_turn' as const,
    }),
  } as unknown as LLMClient;
}

const choiceQuestion = {
  state: 'page has no canonical tag',
  question: {
    kind: 'choice' as const,
    prompt: 'classify issue severity',
    options: ['critical', 'warning', 'info'],
  },
};

const booleanQuestion = {
  state: 'duplicate detection context',
  question: {
    kind: 'boolean' as const,
    prompt: 'is this a duplicate?',
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
  return { name: 'test-agent', autonomyPhase: 'silent_pilot', kya };
}

type KyaJevAuditRecord = {
  questionKind: 'choice' | 'score' | 'boolean';
  questionPrompt: string;
  decision: string;
  probabilities?: Record<string, number>;
  confidence: number;
  calibration: 'self-reported-uncalibrated';
  abstained: boolean;
  model?: string;
};

type KyaJevAuditSink = (record: KyaJevAuditRecord) => Promise<void>;

function makeAuditSink(
  callback: (record: KyaJevAuditRecord) => void,
): KyaJevAuditSink {
  return async (record) => {
    callback(record);
  };
}

describe('kya-jev audit', () => {
  it('calls audit sink with correct record on successful decision', async () => {
    const records: KyaJevAuditRecord[] = [];
    const sink = makeAuditSink((r) => records.push(r));
    const client = fakeClient([
      '{"decision":"critical","probabilities":{"critical":0.7,"warning":0.2,"info":0.1},"confidence":0.7}',
    ]);
    const verdict = issueKyaVerdict({ decision: 'allowed', trustScore: 90 });
    const result = await makeTypedDecision(client, choiceQuestion, runtimeWith(verdict), sink);

    expect(result.decision).toBe('critical');
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      questionKind: 'choice',
      decision: 'critical',
      confidence: 0.7,
      model: 'test-model',
    });
  });

  it('calls audit sink with abstention record on exhausted retries', async () => {
    const records: KyaJevAuditRecord[] = [];
    const sink = makeAuditSink((r) => records.push(r));
    const client = fakeClient([
      '{"decision":"not-an-option","confidence":0.9}',
      '{"decision":"nope","confidence":0.5}',
    ]);
    const verdict = issueKyaVerdict({ decision: 'allowed' });
    const result = await makeTypedDecision(client, choiceQuestion, runtimeWith(verdict), sink);

    expect(result.abstained).toBe(true);
    expect(result.decision).toBe('__ABSTAIN__');
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      questionKind: 'choice',
      decision: '__ABSTAIN__',
      abstained: true,
      model: 'test-model',
    });
  });

  it('does not call audit sink when optional parameter omitted', async () => {
    const client = fakeClient([
      '{"decision":"warning","probabilities":{"critical":0.1,"warning":0.8,"info":0.1},"confidence":0.8}',
    ]);
    const verdict = issueKyaVerdict({ decision: 'allowed' });
    const result = await makeTypedDecision(client, choiceQuestion, runtimeWith(verdict));

    expect(result.decision).toBe('warning');
  });

  it('handles audit sink throw without propagating', async () => {
    const sink = async (_record: KyaJevAuditRecord) => {
      throw new Error('Audit write failed');
    };
    const client = fakeClient([
      '{"decision":"info","probabilities":{"critical":0.1,"warning":0.1,"info":0.8},"confidence":0.8}',
    ]);
    const verdict = issueKyaVerdict({ decision: 'allowed' });
    const result = await makeTypedDecision(client, choiceQuestion, runtimeWith(verdict), sink);

    expect(result.decision).toBe('info');
  });

  it('calls audit sink with correct record on boolean question', async () => {
    const records: KyaJevAuditRecord[] = [];
    const sink = makeAuditSink((r) => records.push(r));
    const client = fakeClient(['{"decision":"yes","probabilityYes":0.9,"confidence":0.9}']);
    const verdict = issueKyaVerdict({ decision: 'allowed' });
    const result = await makeTypedDecision(client, booleanQuestion, runtimeWith(verdict), sink);

    expect(result.decision).toBe('yes');
    expect(result.probabilityYes).toBeCloseTo(0.9);
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      questionKind: 'boolean',
      decision: 'yes',
      model: 'test-model',
    });
  });

  it('includes probabilities in audit record when present', async () => {
    const records: KyaJevAuditRecord[] = [];
    const sink = makeAuditSink((r) => records.push(r));
    const client = fakeClient([
      '{"decision":"critical","probabilities":{"critical":0.7,"warning":0.2,"info":0.1},"confidence":0.7}',
    ]);
    const verdict = issueKyaVerdict({ decision: 'allowed' });
    await makeTypedDecision(client, choiceQuestion, runtimeWith(verdict), sink);

    expect(records[0].probabilities).toEqual({
      critical: 0.7,
      warning: 0.2,
      info: 0.1,
    });
  });
});
