/**
 * Multi-Agent Model Selector — DWS IQ 6/7
 *
 * Dynamically selects the "leanest" model for each agent sub-task.
 * Avoids over-investing in model capability for routine queries.
 *
 * Architecture:
 *   - LITE tier: High-volume classification, simple extraction, safety scoring
 *     → qwen3-coder:30b (Ollama local), Gemini 2.5 Flash-Lite, Llama 3.3 8B
 *   - STANDARD tier: Industry compliance, report synthesis, multi-step reasoning
 *     → DiffusionGemma / Qwen3.6-35B-A3B (vLLM), qwen3-coder:30b (Ollama local),
 *       Llama 3.3 70B (Groq), Claude Haiku 4.5, Gemini 2.5 Flash
 *   - HEAVY tier: Complex regulatory analysis, novel problem-solving, orchestration
 *     → Qwen3.6-35B-A3B (vLLM), nemotron-3-super (Ollama local), Claude Sonnet 5,
 *       Gemini 3 Pro
 *
 * Selection is depth-aware: a model is only eligible if its contextWindow can hold
 * the estimated input PLUS the tier's reserved output. See `modelFitsDepth`.
 *
 * Acer Veriton GN100 constraints:
 *   - 3TB NVMe → ~1.5TB available for models after OS + Firehorse DMS (1TB reserved)
 *   - 128GB unified RAM → models share memory with Docker containers + Ollama
 *   - Local models remove the metered per-token API bill. They do NOT make tokens
 *     free: electricity, hardware amortisation, serving and maintenance remain.
 *     Canonical wording: kb/wiki/concepts/bounded-not-zero-sovereign-compute-economics.md
 *
 * Control Room / Situation Room use:
 *   - Control Room (field ops): LITE models for real-time alerts, STANDARD for dispatch routing
 *   - Situation Room (strategic): STANDARD for dashboards, HEAVY only for board-level synthesis
 */

import logger from '../utils/logger.js';
import type { ModelTier } from './types.js';

export type { ModelTier } from './types.js';

/** A single model option within a tier */
export interface ModelOption {
  /** Model identifier (passed to LLM client) */
  id: string;
  /** Provider: determines which LLM client path to use */
  provider:
    | 'anthropic'
    | 'groq'
    | 'baseten'
    | 'openai-compatible'
    | 'google'
    | 'ollama-local'
    | 'vllm-local';
  /** Approximate disk usage in GB (for local models only; 0 for cloud) */
  diskGb: number;
  /** Approximate RAM usage in GB during inference (0 for cloud) */
  ramGb: number;
  /** Cost per 1M input tokens in EUR (0 for local) */
  costPer1MInput: number;
  /** Cost per 1M output tokens in EUR (0 for local) */
  costPer1MOutput: number;
  /** Max context window in tokens */
  contextWindow: number;
  /** Whether this model supports tool use / function calling */
  supportsTools: boolean;
}

/** Complete tier definition */
export interface TierConfig {
  tier: ModelTier;
  /** Models ordered by preference (first = preferred) */
  models: ModelOption[];
  /** Max tokens for this tier's responses */
  maxTokens: number;
  /** Default temperature */
  temperature: number;
}

// ============ ACER VERITON GN100 RESOURCE BUDGET ============

export interface EdgeResourceBudget {
  /** Total NVMe in GB */
  totalDiskGb: number;
  /** Reserved for OS + Firehorse DMS + Docker images */
  reservedDiskGb: number;
  /** Available for AI models */
  availableModelDiskGb: number;
  /** Total unified RAM in GB */
  totalRamGb: number;
  /** Reserved for OS + containers + PostgreSQL */
  reservedRamGb: number;
  /** Available for AI model inference */
  availableModelRamGb: number;
}

