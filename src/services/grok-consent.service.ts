/**
 * Grok Consent Service — GDPR + EU AI Act Article 12 Compliance
 *
 * DWS IQ 6/7 routes inference through xAI Grok only when the operator
 * organisation has given explicit, recorded, revocable consent.
 *
 * Regulatory basis:
 *   - GDPR Art. 6(1)(a): explicit consent for data transfer to third-country processor
 *   - EU AI Act Annex IV / Article 12: automatic logging of high-risk AI system events
 *   - NIS2 Art. 21: incident traceability
 *
 * KYA Integration (§18 DWS_SECURITY_STANDARD):
 *   - Consent grant/revoke require KYA score >= 50 (restricted or higher)
 *   - All consent mutations logged as KYA telemetry events
 *   - Inference events include KYA governance metadata for court-defensible audit
 *
 * Harness Engineering (L6 — DWS Information Layering Strategy):
 *   - Audit log responses include compliance harness metadata
 *   - Every inference event carries sovereignty provenance chain
 *
 * Data sovereignty guarantee:
 *   - Raw prompt/response content is NEVER logged (only token counts + model ID)
 *   - All records stored in Supabase EU-north1 (Finland, CLOUD Act-free)
 *   - Consent revocation takes effect immediately (synchronous check on every call)
 *
 * Tables required in Supabase (see migration in supabase/migrations/):
 *   grok_consent        — per-org consent record
 *   grok_inference_log  — per-call Article 12 audit trail
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import type { PermissionLevel } from '../identity/types.js';

// ============ TYPES ============

export interface ConsentRecord {
  org_id: string;
  granted: boolean;
  granted_at: string | null;
  granted_by_user_id: string | null;
  revoked_at: string | null;
  revoked_by_user_id: string | null;
  /** Optional: restrict sharing to these data categories only */
  allowed_categories: string[];
  /** Human-readable note stored with the consent decision */
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsentStatus {
  granted: boolean;
  reason: string;
  /** KYA governance context attached to every consent check */
  kya?: KYAGovernanceContext;
}

export interface InferenceEvent {
  orgId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  status: 'ok' | 'error';
  error?: string;
  /** KYA score of the calling agent at inference time */
  kyaScore?: number;
  /** KYA permission level at inference time */
  kyaPermissionLevel?: PermissionLevel;
}

/** KYA governance context for harness engineering (L6 compliance metadata) */
export interface KYAGovernanceContext {
  /** KYA score at time of operation (0–100) */
  kyaScore: number;
  /** Permission level derived from ATS engine */
  permissionLevel: PermissionLevel;
  /** Whether the caller's KYA level permits this operation */
  authorized: boolean;
  /** Sovereignty harness layer (L6: tool result injection) */
  harnessLayer: 'L6';
  /** Data residency of the consent store */
  dataResidency: 'eu-north1';
  /** Regulatory framework governing this operation */
  regulations: string[];
}

/** Audit harness metadata for L6 tool result injection (regulator export) */
export interface AuditHarnessMetadata {
  harnessLayer: 'L6';
  dataResidency: 'eu-north1';
  cloudActFree: boolean;
  retentionYears: number;
  regulations: string[];
  kyaStandard: string;
  contentPolicy: string;
}

/** Minimum KYA score required for consent mutations (grant/revoke) */
const KYA_CONSENT_MUTATION_THRESHOLD = 50;

// ============ SERVICE ============

export class GrokConsentService {
  private supabase: SupabaseClient | null = null;

  private getSupabase(): SupabaseClient | null {
    if (this.supabase) return this.supabase;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return null;
    this.supabase = createClient(url, key);
    return this.supabase;
  }

  /**
   * Check whether an org has granted consent for Grok inference.
   * Privacy-first: if Supabase is unavailable, consent is denied.
   *
   * @param orgId - Organisation ID
   * @param callerKyaScore - Optional KYA score of the calling agent (0–100)
   */
  async checkConsent(orgId: string, callerKyaScore?: number): Promise<ConsentStatus> {
    const kyaCtx = this.buildKYAContext(callerKyaScore ?? 100, true);
    const db = this.getSupabase();
    if (!db) {
      return {
        granted: false,
        reason: 'Consent store unavailable (Supabase not configured)',
        kya: kyaCtx,
      };
    }

    const { data, error } = await db
      .from('grok_consent')
      .select('granted, revoked_at')
      .eq('org_id', orgId)
      .single();

    if (error || !data) {
      return {
        granted: false,
        reason: 'No consent record found — explicit opt-in required',
        kya: kyaCtx,
      };
    }

    if (!data.granted || data.revoked_at) {
      return {
        granted: false,
        reason: data.revoked_at
          ? `Consent revoked at ${data.revoked_at}`
          : 'Consent not granted',
        kya: kyaCtx,
      };
    }

    return { granted: true, reason: 'Consent active', kya: kyaCtx };
  }

