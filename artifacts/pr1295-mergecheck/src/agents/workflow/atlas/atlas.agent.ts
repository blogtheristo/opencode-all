/**
 * Atlas — Chief of Staff Agent, Climate IQ
 *
 * Orchestrating intelligence that routes requests, synthesizes multi-agent
 * outputs, and surfaces the most urgent finding for the human operator.
 *
 * Atlas is the entry point for complex requests that require delegation to
 * multiple specialist agents. He uses the agentic loop + delegate_to_agent
 * tool to route, collect, and synthesize.
 *
 * Input: { query: string, context?: string, agents?: string[] }
 * Output: executive briefing with findings ranked by urgency
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';
import type { ToolDefinition } from '../../types.js';

const SOUL = `You are Atlas, the Chief of Staff of Climate IQ — an EU industrial climate intelligence platform.

Your job is synthesis and routing. You do not specialize in any single domain. You:
1. Identify what type of intelligence is needed (compliance, field, logistics, market, content)
2. Delegate to the correct specialist agent using delegate_to_agent
3. Synthesize the results into a concise executive briefing (≤5 bullet points)
4. Lead with the most urgent finding

Rules:
- Never speculate. Delegate and report what comes back.
- Always cite which agent produced each data point.
- Flag low confidence explicitly.
- Use the agentic loop: observe → think → delegate → synthesize.`;

const ATLAS_TOOLS: ToolDefinition[] = [
  {
    name: 'summarize_findings',
    description: 'Compile multi-agent findings into an executive briefing ranked by urgency',
    parameters: {
      type: 'object',
      properties: {
        findings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              agent: { type: 'string', description: 'Agent name that produced this finding' },
              urgency: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
              finding: { type: 'string' },
              recommendation: { type: 'string' },
            },
            required: ['agent', 'urgency', 'finding'],
          },
        },
        summary: { type: 'string', description: 'One-sentence executive summary' },
      },
      required: ['findings', 'summary'],
    },
  },
];

export class AtlasAgent extends BaseAgent {
  constructor() {
    super({
      name: 'atlas',
      description: 'Chief of Staff — routes requests, orchestrates multi-agent workflows, and synthesizes executive briefings for Climate IQ',
      capabilities: [
        'workflow-orchestration',
        'multi-agent-synthesis',
        'executive-briefing',
        'request-routing',
        'risk-triage',
      ],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'heavy',
      loop: {
        maxIterations: 8,
        allowDelegation: true,
        logIterations: true,
      },
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    const query = typeof input.query === 'string' ? input.query : 'Provide a general Climate IQ status briefing';
    const agentHints = Array.isArray(input.agents) ? (input.agents as string[]) : [];

    await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: { query, agentHints }, output: null, status: 'started', duration_ms: 0, created_at: new Date().toISOString() });

    const userMessage = agentHints.length > 0
      ? `Query: ${query}\n\nSuggested agents to consult: ${agentHints.join(', ')}`
      : `Query: ${query}`;

    const loopResult = await this.runLoop(
      context,
      SOUL,
      userMessage,
      ATLAS_TOOLS,
    );

    // Parse findings from loop result
    let findings: Array<{ agent: string; urgency: string; finding: string; recommendation?: string }> = [];
    let summary = '';
    try {
      const parsed = JSON.parse(loopResult.content);
      if (parsed.findings) findings = parsed.findings;
      if (parsed.summary) summary = parsed.summary;
    } catch {
      summary = loopResult.content.slice(0, 200);
    }

    const sorted = findings.sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return (order[a.urgency as keyof typeof order] ?? 3) - (order[b.urgency as keyof typeof order] ?? 3);
    });

    const durationMs = Date.now() - startTime;
    const response: AgentResponse = {
      agentName: this.config.name,
      result: {
        summary,
        findings: sorted,
        agentsConsulted: loopResult.iterations
          .filter((i) => i.phase === 'act')
          .flatMap((i) => (i.actions || []).map((a) => a.name)),
        iterationCount: loopResult.iterations.length,
      },
      confidence: findings.length > 0 ? 0.85 : 0.5,
      reasoning: `Atlas synthesized ${findings.length} findings across ${loopResult.iterations.length} reasoning iterations. ${loopResult.totalTokens.input + loopResult.totalTokens.output} tokens used.`,
      recommendations: sorted
        .filter((f) => f.recommendation)
        .map((f) => `[${f.agent}] ${f.recommendation}`),
      metadata: {
        durationMs,
        llmModel: loopResult.model,
        llmTokens: loopResult.totalTokens.input + loopResult.totalTokens.output,
        findingCount: findings.length,
      },
    };

    await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: { query }, output: response, status: 'completed', duration_ms: durationMs, created_at: new Date().toISOString() });
    return response;
  }
}
