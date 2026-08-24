/**
 * tools.ts — registerToolHandler unit tests
 *
 * Verifies the first-registered-wins semantics and that duplicate registrations
 * emit a warn-level log rather than silently overwriting the original handler.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// vi.mock is hoisted — factory must not reference top-level variables.
vi.mock('../../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// Minimal stubs for transitive deps pulled in by tools.ts
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({ select: vi.fn(() => ({ data: [], error: null })) })),
  })),
}));

process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-key';

import logger from '../../utils/logger.js';
import { executeTool, registerToolHandler } from '../../agents/tools.js';
import { registerToolPolicy } from '../../security/runtime-auth.js';
import type { AgentContext } from '../../agents/types.js';

const testContext: AgentContext = {
  projectId: 'test-project',
  userId: 'test-user',
  orgId: 'test-org',
  sessionId: 'test-session',
};

describe('registerToolHandler — first-registered-wins semantics', () => {
  beforeEach(() => {
    vi.mocked(logger.warn).mockClear();
    vi.mocked(logger.debug).mockClear();
  });

  it('executes the first handler when the same tool name is registered twice', async () => {
    const toolName = '__test_dup_handler_' + Date.now();
    const firstResult = { source: 'first' };
    const secondResult = { source: 'second' };

    // Register a READ policy so the KYA gate allows execution without HIL approval.
    registerToolPolicy(toolName, { actionClass: 'READ' });
    registerToolHandler(toolName, async () => firstResult);
    registerToolHandler(toolName, async () => secondResult);

    const result = await executeTool({ id: 'test-call-1', name: toolName, arguments: {} }, testContext);
    // First registration must win.
    expect(result.result).toEqual(firstResult);
  });

  it('emits a warn log when a duplicate handler name is registered', () => {
    const toolName = '__test_warn_handler_' + Date.now();

    registerToolHandler(toolName, async () => ({ ok: true }));
    registerToolHandler(toolName, async () => ({ ok: false }));

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('already registered'),
      expect.objectContaining({ tool: toolName }),
    );
  });

  it('does NOT warn when a tool is registered for the first time', () => {
    const uniqueName = '__test_fresh_handler_' + Date.now();
    vi.mocked(logger.warn).mockClear();

    registerToolHandler(uniqueName, async () => ({}));

    expect(logger.warn).not.toHaveBeenCalled();
  });
});
