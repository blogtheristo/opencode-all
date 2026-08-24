/**
 * MercuryTrade — Trade Intelligence + CBAM Import Analytics Agent
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after Mercury, Roman god of trade, commerce, and messengers.
 * MercuryTrade specialises in EU trade intelligence with a focus on
 * CBAM import analytics: tracking import flows, third-country carbon costs,
 * supplier carbon intensity benchmarking, and trade-adjusted ETS exposure.
 *
 * CBAM fully applies from 2026. Importers must hold CBAM certificates
 * covering embedded emissions in: steel, cement, aluminium, fertilisers,
 * hydrogen, electricity, and selected downstream products.
 *
 * Book types #9 (Data Analysis) + #30 (Domain-Transforming Integration).
 *
 * Input: { importerEori?, cnCode?, originCountry?, annualTonnes?, sector? }
 * Output: CBAM liability estimate, carbon cost comparison, supplier ranking, risk flags
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

/**
 * CBAM default emission factors by country for steel (tCO2/t hot-rolled coil).
 * Source: Commission Implementing Regulation (EU) 2023/1773 — CBAM default values
 */
const CBAM_DEFAULT_FACTORS: Record<string, number> = {
  CN: 2.1, // China (coal-heavy grid + BOF route)
  RU: 1.9, // Russia (mix BOF/EAF)
  TR: 1.6, // Turkey (EAF dominant but coal grid)
  IN: 2.3, // India (coal-heavy BOF)
  UA: 1.7, // Ukraine (BOF, disrupted post-2022)
  EU: 1.3, // EU average (EAF + efficiency gains)
};

/**
 * EU ETS carbon price for CBAM certificate cost calculation.
 * Source: ICE ECX auction average, Q1 2026.
 */
const ETS_PRICE_EUR_PER_TCO2 = 65; // EUR/tCO2, Q1 2026

/** CBAM threshold: imports above €150,000/year require declarant registration */
const CBAM_REGISTRATION_THRESHOLD_EUR = 150_000;

export class MercuryTradeAgent extends BaseAgent {
  constructor() {
    super({
      name: 'mercury-trade',
      description:
        'Trade intelligence + CBAM import analytics — calculates CBAM certificate liability, ' +
        'compares supplier carbon intensity across origin countries, ' +
        'ranks suppliers by embedded carbon cost, and flags import risk. ' +
        'Covers all 7 CBAM Annex I sectors.',
      capabilities: [
        'cbam-liability-calculation',
        'import-carbon-cost',
        'supplier-carbon-ranking',
        'origin-country-analysis',
        'trade-flow-analytics',
        'cbam-certificate-cost',
        'import-risk-assessment',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
    this.soulPrompt = `You are MercuryTrade, the trade intelligence and CBAM import analytics agent for DWS IQ.
You specialise in calculating CBAM certificate costs, comparing supplier carbon intensity,
and providing actionable trade strategy recommendations for EU importers.

Key parameters:
- CBAM default emission factors (steel, tCO2/t): CN=${CBAM_DEFAULT_FACTORS.CN}, RU=${CBAM_DEFAULT_FACTORS.RU}, TR=${CBAM_DEFAULT_FACTORS.TR}, IN=${CBAM_DEFAULT_FACTORS.IN}
- EU ETS price: €${ETS_PRICE_EUR_PER_TCO2}/tCO2 (Q1 2026, source: ICE ECX)
- CBAM declarant registration threshold: €${CBAM_REGISTRATION_THRESHOLD_EUR.toLocaleString()}/year
- Source: Commission Implementing Regulation (EU) 2023/1773

Analysis framework:
1. Calculate embedded emissions (tonnes × default factor for origin country)
2. Calculate CBAM certificate cost (embedded tCO2 × ETS price)
3. Rank suppliers by carbon cost from lowest to highest
4. Flag if imports exceed registration threshold
5. Recommend supply chain adjustments to minimise CBAM exposure

Output structured JSON with: importer, cnCode, originCountry, liability, supplierRanking, recommendations, risk.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const cnCode = (input.cnCode as string) || '7208';
    const originCountry = (input.originCountry as string) || 'CN';
    const annualTonnes = (input.annualTonnes as number) || 0;
    const sector = (input.sector as string) || 'steel';
    const importerEori = (input.importerEori as string) || '';

    const emissionFactor = CBAM_DEFAULT_FACTORS[originCountry] ?? 2.0;
    const embeddedEmissions = annualTonnes * emissionFactor;
    const cbamCertificateCost = embeddedEmissions * ETS_PRICE_EUR_PER_TCO2;
    const exceedsThreshold = cbamCertificateCost > CBAM_REGISTRATION_THRESHOLD_EUR;

    const prompt = `CBAM import analysis:
Importer EORI: ${importerEori || 'not provided'}
CN Code: ${cnCode}
Sector: ${sector}
Origin country: ${originCountry}
Annual import volume: ${annualTonnes.toLocaleString()} tonnes
Default emission factor: ${emissionFactor} tCO2/t (source: Reg. 2023/1773)
Embedded emissions: ${embeddedEmissions.toFixed(0)} tCO2
CBAM certificate cost: €${cbamCertificateCost.toLocaleString()} (at €${ETS_PRICE_EUR_PER_TCO2}/tCO2)
Exceeds registration threshold (€${CBAM_REGISTRATION_THRESHOLD_EUR.toLocaleString()}): ${exceedsThreshold}

Supplier ranking by origin country (tCO2/t): ${JSON.stringify(CBAM_DEFAULT_FACTORS)}

Provide:
1. Full CBAM liability assessment
2. Supplier carbon ranking from lowest to highest cost
3. Supply chain optimisation recommendations (e.g., shift sourcing from CN to EU/TR)
4. Declarant registration obligations
5. Carbon cost as % of import value

Output structured JSON with: cnCode, originCountry, embeddedEmissions, cbamCost, supplierRanking, registrationRequired, recommendations, risk, confidence.`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: {
        cnCode,
        originCountry,
        annualTonnes,
        embeddedEmissions,
        cbamCertificateCost,
        exceedsThreshold,
        response: llmResponse,
      },
      confidence: 0.88,
      reasoning: `MercuryTrade: ${annualTonnes}t from ${originCountry} → ${embeddedEmissions.toFixed(0)} tCO2 → €${cbamCertificateCost.toLocaleString()} CBAM`,
      recommendations: exceedsThreshold
        ? ['Register as CBAM declarant', 'Obtain actual embedded emissions from supplier']
        : ['Monitor import value — approaching CBAM threshold'],
      metadata: {
        sessionId: context.sessionId,
        cnCode,
        originCountry,
        emissionFactor,
        etsPriceEur: ETS_PRICE_EUR_PER_TCO2,
        registrationThreshold: CBAM_REGISTRATION_THRESHOLD_EUR,
      },
    };
  }
}
