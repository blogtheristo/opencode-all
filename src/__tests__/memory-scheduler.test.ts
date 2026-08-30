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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock node-cron before importing scheduler
const mockSchedule = vi.fn(() => ({ stop: vi.fn() }));
vi.mock('node-cron', () => ({
  schedule: mockSchedule,
}));

// Mock the internal Postgres pool (memory.service.ts / memory.scheduler.ts
// both call getInternalDbPool() directly, no Supabase involved anymore).
const mockQuery = vi.fn();
const mockGetInternalDbPool = vi.fn(() => ({ query: mockQuery }));

vi.mock('../config/internal-db.js', () => ({
  getInternalDbPool: () => mockGetInternalDbPool(),
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
  let MemoryScheduler: typeof MemoryScheduler;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockGetInternalDbPool.mockReturnValue({ query: mockQuery });
    process.env.INTERNAL_DB_URL = 'postgres://test/test_internal';
    process.env.ENABLE_INTERNAL_DB_IN_TESTS = 'true';

    const mod = await import('../agents/memory.scheduler.js');
    MemoryScheduler = mod.MemoryScheduler;
  });

  afterEach(() => {
    delete process.env.INTERNAL_DB_URL;
    delete process.env.ENABLE_INTERNAL_DB_IN_TESTS;
  });

  describe('start()', () => {
    it('should register two cron jobs at correct times', () => {
      const scheduler = new MemoryScheduler();
      scheduler.start();

      expect(mockSchedule).toHaveBeenCalledTimes(2);
      expect(mockSchedule).toHaveBeenNthCalledWith(1, '0 3 * * *', expect.any(Function), {
        timezone: 'Europe/Helsinki',
      });
      expect(mockSchedule).toHaveBeenNthCalledWith(2, '30 3 * * *', expect.any(Function), {
        timezone: 'Europe/Helsinki',
      });

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
      // decay_stale_memories via callDbFunction -> pool.query
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const scheduler = new MemoryScheduler();
      await scheduler.runManually('decay');

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('decay_stale_memories'), [
        90,
        0.1,
        false,
        null,
      ]);
    });

    it('should run consolidation job on manual trigger', async () => {
      // getActiveScopes: customer query returns empty
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // getActiveScopes: org query returns empty
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const scheduler = new MemoryScheduler();
      await scheduler.runManually('consolidation');

      // Only scope discovery queries, no consolidation RPCs (no scopes found)
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it('should run both jobs when "all" is specified', async () => {
      // decay
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // getActiveScopes: customer + org queries
      mockQuery.mockResolvedValueOnce({ rows: [] });
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const scheduler = new MemoryScheduler();
      await scheduler.runManually('all');

      // decay query was issued
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('decay_stale_memories'),
        expect.any(Array),
      );
    });

    it('should iterate over discovered customer scopes', async () => {
      // getActiveScopes: customer query returns two scopes (dedup from 3 rows)
      mockQuery.mockResolvedValueOnce({
        rows: [
          { org_id: 'org-1', customer_id: 'cust-a' },
          { org_id: 'org-1', customer_id: 'cust-b' },
          { org_id: 'org-1', customer_id: 'cust-a' }, // duplicate, should be deduped
        ],
      });
      // getActiveScopes: org query returns one org
      mockQuery.mockResolvedValueOnce({ rows: [{ org_id: 'org-1' }] });

      // consolidateDuplicates for cust-a: find_duplicate_memories -> no pairs
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // consolidateDuplicates for cust-b: find_duplicate_memories -> no pairs
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // consolidateOrgDuplicates for org-1: find_duplicate_org_memories -> no pairs
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const scheduler = new MemoryScheduler();
      await scheduler.runManually('consolidation');

      // 2 customer scopes (deduped from 3 rows) + 1 org scope = 3 find_duplicate calls
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('find_duplicate_memories'), [
        'org-1',
        'cust-a',
        0.92,
        0.8,
        500,
      ]);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('find_duplicate_memories'), [
        'org-1',
        'cust-b',
        0.92,
        0.8,
        500,
      ]);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('find_duplicate_org_memories'),
        ['org-1', 0.92, 0.8, 500],
      );
    });
  });
});
