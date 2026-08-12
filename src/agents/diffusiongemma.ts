/**
 * DiffusionGemma — parallel diffusion-LM local inference for DWS agents.
 *
 * DiffusionGemma (Google DeepMind, June 2026) generates text by denoising a
 * whole block of tokens in parallel instead of emitting one autoregressive
 * token at a time. It is built on the Gemma 4 26B mixture-of-experts backbone
 * (3.8B parameters active per step), open-weights under Apache 2.0, with
 * day-zero OpenAI-compatible serving in vLLM. The design targets low-latency
 * single-user workloads — interactive chat and agentic loops — on NVIDIA
 * DGX Spark / RTX hardware.
 *
 * From the DWS side it is just another vLLM-local OpenAI-compatible endpoint,
 * so it rides the existing LLMClient `vllm-local` path (see llm-client.ts).
 * This module adds only the DiffusionGemma-specific pieces: the model spec,
 * the parallel-diffusion decode params (block size / denoising steps),
 * endpoint resolution, a hardware throughput reference for capacity planning,
 * and a typed client factory.
 *
 * Assumptions (stated per CLAUDE.md Rule 1 — article-sourced, env-overridable):
 *   - The vLLM/HF model id defaults to `google/diffusiongemma-26b`; override
 *     with DIFFUSIONGEMMA_MODEL when the served tag differs.
 *   - Tool / function calling is NOT assumed — the launch announcement does
 *     not claim it. We report supportsTools=false (here and in the model
 *     catalog) so tool-requiring agents fall through to a function-calling
 *     provider instead of silently failing (Rule 12: fail loud).
 */

import logger from '../utils/logger.js';
import { LLMClient } from './llm-client.js';
import type { LLMClientConfig } from './llm-client.js';

/** Catalog id used for DiffusionGemma in the model selector. */
export const DIFFUSIONGEMMA_MODEL_ID = 'diffusiongemma-26b';

/** Default served model tag (HF / vLLM). Override via DIFFUSIONGEMMA_MODEL. */
export const DEFAULT_DIFFUSIONGEMMA_MODEL = 'google/diffusiongemma-26b';

/** Maximum tokens DiffusionGemma denoises in parallel per step. */
export const MAX_BLOCK_TOKENS = 256;

/** Static facts about the DiffusionGemma model. */
export interface DiffusionGemmaSpec {
  /** Catalog model id. */
  modelId: string;
  /** Backbone architecture. */
  baseModel: string;
  /** Total parameters (billions). */
  totalParamsB: number;
  /** Parameters active per step (billions) — MoE sparsity. */
  activeParamsB: number;
  /** Open-weights license. */
  license: string;
  /** Whether function calling is supported (not claimed at launch). */
  supportsTools: boolean;
}

export const DIFFUSIONGEMMA_SPEC: DiffusionGemmaSpec = {
  modelId: DIFFUSIONGEMMA_MODEL_ID,
  baseModel: 'gemma-4-26b-moe',
  totalParamsB: 26,
  activeParamsB: 3.8,
  license: 'Apache-2.0',
  supportsTools: false,
};

/** Parallel-diffusion decode parameters. */
export interface DiffusionDecodeParams {
  /** Tokens denoised in parallel per step (the diffusion block size, 1–256). */
  blockTokens: number;
  /** Denoising steps per block (0 = use the server's default schedule). */
  denoisingSteps: number;
}

export const DEFAULT_DIFFUSION_PARAMS: DiffusionDecodeParams = {
  blockTokens: MAX_BLOCK_TOKENS,
  denoisingSteps: 0,
};

/**
 * Resolve diffusion decode params from the environment, clamping the block
 * size to the model's supported range. Invalid / unset values fall back to
 * the defaults rather than silently passing bad input downstream.
 */
