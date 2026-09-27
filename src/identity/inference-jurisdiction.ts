// Evidence: Tool=Claude Code Model=anthropic Agent=kya-inference-ijs Date=2026-09-27
// Audit trail: git log -- src/identity/inference-jurisdiction.ts
/**
 * Inference Jurisdiction Score (IJS) — KYA+I
 *
 * Answers "where does this agent session think, and can we legally trust that location?"
 * Spec: .claude/commands/kya.md §Inference Jurisdiction Score (tiers, zones, provider table).
 *
 * Scoring rules:
 *   - Each model call resolves to a provider, a zone and a provider IJS (PROVIDER_JURISDICTION).
 *   - The session IJS is the MINIMUM across every call (weakest link): one call through a
 *     US-parent provider exposes the session, however many calls stayed on-prem.
 *   - A LiteLLM alias whose fallback chain can leave the EU (`smart`, `groq-llama` in
 *     config/litellm-config.yaml router_settings.fallbacks) is scored at its worst hop,
 *     because the logged alias does not prove which hop served the call.
 *   - A model that cannot be resolved scores 0 (jurisdiction unproven). Never guessed.
 *   - No recorded calls → no score (tier NO_EVIDENCE), not a default.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getInternalDbPool } from '../config/internal-db.js';
import { LITELLM_TIER_ALIASES, MODEL_CATALOG } from '../agents/model-selector.js';
import logger from '../utils/logger.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type InferenceZone = 'ON_PREM' | 'EU' | 'US' | 'ASEAN' | 'UNKNOWN';

export type IjsTier = 'SOVEREIGN' | 'COMPLIANT' | 'PARTIAL' | 'EXPOSED' | 'NO_EVIDENCE';

export type InferenceProviderId =
  | 'dgx-local'
  | 'scaleway'
  | 'anthropic'
  | 'groq'
  | 'openai'
  | 'google'
  | 'baseten'
  | 'unknown';

export interface ProviderJurisdiction {
  zone: InferenceZone;
  ijs: number;
  cloudActExposed: boolean;
  /** Where the number comes from — no uncited scores. */
  source: string;
}

export interface InferenceCallRecord {
  model: string;
  /** Coarse provider label from the source table, if any (e.g. token_usage_events.provider). */
  providerHint?: string | null;
  source: 'kya_jev_calls' | 'token_usage_events' | 'input';
}

export interface ProviderChainEntry {
  provider: InferenceProviderId;
  zone: InferenceZone;
  ijs: number;
  cloudActExposed: boolean;
  models: string[];
  calls: number;
  /** True when a model was a LiteLLM alias whose fallback may leave the EU. */
  fallbackMayLeaveEu: boolean;
}

export interface InferenceJurisdictionResult {
  ijs: number | null;
  tier: IjsTier;
  euAiActPosture: string;
  action: string;
  cloudActExposed: boolean;
  fallbackMayLeaveEu: boolean;
  unresolvedModels: string[];
  reasonCodes: string[];
  providerChain: ProviderChainEntry[];
  callsScored: number;
}

// ─── Provider table ───────────────────────────────────────────────────────────

/** Provider IJS values. Keep in lockstep with .claude/commands/kya.md "DWS inference stack". */
export const PROVIDER_JURISDICTION: Record<InferenceProviderId, ProviderJurisdiction> = {
  'dgx-local': {
    zone: 'ON_PREM',
    ijs: 100,
    cloudActExposed: false,
    source: 'kya.md: On-prem DGX Spark (Espoo) = 100',
  },
  scaleway: {
    zone: 'EU',
    ijs: 95,
    cloudActExposed: false,
    source: 'kya.md: Scaleway fr-par / nl-ams = 95',
  },
  anthropic: {
    zone: 'US',
    ijs: 15,
    cloudActExposed: true,
    source:
      'kya.md US zone ceiling = 15 (not listed per provider); DPA-bound per DWS_MODEL_STANDARD.md §4 T1',
  },
  groq: { zone: 'US', ijs: 12, cloudActExposed: true, source: 'kya.md: Groq = 12' },
  openai: {
    zone: 'US',
    ijs: 10,
    cloudActExposed: true,
    source: 'kya.md: OpenAI / Azure OpenAI = 10',
  },
  google: {
    zone: 'US',
    ijs: 10,
    cloudActExposed: true,
    source: 'not listed in kya.md — conservative: lowest listed US value (10)',
  },
  baseten: {
    zone: 'US',
    ijs: 10,
    cloudActExposed: true,
    source: 'not listed in kya.md — conservative: lowest listed US value (10)',
  },
  unknown: {
    zone: 'UNKNOWN',
    ijs: 0,
    cloudActExposed: false,
    source: 'model not resolvable to a provider — jurisdiction unproven',
  },
};

