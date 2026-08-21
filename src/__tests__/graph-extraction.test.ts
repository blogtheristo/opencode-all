/**
 * Graph Extraction Service Tests — DWS IQ 6/7
 *
 * Tests for the causal/relational triple extraction pipeline: LLM parsing,
 * confidence filtering, and graph_facts persistence.
 *
 * Code-Version: 1.0.0
 * Owner: Lifetime Oy
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GraphExtractionService } from '../agents/graph-extraction.service.js';

// Mock the LLM client
vi.mock('../agents/llm-client.js', () => ({
  createLLMClientForAgent: vi.fn(() => ({
    chat: vi.fn(),
    provider: 'ollama-local',
    model: 'qwen3-coder:30b',
  })),
  LLMClient: vi.fn(),
}));

// Mock the internal DB pool
const mockQuery = vi.fn();
vi.mock('../config/internal-db.js', () => ({
  getInternalDbPool: vi.fn(() => ({ query: mockQuery })),
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

describe('GraphExtractionService', () => {
  let service: GraphExtractionService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.mockResolvedValue({ rows: [] });
    service = new GraphExtractionService();
  });

  it('should extract and persist causal triples from valid JSON', async () => {
    const { createLLMClientForAgent } = await import('../agents/llm-client.js');
    const mockChat = vi.fn().mockResolvedValue({
      content: JSON.stringify([
        {
          subject: 'warehouse failure',
          relation: 'caused',
          object: 'supplier delay',
          confidence: 1.0,
        },
        { subject: 'supplier delay', relation: 'led_to', object: 'release delay', confidence: 0.9 },
      ]),
    });
    (createLLMClientForAgent as ReturnType<typeof vi.fn>).mockReturnValue({
      chat: mockChat,
      provider: 'ollama-local',
      model: 'qwen3-coder:30b',
    });

    service = new GraphExtractionService();

    const result = await service.extract({
      text: 'The warehouse failure caused a supplier delay, which led to the release being pushed back.',
      sourceRef: 'wiki/concepts/Test.md',
      orgId: 'lifetime-internal',
    });

    expect(result.facts).toHaveLength(2);
    expect(result.persisted).toBe(2);
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO graph_facts'), [
      'lifetime-internal',
      'warehouse failure',
      'caused',
      'supplier delay',
      1.0,
      'kb',
      'wiki/concepts/Test.md',
      'qwen3-coder:30b',
    ]);
  });

  it('should handle markdown-wrapped JSON from LLM', async () => {
    const { createLLMClientForAgent } = await import('../agents/llm-client.js');
    const mockChat = vi.fn().mockResolvedValue({
      content:
        '```json\n[{"subject":"A","relation":"depends_on","object":"B","confidence":0.8}]\n```',
    });
    (createLLMClientForAgent as ReturnType<typeof vi.fn>).mockReturnValue({
      chat: mockChat,
      provider: 'ollama-local',
      model: 'qwen3-coder:30b',
    });

    service = new GraphExtractionService();

    const result = await service.extract({
      text: 'A depends on B.',
      sourceRef: 'wiki/concepts/A.md',
      orgId: 'lifetime-internal',
    });

    expect(result.facts).toHaveLength(1);
    expect(result.facts[0].subject).toBe('A');
  });

  it('should filter out facts below confidence threshold', async () => {
    const { createLLMClientForAgent } = await import('../agents/llm-client.js');
    const mockChat = vi.fn().mockResolvedValue({
      content: JSON.stringify([
        { subject: 'A', relation: 'caused', object: 'B', confidence: 0.9 },
        { subject: 'C', relation: 'caused', object: 'D', confidence: 0.3 },
      ]),
    });
    (createLLMClientForAgent as ReturnType<typeof vi.fn>).mockReturnValue({
      chat: mockChat,
      provider: 'ollama-local',
      model: 'qwen3-coder:30b',
    });

    service = new GraphExtractionService();

    const result = await service.extract({
      text: 'A caused B. C maybe caused D.',
      sourceRef: 'wiki/concepts/Test.md',
      orgId: 'lifetime-internal',
      minConfidence: 0.7,
    });

    expect(result.facts).toHaveLength(2);
    expect(result.persisted).toBe(1);
    expect(result.skipped).toBe(1);
  });

  it('should return empty result for empty LLM response', async () => {
    const { createLLMClientForAgent } = await import('../agents/llm-client.js');
    const mockChat = vi.fn().mockResolvedValue({ content: '[]' });
    (createLLMClientForAgent as ReturnType<typeof vi.fn>).mockReturnValue({
      chat: mockChat,
      provider: 'ollama-local',
      model: 'qwen3-coder:30b',
    });

    service = new GraphExtractionService();

    const result = await service.extract({
      text: 'No causal facts here.',
      sourceRef: 'wiki/concepts/Empty.md',
      orgId: 'lifetime-internal',
    });

    expect(result.facts).toHaveLength(0);
    expect(result.persisted).toBe(0);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('should handle invalid JSON gracefully', async () => {
    const { createLLMClientForAgent } = await import('../agents/llm-client.js');
    const mockChat = vi.fn().mockResolvedValue({ content: 'not valid json at all' });
    (createLLMClientForAgent as ReturnType<typeof vi.fn>).mockReturnValue({
      chat: mockChat,
      provider: 'ollama-local',
      model: 'qwen3-coder:30b',
    });

    service = new GraphExtractionService();

    const result = await service.extract({
      text: 'Broken response test.',
      sourceRef: 'wiki/concepts/Broken.md',
      orgId: 'lifetime-internal',
    });

    expect(result.facts).toHaveLength(0);
    expect(result.persisted).toBe(0);
  });

  it('should skip persistence and warn when internal DB is not configured', async () => {
    const { getInternalDbPool } = await import('../config/internal-db.js');
    (getInternalDbPool as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);

    const { createLLMClientForAgent } = await import('../agents/llm-client.js');
    const mockChat = vi.fn().mockResolvedValue({
      content: JSON.stringify([{ subject: 'A', relation: 'caused', object: 'B', confidence: 1.0 }]),
    });
    (createLLMClientForAgent as ReturnType<typeof vi.fn>).mockReturnValue({
      chat: mockChat,
      provider: 'ollama-local',
      model: 'qwen3-coder:30b',
    });

    service = new GraphExtractionService();

    const result = await service.extract({
      text: 'A caused B.',
      sourceRef: 'wiki/concepts/Test.md',
      orgId: 'lifetime-internal',
    });

    expect(result.facts).toHaveLength(1);
    expect(result.persisted).toBe(0);
  });

  it('should reject facts with invalid fields', async () => {
    const { createLLMClientForAgent } = await import('../agents/llm-client.js');
    const mockChat = vi.fn().mockResolvedValue({
      content: JSON.stringify([
        { subject: 'A', relation: 'caused', object: 'B', confidence: 1.0 },
        { subject: 123, relation: 'caused', object: 'D', confidence: 0.8 },
        { subject: 'E', relation: 'caused', object: 'F', confidence: 1.5 },
      ]),
    });
    (createLLMClientForAgent as ReturnType<typeof vi.fn>).mockReturnValue({
      chat: mockChat,
      provider: 'ollama-local',
      model: 'qwen3-coder:30b',
    });

    service = new GraphExtractionService();

    const result = await service.extract({
      text: 'Mixed validity test.',
      sourceRef: 'wiki/concepts/Test.md',
      orgId: 'lifetime-internal',
    });

    expect(result.facts).toHaveLength(1);
    expect(result.facts[0].subject).toBe('A');
  });
});
