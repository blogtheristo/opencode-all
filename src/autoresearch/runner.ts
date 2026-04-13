/**
 * Autoresearch Runner — CLI entry point for KYA parameter tuning
 *
 * Provides structured JSON output for CLI and MCP tool integration.
 * Follows DWS "Build for Agents" rule: JSON output, CLI-accessible, MCP-exposed.
 */

import { DEFAULT_KYA_PARAMS, runKyaTuner, SECURITY_CONSTANTS } from './kya-tuner.js';
import type { TunerConfig } from './kya-tuner.js';
import { generateSyntheticSessions } from './synthetic-kya.js';

// Derive KYA decision thresholds from shared SECURITY_CONSTANTS to avoid drift
const {
  efficiencyThresholdPercent: KYA_EFFICIENCY_THRESHOLD_PERCENT = 11,
  logicDriftThresholdPercent: KYA_LOGIC_DRIFT_THRESHOLD_PERCENT = 25,
} = SECURITY_CONSTANTS as {
  efficiencyThresholdPercent?: number;
  logicDriftThresholdPercent?: number;
};

// ============================================================================
// CLI OUTPUT FORMAT
// ============================================================================

export interface AutoresearchOutput {
  /** Command that was run */
  command: 'autoresearch';

  /** Subcommand: run | status | results */
  action: 'run' | 'status' | 'results';

  /** Whether the run succeeded */
  success: boolean;

  /** Run summary */
  summary: {
    totalExperiments: number;
    keptExperiments: number;
    discardedExperiments: number;
    baselineScore: number;
    finalScore: number;
    improvementPercent: number;
    kyaDecision: string;
  } | null;

  /** Kept experiments (improvements) */
  improvements: Array<{
    experimentId: number;
    hypothesis: string;
    combinedScore: number;
    falsePositiveRate: number;
    falseNegativeRate: number;
  }>;

  /** Current or final parameters */
  parameters: Record<string, number>;

  /** Security constants (non-tunable, shown for transparency) */
  securityConstants: Record<string, number>;

  /** Firehorse audit event IDs for this run */
  auditEventIds: string[];

  /** Duration of the run in ms */
  durationMs: number;
}

// ============================================================================
// RUN COMMAND
// ============================================================================

export async function runAutoresearch(
  experiments: number = 20,
  config: Partial<TunerConfig> = {},
): Promise<AutoresearchOutput> {
  const startTime = Date.now();

  const results = await runKyaTuner({
    maxExperiments: experiments,
    ...config,
  });

  const kept = results.filter((r) => r.decision === 'KEEP');

  // Baseline should be independent of sorter order from runKyaTuner.
  // Use the earliest experiment (smallest experimentId) as the baseline source.
  const baseline =
    results.length > 0
      ? results.reduce(
          (earliest, r) => (r.experimentId < earliest.experimentId ? r : earliest),
          results[0],
        ).auditEvent.optimization.before_value
      : 0;

  const best = kept.length > 0 ? kept[0].combinedScore : baseline;
  const improvement = baseline > 0 ? ((best - baseline) / baseline) * 100 : 0;

  // Determine overall KYA decision
  let kyaDecision = 'NO_CHANGE';
  if (improvement > KYA_LOGIC_DRIFT_THRESHOLD_PERCENT) kyaDecision = 'ROLLBACK';
  else if (improvement > KYA_EFFICIENCY_THRESHOLD_PERCENT) kyaDecision = 'PENDING_HUMAN_GATE';
  else if (improvement > 0) kyaDecision = 'AUTO_DEPLOY';

  // Extract final parameters from last kept experiment
  const finalParams = kept.length > 0 ? kept[0].params : DEFAULT_KYA_PARAMS;

  return {
    command: 'autoresearch',
    action: 'run',
    success: true,
    summary: {
      totalExperiments: results.length,
      keptExperiments: kept.length,
      discardedExperiments: results.length - kept.length,
      baselineScore: Number(baseline.toFixed(4)),
      finalScore: Number(best.toFixed(4)),
      improvementPercent: Number(improvement.toFixed(2)),
      kyaDecision,
    },
    improvements: kept.map((r) => ({
      experimentId: r.experimentId,
      hypothesis: r.hypothesis,
      combinedScore: Number(r.combinedScore.toFixed(4)),
      falsePositiveRate: Number(r.falsePositiveRate.toFixed(4)),
      falseNegativeRate: Number(r.falseNegativeRate.toFixed(4)),
    })),
    parameters: Object.fromEntries(
      Object.entries(finalParams).map(([k, v]) => [k, Number(Number(v).toFixed(6))]),
    ),
    securityConstants: { ...SECURITY_CONSTANTS },
    auditEventIds: results.map((r) => r.auditEvent.event_id),
    durationMs: Date.now() - startTime,
  };
}

// ============================================================================
// STATUS COMMAND
// ============================================================================

export function getAutoresearchStatus(): AutoresearchOutput {
  const sessions = generateSyntheticSessions(100);
  // Stats available via getSessionStats(sessions) when needed
  void sessions;

  return {
    command: 'autoresearch',
    action: 'status',
    success: true,
    summary: null,
    improvements: [],
    parameters: Object.fromEntries(
      Object.entries(DEFAULT_KYA_PARAMS).map(([k, v]) => [k, Number(Number(v).toFixed(6))]),
    ),
    securityConstants: { ...SECURITY_CONSTANTS },
    auditEventIds: [],
    durationMs: 0,
  };
}
