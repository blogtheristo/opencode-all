// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- src/__tests__/aegis-pilot-prover.test.ts
/**
 * DWS-AEGIS-PILOT-001, plan item C4 — the sandbox policy proof. The promises:
 * every step's policy (and the stop-test agent's) is proven against a boundary
 * written independently of the generator; only `within_boundary` with exit 0
 * passes; everything else fails closed; an acceptance run refuses a failed
 * proof. The runner is faked here with the exact envelope shape of
 * openshell-prover-cli; the real binary is exercised by the done spec.
 */

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  type PilotStep,
  type ProverRunner,
  proveStepPolicies,
  runAcceptance,
  stepBoundary,
  stepPolicy,
  validateScope,
} from '../aegis/pilot/index.js';
import referenceScope from '../../config/aegis-pilot/reference-scope.json';

const EXIT: Record<string, number> = {
  within_boundary: 0,
  exceeds_boundary: 1,
  error: 2,
  unsupported: 3,
  inconclusive: 3,
};

function envelope(result: string, extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    schema_version: 1,
    prover_version: '0.0.0',
    check: 'boundary',
    result,
    exit_code: EXIT[result],
    counterexample: null,
    reason_code: null,
    reason: null,
    ...extra,
  });
}

let dir: string;
let prover: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'aegis-prover-'));
  prover = join(dir, 'openshell-prover');
  writeFileSync(prover, 'fake prover binary');
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

const steps = (
  validateScope(referenceScope).ok
    ? (validateScope(referenceScope) as { scope: { workflow: { steps: PilotStep[] } } }).scope
    : { workflow: { steps: [] as PilotStep[] } }
).workflow.steps;

function fake(verdict: (step: string) => string, calls: string[][] = []): ProverRunner {
  return async (_path, args) => {
    calls.push([...args]);
    const step = String(args[1]).split('/').pop()!.replace('.candidate.json', '');
    const r = verdict(step);
    return { code: EXIT[r], stdout: envelope(r), stderr: '' };
  };
}

describe('boundary', () => {
  it('never gives a core step a network rule, whatever endpoints are listed for it', () => {
    const core = steps.find((s) => s.criticality === 'core')!;
    const b = stepBoundary(core, { endpointsByStep: { [core.id]: [{ host: 'x.eu', port: 443 }] } });
    expect(b.network_policies).toEqual({});
    expect(b.landlock.compatibility).toBe('hard_requirement');
  });

  it('matches the generated policy for every reference step (no drift today)', () => {
    for (const s of steps) expect(stepPolicy(s)).toEqual(stepBoundary(s));
  });

  it('emits plain L4 endpoints (no L7 enforcement field) so the policy is provable', () => {
    const sync = steps.find((s) => s.criticality === 'non-core' && s.requiresNetwork)!;
    const p = stepPolicy(sync, { endpointsByStep: { [sync.id]: [{ host: 'a.eu', port: 443 }] } });
    expect(Object.values(p.network_policies)[0].endpoints).toEqual([{ host: 'a.eu', port: 443 }]);
  });
});

describe('proveStepPolicies', () => {
  it('proves every step plus the stop-test agent, passing arguments without a shell', async () => {
    const calls: string[][] = [];
    const proof = await proveStepPolicies({
      steps,
      proverPath: prover,
      runner: fake(() => 'within_boundary', calls),
    });
    expect(proof.ok).toBe(true);
    expect(proof.steps.map((s) => s.step)).toEqual([...steps.map((s) => s.id), 'stop-test']);
    expect(proof.prover).toMatchObject({ version: '0.0.0', schemaVersion: 1 });
    expect(proof.prover.binarySha256).toMatch(/^[0-9a-f]{64}$/);
    expect(calls[0].slice(0, 1)).toEqual(['check']);
    expect(calls[0]).toContain('--boundary');
  });

  it.each(['exceeds_boundary', 'unsupported', 'inconclusive', 'error'])(
    'fails closed on %s',
    async (bad) => {
      const proof = await proveStepPolicies({
        steps,
        proverPath: prover,
        runner: fake((s) => (s === 'stop-test' ? bad : 'within_boundary')),
      });
      expect(proof.ok).toBe(false);
      expect(proof.steps.at(-1)?.result).toBe(bad);
    },
  );

  it('fails closed when the exit code disagrees with the envelope', async () => {
    const proof = await proveStepPolicies({
      steps,
      proverPath: prover,
      runner: async () => ({ code: 1, stdout: envelope('within_boundary'), stderr: '' }),
    });
    expect(proof.ok).toBe(false);
    expect(proof.steps[0].result).toBe('error');
    expect(proof.steps[0].reason).toMatch(/disagrees/);
  });

  it('fails closed when the prover gives no JSON or an unknown result', async () => {
    const none = await proveStepPolicies({
      steps,
      proverPath: prover,
      runner: async () => ({ code: null, stdout: '', stderr: 'killed' }),
    });
    expect(none.ok).toBe(false);
    expect(none.steps[0].reason).toMatch(/no JSON/);
    const odd = await proveStepPolicies({
      steps,
      proverPath: prover,
      runner: async () => ({ code: 0, stdout: envelope('looks_fine'), stderr: '' }),
    });
    expect(odd.ok).toBe(false);
  });
});

describe('acceptance', () => {
  it('refuses an acceptance run whose sandbox policy proof failed', async () => {
    const proof = await proveStepPolicies({
      steps,
      proverPath: prover,
      runner: fake((s) => (s === 'stop-test' ? 'exceeds_boundary' : 'within_boundary')),
    });
    await expect(
      runAcceptance({
        stateDir: join(dir, 'state'),
        scope: (validateScope(referenceScope) as { scope: never }).scope,
        registry: {} as never,
        kind: 'acceptance',
        operator: { mode: 'await-operator', timeoutMs: 1000 },
        witness: 'Test Witness, QA, Lifetime Oy',
        containment: { mode: 'openshell', image: 'x', proof },
      }),
    ).rejects.toThrow(
      /proof failed for stop-test \(exceeds_boundary\).*refusing an acceptance run/,
    );
  });
});
