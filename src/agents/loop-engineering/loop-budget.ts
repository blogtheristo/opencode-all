/**
 * Loop Budget — Hard-stop enforcement for Loop Engineering
 *
 * The budget must be set BEFORE the loop runs, not while it is running.
 * A loop with no stop condition burns tokens; the cost climbs fast once
 * sub-agents and long runs add up.
 *
 * Tracks token usage and estimated EUR cost across all cycles.
 * Any charge() or stepUsed() call that would exceed a cap returns
 * { allowed: false } — the orchestrator must then exit gracefully.
 */

import { estimateCostEur } from './loop-state.js';
import type { BudgetSummary } from './types.js';

export interface BudgetConfig {
  /** Max inner iterations across all cycles (Maker loop steps) */
  maxSteps: number;
  /** Max total input tokens across all cycles */
  tokensInCap: number;
  /** Max total output tokens across all cycles */
  tokensOutCap: number;
  /** Max estimated EUR cost across all cycles */
  eurCap: number;
}

export class LoopBudget {
  private tokensIn = 0;
  private tokensOut = 0;
  private stepsUsed = 0;
  private exhaustedReason: string | undefined;

  constructor(private readonly config: BudgetConfig) {}

  /**
   * Charge a token usage to the budget.
   * Returns { allowed: false } if any cap would be exceeded after this charge.
   */
  charge(tokensIn: number, tokensOut: number): { allowed: boolean; reason?: string } {
    if (this.exhaustedReason) {
      return { allowed: false, reason: this.exhaustedReason };
    }

    const nextIn = this.tokensIn + tokensIn;
    const nextOut = this.tokensOut + tokensOut;
    const nextCost = estimateCostEur(nextIn, nextOut);

    if (nextIn > this.config.tokensInCap) {
      this.exhaustedReason = `Input token cap exceeded: ${nextIn} > ${this.config.tokensInCap}`;
      return { allowed: false, reason: this.exhaustedReason };
    }
    if (nextOut > this.config.tokensOutCap) {
      this.exhaustedReason = `Output token cap exceeded: ${nextOut} > ${this.config.tokensOutCap}`;
      return { allowed: false, reason: this.exhaustedReason };
    }
    if (nextCost > this.config.eurCap) {
      this.exhaustedReason = `EUR cost cap exceeded: ${nextCost.toFixed(4)} > ${this.config.eurCap}`;
      return { allowed: false, reason: this.exhaustedReason };
    }

    this.tokensIn = nextIn;
    this.tokensOut = nextOut;
    return { allowed: true };
  }

  /** Record one inner Maker iteration step. */
  stepUsed(): { allowed: boolean; reason?: string } {
    if (this.exhaustedReason) {
      return { allowed: false, reason: this.exhaustedReason };
    }
    this.stepsUsed++;
    if (this.stepsUsed > this.config.maxSteps) {
      this.exhaustedReason = `Step cap exceeded: ${this.stepsUsed} > ${this.config.maxSteps}`;
      return { allowed: false, reason: this.exhaustedReason };
    }
    return { allowed: true };
  }

  get isExhausted(): boolean {
    return this.exhaustedReason !== undefined;
  }

  summary(): BudgetSummary {
    return {
      tokensIn: this.tokensIn,
      tokensOut: this.tokensOut,
      stepsUsed: this.stepsUsed,
      estimatedCostEur: estimateCostEur(this.tokensIn, this.tokensOut),
      tokensInCap: this.config.tokensInCap,
      tokensOutCap: this.config.tokensOutCap,
      stepsCap: this.config.maxSteps,
      eurCap: this.config.eurCap,
      exhausted: this.isExhausted,
      exhaustedReason: this.exhaustedReason,
    };
  }
}
