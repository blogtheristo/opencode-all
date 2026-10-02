// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/__tests__/fixtures/aegis-pilot-stubborn-handlers.ts
/**
 * Test fixture: handlers that do not cooperate with a stop. Loaded inside
 * step workers (hard mode) or in-process (cooperative mode) by aegis-pilot tests.
 */
import { writeFileSync } from 'node:fs';
import type { HandlerRegistry } from '../../aegis/pilot/workflow-runner.js';

export function createRegistry(options: Record<string, unknown>): HandlerRegistry {
  const marker = String(options.markerPath ?? '');
  return {
    ok: async () => ({ output: { ok: true }, decision: 'ok' }),
    // Holds the thread forever; an in-process runner could not even read the stop.
    spin: async () => {
      for (;;) {
        // busy loop
      }
    },
    // Ignores its signal and leaves a side effect after a delay.
    'ignore-abort': async () => {
      await new Promise((r) => setTimeout(r, 600));
      if (marker) writeFileSync(marker, 'side effect after stop');
      return { output: { late: true } };
    },
  };
}
