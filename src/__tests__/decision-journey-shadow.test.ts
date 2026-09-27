// Evidence: Tool=Claude Code 2.1.281 Model=anthropic/undisclosed-by-runtime-policy Agent=claude-code-standby Date=2026-09-24
// Audit trail: git log -- src/__tests__/decision-journey-shadow.test.ts
/**
 * Decision Journey Phase 1 + Helpdesk shadow mode — intent tests.
 *
 * Intent verified:
 * - shadow mode never claims authority it cannot evidence (gate is all-or-nothing,
 *   refunds and escalations are never delegable, unverifiable checks are surfaced);
 * - the emitter mirrors the database's epistemic rules before writing
 *   (decision_by on decisions, evidence on acceptance, no interpretation keys);
 * - the database owns evidence_strength and the hash (placeholders only);
 * - everything is off unless DECISION_JOURNEY_SHADOW=1, and fail-soft when on.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type DecisionEventInput,
  emitEvent,
  isDecisionJourneyEnabled,
  newEventId,
  resolveVersions,
  validateEvent,
} from '../decision-journey/emitter';
import {
  classifyAction,
  humanAgreesWithAgent,
  recordHumanDecision,
  recordShadowRecommendation,
  SHADOW_EXECUTION_CONFIDENCE,
  shadowDecide,
} from '../decision-journey/helpdesk-shadow';

function baseEvent(overrides: Partial<DecisionEventInput> = {}): DecisionEventInput {
  return {
    journeyId: 'dj_0000001',
    eventType: 'PATH_RECOMMENDED',
    occurredAt: new Date(),
    emittedByType: 'ai',
    emittedBy: 'helpdesk_agent',
    decisionBy: null,
    affectedParty: 'customer',
    sourceSystem: 'helpdesk',
    evidenceQuality: 'SYSTEM_CONFIRMED',
    payload: { mode: 'shadow' },
    createdBy: 'helpdesk_agent',
    ...overrides,
  };
}

/** Minimal chainable Supabase double recording inserts per table. */
function fakeSupabase(opts: { selectRows?: Record<string, unknown[]>; insertError?: string } = {}) {
  const inserts: Array<{ table: string; row: Record<string, unknown> }> = [];
  const client = {
    from(table: string) {
      const chain: Record<string, unknown> = {};
      let mode: 'select' | 'insert' = 'select';
      let lastRow: Record<string, unknown> = {};
      const result = () => {
        if (mode === 'insert') {
          if (opts.insertError) return { data: null, error: { message: opts.insertError } };
          const data = table === 'decision_journey' ? [{ journey_id: 'dj_0000042' }] : [lastRow];
          return { data, error: null };
        }
        return { data: opts.selectRows?.[table] ?? [], error: null };
      };
      chain.insert = (row: Record<string, unknown>) => {
        mode = 'insert';
        lastRow = row;
        inserts.push({ table, row });
        return chain;
      };
      for (const m of ['select', 'eq', 'order']) chain[m] = () => chain;
      chain.limit = () => Promise.resolve(result());
      chain.then = (resolve: (v: unknown) => void) => resolve(result());
      return chain;
    },
  };
  return { client: client as never, inserts };
}

