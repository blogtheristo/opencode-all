// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/__tests__/aegis-pilot.test.ts
/**
 * DWS-AEGIS-PILOT-001 — tests state the pilot's promises, not the code's shape:
 * identity, evidence and kill authority resolve locally; a broken record is
 * detected; the acceptance verdict is PASS only when all three conditions
 * hold and the site was provably isolated.
 */

import {
  appendFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { type AddressInfo, createServer, type Server } from 'node:net';
import type { Worker } from 'node:worker_threads';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CAP_AGENT_STOP,
  type Connector,
  createIsolatedRegistry,
  createReferenceRegistry,
  createStopCommand,
  type Credential,
  evaluateLimits,
  EvidenceLedger,
  generateEd25519,
  KillAuthority,
  NetworkUnavailable,
  type PilotScope,
  privateKeyFromPem,
  probeUplink,
  readOutbox,
  reconcileOutbox,
  runAcceptance,
  runWorkflow,
  SiteAuthority,
  statePaths,
  submitStopCommand,
  terminateBounded,
  validateScope,
  verifyAcceptanceRecord,
  verifyLedger,
} from '../aegis/pilot/index.js';
import { signPayload } from '../aegis/pilot/crypto.js';

const referenceScopeJson = JSON.parse(
  readFileSync(join(process.cwd(), 'config/aegis-pilot/reference-scope.json'), 'utf8'),
);
const readingsPath = join(process.cwd(), 'config/aegis-pilot/sample-readings.json');

function scopeWith(patch: (s: Record<string, any>) => void = () => {}): Record<string, any> {
  const s = structuredClone(referenceScopeJson);
  s.acceptance.heartbeatMs = 100;
  s.acceptance.maxGapMs = 2000;
  s.acceptance.windowMinutes = 1;
  patch(s);
  return s;
}

function parsedScope(patch?: (s: Record<string, any>) => void): PilotScope {
  const v = validateScope(scopeWith(patch));
  if (!v.ok) throw new Error(v.errors.join('\n'));
  return v.scope;
}

const isolated: Connector = async () => ({ outcome: 'unreachable', code: 'ENETUNREACH' });
const online: Connector = async () => ({ outcome: 'connected' });
const noProxyEnv = {} as NodeJS.ProcessEnv;

let dir: string;
let site: SiteAuthority;

function operator(s = site): { credential: Credential; key: ReturnType<typeof privateKeyFromPem> } {
  const kp = generateEd25519();
  const credential = s.issue({
    kind: 'operator',
    subjectName: 'Shift operator',
    capabilities: [CAP_AGENT_STOP],
    subjectPublicKeyPem: kp.publicKeyPem,
    ttlHours: 1,
  });
  return { credential, key: privateKeyFromPem(kp.privateKeyPem) };
}

function openLedger(): EvidenceLedger {
  return EvidenceLedger.open(statePaths(dir).ledger, {
    siteId: site.manifest.siteId,
    orgId: 'lifetime-oy',
    signer: (h) => site.sign(h),
    publicKey: site.publicKey,
  });
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'aegis-pilot-test-'));
  site = SiteAuthority.init(dir, 'reference-site');
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

// ─── Phase 0 scope ───────────────────────────────────────────────────────────

describe('Phase 0 scope', () => {
  it('accepts the reference scope and warns that it is unsigned and host-level', () => {
    const v = validateScope(referenceScopeJson);
    expect(v.ok).toBe(true);
    if (v.ok) {
      expect(v.warnings.join(' ')).toMatch(/not signed off/);
      expect(v.warnings.join(' ')).toMatch(/weakest isolation method/);
    }
  });

  it('rejects a core step that needs the network — the Phase 2 fail condition, caught at scoping', () => {
    const v = validateScope(scopeWith((s) => (s.workflow.steps[0].requiresNetwork = true)));
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.errors.join(' ')).toMatch(/core step "read-readings" requires the network/);
  });

  it('rejects a workflow with no core step and one without a completion state', () => {
    const noCore = validateScope(
      scopeWith((s) => s.workflow.steps.forEach((st: any) => (st.criticality = 'non-core'))),
    );
    expect(noCore.ok).toBe(false);
    const noCompletion = validateScope(scopeWith((s) => delete s.workflow.completionState));
    expect(noCompletion.ok).toBe(false);
  });

  it('requires every deferrable step to have a reconciliation position', () => {
    const v = validateScope(scopeWith((s) => (s.reconciliationOrder = [])));
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.errors.join(' ')).toMatch(/missing: \[sync-report\]/);
  });

  it('rejects a gap tolerance tighter than two heartbeats', () => {
    const v = validateScope(scopeWith((s) => (s.acceptance.maxGapMs = 150)));
    expect(v.ok).toBe(false);
  });
});

