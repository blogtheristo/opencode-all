/**
 * Inbound Ticket Service — converts inbound SES emails into support tickets.
 *
 * Polls public.inbound_emails for rows where processed_at IS NULL,
 * creates a corresponding row in public.support_tickets, links via
 * external_id = inbound_emails.id, and marks the source row processed.
 *
 * Triggered every INBOUND_TICKET_POLL_MS ms (default 30s) from app.ts.
 *
 * Design notes:
 *  - Worker, not Postgres trigger: we may later kick off the Helpdesk agent
 *    after ticket creation, which requires Node + network.
 *  - Idempotent: relies on the unique partial index on
 *    support_tickets.external_id to prevent duplicates if a row is re-polled.
 *  - Auto-responder loops are filtered out via from_addr regex.
 *
 * Code-Version: 1.0.0
 * Branch: claude/ai-native-support-workflow-1c4kO
 * Date: 2026-05-12
 * Owner: Lifetime Oy
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';

const DEFAULT_POLL_MS = 30_000;
const BATCH_SIZE = 25;

const AUTO_RESPONDER_RE =
  /(^|[<])(noreply|no-reply|mailer-daemon|postmaster|bounce|do-not-reply|donotreply)@/i;

interface InboundEmailRow {
  id: string;
  ses_message_id: string;
  received_at: string;
  from_addr: string | null;
  to_addrs: string[] | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  raw_headers: Record<string, unknown> | null;
}

function isAutoSubmitted(headers: Record<string, unknown> | null): boolean {
  if (!headers) return false;
  const v = headers['auto-submitted'] ?? headers['Auto-Submitted'];
  if (!v) return false;
  const s = String(v).toLowerCase();
  return s !== 'no';
}

function looksLikeAutoResponder(row: InboundEmailRow): boolean {
  if (row.from_addr && AUTO_RESPONDER_RE.test(row.from_addr)) return true;
  if (isAutoSubmitted(row.raw_headers)) return true;
  return false;
}

async function resolveCustomerId(
  supabase: SupabaseClient,
  fromAddr: string | null,
): Promise<string | null> {
  if (!fromAddr) return null;
  const { data, error } = await supabase
    .from('customers')
    .select('id')
    .eq('primary_contact_email', fromAddr)
    .limit(1);
  if (error || !data || data.length === 0) return null;
  return (data[0].id as string) ?? null;
}

async function markProcessed(
  supabase: SupabaseClient,
  inboundId: string,
  errorMsg: string | null = null,
): Promise<void> {
  await supabase
    .from('inbound_emails')
    .update({ processed_at: new Date().toISOString(), error: errorMsg })
    .eq('id', inboundId);
}

/** Process a single inbound email row. Returns the created ticket id, or null on skip/error. */
export async function processInboundEmail(
  supabase: SupabaseClient,
  row: InboundEmailRow,
): Promise<string | null> {
  if (looksLikeAutoResponder(row)) {
    await markProcessed(supabase, row.id, 'skipped: auto-responder');
    logger.info('Inbound email skipped (auto-responder)', {
      inboundId: row.id,
      from: row.from_addr,
    });
    return null;
  }

  const body = row.body_text || row.body_html || '(empty message)';
  const customerId = await resolveCustomerId(supabase, row.from_addr);

  const { data: inserted, error: insertError } = await supabase
    .from('support_tickets')
    .insert({
      source: 'email',
      external_id: row.id,
      customer_id: customerId,
      from_addr: row.from_addr,
      subject: row.subject,
      body,
      status: 'new',
      priority: 'normal',
    })
    .select('id')
    .limit(1);

  if (insertError) {
    if (insertError.code === '23505') {
      await markProcessed(supabase, row.id, null);
      logger.debug('Inbound email already linked to ticket (duplicate skipped)', {
        inboundId: row.id,
      });
      return null;
    }
    logger.error('Failed to create ticket from inbound email', {
      inboundId: row.id,
      error: insertError.message,
    });
    await markProcessed(supabase, row.id, `ticket-insert-failed: ${insertError.message}`);
    return null;
  }

  const ticketId = inserted?.[0]?.id as string | undefined;
  if (!ticketId) {
    await markProcessed(supabase, row.id, 'ticket-insert-no-id');
    return null;
  }

  await supabase.from('ticket_events').insert({
    ticket_id: ticketId,
    actor_type: 'system',
    actor_id: 'inbound-ticket-service',
    event_type: 'created',
    payload: {
      source: 'email',
      ses_message_id: row.ses_message_id,
      received_at: row.received_at,
      customer_resolved: !!customerId,
    },
  });

  await supabase.from('ticket_messages').insert({
    ticket_id: ticketId,
    direction: 'in',
    channel: 'email',
    from_addr: row.from_addr,
    to_addr: (row.to_addrs && row.to_addrs[0]) || null,
    subject: row.subject,
    body,
    ses_message_id: row.ses_message_id,
    sent_at: row.received_at,
  });

  await markProcessed(supabase, row.id, null);

  logger.info('Inbound email converted to ticket', {
    inboundId: row.id,
    ticketId,
    customerResolved: !!customerId,
  });

  return ticketId;
}

