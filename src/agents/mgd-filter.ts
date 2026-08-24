/**
 * MGD Audit-Grade Filter — "which decisions count"
 *
 * Implements the deterministic filter that decides whether an agent decision
 * qualifies as a **Monthly Governed Decision (MGD)** — the DWS north-star
 * metric ratified in the 2026-07-05 dominant-game field note and registered as
 * a canonical fact.
 *
 *   Canonical source : docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md §3
 *   Registry         : DWS_TRUTH_STANDARD.md §2 row 29
 *   Structured mirror: config/truth/mgd-crc-metrics.json
 *
 * Verbatim MGD definition (field note §3):
 *   "A decision counts only when it (a) flows through the governed outcome
 *    layer, (b) carries full Article 12 reasoning lineage, and (c) is
 *    audit-grade (would survive regulator or internal-audit scrutiny).
 *    Pilots, demos, and ungoverned agent runs do not count — exactly as
 *    MySpace's dormant accounts did not count for Facebook."
 *
 * This is a pure, side-effect-free transform. It answers the "audit-grade
 * filter (which decisions count)" the field note §4 step 6 names as the actual
 * work of instrumenting the metric — the plumbing (agent_executions +
 * article12_audit_log) already exists. Code answers this, never the model
 * (Engineering Discipline Rule 5).
 *
 * Candidate universe: rows of `article12_audit_log` (migration 038). A row in
 * that append-only ledger means the run flowed through the Article-12-governed
 * path; the filter decides which of those rows are *complete* enough to count.
 */

/** The three MGD criteria, keyed for machine-checkable reporting. */
export type MgdCriterion = 'governed-outcome-layer' | 'article12-lineage' | 'audit-grade';

export const MGD_CRITERIA: Record<MgdCriterion, string> = {
  'governed-outcome-layer':
    'Flows through the governed outcome layer (has an Article 12 governed-run record).',
  'article12-lineage':
    'Carries full Article 12 reasoning lineage (pre-flight input hash + post-flight thinking-block hash).',
  'audit-grade':
    'Audit-grade — would survive regulator or internal-audit scrutiny (human-reviewable decision summary, risk classification set, PII scrubbed before egress).',
};

/**
 * A decision candidate, shaped as an `article12_audit_log` row (snake_case so
 * Supabase rows can be passed in unchanged). Only the fields the filter reads
 * are required; extra columns are ignored.
 */
export interface MgdCandidate {
  agent_id?: string | null;
  /** SHA-256 of the sanitized input — proves a pre-flight entry was written. */
  input_hash?: string | null;
  /** SHA-256 of the thinking block — proves post-flight reasoning lineage. */
  thinking_block_hash?: string | null;
  /** First 500 chars of output for human audit review. */
  decision_summary?: string | null;
  risk_classification?: 'high' | 'limited' | 'minimal' | null;
  /** Must be true — an un-scrubbed decision would not survive a GDPR audit. */
  pii_scrubbed?: boolean | null;
  created_at?: string | null;
}

export interface MgdEvaluation {
  /** True only when every criterion passes. */
  counts: boolean;
  /** Criteria that failed, in canonical order. Empty when `counts` is true. */
  failedCriteria: MgdCriterion[];
}

const present = (v: unknown): boolean => typeof v === 'string' && v.trim().length > 0;

/**
 * Evaluate a single candidate against the three MGD criteria.
 * Deterministic and pure — the same input always yields the same result.
 */
export function evaluateMgd(candidate: MgdCandidate): MgdEvaluation {
  const failedCriteria: MgdCriterion[] = [];

  // (a) Flows through the governed outcome layer.
  if (!present(candidate.agent_id)) {
    failedCriteria.push('governed-outcome-layer');
  }

  // (b) Full Article 12 reasoning lineage: both pre-flight (input_hash) and
  //     post-flight (thinking_block_hash) must be present. A pre-flight-only
  //     row is an incomplete decision — the run never produced a governed
  //     output, like a dormant MySpace account.
  if (!present(candidate.input_hash) || !present(candidate.thinking_block_hash)) {
    failedCriteria.push('article12-lineage');
  }

  // (c) Audit-grade: a human-reviewable decision summary, an explicit risk
  //     classification, and confirmation that PII was scrubbed before egress.
  if (
    !present(candidate.decision_summary) ||
    !present(candidate.risk_classification) ||
    candidate.pii_scrubbed !== true
  ) {
    failedCriteria.push('audit-grade');
  }

  return { counts: failedCriteria.length === 0, failedCriteria };
}

export interface MgdCount {
  /** Candidates evaluated (the governed-run universe for the window). */
  candidatesEvaluated: number;
  /** Candidates that count as Monthly Governed Decisions. */
  monthlyGovernedDecisions: number;
  /** Candidates that were evaluated but did not count. */
  excluded: number;
  /**
   * Excluded candidates broken down by the first criterion they failed
   * (canonical order), so the dashboard can show *why* decisions were dropped.
   */
  excludedByCriterion: Record<MgdCriterion, number>;
}

/**
 * Apply {@link evaluateMgd} across a set of candidates and aggregate the count.
 * The primary MGD number is `monthlyGovernedDecisions`.
 */
export function countMgd(candidates: MgdCandidate[]): MgdCount {
  const excludedByCriterion: Record<MgdCriterion, number> = {
    'governed-outcome-layer': 0,
    'article12-lineage': 0,
    'audit-grade': 0,
  };

  let counted = 0;
  for (const candidate of candidates) {
    const { counts, failedCriteria } = evaluateMgd(candidate);
    if (counts) {
      counted += 1;
    } else {
      // Attribute the exclusion to the first (most fundamental) failed criterion.
      excludedByCriterion[failedCriteria[0]] += 1;
    }
  }

  return {
    candidatesEvaluated: candidates.length,
    monthlyGovernedDecisions: counted,
    excluded: candidates.length - counted,
    excludedByCriterion,
  };
}
