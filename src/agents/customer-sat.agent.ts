/**
 * Customer Satisfaction Agent - Customer Health & Churn Analysis
 *
 * Analyzes customer satisfaction metrics, predicts churn probability,
 * and recommends retention actions. Uses a weighted scoring model
 * based on NPS, support ticket trends, interaction recency, and
 * contract value.
 *
 * Input: { customerId, interactions, npsScore, openTickets, contractValue }
 * Output: health score, churn probability, recommended actions
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ SCORING WEIGHTS ============

/** Weights for composite health score (sum = 1.0) */
const WEIGHTS = {
  nps: 0.30,
  ticketLoad: 0.25,
  interactionRecency: 0.25,
  contractValue: 0.20,
};

/** NPS classification thresholds */
const NPS_THRESHOLDS = {
  promoter: 9,    // 9-10
  passive: 7,     // 7-8
  detractor: 0,   // 0-6
};

/** Open ticket thresholds (per EUR 100k contract value) */
const TICKET_RISK_THRESHOLDS = {
  healthy: 1,
  moderate: 3,
  critical: 5,
};

// ============ INPUT INTERFACE ============

interface CustomerSatInput {
  customerId: string;
  /** Number of interactions in last 90 days (meetings, calls, emails) */
  interactions: number;
  /** Net Promoter Score 0-10 */
  npsScore: number;
  /** Currently open support tickets */
  openTickets: number;
  /** Annual contract value in EUR */
  contractValue: number;
}

// ============ AGENT IMPLEMENTATION ============

