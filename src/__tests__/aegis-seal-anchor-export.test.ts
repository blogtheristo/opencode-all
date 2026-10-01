// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
// Audit trail: git log -- src/__tests__/aegis-seal-anchor-export.test.ts
/**
 * DWS-AEGIS-PILOT-001 — anchoring (EVIDENCE_FORMAT_v1.md §7–§9). The promises:
 *   - stop and decide events carry the operator's framed signature; the body lives in an
 *     erasable sidecar, and an erased body verifies only with its evidence.redacted record;
 *   - operator copies held outside the box catch a stop deleted from a re-signed ledger;
 *   - the active segment is sealed on schedule (override, configuration change, shift
 *     change, max age), and an overdue seal is an alert and an incident;
 *   - every seal anchor is exported to the customer's syslog and file sinks; a failed
 *     export is an incident, never blocks the seal, and is backfilled in order.
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer, type Server } from 'node:net';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  anchorExport,
  anchorStatus,
  CAP_AGENT_STOP,
  CAP_DECISION,
  commandBodiesDir,
  createDecisionCommand,
  createStopCommand,
  type Credential,
  DecisionAuthority,
  eraseWithWormHandoff,
  EvidenceLedger,
  exportBundle,
  generateEd25519,
  GENESIS_HASH,
  KillAuthority,
  type LedgerEvent,
  privateKeyFromPem,
  readAnchorQueue,
  readLedgerEvents,
  readSeals,
  runScheduledSeal,
  sealDue,
  SiteAuthority,
  statePaths,
  verifyBundle,
  writeOperatorCopies,
  writeWormTombstone,
} from '../aegis/pilot/index.js';
import { canonicalJSON, sha256 } from '../aegis/pilot/crypto.js';

let base: string;
let dir: string;
let site: SiteAuthority;
let clock: Date;
const now = () => new Date(clock);
const tick = (ms = 1000) => {
  clock = new Date(clock.getTime() + ms);
};

function openLedger(): EvidenceLedger {
  return EvidenceLedger.open(statePaths(dir).ledger, {
    siteId: site.manifest.siteId,
    orgId: 'org-test',
    signer: (h) => site.sign(h),
    publicKey: site.publicKey,
    now,
  });
}

/** Rewrite the active ledger without one event, re-signed with the site key (the attack). */
function rewriteWithout(dropSeq: number): void {
  const path = statePaths(dir).ledger;
  let prev = GENESIS_HASH;
  const lines = readLedgerEvents(path)
    .filter((e) => e.seq !== dropSeq)
    .map((e, i) => {
      const { event_hash: _h, sig: _s, ...body } = e;
      const next = { ...body, seq: i, prev_hash: prev };
      const hash = sha256(prev + canonicalJSON(next));
      prev = hash;
      return JSON.stringify({ ...next, event_hash: hash, sig: site.sign(hash) });
    });
  writeFileSync(path, `${lines.join('\n')}\n`);
}

interface Flow {
  cred: Credential;
  copies: string;
  worm: string;
  stopEvent: LedgerEvent;
  decideEvent: LedgerEvent;
}

