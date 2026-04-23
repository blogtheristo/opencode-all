import { afterEach, describe, expect, it } from 'vitest';
import {
  estimateLocalModelDiskUsage,
  isProviderAvailable,
  selectModel,
} from '../agents/model-selector.js';

const ENV_KEYS = [
  'ANTHROPIC_API_KEY',
  'GROQ_API_KEY',
  'GOOGLE_AI_API_KEY',
  'GEMINI_API_KEY',
  'OLLAMA_BASE_URL',
  'ACER_VERITON_HOST',
  'VLLM_BASE_URL',
  'OPENAI_API_KEY',
] as const;

const originalEnv = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
) as Record<(typeof ENV_KEYS)[number], string | undefined>;

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

describe('model-selector', () => {
  it('selectModel treats vLLM as local when Ollama is unavailable', () => {
    delete process.env.OLLAMA_BASE_URL;
    delete process.env.ACER_VERITON_HOST;
    process.env.VLLM_BASE_URL = 'http://localhost:8000/v1';
    delete process.env.GROQ_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GOOGLE_AI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const selection = selectModel('atlas');
    expect(selection.provider).toBe('vllm-local');
    expect(selection.isLocal).toBe(true);
    expect(selection.reason).toContain('local');
  });

  it('isProviderAvailable recognizes vLLM and Google API key aliases', () => {
    delete process.env.VLLM_BASE_URL;
    expect(isProviderAvailable('vllm-local')).toBe(false);

    process.env.VLLM_BASE_URL = 'http://localhost:8000/v1';
    expect(isProviderAvailable('vllm-local')).toBe(true);

    delete process.env.GOOGLE_AI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    expect(isProviderAvailable('google')).toBe(false);

    process.env.GEMINI_API_KEY = 'gemini-key';
    expect(isProviderAvailable('google')).toBe(true);
  });

  it('estimateLocalModelDiskUsage includes local tier models once', () => {
    const summary = estimateLocalModelDiskUsage(['atlas', 'sitesense', 'atlas']);
    const modelIds = summary.models.map((m) => m.modelId);

    expect(summary.totalDiskGb).toBeGreaterThan(0);
    expect(summary.totalRamGb).toBeGreaterThan(0);
    expect(new Set(modelIds).size).toBe(modelIds.length);
  });
});

