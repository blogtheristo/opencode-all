// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/acceptance.ts
/**
 * Aegis Pilot — severed-uplink acceptance test (Phase 3). Automates the
 * evidence for the binary KPI in Store/PRODUCT_AEGIS_PILOT.md:
 *
 *   (i)   the piloted workflow runs to completion without network access;
 *   (ii)  the Article 12 record is written locally throughout, with no gap;
 *   (iii) an operator stops a running agent.
 *
 * All three pass → PASS. Any fails → NEGATIVE_RESULT (a valid outcome, not a
 * defect). Two further outcomes keep the record honest about the test itself:
 *
 *   NOT_TAKEN — egress was attempted before the run and succeeded: isolation
 *               was not in effect, so no test was taken.
 *   INVALID   — isolation lapsed during the window (a periodic probe got
 *               through): results cannot be attributed to an isolated site.
 *
 * `acceptance` runs require a human operator (`await-operator` mode — the
 * customer's operator executes the stop with `aegis-pilot stop`) and a named
 * witness. `rehearsal` runs may automate the stop.
 *
 * The record is written to <stateDir>/acceptance/<recordId>.json, its digest
 * is chained into the ledger as an `acceptance.record` event, and the record
 * is signed with the site key.
 */

import { mkdirSync, readFileSync, statfsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { type KeyObject, randomUUID } from 'node:crypto';
import { canonicalJSON, sha256, verifyPayload } from './crypto.js';
import {
  EvidenceLedger,
  type LedgerEvent,
  type LedgerVerification,
  verifyLedger,
} from './evidence-ledger.js';
import { type Credential, type CredentialVerifier, SiteAuthority, statePaths } from './identity.js';
import {
  createStopCommand,
  KillAuthority,
  type StopOutcome,
  submitStopCommand,
} from './kill-authority.js';
import { ISOLATION_LADDER, type PilotScope, stepCapability } from './scope.js';
import { spawnPilotWorker, terminateBounded } from './isolated-handlers.js';
import { type AgentAuthority, buildAuthorityRecord, recordGrant } from './authority.js';
import { type Connector, probeUplink, type UplinkProbeReport } from './uplink-probe.js';
import { type HandlerRegistry, type RunResult, runWorkflow } from './workflow-runner.js';

export type AcceptanceOutcome = 'PASS' | 'NEGATIVE_RESULT' | 'NOT_TAKEN' | 'INVALID';

export type OperatorMode =
  | { mode: 'automated'; credential: Credential; key: KeyObject }
  | {
      mode: 'await-operator';
      timeoutMs: number;
      onAwait?: (agentId: string, agentName: string) => void;
    };

export interface AcceptanceOptions {
  stateDir: string;
  scope: PilotScope;
  registry: HandlerRegistry;
  kind: 'rehearsal' | 'acceptance';
  operator: OperatorMode;
  witness?: string;
  /** Keep the site isolated and the heartbeat running until the agreed window has elapsed. */
  holdUntilWindowEnd?: boolean;
  /**
   * 'hard' (default): the stop-test agent is a stubborn worker thread that
   * never checks a signal; the stop is proven by terminating it. 'cooperative':
   * in-process loop that honours its signal — rehearsal only.
   */
  stopMode?: 'hard' | 'cooperative';
  /** How workflow steps were isolated; recorded so a reader knows what was contained. */
  containment?: { mode: 'in-process' | 'worker' | 'openshell'; image?: string };
  /**
   * Hard mode: where the stubborn stop-test agent runs. Defaults to a worker
   * thread. With OpenShell containment it must run in a sandbox too, so that
   * condition (iii) proves the same containment the workflow used.
   */
  stopTestAgent?: (tickMs: number) => StopTestAgent;
  probeIntervalMs?: number;
  probeTimeoutMs?: number;
  connector?: Connector;
  env?: NodeJS.ProcessEnv;
  now?: () => Date;
}

export interface FilesystemCheck {
  local: boolean;
  fsType: string;
  note?: string;
}

export interface AcceptanceRecord {
  v: 1;
  recordId: string;
  kind: 'rehearsal' | 'acceptance';
  outcome: AcceptanceOutcome;
  siteId: string;
  orgId: string;
  workflowId: string;
  scopeDigest: string;
  deploymentMode: PilotScope['deploymentMode'];
  containment: { mode: 'in-process' | 'worker' | 'openshell'; image?: string };
  isolation: {
    method: string;
    rank: number;
    enforcedBy: string;
    demonstrates: string;
    doesNotDemonstrate: string;
  };
  window: {
    plannedMinutes: number;
    start: string;
    end: string;
    elapsedMs: number;
    heldToWindowEnd: boolean;
  };
  probes: {
    preflight: UplinkProbeReport;
    postflight: UplinkProbeReport | null;
    periodic: number;
    lapses: number;
  };
  conditions: {
    workflowCompletes: { pass: boolean; wording: string; run: RunResult | null };
    evidenceLocal: {
      pass: boolean;
      wording: string;
      ledger: LedgerVerification | null;
      filesystem: FilesystemCheck;
      eventsInWindow: number;
    };
    operatorStop: {
      pass: boolean;
      wording: string;
      mode: OperatorMode['mode'];
      stop: StopOutcome | null;
      agentId: string | null;
      ticksAfterStop: number;
      stopMode: 'hard' | 'cooperative';
      /** Hard mode: ms from abort to worker termination confirmed. */
      terminationMs: number | null;
      /** Hard mode: messages from the agent after termination was confirmed (must be 0). */
      lateMessages: number;
      detail: string;
    };
  };
  witness: string | null;
  /** Who held decision authority in this run, and what followed (authority.ts). */
  authority: AgentAuthority[] | null;
  ledgerHead: { seq: number; hash: string };
  createdAt: string;
  findings: string[];
}

export interface SignedAcceptanceRecord {
  record: AcceptanceRecord;
  signature: string;
  signerKeyId: string;
  path: string;
}

// statfs f_type magic numbers for network filesystems (linux/magic.h).
const NETWORK_FS: Record<number, string> = {
  0x6969: 'nfs',
  0x517b: 'smb',
  0xff534d42: 'cifs',
  0xfe534d42: 'smb2',
  0x00c36400: 'ceph',
  0x013111a8: 'ibrix',
  0x5346414f: 'afs',
  0x6b414653: 'afs',
  0x47504653: 'gpfs',
};
const AMBIGUOUS_FS: Record<number, string> = { 0x65735546: 'fuse', 0x01021997: '9p' };

export function checkLocalFilesystem(path: string): FilesystemCheck {
  try {
    const t = Number(statfsSync(path).type) >>> 0;
    if (NETWORK_FS[t])
      return { local: false, fsType: NETWORK_FS[t], note: 'ledger is on a network filesystem' };
    if (AMBIGUOUS_FS[t]) {
      return {
        local: false,
        fsType: AMBIGUOUS_FS[t],
        note: 'ledger is on a FUSE/9p mount whose backing store cannot be proven local — move it to a local disk',
      };
    }
    return { local: true, fsType: `0x${t.toString(16)}` };
  } catch (err) {
    return { local: false, fsType: 'unknown', note: `statfs failed: ${(err as Error).message}` };
  }
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve) => {
    if (signal?.aborted) return resolve();
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(t);
        resolve();
      },
      { once: true },
    );
  });

