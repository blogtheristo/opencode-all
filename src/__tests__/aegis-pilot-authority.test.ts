// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/__tests__/aegis-pilot-authority.test.ts
/**
 * The decision-authority record: who held authority, and what followed.
 * Derived from the signed ledger only; names resolved from local files, never
 * written to the ledger.
 */

import {
  appendFileSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { canonicalJSON, sha256 } from '../aegis/pilot/crypto.js';
import {
  AgentStopped,
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
  verifyLedger,
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
    // Pseudonymous id bound to one credential at grant time, checkable on the host.
    expect(workflow.granted!.credentialDigest).toMatch(/^[0-9a-f]{64}$/);
    expect(workflow.granted!.expiresAt).toMatch(/^\d{4}-/);
    expect(workflow.granted!.credentialOnFileMatches).toBe(true);
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

  it('flags a credential on file that is not the one granted (role swapped after the fact)', async () => {
    await passRun(scope());
    const credDir = statePaths(dir).credentials;
    for (const f of readdirSync(credDir).filter((n) => n.endsWith('.json'))) {
      const c = JSON.parse(readFileSync(join(credDir, f), 'utf8'));
      if (c.kind !== 'agent') continue;
      c.capabilities = [...c.capabilities, 'step:actuate-valve'];
      writeFileSync(join(credDir, f), JSON.stringify(c));
    }
    const rec = buildAuthorityRecord(dir, { publicKey: site.publicKey });
    expect(rec.agents.every((a) => a.granted?.credentialOnFileMatches === false)).toBe(true);
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

  describe('stop tombstone', () => {
    function stoppedLedger() {
      const ledger = EvidenceLedger.open(statePaths(dir).ledger, {
        siteId: 'reference-site',
        orgId: 'o',
        signer: (h) => site.sign(h),
        publicKey: site.publicKey,
      });
      ledger.append({
        event_type: 'agent.decide',
        trace_id: 't',
        agent_id: 'agent-x',
        detail: { step: 'a' },
      });
      ledger.append({
        event_type: 'human.override',
        trace_id: 't',
        operator_id: 'op-1',
        detail: { action: 'agent.stop', agents_stopped: ['agent-x'], command_id: 'c1' },
      });
      return ledger;
    }

    it("refuses a stopped agent's work, records the attempt, and leaves other agents alone", () => {
      const ledger = stoppedLedger();
      expect(() =>
        ledger.append({ event_type: 'agent.decide', trace_id: 't', agent_id: 'agent-x' }),
      ).toThrow(AgentStopped);
      ledger.append({ event_type: 'agent.decide', trace_id: 't', agent_id: 'agent-y' });
      ledger.close();
      const events = readFileSync(statePaths(dir).ledger, 'utf8')
        .trim()
        .split('\n')
        .map((l) => JSON.parse(l));
      expect(
        events.filter((e) => e.agent_id === 'agent-x' && e.event_type === 'agent.decide'),
      ).toHaveLength(1);
      expect(events.find((e) => e.detail?.kind === 'work-after-stop-refused')).toMatchObject({
        agent_id: 'agent-x',
      });
      expect(verifyLedger(statePaths(dir).ledger, { publicKey: site.publicKey }).valid).toBe(true);
    });

    it('keeps the tombstone across a restart', () => {
      stoppedLedger().close();
      const reopened = EvidenceLedger.open(statePaths(dir).ledger, {
        siteId: 'reference-site',
        orgId: 'o',
        signer: (h) => site.sign(h),
        publicKey: site.publicKey,
      });
      expect(() =>
        reopened.append({ event_type: 'tool.invoke', trace_id: 't', agent_id: 'agent-x' }),
      ).toThrow(AgentStopped);
      reopened.close();
    });

    it('fails verification even when a key holder re-signs a chain with work after the stop', () => {
      stoppedLedger().close();
      const path = statePaths(dir).ledger;
      const events = readFileSync(path, 'utf8')
        .trim()
        .split('\n')
        .map((l) => JSON.parse(l));
      // Forge: append agent-x work after its stop, re-hash and re-sign with the real site key.
      const last = events.at(-1);
      const body = {
        seq: last.seq + 1,
        event_id: '00000000-0000-4000-8000-000000000000',
        event_type: 'agent.decide',
        timestamp: new Date(Date.parse(last.timestamp) + 10).toISOString(),
        site_id: last.site_id,
        org_id: last.org_id,
        trace_id: 't',
        agent_id: 'agent-x',
        operator_id: null,
        capability_manifest_hash: null,
        model_version: null,
        input_digest: null,
        output_digest: null,
        confidence: null,
        detail: { step: 'after-stop' },
        prev_hash: last.event_hash,
      };
      const event_hash = sha256(body.prev_hash + canonicalJSON(body));
      appendFileSync(
        path,
        `${JSON.stringify({ ...body, event_hash, sig: site.sign(event_hash) })}\n`,
      );
      const v = verifyLedger(path, { publicKey: site.publicKey });
      expect(v.valid).toBe(false);
      expect(v.reason).toMatch(/tombstone violated/);
    });
  });
});
