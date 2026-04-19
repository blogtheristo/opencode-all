/**
 * Peachscore Accelerator — Cap Table & Financials API Routes
 *
 * GET  /api/investor-reports/cap-table          Full cap table with ownership %
 * GET  /api/investor-reports/cap-table/summary  Aggregated cap table summary
 * GET  /api/investor-reports/cap-table/financials  Financials snapshot for Peachscore
 * POST /api/investor-reports/cap-table/shareholders  Add a shareholder
 * POST /api/investor-reports/cap-table/rounds    Record an investment round
 */

import { type Request, type Response, Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { capTableService } from './cap-table-service.js';
import { RoundType, ShareClass, ShareholderType } from './cap-table-types.js';

const router = Router();

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

function handleValidationErrors(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return true;
  }
  return false;
}

// ============================================================================
// GET  /cap-table
// ============================================================================

/**
 * Full cap table: all shareholders with computed ownership percentages.
 * Optional ?valuation=<number> to override the current company valuation (EUR).
 */
router.get(
  '/',
  query('valuation').optional().isFloat({ min: 0 }),
  async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const valuation = req.query.valuation
        ? parseFloat(req.query.valuation as string)
        : undefined;

      const summary = await capTableService.getCapTableSummary(valuation);

      res.json({
        success: true,
        data: summary,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ success: false, error: message });
    }
  },
);

// ============================================================================
// GET  /cap-table/summary
// ============================================================================

/**
 * Aggregated cap table summary (totals, latest round, current valuation).
 * Lighter response than full cap table.
 */
router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const summary = await capTableService.getCapTableSummary();

    const { shareholders, rounds, ...aggregates } = summary;

    res.json({
      success: true,
      data: {
        ...aggregates,
        shareholder_count: shareholders.length,
        round_count: rounds.length,
        founder_count: shareholders.filter((s) => s.type === ShareholderType.Founder).length,
        investor_count: shareholders.filter((s) => s.type === ShareholderType.Investor).length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ success: false, error: message });
  }
});

// ============================================================================
// GET  /cap-table/financials
// ============================================================================

/**
 * Financials snapshot combining cap table with investor reporting metrics.
 * Used by the Peachscore accelerator dashboard.
 */
router.get('/financials', async (_req: Request, res: Response) => {
  try {
    const snapshot = await capTableService.getFinancialsSnapshot();

    res.json({
      success: true,
      data: snapshot,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ success: false, error: message });
  }
});

// ============================================================================
// POST  /cap-table/shareholders
// ============================================================================

const shareholderValidation = [
  body('name').notEmpty().isString(),
  body('type').isIn(Object.values(ShareholderType)),
  body('email').optional().isEmail(),
  body('shares').isInt({ min: 0 }),
  body('share_class').isIn(Object.values(ShareClass)),
  body('investment_eur').isFloat({ min: 0 }),
  body('grant_date').isISO8601(),
  body('round_id').optional().isUUID(),
  body('vesting_months').optional().isInt({ min: 0 }),
  body('vesting_cliff_months').optional().isInt({ min: 0 }),
  body('notes').optional().isString(),
];

/**
 * Add a new shareholder (founder, investor, employee, advisor, or option pool).
 */
router.post('/shareholders', shareholderValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const shareholder = await capTableService.addShareholder(req.body);

    res.status(201).json({
      success: true,
      data: shareholder,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ success: false, error: message });
  }
});

// ============================================================================
// POST  /cap-table/rounds
// ============================================================================

const roundValidation = [
  body('round_type').isIn(Object.values(RoundType)),
  body('name').notEmpty().isString(),
  body('close_date').isISO8601(),
  body('pre_money_valuation_eur').isFloat({ min: 0 }),
  body('raised_eur').isFloat({ min: 0 }),
  body('shares_issued').isInt({ min: 0 }),
  body('notes').optional().isString(),
];

/**
 * Record a new investment round (seed, series A/B/C, SAFE note, etc.).
 */
router.post('/rounds', roundValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const round = await capTableService.addInvestmentRound(req.body);

    res.status(201).json({
      success: true,
      data: round,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
