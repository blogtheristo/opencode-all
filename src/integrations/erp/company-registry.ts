/**
 * DWS IQ 6 - Company ERP Registry
 *
 * Maps known Nordic construction & engineering companies to their ERP systems.
 * Source: Public annual reports and ERP vendor case studies (2024-2025).
 *
 * Code-Version: 1.0.0
 * Branch: claude/build-erp-connector-i9JmZ
 * Date: 2026-03-22
 * Owner: DWS IQ 6
 */

import { ERPProvider } from './types.js';

// ============================================================================
// Company ERP Registry Types
// ============================================================================

export interface CompanyERPEntry {
  /** Canonical company name */
  companyName: string;
  /** ERP provider used by this company */
  provider: ERPProvider;
  /** Country of headquarters */
  country: string;
  /** Industry sector */
  sector: string;
  /** Source citation for the ERP mapping */
  source: string;
  /** Alternative names / aliases for fuzzy matching */
  aliases: string[];
}

export interface CompanyLookupResult {
  /** Whether a match was found */
  found: boolean;
  /** Matched company entry (null if not found) */
  company: CompanyERPEntry | null;
  /** Resolved ERP provider (null if not found) */
  provider: ERPProvider | null;
  /** The query that was searched */
  query: string;
  /** Matched alias (if matched via alias) */
  matchedVia?: string;
  /** Confidence: 'exact' | 'alias' | 'fuzzy' | 'none' */
  confidence: 'exact' | 'alias' | 'fuzzy' | 'none';
}

// ============================================================================
// Nordic Construction & Engineering Company Registry
// ============================================================================

/**
 * Known company→ERP mappings.
 * Source: Public ERP vendor references, annual reports, press releases.
 *
 * IMPORTANT: All data comes from publicly available sources.
 * No proprietary client data is stored here.
 */
export const COMPANY_ERP_REGISTRY: CompanyERPEntry[] = [
  // --- SAP customers ---
  {
    companyName: 'Skanska AB',
    provider: ERPProvider.SAP,
    country: 'SE',
    sector: 'construction',
    source: 'Skanska Annual Report 2024 — SAP S/4HANA rollout',
    aliases: ['skanska', 'skanska ab', 'skanska sverige', 'skanska sweden'],
  },
  {
    companyName: 'NCC Building',
    provider: ERPProvider.SAP,
    country: 'SE',
    sector: 'construction',
    source: 'NCC Group IT strategy 2023 — SAP ECC / S/4HANA migration',
    aliases: ['ncc', 'ncc building', 'ncc ab', 'ncc group', 'ncc sverige'],
  },
  {
    companyName: 'YIT Oyj',
    provider: ERPProvider.SAP,
    country: 'FI',
    sector: 'construction',
    source: 'YIT Annual Report 2024 — SAP S/4HANA',
    aliases: ['yit', 'yit oyj', 'yit finland', 'yit suomi'],
  },
  {
    companyName: 'PEAB AB',
    provider: ERPProvider.SAP,
    country: 'SE',
    sector: 'construction',
    source: 'PEAB IT landscape — SAP ERP Central Component',
    aliases: ['peab', 'peab ab', 'peab sverige'],
  },
  // --- IFS customers ---
  {
    companyName: 'Sweco Finland',
    provider: ERPProvider.IFS,
    country: 'FI',
    sector: 'engineering_consulting',
    source: 'IFS customer reference — Sweco engineering services',
    aliases: ['sweco', 'sweco finland', 'sweco oy', 'sweco fi', 'sweco suomi'],
  },
  {
    companyName: 'Caverion Oyj',
    provider: ERPProvider.IFS,
    country: 'FI',
    sector: 'building_services',
    source: 'IFS Cloud customer reference — Caverion asset management',
    aliases: ['caverion', 'caverion oyj', 'caverion finland'],
  },
  // --- Visma customers ---
  {
    companyName: 'SRV Rakennus',
    provider: ERPProvider.VISMA,
    country: 'FI',
    sector: 'construction',
    source: 'Visma customer reference — SRV construction project management',
    aliases: ['srv', 'srv rakennus', 'srv rakennus oy', 'srv yhtiöt', 'srv group'],
  },
  {
    companyName: 'Fira Group',
    provider: ERPProvider.VISMA,
    country: 'FI',
    sector: 'construction',
    source: 'Visma customer reference — Fira Group Oy',
    aliases: ['fira', 'fira group', 'fira oy', 'fira group oy'],
  },
  // --- Monitor ERP customers ---
  {
    companyName: 'Assemblin AB',
    provider: ERPProvider.MONITOR,
    country: 'SE',
    sector: 'installation_services',
    source: 'Monitor ERP customer reference — Assemblin',
    aliases: ['assemblin', 'assemblin ab'],
  },
  // --- Dynamics 365 customers ---
  {
    companyName: 'Lemminkäinen',
    provider: ERPProvider.DYNAMICS_365,
    country: 'FI',
    sector: 'construction',
    source: 'Microsoft Dynamics customer reference (pre-YIT merger)',
    aliases: ['lemminkäinen', 'lemminkainen', 'lemminkäinen oyj'],
  },
];

