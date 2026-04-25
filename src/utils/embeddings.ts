/**
 * Embeddings Utility — pluggable provider for the agent "second brain".
 *
 * Why it exists:
 *   memoryService currently generates embeddings via OpenAI cloud
 *   (text-embedding-3-small, 1536-dim). For EU-sovereign or offline use
 *   the same agent should be able to embed locally on DGX Spark using
 *   Ollama's nomic-embed-text (768-dim). This util is the seam.
 *
 * Selection:
 *   EMBEDDING_PROVIDER=openai     (default — preserves existing behavior)
 *   EMBEDDING_PROVIDER=dgx-spark  (routes via scripts/ollama-spark-embed.sh)
 *
 * Returns null on any failure so callers can degrade gracefully (the
 * existing memoryService already handles `null` → no-embedding stored).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-claude/add-playwright-implementation-Rg5Jy (commit 2)
 * Date: 2026-04-25
 * Owner: DWS IQ Platform
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import logger from './logger.js';

const execFileP = promisify(execFile);

const MAX_INPUT_CHARS = 8000;
const DGX_EMBED_SCRIPT = resolve(
  new URL('../../scripts/ollama-spark-embed.sh', import.meta.url).pathname,
);

export type EmbeddingProvider = 'openai' | 'dgx-spark';

export interface EmbeddingResult {
  vector: number[];
  dimensions: number;
  provider: EmbeddingProvider;
  model: string;
}

export function getConfiguredProvider(): EmbeddingProvider {
  const v = (process.env.EMBEDDING_PROVIDER || 'openai').toLowerCase();
  return v === 'dgx-spark' ? 'dgx-spark' : 'openai';
}

/**
 * Generate an embedding using the configured provider.
 * Returns `null` on any failure (caller should degrade, not throw).
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult | null> {
  const trimmed = text.slice(0, MAX_INPUT_CHARS);
  const provider = getConfiguredProvider();

  if (provider === 'dgx-spark') {
    return embedDgxSpark(trimmed);
  }
  return embedOpenAI(trimmed);
}

// ============ Providers ============

async function embedOpenAI(text: string): Promise<EmbeddingResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    logger.debug('embeddings: no OPENAI_API_KEY — skipping');
    return null;
  }
  const model = process.env.EMBEDDING_MODEL_OPENAI || 'text-embedding-3-small';
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: text, model }),
    });
    if (!response.ok) {
      logger.warn('embeddings: openai api error', { status: response.status });
      return null;
    }
    const data = (await response.json()) as { data: Array<{ embedding: number[] }> };
    const vector = data.data[0].embedding;
    return { vector, dimensions: vector.length, provider: 'openai', model };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.warn('embeddings: openai call failed', { error: msg });
    return null;
  }
}

async function embedDgxSpark(text: string): Promise<EmbeddingResult | null> {
  const model = process.env.EMBEDDING_MODEL_DGX || 'nomic-embed-text';
  try {
    // Pass text via stdin to avoid shell-quoting issues with large/multiline input.
    const child = execFile('bash', [DGX_EMBED_SCRIPT, model, '-'], {
      maxBuffer: 8 * 1024 * 1024,
    });
    child.stdin?.end(text);
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    child.stdout?.on('data', (c: Buffer) => stdoutChunks.push(c));
    child.stderr?.on('data', (c: Buffer) => stderrChunks.push(c));
    const code: number = await new Promise((res) => child.on('close', res));
    if (code !== 0) {
      logger.warn('embeddings: dgx-spark script failed', {
        code,
        stderr: Buffer.concat(stderrChunks).toString('utf8').slice(0, 500),
      });
      return null;
    }
    const stdout = Buffer.concat(stdoutChunks).toString('utf8');
    const parsed = JSON.parse(stdout) as { embedding?: number[] };
    if (!Array.isArray(parsed.embedding) || parsed.embedding.length === 0) {
      logger.warn('embeddings: dgx-spark returned no vector');
      return null;
    }
    return {
      vector: parsed.embedding,
      dimensions: parsed.embedding.length,
      provider: 'dgx-spark',
      model,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.warn('embeddings: dgx-spark call failed', { error: msg });
    return null;
  }
}

// ============ Helpers ============

/** Cosine similarity between two vectors of the same dimension. Returns 0 on dim mismatch. */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}