/**
 * LiteLLM aliases whose fallback chain can reach a US provider, mapped to the worst hop.
 * Source: config/litellm-config.yaml router_settings.fallbacks.
 */
const ALIAS_WORST_HOP: Record<string, InferenceProviderId> = {
  smart: 'anthropic', // smart → local-strong → groq-llama → claude-sonnet
  'groq-llama': 'anthropic', // groq-llama → claude-sonnet
  'claude-sonnet': 'anthropic',
  'claude-opus': 'anthropic',
};

// ─── Resolution ───────────────────────────────────────────────────────────────

const CATALOG_PROVIDER: Map<string, string> = new Map(
  Object.values(MODEL_CATALOG).flatMap((tier) =>
    tier.models.map((m) => [m.id, m.provider] as const),
  ),
);

function fromCatalogProvider(provider: string): InferenceProviderId {
  switch (provider) {
    case 'ollama-local':
    case 'vllm-local':
      return 'dgx-local';
    case 'anthropic':
    case 'groq':
    case 'google':
    case 'baseten':
      return provider;
    default:
      // openai-compatible: base URL decides jurisdiction and is not recorded per call.
      return 'unknown';
  }
}

export function resolveProvider(
  model: string,
  providerHint?: string | null,
): { provider: InferenceProviderId; fallbackMayLeaveEu: boolean } {
  const id = model.trim();
  const lower = id.toLowerCase();

  if (lower in ALIAS_WORST_HOP) {
    const aliasIsFallback = lower === 'smart' || lower === 'groq-llama';
    return { provider: ALIAS_WORST_HOP[lower], fallbackMayLeaveEu: aliasIsFallback };
  }
  if (id in LITELLM_TIER_ALIASES) return { provider: 'dgx-local', fallbackMayLeaveEu: false };

  const catalog = CATALOG_PROVIDER.get(id);
  if (catalog) return { provider: fromCatalogProvider(catalog), fallbackMayLeaveEu: false };

  const prefix = lower.includes('/') ? lower.split('/')[0] : '';
  if (prefix === 'ollama' || prefix === 'vllm' || prefix === 'hosted_vllm')
    return { provider: 'dgx-local', fallbackMayLeaveEu: false };
  if (prefix === 'scaleway') return { provider: 'scaleway', fallbackMayLeaveEu: false };
  if (prefix === 'anthropic' || lower.startsWith('claude-'))
    return { provider: 'anthropic', fallbackMayLeaveEu: false };
  if (prefix === 'groq') return { provider: 'groq', fallbackMayLeaveEu: false };
  if (prefix === 'openai' || prefix === 'azure' || /^(gpt-|o\d)/.test(lower))
    return { provider: 'openai', fallbackMayLeaveEu: false };
  if (prefix === 'gemini' || prefix === 'vertex_ai' || lower.startsWith('gemini-'))
    return { provider: 'google', fallbackMayLeaveEu: false };

  // Coarse hint only when it names a provider outright; 'other' proves nothing.
  const hint = providerHint?.toLowerCase();
  if (hint === 'anthropic' || hint === 'openai')
    return { provider: hint, fallbackMayLeaveEu: false };

  return { provider: 'unknown', fallbackMayLeaveEu: false };
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

const TIER_BANDS: Array<{ min: number; tier: IjsTier; posture: string; action: string }> = [
  {
    min: 90,
    tier: 'SOVEREIGN',
    posture: 'Fully EU-compliant, on-prem or EU-only inference',
    action: 'None',
  },
  {
    min: 70,
    tier: 'COMPLIANT',
    posture: 'Meets Art. 12 + GDPR for high-risk AI',
    action: 'Minor gap remediation',
  },
  {
    min: 40,
    tier: 'PARTIAL',
    posture: 'OK for limited-risk AI; not for high-risk',
    action: 'Disclose to customer, get written acceptance',
  },
  {
    min: 0,
    tier: 'EXPOSED',
    posture: 'CLOUD Act or no DPA — unacceptable for EU enterprise',
    action: 'Block or escalate to C-level',
  },
];

export function tierForScore(ijs: number): (typeof TIER_BANDS)[number] {
  return TIER_BANDS.find((b) => ijs >= b.min) ?? TIER_BANDS[TIER_BANDS.length - 1];
}

export function computeInferenceJurisdiction(
  calls: InferenceCallRecord[],
): InferenceJurisdictionResult {
  const chain = new Map<InferenceProviderId, ProviderChainEntry>();
  const unresolved = new Set<string>();
  let scored = 0;

  for (const call of calls) {
    if (!call.model || typeof call.model !== 'string') continue;
    scored += 1;
    const { provider, fallbackMayLeaveEu } = resolveProvider(call.model, call.providerHint);
    if (provider === 'unknown') unresolved.add(call.model);
    const j = PROVIDER_JURISDICTION[provider];
    const entry = chain.get(provider) ?? {
      provider,
      zone: j.zone,
      ijs: j.ijs,
      cloudActExposed: j.cloudActExposed,
      models: [],
      calls: 0,
      fallbackMayLeaveEu: false,
    };
    entry.calls += 1;
    if (!entry.models.includes(call.model)) entry.models.push(call.model);
    entry.fallbackMayLeaveEu ||= fallbackMayLeaveEu;
    chain.set(provider, entry);
  }

  const providerChain = [...chain.values()].sort((a, b) => a.ijs - b.ijs);

  if (providerChain.length === 0) {
    return {
      ijs: null,
      tier: 'NO_EVIDENCE',
      euAiActPosture: 'Not assessable — no inference calls recorded for this session',
      action: 'Instrument the session (kya_jev_calls / token_usage_events) before claiming a tier',
      cloudActExposed: false,
      fallbackMayLeaveEu: false,
      unresolvedModels: [],
      reasonCodes: [],
      providerChain: [],
      callsScored: 0,
    };
  }

  const ijs = providerChain[0].ijs;
  const band = tierForScore(ijs);
  const cloudActExposed = providerChain.some((p) => p.cloudActExposed);
  const fallbackMayLeaveEu = providerChain.some((p) => p.fallbackMayLeaveEu);
  const reasonCodes: string[] = [];
  if (cloudActExposed) reasonCodes.push('CLOUD_ACT_EXPOSURE');

  return {
    ijs,
    tier: band.tier,
    euAiActPosture: band.posture,
    action: band.action,
    cloudActExposed,
    fallbackMayLeaveEu,
    unresolvedModels: [...unresolved],
    reasonCodes,
    providerChain,
    callsScored: scored,
  };
}

// ─── Evidence loading ─────────────────────────────────────────────────────────

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  supabaseInstance = createClient(url, key);
  return supabaseInstance;
}