export class CustomerSatAgent extends BaseAgent {
  constructor() {
    super({
      name: 'customer-sat',
      description:
        'Analyzes customer satisfaction metrics, predicts churn probability, and recommends retention strategies',
      capabilities: [
        'customer-health-scoring',
        'churn-prediction',
        'retention-recommendations',
        'nps-analysis',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'lite',
      // Proactive: Phase 2 (advisor) — clear inactivity signals, retention stakes.
      autonomyPhase: 'advisor',
      notify: { channels: ['email', 'in_app'], maxPerHour: 5, maxPerDay: 20 },
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    const custInput = input as unknown as CustomerSatInput;
    const { customerId, interactions, npsScore, openTickets, contractValue } = custInput;

    logger.info('CustomerSat agent executing', {
      customerId,
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
      // 1. Compute individual dimension scores (0-100)
      const npsSubScore = this.scoreNPS(npsScore);
      const ticketSubScore = this.scoreTicketLoad(openTickets, contractValue);
      const interactionSubScore = this.scoreInteractions(interactions);
      const valueSubScore = this.scoreContractValue(contractValue);

      // 2. Compute weighted health score
      const healthScore = Math.round(
        npsSubScore * WEIGHTS.nps +
        ticketSubScore * WEIGHTS.ticketLoad +
        interactionSubScore * WEIGHTS.interactionRecency +
        valueSubScore * WEIGHTS.contractValue,
      );

      // 3. Predict churn probability
      const churnProbability = this.predictChurn(healthScore, npsScore, openTickets, interactions);

      // 4. Classify customer health
      const healthStatus = this.classifyHealth(healthScore);

      // 5. Classify NPS category
      const npsCategory = npsScore >= NPS_THRESHOLDS.promoter
        ? 'promoter'
        : npsScore >= NPS_THRESHOLDS.passive
          ? 'passive'
          : 'detractor';

      // 6. Compute revenue at risk
      const revenueAtRisk = Math.round(contractValue * churnProbability);

      // 7. Build recommendations
      const recommendations = this.buildRecommendations(
        healthScore, npsCategory, openTickets, interactions, contractValue, churnProbability,
      );

      // 8. LLM enhancement for personalized strategy
      const llmResponse = await this.callLLM(
        `Suggest a customer retention strategy for this B2B SaaS/platform customer:
Customer ID: ${customerId}
Health score: ${healthScore}/100 (${healthStatus})
NPS: ${npsScore}/10 (${npsCategory})
Open tickets: ${openTickets}
Interactions (90d): ${interactions}
Contract value: EUR ${contractValue.toLocaleString()}
Churn probability: ${(churnProbability * 100).toFixed(1)}%
Revenue at risk: EUR ${revenueAtRisk.toLocaleString()}
Respond as JSON with keys: "strategy" (string), "nextBestActions" (string[])`,
      );

      let llmStrategy = '';
      try {
        const parsed = JSON.parse(llmResponse.content);
        llmStrategy = parsed.strategy || '';
        if (Array.isArray(parsed.nextBestActions)) {
          recommendations.push(...parsed.nextBestActions);
        }
      } catch {
        // Non-critical
      }

      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          customerId,
          healthScore,
          healthStatus,
          churnProbability: Math.round(churnProbability * 1000) / 1000,
          churnRisk: churnProbability >= 0.7 ? 'critical' : churnProbability >= 0.4 ? 'high' : churnProbability >= 0.2 ? 'moderate' : 'low',
          nps: {
            score: npsScore,
            category: npsCategory,
            subScore: npsSubScore,
          },
          engagement: {
            interactions90d: interactions,
            subScore: interactionSubScore,
            level: interactions >= 10 ? 'high' : interactions >= 4 ? 'moderate' : interactions >= 1 ? 'low' : 'disengaged',
          },
          support: {
            openTickets,
            subScore: ticketSubScore,
            ticketsPerContractValue: contractValue > 0
              ? Math.round((openTickets / (contractValue / 100000)) * 100) / 100
              : 0,
          },
          financials: {
            contractValue,
            revenueAtRisk,
            subScore: valueSubScore,
            tier: contractValue >= 500000 ? 'enterprise' : contractValue >= 100000 ? 'mid-market' : 'smb',
          },
          llmStrategy,
        },
        confidence: this.computeConfidence(npsScore, interactions),
        reasoning: `Health score ${healthScore}/100 (${healthStatus}) computed from NPS ${npsScore} (${npsCategory}, weighted ${WEIGHTS.nps * 100}%), ticket load ${openTickets} (weighted ${WEIGHTS.ticketLoad * 100}%), interaction frequency ${interactions}/90d (weighted ${WEIGHTS.interactionRecency * 100}%), and contract value EUR ${contractValue.toLocaleString()} (weighted ${WEIGHTS.contractValue * 100}%). Churn probability estimated at ${(churnProbability * 100).toFixed(1)}%.`,
        recommendations: [...new Set(recommendations)],
        metadata: {
          durationMs,
          llmModel: llmResponse.model,
          llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
          scoringWeights: WEIGHTS,
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

  // ============ SCORING METHODS ============

  /** Score NPS on 0-100 scale */
  private scoreNPS(nps: number): number {
    if (nps >= 10) return 100;
    if (nps >= 9) return 90;
    if (nps >= 8) return 75;
    if (nps >= 7) return 60;
    if (nps >= 6) return 40;
    if (nps >= 5) return 25;
    if (nps >= 3) return 15;
    return 5;
  }

  /** Score ticket load relative to contract value on 0-100 scale (higher = healthier) */
  private scoreTicketLoad(tickets: number, contractValue: number): number {
    if (tickets === 0) return 100;

    // Normalize tickets per EUR 100k contract value
    const normalizedTickets = contractValue > 0
      ? tickets / (contractValue / 100000)
      : tickets;

    if (normalizedTickets <= TICKET_RISK_THRESHOLDS.healthy) return 85;
    if (normalizedTickets <= TICKET_RISK_THRESHOLDS.moderate) return 55;
    if (normalizedTickets <= TICKET_RISK_THRESHOLDS.critical) return 30;
    return 10;
  }

  /** Score interaction frequency (90 day window) on 0-100 scale */
  private scoreInteractions(interactions: number): number {
    if (interactions >= 12) return 100; // Weekly+ engagement
    if (interactions >= 8) return 85;
    if (interactions >= 4) return 70;   // Monthly
    if (interactions >= 2) return 50;
    if (interactions >= 1) return 30;
    return 5; // No interactions = disengaged
  }

  /** Score contract value tier on 0-100 scale (strategic importance) */
  private scoreContractValue(value: number): number {
    if (value >= 1000000) return 100; // EUR 1M+ enterprise
    if (value >= 500000) return 85;
    if (value >= 200000) return 70;
    if (value >= 100000) return 55;
    if (value >= 50000) return 40;
    if (value >= 10000) return 25;
    return 15;
  }

  /** Predict churn probability (0-1) using logistic-style model */
  private predictChurn(
    healthScore: number,
    nps: number,
    openTickets: number,
    interactions: number,
  ): number {
    // Base churn from health score (inverted sigmoid-like curve)
    let churnScore: number;

    // Health score inversely predicts churn
    if (healthScore >= 80) churnScore = 0.05;
    else if (healthScore >= 60) churnScore = 0.15;
    else if (healthScore >= 40) churnScore = 0.35;
    else if (healthScore >= 20) churnScore = 0.60;
    else churnScore = 0.85;

    // NPS detractor amplifier
    if (nps <= 4) churnScore += 0.15;
    else if (nps <= 6) churnScore += 0.08;

    // High ticket volume amplifier
    if (openTickets >= 5) churnScore += 0.10;
    else if (openTickets >= 3) churnScore += 0.05;

    // Disengagement amplifier
    if (interactions === 0) churnScore += 0.15;
    else if (interactions <= 1) churnScore += 0.08;

    // Promoter dampener
    if (nps >= 9) churnScore -= 0.10;

    return Math.max(0, Math.min(1, churnScore));
  }

  private classifyHealth(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    if (score >= 20) return 'poor';
    return 'critical';
  }

  private buildRecommendations(
    healthScore: number,
    npsCategory: string,
    openTickets: number,
    interactions: number,
    contractValue: number,
    churnProbability: number,
  ): string[] {
    const recs: string[] = [];

    // Critical churn risk
    if (churnProbability >= 0.6) {
      recs.push('URGENT: Schedule executive-level check-in within 48 hours to address customer concerns');
    }

    // NPS-based actions
    if (npsCategory === 'detractor') {
      recs.push('NPS is in detractor range - conduct a structured Voice of Customer interview to understand root causes');
      recs.push('Assign a dedicated customer success manager for hands-on recovery');
    } else if (npsCategory === 'passive') {
      recs.push('NPS is passive - identify one quick-win improvement to move toward promoter status');
    } else if (npsCategory === 'promoter') {
      recs.push('Customer is a promoter - ask for a case study or referral to leverage advocacy');
    }

    // Ticket-based actions
    if (openTickets >= 5) {
      recs.push(`${openTickets} open tickets is above healthy threshold - prioritize resolution and consider a dedicated support sprint`);
    } else if (openTickets >= 3) {
      recs.push('Elevated open ticket count - review ticket aging and escalate any tickets older than 7 days');
    }

    // Engagement-based actions
    if (interactions === 0) {
      recs.push('Zero interactions in 90 days indicates disengagement - initiate proactive outreach with a value-add (industry report, product update demo)');
    } else if (interactions <= 2) {
      recs.push('Low interaction frequency - schedule a quarterly business review to maintain engagement');
    }

    // Value-based actions
    if (contractValue >= 200000 && churnProbability >= 0.3) {
      const atRisk = Math.round(contractValue * churnProbability);
      recs.push(
        `EUR ${atRisk.toLocaleString()} revenue at risk - consider a contract incentive or product enhancement to secure renewal`,
      );
    }

    // Healthy customer optimization
    if (healthScore >= 80 && npsCategory === 'promoter') {
      recs.push('Healthy promoter account - explore upsell/cross-sell opportunities and referral programs');
    }

    return recs;
  }

  private computeConfidence(nps: number, interactions: number): number {
    let confidence = 0.85;
    // More data points = higher confidence
    if (interactions >= 8) confidence += 0.10;
    else if (interactions === 0) confidence -= 0.15;
    // NPS at extremes is more reliable
    if (nps <= 2 || nps >= 9) confidence += 0.05;
    return Math.max(0.3, Math.min(1.0, confidence));
  }
}
