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
 * Data sovereignty guarantee:
 *   - Raw prompt/response content is NEVER logged (only token counts + model ID)
 *   - All records stored in Supabase EU-north1 (Finland, CLOUD Act-free)
 *   - Consent revocation takes effect immediately (synchronous check on every call)
 *
 * Tables required in Supabase (see migration in supabase/migrations/):
 *   grok_consent        — per-org consent record
 *   grok_inference_log  — per-call Article 12 audit trail
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

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
}

export interface InferenceEvent {
  orgId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  status: 'ok' | 'error';
  error?: string;
}

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
   */
  async checkConsent(orgId: string): Promise<ConsentStatus> {
    const db = this.getSupabase();
    if (!db) {
      return {
        granted: false,
        reason: 'Consent store unavailable (Supabase not configured)',
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
      };
    }

    if (!data.granted || data.revoked_at) {
      return {
        granted: false,
        reason: data.revoked_at
          ? `Consent revoked at ${data.revoked_at}`
          : 'Consent not granted',
      };
    }

    return { granted: true, reason: 'Consent active' };
  }

  /**
   * Grant Grok consent for an org.
   * Records who granted it and when (GDPR accountability requirement).
   */
  async grantConsent(
    orgId: string,
    grantedByUserId: string,
    allowedCategories: string[] = ['climate', 'carbon', 'compliance'],
    note?: string,
  ): Promise<void> {
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

    logger.info('Grok consent granted', { orgId, grantedByUserId, allowedCategories });
    await this.logConsentEvent(orgId, 'granted', grantedByUserId);
  }

  /**
   * Revoke Grok consent for an org — effective immediately.
   */
  async revokeConsent(orgId: string, revokedByUserId: string, reason?: string): Promise<void> {
    const db = this.getSupabase();
    if (!db) throw new Error('Supabase not configured — cannot record revocation');

    const now = new Date().toISOString();

    const { error } = await db
      .from('grok_consent')
      .update({
        granted: false,
        revoked_at: now,
        revoked_by_user_id: revokedByUserId,
        note: reason ?? null,
        updated_at: now,
      })
      .eq('org_id', orgId);

    if (error) {
      throw new Error(`Failed to revoke consent: ${error.message}`);
    }

    logger.info('Grok consent revoked', { orgId, revokedByUserId });
    await this.logConsentEvent(orgId, 'revoked', revokedByUserId, reason);
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
   */
  async getAuditLog(
    orgId: string,
    limit = 50,
    offset = 0,
  ): Promise<{ events: Record<string, unknown>[]; total: number }> {
    const db = this.getSupabase();
    if (!db) return { events: [], total: 0 };

    const { data, error, count } = await db
      .from('grok_inference_log')
      .select('*', { count: 'exact' })
      .eq('org_id', orgId)
      .order('logged_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('Failed to fetch Grok audit log', { error: error.message, orgId });
      return { events: [], total: 0 };
    }

    return { events: (data as Record<string, unknown>[]) ?? [], total: count ?? 0 };
  }

  // ============ PRIVATE HELPERS ============

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
      logger.error('Failed to log Grok consent event', {
        error: error.message,
        orgId,
        action,
        userId,
      });
    }
  }
}

export const grokConsentService = new GrokConsentService();
