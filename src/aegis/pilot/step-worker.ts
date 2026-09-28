// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/step-worker.ts
/**
 * Aegis Pilot — worker entry for one isolated step (see isolated-handlers.ts).
 * Loads the handler module, runs one handler, posts one reply. The main thread
 * terminates this worker on an operator stop; nothing here needs to cooperate.
 */

import { parentPort, workerData } from 'node:worker_threads';
import { pathToFileURL } from 'node:url';
import type { HandlerRegistry, StepContext } from './workflow-runner.js';

interface StepWorkerData {
  modulePath: string;
  options: Record<string, unknown>;
  handlerKey: string;
  ctx: Omit<StepContext, 'signal'>;
}

const data = workerData as StepWorkerData;

try {
  const mod = (await import(pathToFileURL(data.modulePath).href)) as {
    createRegistry?: (options: Record<string, unknown>) => HandlerRegistry;
    registry?: HandlerRegistry;
    default?: HandlerRegistry;
  };
  const registry =
    typeof mod.createRegistry === 'function'
      ? mod.createRegistry(data.options)
      : (mod.registry ?? mod.default);
  const handler = registry?.[data.handlerKey];
  if (!handler) throw new Error(`handler "${data.handlerKey}" not exported by ${data.modulePath}`);
  // The worker's own signal never fires: stopping is the main thread's job (terminate()).
  const result = await handler({ ...data.ctx, signal: new AbortController().signal });
  parentPort?.postMessage({ ok: true, result });
} catch (err) {
  const e = err instanceof Error ? err : new Error(String(err));
  parentPort?.postMessage({ ok: false, errorName: e.name, errorMessage: e.message.slice(0, 300) });
}
