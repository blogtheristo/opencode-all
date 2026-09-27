/**
 * Tests for Startup Environment Validation
 *
 * Guards against the 2026-09-22 gap: a self-hosted Ollama/vLLM/Baseten
 * deployment (no cloud LLM API key) previously produced a false
 * "no LLM provider configured" warning.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { validateEnv } from '../middleware/env-validation.js';

const LLM_KEYS = [
  'ANTHROPIC_API_KEY',
  'GROQ_API_KEY',
  'GOOGLE_GEMINI_API_KEY',
  'BASETEN_API_KEY',
  'OLLAMA_BASE_URL',
  'VLLM_BASE_URL',
  'OPENAI_API_KEY',
] as const;

const REQUIRED_KEYS = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET'];

function clearLlmKeys() {
  for (const key of LLM_KEYS) Reflect.deleteProperty(process.env, key);
}

describe('validateEnv', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    for (const key of REQUIRED_KEYS) process.env[key] = 'test-value';
    clearLlmKeys();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('warns when no LLM provider is configured at all', () => {
    const { warnings } = validateEnv();
    expect(warnings.some((w) => w.includes('No LLM provider configured'))).toBe(true);
  });

  it.each(LLM_KEYS)('does not warn when %s alone is set', (key) => {
    process.env[key] =
      key === 'OLLAMA_BASE_URL' || key === 'VLLM_BASE_URL'
        ? 'http://localhost:11434/v1'
        : 'test-value';
    const { warnings } = validateEnv();
    expect(warnings.some((w) => w.includes('No LLM provider configured'))).toBe(false);
  });

  it('fails validation when a hard-required var is missing', () => {
    delete process.env.JWT_SECRET;
    const { valid, missing } = validateEnv();
    expect(valid).toBe(false);
    expect(missing.some((m) => m.startsWith('JWT_SECRET'))).toBe(true);
  });
});
