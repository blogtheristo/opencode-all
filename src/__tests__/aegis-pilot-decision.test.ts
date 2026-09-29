// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- src/__tests__/aegis-pilot-decision.test.ts
/**
 * Readiness plan C5 (HIC 28.09.2026): the operator's approval of a
 * recommendation is a signed decision event, not a note. These tests state
 * that promise: only the operator can decide, only on the recommendation they
 * saw, never after the agent was stopped, and the ledger alone yields the
 * decision journey (recommendation → decision → outcome) and its coverage.
 */

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CAP_AGENT_STOP,
  CAP_DECISION,
  createDecisionCommand,
  createReferenceRegistry,
  createStopCommand,
  type Credential,
  DecisionAuthority,
  decisionJourneys,
  type DecisionVerdict,
  EvidenceLedger,
  generateEd25519,
  KillAuthority,
  type LedgerEvent,
  privateKeyFromPem,
  recordOutcome,
  runWorkflow,
  SiteAuthority,
  statePaths,
  submitDecisionCommand,
  submitStopCommand,
  validateScope,
  verifyLedger,
} from '../aegis/pilot/index.js';
import { signPayload } from '../aegis/pilot/crypto.js';

let dir: string;
let site: SiteAuthority;
let ledger: EvidenceLedger;

function openLedger(): EvidenceLedger {
  return EvidenceLedger.open(statePaths(dir).ledger, {
    siteId: site.manifest.siteId,
    orgId: 'lifetime-oy',
    signer: (h) => site.sign(h),
    publicKey: site.publicKey,
  });
}

function operator(opts: { role?: string; caps?: string[] } = { role: 'shift-supervisor' }): {
  credential: Credential;
  key: ReturnType<typeof privateKeyFromPem>;
} {
  const kp = generateEd25519();
  const credential = site.issue({
    kind: 'operator',
    subjectName: 'Shift operator',
    capabilities: opts.caps ?? [CAP_AGENT_STOP, CAP_DECISION],
    subjectPublicKeyPem: kp.publicKeyPem,
    role: opts.role,
    ttlHours: 1,
  });
  return { credential, key: privateKeyFromPem(kp.privateKeyPem) };
}

function agent(): Credential {
  return site.issue({
    kind: 'agent',
    subjectName: 'advisor',
    capabilities: ['step:x'],
    ttlHours: 1,
  });
}

function recommend(agentId: string, recommendation = true): LedgerEvent {
  return ledger.append({
    event_type: 'agent.decide',
    trace_id: 'run-1',
    agent_id: agentId,
    output_digest: 'a'.repeat(64),
    detail: { step: 'propose-load-shift', decision: 'shift 2 MW to 03:00', recommendation },
  });
}

function decide(
  rec: LedgerEvent,
  op: ReturnType<typeof operator>,
  verdict: DecisionVerdict = 'accept',
) {
  return createDecisionCommand({
    recommendationSeq: rec.seq,
    recommendationHash: rec.event_hash,
    verdict,
    reason: 'checked against load forecast',
    operatorCredential: op.credential,
    operatorKey: op.key,
  });
}

const authority = () => new DecisionAuthority(dir, site.verifier(), ledger, site.publicKey);

function lastEvent(): LedgerEvent {
  return readFileSync(statePaths(dir).ledger, 'utf8')
    .trim()
    .split('\n')
    .map((l) => JSON.parse(l) as LedgerEvent)
    .at(-1)!;
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'aegis-decision-test-'));
  site = SiteAuthority.init(dir, 'reference-site');
  ledger = openLedger();
});

afterEach(() => {
  ledger.close();
  rmSync(dir, { recursive: true, force: true });
});

