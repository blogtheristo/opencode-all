// Evidence: Tool=Claude Code 2.1.278 Model=anthropic/claude-opus-5 Agent=claude-code Date=2026-09-22
// Audit trail: git log -- src/routes/backoffice.routes.ts

import express, { type NextFunction, type Request, type Response, type Router } from 'express';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { getSupabaseClient } from '../config/supabase.js';
import logger from '../utils/logger.js';
import { buildPipelineView, loadRegistry } from '../agents/workflow-v2/pipeline.js';

const execFileAsync = promisify(execFile);
const router: Router = express.Router();

export interface ContainerInfo {
  name: string;
  image: string;
  state: string;
  status: string;
  health: 'healthy' | 'unhealthy' | 'starting' | 'none';
}

// Same rule as SQL is_backoffice_admin() (migration 011): trust organization_members, never user_metadata.
async function requireBackofficeAdmin(req: Request, res: Response, next: NextFunction) {
  const db = getSupabaseClient();
  if (!db) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : '';
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { data: userData, error: userError } = await db.auth.getUser(token);
  if (userError || !userData?.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { data: membership, error } = await db
    .from('organization_members')
    .select('user_id')
    .eq('user_id', userData.user.id)
    .in('role', ['owner', 'admin'])
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.error('Backoffice admin check failed', { error: error.message });
    res.status(500).json({ error: 'Failed to verify admin role' });
    return;
  }
  if (!membership) {
    logger.warn('Backoffice access denied', { userId: userData.user.id });
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  req.userId = userData.user.id;
  req.userEmail = userData.user.email;
  next();
}

export function parseDockerPs(stdout: string): ContainerInfo[] {
  return stdout
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as Record<string, string>)
    .map((c) => {
      const status = c.Status ?? '';
      const health = /\(healthy\)/.test(status)
        ? 'healthy'
        : /\(unhealthy\)/.test(status)
          ? 'unhealthy'
          : /health: starting/.test(status)
            ? 'starting'
            : 'none';
      return { name: c.Names ?? '', image: c.Image ?? '', state: c.State ?? '', status, health };
    });
}

async function listContainers(): Promise<ContainerInfo[]> {
  const { stdout } = await execFileAsync('docker', ['ps', '-a', '--format', '{{json .}}'], {
    timeout: 5000,
  });
  return parseDockerPs(stdout);
}

async function countRows(
  table: string,
  apply: (q: any) => any = (q) => q, // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<number | null> {
  const db = getSupabaseClient();
  if (!db) return null;
  const { count, error } = await apply(db.from(table).select('*', { count: 'exact', head: true }));
  if (error) {
    logger.warn('Backoffice count failed', { table, error: error.message });
    return null;
  }
  return count ?? 0;
}

router.use(requireBackofficeAdmin);

// requireBackofficeAdmin already returned 503 when the client is missing.
function db() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Database not configured');
  return client;
}

router.get('/stats', async (_req: Request, res: Response) => {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const [totalUsers, activeUsers7d, apiRequestsToday, containers] = await Promise.all([
    countRows('user_profiles', (q) => q.neq('status', 'deleted')),
    countRows('user_profiles', (q) => q.gte('last_login_at', weekAgo)),
    countRows('usage_events', (q) => q.gte('created_at', startOfDay.toISOString())),
    listContainers().catch((err: Error) => {
      logger.warn('docker ps failed', { error: err.message });
      return null;
    }),
  ]);

  res.json({
    generatedAt: new Date().toISOString(),
    users: { total: totalUsers, active7d: activeUsers7d },
    apiRequestsToday,
    containers: containers && {
      total: containers.length,
      running: containers.filter((c) => c.state === 'running').length,
      unhealthy: containers.filter((c) => c.health === 'unhealthy' || c.state === 'restarting')
        .length,
    },
    backendUptimeSeconds: Math.round(process.uptime()),
  });
});

router.get('/containers', async (_req: Request, res: Response) => {
  try {
    res.json({ containers: await listContainers() });
  } catch (err) {
    logger.warn('docker ps failed', { error: (err as Error).message });
    res.status(503).json({ error: 'Docker not reachable from backend host' });
  }
});

router.get('/users', async (req: Request, res: Response) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
  const { data, error } = await db()
    .from('user_profiles')
    .select('id, email, first_name, last_name, status, mfa_enabled, last_login_at, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    res.status(500).json({ error: 'Failed to load users' });
    return;
  }
  res.json({ users: data });
});

router.get('/audit-log', async (req: Request, res: Response) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 200);
  const { data, error } = await db()
    .from('auth_audit_log')
    .select('id, user_id, action, success, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    res.status(500).json({ error: 'Failed to load audit log' });
    return;
  }
  res.json({ entries: data });
});

// Workflow v2 pipeline view — the HIC's control panel (docs/workflow-v2-chapters-roadmap.md
// "Pipeline view"): what the market says → what we believe → what we changed → did it work.
// First implementation reads the repo registry (docs/market-signals); the durable version
// will read workflow_v2_runs. Read-only; decisions still go through the approval-hash gate.
router.get('/pipeline', async (_req: Request, res: Response) => {
  try {
    const signals = await loadRegistry();
    res.json(buildPipelineView(signals));
  } catch (error) {
    logger.error('Backoffice pipeline view failed', { error: String(error) });
    res.status(500).json({ error: 'Pipeline view unavailable' });
  }
});

export default router;
