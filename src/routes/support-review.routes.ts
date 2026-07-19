/**
 * Support Review Routes — reviewer-only endpoints for tickets.
 *
 * Lives in a separate file from support.routes.ts so the ticket-create /
 * triage path never transitively imports send-email.ts. Only this file
 * (which is mounted at the same /api/v1/support prefix) calls sendEmail().
 *
 *   POST /api/v1/support/tickets/:id/send       — Send the agent draft (or override) to the customer
 *   POST /api/v1/support/tickets/:id/escalate   — Force escalation to a human
 *   POST /api/v1/support/tickets/:id/resolve    — Mark resolved without sending
 *
 * Code-Version: 1.0.0
 * Branch: claude/ai-native-support-workflow-1c4kO
 * Date: 2026-05-12
 * Owner: Lifetime Oy
 */

import { type Request, type Response, Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import type { SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { sendEmail } from '../utils/send-email.js';

const router = Router();

function handleValidationErrors(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: 'path' in e ? e.path : undefined,
        message: e.msg,
      })),
    });
    return true;
  }
  return false;
}

function requireSupabase(res: Response): SupabaseClient | null {
  const supabase = getSupabaseClient();
  if (!supabase) {
    res.status(503).json({ error: 'Database not configured' });
    return null;
  }
  return supabase;
}

interface TicketRow {
  id: string;
  status: string;
  from_addr: string | null;
  subject: string | null;
  agent_draft: string | null;
}

async function loadTicket(supabase: SupabaseClient, ticketId: string): Promise<TicketRow | null> {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('id, status, from_addr, subject, agent_draft')
    .eq('id', ticketId)
    .limit(1);
  if (error || !data || data.length === 0) return null;
  return data[0] as TicketRow;
}

// ============================================================
// POST /tickets/:id/send — Reviewer approves and sends
// ============================================================
const sendValidation = [
  param('id').isUUID().withMessage('Valid ticket ID required'),
  body('replyText').optional().isString().trim().isLength({ max: 50_000 }),
  body('subject').optional().isString().trim().isLength({ max: 500 }),
];

router.post(
  '/tickets/:id/send',
  authenticateToken,
  sendValidation,
  async (req: Request, res: Response): Promise<void> => {
    if (handleValidationErrors(req, res)) return;
    const supabase = requireSupabase(res);
    if (!supabase) return;

    const { id } = req.params;
    const { replyText, subject } = req.body as { replyText?: string; subject?: string };
    const reviewerId = (req as Request & { userId?: string }).userId ?? null;

    const ticket = await loadTicket(supabase, id);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }
    if (!ticket.from_addr) {
      res.status(400).json({ error: 'Ticket has no recipient address; cannot send' });
      return;
    }

    const body = replyText && replyText.trim().length > 0 ? replyText : ticket.agent_draft;
    if (!body || body.trim().length === 0) {
      res
        .status(400)
        .json({ error: 'No reply body — agent draft is empty and no replyText provided' });
      return;
    }

    const finalSubject =
      subject ?? (ticket.subject ? `Re: ${ticket.subject}` : 'Re: your support request');
    const escapedBody = body.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const html = `<pre style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;white-space:pre-wrap;">${escapedBody}</pre>`;

    const result = await sendEmail({
      from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
      to: ticket.from_addr,
      subject: finalSubject,
      text: body,
      html,
      source: 'platform',
      templateType: 'support_reply',
      metadata: { ticketId: ticket.id, reviewerId },
    });

    if (!result.ok) {
      logger.error('Support reply send failed', { ticketId: ticket.id, error: result.error });
      res.status(502).json({ error: result.error || 'Failed to send' });
      return;
    }

    await supabase.from('ticket_messages').insert({
      ticket_id: ticket.id,
      direction: 'out',
      channel: 'email',
      from_addr: process.env.EMAIL_FROM || 'risto@onelifetime.world',
      to_addr: ticket.from_addr,
      subject: finalSubject,
      body,
    });

    await supabase.from('ticket_events').insert({
      ticket_id: ticket.id,
      actor_type: 'human',
      actor_id: reviewerId,
      event_type: 'sent',
      payload: { usedAgentDraft: !replyText, auditId: result.auditId ?? null },
    });

    await supabase
      .from('support_tickets')
      .update({ status: 'awaiting_customer' })
      .eq('id', ticket.id);

    res.json({ ok: true, ticketId: ticket.id, auditId: result.auditId ?? null });
  },
);

// ============================================================
// POST /tickets/:id/escalate — Reviewer forces escalation
// ============================================================
const escalateValidation = [
  param('id').isUUID().withMessage('Valid ticket ID required'),
  body('reason')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('reason is required')
    .isLength({ max: 1000 }),
];

router.post(
  '/tickets/:id/escalate',
  authenticateToken,
  escalateValidation,
  async (req: Request, res: Response): Promise<void> => {
    if (handleValidationErrors(req, res)) return;
    const supabase = requireSupabase(res);
    if (!supabase) return;

    const { id } = req.params;
    const { reason } = req.body as { reason: string };
    const reviewerId = (req as Request & { userId?: string }).userId ?? null;

    const ticket = await loadTicket(supabase, id);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    const recipient = process.env.HIL_ESCALATION_EMAIL || 'risto@lifetime.fi';
    const { data: esc, error: escError } = await supabase
      .from('hil_escalations')
      .insert({
        agent_name: 'helpdesk',
        reason,
        confidence: null,
        context: {
          ticketId: ticket.id,
          from_addr: ticket.from_addr,
          subject: ticket.subject,
          manualBy: reviewerId,
        },
        channel: 'email',
        recipient,
        status: 'pending',
      })
      .select('id')
      .limit(1);

    if (escError || !esc || esc.length === 0) {
      logger.error('Manual escalation failed', { ticketId: ticket.id, error: escError?.message });
      res.status(500).json({ error: 'Failed to create escalation' });
      return;
    }

    const escalationId = esc[0].id as string;

    await supabase
      .from('support_tickets')
      .update({ status: 'awaiting_human', escalation_id: escalationId })
      .eq('id', ticket.id);

    await supabase.from('ticket_events').insert({
      ticket_id: ticket.id,
      actor_type: 'human',
      actor_id: reviewerId,
      event_type: 'escalated',
      payload: { reason, escalationId },
    });

    res.status(201).json({ ok: true, ticketId: ticket.id, escalationId });
  },
);

// ============================================================
// POST /tickets/:id/resolve — Reviewer marks resolved without sending
// ============================================================
const resolveValidation = [
  param('id').isUUID().withMessage('Valid ticket ID required'),
  body('note').optional().isString().trim().isLength({ max: 1000 }),
];

router.post(
  '/tickets/:id/resolve',
  authenticateToken,
  resolveValidation,
  async (req: Request, res: Response): Promise<void> => {
    if (handleValidationErrors(req, res)) return;
    const supabase = requireSupabase(res);
    if (!supabase) return;

    const { id } = req.params;
    const { note } = req.body as { note?: string };
    const reviewerId = (req as Request & { userId?: string }).userId ?? null;

    const ticket = await loadTicket(supabase, id);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    await supabase
      .from('support_tickets')
      .update({ status: 'resolved', resolved_at: new Date().toISOString() })
      .eq('id', ticket.id);

    await supabase.from('ticket_events').insert({
      ticket_id: ticket.id,
      actor_type: 'human',
      actor_id: reviewerId,
      event_type: 'resolved',
      payload: { note: note ?? null },
    });

    res.json({ ok: true, ticketId: ticket.id });
  },
);

export default router;
