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
 * Daily send cap: 20 outbound messages per day.
 */

import { db } from './database';
import { Lead, LeadCountry } from './types';

// ============================================================================
// DAILY SEND LIMITS
// ============================================================================

/** Maximum outbound messages per day */
export const DAILY_SEND_LIMIT = 20;

/**
 * Check if daily send limit has been reached
 */
export async function hasReachedDailySendLimit(): Promise<boolean> {
  const todaySends = await db.getTodaySendCount();
  return todaySends >= DAILY_SEND_LIMIT;
}

/**
 * Get remaining sends for today
 */
export async function getRemainingSendsToday(): Promise<number> {
  const todaySends = await db.getTodaySendCount();
  return Math.max(0, DAILY_SEND_LIMIT - todaySends);
}

/**
 * Enforce daily send limit before sending outbound message.
 * Throws error if limit reached.
 */
export async function enforceDailySendLimit(): Promise<void> {
  const remaining = await getRemainingSendsToday();
  if (remaining <= 0) {
    throw new Error(
      `DAILY SEND LIMIT REACHED: ${DAILY_SEND_LIMIT} messages already sent today.\n` +
      `Wait until tomorrow to send more outbound messages.`
    );
  }
}

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
 * TOP 50 Accounts for Q2/2026 (April-June)
 * Expands TOP 30 with 20 additional EU construction companies
 */
export const TOP_50_Q2 = [
  ...TOP_30_Q1,

  // Nordic Tier 2
  'Lemminkäinen',
  'Fira Group',
  'Lehto Group',
  'Bonava AB',
  'Wästbygg Gruppen',
  'Serneke Group',
  'Hent AS',
  'Kruse Smith',

  // Central Europe Tier 2
  'BAM Group',
  'VolkerWessels',
  'Goldbeck',
  'Züblin (STRABAG)',
  'Warbud',
  'Erbud',
  'CFE Group',
  'Drees & Sommer',
  'Sacyr',
  'Dragados',
  'Salini Impregilo',
  'Astaldi',
];

/**
 * TOP 100 Accounts for H2/2026 (July-December)
 * Expands TOP 50 with 50 additional EU construction companies
 */
export const TOP_100_H2 = [
  ...TOP_50_Q2,

  // Nordic Tier 3
  'Hartela',
  'Rakennusliike Reponen',
  'Jakon Rakennus',
  'JL-Rakentajat',
  'Sikla Group',
  'Assemblin',
  'Bravida',
  'Instalco',
  'Nyab Oyj',
  'Destia',

  // UK & Ireland
  'Balfour Beatty',
  'Kier Group',
  'Morgan Sindall',
  'Wates Group',
  'Laing O\'Rourke',
  'BAM Construct UK',
  'Willmott Dixon',
  'ISG',
  'John Sisk & Son',
  'Mercury Engineering',

  // DACH Region
  'Zech Group',
  'Max Bögl',
  'Lindner Group',
  'Bauer AG',
  'Swietelsky',
  'Habau Group',
  'Rhomberg Bau',
  'Losinger Marazzi',
  'Allplan',
  'Doka Group',

  // Iberia & Italy
  'FCC Construcción',
  'ACS Group',
  'OHL',
  'Técnicas Reunidas',
  'Aldesa',
  'Pizzarotti',
  'Ghella',
  'CMC Ravenna',
  'Itinera',
  'Rizzani de Eccher',

  // Benelux & France
  'Dura Vermeer',
  'TBI Holdings',
  'Van Oord',
  'Boskalis',
  'Eiffage Énergie',
  'NGE',
  'Spie',
  'Colas',
  'Demathieu Bard',
  'Rabot Dutilleul',
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
    return TOP_50_Q2;
  }

  // H2 2026 (July-December) - Expand to TOP 100
  if (year === 2026 && month >= 7) {
    return TOP_100_H2;
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

  if (ultraPriority.indexOf(normalized) >= 0) return 'ULTRA';
  if (highPriority.indexOf(normalized) >= 0) return 'HIGH';

  // TOP 30 accounts are MEDIUM priority
  if (TOP_30_Q1.indexOf(normalized) >= 0) return 'MEDIUM';

  // TOP 50 expansion accounts are LOW priority
  if (TOP_50_Q2.indexOf(normalized) >= 0) return 'LOW';

  // TOP 100 expansion accounts are also LOW
  if (TOP_100_H2.indexOf(normalized) >= 0) return 'LOW';

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
