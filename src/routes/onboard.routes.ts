/**
 * Onboarding API Routes
 *
 * POST /api/v1/onboard           — Complete onboarding wizard
 * GET  /api/v1/onboard/status    — Check onboarding status
 * POST /api/v1/onboard/assess    — Run first baseline assessment after onboarding
 */

import { Router, Request, Response, NextFunction } from 'express';
import { validate, OnboardingSchema } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { scoreCompliance, type ComplianceScoringInput } from '../compliance/scoring-engine.js';
import { generateReport } from '../compliance/report-generator.js';
import { getMandatoryDisclosures } from '../compliance/esrs-registry.js';
import { Errors } from '../middleware/error-handler.js';
import logger from '../utils/logger.js';

const router = Router();

// ============ TYPES ============

interface OnboardingData {
  companyName: string;
  industry: string;
  country: string;
  employeeCount: string;
  regulations: string[];
  dataSources?: string[];
}

// In-memory store for MVP — replace with Supabase in production
const onboardingStore = new Map<string, OnboardingData & { completedAt: string }>();

// ============ ROUTES ============

/**
 * POST /api/v1/onboard
 * Complete onboarding wizard — creates org profile and triggers baseline assessment.
 */
router.post(
  '/',
  authenticateToken,
  validate({ body: OnboardingSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const body = req.body as OnboardingData;

      logger.info('Onboarding started', {
        userId,
        company: body.companyName,
        industry: body.industry,
      });

      // Store onboarding data
      onboardingStore.set(userId, {
        ...body,
        completedAt: new Date().toISOString(),
      });

      // Run baseline assessment with zero data — shows the customer their starting point
      const baselineInput: ComplianceScoringInput = {
        industry: body.industry,
        dataPoints: [],
        annualEmissions: 0,
        importValue: 0,
        hasTransitionPlan: false,
        hasEmissionsMonitoring: false,
        hasSupplyChainDD: false,
      };

      const baselineResult = scoreCompliance(baselineInput);
      const baselineReport = generateReport(baselineResult, {
        name: body.companyName,
        industry: body.industry,
        country: body.country,
      });

      logger.info('Onboarding completed', {
        userId,
        company: body.companyName,
        baselineScore: baselineResult.overallScore,
        gaps: baselineResult.gaps.length,
      });

      res.status(201).json({
        status: 'onboarding_complete',
        company: {
          name: body.companyName,
          industry: body.industry,
          country: body.country,
          employeeCount: body.employeeCount,
        },
        baseline: {
          overallScore: baselineResult.overallScore,
          complianceStatus: baselineResult.complianceStatus,
          criticalGaps: baselineResult.gaps.filter((g) => g.severity === 'critical').length,
          totalGaps: baselineResult.gaps.length,
          mandatoryDisclosures: getMandatoryDisclosures().length,
          dataCompleteness: baselineResult.dataCompleteness,
        },
        report: baselineReport,
        nextSteps: [
          'Upload your emissions data (Scope 1, 2, 3)',
          'Complete ESRS disclosure questionnaire',
          'Connect data sources (ERP, ESG platform)',
          'Schedule your first detailed assessment',
        ],
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/onboard/status
 * Check if user has completed onboarding.
 */
router.get(
  '/status',
  authenticateToken,
  (req: Request, res: Response) => {
    const userId = (req as any).user?.id || 'anonymous';
    const data = onboardingStore.get(userId);

    if (data) {
      res.json({
        completed: true,
        completedAt: data.completedAt,
        company: data.companyName,
        industry: data.industry,
      });
    } else {
      res.json({
        completed: false,
      });
    }
  },
);

/**
 * POST /api/v1/onboard/assess
 * Run a follow-up assessment after onboarding with actual data.
 * This is the "close the loop" endpoint — proves value after data upload.
 */
router.post(
  '/assess',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const onboarding = onboardingStore.get(userId);

      if (!onboarding) {
        throw Errors.badRequest('Complete onboarding first', 'ONBOARDING_REQUIRED');
      }

      const body = req.body;
      const input: ComplianceScoringInput = {
        industry: onboarding.industry,
        dataPoints: body.dataPoints || [],
        annualEmissions: body.annualEmissions || 0,
        importValue: body.importValue || 0,
        hasTransitionPlan: body.hasTransitionPlan || false,
        hasEmissionsMonitoring: body.hasEmissionsMonitoring || false,
        hasSupplyChainDD: body.hasSupplyChainDD || false,
      };

      const result = scoreCompliance(input);
      const report = generateReport(result, {
        name: onboarding.companyName,
        industry: onboarding.industry,
        country: onboarding.country,
      });

      res.json({
        status: 'assessment_complete',
        report,
        improvement: {
          note: 'Compare with your baseline score from onboarding to track progress',
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
