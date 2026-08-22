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
// DWS INDUSTRY TYPES (matches argus.agent.ts SAR_SIGNATURES)
// ============================================================================

export type DwsIndustry =
  // Tier 1: Critical Emissions
  | 'construction-buildings'
  | 'power-heat-generation'
  | 'iron-steel'
  | 'cement-lime'
  | 'chemicals-petrochemicals'
  | 'aviation'
  | 'maritime-shipping'
  | 'road-transport-logistics'
  // Tier 2: Important Emissions
  | 'agriculture-livestock'
  | 'waste-management-recycling'
  | 'aluminium'
  | 'pulp-paper-printing'
  | 'petroleum-refining'
  | 'food-beverage'
  | 'glass-ceramics'
  | 'mining-quarrying'
  // Tier 3: Wedge Industries
  | 'fintech-trading'
  | 'pharma-biotech'
  | 'cybersecurity'
  | 'healthcare-medtech';

export interface TargetAccount {
  company: string;
  industry: DwsIndustry;
}

// ============================================================================
// ACCOUNT-BASED TARGETING RULES — ALL 20 DWS INDUSTRIES
//
// Tranche 1 (Q1/2026): 30 accounts — construction focus + key industrials
// Tranche 2 (Q2/2026): 50 accounts — expand across all Tier 1 industries
// Tranche 3 (H2/2026): 100 accounts — full 20-industry coverage
// ============================================================================

/**
 * Tranche 1: TOP 30 Accounts for Q1/2026 (January-March)
 * Focus: Construction + key industrials in Nordic & Central Europe
 */
export const TRANCHE_1: TargetAccount[] = [
  // --- construction-buildings (15) ---
  { company: 'NCC AB', industry: 'construction-buildings' },
  { company: 'Skanska AB', industry: 'construction-buildings' },
  { company: 'Peab AB', industry: 'construction-buildings' },
  { company: 'Veidekke ASA', industry: 'construction-buildings' },
  { company: 'YIT Oyj', industry: 'construction-buildings' },
  { company: 'AF Gruppen', industry: 'construction-buildings' },
  { company: 'STRABAG SE', industry: 'construction-buildings' },
  { company: 'PORR AG', industry: 'construction-buildings' },
  { company: 'HOCHTIEF AG', industry: 'construction-buildings' },
  { company: 'Implenia', industry: 'construction-buildings' },
  { company: 'Budimex', industry: 'construction-buildings' },
  { company: 'BESIX Group', industry: 'construction-buildings' },
  { company: 'VINCI Construction', industry: 'construction-buildings' },
  { company: 'Bouygues Construction', industry: 'construction-buildings' },
  { company: 'Eiffage', industry: 'construction-buildings' },

  // --- iron-steel (3) ---
  { company: 'SSAB AB', industry: 'iron-steel' },
  { company: 'Outokumpu Oyj', industry: 'iron-steel' },
  { company: 'voestalpine AG', industry: 'iron-steel' },

  // --- cement-lime (3) ---
  { company: 'HeidelbergCement AG', industry: 'cement-lime' },
  { company: 'Holcim Group', industry: 'cement-lime' },
  { company: 'Cemex (EU operations)', industry: 'cement-lime' },

  // --- power-heat-generation (3) ---
  { company: 'Fortum Oyj', industry: 'power-heat-generation' },
  { company: 'Vattenfall AB', industry: 'power-heat-generation' },
  { company: 'Ørsted A/S', industry: 'power-heat-generation' },

  // --- chemicals-petrochemicals (3) ---
  { company: 'BASF SE', industry: 'chemicals-petrochemicals' },
  { company: 'Neste Oyj', industry: 'chemicals-petrochemicals' },
  { company: 'Borealis AG', industry: 'chemicals-petrochemicals' },

  // --- pulp-paper-printing (3) ---
  { company: 'UPM-Kymmene Oyj', industry: 'pulp-paper-printing' },
  { company: 'Stora Enso Oyj', industry: 'pulp-paper-printing' },
  { company: 'Metsä Group', industry: 'pulp-paper-printing' },
];

/**
 * Tranche 2: TOP 50 Accounts for Q2/2026 (April-June)
 * Expands Tranche 1 with 20 accounts across more industries
 */
