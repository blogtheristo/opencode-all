// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
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
  type Connector,
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
  readLedgerEvents,
  recordOutcome,
  REVIEW_SIGNAL_MIN_DECISIONS,
  runAcceptance,
  runWorkflow,
  SiteAuthority,
  statePaths,
  type StepHandler,
  submitDecisionCommand,
  submitStopCommand,
  validateScope,
  verifyLedger,
} from '../aegis/pilot/index.js';
import { canonicalJSON, sha256, signPayload } from '../aegis/pilot/crypto.js';

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
  it('takes the marker from the signed scope, never from the handler', async () => {
    const scopeJson = JSON.parse(
      readFileSync(join(process.cwd(), 'config/aegis-pilot/reference-scope.json'), 'utf8'),
    );
    const v = validateScope(scopeJson);
    if (!v.ok) throw new Error(v.errors.join('\n'));
    const scope = v.scope;
    expect(scope.workflow.steps.find((s) => s.id === 'decide-actions')?.advisory).toBe(true);
    const reference = createReferenceRegistry({
      readingsPath: join(process.cwd(), 'config/aegis-pilot/sample-readings.json'),
      reportDir: join(dir, 'reports'),
      syncUrl: 'none',
    });
    // A handler on a non-advisory step claiming to be a recommendation is ignored.
    const claiming = (async () => ({
      output: [],
      decision: 'claims to be a recommendation',
      recommendation: true,
    })) as StepHandler;
    const registry = { ...reference, 'evaluate-limits': claiming };
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
    const rec = readLedgerEvents(statePaths(dir).ledger)[summary.journeys[0].recommendationSeq];
    expect(rec.detail.step).toBe('decide-actions');
    expect(summary.journeys[0]).toMatchObject({ status: 'pending', agentId: wfAgent.subjectId });
  });
});

describe('security review fixes (C5)', () => {
  it('refuses a replay even when the processed/ file is deleted: the ledger is the authority', () => {
    const rec = recommend(agent().subjectId);
    const cmd = decide(rec, operator(), 'defer');
    submitDecisionCommand(dir, cmd);
    expect(authority().drainInbox('ops')[0].accepted).toBe(true);
    rmSync(join(dir, 'decide', 'processed', `${cmd.commandId}.json`));
    const fresh = authority();
    expect(fresh.execute(cmd, 'ops')).toMatchObject({ accepted: false, reason: /replay/ });
  });

  it('never writes an attacker-chosen command id into the ledger', () => {
    const out = authority().execute(
      { commandId: 'Matti Meikäläinen, hetu 010101-123A' } as never,
      'ops',
    );
    expect(out).toMatchObject({ accepted: false, commandId: 'invalid' });
    expect(JSON.stringify(lastEvent())).not.toContain('Meikäläinen');
  });

  it('refuses to sign a command with a malformed seq or hash', () => {
    const op = operator();
    const base = {
      verdict: 'accept' as const,
      reason: 'x',
      operatorCredential: op.credential,
      operatorKey: op.key,
    };
    expect(() =>
      createDecisionCommand({
        ...base,
        recommendationSeq: Number.NaN,
        recommendationHash: 'a'.repeat(64),
      }),
    ).toThrow(/non-negative integer/);
    expect(() =>
      createDecisionCommand({ ...base, recommendationSeq: 1, recommendationHash: 'xyz' }),
    ).toThrow(/64-char/);
  });

  it('accepts an evidence reference only as an identifier or URI, not free text', () => {
    const op = operator();
    const d = authority().execute(decide(recommend(agent().subjectId), op), 'ops');
    expect(() =>
      recordOutcome(ledger, {
        decisionSeq: d.ledgerSeq!,
        decisionHash: d.eventHash!,
        result: 'positive',
        evidenceRef: 'Called Matti on his mobile',
      }),
    ).toThrow(/identifier or URI/);
  });

  it('keeps timestamps monotonic when the site clock steps back, and records the step', () => {
    ledger.close();
    let t = Date.parse('2026-11-03T10:00:00Z');
    const clocked = EvidenceLedger.open(statePaths(dir).ledger, {
      siteId: site.manifest.siteId,
      orgId: 'lifetime-oy',
      signer: (h) => site.sign(h),
      publicKey: site.publicKey,
      now: () => new Date(t),
    });
    clocked.append({ event_type: 'system.heartbeat', trace_id: 'c' });
    t -= 30_000; // NTP steps the clock back 30 s
    const ev = clocked.append({ event_type: 'system.heartbeat', trace_id: 'c' });
    clocked.close();
    ledger = openLedger();
    expect(ev.detail).toMatchObject({ clock_step_back_ms: 30_000 });
    expect(verifyLedger(statePaths(dir).ledger, { publicKey: site.publicKey }).valid).toBe(true);
  });
});

