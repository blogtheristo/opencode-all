/**
 * Aegis Agent — DWS IQ Aegis orchestrator
 *
 * Code-Version: 1.0
 * Branch: claude/aegis-release-readiness-audit
 * Date: 2026-08-19
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Scope: this agent implements only the compliance-evidence layer of
 * DWS IQ Aegis that Store/PRODUCT_AEGIS.md marks "Live" — Article12Logger,
 * ComplianceAgent, SovereigntyMonitor — plus ArgusAgent (orbital
 * intelligence) which already exists in this repo. The Physical
 * (perception -> action) layer is documented as "Planned — target 2026 Q4"
 * and is intentionally NOT implemented here.
 *
 * What this agent adds on top of the pre-existing component agents:
 *   1. A single orchestration entry point ('aegis') that composes
 *      Argus / SovereigntyMonitor / Compliance per Store/PRODUCT_AEGIS.md's
 *      "Agents Included" table, instead of requiring a caller to know and
 *      invoke each sub-agent separately.
 *   2. Replay/nonce protection: a request is identified by
 *      sha256(sessionId + action + JSON(subInput)) and rejected if that
 *      exact fingerprint has already been executed in this process.
 *      LIMITATION: the nonce set is in-memory and per-process — it does
 *      not survive a restart and does not dedupe across horizontally
 *      scaled instances. A durable store (Redis/Postgres) is required for
 *      a production multi-instance deployment; this is PARTIAL, not PASS.
 *   3. A tamper-evident, hash-chained in-process audit trail
 *      (getAuditChain() / verifyAuditChain()) so every Aegis decision in a
 *      session can be shown not to have been altered after the fact.
 *      LIMITATION: in-memory, per-process — durable, cross-restart
 *      tamper-evidence requires Article12Logger's Postgres-backed store
 *      (see below). This is PARTIAL, not PASS, for the platform-wide
 *      "tamper-evident audit trail" HIC requirement.
 *   4. Best-effort EU AI Act Article 12 logging via Article12Logger.
 *      Article12Logger throws if INTERNAL_DB_URL is not configured — that
 *      is treated as an expected degraded/offline condition here, not an
 *      agent failure: the call is wrapped, the failure is recorded on the
 *      response as `article12Logged: false` + `article12Error`, and
 *      execution continues. This is the offline/degraded-mode behavior
 *      the product doc requires for the compliance-evidence workflow:
 *      the local result and the local (in-memory) audit chain entry are
 *      still produced when the DB is unreachable.
 *
 * Input: {
 *   action: 'orbital-intelligence' | 'sovereignty' | 'compliance' | 'assess' | 'audit-chain',
 *   ...sub-agent-specific fields, passed through to the composed agent(s)
 * }
 *   - 'assess' runs sovereignty + compliance together (the two Live,
 *     non-imagery components) and is the default full-picture action.
 *   - 'audit-chain' returns this process's hash-chained audit trail and
 *     its verification result, without executing any sub-agent.
 *
 * Output: composed sub-agent result(s), plus replay/audit/Article-12 metadata.
 */

import { createHash } from 'node:crypto';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';
import { ArgusAgent } from './argus.agent.js';
import { SovereigntyMonitorAgent } from './sovereignty-monitor.agent.js';
import { ComplianceAgent } from './compliance.agent.js';
import { Article12Logger } from './article12-logger.js';
import { scrubObject, type ScrubManifest } from './pii-scrubber.js';
import logger from '../utils/logger.js';

type AegisAction = 'orbital-intelligence' | 'sovereignty' | 'compliance' | 'assess' | 'audit-chain';

const VALID_ACTIONS: AegisAction[] = [
  'orbital-intelligence',
  'sovereignty',
  'compliance',
  'assess',
  'audit-chain',
];

