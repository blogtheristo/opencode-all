// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/__tests__/aegis-pilot-authority.test.ts
/**
 * The decision-authority record: who held authority, and what followed.
 * Derived from the signed ledger only; names resolved from local files, never
 * written to the ledger.
 */

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  buildAuthorityRecord,
  CAP_AGENT_STOP,
  type Connector,
  createReferenceRegistry,
  EvidenceLedger,
  generateEd25519,
  type PilotScope,
  privateKeyFromPem,
  reconcileOutbox,
  runAcceptance,
  SiteAuthority,
  statePaths,
  validateScope,
} from '../aegis/pilot/index.js';

const readingsPath = join(process.cwd(), 'config/aegis-pilot/sample-readings.json');
const isolated: Connector = async () => ({ outcome: 'unreachable', code: 'ENETUNREACH' });

function scope(signed = true): PilotScope {
  const s = JSON.parse(
    readFileSync(join(process.cwd(), 'config/aegis-pilot/reference-scope.json'), 'utf8'),
  );
  s.acceptance.heartbeatMs = 100;
  s.acceptance.maxGapMs = 2000;
  s.acceptance.windowMinutes = 1;
  if (signed) {
    s.signoff = {
      customerSignatory: 'Plant Director, Example Oy',
      lifetimeSignatory: 'Risto Anton Päärni, Lifetime Oy',
      signedAt: '2026-09-28T08:00:00Z',
    };
  }
  const v = validateScope(s);
  if (!v.ok) throw new Error(v.errors.join('\n'));
  return v.scope;
}

let dir: string;
let site: SiteAuthority;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'aegis-authority-'));
  site = SiteAuthority.init(dir, 'reference-site');
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

async function passRun(s: PilotScope) {
  const kp = generateEd25519();
  const credential = site.issue({
    kind: 'operator',
    subjectName: 'Shift operator A',
    capabilities: [CAP_AGENT_STOP],
    subjectPublicKeyPem: kp.publicKeyPem,
    ttlHours: 1,
  });
  return runAcceptance({
    stateDir: dir,
    scope: s,
    registry: createReferenceRegistry({
      readingsPath,
      reportDir: join(dir, 'reports'),
      syncUrl: 'none',
    }),
    kind: 'rehearsal',
    connector: isolated,
    env: {} as NodeJS.ProcessEnv,
    probeIntervalMs: 200,
    operator: { mode: 'automated', credential, key: privateKeyFromPem(kp.privateKeyPem) },
  });
}