/** Acer Veriton GN100 resource budget */
export const ACER_GN100_BUDGET: EdgeResourceBudget = {
  totalDiskGb: 3072, // 3TB NVMe
  reservedDiskGb: 1200, // 1TB Firehorse DMS + 150GB OS + 50GB Docker images
  availableModelDiskGb: 1872, // ~1.8TB for models
  totalRamGb: 128, // 128GB unified memory
  reservedRamGb: 30, // ~30GB for OS + Docker + PostgreSQL + monitoring
  availableModelRamGb: 98, // ~98GB headroom for model inference
};

// ============ DEPLOYED OLLAMA MODELS (single source of truth) ============

/**
 * The Ollama models actually pulled on the DGX Spark / GN-100.
 *
 * DRIFT INCIDENT (31.07.2026). Four places named local models and no two agreed:
 * this catalog listed `qwen2.5:7b` and `qwen2.5:32b`, which are NOT on the box;
 * `infrastructure/dgx-spark/{deploy.sh,docker-compose.yml,first-boot.sh}` pull
 * `nemotron-3-super` + `qwen3-coder:30b`; `scripts/daily/check-ollama-models.sh`
 * enforces that same pair; and `.env.example` documented no OLLAMA_MODEL at all.
 * This was not cosmetic — `selectModel()` would return `qwen2.5:7b` for every
 * lite-tier agent on a host that has never had it, so the call fails or silently
 * falls through to a metered cloud provider. The sovereign path was selectable in
 * name only.
 *
 * Anything added here must be pulled by `deploy.sh --models` AND listed in
 * `check-ollama-models.sh` REQUIRED_MODELS. `model-selector.test.ts` asserts the
 * catalog's `ollama-local` ids are exactly this set, so the drift cannot silently
 * return.
 *
 * NOT the same model, do not conflate: `nemotron-cascade-2-30b-a3b` appears in
 * `docs/field-notes/2026-07-30-hybrid-attention-*` as an EXTERNAL market signal
 * (hybrid attention / long-context). It is not deployed by DWS and is not here.
 */
export const OLLAMA_DEPLOYED_MODELS = {
  /** Deep/orchestrator path — docker-compose `OLLAMA_MODEL` */
  deep: 'nemotron-3-super',
  /** Fast path — docker-compose `OLLAMA_MODEL_FAST` */
  fast: 'qwen3-coder:30b',
} as const;

// ============ MODEL CATALOG ============

/**
 * Full model catalog — cloud + local options per tier.
 * Ordered by preference within each tier (cheapest/fastest first).
 */
