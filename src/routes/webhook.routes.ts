/**
 * Webhook Routes — Resend Inbound Email
 *
 * POST /webhooks/resend/inbound — Receive email replies to the daily digest.
 *
 * Flow:
 *   1. Verify Resend webhook signature (svix headers)
 *   2. Insert into inbound_emails (idempotent via provider_message_id UNIQUE)
 *   3. Verify sender is the authorized digest recipient
 *   4. Parse first non-quoted line for command (T:TOKEN status/next/park/pass/note)
 *   5. Lookup thread by thread_token
 *   6. Update outreach_threads fields
 *   7. Append outreach_activity (outcome: manual_update or manual_update_failed)
 *   8. Update inbound_emails record (parse_ok, thread_token, command_line)
 *   9. Send confirmation email back
 *
 * Security:
 *   - Resend webhook signature verification (RESEND_WEBHOOK_SECRET)
 *   - Sender allowlist (OUTREACH_DIGEST_EMAIL)
 *   - Idempotency via provider_message_id UNIQUE constraint
 */

import express, { Router, Request, Response } from 'express';
import logger from '../utils/logger.js';
import {
  parseReplyText,
  verifyResendSignature,
  isAuthorizedSender,
} from '../outreach/reply-parser.js';
import type { UpdateCommand } from '../outreach/reply-parser.js';

const router: Router = express.Router();

// ============================================================================
// SUPABASE HELPERS
// ============================================================================

async function supabaseFetch(path: string, options: RequestInit = {}): Promise<any> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY required');
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=representation',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body}`);
  }

  return response.json();
}

// ============================================================================
// CONFIRMATION EMAIL
// ============================================================================

async function sendConfirmationEmail(to: string, subject: string, body: string): Promise<void> {
  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    logger.warn('No RESEND_API_KEY — skipping confirmation email');
    return;
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        text: body,
      }),
    });
    logger.info('Sent confirmation email', {
      to,
      from: fromAddress,
    });
  } catch (err) {
    logger.warn('Failed to send confirmation email', { error: (err as Error).message });
  }
}

// ============================================================================
// ERROR REPLY — sent when command is invalid
// ============================================================================

const ERROR_REPLY_BODY = `Could not process your reply. Please use one of these formats:

  T:XXXXXXXX status responded
  T:XXXXXXXX next 2026-02-10 type nudge
  T:XXXXXXXX park
  T:XXXXXXXX pass
  T:XXXXXXXX note call went well

Rules:
  1) Put the token first (T:XXXX)
  2) One command per reply
  3) Only the first non-quoted line is processed

— DWS IQ 6 Outreach`;

// ============================================================================
// POST /webhooks/resend/inbound — Resend inbound email webhook
// ============================================================================

