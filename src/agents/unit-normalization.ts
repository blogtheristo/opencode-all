/**
 * Unit Normalization Layer for Material Oracle
 *
 * Converts material quantities from any declared unit to kg,
 * enabling correct kgCO2e/kg factor application. Critical for
 * EC3/BuildingTransparency EPD integration where declared units
 * vary by material (kg, m³, m², piece, tonne, etc.).
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (EC3 unit normalization)
 * Date: 2026-03-23
 * Owner: Material Oracle / EC3 Connector
 *
 * Sources:
 *   - Material densities: Eurocode EN 1991-1-1 Table A.1 (bulk densities)
 *   - Area densities: Manufacturer EPD declared units + EN 15804 defaults
 *   - EC3 units: BuildingTransparency EC3 API v1 declared_unit field
 */

// ============ MATERIAL DENSITY TABLE ============
// kg per m³ — used for volumetric → mass conversion
// Source: EN 1991-1-1 Annex A + ICE Database v3 typical densities

export interface MaterialDensity {
  /** kg per m³ */
  density: number;
  /** Data source citation */
  source: string;
}

export const MATERIAL_DENSITIES: Record<string, MaterialDensity> = {
  concrete: { density: 2400, source: 'EN 1991-1-1 Table A.1 (normal weight)' },
  concrete_lightweight: { density: 1800, source: 'EN 1991-1-1 Table A.1 (lightweight)' },
  concrete_heavy: { density: 2600, source: 'EN 1991-1-1 Table A.1 (heavy aggregate)' },
  steel: { density: 7850, source: 'EN 1991-1-1 Table A.4' },
  rebar: { density: 7850, source: 'EN 1991-1-1 Table A.4 (same as steel)' },
  timber: { density: 500, source: 'EN 1991-1-1 Table A.3 (softwood C24 avg)' },
  timber_hardwood: { density: 700, source: 'EN 1991-1-1 Table A.3 (hardwood avg)' },
  timber_glulam: { density: 440, source: 'EN 1991-1-1 Table A.3 (glulam)' },
  timber_clt: { density: 470, source: 'CLT manufacturer EPD avg (Stora Enso, Binderholz)' },
  aluminum: { density: 2700, source: 'EN 1991-1-1 Table A.4' },
  glass: { density: 2500, source: 'EN 1991-1-1 Table A.4 (float glass)' },
  brick: { density: 1800, source: 'EN 1991-1-1 Table A.2 (solid clay brick)' },
  insulation_mineral_wool: { density: 30, source: 'Typical mineral wool insulation (20-50 kg/m³ range)' },
  insulation_eps: { density: 20, source: 'Typical EPS insulation (15-30 kg/m³ range)' },
  insulation_xps: { density: 35, source: 'Typical XPS insulation (25-45 kg/m³ range)' },
  insulation_pir: { density: 32, source: 'Typical PIR/PUR insulation (30-45 kg/m³ range)' },
  cement: { density: 1500, source: 'EN 1991-1-1 Table A.1 (bulk cement powder)' },
  copper: { density: 8900, source: 'EN 1991-1-1 Table A.4' },
  plasterboard: { density: 800, source: 'Typical gypsum plasterboard (700-900 kg/m³)' },
  mortar: { density: 1900, source: 'EN 1991-1-1 Table A.1 (cement mortar)' },
  gravel: { density: 1800, source: 'EN 1991-1-1 Table A.1 (loose gravel)' },
  sand: { density: 1600, source: 'EN 1991-1-1 Table A.1 (dry sand)' },
  asphalt: { density: 2300, source: 'EN 1991-1-1 Table A.1 (rolled asphalt)' },
  bitumen: { density: 1050, source: 'ICE Database v3' },
  soil: { density: 1800, source: 'EN 1991-1-1 Table A.1 (compacted fill)' },
};

// ============ AREA DENSITY TABLE ============
// kg per m² — used for area-based products (panels, sheets, coatings)
// These are for standard thicknesses as declared in typical EPDs

export interface AreaDensity {
  /** kg per m² at standard thickness */
  areaDensity: number;
  /** Standard thickness in mm */
  standardThicknessMm: number;
  /** Data source citation */
  source: string;
}

