/**
 * Unit tests for the Standalone Activity starters (src/temporal/starters/*)
 * and the shared submitStandaloneActivity/runStandaloneActivity helper.
 * Mocks the Temporal client — verifies the ID/policy/args wiring, not the
 * Temporal runtime itself (needs a live server for that).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const startMock = vi.fn(async (activity: string, options: Record<string, unknown>) => ({
  activityId: options.id as string,
  runId: 'run-1',
}));

vi.mock('../temporal/client.js', () => ({
  getTemporalClient: vi.fn(async () => ({
    activity: { start: startMock, execute: vi.fn() },
  })),
}));

describe('temporal/standalone', () => {
  beforeEach(() => vi.clearAllMocks());

  it('defaults idConflictPolicy/idReusePolicy so a resubmit joins in-flight work', async () => {
    const { submitStandaloneActivity } = await import('../temporal/standalone.js');
    await submitStandaloneActivity({
      activity: 'sendEmailActivity',
      taskQueue: 'dws-email',
      id: 'job-1',
      args: [{}],
    });

    expect(startMock).toHaveBeenCalledWith(
      'sendEmailActivity',
      expect.objectContaining({
        id: 'job-1',
        idConflictPolicy: 'USE_EXISTING',
        idReusePolicy: 'ALLOW_DUPLICATE_FAILED_ONLY',
      }),
    );
  });
});

describe('temporal/starters/email.starter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the idempotencyKey as the Activity ID', async () => {
    const { startSendEmailJob } = await import('../temporal/starters/email.starter.js');
    await startSendEmailJob({
      options: { from: 'a@lifetime.fi', to: 'b@example.com', subject: 'hi', html: '<p>hi</p>' },
      idempotencyKey: 'report-s1-2026-09',
    });

    expect(startMock).toHaveBeenCalledWith(
      'sendEmailActivity',
      expect.objectContaining({ id: 'email-report-s1-2026-09', taskQueue: 'dws-email' }),
    );
  });
});

describe('temporal/starters/social.starter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('computes a non-negative startDelay from scheduledAt', async () => {
    const { startSocialPublishJob } = await import('../temporal/starters/social.starter.js');
    const future = new Date(Date.now() + 60_000).toISOString();

    await startSocialPublishJob({
      post: { id: 'p1' } as never,
      platform: 'facebook',
      scheduledAt: future,
    });

    const call = startMock.mock.calls[0];
    expect(call[1].id).toBe('social-p1');
    expect(call[1].startDelay as number).toBeGreaterThan(0);
  });

  it('omits startDelay when no scheduledAt is given', async () => {
    const { startSocialPublishJob } = await import('../temporal/starters/social.starter.js');
    await startSocialPublishJob({ post: { id: 'p2' } as never, platform: 'x' });

    expect(startMock.mock.calls[0][1].startDelay).toBeUndefined();
  });
});

describe('temporal/starters/ted.starter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keys the job by TED notice number', async () => {
    const { startTedNoticeIngestJob } = await import('../temporal/starters/ted.starter.js');
    await startTedNoticeIngestJob({ ND: '2026-S-038-123456' } as never);

    expect(startMock).toHaveBeenCalledWith(
      'ingestTedNoticeActivity',
      expect.objectContaining({ id: 'ted-2026-S-038-123456' }),
    );
  });

  it('submits one job per notice in a batch', async () => {
    const { startTedBatchIngestJobs } = await import('../temporal/starters/ted.starter.js');
    const results = await startTedBatchIngestJobs([{ ND: 'a' } as never, { ND: 'b' } as never]);

    expect(results).toHaveLength(2);
    expect(startMock).toHaveBeenCalledTimes(2);
  });
});

describe('temporal/starters/stripe.starter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keys the job by Stripe event ID for Temporal-native dedup', async () => {
    const { startStripeEventJob } = await import('../temporal/starters/stripe.starter.js');
    await startStripeEventJob({
      eventId: 'evt_123',
      eventType: 'invoice.payment_succeeded',
      invoiceId: 'in_456',
    });

    expect(startMock).toHaveBeenCalledWith(
      'processStripeEventActivity',
      expect.objectContaining({ id: 'stripe-evt_123' }),
    );
  });
});
