// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
// Audit trail: git log -- src/aegis/pilot/lease.ts
/**
 * Aegis Pilot — single-use lease tokens (KYA-S1 TRS-4, Legal/KYA_S1.md).
 *
 * An expiry alone does not stop replay inside the validity window (finding
 * 2026-09-30, docs/plans/KNOWLEDGE_LOOP_FINDINGS.md). A lease authorizes one
 * execution of one action on one subject (`bind`, e.g. the `event_hash` of the
 * accepted recommendation). It is signed by the site key, the issuing
 * authority, and valid for at most LEASE_MAX_TTL_MS.
 *
 * consumeAndExecute is the action's first operation: it validates the lease
 * against the site manifest, then marks it consumed by creating
 * `leases/consumed/<leaseId>.json` with O_CREAT|O_EXCL. That create is atomic
 * across threads and processes on a local filesystem, so exactly one caller
 * wins; only the winner executes. A failed action leaves the lease consumed:
 * TRS-4 forbids an automatic retry. The executing code never judges validity
 * itself; it receives a value only from this function.
 */

import { closeSync, fsyncSync, mkdirSync, openSync, readFileSync, writeSync } from 'node:fs';
import { join } from 'node:path';
import { type KeyObject, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { publicKeyFromPem, verifyPayload } from './crypto.js';
import type { EvidenceLedger } from './evidence-ledger.js';
import { CLOCK_SKEW_MS, type SiteAuthority, type SiteManifest, statePaths } from './identity.js';

/** Longest validity a lease may carry (KYA-S1 §8: TRS validity at KYA-AL1). */
export const LEASE_MAX_TTL_MS = 15 * 60 * 1000;

const ACTION = /^[a-z][a-z0-9._-]{0,63}$/;
const HASH = /^[0-9a-f]{64}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const LeaseSchema = z
  .object({
    v: z.literal(1),
    leaseId: z.string().regex(UUID),
    siteId: z.string().min(1).max(63),
    issuerKeyId: z.string().min(1).max(128),
    action: z.string().regex(ACTION),
    bind: z.string().regex(HASH),
    issuedAt: z.string().datetime(),
    expiresAt: z.string().datetime(),
    signature: z.string().min(1).max(512),
  })
  .strict();

export type Lease = z.infer<typeof LeaseSchema>;
export type LeaseBody = Omit<Lease, 'signature'>;

export type LeaseResult<T> = { ok: true; value: T } | { ok: false; reason: string };

export function issueLease(
  site: SiteAuthority,
  p: { action: string; bind: string; ttlMs: number; now?: Date },
): Lease {
  if (!ACTION.test(p.action)) throw new Error(`invalid lease action: ${p.action}`);
  if (!HASH.test(p.bind)) throw new Error('lease bind must be a sha256 hex digest');
  if (!(p.ttlMs > 0 && p.ttlMs <= LEASE_MAX_TTL_MS))
    throw new Error(`lease validity must be 1..${LEASE_MAX_TTL_MS} ms`);
  const now = p.now ?? new Date();
  const body: LeaseBody = {
    v: 1,
    leaseId: randomUUID(),
    siteId: site.manifest.siteId,
    issuerKeyId: site.manifest.keyId,
    action: p.action,
    bind: p.bind,
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + p.ttlMs).toISOString(),
  };
  return { ...body, signature: site.sign(body) };
}

export class LeaseAuthority {
  private readonly publicKey: KeyObject;
  private readonly consumedDir: string;

  constructor(
    stateDir: string,
    private readonly manifest: SiteManifest,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.publicKey = publicKeyFromPem(manifest.publicKeyPem);
    this.consumedDir = join(stateDir, 'leases', 'consumed');
    mkdirSync(this.consumedDir, { recursive: true, mode: 0o700 });
  }

  /** Verifies against the site manifest only; holds no private key. */
  static load(stateDir: string, now?: () => Date): LeaseAuthority {
    const manifest = JSON.parse(
      readFileSync(statePaths(stateDir).siteManifest, 'utf8'),
    ) as SiteManifest;
    return new LeaseAuthority(stateDir, manifest, now);
  }

  private check(raw: unknown, want: { action: string; bind: string }): Lease | string {
    const parsed = LeaseSchema.safeParse(raw);
    if (!parsed.success) return 'malformed lease';
    const lease = parsed.data;
    if (lease.siteId !== this.manifest.siteId || lease.issuerKeyId !== this.manifest.keyId)
      return 'lease issuer is not this site';
    const { signature, ...body } = lease;
    if (!verifyPayload(body, signature, this.publicKey)) return 'lease signature invalid';
    if (lease.action !== want.action) return 'lease is for a different action';
    if (lease.bind !== want.bind) return 'lease is for a different subject';
    const issued = Date.parse(lease.issuedAt);
    const expires = Date.parse(lease.expiresAt);
    if (!(expires > issued) || expires - issued > LEASE_MAX_TTL_MS)
      return 'lease validity out of bounds';
    const t = this.now().getTime();
    if (issued > t + CLOCK_SKEW_MS) return 'lease not yet valid';
    if (t >= expires) return 'lease expired';
    return lease;
  }

  /**
   * Validate, consume and execute as one step. `fn` runs only for the single
   * caller whose exclusive create succeeded; an error from `fn` propagates and
   * the lease stays consumed.
   */
  async consumeAndExecute<T>(
    raw: unknown,
    want: { action: string; bind: string },
    fn: () => T | Promise<T>,
    opts: { ledger?: EvidenceLedger; traceId?: string } = {},
  ): Promise<LeaseResult<Awaited<T>>> {
    const lease = this.check(raw, want);
    if (typeof lease === 'string') return { ok: false, reason: lease };
    const record = {
      leaseId: lease.leaseId,
      action: lease.action,
      bind: lease.bind,
      consumedAt: this.now().toISOString(),
    };
    let fd: number;
    try {
      fd = openSync(join(this.consumedDir, `${lease.leaseId}.json`), 'wx', 0o600);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'EEXIST')
        return { ok: false, reason: 'lease already consumed (replay)' };
      throw err;
    }
    try {
      writeSync(fd, `${JSON.stringify(record)}\n`);
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    // Capture precedes execution: the ledger names the lease before the action runs.
    opts.ledger?.append({
      event_type: 'tool.invoke',
      trace_id: opts.traceId ?? lease.leaseId,
      detail: { lease_id: lease.leaseId, action: lease.action, bind: lease.bind },
    });
    return { ok: true, value: await fn() };
  }
}
