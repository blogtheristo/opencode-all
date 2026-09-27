import { describe, expect, it } from 'vitest';
import {
  fitCalibration,
  type LabeledDecision,
  routeDecision,
} from '../../agents/kya-jev-calibration.js';
import type { TypedDecisionResult } from '../../agents/kya-jev.js';

function labels(pairs: [number, boolean][]): LabeledDecision[] {
  return pairs.map(([confidence, correct]) => ({ confidence, correct }));
}

function decision(confidence: number, abstained = false): TypedDecisionResult {
  return {
    decision: 'yes',
    probabilities: {},
    confidence,
    calibration: 'self-reported-uncalibrated',
    abstained,
  };
}

// Confident answers mostly right, low-confidence ones mostly wrong.
const set = labels([
  [0.95, true],
  [0.92, true],
  [0.9, true],
  [0.88, true],
  [0.85, true],
  [0.8, false],
  [0.7, true],
  [0.6, false],
  [0.5, false],
  [0.4, false],
]);

describe('kya-jev calibration', () => {
  it('refuses to fit on too few labels', () => {
    expect(fitCalibration(set.slice(0, 9))).toEqual({ status: 'insufficient-labels', n: 9 });
  });

  it('picks the lowest threshold that still meets the accuracy target', () => {
    const cal = fitCalibration(set, { targetAccuracy: 0.8 });
    expect(cal).toMatchObject({ status: 'fitted', threshold: 0.7, n: 10 });
    if (cal.status !== 'fitted') throw new Error('expected fitted');
    expect(cal.coverage).toBeCloseTo(0.7);
    expect(cal.acceptedAccuracy).toBeCloseTo(6 / 7);
    expect(cal.confidentHalfAccuracy).toBe(1);
  });

  it('reports an unreachable target instead of inventing a threshold', () => {
    const allWrong = labels(Array.from({ length: 10 }, (_, i) => [i / 10, false]));
    expect(fitCalibration(allWrong)).toEqual({ status: 'target-unreachable', n: 10 });
  });

  it('never splits tied confidences across the threshold', () => {
    const ties = labels([
      ...Array.from({ length: 5 }, (): [number, boolean] => [0.9, true]),
      [0.6, true],
      [0.6, false],
      [0.6, false],
      [0.3, false],
      [0.3, false],
    ]);
    expect(fitCalibration(ties, { targetAccuracy: 0.9 })).toMatchObject({ threshold: 0.9 });
  });

  it('ignores labels with out-of-range confidence', () => {
    const noisy = [...set, { confidence: 1.5, correct: false }, { confidence: NaN, correct: true }];
    expect(fitCalibration(noisy, { targetAccuracy: 0.8 })).toMatchObject({ n: 10 });
  });

  it('routes above-threshold decisions to accept and everything else to escalate', () => {
    const cal = fitCalibration(set, { targetAccuracy: 0.8 });
    expect(routeDecision(decision(0.75), cal)).toBe('accept');
    expect(routeDecision(decision(0.65), cal)).toBe('escalate');
    expect(routeDecision(decision(0.99, true), cal)).toBe('escalate');
    expect(routeDecision(decision(0.99), { status: 'insufficient-labels', n: 3 })).toBe('escalate');
  });
});
