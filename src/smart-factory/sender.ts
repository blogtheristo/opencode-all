/**
 * Smart Factory — rate-capped multi-channel sender.
 *
 * Every automated send (email, WhatsApp) reserves one slot via the atomic
 * smart_factory_reserve_send RPC BEFORE transport and releases it on failure —
 * same concurrency-safe pattern as TED outreach. LinkedIn and Facebook are
 * never auto-sent: they land in smart_factory_messages as manual_pending
 * (LinkedIn additionally in the Firehorse human-in-the-loop queue).
 *
 * All outcomes — sent, failed, manual — are persisted to smart_factory_messages.
 */

import { escapeHtml, sendEmail } from '../utils/send-email.js';
import logger from '../utils/logger.js';
import { enqueue as enqueueLinkedInDraft } from '../firehorse/linkedin-pending.js';
import { restFetch } from './supabase.js';
import type {
  CampaignConfig,
  Channel,
  DispatchSummary,
  PlannedMessage,
  SendOutcome,
} from './types.js';

/** A prospect row as loaded from smart_factory_prospects (real DB id). */
export interface ProspectRow {
  id: string;
  org_name: string;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
}

// ---------------------------------------------------------------------------
// Atomic daily cap (migration 083)
// ---------------------------------------------------------------------------

async function reserveSend(cap: number): Promise<{ success: boolean; newCount: number }> {
  const rows = await restFetch<Array<{ success: boolean; new_count: number }>>(
    'rpc/smart_factory_reserve_send',
    { method: 'POST', body: JSON.stringify({ p_cap: cap }) },
  );
  return rows[0]
    ? { success: rows[0].success, newCount: rows[0].new_count }
    : { success: false, newCount: -1 };
}

