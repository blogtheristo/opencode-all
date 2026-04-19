/**
 * Mars — Construction & Buildings Industry Agent, Climate IQ
 *
 * Roman god of war and strength. Construction is the battlefield where
 * whole-life carbon, EPBD recast, and CSRD all converge. Mars charges.
 *
 * Input: { buildingType?, floorArea?, operationalEmissions?, embodiedCarbon? }
 * Output: EPBD compliance, whole-life carbon, Taxonomy alignment, retrofit urgency
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

const SOUL = `You are Mars, Construction & Buildings Industry Specialist for Climate IQ.

Buildings are 40% of EU energy consumption and 36% of CO2 emissions. Mars knows every front:
- EPBD recast 2024: all new buildings zero-emission from 2028; existing buildings EPC class E by 2030, D by 2033
- EU Taxonomy: buildings must meet DNSH criteria — operational AND embodied carbon thresholds
- CSRD: construction companies must disclose Scope 1/2/3 including Scope 3 Cat. 11 (use of sold products)
- Whole-life carbon: EN 15978 methodology — A1-A5 (construction) + B6 (operational) + C1-C4 (end of life)
- CPR: Construction Products Regulation — EPDs mandatory for structural products from 2026

No retreat. Every square metre counts.
Output as JSON: { epdCompliance, taxonomyAlignmentGap, retrofitUrgency, prioritizedActions, riskSummary }`;

export class MarsAgent extends BaseAgent {
  constructor() {
    super({
      name: 'mars',
      description: 'Construction & Buildings Industry Specialist — EPBD recast, whole-life carbon (EN 15978), EU Taxonomy buildings criteria for Climate IQ',
      capabilities: ['epbd-compliance', 'whole-life-carbon-en15978', 'eu-taxonomy-buildings', 'construction-csrd', 'retrofit-assessment'],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');
    const annualEmissions = typeof input.annualEmissions === 'number' ? input.annualEmissions : 0;
    const buildingType = typeof input.buildingType === 'string' ? input.buildingType : 'commercial';
    const floorAreaM2 = typeof input.floorAreaM2 === 'number' ? input.floorAreaM2 : null;
    const epcRating = typeof input.epcRating === 'string' ? input.epcRating : null;
    const embodiedCarbonKgCo2m2 = typeof input.embodiedCarbonKgCo2m2 === 'number' ? input.embodiedCarbonKgCo2m2 : null;
    const currentMeasures = (typeof input.currentMeasures === 'object' && input.currentMeasures !== null)
      ? input.currentMeasures as Record<string, boolean>
      : { carbonReporting: false, emissionsMonitoring: false, supplyChainDueDiligence: false, aiSystemLogging: false };

    await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: { annualEmissions, buildingType, floorAreaM2 }, output: null, status: 'started', duration_ms: 0, created_at: new Date().toISOString() });

    let complianceResult: AgentResponse | null = null;
    try {
      complianceResult = await agentRegistry.executeAgent('compliance', context, {
        projectId: context.projectId,
        industry: 'construction',
        regulations: ['fit-for-55', 'csrd'],
        currentMeasures,
        annualEmissions,
        importValue: 0,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: {}, output: null, status: 'error', error_message: msg, duration_ms: Date.now() - startTime, created_at: new Date().toISOString() });
      throw err;
    }

    const EPBD_CLASS_E_DEADLINE = '2030-12-31';
    const EPBD_CLASS_D_DEADLINE = '2033-12-31';
    const epcAtRisk = epcRating && ['F', 'G'].includes(epcRating.toUpperCase());

    const llmResult = await this.callLLM(
      `${SOUL}

Construction/buildings client data:
- Building type: ${buildingType}
- Floor area: ${floorAreaM2 ? `${floorAreaM2.toLocaleString()} m²` : 'not provided'}
- EPC rating: ${epcRating ?? 'not provided'} (EPC class E required by ${EPBD_CLASS_E_DEADLINE}, D by ${EPBD_CLASS_D_DEADLINE})
- EPC at retrofit risk: ${epcAtRisk ?? 'unknown'}
- Embodied carbon: ${embodiedCarbonKgCo2m2 ? `${embodiedCarbonKgCo2m2} kgCO2e/m²` : 'not provided'}
- Annual operational emissions: ${annualEmissions.toLocaleString()} tCO2e
- Compliance score: ${complianceResult?.result?.overallScore ?? 'n/a'}/100

Return JSON: { "epdCompliance", "taxonomyAlignmentGap", "retrofitUrgency", "prioritizedActions": [], "riskSummary" }`,
    );

    let synthesis = { epdCompliance: '', taxonomyAlignmentGap: '', retrofitUrgency: '', prioritizedActions: [] as string[], riskSummary: '' };
    try { synthesis = { ...synthesis, ...JSON.parse(llmResult.content) }; } catch { synthesis.riskSummary = llmResult.content.slice(0, 200); }

    const durationMs = Date.now() - startTime;
    const response: AgentResponse = {
      agentName: this.config.name,
      result: { buildingType, floorAreaM2, epcRating, epcAtRisk, embodiedCarbonKgCo2m2, ...synthesis, baseCompliance: complianceResult?.result ?? null },
      confidence: complianceResult ? complianceResult.confidence : 0.55,
      reasoning: `Mars assessed construction/buildings sector. Building type: ${buildingType}. EPC: ${epcRating ?? 'unknown'}. At retrofit risk: ${epcAtRisk}.`,
      recommendations: synthesis.prioritizedActions,
      metadata: { durationMs, llmModel: llmResult.model, llmTokens: llmResult.inputTokens + llmResult.outputTokens },
    };

    await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: { annualEmissions }, output: response, status: 'completed', duration_ms: durationMs, created_at: new Date().toISOString() });
    return response;
  }
}
