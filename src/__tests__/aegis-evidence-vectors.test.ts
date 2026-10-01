// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
// Audit trail: git log -- src/__tests__/aegis-evidence-vectors.test.ts
/**
 * docs/aegis/EVIDENCE_FORMAT_v1.md test vectors, reproduced by the kit's own TS code.
 * The vectors are written by scripts/aegis-evidence-test-vectors.mjs, which does not
 * import the kit; tools/aegis-verify-py reproduces them a third time. The promises:
 *   - the generator is deterministic (the committed files are what it writes);
 *   - the kit's canonical JSON, hashes and signatures reproduce expected.json byte for byte;
 *   - verifyBundle accepts the bundle and the operator copies, and rejects a one-byte change;
 *   - every negative case (a ledger re-signed with the site key after a forgery) is rejected
 *     with its named failure, and an erased body with its evidence.redacted record passes.
 */

import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash, createPrivateKey, type KeyObject } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import {
  canonicalJSON,
  keyId,
  publicKeyFromPem,
  publicPemOf,
  sha256,
  signPayload,
} from '../aegis/pilot/crypto.js';
import {
  commandDigest,
  commandFrame,
  type CommandKind,
  type Credential,
  type LedgerEvent,
  readLedgerEvents,
  type SiteManifest,
  splitCommand,
  verifyBundle,
  verifyLedger,
  verifyOperatorEvidence,
} from '../aegis/pilot/index.js';

const VECTORS = 'docs/aegis/evidence-test-vectors';
const BUNDLE = join(VECTORS, 'bundle');
const NOW = new Date('2036-10-01T00:00:00Z'); // ten years on
const read = (p: string) => readFileSync(p, 'utf8');
const expectedText = read(join(VECTORS, 'expected.json'));
const expected = JSON.parse(expectedText) as {
  cases: Array<{
    name: string;
    ledger: string;
    expect: string;
    omit_bodies?: string[];
    extra_bodies?: string;
  }>;
};
const tmp = mkdtempSync(join(tmpdir(), 'aegis-vectors-'));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

const PKCS8_ED25519 = Buffer.from('302e020100300506032b657004220420', 'hex');
const seedLabel = (name: string) => `aegis-evidence-test-vectors/v1 ${name} TEST-ONLY`;
function testKey(name: string): { seed: Buffer; key: KeyObject; pem: string } {
  const seed = createHash('sha256').update(seedLabel(name)).digest();
  const key = createPrivateKey({
    key: Buffer.concat([PKCS8_ED25519, seed]),
    format: 'der',
    type: 'pkcs8',
  });
  return { seed, key, pem: publicPemOf(key) };
}

function files(root: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else out.push(relative(root, p));
    }
  };
  walk(root);
  return out.sort();
}

const bundleJson = <T>(rel: string) => JSON.parse(read(join(BUNDLE, rel))) as T;

