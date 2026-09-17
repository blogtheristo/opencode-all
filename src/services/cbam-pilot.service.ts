/**
 * CBAM Pilot Service — KYA-S1 LedgerNativeOutput
 *
 * Wraps the existing CBAM calculator in a KYA-S1 signed evidence envelope.
 * Every response is:
 *   - attributable (signed_by, request_id, calc_version)
 *   - bounded (confidence score, missing_evidence flags)
 *   - citable (source-level citations from EU 2023/956)
 *   - refusable (structured refusal path when evidence is insufficient)
 *
 * Outokumpu pilot: when imports carry installation_id FI-OTK-TOR-01 (Tornio),
 * authority_status upgrades to 'installation_referenced' and EPD citations are
 * added. default_factor_comparison shows certificate savings vs. CBAM default.
 *
 * Price: €0.10/call (pilot). The first metric is repeat purchase, not revenue.
 *
 * KYA tier: S1 — deterministic, read-only, no external writes, no LLM in hot path.
 */

import crypto from 'crypto';
import { calculateCBAM, type CBAMCalculationResult, type CBAMDeclaration, type CBAMImport, isCBAMCovered } from '../compliance/cbam-calculator.js';
import { CBAM_CERTIFICATE_PRICE_EUR, getFactorsForSector } from '../compliance/emission-factors.js';

export const CALC_VERSION = '1.0.0';

// ============ PRODUCER REGISTRY ============

/**
 * Known verified producers. When an import's installation_id matches an entry,
 * authority_status upgrades from 'declared_unverified' to 'installation_referenced'
 * and the producer's citations are appended to the response.
 *
 * Outokumpu Tornio is the first entry — pilot partner.
 */
export interface ProducerRegistryEntry {
  installation_id: string;
  producer_name: string;
  facility: string;
  country: string;       // ISO 3166-1 alpha-2
  sector: string;
  /** tCO2e/t (installation-level, supplier-specific) */
  verified_factor: number;
  factor_source: string; // e.g. EPD document reference
  factor_year: number;
  production_route: string;
  citations: Array<{ reg: string; article?: string; document?: string; note: string }>;
}

export const PRODUCER_REGISTRY: ProducerRegistryEntry[] = [
  {
    installation_id: 'FI-OTK-TOR-01',
    producer_name: 'Outokumpu Oyj',
    facility: 'Tornio Stainless Steel Works',
    country: 'FI',
    sector: 'steel',
    verified_factor: 0.71, // tCO2e/t — EAF + AOD route, installation-level
    factor_source: 'Outokumpu EPD 2025 — EN 15804+A2, verified by DNV',
    factor_year: 2025,
    production_route: 'EAF + AOD (Electric Arc Furnace + Argon Oxygen Decarburisation)',
    citations: [
      {
        reg: 'Outokumpu EPD 2025',
        document: 'EPD-OTK-STAINLESS-2025-DNV',
        note: 'Installation-level verified emission factor for 300-series stainless steel, Tornio Works',
      },
      {
        reg: 'EN 15804+A2',
        note: 'Product Category Rules for construction products — EPD verification standard',
      },
      {
        reg: 'EU 2023/956',
        article: '7',
        note: 'Supplier-specific embedded emissions per Art. 7(2) — takes precedence over default values',
      },
    ],
  },
];

/** Look up a producer by installation_id. Returns undefined if not registered. */
export function lookupProducer(installationId: string): ProducerRegistryEntry | undefined {
  return PRODUCER_REGISTRY.find(p => p.installation_id === installationId);
}

// ============ REQUEST SCHEMA ============

/**
 * Extended CBAMImport with optional installation_id.
 * When installation_id matches the producer registry, the supplier-specific
 * factor is sourced from the registry and authority_status is upgraded.
 */
export interface CBAMPilotImport extends CBAMImport {
  installation_id?: string; // e.g. 'FI-OTK-TOR-01'
}

export interface CBAMPilotDeclaration extends Omit<CBAMDeclaration, 'imports'> {
  imports: CBAMPilotImport[];
}

export interface CBAMPilotRequest {
  requester: {
    agent_id: string;
    declared_purpose: string;
    authority: string; // e.g. "EU declarant, EORI DE123456789"
  };
  declaration: CBAMPilotDeclaration;
}

