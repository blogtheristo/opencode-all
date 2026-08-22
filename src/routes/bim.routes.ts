/**
 * BIM Pipeline Routes
 *
 * Endpoints for the BIM → EN 15978 → Carbon compliance pipeline.
 * Tables: bim_projects, carbon_calculations, emission_factors
 *
 * Data flow:
 *   MCP Hub /pipelines/bim-carbon → POST /api/bim/projects
 *   → POST /api/bim/carbon/:projectId → carbon_calculations
 *   → GET  /api/bim/projects/:id      → dashboard polling
 */

import express, { type Request, type Response, type Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { getSupabaseClient } from '../config/supabase.js';
import logger from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router: Router = express.Router();

// ---------------------------------------------------------------------------
// Supabase service client (uses service_role key — bypasses RLS)
//
// Truly lazy accessor: called per-request so tests and late env configuration
// work correctly. getSupabaseClient() internally caches the SupabaseClient
// instance once env vars are present (no performance penalty from repeated
// calls) and returns null otherwise (graceful degradation).
// ---------------------------------------------------------------------------
function sb() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY)');
  }
  return client;
}

// ---------------------------------------------------------------------------
// Authorization helper
// ---------------------------------------------------------------------------

async function assertOrgMember(userId: string, orgId: string, res: Response): Promise<boolean> {
  const { data, error } = await sb()
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

const EN15978_STAGES = [
  'a1_raw_materials',
  'a2_transport',
  'a3_manufacturing',
  'a4_transport_to_site',
  'a5_construction',
  'b1_use',
  'b2_maintenance',
  'b3_repair',
  'b4_replacement',
  'b5_refurbishment',
  'b6_operational_energy',
  'b7_operational_water',
  'c1_deconstruction',
  'c2_transport_eol',
  'c3_waste_processing',
  'c4_disposal',
  'd_reuse_recovery',
] as const;

// ============================================================================
// POST /api/bim/projects — Register a BIM project (IFC upload metadata)
// ============================================================================
router.post(
  '/projects',
  authenticateToken,
  [
    body('project_name').isString().trim().isLength({ min: 1, max: 200 }),
    body('bim_file_url').isURL(),
    body('country').optional().isISO31661Alpha2(),
    body('org_id').isUUID(),
    body('project_code').optional().isString().trim(),
    body('location').optional().isString().trim(),
    body('gross_floor_area_m2').optional().isFloat({ min: 0 }),
    body('building_type')
      .optional()
      .isIn(['residential', 'commercial', 'industrial', 'infrastructure']),
    body('file_format').optional().isIn(['ifc', 'ifczip', 'bcf', 'json', 'xml']),
  ],
  async (req: Request, res: Response) => {
    if (!validateRequest(req, res)) return;

    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const {
        org_id,
        project_name,
        project_code,
        bim_file_url,
        country,
        location,
        gross_floor_area_m2,
        building_type,
        file_format,
      } = req.body;

      if (!(await assertOrgMember(userId, org_id, res))) return;

      const { data, error } = await sb()
        .from('bim_projects')
        .insert({
          org_id,
          project_name,
          project_code: project_code || null,
          bim_file_url,
          country: country || 'FI',
          location: location || null,
          gross_floor_area_m2: gross_floor_area_m2 || null,
          building_type: building_type || null,
          file_format: file_format || 'ifc',
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        logger.error('BIM project insert failed', { error: error.message });
        res.status(500).json({
          error: 'An internal error occurred while creating the BIM project',
          errorId: 'BIM_CREATE_ERROR',
        });
        return;
      }

      logger.info('BIM project created', { id: data.id, project_name });
      res.status(201).json(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('BIM project creation error', { error: msg });
      res.status(500).json({ error: 'An internal error occurred while creating the BIM project', errorId: 'BIM_CREATE_ERROR' });
    }
  },
);

// ============================================================================
// GET /api/bim/projects — List projects for an org
// ============================================================================
router.get('/projects', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const orgId = req.query.org_id as string;
    if (!orgId) {
      res.status(400).json({ error: 'org_id query parameter required' });
      return;
    }

    if (!(await assertOrgMember(userId, orgId, res))) return;

    const { data, error } = await sb()
      .from('bim_projects')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ projects: data, count: data?.length ?? 0 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('BIM projects list error', { error: msg });
    res.status(500).json({ error: 'An internal error occurred while listing BIM projects', errorId: 'BIM_LIST_ERROR' });
  }
});

