// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/sentinel-worker.ts
/**
 * Aegis Pilot — the stop-test agent for condition (iii) in hard-stop mode.
 *
 * Deliberately stubborn: a synchronous loop that never yields, never reads a
 * signal and never exits on its own. If the acceptance test records a stop,
 * it is because the main thread terminated this worker — not because the
 * agent agreed to stop.
 */

import { parentPort, workerData } from 'node:worker_threads';

const { tickMs } = workerData as { tickMs: number };

let tick = 0;
for (;;) {
  const until = Date.now() + tickMs;
  while (Date.now() < until) {
    // busy-wait: holds the thread, as a runaway agent would
  }
  parentPort?.postMessage({ tick: tick++ });
}
