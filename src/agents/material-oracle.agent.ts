/**
 * Material Oracle Agent - Carbon Footprint & Procurement Analysis
 *
 * Analyzes material carbon footprint using EN 15978 lifecycle stages
 * (A1-A5, B, C, D). Computes embodied carbon per material and suggests
 * lower-carbon alternatives based on industry emission factors.
 *
 * EN 15978 Lifecycle Stages:
 *   A1-A3: Product stage (raw material, transport to factory, manufacturing)
 *   A4:    Transport to site
 *   A5:    Construction/installation
 *   B1-B7: Use stage (maintenance, repair, replacement, energy, water)
 *   C1-C4: End of life (deconstruction, transport, waste processing, disposal)
 *   D:     Benefits beyond system boundary (reuse, recovery, recycling)
 *
 * Input: { materials: Array<{ name, quantity, unit, supplier }> }
 * Output: carbon breakdown per stage, total kgCO2e, alternatives
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';
import { type NormalizationResult, normalizeToKg } from './unit-normalization.js';
import { createEC3Client, type EC3CategoryStats, type EC3Client } from '../integrations/ec3/index.js';

// ============ EMISSION FACTORS DATABASE ============
// kgCO2e per unit (based on ICE Database v3 and EPD averages)

interface EmissionFactor {
  /** kgCO2e per unit for product stage A1-A3 */
  a1_a3: number;
  /** kgCO2e per unit for transport to site A4 */
  a4: number;
  /** kgCO2e per unit for construction A5 */
  a5: number;
  /** kgCO2e per unit for use stage B (annualized over 50yr) */
  b: number;
  /** kgCO2e per unit for end of life C1-C4 */
  c: number;
  /** kgCO2e per unit for beyond-boundary D (negative = benefit) */
  d: number;
  /** Unit of measurement */
  unit: string;
  /** Material category */
  category: string;
}

const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  concrete: {
    a1_a3: 0.132, a4: 0.012, a5: 0.005, b: 0.001, c: 0.015, d: -0.008,
    unit: 'kg', category: 'Structural',
  },
  steel: {
    a1_a3: 1.46, a4: 0.03, a5: 0.02, b: 0.005, c: 0.04, d: -0.35,
    unit: 'kg', category: 'Structural',
  },
  timber: {
    a1_a3: 0.31, a4: 0.02, a5: 0.01, b: 0.002, c: 0.03, d: -0.55,
    unit: 'kg', category: 'Structural',
  },
  aluminum: {
    a1_a3: 6.67, a4: 0.04, a5: 0.03, b: 0.01, c: 0.06, d: -3.5,
    unit: 'kg', category: 'Metals',
  },
  glass: {
    a1_a3: 1.44, a4: 0.025, a5: 0.015, b: 0.003, c: 0.05, d: -0.2,
    unit: 'kg', category: 'Facades',
  },
  brick: {
    a1_a3: 0.24, a4: 0.015, a5: 0.008, b: 0.001, c: 0.02, d: -0.01,
    unit: 'kg', category: 'Masonry',
  },
  insulation_mineral_wool: {
    a1_a3: 1.28, a4: 0.015, a5: 0.01, b: 0.0, c: 0.03, d: -0.15,
    unit: 'kg', category: 'Insulation',
  },
  insulation_eps: {
    a1_a3: 3.29, a4: 0.01, a5: 0.008, b: 0.0, c: 0.05, d: -0.1,
    unit: 'kg', category: 'Insulation',
  },
  cement: {
    a1_a3: 0.83, a4: 0.015, a5: 0.005, b: 0.002, c: 0.02, d: -0.015,
    unit: 'kg', category: 'Binders',
  },
  copper: {
    a1_a3: 3.81, a4: 0.03, a5: 0.02, b: 0.005, c: 0.04, d: -1.8,
    unit: 'kg', category: 'Metals',
  },
  plasterboard: {
    a1_a3: 0.39, a4: 0.02, a5: 0.01, b: 0.001, c: 0.025, d: -0.05,
    unit: 'kg', category: 'Internal Finishes',
  },
  rebar: {
    a1_a3: 1.99, a4: 0.03, a5: 0.015, b: 0.005, c: 0.04, d: -0.45,
    unit: 'kg', category: 'Structural',
  },
  // Lime products — dual-use critical raw material (steel flux, cement, decontamination)
  // Source: EU ETS Benchmark 2021-2025 (0.954 tCO2e/t lime)
  lime: {
    a1_a3: 0.954, a4: 0.02, a5: 0.008, b: 0.001, c: 0.018, d: -0.04,
    unit: 'kg', category: 'Binders',
  },
  quicklime: {
    a1_a3: 1.092, a4: 0.02, a5: 0.008, b: 0.001, c: 0.02, d: -0.035,
    unit: 'kg', category: 'Binders',
  },
  slaked_lime: {
    a1_a3: 0.742, a4: 0.018, a5: 0.007, b: 0.001, c: 0.015, d: -0.03,
    unit: 'kg', category: 'Binders',
  },
  limestone: {
    a1_a3: 0.032, a4: 0.015, a5: 0.005, b: 0.001, c: 0.01, d: -0.005,
    unit: 'kg', category: 'Aggregates',
  },
};

