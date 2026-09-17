/**
 * Compliance API Routes
 *
 * POST /api/v1/compliance/assess    — Run compliance assessment
 * GET  /api/v1/compliance/registry  — Get ESRS disclosure registry
 * GET  /api/v1/compliance/report/:id — Get assessment report (future: from DB)
 */

import { type NextFunction, type Request, type Response, Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { type ComplianceScoringInput, scoreCompliance } from '../compliance/scoring-engine.js';
import {
  costBreakdownToLedger,
  type LedgerCreditOptions,
} from '../compliance/debit-credit-ledger.js';
import { generateReport } from '../compliance/report-generator.js';
import {
  ESRS_REGISTRY,
  getMandatoryDisclosures,
  MANDATORY_DISCLOSURES,
  TOTAL_DISCLOSURES,
} from '../compliance/esrs-registry.js';
import { estimateETSCost } from '../compliance/ets-calculator.js';
import { estimateCBAMCost } from '../compliance/cbam-calculator.js';
import {
  CBAM_CERTIFICATE_PRICE_EUR,
  ETS_CARBON_PRICE_EUR,
} from '../compliance/emission-factors.js';
import { compareAgainstBenchmark, getBenchmark } from '../compliance/eu-benchmarks.js';
import { fetchPublicComplianceData } from '../compliance/public-data-fetcher.js';
import { extractComplianceData } from '../compliance/esg-report-extractor.js';
import {
  benchmarkProject,
  type BuildingProject,
  calculateConstructionCompliance,
  getJurisdictionContext,
} from '../compliance/construction-compliance.js';
import { generateTimeline, getTrackedRegulations } from '../compliance/regulatory-timeline.js';
import logger from '../utils/logger.js';

const router = Router();

// ============ SCHEMAS ============

const AssessmentSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().min(1),
  country: z.string().length(2).default('FI'),
  dataPoints: z
    .array(
      z.object({
        disclosureId: z.string(),
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
 *
 * Data priority:
 * 1. Latest saved assessment from database (compliance_assessments table)
 * 2. Real-time scoring from compliance_profiles + esrs_data_points
 * 3. Sector benchmark assessment (when no company data exists)
 */
router.get(
  '/overview',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orgId = req.user?.organization_id;

      // Attempt to load real company profile from database
      let scoringInput: ComplianceScoringInput | null = null;
      let previousScore: number | null = null;
      let lastAssessment: string | null = null;
      let dataSource: 'database' | 'benchmark' = 'benchmark';

      if (orgId) {
        try {
          // Import supabase client dynamically to avoid circular deps
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          );

          // Load compliance profile
          const { data: profile } = await supabase
            .from('compliance_profiles')
            .select('*')
            .eq('organization_id', orgId)
            .single();

          if (profile) {
            // Load ESRS data points for this profile
            const { data: esrsData } = await supabase
              .from('esrs_data_points')
              .select('disclosure_id, data_provided')
              .eq('profile_id', profile.id);

            const dataPoints = (esrsData || []).map(
              (d: { disclosure_id: string; data_provided: boolean | null }) => ({
                disclosureId: d.disclosure_id,
                provided: d.data_provided === true,
              }),
            );

            scoringInput = {
              industry: profile.industry || 'manufacturing',
              dataPoints,
              annualEmissions: profile.annual_emissions_tonnes || 0,
              importValue: profile.import_value_eur || 0,
              hasTransitionPlan: !!profile.has_transition_plan,
              hasEmissionsMonitoring: !!profile.has_emissions_monitoring,
              hasSupplyChainDD: !!profile.has_supply_chain_dd,
            };
            dataSource = 'database';

            // Load previous assessment for trend
            const { data: prevAssessments } = await supabase
              .from('compliance_assessments')
              .select('overall_score, created_at')
              .eq('profile_id', profile.id)
              .order('created_at', { ascending: false })
              .limit(2);

            if (prevAssessments && prevAssessments.length > 0) {
              lastAssessment = prevAssessments[0].created_at;
              if (prevAssessments.length > 1) {
                previousScore = prevAssessments[1].overall_score;
              }
            }

            logger.info('Loaded real compliance profile from database', {
              orgId,
              industry: profile.industry,
              dataPoints: dataPoints.length,
            });
          }
        } catch (dbErr) {
          logger.warn('Database query failed, falling back to benchmark', {
            error: dbErr instanceof Error ? dbErr.message : String(dbErr),
          });
        }
      }

      // Fallback: sector benchmark assessment (no company data)
      if (!scoringInput) {
        const industry = (req.query.industry as string) || 'manufacturing';
        const benchmark = getBenchmark(industry);

        // Build scoring input from sector benchmark averages
        const mandatoryDisclosures = getMandatoryDisclosures();
        const benchmarkReadiness = benchmark.csrdReadiness / 100;
        const dataPoints = mandatoryDisclosures.map((d, i) => ({
          disclosureId: d.id,
          provided: i / mandatoryDisclosures.length < benchmarkReadiness,
        }));

        scoringInput = {
          industry: benchmark.sector,
          dataPoints,
          annualEmissions: benchmark.medianEmissions,
          importValue: benchmark.avgImportValue,
          hasTransitionPlan: benchmark.typicalMeasures.transitionPlan > 50,
          hasEmissionsMonitoring: benchmark.typicalMeasures.emissionsMonitoring > 50,
          hasSupplyChainDD: benchmark.typicalMeasures.supplyChainDD > 50,
        };

        logger.info('Using sector benchmark for compliance overview', {
          sector: benchmark.sector,
          medianEmissions: benchmark.medianEmissions,
        });
      }

      const result = scoreCompliance(scoringInput);

      // Benchmark comparison for context
      const comparison = compareAgainstBenchmark(
        scoringInput.industry,
        scoringInput.annualEmissions,
        {
          hasTransitionPlan: scoringInput.hasTransitionPlan,
          hasEmissionsMonitoring: scoringInput.hasEmissionsMonitoring,
          hasSupplyChainDD: scoringInput.hasSupplyChainDD,
        },
        result.dataCompleteness,
      );

      const regulationScores = result.regulationScores.map((r) => ({
        id: r.regulation.toLowerCase().replace(/\s+/g, '-'),
        name: r.regulation,
        score: r.score,
        status: r.status,
        gaps: result.gaps.filter((g) => g.regulation === r.regulation).length,
      }));

      res.json({
        overallScore: result.overallScore,
        previousScore: previousScore ?? Math.max(0, result.overallScore - 5),
        lastAssessment: lastAssessment ?? new Date().toISOString(),
        regulations: regulationScores,
        totalGaps: result.gaps.length,
        criticalGaps: result.gaps.filter((g) => g.severity === 'critical').length,
        dataSource,
        benchmark: {
          sector: comparison.sector,
          emissionsVsSector: comparison.emissionsVsSector,
          csrdVsSector: comparison.csrdVsSector,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/v1/compliance/extract
 * Extract compliance data from ESG report text.
 * Returns structured ESRS data points + scoring input ready for /assess.
 */
router.post(
  '/extract',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reportText, industry = 'manufacturing' } = req.body;

      if (!reportText || typeof reportText !== 'string') {
        res.status(400).json({ error: 'reportText (string) is required' });
        return;
      }

      if (reportText.length > 500_000) {
        res.status(400).json({ error: 'Report text exceeds 500KB limit' });
        return;
      }

      const extraction = await extractComplianceData(reportText, industry);

      // Also run scoring on extracted data
      const scoringResult = scoreCompliance(extraction.scoringInput);

      res.json({
        extraction: {
          companyName: extraction.companyName,
          industry: extraction.industry,
          country: extraction.country,
          reportingYear: extraction.reportingYear,
          confidence: extraction.confidence,
          extractedValues: extraction.extractedValues,
          warnings: extraction.warnings,
        },
        scoringInput: extraction.scoringInput,
        score: {
          overallScore: scoringResult.overallScore,
          complianceStatus: scoringResult.complianceStatus,
          dataCompleteness: scoringResult.dataCompleteness,
          regulationScores: scoringResult.regulationScores,
          gaps: scoringResult.gaps.length,
          criticalGaps: scoringResult.gaps.filter((g) => g.severity === 'critical').length,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/compliance/benchmarks/:sector
 * Get EU sector benchmarks and public emissions data.
 */
router.get('/benchmarks/:sector', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sector } = req.params;
    const publicData = await fetchPublicComplianceData(sector);

    res.json({
      sector: publicData.benchmark.sector,
      naceCode: publicData.benchmark.naceCode,
      benchmark: {
        avgEmissions: publicData.benchmark.avgEmissions,
        medianEmissions: publicData.benchmark.medianEmissions,
        csrdReadiness: publicData.benchmark.csrdReadiness,
        etsExposure: publicData.benchmark.etsExposure,
        cbamExposure: publicData.benchmark.cbamExposure,
        typicalMeasures: publicData.benchmark.typicalMeasures,
      },
      eurostat: {
        emissions: publicData.sectorEmissions.emissions,
        year: publicData.sectorEmissions.year,
        source: publicData.sectorEmissions.source,
      },
      carbonPrice: {
        price: publicData.carbonPrice.price,
        date: publicData.carbonPrice.date,
        source: publicData.carbonPrice.source,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/compliance/ledger
 * Transform compliance assessment into debit-credit ledger view.
 * CFO-friendly: shows compliance costs as debits and offsets as credits.
 */
const LedgerSchema = AssessmentSchema.extend({
  freeAllocationEur: z.number().min(0).optional(),
  verifiedLowerCarbonEur: z.number().min(0).optional(),
  greenFinancingEur: z.number().min(0).optional(),
});

const CostEstimateSchema = z.object({
  annualEmissions: z.number().min(0).max(10_000_000).default(0),
  importQuantity: z.number().min(0).max(10_000_000).default(0),
  sector: z.string().min(1).max(64).regex(/^[a-z-]+$/).default('manufacturing'),
  originCountry: z.string().length(2).regex(/^[A-Z]{2}$/).default('CN'),
  freeAllocation: z.number().min(0).max(10_000_000).default(0),
});

router.post(
  '/ledger',
  validate({ body: LedgerSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;

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

      const creditOptions: LedgerCreditOptions = {
        freeAllocationEur: body.freeAllocationEur,
        verifiedLowerCarbonEur: body.verifiedLowerCarbonEur,
        greenFinancingEur: body.greenFinancingEur,
      };

      const ledger = result.costBreakdown
        ? costBreakdownToLedger(result.costBreakdown, creditOptions)
        : costBreakdownToLedger({
            etsCostEur: 0,
            cbamCostEur: 0,
            csrdReportingCostEur: 0,
            totalCostEur: 0,
            carbonPriceEur: 65,
          });

      logger.info('Compliance ledger generated', {
        company: body.companyName,
        debits: ledger.totalDebitsEur,
        credits: ledger.totalCreditsEur,
        net: ledger.netPositionEur,
      });

      res.status(200).json({
        company: body.companyName,
        industry: body.industry,
        overallScore: result.overallScore,
        ledger,
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/v1/compliance/cost-estimate
 * Estimate ETS + CBAM compliance costs for a given scenario.
 * Quick calculation without full assessment — useful for onboarding and sales.
 */
router.post('/cost-estimate', validate({ body: CostEstimateSchema }), (req: Request, res: Response, next: NextFunction) => {
  try {
    const { annualEmissions, importQuantity, sector, originCountry, freeAllocation } = req.body;

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

// ============ CONSTRUCTION COMPLIANCE (EN 15978) ============

const ConstructionProjectSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1),
  jurisdiction: z.enum(['NO', 'DK', 'FI', 'SE', 'EU']),
  buildingType: z.enum(['residential', 'commercial', 'industrial', 'mixed']),
  grossFloorArea: z.number().positive(),
  heatedArea: z.number().positive().optional(),
  materials: z.array(
    z.object({
      name: z.string(),
      category: z.enum([
        'concrete',
        'steel',
        'timber',
        'insulation',
        'aluminium',
        'glass',
        'brick',
        'other',
      ]),
      quantity: z.number().positive(),
      unit: z.enum(['tonnes', 'm3', 'm2']),
      emissionFactor: z.number().positive(),
      factorSource: z.enum(['epd', 'generic', 'co2data.fi', 'epd-norge', 'dansk-beton']),
      epdReference: z.string().optional(),
    }),
  ),
  transport: z
    .array(
      z.object({
        description: z.string(),
        distanceKm: z.number().positive(),
        mode: z.enum(['truck', 'rail', 'ship', 'electric-truck']),
        tonnage: z.number().positive(),
      }),
    )
    .default([]),
  siteEnergy: z
    .array(
      z.object({
        type: z.enum(['diesel', 'electricity', 'lpg', 'district-heat']),
        quantity: z.number().positive(),
        unit: z.enum(['litres', 'kWh', 'MWh']),
      }),
    )
    .default([]),
  annualOperationalEnergy: z.number().min(0).optional(),
  designLifetime: z.number().min(1).max(200).optional(),
  hasBimModel: z.boolean().optional(),
  erpSystem: z.enum(['visma', 'ifs-cloud', 'dynamics-365', 'other']).optional(),
});

/**
 * POST /api/v1/compliance/construction/assess
 * Run EN 15978 lifecycle assessment for a building project.
 * Returns lifecycle stage breakdown, EPBD compliance, cost exposure.
 */
router.post(
  '/construction/assess',
  validate({ body: ConstructionProjectSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = req.body as BuildingProject;

      logger.info('Construction compliance assessment requested', {
        projectId: project.projectId,
        jurisdiction: project.jurisdiction,
        grossFloorArea: project.grossFloorArea,
        materials: project.materials.length,
      });

      const result = calculateConstructionCompliance(project);

      // Add benchmark comparison
      const benchmark = benchmarkProject(result.totalEmbodiedCarbonPerM2, project.buildingType);

      logger.info('Construction compliance assessment completed', {
        projectId: project.projectId,
        embodiedCarbonPerM2: result.totalEmbodiedCarbonPerM2,
        epbdCompliant: result.epbd.epbdCompliant,
        dataQuality: result.dataQuality,
      });

      res.status(200).json({
        ...result,
        benchmark,
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/compliance/construction/jurisdiction/:code
 * Get jurisdiction-specific compliance context (national standards, grid factors, benchmarks).
 */
router.get('/construction/jurisdiction/:code', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase() as 'NO' | 'DK' | 'FI' | 'SE' | 'EU';
  const validCodes = ['NO', 'DK', 'FI', 'SE', 'EU'];

  if (!validCodes.includes(code)) {
    res.status(400).json({ error: `Invalid jurisdiction code. Valid: ${validCodes.join(', ')}` });
    return;
  }

  const context = getJurisdictionContext(code);
  res.json(context);
});

// ============ REGULATORY TIMELINE ============

/**
 * GET /api/v1/compliance/timeline
 * Get full regulatory timeline with urgency classification and deadlines.
 */
router.get('/timeline', (_req: Request, res: Response) => {
  const timeline = generateTimeline();
  const regulations = getTrackedRegulations();

  res.json({
    ...timeline,
    regulations,
  });
});

export default router;
