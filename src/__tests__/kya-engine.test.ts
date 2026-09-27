// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-c-coverage Date=2026-09-27
// Audit trail: git log -- src/__tests__/kya-engine.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const emit = vi.hoisted(() => vi.fn());
vi.mock('../agents/event-bus.js', () => ({ eventBus: { emit } }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn() }));

const { evaluateSignal, executeDecision } = await import('../identity/kya-engine.js');

function payload(aml: 'approved' | 'declined', ongoing?: 'changed' | 'unchanged') {
  return {
    event: 'verification.status.changed',
    reference: 'session-1',
    verification_data: {
      aml_screening: { status: aml, filters: ['pep'] },
      ongoing_screening: ongoing ? { status: ongoing } : undefined,
    },
  };
}

describe('KYA policy engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_KEY;
  });

  it.each([
    ['declined', undefined, 'TERMINATE_CHAIN', 'SHUFTI_AML_DECLINE'],
    ['approved', 'changed', 'REVAL_LEASH', 'SHUFTI_ONGOING_CHANGED'],
    ['approved', 'unchanged', 'UPDATE_SCORE', 'SHUFTI_AML_APPROVED'],
  ] as const)('maps %s/%s to %s', (aml, ongoing, action, reason) => {
    expect(evaluateSignal(payload(aml, ongoing))).toMatchObject({
      action,
      reason,
      sessionId: 'session-1',
      details: { amlStatus: aml, ongoingStatus: ongoing ?? null, filters: ['pep'] },
    });
  });

  it('executes a decline as a forensic trust-chain termination', async () => {
    const decision = evaluateSignal(payload('declined'));
    const result = await executeDecision(decision);

    expect(result).toMatchObject({
      sessionId: 'session-1',
      reason: 'SHUFTI_AML_DECLINE',
      agentsTerminated: 0,
      forensicDump: true,
    });
    expect(emit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'kya.chain_terminated',
        priority: 'critical',
        sessionId: 'session-1',
      }),
    );
  });

  it.each([
    ['changed', 'kya.leash_tightened'],
    ['unchanged', 'kya.score_updated'],
  ] as const)('emits the downstream action for approved/%s', async (ongoing, type) => {
    await executeDecision(evaluateSignal(payload('approved', ongoing)));
    expect(emit).toHaveBeenCalledWith(expect.objectContaining({ type }));
  });
});
