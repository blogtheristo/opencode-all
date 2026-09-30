// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
// Audit trail: git log -- src/__tests__/aegis-pilot-provenance.test.ts
/**
 * C6 — a self-reading acceptance record (HIC 30.09.2026). A stranger must be
 * able to answer from the record alone which standard revision governed the
 * run, which kit and document versions were in force, and which hardware
 * attestation was used (in the pilot: none, as the offers state).
 */

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  collectProvenance,
  docVersion,
  PILOT_ATTESTATION,
  provenanceGaps,
  versionAtLeast,
} from '../aegis/pilot/provenance.js';

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'aegis-prov-'));
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe('record provenance', () => {
  it('reads the governing versions from the kit checkout', () => {
    const p = collectProvenance();
    expect(p.standards.kyaS1).toMatch(/^\d+\.\d+/);
    expect(p.documents.runbook).toMatch(/^\d+\.\d+/);
    expect(p.documents.auditorGuide).toMatch(/^\d+\.\d+/);
    expect(p.documents.acceptanceAnnex).toMatch(/^\d+\.\d+/);
    expect(p.kit.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(typeof p.kit.dirty).toBe('boolean');
    expect(provenanceGaps(p)).toEqual([]);
  });

  it('states the hardware attestation in force — none in the pilot', () => {
    expect(collectProvenance().attestation).toEqual(PILOT_ATTESTATION);
    expect(PILOT_ATTESTATION).toEqual({
      tpmQuote: false,
      measuredBoot: false,
      hardwareKeys: false,
      rimVersion: null,
    });
  });

  it('reads a version from the document header, and null when there is none', () => {
    const doc = join(dir, 'd.md');
    writeFileSync(doc, '# T\n\n# VERSION AND AGENT HISTORY\n\n---\n\nVersion: 1.7 [Latest]\n');
    expect(docVersion(doc)).toBe('1.7');
    writeFileSync(doc, '# T\n\nno header\n');
    expect(docVersion(doc)).toBeNull();
    expect(docVersion(join(dir, 'missing.md'))).toBeNull();
  });

  it('names every missing field, so an acceptance run can refuse', () => {
    const p = collectProvenance(dir); // not a kit checkout
    expect(provenanceGaps(p)).toEqual(
      expect.arrayContaining(['standards.kyaS1', 'documents.auditorGuide', 'kit.commit']),
    );
  });

  it('compares dotted versions numerically', () => {
    expect(versionAtLeast('1.10', '1.9')).toBe(true);
    expect(versionAtLeast('1.0', '1.0')).toBe(true);
    expect(versionAtLeast('1.0', '1.1')).toBe(false);
    expect(versionAtLeast('2', '1.9.9')).toBe(true);
  });
});
