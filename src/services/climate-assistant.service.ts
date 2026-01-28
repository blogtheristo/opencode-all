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
 */

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

// ============ USAGE TRACKING ============

interface DailyUsage {
  date: string;
  inputTokens: number;
  outputTokens: number;
  requests: number;
}

let dailyUsage: DailyUsage = {
  date: new Date().toISOString().split('T')[0],
  inputTokens: 0,
  outputTokens: 0,
  requests: 0,
};

/**
 * Get current daily cost
 */
function getDailyCost(): number {
  return (
    dailyUsage.inputTokens * INPUT_COST_PER_TOKEN +
    dailyUsage.outputTokens * OUTPUT_COST_PER_TOKEN
  );
}

/**
 * Check if budget is exceeded
 */
function isBudgetExceeded(): boolean {
  // Reset if new day
  const today = new Date().toISOString().split('T')[0];
  if (dailyUsage.date !== today) {
    logger.info('Daily usage reset', { previousUsage: dailyUsage });
    dailyUsage = {
      date: today,
      inputTokens: 0,
      outputTokens: 0,
      requests: 0,
    };
  }
  return getDailyCost() >= DAILY_BUDGET_USD;
}

/**
 * Track token usage
 */
function trackUsage(inputTokens: number, outputTokens: number): void {
  dailyUsage.inputTokens += inputTokens;
  dailyUsage.outputTokens += outputTokens;
  dailyUsage.requests += 1;

  logger.info('Usage tracked', {
    inputTokens,
    outputTokens,
    dailyCost: `$${getDailyCost().toFixed(4)}`,
    dailyBudget: `$${DAILY_BUDGET_USD}`,
    remainingBudget: `$${(DAILY_BUDGET_USD - getDailyCost()).toFixed(4)}`,
  });
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
  if (isBudgetExceeded()) {
    logger.warn('Daily budget exceeded', { dailyCost: getDailyCost() });
    return {
      content: `I've reached my daily usage limit ($${DAILY_BUDGET_USD}). Please try again tomorrow.`,
      model: 'budget-exceeded',
      usage: {
        inputTokens: 0,
        outputTokens: 0,
        cost: 0,
        dailyCost: getDailyCost(),
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
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('Groq API error', {
        status: response.status,
        error: errorData,
      });

      if (response.status === 401) {
        throw new Error('API authentication failed. Check GROQ_API_KEY.');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
      model?: string;
    };

    // Extract content
    const content = data.choices?.[0]?.message?.content || 'I could not generate a response.';

    // Track usage
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    trackUsage(inputTokens, outputTokens);

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

    return {
      content,
      model: data.model || MODEL,
      usage: {
        inputTokens,
        outputTokens,
        cost: requestCost,
        dailyCost: getDailyCost(),
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
export function getUsageStats(): {
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
} {
  const cost = getDailyCost();
  return {
    date: dailyUsage.date,
    requests: dailyUsage.requests,
    inputTokens: dailyUsage.inputTokens,
    outputTokens: dailyUsage.outputTokens,
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
