/**
 * Loop Orchestrator — Maker/Checker cycle runner
 *
 * Implements the field note pattern:
 *   1. Schedule/trigger picks the goal and sets the exit condition + budget
 *   2. Maker runs an inner observe-think-act loop to produce work
 *   3. Checker grades the output; findings return to Maker as next instruction
 *   4. Cycle repeats until: Checker returns PASS | maxCycles reached | budget exhausted
 *
 * State is written to a file on disk after every cycle so the loop can
 * resume after a session crash or days of inactivity.
 */

import logger from '../../utils/logger.js';
import { createLLMClientForAgent } from '../llm-client.js';
import { CheckerAgent } from './checker.agent.js';
import { LoopBudget } from './loop-budget.js';
import { runSafetyGate } from './loop-safety-gate.js';
import {
  appendCycle,
  createInitialState,
  readState,
  setStatus,
  updateOpenFindings,
  writeState,
} from './loop-state.js';
import type {
  CheckerFinding,
  CheckerResult,
  LoopConfig,
  LoopCycleRecord,
  LoopResult,
  LoopStateFile,
} from './types.js';
import type { AgentContext, LLMMessage, LLMResponse } from '../types.js';

export class LoopOrchestrator {
  private checker: CheckerAgent;

  constructor(private readonly config: LoopConfig) {
    this.checker = new CheckerAgent(config.checker.systemPrompt || undefined);
  }

  async run(context: AgentContext): Promise<LoopResult> {
    const { config } = this;
    const stateFilePath = config.stateFilePath;

    // Resolve or create state.
    // We only adopt an existing file when it represents an in-flight run
    // ('running'). A terminal file (done / budget-exhausted / error) is left
    // untouched and a fresh state is created — we never overwrite completed
    // history or inherit a finished run's spend.
    let state: LoopStateFile;
    const existing = config.resumeIfExists ? readState(stateFilePath) : null;
    const resuming = existing !== null && existing.status === 'running';

    if (existing && resuming) {
      logger.info('Loop resuming from existing state', {
        loopId: existing.id,
        cycles: existing.cycles.length,
        openFindings: existing.openFindings.length,
      });
      state = existing;
    } else {
      state = createInitialState({
        id: config.id,
        goal: config.goal,
        exitCondition: config.exitCondition,
        maxCycles: config.budget.maxCycles,
        maxIterationsPerCycle: config.budget.maxIterationsPerCycle,
        budgetEurCap: config.budget.eurCap,
        budgetTokensInCap: config.budget.tokensInCap,
        budgetTokensOutCap: config.budget.tokensOutCap,
        verificationBar: config.verificationBar ?? 'major',
      });
      writeState(stateFilePath, state);
    }

    // Budget is set before the loop runs — never adjusted mid-run
    const budget = new LoopBudget({
      maxSteps: config.budget.maxIterationsPerCycle * config.budget.maxCycles,
      tokensInCap: config.budget.tokensInCap,
      tokensOutCap: config.budget.tokensOutCap,
      eurCap: config.budget.eurCap,
    });

    // Restore prior spend ONLY when actually resuming a running loop.
    // Both input AND output tokens are restored — output is the expensive
    // dimension, so dropping it would let a resumed loop blow past eurCap.
    if (resuming) {
      budget.charge(state.totalTokensIn, state.totalTokensOut);
    }

    setStatus(state, 'running');
    writeState(stateFilePath, state);

    let finalOutput = '';
    let cycleNum = state.cycles.length;

    // ── OUTER LOOP: Maker → Checker cycles ──────────────────────────────
    while (cycleNum < config.budget.maxCycles) {
      // Safety gate: validate + scope + budget before each cycle
      const gate = runSafetyGate({
        action: 'maker-cycle',
        input: { cycle: cycleNum, goal: config.goal },
        scope: { allowedActions: ['maker-cycle', 'checker-cycle'] },
        budget,
      });

      if (!gate.allowed) {
        logger.warn('Safety gate rejected Maker cycle', { phase: gate.phase, reason: gate.reason });
        setStatus(state, 'budget-exhausted', gate.reason);
        writeState(stateFilePath, state);
        break;
      }

      const cycleStart = new Date().toISOString();
      const openFindings = state.openFindings;

      // Build Maker instruction: initial goal OR checker findings from last cycle
      const makerInstruction =
        openFindings.length > 0
          ? buildMakerRetryInstruction(config.goal, config.exitCondition, openFindings)
          : config.goal;

      logger.info('Loop cycle starting', {
        loopId: config.id,
        cycle: cycleNum,
        openFindings: openFindings.length,
      });

      // ── INNER LOOP: Maker agent (observe-think-act) ──────────────────
      const makerResult = await this.runMaker(context, makerInstruction, budget);
      finalOutput = makerResult.output;

      // ── CHECKER: grade Maker output ──────────────────────────────────
      const checkerResponse = await this.checker.execute(context, {
        goal: config.goal,
        exitCondition: config.exitCondition,
        makerOutput: makerResult.output,
        openFindings,
        cycleNumber: cycleNum,
        verificationBar: state.verificationBar,
      });

      const checkerResult = checkerResponse.result as unknown as CheckerResult;

      // Charge checker tokens to budget
      budget.charge(checkerResult.tokensIn, checkerResult.tokensOut);

      const cycleRecord: LoopCycleRecord = {
        cycle: cycleNum,
        startedAt: cycleStart,
        completedAt: new Date().toISOString(),
        makerInstruction,
        makerOutput: makerResult.output,
        makerTokensIn: makerResult.tokensIn,
        makerTokensOut: makerResult.tokensOut,
        checkerResult,
      };

      // ── EXIT CONDITIONS ──────────────────────────────────────────────
      if (checkerResult.verdict === 'PASS') {
        cycleRecord.exitReason = 'Checker PASS — exit condition met';
        appendCycle(state, cycleRecord);
        updateOpenFindings(state, []);
        setStatus(state, 'done');
        writeState(stateFilePath, state);

        logger.info('Loop completed successfully', { loopId: config.id, cycles: cycleNum + 1 });
        break;
      }

      if (checkerResult.verdict === 'REPLAN') {
        cycleRecord.exitReason = 'Checker REPLAN — task framing requires human review';
        appendCycle(state, cycleRecord);
        updateOpenFindings(state, checkerResult.findings);
        setStatus(state, 'error', `REPLAN: ${checkerResult.summary}`);
        writeState(stateFilePath, state);

        logger.warn('Loop halted on REPLAN', { loopId: config.id, summary: checkerResult.summary });
        break;
      }

      // FAIL: update findings and continue
      appendCycle(state, cycleRecord);
      updateOpenFindings(state, checkerResult.findings);
      writeState(stateFilePath, state);

      cycleNum++;

      if (budget.isExhausted) {
        setStatus(state, 'budget-exhausted', budget.summary().exhaustedReason);
        writeState(stateFilePath, state);
        logger.warn('Loop halted — budget exhausted', { loopId: config.id });
        break;
      }

      if (cycleNum >= config.budget.maxCycles) {
        setStatus(state, 'max-cycles');
        writeState(stateFilePath, state);
        logger.warn('Loop halted — max cycles reached', { loopId: config.id });
        break;
      }
    }

    const budgetSummary = budget.summary();

    return {
      loopId: config.id,
      status: state.status,
      cyclesRun: state.cycles.length,
      finalOutput,
      openFindings: state.openFindings,
      totalTokensIn: state.totalTokensIn,
      totalTokensOut: state.totalTokensOut,
      estimatedCostEur: budgetSummary.estimatedCostEur,
      stateFilePath,
    };
  }