// ============================================================================
// GET /api/bim/projects/:id — Single project with carbon calculation
// ============================================================================
router.get(
  '/projects/:id',
  authenticateToken,
  [param('id').isUUID()],
  async (req: Request, res: Response) => {
    if (!validateRequest(req, res)) return;

    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { data: project, error: projErr } = await sb()
        .from('bim_projects')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (projErr || !project) {
        res.status(404).json({ error: 'BIM project not found' });
        return;
      }

      if (!(await assertOrgMember(userId, project.org_id, res))) return;

      // Fetch associated carbon calculation (latest)
      const { data: carbon } = await sb()
        .from('carbon_calculations')
        .select('*')
        .eq('bim_project_id', project.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      res.json({ project, carbon: carbon || null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('BIM project fetch error', { error: msg });
      res.status(500).json({ error: 'An internal error occurred while fetching the BIM project', errorId: 'BIM_FETCH_ERROR' });
    }
  },
);

// ============================================================================
// POST /api/bim/carbon/:projectId — Run EN 15978 carbon calculation
// ============================================================================
router.post(
  '/carbon/:projectId',
  authenticateToken,
  [
    param('projectId').isUUID(),
    // EN 15978 stages — all optional, default 0 in DB
    ...EN15978_STAGES.map((stage) => body(stage).optional().isFloat({ min: -999999999 })),
    body('kg_co2e_per_m2').optional().isFloat({ min: 0 }),
    body('csrd_status').optional().isIn(['compliant', 'non-compliant', 'pending']),
    body('ets_status').optional().isIn(['compliant', 'non-compliant', 'pending']),
    body('cbam_status').optional().isIn(['compliant', 'non-compliant', 'pending']),
    body('fit55_score').optional().isFloat({ min: 0, max: 100 }),
    body('materials_breakdown').optional().isArray(),
    body('calculation_method').optional().isIn(['en15978', 'en15804', 'custom']),
  ],
  async (req: Request, res: Response) => {
    if (!validateRequest(req, res)) return;

    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { projectId } = req.params;

      // Verify project exists and user belongs to its org
      const { data: project, error: projErr } = await sb()
        .from('bim_projects')
        .select('id, org_id, gross_floor_area_m2')
        .eq('id', projectId)
        .single();

      if (projErr || !project) {
        res.status(404).json({ error: 'BIM project not found' });
        return;
      }

      if (!(await assertOrgMember(userId, project.org_id, res))) return;

      // Build calculation row from EN 15978 stage values
      const calcRow: Record<string, unknown> = {
        bim_project_id: projectId,
      };
      for (const stage of EN15978_STAGES) {
        if (req.body[stage] !== undefined) {
          calcRow[stage] = req.body[stage];
        }
      }

      // Optional fields
      for (const field of [
        'kg_co2e_per_m2',
        'csrd_status',
        'ets_status',
        'cbam_status',
        'fit55_score',
        'materials_breakdown',
        'calculation_method',
      ]) {
        if (req.body[field] !== undefined) {
          calcRow[field] = req.body[field];
        }
      }

      const { data, error } = await sb()
        .from('carbon_calculations')
        .insert(calcRow)
        .select()
        .single();

      if (error) {
        logger.error('Carbon calculation insert failed', { error: error.message });
        res.status(500).json({
          error: 'An internal error occurred while saving the carbon calculation',
          errorId: 'CARBON_CALC_ERROR',
        });
        return;
      }

      // Update project status to 'extracted'
      await sb().from('bim_projects').update({ status: 'extracted' }).eq('id', projectId);

      logger.info('Carbon calculation saved', { id: data.id, projectId });
      res.status(201).json(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Carbon calculation error', { error: msg });
      res.status(500).json({ error: 'An internal error occurred while saving the carbon calculation', errorId: 'CARBON_CALC_ERROR' });
    }
  },
);

// ============================================================================
// GET /api/bim/emission-factors — Lookup emission factors (public read)
// ============================================================================
router.get('/emission-factors', async (req: Request, res: Response) => {
  try {
    const country = (req.query.country as string) || 'FI';

    const { data, error } = await sb()
      .from('emission_factors')
      .select('*')
      .eq('country', country.toUpperCase())
      .order('material');

    if (error) {
      logger.error('Emission factors query failed', { error: error.message, country });
      res.status(500).json({
        error: 'An internal error occurred while fetching emission factors',
        errorId: 'EMISSION_FACTORS_ERROR',
      });
      return;
    }

    res.json({ factors: data, count: data?.length ?? 0, country });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Emission factors fetch error', { error: msg });
    res.status(500).json({ error: 'An internal error occurred while fetching emission factors', errorId: 'EMISSION_FACTORS_ERROR' });
  }
});

export default router;
