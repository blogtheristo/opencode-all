/**
 * Neptune — Maritime & Shipping Industry Agent, Climate IQ
 *
 * Roman god of the sea. Neptune was watching when the EU added shipping
 * to ETS in 2024. He had thoughts. He still has them.
 *
 * Input: { vesselCount?, annualEmissions, shippingRoutes?, fuelType? }
 * Output: maritime ETS compliance, FuelEU status, MRV reporting obligations
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

const SOUL = `You are Neptune, Maritime & Shipping Industry Specialist for Climate IQ.

Shipping joined EU ETS in 2024. The sea is no longer exempt.
- ETS shipping phase-in: 40% of verified emissions in 2024, 70% in 2025, 100% from 2026
- FuelEU Maritime: GHG intensity reduction 2% by 2025, 6% by 2030 (from 2020 baseline)
- MRV: ships >5,000 GT must monitor and report CO2 per voyage and per year
- EU-ETS: applies to voyages between EU ports AND 50% of intra/extra EU voyages

Tone: tidal — patient but inevitable. The regulation came. Ships must comply.
Output as JSON: { etsPhaseInExposure, fuelEuStatus, mrvObligations, prioritizedActions, riskSummary }`;

export class NeptuneAgent extends BaseAgent {
  constructor() {
    super({
      name: 'neptune',
      description: 'Maritime & Shipping Industry Specialist — EU ETS shipping inclusion, FuelEU Maritime, MRV reporting obligations for Climate IQ',
      capabilities: ['maritime-ets-compliance', 'fueleu-maritime', 'mrv-shipping', 'maritime-decarbonization'],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');
    const annualEmissions = typeof input.annualEmissions === 'number' ? input.annualEmissions : 0;
    const vesselCount = typeof input.vesselCount === 'number' ? input.vesselCount : null;
    const fuelType = typeof input.fuelType === 'string' ? input.fuelType : 'HFO';
    const currentMeasures = (typeof input.currentMeasures === 'object' && input.currentMeasures !== null)
      ? input.currentMeasures as Record<string, boolean>
      : { carbonReporting: false, emissionsMonitoring: false, supplyChainDueDiligence: false, aiSystemLogging: false };

    await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: { annualEmissions, vesselCount, fuelType }, output: null, status: 'started', duration_ms: 0, created_at: new Date().toISOString() });

    let complianceResult: AgentResponse | null;
    try {
      complianceResult = await agentRegistry.executeAgent('compliance', context, {
        projectId: context.projectId,
        industry: 'transport',
        regulations: ['ets', 'fit-for-55', 'csrd'],
        currentMeasures,
        annualEmissions,
        importValue: 0,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: {}, output: null, status: 'error', error_message: msg, duration_ms: Date.now() - startTime, created_at: new Date().toISOString() });
      throw err;
    }

    const currentYear = new Date().getFullYear();
    const etsPhaseInPct = currentYear >= 2026 ? 100 : currentYear === 2025 ? 70 : 40;

    const llmResult = await this.callLLM(
      `${SOUL}

Maritime client data:
- Annual emissions: ${annualEmissions.toLocaleString()} tCO2e
- Vessel count: ${vesselCount ?? 'not provided'}
- Primary fuel: ${fuelType}
- ETS phase-in this year: ${etsPhaseInPct}% of verified emissions must be surrendered
- Compliance score: ${complianceResult?.result?.overallScore ?? 'n/a'}/100

Return JSON: { "etsPhaseInExposure", "fuelEuStatus", "mrvObligations", "prioritizedActions": [], "riskSummary" }`,
    );

    let synthesis = { etsPhaseInExposure: '', fuelEuStatus: '', mrvObligations: '', prioritizedActions: [] as string[], riskSummary: '' };
    try { synthesis = { ...synthesis, ...JSON.parse(llmResult.content) }; } catch { synthesis.riskSummary = llmResult.content.slice(0, 200); }

    const durationMs = Date.now() - startTime;
    const response: AgentResponse = {
      agentName: this.config.name,
      result: { annualEmissions, vesselCount, fuelType, etsPhaseInPct, ...synthesis, baseCompliance: complianceResult?.result ?? null },
      confidence: complianceResult ? complianceResult.confidence : 0.55,
      reasoning: `Neptune assessed maritime sector. ETS phase-in: ${etsPhaseInPct}%. Fuel: ${fuelType}.`,
      recommendations: synthesis.prioritizedActions,
      metadata: { durationMs, llmModel: llmResult.model, llmTokens: llmResult.inputTokens + llmResult.outputTokens },
    };

    await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: { annualEmissions }, output: response, status: 'completed', duration_ms: durationMs, created_at: new Date().toISOString() });
    return response;
  }
}