/** Lower-carbon alternatives lookup */
const ALTERNATIVES: Record<string, Array<{ name: string; reduction: number; note: string }>> = {
  concrete: [
    { name: 'Low-carbon concrete (30% GGBS)', reduction: 0.35, note: 'Replace 30% cement with GGBS' },
    { name: 'Geopolymer concrete', reduction: 0.60, note: 'Eliminates Portland cement entirely' },
  ],
  steel: [
    { name: 'Electric arc furnace (EAF) steel', reduction: 0.40, note: 'Recycled scrap-based production' },
    { name: 'Green hydrogen steel (HYBRIT)', reduction: 0.85, note: 'Available from SSAB (Nordic supply)' },
  ],
  aluminum: [
    { name: 'Recycled aluminum', reduction: 0.75, note: 'Uses 95% less energy than primary production' },
    { name: 'Hydro-powered primary aluminum', reduction: 0.50, note: 'Nordic smelters using hydroelectric power' },
  ],
  cement: [
    { name: 'LC3 cement (limestone calcined clay)', reduction: 0.40, note: 'Drop-in replacement' },
    { name: 'Cement with CCS', reduction: 0.90, note: 'Carbon capture at kiln - limited availability' },
  ],
  insulation_eps: [
    { name: 'Mineral wool insulation', reduction: 0.60, note: 'Lower embodied carbon, better fire resistance' },
    { name: 'Wood fiber insulation', reduction: 0.80, note: 'Bio-based, carbon-storing alternative' },
  ],
  brick: [
    { name: 'Unfired clay brick', reduction: 0.65, note: 'No kiln energy required' },
  ],
  glass: [
    { name: 'Recycled-content glass (50%)', reduction: 0.25, note: 'Widely available in EU market' },
  ],
  lime: [
    { name: 'Electric calcination lime (Litherm)', reduction: 0.90, note: 'Fully electric calcination — zero process CO2. SigmaRoc/Litherm EUR 6.5M seed (2026)' },
    { name: 'Lime with CCS', reduction: 0.85, note: 'Carbon capture at kiln — SigmaRoc Köping pilot operational' },
  ],
  quicklime: [
    { name: 'Electric calcination quicklime', reduction: 0.90, note: 'Litherm Technologies GmbH — eliminates combustion and process CO2' },
  ],
  limestone: [
    { name: 'Recycled calcium carbonate', reduction: 0.40, note: 'From water treatment sludge or paper mill waste' },
  ],
};

// ============ INPUT INTERFACE ============

interface MaterialInput {
  name: string;
  quantity: number;
  unit: string;
  supplier?: string;
}

interface MaterialOracleInput {
  materials: MaterialInput[];
}

// ============ AGENT IMPLEMENTATION ============

export class MaterialOracleAgent extends BaseAgent {
  private ec3Client: EC3Client | null;
  /** Cache EC3 lookups per session to avoid redundant API calls */
  private ec3Cache: Map<string, EC3CategoryStats> = new Map();

