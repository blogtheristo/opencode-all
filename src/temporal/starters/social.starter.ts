/**
 * Standalone Activity starter — Social Post Publish (Use case #3, pilot)
 *
 * Replaces the earlier socialPublishWorkflow: Start Delay is a built-in
 * ActivityOptions field (submit now, Temporal makes it available to a
 * Worker after the delay elapses — no wrapping Workflow needed just to
 * `sleep`). Activity ID = the post's own ID, so a re-submit of the same
 * scheduled post joins the existing job instead of double-publishing.
 */
import type { PublishSocialPostInput } from '../activities/social.activities.js';
import { submitStandaloneActivity } from '../standalone.js';
import { TASK_QUEUES } from '../task-queues.js';

export interface SocialPublishJobInput extends PublishSocialPostInput {
  /** ISO timestamp; job becomes available to a Worker no earlier than this instant. */
  scheduledAt?: string;
}

export async function startSocialPublishJob(
  input: SocialPublishJobInput,
): Promise<{ activityId: string }> {
  const startDelay = input.scheduledAt
    ? Math.max(0, new Date(input.scheduledAt).getTime() - Date.now())
    : undefined;

  return submitStandaloneActivity({
    activity: 'publishSocialPostActivity',
    taskQueue: TASK_QUEUES.SOCIAL,
    id: `social-${input.post.id}`,
    args: [{ post: input.post, platform: input.platform }],
    startToCloseTimeout: '1 minute',
    startDelay,
    retry: {
      initialInterval: '10 seconds',
      backoffCoefficient: 2,
      maximumInterval: '10 minutes',
      maximumAttempts: 6,
    },
  });
}
