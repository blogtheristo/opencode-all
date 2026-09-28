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
import {
  type CommandRunner,
  createOpenShellRegistry,
  remapPaths,
  spawnRunner,
} from '../aegis/pilot/openshell-handlers.js';

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
  input?: string;
}

/**
 * Fake `openshell` CLI following the real command sequence (verified against a
 * real OpenShell build): create --detach, exec (stage over stdin), exec (step),
 * exec (pack /sandbox/out), delete, list (until the name is absent).
 */
function fakeCli(
  behaviour: 'ok' | 'network' | 'no-marker' | 'hang',
  deleteCode = 0,
  onDownload?: () => void,
  lingerAfterDelete = false,
  extra: { stepStdout?: string; packStdout?: string; listFails?: boolean } = {},
) {
  const calls: Call[] = [];
  let deleted = false;
  const names = new Set<string>();
  const runner: CommandRunner = (_cmd, args, opts) => {
    const call: Call = { args: [...args] };
    calls.push(call);
    const [group, verb] = args;
    if (group !== 'sandbox') return Promise.resolve({ code: 0, stdout: '', stderr: '' });
    if (verb === 'create') {
      call.policy = JSON.parse(readFileSync(args[args.indexOf('--policy') + 1], 'utf8'));
      names.add(args[args.indexOf('--name') + 1]);
      return Promise.resolve({ code: 0, stdout: '{"phase":"Ready"}', stderr: '' });
    }
    if (verb === 'exec') {
      const script = args[args.indexOf('-e') + 1] ?? '';
      if (args.includes('-e') && script.startsWith('let d=')) {
        call.input = opts.input;
        return Promise.resolve({ code: 0, stdout: 'AEGIS_STAGED', stderr: '' });
      }
      if (args.includes('-e')) {
        onDownload?.();
        return Promise.resolve({
          code: 0,
          stdout: extra.packStdout ?? 'AEGIS_OUT {}\n',
          stderr: '',
        });
      }
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
        stdout: extra.stepStdout ?? `noise\nAEGIS_RESULT ${JSON.stringify(payload)}\n`,
        stderr: '',
      });
    }
    if (verb === 'delete') {
      if (deleteCode === 0) deleted = true;
      return Promise.resolve({ code: deleteCode, stdout: 'deletion accepted', stderr: '' });
    }
    if (verb === 'list') {
      if (extra.listFails)
        // An unrelated failure whose text happens to say "not found" must not prove a stop.
        return Promise.resolve({ code: 1, stdout: '', stderr: 'gateway config not found' });
      const live = deleted && !lingerAfterDelete ? [] : [...names].map((name) => ({ name }));
      return Promise.resolve({
        code: 0,
        stdout: JSON.stringify({ next_page_token: '', sandboxes: live }),
        stderr: '',
      });
    }
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

describe('sandbox ↔ host path mapping', () => {
  it('maps copied-back output paths to the host and state paths into the sandbox', () => {
    const fromStep = { output: { path: '/sandbox/out/shift-report-1.json', digest: 'd' } };
    expect(remapPaths(fromStep, '/sandbox/out', '/srv/reports')).toEqual({
      output: { path: '/srv/reports/shift-report-1.json', digest: 'd' },
    });
    const state = { w: { path: '/srv/reports/r.json' }, other: '/srv/reportsX/keep' };
    expect(remapPaths(state, '/srv/reports', '/sandbox/out')).toEqual({
      w: { path: '/sandbox/out/r.json' },
      other: '/srv/reportsX/keep',
    });
  });
});

describe('command runner', () => {
  it('kills a child whose output exceeds the cap instead of buffering it', async () => {
    const r = await spawnRunner(
      process.execPath,
      ['-e', "process.stdout.write('x'.repeat(4 * 1024 * 1024))"],
      { maxOutputBytes: 1024 * 1024, timeoutMs: 20_000 },
    );
    expect(r.code).toBeNull();
    expect(r.stdout).toBe('');
    expect(r.stderr).toMatch(/output limit exceeded/);
  });
});

