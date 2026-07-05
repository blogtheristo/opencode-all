/**
 * Multi-Agent Model Selector — DWS IQ 6/7
 *
 * Dynamically selects the "leanest" model for each agent sub-task.
 * Avoids over-investing in model capability for routine queries.
 *
 * Architecture:
 *   - LITE tier: High-volume classification, simple extraction, safety scoring
 *     → Gemini 2.5 Flash-Lite, Llama 3.3 8B, Qwen 2.5 7B (Ollama local)
 *   - STANDARD tier: Industry compliance, report synthesis, multi-step reasoning
 *     → Claude Haiku 4.5, Gemini 2.5 Flash, Llama 3.3 70B (Groq)
 *   - HEAVY tier: Complex regulatory analysis, novel problem-solving, multi-agent orchestration
 *     → Claude Sonnet 4, Gemini 3 Pro, Qwen 32B (Ollama local)
 *
 * Acer Veriton GN100 constraints:
 *   - 3TB NVMe → ~1.5TB available for models after OS + Firehorse DMS (1TB reserved)
 *   - 128GB unified RAM → models share memory with Docker containers + Ollama
 *   - Local models via Ollama reduce latency and cloud costs to €0/hour
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
        id: 'qwen2.5:7b',
        provider: 'ollama-local',
        diskGb: 4.7,
        ramGb: 5,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 32768,
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
        id: 'qwen2.5:32b',
        provider: 'ollama-local',
        diskGb: 19,
        ramGb: 20,
        costPer1MInput: 0,
        costPer1MOutput: 0,
        contextWindow: 32768,
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
        id: 'claude-sonnet-4-20250514',
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

  // Try each model in preference order
  for (const model of tierConfig.models) {
    // Skip models that don't support tools if tools are required
    if (requiresTools && !model.supportsTools) continue;

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
      reason: `${tier} tier, ${model.provider === 'ollama-local' || model.provider === 'vllm-local' ? 'local (€0/hr)' : `cloud (€${costPerCall.toFixed(4)}/call)`}`,
      tier,
      maxTokens: tierConfig.maxTokens,
      temperature: tierConfig.temperature,
      estimatedCostEur: costPerCall,
      isLocal: model.provider === 'ollama-local' || model.provider === 'vllm-local',
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
        reason: `fallback from ${tier} → ${fallbackTier} (no ${tier} provider available)`,
        tier: fallbackTier,
        maxTokens: fallbackConfig.maxTokens,
        temperature: fallbackConfig.temperature,
        estimatedCostEur: costPerCall,
        isLocal: model.provider === 'ollama-local' || model.provider === 'vllm-local',
      };
    }
  }

  // Ultimate fallback: placeholder
  logger.error('No LLM provider available for any tier', { agent: agentName });
  return {
    modelId: 'placeholder',
    provider: 'openai-compatible',
    reason: 'no provider available — deterministic-only mode',
    tier,
    maxTokens: 0,
    temperature: 0,
    estimatedCostEur: 0,
    isLocal: false,
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
