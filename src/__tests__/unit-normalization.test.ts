/**
 * Unit Normalization Tests
 *
 * Tests the critical unit conversion layer that prevents silent accuracy errors
 * when Material Oracle receives quantities in non-kg units (m³, m², tonne, etc.).
 *
 * The "240x concrete bug": 50 m³ concrete without conversion = 6.6 kgCO2e.
 * With conversion (× 2400 kg/m³) = 15,840 kgCO2e. This test suite prevents regression.
 */

import { describe, expect, it } from 'vitest';
import {
  AREA_DENSITIES,
  EC3_UNIT_MAP,
  MATERIAL_DENSITIES,
  normalizeToKg,
  resolveCanonicalUnit,
} from '../agents/unit-normalization.js';

describe('resolveCanonicalUnit', () => {
  it('maps standard kg variants', () => {
    expect(resolveCanonicalUnit('kg')).toBe('kg');
    expect(resolveCanonicalUnit('KG')).toBe('kg');
    expect(resolveCanonicalUnit('kilogram')).toBe('kg');
    expect(resolveCanonicalUnit('kilograms')).toBe('kg');
  });

  it('maps volume variants', () => {
    expect(resolveCanonicalUnit('m3')).toBe('m3');
    expect(resolveCanonicalUnit('m³')).toBe('m3');
    expect(resolveCanonicalUnit('cubic meter')).toBe('m3');
    expect(resolveCanonicalUnit('cubic metre')).toBe('m3');
  });

  it('maps area variants', () => {
    expect(resolveCanonicalUnit('m2')).toBe('m2');
    expect(resolveCanonicalUnit('m²')).toBe('m2');
    expect(resolveCanonicalUnit('square meter')).toBe('m2');
  });

  it('maps tonne variants', () => {
    expect(resolveCanonicalUnit('t')).toBe('tonne');
    expect(resolveCanonicalUnit('tonne')).toBe('tonne');
    expect(resolveCanonicalUnit('metric ton')).toBe('tonne');
  });

  it('returns unknown for unrecognized units', () => {
    expect(resolveCanonicalUnit('bushel')).toBe('unknown');
    expect(resolveCanonicalUnit('')).toBe('unknown');
    expect(resolveCanonicalUnit('ft3')).toBe('unknown');
  });
});

describe('normalizeToKg — passthrough', () => {
  it('kg input returns quantity unchanged', () => {
    const result = normalizeToKg('concrete', 1000, 'kg');
    expect(result.quantityKg).toBe(1000);
    expect(result.conversionFactor).toBe(1);
    expect(result.confidence).toBe('exact');
  });
});

describe('normalizeToKg — tonne conversion', () => {
  it('tonne to kg (× 1000)', () => {
    const result = normalizeToKg('steel', 5, 'tonne');
    expect(result.quantityKg).toBe(5000);
    expect(result.conversionFactor).toBe(1000);
    expect(result.confidence).toBe('exact');
  });

  it('metric ton also works', () => {
    const result = normalizeToKg('steel', 2, 'metric ton');
    expect(result.quantityKg).toBe(2000);
  });
});

describe('normalizeToKg — volumetric (m³) conversion', () => {
  it('concrete m³ uses 2400 kg/m³ density', () => {
    const result = normalizeToKg('concrete', 50, 'm³');
    expect(result.quantityKg).toBe(50 * 2400);
    expect(result.conversionFactor).toBe(2400);
    expect(result.confidence).toBe('estimated');
  });

  it('steel m³ uses 7850 kg/m³ density', () => {
    const result = normalizeToKg('steel', 1, 'm3');
    expect(result.quantityKg).toBe(7850);
  });

  it('timber m³ uses 500 kg/m³ density', () => {
    const result = normalizeToKg('timber', 10, 'cubic meter');
    expect(result.quantityKg).toBe(5000);
  });

  it('insulation m³ uses low density (30 kg/m³ for mineral wool)', () => {
    const result = normalizeToKg('insulation_mineral_wool', 100, 'm³');
    expect(result.quantityKg).toBe(3000);
    expect(result.conversionFactor).toBe(30);
  });

  it('unknown material m³ uses fallback 2000 kg/m³', () => {
    const result = normalizeToKg('exotic_polymer_xyz', 10, 'm³');
    expect(result.quantityKg).toBe(20000);
    expect(result.confidence).toBe('assumed');
  });
});

