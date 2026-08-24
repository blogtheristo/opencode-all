/**
 * Investor Reporting - API Routes
 * Monthly/Quarterly Reports, MRR/ARR Metrics, Runway Analysis
 */

import { type Request, type Response, Router } from 'express';
import { metricsService } from './metrics-calculation';
import { reportService } from './report-service';
import { type InvestorReportData } from './types';
import logger from '../utils/logger.js';

const router = Router();

// ============================================================================
// METRICS ENDPOINTS
// ============================================================================

/**
 * Get all investor metrics for a given month
 * GET /investor-reports/metrics
 * Query params: ?month=YYYY-MM-01
 */
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const monthParam = req.query.month as string;
    const targetMonth = monthParam ? new Date(monthParam) : undefined;

    const [
      mrrMetrics,
      arrMetrics,
      customerMetrics,
      pipelineMetrics,
      cashMetrics,
      unitEconomics,
      historicalMRR,
      historicalARR,
      historicalCustomers,
      historicalCash,
    ] = await Promise.all([
      metricsService.getMRRMetrics(targetMonth),
      metricsService.getARRMetrics(targetMonth),
      metricsService.getCustomerMetrics(targetMonth),
      metricsService.getPipelineMetrics(),
      metricsService.getCashMetrics(targetMonth),
      metricsService.getUnitEconomics(),
      metricsService.getHistoricalMRR(12),
      metricsService.getHistoricalARR(12),
      metricsService.getHistoricalCustomers(12),
      metricsService.getHistoricalCash(12),
    ]);

    const reportData: Partial<InvestorReportData> = {
      mrr_metrics: mrrMetrics,
      arr_metrics: arrMetrics,
      customer_metrics: customerMetrics,
      pipeline_metrics: pipelineMetrics,
      cash_metrics: cashMetrics,
      unit_economics: unitEconomics,
      historical_mrr: historicalMRR,
      historical_arr: historicalARR,
      historical_customers: historicalCustomers,
      historical_cash: historicalCash,
    };

    res.json({
      success: true,
      data: reportData,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching investor metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get MRR metrics only
 * GET /investor-reports/metrics/mrr
 * Query params: ?month=YYYY-MM-01
 */
router.get('/metrics/mrr', async (req: Request, res: Response) => {
  try {
    const monthParam = req.query.month as string;
    const targetMonth = monthParam ? new Date(monthParam) : undefined;

    const mrrMetrics = await metricsService.getMRRMetrics(targetMonth);

    res.json({
      success: true,
      data: mrrMetrics,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching MRR metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get ARR metrics only
 * GET /investor-reports/metrics/arr
 * Query params: ?month=YYYY-MM-01
 */
router.get('/metrics/arr', async (req: Request, res: Response) => {
  try {
    const monthParam = req.query.month as string;
    const targetMonth = monthParam ? new Date(monthParam) : undefined;

    const arrMetrics = await metricsService.getARRMetrics(targetMonth);

    res.json({
      success: true,
      data: arrMetrics,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching ARR metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get customer metrics (churn, retention, counts)
 * GET /investor-reports/metrics/customers
 * Query params: ?month=YYYY-MM-01
 */
router.get('/metrics/customers', async (req: Request, res: Response) => {
  try {
    const monthParam = req.query.month as string;
    const targetMonth = monthParam ? new Date(monthParam) : undefined;

    const customerMetrics = await metricsService.getCustomerMetrics(targetMonth);

    res.json({
      success: true,
      data: customerMetrics,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching customer metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get sales pipeline metrics (from Firehorse)
 * GET /investor-reports/metrics/pipeline
 */
router.get('/metrics/pipeline', async (_req: Request, res: Response) => {
  try {
    const pipelineMetrics = await metricsService.getPipelineMetrics();

    res.json({
      success: true,
      data: pipelineMetrics,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching pipeline metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get cash and runway metrics
 * GET /investor-reports/metrics/runway
 * Query params: ?month=YYYY-MM-01
 */
router.get('/metrics/runway', async (req: Request, res: Response) => {
  try {
    const monthParam = req.query.month as string;
    const targetMonth = monthParam ? new Date(monthParam) : undefined;

    const cashMetrics = await metricsService.getCashMetrics(targetMonth);

    res.json({
      success: true,
      data: cashMetrics,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching runway metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get unit economics (CAC, LTV, ARPU)
 * GET /investor-reports/metrics/unit-economics
 */
router.get('/metrics/unit-economics', async (_req: Request, res: Response) => {
  try {
    const unitEconomics = await metricsService.getUnitEconomics();

    res.json({
      success: true,
      data: unitEconomics,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching unit economics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// HISTORICAL DATA ENDPOINTS
// ============================================================================

/**
 * Get historical MRR (last N months)
 * GET /investor-reports/historical/mrr
 * Query params: ?months=12
 */
router.get('/historical/mrr', async (req: Request, res: Response) => {
  try {
    const months = parseInt(req.query.months as string) || 12;
    const historicalMRR = await metricsService.getHistoricalMRR(months);

    res.json({
      success: true,
      data: historicalMRR,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching historical MRR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get historical ARR (last N months)
 * GET /investor-reports/historical/arr
 * Query params: ?months=12
 */
router.get('/historical/arr', async (req: Request, res: Response) => {
  try {
    const months = parseInt(req.query.months as string) || 12;
    const historicalARR = await metricsService.getHistoricalARR(months);

    res.json({
      success: true,
      data: historicalARR,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching historical ARR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get monthly metrics summary (last 12 months)
 * GET /investor-reports/summary
 */
router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const summary = await metricsService.getMonthlyMetricsSummary(12);

    res.json({
      success: true,
      data: summary,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching monthly summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get current MRR breakdown by customer
 * GET /investor-reports/mrr-by-customer
 */
router.get('/mrr-by-customer', async (_req: Request, res: Response) => {
  try {
    const mrrByCustomer = await metricsService.getCurrentMRRByCustomer();

    res.json({
      success: true,
      data: mrrByCustomer,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Error fetching MRR by customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// REPORT GENERATION ENDPOINTS
// ============================================================================

/**
 * Generate monthly investor report
 * POST /investor-reports/generate
 * Body: { month: "YYYY-MM-01", auto_send: true, recipients: ["email@example.com"] }
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { month, auto_send, recipients } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Missing required field: month' });
    }

    const reportMonth = new Date(month);
    const reportData = await reportService.generateMonthlyReport(reportMonth);

    // Generate PDF
    const pdfPath = await reportService.generatePDF(reportData);

    // Send email if requested
    if (auto_send && recipients && recipients.length > 0) {
      await reportService.sendReportEmail(reportData, pdfPath, recipients);
    }

    return res.json({
      success: true,
      report_id: reportData.report_period.toISOString(),
      pdf_path: pdfPath,
      message: auto_send ? 'Report generated and sent' : 'Report generated',
    });
  } catch (error) {
    logger.error('Error generating report:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Manually trigger monthly report generation (for current month)
 * POST /investor-reports/jobs/monthly
 */
router.post('/jobs/monthly', async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const reportData = await reportService.generateMonthlyReport(currentMonth);
    const pdfPath = await reportService.generatePDF(reportData);

    // Get default recipients from env or config
    const defaultRecipients = process.env.INVESTOR_REPORT_RECIPIENTS?.split(',') || [];

    if (defaultRecipients.length > 0) {
      await reportService.sendReportEmail(reportData, pdfPath, defaultRecipients);
    }

    res.json({
      success: true,
      message: 'Monthly report generated and sent',
      pdf_path: pdfPath,
      recipients: defaultRecipients,
    });
  } catch (error) {
    logger.error('Error running monthly report job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Health check endpoint
 * GET /investor-reports/health
 */
router.get('/health', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date(),
  });
});

export default router;
