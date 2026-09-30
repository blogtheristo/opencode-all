// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
// Audit trail: git log -- src/aegis/pilot/decision-authority.ts
/**
 * Aegis Pilot — operator decisions on agent recommendations (readiness plan C5,
 * HIC 28.09.2026: "the approval is a decision event, not a note").
 *
 * An advisory step emits a recommendation: an `agent.decide` event with
 * `detail.recommendation = true` and no decision-maker. The operator's
 * accept / reject / defer is a separate `human.decide` event, signed by the
 * operator's own key on the same path as a stop command, so it works with the
 * uplink down. The measured result of an accepted recommendation is an
 * `outcome.record` event. Together they are the decision journey
 * (docs/plans/2026-09-24-decision-journey-outcome-evidence.md):
 *
 *   agent.decide (recommendation) → PATH_RECOMMENDED    decision_by: none
 *   human.decide  accept          → PATH_ACCEPTED       decision_by: operator role
 *   human.decide  reject          → PATH_REJECTED
 *   human.decide  defer           → PATH_DELAYED        (a later decision may follow)
 *   outcome.record                → OUTCOME_RECORDED    only after accept
 *   human.override on the agent   → PATH_ABANDONED      no decision is accepted after it
 *
 * A decision is honoured only if: the operator credential is valid for this
 * site, grants `decision.record` and carries a role; the command is signed by
 * the key bound in that credential; it is fresh and not a replay; and it names
 * a recommendation by both `seq` and `event_hash`, so it cannot be applied to a
 * different recommendation from the one the operator saw. `human.decide`
 * never carries `agent_id`: it is the operator's act, and acceptance
 * condition (iii) counts every event carrying a stopped agent's id.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { type KeyObject, randomUUID } from 'node:crypto';
import {
  canonicalJSON,
  publicKeyFromPem,
  publicPemOf,
  sha256,
  signPayload,
  verifyPayload,
} from './crypto.js';
import {
  CAP_DECISION,
  CLOCK_SKEW_MS,
  type Credential,
  type CredentialVerifier,
  loadCredential,
  ROLE_PATTERN,
  statePaths,
} from './identity.js';
import {
  type EvidenceLedger,
  type LedgerEvent,
  readLedgerEvents,
  readVerifiedLedger,
} from './evidence-ledger.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const HASH = /^[0-9a-f]{64}$/;
const METRIC_KEY = /^[a-z][a-z0-9_]{0,39}$/;
/** An identifier or URI of the evidence (meter export, log id) — not free text. */
const EVIDENCE_REF = /^[A-Za-z0-9._:/#-]{1,200}$/;

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
/** A manual entry may describe a decision at most this old (the last capture-lag band). */
export const MANUAL_ENTRY_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/** A decision command older than this is refused as a possible replay. */
export const DECISION_COMMAND_MAX_AGE_MS = 10 * 60 * 1000;

/**
 * `modify`: the operator accepted the recommendation with changes, and the command
 * carries the digest of what was actually decided. Anti-rubber-stamp (HIC 29.09.2026):
 * the record shows what the operator checked and changed, not only that they clicked.
 */
export type DecisionVerdict = 'accept' | 'modify' | 'reject' | 'defer';
const VERDICTS: readonly DecisionVerdict[] = ['accept', 'modify', 'reject', 'defer'];

/** Decision-journey event each verdict corresponds to. */
export const JOURNEY_EVENT: Record<DecisionVerdict, string> = {
  accept: 'PATH_ACCEPTED',
  modify: 'PATH_ACCEPTED',
  reject: 'PATH_REJECTED',
  defer: 'PATH_DELAYED',
};

/**
 * `live`: signed at the moment of deciding; the signature time is machine-observed.
 * `manual_entry`: a decision taken earlier (on paper, by phone) and entered afterwards;
 * the operator states when it occurred, which the kit cannot observe.
 */
export type DecisionCapture = 'live' | 'manual_entry';
const CAPTURES: readonly DecisionCapture[] = ['live', 'manual_entry'];

/**
 * Evidence weights and capture-lag factors from the decision-journey design
 * (docs/plans/2026-09-24-decision-journey-outcome-evidence.md §3.5, v1 proposals).
 * evidence_strength = weight × factor; it caps any learning delta built on the decision.
 */
export const EVIDENCE_WEIGHT = { HUMAN_CONFIRMED: 0.8, MANUAL_ENTRY: 0.4 } as const;
export function captureLagFactor(lagMs: number): number {
  const min = 60_000;
  const day = 24 * 60 * min;
  if (lagMs <= 5 * min) return 1;
  if (lagMs <= day) return 0.9;
  if (lagMs <= 7 * day) return 0.7;
  if (lagMs <= 30 * day) return 0.5;
  return 0.3;
}

/**
 * Final decisions needed before a "no challenge" review signal is reported: that many
 * decisions with no rejection and no modification reads as a rubber stamp, not a result.
 * HIC-confirmed 30.09.2026.
 */
export const REVIEW_SIGNAL_MIN_DECISIONS = 10;

export type OutcomeResult = 'positive' | 'negative' | 'neutral' | 'unknown';
const OUTCOME_RESULTS: readonly OutcomeResult[] = ['positive', 'negative', 'neutral', 'unknown'];

export interface DecisionCommandBody {
  v: 1;
  commandId: string;
  recommendationSeq: number;
  recommendationHash: string;
  verdict: DecisionVerdict;
  reason: string;
  issuedAt: string;
  operatorCredentialId: string;
  /** Omitted means `live` — keeps commands signed before this field verifiable. */
  capture?: DecisionCapture;
  /** manual_entry only: when the decision actually occurred (operator-stated). */
  occurredAt?: string;
  /**
   * modify only: sha256 of the canonical JSON of the recommendation as modified — the
   * same digest as the recommendation's output_digest, so an unchanged "modification"
   * is refused. Only the digest is recorded; the change is auditable if the operator
   * keeps the modified file (runbook §5.1). JS canonicalJSON: other-language verifiers
   * must reproduce its number formatting.
   */
  modificationDigest?: string;
}

/** Rules every decision body must meet; checked before signing and again on receipt. */
function bodyProblem(b: DecisionCommandBody): string | null {
  if (b.capture !== undefined && !CAPTURES.includes(b.capture)) {
    return 'capture must be live or manual_entry';
  }
  if (b.verdict === 'modify') {
    if (typeof b.modificationDigest !== 'string' || !HASH.test(b.modificationDigest)) {
      return 'a modify decision must carry the digest of the modified recommendation';
    }
  } else if (b.modificationDigest !== undefined) {
    return 'modificationDigest belongs only to a modify decision';
  }
  if ((b.verdict === 'reject' || b.verdict === 'modify') && !b.reason.trim()) {
    return `a ${b.verdict} decision must state its reason`;
  }
  if (b.capture === 'manual_entry') {
    if (typeof b.occurredAt !== 'string' || !ISO_UTC.test(b.occurredAt)) {
      return 'a manual entry must state when the decision occurred (ISO 8601 UTC, e.g. 2026-11-03T10:00:00Z)';
    }
    const occurred = Date.parse(b.occurredAt);
    if (occurred > Date.parse(b.issuedAt)) return 'occurredAt cannot be after the signing time';
    if (Date.parse(b.issuedAt) - occurred > MANUAL_ENTRY_MAX_AGE_MS) {
      return 'a manual entry older than 30 days is not a decision record; record it as an incident';
    }
  } else if (b.occurredAt !== undefined) {
    return 'occurredAt belongs only to a manual entry; a live decision occurs when it is signed';
  }
  return null;
}

export interface DecisionCommand extends DecisionCommandBody {
  signature: string;
}

export interface DecisionOutcome {
  accepted: boolean;
  commandId: string;
  reason?: string;
  verdict?: DecisionVerdict;
  /** Ledger seq of the human.decide (accepted) or incident (rejected) event. */
  ledgerSeq?: number;
  /** event_hash of the human.decide event; outcome.record binds to it. */
  eventHash?: string;
  /** The decision's occurred_at: signing time when live, operator-stated for a manual entry. */
  decidedAt?: string;
  /** The operator's signing time (issuedAt), always. */
  signedAt?: string;
}

/** Operator side: build and sign a decision on one recommendation. Pure — no I/O. */
export function createDecisionCommand(
  params: {
    recommendationSeq: number;
    recommendationHash: string;
    verdict: DecisionVerdict;
    reason: string;
    operatorCredential: Credential;
    operatorKey: KeyObject;
    capture?: DecisionCapture;
    occurredAt?: string;
    /** modify only: the recommendation as the operator changed it (hashed, not stored). */
    modifiedRecommendation?: unknown;
  },
  now = new Date(),
): DecisionCommand {
  if (
    params.operatorCredential.subjectPublicKeyPem?.trim() !== publicPemOf(params.operatorKey).trim()
  ) {
    throw new Error('operator private key does not match the key bound in the operator credential');
  }
  if (!VERDICTS.includes(params.verdict))
    throw new Error('verdict must be accept, modify, reject or defer');
  if (!Number.isSafeInteger(params.recommendationSeq) || params.recommendationSeq < 0) {
    throw new Error('recommendationSeq must be a non-negative integer');
  }
  if (!HASH.test(params.recommendationHash)) {
    throw new Error('recommendationHash must be a 64-char lowercase hex event hash');
  }
  const body: DecisionCommandBody = {
    v: 1,
    commandId: randomUUID(),
    recommendationSeq: params.recommendationSeq,
    recommendationHash: params.recommendationHash,
    verdict: params.verdict,
    reason: params.reason.slice(0, 200),
    issuedAt: now.toISOString(),
    operatorCredentialId: params.operatorCredential.credentialId,
    capture:
      params.capture === undefined || params.capture === 'live'
        ? undefined
        : (params.capture as DecisionCapture),
    occurredAt: params.occurredAt,
    modificationDigest:
      params.modifiedRecommendation === undefined
        ? undefined
        : sha256(canonicalJSON(params.modifiedRecommendation)),
  };
  const problem = bodyProblem(body);
  if (problem) throw new Error(problem);
  return { ...body, signature: signPayload(body, params.operatorKey) };
}

export function decisionInbox(stateDir: string): string {
  return join(stateDir, 'decide');
}

/** Operator side: drop a signed decision into the site's local inbox (atomic rename). */
export function submitDecisionCommand(stateDir: string, command: DecisionCommand): string {
  const inbox = decisionInbox(stateDir);
  mkdirSync(inbox, { recursive: true, mode: 0o700 });
  const final = join(inbox, `${command.commandId}.json`);
  const tmp = `${final}.tmp`;
  writeFileSync(tmp, JSON.stringify(command), { mode: 0o600 });
  renameSync(tmp, final);
  return final;
}

const isRecommendation = (e: LedgerEvent): boolean =>
  e.event_type === 'agent.decide' && e.detail?.recommendation === true;

/** True when an accepted stop hit the recommending agent after the recommendation. */
function abandonedAfter(events: readonly LedgerEvent[], rec: LedgerEvent) {
  return events.some(
    (e) =>
      e.seq > rec.seq &&
      e.event_type === 'human.override' &&
      Array.isArray(e.detail?.agents_stopped) &&
      (e.detail.agents_stopped as unknown[]).includes(rec.agent_id),
  );
}

const decisionsFor = (events: readonly LedgerEvent[], rec: LedgerEvent): LedgerEvent[] =>
  events.filter(
    (e) => e.event_type === 'human.decide' && e.detail?.recommendation_hash === rec.event_hash,
  );

export class DecisionAuthority {
  private readonly seen = new Set<string>();
  private readonly outcomes: DecisionOutcome[] = [];

  constructor(
    private readonly stateDir: string,
    private readonly verifier: CredentialVerifier,
    private readonly ledger: EvidenceLedger,
    private readonly sitePublicKey?: KeyObject,
    private readonly now: () => Date = () => new Date(),
  ) {
    const inbox = decisionInbox(stateDir);
    for (const sub of ['processed', 'rejected']) {
      mkdirSync(join(inbox, sub), { recursive: true, mode: 0o700 });
    }
    for (const f of readdirSync(join(inbox, 'processed'))) {
      this.seen.add(f.replace(/\.json$/, ''));
    }
  }

  get history(): readonly DecisionOutcome[] {
    return this.outcomes;
  }

  /** Verify and record one decision. Never throws on a bad command — records it. */
  execute(command: DecisionCommand, traceId: string): DecisionOutcome {
    const reject = (reason: string, operatorId: string | null = null): DecisionOutcome => {
      const outcome: DecisionOutcome = {
        accepted: false,
        // From an unverified file: never write attacker-chosen text to the ledger.
        commandId:
          typeof command?.commandId === 'string' && UUID.test(command.commandId)
            ? command.commandId
            : 'invalid',
        reason,
      };
      outcome.ledgerSeq = this.ledger.append({
        event_type: 'incident',
        trace_id: traceId,
        operator_id: operatorId,
        detail: { kind: 'decision-command-rejected', command_id: outcome.commandId, reason },
      }).seq;
      this.outcomes.push(outcome);
      return outcome;
    };

    if (
      command?.v !== 1 ||
      typeof command.commandId !== 'string' ||
      !UUID.test(command.commandId) ||
      !VERDICTS.includes(command.verdict) ||
      !Number.isSafeInteger(command.recommendationSeq) ||
      command.recommendationSeq < 0 ||
      typeof command.recommendationHash !== 'string' ||
      !HASH.test(command.recommendationHash) ||
      typeof command.reason !== 'string' ||
      command.reason.length > 200 ||
      typeof command.issuedAt !== 'string'
    ) {
      return reject('malformed command');
    }
    const problem = bodyProblem(command);
    if (problem) return reject(`malformed command: ${problem}`);
    // Marked seen only once accepted: a forged file reusing a genuine commandId
    // must not be able to burn that id before the genuine command arrives.
    if (this.seen.has(command.commandId)) return reject('command already processed (replay)');

    if (!UUID.test(String(command.operatorCredentialId))) {
      return reject('operator credential not issued by this site');
    }
    const credPath = join(
      statePaths(this.stateDir).credentials,
      `${command.operatorCredentialId}.json`,
    );
    if (!existsSync(credPath)) return reject('operator credential not issued by this site');
    const cred = loadCredential(credPath);
    const t = this.now();
    const check = this.verifier.check(cred, t, CAP_DECISION);
    if (!check.ok) return reject(`operator credential: ${check.reason}`, cred.subjectId);
    if (cred.kind !== 'operator' || !cred.subjectPublicKeyPem) {
      return reject('credential is not an operator credential', cred.subjectId);
    }
    if (typeof cred.role !== 'string' || !ROLE_PATTERN.test(cred.role)) {
      return reject('operator credential carries no decision role', cred.subjectId);
    }
    const { signature, ...body } = command;
    if (!verifyPayload(body, signature, publicKeyFromPem(cred.subjectPublicKeyPem))) {
      return reject('command signature does not match operator key', cred.subjectId);
    }
    const issued = Date.parse(command.issuedAt);
    if (Number.isNaN(issued) || issued - CLOCK_SKEW_MS > t.getTime()) {
      return reject('command issuedAt is in the future', cred.subjectId);
    }
    if (t.getTime() - issued > DECISION_COMMAND_MAX_AGE_MS) {
      return reject('command expired (older than replay window)', cred.subjectId);
    }

    // The recommendation is read from a verified chain, never from the command.
    const { verification, events } = readVerifiedLedger(this.ledger.path, {
      publicKey: this.sitePublicKey,
    });
    if (!verification.valid) {
      return reject(`ledger failed verification: ${verification.reason}`, cred.subjectId);
    }
    // The ledger, not processed/, is the authority on what was executed: a deleted
    // processed/ file or a crash before the rename must not re-open a replay.
    if (
      events.some(
        (e) => e.event_type === 'human.decide' && e.detail?.command_id === command.commandId,
      )
    ) {
      return reject('command already processed (replay)', cred.subjectId);
    }
    const rec = events[command.recommendationSeq];
    if (!rec || !isRecommendation(rec)) {
      return reject('referenced event is not a recommendation', cred.subjectId);
    }
    if (rec.event_hash !== command.recommendationHash) {
      return reject('recommendation hash does not match the ledger', cred.subjectId);
    }
    if (abandonedAfter(events, rec)) {
      return reject('recommendation abandoned: its agent was stopped', cred.subjectId);
    }
    if (decisionsFor(events, rec).some((d) => d.detail?.verdict !== 'defer')) {
      return reject('recommendation already decided', cred.subjectId);
    }
    // A "modify" that changes nothing is an acknowledgement dressed as a challenge.
    // modificationDigest uses the same canonical digest as the recommendation's
    // output_digest, so an unchanged recommendation is detectable here.
    if (command.verdict === 'modify' && command.modificationDigest === rec.output_digest) {
      return reject('modify names an unchanged recommendation; use accept', cred.subjectId);
    }
    const live = command.capture !== 'manual_entry';
    const occurred = live ? issued : Date.parse(command.occurredAt as string);
    if (occurred < Date.parse(rec.timestamp)) {
      return reject('decision cannot occur before the recommendation it answers', cred.subjectId);
    }
    const quality = live ? 'HUMAN_CONFIRMED' : 'MANUAL_ENTRY';
    const captureLagMs = Math.max(0, t.getTime() - occurred);
    const strength =
      Math.round(EVIDENCE_WEIGHT[quality] * captureLagFactor(captureLagMs) * 100) / 100;

    this.seen.add(command.commandId);
    const event = this.ledger.append({
      event_type: 'human.decide',
      trace_id: rec.trace_id,
      operator_id: cred.subjectId,
      // What was decided on: the recommendation's output, by digest.
      input_digest: rec.output_digest,
      detail: {
        action: 'decision',
        verdict: command.verdict,
        journey_event: JOURNEY_EVENT[command.verdict],
        decision_by: cred.role,
        command_id: command.commandId,
        recommendation_seq: rec.seq,
        recommendation_hash: rec.event_hash,
        recommended_by: rec.agent_id,
        reason: command.reason,
        modified: command.verdict === 'modify' ? true : undefined,
        modification_digest: command.modificationDigest,
        // occurred_at of the response. Live: the moment the operator signed it, not the
        // moment the site recorded it, so a drained decision does not inflate operator time.
        decided_at: new Date(occurred).toISOString(),
        capture: live ? 'live' : 'manual_entry',
        evidence_quality: quality,
        evidence_strength: strength,
        capture_lag_ms: captureLagMs,
        // Operator time is a number only when the response time was machine-observed.
        decision_latency_ms: live ? Math.max(0, issued - Date.parse(rec.timestamp)) : null,
        latency_basis: live
          ? 'operator-signed issuedAt minus recommendation timestamp'
          : 'none: manual entry, response time not machine-observed',
        // Queue delay between signing and recording; > 0 after a drain.
        recorded_lag_ms: Math.max(0, t.getTime() - issued),
      },
    });
    const outcome: DecisionOutcome = {
      accepted: true,
      commandId: command.commandId,
      verdict: command.verdict,
      ledgerSeq: event.seq,
      eventHash: event.event_hash,
      decidedAt: new Date(occurred).toISOString(),
      signedAt: command.issuedAt,
    };
    this.outcomes.push(outcome);
    return outcome;
  }

  /**
   * Process every command currently in the inbox. With `reconcile`, a catch-up drain
   * outside a run also records a `system.reconcile` event carrying the ledger head it
   * started from, so the record shows "decided locally, recorded later" instead of
   * splicing the queued decisions in as if they had been recorded live.
   */
  drainInbox(traceId: string, opts: { reconcile?: boolean } = {}): DecisionOutcome[] {
    const inbox = decisionInbox(this.stateDir);
    if (!existsSync(inbox)) return [];
    const headBefore = this.ledger.head;
    const results: DecisionOutcome[] = [];
    for (const f of readdirSync(inbox)
      .filter((n) => n.endsWith('.json'))
      .sort()) {
      const path = join(inbox, f);
      let command: DecisionCommand;
      try {
        command = JSON.parse(readFileSync(path, 'utf8')) as DecisionCommand;
      } catch {
        command = { commandId: f.replace(/\.json$/, '') } as DecisionCommand;
      }
      const outcome = this.execute(command, traceId);
      results.push(outcome);
      const dest = outcome.accepted
        ? join(inbox, 'processed', `${outcome.commandId}.json`)
        : join(inbox, 'rejected', `${Date.now()}-${f}`);
      renameSync(path, dest);
    }
    if (opts.reconcile && results.length > 0) {
      const signed = results
        .filter((r) => r.accepted && r.signedAt)
        .map((r) => r.signedAt as string)
        .sort();
      this.ledger.append({
        event_type: 'system.reconcile',
        trace_id: traceId,
        detail: {
          kind: 'decision-drain',
          head_before: headBefore,
          commands: results.length,
          recorded: results.filter((r) => r.accepted).length,
          rejected: results.filter((r) => !r.accepted).length,
          earliest_signed_at: signed[0],
          latest_signed_at: signed.at(-1),
        },
      });
    }
    return results;
  }

  /** Poll the local inbox. Returns a stop function. */
  watch(traceId: string, pollMs = 200): () => void {
    const timer = setInterval(() => this.drainInbox(traceId), pollMs);
    timer.unref?.();
    return () => clearInterval(timer);
  }
}

/**
 * Site side: record the measured result of an accepted recommendation. Metrics
 * are numbers only (e.g. `kwh_shifted`, `eur_estimated`), never personal data.
 * Throws on anything that would break the journey — an outcome is not optional
 * evidence, and a wrong one must not be written.
 */
export function recordOutcome(
  ledger: EvidenceLedger,
  params: {
    decisionSeq: number;
    decisionHash: string;
    result: OutcomeResult;
    metrics?: Record<string, number>;
    evidenceRef?: string;
  },
  sitePublicKey?: KeyObject,
): LedgerEvent {
  if (!OUTCOME_RESULTS.includes(params.result)) {
    throw new Error('result must be positive, negative, neutral or unknown');
  }
  const metrics = params.metrics ?? {};
  const keys = Object.keys(metrics);
  if (keys.length > 20) throw new Error('at most 20 metrics');
  for (const k of keys) {
    if (!METRIC_KEY.test(k)) throw new Error(`metric name "${k}" must match ${METRIC_KEY}`);
    if (typeof metrics[k] !== 'number' || !Number.isFinite(metrics[k])) {
      throw new Error(`metric "${k}" must be a finite number`);
    }
  }
  if (
    params.evidenceRef !== undefined &&
    (typeof params.evidenceRef !== 'string' || !EVIDENCE_REF.test(params.evidenceRef))
  ) {
    throw new Error(`evidenceRef must be an identifier or URI matching ${EVIDENCE_REF}`);
  }
  const { verification, events } = readVerifiedLedger(ledger.path, { publicKey: sitePublicKey });
  if (!verification.valid) throw new Error(`ledger failed verification: ${verification.reason}`);
  const decision = events[params.decisionSeq];
  if (!decision || decision.event_type !== 'human.decide') {
    throw new Error('referenced event is not a decision');
  }
  if (decision.event_hash !== params.decisionHash) {
    throw new Error('decision hash does not match the ledger');
  }
  if (decision.detail?.verdict !== 'accept' && decision.detail?.verdict !== 'modify') {
    throw new Error('an outcome is recorded only for an accepted recommendation');
  }
  if (
    events.some(
      (e) => e.event_type === 'outcome.record' && e.detail?.decision_hash === decision.event_hash,
    )
  ) {
    throw new Error('outcome already recorded for this decision');
  }
  return ledger.append({
    event_type: 'outcome.record',
    trace_id: decision.trace_id,
    detail: {
      journey_event: 'OUTCOME_RECORDED',
      decision_seq: decision.seq,
      decision_hash: decision.event_hash,
      recommendation_hash: decision.detail.recommendation_hash,
      result: params.result,
      metrics,
      evidence_ref: params.evidenceRef,
    },
  });
}

export type JourneyStatus =
  | 'pending'
  | 'deferred'
  | 'accepted'
  | 'modified'
  | 'rejected'
  | 'abandoned';

export interface DecisionJourney {
  recommendationSeq: number;
  recommendationHash: string;
  agentId: string | null;
  /** Credential key id of the operator who made the final decision. */
  operatorId: string | null;
  status: JourneyStatus;
  decisionSeq: number | null;
  decisionBy: string | null;
  decisionLatencyMs: number | null;
  outcomeSeq: number | null;
  capture: DecisionCapture | null;
  evidenceStrength: number | null;
  /** Terminal: rejected, abandoned, or accepted/modified with a recorded outcome. */
  complete: boolean;
}

export interface ReviewGroup {
  key: string;
  finalDecisions: number;
  challenged: number;
  status: 'insufficient-data' | 'challenged' | 'no-challenge';
}

export interface ReviewSignal {
  /**
   * `no-challenge` if ANY operator, or any recommending agent, has at least
   * REVIEW_SIGNAL_MIN_DECISIONS final decisions and none rejected or modified. Judged
   * per group so trivially rejected decoys from one agent cannot mask another's
   * rubber-stamped stream, and one operator's challenges cannot clear another's.
   */
  status: 'insufficient-data' | 'challenged' | 'no-challenge';
  note: string;
  byOperator: ReviewGroup[];
  byAgent: ReviewGroup[];
}

export interface JourneySummary {
  recommendations: number;
  complete: number;
  /** complete / recommendations — the pilot's sold number (report D7). Null with no recommendations. */
  coverage: number | null;
  byStatus: Record<JourneyStatus, number>;
  /** Operator time from recommendation to final decision, live decisions only (report D7). */
  medianDecisionLatencyMs: number | null;
  /** accepted + modified + rejected. */
  finalDecisions: number;
  /** Read with operator time, never apart from it: fast decisions that never push back are a rubber stamp. */
  rejectionShare: number | null;
  modificationShare: number | null;
  manualEntryShare: number | null;
  /**
   * abandoned / recommendations. An abandoned path (the operator stopped the agent) is
   * complete: the stop is signed evidence. It stays in coverage's denominator, so stops
   * cannot shrink it, and this share is reported beside coverage, so stopping instead of
   * deciding cannot quietly inflate coverage either (HIC 30.09.2026).
   */
  abandonedShare: number | null;
  /** Minimum evidence_strength over final decisions: the cap on any learning delta from them. */
  weakestEvidence: number | null;
  /**
   * `capture` is attested by the operator: the kit cannot tell a live decision from
   * one signed later. Evidence strength is a cap on learning, never a trust score.
   */
  evidenceBasis: string;
  reviewSignal: ReviewSignal;
  journeys: DecisionJourney[];
}

/** Rebuild every decision journey from a ledger file. Pure read. */
export function decisionJourneys(path: string): JourneySummary {
  const events = readLedgerEvents(path);
  const journeys: DecisionJourney[] = events.filter(isRecommendation).map((rec) => {
    const decisions = decisionsFor(events, rec);
    const final = decisions.find((d) => d.detail?.verdict !== 'defer') ?? null;
    const outcome = final
      ? (events.find(
          (e) => e.event_type === 'outcome.record' && e.detail?.decision_hash === final.event_hash,
        ) ?? null)
      : null;
    let status: JourneyStatus;
    if (final) {
      const v = final.detail.verdict;
      status = v === 'accept' ? 'accepted' : v === 'modify' ? 'modified' : 'rejected';
    } else if (abandonedAfter(events, rec)) status = 'abandoned';
    else status = decisions.length > 0 ? 'deferred' : 'pending';
    return {
      recommendationSeq: rec.seq,
      recommendationHash: rec.event_hash,
      agentId: rec.agent_id,
      status,
      decisionSeq: final?.seq ?? null,
      operatorId: final?.operator_id ?? null,
      decisionBy: typeof final?.detail?.decision_by === 'string' ? final.detail.decision_by : null,
      decisionLatencyMs:
        typeof final?.detail?.decision_latency_ms === 'number'
          ? final.detail.decision_latency_ms
          : null,
      outcomeSeq: outcome?.seq ?? null,
      capture: final?.detail?.capture === 'manual_entry' ? 'manual_entry' : final ? 'live' : null,
      evidenceStrength:
        typeof final?.detail?.evidence_strength === 'number'
          ? final.detail.evidence_strength
          : null,
      complete:
        status === 'rejected' ||
        status === 'abandoned' ||
        ((status === 'accepted' || status === 'modified') && !!outcome),
    };
  });
  const byStatus: Record<JourneyStatus, number> = {
    pending: 0,
    deferred: 0,
    accepted: 0,
    modified: 0,
    rejected: 0,
    abandoned: 0,
  };
  for (const j of journeys) byStatus[j.status]++;
  const complete = journeys.filter((j) => j.complete).length;
  const latencies = journeys
    .map((j) => j.decisionLatencyMs)
    .filter((x): x is number => x !== null)
    .sort((x, y) => x - y);
  const mid = latencies.length >> 1;
  const finalJourneys = journeys.filter((j) => j.decisionSeq !== null);
  const finalDecisions = finalJourneys.length;
  const share = (n: number) => (finalDecisions ? n / finalDecisions : null);
  const strengths = finalJourneys
    .map((j) => j.evidenceStrength)
    .filter((x): x is number => x !== null);
  const group = (keyOf: (j: DecisionJourney) => string | null): ReviewGroup[] => {
    const m = new Map<string, ReviewGroup>();
    for (const jn of finalJourneys) {
      const key = keyOf(jn) ?? 'unknown';
      const g = m.get(key) ?? {
        key,
        finalDecisions: 0,
        challenged: 0,
        status: 'insufficient-data',
      };
      g.finalDecisions++;
      if (jn.status === 'rejected' || jn.status === 'modified') g.challenged++;
      m.set(key, g);
    }
    for (const g of m.values()) {
      g.status =
        g.finalDecisions < REVIEW_SIGNAL_MIN_DECISIONS
          ? 'insufficient-data'
          : g.challenged === 0
            ? 'no-challenge'
            : 'challenged';
    }
    return [...m.values()];
  };
  const byOperator = group((jn) => jn.operatorId);
  const byAgent = group((jn) => jn.agentId);
  const flagged = [
    ...byOperator.filter((g) => g.status === 'no-challenge').map((g) => `operator ${g.key}`),
    ...byAgent.filter((g) => g.status === 'no-challenge').map((g) => `agent ${g.key}`),
  ];
  const anyJudged = [...byOperator, ...byAgent].some((g) => g.status !== 'insufficient-data');
  const reviewSignal: ReviewSignal = flagged.length
    ? {
        status: 'no-challenge',
        note: `${flagged.join(', ')}: ${REVIEW_SIGNAL_MIN_DECISIONS}+ decisions, none rejected or modified — review whether the operator is checking or only acknowledging`,
        byOperator,
        byAgent,
      }
    : anyJudged
      ? {
          status: 'challenged',
          note: 'every operator and agent with enough decisions has rejected or modified at least one',
          byOperator,
          byAgent,
        }
      : {
          status: 'insufficient-data',
          note: `no operator or agent has ${REVIEW_SIGNAL_MIN_DECISIONS} final decisions yet`,
          byOperator,
          byAgent,
        };
  return {
    recommendations: journeys.length,
    complete,
    coverage: journeys.length ? complete / journeys.length : null,
    byStatus,
    medianDecisionLatencyMs: latencies.length
      ? latencies.length % 2
        ? latencies[mid]
        : (latencies[mid - 1] + latencies[mid]) / 2
      : null,
    finalDecisions,
    rejectionShare: share(byStatus.rejected),
    modificationShare: share(byStatus.modified),
    manualEntryShare: share(finalJourneys.filter((j) => j.capture === 'manual_entry').length),
    abandonedShare: journeys.length ? byStatus.abandoned / journeys.length : null,
    weakestEvidence: strengths.length ? Math.min(...strengths) : null,
    evidenceBasis:
      'capture (live / manual_entry) is operator-attested; strength caps learning, it is not a trust score',
    reviewSignal,
    journeys,
  };
}
