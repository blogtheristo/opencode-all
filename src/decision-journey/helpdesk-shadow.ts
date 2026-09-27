// Evidence: Tool=Claude Code 2.1.281 Model=anthropic/undisclosed-by-runtime-policy Agent=claude-code-standby Date=2026-09-24
// Audit trail: git log -- src/decision-journey/helpdesk-shadow.ts
/**
 * Helpdesk shadow mode (phase P1) — the agent decides, a human executes.
 *
 * Spec: docs/plans/2026-09-24-helpdesk-bounded-decision-authority.md
 * (HIC approved the action classes A1-A4 and the order A1 -> A2 -> A3,
 * 24.09.2026). Nothing here executes an action: the agent's decision is
 * written as PATH_RECOMMENDED (payload.mode = 'shadow') and the human
 * reviewer's action is written as PATH_ACCEPTED (agrees) or PATH_REJECTED
 * (disagrees). Agreement is read from the helpdesk_shadow_agreement view.
 *
 * This module must not import src/utils/send-email.ts.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { emitEvent, isDecisionJourneyEnabled, openJourney } from './emitter.js';

export type AgentAction = 'resolve' | 'reply' | 'escalate' | 'refund' | 'plan-upgrade-suggest';
export type HumanAction = 'reply' | 'resolve' | 'escalate';
export type ActionClass = 'A1' | 'A4' | 'NOT_DELEGATED';

/** Spec §4 proposal: execution threshold above the 0.6 escalation floor. */
export const SHADOW_EXECUTION_CONFIDENCE = 0.85;

export interface ShadowDecision {
  actionClass: ActionClass;
  wouldExecute: boolean;
  gate: {
    classDelegable: boolean;
    confidenceOk: boolean;
    evidenceOk: boolean;
    customerKnown: boolean;
  };
  /** Gate checks that cannot be evaluated from current data — surfaced, never assumed. */
  unverifiedChecks: string[];
}

/**
 * Only A1 (informational) is classifiable from triage output today. A2/A3 need
 * incident and device-telemetry evidence that the agent does not load yet, so
 * they are never inferred here. Refunds are A4 (later phase).
 */
export function classifyAction(action: AgentAction): ActionClass {
  if (action === 'reply' || action === 'resolve' || action === 'plan-upgrade-suggest') return 'A1';
  if (action === 'refund') return 'A4';
  return 'NOT_DELEGATED';
}

export function shadowDecide(args: {
  action: AgentAction;
  confidence: number;
  citedPolicySources: string[];
  customerId: string | null;
}): ShadowDecision {
  const actionClass = classifyAction(args.action);
  const gate = {
    classDelegable: actionClass === 'A1',
    confidenceOk: args.confidence >= SHADOW_EXECUTION_CONFIDENCE,
    evidenceOk: args.citedPolicySources.length > 0,
    customerKnown: args.customerId !== null,
  };
  return {
    actionClass,
    wouldExecute: Object.values(gate).every(Boolean),
    gate,
    unverifiedChecks: ['vip_allowlist'],
  };
}

/**
 * Does the human reviewer's action match what the agent recommended?
 * escalate / refund mean "a human must take this": any human handling agrees.
 */
export function humanAgreesWithAgent(agent: AgentAction, human: HumanAction): boolean {
  switch (agent) {
    case 'reply':
    case 'plan-upgrade-suggest':
      return human === 'reply';
    case 'resolve':
      return human === 'resolve' || human === 'reply';
    case 'escalate':
    case 'refund':
      return true;
  }
}

const EMITTER = 'helpdesk_agent';
const SOURCE = 'helpdesk';

/**
 * Records the ticket observation and the agent's shadow decision.
 * Fail-soft: returns silently when disabled, when the ticket has no known
 * customer (no journey subject), or when a write fails (logged).
 */