  constructor() {
    super({
      name: 'material-oracle',
      description:
        'Analyzes material carbon footprint using EN 15978 lifecycle stages and recommends lower-carbon alternatives',
      capabilities: [
        'embodied-carbon-calculation',
        'en-15978-lifecycle-analysis',
        'low-carbon-alternatives',
        'epd-based-estimation',
        'ec3-epd-lookup',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
    this.ec3Client = createEC3Client();
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    const matInput = input as unknown as MaterialOracleInput;
    const { materials } = matInput;

    logger.info('MaterialOracle agent executing', {
      materialCount: materials.length,
      ec3Available: this.ec3Client !== null,
      projectId: context.projectId,
      userId: context.userId,
    });

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      // 0. Pre-fetch EC3 data for all unique materials (parallel, cached)
      await this.prefetchEC3Data(materials);

      // 1. Compute carbon per material (uses EC3 data when available)
      const materialResults = materials.map((mat) => this.analyzeMaterial(mat));

      // 2. Aggregate totals per lifecycle stage
      const aggregated = this.aggregateByStage(materialResults);

      // 3. Find alternatives
      const alternativeSuggestions = this.findAlternatives(materialResults);

      // 4. Compute overall metrics
      const totalCO2 = aggregated.total;
      const materialCount = materials.length;
      const matchedCount = materialResults.filter((m) => m.matched).length;

      // 5. Build recommendations
      const recommendations = this.buildRecommendations(materialResults, aggregated, alternativeSuggestions);

      // 6. LLM enhancement
      const topMaterials = materialResults
        .sort((a, b) => b.totalCO2e - a.totalCO2e)
        .slice(0, 5)
        .map((m) => `${m.name}: ${Math.round(m.totalCO2e)} kgCO2e`)
        .join(', ');

      const llmResponse = await this.callLLM(
        `Analyze this construction project's carbon footprint and suggest procurement strategies:
Total embodied carbon: ${Math.round(totalCO2)} kgCO2e (${(totalCO2 / 1000).toFixed(1)} tCO2e)
Top materials by carbon: ${topMaterials}
Stage breakdown: A1-A3: ${Math.round(aggregated.a1_a3)} kg, A4: ${Math.round(aggregated.a4)} kg, A5: ${Math.round(aggregated.a5)} kg
EU regulations: EN 15978, CSRD, EU Taxonomy
Respond as JSON with keys: "procurementStrategy" (string), "regulatoryNotes" (string[])`,
      );

      let llmStrategy = '';
      try {
        const parsed = JSON.parse(llmResponse.content);
        llmStrategy = parsed.procurementStrategy || '';
        if (Array.isArray(parsed.regulatoryNotes)) {
          recommendations.push(...parsed.regulatoryNotes);
        }
      } catch {
        // Non-critical
      }

      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          totalCO2e: Math.round(totalCO2 * 100) / 100,
          totalTonnesCO2e: Math.round((totalCO2 / 1000) * 100) / 100,
          lifecycleBreakdown: {
            'A1-A3_product': Math.round(aggregated.a1_a3 * 100) / 100,
            'A4_transport': Math.round(aggregated.a4 * 100) / 100,
            'A5_construction': Math.round(aggregated.a5 * 100) / 100,
            'B_use': Math.round(aggregated.b * 100) / 100,
            'C_endOfLife': Math.round(aggregated.c * 100) / 100,
            'D_beyondBoundary': Math.round(aggregated.d * 100) / 100,
          },
          materials: materialResults.map((m) => ({
            name: m.name,
            quantity: m.quantity,
            unit: m.unit,
            quantityKg: Math.round(m.unitNormalization.quantityKg * 100) / 100,
            unitConversion: {
              factor: m.unitNormalization.conversionFactor,
              confidence: m.unitNormalization.confidence,
              method: m.unitNormalization.method,
            },
            dataSource: m.dataSource ?? 'ICE Database v3 / EPD averages (hardcoded)',
            ec3: m.ec3Stats ? {
              epdCount: m.ec3Stats.epdCount,
              confidence: m.ec3Stats.confidence,
              gwpRange: {
                p10: m.ec3Stats.gwpPerKg.p10,
                median: m.ec3Stats.gwpPerKg.median,
                p90: m.ec3Stats.gwpPerKg.p90,
              },
            } : undefined,
            matched: m.matched,
            category: m.category,
            totalCO2e: Math.round(m.totalCO2e * 100) / 100,
            stageBreakdown: {
              a1_a3: Math.round(m.a1_a3 * 100) / 100,
              a4: Math.round(m.a4 * 100) / 100,
              a5: Math.round(m.a5 * 100) / 100,
              b: Math.round(m.b * 100) / 100,
              c: Math.round(m.c * 100) / 100,
              d: Math.round(m.d * 100) / 100,
            },
            percentOfTotal: totalCO2 > 0
              ? Math.round((m.totalCO2e / totalCO2) * 10000) / 100
              : 0,
          })),
          alternatives: alternativeSuggestions,
          potentialSavings: {
            kgCO2e: Math.round(
              alternativeSuggestions.reduce((sum, a) => sum + a.savingsKgCO2e, 0) * 100,
            ) / 100,
            percentReduction: totalCO2 > 0
              ? Math.round(
                  (alternativeSuggestions.reduce((sum, a) => sum + a.savingsKgCO2e, 0) / totalCO2) * 10000,
                ) / 100
              : 0,
          },
          dataQuality: {
            materialCount,
            matchedCount,
            unmatchedCount: materialCount - matchedCount,
            coveragePercent: materialCount > 0
              ? Math.round((matchedCount / materialCount) * 100)
              : 0,
            unitConversions: {
              exact: materialResults.filter((m) => m.unitNormalization.confidence === 'exact').length,
              estimated: materialResults.filter((m) => m.unitNormalization.confidence === 'estimated').length,
              assumed: materialResults.filter((m) => m.unitNormalization.confidence === 'assumed').length,
            },
          },
          llmStrategy,
        },
        confidence: materialCount > 0 ? matchedCount / materialCount : 0.5,
        reasoning: `Analyzed ${materialCount} materials using EN 15978 lifecycle stages. ${matchedCount}/${materialCount} matched to emission factor database. Total embodied carbon: ${(totalCO2 / 1000).toFixed(1)} tCO2e. Product stage (A1-A3) accounts for ${totalCO2 > 0 ? Math.round((aggregated.a1_a3 / totalCO2) * 100) : 0}% of total.`,
        recommendations: [...new Set(recommendations)],
        metadata: {
          durationMs,
          llmModel: llmResponse.model,
          llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
          standard: 'EN 15978:2011',
          dataSource: this.ec3Client
            ? 'EC3/BuildingTransparency EPDs (primary) + ICE Database v3 (fallback)'
            : 'ICE Database v3 / EPD averages',
          ec3Connected: this.ec3Client !== null,
          ec3MaterialsEnriched: materialResults.filter((m) => m.ec3Stats && m.ec3Stats.confidence !== 'none').length,
          attribution: this.ec3Client
            ? 'EPD data provided by Building Transparency EC3 (https://buildingtransparency.org). Individual EPD links available in per-material ec3 field.'
            : undefined,
        },
      };

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input: input,
        output: response,
        status: 'completed',
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err) {
      const durationMs = Date.now() - startTime;
      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input: input,
        output: null,
        status: 'error',
        error_message: err instanceof Error ? err.message : String(err),
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });
      throw err;
    }
  }

  // ============ PRIVATE METHODS ============

  private analyzeMaterial(material: MaterialInput): {
    name: string;
    quantity: number;
    unit: string;
    matched: boolean;
    category: string;
    totalCO2e: number;
    a1_a3: number;
    a4: number;
    a5: number;
    b: number;
    c: number;
    d: number;
    unitNormalization: NormalizationResult;
    dataSource?: string;
    ec3Stats?: EC3CategoryStats;
  } {
    // Normalize material name for lookup
    const normalizedName = material.name.toLowerCase().replace(/[\s_-]+/g, '_');
    const factor = this.findEmissionFactor(normalizedName);

    // CRITICAL: Convert input quantity to kg before applying kgCO2e/kg factors.
    // Without this, m³/m²/tonne inputs produce silently wrong results.
    // e.g. 50 m³ concrete × 0.132 kgCO2e/kg = 6.6 (WRONG)
    //      50 m³ × 2400 kg/m³ × 0.132 = 15,840 (CORRECT — 240x difference)
    const normResult = normalizeToKg(material.name, material.quantity, material.unit);

    if (normResult.confidence === 'assumed') {
      logger.warn('MaterialOracle: unit normalization used fallback assumption', {
        material: material.name,
        originalUnit: material.unit,
        method: normResult.method,
      });
    }

    if (!factor) {
      // Unknown material - use conservative average estimate (0.5 kgCO2e/kg)
      const estimatedFactor = 0.5;
      const totalCO2e = normResult.quantityKg * estimatedFactor;
      return {
        name: material.name,
        quantity: material.quantity,
        unit: material.unit,
        matched: false,
        category: 'Unknown',
        totalCO2e,
        a1_a3: totalCO2e * 0.75,
        a4: totalCO2e * 0.08,
        a5: totalCO2e * 0.04,
        b: totalCO2e * 0.02,
        c: totalCO2e * 0.06,
        d: totalCO2e * -0.05,
        unitNormalization: normResult,
      };
    }

    // Check EC3 cache for real EPD data (medium+ confidence overrides hardcoded)
    const ec3Stats = this.ec3Cache.get(normalizedName);
    const confidentEC3 =
      ec3Stats && (ec3Stats.confidence === 'high' || ec3Stats.confidence === 'medium')
        ? ec3Stats
        : undefined;

    // Select factor source: EC3 EPD median (when confident) or hardcoded ICE/EPD average
    const effectiveFactor = confidentEC3
      ? {
          a1_a3: confidentEC3.gwpPerKg.median,
          a4: factor.a4,    // EC3 often lacks A4+ — keep hardcoded for transport/construction
          a5: factor.a5,
          b: factor.b,
          c: factor.c,
          d: factor.d,
        }
      : factor;

    const dataSource = confidentEC3
      ? `EC3 EPD median (${confidentEC3.epdCount} EPDs, ${confidentEC3.confidence} confidence)`
      : `ICE Database v3 / EPD averages (hardcoded)`;

    // Apply factors to normalized kg quantity
    const qtyKg = normResult.quantityKg;
    const a1_a3 = qtyKg * effectiveFactor.a1_a3;
    const a4 = qtyKg * effectiveFactor.a4;
    const a5 = qtyKg * effectiveFactor.a5;
    const b = qtyKg * effectiveFactor.b;
    const c = qtyKg * effectiveFactor.c;
    const d = qtyKg * effectiveFactor.d;
    // Total excludes D (beyond boundary, reported separately per EN 15978)
    const totalCO2e = a1_a3 + a4 + a5 + b + c;

    if (confidentEC3) {
      logger.info('MaterialOracle: using EC3 EPD data', {
        material: material.name,
        epdCount: confidentEC3.epdCount,
        confidence: confidentEC3.confidence,
        gwpMedian: confidentEC3.gwpPerKg.median,
        hardcodedA1A3: factor.a1_a3,
      });
    }

    return {
      name: material.name,
      quantity: material.quantity,
      unit: material.unit,
      matched: true,
      category: factor.category,
      totalCO2e,
      a1_a3,
      a4,
      a5,
      b,
      c,
      d,
      unitNormalization: normResult,
      dataSource,
      ec3Stats: ec3Stats ?? undefined,
    };
  }

  /**
   * Pre-fetch EC3 EPD data for all unique materials in the input.
   * Runs lookups in parallel and caches results for use in analyzeMaterial.
   * Gracefully degrades if EC3 is unavailable or API calls fail.
   */
  private async prefetchEC3Data(materials: MaterialInput[]): Promise<void> {
    const ec3Client = this.ec3Client;
    if (!ec3Client) return;

    const uniqueNames = [...new Set(
      materials.map((m) => m.name.toLowerCase().replace(/[\s_-]+/g, '_')),
    )];

    // Only fetch materials not already cached
    const toFetch = uniqueNames.filter((name) => !this.ec3Cache.has(name));
    if (toFetch.length === 0) return;

    logger.info('MaterialOracle: pre-fetching EC3 EPD data', {
      materials: toFetch,
    });

    const results = await Promise.allSettled(
      toFetch.map((name) => ec3Client.searchByMaterial(name)),
    );

    for (let i = 0; i < toFetch.length; i++) {
      const result = results[i];
      if (result.status === 'fulfilled') {
        this.ec3Cache.set(toFetch[i], result.value);
        if (result.value.epdCount > 0) {
          logger.info('MaterialOracle: EC3 data cached', {
            material: toFetch[i],
            epdCount: result.value.epdCount,
            confidence: result.value.confidence,
            gwpMedian: result.value.gwpPerKg.median,
          });
        }
      } else {
        logger.warn('MaterialOracle: EC3 fetch failed for material', {
          material: toFetch[i],
          error: result.reason?.message,
        });
      }
    }
  }

  private findEmissionFactor(name: string): EmissionFactor | null {
    // Direct match
    if (EMISSION_FACTORS[name]) return EMISSION_FACTORS[name];

    // Fuzzy match (check if key is contained in name)
    for (const [key, factor] of Object.entries(EMISSION_FACTORS)) {
      if (name.includes(key) || key.includes(name)) {
        return factor;
      }
    }

    return null;
  }

  private aggregateByStage(
    results: Array<{ a1_a3: number; a4: number; a5: number; b: number; c: number; d: number; totalCO2e: number }>,
  ) {
    const agg = { a1_a3: 0, a4: 0, a5: 0, b: 0, c: 0, d: 0, total: 0 };
    for (const r of results) {
      agg.a1_a3 += r.a1_a3;
      agg.a4 += r.a4;
      agg.a5 += r.a5;
      agg.b += r.b;
      agg.c += r.c;
      agg.d += r.d;
      agg.total += r.totalCO2e;
    }
    return agg;
  }

  private findAlternatives(
    results: Array<{ name: string; totalCO2e: number; matched: boolean }>,
  ): Array<{
    originalMaterial: string;
    alternative: string;
    savingsKgCO2e: number;
    reductionPercent: number;
    note: string;
  }> {
    const suggestions: Array<{
      originalMaterial: string;
      alternative: string;
      savingsKgCO2e: number;
      reductionPercent: number;
      note: string;
    }> = [];

    for (const mat of results) {
      if (!mat.matched) continue;
      const key = mat.name.toLowerCase().replace(/[\s_-]+/g, '_');
      const alts = this.findAlternativesForKey(key);

      for (const alt of alts) {
        suggestions.push({
          originalMaterial: mat.name,
          alternative: alt.name,
          savingsKgCO2e: Math.round(mat.totalCO2e * alt.reduction * 100) / 100,
          reductionPercent: Math.round(alt.reduction * 100),
          note: alt.note,
        });
      }
    }

    return suggestions.sort((a, b) => b.savingsKgCO2e - a.savingsKgCO2e);
  }

  private findAlternativesForKey(key: string): Array<{ name: string; reduction: number; note: string }> {
    if (ALTERNATIVES[key]) return ALTERNATIVES[key];
    for (const [altKey, alts] of Object.entries(ALTERNATIVES)) {
      if (key.includes(altKey) || altKey.includes(key)) return alts;
    }
    return [];
  }

  private buildRecommendations(
    results: Array<{ name: string; totalCO2e: number; matched: boolean; category: string }>,
    aggregated: { a1_a3: number; total: number },
    alternatives: Array<{ savingsKgCO2e: number }>,
  ): string[] {
    const recs: string[] = [];

    // Top contributor recommendation
    const sorted = [...results].sort((a, b) => b.totalCO2e - a.totalCO2e);
    if (sorted.length > 0 && sorted[0].totalCO2e > 0) {
      const top = sorted[0];
      const pct = aggregated.total > 0 ? Math.round((top.totalCO2e / aggregated.total) * 100) : 0;
      recs.push(
        `${top.name} accounts for ${pct}% of total embodied carbon - prioritize low-carbon alternatives for this material`,
      );
    }

    // Product stage dominance
    if (aggregated.total > 0 && aggregated.a1_a3 / aggregated.total > 0.7) {
      recs.push(
        'Product stage (A1-A3) dominates the carbon footprint - focus procurement on suppliers with verified EPDs and lower-carbon manufacturing',
      );
    }

    // Potential savings
    const totalSavings = alternatives.reduce((sum, a) => sum + a.savingsKgCO2e, 0);
    if (totalSavings > 0) {
      recs.push(
        `Switching to recommended alternatives could save ${(totalSavings / 1000).toFixed(1)} tCO2e (${aggregated.total > 0 ? Math.round((totalSavings / aggregated.total) * 100) : 0}% reduction)`,
      );
    }

    // Unmatched materials
    const unmatched = results.filter((r) => !r.matched);
    if (unmatched.length > 0) {
      recs.push(
        `${unmatched.length} material(s) not in database - request EPDs from suppliers for accurate carbon accounting: ${unmatched.map((u) => u.name).join(', ')}`,
      );
    }

    // CSRD compliance
    recs.push(
      'Ensure all material carbon data is documented per EN 15978 for CSRD reporting requirements (mandatory for large EU companies from 2025)',
    );

    return recs;
  }
}