/** One tamper-evident entry in this process's Aegis audit chain. */
export interface AegisAuditEntry {
  seq: number;
  timestamp: string;
  sessionId: string;
  action: string;
  /** sha256(sessionId + action + JSON(subInput)) — also the replay-protection key */
  requestFingerprint: string;
  /** sha256 of this entry's own fields (excluding entryHash) chained to prevHash */
  entryHash: string;
  prevHash: string;
  resultSummary: string;
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export class AegisAgent extends BaseAgent {
  // In-memory, per-process only — see file header LIMITATION notes.
  private static seenFingerprints = new Set<string>();
  private static auditChain: AegisAuditEntry[] = [];

  private argus = new ArgusAgent();
  private sovereigntyMonitor = new SovereigntyMonitorAgent();
  private compliance = new ComplianceAgent();

  constructor() {
    super({
      name: 'aegis',
      description:
        'DWS IQ Aegis orchestrator — composes ArgusAgent (orbital intelligence), ' +
        'SovereigntyMonitorAgent (CLOUD Act / EU residency) and ComplianceAgent ' +
        '(dual-use export control + EU climate compliance) into one entry point, ' +
        'with replay protection, a tamper-evident audit chain, and best-effort ' +
        'EU AI Act Article 12 logging. Scope: compliance-evidence layer only ' +
        '(Store/PRODUCT_AEGIS.md "Live" row) — the Physical perception/action ' +
        'layer is Planned, not implemented here.',
      capabilities: [
        'orbital-intelligence-orchestration',
        'sovereignty-assessment-orchestration',
        'compliance-assessment-orchestration',
        'replay-protection',
        'tamper-evident-audit-chain',
        'article-12-logging',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'lite',
    });
    this.soulPrompt = `You are the DWS IQ Aegis orchestrator.
You compose orbital intelligence (Argus), data sovereignty (SovereigntyMonitor), and
dual-use/export-control compliance (ComplianceAgent) results into one governed response.
You never claim a sub-component is live if Store/PRODUCT_AEGIS.md marks it Planned.
You are explicit about degraded mode: if Article 12 logging failed (no DB reachable),
say so plainly in the response rather than silently dropping the evidence gap.`;
  }

  /** Read-only accessor for tests / operators — this process's audit chain. */
  static getAuditChain(): readonly AegisAuditEntry[] {
    return AegisAgent.auditChain;
  }

  /** Verify no entry in this process's audit chain has been altered out of band. */
  static verifyAuditChain(): { valid: boolean; brokenAtSeq: number | null } {
    let prevHash = '0'.repeat(64);
    for (const entry of AegisAgent.auditChain) {
      if (entry.prevHash !== prevHash) {
        return { valid: false, brokenAtSeq: entry.seq };
      }
      const recomputed = sha256(
        `${entry.seq}|${entry.timestamp}|${entry.sessionId}|${entry.action}|${entry.requestFingerprint}|${entry.prevHash}|${entry.resultSummary}`,
      );
      if (recomputed !== entry.entryHash) {
        return { valid: false, brokenAtSeq: entry.seq };
      }
      prevHash = entry.entryHash;
    }
    return { valid: true, brokenAtSeq: null };
  }

  /** Test-only reset — production processes never need to clear this. */
  static _resetForTests(): void {
    AegisAgent.seenFingerprints.clear();
    AegisAgent.auditChain = [];
  }

  private appendAuditEntry(
    sessionId: string,
    action: string,
    requestFingerprint: string,
    resultSummary: string,
  ): AegisAuditEntry {
    const prevHash =
      AegisAgent.auditChain.length > 0
        ? AegisAgent.auditChain[AegisAgent.auditChain.length - 1].entryHash
        : '0'.repeat(64);
    const seq = AegisAgent.auditChain.length + 1;
    const timestamp = new Date().toISOString();
    const entryHash = sha256(
      `${seq}|${timestamp}|${sessionId}|${action}|${requestFingerprint}|${prevHash}|${resultSummary}`,
    );
    const entry: AegisAuditEntry = {
      seq,
      timestamp,
      sessionId,
      action,
      requestFingerprint,
      entryHash,
      prevHash,
      resultSummary,
    };
    AegisAgent.auditChain.push(entry);
    return entry;
  }

  /** Best-effort EU AI Act Article 12 logging. Never throws — degrades to a flagged failure. */
  private async logArticle12(
    action: string,
    inputHash: string,
    scrubManifest: ScrubManifest,
    decisionSummary: string,
  ): Promise<{ logged: boolean; traceId?: string; error?: string }> {
    try {
      const article12Logger = new Article12Logger();
      const { traceId } = await article12Logger.logPreFlight({
        agentId: this.config.name,
        inputHash,
        model: this.config.model || 'unknown',
        riskClassification: 'high',
        scrubManifest,
      });
      await article12Logger.logPostFlight({
        traceId,
        decisionSummary: decisionSummary.slice(0, 500),
      });
      return { logged: true, traceId };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.warn('Aegis: Article 12 logging unavailable — degraded mode', {
        action,
        error: message,
      });
      return { logged: false, error: message };
    }
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const rawAction = input.action as string | undefined;
    const action: AegisAction = VALID_ACTIONS.includes(rawAction as AegisAction)
      ? (rawAction as AegisAction)
      : 'assess';

    if (action === 'audit-chain') {
      const verification = AegisAgent.verifyAuditChain();
      return {
        agentName: this.config.name,
        result: {
          action,
          entries: AegisAgent.getAuditChain(),
          chainLength: AegisAgent.getAuditChain().length,
          ...verification,
        },
        confidence: 1,
        reasoning: `Audit chain has ${AegisAgent.getAuditChain().length} entr(y/ies); integrity ${verification.valid ? 'VALID' : 'BROKEN'}.`,
        recommendations: verification.valid
          ? []
          : [
              `Audit chain integrity broken at seq ${verification.brokenAtSeq} — investigate before trusting this process's record.`,
            ],
        metadata: { sessionId: context.sessionId, action },
      };
    }

    const subInput: Record<string, unknown> = { ...input };
    delete subInput.action;

    const requestFingerprint = sha256(`${context.sessionId}|${action}|${JSON.stringify(subInput)}`);

    if (AegisAgent.seenFingerprints.has(requestFingerprint)) {
      return {
        agentName: this.config.name,
        result: { action, replay: true, requestFingerprint },
        confidence: 1,
        reasoning:
          'Rejected: identical (sessionId, action, input) fingerprint already executed in this process — possible replay.',
        recommendations: [
          'Issue a fresh request with a new sessionId or changed input if this is intentional.',
        ],
        metadata: { sessionId: context.sessionId, action, replayRejected: true },
      };
    }
    AegisAgent.seenFingerprints.add(requestFingerprint);

    const subResponses: Record<string, AgentResponse> = {};
    const blocked: string[] = [];

    if (action === 'orbital-intelligence' || action === 'assess') {
      try {
        subResponses.orbitalIntelligence = await this.argus.execute(context, subInput);
      } catch (err) {
        blocked.push(`orbital-intelligence: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    if (action === 'sovereignty' || action === 'assess') {
      subResponses.sovereignty = await this.sovereigntyMonitor.execute(context, subInput);
    }

    if (action === 'compliance' || action === 'assess') {
      subResponses.compliance = await this.compliance.execute(context, subInput);
    }

    const resultSummary = Object.entries(subResponses)
      .map(([key, resp]) => `${key}: ${resp.reasoning}`)
      .join(' | ')
      .slice(0, 500);

    const { scrubbed, manifest: scrubManifest } = scrubObject(subInput);
    const scrubbedInputHash = sha256(JSON.stringify(scrubbed));
    const article12 = await this.logArticle12(
      action,
      scrubbedInputHash,
      scrubManifest,
      resultSummary || action,
    );

    const auditEntry = this.appendAuditEntry(
      context.sessionId,
      action,
      requestFingerprint,
      resultSummary || action,
    );

    const confidences = Object.values(subResponses).map((r) => r.confidence);
    const overallConfidence =
      confidences.length > 0
        ? confidences.reduce((sum, c) => sum + c, 0) / confidences.length
        : 0.5;

    const recommendations = Object.values(subResponses).flatMap((r) => r.recommendations);
    if (blocked.length > 0) {
      recommendations.push(...blocked.map((b) => `BLOCKED — ${b}`));
    }
    if (!article12.logged) {
      recommendations.push(
        `Article 12 evidence NOT persisted (degraded mode): ${article12.error}. Local audit-chain entry (seq ${auditEntry.seq}) still recorded.`,
      );
    }

    return {
      agentName: this.config.name,
      result: {
        action,
        components: subResponses,
        blocked,
      },
      confidence: overallConfidence,
      reasoning:
        Object.keys(subResponses).length > 0
          ? `Composed ${Object.keys(subResponses).join(', ')} for action '${action}'.`
          : `No component executed for action '${action}'.`,
      recommendations,
      metadata: {
        sessionId: context.sessionId,
        action,
        requestFingerprint,
        article12,
        auditChain: {
          seq: auditEntry.seq,
          entryHash: auditEntry.entryHash,
        },
      },
    };
  }
}
