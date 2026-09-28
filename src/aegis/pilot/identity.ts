// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/identity.ts
/**
 * Aegis Pilot — local identity (Store/PRODUCT_AEGIS_PILOT.md, requirement 2).
 *
 * A site authority key, generated and held on site, issues credentials to
 * agents and operators. Every check — signature, expiry, revocation,
 * capability — resolves against files on local disk. There is no reachable
 * control plane in the verification path, by construction: this module
 * imports nothing that can open a socket.
 *
 * Credential kinds:
 *   agent    — capabilities name the workflow steps it may execute.
 *   operator — binds the operator's own Ed25519 public key; the `agent.stop`
 *              capability is the kill authority. The operator's private key
 *              never touches the site state directory.
 */

import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { type KeyObject, randomUUID } from 'node:crypto';
import {
  canonicalJSON,
  generateEd25519,
  keyId,
  privateKeyFromPem,
  publicKeyFromPem,
  sha256,
  signPayload,
  verifyPayload,
} from './crypto.js';

export const CAP_AGENT_STOP = 'agent.stop';

/** Accepted clock skew. Isolated sites drift; five minutes is the tolerance KYA sessions use. */
export const CLOCK_SKEW_MS = 5 * 60 * 1000;

export interface CredentialBody {
  v: 1;
  credentialId: string;
  kind: 'agent' | 'operator';
  subjectId: string;
  subjectName: string;
  siteId: string;
  issuerKeyId: string;
  capabilities: string[];
  /** Operators only: the key their stop commands are signed with. */
  subjectPublicKeyPem?: string;
  issuedAt: string;
  expiresAt: string;
}

export interface Credential extends CredentialBody {
  signature: string;
}

export interface SiteManifest {
  siteId: string;
  keyId: string;
  publicKeyPem: string;
  createdAt: string;
}

export type CredentialCheck = { ok: true } | { ok: false; reason: string };

export function statePaths(stateDir: string) {
  return {
    siteDir: join(stateDir, 'site'),
    siteKey: join(stateDir, 'site', 'site.key'),
    siteManifest: join(stateDir, 'site', 'site.json'),
    revoked: join(stateDir, 'site', 'revoked.json'),
    credentials: join(stateDir, 'credentials'),
    ledger: join(stateDir, 'ledger', 'article12.jsonl'),
    killInbox: join(stateDir, 'kill'),
    outbox: join(stateDir, 'outbox', 'deferred.jsonl'),
    acceptance: join(stateDir, 'acceptance'),
  };
}

/** SHA-256 of the sorted capability list — the `capability_manifest_hash` Article 12 field. */
/**
 * Digest of the whole signed credential. Written into authority.grant so the
 * pseudonymous ledger is bound to one specific credential at grant time: an
 * auditor shown the credential file can check that this agent id was granted
 * exactly these capabilities, without names ever entering the ledger.
 */
export function credentialDigest(cred: Credential): string {
  return sha256(canonicalJSON(cred));
}

export function capabilityManifestHash(capabilities: readonly string[]): string {
  return sha256(canonicalJSON([...capabilities].sort()));
}

function bodyOf(cred: Credential): CredentialBody {
  const { signature: _signature, ...body } = cred;
  return body;
}

export class SiteAuthority {
  private constructor(
    readonly stateDir: string,
    readonly manifest: SiteManifest,
    private readonly privateKey: KeyObject,
    readonly publicKey: KeyObject,
  ) {}