// ─── Local identity ──────────────────────────────────────────────────────────

describe('local identity', () => {
  it('verifies an agent credential against the site manifest alone', () => {
    const cred = site.issue({
      kind: 'agent',
      subjectName: 'a',
      capabilities: ['step:x'],
      ttlHours: 1,
    });
    expect(site.verifier().check(cred, new Date(), 'step:x')).toEqual({ ok: true });
  });

  it('rejects a credential whose capabilities were edited after issue', () => {
    const cred = site.issue({
      kind: 'agent',
      subjectName: 'a',
      capabilities: ['step:x'],
      ttlHours: 1,
    });
    const forged = { ...cred, capabilities: ['step:x', 'step:y'] };
    expect(site.verifier().check(forged, new Date(), 'step:y')).toMatchObject({
      ok: false,
      reason: /signature invalid/,
    });
  });

  it('rejects expired, revoked, foreign and under-privileged credentials', () => {
    const v = site.verifier();
    const cred = site.issue({
      kind: 'agent',
      subjectName: 'a',
      capabilities: ['step:x'],
      ttlHours: 1,
    });
    expect(v.check(cred, new Date(Date.now() + 2 * 3_600_000))).toMatchObject({
      reason: 'credential expired',
    });
    expect(v.check(cred, new Date(), 'step:y')).toMatchObject({ reason: /not granted/ });

    const other = SiteAuthority.init(mkdtempSync(join(tmpdir(), 'aegis-other-')), 'reference-site');
    const foreign = other.issue({
      kind: 'agent',
      subjectName: 'b',
      capabilities: ['step:x'],
      ttlHours: 1,
    });
    expect(v.check(foreign)).toMatchObject({ ok: false, reason: /issuer key/ });
    rmSync(other.stateDir, { recursive: true, force: true });

    site.revoke(cred.credentialId);
    expect(v.check(cred)).toMatchObject({ reason: 'credential revoked' });
  });

  it('never grants kill authority to an agent', () => {
    expect(() =>
      site.issue({ kind: 'agent', subjectName: 'a', capabilities: [CAP_AGENT_STOP], ttlHours: 1 }),
    ).toThrow(/operator-only/);
  });

  it('refuses to overwrite an existing site authority', () => {
    expect(() => SiteAuthority.init(dir, 'reference-site')).toThrow(/refusing to overwrite/);
  });
});

// ─── Evidence ledger ─────────────────────────────────────────────────────────

