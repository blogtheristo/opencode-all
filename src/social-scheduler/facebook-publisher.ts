/**
 * Social Scheduler — Facebook Page Publisher
 *
 * Publishes posts to a Facebook Page via the official Graph API.
 *
 * Required env vars:
 *   FACEBOOK_PAGE_ID      — Facebook Page ID (e.g. "133022958190" for Lifetime Group)
 *   FACEBOOK_PAGE_TOKEN   — Page Access Token with pages_manage_posts permission
 *
 * How to get credentials:
 *   1. Create a Facebook App at https://developers.facebook.com/
 *   2. Add the "pages_manage_posts" permission
 *   3. Generate a Page Access Token for the target Page (Lifetime Group)
 *   4. The token can be exchanged for a long-lived token via
 *      GET /oauth/access_token?grant_type=fb_exchange_token&client_id=<app>&client_secret=<appsecret>&fb_exchange_token=<token>
 *
 * Facebook Graph API docs:
 *   https://developers.facebook.com/docs/graph-api/reference/page/feed
 */

import type { SocialPost } from './types.js';

const FB_API_BASE = 'https://graph.facebook.com';
const FB_PUBLISH_TIMEOUT_MS = 45_000;

// ============================================================================
// TYPES
// ============================================================================

export interface FacebookPublishResult {
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
}

// ============================================================================
// PUBLISHER
// ============================================================================

/**
 * Publish a post to a Facebook Page.
 * Uses the Page /feed endpoint with a Page Access Token.
 */
export async function publishToFacebook(post: SocialPost): Promise<FacebookPublishResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const pageToken = process.env.FACEBOOK_PAGE_TOKEN;

  if (!pageId || !pageToken) {
    return {
      success: false,
      error: 'Facebook env vars not set (FACEBOOK_PAGE_ID, FACEBOOK_PAGE_TOKEN)',
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FB_PUBLISH_TIMEOUT_MS);

  try {
    const body = new URLSearchParams();
    body.set('message', post.content);
    body.set('access_token', pageToken);

    const response = await fetch(`${FB_API_BASE}/v20.0/${pageId}/feed`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    clearTimeout(timeout);

    if (response.ok) {
      const data = (await response.json()) as { id: string };
      const postId = data.id;
      const postUrl = `https://www.facebook.com/${pageId}/posts/${postId.split('_').pop() ?? postId}`;
      return { success: true, postId, postUrl };
    }

    const errorText = await response.text();
    return {
      success: false,
      error: `HTTP ${response.status}: ${errorText}`,
    };
  } catch (err) {
    clearTimeout(timeout);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

/**
 * Publish raw text directly to Facebook (bypasses queue, for autosend).
 */
export async function autosendToFacebook(text: string): Promise<FacebookPublishResult> {
  const fakePost: SocialPost = {
    id: `autosend-fb-${Date.now()}`,
    platform: 'linkedin',
    category: 'product_update',
    status: 'approved',
    content: text,
    image_url: null,
    scheduled_at: null,
    source: 'claude-autosend',
    approval_notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return publishToFacebook(fakePost);
}

// ============================================================================
// CONFIGURATION CHECK
// ============================================================================

/**
 * Check if Facebook publishing is configured.
 */
export function isFacebookConfigured(): boolean {
  return !!(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN);
}