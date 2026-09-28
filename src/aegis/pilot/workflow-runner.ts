// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/workflow-runner.ts
/**
 * Aegis Pilot — local workflow runner (requirements 3–5: no network
 * dependency for the core outcome; cloud only for optional sync; graceful
 * degradation specified in advance).
 *
 * The degradation spec IS the Phase 0 criticality classification:
 *   core                 → must complete locally; failure fails the run
 *   non-core, no network → runs; failure is logged, run continues
 *   non-core, network    → with the uplink down, deferred to a local outbox
 *                          and replayed on reconnect in reconciliationOrder
 *
 * Every step is authorised against the agent's locally-verified credential
 * (capability `step:<id>`), raced against the operator's kill signal, and
 * recorded as an Article 12 `agent.decide` event with input/output digests.
 * With a registry from createIsolatedRegistry() the stop is hard: the step's
 * worker thread is terminated, and a `system.agent_terminated` event records it.
 */

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { dirname } from 'node:path';
import { type KeyObject, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { canonicalJSON, sha256, verifyPayload } from './crypto.js';
import { capabilityManifestHash, type Credential, type CredentialVerifier } from './identity.js';
import type { EvidenceLedger } from './evidence-ledger.js';
import type { KillAuthority } from './kill-authority.js';
import { type PilotScope, type PilotStep, stepCapability } from './scope.js';

/** Thrown by a handler when it needs the network and cannot reach it. */
export class NetworkUnavailable extends Error {
  constructor(message = 'network unavailable') {
    super(message);
    this.name = 'NetworkUnavailable';
  }
}

export interface StepContext {
  signal: AbortSignal;
  traceId: string;
  step: PilotStep;
  /** Outputs of earlier steps, keyed by step id. */
  state: Readonly<Record<string, unknown>>;
  uplinkDown: boolean;
}

export interface StepResult {
  output: unknown;
  /** One-line decision summary for the Article 12 record. No personal data. */
  decision?: string;
  confidence?: number;
  modelVersion?: string;
}

export type StepHandler = ((ctx: StepContext) => Promise<StepResult>) & {
  /**
   * Set by createIsolatedRegistry(): the handler rejects on abort only after
   * its worker is terminated, so the runner awaits it instead of racing it.
   */
  hardStop?: true;
};
export type HandlerRegistry = Readonly<Record<string, StepHandler>>;

export type StepStatus = 'done' | 'deferred' | 'failed' | 'stopped' | 'not-run';

export interface StepRecord {
  id: string;
  criticality: PilotStep['criticality'];
  status: StepStatus;
  outputDigest?: string;
  error?: string;
  durationMs?: number;
}

export interface RunResult {
  status: 'completed' | 'failed' | 'stopped';
  traceId: string;
  agentId: string;
  steps: StepRecord[];
  deferred: string[];
  startedAt: string;
  endedAt: string;
  failure?: string;
}

/**
 * A deferred step. Signed with the site key at enqueue and verified before
 * replay: the outbox sits in the same state directory as everything else, and
 * an unsigned entry would let anyone who can write there choose what a
 * handler runs on at reconnect — and have it logged as legitimate.
 */
export interface OutboxEntry {
  entryId: string;
  stepId: string;
  traceId: string;
  enqueuedAt: string;
  /** event_hash of the system.degraded ledger event that recorded this deferral. */
  deferEventHash: string;
  state: Record<string, unknown>;
  signature: string;
}

const OutboxEntrySchema = z.object({
  entryId: z.string().uuid(),
  stepId: z.string().regex(/^[a-z0-9][a-z0-9-]{0,62}$/),
  traceId: z.string().min(1).max(100),
  enqueuedAt: z.string().datetime(),
  deferEventHash: z.string().regex(/^[0-9a-f]{64}$/),
  state: z.record(z.string(), z.unknown()),
  signature: z.string().min(1),
});

export interface RunOptions {
  scope: PilotScope;
  registry: HandlerRegistry;
  ledger: EvidenceLedger;
  kill: KillAuthority;
  verifier: CredentialVerifier;
  agent: Credential;
  uplinkDown: boolean;
  outboxPath: string;
  /** Signs outbox entries — SiteAuthority.sign. */
  signOutbox: (payload: unknown) => string;
  traceId: string;
  now?: () => Date;
}

function raceAbort<T>(work: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return Promise.reject(signal.reason);
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(signal.reason);
    signal.addEventListener('abort', onAbort, { once: true });
    work.then(
      (v) => {
        signal.removeEventListener('abort', onAbort);
        resolve(v);
      },
      (e) => {
        signal.removeEventListener('abort', onAbort);
        reject(e);
      },
    );
  });
}

