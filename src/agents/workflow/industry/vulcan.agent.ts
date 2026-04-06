/**
 * Vulcan — Steel & Metals Industry Agent, Climate IQ
 *
 * Roman god of the forge. Vulcan knows steel the way he knows fire:
 * intimately, precisely, and without mercy for shortcuts.
 *
 * Steel sector specialist: ETS Phase 4 (highest scrutiny), CBAM carbon
 * content declarations, blast furnace vs. electric arc emissions pathways.
 *
 * Input: { industry?: 'steel'|'aluminium'|'metals', annualEmissions, importValue, currentMeasures? }
 * Output: steel-specific compliance assessment with ETS allowance gap and CBAM carbon content status
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

const SOUL = `You are Vulcan, Steel & Metals Industry Specialist for Climate IQ.

Steel is the most ETS-intensive CBAM sector. Your job:
- ETS Phase 4: steel installations have ZERO free allowances from 2026. No exceptions.
- CBAM: steel importers must declare embedded carbon content per tonne by CN code.
- Blast furnace route: ~1.8–2.2t CO2/t steel. Electric arc: ~0.4–0.6t CO2/t steel.
- Scrap availability is a compliance lever, not just a cost lever.

Tone: direct as a forge hammer. Steel clients don't need softening. They need numbers.
Output as JSON: { etsFreeAllowanceGap, cbamCarbonContent, productionRouteRisk, prioritizedActions, riskSummary }`;

// Steel-specific ETS thresholds
const STEEL_ETS_FREE_ALLOWANCE_PHASE4_END = '2025-12-31'; // Free allowances phase out

/**
 * Full CBAM Annex I steel & iron CN codes (Reg. 2023/956, Annex I Section 3)
 *
 * 7201–7229: Iron and steel primary/semi-finished products
 * 7301–7326: Articles of iron or steel
 *
 * Previous scope: 12 codes (7206–7217 only — semi-finished flat/long products)
 * Expanded scope: 52 codes — covers pig iron, ferro-alloys, scrap, wire, tubes,
 *   rails, sheet piling, structural sections, and downstream articles.
 *
 * Source: EUR-Lex Reg. 2023/956 Annex I, cross-checked with CBAM Implementing
 *         Regulation 2023/1773 Annex III default values table.
 */
const STEEL_CBAM_CN_CODES = [
  // Chapter 72 — Iron and steel (29 codes)
  '7201',
  '7202',
  '7203',
  '7204',
  '7205', // Pig iron, ferro-alloys, ferrous waste/scrap, granules, powder
  '7206',
  '7207',
  '7208',
  '7209',
  '7210', // Ingots, semis, flat-rolled hot, flat-rolled cold, flat-rolled coated
  '7211',
  '7212',
  '7213',
  '7214',
  '7215', // Flat narrow, flat coated narrow, bars hot-rolled, bars forged, bars cold
  '7216',
  '7217',
  '7218',
  '7219',
  '7220', // Angles/shapes, wire, stainless ingots, stainless flat hot, stainless flat cold
  '7221',
  '7222',
  '7223',
  '7224',
  '7225', // Stainless bars hot, stainless bars cold, stainless wire, alloy ingots, alloy flat
  '7226',
  '7227',
  '7228',
  '7229', // Alloy flat narrow, alloy bars hot, alloy bars cold, alloy wire

  // Chapter 73 — Articles of iron or steel (26 codes)
  '7301',
  '7302',
  '7303',
  '7304',
  '7305', // Sheet piling, rail track, tubes cast iron, tubes seamless, tubes welded >406mm
  '7306',
  '7307',
  '7308',
  '7309',
  '7310', // Tubes welded ≤406mm, fittings, structures, reservoirs >300L, tanks ≤300L
  '7311',
  '7312',
  '7313',
  '7314',
  '7315', // Compressed gas containers, stranded wire, barbed wire, cloth/grill, chain
  '7316',
  '7317',
  '7318',
  '7319',
  '7320', // Anchors, nails/tacks, screws/bolts, sewing needles/pins, springs
  '7321',
  '7322',
  '7323',
  '7324',
  '7325', // Stoves, radiators, table/kitchen articles, sanitary ware, castings
  '7326', // Other articles of iron or steel
];

/**
 * Check if a CN code falls within CBAM steel & iron scope.
 * Accepts 4-digit (heading) or 8-digit (full CN) codes.
 *
 * @param cnCode - Combined Nomenclature code (4 or 8 digits)
 * @returns true if the code is within CBAM Annex I steel & iron scope
 */
export function isCBAMSteelAndIron(cnCode: string): boolean {
  const heading = cnCode.slice(0, 4);
  return STEEL_CBAM_CN_CODES.includes(heading);
}

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
        'blast-furnace-eaf-analysis',
        'metals-industry-compliance',
        'steel-decarbonization-pathways',
      ],
      model: 'claude-haiku-4-5-20251001',
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

    let complianceResult: AgentResponse | null = null;
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

    const llmResult = await this.callLLM(
      `${SOUL}

Steel client data:
- Industry: ${industry}
- Production route: ${productionRoute} (emission factor: ${emissionFactor} tCO2/t steel)
- Annual production: ${annualProduction > 0 ? `${annualProduction.toLocaleString()} tonnes` : 'not provided'}
- Annual emissions: ${annualEmissions.toLocaleString()} tCO2e
- Import value: EUR ${importValue.toLocaleString()}
- CBAM applies: ${cbamApplies}
- CN codes in scope: ${STEEL_CBAM_CN_CODES.slice(0, 5).join(', ')}...
- ${etsPhase4PressureNote}
- Compliance score from Athena: ${complianceResult?.result?.overallScore ?? 'n/a'}/100
- Compliance gaps: ${JSON.stringify(complianceResult?.result?.gaps ?? [])}

Return JSON: {
  "etsFreeAllowanceGap": "description of ETS allowance gap and urgency",
  "cbamCarbonContent": "CBAM carbon content status and declaration requirements",
  "productionRouteRisk": "risk specific to blast furnace vs EAF pathway",
  "prioritizedActions": ["action1", "action2", "action3"],
  "riskSummary": "2-sentence summary for a steel CFO"
}`,
    );

    let synthesis = {
      etsFreeAllowanceGap: '',
      cbamCarbonContent: '',
      productionRouteRisk: '',
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
        etsPhase4PressureNote,
        ...synthesis,
        baseCompliance: complianceResult?.result ?? null,
      },
      confidence: complianceResult ? complianceResult.confidence * 0.9 + 0.1 : 0.5,
      reasoning: `Vulcan assessed ${industry} sector. Production route: ${productionRoute} (${emissionFactor} tCO2/t). CBAM applies: ${cbamApplies}. ${etsPhase4PressureNote}.`,
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
