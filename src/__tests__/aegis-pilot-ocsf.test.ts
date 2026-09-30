// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
// Audit trail: git log -- src/__tests__/aegis-pilot-ocsf.test.ts
/**
 * C4 remainder — OpenShell OCSF security events into the Article 12 ledger.
 * The gateway shorthand (`openshell logs <sandbox> --source sandbox`) is
 * parsed into counts, digests and deny events; raw payloads never reach the
 * ledger. Line shape from the readiness plan §5.2 C4 source facts
 * (`[ts] [sandbox] [OCSF ] [ocsf] NET:OPEN …`); to be re-verified against a
 * live gateway in the M4 session.
 */

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  EvidenceLedger,
  KillAuthority,
  type PilotScope,
  runWorkflow,
  SiteAuthority,
  statePaths,
  validateScope,
} from '../aegis/pilot/index.js';
import { type CommandRunner, createOpenShellRegistry } from '../aegis/pilot/openshell-handlers.js';
import { collectOcsf, OCSF_MAX_DENIES, parseOcsfShorthand } from '../aegis/pilot/openshell-ocsf.js';

const LOG = [
  '[2026-10-01T08:00:00.100Z] [sandbox] [OCSF ] [ocsf] PROC:LAUNCH node /sandbox/step.mjs',
  '[2026-10-01T08:00:00.200Z] [sandbox] [INFO ] [supervisor] policy loaded',
  '[2026-10-01T08:00:00.300Z] [sandbox] [OCSF ] [ocsf] NET:OPEN archive.example.eu:443 DENIED by policy secret=hunter2',
  '[2026-10-01T08:00:00.400Z] [sandbox] [OCSF ] [ocsf] FS:WRITE /sandbox/out/r.json',
  '[2026-10-01T08:00:00.500Z] [sandbox] [OCSF ] [ocsf] NET:OPEN 10.0.0.5:22 blocked',
].join('\n');

describe('OCSF shorthand parsing', () => {
  it('counts events by class, keeps deny events, and digests instead of storing payloads', () => {
    const s = parseOcsfShorthand(LOG);
    expect(s.events).toBe(4);
    expect(s.byClass).toEqual({ 'PROC:LAUNCH': 1, 'NET:OPEN': 2, 'FS:WRITE': 1 });
    expect(s.denied).toBe(2);
    expect(s.denies).toHaveLength(2);
    expect(s.denies[0]).toEqual({
      ts: '2026-10-01T08:00:00.300Z',
      class: 'NET:OPEN',
      lineDigest: expect.stringMatching(/^[0-9a-f]{64}$/),
    });
    expect(s.digest).toMatch(/^[0-9a-f]{64}$/);
    // No raw payload anywhere in the summary.
    const text = JSON.stringify(s);
    expect(text).not.toContain('hunter2');
    expect(text).not.toContain('archive.example.eu');
  });

  it('ignores non-OCSF lines and forged class tokens, and caps the deny list', () => {
    const many = Array.from(
      { length: OCSF_MAX_DENIES + 5 },
      (_, i) => `[t${i}] [sandbox] [OCSF ] [ocsf] NET:OPEN x DENIED`,
    );
    const s = parseOcsfShorthand(
      [...many, '[t] [sandbox] [OCSF ] [ocsf] net:open lower-case is not a class', 'garbage'].join(
        '\n',
      ),
    );
    expect(s.events).toBe(OCSF_MAX_DENIES + 5);
    expect(s.denied).toBe(OCSF_MAX_DENIES + 5);
    expect(s.denies).toHaveLength(OCSF_MAX_DENIES);
    expect(s.deniesTruncated).toBe(true);
  });

  it('gives the same digest for the same events and a different one when an event changes', () => {
    expect(parseOcsfShorthand(LOG).digest).toBe(parseOcsfShorthand(LOG).digest);
    expect(parseOcsfShorthand(LOG.replace('FS:WRITE', 'FS:READ')).digest).not.toBe(
      parseOcsfShorthand(LOG).digest,
    );
  });
});

describe('OCSF collection from the gateway', () => {
  it('reads the sandbox log with an argument array and reports a failed read loudly', async () => {
    const calls: string[][] = [];
    const ok: CommandRunner = (_c, args) => {
      calls.push([...args]);
      return Promise.resolve({ code: 0, stdout: LOG, stderr: '' });
    };
    const got = await collectOcsf(ok, 'openshell', 'as-abc');
    expect(calls[0]).toEqual(['logs', 'as-abc', '--source', 'sandbox']);
    expect(got).toMatchObject({ collected: true, summary: { events: 4, denied: 2 } });
    const failing: CommandRunner = () =>
      Promise.resolve({ code: 1, stdout: '', stderr: 'no such sandbox' });
    expect(await collectOcsf(failing, 'openshell', 'as-abc')).toMatchObject({
      collected: false,
      error: expect.stringMatching(/exit 1/),
    });
  });
});