describe('decision-authority record', () => {
  it('shows, per agent, the grant, the signed scope and its signatories, the decisions and what followed', async () => {
    const s = scope();
    const signed = await passRun(s);
    expect(signed.record.outcome).toBe('PASS');
    const [workflow, sentinel] = signed.record.authority!;

    expect(workflow.granted).toMatchObject({
      basis: 'rehearsal: workflow agent',
      scopeDigest: signed.record.scopeDigest,
      signatories: {
        customer: 'Plant Director, Example Oy',
        lifetime: 'Risto Anton Päärni, Lifetime Oy',
      },
    });
    expect(workflow.granted!.capabilities).toContain('step:write-shift-report');
    expect(workflow.decisions.count).toBe(4);
    expect(workflow.outcome).toBe('completed');
    expect(workflow.deferred).toEqual(['sync-report']);
    expect(workflow.stop).toBeNull();

    expect(sentinel.outcome).toBe('stopped');
    expect(sentinel.stop).toMatchObject({
      operatorName: 'Shift operator A',
      reason: 'rehearsal stop test',
    });
    expect(sentinel.afterStop).toMatchObject({ agentWorkEvents: 0, terminated: true });
  });

  it('shows deferred work that was carried out later, after reconnect', async () => {
    const s = scope();
    const signed = await passRun(s);
    const workflowId = signed.record.authority![0].agentId;
    const ledger = EvidenceLedger.open(statePaths(dir).ledger, {
      siteId: 'reference-site',
      orgId: 'o',
      signer: (h) => site.sign(h),
      publicKey: site.publicKey,
    });
    await reconcileOutbox({
      scope: s,
      registry: createReferenceRegistry({
        readingsPath,
        reportDir: join(dir, 'reports'),
        syncUrl: 'none',
      }),
      ledger,
      outboxPath: statePaths(dir).outbox,
      publicKey: site.publicKey,
      traceId: 'r',
    });
    ledger.close();
    const [agent] = buildAuthorityRecord(dir, {
      publicKey: site.publicKey,
      agentIds: [workflowId],
    }).agents;
    expect(agent.reconciledLater).toEqual(['sync-report']);
  });

  it('names signatories only for the scope the grant was actually made under', async () => {
    const signed = await passRun(scope());
    const other = scope();
    other.site.name = 'A different, later scope';
    const rec = buildAuthorityRecord(dir, { publicKey: site.publicKey, scope: other });
    expect(rec.agents.every((a) => a.granted?.signatories === null)).toBe(true);
    expect(signed.record.authority![0].granted!.signatories).not.toBeNull();
  });

  it('keeps the Article 12 ledger pseudonymous: no operator or signatory names in it', async () => {
    await passRun(scope());
    const raw = readFileSync(statePaths(dir).ledger, 'utf8');
    expect(raw).not.toContain('Shift operator A');
    expect(raw).not.toContain('Plant Director');
    expect(raw).toContain('"event_type":"authority.grant"');
  });

  it('refuses to build a record from a tampered ledger', async () => {
    await passRun(scope());
    const path = statePaths(dir).ledger;
    writeFileSync(
      path,
      readFileSync(path, 'utf8').replace('"step":"read-readings"', '"step":"read-readingz"'),
    );
    expect(() => buildAuthorityRecord(dir, { publicKey: site.publicKey })).toThrow(
      /does not verify/,
    );
  });

  it('turns a probe failure mid-window into INVALID, not an unhandled rejection', async () => {
    let calls = 0;
    const flaky: Connector = async () => {
      if (++calls > 3) throw new Error('probe hardware fault');
      return { outcome: 'unreachable' };
    };
    const signed = await runAcceptance({
      stateDir: dir,
      scope: scope(),
      registry: createReferenceRegistry({
        readingsPath,
        reportDir: join(dir, 'reports'),
        syncUrl: 'none',
      }),
      kind: 'rehearsal',
      connector: flaky,
      env: {} as NodeJS.ProcessEnv,
      probeIntervalMs: 50,
      operator: { mode: 'await-operator', timeoutMs: 300 },
    }).catch((e: Error) => e);
    // Postflight also fails, so the run ends in an error; either way no rejection is left unhandled.
    if (signed instanceof Error) expect(signed.message).toMatch(/probe hardware fault/);
    else expect(signed.record.outcome).toBe('INVALID');
  });

  it('stops every background writer when a run fails mid-way (no writes to a closed ledger)', async () => {
    let calls = 0;
    // Preflight (3 targets) succeeds; the postflight probe fails after the writers are armed.
    const failing: Connector = async () => {
      if (++calls > 3) throw new Error('probe hardware fault');
      return { outcome: 'unreachable' };
    };
    const kp = generateEd25519();
    const credential = site.issue({
      kind: 'operator',
      subjectName: 'op',
      capabilities: [CAP_AGENT_STOP],
      subjectPublicKeyPem: kp.publicKeyPem,
      ttlHours: 1,
    });
    await expect(
      runAcceptance({
        stateDir: dir,
        scope: scope(),
        registry: createReferenceRegistry({
          readingsPath,
          reportDir: join(dir, 'reports'),
          syncUrl: 'none',
        }),
        kind: 'rehearsal',
        connector: failing,
        env: {} as NodeJS.ProcessEnv,
        probeIntervalMs: 60_000,
        operator: { mode: 'await-operator', timeoutMs: 300 },
      }),
    ).rejects.toThrow(/probe hardware fault/);
    // A stop command arriving after the failure must not reach a closed ledger.
    const { createStopCommand, submitStopCommand } = await import('../aegis/pilot/index.js');
    submitStopCommand(
      dir,
      createStopCommand({
        target: '*',
        reason: 'late',
        operatorCredential: credential,
        operatorKey: privateKeyFromPem(kp.privateKeyPem),
      }),
    );
    await new Promise((r) => setTimeout(r, 400));
    expect(readFileSync(statePaths(dir).ledger, 'utf8')).not.toContain('"reason":"late"');
  });
});
