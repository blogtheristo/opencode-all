/**
 * Base Agent - Abstract foundation for all DWS IQ 6 AI agents
 *
 * Provides:
 * - Standardized execute() lifecycle with timing and error handling
 * - Supabase execution logging (agent_executions table)
 * - LLM call helper (placeholder for Groq/Anthropic/Gemini)
 * - Configuration access
 *
 * All concrete agents extend this class and implement the abstract execute() method.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import type { AgentConfig, AgentContext, AgentResponse, AgentExecutionLog } from './types.js';

// Groq API endpoint (same provider as climate-assistant service)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export abstract class BaseAgent {
  protected config: AgentConfig;
  private supabase: SupabaseClient | null = null;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  /** Get the agent's configuration (read-only copy) */
  getConfig(): Readonly<AgentConfig> {
    return this.config;
  }

  /**
   * Abstract method that concrete agents must implement.
   * Receives validated context + arbitrary input, returns standardized AgentResponse.
   */
  abstract execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse>;

  // ============ PROTECTED HELPERS ============

  /**
   * Log an execution event to the Supabase agent_executions table.
   * Non-blocking: failures are logged but do not propagate.
   */
  protected async logExecution(log: AgentExecutionLog): Promise<void> {
    const client = this.getSupabaseClient();
    if (!client) {
      logger.debug('Supabase not configured - skipping agent execution log');
      return;
    }

    try {
      const { error } = await client.from('agent_executions').insert(log);
      if (error) {
        logger.warn('Failed to write agent execution log', {
          agent: log.agent_name,
          error: error.message,
        });
      }
    } catch (err: any) {
      logger.warn('Exception writing agent execution log', {
        agent: log.agent_name,
        error: err.message,
      });
    }
  }

  /**
   * Call an LLM with a structured prompt and return the parsed response.
   *
   * Currently wired to Groq (OpenAI-compatible API) using the model
   * specified in this agent's config. Falls back gracefully when
   * GROQ_API_KEY is not set (returns a structured placeholder).
   */
  protected async callLLM(prompt: string): Promise<{
    content: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
  }> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      logger.debug('GROQ_API_KEY not set - returning placeholder LLM response', {
        agent: this.config.name,
      });
      return {
        content: JSON.stringify({
          summary: 'LLM unavailable - analysis based on deterministic logic only',
        }),
        model: 'placeholder',
        inputTokens: 0,
        outputTokens: 0,
      };
    }

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: `You are ${this.config.name}, a specialized AI agent for DWS IQ 6. ${this.config.description}. Always respond with valid JSON.`,
            },
            { role: 'user', content: prompt },
          ],
          max_completion_tokens: 1024,
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(
          `Groq API error (${response.status}): ${errorData?.error?.message || 'Unknown error'}`,
        );
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
        model?: string;
      };

      return {
        content: data.choices?.[0]?.message?.content || '{}',
        model: data.model || this.config.model,
        inputTokens: data.usage?.prompt_tokens || 0,
        outputTokens: data.usage?.completion_tokens || 0,
      };
    } catch (err: any) {
      logger.error('LLM call failed', { agent: this.config.name, error: err.message });
      return {
        content: JSON.stringify({
          summary: 'LLM call failed - analysis based on deterministic logic only',
          error: err.message,
        }),
        model: 'error',
        inputTokens: 0,
        outputTokens: 0,
      };
    }
  }

  // ============ PRIVATE HELPERS ============

  /** Lazy-initialize Supabase client */
  private getSupabaseClient(): SupabaseClient | null {
    if (this.supabase) return this.supabase;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
      return null;
    }

    this.supabase = createClient(url, key);
    return this.supabase;
  }
}
