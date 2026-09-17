/**
 * Tests for the depth-curve knee analysis (scripts/weekly/depth-curve-sweep.mjs).
 *
 * Rule 9: these assert the intent — that the sweep LOCATES THE KNEE that
 * PHD_FIREHORSE §14.45 Finding 2 depends on. A stubbed analyser, or one that
 * reports a knee where the curve is flat, fails these.
 */
import { describe, expect, it } from 'vitest';
// @ts-expect-error — .mjs script under test, no type declarations by design
import { analyseCurve } from '../../scripts/weekly/depth-curve-sweep.mjs';

type Point = {
  depth: number;
  concurrency: number;
  tokensPerSec: number | null;
  queueMs?: number | null;
  generateMs?: number | null;
  error?: string | null;
};

const p = (
  depth: number,
  tokensPerSec: number | null,
  extra: Partial<Point> = {},
): Point => ({ depth, concurrency: 1, tokensPerSec, error: null, ...extra });

describe('analyseCurve', () => {
  it('reports no knee when throughput holds across the swept range', () => {
    // The hipfire claim that prompted this work: constant throughput to deep
    // context. If it reproduces, the honest output is "no knee here" — not a
    // fabricated one.
    const out = analyseCurve([p(4000, 40), p(32000, 40), p(128000, 39), p(250000, 39)]);
    expect(out.knee).toBeNull();
    expect(out.reason).toMatch(/wider than what was measured/);
  });

  it('finds the depth where generation falls below interactive speed', () => {
    const out = analyseCurve([p(4000, 40), p(32000, 25), p(128000, 12), p(250000, 4)]);
    expect(out.perConcurrency[0].interactiveFloorDepth).toBe(250000);
    expect(out.knee).toBeLessThanOrEqual(250000);
  });

  it('detects non-linear falloff — throughput more than halving as depth doubles', () => {
    // This is the knee proper: capacity degrading faster than the work grows.
    const out = analyseCurve([p(16000, 40), p(32000, 38), p(64000, 10)]);
    expect(out.perConcurrency[0].nonLinearKneeDepth).toBe(64000);
  });

  it('detects the queueing regime when queue time overtakes generation time', () => {
    const out = analyseCurve([
      p(16000, 30, { queueMs: 50, generateMs: 900 }),
      p(64000, 22, { queueMs: 2400, generateMs: 1200 }),
    ]);
    expect(out.perConcurrency[0].queueDominantDepth).toBe(64000);
  });

  it('reports the tightest knee across concurrencies as the usable envelope', () => {
    // The §14.45 claim only holds left of the WORST case, not the best one.
    const out = analyseCurve([
      p(32000, 40, { concurrency: 1 }),
      p(128000, 38, { concurrency: 1 }),
      p(32000, 30, { concurrency: 8 }),
      p(128000, 5, { concurrency: 8 }),
    ]);
    expect(out.knee).toBe(128000);
    expect(out.perConcurrency).toHaveLength(2);
  });

  it('refuses to invent a curve when every sample failed', () => {
    const out = analyseCurve([
      { depth: 4000, concurrency: 1, tokensPerSec: null, error: 'HTTP 500' },
      { depth: 32000, concurrency: 1, tokensPerSec: null, error: 'HTTP 500' },
    ]);
    expect(out.knee).toBeNull();
    expect(out.reason).toBe('no successful samples');
  });

  it('ignores failed operating points rather than treating them as zero throughput', () => {
    // A failed sample is missing data, not a measurement of collapse. Scoring it as
    // zero would manufacture a knee that was never observed.
    const out = analyseCurve([
      p(4000, 40),
      { depth: 32000, concurrency: 1, tokensPerSec: null, error: 'timeout' },
      p(64000, 39),
    ]);
    expect(out.knee).toBeNull();
  });
});
