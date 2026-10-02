/**
 * DGX Spark heartbeat — failover decision tests.
 *
 * Guards the regression where /health returned 200 ("degraded") whenever ANY
 * monitored service was up, so a dead cron container still read as alive and
 * GitHub Actions skipped every scheduled job — dropping them entirely.
 *
 * evaluateFailover must key off the critical job-running services only, and a
 * critical service that is missing from the report must count as down.
 */

import { describe, it, expect } from 'vitest';
import { computeSystemStatus, evaluateFailover } from '../heartbeat.js';

type Svc = { name: string; status: 'up' | 'down' };

const ALL_UP: Svc[] = [
  { name: 'backend', status: 'up' },
  { name: 'cron', status: 'up' },
  { name: 'ollama', status: 'up' },
  { name: 'openclaw', status: 'up' },
  { name: 'aspire', status: 'up' },
  { name: 'github-runner', status: 'up' },
  { name: 'state-observer', status: 'up' },
];

describe('computeSystemStatus (dashboard rollup)', () => {
  it('healthy when all up', () => {
    expect(computeSystemStatus(ALL_UP)).toBe('healthy');
  });
  it('degraded when some up', () => {
    const svc = ALL_UP.map((s, i) => (i === 0 ? { ...s, status: 'down' as const } : s));
    expect(computeSystemStatus(svc)).toBe('degraded');
  });
  it('down when none up', () => {
    expect(computeSystemStatus(ALL_UP.map((s) => ({ ...s, status: 'down' as const })))).toBe('down');
  });
  it('down when empty (before first check)', () => {
    expect(computeSystemStatus([])).toBe('down');
  });
});

describe('evaluateFailover (GHA failover signal)', () => {
  const critical = ['backend', 'cron'];

  it('handles when all critical services are up', () => {
    expect(evaluateFailover(ALL_UP, critical)).toEqual({ handling: true, down: [] });
  });

  it('REGRESSION: cron down → does NOT handle, even when extras are up', () => {
    const svc = ALL_UP.map((s) => (s.name === 'cron' ? { ...s, status: 'down' as const } : s));
    const d = evaluateFailover(svc, critical);
    expect(d.handling).toBe(false);
    expect(d.down).toEqual(['cron']);
  });

  it('backend down → does NOT handle', () => {
    const svc = ALL_UP.map((s) => (s.name === 'backend' ? { ...s, status: 'down' as const } : s));
    expect(evaluateFailover(svc, critical).handling).toBe(false);
  });

  it('non-critical service down (aspire) → still handling', () => {
    const svc = ALL_UP.map((s) => (s.name === 'aspire' ? { ...s, status: 'down' as const } : s));
    expect(evaluateFailover(svc, critical).handling).toBe(true);
  });

  it('critical service missing from report counts as down (fail safe)', () => {
    const svc: Svc[] = [{ name: 'backend', status: 'up' }]; // cron not reported yet
    const d = evaluateFailover(svc, critical);
    expect(d.handling).toBe(false);
    expect(d.down).toEqual(['cron']);
  });

  it('empty report → does not handle (lets GHA take over)', () => {
    expect(evaluateFailover([], critical).handling).toBe(false);
  });
});