describe('Article 12 evidence ledger', () => {
  it('writes a signed, hash-chained record that verifies', () => {
    const ledger = openLedger();
    ledger.append({ event_type: 'agent.decide', trace_id: 't', input_digest: 'a'.repeat(64) });
    ledger.close();
    const v = verifyLedger(statePaths(dir).ledger, { publicKey: site.publicKey });
    expect(v).toMatchObject({ valid: true, count: 2, unsigned: 0 });
  });

  it('detects an edited event and names its sequence number', () => {
    const ledger = openLedger();
    ledger.append({
      event_type: 'agent.decide',
      trace_id: 't',
      detail: { decision: 'open valve' },
    });
    ledger.append({
      event_type: 'agent.decide',
      trace_id: 't',
      detail: { decision: 'close valve' },
    });
    ledger.close();
    const path = statePaths(dir).ledger;
    writeFileSync(path, readFileSync(path, 'utf8').replace('open valve', 'hold valve'));
    expect(verifyLedger(path)).toMatchObject({ valid: false, brokenAtSeq: 1 });
  });

  it('detects a deleted event', () => {
    const ledger = openLedger();
    for (let i = 0; i < 3; i++) ledger.append({ event_type: 'agent.decide', trace_id: 't' });
    ledger.close();
    const path = statePaths(dir).ledger;
    const lines = readFileSync(path, 'utf8').split('\n');
    lines.splice(2, 1);
    writeFileSync(path, lines.join('\n'));
    expect(verifyLedger(path).valid).toBe(false);
  });

  it('detects a fully re-hashed forgery through the site signature', () => {
    // A forger with write access can recompute every hash; only the site key can sign them.
    const forgerSite = SiteAuthority.init(
      mkdtempSync(join(tmpdir(), 'aegis-forger-')),
      'reference-site',
    );
    const forged = EvidenceLedger.open(join(dir, 'forged.jsonl'), {
      siteId: 'reference-site',
      orgId: 'lifetime-oy',
      signer: (h) => forgerSite.sign(h),
    });
    forged.append({ event_type: 'agent.decide', trace_id: 't' });
    forged.close();
    rmSync(forgerSite.stateDir, { recursive: true, force: true });
    expect(verifyLedger(join(dir, 'forged.jsonl')).valid).toBe(true);
    expect(verifyLedger(join(dir, 'forged.jsonl'), { publicKey: site.publicKey })).toMatchObject({
      valid: false,
      reason: 'site signature invalid',
    });
  });

  it('refuses to append to a broken chain', () => {
    const ledger = openLedger();
    ledger.append({ event_type: 'agent.decide', trace_id: 't', detail: { n: 1 } });
    ledger.close();
    const path = statePaths(dir).ledger;
    writeFileSync(path, readFileSync(path, 'utf8').replace('"n":1', '"n":2'));
    expect(() => openLedger()).toThrow(/Refusing to append to a broken chain/);
  });

  it('refuses a torn tail by default and repairs it as a recorded incident on request', () => {
    openLedger().close();
    const path = statePaths(dir).ledger;
    appendFileSync(path, '{"seq":1,"event_id":"partial');
    expect(() => openLedger()).toThrow(/torn line/);
    const ledger = EvidenceLedger.open(path, {
      siteId: 'reference-site',
      orgId: 'lifetime-oy',
      signer: (h) => site.sign(h),
      repairTornTail: true,
    });
    ledger.close();
    const events = readFileSync(path, 'utf8')
      .trim()
      .split('\n')
      .map((l) => JSON.parse(l));
    expect(events.at(-1)).toMatchObject({
      event_type: 'incident',
      detail: { kind: 'torn-tail-repaired' },
    });
    expect(verifyLedger(path, { publicKey: site.publicKey }).valid).toBe(true);
  });

  it('refuses on open a ledger rewritten without signatures when the site key is known (security review, high)', () => {
    const unsigned = EvidenceLedger.open(statePaths(dir).ledger, {
      siteId: 'reference-site',
      orgId: 'o',
    });
    unsigned.append({ event_type: 'agent.decide', trace_id: 't' });
    unsigned.close();
    expect(() => openLedger()).toThrow(/unsigned event/);
  });

  it('allows one writer at a time', () => {
    const ledger = openLedger();
    expect(() => openLedger()).toThrow(/already open/);
    ledger.close();
    openLedger().close();
  });

  it('reports intervals longer than maxGapMs inside the window', () => {
    let t = Date.parse('2026-09-28T06:00:00Z');
    const ledger = EvidenceLedger.open(statePaths(dir).ledger, {
      siteId: 'reference-site',
      orgId: 'o',
      now: () => new Date(t),
    });
    t += 500;
    ledger.append({ event_type: 'system.heartbeat', trace_id: 't' });
    t += 7000;
    ledger.append({ event_type: 'system.heartbeat', trace_id: 't' });
    ledger.close();
    const v = verifyLedger(statePaths(dir).ledger, { maxGapMs: 2000 });
    expect(v.gaps).toEqual([{ afterSeq: 1, gapMs: 7000 }]);
  });
});

// ─── Kill authority ──────────────────────────────────────────────────────────

describe('local kill authority', () => {
  function setup() {
    const ledger = openLedger();
    const kill = new KillAuthority(dir, site.verifier(), ledger);
    const agent = site.issue({
      kind: 'agent',
      subjectName: 'a',
      capabilities: ['step:x'],
      ttlHours: 1,
    });
    const { signal } = kill.register(agent);
    return { ledger, kill, agent, signal };
  }

  it('stops the target agent on a signed operator command and records the operator (Art. 14(5))', () => {
    const { ledger, kill, agent, signal } = setup();
    const op = operator();
    submitStopCommand(
      dir,
      createStopCommand({
        target: agent.subjectId,
        reason: 'test',
        operatorCredential: op.credential,
        operatorKey: op.key,
      }),
    );
    const [outcome] = kill.drainInbox('t');
    ledger.close();
    expect(outcome).toMatchObject({ accepted: true, stoppedAgents: [agent.subjectId] });
    expect(signal.aborted).toBe(true);
    const events = readFileSync(statePaths(dir).ledger, 'utf8')
      .trim()
      .split('\n')
      .map((l) => JSON.parse(l));
    expect(events.at(-1)).toMatchObject({
      event_type: 'human.override',
      operator_id: op.credential.subjectId,
    });
  });

  it('rejects a command signed by a key other than the one bound in the credential', () => {
    const { ledger, kill, agent, signal } = setup();
    const op = operator();
    const genuine = createStopCommand({
      target: agent.subjectId,
      reason: 'x',
      operatorCredential: op.credential,
      operatorKey: op.key,
    });
    const { signature: _sig, ...body } = genuine;
    const impostorKey = privateKeyFromPem(generateEd25519().privateKeyPem);
    const forged = { ...body, signature: signPayload(body, impostorKey) };
    expect(kill.execute(forged, 't')).toMatchObject({
      accepted: false,
      reason: /does not match operator key/,
    });
    ledger.close();
    expect(signal.aborted).toBe(false);
  });

  it('rejects stale commands, replays, revoked operators and agent credentials', () => {
    const { ledger, kill, agent, signal } = setup();
    const op = operator();
    const stale = createStopCommand(
      {
        target: agent.subjectId,
        reason: 'x',
        operatorCredential: op.credential,
        operatorKey: op.key,
      },
      new Date(Date.now() - 11 * 60_000),
    );
    expect(kill.execute(stale, 't')).toMatchObject({ accepted: false, reason: /expired/ });

    const fresh = createStopCommand({
      target: 'nobody',
      reason: 'x',
      operatorCredential: op.credential,
      operatorKey: op.key,
    });
    expect(kill.execute(fresh, 't').accepted).toBe(true);
    expect(kill.execute(fresh, 't')).toMatchObject({ accepted: false, reason: /replay/ });

    const agentAsOperator = {
      ...fresh,
      commandId: crypto.randomUUID(),
      operatorCredentialId: agent.credentialId,
    };
    expect(kill.execute(agentAsOperator, 't').accepted).toBe(false);

    site.revoke(op.credential.credentialId);
    const afterRevoke = createStopCommand({
      target: agent.subjectId,
      reason: 'x',
      operatorCredential: op.credential,
      operatorKey: op.key,
    });
    expect(kill.execute(afterRevoke, 't')).toMatchObject({ accepted: false, reason: /revoked/ });
    ledger.close();
    expect(signal.aborted).toBe(false);
  });

  it('does not let a forged command burn a genuine command id', () => {
    const { ledger, kill, agent, signal } = setup();
    const op = operator();
    const genuine = createStopCommand({
      target: agent.subjectId,
      reason: 'x',
      operatorCredential: op.credential,
      operatorKey: op.key,
    });
    expect(kill.execute({ ...genuine, reason: 'tampered' }, 't').accepted).toBe(false);
    expect(kill.execute(genuine, 't').accepted).toBe(true);
    ledger.close();
    expect(signal.aborted).toBe(true);
  });
});

