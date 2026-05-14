/**
 * Memory Dashboard API Routes
 *
 * Provides memory stats, audit trail, and decay metrics
 * for the Firehorse v10 Memory Dashboard.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (memory-decay-audit-final)
 * Date: 2026-03-23
 * Owner: Lifetime Oy
 */

import { type Request, type Response, Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * GET /api/v1/memory/stats
 * Returns memory inventory, confidence distribution, type breakdown.
 * No auth required (read-only aggregate stats, no PII).
 */
router.get('/stats', async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase not configured' });
    return;
  }

  try {
    const { data: memories, error } = await supabase
      .from('semantic_memories')
      .select('id, memory_type, confidence, access_count, created_at, accessed_at, expired_at');

    if (error) throw error;

    const all = memories || [];
    const active = all.filter(m => !m.expired_at);
    const expired = all.filter(m => m.expired_at);

    // Type distribution
    const typeCounts: Record<string, number> = {};
    for (const m of active) {
      typeCounts[m.memory_type] = (typeCounts[m.memory_type] || 0) + 1;
    }

    // Confidence buckets
    const buckets = [0, 0, 0, 0, 0]; // 0-0.2, 0.2-0.4, 0.4-0.6, 0.6-0.8, 0.8-1.0
    for (const m of active) {
      const idx = Math.min(Math.floor(m.confidence * 5), 4);
      buckets[idx]++;
    }

    const avgConfidence = active.length > 0
      ? active.reduce((s, m) => s + m.confidence, 0) / active.length
      : 0;

    res.json({
      total: all.length,
      active: active.length,
      expired: expired.length,
      avgConfidence: Number(avgConfidence.toFixed(3)),
      lowConfidence: active.filter(m => m.confidence < 0.3).length,
      typeDistribution: Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      confidenceBuckets: buckets,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Memory stats fetch failed', { error: msg });
    res.status(500).json({ error: 'Failed to fetch memory stats' });
  }
});

/**
 * GET /api/v1/memory/audit
 * Returns recent audit log entries.
 */
router.get('/audit', authenticateToken, requireRole(['admin', 'owner']), async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase not configured' });
    return;
  }

  const limit = Math.min(Number(req.query.limit) || 50, 200);

  try {
    const { data, error } = await supabase
      .from('memory_audit_log')
      .select('id, operation, agent_id, memory_id, reason, metadata, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json({ entries: data || [], count: (data || []).length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Memory audit fetch failed', { error: msg });
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
});

/**
 * POST /api/v1/memory/decay/dry-run
 * Preview what the decay scheduler would do without applying changes.
 * Admin-only.
 */
router.post('/decay/dry-run', authenticateToken, requireRole(['admin', 'owner']), async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase not configured' });
    return;
  }

  const halfLife = Number(req.body.halfLifeDays) || 90;

  try {
    const { data, error } = await supabase.rpc('decay_stale_memories', {
      p_half_life_days: halfLife,
      p_decay_threshold: 0.1,
      p_dry_run: true,
      p_org_id: null,
    });

    if (error) throw error;

    const results = data || [];
    res.json({
      wouldDecay: results.length,
      wouldForget: results.filter((r: { below_threshold: boolean }) => r.below_threshold).length,
      preview: results.slice(0, 20),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Decay dry-run failed', { error: msg });
    res.status(500).json({ error: 'Decay dry-run failed' });
  }
});

export default router;