export const MODEL_CATALOG: Record<ModelTier, TierConfig> = {
  lite: {
    tier: 'lite',
    maxTokens: 512,
    temperature: 0.2,
    models: [
      {
        // The fast model actually resident on the Spark/GN-100
        // (docker-compose OLLAMA_MODEL_FAST). Replaces the phantom `qwen2.5:7b`
        // that was never pulled — see OLLAMA_DEPLOYED_MODELS.
        id: OLLAMA_DEPLOYED_MODELS.fast,
        provider: 'ollama-local',
        diskGb: 19,
        ramGb: 21,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 262144,
        supportsTools: true,
      },
      {
        id: 'qwen2.5-7b',
        provider: 'vllm-local',
        diskGb: 4.7,
        ramGb: 5,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 32768,
        supportsTools: true,
      },
      {
        id: 'gemini-2.5-flash-lite',
        provider: 'google',
        diskGb: 0,
        ramGb: 0,
        costPer1MInput: 0.075,
        costPer1MOutput: 0.3,
        contextWindow: 1048576,
        supportsTools: true,
      },
      {
        id: 'llama-3.3-8b-instant',
        provider: 'groq',
        diskGb: 0,
        ramGb: 0,
        costPer1MInput: 0.05,
        costPer1MOutput: 0.08,
        contextWindow: 131072,
        supportsTools: true,
      },
    ],
  },
  standard: {
    tier: 'standard',
    maxTokens: 2048,
    temperature: 0.3,
    models: [
      {
        // DiffusionGemma — parallel diffusion LM on the Gemma 4 26B MoE
        // backbone (3.8B params active per step). Day-zero vLLM serving;
        // low-latency single-user generation on DGX Spark / RTX. NVFP4 build
        // (Blackwell) ~14GB weights — see docs/DIFFUSIONGEMMA_LOCAL_INFERENCE.md.
        // Local-first
        // (€0/hr) for standard-tier synthesis/extraction. Tool calling is not
        // claimed at launch, so supportsTools=false makes tool-requiring agents
        // fall through to a function-calling provider (see diffusiongemma.ts).
        id: 'diffusiongemma-26b',
        provider: 'vllm-local',
        diskGb: 14,
        ramGb: 18,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 32768,
        supportsTools: false,
      },
      {
        // Qwen3.6-35B-A3B (NVFP4) — autoregressive MoE: 35B total, ~3B active
        // per token. NVFP4 build (nvidia/Qwen3.6-35B-A3B-NVFP4) ~18GB weights,
        // served via vLLM/TensorRT-LLM on Blackwell. The local *tool-calling*
        // counterpart to tool-free DiffusionGemma: tool-requiring standard-tier
        // agents that skip DiffusionGemma land here (€0/hr local) instead of a
        // cloud provider. Ordered after DiffusionGemma so plain generation keeps
        // the low-latency diffusion path; tool calls take Qwen.
        id: 'qwen3.6-35b-a3b',
        provider: 'vllm-local',
        diskGb: 18,
        ramGb: 22,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 32768,
        supportsTools: true,
      },
      {
        // Ollama fallback for hosts with no vLLM endpoint. Standard tier
        // previously had NO ollama-local option, so an Ollama-only Spark fell
        // straight through both vLLM entries to metered Groq/Anthropic — the
        // opposite of the local-first intent. See OLLAMA_DEPLOYED_MODELS.
        id: OLLAMA_DEPLOYED_MODELS.fast,
        provider: 'ollama-local',
        diskGb: 19,
        ramGb: 21,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 262144,
        supportsTools: true,
      },
      {
        id: 'llama-3.3-70b-versatile',
        provider: 'groq',
        diskGb: 0,
        ramGb: 0,
        costPer1MInput: 0.59,
        costPer1MOutput: 0.79,
        contextWindow: 131072,
        supportsTools: true,
      },
      {
        // GPU-hour pricing; set BASETEN_MODEL to your deployment ID
        id: 'baseten-llama-3-3-70b',
        provider: 'baseten',
        diskGb: 0,
        ramGb: 0,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 128000,
        supportsTools: true,
      },
      {
        id: 'claude-haiku-4-5-20251001',
        provider: 'anthropic',
        diskGb: 0,
        ramGb: 0,
        costPer1MInput: 0.8,
        costPer1MOutput: 4.0,
        contextWindow: 200000,
        supportsTools: true,
      },
      {
        id: 'gemini-2.5-flash',
        provider: 'google',
        diskGb: 0,
        ramGb: 0,
        costPer1MInput: 0.15,
        costPer1MOutput: 0.6,
        contextWindow: 1048576,
        supportsTools: true,
      },
    ],
  },
  heavy: {
    tier: 'heavy',
    maxTokens: 4096,
    temperature: 0.3,
    models: [
      {
        // Qwen3.6-35B-A3B (NVFP4) — local-first heavy-tier reasoning. MoE
        // (35B total, ~3B active) runs at ~3B-model latency with far-larger
        // quality; NVFP4 ~18GB weights via vLLM/TensorRT-LLM. Supersedes the
        // older qwen2.5:32b locals below when a vLLM endpoint is available;
        // falls through to them on Ollama-only hosts (vllm-local unavailable).
        id: 'qwen3.6-35b-a3b',
        provider: 'vllm-local',
        diskGb: 18,
        ramGb: 22,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 32768,
        supportsTools: true,
      },
      {
        // Deep/orchestrator path on the Spark/GN-100 (docker-compose
        // OLLAMA_MODEL). Replaces the phantom `qwen2.5:32b` which was never
        // pulled and whose nearest relative (qwen2.5-coder:32b) deploy.sh
        // --models-cleanup actively removes. See OLLAMA_DEPLOYED_MODELS.
        id: OLLAMA_DEPLOYED_MODELS.deep,
        provider: 'ollama-local',
        diskGb: 34,
        ramGb: 38,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 131072,
        supportsTools: true,
      },
      {
        id: 'qwen2.5-32b',
        provider: 'vllm-local',
        diskGb: 19,
        ramGb: 20,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 32768,
        supportsTools: true,
      },
      {
        id: 'claude-sonnet-5',
        provider: 'anthropic',
        diskGb: 0,
        ramGb: 0,
        costPer1MInput: 3.0,
        costPer1MOutput: 15.0,
        contextWindow: 200000,
        supportsTools: true,
      },
      {
        id: 'gemini-3-pro',
        provider: 'google',
        diskGb: 0,
        ramGb: 0,
        costPer1MInput: 1.25,
        costPer1MOutput: 10.0,
        contextWindow: 1048576,
        supportsTools: true,
      },
    ],
  },
};

