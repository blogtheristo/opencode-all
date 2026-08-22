/**
 * Firehorse Omnichannel Next Pilot - LinkedIn Workflow
 * Human-in-the-loop LinkedIn automation
 */

import { db } from './database';
import { type Lead } from './types';
import logger from '../utils/logger.js';

// ============================================================================
// LINKEDIN CONNECTION WORKFLOW
// ============================================================================

export interface LinkedInConnectionRequest {
  lead_id: string;
  note_text: string;
  linkedin_url: string;
}

/**
 * Mark LinkedIn connection request as sent
 */
export async function markLinkedInRequestSent(
  request: LinkedInConnectionRequest
): Promise<void> {
  const { lead_id, note_text, linkedin_url } = request;

  // Update lead
  await db.updateLinkedInStatus(lead_id, 'request_sent', note_text);

  // Log activity
  await db.createLinkedInActivity({
    lead_id,
    activity_type: 'connection_request',
    note_text,
    linkedin_url,
    performed_by: 'Risto',
  });

  logger.info(`✅ LinkedIn connection request sent to lead ${lead_id}`);
}

/**
 * Mark LinkedIn connection as accepted
 */
export async function markLinkedInAccepted(lead_id: string): Promise<void> {
  await db.updateLinkedInStatus(lead_id, 'accepted');

  // Log activity
  await db.createLinkedInActivity({
    lead_id,
    activity_type: 'connection_accepted',
    performed_by: 'System',
  });

  logger.info(`✅ LinkedIn connection accepted for lead ${lead_id}`);
}

/**
 * Send LinkedIn DM (after connection accepted)
 */
export async function sendLinkedInFollowUpDM(
  lead_id: string,
  message_text: string
): Promise<void> {
  // Log activity
  await db.createLinkedInActivity({
    lead_id,
    activity_type: 'message_sent',
    message_text,
    performed_by: 'Risto',
  });

  logger.info(`✅ LinkedIn DM sent to lead ${lead_id}`);
}

/**
 * Get leads ready for LinkedIn outreach (prioritized by revenue)
 */
export async function getLinkedInPendingLeads(limit: number = 20): Promise<Lead[]> {
  return db.getLinkedInPendingLeads(limit);
}

/**
 * Generate LinkedIn connection note from template
 */
export function generateLinkedInNote(lead: Lead, language: 'en' | 'fi' | 'se' = 'en'): string {
  const firstName = lead.first_name || 'there';
  const company = lead.company || 'your company';
  const title = lead.title || 'operations';

  if (language === 'fi') {
    return `Hei ${firstName},

Näen että vastaat ${title.toLowerCase()} ${company}ssa. Rakennamme DWS IQ 6:ta – mobiili ohjauspöytä koko portfolion SPI/CPI-, turvallisuus- ja Fit for 55 -seurantaan.

Etsin 1–2 pilottikumppania Pohjoismaissa (5 kk, 29 950 €). Kiinnostaako nopea demo?

Ystävällisin terveisin,
Risto Päärni
+358 400 319 010
Demo: https://j6prmljgpvnia.ok.kimi.link/`;
  } else if (language === 'se') {
    return `Hej ${firstName},

Jag ser att du leder ${title.toLowerCase()} på ${company}. Vi utvecklar DWS IQ 6 – ett mobilt styrtorn för portföljen med realtidsöversikt över SPI/CPI, säkerhet och Fit for 55.

Söker 1–2 pilotpartners i Norden (5 månader, 29 950 €). Öppen för en snabb demo?

Vänliga hälsningar,
Risto Päärni
+358 400 319 010
Demo: https://j6prmljgpvnia.ok.kimi.link/`;
  } else {
    // English (default)
    return `Hi ${firstName},

I see you're leading ${title.toLowerCase()} at ${company}. We're building DWS IQ 6 – a mobile portfolio control room for real-time SPI/CPI, safety & Fit for 55 steering.

Looking for 1–2 Nordic pilot partners (5 months, 29,950 €). Open for a quick demo?

Best,
Risto Päärni
+358 400 319 010
Demo: https://j6prmljgpvnia.ok.kimi.link/`;
  }
}
