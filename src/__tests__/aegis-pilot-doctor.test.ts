// Evidence: Tool=opencode Model=ollama-local/qwen3-coder-next:latest Agent=opencode Date=2026-09-29
// Audit trail: git log -- src/__tests__/aegis-pilot-doctor.test.ts
/**
 * Aegis Pilot doctor command tests.
 * Uses tmp dirs, no network.
 */

import { chmodSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { doctor } from '../aegis/pilot/doctor.js';
import { EvidenceLedger, SiteAuthority, statePaths } from '../aegis/pilot/index.js';
import { sealActiveSegment } from '../aegis/pilot/ledger-segments.js';

function setupValidSite(stateDir: string, mode = 0o700) {
  if (existsSync(stateDir)) {
    rmSync(stateDir, { recursive: true, force: true });
  }
  mkdirSync(stateDir, { mode, recursive: true });
  const site = SiteAuthority.init(stateDir, 'test-site-002');
  site.issue({
    kind: 'agent',
    subjectName: 'test',
    capabilities: ['step:test'],
    ttlHours: 1,
  });
  chmodSync(stateDir, mode);
  return site;
}

function _createTestSiteWithMode(stateDir: string, mode: number) {
  if (existsSync(stateDir)) {
    rmSync(stateDir, { recursive: true, force: true });
  }
  mkdirSync(stateDir, { mode });
  const site = SiteAuthority.init(stateDir, 'test-site-003');
  site.issue({
    kind: 'agent',
    subjectName: 'test',
    capabilities: ['step:test'],
    ttlHours: 1,
  });
  chmodSync(stateDir, mode);
  return site;
}

describe('doctor', () => {
  const root = tmpdir();

  describe('state-dir-mode', () => {
    it('passes when state dir is not group/world writable', () => {
      const stateDir = join(root, `doctor-state-dir-${Date.now()}`);
      try {
        setupValidSite(stateDir, 0o700);
        chmodSync(stateDir, 0o700);
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'state-dir-mode');
        expect(check?.ok).toBe(true);
        expect(check?.detail).toContain('owner only');
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });

    it('fails when state dir is group writable', () => {
      const stateDir = join(root, `doctor-state-dir-group-${Date.now()}`);
      try {
        setupValidSite(stateDir, 0o770);
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'state-dir-mode');
        expect(check?.ok).toBe(false);
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });

    it('fails when state dir is world writable', () => {
      const stateDir = join(root, `doctor-state-dir-world-${Date.now()}`);
      try {
        setupValidSite(stateDir, 0o777);
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'state-dir-mode');
        expect(check?.ok).toBe(false);
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });
  });

  describe('site-key-mode', () => {
    it('passes when site.key mode is 0600', () => {
      const stateDir = join(root, `doctor-site-key-${Date.now()}`);
      try {
        setupValidSite(stateDir);
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'site-key-mode');
        expect(check?.ok).toBe(true);
        expect(check?.detail).toContain('0600');
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });

    it('fails when site.key mode is not 0600', () => {
      const stateDir = join(root, `doctor-site-key-bad-${Date.now()}`);
      try {
        setupValidSite(stateDir);
        const siteKey = join(stateDir, 'site', 'site.key');
        chmodSync(siteKey, 0o644);
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'site-key-mode');
        expect(check?.ok).toBe(false);
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });

    it('fails when site.key does not exist', () => {
      const stateDir = join(root, `doctor-site-key-missing-${Date.now()}`);
      try {
        mkdirSync(stateDir, { mode: 0o700 });
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'site-key-mode');
        expect(check?.ok).toBe(false);
        expect(check?.detail).toContain('not found');
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });
  });

  describe('ledger-local-fs', () => {
    it('passes when ledger is on local filesystem', () => {
      const stateDir = join(root, `doctor-ledger-local-${Date.now()}`);
      try {
        setupValidSite(stateDir);
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'ledger-local-fs');
        expect(check?.ok).toBe(true);
        expect(check?.detail).toContain('local filesystem');
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });
  });

  describe('ledger-verifies', () => {
    it('passes when ledger segments verify', () => {
      const stateDir = join(root, `doctor-ledger-verifies-${Date.now()}`);
      try {
        setupValidSite(stateDir);
        const site = SiteAuthority.load(stateDir);
        const { ledger } = statePaths(stateDir);
        if (!existsSync(ledger)) {
          const ledgerInstance = EvidenceLedger.open(ledger, {
            siteId: site.manifest.siteId,
            orgId: site.manifest.siteId,
            signer: (h: string) => site.sign(h),
            publicKey: site.publicKey,
          });
          ledgerInstance.append({
            event_type: 'system.genesis',
            detail: {
              site_id: site.manifest.siteId,
            },
          });
          ledgerInstance.close();
        }
        sealActiveSegment({ stateDir, site, force: true });
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'ledger-verifies');
        expect(check?.ok).toBe(true);
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });

    it('fails when ledger does not exist', () => {
      const stateDir = join(root, `doctor-ledger-missing-${Date.now()}`);
      try {
        mkdirSync(stateDir, { mode: 0o700 });
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'ledger-verifies');
        expect(check?.ok).toBe(false);
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });
  });

  describe('key-pinned', () => {
    it('fails when --scope is not provided', () => {
      const stateDir = join(root, `doctor-key-pinned-${Date.now()}`);
      try {
        setupValidSite(stateDir);
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'key-pinned');
        expect(check?.ok).toBe(false);
        expect(check?.detail).toContain('requires --scope option');
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });

    it('passes when scope keyId matches site keyId', () => {
      const stateDir = join(root, `doctor-key-pinned-match-${Date.now()}`);
      try {
        const site = setupValidSite(stateDir);
        const scopePath = join(stateDir, 'scope.json');
        writeFileSync(
          scopePath,
          JSON.stringify({ site: { siteId: site.manifest.siteId, keyId: site.manifest.keyId } }),
        );
        const result = doctor(stateDir, site.manifest.keyId);
        const check = result.checks.find((c) => c.check === 'key-pinned');
        expect(check?.ok).toBe(true);
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });

    it('fails when scope keyId does not match site keyId', () => {
      const stateDir = join(root, `doctor-key-pinned-mismatch-${Date.now()}`);
      try {
        const site = setupValidSite(stateDir);
        const wrongKeyId = 'wrong-key-id';
        const scopePath = join(stateDir, 'scope.json');
        writeFileSync(
          scopePath,
          JSON.stringify({ site: { siteId: site.manifest.siteId, keyId: wrongKeyId } }),
        );
        const result = doctor(stateDir, wrongKeyId);
        const check = result.checks.find((c) => c.check === 'key-pinned');
        expect(check?.ok).toBe(false);
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });
  });

  describe('isolation-tool', () => {
    it('passes on Linux', () => {
      if (process.platform !== 'linux') return;
      const stateDir = join(root, `doctor-isolation-linux-${Date.now()}`);
      try {
        setupValidSite(stateDir);
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'isolation-tool');
        expect(check?.ok).toBe(true);
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });

    it('passes on non-Linux with description', () => {
      if (process.platform === 'linux') return;
      const stateDir = join(root, `doctor-isolation-nonlinux-${Date.now()}`);
      try {
        setupValidSite(stateDir);
        const result = doctor(stateDir);
        const check = result.checks.find((c) => c.check === 'isolation-tool');
        expect(check?.ok).toBe(true);
        expect(check?.detail).toContain('not on Linux');
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });
  });

  describe('overall ok', () => {
    it('returns ok:true when all checks pass', () => {
      const stateDir = join(root, `doctor-all-pass-${Date.now()}`);
      try {
        const site = setupValidSite(stateDir);
        const { ledger } = statePaths(stateDir);
        if (!existsSync(ledger)) {
          const { siteId } = site.manifest;
          const ledgerInstance = EvidenceLedger.open(ledger, {
            siteId,
            orgId: siteId,
            signer: (h: string) => site.sign(h),
            publicKey: site.publicKey,
          });
          ledgerInstance.append({
            event_type: 'system.genesis',
            detail: {
              site_id: siteId,
              org_id: siteId,
            },
          });
          ledgerInstance.close();
        }
        sealActiveSegment({ stateDir, site, force: true });
        const scopePath = join(stateDir, 'scope.json');
        writeFileSync(
          scopePath,
          JSON.stringify({ site: { siteId: site.manifest.siteId, keyId: site.manifest.keyId } }),
        );
        const result = doctor(stateDir, site.manifest.keyId);
        expect(result.ok).toBe(true);
        expect(result.checks.length).toBeGreaterThanOrEqual(6);
        expect(result.checks.every((c) => c.ok)).toBe(true);
      } finally {
        rmSync(stateDir, { recursive: true, force: true });
      }
    });
  });
});