// ============ AGENT → TIER MAPPING ============

/**
 * Maps agent names to their optimal model tier.
 * Principle: use the leanest model that can handle the task.
 *
 * LITE: classification, scoring, simple extraction, alerts
 * STANDARD: industry compliance, report synthesis, multi-step analysis
 * HEAVY: complex regulatory reasoning, novel synthesis, orchestration
 */
export const AGENT_TIER_MAP: Record<string, ModelTier> = {
  // --- LITE tier: high-volume, low-complexity ---
  sitesense: 'lite', // Safety scoring (0-100), weather risk classification
  'customer-sat': 'lite', // Churn probability, NPS classification
  'keyword-intent': 'lite', // Keyword classification
  'lead-feedback': 'lite', // Lead scoring
  'quality-gate': 'lite', // Binary pass/fail deployment readiness
  argus: 'lite', // Image classification (SAR target labeling)

  // --- STANDARD tier: domain-specific analysis ---
  'material-oracle': 'standard', // Carbon calculation (EN 15978, A1-D lifecycle)
  'schedule-genius': 'standard', // Timeline optimization
  viability: 'standard', // Unit economics, LTV
  compliance: 'standard', // EU regulatory gap scoring
  logistics: 'standard', // Route optimization, fleet dispatch
  construction: 'standard', // Site coordination
  'seo-audit': 'standard', // SEO scoring
  'competitor-surveillance': 'standard', // Market intelligence
  'content-brief': 'standard', // Content generation briefs
  'deepwiki-extractor': 'standard', // Document extraction
  'emissions-data-analyst': 'standard', // Emissions data processing
  'compliance-researcher': 'standard', // Regulatory research
  'sales-outreach': 'standard', // Sales email generation

  // --- STANDARD tier: industry specialists ---
  vulcan: 'standard', // Steel & Metals (ETS Phase 4, CBAM)
  helios: 'standard', // Energy & Renewables
  neptune: 'standard', // Maritime & Shipping
  ceres: 'standard', // Agriculture & Fertilizers
  prometheus: 'standard', // Hydrogen & Energy Transition
  mars: 'standard', // Construction & Buildings
  gaia: 'standard', // Cement & Earth Materials

  // --- HEAVY tier: orchestration + complex reasoning ---
  atlas: 'heavy', // Chief of Staff — synthesis & routing across all agents
  athena: 'heavy', // Compliance Intelligence — novel regulatory interpretation
  hephaestus: 'heavy', // Field & Site Intelligence — multi-source fusion
  iris: 'heavy', // Research & Market Intelligence — deep analysis
  mercury: 'heavy', // Logistics & Operations — complex optimization
  apollo: 'heavy', // Content & Outreach — long-form generation
};

