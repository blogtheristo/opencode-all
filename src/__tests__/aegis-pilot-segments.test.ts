// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- src/__tests__/aegis-pilot-segments.test.ts
/**
 * DWS-AEGIS-PILOT-001, plan item C2 — ledger segments and retention. The
 * promises: a sealed segment keeps its chain and links to the next one; any
 * edit, removal or reordering is detected; retention follows Article 12
 * Logging Standard §4; nothing is deleted without an explicit confirm, before
 * its retention ends, or from a chain that does not verify.
 */

import {
  appendFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  EvidenceLedger,
  pruneExpiredSegments,
  readSeals,
  retentionClassOf,
  sealActiveSegment,
  segmentPaths,
  SiteAuthority,
  statePaths,
  verifySegments,
} from '../aegis/pilot/index.js';

const sha256Hex = (b: Buffer) => createHash('sha256').update(b).digest('hex');

let dir: string;
let site: SiteAuthority;
let clock: Date;
const now = () => new Date(clock);
const days = (n: number) => n * 86_400_000;

function appendEvents(types: Parameters<EvidenceLedger['append']>[0]['event_type'][]): void {
  const ledger = EvidenceLedger.open(statePaths(dir).ledger, {
    siteId: site.manifest.siteId,
    orgId: 'org-test',
    signer: (h) => site.sign(h),
    publicKey: site.publicKey,
    now,
  });
  for (const event_type of types) {
    clock = new Date(clock.getTime() + 1000);
    ledger.append({ event_type, trace_id: 't' });
  }
  ledger.close();
}

function seal(force = true) {
  clock = new Date(clock.getTime() + 1000);
  return sealActiveSegment({ stateDir: dir, site, force, now });
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'aegis-seg-'));
  clock = new Date('2026-10-01T00:00:00.000Z');
  site = SiteAuthority.init(join(dir, 's'), 'seg-test', clock);
  dir = join(dir, 's');
  appendEvents(['workflow.start', 'agent.decide']);
});

afterEach(() => {
  rmSync(join(dir, '..'), { recursive: true, force: true });
});

describe('sealing and rolling', () => {
  it('seals the active segment, starts a linked one and verifies end to end', () => {
    const r = seal();
    expect(r.sealed).toBe(true);
    if (!r.sealed) return;
    expect(existsSync(segmentPaths(dir).file(0))).toBe(true);
    const active = readFileSync(statePaths(dir).ledger, 'utf8').trim().split('\n');
    expect(active).toHaveLength(1);
    const genesis = JSON.parse(active[0]);
    expect(genesis.event_type).toBe('system.genesis');
    expect(genesis.detail.prev_segment).toMatchObject({ index: 0, head_hash: r.seal.headHash });
    expect(genesis.detail.org_id).toBe('org-test');

    appendEvents(['agent.decide']);
    const r2 = seal();
    expect(r2.sealed && r2.seal.prevSeal).toBeTruthy();
    const v = verifySegments(dir, site, now());
    expect(v.reason).toBeNull();
    expect(v.valid).toBe(true);
    expect(v.segments.map((s) => s.index)).toEqual([0, 1]);
  });

  it('does not roll below the size and age limits, and rolls when either is reached', () => {
    expect(seal(false).sealed).toBe(false);
    const bySize = sealActiveSegment({ stateDir: dir, site, maxBytes: 10, now });
    expect(bySize.sealed).toBe(true);
    clock = new Date(clock.getTime() + days(31));
    expect(sealActiveSegment({ stateDir: dir, site, now }).sealed).toBe(true);
  });

  it('refuses to seal while another writer holds the ledger', () => {
    const writer = EvidenceLedger.open(statePaths(dir).ledger, {
      siteId: 'seg-test',
      orgId: 'org-test',
      signer: (h) => site.sign(h),
      publicKey: site.publicKey,
    });
    try {
      expect(() => seal()).toThrow(/already open|locked/);
    } finally {
      writer.close();
    }
    expect(readSeals(dir)).toHaveLength(0);
  });

  it('refuses to seal a tampered active segment', () => {
    appendFileSync(statePaths(dir).ledger, '{"seq":99}\n');
    expect(() => seal()).toThrow(/failed verification|Refusing/);
    expect(readSeals(dir)).toHaveLength(0);
  });
});

