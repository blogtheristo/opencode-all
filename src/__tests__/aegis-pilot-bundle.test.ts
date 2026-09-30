// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
// Audit trail: git log -- src/__tests__/aegis-pilot-bundle.test.ts
/**
 * DWS-AEGIS-PILOT-001 — A2 evidence bundle: export and offline verification.
 *
 * First version by the DGX loop (#2256); rewritten in the Claude Code takeover
 * (30.09.2026) after review found sealed segments never exported, seals never
 * checked, acceptance records failing their own manifest, and a key pin that a
 * substituted key passed. The auditor walks the bundle with no DWS access, so
 * every test here is a way a bundle could lie to them.
 */

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  EvidenceLedger,
  generateEd25519,
  keyId,
  privateKeyFromPem,
  sealActiveSegment,
  SiteAuthority,
  statePaths,
} from '../aegis/pilot/index.js';
import { canonicalJSON, sha256, signPayload } from '../aegis/pilot/crypto.js';
import { exportBundle, verifyBundle } from '../aegis/pilot/bundle.js';

let base: string;
let dir: string;
let out: string;
let site: SiteAuthority;
const clock = new Date('2026-10-01T00:00:00.000Z');
const now = () => new Date(clock);

function ledger() {
  return EvidenceLedger.open(statePaths(dir).ledger, {
    siteId: site.manifest.siteId,
    orgId: 'org-test',
    signer: (h) => site.sign(h),
    publicKey: site.publicKey,
    now,
  });
}

function append(types: Parameters<EvidenceLedger['append']>[0]['event_type'][]): void {
  const l = ledger();
  for (const event_type of types) {
    clock.setTime(clock.getTime() + 1000);
    l.append({ event_type, trace_id: 't' });
  }
  l.close();
}

/** A signed acceptance record on disk, chained into the ledger the way acceptance.ts does. */
function acceptanceRecord(opts: { chain?: boolean; sign?: boolean } = {}): string {
  const record = { v: 1, recordId: 'rec-1', siteId: site.manifest.siteId, outcome: 'PASS' };
  if (opts.chain !== false) {
    const l = ledger();
    clock.setTime(clock.getTime() + 1000);
    l.append({
      event_type: 'acceptance.record',
      trace_id: 't',
      output_digest: sha256(canonicalJSON(record)),
      detail: { record_id: record.recordId },
    });
    l.close();
  }
  const p = statePaths(dir).acceptance;
  mkdirSync(p, { recursive: true });
  const body =
    opts.sign === false
      ? { record }
      : { record, signature: site.sign(record), signerKeyId: site.manifest.keyId };
  writeFileSync(join(p, 'rec-1.json'), JSON.stringify(body));
  return 'acceptance/rec-1.json';
}

beforeEach(() => {
  base = mkdtempSync(join(tmpdir(), 'aegis-bundle-'));
  dir = join(base, 's');
  out = join(base, 'bundle');
  site = SiteAuthority.init(dir, 'bundle-test', clock);
  append(['workflow.start', 'agent.decide']);
});
afterEach(() => rmSync(base, { recursive: true, force: true }));

describe('evidence bundle — a clean bundle', () => {
  it('verifies offline, pinned to the key id computed from the bundled public key', () => {
    exportBundle(dir, out);
    expect(existsSync(join(out, 'site', 'site.key'))).toBe(false);
    const r = verifyBundle(out, site.manifest.keyId);
    expect(r.failures).toEqual([]);
    expect(r.ok).toBe(true);
  });

  it('carries a signed acceptance record under its own path and verifies it', () => {
    const rel = acceptanceRecord();
    exportBundle(dir, out);
    expect(existsSync(join(out, rel))).toBe(true);
    const manifest = JSON.parse(readFileSync(join(out, 'manifest.json'), 'utf8'));
    expect(manifest.files.map((f: { path: string }) => f.path)).toContain(rel);
    expect(verifyBundle(out).failures).toEqual([]);
  });

  it('carries every sealed segment and its seal, and verifies the seal chain', () => {
    sealActiveSegment({ stateDir: dir, site, force: true, now });
    append(['agent.decide']);
    exportBundle(dir, out);
    const seg = readdirSync(join(out, 'ledger', 'segments'));
    expect(seg).toEqual(expect.arrayContaining(['000000.jsonl', '000000.seal.json']));
    expect(verifyBundle(out).failures).toEqual([]);
  });
});

