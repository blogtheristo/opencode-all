/**
 * Compliance API Routes
 *
 * POST /api/v1/compliance/assess    — Run compliance assessment
 * GET  /api/v1/compliance/registry  — Get ESRS disclosure registry
 * GET  /api/v1/compliance/report/:id — Get assessment report (future: from DB)
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { scoreCompliance, type ComplianceScoringInput } from '../compliance/scoring-engine.js';
import { generateReport } from '../compliance/report-generator.js';
import { ESRS_REGISTRY, getMandatoryDisclosures, TOTAL_DISCLOSURES, MANDATORY_DISCLOSURES } from '../compliance/esrs-registry.js';
import { estimateETSCost } from '../compliance/ets-calculator.js';
import { estimateCBAMCost, isCBAMCovered } from '../compliance/cbam-calculator.js';
import { ETS_CARBON_PRICE_EUR, CBAM_CERTIFICATE_PRICE_EUR } from '../compliance/emission-factors.js';
import logger from '../utils/logger.js';

const router = Router();

// ============ SCHEMAS ============

const AssessmentSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().min(1),
  country: z.string().length(2).default('FI'),
  dataPoints: z.array(z.object({
    disclosureId: z.string(),
    provided: z.boolean(),
  })).default([]),
  annualEmissions: z.number().min(0).default(0),
  importValue: z.number().min(0).default(0),
  hasTransitionPlan: z.boolean().default(false),
  hasEmissionsMonitoring: z.boolean().default(false),
  hasSupplyChainDD: z.boolean().default(false),
});

// ============ ROUTES ============

/**
 * POST /api/v1/compliance/assess
 * Run a compliance assessment and get scored results with gaps
 */
router.post(
  '/assess',
  validate({ body: AssessmentSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;

      logger.info('Compliance assessment requested', {
        company: body.companyName,
        industry: body.industry,
        dataPoints: body.dataPoints.length,
      });

      const scoringInput: ComplianceScoringInput = {
        industry: body.industry,
        dataPoints: body.dataPoints,
        annualEmissions: body.annualEmissions,
        importValue: body.importValue,
        hasTransitionPlan: body.hasTransitionPlan,
        hasEmissionsMonitoring: body.hasEmissionsMonitoring,
        hasSupplyChainDD: body.hasSupplyChainDD,
      };

      const result = scoreCompliance(scoringInput);

      const report = generateReport(result, {
        name: body.companyName,
        industry: body.industry,
        country: body.country,
      });

      logger.info('Compliance assessment completed', {
        company: body.companyName,
        overallScore: result.overallScore,
        gaps: result.gaps.length,
      });

      res.status(200).json(report);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/compliance/registry
 * Get the full ESRS disclosure registry (or filtered by query)
 */
router.get('/registry', (req: Request, res: Response) => {
  const { standard, category, mandatory } = req.query;

  let disclosures = [...ESRS_REGISTRY];

  if (typeof standard === 'string') {
    disclosures = disclosures.filter((d) => d.standard === standard.toUpperCase());
  }
  if (typeof category === 'string') {
    disclosures = disclosures.filter((d) => d.category === category.toLowerCase());
  }
  if (mandatory === 'true') {
    disclosures = disclosures.filter((d) => d.isMandatory);
  }

  res.json({
    total: disclosures.length,
    totalInRegistry: TOTAL_DISCLOSURES,
    mandatoryCount: MANDATORY_DISCLOSURES,
    disclosures,
  });
});

/**
 * GET /api/v1/compliance/overview
 * Dashboard widget endpoint — returns overall compliance score with regulation breakdown.
 * Used by the ComplianceScoreWidget component.
 */
router.get('/overview', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fixed demo assessment — deterministic so scores are stable across refreshes.
    // In production this would pull the latest saved assessment from the database.
    const mandatoryDisclosures = getMandatoryDisclosures().slice(0, 30);
    const demoResult = scoreCompliance({
      industry: 'manufacturing',
      dataPoints: mandatoryDisclosures.map((d, i) => ({
        disclosureId: d.id,
        provided: i % 3 !== 0, // ~67% provided — deterministic pattern
      })),
      annualEmissions: 25000,
      importValue: 100000,
      hasTransitionPlan: true,
      hasEmissionsMonitoring: true,
      hasSupplyChainDD: false,
    });

    const regulationScores = demoResult.regulationScores.map(r => ({
      id: r.regulation.toLowerCase().replace(/\s+/g, '-'),
      name: r.regulation,
      score: r.score,
      status: r.status,
      gaps: demoResult.gaps.filter(g => g.regulation === r.regulation).length,
    }));
    res.json({
      overallScore: demoResult.overallScore,
      previousScore: Math.max(0, demoResult.overallScore - 8),
      lastAssessment: new Date(Date.now() - 86400000 * 2).toISOString(),
      regulations: regulationScores,
      totalGaps: demoResult.gaps.length,
      criticalGaps: demoResult.gaps.filter(g => g.severity === 'critical').length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/compliance/cost-estimate
 * Estimate ETS + CBAM compliance costs for a given scenario.
 * Quick calculation without full assessment — useful for onboarding and sales.
 */
router.post('/cost-estimate', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { annualEmissions = 0, importQuantity = 0, sector = 'manufacturing', originCountry = 'CN', freeAllocation = 0 } = req.body;

    const ets = estimateETSCost(annualEmissions, freeAllocation);
    const cbam = estimateCBAMCost(importQuantity, sector, originCountry);

    res.json({
      ets: {
        surrenderObligation: ets.surrenderObligation,
        estimatedCost: ets.estimatedCost,
        carbonPrice: ETS_CARBON_PRICE_EUR,
        unit: 'EUR',
      },
      cbam: {
        covered: cbam.covered,
        embeddedEmissions: cbam.embeddedEmissions,
        estimatedCost: cbam.estimatedCost,
        certificatePrice: CBAM_CERTIFICATE_PRICE_EUR,
        unit: 'EUR',
      },
      totalEstimatedCost: Math.round((ets.estimatedCost + cbam.estimatedCost) * 100) / 100,
      note: 'Estimates use EU default emission factors. Actual costs depend on verified data.',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
