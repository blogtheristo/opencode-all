// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
// Audit trail: git log -- src/aegis/pilot/operator-evidence.ts
/**
 * Aegis Pilot — operator evidence in the ledger (EVIDENCE_FORMAT_v1.md §5, Copilot review
 * #2321). Every accepted stop (`human.override`) and decision (`human.decide`) carries the
 * operator's own signed command. A valid operator signature is not enough: the site key
 * holder could re-sign a ledger whose event says something other than what the operator
 * signed. So this check binds the two: every command field must equal the event field it
 * became, the credential must be the one the event names, belong to the event's operator,
 * carry the event's role, hold the capability, be valid when the command was signed, and
 * itself verify under the site key.
 *
 * Failures are named (`CODE: …`) so independent verifiers (tools/aegis-verify-py) report
 * the same code for the same defect.
 */

import { type KeyObject } from 'node:crypto';
import { canonicalJSON, keyId, publicKeyFromPem, verifyPayload } from './crypto.js';
import {
  CAP_AGENT_STOP,
  CAP_DECISION,
  CLOCK_SKEW_MS,
  type Credential,
  type SiteManifest,
} from './identity.js';
import type { LedgerEvent } from './evidence-ledger.js';

/** Event types that must carry an operator-signed command. */
export const OPERATOR_EVENT_TYPES: ReadonlySet<string> = new Set([
  'human.override',
  'human.decide',
]);

export const OPERATOR_FAILURE = {
  missing: 'OPERATOR_EVIDENCE_MISSING',
  credentialMissing: 'OPERATOR_CREDENTIAL_MISSING',
  credentialInvalid: 'OPERATOR_CREDENTIAL_INVALID',
  credentialExpired: 'OPERATOR_CREDENTIAL_EXPIRED',
  signature: 'OPERATOR_SIGNATURE_INVALID',
  binding: 'OPERATOR_BINDING_MISMATCH',
} as const;

export interface OperatorEvidenceContext {
  site: SiteManifest;
  /** Credentials by credentialId (bundle `credentials/<id>.json`). */
  credentials: ReadonlyMap<string, Credential>;
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
 * Verify one operator event. `segmentEvents` is the segment the event is in (for the
 * recommendation a decision names). Returns null, or the first named failure.
 */
export function operatorEventFailure(
  e: LedgerEvent,
  segmentEvents: readonly LedgerEvent[],
  ctx: OperatorEvidenceContext,
  sitePublicKey: KeyObject = publicKeyFromPem(ctx.site.publicKeyPem),
): string | null {
  const F = OPERATOR_FAILURE;
  const d = isObject(e.detail) ? e.detail : {};
  const cmd = d.command;
  const sig = d.operator_signature;
  const credId = d.operator_credential_id;
  if (!isObject(cmd) || typeof sig !== 'string' || typeof credId !== 'string')
    return `${F.missing}: event carries no operator-signed command`;
  const mismatch = (field: string) =>
    `${F.binding}:${field}: event field differs from the operator-signed command`;
  if (cmd.operatorCredentialId !== credId) return mismatch('operator_credential_id');

  const cred = ctx.credentials.get(credId);
  if (!cred) return `${F.credentialMissing}: credentials/${credId}.json not in the bundle`;
  const credFail = credentialProblem(cred, credId, ctx.site, sitePublicKey);
  if (credFail) return `${F.credentialInvalid}: ${credFail}`;
  const stop = e.event_type === 'human.override';
  const cap = stop ? CAP_AGENT_STOP : CAP_DECISION;
  if (!Array.isArray(cred.capabilities) || !cred.capabilities.includes(cap))
    return `${F.credentialInvalid}: capability "${cap}" not granted`;

  let operatorKey: KeyObject;
  try {
    operatorKey = publicKeyFromPem(cred.subjectPublicKeyPem as string);
  } catch {
    return `${F.credentialInvalid}: bound public key is not Ed25519`;
  }
  if (!verifyPayload(cmd, sig, operatorKey))
    return `${F.signature}: command signature does not verify under the operator key`;

  const issued = typeof cmd.issuedAt === 'string' ? Date.parse(cmd.issuedAt) : NaN;
  if (
    Number.isNaN(issued) ||
    issued < Date.parse(cred.issuedAt) - CLOCK_SKEW_MS ||
    issued >= Date.parse(cred.expiresAt)
  )
    return `${F.credentialExpired}: command signed outside the credential's validity`;

  if (cred.subjectId !== e.operator_id) return mismatch('operator_id');
  if (cmd.v !== 1) return mismatch('v');
  if (!same(cmd.commandId, d.command_id)) return mismatch('command_id');
  if (!same(cmd.reason, d.reason)) return mismatch('reason');

  if (stop) {
    if (d.action !== 'agent.stop') return mismatch('action');
    if (!same(cmd.target, d.target)) return mismatch('target');
    if (!same(cmd.issuedAt, d.issued_at)) return mismatch('issued_at');
    return null;
  }

  if (d.action !== 'decision') return mismatch('action');
  if (!same(cmd.verdict, d.verdict)) return mismatch('verdict');
  if (!same(cmd.recommendationSeq, d.recommendation_seq)) return mismatch('recommendation_seq');
  if (!same(cmd.recommendationHash, d.recommendation_hash)) return mismatch('recommendation_hash');
  if (!same(cmd.modificationDigest, d.modification_digest)) return mismatch('modification_digest');
  if (!same(cmd.capture ?? 'live', d.capture)) return mismatch('capture');
  if (!same(cmd.issuedAt, d.signed_at)) return mismatch('signed_at');
  const occurred = cmd.capture === 'manual_entry' ? cmd.occurredAt : cmd.issuedAt;
  if (!sameInstant(occurred, d.decided_at)) return mismatch('decided_at');
  if (!same(cred.role, d.decision_by) || typeof cred.role !== 'string')
    return mismatch('decision_by');
  const rec = segmentEvents[Number(cmd.recommendationSeq)];
  if (!rec || rec.seq !== cmd.recommendationSeq || rec.event_hash !== cmd.recommendationHash)
    return mismatch('recommendation');
  return null;
}

/**
 * Every operator event across a bundle's segments. `segments` pairs a label (e.g.
 * "segment 000002" or "active") with that segment's events.
 */
export function verifyOperatorEvidence(
  segments: ReadonlyArray<{ label: string; events: readonly LedgerEvent[] }>,
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
  return failures;
}
