/**
 * Firehorse Omnichannel Next Pilot - State Machine
 * CustomerPilotLoop v1
 */

import {
  type EmailOpenedPayload,
  type EmailReplyPayload,
  EventType,
  LeadState,
  type LinkClickedPayload,
  type MeetingBookedPayload,
  ReplyIntent,
} from './types';
import * as actions from './actions';
import logger from '../utils/logger.js';
import { getEmailTemplateForCountry } from './helpers';
import { eventBus } from '../agents/event-bus.js';

// ============================================================================
// STATE MACHINE LOGIC
// ============================================================================

/**
 * Handle email opened trigger
 */
export async function handleEmailOpened(payload: EmailOpenedPayload): Promise<void> {
  const { lead_id } = payload;

  // Get current lead state
  const lead = await actions.getLead(lead_id);
  if (!lead) {
    console.error(`Lead ${lead_id} not found`);
    return;
  }

  // Log event
  await actions.logEvent({
    event_type: EventType.EmailOpened,
    lead_id,
    metadata: { opened_at: payload.opened_at },
  });

  // Emit to GTM event bus (Phase 2a)
  await eventBus.emit({
    type: 'sales.email_opened',
    source: 'firehorse_state_machine',
    payload: {
      lead_id,
      opened_at: payload.opened_at,
    },
    priority: 'normal',
    timestamp: new Date().toISOString(),
    orgId: lead.org_id || 'unknown',
    sessionId: lead.session_id || 'unknown',
  });

  // State transitions
  if (lead.state === LeadState.Cold_1_Sent) {
    await actions.changeState({
      new_state: LeadState.Cold_1_Opened,
      lead_id,
    });
  }
}

/**
 * Handle link clicked trigger
 */
export async function handleLinkClicked(payload: LinkClickedPayload): Promise<void> {
  const { lead_id, link_url } = payload;

  const lead = await actions.getLead(lead_id);
  if (!lead) {
    console.error(`Lead ${lead_id} not found`);
    return;
  }

  // Log event
  await actions.logEvent({
    event_type: EventType.LinkClicked,
    lead_id,
    metadata: { link_url, clicked_at: payload.clicked_at },
  });

  // Emit to GTM event bus (Phase 2a)
  await eventBus.emit({
    type: 'sales.email_clicked',
    source: 'firehorse_state_machine',
    payload: {
      lead_id,
      link_url,
      clicked_at: payload.clicked_at,
    },
    priority: 'normal',
    timestamp: new Date().toISOString(),
    orgId: lead.org_id || 'unknown',
    sessionId: lead.session_id || 'unknown',
  });

  // Update last engagement
  await actions.updateLastEngagement(lead_id, payload.clicked_at);

  // State transitions
  if (lead.state === LeadState.Cold_1_Sent || lead.state === LeadState.Cold_1_Opened) {
    await actions.changeState({
      new_state: LeadState.Engaged,
      lead_id,
    });

    // Create task for manual reply
    await actions.createTask({
      owner: 'Risto',
      task_type: 'ManualReply' as any,
      lead_id,
      description: `Lead clicked link: ${link_url}`,
    });
  }
}

/**
 * Handle email reply trigger
 */
export async function handleEmailReply(payload: EmailReplyPayload): Promise<void> {
  const { lead_id, reply_text } = payload;

  const lead = await actions.getLead(lead_id);
  if (!lead) {
    console.error(`Lead ${lead_id} not found`);
    return;
  }

  // Log event
  await actions.logEvent({
    event_type: EventType.Replied,
    lead_id,
    metadata: { reply_text, replied_at: payload.replied_at },
  });

  // Update last engagement
  await actions.updateLastEngagement(lead_id, payload.replied_at);

  // Analyze intent (simplified - in production use AI)
  const intent = analyzeReplyIntent(reply_text);

  // Store reply with intent
  await actions.storeReply(lead_id, reply_text, intent);

  // State transitions based on intent
  if (
    intent === ReplyIntent.Interested ||
    intent === ReplyIntent.Demo ||
    intent === ReplyIntent.Meeting
  ) {
    await actions.changeState({
      new_state: LeadState.Engaged,
      lead_id,
    });

    await actions.createTask({
      owner: 'Risto',
      task_type: 'ManualReply' as any,
      lead_id,
      description: `Lead replied with positive intent: ${intent}`,
    });
  } else if (
    intent === ReplyIntent.Later ||
    intent === ReplyIntent.Q3 ||
    intent === ReplyIntent.H2
  ) {
    await actions.changeState({
      new_state: LeadState.Parked,
      lead_id,
    });
  } else if (intent === ReplyIntent.WrongPerson || intent === ReplyIntent.NotRelevant) {
    await actions.changeState({
      new_state: LeadState.Disqualified,
      lead_id,
    });
  } else if (intent === ReplyIntent.Unknown) {
    // Unknown intent: create manual review task so human classifies the reply
    await actions.createTask({
      owner: 'Risto',
      task_type: 'ManualReply' as any,
      lead_id,
      description: `Reply intent could not be classified automatically — manual review needed. Preview: "${reply_text.slice(0, 80)}"`,
    });
  }
}

/**
 * Handle meeting booked trigger
 */
