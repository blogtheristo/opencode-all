/**
 * Climate Assistant Service
 * AI-powered climate compliance assistant with EU-first inference routing.
 *
 * Provider routing (EU data residency):
 *   1. PRIMARY  — Scaleway Generative APIs (Paris/Amsterdam, EU residency)
 *                 Env: SCW_SECRET_KEY + SCW_GENERATIVE_API_URL
 *                 Model: llama-3.3-70b-instruct (free tier: 1M tokens/month)
 *   2. FALLBACK — Groq (US, used only if Scaleway unreachable)
 *                 Env: GROQ_API_KEY
 *                 Model: llama-3.3-70b-versatile
 *
 * Both endpoints are OpenAI-compatible (/v1/chat/completions).
 *
 * Budget:  DAILY_BUDGET_USD = $1.00/day combined
 * Max:     MAX_TOKENS per response = 1024
 * Tracking: persisted in Supabase (survives cold starts + multi-instance)
 *
 * Code-Version: 2.0.0
 * Introduced-In: claude/build-mvp-features-Eq6py (EU-residency hardening)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

// ============ CONFIGURATION ============

// Primary provider: Scaleway Generative APIs (EU data residency).
// OpenAI-compatible endpoint. Model name differs slightly from Groq.
const SCW_API_URL =
  process.env.SCW_GENERATIVE_API_URL ||
  'https://api.scaleway.ai/v1/chat/completions';
const SCW_MODEL = process.env.SCW_MODEL || 'llama-3.3-70b-instruct';

// Secondary provider: NVIDIA NIM (strategic, Connect Partner benefit).
// Default endpoint is build.nvidia.com free preview; override to point at a
// DGX Cloud EU region, NVIDIA AI Enterprise, or a self-hosted NIM container
// (EU-residency via Lifetime DGX/Jetson edge).
const NIM_API_URL =
  process.env.NIM_API_URL ||
  'https://integrate.api.nvidia.com/v1/chat/completions';
const NIM_MODEL = process.env.NIM_MODEL || 'meta/llama-3.3-70b-instruct';

// Fallback provider: Groq (US). Since the Dec 2025 NVIDIA×Groq licensing
// deal, Groq's LPU is part of NVIDIA's inference stack — but GroqCloud
// itself is still US-hosted, so we keep it as the tertiary (non-EU) path.
// See docs/field-notes/2026-04-05-nvidia-groq-deal-inference-stack.md.
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Pricing per token (USD) - Llama 3.1 70B
const INPUT_COST_PER_TOKEN = 0.59 / 1_000_000;  // $0.00000059
const OUTPUT_COST_PER_TOKEN = 0.79 / 1_000_000; // $0.00000079

// Daily budget limit
const DAILY_BUDGET_USD = 1.00;

// Max tokens per response (keep responses concise)
const MAX_TOKENS = 1024;

// ============ SUPABASE CLIENT ============

let supabase: SupabaseClient | null = null;

/**
 * Initialize Supabase client (lazy)
 */
function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    logger.warn('Supabase not configured. Usage tracking disabled.');
    return null;
  }
  
  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
}

// ============ USAGE TRACKING ============

interface DailyUsage {
  date: string;
  input_tokens: number;
  output_tokens: number;
  requests: number;
  cost_usd: number;
}

/**
 * Get today's usage from Supabase
 * Returns zero-usage object if no record exists yet today
 * Returns null only on database errors (fail-open scenario)
 */
async function getTodaysUsage(): Promise<DailyUsage | null> {
  const client = getSupabaseClient();
  if (!client) return null; // Supabase not configured
  
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data, error } = await client
      .from('climate_assistant_usage')
      .select('*')
      .eq('date', today)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No record found for today - return zero usage (expected scenario)
        return {
          date: today,
          input_tokens: 0,
          output_tokens: 0,
          requests: 0,
          cost_usd: 0,
        };
      }
      // Database error - log and return null (fail-open)
      logger.error('Error fetching usage from Supabase', { error });
      return null;
    }
    
    return data as DailyUsage;
  } catch (error: any) {
    logger.error('Exception fetching usage', { error: error.message });
    return null; // Fail-open on exception
  }
}

