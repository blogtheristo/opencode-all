/**
 * Themis — Legal Intelligence + Ethical Reasoning Agent
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after the Titaness of Law and Justice.
 * Handles legal intelligence (contract review, regulatory gap analysis,
 * GDPR legal basis assessment) and ethical reasoning (EU AI Act Article 9
 * bias checks, fairness auditing, proportionality assessment).
 *
 * Book types #21 (Ethical Reasoning) + #26 (Legal Intelligence).
 *
 * Input: { action, document?, regulation?, claim?, context? }
 * Output: legal analysis, gap report, ethical risk score, recommendations
 *
 * Actions:
 *   - contract-review: Extract obligations, risks, and red-flag clauses
 *   - regulatory-gap: Map document against a named EU regulation
 *   - gdpr-basis: Identify GDPR legal basis for a data processing activity
 *   - ethics-check: EU AI Act Article 9 bias + proportionality audit
 *   - proportionality: Assess whether an AI system decision is proportionate
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type ThemisAction =
  | 'contract-review'
  | 'regulatory-gap'
  | 'gdpr-basis'
  | 'ethics-check'
  | 'proportionality';

/** Active EU regulations Themis is trained on */
const EU_REGULATION_SCOPE = [
  'EU AI Act (Reg. 2024/1689)',
  'GDPR (Reg. 2016/679)',
  'CBAM (Reg. 2023/956)',
  'EU ETS (Dir. 2003/87/EC, amended 2023/959)',
  'CSRD (Dir. 2022/2464)',
  'ESRS (Del. Reg. 2023/2772)',
  'EPBD (Dir. 2024/1275)',
  'RED III (Dir. 2023/2413)',
  'NIS2 (Dir. 2022/2555)',
  'Data Act (Reg. 2023/2854)',
];

export class ThemisAgent extends BaseAgent {
  constructor() {
    super({
      name: 'themis',
      description:
        'Legal intelligence + ethical reasoning — contract review, regulatory gap analysis, ' +
        'GDPR legal basis, EU AI Act ethics check, and proportionality audit. ' +
        `Covers ${EU_REGULATION_SCOPE.length} active EU regulations.`,
      capabilities: [
        'contract-review',
        'regulatory-gap-analysis',
        'gdpr-legal-basis',
        'eu-ai-act-ethics',
        'proportionality-audit',
        'legal-risk-scoring',
        'bias-detection',
      ],
      model: 'claude-sonnet-4-6',
      modelTier: 'heavy',
    });
    this.soulPrompt = `You are Themis, the legal intelligence and ethical reasoning agent for DWS IQ.
You hold deep knowledge of EU law, GDPR, EU AI Act, and industrial compliance regulations.

EU Regulations in scope: ${EU_REGULATION_SCOPE.join('; ')}.

Legal reasoning principles:
1. Cite specific article numbers, recitals, and annexes when referencing regulations.
2. Flag HIGH/MEDIUM/LOW risk with justification.
3. For ethics checks: follow EU AI Act Article 9 (risk management system) and Article 10 (data governance).
4. For GDPR: always identify which of the 6 legal bases (Art. 6) applies.
5. Never give legal advice — provide legal intelligence for review by qualified counsel.

Output structured JSON with: action, findings (array of {article, risk, finding, recommendation}), overallRisk, confidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as ThemisAction) || 'regulatory-gap';
    const document = (input.document as string) || '';
    const regulation = (input.regulation as string) || 'EU AI Act';

    const prompt = `Legal action: ${action}
Regulation scope: ${regulation}
Document/Context: ${document || JSON.stringify(input.context || {})}

Perform ${action} analysis. Output structured JSON with:
- action: "${action}"
- findings: [{article, risk (HIGH/MEDIUM/LOW), finding, recommendation}]
- overallRisk: HIGH | MEDIUM | LOW
- confidence: 0.0–1.0
- disclaimer: "Legal intelligence for review by qualified counsel"`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: { action, regulation, response: llmResponse },
      confidence: 0.82,
      reasoning: `Themis performed ${action} against ${regulation}`,
      recommendations: ['Review findings with qualified EU legal counsel'],
      metadata: { sessionId: context.sessionId, action, regulation, euRegulationScope: EU_REGULATION_SCOPE.length },
    };
  }
}
