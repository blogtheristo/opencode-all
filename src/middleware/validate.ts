/**
 * Zod Request Validation Middleware
 *
 * Validates incoming request body, query, and params using Zod schemas.
 * Returns consistent 400 errors with field-level details.
 */

import { type NextFunction, type Request, type Response } from 'express';
import { z, ZodError, type ZodType } from 'zod';
import { AppError } from './error-handler.js';

interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/**
 * Middleware factory that validates request parts against Zod schemas.
 *
 * @example
 * const CreateOrgSchema = z.object({ name: z.string().min(1), industry: z.string() });
 * router.post('/orgs', validate({ body: CreateOrgSchema }), handler);
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = err.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        }));

        const appError = new AppError(
          `Validation failed: ${fieldErrors.map((f) => `${f.field} — ${f.message}`).join('; ')}`,
          400,
          'VALIDATION_ERROR',
        );

        // Attach field-level errors for structured consumption
        Object.assign(appError, { fieldErrors });
        next(appError);
      } else {
        next(err);
      }
    }
  };
}

// ============ COMMON SCHEMAS ============

/** Pagination query params */
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** UUID param */
export const UuidParamSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

/** Compliance check request body */
export const ComplianceCheckSchema = z.object({
  industry: z.string().min(1, 'Industry is required'),
  regulations: z.array(z.string()).min(1, 'At least one regulation required').default(['csrd']),
  currentMeasures: z.object({
    carbonReporting: z.boolean().default(false),
    emissionsMonitoring: z.boolean().default(false),
    supplyChainDueDiligence: z.boolean().default(false),
    aiSystemLogging: z.boolean().default(false),
  }).default({
    carbonReporting: false,
    emissionsMonitoring: false,
    supplyChainDueDiligence: false,
    aiSystemLogging: false,
  }),
  annualEmissions: z.number().min(0).default(0),
  importValue: z.number().min(0).default(0),
});

/** ERP connection configuration */
export const ErpConnectionSchema = z.object({
  type: z.enum(['sap', 'ifs', 'dynamics', 'monitor', 'visma', 'jeeves', 'manual', 'api']),
  host: z.string().url().optional(),
  authMethod: z.enum(['api-key', 'oauth2', 'basic', 'none']).default('none'),
  tenantId: z.string().max(200).optional(),
  verified: z.boolean().default(false),
});

/** Onboarding request body — DWS7 multi-step wizard */
export const OnboardingSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(200),
  industry: z.string().min(1, 'Industry is required'),
  country: z.string().min(1, 'Country is required').max(100),
  employeeCount: z.enum(['1-50', '51-250', '251-1000', '1000+']).default('1-50'),
  annualRevenue: z.string().optional(),
  regulations: z.array(z.string()).min(1).default(['csrd']),
  dataSources: z.array(z.string()).default([]),
  erpConnection: ErpConnectionSchema.optional(),
});

/** Follow-up onboarding assessment payload */
export const OnboardingAssessSchema = z.object({
  dataPoints: z
    .array(
      z.object({
        disclosureId: z.string().min(1),
        provided: z.boolean(),
      }),
    )
    .default([]),
  annualEmissions: z.number().min(0).default(0),
  importValue: z.number().min(0).default(0),
  hasTransitionPlan: z.boolean().default(false),
  hasEmissionsMonitoring: z.boolean().default(false),
  hasSupplyChainDD: z.boolean().default(false),
});

/** ERP test endpoint payload */
export const OnboardingErpTestSchema = z
  .object({
    type: z.enum(['sap', 'ifs', 'dynamics', 'monitor', 'visma', 'jeeves', 'manual', 'api']),
    host: z.string().url().optional(),
    authMethod: z.enum(['api-key', 'oauth2', 'basic', 'none']).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.type !== 'manual' && val.type !== 'api' && !val.host) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['host'],
        message: 'Host URL is required for ERP connections',
      });
    }
  });

/** Onboarding team invite payload */
export const OnboardingInviteSchema = z.object({
  email: z.string().email('Valid email is required'),
});
