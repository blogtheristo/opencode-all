/**
 * Nudge Response Handler — DWS IQ 6/7
 *
 * Maps a human's response to a proactive nudge (the [Confirm] / [Override] /
 * [More detail] or [View Analysis] / [Dismiss] buttons) onto a resolution and
 * the follow-up action:
 *
 *   - confirm:  human approves → agent may proceed with the recommended action
 *   - override: human rejects  → logged to the audit trail, agent does NOT act
 *   - dismiss:  acknowledge an anomaly with no binary action
 *   - more_detail / investigate: re-run deeper analysis (no resolution yet)
 *
 * Webhook adapters (Teams/Slack button callbacks) call `handleResponse` after
 * normalizing the raw action string via `normalizeAction`.
 */

import logger from '../utils/logger.js';
import { eventBus } from './event-bus.js';
import { nudgeService } from './nudge.service.js';

export type NudgeAction = 'confirm' | 'override' | 'dismiss' | 'investigate';

/** Map a raw button label to a normalized action. */
export function normalizeAction(raw: string): NudgeAction | null {
  const a = raw.trim().toLowerCase();
  if (a === 'confirm' || a === 'approve' || a === 'yes') return 'confirm';
  if (a === 'override' || a === 'reject' || a === 'no') return 'override';
  if (a === 'dismiss' || a === 'acknowledge' || a === 'ack') return 'dismiss';
  if (a === 'more detail' || a === 'more_detail' || a === 'view analysis' || a === 'investigate') {
    return 'investigate';
  }
  return null;
}

export interface NudgeResponseResult {
  ok: boolean;
  /** What the agent should do next */
  outcome: 'proceed' | 'halt' | 'acknowledged' | 'reanalyze' | 'unknown';
  reason?: string;
}

/**
 * Apply a human response to a nudge. Returns the outcome the caller (agent or
 * webhook) should act on.
 */
export async function handleResponse(
  nudgeId: string,
  action: NudgeAction,
  actor: { userId?: string; orgId: string },
): Promise<NudgeResponseResult> {
  switch (action) {
    case 'confirm': {
      const ok = await nudgeService.resolveNudge(
        nudgeId,
        'confirmed',
        `confirmed by ${actor.userId ?? 'user'}`,
      );
      await emitResolution(nudgeId, action, actor);
      return { ok, outcome: ok ? 'proceed' : 'unknown' };
    }
    case 'override': {
      const ok = await nudgeService.resolveNudge(
        nudgeId,
        'overridden',
        `overridden by ${actor.userId ?? 'user'}`,
      );
      // Override is the safety valve — the agent must NOT act. Always audited.
      logger.info('Nudge overridden by human', { nudgeId, userId: actor.userId });
      await emitResolution(nudgeId, action, actor);
      return { ok, outcome: 'halt', reason: 'Human override — action suppressed' };
    }
    case 'dismiss': {
      const ok = await nudgeService.resolveNudge(
        nudgeId,
        'dismissed',
        `dismissed by ${actor.userId ?? 'user'}`,
      );
      await emitResolution(nudgeId, action, actor);
      return { ok, outcome: 'acknowledged' };
    }
    case 'investigate': {
      // No resolution — the nudge stays pending while deeper analysis runs.
      await emitResolution(nudgeId, action, actor);
      return { ok: true, outcome: 'reanalyze' };
    }
    default:
      return { ok: false, outcome: 'unknown', reason: 'Unrecognized action' };
  }
}

async function emitResolution(
  nudgeId: string,
  action: NudgeAction,
  actor: { userId?: string; orgId: string },
): Promise<void> {
  await eventBus.emit({
    type: `agent.nudge_${action}`,
    source: 'nudge-response-handler',
    payload: { nudgeId, action, userId: actor.userId },
    priority: 'normal',
    timestamp: new Date().toISOString(),
    orgId: actor.orgId,
    sessionId: `nudge:${nudgeId}`,
  });
}
