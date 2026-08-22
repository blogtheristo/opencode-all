/**
 * Viability Agent - Unit Economics & Carbon Credit Valuation
 *
 * Calculates project viability including ROI, payback period, NPV,
 * and carbon credit value based on EU ETS pricing. Provides a
 * composite viability score to support investment decisions.
 *
 * Input: { projectCost, revenue, carbonSaved, timeline, market }
 * Output: ROI, payback period, carbon credit value, viability score
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ MARKET PARAMETERS ============

/** EU ETS carbon price ranges (EUR per tonne CO2) */
const CARBON_PRICE = {
  /** Current EU ETS price (approximate Q1 2026) */
  current: 68,
  /** Conservative projection */
  low: 55,
  /** Base case projection */
  mid: 85,
  /** Optimistic / Fit for 55 aligned projection */
  high: 120,
};

/** Discount rate for NPV calculation */
const DEFAULT_DISCOUNT_RATE = 0.08; // 8% WACC typical for EU industrial

/** Inflation rate for revenue projection */
const INFLATION_RATE = 0.025; // 2.5% EU average

// ============ INPUT INTERFACE ============

interface ViabilityInput {
  /** Total project cost in EUR */
  projectCost: number;
  /** Annual revenue/savings in EUR */
  revenue: number;
  /** Annual carbon saved in tonnes CO2e */
  carbonSaved: number;
  /** Project timeline in years */
  timeline: number;
  /** Market context */
  market: string;
}

// ============ AGENT IMPLEMENTATION ============