/** One recommendation, decided; one stop — with operator copies, as the CLI writes them. */
function operatorFlow(): Flow {
  const kp = generateEd25519();
  const opKey = privateKeyFromPem(kp.privateKeyPem);
  const cred = site.issue(
    {
      kind: 'operator',
      subjectName: 'Operator A',
      capabilities: [CAP_AGENT_STOP, CAP_DECISION],
      subjectPublicKeyPem: kp.publicKeyPem,
      role: 'shift-supervisor',
      ttlHours: 24,
    },
    clock,
  );
  const agent = site.issue(
    { kind: 'agent', subjectName: 'agent', capabilities: ['step-1'], ttlHours: 24 },
    clock,
  );
  const copies = join(base, 'operator', 'commands');
  const worm = join(base, 'operator', 'worm');
  const ledger = openLedger();
  try {
    const kill = new KillAuthority(dir, site.verifier(), ledger, now);
    kill.register(agent);
    tick();
    const rec = ledger.append({
      event_type: 'agent.decide',
      trace_id: 't',
      agent_id: agent.subjectId,
      output_digest: sha256('recommendation'),
      detail: { recommendation: true, step: 'step-1' },
    });
    tick();
    const decide = createDecisionCommand(
      {
        recommendationSeq: rec.seq,
        recommendationHash: rec.event_hash,
        verdict: 'accept',
        reason: 'checked against the load forecast',
        operatorCredential: cred,
        operatorKey: opKey,
      },
      now(),
    );
    writeOperatorCopies({
      kind: 'decide',
      command: decide as unknown as Record<string, unknown>,
      credential: cred,
      issuedAgainst: { segment: 0, seq: rec.seq, event_hash: rec.event_hash },
      dir: copies,
      wormDir: worm,
    });
    const d = new DecisionAuthority(dir, site.verifier(), ledger, site.publicKey, now).execute(
      decide,
      't',
    );
    expect(d.accepted).toBe(true);
    tick();
    const head = ledger.head;
    const stop = createStopCommand(
      {
        target: agent.subjectId,
        reason: 'operator stop',
        operatorCredential: cred,
        operatorKey: opKey,
      },
      now(),
    );
    writeOperatorCopies({
      kind: 'stop',
      command: stop as unknown as Record<string, unknown>,
      credential: cred,
      issuedAgainst: { segment: 0, seq: head.seq, event_hash: head.hash },
      dir: copies,
      wormDir: worm,
    });
    const s = kill.execute(stop, 't');
    expect(s.accepted).toBe(true);
    const events = readLedgerEvents(statePaths(dir).ledger);
    return {
      cred,
      copies,
      worm,
      stopEvent: events[s.ledgerSeq as number],
      decideEvent: events[d.ledgerSeq as number],
    };
  } finally {
    ledger.close();
  }
}

function exportAndVerify(name: string, operatorCopies?: string) {
  const out = join(base, name);
  exportBundle(dir, out, now());
  return verifyBundle(out, site.manifest.keyId, now(), { operatorCopies });
}

function erase(digest: string, wormDir: string) {
  return eraseWithWormHandoff({
    stateDir: dir,
    digest,
    reasonCode: 'data-subject-request',
    wormDir,
    now: now(),
    withLedger: (fn) => {
      const l = openLedger();
      try {
        fn(l);
      } finally {
        l.close();
      }
    },
  });
}

const redactions = () =>
  readLedgerEvents(statePaths(dir).ledger).filter((e) => e.event_type === 'evidence.redacted');

beforeEach(() => {
  base = mkdtempSync(join(tmpdir(), 'aegis-anchor-'));
  clock = new Date('2026-10-01T06:00:00.000Z');
  dir = join(base, 's');
  site = SiteAuthority.init(dir, 'anchor-test', clock);
  openLedger().close();
});

afterEach(() => {
  rmSync(base, { recursive: true, force: true });
});

describe('operator evidence in the ledger (framed signature, erasable body)', () => {
  it('stop and decide events carry framed fields and signatures, never the body or reason', () => {
    const f = operatorFlow();
    for (const e of [f.stopEvent, f.decideEvent]) {
      expect(e.detail).toMatchObject({
        command_digest: expect.stringMatching(/^[0-9a-f]{64}$/),
        command_kind: e.event_type === 'human.override' ? 'stop' : 'decide',
        role: 'shift-supervisor',
        operator_credential_id: f.cred.credentialId,
        digest_signature: expect.any(String),
        operator_signature: expect.any(String),
      });
      expect(e.detail).not.toHaveProperty('reason');
      expect(e.detail).not.toHaveProperty('command');
      expect(JSON.stringify(e)).not.toMatch(/load forecast|operator stop/);
    }
    expect(readdirSync(commandBodiesDir(dir))).toHaveLength(2);
    const r = exportAndVerify('b');
    expect(r.failures).toEqual([]);
    expect(r.ok).toBe(true);
  });

  it('an erased body verifies with its evidence.redacted record; a deleted body without one fails', () => {
    const f = operatorFlow();
    tick();
    const r = erase(String(f.stopEvent.detail.command_digest), f.worm);
    expect(r.status).toBe('erased');
    expect(Object.keys(r.tombstone).sort()).toEqual(['command_digest', 'erased_at', 'reason_code']);
    const ok = exportAndVerify('redacted', f.worm);
    expect(ok.failures).toEqual([]);
    expect(ok.operatorCopies?.matched).toBe(3);

    unlinkSync(join(commandBodiesDir(dir), `${String(f.decideEvent.detail.command_digest)}.json`));
    const bad = exportAndVerify('missing');
    expect(bad.ok).toBe(false);
    expect(bad.failures.join('\n')).toMatch(/^COMMAND_BODY_MISSING: active seq \d+ human\.decide/m);
  });
});

