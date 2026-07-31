/**
 * Athena — Compliance Intelligence Agent, Climate IQ
 *
 * EU regulatory compliance oracle. Wraps the core compliance + emissions
 * agents and adds deadline-first reasoning and actionable gap prioritization.
 *
 * Athena knows EU climate law the way a specialist attorney knows case law:
 * deeply, precisely, without hedging.
 *
 * Input: { industry, regulations?, annualEmissions?, importValue?, currentMeasures? }
 * Output: compliance status, deadline urgency, gaps ranked by severity
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

// Athena soul prompt — injected via agent context, not used as a local const.
// const SOUL = `You are Athena, Compliance Intelligence Officer of Climate IQ.
//
// You assess EU regulatory compliance with surgical precision. Your output always leads with deadline urgency.
//
// Rules:
// - State the specific regulation and article, not just the topic
// - Urgency order: overdue > urgent (≤90 days) > approaching (≤365 days) > comfortable
// - Scope first: does this regulation apply before assessing gaps
// - Give the specific action, not "consult a lawyer"
// - When deterministic scoring and LLM analysis diverge, flag it
//
// Respond with JSON: { deadlineSummary, criticalGaps, prioritizedActions, riskNarrative }`;

export class AthenaAgent extends BaseAgent {
  constructor() {
    super({
      name: 'athena',
      description:
        'Compliance Intelligence — deadline-first EU regulatory assessment (ETS, CBAM, CSRD, Fit for 55, EU AI Act) for Climate IQ',
      capabilities: [
        'eu-compliance-assessment',
        'regulatory-deadline-tracking',
        'compliance-gap-prioritization',
        'ets-cbam-csrd-analysis',
        'eu-ai-act-article-12',
      ],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'heavy',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');

    const industry = (input.industry as string) || 'manufacturing';
    const regulations = (input.regulations as string[]) || ['fit-for-55', 'ets', 'cbam', 'csrd'];
    const annualEmissions = (input.annualEmissions as number) || 0;
    const importValue = (input.importValue as number) || 0;
    const currentMeasures = (input.currentMeasures as Record<string, boolean>) || {
      carbonReporting: false,
      emissionsMonitoring: false,
      supplyChainDueDiligence: false,
      aiSystemLogging: false,
    };

    // Delegate to core compliance agent for deterministic scoring
    const complianceResult = await agentRegistry.executeAgent('compliance', context, {
      projectId: context.projectId,
      industry,
      regulations,
      currentMeasures,
      annualEmissions,
      importValue,
    });

    // Delegate to emissions analyst for data enrichment if emissions data provided
    let emissionsResult: AgentResponse | null = null;
    if (annualEmissions > 0) {
      try {
        emissionsResult = await agentRegistry.executeAgent('emissions-data-analyst', context, {
          projectId: context.projectId,
          industry,
          annualEmissions,
          reportingYear: new Date().getFullYear() - 1,
        });
      } catch {
        // Non-critical — continue without emissions enrichment
      }
    }

    // LLM synthesis: deadline-first narrative
    const complianceData = complianceResult.result;
    const llmResponse = await this.callLLM(
      `You are Athena. Synthesize this compliance assessment into a deadline-first briefing.
Industry: ${industry}
Overall score: ${complianceData.overallScore}/100
Status: ${complianceData.complianceStatus}
Deadlines: ${JSON.stringify(complianceData.deadlines)}
Gaps: ${JSON.stringify(complianceData.gaps)}
${emissionsResult ? `Emissions analysis: ${JSON.stringify(emissionsResult.result)}` : ''}

Return JSON: {
  "deadlineSummary": "Most urgent deadline in 1-2 sentences",
  "criticalGaps": ["gap1", "gap2"],
  "prioritizedActions": ["action1", "action2", "action3"],
  "riskNarrative": "2-sentence risk narrative for a CFO or compliance officer"
}`,
    );

    let synthesis = {
      deadlineSummary: '',
      criticalGaps: [] as string[],
      prioritizedActions: [] as string[],
      riskNarrative: '',
    };
    try {
      synthesis = { ...synthesis, ...JSON.parse(llmResponse.content) };
    } catch {
      synthesis.riskNarrative = llmResponse.content.slice(0, 300);
    }

    const durationMs = Date.now() - startTime;
    const gaps =
      (complianceData.gaps as Array<{ gap: string; severity: string; regulation: string }>) || [];
    const deadlines =
      (complianceData.deadlines as Array<{
        regulation: string;
        daysRemaining: number;
        urgency: string;
      }>) || [];

    return {
      agentName: this.config.name,
      result: {
        industry,
        overallScore: complianceData.overallScore,
        complianceStatus: complianceData.complianceStatus,
        deadlineSummary: synthesis.deadlineSummary,
        criticalGaps: synthesis.criticalGaps,
        prioritizedActions: synthesis.prioritizedActions,
        riskNarrative: synthesis.riskNarrative,
        deadlines,
        gaps,
        regulationScores: complianceData.regulationScores,
        thresholds: complianceData.thresholds,
        emissionsEnrichment: emissionsResult?.result || null,
      },
      confidence: complianceResult.confidence,
      reasoning: `Athena assessed ${regulations.length} regulations for ${industry}. Score: ${complianceData.overallScore}/100. ${gaps.filter((g) => g.severity === 'critical').length} critical gaps. Most urgent deadline: ${deadlines.find((d) => d.urgency === 'overdue' || d.urgency === 'urgent')?.regulation || 'none overdue'}.`,
      recommendations: [
        ...(synthesis.prioritizedActions as string[]),
        ...complianceResult.recommendations,
      ].slice(0, 6),
      metadata: {
        durationMs,
        llmModel: llmResponse.model,
        llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
        delegatedTo: emissionsResult ? ['compliance', 'emissions-data-analyst'] : ['compliance'],
      },
    };
  }
}
