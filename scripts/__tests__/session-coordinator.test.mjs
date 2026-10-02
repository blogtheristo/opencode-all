// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- scripts/__tests__/session-coordinator.test.mjs
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const coordinator = resolve('scripts/session-coordinator.mjs');
let workspace;

beforeEach(() => {
  workspace = mkdtempSync(join(tmpdir(), 'dws-session-coordinator-'));
  mkdirSync(join(workspace, '.workflows/sessions/recovered'), { recursive: true });
  writeFileSync(
    join(workspace, '.workflows/sessions/recovered', 'copilot_test.json'),
    JSON.stringify({ branch: 'feature/test', repository: 'dws6' }),
  );
});

afterEach(() => rmSync(workspace, { recursive: true, force: true }));

function run(...args) {
  return spawnSync(process.execPath, [coordinator, ...args], { cwd: workspace, encoding: 'utf8' });
}

describe('session coordinator claims', () => {
  it('releases ownership so another platform can claim the same session', () => {
    expect(run('claim', 'copilot_test', 'opencode').status).toBe(0);
    expect(run('claim', 'copilot_test', 'claude-code').status).toBe(1);
    expect(run('release', 'copilot_test', 'PAUSED').status).toBe(0);
    expect(run('status', 'copilot_test').stdout).toContain('UNCLAIMED');
    expect(run('claim', 'copilot_test', 'claude-code').status).toBe(0);
    const state = JSON.parse(
      readFileSync(join(workspace, '.workflows/sessions/coordinator-state.json'), 'utf8'),
    );
    expect(state.active_claims.copilot_test.platform).toBe('claude-code');
    expect(state.session_history.map((entry) => entry.action)).toEqual([
      'CLAIMED',
      'RELEASED',
      'CLAIMED',
    ]);
  });

  it('rejects path traversal and missing session IDs without claiming a lock', () => {
    expect(run('claim', '../outside', 'opencode').status).toBe(1);
    expect(run('claim', 'missing', 'opencode').status).toBe(1);
    expect(run('list').stdout).toContain('No active sessions');
  });
});
