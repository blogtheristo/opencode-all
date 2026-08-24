/**
 * Memory Supersede & Audit Tests — DWS IQ 6/7
 *
 * Tests for temporal contradiction resolution (supersede) and
 * memory audit trail logging (KYA-S §10).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-255 (contradiction-resolution)
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

describe('MemoryService — Supersede (Contradiction Resolution)', () => {
  let service: MemoryService;

  beforeEach(() => {
    vi.clearAllMocks();
    // Set env vars so getPool() succeeds
    process.env.INTERNAL_DB_URL = 'postgres://test:test@localhost:5432/test';
    process.env.ENABLE_INTERNAL_DB_IN_TESTS = 'true';
    mockGetInternalDbPool.mockReturnValue(mockPool);
    service = new MemoryService();
  });

  describe('supersede()', () => {
    it('should auto-approve when confidence_delta <= 0.3', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            new_memory_id: 'new-mem-123',
            requires_review: false,
            confidence_delta: 0.1,
            kya_decision: 'auto_approved (confidence_delta 0.10 <= 0.3)',
          },
        ],
      });

      const result = await service.supersede({
        oldMemoryId: 'old-mem-456',
        newContent: 'ACME has 300 employees',
        orgId: 'org-test',
        newConfidence: 1.0,
        newSource: 'annual-report-2025',
        reason: 'temporal_supersede: newer source',
        agentId: 'compliance-agent',
      });

      expect(result.newMemoryId).toBe('new-mem-123');
      expect(result.requiresReview).toBe(false);
      expect(result.confidenceDelta).toBe(0.1);
      expect(result.kyaDecision).toContain('auto_approved');

      // Verify the supersede_memory query was called with correct positional params,
      // in the same order memory.service.ts builds them (p_old_memory_id, p_new_content,
      // p_new_confidence, p_new_source, p_reason, p_agent_id, p_agent_ats, p_org_id,
      // p_customer_id, p_new_metadata).
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('supersede_memory'), [
        'old-mem-456',
        'ACME has 300 employees',
        1.0,
        'annual-report-2025',
        'temporal_supersede: newer source',
        'compliance-agent',
        null,
        'org-test',
        null,
        {},
      ]);
    });

    it('should require review when confidence_delta > 0.3', async () => {
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

      const result = await service.supersede({
        oldMemoryId: 'old-mem-789',
        newContent: 'ACME has 500 employees',
        orgId: 'org-test',
        newConfidence: 0.4,
        reason: 'temporal_supersede: uncertain source',
      });

      expect(result.newMemoryId).toBeNull();
      expect(result.requiresReview).toBe(true);
      expect(result.confidenceDelta).toBe(0.5);
      expect(result.kyaDecision).toContain('pending_review');
    });

    it('should handle query errors gracefully', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Memory not found or already superseded'));

      const result = await service.supersede({
        oldMemoryId: 'nonexistent-id',
        newContent: 'New content',
        orgId: 'org-test',
      });

      expect(result.newMemoryId).toBeNull();
      expect(result.kyaDecision).toContain('error');
    });

    it('should pass agent_ats when provided', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            new_memory_id: 'new-mem-ats',
            requires_review: false,
            confidence_delta: 0.0,
            kya_decision: 'auto_approved (confidence_delta 0.00 <= 0.3)',
          },
        ],
      });

      await service.supersede({
        oldMemoryId: 'old-mem-ats',
        newContent: 'Updated fact',
        orgId: 'org-test',
        agentId: 'compliance-agent',
        agentAts: 0.87,
      });

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('supersede_memory'), [
        'old-mem-ats',
        'Updated fact',
        1.0,
        'agent',
        'temporal_supersede',
        'compliance-agent',
        0.87,
        'org-test',
        null,
        {},
      ]);
    });

    it('should return gracefully when internal Postgres is not configured', async () => {
      mockGetInternalDbPool.mockReturnValueOnce(null);
      const unconfiguredService = new MemoryService();

      const result = await unconfiguredService.supersede({
        oldMemoryId: 'any-id',
        newContent: 'content',
        orgId: 'org',
      });

      expect(result.newMemoryId).toBeNull();
      expect(result.kyaDecision).toContain('not configured');
    });
  });

  describe('logAudit()', () => {
    it('should log store audit entry via query', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ log_memory_audit: 'audit-id-123' }],
      });

      const auditId = await service.logAudit('store', 'compliance-agent', 'org-test', 'mem-123', {
        memory_type: 'fact',
        confidence: 0.9,
      });

      expect(auditId).toBe('audit-id-123');
      // Param order: p_operation, p_agent_id, p_memory_id, p_org_id, p_metadata
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('log_memory_audit'), [
        'store',
        'compliance-agent',
        'mem-123',
        'org-test',
        { memory_type: 'fact', confidence: 0.9 },
      ]);
    });

    it('should log extract audit entry via query', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ log_memory_audit: 'audit-id-456' }],
      });

      const auditId = await service.logAudit(
        'extract',
        'fact-extraction-agent',
        'org-test',
        undefined,
        { facts_count: 3 },
      );

      expect(auditId).toBe('audit-id-456');
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('log_memory_audit'), [
        'extract',
        'fact-extraction-agent',
        null,
        'org-test',
        { facts_count: 3 },
      ]);
    });

    it('should handle audit log errors without throwing', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB error'));

      const auditId = await service.logAudit('store', 'agent', 'org');
      expect(auditId).toBeNull();
    });

    it('should return null when internal Postgres is not configured', async () => {
      mockGetInternalDbPool.mockReturnValueOnce(null);
      const unconfiguredService = new MemoryService();

      const auditId = await unconfiguredService.logAudit('store', 'agent', 'org');
      expect(auditId).toBeNull();
    });
  });
});
