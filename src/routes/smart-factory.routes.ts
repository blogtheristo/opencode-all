/**
 * Smart Factory for Sales — API
 *
 * Auth: shared secret via X-Smart-Factory-Key header (SMART_FACTORY_KEY env).
 * No key configured = endpoints disabled (503).
 *
 * Routes:
 *   POST /api/v1/smart-factory/run     — trigger the daily pipeline
 *   GET  /api/v1/smart-factory/campaigns
 *   GET  /api/v1/smart-factory/prospects?campaign_id=
 *   GET  /api/v1/smart-factory/messages?campaign_id=
 *   POST /api/v1/smart-factory/book    — book a call for a prospect
 */

import express, { type Request, type Response, type Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { SmartFactoryAgent } from '../agents/smart-factory.agent.js';
import type { Channel } from '../smart-factory/types.js';

const router: Router = express.Router();

// ---------------------------------------------------------------------------
// Supabase + auth
// ---------------------------------------------------------------------------

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY required');
    supabase = createClient(url, key);
  }
  return supabase;
}

function requireSmartFactoryKey(req: Request, res: Response, next: () => void): void {
  const configuredKey = process.env.SMART_FACTORY_KEY;
  if (!configuredKey) {
    res.status(503).json({ error: 'Smart Factory API not configured. Set SMART_FACTORY_KEY.' });
    return;
  }
  const providedKey = req.headers['x-smart-factory-key'] as string;
  if (!providedKey || providedKey !== configuredKey) {
    logger.warn('smart-factory api: invalid key', { ip: req.ip });
    res.status(401).json({ error: 'Invalid or missing X-Smart-Factory-Key header' });
    return;
  }
  next();
}

// ---------------------------------------------------------------------------
// POST /run — trigger the pipeline
// ---------------------------------------------------------------------------

const VALID_CHANNELS = new Set(['email', 'whatsapp', 'linkedin', 'facebook']);

router.post(
  '/run',
  requireSmartFactoryKey,
  [
    body('campaignName').optional().isString().trim().isLength({ min: 3, max: 120 }),
    body('catalog').optional().exists(),
    body('channels')
      .optional()
      .isArray()
      .custom((v: unknown) =>
        Array.isArray(v) && v.every((c) => typeof c === 'string' && VALID_CHANNELS.has(c)),
      ),
    body('dailyCap').optional().isInt({ min: 1, max: 500 }),
    body('noSend').optional().isBoolean(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Validation failed', details: errors.array() });
      return;
    }

    try {
      const agent = new SmartFactoryAgent();
      const response = await agent.execute(
        { userId: "smart-factory-api", orgId: "platform", projectId: "smart-factory", sessionId: `api-${Date.now()}` },
        { action: 'run', ...req.body },
      );
      const status = response.result.ok === false ? 500 : 200;
      res.status(status).json(response.result);
    } catch (error) {
      logger.error('smart-factory run failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).json({ error: 'Smart Factory pipeline failed' });
    }
  },
);

// ---------------------------------------------------------------------------
// GET endpoints — campaigns / prospects / messages
// ---------------------------------------------------------------------------

router.get('/campaigns', requireSmartFactoryKey, async (_req: Request, res: Response) => {
  try {
    const { data, error } = await getSupabase()
      .from('smart_factory_campaigns')
      .select('id, name, channels, daily_cap, status, created_at');
    if (error) throw new Error(error.message);
    res.json({ ok: true, campaigns: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'query failed' });
  }
});

router.get(
  '/prospects',
  requireSmartFactoryKey,
  [query('campaign_id').isUUID()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Validation failed', details: errors.array() });
      return;
    }
    try {
      const statusFilter = typeof req.query.status === 'string' ? req.query.status : undefined;
      let q = getSupabase()
        .from('smart_factory_prospects')
        .select('id, org_name, country_code, industry, matched_products, fit_score, status, last_channel, last_contacted_at')
        .eq('campaign_id', req.query.campaign_id as string)
        .order('fit_score', { ascending: false })
        .limit(200);
      if (statusFilter) q = q.eq('status', statusFilter);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      res.json({ ok: true, prospects: data });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'query failed' });
    }
  },
);

router.get(
  '/messages',
  requireSmartFactoryKey,
  [query('campaign_id').isUUID()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Validation failed', details: errors.array() });
      return;
    }
    try {
      const channelFilter = typeof req.query.channel === 'string' ? req.query.channel : undefined;
      let q = getSupabase()
        .from('smart_factory_messages')
        .select('id, prospect_id, channel, product_id, subject, status, error, sent_at, created_at')
        .eq('campaign_id', req.query.campaign_id as string)
        .order('created_at', { ascending: false })
        .limit(500);
      if (channelFilter && VALID_CHANNELS.has(channelFilter)) q = q.eq('channel', channelFilter as Channel);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      res.json({ ok: true, messages: data });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'query failed' });
    }
  },
);

// ---------------------------------------------------------------------------
// POST /book — book a call for a prospect
// ---------------------------------------------------------------------------

router.post(
  '/book',
  requireSmartFactoryKey,
  [
    body('campaignId').isUUID(),
    body('prospectId').isUUID(),
    body('customerName').isString().trim().isLength({ min: 1, max: 200 }),
    body('customerEmail').isEmail().normalizeEmail(),
    body('customerPhone').optional().isString().trim().isLength({ max: 50 }),
    body('customerCompany').optional().isString().trim().isLength({ max: 255 }),
    body('notes').optional().isString().trim().isLength({ max: 1000 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Validation failed', details: errors.array() });
      return;
    }
    try {
      const agent = new SmartFactoryAgent();
      const response = await agent.execute(
        { userId: "smart-factory-api", orgId: "platform", projectId: "smart-factory", sessionId: `api-${Date.now()}` },
        { action: 'book', ...req.body },
      );
      const status = response.result.ok === false ? 500 : 200;
      res.status(status).json(response.result);
    } catch (error) {
      logger.error('smart-factory booking failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).json({ error: 'Call booking failed' });
    }
  },
);

export default router;
