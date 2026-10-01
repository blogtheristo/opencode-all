// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
// Audit trail: git log -- src/aegis/pilot/operator-copies.ts
/**
 * Aegis Pilot — operator command copies, anchoring level 1 (EVIDENCE_FORMAT_v1.md §7;
 * advisor review 01.10.2026: the only anchor resting on a key outside the box).
 *
 * The site key holder can rewrite and re-sign the ledger before a seal, and can delete an
 * operator's stop with it. The operator's own key is not in the box, so the operator CLI
 * (`stop`, `decide`) keeps what it signed, outside the state directory:
 *
 *   <dir>/<commandId>.json        full copy: the signed command (body, both signatures)
 *                                 and the ledger head it was issued against
 *   <wormDir>/<digest>.json       WORM record for the locked mirror — digests, ids, the
 *                                 role and the framed signature only; never the body or
 *                                 free-text reason (personal-data safe)
 *   <wormDir>/<digest>.redacted.json   tombstone of an erased body (same fields as the
 *                                 evidence.redacted event)
 *
 * Copies are the operator-signed commands themselves — no site-key signature. The
 * directory is configured per site (site-config.ts) to a place the site key holder cannot
 * write; `doctor` warns when it can.
 *
 * `verify-bundle --operator-copies DIR` fails when a copy has no matching ledger event
 * (deleted history), when the event differs from what the operator signed, or when the
 * ledger head the command was issued against is no longer in the chain (rewritten history).
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { KeyObject } from 'node:crypto';
import { canonicalJSON, publicKeyFromPem, verifyPayload } from './crypto.js';
import { type Credential, statePaths } from './identity.js';
import { type LedgerEvent, readLedgerEvents } from './evidence-ledger.js';
import { readSealFiles } from './ledger-segments.js';
import {
  commandDigest,
  commandFrame,
  type CommandKind,
  credentialProblem,
  OPERATOR_EVENT_TYPES,
  operatorEventFailure,
  type OperatorEvidenceContext,
  type RedactionTombstone,
  type SegmentEvents,
  splitCommand,
} from './operator-evidence.js';

export const OPERATOR_COPY_FAILURE = {
  invalid: 'OPERATOR_COPY_INVALID',
  unmatched: 'OPERATOR_COPY_UNMATCHED',
  differs: 'OPERATOR_COPY_DIFFERS',
  signature: 'OPERATOR_COPY_SIGNATURE_INVALID',
  history: 'OPERATOR_COPY_HISTORY_MISSING',
} as const;

/** The ledger head an operator saw when issuing a command. Seq is per segment. */
export interface IssuedAgainst {
  segment: number;
  seq: number;
  event_hash: string;
}

export interface OperatorCopy {
  format: 'aegis-operator-copy/1';
  command_kind: CommandKind;
  /** The signed command exactly as submitted: body, `signature`, `digestSignature`. */
  command: Record<string, unknown>;
  issued_against: IssuedAgainst | null;
}

/** Exactly these fields — the WORM record must stay personal-data safe. */
export interface WormCommandRecord {
  command_digest: string;
  command_id: string;
  command_kind: CommandKind;
  role: string | null;
  issued_at: string;
  operator_credential_id: string;
  digest_signature: string;
  ledger_seq: number | null;
  event_hash: string | null;
}

/** Operator side: the active ledger's head, read (never written) from the state dir. */
export function ledgerHeadForOperator(stateDir: string): IssuedAgainst | null {
  const path = statePaths(stateDir).ledger;
  if (!existsSync(path)) return null;
  const last = readLedgerEvents(path).at(-1);
  if (!last) return null;
  return { segment: readSealFiles(stateDir).length, seq: last.seq, event_hash: last.event_hash };
}

function writeOnce(path: string, doc: unknown, mode: number): void {
  writeFileSync(path, `${JSON.stringify(doc, null, 2)}\n`, { mode, flag: 'wx' });
}

