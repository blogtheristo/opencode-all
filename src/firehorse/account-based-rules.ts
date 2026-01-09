/**
 * Firehorse Omnichannel Next Pilot - Account-Based Rules
 *
 * GOLDEN RULE:
 * No outbound to companies outside:
 * - TOP 30 (Q1/2026)
 * - TOP 50 (Q2/2026)
 * - TOP 100 (H2/2026)
 *
 * Volume only inside target account list.
 * Multi-threading 5-10 contacts per account.
 */

import { db } from './database';
import { Lead, LeadCountry } from './types';

// ============================================================================
// ACCOUNT-BASED TARGETING RULES
// ============================================================================

/**
 * TOP 30 Accounts for Q1/2026 (January-March)
 */
export const TOP_30_Q1 = [
  // Nordic Tier 1
  'NCC AB',
  'Skanska AB',
  'Peab AB',
  'Veidekke ASA',
  'YIT Oyj',
  'AF Gruppen',
  'MT Højgaard',
  'JM AB',
  'Caverion',
  'Sweco',
  'Ramboll',
  'COWI',
  'Per Aarsleff',
  'SRV Group',
  'Consti Yhtiöt',

  // Central Europe Tier 1
  'PORR AG',
  'STRABAG SE',
  'HOCHTIEF AG',
  'Implenia',
  'Bilfinger SE',
  'Budimex',
  'Heijmans',
  'BESIX Group',
  'Ferrovial',
  'Acciona',
  'Webuild',
  'Mace',
  'Bouygues Construction',
  'VINCI Construction',
  'Eiffage',
];

/**
 * Get current target account list based on quarter
 */
export function getCurrentTargetAccounts(): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12

  // Q1 2026 (January-March)
  if (year === 2026 && month >= 1 && month <= 3) {
    return TOP_30_Q1;
  }

  // Q2 2026 (April-June) - Expand to TOP 50
  if (year === 2026 && month >= 4 && month <= 6) {
    // TODO: Add TOP_50_Q2 list
    return TOP_30_Q1; // Placeholder
  }

  // H2 2026 (July-December) - Expand to TOP 100
  if (year === 2026 && month >= 7) {
    // TODO: Add TOP_100_H2 list
    return TOP_30_Q1; // Placeholder
  }

  // Default: Use Q1 list
  return TOP_30_Q1;
}

/**
 * Validate if company is in current target account list
 */
export function isTargetAccount(company: string): boolean {
  const targetAccounts = getCurrentTargetAccounts();

  // Normalize company name for comparison
  const normalizedCompany = company.trim().toLowerCase();

  return targetAccounts.some(
    (target) => target.toLowerCase() === normalizedCompany
  );
}

/**
 * Enforce account-based rule when creating lead
 * Throws error if company not in target list
 */
export function enforceAccountBasedRule(company: string): void {
  if (!isTargetAccount(company)) {
    const currentPeriod = getCurrentPeriod();
    const targetList = getCurrentTargetAccounts();

    throw new Error(
      `ACCOUNT-BASED RULE VIOLATION: "${company}" is not in ${currentPeriod} target account list.\n` +
      `Only outbound to companies in: ${targetList.join(', ')}\n` +
      `GOLDEN RULE: No outbound outside target account list.`
    );
  }
}

/**
 * Get current period label
 */
function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (year === 2026 && month >= 1 && month <= 3) return 'TOP 30 (Q1/2026)';
  if (year === 2026 && month >= 4 && month <= 6) return 'TOP 50 (Q2/2026)';
  if (year === 2026 && month >= 7) return 'TOP 100 (H2/2026)';

  return 'TOP 30 (Default)';
}

/**
 * Get account priority (ULTRA, HIGH, MEDIUM, LOW)
 */
export function getAccountPriority(company: string): string {
  const ultraPriority = ['NCC AB', 'Skanska AB', 'PORR AG', 'STRABAG SE', 'HOCHTIEF AG'];
  const highPriority = ['Peab AB', 'Veidekke ASA', 'YIT Oyj', 'Implenia', 'Bilfinger SE'];

  const normalized = company.trim();

  if (ultraPriority.includes(normalized)) return 'ULTRA';
  if (highPriority.includes(normalized)) return 'HIGH';

  // Default based on position in list
  const index = TOP_30_Q1.indexOf(normalized);
  if (index >= 0 && index < 20) return 'MEDIUM';

  return 'LOW';
}

/**
 * Get recommended contacts per account based on priority
 */
export function getRecommendedContactsPerAccount(company: string): number {
  const priority = getAccountPriority(company);

  switch (priority) {
    case 'ULTRA': return 8;
    case 'HIGH': return 6;
    case 'MEDIUM': return 5;
    case 'LOW': return 4;
    default: return 5;
  }
}

/**
 * Check if account has reached max contacts (multi-threading limit)
 */
export async function hasReachedMaxContacts(company: string): Promise<boolean> {
  const maxContacts = getRecommendedContactsPerAccount(company);
  const currentCount = await db.getContactCountByCompany(company);

  return currentCount >= maxContacts;
}

/**
 * Get account outreach statistics
 */
export async function getAccountStats(company: string): Promise<{
  company: string;
  priority: string;
  max_contacts: number;
  current_contacts: number;
  remaining_contacts: number;
  acceptance_rate: number;
  demos_booked: number;
  proposals_sent: number;
}> {
  const priority = getAccountPriority(company);
  const maxContacts = getRecommendedContactsPerAccount(company);
  const currentContacts = await db.getContactCountByCompany(company);
  const acceptanceRate = await db.getAcceptanceRateByCompany(company);
  const demosBooked = await db.getDemosBookedByCompany(company);
  const proposalsSent = await db.getProposalsSentByCompany(company);

  return {
    company,
    priority,
    max_contacts: maxContacts,
    current_contacts: currentContacts,
    remaining_contacts: Math.max(0, maxContacts - currentContacts),
    acceptance_rate: acceptanceRate,
    demos_booked: demosBooked,
    proposals_sent: proposalsSent,
  };
}