// ─── Uplink probe ────────────────────────────────────────────────────────────

describe('uplink probe', () => {
  let server: Server;
  let port: number;
  beforeEach(async () => {
    server = createServer((s) => s.destroy());
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    port = (server.address() as { port: number }).port;
  });
  afterEach(() => new Promise<void>((r) => server.close(() => r())));

  it('treats a successful connection as not isolated', async () => {
    const r = await probeUplink([{ host: '127.0.0.1', port }], { env: noProxyEnv });
    expect(r.isolated).toBe(false);
    expect(r.results[0].outcome).toBe('connected');
  });

  it('treats a refused connection as a live path unless the target opts in', async () => {
    await new Promise<void>((r) => server.close(() => r()));
    const refused = await probeUplink([{ host: '127.0.0.1', port }], { env: noProxyEnv });
    expect(refused.results[0].outcome).toBe('refused');
    expect(refused.isolated).toBe(false);
    const optIn = await probeUplink([{ host: '127.0.0.1', port, rejectCountsAsBlocked: true }], {
      env: noProxyEnv,
    });
    expect(optIn.isolated).toBe(true);
    server = createServer();
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  });

  it('adds the configured proxy as a target and records only variable names', async () => {
    const r = await probeUplink([{ host: 'example.invalid', port: 443 }], {
      connector: isolated,
      env: { HTTPS_PROXY: 'http://user:secret@10.0.0.1:3128' } as NodeJS.ProcessEnv,
    });
    expect(r.results.map((x) => `${x.target.host}:${x.target.port}`)).toContain('10.0.0.1:3128');
    expect(r.proxyEnv).toEqual(['HTTPS_PROXY']);
    expect(JSON.stringify(r)).not.toContain('secret');
  });

  it('fails closed on a proxy that refuses, even on loopback (a refusal is not proof of no path)', async () => {
    const closed = createServer();
    await new Promise<void>((r) => closed.listen(0, '127.0.0.1', r));
    const port = (closed.address() as AddressInfo).port;
    await new Promise<void>((r) => closed.close(() => r()));
    const down = await probeUplink([], {
      env: { HTTPS_PROXY: `http://127.0.0.1:${port}` } as NodeJS.ProcessEnv,
    });
    expect(down.results[0].outcome).toBe('refused');
    expect(down.isolated).toBe(false);
  });
});

// ─── Workflow runner ─────────────────────────────────────────────────────────

