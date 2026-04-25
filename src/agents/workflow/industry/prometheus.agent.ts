/**
 * Prometheus — Hydrogen & Energy Transition Agent, Climate IQ
 *
 * The Titan who stole fire from the gods and gave it to humanity.
 * Prometheus handles hydrogen — the new fire — and the regulatory
 * maze separating green hydrogen from the expensive kind that happens
 * to be produced near a wind turbine.
 *
 * Input: { hydrogenType?, productionCapacity?, renewableSource?, annualEmissions }
 * Output: RED III/RFNBO compliance, additionality assessment, green H2 certification
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';
import { CBAM_CN_CODES } from '../../../synthetic-data/cbam-schema.js';

const SOUL = `You are Prometheus, Hydrogen & Energy Transition Specialist for Climate IQ.

Hydrogen classification is the sharpest edge in EU climate law right now:
- RFNBO (Renewable Fuels of Non-Biological Origin): requires additionality, temporal correlation, geographical correlation
- RED III delegated acts: electrolytic H2 only qualifies as "green" with strict renewable electricity proof
- ETS: hydrogen producers in scope; electrolytic H2 still needs monitoring
- Fit for 55: 42% of industrial hydrogen must be RFNBO by 2030

Common mistakes:
- Claiming green H2 from grid electricity without PPAs or REGOs
- Ignoring additionality: existing renewables don't qualify — you need NEW capacity
- Temporal mismatch: annual matching ≠ hourly matching required after 2030

Tone: the fire-bringer. Patient about the complexity, uncompromising about the rules.
Output as JSON: { rfnboCompliance, additionalityStatus, temporalCorrelation, prioritizedActions, riskSummary }`;

export class PrometheusAgent extends BaseAgent {
  constructor() {
    super({
      name: 'prometheus',
      description:
        'Hydrogen & Energy Transition Specialist — RFNBO/RED III compliance, additionality, green H2 certification for Climate IQ',
      capabilities: [
        'rfnbo-compliance',
        'green-hydrogen-certification',
        'red-iii-hydrogen',
        'additionality-assessment',
        'energy-transition',
      ],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');
    const annualEmissions = typeof input.annualEmissions === 'number' ? input.annualEmissions : 0;
    const hydrogenType = typeof input.hydrogenType === 'string' ? input.hydrogenType : 'unknown';
    const productionCapacity =
      typeof input.productionCapacity === 'number' ? input.productionCapacity : null;
    const renewableSource =
      typeof input.renewableSource === 'string' ? input.renewableSource : null;
    const hasAdditionality =
      typeof input.hasAdditionality === 'boolean' ? input.hasAdditionality : null;
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
      input: { annualEmissions, hydrogenType, productionCapacity },
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    let complianceResult: AgentResponse | null = null;
    try {
      complianceResult = await agentRegistry.executeAgent('compliance', context, {
        projectId: context.projectId,
        industry: 'hydrogen',
        regulations: ['fit-for-55', 'ets', 'csrd'],
        currentMeasures,
        annualEmissions,
        importValue: 0,
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

    const cbamHydrogenCodes = CBAM_CN_CODES.hydrogen.codes; // Source: CBAM Annex I via cbam-schema.ts
    const isGreenClaim = hydrogenType === 'green' || hydrogenType === 'rfnbo';
    const rfnboQualified = isGreenClaim && hasAdditionality === true && renewableSource !== null;

    const llmResult = await this.callLLM(
      `${SOUL}

Hydrogen client data:
- Hydrogen type claimed: ${hydrogenType}
- Production capacity: ${productionCapacity ?? 'not provided'} MW
- Renewable source: ${renewableSource ?? 'not provided'}
- Additionality demonstrated: ${hasAdditionality ?? 'not assessed'}
- RFNBO pre-qualification: ${rfnboQualified ? 'LIKELY QUALIFIES' : 'GAPS PRESENT'}
- CBAM CN codes in scope: ${cbamHydrogenCodes.join(', ')}
- Annual emissions: ${annualEmissions.toLocaleString()} tCO2e
- Compliance score: ${complianceResult?.result?.overallScore ?? 'n/a'}/100

Return JSON: { "rfnboCompliance", "additionalityStatus", "temporalCorrelation", "prioritizedActions": [], "riskSummary" }`,
    );

    let synthesis = {
      rfnboCompliance: '',
      additionalityStatus: '',
      temporalCorrelation: '',
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
        hydrogenType,
        productionCapacity,
        renewableSource,
        rfnboQualified,
        hasAdditionality,
        ...synthesis,
        baseCompliance: complianceResult?.result ?? null,
      },
      confidence: complianceResult ? complianceResult.confidence : 0.55,
      reasoning: `Prometheus assessed hydrogen sector. Type: ${hydrogenType}. RFNBO pre-qualification: ${rfnboQualified}.`,
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
