/**
 * Lifetime World Model V1 — reference loop tests.
 *
 * These assert INTENT, not just shape (12-Rule #9): the HIL gate cannot be
 * bypassed, an operator override measurably lowers an action's future ranking,
 * and a simulator failure fails loud instead of reporting success.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({ insert: vi.fn(() => ({ error: null })) })),
  })),
}));

// No SUPABASE_* env set → logExecution() no-ops, keeping tests hermetic.

import { buildStateVector, computeSeverity } from '../agents/world-model/state-vector.js';
import { ReferenceSimulator } from '../agents/world-model/simulator.js';
import { RewardStore } from '../agents/world-model/reward-store.js';
import { WorldModelLoopAgent } from '../agents/world-model/world-model-loop.agent.js';
import type {
  ActionProposal,
  CandidateAction,
  RankedAction,
  TelemetryReading,
} from '../agents/world-model/types.js';
import type { AgentContext } from '../agents/types.js';

const ctx: AgentContext = {
  projectId: 'p1',
  userId: 'u1',
  orgId: 'o1',
  sessionId: 's1',
};

const telemetry: TelemetryReading[] = [
  { channel: 'temperature', value: 100, unit: '°C', source: 'sensor-a' }, // (100-80)/40 = 0.5
  { channel: 'vibration', value: 12, unit: 'mm/s', source: 'sensor-b' }, // (12-5)/10 = 0.7 → anomaly
  { channel: 'humidity', value: 50, unit: '%', source: 'sensor-c' }, // nominal → 0
];

const candidates: CandidateAction[] = [
  {
    id: 'a1',
    type: 'reroute',
    description: 'Reroute load off the vibrating unit',
    targets: ['vibration'],
    mutatesLiveSystem: true,
  },
  {
    id: 'b1',
    type: 'noop-check',
    description: 'Inspect humidity feed',
    targets: ['humidity'],
    mutatesLiveSystem: false,
  },
];

describe('Perception — buildStateVector', () => {
  it('normalizes telemetry into a governed state vector with severities and anomalies', () => {
    const sv = buildStateVector(telemetry, { capturedAt: '2026-06-23T00:00:00Z' });

    expect(Object.keys(sv.signals).sort()).toEqual(['humidity', 'temperature', 'vibration']);
    expect(sv.signals.temperature.unit).toBe('°C');
    expect(sv.signals.temperature.source).toBe('sensor-a');
    expect(sv.signals.temperature.severity).toBeCloseTo(0.5, 5);
    expect(sv.signals.vibration.severity).toBeCloseTo(0.7, 5);
    expect(sv.signals.humidity.severity).toBe(0);
    expect(sv.maxSeverity).toBeCloseTo(0.7, 5);
    // Only vibration crosses the 0.6 default threshold.
    expect(sv.anomalies).toEqual(['vibration']);
  });

  it('assigns zero severity to unknown channels (never silently alarms)', () => {
    expect(computeSeverity('unknown-channel', 9999)).toBe(0);
  });
});

describe('Imagination + ranking', () => {
  it('ranks the action that relieves a real anomaly above a no-op', async () => {
    const agent = new WorldModelLoopAgent();
    const res = await agent.execute(ctx, { telemetry, candidateActions: candidates });
    const ranked = res.result.rankedActions as RankedAction[];

    expect(ranked).toHaveLength(2);
    expect(ranked[0].actionId).toBe('a1'); // reroute beats noop-check
    expect(ranked[0].rankScore).toBeGreaterThan(ranked[1].rankScore);
  });
});

describe('HIL gate — auto-mutation is impossible', () => {
  it('returns the top action as a proposal requiring human approval, never applied', async () => {
    const agent = new WorldModelLoopAgent();
    const res = await agent.execute(ctx, { telemetry, candidateActions: candidates });
    const proposal = res.result.selectedProposal as ActionProposal;

    expect(proposal).not.toBeNull();
    expect(proposal.action.id).toBe('a1');
    expect(proposal.requiresHumanApproval).toBe(true);
    // The whole response must never contain an applied:true anywhere.
    expect(JSON.stringify(res.result)).not.toContain('"applied":true');
    expect(proposal.applied).toBe(false);
  });
});

describe('Reward learning — overrides lower an action type', () => {
  it('RewardStore drops weight on override and lifts it back on accept', () => {
    const store = new RewardStore(); // in-memory
    expect(store.getWeight('reroute')).toBe(1);

    const down = store.applyFeedback({ actionType: 'reroute', verdict: 'override' });
    expect(down.weightAfter).toBeLessThan(down.weightBefore);
    expect(store.getWeight('reroute')).toBeCloseTo(0.7, 5);

    const up = store.applyFeedback({ actionType: 'reroute', verdict: 'accept' });
    expect(up.weightAfter).toBeGreaterThan(up.weightBefore);
  });

  it('an operator override measurably lowers that action rank on the next cycle', async () => {
    const agent = new WorldModelLoopAgent();

    const before = await agent.execute(ctx, { telemetry, candidateActions: candidates });
    const scoreBefore = (before.result.rankedActions as RankedAction[]).find(
      (r) => r.actionId === 'a1',
    )!.rankScore;

    const after = await agent.execute(ctx, {
      telemetry,
      candidateActions: candidates,
      operatorFeedback: [{ actionType: 'reroute', verdict: 'override' }],
    });
    const scoreAfter = (after.result.rankedActions as RankedAction[]).find(
      (r) => r.actionId === 'a1',
    )!.rankScore;

    expect(after.result.rewardUpdates).toHaveLength(1);
    expect(scoreAfter).toBeLessThan(scoreBefore); // ranking actually changed
  });
});

describe('Fail loud', () => {
  it('surfaces a simulator failure instead of reporting success', async () => {
    const exploding = {
      project() {
        throw new Error('cosmos adapter offline');
      },
    };
    const agent = new WorldModelLoopAgent({ simulator: exploding });
    const res = await agent.execute(ctx, { telemetry, candidateActions: candidates });

    expect(res.confidence).toBe(0);
    expect(res.reasoning).toContain('cosmos adapter offline');
    expect(res.result.error).toBe('cosmos adapter offline');
  });
});

describe('ReferenceSimulator', () => {
  it('projects zero benefit when an action targets no live signal', () => {
    const sim = new ReferenceSimulator();
    const sv = buildStateVector(telemetry, { capturedAt: '2026-06-23T00:00:00Z' });
    const out = sim.project(sv, {
      id: 'x',
      type: 'reroute',
      description: 'targets a channel with no reading',
      targets: ['pressure'],
      mutatesLiveSystem: true,
    });
    expect(out.projectedBenefit).toBe(0);
  });
});
