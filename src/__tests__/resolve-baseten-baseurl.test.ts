import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveBasetenBaseUrl, resolveProvider } from '../agents/llm-client.js';

const ENV_KEYS = [
  'ANTHROPIC_API_KEY',
  'GROQ_API_KEY',
  'BASETEN_API_KEY',
  'BASETEN_BASE_URL',
  'BASETEN_MODEL',
  'GOOGLE_AI_API_KEY',
  'GEMINI_API_KEY',
  'OLLAMA_BASE_URL',
  'ACER_VERITON_HOST',
  'VLLM_BASE_URL',
  'OPENAI_API_KEY',
] as const;

describe('resolveBasetenBaseUrl — endpoint selection by model shape', () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const k of ENV_KEYS) saved[k] = process.env[k];
    for (const k of ENV_KEYS) Reflect.deleteProperty(process.env, k);
  });

  afterEach(() => {
    for (const k of ENV_KEYS) Reflect.deleteProperty(process.env, k);
    for (const [k, v] of Object.entries(saved)) {
      if (v !== undefined) process.env[k] = v;
    }
  });

  it('routes a namespaced slug (Kimi K3) to the Model APIs endpoint', () => {
    expect(resolveBasetenBaseUrl('moonshotai/Kimi-K3')).toBe('https://inference.baseten.co/v1');
  });

  it('routes a bare deployment ID to the dedicated bridge endpoint', () => {
    expect(resolveBasetenBaseUrl('abcd1234')).toBe('https://bridge.baseten.co/v1/direct');
  });

  it('lets BASETEN_BASE_URL override both, regardless of model shape', () => {
    process.env.BASETEN_BASE_URL = 'https://custom.example.com/v1';
    expect(resolveBasetenBaseUrl('moonshotai/Kimi-K3')).toBe('https://custom.example.com/v1');
    expect(resolveBasetenBaseUrl('abcd1234')).toBe('https://custom.example.com/v1');
  });

  it('resolveProvider picks the Model APIs endpoint when BASETEN_MODEL is a slug', () => {
    process.env.BASETEN_API_KEY = 'baseten-test';
    process.env.BASETEN_MODEL = 'moonshotai/Kimi-K3';
    const cfg = resolveProvider('');
    expect(cfg?.provider).toBe('baseten');
    expect(cfg?.model).toBe('moonshotai/Kimi-K3');
    expect(cfg?.baseUrl).toBe('https://inference.baseten.co/v1');
  });

  it('keeps the bridge endpoint for a bare deployment ID via resolveProvider', () => {
    process.env.BASETEN_API_KEY = 'baseten-test';
    process.env.BASETEN_MODEL = 'my-deployment-id';
    const cfg = resolveProvider('');
    expect(cfg?.baseUrl).toBe('https://bridge.baseten.co/v1/direct');
  });
});

