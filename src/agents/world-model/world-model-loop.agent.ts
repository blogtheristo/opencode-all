/**
 * WorldModelLoopAgent — Lifetime World Model V1 reference implementation.
 *
 * Binds the three-piece control-room loop from
 * `docs/FIELD_NOTE_WORLD_MODEL_V1_LOOP_2026.md` into one BaseAgent:
 *
 *   1. Perception  — buildStateVector() turns raw telemetry into a governed snapshot.
 *   2. Imagination — ReferenceSimulator projects each candidate action's consequence.
 *   3. Reward      — RewardStore weights candidates by learned operator preference.
 *   4. Action      — the top-ranked action is returned as an HIL-gated PROPOSAL.
 *
 * Hard guardrails (from the field note §4):
 *   - HIL on live mutation: the agent NEVER auto-applies. Proposals that mutate
 *     the live system carry requiresHumanApproval: true and applied: false.
 *   - Determinism stays code: perception, simulation and ranking are deterministic;
 *     the LLM is not in the decision path here.
 *   - Fail loud: a simulator failure surfaces in the response (confidence 0)
 *     rather than a silent "completed".
 */

import logger from '../../utils/logger.js';
import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import { buildStateVector, DEFAULT_ANOMALY_THRESHOLD } from './state-vector.js';
import { ReferenceSimulator, type Simulator } from './simulator.js';
import { RewardStore } from './reward-store.js';
import type {
  ActionProposal,
  CandidateAction,
  RankedAction,
  RewardEvent,
  StateVector,
  WorldModelInput,
} from './types.js';

export class WorldModelLoopAgent extends BaseAgent {
  private readonly simulator: Simulator;
  private readonly rewardStore: RewardStore;