/** A running agent for the operator to stop: a local loop that records one decision per tick. */
async function runSentinel(p: {
  credential: Credential;
  kill: KillAuthority;
  ledger: EvidenceLedger;
  verifier: CredentialVerifier;
  traceId: string;
  tickMs: number;
  maxMs: number;
  onFirstTick: () => void;
}): Promise<{ stopped: boolean; ticks: number }> {
  const { signal, release } = p.kill.register(p.credential);
  let ticks = 0;
  const deadline = Date.now() + p.maxMs;
  try {
    while (Date.now() < deadline) {
      if (signal.aborted) break;
      if (!p.verifier.check(p.credential, new Date(), 'step:sentinel').ok) break;
      p.ledger.append({
        event_type: 'agent.decide',
        trace_id: p.traceId,
        agent_id: p.credential.subjectId,
        detail: { step: 'sentinel-tick', tick: ticks },
      });
      ticks++;
      if (ticks === 1) p.onFirstTick();
      await sleep(p.tickMs, signal);
    }
    return { stopped: signal.aborted, ticks };
  } finally {
    release();
  }
}

/**
 * The stubborn stop-test agent for condition (iii). It never checks a signal;
 * the stop is proven only by terminate() confirming the agent is gone.
 */
export interface StopTestAgent {
  /** Start the agent; onTick fires once per unit of work it reports. */
  start(onTick: () => void): Promise<void>;
  /** Terminate it. confirmed=false means the stop is not proven. */
  terminate(): Promise<{ confirmed: boolean; ms: number }>;
}

