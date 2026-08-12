import { describe, expect, it } from 'vitest';

import { issueVerifiedDoneAttestation } from '../identity/ats-engine.js';
import type { AttestationInput, MandateGateDecision } from '../identity/types.js';

function makeDecision(overrides: Partial<MandateGateDecision> = {}): MandateGateDecision {
  return {
    allowed: true,
    requiresHumanConfirmation: false,
    kyaViolation: false,
    reason: 'within ATS band, spend_authority scope, and tenant profile',
    evaluatedAt: '2026-07-22T10:00:00.000Z',
    ...overrides,
  };
}

function makeInput(overrides: Partial<AttestationInput> = {}): AttestationInput {
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
    gateDecision: makeDecision(),
    issuedAt: '2026-07-22T10:00:01.000Z',
    issuer: 'did:web:standards.dws.eu',
    article12TraceId: '11111111-1111-1111-1111-111111111111',
    ...overrides,
  };
}

describe('issueVerifiedDoneAttestation — envelope shape (§14.7)', () => {
  it('emits a W3C VC 2.0 envelope with the KYA credential type', () => {
    const { credential } = issueVerifiedDoneAttestation(makeInput());
    expect(credential['@context']).toContain('https://www.w3.org/ns/credentials/v2');
    expect(credential['@context']).toContain('https://standards.dws.eu/kya/v1');
    expect(credential.type).toEqual(['VerifiableCredential', 'KYAVerifiedDoneCredential']);
    expect(credential.issuer).toBe('did:web:standards.dws.eu');
    // validFrom is caller-supplied, never the engine's own clock
    expect(credential.validFrom).toBe('2026-07-22T10:00:01.000Z');
  });

  it('mirrors the executed mandate facts into credentialSubject, keyed by mandate VC id', () => {
    const { credential } = issueVerifiedDoneAttestation(makeInput());
    const subject = credential.credentialSubject;
    expect(subject.id).toBe('urn:kya:mandate:vc-abc-123');
    expect(subject.hic).toBe('human-risto-verified');
    expect(subject.protocol).toBe('ap2');
    expect(subject.amount).toBe(50);
    expect(subject.currency).toBe('EUR');
    expect(subject.atsAtExecution).toBe(0.95);
    // Ties the attestation into the one evidence chain (§14.5)
    expect(subject.article12TraceId).toBe('11111111-1111-1111-1111-111111111111');
    expect(subject.kyaVerified).toBe(true);
  });
});

describe('issueVerifiedDoneAttestation — signing deferred to v2.0 (§14.7)', () => {
  it('returns the credential UNSIGNED with no proof block (deferral is explicit, not silent)', () => {
    const { credential, proofStatus } = issueVerifiedDoneAttestation(makeInput());
    expect(proofStatus).toBe('unsigned');
    expect(credential.proof).toBeUndefined();
  });

  it('is deterministic — identical input yields an identical credential (no hidden clock/nonce)', () => {
    const a = issueVerifiedDoneAttestation(makeInput());
    const b = issueVerifiedDoneAttestation(makeInput());
    expect(a).toEqual(b);
  });
});

describe('issueVerifiedDoneAttestation — deny-by-default carries through (§14.7)', () => {
  it('refuses to attest a mandate the gate did not allow', () => {
    expect(() =>
      issueVerifiedDoneAttestation(makeInput({ gateDecision: makeDecision({ allowed: false }) })),
    ).toThrow(/did not allow/);
  });

  it('refuses an anonymous attestation (empty HIC binding)', () => {
    expect(() => issueVerifiedDoneAttestation(makeInput({ hic: '   ' }))).toThrow(/HIC/);
  });
});
