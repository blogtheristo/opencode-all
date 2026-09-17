/**
 * MGD Metrics Service — monthly aggregator for Monthly Governed Decisions.
 *
 * Reads the append-only `article12_audit_log` ledger (migration 038) for a
 * calendar-month window and applies the audit-grade filter (`mgd-filter.ts`)
 * to produce the MGD count for that month.
 *
 *   Canonical source : docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md §3–§4
 *   Registry         : DWS_TRUTH_STANDARD.md §2 row 29
 *
 * Why article12_audit_log and not agent_executions: the field note is explicit
 * that "pilots, demos, and ungoverned agent runs do not count." A row in
 * article12_audit_log means the run went through the Article-12-governed path,
 * so that ledger is the correct candidate universe. `agent_executions` is the
 * broader all-runs log (the denominator), not the MGD count. The two tables
 * share no join key (agent_id vs agent_name, no trace_id on executions), which
 * is a second reason to count from the governed ledger directly.
 *
 * CRC (Customer-Retained Capital), the secondary/compounding metric, is NOT
 * computed here: it is a 4P asset inventory (ontology, skills, calibrated
 * Control Room thresholds, evaluated datasets the customer keeps), not a
 * quantity derivable from execution logs. It is intentionally omitted rather
 * than fabricated (Engineering Discipline Rule 12 — fail loud, never invent).
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { countMgd, evaluateMgd, type MgdCandidate, type MgdCount } from './mgd-filter.js';
import logger from '../utils/logger.js';

export interface MgdMonthlyMetrics extends MgdCount {
  /** First day of the counted month, YYYY-MM-DD. */
  month: string;
  /** Counted MGD candidates broken down by EU AI Act risk classification. */
  byRiskClassification: Record<'high' | 'limited' | 'minimal' | 'unclassified', number>;
}

/** Columns the filter needs from article12_audit_log. */
const CANDIDATE_COLUMNS =
  'agent_id, input_hash, thinking_block_hash, decision_summary, risk_classification, pii_scrubbed, created_at';

export class MGDMetricsService {
  private supabase: SupabaseClient | null;

  /**
   * @param client Optional Supabase client to reuse (e.g. the request-scoped
   *   client in a route, or a fake in tests). When omitted, one is created from
   *   env — accepting either SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY,
   *   since the two existing callers in this repo disagree on the name.
   */
  constructor(client?: SupabaseClient) {
    if (client) {
      this.supabase = client;
      return;
    }
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.supabase = url && key ? createClient(url, key) : null;
  }

  /**
   * Count Monthly Governed Decisions for the month containing `targetMonth`
   * (defaults to the current month). Returns zeros if the client is
   * unavailable or the query fails — never throws.
   */
  async getMGDMetrics(targetMonth?: Date): Promise<MgdMonthlyMetrics> {
    const monthStart = this.getFirstDayOfMonth(targetMonth ?? new Date());
    const monthEnd = this.getFirstDayOfNextMonth(monthStart);
    const empty = this.emptyMetrics(monthStart);

    if (!this.supabase) {
      logger.debug('MGDMetricsService: Supabase not configured — returning empty metrics');
      return empty;
    }

    const { data, error } = await this.supabase
      .from('article12_audit_log')
      .select(CANDIDATE_COLUMNS)
      .gte('created_at', monthStart.toISOString())
      .lt('created_at', monthEnd.toISOString());

    if (error) {
      logger.warn('MGDMetricsService: failed to read article12_audit_log', {
        error: error.message,
      });
      return empty;
    }

    const candidates = (data ?? []) as MgdCandidate[];
    const count = countMgd(candidates);

    // Risk breakdown of the decisions that actually counted — reuses the same
    // filter as countMgd so the two can never disagree.
    const byRiskClassification = this.emptyRiskBreakdown();
    for (const candidate of candidates) {
      if (!evaluateMgd(candidate).counts) continue;
      byRiskClassification[candidate.risk_classification ?? 'unclassified'] += 1;
    }

    return { month: this.toDateOnly(monthStart), ...count, byRiskClassification };
  }

  // ── helpers ──────────────────────────────────────────────────────────────

  private getFirstDayOfMonth(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  }

  private getFirstDayOfNextMonth(monthStart: Date): Date {
    return new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1));
  }

  private toDateOnly(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private emptyRiskBreakdown(): MgdMonthlyMetrics['byRiskClassification'] {
    return { high: 0, limited: 0, minimal: 0, unclassified: 0 };
  }

  private emptyMetrics(monthStart: Date): MgdMonthlyMetrics {
    return {
      month: this.toDateOnly(monthStart),
      candidatesEvaluated: 0,
      monthlyGovernedDecisions: 0,
      excluded: 0,
      excludedByCriterion: {
        'governed-outcome-layer': 0,
        'article12-lineage': 0,
        'audit-grade': 0,
      },
      byRiskClassification: this.emptyRiskBreakdown(),
    };
  }
}