function errText(err: unknown): string {
  return (err instanceof Error ? err.message : String(err)).slice(0, 300);
}

function enqueue(
  outboxPath: string,
  body: Omit<OutboxEntry, 'signature'>,
  sign: (payload: unknown) => string,
): void {
  const entry: OutboxEntry = { ...body, signature: sign(body) };
  mkdirSync(dirname(outboxPath), { recursive: true, mode: 0o700 });
  appendFileSync(outboxPath, `${JSON.stringify(entry)}\n`, { mode: 0o600 });
}

function readOutboxLines(outboxPath: string): string[] {
  if (!existsSync(outboxPath)) return [];
  return readFileSync(outboxPath, 'utf8')
    .split('\n')
    .filter((l) => l.trim());
}

function safeJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Unverified view of the outbox, for status display only. Replay goes through reconcileOutbox. */
export function readOutbox(outboxPath: string): OutboxEntry[] {
  if (!existsSync(outboxPath)) return [];
  return readFileSync(outboxPath, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as OutboxEntry);
}

export async function runWorkflow(opts: RunOptions): Promise<RunResult> {
  const now = opts.now ?? (() => new Date());
  const { scope, ledger, agent, traceId } = opts;
  const startedAt = now().toISOString();
  const steps: StepRecord[] = scope.workflow.steps.map((s) => ({
    id: s.id,
    criticality: s.criticality,
    status: 'not-run' as StepStatus,
  }));
  const deferred: string[] = [];
  const capHash = capabilityManifestHash(agent.capabilities);
  const base = { trace_id: traceId, agent_id: agent.subjectId, capability_manifest_hash: capHash };

  const finish = (status: RunResult['status'], failure?: string): RunResult => {
    const result: RunResult = {
      status,
      traceId,
      agentId: agent.subjectId,
      steps,
      deferred,
      startedAt,
      endedAt: now().toISOString(),
      failure,
    };
    ledger.append({
      ...base,
      event_type: status === 'completed' ? 'workflow.complete' : 'workflow.failed',
      detail: {
        workflow_id: scope.workflow.id,
        status,
        failure,
        completion_state: status === 'completed' ? scope.workflow.completionState : undefined,
        steps: steps.map((s) => `${s.id}:${s.status}`),
        deferred,
      },
    });
    return result;
  };

  const identity = opts.verifier.check(agent, now());
  if (!identity.ok || agent.kind !== 'agent') {
    const reason = identity.ok ? 'credential is not an agent credential' : identity.reason;
    ledger.append({
      ...base,
      event_type: 'incident',
      detail: { kind: 'agent-identity-rejected', reason },
    });
    return finish('failed', `agent identity rejected: ${reason}`);
  }

  const { signal, release } = opts.kill.register(agent);
  ledger.append({
    ...base,
    event_type: 'workflow.start',
    detail: {
      workflow_id: scope.workflow.id,
      agent_name: agent.subjectName,
      uplink_down: opts.uplinkDown,
      deployment_mode: scope.deploymentMode,
    },
  });

  const state: Record<string, unknown> = {};
  try {
    for (const [i, step] of scope.workflow.steps.entries()) {
      const rec = steps[i];
      if (signal.aborted) {
        rec.status = 'stopped';
        return finish('stopped', errText(signal.reason));
      }

      const auth = opts.verifier.check(agent, now(), stepCapability(step));
      if (!auth.ok) {
        rec.status = 'failed';
        rec.error = `not authorised: ${auth.reason}`;
        ledger.append({
          ...base,
          event_type: 'incident',
          detail: { kind: 'capability-denied', step: step.id, reason: auth.reason },
        });
        return finish('failed', `step ${step.id} not authorised: ${auth.reason}`);
      }

      const defer = (why: string) => {
        rec.status = 'deferred';
        deferred.push(step.id);
        const entryId = randomUUID();
        const logged = ledger.append({
          ...base,
          event_type: 'system.degraded',
          detail: { step: step.id, action: 'deferred-to-outbox', outbox_entry: entryId, why },
        });
        enqueue(
          opts.outboxPath,
          {
            entryId,
            stepId: step.id,
            traceId,
            enqueuedAt: now().toISOString(),
            deferEventHash: logged.event_hash,
            state: { ...state },
          },
          opts.signOutbox,
        );
      };

      if (step.requiresNetwork && opts.uplinkDown) {
        defer('uplink down at run start (declared network step)');
        continue;
      }

      const handler = opts.registry[step.handler];
      if (!handler) {
        rec.status = 'failed';
        rec.error = `no handler registered for "${step.handler}"`;
        if (step.criticality === 'core') return finish('failed', rec.error);
        continue;
      }

      const inputDigest = sha256(canonicalJSON(state));
      const t0 = performance.now();
      try {
        const work = handler({
          signal,
          traceId,
          step,
          state: { ...state },
          uplinkDown: opts.uplinkDown,
        });
        // Hard stop: wait for the termination to be confirmed, never just requested.
        const res = handler.hardStop ? await work : await raceAbort(work, signal);
        rec.durationMs = Math.round(performance.now() - t0);
        rec.status = 'done';
        rec.outputDigest = sha256(canonicalJSON(res.output ?? null));
        state[step.id] = res.output;
        ledger.append({
          ...base,
          event_type: 'agent.decide',
          model_version: res.modelVersion ?? null,
          input_digest: inputDigest,
          output_digest: rec.outputDigest,
          confidence: res.confidence ?? null,
          detail: {
            step: step.id,
            criticality: step.criticality,
            decision: res.decision?.slice(0, 300),
            duration_ms: rec.durationMs,
          },
        });
      } catch (err) {
        rec.durationMs = Math.round(performance.now() - t0);
        if (signal.aborted) {
          rec.status = 'stopped';
          // Hard stop (isolated-handlers.ts): the step's worker was terminated.
          // Record that the stop took effect, not only that it was requested.
          const terminated = err instanceof Error && err.name === 'WorkerTerminated';
          if (terminated) {
            ledger.append({
              ...base,
              event_type: 'system.agent_terminated',
              detail: {
                step: step.id,
                stop_mode: 'hard',
                termination_ms: (err as Error & { terminationMs?: number }).terminationMs,
              },
            });
          }
          return finish('stopped', errText(signal.reason));
        }
        if (err instanceof NetworkUnavailable) {
          if (step.criticality === 'core') {
            rec.status = 'failed';
            rec.error = errText(err);
            return finish(
              'failed',
              `core step ${step.id} needed the network — reclassify or redesign it (Phase 2 finding)`,
            );
          }
          defer(`handler reported network unavailable: ${errText(err)}`);
          continue;
        }
        rec.status = 'failed';
        rec.error = errText(err);
        ledger.append({
          ...base,
          event_type: 'incident',
          input_digest: inputDigest,
          detail: {
            kind: 'step-failed',
            step: step.id,
            criticality: step.criticality,
            error: rec.error,
          },
        });
        if (step.criticality === 'core')
          return finish('failed', `core step ${step.id} failed: ${rec.error}`);
      }
    }
    return finish('completed');
  } finally {
    release();
  }
}