/** Default tier for agents not in the map */
export const DEFAULT_TIER: ModelTier = 'standard';

// ============ MODEL SELECTION ENGINE ============

export interface ModelSelection {
  /** Selected model ID */
  modelId: string;
  /** Provider for the selected model */
  provider: ModelOption['provider'];
  /** Why this model was selected */
  reason: string;
  /** The tier this agent operates at */
  tier: ModelTier;
  /** Max tokens for responses */
  maxTokens: number;
  /** Temperature setting */
  temperature: number;
  /** Estimated cost per call (EUR, 0 for local) */
  estimatedCostEur: number;
  /** Whether this is a local (Acer) or cloud model */
  isLocal: boolean;
  /** Context window of the selected model, in tokens */
  contextWindow: number;
  /** Context the caller declared it needs (input + maxTokens), in tokens */
  requiredContextTokens: number;
}

/**
 * Can this model hold the work?
 *
 * Depth is input PLUS the tier's reserved output — a model whose window exactly
 * equals the prompt cannot answer. Until 31.07.2026 `contextWindow` was declared
 * on every model and read by nothing: selection had no depth dimension at all, so
 * a 200k-token task would be routed to a 32k model and fail at call time rather
 * than at selection time.
 */
export function modelFitsDepth(model: ModelOption, requiredContextTokens: number): boolean {
  return model.contextWindow >= requiredContextTokens;
}

/**
 * Select the optimal model for an agent based on its tier and available resources.
 *
 * Resolution order:
 * 1. Check agent tier mapping
 * 2. For each model in tier preference order:
 *    a. If local model: check Ollama availability + RAM budget
 *    b. If cloud model: check API key availability
 * 3. Fall back to next model in tier, then to next tier up
 */