export function workerStopTestAgent(tickMs: number): StopTestAgent {
  let worker: ReturnType<typeof spawnPilotWorker> | undefined;
  return {
    start(onTick) {
      worker = spawnPilotWorker('sentinel-worker', { tickMs });
      worker.on('message', onTick);
      return Promise.resolve();
    },
    terminate() {
      return worker ? terminateBounded(worker) : Promise.resolve({ confirmed: true, ms: 0 });
    },
  };
}

interface SentinelOutcome {
  stopped: boolean;
  ticks: number;
  terminationMs: number | null;
  lateMessages: number;
}

/**
 * Hard-mode stop-test agent: a stubborn worker (sentinel-worker.ts). The main
 * thread logs its ticks until the operator's stop aborts the signal, then
 * terminates the worker and watches for three tick periods: any message after
 * termination was confirmed means the agent was not actually stopped.
 */
async function runSentinelHard(p: {
  credential: Credential;
  kill: KillAuthority;
  ledger: EvidenceLedger;
  traceId: string;
  tickMs: number;
  maxMs: number;
  onFirstTick: () => void;
  agent: StopTestAgent;
}): Promise<SentinelOutcome> {
  const { signal, release } = p.kill.register(p.credential);
  let ticks = 0;
  let terminatedAt: number | null = null;
  let lateMessages = 0;
  let terminated = false;
  const terminate = async () => {
    const r = await p.agent.terminate();
    terminated = true;
    return r;
  };
  try {
    await p.agent.start(() => {
      if (terminatedAt !== null) {
        lateMessages++;
        return;
      }
      if (signal.aborted) return; // in flight when the stop landed; never logged as agent work
      p.ledger.append({
        event_type: 'agent.decide',
        trace_id: p.traceId,
        agent_id: p.credential.subjectId,
        detail: { step: 'sentinel-tick', tick: ticks, stop_mode: 'hard' },
      });
      ticks++;
      if (ticks === 1) p.onFirstTick();
    });
    await sleep(p.maxMs, signal);
    if (!signal.aborted) return { stopped: false, ticks, terminationMs: null, lateMessages: 0 };
    const { confirmed, ms } = await terminate();
    terminatedAt = Date.now();
    if (!confirmed) {
      // Unconfirmed termination is not a proven stop: terminationMs stays null → (iii) fails.
      return { stopped: true, ticks, terminationMs: null, lateMessages };
    }
    p.ledger.append({
      event_type: 'system.agent_terminated',
      trace_id: p.traceId,
      agent_id: p.credential.subjectId,
      detail: { step: 'sentinel', stop_mode: 'hard', termination_ms: ms },
    });
    await sleep(3 * p.tickMs);
    return { stopped: true, ticks, terminationMs: ms, lateMessages };
  } finally {
    if (!terminated) await terminate();
    release();
  }
}