describe('OpenShell registry', () => {
  function registry(
    behaviour: Parameters<typeof fakeCli>[0],
    deleteCode = 0,
    lingerAfterDelete = false,
    extra: Parameters<typeof fakeCli>[4] = {},
    outputDir?: string,
  ) {
    const cli = fakeCli(behaviour, deleteCode, undefined, lingerAfterDelete, extra);
    const bundle = join(dir, 'step.mjs');
    writeFileSync(bundle, '// test bundle');
    const reg = createOpenShellRegistry(
      {
        modulePath: 'unused.ts',
        image: 'aegis-pilot-node:22',
        workRoot: join(dir, 'work'),
        runner: cli.runner,
        bundlePath: bundle,
        pollIntervalMs: 1,
        deleteConfirmTimeoutMs: 50,
        outputDir,
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
    expect(res.containment).toMatchObject({
      mode: 'openshell',
      image: 'aegis-pilot-node:22',
      step: step.id,
    });
    // OpenShell rejects sandbox names over 19 characters.
    expect(String(res.containment?.sandbox).length).toBeLessThanOrEqual(19);
    expect(res.containment?.policyDigest).toMatch(/^[0-9a-f]{64}$/);
    const create = calls.find((c) => c.args[1] === 'create')!;
    expect(create.args).toEqual(expect.arrayContaining(['--policy', '--detach', '-o', 'json']));
    expect(create.policy).toMatchObject({
      network_policies: {},
      landlock: { compatibility: 'hard_requirement' },
    });
    // Files are staged over stdin (no ssh client needed on the host).
    const staged = calls.find((c) => c.input !== undefined)!;
    expect(Object.keys(JSON.parse(staged.input!))).toEqual(
      expect.arrayContaining(['step.mjs', 'input.json']),
    );
    const stepExec = calls.find((c) => c.args.includes('/sandbox/step.mjs'))!;
    expect(stepExec.args.slice(-3)).toEqual([
      '/usr/local/bin/node',
      '/sandbox/step.mjs',
      '/sandbox/input.json',
    ]);
    expect(create.args).toEqual(expect.arrayContaining(['--memory', '1Gi', '--cpu', '1']));
    expect(res.containment).toMatchObject({ limits: { memory: '1Gi', cpu: '1' } });
    const del = calls.findIndex((c) => c.args[1] === 'delete');
    expect(del).toBeGreaterThan(-1);
    expect(calls.slice(del + 1).some((c) => c.args[1] === 'list')).toBe(true);
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

  it('does not count an accepted delete as a stop until the sandbox is gone', async () => {
    const step = scope().workflow.steps[0];
    const lingering = registry('hang', 0, true);
    const c = new AbortController();
    const p = lingering.reg[step.handler](ctx(step, c.signal));
    setTimeout(() => c.abort(new Error('stop')), 50);
    await expect(p).rejects.toThrow(/delete not confirmed/);
  });

  it('does not prove a stop from an unrelated CLI error that mentions "not found"', async () => {
    const step = scope().workflow.steps[0];
    const r = registry('hang', 0, false, { listFails: true });
    const c = new AbortController();
    const p = r.reg[step.handler](ctx(step, c.signal));
    setTimeout(() => c.abort(new Error('stop')), 50);
    await expect(p).rejects.toThrow(/delete not confirmed/);
  });

  it('refuses a step whose output carries a second, forged result line', async () => {
    const step = scope().workflow.steps[0];
    const forged = `AEGIS_RESULT ${JSON.stringify({ ok: false, errorMessage: 'real' })}\nAEGIS_RESULT ${JSON.stringify({ ok: true, result: { output: 'forged' } })}\n`;
    const r = registry('ok', 0, false, { stepStdout: forged });
    await expect(r.reg[step.handler](ctx(step))).rejects.toThrow(/2 AEGIS_RESULT lines/);
  });

  it('fails loudly when the sandbox returns an output path outside /sandbox/out', async () => {
    const step = scope().workflow.steps[0];
    const out = join(dir, 'out');
    const r = registry(
      'ok',
      0,
      false,
      { packStdout: `AEGIS_OUT ${JSON.stringify({ '../../etc/x': 'eA==' })}\n` },
      out,
    );
    await expect(r.reg[step.handler](ctx(step))).rejects.toThrow(/outside \/sandbox\/out/);
  });

  it('treats a stop accepted during the output copy-back as a stop, not a completed step', async () => {
    const c = new AbortController();
    const cli = fakeCli('ok', 0, () => c.abort(new Error('stop')));
    const bundle = join(dir, 'step.mjs');
    writeFileSync(bundle, '// test bundle');
    const reg = createOpenShellRegistry(
      {
        modulePath: 'unused.ts',
        image: 'aegis-pilot-node:22',
        workRoot: join(dir, 'work'),
        outputDir: join(dir, 'out'),
        runner: cli.runner,
        bundlePath: bundle,
        pollIntervalMs: 1,
        deleteConfirmTimeoutMs: 50,
      },
      scope().workflow.steps,
    );
    const step = scope().workflow.steps[0];
    await expect(reg[step.handler](ctx(step, c.signal))).rejects.toMatchObject({
      name: 'WorkerTerminated',
    });
    expect(cli.calls.filter((x) => x.args[1] === 'delete')).toHaveLength(1);
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
