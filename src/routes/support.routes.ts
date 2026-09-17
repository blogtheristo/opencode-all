/**
 * Support Ticket Routes
 *
 * REST endpoints for the AI-native helpdesk ticket lifecycle.
 *
 *   POST /api/v1/support/tickets         — Create a ticket (web form OR manual dashboard)
 *   GET  /api/v1/support/tickets         — List tickets (auth)
 *   GET  /api/v1/support/tickets/:id     — Fetch a single ticket + recent events/messages (auth)
 *
 * Reviewer endpoints (POST :id/send, POST :id/escalate) live in support-review.routes.ts
 * to preserve the draft-only invariant: this file MUST NOT import send-email.ts.
 *
 * Code-Version: 1.0.0
 * Branch: claude/ai-native-support-workflow-1c4kO
 * Date: 2026-05-12
 * Owner: Lifetime Oy
 */

import { type Request, type Response, Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import type { SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js';

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

async function resolveCustomerByEmail(
  supabase: SupabaseClient,
  email: string | undefined | null,
): Promise<string | null> {
  if (!email) return null;
  const { data, error } = await supabase
    .from('customers')
    .select('id')
    .eq('primary_contact_email', email)
    .limit(1);
  if (error || !data || data.length === 0) return null;
  return data[0].id as string;
}

// ============================================================
// POST /tickets — Create a ticket from web form or manual dashboard
// ============================================================
const createTicketValidation = [
  body('subject').optional().isString().trim().isLength({ max: 500 }),
  body('body')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Body is required')
    .isLength({ max: 50_000 }),
  body('email').optional().isEmail().withMessage('Valid email required when provided'),
  body('source').optional().isIn(['web', 'manual']).withMessage('Source must be web or manual'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']),
];

router.post(
  '/tickets',
  optionalAuth,
  createTicketValidation,
  async (req: Request, res: Response): Promise<void> => {
    if (handleValidationErrors(req, res)) return;

    const supabase = requireSupabase(res);
    if (!supabase) return;

    const {
      subject,
      body: ticketBody,
      email,
      source,
      priority,
    } = req.body as {
      subject?: string;
      body: string;
      email?: string;
      source?: 'web' | 'manual';
      priority?: 'low' | 'normal' | 'high' | 'urgent';
    };

    const authUserId = (req as Request & { userId?: string }).userId;
    const authUserEmail = (req as Request & { userEmail?: string }).userEmail;

    const resolvedSource: 'web' | 'manual' = source ?? (authUserId ? 'manual' : 'web');
    const fromAddr = email ?? authUserEmail ?? null;

    if (resolvedSource === 'web' && !fromAddr) {
      res.status(400).json({ error: 'email is required for web tickets' });
      return;
    }

    const customerId = await resolveCustomerByEmail(supabase, fromAddr);

    try {
      const { data: inserted, error: insertError } = await supabase
        .from('support_tickets')
        .insert([
          {
            source: resolvedSource,
            customer_id: customerId,
            user_id: authUserId ?? null,
            from_addr: fromAddr,
            subject: subject ?? null,
            body: ticketBody,
            priority: priority ?? 'normal',
            status: 'new',
          },
        ])
        .select('id, status, source, created_at')
        .limit(1);

      if (insertError || !inserted || inserted.length === 0) {
        logger.error('Failed to create support ticket', { error: insertError });
        res.status(500).json({ error: 'Failed to create ticket' });
        return;
      }

      const ticket = inserted[0];

      await supabase.from('ticket_events').insert({
        ticket_id: ticket.id,
        actor_type: resolvedSource === 'manual' && authUserId ? 'human' : 'system',
        actor_id: authUserId ?? null,
        event_type: 'created',
        payload: { source: resolvedSource, hasSubject: !!subject },
      });

      await supabase.from('ticket_messages').insert({
        ticket_id: ticket.id,
        direction: 'in',
        channel: resolvedSource === 'web' ? 'web' : 'manual',
        from_addr: fromAddr,
        subject: subject ?? null,
        body: ticketBody,
      });

      logger.info('Support ticket created', {
        ticketId: ticket.id,
        source: resolvedSource,
        customerResolved: !!customerId,
      });

      res.status(201).json({
        ticketId: ticket.id,
        status: ticket.status,
        source: ticket.source,
        createdAt: ticket.created_at,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Unexpected error creating ticket', { error: msg });
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// ============================================================
// GET /tickets — List tickets (auth required; RLS filters by user)
// ============================================================
const listTicketsValidation = [
  query('status')
    .optional()
    .isIn(['new', 'triaged', 'awaiting_human', 'awaiting_customer', 'resolved', 'closed']),
  query('limit').optional().isInt({ min: 1, max: 200 }).toInt(),
];

router.get(
  '/tickets',
  authenticateToken,
  listTicketsValidation,
  async (req: Request, res: Response): Promise<void> => {
    if (handleValidationErrors(req, res)) return;

    const supabase = requireSupabase(res);
    if (!supabase) return;

    const { status, limit } = req.query as { status?: string; limit?: number };
    const max = Number(limit) || 50;

    try {
      let q = supabase
        .from('support_tickets')
        .select(
          'id, source, from_addr, subject, status, priority, intent_tag, agent_confidence, agent_recommendation, escalation_id, created_at, updated_at, resolved_at',
        )
        .order('created_at', { ascending: false })
        .limit(max);
      if (status) q = q.eq('status', status);

      const { data, error } = await q;
      if (error) {
        logger.error('Failed to list tickets', { error });
        res.status(500).json({ error: 'Failed to list tickets' });
        return;
      }

      res.json({ count: data?.length ?? 0, tickets: data ?? [] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Unexpected error listing tickets', { error: msg });
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// ============================================================
// GET /tickets/:id — Fetch a single ticket with events + messages
// ============================================================
const ticketIdValidation = [param('id').isUUID().withMessage('Valid ticket ID required')];

router.get(
  '/tickets/:id',
  authenticateToken,
  ticketIdValidation,
  async (req: Request, res: Response): Promise<void> => {
    if (handleValidationErrors(req, res)) return;

    const supabase = requireSupabase(res);
    if (!supabase) return;

    const { id } = req.params;

    try {
      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', id)
        .limit(1);

      if (ticketError) {
        logger.error('Failed to fetch ticket', { id, error: ticketError });
        res.status(500).json({ error: 'Failed to fetch ticket' });
        return;
      }

      if (!ticket || ticket.length === 0) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
      }

      const [{ data: events }, { data: messages }] = await Promise.all([
        supabase
          .from('ticket_events')
          .select('id, actor_type, actor_id, event_type, payload, created_at')
          .eq('ticket_id', id)
          .order('created_at', { ascending: true })
          .limit(200),
        supabase
          .from('ticket_messages')
          .select('id, direction, channel, from_addr, to_addr, subject, body, sent_at')
          .eq('ticket_id', id)
          .order('sent_at', { ascending: true })
          .limit(200),
      ]);

      res.json({
        ticket: ticket[0],
        events: events ?? [],
        messages: messages ?? [],
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Unexpected error fetching ticket', { error: msg });
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

export default router;
