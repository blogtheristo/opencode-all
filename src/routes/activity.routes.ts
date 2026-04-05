/**
 * Activity Feed Routes
 *
 * GET /api/v1/activity          — Get recent activity events for the dashboard
 * GET /api/v1/activity/stream   — SSE stream for real-time updates
 *
 * Aggregates events from: agent executions, compliance changes,
 * report exports, user actions, and system events.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-913
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';
import { createClient } from '@supabase/supabase-js';
import { eventBus } from '../agents/event-bus.js';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

router.use(authenticateToken);

// ============ TYPES ============

interface ActivityEvent {
  id: string;
  type: 'agent_execution' | 'compliance_change' | 'report_export' | 'user_action' | 'system';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  metadata: Record<string, unknown>;
  created_at: string;
}

// ============ ROUTES ============

/**
 * GET /api/v1/activity
 * Get paginated activity feed. Fetches from Supabase activity_events table,
 * falls back to in-memory event bus events.
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const typeFilter = req.query.type as string | undefined;

    if (supabase) {
      let query = supabase
        .from('activity_events')
        .select('*', { count: 'exact' })
        .or(`user_id.eq.${userId},visibility.eq.org`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }

      const { data, error, count } = await query;

      if (error) {
        logger.error('Activity feed fetch error', { userId, error: error.message });
        throw error;
      }

      res.json({
        events: data || [],
        total: count || 0,
        limit,
        offset,
      });
      return;
    }

    // Fallback: use in-memory event bus recent events
    const recentEvents = eventBus.getRecentEvents(undefined, limit);
    const events: ActivityEvent[] = recentEvents.map((e, i) => ({
      id: `evt-${Date.now()}-${i}`,
      type: 'agent_execution' as const,
      title: `Agent event: ${e.type}`,
      description: `${e.source} — ${e.type}`,
      severity: e.priority === 'critical' ? 'critical' as const
        : e.priority === 'high' ? 'warning' as const
        : 'info' as const,
      metadata: e.payload || {},
      created_at: e.timestamp,
    }));

    res.json({
      events,
      total: events.length,
      limit,
      offset: 0,
      source: 'event-bus',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/activity/stream
 * Server-Sent Events (SSE) for real-time activity updates.
 * Dashboard connects to this for live feed.
 */
router.get('/stream', (req: Request, res: Response) => {
  const userId = req.userId!;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable nginx buffering
  });

  // Send initial heartbeat
  res.write('data: {"type":"connected","message":"Activity stream connected"}\n\n');

  // Subscribe to all event bus events
  const unsubscribe = eventBus.subscribe('*', async (event) => {
    const sseData: ActivityEvent = {
      id: `evt-${Date.now()}`,
      type: 'agent_execution',
      title: `Agent event: ${event.type}`,
      description: `${event.source} — ${event.type}`,
      severity: event.priority === 'critical' ? 'critical'
        : event.priority === 'high' ? 'warning'
        : 'info',
      metadata: event.payload,
      created_at: event.timestamp,
    };
    res.write(`data: ${JSON.stringify(sseData)}\n\n`);
  });

  // Heartbeat every 30s to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30_000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
    logger.debug('Activity stream disconnected', { userId });
  });
});

export default router;