export class ViabilityAgent extends BaseAgent {
  constructor() {
    super({
      name: 'viability',
      description:
        'Calculates project viability, ROI, payback period, NPV, and EU ETS carbon credit valuation',
      capabilities: [
        'roi-calculation',
        'payback-period',
        'npv-analysis',
        'carbon-credit-valuation',
        'viability-scoring',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
  }

  /** Normalize loose input into the strict ViabilityInput shape */
  private normalizeInput(input: Record<string, unknown>): ViabilityInput {
    const raw = input as {
      projectCost?: number;
      project_cost?: number;
      investment?: number;
      cost?: number;
      revenue?: number;
      annual_revenue?: number;
      annualRevenue?: number;
      savings?: number;
      carbonSaved?: number;
      carbon_saved?: number;
      co2Saved?: number;
      co2?: number;
      timeline?: number;
      years?: number;
      duration?: number;
      market?: string;
      industry?: string;
      sector?: string;
    };
    return {
      projectCost: raw.projectCost ?? raw.project_cost ?? raw.investment ?? raw.cost ?? 0,
      revenue: raw.revenue ?? raw.annual_revenue ?? raw.annualRevenue ?? raw.savings ?? 0,
      carbonSaved: raw.carbonSaved ?? raw.carbon_saved ?? raw.co2Saved ?? raw.co2 ?? 0,
      timeline: raw.timeline ?? raw.years ?? raw.duration ?? 5,
      market: raw.market ?? raw.industry ?? raw.sector ?? 'general',
    };
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    const { projectCost, revenue, carbonSaved, timeline, market } = this.normalizeInput(input);

    logger.info('Viability agent executing', {
      projectCost,
      timeline,
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
      // 1. Carbon credit valuation (3 scenarios)
      const carbonCredits = this.valuateCarbonCredits(carbonSaved, timeline);

      // 2. Total revenue including carbon credits (base case)
      const annualRevenueWithCarbon = revenue + carbonCredits.annual.mid;
      const totalRevenueWithCarbon = annualRevenueWithCarbon * timeline;

      // 3. Simple ROI
      const roi = projectCost > 0
        ? ((totalRevenueWithCarbon - projectCost) / projectCost) * 100
        : 0;

      // 4. Payback period (years)
      const paybackPeriod = annualRevenueWithCarbon > 0
        ? projectCost / annualRevenueWithCarbon
        : Infinity;

      // 5. NPV calculation
      const npv = this.calculateNPV(projectCost, annualRevenueWithCarbon, timeline, DEFAULT_DISCOUNT_RATE);

      // 6. IRR approximation
      const irr = this.approximateIRR(projectCost, annualRevenueWithCarbon, timeline);

      // 7. Sensitivity analysis (3 scenarios)
      const sensitivity = this.runSensitivity(projectCost, revenue, carbonSaved, timeline);

      // 8. Viability score (0-100)
      const viabilityScore = this.computeViabilityScore(roi, paybackPeriod, npv, timeline, irr);

      // 9. Build recommendations
      const recommendations = this.buildRecommendations(
        viabilityScore, roi, paybackPeriod, npv, carbonCredits, timeline, market,
      );

      // 10. LLM enhancement
      const llmResponse = await this.callLLM(
        `Evaluate this project's financial viability and provide strategic advice:
Project cost: EUR ${projectCost.toLocaleString()}
Annual revenue: EUR ${revenue.toLocaleString()}
Carbon saved: ${carbonSaved} tCO2e/year
Timeline: ${timeline} years
Market: ${market}
ROI: ${roi.toFixed(1)}%
Payback: ${paybackPeriod.toFixed(1)} years
NPV: EUR ${Math.round(npv).toLocaleString()}
Carbon credit value (base): EUR ${Math.round(carbonCredits.total.mid).toLocaleString()}
EU regulations: ETS, CBAM, Fit for 55
Respond as JSON with keys: "strategicAdvice" (string), "risks" (string[])`,
      );

      let llmAdvice = '';
      try {
        const parsed = JSON.parse(llmResponse.content);
        llmAdvice = parsed.strategicAdvice || '';
        if (Array.isArray(parsed.risks)) {
          recommendations.push(...parsed.risks);
        }
      } catch {
        // Non-critical
      }

      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          viabilityScore,
          viabilityRating: this.rateViability(viabilityScore),
          financials: {
            projectCost,
            annualRevenue: revenue,
            annualRevenueWithCarbon: Math.round(annualRevenueWithCarbon),
            totalRevenue: Math.round(totalRevenueWithCarbon),
            roi: Math.round(roi * 100) / 100,
            paybackPeriodYears: Math.round(paybackPeriod * 100) / 100,
            npv: Math.round(npv),
            irr: irr !== null ? Math.round(irr * 10000) / 100 : null,
            discountRate: DEFAULT_DISCOUNT_RATE * 100,
          },
          carbonCredits: {
            annualTonnesCO2e: carbonSaved,
            totalTonnesCO2e: carbonSaved * timeline,
            priceScenarios: {
              low: { pricePerTonne: CARBON_PRICE.low, annualValue: Math.round(carbonCredits.annual.low), totalValue: Math.round(carbonCredits.total.low) },
              mid: { pricePerTonne: CARBON_PRICE.mid, annualValue: Math.round(carbonCredits.annual.mid), totalValue: Math.round(carbonCredits.total.mid) },
              high: { pricePerTonne: CARBON_PRICE.high, annualValue: Math.round(carbonCredits.annual.high), totalValue: Math.round(carbonCredits.total.high) },
            },
            currentETSPrice: CARBON_PRICE.current,
          },
          sensitivity: {
            optimistic: {
              roi: Math.round(sensitivity.optimistic.roi * 100) / 100,
              npv: Math.round(sensitivity.optimistic.npv),
              payback: Math.round(sensitivity.optimistic.payback * 100) / 100,
            },
            base: {
              roi: Math.round(sensitivity.base.roi * 100) / 100,
              npv: Math.round(sensitivity.base.npv),
              payback: Math.round(sensitivity.base.payback * 100) / 100,
            },
            pessimistic: {
              roi: Math.round(sensitivity.pessimistic.roi * 100) / 100,
              npv: Math.round(sensitivity.pessimistic.npv),
              payback: Math.round(sensitivity.pessimistic.payback * 100) / 100,
            },
          },
          market,
          timeline,
          llmAdvice,
        },
        confidence: this.computeConfidence(projectCost, revenue, timeline),
        reasoning: `Project viability score ${viabilityScore}/100 (${this.rateViability(viabilityScore)}). ROI of ${roi.toFixed(1)}% over ${timeline} years with a payback period of ${paybackPeriod.toFixed(1)} years. NPV at ${DEFAULT_DISCOUNT_RATE * 100}% discount rate: EUR ${Math.round(npv).toLocaleString()}. Carbon credits at mid-case EU ETS pricing add EUR ${Math.round(carbonCredits.annual.mid).toLocaleString()}/year (${Math.round(carbonCredits.total.mid).toLocaleString()} total).`,
        recommendations: [...new Set(recommendations)],
        metadata: {
          durationMs,
          llmModel: llmResponse.model,
          llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
          carbonPriceSource: 'EU ETS Q1 2026 estimate',
          discountRate: DEFAULT_DISCOUNT_RATE,
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

  // ============ FINANCIAL CALCULATIONS ============

  private valuateCarbonCredits(
    annualTonnes: number,
    years: number,
  ): {
    annual: { low: number; mid: number; high: number };
    total: { low: number; mid: number; high: number };
  } {
    return {
      annual: {
        low: annualTonnes * CARBON_PRICE.low,
        mid: annualTonnes * CARBON_PRICE.mid,
        high: annualTonnes * CARBON_PRICE.high,
      },
      total: {
        low: annualTonnes * CARBON_PRICE.low * years,
        mid: annualTonnes * CARBON_PRICE.mid * years,
        high: annualTonnes * CARBON_PRICE.high * years,
      },
    };
  }

  private calculateNPV(
    investment: number,
    annualCashflow: number,
    years: number,
    discountRate: number,
  ): number {
    let npv = -investment;
    for (let year = 1; year <= years; year++) {
      // Apply inflation to annual cashflow
      const inflatedCashflow = annualCashflow * Math.pow(1 + INFLATION_RATE, year - 1);
      npv += inflatedCashflow / Math.pow(1 + discountRate, year);
    }
    return npv;
  }

  /** Approximate IRR using bisection method */
  private approximateIRR(
    investment: number,
    annualCashflow: number,
    years: number,
  ): number | null {
    if (investment <= 0 || annualCashflow <= 0) return null;

    let low = -0.5;
    let high = 5.0;
    const tolerance = 0.0001;
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      const mid = (low + high) / 2;
      const npvAtMid = this.npvAtRate(investment, annualCashflow, years, mid);

      if (Math.abs(npvAtMid) < tolerance) return mid;
      if (npvAtMid > 0) low = mid;
      else high = mid;
    }

    return (low + high) / 2;
  }

  private npvAtRate(investment: number, annualCashflow: number, years: number, rate: number): number {
    let npv = -investment;
    for (let year = 1; year <= years; year++) {
      npv += annualCashflow / Math.pow(1 + rate, year);
    }
    return npv;
  }

  private runSensitivity(
    projectCost: number,
    revenue: number,
    carbonSaved: number,
    timeline: number,
  ): {
    optimistic: { roi: number; npv: number; payback: number };
    base: { roi: number; npv: number; payback: number };
    pessimistic: { roi: number; npv: number; payback: number };
  } {
    const scenarios = [
      { label: 'pessimistic', revFactor: 0.8, carbonPrice: CARBON_PRICE.low, costFactor: 1.15 },
      { label: 'base', revFactor: 1.0, carbonPrice: CARBON_PRICE.mid, costFactor: 1.0 },
      { label: 'optimistic', revFactor: 1.2, carbonPrice: CARBON_PRICE.high, costFactor: 0.95 },
    ];

    const results: Record<string, { roi: number; npv: number; payback: number }> = {};

    for (const s of scenarios) {
      const adjCost = projectCost * s.costFactor;
      const adjRevenue = revenue * s.revFactor + carbonSaved * s.carbonPrice;
      const totalRev = adjRevenue * timeline;
      const roi = adjCost > 0 ? ((totalRev - adjCost) / adjCost) * 100 : 0;
      const npv = this.calculateNPV(adjCost, adjRevenue, timeline, DEFAULT_DISCOUNT_RATE);
      const payback = adjRevenue > 0 ? adjCost / adjRevenue : Infinity;
      results[s.label] = { roi, npv, payback: Math.min(payback, 999) };
    }

    return {
      optimistic: results['optimistic'],
      base: results['base'],
      pessimistic: results['pessimistic'],
    };
  }

  // ============ SCORING ============

  private computeViabilityScore(
    roi: number,
    paybackYears: number,
    npv: number,
    timeline: number,
    irr: number | null,
  ): number {
    let score = 0;

    // ROI component (0-30 points)
    if (roi >= 200) score += 30;
    else if (roi >= 100) score += 25;
    else if (roi >= 50) score += 20;
    else if (roi >= 20) score += 15;
    else if (roi >= 0) score += 8;
    else score += 0;

    // Payback period component (0-25 points)
    if (paybackYears <= 2) score += 25;
    else if (paybackYears <= 3) score += 22;
    else if (paybackYears <= 5) score += 18;
    else if (paybackYears <= 7) score += 12;
    else if (paybackYears <= timeline) score += 6;
    else score += 0;

    // NPV component (0-25 points)
    if (npv > 0) {
      // Positive NPV - scale by magnitude relative to investment
      const npvRatio = npv / Math.max(1, timeline * 10000);
      score += Math.min(25, Math.round(npvRatio * 5));
    }

    // IRR component (0-20 points)
    if (irr !== null) {
      if (irr >= 0.25) score += 20;
      else if (irr >= 0.15) score += 16;
      else if (irr >= 0.10) score += 12;
      else if (irr >= 0.05) score += 8;
      else if (irr >= 0) score += 4;
    }

    return Math.max(0, Math.min(100, score));
  }

  private rateViability(score: number): 'excellent' | 'good' | 'moderate' | 'marginal' | 'non-viable' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'moderate';
    if (score >= 20) return 'marginal';
    return 'non-viable';
  }

  private buildRecommendations(
    score: number,
    roi: number,
    payback: number,
    npv: number,
    carbonCredits: { annual: { mid: number }; total: { mid: number } },
    timeline: number,
    market: string,
  ): string[] {
    const recs: string[] = [];

    if (score >= 80) {
      recs.push('Strong project viability - recommend proceeding with implementation');
    } else if (score >= 60) {
      recs.push('Good viability with manageable risk - consider phased implementation to reduce upfront exposure');
    } else if (score >= 40) {
      recs.push('Moderate viability - explore cost reduction opportunities or additional revenue streams before committing');
    } else if (score >= 20) {
      recs.push('Marginal viability - requires significant improvement in revenue or cost assumptions to justify investment');
    } else {
      recs.push('Project does not meet viability thresholds under current assumptions - consider redesigning the project scope');
    }

    // Payback advice
    if (payback > timeline) {
      recs.push(`Payback period (${payback.toFixed(1)} years) exceeds project timeline (${timeline} years) - investment will not be recovered within the project lifecycle`);
    } else if (payback > 5) {
      recs.push(`Long payback period (${payback.toFixed(1)} years) - ensure project has adequate financing runway`);
    }

    // NPV advice
    if (npv < 0) {
      recs.push(`Negative NPV (EUR ${Math.round(npv).toLocaleString()}) at ${DEFAULT_DISCOUNT_RATE * 100}% discount rate - project destroys value under current assumptions`);
    }

    // Carbon credit advice
    if (carbonCredits.annual.mid > 0) {
      const carbonShare = roi > 0 ? (carbonCredits.total.mid / (carbonCredits.total.mid + timeline * 100000)) * 100 : 0;
      recs.push(`Carbon credits contribute EUR ${Math.round(carbonCredits.annual.mid).toLocaleString()}/year - monitor EU ETS price movements as they directly impact project economics`);
      if (carbonShare > 30) {
        recs.push('CAUTION: Carbon credit revenue is a significant portion of returns - consider hedging against EU ETS price volatility');
      }
    }

    // Market-specific
    if (market) {
      recs.push(`Consider ${market} sector-specific incentives and EU Green Deal funding programs that could improve project economics`);
    }

    return recs;
  }

  private computeConfidence(projectCost: number, revenue: number, timeline: number): number {
    let confidence = 0.8;

    // Longer timelines reduce confidence
    if (timeline > 10) confidence -= 0.15;
    else if (timeline > 5) confidence -= 0.05;

    // Very small or very large projects have more uncertainty
    if (projectCost < 10000 || projectCost > 100000000) confidence -= 0.1;

    // Revenue certainty
    if (revenue <= 0) confidence -= 0.15;

    return Math.max(0.3, Math.min(1.0, confidence));
  }
}
