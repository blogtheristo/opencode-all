/**
 * Firehorse Omnichannel Next Pilot - Helper Functions
 * CustomerPilotLoop v1
 */

import { LeadCountry } from './types';

/**
 * Get LinkedIn DM template ID based on country
 */
export function getLinkedInDMTemplateForCountry(country: LeadCountry): string {
  switch (country) {
    case LeadCountry.SE:
      return 'CustomerPilot_LinkedIn_DM_SE';
    case LeadCountry.DE:
      return 'CustomerPilot_LinkedIn_DM_DE';
    case LeadCountry.FI:
    case LeadCountry.NO:
    case LeadCountry.DK:
    default:
      return 'CustomerPilot_LinkedIn_DM_General';
  }
}

/**
 * Get email template ID based on country
 */
export function getEmailTemplateForCountry(
  country: LeadCountry,
  sequence: 'cold1' | 'cold2' | 'cold3'
): string {
  if (sequence === 'cold1') {
    return country === LeadCountry.FI
      ? 'CustomerPilot_Cold1_FI'
      : 'CustomerPilot_Cold1_EN';
  } else if (sequence === 'cold2') {
    return 'CustomerPilot_Cold2_Reminder';
  } else {
    return 'CustomerPilot_Cold3_CloseLoop';
  }
}

/**
 * Validate LinkedIn URL
 */
export function isValidLinkedInUrl(url: string): boolean {
  const linkedInPattern =
    /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|company)\/[a-zA-Z0-9_-]+\/?/;
  return linkedInPattern.test(url);
}

/**
 * Extract first name from full name
 */
export function extractFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0];
}
