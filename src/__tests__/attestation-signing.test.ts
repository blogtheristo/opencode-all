import { createPublicKey, generateKeyPairSync } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { issueVerifiedDoneAttestation } from '../identity/ats-engine.js';
import {
  type AttestationSigner,
  generateIssuerKeyPair,
  loadIssuerSignerFromEnv,
  signVerifiedDoneAttestation,
  verifyVerifiedDoneAttestation,
} from '../identity/attestation-signing.js';
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

function makeSigner(overrides: Partial<AttestationSigner> = {}): AttestationSigner {
  const { privateKey } = generateIssuerKeyPair();
  return {
    privateKey,
    verificationMethod: 'did:web:standards.dws.eu#key-1',
    created: '2026-07-22T10:00:02.000Z',
    ...overrides,
  };
}

describe('signVerifiedDoneAttestation — EdDSA JWS proof (§14.7.1)', () => {
  it('signs an unsigned credential and stamps a JsonWebSignature2020 proof', () => {
    const unsigned = issueVerifiedDoneAttestation(makeInput());
    expect(unsigned.proofStatus).toBe('unsigned');

    const signer = makeSigner();
    const signed = signVerifiedDoneAttestation(unsigned, signer);

    expect(signed.proofStatus).toBe('signed');
    expect(signed.credential.proof?.type).toBe('JsonWebSignature2020');
    expect(signed.credential.proof?.proofPurpose).toBe('assertionMethod');
    expect(signed.credential.proof?.verificationMethod).toBe('did:web:standards.dws.eu#key-1');
    // detached JWS: header..signature
    expect(signed.credential.proof?.proofValue.split('.')[1]).toBe('');
  });

  it('produces a deterministic signature (Ed25519, RFC 8032 — no nonce leak)', () => {
    const signer = makeSigner();
    const a = signVerifiedDoneAttestation(issueVerifiedDoneAttestation(makeInput()), signer);
    const b = signVerifiedDoneAttestation(issueVerifiedDoneAttestation(makeInput()), signer);
    expect(a.credential.proof?.proofValue).toBe(b.credential.proof?.proofValue);
  });

  it('refuses to sign a revoked attestation', () => {
    const unsigned = issueVerifiedDoneAttestation(makeInput());
    expect(() =>
      signVerifiedDoneAttestation({ ...unsigned, proofStatus: 'revoked' }, makeSigner()),
    ).toThrow(/revoked/);
  });
});

describe('verifyVerifiedDoneAttestation (§14.7.1)', () => {
  it('verifies a credential signed by the matching key', () => {
    const { publicKey, privateKey } = generateIssuerKeyPair();
    const signed = signVerifiedDoneAttestation(
      issueVerifiedDoneAttestation(makeInput()),
      makeSigner({ privateKey }),
    );
    expect(verifyVerifiedDoneAttestation(signed.credential, publicKey)).toBe(true);
  });

  it('rejects a credential whose subject was tampered after signing', () => {
    const { publicKey, privateKey } = generateIssuerKeyPair();
    const signed = signVerifiedDoneAttestation(
      issueVerifiedDoneAttestation(makeInput()),
      makeSigner({ privateKey }),
    );
    // Attacker inflates the amount after the signature was applied
    signed.credential.credentialSubject.amount = 5000;
    expect(verifyVerifiedDoneAttestation(signed.credential, publicKey)).toBe(false);
  });

  it('rejects verification under a different key', () => {
    const signed = signVerifiedDoneAttestation(
      issueVerifiedDoneAttestation(makeInput()),
      makeSigner(),
    );
    const { publicKey: otherPublicKey } = generateIssuerKeyPair();
    expect(verifyVerifiedDoneAttestation(signed.credential, otherPublicKey)).toBe(false);
  });

  it('rejects an unsigned credential (no proof block)', () => {
    const { publicKey } = generateIssuerKeyPair();
    const unsigned = issueVerifiedDoneAttestation(makeInput());
    expect(verifyVerifiedDoneAttestation(unsigned.credential, publicKey)).toBe(false);
  });
});

