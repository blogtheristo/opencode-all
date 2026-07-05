import { afterEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_DIFFUSIONGEMMA_MODEL,
  DIFFUSIONGEMMA_MODEL_ID,
  DIFFUSIONGEMMA_SPEC,
  DIFFUSIONGEMMA_THROUGHPUT,
  MAX_BLOCK_TOKENS,
  createDiffusionGemmaClient,
  resolveDiffusionGemmaBaseUrl,
  resolveDiffusionGemmaConfig,
  resolveDiffusionGemmaModel,
  resolveDiffusionParams,
} from '../agents/diffusiongemma.js';
import { MODEL_CATALOG, selectModel } from '../agents/model-selector.js';

const ENV_KEYS = [
  'DIFFUSIONGEMMA_BASE_URL',
  'DIFFUSIONGEMMA_MODEL',
  'DIFFUSIONGEMMA_BLOCK_TOKENS',
  'DIFFUSIONGEMMA_DENOISE_STEPS',
  'VLLM_BASE_URL',
  'VLLM_API_KEY',
  'OLLAMA_BASE_URL',
  'ACER_VERITON_HOST',
  'ANTHROPIC_API_KEY',
  'GROQ_API_KEY',
  'BASETEN_API_KEY',
  'GOOGLE_AI_API_KEY',
  'GEMINI_API_KEY',
] as const;

const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]])) as Record<
  (typeof ENV_KEYS)[number],
  string | undefined
>;

function clearEnv(): void {
  for (const key of ENV_KEYS) delete process.env[key];
}

function resetEnv(): void {
  for (const key of ENV_KEYS) {
    const original = originalEnv[key];
    if (original === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = original;
    }
  }
}

afterEach(() => {
  resetEnv();
});

describe('diffusiongemma module', () => {
  it('prefers DIFFUSIONGEMMA_BASE_URL, falls back to VLLM_BASE_URL, normalizes /v1', () => {
    clearEnv();
    expect(resolveDiffusionGemmaBaseUrl()).toBeNull();

    process.env.VLLM_BASE_URL = 'http://localhost:8000';
    expect(resolveDiffusionGemmaBaseUrl()).toBe('http://localhost:8000/v1');

    process.env.DIFFUSIONGEMMA_BASE_URL = 'http://spark.local:8000/v1/';
    expect(resolveDiffusionGemmaBaseUrl()).toBe('http://spark.local:8000/v1');
  });

  it('resolves the model tag with an env override', () => {
    clearEnv();
    expect(resolveDiffusionGemmaModel()).toBe(DEFAULT_DIFFUSIONGEMMA_MODEL);
    process.env.DIFFUSIONGEMMA_MODEL = 'google/diffusiongemma-26b-it';
    expect(resolveDiffusionGemmaModel()).toBe('google/diffusiongemma-26b-it');
  });

  it('clamps block tokens to the supported range and defaults safely', () => {
    clearEnv();
    expect(resolveDiffusionParams().blockTokens).toBe(MAX_BLOCK_TOKENS);

    process.env.DIFFUSIONGEMMA_BLOCK_TOKENS = '64';
    process.env.DIFFUSIONGEMMA_DENOISE_STEPS = '8';
    expect(resolveDiffusionParams()).toEqual({ blockTokens: 64, denoisingSteps: 8 });

    process.env.DIFFUSIONGEMMA_BLOCK_TOKENS = '9999';
    expect(resolveDiffusionParams().blockTokens).toBe(MAX_BLOCK_TOKENS);

    process.env.DIFFUSIONGEMMA_BLOCK_TOKENS = 'not-a-number';
    expect(resolveDiffusionParams().blockTokens).toBe(MAX_BLOCK_TOKENS);
  });

  it('returns null config / client when no endpoint is configured', () => {
    clearEnv();
    expect(resolveDiffusionGemmaConfig()).toBeNull();
    expect(createDiffusionGemmaClient()).toBeNull();
  });

  it('builds a vllm-local config when an endpoint is configured', () => {
    clearEnv();
    process.env.DIFFUSIONGEMMA_BASE_URL = 'http://localhost:8000/v1';
    const config = resolveDiffusionGemmaConfig({ maxTokens: 1024, temperature: 0.1 });
    expect(config).not.toBeNull();
    expect(config?.provider).toBe('vllm-local');
    expect(config?.model).toBe(DEFAULT_DIFFUSIONGEMMA_MODEL);
    expect(config?.maxTokens).toBe(1024);

    const client = createDiffusionGemmaClient();
    expect(client?.provider).toBe('vllm-local');
  });

  it('exposes a coherent spec and throughput reference', () => {
    expect(DIFFUSIONGEMMA_SPEC.supportsTools).toBe(false);
    expect(DIFFUSIONGEMMA_SPEC.activeParamsB).toBeLessThan(DIFFUSIONGEMMA_SPEC.totalParamsB);
    expect(DIFFUSIONGEMMA_THROUGHPUT.length).toBeGreaterThan(0);
    for (const row of DIFFUSIONGEMMA_THROUGHPUT) {
      expect(row.tokensPerSec).toBeGreaterThan(0);
    }
  });
});