export function selectModel(
  agentName: string,
  options?: {
    /** Override tier for this call */
    tierOverride?: ModelTier;
    /** Whether tool use is required */
    requiresTools?: boolean;
    /** Approximate input size in tokens (for cost estimation) */
    estimatedInputTokens?: number;
  },
): ModelSelection {
  const tier = options?.tierOverride || AGENT_TIER_MAP[agentName] || DEFAULT_TIER;
  const tierConfig = MODEL_CATALOG[tier];
  const requiresTools = options?.requiresTools ?? false;
  const estimatedInput = options?.estimatedInputTokens ?? 1000;
  // Depth requirement = what goes in plus what the tier reserves for the answer.
  const requiredContextTokens = estimatedInput + tierConfig.maxTokens;

  // Try each model in preference order
  for (const model of tierConfig.models) {
    // Skip models that don't support tools if tools are required
    if (requiresTools && !model.supportsTools) continue;

    // Skip models that cannot hold the task at this depth
    if (!modelFitsDepth(model, requiredContextTokens)) continue;

    // Check provider availability
    if (!isProviderAvailable(model.provider)) continue;

    // Check local resource constraints
    if (model.provider === 'ollama-local' || model.provider === 'vllm-local') {
      if (!isLocalModelFeasible(model)) continue;
    }

    const costPerCall =
      (estimatedInput / 1_000_000) * model.costPer1MInput +
      (tierConfig.maxTokens / 1_000_000) * model.costPer1MOutput;

    return {
      modelId: model.id,
      provider: model.provider,
      reason: `${tier} tier, ${model.provider === 'ollama-local' || model.provider === 'vllm-local' ? 'local (no metered API cost)' : `cloud (€${costPerCall.toFixed(4)}/call)`}, ${model.contextWindow} ctx >= ${requiredContextTokens} required`,
      tier,
      maxTokens: tierConfig.maxTokens,
      temperature: tierConfig.temperature,
      estimatedCostEur: costPerCall,
      isLocal: model.provider === 'ollama-local' || model.provider === 'vllm-local',
      contextWindow: model.contextWindow,
      requiredContextTokens,
    };
  }

  // Fallback: try higher tiers
  const tierOrder: ModelTier[] = ['lite', 'standard', 'heavy'];
  const currentIdx = tierOrder.indexOf(tier);

  for (let i = currentIdx + 1; i < tierOrder.length; i++) {
    const fallbackTier = tierOrder[i];
    const fallbackConfig = MODEL_CATALOG[fallbackTier];

    for (const model of fallbackConfig.models) {
      if (requiresTools && !model.supportsTools) continue;
      // Re-derive depth against the fallback tier's own output reservation.
      const fallbackRequired = estimatedInput + fallbackConfig.maxTokens;
      if (!modelFitsDepth(model, fallbackRequired)) continue;
      if (!isProviderAvailable(model.provider)) continue;
      if (
        (model.provider === 'ollama-local' || model.provider === 'vllm-local') &&
        !isLocalModelFeasible(model)
      )
        continue;

      const costPerCall =
        (estimatedInput / 1_000_000) * model.costPer1MInput +
        (fallbackConfig.maxTokens / 1_000_000) * model.costPer1MOutput;

      logger.warn('Model selection: fell back to higher tier', {
        agent: agentName,
        requestedTier: tier,
        actualTier: fallbackTier,
        model: model.id,
      });

      return {
        modelId: model.id,
        provider: model.provider,
        reason: `fallback from ${tier} → ${fallbackTier} (no ${tier} model both available and deep enough for ${requiredContextTokens} tokens)`,
        tier: fallbackTier,
        maxTokens: fallbackConfig.maxTokens,
        temperature: fallbackConfig.temperature,
        estimatedCostEur: costPerCall,
        isLocal: model.provider === 'ollama-local' || model.provider === 'vllm-local',
        contextWindow: model.contextWindow,
        requiredContextTokens: estimatedInput + fallbackConfig.maxTokens,
      };
    }
  }

  // Ultimate fallback: placeholder
  const deepEnoughAnywhere = Object.values(MODEL_CATALOG).some((cfg) =>
    cfg.models.some((m) => modelFitsDepth(m, requiredContextTokens)),
  );
  logger.error('No LLM selected for any tier', {
    agent: agentName,
    requiredContextTokens,
    cause: deepEnoughAnywhere
      ? 'no provider available'
      : `no model in the catalog has a context window >= ${requiredContextTokens} tokens`,
  });
  return {
    modelId: 'placeholder',
    provider: 'openai-compatible',
    reason: deepEnoughAnywhere
      ? 'no provider available — deterministic-only mode'
      : `no model deep enough for ${requiredContextTokens} tokens — deterministic-only mode`,
    tier,
    maxTokens: 0,
    temperature: 0,
    estimatedCostEur: 0,
    isLocal: false,
    contextWindow: 0,
    requiredContextTokens,
  };
}

// ============ PROVIDER AVAILABILITY CHECKS ============

export function isProviderAvailable(provider: ModelOption['provider']): boolean {
  switch (provider) {
    case 'anthropic':
      return !!process.env.ANTHROPIC_API_KEY;
    case 'groq':
      return !!process.env.GROQ_API_KEY;
    case 'baseten':
      return !!process.env.BASETEN_API_KEY;
    case 'google':
      return !!process.env.GOOGLE_AI_API_KEY || !!process.env.GEMINI_API_KEY;
    case 'ollama-local':
      return !!process.env.OLLAMA_BASE_URL || !!process.env.ACER_VERITON_HOST;
    case 'vllm-local':
      return !!process.env.VLLM_BASE_URL;
    case 'openai-compatible':
      return !!process.env.OPENAI_API_KEY;
    default:
      return false;
  }
}

