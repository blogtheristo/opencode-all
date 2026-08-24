import { describe, expect, it } from 'vitest';
import {
  classifyError,
  computeSignals,
  decide,
  DEFAULT_FACTORY_CONFIG,
  extractTrajectoryFromBody,
  extractTrajectoryFromMessages,
  type FactoryRouterConfig,
  freshLadderState,
  interventionProbability,
  type SignalInputs,
  stripSystemReminders,
  type Trajectory,
} from '../factory/index.js';

const CHEAP: SignalInputs = { model: 'haiku', tier: 'cheap', costUsd: 0, budgetUsd: 0, switchesUsed: 0 };
const STRONG: SignalInputs = { model: 'sonnet', tier: 'strong', costUsd: 0, budgetUsd: 0, switchesUsed: 1 };

/** Build an Anthropic Messages body: each step is [tool, args, output, ok]. */
function messagesBody(
  goal: string,
  steps: Array<[string, Record<string, unknown>, string, boolean]>,
): Record<string, unknown> {
  const messages: Array<Record<string, unknown>> = [{ role: 'user', content: goal }];
  steps.forEach(([tool, args, output, ok], i) => {
    messages.push({
      role: 'assistant',
      content: [{ type: 'tool_use', id: `call_${i}`, name: tool, input: args }],
    });
    messages.push({
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: `call_${i}`, content: output, is_error: !ok }],
    });
  });
  return { messages };
}

function reportFor(body: Record<string, unknown>, inputs: SignalInputs = CHEAP) {
  return computeSignals(extractTrajectoryFromBody(body), inputs);
}

describe('evidence extraction (Anthropic Messages)', () => {
  it('recovers goal, pairs tool_use with tool_result, and honors is_error', () => {
    const body = messagesBody('Fix the failing login test', [
      ['Bash', { command: 'npm test' }, '2 tests failed', false],
      ['Edit', { file_path: 'src/auth.ts' }, 'ok', true],
    ]);
    const trajectory = extractTrajectoryFromMessages(body.messages);
    expect(trajectory.goal).toBe('Fix the failing login test');
    expect(trajectory.steps).toHaveLength(2);
    expect(trajectory.steps[0]).toMatchObject({ tool: 'Bash', ok: false, errorClass: 'TestFailure' });
    expect(trajectory.steps[1]).toMatchObject({ tool: 'Edit', ok: true });
    expect(trajectory.pendingCalls).toBe(0);
  });

  it('strips <system-reminder> blocks so the goal is the user request, not CLAUDE.md', () => {
    const text = '<system-reminder>huge boilerplate</system-reminder>Fix the bug';
    expect(stripSystemReminders(text)).toBe('Fix the bug');
    const trajectory = extractTrajectoryFromMessages([{ role: 'user', content: text }]);
    expect(trajectory.goal).toBe('Fix the bug');
  });

  it('routes a Responses-shaped body through the same trajectory model', () => {
    const body = {
      input: [
        { type: 'message', role: 'user', content: 'Sum a list' },
        { type: 'function_call', call_id: 'c1', name: 'shell', arguments: 'python sum.py' },
        { type: 'function_call_output', call_id: 'c1', output: 'SyntaxError: invalid syntax' },
      ],
    };
    const trajectory = extractTrajectoryFromBody(body);
    expect(trajectory.goal).toBe('Sum a list');
    expect(trajectory.steps[0]).toMatchObject({ tool: 'shell', ok: false, errorClass: 'SyntaxError' });
  });
});

describe('error classification', () => {
  it('collapses messages into comparable classes', () => {
    expect(classifyError("ModuleNotFoundError: No module named 'x'")).toBe('ModuleNotFoundError');
    expect(classifyError('bash: foo: command not found')).toBe('CommandNotFound');
    expect(classifyError('something new and strange')).toBe('Unknown');
  });
});