describe('erasure: the WORM tombstone first, then the irreversible part (review #2324)', () => {
  it('with an unwritable WORM mirror nothing is erased; after the handoff the erasure completes', () => {
    const f = operatorFlow();
    const digest = String(f.stopEvent.detail.command_digest);
    const body = join(commandBodiesDir(dir), `${digest}.json`);
    // A WORM mirror this process cannot write (here: its path is a regular file).
    const blocked = join(base, 'worm-blocked');
    writeFileSync(blocked, 'not a directory');
    tick();
    const first = erase(digest, blocked);
    expect(first.status).toBe('pending-handoff');
    expect(existsSync(body)).toBe(true);
    expect(redactions()).toHaveLength(0);
    if (first.status !== 'pending-handoff') return;
    // The mirror's holder copies the staged tombstone into the real mirror, unchanged.
    mkdirSync(f.worm, { recursive: true });
    copyFileSync(first.outboxPath, join(f.worm, `${digest}.redacted.json`));
    tick(60_000);
    const second = erase(digest, f.worm);
    expect(second.status).toBe('erased');
    expect(second.tombstone).toEqual(first.tombstone);
    expect(existsSync(body)).toBe(false);
    expect(existsSync(first.outboxPath)).toBe(false);
    expect(redactions().map((e) => e.detail)).toEqual([first.tombstone]);
    const v = exportAndVerify('handoff', f.worm);
    expect(v.failures).toEqual([]);
  });

  it('refuses to erase when the mirror holds a different tombstone for the digest', () => {
    const f = operatorFlow();
    const digest = String(f.stopEvent.detail.command_digest);
    writeWormTombstone(f.worm, {
      command_digest: digest,
      erased_at: '2020-01-01T00:00:00.000Z',
      reason_code: 'legal-order',
    });
    expect(() => erase(digest, f.worm)).toThrow(/different tombstone/);
    expect(existsSync(join(commandBodiesDir(dir), `${digest}.json`))).toBe(true);
  });

  it('operator copies and bodies are written durably: no temp files left, never overwritten', () => {
    const f = operatorFlow();
    for (const d of [f.copies, f.worm, commandBodiesDir(dir)])
      expect(readdirSync(d).filter((n) => n.startsWith('.tmp-'))).toEqual([]);
    const name = readdirSync(f.worm)[0];
    const before = readFileSync(join(f.worm, name), 'utf8');
    const rec = JSON.parse(before);
    expect(() =>
      writeWormTombstone(f.worm, { ...rec, command_digest: name.slice(0, 64), erased_at: 'x' }),
    ).not.toThrow(); // a different file name (.redacted.json)
    expect(() =>
      writeWormTombstone(f.worm, {
        command_digest: name.slice(0, 64),
        erased_at: 'y',
        reason_code: 'legal-order',
      }),
    ).toThrow(/EEXIST/);
    expect(readFileSync(join(f.worm, name), 'utf8')).toBe(before);
  });
});

