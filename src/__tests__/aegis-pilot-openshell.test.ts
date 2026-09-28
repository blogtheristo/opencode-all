// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/__tests__/aegis-pilot-openshell.test.ts
/**
 * C4 containment — the OpenShell driver against a fake CLI. The real-binary
 * run is the isolated rehearsal with --isolation openshell (runbook §8, done spec).
 */

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CAP_AGENT_STOP,
  createStopCommand,
  EvidenceLedger,
  generateEd25519,
  KillAuthority,
  type PilotScope,
  privateKeyFromPem,
  runWorkflow,
  SiteAuthority,
  statePaths,
  validateScope,
} from '../aegis/pilot/index.js';
import { stepPolicy } from '../aegis/pilot/openshell-policy.js';
import { type CommandRunner, createOpenShellRegistry } from '../aegis/pilot/openshell-handlers.js';

const referenceScope = JSON.parse(
  readFileSync(join(process.cwd(), 'config/aegis-pilot/reference-scope.json'), 'utf8'),
);

function scope(): PilotScope {
  const v = validateScope(referenceScope);
  if (!v.ok) throw new Error(v.errors.join('\n'));
  return v.scope;
}

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'aegis-openshell-'));
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

interface Call {
  args: string[];
  policy?: unknown;
}

/** Fake `openshell` CLI: records calls; create answers per `behaviour`. */
function fakeCli(behaviour: 'ok' | 'network' | 'no-marker' | 'hang', deleteCode = 0) {
  const calls: Call[] = [];
  const runner: CommandRunner = (_cmd, args, opts) => {
    const call: Call = { args: [...args] };
    calls.push(call);
    if (args[0] === 'sandbox' && args[1] === 'create') {
      call.policy = JSON.parse(readFileSync(args[args.indexOf('--policy') + 1], 'utf8'));
      if (behaviour === 'hang') {
        return new Promise((resolve) =>
          opts.onSpawn?.(() => resolve({ code: null, stdout: '', stderr: 'killed' })),
        );
      }
      if (behaviour === 'no-marker')
        return Promise.resolve({ code: 1, stdout: '', stderr: 'landlock unavailable' });
      const payload =
        behaviour === 'network'
          ? { ok: false, errorName: 'NetworkUnavailable', errorMessage: 'egress denied by policy' }
          : { ok: true, result: { output: { ran: true }, decision: 'ran in sandbox' } };
      return Promise.resolve({
        code: 0,
        stdout: `noise\nAEGIS_RESULT ${JSON.stringify(payload)}\n`,
        stderr: '',
      });
    }
    if (args[0] === 'sandbox' && args[1] === 'delete')
      return Promise.resolve({ code: deleteCode, stdout: '', stderr: '' });
    return Promise.resolve({ code: 0, stdout: '', stderr: '' });
  };
  return { calls, runner };
}

function ctx(step: PilotScope['workflow']['steps'][number], signal = new AbortController().signal) {
  return { signal, traceId: 't', step, state: {}, uplinkDown: true };
}

describe('OpenShell policy from the signed scope', () => {
  it('gives core steps no network and fails closed without Landlock', () => {
    const core = scope().workflow.steps[0];
    const p = stepPolicy(core, {
      endpointsByStep: { [core.id]: [{ host: 'evil.example', port: 443 }] },
    });
    expect(p.network_policies).toEqual({});
    expect(p.landlock.compatibility).toBe('hard_requirement');
    expect(p.filesystem_policy.read_write).toEqual(['/sandbox', '/tmp', '/dev/null']);
  });

  it('lets a non-core network step reach only its listed endpoints, only from node', () => {
    const sync = scope().workflow.steps.find((s) => s.id === 'sync-report')!;
    const p = stepPolicy(sync, {
      endpointsByStep: { 'sync-report': [{ host: 'archive.example.eu', port: 443 }] },
    });
    expect(Object.values(p.network_policies)).toEqual([
      {
        name: 'aegis-sync-report',
        endpoints: [{ host: 'archive.example.eu', port: 443, enforcement: 'enforce' }],
        binaries: [{ path: '/usr/local/bin/node' }],
      },
    ]);
    expect(stepPolicy(sync).network_policies).toEqual({});
  });

  it('rejects malformed endpoints', () => {
    const sync = scope().workflow.steps.find((s) => s.id === 'sync-report')!;
    expect(() =>
      stepPolicy(sync, { endpointsByStep: { 'sync-report': [{ host: 'a b;rm -rf', port: 443 }] } }),
    ).toThrow(/invalid endpoint/);
  });
});

