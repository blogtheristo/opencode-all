// Evidence: Tool=Claude Code Model=claude-sonnet-5 Date=2026-09-22
// Audit trail: git log -- src/__tests__/event-bus-dapr-pilot.test.ts
//
// Covers the Dapr pub/sub pilot (docs/field-notes/2026-09-22-dapr-use-cases-dws.md
// §3 Phase 1): the flag defaults off, only the pilot event type ever
// touches Dapr, local dispatch never depends on the sidecar, and a
// Dapr-delivered event never re-publishes (no infinite loop).

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function baseEvent(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    type: 'agent.task_complete',
    source: 'test',
    payload: { ok: true },
    priority: 'normal' as const,
    timestamp: new Date().toISOString(),
    orgId: 'org_1',
    sessionId: 'sess_1',
    ...overrides,
  };
}

describe('event-bus Dapr pub/sub pilot', () => {
  const originalFlag = process.env.DAPR_PUBSUB_PILOT_ENABLED;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 202 }));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    if (originalFlag === undefined) delete process.env.DAPR_PUBSUB_PILOT_ENABLED;
    else process.env.DAPR_PUBSUB_PILOT_ENABLED = originalFlag;
    vi.resetModules();
  });

  it('never calls Dapr when the pilot flag is unset (default state)', async () => {
    delete process.env.DAPR_PUBSUB_PILOT_ENABLED;
    const { eventBus } = await import('../agents/event-bus.js');

    await eventBus.emit(baseEvent());

    const daprCalls = fetchSpy.mock.calls.filter(([url]) => String(url).includes('/v1.0/publish/'));
    expect(daprCalls).toHaveLength(0);
  });

  it('publishes only the pilot event type when the flag is on', async () => {
    process.env.DAPR_PUBSUB_PILOT_ENABLED = 'true';
    vi.resetModules();
    const { eventBus } = await import('../agents/event-bus.js');

    await eventBus.emit(baseEvent({ type: 'compliance.alert' }));
    expect(
      fetchSpy.mock.calls.filter(([url]) => String(url).includes('/v1.0/publish/')),
    ).toHaveLength(0);

    await eventBus.emit(baseEvent({ type: 'agent.task_complete' }));
    const daprCalls = fetchSpy.mock.calls.filter(([url]) => String(url).includes('/v1.0/publish/'));
    expect(daprCalls).toHaveLength(1);
    expect(String(daprCalls[0][0])).toContain('/v1.0/publish/dws-pubsub/agent.task_complete');
  });

  it('still dispatches to local subscribers even when the Dapr sidecar is unreachable', async () => {
    process.env.DAPR_PUBSUB_PILOT_ENABLED = 'true';
    vi.resetModules();
    fetchSpy.mockRejectedValue(new Error('ECONNREFUSED'));
    const { eventBus } = await import('../agents/event-bus.js');

    const handler = vi.fn(async () => {});
    eventBus.subscribe('agent.task_complete', handler);

    await expect(eventBus.emit(baseEvent())).resolves.toBeUndefined();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('dispatchFromDapr delivers to local subscribers without re-publishing to Dapr', async () => {
    delete process.env.DAPR_PUBSUB_PILOT_ENABLED;
    const { eventBus } = await import('../agents/event-bus.js');

    const handler = vi.fn(async () => {});
    eventBus.subscribe('agent.task_complete', handler);

    await eventBus.dispatchFromDapr(baseEvent());

    expect(handler).toHaveBeenCalledTimes(1);
    expect(
      fetchSpy.mock.calls.filter(([url]) => String(url).includes('/v1.0/publish/')),
    ).toHaveLength(0);
  });
});
