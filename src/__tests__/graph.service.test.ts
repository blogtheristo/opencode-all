/**
 * Graph Service Tests — DWS IQ 6/7
 *
 * Tests for the graph_traverse allowlist wrapper: named-param call shape,
 * hop-count bounding, and graceful degradation when the internal Postgres
 * pool is not configured.
 *
 * Code-Version: 1.0.0
 * Owner: Lifetime Oy
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GraphService } from '../agents/graph.service.js';

const mockQuery = vi.fn();
vi.mock('../config/internal-db.js', () => ({
  getInternalDbPool: vi.fn(() => ({ query: mockQuery })),
}));

vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('GraphService', () => {
  let service: GraphService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new GraphService();
  });

  it('calls graph_traverse with named params in the allowlist shape', async () => {
    mockQuery.mockResolvedValue({
      rows: [
        {
          hop: 1,
          subject: 'CBAM',
          relation: 'is_regulated_by',
          object: 'EU Regulation 2023/956',
          confidence: 1.0,
          source_ref: 'wiki/concepts/CBAM.md',
          path: ['CBAM', 'EU Regulation 2023/956'],
        },
      ],
    });

    const result = await service.traverse('lifetime-internal', 'CBAM', 1);

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('graph_traverse('), [
      'lifetime-internal',
      'CBAM',
      1,
      null,
    ]);
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].subject).toBe('CBAM');
    expect(result.steps[0].path).toEqual(['CBAM', 'EU Regulation 2023/956']);
  });

  it('passes the relation filter through when provided', async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    await service.traverse('lifetime-internal', 'CBAM', 3, 'caused_by');

    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [
      'lifetime-internal',
      'CBAM',
      3,
      'caused_by',
    ]);
  });

  it('bounds max_hops to the hard cap of 5', async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    await service.traverse('lifetime-internal', 'CBAM', 99);

    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [
      'lifetime-internal',
      'CBAM',
      5,
      null,
    ]);
  });

  it('floors max_hops to 1', async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    await service.traverse('lifetime-internal', 'CBAM', 0);

    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [
      'lifetime-internal',
      'CBAM',
      1,
      null,
    ]);
  });

  it('returns empty steps and does not throw when the pool is unavailable', async () => {
    const { getInternalDbPool } = await import('../config/internal-db.js');
    (getInternalDbPool as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);

    service = new GraphService();
    const result = await service.traverse('lifetime-internal', 'CBAM', 1);

    expect(result.steps).toHaveLength(0);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('returns empty steps and logs on query failure', async () => {
    mockQuery.mockRejectedValueOnce(new Error('connection reset'));

    const result = await service.traverse('lifetime-internal', 'CBAM', 1);

    expect(result.steps).toHaveLength(0);
  });
});
