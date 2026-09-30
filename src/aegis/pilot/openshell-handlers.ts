// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
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
 * Per step (CLI shape verified against a real OpenShell build, 28.09.2026):
 *   1. Bundle the handler module + sandbox-step-runner into one step.mjs
 *      (esbuild, once per registry). The image needs only a node binary.
 *   2. `openshell sandbox create --name … --from <image> --policy policy.json
 *      --detach -o json`, then wait for phase Ready.
 *   3. Stage files by piping a JSON map to a node unpacker over
 *      `sandbox exec` stdin (step.mjs, input.json, declared inputs, the shared
 *      output directory). The unpacker writes only under /sandbox. `sandbox
 *      upload` needs an ssh client on the host; stdin does not, which matters on
 *      an air-gapped site.
 *   4. `sandbox exec -- node /sandbox/step.mjs /sandbox/input.json`; read the
 *      single `AEGIS_RESULT` line and validate it.
 *   5. Pack /sandbox/out back the same way into a host staging directory,
 *      verify it (regular files only, bounded, never following links) and only
 *      then, if no stop landed, promote it into the host output directory;
 *      delete the sandbox and confirm it is gone.
 *
 * Operator stop (terminateSandbox): `openshell sandbox delete <name>` returns
 * when deletion is accepted, not when it has finished. If the delete does not
 * succeed (a stop during provisioning), the local create client is killed and
 * awaited and the delete is repeated. The stop counts as proven only when every
 * page of a successful `sandbox list` omits the sandbox; the rejection is then
 * named 'WorkerTerminated' (same contract as the worker hard stop), so the
 * runner records system.agent_terminated with the measured latency.
 *
 * The sandboxed step is untrusted: its stdout, its result object and its
 * output files are validated and bounded before anything reaches the host.
 *
 * Every CLI call uses an argument array (spawn), never a shell string
 * (CLAUDE.md Security Coding Rules).
 */

import { spawn } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  constants as fsConstants,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { canonicalJSON, sha256 } from './crypto.js';
import { type NetworkEndpoint, stepPolicy } from './openshell-policy.js';
import type { PilotStep } from './scope.js';
import { RESULT_MARKER } from './sandbox-step-runner.js';
import type { StopTestAgent } from './acceptance.js';
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
  opts: {
    cwd?: string;
    timeoutMs?: number;
    /** Written to the child's stdin, which is then closed. */
    input?: string;
    /** Streamed stdout, as it arrives. */
    onStdout?: (chunk: string) => void;
    /** Kill the child once stdout + stderr exceed this many bytes (default 8 MiB). */
    maxOutputBytes?: number;
    onSpawn?: (kill: () => void) => void;
  },
) => Promise<CommandResult>;

/** Default cap on captured child output. */
export const DEFAULT_MAX_OUTPUT_BYTES = 8 * 1024 * 1024;
/** Cap on the files a step may hand back through /sandbox/out (raw bytes). */
export const MAX_OUTPUT_FILES_BYTES = 32 * 1024 * 1024;
/** Default cap on the number of files a step may hand back through /sandbox/out. */
export const MAX_OUTPUT_FILES = 1000;

