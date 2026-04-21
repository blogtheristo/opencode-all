/**
 * Reflection Agent - Agent Output Quality Evaluator
 *
 * Evaluates the quality of other agents' outputs, creating a feedback loop
 * for continuous improvement. Inspired by the reflection workflow pattern
 * from the MCP Hub (iterative refinement with score thresholds).
 *
 * Self-improving loop:
 *   1. Agent X produces output → Reflection agent scores it
 *   2. If score < threshold → feedback sent back for re-execution
 *   3. Quality trends tracked over time → identifies degrading agents
 *
 * Input: { agentOutput: AgentResponse, evaluationCriteria?: string[] }
 * Output: quality score, dimension scores, improvement suggestions
 */

import { BaseAgent } from './base.agent.js';
import logger from '../utils/logger.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ EVALUATION DIMENSIONS ============

interface QualityDimension {
  name: string;
  score: number;  // 0-1
  feedback: string;
}

interface ReflectionInput {
  agentOutput: AgentResponse;
  evaluationCriteria?: string[];
  qualityThreshold?: number;
}

// ============ AGENT IMPLEMENTATION ============

export class ReflectionAgent extends BaseAgent {
  constructor() {
    super({
      name: 'reflection',
      description:
        'Evaluates the quality of other agents\' outputs, scoring confidence, reasoning quality, and recommendation actionability. Enables iterative self-improvement.',
      capabilities: [
        'output-quality-scoring',
        'reasoning-evaluation',
        'recommendation-assessment',
        'confidence-calibration',
        'trend-detection',
      ],
      model: 'llama-3.3-70b-versatile',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const reflectionInput = input as unknown as ReflectionInput;
    const { agentOutput, qualityThreshold = 0.7 } = reflectionInput;

    // Validate input — reflection requires a well-formed AgentResponse to evaluate
    if (!agentOutput || typeof agentOutput !== 'object') {
      throw new Error(
        'Reflection agent requires "agentOutput" field containing an AgentResponse object',
      );
    }
    const missing: string[] = [];
    if (typeof agentOutput.agentName !== 'string' || agentOutput.agentName.length === 0) {
      missing.push('agentName (string)');
    }
    if (typeof agentOutput.confidence !== 'number') {
      missing.push('confidence (number)');
    }
    if (typeof agentOutput.reasoning !== 'string') {
      missing.push('reasoning (string)');
    }
    if (!Array.isArray(agentOutput.recommendations)) {
      missing.push('recommendations (array)');
    }
    if (!agentOutput.result || typeof agentOutput.result !== 'object') {
      missing.push('result (object)');
    }
    if (!agentOutput.metadata || typeof agentOutput.metadata !== 'object') {
      missing.push('metadata (object)');
    }
    if (missing.length > 0) {
      throw new Error(
        `Reflection agent input invalid — agentOutput missing or malformed fields: ${missing.join(', ')}`,
      );
    }

    logger.info('Reflection agent evaluating output', {
      targetAgent: agentOutput.agentName,
      projectId: context.projectId,
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
      // Evaluate across quality dimensions
      const dimensions: QualityDimension[] = [];

      // 1. Confidence calibration
      dimensions.push(this.evaluateConfidence(agentOutput));

      // 2. Reasoning quality
      dimensions.push(this.evaluateReasoning(agentOutput));

      // 3. Recommendation actionability
      dimensions.push(this.evaluateRecommendations(agentOutput));

      // 4. Result completeness
      dimensions.push(this.evaluateCompleteness(agentOutput));

      // 5. Metadata quality (observability)
      dimensions.push(this.evaluateMetadata(agentOutput));

      // Compute overall quality score
      const overallScore =
        dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;

      const passesThreshold = overallScore >= qualityThreshold;

      // Build improvement suggestions
      const improvements = dimensions
        .filter((d) => d.score < 0.7)
        .map((d) => `Improve ${d.name}: ${d.feedback}`);

      // Optionally use LLM for deeper analysis
      let llmFeedback = '';
      if (!passesThreshold && overallScore < 0.5) {
        const llmResponse = await this.callLLM(
          `Evaluate this AI agent output quality and suggest specific improvements:
Agent: ${agentOutput.agentName}
Confidence: ${agentOutput.confidence}
Reasoning: ${agentOutput.reasoning}
Recommendations count: ${agentOutput.recommendations.length}
Quality score: ${overallScore.toFixed(2)}
Failing dimensions: ${dimensions.filter((d) => d.score < 0.7).map((d) => d.name).join(', ')}
Respond as JSON with keys: "feedback" (string), "specificFixes" (string[])`,
        );
        try {
          const parsed = JSON.parse(llmResponse.content);
          llmFeedback = parsed.feedback || '';
          if (Array.isArray(parsed.specificFixes)) {
            improvements.push(...parsed.specificFixes);
          }
        } catch {
          // Continue without LLM feedback
        }
      }

      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          targetAgent: agentOutput.agentName,
          overallScore: Math.round(overallScore * 100) / 100,
          passesThreshold,
          qualityThreshold,
          dimensions: dimensions.map((d) => ({
            name: d.name,
            score: Math.round(d.score * 100) / 100,
            feedback: d.feedback,
          })),
          improvements,
          llmFeedback,
          verdict: passesThreshold
            ? 'PASS: Output meets quality threshold'
            : 'FAIL: Output below quality threshold - consider re-execution with feedback',
        },
        confidence: 0.8,
        reasoning: `Evaluated ${agentOutput.agentName} output across ${dimensions.length} quality dimensions. Overall score: ${(overallScore * 100).toFixed(0)}% (threshold: ${(qualityThreshold * 100).toFixed(0)}%). ${passesThreshold ? 'Passes' : 'Fails'} quality gate.`,
        recommendations: improvements.length > 0
          ? improvements
          : ['Output quality is satisfactory across all dimensions'],
        metadata: {
          durationMs,
          targetAgent: agentOutput.agentName,
          dimensionCount: dimensions.length,
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

  // ============ EVALUATION METHODS ============

  private evaluateConfidence(output: AgentResponse): QualityDimension {
    const confidence = output.confidence;

    // Penalize extreme values (0 or 1) - well-calibrated agents are uncertain sometimes
    if (confidence === 1.0) {
      return {
        name: 'confidence-calibration',
        score: 0.5,
        feedback: 'Perfect confidence (1.0) suggests overconfidence - no real model is 100% certain',
      };
    }
    if (confidence === 0) {
      return {
        name: 'confidence-calibration',
        score: 0.3,
        feedback: 'Zero confidence suggests the agent failed to produce meaningful output',
      };
    }
    if (confidence >= 0.6 && confidence <= 0.95) {
      return {
        name: 'confidence-calibration',
        score: 0.9,
        feedback: 'Confidence is well-calibrated within expected range',
      };
    }

    return {
      name: 'confidence-calibration',
      score: 0.6,
      feedback: `Confidence ${confidence} is outside typical range (0.6-0.95)`,
    };
  }

  private evaluateReasoning(output: AgentResponse): QualityDimension {
    const reasoning = output.reasoning || '';

    if (reasoning.length === 0) {
      return {
        name: 'reasoning-quality',
        score: 0.1,
        feedback: 'No reasoning provided - agents must explain their logic',
      };
    }

    let score = 0.5;

    // Longer reasoning is generally more thorough
    if (reasoning.length > 100) score += 0.15;
    if (reasoning.length > 200) score += 0.1;

    // Check for quantitative evidence
    if (/\d+/.test(reasoning)) score += 0.1;

    // Check for causal language (indicates actual reasoning)
    if (/because|due to|computed from|based on|resulted in/i.test(reasoning)) {
      score += 0.15;
    }

    return {
      name: 'reasoning-quality',
      score: Math.min(1.0, score),
      feedback:
        score >= 0.7
          ? 'Reasoning includes quantitative evidence and causal explanation'
          : 'Reasoning could be more detailed with specific data and causal links',
    };
  }

  private evaluateRecommendations(output: AgentResponse): QualityDimension {
    const recs = output.recommendations || [];

    if (recs.length === 0) {
      return {
        name: 'recommendation-actionability',
        score: 0.2,
        feedback: 'No recommendations provided - agents should always suggest next actions',
      };
    }

    let score = 0.5;

    // Multiple recommendations show thoroughness
    if (recs.length >= 2) score += 0.1;
    if (recs.length >= 3) score += 0.1;

    // Check for actionable language
    const actionableCount = recs.filter((r) =>
      /implement|add|create|schedule|conduct|ensure|monitor|review|upgrade/i.test(r),
    ).length;

    if (actionableCount > 0) score += 0.15;
    if (actionableCount === recs.length) score += 0.1;

    // Too many is also bad (signal vs noise)
    if (recs.length > 10) score -= 0.15;

    return {
      name: 'recommendation-actionability',
      score: Math.min(1.0, Math.max(0, score)),
      feedback:
        score >= 0.7
          ? `${recs.length} actionable recommendations with clear directives`
          : `Recommendations need more actionable language (use verbs: implement, add, review)`,
    };
  }

  private evaluateCompleteness(output: AgentResponse): QualityDimension {
    let score = 0.5;

    // Check result has meaningful content
    const resultKeys = Object.keys(output.result || {});
    if (resultKeys.length >= 3) score += 0.2;
    if (resultKeys.length >= 5) score += 0.1;

    // Check agent name is set
    if (output.agentName && output.agentName.length > 0) score += 0.1;

    // Check for non-empty result values (only award bonus when result is non-empty)
    const nonEmptyValues = resultKeys.filter((k) => {
      const v = output.result[k];
      return v !== null && v !== undefined && v !== '';
    }).length;

    if (resultKeys.length > 0 && nonEmptyValues === resultKeys.length) {
      score += 0.1;
    }

    return {
      name: 'result-completeness',
      score: Math.min(1.0, score),
      feedback:
        resultKeys.length === 0
          ? 'Result object is empty - agent produced no output data'
          : score >= 0.7
            ? `Result contains ${resultKeys.length} fields, all populated`
            : `Result incomplete - ${resultKeys.length} fields, some may be empty`,
    };
  }

  private evaluateMetadata(output: AgentResponse): QualityDimension {
    const meta = output.metadata || {};
    const metaKeys = Object.keys(meta);

    if (metaKeys.length === 0) {
      return {
        name: 'observability-metadata',
        score: 0.3,
        feedback: 'No metadata provided - include durationMs, model info, and token usage',
      };
    }

    let score = 0.5;

    if ('durationMs' in meta || 'duration_ms' in meta) score += 0.2;
    if ('llmModel' in meta || 'model' in meta) score += 0.15;
    if ('llmTokens' in meta || 'tokens' in meta) score += 0.15;

    return {
      name: 'observability-metadata',
      score: Math.min(1.0, score),
      feedback:
        score >= 0.7
          ? 'Metadata includes timing and model information for observability'
          : 'Add durationMs, llmModel, and llmTokens to metadata for EU AI Act compliance',
    };
  }
}
