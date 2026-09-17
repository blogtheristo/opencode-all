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

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryService } from '../agents/memory.service.js';

// Mock the internal Postgres pool (src/config/internal-db.ts)
const mockQuery = vi.fn();
const mockPool = { query: mockQuery };
const mockGetInternalDbPool = vi.fn(() => mockPool);

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

describe('MemoryService — Consolidation', () => {
  let service: MemoryService;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INTERNAL_DB_URL = 'postgres://test:test@localhost:5432/test';
    process.env.ENABLE_INTERNAL_DB_IN_TESTS = 'true';
    mockGetInternalDbPool.mockReturnValue(mockPool);
    service = new MemoryService();
  });

  describe('consolidateDuplicates()', () => {
    it('should call find_duplicate_memories with mandatory org + customer scope', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] }); // find_duplicate_memories
      mockQuery.mockResolvedValueOnce({ rows: [{ log_memory_audit: 'audit-1' }] }); // fire-and-forget logAudit

      await service.consolidateDuplicates('org-1', 'cust-abc');

      // Param order: p_org_id, p_customer_id, p_auto_threshold, p_review_threshold, p_limit
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('find_duplicate_memories'), [
        'org-1',
        'cust-abc',
        0.92,
        0.8,
        500,
      ]);
    });

    it('should auto-consolidate pairs above 0.92 via supersede', async () => {
      // First call: find duplicates
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
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
          },
        ],
      });
      // Second call: supersede_memory
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            new_memory_id: 'new-mem-1',
            requires_review: false,
            confidence_delta: 0.2,
            kya_decision: 'auto_approved (confidence_delta 0.20 <= 0.3)',
          },
        ],
      });
      // Third call: UPDATE semantic_memories (mark previously-kept row as superseded)
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // Fourth call: fire-and-forget logAudit
      mockQuery.mockResolvedValueOnce({ rows: [{ log_memory_audit: 'audit-1' }] });

      const result = await service.consolidateDuplicates('org-1', 'cust-abc');

      expect(result.pairsFound).toBe(1);
      expect(result.autoConsolidated).toBe(1);
      expect(result.flaggedForReview).toBe(0);

      // Verify supersede was called with correct keep content, orgId, and agent attribution.
      // Param order: p_old_memory_id, p_new_content, p_new_confidence, p_new_source,
      // p_reason, p_agent_id, p_agent_ats, p_org_id, p_customer_id, p_new_metadata
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('supersede_memory'), [
        'mem-b',
        'ACME has 250 employees',
        0.9,
        'consolidation-cron',
        expect.stringContaining('duplicate_consolidation'),
        'consolidation-cron',
        null,
        'org-1',
        null,
        {},
      ]);

      // Verify the keep-row was marked superseded by the new canonical memory
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('UPDATE semantic_memories'), [
        'new-mem-1',
        'mem-a',
        'org-1',
      ]);
    });

    it('should flag pairs in 0.80-0.92 range for review', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
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
          },
        ],
      });
      mockQuery.mockResolvedValueOnce({ rows: [{ log_memory_audit: 'audit-1' }] });

      const result = await service.consolidateDuplicates('org-1', 'cust-abc');

      expect(result.pairsFound).toBe(1);
      expect(result.autoConsolidated).toBe(0);
      expect(result.flaggedForReview).toBe(1);
      // No supersede call — only find_duplicate_memories + logAudit
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it('should count KYA blocks when confidence_delta > 0.3', async () => {
      // Duplicate pair found
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
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
          },
        ],
      });
      // Supersede returns requires_review (confidence_delta 0.5 > 0.3) — no UPDATE follows
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            new_memory_id: null,
            requires_review: true,
            confidence_delta: 0.5,
            kya_decision: 'pending_review (confidence_delta > 0.3)',
          },
        ],
      });
      mockQuery.mockResolvedValueOnce({ rows: [{ log_memory_audit: 'audit-1' }] });

      const result = await service.consolidateDuplicates('org-1', 'cust-abc');

      expect(result.autoConsolidated).toBe(0);
      expect(result.blockedByKya).toBe(1);
    });

    it('should not call supersede in dry run mode', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
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
          },
        ],
      });
      mockQuery.mockResolvedValueOnce({ rows: [{ log_memory_audit: 'audit-1' }] });

      const result = await service.consolidateDuplicates('org-1', 'cust-abc', { dryRun: true });

      expect(result.autoConsolidated).toBe(1);
      expect(result.dryRun).toBe(true);
      // Only find + logAudit, no supersede
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it('should handle query errors gracefully', async () => {
      mockQuery.mockRejectedValueOnce(new Error('function does not exist'));

      const result = await service.consolidateDuplicates('org-1', 'cust-abc');

      expect(result.pairsFound).toBe(0);
      expect(result.autoConsolidated).toBe(0);
    });

    it('should return empty when internal Postgres is not configured', async () => {
      mockGetInternalDbPool.mockReturnValueOnce(null);
      const unconfigured = new MemoryService();

      const result = await unconfigured.consolidateDuplicates('org-1', 'cust-abc');

      expect(result.pairsFound).toBe(0);
      expect(result.dryRun).toBe(true);
    });
  });

  describe('consolidateOrgDuplicates()', () => {
    it('should call find_duplicate_org_memories (no customer_id param)', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      mockQuery.mockResolvedValueOnce({ rows: [{ log_memory_audit: 'audit-1' }] });

      await service.consolidateOrgDuplicates('org-1');

      // Param order: p_org_id, p_auto_threshold, p_review_threshold, p_limit
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('find_duplicate_org_memories'),
        ['org-1', 0.92, 0.8, 500],
      );
    });

    it('should accept custom thresholds', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      mockQuery.mockResolvedValueOnce({ rows: [{ log_memory_audit: 'audit-1' }] });

      await service.consolidateOrgDuplicates('org-1', {
        autoThreshold: 0.95,
        reviewThreshold: 0.85,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('find_duplicate_org_memories'),
        ['org-1', 0.95, 0.85, 500],
      );
    });
  });
});
