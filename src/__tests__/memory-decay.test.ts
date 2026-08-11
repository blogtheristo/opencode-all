/**
 * Memory Decay & Forget Passthrough Tests — DWS IQ 6/7
 *
 * Tests for:
 * - forget() agentId passthrough to forget_memory() (KYA-S §10.4 audit gap fix)
 * - decayStaleMemories() confidence decay + auto-forget below threshold
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-257 (memory-decay-audit)
 * Date: 2026-03-23
 * Owner: Lifetime Oy
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryService } from '../agents/memory.service.js';

// Mock the internal Postgres pool (src/config/internal-db.ts)
const mockQuery = vi.fn();
const mockPool = { query: mockQuery };
const mockGetInternalDbPool = vi.fn(() => mockPool);

vi.mock('../config/internal-db.js', () => ({
  getInternalDbPool: () => mockGetInternalDbPool(),
}));

// Mock logger
vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('MemoryService — Forget agentId Passthrough', () => {
  let service: MemoryService;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INTERNAL_DB_URL = 'postgres://test:test@localhost:5432/test';
    process.env.ENABLE_INTERNAL_DB_IN_TESTS = 'true';
    mockGetInternalDbPool.mockReturnValue(mockPool);
    service = new MemoryService();
  });

  it('should pass agentId to forget_memory', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ forget_memory: true }] });

    await service.forget({
      memoryId: 'mem-123',
      orgId: 'org-test',
      reason: 'confidence_decay',
      agentId: 'decay-cron',
    });

    // Param order: p_memory_id, forget_reason, p_agent_id, p_org_id
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('forget_memory'), [
      'mem-123',
      'confidence_decay',
      'decay-cron',
      'org-test',
    ]);
  });

  it('should default agentId to system when not provided', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ forget_memory: true }] });

    await service.forget({
      memoryId: 'mem-456',
      orgId: 'org-test',
      reason: 'user_request',
    });

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('forget_memory'), [
      'mem-456',
      'user_request',
      'system',
      'org-test',
    ]);
  });

  it('should pass orgId to forget_memory', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ forget_memory: true }] });

    await service.forget({
      memoryId: 'mem-789',
      orgId: 'org-specific',
      reason: 'test',
      agentId: 'test-agent',
    });

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('forget_memory'), [
      'mem-789',
      'test',
      'test-agent',
      'org-specific',
    ]);
  });
});

describe('MemoryService — Decay Stale Memories', () => {
  let service: MemoryService;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INTERNAL_DB_URL = 'postgres://test:test@localhost:5432/test';
    process.env.ENABLE_INTERNAL_DB_IN_TESTS = 'true';
    mockGetInternalDbPool.mockReturnValue(mockPool);
    service = new MemoryService();
  });

  it('should call decay_stale_memories with defaults', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await service.decayStaleMemories();

    // Param order: p_half_life_days, p_decay_threshold, p_dry_run, p_org_id
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('decay_stale_memories'), [
      90,
      0.1,
      false,
      null,
    ]);
  });

  it('should pass custom options to the query', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await service.decayStaleMemories({
      halfLifeDays: 30,
      decayThreshold: 0.2,
      dryRun: true,
      orgId: 'org-custom',
    });

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('decay_stale_memories'), [
      30,
      0.2,
      true,
      'org-custom',
    ]);
  });

  it('should auto-forget memories below threshold', async () => {
    // First call: decay query returns two memories, one below threshold
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          memory_id: 'mem-a',
          org_id: 'org-1',
          old_confidence: 0.5,
          new_confidence: 0.3,
          below_threshold: false,
        },
        {
          memory_id: 'mem-b',
          org_id: 'org-1',
          old_confidence: 0.2,
          new_confidence: 0.05,
          below_threshold: true,
        },
      ],
    });
    // Second call: forget_memory query for the below-threshold memory
    mockQuery.mockResolvedValueOnce({ rows: [{ forget_memory: true }] });

    const result = await service.decayStaleMemories();

    expect(result.decayedCount).toBe(2);
    expect(result.forgottenCount).toBe(1);
    expect(result.forgottenIds).toEqual(['mem-b']);

    // Verify forget was called with decay-cron agent attribution
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('forget_memory'), [
      'mem-b',
      expect.stringContaining('confidence_decay'),
      'decay-cron',
      'org-1',
    ]);
  });

  it('should not forget in dry run mode', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          memory_id: 'mem-c',
          org_id: 'org-1',
          old_confidence: 0.2,
          new_confidence: 0.05,
          below_threshold: true,
        },
      ],
    });

    const result = await service.decayStaleMemories({ dryRun: true });

    expect(result.decayedCount).toBe(1);
    expect(result.forgottenCount).toBe(0);
    expect(result.forgottenIds).toEqual([]);
    // Only one query (decay), no forget calls
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should handle query errors gracefully', async () => {
    mockQuery.mockRejectedValueOnce(new Error('function does not exist'));

    const result = await service.decayStaleMemories();

    expect(result.decayedCount).toBe(0);
    expect(result.forgottenCount).toBe(0);
    expect(result.dryRun).toBe(false);
  });

  it('should return empty results when internal Postgres is not configured', async () => {
    mockGetInternalDbPool.mockReturnValueOnce(null);
    const unconfigured = new MemoryService();

    const result = await unconfigured.decayStaleMemories();

    expect(result.decayedCount).toBe(0);
    expect(result.dryRun).toBe(true);
  });
});
