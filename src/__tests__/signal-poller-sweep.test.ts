/**
 * Signal Poller — overdue-escalation sweep tests
 *
 * The sweep is the restart-safe counterpart to in-memory escalation timers:
 * any pending nudge whose human-response window has lapsed must be resolved
 * as 'escalated' and announced on the event bus. These tests pin that
 * contract without touching Supabase or wall-clock timing (the DB owns the
 * "overdue" decision; findOverdue is mocked).
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findOverdueMock, resolveNudgeMock, emitMock } = vi.hoisted(() => ({
  findOverdueMock: vi.fn(),
  resolveNudgeMock: vi.fn(),
  emitMock: vi.fn(),
}));

vi.mock('../config/supabase.js', () => ({ getSupabaseClient: () => null }));
vi.mock('../agents/event-bus.js', () => ({
  eventBus: { emit: emitMock.mockResolvedValue(undefined), subscribe: vi.fn() },
}));
vi.mock('../agents/nudge.service.js', () => ({
  nudgeService: {
    findOverdue: findOverdueMock,
    resolveNudge: resolveNudgeMock,
  },
}));

import { signalPoller } from '../agents/signal-poller.js';

const baseNudge = {
  id: 'nudge-1',
  agentName: 'sitesense',
  signalKey: 'site-safety',
  entityId: 'site-42',
  recipientRole: 'foreman',
  subject: 'Safety score below floor',
  orgId: 'org-1',
};

describe('signalPoller.sweepOverdue', () => {
  beforeEach(() => {
    findOverdueMock.mockReset().mockResolvedValue([]);
    resolveNudgeMock.mockReset().mockResolvedValue(true);
    emitMock.mockClear();
  });

  it('returns 0 and emits nothing when nothing is overdue', async () => {
    const escalated = await signalPoller.sweepOverdue();
    expect(escalated).toBe(0);
    expect(resolveNudgeMock).not.toHaveBeenCalled();
    expect(emitMock).not.toHaveBeenCalled();
  });

  it('escalates each overdue nudge and emits a high-priority event', async () => {
    findOverdueMock.mockResolvedValue([baseNudge]);

    const escalated = await signalPoller.sweepOverdue();

    expect(escalated).toBe(1);
    expect(resolveNudgeMock).toHaveBeenCalledWith(
      'nudge-1',
      'escalated',
      'No human response within the configured window',
    );
    expect(emitMock).toHaveBeenCalledTimes(1);
    const event = emitMock.mock.calls[0][0];
    expect(event.type).toBe('agent.nudge_escalated');
    expect(event.priority).toBe('high');
    expect(event.orgId).toBe('org-1');
    expect(event.payload.nudgeId).toBe('nudge-1');
    expect(event.source).toBe('agent:sitesense');
  });

  it('does not escalate or emit when resolution fails', async () => {
    findOverdueMock.mockResolvedValue([baseNudge]);
    resolveNudgeMock.mockResolvedValue(false);

    const escalated = await signalPoller.sweepOverdue();

    expect(escalated).toBe(0);
    expect(emitMock).not.toHaveBeenCalled();
  });

  it('keeps sweeping remaining nudges after one resolution fails', async () => {
    findOverdueMock.mockResolvedValue([
      { ...baseNudge, id: 'nudge-a' },
      { ...baseNudge, id: 'nudge-b' },
    ]);
    resolveNudgeMock.mockImplementation(async (id: string) => id === 'nudge-b');

    const escalated = await signalPoller.sweepOverdue();

    expect(escalated).toBe(1);
    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(emitMock.mock.calls[0][0].payload.nudgeId).toBe('nudge-b');
  });
});