export const TRANCHE_2: TargetAccount[] = [
  ...TRANCHE_1,

  // --- construction-buildings (5 more) ---
  { company: 'Bilfinger SE', industry: 'construction-buildings' },
  { company: 'Heijmans', industry: 'construction-buildings' },
  { company: 'Ferrovial', industry: 'construction-buildings' },
  { company: 'Acciona', industry: 'construction-buildings' },
  { company: 'Webuild', industry: 'construction-buildings' },

  // --- maritime-shipping (3) ---
  { company: 'A.P. Møller-Mærsk', industry: 'maritime-shipping' },
  { company: 'Hapag-Lloyd AG', industry: 'maritime-shipping' },
  { company: 'CMA CGM Group', industry: 'maritime-shipping' },

  // --- aviation (2) ---
  { company: 'Finnair Oyj', industry: 'aviation' },
  { company: 'SAS AB', industry: 'aviation' },

  // --- petroleum-refining (2) ---
  { company: 'Neste (refining division)', industry: 'petroleum-refining' },
  { company: 'PKN Orlen', industry: 'petroleum-refining' },

  // --- road-transport-logistics (3) ---
  { company: 'DSV A/S', industry: 'road-transport-logistics' },
  { company: 'DB Schenker', industry: 'road-transport-logistics' },
  { company: 'Kuehne+Nagel', industry: 'road-transport-logistics' },

  // --- food-beverage (3) ---
  { company: 'Valio Oy', industry: 'food-beverage' },
  { company: 'Arla Foods', industry: 'food-beverage' },
  { company: 'Fazer Group', industry: 'food-beverage' },

  // --- waste-management-recycling (2) ---
  { company: 'Veolia (Nordic)', industry: 'waste-management-recycling' },
  { company: 'Fortum Waste Solutions', industry: 'waste-management-recycling' },
];

/**
 * Tranche 3: TOP 100 Accounts for H2/2026 (July-December)
 * Full 20-industry coverage across EU
 */
export const TRANCHE_3: TargetAccount[] = [
  ...TRANCHE_2,

  // --- construction-buildings (10 more) ---
  { company: 'SRV Group', industry: 'construction-buildings' },
  { company: 'Caverion', industry: 'construction-buildings' },
  { company: 'Sweco', industry: 'construction-buildings' },
  { company: 'Goldbeck', industry: 'construction-buildings' },
  { company: 'Balfour Beatty', industry: 'construction-buildings' },
  { company: 'BAM Group', industry: 'construction-buildings' },
  { company: 'Merko Ehitus', industry: 'construction-buildings' },
  { company: 'Sacyr', industry: 'construction-buildings' },
  { company: 'Mirbud', industry: 'construction-buildings' },
  { company: 'Leonhard Weiss', industry: 'construction-buildings' },

  // --- iron-steel (3 more) ---
  { company: 'ArcelorMittal (EU)', industry: 'iron-steel' },
  { company: 'Salzgitter AG', industry: 'iron-steel' },
  { company: 'Tata Steel Europe', industry: 'iron-steel' },

  // --- cement-lime (2 more) ---
  { company: 'Buzzi Unicem', industry: 'cement-lime' },
  { company: 'CRH plc', industry: 'cement-lime' },

  // --- chemicals-petrochemicals (3 more) ---
  { company: 'Evonik Industries', industry: 'chemicals-petrochemicals' },
  { company: 'Kemira Oyj', industry: 'chemicals-petrochemicals' },
  { company: 'Yara International', industry: 'chemicals-petrochemicals' },

  // --- power-heat-generation (3 more) ---
  { company: 'Enel SpA', industry: 'power-heat-generation' },
  { company: 'E.ON SE', industry: 'power-heat-generation' },
  { company: 'Iberdrola', industry: 'power-heat-generation' },

  // --- aviation (3 more) ---
  { company: 'Lufthansa Group', industry: 'aviation' },
  { company: 'Air France-KLM', industry: 'aviation' },
  { company: 'Norwegian Air Shuttle', industry: 'aviation' },

  // --- maritime-shipping (2 more) ---
  { company: 'Wallenius Wilhelmsen', industry: 'maritime-shipping' },
  { company: 'Viking Line', industry: 'maritime-shipping' },

  // --- road-transport-logistics (2 more) ---
  { company: 'PostNord AB', industry: 'road-transport-logistics' },
  { company: 'Posti Group', industry: 'road-transport-logistics' },

  // --- agriculture-livestock (3) ---
  { company: 'Danish Crown', industry: 'agriculture-livestock' },
  { company: 'HKScan Oyj', industry: 'agriculture-livestock' },
  { company: 'Atria Oyj', industry: 'agriculture-livestock' },

  // --- waste-management-recycling (2 more) ---
  { company: 'SUEZ (Nordic)', industry: 'waste-management-recycling' },
  { company: 'Ragn-Sells', industry: 'waste-management-recycling' },

  // --- aluminium (3) ---
  { company: 'Norsk Hydro ASA', industry: 'aluminium' },
  { company: 'Alcoa (Norway)', industry: 'aluminium' },
  { company: 'Granges AB', industry: 'aluminium' },

  // --- pulp-paper-printing (2 more) ---
  { company: 'SCA (Svenska Cellulosa)', industry: 'pulp-paper-printing' },
  { company: 'Sappi (EU operations)', industry: 'pulp-paper-printing' },

  // --- petroleum-refining (2 more) ---
  { company: 'TotalEnergies (EU refining)', industry: 'petroleum-refining' },
  { company: 'Repsol', industry: 'petroleum-refining' },

  // --- food-beverage (2 more) ---
  { company: 'Orkla ASA', industry: 'food-beverage' },
  { company: 'Paulig Group', industry: 'food-beverage' },

  // --- glass-ceramics (2) ---
  { company: 'Saint-Gobain', industry: 'glass-ceramics' },
  { company: 'Schott AG', industry: 'glass-ceramics' },

  // --- mining-quarrying (2) ---
  { company: 'Boliden AB', industry: 'mining-quarrying' },
  { company: 'LKAB', industry: 'mining-quarrying' },

  // --- fintech-trading (2) ---
  { company: 'Nasdaq Nordic', industry: 'fintech-trading' },
  { company: 'Adyen NV', industry: 'fintech-trading' },

  // --- pharma-biotech (2) ---
  { company: 'Novo Nordisk', industry: 'pharma-biotech' },
  { company: 'Orion Oyj', industry: 'pharma-biotech' },

  // --- cybersecurity (1) ---
  { company: 'WithSecure Oyj', industry: 'cybersecurity' },

  // --- healthcare-medtech (1) ---
  { company: 'Coloplast A/S', industry: 'healthcare-medtech' },
];