/**
 * Get current daily cost from usage record
 * Uses pre-calculated cost_usd from database to avoid precision issues
 */
function getCost(usage: DailyUsage | null): number {
  if (!usage) return 0;
  return usage.cost_usd;
}

/**
 * Check if budget is exceeded
 */
async function isBudgetExceeded(): Promise<boolean> {
  const usage = await getTodaysUsage();
  if (!usage) {
    // If Supabase is not available, allow requests (fail open)
    logger.warn('Usage tracking unavailable (Supabase error), allowing request');
    return false;
  }
  
  const cost = getCost(usage);
  return cost >= DAILY_BUDGET_USD;
}

/**
 * Track token usage in Supabase
 * Returns updated usage record or null on error
 */
async function trackUsage(inputTokens: number, outputTokens: number): Promise<DailyUsage | null> {
  const client = getSupabaseClient();
  if (!client) {
    logger.warn('Supabase not available, skipping usage tracking');
    return null;
  }
  
  const today = new Date().toISOString().split('T')[0];
  const cost = inputTokens * INPUT_COST_PER_TOKEN + outputTokens * OUTPUT_COST_PER_TOKEN;
  
  try {
    // Use atomic increment function to handle concurrent requests
    const { data, error } = await client.rpc('increment_climate_usage', {
      usage_date: today,
      input_tokens_delta: inputTokens,
      output_tokens_delta: outputTokens,
      cost_delta: cost,
    });
    
    if (error) {
      logger.error('Error tracking usage in Supabase', { error });
      return null;
    }
    
    const usage = data as DailyUsage;
    const dailyCost = getCost(usage);
    
    logger.info('Usage tracked in Supabase', {
      inputTokens,
      outputTokens,
      dailyCost: `$${dailyCost.toFixed(4)}`,
      dailyBudget: `$${DAILY_BUDGET_USD}`,
      remainingBudget: `$${(DAILY_BUDGET_USD - dailyCost).toFixed(4)}`,
      requests: usage.requests,
    });
    
    return usage;
  } catch (error: any) {
    logger.error('Exception tracking usage', { error: error.message });
    return null;
  }
}

// System prompt (concise for efficiency)
const SYSTEM_PROMPT = `You are DWS IQ Climate Assistant, an expert in EU climate compliance regulations.

**Expertise:** EN 15978, CSRD, EPBD, ETS, CBAM, Fit for 55

**Guidelines:**
- Be concise and practical
- Use bullet points for clarity
- Include specific numbers for calculations
- Cite relevant EU standards and deadlines
- Focus on actionable compliance guidance

Current date: ${new Date().toISOString().split('T')[0]}
Jurisdiction: European Union`;

// ============ API INTERFACES ============

export interface ChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    cost: number;
    dailyCost: number;
    dailyBudget: number;
  };
}

// ============ MAIN FUNCTIONS ============

/**
 * Process a chat message and get AI response via Groq
 */
