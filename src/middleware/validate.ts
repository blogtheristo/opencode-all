/**
 * Zod Request Validation Middleware
 *
 * Validates incoming request body, query, and params using Zod schemas.
 * Returns consistent 400 errors with field-level details.
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { AppError } from './error-handler.js';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
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
        (req as any).query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as any;
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
        (appError as any).fieldErrors = fieldErrors;
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

/** Onboarding request body */
export const OnboardingSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(200),
  industry: z.string().min(1, 'Industry is required'),
  country: z.string().length(2, 'Country must be ISO 3166-1 alpha-2').default('FI'),
  employeeCount: z.enum(['1-50', '51-250', '251-1000', '1000+']).default('1-50'),
  regulations: z.array(z.string()).min(1).default(['csrd']),
});
