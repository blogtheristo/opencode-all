/**
 * Temporal Activities — Social Post Publish (Use case #3, pilot)
 *
 * Replaces the retry-less `supabaseFetch` + direct publisher call in
 * src/social-scheduler/queue.ts with one standalone Activity per publish,
 * so Temporal's retry policy (see worker.ts) owns backoff on rate limits
 * instead of a swallowed `null` return.
 */
import { ApplicationFailure } from '@temporalio/activity';
import {
  isFacebookConfigured,
  publishToFacebook,
} from '../../social-scheduler/facebook-publisher.js';
import { isXConfigured, publishToX } from '../../social-scheduler/x-publisher.js';
import { updatePostStatus } from '../../social-scheduler/queue.js';
import type { SocialPost } from '../../social-scheduler/types.js';
import logger from '../../utils/logger.js';

export interface PublishSocialPostInput {
  post: SocialPost;
  platform: 'facebook' | 'x';
}

export interface PublishSocialPostResult {
  success: true;
  postId: string;
  postUrl?: string;
}

/**
 * Rate-limit (429) and transient network errors are retryable by default —
 * Temporal's RetryPolicy backs off automatically. A platform reporting the
 * post as rejected (bad content, revoked token) is not worth retrying.
 */
function classifyFailure(platform: string, error: string | undefined): never {
  const nonRetryable = /invalid|revoked|unauthorized|permission|duplicate/i.test(error || '');
  throw ApplicationFailure.create({
    message: `${platform} publish failed: ${error || 'unknown error'}`,
    type: nonRetryable ? 'NonRetryablePublishError' : 'TransientPublishError',
    nonRetryable,
  });
}

export async function publishSocialPostActivity(
  input: PublishSocialPostInput,
): Promise<PublishSocialPostResult> {
  const { post, platform } = input;

  if (platform === 'facebook') {
    if (!isFacebookConfigured()) {
      throw ApplicationFailure.create({
        message: 'Facebook publisher not configured (missing FACEBOOK_PAGE_ID/TOKEN)',
        type: 'ConfigurationError',
        nonRetryable: true,
      });
    }
    const result = await publishToFacebook(post);
    if (!result.success || !result.postId) classifyFailure('facebook', result.error);
    await updatePostStatus(post.id, 'published', `platform_post_id:${result.postId}`);
    logger.info('Social post published via Temporal activity', { platform, postId: result.postId });
    return { success: true, postId: result.postId as string, postUrl: result.postUrl };
  }

  if (platform === 'x') {
    if (!(await isXConfigured())) {
      throw ApplicationFailure.create({
        message: 'X publisher not configured (missing X_API_* credentials or xurl auth)',
        type: 'ConfigurationError',
        nonRetryable: true,
      });
    }
    const result = await publishToX(post);
    if (!result.success || !result.tweetId) classifyFailure('x', result.error);
    await updatePostStatus(post.id, 'published', `platform_post_id:${result.tweetId}`);
    logger.info('Social post published via Temporal activity', {
      platform,
      postId: result.tweetId,
    });
    return { success: true, postId: result.tweetId as string, postUrl: result.tweetUrl };
  }

  throw ApplicationFailure.create({
    message: `Unknown platform: ${platform}`,
    type: 'ConfigurationError',
    nonRetryable: true,
  });
}
