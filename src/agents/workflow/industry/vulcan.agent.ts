/**
 * Vulcan — Steel & Metals Industry Agent, Climate IQ
 *
 * Roman god of the forge. Vulcan knows steel the way he knows fire:
 * intimately, precisely, and without mercy for shortcuts.
 *
 * Steel sector specialist: ETS Phase 4 (highest scrutiny), CBAM carbon
 * content declarations, blast furnace vs. electric arc emissions pathways.
 *
 * Input: { industry?: 'steel'|'metals', annualEmissions, importValue, currentMeasures? }
 * Output: steel-specific compliance assessment with ETS allowance gap and CBAM carbon content status
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';
import { CBAM_CN_CODES } from '../../../synthetic-data/cbam-schema.js';

/**
 * Full CBAM Annex I steel CN codes imported from cbam-schema.ts (single source of truth).
 * 42 codes: 7201–7229 (raw materials, flat products, long products, stainless, alloy)
 *         + 7301–7326 (tubes, pipes, structures, downstream articles)
 *
 * Source: Regulation (EU) 2023/956, Annex I — Iron and Steel
 */
const STEEL_CBAM_CN_CODES = CBAM_CN_CODES.steel.codes;

/**
 * CN code groupings for compliance analysis context.
 * Grouped by production stage / product type for LLM assessment.
 */
const STEEL_CN_GROUPS = {
  rawMaterials: {
    label: 'Raw materials & intermediates',
    codes: ['7201', '7202', '7203', '7204', '7205', '7206', '7207'],
    note: 'Pig iron, ferro-alloys, scrap, granules, powder, ingots, semi-finished',
  },
  flatProducts: {
    label: 'Flat-rolled products',
    codes: ['7208', '7209', '7210', '7211', '7212'],
    note: 'Hot-rolled, cold-rolled, clad/plated/coated, narrow strip',
  },
  longProducts: {
    label: 'Long products',
    codes: ['7213', '7214', '7215', '7216', '7217'],
    note: 'Bars, rods, angles, shapes, sections, wire',
  },
  stainlessAlloy: {
    label: 'Stainless & alloy steels',
    codes: [
      '7218',
      '7219',
      '7220',
      '7221',
      '7222',
      '7223',
      '7224',
      '7225',
      '7226',
      '7227',
      '7228',
      '7229',
    ],
    note: 'Stainless semi-finished, flat, wire rod, bars, wire + other alloy equivalents',
  },
  tubesPipes: {
    label: 'Tubes, pipes & fittings',
    codes: ['7301', '7302', '7303', '7304', '7305', '7306', '7307'],
    note: 'Sheet piling, railway track, cast iron/seamless/welded tubes, fittings',
  },
  downstream: {
    label: 'Downstream steel articles',
    codes: ['7308', '7309', '7310', '7311', '7318', '7326'],
    note: 'Structures, reservoirs, tanks, containers, bolts/nuts/screws, other articles',
  },
} as const;

/**
 * Dynamic CN code checker — covers full CBAM Annex I iron & steel scope.
 * Preferred over array lookup for downstream filtering of variable-length CN codes
 * (e.g., '7208 51 20' should match the 7208 base).
 * Source: Regulation (EU) 2023/956 Annex I, Section 3
 */
export const isCBAMSteelAndIron = (cnCode: string): boolean => {
  const code = parseInt(cnCode.substring(0, 4));
  if (isNaN(code)) return false;
  const isIronSteelBase = code >= 7201 && code <= 7229;
  const isDownstreamProducts = code >= 7301 && code <= 7326;
  return isIronSteelBase || isDownstreamProducts;
};

const SOUL = `You are Vulcan, Steel & Metals Industry Specialist for Climate IQ.

Steel is the most ETS-intensive CBAM sector. Your job:
- ETS Phase 4: steel installations have ZERO free allowances from 2026. No exceptions.
- CBAM: steel importers must declare embedded carbon content per tonne by CN code.
- Full CBAM scope: 42 CN codes across 6 product groups:
  * Raw materials (7201-7207): pig iron, ferro-alloys, scrap, semi-finished
  * Flat products (7208-7212): hot-rolled, cold-rolled, coated, narrow
  * Long products (7213-7217): bars, rods, angles, sections, wire
  * Stainless & alloy (7218-7229): stainless flat/long + other alloy steels
  * Tubes & pipes (7301-7307): sheet piling, railway, seamless/welded tubes
  * Downstream articles (7308-7326): structures, tanks, fasteners, other articles
- Blast furnace route: ~1.8–2.2t CO2/t steel. Electric arc: ~0.4–0.6t CO2/t steel.
- Scrap availability is a compliance lever, not just a cost lever.
- Stainless/alloy steels have different benchmark values — do not use carbon steel defaults.
- Downstream articles (7308-7326) require precursor emission tracing back to crude steel.

Tone: direct as a forge hammer. Steel clients don't need softening. They need numbers.
Output as JSON: { etsFreeAllowanceGap, cbamCarbonContent, productionRouteRisk, cnCodeCoverage, prioritizedActions, riskSummary }`;