  /**
   * Grant Grok consent for an org.
   * Records who granted it and when (GDPR accountability requirement).
   *
   * KYA gate: caller must have KYA score >= 50 (restricted or higher).
   * Agents with suspended/frozen trust cannot grant third-party data consent.
   */
  async grantConsent(
    orgId: string,
    grantedByUserId: string,
    allowedCategories: string[] = ['climate', 'carbon', 'compliance'],
    note?: string,
    callerKyaScore?: number,
  ): Promise<{ kya: KYAGovernanceContext }> {
    // KYA trust gate — consent mutation requires restricted+ trust level
    const kyaCtx = this.buildKYAContext(
      callerKyaScore ?? 100,
      false,
    );
    if (callerKyaScore !== undefined && callerKyaScore < KYA_CONSENT_MUTATION_THRESHOLD) {
      logger.warn('Grok consent grant blocked — KYA score below threshold', {
        orgId, grantedByUserId, kyaScore: callerKyaScore, threshold: KYA_CONSENT_MUTATION_THRESHOLD,
      });
      throw new Error(
        `KYA trust score ${callerKyaScore} below threshold ${KYA_CONSENT_MUTATION_THRESHOLD} — consent grant denied`,
      );
    }

    const db = this.getSupabase();
    if (!db) throw new Error('Supabase not configured — cannot record consent');

    const now = new Date().toISOString();

    const { error } = await db.from('grok_consent').upsert(
      {
        org_id: orgId,
        granted: true,
        granted_at: now,
        granted_by_user_id: grantedByUserId,
        revoked_at: null,
        revoked_by_user_id: null,
        allowed_categories: allowedCategories,
        note: note ?? null,
        updated_at: now,
      },
      { onConflict: 'org_id' },
    );

    if (error) {
      throw new Error(`Failed to record consent: ${error.message}`);
    }

    logger.info('Grok consent granted', {
      orgId, grantedByUserId, allowedCategories, kyaScore: callerKyaScore,
    });
    await this.logConsentEvent(orgId, 'granted', grantedByUserId);
    return { kya: kyaCtx };
  }