describe('operator command copies (anchoring level 1)', () => {
  it('full copies and WORM records match the ledger', () => {
    const f = operatorFlow();
    for (const d of [f.copies, f.worm]) {
      const r = exportAndVerify(`b-${d.endsWith('worm') ? 'w' : 'c'}`, d);
      expect(r.failures).toEqual([]);
      expect(r.operatorCopies).toMatchObject({ checked: 2, matched: 2, rejected: [] });
    }
  });

  it('WORM records hold digests and framed fields only — no body, no free-text reason', () => {
    const f = operatorFlow();
    for (const name of readdirSync(f.worm)) {
      const rec = JSON.parse(readFileSync(join(f.worm, name), 'utf8')) as Record<string, unknown>;
      expect(Object.keys(rec).sort()).toEqual(
        [
          'command_digest',
          'command_id',
          'command_kind',
          'digest_signature',
          'event_hash',
          'issued_at',
          'ledger_segment',
          'ledger_seq',
          'operator_credential_id',
          'role',
        ].sort(),
      );
      expect(JSON.stringify(rec)).not.toMatch(/load forecast|operator stop/);
    }
  });

  it('detects a stop deleted from a re-signed ledger (the site key holder rewrote history)', () => {
    const f = operatorFlow();
    rewriteWithout(f.stopEvent.seq);
    // Without the operator's copies the forged ledger verifies: that is the gap they close.
    const forged = exportAndVerify('forged');
    expect(forged.failures).toEqual([]);
    for (const d of [f.copies, f.worm]) {
      const r = verifyBundle(join(base, 'forged'), site.manifest.keyId, now(), {
        operatorCopies: d,
      });
      expect(r.ok).toBe(false);
      expect(r.failures.join('\n')).toMatch(/OPERATOR_COPY_UNMATCHED: .*deleted history/);
    }
  });

  it('detects rewritten history before a command (the head it was issued against is gone)', () => {
    const l = openLedger();
    l.append({ event_type: 'system.heartbeat', trace_id: 't' });
    l.close();
    const f = operatorFlow();
    rewriteWithout(1);
    const r = exportAndVerify('rewritten', f.worm);
    expect(r.ok).toBe(false);
    expect(r.failures.join('\n')).toMatch(/OPERATOR_COPY_HISTORY_MISSING: [0-9a-f]{64}\.json/);
  });
});

/** A TCP syslog receiver (RFC 6587 octet counting). Closes each connection after reading. */
async function syslogServer(
  port = 0,
): Promise<{ server: Server; port: number; messages: string[] }> {
  const messages: string[] = [];
  const server = createServer((sock) => {
    let buf = '';
    sock.setEncoding('utf8');
    sock.on('data', (d) => {
      buf += d;
    });
    sock.on('end', () => {
      while (buf.length) {
        const sp = buf.indexOf(' ');
        const n = Number(buf.slice(0, sp));
        const bytes = Buffer.from(buf.slice(sp + 1), 'utf8');
        messages.push(bytes.subarray(0, n).toString('utf8'));
        buf = bytes.subarray(n).toString('utf8');
      }
      sock.end();
    });
  });
  await new Promise<void>((r) => server.listen(port, '127.0.0.1', () => r()));
  const addr = server.address();
  return { server, port: typeof addr === 'object' && addr ? addr.port : 0, messages };
}

/** A port nothing listens on. */
async function closedPort(): Promise<number> {
  const { server, port } = await syslogServer();
  await new Promise((r) => server.close(r));
  return port;
}

const schedule = { shiftChanges: ['06:00', '14:00', '22:00'], maxAgeDays: 1 };
/** Incidents of a kind across every sealed segment and the active one. */
const incidents = (kind: string) =>
  [
    ...readSeals(dir).flatMap((x) => readLedgerEvents(join(dir, 'ledger', 'segments', x.file))),
    ...readLedgerEvents(statePaths(dir).ledger),
  ].filter((e) => e.event_type === 'incident' && e.detail.kind === kind);

