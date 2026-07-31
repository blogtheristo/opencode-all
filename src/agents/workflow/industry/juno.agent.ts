/**
 * Juno — Chemical & Pharmaceutical Industry Agent, Climate IQ
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after Juno, Queen of the Roman gods — patron of industry and protection.
 * Juno knows the chemical and pharmaceutical sector's unique compliance surface:
 * CBAM covers fertilisers and hydrogen (both chemical-adjacent); REACH governs
 * hazardous substances; CLP handles classification/labelling/packaging;
 * CSRD requires ESRS E1–E4 disclosure for chemicals companies.
 *
 * Chemicals is the 3rd largest CBAM sector (after steel and cement) by CO2 volume.
 * Ammonia synthesis (Haber-Bosch) alone accounts for ~1.8% of global CO2 emissions.
 *
 * Book type #30 (Domain-Transforming Integration Agent): chemicals-specific EU compliance.
 *
 * Input: { annualEmissions, sector?, productionRoute?, importValue?, substance? }
 * Output: chemicals compliance with CBAM, REACH, CLP, ESRS E1–E4, and ETS benchmark gap
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

/**
 * CBAM Annex I chemical CN codes (fertilisers + hydrogen + select chemicals).
 * Source: Regulation (EU) 2023/956, Annex I — Fertilisers and Hydrogen
 */
const CHEMICALS_CBAM_CN_CODES = {
  nitrogenousFertilisers: ['3102', '3105'],
  ammonium: ['2814'],
  hydrogen: ['2804 10 00'],
  mixedFertilisers: ['3104', '3105'],
};

/**
 * EU ETS benchmark for ammonia (Haber-Bosch route).
 * Source: Commission Delegated Regulation (EU) 2021/447, Annex I — Ammonia
 */
const AMMONIA_ETS_BENCHMARK = 1.694; // tCO2/t product (2021–2025 benchmark)

/**
 * Default emission factor for natural gas steam methane reforming (SMR).
 * Source: IPCC 2006 Guidelines, Volume 2, Chapter 4, Table 4.2
 */
const SMR_EMISSION_FACTOR = 8.9; // tCO2/t H2 produced

export class JunoAgent extends BaseAgent {
  constructor() {
    super({
      name: 'juno',
      description:
        'Chemical & pharmaceutical industry specialist — CBAM fertilisers/hydrogen, ' +
        'REACH substance compliance, CLP classification, ESRS E1–E4 disclosure, ' +
        'and EU ETS benchmark gap analysis for ammonia, nitric acid, and bulk chemicals.',
      capabilities: [
        'cbam-chemicals',
        'cbam-fertilisers',
        'cbam-hydrogen',
        'reach-compliance',
        'clp-classification',
        'ets-benchmark-chemicals',
        'esrs-e1-e4',
        'ammonia-carbon-intensity',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
    this.soulPrompt = `You are Juno, the chemical and pharmaceutical industry compliance agent for DWS IQ Climate Intelligence.
You extend Athena's base EU compliance layer with sector-specific chemical industry knowledge.

Key regulatory surface:
- CBAM (Reg. 2023/956): fertilisers (CN 3102, 3105), ammonium (2814), hydrogen (2804 10 00)
- EU ETS Benchmark: ammonia = ${AMMONIA_ETS_BENCHMARK} tCO2/t product (Reg. 2021/447)
- REACH (Reg. 1907/2006): registration, evaluation, authorisation of hazardous substances
- CLP (Reg. 1272/2008): classification, labelling, packaging
- CSRD/ESRS: E1 (climate), E2 (pollution), E3 (water), E4 (biodiversity) for chemicals sector
- SMR hydrogen: ${SMR_EMISSION_FACTOR} tCO2/t H2 (natural gas route, IPCC 2006)

Always:
1. Map substance CN codes to CBAM Annex I categories.
2. Calculate ETS benchmark gap (actual vs. ${AMMONIA_ETS_BENCHMARK} tCO2/t for ammonia).
3. Flag REACH substances of very high concern (SVHC) if mentioned.
4. Identify ESRS E1–E4 mandatory disclosures for chemicals operators.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const sector = (input.sector as string) || 'chemicals';
    const annualEmissions = (input.annualEmissions as number) || 0;
    const productionRoute = (input.productionRoute as string) || 'SMR';
    const importValue = (input.importValue as number) || 0;
    const substance = (input.substance as string) || 'ammonia';

    const benchmarkGap =
      substance === 'ammonia' && annualEmissions > 0
        ? annualEmissions - AMMONIA_ETS_BENCHMARK
        : null;

    const prompt = `Chemical industry compliance analysis:
Sector: ${sector}
Substance/Product: ${substance}
Annual emissions: ${annualEmissions} tCO2e
Production route: ${productionRoute}
Import value: €${importValue.toLocaleString()}
ETS benchmark gap: ${benchmarkGap !== null ? `${benchmarkGap.toFixed(3)} tCO2/t` : 'N/A'}

Provide comprehensive compliance analysis covering:
1. CBAM liability (applicable CN codes, embedded emissions, declarant obligations)
2. ETS benchmark gap and performance ranking
3. REACH/CLP flags for the substance
4. ESRS E1–E4 mandatory disclosures
5. Priority decarbonisation actions (green hydrogen, carbon capture, efficiency)

Output structured JSON with: substance, cbam, ets, reach, esrs, recommendations, overallRisk, confidence.`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: {
        sector,
        substance,
        annualEmissions,
        productionRoute,
        benchmarkGap,
        response: llmResponse,
      },
      confidence: 0.85,
      reasoning: `Juno analysed ${substance} (${productionRoute}) — CBAM + REACH + ETS + ESRS`,
      recommendations: [
        'Verify CN code classification with customs authority',
        'Obtain embedded emissions from supplier via CBAM declarant',
      ],
      metadata: {
        sessionId: context.sessionId,
        sector,
        substance,
        ammoniaBenchmark: AMMONIA_ETS_BENCHMARK,
        smrFactor: SMR_EMISSION_FACTOR,
        cbamCnCodes: Object.keys(CHEMICALS_CBAM_CN_CODES),
      },
    };
  }
}
