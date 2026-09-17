/**
 * Provider-Agnostic LLM Client for DWS IQ 6/7
 *
 * Multi-provider client supporting:
 *   - Groq (OpenAI-compatible) — cloud, fast inference (LPU, ~750 tok/s)
 *   - Baseten (OpenAI-compatible) — cloud, EU residency, custom/fine-tuned models
 *   - Anthropic (Claude) — cloud, highest quality
 *   - Google (Gemini) — cloud, large context
 *   - Ollama (local on Acer Veriton GN100) — €0/hour, low latency
 *   - vLLM (local on Acer Veriton GN100) — production-grade local serving
 *   - Generic OpenAI-compatible endpoints (Together, etc.)
 *
 * Key capability: Tool use / function calling across all providers.
 * Integrates with model-selector.ts for task-aware model routing.
 *
 * Fix #2 (tool use) and Fix #3 (replace hardcoded Groq) from DWS7 modernization.
 * Fix #5: Multi-agent model selection — leanest model per task tier.
 */

import logger from '../utils/logger.js';
import type { LLMMessage, LLMResponse, ModelTier, ToolCall, ToolDefinition } from './types.js';
import { OLLAMA_DEPLOYED_MODELS, selectModel } from './model-selector.js';
import type { ModelSelection } from './model-selector.js';
import { recordLLMResponse, withLLMSpan } from '../observability/tracing.js';

const PROVIDER_GENAI_SYSTEM: Record<string, string> = {
  anthropic: 'anthropic',
  google: 'gcp.gemini',
  groq: 'groq',
  baseten: 'baseten',
  'ollama-local': 'ollama',
  'vllm-local': 'vllm',
  'openai-compatible': 'openai',
};

// ============ PROVIDER CONFIGURATION ============

export type LLMProvider =
  | 'groq'
  | 'baseten'
  | 'anthropic'
  | 'google'
  | 'ollama-local'
  | 'vllm-local'
  | 'openai-compatible';
export type LLMMode = 'agent' | 'hil';

export interface LLMClientConfig {
  provider: LLMProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  /** Optional Ollama KV cache mode configured on the local host. */
  kvCacheCompression?: 'none' | 'q4_0' | 'q8_0' | 'turboquant-3bit';
  /** Optional Ollama context window size sent as num_ctx. */
  numCtx?: number;
  /** Model selection metadata (when created via createLLMClientForAgent) */
  selection?: ModelSelection;
}

/**
 * Resolve provider config from environment + agent config (legacy path).
 * Kept for backward compatibility — new agents should use createLLMClientForAgent.
 */
