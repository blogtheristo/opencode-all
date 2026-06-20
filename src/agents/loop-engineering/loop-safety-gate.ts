/**
 * Loop Safety Gate — Validate → Scope → Budget → Allow pipeline
 *
 * Every action passes a policy gate before execution (mirrors the diagram).
 * If any phase rejects, the gate returns Reject + Replan so the orchestrator
 * can adjust and retry without burning tokens on a blocked action.
 *
 * Phases:
 *   1. Validate  — schema / intent check on the proposed action
 *   2. Scope     — permission boundary check (is this action in-scope?)
 *   3. Budget    — cost / step limit check
 *   4. Allow     — all passed; emit to executor
 */

import type { GateResult } from './types.js';
import type { LoopBudget } from './loop-budget.js';

export interface ScopePolicy {
  /** Tool/action names explicitly allowed in this loop */
  allowedActions: string[];
  /** Tool/action names explicitly blocked (takes precedence over allowedActions) */
  blockedActions?: string[];
}

/**
 * Run the full Validate → Scope → Budget → Allow gate.
 *
 * Returns { allowed: true, phase: 'allow' } when all phases pass.
 * Returns { allowed: false, phase: <failing-phase>, reason } on first failure.
 */
export function runSafetyGate(params: {
  action: string;
  inputSchema?: Record<string, unknown>;
  input: Record<string, unknown>;
  scope: ScopePolicy;
  budget: LoopBudget;
  estimatedTokensIn?: number;
  estimatedTokensOut?: number;
}): GateResult {
  const { action, input, scope, budget, estimatedTokensIn = 0, estimatedTokensOut = 0 } = params;

  // Phase 1: Validate — basic schema/intent check
  if (!action || typeof action !== 'string' || action.trim() === '') {
    return { allowed: false, phase: 'validate', reason: 'Action name is empty or invalid' };
  }
  if (action.length > 256) {
    return { allowed: false, phase: 'validate', reason: 'Action name exceeds 256 chars' };
  }
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { allowed: false, phase: 'validate', reason: 'Input must be a non-null object' };
  }

  // Phase 2: Scope — permission boundary
  if (scope.blockedActions?.includes(action)) {
    return {
      allowed: false,
      phase: 'scope',
      reason: `Action "${action}" is explicitly blocked in this loop's scope policy`,
    };
  }
  if (scope.allowedActions.length > 0 && !scope.allowedActions.includes(action)) {
    return {
      allowed: false,
      phase: 'scope',
      reason: `Action "${action}" is not in this loop's allowed action list: [${scope.allowedActions.join(', ')}]`,
    };
  }

  // Phase 3: Budget — cost/step check (speculative: uses estimated tokens)
  if (estimatedTokensIn > 0 || estimatedTokensOut > 0) {
    const budgetCheck = budget.charge(estimatedTokensIn, estimatedTokensOut);
    if (!budgetCheck.allowed) {
      return { allowed: false, phase: 'budget', reason: budgetCheck.reason };
    }
  }

  const stepCheck = budget.stepUsed();
  if (!stepCheck.allowed) {
    return { allowed: false, phase: 'budget', reason: stepCheck.reason };
  }

  // Phase 4: Allow
  return { allowed: true, phase: 'allow' };
}