describe('detectors', () => {
  it('flags an identical action+observation repeated 3x as a loop', () => {
    const step: [string, Record<string, unknown>, string, boolean] = [
      'Bash',
      { command: 'npm test' },
      'FAILED: same output',
      false,
    ];
    const report = reportFor(messagesBody('task', [step, step, step]));
    expect(report.loopDetected).toBe(true);
    expect(report.loopKind).toBe('action_observation_repeat');
  });

  it('flags the same error class 3x back-to-back even when actions differ', () => {
    const report = reportFor(
      messagesBody('task', [
        ['Bash', { command: 'a' }, 'TypeError: x is not a function', false],
        ['Bash', { command: 'b' }, 'TypeError: y is not a function', false],
        ['Bash', { command: 'c' }, 'TypeError: z is not a function', false],
      ]),
    );
    expect(report.loopDetected).toBe(true);
    expect(report.loopKind).toBe('repeated_error_class');
    expect(report.repeatedErrorClass).toBe('TypeError');
  });

  it('counts write→failing-exec cycles that naive loop detection misses', () => {
    const report = reportFor(
      messagesBody('task', [
        ['Edit', { file_path: 'a.ts', v: 1 }, 'ok', true],
        ['Bash', { command: 'npm test', v: 1 }, 'tests failed', false],
        ['Edit', { file_path: 'a.ts', v: 2 }, 'ok', true],
        ['Bash', { command: 'npm test', v: 2 }, 'tests failed', false],
      ]),
    );
    expect(report.rewriteRetestCycles).toBe(2);
    expect(report.loopDetected).toBe(false);
    expect(report.consecutiveFailedVerifications).toBe(2);
    expect(report.verificationsRun).toBe(2);
    // Two edits to the same file_path are one file, not two.
    expect(report.distinctFilesTouched).toBe(1);
  });

  it('resets stepsSinceProgress only on a successful execution, not a rewrite', () => {
    const report = reportFor(
      messagesBody('task', [
        ['Bash', { command: 'setup' }, 'ok', true],
        ['Edit', { file_path: 'a.ts' }, 'ok', true],
        ['Bash', { command: 'npm test' }, 'failed', false],
        ['Edit', { file_path: 'a.ts', v: 2 }, 'ok', true],
      ]),
    );
    expect(report.stepsSinceProgress).toBe(3);
    // Both executions count as verifications run, not just failures + last pass.
    expect(report.verificationsRun).toBe(2);
  });
});

describe('gate', () => {
  it('scores a passing trajectory as healthy and a looping one as needing intervention', () => {
    const healthy = reportFor(messagesBody('task', [['Bash', { command: 'npm test' }, 'all passed ok', true]]));
    expect(interventionProbability(healthy)).toBeLessThan(DEFAULT_FACTORY_CONFIG.interventionThreshold);

    const step: [string, Record<string, unknown>, string, boolean] = [
      'Bash',
      { command: 'npm test' },
      'FAILED again',
      false,
    ];
    const stuck = reportFor(messagesBody('task', [step, step, step]));
    expect(interventionProbability(stuck)).toBeGreaterThanOrEqual(
      DEFAULT_FACTORY_CONFIG.interventionThreshold,
    );
  });
});

