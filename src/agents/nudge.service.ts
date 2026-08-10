/**
 * Nudge Service — DWS IQ 6/7 (Proactive "Act" chokepoint)
 *
 * Single entry point for creating proactive nudges. Both the signal-poller
 * (background observation) and the send_notification agent tool route through
 * here so policy is enforced in exactly one place:
 *
 *   1. Deduplication — one active nudge per (orgId, signalKey, entityId).
 *      Prevents the "nagging agent" problem when a breach persists across
 *      multiple poll intervals before a human responds.
 *   2. Rate limiting — per-agent caps (default 5/hour, 20/day), counted from
 *      the persisted nudge rows so the limit holds across horizontally-scaled
 *      instances (not just in-process memory).
 *   3. Restart-safe escalation — pending nudges carry an `escalate_at`
 *      timestamp in the database; findOverdue() lets the poller pick up
 *      timed-out nudges after a deploy/restart instead of losing setTimeout
 *      countdowns.
 *   4. Delivery — email (Amazon SES, per CLAUDE.md), Teams/Slack webhooks,
 *      and an event-bus signal for in-app handling.
 *
 * Falls back to an in-memory store when the internal Postgres pool is not
 * configured (dev/test), which keeps dedup + rate-limit working single-instance.
 */

import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import logger from '../utils/logger.js';
import { getInternalDbPool } from '../config/internal-db.js';
import { eventBus } from './event-bus.js';
import { DEFAULT_NOTIFY_CONFIG } from './autonomy.js';
import type { GateDecision, NudgeChannel, SignalTier } from './signal-catalogue.js';
import type { NotifyConfig } from './types.js';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
/** Human must respond within this window before escalation (4h per plan) */
const DEFAULT_ESCALATE_AFTER_MS = 4 * HOUR_MS;
/** Hard cap on nudge body length for "one signal, one sentence" nudge mode */
const NUDGE_BODY_MAX = 280;

export type NudgeStatus = 'pending' | 'confirmed' | 'overridden' | 'dismissed' | 'escalated';

export interface NudgeRecord {
  id: string;
  orgId: string;
  signalKey: string;
  entityId: string;
  agentName: string;
  recipientRole: string;
  tier: SignalTier;
  gateDecision: GateDecision;
  channels: NudgeChannel[];
  status: NudgeStatus;
  subject: string;
  body: string;
  actionOptions: string[];
  createdAt: string;
  escalateAt: string;
  resolvedAt?: string;
  resolution?: string;
  metadata: Record<string, unknown>;
}

export interface CreateNudgeInput {
  orgId: string;
  agentName: string;
  signalKey: string;
  /** The thing the signal is about (siteId, customerId, projectId, …) */
  entityId: string;
  recipientRole: string;
  tier: SignalTier;
  gateDecision: GateDecision;
  channels: NudgeChannel[];
  subject: string;
  body: string;
  actionOptions: string[];
  /** Per-agent rate-limit config (falls back to defaults) */
  notify?: NotifyConfig;
  escalateAfterMs?: number;
  metadata?: Record<string, unknown>;
}

export interface CreateNudgeResult {
  created: boolean;
  /** Why a nudge was NOT created, when created=false */
  reason?: 'duplicate' | 'rate_limited';
  nudgeId?: string;
  delivered?: NudgeChannel[];
}

class NudgeService {
  /** In-memory fallback store keyed by nudge id (used when Supabase absent) */
  private memStore: Map<string, NudgeRecord> = new Map();

  private getPool(): Pool | null {
    return getInternalDbPool();
  }

