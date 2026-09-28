/**
 * Admin Cost Audit API Routes
 * Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=cost-audit-api Date=2026-09-19
 * Audit trail: git log -- <this-file>
 *
 * Provides cost audit log endpoints for mission control dashboard.
 * Requires authentication and admin role.
 */

import express, { type Request, type Response, type Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import fs from 'fs';
import logger from '../utils/logger.js';

const router: Router = express.Router();

const ALLOWED_ADMINS = [
  'admin@dws6.com',
  'risto.paarni2024@lifetime.fi',
  'admin@dws10.com',
];

const AUDIT_LOG_PATH = '.claude/hooks/audit/cost-policy.log';

function isAdminAllowed(email: string): boolean {
  return ALLOWED_ADMINS.includes(email);
}

function readAuditLog(): string {
  try {
    if (fs.existsSync(AUDIT_LOG_PATH)) {
      return fs.readFileSync(AUDIT_LOG_PATH, 'utf-8');
    }
    return '';
  } catch (error) {
    logger.error('Failed to read cost audit log:', error);
    return '';
  }
}

function parseAuditLog(logText: string): Record<string, unknown>[] {
  const lines = logText.split('\n').filter((line) => line.trim());
  const entries: Record<string, unknown>[] = [];

  for (const line of lines) {
    const parts = line.split('|').map((p) => p.trim());
    if (parts.length !== 7) continue;

    const [datetime, sessionId, agentType, sandbox, workload, decision, rationale] = parts;
    entries.push({
      datetime,
      sessionId,
      agentType,
      sandbox,
      workload,
      decision,
      rationale,
    });
  }

  return entries;
}

/**
 * GET /api/admin/cost-audit-log
 * Returns the cost audit log as a JSON array of entries.
 * Restricted to allowed admin emails.
 */
router.get('/cost-audit-log', authenticateToken, (req: Request, res: Response): void => {
  const userEmail = (req.user as { email?: string })?.email || '';

  if (!isAdminAllowed(userEmail)) {
    res.status(403).json({
      error: 'Access denied',
      message: 'You are not authorized to access cost audit logs',
    });
    return;
  }

  try {
    const logText = readAuditLog();
    const entries = parseAuditLog(logText);
    res.json(entries);
  } catch (error) {
    logger.error('Cost audit log retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve cost audit log',
    });
  }
});

/**
 * GET /api/admin/cost-audit-log/raw
 * Returns the raw audit log file as plain text.
 * Restricted to allowed admin emails.
 */
router.get('/cost-audit-log/raw', authenticateToken, (req: Request, res: Response): void => {
  const userEmail = (req.user as { email?: string })?.email || '';

  if (!isAdminAllowed(userEmail)) {
    res.status(403).json({
      error: 'Access denied',
      message: 'You are not authorized to access cost audit logs',
    });
    return;
  }

  try {
    const logText = readAuditLog();
    res.type('text/plain').send(logText);
  } catch (error) {
    logger.error('Cost audit log raw retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve cost audit log',
    });
  }
});

/**
 * GET /api/admin/cost-audit-summary
 * Returns aggregated cost statistics.
 * Restricted to allowed admin emails.
 */
router.get('/cost-audit-summary', authenticateToken, (req: Request, res: Response): void => {
  const userEmail = (req.user as { email?: string })?.email || '';

  if (!isAdminAllowed(userEmail)) {
    res.status(403).json({
      error: 'Access denied',
      message: 'You are not authorized to access cost audit logs',
    });
    return;
  }

  try {
    const logText = readAuditLog();
    const entries = parseAuditLog(logText);

    const summary = {
      total: entries.length,
      dgx: entries.filter((e) => e.sandbox === 'dgx-local').length,
      cloud: entries.filter((e) => e.sandbox === 'cloud').length,
      blocked: entries.filter((e) => e.decision === 'blocked').length,
      byWorkload: {} as Record<string, number>,
      byAgent: {} as Record<string, number>,
    };

    for (const entry of entries) {
      const workload = (entry.workload as string) || 'unknown';
      const agent = (entry.agentType as string) || 'unknown';
      summary.byWorkload[workload] = (summary.byWorkload[workload] || 0) + 1;
      summary.byAgent[agent] = (summary.byAgent[agent] || 0) + 1;
    }

    res.json(summary);
  } catch (error) {
    logger.error('Cost audit summary error:', error);
    res.status(500).json({
      error: 'Failed to retrieve cost audit summary',
    });
  }
});

export default router;
