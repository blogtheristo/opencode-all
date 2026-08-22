/**
 * Proactive Agents — Observe & Act Tests
 *
 * Covers the pure "worth interrupting" gate, the nudge service dedup +
 * rate-limit + escalation (in-memory fallback path, no Supabase), the
 * autonomy phase helper, and the nudge response handler outcomes.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// No Supabase in tests → nudge service uses its in-memory fallback store.
vi.mock('../config/supabase.js', () => ({ getSupabaseClient: () => null }));
// Keep the event bus quiet/cheap.
vi.mock('../agents/event-bus.js', () => ({
  eventBus: { emit: vi.fn().mockResolvedValue(undefined), subscribe: vi.fn() },
}));

import { evaluateGate, getSignal, shouldNudgeNow } from '../agents/signal-catalogue.js';
import { AUTONOMY_PHASE_RANK, isPhaseAtLeast } from '../agents/autonomy.js';
import { nudgeService } from '../agents/nudge.service.js';
import { handleResponse, normalizeAction } from '../agents/nudge-response-handler.js';

describe('Worth-Interrupting Gate (2x2)', () => {
  it('high confidence + high urgency → act_now', () => {
    expect(evaluateGate('high', 'high')).toBe('act_now');
  });
  it('low confidence + high urgency → flag_for_review', () => {
    expect(evaluateGate('low', 'high')).toBe('flag_for_review');
  });
  it('high confidence + low urgency → digest', () => {
    expect(evaluateGate('high', 'low')).toBe('digest');
  });
  it('low confidence + low urgency → skip', () => {
    expect(evaluateGate('low', 'low')).toBe('skip');
  });
  it('only act_now and flag_for_review nudge in real time', () => {
    expect(shouldNudgeNow('act_now')).toBe(true);
    expect(shouldNudgeNow('flag_for_review')).toBe(true);
    expect(shouldNudgeNow('digest')).toBe(false);
    expect(shouldNudgeNow('skip')).toBe(false);
  });
  it('catalogue Tier-2 anomalies use an investigation action set', () => {
    const anomaly = getSignal('material_carbon_spike');
    expect(anomaly?.tier).toBe('anomaly');
    expect(anomaly?.actionOptions).toContain('View Analysis');
    expect(anomaly?.actionOptions).not.toContain('Confirm');
  });
});

describe('Autonomy phase gate', () => {
  it('ranks phases silent_pilot < advisor < autonomous', () => {
    expect(AUTONOMY_PHASE_RANK.silent_pilot).toBeLessThan(AUTONOMY_PHASE_RANK.advisor);
    expect(AUTONOMY_PHASE_RANK.advisor).toBeLessThan(AUTONOMY_PHASE_RANK.autonomous);
  });
  it('silent_pilot is below advisor; advisor/autonomous pass', () => {
    expect(isPhaseAtLeast('silent_pilot', 'advisor')).toBe(false);
    expect(isPhaseAtLeast('advisor', 'advisor')).toBe(true);
    expect(isPhaseAtLeast('autonomous', 'advisor')).toBe(true);
    expect(isPhaseAtLeast(undefined, 'advisor')).toBe(false);
  });
});

describe('Nudge service (in-memory fallback)', () => {
  const base = {
    orgId: 'org-test',
    agentName: 'sitesense',
    signalKey: 'site_safety_low',
    entityId: 'site-A',
    recipientRole: 'Site Manager',
    tier: 'threshold' as const,
    gateDecision: 'act_now' as const,
    channels: ['in_app' as const],
    subject: 'Site A safety low',
    body: 'Safety score 54/100. Confirm or override?',
    actionOptions: ['Confirm', 'Override', 'More detail'],
  };

  beforeEach(async () => {
    // Resolve any leftover pending nudges so each test starts clean.
    for (const n of await nudgeService.listPending()) {
      await nudgeService.resolveNudge(n.id, 'dismissed');
    }
  });

  it('creates a nudge and then deduplicates the same signal+entity', async () => {
    const first = await nudgeService.createNudge({ ...base, entityId: 'site-dedup' });
    expect(first.created).toBe(true);

    const second = await nudgeService.createNudge({ ...base, entityId: 'site-dedup' });
    expect(second.created).toBe(false);
    expect(second.reason).toBe('duplicate');
    expect(second.nudgeId).toBe(first.nudgeId);
  });

  it('enforces the per-agent hourly rate limit', async () => {
    const notify = { channels: ['in_app' as const], maxPerHour: 2, maxPerDay: 20 };
    const a = await nudgeService.createNudge({
      ...base,
      agentName: 'rl-agent',
      entityId: 'e1',
      notify,
    });
    const b = await nudgeService.createNudge({
      ...base,
      agentName: 'rl-agent',
      entityId: 'e2',
      notify,
    });
    const c = await nudgeService.createNudge({
      ...base,
      agentName: 'rl-agent',
      entityId: 'e3',
      notify,
    });
    expect(a.created).toBe(true);
    expect(b.created).toBe(true);
    expect(c.created).toBe(false);
    expect(c.reason).toBe('rate_limited');
  });

  it('surfaces overdue pending nudges for escalation', async () => {
    await nudgeService.createNudge({ ...base, entityId: 'site-overdue', escalateAfterMs: -1000 });
    const overdue = await nudgeService.findOverdue();
    expect(overdue.some((n) => n.entityId === 'site-overdue')).toBe(true);
  });
});

describe('Nudge response handler', () => {
  it('normalizes raw button labels', () => {
    expect(normalizeAction('Confirm')).toBe('confirm');
    expect(normalizeAction('Override')).toBe('override');
    expect(normalizeAction('View Analysis')).toBe('investigate');
    expect(normalizeAction('Dismiss')).toBe('dismiss');
    expect(normalizeAction('???')).toBeNull();
  });

  it('override halts the agent action', async () => {
    const created = await nudgeService.createNudge({
      orgId: 'org-test',
      agentName: 'sitesense',
      signalKey: 'site_safety_low',
      entityId: 'site-override',
      recipientRole: 'Site Manager',
      tier: 'threshold',
      gateDecision: 'act_now',
      channels: ['in_app'],
      subject: 's',
      body: 'b',
      actionOptions: ['Confirm', 'Override'],
    });
    const res = await handleResponse(created.nudgeId!, 'override', {
      orgId: 'org-test',
      userId: 'u1',
    });
    expect(res.ok).toBe(true);
    expect(res.outcome).toBe('halt');
  });

  it('confirm tells the agent to proceed', async () => {
    const created = await nudgeService.createNudge({
      orgId: 'org-test',
      agentName: 'sitesense',
      signalKey: 'site_safety_low',
      entityId: 'site-confirm',
      recipientRole: 'Site Manager',
      tier: 'threshold',
      gateDecision: 'act_now',
      channels: ['in_app'],
      subject: 's',
      body: 'b',
      actionOptions: ['Confirm', 'Override'],
    });
    const res = await handleResponse(created.nudgeId!, 'confirm', {
      orgId: 'org-test',
      userId: 'u1',
    });
    expect(res.outcome).toBe('proceed');
  });
});
