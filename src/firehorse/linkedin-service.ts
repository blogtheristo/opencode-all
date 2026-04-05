/**
 * Firehorse Omnichannel - LinkedIn DM Outreach (queue only)
 *
 * IMPORTANT: LinkedIn's Messaging API is RESTRICTED.
 *
 * Direct DM sending via api.linkedin.com/v2/messages requires membership in
 * LinkedIn's Marketing Developer Platform / Sales Navigator API program,
 * which is gated to approved Marketing Partners. A normal LinkedIn Developer
 * App (even one with a valid OAuth client) CANNOT send DMs.
 *
 * Unofficial scrapers (PhantomBuster, Dux-Soup, LinkHelper, raw session
 * cookies) violate the LinkedIn User Agreement and risk account suspension.
 * We do NOT use them.
 *
 * Therefore this service does NOT attempt to send DMs over the wire. It
 * queues the outreach to a log so a human can send the message manually
 * from their own LinkedIn inbox, preserving audit trail + compliance.
 *
 * For publishing posts to LinkedIn (feed/share API), see
 * src/social-scheduler/publisher.ts — that uses the real, approved v2 API.
 *
 * Code-Version: 2.0.0
 * Introduced-In: claude/build-mvp-features-Eq6py
 */

import logger from '../utils/logger.js';

interface LinkedInDMPayload {
  to: string; // LinkedIn profile URL or member ID
  message: string;
  lead_id: string;
}

class LinkedInService {
  /**
   * Queue a LinkedIn DM for manual human send.
   *
   * Does NOT call the LinkedIn API — the Messaging API is restricted to
   * approved Marketing Partners. Instead, logs the outreach so a human
   * operator can copy the message and send it from their LinkedIn inbox.
   */
  async send(payload: LinkedInDMPayload): Promise<void> {
    const { to, message, lead_id } = payload;

    logger.info('LinkedIn DM queued for manual send', {
      lead_id,
      recipient: to,
      message_length: message.length,
      channel: 'linkedin_manual',
      note: 'LinkedIn Messaging API is restricted — operator must send from inbox',
    });
  }

  /**
   * LinkedIn DM sending is never automatically "configured" — DMs always
   * require manual human send (see class comment). Returns false so callers
   * fall back to email or skip the LinkedIn step.
   *
   * For LinkedIn feed/share posting (a different, approved API), see
   * src/social-scheduler/publisher.ts.
   */
  isConfigured(): boolean {
    return false;
  }
}

export const linkedInService = new LinkedInService();
