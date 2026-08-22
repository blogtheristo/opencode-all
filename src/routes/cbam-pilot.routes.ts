/**
 * CBAM Pilot Routes — KYA-S1 Paid Endpoint
 *
 * POST /api/v1/cbam/calculation
 *   Paid. Requires pilot API key (Authorization: ******
 *   Returns a KYA-S1 LedgerNativeOutput: CBAM calculation with source citations,
 *   confidence score, missing evidence flags, signed output, and refusal path.
 *   Price: €0.10/call (pilot). Logged to paid_endpoint_log.
 *
 * GET /api/v1/cbam/calculation/schema
 *   Free. Returns the request/response JSON schema for agent self-description.
 *   No key required. Agents should call this before their first paid call.
 *
 * KYA tier: S1 (read-only, deterministic, no LLM in hot path)
 * Regulation: EU 2023/956 (CBAM)
 */

import crypto from 'crypto';
import { type Request, type Response, Router } from 'express';
import { z } from 'zod';
import logger from '../utils/logger.js';
import { logPaidCall, paidEndpointMiddleware } from '../middleware/paid-endpoint.middleware.js';
import { CALC_VERSION, runCBAMCalculation } from '../services/cbam-pilot.service.js';

const router = Router();

const ENDPOINT_ID = 'cbam.calculation.v1';

// ============ SCHEMA (free) ============

/** JSON schema served at GET /schema so agents can self-describe before paying. */
const REQUEST_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'DWS CBAM Calculation Request',
  description:
    'KYA-S1 paid endpoint. Returns CBAM calculation with source citations, ' +
    'confidence score, and signed output. Price: €0.10/call. Regulation: EU 2023/956.',
  type: 'object',
  required: ['requester', 'declaration'],
  properties: {
    requester: {
      type: 'object',
      required: ['agent_id', 'declared_purpose', 'authority'],
      properties: {
        agent_id: { type: 'string', description: 'Caller identity (DID or opaque string)' },
        declared_purpose: { type: 'string', description: 'Why this calculation is needed' },
        authority: { type: 'string', description: 'e.g. "EU declarant, EORI DE123456789"' },
      },
    },
    declaration: {
      type: 'object',
      required: ['declarant', 'reportingPeriod', 'imports'],
      properties: {
        declarant: { type: 'string' },
        eoriNumber: { type: 'string', description: 'EU EORI number (optional)' },
        reportingPeriod: { type: 'string', description: 'e.g. "2026-Q1"' },
        imports: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['product', 'sector', 'quantity', 'originCountry'],
            properties: {
              product: { type: 'string', description: 'Product name, e.g. "Iron and steel (hot-rolled)"' },
              sector: {
                type: 'string',
                enum: ['cement', 'steel', 'aluminium', 'fertilizers', 'electricity', 'hydrogen'],
                description: 'CBAM Annex I sector',
              },
              quantity: { type: 'number', minimum: 0.001, description: 'Tonnes (MWh for electricity)' },
              originCountry: { type: 'string', minLength: 2, maxLength: 2, description: 'ISO 3166-1 alpha-2' },
              supplierSpecificFactor: {
                type: 'number',
                description: 'tCO2e/t — if omitted, CBAM default factor is used (reduces confidence)',
              },
              carbonPricePaid: {
                type: 'number',
                description: 'EUR/tCO2 already paid in origin country (reduces CBAM obligation)',
              },
            },
          },
        },
      },
    },
  },
} as const;

router.get('/schema', (_req: Request, res: Response) => {
  res.json({
    endpoint: ENDPOINT_ID,
    price_eur: 0.10,
    kya_tier: 'S1',
    calc_version: CALC_VERSION,
    regulation: 'EU 2023/956',
    request_schema: REQUEST_SCHEMA,
    authentication: 'Authorization: ******',
    contact: 'risto@onelifetime.world',
  });
});

// ============ REQUEST VALIDATION (Zod) ============

const ImportSchema = z.object({
  product: z.string().min(1).max(200),
  sector: z.enum(['cement', 'steel', 'aluminium', 'fertilizers', 'electricity', 'hydrogen']),
  quantity: z.number().min(0.001),
  originCountry: z.string().length(2),
  supplierSpecificFactor: z.number().positive().optional(),
  carbonPricePaid: z.number().min(0).optional(),
});

const DeclarationSchema = z.object({
  declarant: z.string().min(1).max(300),
  eoriNumber: z.string().optional(),
  reportingPeriod: z.string().regex(/^\d{4}-Q[1-4]$/, 'Use format YYYY-Qn, e.g. 2026-Q1'),
  imports: z.array(ImportSchema).min(1).max(50),
});

const RequestBodySchema = z.object({
  requester: z.object({
    agent_id: z.string().min(1).max(200),
    declared_purpose: z.string().min(1).max(500),
    authority: z.string().min(1).max(300),
  }),
  declaration: DeclarationSchema,
});

// ============ PAID CALCULATION ENDPOINT ============

router.post(
  '/',
  paidEndpointMiddleware(ENDPOINT_ID),
  async (req: Request, res: Response): Promise<void> => {
    const requestId = req.paidRequestId ?? crypto.randomUUID();

    // ── Validate body ───────────────────────────────────────────────────────
    const parsed = RequestBodySchema.safeParse(req.body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
      res.status(400).json({
        error: 'Invalid request body',
        issues,
        request_id: requestId,
      });
      return;
    }

    const inputHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(parsed.data))
      .digest('hex');

    // ── Run calculation ─────────────────────────────────────────────────────
    let response;
    let verdict: 'success' | 'refused' | 'error';
    let faultAttr: 'requester' | 'evidence_gap' | 'system' | undefined;

    try {
      response = runCBAMCalculation(requestId, parsed.data);

      if (response.refusal_path !== null) {
        verdict = 'refused';
        faultAttr = response.signature.fault_attribution ?? 'requester';
      } else {
        verdict = 'success';
      }
    } catch (err) {
      logger.error('CBAM calculation failed', { requestId, err });

      await logPaidCall({
        requestId,
        keyId: req.paidKeyId,
        orgId: req.paidOrgId,
        endpoint: ENDPOINT_ID,
        inputHash,
        verdict: 'error',
        faultAttr: 'system',
      });

      res.status(500).json({
        error: 'Calculation failed',
        request_id: requestId,
        fault_attribution: 'system',
      });
      return;
    }

    // ── Log to paid_endpoint_log ────────────────────────────────────────────
    await logPaidCall({
      requestId,
      keyId: req.paidKeyId,
      orgId: req.paidOrgId,
      endpoint: ENDPOINT_ID,
      inputHash,
      verdict,
      confidence: response.confidence,
      calcVersion: CALC_VERSION,
      usesDefaults: response.uses_default_factors,
      missingEvidence: response.missing_evidence_flags,
      faultAttr,
    });

    const statusCode = verdict === 'refused' ? 422 : 200;
    res.status(statusCode).json(response);
  },
);

export default router;
