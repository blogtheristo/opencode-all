import { describe, expect, it } from 'vitest';
import {
  bessComplianceToLedger,
  costBreakdownToLedger,
  mergeLedgers,
} from '../compliance/debit-credit-ledger.js';
import type { CostBreakdown } from '../compliance/scoring-engine.js';
import type { BESSComplianceCost } from '../compliance/bess-calculator.js';

describe('debit-credit-ledger', () => {
  const baseCost: CostBreakdown = {
    etsCostEur: 1_625_000,
    cbamCostEur: 6_500,
    csrdReportingCostEur: 12_000,
    totalCostEur: 1_643_500,
    carbonPriceEur: 65,
  };

  it('creates debits-only ledger from CostBreakdown', () => {
    const ledger = costBreakdownToLedger(baseCost);

    expect(ledger.entries).toHaveLength(3);
    expect(ledger.entries.every((e) => e.type === 'debit')).toBe(true);
    expect(ledger.totalDebitsEur).toBe(1_643_500);
    expect(ledger.totalCreditsEur).toBe(0);
    expect(ledger.netPositionEur).toBe(-1_643_500);
  });

  it('includes credit entries when options provided', () => {
    const ledger = costBreakdownToLedger(baseCost, {
      freeAllocationEur: 500_000,
      verifiedLowerCarbonEur: 2_000,
      greenFinancingEur: 10_000,
    });

    const credits = ledger.entries.filter((e) => e.type === 'credit');
    expect(credits).toHaveLength(3);
    expect(ledger.totalCreditsEur).toBe(512_000);
    expect(ledger.netPositionEur).toBe(512_000 - 1_643_500);
  });

  it('excludes zero-amount entries', () => {
    const zeroCbam: CostBreakdown = { ...baseCost, cbamCostEur: 0 };
    const ledger = costBreakdownToLedger(zeroCbam);

    expect(ledger.entries).toHaveLength(2);
    expect(ledger.entries.find((e) => e.category === 'CBAM')).toBeUndefined();
  });

  it('transforms BESS compliance cost with avoided emissions credit', () => {
    const bess: BESSComplianceCost = {
      totalCostEur: 21_693,
      scope2ChargingCostEur: 5_005,
      roundtripLossCostEur: 488,
      etsColocatedCostEur: 0,
      csrdReportingCostEur: 12_000,
      taxonomyCertificationCostEur: 4_200,
      emissions: {
        scope2TotalTonnes: 77,
        roundtripLossTonnes: 7.5,
        avoidedEmissionsTonnes: 120,
        netEmissionsTonnes: -35.5,
        weightedGridFactor: 385,
      },
      lifecycle: {
        currentCapacityPct: 96,
        remainingLifeYears: 18,
        impairmentEur: 800,
        replacementYear: 2044,
        annualDepreciationEur: 500_000,
      },
      taxonomy: {
        substantialContribution: true,
        avoidedEmissionsEvidence: 120,
        dnshAssessment: 'BESS net-positive',
        activityCode: '4.10',
      },
      etsMarketHours: {
        totalHours: 8760,
        etsCoveredHours: 4000,
        etsCoveredPct: 45.66,
      },
      carbonPriceEur: 65,
      year: 2026,
      calculatedAt: '2026-03-24T00:00:00.000Z',
    };

    const ledger = bessComplianceToLedger(bess);

    // Debits: scope2, roundtrip, csrd, taxonomy, impairment (ets=0 excluded)
    const debits = ledger.entries.filter((e) => e.type === 'debit');
    expect(debits).toHaveLength(5);

    // Credit: avoided emissions = 120 * 65 = 7800
    const credits = ledger.entries.filter((e) => e.type === 'credit');
    expect(credits).toHaveLength(1);
    expect(credits[0].amountEur).toBe(7_800);
    expect(credits[0].description).toContain('Avoided emissions');
  });

  it('merges two ledgers correctly', () => {
    const ledger1 = costBreakdownToLedger(baseCost);
    const ledger2 = costBreakdownToLedger(baseCost, { freeAllocationEur: 100_000 });

    const merged = mergeLedgers(ledger1, ledger2);

    expect(merged.entries).toHaveLength(ledger1.entries.length + ledger2.entries.length);
    expect(merged.totalDebitsEur).toBe(ledger1.totalDebitsEur + ledger2.totalDebitsEur);
    expect(merged.totalCreditsEur).toBe(100_000);
  });

  it('net position is positive when credits exceed debits', () => {
    const smallCost: CostBreakdown = {
      etsCostEur: 1_000,
      cbamCostEur: 0,
      csrdReportingCostEur: 0,
      totalCostEur: 1_000,
      carbonPriceEur: 65,
    };

    const ledger = costBreakdownToLedger(smallCost, {
      freeAllocationEur: 5_000,
    });

    expect(ledger.netPositionEur).toBeGreaterThan(0);
    expect(ledger.netPositionEur).toBe(4_000);
  });
});
