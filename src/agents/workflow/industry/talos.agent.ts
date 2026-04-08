/**
 * Talos — Aluminium Industry Agent, Climate IQ
 *
 * Code-Version: 1.0
 * Branch: claude/cbam-alignment-pr-6as8L
 * Date: 2026-04-06
 * Owner: Claude Code
 *
 * Bronze automaton of Crete. Talos knows aluminium the way he knows his own
 * body — every tonne of bauxite refined, every kWh of electrolysis, every
 * gram of CO2 from the grid that powers the Hall-Héroult cells.
 *
 * Aluminium is unique in CBAM: indirect emissions (grid electricity) dominate
 * total carbon content. A Norwegian smelter on hydro emits ~2 tCO2e/t.
 * A Chinese smelter on coal grid emits ~16 tCO2e/t. Same metal, 8x the carbon.
 *
 * Input: { annualEmissions, importValue, annualProduction?, productionRoute?, gridCarbonIntensity? }
 * Output: aluminium-specific compliance with CBAM indirect emission exposure and ETS benchmark gap
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';
import { CBAM_CN_CODES } from '../../../synthetic-data/cbam-schema.js';

/**
 * Full CBAM Annex I aluminium CN codes imported from cbam-schema.ts (single source of truth).
 * 16 codes: 7601–7616 (unwrought, scrap, powders, bars, wire, plates, foil, tubes, structures, articles)
 *
 * Source: Regulation (EU) 2023/956, Annex I — Aluminium
 */
const ALUMINIUM_CBAM_CN_CODES = CBAM_CN_CODES.aluminium.codes;

/**
 * CN code groupings for aluminium compliance analysis.
 * Grouped by processing stage for LLM assessment.
 */
const ALUMINIUM_CN_GROUPS = {
  primary: {
    label: 'Primary & scrap',
    codes: ['7601', '7602', '7603'],
    note: 'Unwrought aluminium, waste/scrap, powders/flakes',
  },
  semiFinished: {
    label: 'Semi-finished products',
    codes: ['7604', '7605', '7606', '7607'],
    note: 'Bars/rods/profiles, wire, plates/sheets, foil',
  },
  tubesFittings: {
    label: 'Tubes & fittings',
    codes: ['7608', '7609'],
    note: 'Aluminium tubes/pipes, tube fittings',
  },
  downstream: {
    label: 'Downstream articles',
    codes: ['7610', '7611', '7612', '7613', '7614', '7615', '7616'],
    note: 'Structures, reservoirs, casks, compressed gas containers, cables, kitchenware, other articles',
  },
} as const;

/**
 * Dynamic CN code checker for CBAM Annex I aluminium scope.
 * Covers 7601–7616 (all aluminium products subject to CBAM).
 * Source: Regulation (EU) 2023/956 Annex I, Section 4
 */
export const isCBAMAluminium = (cnCode: string): boolean => {
  const code = parseInt(cnCode.substring(0, 4));
  if (isNaN(code)) return false;
  return code >= 7601 && code <= 7616;
};

// Aluminium emission factors (source: EU ETS Benchmark 2021-2025, CBAM defaults, IAI 2024)
const ETS_BENCHMARK_DIRECT = 1.514; // tCO2e/t aluminium — EU ETS Benchmark 2021-2025 (direct only)
const CBAM_DEFAULT_TOTAL = 6.7; // tCO2e/t aluminium — CBAM transitional default (direct + indirect)
const HYDRO_SMELTER_TOTAL = 2.0; // tCO2e/t — Norway/Iceland hydro-powered (IAI 2024)
const COAL_GRID_SMELTER_TOTAL = 16.2; // tCO2e/t — China coal-grid average (IAI 2024)

const SOUL = `You are Talos, Aluminium Industry Specialist for Climate IQ.

Aluminium is the CBAM sector where indirect emissions matter most. Your expertise:
- CBAM: aluminium is the ONLY sector where indirect emissions (grid electricity) are explicitly
  included in the carbon content calculation. This is because Hall-Héroult electrolysis consumes
  ~14-16 MWh/t aluminium — the grid carbon intensity determines 60-80% of total emissions.
- ETS Phase 4: EU smelters benchmark at ${ETS_BENCHMARK_DIRECT} tCO2e/t (direct only).
  Free allowances phasing out 2026-2034.
- CBAM default value: ${CBAM_DEFAULT_TOTAL} tCO2e/t (direct + indirect). Importers using defaults
  instead of actual data face massive cost penalties — actual EU smelter emissions are ~2 tCO2e/t.
- Geographic risk: China (~60% of global production) averages ${COAL_GRID_SMELTER_TOTAL} tCO2e/t.
  Norway/Iceland hydro smelters: ~${HYDRO_SMELTER_TOTAL} tCO2e/t. Difference is 8x.
- Full CBAM scope: ${ALUMINIUM_CBAM_CN_CODES.length} CN codes across 4 product groups:
  * Primary & scrap (7601-7603): unwrought, waste/scrap, powders
  * Semi-finished (7604-7607): bars, wire, plates/sheets, foil
  * Tubes & fittings (7608-7609): tubes/pipes, fittings
  * Downstream articles (7610-7616): structures, reservoirs, casks, cables, kitchenware, other
- Secondary (recycled) aluminium emits ~0.5 tCO2e/t — 95% less than primary. Scrap ratio is a
  compliance lever, not just a cost lever.
- Downstream articles (7610-7616) require precursor emission tracing back to unwrought aluminium.

Tone: as relentless as bronze. Aluminium buyers who don't know their smelter's grid mix are flying blind.
Output as JSON: { cbamIndirectExposure, etsBenchmarkGap, geographicRisk, cnCodeCoverage, prioritizedActions, riskSummary }`;