export async function runAcceptance(opts: AcceptanceOptions): Promise<SignedAcceptanceRecord> {
  const now = opts.now ?? (() => new Date());
  const { scope } = opts;
  const stopMode = opts.stopMode ?? 'hard';
  if (opts.kind === 'acceptance') {
    if (opts.operator.mode !== 'await-operator') {
      throw new Error(
        'an acceptance run requires the customer operator to execute the stop (await-operator mode)',
      );
    }
    if (!opts.witness?.trim()) throw new Error('an acceptance run requires a named witness');
    if (stopMode !== 'hard') {
      throw new Error(
        'an acceptance run requires the hard stop: a cooperative stop only proves the agent agreed to stop',
      );
    }
  }

  const site = SiteAuthority.load(opts.stateDir);
  if (site.manifest.siteId !== scope.site.siteId) {
    throw new Error(
      `scope is for site "${scope.site.siteId}" but this state directory is "${site.manifest.siteId}"`,
    );
  }
  // The signed scope pins the site key id: it is held by both parties outside
  // the state directory, so a replaced site authority cannot pass unnoticed.
  if (scope.site.keyId && scope.site.keyId !== site.manifest.keyId) {
    throw new Error(
      `site key ${site.manifest.keyId} does not match the key pinned in the signed scope (${scope.site.keyId}) — the site authority has been replaced`,
    );
  }
  const verifier = site.verifier();
  const paths = statePaths(opts.stateDir);
  const ledger = EvidenceLedger.open(paths.ledger, {
    siteId: site.manifest.siteId,
    orgId: scope.site.orgId,
    signer: (h) => site.sign(h),
    publicKey: site.publicKey,
    now,
  });
  const traceId = randomUUID();
  const findings: string[] = [];
  const ladder = ISOLATION_LADDER[scope.isolation.method];
  const probeOpts = {
    timeoutMs: opts.probeTimeoutMs ?? 3000,
    connector: opts.connector,
    env: opts.env,
    now,
  };

  const logProbe = (report: UplinkProbeReport, phase: string) =>
    ledger.append({
      event_type: 'system.uplink_probe',
      trace_id: traceId,
      detail: {
        phase,
        isolated: report.isolated,
        results: report.results.map(
          (r) => `${r.target.label ?? r.target.host}:${r.target.port}=${r.outcome}`,
        ),
        proxy_env: report.proxyEnv,
      },
    });

  const recordBase: Omit<
    AcceptanceRecord,
    | 'outcome'
    | 'ledgerHead'
    | 'createdAt'
    | 'findings'
    | 'window'
    | 'probes'
    | 'conditions'
    | 'authority'
  > = {
    v: 1,
    recordId: randomUUID(),
    kind: opts.kind,
    siteId: site.manifest.siteId,
    orgId: scope.site.orgId,
    workflowId: scope.workflow.id,
    scopeDigest: sha256(canonicalJSON(scope)),
    deploymentMode: scope.deploymentMode,
    containment: opts.containment ?? { mode: 'in-process' },
    isolation: {
      method: scope.isolation.method,
      rank: ladder.rank,
      enforcedBy: scope.isolation.enforcedBy,
      demonstrates: ladder.demonstrates,
      doesNotDemonstrate: ladder.doesNotDemonstrate,
    },
    witness: opts.witness?.trim() || null,
  };

  const fsCheck = checkLocalFilesystem(dirname(paths.ledger));
  const windowStart = now();
  const preflight = await probeUplink(scope.isolation.egressProbes, probeOpts);
  logProbe(preflight, 'preflight');

  const conditions: AcceptanceRecord['conditions'] = {
    workflowCompletes: {
      pass: false,
      wording: scope.acceptance.conditions.workflowCompletes,
      run: null,
    },
    evidenceLocal: {
      pass: false,
      wording: scope.acceptance.conditions.evidenceLocal,
      ledger: null,
      filesystem: fsCheck,
      eventsInWindow: 0,
    },
    operatorStop: {
      pass: false,
      wording: scope.acceptance.conditions.operatorStop,
      mode: opts.operator.mode,
      stop: null,
      agentId: null,
      ticksAfterStop: 0,
      stopMode,
      terminationMs: null,
      lateMessages: 0,
      detail: 'not exercised',
    },
  };

  const seal = (
    outcome: AcceptanceOutcome,
    windowEnd: Date,
    probes: AcceptanceRecord['probes'],
    held: boolean,
  ): SignedAcceptanceRecord => {
    const record: AcceptanceRecord = {
      ...recordBase,
      outcome,
      window: {
        plannedMinutes: scope.acceptance.windowMinutes,
        start: windowStart.toISOString(),
        end: windowEnd.toISOString(),
        elapsedMs: windowEnd.getTime() - windowStart.getTime(),
        heldToWindowEnd: held,
      },
      probes,
      conditions,
      authority: authorityAgents.length ? authorityFor(authorityAgents) : null,
      ledgerHead: ledger.head,
      createdAt: now().toISOString(),
      findings,
    };
    const recordDigest = sha256(canonicalJSON(record));
    ledger.append({
      event_type: 'acceptance.record',
      trace_id: traceId,
      output_digest: recordDigest,
      detail: {
        record_id: record.recordId,
        kind: record.kind,
        outcome,
        isolation_method: scope.isolation.method,
      },
    });
    const signature = site.sign(record);
    const path = join(paths.acceptance, `${record.recordId}.json`);
    mkdirSync(paths.acceptance, { recursive: true, mode: 0o700 });
    writeFileSync(
      path,
      `${JSON.stringify({ record, signature, signerKeyId: site.manifest.keyId }, null, 2)}\n`,
      { mode: 0o644 },
    );
    return { record, signature, signerKeyId: site.manifest.keyId, path };
  };

  // Error paths: every background writer is stopped before the ledger closes,
  // or a late stop command or probe would write to a closed ledger.
  const cleanups: Array<() => void> = [];
  let authorityAgents: string[] = [];
  const authorityFor = (ids: string[]): AgentAuthority[] | null => {
    try {
      return buildAuthorityRecord(opts.stateDir, {
        publicKey: site.publicKey,
        scope,
        agentIds: ids,
      }).agents;
    } catch (err) {
      findings.push(`Authority record not built: ${(err as Error).message}.`);
      return null;
    }
  };
  try {
    if (!preflight.isolated) {
      const open = preflight.results.filter((r) => !r.blocked);
      findings.push(
        `Egress succeeded before the run (${open.map((r) => `${r.target.host}:${r.target.port}=${r.outcome}`).join(', ')}): isolation was not in effect, no test was taken.`,
      );
      return seal(
        'NOT_TAKEN',
        now(),
        { preflight, postflight: null, periodic: 0, lapses: 0 },
        false,
      );
    }

    const stopHeartbeat = ledger.startHeartbeat(scope.acceptance.heartbeatMs, traceId);
    cleanups.push(stopHeartbeat);
    const kill = new KillAuthority(opts.stateDir, verifier, ledger, now);
    const stopWatch = kill.watch(traceId, 100);
    cleanups.push(stopWatch);
    let periodic = 0;
    let lapses = 0;
    const probeStop = new AbortController();
    cleanups.push(() => probeStop.abort());
    const probeLoop = (async () => {
      const interval = opts.probeIntervalMs ?? 10_000;
      while (!probeStop.signal.aborted) {
        await sleep(interval, probeStop.signal);
        if (probeStop.signal.aborted) break;
        let report: UplinkProbeReport;
        try {
          report = await probeUplink(scope.isolation.egressProbes, probeOpts);
        } catch (err) {
          // A probe that cannot run means isolation can no longer be shown for
          // the window: count it as a lapse (the run becomes INVALID), not an
          // unhandled rejection.
          lapses++;
          findings.push(`Egress probe failed during the window: ${(err as Error).message}.`);
          continue;
        }
        periodic++;
        if (!report.isolated) {
          lapses++;
          logProbe(report, 'periodic-lapse');
        }
      }
    })();

    const ttlHours = Math.max(1, Math.ceil(scope.acceptance.windowMinutes / 60) + 1);
    const workflowAgent = site.issue({
      kind: 'agent',
      subjectName: `${scope.workflow.id}-agent`,
      capabilities: scope.workflow.steps.map(stepCapability),
      ttlHours,
    });
    recordGrant(
      ledger,
      workflowAgent,
      { scopeDigest: recordBase.scopeDigest, basis: `${opts.kind}: workflow agent` },
      traceId,
    );

    // (i) workflow completes with the uplink down
    const run = await runWorkflow({
      scope,
      registry: opts.registry,
      ledger,
      kill,
      verifier,
      agent: workflowAgent,
      uplinkDown: true,
      outboxPath: paths.outbox,
      signOutbox: (p) => site.sign(p),
      traceId,
      now,
    });
    const coreDone = scope.workflow.steps
      .map((s, i) => ({ s, r: run.steps[i] }))
      .filter(({ s }) => s.criticality === 'core')
      .every(({ r }) => r.status === 'done');
    conditions.workflowCompletes.run = run;
    conditions.workflowCompletes.pass = run.status === 'completed' && coreDone;
    if (!conditions.workflowCompletes.pass) {
      findings.push(
        `Condition (i) failed: workflow ${run.status}${run.failure ? ` — ${run.failure}` : ''}.`,
      );
    }

    // (iii) operator stops a running agent
    const sentinel = site.issue({
      kind: 'agent',
      subjectName: 'stop-test-sentinel',
      capabilities: ['step:sentinel'],
      ttlHours,
    });
    recordGrant(
      ledger,
      sentinel,
      { scopeDigest: recordBase.scopeDigest, basis: `${opts.kind}: stop-test agent` },
      traceId,
    );
    authorityAgents = [workflowAgent.subjectId, sentinel.subjectId];
    conditions.operatorStop.agentId = sentinel.subjectId;
    const maxMs = opts.operator.mode === 'await-operator' ? opts.operator.timeoutMs : 30_000;
    const operator = opts.operator;
    const onFirstTick = () => {
      if (operator.mode === 'automated') {
        submitStopCommand(
          opts.stateDir,
          createStopCommand(
            {
              target: sentinel.subjectId,
              reason: `${opts.kind} stop test`,
              operatorCredential: operator.credential,
              operatorKey: operator.key,
            },
            now(),
          ),
        );
      } else {
        operator.onAwait?.(sentinel.subjectId, sentinel.subjectName);
      }
    };
    const tickMs = Math.max(100, Math.floor(scope.acceptance.heartbeatMs / 2));
    const sentinelRun: SentinelOutcome =
      stopMode === 'hard'
        ? await runSentinelHard({
            credential: sentinel,
            kill,
            ledger,
            traceId,
            tickMs,
            maxMs,
            onFirstTick,
            agent: (opts.stopTestAgent ?? workerStopTestAgent)(tickMs),
          })
        : {
            ...(await runSentinel({
              credential: sentinel,
              kill,
              ledger,
              verifier,
              traceId,
              tickMs,
              maxMs,
              onFirstTick,
            })),
            terminationMs: null,
            lateMessages: 0,
          };
    conditions.operatorStop.terminationMs = sentinelRun.terminationMs;
    conditions.operatorStop.lateMessages = sentinelRun.lateMessages;
    kill.drainInbox(traceId);
    const stop =
      kill.history.find((o) => o.accepted && o.stoppedAgents.includes(sentinel.subjectId)) ?? null;
    conditions.operatorStop.stop = stop;
    const rejected = kill.history.filter((o) => !o.accepted);
    if (rejected.length) {
      findings.push(
        `Rejected stop commands during the run: ${rejected.map((r) => r.reason).join('; ')}.`,
      );
    }

    const holdUntil = windowStart.getTime() + scope.acceptance.windowMinutes * 60_000;
    const hold = opts.holdUntilWindowEnd ?? opts.kind === 'acceptance';
    if (hold && Date.now() < holdUntil) await sleep(holdUntil - Date.now());

    // Shutdown order matters: the heartbeat must outlive every other writer,
    // or the tail of the window reads as an evidence gap. (The first isolated
    // rehearsal failed condition (ii) with a 9.9 s gap for exactly this reason.)
    probeStop.abort();
    await probeLoop;
    const postflight = await probeUplink(scope.isolation.egressProbes, probeOpts);
    logProbe(postflight, 'postflight');
    stopWatch();
    stopHeartbeat();
    const windowEnd = now();
    if (!postflight.isolated) lapses++;

    // (ii) evidence written locally, continuously, verifiably
    const verification = verifyLedger(paths.ledger, {
      publicKey: site.publicKey,
      maxGapMs: scope.acceptance.maxGapMs,
      from: windowStart,
      to: windowEnd,
    });
    conditions.evidenceLocal.ledger = verification;
    const scan = scanLedger(
      paths.ledger,
      windowStart,
      windowEnd,
      sentinel.subjectId,
      stop?.ledgerSeq ?? null,
    );
    conditions.evidenceLocal.eventsInWindow = scan.inWindow;

    // (iii) is judged from the ledger, not from the runtime's own say-so: the
    // stopped agent must have written nothing after the human.override event.
    conditions.operatorStop.ticksAfterStop = scan.agentEventsAfter;
    const hardProven =
      stopMode === 'cooperative' ||
      (sentinelRun.terminationMs !== null && sentinelRun.lateMessages === 0);
    conditions.operatorStop.pass =
      sentinelRun.stopped && stop !== null && scan.agentEventsAfter === 0 && hardProven;
    conditions.operatorStop.detail = conditions.operatorStop.pass
      ? `${stopMode} stop after ${sentinelRun.ticks} tick(s), ${stop?.latencyMs ?? '?'} ms from command issue${
          sentinelRun.terminationMs !== null
            ? `, worker terminated in ${sentinelRun.terminationMs} ms`
            : ''
        }`
      : !sentinelRun.stopped
        ? `agent was not stopped within ${maxMs} ms`
        : stop === null
          ? 'agent stopped but no accepted operator command is on record'
          : !hardProven
            ? `agent kept running after termination (${sentinelRun.lateMessages} late message(s))`
            : `agent wrote ${scan.agentEventsAfter} ledger event(s) after the stop`;
    if (!conditions.operatorStop.pass) {
      findings.push(`Condition (iii) failed: ${conditions.operatorStop.detail}.`);
    }
    conditions.evidenceLocal.pass =
      verification.valid &&
      verification.unsigned === 0 &&
      verification.gaps.length === 0 &&
      fsCheck.local;
    if (!conditions.evidenceLocal.pass) {
      const why = [
        !verification.valid &&
          `chain broken at seq ${verification.brokenAtSeq}: ${verification.reason}`,
        verification.unsigned > 0 && `${verification.unsigned} unsigned event(s)`,
        verification.gaps.length > 0 &&
          `${verification.gaps.length} gap(s) over ${scope.acceptance.maxGapMs} ms (max ${Math.max(...verification.gaps.map((g) => g.gapMs))} ms)`,
        !fsCheck.local &&
          `ledger storage not provably local (${fsCheck.fsType}${fsCheck.note ? `: ${fsCheck.note}` : ''})`,
      ].filter(Boolean);
      findings.push(`Condition (ii) failed: ${why.join('; ')}.`);
    }

    const probes = { preflight, postflight, periodic, lapses };
    if (lapses > 0) {
      findings.push(
        `Isolation lapsed ${lapses} time(s) during the window: results cannot be attributed to an isolated site.`,
      );
      return seal('INVALID', windowEnd, probes, hold);
    }
    const all =
      conditions.workflowCompletes.pass &&
      conditions.evidenceLocal.pass &&
      conditions.operatorStop.pass;
    if (run.deferred.length) {
      findings.push(
        `Deferred to outbox for reconnect: ${run.deferred.join(', ')} (run "aegis-pilot reconcile" after the window).`,
      );
    }
    return seal(all ? 'PASS' : 'NEGATIVE_RESULT', windowEnd, probes, hold);
  } finally {
    for (const fn of cleanups) fn();
    ledger.close();
  }
}

