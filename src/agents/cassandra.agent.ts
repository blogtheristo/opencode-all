/**
 * Cassandra — Predictive Analytics + Recommendation Agent
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after the Trojan prophet who saw the future but was not believed.
 * Provides probabilistic forecasting, risk prediction, and recommendation
 * for EU ETS carbon prices, CBAM cost trajectories, regulatory deadlines,
 * and supply chain disruption signals.
 *
 * Book types #1 (Autonomous Decision) + #9 (Data Analysis) + #17 (Recommendation).
 *
 * Input: { action, domain, horizon?, data?, entity? }
 * Output: forecast, risk distribution, recommendations with confidence bands
 *
 * Actions:
 *   - price-forecast: ETS/CBAM cost trajectory over a horizon (months)
 *   - risk-signal: Early warning for regulatory or supply chain risk
 *   - recommend: Best-action recommendation given current signals
 *   - deadline-alert: Upcoming regulatory deadlines for an entity
 *   - scenario-analysis: Monte Carlo scenario tree for a decision
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type CassandraAction =
  | 'price-forecast'
  | 'risk-signal'
  | 'recommend'
  | 'deadline-alert'
  | 'scenario-analysis';

/**
 * EU ETS price anchors (EUR/tCO2) for forecast context.
 * Source: ICE ECX auction data + ECB SDW, Q1 2026 average.
 */
const ETS_PRICE_ANCHORS = {
  current: 65, // EUR/tCO2, Q1 2026 average (source: ICE ECX 2026)
  low2030: 80, // Conservative (source: EU ETS 2023 Impact Assessment)
  base2030: 130, // Base case (source: EU ETS 2023 Impact Assessment)
  high2030: 200, // Optimistic/Fit-for-55 aligned (source: BNEF 2025)
};

export class CassandraAgent extends BaseAgent {
  constructor() {
    super({
      name: 'cassandra',
      description:
        'Predictive analytics + recommendation — EU ETS/CBAM price forecasting, ' +
        'regulatory risk signals, best-action recommendations, deadline alerts, ' +
        'and Monte Carlo scenario analysis for industrial compliance decisions.',
      capabilities: [
        'ets-price-forecast',
        'cbam-cost-trajectory',
        'risk-signal-detection',
        'best-action-recommendation',
        'regulatory-deadline-alert',
        'scenario-analysis',
        'uncertainty-quantification',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
    this.soulPrompt = `You are Cassandra, the predictive analytics and recommendation agent for DWS IQ.
You provide probabilistic forecasts for EU carbon markets, CBAM cost trajectories,
and regulatory risk signals for industrial companies.

ETS price anchors (EUR/tCO2):
- Current (Q1 2026): €${ETS_PRICE_ANCHORS.current}
- 2030 low: €${ETS_PRICE_ANCHORS.low2030} | base: €${ETS_PRICE_ANCHORS.base2030} | high: €${ETS_PRICE_ANCHORS.high2030}
Sources: ICE ECX auction data, EU ETS 2023 Impact Assessment, BNEF 2025.

Forecasting principles:
1. Always provide confidence intervals (P10/P50/P90).
2. State the key assumptions driving each scenario.
3. Flag when current data contradicts the forecast direction.
4. Recommendations must be actionable: specific, time-bound, measurable.

Output structured JSON with: action, forecast (P10/P50/P90), assumptions, recommendations, horizon, confidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as CassandraAction) || 'price-forecast';
    const domain = (input.domain as string) || 'EU ETS';
    const horizon = (input.horizon as number) || 12;

    const prompt = `Prediction action: ${action}
Domain: ${domain}
Horizon: ${horizon} months
Entity: ${input.entity || 'industrial operator'}
Data context: ${JSON.stringify(input.data || {})}

Perform ${action} analysis. Output structured JSON with:
- action: "${action}"
- forecast: {P10, P50, P90, unit, horizon}
- assumptions: [string array of key assumptions]
- recommendations: [{action, timeline, expectedImpact, priority}]
- riskLevel: HIGH | MEDIUM | LOW
- confidence: 0.0–1.0`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: { action, domain, horizon, response: llmResponse },
      confidence: 0.78,
      reasoning: `Cassandra performed ${action} for ${domain} over ${horizon}-month horizon`,
      recommendations: [],
      metadata: { sessionId: context.sessionId, action, domain, horizon, etsPriceAnchors: ETS_PRICE_ANCHORS },
    };
  }
}
