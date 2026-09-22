/**
 * SUPERSEDED — kept as _OLD per CLAUDE.md Rule 6 (rename over delete), not
 * wired into src/temporal/workflows/index.ts. Replaced by
 * src/temporal/starters/social.starter.ts, which submits
 * publishSocialPostActivity as a true Standalone Activity using its built-in
 * `startDelay` — no wrapping Workflow needed just to `sleep`. See
 * docs/dws-use-cases.md use case #3.
 *
 * Temporal Workflow — Scheduled Social Post Publish (Use case #3, pilot)
 *
 * Thin wrapper around one standalone Activity: sleeps until the post's
 * scheduled time (durable across worker restarts, unlike an in-process
 * setTimeout), then runs the publish Activity under a retry policy tuned
 * for platform rate limits.
 */
import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from '../activities/social.activities.js';

const { publishSocialPostActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '10 seconds',
    backoffCoefficient: 2,
    maximumInterval: '10 minutes',
    maximumAttempts: 6,
  },
});

export interface SocialPublishWorkflowInput {
  post: activities.PublishSocialPostInput['post'];
  platform: activities.PublishSocialPostInput['platform'];
  /** ISO timestamp; workflow sleeps until this instant before publishing. */
  scheduledAt?: string;
}

export async function socialPublishWorkflow(
  input: SocialPublishWorkflowInput,
): Promise<activities.PublishSocialPostResult> {
  if (input.scheduledAt) {
    const delayMs = new Date(input.scheduledAt).getTime() - Date.now();
    if (delayMs > 0) await sleep(delayMs);
  }

  return publishSocialPostActivity({ post: input.post, platform: input.platform });
}