export interface ReconcileResult {
  replayed: string[];
  remaining: string[];
  errors: Array<{ stepId: string; error: string }>;
}

/**
 * Replay deferred work after reconnect, in the order Phase 0 specified.
 * Entries that fail stay in the outbox; the outbox is rewritten atomically.
 */
export async function reconcileOutbox(opts: {
  scope: PilotScope;
  registry: HandlerRegistry;
  ledger: EvidenceLedger;
  outboxPath: string;
  /** Site public key: entries whose signature does not verify are quarantined, never replayed. */
  publicKey: KeyObject;
  traceId: string;
}): Promise<ReconcileResult> {
  const entries: OutboxEntry[] = [];
  const quarantined: string[] = [];
  for (const raw of readOutboxLines(opts.outboxPath)) {
    const parsed = OutboxEntrySchema.safeParse(safeJson(raw));
    const ok =
      parsed.success &&
      verifyPayload(
        (({ signature: _s, ...body }) => body)(parsed.data),
        parsed.data.signature,
        opts.publicKey,
      );
    if (ok) {
      entries.push(parsed.data as OutboxEntry);
    } else {
      quarantined.push(raw);
      opts.ledger.append({
        event_type: 'incident',
        trace_id: opts.traceId,
        input_digest: sha256(raw),
        detail: {
          kind: 'outbox-entry-rejected',
          reason: parsed.success ? 'site signature invalid' : 'malformed entry',
        },
      });
    }
  }
  if (quarantined.length) {
    appendFileSync(`${opts.outboxPath}.quarantine`, quarantined.map((q) => `${q}\n`).join(''), {
      mode: 0o600,
    });
  }
  const order = opts.scope.reconciliationOrder;
  const rank = (e: OutboxEntry) => {
    const r = order.indexOf(e.stepId);
    return r === -1 ? Number.MAX_SAFE_INTEGER : r;
  };
  const sorted = entries
    .map((e, i) => ({ e, i }))
    .sort((a, b) => rank(a.e) - rank(b.e) || a.i - b.i);
  const result: ReconcileResult = {
    replayed: [],
    remaining: [],
    errors: quarantined.map(() => ({
      stepId: '(quarantined)',
      error: 'outbox entry failed verification',
    })),
  };
  const keep: OutboxEntry[] = [];
  const controller = new AbortController();

  for (const { e } of sorted) {
    const step = opts.scope.workflow.steps.find((s) => s.id === e.stepId);
    const handler = step ? opts.registry[step.handler] : undefined;
    if (!step || !handler) {
      keep.push(e);
      result.errors.push({ stepId: e.stepId, error: 'step or handler no longer defined' });
      continue;
    }
    try {
      const res = await handler({
        signal: controller.signal,
        traceId: e.traceId,
        step,
        state: e.state,
        uplinkDown: false,
      });
      result.replayed.push(e.stepId);
      opts.ledger.append({
        event_type: 'system.reconcile',
        trace_id: opts.traceId,
        input_digest: sha256(canonicalJSON(e.state)),
        output_digest: sha256(canonicalJSON(res.output ?? null)),
        detail: {
          step: e.stepId,
          outbox_entry: e.entryId,
          defer_event_hash: e.deferEventHash,
          original_trace_id: e.traceId,
          enqueued_at: e.enqueuedAt,
        },
      });
    } catch (err) {
      keep.push(e);
      result.errors.push({ stepId: e.stepId, error: errText(err) });
    }
  }
  result.remaining = keep.map((k) => k.stepId);
  const tmp = `${opts.outboxPath}.tmp`;
  mkdirSync(dirname(opts.outboxPath), { recursive: true, mode: 0o700 });
  writeFileSync(tmp, keep.map((k) => `${JSON.stringify(k)}\n`).join(''), { mode: 0o600 });
  renameSync(tmp, opts.outboxPath);
  return result;
}
