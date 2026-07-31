/**
 * Reward learning — "the loop learns from you".
 *
 * Maintains a per-action-type preference weight (0..1, default 1). When an
 * operator OVERRIDES an action the loop proposed, that is a negative reward:
 * the action type's weight is multiplied down so the same type ranks lower next
 * time. When an operator ACCEPTS, the weight is nudged back toward 1.
 *
 * Final ranking uses `simScore * weight`, so the loop measurably adapts to
 * operator preference across cycles. This is deliberately a transparent,
 * inspectable preference-weighting — NOT neural backprop. Calling it "learning"
 * is honest at exactly this level and no higher (truth discipline).
 *
 * Persistence follows the loop-engineering disk-state idiom
 * (`src/agents/loop-engineering/loop-state.ts`): synchronous JSON file writes
 * so weights survive process restarts. Omit `filePath` for a purely in-memory
 * store (used in tests).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import logger from '../../utils/logger.js';
import type { OperatorFeedback, RewardEvent } from './types.js';

/** Default learning rate: an override removes 30% of the current weight. */
export const DEFAULT_LEARNING_RATE = 0.3;
/** Weights never fall below this floor (an action type is never fully banned). */
export const WEIGHT_FLOOR = 0.1;
/** Default starting weight for an unseen action type. */
export const DEFAULT_WEIGHT = 1;

interface RewardStoreOptions {
  /** Optional JSON file to persist weights to. In-memory only when omitted. */
  filePath?: string;
  /** Override the learning rate (0..1). */
  learningRate?: number;
}

export class RewardStore {
  private weights: Map<string, number> = new Map();
  private readonly filePath?: string;
  private readonly learningRate: number;

  constructor(opts: RewardStoreOptions = {}) {
    this.filePath = opts.filePath;
    this.learningRate = opts.learningRate ?? DEFAULT_LEARNING_RATE;
    this.load();
  }

  /** Current weight for an action type (default 1 when unseen). */
  getWeight(actionType: string): number {
    return this.weights.get(actionType) ?? DEFAULT_WEIGHT;
  }

  /**
   * Apply one piece of operator feedback. Override pushes the weight down by the
   * learning rate (clamped to the floor); accept nudges it back toward 1 by the
   * same rate. Returns the before/after for auditability.
   */
  applyFeedback(feedback: OperatorFeedback): RewardEvent {
    const before = this.getWeight(feedback.actionType);
    let after: number;

    if (feedback.verdict === 'override') {
      after = Math.max(WEIGHT_FLOOR, before * (1 - this.learningRate));
    } else {
      // Move a fraction of the remaining distance back toward 1.
      after = before + (DEFAULT_WEIGHT - before) * this.learningRate;
    }

    this.weights.set(feedback.actionType, after);
    this.persist();
    return {
      actionType: feedback.actionType,
      verdict: feedback.verdict,
      weightBefore: before,
      weightAfter: after,
    };
  }

  /** Apply a batch of feedback, returning one RewardEvent per item. */
  applyBatch(feedback: OperatorFeedback[]): RewardEvent[] {
    return feedback.map((f) => this.applyFeedback(f));
  }

  /** Snapshot of all known weights (for inspection / logging). */
  snapshot(): Record<string, number> {
    return Object.fromEntries(this.weights);
  }

  // ---- persistence (synchronous, mirrors loop-state.ts) ----

  private load(): void {
    if (!this.filePath || !existsSync(this.filePath)) return;
    try {
      const raw = readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as Record<string, number>;
      this.weights = new Map(Object.entries(parsed));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.warn('RewardStore failed to load weights — starting fresh', {
        filePath: this.filePath,
        error: msg,
      });
    }
  }

  private persist(): void {
    if (!this.filePath) return;
    try {
      mkdirSync(dirname(this.filePath), { recursive: true });
      writeFileSync(this.filePath, JSON.stringify(this.snapshot(), null, 2), 'utf-8');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.warn('RewardStore failed to persist weights', { filePath: this.filePath, error: msg });
    }
  }
}
