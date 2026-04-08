/**
 * Tool Telemetry Types — DWS IQ 6/7
 *
 * Types for the ASTA (Agent-Supervised Tool Adaptation) telemetry system.
 * Tracks tool invocations, skip rates, partial failures, and chain outcomes.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (ASTA Phase 1)
 * Branch: claude/agent-tool-adaptation-7jpgj
 * Date: 2026-04-03
 * Owner: Lifetime Oy
 */

/** A single tool invocation telemetry event */
export interface ToolTelemetryEvent {
  /** Agent that invoked the tool */
  agentName: string;
  /** Tool that was invoked */
  toolName: string;
  /** Organization scope */
  orgId: string;
  /** Session for correlation */
  sessionId: string;
  /** Outcome: success, error, timeout, partial (some tools in chain failed), skip (tool not used) */
  outcome: 'success' | 'error' | 'timeout' | 'partial' | 'skip';
  /** Execution duration in ms */
  durationMs: number;
  /** Error message if outcome is error/timeout */
  errorMessage?: string;
  /** Whether this was a retry attempt */
  isRetry: boolean;
  /** How many times this tool was retried in this chain */
  retryCount: number;
  /** Position in multi-tool chain (0-indexed) */
  chainPosition: number;
  /** Total tools in this iteration's chain */
  chainLength: number;
  /** Which loop iteration this occurred in */
  iterationIndex: number;
  /** ISO timestamp */
  timestamp: string;
}

/** Aggregated metrics for a specific agent or tool */
export interface ToolMetrics {
  /** Total tool invocations in the window */
  totalInvocations: number;
  /** Successful invocations */
  successCount: number;
  /** Failed invocations (error + timeout) */
  failureCount: number;
  /** Partial failures (some tools in chain failed) */
  partialCount: number;
  /** Times the agent skipped tools entirely */
  skipCount: number;
  /** Invocation rate: invocations per session */
  invocationRate: number;
  /** Skip rate: skips / (skips + invocations) */
  skipRate: number;
  /** Failure rate: failures / invocations */
  failureRate: number;
  /** Average tool execution duration */
  avgDurationMs: number;
  /** Number of unique sessions in the window */
  sessionCount: number;
  /** Window start (ISO) */
  windowStart: string;
  /** Window end (ISO) */
  windowEnd: string;
}
