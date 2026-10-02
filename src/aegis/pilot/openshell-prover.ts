// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- src/aegis/pilot/openshell-prover.ts
/**
 * Aegis Pilot — OpenShell policy proof for the acceptance record (plan patch C4).
 *
 * The offers say "core steps have no network". The sandbox enforces the
 * generated policy (openshell-policy.ts); this module proves, before the run,
 * that every generated policy stays inside a boundary written down separately
 * from the generator, using NVIDIA's standalone Z3-backed checker
 * (`openshell-prover check <candidate> --boundary <boundary> -o json`,
 * crates/openshell-prover-cli). The result goes into the signed record, so a
 * reader can see the claim was proven, not only configured.
 *
 * The boundary is deliberately a second, literal statement of the contract:
 *   - core step: system paths read-only, /sandbox and /tmp writable, Landlock
 *     required, no network rule at all;
 *   - non-core step that requires the network: the same, plus only the
 *     endpoints the operator listed for that step, only from the node binary.
 * If the generator ever drifts (a network rule on a core step, an extra
 * writable path), the proof fails and an acceptance run refuses to start.
 *
 * Only `within_boundary` (exit 0) counts. `exceeds_boundary` (exit 1, with a
 * counterexample), `unsupported` (3), `inconclusive` (3, or 130 when
 * cancelled), `error` (2), a timeout or a crash all fail closed. Result names
 * and exit codes are those of openshell-prover-cli `result_envelope`.
 */

import { execFile } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { canonicalJSON, sha256 } from './crypto.js';
import { type NetworkEndpoint, type OpenShellPolicy, stepPolicy } from './openshell-policy.js';
import type { PilotStep } from './scope.js';

export interface ProverRun {
  code: number | null;
  stdout: string;
  stderr: string;
}

/** Runs the prover with an argument array (never a shell). Injectable for tests. */
export type ProverRunner = (
  path: string,
  args: readonly string[],
  timeoutMs: number,
) => Promise<ProverRun>;

const MAX_OUTPUT = 1024 * 1024;

export const execProver: ProverRunner = (path, args, timeoutMs) =>
  new Promise((resolve) => {
    execFile(
      path,
      [...args],
      { timeout: timeoutMs, maxBuffer: MAX_OUTPUT, env: {} },
      (err, stdout, stderr) => {
        // Non-zero exit: err.code is the exit number. Spawn failure: a string such as ENOENT.
        const errCode = (err as { code?: unknown } | null)?.code;
        const code = !err ? 0 : typeof errCode === 'number' ? errCode : null;
        resolve({ code, stdout: String(stdout), stderr: String(stderr) });
      },
    );
  });

export interface StepProof {
  step: string;
  criticality: PilotStep['criticality'];
  /** Prover verdict; only 'within_boundary' passes. 'error' also covers no answer at all. */
  result: 'within_boundary' | 'exceeds_boundary' | 'unsupported' | 'inconclusive' | 'error';
  reasonCode: string | null;
  reason: string | null;
  counterexample: unknown;
  candidateDigest: string;
  boundaryDigest: string;
}

export interface ContainmentProof {
  ok: boolean;
  prover: {
    version: string | null;
    /** SHA-256 of the exact bytes executed (a private copy of the binary). */
    binarySha256: string;
    /** True only when the caller supplied an expected hash and it matched. */
    pinned: boolean;
    schemaVersion: number | null;
  };
  steps: StepProof[];
}

const SYSTEM_READ_ONLY = ['/bin', '/usr', '/lib', '/lib64', '/etc', '/proc', '/dev/urandom'];
const WRITABLE = ['/sandbox', '/tmp', '/dev/null'];