// Steel-specific ETS thresholds
const STEEL_ETS_FREE_ALLOWANCE_PHASE4_END = '2025-12-31'; // Free allowances phase out
const BLAST_FURNACE_EMISSION_FACTOR = 2.0; // tCO2/t steel (mid-range)
const EAF_EMISSION_FACTOR = 0.5; // tCO2/t steel (mid-range)

export class VulcanAgent extends BaseAgent {
  constructor() {
    super({
      name: 'vulcan',
      description:
        'Steel & Metals Industry Specialist — ETS Phase 4, CBAM carbon declarations, blast furnace vs. EAF pathway analysis for Climate IQ',
      capabilities: [
        'steel-ets-compliance',
        'cbam-steel-carbon-content',
        'cbam-stainless-alloy',
        'cbam-downstream-articles',
        'blast-furnace-eaf-analysis',
        'metals-industry-compliance',
        'steel-decarbonization-pathways',
      ],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');

    // Explicit field extraction — no spread injection
    const industry = typeof input.industry === 'string' ? input.industry : 'steel';
    const annualEmissions = typeof input.annualEmissions === 'number' ? input.annualEmissions : 0;
    const importValue = typeof input.importValue === 'number' ? input.importValue : 0;
    const annualProduction =
      typeof input.annualProduction === 'number' ? input.annualProduction : 0;
    const productionRoute =
      typeof input.productionRoute === 'string' ? input.productionRoute : 'blast-furnace';
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
      input: { industry, annualEmissions, importValue, annualProduction, productionRoute },
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    let complianceResult: AgentResponse | null;
    try {
      complianceResult = await agentRegistry.executeAgent('compliance', context, {
        projectId: context.projectId,
        industry,
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

    // Steel-specific metrics
    const emissionFactor =
      productionRoute === 'eaf' ? EAF_EMISSION_FACTOR : BLAST_FURNACE_EMISSION_FACTOR;
    const expectedEmissions =
      annualProduction > 0 ? annualProduction * emissionFactor : annualEmissions;
    const cbamApplies = importValue >= 150_000;
    const etsPhase4PressureNote =
      new Date() >= new Date(STEEL_ETS_FREE_ALLOWANCE_PHASE4_END)
        ? 'ETS Phase 4: free allowances for steel have ended — full auctioning now applies'
        : `ETS free allowance phase-out approaching: ${STEEL_ETS_FREE_ALLOWANCE_PHASE4_END}`;

    // Build CN code group summary for LLM context
    const cnGroupSummary = Object.values(STEEL_CN_GROUPS)
      .map((g) => `  * ${g.label} (${g.codes[0]}–${g.codes[g.codes.length - 1]}): ${g.note}`)
      .join('\n');

    const llmResult = await this.callLLM(
      `${SOUL}

Steel client data:
- Industry: ${industry}
- Production route: ${productionRoute} (emission factor: ${emissionFactor} tCO2/t steel)
- Annual production: ${annualProduction > 0 ? `${annualProduction.toLocaleString()} tonnes` : 'not provided'}
- Annual emissions: ${annualEmissions.toLocaleString()} tCO2e
- Import value: EUR ${importValue.toLocaleString()}
- CBAM applies: ${cbamApplies}
- Total CN codes in scope: ${STEEL_CBAM_CN_CODES.length} (full CBAM Annex I iron & steel)
- CN code groups:
${cnGroupSummary}
- ${etsPhase4PressureNote}
- Compliance score from Athena: ${complianceResult?.result?.overallScore ?? 'n/a'}/100
- Compliance gaps: ${JSON.stringify(complianceResult?.result?.gaps ?? [])}

Return JSON: {
  "etsFreeAllowanceGap": "description of ETS allowance gap and urgency",
  "cbamCarbonContent": "CBAM carbon content status and declaration requirements",
  "productionRouteRisk": "risk specific to blast furnace vs EAF pathway",
  "cnCodeCoverage": "which CN code groups the client's products fall under and any gaps",
  "prioritizedActions": ["action1", "action2", "action3"],
  "riskSummary": "2-sentence summary for a steel CFO"
}`,
    );

    let synthesis = {
      etsFreeAllowanceGap: '',
      cbamCarbonContent: '',
      productionRouteRisk: '',
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
        industry,
        productionRoute,
        emissionFactor,
        expectedEmissions,
        cbamApplies,
        cbamCnCodeCount: STEEL_CBAM_CN_CODES.length,
        etsPhase4PressureNote,
        ...synthesis,
        baseCompliance: complianceResult?.result ?? null,
      },
      confidence: complianceResult ? complianceResult.confidence * 0.9 + 0.1 : 0.5,
      reasoning: `Vulcan assessed ${industry} sector (${STEEL_CBAM_CN_CODES.length} CN codes). Production route: ${productionRoute} (${emissionFactor} tCO2/t). CBAM applies: ${cbamApplies}. ${etsPhase4PressureNote}.`,
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
      input: { industry, annualEmissions },
      output: response,
      status: 'completed',
      duration_ms: durationMs,
      created_at: new Date().toISOString(),
    });
    return response;
  }
}
