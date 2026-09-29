// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/sandbox-step-runner.ts
/**
 * Aegis Pilot — runs ONE step inside an OpenShell sandbox (plan patch C4).
 *
 * Bundled by openshell-handlers.ts together with the handler module into a
 * single /sandbox/step.mjs, so the sandbox image needs only a node binary.
 * Reads /sandbox/input.json, runs the handler, and prints exactly one line
 * `AEGIS_RESULT <json>` on stdout. Everything else on stdout is ignored.
 */

import { readFileSync } from 'node:fs';
import type { HandlerRegistry, StepContext } from './workflow-runner.js';

export const RESULT_MARKER = 'AEGIS_RESULT ';

interface SandboxInput {
  handlerKey: string;
  options: Record<string, unknown>;
  ctx: Omit<StepContext, 'signal'>;
}

type HandlerModule = {
  createRegistry?: (options: Record<string, unknown>) => HandlerRegistry;
  registry?: HandlerRegistry;
  default?: HandlerRegistry;
};

export async function runSandboxStep(mod: HandlerModule, inputPath: string): Promise<void> {
  // Exit as soon as the result is written: no callback the handler scheduled
  // may run afterwards and print a second, forged result line (the host also
  // refuses output with more than one).
  const emit = (payload: unknown, code: number) =>
    process.stdout.write(`${RESULT_MARKER}${JSON.stringify(payload)}\n`, () => process.exit(code));
  try {
    const input = JSON.parse(readFileSync(inputPath, 'utf8')) as SandboxInput;
    const registry =
      typeof mod.createRegistry === 'function'
        ? mod.createRegistry(input.options)
        : (mod.registry ?? mod.default);
    const handler = registry?.[input.handlerKey];
    if (!handler) throw new Error(`handler "${input.handlerKey}" not exported by the step module`);
    // The sandbox's own signal never fires: stopping is the host's job (sandbox delete).
    const result = await handler({ ...input.ctx, signal: new AbortController().signal });
    emit({ ok: true, result }, 0);
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    emit({ ok: false, errorName: e.name, errorMessage: e.message.slice(0, 300) }, 1);
  }
}
