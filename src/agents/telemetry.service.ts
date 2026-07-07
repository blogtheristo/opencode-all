/**
 * Tool Telemetry Service — DWS IQ 6/7 (ASTA Phase 1)
 *
 * Collects and persists tool invocation telemetry. Enables:
 * - Tool-use rate tracking (are agents using tools or guessing?)
 * - Partial failure detection (which tools break mid-chain?)
 * - Skip detection (agent answered without tool use)
 * - Aggregated metrics for adaptation priority framework
 *
 * Buffered writes: events accumulate in memory and flush to the internal-ops
 * Postgres pool every 50 events or 30 seconds (whichever first). Non-blocking.
 *
 * Code-Version: 1.1
 * Introduced-In: PR-TBD (ASTA Phase 1)
 * Branch: claude/agent-tool-adaptation-7jpgj
 * Date: 2026-04-03
 * Owner: Lifetime Oy
 *
 * v1.1 (2026-05-15, claude/update-control-room-telemetry-s9I4X):
 *   Flush now includes OpenTelemetry GenAI semantic-convention columns
 *   (`gen_ai_*`, `trace_id`, `span_id`) when the event carries them.
 *   Non-LLM tool events are unaffected — fields default to NULL.
 *   See migration 066_tool_telemetry_genai.sql.
 *
 * v1.2 (2026-07-07): tool_telemetry moved off Supabase to the self-hosted
 *   internal-ops Postgres pool (src/config/internal-db.ts).
 */

import { getInternalDbPool } from '../config/internal-db.js';
import logger from '../utils/logger.js';
import type { ToolMetrics, ToolTelemetryEvent } from './telemetry.types.js';

const FLUSH_THRESHOLD = 50;
const FLUSH_INTERVAL_MS = 30_000;

