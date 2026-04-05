/**
 * Provider-Agnostic LLM Client for DWS IQ 6/7
 *
 * Two providers, mode-aware priority:
 *   - Ollama (GN100 edge / local) — sovereign, keyless, agent-first
 *   - Anthropic (Claude) — HIL-first, cloud fallback
 *
 * Agent work (autonomous): Ollama primary → Anthropic fallback
 * HIL (human-in-the-loop): Anthropic primary → Ollama fallback
 *
 * Key capability: Tool use / function calling across both providers.
 */

import logger from '../utils/logger.js';
import type { ToolDefinition, ToolCall, LLMMessage, LLMResponse } from './types.js';

// ============ PROVIDER CONFIGURATION ============

export type LLMProvider = 'anthropic' | 'ollama' | 'openai-compatible' | 'grok';

/** Request mode: 'agent' = autonomous work, 'hil' = human-in-the-loop */
export type LLMMode = 'agent' | 'hil';

export interface LLMClientConfig {
  provider: LLMProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

const OLLAMA_CONFIG = (): LLMClientConfig | null => {
  if (!process.env.OLLAMA_HOST) return null;
  const baseUrl = process.env.OLLAMA_HOST.replace(/\/$/, '');
  return {
    provider: 'ollama',
    apiKey: process.env.OLLAMA_API_KEY || 'ollama',
    baseUrl: `${baseUrl}/v1`,
    model: process.env.OLLAMA_MODEL || 'qwen3:8b',
    maxTokens: 4096,
    temperature: 0.3,
  };
};

const ANTHROPIC_CONFIG = (): LLMClientConfig | null => {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return {
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseUrl: 'https://api.anthropic.com/v1',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    maxTokens: 4096,
    temperature: 0.3,
  };
};

/**
 * Resolve provider config from environment + mode.
 *
 * Priority depends on mode:
 *   agent (autonomous): Ollama → Anthropic  (use edge when possible)
 *   hil (human-in-loop): Anthropic → Ollama  (quality-first for human requests)
 */
export function resolveProvider(
  agentModel: string,
  opts?: { orgId?: string; mode?: LLMMode },
): LLMClientConfig | null {
  const mode = opts?.mode || 'agent';

  if (mode === 'hil') {
    // HIL: Anthropic primary, Ollama fallback
    return ANTHROPIC_CONFIG() || OLLAMA_CONFIG();
  }

  // Agent: Ollama primary (edge/sovereign), Anthropic fallback
  return OLLAMA_CONFIG() || ANTHROPIC_CONFIG();
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
    opts?: { orgId?: string },
  ): Promise<LLMResponse> {
    if (this.config.provider === 'grok') {
      return this.chatGrok(messages, opts);
    }
    if (this.config.provider === 'anthropic') {
      return this.chatAnthropic(messages, tools);
    }
    // Ollama and OpenAI-compatible share the same API shape
    return this.chatOpenAICompatible(messages, tools);
  }

  // ============ GROK (xAI) PROVIDER — consent-gated ============

  /**
   * xAI Grok inference path.
   *
   * GDPR + EU AI Act Article 12 require per-org explicit opt-in before
   * we can forward any prompt to xAI. Every call passes through
   * grokConsentService.checkConsent(orgId); blocked requests throw a
   * domain-specific 'Grok inference blocked' error and are logged via
   * logInferenceBlocked for the Article 12 audit trail.
   *
   * Introduced-In: PR-982 (LLM adapter / error-normalization)
   */
  private async chatGrok(messages: LLMMessage[], opts?: { orgId?: string }): Promise<LLMResponse> {
    const orgId = opts?.orgId;
    if (!orgId) {
      throw new Error('Grok provider requires orgId for consent gate (GDPR Art. 6(1)(a))');
    }

    // Lazy import to avoid circular dependency with the consent service.
    const { grokConsentService } = await import('../services/grok-consent.service.js');

    const consent = await grokConsentService.checkConsent(orgId);
    if (!consent.granted) {
      await grokConsentService.logInferenceBlocked(orgId, consent.reason);
      throw new Error(`Grok inference blocked — ${consent.reason}`);
    }

    // Consent gate passed — forward to xAI (OpenAI-compatible API).
    const url = `${this.config.baseUrl.replace(/\/$/, '')}/chat/completions`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        })),
        max_tokens: this.config.maxTokens || 4096,
        temperature: this.config.temperature ?? 0.3,
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(`xAI API error ${resp.status} ${resp.statusText}: ${body}`);
    }

    const data = (await resp.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };

    return {
      content: data.choices?.[0]?.message?.content ?? '',
      model: this.config.model,
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0,
      stopReason: 'end_turn',
    };
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
          content: [
            {
              type: 'tool_result' as const,
              tool_use_id: m.toolCallId || '',
              content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
            },
          ],
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
      body.system =
        typeof systemMsg.content === 'string'
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
      const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      throw new Error(`Anthropic API error (${response.status}): ${JSON.stringify(errorData)}`);
    }

    const data = (await response.json()) as {
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

  // ============ OPENAI-COMPATIBLE PROVIDER (Ollama, etc.) ============

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

    // If no tools, request JSON mode (backward compat with existing agents).
    // Ollama supports JSON mode but some models handle it inconsistently,
    // so we still set it — Ollama ignores unsupported fields gracefully.
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
      const errorData = (await response.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      throw new Error(
        `LLM API error (${response.status}): ${errorData?.error?.message || 'Unknown error'}`,
      );
    }

    const data = (await response.json()) as {
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
 * Returns null if no provider is configured (neither OLLAMA_HOST nor ANTHROPIC_API_KEY).
 *
 * mode: 'agent' (default) = Ollama first, 'hil' = Anthropic first.
 */
export function createLLMClient(
  agentModel: string,
  orgId?: string,
  mode: LLMMode = 'agent',
): LLMClient | null {
  const config = resolveProvider(agentModel, { orgId, mode });
  if (!config) {
    logger.debug('No LLM provider configured (set OLLAMA_HOST or ANTHROPIC_API_KEY)');
    return null;
  }
  logger.debug('LLM client created', { provider: config.provider, model: config.model, mode });
  return new LLMClient(config);
}