describe('evidence bundle — a bundle that lies', () => {
  it('fails on an edited ledger line', () => {
    exportBundle(dir, out);
    const p = join(out, 'ledger', 'article12.jsonl');
    writeFileSync(p, readFileSync(p, 'utf8').replace('workflow.start', 'workflow.failed'));
    const r = verifyBundle(out);
    expect(r.ok).toBe(false);
    expect(r.failures.join('\n')).toMatch(/hash mismatch/);
  });

  it('fails on a removed file and on an extra file, at any depth', () => {
    exportBundle(dir, out);
    rmSync(join(out, 'ledger', 'article12.jsonl'));
    expect(verifyBundle(out).failures.join('\n')).toMatch(/missing from bundle/);
    exportBundle(dir, join(base, 'b2'));
    mkdirSync(join(base, 'b2', 'ledger', 'extra'), { recursive: true });
    writeFileSync(join(base, 'b2', 'ledger', 'extra', 'x.json'), '{}');
    expect(verifyBundle(join(base, 'b2')).failures.join('\n')).toMatch(/not in manifest/);
  });

  it('fails when a sealed segment or its seal is removed or edited', () => {
    sealActiveSegment({ stateDir: dir, site, force: true, now });
    exportBundle(dir, out);
    rmSync(join(out, 'ledger', 'segments', '000000.jsonl'));
    expect(verifyBundle(out).ok).toBe(false);

    // A consistent removal (file and manifest entry both gone) still breaks the seal chain.
    const b2 = join(base, 'b2');
    exportBundle(dir, b2);
    const sealPath = join(b2, 'ledger', 'segments', '000000.seal.json');
    const seal = JSON.parse(readFileSync(sealPath, 'utf8'));
    writeFileSync(sealPath, JSON.stringify({ ...seal, count: seal.count + 1 }));
    expect(verifyBundle(b2).ok).toBe(false);
  });

  it('fails the pin when the site key is swapped and the manifest re-signed (key substitution)', () => {
    exportBundle(dir, out);
    const pinned = site.manifest.keyId;
    const attacker = generateEd25519();
    const siteJson = JSON.parse(readFileSync(join(out, 'site', 'site.json'), 'utf8'));
    const forgedSite = { ...siteJson, publicKeyPem: attacker.publicKeyPem, keyId: pinned };
    writeFileSync(join(out, 'site', 'site.json'), JSON.stringify(forgedSite));
    const manifest = JSON.parse(readFileSync(join(out, 'manifest.json'), 'utf8'));
    const raw = readFileSync(join(out, 'site', 'site.json'));
    manifest.files = manifest.files.map((f: { path: string }) =>
      f.path === 'site/site.json' ? { ...f, sha256: sha256(raw), bytes: raw.length } : f,
    );
    manifest.keyId = pinned;
    writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest));
    writeFileSync(
      join(out, 'manifest.sig'),
      signPayload(manifest, privateKeyFromPem(attacker.privateKeyPem)),
    );
    const r = verifyBundle(out, pinned);
    expect(r.ok).toBe(false);
    expect(r.failures.join('\n')).toMatch(/key id/);
    expect(keyId(attacker.publicKeyPem)).not.toBe(pinned);
  });

  it('fails a wrong pin', () => {
    exportBundle(dir, out);
    expect(verifyBundle(out, 'wrong-key-id').failures.join('\n')).toMatch(/key id mismatch/);
  });

  it('fails an unsigned acceptance record and one the ledger never recorded', () => {
    acceptanceRecord({ sign: false });
    exportBundle(dir, out);
    expect(verifyBundle(out).failures.join('\n')).toMatch(/acceptance record .*signature/);

    rmSync(base, { recursive: true, force: true });
    base = mkdtempSync(join(tmpdir(), 'aegis-bundle-'));
    dir = join(base, 's');
    out = join(base, 'bundle');
    site = SiteAuthority.init(dir, 'bundle-test', clock);
    append(['workflow.start']);
    acceptanceRecord({ chain: false });
    exportBundle(dir, out);
    expect(verifyBundle(out).failures.join('\n')).toMatch(/not recorded in the ledger/);
  });

  it('fails a bundle with no ledger at all', () => {
    exportBundle(dir, out);
    rmSync(join(out, 'ledger', 'article12.jsonl'));
    const manifest = JSON.parse(readFileSync(join(out, 'manifest.json'), 'utf8'));
    manifest.files = manifest.files.filter(
      (f: { path: string }) => f.path !== 'ledger/article12.jsonl',
    );
    writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest));
    writeFileSync(join(out, 'manifest.sig'), site.sign(manifest));
    expect(verifyBundle(out).failures.join('\n')).toMatch(/ledger/);
  });

  it('refuses a manifest path outside the bundle layout', () => {
    exportBundle(dir, out);
    const manifest = JSON.parse(readFileSync(join(out, 'manifest.json'), 'utf8'));
    manifest.files.push({ path: '../../etc/passwd', sha256: 'a'.repeat(64), bytes: 1 });
    writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest));
    writeFileSync(join(out, 'manifest.sig'), site.sign(manifest));
    expect(verifyBundle(out).ok).toBe(false);
  });
});

