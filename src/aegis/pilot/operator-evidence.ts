// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
// Audit trail: git log -- src/aegis/pilot/operator-evidence.ts
/**
 * Aegis Pilot — operator evidence (docs/aegis/EVIDENCE_FORMAT_v1.md §5–§7; Copilot review
 * #2321; advisor review and HIC thread 01.10.2026).
 *
 * Every accepted stop (`human.override`) and decision (`human.decide`) is evidence the
 * operator signed, not only the site:
 *
 *   - the operator signs the command body (`signature`, as before) AND a framed digest
 *     message (`digestSignature`): canonicalJSON({domain, command_id, command_kind, role,
 *     issued_at, command_digest}), command_digest = sha256(canonicalJSON(body));
 *   - the hash-chained event carries only the framed fields, the operator's credential id
 *     and both signatures — never the body or its free-text reason;
 *   - the body goes to an erasable sidecar, <stateDir>/command-bodies/<digest>.json,
 *     exported with the bundle while it exists. Erasing it appends `evidence.redacted`.
 *
 * A valid operator signature is not enough: the site key holder could re-sign a ledger
 * whose event says something else. So verification binds the two — the credential is the
 * one the event names, belongs to the event's operator, carries the event's role, holds
 * the capability, was valid when the command was signed and itself verifies under the
 * site key; the framed signature covers the event's framed fields; and, while the body
 * exists, every body field equals the event field it became.
 *
 * Failures are named (`CODE: …`) so independent verifiers (tools/aegis-verify-py) report
 * the same code for the same defect.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { basename, join } from 'node:path';
import { type KeyObject, randomUUID } from 'node:crypto';
import {
  canonicalJSON,
  keyId,
  publicKeyFromPem,
  sha256,
  signPayload,
  verifyPayload,
} from './crypto.js';
import {
  CAP_AGENT_STOP,
  CAP_DECISION,
  CLOCK_SKEW_MS,
  type Credential,
  type SiteManifest,
} from './identity.js';
import type { EvidenceLedger, LedgerEvent } from './evidence-ledger.js';

export const COMMAND_FRAME_DOMAIN = 'dws.aegis.operator-command.v1';
export type CommandKind = 'stop' | 'decide';

/** Event type each command kind becomes. */
export const OPERATOR_EVENT_OF: Record<CommandKind, 'human.override' | 'human.decide'> = {
  stop: 'human.override',
  decide: 'human.decide',
};
export const OPERATOR_EVENT_TYPES: ReadonlySet<string> = new Set(Object.values(OPERATOR_EVENT_OF));

/** Erasure reasons: codes only, never free text. */
export const REDACTION_REASON_CODES = [
  'data-subject-request',
  'retention-ended',
  'data-minimisation',
  'legal-order',
] as const;
export type RedactionReasonCode = (typeof REDACTION_REASON_CODES)[number];

export const OPERATOR_FAILURE = {
  missing: 'OPERATOR_EVIDENCE_MISSING',
  credentialMissing: 'OPERATOR_CREDENTIAL_MISSING',
  credentialInvalid: 'OPERATOR_CREDENTIAL_INVALID',
  credentialExpired: 'OPERATOR_CREDENTIAL_EXPIRED',
  signature: 'OPERATOR_SIGNATURE_INVALID',
  binding: 'OPERATOR_BINDING_MISMATCH',
  bodyMissing: 'COMMAND_BODY_MISSING',
  bodyInvalid: 'COMMAND_BODY_INVALID',
} as const;

const HEX64 = /^[0-9a-f]{64}$/;

export interface CommandFrame {
  domain: typeof COMMAND_FRAME_DOMAIN;
  command_id: string;
  command_kind: CommandKind;
  role: string | null;
  issued_at: string;
  command_digest: string;
}

