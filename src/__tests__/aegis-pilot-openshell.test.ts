// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
// Audit trail: git log -- src/__tests__/aegis-pilot-openshell.test.ts
/**
 * C4 containment — the OpenShell driver against a fake CLI. The real-binary
 * run is the isolated rehearsal with --isolation openshell (runbook §8, done spec).
 */

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
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
  confirmSandboxGone,
  createOpenShellRegistry,
  openShellStopTestAgent,
  remapPaths,
  sandboxName,
  spawnRunner,
  verifyOutputTree,
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
  extra: {
    stepStdout?: string;
    stepCode?: number;
    packStdout?: string;
    listFails?: boolean;
  } = {},
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
        code: extra.stepCode ?? 0,
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
        endpoints: [{ host: 'archive.example.eu', port: 443 }],
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

  it('refuses loopback, metadata and private-network endpoints', () => {
    const sync = scope().workflow.steps.find((s) => s.id === 'sync-report')!;
    for (const host of ['localhost', '127.0.0.1', '169.254.169.254', '10.0.0.5', 'gw.internal']) {
      expect(() =>
        stepPolicy(sync, { endpointsByStep: { 'sync-report': [{ host, port: 443 }] } }),
      ).toThrow(/invalid endpoint/);
    }
  });

  it('refuses alternate spellings of internal addresses and reserved ranges', () => {
    const sync = scope().workflow.steps.find((s) => s.id === 'sync-report')!;
    const internal = [
      '0177.0.0.1', // octal loopback
      '0x7f.0.0.1', // hex loopback
      '127.1', // shortened loopback
      '2130706433', // integer loopback
      '0xa9fea9fe', // integer-hex metadata
      '0xA9.0xFE.0xA9.0xFE', // hex metadata
      '010.0.0.1', // leading zero
      '192.0.0.8',
      '198.18.0.1',
      '224.0.0.1',
      '1.2.3.300',
    ];
    for (const host of internal)
      expect(
        () => stepPolicy(sync, { endpointsByStep: { 'sync-report': [{ host, port: 443 }] } }),
        host,
      ).toThrow(/invalid endpoint/);
    for (const host of ['archive.example.eu', '93.184.216.34'])
      expect(() =>
        stepPolicy(sync, { endpointsByStep: { 'sync-report': [{ host, port: 443 }] } }),
      ).not.toThrow();
  });
});

