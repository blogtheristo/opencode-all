/**
 * Helios — Energy & Renewables Industry Agent, Climate IQ
 *
 * Greek god of the sun. Helios tracks every watt, every tonne, every grid
 * emission factor — from offshore wind to nuclear to that gas plant hoping
 * nobody notices it in the Fit for 55 numbers.
 *
 * Input: { energyMix?, installedCapacity?, annualEmissions, gridEmissionFactor? }
 * Output: energy sector compliance, renewable share analysis, Fit for 55 gap
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';
import { CBAM_CN_CODES } from '../../../synthetic-data/cbam-schema.js';

const SOUL = `You are Helios, Energy & Renewables Industry Specialist for Climate IQ.

Energy is the backbone of every other sector's decarbonization. Your role:
- Fit for 55: 42.5% renewable energy share target by 2030 (RED III binding)
- ETS: energy producers have ZERO free allowances — every tonne is auctioned
- Taxonomy alignment: only renewable + low-carbon energy qualifies as green investment
- CSRD: energy companies need Scope 1/2/3 disclosure with grid emission factors

Tone: luminous but precise. You've seen every greenwash attempt. None survive.
Output as JSON: { renewableShareGap, etsExposure, taxonomyAlignment, prioritizedActions, riskSummary }`;

export class HeliosAgent extends BaseAgent {
  constructor() {
    super({
      name: 'helios',
      description:
        'Energy & Renewables Industry Specialist — Fit for 55, RED III, ETS exposure, EU Taxonomy alignment for Climate IQ',
      capabilities: [
        'energy-fit-for-55',
        'renewable-energy-compliance',
        'ets-energy-sector',
        'eu-taxonomy-energy',
        'grid-emission-factors',
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
    const renewableSharePct =
      typeof input.renewableSharePct === 'number' ? input.renewableSharePct : null;
    const gridEmissionFactor =
      typeof input.gridEmissionFactor === 'number' ? input.gridEmissionFactor : null;
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
      input: { annualEmissions, renewableSharePct },
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    let complianceResult: AgentResponse | null;
    try {
      complianceResult = await agentRegistry.executeAgent('compliance', context, {
        projectId: context.projectId,
        industry: 'energy',
        regulations: ['fit-for-55', 'ets', 'csrd'],
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

    const cbamElectricityCodes = CBAM_CN_CODES.electricity.codes; // Source: CBAM Annex I via cbam-schema.ts
    const RED_III_TARGET = 42.5;
    const renewableGap =
      renewableSharePct !== null ? Math.max(0, RED_III_TARGET - renewableSharePct) : null;

    const llmResult = await this.callLLM(
      `${SOUL}

Energy client data:
- Annual emissions: ${annualEmissions.toLocaleString()} tCO2e
- Renewable share: ${renewableSharePct !== null ? `${renewableSharePct}%` : 'not provided'} (RED III target: ${RED_III_TARGET}%)
- Renewable gap: ${renewableGap !== null ? `${renewableGap.toFixed(1)}%` : 'unknown'}
- Grid emission factor: ${gridEmissionFactor !== null ? `${gridEmissionFactor} gCO2/kWh` : 'not provided'}
- CBAM CN codes in scope: ${cbamElectricityCodes.join(', ')}
- Compliance score: ${complianceResult?.result?.overallScore ?? 'n/a'}/100

Return JSON: { "renewableShareGap", "etsExposure", "taxonomyAlignment", "prioritizedActions": [], "riskSummary" }`,
    );

    let synthesis = {
      renewableShareGap: '',
      etsExposure: '',
      taxonomyAlignment: '',
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
        renewableSharePct,
        renewableGap,
        gridEmissionFactor,
        ...synthesis,
        baseCompliance: complianceResult?.result ?? null,
      },
      confidence: complianceResult ? complianceResult.confidence : 0.55,
      reasoning: `Helios assessed energy sector. Renewable share: ${renewableSharePct ?? 'unknown'}% (gap to RED III: ${renewableGap ?? 'unknown'}%). ETS: zero free allowances.`,
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