describe('workflow runner', () => {
  const registry = () =>
    createReferenceRegistry({ readingsPath, reportDir: join(dir, 'reports'), syncUrl: 'none' });

  function run(scope: PilotScope, reg = registry(), agentCaps?: string[]) {
    const ledger = openLedger();
    const kill = new KillAuthority(dir, site.verifier(), ledger);
    const agent = site.issue({
      kind: 'agent',
      subjectName: 'wf',
      capabilities: agentCaps ?? scope.workflow.steps.map((s) => `step:${s.id}`),
      ttlHours: 1,
    });
    return runWorkflow({
      scope,
      registry: reg,
      ledger,
      kill,
      verifier: site.verifier(),
      agent,
      uplinkDown: true,
      outboxPath: statePaths(dir).outbox,
      signOutbox: (p) => site.sign(p),
      traceId: 't',
    }).finally(() => ledger.close());
  }

  it('completes the core outcome with the uplink down and defers the network step', async () => {
    const result = await run(parsedScope());
    expect(result.status).toBe('completed');
    expect(result.deferred).toEqual(['sync-report']);
    expect(readOutbox(statePaths(dir).outbox).map((e) => e.stepId)).toEqual(['sync-report']);
  });

  it('fails with the Phase 2 finding when a core step turns out to need the network', async () => {
    const reg = {
      ...registry(),
      'decide-actions': async () => {
        throw new NetworkUnavailable('rulebook is remote');
      },
    };
    const result = await run(parsedScope(), reg);
    expect(result.status).toBe('failed');
    expect(result.failure).toMatch(/core step decide-actions needed the network/);
  });

  it('refuses a step the agent is not authorised for', async () => {
    const result = await run(parsedScope(), registry(), ['step:read-readings']);
    expect(result.status).toBe('failed');
    expect(result.failure).toMatch(/evaluate-limits not authorised/);
  });

  it('replays deferred work on reconnect in the specified order', async () => {
    const scope = parsedScope((s) => {
      s.workflow.steps.push({
        id: 'notify-hq',
        name: 'Notify HQ',
        criticality: 'non-core',
        requiresNetwork: true,
        handler: 'notify',
      });
      s.reconciliationOrder = ['notify-hq', 'sync-report'];
    });
    const calls: string[] = [];
    const reg = {
      ...registry(),
      'sync-report': async () => {
        calls.push('sync-report');
        return { output: 1 };
      },
      notify: async () => {
        calls.push('notify-hq');
        return { output: 1 };
      },
    };
    await run(scope, reg);
    const ledger = openLedger();
    const rec = await reconcileOutbox({
      scope,
      registry: reg,
      ledger,
      outboxPath: statePaths(dir).outbox,
      publicKey: site.publicKey,
      traceId: 'r',
    });
    ledger.close();
    expect(calls).toEqual(['notify-hq', 'sync-report']);
    expect(rec.remaining).toEqual([]);
  });

  it('quarantines a forged or edited outbox entry instead of replaying it (security review, critical)', async () => {
    await run(parsedScope());
    const outbox = statePaths(dir).outbox;
    const [genuine] = readOutbox(outbox);
    // Attacker with state-dir write access points the sync step at an arbitrary file.
    const forged = {
      ...genuine,
      entryId: crypto.randomUUID(),
      state: { 'write-shift-report': { path: '/etc/passwd', digest: 'x' } },
    };
    appendFileSync(outbox, `${JSON.stringify(forged)}\n{not json\n`);
    const sent: string[] = [];
    const reg = {
      ...registry(),
      'sync-report': async (ctx: { state: Record<string, unknown> }) => {
        sent.push(JSON.stringify(ctx.state['write-shift-report']));
        return { output: 1 };
      },
    };
    const ledger = openLedger();
    const rec = await reconcileOutbox({
      scope: parsedScope(),
      registry: reg,
      ledger,
      outboxPath: outbox,
      publicKey: site.publicKey,
      traceId: 'r',
    });
    ledger.close();
    expect(rec.replayed).toEqual(['sync-report']);
    expect(sent).toHaveLength(1);
    expect(sent[0]).not.toContain('/etc/passwd');
    expect(rec.errors).toHaveLength(2);
    expect(readFileSync(`${outbox}.quarantine`, 'utf8')).toContain('/etc/passwd');
    const incidents = readFileSync(statePaths(dir).ledger, 'utf8')
      .trim()
      .split('\n')
      .map((l) => JSON.parse(l))
      .filter((e) => e.detail?.kind === 'outbox-entry-rejected');
    expect(incidents).toHaveLength(2);
  });

  it('reference sync refuses a report path outside its report directory or a changed report', async () => {
    const reportDir = join(dir, 'reports');
    const reg = createReferenceRegistry({
      readingsPath,
      reportDir,
      syncUrl: 'https://sync.example.invalid/',
      fetchImpl: (async () => new Response(null, { status: 204 })) as typeof fetch,
    });
    const ctx = (state: Record<string, unknown>) => ({
      signal: new AbortController().signal,
      traceId: 't',
      step: parsedScope().workflow.steps[4],
      state,
      uplinkDown: false,
    });
    const snapshot = JSON.parse(readFileSync(readingsPath, 'utf8'));
    const written = (
      await reg['write-shift-report'](
        ctx({ 'read-readings': snapshot, 'evaluate-limits': [], 'decide-actions': [] }),
      )
    ).output as { path: string; digest: string };
    await expect(reg['sync-report'](ctx({ 'write-shift-report': written }))).resolves.toMatchObject(
      {
        output: { synced: true },
      },
    );
    await expect(
      reg['sync-report'](
        ctx({ 'write-shift-report': { path: readingsPath, digest: written.digest } }),
      ),
    ).rejects.toThrow(/outside the report directory/);
    writeFileSync(written.path, '{"tampered":true}');
    await expect(reg['sync-report'](ctx({ 'write-shift-report': written }))).rejects.toThrow(
      /changed since it was written/,
    );
  });

  it('ranks alarms by deviation from the band edge, relative to band span', () => {
    const alarms = evaluateLimits(JSON.parse(readFileSync(readingsPath, 'utf8')).readings);
    // PI-204: (7.9-7)/3 = 30 %; LI-402: (96-80)/70 = 22.9 %; FI-310: (12-11.2)/18 = 4.4 %
    expect(alarms.map((a) => [a.tag, a.band, Math.round(a.deviationPct * 10) / 10])).toEqual([
      ['PI-204', 'high', 30],
      ['LI-402', 'high', 22.9],
      ['FI-310', 'low', 4.4],
    ]);
  });
});