/** A signed command split into its body and the two operator signatures. */
export function splitCommand(command: Record<string, unknown>): {
  body: Record<string, unknown>;
  signature: unknown;
  digestSignature: unknown;
} {
  const { signature, digestSignature, ...body } = command;
  return { body, signature, digestSignature };
}

/** sha256 of the canonical JSON of a command body (both signatures removed). */
export function commandDigest(body: Record<string, unknown>): string {
  return sha256(canonicalJSON(splitCommand(body).body));
}

/** Digest of an unverified command, or undefined when it is not an object. A digest only. */
export function commandDigestOf(command: unknown): string | undefined {
  if (!command || typeof command !== 'object' || Array.isArray(command)) return undefined;
  return commandDigest(command as Record<string, unknown>);
}

export function commandFrame(
  kind: CommandKind,
  commandId: string,
  issuedAt: string,
  role: string | null,
  digest: string,
): CommandFrame {
  return {
    domain: COMMAND_FRAME_DOMAIN,
    command_id: commandId,
    command_kind: kind,
    role,
    issued_at: issuedAt,
    command_digest: digest,
  };
}

/** Operator side: the framed digest signature, made at issue time beside the body signature. */
export function signCommandFrame(
  kind: CommandKind,
  body: { commandId: string; issuedAt: string },
  role: string | null,
  operatorKey: KeyObject,
): string {
  const digest = commandDigest(body as unknown as Record<string, unknown>);
  return signPayload(commandFrame(kind, body.commandId, body.issuedAt, role, digest), operatorKey);
}

/** The fields an operator event carries (framed fields, credential id, both signatures). */
export interface OperatorEventFields {
  command_kind: CommandKind;
  command_digest: string;
  issued_at: string;
  role: string | null;
  operator_credential_id: string;
  digest_signature: string;
  operator_signature: string;
}

export function operatorEventFields(
  kind: CommandKind,
  body: Record<string, unknown>,
  cred: Credential,
  signature: string,
  digestSignature: string,
): OperatorEventFields {
  return {
    command_kind: kind,
    command_digest: commandDigest(body),
    issued_at: String(body.issuedAt),
    role: cred.role ?? null,
    operator_credential_id: cred.credentialId,
    digest_signature: digestSignature,
    operator_signature: signature,
  };
}

export function commandBodiesDir(stateDir: string): string {
  return join(stateDir, 'command-bodies');
}

/**
 * Site side: store the signed command body in the erasable sidecar, keyed by its digest.
 * Written durably before the event that references it.
 */
export function storeCommandBody(
  stateDir: string,
  body: Record<string, unknown>,
  signature: string,
): string {
  const digest = commandDigest(body);
  const dir = commandBodiesDir(stateDir);
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const final = join(dir, `${digest}.json`);
  if (existsSync(final)) return digest;
  const tmp = join(dir, `.tmp-${randomUUID()}`);
  writeFileSync(tmp, `${JSON.stringify({ ...body, signature })}\n`, { mode: 0o600, flag: 'wx' });
  renameSync(tmp, final);
  return digest;
}

/** The stored body for a digest, or null when absent, erased or not matching its digest. */
export function readCommandBody(stateDir: string, digest: unknown): Record<string, unknown> | null {
  if (typeof digest !== 'string' || !HEX64.test(digest)) return null;
  const path = join(commandBodiesDir(stateDir), `${digest}.json`);
  if (!existsSync(path)) return null;
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'));
    return isObject(parsed) && commandDigest(parsed) === digest ? parsed : null;
  } catch {
    return null;
  }
}

export interface RedactionTombstone {
  command_digest: string;
  erased_at: string;
  reason_code: RedactionReasonCode;
}

/**
 * Erase one command body: append `evidence.redacted` (digest, time, reason code — no
 * free text, no key-to-person link), then delete the sidecar. A crash between the two
 * leaves a redacted event with the body still present, which verifies. Returns the
 * tombstone, which the caller also writes to the WORM mirror.
 */
