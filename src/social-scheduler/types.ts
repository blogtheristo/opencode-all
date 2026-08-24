/**
 * Social Scheduler — Types
 *
 * Content queue for LinkedIn posts and social media drafts.
 * Agent drafts → CEO approves (via email reply) → scheduled publish.
 */

export type PostStatus = 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'published' | 'rejected';
export type PostPlatform = 'linkedin' | 'twitter' | 'x';
export type PostCategory = 'thought_leadership' | 'product_update' | 'compliance_news' | 'case_study' | 'webinar_promo' | 'hiring';

export interface SocialPost {
  id: string;
  platform: PostPlatform;
  category: PostCategory;
  status: PostStatus;
  /** Post body content */
  content: string;
  /** Optional image URL */
  image_url: string | null;
  /** Scheduled publish time (ISO) */
  scheduled_at: string | null;
  /** Source: which agent or template generated this */
  source: string;
  /** CEO notes on the draft */
  approval_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostDraft {
  platform: PostPlatform;
  category: PostCategory;
  content: string;
  image_url?: string;
  scheduled_at?: string;
  source: string;
}

export interface WeeklySchedule {
  monday: PostCategory;
  tuesday: PostCategory;
  wednesday: PostCategory;
  thursday: PostCategory;
  friday: PostCategory;
}

export interface SchedulerConfig {
  /** Default publish time (Helsinki) */
  publishHour: number;
  publishMinute: number;
  /** Max posts per day */
  maxPostsPerDay: number;
  /** Weekly content theme rotation */
  weeklySchedule: WeeklySchedule;
}