export const AREA_DENSITIES: Record<string, AreaDensity> = {
  glass: { areaDensity: 25, standardThicknessMm: 10, source: 'Float glass 10mm: 2500 kg/m³ × 0.01m' },
  plasterboard: { areaDensity: 10, standardThicknessMm: 12.5, source: 'Standard 12.5mm board: 800 kg/m³ × 0.0125m' },
  insulation_mineral_wool: { areaDensity: 3, standardThicknessMm: 100, source: 'Mineral wool 100mm: 30 kg/m³ × 0.1m' },
  insulation_eps: { areaDensity: 2, standardThicknessMm: 100, source: 'EPS 100mm: 20 kg/m³ × 0.1m' },
  brick: { areaDensity: 198, standardThicknessMm: 110, source: 'Single leaf 110mm: 1800 kg/m³ × 0.11m' },
  timber_clt: { areaDensity: 47, standardThicknessMm: 100, source: 'CLT 100mm panel: 470 kg/m³ × 0.1m' },
};

// ============ EC3 DECLARED UNIT MAPPING ============
// Maps EC3 API declared_unit strings to our canonical unit system

export type CanonicalUnit = 'kg' | 'm3' | 'm2' | 'm' | 'tonne' | 'piece' | 'unknown';

/**
 * EC3 uses ISO 14044 functional/declared units.
 * These are the known values from the BuildingTransparency API.
 */
export const EC3_UNIT_MAP: Record<string, CanonicalUnit> = {
  // Mass
  'kg': 'kg',
  'KG': 'kg',
  'kilogram': 'kg',
  'kilograms': 'kg',
  't': 'tonne',
  'tonne': 'tonne',
  'tonnes': 'tonne',
  'metric ton': 'tonne',
  'ton': 'tonne',
  // Volume
  'm3': 'm3',
  'M3': 'm3',
  'm³': 'm3',
  'cubic meter': 'm3',
  'cubic metre': 'm3',
  // Area
  'm2': 'm2',
  'M2': 'm2',
  'm²': 'm2',
  'square meter': 'm2',
  'square metre': 'm2',
  // Length
  'm': 'm',
  'meter': 'm',
  'metre': 'm',
  // Count
  'piece': 'piece',
  'pcs': 'piece',
  'each': 'piece',
};

// ============ UNIT CONVERSION LOGIC ============

export interface NormalizationResult {
  /** Quantity converted to kg */
  quantityKg: number;
  /** Original quantity */
  originalQuantity: number;
  /** Original unit */
  originalUnit: string;
  /** Conversion factor applied (multiply original qty by this to get kg) */
  conversionFactor: number;
  /** Whether conversion was exact or estimated */
  confidence: 'exact' | 'estimated' | 'assumed';
  /** How the conversion was determined */
  method: string;
}

/**
 * Normalizes a material quantity to kilograms.
 *
 * Conversion priority:
 *   1. Already in kg → passthrough
 *   2. Tonne → kg (× 1000, exact)
 *   3. m³ → kg via density table
 *   4. m² → kg via area density table
 *   5. Unknown unit → assume kg with warning
 *
 * @param materialName - Material name (used for density lookup)
 * @param quantity - Numeric quantity
 * @param unit - Declared unit string (from input or EC3 API)
 * @returns NormalizationResult with kg quantity and audit trail
 */