// ============================================================================
// BACKWARD-COMPATIBLE FLAT LISTS (company names only)
// ============================================================================

/** Flat company name list for Tranche 1 */
export const TOP_30_Q1 = TRANCHE_1.map((a) => a.company);

/** Flat company name list for Tranche 2 */
export const TOP_50_Q2 = TRANCHE_2.map((a) => a.company);

/** Flat company name list for Tranche 3 */
export const TOP_100_H2 = TRANCHE_3.map((a) => a.company);

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
 * ULTRA/HIGH = strategic accounts across all industries
 */
export function getAccountPriority(company: string): string {
  const ultraPriority = [
    'NCC AB', 'Skanska AB', 'STRABAG SE', 'HOCHTIEF AG',  // construction
    'SSAB AB', 'BASF SE', 'Fortum Oyj', 'UPM-Kymmene Oyj', // industrial
  ];
  const highPriority = [
    'Peab AB', 'Veidekke ASA', 'YIT Oyj', 'Implenia',     // construction
    'Outokumpu Oyj', 'HeidelbergCement AG', 'Neste Oyj',   // industrial
    'A.P. Møller-Mærsk', 'Norsk Hydro ASA',                // maritime/aluminium
  ];

  const normalized = company.trim();

  if (ultraPriority.indexOf(normalized) >= 0) return 'ULTRA';
  if (highPriority.indexOf(normalized) >= 0) return 'HIGH';

  // Tranche 1 accounts are MEDIUM priority
  if (TOP_30_Q1.indexOf(normalized) >= 0) return 'MEDIUM';

  // Tranche 2/3 expansion accounts are LOW priority
  if (TOP_50_Q2.indexOf(normalized) >= 0) return 'LOW';
  if (TOP_100_H2.indexOf(normalized) >= 0) return 'LOW';

  return 'LOW';
}

/**
 * Get account industry classification
 */
export function getAccountIndustry(company: string): DwsIndustry | null {
  const normalized = company.trim().toLowerCase();
  const account = TRANCHE_3.find(
    (a) => a.company.toLowerCase() === normalized
  );
  return account ? account.industry : null;
}

/**
 * Get all target accounts for a specific industry in current tranche
 */
export function getAccountsByIndustry(industry: DwsIndustry): TargetAccount[] {
  const currentAccounts = getCurrentTargetAccountsFull();
  return currentAccounts.filter((a) => a.industry === industry);
}

/**
 * Get current target account list with industry metadata
 */
export function getCurrentTargetAccountsFull(): TargetAccount[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (year === 2026 && month >= 1 && month <= 3) return TRANCHE_1;
  if (year === 2026 && month >= 4 && month <= 6) return TRANCHE_2;
  if (year === 2026 && month >= 7) return TRANCHE_3;

  return TRANCHE_1;
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