export async function recordShadowRecommendation(
  supabase: SupabaseClient,
  args: {
    ticketId: string;
    ticketSource: string;
    ticketCreatedAt: string | null;
    customerId: string | null;
    action: AgentAction;
    intent: string;
    confidence: number;
    citedPolicySources: string[];
    sessionId?: string;
  },
): Promise<void> {
  if (!isDecisionJourneyEnabled()) return;
  if (!args.customerId) {
    logger.info('DecisionJourney: ticket has no known customer — shadow decision not recorded', {
      ticketId: args.ticketId,
    });
    return;
  }

  const journeyId = await openJourney(supabase, {
    title: `Support ticket ${args.ticketId.slice(0, 8)}`,
    customerId: args.customerId,
    createdBy: EMITTER,
  });
  if (!journeyId) return;

  // The customer's words stay in the erasable support_tickets row; the event
  // carries only references (no personal data in immutable rows).
  const observationEventId = await emitEvent(supabase, {
    journeyId,
    eventType: 'OBSERVATION_RECORDED',
    occurredAt: args.ticketCreatedAt ? new Date(args.ticketCreatedAt) : new Date(),
    emittedByType: 'ai',
    emittedBy: EMITTER,
    decisionBy: null,
    affectedParty: 'customer',
    sourceSystem: SOURCE,
    evidenceQuality: 'MANUAL_ENTRY',
    payload: { ticket_id: args.ticketId, channel: args.ticketSource },
    observationId: args.ticketId,
    evidenceRefs: [`support_tickets:${args.ticketId}`],
    createdBy: EMITTER,
  });
  if (!observationEventId) return;

  const decision = shadowDecide({
    action: args.action,
    confidence: args.confidence,
    citedPolicySources: args.citedPolicySources,
    customerId: args.customerId,
  });

  await emitEvent(supabase, {
    journeyId,
    eventType: 'PATH_RECOMMENDED',
    occurredAt: new Date(),
    emittedByType: 'ai',
    emittedBy: EMITTER,
    decisionBy: null,
    affectedParty: 'customer',
    sourceSystem: SOURCE,
    evidenceQuality: 'SYSTEM_CONFIRMED',
    payload: {
      mode: 'shadow',
      recommended_path: args.action,
      intent: args.intent,
      action_class: decision.actionClass,
      would_execute: decision.wouldExecute,
      gate: decision.gate,
      unverified_checks: decision.unverifiedChecks,
    },
    previousEventId: observationEventId,
    observationId: args.ticketId,
    correlationId: args.sessionId ?? null,
    confidence: args.confidence,
    evidenceRefs: args.citedPolicySources,
    createdBy: EMITTER,
  });
}

/**
 * Records the human reviewer's action against the latest open shadow
 * recommendation for the ticket. `decision_by` is the role, never a person.
 */
export async function recordHumanDecision(
  supabase: SupabaseClient,
  args: {
    ticketId: string;
    humanAction: HumanAction;
    evidenceRef: string;
    usedAgentDraft?: boolean;
  },
): Promise<void> {
  if (!isDecisionJourneyEnabled()) return;

  const { data, error } = await supabase
    .from('decision_journey_event')
    .select('event_id, journey_id, payload')
    .eq('observation_id', args.ticketId)
    .eq('event_type', 'PATH_RECOMMENDED')
    .eq('emitted_by', EMITTER)
    .order('recorded_seq', { ascending: false })
    .limit(1);
  if (error || !data || data.length === 0) {
    if (error) {
      logger.error('DecisionJourney: failed to load shadow recommendation', {
        ticketId: args.ticketId,
        error: error.message,
      });
    }
    return;
  }

  const rec = data[0] as { event_id: string; journey_id: string; payload: Record<string, unknown> };

  // Only the first human action decides; later actions on the same ticket
  // (e.g. resolve after send) must not branch the path.
  const { data: successor, error: successorError } = await supabase
    .from('decision_journey_event')
    .select('event_id')
    .eq('previous_event_id', rec.event_id)
    .limit(1);
  if (successorError) {
    logger.error('DecisionJourney: failed to check for an existing decision', {
      ticketId: args.ticketId,
      error: successorError.message,
    });
    return;
  }
  if (successor && successor.length > 0) return;
  const agentAction = rec.payload.recommended_path as AgentAction;
  const agrees = humanAgreesWithAgent(agentAction, args.humanAction);

  await emitEvent(supabase, {
    journeyId: rec.journey_id,
    eventType: agrees ? 'PATH_ACCEPTED' : 'PATH_REJECTED',
    occurredAt: new Date(),
    emittedByType: 'human',
    emittedBy: 'support_review_api',
    decisionBy: 'human_reviewer',
    affectedParty: 'customer',
    sourceSystem: SOURCE,
    evidenceQuality: 'HUMAN_CONFIRMED',
    payload: {
      mode: 'shadow',
      human_action: args.humanAction,
      agent_action: agentAction,
      used_agent_draft: args.usedAgentDraft ?? null,
    },
    previousEventId: rec.event_id,
    observationId: args.ticketId,
    evidenceRefs: [args.evidenceRef],
    createdBy: 'support_review_api',
  });
}
