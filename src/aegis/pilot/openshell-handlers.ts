// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/openshell-handlers.ts
/**
 * Aegis Pilot — containment: each step in its own NVIDIA OpenShell sandbox
 * (readiness plan patch C4; HIC decision 28.09.2026).
 *
 * The worker-thread hard stop (isolated-handlers.ts) stops an agent but does
 * not contain it: a step can still read any file and open any socket the
 * process can. Here every step runs inside an OpenShell sandbox. Landlock,
 * seccomp and a network namespace are applied by OpenShell's supervisor under
 * a policy generated from the signed scope (openshell-policy.ts).
 *
 * Per step:
 *   1. Bundle the handler module + sandbox-step-runner into one step.mjs
 *      (esbuild, once per registry). The image needs only a node binary.
 *   2. Write input.json (handler key, options, step context) and policy.json
 *      into a fresh work directory; copy declared input files and the shared
 *      output directory into it.
 *   3. `openshell sandbox create --name … --from <image> --policy policy.json
 *      --upload <workdir> -- node /sandbox/step.mjs /sandbox/input.json`
 *   4. Read the single `AEGIS_RESULT` line; download /sandbox/out back to the
 *      host output directory; delete the sandbox.
 *
 * Operator stop: `openshell sandbox delete <name>`, then the local CLI process
 * is killed. The stop counts as proven only when the delete succeeded; the
 * rejection is then named 'WorkerTerminated' (same contract as the worker
 * hard stop), so the runner records system.agent_terminated.
 *
 * Every CLI call uses an argument array (execFile / spawn), never a shell
 * string (CLAUDE.md Security Coding Rules).
 */

import { spawn } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { canonicalJSON, sha256 } from './crypto.js';
import { type NetworkEndpoint, stepPolicy } from './openshell-policy.js';
import type { PilotStep } from './scope.js';
import { RESULT_MARKER } from './sandbox-step-runner.js';
import type { HandlerRegistry, StepContext, StepHandler, StepResult } from './workflow-runner.js';
import { NetworkUnavailable } from './workflow-runner.js';

export interface CommandResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

/** Runs a command with an argument array. Injectable for tests. */
export type CommandRunner = (
  cmd: string,
  args: readonly string[],
  opts: { cwd?: string; timeoutMs?: number; onSpawn?: (kill: () => void) => void },
) => Promise<CommandResult>;

export const spawnRunner: CommandRunner = (cmd, args, opts) =>
  new Promise((resolvePromise) => {
    const child = spawn(cmd, [...args], { cwd: opts.cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d: Buffer) => (stdout += d.toString('utf8')));
    child.stderr.on('data', (d: Buffer) => (stderr += d.toString('utf8')));
    const timer = opts.timeoutMs
      ? setTimeout(() => child.kill('SIGKILL'), opts.timeoutMs)
      : undefined;
    opts.onSpawn?.(() => child.kill('SIGKILL'));
    child.on('error', (e) => {
      clearTimeout(timer);
      resolvePromise({ code: null, stdout, stderr: `${stderr}${e.message}` });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolvePromise({ code, stdout, stderr });
    });
  });

export interface OpenShellRef {
  /** Handler module (createRegistry(options) contract, as in isolated-handlers.ts). */
  modulePath: string;
  /** Options for createRegistry, as seen INSIDE the sandbox (paths under /sandbox). */
  options?: Record<string, unknown>;
  /** Host files copied into the sandbox: sandbox-relative path → host path. */
  inputs?: Readonly<Record<string, string>>;
  /** Host directory mirrored to and from /sandbox/out across steps. */
  outputDir?: string;
  /** Sandbox image with a node binary (pinned tag or digest). */
  image: string;
  /** Where per-step work directories are created (host, local disk). */
  workRoot: string;
  endpointsByStep?: Readonly<Record<string, readonly NetworkEndpoint[]>>;
  cli?: string;
  runner?: CommandRunner;
  /** Test seam: supply a prebuilt bundle instead of running esbuild. */
  bundlePath?: string;
  stepTimeoutMs?: number;
}

/** Containment evidence attached to each step result for the Article 12 record. */
export interface ContainmentEvidence {
  mode: 'openshell';
  sandbox: string;
  image: string;
  policyDigest: string;
}

const ESBUILD = () => resolve(process.cwd(), 'node_modules/.bin/esbuild');

async function buildBundle(ref: OpenShellRef, run: CommandRunner): Promise<string> {
  if (ref.bundlePath) return ref.bundlePath;
  const dir = mkdtempSync(join(ref.workRoot, 'bundle-'));
  const entry = join(dir, 'entry.ts');
  const runnerPath = resolve(new URL('./sandbox-step-runner.ts', import.meta.url).pathname);
  writeFileSync(
    entry,
    `import * as mod from ${JSON.stringify(resolve(ref.modulePath))};\n` +
      `import { runSandboxStep } from ${JSON.stringify(runnerPath)};\n` +
      `await runSandboxStep(mod, process.argv[2]);\n`,
  );
  const out = join(dir, 'step.mjs');
  const res = await run(
    ESBUILD(),
    [
      entry,
      '--bundle',
      '--platform=node',
      '--format=esm',
      '--target=node20',
      `--outfile=${out}`,
      '--log-level=error',
    ],
    { timeoutMs: 120_000 },
  );
  if (res.code !== 0) throw new Error(`step bundle failed: ${res.stderr.slice(0, 300)}`);
  return out;
}

function sandboxName(ctx: StepContext): string {
  return `aegis-${ctx.step.id}-${randomUUID().slice(0, 8)}`.slice(0, 63);
}

