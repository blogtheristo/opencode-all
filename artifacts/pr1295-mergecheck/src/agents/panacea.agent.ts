/**
 * Panacea — Self-Improving / Adaptive Optimization Agent
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after Panacea, Greek goddess of universal remedy and healing.
 * Panacea analyses agent performance, detects degradation patterns,
 * generates improvement hypotheses, and proposes prompt or parameter
 * changes to self-optimise the DWS IQ agent fleet.
 *
 * Book type #14 (Self-Improving Agent): feedback loops, performance
 * monitoring, few-shot tuning, and adaptive optimization.
 *
 * Input: { action, agentName?, metrics?, feedback?, window? }
 * Output: performance diagnosis, improvement hypotheses, optimized config
 *
 * Actions:
 *   - diagnose: Analyse recent performance metrics for an agent
 *   - hypothesize: Generate improvement hypotheses from failure patterns
 *   - optimize: Propose updated system prompt or config changes
 *   - benchmark: Compare agent performance against baseline
 *   - fleet-health: Overall health check across the agent fleet
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type PanaceaAction = 'diagnose' | 'hypothesize' | 'optimize' | 'benchmark' | 'fleet-health';

/** Minimum confidence threshold below which an agent is flagged for review */
const CONFIDENCE_ALERT_THRESHOLD = 0.65;

/** Minimum acceptable success rate over a rolling window */
const SUCCESS_RATE_ALERT_THRESHOLD = 0.8;

export class PanaceaAgent extends BaseAgent {
  constructor() {
    super({
      name: 'panacea',
      description:
        'Self-improving adaptive optimizer — analyses agent performance metrics, ' +
        'detects degradation, generates improvement hypotheses, ' +
        'proposes system prompt and config optimizations. ' +
        `Alerts when confidence < ${CONFIDENCE_ALERT_THRESHOLD} or success rate < ${SUCCESS_RATE_ALERT_THRESHOLD * 100}%.`,
      capabilities: [
        'performance-diagnosis',
        'improvement-hypothesis',
        'prompt-optimization',
        'config-tuning',
        'benchmark-comparison',
        'fleet-health-check',
        'feedback-loop',
        'adaptive-optimization',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
    this.soulPrompt = `You are Panacea, the self-improving adaptive optimization agent for DWS IQ.
You analyse agent performance data and propose targeted improvements.

Optimization principles:
1. Diagnose root causes — low confidence often means ambiguous input, not model failure.
2. Hypothesize in the form: "IF [change X], THEN [metric Y] should improve by Z%".
3. Prioritize prompt clarity over model upgrades (cheaper, faster, reversible).
4. Never propose changes that reduce explainability (EU AI Act Article 13).
5. All proposed changes must be testable with a specific evaluation metric.

Alert thresholds:
- Confidence below ${CONFIDENCE_ALERT_THRESHOLD} → flag for immediate review
- Success rate below ${SUCCESS_RATE_ALERT_THRESHOLD * 100}% over rolling window → trigger optimization cycle

Output structured JSON with: action, agentName, diagnosis, hypotheses, proposedChanges, expectedGain, priority, confidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as PanaceaAction) || 'diagnose';
    const agentName = (input.agentName as string) || 'all';
    const metrics = input.metrics as Record<string, number> | undefined;
    const feedback = (input.feedback as string[]) || [];
    const window = (input.window as number) || 7;

    const avgConfidence = metrics?.avgConfidence ?? null;
    const needsAlert = avgConfidence !== null && avgConfidence < CONFIDENCE_ALERT_THRESHOLD;

    const prompt = `Self-improvement action: ${action}
Agent: ${agentName}
Window: ${window} days
Metrics: ${JSON.stringify(metrics || {})}
User feedback: ${feedback.join(' | ') || 'none'}
Alert triggered: ${needsAlert}

Perform ${action} analysis.
Output structured JSON with:
- action: "${action}"
- agentName: "${agentName}"
- diagnosis: {issues: [string], rootCauses: [string]}
- hypotheses: [{hypothesis, metric, expectedImprovement, testMethod}]
- proposedChanges: [{type (prompt/config/model), change, rationale}]
- expectedGain: string
- priority: HIGH | MEDIUM | LOW
- confidence: 0.0–1.0`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: { action, agentName, window, needsAlert, response: llmResponse },
      confidence: 0.81,
      reasoning: `Panacea performed ${action} for agent "${agentName}" over ${window}d window`,
      recommendations: needsAlert
        ? [`ALERT: Agent "${agentName}" confidence below threshold — optimization required`]
        : [],
      metadata: {
        sessionId: context.sessionId,
        action,
        agentName,
        confidenceAlertThreshold: CONFIDENCE_ALERT_THRESHOLD,
        successRateThreshold: SUCCESS_RATE_ALERT_THRESHOLD,
      },
    };
  }
}