function isLocalModelFeasible(model: ModelOption): boolean {
  // Check if the model fits within the Acer resource budget
  // In production this would query actual system metrics via /remote-control
  const budget = ACER_GN100_BUDGET;

  if (model.ramGb > budget.availableModelRamGb) {
    logger.debug('Local model exceeds RAM budget', {
      model: model.id,
      required: model.ramGb,
      available: budget.availableModelRamGb,
    });
    return false;
  }

  if (model.diskGb > budget.availableModelDiskGb) {
    logger.debug('Local model exceeds disk budget', {
      model: model.id,
      required: model.diskGb,
      available: budget.availableModelDiskGb,
    });
    return false;
  }

  return true;
}

// ============ DISK USAGE ESTIMATOR ============

/**
 * Estimate total disk usage for all local models needed by active agents.
 * Useful for Control Room capacity planning.
 */
export function estimateLocalModelDiskUsage(activeAgents: string[]): {
  totalDiskGb: number;
  totalRamGb: number;
  models: Array<{ modelId: string; tier: ModelTier; diskGb: number; ramGb: number }>;
  fitsOnAcer: boolean;
} {
  const uniqueModels = new Map<string, { tier: ModelTier; diskGb: number; ramGb: number }>();

  for (const agentName of activeAgents) {
    const tier = AGENT_TIER_MAP[agentName] || DEFAULT_TIER;
    const tierConfig = MODEL_CATALOG[tier];

    // Find the first local model in the tier
    const localModel = tierConfig.models.find(
      (m) => m.provider === 'ollama-local' || m.provider === 'vllm-local',
    );

    if (localModel && !uniqueModels.has(localModel.id)) {
      uniqueModels.set(localModel.id, {
        tier,
        diskGb: localModel.diskGb,
        ramGb: localModel.ramGb,
      });
    }
  }

  const models = Array.from(uniqueModels.entries()).map(([modelId, info]) => ({
    modelId,
    ...info,
  }));

  const totalDiskGb = models.reduce((sum, m) => sum + m.diskGb, 0);
  const totalRamGb = models.reduce((sum, m) => sum + m.ramGb, 0);
  const budget = ACER_GN100_BUDGET;

  return {
    totalDiskGb,
    totalRamGb,
    models,
    fitsOnAcer:
      totalDiskGb <= budget.availableModelDiskGb && totalRamGb <= budget.availableModelRamGb,
  };
}

// ============ CONTROL ROOM / SITUATION ROOM HELPERS ============

/**
 * Get model selection summary for all registered agents.
 * Used by Situation Room board-view and Control Room status.
 */
export function getModelSelectionSummary(): {
  tiers: Record<ModelTier, string[]>;
  totalAgents: number;
  localModelCount: number;
  cloudModelCount: number;
  estimatedMonthlyCostEur: number;
  acerDiskUsage: ReturnType<typeof estimateLocalModelDiskUsage>;
} {
  const tiers: Record<ModelTier, string[]> = { lite: [], standard: [], heavy: [] };

  for (const [agent, tier] of Object.entries(AGENT_TIER_MAP)) {
    tiers[tier].push(agent);
  }

  const allAgents = Object.keys(AGENT_TIER_MAP);
  const diskUsage = estimateLocalModelDiskUsage(allAgents);

  // Rough monthly cost estimate: assume 1000 calls/agent/month
  const callsPerMonth = 1000;
  let totalMonthlyCost = 0;
  let localCount = 0;
  let cloudCount = 0;

  for (const agentName of allAgents) {
    const selection = selectModel(agentName, { estimatedInputTokens: 2000 });
    totalMonthlyCost += selection.estimatedCostEur * callsPerMonth;
    if (selection.isLocal) localCount++;
    else cloudCount++;
  }

  return {
    tiers,
    totalAgents: allAgents.length,
    localModelCount: localCount,
    cloudModelCount: cloudCount,
    estimatedMonthlyCostEur: Math.round(totalMonthlyCost * 100) / 100,
    acerDiskUsage: diskUsage,
  };
}
