/**
 * Social Scheduler Module
 *
 * LinkedIn post queue: Agent drafts → CEO approves → scheduled publish.
 */

export { generateDraft, generateTodaysDraft, getTodaysCategory, DEFAULT_WEEKLY_SCHEDULE } from './content-generator.js';
export { enqueueDraft, getPendingDrafts, getApprovedPosts, updatePostStatus, getWeeklyDigest } from './queue.js';
export { buildApprovalDigestHtml, buildApprovalDigestPlainText } from './approval-digest.js';
export { publishToLinkedIn, isLinkedInConfigured, validateLinkedInToken } from './publisher.js';
export { publishToX, autosendToX, isXConfigured } from './x-publisher.js';
export { POST_LIBRARY, buildDrafts } from './post-library.js';
export type { SocialPost, PostDraft, PostStatus, PostPlatform, PostCategory, WeeklySchedule, SchedulerConfig } from './types.js';
