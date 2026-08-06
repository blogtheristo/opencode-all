/**
 * Tool-call KYA verdict threading — unit tests
 *
 * executeTool() is the one call site where a *real* ex-ante gate decision
 * exists (authorizeToolCall(), src/security/runtime-auth.ts) before
 * anything fires. Before this test, withToolSpan was never invoked in
 * production code, so every tool call was a blind spot in the trace — this
 * proves the gate's actual decision now reaches the span instead of the
 * "ungated" default.
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { context, trace } from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';

import { executeTool, registerToolHandler } from '../agents/tools.js';
import type { AgentContext, ToolCall } from '../agents/types.js';

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

const testContext: AgentContext = {
  projectId: 'proj-1',
  userId: 'user-1',
  orgId: 'org-1',
  sessionId: 'sess-1',
};

describe('executeTool KYA verdict threading', () => {
  it('stamps "allowed" on the tool span when runtime-auth clears the call', async () => {
    registerToolHandler('database_read', async () => ({ rows: [] }));
    const call: ToolCall = { id: 'call-1', name: 'database_read', arguments: {} };

    const result = await executeTool(call, testContext, {
      chainPosition: 0,
      chainLength: 1,
      iterationIndex: 0,
      agentName: 'compliance',
    });

    expect(result.isError).toBe(false);
    const spans = memoryExporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].name).toBe('tool.database_read');
    expect(spans[0].attributes['dws.kya.verdict']).toBe('allowed');
    expect(spans[0].attributes['dws.kya.gate']).toBe('runtime-auth');
    expect(spans[0].attributes['dws.tool.outcome']).toBe('success');
  });

  it('stamps "denied" on the tool span when runtime-auth blocks an irreversible call', async () => {
    registerToolHandler('database_delete', async () => ({ deleted: 5 }));
    const call: ToolCall = { id: 'call-2', name: 'database_delete', arguments: { rows: 5 } };

    const result = await executeTool(call, testContext, {
      chainPosition: 0,
      chainLength: 1,
      iterationIndex: 0,
      agentName: 'compliance',
    });

    expect(result.isError).toBe(true);
    const spans = memoryExporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].attributes['dws.kya.verdict']).toBe('denied');
    expect(spans[0].attributes['dws.kya.gate']).toBe('runtime-auth');
    expect(spans[0].attributes['dws.tool.outcome']).toBe('blocked');
  });

  it('no span at all for a tool with no registered handler — never reached the gate', async () => {
    const call: ToolCall = { id: 'call-3', name: 'totally_unregistered_tool', arguments: {} };

    const result = await executeTool(call, testContext, {
      chainPosition: 0,
      chainLength: 1,
      iterationIndex: 0,
      agentName: 'compliance',
    });

    expect(result.isError).toBe(true);
    expect(memoryExporter.getFinishedSpans()).toHaveLength(0);
  });
});
