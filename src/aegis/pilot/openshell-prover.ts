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
  prover: { version: string | null; binarySha256: string; schemaVersion: number | null };
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

/**
 * Prove every step's generated policy (and the stop-test agent's) against its
 * boundary. Never throws for a failed proof: the caller decides, and the
 * record carries the verdict either way.
 */
export async function proveStepPolicies(opts: {
  steps: readonly PilotStep[];
  proverPath: string;
  endpointsByStep?: Readonly<Record<string, readonly NetworkEndpoint[]>>;
  nodeBinary?: string;
  timeoutMs?: number;
  runner?: ProverRunner;
}): Promise<ContainmentProof> {
  const run = opts.runner ?? execProver;
  const timeoutMs = opts.timeoutMs ?? 30_000;
  const dir = mkdtempSync(join(tmpdir(), 'aegis-prove-'));
  const proof: ContainmentProof = {
    ok: true,
    prover: {
      version: null,
      binarySha256: sha256(readFileSync(opts.proverPath)),
      schemaVersion: null,
    },
    steps: [],
  };
  try {
    for (const step of [...opts.steps, STOP_TEST_STEP]) {
      const policyOpts = { endpointsByStep: opts.endpointsByStep, nodeBinary: opts.nodeBinary };
      const candidate = stepPolicy(step, policyOpts);
      const boundary = stepBoundary(step, policyOpts);
      const cPath = join(dir, `${step.id}.candidate.json`);
      const bPath = join(dir, `${step.id}.boundary.json`);
      writeFileSync(cPath, JSON.stringify(candidate), { mode: 0o600 });
      writeFileSync(bPath, JSON.stringify(boundary), { mode: 0o600 });
      const out = await run(
        opts.proverPath,
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
        if (typeof env.result === 'string' && RESULTS.has(env.result)) {
          entry.result = env.result as StepProof['result'];
        } else {
          entry.reason = `unrecognised prover result ${JSON.stringify(env.result)}`;
        }
        entry.reasonCode = typeof env.reason_code === 'string' ? env.reason_code : null;
        entry.reason ??= typeof env.reason === 'string' ? env.reason : null;
        entry.counterexample = env.counterexample ?? null;
        proof.prover.version ??= typeof env.prover_version === 'string' ? env.prover_version : null;
        proof.prover.schemaVersion ??=
          typeof env.schema_version === 'number' ? env.schema_version : null;
        // The process exit code must match the envelope, and 0 only for within_boundary.
        if (
          env.exit_code !== out.code ||
          (entry.result === 'within_boundary') !== (out.code === 0)
        ) {
          entry.reason = `prover exit ${out.code} disagrees with result ${entry.result}`;
          entry.result = 'error';
        }
      } catch {
        entry.reason = `prover gave no JSON (exit ${out.code}): ${out.stderr.slice(0, 300)}`;
      }
      if (entry.result !== 'within_boundary') proof.ok = false;
      proof.steps.push(entry);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  return proof;
}
