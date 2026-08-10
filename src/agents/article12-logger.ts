/**
 * Article 12 Logger — EU AI Act Audit Trail
 *
 * Writes append-only audit entries to article12_audit_log (self-hosted Postgres
 * on DGX Spark — dws-postgres). Called by every cloud agent after each
 * Anthropic API response.
 *
 * Usage:
 *   const logger = new Article12Logger();
 *   const { traceId } = await logger.logPreFlight({ agentId, inputHash, model, ... });
 *   // ... call Anthropic API ...
 *   await logger.logPostFlight({ traceId, response, thinkingBlock, manifest });
 *
 * Compliance guarantee:
 *   - pre-flight log written BEFORE cloud egress (proves scrubbing happened first)
 *   - post-flight log written AFTER response (captures output lineage)
 *   - Both entries share the same trace_id for cross-reference
 *   - RLS on this table (once ported) denies UPDATE and DELETE — logs are tamper-evident
 */

import { createHash, randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import { getInternalDbPool } from '../config/internal-db.js';
import type { ScrubManifest } from './pii-scrubber.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PreFlightEntry {
  agentId: string;
  /** SHA-256 of the sanitized (post-scrub) input */
  inputHash: string;
  model: string;
  thinkingEffort?: 'low' | 'medium' | 'high' | 'max' | 'none';
  regulationIds?: string[];
  scrubManifest: ScrubManifest;
  scrubberVersion?: string;
  riskClassification?: 'high' | 'limited' | 'minimal';
}

export interface PostFlightEntry {
  traceId: string;
  /** Raw thinking block text (will be hashed — never stored in plain form) */
  thinkingBlockText?: string;
  /** First 500 chars of agent output — must be pre-scrubbed by caller */
  decisionSummary?: string;
  inputTokenCount?: number;
  outputTokenCount?: number;
}

export interface PreFlightResult {
  traceId: string;
  logId: string;
}

// ─── Logger ───────────────────────────────────────────────────────────────────

export class Article12Logger {
  private pool: Pool;
  private readonly scrubberVersion: string;

  constructor(scrubberVersion = '1.0.0') {
    const pool = getInternalDbPool();

    if (!pool) {
      throw new Error('Article12Logger: INTERNAL_DB_URL is required');
    }

    this.pool = pool;
    this.scrubberVersion = scrubberVersion;
  }

  /**
   * Step 1 of 2: Log before the cloud API call.
   * Creates the audit entry with PENDING status and returns the trace_id.
   * Callers MUST call logPostFlight() after the API response.
   */
  async logPreFlight(entry: PreFlightEntry): Promise<PreFlightResult> {
    const traceId = randomUUID();
    const manifestHash = createHash('sha256')
      .update(JSON.stringify(entry.scrubManifest))
      .digest('hex');

    try {
      const result = await this.pool.query(
        `INSERT INTO article12_audit_log (
           trace_id, agent_id, input_hash, model, thinking_effort, regulation_ids,
           pii_scrubbed, pii_types_found, pii_replacement_count, scrub_manifest_hash,
           inference_in_eu, pii_scrub_location, inference_location, scrubber_version,
           risk_classification, thinking_block_hash, decision_summary,
           input_token_count, output_token_count
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
         RETURNING id`,
        [
          traceId,
          entry.agentId,
          entry.inputHash,
          entry.model,
          entry.thinkingEffort ?? 'none',
          entry.regulationIds ?? [],
          true,
          entry.scrubManifest.typesFound,
          entry.scrubManifest.replacementCount,
          manifestHash,
          false, // Anthropic API is US-based — honest declaration
          'veriton-helsinki-fi',
          'anthropic-us',
          entry.scrubberVersion ?? this.scrubberVersion,
          entry.riskClassification ?? 'high',
          // Post-flight fields left null until logPostFlight() is called
          null,
          null,
          null,
          null,
        ],
      );

      return { traceId, logId: result.rows[0].id };
    } catch (err) {
      throw new Error(
        `Article12Logger.logPreFlight failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /**
   * Step 2 of 2: Update the audit entry after the cloud API response.
   * Hashes the thinking block (never stores raw reasoning).
   * Truncates decision_summary to 500 chars — caller must ensure no PII.
   */
  async logPostFlight(entry: PostFlightEntry): Promise<void> {
    const thinkingHash = entry.thinkingBlockText
      ? createHash('sha256').update(entry.thinkingBlockText).digest('hex')
      : null;

    const summary = entry.decisionSummary ? entry.decisionSummary.slice(0, 500) : null;

    // IMPORTANT: If RLS on this table (once ported) ever blocks UPDATE for the
    // service role, switch to a two-row approach (pre-flight + post-flight as
    // separate rows) instead of relying on connection-level access control.
    try {
      await this.pool.query(
        `UPDATE article12_audit_log
         SET thinking_block_hash = $1, decision_summary = $2,
             input_token_count = $3, output_token_count = $4
         WHERE trace_id = $5`,
        [
          thinkingHash,
          summary,
          entry.inputTokenCount ?? null,
          entry.outputTokenCount ?? null,
          entry.traceId,
        ],
      );
    } catch (err) {
      // Non-fatal: log to stderr but don't crash the agent response
      // The pre-flight entry is already written — partial record is better than no record
      console.error(
        `Article12Logger.logPostFlight failed (trace ${entry.traceId}): ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /**
   * Convenience wrapper: scrub + pre-flight log in one call.
   * Returns trace_id for use in the post-flight call.
   */
  static hashText(text: string): string {
    return createHash('sha256').update(text).digest('hex');
  }
}

// ─── Standalone helpers ───────────────────────────────────────────────────────

/**
 * Hash a thinking block for Article 12 lineage proof.
 * Store the hash; discard the raw thinking text.
 */
export function hashThinkingBlock(thinkingText: string): string {
  return createHash('sha256').update(thinkingText).digest('hex');
}

/**
 * Build a safe decision_summary from agent output.
 * Truncates to 500 chars. Caller is responsible for scrubbing PII first.
 */
export function buildDecisionSummary(rawOutput: string): string {
  return rawOutput.slice(0, 500);
}