describe('evidence bundle — the reading path (C6)', () => {
  function v2Record(guide: string) {
    const record = {
      v: 2,
      recordId: 'rec-2',
      siteId: site.manifest.siteId,
      provenance: { documents: { auditorGuide: guide } },
    };
    const l = ledger();
    clock.setTime(clock.getTime() + 1000);
    l.append({
      event_type: 'acceptance.record',
      trace_id: 't',
      output_digest: sha256(canonicalJSON(record)),
      detail: { record_id: record.recordId },
    });
    l.close();
    mkdirSync(statePaths(dir).acceptance, { recursive: true });
    writeFileSync(
      join(statePaths(dir).acceptance, 'rec-2.json'),
      JSON.stringify({ record, signature: site.sign(record) }),
    );
  }

  it('ships the auditor guide in the bundle, covered by the signed manifest', () => {
    exportBundle(dir, out);
    expect(readFileSync(join(out, 'AUDITOR_GUIDE.md'), 'utf8')).toMatch(/^Version: \d/m);
    expect(verifyBundle(out).failures).toEqual([]);
    writeFileSync(join(out, 'AUDITOR_GUIDE.md'), 'rewritten');
    expect(verifyBundle(out).failures.join('\n')).toMatch(/AUDITOR_GUIDE\.md/);
  });

  it('fails when the bundled guide is older than the guide a record was signed against', () => {
    v2Record('99.0');
    exportBundle(dir, out);
    expect(verifyBundle(out).failures.join('\n')).toMatch(/auditor guide .* older/);
  });

  it('accepts a record signed against the bundled guide version', () => {
    v2Record('1.0');
    exportBundle(dir, out);
    expect(verifyBundle(out).failures).toEqual([]);
  });
});

describe('evidence bundle — export refuses', () => {
  it('a non-empty output directory', () => {
    mkdirSync(out);
    writeFileSync(join(out, 'x'), 'x');
    expect(() => exportBundle(dir, out)).toThrow(/non-empty/);
  });

  it('a link in the state directory (never follows it)', () => {
    mkdirSync(statePaths(dir).acceptance, { recursive: true });
    symlinkSync('/etc/hostname', join(statePaths(dir).acceptance, 'leak.json'));
    expect(() => exportBundle(dir, out)).toThrow(/not a regular file/);
  });

  it('an evidence chain that does not verify', () => {
    const p = statePaths(dir).ledger;
    writeFileSync(p, readFileSync(p, 'utf8').replace('workflow.start', 'workflow.failed'));
    expect(() => exportBundle(dir, out)).toThrow(/does not verify/);
  });
});