/** The contract for one step, written independently of stepPolicy(). */
export function stepBoundary(
  step: PilotStep,
  opts: {
    endpointsByStep?: Readonly<Record<string, readonly NetworkEndpoint[]>>;
    nodeBinary?: string;
  } = {},
): OpenShellPolicy {
  const boundary: OpenShellPolicy = {
    version: 1,
    filesystem_policy: {
      include_workdir: false,
      read_only: [...SYSTEM_READ_ONLY],
      read_write: [...WRITABLE],
    },
    landlock: { compatibility: 'hard_requirement' },
    network_policies: {},
  };
  const endpoints =
    step.criticality === 'non-core' && step.requiresNetwork
      ? (opts.endpointsByStep?.[step.id] ?? [])
      : [];
  if (endpoints.length > 0) {
    boundary.network_policies.boundary = {
      name: `boundary-${step.id}`,
      endpoints: endpoints.map((e) => ({ host: e.host, port: e.port })),
      binaries: [{ path: opts.nodeBinary ?? '/usr/local/bin/node' }],
    };
  }
  return boundary;
}

/** The stop-test agent runs in a sandbox with a core-step policy; it is proven like any step. */
export const STOP_TEST_STEP = {
  id: 'stop-test',
  handler: 'stop-test',
  criticality: 'core',
  requiresNetwork: false,
} as PilotStep;

const RESULTS = new Set([
  'within_boundary',
  'exceeds_boundary',
  'unsupported',
  'inconclusive',
  'error',
]);

/** Domains the proof must cover; a prover that models less cannot certify the policy. */
export const REQUIRED_DOMAINS = ['filesystem', 'network_l4', 'network_rest', 'process', 'landlock'];

const cap = (v: string | null, n = 500) => (v && v.length > n ? `${v.slice(0, n)}…` : v);

/** Options that decide the generated policy. Pass the SAME object to the run's registry. */
export interface PolicyOptions {
  endpointsByStep?: Readonly<Record<string, readonly NetworkEndpoint[]>>;
  nodeBinary?: string;
}

/**
 * Prove every step's generated policy (and the stop-test agent's) against its
 * boundary. Never throws for a failed proof: the caller decides, and the
 * record carries the verdict either way. The binary is hashed once and a
 * private copy of those exact bytes is executed, so the hash names what ran.
 */