// ============ RESPONSE ENVELOPE ============

/** Per-import comparison: verified supplier factor vs. CBAM default. */
export interface DefaultFactorComparison {
  product: string;
  installation_id: string | null;
  supplier_factor: number;       // tCO2e/t actually used
  cbam_default_factor: number;   // tCO2e/t that would apply without verification
  quantity_t: number;
  emissions_saved_tco2e: number; // (default − supplier) × quantity
  cost_saved_eur: number;        // emissions_saved × certificate_price
  factor_source: string;
}

export interface CBAMPilotResponse {
  schema: 'dws-cbam-calculation-v1';
  request_id: string;
  generated_at: string;       // ISO 8601
  jurisdiction: 'EU';
  regulation: 'EU 2023/956';
  calc_version: string;

  requester_context: {
    agent_id: string;
    declared_purpose: string;
    authority: string;
    authority_status: 'declared_unverified' | 'installation_referenced';
    installation_ids_referenced: string[];
  };

  result: CBAMCalculationResult | null;

  /** Savings vs. CBAM default factors — populated when any supplier-specific factor is used. */
  default_factor_comparison: DefaultFactorComparison[];

  confidence: number;         // 0.0–1.0
  uses_default_factors: boolean;

  citations: Array<{
    reg: string;
    article?: string;
    document?: string;
    note?: string;
  }>;

  missing_evidence_flags: string[];

  refusal_path: null | {
    reason: string;
    missing: string[];
    retry_when: string;
  };

  signature: {
    signed_by: string;
    kya_tier: 'S1';
    fault_attribution: 'requester' | 'evidence_gap' | 'system' | null;

    /**
     * How body_hash was produced.
     *   'hmac-sha256'          — keyed, tamper-evident (CBAM_SIGNING_KEY is set)
     *   'sha256-digest-unkeyed' — integrity checksum ONLY. Anyone can recompute
     *                             it, so it proves the body was not corrupted in
     *                             transit but proves nothing about origin.
     */
    algorithm: 'hmac-sha256' | 'sha256-digest-unkeyed';

    /** Identifier of the signing key. null when unkeyed. */
    key_id: string | null;

    /**
     * True when algorithm is unkeyed, i.e. this envelope is NOT a signature and
     * must not be relied on as evidence of authorship for a CBAM submission.
     */
    integrity_only: boolean;

    /** HMAC or digest over the result JSON, excluding this signature block. */
    body_hash: string;
  };
}

// ============ VALIDATION ============

export interface ValidationResult {
  ok: boolean;
  missing: string[];
  reason?: string;
}

const MINIMUM_IMPORT_QUANTITY = 0.001; // tonnes

function validateRequest(req: CBAMPilotRequest): ValidationResult {
  const missing: string[] = [];

  if (!req.requester?.agent_id) missing.push('requester.agent_id');
  if (!req.requester?.declared_purpose) missing.push('requester.declared_purpose');
  if (!req.requester?.authority) missing.push('requester.authority');

  if (!req.declaration?.declarant) missing.push('declaration.declarant');
  if (!req.declaration?.reportingPeriod) missing.push('declaration.reportingPeriod');

  const imports = req.declaration?.imports ?? [];
  if (!Array.isArray(imports) || imports.length === 0) {
    missing.push('declaration.imports (at least one import required)');
  }

  for (let i = 0; i < imports.length; i++) {
    const imp = imports[i];
    if (!imp.product) missing.push(`imports[${i}].product`);
    if (!imp.sector) missing.push(`imports[${i}].sector`);
    if (!imp.originCountry || imp.originCountry.length !== 2) {
      missing.push(`imports[${i}].originCountry (ISO 3166-1 alpha-2 required)`);
    }
    if (typeof imp.quantity !== 'number' || imp.quantity < MINIMUM_IMPORT_QUANTITY) {
      missing.push(`imports[${i}].quantity (must be ≥ ${MINIMUM_IMPORT_QUANTITY} tonnes)`);
    }
    if (!isCBAMCovered(imp.sector)) {
      missing.push(`imports[${i}].sector '${imp.sector}' is not covered by CBAM Annex I`);
    }
  }

  if (missing.length > 0) {
    return { ok: false, missing, reason: 'Required fields missing or invalid' };
  }

  return { ok: true, missing: [] };
}

