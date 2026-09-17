/**
 * Firehorse Omnichannel Next Pilot - Sales Pipeline Management
 * Meeting & Proposal tracking
 */

import { db } from './database';
import logger from '../utils/logger.js';

// ============================================================================
// TYPES
// ============================================================================

export interface Meeting {
  id?: string;
  lead_id: string;
  title: string;
  description?: string;
  meeting_type: 'demo' | 'discovery' | 'proposal' | 'follow_up';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  scheduled_at: Date;
  duration_minutes: number;
  location?: string;
  attendees?: Array<{ name: string; email: string; title?: string }>;
  outcome_notes?: string;
  next_steps?: string;
}

export interface Proposal {
  id?: string;
  lead_id: string;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'under_review' | 'negotiation' | 'accepted' | 'rejected' | 'expired';
  amount_eur: number;
  currency: string;
  pilot_duration_months: number;
  document_url?: string;
  sent_at?: Date;
  valid_until?: Date;
  notes?: string;
  rejection_reason?: string;
}

// ============================================================================
// MEETING MANAGEMENT
// ============================================================================

/**
 * Schedule a new meeting
 */
export async function scheduleMeeting(meeting: Meeting): Promise<string> {
  const meetingId = await db.createMeeting(meeting);

  logger.info(`📅 Meeting scheduled: ${meeting.title} for ${meeting.scheduled_at}`);

  return meetingId;
}

/**
 * Complete a meeting with outcome notes
 */
export async function completeMeeting(
  meetingId: string,
  outcomeNotes: string,
  nextSteps?: string
): Promise<void> {
  await db.updateMeeting(meetingId, {
    status: 'completed',
    outcome_notes: outcomeNotes,
    next_steps: nextSteps,
    completed_at: new Date(),
  });

  logger.info(`✅ Meeting completed: ${meetingId}`);
}

/**
 * Get upcoming meetings (next 7 days)
 */
export async function getUpcomingMeetings(): Promise<unknown[]> {
  return db.getUpcomingMeetings();
}

// ============================================================================
// PROPOSAL MANAGEMENT
// ============================================================================

/**
 * Create a new proposal
 */
export async function createProposal(proposal: Proposal): Promise<string> {
  const proposalId = await db.createProposal(proposal);

  logger.info(`📄 Proposal created: ${proposal.title} for ${proposal.amount_eur} EUR`);

  return proposalId;
}

/**
 * Send proposal to lead
 */
export async function sendProposal(
  proposalId: string,
  validUntilDays: number = 30
): Promise<void> {
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + validUntilDays);

  await db.updateProposal(proposalId, {
    status: 'sent',
    sent_at: new Date(),
    valid_until: validUntil,
  });

  logger.info(`📤 Proposal sent: ${proposalId}, valid until ${validUntil}`);
}

/**
 * Accept proposal
 */
export async function acceptProposal(proposalId: string): Promise<void> {
  await db.updateProposal(proposalId, {
    status: 'accepted',
    accepted_at: new Date(),
  });

  logger.info(`✅ Proposal accepted: ${proposalId}`);
}

/**
 * Reject proposal
 */
export async function rejectProposal(
  proposalId: string,
  reason: string
): Promise<void> {
  await db.updateProposal(proposalId, {
    status: 'rejected',
    rejected_at: new Date(),
    rejection_reason: reason,
  });

  logger.info(`❌ Proposal rejected: ${proposalId}, reason: ${reason}`);
}

/**
 * Get active proposals
 */
export async function getActiveProposals(): Promise<unknown[]> {
  return db.getActiveProposals();
}

// ============================================================================
// SALES PIPELINE
// ============================================================================

/**
 * Get sales pipeline overview
 */
export async function getSalesPipeline(): Promise<unknown[]> {
  return db.getSalesPipeline();
}

/**
 * Get sales metrics
 */
export async function getSalesMetrics(): Promise<{
  total_leads: number;
  engaged_leads: number;
  meetings_scheduled: number;
  meetings_completed: number;
  proposals_sent: number;
  proposals_accepted: number;
  total_pipeline_value_eur: number;
  avg_deal_size_eur: number;
  conversion_rate: number;
}> {
  const metrics = await db.getSalesMetrics();

  return {
    total_leads: metrics.total_leads || 0,
    engaged_leads: metrics.engaged_leads || 0,
    meetings_scheduled: metrics.meetings_scheduled || 0,
    meetings_completed: metrics.meetings_completed || 0,
    proposals_sent: metrics.proposals_sent || 0,
    proposals_accepted: metrics.proposals_accepted || 0,
    total_pipeline_value_eur: metrics.total_pipeline_value_eur || 0,
    avg_deal_size_eur: metrics.avg_deal_size_eur || 0,
    conversion_rate: metrics.conversion_rate || 0,
  };
}
