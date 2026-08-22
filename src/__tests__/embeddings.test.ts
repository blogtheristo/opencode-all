/**
 * Embeddings Utility Tests
 *
 * Validates provider selection, OpenAI happy path, graceful failure modes,
 * and the cosine similarity helper. The DGX Spark provider shells out to
 * scripts/ollama-spark-embed.sh; we don't exercise that path here (would
 * require an SSH alias), but cover the no-key / failure branches.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import {
  cosineSimilarity,
  generateEmbedding,
  getConfiguredProvider,
  preflightEmbeddings,
} from '../utils/embeddings.js';

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

beforeEach(() => {
  process.env = { ...originalEnv };
  delete process.env.EMBEDDING_PROVIDER;
  delete process.env.OPENAI_API_KEY;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('getConfiguredProvider', () => {
  it('defaults to openai', () => {
    expect(getConfiguredProvider()).toBe('openai');
  });
  it('honors EMBEDDING_PROVIDER=dgx-spark', () => {
    process.env.EMBEDDING_PROVIDER = 'dgx-spark';
    expect(getConfiguredProvider()).toBe('dgx-spark');
  });
  it('falls back to openai for unknown values', () => {
    process.env.EMBEDDING_PROVIDER = 'cohere';
    expect(getConfiguredProvider()).toBe('openai');
  });
});

describe('generateEmbedding (openai)', () => {
  it('returns null when no API key is set', async () => {
    const result = await generateEmbedding('hello world');
    expect(result).toBeNull();
  });

  it('returns vector on successful call', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const fakeVec = new Array(1536).fill(0).map((_, i) => i / 1536);
    globalThis.fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ data: [{ embedding: fakeVec }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    ) as unknown as typeof fetch;

    const result = await generateEmbedding('hello world');
    expect(result).not.toBeNull();
    expect(result!.provider).toBe('openai');
    expect(result!.dimensions).toBe(1536);
    expect(result!.model).toBe('text-embedding-3-small');
    expect(result!.vector[0]).toBe(fakeVec[0]);
  });

  it('returns null and does not throw on HTTP error', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    globalThis.fetch = vi.fn(
      async () => new Response('rate limited', { status: 429 }),
    ) as unknown as typeof fetch;

    const result = await generateEmbedding('hello world');
    expect(result).toBeNull();
  });

  it('truncates very long input to 8000 chars before calling the API', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    let receivedLen = -1;
    globalThis.fetch = vi.fn(async (_url, init) => {
      const body = JSON.parse((init as RequestInit).body as string);
      receivedLen = (body.input as string).length;
      return new Response(JSON.stringify({ data: [{ embedding: [0.1] }] }), { status: 200 });
    }) as unknown as typeof fetch;

    await generateEmbedding('x'.repeat(20000));
    expect(receivedLen).toBe(8000);
  });
});

describe('cosineSimilarity', () => {
  it('returns 1 for identical unit vectors', () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBeCloseTo(1, 6);
  });
  it('returns 0 for orthogonal vectors', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 6);
  });
  it('returns 0 on dimension mismatch (no throw)', () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0])).toBe(0);
  });
  it('returns 0 on empty vector', () => {
    expect(cosineSimilarity([], [])).toBe(0);
  });
  it('returns 0 when one magnitude is zero', () => {
    expect(cosineSimilarity([0, 0, 0], [1, 1, 1])).toBe(0);
  });
});

describe('preflightEmbeddings (openai)', () => {
  it('flags missing API key with an actionable hint', async () => {
    // No OPENAI_API_KEY, default provider
    const result = await preflightEmbeddings();
    expect(result.provider).toBe('openai');
    expect(result.ok).toBe(false);
    expect(result.checks[0]?.name).toMatch(/OPENAI_API_KEY/);
    expect(result.checks[0]?.ok).toBe(false);
    expect(result.hint).toMatch(/OPENAI_API_KEY|EMBEDDING_PROVIDER/);
  });

  it('reports ok with dimensions on a successful probe', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const fakeVec = new Array(1536).fill(0.1);
    globalThis.fetch = vi.fn(
      async () => new Response(JSON.stringify({ data: [{ embedding: fakeVec }] }), { status: 200 }),
    ) as unknown as typeof fetch;
    const result = await preflightEmbeddings();
    expect(result.ok).toBe(true);
    expect(result.dimensions).toBe(1536);
    expect(result.hint).toBeUndefined();
  });
});
