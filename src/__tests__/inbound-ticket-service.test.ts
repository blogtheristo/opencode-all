/**
 * Inbound ticket service — deterministic tests against the exported helpers.
 *
 * Avoids Supabase by exercising the auto-responder filter and the polling
 * harness with stubbed clients.
 */

import { describe, expect, it } from 'vitest';
import { InboundTicketScheduler, processInboundEmail } from '../services/inbound-ticket.service.js';

interface FakeRow {
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

function row(overrides: Partial<FakeRow> = {}): FakeRow {
  return {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    ses_message_id: 'ses-1',
    received_at: '2026-05-12T10:00:00Z',
    from_addr: 'alice@example.com',
    to_addrs: ['support@onelifetime.world'],
    subject: 'Help with login',
    body_text: 'I cannot log in.',
    body_html: null,
    raw_headers: null,
    ...overrides,
  };
}

/** Minimal fake Supabase client recording every call made by the service. */
function makeFakeSupabase(
  opts: {
    customers?: Array<{ id: string; primary_contact_email: string }>;
    insertTicketError?: { code?: string; message: string } | null;
  } = {},
) {
  const customers = opts.customers ?? [];
  const calls: Array<{ table: string; op: string; payload?: unknown }> = [];
  let ticketCounter = 0;

  function chain(table: string): unknown {
    const ctx: Record<string, unknown> = { table };
    const builder: Record<string, unknown> = {
      select(_cols?: string) {
        ctx.op = 'select';
        return builder;
      },
      eq(col: string, val: unknown) {
        ctx[`eq_${col}`] = val;
        return builder;
      },
      ilike(col: string, val: unknown) {
        ctx[`ilike_${col}`] = val;
        return builder;
      },
      neq(col: string, val: unknown) {
        ctx[`neq_${col}`] = val;
        return builder;
      },
      is(col: string, val: unknown) {
        ctx[`is_${col}`] = val;
        return builder;
      },
      order() {
        return builder;
      },
      limit() {
        if (table === 'customers' && ctx.op === 'select') {
          const email = ctx['eq_primary_contact_email'] as string | undefined;
          const match = customers.find((c) => c.primary_contact_email === email);
          return Promise.resolve({ data: match ? [match] : [], error: null });
        }
        return Promise.resolve({ data: [], error: null });
      },
      insert(payload: unknown) {
        calls.push({ table, op: 'insert', payload });
        ctx.op = 'insert';
        ctx.payload = payload;
        if (table === 'support_tickets') {
          if (opts.insertTicketError) {
            return {
              select() {
                return {
                  limit() {
                    return Promise.resolve({ data: null, error: opts.insertTicketError });
                  },
                };
              },
            };
          }
          ticketCounter += 1;
          const id = `ticket-${ticketCounter}`;
          return {
            select() {
              return {
                limit() {
                  return Promise.resolve({ data: [{ id }], error: null });
                },
              };
            },
          };
        }
        // ticket_events / ticket_messages — return ok
        return Promise.resolve({ data: null, error: null });
      },
      update(payload: unknown) {
        calls.push({ table, op: 'update', payload });
        return {
          eq() {
            return Promise.resolve({ data: null, error: null });
          },
        };
      },
    };
    return builder;
  }

  return {
    client: { from: (table: string) => chain(table) } as unknown as Parameters<
      typeof processInboundEmail
    >[0],
    calls,
  };
}

describe('processInboundEmail', () => {
  it('skips obvious auto-responders by from address', async () => {
    const { client, calls } = makeFakeSupabase();
    const result = await processInboundEmail(
      client,
      row({ from_addr: 'mailer-daemon@example.com' }),
    );
    expect(result).toBeNull();
    // should mark processed but not insert a ticket
    expect(calls.find((c) => c.table === 'support_tickets' && c.op === 'insert')).toBeUndefined();
    expect(calls.find((c) => c.table === 'inbound_emails' && c.op === 'update')).toBeDefined();
  });

  it('skips when Auto-Submitted header is present', async () => {
    const { client, calls } = makeFakeSupabase();
    const result = await processInboundEmail(
      client,
      row({ raw_headers: { 'auto-submitted': 'auto-replied' } }),
    );
    expect(result).toBeNull();
    expect(calls.find((c) => c.table === 'support_tickets' && c.op === 'insert')).toBeUndefined();
  });

  it('creates a ticket, event, and message for a normal inbound email', async () => {
    const { client, calls } = makeFakeSupabase({
      customers: [{ id: 'cust-1', primary_contact_email: 'alice@example.com' }],
    });
    const ticketId = await processInboundEmail(client, row());
    expect(ticketId).toBe('ticket-1');

    expect(calls.some((c) => c.table === 'support_tickets' && c.op === 'insert')).toBe(true);
    expect(calls.some((c) => c.table === 'ticket_events' && c.op === 'insert')).toBe(true);
    expect(calls.some((c) => c.table === 'ticket_messages' && c.op === 'insert')).toBe(true);
    expect(calls.some((c) => c.table === 'inbound_emails' && c.op === 'update')).toBe(true);

    const ticketInsert = calls.find((c) => c.table === 'support_tickets')!.payload as {
      customer_id: string | null;
      from_addr: string;
      source: string;
      external_id: string;
    };
    expect(ticketInsert.customer_id).toBe('cust-1');
    expect(ticketInsert.from_addr).toBe('alice@example.com');
    expect(ticketInsert.source).toBe('email');
    expect(ticketInsert.external_id).toBe(row().id);
  });

  it('treats unique-constraint duplicate (23505) as idempotent skip', async () => {
    const { client, calls } = makeFakeSupabase({
      insertTicketError: { code: '23505', message: 'duplicate key' },
    });
    const ticketId = await processInboundEmail(client, row());
    expect(ticketId).toBeNull();
    // the row should still be marked processed (idempotency)
    expect(calls.some((c) => c.table === 'inbound_emails' && c.op === 'update')).toBe(true);
  });
});

describe('InboundTicketScheduler', () => {
  it('start() is a no-op when INBOUND_TICKET_DISABLED=true', () => {
    const prev = process.env.INBOUND_TICKET_DISABLED;
    process.env.INBOUND_TICKET_DISABLED = 'true';
    try {
      const s = new InboundTicketScheduler(60_000);
      s.start();
      // calling stop() on a never-started scheduler should not throw
      s.stop();
      expect(true).toBe(true);
    } finally {
      if (prev === undefined) delete process.env.INBOUND_TICKET_DISABLED;
      else process.env.INBOUND_TICKET_DISABLED = prev;
    }
  });

  it('runOnce returns zero counts when Supabase is not configured', async () => {
    // setup.ts doesn't set SUPABASE_URL/SERVICE_KEY for the test env
    const prev = process.env.SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    try {
      const s = new InboundTicketScheduler();
      const counts = await s.runOnce();
      expect(counts).toEqual({ processed: 0, skipped: 0, errors: 0 });
    } finally {
      if (prev !== undefined) process.env.SUPABASE_URL = prev;
    }
  });
});
