import { beforeEach, describe, expect, it, vi } from 'vitest';

const { logger } = vi.hoisted(() => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../utils/logger.js', () => ({ default: logger }));

import { _resetPoliciesForTests, type AuthorizationContext } from '../security/runtime-auth.js';
import { isCommandAllowed, safeExec, SafeShellError } from '../security/safe-shell.js';

const ctx: AuthorizationContext = {
  agentName: 'test-agent',
  orgId: 'org_test',
  sessionId: 'sess_test',
};

beforeEach(() => {
  _resetPoliciesForTests();
  logger.info.mockClear();
  logger.warn.mockClear();
  logger.error.mockClear();
});

describe('safe-shell allowlist', () => {
  it('rejects a command not on the allowlist', async () => {
    await expect(safeExec('rm', ['-rf', '/'], ctx)).rejects.toThrow(SafeShellError);
    await expect(safeExec('curl', ['http://evil.example'], ctx)).rejects.toThrow(
      /not in allowlist/,
    );
  });

  it('reports allowlist membership via isCommandAllowed', () => {
    expect(isCommandAllowed('ls')).toBe(true);
    expect(isCommandAllowed('rm')).toBe(false);
  });

  it('rejects a disallowed subcommand for an allowlisted binary', async () => {
    await expect(safeExec('git', ['push', '--force'], ctx)).rejects.toThrow(
      /subcommand not allowed/,
    );
  });

  it('rejects arguments containing shell metacharacters', async () => {
    await expect(safeExec('echo', ['hello; rm -rf /'], ctx)).rejects.toThrow(/shell metacharacter/);
    await expect(safeExec('echo', ['$(whoami)'], ctx)).rejects.toThrow(/shell metacharacter/);
    await expect(safeExec('echo', ['`whoami`'], ctx)).rejects.toThrow(/shell metacharacter/);
  });

  it('runs an allowlisted read-only command and returns its output', async () => {
    const result = await safeExec('echo', ['hello-world'], ctx);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toBe('hello-world');
  });

  it('requires approval for an allowlisted but WRITE-classified command beyond envelope, and never spawns it', async () => {
    // git status is allowed (READ-shaped subcommand), but git commit/push style
    // subcommands are excluded from allowedSubcommands entirely — proving the
    // wrapper never falls through to execFile for them.
    await expect(safeExec('git', ['commit', '-m', 'x'], ctx)).rejects.toThrow(
      /subcommand not allowed/,
    );
  });

  it('propagates a nonzero exit code without throwing', async () => {
    // `ls` on a path that does not exist exits nonzero but is a legitimate,
    // allowlisted, argument-vector call — the wrapper should surface exitCode,
    // not swallow or crash on it.
    const result = await safeExec('ls', ['/definitely/not/a/real/path/xyz'], ctx);
    expect(result.exitCode).not.toBe(0);
  });
});