describe('operator decision is a signed decision event', () => {
  it('records the approval as human.decide bound to the exact recommendation, with the role as decision_by', () => {
    const a = agent();
    const rec = recommend(a.subjectId);
    const op = operator();
    const out = authority().execute(decide(rec, op), 'ops');
    expect(out).toMatchObject({ accepted: true, verdict: 'accept' });
    const ev = lastEvent();
    expect(ev).toMatchObject({
      event_type: 'human.decide',
      trace_id: 'run-1',
      operator_id: op.credential.subjectId,
      // The operator's act: must not count as an event by the recommending agent.
      agent_id: null,
      input_digest: rec.output_digest,
      detail: {
        verdict: 'accept',
        journey_event: 'PATH_ACCEPTED',
        decision_by: 'shift-supervisor',
        recommendation_seq: rec.seq,
        recommendation_hash: rec.event_hash,
        recommended_by: a.subjectId,
      },
    });
    expect(typeof ev.detail.decision_latency_ms).toBe('number');
    expect(verifyLedger(statePaths(dir).ledger, { publicKey: site.publicKey }).valid).toBe(true);
  });

  it('is never recorded as human.override, which acceptance reads as a stop', () => {
    const rec = recommend(agent().subjectId);
    authority().execute(decide(rec, operator()), 'ops');
    expect(lastEvent().event_type).not.toBe('human.override');
  });

  it('refuses a decision whose hash names a different recommendation from the seq', () => {
    const a = agent();
    const first = recommend(a.subjectId);
    const second = recommend(a.subjectId);
    const op = operator();
    const cmd = createDecisionCommand({
      recommendationSeq: first.seq,
      recommendationHash: second.event_hash,
      verdict: 'accept',
      reason: 'x',
      operatorCredential: op.credential,
      operatorKey: op.key,
    });
    const out = authority().execute(cmd, 'ops');
    expect(out).toMatchObject({ accepted: false, reason: /hash does not match/ });
    expect(lastEvent()).toMatchObject({ event_type: 'incident' });
  });

  it('refuses to decide on an ordinary step record that is not a recommendation', () => {
    const rec = recommend(agent().subjectId, false);
    const out = authority().execute(decide(rec, operator()), 'ops');
    expect(out).toMatchObject({ accepted: false, reason: /not a recommendation/ });
  });

  it('refuses an operator without decision.record, and one with it but no role', () => {
    const rec = recommend(agent().subjectId);
    const stopOnly = operator({ caps: [CAP_AGENT_STOP] });
    expect(authority().execute(decide(rec, stopOnly), 'ops')).toMatchObject({
      accepted: false,
      reason: /decision\.record/,
    });
    expect(() => operator({ role: undefined, caps: [CAP_DECISION] })).toThrow(/requires a role/);
  });

  it('never lets an agent credential hold decision authority', () => {
    expect(() =>
      site.issue({ kind: 'agent', subjectName: 'x', capabilities: [CAP_DECISION], ttlHours: 1 }),
    ).toThrow(/operator-only/);
  });

  it('rejects roles that look like names rather than roles', () => {
    expect(() => operator({ role: 'Matti Meikäläinen' })).toThrow(/role must be/);
  });

  it('refuses a forged signature and a command signed with another operator key', () => {
    const rec = recommend(agent().subjectId);
    const op = operator();
    const other = operator();
    const cmd = decide(rec, op);
    const { signature: _s, ...body } = cmd;
    const forged = { ...body, signature: signPayload(body, other.key) };
    expect(authority().execute(forged, 'ops')).toMatchObject({
      accepted: false,
      reason: /signature does not match/,
    });
    expect(() =>
      createDecisionCommand({
        recommendationSeq: rec.seq,
        recommendationHash: rec.event_hash,
        verdict: 'accept',
        reason: 'x',
        operatorCredential: op.credential,
        operatorKey: other.key,
      }),
    ).toThrow(/does not match/);
  });

  it('refuses a stale command, a replay, and a revoked operator', () => {
    const rec = recommend(agent().subjectId);
    const op = operator();
    const old = createDecisionCommand(
      {
        recommendationSeq: rec.seq,
        recommendationHash: rec.event_hash,
        verdict: 'defer',
        reason: 'x',
        operatorCredential: op.credential,
        operatorKey: op.key,
      },
      new Date(Date.now() - 11 * 60 * 1000),
    );
    const auth = authority();
    expect(auth.execute(old, 'ops')).toMatchObject({ accepted: false, reason: /expired/ });
    const cmd = decide(rec, op, 'defer');
    expect(auth.execute(cmd, 'ops').accepted).toBe(true);
    expect(auth.execute(cmd, 'ops')).toMatchObject({ accepted: false, reason: /replay/ });
    site.revoke(op.credential.credentialId);
    expect(auth.execute(decide(rec, op), 'ops')).toMatchObject({
      accepted: false,
      reason: /revoked/,
    });
  });

  it('allows a decision after a defer, but not a second final decision', () => {
    const rec = recommend(agent().subjectId);
    const op = operator();
    const auth = authority();
    expect(auth.execute(decide(rec, op, 'defer'), 'ops').accepted).toBe(true);
    expect(auth.execute(decide(rec, op, 'reject'), 'ops').accepted).toBe(true);
    expect(auth.execute(decide(rec, op, 'accept'), 'ops')).toMatchObject({
      accepted: false,
      reason: /already decided/,
    });
  });

  it('refuses a decision on a recommendation whose agent the operator stopped: the path is abandoned', () => {
    const a = agent();
    const kill = new KillAuthority(dir, site.verifier(), ledger);
    kill.register(a);
    const rec = recommend(a.subjectId);
    const op = operator();
    submitStopCommand(
      dir,
      createStopCommand({
        target: a.subjectId,
        reason: 'operator stop',
        operatorCredential: op.credential,
        operatorKey: op.key,
      }),
    );
    expect(kill.drainInbox('ops')[0].accepted).toBe(true);
    expect(authority().execute(decide(rec, op), 'ops')).toMatchObject({
      accepted: false,
      reason: /abandoned/,
    });
    const summary = decisionJourneys(statePaths(dir).ledger);
    expect(summary.journeys[0]).toMatchObject({ status: 'abandoned', complete: true });
  });

  it('works through the local inbox, with no network in the path', () => {
    const rec = recommend(agent().subjectId);
    submitDecisionCommand(dir, decide(rec, operator()));
    const [out] = authority().drainInbox('ops');
    expect(out.accepted).toBe(true);
    // A fresh authority rebuilds the replay set from processed/ and refuses a re-drop.
    expect(authority().drainInbox('ops')).toEqual([]);
  });
});