export async function handleMeetingBooked(payload: MeetingBookedPayload): Promise<void> {
  const { lead_id, meeting_time } = payload;

  const lead = await actions.getLead(lead_id);
  if (!lead) {
    console.error(`Lead ${lead_id} not found`);
    return;
  }

  // Log event
  await actions.logEvent({
    event_type: EventType.MeetingBooked,
    lead_id,
    metadata: { meeting_time, booked_at: payload.booked_at },
  });

  // Update last engagement
  await actions.updateLastEngagement(lead_id, payload.booked_at);

  // State transition
  await actions.changeState({
    new_state: LeadState.Meeting_Booked,
    lead_id,
  });
}

/**
 * Process Cold 1 follow-up (no engagement after 3 days)
 */
export async function processCold2Candidates(): Promise<void> {
  const candidates = await actions.getCold2Candidates();

  for (const lead of candidates) {
    // Send Cold 2 reminder
    await actions.sendEmail({
      template_id: 'CustomerPilot_Cold2_Reminder',
      lead_id: lead.id,
      variables: {
        first_name: lead.first_name || 'there',
      },
    });

    // Change state
    await actions.changeState({
      new_state: LeadState.Cold_2_Sent,
      lead_id: lead.id,
    });

    // Update timestamp
    await actions.updateCold2SentAt(lead.id, new Date());

    // Log event
    await actions.logEvent({
      event_type: EventType.EmailSent,
      lead_id: lead.id,
      metadata: { template_id: 'CustomerPilot_Cold2_Reminder' },
    });
  }

  console.log(`Processed ${candidates.length} Cold 2 candidates`);
}

/**
 * Process Cold 3 follow-up (no engagement after 5 days from Cold 2)
 */
export async function processCold3Candidates(): Promise<void> {
  const candidates = await actions.getCold3Candidates();

  for (const lead of candidates) {
    // Send Cold 3 close loop
    await actions.sendEmail({
      template_id: 'CustomerPilot_Cold3_CloseLoop',
      lead_id: lead.id,
      variables: {
        first_name: lead.first_name || 'there',
      },
    });

    // Change state
    await actions.changeState({
      new_state: LeadState.Cold_3_Sent,
      lead_id: lead.id,
    });

    // Update timestamp
    await actions.updateCold3SentAt(lead.id, new Date());

    // Log event
    await actions.logEvent({
      event_type: EventType.EmailSent,
      lead_id: lead.id,
      metadata: { template_id: 'CustomerPilot_Cold3_CloseLoop' },
    });
  }

  console.log(`Processed ${candidates.length} Cold 3 candidates`);
}

/**
 * Process new leads (daily 08:00)
 * Goal: 30 new outbound contacts per day
 */
export async function processNewLeadsDaily(): Promise<void> {
  const newLeads = await actions.getNewLeadsForToday();

  for (const lead of newLeads) {
    // Determine template based on country
    const templateId = getEmailTemplateForCountry(lead.country, 'cold1');

    // Send email
    await actions.sendEmail({
      template_id: templateId,
      lead_id: lead.id,
      variables: {
        first_name: lead.first_name || 'there',
        company: lead.company || 'your company',
      },
    });

    // Change state
    await actions.changeState({
      new_state: LeadState.Cold_1_Sent,
      lead_id: lead.id,
    });

    // Update timestamp
    await actions.updateCold1SentAt(lead.id, new Date());

    // Log event
    await actions.logEvent({
      event_type: EventType.EmailSent,
      lead_id: lead.id,
      metadata: { template_id: templateId },
    });
  }

  console.log(`Processed ${newLeads.length} new leads for today`);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Analyze reply intent (simplified)
 * In production, use AI/NLP service
 */
function analyzeReplyIntent(replyText: string): ReplyIntent {
  const text = replyText.toLowerCase();

  // Positive intent
  if (
    text.includes('interested') ||
    text.includes('kiinnostaa') ||
    text.includes('sounds good') ||
    text.includes('tell me more')
  ) {
    return ReplyIntent.Interested;
  }

  if (text.includes('demo') || text.includes('esittely') || text.includes('show me')) {
    return ReplyIntent.Demo;
  }

  if (
    text.includes('meeting') ||
    text.includes('call') ||
    text.includes('tapaaminen') ||
    text.includes('puhelu')
  ) {
    return ReplyIntent.Meeting;
  }

  // Later intent
  if (
    text.includes('later') ||
    text.includes('myöhemmin') ||
    text.includes('next year') ||
    text.includes('ensi vuonna')
  ) {
    return ReplyIntent.Later;
  }

  if (text.includes('q3') || text.includes('q4')) {
    return ReplyIntent.Q3;
  }

  if (text.includes('h2')) {
    return ReplyIntent.H2;
  }

  // Disqualified intent
  if (
    text.includes('wrong person') ||
    text.includes('väärä henkilö') ||
    text.includes('not responsible')
  ) {
    return ReplyIntent.WrongPerson;
  }

  if (
    text.includes('not relevant') ||
    text.includes('not interested') ||
    text.includes('ei kiinnosta') ||
    text.includes('no thanks')
  ) {
    return ReplyIntent.NotRelevant;
  }

  // Unknown intent — log for manual review.
  // Phase 2: call LLM to classify ambiguous replies.
  logger.warn({
    action: 'reply_intent_unknown',
    replyLength: replyText.length,
    preview: replyText.slice(0, 100),
    message: 'Keyword matching could not classify reply — marked Unknown for manual review',
  });
  return ReplyIntent.Unknown;
}