describe('shadow decision gate (spec §3-§4)', () => {
  it('classifies only informational actions as delegable A1', () => {
    expect(classifyAction('reply')).toBe('A1');
    expect(classifyAction('resolve')).toBe('A1');
    expect(classifyAction('plan-upgrade-suggest')).toBe('A1');
    expect(classifyAction('refund')).toBe('A4');
    expect(classifyAction('escalate')).toBe('NOT_DELEGATED');
  });

  it('would execute only when every gate check passes', () => {
    const ok = shadowDecide({
      action: 'reply',
      confidence: SHADOW_EXECUTION_CONFIDENCE,
      citedPolicySources: ['wiki/concepts/support/plan-limits.md'],
      customerId: 'c1',
    });
    expect(ok.wouldExecute).toBe(true);

    const lowConfidence = shadowDecide({
      action: 'reply',
      confidence: SHADOW_EXECUTION_CONFIDENCE - 0.01,
      citedPolicySources: ['x.md'],
      customerId: 'c1',
    });
    expect(lowConfidence.wouldExecute).toBe(false);

    const noEvidence = shadowDecide({
      action: 'reply',
      confidence: 0.99,
      citedPolicySources: [],
      customerId: 'c1',
    });
    expect(noEvidence.wouldExecute).toBe(false);
  });

  it('never delegates a refund, however confident', () => {
    const d = shadowDecide({
      action: 'refund',
      confidence: 1,
      citedPolicySources: ['wiki/concepts/support/refund-policy.md'],
      customerId: 'c1',
    });
    expect(d.wouldExecute).toBe(false);
    expect(d.actionClass).toBe('A4');
  });

  it('surfaces checks it cannot verify instead of assuming them', () => {
    const d = shadowDecide({
      action: 'reply',
      confidence: 1,
      citedPolicySources: ['x'],
      customerId: 'c',
    });
    expect(d.unverifiedChecks).toContain('vip_allowlist');
  });
});

describe('agreement between agent and human reviewer', () => {
  it('counts a sent reply as agreement with a reply recommendation', () => {
    expect(humanAgreesWithAgent('reply', 'reply')).toBe(true);
    expect(humanAgreesWithAgent('plan-upgrade-suggest', 'reply')).toBe(true);
  });

  it('counts escalating an A1 recommendation as disagreement', () => {
    expect(humanAgreesWithAgent('reply', 'escalate')).toBe(false);
    expect(humanAgreesWithAgent('resolve', 'escalate')).toBe(false);
  });

  it('treats any human handling as agreement when the agent asked for a human', () => {
    expect(humanAgreesWithAgent('escalate', 'reply')).toBe(true);
    expect(humanAgreesWithAgent('refund', 'resolve')).toBe(true);
  });
});

describe('emitter mirrors the database rules', () => {
  it('rejects a decision without decision_by', () => {
    expect(validateEvent(baseEvent({ eventType: 'PATH_REJECTED', decisionBy: null }))).toMatch(
      /decisionBy/,
    );
  });

  it('rejects an acceptance without evidence', () => {
    expect(
      validateEvent(baseEvent({ eventType: 'PATH_ACCEPTED', decisionBy: 'human_reviewer' })),
    ).toMatch(/evidenceRefs/);
  });

  it('rejects interpretation in an evidence-layer payload', () => {
    expect(validateEvent(baseEvent({ payload: { hypothesis: 'wrong_stakeholder' } }))).toMatch(
      /interpretation/,
    );
  });

  it('rejects events dated in the future', () => {
    expect(validateEvent(baseEvent({ occurredAt: new Date(Date.now() + 3_600_000) }))).toMatch(
      /future/,
    );
  });

  it('generates event ids that satisfy the table check', () => {
    expect(newEventId()).toMatch(/^evt_[0-9A-Za-z]{10,40}$/);
  });
});

describe('versions and feature flag', () => {
  const saved = { ...process.env };
  beforeEach(() => {
    delete process.env.DECISION_JOURNEY_SHADOW;
    delete process.env.WORLD_MODEL_VERSION;
    delete process.env.ACTIVE_ONTOLOGY_VERSION;
  });
  afterEach(() => {
    process.env = { ...saved };
  });

  it('is off by default', () => {
    expect(isDecisionJourneyEnabled()).toBe(false);
  });

  it('refuses to guess a world model version', () => {
    expect(resolveVersions()).toBeNull();
    process.env.WORLD_MODEL_VERSION = '1.2.4';
    expect(resolveVersions()).toEqual({ ontology: '1.5.0', worldModel: '1.2.4' });
  });

  it('writes nothing when disabled', async () => {
    const { client, inserts } = fakeSupabase();
    await recordShadowRecommendation(client, {
      ticketId: '11111111-2222-3333-4444-555555555555',
      ticketSource: 'email',
      ticketCreatedAt: null,
      customerId: 'c1',
      action: 'reply',
      intent: 'how-to',
      confidence: 0.9,
      citedPolicySources: ['x.md'],
    });
    expect(inserts).toHaveLength(0);
  });
});