describe('OCSF events reach the Article 12 ledger', () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'aegis-ocsf-'));
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  function scope(): PilotScope {
    const raw = JSON.parse(
      readFileSync(join(process.cwd(), 'config/aegis-pilot/reference-scope.json'), 'utf8'),
    );
    const v = validateScope(raw);
    if (!v.ok) throw new Error(v.errors.join('\n'));
    return v.scope;
  }

  function fakeGateway(stepPayload: unknown) {
    const names = new Set<string>();
    const order: string[] = [];
    const runner: CommandRunner = (_cmd, args, opts) => {
      const [group, verb] = args;
      order.push(group === 'logs' ? 'logs' : verb);
      if (group === 'logs') return Promise.resolve({ code: 0, stdout: LOG, stderr: '' });
      if (verb === 'create') {
        names.add(args[args.indexOf('--name') + 1]);
        return Promise.resolve({ code: 0, stdout: '{}', stderr: '' });
      }
      if (verb === 'delete') {
        names.delete(args[2]);
        return Promise.resolve({ code: 0, stdout: '', stderr: '' });
      }
      if (verb === 'list')
        return Promise.resolve({
          code: 0,
          stdout: JSON.stringify({ sandboxes: [...names].map((name) => ({ name })) }),
          stderr: '',
        });
      if (verb === 'exec') {
        if (opts.input !== undefined)
          return Promise.resolve({ code: 0, stdout: 'AEGIS_STAGED', stderr: '' });
        return Promise.resolve({
          code: 0,
          stdout: `AEGIS_RESULT ${JSON.stringify(stepPayload)}\n`,
          stderr: '',
        });
      }
      return Promise.resolve({ code: 0, stdout: '', stderr: '' });
    };
    return { runner, order };
  }

  async function run(stepPayload: unknown) {
    const stateDir = join(dir, 's');
    const site = SiteAuthority.init(stateDir, 'ocsf-site');
    const ledger = EvidenceLedger.open(statePaths(stateDir).ledger, {
      siteId: 'ocsf-site',
      orgId: 'org',
      signer: (h) => site.sign(h),
      publicKey: site.publicKey,
    });
    const s = scope();
    const agent = site.issue({
      kind: 'agent',
      subjectName: 'wf',
      capabilities: s.workflow.steps.map((x) => `step:${x.id}`),
      ttlHours: 1,
    });
    const gw = fakeGateway(stepPayload);
    const bundle = join(dir, 'step.mjs');
    writeFileSync(bundle, '// test bundle');
    const registry = createOpenShellRegistry(
      {
        modulePath: 'unused.ts',
        image: 'aegis-pilot-node:22',
        workRoot: join(dir, 'work'),
        runner: gw.runner,
        bundlePath: bundle,
        pollIntervalMs: 1,
        deleteConfirmTimeoutMs: 50,
        ocsf: true,
      },
      s.workflow.steps,
    );
    await runWorkflow({
      scope: s,
      registry,
      ledger,
      kill: new KillAuthority(stateDir, site.verifier(), ledger),
      verifier: site.verifier(),
      agent,
      uplinkDown: true,
      outboxPath: statePaths(stateDir).outbox,
      signOutbox: (p) => site.sign(p),
      traceId: 't-ocsf',
    });
    ledger.close();
    const events = readFileSync(statePaths(stateDir).ledger, 'utf8')
      .trim()
      .split('\n')
      .map((l) => JSON.parse(l));
    return { events, order: gw.order };
  }

  it('records the OCSF summary with each step decision, collected before the sandbox is deleted', async () => {
    const { events, order } = await run({ ok: true, result: { output: { ran: true } } });
    const decide = events.find((e) => e.event_type === 'agent.decide');
    expect(decide.detail.containment.ocsf).toMatchObject({
      collected: true,
      summary: { events: 4, denied: 2, byClass: { 'NET:OPEN': 2 } },
    });
    expect(order.indexOf('logs')).toBeLessThan(order.indexOf('delete'));
    expect(JSON.stringify(events)).not.toContain('hunter2');
  });

  it('records the deny events of a step that failed', async () => {
    const { events } = await run({ ok: false, errorMessage: 'step failed' });
    const incident = events.find(
      (e) => e.event_type === 'incident' && e.detail?.kind === 'step-failed',
    );
    expect(incident.detail.containment.ocsf.summary.denied).toBe(2);
  });
});
