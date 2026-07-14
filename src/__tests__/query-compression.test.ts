import { describe, it, expect } from 'vitest';
import { compressRows, summarizeFetchedText } from '../agents/tools.js';

describe('compressRows (query_database output compression)', () => {
  it('reports an empty result with a review note', () => {
    const r = compressRows([]);
    expect(r.count).toBe(0);
    expect(r.rows).toEqual([]);
    expect(r.columns).toEqual([]);
    expect(r.review?.[0]?.issue).toMatch(/0 rows/);
  });

  it('handles null/undefined data without throwing', () => {
    expect(compressRows(null).count).toBe(0);
    expect(compressRows(undefined).count).toBe(0);
  });

  it('infers a column schema once instead of per row', () => {
    const r = compressRows([
      { id: 1, name: 'North', active: true },
      { id: 2, name: 'South', active: false },
    ]);
    const byName = Object.fromEntries(r.columns.map((c) => [c.name, c.type]));
    expect(byName).toEqual({ id: 'number', name: 'string', active: 'boolean' });
  });

  it('losslessly collapses columns that are constant across all rows', () => {
    const r = compressRows([
      { org: 'lifetime', region: 'North', units: 1200 },
      { org: 'lifetime', region: 'South', units: 840 },
      { org: 'lifetime', region: 'West', units: 1500 },
    ]);
    // `org` is constant → moves to constants legend, dropped from per-row output.
    expect(r.constants).toEqual({ org: 'lifetime' });
    expect(r.rows.every((row) => !('org' in row))).toBe(true);
    expect(r.rows[0]).toEqual({ region: 'North', units: 1200 });
  });

  it('does not collapse constants for a single row', () => {
    const r = compressRows([{ org: 'lifetime', region: 'North' }]);
    expect(r.constants).toBeUndefined();
    expect(r.rows[0]).toEqual({ org: 'lifetime', region: 'North' });
  });

  it('samples large result sets and tallies the omitted rows', () => {
    const rows = Array.from({ length: 200 }, (_, i) => ({ id: i, region: `r${i}` }));
    const r = compressRows(rows, { sampleLimit: 15 });
    expect(r.count).toBe(200);
    expect(r.rows.length).toBe(15);
    expect(r.sampled).toBe(true);
    expect(r.omitted).toBe(185);
    expect(r.review?.some((f) => /Showing first 15 of 200/.test(f.issue))).toBe(true);
  });

  it('flags entirely-null and partially-null columns', () => {
    const r = compressRows([
      { id: 1, note: null, ref: 'a' },
      { id: 2, note: null, ref: null },
    ]);
    expect(r.review?.some((f) => f.column === 'note' && /entirely null/.test(f.issue))).toBe(true);
    expect(r.review?.some((f) => f.column === 'ref' && f.count === 1)).toBe(true);
  });

  it('flags error sentinel values as warnings', () => {
    const r = compressRows([
      { id: 1, total: 11988 },
      { id: 2, total: '#REF!' as unknown as number },
    ]);
    const flag = r.review?.find((f) => f.column === 'total' && /error sentinel/.test(f.issue));
    expect(flag?.level).toBe('warn');
    expect(flag?.count).toBe(1);
  });

  it('notes when a result hits the query limit (possible truncation)', () => {
    const rows = Array.from({ length: 50 }, (_, i) => ({ id: i }));
    const r = compressRows(rows, { limit: 50 });
    expect(r.review?.some((f) => /hit the row limit/.test(f.issue))).toBe(true);
  });
});

describe('summarizeFetchedText (fetch_external output)', () => {
  it('returns short text untouched and flags it not truncated', () => {
    const s = summarizeFetchedText('hello world');
    expect(s.truncated).toBe(false);
    expect(s.truncatedAt).toBeUndefined();
    expect(s.charCount).toBe(11);
    expect(s.text).toBe('hello world');
  });

  it('caps long text to the budget and reports the consequence', () => {
    const body = 'x'.repeat(25_000);
    const s = summarizeFetchedText(body, 10_000);
    expect(s.truncated).toBe(true);
    expect(s.truncatedAt).toBe(10_000);
    expect(s.charCount).toBe(25_000); // full original length still reported
    expect(s.text.length).toBe(10_000);
  });

  it('treats text exactly at the budget as not truncated', () => {
    const s = summarizeFetchedText('y'.repeat(10_000), 10_000);
    expect(s.truncated).toBe(false);
    expect(s.text.length).toBe(10_000);
  });
});
