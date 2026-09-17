/**
 * Ceres — Agriculture & Fertilizers Industry Agent, Climate IQ
 *
 * Roman goddess of grain. Ceres understands that nitrogen emissions from
 * fertilizers are 298× more potent than CO2 and that nobody wants to
 * hear it. She says it anyway.
 *
 * Input: { annualEmissions, fertilizerType?, importValue, cropArea? }
 * Output: CBAM fertilizer scope, N2O emissions, CSRD Scope 3 farm-to-gate
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';
import { CBAM_CN_CODES } from '../../../synthetic-data/cbam-schema.js';

const SOUL = `You are Ceres, Agriculture & Fertilizers Industry Specialist for Climate IQ.

Agriculture's regulatory moment has arrived:
- CBAM: fertilizers (urea, ammonium nitrate, mixed N-fertilizers) are a CBAM product group
- N2O: 298× CO2e warming potential — often 60-70% of total agricultural GHG footprint
- CSRD: large agri-businesses need farm-to-gate Scope 3 Category 1 (purchased goods) reporting
- Fit for 55: deforestation regulation intersects with soy/palm commodity supply chains

Tone: nurturing but unsparing. Growth without compliance is just unaccounted cost.
Output as JSON: { cbamFertilizerScope, n2oExposure, csrdScope3Gap, prioritizedActions, riskSummary }`;

export class CeresAgent extends BaseAgent {
  constructor() {
    super({
      name: 'ceres',
      description:
        'Agriculture & Fertilizers Industry Specialist — CBAM fertilizers, N2O emissions, CSRD farm-to-gate Scope 3 for Climate IQ',
      capabilities: [
        'cbam-fertilizers',
        'n2o-emissions',
        'agricultural-csrd',
        'farm-to-gate-scope3',
        'deforestation-regulation',
      ],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');
    const annualEmissions = typeof input.annualEmissions === 'number' ? input.annualEmissions : 0;
    const importValue = typeof input.importValue === 'number' ? input.importValue : 0;
    const fertilizerType = typeof input.fertilizerType === 'string' ? input.fertilizerType : 'urea';
    const currentMeasures =
      typeof input.currentMeasures === 'object' && input.currentMeasures !== null
        ? (input.currentMeasures as Record<string, boolean>)
        : {
            carbonReporting: false,
            emissionsMonitoring: false,
            supplyChainDueDiligence: false,
            aiSystemLogging: false,
          };

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: { annualEmissions, importValue, fertilizerType },
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    let complianceResult: AgentResponse | null;
    try {
      complianceResult = await agentRegistry.executeAgent('compliance', context, {
        projectId: context.projectId,
        industry: 'fertilizers',
        regulations: ['cbam', 'csrd', 'fit-for-55'],
        currentMeasures,
        annualEmissions,
        importValue,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input: {},
        output: null,
        status: 'error',
        error_message: msg,
        duration_ms: Date.now() - startTime,
        created_at: new Date().toISOString(),
      });
      throw err;
    }

    const N2O_GWP = 298;
    const cbamFertilizerCodes = CBAM_CN_CODES.fertilizers.codes; // Source: CBAM Annex I via cbam-schema.ts

    const llmResult = await this.callLLM(
      `${SOUL}

Agriculture/fertilizer client data:
- Annual emissions: ${annualEmissions.toLocaleString()} tCO2e
- Fertilizer import value: EUR ${importValue.toLocaleString()}
- Fertilizer type: ${fertilizerType}
- CBAM CN codes in scope: ${cbamFertilizerCodes.join(', ')}
- N2O GWP: ${N2O_GWP}× CO2e
- Compliance score: ${complianceResult?.result?.overallScore ?? 'n/a'}/100

Return JSON: { "cbamFertilizerScope", "n2oExposure", "csrdScope3Gap", "prioritizedActions": [], "riskSummary" }`,
    );

    let synthesis = {
      cbamFertilizerScope: '',
      n2oExposure: '',
      csrdScope3Gap: '',
      prioritizedActions: [] as string[],
      riskSummary: '',
    };
    try {
      synthesis = { ...synthesis, ...JSON.parse(llmResult.content) };
    } catch {
      synthesis.riskSummary = llmResult.content.slice(0, 200);
    }

    const durationMs = Date.now() - startTime;
    const response: AgentResponse = {
      agentName: this.config.name,
      result: {
        annualEmissions,
        importValue,
        fertilizerType,
        n2oGwp: N2O_GWP,
        cbamFertilizerCodes,
        ...synthesis,
        baseCompliance: complianceResult?.result ?? null,
      },
      confidence: complianceResult ? complianceResult.confidence : 0.55,
      reasoning: `Ceres assessed agriculture/fertilizer sector. Fertilizer type: ${fertilizerType}. Import: EUR ${importValue.toLocaleString()}. N2O at ${N2O_GWP}× GWP.`,
      recommendations: synthesis.prioritizedActions,
      metadata: {
        durationMs,
        llmModel: llmResult.model,
        llmTokens: llmResult.inputTokens + llmResult.outputTokens,
      },
    };

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: { annualEmissions },
      output: response,
      status: 'completed',
      duration_ms: durationMs,
      created_at: new Date().toISOString(),
    });
    return response;
  }
}
