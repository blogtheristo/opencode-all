/**
 * Unit test for the named-ticket ID convention (src/temporal/ticket-id.ts).
 * See docs/dws-use-cases.md's naming-convention note — every Activity ID
 * and Workflow ID in src/temporal/ is built with ticketId(domain, key).
 */
import { describe, expect, it } from 'vitest';
import { ticketId } from '../temporal/ticket-id.js';

describe('temporal/ticket-id', () => {
  it('joins domain and business key with a dash', () => {
    expect(ticketId('email', 'report-s1-2026-09')).toBe('email-report-s1-2026-09');
    expect(ticketId('ted', '2026-S-038-123456')).toBe('ted-2026-S-038-123456');
    expect(ticketId('approval', 'outreach-s1-123')).toBe('approval-outreach-s1-123');
  });

  it('keeps domains distinct even when business keys collide', () => {
    const key = 'p1';
    expect(ticketId('social', key)).not.toBe(ticketId('agent-loop', key));
  });
});
