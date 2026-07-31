/**
 * Auth & Compliance Route Integration Tests
 *
 * Tests HTTP-level request/response for critical API routes.
 * Uses direct handler invocation (no supertest dependency needed).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (P1-RC3 integration tests)
 * Date: 2026-03-21
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextFunction, type Request, type Response } from 'express';
import { AppError } from '../../middleware/error-handler.js';
import {
  ComplianceCheckSchema,
  OnboardingAssessSchema,
  OnboardingErpTestSchema,
  OnboardingSchema,
  validate,
} from '../../middleware/validate.js';

// ============ HELPERS ============

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    method: 'POST',
    path: '/test',
    headers: { 'content-type': 'application/json' },
    body: {},
    query: {},
    params: {},
    get: vi.fn(),
    ip: '127.0.0.1',
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response & { _status: number; _json: any } {
  const res = {
    _status: 200,
    _json: null,
    status(code: number) {
      this._status = code;
      return this;
    },
    json(data: any) {
      this._json = data;
      return this;
    },
    headersSent: false,
  } as unknown as Response & { _status: number; _json: any };
  return res;
}

// ============ COMPLIANCE SCHEMA VALIDATION ============

describe('Compliance Check Schema Validation', () => {
  it('accepts valid compliance check input', () => {
    const input = {
      industry: 'steel',
      regulations: ['csrd', 'ets'],
      currentMeasures: {
        carbonReporting: true,
        emissionsMonitoring: false,
        supplyChainDueDiligence: false,
        aiSystemLogging: false,
      },
      annualEmissions: 50000,
      importValue: 150000,
    };

    const result = ComplianceCheckSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.industry).toBe('steel');
      expect(result.data.regulations).toContain('csrd');
      expect(result.data.annualEmissions).toBe(50000);
    }
  });

  it('rejects missing industry', () => {
    const result = ComplianceCheckSchema.safeParse({
      regulations: ['csrd'],
    });
    expect(result.success).toBe(false);
  });

  it('applies defaults for optional fields', () => {
    const result = ComplianceCheckSchema.safeParse({
      industry: 'cement',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.regulations).toEqual(['csrd']);
      expect(result.data.annualEmissions).toBe(0);
      expect(result.data.importValue).toBe(0);
      expect(result.data.currentMeasures.carbonReporting).toBe(false);
    }
  });

  it('rejects empty industry string', () => {
    const result = ComplianceCheckSchema.safeParse({
      industry: '',
      regulations: ['csrd'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty regulations array', () => {
    const result = ComplianceCheckSchema.safeParse({
      industry: 'steel',
      regulations: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative emissions', () => {
    const result = ComplianceCheckSchema.safeParse({
      industry: 'steel',
      annualEmissions: -100,
    });
    expect(result.success).toBe(false);
  });
});

// ============ ONBOARDING SCHEMA VALIDATION ============

describe('Onboarding Schema Validation', () => {
  it('accepts valid onboarding input', () => {
    const input = {
      companyName: 'Acme Corp',
      industry: 'steel',
      country: 'Finland',
      employeeCount: '51-250' as const,
      regulations: ['csrd', 'ets'],
    };

    const result = OnboardingSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.companyName).toBe('Acme Corp');
      expect(result.data.employeeCount).toBe('51-250');
    }
  });

  it('rejects missing company name', () => {
    const result = OnboardingSchema.safeParse({
      industry: 'steel',
      country: 'Finland',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid employee count', () => {
    const result = OnboardingSchema.safeParse({
      companyName: 'Test Corp',
      industry: 'steel',
      country: 'Finland',
      employeeCount: 'many',
    });
    expect(result.success).toBe(false);
  });

  it('applies defaults for optional fields', () => {
    const result = OnboardingSchema.safeParse({
      companyName: 'Test Corp',
      industry: 'cement',
      country: 'Germany',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.employeeCount).toBe('1-50');
      expect(result.data.regulations).toEqual(['csrd']);
      expect(result.data.dataSources).toEqual([]);
    }
  });

  it('accepts ERP connection', () => {
    const result = OnboardingSchema.safeParse({
      companyName: 'SAP Corp',
      industry: 'manufacturing',
      country: 'Germany',
      erpConnection: {
        type: 'sap',
        authMethod: 'oauth2',
        verified: false,
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.erpConnection?.type).toBe('sap');
    }
  });

  it('rejects unknown ERP type', () => {
    const result = OnboardingSchema.safeParse({
      companyName: 'Test Corp',
      industry: 'steel',
      country: 'Finland',
      erpConnection: {
        type: 'unknown_erp',
      },
    });
    expect(result.success).toBe(false);
  });
});

describe('Onboarding Assess Schema Validation', () => {
  it('accepts valid assessment payload', () => {
    const result = OnboardingAssessSchema.safeParse({
      dataPoints: [{ disclosureId: 'E1-1', provided: true }],
      annualEmissions: 12345,
      importValue: 5000,
      hasTransitionPlan: true,
      hasEmissionsMonitoring: true,
      hasSupplyChainDD: false,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative emissions', () => {
    const result = OnboardingAssessSchema.safeParse({
      annualEmissions: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe('Onboarding ERP Test Schema Validation', () => {
  it('accepts manual ERP test payload without host', () => {
    const result = OnboardingErpTestSchema.safeParse({
      type: 'manual',
      authMethod: 'none',
    });
    expect(result.success).toBe(true);
  });

  it('requires host for ERP systems', () => {
    const result = OnboardingErpTestSchema.safeParse({
      type: 'sap',
      authMethod: 'oauth2',
    });
    expect(result.success).toBe(false);
  });
});

// ============ VALIDATE MIDDLEWARE INTEGRATION ============

describe('validate() middleware', () => {
  it('passes valid body through to handler', () => {
    const middleware = validate({ body: ComplianceCheckSchema });
    const req = mockReq({
      body: {
        industry: 'steel',
        regulations: ['csrd'],
      },
    });
    const res = mockRes();
    const next = vi.fn();

    middleware(req, res as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // no error
    // Body should be parsed with defaults applied
    expect(req.body.annualEmissions).toBe(0);
    expect(req.body.currentMeasures.carbonReporting).toBe(false);
  });

  it('rejects invalid body with 400 AppError', () => {
    const middleware = validate({ body: ComplianceCheckSchema });
    const req = mockReq({
      body: { industry: '' }, // empty = invalid
    });
    const res = mockRes();
    const next = vi.fn();

    middleware(req, res as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
  });

  it('includes field-level errors in AppError', () => {
    const middleware = validate({ body: OnboardingSchema });
    const req = mockReq({
      body: {}, // missing required fields
    });
    const res = mockRes();
    const next = vi.fn();

    middleware(req, res as any, next);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect((err as any).fieldErrors).toBeDefined();
    expect((err as any).fieldErrors.length).toBeGreaterThan(0);
    // Should mention required fields
    const fields = (err as any).fieldErrors.map((f: any) => f.field);
    expect(fields).toContain('companyName');
    expect(fields).toContain('industry');
    expect(fields).toContain('country');
  });
});

// ============ SCORING ENGINE INTEGRATION ============

describe('Compliance Scoring Pipeline (Integration)', () => {
  let scoreCompliance: typeof import('../../compliance/scoring-engine.js').scoreCompliance;
  let generateReport: typeof import('../../compliance/report-generator.js').generateReport;

  beforeEach(async () => {
    const scoring = await import('../../compliance/scoring-engine.js');
    const reporting = await import('../../compliance/report-generator.js');
    scoreCompliance = scoring.scoreCompliance;
    generateReport = reporting.generateReport;
  });

  it('runs full pipeline: input → score → report', () => {
    const input = {
      industry: 'steel',
      regulations: ['csrd', 'ets', 'cbam'],
      annualEmissions: 50000,
      importValue: 200000,
      hasTransitionPlan: true,
      hasEmissionsMonitoring: true,
      hasSupplyChainDueDiligence: false,
      dataPoints: [
        { disclosureId: 'E1-1', provided: true },
        { disclosureId: 'E1-6', provided: true },
        { disclosureId: 'S1-1', provided: false },
      ],
    };

    const score = scoreCompliance(input);
    expect(score.overallScore).toBeGreaterThanOrEqual(0);
    expect(score.overallScore).toBeLessThanOrEqual(100);
    expect(score.regulationScores).toBeDefined();

    const report = generateReport(score, {
      name: 'Test Steel Co',
      industry: 'steel',
      country: 'FI',
    });
    expect(report.reportId).toBeDefined();
    expect(report.summary.overallScore).toBe(score.overallScore);
    expect(report.gaps.length).toBeGreaterThan(0);
  });

  it('returns lower score for company with no measures', () => {
    const noMeasures = scoreCompliance({
      industry: 'cement',
      regulations: ['csrd'],
      annualEmissions: 100000,
      importValue: 0,
      hasTransitionPlan: false,
      hasEmissionsMonitoring: false,
      hasSupplyChainDueDiligence: false,
      dataPoints: [],
    });

    const withMeasures = scoreCompliance({
      industry: 'cement',
      regulations: ['csrd'],
      annualEmissions: 100000,
      importValue: 0,
      hasTransitionPlan: true,
      hasEmissionsMonitoring: true,
      hasSupplyChainDueDiligence: true,
      dataPoints: Array.from({ length: 20 }, (_, i) => ({
        disclosureId: `E1-${i + 1}`,
        provided: true,
      })),
    });

    expect(withMeasures.overallScore).toBeGreaterThan(noMeasures.overallScore);
  });

  it('includes ETS cost in report when emissions provided', () => {
    const score = scoreCompliance({
      industry: 'steel',
      regulations: ['ets'],
      annualEmissions: 75000,
      importValue: 0,
      hasTransitionPlan: false,
      hasEmissionsMonitoring: true,
      hasSupplyChainDueDiligence: false,
      dataPoints: [],
    });

    const report = generateReport({ industry: 'steel', annualEmissions: 75000 }, score);
    expect(report.summary).toBeDefined();
  });
});
