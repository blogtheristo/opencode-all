/**
 * Gaia — Cement & Earth Materials Industry Agent, Climate IQ
 *
 * Greek goddess of the Earth. Cement is 8% of global CO2 and entirely
 * Gaia's domain. She doesn't enjoy it. But she handles it with geological
 * patience and zero tolerance for greenwashing via clinker ratio games.
 *
 * Input: { annualEmissions, clinkerRatioPct?, importValue, cementType? }
 * Output: CBAM cement compliance, clinker substitution analysis, ETS exposure
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

const SOUL = `You are Gaia, Cement & Earth Materials Industry Specialist for Climate IQ.

Cement is unavoidable and carbon-intensive. Every tonne matters:
- CBAM: cement is a core product group — clinker (2523 10 00) and cement (2523 29 00, 2523 90 00)
- ETS: cement installations get declining free allowances — benchmark is 766 tCO2/t clinker
- Clinker ratio: every 1% reduction in clinker substitution = ~7.7 kg CO2 saved per tonne of cement
- CSRD: cement companies must report Scope 1 process emissions (calcination = 60% of cement CO2)
- Low-carbon routes: GGBS, fly ash, calcined clay (LC³) as clinker substitutes

Note: calcination CO2 (process emissions from CaCO3 → CaO) is unavoidable with current technology.
Carbon capture is the only long-term solution. Gaia has opinions about timelines.

Tone: ancient and unsparing. The Earth does not negotiate with limestone.
Output as JSON: { cbamCementScope, etsClikerBenchmark, clinkerSubstitutionPotential, prioritizedActions, riskSummary }`;

export class GaiaAgent extends BaseAgent {
  constructor() {
    super({
      name: 'gaia',
      description: 'Cement & Earth Materials Industry Specialist — CBAM cement, ETS clinker benchmark, clinker substitution pathways for Climate IQ',
      capabilities: ['cbam-cement', 'ets-cement-benchmark', 'clinker-substitution', 'cement-csrd', 'low-carbon-cement'],
      model: 'claude-haiku-4-5-20251001',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');
    const annualEmissions = typeof input.annualEmissions === 'number' ? input.annualEmissions : 0;
    const importValue = typeof input.importValue === 'number' ? input.importValue : 0;
    const clinkerRatioPct = typeof input.clinkerRatioPct === 'number' ? input.clinkerRatioPct : null;
    const annualProduction = typeof input.annualProduction === 'number' ? input.annualProduction : 0;
    const cementType = typeof input.cementType === 'string' ? input.cementType : 'CEM I';
    const currentMeasures = (typeof input.currentMeasures === 'object' && input.currentMeasures !== null)
      ? input.currentMeasures as Record<string, boolean>
      : { carbonReporting: false, emissionsMonitoring: false, supplyChainDueDiligence: false, aiSystemLogging: false };

    await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: { annualEmissions, importValue, clinkerRatioPct }, output: null, status: 'started', duration_ms: 0, created_at: new Date().toISOString() });

    let complianceResult: AgentResponse | null = null;
    try {
      complianceResult = await agentRegistry.executeAgent('compliance', context, {
        projectId: context.projectId,
        industry: 'cement',
        regulations: ['ets', 'cbam', 'csrd'],
        currentMeasures,
        annualEmissions,
        importValue,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: {}, output: null, status: 'error', error_message: msg, duration_ms: Date.now() - startTime, created_at: new Date().toISOString() });
      throw err;
    }

    const ETS_CLINKER_BENCHMARK = 766; // tCO2/1000t clinker
    const carbonSavingPerPctClikerReduction = annualProduction > 0 ? (annualProduction * 0.077) : null;

    const llmResult = await this.callLLM(
      `${SOUL}

Cement client data:
- Cement type: ${cementType}
- Annual production: ${annualProduction > 0 ? `${annualProduction.toLocaleString()} tonnes` : 'not provided'}
- Clinker ratio: ${clinkerRatioPct !== null ? `${clinkerRatioPct}%` : 'not provided'}
- Annual emissions: ${annualEmissions.toLocaleString()} tCO2e
- Import value: EUR ${importValue.toLocaleString()}
- ETS clinker benchmark: ${ETS_CLINKER_BENCHMARK} tCO2/1000t
- Carbon saving per 1% clinker reduction: ${carbonSavingPerPctClikerReduction ? `${carbonSavingPerPctClikerReduction.toLocaleString()} tCO2` : 'calculate from production volume'}
- Compliance score: ${complianceResult?.result?.overallScore ?? 'n/a'}/100

Return JSON: { "cbamCementScope", "etsClikerBenchmark", "clinkerSubstitutionPotential", "prioritizedActions": [], "riskSummary" }`,
    );

    let synthesis = { cbamCementScope: '', etsClikerBenchmark: '', clinkerSubstitutionPotential: '', prioritizedActions: [] as string[], riskSummary: '' };
    try { synthesis = JSON.parse(llmResult.content); } catch { synthesis.riskSummary = llmResult.content.slice(0, 200); }

    const durationMs = Date.now() - startTime;
    const response: AgentResponse = {
      agentName: this.config.name,
      result: { cementType, clinkerRatioPct, annualProduction, carbonSavingPerPctClikerReduction, etsBenchmark: ETS_CLINKER_BENCHMARK, ...synthesis, baseCompliance: complianceResult?.result ?? null },
      confidence: complianceResult ? complianceResult.confidence : 0.55,
      reasoning: `Gaia assessed cement sector. Type: ${cementType}. Clinker ratio: ${clinkerRatioPct ?? 'unknown'}%. ETS benchmark: ${ETS_CLINKER_BENCHMARK} tCO2/1000t.`,
      recommendations: synthesis.prioritizedActions,
      metadata: { durationMs, llmModel: llmResult.model, llmTokens: llmResult.inputTokens + llmResult.outputTokens },
    };

    await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: { annualEmissions }, output: response, status: 'completed', duration_ms: durationMs, created_at: new Date().toISOString() });
    return response;
  }
}
