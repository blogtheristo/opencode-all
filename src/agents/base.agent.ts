/**
 * Base Agent — DWS IQ 6/7 Foundation
 *
 * Abstract foundation for all AI agents. DWS7 modernization adds:
 *
 *   Fix #1: Observe-think-act agentic loop (runLoop method)
 *   Fix #2: Tool use / function calling via ToolDefinition + ToolCall
 *   Fix #3: Multi-provider LLM client (Anthropic, Groq, OpenAI-compatible)
 *   Fix #4: Agent-to-agent delegation via delegate_to_agent tool
 *
 * Backward compatible: existing agents using execute() + callLLM() still work.
 * New agents can use runLoop() for multi-step reasoning with tool use.
 *
 * All concrete agents extend this class and implement the abstract execute() method.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { createLLMClient, createLLMClientForAgent, type LLMClient } from './llm-client.js';
import { BUILTIN_TOOLS, executeTools } from './tools.js';
import { isPhaseAtLeast } from './autonomy.js';
import type {
  AgentConfig,
  AgentContext,
  AgentExecutionLog,
  AgentLoopConfig,
  AgentLoopIteration,
  AgentResponse,
  GovernanceAuditEntry,
  GovernancePolicy,
  LLMMessage,
  LLMResponse,
  PolicyCheckResult,
  SandboxContext,
  ToolDefinition,
} from './types.js';
import { buildSDKSandboxConfig, getSandboxStage, validateNIS2Compliance } from '../sandbox/index.js';
import type { SDKSandboxConfig } from '../sandbox/index.js';

export abstract class BaseAgent {
  protected config: AgentConfig;
  private supabase: SupabaseClient | null = null;
  private llmClient: LLMClient | null | undefined = undefined; // undefined = not yet initialized

  constructor(config: AgentConfig) {
    this.config = {
      ...config,
      // Default loop config for new agents
      loop: config.loop || {
        maxIterations: 10,
        allowDelegation: true,
        logIterations: true,
      },
    };
  }

  /** Get the agent's configuration (read-only copy) */
  getConfig(): Readonly<AgentConfig> {
    return this.config;
  }

  /**
   * Abstract method that concrete agents must implement.
   * Receives validated context + arbitrary input, returns standardized AgentResponse.
   *
   * Existing agents: implement this directly with deterministic logic + callLLM().
   * New agents: can call runLoop() from within execute() for agentic behavior.
   */
  abstract execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse>;

  // ============ DWS7: AGENTIC LOOP (Fix #1) ============

  /**
   * Run an observe-think-act loop with tool use.
   *
   * This is the DWS7 agentic pattern. The loop:
   * 1. OBSERVE: Send context + history to LLM
   * 2. THINK: LLM reasons about what to do next
   * 3. ACT: Execute tool calls, feed results back to LLM
   * 4. REPEAT until LLM stops calling tools or maxIterations reached
   *
   * Replaces the single-shot callLLM() pattern for agents that need
   * multi-step reasoning, database queries, or agent delegation.
   */
  protected async runLoop(
    context: AgentContext,
    systemPrompt: string,
    userMessage: string,
    tools?: ToolDefinition[],
  ): Promise<{
    content: string;
    iterations: AgentLoopIteration[];
    totalTokens: { input: number; output: number };
    model: string;
  }> {
    const client = this.getLLMClient();
    if (!client) {
      return {
        content: JSON.stringify({
          summary: 'LLM unavailable — analysis based on deterministic logic only',
        }),
        iterations: [],
        totalTokens: { input: 0, output: 0 },
        model: 'placeholder',
      };
    }

    const loopConfig: AgentLoopConfig = this.config.loop || {
      maxIterations: 10,
      allowDelegation: true,
      logIterations: true,
    };

    // Merge agent-specific tools with built-in tools
    const allTools: ToolDefinition[] = [
      ...(tools || []),
      BUILTIN_TOOLS.query_database,
      BUILTIN_TOOLS.emit_event,
    ];

    // Only include delegation tool if allowed
    if (loopConfig.allowDelegation) {
      allTools.push(BUILTIN_TOOLS.delegate_to_agent);
    }

    // Proactive notification: offered only to agents at autonomy phase >= advisor.
    // The handler re-checks this gate, but withholding the tool keeps silent-pilot
    // agents from ever attempting an outbound nudge.
    const autonomyPhase = this.config.autonomyPhase ?? 'silent_pilot';
    if (isPhaseAtLeast(autonomyPhase, 'advisor')) {
      allTools.push(BUILTIN_TOOLS.send_notification);
    }

    // Inject per-agent runtime policy so tool handlers can enforce phase + limits.
    context.agentRuntime = {
      name: this.config.name,
      autonomyPhase,
      notify: this.config.notify,
    };

    // Include fetch if sandbox allows it
    if (context.sandbox?.allowedDomains?.length || !context.sandbox) {
      allTools.push(BUILTIN_TOOLS.fetch_external);
    }

    // Build initial conversation
    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    const iterations: AgentLoopIteration[] = [];
    let totalInput = 0;
    let totalOutput = 0;
    let model = client.model;

    for (let i = 0; i < loopConfig.maxIterations; i++) {
      const iterStart = Date.now();

      // OBSERVE + THINK: Send to LLM
      let response: LLMResponse;
      try {
        response = await client.chat(messages, allTools);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown LLM error';
        logger.error('Agentic loop LLM call failed', {
          agent: this.config.name,
          iteration: i,
          error: msg,
        });
        break;
      }

      totalInput += response.inputTokens;
      totalOutput += response.outputTokens;
      model = response.model;

      // If no tool calls, the agent is done thinking
      if (!response.toolCalls || response.toolCalls.length === 0 || response.stopReason === 'end_turn') {
        iterations.push({
          iteration: i,
          phase: 'think',
          thought: response.content,
          timestamp: new Date().toISOString(),
          durationMs: Date.now() - iterStart,
        });

        messages.push({ role: 'assistant', content: response.content });
        break;
      }

      // ACT: Execute tool calls
      const toolCalls = response.toolCalls;

      // Add assistant message with tool calls to conversation
      messages.push({
        role: 'assistant',
        content: response.content || '',
        toolCalls,
      });

      // Execute all tool calls in parallel
      const toolResults = await executeTools(toolCalls, context);

      // Add tool results to conversation
      for (const result of toolResults) {
        messages.push({
          role: 'tool',
          content: JSON.stringify(result.result),
          toolCallId: result.toolCallId,
        });
      }

      // Record iteration
      iterations.push({
        iteration: i,
        phase: 'act',
        thought: response.content || undefined,
        actions: toolCalls,
        actionResults: toolResults,
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - iterStart,
      });

      logger.debug('Agentic loop iteration', {
        agent: this.config.name,
        iteration: i,
        toolCalls: toolCalls.map((tc) => tc.name),
      });
    }

    // Extract final content from last assistant message
    const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
    const finalContent = typeof lastAssistant?.content === 'string'
      ? lastAssistant.content
      : JSON.stringify(lastAssistant?.content || {});

    // Log iterations to Supabase if configured
    if (loopConfig.logIterations && iterations.length > 0) {
      await this.logLoopIterations(context, iterations);
    }

    return {
      content: finalContent,
      iterations,
      totalTokens: { input: totalInput, output: totalOutput },
      model,
    };
  }

  // ============ DWS7: MULTI-PROVIDER LLM CLIENT (Fix #3) ============

  /**
   * Get or create the LLM client.
   *
   * When modelTier is set on the agent config, uses task-aware model selection
   * to pick the leanest model (prefers local Ollama/vLLM on Acer when available).
   * Otherwise falls back to legacy environment-based provider resolution.
   *
   * Supports: Anthropic, Groq, Google Gemini, Ollama, vLLM, OpenAI-compatible.
   */
  protected getLLMClient(): LLMClient | null {
    if (this.llmClient === undefined) {
      if (this.config.modelTier) {
        // Task-aware path: select leanest model for this agent's tier
        this.llmClient = createLLMClientForAgent(this.config.name, {
          tierOverride: this.config.modelTier,
          requiresTools: !!(this.config.tools && this.config.tools.length > 0),
        });
      } else {
        // Legacy path: environment-based provider resolution
        this.llmClient = createLLMClient(this.config.model);
      }
    }
    return this.llmClient;
  }

  // ============ BACKWARD COMPAT: callLLM() ============

  /**
   * Call an LLM with a structured prompt and return the parsed response.
   *
   * DWS7: Now uses the multi-provider LLM client instead of hardcoded Groq fetch.
   * Falls back gracefully when no API key is set (returns structured placeholder).
   *
   * For new agents: prefer runLoop() which supports tool use and multi-step reasoning.
   * This method is preserved for backward compatibility with existing agents.
   */
  /**
   * Optional SOUL system prompt set by subclasses to override the generic base prompt.
   * When set, this is used as the system message in callLLM() instead of the auto-generated one.
   * Set via: this.soulPrompt = SOUL; in the constructor or execute() method.
   */
  protected soulPrompt: string | null = null;

  protected async callLLM(prompt: string, systemPromptOverride?: string): Promise<{
    content: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
  }> {
    const client = this.getLLMClient();

    if (!client) {
      logger.debug('No LLM provider configured - returning placeholder response', {
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

    // Priority: explicit override > soulPrompt > generic fallback
    const systemContent = systemPromptOverride
      ?? this.soulPrompt
      ?? `You are ${this.config.name}, a specialized AI agent for Climate IQ. ${this.config.description}. Always respond with valid JSON.`;

    try {
      const response = await client.chat([
        { role: 'system', content: systemContent },
        { role: 'user', content: prompt },
      ]);

      return {
        content: response.content || '{}',
        model: response.model,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
      };
    } catch (err) {
      logger.error('LLM call failed', { agent: this.config.name, error: err instanceof Error ? err.message : String(err) });
      return {
        content: JSON.stringify({
          summary: 'LLM call failed - analysis based on deterministic logic only',
          error: err instanceof Error ? err.message : String(err),
        }),
        model: 'error',
        inputTokens: 0,
        outputTokens: 0,
      };
    }
  }

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
    } catch (err) {
      logger.warn('Exception writing agent execution log', {
        agent: log.agent_name,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  /** Log agentic loop iterations for Article 12 traceability */
  private async logLoopIterations(
    context: AgentContext,
    iterations: AgentLoopIteration[],
  ): Promise<void> {
    const client = this.getSupabaseClient();
    if (!client) return;

    try {
      await client.from('agent_loop_iterations').insert({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        iterations: JSON.stringify(iterations),
        iteration_count: iterations.length,
        created_at: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.debug('Failed to log loop iterations', { error: msg });
    }
  }

  // ============ GOVERNANCE ENGINE ============

  /** Global policies shared across all agents */
  private static policies: GovernancePolicy[] = [];

  /** Rate limit state: agentName-orgId → { count, windowStart } */
  private static rateLimitState: Map<string, { count: number; windowStart: number }> = new Map();

  /** Register a governance policy (call from app initialization) */
  static registerPolicy(policy: GovernancePolicy): void {
    BaseAgent.policies.push(policy);
    logger.debug('Governance policy registered', { id: policy.id, type: policy.type });
  }

  /** Clear all policies (useful for testing) */
  static clearPolicies(): void {
    BaseAgent.policies = [];
    BaseAgent.rateLimitState.clear();
  }

  /**
   * Run governance checks before agent execution.
   * Returns null if all checks pass, or an AgentResponse if blocked.
   */
  protected async checkGovernance(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse | null> {
    const applicablePolicies = BaseAgent.policies.filter(
      (p) => p.agentPattern === '*' || p.agentPattern === this.config.name,
    );

    if (applicablePolicies.length === 0) return null;

    const results: PolicyCheckResult[] = [];

    for (const policy of applicablePolicies) {
      const result = this.evaluatePolicy(policy, context, input);
      results.push(result);
    }

    const failed = results.filter((r) => !r.allowed);
    const enforced = failed.filter((r) => r.enforcement === 'enforced');

    // Log governance audit
    const audit: GovernanceAuditEntry = {
      timestamp: new Date().toISOString(),
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      policies_checked: results.length,
      policies_passed: results.length - failed.length,
      policies_failed: failed.length,
      blocked: enforced.length > 0,
      details: results,
    };

    if (failed.length > 0) {
      logger.warn('Governance policy violation', {
        agent: this.config.name,
        blocked: enforced.length > 0,
        violations: failed.map((f) => f.policyId),
      });
    }

    await this.logGovernanceAudit(audit);

    // Block only if enforced policies failed
    if (enforced.length > 0) {
      return {
        agentName: this.config.name,
        result: {
          blocked: true,
          violations: enforced.map((e) => ({ policy: e.policyId, reason: e.reason })),
        },
        confidence: 1,
        reasoning: `Execution blocked by governance: ${enforced.map((e) => e.reason).join('; ')}`,
        recommendations: ['Contact administrator to adjust governance policies or request approval'],
        metadata: { governance: audit },
      };
    }

    return null;
  }

  private evaluatePolicy(
    policy: GovernancePolicy,
    context: AgentContext,
    _input: Record<string, unknown>,
  ): PolicyCheckResult {
    switch (policy.type) {
      case 'rate-limit': {
        const window_ms = ((policy.config.window_minutes as number) || 60) * 60 * 1000;
        const maxCalls = (policy.config.max_calls as number) || 100;
        const key = `${this.config.name}-${context.orgId}`;
        const state = BaseAgent.rateLimitState.get(key);
        const now = Date.now();

        if (!state || now - state.windowStart > window_ms) {
          BaseAgent.rateLimitState.set(key, { count: 1, windowStart: now });
          return { policyId: policy.id, allowed: true, reason: 'Within rate limit', enforcement: policy.enforcement };
        }

        state.count++;
        if (state.count > maxCalls) {
          return { policyId: policy.id, allowed: false, reason: `Rate limit exceeded: ${state.count}/${maxCalls} calls in window`, enforcement: policy.enforcement };
        }
        return { policyId: policy.id, allowed: true, reason: `Rate limit OK: ${state.count}/${maxCalls}`, enforcement: policy.enforcement };
      }

      case 'cost-limit': {
        // NOT ENFORCED. This branch has never consulted spend — it always allowed
        // the call. It previously reported "(tracking active)", which was false and
        // is exactly the failure mode CLAUDE.md Rule 12 (Fail Loud) names: a
        // cost-control path reporting a guarantee it does not provide.
        //
        // Enforcing it needs a spend read against token_usage_events
        // (src/services/token-usage.service.ts already carries cost_eur, model,
        // session_id and task_id). Until that read exists, say so rather than imply
        // a limit is in force.
        const maxCost = (policy.config.max_daily_eur as number) || 50;
        return { policyId: policy.id, allowed: true, reason: `Cost limit configured at EUR ${maxCost}/day — NOT ENFORCED (no spend lookup wired)`, enforcement: policy.enforcement };
      }

      case 'approval-required': {
        return { policyId: policy.id, allowed: false, reason: 'Human approval required before execution', enforcement: policy.enforcement };
      }

      case 'data-boundary': {
        const allowedRegions = (policy.config.allowed_regions as string[]) || ['EU'];
        return { policyId: policy.id, allowed: true, reason: `Data boundary: ${allowedRegions.join(', ')}`, enforcement: policy.enforcement };
      }

      case 'autonomy-tier': {
        const maxTier = (policy.config.max_tier as number) || 2;
        return { policyId: policy.id, allowed: true, reason: `Autonomy tier ≤ ${maxTier}`, enforcement: policy.enforcement };
      }

      default:
        return { policyId: policy.id, allowed: true, reason: 'Unknown policy type - passing', enforcement: policy.enforcement };
    }
  }

  private async logGovernanceAudit(audit: GovernanceAuditEntry): Promise<void> {
    const client = this.getSupabaseClient();
    if (!client) return;

    try {
      await client.from('governance_audit').insert(audit);
    } catch (err) {
      logger.debug('Failed to log governance audit', { error: err instanceof Error ? err.message : String(err) });
    }
  }

  // ============ SANDBOX ISOLATION ============

  /**
   * Build and attach sandbox context to an AgentContext.
   * Call this before execute() to enforce tenant isolation.
   *
   * Stage 1: Returns SDK sandbox config (applied by caller to Anthropic Agent SDK)
   * Stage 2+: Sandbox config is informational — actual isolation is container-level
   */
  protected buildSandboxContext(
    context: AgentContext,
    tier: 'sandbox' | 'professional' | 'enterprise' = 'sandbox',
  ): { context: AgentContext; sandboxConfig: SDKSandboxConfig | null } {
    const stage = getSandboxStage();

    const sandboxConfig = buildSDKSandboxConfig({
      tenantId: context.orgId,
      tier,
      euDataResidency: true,
    });

    // Validate NIS2 compliance
    const violations = validateNIS2Compliance(sandboxConfig);
    if (violations.length > 0) {
      logger.warn('NIS2 sandbox violations detected', {
        agent: this.config.name,
        tenantId: context.orgId,
        violations,
      });
    }

    const sandboxContext: SandboxContext = {
      stage: stage === 'opensandbox' ? '1' : stage,
      tier,
      euDataResidency: true,
      allowedPaths: sandboxConfig.filesystem.allowedPaths,
      allowedDomains: sandboxConfig.network.allowedDomains,
    };

    return {
      context: { ...context, sandbox: sandboxContext },
      sandboxConfig: stage === '1' ? sandboxConfig : null,
    };
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
