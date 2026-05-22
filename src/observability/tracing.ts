/**
 * Tracing helpers — DWS IQ 6/7
 *
 * Thin wrappers around the OTel API that emit spans at the points that
 * matter for postmortems:
 *   - withAgentSpan       — one root span per agent execution
 *   - withWorkflowSpan    — parent span for a workflow run
 *   - withWorkflowStepSpan— child span per workflow step
 *   - withLLMSpan         — per LLM call, with GenAI semantic-convention attrs
 *   - withToolSpan        — per tool invocation
 *   - currentTraceIds()   — pull trace/span ids to stamp on telemetry events
 *
 * If no OTel provider is registered (env var not set), `trace.getTracer`
 * returns a NoopTracer and every helper here becomes a thin pass-through.
 * Agent code does not need to check whether tracing is enabled.
 */

import { SpanKind, SpanStatusCode, trace, type Span } from '@opentelemetry/api';

const TRACER_NAME = 'dws-iq-7';

function tracer() {
  return trace.getTracer(TRACER_NAME);
}

function recordError(span: Span, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  span.recordException(err instanceof Error ? err : new Error(message));
  span.setStatus({ code: SpanStatusCode.ERROR, message });
}

/** Wrap an agent execution. Records depth, org, session, confidence. */
export async function withAgentSpan<T>(
  agentName: string,
  attrs: { orgId?: string; sessionId?: string; delegationDepth?: number },
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  return tracer().startActiveSpan(
    `agent.${agentName}`,
    { kind: SpanKind.INTERNAL },
    async (span) => {
      span.setAttribute('dws.agent.name', agentName);
      if (attrs.orgId) span.setAttribute('dws.org_id', attrs.orgId);
      if (attrs.sessionId) span.setAttribute('dws.session_id', attrs.sessionId);
      if (attrs.delegationDepth !== undefined) {
        span.setAttribute('dws.agent.delegation_depth', attrs.delegationDepth);
      }
      try {
        return await fn(span);
      } catch (err) {
        recordError(span, err);
        throw err;
      } finally {
        span.end();
      }
    },
  );
}

/** Wrap a workflow execution. Steps run as child spans within this context. */
export async function withWorkflowSpan<T>(
  workflowName: string,
  attrs: { executionId: string; orgId?: string; sessionId?: string; stepCount?: number },
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  return tracer().startActiveSpan(
    `workflow.${workflowName}`,
    { kind: SpanKind.INTERNAL },
    async (span) => {
      span.setAttribute('dws.workflow.name', workflowName);
      span.setAttribute('dws.workflow.execution_id', attrs.executionId);
      if (attrs.orgId) span.setAttribute('dws.org_id', attrs.orgId);
      if (attrs.sessionId) span.setAttribute('dws.session_id', attrs.sessionId);
      if (attrs.stepCount !== undefined) {
        span.setAttribute('dws.workflow.step_count', attrs.stepCount);
      }
      try {
        return await fn(span);
      } catch (err) {
        recordError(span, err);
        throw err;
      } finally {
        span.end();
      }
    },
  );
}

/** Wrap a single workflow step (agent / parallel / emit-event). */
export async function withWorkflowStepSpan<T>(
  stepId: string,
  stepType: string,
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  return tracer().startActiveSpan(
    `workflow.step.${stepId}`,
    { kind: SpanKind.INTERNAL },
    async (span) => {
      span.setAttribute('dws.workflow.step_id', stepId);
      span.setAttribute('dws.workflow.step_type', stepType);
      try {
        return await fn(span);
      } catch (err) {
        recordError(span, err);
        throw err;
      } finally {
        span.end();
      }
    },
  );
}

/**
 * Wrap an LLM call. Sets request-side GenAI semantic-convention attrs
 * up front; caller passes response attrs via the span when the call returns.
 */
export async function withLLMSpan<T>(
  request: {
    system: string;
    operationName: string;
    requestModel: string;
    requestMaxTokens?: number;
    requestTemperature?: number;
  },
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  return tracer().startActiveSpan(
    `llm.${request.operationName}`,
    { kind: SpanKind.CLIENT },
    async (span) => {
      span.setAttribute('gen_ai.system', request.system);
      span.setAttribute('gen_ai.operation.name', request.operationName);
      span.setAttribute('gen_ai.request.model', request.requestModel);
      if (request.requestMaxTokens !== undefined) {
        span.setAttribute('gen_ai.request.max_tokens', request.requestMaxTokens);
      }
      if (request.requestTemperature !== undefined) {
        span.setAttribute('gen_ai.request.temperature', request.requestTemperature);
      }
      try {
        return await fn(span);
      } catch (err) {
        recordError(span, err);
        throw err;
      } finally {
        span.end();
      }
    },
  );
}

/** Set GenAI response-side attrs after the provider returns. */
export function recordLLMResponse(
  span: Span,
  response: {
    responseModel?: string;
    inputTokens?: number;
    outputTokens?: number;
    finishReason?: string;
    responseId?: string;
  },
): void {
  if (response.responseModel) {
    span.setAttribute('gen_ai.response.model', response.responseModel);
  }
  if (response.inputTokens !== undefined) {
    span.setAttribute('gen_ai.usage.input_tokens', response.inputTokens);
  }
  if (response.outputTokens !== undefined) {
    span.setAttribute('gen_ai.usage.output_tokens', response.outputTokens);
  }
  if (response.finishReason) {
    span.setAttribute('gen_ai.response.finish_reasons', [response.finishReason]);
  }
  if (response.responseId) {
    span.setAttribute('gen_ai.response.id', response.responseId);
  }
}

/** Wrap a tool invocation. Outcome is set by caller on success/error. */
export async function withToolSpan<T>(
  toolName: string,
  attrs: { agentName?: string; chainPosition?: number; chainLength?: number },
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  return tracer().startActiveSpan(
    `tool.${toolName}`,
    { kind: SpanKind.INTERNAL },
    async (span) => {
      span.setAttribute('dws.tool.name', toolName);
      if (attrs.agentName) span.setAttribute('dws.agent.name', attrs.agentName);
      if (attrs.chainPosition !== undefined) {
        span.setAttribute('dws.tool.chain_position', attrs.chainPosition);
      }
      if (attrs.chainLength !== undefined) {
        span.setAttribute('dws.tool.chain_length', attrs.chainLength);
      }
      try {
        return await fn(span);
      } catch (err) {
        recordError(span, err);
        throw err;
      } finally {
        span.end();
      }
    },
  );
}

/**
 * Returns the current trace/span ids if any. Used to stamp telemetry rows
 * so the Supabase `tool_telemetry` table cross-references OTel backend
 * traces by `trace_id` / `span_id`.
 */
export function currentTraceIds(): { traceId?: string; spanId?: string } {
  const span = trace.getActiveSpan();
  if (!span) return {};
  const ctx = span.spanContext();
  if (!ctx.traceId || ctx.traceId === '00000000000000000000000000000000') return {};
  return { traceId: ctx.traceId, spanId: ctx.spanId };
}
