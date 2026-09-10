// Evidence: Tool=Claude Code Model=undisclosed-in-source (see commit trailer) Agent=claude Date=2026-09-10
// Audit trail: git log -- scripts/__tests__/tree-gate-report.unit.test.mjs
/**
 * CI result-reader tests for the Tree Gate.
 *
 * The defect these exist to prevent: between the gate being added and
 * 2026-09-10 the workflow read `.decision` off the gate's JSON ARRAY with jq,
 * got null on every run, and rendered null as "_No violations detected._" — so
 * a gate that exited 2 without running a single check told reviewers the PR was
 * clean. Every case below asserts that a gate which did not produce a usable
 * verdict resolves to `error`, never to `allow`.
 *
 * Pure functions over strings: no git, no filesystem, no sandbox needed.
 */

import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { interpret, renderComment } from '../tree-gate-report.mjs';

const REF = 'refs/heads/main';
const allowOut = JSON.stringify([{ ref: REF, decision: 'allow' }]);
const blockOut = JSON.stringify([{ ref: REF, decision: 'block' }]);

describe('interpret — the gate ran', () => {
  it('allows when exit 0 and every ref allowed', () => {
    const r = interpret({ exitCode: 0, stdout: allowOut, expectedRef: REF });
    expect(r.decision).toBe('allow');
  });

  it('blocks when exit 1 and a ref is blocked, keeping stderr reasons', () => {
    const r = interpret({
      exitCode: 1,
      stdout: blockOut,
      expectedRef: REF,
      stderr: 'poisoned-tree-gate [refs/heads/main]: P2 deletion ratio 100.0% exceeds tripwire\n',
    });
    expect(r.decision).toBe('block');
    expect(r.reasons).toContain(
      'poisoned-tree-gate [refs/heads/main]: P2 deletion ratio 100.0% exceeds tripwire',
    );
  });

  it('allows a multi-ref push only when no ref is blocked', () => {
    const stdout = JSON.stringify([
      { ref: REF, decision: 'allow' },
      { ref: 'refs/heads/other', decision: 'allow' },
    ]);
    expect(interpret({ exitCode: 0, stdout, expectedRef: REF }).decision).toBe('allow');
  });

  it('blocks a multi-ref push when any single ref is blocked', () => {
    const stdout = JSON.stringify([
      { ref: REF, decision: 'allow' },
      { ref: 'refs/heads/other', decision: 'block' },
    ]);
    expect(interpret({ exitCode: 1, stdout, expectedRef: REF }).decision).toBe('block');
  });
});

describe('interpret — the gate did not run (must never read as allow)', () => {
  it('exit 2 (the historical missing --config) is an error, not a clean result', () => {
    const r = interpret({
      exitCode: 2,
      stdout: '',
      expectedRef: REF,
      stderr: 'poisoned-tree-gate: missing --config <file> / POISONED_TREE_GATE_CONFIG\n',
    });
    expect(r.decision).toBe('error');
    expect(r.reasons.join(' ')).toMatch(/missing --config/);
  });

  it('treats absent stdout as an error even when the exit code says 0', () => {
    expect(interpret({ exitCode: 0, stdout: '', expectedRef: REF }).decision).toBe('error');
  });

  it('treats unparseable stdout as an error', () => {
    expect(interpret({ exitCode: 0, stdout: 'not json at all', expectedRef: REF }).decision).toBe(
      'error',
    );
  });

  it('rejects an object where the gate emits an array (the shape jq mis-read)', () => {
    const r = interpret({
      exitCode: 0,
      stdout: JSON.stringify({ decision: 'allow' }),
      expectedRef: REF,
    });
    expect(r.decision).toBe('error');
  });

  it('treats an empty decision array as an error — nothing was evaluated', () => {
    expect(interpret({ exitCode: 0, stdout: '[]', expectedRef: REF }).decision).toBe('error');
  });

  it('rejects a malformed ref decision', () => {
    const stdout = JSON.stringify([{ ref: REF, decision: 'maybe' }]);
    expect(interpret({ exitCode: 0, stdout, expectedRef: REF }).decision).toBe('error');
  });

  it('errors when the expected ref was not among the evaluated refs', () => {
    const stdout = JSON.stringify([{ ref: 'refs/heads/somewhere-else', decision: 'allow' }]);
    expect(interpret({ exitCode: 0, stdout, expectedRef: REF }).decision).toBe('error');
  });

  it('errors on an unexpected exit code', () => {
    expect(interpret({ exitCode: 137, stdout: allowOut, expectedRef: REF }).decision).toBe('error');
  });

  it('errors when a block is reported but the process exited 0', () => {
    expect(interpret({ exitCode: 0, stdout: blockOut, expectedRef: REF }).decision).toBe('error');
  });

  it('errors when exit 1 is paired with no blocked ref', () => {
    expect(interpret({ exitCode: 1, stdout: allowOut, expectedRef: REF }).decision).toBe('error');
  });
});

describe('CLI argument handling — a non-verdict must stay legible', () => {
  const SCRIPT = fileURLToPath(new URL('../tree-gate-report.mjs', import.meta.url));

  /** Run the CLI and capture status + stderr, never throwing. */
  function run(args) {
    try {
      const stdout = execFileSync('node', [SCRIPT, ...args], { encoding: 'utf8', stdio: 'pipe' });
      return { status: 0, stdout, stderr: '' };
    } catch (err) {
      return { status: err.status, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
    }
  }

  it('exits 2 with the usage message when a flag is last and has no value', () => {
    const r = run(['--result', '/nonexistent', '--exit-code']);
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/usage/);
    expect(r.stdout).not.toMatch(/NaN/);
  });

  it('exits 2 when a flag is followed by another flag instead of a value', () => {
    const r = run(['--result', '/nonexistent', '--exit-code', '--expected-ref', REF]);
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/usage/);
  });

  it('exits 2 on a non-numeric exit code rather than reporting "exited NaN"', () => {
    const r = run(['--result', '/nonexistent', '--exit-code', 'banana']);
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/usage/);
    expect(r.stdout).not.toMatch(/NaN/);
  });

  it('a missing result file is an ERROR, never an allow', () => {
    const r = run(['--result', '/nonexistent/gate-result.json', '--exit-code', '0']);
    expect(r.status).toBe(2);
    expect(r.stdout).toMatch(/ERROR — the gate did not execute/);
  });
});

describe('renderComment', () => {
  it('never emits a no-violations line for an error', () => {
    const body = renderComment(interpret({ exitCode: 2, stdout: '', expectedRef: REF }));
    expect(body).toMatch(/ERROR — the gate did not execute/);
    expect(body).not.toMatch(/no violation/i);
  });

  it('states the block reasons for a block', () => {
    const body = renderComment(
      interpret({
        exitCode: 1,
        stdout: blockOut,
        expectedRef: REF,
        stderr: 'P3 deletions 7149 exceed cap 500',
      }),
    );
    expect(body).toMatch(/Tree Gate: BLOCK/);
    expect(body).toMatch(/P3 deletions 7149 exceed cap 500/);
  });

  it('reports a clean result only when the gate actually allowed', () => {
    const body = renderComment(interpret({ exitCode: 0, stdout: allowOut, expectedRef: REF }));
    expect(body).toMatch(/Tree Gate: ALLOW/);
    expect(body).toMatch(/no violation found/);
  });
});
