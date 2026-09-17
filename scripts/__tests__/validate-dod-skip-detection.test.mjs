// Evidence: Tool=Claude Code Model=undisclosed-in-source (see commit trailer) Agent=claude Date=2026-09-10
// Audit trail: git log -- scripts/__tests__/validate-dod-skip-detection.test.mjs
/**
 * DoD Gate "Check 2: no skipped tests" — detection accuracy.
 *
 * The gate used a bare `\.skip` pattern, so `expect(result.skipped).toBe(1)` —
 * an assertion ABOUT a skipped-item count — was reported as a permanently
 * skipped test and failed the gate on every PR. A gate that cries wolf trains
 * people to merge past it, which costs more than the check is worth.
 *
 * The pattern is READ OUT OF scripts/validate-dod.sh rather than restated here,
 * so this cannot drift away from what CI actually runs.
 */

import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(__dirname, '..', 'validate-dod.sh');

/** Pull SKIP_PATTERN='...' out of the gate script — single source of truth. */
function skipPattern() {
  const src = readFileSync(SCRIPT, 'utf8');
  const m = src.match(/^SKIP_PATTERN='(.+)'$/m);
  if (!m) throw new Error('SKIP_PATTERN not found in scripts/validate-dod.sh');
  return m[1];
}

/** Run the gate's own grep invocation over one line of source. */
function matches(line) {
  const dir = mkdtempSync(join(tmpdir(), 'dod-skip-'));
  const file = join(dir, 'probe.test.ts');
  writeFileSync(file, `${line}\n`);
  try {
    execFileSync('grep', ['-rEn', skipPattern(), file], { encoding: 'utf8' });
    return true;
  } catch {
    return false; // grep exits 1 on no match
  }
}

describe('DoD skip detection — real skips are caught', () => {
  it.each([
    ['it.skip', 'it.skip("x", () => {});'],
    ['test.skip', 'test.skip("x", () => {});'],
    ['describe.skip', 'describe.skip("x", () => {});'],
    ['suite.skip', 'suite.skip("x", () => {});'],
    ['it.skip.each', 'it.skip.each([1])("x", () => {});'],
    ['xit', 'xit("x", () => {});'],
    ['xdescribe', 'xdescribe("x", () => {});'],
    ['indented it.skip', '    it.skip("x", () => {});'],
    ['@skip annotation', '// @skip flaky under load'],
  ])('flags %s', (_label, line) => {
    expect(matches(line)).toBe(true);
  });
});

describe('DoD skip detection — look-alikes are ignored', () => {
  it.each([
    ['the regression that broke the gate', 'expect(result.skipped).toBe(1);'],
    ['a skipped counter read', 'const n = summary.skippedCount;'],
    ['skipIf, conditional by design', 'it.skipIf(process.platform === "win32")("x", () => {});'],
    ['describe.skipIf', 'describe.skipIf(cond)("x", () => {});'],
    ['a variable named skip', 'let skip = false;'],
    ['a property named skip', 'return { skip: true };'],
    ['prose mentioning skipped tests', '// we no longer have skipped tests here'],
  ])('ignores %s', (_label, line) => {
    expect(matches(line)).toBe(false);
  });
});
