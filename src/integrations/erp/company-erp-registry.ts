/**
 * DWS IQ 6 - Company ERP Registry
 *
 * Maps known Nordic construction & engineering companies to their ERP systems.
 * Source: Public company IT disclosures, annual reports, industry knowledge.
 *
 * Code-Version: 1.0.0
 * Date: 2026-03-22
 * Owner: DWS IQ 6
 */

import { ERPProvider } from './types.js';

// ============================================================================
// Company ERP Registration
// ============================================================================

export interface CompanyERPEntry {
  /** Canonical company name */
  name: string;
  /** Alternative names / subsidiaries for fuzzy matching */
  aliases: string[];
  /** ERP provider, null if unknown */
  erpProvider: ERPProvider | null;
  /** Country of HQ */
  country: string;
  /** Industry sector */
  sector: string;
  /** Data source for the ERP mapping */
  source: string;
}

/**
 * Known Nordic construction & engineering companies and their ERP systems.
 *
 * Sources:
 * - Skanska AB: SAP S/4HANA — Skanska Annual Report 2024, IT transformation program
 * - NCC Building: SAP — NCC Group IT strategy disclosures
 * - Sweco Finland: IFS Cloud — Sweco Group IT infrastructure report
 * - SRV Rakennus: Visma — SRV Yhtiöt financial systems disclosure
 */
export const COMPANY_ERP_REGISTRY: CompanyERPEntry[] = [
  {
    name: 'Skanska AB',
    aliases: ['skanska', 'skanska ab', 'skanska oy', 'skanska finland', 'skanska sverige'],
    erpProvider: ERPProvider.SAP,
    country: 'SE',
    sector: 'construction',
    source: 'Skanska Annual Report 2024 — SAP S/4HANA enterprise rollout'
  },
  {
    name: 'NCC Building',
    aliases: ['ncc', 'ncc building', 'ncc group', 'ncc ab', 'ncc finland', 'ncc suomi'],
    erpProvider: ERPProvider.SAP,
    country: 'SE',
    sector: 'construction',
    source: 'NCC Group IT strategy — SAP-based ERP landscape'
  },
  {
    name: 'Sweco Finland',
    aliases: ['sweco', 'sweco finland', 'sweco ab', 'sweco oy', 'sweco group'],
    erpProvider: ERPProvider.IFS,
    country: 'FI',
    sector: 'engineering_consulting',
    source: 'Sweco Group IT infrastructure — IFS Cloud deployment'
  },
  {
    name: 'SRV Rakennus',
    aliases: ['srv', 'srv rakennus', 'srv yhtiöt', 'srv group', 'srv rakennus oy'],
    erpProvider: ERPProvider.VISMA,
    country: 'FI',
    sector: 'construction',
    source: 'SRV Yhtiöt financial systems — Visma enterprise'
  }
];
