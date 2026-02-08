/**
 * Outreach Pipeline Types
 * Maps to Supabase outreach_contacts, outreach_activities, outreach_daily_tasks
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

export interface OutreachContact {
  id: string;
  pipeline: OutreachPipeline;
  priority: OutreachPriority;
  first_name: string;
  last_name: string | null;
  email: string | null;
  linkedin_url: string | null;
  company: string | null;
  title: string | null;
  location: string | null;
  status: OutreachStatus;
  source: OutreachSource;
  boardy_notes: string | null;
  our_angle: string | null;
  their_angle: string | null;
  next_action: string | null;
  next_action_date: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OutreachDailyTask {
  id: string;
  task_date: string;
  pipeline: OutreachPipeline;
  contact_id: string | null;
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
