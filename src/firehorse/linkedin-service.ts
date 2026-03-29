/**
 * Firehorse Omnichannel — LinkedIn Marketing API Service
 *
 * Sends messages via LinkedIn Marketing API (OAuth 2.0).
 * Requires LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORGANIZATION_ID.
 *
 * Fallback: logs message to audit trail when API is not configured.
 *
 * Code-Version: 2.0.0
 * Introduced-In: PR-TBD (v1 features — LinkedIn API integration)
 * Date: 2026-03-28
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
   * Send a LinkedIn message via the Messaging API.
   * Falls back to audit logging when API is not configured.
   */
  async send(payload: LinkedInDMPayload): Promise<LinkedInApiResponse> {
    const { to, message, lead_id } = payload;
    const token = this.getAccessToken();

    if (!token) {
      logger.info('LinkedIn DM queued (API not configured)', {
        to,
        lead_id,
        messageLength: message.length,
      });
      return { success: true, messageId: `queued-${lead_id}` };
    }

    // Normalize recipient to URN format
    const recipientUrn = to.startsWith('urn:li:') ? to : await this.resolveProfileUrn(to);
    if (!recipientUrn) {
      logger.warn('Could not resolve LinkedIn profile URN', { to, lead_id });
      return { success: false, error: 'Could not resolve recipient URN' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'LinkedIn-Version': '202401',
        },
        body: JSON.stringify({
          recipients: [recipientUrn],
          body: { text: message },
          messageType: 'MEMBER_TO_MEMBER',
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        logger.error('LinkedIn API error', {
          status: response.status,
          body: errorBody,
          lead_id,
        });
        return { success: false, error: `LinkedIn API ${response.status}: ${errorBody}` };
      }

      const data = await response.json().catch(() => ({}));
      const messageId = (data as Record<string, unknown>).id as string || `sent-${Date.now()}`;

      logger.info('LinkedIn DM sent', { to: recipientUrn, lead_id, messageId });
      return { success: true, messageId };
    } catch (err) {
      logger.error('LinkedIn send failed', {
        error: (err as Error).message,
        lead_id,
      });
      return { success: false, error: (err as Error).message };
    }
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
          'Authorization': `Bearer ${token}`,
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
            'Authorization': `Bearer ${token}`,
            'LinkedIn-Version': '202401',
          },
        },
      );

      if (!response.ok) return null;

      const data = await response.json() as Record<string, unknown>;
      return (data.id as string) ? `urn:li:person:${data.id}` : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if LinkedIn integration is configured.
   */
  isConfigured(): boolean {
    return !!this.getAccessToken();
  }
}

export const linkedInService = new LinkedInService();