export async function processMessage(request: ChatRequest): Promise<ChatResponse> {
  const { message, conversationHistory = [] } = request;

  // Check API keys — at least one inference provider must be configured.
  const hasScaleway = !!process.env.SCW_SECRET_KEY;
  const hasNIM = !!process.env.NIM_API_KEY;
  const hasGroq = !!process.env.GROQ_API_KEY;
  if (!hasScaleway && !hasNIM && !hasGroq) {
    logger.error(
      'No inference provider configured (need SCW_SECRET_KEY, NIM_API_KEY, or GROQ_API_KEY)',
    );
    return {
      content:
        'Climate Assistant is not configured. Please set SCW_SECRET_KEY (EU), NIM_API_KEY (NVIDIA), or GROQ_API_KEY (US fallback).',
      model: 'error',
    };
  }

  // Check daily budget
  if (await isBudgetExceeded()) {
    const usage = await getTodaysUsage();
    const dailyCost = getCost(usage);
    logger.warn('Daily budget exceeded', { dailyCost });
    return {
      content: `I've reached my daily usage limit ($${DAILY_BUDGET_USD}). Please try again tomorrow.`,
      model: 'budget-exceeded',
      usage: {
        inputTokens: 0,
        outputTokens: 0,
        cost: 0,
        dailyCost: dailyCost,
        dailyBudget: DAILY_BUDGET_USD,
      },
    };
  }

  // Build messages (limit history to save tokens)
  const recentHistory = conversationHistory.slice(-4);
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...recentHistory,
    { role: 'user', content: message },
  ];

  logger.info('Processing message', {
    messageLength: message.length,
    historyLength: conversationHistory.length,
    primaryProvider: hasScaleway ? 'scaleway' : hasNIM ? 'nim' : 'groq',
  });

  try {
    const result = await callInference(messages, { hasScaleway, hasNIM, hasGroq });

    // Track usage and get updated totals
    const updatedUsage = await trackUsage(result.inputTokens, result.outputTokens);

    const requestCost =
      result.inputTokens * INPUT_COST_PER_TOKEN +
      result.outputTokens * OUTPUT_COST_PER_TOKEN;

    logger.info('Response generated', {
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      cost: `$${requestCost.toFixed(6)}`,
      model: result.model,
      provider: result.provider,
    });

    // Use returned usage to avoid extra query, fallback to fresh query if tracking failed
    const dailyCost = updatedUsage ? getCost(updatedUsage) : getCost(await getTodaysUsage());

    return {
      content: result.content,
      model: result.model,
      usage: {
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        cost: requestCost,
        dailyCost: dailyCost,
        dailyBudget: DAILY_BUDGET_USD,
      },
    };
  } catch (error: any) {
    // Rate limit — return friendly message rather than throwing
    if (error.code === 'RATE_LIMITED') {
      logger.warn('All providers rate-limited', { message: error.message });
      return {
        content:
          "I'm currently rate-limited by my inference providers. Please try again in a minute.",
        model: 'rate-limited',
      };
    }
    logger.error('Inference error (all providers failed)', { error: error.message });
    throw new Error(error.message || 'Failed to process message. Please try again.');
  }
}

// ============ INFERENCE ROUTING ============

interface InferenceResult {
  content: string;
  model: string;
  provider: 'scaleway' | 'nim' | 'groq';
  inputTokens: number;
  outputTokens: number;
}

interface ProviderAvailability {
  hasScaleway: boolean;
  hasNIM: boolean;
  hasGroq: boolean;
}

/**
 * Route order: Scaleway (EU) → NVIDIA NIM → Groq (US).
 * Fall through only on retryable/rate-limit errors; auth (401/403) on a
 * provider is a fatal config bug, not a transient failure.
 */
async function callInference(
  messages: Array<{ role: string; content: string }>,
  { hasScaleway, hasNIM, hasGroq }: ProviderAvailability,
): Promise<InferenceResult> {
  let lastError: Error | null = null;
  let rateLimited = false;

  const tryProvider = async (
    name: string,
    fn: () => Promise<InferenceResult>,
  ): Promise<InferenceResult | null> => {
    try {
      return await fn();
    } catch (e: any) {
      lastError = e;
      if (e.code === 'RATE_LIMITED') rateLimited = true;
      if (e.code !== 'RETRYABLE' && e.code !== 'RATE_LIMITED') throw e;
      logger.warn(`${name} failed, trying next provider`, { error: e.message });
      return null;
    }
  };

  if (hasScaleway) {
    const r = await tryProvider('scaleway', () => callScaleway(messages));
    if (r) return r;
  }
  if (hasNIM) {
    const r = await tryProvider('nim', () => callNIM(messages));
    if (r) return r;
  }
  if (hasGroq) {
    const r = await tryProvider('groq', () => callGroq(messages));
    if (r) return r;
  }

  if (rateLimited) {
    const err: any = new Error(lastError?.message || 'All providers rate-limited');
    err.code = 'RATE_LIMITED';
    throw err;
  }
  throw lastError || new Error('No inference provider available');
}

