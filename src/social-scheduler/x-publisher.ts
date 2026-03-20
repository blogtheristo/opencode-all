/**
 * Social Scheduler — X (Twitter) Publisher
 *
 * Transport priority:
 *   1. xurl CLI (@xdevplatform/xurl) — official X API CLI, handles OAuth automatically
 *   2. Native fetch + OAuth 1.0a HMAC-SHA1 — built-in fallback, no external deps
 *
 * xurl setup (recommended):
 *   npm i -g @xdevplatform/xurl   (or devDep: @xdevplatform/xurl@1.0.3)
 *   xurl auth apps add dws-iq     (interactive credential setup)
 *   xurl auth oauth1 dws-iq       (store OAuth 1.0a tokens in ~/.xurl)
 *
 * Fallback env vars (native OAuth):
 *   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
 *
 * X API v2 docs:
 *   https://developer.x.com/en/docs/x-api/tweets/manage-tweets/api-reference/post-tweets
 */

import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import logger from '../utils/logger.js';
import type { SocialPost } from './types.js';

const execFileAsync = promisify(execFile);
const X_API_BASE = 'https://api.x.com';

// ============================================================================
// TYPES
// ============================================================================

export interface XPublishResult {
  success: boolean;
  tweetId?: string;
  tweetUrl?: string;
  transport?: 'xurl' | 'native';
  error?: string;
}

// ============================================================================
// XURL TRANSPORT (PRIMARY)
// ============================================================================

/**
 * Check if xurl CLI is available on PATH.
 */
async function isXurlAvailable(): Promise<boolean> {
  try {
    await execFileAsync('xurl', ['--version']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Publish via xurl CLI.
 * Uses execFile with argument arrays (never string interpolation — DWS security rule).
 */
async function publishViaXurl(text: string): Promise<XPublishResult> {
  try {
    const body = JSON.stringify({ text });

    const { stdout } = await execFileAsync('xurl', [
      '-X', 'POST',
      '/2/tweets',
      '-d', body,
    ]);

    const response = JSON.parse(stdout);

    if (response?.data?.id) {
      const tweetId = response.data.id;
      const tweetUrl = `https://x.com/i/status/${tweetId}`;
      return { success: true, tweetId, tweetUrl, transport: 'xurl' };
    }

    return {
      success: false,
      transport: 'xurl',
      error: `xurl response missing data.id: ${stdout.substring(0, 200)}`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, transport: 'xurl', error: `xurl failed: ${msg}` };
  }
}

// ============================================================================
// NATIVE OAUTH 1.0a TRANSPORT (FALLBACK)
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

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
    .join('&');

  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString),
  ].join('&');

  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBase)
    .digest('base64');

  oauthParams.oauth_signature = signature;

  const authHeader = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(', ');

  return `OAuth ${authHeader}`;
}

async function publishViaNative(text: string): Promise<XPublishResult> {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const tokenSecret = process.env.X_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !tokenSecret) {
    return {
      success: false,
      transport: 'native',
      error: 'X API env vars not set (X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET)',
    };
  }

  const url = `${X_API_BASE}/2/tweets`;
  const authHeader = buildOAuthHeader('POST', url, apiKey, apiSecret, accessToken, tokenSecret);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      const data = (await response.json()) as { data: { id: string; text: string } };
      const tweetId = data.data.id;
      const tweetUrl = `https://x.com/i/status/${tweetId}`;
      return { success: true, tweetId, tweetUrl, transport: 'native' };
    }

    const errorText = await response.text();
    return {
      success: false,
      transport: 'native',
      error: `HTTP ${response.status}: ${errorText}`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, transport: 'native', error: msg };
  }
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Publish a post to X.
 * Tries xurl first, falls back to native OAuth 1.0a.
 */
export async function publishToX(post: SocialPost): Promise<XPublishResult> {
  if (post.content.length > 280) {
    return {
      success: false,
      error: `Tweet exceeds 280 characters (${post.content.length} chars)`,
    };
  }

  // Try xurl first
  if (await isXurlAvailable()) {
    logger.info('X publish: using xurl transport', { postId: post.id });
    const result = await publishViaXurl(post.content);
    if (result.success) {
      logger.info('X post published via xurl', { postId: post.id, tweetId: result.tweetId });
      return result;
    }
    logger.warn('xurl publish failed, falling back to native', { error: result.error });
  }

  // Fallback to native OAuth
  logger.info('X publish: using native OAuth transport', { postId: post.id });
  const result = await publishViaNative(post.content);
  if (result.success) {
    logger.info('X post published via native OAuth', { postId: post.id, tweetId: result.tweetId });
  } else {
    logger.error('X publish failed (both transports)', { postId: post.id, error: result.error });
  }
  return result;
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

/**
 * Check if X publishing is configured (either xurl or env vars).
 */
export async function isXConfigured(): Promise<boolean> {
  if (await isXurlAvailable()) return true;
  return !!(
    process.env.X_API_KEY &&
    process.env.X_API_SECRET &&
    process.env.X_ACCESS_TOKEN &&
    process.env.X_ACCESS_TOKEN_SECRET
  );
}
