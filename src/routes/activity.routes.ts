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

import { type NextFunction, type Request, type Response, Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';
import { eventBus } from '../agents/event-bus.js';

const router = Router();

const supabase = getSupabaseClient();

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
// UUID v4 format check — userId comes from JWT but we're interpolating into
// Supabase .or() filter strings, so belt-and-braces validation.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const typeFilter = req.query.type as string | undefined;

    if (supabase) {
      if (!UUID_RE.test(userId)) {
        res.status(400).json({ error: 'Invalid user identifier' });
        return;
      }

      // Service role bypasses RLS, so we must replicate the
      // "users read own activity_events" policy manually here
      // (see supabase/migrations/053_notifications_activity.sql).
      // Without this scoping, visibility='org' events from ANY
      // organization would leak cross-tenant.
      const { data: memberships, error: memError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (memError) {
        logger.error('Activity feed membership lookup error', {
          userId,
          error: memError.message,
        });
        throw memError;
      }

      const orgIds = (memberships || [])
        .map((m: { organization_id: string | null }) => m.organization_id)
        .filter((id): id is string => typeof id === 'string' && UUID_RE.test(id));

      // Build visibility-scoped filter:
      //   - own private events  (visibility='user' AND user_id=me)
      //   - public events       (visibility='public')
      //   - org events ONLY for orgs I'm an active member of
      const orClauses = [`and(visibility.eq.user,user_id.eq.${userId})`, `visibility.eq.public`];
      if (orgIds.length > 0) {
        orClauses.push(`and(visibility.eq.org,organization_id.in.(${orgIds.join(',')}))`);
      }

      let query = supabase
        .from('activity_events')
        .select('*', { count: 'exact' })
        .or(orClauses.join(','))
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
      severity:
        e.priority === 'critical'
          ? ('critical' as const)
          : e.priority === 'high'
            ? ('warning' as const)
            : ('info' as const),
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
router.get('/stream', async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Cross-tenant safety: build the set of orgs this user can see events for.
  // Without this filter, eventBus.subscribe('*') would leak every org's
  // events to every connected user. Mirrors the scoping in GET /.
  const allowedOrgIds = new Set<string>();
  if (supabase && UUID_RE.test(userId)) {
    const { data: memberships } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', userId)
      .eq('status', 'active');
    for (const m of memberships || []) {
      const id = (m as { organization_id: string | null }).organization_id;
      if (typeof id === 'string' && UUID_RE.test(id)) allowedOrgIds.add(id);
    }
  }

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
    // Only forward events belonging to an org this user is an active member of.
    // Events without an orgId (system-wide) are dropped from user streams to
    // avoid accidentally leaking internal telemetry.
    if (!event.orgId || !allowedOrgIds.has(event.orgId)) {
      return;
    }
    const sseData: ActivityEvent = {
      id: `evt-${Date.now()}`,
      type: 'agent_execution',
      title: `Agent event: ${event.type}`,
      description: `${event.source} — ${event.type}`,
      severity:
        event.priority === 'critical' ? 'critical' : event.priority === 'high' ? 'warning' : 'info',
      metadata: event.payload,
      created_at: event.timestamp,
    };
    res.write(`data: ${JSON.stringify(sseData)}\n\n`);
  });

  // Heartbeat every 15s to keep connection alive.
  // Shorter than any upstream proxy timeout (nginx default: 60s).
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 15_000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
    logger.debug('Activity stream disconnected', { userId });
  });
});

export default router;
