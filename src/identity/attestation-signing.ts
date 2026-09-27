/**
 * KYA §14.7 / §14.7.1 — Verified-Done Attestation signing.
 *
 * Implements the v2.0 signing path fixed in KYA §14.7.1: Ed25519 (EdDSA),
 * JWS-enveloped. Kept in a module SEPARATE from ats-engine.ts so the pure
 * mandate-gate logic stays crypto- and key-free — signing is a distinct
 * concern with its own key custody.
 *
 * Uses Node's native Ed25519 (`node:crypto`) — no third-party crypto library
 * in the signing path, consistent with the sovereignty posture (§14.7.1).
 * The proof is a detached EdDSA JWS carried in `proof.proofValue`, typed
 * `JsonWebSignature2020`. Field placement is illustrative until the KYA v2.0
 * freeze (a strict `eddsa-rdfc-2022` Data Integrity proof may replace it if an
 * AP2/FIDO counterparty requires it — §14.7.1).
 *
 * KEY CUSTODY: this module never generates, stores, or loads a production key
 * implicitly. A caller supplies the private key (from an HSM / env at runtime,
 * never hardcoded, never committed — §14.7.1). `loadIssuerSignerFromEnv`
 * returns null when unconfigured, so the unsigned path (proofStatus:'unsigned')
 * still works in environments without a key.
 *
 * @see Legal/KYA_STANDARD_v1.md §14.7, §14.7.1
 * @see src/identity/ats-engine.ts (issueVerifiedDoneAttestation — the unsigned mint)
 */

import {
  createPrivateKey,
  generateKeyPairSync,
  sign as cryptoSign,
  verify as cryptoVerify,
  type KeyObject,
} from 'node:crypto';

import type { AttestationProof, IssuedAttestation, VerifiedDoneAttestation } from './types.js';

/** JOSE header for an EdDSA detached JWS proof. */
const EDDSA_JWS_HEADER = { alg: 'EdDSA' } as const;

/**
 * A signer binds a private key to the issuer identity that will appear in the
 * proof. `created` is caller-supplied so a signature is deterministic and the
 * module holds no clock authority (mirrors the issuer stub).
 */
export interface AttestationSigner {
  /** Ed25519 private key (from HSM/env — never hardcoded or committed) */
  privateKey: KeyObject;
  /** did:web verification method, e.g. did:web:standards.dws.eu#key-1 (§14.7.1) */
  verificationMethod: string;
  /** ISO-8601 proof creation time, caller-supplied */
  created: string;
}

/**
 * Deterministic JSON serialization (recursively sorted keys) used as the bytes
 * to sign / verify. Pragmatic canonicalization pending the v2.0 choice between
 * JCS (RFC 8785) and RDF canonicalization; it is stable and symmetric across
 * sign and verify, which is all the self-issued/self-checked path needs today.
 */
