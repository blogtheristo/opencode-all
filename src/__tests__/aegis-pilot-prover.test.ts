// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- src/__tests__/aegis-pilot-prover.test.ts
/**
 * DWS-AEGIS-PILOT-001, plan item C4 — the sandbox policy proof. The promises:
 * every step's policy (and the stop-test agent's) is proven against a boundary
 * written independently of the generator; only a fully valid
 * `within_boundary` envelope passes; everything else fails closed; the
 * verdict is re-derived, never taken from `ok`; an acceptance run refuses a
 * missing, failed or unpinned proof; and a run whose sandboxes got a policy
 * other than the proven one is INVALID. The runner is faked with the exact
 * envelope of openshell-prover-cli; the real binary is exercised by the done spec.
 */

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CAP_AGENT_STOP,
  type ContainmentProof,
  createReferenceRegistry,
  generateEd25519,
  type HandlerRegistry,
  type PilotScope,
  privateKeyFromPem,
  proofProblems,
  type ProverRunner,
  proveStepPolicies,
  REQUIRED_DOMAINS,
  runAcceptance,
  SiteAuthority,
  stepBoundary,
  stepPolicy,
  validateScope,
} from '../aegis/pilot/index.js';
import { sha256 } from '../aegis/pilot/crypto.js';
import referenceScope from '../../config/aegis-pilot/reference-scope.json';

const EXIT: Record<string, number> = {
  within_boundary: 0,
  exceeds_boundary: 1,
  error: 2,
  unsupported: 3,
  inconclusive: 3,
};

function parsedScope(): PilotScope {
  const s = structuredClone(referenceScope) as Record<string, any>;
  s.acceptance.heartbeatMs = 100;
  s.acceptance.maxGapMs = 2000;
  s.acceptance.windowMinutes = 1;
  const v = validateScope(s);
  if (!v.ok) throw new Error(v.errors.join('\n'));
  return v.scope;
}
const scope = parsedScope();
const steps = scope.workflow.steps;
const stepIds = steps.map((s) => s.id);

/** A fake prover answering with the real envelope shape, echoing its inputs. */
function fake(
  verdict: (step: string) => string,
  tweak: (env: Record<string, unknown>) => void = () => {},
  calls: string[][] = [],
): ProverRunner {
  return async (_path, args) => {
    calls.push([...args]);
    const step = String(args[1]).split('/').pop()!.replace('.candidate.json', '');
    const result = verdict(step);
    const env: Record<string, unknown> = {
      schema_version: 1,
      prover_version: '0.0.0',
      check: 'boundary',
      coverage: { domains: [...REQUIRED_DOMAINS] },
      result,
      exit_code: EXIT[result],
      inputs: { candidate: args[1], boundary: args[3] },
      counterexample: result === 'exceeds_boundary' ? { domain: 'network' } : null,
      reason_code: null,
      reason: null,
    };
    tweak(env);
    return { code: env.exit_code as number, stdout: JSON.stringify(env), stderr: '' };
  };
}

let dir: string;
let prover: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'aegis-prover-'));
  prover = join(dir, 'openshell-prover');
  writeFileSync(prover, 'fake prover binary');
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

const prove = (runner: ProverRunner, extra: { expectSha256?: string } = {}) =>
  proveStepPolicies({ steps, proverPath: prover, runner, ...extra });

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
    const proof = await prove(fake(() => 'within_boundary', undefined, calls));
    expect(proof.ok).toBe(true);
    expect(proof.steps.map((s) => s.step)).toEqual([...stepIds, 'stop-test']);
    expect(proof.prover).toMatchObject({ version: '0.0.0', schemaVersion: 1, pinned: false });
    expect(calls[0][0]).toBe('check');
    expect(calls[0]).toContain('--boundary');
    expect(proofProblems(proof, stepIds)).toEqual([]);
  });

  it('pins the binary: a wrong expected hash refuses, the right one marks the proof pinned', async () => {
    await expect(
      prove(
        fake(() => 'within_boundary'),
        { expectSha256: '0'.repeat(64) },
      ),
    ).rejects.toThrow(/expected 0000/);
    const hash = sha256(Buffer.from('fake prover binary'));
    const proof = await prove(
      fake(() => 'within_boundary'),
      { expectSha256: hash },
    );
    expect(proof.prover.pinned).toBe(true);
    expect(proof.prover.binarySha256).toBe(hash);
  });

  it.each(['exceeds_boundary', 'unsupported', 'inconclusive', 'error'])(
    'fails closed on %s',
    async (bad) => {
      const proof = await prove(fake((s) => (s === 'stop-test' ? bad : 'within_boundary')));
      expect(proof.ok).toBe(false);
      expect(proof.steps.at(-1)?.result).toBe(bad);
    },
  );

  it.each([
    ['exit code disagrees', (e: Record<string, unknown>) => (e.exit_code = 1)],
    ['another check', (e: Record<string, unknown>) => (e.check = 'other')],
    [
      'other input files',
      (e: Record<string, unknown>) => (e.inputs = { candidate: '/x', boundary: '/y' }),
    ],
    [
      'a domain not covered',
      (e: Record<string, unknown>) => (e.coverage = { domains: ['filesystem'] }),
    ],
    [
      'a counterexample',
      (e: Record<string, unknown>) => (e.counterexample = { domain: 'network' }),
    ],
    ['another schema', (e: Record<string, unknown>) => (e.schema_version = 2)],
    ['an unknown result', (e: Record<string, unknown>) => (e.result = 'looks_fine')],
  ])('rejects a within_boundary envelope with %s', async (_name, tweak) => {
    const proof = await prove(fake(() => 'within_boundary', tweak));
    expect(proof.ok).toBe(false);
    expect(proof.steps[0].result).toBe('error');
  });

  it('fails closed when the prover gives no JSON', async () => {
    const proof = await prove(async () => ({ code: null, stdout: '', stderr: 'killed' }));
    expect(proof.ok).toBe(false);
    expect(proof.steps[0].reason).toMatch(/no JSON/);
  });
});