// ============ CONFIDENCE SCORING ============

/**
 * Confidence is reduced when default emission factors are used.
 * A fully supplier-verified declaration scores 0.95 (not 1.0 — certificate price is an estimate).
 * Each import using a default factor reduces confidence by 0.10.
 */
function scoreConfidence(result: CBAMCalculationResult): number {
  const defaultCount = result.importBreakdown.filter(b => b.factorType === 'cbam-default').length;
  const total = result.importBreakdown.length;
  if (total === 0) return 0;

  const baseScore = 0.95;
  const penalty = (defaultCount / total) * 0.30;
  return Math.max(0.40, Math.round((baseScore - penalty) * 100) / 100);
}

// ============ CITATIONS ============

const STANDARD_CITATIONS = [
  { reg: 'EU 2023/956', article: '7', note: 'Embedded emissions calculation' },
  { reg: 'EU 2023/956', article: '9', note: 'Carbon price paid in third country' },
  { reg: 'EU 2023/1773', article: '4', note: 'CBAM default emission factors' },
] as const;

// ============ DEFAULT FACTOR COMPARISON ============

/**
 * Show what a verified supplier factor saves against the CBAM default.
 *
 * Only emitted for imports whose installation_id resolves in PRODUCER_REGISTRY,
 * so every number traces to a recorded EPD rather than to an unverified value
 * supplied by the caller. Where a sector publishes several CBAM defaults we take
 * the LOWEST one, which yields the smallest defensible savings figure - a
 * regulatory filing should never overstate a claimed reduction.
 *
 * Imports with no registry match are omitted rather than estimated.
 */
function buildDefaultFactorComparison(
  result: CBAMCalculationResult,
  imports: CBAMPilotImport[],
  certificatePrice: number,
): DefaultFactorComparison[] {
  const comparisons: DefaultFactorComparison[] = [];

  result.importBreakdown.forEach((breakdown, index) => {
    const installationId = imports[index]?.installation_id;
    if (!installationId) return;

    const producer = lookupProducer(installationId);
    if (!producer) return;

    const sectorDefaults = getFactorsForSector(breakdown.sector, 'cbam');
    if (sectorDefaults.length === 0) return;

    const cbamDefaultFactor = Math.min(...sectorDefaults.map((f) => f.factor));
    const emissionsSaved = (cbamDefaultFactor - producer.verified_factor) * breakdown.quantity;

    comparisons.push({
      product: breakdown.product,
      installation_id: installationId,
      supplier_factor: producer.verified_factor,
      cbam_default_factor: cbamDefaultFactor,
      quantity_t: breakdown.quantity,
      emissions_saved_tco2e: Math.round(emissionsSaved * 1000) / 1000,
      cost_saved_eur: Math.round(emissionsSaved * certificatePrice * 100) / 100,
      factor_source: producer.factor_source,
    });
  });

  return comparisons;
}

// ============ MAIN SERVICE ============

