/**
 * Provider-Agnostic LLM Client for DWS IQ 6/7
 *
 * Replaces the hardcoded Groq fetch() in base.agent.ts with a multi-provider
 * client that supports:
 *   - Groq (OpenAI-compatible) — existing default
 *   - Anthropic (Claude) — via @anthropic-ai/claude-agent-sdk
 *   - Generic OpenAI-compatible endpoints (Ollama, vLLM, Together, etc.)
 *
 * Key capability: Tool use / function calling across all providers.
 *
 * Fix #2 (tool use) and Fix #3 (replace hardcoded Groq) from DWS7 modernization.
 */

import logger from '../utils/logger.js';
import type { ToolDefinition, ToolCall, LLMMessage, LLMResponse } from './types.js';

// ============ PROVIDER CONFIGURATION ============

export type LLMProvider = 'groq' | 'anthropic' | 'openai-compatible';

export interface LLMClientConfig {
  provider: LLMProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

/** Resolve provider config from environment + agent config */
export function resolveProvider(agentModel: string): LLMClientConfig | null {
  // Priority: ANTHROPIC_API_KEY > GROQ_API_KEY > OPENAI_API_KEY
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseUrl: 'https://api.anthropic.com/v1',
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      maxTokens: 4096,
      temperature: 0.3,
    };
  }

  if (process.env.GROQ_API_KEY) {
    return {
      provider: 'groq',
      apiKey: process.env.GROQ_API_KEY,
      baseUrl: 'https://api.groq.com/openai/v1',
      model: agentModel || 'llama-3.3-70b-versatile',
      maxTokens: 1024,
      temperature: 0.3,
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      provider: 'openai-compatible',
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      model: agentModel,
      maxTokens: 4096,
      temperature: 0.3,
    };
  }

  return null;
}

// ============ LLM CLIENT ============

export class LLMClient {
  private config: LLMClientConfig;

  constructor(config: LLMClientConfig) {
    this.config = config;
  }

  get provider(): LLMProvider {
    return this.config.provider;
  }

  get model(): string {
    return this.config.model;
  }

  /**
   * Send a multi-turn conversation with optional tool definitions.
   * Returns the assistant's response, which may include tool calls.
   */
  async chat(
    messages: LLMMessage[],
    tools?: ToolDefinition[],
  ): Promise<LLMResponse> {
    if (this.config.provider === 'anthropic') {
      return this.chatAnthropic(messages, tools);
    }
    // Groq and OpenAI-compatible share the same API shape
    return this.chatOpenAICompatible(messages, tools);
  }

  // ============ ANTHROPIC PROVIDER ============

