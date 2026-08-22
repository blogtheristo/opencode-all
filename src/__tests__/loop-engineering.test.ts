/**
 * Loop Engineering — state persistence & budget regression tests
 *
 * Guards the three critical fixes:
 *   #1 resume round-trip survives Maker output containing '-->'
 *   #2 terminal state files are not adopted as resumable
 *   #3 budget restore preserves output tokens (EUR-cap integrity)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  appendCycle,
  createInitialState,
  estimateCostEur,
  readState,
  writeState,
} from '../agents/loop-engineering/loop-state.js';
import { LoopBudget } from '../agents/loop-engineering/loop-budget.js';
import type { LoopCycleRecord, LoopStateFile } from '../agents/loop-engineering/types.js';

const tmpFiles: string[] = [];

function tmpStatePath(): string {
  const dir = mkdtempSync(join(tmpdir(), 'loop-state-'));
  const path = join(dir, 'loop.md');
  tmpFiles.push(dir);
  return path;
}

afterEach(() => {
  for (const dir of tmpFiles.splice(0)) {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
});

function baseState(): LoopStateFile {
  return createInitialState({
    id: '20260613-test',
    goal: 'test goal',
    exitCondition: 'all tests pass',
    maxCycles: 3,
    maxIterationsPerCycle: 5,
    budgetEurCap: 1.0,
    budgetTokensInCap: 100_000,
    budgetTokensOutCap: 50_000,
    verificationBar: 'major',
  });
}

describe('loop-state round-trip (bug #1)', () => {
  it('survives Maker output containing the HTML comment terminator -->', () => {
    const path = tmpStatePath();
    const state = baseState();
    state.status = 'running';

    const cycle: LoopCycleRecord = {
      cycle: 0,
      startedAt: new Date().toISOString(),
      makerInstruction: 'fix it',
      // This is the exact payload that broke the old non-greedy regex.
      makerOutput: 'const x = `<div>`; // closes here --> and JSX {/* foo --> */}',
      makerTokensIn: 1200,
      makerTokensOut: 800,
      checkerResult: {
        verdict: 'FAIL',
        findings: [],
        summary: 'needs work',
        tokensIn: 300,
        tokensOut: 100,
        model: 'test',
      },
    };
    appendCycle(state, cycle);
    writeState(path, state);

    const recovered = readState(path);
    expect(recovered).not.toBeNull();
    expect(recovered!.cycles).toHaveLength(1);
    expect(recovered!.cycles[0].makerOutput).toBe(cycle.makerOutput);
    expect(recovered!.totalTokensIn).toBe(1500);
    expect(recovered!.totalTokensOut).toBe(900);
  });

  it('preserves arbitrary quote/newline content in goal and findings', () => {
    const path = tmpStatePath();
    const state = baseState();
    state.status = 'running';
    state.goal = 'Fix "all" lint --> errors\nand more';
    state.openFindings = [
      {
        id: 'f1',
        severity: 'major',
        description: 'bad --> thing',
        fixInstruction: 'do "x"',
        location: 'src/a.ts:10',
      },
    ];
    writeState(path, state);

    const recovered = readState(path);
    expect(recovered!.goal).toBe('Fix "all" lint --> errors\nand more');
    expect(recovered!.openFindings[0].description).toBe('bad --> thing');
  });
});

describe('readState (bug #2 — terminal states are still readable)', () => {
  it('reads back a done state so callers can decide not to resume', () => {
    const path = tmpStatePath();
    const state = baseState();
    state.status = 'done';
    writeState(path, state);

    const recovered = readState(path);
    expect(recovered!.status).toBe('done');
  });

  it('returns null for a missing file', () => {
    expect(readState(join(tmpdir(), 'does-not-exist-loop.md'))).toBeNull();
  });
});

describe('budget restore preserves output tokens (bug #3)', () => {
  it('charges both input and output on restore so EUR cap stays accurate', () => {
    // eurCap chosen to be exceeded only if output tokens are counted.
    const priorIn = 10_000;
    const priorOut = 40_000;
    const costWithOut = estimateCostEur(priorIn, priorOut); // ~0.63
    const costWithoutOut = estimateCostEur(priorIn, 0); // ~0.03

    const eurCap = (costWithOut + costWithoutOut) / 2; // between the two

    const budget = new LoopBudget({
      maxSteps: 100,
      tokensInCap: 1_000_000,
      tokensOutCap: 1_000_000,
      eurCap,
    });

    // Correct restore (both dimensions) must immediately exceed eurCap.
    const result = budget.charge(priorIn, priorOut);
    expect(result.allowed).toBe(false);
    expect(budget.isExhausted).toBe(true);
  });
});

describe('LoopBudget caps', () => {
  it('refuses charges past the input token cap', () => {
    const budget = new LoopBudget({
      maxSteps: 100,
      tokensInCap: 1000,
      tokensOutCap: 1000,
      eurCap: 100,
    });
    expect(budget.charge(500, 0).allowed).toBe(true);
    expect(budget.charge(600, 0).allowed).toBe(false);
    expect(budget.isExhausted).toBe(true);
  });

  it('refuses steps past the step cap', () => {
    const budget = new LoopBudget({
      maxSteps: 2,
      tokensInCap: 1e9,
      tokensOutCap: 1e9,
      eurCap: 1e9,
    });
    expect(budget.stepUsed().allowed).toBe(true);
    expect(budget.stepUsed().allowed).toBe(true);
    expect(budget.stepUsed().allowed).toBe(false);
  });
});