/** Operator side: write the full copy and the WORM record of one signed command. */
export function writeOperatorCopies(params: {
  kind: CommandKind;
  command: Record<string, unknown>;
  credential: Credential;
  issuedAgainst: IssuedAgainst | null;
  dir: string;
  wormDir: string;
}): { copyPath: string; wormPath: string; worm: WormCommandRecord } {
  const { body, digestSignature } = splitCommand(params.command);
  if (typeof digestSignature !== 'string') throw new Error('command carries no digest signature');
  const digest = commandDigest(body);
  const worm: WormCommandRecord = {
    command_digest: digest,
    command_id: String(body.commandId),
    command_kind: params.kind,
    role: params.credential.role ?? null,
    issued_at: String(body.issuedAt),
    operator_credential_id: params.credential.credentialId,
    digest_signature: digestSignature,
    ledger_seq: params.issuedAgainst?.seq ?? null,
    event_hash: params.issuedAgainst?.event_hash ?? null,
  };
  const copy: OperatorCopy = {
    format: 'aegis-operator-copy/1',
    command_kind: params.kind,
    command: params.command,
    issued_against: params.issuedAgainst,
  };
  mkdirSync(params.dir, { recursive: true, mode: 0o700 });
  mkdirSync(params.wormDir, { recursive: true, mode: 0o700 });
  const copyPath = join(params.dir, `${String(body.commandId)}.json`);
  const wormPath = join(params.wormDir, `${digest}.json`);
  writeOnce(copyPath, copy, 0o600);
  writeOnce(wormPath, worm, 0o444);
  return { copyPath, wormPath, worm };
}

/** Write the erasure tombstone to the WORM mirror. */
export function writeWormTombstone(wormDir: string, tombstone: RedactionTombstone): string {
  mkdirSync(wormDir, { recursive: true, mode: 0o700 });
  const path = join(wormDir, `${tombstone.command_digest}.redacted.json`);
  writeOnce(path, tombstone, 0o444);
  return path;
}

