/**
 * Tests for scripts/compute-mgd.mjs — Monthly Governed Decisions (MGD).
 *
 * These assert INTENT (CLAUDE.md Rule 9), not just shape: the count changes
 * when governance facts change, and the script FAILS LOUD rather than proxying
 * when the schema cannot express governance.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
// @ts-expect-error — plain .mjs script, no type declarations by design.
import {
  classify,
  computeMgd,
  isUndefinedColumnError,
  isValidLineage,
  REQUIRED_FIELDS,
  SchemaGapError,
  schemaGapReport,
} from '../../scripts/compute-mgd.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (name: string) => JSON.parse(readFileSync(path.join(here, 'fixtures', name), 'utf8'));
const governed = load('mgd-logs.governed.json');
const legacy = load('mgd-logs.legacy.json');

describe('computeMgd — governed logs', () => {
  const r = computeMgd(governed, { now: '2026-07-14T00:00:00.000Z' });

  it('counts ONLY decisions meeting all three §3 criteria + completed', () => {
    // Records 1, 2 (outokumpu) and 6 (kemira) qualify; the rest are excluded
    // for a specific, named reason. This is the core intent: 3, not 7.
    expect(r.totals.governedDecisions).toBe(3);
    expect(r.totals.evaluated).toBe(7);
    expect(r.totals.excluded).toBe(4);
  });

  it('attributes each exclusion to the right failing criterion', () => {
    expect(r.totals.excludedBreakdown).toEqual({
      'not-completed': 1, // errored cbam run
      'not-governed-layer': 1, // seo-audit, ungoverned
      'missing-article12-lineage': 1, // empty sources/reasoning/signed_by
      'not-audit-grade': 1, // advisory weather score
    });
  });

  it('breaks the number down per customer, ranked by governed decisions', () => {
    expect(r.perCustomer.map((c: any) => [c.orgId, c.governedDecisions])).toEqual([
      ['org-outokumpu', 2],
      ['org-kemira', 1],
    ]);
  });

  it('reports the true time window from the data', () => {
    expect(r.window.from).toBe('2026-07-02T09:00:00.000Z');
    expect(r.window.to).toBe('2026-07-10T09:20:00.000Z');
  });

  it('does NOT fabricate CRC from execution logs (honest, not proxied)', () => {
    expect(r.crc.computableFromExecutionLogs).toBe(false);
  });

  it('a governed decision stops counting the moment audit_grade flips false', () => {
    // Intent guard: flipping one governance fact must move the count. A test
    // that passes regardless of business logic would be worthless here.
    const before = computeMgd(governed, {}).totals.governedDecisions;
    const tampered = governed.map((rec: any) =>
      rec.id.endsWith('0001') ? { ...rec, audit_grade: false } : rec,
    );
    expect(computeMgd(tampered, {}).totals.governedDecisions).toBe(before - 1);
  });

  it('filters by customer and window deterministically', () => {
    const only = computeMgd(governed, { customer: 'org-kemira' });
    expect(only.totals.governedDecisions).toBe(1);
    expect(only.perCustomer).toHaveLength(1);
  });
});

describe('computeMgd — fail loud on schema gap (Rule 12)', () => {
  it('throws SchemaGapError when logs carry none of the three governance fields', () => {
    expect(() => computeMgd(legacy, {})).toThrow(SchemaGapError);
  });

  it('names the exact missing fields + proposed (un-applied) migration', () => {
    try {
      computeMgd(legacy, {});
      throw new Error('expected SchemaGapError');
    } catch (e: any) {
      expect(e).toBeInstanceOf(SchemaGapError);
      expect(e.report.missingFields.map((m: any) => m.field)).toEqual(
        REQUIRED_FIELDS.map((f: any) => f.key),
      );
      expect(e.report.proposedMigration).toContain('081_agent_executions_governance_fields.sql');
    }
  });

  it('does NOT fail loud when at least one record supports governance (schema present, value false)', () => {
    // A single field-bearing record proves the schema can express governance,
    // so an all-false set computes to zero rather than erroring.
    const supported = [
      {
        org_id: 'o',
        status: 'completed',
        created_at: '2026-07-01T00:00:00.000Z',
        governed_outcome_layer: false,
        audit_grade: false,
        article12_lineage: null,
      },
    ];
    const res = computeMgd(supported, {});
    expect(res.totals.governedDecisions).toBe(0);
    expect(res.totals.evaluated).toBe(1);
  });

  it('the Supabase reader treats an undefined-column error as the SAME schema gap', () => {
    // Pre-migration-080, selecting the governance columns from Postgres errors
    // with 42703 / "column ... does not exist". That must map to fail-loud, not
    // a silent zero (Rule 12). Tested at the predicate + report level (no live DB).
    expect(isUndefinedColumnError({ code: '42703' })).toBe(true);
    expect(
      isUndefinedColumnError({ message: 'column agent_executions.audit_grade does not exist' }),
    ).toBe(true);
    expect(isUndefinedColumnError({ code: 'PGRST100', message: 'syntax error' })).toBe(false);
    expect(isUndefinedColumnError(null)).toBe(false);
    expect(schemaGapReport(0).proposedMigration).toContain(
      '081_agent_executions_governance_fields.sql',
    );
  });
});

describe('predicate units', () => {
  it('isValidLineage requires non-empty sources + reasoning + signed_by', () => {
    expect(isValidLineage({ sources: ['x'], reasoning: 'y', signed_by: 'z' })).toBe(true);
    expect(isValidLineage({ sources: [], reasoning: 'y', signed_by: 'z' })).toBe(false);
    expect(isValidLineage({ sources: ['x'], reasoning: '', signed_by: 'z' })).toBe(false);
    expect(isValidLineage(null)).toBe(false);
  });

  it('classify returns the first failing criterion', () => {
    expect(classify({ status: 'started' })).toBe('not-completed');
    expect(classify({ status: 'completed', governed_outcome_layer: false })).toBe(
      'not-governed-layer',
    );
  });
});