export async function proveStepPolicies(opts: {
  steps: readonly PilotStep[];
  proverPath: string;
  /** Expected SHA-256 of the prover binary. Required for an acceptance run (proofProblems). */
  expectSha256?: string;
  policy?: PolicyOptions;
  timeoutMs?: number;
  runner?: ProverRunner;
}): Promise<ContainmentProof> {
  const run = opts.runner ?? execProver;
  const timeoutMs = opts.timeoutMs ?? 30_000;
  const policyOpts: PolicyOptions = opts.policy ?? {};
  const bytes = readFileSync(opts.proverPath);
  const binarySha256 = sha256(bytes);
  if (opts.expectSha256 && opts.expectSha256.toLowerCase() !== binarySha256) {
    throw new Error(
      `openshell-prover at ${opts.proverPath} has sha256 ${binarySha256}, expected ${opts.expectSha256}`,
    );
  }
  const proof: ContainmentProof = {
    ok: true,
    prover: { version: null, binarySha256, pinned: !!opts.expectSha256, schemaVersion: null },
    steps: [],
  };
  const dir = mkdtempSync(join(tmpdir(), 'aegis-prove-'));
  try {
    const exe = join(dir, 'openshell-prover');
    writeFileSync(exe, bytes, { mode: 0o700, flag: 'wx' });
    for (const step of [...opts.steps, STOP_TEST_STEP]) {
      const candidate = stepPolicy(step, policyOpts);
      const boundary = stepBoundary(step, policyOpts);
      const cPath = join(dir, `${step.id}.candidate.json`);
      const bPath = join(dir, `${step.id}.boundary.json`);
      writeFileSync(cPath, JSON.stringify(candidate), { mode: 0o600, flag: 'wx' });
      writeFileSync(bPath, JSON.stringify(boundary), { mode: 0o600, flag: 'wx' });
      const out = await run(
        opts.runner ? opts.proverPath : exe,
        ['check', cPath, '--boundary', bPath, '-o', 'json', '--timeout', '10s'],
        timeoutMs,
      );
      const entry: StepProof = {
        step: step.id,
        criticality: step.criticality,
        result: 'error',
        reasonCode: null,
        reason: null,
        counterexample: null,
        candidateDigest: sha256(canonicalJSON(candidate)),
        boundaryDigest: sha256(canonicalJSON(boundary)),
      };
      try {
        const env = JSON.parse(out.stdout) as Record<string, unknown>;
        const inputs = (env.inputs ?? {}) as Record<string, unknown>;
        const domains = ((env.coverage ?? {}) as { domains?: unknown }).domains;
        const problems: string[] = [];
        if (typeof env.result !== 'string' || !RESULTS.has(env.result)) {
          problems.push(`unrecognised result ${JSON.stringify(env.result)}`);
        }
        if (env.schema_version !== 1) problems.push(`schema_version ${String(env.schema_version)}`);
        if (env.check !== 'boundary') problems.push(`check ${String(env.check)}`);
        if (inputs.candidate !== cPath || inputs.boundary !== bPath) {
          problems.push('envelope names other input files');
        }
        if (env.exit_code !== out.code) {
          problems.push(`prover exit ${out.code} disagrees with envelope ${String(env.exit_code)}`);
        }
        if (env.result === 'within_boundary') {
          if (out.code !== 0) problems.push(`within_boundary with exit ${out.code}`);
          if (env.counterexample !== null && env.counterexample !== undefined)
            problems.push('within_boundary with a counterexample');
          const covered = Array.isArray(domains) ? domains : [];
          const missing = REQUIRED_DOMAINS.filter((d) => !covered.includes(d));
          if (missing.length) problems.push(`coverage lacks ${missing.join(', ')}`);
        } else if (out.code === 0) {
          problems.push(`exit 0 with result ${String(env.result)}`);
        }
        entry.reasonCode = typeof env.reason_code === 'string' ? cap(env.reason_code, 100) : null;
        entry.reason = cap(typeof env.reason === 'string' ? env.reason : null);
        const cx =
          env.counterexample === null || env.counterexample === undefined
            ? null
            : JSON.stringify(env.counterexample);
        entry.counterexample =
          cx === null ? null : cx.length <= 2000 ? env.counterexample : { sha256: sha256(cx) };
        proof.prover.version ??=
          typeof env.prover_version === 'string' ? cap(env.prover_version, 64) : null;
        proof.prover.schemaVersion ??=
          typeof env.schema_version === 'number' ? env.schema_version : null;
        if (problems.length) {
          entry.result = 'error';
          entry.reason = cap(problems.join('; '));
        } else {
          entry.result = env.result as StepProof['result'];
        }
      } catch {
        entry.reason = `prover gave no JSON (exit ${out.code})`;
      }
      if (entry.result !== 'within_boundary') proof.ok = false;
      proof.steps.push(entry);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  return proof;
}

/**
 * Re-derive the verdict instead of trusting `proof.ok`: every scope step and
 * the stop-test agent must be present exactly once, each within its boundary,
 * and (for an acceptance run) the prover must have been pinned.
 */
export function proofProblems(
  proof: ContainmentProof,
  stepIds: readonly string[],
  opts: { requirePinned?: boolean } = {},
): string[] {
  const problems: string[] = [];
  if (stepIds.includes(STOP_TEST_STEP.id)) {
    problems.push(`scope step id "${STOP_TEST_STEP.id}" is reserved for the stop-test agent`);
  }
  const expected = [...stepIds, STOP_TEST_STEP.id].sort();
  const got = (proof.steps ?? []).map((s) => s.step).sort();
  if (canonicalJSON(expected) !== canonicalJSON(got)) {
    problems.push(`proof covers [${got.join(', ')}], expected [${expected.join(', ')}]`);
  }
  for (const s of proof.steps ?? []) {
    if (s.result !== 'within_boundary') problems.push(`${s.step}: ${s.result}`);
  }
  if (opts.requirePinned && !proof.prover?.pinned) {
    problems.push('prover binary not pinned (--expect-prover-sha256)');
  }
  return problems;
}