export const spawnRunner: CommandRunner = (cmd, args, opts) =>
  new Promise((resolvePromise) => {
    const child = spawn(cmd, [...args], {
      cwd: opts.cwd,
      stdio: [opts.input === undefined ? 'ignore' : 'pipe', 'pipe', 'pipe'],
    });
    if (opts.input !== undefined && child.stdin) {
      child.stdin.on('error', () => undefined);
      child.stdin.end(opts.input);
    }
    let stdout = '';
    let stderr = '';
    const cap = opts.maxOutputBytes ?? DEFAULT_MAX_OUTPUT_BYTES;
    let bytes = 0;
    let overflow = false;
    const count = (d: Buffer) => {
      bytes += d.length;
      if (bytes > cap && !overflow) {
        // Output from inside a sandbox is untrusted: never buffer it without bound.
        overflow = true;
        child.kill('SIGKILL');
      }
      return !overflow;
    };
    child.stdout?.on('data', (d: Buffer) => {
      if (!count(d)) return;
      const t = d.toString('utf8');
      stdout += t;
      opts.onStdout?.(t);
    });
    child.stderr?.on('data', (d: Buffer) => {
      if (count(d)) stderr += d.toString('utf8');
    });
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
      resolvePromise(
        overflow
          ? { code: null, stdout: '', stderr: `output limit exceeded (${cap} bytes); child killed` }
          : { code, stdout, stderr },
      );
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
  /** Path of the node binary inside the sandbox image. */
  nodeBinary?: string;
  /** Memory and CPU caps per sandbox; defaults to DEFAULT_SANDBOX_LIMITS. */
  limits?: SandboxLimits;
  /** Test seam: shorten the deletion polling. */
  pollIntervalMs?: number;
  /** How long to wait for a deleted sandbox to disappear before the stop is unproven. */
  deleteConfirmTimeoutMs?: number;
  /** Test seam: supply a prebuilt bundle instead of running esbuild. */
  bundlePath?: string;
  stepTimeoutMs?: number;
  /** Copy-back bounds for /sandbox/out (defaults MAX_OUTPUT_FILES / MAX_OUTPUT_FILES_BYTES). */
  maxOutputFiles?: number;
  maxOutputBytes?: number;
  /**
   * Positive control for the gateway's listing shape, shared by every sandbox on
   * that gateway (security review M3). A registry makes its own when not given.
   */
  listingControl?: ListingControl;
}

/**
 * Absence from `sandbox list` proves a stop only once a listing on the same
 * gateway has been seen to show a sandbox by name. A gateway that nests `name`
 * or returns a transient empty page would otherwise "prove" every stop.
 */
export interface ListingControl {
  verified: boolean;
}

/** Containment evidence attached to each step result for the Article 12 record. */
export interface ContainmentEvidence {
  mode: 'openshell';
  sandbox: string;
  step: string;
  image: string;
  policyDigest: string;
  limits: SandboxLimits;
}

const ESBUILD = () => resolve(process.cwd(), 'node_modules/.bin/esbuild');
/** Step ids end up in host paths (work directories): the scope's id grammar, enforced again here. */
const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,62}$/;

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

/**
 * OpenShell caps sandbox names at 19 characters (verified against a real
 * gateway), so names are a short prefix plus random hex — never a truncated
 * id, so names stay unique; the step id is recorded next to the name in the
 * containment evidence instead.
 */
export const SANDBOX_NAME_MAX = 19;
function shortName(prefix: 'as' | 'at'): string {
  return `${prefix}-${randomUUID()
    .replace(/-/g, '')
    .slice(0, SANDBOX_NAME_MAX - prefix.length - 1)}`;
}
export function sandboxName(): string {
  return shortName('as');
}

/**
 * Exactly one line may carry a marker. Sandbox output is untrusted: a step
 * that prints a second, forged marker line (for example from a callback that
 * fires after its own result) fails the step instead of choosing between them.
 */
function singleMarkedLine(stdout: string, marker: string, label: string): string {
  const lines = stdout.split('\n').filter((l) => l.startsWith(marker));
  if (lines.length === 0) throw new Error(`sandbox produced no ${label} line`);
  if (lines.length > 1)
    throw new Error(`sandbox produced ${lines.length} ${label} lines; refusing`);
  return lines[0];
}

/** The only result shape accepted from inside a sandbox. Unknown keys are dropped. */
const SandboxReply = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    result: z.object({
      output: z.unknown(),
      decision: z.string().max(500).optional(),
      confidence: z.number().finite().min(0).max(1).optional(),
      modelVersion: z.string().max(200).optional(),
    }),
  }),
  z.object({
    ok: z.literal(false),
    errorName: z.string().max(100).optional(),
    errorMessage: z.string().max(1000).optional(),
  }),
]);
type SandboxReply = z.infer<typeof SandboxReply>;

function parseResult(stdout: string): SandboxReply {
  const line = singleMarkedLine(stdout, RESULT_MARKER, 'AEGIS_RESULT');
  let raw: unknown;
  try {
    raw = JSON.parse(line.slice(RESULT_MARKER.length));
  } catch {
    throw new Error('sandbox AEGIS_RESULT line is not JSON');
  }
  const parsed = SandboxReply.safeParse(raw);
  if (!parsed.success)
    throw new Error(`sandbox result rejected: ${parsed.error.issues[0]?.message}`);
  return parsed.data;
}

/** The copy-back map from inside the sandbox: relative path → base64 bytes. */
const OutputMap = z.record(z.string(), z.string().regex(/^[A-Za-z0-9+/]*={0,2}$/));

/**
 * Walks a host staging tree without following links. Anything but directories
 * and regular files, or more than the bounds allow, rejects the whole copy-back.
 */
