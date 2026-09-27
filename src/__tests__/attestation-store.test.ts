import { describe, expect, it, vi } from 'vitest';

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import type { SupabaseClient } from '@supabase/supabase-js';

import { generateIssuerKeyPair, type AttestationSigner } from '../identity/attestation-signing.js';
import { VerifiedDoneAttestationStore } from '../identity/attestation-store.js';
import { issueVerifiedDoneAttestation } from '../identity/ats-engine.js';
import type {
  AttestationInput,
  IssuedAttestation,
  MandateGateDecision,
} from '../identity/types.js';

function makeInput(overrides: Partial<AttestationInput> = {}): AttestationInput {
  const gateDecision: MandateGateDecision = {
    allowed: true,
    requiresHumanConfirmation: false,
    kyaViolation: false,
    reason: 'ok',
    evaluatedAt: '2026-07-22T10:00:00.000Z',
  };
  return {
    sessionId: 'session-1',
    mandateVcId: 'vc-abc-123',
    subagentId: 'agent-1',
    hic: 'human-risto-verified',
    protocol: 'ap2',
    mandateType: 'payment',
    amount: 50,
    currency: 'EUR',
    atsAtExecution: 0.95,
    gateDecision,
    issuedAt: '2026-07-22T10:00:01.000Z',
    issuer: 'did:web:standards.dws.eu',
    article12TraceId: '11111111-1111-1111-1111-111111111111',
    ...overrides,
  };
}

function makeSigner(): AttestationSigner {
  return {
    privateKey: generateIssuerKeyPair().privateKey,
    verificationMethod: 'did:web:standards.dws.eu#key-1',
    created: '2026-07-22T10:00:02.000Z',
  };
}

interface FakeHandlers {
  insertResult?: { data: unknown; error: { message: string } | null };
  loadResult?: { data: unknown; error: { message: string } | null };
  updateResult?: { error: { message: string } | null };
}

function makeFakeSupabase(handlers: FakeHandlers = {}) {
  const calls = {
    inserts: [] as Array<{ table: string; row: Record<string, unknown> }>,
    updates: [] as Array<{ table: string; patch: Record<string, unknown>; id: unknown }>,
    loads: [] as Array<{ table: string; id: unknown }>,
  };

  function from(table: string) {
    const state: {
      op?: 'insert' | 'update';
      payload?: Record<string, unknown>;
      eqVal?: unknown;
    } = {};
    const api = {
      insert(row: Record<string, unknown>) {
        state.op = 'insert';
        state.payload = row;
        return api;
      },
      update(patch: Record<string, unknown>) {
        state.op = 'update';
        state.payload = patch;
        return api;
      },
      select() {
        return api;
      },
      eq(_field: string, val: unknown) {
        state.eqVal = val;
        return api;
      },
      single() {
        if (state.op === 'insert') {
          calls.inserts.push({ table, row: state.payload as Record<string, unknown> });
          return Promise.resolve(handlers.insertResult ?? { data: { id: 'row-1' }, error: null });
        }
        calls.loads.push({ table, id: state.eqVal });
        return Promise.resolve(handlers.loadResult ?? { data: null, error: null });
      },
      // Awaited directly by update().eq() — records the update transition.
      then<T>(resolve: (v: { error: { message: string } | null }) => T) {
        if (state.op === 'update') {
          calls.updates.push({
            table,
            patch: state.payload as Record<string, unknown>,
            id: state.eqVal,
          });
        }
        return Promise.resolve(handlers.updateResult ?? { error: null }).then(resolve);
      },
    };
    return api;
  }

  return { client: { from } as unknown as SupabaseClient, calls };
}

describe('VerifiedDoneAttestationStore.persist — column mapping (§14.7)', () => {
  it('maps the credential onto the table columns, stripping the mandate urn', async () => {
    const { client, calls } = makeFakeSupabase();
    const store = new VerifiedDoneAttestationStore(client);

    const { id } = await store.persist(issueVerifiedDoneAttestation(makeInput()));

    expect(id).toBe('row-1');
    expect(calls.inserts).toHaveLength(1);
    const row = calls.inserts[0].row;
    expect(calls.inserts[0].table).toBe('kya_verified_done_attestations');
    // mandate_vc_id is the bare id, not the urn:kya:mandate: form
    expect(row.mandate_vc_id).toBe('vc-abc-123');
    expect(row.session_id).toBe('session-1');
    expect(row.hic).toBe('human-risto-verified');
    expect(row.issuer).toBe('did:web:standards.dws.eu');
    expect(row.proof_status).toBe('unsigned');
    expect(row.kya_verified).toBe(true);
    expect(row.valid_from).toBe('2026-07-22T10:00:01.000Z');
    expect(row.article12_trace_id).toBe('11111111-1111-1111-1111-111111111111');
    // the full VC envelope is stored as-is
    expect((row.credential as { type: string[] }).type).toContain('KYAVerifiedDoneCredential');
  });

  it('throws (fails loud) when the insert errors', async () => {
    const { client } = makeFakeSupabase({
      insertResult: { data: null, error: { message: 'boom' } },
    });
    const store = new VerifiedDoneAttestationStore(client);
    await expect(store.persist(issueVerifiedDoneAttestation(makeInput()))).rejects.toThrow(/boom/);
  });
});

describe('VerifiedDoneAttestationStore.sign — unsigned→signed transition (§14.7)', () => {
  function unsignedCredential(): IssuedAttestation {
    return issueVerifiedDoneAttestation(makeInput());
  }

  it('signs an unsigned row and updates proof_status + credential in place', async () => {
    const { credential } = unsignedCredential();
    const { client, calls } = makeFakeSupabase({
      loadResult: { data: { credential, proof_status: 'unsigned' }, error: null },
    });
    const store = new VerifiedDoneAttestationStore(client);

    await store.sign('row-1', makeSigner());

    expect(calls.loads).toEqual([{ table: 'kya_verified_done_attestations', id: 'row-1' }]);
    expect(calls.updates).toHaveLength(1);
    const patch = calls.updates[0].patch;
    expect(patch.proof_status).toBe('signed');
    // the stored credential now carries a proof block
    expect((patch.credential as { proof?: unknown }).proof).toBeDefined();
    expect(calls.updates[0].id).toBe('row-1');
  });

  it('refuses to sign a row that is not unsigned (already signed / revoked)', async () => {
    const { credential } = unsignedCredential();
    const { client, calls } = makeFakeSupabase({
      loadResult: { data: { credential, proof_status: 'signed' }, error: null },
    });
    const store = new VerifiedDoneAttestationStore(client);

    await expect(store.sign('row-1', makeSigner())).rejects.toThrow(/cannot sign a 'signed'/);
    expect(calls.updates).toHaveLength(0);
  });
});

describe('VerifiedDoneAttestationStore.revoke — status transition, never delete (§14.7)', () => {
  it('updates proof_status to revoked (no DELETE)', async () => {
    const { client, calls } = makeFakeSupabase();
    const store = new VerifiedDoneAttestationStore(client);

    await store.revoke('row-1');

    expect(calls.updates).toEqual([
      { table: 'kya_verified_done_attestations', patch: { proof_status: 'revoked' }, id: 'row-1' },
    ]);
  });

  it('throws (fails loud) when the revoke update errors', async () => {
    const { client } = makeFakeSupabase({ updateResult: { error: { message: 'nope' } } });
    const store = new VerifiedDoneAttestationStore(client);
    await expect(store.revoke('row-1')).rejects.toThrow(/nope/);
  });
});
