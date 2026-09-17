/**
 * Agent execution span KYA verdict threading — unit tests
 *
 * executeAgent() wraps every agent run in withAgentSpan(). Before this test,
 * the span always defaulted to "ungated" because no verdict was ever passed
 * in, even when a runtime gate had already cleared the call. This proves
 * AgentRegistry.executeAgent forwards `context.agentRuntime.kya` — a
 * runtime-injected verdict, never LLM/user-supplied — onto the span.
 */

import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { context, trace } from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';

import { AgentRegistry } from '../agents/index.js';
import { BaseAgent } from '../agents/base.agent.js';
import type { AgentContext, AgentResponse } from '../agents/types.js';

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

/** Stub agent that echoes input without touching context.agentRuntime */
class StubAgent extends BaseAgent {
  constructor() {
    super({
      name: 'kya-span-stub',
      description: 'Stub agent for KYA span propagation tests',
      capabilities: ['test'],
      model: 'placeholder',
    });
  }

  async execute(
    _context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    return {
      agentName: this.config.name,
      result: { echo: input },
      confidence: 0.9,
      reasoning: 'stub',
      recommendations: [],
      metadata: {},
    };
  }
}

describe('AgentRegistry.executeAgent KYA verdict threading', () => {
  it('stamps the real verdict on the span when context.agentRuntime.kya is set', async () => {
    const registry = new AgentRegistry();
    registry.register(new StubAgent());

    const testContext: AgentContext = {
      projectId: 'proj-1',
      userId: 'user-1',
      orgId: 'org-1',
      sessionId: 'sess-1',
      agentRuntime: {
        name: 'kya-span-stub',
        autonomyPhase: 'advisor',
        kya: { decision: 'allowed', trustScore: 87, gate: 'kya-sandbox-bridge' },
      },
    };

    await registry.executeAgent('kya-span-stub', testContext, {});

    const spans = memoryExporter.getFinishedSpans();
    const agentSpan = spans.find((s) => s.name === 'agent.kya-span-stub');
    expect(agentSpan).toBeDefined();
    expect(agentSpan!.attributes['dws.kya.verdict']).toBe('allowed');
    expect(agentSpan!.attributes['dws.kya.trust_score']).toBe(87);
    expect(agentSpan!.attributes['dws.kya.gate']).toBe('kya-sandbox-bridge');
  });

  it('defaults to "ungated" when no runtime verdict is present', async () => {
    const registry = new AgentRegistry();
    registry.register(new StubAgent());

    const testContext: AgentContext = {
      projectId: 'proj-1',
      userId: 'user-1',
      orgId: 'org-1',
      sessionId: 'sess-2',
    };

    await registry.executeAgent('kya-span-stub', testContext, {});

    const spans = memoryExporter.getFinishedSpans();
    const agentSpan = spans.find((s) => s.name === 'agent.kya-span-stub');
    expect(agentSpan).toBeDefined();
    expect(agentSpan!.attributes['dws.kya.verdict']).toBe('ungated');
  });
});
