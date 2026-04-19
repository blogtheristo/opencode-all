/**
 * Debit-Credit Compliance Ledger
 *
 * Pure transform layer: reshapes existing CostBreakdown and BESSComplianceCost
 * into double-entry-style ledger entries for CFO-friendly reporting.
 *
 * Phase 1: in-memory transform, no database persistence.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD
 * Date: 2026-03-24
 * Owner: Lifetime Oy
 */

import type { CostBreakdown } from './scoring-engine.js';
import type { BESSComplianceCost } from './bess-calculator.js';

// ============ TYPES ============

export type EntryType = 'debit' | 'credit';

export type LedgerCategory = 'ETS' | 'CBAM' | 'CSRD' | 'Taxonomy' | 'Scope2' | 'Lifecycle';

export interface LedgerEntry {
  type: EntryType;
  category: LedgerCategory;
  amountEur: number;
  regulation: string;
  description: string;
}

export interface ComplianceLedger {
  entries: LedgerEntry[];
  totalDebitsEur: number;
  totalCreditsEur: number;
  /** credits - debits: negative = net compliance cost */
  netPositionEur: number;
  generatedAt: string;
}

export interface LedgerCreditOptions {
  /** Value of ETS free allocation received (EUR) */
  freeAllocationEur?: number;
  /** CBAM credit from supplier-verified lower carbon content (EUR) */
  verifiedLowerCarbonEur?: number;
  /** Green financing benefit from EU Taxonomy alignment (EUR) */
  greenFinancingEur?: number;
}

// ============ TRANSFORM FUNCTIONS ============

/**
 * Transform scoring engine CostBreakdown into debit-credit entries.
 * General-purpose ledger for any company.
 */
export function costBreakdownToLedger(
  cost: CostBreakdown,
  options?: LedgerCreditOptions,
): ComplianceLedger {
  const entries: LedgerEntry[] = [];

  // Debits
  if (cost.etsCostEur > 0) {
    entries.push({
      type: 'debit',
      category: 'ETS',
      amountEur: cost.etsCostEur,
      regulation: 'EU ETS Phase 4 (Reg. 2021/447)',
      description: 'ETS allowance surrender obligation',
    });
  }

  if (cost.cbamCostEur > 0) {
    entries.push({
      type: 'debit',
      category: 'CBAM',
      amountEur: cost.cbamCostEur,
      regulation: 'CBAM (Reg. 2023/956)',
      description: 'CBAM certificate purchase cost',
    });
  }

  if (cost.csrdReportingCostEur > 0) {
    entries.push({
      type: 'debit',
      category: 'CSRD',
      amountEur: cost.csrdReportingCostEur,
      regulation: 'CSRD (Directive 2022/2464)',
      description: 'CSRD sustainability reporting cost',
    });
  }

  // Credits (from options)
  if (options?.freeAllocationEur && options.freeAllocationEur > 0) {
    entries.push({
      type: 'credit',
      category: 'ETS',
      amountEur: options.freeAllocationEur,
      regulation: 'EU ETS Phase 4 (Reg. 2021/447)',
      description: 'ETS free allocation received',
    });
  }

  if (options?.verifiedLowerCarbonEur && options.verifiedLowerCarbonEur > 0) {
    entries.push({
      type: 'credit',
      category: 'CBAM',
      amountEur: options.verifiedLowerCarbonEur,
      regulation: 'CBAM (Reg. 2023/956) Art. 7',
      description: 'CBAM credit — supplier-verified lower carbon content',
    });
  }

  if (options?.greenFinancingEur && options.greenFinancingEur > 0) {
    entries.push({
      type: 'credit',
      category: 'Taxonomy',
      amountEur: options.greenFinancingEur,
      regulation: 'EU Taxonomy (Reg. 2020/852)',
      description: 'Green financing benefit from Taxonomy alignment',
    });
  }

  return buildLedger(entries);
}

