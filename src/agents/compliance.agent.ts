/**
 * Compliance Agent V1.0 - EU Regulatory Compliance Engine
 *
 * Assesses project compliance against EU climate and AI regulations:
 * Fit for 55, ETS, CBAM, CSRD, and EU AI Act Article 12.
 *
 * Uses the deterministic scoring engine (src/compliance/scoring-engine.ts)
 * for CSRD/ETS/CBAM scoring with real ESRS data points, enhanced with
 * CBAM/ETS cost calculators and LLM analysis for remediation.
 *
 * Input: { projectId, industry, regulations, currentMeasures, annualEmissions, importValue, dataPoints? }
 * Output: compliance score, gap list, cost estimates, deadline urgency, audit report, recommendations
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';
import {
  type ComplianceScoringInput,
  type DataPointStatus,
  scoreCompliance,
} from '../compliance/scoring-engine.js';
import { estimateETSCost } from '../compliance/ets-calculator.js';
import { estimateCBAMCost } from '../compliance/cbam-calculator.js';
import { generateReport } from '../compliance/report-generator.js';
import { costBreakdownToLedger } from '../compliance/debit-credit-ledger.js';

// ============ REGULATORY THRESHOLDS ============

/** CBAM threshold: imports above this EUR value require carbon border reporting */
const CBAM_IMPORT_THRESHOLD_EUR = 150_000;

/** ETS threshold: installations emitting above this require allowances */
const ETS_EMISSIONS_THRESHOLD_TONNES = 25_000;

/** Regulation deadlines (ISO date strings) */
const REGULATION_DEADLINES: Record<string, { deadline: string; description: string }> = {
  'fit-for-55': {
    deadline: '2030-12-31',
    description: 'EU Fit for 55 package: 55% emissions reduction target vs 1990',
  },
  ets: {
    deadline: '2026-12-31',
    description: 'EU Emissions Trading System Phase 4 full auctioning',
  },
  cbam: {
    deadline: '2026-01-01',
    description: 'Carbon Border Adjustment Mechanism full implementation',
  },
  csrd: {
    deadline: '2025-01-01',
    description: 'Corporate Sustainability Reporting Directive (large companies)',
  },
  'eu-ai-act': {
    deadline: '2026-08-02',
    description: 'EU AI Act high-risk system compliance (Article 12 logging)',
  },
};

/**
 * Measure weights for regulations not covered by scoring engine (fit-for-55, eu-ai-act).
 *
 * DATA QUALITY: DRAFT — these are boolean checkbox scores, not real compliance analysis.
 * Fit-for-55 requires sector-specific pathway verification (not implemented).
 * EU AI Act Article 12 requires logging framework inspection (not implemented).
 * Scores from these two regs should be treated as INDICATIVE ONLY.
 */
const MEASURE_WEIGHTS: Record<string, Record<string, number>> = {
  'fit-for-55': {
    carbonReporting: 0.3,
    emissionsMonitoring: 0.4,
    supplyChainDueDiligence: 0.2,
    aiSystemLogging: 0.1,
  },
  'eu-ai-act': {
    carbonReporting: 0.05,
    emissionsMonitoring: 0.05,
    supplyChainDueDiligence: 0.1,
    aiSystemLogging: 0.8,
  },
};

/** Industry risk multipliers (higher = more regulatory scrutiny) */
const INDUSTRY_RISK: Record<string, number> = {
  energy: 1.0,
  manufacturing: 0.9,
  construction: 0.8,
  transport: 0.85,
  chemicals: 0.95,
  steel: 1.0,
  cement: 0.95,
  aluminium: 0.9,
  fertilizers: 0.9,
  hydrogen: 0.85,
  default: 0.7,
};

// ============ INPUT INTERFACE ============

interface ComplianceInput {
  projectId: string;
  industry: string;
  regulations: string[];
  currentMeasures: {
    carbonReporting: boolean;
    emissionsMonitoring: boolean;
    supplyChainDueDiligence: boolean;
    aiSystemLogging: boolean;
  };
  annualEmissions: number;
  importValue: number;
  dataPoints: DataPointStatus[];
}

// ============ AGENT IMPLEMENTATION ============