describe('scheduled seal', () => {
  it('is not due right after install, and is due after a human.override', () => {
    tick(60_000);
    expect(sealDue(dir, schedule, now())).toMatchObject({ due: false, overdue: false });
    operatorFlow();
    expect(sealDue(dir, schedule, now()).reasons).toContain('human.override since the last seal');
  });

  it('is due on a configuration change, on a shift change and at max age; overdue after the grace', () => {
    const l = openLedger();
    l.append({ event_type: 'authority.revoke', trace_id: 't', detail: { credential_id: 'x' } });
    l.close();
    expect(sealDue(dir, schedule, now()).reasons).toEqual([
      'configuration change since the last seal',
    ]);
    const quiet = { shiftChanges: ['14:00'], maxAgeDays: 1 };
    const a = join(base, 'a');
    const s2 = SiteAuthority.init(a, 'anchor-test-b', clock);
    EvidenceLedger.open(statePaths(a).ledger, {
      siteId: 'anchor-test-b',
      orgId: 'o',
      signer: (h) => s2.sign(h),
      publicKey: s2.publicKey,
      now,
    }).close();
    expect(sealDue(a, quiet, new Date('2026-10-01T13:59:00Z')).due).toBe(false);
    expect(sealDue(a, quiet, new Date('2026-10-01T14:00:00Z')).reasons).toEqual([
      'shift change 14:00 UTC',
    ]);
    const day = sealDue(a, { shiftChanges: [], maxAgeDays: 1 }, new Date('2026-10-02T06:00:00Z'));
    expect(day).toMatchObject({ due: true, overdue: false, reasons: ['max age 1 d'] });
    expect(
      sealDue(a, { shiftChanges: [], maxAgeDays: 1 }, new Date('2026-10-02T07:00:01Z')).overdue,
    ).toBe(true);
    expect(() => sealDue(a, { shiftChanges: [], maxAgeDays: 30 })).toThrow(/at least daily/);
  });

  it('a tick seals when due, and the seal reason names the trigger', async () => {
    operatorFlow();
    tick();
    const r = await runScheduledSeal({ stateDir: dir, site, schedule, sinks: {}, now });
    expect(r.seal?.sealed).toBe(true);
    expect(readSeals(dir)[0].reason).toMatch(/^scheduled: human\.override since the last seal/);
    expect(sealDue(dir, schedule, now()).due).toBe(false);
    expect(r.anchor.queued).toBe(1);
  });

  it('an overdue seal is an alert and one incident, not one per check', async () => {
    tick(26 * 3_600_000);
    // A run holds the ledger: the seal cannot happen, so it is overdue.
    const l = openLedger();
    const busy = await runScheduledSeal({ stateDir: dir, site, schedule, sinks: {}, now });
    expect(busy).toMatchObject({ overdue: true, overdueIncident: 'ledger-busy' });
    expect(busy.busy).toMatch(/already open in this process/);
    l.close();
    const due = sealDue(dir, { shiftChanges: [], maxAgeDays: 1 }, now());
    expect(due.overdue).toBe(true);
    const { recordSealOverdue } = await import('../aegis/pilot/index.js');
    expect(recordSealOverdue(dir, site, due, now)).toBe('written');
    expect(recordSealOverdue(dir, site, due, now)).toBe('already-recorded');
    expect(incidents('seal-overdue')).toHaveLength(1);
  });
});