export function resolveProvider(agentModel: string): LLMClientConfig | null {
  // Priority: ANTHROPIC_API_KEY > GROQ_API_KEY > OLLAMA > VLLM > OPENAI_API_KEY
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseUrl: 'https://api.anthropic.com/v1',
      model: process.env.ANTHROPIC_MODEL || agentModel || 'claude-sonnet-5',
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

  // Baseten EU — custom/fine-tuned model deployment, EU residency
  // Sign Baseten DPA before routing EU customer data here
  if (process.env.BASETEN_API_KEY) {
    return {
      provider: 'baseten',
      apiKey: process.env.BASETEN_API_KEY,
      baseUrl: process.env.BASETEN_BASE_URL || 'https://bridge.baseten.co/v1/direct',
      model: process.env.BASETEN_MODEL || agentModel || 'llama-3-3-70b',
      maxTokens: 2048,
      temperature: 0.3,
    };
  }

  // Ollama on Acer Veriton GN100 (OpenAI-compatible API)
  if (process.env.OLLAMA_BASE_URL) {
      return {
        provider: 'ollama-local',
        apiKey: 'ollama', // Ollama doesn't require auth
        baseUrl: process.env.OLLAMA_BASE_URL, // e.g. http://localhost:11434/v1
        // Default must be a model the box actually has (drift incident 31.07.2026).
        model: agentModel || OLLAMA_DEPLOYED_MODELS.deep,
        maxTokens: 4096,
        temperature: 0.3,
        kvCacheCompression:
          (process.env.OLLAMA_KV_CACHE_TYPE as LLMClientConfig['kvCacheCompression']) || 'none',
        numCtx: process.env.OLLAMA_NUM_CTX ? parseInt(process.env.OLLAMA_NUM_CTX, 10) : undefined,
      };
  }

  // vLLM on Acer Veriton GN100 (OpenAI-compatible API)
  if (process.env.VLLM_BASE_URL) {
    return {
      provider: 'vllm-local',
      apiKey: process.env.VLLM_API_KEY || 'vllm', // vLLM optional auth
      baseUrl: process.env.VLLM_BASE_URL, // e.g. http://localhost:8000/v1
      model: agentModel || 'qwen2.5-32b',
      maxTokens: 4096,
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

/**
 * Resolve provider config using the model selector (task-aware path).
 * Uses the agent name to determine optimal model tier and provider.
 */
export function resolveProviderForAgent(
  agentName: string,
  options?: { tierOverride?: ModelTier; requiresTools?: boolean },
): LLMClientConfig | null {
  const selection = selectModel(agentName, {
    tierOverride: options?.tierOverride,
    requiresTools: options?.requiresTools,
  });

  if (selection.modelId === 'placeholder') {
    return null;
  }

  // Map model-selector provider to LLMProvider + resolve config
  const config = mapSelectionToConfig(selection);
  if (!config) {
    logger.warn('Model selected but provider config unavailable', {
      agent: agentName,
      selection,
    });
    return null;
  }

  logger.debug('Model selected for agent', {
    agent: agentName,
    tier: selection.tier,
    model: selection.modelId,
    provider: selection.provider,
    isLocal: selection.isLocal,
    reason: selection.reason,
  });

  return config;
}

/** Map a ModelSelection to a concrete LLMClientConfig */
function mapSelectionToConfig(selection: ModelSelection): LLMClientConfig | null {
  switch (selection.provider) {
    case 'anthropic':
      return {
        provider: 'anthropic',
        apiKey: process.env.ANTHROPIC_API_KEY || '',
        baseUrl: 'https://api.anthropic.com/v1',
        model: selection.modelId,
        maxTokens: selection.maxTokens,
        temperature: selection.temperature,
        selection,
      };

    case 'groq':
      return {
        provider: 'groq',
        apiKey: process.env.GROQ_API_KEY || '',
        baseUrl: 'https://api.groq.com/openai/v1',
        model: selection.modelId,
        maxTokens: selection.maxTokens,
        temperature: selection.temperature,
        selection,
      };

    case 'baseten': {
      const basetenKey = process.env.BASETEN_API_KEY;
      if (!basetenKey) return null;
      return {
        provider: 'baseten',
        apiKey: basetenKey,
        baseUrl: process.env.BASETEN_BASE_URL || 'https://bridge.baseten.co/v1/direct',
        model: process.env.BASETEN_MODEL || selection.modelId,
        maxTokens: selection.maxTokens,
        temperature: selection.temperature,
        selection,
      };
    }

    case 'google':
      return {
        provider: 'google',
        apiKey: process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || '',
        baseUrl:
          process.env.GOOGLE_AI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
        model: selection.modelId,
        maxTokens: selection.maxTokens,
        temperature: selection.temperature,
        selection,
      };

    case 'ollama-local': {
      const ollamaUrl = process.env.OLLAMA_BASE_URL;
      if (!ollamaUrl) return null;
      return {
        provider: 'ollama-local',
        apiKey: 'ollama',
        baseUrl: ollamaUrl,
        model: selection.modelId,
        maxTokens: selection.maxTokens,
        temperature: selection.temperature,
        kvCacheCompression:
          (process.env.OLLAMA_KV_CACHE_TYPE as LLMClientConfig['kvCacheCompression']) || 'none',
        numCtx: process.env.OLLAMA_NUM_CTX ? parseInt(process.env.OLLAMA_NUM_CTX, 10) : undefined,
        selection,
      };
    }

    case 'vllm-local': {
      const vllmUrl = process.env.VLLM_BASE_URL;
      if (!vllmUrl) return null;
      return {
        provider: 'vllm-local',
        apiKey: process.env.VLLM_API_KEY || 'vllm',
        baseUrl: vllmUrl,
        model: selection.modelId,
        maxTokens: selection.maxTokens,
        temperature: selection.temperature,
        selection,
      };
    }

    case 'openai-compatible':
      return {
        provider: 'openai-compatible',
        apiKey: process.env.OPENAI_API_KEY || '',
        baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        model: selection.modelId,
        maxTokens: selection.maxTokens,
        temperature: selection.temperature,
        selection,
      };

    default:
      return null;
  }
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

  /** Get the model selection metadata (available when created via createLLMClientForAgent) */
  get selection(): ModelSelection | undefined {
    return this.config.selection;
  }

  /**
   * Send a multi-turn conversation with optional tool definitions.
   * Returns the assistant's response, which may include tool calls.
   */
  async chat(messages: LLMMessage[], tools?: ToolDefinition[]): Promise<LLMResponse> {
    return withLLMSpan(
      {
        system: PROVIDER_GENAI_SYSTEM[this.config.provider] || this.config.provider,
        operationName: 'chat',
        requestModel: this.config.model,
        requestMaxTokens: this.config.maxTokens,
        requestTemperature: this.config.temperature,
      },
      async (span) => {
        let response: LLMResponse;
        if (this.config.provider === 'anthropic') {
          response = await this.chatAnthropic(messages, tools);
        } else if (this.config.provider === 'google') {
          response = await this.chatGoogle(messages, tools);
        } else {
          // Groq, Ollama, vLLM, and OpenAI-compatible all share the same API shape
          response = await this.chatOpenAICompatible(messages, tools);
        }
        recordLLMResponse(span, {
          responseModel: response.model,
          inputTokens: response.inputTokens,
          outputTokens: response.outputTokens,
          finishReason: response.stopReason,
        });
        return response;
      },
    );
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

  // ============ GOOGLE GEMINI PROVIDER ============

  private async chatGoogle(messages: LLMMessage[], tools?: ToolDefinition[]): Promise<LLMResponse> {
    // Convert to Gemini generateContent format
    const systemMsg = messages.find((m) => m.role === 'system');
    const nonSystemMsgs = messages.filter((m) => m.role !== 'system');

    const geminiContents = nonSystemMsgs.map((m) => {
      const role = m.role === 'assistant' ? 'model' : 'user';
      const text = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
      return { role, parts: [{ text }] };
    });

    const body: Record<string, unknown> = {
      contents: geminiContents,
      generationConfig: {
        maxOutputTokens: this.config.maxTokens || 2048,
        temperature: this.config.temperature || 0.3,
      },
    };

    if (systemMsg) {
      body.systemInstruction = {
        parts: [
          {
            text:
              typeof systemMsg.content === 'string'
                ? systemMsg.content
                : JSON.stringify(systemMsg.content),
          },
        ],
      };
    }

    if (tools && tools.length > 0) {
      body.tools = [
        {
          functionDeclarations: tools.map((t) => ({
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          })),
        },
      ];
    }

    const url = `${this.config.baseUrl}/models/${this.config.model}:generateContent`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.config.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      throw new Error(`Google AI API error (${response.status}): ${JSON.stringify(errorData)}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
            functionCall?: { name: string; args: Record<string, unknown> };
          }>;
        };
        finishReason?: string;
      }>;
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    };

    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    const textParts = parts.filter((p) => p.text).map((p) => p.text || '');
    const fnCalls = parts.filter((p) => p.functionCall);

    const toolCalls: ToolCall[] = fnCalls.flatMap((p, idx) =>
      p.functionCall
        ? [{ id: `call_gemini_${Date.now()}_${idx}`, name: p.functionCall.name, arguments: p.functionCall.args || {} }]
        : [],
    );

    return {
      content: textParts.join('\n'),
      model: this.config.model,
      inputTokens: data.usageMetadata?.promptTokenCount || 0,
      outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      stopReason: fnCalls.length > 0 ? 'tool_use' : 'end_turn',
    };
  }

  // ============ OPENAI-COMPATIBLE PROVIDER (Groq, OpenAI, Ollama, vLLM) ============

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

    if (this.config.provider === 'ollama-local' && this.config.numCtx) {
      body.options = { num_ctx: this.config.numCtx };
    }

    if (openaiTools && openaiTools.length > 0) {
      body.tools = openaiTools;
    }

    // If no tools, request JSON mode (backward compat with existing agents)
    // Skip for Ollama/vLLM which may not support response_format
    const isLocal =
      this.config.provider === 'ollama-local' || this.config.provider === 'vllm-local';
    if ((!tools || tools.length === 0) && !isLocal) {
      body.response_format = { type: 'json_object' };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Ollama doesn't require auth; vLLM has optional auth
    if (this.config.apiKey && this.config.apiKey !== 'ollama') {
      headers.Authorization = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
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
 * Create an LLM client from environment, falling back gracefully (legacy path).
 * Returns null if no API key is configured.
 */
export function createLLMClient(
  agentModel: string,
  _orgId?: string,
  _mode: LLMMode = 'agent',
): LLMClient | null {
  const config = resolveProvider(agentModel);
  if (!config) {
    logger.debug('No LLM provider configured (no API key found)');
    return null;
  }
  logger.debug('LLM client created', { provider: config.provider, model: config.model });
  return new LLMClient(config);
}

/**
 * Create an LLM client using task-aware model selection.
 * Picks the leanest model that can handle the agent's tier.
 *
 * Prefers local models (Ollama/vLLM on Acer) when available to minimize cost.
 * Falls back to cloud providers (Groq → Anthropic → Google → OpenAI) as needed.
 */
export function createLLMClientForAgent(
  agentName: string,
  options?: { tierOverride?: ModelTier; requiresTools?: boolean },
): LLMClient | null {
  const config = resolveProviderForAgent(agentName, options);
  if (!config) {
    logger.debug('No LLM provider available for agent', { agent: agentName });
    return null;
  }
  logger.info('Task-aware LLM client created', {
    agent: agentName,
    provider: config.provider,
    model: config.model,
    tier: config.selection?.tier,
    isLocal: config.selection?.isLocal,
    reason: config.selection?.reason,
    numCtx: config.numCtx,
    kvCacheCompression: config.kvCacheCompression,
  });
  return new LLMClient(config);
}