describe('outcome and the decision journey', () => {
  it('records the outcome only for an accepted decision, once, with numeric metrics', () => {
    const a = agent();
    const op = operator();
    const auth = authority();
    const accepted = auth.execute(decide(recommend(a.subjectId), op), 'ops');
    const rejected = auth.execute(decide(recommend(a.subjectId), op, 'reject'), 'ops');

    expect(() =>
      recordOutcome(ledger, {
        decisionSeq: rejected.ledgerSeq!,
        decisionHash: rejected.eventHash!,
        result: 'positive',
      }),
    ).toThrow(/only for an accepted/);
    expect(() =>
      recordOutcome(ledger, {
        decisionSeq: accepted.ledgerSeq!,
        decisionHash: accepted.eventHash!,
        result: 'positive',
        metrics: { eur_estimated: Number.NaN },
      }),
    ).toThrow(/finite number/);

    const ev = recordOutcome(
      ledger,
      {
        decisionSeq: accepted.ledgerSeq!,
        decisionHash: accepted.eventHash!,
        result: 'positive',
        metrics: { kwh_shifted: 1800, eur_estimated: 142.5 },
        evidenceRef: 'meter-export-2026-11-03',
      },
      site.publicKey,
    );
    expect(ev).toMatchObject({
      event_type: 'outcome.record',
      detail: { journey_event: 'OUTCOME_RECORDED', decision_hash: accepted.eventHash },
    });
    expect(() =>
      recordOutcome(ledger, {
        decisionSeq: accepted.ledgerSeq!,
        decisionHash: accepted.eventHash!,
        result: 'positive',
      }),
    ).toThrow(/already recorded/);
  });

  it('reports coverage from the ledger alone: complete paths over recommendations', () => {
    const a = agent();
    const op = operator();
    const auth = authority();
    const r1 = recommend(a.subjectId);
    const r2 = recommend(a.subjectId);
    recommend(a.subjectId); // r3 stays pending
    const d1 = auth.execute(decide(r1, op), 'ops');
    auth.execute(decide(r2, op, 'reject'), 'ops');

    let summary = decisionJourneys(statePaths(dir).ledger);
    // r1 accepted without an outcome is not yet a complete path.
    expect(summary).toMatchObject({ recommendations: 3, complete: 1 });
    expect(summary.byStatus).toMatchObject({ accepted: 1, rejected: 1, pending: 1 });

    recordOutcome(ledger, {
      decisionSeq: d1.ledgerSeq!,
      decisionHash: d1.eventHash!,
      result: 'positive',
    });
    summary = decisionJourneys(statePaths(dir).ledger);
    expect(summary.complete).toBe(2);
    expect(summary.coverage).toBeCloseTo(2 / 3);
    expect(summary.journeys[0]).toMatchObject({
      status: 'accepted',
      decisionBy: 'shift-supervisor',
      complete: true,
    });
    expect(summary.medianDecisionLatencyMs).not.toBeNull();
  });
});

describe('runner marks advisory output as a recommendation', () => {
  it('writes detail.recommendation only when the step says so', async () => {
    const scopeJson = JSON.parse(
      readFileSync(join(process.cwd(), 'config/aegis-pilot/reference-scope.json'), 'utf8'),
    );
    const v = validateScope(scopeJson);
    if (!v.ok) throw new Error(v.errors.join('\n'));
    const scope = v.scope;
    const reference = createReferenceRegistry({
      readingsPath: join(process.cwd(), 'config/aegis-pilot/sample-readings.json'),
      reportDir: join(dir, 'reports'),
      syncUrl: 'none',
    });
    const registry = {
      ...reference,
      'decide-actions': async () => ({
        output: { action: 'shift-load' },
        decision: 'recommend shifting load',
        recommendation: true,
      }),
    };
    const kill = new KillAuthority(dir, site.verifier(), ledger);
    const wfAgent = site.issue({
      kind: 'agent',
      subjectName: 'wf',
      capabilities: scope.workflow.steps.map((s) => `step:${s.id}`),
      ttlHours: 1,
    });
    await runWorkflow({
      scope,
      registry,
      ledger,
      kill,
      verifier: site.verifier(),
      agent: wfAgent,
      uplinkDown: true,
      outboxPath: statePaths(dir).outbox,
      signOutbox: (p) => site.sign(p),
      traceId: 't',
    });
    const summary = decisionJourneys(statePaths(dir).ledger);
    expect(summary.recommendations).toBe(1);
    expect(summary.journeys[0]).toMatchObject({ status: 'pending', agentId: wfAgent.subjectId });
  });
});
