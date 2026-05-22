/**
 * Memory Scheduler Tests — DWS IQ 6/7
 *
 * Tests for cron job wiring: decay + consolidation scheduling,
 * scope discovery, and manual run interface.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-256 (consolidation-cron)
 * Date: 2026-03-23
 * Owner: Lifetime Oy
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock node-cron before importing scheduler
const mockSchedule = vi.fn(() => ({ stop: vi.fn() }));
vi.mock('node-cron', () => ({
  schedule: mockSchedule,
}));

// Mock Supabase
const mockRpc = vi.fn();
const mockSelect = vi.fn();
const mockNot = vi.fn();
const mockIs = vi.fn();
const mockLimit = vi.fn();

const mockQueryBuilder = {
  select: mockSelect,
  not: mockNot,
  is: mockIs,
  limit: mockLimit,
};

// Chain returns itself
mockSelect.mockReturnValue(mockQueryBuilder);
mockNot.mockReturnValue(mockQueryBuilder);
mockIs.mockReturnValue(mockQueryBuilder);

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    rpc: mockRpc,
    from: vi.fn(() => mockQueryBuilder),
  })),
}));

vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('MemoryScheduler', () => {
  let MemoryScheduler: typeof import('../agents/memory.scheduler.js').MemoryScheduler;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-key';

    // Reset chain mocks
    mockSelect.mockReturnValue(mockQueryBuilder);
    mockNot.mockReturnValue(mockQueryBuilder);
    mockIs.mockReturnValue(mockQueryBuilder);

    const mod = await import('../agents/memory.scheduler.js');
    MemoryScheduler = mod.MemoryScheduler;
  });

  describe('start()', () => {
    it('should register two cron jobs at correct times', () => {
      const scheduler = new MemoryScheduler();
      scheduler.start();

      expect(mockSchedule).toHaveBeenCalledTimes(2);
      expect(mockSchedule).toHaveBeenNthCalledWith(
        1,
        '0 3 * * *',
        expect.any(Function),
        { timezone: 'Europe/Helsinki' },
      );
      expect(mockSchedule).toHaveBeenNthCalledWith(
        2,
        '30 3 * * *',
        expect.any(Function),
        { timezone: 'Europe/Helsinki' },
      );

      scheduler.stop();
    });
  });

  describe('stop()', () => {
    it('should stop both cron jobs', () => {
      const mockStop = vi.fn();
      mockSchedule.mockReturnValue({ stop: mockStop });

      const scheduler = new MemoryScheduler();
      scheduler.start();
      scheduler.stop();

      expect(mockStop).toHaveBeenCalledTimes(2);
    });
  });

  describe('runManually()', () => {
    it('should run decay job on manual trigger', async () => {
      // decay RPC
      mockRpc.mockResolvedValueOnce({ data: [], error: null });

      const scheduler = new MemoryScheduler();
      await scheduler.runManually('decay');

      expect(mockRpc).toHaveBeenCalledWith('decay_stale_memories', expect.objectContaining({
        p_half_life_days: 90,
        p_decay_threshold: 0.1,
      }));
    });

    it('should run consolidation job on manual trigger', async () => {
      // getActiveScopes: customer query returns empty
      mockLimit.mockResolvedValueOnce({ data: [], error: null });
      // getActiveScopes: org query returns empty
      mockLimit.mockResolvedValueOnce({ data: [], error: null });

      const scheduler = new MemoryScheduler();
      await scheduler.runManually('consolidation');

      // Only scope discovery queries, no consolidation RPCs (no scopes)
      expect(mockLimit).toHaveBeenCalledTimes(2);
    });

    it('should run both jobs when "all" is specified', async () => {
      // decay RPC
      mockRpc.mockResolvedValueOnce({ data: [], error: null });
      // getActiveScopes: customer + org queries
      mockLimit.mockResolvedValueOnce({ data: [], error: null });
      mockLimit.mockResolvedValueOnce({ data: [], error: null });

      const scheduler = new MemoryScheduler();
      await scheduler.runManually('all');

      // decay RPC was called
      expect(mockRpc).toHaveBeenCalledWith('decay_stale_memories', expect.any(Object));
    });

    it('should iterate over discovered customer scopes', async () => {
      // getActiveScopes: customer query returns two scopes
      mockLimit.mockResolvedValueOnce({
        data: [
          { org_id: 'org-1', customer_id: 'cust-a' },
          { org_id: 'org-1', customer_id: 'cust-b' },
          { org_id: 'org-1', customer_id: 'cust-a' }, // duplicate, should be deduped
        ],
        error: null,
      });
      // getActiveScopes: org query returns one org
      mockLimit.mockResolvedValueOnce({
        data: [{ org_id: 'org-1' }],
        error: null,
      });

      // consolidateDuplicates for cust-a: find + audit
      mockRpc.mockResolvedValueOnce({ data: [], error: null });
      mockRpc.mockResolvedValueOnce({ data: 'audit-1', error: null });
      // consolidateDuplicates for cust-b: find + audit
      mockRpc.mockResolvedValueOnce({ data: [], error: null });
      mockRpc.mockResolvedValueOnce({ data: 'audit-2', error: null });
      // consolidateOrgDuplicates for org-1: find + audit
      mockRpc.mockResolvedValueOnce({ data: [], error: null });
      mockRpc.mockResolvedValueOnce({ data: 'audit-3', error: null });

      const scheduler = new MemoryScheduler();
      await scheduler.runManually('consolidation');

      // 2 customer scopes (deduped from 3 rows) + 1 org scope = 3 find_duplicate calls
      expect(mockRpc).toHaveBeenCalledWith('find_duplicate_memories', expect.objectContaining({
        p_org_id: 'org-1',
        p_customer_id: 'cust-a',
        p_limit: 500,
      }));
      expect(mockRpc).toHaveBeenCalledWith('find_duplicate_memories', expect.objectContaining({
        p_org_id: 'org-1',
        p_customer_id: 'cust-b',
        p_limit: 500,
      }));
      expect(mockRpc).toHaveBeenCalledWith('find_duplicate_org_memories', expect.objectContaining({
        p_org_id: 'org-1',
        p_limit: 500,
      }));
    });
  });
});