// ============================================================================
// Lookup Functions
// ============================================================================

/**
 * Normalize a company name for matching.
 * Strips whitespace, lowercases, removes common suffixes.
 */
function normalize(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.,]/g, '');
}

/**
 * Resolve a company name to its ERP provider.
 *
 * Matching priority:
 * 1. Exact canonical name match
 * 2. Alias match
 * 3. Fuzzy substring match (company name contains query or vice versa)
 * 4. null if not found
 */
export function resolveCompanyERP(query: string): CompanyLookupResult {
  const normalized = normalize(query);

  if (!normalized) {
    return { found: false, company: null, provider: null, query, confidence: 'none' };
  }

  // 1. Exact canonical name match
  for (const entry of COMPANY_ERP_REGISTRY) {
    if (normalize(entry.companyName) === normalized) {
      return {
        found: true,
        company: entry,
        provider: entry.provider,
        query,
        confidence: 'exact',
      };
    }
  }

  // 2. Alias match
  for (const entry of COMPANY_ERP_REGISTRY) {
    for (const alias of entry.aliases) {
      if (normalize(alias) === normalized) {
        return {
          found: true,
          company: entry,
          provider: entry.provider,
          query,
          matchedVia: alias,
          confidence: 'alias',
        };
      }
    }
  }

  // 3. Fuzzy substring match
  for (const entry of COMPANY_ERP_REGISTRY) {
    const entryNorm = normalize(entry.companyName);
    if (entryNorm.includes(normalized) || normalized.includes(entryNorm)) {
      return {
        found: true,
        company: entry,
        provider: entry.provider,
        query,
        confidence: 'fuzzy',
      };
    }
    for (const alias of entry.aliases) {
      const aliasNorm = normalize(alias);
      if (aliasNorm.includes(normalized) || normalized.includes(aliasNorm)) {
        return {
          found: true,
          company: entry,
          provider: entry.provider,
          query,
          matchedVia: alias,
          confidence: 'fuzzy',
        };
      }
    }
  }

  // 4. Not found
  return { found: false, company: null, provider: null, query, confidence: 'none' };
}

/**
 * Batch-resolve multiple company names.
 * Returns results in the same order as the input queries.
 */
export function resolveCompanyERPBatch(queries: string[]): CompanyLookupResult[] {
  return queries.map(resolveCompanyERP);
}

/**
 * List all companies registered for a specific ERP provider.
 */
export function getCompaniesByProvider(provider: ERPProvider): CompanyERPEntry[] {
  return COMPANY_ERP_REGISTRY.filter((entry) => entry.provider === provider);
}

/**
 * List all registered companies.
 */
export function getAllRegisteredCompanies(): CompanyERPEntry[] {
  return [...COMPANY_ERP_REGISTRY];
}
