import { describe, expect, it, vi } from 'vitest';

import { generateIssuerKeyPair, type AttestationSigner } from '../identity/attestation-signing.js';
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
  const store = { persist: vi.fn(async () => ({ id: 'att-1' })) };
  const events = { log: vi.fn(async () => ({ id: 'evt-1' })) };
  return { deps: { store, events, signer }, store, events };
}

describe('attestMandateExecution — orchestration (§14.7 / §14.5)', () => {
  it('signs, persists, then logs a mandate.attest event when a signer is configured', async () => {
    const { deps, store, events } = makeDeps(makeSigner());

    const result = await attestMandateExecution(deps, makeInput(), { orgId: 'org-1' });

    expect(result.attestation.proofStatus).toBe('signed');
    expect(result.attestationId).toBe('att-1');
    expect(result.eventId).toBe('evt-1');

    // persisted the signed credential
    expect(store.persist).toHaveBeenCalledOnce();
    expect(store.persist.mock.calls[0][0].proofStatus).toBe('signed');

    // logged the evidence event with the right shape
    expect(events.log).toHaveBeenCalledOnce();
    const logged = events.log.mock.calls[0][0];
    expect(logged.eventType).toBe('mandate.attest');
    expect(logged.gateDecision).toBe('allowed');
    expect(logged.sessionId).toBe('session-1');
    expect(logged.mandateVcId).toBe('vc-abc-123');
    expect(logged.orgId).toBe('org-1');
    expect(logged.kyaScoreAtSign).toBe(0.95);
  });

  it('persists BEFORE logging the evidence event (event never points at an unstored credential)', async () => {
    const order: string[] = [];
    const store = {
      persist: vi.fn(async () => {
        order.push('persist');
        return { id: 'att-1' };
      }),
    };
    const events = {
      log: vi.fn(async () => {
        order.push('log');
        return { id: 'evt-1' };
      }),
    };

    await attestMandateExecution({ store, events, signer: makeSigner() }, makeInput());

    expect(order).toEqual(['persist', 'log']);
  });

  it('mints an unsigned credential when no signer is configured', async () => {
    const { deps, store } = makeDeps(null);

    const result = await attestMandateExecution(deps, makeInput());

    expect(result.attestation.proofStatus).toBe('unsigned');
    expect(result.attestation.credential.proof).toBeUndefined();
    expect(store.persist).toHaveBeenCalledOnce();
  });

  it('attests nothing for a denied mandate — deny-by-default carries through', async () => {
    const { deps, store, events } = makeDeps(makeSigner());
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
    expect(events.log).not.toHaveBeenCalled();
  });
});
