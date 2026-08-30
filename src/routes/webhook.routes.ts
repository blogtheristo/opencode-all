// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/routes/webhook.routes.ts
/**
 * Webhook Routes — Inbound Email
 *
 * POST /webhooks/inbound — Receive email replies to the daily digest.
 *
 * Flow:
 *   1. Parse inbound payload
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
 *   - Sender allowlist (OUTREACH_DIGEST_EMAIL)
 *   - Idempotency via provider_message_id UNIQUE constraint
 */

import express, { type Request, type Response, type Router } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import {
  isAuthorizedSender,
  parseReplyText,
  parseSubjectCommand,
} from '../outreach/reply-parser.js';
import type { UpdateCommand } from '../outreach/reply-parser.js';

interface OutreachThreadRow {
  id: string;
  pipeline: string;
  status: string;
  person_id: string | null;
  org_id: string | null;
}
import { emailQueue } from '../services/email-queue.service.js';
import { escapeHtml, sendEmail } from '../utils/send-email.js';

const router: Router = express.Router();

// ============================================================================
// SUPABASE HELPERS
// ============================================================================

async function supabaseFetch(path: string, options: RequestInit = {}): Promise<unknown> {
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

  try {
    const result = await sendEmail({
      from: fromAddress,
      to,
      subject,
      text: body,
      html: `<pre>${escapeHtml(body)}</pre>`,
      source: 'platform',
      templateType: 'inbound_confirmation',
      metadata: { recipient: to },
    });

    if (!result.ok) {
      logger.warn('Confirmation email failed', {
        error: result.error || 'Unknown SES SMTP failure',
      });
      return;
    }

    logger.info('Confirmation email sent', {
      from: fromAddress,
      recipientCount: 1,
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
// Shared handler for inbound webhook paths
// ============================================================================

const handleInboundWebhook = async (req: Request, res: Response): Promise<void> => {
  const rawBody = JSON.stringify(req.body);

  // Extract email fields from inbound webhook payload
  // Expected: { type: "email.received", data: { from, to, subject, text, html, ... } }
  const payload = req.body;
  const eventType = payload.type;
  const data = payload.data || payload;

  // Only process email.received events (ignore delivery notifications etc.)
  if (eventType && eventType !== 'email.received') {
    res.status(200).json({ ok: true, skipped: true, reason: `Event type: ${eventType}` });
    return;
  }

  const fromEmail = data.from || '';
  const subject = data.subject || '';
  const textBody = data.text || '';
  const messageId = data.message_id || data.id || `unknown-${Date.now()}`;

  // Also push to Redis inbox stream for async processing by other consumers
  // (MCP agents, analytics, audit trail). This is fire-and-forget — the
  // webhook still processes synchronously below.
  if (emailQueue.isAvailable()) {
    emailQueue
      .enqueueInbound({
        from: fromEmail,
        to: Array.isArray(data.to) ? data.to.join(', ') : data.to || '',
        subject,
        text: textBody,
        html: data.html || '',
        messageId,
        source: 'inbound-webhook',
        rawPayload: rawBody,
      })
      .catch((err: Error) => {
        logger.debug('Failed to enqueue inbound to Redis (non-blocking)', { error: err.message });
      });
  }

  // 2. Idempotency: insert into inbound_emails. ON CONFLICT DO NOTHING.
  try {
    const existing = (await supabaseFetch(
      `inbound_emails?provider_message_id=eq.${encodeURIComponent(messageId)}&select=id&limit=1`,
    )) as unknown[];

    if (existing.length > 0) {
      logger.info('Webhook: duplicate message_id, skipping', { messageId });
      res.status(200).json({ ok: true, duplicate: true });
      return;
    }

    await supabaseFetch('inbound_emails', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        provider: 'inbound',
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
    await updateInboundEmail(messageId, {
      parse_ok: false,
      error: `Unauthorized sender: ${fromEmail}`,
    });
    await logActivity(null, 'manual_update_failed', `Unauthorized sender: ${fromEmail}`, payload);
    res.status(200).json({ ok: true, rejected: true, reason: 'Unauthorized sender' });
    return;
  }

  // 4. Parse command from first non-quoted line (fallback: subject line)
  const bodyParse = parseReplyText(textBody);
  const subjectParse = bodyParse.command
    ? { command: null, error: null }
    : parseSubjectCommand(subject);
  const command = bodyParse.command || subjectParse.command;
  const parseError = bodyParse.error || subjectParse.error;
  const parseSource = bodyParse.command ? 'body' : subjectParse.command ? 'subject' : 'none';

  if (!command || parseError) {
    logger.info('Webhook: parse failed', { error: parseError, messageId, parseSource });
    await updateInboundEmail(messageId, {
      parse_ok: false,
      error: parseError || 'No command found',
    });
    await logActivity(
      null,
      'manual_update_failed',
      `Parse failed (${parseSource}): ${parseError || 'No command found'}`,
      payload,
    );

    // Send error reply
    const senderEmail = extractEmail(fromEmail);
    if (senderEmail) {
      await sendConfirmationEmail(
        senderEmail,
        `Re: ${subject}`,
        `${parseError || 'No command found'}\n\n${ERROR_REPLY_BODY}`,
      );
    }

    res.status(200).json({ ok: true, parsed: false, error: parseError });
    return;
  }

  // 5. Lookup thread by token
  let thread: OutreachThreadRow;
  try {
    const threads = (await supabaseFetch(
      `outreach_threads?thread_token=eq.${encodeURIComponent(command.token)}&select=id,pipeline,status,person_id,org_id&limit=1`,
    )) as OutreachThreadRow[];

    if (threads.length === 0) {
      const errorMsg = `Token T:${command.token} not found`;
      logger.warn('Webhook: token not found', { token: command.token });
      await updateInboundEmail(messageId, {
        parse_ok: false,
        thread_token: command.token,
        command_line: command.raw,
        error: errorMsg,
      });
      await logActivity(null, 'manual_update_failed', errorMsg, payload);

      const senderEmail = extractEmail(fromEmail);
      if (senderEmail) {
        await sendConfirmationEmail(
          senderEmail,
          `Re: ${subject}`,
          `${errorMsg}\n\n${ERROR_REPLY_BODY}`,
        );
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
    await logActivity(thread, 'manual_update', summary, payload);

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
      parseSource,
    });

    // 9. Send confirmation email
    const senderEmail = extractEmail(fromEmail);
    if (senderEmail) {
      await sendConfirmationEmail(
        senderEmail,
        `Re: ${subject}`,
        `Updated T:${command.token} — ${summary}`,
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

    await logActivity(thread, 'manual_update_failed', errorMsg, payload);
    await updateInboundEmail(messageId, {
      parse_ok: false,
      thread_token: command.token,
      command_line: command.raw,
      error: errorMsg,
    });

    res.status(200).json({ ok: true, applied: false, error: errorMsg });
  }
};

// Primary inbound endpoint (Amazon SES inbound → SNS/HTTPS)
// ============================================================================
// INBOUND AUTH: provider token gate
//
// The From-address allowlist below is not an authentication boundary — email
// From headers are trivially spoofed. Callers (inbound-parse provider or the
// reverse proxy in front of it) must present INBOUND_WEBHOOK_TOKEN in the
// X-Inbound-Token header. Fail-closed 503 when unset, constant-time compare.
// ============================================================================

const inboundLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

function requireInboundToken(req: Request, res: Response): boolean {
  const expected = process.env.INBOUND_WEBHOOK_TOKEN;
  if (!expected) {
    logger.error('INBOUND_WEBHOOK_TOKEN not configured — rejecting inbound webhook');
    res.status(503).json({ error: 'Inbound webhook auth not configured' });
    return false;
  }
  const provided = req.headers['x-inbound-token'];
  if (
    typeof provided !== 'string' ||
    provided.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
  ) {
    logger.warn('Inbound webhook: bad token', {
      correlationId: req.headers['x-correlation-id'],
    });
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

router.post('/inbound', inboundLimiter, (req: Request, res: Response) => {
  if (!requireInboundToken(req, res)) return;
  void handleInboundWebhook(req, res);
});

// ============================================================================
// HELPERS
// ============================================================================

function extractEmail(from: string): string | null {
  const match = from.match(/<([^>]+)>/);
  return match ? match[1] : from.includes('@') ? from.trim() : null;
}

function buildUpdateFields(command: UpdateCommand, currentStatus: string): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
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
  thread: OutreachThreadRow | null,
  outcome: string,
  description: string,
  rawPayload: unknown,
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

async function updateInboundEmail(messageId: string, fields: Record<string, unknown>): Promise<void> {
  try {
    await supabaseFetch(`inbound_emails?provider_message_id=eq.${encodeURIComponent(messageId)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(fields),
    });
  } catch (err) {
    logger.error('Failed to update inbound_emails', { error: (err as Error).message });
  }
}

export default router;
