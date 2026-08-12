/**
 * Admin Role Tracking Routes
 * GTM Machine Phase 3b — Step 14 (Admin Role Designation)
 * POST /api/roles/track/* endpoints
 *
 * Logs CFO/Tenant Admin separation-of-duties events for KYA audit trail.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (GTM Machine Phase 3b — routes layer)
 * Branch: claude/charming-brown-6cd96f
 * Date: 2026-04-28
 * Owner: Lifetime Oy
 */

import { Router, Request, Response } from 'express';
import { roleTrackingService } from '../services/role-tracking.service.js';

const router = Router();

interface TenantBaseRequest {
  tenantId: string;
  billingOwnerEmail: string;
}

interface DesignationRequest extends TenantBaseRequest {
  tenantAdminEmail: string;
  daysSinceInvoiceFinalized: number;
}

interface AutoPromotionRequest extends TenantBaseRequest {
  technicalContactEmail: string;
  daysSinceInvoiceFinalized: number;
}

interface ConfirmationRequest extends TenantBaseRequest {
  tenantAdminEmail: string;
}

interface SODWaiverRequest extends TenantBaseRequest {
  reasonForWaiver: string;
  daysSinceInvoiceFinalized: number;
}

const requireString = (val: unknown): val is string =>
  typeof val === 'string' && val.trim().length > 0;

const requireNumber = (val: unknown): val is number => typeof val === 'number' && !isNaN(val);

/**
 * POST /api/roles/track/designation
 * Path A: CFO designates a Tenant Admin (separation of duties enforced)
 */
router.post('/designation', async (req: Request, res: Response) => {
  try {
    const { tenantId, billingOwnerEmail, tenantAdminEmail, daysSinceInvoiceFinalized } =
      req.body as DesignationRequest;

    if (
      !requireString(tenantId) ||
      !requireString(billingOwnerEmail) ||
      !requireString(tenantAdminEmail) ||
      !requireNumber(daysSinceInvoiceFinalized)
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    await roleTrackingService.logAdminDesignation(
      tenantId,
      billingOwnerEmail,
      tenantAdminEmail,
      daysSinceInvoiceFinalized,
    );

    return res.json({ success: true, path: 'PATH_A_CFO_DESIGNATED' });
  } catch (error) {
    console.error('Role tracking error:', error);
    return res.status(500).json({ error: 'Failed to log designation event' });
  }
});

/**
 * POST /api/roles/track/auto-promotion
 * Path B: System auto-promotes technical contact after grace window expires
 */
router.post('/auto-promotion', async (req: Request, res: Response) => {
  try {
    const { tenantId, billingOwnerEmail, technicalContactEmail, daysSinceInvoiceFinalized } =
      req.body as AutoPromotionRequest;

    if (
      !requireString(tenantId) ||
      !requireString(billingOwnerEmail) ||
      !requireString(technicalContactEmail) ||
      !requireNumber(daysSinceInvoiceFinalized)
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    await roleTrackingService.logAdminAutoPromotion(
      tenantId,
      billingOwnerEmail,
      technicalContactEmail,
      daysSinceInvoiceFinalized,
    );

    return res.json({ success: true, path: 'PATH_B_AUTO_PROMOTED' });
  } catch (error) {
    console.error('Role tracking error:', error);
    return res.status(500).json({ error: 'Failed to log auto-promotion event' });
  }
});

/**
 * POST /api/roles/track/confirmation
 * Tenant Admin completes first login + MFA enrolment (Path A only)
 */
router.post('/confirmation', async (req: Request, res: Response) => {
  try {
    const { tenantId, billingOwnerEmail, tenantAdminEmail } = req.body as ConfirmationRequest;

    if (
      !requireString(tenantId) ||
      !requireString(billingOwnerEmail) ||
      !requireString(tenantAdminEmail)
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    await roleTrackingService.logAdminConfirmation(tenantId, billingOwnerEmail, tenantAdminEmail);

    return res.json({ success: true, event: 'admin_confirmation' });
  } catch (error) {
    console.error('Role tracking error:', error);
    return res.status(500).json({ error: 'Failed to log confirmation event' });
  }
});

/**
 * POST /api/roles/track/sod-waiver
 * SoD exception when CFO holds both Billing Owner and Tenant Admin roles
 */
router.post('/sod-waiver', async (req: Request, res: Response) => {
  try {
    const { tenantId, billingOwnerEmail, reasonForWaiver, daysSinceInvoiceFinalized } =
      req.body as SODWaiverRequest;

    if (
      !requireString(tenantId) ||
      !requireString(billingOwnerEmail) ||
      !requireString(reasonForWaiver) ||
      !requireNumber(daysSinceInvoiceFinalized)
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    await roleTrackingService.logSODWaiverException(
      tenantId,
      billingOwnerEmail,
      reasonForWaiver,
      daysSinceInvoiceFinalized,
    );

    return res.json({ success: true, event: 'sod_waiver_exception' });
  } catch (error) {
    console.error('Role tracking error:', error);
    return res.status(500).json({ error: 'Failed to log SoD waiver event' });
  }
});

export default router;
