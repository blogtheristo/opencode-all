/**
 * CODE VERSIONING NOTE
 * Code-Version: 1.0.0
 * Introduced-In: PR-2038
 * Branch: cursor/sales-outreach-ted-grok-pack-a455
 * Date: 2026-09-18
 * Owner: DWS Platform / Cursor Agent
 * Env-Schema: env-v1.0
 * Construction / TED sales-outreach leads — machine API (no Google login).
 *
 * POST /fetch         — ingest TED → construction_leads (X-Admin-Key)
 * GET  /ted-live      — live TED search as Mission Control Sales items
 * GET  /sales-queue   — stored construction_leads as the same Sales items
 *
 * Dashboard requireHicAuth is unchanged. These routes are for cron, OpenCode,
 * and HIC CLI — not an unauthenticated Mission Control page.
 *
 * Evidence: Tool=Cursor Grok 4.6 Model=cursor-grok-4.6 Agent=Cursor Agent Date=2026-09-18
 * Audit trail: git log -- src/routes/construction-leads.routes.ts
 */

import { type Request, type Response, Router } from 'express';
import { fetchAndProcessLeads } from '../construction-leads/lead-processor.js';
import { listTedSalesQueue, type SalesQueueSource } from '../construction-leads/sales-queue.js';
import { requireAdminKey } from '../middleware/admin-auth.middleware.js';
import logger from '../utils/logger.js';

const router = Router();

router.use(requireAdminKey);

function parseLimit(raw: unknown): number {
  const n = Number.parseInt(String(raw ?? '25'), 10);
  if (!Number.isFinite(n)) return 25;
  return Math.min(Math.max(n, 1), 50);
}

function parseSource(raw: unknown): SalesQueueSource {
  return raw === 'stored' ? 'stored' : 'live';
}

/**
 * POST /api/v1/construction-leads/fetch
 * Pull TED notices into construction_leads (service role). Same contract as
 * the previous inline handler on app.ts.
 */
router.post('/fetch', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await fetchAndProcessLeads();
    res.json({ status: 'complete', timestamp: new Date().toISOString(), ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Manual construction leads fetch failed', { error: msg });
    res.status(500).json({ error: 'Failed to fetch construction leads', message: msg });
  }
});

/**
 * GET /api/v1/construction-leads/ted-live
 * Public TED API → Sales centre JSON. No Google session, no Grok session.
 */
router.get('/ted-live', async (req: Request, res: Response): Promise<void> => {
  const limit = parseLimit(req.query.limit);
  try {
    const items = await listTedSalesQueue('live', limit);
    res.json({
      source: 'ted-live',
      login: 'admin-key',
      googleLogin: false,
      grokLogin: false,
      count: items.length,
      items,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('TED live sales-queue failed', { error: msg });
    res.status(502).json({ error: 'TED search failed', message: msg });
  }
});

/**
 * GET /api/v1/construction-leads/sales-queue?source=live|stored&limit=25
 * Default source=live (public TED). source=stored reads construction_leads.
 */
router.get('/sales-queue', async (req: Request, res: Response): Promise<void> => {
  const source = parseSource(req.query.source);
  const limit = parseLimit(req.query.limit);
  try {
    const items = await listTedSalesQueue(source, limit);
    res.json({
      source: source === 'stored' ? 'construction_leads' : 'ted-live',
      login: 'admin-key',
      googleLogin: false,
      grokLogin: false,
      count: items.length,
      items,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Sales-queue list failed', { error: msg, source });
    res.status(502).json({ error: 'Sales queue failed', message: msg });
  }
});

export default router;
