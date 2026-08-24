/**
 * BESS Compliance Calculator Tests
 *
 * Verifies BESS compliance cost calculations with realistic dispatch data.
 * Based on Qantic white paper parameters: 90.25% roundtrip efficiency,
 * 2%/year degradation, EU grid emission factors.
 */

import { describe, expect, it } from 'vitest';
import {
  type BatterySpec,
  type BESSComplianceInput,
  calculateBESSCompliance,
  type DispatchEntry,
  estimateBESSComplianceCost,
  getDefaultGridFactor,
} from '../compliance/bess-calculator.js';

// ============ TEST DATA ============

/** Realistic 50MW/200MWh BESS in Germany */
const germanBattery: BatterySpec = {
  powerMw: 50,
  energyMwh: 200,
  roundtripEfficiency: 0.9025,
  annualDegradationRate: 0.02,
  installationYear: 2024,
  capitalCostEur: 40_000_000,
  usefulLifeYears: 15,
  country: 'DE',
};

/** Generate sample dispatch entries for one day (24 hours) */
function generateDailyDispatch(gridFactor: number = 385): DispatchEntry[] {
  const entries: DispatchEntry[] = [];
  const baseDate = '2026-01-15T';

  for (let h = 0; h < 24; h++) {
    const hour = String(h).padStart(2, '0');
    const isCharging = h >= 1 && h <= 5; // Charge during cheap night hours
    const isDischarging = h >= 17 && h <= 21; // Discharge during peak

    entries.push({
      timestamp: `${baseDate}${hour}:00:00Z`,
      chargedMwh: isCharging ? 40 : 0, // 40 MWh/hour × 5 hours = 200 MWh
      dischargedMwh: isDischarging ? 36.05 : 0, // After 9.75% loss
      market: isDischarging ? 'day-ahead' : (isCharging ? 'idle' : 'idle'),
      gridEmissionFactor: gridFactor, // gCO2/kWh
    });
  }

  return entries;
}

// ============ TESTS ============