// ─── Severed-uplink acceptance test ──────────────────────────────────────────

describe('severed-uplink acceptance test', () => {
  const base = () => ({
    stateDir: dir,
    scope: parsedScope(),
    registry: createReferenceRegistry({
      readingsPath,
      reportDir: join(dir, 'reports'),
      syncUrl: 'none' as const,
    }),
    env: noProxyEnv,
    probeIntervalMs: 200,
  });

  it('PASSes when isolated, the workflow completes, evidence is continuous and the operator stop lands', async () => {
    const op = operator();
    const signed = await runAcceptance({
      ...base(),
      kind: 'rehearsal',
      connector: isolated,
      operator: { mode: 'automated', ...op },
    });
    expect(signed.record.findings.filter((f) => !f.startsWith('Deferred'))).toEqual([]);
    expect(signed.record.outcome).toBe('PASS');
    expect(signed.record.conditions.operatorStop.ticksAfterStop).toBe(0);
    expect(signed.record.conditions.operatorStop.stopMode).toBe('hard');
    expect(signed.record.conditions.operatorStop.terminationMs).not.toBeNull();
    expect(signed.record.conditions.operatorStop.lateMessages).toBe(0);
    expect(signed.record.isolation.method).toBe('host-egress-block');
    expect(verifyAcceptanceRecord(signed, site.publicKey)).toBe(true);
    const tampered = {
      ...signed,
      record: { ...signed.record, outcome: 'PASS' as const, witness: 'someone else' },
    };
    expect(verifyAcceptanceRecord(tampered, site.publicKey)).toBe(false);
    expect(verifyLedger(statePaths(dir).ledger, { publicKey: site.publicKey }).valid).toBe(true);
  });

  it('records NOT_TAKEN when egress succeeds before the run', async () => {
    const signed = await runAcceptance({
      ...base(),
      kind: 'rehearsal',
      connector: online,
      operator: { mode: 'automated', ...operator() },
    });
    expect(signed.record.outcome).toBe('NOT_TAKEN');
    expect(signed.record.conditions.workflowCompletes.run).toBeNull();
  });

  it('records INVALID when isolation lapses during the window', async () => {
    let calls = 0;
    const lapsing: Connector = async () =>
      ++calls > 3 ? { outcome: 'connected' } : { outcome: 'timeout' };
    const signed = await runAcceptance({
      ...base(),
      kind: 'rehearsal',
      connector: lapsing,
      operator: { mode: 'automated', ...operator() },
      holdUntilWindowEnd: false,
    });
    expect(signed.record.outcome).toBe('INVALID');
  });

  it('records a NEGATIVE_RESULT when no operator stops the agent', async () => {
    const signed = await runAcceptance({
      ...base(),
      kind: 'rehearsal',
      connector: isolated,
      operator: { mode: 'await-operator', timeoutMs: 600 },
    });
    expect(signed.record.outcome).toBe('NEGATIVE_RESULT');
    expect(signed.record.conditions.operatorStop.detail).toMatch(/not stopped within/);
    expect(signed.record.conditions.workflowCompletes.pass).toBe(true);
  });

  it('PASSes an acceptance run where the operator stops the agent out of process via the kill inbox', async () => {
    const op = operator();
    const signed = await runAcceptance({
      ...base(),
      kind: 'acceptance',
      witness: 'Plant manager (customer witness)',
      holdUntilWindowEnd: false,
      connector: isolated,
      operator: {
        mode: 'await-operator',
        timeoutMs: 10_000,
        onAwait: (agentId) =>
          setTimeout(
            () =>
              submitStopCommand(
                dir,
                createStopCommand({
                  target: agentId,
                  reason: 'witnessed stop',
                  operatorCredential: op.credential,
                  operatorKey: op.key,
                }),
              ),
            150,
          ),
      },
    });
    expect(signed.record.outcome).toBe('PASS');
    expect(signed.record.witness).toBe('Plant manager (customer witness)');
    expect(signed.record.conditions.operatorStop.stop?.latencyMs).toBeLessThan(2000);
  });

  it('refuses to run when the site key differs from the key pinned in the signed scope (security review, high)', async () => {
    const pinned = parsedScope((s) => (s.site.keyId = '0123456789abcdef'));
    await expect(
      runAcceptance({
        ...base(),
        scope: pinned,
        kind: 'rehearsal',
        connector: isolated,
        operator: { mode: 'automated', ...operator() },
      }),
    ).rejects.toThrow(/site authority has been replaced/);
    const matching = parsedScope((s) => (s.site.keyId = site.manifest.keyId));
    const signed = await runAcceptance({
      ...base(),
      scope: matching,
      kind: 'rehearsal',
      connector: isolated,
      operator: { mode: 'automated', ...operator() },
    });
    expect(signed.record.outcome).toBe('PASS');
  });

  it('refuses an acceptance run without a witness or with an automated stop', async () => {
    await expect(
      runAcceptance({
        ...base(),
        kind: 'acceptance',
        connector: isolated,
        operator: { mode: 'await-operator', timeoutMs: 100 },
      }),
    ).rejects.toThrow(/witness/);
    await expect(
      runAcceptance({
        ...base(),
        kind: 'acceptance',
        witness: 'w',
        connector: isolated,
        operator: { mode: 'automated', ...operator() },
      }),
    ).rejects.toThrow(/await-operator/);
  });
});

