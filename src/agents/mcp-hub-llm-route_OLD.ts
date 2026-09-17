/**
 * MCP Hub — federated LLM route cache (optional).
 *
 * When MCP_HUB_URL is set, agent execution prefetches POST /llm/resolve so
 * createLLMClientForAgent can honor hub-ordered routes without blocking synchronously.
 */

import logger from '../utils/logger.js';
import type { ModelTier, OllamaModelPreset } from './types.js';
import { AGENT_TIER_MAP } from './model-selector.js';

export interface HubResolvedRoute {
  provider_kind: string;
  base_url: string;
  model: string;
  /** Env var name holding API key (never logged from backend) */
  api_key_env?: string | null;
  endpoint_id?: string;
}

const hubRouteCache = new Map<string, HubResolvedRoute[]>();

export function hubRouteCacheKey(
  agentName: string,
  tier: ModelTier,
  preset?: OllamaModelPreset,
): string {
  return `${agentName}:${tier}:${preset ?? ''}`;
}

export function getCachedHubRoutes(key: string): HubResolvedRoute[] | undefined {
  return hubRouteCache.get(key);
}

export function setCachedHubRoutes(key: string, routes: HubResolvedRoute[]): void {
  hubRouteCache.set(key, routes);
}

/**
 * Called before agent.execute — warms route cache for this agent + tier.
 */
export async function prefetchHubRoutesForAgent(
  agentName: string,
  opts: {
    modelTier?: ModelTier;
    ollamaModelPreset?: OllamaModelPreset;
  },
): Promise<void> {
  const base = process.env.MCP_HUB_URL?.replace(/\/$/, '');
  if (!base) return;

  const tier = opts.modelTier || AGENT_TIER_MAP[agentName] || 'standard';
  const preset = opts.ollamaModelPreset;
  const key = hubRouteCacheKey(agentName, tier, preset);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const hubKey = process.env.MCP_HUB_API_KEY;
  if (hubKey) {
    headers.Authorization = `Bearer ${hubKey}`;
  }

  const body = {
    agent_name: agentName,
    model_tier: tier,
    ollama_preset: preset ?? null,
    mode: process.env.LLM_ROUTING_MODE || 'agent',
  };

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`${base}/llm/resolve`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(t);

    if (!res.ok) {
      logger.debug('MCP Hub /llm/resolve failed', { status: res.status, agentName });
      return;
    }

    const data = (await res.json()) as { routes?: HubResolvedRoute[] };
    if (Array.isArray(data.routes) && data.routes.length > 0) {
      setCachedHubRoutes(key, data.routes);
      logger.debug('MCP Hub routes cached', { agentName, tier, count: data.routes.length });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.debug('MCP Hub prefetch skipped', { agentName, error: msg });
  }
}