  constructor(deps: { simulator?: Simulator; rewardStore?: RewardStore } = {}) {
    super({
      name: 'world-model-loop',
      description:
        'Lifetime World Model V1 reference loop for control rooms: perception → simulation → ' +
        'HIL-gated action proposal → reward learning. Reference architecture, not a live deploy path.',
      capabilities: [
        'perception-state-vector',
        'consequence-simulation',
        'hil-gated-action-proposal',
        'reward-learning-from-overrides',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
      // Silent pilot: this loop observes and proposes; it never acts on the live
      // system on its own. Live mutation is a human/KYA decision.
      autonomyPhase: 'silent_pilot',
    });
    this.simulator = deps.simulator ?? new ReferenceSimulator();
    this.rewardStore = deps.rewardStore ?? new RewardStore();
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const wmInput = input as unknown as WorldModelInput;
    const telemetry = Array.isArray(wmInput.telemetry) ? wmInput.telemetry : [];
    const candidates: CandidateAction[] = Array.isArray(wmInput.candidateActions)
      ? wmInput.candidateActions
      : [];
    const threshold = wmInput.anomalyThreshold ?? DEFAULT_ANOMALY_THRESHOLD;

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      // 0. Reward learning — fold in any operator feedback from the prior cycle
      //    BEFORE ranking, so this cycle reflects the latest preferences.
      const rewardUpdates: RewardEvent[] =
        Array.isArray(wmInput.operatorFeedback) && wmInput.operatorFeedback.length > 0
          ? this.rewardStore.applyBatch(wmInput.operatorFeedback)
          : [];

      // 1. Perception — governed state vector from raw telemetry.
      const stateVector: StateVector = buildStateVector(telemetry, { anomalyThreshold: threshold });

      // 2. Imagination + reward weighting — simulate and rank candidates.
      const rankedActions = this.rankCandidates(stateVector, candidates);

      // 3. Action — top candidate becomes an HIL-gated proposal (or none).
      const selectedProposal = this.buildProposal(rankedActions, candidates);

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          stateVector,
          rankedActions,
          selectedProposal,
          rewardUpdates,
          rewardWeights: this.rewardStore.snapshot(),
        },
        confidence: this.computeConfidence(stateVector, rankedActions),
        reasoning: this.buildReasoning(stateVector, rankedActions, selectedProposal),
        recommendations: this.buildRecommendations(stateVector, selectedProposal),
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          anomalyCount: stateVector.anomalies.length,
          candidateCount: candidates.length,
          autonomyPhase: this.config.autonomyPhase,
        },
      };

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: response,
        status: 'completed',
        duration_ms: Date.now() - startTime,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err: unknown) {
      // Fail loud (12-Rule #12): never report success on a swallowed error.
      const errorMessage = err instanceof Error ? err.message : String(err);
      const durationMs = Date.now() - startTime;
      logger.error('WorldModelLoop agent failed', { error: errorMessage });

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: null,
        status: 'error',
        error_message: errorMessage,
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return {
        agentName: this.config.name,
        result: { error: errorMessage },
        confidence: 0,
        reasoning: `World model loop failed: ${errorMessage}`,
        recommendations: ['Inspect the telemetry/candidate payload; the loop did not complete.'],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  /** Simulate every candidate, apply the learned reward weight, sort best-first. */
  private rankCandidates(state: StateVector, candidates: CandidateAction[]): RankedAction[] {
    const ranked: RankedAction[] = candidates.map((action) => {
      const sim = this.simulator.project(state, action);
      const rewardWeight = this.rewardStore.getWeight(action.type);
      return {
        ...sim,
        actionType: action.type,
        rewardWeight,
        rankScore: sim.baseScore * rewardWeight,
      };
    });

    // Highest rankScore first; ties broken by lower risk then actionId for stability.
    ranked.sort((a, b) => {
      if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore;
      if (a.projectedRisk !== b.projectedRisk) return a.projectedRisk - b.projectedRisk;
      return a.actionId.localeCompare(b.actionId);
    });
    return ranked;
  }

  /**
   * Build the HIL-gated proposal for the top action. Returns null when there is
   * no candidate or nothing scores above zero. Live mutations ALWAYS require
   * human approval; `applied` is hard-typed false so a proposal can never be
   * mistaken for a deploy.
   */
  private buildProposal(
    ranked: RankedAction[],
    candidates: CandidateAction[],
  ): ActionProposal | null {
    const top = ranked[0];
    if (!top || top.rankScore <= 0) return null;

    const action = candidates.find((c) => c.id === top.actionId);
    if (!action) return null;

    return {
      action,
      rankScore: top.rankScore,
      // Live mutations are always gated; in silent-pilot phase even a non-mutating
      // action (e.g. raising an alert) is surfaced for human confirmation. Either
      // way this stays a proposal — never an auto-applied change.
      requiresHumanApproval: true,
      applied: false,
      rationale:
        `Top-ranked action '${action.type}' (score ${top.rankScore.toFixed(2)} = ` +
        `base ${top.baseScore.toFixed(2)} × reward weight ${top.rewardWeight.toFixed(2)}). ` +
        `${top.note} Awaiting human/KYA approval before any execution.`,
    };
  }

  private computeConfidence(state: StateVector, ranked: RankedAction[]): number {
    if (ranked.length === 0) {
      // No candidate to act on. Confidence reflects perception coverage only.
      return Object.keys(state.signals).length > 0 ? 0.5 : 0.2;
    }
    // Confidence in the top recommendation = its rank score (already 0..1).
    return ranked[0].rankScore;
  }

  private buildReasoning(
    state: StateVector,
    ranked: RankedAction[],
    proposal: ActionProposal | null,
  ): string {
    const anomalyPart = state.anomalies.length
      ? `Detected ${state.anomalies.length} anomaly(ies): ${state.anomalies.join(', ')} ` +
        `(max severity ${state.maxSeverity.toFixed(2)}).`
      : `No anomalies above threshold (max severity ${state.maxSeverity.toFixed(2)}).`;
    const actionPart = proposal
      ? `Proposing '${proposal.action.type}' for human approval.`
      : ranked.length === 0
        ? 'No candidate actions supplied; perception-only cycle.'
        : 'No candidate scored above zero; recommending no action.';
    return `${anomalyPart} ${actionPart}`;
  }

  private buildRecommendations(state: StateVector, proposal: ActionProposal | null): string[] {
    const recs: string[] = [];
    if (state.anomalies.length === 0) {
      recs.push('System within nominal bands — continue monitoring.');
    } else {
      recs.push(`Review anomalies on: ${state.anomalies.join(', ')}.`);
    }
    if (proposal) {
      recs.push(
        `Approve or override the proposed '${proposal.action.type}' action (human-in-command).`,
      );
      recs.push(
        'An override is recorded as a negative reward and lowers this action type next cycle.',
      );
    }
    return recs;
  }
}
