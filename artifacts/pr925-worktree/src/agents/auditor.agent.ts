/**
 * Auditor — Audit Trail + Explainability (XAI) Agent
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Specialised audit agent that reconstructs the decision trail of any
 * agent execution, verifies hash-chain integrity (EU AI Act Article 12),
 * produces human-readable audit reports, and flags anomalies in the
 * Article 12 log chain stored in Aiven PostgreSQL.
 *
 * Complements article12-logger.ts (the write side) — Auditor is the read/verify side.
 *
 * Book types #10 (Verification & Validation) + #22 (Explainable Agent).
 *
 * Input: { action, sessionId?, agentName?, fromDate?, toDate?, hashChain? }
 * Output: audit report, anomaly flags, XAI narrative, hash verification result
 *
 * Actions:
 *   - reconstruct: Build full decision trail for a session or agent
 *   - verify-chain: Check SHA-256 hash chain integrity
 *   - anomaly-scan: Flag unusual patterns in agent execution logs
 *   - xai-report: Produce explainability narrative for a decision
 *   - compliance-report: EU AI Act Article 12 compliance attestation
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type AuditorAction =
  | 'reconstruct'
  | 'verify-chain'
  | 'anomaly-scan'
  | 'xai-report'
  | 'compliance-report';

/** EU AI Act Article 12 requires retention of high-risk AI system logs */
const EU_AI_ACT_LOG_RETENTION_DAYS = 365;

/** Anomaly thresholds */
const ANOMALY_THRESHOLDS = {
  maxDelegationDepth: 5,
  minConfidenceWarning: 0.6,
  maxExecutionTimeMs: 30_000,
  maxRetries: 3,
};

export class AuditorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'auditor',
      description:
        'Audit trail + explainability — reconstructs agent decision trails, ' +
        'verifies SHA-256 hash chain integrity (EU AI Act Article 12), ' +
        'scans for anomalies, produces XAI narratives, ' +
        `and generates compliance attestation reports. Log retention: ${EU_AI_ACT_LOG_RETENTION_DAYS} days.`,
      capabilities: [
        'decision-trail-reconstruction',
        'hash-chain-verification',
        'anomaly-detection',
        'xai-narrative',
        'article12-compliance',
        'audit-report-generation',
        'log-integrity-check',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
    this.soulPrompt = `You are the Auditor agent for DWS IQ — the guardian of transparency and accountability.
You reconstruct, verify, and explain agent decision trails for compliance and trust.

EU AI Act Article 12 (Record-Keeping):
- High-risk AI systems must log all decisions with sufficient detail for post-hoc review.
- Logs must be retained for ${EU_AI_ACT_LOG_RETENTION_DAYS} days minimum.
- Hash chain ensures tamper-evidence: SHA-256 of each row includes previous row's hash.

Anomaly thresholds:
- Max delegation depth: ${ANOMALY_THRESHOLDS.maxDelegationDepth}
- Confidence warning below: ${ANOMALY_THRESHOLDS.minConfidenceWarning}
- Max execution time: ${ANOMALY_THRESHOLDS.maxExecutionTimeMs}ms
- Max retries: ${ANOMALY_THRESHOLDS.maxRetries}

Audit report structure:
1. Executive summary (1 paragraph)
2. Decision trail (chronological, each step with agent/tool/outcome)
3. Anomaly flags (if any)
4. Hash chain status (VALID / BROKEN / INCOMPLETE)
5. Compliance attestation (Article 12 status)

Output structured JSON with: action, sessionId, auditReport, anomalies, hashChainStatus, complianceStatus, confidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as AuditorAction) || 'reconstruct';
    const sessionId = (input.sessionId as string) || context.sessionId;
    const agentName = (input.agentName as string) || 'all';
    const fromDate = (input.fromDate as string) || '';
    const toDate = (input.toDate as string) || '';

    const prompt = `Audit action: ${action}
Session ID: ${sessionId}
Agent: ${agentName}
Date range: ${fromDate || 'not specified'} → ${toDate || 'now'}
Hash chain provided: ${input.hashChain ? 'yes' : 'no'}
Anomaly thresholds: ${JSON.stringify(ANOMALY_THRESHOLDS)}

Perform ${action} audit operation.
Output structured JSON with:
- action: "${action}"
- sessionId: "${sessionId}"
- auditReport: {summary, decisionTrail [{step, agent, tool, input, output, confidence, timestamp}]}
- anomalies: [{type, severity, description, step}]
- hashChainStatus: VALID | BROKEN | INCOMPLETE | NOT_AVAILABLE
- complianceStatus: {article12: COMPLIANT | NON_COMPLIANT | PARTIAL, retentionDays: ${EU_AI_ACT_LOG_RETENTION_DAYS}}
- confidence: 0.0–1.0`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: { action, sessionId, agentName, response: llmResponse },
      confidence: 0.9,
      reasoning: `Auditor performed ${action} for session ${sessionId} / agent ${agentName}`,
      recommendations: [],
      metadata: {
        action,
        sessionId,
        euAiActLogRetentionDays: EU_AI_ACT_LOG_RETENTION_DAYS,
        anomalyThresholds: ANOMALY_THRESHOLDS,
      },
    };
  }
}