async function callScaleway(
  messages: Array<{ role: string; content: string }>,
): Promise<InferenceResult> {
  const response = await fetch(SCW_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SCW_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: SCW_MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err: any = new Error(
      `Scaleway API error (${response.status}): ${JSON.stringify(errorData)}`,
    );
    if (response.status === 429) err.code = 'RATE_LIMITED';
    else if (response.status >= 500) err.code = 'RETRYABLE';
    // 401/403/400 → no code → treated as fatal (fix config, don't fall back)
    throw err;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    model?: string;
  };

  return {
    content: data.choices?.[0]?.message?.content || 'I could not generate a response.',
    model: data.model || SCW_MODEL,
    provider: 'scaleway',
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
  };
}

async function callNIM(
  messages: Array<{ role: string; content: string }>,
): Promise<InferenceResult> {
  const response = await fetch(NIM_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NIM_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      model: NIM_MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err: any = new Error(
      `NVIDIA NIM API error (${response.status}): ${JSON.stringify(errorData)}`,
    );
    if (response.status === 429) err.code = 'RATE_LIMITED';
    else if (response.status >= 500) err.code = 'RETRYABLE';
    throw err;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    model?: string;
  };

  return {
    content: data.choices?.[0]?.message?.content || 'I could not generate a response.',
    model: data.model || NIM_MODEL,
    provider: 'nim',
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
  };
}

async function callGroq(
  messages: Array<{ role: string; content: string }>,
): Promise<InferenceResult> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_completion_tokens: MAX_TOKENS, // Groq uses max_completion_tokens
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err: any = new Error(
      `Groq API error (${response.status}): ${JSON.stringify(errorData)}`,
    );
    if (response.status === 429) err.code = 'RATE_LIMITED';
    else if (response.status >= 500) err.code = 'RETRYABLE';
    throw err;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    model?: string;
  };

  return {
    content: data.choices?.[0]?.message?.content || 'I could not generate a response.',
    model: data.model || GROQ_MODEL,
    provider: 'groq',
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
  };
}

/**
 * Get current usage statistics
 */
export async function getUsageStats(): Promise<{
  date: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  budget: number;
  remaining: number;
  percentUsed: number;
  provider: string;
  model: string;
}> {
  const usage = await getTodaysUsage();
  const cost = getCost(usage);
  const today = new Date().toISOString().split('T')[0];
  
  return {
    date: usage?.date || today,
    requests: usage?.requests || 0,
    inputTokens: usage?.input_tokens || 0,
    outputTokens: usage?.output_tokens || 0,
    cost: Math.round(cost * 10000) / 10000,
    budget: DAILY_BUDGET_USD,
    remaining: Math.round((DAILY_BUDGET_USD - cost) * 10000) / 10000,
    percentUsed: Math.round((cost / DAILY_BUDGET_USD) * 100),
    provider: process.env.SCW_SECRET_KEY
      ? 'scaleway'
      : process.env.NIM_API_KEY
        ? 'nim'
        : 'groq',
    model: process.env.SCW_SECRET_KEY
      ? SCW_MODEL
      : process.env.NIM_API_KEY
        ? NIM_MODEL
        : GROQ_MODEL,
  };
}

/**
 * Health check for the AI service — true if any inference provider configured.
 */
export async function healthCheck(): Promise<boolean> {
  const ok = !!(
    process.env.SCW_SECRET_KEY ||
    process.env.NIM_API_KEY ||
    process.env.GROQ_API_KEY
  );
  if (!ok) {
    logger.warn('No inference provider configured (SCW_SECRET_KEY, NIM_API_KEY, or GROQ_API_KEY)');
  }
  return ok;
}

export default {
  processMessage,
  healthCheck,
  getUsageStats,
};