export function normalizeToKg(
  materialName: string,
  quantity: number,
  unit: string,
): NormalizationResult {
  const canonical = resolveCanonicalUnit(unit);
  const normalizedMaterial = materialName.toLowerCase().replace(/[\s_-]+/g, '_');

  // 1. Already kg
  if (canonical === 'kg') {
    return {
      quantityKg: quantity,
      originalQuantity: quantity,
      originalUnit: unit,
      conversionFactor: 1,
      confidence: 'exact',
      method: 'passthrough (already kg)',
    };
  }

  // 2. Tonne → kg
  if (canonical === 'tonne') {
    return {
      quantityKg: quantity * 1000,
      originalQuantity: quantity,
      originalUnit: unit,
      conversionFactor: 1000,
      confidence: 'exact',
      method: 'tonne to kg (× 1000)',
    };
  }

  // 3. m³ → kg via density
  if (canonical === 'm3') {
    const density = findDensity(normalizedMaterial);
    if (density) {
      return {
        quantityKg: quantity * density.density,
        originalQuantity: quantity,
        originalUnit: unit,
        conversionFactor: density.density,
        confidence: 'estimated',
        method: `m³ to kg via density ${density.density} kg/m³ (${density.source})`,
      };
    }
    // Fallback: use conservative 2000 kg/m³ (typical construction material)
    return {
      quantityKg: quantity * 2000,
      originalQuantity: quantity,
      originalUnit: unit,
      conversionFactor: 2000,
      confidence: 'assumed',
      method: 'm³ to kg via fallback density 2000 kg/m³ (no material match — conservative construction avg)',
    };
  }

  // 4. m² → kg via area density
  if (canonical === 'm2') {
    const areaDen = findAreaDensity(normalizedMaterial);
    if (areaDen) {
      return {
        quantityKg: quantity * areaDen.areaDensity,
        originalQuantity: quantity,
        originalUnit: unit,
        conversionFactor: areaDen.areaDensity,
        confidence: 'estimated',
        method: `m² to kg via area density ${areaDen.areaDensity} kg/m² at ${areaDen.standardThicknessMm}mm (${areaDen.source})`,
      };
    }
    // Fallback: use 10 kg/m² (lightweight panel assumption)
    return {
      quantityKg: quantity * 10,
      originalQuantity: quantity,
      originalUnit: unit,
      conversionFactor: 10,
      confidence: 'assumed',
      method: 'm² to kg via fallback area density 10 kg/m² (no material match — lightweight panel assumed)',
    };
  }

  // 5. Linear meter (m) — no generic conversion, flag it
  if (canonical === 'm') {
    // Linear materials (rebar, pipe, beam) need cross-section area + density
    // Conservative: assume rebar ~0.617 kg/m (8mm dia) as fallback
    return {
      quantityKg: quantity * 1,
      originalQuantity: quantity,
      originalUnit: unit,
      conversionFactor: 1,
      confidence: 'assumed',
      method: 'linear meter — no cross-section data, assuming 1 kg/m (WARN: likely inaccurate, provide kg or m³ instead)',
    };
  }

  // 6. Piece — cannot convert without unit weight
  if (canonical === 'piece') {
    return {
      quantityKg: quantity * 1,
      originalQuantity: quantity,
      originalUnit: unit,
      conversionFactor: 1,
      confidence: 'assumed',
      method: 'piece — no unit weight data, assuming 1 kg/piece (WARN: likely inaccurate, provide kg instead)',
    };
  }

  // 7. Unknown unit — assume kg
  return {
    quantityKg: quantity,
    originalQuantity: quantity,
    originalUnit: unit,
    conversionFactor: 1,
    confidence: 'assumed',
    method: `unknown unit "${unit}" — assuming kg (WARN: verify unit with supplier EPD)`,
  };
}

/**
 * Resolves a raw unit string to a canonical unit type.
 */
export function resolveCanonicalUnit(unit: string): CanonicalUnit {
  if (!unit) return 'unknown';
  const trimmed = unit.trim();

  // Direct map lookup
  if (EC3_UNIT_MAP[trimmed]) return EC3_UNIT_MAP[trimmed];

  // Case-insensitive lookup
  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(EC3_UNIT_MAP)) {
    if (key.toLowerCase() === lower) return val;
  }

  return 'unknown';
}

/**
 * Finds the best-matching volumetric density for a material.
 * Uses exact match first, then substring containment.
 */
function findDensity(normalizedName: string): MaterialDensity | null {
  if (MATERIAL_DENSITIES[normalizedName]) return MATERIAL_DENSITIES[normalizedName];

  for (const [key, density] of Object.entries(MATERIAL_DENSITIES)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return density;
    }
  }
  return null;
}

/**
 * Finds the best-matching area density for a material.
 */
function findAreaDensity(normalizedName: string): AreaDensity | null {
  if (AREA_DENSITIES[normalizedName]) return AREA_DENSITIES[normalizedName];

  for (const [key, density] of Object.entries(AREA_DENSITIES)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return density;
    }
  }
  return null;
}