  private async chatAnthropic(
    messages: LLMMessage[],
    tools?: ToolDefinition[],
  ): Promise<LLMResponse> {
    // Extract system message (Anthropic uses top-level system param)
    const systemMsg = messages.find((m) => m.role === 'system');
    const nonSystemMsgs = messages.filter((m) => m.role !== 'system');

    // Convert tool definitions to Anthropic format
    const anthropicTools = tools?.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters,
    }));

    // Convert messages to Anthropic format
    const anthropicMessages = nonSystemMsgs.map((m) => {
      if (m.role === 'tool') {
        return {
          role: 'user' as const,
          content: [{
            type: 'tool_result' as const,
            tool_use_id: m.toolCallId || '',
            content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
          }],
        };
      }
      if (m.role === 'assistant' && m.toolCalls) {
        return {
          role: 'assistant' as const,
          content: m.toolCalls.map((tc) => ({
            type: 'tool_use' as const,
            id: tc.id,
            name: tc.name,
            input: tc.arguments,
          })),
        };
      }
      return {
        role: m.role as 'user' | 'assistant',
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      };
    });

    const body: Record<string, unknown> = {
      model: this.config.model,
      max_tokens: this.config.maxTokens || 4096,
      temperature: this.config.temperature || 0.3,
      messages: anthropicMessages,
    };

    if (systemMsg) {
      body.system = typeof systemMsg.content === 'string'
        ? systemMsg.content
        : JSON.stringify(systemMsg.content);
    }
    if (anthropicTools && anthropicTools.length > 0) {
      body.tools = anthropicTools;
    }

    const response = await fetch(`${this.config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new Error(
        `Anthropic API error (${response.status}): ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json() as {
      content?: Array<{
        type: string;
        text?: string;
        id?: string;
        name?: string;
        input?: Record<string, unknown>;
      }>;
      stop_reason?: string;
      usage?: { input_tokens?: number; output_tokens?: number };
      model?: string;
    };

    // Parse response content
    const textBlocks = (data.content || []).filter((b) => b.type === 'text');
    const toolUseBlocks = (data.content || []).filter((b) => b.type === 'tool_use');

    const toolCalls: ToolCall[] = toolUseBlocks.map((b) => ({
      id: b.id || `call_${Date.now()}`,
      name: b.name || '',
      arguments: (b.input || {}) as Record<string, unknown>,
    }));

    return {
      content: textBlocks.map((b) => b.text || '').join('\n'),
      model: data.model || this.config.model,
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      stopReason: data.stop_reason === 'tool_use' ? 'tool_use' : 'end_turn',
    };
  }

  // ============ OPENAI-COMPATIBLE PROVIDER (Groq, OpenAI, Ollama, etc.) ============

  private async chatOpenAICompatible(
    messages: LLMMessage[],
    tools?: ToolDefinition[],
  ): Promise<LLMResponse> {
    // Convert to OpenAI format
    const openaiMessages = messages.map((m) => {
      if (m.role === 'tool') {
        return {
          role: 'tool' as const,
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
          tool_call_id: m.toolCallId || '',
        };
      }
      if (m.role === 'assistant' && m.toolCalls) {
        return {
          role: 'assistant' as const,
          content: typeof m.content === 'string' ? m.content : null,
          tool_calls: m.toolCalls.map((tc) => ({
            id: tc.id,
            type: 'function' as const,
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.arguments),
            },
          })),
        };
      }
      return {
        role: m.role as 'system' | 'user' | 'assistant',
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      };
    });

    const openaiTools = tools?.map((t) => ({
      type: 'function' as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));

    const body: Record<string, unknown> = {
      model: this.config.model,
      messages: openaiMessages,
      max_completion_tokens: this.config.maxTokens || 1024,
      temperature: this.config.temperature || 0.3,
    };

    if (openaiTools && openaiTools.length > 0) {
      body.tools = openaiTools;
    }

    // If no tools, request JSON mode (backward compat with existing agents)
    if (!tools || tools.length === 0) {
      body.response_format = { type: 'json_object' };
    }

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as {
        error?: { message?: string };
      };
      throw new Error(
        `LLM API error (${response.status}): ${errorData?.error?.message || 'Unknown error'}`,
      );
    }

    const data = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string;
          tool_calls?: Array<{
            id: string;
            function: { name: string; arguments: string };
          }>;
        };
        finish_reason?: string;
      }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
      model?: string;
    };

    const choice = data.choices?.[0];
    const toolCalls: ToolCall[] = (choice?.message?.tool_calls || []).map((tc) => ({
      id: tc.id,
      name: tc.function.name,
      arguments: JSON.parse(tc.function.arguments || '{}'),
    }));

    return {
      content: choice?.message?.content || '',
      model: data.model || this.config.model,
      inputTokens: data.usage?.prompt_tokens || 0,
      outputTokens: data.usage?.completion_tokens || 0,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      stopReason: choice?.finish_reason === 'tool_calls' ? 'tool_use' : 'end_turn',
    };
  }
}

/**
 * Create an LLM client from environment, falling back gracefully.
 * Returns null if no API key is configured.
 */
export function createLLMClient(agentModel: string): LLMClient | null {
  const config = resolveProvider(agentModel);
  if (!config) {
    logger.debug('No LLM provider configured (no API key found)');
    return null;
  }
  logger.debug('LLM client created', { provider: config.provider, model: config.model });
  return new LLMClient(config);
}
