/**
 * Agents Routes
 *
 * GET  /api/v1/agents/review-queue            — Pending HIL review items
 * POST /api/v1/agents/review-queue/:id/approve
 * POST /api/v1/agents/review-queue/:id/reject
 * GET  /api/v1/agents/confidence-timeline     — Latest drift report
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (claude/agent-monitoring-evals-qatA6)
 * Date: 2026-05-08
 * Owner: Lifetime Oy
 */

import fs from 'node:fs';
import path from 'node:path';
import { type Request, type Response, Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getSupabaseClient } from '../config/supabase.js';
import logger from '../utils/logger.js';

const router = Router();
router.use(authenticateToken);

const supabase = getSupabaseClient();
const DRIFT_REPORT_DIR = path.join(process.cwd(), 'logs', 'drift-reports');

// ─── Review queue ─────────────────────────────────────────────────────────────

/**
 * GET /api/v1/agents/review-queue
 * Returns pending (or all) items from the review_queue table.
 * Query params:
 *   status  — 'pending' (default) | 'all'
 *   limit   — max rows (default 50, max 200)
 *   agent   — filter by agent_name
 */
router.get('/review-queue', async (req: Request, res: Response): Promise<void> => {
  const status = req.query['status'] === 'all' ? undefined : 'pending';
  const limit = Math.min(parseInt(String(req.query['limit'] ?? '50'), 10), 200);
  const agentFilter = req.query['agent'] as string | undefined;

  if (!supabase) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }

  try {
    let query = supabase
      .from('review_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status', status);
    if (agentFilter) query = query.eq('agent_name', agentFilter);

    const { data, error, count } = await query;

    if (error) {
      logger.error('review-queue fetch failed', { error: error.message });
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ items: data ?? [], total: count ?? data?.length ?? 0 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('review-queue unexpected error', { error: msg });
    res.status(500).json({ error: msg });
  }
});

/**
 * POST /api/v1/agents/review-queue/:id/approve
 * POST /api/v1/agents/review-queue/:id/reject
 */
async function handleReviewAction(
  req: Request,
  res: Response,
  action: 'approved' | 'rejected',
): Promise<void> {
  const { id } = req.params;
  const reviewNote = (req.body as { note?: string })?.note ?? null;

  // Basic UUID validation — prevent path traversal
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    res.status(400).json({ error: 'Invalid id format' });
    return;
  }

  if (!supabase) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }

  try {
    const { error } = await supabase
      .from('review_queue')
      .update({
        status: action,
        reviewed_at: new Date().toISOString(),
        // Use the authenticated user's sub if available, otherwise unknown
        reviewed_by: (req as Request & { user?: { sub?: string } }).user?.sub ?? 'unknown',
        review_note: reviewNote,
      })
      .eq('id', id)
      .eq('status', 'pending'); // Only allow transitioning from pending

    if (error) {
      logger.error('review-queue action failed', { id, action, error: error.message });
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ ok: true, id, status: action });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
}

router.post('/review-queue/:id/approve', (req, res) => handleReviewAction(req, res, 'approved'));
router.post('/review-queue/:id/reject', (req, res) => handleReviewAction(req, res, 'rejected'));

// ─── Confidence timeline ──────────────────────────────────────────────────────

/**
 * GET /api/v1/agents/confidence-timeline
 * Returns the latest drift report JSON from logs/drift-reports/.
 * Falls back to an empty report if no file exists yet.
 */
router.get('/confidence-timeline', (_req: Request, res: Response): void => {
  try {
    if (!fs.existsSync(DRIFT_REPORT_DIR)) {
      res.json(emptyDriftReport());
      return;
    }

    const files = fs
      .readdirSync(DRIFT_REPORT_DIR)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .sort()
      .reverse();

    if (files.length === 0) {
      res.json(emptyDriftReport());
      return;
    }

    const latest = path.join(DRIFT_REPORT_DIR, files[0]);
    const raw = fs.readFileSync(latest, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.send(raw);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('confidence-timeline read failed', { error: msg });
    res.status(500).json({ error: msg });
  }
});

function emptyDriftReport() {
  return {
    generatedAt: new Date().toISOString(),
    windowDays: 7,
    baselineDays: 14,
    warnThreshold: 0.1,
    alertThreshold: 0.2,
    agents: [],
    summary: { total: 0, ok: 0, warn: 0, alert: 0 },
  };
}

export default router;
