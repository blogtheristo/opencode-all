/**
 * Loop Engineering — Public API
 *
 * Usage:
 *   import { LoopOrchestrator, LoopBudget } from './loop-engineering/index.js';
 *
 *   const loop = new LoopOrchestrator({
 *     id: '20260613-fix-lint',
 *     goal: 'Fix all ESLint errors in src/agents/',
 *     exitCondition: 'npm run lint exits 0 with no warnings',
 *     stateFilePath: '.claude/loops/20260613-fix-lint.md',
 *     maker: { agentName: 'hephaestus', systemPrompt: MAKER_SOUL },
 *     checker: { agentName: 'loop-checker', systemPrompt: CHECKER_SOUL },
 *     budget: {
 *       maxCycles: 3,
 *       maxIterationsPerCycle: 5,
 *       eurCap: 0.50,
 *       tokensInCap: 100_000,
 *       tokensOutCap: 50_000,
 *     },
 *     verificationBar: 'major',
 *     resumeIfExists: true,
 *   });
 *
 *   const result = await loop.run(context);
 */

export { LoopOrchestrator } from './loop-orchestrator.js';
export { CheckerAgent } from './checker.agent.js';
export { LoopBudget } from './loop-budget.js';
export { runSafetyGate } from './loop-safety-gate.js';
export {
  createInitialState,
  readState,
  writeState,
  appendCycle,
  updateOpenFindings,
  setStatus,
  estimateCostEur,
} from './loop-state.js';
export type {
  LoopConfig,
  LoopResult,
  LoopStateFile,
  LoopCycleRecord,
  CheckerResult,
  CheckerFinding,
  CheckerVerdict,
  FindingSeverity,
  MakerConfig,
  CheckerConfig,
  GateResult,
  BudgetSummary,
  LoopStatus,
} from './types.js';
