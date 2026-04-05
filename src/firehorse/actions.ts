/**
 * Firehorse Omnichannel Next Pilot - Action Functions
 * CustomerPilotLoop v1
 */

import {
  Lead,
  LeadState,
  EventType,
  TaskType,
  ReplyIntent,
  SendEmailAction,
  ChangeStateAction,
  LogEventAction,
  CreateTaskAction,
  SendLinkedInDMAction,
} from './types';
import { db } from './database';
import { emailService } from './email-service';
import logger from '../utils/logger.js';

// ============================================================================
// LEAD QUERIES
// ============================================================================

/**
 * Get lead by ID
 */
export async function getLead(leadId: string): Promise<Lead | null> {
  return db.getLeadById(leadId);
}

/**
 * Get new leads for today (max 30)
 */
export async function getNewLeadsForToday(): Promise<Lead[]> {
  return db.getNewLeadsForToday(30);
}

/**
 * Get candidates for Cold 2 follow-up (3 days after Cold 1)
 */
export async function getCold2Candidates(): Promise<Lead[]> {
  return db.getCold2Candidates();
}

/**
 * Get candidates for Cold 3 follow-up (5 days after Cold 2)
 */
export async function getCold3Candidates(): Promise<Lead[]> {
  return db.getCold3Candidates();
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Action: Send email
 */
export async function sendEmail(action: SendEmailAction): Promise<void> {
  const { template_id, lead_id, variables = {} } = action;

  // Get lead
  const lead = await getLead(lead_id);
  if (!lead) {
    throw new Error(`Lead ${lead_id} not found`);
  }

  // Get template
  const template = await db.getEmailTemplate(template_id);
  if (!template) {
    throw new Error(`Template ${template_id} not found`);
  }

  // Get country-specific context
  const countryContext = await db.getCountryContext(lead.country);

  // Merge variables into template (including country_context)
  const allVariables = {
    ...variables,
    country_context: countryContext,
  };

  let subject = template.subject;
  let body = template.body;

  Object.entries(allVariables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
    body = body.replace(new RegExp(placeholder, 'g'), value);
  });

  // Send email via email service
  await emailService.send({
    to: lead.email,
    subject,
    body,
    lead_id,
  });

  console.log(`Email sent to ${lead.email} using template ${template_id}`);
}

/**
 * Action: Send LinkedIn DM
 */
export async function sendLinkedInDM(action: SendLinkedInDMAction): Promise<void> {
  const { template_id, lead_id, linkedin_url, variables = {} } = action;

  // Get lead
  const lead = await getLead(lead_id);
  if (!lead) {
    throw new Error(`Lead ${lead_id} not found`);
  }

  // Get template
  const template = await db.getEmailTemplate(template_id);
  if (!template) {
    throw new Error(`Template ${template_id} not found`);
  }

  // Get country-specific context
  const countryContext = await db.getCountryContext(lead.country);

  // Merge variables into template (including country_context)
  const allVariables = {
    ...variables,
    country_context: countryContext,
  };

  let message = template.body;

  Object.entries(allVariables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    message = message.replace(new RegExp(placeholder, 'g'), value);
  });

  // LinkedIn DM integration not yet implemented.
  // When ready: replace with PhantomBuster or LinkedIn Marketing API call.
  // For now: log the intent and skip sending.
  logger.warn({
    action: 'linkedin_dm_skipped',
    lead_id,
    linkedin_url,
    template_id,
    reason: 'LinkedIn API client not implemented — message prepared but not sent',
  });
  await logEvent({
    event_type: EventType.linkedin_dm_skipped,
    lead_id,
    metadata: { template_id, linkedin_url, message_length: message.length },
  });
}

/**
 * Action: Change state
 */
export async function changeState(action: ChangeStateAction): Promise<void> {
  const { new_state, lead_id } = action;

  await db.updateLeadState(lead_id, new_state);

  // Log state change event
  await logEvent({
    event_type: EventType.StateChanged,
    lead_id,
    metadata: { new_state },
  });

  console.log(`Lead ${lead_id} state changed to ${new_state}`);
}

/**
 * Action: Log event
 */
export async function logEvent(action: LogEventAction): Promise<void> {
  const { event_type, lead_id, metadata = {} } = action;

  await db.createEvent({
    lead_id,
    event_type,
    metadata,
  });

  console.log(`Event ${event_type} logged for lead ${lead_id}`);
}

/**
 * Action: Create task
 */
export async function createTask(action: CreateTaskAction): Promise<void> {
  const { owner, task_type, lead_id, description } = action;

  await db.createTask({
    lead_id,
    owner,
    task_type,
    description,
  });

  // Log task creation event
  await logEvent({
    event_type: EventType.TaskCreated,
    lead_id,
    metadata: { task_type, owner },
  });

  console.log(`Task created for lead ${lead_id}, owner: ${owner}`);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Update last engagement timestamp
 */
export async function updateLastEngagement(
  leadId: string,
  timestamp: Date
): Promise<void> {
  await db.updateLastEngagement(leadId, timestamp);
}

/**
 * Update Cold 1 sent timestamp
 */
export async function updateCold1SentAt(
  leadId: string,
  timestamp: Date
): Promise<void> {
  await db.updateCold1SentAt(leadId, timestamp);
}

/**
 * Update Cold 2 sent timestamp
 */
export async function updateCold2SentAt(
  leadId: string,
  timestamp: Date
): Promise<void> {
  await db.updateCold2SentAt(leadId, timestamp);
}

/**
 * Update Cold 3 sent timestamp
 */
export async function updateCold3SentAt(
  leadId: string,
  timestamp: Date
): Promise<void> {
  await db.updateCold3SentAt(leadId, timestamp);
}

/**
 * Store reply with intent analysis
 */
export async function storeReply(
  leadId: string,
  replyText: string,
  intent: ReplyIntent,
  confidence?: number
): Promise<void> {
  await db.createReply({
    lead_id: leadId,
    reply_text: replyText,
    intent,
    confidence,
  });
}