  /**
   * Create a nudge if it passes dedup + rate-limit, then deliver it.
   * Idempotent per (orgId, signalKey, entityId) while a nudge is pending.
   */
  async createNudge(input: CreateNudgeInput): Promise<CreateNudgeResult> {
    const notify = input.notify ?? DEFAULT_NOTIFY_CONFIG;

    // 1. Deduplicate — bail if an unresolved nudge already exists.
    const existing = await this.findPending(input.orgId, input.signalKey, input.entityId);
    if (existing) {
      logger.debug('Nudge deduplicated', {
        signalKey: input.signalKey,
        entityId: input.entityId,
        existingId: existing.id,
      });
      return { created: false, reason: 'duplicate', nudgeId: existing.id };
    }

    // 2. Rate limit — count this agent's recent nudges.
    const within = await this.countRecent(input.agentName, input.orgId);
    if (within.hour >= notify.maxPerHour || within.day >= notify.maxPerDay) {
      logger.warn('Nudge rate-limited', {
        agent: input.agentName,
        hour: within.hour,
        day: within.day,
        maxPerHour: notify.maxPerHour,
        maxPerDay: notify.maxPerDay,
      });
      return { created: false, reason: 'rate_limited' };
    }

    // 3. Persist.
    const now = Date.now();
    const record: NudgeRecord = {
      id: randomUUID(),
      orgId: input.orgId,
      signalKey: input.signalKey,
      entityId: input.entityId,
      agentName: input.agentName,
      recipientRole: input.recipientRole,
      tier: input.tier,
      gateDecision: input.gateDecision,
      channels: input.channels,
      status: 'pending',
      subject: input.subject,
      body: input.body.slice(0, NUDGE_BODY_MAX),
      actionOptions: input.actionOptions,
      createdAt: new Date(now).toISOString(),
      escalateAt: new Date(
        now + (input.escalateAfterMs ?? DEFAULT_ESCALATE_AFTER_MS),
      ).toISOString(),
      metadata: input.metadata ?? {},
    };

    await this.persist(record);

    // 4. Deliver (best-effort) + emit observability event.
    const delivered = await this.deliver(record);

    return { created: true, nudgeId: record.id, delivered };
  }

  /** Resolve a nudge in response to a human action (confirm/override/dismiss). */
  async resolveNudge(
    nudgeId: string,
    status: Exclude<NudgeStatus, 'pending'>,
    resolution?: string,
  ): Promise<boolean> {
    const resolvedAt = new Date().toISOString();
    const pool = this.getPool();
    if (pool) {
      try {
        await pool.query(
          `UPDATE agent_nudges SET status = $1, resolution = $2, resolved_at = $3
           WHERE id = $4 AND status = 'pending'`,
          [status, resolution ?? null, resolvedAt, nudgeId],
        );
        return true;
      } catch (err) {
        logger.error('Failed to resolve nudge', {
          nudgeId,
          error: err instanceof Error ? err.message : String(err),
        });
        return false;
      }
    }
    const rec = this.memStore.get(nudgeId);
    if (!rec || rec.status !== 'pending') return false;
    rec.status = status;
    rec.resolution = resolution;
    rec.resolvedAt = resolvedAt;
    return true;
  }

  /**
   * Find pending nudges whose escalation deadline has passed.
   * The poller calls this each tick so escalation survives restarts.
   */
  async findOverdue(nowMs: number = Date.now()): Promise<NudgeRecord[]> {
    const nowIso = new Date(nowMs).toISOString();
    const pool = this.getPool();
    if (pool) {
      try {
        const result = await pool.query(
          `SELECT * FROM agent_nudges WHERE status = 'pending' AND escalate_at < $1 LIMIT 100`,
          [nowIso],
        );
        return result.rows.map(rowToRecord);
      } catch (err) {
        logger.error('Failed to query overdue nudges', {
          error: err instanceof Error ? err.message : String(err),
        });
        return [];
      }
    }
    return Array.from(this.memStore.values()).filter(
      (n) => n.status === 'pending' && n.escalateAt < nowIso,
    );
  }

  /** Fetch a single nudge by id (any status), or null. */
  async getNudge(nudgeId: string): Promise<NudgeRecord | null> {
    const pool = this.getPool();
    if (pool) {
      try {
        const result = await pool.query(`SELECT * FROM agent_nudges WHERE id = $1 LIMIT 1`, [
          nudgeId,
        ]);
        return result.rows[0] ? rowToRecord(result.rows[0]) : null;
      } catch (err) {
        logger.debug('getNudge query error (treating as none)', {
          error: err instanceof Error ? err.message : String(err),
        });
        return null;
      }
    }
    return this.memStore.get(nudgeId) ?? null;
  }

