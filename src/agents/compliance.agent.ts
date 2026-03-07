/**
 * Compliance Agent - EU Regulatory Compliance Monitoring
 *
 * Assesses project compliance against EU climate and AI regulations:
 * Fit for 55, ETS, CBAM, CSRD, and EU AI Act Article 12.
 *
 * Uses deterministic scoring against known regulatory thresholds,
 * enhanced with LLM analysis for gap identification and remediation.
 *
 * Input: { projectId, industry, regulations, currentMeasures, annualEmissions, importValue }
 * Output: compliance score, gap list, deadline urgency, remediation recommendations
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

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
  'ets': {
    deadline: '2026-12-31',
    description: 'EU Emissions Trading System Phase 4 full auctioning',
  },
  'cbam': {
    deadline: '2026-01-01',
    description: 'Carbon Border Adjustment Mechanism full implementation',
  },
  'csrd': {
    deadline: '2025-01-01',
    description: 'Corporate Sustainability Reporting Directive (large companies)',
  },
  'eu-ai-act': {
    deadline: '2026-08-02',
    description: 'EU AI Act high-risk system compliance (Article 12 logging)',
  },
};

/** Compliance measure weights per regulation */
const MEASURE_WEIGHTS: Record<string, Record<string, number>> = {
  'fit-for-55': {
    carbonReporting: 0.30,
    emissionsMonitoring: 0.40,
    supplyChainDueDiligence: 0.20,
    aiSystemLogging: 0.10,
  },
  'ets': {
    carbonReporting: 0.35,
    emissionsMonitoring: 0.45,
    supplyChainDueDiligence: 0.10,
    aiSystemLogging: 0.10,
  },
  'cbam': {
    carbonReporting: 0.25,
    emissionsMonitoring: 0.25,
    supplyChainDueDiligence: 0.40,
    aiSystemLogging: 0.10,
  },
  'csrd': {
    carbonReporting: 0.30,
    emissionsMonitoring: 0.25,
    supplyChainDueDiligence: 0.25,
    aiSystemLogging: 0.20,
  },
  'eu-ai-act': {
    carbonReporting: 0.05,
    emissionsMonitoring: 0.05,
    supplyChainDueDiligence: 0.10,
    aiSystemLogging: 0.80,
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
}

// ============ AGENT IMPLEMENTATION ============

export class ComplianceAgent extends BaseAgent {
  constructor() {
    super({
      name: 'compliance',
      description:
        'Assesses EU regulatory compliance for climate and AI regulations including Fit for 55, ETS, CBAM, CSRD, and EU AI Act Article 12',
      capabilities: [
        'eu-regulation-compliance',
        'article-12-readiness',
        'carbon-boundary-check',
        'compliance-gap-analysis',
      ],
      model: 'llama-3.3-70b-versatile',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          industry: { type: 'string', description: 'Industry sector (e.g., steel, cement, chemicals, construction)' },
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
          importValue: { type: 'number', description: 'Annual import value in EUR (for CBAM assessment)' },
        },
        required: ['industry', 'regulations'],
      },
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    const compInput = input as unknown as ComplianceInput;
    const { projectId, industry, regulations, currentMeasures, annualEmissions, importValue } =
      compInput;

    logger.info('Compliance agent executing', {
      projectId,
      industry,
      regulationCount: regulations.length,
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
      // 1. Score each regulation
      const regulationScores = regulations.map((reg) =>
        this.scoreRegulation(reg, currentMeasures, annualEmissions, importValue),
      );

      // 2. Compute overall compliance score
      const overallScore = this.computeOverallScore(regulationScores);

      // 3. Identify gaps
      const gaps = this.identifyGaps(regulations, currentMeasures, annualEmissions, importValue);

      // 4. Compute deadline urgency
      const deadlines = this.computeDeadlineUrgency(regulations);

      // 5. Industry risk factor
      const industryRisk = INDUSTRY_RISK[industry.toLowerCase()] ?? INDUSTRY_RISK.default;

      // 6. Build deterministic recommendations
      const recommendations = this.buildRecommendations(
        gaps,
        deadlines,
        industryRisk,
        annualEmissions,
        importValue,
        overallScore,
      );

      // 7. LLM enhancement for specific remediation strategies
      const llmResponse = await this.callLLM(
        `Analyze EU regulatory compliance and suggest remediation priorities:
Industry: ${industry}
Regulations: ${regulations.join(', ')}
Compliance score: ${overallScore}/100
Gaps found: ${gaps.map((g) => g.gap).join('; ')}
Annual emissions: ${annualEmissions} tonnes CO2e
Import value: EUR ${importValue.toLocaleString()}
Measures in place: carbon reporting=${currentMeasures.carbonReporting}, emissions monitoring=${currentMeasures.emissionsMonitoring}, supply chain DD=${currentMeasures.supplyChainDueDiligence}, AI logging=${currentMeasures.aiSystemLogging}
Respond as JSON with keys: "prioritizedActions" (string[]), "riskAssessment" (string)`,
      );

      let llmRiskAssessment = '';
      try {
        const parsed = JSON.parse(llmResponse.content);
        llmRiskAssessment = parsed.riskAssessment || '';
        if (Array.isArray(parsed.prioritizedActions)) {
          recommendations.push(...parsed.prioritizedActions);
        }
      } catch {
        // Non-critical
      }

      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          projectId,
          industry,
          overallScore,
          complianceStatus: this.classifyCompliance(overallScore),
          regulationScores: regulationScores.map((rs) => ({
            regulation: rs.regulation,
            score: rs.score,
            status: rs.score >= 80 ? 'compliant' : rs.score >= 50 ? 'partial' : 'non-compliant',
          })),
          gaps,
          deadlines,
          industryRiskFactor: industryRisk,
          thresholds: {
            cbamApplies: importValue >= CBAM_IMPORT_THRESHOLD_EUR,
            etsApplies: annualEmissions >= ETS_EMISSIONS_THRESHOLD_TONNES,
            cbamImportThreshold: CBAM_IMPORT_THRESHOLD_EUR,
            etsEmissionsThreshold: ETS_EMISSIONS_THRESHOLD_TONNES,
          },
          llmRiskAssessment,
        },
        confidence: this.computeConfidence(regulations, currentMeasures),
        reasoning: `Overall compliance score ${overallScore}/100 across ${regulations.length} regulations for ${industry} industry. ${gaps.length} compliance gaps identified. Industry risk factor: ${industryRisk}. ${importValue >= CBAM_IMPORT_THRESHOLD_EUR ? 'CBAM reporting required.' : ''} ${annualEmissions >= ETS_EMISSIONS_THRESHOLD_TONNES ? 'ETS allowances required.' : ''}`,
        recommendations: [...new Set(recommendations)],
        metadata: {
          durationMs,
          llmModel: llmResponse.model,
          llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
          regulationsChecked: regulations.length,
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

  // ============ SCORING METHODS ============

  private scoreRegulation(
    regulation: string,
    measures: ComplianceInput['currentMeasures'],
    emissions: number,
    importValue: number,
  ): { regulation: string; score: number } {
    const weights = MEASURE_WEIGHTS[regulation] || MEASURE_WEIGHTS['fit-for-55'];
    let score = 0;

    // Score based on measures in place
    if (measures.carbonReporting) score += weights.carbonReporting * 100;
    if (measures.emissionsMonitoring) score += weights.emissionsMonitoring * 100;
    if (measures.supplyChainDueDiligence) score += weights.supplyChainDueDiligence * 100;
    if (measures.aiSystemLogging) score += weights.aiSystemLogging * 100;

    // Penalty for high emissions without monitoring
    if (regulation === 'ets' && emissions >= ETS_EMISSIONS_THRESHOLD_TONNES && !measures.emissionsMonitoring) {
      score = Math.max(0, score - 20);
    }

    // Penalty for high imports without supply chain DD
    if (regulation === 'cbam' && importValue >= CBAM_IMPORT_THRESHOLD_EUR && !measures.supplyChainDueDiligence) {
      score = Math.max(0, score - 20);
    }

    return { regulation, score: Math.round(score) };
  }

  private computeOverallScore(regulationScores: { regulation: string; score: number }[]): number {
    if (regulationScores.length === 0) return 0;
    const sum = regulationScores.reduce((acc, rs) => acc + rs.score, 0);
    return Math.round(sum / regulationScores.length);
  }

  private identifyGaps(
    regulations: string[],
    measures: ComplianceInput['currentMeasures'],
    emissions: number,
    importValue: number,
  ): { regulation: string; gap: string; severity: 'critical' | 'high' | 'medium' | 'low' }[] {
    const gaps: { regulation: string; gap: string; severity: 'critical' | 'high' | 'medium' | 'low' }[] = [];

    for (const reg of regulations) {
      if (!measures.carbonReporting) {
        gaps.push({
          regulation: reg,
          gap: 'Carbon reporting not implemented',
          severity: reg === 'csrd' || reg === 'ets' ? 'critical' : 'high',
        });
      }

      if (!measures.emissionsMonitoring && (reg === 'ets' || reg === 'fit-for-55')) {
        gaps.push({
          regulation: reg,
          gap: 'Emissions monitoring not active',
          severity: emissions >= ETS_EMISSIONS_THRESHOLD_TONNES ? 'critical' : 'high',
        });
      }

      if (!measures.supplyChainDueDiligence && reg === 'cbam') {
        gaps.push({
          regulation: reg,
          gap: 'Supply chain due diligence missing for CBAM',
          severity: importValue >= CBAM_IMPORT_THRESHOLD_EUR ? 'critical' : 'medium',
        });
      }

      if (!measures.aiSystemLogging && reg === 'eu-ai-act') {
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
  ): { regulation: string; deadline: string; daysRemaining: number; urgency: 'overdue' | 'urgent' | 'approaching' | 'comfortable' }[] {
    const now = new Date();

    return regulations
      .filter((reg) => REGULATION_DEADLINES[reg])
      .map((reg) => {
        const info = REGULATION_DEADLINES[reg];
        const deadlineDate = new Date(info.deadline);
        const daysRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

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

  private classifyCompliance(score: number): 'compliant' | 'mostly-compliant' | 'partially-compliant' | 'non-compliant' {
    if (score >= 80) return 'compliant';
    if (score >= 60) return 'mostly-compliant';
    if (score >= 40) return 'partially-compliant';
    return 'non-compliant';
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

    // Critical gaps first
    const criticalGaps = gaps.filter((g) => g.severity === 'critical');
    if (criticalGaps.length > 0) {
      recs.push(
        `URGENT: ${criticalGaps.length} critical compliance gaps require immediate attention: ${criticalGaps.map((g) => g.gap).join('; ')}`,
      );
    }

    // Overdue deadlines
    const overdue = deadlines.filter((d) => d.urgency === 'overdue');
    if (overdue.length > 0) {
      recs.push(
        `OVERDUE: ${overdue.map((d) => d.regulation).join(', ')} deadline(s) have passed - implement retroactive compliance measures immediately`,
      );
    }

    // Urgent deadlines
    const urgent = deadlines.filter((d) => d.urgency === 'urgent');
    if (urgent.length > 0) {
      recs.push(
        `${urgent.map((d) => `${d.regulation} (${d.daysRemaining} days remaining)`).join(', ')} - prioritize implementation plan`,
      );
    }

    // ETS-specific
    if (emissions >= ETS_EMISSIONS_THRESHOLD_TONNES) {
      recs.push(
        `Annual emissions of ${emissions.toLocaleString()} tonnes CO2e exceed ETS threshold (${ETS_EMISSIONS_THRESHOLD_TONNES.toLocaleString()}) - ensure ETS allowance procurement strategy is in place`,
      );
    }

    // CBAM-specific
    if (importValue >= CBAM_IMPORT_THRESHOLD_EUR) {
      recs.push(
        `Import value EUR ${importValue.toLocaleString()} triggers CBAM reporting - establish carbon content verification for imported goods`,
      );
    }

    // High industry risk
    if (industryRisk >= 0.9) {
      recs.push(
        'High-risk industry classification - consider dedicated compliance officer and quarterly regulatory reviews',
      );
    }

    // Low overall score
    if (overallScore < 50) {
      recs.push(
        'Overall compliance score below 50% - develop a comprehensive compliance roadmap with milestones and assign accountability',
      );
    }

    // AI Act specific
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
  ): number {
    let confidence = 0.80;

    // Known regulations increase confidence
    const knownRegs = regulations.filter((r) => REGULATION_DEADLINES[r]);
    if (knownRegs.length === regulations.length) confidence += 0.10;
    else if (knownRegs.length === 0) confidence -= 0.20;

    // More measures data = higher confidence
    const measureCount = Object.values(measures).filter(Boolean).length;
    if (measureCount >= 3) confidence += 0.05;

    return Math.max(0.3, Math.min(1.0, confidence));
  }
}