export class TalosAgent extends BaseAgent {
  constructor() {
    super({
      name: 'talos',
      description:
        'Aluminium Industry Specialist — CBAM indirect emissions, Hall-Héroult electrolysis, grid carbon intensity, ETS benchmark gap for Climate IQ',
      capabilities: [
        'aluminium-cbam-compliance',
        'cbam-aluminium-indirect-emissions',
        'aluminium-ets-benchmark',
        'aluminium-grid-carbon-analysis',
        'aluminium-downstream-tracing',
        'secondary-aluminium-recycling',
      ],
      model: 'claude-haiku-4-5-20251001',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');

    // Explicit field extraction — no spread injection
    const annualEmissions = typeof input.annualEmissions === 'number' ? input.annualEmissions : 0;
    const importValue = typeof input.importValue === 'number' ? input.importValue : 0;
    const annualProduction =
      typeof input.annualProduction === 'number' ? input.annualProduction : 0;
    const productionRoute =
      typeof input.productionRoute === 'string' ? input.productionRoute : 'hall-heroult-primary';
    const gridCarbonIntensity =
      typeof input.gridCarbonIntensity === 'number' ? input.gridCarbonIntensity : null;
    const scrapRatioPct = typeof input.scrapRatioPct === 'number' ? input.scrapRatioPct : null;
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
      input: { annualEmissions, importValue, annualProduction, productionRoute },
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    let complianceResult: AgentResponse | null = null;
    try {
      complianceResult = await agentRegistry.executeAgent('compliance', context, {
        projectId: context.projectId,
        industry: 'aluminium',
        regulations: ['ets', 'cbam', 'fit-for-55'],
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

    // Aluminium-specific metrics
    const cbamApplies = importValue >= 150_000;
    const estimatedTotalEmissionFactor =
      gridCarbonIntensity !== null
        ? ETS_BENCHMARK_DIRECT + (gridCarbonIntensity * 15) / 1000 // ~15 MWh/t * gCO2/kWh → tCO2e/t
        : CBAM_DEFAULT_TOTAL;
    const expectedEmissions =
      annualProduction > 0 ? annualProduction * estimatedTotalEmissionFactor : annualEmissions;

    // Build CN code group summary for LLM context
    const cnGroupSummary = Object.values(ALUMINIUM_CN_GROUPS)
      .map((g) => `  * ${g.label} (${g.codes[0]}–${g.codes[g.codes.length - 1]}): ${g.note}`)
      .join('\n');

    const llmResult = await this.callLLM(
      `${SOUL}

Aluminium client data:
- Production route: ${productionRoute}
- Annual production: ${annualProduction > 0 ? `${annualProduction.toLocaleString()} tonnes` : 'not provided'}
- Annual emissions: ${annualEmissions.toLocaleString()} tCO2e
- Import value: EUR ${importValue.toLocaleString()}
- CBAM applies: ${cbamApplies}
- Grid carbon intensity: ${gridCarbonIntensity !== null ? `${gridCarbonIntensity} gCO2/kWh` : 'not provided (using CBAM default)'}
- Estimated total emission factor: ${estimatedTotalEmissionFactor.toFixed(1)} tCO2e/t aluminium
- Scrap ratio: ${scrapRatioPct !== null ? `${scrapRatioPct}%` : 'not provided'}
- Total CN codes in scope: ${ALUMINIUM_CBAM_CN_CODES.length} (full CBAM Annex I aluminium)
- CN code groups:
${cnGroupSummary}
- ETS benchmark (direct): ${ETS_BENCHMARK_DIRECT} tCO2e/t
- CBAM default (direct+indirect): ${CBAM_DEFAULT_TOTAL} tCO2e/t
- Compliance score from Athena: ${complianceResult?.result?.overallScore ?? 'n/a'}/100
- Compliance gaps: ${JSON.stringify(complianceResult?.result?.gaps ?? [])}

Return JSON: {
  "cbamIndirectExposure": "analysis of indirect emission exposure from grid electricity",
  "etsBenchmarkGap": "gap between actual/estimated emissions and EU ETS benchmark",
  "geographicRisk": "risk assessment based on smelter location and grid mix",
  "cnCodeCoverage": "which CN code groups the client's products fall under and any gaps",
  "prioritizedActions": ["action1", "action2", "action3"],
  "riskSummary": "2-sentence summary for an aluminium procurement director"
}`,
    );

    let synthesis = {
      cbamIndirectExposure: '',
      etsBenchmarkGap: '',
      geographicRisk: '',
      cnCodeCoverage: '',
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
        productionRoute,
        estimatedTotalEmissionFactor,
        expectedEmissions,
        cbamApplies,
        cbamCnCodeCount: ALUMINIUM_CBAM_CN_CODES.length,
        gridCarbonIntensity,
        scrapRatioPct,
        etsBenchmarkDirect: ETS_BENCHMARK_DIRECT,
        cbamDefaultTotal: CBAM_DEFAULT_TOTAL,
        ...synthesis,
        baseCompliance: complianceResult?.result ?? null,
      },
      confidence: complianceResult ? complianceResult.confidence * 0.9 + 0.1 : 0.5,
      reasoning: `Talos assessed aluminium sector (${ALUMINIUM_CBAM_CN_CODES.length} CN codes). Route: ${productionRoute}. Estimated emission factor: ${estimatedTotalEmissionFactor.toFixed(1)} tCO2e/t. CBAM applies: ${cbamApplies}. Grid carbon intensity: ${gridCarbonIntensity ?? 'unknown'} gCO2/kWh.`,
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
      input: { annualEmissions, importValue },
      output: response,
      status: 'completed',
      duration_ms: durationMs,
      created_at: new Date().toISOString(),
    });
    return response;
  }
}
