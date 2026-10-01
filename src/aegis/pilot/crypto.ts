// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/crypto.ts
/**
 * Aegis Pilot — local crypto primitives.
 *
 * Everything the pilot proves (identity, evidence, kill authority) rests on
 * these few functions, and all of them run on `node:crypto` alone: no network,
 * no third-party library, no control plane. Ed25519 matches the KYA §14.7.1
 * signing choice already used in src/identity/attestation-signing.ts.
 */

import {
  createHash,
  createPrivateKey,
  createPublicKey,
  sign as cryptoSign,
  verify as cryptoVerify,
  generateKeyPairSync,
  type KeyObject,
} from 'node:crypto';

export function sha256(input: string | Buffer): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Deterministic JSON: recursively sorted keys, `undefined` members dropped.
 * Same approach as attestation-signing.ts; stable across sign and verify.
 */
export function canonicalJSON(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const body = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonicalJSON(obj[k])}`)
    .join(',');
  return `{${body}}`;
}

export interface KeyPairPem {
  publicKeyPem: string;
  privateKeyPem: string;
}

export function generateEd25519(): KeyPairPem {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  return {
    publicKeyPem: publicKey.export({ type: 'spki', format: 'pem' }).toString(),
    privateKeyPem: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  };
}

export function privateKeyFromPem(pem: string): KeyObject {
  const key = createPrivateKey(pem);
  if (key.asymmetricKeyType !== 'ed25519') throw new Error('expected an Ed25519 private key');
  return key;
}

export function publicKeyFromPem(pem: string): KeyObject {
  const key = createPublicKey(pem);
  if (key.asymmetricKeyType !== 'ed25519') throw new Error('expected an Ed25519 public key');
  return key;
}

/** Public key PEM derived from a private key — lets a holder prove which key it holds. */
export function publicPemOf(privateKey: KeyObject): string {
  return createPublicKey(privateKey).export({ type: 'spki', format: 'pem' }).toString();
}

/** Key id: first 16 hex chars of sha256(SPKI PEM). Short, stable, collision-safe at pilot scale. */
export function keyId(publicKeyPem: string): string {
  return sha256(publicKeyPem.trim()).slice(0, 16);
}

/** Ed25519 signature over the canonical JSON of `payload`, base64url. */
export function signPayload(payload: unknown, privateKey: KeyObject): string {
  return cryptoSign(null, Buffer.from(canonicalJSON(payload), 'utf8'), privateKey).toString(
    'base64url',
  );
}

export function verifyPayload(payload: unknown, signature: string, publicKey: KeyObject): boolean {
  try {
    return cryptoVerify(
      null,
      Buffer.from(canonicalJSON(payload), 'utf8'),
      publicKey,
      Buffer.from(signature, 'base64url'),
    );
  } catch {
    return false;
  }
}