describe('BESS Compliance Calculator', () => {
  describe('calculateBESSCompliance', () => {
    it('calculates Scope 2 emissions from charging', () => {
      const dispatch = generateDailyDispatch(385); // Germany: 385 gCO2/kWh
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
      };

      const result = calculateBESSCompliance(input);

      // 5 hours × 40 MWh = 200 MWh charged
      // 200 MWh × 385 gCO2/kWh × 1000 / 1,000,000 = 77 tCO2e
      expect(result.emissions.scope2TotalTonnes).toBe(77);
      expect(result.emissions.weightedGridFactor).toBe(385);
    });

    it('calculates roundtrip efficiency loss', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
      };

      const result = calculateBESSCompliance(input);

      // 200 MWh × (1 - 0.9025) = 19.5 MWh lost
      // 19.5 × 385 × 1000 / 1,000,000 = 7.5075 tCO2e
      expect(result.emissions.roundtripLossTonnes).toBe(7.51);
      expect(result.roundtripLossCostEur).toBeGreaterThan(0);
    });

    it('calculates avoided emissions from discharge', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
      };

      const result = calculateBESSCompliance(input);

      // 5 hours × 36.05 MWh = 180.25 MWh discharged
      // 180.25 × 385 × 1000 / 1,000,000 = 69.40 tCO2e avoided
      expect(result.emissions.avoidedEmissionsTonnes).toBeGreaterThan(60);
      expect(result.emissions.avoidedEmissionsTonnes).toBeLessThan(80);
    });

    it('calculates net emissions position', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
      };

      const result = calculateBESSCompliance(input);

      // Net = Scope2 + roundtrip loss - avoided
      const expectedNet = result.emissions.scope2TotalTonnes +
        result.emissions.roundtripLossTonnes -
        result.emissions.avoidedEmissionsTonnes;
      expect(result.emissions.netEmissionsTonnes).toBeCloseTo(expectedNet, 1);
    });

    it('includes CSRD and Taxonomy fixed costs', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
      };

      const result = calculateBESSCompliance(input);

      expect(result.csrdReportingCostEur).toBe(12_000);
      expect(result.taxonomyCertificationCostEur).toBe(4_200);
      expect(result.totalCostEur).toBeGreaterThan(16_200); // At least fixed costs
    });

    it('calculates battery lifecycle metrics', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026, // 2 years after installation
      };

      const result = calculateBESSCompliance(input);

      // After 2 years at 2%/year: 100 × (1-0.02)^2 = 96.04%
      expect(result.lifecycle.currentCapacityPct).toBeCloseTo(96.04, 1);
      expect(result.lifecycle.remainingLifeYears).toBe(13);
      expect(result.lifecycle.replacementYear).toBe(2039);
      expect(result.lifecycle.annualDepreciationEur).toBeCloseTo(2_666_666.67, 0);
    });

    it('assesses EU Taxonomy alignment', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
      };

      const result = calculateBESSCompliance(input);

      // Activity code for electricity storage
      expect(result.taxonomy.activityCode).toBe('4.10');
      // Substantial contribution depends on avoided > scope2
      expect(typeof result.taxonomy.substantialContribution).toBe('boolean');
      expect(result.taxonomy.avoidedEmissionsEvidence).toBeGreaterThan(0);
    });

    it('tracks ETS-covered market hours', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
      };

      const result = calculateBESSCompliance(input);

      // 5 discharge hours in 'day-ahead' with dischargedMwh > 0 (ETS-covered) out of 24 total
      expect(result.etsMarketHours.etsCoveredHours).toBe(5);
      expect(result.etsMarketHours.totalHours).toBe(24);
      expect(result.etsMarketHours.etsCoveredPct).toBeCloseTo(20.83, 1);
    });

    it('handles co-located ETS-covered generation', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
        colocatedEtsCovered: true,
      };

      const result = calculateBESSCompliance(input);

      expect(result.etsColocatedCostEur).toBeGreaterThan(0);
    });

    it('handles empty dispatch gracefully via agent', () => {
      // The calculator itself requires dispatch; the agent handles validation
      const dispatch: DispatchEntry[] = [];
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
      };

      const result = calculateBESSCompliance(input);

      expect(result.emissions.scope2TotalTonnes).toBe(0);
      expect(result.totalCostEur).toBe(16_200); // Only fixed costs
    });

    it('uses Finland grid factor for Finnish installations', () => {
      const finnishBattery: BatterySpec = { ...germanBattery, country: 'FI' };
      const dispatch = generateDailyDispatch(68); // Finland: 68 gCO2/kWh
      const input: BESSComplianceInput = {
        dispatch,
        battery: finnishBattery,
        year: 2026,
      };

      const result = calculateBESSCompliance(input);

      // Much lower emissions due to clean Finnish grid
      expect(result.emissions.scope2TotalTonnes).toBeLessThan(20);
      expect(result.emissions.weightedGridFactor).toBe(68);
    });
  });

  describe('estimateBESSComplianceCost', () => {
    it('provides quick estimate without dispatch data', () => {
      const result = estimateBESSComplianceCost(200, 'DE');

      expect(result.estimatedAnnualCostEur).toBeGreaterThan(0);
      expect(result.scope2Tonnes).toBeGreaterThan(0);
      expect(result.breakdown).toContain('Carbon');
      expect(result.breakdown).toContain('CSRD');
      expect(result.breakdown).toContain('Taxonomy');
    });

    it('returns lower cost for clean grids', () => {
      const german = estimateBESSComplianceCost(200, 'DE');
      const finnish = estimateBESSComplianceCost(200, 'FI');

      expect(finnish.estimatedAnnualCostEur).toBeLessThan(german.estimatedAnnualCostEur);
      expect(finnish.scope2Tonnes).toBeLessThan(german.scope2Tonnes);
    });

    it('falls back to EU average for unknown countries', () => {
      const result = estimateBESSComplianceCost(200, 'XX');

      // Should use EU average (230 gCO2/kWh)
      expect(result.scope2Tonnes).toBeGreaterThan(0);
    });
  });

  describe('Data Center PUE + Facility Scope 2', () => {
    it('calculates PUE and flags Taxonomy compliance', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
        facility: {
          itLoadMw: 100,
          totalFacilityPowerMw: 130, // PUE = 1.3 (compliant)
          annualFacilityMwh: 1_000_000,
        },
      };

      const result = calculateBESSCompliance(input);

      expect(result.dataCenter).toBeDefined();
      expect(result.dataCenter!.pue).toBe(1.3);
      expect(result.dataCenter!.taxonomyCompliant).toBe(true);
      expect(result.dataCenter!.facilityScope2Tonnes).toBeGreaterThan(0);
      expect(result.dataCenter!.warning).toBeUndefined();
    });

    it('blocks Taxonomy when PUE exceeds 1.5', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
        facility: {
          itLoadMw: 100,
          totalFacilityPowerMw: 170, // PUE = 1.7 (non-compliant)
          annualFacilityMwh: 1_200_000,
        },
      };

      const result = calculateBESSCompliance(input);

      expect(result.dataCenter).toBeDefined();
      expect(result.dataCenter!.pue).toBe(1.7);
      expect(result.dataCenter!.taxonomyCompliant).toBe(false);
      expect(result.dataCenter!.warning).toContain('BLOCKED');
      expect(result.dataCenter!.warning).toContain('1.5');
    });

    it('calculates facility-level Scope 2 cost', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
        facility: {
          itLoadMw: 100,
          totalFacilityPowerMw: 130,
          annualFacilityMwh: 1_000_000, // 1 TWh
        },
      };

      const result = calculateBESSCompliance(input);

      // 1,000,000 MWh × 385 gCO2/kWh × 1000 / 1,000,000 = 385,000 tCO2e
      expect(result.dataCenter!.facilityScope2Tonnes).toBe(385000);
      // 385,000 × €65 = €25,025,000
      expect(result.dataCenter!.facilityScope2CostEur).toBe(25025000);
      // Facility cost should be included in total
      expect(result.totalCostEur).toBeGreaterThan(25_000_000);
    });

    it('omits dataCenter when no facility provided', () => {
      const dispatch = generateDailyDispatch(385);
      const input: BESSComplianceInput = {
        dispatch,
        battery: germanBattery,
        year: 2026,
      };

      const result = calculateBESSCompliance(input);

      expect(result.dataCenter).toBeUndefined();
    });
  });

  describe('getDefaultGridFactor', () => {
    it('returns correct factors for known countries', () => {
      expect(getDefaultGridFactor('DE')).toBe(385);
      expect(getDefaultGridFactor('FI')).toBe(68);
      expect(getDefaultGridFactor('PL')).toBe(650);
      expect(getDefaultGridFactor('NO')).toBe(19);
    });

    it('returns EU average for unknown countries', () => {
      expect(getDefaultGridFactor('XX')).toBe(230);
    });

    it('is case-insensitive', () => {
      expect(getDefaultGridFactor('de')).toBe(385);
      expect(getDefaultGridFactor('fi')).toBe(68);
    });
  });
});