export function runCBAMCalculation(
  requestId: string,
  req: CBAMPilotRequest,
  certificatePrice: number = CBAM_CERTIFICATE_PRICE_EUR,
): CBAMPilotResponse {
  const generatedAt = new Date().toISOString();

  // ── Validate ───────────────────────────────────────────────────────────────
  const validation = validateRequest(req);

  if (!validation.ok) {
    const unsigned: Omit<CBAMPilotResponse, 'signature'> = {
      schema: 'dws-cbam-calculation-v1',
      request_id: requestId,
      generated_at: generatedAt,
      jurisdiction: 'EU',
      regulation: 'EU 2023/956',
      calc_version: CALC_VERSION,
      requester_context: {
        agent_id: req.requester?.agent_id ?? 'unknown',
        declared_purpose: req.requester?.declared_purpose ?? '',
        authority: req.requester?.authority ?? '',
        authority_status: 'declared_unverified',
        installation_ids_referenced: [],
      },
      result: null,
      default_factor_comparison: [],
      confidence: 0,
      uses_default_factors: false,
      citations: [...STANDARD_CITATIONS],
      missing_evidence_flags: validation.missing,
      refusal_path: {
        reason: validation.reason ?? 'Validation failed',
        missing: validation.missing,
        retry_when: 'When all required fields are provided',
      },
    };

    return {
      ...unsigned,
      signature: {
        signed_by: `dws-cbam-agent-v${CALC_VERSION}`,
        kya_tier: 'S1',
        fault_attribution: 'requester',
        ...signBody(unsigned),
      },
    };
  }

  // ── Calculate ──────────────────────────────────────────────────────────────
  const calcResult = calculateCBAM(req.declaration, certificatePrice);
  const confidence = scoreConfidence(calcResult);

  // ── Missing evidence flags ─────────────────────────────────────────────────
  const missingFlags: string[] = [];
  if (calcResult.usesDefaultValues) {
    missingFlags.push(
      'One or more imports use CBAM default emission factors. ' +
      'Supplier-specific verified data would increase confidence and may reduce obligation.',
    );
  }
  for (const b of calcResult.importBreakdown) {
    if (b.factorType === 'cbam-default') {
      missingFlags.push(`No supplier-specific emission factor for '${b.product}' (${b.originCountry})`);
    }
  }

  // Only installation ids that actually resolve in PRODUCER_REGISTRY count as
  // referenced. An unmatched id is a declared string, not verified authority.
  const referencedInstallationIds = [
    ...new Set(
      req.declaration.imports
        .map((i) => i.installation_id)
        .filter((id): id is string => typeof id === 'string' && id.length > 0)
        .filter((id) => lookupProducer(id) !== undefined),
    ),
  ];

  const unsigned: Omit<CBAMPilotResponse, 'signature'> = {
    schema: 'dws-cbam-calculation-v1',
    request_id: requestId,
    generated_at: generatedAt,
    jurisdiction: 'EU',
    regulation: 'EU 2023/956',
    calc_version: CALC_VERSION,
    requester_context: {
      agent_id: req.requester.agent_id,
      declared_purpose: req.requester.declared_purpose,
      authority: req.requester.authority,
      authority_status:
        referencedInstallationIds.length > 0 ? 'installation_referenced' : 'declared_unverified',
      installation_ids_referenced: referencedInstallationIds,
    },
    result: calcResult,
    default_factor_comparison: buildDefaultFactorComparison(
      calcResult,
      req.declaration.imports,
      certificatePrice,
    ),
    confidence,
    uses_default_factors: calcResult.usesDefaultValues,
    citations: [...STANDARD_CITATIONS],
    missing_evidence_flags: missingFlags,
    refusal_path: null,
  };

  return {
    ...unsigned,
    signature: {
      signed_by: `dws-cbam-agent-v${CALC_VERSION}`,
      kya_tier: 'S1',
      fault_attribution: null,
      ...signBody(unsigned),
    },
  };
}

/** Key id surfaced alongside the signature so verifiers know what to check. */
const SIGNING_KEY_ID = process.env.CBAM_SIGNING_KEY_ID ?? 'dws-cbam-pilot';

interface BodySignature {
  algorithm: 'hmac-sha256' | 'sha256-digest-unkeyed';
  key_id: string | null;
  integrity_only: boolean;
  body_hash: string;
}

/**
 * Produce the tamper-evidence field for a CBAM evidence envelope.
 *
 * When CBAM_SIGNING_KEY is set this is a real keyed HMAC-SHA256 that a third
 * party holding the key can verify. When it is not set we fall back to a plain
 * SHA-256 digest — but we label it honestly (integrity_only: true) rather than
 * presenting an unkeyed hash as a signature. An unkeyed hash is recomputable by
 * anyone who can alter the body, so it carries no attribution weight and must
 * not be mistaken for one in a regulatory filing.
 */
function signBody(body: object): BodySignature {
  const canonical = JSON.stringify(body);
  const key = process.env.CBAM_SIGNING_KEY;

  if (key && key.length > 0) {
    return {
      algorithm: 'hmac-sha256',
      key_id: SIGNING_KEY_ID,
      integrity_only: false,
      body_hash: crypto.createHmac('sha256', key).update(canonical).digest('hex'),
    };
  }

  return {
    algorithm: 'sha256-digest-unkeyed',
    key_id: null,
    integrity_only: true,
    body_hash: crypto.createHash('sha256').update(canonical).digest('hex'),
  };
}
