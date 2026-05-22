import { afterEach, describe, expect, it } from 'vitest';
import {
  isAuthorizedSender,
  parseReplyText,
  parseSubjectCommand,
} from '../outreach/reply-parser.js';

describe('outreach reply parser', () => {
  const originalDigestEmail = process.env.OUTREACH_DIGEST_EMAIL;
  const originalAllowedSenders = process.env.OUTREACH_DIGEST_ALLOWED_SENDERS;

  afterEach(() => {
    if (originalDigestEmail === undefined) {
      delete process.env.OUTREACH_DIGEST_EMAIL;
    } else {
      process.env.OUTREACH_DIGEST_EMAIL = originalDigestEmail;
    }
    if (originalAllowedSenders === undefined) {
      delete process.env.OUTREACH_DIGEST_ALLOWED_SENDERS;
    } else {
      process.env.OUTREACH_DIGEST_ALLOWED_SENDERS = originalAllowedSenders;
    }
  });

  it('parses shorthand done with punctuation', () => {
    const parsed = parseReplyText('T:YPGW53RPFQ done!');
    expect(parsed.error).toBeNull();
    expect(parsed.command).toMatchObject({
      token: 'YPGW53RPFQ',
      action: 'status',
      status: 'passed',
    });
  });

  it('parses token command from subject line', () => {
    const parsed = parseSubjectCommand('Re: Outreach Tue Apr 29 — T:YPGW53RPFQ done!');
    expect(parsed.error).toBeNull();
    expect(parsed.command).toMatchObject({
      token: 'YPGW53RPFQ',
      action: 'status',
      status: 'passed',
    });
  });

  it('authorizes default alias sender risto.anton@lifetime.fi', () => {
    delete process.env.OUTREACH_DIGEST_EMAIL;
    delete process.env.OUTREACH_DIGEST_ALLOWED_SENDERS;

    expect(isAuthorizedSender('Risto <risto.anton@lifetime.fi>')).toBe(true);
    expect(isAuthorizedSender('risto@lifetime.fi')).toBe(true);
  });

  it('authorizes sender from configurable allowlist', () => {
    process.env.OUTREACH_DIGEST_EMAIL = 'primary@example.com';
    process.env.OUTREACH_DIGEST_ALLOWED_SENDERS = 'alias1@example.com, alias2@example.com';

    expect(isAuthorizedSender('Alias 2 <alias2@example.com>')).toBe(true);
    expect(isAuthorizedSender('not-allowed@example.com')).toBe(false);
  });
});
