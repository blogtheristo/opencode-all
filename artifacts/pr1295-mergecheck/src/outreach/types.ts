/**
 * Outreach Pipeline Types
 * Normalized schema: outreach_orgs + persons + outreach_threads + outreach_activities
 *
 * Natural keys:
 *   - persons: linkedin_url (UNIQUE)
 *   - outreach_orgs: domain (UNIQUE)
 *   - outreach_threads: person_id + org_id + pipeline (UNIQUE)
 *
 * Every table has: created_by + created_at + source for attribution.
 * Single-tenant (Lifetime Oy). tenant_id migration later.
 */

export type OutreachPipeline = 'investor' | 'customer' | 'partner';

export type OutreachStatus =
  | 'new'
  | 'researched'
  | 'intro_requested'
  | 'intro_made'
  | 'contacted'
  | 'responded'
  | 'meeting_booked'
  | 'in_negotiation'
  | 'converted'
  | 'passed'
  | 'parked';

export type OutreachSource =
  | 'boardy'
  | 'linkedin'
  | 'conference'
  | 'referral'
  | 'cold'
  | 'inbound'
  | 'manual';

export type OutreachPriority = 'high' | 'medium' | 'low';

export type ActivityOutcome =
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'no_response'
  | 'bounced';

export interface Organization {
  id: string;
  domain: string;
  name: string;
  description: string | null;
  location: string | null;
  size: string | null;
  industry: string | null;
  website: string | null;
  source: OutreachSource;
  created_by: string;
  created_at: string;
}

export interface Person {
  id: string;
  linkedin_url: string;
  first_name: string;
  last_name: string | null;
  title: string | null;
  location: string | null;
  phone: string | null;
  org_id: string | null;
  source: OutreachSource;
  created_by: string;
  created_at: string;
}

export interface PersonEmail {
  id: string;
  person_id: string;
  email: string;
  is_primary: boolean;
  verified: boolean;
  source: OutreachSource;
  created_by: string;
  created_at: string;
}

export interface OutreachThread {
  id: string;
  person_id: string;
  org_id: string | null;
  pipeline: OutreachPipeline;
  priority: OutreachPriority;
  status: OutreachStatus;
  source: OutreachSource;
  investor_type: string | null;
  check_size: string | null;
  partnership_type: string | null;
  customer_segment: string | null;
  boardy_notes: string | null;
  our_angle: string | null;
  their_angle: string | null;
  next_action: string | null;
  next_action_type: string | null;
  next_action_date: string | null;
  last_contacted_at: string | null;
  last_response_at: string | null;
  last_outbound_at: string | null;
  waiting_since: string | null;
  meetings_count: number;
  nudge_count: number;
  thread_token: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OutreachActivity {
  id: string;
  thread_id: string;
  person_id: string;
  org_id: string | null;
  pipeline: OutreachPipeline;
  channel: string;
  activity_type: string;
  description: string;
  raw_payload: Record<string, unknown> | null;
  outcome: ActivityOutcome | null;
  next_followup_at: string | null;
  metadata: Record<string, unknown>;
  source: OutreachSource;
  created_by: string;
  created_at: string;
}

export interface OutreachDailyTask {
  id: string;
  task_date: string;
  pipeline: OutreachPipeline;
  thread_id: string | null;
  person_id: string | null;
  org_id: string | null;
  task_description: string;
  context: string | null;
  completed: boolean;
}

export interface DailyDigest {
  date: string;
  tasks: OutreachDailyTask[];
  pipeline_summary: PipelineSummary[];
}

export interface PipelineSummary {
  pipeline: OutreachPipeline;
  total: number;
  new_count: number;
  active_count: number;
  meetings_count: number;
  converted_count: number;
  due_today: number;
}

/** Enriched view row (v_outreach_enriched) */
export interface EnrichedThread {
  id: string;
  pipeline: OutreachPipeline;
  priority: OutreachPriority;
  status: OutreachStatus;
  source: OutreachSource;
  next_action: string | null;
  next_action_type: string | null;
  next_action_date: string | null;
  our_angle: string | null;
  last_contacted_at: string | null;
  last_outbound_at: string | null;
  waiting_since: string | null;
  meetings_count: number;
  nudge_count: number;
  thread_token: string;
  first_name: string;
  last_name: string | null;
  person_title: string | null;
  linkedin_url: string;
  person_phone: string | null;
  org_name: string | null;
  org_domain: string | null;
  primary_email: string | null;
  person_id: string;
  org_id: string | null;
  created_at: string;
  created_by: string;
}

/** Status buckets for grouping */
export type StatusBucket = 'open' | 'active' | 'closed';

/** Thread grouped for daily email */
export interface DigestThread {
  name: string;
  org: string | null;
  status: OutreachStatus;
  bucket: StatusBucket;
  next_action: string | null;
  next_action_type: string | null;
  overdue: boolean;
  due_today: boolean;
  waiting_days: number | null;
  nudge_count: number;
  linkedin_url: string;
}

/** Pipeline section in the daily email */
export interface DigestPipelineSection {
  pipeline: OutreachPipeline;
  overdue: DigestThread[];
  due_today: DigestThread[];
  waiting: DigestThread[];
  active_deals: DigestThread[];
  upcoming: DigestThread[];
  total: number;
  summary: { open: number; active: number; closed: number };
}