describe('diffusiongemma in the model catalog', () => {
  it('is registered as a local-first, tool-free standard option', () => {
    const standard = MODEL_CATALOG.standard.models;
    const entry = standard.find((m) => m.id === DIFFUSIONGEMMA_MODEL_ID);
    expect(entry).toBeDefined();
    expect(entry?.provider).toBe('vllm-local');
    expect(entry?.supportsTools).toBe(false);
    // Local-first: it appears before the cloud options.
    expect(standard[0].id).toBe(DIFFUSIONGEMMA_MODEL_ID);
  });

  it('is selected for a standard agent when only vLLM is available', () => {
    clearEnv();
    process.env.VLLM_BASE_URL = 'http://localhost:8000/v1';

    const selection = selectModel('material-oracle');
    expect(selection.modelId).toBe(DIFFUSIONGEMMA_MODEL_ID);
    expect(selection.isLocal).toBe(true);
  });

  it('falls through to the local tool-calling Qwen when tools are required', () => {
    clearEnv();
    process.env.VLLM_BASE_URL = 'http://localhost:8000/v1';
    process.env.GROQ_API_KEY = 'groq-key';

    // DiffusionGemma is tool-free, so a tool-requiring standard agent skips it
    // and lands on the local tool-capable Qwen3.6 (€0) rather than cloud Groq.
    const selection = selectModel('material-oracle', { requiresTools: true });
    expect(selection.modelId).not.toBe(DIFFUSIONGEMMA_MODEL_ID);
    expect(selection.modelId).toBe('qwen3.6-35b-a3b');
    expect(selection.isLocal).toBe(true);
  });
});

describe('qwen3.6-35b-a3b local tool-calling model', () => {
  it('is the local-first choice for a heavy-tier agent on vLLM', () => {
    clearEnv();
    process.env.VLLM_BASE_URL = 'http://localhost:8000/v1';

    const selection = selectModel('atlas'); // heavy tier
    expect(selection.modelId).toBe('qwen3.6-35b-a3b');
    expect(selection.provider).toBe('vllm-local');
    expect(selection.isLocal).toBe(true);
  });

  it('falls through to qwen2.5:32b on an Ollama-only heavy host', () => {
    clearEnv();
    process.env.OLLAMA_BASE_URL = 'http://localhost:11434/v1';

    // No vLLM endpoint → the NVFP4 vllm-local entry is unavailable, so the
    // older Ollama (GGUF) local takes over rather than jumping to cloud.
    const selection = selectModel('atlas');
    expect(selection.modelId).toBe('qwen2.5:32b');
    expect(selection.provider).toBe('ollama-local');
  });
});
