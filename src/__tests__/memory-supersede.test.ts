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

// Mock Supabase client
const mockRpc = vi.fn();
const mockFrom = vi.fn();
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();

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

describe('MemoryService — Supersede (Contradiction Resolution)', () => {
  let service: MemoryService;

  beforeEach(() => {
    vi.clearAllMocks();
    // Set env vars so getClient() succeeds
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-key';
    service = new MemoryService();
  });

  describe('supersede()', () => {
    it('should auto-approve when confidence_delta <= 0.3', async () => {
      mockRpc.mockResolvedValueOnce({
        data: [{
          new_memory_id: 'new-mem-123',
          requires_review: false,
          confidence_delta: 0.1,
          kya_decision: 'auto_approved (confidence_delta 0.10 <= 0.3)',
        }],
        error: null,
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

      // Verify RPC was called with correct params
      expect(mockRpc).toHaveBeenCalledWith('supersede_memory', {
        p_old_memory_id: 'old-mem-456',
        p_new_content: 'ACME has 300 employees',
        p_new_confidence: 1.0,
        p_new_source: 'annual-report-2025',
        p_reason: 'temporal_supersede: newer source',
        p_agent_id: 'compliance-agent',
        p_agent_ats: null,
        p_org_id: 'org-test',
        p_customer_id: null,
        p_new_metadata: {},
      });
    });

    it('should require review when confidence_delta > 0.3', async () => {
      mockRpc.mockResolvedValueOnce({
        data: [{
          new_memory_id: null,
          requires_review: true,
          confidence_delta: 0.5,
          kya_decision: 'pending_review (confidence_delta > 0.3)',
        }],
        error: null,
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

    it('should handle RPC errors gracefully', async () => {
      mockRpc.mockResolvedValueOnce({
        data: null,
        error: { message: 'Memory not found or already superseded' },
      });

      const result = await service.supersede({
        oldMemoryId: 'nonexistent-id',
        newContent: 'New content',
        orgId: 'org-test',
      });

      expect(result.newMemoryId).toBeNull();
      expect(result.kyaDecision).toContain('error');
    });

    it('should pass agent_ats when provided', async () => {
      mockRpc.mockResolvedValueOnce({
        data: [{
          new_memory_id: 'new-mem-ats',
          requires_review: false,
          confidence_delta: 0.0,
          kya_decision: 'auto_approved (confidence_delta 0.00 <= 0.3)',
        }],
        error: null,
      });

      await service.supersede({
        oldMemoryId: 'old-mem-ats',
        newContent: 'Updated fact',
        orgId: 'org-test',
        agentId: 'compliance-agent',
        agentAts: 0.87,
      });

      expect(mockRpc).toHaveBeenCalledWith('supersede_memory', expect.objectContaining({
        p_agent_ats: 0.87,
        p_agent_id: 'compliance-agent',
      }));
    });

    it('should return gracefully when supabase is not configured', async () => {
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_KEY;
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
    it('should log store audit entry via RPC', async () => {
      mockRpc.mockResolvedValueOnce({
        data: 'audit-id-123',
        error: null,
      });

      const auditId = await service.logAudit(
        'store',
        'compliance-agent',
        'org-test',
        'mem-123',
        { memory_type: 'fact', confidence: 0.9 },
      );

      expect(auditId).toBe('audit-id-123');
      expect(mockRpc).toHaveBeenCalledWith('log_memory_audit', {
        p_operation: 'store',
        p_agent_id: 'compliance-agent',
        p_memory_id: 'mem-123',
        p_org_id: 'org-test',
        p_metadata: { memory_type: 'fact', confidence: 0.9 },
      });
    });

    it('should log extract audit entry via RPC', async () => {
      mockRpc.mockResolvedValueOnce({
        data: 'audit-id-456',
        error: null,
      });

      const auditId = await service.logAudit(
        'extract',
        'fact-extraction-agent',
        'org-test',
        undefined,
        { facts_count: 3 },
      );

      expect(auditId).toBe('audit-id-456');
      expect(mockRpc).toHaveBeenCalledWith('log_memory_audit', expect.objectContaining({
        p_operation: 'extract',
        p_memory_id: null,
      }));
    });

    it('should handle audit log errors without throwing', async () => {
      mockRpc.mockResolvedValueOnce({
        data: null,
        error: { message: 'DB error' },
      });

      const auditId = await service.logAudit('store', 'agent', 'org');
      expect(auditId).toBeNull();
    });

    it('should return null when supabase is not configured', async () => {
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_KEY;
      const unconfiguredService = new MemoryService();

      const auditId = await unconfiguredService.logAudit('store', 'agent', 'org');
      expect(auditId).toBeNull();
    });
  });
});