// ─── Hard stop (readiness plan patch C1) ─────────────────────────────────────

describe('hard stop: steps in terminable worker threads', () => {
  const fixture = join(process.cwd(), 'src/__tests__/fixtures/aegis-pilot-stubborn-handlers.ts');
  const referenceModule = join(process.cwd(), 'src/aegis/pilot/reference-workflow.ts');

  function oneStepScope(handler: string): PilotScope {
    return parsedScope((s) => {
      s.workflow.steps = [
        { id: 'only', name: 'Only step', criticality: 'core', requiresNetwork: false, handler },
      ];
      s.reconciliationOrder = [];
    });
  }

  async function runWithStop(
    scope: PilotScope,
    registry: Parameters<typeof runWorkflow>[0]['registry'],
    stopAfterMs: number,
  ) {
    const ledger = openLedger();
    const kill = new KillAuthority(dir, site.verifier(), ledger);
    const agent = site.issue({
      kind: 'agent',
      subjectName: 'wf',
      capabilities: scope.workflow.steps.map((st) => `step:${st.id}`),
      ttlHours: 1,
    });
    const op = operator();
    const timer = setTimeout(() => {
      kill.execute(
        createStopCommand({
          target: agent.subjectId,
          reason: 'hard stop test',
          operatorCredential: op.credential,
          operatorKey: op.key,
        }),
        't',
      );
    }, stopAfterMs);
    const t0 = performance.now();
    try {
      const result = await runWorkflow({
        scope,
        registry,
        ledger,
        kill,
        verifier: site.verifier(),
        agent,
        uplinkDown: true,
        outboxPath: statePaths(dir).outbox,
        signOutbox: (p) => site.sign(p),
        traceId: 't',
      });
      return { result, elapsedMs: performance.now() - t0 };
    } finally {
      clearTimeout(timer);
      ledger.close();
    }
  }

  const events = () =>
    readFileSync(statePaths(dir).ledger, 'utf8')
      .trim()
      .split('\n')
      .map((l) => JSON.parse(l));

  it('terminates a step that spins synchronously forever and records the termination', async () => {
    const scope = oneStepScope('spin');
    const { result, elapsedMs } = await runWithStop(
      scope,
      createIsolatedRegistry({ modulePath: fixture }, ['spin']),
      400,
    );
    expect(result.status).toBe('stopped');
    expect(elapsedMs).toBeLessThan(5000);
    const terminated = events().find((e) => e.event_type === 'system.agent_terminated');
    expect(terminated?.detail).toMatchObject({ step: 'only', stop_mode: 'hard' });
    expect(typeof terminated?.detail.termination_ms).toBe('number');
  });

  it('a cooperative stop lets an abort-ignoring handler finish its side effect; a hard stop does not', async () => {
    const marker = join(dir, 'side-effect.txt');
    const scope = oneStepScope('ignore-abort');

    const { createRegistry } = await import('./fixtures/aegis-pilot-stubborn-handlers.js');
    const coop = await runWithStop(scope, createRegistry({ markerPath: marker }), 100);
    expect(coop.result.status).toBe('stopped');
    await new Promise((r) => setTimeout(r, 900));
    expect(existsSync(marker)).toBe(true); // the limit runbook §8 documents

    rmSync(marker);
    const hard = await runWithStop(
      scope,
      createIsolatedRegistry({ modulePath: fixture, options: { markerPath: marker } }, [
        'ignore-abort',
      ]),
      300,
    );
    expect(hard.result.status).toBe('stopped');
    await new Promise((r) => setTimeout(r, 1200));
    expect(existsSync(marker)).toBe(false);
  });

  it('runs the reference workflow to completion in isolated workers, with outputs crossing the thread boundary', async () => {
    const scope = parsedScope();
    const registry = createIsolatedRegistry(
      {
        modulePath: referenceModule,
        options: { readingsPath, reportDir: join(dir, 'reports'), syncUrl: 'none' },
      },
      scope.workflow.steps.map((st) => st.handler),
    );
    const ledger = openLedger();
    const kill = new KillAuthority(dir, site.verifier(), ledger);
    const agent = site.issue({
      kind: 'agent',
      subjectName: 'wf',
      capabilities: scope.workflow.steps.map((st) => `step:${st.id}`),
      ttlHours: 1,
    });
    const result = await runWorkflow({
      scope,
      registry,
      ledger,
      kill,
      verifier: site.verifier(),
      agent,
      uplinkDown: false,
      outboxPath: statePaths(dir).outbox,
      signOutbox: (p) => site.sign(p),
      traceId: 't',
    }).finally(() => ledger.close());
    expect(result.status).toBe('completed');
    expect(result.steps.map((st) => st.status)).toEqual(['done', 'done', 'done', 'done', 'done']);
  });

  it('carries NetworkUnavailable across the boundary so a non-core step is still deferred', async () => {
    const scope = parsedScope();
    const registry = createIsolatedRegistry(
      {
        modulePath: referenceModule,
        options: { readingsPath, reportDir: join(dir, 'reports'), syncUrl: 'http://127.0.0.1:9/' },
      },
      scope.workflow.steps.map((st) => st.handler),
    );
    const ledger = openLedger();
    const kill = new KillAuthority(dir, site.verifier(), ledger);
    const agent = site.issue({
      kind: 'agent',
      subjectName: 'wf',
      capabilities: scope.workflow.steps.map((st) => `step:${st.id}`),
      ttlHours: 1,
    });
    const result = await runWorkflow({
      scope,
      registry,
      ledger,
      kill,
      verifier: site.verifier(),
      agent,
      uplinkDown: false,
      outboxPath: statePaths(dir).outbox,
      signOutbox: (p) => site.sign(p),
      traceId: 't',
    }).finally(() => ledger.close());
    expect(result.status).toBe('completed');
    expect(result.deferred).toEqual(['sync-report']);
  });

  it('fails a step loudly when the module does not export the handler', async () => {
    const scope = oneStepScope('missing');
    const { result } = await runWithStop(
      scope,
      createIsolatedRegistry({ modulePath: fixture }, ['missing']),
      60_000,
    );
    expect(result.status).toBe('failed');
    expect(result.failure).toMatch(/handler "missing" not exported/);
  });

  it('never hangs or claims a stop when termination is rejected or unconfirmed (security review, high)', async () => {
    const rejecting = {
      terminate: () => Promise.reject(new Error('already gone')),
    } as unknown as Worker;
    await expect(terminateBounded(rejecting)).resolves.toMatchObject({ confirmed: false });
    const hanging = { terminate: () => new Promise<number>(() => {}) } as unknown as Worker;
    const t0 = performance.now();
    await expect(terminateBounded(hanging, 150)).resolves.toMatchObject({ confirmed: false });
    expect(performance.now() - t0).toBeLessThan(1000);
    const ok = { terminate: () => Promise.resolve(1) } as unknown as Worker;
    await expect(terminateBounded(ok)).resolves.toMatchObject({ confirmed: true });
  });

  it('refuses an acceptance run with the cooperative stop', async () => {
    await expect(
      runAcceptance({
        stateDir: dir,
        scope: parsedScope(),
        registry: createReferenceRegistry({
          readingsPath,
          reportDir: join(dir, 'reports'),
          syncUrl: 'none',
        }),
        env: noProxyEnv,
        kind: 'acceptance',
        witness: 'w',
        stopMode: 'cooperative',
        connector: isolated,
        operator: { mode: 'await-operator', timeoutMs: 100 },
      }),
    ).rejects.toThrow(/requires the hard stop/);
  });
});
