/**
 * Social Scheduler — LinkedIn Publisher
 *
 * Publishes approved posts to LinkedIn via the official REST API v2.
 *
 * Required env vars:
 *   LINKEDIN_ACCESS_TOKEN   — OAuth 2.0 access token (60-day lifetime)
 *   LINKEDIN_AUTHOR_URN     — "urn:li:person:<id>" or "urn:li:organization:<id>"
 *
 * How to get credentials:
 *   1. Create a LinkedIn Developer App at https://www.linkedin.com/developers/
 *   2. Request scopes: w_member_social (personal) or w_organization_social (company page)
 *   3. Complete OAuth 2.0 flow to get the access token
 *   4. Find your URN via GET https://api.linkedin.com/v2/userinfo
 *
 * LinkedIn API docs:
 *   https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
 */

import logger from '../utils/logger.js';
import type { SocialPost } from './types.js';

const LINKEDIN_API_BASE = 'https://api.linkedin.com';
const LINKEDIN_VERSION = '202401';
const LINKEDIN_PUBLISH_TIMEOUT_MS = 45_000;
const LINKEDIN_USERINFO_TIMEOUT_MS = 15_000;

// ============================================================================
// TYPES
// ============================================================================

interface LinkedInPostBody {
  author: string;
  commentary: string;
  visibility: 'PUBLIC' | 'CONNECTIONS';
  distribution: {
    feedDistribution: 'MAIN_FEED' | 'NONE';
    targetEntities: unknown[];
    thirdPartyDistributionChannels: unknown[];
  };
  lifecycleState: 'PUBLISHED' | 'DRAFT';
  isReshareDisabledByAuthor: boolean;
}

export interface PublishResult {
  success: boolean;
  postUrn?: string;
  error?: string;
}

// ============================================================================
// PUBLISHER
// ============================================================================

/**
 * Publish a social post to LinkedIn.
 * Returns the LinkedIn post URN on success.
 */
export async function publishToLinkedIn(post: SocialPost): Promise<PublishResult> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN;

  if (!token) {
    return { success: false, error: 'LINKEDIN_ACCESS_TOKEN not set' };
  }
  if (!authorUrn) {
    return { success: false, error: 'LINKEDIN_AUTHOR_URN not set (e.g. urn:li:person:abc123)' };
  }

  const body: LinkedInPostBody = {
    author: authorUrn,
    commentary: post.content,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LINKEDIN_PUBLISH_TIMEOUT_MS);
  try {
    const response = await fetch(`${LINKEDIN_API_BASE}/rest/posts`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': LINKEDIN_VERSION,
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      // LinkedIn returns the post URN in the x-restli-id header
      const postUrn = response.headers.get('x-restli-id') ?? undefined;
      if (!postUrn) {
        logger.warn('LinkedIn publish missing post URN', { postId: post.id });
        return {
          success: false,
          error: 'LinkedIn response did not include a post URN (x-restli-id header missing)',
        };
      }
      logger.info('LinkedIn post published', { postId: post.id, postUrn });
      return { success: true, postUrn };
    }

    const errorText = await response.text();
    logger.warn('LinkedIn publish failed', {
      postId: post.id,
      status: response.status,
      error: errorText,
    });
    return {
      success: false,
      error: `HTTP ${response.status}: ${errorText}`,
    };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      logger.error('LinkedIn publish timed out', {
        postId: post.id,
        timeout_ms: LINKEDIN_PUBLISH_TIMEOUT_MS,
      });
      return {
        success: false,
        error: `LinkedIn request timed out after ${LINKEDIN_PUBLISH_TIMEOUT_MS / 1000}s`,
      };
    }
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('LinkedIn publish error', { postId: post.id, error: msg });
    return { success: false, error: msg };
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================================
// CONFIGURATION CHECK
// ============================================================================

export function isLinkedInConfigured(): boolean {
  return !!(process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_AUTHOR_URN);
}

/**
 * Validate the LinkedIn access token by calling the userinfo endpoint.
 * Returns the LinkedIn profile ID on success, null on failure.
 */
export async function validateLinkedInToken(): Promise<{ id: string; name: string } | null> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LINKEDIN_USERINFO_TIMEOUT_MS);
  try {
    const response = await fetch(`${LINKEDIN_API_BASE}/v2/userinfo`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { sub: string; name: string };
    return { id: data.sub, name: data.name };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
