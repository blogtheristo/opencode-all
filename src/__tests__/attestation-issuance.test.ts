// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/attestation-issuance.test.ts

import { describe, expect, it, vi } from 'vitest';

import { type AttestationSigner, generateIssuerKeyPair } from '../identity/attestation-signing.js';
import { attestMandateExecution } from '../identity/attestation-issuance.js';
import type { AttestationInput, MandateGateDecision } from '../identity/types.js';

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

function makeDeps(signer?: AttestationSigner | null) {
  const store = {
    persist: vi.fn(async () => ({ id: 'att-1' })),
    persistWithEvent: vi.fn(async (attestation) => ({
      attestationId: 'att-1',
      eventId: 'evt-1',
      attestation,
    })),
    sign: vi.fn(async () => undefined),
    revoke: vi.fn(async () => undefined),
  };
  return { deps: { store, signer }, store };
}

describe('attestMandateExecution — orchestration (§14.7 / §14.5)', () => {
  it('signs and atomically persists a credential with its mandate.attest event', async () => {
    const { deps, store } = makeDeps(makeSigner());

    const result = await attestMandateExecution(deps, makeInput(), { orgId: 'org-1' });

    expect(result.attestation.proofStatus).toBe('signed');
    expect(result.attestationId).toBe('att-1');
    expect(result.eventId).toBe('evt-1');

    expect(store.persist).not.toHaveBeenCalled();
    expect(store.persistWithEvent).toHaveBeenCalledOnce();
    const [persisted, logged] = store.persistWithEvent.mock.calls[0];
    expect(persisted.proofStatus).toBe('signed');
    expect(logged.eventType).toBe('mandate.attest');
    expect(logged.gateDecision).toBe('allowed');
    expect(logged.sessionId).toBe('session-1');
    expect(logged.mandateVcId).toBe('vc-abc-123');
    expect(logged.orgId).toBe('org-1');
    expect(logged.kyaScoreAtSign).toBe(0.95);
  });

  it('uses one atomic write so an event failure cannot leave an orphan credential', async () => {
    const store = {
      persist: vi.fn(async () => ({ id: 'unexpected' })),
      persistWithEvent: vi.fn(async () => {
        throw new Error('event insert failed; transaction rolled back');
      }),
      sign: vi.fn(async () => undefined),
      revoke: vi.fn(async () => undefined),
    };

    await expect(
      attestMandateExecution({ store, signer: makeSigner() }, makeInput()),
    ).rejects.toThrow(/transaction rolled back/);
    expect(store.persistWithEvent).toHaveBeenCalledOnce();
    expect(store.persist).not.toHaveBeenCalled();
  });

  it('mints an unsigned credential when no signer is configured', async () => {
    const { deps, store } = makeDeps(null);

    const result = await attestMandateExecution(deps, makeInput());

    expect(result.attestation.proofStatus).toBe('unsigned');
    expect(result.attestation.credential.proof).toBeUndefined();
    expect(store.persistWithEvent).toHaveBeenCalledOnce();
    expect(store.persist).not.toHaveBeenCalled();
  });

  it('returns the same ids on an idempotent retry', async () => {
    const { deps, store } = makeDeps(makeSigner());
    store.persistWithEvent.mockImplementation(async (attestation) => ({
      attestationId: 'att-1',
      eventId: 'evt-1',
      attestation: { ...attestation, proofStatus: 'revoked' },
    }));

    const first = await attestMandateExecution(deps, makeInput());
    const retry = await attestMandateExecution(deps, makeInput());

    expect(first.attestationId).toBe('att-1');
    expect(first.eventId).toBe('evt-1');
    expect(retry.attestationId).toBe(first.attestationId);
    expect(retry.eventId).toBe(first.eventId);
    expect(retry.attestation.proofStatus).toBe('revoked');
    expect(store.persistWithEvent).toHaveBeenCalledTimes(2);
    expect(store.persist).not.toHaveBeenCalled();
  });

  it('attests nothing for a denied mandate — deny-by-default carries through', async () => {
    const { deps, store } = makeDeps(makeSigner());
    const denied = makeInput({
      gateDecision: {
        allowed: false,
        requiresHumanConfirmation: false,
        kyaViolation: true,
        reason: 'out of band',
        evaluatedAt: '2026-07-22T10:00:00.000Z',
      },
    });

    await expect(attestMandateExecution(deps, denied)).rejects.toThrow(/did not allow/);
    expect(store.persist).not.toHaveBeenCalled();
    expect(store.persistWithEvent).not.toHaveBeenCalled();
  });
});
