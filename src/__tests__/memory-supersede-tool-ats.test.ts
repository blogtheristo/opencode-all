/**
 * memory_supersede tool handler — runtime ATS threading
 *
 * The tool handler previously dropped the caller's KYA-issued trust score
 * on the floor: `agentAts` was never passed to `memoryService.supersede()`.
 * This proves `context.agentRuntime.kya.trustScore` (runtime-injected, never
 * LLM/user-supplied) now reaches `MemoryService.supersede` as `agentAts`.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

const supersedeMock = vi.fn().mockResolvedValue({
  newMemoryId: 'new-mem-1',
  requiresReview: false,
  confidenceDelta: 0.1,
  kyaDecision: 'auto_approved',
});

vi.mock('../agents/memory.service.js', () => ({
  memoryService: { supersede: supersedeMock },
}));

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { executeTool, registerBuiltinTools } from '../agents/tools.js';
import { registerToolPolicy } from '../security/runtime-auth.js';
import type { AgentContext, ToolCall } from '../agents/types.js';

describe('memory_supersede tool handler', () => {
  beforeEach(() => {
    supersedeMock.mockClear();
    registerBuiltinTools();
    // memory_supersede is a reversible, KYA-gated write (confidence_delta
    // review threshold enforced in MemoryService) — allow it through the
    // runtime-auth gate so this test exercises the handler, not the gate.
    registerToolPolicy('memory_supersede', { actionClass: 'WRITE' });
  });

  it('forwards context.agentRuntime.kya.trustScore as agentAts', async () => {
    const testContext: AgentContext = {
      projectId: 'proj-1',
      userId: 'compliance-agent',
      orgId: 'org-1',
      sessionId: 'sess-1',
      agentRuntime: {
        name: 'compliance',
        autonomyPhase: 'advisor',
        kya: { decision: 'allowed', trustScore: 92, gate: 'kya-sandbox-bridge' },
      },
    };

    const call: ToolCall = {
      id: 'call-1',
      name: 'memory_supersede',
      arguments: {
        old_memory_id: 'old-mem-1',
        new_content: 'ACME now has 400 employees',
        new_confidence: 0.95,
        new_source: 'annual-report-2026',
        reason: 'temporal_supersede: newer source',
      },
    };

    const result = await executeTool(call, testContext);

    expect(result.isError).toBe(false);
    expect(supersedeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        oldMemoryId: 'old-mem-1',
        orgId: 'org-1',
        agentId: 'compliance-agent',
        agentAts: 92,
      }),
    );
  });

  it('passes agentAts=undefined when no runtime verdict is present', async () => {
    const testContext: AgentContext = {
      projectId: 'proj-1',
      userId: 'compliance-agent',
      orgId: 'org-1',
      sessionId: 'sess-2',
    };

    const call: ToolCall = {
      id: 'call-2',
      name: 'memory_supersede',
      arguments: {
        old_memory_id: 'old-mem-2',
        new_content: 'ACME now has 400 employees',
      },
    };

    await executeTool(call, testContext);

    expect(supersedeMock).toHaveBeenCalledWith(
      expect.objectContaining({ agentAts: undefined }),
    );
  });
});
