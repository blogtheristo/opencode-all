/**
 * Firehorse Omnichannel Next Pilot - Type Definitions
 * CustomerPilotLoop v1
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum LeadState {
  New = 'New',
  Cold_1_Sent = 'Cold_1_Sent',
  Cold_1_Opened = 'Cold_1_Opened',
  Cold_1_Clicked = 'Cold_1_Clicked',
  Cold_2_Sent = 'Cold_2_Sent',
  Cold_3_Sent = 'Cold_3_Sent',
  Engaged = 'Engaged',
  Meeting_Booked = 'Meeting_Booked',
  Disqualified = 'Disqualified',
  Parked = 'Parked',
}

export enum LeadCountry {
  FI = 'FI',
  SE = 'SE',
  NO = 'NO',
  DK = 'DK',
  DE = 'DE',
}

export enum EventType {
  EmailSent = 'EmailSent',
  EmailOpened = 'EmailOpened',
  LinkClicked = 'LinkClicked',
  Replied = 'Replied',
  MeetingBooked = 'MeetingBooked',
  StateChanged = 'StateChanged',
  TaskCreated = 'TaskCreated',
  linkedin_dm_skipped = 'linkedin_dm_skipped',
}

export enum TaskType {
  ManualReply = 'ManualReply',
  FollowUp = 'FollowUp',
  Review = 'Review',
}

export enum ReplyIntent {
  Interested = 'interested',
  Demo = 'demo',
  Meeting = 'meeting',
  Later = 'later',
  Q3 = 'Q3',
  H2 = 'H2',
  WrongPerson = 'wrong_person',
  NotRelevant = 'not_relevant',
  Unknown = 'unknown',
}

export enum TemplateType {
  Email = 'email',
  LinkedInDM = 'linkedin_dm',
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface Lead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  title?: string;
  country: LeadCountry;
  segment: string;
  state: LeadState;
  linkedin_url?: string;
  cold_1_sent_at?: Date;
  cold_2_sent_at?: Date;
  cold_3_sent_at?: Date;
  last_engagement_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Event {
  id: string;
  lead_id: string;
  event_type: EventType;
  metadata: Record<string, any>;
  created_at: Date;
}

export interface Task {
  id: string;
  lead_id: string;
  owner: string;
  task_type: TaskType;
  description?: string;
  completed: boolean;
  created_at: Date;
  completed_at?: Date;
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  language: string;
  template_type: TemplateType;
  created_at: Date;
  updated_at: Date;
}

// Legacy alias for backwards compatibility
export type EmailTemplate = MessageTemplate;

export interface Reply {
  id: string;
  lead_id: string;
  reply_text: string;
  intent?: ReplyIntent;
  confidence?: number;
  created_at: Date;
}

// ============================================================================
// TRIGGER PAYLOADS
// ============================================================================

export interface EmailOpenedPayload {
  lead_id: string;
  email: string;
  opened_at: Date;
}

export interface LinkClickedPayload {
  lead_id: string;
  email: string;
  link_url: string;
  clicked_at: Date;
}

export interface EmailReplyPayload {
  lead_id: string;
  email: string;
  reply_text: string;
  replied_at: Date;
}

export interface MeetingBookedPayload {
  lead_id: string;
  email: string;
  meeting_time?: Date;
  booked_at: Date;
}

// ============================================================================
// ACTION PAYLOADS
// ============================================================================

export interface SendEmailAction {
  template_id: string;
  lead_id: string;
  variables?: Record<string, string>;
}

export interface SendLinkedInDMAction {
  template_id: string;
  lead_id: string;
  linkedin_url: string; // LinkedIn profile URL
  variables?: Record<string, string>;
}

export interface ChangeStateAction {
  new_state: LeadState;
  lead_id: string;
}

export interface LogEventAction {
  event_type: EventType;
  lead_id: string;
  metadata?: Record<string, any>;
}

export interface CreateTaskAction {
  owner: string;
  task_type: TaskType;
  lead_id: string;
  description?: string;
}
