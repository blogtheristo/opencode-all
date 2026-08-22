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

import express, { type Request, type Response, type Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { ACER_GN100_BUDGET, AGENT_TIER_MAP, estimateLocalModelDiskUsage, getModelSelectionSummary } from '../agents/model-selector.js';

const router: Router = express.Router();

// ---------------------------------------------------------------------------
// Supabase service client
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY
  || process.env.SUPABASE_SERVICE_ROLE_KEY
  || '';
const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseKey) : null;

// ---------------------------------------------------------------------------
// Authorization helper
// ---------------------------------------------------------------------------

/**
 * Verify that the authenticated user is an active member of the given org.
 * Returns true if authorized; writes a 403 response and returns false otherwise.
 */
async function assertOrgMember(userId: string, orgId: string, res: Response): Promise<boolean> {
  if (!supabase) {
    res.status(503).json({ error: 'Database not configured' });
    return false;
  }
  const { data, error } = await supabase
    .from('organization_members')
    .select('user_id')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    logger.error('Org membership check failed', { error: error.message, userId, orgId });
    res.status(500).json({ error: 'Failed to verify organization membership' });
    return false;
  }

  if (!data) {
    logger.warn('Unauthorized org access attempt', { userId, orgId });
    res.status(403).json({ error: 'Forbidden', message: 'Not a member of this organization' });
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Guard: reject all requests when Supabase is not configured
// ---------------------------------------------------------------------------
router.use((_req: Request, res: Response, next) => {
  if (!supabase) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  next();
});

/**
 * Non-null accessor for the Supabase client. Safe because the router-level
 * guard above rejects every request when Supabase is not configured.
 */
function db() {
  if (!supabase) throw new Error('Database not configured');
  return supabase;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const validateRequest = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: e.type === 'field' ? e.path : 'unknown',
        message: e.msg,
      })),
    });
    return false;
  }
  return true;
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
    body('report_type')
      .isString()
      .isIn(['bim-carbon', 'safety', 'schedule', 'quality', 'compliance']),
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
        org_id,
        project_id,
        report_type,
        title,
        payload,
        total_kg_co2e,
        fit55_score,
        compliance_rag,
        country,
        pipeline_workflow_id,
      } = req.body;

      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!(await assertOrgMember(userId, org_id, res))) return;

      const { data, error } = await db()
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
      const orgId = req.query.org_id as string;

      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!(await assertOrgMember(userId, orgId, res))) return;

      let qb = db()
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
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { data, error } = await db()
        .from('situation_room_reports')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error || !data) {
        res.status(404).json({ error: 'Report not found' });
        return;
      }

      if (!(await assertOrgMember(userId, data.org_id, res))) return;

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
      const updates: Record<string, unknown> = {};
      for (const field of ['status', 'payload', 'compliance_rag']) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: 'No updateable fields provided' });
        return;
      }

      // Fetch first to get org_id for membership check
      const { data: existing } = await db()
        .from('situation_room_reports')
        .select('org_id')
        .eq('id', req.params.id)
        .single();

      if (!existing) {
        res.status(404).json({ error: 'Report not found' });
        return;
      }

      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!(await assertOrgMember(userId, existing.org_id, res))) return;

      const { data, error } = await db()
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

// ============================================================================
// GET /api/situation-room/model-usage — Model selection summary for board view
// ============================================================================
router.get(
  '/model-usage',
  authenticateToken,
  async (_req: Request, res: Response) => {
    try {
      const summary = getModelSelectionSummary();

      res.json({
        ...summary,
        acerBudget: ACER_GN100_BUDGET,
        agentTierMap: AGENT_TIER_MAP,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Model usage summary error', { error: msg });
      res.status(500).json({ error: msg });
    }
  },
);

// ============================================================================
// POST /api/situation-room/model-usage/estimate — Estimate disk/RAM for agent set
// ============================================================================
router.post(
  '/model-usage/estimate',
  authenticateToken,
  [body('agents').isArray({ min: 1, max: 50 })],
  async (req: Request, res: Response) => {
    if (!validateRequest(req, res)) return;

    try {
      const agents: string[] = req.body.agents;
      const estimate = estimateLocalModelDiskUsage(agents);

      res.json({
        ...estimate,
        acerBudget: ACER_GN100_BUDGET,
        diskUtilizationPct: Math.round(
          (estimate.totalDiskGb / ACER_GN100_BUDGET.availableModelDiskGb) * 10000,
        ) / 100,
        ramUtilizationPct: Math.round(
          (estimate.totalRamGb / ACER_GN100_BUDGET.availableModelRamGb) * 10000,
        ) / 100,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Model usage estimate error', { error: msg });
      res.status(500).json({ error: msg });
    }
  },
);

export default router;