describe('ladder', () => {
  const failingSteps: Array<[string, Record<string, unknown>, string, boolean]> = [
    ['Bash', { command: 'npm test' }, 'FAILED again', false],
    ['Bash', { command: 'npm test' }, 'FAILED again', false],
    ['Bash', { command: 'npm test' }, 'FAILED again', false],
  ];

  it('continues on a healthy trajectory without consuming ladder state', () => {
    const state = freshLadderState();
    const report = reportFor(messagesBody('task', [['Bash', { command: 'npm test' }, 'all passed ok', true]]));
    const verdict = decide(DEFAULT_FACTORY_CONFIG, report, state);
    expect(verdict.action).toBe('continue');
    expect(state.switchesUsed).toBe(0);
  });

  it('fires the first cheap→strong switch on a single bad checkpoint (asymmetric hysteresis)', () => {
    const state = freshLadderState();
    const report = reportFor(messagesBody('task', failingSteps));
    const verdict = decide(DEFAULT_FACTORY_CONFIG, report, state);
    expect(verdict.action).toBe('switch_model');
    expect(state.switchesUsed).toBe(1);
  });

  it('never demotes: a struggling strong model restarts clean, then escalates to human', () => {
    const state = { switchesUsed: 1, restartsUsed: 0, consecutiveBad: 0 };
    const report = reportFor(messagesBody('task', failingSteps), STRONG);

    // Disruptive actions need consecutiveBadRequired=2 agreeing checkpoints.
    expect(decide(DEFAULT_FACTORY_CONFIG, report, state).action).toBe('continue');
    expect(decide(DEFAULT_FACTORY_CONFIG, report, state).action).toBe('restart_clean');
    expect(state.restartsUsed).toBe(1);

    expect(decide(DEFAULT_FACTORY_CONFIG, report, state).action).toBe('continue');
    expect(decide(DEFAULT_FACTORY_CONFIG, report, state).action).toBe('escalate_human');
  });

  it('upgrades capability before retrying: cheap-tier restart becomes a switch', () => {
    const config: FactoryRouterConfig = { ...DEFAULT_FACTORY_CONFIG };
    const state = freshLadderState();
    // Looping with switchesUsed>=1 scores restart_clean highest, but report tier is
    // cheap and a switch is still available — the ladder must climb instead.
    const step: [string, Record<string, unknown>, string, boolean] = [
      'Bash',
      { command: 'npm test' },
      'FAILED again',
      false,
    ];
    const report = reportFor(messagesBody('task', [step, step, step]), {
      ...CHEAP,
      switchesUsed: 1,
    });
    // switchesUsed=1 in the report but state still has capacity (maxSwitches=2 here).
    config.maxSwitches = 2;
    state.switchesUsed = 1;
    state.consecutiveBad = 1; // second agreeing checkpoint
    const verdict = decide(config, report, state);
    expect(verdict.action).toBe('switch_model');
    expect(state.switchesUsed).toBe(2);
    expect(state.restartsUsed).toBe(0);
  });

  it('escalates to human before any other logic once budget burn crosses the line', () => {
    const state = freshLadderState();
    const trajectory: Trajectory = { steps: [], noToolTurns: 0, assistantTurns: 0, goal: 'task', pendingCalls: 0 };
    const report = computeSignals(trajectory, { ...CHEAP, costUsd: 9, budgetUsd: 10 });
    const config = { ...DEFAULT_FACTORY_CONFIG, budgetUsd: 10 };
    const verdict = decide(config, report, state);
    expect(verdict.action).toBe('escalate_human');
    expect(verdict.reason).toContain('budget burn');
  });

  it('escalates to human when the switch budget is exhausted on the cheap tier', () => {
    // Rewrite-retest thrash (no identical-action loop) scores switch_model; with the
    // one allowed switch already spent, the ladder must hand the task to a human.
    const state = { switchesUsed: 1, restartsUsed: 0, consecutiveBad: 1 };
    const report = reportFor(
      messagesBody('task', [
        ['Edit', { file_path: 'a.ts', v: 1 }, 'ok', true],
        ['Bash', { command: 'npm test' }, 'test failed: expected 1 got 2', false],
        ['Edit', { file_path: 'a.ts', v: 2 }, 'ok', true],
        ['Bash', { command: 'npm test' }, 'test failed: expected 1 got 3', false],
        ['Edit', { file_path: 'a.ts', v: 3 }, 'ok', true],
        ['Bash', { command: 'npm test' }, 'test failed: expected 1 got 4', false],
      ]),
      { ...CHEAP, switchesUsed: 1 },
    );
    const verdict = decide(DEFAULT_FACTORY_CONFIG, report, state);
    expect(verdict.action).toBe('escalate_human');
    expect(verdict.reason).toBe('switch budget exhausted');
  });
});
