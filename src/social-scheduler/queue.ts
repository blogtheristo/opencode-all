/**
 * Social Scheduler — Post Queue
 *
 * Manages the social post queue in Supabase.
 * Stores drafts, tracks approval status, handles scheduling.
 *
 * Table: social_posts (create via migration if needed)
 */

import logger from '../utils/logger.js';
import type { PostDraft, PostStatus, SocialPost } from './types.js';

// ============================================================================
// SUPABASE HELPER
// ============================================================================

async function supabaseFetch<T>(
  path: string,
  options?: { method?: string; body?: unknown }
): Promise<T | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;

  try {
    const response = await fetch(`${url}/rest/v1/${path}`, {
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: options?.method === 'POST' ? 'return=representation' : 'return=representation',
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const body = await response.text();
      logger.warn('Social queue Supabase error', { path, status: response.status, error: body });
      return null;
    }

    return (await response.json()) as T;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.warn('Social queue Supabase fetch error', { path, error: msg });
    return null;
  }
}

// ============================================================================
// QUEUE OPERATIONS
// ============================================================================

/**
 * Add a draft to the queue.
 */
export async function enqueueDraft(draft: PostDraft): Promise<string | null> {
  const now = new Date().toISOString();
  const post = {
    platform: draft.platform,
    category: draft.category,
    content: draft.content,
    image_url: draft.image_url || null,
    scheduled_at: draft.scheduled_at || null,
    source: draft.source,
    status: 'draft' as PostStatus,
    approval_notes: null as string | null,
    created_at: now,
    updated_at: now,
  };

  const result = await supabaseFetch<SocialPost[]>('social_posts', {
    method: 'POST',
    body: post,
  });

  if (result?.[0]?.id) {
    logger.info('Social post draft enqueued', { id: result[0].id, category: draft.category });
    return result[0].id;
  }

  return null;
}

/**
 * Get pending drafts awaiting approval.
 */
export async function getPendingDrafts(): Promise<SocialPost[]> {
  const posts = await supabaseFetch<SocialPost[]>(
    'social_posts?status=in.(draft,pending_approval)&order=scheduled_at.asc&limit=10'
  );
  return posts ?? [];
}

/**
 * Get approved posts ready to publish.
 */
export async function getApprovedPosts(): Promise<SocialPost[]> {
  const now = new Date().toISOString();
  const posts = await supabaseFetch<SocialPost[]>(
    `social_posts?status=eq.approved&scheduled_at=lte.${now}&order=scheduled_at.asc&limit=5`
  );
  return posts ?? [];
}

/**
 * Update post status.
 */
export async function updatePostStatus(
  postId: string,
  status: PostStatus,
  notes?: string
): Promise<boolean> {
  const update: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (notes) update.approval_notes = notes;

  const result = await supabaseFetch<SocialPost[]>(
    `social_posts?id=eq.${postId}`,
    { method: 'PATCH', body: update }
  );

  return result !== null;
}

/**
 * Get this week's posts for the approval digest.
 */
export async function getWeeklyDigest(): Promise<SocialPost[]> {
  const monday = new Date();
  monday.setDate(monday.getDate() - monday.getDay() + 1);
  monday.setHours(0, 0, 0, 0);

  const posts = await supabaseFetch<SocialPost[]>(
    `social_posts?created_at=gte.${monday.toISOString()}&order=scheduled_at.asc&limit=20`
  );
  return posts ?? [];
}