export function eraseCommandBody(
  stateDir: string,
  ledger: EvidenceLedger,
  digest: string,
  reasonCode: string,
  now: Date = new Date(),
): RedactionTombstone {
  if (!HEX64.test(digest)) throw new Error('digest must be 64 lowercase hex chars');
  if (!REDACTION_REASON_CODES.includes(reasonCode as RedactionReasonCode)) {
    throw new Error(`reason code must be one of ${REDACTION_REASON_CODES.join(', ')}`);
  }
  const path = join(commandBodiesDir(stateDir), `${digest}.json`);
  if (!existsSync(path))
    throw new Error(`no command body ${digest} in ${commandBodiesDir(stateDir)}`);
  const tombstone: RedactionTombstone = {
    command_digest: digest,
    erased_at: now.toISOString(),
    reason_code: reasonCode as RedactionReasonCode,
  };
  ledger.append({
    event_type: 'evidence.redacted',
    trace_id: randomUUID(),
    detail: { ...tombstone },
  });
  unlinkSync(path);
  return tombstone;
}

export interface OperatorEvidenceContext {
  site: SiteManifest;
  /** Credentials by credentialId (bundle `credentials/<id>.json`). */
  credentials: ReadonlyMap<string, Credential>;
  /** Signed command bodies by digest (bundle `command-bodies/<digest>.json`). */
  bodies: ReadonlyMap<string, Record<string, unknown>>;
  /** Digests with an `evidence.redacted` event anywhere in the chain. */
  redacted: ReadonlySet<string>;
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/** JSON equality of two values as recorded (absent and undefined are the same). */
const same = (a: unknown, b: unknown): boolean =>
  canonicalJSON(a ?? null) === canonicalJSON(b ?? null);

const sameInstant = (a: unknown, b: unknown): boolean =>
  typeof a === 'string' &&
  typeof b === 'string' &&
  !Number.isNaN(Date.parse(a)) &&
  Date.parse(a) === Date.parse(b);

/** Problems with the credential itself, independent of any event. */
export function credentialProblem(
  cred: Credential,
  id: string,
  site: SiteManifest,
  sitePublicKey: KeyObject,
): string | null {
  if (cred?.v !== 1) return 'unsupported credential version';
  if (cred.credentialId !== id) return 'credential file id differs from its credentialId';
  if (cred.kind !== 'operator' || typeof cred.subjectPublicKeyPem !== 'string')
    return 'not an operator credential with a bound public key';
  if (cred.siteId !== site.siteId) return 'credential is for another site';
  if (cred.issuerKeyId !== keyId(site.publicKeyPem)) return 'issuer is not this site key';
  const { signature, ...body } = cred;
  if (typeof signature !== 'string' || !verifyPayload(body, signature, sitePublicKey))
    return 'credential signature does not verify under the site key';
  return null;
}

/**
 * Verify one operator event (EVIDENCE_FORMAT_v1.md §5.3 — the check order is part of the
 * format, so every verifier names the same first failure). `segmentEvents` is the segment
 * the event is in. `bodyOverride` checks a body from elsewhere (an operator copy).
 */
export function operatorEventFailure(
  e: LedgerEvent,
  segmentEvents: readonly LedgerEvent[],
  ctx: OperatorEvidenceContext,
  sitePublicKey: KeyObject = publicKeyFromPem(ctx.site.publicKeyPem),
  bodyOverride?: Record<string, unknown>,
): string | null {
  const F = OPERATOR_FAILURE;
  const mismatch = (field: string) =>
    `${F.binding}:${field}: event field differs from what the operator signed`;
  const d = isObject(e.detail) ? e.detail : {};
  const digest = d.command_digest;
  // 1. Every framed field, the credential id and both signatures are present.
  if (
    typeof digest !== 'string' ||
    !HEX64.test(digest) ||
    typeof d.command_id !== 'string' ||
    typeof d.command_kind !== 'string' ||
    typeof d.issued_at !== 'string' ||
    !(d.role === null || typeof d.role === 'string') ||
    typeof d.operator_credential_id !== 'string' ||
    typeof d.digest_signature !== 'string' ||
    typeof d.operator_signature !== 'string'
  )
    return `${F.missing}: event carries no operator-signed command evidence`;
  // 2. The command kind is the event's kind.
  const kind = d.command_kind as CommandKind;
  if (OPERATOR_EVENT_OF[kind] !== e.event_type) return mismatch('command_kind');
  // 3. The body, while it exists: its digest, and the credential it names.
  const body = bodyOverride ?? ctx.bodies.get(digest);
  if (body) {
    if (commandDigest(body) !== digest)
      return `${F.bodyInvalid}: body does not hash to command_digest`;
    if (!same(body.operatorCredentialId, d.operator_credential_id))
      return mismatch('operator_credential_id');
  }
  // 4–5. The credential: in the bundle, valid under the site key, with the capability.
  const cred = ctx.credentials.get(d.operator_credential_id);
  if (!cred)
    return `${F.credentialMissing}: credentials/${d.operator_credential_id}.json not in the bundle`;
  const credFail = credentialProblem(cred, d.operator_credential_id, ctx.site, sitePublicKey);
  if (credFail) return `${F.credentialInvalid}: ${credFail}`;
  const cap = kind === 'stop' ? CAP_AGENT_STOP : CAP_DECISION;
  if (!Array.isArray(cred.capabilities) || !cred.capabilities.includes(cap))
    return `${F.credentialInvalid}: capability "${cap}" not granted`;
  let operatorKey: KeyObject;
  try {
    operatorKey = publicKeyFromPem(cred.subjectPublicKeyPem as string);
  } catch {
    return `${F.credentialInvalid}: bound public key is not Ed25519`;
  }
  // 6. The framed digest signature covers the event's framed fields.
  const frame = commandFrame(kind, d.command_id, d.issued_at, d.role as string | null, digest);
  if (!verifyPayload(frame, d.digest_signature, operatorKey))
    return `${F.signature}: framed digest signature does not verify under the operator key`;
  // 7. Signed while the credential was valid.
  const issued = Date.parse(d.issued_at);
  if (
    Number.isNaN(issued) ||
    issued < Date.parse(cred.issuedAt) - CLOCK_SKEW_MS ||
    issued >= Date.parse(cred.expiresAt)
  )
    return `${F.credentialExpired}: command signed outside the credential's validity`;
  // 8. The credential is the event's operator and role.
  if (cred.subjectId !== e.operator_id) return mismatch('operator_id');
  if (!same(cred.role ?? null, d.role)) return mismatch('role');
  // 9. Event fields that do not need the body.
  if (kind === 'stop') {
    if (d.action !== 'agent.stop') return mismatch('action');
  } else {
    if (d.action !== 'decision') return mismatch('action');
    if (typeof d.role !== 'string' || d.decision_by !== d.role) return mismatch('decision_by');
    if (!same(d.signed_at, d.issued_at)) return mismatch('signed_at');
    const seq = d.recommendation_seq;
    const rec = typeof seq === 'number' ? segmentEvents[seq] : undefined;
    if (!rec || rec.seq !== seq || rec.event_hash !== d.recommendation_hash)
      return mismatch('recommendation');
  }
  // 10. No body: valid only after a recorded erasure.
  if (!body) {
    return ctx.redacted.has(digest)
      ? null
      : `${F.bodyMissing}: body ${digest} absent and no evidence.redacted records its erasure`;
  }
  // 11. The body: its signature, and every field equal to the event field it became.
  if (!same(body.signature, d.operator_signature)) return mismatch('operator_signature');
  const { body: signed } = splitCommand(body);
  if (!verifyPayload(signed, d.operator_signature, operatorKey))
    return `${F.signature}: command body signature does not verify under the operator key`;
  if (body.v !== 1) return mismatch('v');
  if (!same(body.commandId, d.command_id)) return mismatch('command_id');
  if (!same(body.issuedAt, d.issued_at)) return mismatch('issued_at');
  if (kind === 'stop') {
    if (!same(body.target, d.target)) return mismatch('target');
    return null;
  }
  if (!same(body.verdict, d.verdict)) return mismatch('verdict');
  if (!same(body.recommendationSeq, d.recommendation_seq)) return mismatch('recommendation_seq');
  if (!same(body.recommendationHash, d.recommendation_hash)) return mismatch('recommendation_hash');
  if (!same(body.modificationDigest, d.modification_digest)) return mismatch('modification_digest');
  if (!same(body.capture ?? 'live', d.capture)) return mismatch('capture');
  const occurred = body.capture === 'manual_entry' ? body.occurredAt : body.issuedAt;
  if (!sameInstant(occurred, d.decided_at)) return mismatch('decided_at');
  return null;
}

export interface SegmentEvents {
  label: string;
  events: readonly LedgerEvent[];
}

/** Digests recorded as erased anywhere in the chain. */
export function redactedDigests(segments: readonly SegmentEvents[]): Set<string> {
  const out = new Set<string>();
  for (const s of segments)
    for (const e of s.events)
      if (e.event_type === 'evidence.redacted' && typeof e.detail?.command_digest === 'string')
        out.add(e.detail.command_digest);
  return out;
}

/** Digests every operator event references. */
export function referencedDigests(segments: readonly SegmentEvents[]): Set<string> {
  const out = new Set<string>();
  for (const s of segments)
    for (const e of s.events)
      if (OPERATOR_EVENT_TYPES.has(e.event_type) && typeof e.detail?.command_digest === 'string')
        out.add(e.detail.command_digest);
  return out;
}

/** Every operator event across a bundle's segments, plus bodies no event references. */
export function verifyOperatorEvidence(
  segments: readonly SegmentEvents[],
  ctx: OperatorEvidenceContext,
): string[] {
  const failures: string[] = [];
  let sitePublicKey: KeyObject;
  try {
    sitePublicKey = publicKeyFromPem(ctx.site.publicKeyPem);
  } catch {
    return [`${OPERATOR_FAILURE.credentialInvalid}: site public key unreadable`];
  }
  for (const { label, events } of segments) {
    for (const e of events) {
      if (!OPERATOR_EVENT_TYPES.has(e.event_type)) continue;
      const f = operatorEventFailure(e, events, ctx, sitePublicKey);
      if (f) {
        const [code, ...rest] = f.split(': ');
        failures.push(`${code}: ${label} seq ${e.seq} ${e.event_type}: ${rest.join(': ')}`);
      }
    }
  }
  const referenced = referencedDigests(segments);
  for (const digest of ctx.bodies.keys())
    if (!referenced.has(digest))
      failures.push(
        `${OPERATOR_FAILURE.bodyInvalid}: command-bodies/${digest}.json: no operator event references it`,
      );
  return failures;
}

/**
 * Read `command-bodies/*.json` under `root`. A file whose body does not hash to its name is
 * a failure, never silently re-keyed.
 */
export function readCommandBodies(
  root: string,
  names: readonly string[],
  failures: string[],
): Map<string, Record<string, unknown>> {
  const bodies = new Map<string, Record<string, unknown>>();
  for (const name of names) {
    const digest = basename(name).replace(/\.json$/, '');
    try {
      const parsed: unknown = JSON.parse(readFileSync(join(root, name), 'utf8'));
      if (!isObject(parsed) || commandDigest(parsed) !== digest) {
        failures.push(`${OPERATOR_FAILURE.bodyInvalid}: ${name}: body does not hash to its name`);
        continue;
      }
      bodies.set(digest, parsed);
    } catch (err) {
      failures.push(
        `${OPERATOR_FAILURE.bodyInvalid}: ${name}: unreadable (${(err as Error).message})`,
      );
    }
  }
  return bodies;
}
