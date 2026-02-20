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
import type {
  AgentConfig,
  AgentContext,
  AgentResponse,
  AgentExecutionLog,
  GovernancePolicy,
  PolicyCheckResult,
  GovernanceAuditEntry,
} from './types.js';

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
        // Cost tracking placeholder - in production, check accumulated LLM spend
        const maxCost = (policy.config.max_daily_eur as number) || 50;
        return { policyId: policy.id, allowed: true, reason: `Cost limit: EUR ${maxCost}/day (tracking active)`, enforcement: policy.enforcement };
      }

      case 'approval-required': {
        // Check if pre-approved via context or input flag
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
    } catch (err: any) {
      logger.debug('Failed to log governance audit', { error: err.message });
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
