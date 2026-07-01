/**
 * Signal Poller — DWS IQ 6/7 (Proactive "Observe" engine)
 *
 * Background service that continuously watches the signal catalogue, applies
 * the worth-interrupting gate, and routes breaches through the nudge service
 * (which enforces dedup + rate limits). Also sweeps the persisted nudge table
 * for items whose human-response window has lapsed and escalates them — this
 * sweep is what makes escalation survive a deploy/restart instead of relying
 * on in-memory setTimeout countdowns.
 *
 * This is the deterministic counterpart to the send_notification agent tool:
 * the tool lets a loop-based agent nudge mid-reasoning, the poller nudges from
 * scheduled observation. Both converge on nudgeService.createNudge.
 *
 * Evaluators query Supabase defensively and return [] when data/env is
 * unavailable, so the poller is safe to start in any environment.
 */

import * as cron from 'node-cron';
import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';
import { eventBus } from './event-bus.js';
import { nudgeService } from './nudge.service.js';
import {
  SIGNAL_CATALOGUE,
  evaluateGate,
  shouldNudgeNow,
  type SignalDefinition,
} from './signal-catalogue.js';

/** A concrete breach detected by an evaluator */
export interface SignalBreach {
  orgId: string;
  entityId: string;
  subject: string;
  body: string;
  /** Override the catalogue defaults for this specific breach */
  confidence?: 'high' | 'low';
  urgency?: 'high' | 'low';
  metadata?: Record<string, unknown>;
}

/** An evaluator turns "what to watch" into concrete breaches */
export type SignalEvaluator = (signal: SignalDefinition) => Promise<SignalBreach[]>;

const supabase = getSupabaseClient();

// ============ PRODUCTION EVALUATORS ============
// Each is defensive: returns [] on any missing table/env/error.

/** Site safety: latest score below the safe floor (60) for active sites. */
const evaluateSiteSafety: SignalEvaluator = async () => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('site_safety_scores')
      .select('org_id, site_id, safety_score, shift_active')
      .lt('safety_score', 60)
      .eq('shift_active', true)
      .limit(50);
    if (error || !data) return [];
    return data.map((r: any) => ({
      orgId: r.org_id,
      entityId: r.site_id,
      subject: `Site ${r.site_id} safety score ${r.safety_score}/100`,
      body: `Safety score ${r.safety_score}/100 during an active shift — below the safe operating floor. Recommend pausing elevated/crane work. Confirm or override?`,
      metadata: { safetyScore: r.safety_score },
    }));
  } catch {
    return [];
  }
};

/** Customer inactivity: no login for 14+ days. */
const evaluateCustomerInactive: SignalEvaluator = async () => {
  if (!supabase) return [];
  try {
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('customer_activity')
      .select('org_id, customer_id, last_login_at')
      .lt('last_login_at', cutoff)
      .limit(50);
    if (error || !data) return [];
    return data.map((r: any) => ({
      orgId: r.org_id,
      entityId: r.customer_id,
      subject: `Customer ${r.customer_id} inactive 14+ days`,
      body: `No login since ${String(r.last_login_at).slice(0, 10)}. Recommend a check-in to protect renewal. Confirm or override?`,
      metadata: { lastLoginAt: r.last_login_at },
    }));
  } catch {
    return [];
  }
};

/** Registry of evaluators by signal key. Signals without one are skipped. */
const EVALUATORS: Record<string, SignalEvaluator> = {
  site_safety_low: evaluateSiteSafety,
  customer_inactive: evaluateCustomerInactive,
};

// ============ POLLER ============

export class SignalPoller {
  private jobs: cron.ScheduledTask[] = [];

  /** Cron expressions grouped by cadence (matches catalogue checkIntervalMs). */
  private static readonly CADENCES: Array<{ cron: string; maxIntervalMs: number; label: string }> =
    [
      { cron: '*/15 * * * *', maxIntervalMs: 15 * 60_000, label: '15min' },
      { cron: '0 */4 * * *', maxIntervalMs: 4 * 60 * 60_000, label: '4h' },
      { cron: '0 6 * * *', maxIntervalMs: 24 * 60 * 60_000, label: 'daily-06:00' },
      { cron: '0 7 * * 1', maxIntervalMs: 7 * 24 * 60 * 60_000, label: 'weekly-mon-07:00' },
    ];

