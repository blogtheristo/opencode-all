/**
 * Unit tests for Temporal Activities (src/temporal/activities/*).
 *
 * Activities are plain async functions — they can be exercised directly
 * without a running Temporal server. What's under test here is the wrapper
 * logic (error → ApplicationFailure classification, idempotent transforms),
 * not the Temporal runtime itself, which needs a live server to verify.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApplicationFailure } from '@temporalio/activity';

vi.mock('../utils/send-email.js', () => ({
  sendEmail: vi.fn(),
  escapeHtml: (s: string) => s,
}));

vi.mock('../social-scheduler/facebook-publisher.js', () => ({
  publishToFacebook: vi.fn(),
  isFacebookConfigured: vi.fn(() => true),
}));

vi.mock('../social-scheduler/x-publisher.js', () => ({
  publishToX: vi.fn(),
  isXConfigured: vi.fn(async () => true),
}));

vi.mock('../social-scheduler/queue.js', () => ({
  updatePostStatus: vi.fn(async () => true),
}));

vi.mock('../construction-leads/lead-processor.js', () => ({
  noticeToLead: vi.fn((notice: { ND: string }) => ({ tender_id: notice.ND })),
  tedEnrichLead: vi.fn((_notice: unknown, lead: unknown) => lead),
  storeLeads: vi.fn(async () => 1),
}));

vi.mock('../config/supabase.js', () => ({
  getSupabaseClient: vi.fn(),
}));

vi.mock('../services/report-export.service.js', () => ({
  default: { generateExport: vi.fn(async () => ({ data: 'report-body' })) },
}));

describe('temporal/activities/email.activities', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns ok on successful send', async () => {
    const { sendEmail } = await import('../utils/send-email.js');
    (sendEmail as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true, auditId: 'audit-1' });

    const { sendEmailActivity } = await import('../temporal/activities/email.activities.js');
    const result = await sendEmailActivity({
      from: 'a@lifetime.fi',
      to: 'b@example.com',
      subject: 'hi',
      html: '<p>hi</p>',
    });

    expect(result).toEqual({ ok: true, auditId: 'audit-1' });
  });

  it('throws a retryable ApplicationFailure on transient SMTP error', async () => {
    const { sendEmail } = await import('../utils/send-email.js');
    (sendEmail as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      error: 'connection timeout',
    });

    const { sendEmailActivity } = await import('../temporal/activities/email.activities.js');
    await expect(
      sendEmailActivity({
        from: 'a@lifetime.fi',
        to: 'b@example.com',
        subject: 'hi',
        html: '<p>hi</p>',
      }),
    ).rejects.toMatchObject({ nonRetryable: false });
  });

  it('throws a non-retryable ApplicationFailure on a hard bounce', async () => {
    const { sendEmail } = await import('../utils/send-email.js');
    (sendEmail as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      error: '550 mailbox not found',
    });

    const { sendEmailActivity } = await import('../temporal/activities/email.activities.js');
    await expect(
      sendEmailActivity({
        from: 'a@lifetime.fi',
        to: 'bad@example.com',
        subject: 'hi',
        html: '<p>hi</p>',
      }),
    ).rejects.toMatchObject({ nonRetryable: true });
  });
});

describe('temporal/activities/social.activities', () => {
  beforeEach(() => vi.clearAllMocks());

  it('publishes to facebook and updates post status', async () => {
    const { publishToFacebook } = await import('../social-scheduler/facebook-publisher.js');
    const { updatePostStatus } = await import('../social-scheduler/queue.js');
    (publishToFacebook as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      postId: 'fb-1',
      postUrl: 'https://facebook.com/fb-1',
    });

    const { publishSocialPostActivity } =
      await import('../temporal/activities/social.activities.js');
    const result = await publishSocialPostActivity({
      post: { id: 'p1' } as never,
      platform: 'facebook',
    });

    expect(result).toEqual({ success: true, postId: 'fb-1', postUrl: 'https://facebook.com/fb-1' });
    expect(updatePostStatus).toHaveBeenCalledWith(
      'p1',
      'published',
      expect.stringContaining('fb-1'),
    );
  });

  it('classifies a rejected post as non-retryable', async () => {
    const { publishToX } = await import('../social-scheduler/x-publisher.js');
    (publishToX as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: false,
      error: 'Unauthorized: token revoked',
    });

    const { publishSocialPostActivity } =
      await import('../temporal/activities/social.activities.js');
    await expect(
      publishSocialPostActivity({ post: { id: 'p2' } as never, platform: 'x' }),
    ).rejects.toMatchObject({ nonRetryable: true });
  });

  it('classifies a transient publish failure as retryable', async () => {
    const { publishToX } = await import('../social-scheduler/x-publisher.js');
    (publishToX as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: false,
      error: 'rate limited, try again',
    });

    const { publishSocialPostActivity } =
      await import('../temporal/activities/social.activities.js');
    await expect(
      publishSocialPostActivity({ post: { id: 'p3' } as never, platform: 'x' }),
    ).rejects.toMatchObject({ nonRetryable: false });
  });
});

describe('temporal/activities/ted.activities', () => {
  beforeEach(() => vi.clearAllMocks());

  it('transforms and stores a single notice', async () => {
    const { storeLeads } = await import('../construction-leads/lead-processor.js');
    const { ingestTedNoticeActivity } = await import('../temporal/activities/ted.activities.js');

    const result = await ingestTedNoticeActivity({ ND: 'notice-1' } as never);

    expect(storeLeads).toHaveBeenCalledWith([{ tender_id: 'notice-1' }]);
    expect(result).toEqual({ stored: 1 });
  });
});

describe('temporal/activities/reports.activities', () => {
  it('advanceNextRun always returns a date strictly after now for a monthly schedule', async () => {
    const { advanceNextRun } = await import('../temporal/activities/reports.activities.js');
    const stale = new Date('2020-01-01T00:00:00Z');
    const next = advanceNextRun(stale, 'monthly');
    expect(next.getTime()).toBeGreaterThan(Date.now());
  });

  it('claim fails loud when Supabase is unavailable', async () => {
    const { getSupabaseClient } = await import('../config/supabase.js');
    (getSupabaseClient as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { claimReportScheduleActivity } =
      await import('../temporal/activities/reports.activities.js');
    await expect(
      claimReportScheduleActivity({
        id: 's1',
        company_name: 'Acme',
        industry: 'construction',
        country: 'FI',
        frequency: 'monthly',
        format: 'json',
        recipient_email: 'x@example.com',
        next_run_at: new Date().toISOString(),
      }),
    ).rejects.toBeInstanceOf(ApplicationFailure);
  });
});
