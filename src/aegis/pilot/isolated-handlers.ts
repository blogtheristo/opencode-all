// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/isolated-handlers.ts
/**
 * Aegis Pilot — hard stop (readiness plan patch C1).
 *
 * In-process handlers stop cooperatively: the runner stops awaiting, but a
 * handler that ignores its AbortSignal keeps running, and one that spins
 * synchronously blocks the event loop — including the kill-inbox poll, so the
 * operator's stop is never even read. Condition (iii) cannot honestly rest on
 * the agent's cooperation.
 *
 * Here each step runs in its own worker thread. On an operator stop the main
 * thread calls `worker.terminate()`: V8 halts the worker's JavaScript wherever
 * it is (busy loops included), and its pending I/O callbacks are dropped. The
 * main thread — ledger writer and kill authority — stays responsive because it
 * never runs handler code.
 *
 * Handler module contract (loaded by path inside the worker):
 *   export function createRegistry(options): HandlerRegistry   (preferred)
 *   export const registry: HandlerRegistry                      (or default export)
 * Step input and output cross the thread boundary by structured clone, so
 * they must be plain data — which the Article 12 digests already require.
 */

import { Worker } from 'node:worker_threads';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { HandlerRegistry, StepContext, StepHandler, StepResult } from './workflow-runner.js';
import { NetworkUnavailable } from './workflow-runner.js';

export interface HandlerModuleRef {
  /** Path to the handler module (.ts under tsx, .js/.mjs in a build). */
  modulePath: string;
  /** Passed to the module's createRegistry(options). Must be structured-cloneable. */
  options?: Record<string, unknown>;
}

/** Rejection raised when a step's worker was terminated by an operator stop. */
export class WorkerTerminated extends Error {
  constructor(
    readonly reason: unknown,
    readonly terminationMs: number,
  ) {
    super(`step worker terminated by operator stop (${terminationMs} ms)`);
    this.name = 'WorkerTerminated';
  }
}

const SELF_URL = import.meta.url;

/**
 * Start a worker on `name` (step-worker / sentinel-worker) beside this module.
 *
 * Compiled build: the .js entry runs directly. Source (.ts, under tsx or
 * vitest): `--import tsx` in a worker compiles TypeScript but does not map
 * `./x.js` specifiers to `./x.ts` sources (verified 28.09.2026, tsx 4.21), so
 * handler modules that import siblings fail. The worker instead boots from a
 * small eval script that registers tsx's ESM API explicitly — by absolute path,
 * so it also works when the CLI runs from a site directory outside the repo.
 */
export function spawnPilotWorker(
  name: 'step-worker' | 'sentinel-worker',
  workerData: unknown,
): Worker {
  if (!SELF_URL.endsWith('.ts')) {
    return new Worker(new URL(`./${name}.js`, SELF_URL), { workerData });
  }
  const entry = new URL(`./${name}.ts`, SELF_URL).href;
  const tsxPkg = createRequire(SELF_URL).resolve('tsx/package.json');
  const tsxApi = pathToFileURL(join(dirname(tsxPkg), 'dist/esm/api/index.mjs')).href;
  const bootstrap = `(async () => {
  const { register } = await import(${JSON.stringify(tsxApi)});
  register();
  await import(${JSON.stringify(entry)});
})().catch((e) => {
  require('node:worker_threads').parentPort?.postMessage({
    ok: false, errorName: e?.name ?? 'Error', errorMessage: String(e?.message ?? e).slice(0, 300),
  });
});`;
  return new Worker(bootstrap, { eval: true, workerData });
}

/** Upper bound on waiting for a terminate() to be confirmed. */
export const TERMINATE_TIMEOUT_MS = 5000;

/**
 * terminate() with a bound. Never rejects and never hangs, so no stop path can
 * stall on it (security review, 28.09.2026). Returns `confirmed: true` only when
 * Node confirmed the worker exited. A rejection or timeout is reported as
 * unconfirmed, and callers must not record it as a proven stop.
 */
export async function terminateBounded(
  worker: Worker,
  timeoutMs = TERMINATE_TIMEOUT_MS,
): Promise<{ confirmed: boolean; ms: number }> {
  const t0 = performance.now();
  let timer: NodeJS.Timeout | undefined;
  const confirmed = await Promise.race([
    worker.terminate().then(
      () => true,
      () => false,
    ),
    new Promise<false>((r) => {
      timer = setTimeout(() => r(false), timeoutMs);
    }),
  ]);
  clearTimeout(timer);
  return { confirmed, ms: Math.round(performance.now() - t0) };
}

interface WorkerReply {
  ok: boolean;
  result?: StepResult;
  errorName?: string;
  errorMessage?: string;
}

/** Run one handler invocation in a fresh worker, terminated if `ctx.signal` aborts. */
function runInWorker(
  ref: HandlerModuleRef,
  handlerKey: string,
  ctx: StepContext,
): Promise<StepResult> {
  const { signal, ...rest } = ctx;
  if (signal.aborted) return Promise.reject(signal.reason);
  const worker = spawnPilotWorker('step-worker', {
    modulePath: resolve(ref.modulePath),
    options: ref.options ?? {},
    handlerKey,
    ctx: rest,
  });

  return new Promise<StepResult>((resolvePromise, reject) => {
    let settled = false;
    const settle = (fn: () => void) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener('abort', onAbort);
      fn();
    };
    let terminating = false;
    const onAbort = () => {
      terminating = true;
      void terminateBounded(worker).then(({ confirmed, ms }) => {
        settle(() =>
          reject(
            confirmed
              ? new WorkerTerminated(signal.reason, ms)
              : new Error(`step worker termination not confirmed within ${ms} ms`),
          ),
        );
      });
    };
    signal.addEventListener('abort', onAbort, { once: true });

    worker.once('message', (reply: WorkerReply) => {
      settle(() => {
        if (reply.ok && reply.result) resolvePromise(reply.result);
        else if (reply.errorName === 'NetworkUnavailable')
          reject(new NetworkUnavailable(reply.errorMessage));
        else reject(new Error(reply.errorMessage ?? 'handler failed in worker'));
      });
      void worker.terminate();
    });
    worker.once('error', (err) => {
      // A crash during termination is part of the stop; onAbort settles it as such.
      if (terminating) return;
      settle(() => reject(err));
    });
    worker.once('exit', (code) => {
      // terminate() makes the worker exit too; that path settles in onAbort.
      if (terminating) return;
      settle(() => reject(new Error(`step worker exited (code ${code}) without a result`)));
    });
  });
}

/**
 * A registry whose handlers each run in an isolated, terminable worker.
 * `handlerKeys` are the keys the scope uses; the module itself is only loaded
 * inside workers, never in the main thread.
 */
export function createIsolatedRegistry(
  ref: HandlerModuleRef,
  handlerKeys: readonly string[],
): HandlerRegistry {
  const registry: Record<string, StepHandler> = {};
  for (const key of new Set(handlerKeys)) {
    const handler: StepHandler = (ctx) => runInWorker(ref, key, ctx);
    handler.hardStop = true;
    registry[key] = handler;
  }
  return registry;
}
