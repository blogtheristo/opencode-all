/**
 * Social Scheduler — X (Twitter) Publisher
 *
 * Publishes posts to X.com via the X API v2 with OAuth 1.0a HMAC-SHA1 signing.
 *
 * Required env vars:
 *   X_API_KEY            — Consumer API key (from X Developer Portal)
 *   X_API_SECRET         — Consumer API secret
 *   X_ACCESS_TOKEN       — User access token
 *   X_ACCESS_TOKEN_SECRET — User access token secret
 *
 * How to get credentials:
 *   1. Create a project at https://developer.x.com/
 *   2. Enable OAuth 1.0a with read+write permissions
 *   3. Generate consumer keys and access tokens
 *
 * X API v2 docs:
 *   https://developer.x.com/en/docs/x-api/tweets/manage-tweets/api-reference/post-tweets
 */

import crypto from 'node:crypto';
import logger from '../utils/logger.js';
import type { SocialPost } from './types.js';

const X_API_BASE = 'https://api.x.com';

// ============================================================================
// TYPES
// ============================================================================

export interface XPublishResult {
  success: boolean;
  tweetId?: string;
  tweetUrl?: string;
  error?: string;
}

// ============================================================================
// OAUTH 1.0a SIGNING
// ============================================================================

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

function buildOAuthHeader(
  method: string,
  url: string,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  tokenSecret: string
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateNonce();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  // Build parameter string (sorted)
  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
    .join('&');

  // Build signature base string
  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString),
  ].join('&');

  // Sign with HMAC-SHA1
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBase)
    .digest('base64');

  oauthParams.oauth_signature = signature;

  // Build Authorization header
  const authHeader = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(', ');

  return `OAuth ${authHeader}`;
}

// ============================================================================
// PUBLISHER
// ============================================================================

/**
 * Publish a post to X (Twitter).
 * Returns the tweet ID and URL on success.
 */
export async function publishToX(post: SocialPost): Promise<XPublishResult> {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const tokenSecret = process.env.X_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret) {
    return { success: false, error: 'X_API_KEY or X_API_SECRET not set' };
  }
  if (!accessToken || !tokenSecret) {
    return { success: false, error: 'X_ACCESS_TOKEN or X_ACCESS_TOKEN_SECRET not set' };
  }

  // X API v2 tweet limit: 280 characters
  if (post.content.length > 280) {
    return {
      success: false,
      error: `Tweet exceeds 280 characters (${post.content.length} chars)`,
    };
  }

  const url = `${X_API_BASE}/2/tweets`;
  const authHeader = buildOAuthHeader(
    'POST',
    url,
    apiKey,
    apiSecret,
    accessToken,
    tokenSecret
  );

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: post.content }),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        data: { id: string; text: string };
      };
      const tweetId = data.data.id;
      const tweetUrl = `https://x.com/i/status/${tweetId}`;

      logger.info('X post published', { postId: post.id, tweetId, tweetUrl });
      return { success: true, tweetId, tweetUrl };
    }

    const errorText = await response.text();
    logger.warn('X publish failed', {
      postId: post.id,
      status: response.status,
      error: errorText,
    });
    return {
      success: false,
      error: `HTTP ${response.status}: ${errorText}`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('X publish error', { postId: post.id, error: msg });
    return { success: false, error: msg };
  }
}

/**
 * Publish raw text directly to X (bypasses queue, for autosend).
 */
export async function autosendToX(text: string): Promise<XPublishResult> {
  if (text.length > 280) {
    return {
      success: false,
      error: `Tweet exceeds 280 characters (${text.length} chars)`,
    };
  }

  const fakePost: SocialPost = {
    id: `autosend-${Date.now()}`,
    platform: 'x',
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

  return publishToX(fakePost);
}

// ============================================================================
// CONFIGURATION CHECK
// ============================================================================

export function isXConfigured(): boolean {
  return !!(
    process.env.X_API_KEY &&
    process.env.X_API_SECRET &&
    process.env.X_ACCESS_TOKEN &&
    process.env.X_ACCESS_TOKEN_SECRET
  );
}