class ToolTelemetryService {
  private buffer: ToolTelemetryEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.flushTimer = setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush().catch((err) => {
          logger.warn('Telemetry auto-flush failed', { error: String(err) });
        });
      }
    }, FLUSH_INTERVAL_MS);
  }

  /** Record a tool invocation event. Non-blocking — buffers in memory. */
  recordInvocation(event: ToolTelemetryEvent): void {
    this.buffer.push(event);
    if (this.buffer.length >= FLUSH_THRESHOLD) {
      this.flush().catch((err) => {
        logger.warn('Telemetry threshold-flush failed', { error: String(err) });
      });
    }
  }

  /** Flush buffered events to the internal-ops Postgres pool. */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const batch = this.buffer.splice(0);

    try {
      const pool = getInternalDbPool();
      if (!pool) {
        logger.debug('Telemetry flush skipped — internal DB not configured');
        return;
      }

      const columns = [
        'agent_name',
        'tool_name',
        'org_id',
        'session_id',
        'outcome',
        'duration_ms',
        'error_message',
        'is_retry',
        'retry_count',
        'chain_position',
        'chain_length',
        'iteration_index',
        'created_at',
        'trace_id',
        'span_id',
        'gen_ai_system',
        'gen_ai_operation_name',
        'gen_ai_request_model',
        'gen_ai_response_model',
        'gen_ai_request_max_tokens',
        'gen_ai_request_temperature',
        'gen_ai_request_top_p',
        'gen_ai_usage_input_tokens',
        'gen_ai_usage_output_tokens',
        'gen_ai_response_finish_reasons',
        'gen_ai_response_id',
      ];

      const rows = batch.map((e) => {
        const g = e.genAi;
        return [
          e.agentName,
          e.toolName,
          e.orgId,
          e.sessionId,
          e.outcome,
          e.durationMs,
          e.errorMessage || null,
          e.isRetry,
          e.retryCount,
          e.chainPosition,
          e.chainLength,
          e.iterationIndex,
          e.timestamp,
          e.traceId ?? null,
          e.spanId ?? null,
          g?.system ?? null,
          g?.operationName ?? null,
          g?.requestModel ?? null,
          g?.responseModel ?? null,
          g?.requestMaxTokens ?? null,
          g?.requestTemperature ?? null,
          g?.requestTopP ?? null,
          g?.usageInputTokens ?? null,
          g?.usageOutputTokens ?? null,
          g?.responseFinishReasons ?? null,
          g?.responseId ?? null,
        ];
      });

      const valuesSql = rows
        .map((row, i) => `(${row.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`)
        .join(', ');
      const params = rows.flat();

      try {
        await pool.query(
          `INSERT INTO tool_telemetry (${columns.join(', ')}) VALUES ${valuesSql}`,
          params,
        );
        logger.debug('Telemetry flushed', { count: batch.length });
      } catch (insertErr) {
        logger.warn('Telemetry flush insert failed', {
          error: insertErr instanceof Error ? insertErr.message : String(insertErr),
          batchSize: batch.length,
        });
      }
    } catch (err) {
      logger.warn('Telemetry flush exception', { error: String(err), batchSize: batch.length });
    }
  }

  /** Get aggregated metrics for an agent over a time window. */
  async getMetrics(agentName: string, windowHours: number = 24): Promise<ToolMetrics> {
    const windowStart = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();
    const windowEnd = new Date().toISOString();

    try {
      const pool = getInternalDbPool();
      if (!pool) {
        return this.emptyMetrics(windowStart, windowEnd);
      }

      let rows: Array<{ outcome: string; duration_ms: number; session_id: string }>;
      try {
        const result = await pool.query(
          `SELECT outcome, duration_ms, session_id FROM tool_telemetry
           WHERE agent_name = $1 AND created_at >= $2`,
          [agentName, windowStart],
        );
        rows = result.rows;
      } catch (queryErr) {
        logger.warn('Telemetry getMetrics query failed', {
          error: queryErr instanceof Error ? queryErr.message : String(queryErr),
        });
        return this.emptyMetrics(windowStart, windowEnd);
      }
      const sessions = new Set(rows.map((r) => r.session_id));
      const successCount = rows.filter((r) => r.outcome === 'success').length;
      const failureCount = rows.filter(
        (r) => r.outcome === 'error' || r.outcome === 'timeout',
      ).length;
      const partialCount = rows.filter((r) => r.outcome === 'partial').length;
      const skipCount = rows.filter((r) => r.outcome === 'skip').length;
      const totalInvocations = rows.length - skipCount;
      const totalDuration = rows.reduce((sum, r) => sum + r.duration_ms, 0);

      return {
        totalInvocations,
        successCount,
        failureCount,
        partialCount,
        skipCount,
        invocationRate: sessions.size > 0 ? totalInvocations / sessions.size : 0,
        skipRate: totalInvocations + skipCount > 0 ? skipCount / (totalInvocations + skipCount) : 0,
        failureRate: totalInvocations > 0 ? failureCount / totalInvocations : 0,
        avgDurationMs: totalInvocations > 0 ? totalDuration / totalInvocations : 0,
        sessionCount: sessions.size,
        windowStart,
        windowEnd,
      };
    } catch (err) {
      logger.warn('Telemetry getMetrics exception', { error: String(err) });
      return this.emptyMetrics(windowStart, windowEnd);
    }
  }

  /** Shutdown: flush remaining events and clear timer */
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }

  /** Get buffer size (for testing/monitoring) */
  getBufferSize(): number {
    return this.buffer.length;
  }

  private emptyMetrics(windowStart: string, windowEnd: string): ToolMetrics {
    return {
      totalInvocations: 0,
      successCount: 0,
      failureCount: 0,
      partialCount: 0,
      skipCount: 0,
      invocationRate: 0,
      skipRate: 0,
      failureRate: 0,
      avgDurationMs: 0,
      sessionCount: 0,
      windowStart,
      windowEnd,
    };
  }
}

/** Singleton telemetry service instance */
export const telemetryService = new ToolTelemetryService();
