/**
 * Hephaestus — Field & Site Intelligence Agent, Climate IQ
 *
 * Reads the physical world: site safety, material carbon, schedule risk.
 * Named for the god of the forge — the maker who works in physical reality.
 *
 * Orchestrates sitesense + material-oracle + schedule-genius in parallel,
 * then synthesizes a unified field intelligence report.
 *
 * Input: { siteId, metrics?, materials?, scheduleData? }
 * Output: field risk score, safety status, carbon assessment, schedule pressure
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

export class HephaestusAgent extends BaseAgent {
  constructor() {
    super({
      name: 'hephaestus',
      description: 'Field & Site Intelligence — parallel assessment of site safety, material carbon, and schedule risk for Climate IQ',
      capabilities: [
        'site-safety-assessment',
        'material-carbon-analysis',
        'schedule-risk-quantification',
        'construction-field-intelligence',
        'en-13001-crane-safety',
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

    const siteId = (input.siteId as string) || context.projectId;
    const metrics = input.metrics as Record<string, number> | undefined;
    const materials = input.materials as Record<string, unknown>[] | undefined;
    const scheduleData = input.scheduleData as Record<string, unknown> | undefined;

    // Run parallel assessments for available data
    const tasks: Promise<AgentResponse>[] = [];
    const taskLabels: string[] = [];

    if (metrics) {
      tasks.push(agentRegistry.executeAgent('sitesense', context, { siteId, metrics }));
      taskLabels.push('sitesense');
    }

    if (materials) {
      tasks.push(agentRegistry.executeAgent('material-oracle', context, {
        projectId: context.projectId,
        materials,
      }));
      taskLabels.push('material-oracle');
    }

    if (scheduleData) {
      tasks.push(agentRegistry.executeAgent('schedule-genius', context, {
        projectId: context.projectId,
        ...scheduleData,
      }));
      taskLabels.push('schedule-genius');
    }

    // If no specific data provided, run sitesense with defaults for status check
    if (tasks.length === 0) {
      tasks.push(agentRegistry.executeAgent('sitesense', context, {
        siteId,
        metrics: { temperature: 15, humidity: 55, windSpeed: 5, workers: 10, incidents: 0 },
      }));
      taskLabels.push('sitesense');
    }

    const results = await Promise.allSettled(tasks);
    const successful = results
      .map((r, i) => ({ label: taskLabels[i], result: r.status === 'fulfilled' ? r.value : null }))
      .filter((r) => r.result !== null);

    // Index by label for O(1) result extraction.
    const successfulByLabel = new Map(successful.map((r) => [r.label, r]));

    // Extract key metrics from results
    const sitesenseResult = successfulByLabel.get('sitesense')?.result;
    const materialResult = successfulByLabel.get('material-oracle')?.result;
    const scheduleResult = successfulByLabel.get('schedule-genius')?.result;

    // Synthesize field risk narrative via LLM
    const llmResponse = await this.callLLM(
      `You are Hephaestus, Field Intelligence Agent for Climate IQ. Synthesize this field data:

Site: ${siteId}
Safety data: ${sitesenseResult ? JSON.stringify(sitesenseResult.result) : 'not assessed'}
Material carbon: ${materialResult ? JSON.stringify(materialResult.result) : 'not assessed'}
Schedule: ${scheduleResult ? JSON.stringify(scheduleResult.result) : 'not assessed'}

Rules:
- Lead with any shutdown-threshold violations
- Score overall field risk 0-100
- Cite EN 13001 for crane/wind violations, EN 15978 for carbon methodology

Return JSON: {
  "overallFieldRisk": 0-100,
  "immediateActions": ["action1"],
  "safetyStatus": "safe|caution|danger|shutdown",
  "fieldNarrative": "2-sentence field briefing"
}`,
    );

    let synthesis = { overallFieldRisk: 50, immediateActions: [] as string[], safetyStatus: 'caution', fieldNarrative: '' };
    try {
      synthesis = { ...synthesis, ...JSON.parse(llmResponse.content) };
    } catch {
      synthesis.fieldNarrative = llmResponse.content.slice(0, 300);
    }

    const durationMs = Date.now() - startTime;

    return {
      agentName: this.config.name,
      result: {
        siteId,
        overallFieldRisk: synthesis.overallFieldRisk,
        safetyStatus: synthesis.safetyStatus,
        fieldNarrative: synthesis.fieldNarrative,
        immediateActions: synthesis.immediateActions,
        siteSafety: sitesenseResult?.result || null,
        materialCarbon: materialResult?.result || null,
        scheduleRisk: scheduleResult?.result || null,
        assessmentsRun: successful.map((r) => r.label),
      },
      confidence: successful.length / Math.max(tasks.length, 1),
      reasoning: `Hephaestus ran ${successful.length}/${tasks.length} field assessments for site ${siteId}. Overall field risk: ${synthesis.overallFieldRisk}/100. Safety status: ${synthesis.safetyStatus}.`,
      recommendations: (synthesis.immediateActions as string[]).concat(
        sitesenseResult?.recommendations || [],
      ).slice(0, 5),
      metadata: {
        durationMs,
        llmModel: llmResponse.model,
        llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
        delegatedTo: successful.map((r) => r.label),
        parallelAssessments: tasks.length,
      },
    };
  }
}