describe('decisions during the severed-uplink run', () => {
  it('records a queued decision while the acceptance run holds the ledger, and the run still PASSes', async () => {
    const s = JSON.parse(
      readFileSync(join(process.cwd(), 'config/aegis-pilot/reference-scope.json'), 'utf8'),
    );
    s.acceptance.heartbeatMs = 100;
    s.acceptance.maxGapMs = 2000;
    s.acceptance.windowMinutes = 1;
    const v = validateScope(s);
    if (!v.ok) throw new Error(v.errors.join('\n'));
    const rec = recommend(agent().subjectId);
    const op = operator();
    const cmd = decide(rec, op, 'reject');
    submitDecisionCommand(dir, cmd);
    ledger.close();

    const isolated: Connector = async () => ({ outcome: 'unreachable', code: 'ENETUNREACH' });
    const signed = await runAcceptance({
      stateDir: dir,
      scope: v.scope,
      registry: createReferenceRegistry({
        readingsPath: join(process.cwd(), 'config/aegis-pilot/sample-readings.json'),
        reportDir: join(dir, 'reports'),
        syncUrl: 'none',
      }),
      env: {} as NodeJS.ProcessEnv,
      probeIntervalMs: 200,
      kind: 'rehearsal',
      connector: isolated,
      operator: { mode: 'automated', ...op },
    });
    ledger = openLedger();
    expect(signed.record.outcome).toBe('PASS');
    const decided = readLedgerEvents(statePaths(dir).ledger).find(
      (e) => e.event_type === 'human.decide',
    );
    expect(decided?.detail).toMatchObject({ command_id: cmd.commandId, verdict: 'reject' });
    const summary = decisionJourneys(statePaths(dir).ledger);
    // The seeded recommendation is rejected; the run's own advisory step is pending.
    expect(summary.byStatus).toMatchObject({ rejected: 1, pending: 1 });
  }, 60_000);
});

describe('operator time is measured from the signed response, not from recording', () => {
  it('uses the operator-signed issuedAt as occurred_at, and reports the drain lag separately', () => {
    const rec = recommend(agent().subjectId);
    const t0 = Date.parse(rec.timestamp);
    const op = operator();
    const cmd = createDecisionCommand(
      {
        recommendationSeq: rec.seq,
        recommendationHash: rec.event_hash,
        verdict: 'accept',
        reason: 'checked',
        operatorCredential: op.credential,
        operatorKey: op.key,
      },
      new Date(t0 + 60_000),
    );
    // Recorded four minutes after signing (queued, then drained).
    const late = new DecisionAuthority(
      dir,
      site.verifier(),
      ledger,
      site.publicKey,
      () => new Date(t0 + 300_000),
    );
    expect(late.execute(cmd, 'ops').accepted).toBe(true);
    expect(lastEvent().detail).toMatchObject({
      decided_at: cmd.issuedAt,
      decision_latency_ms: 60_000,
      recorded_lag_ms: 240_000,
    });
    expect(decisionJourneys(statePaths(dir).ledger).medianDecisionLatencyMs).toBe(60_000);
  });

  it('records a catch-up drain as a reconciliation carrying the head it started from', () => {
    const rec = recommend(agent().subjectId);
    const headBefore = ledger.head;
    submitDecisionCommand(dir, decide(rec, operator()));
    authority().drainInbox('drain', { reconcile: true });
    const ev = lastEvent();
    expect(ev).toMatchObject({
      event_type: 'system.reconcile',
      detail: { kind: 'decision-drain', head_before: headBefore, recorded: 1, rejected: 0 },
    });
  });

  it('adds no reconciliation event when a run drains decisions live', () => {
    const rec = recommend(agent().subjectId);
    submitDecisionCommand(dir, decide(rec, operator()));
    authority().drainInbox('run');
    expect(lastEvent().event_type).toBe('human.decide');
  });
});