export function resolveDiffusionParams(): DiffusionDecodeParams {
  const block = Number.parseInt(process.env.DIFFUSIONGEMMA_BLOCK_TOKENS ?? '', 10);
  const steps = Number.parseInt(process.env.DIFFUSIONGEMMA_DENOISE_STEPS ?? '', 10);

  const blockTokens =
    Number.isFinite(block) && block > 0
      ? Math.min(block, MAX_BLOCK_TOKENS)
      : DEFAULT_DIFFUSION_PARAMS.blockTokens;

  const denoisingSteps =
    Number.isFinite(steps) && steps > 0 ? steps : DEFAULT_DIFFUSION_PARAMS.denoisingSteps;

  return { blockTokens, denoisingSteps };
}

/** Reference single-user throughput on NVIDIA hardware (article-sourced). */
export interface DiffusionGemmaThroughput {
  hardware: string;
  tokensPerSec: number;
  note: string;
}

export const DIFFUSIONGEMMA_THROUGHPUT: readonly DiffusionGemmaThroughput[] = [
  {
    hardware: 'NVIDIA DGX Spark',
    tokensPerSec: 150,
    note: 'GB10 Grace Blackwell, 128GB unified memory — deskside local',
  },
  {
    hardware: 'NVIDIA H100',
    tokensPerSec: 1000,
    note: 'single GPU, single-user regime (~4x autoregressive)',
  },
  {
    hardware: 'NVIDIA DGX Station',
    tokensPerSec: 2000,
    note: '748GB coherent memory — best-in-class local inference',
  },
] as const;

/** Resolve the served model tag. */
export function resolveDiffusionGemmaModel(): string {
  return process.env.DIFFUSIONGEMMA_MODEL || DEFAULT_DIFFUSIONGEMMA_MODEL;
}

/**
 * Resolve the OpenAI-compatible base URL for the DiffusionGemma vLLM endpoint.
 * Prefers a dedicated DIFFUSIONGEMMA_BASE_URL (e.g. a DGX Spark / RTX host)
 * and falls back to the shared VLLM_BASE_URL. Returns null when neither is set.
 */
export function resolveDiffusionGemmaBaseUrl(): string | null {
  const raw = (process.env.DIFFUSIONGEMMA_BASE_URL || process.env.VLLM_BASE_URL || '').trim();
  if (!raw) return null;
  let url = raw.replace(/\/$/, '');
  if (!url.endsWith('/v1')) {
    url = `${url}/v1`;
  }
  return url;
}

export interface DiffusionGemmaClientOptions {
  maxTokens?: number;
  temperature?: number;
}

/**
 * Build an LLMClientConfig for DiffusionGemma over the `vllm-local` provider.
 * Returns null when no endpoint is configured.
 */
export function resolveDiffusionGemmaConfig(
  options?: DiffusionGemmaClientOptions,
): LLMClientConfig | null {
  const baseUrl = resolveDiffusionGemmaBaseUrl();
  if (!baseUrl) return null;

  return {
    provider: 'vllm-local',
    apiKey: process.env.VLLM_API_KEY || 'vllm',
    baseUrl,
    model: resolveDiffusionGemmaModel(),
    maxTokens: options?.maxTokens ?? 2048,
    temperature: options?.temperature ?? 0.3,
  };
}

/**
 * Create an LLMClient bound to the local DiffusionGemma vLLM endpoint.
 * Returns null (and logs) when the endpoint is not configured, so callers can
 * fall back to another provider rather than crash.
 */
export function createDiffusionGemmaClient(
  options?: DiffusionGemmaClientOptions,
): LLMClient | null {
  const config = resolveDiffusionGemmaConfig(options);
  if (!config) {
    logger.debug(
      'DiffusionGemma endpoint not configured (set DIFFUSIONGEMMA_BASE_URL or VLLM_BASE_URL)',
    );
    return null;
  }

  const params = resolveDiffusionParams();
  logger.info('DiffusionGemma client created', {
    model: config.model,
    baseUrl: config.baseUrl,
    blockTokens: params.blockTokens,
    denoisingSteps: params.denoisingSteps || 'server-default',
  });

  return new LLMClient(config);
}