export function verifyOutputTree(
  root: string,
  bounds: { maxFiles: number; maxBytes: number },
): { files: number; bytes: number } {
  let files = 0;
  let bytes = 0;
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = lstatSync(p);
      if (st.isDirectory()) walk(p);
      else if (st.isFile() && st.nlink === 1) {
        files++;
        bytes += st.size;
      } else {
        throw new Error(`sandbox output rejected: ${relative(root, p)} is not a regular file`);
      }
      if (files > bounds.maxFiles || bytes > bounds.maxBytes)
        throw new Error(
          `sandbox output rejected: exceeds ${bounds.maxFiles} files / ${bounds.maxBytes} bytes`,
        );
    }
  };
  walk(root);
  return { files, bytes };
}

/** A relative path that stays inside `root`, or null. */
function within(root: string, rel: string): string | null {
  if (!rel || isAbsolute(rel) || rel.includes('\0')) return null;
  const r = relative(root, resolve(root, rel));
  if (!r || r.startsWith('..') || isAbsolute(r)) return null;
  return r;
}

// Runs inside the sandbox: writes a JSON map {relativePath: base64} under /sandbox.
const UNPACK = `let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const fs=require('fs'),path=require('path');for(const [r,b] of Object.entries(JSON.parse(d))){if(r.includes('..')||path.isAbsolute(r))throw new Error('bad path '+r);const f=path.join('/sandbox',r);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,Buffer.from(b,'base64'))}process.stdout.write('AEGIS_STAGED')})`;
// Runs inside the sandbox: prints /sandbox/out as one JSON map line.
const PACK = `const fs=require('fs'),path=require('path'),o={};const w=(d,r)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name),q=r?r+'/'+e.name:e.name;if(e.isDirectory())w(p,q);else if(e.isFile())o[q]=fs.readFileSync(p).toString('base64')}};if(fs.existsSync('/sandbox/out'))w('/sandbox/out','');let n=0;for(const b of Object.values(o))n+=b.length*3/4;if(n>${MAX_OUTPUT_FILES_BYTES}){process.stderr.write('outputs exceed limit');process.exit(3)}process.stdout.write('AEGIS_OUT '+JSON.stringify(o)+'\\n')`;

