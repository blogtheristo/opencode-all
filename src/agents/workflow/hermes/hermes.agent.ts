/**
 * Hermes — Logistics & Operations Intelligence Agent, Climate IQ
 *
 * Keeps the operational layer moving. Named for the god who crossed every
 * boundary and knew every route — Hermes optimizes supply chains, schedules,
 * and delivery milestones.
 *
 * Orchestrates logistics + quality-gate agents and flags when schedule risk
 * propagates to regulatory compliance deadlines.
 *
 * Input: { projectId, routes?, resources?, milestones?, qualityCheckpoint? }
 * Output: critical path analysis, bottlenecks, delivery forecast, quality status
 */

import { BaseAgent } from '../../base.agent.js';
import { agentRegistry } from '../../index.js';
import type { AgentContext, AgentResponse } from '../../types.js';

export class HermesAgent extends BaseAgent {
  constructor() {
    super({
      name: 'hermes',
      description: 'Logistics & Operations Intelligence — supply chain optimization, schedule risk, and quality gate assessment for Climate IQ',
      capabilities: [
        'logistics-optimization',
        'supply-chain-risk',
        'schedule-critical-path',
        'quality-gate-assessment',
        'delivery-milestone-tracking',
      ],
      model: 'claude-haiku-4-5-20251001',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    const projectId = (input.projectId as string) || context.projectId;
    const qualityCheckpoint = input.qualityCheckpoint as Record<string, unknown> | undefined;
    const routes = input.routes as Record<string, unknown>[] | undefined;

    const tasks: Promise<AgentResponse>[] = [];
    const taskLabels: string[] = [];

    // Logistics optimization
    if (routes || input.origins) {
      tasks.push(agentRegistry.executeAgent('logistics', context, {
        projectId,
        routes: routes || [],
        ...input,
      }));
      taskLabels.push('logistics');
    }

    // Quality gate check
    if (qualityCheckpoint) {
      tasks.push(agentRegistry.executeAgent('quality-gate', context, {
        projectId,
        ...qualityCheckpoint,
      }));
      taskLabels.push('quality-gate');
    }

    // Schedule assessment via schedule-genius
    if (input.tasks || input.milestones) {
      tasks.push(agentRegistry.executeAgent('schedule-genius', context, {
        projectId,
        tasks: input.tasks,
        milestones: input.milestones,
        resources: input.resources,
      }));
      taskLabels.push('schedule-genius');
    }

    // Default: run logistics with available input
    if (tasks.length === 0) {
      tasks.push(agentRegistry.executeAgent('logistics', context, { projectId, ...input }));
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
      `You are Hermes, Logistics & Operations Intelligence for Climate IQ.

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
      bottlenecks: [],
      alternatives: [],
      operationalBriefing: '',
    };
    try {
      synthesis = JSON.parse(llmResponse.content);
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
      reasoning: `Hermes assessed ${successful.length} operational dimensions for project ${projectId}. Delivery forecast: ${synthesis.deliveryForecast}. Delay: ${synthesis.delayDays} days.`,
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