router.post('/resend/inbound', async (req: Request, res: Response) => {
  const rawBody = JSON.stringify(req.body);

  // 1. Verify Resend webhook signature — MANDATORY
  // If RESEND_WEBHOOK_SECRET is not set, reject all requests to prevent
  // unauthenticated webhook processing (security fix for finding 1.4).
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error('Webhook: RESEND_WEBHOOK_SECRET is not configured — rejecting all inbound webhooks');
    res.status(503).json({ error: 'Webhook signature verification not configured' });
    return;
  }

  const svixId = req.headers['svix-id'] as string;
  const svixTimestamp = req.headers['svix-timestamp'] as string;
  const svixSignature = req.headers['svix-signature'] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    logger.warn('Webhook: missing svix headers');
    res.status(401).json({ error: 'Missing signature headers' });
    return;
  }

  if (!verifyResendSignature(rawBody, svixId, svixTimestamp, svixSignature)) {
    logger.warn('Webhook: invalid signature');
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }

  // Extract email fields from Resend webhook payload
  // Resend format: { type: "email.received", data: { from, to, subject, text, html, ... } }
  const payload = req.body;
  const eventType = payload.type;
  const data = payload.data || payload;

    // ─── Delivery event handler ──────────────────────────────────────
  // Handle email.delivered, email.bounced, email.complained events.
  // These update email_logs.status via resend_email_id.
  const DELIVERY_EVENTS = ['email.delivered', 'email.bounced', 'email.complained'];
  if (eventType && DELIVERY_EVENTS.includes(eventType)) {
    await handleDeliveryEvent(eventType, payload);
    res.status(200).json({ ok: true, event: eventType });
    return;
  }

  // Only process email.received events for reply parsing
  if (eventType && eventType !== 'email.received') {
    res.status(200).json({ ok: true, skipped: true, reason: `Event type: ${eventType}` });
    return;
  }

  const fromEmail = data.from || '';
  const subject = data.subject || '';
  const textBody = data.text || '';
  const messageId = data.message_id || data.id || svixId || `unknown-${Date.now()}`;

  // 2. Idempotency: insert into inbound_emails. ON CONFLICT DO NOTHING.
  try {
    const existing = await supabaseFetch(
      `inbound_emails?provider_message_id=eq.${encodeURIComponent(messageId)}&select=id&limit=1`
    );

    if (existing.length > 0) {
      logger.info('Webhook: duplicate message_id, skipping', { messageId });
      res.status(200).json({ ok: true, duplicate: true });
      return;
    }

    await supabaseFetch('inbound_emails', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        provider: 'resend',
        provider_message_id: messageId,
        from_email: fromEmail,
        subject,
        raw_payload: payload,
      }),
    });
  } catch (err) {
    // If insert fails due to unique constraint, it's a duplicate
    if ((err as Error).message.includes('duplicate') || (err as Error).message.includes('409')) {
      logger.info('Webhook: duplicate message_id (constraint), skipping', { messageId });
      res.status(200).json({ ok: true, duplicate: true });
      return;
    }
    logger.error('Webhook: failed to insert inbound_emails', { error: (err as Error).message });
  }

  // 3. Verify sender
  if (!isAuthorizedSender(fromEmail)) {
    logger.warn('Webhook: unauthorized sender', { from: fromEmail });
    await updateInboundEmail(messageId, { parse_ok: false, error: `Unauthorized sender: ${fromEmail}` });
    res.status(200).json({ ok: true, rejected: true, reason: 'Unauthorized sender' });
    return;
  }

  // 4. Parse command from first non-quoted line
  const { command, error: parseError } = parseReplyText(textBody);

  if (!command || parseError) {
    logger.info('Webhook: parse failed', { error: parseError, messageId });
    await updateInboundEmail(messageId, { parse_ok: false, error: parseError || 'No command found' });

    // Send error reply
    const senderEmail = extractEmail(fromEmail);
    if (senderEmail) {
      await sendConfirmationEmail(
        senderEmail,
        `Re: ${subject}`,
        `${parseError || 'No command found'}\n\n${ERROR_REPLY_BODY}`
      );
    }

    res.status(200).json({ ok: true, parsed: false, error: parseError });
    return;
  }

  // 5. Lookup thread by token
  let thread: any;
  try {
    const threads = await supabaseFetch(
      `outreach_threads?thread_token=eq.${encodeURIComponent(command.token)}&select=id,pipeline,status,person_id,org_id&limit=1`
    );

    if (threads.length === 0) {
      const errorMsg = `Token T:${command.token} not found`;
      logger.warn('Webhook: token not found', { token: command.token });
      await updateInboundEmail(messageId, {
        parse_ok: false,
        thread_token: command.token,
        command_line: command.raw,
        error: errorMsg,
      });
      await logActivity(null, command, 'manual_update_failed', errorMsg, payload);

      const senderEmail = extractEmail(fromEmail);
      if (senderEmail) {
        await sendConfirmationEmail(senderEmail, `Re: ${subject}`, `${errorMsg}\n\n${ERROR_REPLY_BODY}`);
      }

      res.status(200).json({ ok: true, parsed: true, applied: false, error: errorMsg });
      return;
    }

    thread = threads[0];
    command.threadId = thread.id;
  } catch (err) {
    logger.error('Webhook: thread lookup failed', { error: (err as Error).message });
    res.status(500).json({ error: 'Thread lookup failed' });
    return;
  }

  // 6. Apply the update
  try {
    const updateFields = buildUpdateFields(command, thread.status);

    await supabaseFetch(`outreach_threads?id=eq.${thread.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateFields),
    });

    // 7. Append outreach_activity
    const summary = buildSummary(command);
    await logActivity(thread, command, 'manual_update', summary, payload);

    // 8. Update inbound_emails record
    await updateInboundEmail(messageId, {
      parse_ok: true,
      thread_token: command.token,
      command_line: command.raw,
    });

    logger.info('Webhook: update applied', {
      token: command.token,
      threadId: thread.id,
      action: command.action,
      status: command.status,
    });

    // 9. Send confirmation email
    const senderEmail = extractEmail(fromEmail);
    if (senderEmail) {
      await sendConfirmationEmail(
        senderEmail,
        `Re: ${subject}`,
        `Updated T:${command.token} — ${summary}`
      );
    }

    res.status(200).json({
      ok: true,
      applied: true,
      token: command.token,
      thread_id: thread.id,
      summary,
    });
  } catch (err) {
    const errorMsg = (err as Error).message;
    logger.error('Webhook: update failed', { error: errorMsg, token: command.token });

    await logActivity(thread, command, 'manual_update_failed', errorMsg, payload);
    await updateInboundEmail(messageId, {
      parse_ok: false,
      thread_token: command.token,
      command_line: command.raw,
      error: errorMsg,
    });

    res.status(200).json({ ok: true, applied: false, error: errorMsg });
  }
});

// ============================================================================
// DELIVERY EVENT HANDLER
// Updates email_logs.status when Resend fires delivery/bounce/complaint events.
// Keyed by resend_email_id (added in migration 037).
// ============================================================================

async function handleDeliveryEvent(eventType: string, payload: any): Promise<void> {
  // Resend delivery event payload: { type, data: { email_id, ... } }
  const emailId: string | undefined = payload?.data?.email_id || payload?.data?.id;

  if (!emailId) {
    logger.warn('Delivery event missing email_id', { eventType });
    return;
  }

  const statusMap: Record<string, string> = {
    'email.delivered': 'delivered',
    'email.bounced': 'bounced',
    'email.complained': 'complained',
  };

  const newStatus = statusMap[eventType];
  if (!newStatus) return;

  try {
    await supabaseFetch(
      `email_logs?resend_email_id=eq.${encodeURIComponent(emailId)}`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === 'delivered' ? { sent_at: new Date().toISOString() } : {}),
          ...(newStatus !== 'delivered' ? {
            error: eventType === 'email.bounced'
              ? (payload?.data?.bounce?.message || 'Bounced')
              : 'Spam complaint received',
          } : {}),
        }),
      }
    );
    logger.info('email_logs updated via delivery event', { emailId, status: newStatus });
  } catch (err) {
    logger.error('Failed to update email_logs on delivery event', {
      emailId,
      event: eventType,
      error: (err as Error).message,
    });
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function extractEmail(from: string): string | null {
  const match = from.match(/<([^>]+)>/);
  return match ? match[1] : from.includes('@') ? from.trim() : null;
}

function buildUpdateFields(command: UpdateCommand, currentStatus: string): Record<string, any> {
  const fields: Record<string, any> = {};
  const today = new Date().toISOString().split('T')[0];

  if (command.action === 'status' && command.status) {
    fields.status = command.status;

    // waiting_since: set when entering waiting status, clear when leaving
    const WAITING_STATUSES = ['intro_made', 'contacted'];
    if (WAITING_STATUSES.includes(command.status) && !WAITING_STATUSES.includes(currentStatus)) {
      fields.waiting_since = today;
    } else if (!WAITING_STATUSES.includes(command.status)) {
      fields.waiting_since = null;
    }

    // nudge_count: reset on responded/meeting_booked
    if (['responded', 'meeting_booked'].includes(command.status)) {
      fields.nudge_count = 0;
    }

    // Clear next_action_date on closed statuses
    if (['converted', 'passed', 'parked'].includes(command.status)) {
      fields.next_action_date = null;
      fields.next_action_type = null;
    }

    if (command.nextAction) {
      fields.next_action = command.nextAction;
    }
  }

  if (command.action === 'next') {
    if (command.nextActionDate) {
      fields.next_action_date = command.nextActionDate;
    }
    if (command.nextActionType) {
      fields.next_action_type = command.nextActionType;
    }
  }

  if (command.action === 'note' && command.nextAction) {
    fields.next_action = command.nextAction;
  }

  return fields;
}

function buildSummary(command: UpdateCommand): string {
  if (command.action === 'status') {
    const notes = command.nextAction ? `, next: ${command.nextAction}` : '';
    return `status=${command.status}${notes}`;
  }
  if (command.action === 'next') {
    const type = command.nextActionType ? ` type=${command.nextActionType}` : '';
    return `next_action_date=${command.nextActionDate}${type}`;
  }
  if (command.action === 'note') {
    return `note: ${command.nextAction}`;
  }
  return command.raw;
}

async function logActivity(
  thread: any | null,
  command: UpdateCommand,
  outcome: string,
  description: string,
  rawPayload: any
): Promise<void> {
  try {
    await supabaseFetch('outreach_activities', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        thread_id: thread?.id || null,
        person_id: thread?.person_id || null,
        org_id: thread?.org_id || null,
        pipeline: thread?.pipeline || 'investor',
        channel: 'email_reply',
        activity_type: 'manual_update',
        description,
        raw_payload: rawPayload,
        outcome,
        source: 'inbound',
        created_by: 'email_reply_webhook',
      }),
    });
  } catch (err) {
    logger.error('Failed to log activity', { error: (err as Error).message });
  }
}

async function updateInboundEmail(
  messageId: string,
  fields: Record<string, any>
): Promise<void> {
  try {
    await supabaseFetch(
      `inbound_emails?provider_message_id=eq.${encodeURIComponent(messageId)}`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(fields),
      }
    );
  } catch (err) {
    logger.error('Failed to update inbound_emails', { error: (err as Error).message });
  }
}

export default router;
