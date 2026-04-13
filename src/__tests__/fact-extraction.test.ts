/**
 * Fact Extraction Service Tests — DWS IQ 6/7
 *
 * Tests for the fact extraction pipeline: LLM parsing, confidence
 * filtering, and memory persistence integration.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-254 (agent-memory-fact-extraction)
 * Date: 2026-03-23
 * Owner: Lifetime Oy
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FactExtractionService } from '../agents/fact-extraction.service.js';

// Mock the LLM client
vi.mock('../agents/llm-client.js', () => ({
  createLLMClient: vi.fn(() => ({
    chat: vi.fn(),
    provider: 'anthropic',
    model: 'claude-haiku',
  })),
  LLMClient: vi.fn(),
}));

// Mock the memory service
vi.mock('../agents/memory.service.js', () => ({
  memoryService: {
    store: vi.fn(),
    recall: vi.fn(),
    forget: vi.fn(),
    getProfile: vi.fn(),
  },
  MemoryService: vi.fn(),
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

describe('FactExtractionService', () => {
  let service: FactExtractionService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FactExtractionService();
  });

  describe('parseFacts (via extract)', () => {
    it('should handle valid JSON array from LLM', async () => {
      const { createLLMClient } = await import('../agents/llm-client.js');
      const mockChat = vi.fn().mockResolvedValue({
        content: JSON.stringify([
          {
            subject: 'ACME Corp',
            predicate: 'is_located_in',
            value: 'Helsinki',
            confidence: 1.0,
            category: 'identity',
          },
          {
            subject: 'ACME Corp',
            predicate: 'has_employee_count',
            value: '250',
            confidence: 0.9,
            category: 'metric',
          },
        ]),
      });
      (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
        chat: mockChat,
        provider: 'anthropic',
        model: 'claude-haiku',
      });

      // Re-create service to pick up new mock
      service = new FactExtractionService();

      const { memoryService } = await import('../agents/memory.service.js');
      (memoryService.store as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'mem-1',
        stored: true,
      });

      const result = await service.extract({
        text: 'ACME Corp is based in Helsinki with 250 employees.',
        orgId: 'org-test',
        source: 'test',
      });

      expect(result.facts).toHaveLength(2);
      expect(result.facts[0].subject).toBe('ACME Corp');
      expect(result.facts[0].predicate).toBe('is_located_in');
      expect(result.facts[0].value).toBe('Helsinki');
      expect(result.facts[0].confidence).toBe(1.0);
      expect(result.facts[0].category).toBe('identity');
    });

    it('should handle markdown-wrapped JSON from LLM', async () => {
      const { createLLMClient } = await import('../agents/llm-client.js');
      const mockChat = vi.fn().mockResolvedValue({
        content: '```json\n[{"subject":"X","predicate":"is","value":"Y","confidence":0.8,"category":"other"}]\n```',
      });
      (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
        chat: mockChat,
        provider: 'anthropic',
        model: 'claude-haiku',
      });

      service = new FactExtractionService();

      const { memoryService } = await import('../agents/memory.service.js');
      (memoryService.store as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'mem-2',
        stored: true,
      });

      const result = await service.extract({
        text: 'X is Y.',
        orgId: 'org-test',
      });

      expect(result.facts).toHaveLength(1);
      expect(result.facts[0].subject).toBe('X');
    });

    it('should filter out facts below confidence threshold', async () => {
      const { createLLMClient } = await import('../agents/llm-client.js');
      const mockChat = vi.fn().mockResolvedValue({
        content: JSON.stringify([
          { subject: 'A', predicate: 'is', value: 'B', confidence: 0.9, category: 'identity' },
          { subject: 'C', predicate: 'is', value: 'D', confidence: 0.3, category: 'other' },
        ]),
      });
      (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
        chat: mockChat,
        provider: 'anthropic',
        model: 'claude-haiku',
      });

      service = new FactExtractionService();

      const { memoryService } = await import('../agents/memory.service.js');
      (memoryService.store as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'mem-3',
        stored: true,
      });

      const result = await service.extract({
        text: 'A is B. C is maybe D.',
        orgId: 'org-test',
        minConfidence: 0.7,
      });

      // Both facts extracted, but only high-confidence one persisted
      expect(result.facts).toHaveLength(2);
      expect(result.persisted).toBe(1);
      expect(result.skipped).toBe(1);
    });

    it('should skip persistence when persist=false', async () => {
      const { createLLMClient } = await import('../agents/llm-client.js');
      const mockChat = vi.fn().mockResolvedValue({
        content: JSON.stringify([
          { subject: 'A', predicate: 'is', value: 'B', confidence: 1.0, category: 'identity' },
        ]),
      });
      (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
        chat: mockChat,
        provider: 'anthropic',
        model: 'claude-haiku',
      });

      service = new FactExtractionService();

      const { memoryService } = await import('../agents/memory.service.js');

      const result = await service.extract({
        text: 'A is B.',
        orgId: 'org-test',
        persist: false,
      });

      expect(result.facts).toHaveLength(1);
      expect(result.persisted).toBe(0);
      expect(memoryService.store).not.toHaveBeenCalled();
    });

    it('should return empty result for empty LLM response', async () => {
      const { createLLMClient } = await import('../agents/llm-client.js');
      const mockChat = vi.fn().mockResolvedValue({ content: '[]' });
      (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
        chat: mockChat,
        provider: 'anthropic',
        model: 'claude-haiku',
      });

      service = new FactExtractionService();

      const result = await service.extract({
        text: 'No facts here.',
        orgId: 'org-test',
      });

      expect(result.facts).toHaveLength(0);
      expect(result.persisted).toBe(0);
    });

    it('should handle invalid JSON gracefully', async () => {
      const { createLLMClient } = await import('../agents/llm-client.js');
      const mockChat = vi.fn().mockResolvedValue({ content: 'not valid json at all' });
      (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
        chat: mockChat,
        provider: 'anthropic',
        model: 'claude-haiku',
      });

      service = new FactExtractionService();

      const result = await service.extract({
        text: 'Broken response test.',
        orgId: 'org-test',
      });

      expect(result.facts).toHaveLength(0);
      expect(result.persisted).toBe(0);
    });

    it('should reject facts with invalid fields', async () => {
      const { createLLMClient } = await import('../agents/llm-client.js');
      const mockChat = vi.fn().mockResolvedValue({
        content: JSON.stringify([
          { subject: 'A', predicate: 'is', value: 'B', confidence: 1.0, category: 'identity' },
          { subject: 123, predicate: 'is', value: 'D', confidence: 0.8, category: 'other' }, // invalid subject type
          { subject: 'E', predicate: 'is', value: 'F', confidence: 1.5, category: 'other' }, // confidence > 1
        ]),
      });
      (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
        chat: mockChat,
        provider: 'anthropic',
        model: 'claude-haiku',
      });

      service = new FactExtractionService();

      const { memoryService } = await import('../agents/memory.service.js');
      (memoryService.store as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'mem-4',
        stored: true,
      });

      const result = await service.extract({
        text: 'Mixed validity test.',
        orgId: 'org-test',
      });

      // Only the first fact is valid
      expect(result.facts).toHaveLength(1);
      expect(result.facts[0].subject).toBe('A');
    });

    it('should handle duplicate detection from memory service', async () => {
      const { createLLMClient } = await import('../agents/llm-client.js');
      const mockChat = vi.fn().mockResolvedValue({
        content: JSON.stringify([
          { subject: 'A', predicate: 'is', value: 'B', confidence: 1.0, category: 'identity' },
        ]),
      });
      (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
        chat: mockChat,
        provider: 'anthropic',
        model: 'claude-haiku',
      });

      service = new FactExtractionService();

      const { memoryService } = await import('../agents/memory.service.js');
      (memoryService.store as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'existing-id',
        stored: false,
        duplicateOf: 'existing-id',
      });

      const result = await service.extract({
        text: 'A is B.',
        orgId: 'org-test',
      });

      expect(result.facts).toHaveLength(1);
      expect(result.persisted).toBe(0);
      expect(result.skipped).toBe(1);
    });

    it('should default unknown categories to other', async () => {
      const { createLLMClient } = await import('../agents/llm-client.js');
      const mockChat = vi.fn().mockResolvedValue({
        content: JSON.stringify([
          { subject: 'A', predicate: 'is', value: 'B', confidence: 1.0, category: 'unknown_cat' },
        ]),
      });
      (createLLMClient as ReturnType<typeof vi.fn>).mockReturnValue({
        chat: mockChat,
        provider: 'anthropic',
        model: 'claude-haiku',
      });

      service = new FactExtractionService();

      const { memoryService } = await import('../agents/memory.service.js');
      (memoryService.store as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'mem-5',
        stored: true,
      });

      const result = await service.extract({
        text: 'A is B.',
        orgId: 'org-test',
      });

      expect(result.facts[0].category).toBe('other');
    });
  });
});