  /** List pending nudges for an org (dashboard / poller dedup). */
  async listPending(orgId?: string): Promise<NudgeRecord[]> {
    const pool = this.getPool();
    if (pool) {
      try {
        const result = orgId
          ? await pool.query(
              `SELECT * FROM agent_nudges WHERE status = 'pending' AND org_id = $1 LIMIT 200`,
              [orgId],
            )
          : await pool.query(`SELECT * FROM agent_nudges WHERE status = 'pending' LIMIT 200`);
        return result.rows.map(rowToRecord);
      } catch (err) {
        logger.error('Failed to list pending nudges', {
          error: err instanceof Error ? err.message : String(err),
        });
        return [];
      }
    }
    return Array.from(this.memStore.values()).filter(
      (n) => n.status === 'pending' && (!orgId || n.orgId === orgId),
    );
  }

  // ============ PRIVATE ============

  private async findPending(
    orgId: string,
    signalKey: string,
    entityId: string,
  ): Promise<NudgeRecord | null> {
    const pool = this.getPool();
    if (pool) {
      try {
        const result = await pool.query(
          `SELECT * FROM agent_nudges
           WHERE org_id = $1 AND signal_key = $2 AND entity_id = $3 AND status = 'pending'
           LIMIT 1`,
          [orgId, signalKey, entityId],
        );
        return result.rows[0] ? rowToRecord(result.rows[0]) : null;
      } catch (err) {
        logger.debug('findPending query error (treating as none)', {
          error: err instanceof Error ? err.message : String(err),
        });
        return null;
      }
    }
    for (const n of this.memStore.values()) {
      if (
        n.orgId === orgId &&
        n.signalKey === signalKey &&
        n.entityId === entityId &&
        n.status === 'pending'
      ) {
        return n;
      }
    }
    return null;
  }

  private async countRecent(
    agentName: string,
    orgId: string,
  ): Promise<{ hour: number; day: number }> {
    const now = Date.now();
    const hourAgo = new Date(now - HOUR_MS).toISOString();
    const dayAgo = new Date(now - DAY_MS).toISOString();

    const pool = this.getPool();
    if (pool) {
      try {
        const countSql = `SELECT COUNT(*) FROM agent_nudges
           WHERE agent_name = $1 AND org_id = $2 AND created_at >= $3`;
        const [hourResult, dayResult] = await Promise.all([
          pool.query(countSql, [agentName, orgId, hourAgo]),
          pool.query(countSql, [agentName, orgId, dayAgo]),
        ]);
        return {
          hour: parseInt(hourResult.rows[0]?.count ?? '0', 10),
          day: parseInt(dayResult.rows[0]?.count ?? '0', 10),
        };
      } catch (err) {
        logger.warn('countRecent query failed (treating as zero)', {
          error: err instanceof Error ? err.message : String(err),
        });
        return { hour: 0, day: 0 };
      }
    }

    let hour = 0;
    let day = 0;
    for (const n of this.memStore.values()) {
      if (n.agentName !== agentName || n.orgId !== orgId) continue;
      if (n.createdAt >= hourAgo) hour++;
      if (n.createdAt >= dayAgo) day++;
    }
    return { hour, day };
  }

