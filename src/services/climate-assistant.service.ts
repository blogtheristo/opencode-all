/**
 * Climate Assistant Service
 * AI-powered climate compliance assistant using Groq API
 *
 * Configuration:
 * - Provider: Groq (fastest inference)
 * - Model: Llama 3.1 70B Versatile
 * - Daily budget: $1.00
 * - Max tokens per response: 1024
 *
 * Groq Pricing (Llama 3.1 70B):
 * - Input: $0.59 per 1M tokens
 * - Output: $0.79 per 1M tokens
 *
 * Usage Tracking:
 * - Persisted in Supabase for serverless/multi-instance deployment
 * - Prevents budget overruns across cold starts and multiple instances
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

// ============ CONFIGURATION ============

// Model: Llama 3.3 70B on Groq (fast + cheap)
const MODEL = 'llama-3.3-70b-versatile';

// Groq API endpoint
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

  // Check API key
  if (!process.env.GROQ_API_KEY) {
    logger.error('GROQ_API_KEY not configured');
    return {
      content: 'Climate Assistant is not configured. Please set GROQ_API_KEY.',
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

  logger.info('Processing message', {
    messageLength: message.length,
    historyLength: conversationHistory.length,
    model: MODEL,
    provider: 'groq',
  });

  try {
    // Build messages (limit history to save tokens)
    const recentHistory = conversationHistory.slice(-4);
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentHistory,
      { role: 'user', content: message },
    ];

    // Call Groq API (OpenAI-compatible)
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        max_completion_tokens: MAX_TOKENS,  // Note: Groq uses max_completion_tokens, not max_tokens
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('Groq API error', {
        status: response.status,
        error: errorData,
        requestBody: {
          model: MODEL,
          messageCount: messages.length,
          maxCompletionTokens: MAX_TOKENS,
        },
      });

      if (response.status === 401) {
        throw new Error('API authentication failed. Check GROQ_API_KEY.');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      // Include error details for debugging
      const errorObj = errorData as { error?: { message?: string }; message?: string };
      const errorMessage = errorObj?.error?.message || errorObj?.message || JSON.stringify(errorData);
      throw new Error(`Groq API error (${response.status}): ${errorMessage}`);
    }

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
      model?: string;
    };

    // Extract content
    const content = data.choices?.[0]?.message?.content || 'I could not generate a response.';

    // Track usage and get updated totals
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    const updatedUsage = await trackUsage(inputTokens, outputTokens);

    const requestCost =
      inputTokens * INPUT_COST_PER_TOKEN +
      outputTokens * OUTPUT_COST_PER_TOKEN;

    logger.info('Response generated', {
      inputTokens,
      outputTokens,
      cost: `$${requestCost.toFixed(6)}`,
      model: data.model,
      provider: 'groq',
    });

    // Use returned usage to avoid extra query, fallback to fresh query if tracking failed
    const dailyCost = updatedUsage ? getCost(updatedUsage) : getCost(await getTodaysUsage());

    return {
      content,
      model: data.model || MODEL,
      usage: {
        inputTokens,
        outputTokens,
        cost: requestCost,
        dailyCost: dailyCost,
        dailyBudget: DAILY_BUDGET_USD,
      },
    };
  } catch (error: any) {
    logger.error('API error', {
      error: error.message,
    });
    throw new Error(error.message || 'Failed to process message. Please try again.');
  }
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
    provider: 'groq',
    model: MODEL,
  };
}

/**
 * Health check for the AI service
 */
export async function healthCheck(): Promise<boolean> {
  if (!process.env.GROQ_API_KEY) {
    logger.warn('GROQ_API_KEY not configured');
    return false;
  }
  return true;
}

export default {
  processMessage,
  healthCheck,
  getUsageStats,
};
