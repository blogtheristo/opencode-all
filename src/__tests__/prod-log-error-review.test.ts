/**
 * Production Log Error Review — triage logic tests
 *
 * Verifies the pure clustering logic that turns a raw production error-row
 * stream into a short, actionable list of distinct issues. These assert intent
 * (same bug with different ids collapses to one cluster; counts and ordering
 * are correct), not just that the function returns something.
 */

import { describe, expect, it } from 'vitest';
import {
  type ExecutionErrorRow,
  normalizeErrorSignature,
  summarizeErrors,
} from '../../scripts/daily/prod-log-error-review.js';

describe('normalizeErrorSignature', () => {
  it('collapses uuids, timestamps, hex and numbers so variants share a signature', () => {
    const a = normalizeErrorSignature(
      'timeout for org 123e4567-e89b-12d3-a456-426614174000 at 2026-06-21T10:00:00Z after 4200ms',
    );
    const b = normalizeErrorSignature(
      'timeout for org 99999999-aaaa-bbbb-cccc-dddddddddddd at 2026-06-20T09:15:30Z after 31ms',
    );
    expect(a).toBe(b);
  });

  it('returns a stable placeholder for empty messages', () => {
    expect(normalizeErrorSignature(null)).toBe('(no message)');
    expect(normalizeErrorSignature('')).toBe('(no message)');
  });
});

describe('summarizeErrors', () => {
  const rows: ExecutionErrorRow[] = [
    {
      agent_name: 'compliance',
      error_message: 'DB connection refused (5432)',
      created_at: '2026-06-21T08:00:00Z',
    },
    {
      agent_name: 'compliance',
      error_message: 'DB connection refused (5433)',
      created_at: '2026-06-21T09:00:00Z',
    },
    {
      agent_name: 'compliance',
      error_message: 'DB connection refused (5440)',
      created_at: '2026-06-21T07:00:00Z',
    },
    {
      agent_name: 'sitesense',
      error_message: 'rate limit hit',
      created_at: '2026-06-21T10:00:00Z',
    },
  ];

  it('clusters same-signature errors per agent and counts them', () => {
    const clusters = summarizeErrors(rows);
    expect(clusters).toHaveLength(2);

    const db = clusters.find((c) => c.agentName === 'compliance');
    expect(db?.count).toBe(3);
    // first/last seen span the full window, independent of insertion order
    expect(db?.firstSeen).toBe('2026-06-21T07:00:00Z');
    expect(db?.lastSeen).toBe('2026-06-21T09:00:00Z');
  });

  it('orders clusters by frequency, most frequent first', () => {
    const clusters = summarizeErrors(rows);
    expect(clusters[0].count).toBeGreaterThanOrEqual(clusters[1].count);
    expect(clusters[0].agentName).toBe('compliance');
  });

  it('does not merge identical messages from different agents', () => {
    const sameMsg: ExecutionErrorRow[] = [
      { agent_name: 'a', error_message: 'boom', created_at: '2026-06-21T08:00:00Z' },
      { agent_name: 'b', error_message: 'boom', created_at: '2026-06-21T08:00:00Z' },
    ];
    expect(summarizeErrors(sameMsg)).toHaveLength(2);
  });

  it('returns an empty list when there are no errors (healthy window)', () => {
    expect(summarizeErrors([])).toEqual([]);
  });
});