function filesFrom(dir: string, prefix: string, into: Record<string, string>): void {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    const r = `${prefix}/${e.name}`;
    if (e.isDirectory()) filesFrom(p, r, into);
    else if (e.isFile()) into[r] = readFileSync(p).toString('base64');
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SANDBOX_OUT = '/sandbox/out';

/**
 * Positive proof that a sandbox is gone: every page of a successful
 * `sandbox list -o json` omits the name. Any failure or unparsable page counts
 * as "not proven" — the check never reads meaning into an error message.
 */
export async function confirmSandboxGone(
  run: CommandRunner,
  cli: string,
  name: string,
  deadlineMs: number,
  pollMs: number,
  control: ListingControl,
): Promise<boolean> {
  // No positive control yet: an empty listing proves nothing (security review 30.09.2026, M3).
  if (!control.verified) return false;
  // Absence counts only when two consecutive complete listings agree, so a transient empty
  // page or a create that lands late is not taken as proof of a stop (review 30.09.2026, M2).
  const end = performance.now() + deadlineMs;
  let absentOnce = false;
  while (performance.now() < end) {
    const listed = await listContains(run, cli, name);
    if (listed === false && absentOnce) return true;
    absentOnce = listed === false;
    await sleep(pollMs);
  }
  return false;
}

/**
 * The positive control: polls until a complete listing shows `name`. Only then
 * is the listing shape trusted to prove a later absence (`control.verified`).
 */
export async function verifyListed(
  run: CommandRunner,
  cli: string,
  name: string,
  deadlineMs: number,
  pollMs: number,
  control: ListingControl,
): Promise<boolean> {
  const end = performance.now() + deadlineMs;
  do {
    if ((await listContains(run, cli, name)) === true) {
      control.verified = true;
      return true;
    }
    await sleep(pollMs);
  } while (performance.now() < end);
  return false;
}

/** true / false from a complete, successful listing; null when not provable. */
async function listContains(
  run: CommandRunner,
  cli: string,
  name: string,
): Promise<boolean | null> {
  let token = '';
  for (let pages = 0; pages < 100; pages++) {
    const args = ['sandbox', 'list', '-o', 'json', ...(token ? ['--page-token', token] : [])];
    const l = await run(cli, args, { timeoutMs: 10_000 });
    if (l.code !== 0) return null;
    let page: { sandboxes?: Array<{ name?: string }>; next_page_token?: string };
    try {
      page = JSON.parse(l.stdout) as typeof page;
    } catch {
      return null;
    }
    if (!Array.isArray(page.sandboxes)) return null;
    if (page.sandboxes.some((x) => x.name === name)) return true;
    if (!page.next_page_token) return false;
    token = page.next_page_token;
  }
  return null;
}

/**
 * Deletes a sandbox and waits until the gateway reports it gone (every listing
 * page omits it). `create` is the in-flight create call and `killLocal` stops
 * the current local CLI: after a delete that does not succeed (stop during
 * provisioning) the client is killed and awaited and the delete repeated, so
 * no create can land after the confirmation.
 */
export async function terminateSandbox(p: {
  cli: string;
  run: CommandRunner;
  name: string;
  create?: Promise<unknown>;
  killLocal?: () => void;
  deadlineMs?: number;
  pollMs?: number;
  control: ListingControl;
}): Promise<{ confirmed: boolean; ms: number; detail: string }> {
  const t0 = performance.now();
  const del = () => p.run(p.cli, ['sandbox', 'delete', p.name], { timeoutMs: 60_000 });
  // A create still in flight could land after the sandbox was listed as gone, so it is
  // always settled first — not only when the delete fails (security review 30.09.2026, M2).
  let created = false;
  if (p.create) {
    let settled = false;
    p.create.then(
      (r) => {
        settled = true;
        created = (r as CommandResult | undefined)?.code === 0;
      },
      () => (settled = true),
    );
    await new Promise((r) => setImmediate(r));
    if (!settled) {
      p.killLocal?.();
      await p.create.catch(() => undefined);
    }
  }
  // A sandbox that was created but whose listing shape was never checked gets the
  // positive control now, before the delete, so its absence can count afterwards.
  if (created && !p.control.verified)
    await verifyListed(p.run, p.cli, p.name, p.deadlineMs ?? 30_000, p.pollMs ?? 200, p.control);
  let res = await del();
  if (res.code !== 0 && p.create) {
    res = await del();
  }
  const gone = await confirmSandboxGone(
    p.run,
    p.cli,
    p.name,
    p.deadlineMs ?? 30_000,
    p.pollMs ?? 200,
    p.control,
  );
  const ms = Math.round(performance.now() - t0);
  return gone
    ? { confirmed: true, ms, detail: 'gone' }
    : {
        confirmed: false,
        ms,
        detail: p.control.verified
          ? `sandbox still listed or listing failed (delete exit ${res.code}): ${res.stderr.slice(0, 200)}`
          : 'the gateway listing was never seen to show a sandbox, so absence proves nothing',
      };
}

/** Resource limits applied to every sandbox (enforced by the container runtime). */
export interface SandboxLimits {
  memory: string;
  cpu: string;
}
export const DEFAULT_SANDBOX_LIMITS: SandboxLimits = { memory: '1Gi', cpu: '1' };
const LIMIT = /^[0-9]+(\.[0-9]+)?[A-Za-z]{0,2}$/;
function limitArgs(l: SandboxLimits): string[] {
  if (!LIMIT.test(l.memory) || !LIMIT.test(l.cpu)) throw new Error('invalid sandbox limits');
  return ['--memory', l.memory, '--cpu', l.cpu];
}

/**
 * Rewrites path strings under `from` to the same path under `to`, deeply.
 * Step results name files as the step saw them; outputs copied back to the
 * host are recorded under their host path, and state passed into a sandbox is
 * shown under the sandbox path, so a later step or a reconcile on the host
 * finds the file where it actually is.
 */
export function remapPaths<T>(value: T, from: string, to: string): T {
  const f = from.replace(/\/+$/, '');
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') {
      if (v === f) return to;
      if (v.startsWith(`${f}/`)) return join(to, v.slice(f.length + 1));
      return v;
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object')
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(value) as T;
}

/**
 * Promotes a verified staging tree into the output directory (security review
 * 30.09.2026, M5). The output directory is staged into every later step, so a
 * step may hand an earlier file back only unchanged: any other overwrite, and
 * any file/directory type conflict, is refused before anything is written.
 * Files are first copied next to their destination under a temporary name and
 * renamed into place only once all of them are written. `promoted` records the
 * sha256 of every file this registry put there.
 */
export function promoteOutputs(
  staging: string,
  outputDir: string,
  promoted: Map<string, string>,
): void {
  const plan: Array<{ rel: string; src: string; dest: string; digest: string }> = [];
  const walk = (dir: string, prefix: string) => {
    for (const name of readdirSync(dir)) {
      const src = join(dir, name);
      const rel = prefix ? `${prefix}/${name}` : name;
      if (lstatSync(src).isDirectory()) walk(src, rel);
      else plan.push({ rel, src, dest: join(outputDir, rel), digest: sha256(readFileSync(src)) });
    }
  };
  walk(staging, '');
  const todo = plan.filter(({ rel, dest, digest }) => {
    const parts = rel.split('/');
    for (let i = 1; i < parts.length; i++) {
      const anc = join(outputDir, ...parts.slice(0, i));
      if (existsSync(anc) && !lstatSync(anc).isDirectory())
        throw new Error(`sandbox output rejected: type conflict at ${parts.slice(0, i).join('/')}`);
    }
    if (!existsSync(dest)) return true;
    const st = lstatSync(dest);
    if (!st.isFile()) throw new Error(`sandbox output rejected: type conflict at ${rel}`);
    if (sha256(readFileSync(dest)) !== digest)
      throw new Error(`sandbox output rejected: would overwrite ${rel}`);
    return false;
  });
  const written: string[] = [];
  try {
    for (const f of todo) {
      mkdirSync(dirname(f.dest), { recursive: true });
      const tmp = `${f.dest}.aegis-${randomUUID().slice(0, 8)}.tmp`;
      copyFileSync(f.src, tmp, fsConstants.COPYFILE_EXCL);
      written.push(tmp);
    }
  } catch (err) {
    for (const t of written) rmSync(t, { force: true });
    throw err;
  }
  todo.forEach((f, i) => renameSync(written[i], f.dest));
  for (const f of plan) promoted.set(f.rel, f.digest);
}

/** Refuses to stage earlier outputs into a step if any changed on the host since promotion. */
function checkPromoted(outputDir: string, promoted: ReadonlyMap<string, string>): void {
  for (const [rel, digest] of promoted) {
    const p = join(outputDir, rel);
    const ok = existsSync(p) && lstatSync(p).isFile() && sha256(readFileSync(p)) === digest;
    if (!ok) throw new Error(`earlier output ${rel} changed on the host since it was promoted`);
  }
}

async function runInSandbox(
  ref: OpenShellRef,
  bundle: Promise<string>,
  key: string,
  step: PilotStep,
  ctx: StepContext,
  control: ListingControl,
  promoted: Map<string, string>,
): Promise<StepResult> {
  const { signal, ...rest } = ctx;
  if (signal.aborted) throw signal.reason;
  if (!SAFE_ID.test(step.id)) throw new Error(`unsafe step id: ${JSON.stringify(step.id)}`);
  const run = ref.runner ?? spawnRunner;
  const cli = ref.cli ?? 'openshell';
  const node = ref.nodeBinary ?? '/usr/local/bin/node';
  const poll = ref.pollIntervalMs ?? 200;
  const confirmMs = ref.deleteConfirmTimeoutMs ?? 30_000;
  const name = sandboxName();

  mkdirSync(ref.workRoot, { recursive: true, mode: 0o700 });
  const work = mkdtempSync(join(ref.workRoot, `step-${step.id}-`));
  const staging = mkdtempSync(join(ref.workRoot, `dl-${step.id}-`));

  let killLocal: (() => void) | undefined;
  let createCall: Promise<CommandResult> | undefined;
  let stopping = false;
  let terminated = false;
  const onAbort = () => {
    stopping = true;
  };
  signal.addEventListener('abort', onAbort, { once: true });

  const terminate = () =>
    terminateSandbox({
      cli,
      run,
      name,
      create: createCall,
      killLocal: () => killLocal?.(),
      deadlineMs: confirmMs,
      pollMs: poll,
      control,
    });

  const stop = async (): Promise<never> => {
    const t = await terminate();
    killLocal?.();
    if (!t.confirmed) throw new Error(`sandbox delete not confirmed: ${t.detail}`);
    terminated = true;
    const e = new Error(`sandbox ${name} deleted by operator stop (${t.ms} ms)`) as Error & {
      terminationMs: number;
    };
    e.name = 'WorkerTerminated';
    e.terminationMs = t.ms;
    throw e;
  };

  const raceAbort = async <T>(p: Promise<T>): Promise<T | 'aborted'> =>
    Promise.race([
      p,
      new Promise<'aborted'>((r) =>
        signal.aborted
          ? r('aborted')
          : signal.addEventListener('abort', () => r('aborted'), { once: true }),
      ),
    ]);

  const sandboxExec = (
    args: string[],
    opts: { input?: string; timeoutMs?: number; maxOutputBytes?: number } = {},
  ) =>
    run(cli, ['sandbox', 'exec', '-n', name, '--no-tty', '--no-login-shell', '--', node, ...args], {
      timeoutMs: opts.timeoutMs ?? 60_000,
      input: opts.input,
      maxOutputBytes: opts.maxOutputBytes,
      onSpawn: (k) => (killLocal = k),
    });

  try {
    const policy = stepPolicy(step, { endpointsByStep: ref.endpointsByStep, nodeBinary: node });
    const policyPath = join(work, 'policy.json');
    writeFileSync(policyPath, JSON.stringify(policy, null, 2));
    const containment: ContainmentEvidence = {
      mode: 'openshell',
      sandbox: name,
      step: step.id,
      image: ref.image,
      policyDigest: sha256(canonicalJSON(policy)),
      limits: { ...(ref.limits ?? DEFAULT_SANDBOX_LIMITS) },
    };

    const staged: Record<string, string> = {
      'step.mjs': readFileSync(await bundle).toString('base64'),
      'input.json': Buffer.from(
        JSON.stringify({
          handlerKey: key,
          options: ref.options ?? {},
          ctx: ref.outputDir ? remapPaths(rest, resolve(ref.outputDir), SANDBOX_OUT) : rest,
        }),
      ).toString('base64'),
    };
    for (const [rel, host] of Object.entries(ref.inputs ?? {})) {
      // Inputs land under /sandbox only, and only regular files are staged (no links).
      const inside = within('/sandbox', rel);
      if (!inside || rel.includes('..')) throw new Error(`invalid sandbox input path: ${rel}`);
      if (!lstatSync(host).isFile())
        throw new Error(`sandbox input is not a regular file: ${host}`);
      staged[inside] = readFileSync(host).toString('base64');
    }
    if (ref.outputDir && existsSync(ref.outputDir)) {
      checkPromoted(ref.outputDir, promoted);
      filesFrom(ref.outputDir, 'out', staged);
    }
    const stagedBytes = Object.values(staged).reduce((n, b) => n + (b.length * 3) / 4, 0);
    if (stagedBytes > MAX_OUTPUT_FILES_BYTES * 2)
      throw new Error(`files to stage exceed the limit (${Math.round(stagedBytes)} bytes)`);

    createCall = run(
      cli,
      [
        'sandbox',
        'create',
        '--name',
        name,
        '--from',
        ref.image,
        '--policy',
        policyPath,
        '--detach',
        '--no-tty',
        '--no-auto-providers',
        ...limitArgs(ref.limits ?? DEFAULT_SANDBOX_LIMITS),
        '-o',
        'json',
      ],
      { cwd: work, timeoutMs: 180_000, onSpawn: (k) => (killLocal = k) },
    );
    const cr = await raceAbort(createCall);
    if (cr === 'aborted' || stopping) return await stop();
    if (cr.code !== 0) throw new Error(`sandbox create failed: ${cr.stderr.slice(0, 400)}`);
    // Positive control (M3): the listing must show this sandbox before anything runs in it.
    const seen = await raceAbort(verifyListed(run, cli, name, confirmMs, poll, control));
    if (seen === 'aborted' || stopping) return await stop();
    if (!seen)
      throw new Error(`gateway listing never showed sandbox ${name}; its stop could not be proven`);

    const st = await raceAbort(sandboxExec(['-e', UNPACK], { input: JSON.stringify(staged) }));
    if (st === 'aborted' || stopping) return await stop();
    if (!st.stdout.includes('AEGIS_STAGED'))
      throw new Error(`staging into sandbox failed: ${st.stderr.slice(0, 300)}`);

    const res = await raceAbort(
      sandboxExec(['/sandbox/step.mjs', '/sandbox/input.json'], {
        timeoutMs: ref.stepTimeoutMs ?? 600_000,
      }),
    );
    if (res === 'aborted' || stopping) return await stop();

    let parsed: SandboxReply;
    try {
      parsed = parseResult(res.stdout);
    } catch (err) {
      throw new Error(`${(err as Error).message}; exit ${res.code}; ${res.stderr.slice(0, 300)}`, {
        cause: err,
      });
    }
    // A success claim from a process that did not exit cleanly is not a success.
    if (parsed.ok && res.code !== 0)
      throw new Error(`sandbox reported success but exited ${res.code}`);
    // An accepted stop means no output reaches the host: never start the copy-back after it.
    if (stopping) return await stop();
    if (ref.outputDir) {
      const maxFiles = ref.maxOutputFiles ?? MAX_OUTPUT_FILES;
      const maxBytes = ref.maxOutputBytes ?? MAX_OUTPUT_FILES_BYTES;
      const out = await raceAbort(
        sandboxExec(['-e', PACK], {
          maxOutputBytes: Math.ceil((MAX_OUTPUT_FILES_BYTES * 4) / 3) + 1024 * 1024,
        }),
      );
      if (out === 'aborted' || stopping) return await stop();
      if (out.code !== 0) throw new Error(`output copy-back failed: ${out.stderr.slice(0, 200)}`);
      const line = singleMarkedLine(out.stdout, 'AEGIS_OUT ', 'AEGIS_OUT');
      let map: unknown;
      try {
        map = JSON.parse(line.slice('AEGIS_OUT '.length));
      } catch {
        throw new Error('sandbox output rejected: AEGIS_OUT line is not JSON');
      }
      const files = OutputMap.safeParse(map);
      if (!files.success) throw new Error('sandbox output rejected: not a file map');
      const entries = Object.entries(files.data);
      if (entries.length > maxFiles)
        throw new Error(`sandbox output rejected: exceeds ${maxFiles} files / ${maxBytes} bytes`);
      // Written into a fresh host staging directory first; nothing reaches the
      // output directory until the whole tree is verified and no stop landed.
      let bytes = 0;
      for (const [rel, b64] of entries) {
        const inside = within(staging, rel);
        if (!inside || rel.includes('..'))
          throw new Error(
            `sandbox returned an output file outside /sandbox/out: ${rel.slice(0, 80)}`,
          );
        const buf = Buffer.from(b64, 'base64');
        bytes += buf.length;
        if (bytes > maxBytes)
          throw new Error(`sandbox output rejected: exceeds ${maxFiles} files / ${maxBytes} bytes`);
        const dest = join(staging, inside);
        mkdirSync(dirname(dest), { recursive: true });
        writeFileSync(dest, buf, { flag: 'wx' });
      }
      verifyOutputTree(staging, { maxFiles, maxBytes });
      if (stopping) return await stop();
      // A step that reported failure does not get its files into the report directory:
      // that directory is staged into every later step (security review 30.09.2026, M4).
      if (parsed.ok) {
        mkdirSync(ref.outputDir, { recursive: true });
        promoteOutputs(staging, ref.outputDir, promoted);
      }
    }
    if (!parsed.ok) {
      if (parsed.errorName === 'NetworkUnavailable')
        throw new NetworkUnavailable(parsed.errorMessage);
      throw new Error(parsed.errorMessage ?? 'step failed in sandbox');
    }
    const { output, decision, confidence, modelVersion } = parsed.result;
    const result: StepResult = { output, decision, confidence, modelVersion };
    return {
      ...(ref.outputDir ? remapPaths(result, SANDBOX_OUT, resolve(ref.outputDir)) : result),
      containment: { ...containment },
    };
  } finally {
    signal.removeEventListener('abort', onAbort);
    if (!terminated && createCall) {
      // Not proven stopped by stop(): make sure nothing is left running, and say so if it is.
      killLocal?.();
      const t = await terminate();
      if (!t.confirmed)
        process.stderr.write(`aegis-pilot: sandbox ${name} not confirmed deleted: ${t.detail}\n`);
    }
    rmSync(work, { recursive: true, force: true });
    rmSync(staging, { recursive: true, force: true });
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
  const control = ref.listingControl ?? { verified: false };
  const promoted = new Map<string, string>();
  const registry: Record<string, StepHandler> = {};
  for (const step of steps) {
    const handler: StepHandler = (ctx) => {
      bundle ??= buildBundle(ref, run);
      // Policy follows the step actually being run (steps may share a handler).
      return runInSandbox(ref, bundle, step.handler, ctx.step, ctx, control, promoted);
    };
    handler.hardStop = true;
    registry[step.handler] = handler;
  }
  return registry;
}

// The stubborn stop-test agent, as a sandboxed process: a synchronous busy loop
// that ignores SIGTERM, never reads a signal and never exits on its own; it
// reports each tick on stdout. The tick interval is an argument, not code.
const STUBBORN =
  "process.on('SIGTERM',()=>{});const t=Number(process.argv[1]);let n=0;for(;;){const u=Date.now()+t;while(Date.now()<u){}" +
  "process.stdout.write('AEGIS_TICK '+(n++)+'\\n')}";

/**
 * Condition (iii) under OpenShell containment: the stop-test agent runs in its
 * own sandbox under the core-step policy (no network), so the stop the record
 * proves is a sandbox deletion, confirmed by the gateway no longer listing it.
 * The tick stream stays attached after terminate(): a tick arriving after the
 * confirmation would mean the sandbox was not actually stopped. release()
 * detaches it.
 */
export function openShellStopTestAgent(
  ref: Pick<
    OpenShellRef,
    | 'image'
    | 'workRoot'
    | 'cli'
    | 'runner'
    | 'nodeBinary'
    | 'pollIntervalMs'
    | 'deleteConfirmTimeoutMs'
    | 'limits'
    | 'listingControl'
  >,
  tickMs: number,
): StopTestAgent {
  if (!Number.isFinite(tickMs) || tickMs <= 0) throw new Error(`invalid tick interval: ${tickMs}`);
  const run = ref.runner ?? spawnRunner;
  const cli = ref.cli ?? 'openshell';
  const node = ref.nodeBinary ?? '/usr/local/bin/node';
  const name = shortName('at');
  const control = ref.listingControl ?? { verified: false };
  let killLocal: (() => void) | undefined;
  let createCall: Promise<CommandResult> | undefined;
  let result: Promise<{ confirmed: boolean; ms: number }> | undefined;
  let work: string | undefined;
  return {
    async start(onTick) {
      mkdirSync(ref.workRoot, { recursive: true, mode: 0o700 });
      work = mkdtempSync(join(ref.workRoot, 'stop-test-'));
      const policyPath = join(work, 'policy.json');
      const policy = stepPolicy(
        {
          id: 'stop-test',
          handler: 'stop-test',
          criticality: 'core',
          requiresNetwork: false,
        } as PilotStep,
        { nodeBinary: node },
      );
      writeFileSync(policyPath, JSON.stringify(policy));
      createCall = run(
        cli,
        [
          'sandbox',
          'create',
          '--name',
          name,
          '--from',
          ref.image,
          '--policy',
          policyPath,
          '--detach',
          '--no-tty',
          '--no-auto-providers',
          ...limitArgs(ref.limits ?? DEFAULT_SANDBOX_LIMITS),
          '-o',
          'json',
        ],
        { timeoutMs: 180_000, onSpawn: (k) => (killLocal = k) },
      );
      const cr = await createCall;
      if (cr.code !== 0)
        throw new Error(`stop-test sandbox create failed: ${cr.stderr.slice(0, 300)}`);
      const seen = await verifyListed(
        run,
        cli,
        name,
        ref.deleteConfirmTimeoutMs ?? 30_000,
        ref.pollIntervalMs ?? 200,
        control,
      );
      if (!seen)
        throw new Error(
          `gateway listing never showed stop-test sandbox ${name}; its stop could not be proven`,
        );
      let buf = '';
      void run(
        cli,
        [
          'sandbox',
          'exec',
          '-n',
          name,
          '--no-tty',
          '--no-login-shell',
          '--',
          node,
          '-e',
          STUBBORN,
          String(tickMs),
        ],
        {
          onSpawn: (k) => (killLocal = k),
          onStdout: (chunk) => {
            buf += chunk;
            const lines = buf.split('\n');
            buf = (lines.pop() ?? '').slice(-4096);
            for (const l of lines) if (l.startsWith('AEGIS_TICK ')) onTick();
          },
        },
      );
    },
    terminate() {
      result ??= createCall
        ? terminateSandbox({
            cli,
            run,
            name,
            create: createCall,
            killLocal: () => killLocal?.(),
            deadlineMs: ref.deleteConfirmTimeoutMs ?? 30_000,
            pollMs: ref.pollIntervalMs ?? 200,
            control,
          }).then(({ confirmed, ms }) => ({ confirmed, ms }))
        : Promise.resolve({ confirmed: true, ms: 0 });
      return result;
    },
    release() {
      killLocal?.();
      if (work) rmSync(work, { recursive: true, force: true });
    },
  };
}