describe('evidence format v1 test vectors', () => {
  it('the generator is deterministic: it writes exactly the committed files', () => {
    const out = join(tmp, 'regen');
    const r = spawnSync('node', ['scripts/aegis-evidence-test-vectors.mjs', '--out', out], {
      encoding: 'utf8',
    });
    expect(r.status, r.stderr).toBe(0);
    expect(files(out)).toEqual(files(VECTORS));
    for (const f of files(VECTORS)) expect(read(join(out, f)), f).toBe(read(join(VECTORS, f)));
  });

  it('the kit reproduces expected.json byte for byte', () => {
    const keys = {
      site: testKey('site'),
      'operator-a': testKey('operator-a'),
      'operator-b': testKey('operator-b'),
    };
    const siteKey = keys.site.key;
    const segment = readLedgerEvents(join(BUNDLE, 'ledger/segments/000000.jsonl'));
    const active = readLedgerEvents(join(BUNDLE, 'ledger/article12.jsonl'));
    const creds = readdirSync(join(BUNDLE, 'credentials'))
      .sort()
      .map((f) => bundleJson<Credential>(`credentials/${f}`));
    const keyOfCred = new Map(
      creds.map((c) => [
        c.credentialId,
        Object.values(keys).find((k) => k.pem.trim() === c.subjectPublicKeyPem?.trim())?.key,
      ]),
    );
    const eventEntries = (label: string, events: LedgerEvent[]) =>
      events.map((e) => {
        const { event_hash: _h, sig: _s, ...body } = e;
        const hash = sha256(e.prev_hash + canonicalJSON(body));
        return {
          segment: label,
          seq: e.seq,
          event_type: e.event_type,
          canonical: canonicalJSON(body),
          event_hash: hash,
          sig: signPayload(hash, siteKey),
        };
      });
    const commands = segment
      .filter((e) => e.event_type === 'human.decide' || e.event_type === 'human.override')
      .map((e) => {
        const signed = bundleJson<Record<string, unknown>>(
          `command-bodies/${String(e.detail.command_digest)}.json`,
        );
        const { body } = splitCommand(signed);
        const kind: CommandKind = e.event_type === 'human.decide' ? 'decide' : 'stop';
        const cred = creds.find((c) => c.credentialId === body.operatorCredentialId) as Credential;
        const opKey = keyOfCred.get(cred.credentialId) as KeyObject;
        const digest = commandDigest(body);
        const frame = commandFrame(
          kind,
          String(body.commandId),
          String(body.issuedAt),
          cred.role ?? null,
          digest,
        );
        return {
          kind,
          command_id: body.commandId,
          canonical_body: canonicalJSON(body),
          command_digest: digest,
          operator_signature: signPayload(body, opKey),
          frame_canonical: canonicalJSON(frame),
          digest_signature: signPayload(frame, opKey),
        };
      });
    const seal = bundleJson<Record<string, unknown>>('ledger/segments/000000.seal.json');
    const { sig: _sealSig, ...sealBody } = seal;
    const manifest = bundleJson<Record<string, unknown>>('manifest.json');
    const doc = {
      format: 'aegis-evidence-test-vectors/1',
      spec: 'docs/aegis/EVIDENCE_FORMAT_v1.md',
      warning:
        'TEST-ONLY. Every private key here is sha256(seed_label) and is public. Never sign real evidence with it.',
      keys: Object.fromEntries(
        Object.entries(keys).map(([name, k]) => [
          name,
          {
            seed_label: seedLabel(name),
            test_only_seed_hex: k.seed.toString('hex'),
            public_key_pem: k.pem,
            key_id: keyId(k.pem),
          },
        ]),
      ),
      canonicalization: (
        JSON.parse(expectedText) as { canonicalization: Array<{ name: string; json: string }> }
      ).canonicalization.map(({ name, json }) => ({
        name,
        json,
        canonical: canonicalJSON(JSON.parse(json)),
      })),
      credentials: creds.map((c) => {
        const { signature: _sig, ...body } = c;
        return {
          credential_id: c.credentialId,
          canonical_body: canonicalJSON(body),
          signature: signPayload(body, siteKey),
        };
      }),
      commands,
      events: [...eventEntries('000000', segment), ...eventEntries('active', active)],
      seals: [
        {
          index: 0,
          canonical_body: canonicalJSON(sealBody),
          seal_digest: sha256(canonicalJSON(sealBody)),
          sig: signPayload(sealBody, siteKey),
        },
      ],
      manifest: { canonical: canonicalJSON(manifest), sig: signPayload(manifest, siteKey) },
      cases: expected.cases,
    };
    const site = bundleJson<SiteManifest>('site/site.json');
    expect(site.keyId).toBe(keyId(keys.site.pem));
    expect(`${JSON.stringify(doc, null, 2)}\n`).toBe(expectedText);
  });

  it('verifyBundle accepts the bundle and the operator copies ten years on', () => {
    const r = verifyBundle(BUNDLE, keyId(testKey('site').pem), NOW, {
      operatorCopies: join(VECTORS, 'operator-copies'),
    });
    expect(r.failures).toEqual([]);
    expect(r.ok).toBe(true);
    expect(r.operatorCopies).toMatchObject({ checked: 4, matched: 4 });
  });

  it('rejects a one-byte change anywhere in the evidence', () => {
    for (const rel of [
      'ledger/segments/000000.jsonl',
      `command-bodies/${readdirSync(join(BUNDLE, 'command-bodies'))[0]}`,
      'manifest.sig',
    ]) {
      const copy = join(tmp, `flip-${rel.replace(/\W/g, '_')}`);
      cpSync(BUNDLE, copy, { recursive: true });
      const p = join(copy, rel);
      const raw = Buffer.from(readFileSync(p));
      const i = raw.indexOf('"seq":3') >= 0 ? raw.indexOf('"seq":3') + 6 : 10;
      raw[i] = raw[i] === 0x34 ? 0x35 : 0x34;
      writeFileSync(p, raw);
      const r = verifyBundle(copy, keyId(testKey('site').pem), NOW);
      expect(r.ok, rel).toBe(false);
      expect(r.failures.length, rel).toBeGreaterThan(0);
    }
  });

  // The independent Python verifier (tools/aegis-verify-py), when a Python with a working
  // `cryptography` is present: AEGIS_VERIFY_PYTHON names the interpreter (default python3).
  const python = process.env.AEGIS_VERIFY_PYTHON ?? 'python3';
  const pythonOk =
    spawnSync(python, ['-c', 'from cryptography.hazmat.primitives.asymmetric import ed25519'], {
      encoding: 'utf8',
    }).status === 0;
  it.skipIf(!pythonOk)('the Python verifier reproduces the vectors and every case', () => {
    const r = spawnSync(python, ['tools/aegis-verify-py/verify.py', 'vectors', VECTORS], {
      encoding: 'utf8',
    });
    const out = JSON.parse(r.stdout) as { ok: boolean; failures: string[]; cases: unknown[] };
    expect(out.failures).toEqual([]);
    expect(r.status).toBe(0);
    expect(out.cases).toHaveLength(expected.cases.length);
  });

  describe('cases: a ledger re-signed with the site key after a forgery', () => {
    const site = bundleJson<SiteManifest>('site/site.json');
    const credentials = new Map(
      readdirSync(join(BUNDLE, 'credentials')).map((f) => [
        f.replace(/\.json$/, ''),
        bundleJson<Credential>(`credentials/${f}`),
      ]),
    );
    for (const c of expected.cases) {
      it(`${c.name}: ${c.expect}`, () => {
        const path = join(VECTORS, c.ledger);
        // The forgery is well-formed: the chain and every site signature verify.
        const chain = verifyLedger(path, { publicKey: testKeyPublic() });
        expect(chain.valid, chain.reason ?? '').toBe(true);
        const events = readLedgerEvents(path);
        const bodies = new Map<string, Record<string, unknown>>();
        const add = (dir: string) => {
          for (const f of readdirSync(dir))
            bodies.set(f.replace(/\.json$/, ''), JSON.parse(read(join(dir, f))));
        };
        add(join(BUNDLE, 'command-bodies'));
        if (c.extra_bodies) add(join(VECTORS, c.extra_bodies));
        for (const d of c.omit_bodies ?? []) bodies.delete(d);
        // Only bodies this ledger references (an unreferenced one is its own failure).
        const referenced = new Set(events.map((e) => e.detail?.command_digest));
        for (const d of [...bodies.keys()]) if (!referenced.has(d)) bodies.delete(d);
        const redacted = new Set(
          events
            .filter((e) => e.event_type === 'evidence.redacted')
            .map((e) => String(e.detail.command_digest)),
        );
        const failures = verifyOperatorEvidence([{ label: '000000', events }], {
          site,
          credentials,
          bodies,
          redacted,
        });
        if (c.expect === 'PASS') expect(failures).toEqual([]);
        else {
          expect(failures).toHaveLength(1);
          expect(failures[0].split(': ')[0]).toBe(c.expect);
        }
      });
    }
  });
});

function testKeyPublic(): KeyObject {
  return publicKeyFromPem(testKey('site').pem);
}
