/**
 * Situation Room Routes
 *
 * Pipeline output reports for the dashboard Situation Room panel.
 * Table: situation_room_reports
 *
 * Data flow:
 *   MCP Hub pipeline result → POST /api/situation-room/reports
 *   Dashboard polling       → GET  /api/situation-room/reports
 */

import express, { Router, Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router: Router = express.Router();

// ---------------------------------------------------------------------------
// Supabase service client
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const validateRequest = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: e.type === 'field' ? (e as any).path : 'unknown',
        message: e.msg,
      })),
    });
    return false;
  }
  return true;
};

/**
 * Verify that the authenticated user belongs to the specified organization
 * @param userId - User ID from JWT token
 * @param orgId - Organization ID to verify membership
 * @returns true if user is a member, false otherwise
 */
const verifyUserOrgMembership = async (userId: string, orgId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('organization_members')
      .select('id')
      .eq('user_id', userId)
      .eq('organization_id', orgId)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      logger.warn('User not member of organization', { userId, orgId, error: error?.message });
      return false;
    }

    return true;
  } catch (err) {
    logger.error('Error verifying org membership', { userId, orgId, error: err });
    return false;
  }
};

// ============================================================================
// POST /api/situation-room/reports — Write a pipeline report
// ============================================================================
router.post(
  '/reports',
  authenticateToken,
  [
    body('org_id').isUUID(),
    body('project_id').isString().trim().isLength({ min: 1, max: 100 }),
    body('report_type').isString().isIn([
      'bim-carbon', 'safety', 'schedule', 'quality', 'compliance',
    ]),
    body('title').optional().isString().trim().isLength({ max: 300 }),
    body('payload').isObject(),
    body('total_kg_co2e').optional().isFloat({ min: 0 }),
    body('fit55_score').optional().isFloat({ min: 0, max: 100 }),
    body('compliance_rag').optional().isIn(['red', 'amber', 'green']),
    body('country').optional().isISO31661Alpha2(),
    body('pipeline_workflow_id').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    if (!validateRequest(req, res)) return;

    try {
      const {
        org_id, project_id, report_type, title, payload,
        total_kg_co2e, fit55_score, compliance_rag, country,
        pipeline_workflow_id,
      } = req.body;

      // SECURITY FIX: Verify user belongs to the organization
      if (!req.userId) {
        logger.warn('Missing user ID in authenticated request');
        res.status(401).json({ error: 'Unauthorized', message: 'User ID not found' });
        return;
      }

      const isMember = await verifyUserOrgMembership(req.userId, org_id);
      if (!isMember) {
        logger.warn('User not authorized to create reports for organization', { 
          userId: req.userId, 
          orgId: org_id 
        });
        res.status(403).json({ 
          error: 'Forbidden', 
          message: 'You are not authorized to create reports for this organization' 
        });
        return;
      }

      const { data, error } = await supabase
        .from('situation_room_reports')
        .insert({
          org_id,
          project_id,
          report_type,
          title: title || `${report_type} report`,
          payload,
          total_kg_co2e: total_kg_co2e || null,
          fit55_score: fit55_score || null,
          compliance_rag: compliance_rag || 'amber',
          country: country || 'FI',
          pipeline_workflow_id: pipeline_workflow_id || null,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        logger.error('Situation Room report insert failed', { error: error.message });
        res.status(500).json({ error: 'Failed to create report', detail: error.message });
        return;
      }

      logger.info('Situation Room report created', { id: data.id, report_type, project_id });
      res.status(201).json(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Situation Room report creation error', { error: msg });
      res.status(500).json({ error: msg });
    }
  },
);

// ============================================================================
// GET /api/situation-room/reports — List reports (dashboard polling)
// ============================================================================
router.get(
  '/reports',
  authenticateToken,
  [
    query('org_id').isUUID(),
    query('report_type').optional().isString(),
    query('project_id').optional().isString(),
    query('status').optional().isIn(['active', 'archived', 'error']),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req: Request, res: Response) => {
    if (!validateRequest(req, res)) return;

    try {
      // SECURITY FIX: Verify user belongs to the organization
      if (!req.userId) {
        logger.warn('Missing user ID in authenticated request');
        res.status(401).json({ error: 'Unauthorized', message: 'User ID not found' });
        return;
      }

      const orgId = req.query.org_id as string;
      const isMember = await verifyUserOrgMembership(req.userId, orgId);
      if (!isMember) {
        logger.warn('User not authorized to view reports for organization', { 
          userId: req.userId, 
          orgId 
        });
        res.status(403).json({ 
          error: 'Forbidden', 
          message: 'You are not authorized to view reports for this organization' 
        });
        return;
      }

      let qb = supabase
        .from('situation_room_reports')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (req.query.report_type) {
        qb = qb.eq('report_type', req.query.report_type as string);
      }
      if (req.query.project_id) {
        qb = qb.eq('project_id', req.query.project_id as string);
      }
      if (req.query.status) {
        qb = qb.eq('status', req.query.status as string);
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      qb = qb.limit(limit);

      const { data, error } = await qb;

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.json({ reports: data, count: data?.length ?? 0 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Situation Room reports list error', { error: msg });
      res.status(500).json({ error: msg });
    }
  },
);

// ============================================================================
// GET /api/situation-room/reports/:id — Single report detail
// ============================================================================
router.get(
  '/reports/:id',
  authenticateToken,
  [param('id').isUUID()],
  async (req: Request, res: Response) => {
    if (!validateRequest(req, res)) return;

    try {
      // First, fetch the report to get its org_id
      const { data, error } = await supabase
        .from('situation_room_reports')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error || !data) {
        res.status(404).json({ error: 'Report not found' });
        return;
      }

      // SECURITY FIX: Verify user belongs to the organization that owns this report
      if (!req.userId) {
        logger.warn('Missing user ID in authenticated request');
        res.status(401).json({ error: 'Unauthorized', message: 'User ID not found' });
        return;
      }

      const isMember = await verifyUserOrgMembership(req.userId, data.org_id);
      if (!isMember) {
        logger.warn('User not authorized to view report', { 
          userId: req.userId, 
          reportId: req.params.id,
          orgId: data.org_id
        });
        res.status(403).json({ 
          error: 'Forbidden', 
          message: 'You are not authorized to view this report' 
        });
        return;
      }

      res.json(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Situation Room report fetch error', { error: msg });
      res.status(500).json({ error: msg });
    }
  },
);

// ============================================================================
// PATCH /api/situation-room/reports/:id — Update status (archive, etc.)
// ============================================================================
router.patch(
  '/reports/:id',
  authenticateToken,
  [
    param('id').isUUID(),
    body('status').optional().isIn(['active', 'archived', 'error']),
    body('payload').optional().isObject(),
    body('compliance_rag').optional().isIn(['red', 'amber', 'green']),
  ],
  async (req: Request, res: Response) => {
    if (!validateRequest(req, res)) return;

    try {
      // SECURITY FIX: First fetch the report to verify user has access
      if (!req.userId) {
        logger.warn('Missing user ID in authenticated request');
        res.status(401).json({ error: 'Unauthorized', message: 'User ID not found' });
        return;
      }

      const { data: existingReport, error: fetchError } = await supabase
        .from('situation_room_reports')
        .select('org_id')
        .eq('id', req.params.id)
        .single();

      if (fetchError || !existingReport) {
        res.status(404).json({ error: 'Report not found' });
        return;
      }

      // Verify user belongs to the organization that owns this report
      const isMember = await verifyUserOrgMembership(req.userId, existingReport.org_id);
      if (!isMember) {
        logger.warn('User not authorized to update report', { 
          userId: req.userId, 
          reportId: req.params.id,
          orgId: existingReport.org_id
        });
        res.status(403).json({ 
          error: 'Forbidden', 
          message: 'You are not authorized to update this report' 
        });
        return;
      }

      const updates: Record<string, any> = {};
      for (const field of ['status', 'payload', 'compliance_rag']) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: 'No updateable fields provided' });
        return;
      }

      const { data, error } = await supabase
        .from('situation_room_reports')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error || !data) {
        res.status(404).json({ error: 'Report not found or update failed' });
        return;
      }

      logger.info('Situation Room report updated', { id: data.id });
      res.json(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Situation Room report update error', { error: msg });
      res.status(500).json({ error: msg });
    }
  },
);

export default router;
