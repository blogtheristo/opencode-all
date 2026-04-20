/**
 * Notification Service Smoke Tests
 *
 * Covers the public surface of NotificationService:
 * - graceful degradation when Supabase is unconfigured
 * - event bus subscription lifecycle (start/stop)
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-982 (PR review coverage)
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Suppress logger noise ────────────────────────────────────────────────
vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// ── Mock event bus (subscriptions are exercised by start/stop) ──────────
const subscribeMock = vi.fn();
const unsubscribeCalls: Array<() => void> = [];
vi.mock('../agents/event-bus.js', () => ({
  eventBus: {
    subscribe: (pattern: string, handler: unknown) => {
      subscribeMock(pattern, handler);
      const unsub = vi.fn();
      unsubscribeCalls.push(unsub);
      return unsub;
    },
  },
}));

// ── Mock the shared Supabase client as null (graceful-degradation path) ──
vi.mock('../config/supabase.js', () => ({
  getSupabaseClient: () => null,
}));

import { notificationService } from '../services/notification.service.js';

describe('NotificationService — graceful degradation (supabase=null)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getUnreadCount returns 0 when supabase is null', async () => {
    const count = await notificationService.getUnreadCount('user-123');
    expect(count).toBe(0);
  });

  it('getNotifications returns empty list when supabase is null', async () => {
    const result = await notificationService.getNotifications('user-123');
    expect(result.notifications).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('markRead returns false when supabase is null', async () => {
    const ok = await notificationService.markRead('user-123', 'notif-1');
    expect(ok).toBe(false);
  });

  it('markAllRead returns 0 when supabase is null', async () => {
    const n = await notificationService.markAllRead('user-123');
    expect(n).toBe(0);
  });
});

describe('NotificationService — event bus lifecycle', () => {
  beforeEach(() => {
    subscribeMock.mockClear();
    unsubscribeCalls.length = 0;
  });

  it('start() subscribes at least one handler per notification rule', () => {
    notificationService.start();
    expect(subscribeMock.mock.calls.length).toBeGreaterThanOrEqual(1);
    for (const [pattern, handler] of subscribeMock.mock.calls) {
      expect(typeof pattern).toBe('string');
      expect(typeof handler).toBe('function');
    }
    notificationService.stop();
  });

  it('stop() invokes every unsubscribe returned by eventBus.subscribe', () => {
    notificationService.start();
    const captured = [...unsubscribeCalls];
    expect(captured.length).toBeGreaterThan(0);
    notificationService.stop();
    for (const unsub of captured) {
      expect(unsub).toHaveBeenCalledTimes(1);
    }
  });
});
