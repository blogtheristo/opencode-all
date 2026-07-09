/**
 * Tracing helpers — unit tests
 *
 * These exercise the no-op path (no OTel provider registered) and the
 * active path (in-memory provider). They do NOT spin up the SDK or the
 * OTLP exporter — those are wiring concerns proven by `npm run build`.
 */

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { context, trace } from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';

import {
  currentTraceIds,
  withAgentSpan,
  withLLMSpan,
  withToolSpan,
  withWorkflowSpan,
  withWorkflowStepSpan,
  recordLLMResponse,
} from '../observability/tracing.js';
import { initOtel, isOtelEnabled, shutdownOtel } from '../observability/otel.js';

let memoryExporter: InMemorySpanExporter;
let provider: BasicTracerProvider;

beforeAll(() => {
  const ctxManager = new AsyncHooksContextManager();
  ctxManager.enable();
  context.setGlobalContextManager(ctxManager);

  memoryExporter = new InMemorySpanExporter();
  provider = new BasicTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(memoryExporter)],
  });
  trace.setGlobalTracerProvider(provider);
});

afterEach(() => {
  memoryExporter.reset();
});

describe('tracing helpers', () => {
  it('withAgentSpan records agent name, org, session, depth, confidence', async () => {
    const result = await withAgentSpan(
      'sitesense',
      { orgId: 'org-1', sessionId: 'sess-1', delegationDepth: 0 },
      async (span) => {
        span.setAttribute('dws.agent.confidence', 0.92);
        return 42;
      },
    );

    expect(result).toBe(42);
    const spans = memoryExporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].name).toBe('agent.sitesense');
    expect(spans[0].attributes['dws.agent.name']).toBe('sitesense');
    expect(spans[0].attributes['dws.org_id']).toBe('org-1');
    expect(spans[0].attributes['dws.session_id']).toBe('sess-1');
    expect(spans[0].attributes['dws.agent.delegation_depth']).toBe(0);
    expect(spans[0].attributes['dws.agent.confidence']).toBe(0.92);
  });

  it('withAgentSpan stamps the KYA verdict when a gate cleared the execution', async () => {
    await withAgentSpan(
      'sitesense',
      {
        orgId: 'org-1',
        kya: {
          decision: 'allowed',
          trustScore: 87,
          policyVersion: 'kya-policy@2.3',
          gate: 'nemoclaw-sandbox',
        },
      },
      async () => 'ok',
    );

    const spans = memoryExporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].attributes['dws.kya.verdict']).toBe('allowed');
    expect(spans[0].attributes['dws.kya.trust_score']).toBe(87);
    expect(spans[0].attributes['dws.kya.policy_version']).toBe('kya-policy@2.3');
    expect(spans[0].attributes['dws.kya.gate']).toBe('nemoclaw-sandbox');
  });

  it('withAgentSpan and withLLMSpan stamp "ungated" when no verdict is passed — absence must be queryable, not blank', async () => {
    await withAgentSpan('sitesense', {}, async () => 'ok');
    await withLLMSpan(
      { system: 'anthropic', operationName: 'chat', requestModel: 'claude-x' },
      async () => 'ok',
    );

    const spans = memoryExporter.getFinishedSpans();
    expect(spans).toHaveLength(2);
    for (const span of spans) {
      expect(span.attributes['dws.kya.verdict']).toBe('ungated');
      expect(span.attributes['dws.kya.trust_score']).toBeUndefined();
    }
  });

  it('withWorkflowSpan parents withWorkflowStepSpan', async () => {
    await withWorkflowSpan(
      'compliance-assessment',
      { executionId: 'wf-test', stepCount: 2 },
      async () => {
        await withWorkflowStepSpan('analyze-emissions', 'agent', async () => undefined);
        await withWorkflowStepSpan('check-compliance', 'agent', async () => undefined);
      },
    );

    const spans = memoryExporter.getFinishedSpans();
    expect(spans).toHaveLength(3);
    const wf = spans.find((s) => s.name === 'workflow.compliance-assessment');
    const step1 = spans.find((s) => s.name === 'workflow.step.analyze-emissions');
    const step2 = spans.find((s) => s.name === 'workflow.step.check-compliance');
    expect(wf).toBeDefined();
    expect(step1).toBeDefined();
    expect(step2).toBeDefined();
    // @opentelemetry/sdk-trace v2: ReadableSpan.parentSpanId was replaced by
    // parentSpanContext?.spanId (see @opentelemetry/sdk-trace's ReadableSpan.d.ts).
    expect(step1!.parentSpanContext?.spanId).toBe(wf!.spanContext().spanId);
    expect(step2!.parentSpanContext?.spanId).toBe(wf!.spanContext().spanId);
    expect(wf!.attributes['dws.workflow.step_count']).toBe(2);
  });

  it('withLLMSpan + recordLLMResponse emit GenAI semconv attrs', async () => {
    await withLLMSpan(
      {
        system: 'anthropic',
        operationName: 'chat',
        requestModel: 'claude-sonnet-4-20250514',
        requestMaxTokens: 4096,
        requestTemperature: 0.3,
      },
      async (span) => {
        recordLLMResponse(span, {
          responseModel: 'claude-sonnet-4-20250514',
          inputTokens: 2341,
          outputTokens: 892,
          finishReason: 'end_turn',
        });
      },
    );

    const spans = memoryExporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    const s = spans[0];
    expect(s.name).toBe('llm.chat');
    expect(s.attributes['gen_ai.system']).toBe('anthropic');
    expect(s.attributes['gen_ai.request.model']).toBe('claude-sonnet-4-20250514');
    expect(s.attributes['gen_ai.request.max_tokens']).toBe(4096);
    expect(s.attributes['gen_ai.usage.input_tokens']).toBe(2341);
    expect(s.attributes['gen_ai.usage.output_tokens']).toBe(892);
    expect(s.attributes['gen_ai.response.finish_reasons']).toEqual(['end_turn']);
  });

  it('withToolSpan records error status when handler throws', async () => {
    const err = new Error('boom');
    await expect(
      withToolSpan('query_database', { agentName: 'compliance' }, async () => {
        throw err;
      }),
    ).rejects.toThrow('boom');

    const spans = memoryExporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].status.code).toBe(2); // ERROR
    expect(spans[0].events.some((e) => e.name === 'exception')).toBe(true);
  });

  it('currentTraceIds returns ids while inside a span, empty outside', async () => {
    expect(currentTraceIds()).toEqual({});

    await withAgentSpan('themis', { orgId: 'org-x', sessionId: 'sess-x' }, async () => {
      const ids = currentTraceIds();
      expect(ids.traceId).toMatch(/^[0-9a-f]{32}$/);
      expect(ids.spanId).toMatch(/^[0-9a-f]{16}$/);
    });

    expect(currentTraceIds()).toEqual({});
  });

  it('initOtel is a no-op when OTEL_EXPORTER_OTLP_ENDPOINT is unset', async () => {
    const prev = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    delete process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    await shutdownOtel();
    expect(initOtel()).toBe(false);
    expect(isOtelEnabled()).toBe(false);
    if (prev) {
      process.env.OTEL_EXPORTER_OTLP_ENDPOINT = prev;
    }
  });
});
