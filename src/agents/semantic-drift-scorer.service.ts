// Evidence: Tool=Claude Code Model=claude-haiku-4-5-20251001 Agent=pair-network-utilization-p6zzg3 Date=2026-09-06
// Audit trail: git log -- src/agents/semantic-drift-scorer.service.ts

/**
 * KYA v2 Semantic Drift Detection
 *
 * Computes confidence decay and semantic boundary-crossing risk for agent reasoning paths.
 * Integrates with Article 12 audit logging and Article 14 human-oversight gates.
 *
 * Source: docs/2026-09-06-semantic-drift-case-study.md
 */

export interface ReasoningStep {
  step_number: number;
  subject: string;
  relation: string;
  object: string;
  confidence: number; // Edge weight from graph_facts [0, 1]
  cluster_from?: string; // Community ID (from ontology clustering)
  cluster_to?: string;
  is_boundary_cross?: boolean;
  has_bridge_predicate?: boolean;
  note?: string; // Human-readable explanation
}

export interface ReasoningPath {
  agent_id: string;
  request_id: string;
  steps: ReasoningStep[];
  final_confidence: number; // Product of all confidences
  information_loss: number; // 1 - final_confidence
  boundary_crosses: number;
  semantic_drift_score: number; // [0, 1]
  trust_decision: TrustAction;
  recommendation: string;
}

export enum TrustAction {
  ESCALATE_IMMEDIATE = 'ESCALATE_IMMEDIATE', // drift > 0.60
  REQUIRE_HUMAN_APPROVAL = 'REQUIRE_HUMAN_APPROVAL', // 0.40–0.60
  LOG_AND_PERMIT = 'LOG_AND_PERMIT', // 0.25–0.40
  PERMIT = 'PERMIT', // < 0.25
}

export class SemanticDriftScorerService {
  /**
   * Compute path confidence via product rule: p_final = p₁ × p₂ × ... × pₙ
   */
  computePathConfidence(steps: ReasoningStep[]): number {
    if (steps.length === 0) return 1.0;
    return steps.reduce((acc, step) => acc * step.confidence, 1.0);
  }

  /**
   * Compute information loss: 1 - confidence
   */
  computeInformationLoss(confidence: number): number {
    return Math.max(0, Math.min(1, 1 - confidence));
  }

  /**
   * Detect semantic boundary crossings between clusters
   */
  countBoundaryCrosses(steps: ReasoningStep[]): number {
    return steps.filter((step) => step.is_boundary_cross && !step.has_bridge_predicate).length;
  }

  /**
   * Semantic drift score aggregates three risk factors:
   * 1. Confidence decay (exponential penalty for high information loss)
   * 2. Boundary crossing without bridge predicate (15% penalty each)
   * 3. Low-confidence steps (<0.70)
   *
   * Returns [0, 1] where 0 = safe, 1 = high drift risk
   */
  computeSemanticDriftScore(path: ReasoningPath): number {
    // Factor 1: Confidence decay penalty (exponential)
    // At 50% loss, penalty = exp(-1) ≈ 0.37
    // At 76% loss (4-hop example), penalty = exp(-1.52) ≈ 0.22
    const confidencePenalty = Math.exp(-path.information_loss * 2);

    // Factor 2: Unauthorized boundary crossings (15% penalty per crossing)
    const unauthorizedCrosses = path.steps.filter(
      (step) => step.is_boundary_cross && !step.has_bridge_predicate,
    ).length;
    const boundaryPenalty = Math.min(1.0, unauthorizedCrosses * 0.15);

    // Factor 3: Low-confidence steps (<0.70 = below approval threshold)
    const lowConfSteps = path.steps.filter((step) => step.confidence < 0.7).length;
    const stepQualityPenalty = Math.min(1.0, (lowConfSteps / Math.max(1, path.steps.length)) * 0.2);

    // Aggregate: higher score = higher risk
    // Normalize so drift_score reflects probability of semantic error
    const driftScore = Math.max(
      0,
      Math.min(
        1.0,
        (1 - confidencePenalty) * 0.5 + boundaryPenalty * 0.35 + stepQualityPenalty * 0.15,
      ),
    );

    return driftScore;
  }

  /**
   * Map semantic drift score to trust decision + revocation SLA
   */
  decideTrustAction(driftScore: number): {
    action: TrustAction;
    sla_seconds: number;
  } {
    // SLAs per KYA v2 spec
    if (driftScore >= 0.6) {
      return { action: TrustAction.ESCALATE_IMMEDIATE, sla_seconds: 30 };
    } else if (driftScore >= 0.4) {
      return { action: TrustAction.REQUIRE_HUMAN_APPROVAL, sla_seconds: 300 };
    } else if (driftScore >= 0.25) {
      return { action: TrustAction.LOG_AND_PERMIT, sla_seconds: 900 };
    } else {
      return { action: TrustAction.PERMIT, sla_seconds: 0 };
    }
  }

  /**
   * Generate human-readable recommendation
   */
  generateRecommendation(path: ReasoningPath): string {
    const parts: string[] = [];

    // Confidence analysis
    if (path.information_loss > 0.5) {
      parts.push(
        `High information loss: ${(path.information_loss * 100).toFixed(0)}% context degradation`,
      );
    } else if (path.information_loss > 0.3) {
      parts.push(`Moderate information loss: ${(path.information_loss * 100).toFixed(0)}%`);
    }

    // Boundary crossing analysis
    if (path.boundary_crosses > 0) {
      parts.push(`${path.boundary_crosses} semantic boundary crossing(s) detected`);
    }

    // Low-confidence steps
    const lowSteps = path.steps.filter((s) => s.confidence < 0.7);
    if (lowSteps.length > 0) {
      parts.push(`${lowSteps.length} low-confidence step(s) found`);
    }

    // Action-specific guidance
    switch (path.trust_decision) {
      case TrustAction.ESCALATE_IMMEDIATE:
        parts.push('→ ESCALATE TO HUMAN IMMEDIATELY');
        break;
      case TrustAction.REQUIRE_HUMAN_APPROVAL:
        parts.push('→ Human approval required before execution');
        break;
      case TrustAction.LOG_AND_PERMIT:
        parts.push('→ Audit flag; permit with monitoring');
        break;
      case TrustAction.PERMIT:
        parts.push('→ Reasoning path acceptable');
        break;
    }

    return parts.join('; ');
  }

  /**
   * Full analysis pipeline: given a reasoning path, compute all metrics and decide trust
   */
  analyzeReasoningPath(path: ReasoningPath): ReasoningPath {
    // Compute confidence product
    path.final_confidence = this.computePathConfidence(path.steps);

    // Compute information loss
    path.information_loss = this.computeInformationLoss(path.final_confidence);

    // Count boundary crossings
    path.boundary_crosses = this.countBoundaryCrosses(path.steps);

    // Compute semantic drift score
    path.semantic_drift_score = this.computeSemanticDriftScore(path);

    // Decide trust action
    const decision = this.decideTrustAction(path.semantic_drift_score);
    path.trust_decision = decision.action;

    // Generate recommendation
    path.recommendation = this.generateRecommendation(path);

    return path;
  }
}

/**
 * Singleton instance for use across agents
 */
export const semanticDriftScorer = new SemanticDriftScorerService();
