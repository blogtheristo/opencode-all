/**
 * Dashboard Summary Routes
 *
 * GET /api/v1/dashboard/summary   — Aggregated metrics for MetricsHeader widget
 * GET /api/v1/dashboard/health    — System health overview for admin dashboard
 *
 * Aggregates data from: compliance scores, usage stats, agent executions,
 * report counts, and system status.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-913
 */

import { type NextFunction, type Request, type Response, Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';
import { UsageMeteringService } from '../services/usage-metering.service.js';
import { eventBus } from '../agents/event-bus.js';
import { MGDMetricsService } from '../agents/mgd-metrics.service.js';

const router = Router();

const supabase = getSupabaseClient();

router.use(authenticateToken);

// ============ TYPES ============

interface DashboardSummary {
  compliance: {
    overallScore: number;
    regulationsTracked: number;
    gapsIdentified: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  usage: {
    agentCallsUsed: number;
    agentCallsLimit: number;
    reportExportsUsed: number;
    reportExportsLimit: number;
    periodEnd: string;
  };
  agents: {
    totalAvailable: number;
    executionsToday: number;
    activeWorkflows: number;
  };
  // Monthly Governed Decisions — the north-star metric (DWS_TRUTH_STANDARD.md
  // §2 row 29). Audit-grade governed decisions counted for the current month.
  mgd: {
    monthToDate: number;
    month: string;
  };
  system: {
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    eventBusSubscriptions: number;
  };
}

// ============ ROUTES ============

/**
 * GET /api/v1/dashboard/summary
 * Aggregated metrics for the dashboard MetricsHeader widget.
 */
router.get('/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    // Fetch usage stats. UsageMeteringService returns:
    //   { tier, tierName, period, usage: { apiCalls, assistantMessages, reportExports }, recentActivity }
    // where each usage field is { used, limit, percentage }. See usage-metering.service.ts.
    let usageStats = {
      agentCallsUsed: 0,
      agentCallsLimit: 100,
      reportExportsUsed: 0,
      reportExportsLimit: 10,
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      const stats = await UsageMeteringService.getUsageStats(userId);
      // period is the period_start (YYYY-MM-DD). Compute period_end as start + 30 days.
      const periodStart = stats.period ? new Date(stats.period) : new Date();
      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 30);

      usageStats = {
        agentCallsUsed: stats.usage.apiCalls.used,
        agentCallsLimit: stats.usage.apiCalls.limit,
        reportExportsUsed: stats.usage.reportExports.used,
        reportExportsLimit: stats.usage.reportExports.limit,
        periodEnd: periodEnd.toISOString(),
      };
    } catch {
      // Usage service may not be available — use defaults
    }

    // Fetch compliance summary from Supabase
    let complianceData: DashboardSummary['compliance'] = {
      overallScore: 0,
      regulationsTracked: 0,
      gapsIdentified: 0,
      trend: 'stable',
    };

    if (supabase) {
      // compliance_assessments schema (migration 042):
      //   profile_id -> compliance_profiles(id) -> organization_id
      //   overall_score, regulation_scores (JSONB array), gaps (JSONB array)
      // User linkage goes via organization_members(user_id, organization_id).
      try {
        const { data: memberships } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', userId);

        const orgIds = (memberships ?? []).map((m) => m.organization_id).filter(Boolean);

        if (orgIds.length > 0) {
          const { data: profiles } = await supabase
            .from('compliance_profiles')
            .select('id')
            .in('organization_id', orgIds);

          const profileIds = (profiles ?? []).map((p) => p.id);

          if (profileIds.length > 0) {
            const { data: history } = await supabase
              .from('compliance_assessments')
              .select('overall_score, regulation_scores, gaps, created_at')
              .in('profile_id', profileIds)
              .order('created_at', { ascending: false })
              .limit(2);

            if (history && history.length > 0) {
              const latest = history[0];
              const regScores = Array.isArray(latest.regulation_scores)
                ? latest.regulation_scores
                : [];
              const gaps = Array.isArray(latest.gaps) ? latest.gaps : [];

              let trend: 'improving' | 'stable' | 'declining' = 'stable';
              if (history.length === 2) {
                const diff = (latest.overall_score ?? 0) - (history[1].overall_score ?? 0);
                trend = diff > 2 ? 'improving' : diff < -2 ? 'declining' : 'stable';
              }

              complianceData = {
                overallScore: latest.overall_score ?? 0,
                regulationsTracked: regScores.length,
                gapsIdentified: gaps.length,
                trend,
              };
            }
          }
        }
      } catch (e) {
        logger.warn('Compliance summary fetch failed', { userId, error: (e as Error).message });
      }
    }

    // Agent stats from event bus
    const recentEvents = eventBus.getRecentEvents('agent.*');
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const executionsToday = recentEvents.filter((e) => new Date(e.timestamp) >= todayStart).length;

    // Monthly Governed Decisions (north-star metric). Reuses the request-scoped
    // Supabase client; failures degrade to zero rather than breaking the widget.
    let mgd: DashboardSummary['mgd'] = {
      monthToDate: 0,
      month: new Date().toISOString().slice(0, 7),
    };
    if (supabase) {
      try {
        const metrics = await new MGDMetricsService(supabase).getMGDMetrics();
        mgd = { monthToDate: metrics.monthlyGovernedDecisions, month: metrics.month.slice(0, 7) };
      } catch (e) {
        logger.warn('MGD summary fetch failed', { userId, error: (e as Error).message });
      }
    }

    const summary: DashboardSummary = {
      compliance: complianceData,
      usage: usageStats,
      agents: {
        totalAvailable: 16,
        executionsToday,
        activeWorkflows: 0,
      },
      mgd,
      system: {
        status: 'healthy',
        uptime: process.uptime(),
        eventBusSubscriptions: eventBus.getSubscriptionCount(),
      },
    };

    res.json({
      ...summary,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/dashboard/health
 * Admin-only system health overview.
 */
router.get(
  '/health',
  requireRole(['admin', 'owner']),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const health = {
        server: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version,
        },
        eventBus: {
          subscriptions: eventBus.getSubscriptionCount(),
          recentEvents: eventBus.getRecentEvents(undefined, 5).length,
        },
        database: {
          connected: !!supabase,
        },
        timestamp: new Date().toISOString(),
      };

      res.json(health);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
