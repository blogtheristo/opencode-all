/**
 * Iris — Research & Market Intelligence Agent, Climate IQ
 *
 * Bridges external knowledge into the Climate IQ decision layer.
 * Named for the goddess of the rainbow — the messenger who connects realms.
 *
 * Orchestrates deepwiki-extractor + competitor-surveillance + keyword-intent
 * for market intelligence, regulatory research, and SEO opportunity mapping.
 *
 * Input: { query, mode?: 'market'|'regulatory'|'seo'|'all', domain? }
 * Output: intelligence brief with sources, facts, and actionable insights
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

type IrisMode = 'market' | 'regulatory' | 'seo' | 'all';

export class IrisAgent extends BaseAgent {
  constructor() {
    super({
      name: 'iris',
      description:
        'Research & Market Intelligence — competitor surveillance, regulatory extraction, and SEO keyword analysis for Climate IQ',
      capabilities: [
        'market-intelligence',
        'competitor-surveillance',
        'regulatory-document-extraction',
        'keyword-intent-analysis',
        'industry-trend-analysis',
      ],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'heavy',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');

    const query =
      typeof input.query === 'string' ? input.query : 'EU climate compliance market intelligence';
    const mode: IrisMode = (input.mode as IrisMode) || 'all';
    const domain = typeof input.domain === 'string' ? input.domain : undefined;

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: { query, mode, domain },
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    const tasks: Promise<AgentResponse>[] = [];
    const taskLabels: string[] = [];

    if (mode === 'market' || mode === 'all') {
      tasks.push(
        agentRegistry.executeAgent('competitor-surveillance', context, {
          projectId: context.projectId,
          query,
          domain,
        }),
      );
      taskLabels.push('competitor-surveillance');
    }

    if (mode === 'regulatory' || mode === 'all') {
      tasks.push(
        agentRegistry.executeAgent('deepwiki-extractor', context, {
          query,
          source: domain || 'eu-regulations',
        }),
      );
      taskLabels.push('deepwiki-extractor');
    }

    if (mode === 'seo' || mode === 'all') {
      tasks.push(
        agentRegistry.executeAgent('keyword-intent', context, {
          projectId: context.projectId,
          query,
          industry: (input.industry as string) || 'climate-compliance',
        }),
      );
      taskLabels.push('keyword-intent');
    }

    const results = await Promise.allSettled(tasks);
    const successful = results
      .map((r, i) => ({
        label: taskLabels[i],
        result: r.status === 'fulfilled' ? r.value : null,
        error: r.status === 'rejected' ? (r.reason as Error).message : null,
      }))
      .filter((r) => r.result !== null);

    // LLM synthesis into intelligence brief
    const llmResponse = await this.callLLM(
      `You are Iris, Research Intelligence Agent for Climate IQ. Synthesize this intelligence:

Query: ${query}
Mode: ${mode}

Data gathered:
${successful.map((r) => `[${r.label}]: ${JSON.stringify(r.result?.result)}`).join('\n\n')}

Rules:
- Cite which agent produced each fact
- Distinguish confirmed fact from inference
- Factual only — no speculation about internal competitor decisions
- Extract then interpret: raw signals first, analysis second

Return JSON: {
  "keyFindings": [{"source": "agent-name", "finding": "...", "confidence": "high|medium|low"}],
  "actionableInsights": ["insight1", "insight2"],
  "intelligenceSummary": "2-3 sentence summary"
}`,
    );

    let synthesis = {
      keyFindings: [] as Record<string, unknown>[],
      actionableInsights: [] as string[],
      intelligenceSummary: '',
    };
    try {
      synthesis = { ...synthesis, ...JSON.parse(llmResponse.content) };
    } catch {
      synthesis.intelligenceSummary = llmResponse.content.slice(0, 300);
    }

    const durationMs = Date.now() - startTime;

    const response: AgentResponse = {
      agentName: this.config.name,
      result: {
        query,
        mode,
        intelligenceSummary: synthesis.intelligenceSummary,
        keyFindings: synthesis.keyFindings,
        actionableInsights: synthesis.actionableInsights,
        rawIntelligence: Object.fromEntries(successful.map((r) => [r.label, r.result?.result])),
        sourcesConsulted: successful.map((r) => r.label),
      },
      confidence: successful.length / Math.max(tasks.length, 1),
      reasoning: `Iris gathered intelligence from ${successful.length} sources for query "${query}" in ${mode} mode.`,
      recommendations: (synthesis.actionableInsights as string[]).slice(0, 5),
      metadata: {
        durationMs,
        llmModel: llmResponse.model,
        llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
        delegatedTo: successful.map((r) => r.label),
        findingCount: (synthesis.keyFindings as unknown[]).length,
      },
    };
    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: { query, mode },
      output: response,
      status: 'completed',
      duration_ms: durationMs,
      created_at: new Date().toISOString(),
    });
    return response;
  }
}
