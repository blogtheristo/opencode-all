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

import { mkdtempSync, readdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CAP_AGENT_STOP,
  CAP_DECISION,
  commandBodiesDir,
  createDecisionCommand,
  createStopCommand,
  type Credential,
  DecisionAuthority,
  eraseCommandBody,
  EvidenceLedger,
  exportBundle,
  generateEd25519,
  GENESIS_HASH,
  KillAuthority,
  type LedgerEvent,
  privateKeyFromPem,
  readLedgerEvents,
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
    const ledger = openLedger();
    try {
      tick();
      const tomb = eraseCommandBody(
        dir,
        ledger,
        String(f.stopEvent.detail.command_digest),
        'data-subject-request',
        now(),
      );
      expect(Object.keys(tomb).sort()).toEqual(['command_digest', 'erased_at', 'reason_code']);
      writeWormTombstone(f.worm, tomb);
    } finally {
      ledger.close();
    }
    const ok = exportAndVerify('redacted', f.worm);
    expect(ok.failures).toEqual([]);
    expect(ok.operatorCopies?.matched).toBe(3);

    unlinkSync(join(commandBodiesDir(dir), `${String(f.decideEvent.detail.command_digest)}.json`));
    const bad = exportAndVerify('missing');
    expect(bad.ok).toBe(false);
    expect(bad.failures.join('\n')).toMatch(/^COMMAND_BODY_MISSING: active seq \d+ human\.decide/m);
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
