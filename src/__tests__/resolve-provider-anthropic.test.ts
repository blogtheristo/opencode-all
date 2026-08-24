import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveProvider } from '../agents/llm-client.js';

const ENV_KEYS = [
  'ANTHROPIC_API_KEY',
  'ANTHROPIC_MODEL',
  'GROQ_API_KEY',
  'BASETEN_API_KEY',
  'OLLAMA_BASE_URL',
  'VLLM_BASE_URL',
  'OPENAI_API_KEY',
] as const;

describe('resolveProvider — Anthropic agentModel override', () => {
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

  it('uses ANTHROPIC_MODEL when set, ignoring agentModel (env wins for ops control)', () => {
    process.env.ANTHROPIC_API_KEY = 'sk-test';
    process.env.ANTHROPIC_MODEL = 'claude-opus-4-7';
    const cfg = resolveProvider('claude-haiku-4-5');
    expect(cfg?.provider).toBe('anthropic');
    expect(cfg?.model).toBe('claude-opus-4-7');
  });

  it('uses agentModel when ANTHROPIC_MODEL is unset (previously dropped)', () => {
    process.env.ANTHROPIC_API_KEY = 'sk-test';
    const cfg = resolveProvider('claude-haiku-4-5');
    expect(cfg?.provider).toBe('anthropic');
    expect(cfg?.model).toBe('claude-haiku-4-5');
  });

  it('falls back to the hardcoded default when neither is provided', () => {
    process.env.ANTHROPIC_API_KEY = 'sk-test';
    const cfg = resolveProvider('');
    expect(cfg?.provider).toBe('anthropic');
    expect(cfg?.model).toBe('claude-sonnet-5');
  });
});