describe('proof options are covered by the signature (§7.2 — F1 regression)', () => {
  // Before the F1 fix the signature covered only the credential body, so every
  // field below could be rewritten after signing and still verify. These are
  // the tampering cases the original suite did not exercise.

  it('rejects a credential whose proof.created was tampered after signing', () => {
    const signer = makeSigner();
    const { publicKey } = generateIssuerKeyPair();
    const signed = signVerifiedDoneAttestation(issueVerifiedDoneAttestation(makeInput()), signer);

    // Re-derive the public key that actually matches this signer's private key
    const pub = createPublicKey(signer.privateKey);
    expect(verifyVerifiedDoneAttestation(signed.credential, pub)).toBe(true);

    signed.credential.proof!.created = '2020-01-01T00:00:00.000Z';
    expect(verifyVerifiedDoneAttestation(signed.credential, pub)).toBe(false);
    // sanity: an unrelated key never verifies either
    expect(verifyVerifiedDoneAttestation(signed.credential, publicKey)).toBe(false);
  });

  it('rejects a credential whose proof.verificationMethod was tampered after signing', () => {
    const signer = makeSigner();
    const signed = signVerifiedDoneAttestation(issueVerifiedDoneAttestation(makeInput()), signer);
    const pub = createPublicKey(signer.privateKey);

    signed.credential.proof!.verificationMethod = 'did:web:attacker.example#key-1';
    expect(verifyVerifiedDoneAttestation(signed.credential, pub)).toBe(false);
  });

  it('rejects a credential whose proof.proofPurpose or type was tampered after signing', () => {
    const signer = makeSigner();
    const pub = createPublicKey(signer.privateKey);

    const a = signVerifiedDoneAttestation(issueVerifiedDoneAttestation(makeInput()), signer);
    a.credential.proof!.proofPurpose = 'authentication';
    expect(verifyVerifiedDoneAttestation(a.credential, pub)).toBe(false);

    const b = signVerifiedDoneAttestation(issueVerifiedDoneAttestation(makeInput()), signer);
    b.credential.proof!.type = 'DataIntegrityProof';
    expect(verifyVerifiedDoneAttestation(b.credential, pub)).toBe(false);
  });
});

describe('loadIssuerSignerFromEnv — key never hardcoded (§14.7.1)', () => {
  it('throws on a non-Ed25519 issuer key rather than failing later at sign time (F3)', () => {
    const { privateKey: rsaKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const prevPem = process.env.KYA_ISSUER_PRIVATE_KEY_PEM;
    const prevVm = process.env.KYA_ISSUER_VERIFICATION_METHOD;
    process.env.KYA_ISSUER_PRIVATE_KEY_PEM = rsaKey
      .export({ type: 'pkcs8', format: 'pem' })
      .toString();
    process.env.KYA_ISSUER_VERIFICATION_METHOD = 'did:web:standards.dws.eu#key-1';
    try {
      // Misconfigured must throw — it must NOT quietly degrade to the unsigned path
      expect(() => loadIssuerSignerFromEnv('2026-07-22T10:00:02.000Z')).toThrow(/Ed25519/);
    } finally {
      if (prevPem !== undefined) process.env.KYA_ISSUER_PRIVATE_KEY_PEM = prevPem;
      else delete process.env.KYA_ISSUER_PRIVATE_KEY_PEM;
      if (prevVm !== undefined) process.env.KYA_ISSUER_VERIFICATION_METHOD = prevVm;
      else delete process.env.KYA_ISSUER_VERIFICATION_METHOD;
    }
  });

  it('returns null when the issuer key env is not configured (unsigned path stays valid)', () => {
    const prevPem = process.env.KYA_ISSUER_PRIVATE_KEY_PEM;
    const prevVm = process.env.KYA_ISSUER_VERIFICATION_METHOD;
    delete process.env.KYA_ISSUER_PRIVATE_KEY_PEM;
    delete process.env.KYA_ISSUER_VERIFICATION_METHOD;
    try {
      expect(loadIssuerSignerFromEnv('2026-07-22T10:00:02.000Z')).toBeNull();
    } finally {
      if (prevPem !== undefined) process.env.KYA_ISSUER_PRIVATE_KEY_PEM = prevPem;
      if (prevVm !== undefined) process.env.KYA_ISSUER_VERIFICATION_METHOD = prevVm;
    }
  });
});
