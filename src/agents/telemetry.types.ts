/**
 * Tool Telemetry Types — DWS IQ 6/7
 *
 * Types for the ASTA (Agent-Supervised Tool Adaptation) telemetry system.
 * Tracks tool invocations, skip rates, partial failures, and chain outcomes.
 *
 * Code-Version: 1.1
 * Introduced-In: PR-TBD (ASTA Phase 1)
 * Branch: claude/agent-tool-adaptation-7jpgj
 * Date: 2026-04-03
 * Owner: Lifetime Oy
 *
 * v1.1 (2026-05-15, claude/update-control-room-telemetry-s9I4X):
 *   Added optional OpenTelemetry GenAI semantic-convention fields so that
 *   LLM tool invocations can carry `gen_ai.*` attributes alongside the
 *   ASTA tool-use signals. Reference:
 *     https://opentelemetry.io/blog/2026/genai-observability/
 *     https://opentelemetry.io/docs/specs/semconv/gen-ai/
 *   Persisted by migration 066_tool_telemetry_genai.sql.
 */

/**
 * OpenTelemetry GenAI semantic-convention attributes captured for LLM
 * invocations. All fields are optional — non-LLM tool calls omit them.
 * Names mirror the OTel spec one-for-one so the same record can be
 * exported as OTLP without renaming.
 */
export interface GenAIAttributes {
  /** `gen_ai.system` — provider, e.g. `anthropic`, `openai`, `mistral` */
  system?: string;
  /** `gen_ai.operation.name` — e.g. `chat`, `text_completion`, `embeddings` */
  operationName?: string;
  /** `gen_ai.request.model` — model id sent to the provider */
  requestModel?: string;
  /** `gen_ai.response.model` — model id reported in the response */
  responseModel?: string;
  /** `gen_ai.request.max_tokens` */
  requestMaxTokens?: number;
  /** `gen_ai.request.temperature` */
  requestTemperature?: number;
  /** `gen_ai.request.top_p` */
  requestTopP?: number;
  /** `gen_ai.usage.input_tokens` */
  usageInputTokens?: number;
  /** `gen_ai.usage.output_tokens` */
  usageOutputTokens?: number;
  /** `gen_ai.response.finish_reasons` — provider-reported stop reasons */
  responseFinishReasons?: string[];
  /** `gen_ai.response.id` — provider response identifier */
  responseId?: string;
}

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
  /** OTel trace id (32-hex) correlating this event to the parent trace */
  traceId?: string;
  /** OTel span id (16-hex) for the originating span */
  spanId?: string;
  /** OpenTelemetry GenAI attributes (LLM invocations only) */
  genAi?: GenAIAttributes;
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