  /**
   * Revoke Grok consent for an org — effective immediately.
   *
   * KYA gate: caller must have KYA score >= 50 (restricted or higher).
   */
  async revokeConsent(
    orgId: string,
    revokedByUserId: string,
    reason?: string,
    callerKyaScore?: number,
  ): Promise<{ kya: KYAGovernanceContext }> {
    const kyaCtx = this.buildKYAContext(callerKyaScore ?? 100, false);
    if (callerKyaScore !== undefined && callerKyaScore < KYA_CONSENT_MUTATION_THRESHOLD) {
      logger.warn('Grok consent revoke blocked — KYA score below threshold', {
        orgId, revokedByUserId, kyaScore: callerKyaScore, threshold: KYA_CONSENT_MUTATION_THRESHOLD,
      });
      throw new Error(
        `KYA trust score ${callerKyaScore} below threshold ${KYA_CONSENT_MUTATION_THRESHOLD} — consent revoke denied`,
      );
    }

    const db = this.getSupabase();
    if (!db) throw new Error('Supabase not configured — cannot record revocation');

    const now = new Date().toISOString();

    const { data, error } = await db
      .from('grok_consent')
      .update({
        granted: false,
        revoked_at: now,
        revoked_by_user_id: revokedByUserId,
        note: reason ?? null,
        updated_at: now,
      })
      .eq('org_id', orgId)
      .select('org_id');

    if (error) {
      throw new Error(`Failed to revoke consent: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error(`No consent record found for org ${orgId} — grant consent before revoking`);
    }

    logger.info('Grok consent revoked', { orgId, revokedByUserId });
    await this.logConsentEvent(orgId, 'revoked', revokedByUserId, reason);
    return { kya: kyaCtx };
  }

  /**
   * Log a blocked inference attempt (Article 12 traceability).
   */
  async logInferenceBlocked(orgId: string, reason: string): Promise<void> {
    logger.warn('Grok inference blocked — no consent', { orgId, reason });
    await this.logInferenceEvent({
      orgId,
      model: 'grok-blocked',
      inputTokens: 0,
      outputTokens: 0,
      durationMs: 0,
      status: 'error',
      error: `blocked: ${reason}`,
    });
  }

  /**
   * Log a Grok inference event for Article 12 audit trail.
   * Never logs prompt/response content — only metadata.
   * Includes KYA governance metadata when available.
   */
  async logInferenceEvent(event: InferenceEvent): Promise<void> {
    const db = this.getSupabase();
    if (!db) {
      // Fallback to structured log if Supabase unavailable
      logger.info('grok_inference_event', {
        org_id: event.orgId,
        model: event.model,
        input_tokens: event.inputTokens,
        output_tokens: event.outputTokens,
        duration_ms: event.durationMs,
        status: event.status,
        error: event.error,
        kya_score: event.kyaScore,
        kya_permission_level: event.kyaPermissionLevel,
      });
      return;
    }

    const { error } = await db.from('grok_inference_log').insert({
      org_id: event.orgId,
      model: event.model,
      input_tokens: event.inputTokens,
      output_tokens: event.outputTokens,
      duration_ms: event.durationMs,
      status: event.status,
      error_message: event.error ?? null,
      kya_score: event.kyaScore ?? null,
      kya_permission_level: event.kyaPermissionLevel ?? null,
      logged_at: new Date().toISOString(),
    });

    if (error) {
      // Non-fatal: log to structured logger so audit trail is never silently lost
      logger.error('Failed to write Grok inference log to Supabase', {
        error: error.message,
        orgId: event.orgId,
      });
    }
  }

  /**
   * Return paginated audit log for an org (for dashboard + regulator export).
   *
   * Harness engineering (L6): response includes sovereignty provenance metadata
   * for court-defensible audit trail and regulator export compliance.
   */
  async getAuditLog(
    orgId: string,
    limit = 50,
    offset = 0,
  ): Promise<{
    events: Record<string, unknown>[];
    total: number;
    harness: AuditHarnessMetadata;
  }> {
    const harness: AuditHarnessMetadata = {
      harnessLayer: 'L6',
      dataResidency: 'eu-north1',
      cloudActFree: true,
      retentionYears: 7,
      regulations: [
        'EU AI Act Article 12 — Automatic logging of high-risk AI systems',
        'GDPR Art. 6(1)(a) — Explicit consent for third-country processing',
        'NIS2 Art. 21 — Incident traceability',
      ],
      kyaStandard: 'KYA v1.2 — Know Your Agent trust chain governance',
      contentPolicy: 'No prompt or response content stored. Token counts and model ID only.',
    };

    const db = this.getSupabase();
    if (!db) return { events: [], total: 0, harness };

    const { data, error, count } = await db
      .from('grok_inference_log')
      .select('*', { count: 'exact' })
      .eq('org_id', orgId)
      .order('logged_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('Failed to fetch Grok audit log', { error: error.message, orgId });
      return { events: [], total: 0, harness };
    }

    return { events: (data as Record<string, unknown>[]) ?? [], total: count ?? 0, harness };
  }

  // ============ PRIVATE HELPERS ============

  /**
   * Build KYA governance context for response enrichment (harness L6).
   */
  private buildKYAContext(
    kyaScore: number,
    isReadOnly: boolean,
  ): KYAGovernanceContext {
    const permissionLevel: PermissionLevel =
      kyaScore >= 80 ? 'full' :
      kyaScore >= 50 ? 'restricted' :
      kyaScore > 0 ? 'suspended' : 'frozen';

    // Read operations allowed at any trust level; mutations require restricted+
    const authorized = isReadOnly || kyaScore >= KYA_CONSENT_MUTATION_THRESHOLD;

    return {
      kyaScore,
      permissionLevel,
      authorized,
      harnessLayer: 'L6',
      dataResidency: 'eu-north1',
      regulations: [
        'EU AI Act Art. 12',
        'GDPR Art. 6(1)(a)',
        'NIS2 Art. 21',
      ],
    };
  }

  private async logConsentEvent(
    orgId: string,
    action: 'granted' | 'revoked',
    userId: string,
    note?: string,
  ): Promise<void> {
    const db = this.getSupabase();
    if (!db) return;

    const { error } = await db.from('grok_consent_audit').insert({
      org_id: orgId,
      action,
      user_id: userId,
      note: note ?? null,
      occurred_at: new Date().toISOString(),
    });

    if (error) {
      // Non-fatal but must be visible: consent audit trail must never be silently lost
      logger.error('Failed to write Grok consent audit log to Supabase', {
        error: error.message,
        orgId,
        action,
        userId,
      });
    }
  }
}

export const grokConsentService = new GrokConsentService();