/**
 * Transform BESS compliance cost into debit-credit entries.
 * BESS-specific: includes avoided emissions credits, lifecycle debits.
 */
export function bessComplianceToLedger(bess: BESSComplianceCost): ComplianceLedger {
  const entries: LedgerEntry[] = [];

  if (bess.scope2ChargingCostEur > 0) {
    entries.push({
      type: 'debit',
      category: 'Scope2',
      amountEur: bess.scope2ChargingCostEur,
      regulation: 'CSRD ESRS E1-6 / GHG Protocol Scope 2',
      description: 'Scope 2 carbon cost from grid charging',
    });
  }

  if (bess.roundtripLossCostEur > 0) {
    entries.push({
      type: 'debit',
      category: 'Scope2',
      amountEur: bess.roundtripLossCostEur,
      regulation: 'CSRD ESRS E1-5',
      description: 'Roundtrip efficiency loss carbon cost',
    });
  }

  if (bess.etsColocatedCostEur > 0) {
    entries.push({
      type: 'debit',
      category: 'ETS',
      amountEur: bess.etsColocatedCostEur,
      regulation: 'EU ETS Phase 4 (Reg. 2021/447)',
      description: 'ETS cost for co-located generation asset',
    });
  }

  if (bess.csrdReportingCostEur > 0) {
    entries.push({
      type: 'debit',
      category: 'CSRD',
      amountEur: bess.csrdReportingCostEur,
      regulation: 'CSRD (Directive 2022/2464)',
      description: 'CSRD sustainability reporting cost',
    });
  }

  if (bess.taxonomyCertificationCostEur > 0) {
    entries.push({
      type: 'debit',
      category: 'Taxonomy',
      amountEur: bess.taxonomyCertificationCostEur,
      regulation: 'EU Taxonomy (Reg. 2020/852)',
      description: 'EU Taxonomy third-party certification cost',
    });
  }

  if (bess.lifecycle.impairmentEur > 0) {
    entries.push({
      type: 'debit',
      category: 'Lifecycle',
      amountEur: bess.lifecycle.impairmentEur,
      regulation: 'CSRD ESRS E1 / IAS 36',
      description: 'Battery asset impairment from capacity degradation',
    });
  }

  if (bess.dataCenter?.facilityScope2CostEur && bess.dataCenter.facilityScope2CostEur > 0) {
    entries.push({
      type: 'debit',
      category: 'Scope2',
      amountEur: bess.dataCenter.facilityScope2CostEur,
      regulation: 'CSRD ESRS E1-6 / EU Taxonomy 8.1',
      description: 'Facility-level Scope 2 carbon cost',
    });
  }

  // Credit: avoided emissions valued at carbon price
  const avoidedValue = round2(bess.emissions.avoidedEmissionsTonnes * bess.carbonPriceEur);
  if (avoidedValue > 0) {
    entries.push({
      type: 'credit',
      category: 'Taxonomy',
      amountEur: avoidedValue,
      regulation: 'EU Taxonomy Activity 4.10 / CSRD ESRS E1',
      description: 'Avoided emissions from displacing fossil generation',
    });
  }

  return buildLedger(entries);
}

/**
 * Merge multiple ledgers into one.
 */
export function mergeLedgers(...ledgers: ComplianceLedger[]): ComplianceLedger {
  const allEntries = ledgers.flatMap((l) => l.entries);
  return buildLedger(allEntries);
}

// ============ INTERNAL ============

function buildLedger(entries: LedgerEntry[]): ComplianceLedger {
  const totalDebitsEur = round2(
    entries.filter((e) => e.type === 'debit').reduce((sum, e) => sum + e.amountEur, 0),
  );
  const totalCreditsEur = round2(
    entries.filter((e) => e.type === 'credit').reduce((sum, e) => sum + e.amountEur, 0),
  );
  return {
    entries,
    totalDebitsEur,
    totalCreditsEur,
    netPositionEur: round2(totalCreditsEur - totalDebitsEur),
    generatedAt: new Date().toISOString(),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