export class InboundTicketScheduler {
  private timer: NodeJS.Timeout | null = null;
  private inFlight = false;
  private intervalMs: number;

  constructor(intervalMs: number = DEFAULT_POLL_MS) {
    this.intervalMs = intervalMs;
  }

  start(): void {
    if (this.timer) return;
    if (process.env.INBOUND_TICKET_DISABLED === 'true') {
      logger.info('Inbound ticket scheduler disabled by env');
      return;
    }
    logger.info('Inbound ticket scheduler starting', { intervalMs: this.intervalMs });
    this.timer = setInterval(() => {
      void this.tick();
    }, this.intervalMs);
    if (this.timer.unref) this.timer.unref();
  }

  stop(): void {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
    logger.info('Inbound ticket scheduler stopped');
  }

  /** Run one polling cycle. Exported for tests / manual triggers. */
  async tick(): Promise<{ processed: number; skipped: number; errors: number }> {
    if (this.inFlight) {
      return { processed: 0, skipped: 0, errors: 0 };
    }
    this.inFlight = true;
    try {
      return await this.runOnce();
    } finally {
      this.inFlight = false;
    }
  }

  async runOnce(): Promise<{ processed: number; skipped: number; errors: number }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      logger.debug('Inbound ticket tick skipped — Supabase not configured');
      return { processed: 0, skipped: 0, errors: 0 };
    }

    const { data, error } = await supabase
      .from('inbound_emails')
      .select(
        'id, ses_message_id, received_at, from_addr, to_addrs, subject, body_text, body_html, raw_headers',
      )
      .is('processed_at', null)
      .order('received_at', { ascending: true })
      .limit(BATCH_SIZE);

    if (error) {
      logger.error('Inbound ticket poll failed', { error: error.message });
      return { processed: 0, skipped: 0, errors: 1 };
    }

    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of (data ?? []) as InboundEmailRow[]) {
      try {
        const ticketId = await processInboundEmail(supabase, row);
        if (ticketId) processed += 1;
        else skipped += 1;
      } catch (err) {
        errors += 1;
        const msg = err instanceof Error ? err.message : 'Unknown error';
        logger.error('Inbound email processing threw', { inboundId: row.id, error: msg });
        await markProcessed(supabase, row.id, `exception: ${msg}`);
      }
    }

    if (processed + skipped + errors > 0) {
      logger.info('Inbound ticket tick complete', { processed, skipped, errors });
    }

    return { processed, skipped, errors };
  }
}

export const inboundTicketScheduler = new InboundTicketScheduler(
  Number(process.env.INBOUND_TICKET_POLL_MS) || DEFAULT_POLL_MS,
);