  /** Create a new site authority. Refuses to overwrite an existing one (rotating a key is a deliberate act). */
  static init(stateDir: string, siteId: string, now = new Date()): SiteAuthority {
    if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(siteId)) {
      throw new Error('siteId must be 2-63 chars of lowercase letters, digits and hyphens');
    }
    const p = statePaths(stateDir);
    if (existsSync(p.siteKey)) {
      throw new Error(`site authority already exists at ${p.siteKey}; refusing to overwrite`);
    }
    for (const dir of [p.siteDir, p.credentials, p.killInbox, join(stateDir, 'ledger')]) {
      mkdirSync(dir, { recursive: true, mode: 0o700 });
    }
    const { publicKeyPem, privateKeyPem } = generateEd25519();
    writeFileSync(p.siteKey, privateKeyPem, { mode: 0o600, flag: 'wx' });
    chmodSync(p.siteKey, 0o600);
    const manifest: SiteManifest = {
      siteId,
      keyId: keyId(publicKeyPem),
      publicKeyPem,
      createdAt: now.toISOString(),
    };
    writeFileSync(p.siteManifest, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o644 });
    writeFileSync(p.revoked, '[]\n', { mode: 0o644 });
    return SiteAuthority.load(stateDir);
  }

  static load(stateDir: string): SiteAuthority {
    const p = statePaths(stateDir);
    if (!existsSync(p.siteKey)) {
      throw new Error(`no site authority at ${stateDir} — run "aegis-pilot init" first`);
    }
    const manifest = JSON.parse(readFileSync(p.siteManifest, 'utf8')) as SiteManifest;
    const privateKey = privateKeyFromPem(readFileSync(p.siteKey, 'utf8'));
    const publicKey = publicKeyFromPem(manifest.publicKeyPem);
    if (keyId(manifest.publicKeyPem) !== manifest.keyId) {
      throw new Error('site manifest keyId does not match its public key');
    }
    return new SiteAuthority(stateDir, manifest, privateKey, publicKey);
  }

  /** Sign an arbitrary payload with the site key (acceptance records, ledger seals). */
  sign(payload: unknown): string {
    return signPayload(payload, this.privateKey);
  }

  issue(
    params: {
      kind: 'agent' | 'operator';
      subjectName: string;
      capabilities: string[];
      subjectPublicKeyPem?: string;
      ttlHours: number;
    },
    now = new Date(),
  ): Credential {
    if (params.kind === 'operator' && !params.subjectPublicKeyPem) {
      throw new Error('operator credentials must bind the operator public key');
    }
    if (params.kind === 'agent' && params.capabilities.includes(CAP_AGENT_STOP)) {
      throw new Error('agents cannot hold kill authority; agent.stop is operator-only');
    }
    if (params.subjectPublicKeyPem) publicKeyFromPem(params.subjectPublicKeyPem);
    if (!(params.ttlHours > 0 && params.ttlHours <= 24 * 366)) {
      throw new Error('ttlHours must be in (0, 8784]');
    }
    const body: CredentialBody = {
      v: 1,
      credentialId: randomUUID(),
      kind: params.kind,
      subjectId: randomUUID(),
      subjectName: params.subjectName,
      siteId: this.manifest.siteId,
      issuerKeyId: this.manifest.keyId,
      capabilities: [...new Set(params.capabilities)].sort(),
      subjectPublicKeyPem: params.subjectPublicKeyPem,
      issuedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + params.ttlHours * 3_600_000).toISOString(),
    };
    const cred: Credential = { ...body, signature: this.sign(body) };
    const dir = statePaths(this.stateDir).credentials;
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    writeFileSync(join(dir, `${cred.credentialId}.json`), `${JSON.stringify(cred, null, 2)}\n`);
    return cred;
  }

  revoke(credentialId: string): void {
    const p = statePaths(this.stateDir).revoked;
    const list = readRevoked(this.stateDir);
    if (!list.includes(credentialId)) list.push(credentialId);
    writeFileSync(p, `${JSON.stringify(list, null, 2)}\n`);
  }

  verifier(): CredentialVerifier {
    return new CredentialVerifier(this.manifest, () => readRevoked(this.stateDir));
  }
}

function readRevoked(stateDir: string): string[] {
  const p = statePaths(stateDir).revoked;
  if (!existsSync(p)) return [];
  const parsed: unknown = JSON.parse(readFileSync(p, 'utf8'));
  return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
}

/**
 * Verifies credentials against the site manifest only. Holds no private key,
 * so a runtime that only needs to check identity never loads the site key.
 */
export class CredentialVerifier {
  private readonly publicKey: KeyObject;

  constructor(
    private readonly manifest: SiteManifest,
    private readonly revokedList: () => string[] = () => [],
  ) {
    this.publicKey = publicKeyFromPem(manifest.publicKeyPem);
  }

  static fromStateDir(stateDir: string): CredentialVerifier {
    const manifest = JSON.parse(
      readFileSync(statePaths(stateDir).siteManifest, 'utf8'),
    ) as SiteManifest;
    return new CredentialVerifier(manifest, () => readRevoked(stateDir));
  }

  get siteId(): string {
    return this.manifest.siteId;
  }

  check(cred: Credential, now = new Date(), requiredCapability?: string): CredentialCheck {
    if (cred?.v !== 1) return { ok: false, reason: 'unsupported credential version' };
    if (cred.siteId !== this.manifest.siteId)
      return { ok: false, reason: 'credential is for another site' };
    if (cred.issuerKeyId !== this.manifest.keyId)
      return { ok: false, reason: 'issuer key is not this site authority' };
    if (!verifyPayload(bodyOf(cred), cred.signature, this.publicKey)) {
      return { ok: false, reason: 'credential signature invalid' };
    }
    const t = now.getTime();
    if (Date.parse(cred.issuedAt) - CLOCK_SKEW_MS > t)
      return { ok: false, reason: 'credential not yet valid' };
    if (Date.parse(cred.expiresAt) <= t) return { ok: false, reason: 'credential expired' };
    if (this.revokedList().includes(cred.credentialId))
      return { ok: false, reason: 'credential revoked' };
    if (cred.kind === 'agent' && cred.capabilities.includes(CAP_AGENT_STOP)) {
      return { ok: false, reason: 'agent credential claims operator-only capability' };
    }
    if (requiredCapability && !cred.capabilities.includes(requiredCapability)) {
      return { ok: false, reason: `capability "${requiredCapability}" not granted` };
    }
    return { ok: true };
  }
}

export function loadCredential(path: string): Credential {
  return JSON.parse(readFileSync(path, 'utf8')) as Credential;
}
