/**
 * BESS Agent — Battery Energy Storage System Compliance Specialist
 *
 * Named for Voltaic cells (Alessandro Volta) — where stored energy meets
 * EU regulation. Every MWh charged carries a carbon shadow; every MWh
 * discharged earns Taxonomy credit. This agent counts both.
 *
 * Integration surface for Qantic Q-System dispatch schedules.
 * Delegates to Helios for energy sector compliance context and
 * to the Compliance agent for CSRD/ETS/CBAM scoring.
 *
 * Input: { dispatch: DispatchEntry[], battery: BatterySpec, year: number }
 * Output: BESSComplianceCost (EUR cost breakdown) + energy compliance context
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';
import {
  type BatterySpec,
  type BESSComplianceInput,
  calculateBESSCompliance,
  type DispatchEntry,
  estimateBESSComplianceCost,
} from '../../../compliance/bess-calculator.js';

const SOUL = `You are BESS Compliance Specialist for DWS IQ 6 Climate IQ.

Battery energy storage sits at the intersection of energy trading and EU compliance.
Your job: translate Q-System dispatch schedules into compliance cost line items.

Key regulations for BESS:
- CSRD/ESRS E1-5: Energy consumption and mix disclosure (charging patterns)
- CSRD/ESRS E1-6: Scope 1/2/3 GHG emissions (grid charging = Scope 2)
- EU ETS: Co-located generation assets face full auctioning (zero free allowances)
- EU Taxonomy 4.10: Electricity storage — substantial contribution via avoided emissions
- EPBD recast 2027: Behind-the-meter BESS needs building-level carbon reporting

Tone: precise, bankable. Every number must be auditable. Investors read this.
Output as JSON: { summary, riskFactors, recommendations, taxonomyNarrative }`;

export class BESSAgent extends BaseAgent {
  constructor() {
    super({
      name: 'bess',
      description: 'Battery Energy Storage System Compliance Specialist — Q-System dispatch → compliance cost, EU Taxonomy 4.10, CSRD lifecycle disclosure',
      capabilities: [
        'bess-compliance-cost',
        'bess-dispatch-analysis',
        'bess-taxonomy-alignment',
        'bess-lifecycle-disclosure',
        'bess-ets-colocated',
        'energy-storage-compliance',
      ],
      model: 'claude-haiku-4-5-20251001',
      inputSchema: {
        type: 'object',
        properties: {
          dispatch: {
            type: 'array',
            description: 'Q-System dispatch schedule (hourly entries)',
          },
          battery: {
            type: 'object',
            description: 'Battery installation specification (powerMw, energyMwh, roundtripEfficiency, etc.)',
          },
          year: {
            type: 'number',
            description: 'Assessment year (default: current year)',
          },
          carbonPriceEur: {
            type: 'number',
            description: 'Override EU ETS carbon price (EUR/tCO2e)',
          },
          colocatedEtsCovered: {
            type: 'boolean',
            description: 'Whether co-located generation is ETS-covered',
          },
          quickEstimate: {
            type: 'object',
            description: 'Quick estimate mode — no dispatch data needed. Provide { energyMwh, country }',
          },
        },
        required: [],
      },
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: { mode: input.quickEstimate ? 'quick-estimate' : 'full-dispatch' },
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      // ---- Quick estimate mode (no dispatch data) ----
      if (input.quickEstimate && typeof input.quickEstimate === 'object') {
        const est = input.quickEstimate as Record<string, unknown>;
        const energyMwh = typeof est.energyMwh === 'number' ? est.energyMwh : 0;
        const country = typeof est.country === 'string' ? est.country : 'EU';
        const efficiency = typeof est.roundtripEfficiency === 'number' ? est.roundtripEfficiency : 0.9025;

        const result = estimateBESSComplianceCost(energyMwh, country, efficiency);
        const durationMs = Date.now() - startTime;

        const response: AgentResponse = {
          agentName: this.config.name,
          result: result as unknown as Record<string, unknown>,
          confidence: 0.6,
          reasoning: `Quick estimate for ${energyMwh} MWh BESS in ${country}. For accurate costs, provide Q-System dispatch schedule.`,
          recommendations: ['Provide full dispatch schedule for accurate compliance costing', 'Confirm grid emission factors with national TSO data'],
          metadata: { durationMs, mode: 'quick-estimate' },
        };

        await this.logExecution({
          agent_name: this.config.name,
          user_id: context.userId,
          org_id: context.orgId,
          session_id: context.sessionId,
          project_id: context.projectId,
          input: { mode: 'quick-estimate', energyMwh, country },
          output: response,
          status: 'completed',
          duration_ms: durationMs,
          created_at: new Date().toISOString(),
        });

        return response;
      }

      // ---- Full dispatch analysis mode ----
      const dispatch = Array.isArray(input.dispatch) ? input.dispatch as DispatchEntry[] : [];
      const battery = (typeof input.battery === 'object' && input.battery !== null)
        ? input.battery as unknown as BatterySpec
        : null;

      if (dispatch.length === 0 || !battery) {
        return {
          agentName: this.config.name,
          result: { error: 'Missing required input: dispatch[] and battery{} are required for full analysis' },
          confidence: 0,
          reasoning: 'Cannot calculate compliance costs without dispatch schedule and battery specification.',
          recommendations: [
            'Provide dispatch: DispatchEntry[] from Q-System export',
            'Provide battery: BatterySpec with powerMw, energyMwh, roundtripEfficiency, etc.',
            'Or use quickEstimate: { energyMwh, country } for indicative pricing',
          ],
          metadata: { durationMs: Date.now() - startTime },
        };
      }

      const year = typeof input.year === 'number' ? input.year : new Date().getFullYear();
      const carbonPriceEur = typeof input.carbonPriceEur === 'number' ? input.carbonPriceEur : undefined;
      const colocatedEtsCovered = typeof input.colocatedEtsCovered === 'boolean' ? input.colocatedEtsCovered : false;

      const complianceInput: BESSComplianceInput = {
        dispatch,
        battery,
        year,
        carbonPriceEur,
        colocatedEtsCovered,
      };

      // Core deterministic calculation
      const complianceCost = calculateBESSCompliance(complianceInput);

      // Delegate to Helios for energy sector context
      let heliosResult: AgentResponse | null = null;
      try {
        const { agentRegistry } = await import('../../index.js');
        heliosResult = await agentRegistry.executeAgent('helios', context, {
          annualEmissions: complianceCost.emissions.scope2TotalTonnes,
          gridEmissionFactor: complianceCost.emissions.weightedGridFactor,
          importValue: 0,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Helios delegation failed';
        // Non-fatal: BESS results are valid without Helios context
        heliosResult = null;
        await this.logExecution({
          agent_name: this.config.name,
          user_id: context.userId,
          org_id: context.orgId,
          session_id: context.sessionId,
          project_id: context.projectId,
          input: {},
          output: null,
          status: 'error',
          error_message: `Helios delegation failed (non-fatal): ${msg}`,
          duration_ms: Date.now() - startTime,
          created_at: new Date().toISOString(),
        });
      }

      // LLM synthesis for narrative (non-blocking, graceful degradation)
      let synthesis = { summary: '', riskFactors: [] as string[], recommendations: [] as string[], taxonomyNarrative: '' };
      try {
        const llmResult = await this.callLLM(
          `${SOUL}

BESS compliance cost analysis:
- Installation: ${battery.powerMw} MW / ${battery.energyMwh} MWh in ${battery.country}
- Total compliance cost: €${complianceCost.totalCostEur}/year
- Scope 2 emissions: ${complianceCost.emissions.scope2TotalTonnes} tCO2e
- Avoided emissions: ${complianceCost.emissions.avoidedEmissionsTonnes} tCO2e
- Net position: ${complianceCost.emissions.netEmissionsTonnes} tCO2e
- Battery capacity: ${complianceCost.lifecycle.currentCapacityPct}% of nameplate
- Remaining life: ${complianceCost.lifecycle.remainingLifeYears} years
- EU Taxonomy substantial contribution: ${complianceCost.taxonomy.substantialContribution}
- ETS-covered market hours: ${complianceCost.etsMarketHours.etsCoveredPct}%
- Helios energy context: ${heliosResult ? JSON.stringify(heliosResult.result) : 'unavailable'}

Return JSON: { "summary", "riskFactors": [], "recommendations": [], "taxonomyNarrative" }`,
        );
        try { synthesis = { ...synthesis, ...JSON.parse(llmResult.content) }; } catch { synthesis.summary = llmResult.content.slice(0, 300); }
      } catch {
        synthesis.summary = `BESS ${battery.powerMw}MW/${battery.energyMwh}MWh: €${complianceCost.totalCostEur}/year compliance cost`;
      }

      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          ...complianceCost as unknown as Record<string, unknown>,
          synthesis,
          heliosContext: heliosResult?.result ?? null,
        },
        confidence: dispatch.length >= 8760 ? 0.9 : dispatch.length >= 720 ? 0.75 : 0.6,
        reasoning: `BESS compliance analysis for ${battery.powerMw}MW/${battery.energyMwh}MWh (${battery.country}). ` +
          `${dispatch.length} dispatch hours analyzed. ` +
          `Total cost: €${complianceCost.totalCostEur}/year. ` +
          `Net emissions: ${complianceCost.emissions.netEmissionsTonnes} tCO2e. ` +
          `Taxonomy aligned: ${complianceCost.taxonomy.substantialContribution}.`,
        recommendations: [
          ...synthesis.recommendations,
          ...(heliosResult?.recommendations ?? []),
        ],
        metadata: {
          durationMs,
          mode: 'full-dispatch',
          dispatchHours: dispatch.length,
          llmModel: 'claude-haiku-4-5',
        },
      };

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input: { powerMw: battery.powerMw, energyMwh: battery.energyMwh, country: battery.country, dispatchHours: dispatch.length },
        output: response,
        status: 'completed',
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return response;
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
  }
}