function parseResult(stdout: string): {
  ok: boolean;
  result?: StepResult;
  errorName?: string;
  errorMessage?: string;
} {
  const line = stdout
    .split('\n')
    .reverse()
    .find((l) => l.startsWith(RESULT_MARKER));
  if (!line) throw new Error('sandbox produced no AEGIS_RESULT line');
  return JSON.parse(line.slice(RESULT_MARKER.length)) as ReturnType<typeof parseResult>;
}

async function runInSandbox(
  ref: OpenShellRef,
  bundle: Promise<string>,
  key: string,
  step: PilotStep,
  ctx: StepContext,
): Promise<StepResult> {
  const { signal, ...rest } = ctx;
  if (signal.aborted) throw signal.reason;
  const run = ref.runner ?? spawnRunner;
  const cli = ref.cli ?? 'openshell';

  const work = mkdtempSync(join(ref.workRoot, `step-${step.id}-`));
  copyFileSync(await bundle, join(work, 'step.mjs'));
  for (const [rel, host] of Object.entries(ref.inputs ?? {})) {
    if (rel.includes('..') || rel.startsWith('/'))
      throw new Error(`invalid sandbox input path: ${rel}`);
    const dest = join(work, rel);
    mkdirSync(join(dest, '..'), { recursive: true });
    copyFileSync(host, dest);
  }
  mkdirSync(join(work, 'out'), { recursive: true });
  if (ref.outputDir && existsSync(ref.outputDir))
    cpSync(ref.outputDir, join(work, 'out'), { recursive: true });
  writeFileSync(
    join(work, 'input.json'),
    JSON.stringify({ handlerKey: key, options: ref.options ?? {}, ctx: rest }),
  );
  const policy = stepPolicy(step, { endpointsByStep: ref.endpointsByStep });
  const policyPath = join(work, 'policy.json');
  writeFileSync(policyPath, JSON.stringify(policy, null, 2));
  const containment: ContainmentEvidence = {
    mode: 'openshell',
    sandbox: sandboxName(ctx),
    image: ref.image,
    policyDigest: sha256(canonicalJSON(policy)),
  };

  let killLocal: (() => void) | undefined;
  let stopping = false;
  const onAbort = () => {
    stopping = true;
  };
  signal.addEventListener('abort', onAbort, { once: true });

  const stop = async (): Promise<never> => {
    const t0 = performance.now();
    const del = await run(cli, ['sandbox', 'delete', containment.sandbox], { timeoutMs: 15_000 });
    killLocal?.();
    const ms = Math.round(performance.now() - t0);
    if (del.code !== 0)
      throw new Error(
        `sandbox delete not confirmed (exit ${del.code}): ${del.stderr.slice(0, 200)}`,
      );
    const e = new Error(
      `sandbox ${containment.sandbox} deleted by operator stop (${ms} ms)`,
    ) as Error & {
      terminationMs: number;
    };
    e.name = 'WorkerTerminated';
    e.terminationMs = ms;
    throw e;
  };

  try {
    const created = run(
      cli,
      [
        'sandbox',
        'create',
        '--name',
        containment.sandbox,
        '--from',
        ref.image,
        '--policy',
        policyPath,
        '--upload',
        work,
        '--',
        'node',
        '/sandbox/step.mjs',
        '/sandbox/input.json',
      ],
      { cwd: work, timeoutMs: ref.stepTimeoutMs ?? 600_000, onSpawn: (k) => (killLocal = k) },
    );
    const aborted = new Promise<'aborted'>((r) =>
      signal.aborted
        ? r('aborted')
        : signal.addEventListener('abort', () => r('aborted'), { once: true }),
    );
    const winner = await Promise.race([created, aborted]);
    if (winner === 'aborted' || stopping) return await stop();
    const res = winner;

    let parsed: ReturnType<typeof parseResult>;
    try {
      parsed = parseResult(res.stdout);
    } catch (err) {
      throw new Error(`${(err as Error).message}; exit ${res.code}; ${res.stderr.slice(0, 300)}`, {
        cause: err,
      });
    }
    // An accepted stop means no output reaches the host: never start the copy-back after it.
    if (stopping) return await stop();
    if (ref.outputDir) {
      const dl = await run(
        cli,
        ['sandbox', 'download', containment.sandbox, '/sandbox/out', ref.outputDir],
        {
          timeoutMs: 60_000,
        },
      );
      if (dl.code !== 0) throw new Error(`output download failed: ${dl.stderr.slice(0, 200)}`);
      if (stopping) return await stop();
    }
    if (!parsed.ok) {
      if (parsed.errorName === 'NetworkUnavailable')
        throw new NetworkUnavailable(parsed.errorMessage);
      throw new Error(parsed.errorMessage ?? 'step failed in sandbox');
    }
    return { ...(parsed.result as StepResult), containment: { ...containment } };
  } finally {
    signal.removeEventListener('abort', onAbort);
    if (!stopping)
      await run(cli, ['sandbox', 'delete', containment.sandbox], { timeoutMs: 15_000 });
  }
}

/**
 * A registry whose handlers each run in their own OpenShell sandbox. Steps are
 * needed (not just handler keys) because the policy depends on each step's
 * criticality and network declaration in the signed scope.
 */
export function createOpenShellRegistry(
  ref: OpenShellRef,
  steps: readonly PilotStep[],
): HandlerRegistry {
  mkdirSync(ref.workRoot, { recursive: true, mode: 0o700 });
  const run = ref.runner ?? spawnRunner;
  let bundle: Promise<string> | undefined;
  const registry: Record<string, StepHandler> = {};
  for (const step of steps) {
    const handler: StepHandler = (ctx) => {
      bundle ??= buildBundle(ref, run);
      // Policy follows the step actually being run (steps may share a handler).
      return runInSandbox(ref, bundle, step.handler, ctx.step, ctx);
    };
    handler.hardStop = true;
    registry[step.handler] = handler;
  }
  return registry;
}