describe('proofProblems (the verdict is re-derived, never taken from ok)', () => {
  it('rejects a forged proof that claims ok with no steps', () => {
    const forged: ContainmentProof = {
      ok: true,
      prover: { version: '0.0.0', binarySha256: 'x', pinned: true, schemaVersion: 1 },
      steps: [],
    };
    expect(proofProblems(forged, stepIds).join(' ')).toMatch(/proof covers \[\]/);
  });

  it('rejects a proof missing a step, a failed step, and an unpinned prover for acceptance', async () => {
    const proof = await prove(fake(() => 'within_boundary'));
    const missing = { ...proof, steps: proof.steps.slice(1) };
    expect(proofProblems(missing, stepIds).join(' ')).toMatch(/expected/);
    const failed = {
      ...proof,
      steps: proof.steps.map((s, i) => (i ? s : { ...s, result: 'exceeds_boundary' as const })),
    };
    expect(proofProblems(failed, stepIds).join(' ')).toMatch(/exceeds_boundary/);
    expect(proofProblems(proof, stepIds, { requirePinned: true }).join(' ')).toMatch(/not pinned/);
  });

  it('reserves the stop-test id', async () => {
    const proof = await prove(fake(() => 'within_boundary'));
    expect(proofProblems(proof, [...stepIds, 'stop-test']).join(' ')).toMatch(/reserved/);
  });
});

describe('acceptance', () => {
  const acceptance = (containment: Parameters<typeof runAcceptance>[0]['containment']) =>
    runAcceptance({
      stateDir: join(dir, 'state'),
      scope,
      registry: {} as HandlerRegistry,
      kind: 'acceptance',
      operator: { mode: 'await-operator', timeoutMs: 1000 },
      witness: 'Test Witness, QA, Lifetime Oy',
      containment,
    });

  it('refuses a failed proof', async () => {
    const proof = await prove(
      fake((s) => (s === 'stop-test' ? 'exceeds_boundary' : 'within_boundary')),
    );
    await expect(acceptance({ mode: 'openshell', image: 'x', proof })).rejects.toThrow(
      /stop-test: exceeds_boundary.*refusing an acceptance run/,
    );
  });

  it('refuses a missing proof and an unpinned prover under OpenShell', async () => {
    await expect(acceptance({ mode: 'openshell', image: 'x' })).rejects.toThrow(
      /no sandbox policy proof/,
    );
    const unpinned = await prove(fake(() => 'within_boundary'));
    await expect(acceptance({ mode: 'openshell', image: 'x', proof: unpinned })).rejects.toThrow(
      /not pinned/,
    );
  });

  it('marks a run INVALID when a sandbox got a policy other than the proven one', async () => {
    const state = join(dir, 'rehearsal');
    const site = SiteAuthority.init(state, scope.site.siteId);
    const kp = generateEd25519();
    const credential = site.issue({
      kind: 'operator',
      subjectName: 'Shift operator',
      capabilities: [CAP_AGENT_STOP],
      subjectPublicKeyPem: kp.publicKeyPem,
      ttlHours: 1,
    });
    const proof = await prove(fake(() => 'within_boundary'));
    const reference = createReferenceRegistry({
      readingsPath: join(process.cwd(), 'config/aegis-pilot/sample-readings.json'),
      reportDir: join(state, 'reports'),
      syncUrl: 'none',
    });
    // Mimic the OpenShell runtime: each result carries the digest of the policy it got.
    const withDigest = (digestFor: (step: string) => string): HandlerRegistry =>
      Object.fromEntries(
        Object.entries(reference).map(([key, handler]) => [
          key,
          Object.assign(async (ctx: Parameters<typeof handler>[0]) => {
            const res = await handler(ctx);
            return {
              ...res,
              containment: {
                mode: 'openshell',
                step: ctx.step.id,
                policyDigest: digestFor(ctx.step.id),
              },
            };
          }, handler),
        ]),
      );
    const run = (registry: HandlerRegistry) =>
      runAcceptance({
        stateDir: state,
        scope,
        registry,
        kind: 'rehearsal',
        stopMode: 'cooperative',
        operator: { mode: 'automated', credential, key: privateKeyFromPem(kp.privateKeyPem) },
        connector: async () => ({ outcome: 'unreachable', code: 'ENETUNREACH' }),
        env: {} as NodeJS.ProcessEnv,
        probeIntervalMs: 200,
        containment: { mode: 'openshell', image: 'x', proof },
      });
    const proven = new Map(proof.steps.map((p) => [p.step, p.candidateDigest]));

    const honest = await run(withDigest((s) => proven.get(s)!));
    expect(honest.record.outcome).not.toBe('INVALID');
    expect(honest.record.containment.proof?.steps).toHaveLength(stepIds.length + 1);

    const drifted = await run(
      withDigest((s) => (s === stepIds[0] ? 'f'.repeat(64) : proven.get(s)!)),
    );
    expect(drifted.record.outcome).toBe('INVALID');
    expect(drifted.record.findings.join(' ')).toMatch(
      /differs from the proven policy for: read-readings/,
    );
  });
});
