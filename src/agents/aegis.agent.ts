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
 *      exact fingerprint has already been recorded. Durable as of
 *      2026-08-19 (see aegis-durable-store.ts) — backed by Postgres
 *      (aegis_audit_chain, migration 023) via the shared internal-db.ts
 *      pool, so replay protection survives a process restart and is shared
 *      across horizontally scaled instances reading the same DGX Spark
 *      Postgres. Degrades to the prior in-process-only behavior (with
 *      `durable: false` surfaced on every entry) if that Postgres is
 *      unreachable — see AegisDurableStore's degraded-mode notes.
 *   3. A tamper-evident, hash-chained audit trail (getAuditChain() /
 *      verifyAuditChain()) so every Aegis decision can be shown not to
 *      have been altered after the fact. Durable as of 2026-08-19 for the
 *      same reason as (2) — the hash-chain formula is unchanged, only the
 *      persistence layer moved from an in-process Array to Postgres.
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
import { type ScrubManifest, scrubObject } from './pii-scrubber.js';
import { type AegisAuditEntry, AegisDurableStore } from './aegis-durable-store.js';
import logger from '../utils/logger.js';

type AegisAction = 'orbital-intelligence' | 'sovereignty' | 'compliance' | 'assess' | 'audit-chain';

const VALID_ACTIONS: AegisAction[] = [
  'orbital-intelligence',
  'sovereignty',
  'compliance',
  'assess',
  'audit-chain',
];

export type { AegisAuditEntry } from './aegis-durable-store.js';

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export class AegisAgent extends BaseAgent {
  // Durable as of 2026-08-19 — see aegis-durable-store.ts. A single store
  // instance is shared across all AegisAgent instances in this process
  // (matches the prior static-field sharing semantics) but every write/read
  // goes through the Postgres-backed aegis_audit_chain table when reachable.
  private static store = new AegisDurableStore();

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

  /**
   * Read-only accessor for tests / operators — the audit chain, durable rows
   * preferred (falls back to the in-process buffer only in degraded mode).
   */
  static async getAuditChain(): Promise<readonly AegisAuditEntry[]> {
    return AegisAgent.store.getChain();
  }

  /** Verify the audit chain has not been altered out of band. */
  static async verifyAuditChain(): Promise<{
    valid: boolean;
    brokenAtSeq: number | null;
    durable: boolean;
  }> {
    return AegisAgent.store.verifyChain();
  }

  /** Test-only reset — production processes never need to clear this. */
  static _resetForTests(): void {
    AegisAgent.store.resetForTests();
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
      const verification = await AegisAgent.verifyAuditChain();
      const entries = await AegisAgent.getAuditChain();
      return {
        agentName: this.config.name,
        result: {
          action,
          entries,
          chainLength: entries.length,
          ...verification,
        },
        confidence: 1,
        reasoning: `Audit chain has ${entries.length} entr(y/ies); integrity ${verification.valid ? 'VALID' : 'BROKEN'}${verification.durable ? '' : ' (DEGRADED — durable store unreachable, showing in-process buffer only)'}.`,
        recommendations: verification.valid
          ? []
          : [
              `Audit chain integrity broken at seq ${verification.brokenAtSeq} — investigate before trusting this record.`,
            ],
        metadata: { sessionId: context.sessionId, action, durable: verification.durable },
      };
    }

    const subInput: Record<string, unknown> = { ...input };
    delete subInput.action;

    const requestFingerprint = sha256(`${context.sessionId}|${action}|${JSON.stringify(subInput)}`);

    const reservation = await AegisAgent.store.reserve(
      context.sessionId,
      action,
      requestFingerprint,
    );
    if (reservation.replay) {
      return {
        agentName: this.config.name,
        result: { action, replay: true, requestFingerprint },
        confidence: 1,
        reasoning:
          'Rejected: identical (sessionId, action, input) fingerprint already recorded — possible replay.',
        recommendations: [
          'Issue a fresh request with a new sessionId or changed input if this is intentional.',
        ],
        metadata: { sessionId: context.sessionId, action, replayRejected: true },
      };
    }
    const reservationHandle = reservation.handle;

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

    const auditEntry = await AegisAgent.store.finalize(reservationHandle, resultSummary || action);

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
        `Article 12 evidence NOT persisted (degraded mode): ${article12.error}. Audit-chain entry (seq ${auditEntry.seq}, durable=${auditEntry.durable}) still recorded.`,
      );
    }
    if (!auditEntry.durable) {
      recommendations.push(
        `Audit-chain durable store unreachable — entry (seq ${auditEntry.seq}) recorded in the in-process fallback buffer only and will NOT survive a restart. Check INTERNAL_DB_URL.`,
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
          durable: auditEntry.durable,
        },
      },
    };
  }
}
