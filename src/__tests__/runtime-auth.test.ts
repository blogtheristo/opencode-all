import { beforeEach, describe, expect, it, vi } from 'vitest';

const { logger } = vi.hoisted(() => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('../utils/logger.js', () => ({ default: logger }));

import {
  _resetPoliciesForTests,
  type AuthorizationContext,
  authorizeToolCall,
  consumeApproval,
  registerToolPolicy,
  setEnvelope,
} from '../security/runtime-auth.js';
import type { ToolCall } from '../agents/types.js';

const ctx: AuthorizationContext = {
  agentName: 'test-agent',
  orgId: 'org_test',
  sessionId: 'sess_test',
};

function call(name: string, args: Record<string, unknown> = {}): ToolCall {
  return { id: `id_${name}`, name, arguments: args };
}

beforeEach(() => {
  _resetPoliciesForTests();
  logger.info.mockClear();
  logger.warn.mockClear();
  logger.error.mockClear();
});

describe('runtime-auth: deny-by-default for unknown tools', () => {
  it('routes unregistered tool to IRREVERSIBLE + require_approval', () => {
    const decision = authorizeToolCall(call('mystery_tool'), ctx);
    expect(decision.decision).toBe('require_approval');
    expect(decision.actionClass).toBe('IRREVERSIBLE');
    expect(decision.reason).toContain('unknown_tool');
    expect(decision.approvalId).toBeTruthy();
  });

  it('queues the unknown call in pending approvals', () => {
    const decision = authorizeToolCall(call('mystery_tool'), ctx);
    const pending = consumeApproval(decision.approvalId!);
    expect(pending).toBeDefined();
    expect(pending!.call.name).toBe('mystery_tool');
  });
});

describe('runtime-auth: irreversible actions always need approval', () => {
  it('database_drop requires approval regardless of args', () => {
    const decision = authorizeToolCall(call('database_drop', { table: 'users' }), ctx);
    expect(decision.decision).toBe('require_approval');
    expect(decision.actionClass).toBe('IRREVERSIBLE');
  });

  it('file_delete requires approval', () => {
    const decision = authorizeToolCall(call('file_delete', { path: '/tmp/x' }), ctx);
    expect(decision.decision).toBe('require_approval');
  });

  it('system_command requires approval — covers the Cursor/PocketOS scenario', () => {
    const decision = authorizeToolCall(
      call('system_command', { cmd: 'rm -rf /var/backups' }),
      ctx,
    );
    expect(decision.decision).toBe('require_approval');
    expect(decision.actionClass).toBe('IRREVERSIBLE');
  });

  it('backup_delete requires approval — explicit PocketOS guard', () => {
    const decision = authorizeToolCall(call('backup_delete', { id: 'b1' }), ctx);
    expect(decision.decision).toBe('require_approval');
  });
});

describe('runtime-auth: blast-radius envelopes', () => {
  it('database_write within envelope is allowed', () => {
    const decision = authorizeToolCall(
      call('database_write', { rows: 5 }),
      ctx,
    );
    expect(decision.decision).toBe('allow');
    expect(decision.blastRadius).toBe(5);
  });

  it('database_write above autonomous envelope requires approval', () => {
    const decision = authorizeToolCall(
      call('database_write', { rows: 500 }),
      ctx,
    );
    expect(decision.decision).toBe('require_approval');
    expect(decision.blastRadius).toBe(500);
  });

  it('database_write above hard ceiling is denied outright', () => {
    const decision = authorizeToolCall(
      call('database_write', { rows: 50_000 }),
      ctx,
    );
    expect(decision.decision).toBe('deny');
  });

  it('wildcard SQL is treated as massive blast radius', () => {
    const decision = authorizeToolCall(
      call('database_write', { sql: 'DELETE FROM users' }),
      ctx,
    );
    expect(decision.decision).toBe('deny');
  });

  it('DROP TABLE in args is denied', () => {
    const decision = authorizeToolCall(
      call('database_write', { sql: 'DROP TABLE accounts' }),
      ctx,
    );
    expect(decision.decision).toBe('deny');
  });
});

describe('runtime-auth: email/payment sizing', () => {
  it('email_send with 3 recipients still requires approval — irreversible', () => {
    const decision = authorizeToolCall(
      call('email_send', { recipients: ['a', 'b', 'c'] }),
      ctx,
    );
    expect(decision.decision).toBe('require_approval');
    expect(decision.blastRadius).toBe(3);
  });

  it('email_send to massive list is denied past ceiling', () => {
    const decision = authorizeToolCall(
      call('email_send', { recipients: new Array(10_000).fill('x') }),
      ctx,
    );
    expect(decision.decision).toBe('deny');
  });

  it('payment_initiate scales blast radius by amount', () => {
    const decision = authorizeToolCall(
      call('payment_initiate', { amount_cents: 99 }),
      ctx,
    );
    expect(decision.blastRadius).toBe(99);
    expect(decision.decision).toBe('require_approval');
  });
});

describe('runtime-auth: read paths stay fast', () => {
  it('database_read is allowed without approval', () => {
    const decision = authorizeToolCall(call('database_read', { limit: 100 }), ctx);
    expect(decision.decision).toBe('allow');
    expect(decision.actionClass).toBe('READ');
  });

  it('memory_search is allowed', () => {
    const decision = authorizeToolCall(call('memory_search', { q: 'foo' }), ctx);
    expect(decision.decision).toBe('allow');
  });
});

describe('runtime-auth: custom policy registration + envelope tuning', () => {
  it('honors a custom policy', () => {
    registerToolPolicy('custom_safe', { actionClass: 'READ' });
    const decision = authorizeToolCall(call('custom_safe'), ctx);
    expect(decision.decision).toBe('allow');
  });

  it('honors a tightened envelope', () => {
    setEnvelope('WRITE', { maxAutonomous: 1, maxWithApproval: 5 });
    const decision = authorizeToolCall(
      call('database_write', { rows: 3 }),
      ctx,
    );
    expect(decision.decision).toBe('require_approval');
  });
});

describe('runtime-auth: audit logging', () => {
  it('logs deny as error', () => {
    authorizeToolCall(call('database_write', { rows: 100_000 }), ctx);
    expect(logger.error).toHaveBeenCalled();
  });

  it('logs require_approval as warn', () => {
    authorizeToolCall(call('database_drop', { table: 'x' }), ctx);
    expect(logger.warn).toHaveBeenCalled();
  });

  it('logs allow as info', () => {
    authorizeToolCall(call('database_read', {}), ctx);
    expect(logger.info).toHaveBeenCalled();
  });
});