export interface SessionInferenceEvidence {
  calls: InferenceCallRecord[];
  /** Sources that were queried successfully. */
  sources: string[];
  /** Sources that could not be read (missing config or query error) — never silent. */
  unavailable: string[];
}

/** Collect every recorded model call for a session from the two tables that carry session_id + model. */
export async function loadSessionInferenceCalls(
  sessionId: string,
): Promise<SessionInferenceEvidence> {
  const calls: InferenceCallRecord[] = [];
  const sources: string[] = [];
  const unavailable: string[] = [];

  const client = getSupabaseClient();
  if (!client) {
    unavailable.push('kya_jev_calls (SUPABASE_URL / SUPABASE_SERVICE_KEY not set)');
  } else {
    const { data, error } = await client
      .from('kya_jev_calls')
      .select('model')
      .eq('session_id', sessionId)
      .limit(5000);
    if (error) {
      unavailable.push(`kya_jev_calls (${error.message})`);
    } else {
      sources.push('kya_jev_calls');
      for (const row of data ?? []) {
        if (row.model) calls.push({ model: String(row.model), source: 'kya_jev_calls' });
      }
    }
  }

  const pool = getInternalDbPool();
  if (!pool) {
    unavailable.push('token_usage_events (INTERNAL_DB_URL not set)');
  } else {
    try {
      const result = await pool.query(
        `SELECT model, provider FROM token_usage_events WHERE session_id = $1 LIMIT 5000`,
        [sessionId],
      );
      sources.push('token_usage_events');
      for (const row of result.rows) {
        calls.push({
          model: String(row.model),
          providerHint: row.provider ?? null,
          source: 'token_usage_events',
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn('IJS: token_usage_events read failed', { sessionId, error: msg });
      unavailable.push(`token_usage_events (${msg})`);
    }
  }

  return { calls, sources, unavailable };
}
