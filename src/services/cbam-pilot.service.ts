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
 * Price: €0.10/call (pilot). The first metric is repeat purchase, not revenue.
 *
 * KYA tier: S1 — deterministic, read-only, no external writes, no LLM in hot path.
 */

import crypto from 'crypto';
import { calculateCBAM, isCBAMCovered, type CBAMDeclaration, type CBAMCalculationResult } from '../compliance/cbam-calculator.js';
import { CBAM_CERTIFICATE_PRICE_EUR } from '../compliance/emission-factors.js';

export const CALC_VERSION = '1.0.0';

// ============ REQUEST SCHEMA ============

export interface CBAMPilotRequest {
  requester: {
    agent_id: string;
    declared_purpose: string;
    authority: string; // e.g. "EU declarant, EORI DE123456789"
  };
  declaration: CBAMDeclaration;
}

// ============ RESPONSE ENVELOPE ============

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
    authority_status: 'declared_unverified';
  };

  result: CBAMCalculationResult | null;

  confidence: number;         // 0.0–1.0
  uses_default_factors: boolean;

  citations: Array<{
    reg: string;
    article: string;
    paragraph?: string;
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
    body_hash: string;        // SHA-256 of the result JSON, excluding signature block
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
      },
      result: null,
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

    const bodyHash = hashBody(unsigned);
    return {
      ...unsigned,
      signature: {
        signed_by: `dws-cbam-agent-v${CALC_VERSION}`,
        kya_tier: 'S1',
        fault_attribution: 'requester',
        body_hash: bodyHash,
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
      authority_status: 'declared_unverified',
    },
    result: calcResult,
    confidence,
    uses_default_factors: calcResult.usesDefaultValues,
    citations: [...STANDARD_CITATIONS],
    missing_evidence_flags: missingFlags,
    refusal_path: null,
  };

  const bodyHash = hashBody(unsigned);
  return {
    ...unsigned,
    signature: {
      signed_by: `dws-cbam-agent-v${CALC_VERSION}`,
      kya_tier: 'S1',
      fault_attribution: null,
      body_hash: bodyHash,
    },
  };
}

function hashBody(body: object): string {
  return crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
}