export interface OperatorCopiesResult {
  checked: number;
  matched: number;
  /** Copies whose command the site refused (a rejection incident carries their digest). */
  rejected: string[];
  /** Issued-against heads in pruned segments: cannot be checked any more. */
  unverifiable: string[];
  failures: string[];
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/**
 * Check every copy in `dir` (full copies, WORM records and tombstones; not recursive)
 * against a verified chain. `anyPruned`: some sealed segment file is gone.
 */
export function verifyOperatorCopies(
  dir: string,
  segments: readonly SegmentEvents[],
  ctx: OperatorEvidenceContext,
  opts: { anyPruned: boolean },
): OperatorCopiesResult {
  const F = OPERATOR_COPY_FAILURE;
  const result: OperatorCopiesResult = {
    checked: 0,
    matched: 0,
    rejected: [],
    unverifiable: [],
    failures: [],
  };
  if (!existsSync(dir)) {
    result.failures.push(`${F.invalid}: operator copies directory ${dir} not found`);
    return result;
  }
  const byDigest = new Map<string, { e: LedgerEvent; events: readonly LedgerEvent[] }>();
  const rejected = new Set<string>();
  const redactions: LedgerEvent[] = [];
  const hashes = new Map<string, number>();
  for (const s of segments)
    for (const e of s.events) {
      hashes.set(e.event_hash, e.seq);
      const d = e.detail ?? {};
      if (OPERATOR_EVENT_TYPES.has(e.event_type) && typeof d.command_digest === 'string')
        byDigest.set(d.command_digest, { e, events: s.events });
      if (
        e.event_type === 'incident' &&
        /-command-rejected$/.test(String(d.kind)) &&
        typeof d.command_digest === 'string'
      )
        rejected.add(d.command_digest);
      if (e.event_type === 'evidence.redacted') redactions.push(e);
    }
  let sitePublicKey: KeyObject;
  try {
    sitePublicKey = publicKeyFromPem(ctx.site.publicKeyPem);
  } catch {
    result.failures.push(`${F.invalid}: site public key unreadable`);
    return result;
  }

  const history = (name: string, seq: unknown, hash: unknown) => {
    if (hash === null || hash === undefined) return null;
    if (hashes.get(String(hash)) === seq) return null;
    if (opts.anyPruned) {
      result.unverifiable.push(name);
      return null;
    }
    return `${F.history}: ${name}: the ledger head it was issued against (seq ${String(seq)}) is not in the chain`;
  };
  const operatorKeyOf = (credId: unknown): KeyObject | null => {
    const cred = typeof credId === 'string' ? ctx.credentials.get(credId) : undefined;
    if (!cred || credentialProblem(cred, String(credId), ctx.site, sitePublicKey)) return null;
    try {
      return publicKeyFromPem(String(cred.subjectPublicKeyPem));
    } catch {
      return null;
    }
  };

  for (const name of readdirSync(dir)
    .filter((n) => n.endsWith('.json'))
    .sort()) {
    result.checked++;
    let doc: unknown;
    try {
      doc = JSON.parse(readFileSync(join(dir, name), 'utf8'));
    } catch {
      result.failures.push(`${F.invalid}: ${name}: unreadable`);
      continue;
    }
    if (!isObject(doc)) {
      result.failures.push(`${F.invalid}: ${name}: not a JSON object`);
      continue;
    }

    // Erasure tombstone: the ledger must still record that erasure.
    if (typeof doc.erased_at === 'string') {
      const found = redactions.some(
        (r) =>
          r.detail.command_digest === doc.command_digest &&
          r.detail.erased_at === doc.erased_at &&
          r.detail.reason_code === doc.reason_code,
      );
      if (found) result.matched++;
      else
        result.failures.push(`${F.unmatched}: ${name}: no evidence.redacted records this erasure`);
      continue;
    }

    // Full copy: the signed command itself.
    if (isObject(doc.command)) {
      const { body, signature } = splitCommand(doc.command);
      const digest = commandDigest(body);
      const hit = byDigest.get(digest);
      if (!hit) {
        if (rejected.has(digest)) result.rejected.push(name);
        else
          result.failures.push(
            `${F.unmatched}: ${name}: no ledger event carries this command (deleted history)`,
          );
        continue;
      }
      const inner = operatorEventFailure(hit.e, hit.events, ctx, sitePublicKey, {
        ...body,
        signature,
      });
      if (inner) {
        result.failures.push(`${F.differs}: ${name}: ${inner}`);
        continue;
      }
      if (doc.command.digestSignature !== hit.e.detail.digest_signature) {
        result.failures.push(`${F.differs}: ${name}: digest signature differs from the event`);
        continue;
      }
      const ia = isObject(doc.issued_against) ? doc.issued_against : null;
      const h = ia ? history(name, ia.seq, ia.event_hash) : null;
      if (h) result.failures.push(h);
      else result.matched++;
      continue;
    }

    // WORM record: digests and framed fields only.
    if (typeof doc.command_digest === 'string' && typeof doc.digest_signature === 'string') {
      const hit = byDigest.get(doc.command_digest);
      if (!hit) {
        if (rejected.has(doc.command_digest)) result.rejected.push(name);
        else
          result.failures.push(
            `${F.unmatched}: ${name}: no ledger event carries this command digest (deleted history)`,
          );
        continue;
      }
      const d = hit.e.detail;
      const field = (
        [
          'command_id',
          'command_kind',
          'role',
          'issued_at',
          'operator_credential_id',
          'digest_signature',
        ] as const
      ).find((k) => canonicalJSON(doc[k] ?? null) !== canonicalJSON(d[k] ?? null));
      if (field) {
        result.failures.push(`${F.differs}: ${name}: ${field} differs from the ledger event`);
        continue;
      }
      const key = operatorKeyOf(doc.operator_credential_id);
      const frame = commandFrame(
        doc.command_kind as CommandKind,
        String(doc.command_id),
        String(doc.issued_at),
        (doc.role as string | null) ?? null,
        doc.command_digest,
      );
      if (!key || !verifyPayload(frame, doc.digest_signature, key)) {
        result.failures.push(
          `${F.signature}: ${name}: digest signature does not verify under the operator key`,
        );
        continue;
      }
      const h = history(name, doc.ledger_seq, doc.event_hash);
      if (h) result.failures.push(h);
      else result.matched++;
      continue;
    }
    result.failures.push(
      `${F.invalid}: ${name}: neither a command copy, a WORM record nor a tombstone`,
    );
  }
  return result;
}