  /** Start cron jobs (Europe/Helsinki) + the overdue escalation sweep. */
  start(): void {
    logger.info('Starting Signal Poller...');

    for (const cadence of SignalPoller.CADENCES) {
      const job = cron.schedule(
        cadence.cron,
        async () => {
          await this.runCadence(cadence.maxIntervalMs, cadence.label);
        },
        { timezone: 'Europe/Helsinki' },
      );
      this.jobs.push(job);
    }

    // Overdue escalation sweep every 15 minutes.
    this.jobs.push(
      cron.schedule(
        '*/15 * * * *',
        async () => {
          await this.sweepOverdue();
        },
        { timezone: 'Europe/Helsinki' },
      ),
    );

    logger.info('Signal Poller started', {
      cadences: SignalPoller.CADENCES.map((c) => c.label),
      evaluators: Object.keys(EVALUATORS),
    });
  }

  stop(): void {
    for (const job of this.jobs) job.stop();
    this.jobs = [];
    logger.info('Signal Poller stopped');
  }

  /**
   * Evaluate every catalogue signal whose interval falls in this cadence band,
   * run its evaluator, apply the gate, and create nudges for real-time hits.
   * Exposed for tests and manual triggering.
   */
  async runCadence(maxIntervalMs: number, label = 'manual'): Promise<number> {
    const signals = SIGNAL_CATALOGUE.filter((s) => s.checkIntervalMs <= maxIntervalMs);
    let nudges = 0;

    for (const signal of signals) {
      const evaluator = EVALUATORS[signal.key];
      if (!evaluator) continue;

      let breaches: SignalBreach[] = [];
      try {
        breaches = await evaluator(signal);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        logger.error('Signal evaluator failed', { signal: signal.key, error: msg });
        continue;
      }

      for (const breach of breaches) {
        const confidence = breach.confidence ?? signal.confidence;
        const urgency = breach.urgency ?? signal.urgency;
        const decision = evaluateGate(confidence, urgency);
        if (!shouldNudgeNow(decision)) continue; // digest/skip handled elsewhere

        const result = await nudgeService.createNudge({
          orgId: breach.orgId,
          agentName: signal.agent,
          signalKey: signal.key,
          entityId: breach.entityId,
          recipientRole: signal.recipientRole,
          tier: signal.tier,
          gateDecision: decision,
          channels: signal.channels,
          subject: breach.subject,
          body: breach.body,
          actionOptions: signal.actionOptions,
          metadata: breach.metadata,
        });
        if (result.created) nudges++;
      }
    }

    logger.info('Signal poller cadence run complete', { cadence: label, nudges });
    return nudges;
  }

  /** Escalate pending nudges whose response window has lapsed. */
  async sweepOverdue(): Promise<number> {
    const overdue = await nudgeService.findOverdue();
    let escalated = 0;
    for (const nudge of overdue) {
      const ok = await nudgeService.resolveNudge(
        nudge.id,
        'escalated',
        'No human response within the configured window',
      );
      if (!ok) continue;
      escalated++;
      await eventBus.emit({
        type: 'agent.nudge_escalated',
        source: `agent:${nudge.agentName}`,
        payload: {
          nudgeId: nudge.id,
          signalKey: nudge.signalKey,
          entityId: nudge.entityId,
          recipientRole: nudge.recipientRole,
          subject: nudge.subject,
        },
        priority: 'high',
        timestamp: new Date().toISOString(),
        orgId: nudge.orgId,
        sessionId: `nudge:${nudge.id}`,
      });
    }
    if (escalated > 0) logger.info('Overdue nudges escalated', { escalated });
    return escalated;
  }
}

/** Singleton poller */
export const signalPoller = new SignalPoller();
