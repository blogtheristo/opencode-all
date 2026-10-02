// Evidence: Tool=Claude Code 2.1.281 Model=anthropic/undisclosed-by-runtime-policy Agent=claude-code-standby Date=2026-09-24
// Audit trail: git log -- src/decision-journey/emitter.ts
/**
 * Decision Journey emitter — Phase 1 core of Active Ontology 1.5.
 *
 * Writes append-only events to public.decision_journey_event
 * (supabase/migrations/094_240926_decision_journey.sql). The database owns
 * recorded_at, evidence_strength and the hash chain; this module never
 * supplies them (placeholders are overwritten by the insert trigger).
 *
 * Off by default: DECISION_JOURNEY_SHADOW=1 enables writes. Migration 094 is
 * not applied yet, so every write is fail-soft — a failure is logged at error
 * level and never breaks the caller's workflow.
 *
 * Spec: docs/plans/2026-09-24-decision-journey-outcome-evidence.md (v1.5)
 */

import { randomUUID } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

export type EvidenceQuality =
  | 'SYSTEM_CONFIRMED'
  | 'WORKSHOP_OUTPUT'
  | 'HUMAN_CONFIRMED'
  | 'MANUAL_ENTRY'
  | 'EXTERNAL_SOURCE';

export type EmitterType = 'human' | 'ai' | 'workflow' | 'customer' | 'system';

/** Phase 1 event types written by application code. PATH_ABANDONED is system-only (DB timer). */
export type Phase1EventType =
  | 'OBSERVATION_RECORDED'
  | 'PATH_RECOMMENDED'
  | 'PATH_ACCEPTED'
  | 'PATH_REJECTED';

export interface DecisionEventInput {
  journeyId: string;
  eventType: Phase1EventType;
  occurredAt: Date;
  emittedByType: EmitterType;
  emittedBy: string;
  /** NULL means "no decision was made", not missing data. Required for accept/reject. */
  decisionBy: string | null;
  affectedParty: string;
  sourceSystem: string;
  evidenceQuality: EvidenceQuality;
  payload: Record<string, unknown>;
  previousEventId?: string | null;
  observationId?: string | null;
  correlationId?: string | null;
  confidence?: number | null;
  evidenceRefs?: string[];
  createdBy: string;
}

const SEMVER = /^[0-9]+\.[0-9]+\.[0-9]+$/;
/** Interpretation keys are rejected by the database in evidence-layer payloads (P0). */
const FORBIDDEN_PAYLOAD_KEYS = ['hypothesis', 'interpretation', 'fact'];

export function isDecisionJourneyEnabled(): boolean {
  return process.env.DECISION_JOURNEY_SHADOW === '1';
}

/** `evt_` + 32 hex chars — matches the table's event_id check. */
export function newEventId(): string {
  return `evt_${randomUUID().replace(/-/g, '')}`;
}

/**
 * Versions stamped on every event. The ontology version defaults to the
 * Active Ontology 1.5 brief; the world model version has no registry yet
 * (spec §7.3), so it must be configured — no guessed default.
 */
export function resolveVersions(): { ontology: string; worldModel: string } | null {
  const ontology = process.env.ACTIVE_ONTOLOGY_VERSION || '1.5.0';
  const worldModel = process.env.WORLD_MODEL_VERSION || '';
  if (!SEMVER.test(ontology) || !SEMVER.test(worldModel)) return null;
  return { ontology, worldModel };
}

/** Client-side mirror of the database rules, so a bad event fails before the network call. */
export function validateEvent(e: DecisionEventInput): string | null {
  const decisionTypes: Phase1EventType[] = ['PATH_ACCEPTED', 'PATH_REJECTED'];
  if (decisionTypes.includes(e.eventType) && !e.decisionBy) {
    return `${e.eventType} requires decisionBy`;
  }
  if (e.eventType === 'PATH_ACCEPTED' && (!e.evidenceRefs || e.evidenceRefs.length === 0)) {
    return 'PATH_ACCEPTED requires evidenceRefs';
  }
  const bad = Object.keys(e.payload).filter((k) => FORBIDDEN_PAYLOAD_KEYS.includes(k));
  if (bad.length > 0) {
    return `evidence-layer payload must not contain interpretation keys: ${bad.join(', ')}`;
  }
  if (
    e.confidence !== null &&
    e.confidence !== undefined &&
    (e.confidence < 0 || e.confidence > 1)
  ) {
    return 'confidence must be between 0 and 1';
  }
  if (e.occurredAt.getTime() > Date.now() + 5 * 60_000) {
    return 'occurredAt is in the future';
  }
  return null;
}

/** Opens a journey for an external customer. Returns journey_id or null (logged). */
export async function openJourney(
  supabase: SupabaseClient,
  args: { title: string; customerId: string; createdBy: string },
): Promise<string | null> {
  const { data, error } = await supabase
    .from('decision_journey')
    .insert({
      title: args.title,
      customer_id: args.customerId,
      subject_is_external: true,
      created_by: args.createdBy,
    })
    .select('journey_id')
    .limit(1);
  if (error || !data || data.length === 0) {
    logger.error('DecisionJourney: failed to open journey', { error: error?.message });
    return null;
  }
  return data[0].journey_id as string;
}

/** Appends one event. Returns event_id or null (logged, never thrown). */
export async function emitEvent(
  supabase: SupabaseClient,
  e: DecisionEventInput,
): Promise<string | null> {
  const invalid = validateEvent(e);
  if (invalid) {
    logger.error('DecisionJourney: event rejected before write', {
      eventType: e.eventType,
      reason: invalid,
    });
    return null;
  }
  const versions = resolveVersions();
  if (!versions) {
    logger.error(
      'DecisionJourney: WORLD_MODEL_VERSION (and ACTIVE_ONTOLOGY_VERSION if set) must be semver — event not written',
      { eventType: e.eventType },
    );
    return null;
  }

  const eventId = newEventId();
  const { error } = await supabase.from('decision_journey_event').insert({
    event_id: eventId,
    journey_id: e.journeyId,
    occurred_at: e.occurredAt.toISOString(),
    event_type: e.eventType,
    observation_id: e.observationId ?? null,
    emitted_by_type: e.emittedByType,
    emitted_by: e.emittedBy,
    decision_by: e.decisionBy,
    affected_party: e.affectedParty,
    source_system: e.sourceSystem,
    evidence_quality: e.evidenceQuality,
    evidence_strength: 0, // computed by trigger
    ontology_version: versions.ontology,
    world_model_version: versions.worldModel,
    confidence: e.confidence ?? null,
    payload: e.payload,
    previous_event_id: e.previousEventId ?? null,
    correlation_id: e.correlationId ?? null,
    evidence_refs: e.evidenceRefs ?? [],
    created_by: e.createdBy,
    hash: '', // computed by trigger
  });
  if (error) {
    logger.error('DecisionJourney: event write failed', {
      eventType: e.eventType,
      error: error.message,
    });
    return null;
  }
  return eventId;
}
