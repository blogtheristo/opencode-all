/**
 * DWS IQ 6 - ERP Integration Routes
 *
 * API endpoints for managing ERP integrations
 */

import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ERPIntegrationService } from './service.js';
import { approvalGate } from './approval-gate.js';
import { ERPProvider, EntityType } from './types.js';

const router = Router();
const erpService = new ERPIntegrationService();

// ============================================================================
// Validation Middleware
// ============================================================================

const validateRequest = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

// ============================================================================
// Connection Management
// ============================================================================

/**
 * POST /api/v1/erp/integrations/configure
 * Configure ERP integration for an organization
 */
router.post(
  '/integrations/configure',
  [
    body('organizationId').notEmpty(),
    body('provider').isIn(Object.values(ERPProvider)),
    body('config').isObject(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { organizationId, provider, config, syncSettings, fieldMappings } = req.body;

      const integration = await erpService.configureIntegration(
        organizationId,
        provider,
        config,
        syncSettings,
        fieldMappings,
      );

      res.json({
        success: true,
        data: integration,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * POST /api/v1/erp/integrations/:provider/test
 * Test ERP connection
 */
router.post(
  '/integrations/:provider/test',
  [param('provider').isIn(Object.values(ERPProvider))],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { provider } = req.params;
      const { organizationId } = req.body;

      const isConnected = await erpService.testConnection(organizationId, provider as ERPProvider);

      res.json({
        success: true,
        data: {
          provider,
          connected: isConnected,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * GET /api/v1/erp/integrations/:organizationId
 * Get all integrations for an organization
 */
router.get(
  '/integrations/:organizationId',
  [param('organizationId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.params;

      const integrations = await erpService.getIntegrations(organizationId);

      res.json({
        success: true,
        data: integrations,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// ============================================================================
// Synchronization
// ============================================================================

/**
 * POST /api/v1/erp/sync/production-orders
 * Sync production orders from ERP
 */
router.post(
  '/sync/production-orders',
  [
    body('organizationId').notEmpty(),
    body('provider').isIn(Object.values(ERPProvider)),
    body('since').optional().isISO8601(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { organizationId, provider, since, requestApproval } = req.body;
      const userId = (req as any).user?.id || 'system';

      // Request approval for sync if required
      if (requestApproval) {
        const approvalRequest = await approvalGate.requestApproval(
          organizationId,
          provider,
          EntityType.PRODUCTION_ORDER,
          'sync_batch',
          userId,
          {
            summary: `Sync production orders from ${provider}`,
            estimatedImpact: 'Will update production schedules in DWS IQ',
            affectedSystems: [provider, 'dws-iq-production'],
          },
        );

        return res.json({
          success: true,
          data: {
            approvalRequired: true,
            approvalRequestId: approvalRequest.id,
            status: approvalRequest.status,
          },
        });
      }

      const result = await erpService.syncProductionOrders(
        organizationId,
        provider,
        since ? new Date(since) : undefined,
      );

      return res.json({
        success: result.success,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * POST /api/v1/erp/sync/machine-data
 * Push machine data to ERP
 */
router.post(
  '/sync/machine-data',
  [
    body('organizationId').notEmpty(),
    body('provider').isIn(Object.values(ERPProvider)),
    body('data').isArray(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { organizationId, provider, data } = req.body;

      const result = await erpService.syncMachineData(organizationId, provider, data);

      res.json({
        success: result.success,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * POST /api/v1/erp/sync/oee-metrics
 * Push OEE metrics to ERP
 */
router.post(
  '/sync/oee-metrics',
  [
    body('organizationId').notEmpty(),
    body('provider').isIn(Object.values(ERPProvider)),
    body('metrics').isArray(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { organizationId, provider, metrics } = req.body;

      const result = await erpService.syncOEEMetrics(organizationId, provider, metrics);

      res.json({
        success: result.success,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * POST /api/v1/erp/sync/maintenance
 * Sync maintenance events
 */
router.post(
  '/sync/maintenance',
  [
    body('organizationId').notEmpty(),
    body('provider').isIn(Object.values(ERPProvider)),
    body('direction').isIn(['to_erp', 'from_erp']),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { organizationId, provider, direction } = req.body;

      const result = await erpService.syncMaintenanceEvents(organizationId, provider, direction);

      res.json({
        success: result.success,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// ============================================================================
// Approval Gates
// ============================================================================

/**
 * GET /api/v1/erp/approvals/pending/:organizationId
 * Get pending approval requests
 */
router.get(
  '/approvals/pending/:organizationId',
  [param('organizationId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.params;
      const pending = approvalGate.getPendingRequests(organizationId);

      res.json({
        success: true,
        data: pending,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * POST /api/v1/erp/approvals/:requestId/approve
 * Approve a pending request
 */
router.post(
  '/approvals/:requestId/approve',
  [param('requestId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { requestId } = req.params;
      const userId = (req as any).user?.id || 'unknown';

      const request = await approvalGate.approve(requestId, userId);

      res.json({
        success: true,
        data: request,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * POST /api/v1/erp/approvals/:requestId/reject
 * Reject a pending request
 */
router.post(
  '/approvals/:requestId/reject',
  [param('requestId').notEmpty(), body('reason').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { requestId } = req.params;
      const { reason } = req.body;
      const userId = (req as any).user?.id || 'unknown';

      const request = await approvalGate.reject(requestId, userId, reason);

      res.json({
        success: true,
        data: request,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * GET /api/v1/erp/approvals/:requestId
 * Get approval request details
 */
router.get(
  '/approvals/:requestId',
  [param('requestId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { requestId } = req.params;
      const request = approvalGate.getRequest(requestId);

      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Approval request not found',
        });
      }

      return res.json({
        success: true,
        data: request,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// ============================================================================
// Company → ERP Resolution
// ============================================================================

/**
 * GET /api/v1/erp/resolve/:companyName
 * Resolve a single company name to its ERP provider
 */
router.get(
  '/resolve/:companyName',
  [param('companyName').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { companyName } = req.params;
      const result = erpService.resolveCompanyERP(decodeURIComponent(companyName));

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * POST /api/v1/erp/resolve/batch
 * Batch-resolve multiple company names to ERP providers
 */
router.post(
  '/resolve/batch',
  [body('companies').isArray({ min: 1, max: 100 })],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { companies } = req.body;
      const results = erpService.resolveCompanyERPBatch(companies);

      res.json({
        success: true,
        data: {
          results,
          summary: {
            total: results.length,
            found: results.filter((r: any) => r.found).length,
            notFound: results.filter((r: any) => !r.found).length,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * GET /api/v1/erp/registry
 * List all registered companies in the ERP registry
 */
router.get('/registry', async (_req: Request, res: Response) => {
  try {
    const companies = erpService.getAllRegisteredCompanies();

    res.json({
      success: true,
      data: {
        companies,
        totalRegistered: companies.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/erp/registry/:provider
 * List companies by ERP provider
 */
router.get(
  '/registry/:provider',
  [param('provider').isIn(Object.values(ERPProvider))],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { provider } = req.params;
      const companies = erpService.getCompaniesByProvider(provider as ERPProvider);

      res.json({
        success: true,
        data: {
          provider,
          companies,
          count: companies.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// ============================================================================
// Sync History & Status
// ============================================================================

/**
 * GET /api/v1/erp/sync/history/:organizationId
 * Get sync operation history
 */
router.get(
  '/sync/history/:organizationId',
  [
    param('organizationId').notEmpty(),
    query('provider').optional().isIn(Object.values(ERPProvider)),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.params;
      const { provider, limit } = req.query;

      const history = await erpService.getSyncHistory(
        organizationId,
        provider as ERPProvider | undefined,
        limit ? parseInt(limit as string) : 50,
      );

      res.json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

/**
 * GET /api/v1/erp/webhooks/:provider
 * ERP webhook receiver (for systems that push data)
 */
router.post(
  '/webhooks/:provider',
  [param('provider').isIn(Object.values(ERPProvider))],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { provider } = req.params;
      const event = req.body;

      await erpService.handleWebhook(provider as ERPProvider, event);

      res.json({
        success: true,
        message: 'Webhook processed',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

export default router;