describe('anchor export', () => {
  let server: Server | null = null;
  afterEach(async () => {
    if (server) await new Promise((r) => server?.close(r));
    server = null;
  });

  it('sends every seal anchor to RFC 5424 syslog over TCP and to an append-only file', async () => {
    const sys = await syslogServer();
    server = sys.server;
    const file = join(base, 'siem', 'anchors.jsonl');
    const sinks = { file, syslog: { host: '127.0.0.1', port: sys.port, tls: false } };
    for (let i = 0; i < 2; i++) {
      tick();
      const l = openLedger();
      l.append({ event_type: 'system.heartbeat', trace_id: 't' });
      l.close();
      tick();
      await runScheduledSeal({
        stateDir: dir,
        site,
        schedule: { shiftChanges: [], maxAgeDays: 1 },
        sinks,
        now: () => new Date(clock.getTime() + 25 * 3_600_000 * (i + 1)),
      });
    }
    const seals = readSeals(dir);
    expect(seals).toHaveLength(2);
    const lines = readFileSync(file, 'utf8')
      .trim()
      .split('\n')
      .map((l) => JSON.parse(l));
    expect(lines.map((r) => r.index)).toEqual([0, 1]);
    expect(Object.keys(lines[0]).sort()).toEqual(
      ['head_hash', 'index', 'seal_digest', 'sealedAt', 'siteId'].sort(),
    );
    expect(lines[1]).toMatchObject({ siteId: 'anchor-test', head_hash: seals[1].headHash });
    expect(sys.messages).toHaveLength(2);
    expect(sys.messages[0]).toMatch(/^<133>1 \S+ anchor-test aegis-pilot - SEAL_ANCHOR - \uFEFF\{/);
    expect(JSON.parse(sys.messages[1].split('\uFEFF')[1])).toEqual(lines[1]);
  });

  it('a changed sink destination starts again from the first anchor (no inherited progress)', async () => {
    const a = join(base, 'siem', 'a.jsonl');
    const b = join(base, 'siem', 'b.jsonl');
    for (let i = 0; i < 2; i++) {
      tick();
      const l = openLedger();
      l.append({ event_type: 'authority.revoke', trace_id: 't', detail: { credential_id: 'x' } });
      l.close();
      tick();
      await runScheduledSeal({ stateDir: dir, site, schedule, sinks: { file: a }, now });
    }
    expect(readFileSync(a, 'utf8').trim().split('\n')).toHaveLength(2);
    expect(anchorStatus(dir, { file: b }).sinks[0]).toMatchObject({ pending: 2, exported: 0 });
    tick();
    const r = await anchorExport({ stateDir: dir, site, sinks: { file: b }, now });
    expect(r.exportedNow).toBe(2);
    expect(
      readFileSync(b, 'utf8')
        .trim()
        .split('\n')
        .map((x) => JSON.parse(x).index),
    ).toEqual([0, 1]);
    expect(r.sinks[0].destination).toBe(`file:${b}`);
    expect(incidents('anchor-sink-changed')).toHaveLength(1);
  });

  it('a failed export is an incident, never blocks the seal, and is backfilled in order with the gap reported', async () => {
    const down = await closedPort();
    const file = join(base, 'siem', 'anchors.jsonl');
    const sinksDown = {
      file,
      syslog: { host: '127.0.0.1', port: down, tls: false, timeoutMs: 2000 },
    };
    const sealOnce = async (sinks: typeof sinksDown) => {
      tick();
      const l = openLedger();
      l.append({ event_type: 'authority.revoke', trace_id: 't', detail: { credential_id: 'x' } });
      l.close();
      tick();
      return runScheduledSeal({ stateDir: dir, site, schedule, sinks, now });
    };
    const first = await sealOnce(sinksDown);
    expect(first.seal?.sealed).toBe(true);
    expect(first.anchor.failing).toEqual(['syslog']);
    const second = await sealOnce(sinksDown);
    expect(second.seal?.sealed).toBe(true);
    expect(incidents('anchor-export-failed')).toHaveLength(1);
    expect(anchorStatus(dir, sinksDown).sinks.find((s) => s.sink === 'syslog')).toMatchObject({
      pending: 2,
      exported: 0,
    });
    expect(readAnchorQueue(dir).map((r) => r.index)).toEqual([0, 1]);

    const sys = await syslogServer(down);
    server = sys.server;
    tick(60_000);
    const back = await anchorExport({
      stateDir: dir,
      site,
      sinks: { file, syslog: { host: '127.0.0.1', port: down, tls: false } },
      now,
    });
    expect(back.failing).toEqual([]);
    expect(sys.messages.map((m) => JSON.parse(m.split('\uFEFF')[1]).index)).toEqual([0, 1]);
    expect(back.gaps).toEqual([
      {
        sink: 'syslog',
        firstFailedAt: first.anchor.sinks.find((s) => s.sink === 'syslog')?.failingSince,
        firstSuccessAt: now().toISOString(),
        backfilled: 2,
      },
    ]);
    expect(incidents('anchor-export-recovered')).toHaveLength(1);
    // The file sink never failed and holds each anchor once.
    expect(readFileSync(file, 'utf8').trim().split('\n')).toHaveLength(2);
    // The gap travels with the evidence bundle, under the signed manifest.
    const out = join(base, 'bundle');
    const m = exportBundle(dir, out, now());
    expect(m.files.map((f) => f.path)).toEqual(
      expect.arrayContaining(['anchor/queue.jsonl', 'anchor/state.json']),
    );
    const st = JSON.parse(readFileSync(join(out, 'anchor', 'state.json'), 'utf8'));
    expect(st.gaps).toHaveLength(1);
    expect(verifyBundle(out, site.manifest.keyId, now()).failures).toEqual([]);
  });
});
