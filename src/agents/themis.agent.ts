/**
 * Themis — Legal Intelligence + Ethical Reasoning Agent + Case Coordinator
 *
 * Code-Version: 2.0
 * Branch: claude/improve-dws-case-handling-4VhRu
 * Date: 2026-05-08
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 * Introduced-In: PR-TBD
 *
 * Named after the Titaness of Law and Justice.
 * Handles legal intelligence (contract review, regulatory gap analysis,
 * GDPR legal basis assessment) and ethical reasoning (EU AI Act Article 9
 * bias checks, fairness auditing, proportionality assessment).
 *
 * v2.0: Added Case Coordinator role — Themis is the primary orchestrator for
 * DWS cases, dispatching ChronosAgent (deadlines), Auditor (audit trail), and
 * Mnemosyne (memory) based on case type. Skill: /case-run
 *
 * Book types #21 (Ethical Reasoning) + #26 (Legal Intelligence).
 *
 * Input: { action, document?, regulation?, claim?, context?, caseId?, type? }
 * Output: legal analysis, gap report, ethical risk score, case status, recommendations
 *
 * Actions:
 *   - contract-review:   Extract obligations, risks, and red-flag clauses
 *   - regulatory-gap:    Map document against a named EU regulation
 *   - gdpr-basis:        Identify GDPR legal basis for a data processing activity
 *   - ethics-check:      EU AI Act Article 9 bias + proportionality audit
 *   - proportionality:   Assess whether an AI system decision is proportionate
 *   - case-coordinate:   Orchestrate specialist agents on a case; return unified status
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type ThemisAction =
  | 'contract-review'
  | 'regulatory-gap'
  | 'gdpr-basis'
  | 'ethics-check'
  | 'proportionality'
  | 'case-coordinate';

/** Sub-agents Themis dispatches per case type */
const CASE_AGENT_MAP: Record<string, string[]> = {
  compliance: ['chronos', 'auditor'],
  contract: ['auditor'],
  'erp-sync': ['quality-gate', 'auditor'],
  sales: ['sales-outreach'],
  default: ['auditor'],
};

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
        'Case Coordinator + Legal Intelligence — orchestrates specialist agents on DWS cases, ' +
        'performs contract review, regulatory gap analysis, GDPR legal basis, EU AI Act ethics ' +
        `check, and proportionality audit. Covers ${EU_REGULATION_SCOPE.length} active EU regulations. Skill: /case-run`,
      capabilities: [
        'case-coordination',
        'contract-review',
        'regulatory-gap-analysis',
        'gdpr-legal-basis',
        'eu-ai-act-ethics',
        'proportionality-audit',
        'legal-risk-scoring',
        'bias-detection',
      ],
      model: 'claude-sonnet-5',
      modelTier: 'heavy',
    });
    this.soulPrompt = `You are Themis, the Case Coordinator and legal intelligence agent for DWS IQ.
You hold deep knowledge of EU law, GDPR, EU AI Act, and industrial compliance regulations.
You are also the primary orchestrator for DWS cases — you dispatch specialist agents, surface
deadline risks, and return a unified case status with clear next steps.

EU Regulations in scope: ${EU_REGULATION_SCOPE.join('; ')}.

Legal reasoning principles:
1. Cite specific article numbers, recitals, and annexes when referencing regulations.
2. Flag HIGH/MEDIUM/LOW risk with justification.
3. For ethics checks: follow EU AI Act Article 9 (risk management system) and Article 10 (data governance).
4. For GDPR: always identify which of the 6 legal bases (Art. 6) applies.
5. Never give legal advice — provide legal intelligence for review by qualified counsel.

Case coordination principles:
6. For case-coordinate: assess case type, determine which specialist agents are needed,
   synthesize their outputs into a single status report with ONE clear next step.
7. If any action carries HIGH risk, raise approval_required = true and block progression.
8. Always include deadline_risk if a ChronosAgent result is present.

Output structured JSON with: action, findings (array of {article, risk, finding, recommendation}), overallRisk, confidence.
For case-coordinate also include: caseStatus, agentsDispatched, nextStep, approvalRequired, deadlineRisk.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as ThemisAction) || 'regulatory-gap';

    if (action === 'case-coordinate') {
      return this.coordinateCase(context, input);
    }

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
      metadata: {
        sessionId: context.sessionId,
        action,
        regulation,
        euRegulationScope: EU_REGULATION_SCOPE.length,
      },
    };
  }

  private async coordinateCase(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const requestedCaseId =
      typeof input.caseId === 'string' && input.caseId.trim().length > 0 ? input.caseId.trim() : null;
    const caseId = requestedCaseId ?? `case-${context.sessionId || 'ad-hoc'}`;
    const caseType = (input.type as string) || 'default';
    const caseContext = (input.context as string) || JSON.stringify(input);
    const subAgents = CASE_AGENT_MAP[caseType] ?? CASE_AGENT_MAP['default'];

    const prompt = `You are coordinating a DWS case.
Case ID: ${caseId}
Case type: ${caseType}
Context: ${caseContext}
Sub-agents available: ${subAgents.join(', ')}

Assess the case and produce a coordination plan. Output structured JSON with:
- caseId: "${caseId}"
- caseType: "${caseType}"
- caseStatus: "open" | "in_progress" | "pending_approval" | "closed"
- priority: "HIGH" | "MEDIUM" | "LOW"
- agentsDispatched: [{agent, role, finding}]
- overallRisk: "HIGH" | "MEDIUM" | "LOW"
- deadlineRisk: null | {description, daysRemaining}
- nextStep: single clear action string
- approvalRequired: boolean
- approvalReason: string | null
- confidence: 0.0–1.0`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: { action: 'case-coordinate', caseId, caseType, response: llmResponse },
      confidence: 0.85,
      reasoning: `Themis coordinated case ${caseId} (type: ${caseType}), dispatching ${subAgents.join(', ')}`,
      recommendations: subAgents.map((a) => `Review ${a} findings for case ${caseId}`),
      metadata: {
        sessionId: context.sessionId,
        caseId,
        caseType,
        subAgents,
        euRegulationScope: EU_REGULATION_SCOPE.length,
      },
    };
  }
}
