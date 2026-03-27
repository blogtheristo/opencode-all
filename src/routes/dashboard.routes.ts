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

import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';
import { createClient } from '@supabase/supabase-js';
import { UsageMeteringService } from '../services/usage-metering.service.js';
import { eventBus } from '../agents/event-bus.js';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

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

    // Fetch usage stats
    let usageStats = {
      agentCallsUsed: 0,
      agentCallsLimit: 100,
      reportExportsUsed: 0,
      reportExportsLimit: 10,
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      const stats = await UsageMeteringService.getUsageStats(userId);
      usageStats = {
        agentCallsUsed: stats.agent_calls?.used ?? 0,
        agentCallsLimit: stats.agent_calls?.limit ?? 100,
        reportExportsUsed: stats.report_exports?.used ?? 0,
        reportExportsLimit: stats.report_exports?.limit ?? 10,
        periodEnd: stats.period_end ?? usageStats.periodEnd,
      };
    } catch {
      // Usage service may not be available — use defaults
    }

    // Fetch compliance summary from Supabase
    let complianceData = {
      overallScore: 0,
      regulationsTracked: 0,
      gapsIdentified: 0,
      trend: 'stable' as const,
    };

    if (supabase) {
      try {
        const { data } = await supabase
          .from('compliance_assessments')
          .select('overall_score, regulations_count, gaps_count')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data) {
          complianceData = {
            overallScore: data.overall_score ?? 0,
            regulationsTracked: data.regulations_count ?? 0,
            gapsIdentified: data.gaps_count ?? 0,
            trend: 'stable',
          };
        }
      } catch {
        // No compliance data yet — use defaults
      }

      // Check trend by comparing last 2 assessments
      try {
        const { data: history } = await supabase
          .from('compliance_assessments')
          .select('overall_score')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(2);

        if (history && history.length === 2) {
          const diff = history[0].overall_score - history[1].overall_score;
          complianceData.trend = diff > 2 ? 'improving' : diff < -2 ? 'declining' : 'stable';
        }
      } catch {
        // Trend unavailable
      }
    }

    // Agent stats from event bus
    const recentEvents = eventBus.getRecentEvents('agent.*');
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const executionsToday = recentEvents.filter(
      (e) => new Date(e.timestamp) >= todayStart,
    ).length;

    const summary: DashboardSummary = {
      compliance: complianceData,
      usage: usageStats,
      agents: {
        totalAvailable: 16,
        executionsToday,
        activeWorkflows: 0,
      },
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
