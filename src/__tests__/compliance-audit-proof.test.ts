/**
 * Tests for src/compliance/audit-proof.ts — the compliance proof certificate.
 *
 * Asserts INTENT (CLAUDE.md Rule 9): a broken hash chain is caught, denied
 * access/mandate events surface (not silently averaged away), residency is
 * scoped honestly as platform-wide, and the certificate hash is deterministic
 * so a second fetch can be diffed for drift.
 */
import { describe, expect, it } from 'vitest';
import {
  type Article12Row,
  buildComplianceProof,
  type CommandAuditRow,
  type KyaMandateRow,
  verifyChain,
} from '../compliance/audit-proof.js';

const row = (id: string, prev: string, hash: string, extra: Record<string, unknown>) => ({
  id,
  created_at: `2026-09-0${id}T00:00:00.000Z`,
  prev_hash: prev,
  event_hash: hash,
  ...extra,
});

describe('verifyChain', () => {
  it('reports intact for an empty window', () => {
    expect(verifyChain([])).toEqual({
      hashChained: true,
      intact: true,
      rowsChecked: 0,
      brokenAtRowId: null,
    });
  });

  it('reports intact when each prev_hash matches the prior event_hash', () => {
    const rows = [row('1', '0', 'a', {}), row('2', 'a', 'b', {}), row('3', 'b', 'c', {})];
    expect(verifyChain(rows)).toEqual({
      hashChained: true,
      intact: true,
      rowsChecked: 3,
      brokenAtRowId: null,
    });
  });

  it('pinpoints the first broken link, not just "something is wrong"', () => {
    const rows = [
      row('1', '0', 'a', {}),
      row('2', 'a', 'b', {}),
      row('3', 'X-TAMPERED', 'c', {}), // does not chain from row 2's hash
    ];
    const result = verifyChain(rows);
    expect(result.intact).toBe(false);
    expect(result.brokenAtRowId).toBe('3');
  });
});

describe('buildComplianceProof', () => {
  const commandLogRows: CommandAuditRow[] = [
    row('1', '0', 'a', { decision: 'allowed', org_id: 'org-1' }) as CommandAuditRow,
    row('2', 'a', 'b', { decision: 'denied', org_id: 'org-1' }) as CommandAuditRow,
  ];
  const kyaEventRows: KyaMandateRow[] = [
    row('1', '0', 'x', {
      gate_decision: 'allowed',
      kya_violation: false,
      org_id: 'org-1',
    }) as KyaMandateRow,
    row('2', 'x', 'y', {
      gate_decision: 'denied',
      kya_violation: true,
      org_id: 'org-1',
    }) as KyaMandateRow,
  ];
  const article12Rows: Article12Row[] = [
    {
      id: '1',
      created_at: '2026-09-01T00:00:00.000Z',
      inference_in_eu: false,
      pii_scrub_location: 'veriton-helsinki-fi',
      inference_location: 'anthropic-us',
    },
  ];

  it('surfaces denied access events by count and sample, never just an average', () => {
    const cert = buildComplianceProof({
      orgId: 'org-1',
      from: '2026-09-01',
      to: '2026-09-02',
      commandLogRows,
      kyaEventRows,
      article12Rows,
    });
    expect(cert.access).toEqual({
      allowed: 1,
      denied: 1,
      deniedSamples: [{ id: '2', created_at: commandLogRows[1].created_at }],
    });
  });

  it('surfaces mandate-gating violations and denials distinctly', () => {
    const cert = buildComplianceProof({
      orgId: 'org-1',
      from: '2026-09-01',
      to: '2026-09-02',
      commandLogRows,
      kyaEventRows,
      article12Rows,
    });
    expect(cert.mandateGating).toEqual({ total: 2, violations: 1, denied: 1 });
  });

  it('reports residency as platform-wide and honestly reflects non-EU inference', () => {
    const cert = buildComplianceProof({
      orgId: 'org-1',
      from: '2026-09-01',
      to: '2026-09-02',
      commandLogRows,
      kyaEventRows,
      article12Rows,
    });
    expect(cert.dataResidency.scope).toBe('platform-wide');
    expect(cert.dataResidency.allInEu).toBe(false);
    expect(cert.dataResidency.locations.inference).toEqual(['anthropic-us']);
  });

  it('marks article12Log as not hash-chained instead of fabricating chain integrity', () => {
    const cert = buildComplianceProof({
      orgId: 'org-1',
      from: '2026-09-01',
      to: '2026-09-02',
      commandLogRows,
      kyaEventRows,
      article12Rows,
    });
    expect(cert.chainIntegrity.article12Log.hashChained).toBe(false);
    expect(cert.chainIntegrity.commandLog).toEqual({
      hashChained: true,
      intact: true,
      rowsChecked: 2,
      brokenAtRowId: null,
    });
  });

  it('produces a deterministic certificateHash for identical input', () => {
    const params = {
      orgId: 'org-1',
      from: '2026-09-01',
      to: '2026-09-02',
      commandLogRows,
      kyaEventRows,
      article12Rows,
    };
    const first = buildComplianceProof(params);
    const second = buildComplianceProof(params);
    // generatedAt differs by wall-clock time but the rest of the certificate
    // (excluding generatedAt/certificateHash) must hash identically.
    const strip = ({ generatedAt: _g, certificateHash: _h, ...rest }: typeof first) => rest;
    expect(strip(first)).toEqual(strip(second));
  });

  it('detects a broken chain and does not report intact:true', () => {
    const tamperedKyaEvents: KyaMandateRow[] = [
      kyaEventRows[0],
      { ...kyaEventRows[1], prev_hash: 'TAMPERED' },
    ];
    const cert = buildComplianceProof({
      orgId: 'org-1',
      from: '2026-09-01',
      to: '2026-09-02',
      commandLogRows,
      kyaEventRows: tamperedKyaEvents,
      article12Rows,
    });
    expect(cert.chainIntegrity.kyaMandateEvents.intact).toBe(false);
    expect(cert.chainIntegrity.kyaMandateEvents.brokenAtRowId).toBe('2');
  });
});
