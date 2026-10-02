import { describe, expect, it } from 'vitest';

import type { SupabaseClient } from '@supabase/supabase-js';

import { type MandateEvent, MandateEventLogger } from '../identity/mandate-event-logger.js';

function makeEvent(overrides: Partial<MandateEvent> = {}): MandateEvent {
  return {
    eventType: 'mandate.attest',
    sessionId: 'session-1',
    mandateVcId: 'vc-abc-123',
    subagentId: 'agent-1',
    hic: 'human-risto-verified',
    protocol: 'ap2',
    mandateType: 'payment',
    amount: 50,
    currency: 'EUR',
    gateDecision: 'allowed',
    kyaScoreAtSign: 0.95,
    article12TraceId: '11111111-1111-1111-1111-111111111111',
    ...overrides,
  };
}

function makeFakeSupabase(insertResult?: { data: unknown; error: { message: string } | null }) {
  const inserts: Array<{ table: string; row: Record<string, unknown> }> = [];
  const client = {
    from(table: string) {
      let payload: Record<string, unknown> = {};
      const api = {
        insert(row: Record<string, unknown>) {
          payload = row;
          return api;
        },
        select() {
          return api;
        },
        single() {
          inserts.push({ table, row: payload });
          return Promise.resolve(insertResult ?? { data: { id: 'evt-1' }, error: null });
        },
      };
      return api;
    },
  } as unknown as SupabaseClient;
  return { client, inserts };
}

describe('MandateEventLogger.log — §14.5 evidence chain', () => {
  it('appends a mandate event without ever setting the trigger-owned hash columns', async () => {
    const { client, inserts } = makeFakeSupabase();
    const logger = new MandateEventLogger(client);

    const { id } = await logger.log(makeEvent());

    expect(id).toBe('evt-1');
    expect(inserts).toHaveLength(1);
    expect(inserts[0].table).toBe('kya_mandate_events');
    const row = inserts[0].row;
    expect(row.event_type).toBe('mandate.attest');
    expect(row.session_id).toBe('session-1');
    expect(row.mandate_vc_id).toBe('vc-abc-123');
    expect(row.gate_decision).toBe('allowed');
    // defaults applied
    expect(row.requires_human_confirmation).toBe(false);
    expect(row.kya_violation).toBe(false);
    // prev_hash / event_hash are set by the DB trigger, never by the app
    expect(row).not.toHaveProperty('prev_hash');
    expect(row).not.toHaveProperty('event_hash');
  });

  it('throws (fail-closed) when the insert errors', async () => {
    const { client } = makeFakeSupabase({ data: null, error: { message: 'chain locked' } });
    const logger = new MandateEventLogger(client);
    await expect(logger.log(makeEvent())).rejects.toThrow(/chain locked/);
  });
});