describe('sandbox absence proof', () => {
  it('needs two consecutive complete listings without the sandbox', async () => {
    let n = 0;
    const seen: boolean[] = [true, false, true, false, false];
    const runner: CommandRunner = () => {
      const listed = seen[Math.min(n++, seen.length - 1)];
      return Promise.resolve({
        code: 0,
        stdout: JSON.stringify({ sandboxes: listed ? [{ name: 'as-x' }] : [] }),
        stderr: '',
      });
    };
    expect(await confirmSandboxGone(runner, 'openshell', 'as-x', 1000, 1)).toBe(true);
    expect(n).toBe(5); // a single absent page (the 2nd) was not taken as proof
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

describe('proof that a sandbox is gone', () => {
  const paged =
    (secondPage: string[]): CommandRunner =>
    (_c, args) =>
      Promise.resolve({
        code: 0,
        stderr: '',
        stdout: args.includes('--page-token')
          ? JSON.stringify({ sandboxes: secondPage.map((name) => ({ name })), next_page_token: '' })
          : JSON.stringify({ sandboxes: [{ name: 'other' }], next_page_token: 'p2' }),
      });
  it('reads every page before declaring a sandbox gone', async () => {
    expect(await confirmSandboxGone(paged(['as-target']), 'openshell', 'as-target', 30, 1)).toBe(
      false,
    );
    expect(await confirmSandboxGone(paged([]), 'openshell', 'as-target', 30, 1)).toBe(true);
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
    const cli = fakeCli('ok', 0, () => c.abort(new Error('stop')), false, {
      packStdout: `AEGIS_OUT ${JSON.stringify({ 'late.txt': Buffer.from('written after the stop').toString('base64') })}\n`,
    });
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
    expect(existsSync(join(dir, 'out', 'late.txt'))).toBe(false);
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

describe('OpenShell driver: the sandbox is untrusted', () => {
  const step = () => scope().workflow.steps[0];
  const b64 = (t: string) => Buffer.from(t).toString('base64');
  const okLine = (result: unknown) => `AEGIS_RESULT ${JSON.stringify({ ok: true, result })}\n`;
  const outLine = (files: Record<string, string>) => `AEGIS_OUT ${JSON.stringify(files)}\n`;

  function withCli(
    extra: Parameters<typeof fakeCli>[4],
    opts: Record<string, unknown> = {},
    behaviour: Parameters<typeof fakeCli>[0] = 'ok',
  ) {
    const cli = fakeCli(behaviour, 0, undefined, false, extra);
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
        ...opts,
      },
      scope().workflow.steps,
    );
    return { reg, ...cli };
  }

  it('walks the copy-back without following links and refuses anything but regular files', () => {
    const tree = join(dir, 'tree');
    mkdirSync(join(tree, 'sub'), { recursive: true });
    writeFileSync(join(tree, 'sub', 'report.md'), 'fine');
    expect(verifyOutputTree(tree, { maxFiles: 10, maxBytes: 1024 })).toEqual({
      files: 1,
      bytes: 4,
    });
    symlinkSync('/etc/passwd', join(tree, 'leak'));
    expect(() => verifyOutputTree(tree, { maxFiles: 10, maxBytes: 1024 })).toThrow(
      /not a regular file/,
    );
  });

  it('rejects the whole copy-back on one bad entry and leaves the host output directory untouched', async () => {
    const { reg } = withCli({
      packStdout: outLine({ 'report.md': b64('fine'), '../../etc/x': b64('x') }),
    });
    await expect(reg[step().handler](ctx(step()))).rejects.toThrow(/outside \/sandbox\/out/);
    expect(existsSync(join(dir, 'out', 'report.md'))).toBe(false);
  });

  it('rejects oversized output and too many files', async () => {
    const big = withCli(
      { packStdout: outLine({ big: b64('x'.repeat(2048)) }) },
      { maxOutputBytes: 1024 },
    );
    await expect(big.reg[step().handler](ctx(step()))).rejects.toThrow(/exceeds/);
    const many = withCli(
      { packStdout: outLine({ a: b64('1'), b: b64('2'), c: b64('3') }) },
      { maxOutputFiles: 2 },
    );
    await expect(many.reg[step().handler](ctx(step()))).rejects.toThrow(/exceeds 2 files/);
    expect(existsSync(join(dir, 'out', 'a'))).toBe(false);
  });

  it('rejects a copy-back that is not a file map', async () => {
    const { reg } = withCli({ packStdout: `AEGIS_OUT ${JSON.stringify({ a: { nested: 1 } })}\n` });
    await expect(reg[step().handler](ctx(step()))).rejects.toThrow(/not a file map/);
  });

  it('does not promote the files of a step that reported failure', async () => {
    const { reg } = withCli({
      stepStdout: `AEGIS_RESULT ${JSON.stringify({ ok: false, errorMessage: 'step failed' })}\n`,
      packStdout: outLine({ 'poisoned.md': b64('from a failed step') }),
    });
    await expect(reg[step().handler](ctx(step()))).rejects.toThrow(/step failed/);
    expect(existsSync(join(dir, 'out', 'poisoned.md'))).toBe(false);
  });

  it('promotes verified output into the host directory', async () => {
    const { reg } = withCli({ packStdout: outLine({ 'sub/report.md': b64('handover') }) });
    await reg[step().handler](ctx(step()));
    expect(readFileSync(join(dir, 'out', 'sub', 'report.md'), 'utf8')).toBe('handover');
  });

  it('does not let the sandbox forge containment evidence or malformed fields', async () => {
    const forged = withCli({
      stepStdout: okLine({ output: 1, containment: { mode: 'forged' }, extra: 'dropped' }),
    });
    const res = await forged.reg[step().handler](ctx(step()));
    expect(res.containment).toMatchObject({ mode: 'openshell' });
    expect(res).not.toHaveProperty('extra');

    const bad = withCli({ stepStdout: okLine({ output: 1, confidence: 7 }) });
    await expect(bad.reg[step().handler](ctx(step()))).rejects.toThrow(/result rejected/);
  });

  it('does not accept a success claim from a process that exited non-zero', async () => {
    const { reg } = withCli({ stepStdout: okLine({ output: 1 }), stepCode: 1 });
    await expect(reg[step().handler](ctx(step()))).rejects.toThrow(/exited 1/);
  });

  it('refuses input paths outside /sandbox and inputs that are not regular files', async () => {
    const host = join(dir, 'in.txt');
    writeFileSync(host, 'data');
    const escape = withCli({}, { inputs: { '../etc/passwd': host } });
    await expect(escape.reg[step().handler](ctx(step()))).rejects.toThrow(/invalid sandbox input/);
    const abs = withCli({}, { inputs: { '/etc/passwd': host } });
    await expect(abs.reg[step().handler](ctx(step()))).rejects.toThrow(/invalid sandbox input/);
    const link = join(dir, 'link.txt');
    symlinkSync(host, link);
    const linked = withCli({}, { inputs: { 'in.txt': link } });
    await expect(linked.reg[step().handler](ctx(step()))).rejects.toThrow(/not a regular file/);
    const fine = withCli({}, { inputs: { 'data/in.txt': host } });
    await fine.reg[step().handler](ctx(step()));
    const staged = fine.calls.find((c) => c.input !== undefined)!;
    expect(Object.keys(JSON.parse(staged.input!))).toContain('data/in.txt');
  });

  it('always deletes the sandbox after a failed step and confirms it gone', async () => {
    const { reg, calls } = withCli({}, {}, 'no-marker');
    await expect(reg[step().handler](ctx(step()))).rejects.toThrow(/no AEGIS_RESULT/);
    const del = calls.findIndex((c) => c.args[1] === 'delete');
    expect(del).toBeGreaterThan(-1);
    expect(calls.slice(del + 1).some((c) => c.args[1] === 'list')).toBe(true);
  });

  it('proves a stop during provisioning only after the create client has exited', async () => {
    const order: string[] = [];
    let deletes = 0;
    let exists = false;
    const runner: CommandRunner = (_cmd, args, opts) => {
      order.push(args[1]);
      if (args[1] === 'create')
        return new Promise((r) => {
          const done = () => {
            if (!order.includes('create-exited')) order.push('create-exited');
            r({ code: null, stdout: '', stderr: 'killed' });
          };
          opts.onSpawn?.(done);
        });
      if (args[1] === 'delete') {
        exists = false;
        return Promise.resolve(
          ++deletes === 1
            ? { code: 1, stdout: '', stderr: 'sandbox not found' }
            : { code: 0, stdout: '', stderr: '' },
        );
      }
      if (args[1] === 'list')
        return Promise.resolve({
          code: 0,
          stdout: JSON.stringify({ sandboxes: exists ? [{ name: 'x' }] : [] }),
          stderr: '',
        });
      return Promise.resolve({ code: 0, stdout: '', stderr: '' });
    };
    const bundle = join(dir, 'step.mjs');
    writeFileSync(bundle, '// test bundle');
    const reg = createOpenShellRegistry(
      {
        modulePath: 'unused.ts',
        image: 'aegis-pilot-node:22',
        workRoot: join(dir, 'work'),
        runner,
        bundlePath: bundle,
        pollIntervalMs: 1,
        deleteConfirmTimeoutMs: 50,
      },
      scope().workflow.steps,
    );
    const c = new AbortController();
    const p = reg[step().handler](ctx(step(), c.signal));
    setTimeout(() => c.abort(new Error('stop')), 20);
    await expect(p).rejects.toMatchObject({ name: 'WorkerTerminated' });
    expect(order.indexOf('create-exited')).toBeLessThan(order.lastIndexOf('delete'));
    expect(order.at(-1)).toBe('list');
  });

  it('keeps sandbox names random and within the gateway limit, and refuses unsafe step ids', async () => {
    const a = sandboxName();
    const b = sandboxName();
    expect(a).not.toBe(b);
    expect(a.length).toBeLessThanOrEqual(19);
    const { reg } = withCli({});
    const s = { ...step(), id: '../x' };
    await expect(reg[s.handler](ctx(s))).rejects.toThrow(/unsafe step id/);
  });
});

describe('OpenShell stop-test agent', () => {
  it('streams ticks, stays attached until release, and proves the stop from the listing', async () => {
    let emit: ((s: string) => void) | undefined;
    let killed = false;
    let deleted = false;
    const calls: string[][] = [];
    const runner: CommandRunner = (_cmd, args, opts) => {
      calls.push([...args]);
      if (args[1] === 'create')
        return Promise.resolve({ code: 0, stdout: '{"phase":"Ready"}', stderr: '' });
      if (args[1] === 'exec')
        return new Promise((r) => {
          emit = opts.onStdout;
          opts.onSpawn?.(() => {
            killed = true;
            r({ code: null, stdout: '', stderr: '' });
          });
        });
      if (args[1] === 'delete') {
        deleted = true;
        return Promise.resolve({ code: 0, stdout: '', stderr: '' });
      }
      if (args[1] === 'list') {
        const name = calls.find((c) => c[1] === 'create')![3];
        return Promise.resolve({
          code: 0,
          stdout: JSON.stringify({ sandboxes: deleted ? [] : [{ name }] }),
          stderr: '',
        });
      }
      return Promise.resolve({ code: 0, stdout: '', stderr: '' });
    };
    const agent = openShellStopTestAgent(
      {
        image: 'i',
        workRoot: join(dir, 'w'),
        runner,
        pollIntervalMs: 1,
        deleteConfirmTimeoutMs: 50,
      },
      10,
    );
    let ticks = 0;
    await agent.start(() => ticks++);
    const exec = calls.find((c) => c[1] === 'exec')!;
    expect(exec.at(-1)).toBe('10'); // the interval is an argument, not interpolated code
    emit?.('AEGIS_TICK 0\nAEGIS_TI');
    emit?.('CK 1\n');
    expect(ticks).toBe(2);
    const t = await agent.terminate();
    expect(t.confirmed).toBe(true);
    expect(await agent.terminate()).toBe(t);
    expect(calls.filter((c) => c[1] === 'delete')).toHaveLength(1);
    expect(killed).toBe(false);
    agent.release?.();
    expect(killed).toBe(true);
  });

  it('does not prove the stop while the sandbox is still listed', async () => {
    let name = '';
    const runner: CommandRunner = (_cmd, args) => {
      if (args[1] === 'create') name = args[3];
      if (args[1] === 'exec') return new Promise(() => undefined);
      if (args[1] === 'list')
        return Promise.resolve({
          code: 0,
          stdout: JSON.stringify({ sandboxes: [{ name }] }),
          stderr: '',
        });
      return Promise.resolve({ code: 0, stdout: '', stderr: '' });
    };
    const agent = openShellStopTestAgent(
      {
        image: 'i',
        workRoot: join(dir, 'w'),
        runner,
        pollIntervalMs: 1,
        deleteConfirmTimeoutMs: 30,
      },
      10,
    );
    await agent.start(() => undefined);
    expect((await agent.terminate()).confirmed).toBe(false);
    agent.release?.();
  });
});
