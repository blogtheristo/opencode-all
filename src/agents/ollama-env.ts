/**
 * Canonical Ollama discovery for DWS agents (DGX, tunnels, local dev).
 *
 * Supports both OLLAMA_BASE_URL (docker-compose / Express convention) and
 * OLLAMA_HOST (CLI scripts, Continue tunnel docs). Normalizes to OpenAI-compatible
 * base URL ending with /v1 for chat/completions.
 */

import type { ModelTier, OllamaModelPreset } from './types.js';

export type { OllamaModelPreset } from './types.js';
export function resolveOllamaOpenAiBaseUrl(): string | null {
  const raw = (process.env.OLLAMA_BASE_URL || process.env.OLLAMA_HOST || '').trim();
  if (!raw) return null;
  let u = raw.replace(/\/$/, '');
  if (!u.endsWith('/v1')) {
    u = `${u}/v1`;
  }
  return u;
}

/** Map task tier → Ollama env preset chain (OLLAMA_MODEL_*) */
export function mapModelTierToOllamaPreset(tier: ModelTier): OllamaModelPreset {
  switch (tier) {
    case 'lite':
      return 'fast';
    case 'standard':
      return 'agent';
    case 'heavy':
      return 'quality';
    default:
      return 'default';
  }
}

/** Resolve concrete Ollama tag from tier env vars */
export function resolveOllamaModelByPreset(preset: OllamaModelPreset): string {
  const base = process.env.OLLAMA_MODEL || 'llama3.3:70b';
  switch (preset) {
    case 'fast':
      return process.env.OLLAMA_MODEL_FAST || base;
    case 'agent':
      return process.env.OLLAMA_MODEL_AGENT || base;
    case 'quality':
      return process.env.OLLAMA_MODEL_QUALITY || base;
    case 'vision':
      return process.env.OLLAMA_MODEL_VISION || process.env.OLLAMA_MODEL_AGENT || base;
    case 'coding':
      return process.env.OLLAMA_MODEL_CODING || process.env.OLLAMA_MODEL_FAST || base;
    default:
      return base;
  }
}
