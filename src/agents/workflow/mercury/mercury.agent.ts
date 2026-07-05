/**
 * Mercury — Logistics & Operations Intelligence Agent, Climate IQ
 *
 * Keeps the operational layer moving. Named for the god who crossed every
 * boundary and knew every route — Mercury optimizes supply chains, schedules,
 * and delivery milestones.
 *
 * Orchestrates logistics + quality-gate agents and flags when schedule risk
 * propagates to regulatory compliance deadlines.
 *
 * Input: { projectId, routes?, resources?, milestones?, qualityCheckpoint? }
 * Output: critical path analysis, bottlenecks, delivery forecast, quality status
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

export class MercuryAgent extends BaseAgent {
  constructor() {
    super({
      name: 'mercury',
      description: 'Logistics & Operations Intelligence — supply chain optimization, schedule risk, and quality gate assessment for Climate IQ',
      capabilities: [
        'logistics-optimization',
        'supply-chain-risk',
        'schedule-critical-path',
        'quality-gate-assessment',
        'delivery-milestone-tracking',
      ],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'heavy',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');

    const projectId = typeof input.projectId === 'string' ? input.projectId : context.projectId;
    const qualityCheckpoint = (typeof input.qualityCheckpoint === 'object' && input.qualityCheckpoint !== null) ? input.qualityCheckpoint as Record<string, unknown> : undefined;
    const routes = Array.isArray(input.routes) ? input.routes as Record<string, unknown>[] : undefined;

    await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: { projectId }, output: null, status: 'started', duration_ms: 0, created_at: new Date().toISOString() });

    const tasks: Promise<AgentResponse>[] = [];
    const taskLabels: string[] = [];

    // Logistics optimization
    if (routes || input.origins) {
      // Explicit fields only — no ...input spread (audit fix: prompt injection via arbitrary keys)
      tasks.push(agentRegistry.executeAgent('logistics', context, {
        projectId,
        routes: routes || [],
        origins: typeof input.origins === 'object' ? input.origins : undefined,
        destinations: typeof input.destinations === 'object' ? input.destinations : undefined,
        cargoWeight: typeof input.cargoWeight === 'number' ? input.cargoWeight : undefined,
        deadline: typeof input.deadline === 'string' ? input.deadline : undefined,
      }));
      taskLabels.push('logistics');
    }

    // Quality gate check
    if (qualityCheckpoint) {
      tasks.push(agentRegistry.executeAgent('quality-gate', context, {
        projectId,
        checkpointType: typeof qualityCheckpoint.checkpointType === 'string' ? qualityCheckpoint.checkpointType : undefined,
        criteria: typeof qualityCheckpoint.criteria === 'object' ? qualityCheckpoint.criteria : undefined,
        thresholds: typeof qualityCheckpoint.thresholds === 'object' ? qualityCheckpoint.thresholds : undefined,
      }));
      taskLabels.push('quality-gate');
    }

    // Schedule assessment via schedule-genius
    if (input.tasks || input.milestones) {
      tasks.push(agentRegistry.executeAgent('schedule-genius', context, {
        projectId,
        tasks: Array.isArray(input.tasks) ? input.tasks : undefined,
        milestones: Array.isArray(input.milestones) ? input.milestones : undefined,
        resources: typeof input.resources === 'object' ? input.resources : undefined,
      }));
      taskLabels.push('schedule-genius');
    }

    // Default: run logistics with minimal safe fields
    if (tasks.length === 0) {
      tasks.push(agentRegistry.executeAgent('logistics', context, {
        projectId,
        routes: typeof input.routes === 'object' ? input.routes : [],
      }));
      taskLabels.push('logistics');
    }

    const results = await Promise.allSettled(tasks);
    const successful = results
      .map((r, i) => ({
        label: taskLabels[i],
        result: r.status === 'fulfilled' ? r.value : null,
      }))
      .filter((r) => r.result !== null);

    const llmResponse = await this.callLLM(
      `You are Mercury, Logistics & Operations Intelligence for Climate IQ.

Project: ${projectId}
Operational data:
${successful.map((r) => `[${r.label}]: ${JSON.stringify(r.result?.result)}`).join('\n\n')}

Rules:
- Express risk in concrete units (days, EUR, tonnes)
- Identify the critical path — not every delay matters equally
- Distinguish reversible from irreversible delays
- Propose alternatives, not just problems
- Flag when schedule risk hits a regulatory compliance deadline

Return JSON: {
  "criticalPath": "description of the critical constraint",
  "deliveryForecast": "on-track|at-risk|delayed",
  "delayDays": 0,
  "bottlenecks": ["bottleneck1"],
  "alternatives": ["alternative1"],
  "operationalBriefing": "2-sentence ops briefing"
}`,
    );

    let synthesis = {
      criticalPath: '',
      deliveryForecast: 'unknown',
      delayDays: 0,
      bottlenecks: [] as string[],
      alternatives: [] as string[],
      operationalBriefing: '',
    };
    try {
      synthesis = { ...synthesis, ...JSON.parse(llmResponse.content) };
    } catch {
      synthesis.operationalBriefing = llmResponse.content.slice(0, 300);
    }

    const durationMs = Date.now() - startTime;

    return {
      agentName: this.config.name,
      result: {
        projectId,
        criticalPath: synthesis.criticalPath,
        deliveryForecast: synthesis.deliveryForecast,
        delayDays: synthesis.delayDays,
        bottlenecks: synthesis.bottlenecks,
        alternatives: synthesis.alternatives,
        operationalBriefing: synthesis.operationalBriefing,
        logistics: successful.find((r) => r.label === 'logistics')?.result?.result || null,
        qualityGate: successful.find((r) => r.label === 'quality-gate')?.result?.result || null,
        schedule: successful.find((r) => r.label === 'schedule-genius')?.result?.result || null,
      },
      confidence: successful.length / Math.max(tasks.length, 1),
      reasoning: `Mercury assessed ${successful.length} operational dimensions for project ${projectId}. Delivery forecast: ${synthesis.deliveryForecast}. Delay: ${synthesis.delayDays} days.`,
      recommendations: [
        ...(synthesis.alternatives as string[]),
        ...(synthesis.bottlenecks as string[]).map((b) => `Resolve bottleneck: ${b}`),
      ].slice(0, 5),
      metadata: {
        durationMs,
        llmModel: llmResponse.model,
        llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
        delegatedTo: successful.map((r) => r.label),
      },
    };
  }
}
