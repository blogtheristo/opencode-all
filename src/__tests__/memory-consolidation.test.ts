/**
 * Memory Consolidation Tests — DWS IQ 6/7
 *
 * Tests for near-duplicate detection and consolidation (PR-256).
 * Verifies GDPR Art 5 scope enforcement (mandatory customer_id),
 * auto-consolidation via supersede, and KYA-S §10.2 hard gate.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-256 (consolidation-cron)
 * Date: 2026-03-23
 * Owner: Lifetime Oy
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryService } from '../agents/memory.service.js';

const mockRpc = vi.fn();
const mockFrom = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockIs = vi.fn();

const mockUpdateChain = {
  eq: mockEq,
  is: mockIs,
};

// update().eq().eq().is().is() chain returns a promise-like result at the end
mockEq.mockReturnValue(mockUpdateChain);
mockIs.mockResolvedValue({ error: null });
mockUpdate.mockReturnValue(mockUpdateChain);
mockFrom.mockReturnValue({ update: mockUpdate });

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    rpc: mockRpc,
    from: mockFrom,
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

describe('MemoryService — Consolidation', () => {
  let service: MemoryService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRpc.mockReset();
    mockFrom.mockReset();
    mockUpdate.mockReset();
    mockEq.mockReset();
    mockIs.mockReset();
    mockFrom.mockReturnValue({ update: mockUpdate });
    mockUpdate.mockReturnValue(mockUpdateChain);
    mockEq.mockReturnValue(mockUpdateChain);
    mockIs.mockResolvedValue({ error: null });
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-key';
    service = new MemoryService();
  });

  describe('consolidateDuplicates()', () => {
    it('should call find_duplicate_memories with mandatory org + customer scope', async () => {
      mockRpc.mockResolvedValueOnce({ data: [], error: null });
      // logAudit RPC
      mockRpc.mockResolvedValueOnce({ data: 'audit-1', error: null });

      await service.consolidateDuplicates('org-1', 'cust-abc');

      expect(mockRpc).toHaveBeenCalledWith('find_duplicate_memories', {
        p_org_id: 'org-1',
        p_customer_id: 'cust-abc',
        p_auto_threshold: 0.92,
        p_review_threshold: 0.80,
        p_limit: 500,
      });
    });

    it('should auto-consolidate pairs above 0.92 via supersede', async () => {
      // First call: find duplicates
      mockRpc.mockResolvedValueOnce({
        data: [{
          memory_a_id: 'mem-a',
          memory_b_id: 'mem-b',
          content_a: 'ACME has 250 employees',
          content_b: 'ACME Corp employs 250 people',
          confidence_a: 0.9,
          confidence_b: 0.7,
          cosine_similarity: 0.95,
          needs_review: false,
          keep_id: 'mem-a',
          supersede_id: 'mem-b',
        }],
        error: null,
      });
      // Second call: supersede_memory RPC
      mockRpc.mockResolvedValueOnce({
        data: [{
          new_memory_id: 'new-mem-1',
          requires_review: false,
          confidence_delta: 0.2,
          kya_decision: 'auto_approved (confidence_delta 0.20 <= 0.3)',
        }],
        error: null,
      });
      // Third call: logAudit
      mockRpc.mockResolvedValueOnce({ data: 'audit-1', error: null });

      const result = await service.consolidateDuplicates('org-1', 'cust-abc');

      expect(result.pairsFound).toBe(1);
      expect(result.autoConsolidated).toBe(1);
      expect(result.flaggedForReview).toBe(0);

      // Verify supersede was called with correct keep content
      expect(mockRpc).toHaveBeenCalledWith('supersede_memory', expect.objectContaining({
        p_old_memory_id: 'mem-b',
        p_new_content: 'ACME has 250 employees',
        p_agent_id: 'consolidation-cron',
        p_reason: expect.stringContaining('duplicate_consolidation'),
      }));
      expect(mockFrom).toHaveBeenCalledWith('semantic_memories');
    });

    it('should flag pairs in 0.80-0.92 range for review', async () => {
      mockRpc.mockResolvedValueOnce({
        data: [{
          memory_a_id: 'mem-c',
          memory_b_id: 'mem-d',
          content_a: 'ACME is in Helsinki',
          content_b: 'ACME headquarters Finland',
          confidence_a: 0.8,
          confidence_b: 0.8,
          cosine_similarity: 0.87,
          needs_review: true,
          keep_id: 'mem-c',
          supersede_id: 'mem-d',
        }],
        error: null,
      });
      mockRpc.mockResolvedValueOnce({ data: 'audit-1', error: null });

      const result = await service.consolidateDuplicates('org-1', 'cust-abc');

      expect(result.pairsFound).toBe(1);
      expect(result.autoConsolidated).toBe(0);
      expect(result.flaggedForReview).toBe(1);
      // No supersede call — only find_duplicate_memories + logAudit
      expect(mockRpc).toHaveBeenCalledTimes(2);
    });

    it('should count KYA blocks when confidence_delta > 0.3', async () => {
      // Duplicate pair found
      mockRpc.mockResolvedValueOnce({
        data: [{
          memory_a_id: 'mem-e',
          memory_b_id: 'mem-f',
          content_a: 'Revenue is 10M',
          content_b: 'Revenue is ten million',
          confidence_a: 0.9,
          confidence_b: 0.4,
          cosine_similarity: 0.93,
          needs_review: false,
          keep_id: 'mem-e',
          supersede_id: 'mem-f',
        }],
        error: null,
      });
      // Supersede returns requires_review (confidence_delta 0.5 > 0.3)
      mockRpc.mockResolvedValueOnce({
        data: [{
          new_memory_id: null,
          requires_review: true,
          confidence_delta: 0.5,
          kya_decision: 'pending_review (confidence_delta > 0.3)',
        }],
        error: null,
      });
      mockRpc.mockResolvedValueOnce({ data: 'audit-1', error: null });

      const result = await service.consolidateDuplicates('org-1', 'cust-abc');

      expect(result.autoConsolidated).toBe(0);
      expect(result.blockedByKya).toBe(1);
    });

    it('should not call supersede in dry run mode', async () => {
      mockRpc.mockResolvedValueOnce({
        data: [{
          memory_a_id: 'mem-g',
          memory_b_id: 'mem-h',
          content_a: 'Fact A',
          content_b: 'Fact A duplicate',
          confidence_a: 0.9,
          confidence_b: 0.8,
          cosine_similarity: 0.96,
          needs_review: false,
          keep_id: 'mem-g',
          supersede_id: 'mem-h',
        }],
        error: null,
      });
      mockRpc.mockResolvedValueOnce({ data: 'audit-1', error: null });

      const result = await service.consolidateDuplicates('org-1', 'cust-abc', { dryRun: true });

      expect(result.autoConsolidated).toBe(1);
      expect(result.dryRun).toBe(true);
      // Only find + logAudit, no supersede
      expect(mockRpc).toHaveBeenCalledTimes(2);
    });

    it('should handle RPC errors gracefully', async () => {
      mockRpc.mockResolvedValueOnce({
        data: null,
        error: { message: 'function does not exist' },
      });

      const result = await service.consolidateDuplicates('org-1', 'cust-abc');

      expect(result.pairsFound).toBe(0);
      expect(result.autoConsolidated).toBe(0);
    });

    it('should return empty when supabase not configured', async () => {
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_KEY;
      const unconfigured = new MemoryService();

      const result = await unconfigured.consolidateDuplicates('org-1', 'cust-abc');

      expect(result.pairsFound).toBe(0);
      expect(result.dryRun).toBe(true);
    });
  });

  describe('consolidateOrgDuplicates()', () => {
    it('should call find_duplicate_org_memories (no customer_id param)', async () => {
      mockRpc.mockResolvedValueOnce({ data: [], error: null });
      mockRpc.mockResolvedValueOnce({ data: 'audit-1', error: null });

      await service.consolidateOrgDuplicates('org-1');

      expect(mockRpc).toHaveBeenCalledWith('find_duplicate_org_memories', {
        p_org_id: 'org-1',
        p_auto_threshold: 0.92,
        p_review_threshold: 0.80,
        p_limit: 500,
      });
    });

    it('should accept custom thresholds', async () => {
      mockRpc.mockResolvedValueOnce({ data: [], error: null });
      mockRpc.mockResolvedValueOnce({ data: 'audit-1', error: null });

      await service.consolidateOrgDuplicates('org-1', {
        autoThreshold: 0.95,
        reviewThreshold: 0.85,
      });

      expect(mockRpc).toHaveBeenCalledWith('find_duplicate_org_memories', {
        p_org_id: 'org-1',
        p_auto_threshold: 0.95,
        p_review_threshold: 0.85,
        p_limit: 500,
      });
    });
  });
});
