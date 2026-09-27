// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/attestation-store.test.ts

import { describe, expect, it, vi } from 'vitest';

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import type { SupabaseClient } from '@supabase/supabase-js';

import { type AttestationSigner, generateIssuerKeyPair } from '../identity/attestation-signing.js';
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
  updateResult?: { data: unknown; error: { message: string } | null };
  rpcResult?: { data: unknown; error: { message: string } | null };
}

function makeFakeSupabase(handlers: FakeHandlers = {}) {
  const calls = {
    inserts: [] as Array<{ table: string; row: Record<string, unknown> }>,
    updates: [] as Array<{
      table: string;
      patch: Record<string, unknown>;
      filters: Array<{ operator: 'eq' | 'in'; field: string; value: unknown }>;
    }>,
    loads: [] as Array<{
      table: string;
      filters: Array<{ operator: 'eq' | 'in'; field: string; value: unknown }>;
    }>,
    rpcs: [] as Array<{ fn: string; args: Record<string, unknown> }>,
  };

  function from(table: string) {
    const state: {
      op?: 'insert' | 'update';
      payload?: Record<string, unknown>;
      filters: Array<{ operator: 'eq' | 'in'; field: string; value: unknown }>;
    } = { filters: [] };
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
      eq(field: string, val: unknown) {
        state.filters.push({ operator: 'eq', field, value: val });
        return api;
      },
      in(field: string, val: unknown[]) {
        state.filters.push({ operator: 'in', field, value: val });
        return api;
      },
      single() {
        if (state.op === 'insert') {
          calls.inserts.push({ table, row: state.payload as Record<string, unknown> });
          return Promise.resolve(handlers.insertResult ?? { data: { id: 'row-1' }, error: null });
        }
        calls.loads.push({ table, filters: state.filters });
        return Promise.resolve(handlers.loadResult ?? { data: null, error: null });
      },
      maybeSingle() {
        calls.updates.push({
          table,
          patch: state.payload as Record<string, unknown>,
          filters: state.filters,
        });
        return Promise.resolve(handlers.updateResult ?? { data: { id: 'row-1' }, error: null });
      },
    };
    return api;
  }

  function rpc(fn: string, args: Record<string, unknown>) {
    calls.rpcs.push({ fn, args });
    return {
      single: () =>
        Promise.resolve(
          handlers.rpcResult ?? {
            data: {
              attestation_id: 'att-1',
              event_id: 'evt-1',
              credential: issueVerifiedDoneAttestation(makeInput()).credential,
              proof_status: 'unsigned',
            },
            error: null,
          },
        ),
    };
  }

  return { client: { from, rpc } as unknown as SupabaseClient, calls };
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

describe('VerifiedDoneAttestationStore.persistWithEvent — atomic issuance', () => {
  it('uses the transactional RPC and returns both persisted ids', async () => {
    const { client, calls } = makeFakeSupabase();
    const store = new VerifiedDoneAttestationStore(client);

    const result = await store.persistWithEvent(issueVerifiedDoneAttestation(makeInput()), {
      eventType: 'mandate.attest',
      sessionId: 'session-1',
      mandateVcId: 'vc-abc-123',
      subagentId: 'agent-1',
      hic: 'human-risto-verified',
      protocol: 'ap2',
      mandateType: 'payment',
      gateDecision: 'allowed',
    });

    expect(result).toMatchObject({
      attestationId: 'att-1',
      eventId: 'evt-1',
      attestation: { proofStatus: 'unsigned' },
    });
    expect(calls.rpcs).toHaveLength(1);
    expect(calls.rpcs[0].fn).toBe('issue_verified_done_attestation');
    expect(calls.rpcs[0].args.p_attestation).toMatchObject({
      session_id: 'session-1',
      mandate_vc_id: 'vc-abc-123',
    });
    expect(calls.rpcs[0].args.p_event).toMatchObject({
      event_type: 'mandate.attest',
      gate_decision: 'allowed',
    });
    expect(calls.inserts).toHaveLength(0);
  });

  it('fails loudly when the transactional RPC rolls back', async () => {
    const { client, calls } = makeFakeSupabase({
      rpcResult: { data: null, error: { message: 'event insert rejected' } },
    });
    const store = new VerifiedDoneAttestationStore(client);

    await expect(
      store.persistWithEvent(issueVerifiedDoneAttestation(makeInput()), {
        eventType: 'mandate.attest',
        sessionId: 'session-1',
        mandateVcId: 'vc-abc-123',
        subagentId: 'agent-1',
        hic: 'human-risto-verified',
        protocol: 'ap2',
        mandateType: 'payment',
        gateDecision: 'allowed',
      }),
    ).rejects.toThrow(/event insert rejected/);
    expect(calls.inserts).toHaveLength(0);
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

    expect(calls.loads).toEqual([
      {
        table: 'kya_verified_done_attestations',
        filters: [
          { operator: 'eq', field: 'id', value: 'row-1' },
          { operator: 'eq', field: 'proof_status', value: 'unsigned' },
        ],
      },
    ]);
    expect(calls.updates).toHaveLength(1);
    const patch = calls.updates[0].patch;
    expect(patch.proof_status).toBe('signed');
    // the stored credential now carries a proof block
    expect((patch.credential as { proof?: unknown }).proof).toBeDefined();
    expect(calls.updates[0].filters).toContainEqual({
      operator: 'eq',
      field: 'proof_status',
      value: 'unsigned',
    });
  });

  it('fails loudly when a concurrent revoke wins before the conditional sign update', async () => {
    const { credential } = unsignedCredential();
    const { client } = makeFakeSupabase({
      loadResult: { data: { credential }, error: null },
      updateResult: { data: null, error: null },
    });
    const store = new VerifiedDoneAttestationStore(client);

    await expect(store.sign('row-1', makeSigner())).rejects.toThrow(
      /no unsigned attestation transitioned/,
    );
  });
});

describe('VerifiedDoneAttestationStore.revoke — status transition, never delete (§14.7)', () => {
  it('updates proof_status to revoked (no DELETE)', async () => {
    const { client, calls } = makeFakeSupabase();
    const store = new VerifiedDoneAttestationStore(client);

    await store.revoke('row-1');

    expect(calls.updates).toEqual([
      {
        table: 'kya_verified_done_attestations',
        patch: { proof_status: 'revoked' },
        filters: [
          { operator: 'eq', field: 'id', value: 'row-1' },
          {
            operator: 'in',
            field: 'proof_status',
            value: ['unsigned', 'signed'],
          },
        ],
      },
    ]);
  });

  it('throws (fails loud) when the revoke update errors', async () => {
    const { client } = makeFakeSupabase({
      updateResult: { data: null, error: { message: 'nope' } },
    });
    const store = new VerifiedDoneAttestationStore(client);
    await expect(store.revoke('row-1')).rejects.toThrow(/nope/);
  });

  it('fails loudly when no legal revoke transition occurs', async () => {
    const { client } = makeFakeSupabase({
      updateResult: { data: null, error: null },
    });
    const store = new VerifiedDoneAttestationStore(client);

    await expect(store.revoke('row-1')).rejects.toThrow(
      /no unsigned or signed attestation transitioned/,
    );
  });
});
