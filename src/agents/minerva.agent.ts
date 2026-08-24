/**
 * Minerva — Knowledge Transfer + Explainability Agent
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after Minerva, Roman goddess of wisdom, arts, and strategic warfare.
 * Minerva makes agent decisions transparent and learnable: it explains
 * why an agent decided X (XAI), generates onboarding documentation,
 * creates learning materials for new users, and transfers knowledge
 * from complex agent outputs into human-readable form.
 *
 * Book types #22 (Explainable Agent) + #27 (Education Intelligence Agent).
 *
 * Input: { action, agentOutput?, decision?, audience?, topic? }
 * Output: explanation, learning material, onboarding guide, XAI report
 *
 * Actions:
 *   - explain: Why did agent X decide Y? (SHAP-style narrative)
 *   - onboard: Generate onboarding guide for a DWS feature or agent
 *   - learn: Create structured learning material on a topic
 *   - translate: Convert technical agent output to executive summary
 *   - compare: Explain tradeoffs between two agent recommendations
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type MinervaAction = 'explain' | 'onboard' | 'learn' | 'translate' | 'compare';

/** Supported audience types for output calibration */
const AUDIENCE_TYPES = ['executive', 'engineer', 'compliance-officer', 'operator', 'auditor'];

export class MinervaAgent extends BaseAgent {
  constructor() {
    super({
      name: 'minerva',
      description:
        'Knowledge transfer + explainability — explains agent decisions (XAI), ' +
        'generates onboarding guides, creates learning materials, ' +
        'translates technical outputs to executive summaries, ' +
        `and compares agent recommendations. Audience-aware: ${AUDIENCE_TYPES.join(', ')}.`,
      capabilities: [
        'xai-explanation',
        'decision-transparency',
        'onboarding-generation',
        'learning-material',
        'executive-translation',
        'recommendation-comparison',
        'audience-calibration',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
    this.soulPrompt = `You are Minerva, the knowledge transfer and explainability agent for DWS IQ.
You make AI agent decisions transparent and learnable for different audiences.

Explainability principles (EU AI Act Article 13 — Transparency):
1. Explain decisions in terms of key factors and their relative importance.
2. Avoid technical jargon unless the audience is 'engineer'.
3. For compliance/audit audience: cite specific regulation articles.
4. For executive audience: lead with business impact, then risk, then action.
5. For operator audience: focus on what to DO, not why.

Supported audiences: ${AUDIENCE_TYPES.join(', ')}.

XAI format (explain action):
- Top 3 factors driving the decision (with % contribution estimate)
- What the agent was trained/prompted to prioritise
- What data was most influential
- What would change the decision (counterfactual)

Output structured JSON with: action, audience, explanation, keyFactors, counterfactual, learningNotes, confidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as MinervaAction) || 'explain';
    const audience = (input.audience as string) || 'engineer';
    const topic = (input.topic as string) || (input.decision as string) || 'agent decision';
    const agentOutput = input.agentOutput || input.decision || {};

    const validAudience = AUDIENCE_TYPES.includes(audience) ? audience : 'engineer';

    const prompt = `Knowledge action: ${action}
Audience: ${validAudience}
Topic/Decision: ${topic}
Agent output to explain: ${JSON.stringify(agentOutput)}

Perform ${action} calibrated for a ${validAudience} audience.
Output structured JSON with:
- action: "${action}"
- audience: "${validAudience}"
- explanation: string (primary output)
- keyFactors: [{factor, contribution, explanation}] (for 'explain' action)
- counterfactual: string (what would change the outcome)
- learningNotes: [string] (key takeaways)
- confidence: 0.0–1.0`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: { action, audience: validAudience, topic, response: llmResponse },
      confidence: 0.87,
      reasoning: `Minerva performed ${action} for ${validAudience} audience on: ${topic}`,
      recommendations: [],
      metadata: { sessionId: context.sessionId, action, audience: validAudience, audienceTypes: AUDIENCE_TYPES },
    };
  }
}
