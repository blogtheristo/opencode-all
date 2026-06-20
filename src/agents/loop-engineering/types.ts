/**
 * Loop Engineering Types — DWS IQ 6/7
 *
 * Maker/Checker loop architecture where:
 *   - A Maker agent produces work
 *   - A Checker agent grades it and returns findings
 *   - Findings feed back to the Maker as the next instruction
 *   - Loop exits on: all findings resolved | max cycles | budget exhausted
 *
 * State lives on disk (MD file) so the loop survives session interruptions.
 */

// ============ CHECKER OUTPUT ============

export type CheckerVerdict = 'PASS' | 'FAIL' | 'REPLAN';

export type FindingSeverity = 'major' | 'minor' | 'nitpick';

export interface CheckerFinding {
  id: string;
  severity: FindingSeverity;
  description: string;
  /** Specific instruction for the Maker to fix this finding */
  fixInstruction: string;
  /** Optional: file/line reference */
  location?: string;
}

export interface CheckerResult {
  verdict: CheckerVerdict;
  findings: CheckerFinding[];
  summary: string;
  tokensIn: number;
  tokensOut: number;
  model: string;
}

// ============ LOOP STATE (disk-persisted) ============

export interface LoopCycleRecord {
  cycle: number;
  startedAt: string;
  completedAt?: string;
  makerInstruction: string;
  makerOutput: string;
  makerTokensIn: number;
  makerTokensOut: number;
  checkerResult?: CheckerResult;
  exitReason?: string;
}

export type LoopStatus =
  | 'pending'
  | 'running'
  | 'done'
  | 'budget-exhausted'
  | 'max-cycles'
  | 'error';

export interface LoopStateFile {
  /** Unique loop run ID (yyyyMMdd-loopId) */
  id: string;
  /** Human-readable goal for this loop */
  goal: string;
  /**
   * The rule that terminates the loop when the Checker accepts it.
   * Example: "all tests pass and lint clean"
   */
  exitCondition: string;
  /** Hard cap on Maker/Checker cycles (set before loop runs) */
  maxCycles: number;
  /** Hard cap on inner Maker iterations per cycle */
  maxIterationsPerCycle: number;
  /** EUR token cost budget (set before loop runs) */
  budgetEurCap: number;
  /** Max total input tokens across all cycles */
  budgetTokensInCap: number;
  /** Max total output tokens across all cycles */
  budgetTokensOutCap: number;
  /** Which findings to chase: 'major' stops only at major; 'all' stops at any finding */
  verificationBar: 'major' | 'all';
  status: LoopStatus;
  cycles: LoopCycleRecord[];
  /** Findings still open (not yet resolved by Maker) */
  openFindings: CheckerFinding[];
  totalTokensIn: number;
  totalTokensOut: number;
  startedAt: string;
  updatedAt: string;
  errorMessage?: string;
}

// ============ ORCHESTRATOR CONFIG ============

export interface MakerConfig {
  /** System prompt for the Maker agent */
  systemPrompt: string;
  /** Agent name for logging */
  agentName: string;
  /** Model tier to use */
  modelTier?: 'lite' | 'standard' | 'heavy';
}

export interface CheckerConfig {
  /** System prompt for the Checker agent */
  systemPrompt: string;
  /** Agent name for logging */
  agentName: string;
  /** Model tier to use */
  modelTier?: 'lite' | 'standard' | 'heavy';
}

export interface LoopConfig {
  id: string;
  goal: string;
  exitCondition: string;
  /** Path to the state MD file on disk */
  stateFilePath: string;
  maker: MakerConfig;
  checker: CheckerConfig;
  /** Exit guard config — all must be set before loop runs */
  budget: {
    maxCycles: number;
    maxIterationsPerCycle: number;
    eurCap: number;
    tokensInCap: number;
    tokensOutCap: number;
  };
  verificationBar?: 'major' | 'all';
  /** Resume from existing state file if found */
  resumeIfExists?: boolean;
}

export interface LoopResult {
  loopId: string;
  status: LoopStatus;
  cyclesRun: number;
  finalOutput: string;
  openFindings: CheckerFinding[];
  totalTokensIn: number;
  totalTokensOut: number;
  estimatedCostEur: number;
  stateFilePath: string;
}

// ============ SAFETY GATE ============

export interface GateResult {
  allowed: boolean;
  phase: 'validate' | 'scope' | 'budget' | 'allow';
  reason?: string;
}

// ============ BUDGET SUMMARY ============

export interface BudgetSummary {
  tokensIn: number;
  tokensOut: number;
  stepsUsed: number;
  estimatedCostEur: number;
  tokensInCap: number;
  tokensOutCap: number;
  stepsCap: number;
  eurCap: number;
  exhausted: boolean;
  exhaustedReason?: string;
}