describe('tamper detection across segments', () => {
  beforeEach(() => {
    seal();
    appendEvents(['agent.decide']);
    seal();
  });

  it('detects an edited sealed segment', () => {
    const f = segmentPaths(dir).file(0);
    writeFileSync(f, readFileSync(f, 'utf8').replace('agent.decide', 'tool.invoke'));
    const v = verifySegments(dir, site, now());
    expect(v.valid).toBe(false);
    expect(v.segments[0].reason).toMatch(/hash mismatch/);
  });

  it('detects a segment file removed before its retention ends', () => {
    unlinkSync(segmentPaths(dir).file(1));
    const v = verifySegments(dir, site, now());
    expect(v.valid).toBe(false);
    expect(v.reason).toMatch(/missing before its retention ends/);
  });

  it('detects a removed seal and its segment (the chain has a hole)', () => {
    unlinkSync(segmentPaths(dir).seal(1));
    unlinkSync(segmentPaths(dir).file(1));
    const v = verifySegments(dir, site, now());
    expect(v.valid).toBe(false);
    expect(v.reason).toMatch(/does not link/);
  });

  it('detects an active segment replaced by a fresh, unlinked chain', () => {
    unlinkSync(statePaths(dir).ledger);
    appendEvents(['agent.decide']);
    const v = verifySegments(dir, site, now());
    expect(v.valid).toBe(false);
    expect(v.reason).toMatch(/active segment genesis does not link/);
  });

  it('detects deletion of every seal and every sealed segment', () => {
    for (const i of [0, 1]) {
      unlinkSync(segmentPaths(dir).seal(i));
      unlinkSync(segmentPaths(dir).file(i));
    }
    const v = verifySegments(dir, site, now());
    expect(v.valid).toBe(false);
    expect(v.reason).toMatch(/no seals exist/);
  });

  it('catches a rollback of the newest segment when an external anchor is given', () => {
    const anchor = verifySegments(dir, site, now()).lastSealDigest ?? '';
    // Roll back: drop segment 1 and its seal, restore segment 1's content as active.
    writeFileSync(statePaths(dir).ledger, readFileSync(segmentPaths(dir).file(1)));
    unlinkSync(segmentPaths(dir).seal(1));
    unlinkSync(segmentPaths(dir).file(1));
    // Residual (runbook §8): without the key nobody can forge, but a rollback of the
    // newest segment verifies on its own. Only the anchor held outside catches it.
    expect(verifySegments(dir, site, now()).valid).toBe(true);
    const v = verifySegments(dir, site, now(), { expectSealDigest: anchor });
    expect(v.valid).toBe(false);
    expect(v.reason).toMatch(/anchored seal not found/);
  });

  it('completes a roll interrupted after the seal was written, without a new seal', () => {
    // State after a crash between writing seal 2 and rolling: active is the sealed
    // content and segment file 2 may or may not exist.
    appendEvents(['agent.decide']);
    const r = seal();
    if (!r.sealed) throw new Error('expected a seal');
    writeFileSync(statePaths(dir).ledger, readFileSync(segmentPaths(dir).file(2)));
    unlinkSync(segmentPaths(dir).file(2));
    expect(verifySegments(dir, site, now()).reason).toMatch(/interrupted roll/);

    const again = seal(false);
    expect(again.sealed && again.recovered).toBe(true);
    expect(readSeals(dir)).toHaveLength(3);
    expect(verifySegments(dir, site, now(), { expectSealDigest: r.anchor.sealDigest }).valid).toBe(
      true,
    );
  });

  it('refuses to seal over a planted seal that matches the active file (never signs a link to it)', () => {
    const active = readFileSync(statePaths(dir).ledger);
    const real = JSON.parse(readFileSync(segmentPaths(dir).seal(1), 'utf8'));
    const forged = { ...real, index: 2, file: '000002.jsonl', sha256: sha256Hex(active) };
    writeFileSync(segmentPaths(dir).seal(2), JSON.stringify(forged));
    expect(() => seal()).toThrow(/refusing to seal/);
    expect(existsSync(segmentPaths(dir).file(2))).toBe(false);
    expect(readFileSync(statePaths(dir).ledger)).toEqual(active);
  });

  it('quarantines a planted segment file during recovery and records it in the genesis', () => {
    appendEvents(['agent.decide']);
    seal();
    writeFileSync(statePaths(dir).ledger, readFileSync(segmentPaths(dir).file(2)));
    writeFileSync(segmentPaths(dir).file(2), 'planted\n');
    expect(verifySegments(dir, site, now()).reason).toMatch(/interrupted roll/);

    const again = seal(false);
    expect(again.sealed && again.recovered).toBe(true);
    const genesis = JSON.parse(readFileSync(statePaths(dir).ledger, 'utf8').split('\n')[0]);
    expect(genesis.detail.recovered_roll).toBe(2);
    expect(genesis.detail.quarantined).toMatch(/^quarantine-000002\.jsonl-/);
    expect(existsSync(join(segmentPaths(dir).dir, genesis.detail.quarantined))).toBe(true);
    expect(verifySegments(dir, site, now()).valid).toBe(true);
  });

  it('reports a malformed seal file instead of throwing, and never reads outside the segment dir', () => {
    writeFileSync(segmentPaths(dir).seal(1), '{ torn');
    const v = verifySegments(dir, site, now());
    expect(v.valid).toBe(false);
    expect(v.reason).toMatch(/unreadable seal/);

    const p = segmentPaths(dir).seal(0);
    writeFileSync(p, JSON.stringify({ ...JSON.parse(readFileSync(p, 'utf8')), index: '../../x' }));
    expect(verifySegments(dir, site, now()).segments[0].reason).toMatch(/index differs/);
  });

  it('detects a forged seal signed by another key', () => {
    const other = SiteAuthority.init(join(dir, '..', 'other'), 'other-site');
    const p = segmentPaths(dir).seal(0);
    const s = JSON.parse(readFileSync(p, 'utf8'));
    const { sig: _sig, ...body } = s;
    writeFileSync(p, JSON.stringify({ ...body, sig: other.sign(body) }));
    expect(verifySegments(dir, site, now()).segments[0].reason).toMatch(/signature invalid/);
  });
});

