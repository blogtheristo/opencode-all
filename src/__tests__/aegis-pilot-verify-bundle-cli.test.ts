// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-10-01
// Audit trail: git log -- src/__tests__/aegis-pilot-verify-bundle-cli.test.ts
/**
 * verify-bundle without a pin is not "verified" (HIC 01.10.2026): exit 4 and an explicit
 * authenticity statement; --allow-unpinned keeps an integrity-only check at exit 0.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const cli = (...args: string[]) => {
  const r = spawnSync('node', ['--import', 'tsx', 'scripts/aegis-pilot.ts', ...args], {
    encoding: 'utf8',
    timeout: 30000,
  });
  return { status: r.status, stderr: r.stderr, json: JSON.parse(r.stdout) };
};

describe('verify-bundle pin handling (CLI)', () => {
  let bundle = '';
  let keyId = '';

  beforeAll(() => {
    const base = mkdtempSync(join(tmpdir(), 'aegis-vb-'));
    const init = cli('init', '--state-dir', join(base, 's'), '--site-id', 'vb-test');
    keyId = init.json.keyId;
    bundle = join(base, 'b');
    expect(cli('export', '--state-dir', join(base, 's'), '--out', bundle).status).toBe(0);
  }, 60000);

  it('correct pin: exit 0, authenticity established', () => {
    const r = cli('verify-bundle', '--bundle', bundle, '--expect-key-id', keyId);
    expect(r.status).toBe(0);
    expect(r.json).toMatchObject({ ok: true, keyPinned: true });
    expect(r.json.authenticity).toMatch(/^established/);
  }, 40000);

  it('no pin: exit 4, ok false, says authenticity is not established', () => {
    const r = cli('verify-bundle', '--bundle', bundle);
    expect(r.status).toBe(4);
    expect(r.json).toMatchObject({ ok: false, keyPinned: false, failures: [] });
    expect(r.json.authenticity).toMatch(/unpinned — authenticity not established/);
    expect(r.stderr).toMatch(/authenticity not established/);
  }, 40000);

  it('--allow-unpinned: exit 0 but still labelled unpinned', () => {
    const r = cli('verify-bundle', '--bundle', bundle, '--allow-unpinned');
    expect(r.status).toBe(0);
    expect(r.json).toMatchObject({ ok: true, keyPinned: false });
    expect(r.json.authenticity).toMatch(/unpinned/);
  }, 40000);

  it('wrong pin: exit 4, not established', () => {
    const r = cli('verify-bundle', '--bundle', bundle, '--expect-key-id', 'deadbeef');
    expect(r.status).toBe(4);
    expect(r.json).toMatchObject({ ok: false, keyPinned: false });
    expect(r.json.authenticity).toMatch(/^NOT established/);
  }, 40000);
});