export class ComplianceAgent extends BaseAgent {
  constructor() {
    super({
      name: 'compliance',
      description:
        'Assesses EU regulatory compliance for climate and AI regulations including Fit for 55, ETS, CBAM, CSRD, and EU AI Act Article 12. Uses deterministic ESRS-based scoring engine with CBAM/ETS cost calculators.',
      capabilities: [
        'eu-regulation-compliance',
        'article-12-readiness',
        'carbon-boundary-check',
        'compliance-gap-analysis',
        'ets-cost-estimation',
        'cbam-cost-estimation',
      ],
      model: 'llama-3.3-70b-versatile',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          industry: {
            type: 'string',
            description: 'Industry sector (e.g., steel, cement, chemicals, construction)',
          },
          regulations: {
            type: 'array',
            items: { type: 'string', enum: ['fit-for-55', 'ets', 'cbam', 'csrd', 'eu-ai-act'] },
            description: 'Regulations to assess against',
          },
          currentMeasures: {
            type: 'object',
            properties: {
              carbonReporting: { type: 'boolean' },
              emissionsMonitoring: { type: 'boolean' },
              supplyChainDueDiligence: { type: 'boolean' },
              aiSystemLogging: { type: 'boolean' },
            },
            description: 'Current compliance measures in place',
          },
          annualEmissions: { type: 'number', description: 'Annual CO2 emissions in tonnes' },
          importValue: {
            type: 'number',
            description: 'Annual import value in EUR (for CBAM assessment)',
          },
          dataPoints: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                disclosureId: { type: 'string' },
                provided: { type: 'boolean' },
              },
            },
            description:
              'ESRS disclosure data points provided (optional — improves CSRD scoring accuracy)',
          },
        },
        required: ['industry', 'regulations'],
      },
    });
  }

  /** Normalize loose input into the strict ComplianceInput shape */
  private normalizeInput(input: Record<string, unknown>): ComplianceInput {
    const raw = input as Record<string, any>;
    return {
      projectId: raw.projectId ?? raw.project_id ?? raw.project ?? 'unknown',
      industry: raw.industry ?? 'default',
      regulations: Array.isArray(raw.regulations)
        ? raw.regulations
        : typeof raw.regulation === 'string'
          ? [raw.regulation]
          : ['ets', 'cbam', 'csrd'],
      currentMeasures: {
        carbonReporting: raw.currentMeasures?.carbonReporting ?? raw.carbonReporting ?? false,
        emissionsMonitoring:
          raw.currentMeasures?.emissionsMonitoring ?? raw.emissionsMonitoring ?? false,
        supplyChainDueDiligence:
          raw.currentMeasures?.supplyChainDueDiligence ?? raw.supplyChainDueDiligence ?? false,
        aiSystemLogging: raw.currentMeasures?.aiSystemLogging ?? raw.aiSystemLogging ?? false,
      },
      annualEmissions: raw.annualEmissions ?? raw.annual_emissions ?? raw.emissions ?? 0,
      importValue: raw.importValue ?? raw.import_value ?? raw.imports ?? 0,
      dataPoints: Array.isArray(raw.dataPoints) ? raw.dataPoints : [],
    };
  }

  /** Map agent input to the scoring engine's ComplianceScoringInput format */
  private mapToScoringInput(input: ComplianceInput): ComplianceScoringInput {
    return {
      industry: input.industry,
      dataPoints: input.dataPoints,
      annualEmissions: input.annualEmissions,
      importValue: input.importValue,
      hasTransitionPlan: input.currentMeasures.carbonReporting,
      hasEmissionsMonitoring: input.currentMeasures.emissionsMonitoring,
      hasSupplyChainDD: input.currentMeasures.supplyChainDueDiligence,
    };
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();

    const normalizedInput = this.normalizeInput(input);
    const { projectId, industry, regulations, currentMeasures, annualEmissions, importValue } =
      normalizedInput;

    logger.info('Compliance agent V1.0 executing', {
      projectId,
      industry,
      regulationCount: regulations.length,
      dataPointCount: normalizedInput.dataPoints.length,
      userId: context.userId,
    });

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      // 1. Run the real scoring engine for CSRD/ETS/CBAM
      const scoringInput = this.mapToScoringInput(normalizedInput);
      const scoringResult = scoreCompliance(scoringInput);

      // 2. Score regulations not covered by scoring engine (fit-for-55, eu-ai-act)
      const extraRegs = regulations.filter((r) => r === 'fit-for-55' || r === 'eu-ai-act');
      const extraScores = extraRegs.map((reg) =>
        this.scoreUncoveredRegulation(reg, currentMeasures, annualEmissions, importValue),
      );

      // 3. Merge regulation scores: scoring engine + agent-scored extras
      const engineScores = scoringResult.regulationScores.map((rs) => ({
        regulation: rs.regulation,
        score: rs.score,
        status: rs.status,
        dataPointsProvided: rs.dataPointsProvided,
        dataPointsRequired: rs.dataPointsRequired,
      }));

      // Filter engine scores to only include requested regulations
      const requestedEngineScores = engineScores.filter((rs) =>
        regulations.includes(rs.regulation),
      );

      const allRegulationScores = [...requestedEngineScores, ...extraScores];

      // 4. Compute overall score from all regulation scores
      const overallScore =
        allRegulationScores.length > 0
          ? Math.round(
              allRegulationScores.reduce((sum, rs) => sum + rs.score, 0) /
                allRegulationScores.length,
            )
          : scoringResult.overallScore;

      // 5. Merge gaps: scoring engine gaps + agent-specific gaps for extra regs
      const gaps = [...scoringResult.gaps, ...this.identifyExtraGaps(extraRegs, currentMeasures)];

      // 6. Compute deadline urgency (agent-specific, not in scoring engine)
      const deadlines = this.computeDeadlineUrgency(regulations);

      // 7. Industry risk factor
      const industryRisk = INDUSTRY_RISK[industry.toLowerCase()] ?? INDUSTRY_RISK.default;

      // 8. Cost estimates from real calculators
      const etsCost = estimateETSCost(annualEmissions);
      const cbamCost = estimateCBAMCost(annualEmissions, industry);

      // 9. Generate audit-ready report
      const report = generateReport(scoringResult, {
        name: projectId,
        industry,
        country: 'FI',
      });

      // 10. Build deterministic recommendations
      const recommendations = this.buildRecommendations(
        gaps,
        deadlines,
        industryRisk,
        annualEmissions,
        importValue,
        overallScore,
      );

      // 11. LLM enhancement for specific remediation strategies
      let llmRiskAssessment = '';
      let llmModel = '';
      let llmTokens = 0;

      try {
        const llmResponse = await this.callLLM(
          `Analyze EU regulatory compliance and suggest remediation priorities:
Industry: ${industry}
Regulations: ${regulations.join(', ')}
Compliance score: ${overallScore}/100
Data completeness: ${scoringResult.dataCompleteness}%
Gaps found: ${gaps.map((g) => `[${g.severity}] ${g.gap}`).join('; ')}
Annual emissions: ${annualEmissions} tonnes CO2e
Import value: EUR ${importValue.toLocaleString()}
ETS cost estimate: EUR ${etsCost.estimatedCost.toLocaleString()}
CBAM cost estimate: EUR ${cbamCost.estimatedCost.toLocaleString()}
Measures in place: carbon reporting=${currentMeasures.carbonReporting}, emissions monitoring=${currentMeasures.emissionsMonitoring}, supply chain DD=${currentMeasures.supplyChainDueDiligence}, AI logging=${currentMeasures.aiSystemLogging}
Respond as JSON with keys: "prioritizedActions" (string[]), "riskAssessment" (string)`,
        );

        llmModel = llmResponse.model;
        llmTokens = llmResponse.inputTokens + llmResponse.outputTokens;

        const parsed = JSON.parse(llmResponse.content);
        llmRiskAssessment = parsed.riskAssessment || '';
        if (Array.isArray(parsed.prioritizedActions)) {
          recommendations.push(...parsed.prioritizedActions);
        }
      } catch {
        // LLM enhancement is non-critical — deterministic scoring is the core
      }

      const durationMs = Date.now() - startTime;

      const complianceStatus =
        overallScore >= 80
          ? 'compliant'
          : overallScore >= 60
            ? 'mostly-compliant'
            : overallScore >= 40
              ? 'partially-compliant'
              : 'non-compliant';

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          projectId,
          industry,
          overallScore,
          complianceStatus,
          dataCompleteness: scoringResult.dataCompleteness,
          regulationScores: allRegulationScores,
          gaps,
          deadlines,
          industryRiskFactor: industryRisk,
          thresholds: {
            cbamApplies: importValue >= CBAM_IMPORT_THRESHOLD_EUR,
            etsApplies: annualEmissions >= ETS_EMISSIONS_THRESHOLD_TONNES,
            cbamImportThreshold: CBAM_IMPORT_THRESHOLD_EUR,
            etsEmissionsThreshold: ETS_EMISSIONS_THRESHOLD_TONNES,
          },
          costEstimates: {
            ets: etsCost,
            cbam: cbamCost,
          },
          ledger: scoringResult.costBreakdown
            ? costBreakdownToLedger(scoringResult.costBreakdown)
            : undefined,
          report,
          llmRiskAssessment,
        },
        confidence: this.computeConfidence(
          regulations,
          currentMeasures,
          normalizedInput.dataPoints,
        ),
        reasoning: `Compliance Engine V1.0: Overall score ${overallScore}/100 across ${regulations.length} regulations for ${industry} industry. ${scoringResult.dataCompleteness}% ESRS data completeness. ${gaps.length} compliance gaps identified (${gaps.filter((g) => g.severity === 'critical').length} critical). Industry risk factor: ${industryRisk}. ETS cost: EUR ${etsCost.estimatedCost.toLocaleString()}. CBAM cost: EUR ${cbamCost.estimatedCost.toLocaleString()}.${importValue >= CBAM_IMPORT_THRESHOLD_EUR ? ' CBAM reporting required.' : ''}${annualEmissions >= ETS_EMISSIONS_THRESHOLD_TONNES ? ' ETS allowances required.' : ''}`,
        recommendations: [...new Set(recommendations)],
        metadata: {
          durationMs,
          scoringEngine: 'v1.0',
          llmModel: llmModel || 'none',
          llmTokens,
          regulationsChecked: regulations.length,
          dataPointsProvided: normalizedInput.dataPoints.length,
        },
      };

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: response,
        status: 'completed',
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: null,
        status: 'error',
        error_message: err.message,
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });
      throw err;
    }
  }

  // ============ AGENT-SPECIFIC METHODS (not in scoring engine) ============

  /**
   * Score regulations not covered by the scoring engine (fit-for-55, eu-ai-act).
   * Uses measure-weight approach since these don't have ESRS-based scoring.
   */
  private scoreUncoveredRegulation(
    regulation: string,
    measures: ComplianceInput['currentMeasures'],
    emissions: number,
    _importValue: number,
  ): {
    regulation: string;
    score: number;
    status: string;
    dataQuality: string;
    dataPointsProvided: number;
    dataPointsRequired: number;
  } {
    const weights = MEASURE_WEIGHTS[regulation] || MEASURE_WEIGHTS['fit-for-55'];
    let score = 0;

    if (measures.carbonReporting) score += weights.carbonReporting * 100;
    if (measures.emissionsMonitoring) score += weights.emissionsMonitoring * 100;
    if (measures.supplyChainDueDiligence) score += weights.supplyChainDueDiligence * 100;
    if (measures.aiSystemLogging) score += weights.aiSystemLogging * 100;

    // Penalty for high emissions without monitoring (fit-for-55)
    if (
      regulation === 'fit-for-55' &&
      emissions >= ETS_EMISSIONS_THRESHOLD_TONNES &&
      !measures.emissionsMonitoring
    ) {
      score = Math.max(0, score - 20);
    }

    score = Math.round(score);

    return {
      regulation,
      score,
      status: score >= 80 ? 'compliant' : score >= 50 ? 'partial' : 'non-compliant',
      dataQuality: 'DRAFT_CHECKBOX_ONLY',
      dataPointsProvided: 0,
      dataPointsRequired: 0,
    };
  }

  /**
   * Identify gaps for regulations not covered by the scoring engine.
   */
  private identifyExtraGaps(
    regulations: string[],
    measures: ComplianceInput['currentMeasures'],
  ): { regulation: string; gap: string; severity: 'critical' | 'high' | 'medium' | 'low' }[] {
    const gaps: {
      regulation: string;
      gap: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
    }[] = [];

    for (const reg of regulations) {
      if (reg === 'fit-for-55') {
        if (!measures.carbonReporting) {
          gaps.push({ regulation: reg, gap: 'Carbon reporting not implemented', severity: 'high' });
        }
        if (!measures.emissionsMonitoring) {
          gaps.push({ regulation: reg, gap: 'Emissions monitoring not active', severity: 'high' });
        }
      }

      if (reg === 'eu-ai-act' && !measures.aiSystemLogging) {
        gaps.push({
          regulation: reg,
          gap: 'EU AI Act Article 12 automatic logging not implemented',
          severity: 'critical',
        });
      }
    }

    return gaps;
  }

  private computeDeadlineUrgency(
    regulations: string[],
  ): {
    regulation: string;
    deadline: string;
    daysRemaining: number;
    urgency: 'overdue' | 'urgent' | 'approaching' | 'comfortable';
  }[] {
    const now = new Date();

    return regulations
      .filter((reg) => REGULATION_DEADLINES[reg])
      .map((reg) => {
        const info = REGULATION_DEADLINES[reg];
        const deadlineDate = new Date(info.deadline);
        const daysRemaining = Math.ceil(
          (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        let urgency: 'overdue' | 'urgent' | 'approaching' | 'comfortable';
        if (daysRemaining < 0) urgency = 'overdue';
        else if (daysRemaining <= 90) urgency = 'urgent';
        else if (daysRemaining <= 365) urgency = 'approaching';
        else urgency = 'comfortable';

        return {
          regulation: reg,
          deadline: info.deadline,
          daysRemaining,
          urgency,
        };
      });
  }

  private buildRecommendations(
    gaps: { regulation: string; gap: string; severity: string }[],
    deadlines: { regulation: string; daysRemaining: number; urgency: string }[],
    industryRisk: number,
    emissions: number,
    importValue: number,
    overallScore: number,
  ): string[] {
    const recs: string[] = [];

    const criticalGaps = gaps.filter((g) => g.severity === 'critical');
    if (criticalGaps.length > 0) {
      recs.push(
        `URGENT: ${criticalGaps.length} critical compliance gaps require immediate attention: ${criticalGaps.map((g) => g.gap).join('; ')}`,
      );
    }

    const overdue = deadlines.filter((d) => d.urgency === 'overdue');
    if (overdue.length > 0) {
      recs.push(
        `OVERDUE: ${overdue.map((d) => d.regulation).join(', ')} deadline(s) have passed - implement retroactive compliance measures immediately`,
      );
    }

    const urgent = deadlines.filter((d) => d.urgency === 'urgent');
    if (urgent.length > 0) {
      recs.push(
        `${urgent.map((d) => `${d.regulation} (${d.daysRemaining} days remaining)`).join(', ')} - prioritize implementation plan`,
      );
    }

    if (emissions >= ETS_EMISSIONS_THRESHOLD_TONNES) {
      recs.push(
        `Annual emissions of ${emissions.toLocaleString()} tonnes CO2e exceed ETS threshold (${ETS_EMISSIONS_THRESHOLD_TONNES.toLocaleString()}) - ensure ETS allowance procurement strategy is in place`,
      );
    }

    if (importValue >= CBAM_IMPORT_THRESHOLD_EUR) {
      recs.push(
        `Import value EUR ${importValue.toLocaleString()} triggers CBAM reporting - establish carbon content verification for imported goods`,
      );
    }

    if (industryRisk >= 0.9) {
      recs.push(
        'High-risk industry classification - consider dedicated compliance officer and quarterly regulatory reviews',
      );
    }

    if (overallScore < 50) {
      recs.push(
        'Overall compliance score below 50% - develop a comprehensive compliance roadmap with milestones and assign accountability',
      );
    }

    if (gaps.some((g) => g.regulation === 'eu-ai-act')) {
      recs.push(
        'Implement EU AI Act Article 12 automatic logging: traceability, decision provenance, and retention policies before August 2026 deadline',
      );
    }

    return recs;
  }

  private computeConfidence(
    regulations: string[],
    measures: ComplianceInput['currentMeasures'],
    dataPoints: DataPointStatus[],
  ): number {
    let confidence = 0.8;

    // Known regulations increase confidence
    const knownRegs = regulations.filter((r) => REGULATION_DEADLINES[r]);
    if (knownRegs.length === regulations.length) confidence += 0.1;
    else if (knownRegs.length === 0) confidence -= 0.2;

    // More measures data = higher confidence
    const measureCount = Object.values(measures).filter(Boolean).length;
    if (measureCount >= 3) confidence += 0.05;

    // ESRS data points increase confidence significantly
    if (dataPoints.length > 0) confidence += 0.05;

    return Math.max(0.3, Math.min(1.0, confidence));
  }
}
