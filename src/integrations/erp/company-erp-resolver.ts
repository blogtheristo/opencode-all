/**
 * DWS IQ 6 - Company ERP Resolver
 *
 * Resolves a company name to its known ERP provider.
 * Returns null for unknown companies (manual check required).
 *
 * Code-Version: 1.0.0
 * Date: 2026-03-22
 * Owner: DWS IQ 6
 */

import pino from 'pino';
import { type ERPProvider } from './types.js';
import { COMPANY_ERP_REGISTRY, type CompanyERPEntry } from './company-erp-registry.js';

const logger = pino({ name: 'company-erp-resolver' });

// ============================================================================
// Resolution Result
// ============================================================================

export interface CompanyERPResolution {
  /** Input company name */
  query: string;
  /** Whether the company was found in the registry */
  found: boolean;
  /** Resolved ERP provider, null if unknown */
  erpProvider: ERPProvider | null;
  /** Matched registry entry (if found) */
  company?: CompanyERPEntry;
  /** Confidence: 'exact' | 'alias' | 'fuzzy' */
  matchType?: 'exact' | 'alias';
  /** Warning for unknown companies */
  warning?: string;
}

// ============================================================================
// Resolver
// ============================================================================

/**
 * Resolve a company name to its ERP provider.
 *
 * Matching order:
 * 1. Exact match on canonical name (case-insensitive)
 * 2. Alias match (case-insensitive)
 * 3. Not found → return null with warning
 */
export function resolveCompanyERP(companyName: string): CompanyERPResolution {
  const normalized = companyName.trim().toLowerCase();

  // 1. Exact match on canonical name
  for (const entry of COMPANY_ERP_REGISTRY) {
    if (entry.name.toLowerCase() === normalized) {
      logger.info({
        query: companyName,
        provider: entry.erpProvider
      }, 'Company ERP resolved (exact)');
      return {
        query: companyName,
        found: true,
        erpProvider: entry.erpProvider,
        company: entry,
        matchType: 'exact'
      };
    }
  }

  // 2. Alias match
  for (const entry of COMPANY_ERP_REGISTRY) {
    if (entry.aliases.some(alias => alias.toLowerCase() === normalized)) {
      logger.info({
        query: companyName,
        provider: entry.erpProvider,
        matchedAs: entry.name
      }, 'Company ERP resolved (alias)');
      return {
        query: companyName,
        found: true,
        erpProvider: entry.erpProvider,
        company: entry,
        matchType: 'alias'
      };
    }
  }

  // 3. Not found
  logger.warn({
    query: companyName
  }, 'Company ERP not found — manual check required');
  return {
    query: companyName,
    found: false,
    erpProvider: null,
    warning: `Unknown company "${companyName}" — ERP not in registry. Tarkista käsin.`
  };
}

/**
 * Resolve multiple companies at once.
 * Returns structured results for each, preserving order.
 */
export function resolveCompanyERPBatch(
  companyNames: string[]
): CompanyERPResolution[] {
  return companyNames.map(name => resolveCompanyERP(name));
}

/**
 * List all known companies in the registry.
 */
export function listRegisteredCompanies(): CompanyERPEntry[] {
  return [...COMPANY_ERP_REGISTRY];
}