async function releaseSend(): Promise<void> {
  try {
    await restFetch('rpc/smart_factory_release_send', { method: 'POST', body: '{}' });
  } catch (err) {
    logger.warn('smart-factory: release_send RPC failed after failed send', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// ---------------------------------------------------------------------------
// Transports
// ---------------------------------------------------------------------------

export function emailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PASS);
}

export function whatsappConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

async function sendEmailChannel(msg: PlannedMessage, to: string): Promise<SendOutcome> {
  if (!emailConfigured()) {
    return { prospectId: msg.prospectId, channel: msg.channel, ok: false, status: 'failed', error: 'SMTP not configured' };
  }
  const from = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const result = await sendEmail({
    from,
    to,
    subject: msg.subject,
    html: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(msg.body)}</pre>`,
    text: msg.body,
    source: 'outreach',
  });
  if (!result.ok) {
    return { prospectId: msg.prospectId, channel: msg.channel, ok: false, status: 'failed', error: result.error };
  }
  return {
    prospectId: msg.prospectId,
    channel: msg.channel,
    ok: true,
    status: 'sent',
    providerMessageId: result.auditId,
  };
}

/** Meta WhatsApp Cloud API — text message to a phone number. */
async function sendWhatsAppChannel(msg: PlannedMessage, phone: string): Promise<SendOutcome> {
  if (!whatsappConfigured()) {
    return {
      prospectId: msg.prospectId,
      channel: msg.channel,
      ok: false,
      status: 'failed',
      error: 'WhatsApp Cloud API not configured (WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID)',
    };
  }
  const token = process.env.WHATSAPP_TOKEN || '';
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone.replace(/[^\d+]/g, ''),
        type: 'text',
        text: { preview_url: true, body: msg.body },
      }),
    });
    const payload = (await res.json().catch(() => ({}))) as {
      messages?: Array<{ id: string }>;
      error?: { message: string };
    };
    if (!res.ok) {
      return {
        prospectId: msg.prospectId,
        channel: msg.channel,
        ok: false,
        status: 'failed',
        error: payload.error?.message || `HTTP ${res.status}`,
      };
    }
    return {
      prospectId: msg.prospectId,
      channel: msg.channel,
      ok: true,
      status: 'sent',
      providerMessageId: payload.messages?.[0]?.id,
    };
  } catch (err) {
    return {
      prospectId: msg.prospectId,
      channel: msg.channel,
      ok: false,
      status: 'failed',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

async function persistMessage(campaignId: string, msg: PlannedMessage, outcome: SendOutcome): Promise<void> {
  try {
    await restFetch('smart_factory_messages', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        campaign_id: campaignId,
        prospect_id: msg.prospectId,
        channel: msg.channel,
        product_id: msg.productId,
        subject: msg.subject,
        body: msg.body,
        status: outcome.status,
        provider_message_id: outcome.providerMessageId || null,
        error: outcome.error || null,
        sent_at: outcome.status === 'sent' ? new Date().toISOString() : null,
      }),
    });
  } catch (err) {
    // Audit persistence must never break the send loop — log and continue.
    logger.error('smart-factory: failed to persist message audit row', {
      prospectId: msg.prospectId,
      channel: msg.channel,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

async function markProspectContacted(prospectId: string, channel: Channel): Promise<void> {
  try {
    await restFetch(`smart_factory_prospects?id=eq.${prospectId}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        status: 'contacted',
        last_channel: channel,
        last_contacted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (err) {
    logger.warn('smart-factory: failed to mark prospect contacted', {
      prospectId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// ---------------------------------------------------------------------------
// Dispatch loop
// ---------------------------------------------------------------------------

/**
 * Deliver one planned message to one prospect.
 * Manual channels (linkedin/facebook) never consume a cap slot.
 */
export async function deliverOne(
  campaign: CampaignConfig,
  prospect: ProspectRow,
  msg: PlannedMessage,
  summary: DispatchSummary,
): Promise<boolean> {
  summary.attempted += 1;

  // ── Human-in-the-loop channels ──────────────────────────────────────────
  if (msg.channel === 'linkedin') {
    await persistMessage(campaign.id, msg, {
      prospectId: prospect.id,
      channel: 'linkedin',
      ok: false,
      status: 'manual_pending',
      error: 'queued for human delivery (linkedin-pending)',
    });
    try {
      await enqueueLinkedInDraft({
        lead_id: prospect.id,
        linkedin_url: prospect.linkedin_url || '',
        template_id: `sf-${msg.productId || 'generic'}`,
        message: msg.body,
      });
    } catch (err) {
      // Queue is best-effort; the audit row above is authoritative.
      logger.warn('smart-factory: linkedin-pending enqueue failed', {
        prospectId: prospect.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    summary.manualQueued += 1;
    return true;
  }

  if (msg.channel === 'facebook') {
    await persistMessage(campaign.id, msg, {
      prospectId: prospect.id,
      channel: 'facebook',
      ok: false,
      status: 'manual_pending',
      error: 'Facebook DM requires prior contact — queued as manual task',
    });
    summary.manualQueued += 1;
    return true;
  }

  // ── Automated channels: reserve an atomic cap slot BEFORE transport ─────
  const reserved = await reserveSend(campaign.dailyCap);
  if (!reserved.success) {
    logger.info('smart-factory: daily cap reached', { cap: campaign.dailyCap });
    summary.capReached = true;
    return false;
  }

  let outcome: SendOutcome;
  if (msg.channel === 'email') {
    outcome = prospect.email
      ? await sendEmailChannel(msg, prospect.email)
      : { prospectId: prospect.id, channel: msg.channel, ok: false, status: 'failed', error: 'no email address on prospect' };
  } else if (msg.channel === 'whatsapp') {
    outcome = prospect.phone
      ? await sendWhatsAppChannel(msg, prospect.phone)
      : { prospectId: prospect.id, channel: msg.channel, ok: false, status: 'failed', error: 'no phone number on prospect' };
  } else {
    outcome = { prospectId: prospect.id, channel: msg.channel, ok: false, status: 'failed', error: `no transport for ${msg.channel}` };
  }

  if (!outcome.ok) {
    await releaseSend();
    summary.failed += 1;
  } else {
    summary.sent[msg.channel] += 1;
    await markProspectContacted(prospect.id, msg.channel);
  }
  await persistMessage(campaign.id, msg, outcome);

  return !summary.capReached;
}
