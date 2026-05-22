/**
 * Tool Telemetry Service — DWS IQ 6/7 (ASTA Phase 1)
 *
 * Collects and persists tool invocation telemetry. Enables:
 * - Tool-use rate tracking (are agents using tools or guessing?)
 * - Partial failure detection (which tools break mid-chain?)
 * - Skip detection (agent answered without tool use)
 * - Aggregated metrics for adaptation priority framework
 *
 * Buffered writes: events accumulate in memory and flush to Supabase
 * every 50 events or 30 seconds (whichever first). Non-blocking.
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
 */

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

  /** Flush buffered events to Supabase. */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const batch = this.buffer.splice(0);

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_KEY;
      if (!url || !key) {
        logger.debug('Telemetry flush skipped — Supabase not configured');
        return;
      }

      const client = createClient(url, key);
      const rows = batch.map((e) => {
        const g = e.genAi;
        return {
          agent_name: e.agentName,
          tool_name: e.toolName,
          org_id: e.orgId,
          session_id: e.sessionId,
          outcome: e.outcome,
          duration_ms: e.durationMs,
          error_message: e.errorMessage || null,
          is_retry: e.isRetry,
          retry_count: e.retryCount,
          chain_position: e.chainPosition,
          chain_length: e.chainLength,
          iteration_index: e.iterationIndex,
          created_at: e.timestamp,
          trace_id: e.traceId ?? null,
          span_id: e.spanId ?? null,
          gen_ai_system: g?.system ?? null,
          gen_ai_operation_name: g?.operationName ?? null,
          gen_ai_request_model: g?.requestModel ?? null,
          gen_ai_response_model: g?.responseModel ?? null,
          gen_ai_request_max_tokens: g?.requestMaxTokens ?? null,
          gen_ai_request_temperature: g?.requestTemperature ?? null,
          gen_ai_request_top_p: g?.requestTopP ?? null,
          gen_ai_usage_input_tokens: g?.usageInputTokens ?? null,
          gen_ai_usage_output_tokens: g?.usageOutputTokens ?? null,
          gen_ai_response_finish_reasons: g?.responseFinishReasons ?? null,
          gen_ai_response_id: g?.responseId ?? null,
        };
      });

      const { error } = await client.from('tool_telemetry').insert(rows);
      if (error) {
        logger.warn('Telemetry flush insert failed', { error: error.message, batchSize: batch.length });
      } else {
        logger.debug('Telemetry flushed', { count: batch.length });
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
      const { createClient } = await import('@supabase/supabase-js');
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_KEY;
      if (!url || !key) {
        return this.emptyMetrics(windowStart, windowEnd);
      }

      const client = createClient(url, key);
      const { data, error } = await client
        .from('tool_telemetry')
        .select('outcome, duration_ms, session_id')
        .eq('agent_name', agentName)
        .gte('created_at', windowStart);

      if (error || !data) {
        logger.warn('Telemetry getMetrics query failed', { error: error?.message });
        return this.emptyMetrics(windowStart, windowEnd);
      }

      const rows = data as Array<{ outcome: string; duration_ms: number; session_id: string }>;
      const sessions = new Set(rows.map((r) => r.session_id));
      const successCount = rows.filter((r) => r.outcome === 'success').length;
      const failureCount = rows.filter((r) => r.outcome === 'error' || r.outcome === 'timeout').length;
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
