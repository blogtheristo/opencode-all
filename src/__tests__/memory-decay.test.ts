/**
 * Memory Decay & Forget Passthrough Tests — DWS IQ 6/7
 *
 * Tests for:
 * - forget() agentId passthrough to forget_memory() RPC (KYA-S §10.4 audit gap fix)
 * - decayStaleMemories() confidence decay + auto-forget below threshold
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-257 (memory-decay-audit)
 * Date: 2026-03-23
 * Owner: Lifetime Oy
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryService } from '../agents/memory.service.js';

// Mock Supabase client
const mockRpc = vi.fn();
const mockFrom = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    rpc: mockRpc,
    from: mockFrom,
  })),
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
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-key';
    service = new MemoryService();
  });

  it('should pass agentId to forget_memory RPC', async () => {
    mockRpc.mockResolvedValueOnce({ data: true, error: null });

    await service.forget({
      memoryId: 'mem-123',
      orgId: 'org-test',
      reason: 'confidence_decay',
      agentId: 'decay-cron',
    });

    expect(mockRpc).toHaveBeenCalledWith('forget_memory', {
      p_memory_id: 'mem-123',
      forget_reason: 'confidence_decay',
      p_agent_id: 'decay-cron',
      p_org_id: 'org-test',
    });
  });

  it('should default agentId to system when not provided', async () => {
    mockRpc.mockResolvedValueOnce({ data: true, error: null });

    await service.forget({
      memoryId: 'mem-456',
      orgId: 'org-test',
      reason: 'user_request',
    });

    expect(mockRpc).toHaveBeenCalledWith('forget_memory', {
      p_memory_id: 'mem-456',
      forget_reason: 'user_request',
      p_agent_id: 'system',
      p_org_id: 'org-test',
    });
  });

  it('should pass orgId to forget_memory RPC', async () => {
    mockRpc.mockResolvedValueOnce({ data: true, error: null });

    await service.forget({
      memoryId: 'mem-789',
      orgId: 'org-specific',
      reason: 'test',
      agentId: 'test-agent',
    });

    expect(mockRpc).toHaveBeenCalledWith('forget_memory', expect.objectContaining({
      p_org_id: 'org-specific',
    }));
  });
});

describe('MemoryService — Decay Stale Memories', () => {
  let service: MemoryService;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-key';
    service = new MemoryService();
  });

  it('should call decay_stale_memories RPC with defaults', async () => {
    mockRpc.mockResolvedValueOnce({ data: [], error: null });

    await service.decayStaleMemories();

    expect(mockRpc).toHaveBeenCalledWith('decay_stale_memories', {
      p_half_life_days: 90,
      p_decay_threshold: 0.1,
      p_dry_run: false,
      p_org_id: null,
    });
  });

  it('should pass custom options to RPC', async () => {
    mockRpc.mockResolvedValueOnce({ data: [], error: null });

    await service.decayStaleMemories({
      halfLifeDays: 30,
      decayThreshold: 0.2,
      dryRun: true,
      orgId: 'org-custom',
    });

    expect(mockRpc).toHaveBeenCalledWith('decay_stale_memories', {
      p_half_life_days: 30,
      p_decay_threshold: 0.2,
      p_dry_run: true,
      p_org_id: 'org-custom',
    });
  });

  it('should auto-forget memories below threshold', async () => {
    // First call: decay RPC returns two memories, one below threshold
    mockRpc.mockResolvedValueOnce({
      data: [
        { memory_id: 'mem-a', org_id: 'org-1', old_confidence: 0.5, new_confidence: 0.3, below_threshold: false },
        { memory_id: 'mem-b', org_id: 'org-1', old_confidence: 0.2, new_confidence: 0.05, below_threshold: true },
      ],
      error: null,
    });
    // Second call: forget_memory RPC for the below-threshold memory
    mockRpc.mockResolvedValueOnce({ data: true, error: null });

    const result = await service.decayStaleMemories();

    expect(result.decayedCount).toBe(2);
    expect(result.forgottenCount).toBe(1);
    expect(result.forgottenIds).toEqual(['mem-b']);

    // Verify forget was called with decay-cron agent attribution
    expect(mockRpc).toHaveBeenCalledWith('forget_memory', {
      p_memory_id: 'mem-b',
      forget_reason: expect.stringContaining('confidence_decay'),
      p_agent_id: 'decay-cron',
      p_org_id: 'org-1',
    });
  });

  it('should not forget in dry run mode', async () => {
    mockRpc.mockResolvedValueOnce({
      data: [
        { memory_id: 'mem-c', org_id: 'org-1', old_confidence: 0.2, new_confidence: 0.05, below_threshold: true },
      ],
      error: null,
    });

    const result = await service.decayStaleMemories({ dryRun: true });

    expect(result.decayedCount).toBe(1);
    expect(result.forgottenCount).toBe(0);
    expect(result.forgottenIds).toEqual([]);
    // Only one RPC call (decay), no forget calls
    expect(mockRpc).toHaveBeenCalledTimes(1);
  });

  it('should handle RPC errors gracefully', async () => {
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: 'function does not exist' },
    });

    const result = await service.decayStaleMemories();

    expect(result.decayedCount).toBe(0);
    expect(result.forgottenCount).toBe(0);
    expect(result.dryRun).toBe(false);
  });

  it('should return empty results when supabase not configured', async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_KEY;
    const unconfigured = new MemoryService();

    const result = await unconfigured.decayStaleMemories();

    expect(result.decayedCount).toBe(0);
    expect(result.dryRun).toBe(true);
  });
});
