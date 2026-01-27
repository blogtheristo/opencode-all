/**
 * Climate Assistant Service
 * AI-powered climate compliance assistant using Claude API
 *
 * Configuration:
 * - Model: Claude 3 Haiku (cheapest)
 * - Daily budget: $1.00
 * - Max tokens per response: 1024
 *
 * Haiku Pricing (as of 2024):
 * - Input: $0.25 per 1M tokens
 * - Output: $1.25 per 1M tokens
 */

import Anthropic from '@anthropic-ai/sdk';
import logger from '../utils/logger.js';

// ============ CONFIGURATION ============

// Model: Claude 3 Haiku (cheapest option)
const MODEL = 'claude-3-haiku-20240307';

// Pricing per token (USD)
const INPUT_COST_PER_TOKEN = 0.25 / 1_000_000;  // $0.00000025
const OUTPUT_COST_PER_TOKEN = 1.25 / 1_000_000; // $0.00000125

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

// ============ ANTHROPIC CLIENT ============

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt (concise for Haiku)
const SYSTEM_PROMPT = `You are DWS IQ Climate Assistant. You help with EU climate compliance:

**Expertise:** EN 15978, CSRD, EPBD, ETS, CBAM

**Style:**
- Be concise and practical
- Use bullet points
- Include specific numbers for calculations
- Cite relevant EU standards

Current date: ${new Date().toISOString().split('T')[0]}`;

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
 * Process a chat message and get AI response
 */
export async function processMessage(request: ChatRequest): Promise<ChatResponse> {
  const { message, conversationHistory = [] } = request;

  // Check daily budget
  if (isBudgetExceeded()) {
    logger.warn('Daily budget exceeded', { dailyCost: getDailyCost() });
    return {
      content: `I've reached my daily usage limit ($${DAILY_BUDGET_USD}). Please try again tomorrow, or contact support for increased limits.`,
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
  });

  try {
    // Build messages (limit history to save tokens)
    const recentHistory = conversationHistory.slice(-4); // Keep last 4 messages
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...recentHistory,
      { role: 'user', content: message },
    ];

    // Call Claude API
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    // Extract text content
    const textContent = response.content.find(block => block.type === 'text');
    const content = textContent && 'text' in textContent
      ? textContent.text
      : 'I could not generate a response.';

    // Track usage
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    trackUsage(inputTokens, outputTokens);

    const requestCost =
      inputTokens * INPUT_COST_PER_TOKEN +
      outputTokens * OUTPUT_COST_PER_TOKEN;

    logger.info('Response generated', {
      inputTokens,
      outputTokens,
      cost: `$${requestCost.toFixed(6)}`,
      model: response.model,
    });

    return {
      content,
      model: response.model,
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
      code: error.status,
    });

    if (error.status === 401) {
      throw new Error('API authentication failed. Check ANTHROPIC_API_KEY.');
    }
    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (error.status === 500) {
      throw new Error('AI service temporarily unavailable.');
    }

    throw new Error('Failed to process message. Please try again.');
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
  };
}

/**
 * Health check for the AI service
 */
export async function healthCheck(): Promise<boolean> {
  if (!process.env.ANTHROPIC_API_KEY) {
    logger.warn('ANTHROPIC_API_KEY not configured');
    return false;
  }
  return true;
}

export default {
  processMessage,
  healthCheck,
  getUsageStats,
};