  private async persist(record: NudgeRecord): Promise<void> {
    const pool = this.getPool();
    if (pool) {
      const row = recordToRow(record);
      try {
        await pool.query(
          `INSERT INTO agent_nudges (
             id, org_id, signal_key, entity_id, agent_name, recipient_role, tier,
             gate_decision, channels, status, subject, body, action_options,
             created_at, escalate_at, resolved_at, resolution, metadata
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
          [
            row.id,
            row.org_id,
            row.signal_key,
            row.entity_id,
            row.agent_name,
            row.recipient_role,
            row.tier,
            row.gate_decision,
            row.channels,
            row.status,
            row.subject,
            row.body,
            row.action_options,
            row.created_at,
            row.escalate_at,
            row.resolved_at,
            row.resolution,
            row.metadata,
          ],
        );
      } catch (err) {
        // Unique-violation = a concurrent insert won the dedup race; tolerate it.
        logger.warn('Nudge persist failed (falling back to memory)', {
          error: err instanceof Error ? err.message : String(err),
        });
        this.memStore.set(record.id, record);
      }
      return;
    }
    this.memStore.set(record.id, record);
  }

  private async deliver(record: NudgeRecord): Promise<NudgeChannel[]> {
    const delivered: NudgeChannel[] = [];
    for (const channel of record.channels) {
      try {
        if (channel === 'email') {
          await this.deliverEmail(record);
          delivered.push('email');
        } else if (channel === 'teams' || channel === 'slack') {
          if (await this.deliverWebhook(channel, record)) delivered.push(channel);
        } else if (channel === 'in_app') {
          delivered.push('in_app'); // surfaced via the event below
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        logger.error('Nudge channel delivery failed', { channel, id: record.id, error: msg });
      }
    }

    // Observability + in-app: every nudge emits a proactive trigger event.
    await eventBus.emit({
      type: 'agent.proactive_trigger',
      source: `agent:${record.agentName}`,
      payload: {
        nudgeId: record.id,
        signalKey: record.signalKey,
        entityId: record.entityId,
        tier: record.tier,
        gateDecision: record.gateDecision,
        recipientRole: record.recipientRole,
        subject: record.subject,
        body: record.body,
        actionOptions: record.actionOptions,
      },
      priority: record.gateDecision === 'act_now' ? 'high' : 'normal',
      timestamp: new Date().toISOString(),
      orgId: record.orgId,
      sessionId: `nudge:${record.id}`,
    });

    logger.info('Nudge created', {
      id: record.id,
      agent: record.agentName,
      signalKey: record.signalKey,
      delivered,
    });
    return delivered;
  }

  private async deliverEmail(record: NudgeRecord): Promise<void> {
    const { sendEmail } = await import('../utils/send-email.js');
    const recipient = process.env.NUDGE_DEFAULT_RECIPIENT || process.env.EMAIL_FROM;
    if (!recipient) {
      logger.debug('No nudge email recipient configured — skipping email channel');
      return;
    }
    const actions = record.actionOptions.map((a) => `[${a}]`).join(' ');
    const html =
      `<p><strong>[DWS IQ] ${escapeHtml(record.subject)}</strong></p>` +
      `<p>${escapeHtml(record.body)}</p>` +
      `<p>For: ${escapeHtml(record.recipientRole)} &middot; ${actions}</p>`;
    await sendEmail({
      from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
      to: recipient,
      subject: `[DWS IQ] ${record.subject}`,
      html,
      source: 'platform',
      templateType: 'proactive_nudge',
      metadata: { nudgeId: record.id, signalKey: record.signalKey },
    });
  }

  private async deliverWebhook(channel: 'teams' | 'slack', record: NudgeRecord): Promise<boolean> {
    const url = channel === 'teams' ? process.env.TEAMS_WEBHOOK_URL : process.env.SLACK_WEBHOOK_URL;
    if (!url) {
      logger.debug(`No ${channel} webhook configured — skipping`, { id: record.id });
      return false;
    }
    const actions = record.actionOptions.map((a) => `[${a}]`).join(' ');
    const text = `*[DWS IQ] ${record.subject}*\n${record.body}\nFor: ${record.recipientRole} · ${actions}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return res.ok;
  }
}

// ============ ROW MAPPERS ============

function recordToRow(r: NudgeRecord): Record<string, unknown> {
  return {
    id: r.id,
    org_id: r.orgId,
    signal_key: r.signalKey,
    entity_id: r.entityId,
    agent_name: r.agentName,
    recipient_role: r.recipientRole,
    tier: r.tier,
    gate_decision: r.gateDecision,
    channels: r.channels,
    status: r.status,
    subject: r.subject,
    body: r.body,
    action_options: r.actionOptions,
    created_at: r.createdAt,
    escalate_at: r.escalateAt,
    resolved_at: r.resolvedAt ?? null,
    resolution: r.resolution ?? null,
    metadata: r.metadata,
  };
}

function rowToRecord(row: Record<string, any>): NudgeRecord {
  return {
    id: row.id,
    orgId: row.org_id,
    signalKey: row.signal_key,
    entityId: row.entity_id,
    agentName: row.agent_name,
    recipientRole: row.recipient_role,
    tier: row.tier,
    gateDecision: row.gate_decision,
    channels: row.channels ?? [],
    status: row.status,
    subject: row.subject,
    body: row.body,
    actionOptions: row.action_options ?? [],
    createdAt: row.created_at,
    escalateAt: row.escalate_at,
    resolvedAt: row.resolved_at ?? undefined,
    resolution: row.resolution ?? undefined,
    metadata: row.metadata ?? {},
  };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Singleton nudge service */
export const nudgeService = new NudgeService();