describe('retention (Article 12 Logging Standard §4)', () => {
  it('classifies routine events 6 months, stops and acceptance 5 years, unknown types long', () => {
    expect(retentionClassOf('agent.decide')).toBe('risk-6m');
    expect(retentionClassOf('system.heartbeat')).toBe('risk-6m');
    expect(retentionClassOf('human.override')).toBe('identity-5y');
    expect(retentionClassOf('system.agent_terminated')).toBe('identity-5y');
    expect(retentionClassOf('acceptance.record')).toBe('identity-5y');
    expect(retentionClassOf('human.decide')).toBe('identity-5y');
  });

  it('keeps a segment for its longest class', () => {
    const short = seal();
    appendEvents(['human.override']);
    const long = seal();
    if (!short.sealed || !long.sealed) throw new Error('expected seals');
    expect(short.seal.retention.retainUntil.slice(0, 7)).toBe('2027-04');
    expect(long.seal.retention.retainUntil.slice(0, 4)).toBe('2031');
  });

  it('prunes only with the listed token, only after retention, keeps the seal and records the prune', () => {
    seal();
    appendEvents(['human.override']);
    seal();
    const early = pruneExpiredSegments({ stateDir: dir, site, now });
    expect(early.expired).toHaveLength(0);
    expect(early.confirmToken).toBeNull();

    clock = new Date('2027-06-01T00:00:00.000Z');
    const dry = pruneExpiredSegments({ stateDir: dir, site, now });
    expect(dry.expired.map((e) => e.index)).toEqual([0]);
    expect(existsSync(segmentPaths(dir).file(0))).toBe(true);
    expect(() =>
      pruneExpiredSegments({ stateDir: dir, site, confirm: 'wrong-token', now }),
    ).toThrow(/confirm token/);
    expect(existsSync(segmentPaths(dir).file(0))).toBe(true);

    const done = pruneExpiredSegments({
      stateDir: dir,
      site,
      confirm: dry.confirmToken ?? '',
      now,
    });
    expect(done.expired.map((e) => e.index)).toEqual([0]);
    expect(existsSync(segmentPaths(dir).file(0))).toBe(false);
    expect(existsSync(segmentPaths(dir).seal(0))).toBe(true);
    expect(existsSync(segmentPaths(dir).file(1))).toBe(true);
    expect(readFileSync(statePaths(dir).ledger, 'utf8')).toContain('system.segment_pruned');

    const v = verifySegments(dir, site, now());
    expect(v.valid).toBe(true);
    expect(v.segments[0].pruned).toBe(true);
    expect(done.verifiedAfter).toBe(true);
  });

  it('refuses to prune a chain that does not verify', () => {
    seal();
    const f = segmentPaths(dir).file(0);
    writeFileSync(f, readFileSync(f, 'utf8').replace('agent.decide', 'tool.invoke'));
    clock = new Date('2028-01-01T00:00:00.000Z');
    expect(() => pruneExpiredSegments({ stateDir: dir, site, confirm: 'x', now })).toThrow(
      /refusing to prune/,
    );
    expect(existsSync(f)).toBe(true);
  });

  it('refuses to prune when the clock is behind the newest ledger event', () => {
    seal();
    clock = new Date('2026-01-01T00:00:00.000Z');
    expect(() => pruneExpiredSegments({ stateDir: dir, site, now })).toThrow(/clock is behind/);
  });
});
