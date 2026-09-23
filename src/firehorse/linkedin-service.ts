/**
 * Firehorse Omnichannel — LinkedIn Service
 *
 * Posts: LinkedIn UGC API (`POST /v2/ugcPosts`) with `LINKEDIN_ACCESS_TOKEN` and
 * `LINKEDIN_AUTHOR_URN` (person or organization). Matches `social-scheduler/publisher.ts`.
 *
 * Uses `/v2/ugcPosts` (plain UTF-8 commentary) instead of `/rest/posts` little-text,
 * so Finnish/Swedish letters (ä ö å) and natural punctuation publish without truncation.
 *
 * DMs: LinkedIn Messaging API is restricted to Marketing Developer Platform partners.
 * `send()` records intent and returns a queued id — a human sends from their inbox.
 *
 * Code-Version: 2.3.0
 * Date: 2026-09-23
 */

import logger from '../utils/logger.js';
import { normalizeLinkedInText } from '../utils/linkedin-text.js';

/** Cap outbound LinkedIn REST calls so omnichannel loops cannot hang indefinitely */
const LINKEDIN_POST_TIMEOUT_MS = 45_000;
const LINKEDIN_API_BASE = 'https://api.linkedin.com';
/** Verified working for w_member_social; plain text (Unicode), not little-text. */
const LINKEDIN_POST_ENDPOINT = '/v2/ugcPosts';

// ============================================================================
// TYPES
// ============================================================================

export interface LinkedInDMPayload {
  to: string;
  message: string;
  lead_id: string;
}

export interface LinkedInSharePayload {
  /** Post text (link appended when `url` is set and not already in text) */
  text: string;
  url?: string;
  content_id?: string;
}

export interface LinkedInShareResult {
  success: boolean;
  post_id?: string;
  error?: string;
  dry_run: boolean;
}

export interface LinkedInApiResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============================================================================
// SERVICE
// ============================================================================

class LinkedInService {
  private get accessToken(): string | undefined {
    return process.env.LINKEDIN_ACCESS_TOKEN;
  }

  private get authorUrn(): string | undefined {
    return process.env.LINKEDIN_AUTHOR_URN;
  }

  /**
   * Resolve author URN: explicit `LINKEDIN_AUTHOR_URN`, or
   * `urn:li:organization:{LINKEDIN_ORGANIZATION_ID}` when only org id is set.
   */
  private resolveAuthorUrn(): string | undefined {
    if (this.authorUrn) return this.authorUrn;
    const orgId = process.env.LINKEDIN_ORGANIZATION_ID?.trim();
    if (!orgId) return undefined;
    if (orgId.startsWith('urn:')) return orgId;
    return `urn:li:organization:${orgId}`;
  }

  /**
   * True when feed posts can be published (token + author).
   */
  isShareConfigured(): boolean {
    return !!(this.accessToken && this.resolveAuthorUrn());
  }

  /**
   * Backwards-compatible alias for callers that checked “any post capability”.
   */
  isConfigured(): boolean {
    return this.isShareConfigured();
  }

  /**
   * Queue a LinkedIn DM for manual human send (Messaging API not available on standard apps).
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
   * Publish a public share to the member or organization feed via Posts API.
   * When `LINKEDIN_ACCESS_TOKEN` or author identity (`LINKEDIN_AUTHOR_URN` or
   * `LINKEDIN_ORGANIZATION_ID`) is missing, returns success with `dry_run: true` so pipelines keep working.
   */
  async sharePost(payload: LinkedInSharePayload): Promise<LinkedInShareResult> {
    const { text, url, content_id } = payload;
    let commentary = normalizeLinkedInText(text);
    if (url && !commentary.includes(url)) {
      commentary = `${commentary}\n\n${url}`;
    }

    const author = this.resolveAuthorUrn();

    if (!this.accessToken || !author) {
      const missing: string[] = [];
      if (!this.accessToken) missing.push('LINKEDIN_ACCESS_TOKEN');
      if (!author) {
        missing.push('LINKEDIN_AUTHOR_URN or LINKEDIN_ORGANIZATION_ID');
      }
      logger.info(`LinkedIn: dry-run share (not configured — missing: ${missing.join(', ')})`, {
        content_id,
        text_length: commentary.length,
        has_url: !!url,
        missing_env: missing,
        has_access_token: !!this.accessToken,
        has_author_urn: !!this.authorUrn,
        has_organization_id: !!process.env.LINKEDIN_ORGANIZATION_ID?.trim(),
      });
      return { success: true, dry_run: true };
    }

    // Same payload shape as social-scheduler/publisher.ts (ugcPosts = plain UTF-8).
    const body = {
      author,
      lifecycleState: 'PUBLISHED' as const,
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: commentary },
          shareMediaCategory: 'NONE' as const,
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' as const,
      },
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), LINKEDIN_POST_TIMEOUT_MS);
    try {
      const response = await fetch(`${LINKEDIN_API_BASE}${LINKEDIN_POST_ENDPOINT}`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        logger.error('LinkedIn: share post failed', {
          content_id,
          status: response.status,
          error: errorBody,
        });
        return {
          success: false,
          dry_run: false,
          error: `LinkedIn API ${response.status}: ${errorBody}`,
        };
      }

      const data = (await response.json()) as { id?: string };
      const postId = data.id || response.headers.get('x-restli-id') || undefined;

      logger.info('LinkedIn: post shared successfully', {
        content_id,
        post_id: postId,
      });

      return { success: true, post_id: postId, dry_run: false };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        logger.error('LinkedIn: share post timed out', {
          content_id,
          timeout_ms: LINKEDIN_POST_TIMEOUT_MS,
        });
        return {
          success: false,
          dry_run: false,
          error: `LinkedIn request timed out after ${LINKEDIN_POST_TIMEOUT_MS / 1000}s`,
        };
      }
      const msg = err instanceof Error ? err.message : String(err);
      logger.error('LinkedIn: share post network error', {
        content_id,
        error: msg,
      });
      return { success: false, dry_run: false, error: msg };
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Legacy name used by earlier branches — delegates to `sharePost`.
   */
  async createPost(payload: {
    text: string;
    visibility?: 'PUBLIC' | 'CONNECTIONS';
  }): Promise<LinkedInApiResponse> {
    const r = await this.sharePost({ text: payload.text });
    if (r.dry_run) {
      return { success: true, messageId: `queued-post-${Date.now()}` };
    }
    if (r.success) {
      return { success: true, messageId: r.post_id };
    }
    return { success: false, error: r.error };
  }
}

export const linkedInService = new LinkedInService();
