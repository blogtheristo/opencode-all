/**
 * ERP Integration Tracking Routes
 * GTM Machine Phase 3a
 * POST /api/erp/track/* endpoints
 */

import { type Request, type Response, Router } from 'express';
import { erpTrackingService } from '../services/erp-tracking.service.js';
import logger from '../utils/logger.js';

const router = Router();

interface TrackingRequest {
  tenantId: string;
  erpSystem: string;
  adminEmail: string;
}

interface ConnectionTestRequest extends TrackingRequest {
  success: boolean;
  responseTimeMs?: number;
  authMethod?: string;
  errorCode?: string;
  errorMessage?: string;
}

interface FieldMappingRequest extends TrackingRequest {
  dataTypes: string[];
}

interface SyncActivationRequest extends TrackingRequest {
  schedule: 'realtime' | 'hourly' | 'daily' | 'weekly';
  dataTypes: string[];
}

interface ErrorRequest extends TrackingRequest {
  errorCode: string;
  errorMessage: string;
}

/**
 * POST /api/erp/track/connection-started
 * Log when admin selects an ERP to connect
 */
router.post('/connection-started', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenantId, erpSystem, adminEmail }: TrackingRequest = req.body;

    if (!tenantId || !erpSystem || !adminEmail) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    await erpTrackingService.logERPConnectionStarted(tenantId, erpSystem, adminEmail);

    res.json({ success: true, message: 'Connection start logged' });
    return;
  } catch (error) {
    logger.error('ERP tracking error:', error);
    res.status(500).json({ error: 'Failed to log ERP event' });
    return;
  }
});

/**
 * POST /api/erp/track/connection-test
 * Log connection test result (success or failure)
 */
router.post('/connection-test', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      tenantId,
      erpSystem,
      adminEmail,
      success,
      responseTimeMs,
      authMethod,
      errorCode,
      errorMessage,
    }: ConnectionTestRequest = req.body;

    if (!tenantId || !erpSystem || !adminEmail || success === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (success) {
      await erpTrackingService.logERPConnectionTestSuccess(
        tenantId,
        erpSystem,
        adminEmail,
        responseTimeMs || 0,
        authMethod || 'unknown',
      );
    } else {
      await erpTrackingService.logERPConnectionTestFailed(
        tenantId,
        erpSystem,
        adminEmail,
        errorCode || 'UNKNOWN_ERROR',
        errorMessage || 'Connection test failed',
        responseTimeMs || 0,
      );
    }

    res.json({ success: true, message: 'Connection test logged' });
    return;
  } catch (error) {
    logger.error('ERP tracking error:', error);
    res.status(500).json({ error: 'Failed to log ERP event' });
    return;
  }
});

/**
 * POST /api/erp/track/field-mapping
 * Log when field mapping is completed
 */
router.post('/field-mapping', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenantId, erpSystem, adminEmail, dataTypes }: FieldMappingRequest = req.body;

    if (!tenantId || !erpSystem || !adminEmail || !dataTypes || !Array.isArray(dataTypes)) {
      res.status(400).json({ error: 'Missing or invalid required fields' });
      return;
    }

    await erpTrackingService.logFieldMappingComplete(tenantId, erpSystem, adminEmail, dataTypes);

    res.json({ success: true, message: 'Field mapping logged' });
    return;
  } catch (error) {
    logger.error('ERP tracking error:', error);
    res.status(500).json({ error: 'Failed to log ERP event' });
    return;
  }
});

/**
 * POST /api/erp/track/sync-activated
 * Log when sync is activated with a schedule
 */
router.post('/sync-activated', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenantId, erpSystem, adminEmail, schedule, dataTypes }: SyncActivationRequest =
      req.body;

    if (
      !tenantId ||
      !erpSystem ||
      !adminEmail ||
      !schedule ||
      !dataTypes ||
      !Array.isArray(dataTypes)
    ) {
      res.status(400).json({ error: 'Missing or invalid required fields' });
      return;
    }

    const validSchedules = ['realtime', 'hourly', 'daily', 'weekly'];
    if (!validSchedules.includes(schedule)) {
      res.status(400).json({ error: 'Invalid schedule' });
      return;
    }

    await erpTrackingService.logSyncActivated(tenantId, erpSystem, adminEmail, schedule, dataTypes);

    res.json({ success: true, message: 'Sync activation logged' });
    return;
  } catch (error) {
    logger.error('ERP tracking error:', error);
    res.status(500).json({ error: 'Failed to log ERP event' });
    return;
  }
});

/**
 * POST /api/erp/track/error
 * Log ERP connection or sync errors
 */
router.post('/error', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenantId, erpSystem, adminEmail, errorCode, errorMessage }: ErrorRequest = req.body;

    if (!tenantId || !erpSystem || !adminEmail || !errorCode || !errorMessage) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    await erpTrackingService.logERPError(tenantId, erpSystem, adminEmail, errorCode, errorMessage);

    res.json({ success: true, message: 'Error logged' });
    return;
  } catch (error) {
    logger.error('ERP tracking error:', error);
    res.status(500).json({ error: 'Failed to log ERP event' });
    return;
  }
});

export default router;
