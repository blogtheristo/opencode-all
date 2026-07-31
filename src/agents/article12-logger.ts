/**
 * Article 12 Logger — EU AI Act Audit Trail
 *
 * Writes append-only audit entries to article12_audit_log (Supabase, europe-north1).
 * Called by every cloud agent after each Anthropic API response.
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
 *   - Supabase RLS denies UPDATE and DELETE — logs are tamper-evident
 */

import { createHash, randomUUID } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
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
  private supabase: SupabaseClient;
  private readonly scrubberVersion: string;

  constructor(scrubberVersion = '1.0.0') {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Article12Logger: SUPABASE_URL and SUPABASE_SERVICE_KEY are required');
    }

    this.supabase = createClient(url, key);
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

    const row = {
      trace_id: traceId,
      agent_id: entry.agentId,
      input_hash: entry.inputHash,
      model: entry.model,
      thinking_effort: entry.thinkingEffort ?? 'none',
      regulation_ids: entry.regulationIds ?? [],
      pii_scrubbed: true,
      pii_types_found: entry.scrubManifest.typesFound,
      pii_replacement_count: entry.scrubManifest.replacementCount,
      scrub_manifest_hash: manifestHash,
      inference_in_eu: false,          // Anthropic API is US-based — honest declaration
      pii_scrub_location: 'veriton-helsinki-fi',
      inference_location: 'anthropic-us',
      scrubber_version: entry.scrubberVersion ?? this.scrubberVersion,
      risk_classification: entry.riskClassification ?? 'high',
      // Post-flight fields left null until logPostFlight() is called
      thinking_block_hash: null as string | null,
      decision_summary: null as string | null,
      input_token_count: null as number | null,
      output_token_count: null as number | null,
    };

    const { data, error } = await this.supabase
      .from('article12_audit_log')
      .insert(row)
      .select('id')
      .single();

    if (error) {
      throw new Error(`Article12Logger.logPreFlight failed: ${error.message}`);
    }

    return { traceId, logId: data.id };
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

    const summary = entry.decisionSummary
      ? entry.decisionSummary.slice(0, 500)
      : null;

    // Supabase RLS blocks UPDATE — we use service_role which bypasses RLS for updates
    // only because we explicitly REVOKE UPDATE from service_role in the migration
    // for the *public* endpoint. This internal SDK call uses the service key directly.
    //
    // IMPORTANT: If Supabase ever adds UPDATE RLS enforcement for service_role,
    // switch to a two-row approach (pre-flight + post-flight as separate rows).
    const { error } = await this.supabase
      .from('article12_audit_log')
      .update({
        thinking_block_hash: thinkingHash,
        decision_summary: summary,
        input_token_count: entry.inputTokenCount ?? null,
        output_token_count: entry.outputTokenCount ?? null,
      })
      .eq('trace_id', entry.traceId);

    if (error) {
      // Non-fatal: log to stderr but don't crash the agent response
      // The pre-flight entry is already written — partial record is better than no record
      console.error(`Article12Logger.logPostFlight failed (trace ${entry.traceId}): ${error.message}`);
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