describe('shadow recording when enabled', () => {
  const saved = { ...process.env };
  beforeEach(() => {
    process.env.DECISION_JOURNEY_SHADOW = '1';
    process.env.WORLD_MODEL_VERSION = '1.2.4';
  });
  afterEach(() => {
    process.env = { ...saved };
    vi.restoreAllMocks();
  });

  it('writes journey, observation and recommendation; DB owns strength and hash', async () => {
    const { client, inserts } = fakeSupabase();
    await recordShadowRecommendation(client, {
      ticketId: '11111111-2222-3333-4444-555555555555',
      ticketSource: 'email',
      ticketCreatedAt: '2026-09-24T08:02:17Z',
      customerId: 'c1',
      action: 'reply',
      intent: 'how-to',
      confidence: 0.9,
      citedPolicySources: ['wiki/concepts/support/plan-limits.md'],
    });

    expect(inserts.map((i) => i.table)).toEqual([
      'decision_journey',
      'decision_journey_event',
      'decision_journey_event',
    ]);
    const [, obs, rec] = inserts.map((i) => i.row);
    expect(obs.event_type).toBe('OBSERVATION_RECORDED');
    expect(obs.payload).not.toHaveProperty('text'); // no customer words in immutable rows
    expect(rec.event_type).toBe('PATH_RECOMMENDED');
    expect(rec.decision_by).toBeNull();
    expect(rec.previous_event_id).toBe(obs.event_id);
    expect((rec.payload as Record<string, unknown>).mode).toBe('shadow');
    expect(rec.evidence_strength).toBe(0);
    expect(rec.hash).toBe('');
  });

  it('skips tickets without a known customer', async () => {
    const { client, inserts } = fakeSupabase();
    await recordShadowRecommendation(client, {
      ticketId: 't',
      ticketSource: 'email',
      ticketCreatedAt: null,
      customerId: null,
      action: 'reply',
      intent: 'how-to',
      confidence: 0.9,
      citedPolicySources: ['x.md'],
    });
    expect(inserts).toHaveLength(0);
  });

  it('does not throw when the table is missing (migration not applied)', async () => {
    const { client } = fakeSupabase({ insertError: 'relation "decision_journey" does not exist' });
    await expect(emitEvent(client, baseEvent())).resolves.toBeNull();
  });

  it('records the reviewer decision with role, not person, as decision_by', async () => {
    const { client, inserts } = fakeSupabase({
      selectRows: {
        decision_journey_event: [
          {
            event_id: 'evt_abc1234567',
            journey_id: 'dj_0000042',
            payload: { recommended_path: 'reply' },
          },
        ],
      },
    });
    // First select returns the recommendation; the successor check must see none.
    let call = 0;
    const origFrom = (client as { from: (t: string) => unknown }).from;
    (client as { from: (t: string) => unknown }).from = (t: string) => {
      const chain = origFrom(t) as Record<string, unknown>;
      if (t === 'decision_journey_event') {
        call += 1;
        if (call === 2) chain.limit = () => Promise.resolve({ data: [], error: null });
      }
      return chain;
    };

    await recordHumanDecision(client, {
      ticketId: 't1',
      humanAction: 'escalate',
      evidenceRef: 'hil_escalations:e1',
    });

    const row = inserts.find((i) => i.table === 'decision_journey_event')?.row;
    expect(row?.event_type).toBe('PATH_REJECTED');
    expect(row?.decision_by).toBe('human_reviewer');
    expect(row?.previous_event_id).toBe('evt_abc1234567');
  });
});