describe('normalizeToKg — area (m²) conversion', () => {
  it('glass m² uses area density', () => {
    const result = normalizeToKg('glass', 100, 'm²');
    expect(result.quantityKg).toBe(100 * 25);
    expect(result.confidence).toBe('estimated');
  });

  it('plasterboard m² uses 10 kg/m² at 12.5mm', () => {
    const result = normalizeToKg('plasterboard', 200, 'm2');
    expect(result.quantityKg).toBe(2000);
  });

  it('unknown material m² uses fallback 10 kg/m²', () => {
    const result = normalizeToKg('exotic_panel', 50, 'm²');
    expect(result.quantityKg).toBe(500);
    expect(result.confidence).toBe('assumed');
  });
});

describe('normalizeToKg — edge cases', () => {
  it('linear meter flags low confidence', () => {
    const result = normalizeToKg('rebar', 100, 'm');
    expect(result.confidence).toBe('assumed');
    expect(result.method).toContain('linear meter');
  });

  it('piece flags low confidence', () => {
    const result = normalizeToKg('beam', 10, 'piece');
    expect(result.confidence).toBe('assumed');
  });

  it('unknown unit assumes kg with warning', () => {
    const result = normalizeToKg('concrete', 100, 'bushels');
    expect(result.quantityKg).toBe(100);
    expect(result.confidence).toBe('assumed');
    expect(result.method).toContain('unknown unit');
  });

  it('zero quantity returns zero', () => {
    const result = normalizeToKg('concrete', 0, 'm³');
    expect(result.quantityKg).toBe(0);
  });
});

describe('The 240x concrete bug — regression test', () => {
  it('50 m³ concrete must NOT return ~6.6 kgCO2e (the old wrong value)', () => {
    // Old behavior: 50 × 0.132 = 6.6 kgCO2e (WRONG — treated m³ as kg)
    // Correct: 50 × 2400 × 0.132 = 15,840 kgCO2e
    const result = normalizeToKg('concrete', 50, 'm³');
    // Must be 120,000 kg (50 m³ × 2400 kg/m³)
    expect(result.quantityKg).toBe(120000);
    // When multiplied by concrete A1-A3 factor (0.132), should give ~15,840
    const a1_a3_co2e = result.quantityKg * 0.132;
    expect(a1_a3_co2e).toBe(15840);
    // NOT 6.6
    expect(a1_a3_co2e).not.toBeCloseTo(6.6, 0);
  });
});

describe('EC3 API unit compatibility', () => {
  it('all EC3 unit strings resolve to valid canonical units', () => {
    for (const [_ec3Unit, canonical] of Object.entries(EC3_UNIT_MAP)) {
      expect(['kg', 'm3', 'm2', 'm', 'tonne', 'piece']).toContain(canonical);
    }
  });

  it('density table covers all Material Oracle materials', () => {
    // These are the materials in Material Oracle's EMISSION_FACTORS
    const oracleMaterials = [
      'concrete', 'steel', 'timber', 'aluminum', 'glass', 'brick',
      'insulation_mineral_wool', 'insulation_eps', 'cement', 'copper',
      'plasterboard', 'rebar',
    ];
    for (const mat of oracleMaterials) {
      expect(MATERIAL_DENSITIES[mat]).toBeDefined();
    }
  });
});

describe('density table data quality', () => {
  it('all densities are positive and physically plausible', () => {
    for (const [_name, { density }] of Object.entries(MATERIAL_DENSITIES)) {
      expect(density).toBeGreaterThan(0);
      // No construction material exceeds 10,000 kg/m³
      expect(density).toBeLessThan(10000);
    }
  });

  it('all area densities are positive', () => {
    for (const [_name, { areaDensity }] of Object.entries(AREA_DENSITIES)) {
      expect(areaDensity).toBeGreaterThan(0);
    }
  });

  it('steel denser than concrete denser than timber', () => {
    expect(MATERIAL_DENSITIES.steel.density).toBeGreaterThan(MATERIAL_DENSITIES.concrete.density);
    expect(MATERIAL_DENSITIES.concrete.density).toBeGreaterThan(MATERIAL_DENSITIES.timber.density);
  });

  it('insulation materials have very low density (< 100 kg/m³)', () => {
    expect(MATERIAL_DENSITIES.insulation_mineral_wool.density).toBeLessThan(100);
    expect(MATERIAL_DENSITIES.insulation_eps.density).toBeLessThan(100);
  });
});