/** Parse the ledger once: events in the window, and events by `agentId` after `afterSeq`. */
function scanLedger(
  ledgerPath: string,
  from: Date,
  to: Date,
  agentId: string | null,
  afterSeq: number | null,
): { inWindow: number; agentEventsAfter: number } {
  const lo = from.getTime();
  const hi = to.getTime();
  let inWindow = 0;
  let agentEventsAfter = 0;
  for (const line of readFileSync(ledgerPath, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const e = JSON.parse(line) as LedgerEvent;
    const t = Date.parse(e.timestamp);
    if (t >= lo && t <= hi) inWindow++;
    // Agent work only: the runtime's own system.agent_terminated record names the
    // agent but is written by the main thread as evidence of the stop.
    const agentWork = e.event_type === 'agent.decide' || e.event_type === 'tool.invoke';
    if (agentId && afterSeq !== null && agentWork && e.agent_id === agentId && e.seq > afterSeq)
      agentEventsAfter++;
  }
  return { inWindow, agentEventsAfter };
}

/** Verify a signed acceptance record against the site public key. */
export function verifyAcceptanceRecord(
  signed: { record: AcceptanceRecord; signature: string },
  sitePublicKey: KeyObject,
): boolean {
  return verifyPayload(signed.record, signed.signature, sitePublicKey);
}