describe('OpenShell registry', () => {
  function registry(behaviour: Parameters<typeof fakeCli>[0], deleteCode = 0) {
    const cli = fakeCli(behaviour, deleteCode);
    const bundle = join(dir, 'step.mjs');
    writeFileSync(bundle, '// test bundle');
    const reg = createOpenShellRegistry(
      {
        modulePath: 'unused.ts',
        image: 'aegis-pilot-node:22',
        workRoot: join(dir, 'work'),
        runner: cli.runner,
        bundlePath: bundle,
      },
      scope().workflow.steps,
    );
    return { reg, ...cli };
  }

  it('runs a step in a named sandbox under the generated policy and returns containment evidence', async () => {
    const { reg, calls } = registry('ok');
    const step = scope().workflow.steps[0];
    const res = await reg[step.handler](ctx(step));
    expect(res.output).toEqual({ ran: true });
    expect(res.containment).toMatchObject({ mode: 'openshell', image: 'aegis-pilot-node:22' });
    expect(res.containment?.policyDigest).toMatch(/^[0-9a-f]{64}$/);
    const create = calls.find((c) => c.args[1] === 'create')!;
    expect(create.args).toContain('--policy');
    expect(create.args.slice(-4)).toEqual(
      ['node', '/sandbox/step.mjs', '/sandbox/input.json'].reduce<string[]>(
        (a, x) => [...a, x],
        ['--'],
      ),
    );
    expect(create.policy).toMatchObject({
      network_policies: {},
      landlock: { compatibility: 'hard_requirement' },
    });
    expect(calls.at(-1)!.args.slice(0, 2)).toEqual(['sandbox', 'delete']);
  });

  it('carries NetworkUnavailable out of the sandbox so a non-core step is deferred', async () => {
    const { reg } = registry('network');
    const sync = scope().workflow.steps.find((s) => s.id === 'sync-report')!;
    await expect(reg[sync.handler](ctx(sync))).rejects.toMatchObject({
      name: 'NetworkUnavailable',
    });
  });

  it('fails loudly, with the CLI stderr, when the sandbox gives no result', async () => {
    const { reg } = registry('no-marker');
    const step = scope().workflow.steps[0];
    await expect(reg[step.handler](ctx(step))).rejects.toThrow(
      /no AEGIS_RESULT.*landlock unavailable/,
    );
  });

  it('proves an operator stop only when the sandbox delete succeeds', async () => {
    const step = scope().workflow.steps[0];
    const ok = registry('hang');
    const c1 = new AbortController();
    const p1 = ok.reg[step.handler](ctx(step, c1.signal));
    setTimeout(() => c1.abort(new Error('stop')), 50);
    await expect(p1).rejects.toMatchObject({ name: 'WorkerTerminated' });
    expect(ok.calls.filter((c) => c.args[1] === 'delete')).toHaveLength(1);

    const failing = registry('hang', 1);
    const c2 = new AbortController();
    const p2 = failing.reg[step.handler](ctx(step, c2.signal));
    setTimeout(() => c2.abort(new Error('stop')), 50);
    await expect(p2).rejects.toThrow(/delete not confirmed/);
  });

  it('records the sandbox stop as system.agent_terminated in the Article 12 ledger', async () => {
    const stateDir = join(dir, 'state');
    const site = SiteAuthority.init(stateDir, 'reference-site');
    const ledger = EvidenceLedger.open(statePaths(stateDir).ledger, {
      siteId: 'reference-site',
      orgId: 'o',
      signer: (h) => site.sign(h),
      publicKey: site.publicKey,
    });
    const kill = new KillAuthority(stateDir, site.verifier(), ledger);
    const s = scope();
    const agent = site.issue({
      kind: 'agent',
      subjectName: 'wf',
      capabilities: s.workflow.steps.map((x) => `step:${x.id}`),
      ttlHours: 1,
    });
    const kp = generateEd25519();
    const op = site.issue({
      kind: 'operator',
      subjectName: 'op',
      capabilities: [CAP_AGENT_STOP],
      subjectPublicKeyPem: kp.publicKeyPem,
      ttlHours: 1,
    });
    const { reg } = registry('hang');
    setTimeout(
      () =>
        kill.execute(
          createStopCommand({
            target: agent.subjectId,
            reason: 'test',
            operatorCredential: op,
            operatorKey: privateKeyFromPem(kp.privateKeyPem),
          }),
          't',
        ),
      80,
    );
    const result = await runWorkflow({
      scope: s,
      registry: reg,
      ledger,
      kill,
      verifier: site.verifier(),
      agent,
      uplinkDown: true,
      outboxPath: statePaths(stateDir).outbox,
      signOutbox: (p) => site.sign(p),
      traceId: 't',
    }).finally(() => ledger.close());
    expect(result.status).toBe('stopped');
    const events = readFileSync(statePaths(stateDir).ledger, 'utf8')
      .trim()
      .split('\n')
      .map((l) => JSON.parse(l));
    expect(events.find((e) => e.event_type === 'system.agent_terminated')?.detail).toMatchObject({
      stop_mode: 'hard',
    });
  });
});