describe('anti-rubber-stamp (HIC 29.09.2026)', () => {
  function cmd(
    rec: LedgerEvent,
    op: ReturnType<typeof operator>,
    extra: Partial<Parameters<typeof createDecisionCommand>[0]>,
    now?: Date,
  ) {
    return createDecisionCommand(
      {
        recommendationSeq: rec.seq,
        recommendationHash: rec.event_hash,
        verdict: 'accept',
        reason: 'checked',
        operatorCredential: op.credential,
        operatorKey: op.key,
        ...extra,
      },
      now,
    );
  }

  it('records a modify decision with the digest of what was actually decided, and allows its outcome', () => {
    const rec = recommend(agent().subjectId);
    const changed = { action: 'shift-load', mw: 1.5, window: '02:00-04:00' };
    const out = authority().execute(
      cmd(rec, operator(), {
        verdict: 'modify',
        reason: '2 MW exceeds the feeder limit tonight',
        modifiedRecommendation: changed,
      }),
      'ops',
    );
    expect(out.accepted).toBe(true);
    expect(lastEvent().detail).toMatchObject({
      verdict: 'modify',
      journey_event: 'PATH_ACCEPTED',
      modified: true,
      modification_digest: sha256(canonicalJSON(changed)),
    });
    recordOutcome(ledger, {
      decisionSeq: out.ledgerSeq!,
      decisionHash: out.eventHash!,
      result: 'positive',
    });
    const summary = decisionJourneys(statePaths(dir).ledger);
    expect(summary.journeys[0]).toMatchObject({ status: 'modified', complete: true });
    expect(summary.modificationShare).toBe(1);
  });

  it('refuses a modify without a digest, and a reject or modify without a reason', () => {
    const rec = recommend(agent().subjectId);
    const op = operator();
    expect(() => cmd(rec, op, { verdict: 'modify', reason: 'x' })).toThrow(/digest/);
    expect(() => cmd(rec, op, { verdict: 'reject', reason: '  ' })).toThrow(
      /must state its reason/,
    );
    expect(() =>
      cmd(rec, op, { verdict: 'modify', reason: '', modifiedRecommendation: { a: 1 } }),
    ).toThrow(/must state its reason/);
    // A command body tampered to drop the reason fails on receipt too, before the signature.
    const good = cmd(rec, op, { verdict: 'reject', reason: 'unsafe' });
    const tampered = { ...good, reason: '' };
    expect(authority().execute(tampered, 'ops')).toMatchObject({
      accepted: false,
      reason: /must state its reason/,
    });
  });

  it('marks a decision entered afterwards as MANUAL_ENTRY at low strength, with no operator-time number', () => {
    const rec = recommend(agent().subjectId);
    const t0 = Date.parse(rec.timestamp);
    const occurredAt = new Date(t0 + 60_000).toISOString();
    const signedAt = new Date(t0 + 30 * 60_000); // typed in 30 minutes later
    const late = new DecisionAuthority(
      dir,
      site.verifier(),
      ledger,
      site.publicKey,
      () => new Date(signedAt.getTime() + 1000),
    );
    const out = late.execute(
      cmd(rec, operator(), { capture: 'manual_entry', occurredAt }, signedAt),
      'ops',
    );
    expect(out.accepted).toBe(true);
    expect(lastEvent().detail).toMatchObject({
      capture: 'manual_entry',
      evidence_quality: 'MANUAL_ENTRY',
      evidence_strength: 0.36, // 0.40 × 0.90 (captured within a day)
      decided_at: occurredAt,
      decision_latency_ms: null,
    });
    const summary = decisionJourneys(statePaths(dir).ledger);
    expect(summary).toMatchObject({
      manualEntryShare: 1,
      weakestEvidence: 0.36,
      medianDecisionLatencyMs: null,
    });
  });

  it('records a live decision as HUMAN_CONFIRMED at full strength', () => {
    const rec = recommend(agent().subjectId);
    authority().execute(cmd(rec, operator(), {}), 'ops');
    expect(lastEvent().detail).toMatchObject({
      capture: 'live',
      evidence_quality: 'HUMAN_CONFIRMED',
      evidence_strength: 0.8,
    });
  });

  it('refuses a manual entry that claims to occur after signing or before the recommendation', () => {
    const rec = recommend(agent().subjectId);
    const op = operator();
    const now = new Date();
    expect(() =>
      cmd(
        rec,
        op,
        {
          capture: 'manual_entry',
          occurredAt: new Date(now.getTime() + 60_000).toISOString(),
        },
        now,
      ),
    ).toThrow(/after the signing time/);
    const early = cmd(rec, op, {
      capture: 'manual_entry',
      occurredAt: new Date(Date.parse(rec.timestamp) - 60_000).toISOString(),
    });
    expect(authority().execute(early, 'ops')).toMatchObject({
      accepted: false,
      reason: /before the recommendation/,
    });
    expect(() => cmd(rec, op, { occurredAt: now.toISOString() })).toThrow(/only to a manual entry/);
  });

  it('flags ten decisions with no rejection or modification as a possible rubber stamp', () => {
    const a = agent();
    const op = operator();
    const auth = authority();
    const recs = Array.from({ length: REVIEW_SIGNAL_MIN_DECISIONS }, () => recommend(a.subjectId));
    for (const r of recs.slice(0, -1)) auth.execute(cmd(r, op, {}), 'ops');
    expect(decisionJourneys(statePaths(dir).ledger).reviewSignal.status).toBe('insufficient-data');
    auth.execute(cmd(recs.at(-1)!, op, {}), 'ops');
    const summary = decisionJourneys(statePaths(dir).ledger);
    expect(summary.reviewSignal.status).toBe('no-challenge');
    expect(summary.rejectionShare).toBe(0);

    auth.execute(cmd(recommend(a.subjectId), op, { verdict: 'reject', reason: 'unsafe' }), 'ops');
    expect(decisionJourneys(statePaths(dir).ledger).reviewSignal.status).toBe('challenged');
  });
});
