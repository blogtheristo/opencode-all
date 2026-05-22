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
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import logger from './logger.js';

const MAX_INPUT_CHARS = 8000;
const DGX_EMBED_SCRIPT = resolve(
  fileURLToPath(new URL('../../scripts/ollama-spark-embed.sh', import.meta.url)),
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

// ============ Preflight ============

export interface PreflightResult {
  provider: EmbeddingProvider;
  ok: boolean;
  /** What was checked (for human readers). */
  checks: Array<{ name: string; ok: boolean; detail?: string }>;
  /** Actionable next step if `ok` is false. */
  hint?: string;
  /** Live dimension count returned by the provider, if probed successfully. */
  dimensions?: number;
}

/**
 * Probe the configured provider to confirm it's reachable + the model is
 * loaded. Use BEFORE flipping `EMBEDDING_PROVIDER` in production, or as
 * a CI smoke check.
 *
 * Never throws. Returns a structured report with an actionable `hint`.
 */
export async function preflightEmbeddings(): Promise<PreflightResult> {
  const provider = getConfiguredProvider();
  const checks: PreflightResult['checks'] = [];

  if (provider === 'openai') {
    const hasKey = !!process.env.OPENAI_API_KEY;
    checks.push({ name: 'OPENAI_API_KEY set', ok: hasKey });
    if (!hasKey) {
      return {
        provider,
        ok: false,
        checks,
        hint: 'Set OPENAI_API_KEY in .env (see Admin/SECURITY_COMPLIANCE.md), or switch EMBEDDING_PROVIDER=dgx-spark.',
      };
    }
    const probe = await embedOpenAI('preflight');
    checks.push({
      name: 'OpenAI /v1/embeddings reachable',
      ok: probe !== null,
      detail: probe ? `${probe.dimensions}-dim` : 'no response',
    });
    return {
      provider,
      ok: probe !== null,
      checks,
      ...(probe ? { dimensions: probe.dimensions } : {}),
      ...(probe
        ? {}
        : { hint: 'OpenAI returned no embedding — check API key validity and quota.' }),
    };
  }

  // dgx-spark — we run three checks so the hint is precise.
  const sshHost = process.env.DGX_SSH_HOST || 'dgx-spark';
  const ollamaUrl = process.env.DGX_OLLAMA_URL || 'http://localhost:11434';
  const model = process.env.EMBEDDING_MODEL_DGX || 'nomic-embed-text';

  const ssh = await runShell('ssh', [
    '-o',
    'BatchMode=yes',
    '-o',
    'ConnectTimeout=5',
    sshHost,
    'true',
  ]);
  checks.push({
    name: `ssh ${sshHost} reachable`,
    ok: ssh.code === 0,
    detail: ssh.code === 0 ? undefined : ssh.stderr.slice(0, 200),
  });
  if (ssh.code !== 0) {
    return {
      provider,
      ok: false,
      checks,
      hint: `Cannot SSH to '${sshHost}'. Verify alias in ~/.ssh/config (or set DGX_SSH_HOST), and that key auth works non-interactively. Run: ssh ${sshHost} true`,
    };
  }

  const tags = await runShell('ssh', [sshHost, `curl -fsS --max-time 5 ${ollamaUrl}/api/tags`]);
  checks.push({
    name: `Ollama tags endpoint (${ollamaUrl})`,
    ok: tags.code === 0,
    detail: tags.code === 0 ? undefined : tags.stderr.slice(0, 200),
  });
  if (tags.code !== 0) {
    return {
      provider,
      ok: false,
      checks,
      hint: `Ollama not reachable at ${ollamaUrl} on ${sshHost}. Verify Ollama is running on the Spark: ssh ${sshHost} systemctl status ollama`,
    };
  }

  const hasModel = tags.stdout.includes(`"name":"${model}`);
  checks.push({
    name: `model '${model}' loaded`,
    ok: hasModel,
    detail: hasModel ? undefined : 'not in /api/tags response',
  });
  if (!hasModel) {
    return {
      provider,
      ok: false,
      checks,
      hint: `Model '${model}' is not pulled on ${sshHost}. Run: ssh ${sshHost} ollama pull ${model}`,
    };
  }

  const probe = await embedDgxSpark('preflight');
  checks.push({
    name: 'embedding round-trip',
    ok: probe !== null,
    detail: probe ? `${probe.dimensions}-dim` : 'no vector returned',
  });
  return {
    provider,
    ok: probe !== null,
    checks,
    ...(probe ? { dimensions: probe.dimensions } : {}),
    ...(probe
      ? {}
      : {
          hint: `Round-trip embedding failed even though model is loaded. Check ${ollamaUrl}/api/embeddings on ${sshHost} directly.`,
        }),
  };
}

interface ShellResult {
  code: number;
  stdout: string;
  stderr: string;
}

async function runShell(cmd: string, args: string[]): Promise<ShellResult> {
  return new Promise((resolve) => {
    const child = execFile(cmd, args, { maxBuffer: 4 * 1024 * 1024 });
    const out: Buffer[] = [];
    const err: Buffer[] = [];
    child.stdout?.on('data', (c: Buffer) => out.push(c));
    child.stderr?.on('data', (c: Buffer) => err.push(c));
    child.on('close', (code) => {
      resolve({
        code: code ?? -1,
        stdout: Buffer.concat(out).toString('utf8'),
        stderr: Buffer.concat(err).toString('utf8'),
      });
    });
    child.on('error', (e) => {
      resolve({ code: -1, stdout: '', stderr: e.message });
    });
  });
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