  // ── MAKER RUNNER ────────────────────────────────────────────────────────

  private async runMaker(
    _context: AgentContext,
    instruction: string,
    budget: LoopBudget,
  ): Promise<{ output: string; tokensIn: number; tokensOut: number }> {
    const { maker } = this.config;

    const client = createLLMClientForAgent(maker.agentName, {
      tierOverride: maker.modelTier ?? 'standard',
      requiresTools: false,
    });

    if (!client) {
      return {
        output: '[Maker unavailable — no LLM client configured]',
        tokensIn: 0,
        tokensOut: 0,
      };
    }

    const messages: LLMMessage[] = [
      { role: 'system', content: maker.systemPrompt },
      { role: 'user', content: instruction },
    ];

    let totalIn = 0;
    let totalOut = 0;
    let lastContent = '';
    const maxIter = this.config.budget.maxIterationsPerCycle;

    for (let i = 0; i < maxIter; i++) {
      const stepCheck = budget.stepUsed();
      if (!stepCheck.allowed) {
        logger.warn('Maker inner loop halted — step budget exhausted', {
          reason: stepCheck.reason,
        });
        break;
      }

      let response: LLMResponse;
      try {
        response = await client.chat(messages);
      } catch (err) {
        logger.error('Maker LLM call failed', { maker: maker.agentName, error: String(err) });
        break;
      }

      totalIn += response.inputTokens;
      totalOut += response.outputTokens;
      lastContent = response.content;

      const chargeResult = budget.charge(response.inputTokens, response.outputTokens);
      if (!chargeResult.allowed) {
        logger.warn('Maker halted mid-loop — token budget exhausted', {
          reason: chargeResult.reason,
        });
        break;
      }

      messages.push({ role: 'assistant', content: response.content });

      // Maker signals it is done (no tool calls = end_turn)
      if (
        !response.toolCalls ||
        response.toolCalls.length === 0 ||
        response.stopReason === 'end_turn'
      ) {
        break;
      }
    }

    return { output: lastContent, tokensIn: totalIn, tokensOut: totalOut };
  }
}

// ── HELPERS ───────────────────────────────────────────────────────────────

function buildMakerRetryInstruction(
  goal: string,
  exitCondition: string,
  findings: CheckerFinding[],
): string {
  const findingsList = findings
    .map(
      (f, i) =>
        `${i + 1}. [${f.severity}] ${f.description}\n   Fix: ${f.fixInstruction}${f.location ? `\n   Location: ${f.location}` : ''}`,
    )
    .join('\n\n');

  return `Original goal: ${goal}

Exit condition: ${exitCondition}

The Checker reviewed your last output and found the following issues that must be resolved:

${findingsList}

Address all findings above. Do not address things not listed. When done, produce the complete corrected output.`;
}