function canonicalJSON(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const body = Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonicalJSON(obj[k])}`)
    .join(',');
  return `{${body}}`;
}

/** Proof metadata covered by the signature — every proof field except `proofValue`. */
type ProofOptions = Omit<AttestationProof, 'proofValue'>;

/**
 * Canonical bytes that get signed: the credential WITHOUT its proof block,
 * bound together with the proof options (every proof field except
 * `proofValue`).
 *
 * Binding the proof options into the signed payload is REQUIRED, not
 * cosmetic. If only the credential body were signed — as an earlier revision
 * did — then `created`, `verificationMethod`, `proofPurpose` and `type` could
 * all be rewritten after signing and the credential would still verify. Two
 * consequences made that unacceptable:
 *
 *   1. `created` is the timestamp on an Article 12 evidence artifact. An
 *      evidence record whose date can be altered without detection is not
 *      evidence.
 *   2. `verificationMethod` tells a verifier WHICH KEY to trust. Leaving it
 *      outside the signature invites a verifier that resolves the key from it
 *      (the did:web flow of §14.7.1) to pick its trust anchor from
 *      attacker-modifiable data.
 *
 * This mirrors W3C Data Integrity, which canonicalizes the proof options
 * together with the document for exactly this reason.
 */
function credentialSigningBytes(
  credential: VerifiedDoneAttestation,
  proofOptions: ProofOptions,
): Buffer {
  const { proof: _proof, ...document } = credential;
  return Buffer.from(canonicalJSON({ document, proofOptions }), 'utf8');
}

/** Generate a fresh Ed25519 issuer key pair (e.g. for a tenant admin rotating keys, §14.7.1). */
export function generateIssuerKeyPair(): { publicKey: KeyObject; privateKey: KeyObject } {
  return generateKeyPairSync('ed25519');
}

/**
 * Signs an unsigned Verified-Done credential, returning it with an EdDSA
 * detached-JWS `proof` and proofStatus:'signed'. Ed25519 signatures are
 * deterministic (RFC 8032), so identical input + key yields an identical
 * proof — no per-signature nonce to leak.
 *
 * Refuses to sign a revoked credential.
 */
export function signVerifiedDoneAttestation(
  issued: IssuedAttestation,
  signer: AttestationSigner,
): IssuedAttestation {
  if (issued.proofStatus === 'revoked') {
    throw new Error('cannot sign a revoked attestation (KYA §14.7)');
  }

  // Proof options are fixed BEFORE signing, then covered by the signature.
  const proofOptions: ProofOptions = {
    type: 'JsonWebSignature2020',
    created: signer.created,
    verificationMethod: signer.verificationMethod,
    proofPurpose: 'assertionMethod',
  };

  const headerB64 = Buffer.from(JSON.stringify(EDDSA_JWS_HEADER)).toString('base64url');
  const payloadB64 = credentialSigningBytes(issued.credential, proofOptions).toString('base64url');
  const signature = cryptoSign(null, Buffer.from(`${headerB64}.${payloadB64}`), signer.privateKey);
  // Detached JWS: payload segment omitted (recomputed from the credential on verify)
  const detachedJws = `${headerB64}..${signature.toString('base64url')}`;

  const proof: AttestationProof = { ...proofOptions, proofValue: detachedJws };

  return { credential: { ...issued.credential, proof }, proofStatus: 'signed' };
}

/**
 * Verifies a signed Verified-Done credential against an issuer public key.
 * Returns false (never throws) on any structural or cryptographic failure —
 * missing/malformed proof, wrong algorithm, tampered subject, tampered proof
 * metadata (`created` / `verificationMethod` / `proofPurpose` / `type`), or a
 * key that does not match.
 *
 * TWO THINGS THIS FUNCTION DOES NOT ANSWER — callers MUST handle both:
 *
 *   1. **Issuer binding.** A `true` result proves the bytes were signed by the
 *      key supplied in `publicKey`. It does NOT prove that key is authorized
 *      to speak for `credential.issuer`. A verifier that resolves the key from
 *      `proof.verificationMethod` MUST independently check that the method is
 *      authorized by the signed `issuer` field, or an attacker can present a
 *      credential signed by their own key naming someone else as issuer
 *      (KYA §7.3).
 *   2. **Revocation.** The travelling credential carries no status. `true`
 *      means "these bytes are authentic", NOT "this attestation is in force".
 *      Check the issuer's revocation status separately (KYA §7.5).
 */
export function verifyVerifiedDoneAttestation(
  credential: VerifiedDoneAttestation,
  publicKey: KeyObject,
): boolean {
  const proof = credential.proof;
  if (!proof || typeof proof.proofValue !== 'string') return false;

  const [headerB64, payloadSegment, sigB64] = proof.proofValue.split('.');
  // Detached JWS: header..signature — the middle payload segment must be empty
  if (!headerB64 || payloadSegment !== '' || !sigB64) return false;

  let header: { alg?: string };
  try {
    header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
  } catch {
    return false;
  }
  if (header.alg !== 'EdDSA') return false;

  // Recompute over the credential AND the proof options as presented, so any
  // post-signing edit to created / verificationMethod / proofPurpose / type
  // changes the payload and fails the signature.
  const { proofValue: _proofValue, ...proofOptions } = proof;
  const payloadB64 = credentialSigningBytes(credential, proofOptions).toString('base64url');
  try {
    return cryptoVerify(
      null,
      Buffer.from(`${headerB64}.${payloadB64}`),
      publicKey,
      Buffer.from(sigB64, 'base64url'),
    );
  } catch {
    return false;
  }
}

/**
 * Builds a signer from environment configuration, or null when unconfigured
 * (the unsigned path stays valid). The private key never appears in code or
 * git — only as a runtime secret (§14.7.1):
 *   KYA_ISSUER_PRIVATE_KEY_PEM        — PKCS#8 PEM of the Ed25519 issuer key
 *   KYA_ISSUER_VERIFICATION_METHOD    — did:web verification method URL
 */
export function loadIssuerSignerFromEnv(created: string): AttestationSigner | null {
  const pem = process.env.KYA_ISSUER_PRIVATE_KEY_PEM;
  const verificationMethod = process.env.KYA_ISSUER_VERIFICATION_METHOD;
  if (!pem || !verificationMethod) return null;

  const privateKey = createPrivateKey(pem);

  // Fail loud at load, not at first signature (Rule 12). Without this, an RSA
  // or EC key loads happily and only blows up inside cryptoSign(null, …) with
  // an opaque error — while the JWS header has already claimed alg:'EdDSA'.
  // A key-type mismatch is a misconfiguration, never a reason to degrade to
  // the unsigned path: unconfigured means null, misconfigured means throw.
  if (privateKey.asymmetricKeyType !== 'ed25519') {
    throw new Error(
      `KYA_ISSUER_PRIVATE_KEY_PEM must be an Ed25519 private key, got ` +
        `'${privateKey.asymmetricKeyType ?? 'unknown'}' (KYA §14.7.1)`,
    );
  }

  return { privateKey, verificationMethod, created };
}
