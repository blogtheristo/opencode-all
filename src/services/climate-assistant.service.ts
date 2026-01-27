/**
 * Climate Assistant Service
 * AI-powered climate compliance assistant using Claude API
 *
 * Supports:
 * - EN 15978 carbon calculations
 * - CSRD compliance reporting
 * - EPBD building certifications
 * - ETS emissions monitoring
 * - CBAM border regulations
 */

import Anthropic from '@anthropic-ai/sdk';
import logger from '../utils/logger.js';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for climate compliance assistant
const SYSTEM_PROMPT = `You are DWS IQ Climate Intelligence Assistant, an expert AI specialized in EU climate compliance and sustainability regulations. You help industrial companies navigate:

**Core Expertise:**
- **EN 15978**: Life cycle assessment of buildings, embodied carbon calculations
- **CSRD** (Corporate Sustainability Reporting Directive): ESG reporting requirements
- **EPBD** (Energy Performance of Buildings Directive): Building energy certifications
- **ETS** (Emissions Trading System): Carbon allowances and monitoring
- **CBAM** (Carbon Border Adjustment Mechanism): Import carbon pricing

**Your Role:**
1. Provide accurate, actionable guidance on climate regulations
2. Help calculate carbon footprints using industry-standard methodologies
3. Explain compliance requirements in clear, practical terms
4. Suggest optimization strategies to reduce emissions
5. Reference relevant EU legislation when applicable

**Response Style:**
- Be concise but thorough
- Use bullet points for clarity
- Include specific numbers and formulas when doing calculations
- Cite relevant standards (EN 15978, ISO 14064, GHG Protocol)
- Highlight compliance deadlines and requirements

**Current Context:**
- Date: ${new Date().toISOString().split('T')[0]}
- Jurisdiction: EU (Fit for 55 package)
- Focus: Industrial climate compliance`;

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
  };
}

/**
 * Process a chat message and get AI response
 */
export async function processMessage(request: ChatRequest): Promise<ChatResponse> {
  const { message, conversationHistory = [] } = request;

  logger.info('Processing climate assistant message', {
    messageLength: message.length,
    historyLength: conversationHistory.length,
  });

  try {
    // Build messages array with history
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    // Extract text content from response
    const textContent = response.content.find(block => block.type === 'text');
    const content = textContent && 'text' in textContent ? textContent.text : 'I apologize, but I could not generate a response.';

    logger.info('Climate assistant response generated', {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      model: response.model,
    });

    return {
      content,
      model: response.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  } catch (error: any) {
    logger.error('Climate assistant error', {
      error: error.message,
      code: error.status,
    });

    // Handle specific API errors
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
 * Health check for the AI service
 */
export async function healthCheck(): Promise<boolean> {
  try {
    // Simple API key validation
    if (!process.env.ANTHROPIC_API_KEY) {
      logger.warn('ANTHROPIC_API_KEY not configured');
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export default {
  processMessage,
  healthCheck,
};
