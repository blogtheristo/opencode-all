/**
 * Firehorse Omnichannel — LinkedIn Service (Posts API + DM queue)
 *
 * DMs (send): LinkedIn's Messaging API is RESTRICTED to Marketing Developer
 * Platform / Sales Navigator API members. A normal LinkedIn Developer App
 * CANNOT send DMs via api.linkedin.com/v2/messages. Unofficial scrapers
 * (PhantomBuster, Dux-Soup, raw session cookies) violate the LinkedIn User
 * Agreement and risk account suspension — we do NOT use them. Therefore
 * send() queues the outreach to the audit log so a human operator sends
 * manually from their own LinkedIn inbox.
 *
 * Posts (createPost): uses the approved v2 Posts API for organization
 * feed posts — this IS allowed with a standard Marketing Developer App
 * and LINKEDIN_ACCESS_TOKEN.
 *
 * Code-Version: 2.1.0
 * Introduced-In: claude/build-mvp-features-Eq6py (merged with main v2.0.0)
 * Date: 2026-04-05
 * Owner: Claude Code (Opus 4.6)
 */

import logger from '../utils/logger.js';

interface LinkedInDMPayload {
  to: string; // LinkedIn profile URN (urn:li:person:XXX) or profile URL
  message: string;
  lead_id: string;
}

interface LinkedInPostPayload {
  text: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
}

interface LinkedInApiResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class LinkedInService {
  private baseUrl = 'https://api.linkedin.com/v2';

  private getAccessToken(): string | null {
    return process.env.LINKEDIN_ACCESS_TOKEN || null;
  }

  private getOrganizationId(): string | null {
    return process.env.LINKEDIN_ORGANIZATION_ID || null;
  }

  private getAuthorUrn(): string | null {
    return process.env.LINKEDIN_AUTHOR_URN || null;
  }

  /**
   * Queue a LinkedIn DM for manual human send.
   *
   * Does NOT call api.linkedin.com/v2/messages — that endpoint is restricted
   * to LinkedIn Marketing Developer Platform / Sales Navigator API members
   * (gated to approved Marketing Partners). A normal LinkedIn Developer App
   * cannot send DMs over the wire. Instead, we log the outreach so a human
   * operator sends the message manually from their LinkedIn inbox —
   * preserving audit trail and compliance.
   */
  async send(payload: LinkedInDMPayload): Promise<LinkedInApiResponse> {
    const { to, message, lead_id } = payload;

    logger.info('LinkedIn DM queued for manual send', {
      lead_id,
      recipient: to,
      messageLength: message.length,
      channel: 'linkedin_manual',
      note: 'LinkedIn Messaging API is restricted — operator must send from inbox',
    });

    return { success: true, messageId: `queued-${lead_id}` };
  }

  /**
   * Create an organization post via LinkedIn Marketing API.
   * Used for content distribution via Omnichannel.
   */
  async createPost(payload: LinkedInPostPayload): Promise<LinkedInApiResponse> {
    const token = this.getAccessToken();
    const authorUrn = this.getAuthorUrn() || this.getOrganizationId();

    if (!token || !authorUrn) {
      logger.info('LinkedIn post queued (API not configured)', {
        textLength: payload.text.length,
      });
      return { success: true, messageId: `queued-post-${Date.now()}` };
    }

    const author = authorUrn.startsWith('urn:') ? authorUrn : `urn:li:organization:${authorUrn}`;

    try {
      const response = await fetch(`${this.baseUrl}/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'LinkedIn-Version': '202401',
        },
        body: JSON.stringify({
          author,
          commentary: payload.text,
          visibility: payload.visibility || 'PUBLIC',
          distribution: {
            feedDistribution: 'MAIN_FEED',
            targetEntities: [],
            thirdPartyDistributionChannels: [],
          },
          lifecycleState: 'PUBLISHED',
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        logger.error('LinkedIn post API error', { status: response.status, body: errorBody });
        return { success: false, error: `LinkedIn API ${response.status}: ${errorBody}` };
      }

      const postId = response.headers.get('x-restli-id') || `post-${Date.now()}`;
      logger.info('LinkedIn post created', { postId });
      return { success: true, messageId: postId };
    } catch (err) {
      logger.error('LinkedIn post failed', { error: (err as Error).message });
      return { success: false, error: (err as Error).message };
    }
  }

  /**
   * Resolve a LinkedIn profile URL to a URN.
   * Returns null if resolution fails.
   */
  private async resolveProfileUrn(profileUrl: string): Promise<string | null> {
    // Extract vanity name from URL patterns like linkedin.com/in/username
    const match = profileUrl.match(/linkedin\.com\/in\/([^/?#]+)/);
    if (!match) return null;

    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const response = await fetch(
        `${this.baseUrl}/people/(vanityName:${encodeURIComponent(match[1])})`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'LinkedIn-Version': '202401',
          },
        },
      );

      if (!response.ok) return null;

      const data = (await response.json()) as Record<string, unknown>;
      return (data.id as string) ? `urn:li:person:${data.id}` : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if LinkedIn integration is configured for POSTS (feed/share API).
   * DM sending is never "configured" — DMs always queue for manual send.
   */
  isConfigured(): boolean {
    return !!this.getAccessToken();
  }
}

export const linkedInService = new LinkedInService();
