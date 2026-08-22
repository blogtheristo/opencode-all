/**
 * Usage Metering Service
 *
 * Tracks API calls per user, enforces tier limits, and provides usage statistics.
 * Storage: Supabase `usage_events` + `usage_counters` tables (migration 043).
 * Falls back to in-memory when Supabase is unavailable.
 *
 * MVP Feature 2 — Usage Dashboard & Billing Metering
 */

import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';

export interface TierLimits {
  name: string;
  monthlyApiCalls: number;
  monthlyAssistantMessages: number;
  monthlyReportExports: number;
  maxProjects: number;
}

export const TIERS: Record<string, TierLimits> = {
  free: {
    name: 'Free',
    monthlyApiCalls: 100,
    monthlyAssistantMessages: 20,
    monthlyReportExports: 2,
    maxProjects: 1,
  },
  pro: {
    name: 'Pro',
    monthlyApiCalls: 5000,
    monthlyAssistantMessages: 500,
    monthlyReportExports: 50,
    maxProjects: 10,
  },
  enterprise: {
    name: 'Enterprise',
    monthlyApiCalls: 100000,
    monthlyAssistantMessages: 10000,
    monthlyReportExports: 500,
    maxProjects: 100,
  },
};

interface UsageCounter {
  apiCalls: number;
  assistantMessages: number;
  reportExports: number;
  periodStart: string;
}

interface UsageEvent {
  userId: string;
  type: 'api_call' | 'assistant_message' | 'report_export';
  endpoint: string;
  timestamp: string;
  tokens?: number;
}

// In-memory fallback stores
const memTiers = new Map<string, string>();
const memCounters = new Map<string, UsageCounter>();
const memEvents: UsageEvent[] = [];
const MAX_MEM_EVENTS = 1000;

function getCurrentPeriodStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function getCurrentPeriodDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function getOrCreateMemCounter(userId: string): UsageCounter {
  const periodStart = getCurrentPeriodStart();
  const existing = memCounters.get(userId);
  if (existing && existing.periodStart === periodStart) return existing;

  const counter: UsageCounter = {
    apiCalls: 0, assistantMessages: 0, reportExports: 0, periodStart,
  };
  memCounters.set(userId, counter);
  return counter;
}

export const UsageMeteringService = {
  setTier(userId: string, tier: string): void {
    if (!TIERS[tier]) {
      throw new Error(`Invalid tier: ${tier}. Valid tiers: ${Object.keys(TIERS).join(', ')}`);
    }
    memTiers.set(userId, tier);
    logger.info('User tier set', { userId, tier });
  },

  getTier(userId: string): string {
    return memTiers.get(userId) || 'free';
  },

  async recordUsage(
    userId: string,
    type: 'api_call' | 'assistant_message' | 'report_export',
    endpoint: string,
    tokens?: number,
  ): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    const tier = this.getTier(userId);
    const limits = TIERS[tier];

    const fieldMap: Record<string, { counterKey: 'apiCalls' | 'assistantMessages' | 'reportExports'; limitKey: keyof TierLimits }> = {
      api_call: { counterKey: 'apiCalls', limitKey: 'monthlyApiCalls' },
      assistant_message: { counterKey: 'assistantMessages', limitKey: 'monthlyAssistantMessages' },
      report_export: { counterKey: 'reportExports', limitKey: 'monthlyReportExports' },
    };
    const mapping = fieldMap[type];
    const limit = limits[mapping.limitKey] as number;

    const sb = getSupabaseClient();

    if (sb) {
      try {
        // Insert usage event
        await sb.from('usage_events').insert({
          user_id: userId,
          event_type: type,
          endpoint,
          tokens: tokens ?? null,
        });

        // Atomic counter increment via database function
        const { data, error } = await sb.rpc('increment_usage_counter', {
          p_user_id: userId,
          p_event_type: type,
          p_tier: tier,
        });

        if (error) {
          logger.error('Usage counter increment failed', { error: error.message });
          // Fall through to in-memory
        } else if (data && data.length > 0) {
          const row = data[0];
          const counterMap: Record<string, number> = {
            apiCalls: row.api_calls,
            assistantMessages: row.assistant_msgs,
            reportExports: row.report_exports,
          };
          const currentCount = counterMap[mapping.counterKey] || 0;

          if (currentCount > limit) {
            logger.warn('Usage limit exceeded', { userId, tier, type, currentCount, limit });
            return { allowed: false, remaining: 0, limit };
          }

          return { allowed: true, remaining: limit - currentCount, limit };
        }
      } catch (err) {
        logger.warn('Supabase usage tracking failed, using in-memory', {
          error: err instanceof Error ? err.message : 'Unknown',
        });
      }
    }

    // In-memory fallback
    const counter = getOrCreateMemCounter(userId);
    const currentCount = counter[mapping.counterKey];

    if (currentCount >= limit) {
      logger.warn('Usage limit exceeded', { userId, tier, type, currentCount, limit });
      return { allowed: false, remaining: 0, limit };
    }

    counter[mapping.counterKey]++;

    // Track event in memory
    memEvents.push({ userId, type, endpoint, timestamp: new Date().toISOString(), tokens });
    if (memEvents.length > MAX_MEM_EVENTS) memEvents.shift();

    return { allowed: true, remaining: limit - (currentCount + 1), limit };
  },

  async getUsageStats(userId: string): Promise<{
    tier: string;
    tierName: string;
    period: string;
    usage: {
      apiCalls: { used: number; limit: number; percentage: number };
      assistantMessages: { used: number; limit: number; percentage: number };
      reportExports: { used: number; limit: number; percentage: number };
    };
    recentActivity: UsageEvent[];
  }> {
    const tier = this.getTier(userId);
    const limits = TIERS[tier];
    const pct = (used: number, lim: number) => Math.round((used / lim) * 100);

    const sb = getSupabaseClient();

    if (sb) {
      try {
        const periodDate = getCurrentPeriodDate();

        // Get counters
        const { data: counterRow } = await sb
          .from('usage_counters')
          .select('api_calls, assistant_msgs, report_exports, period_start')
          .eq('user_id', userId)
          .eq('period_start', periodDate)
          .single();

        const apiCalls = counterRow?.api_calls ?? 0;
        const assistantMsgs = counterRow?.assistant_msgs ?? 0;
        const reportExports = counterRow?.report_exports ?? 0;
        const periodStart = counterRow?.period_start ?? periodDate;

        // Get recent events
        const { data: events } = await sb
          .from('usage_events')
          .select('user_id, event_type, endpoint, created_at, tokens')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);

        const recentActivity: UsageEvent[] = (events || []).map(
          (e: {
            user_id: string;
            event_type: UsageEvent['type'];
            endpoint: string;
            created_at: string;
            tokens: number;
          }) => ({
            userId: e.user_id,
            type: e.event_type,
            endpoint: e.endpoint,
            timestamp: e.created_at,
            tokens: e.tokens,
          }),
        );

        return {
          tier,
          tierName: limits.name,
          period: periodStart,
          usage: {
            apiCalls: { used: apiCalls, limit: limits.monthlyApiCalls, percentage: pct(apiCalls, limits.monthlyApiCalls) },
            assistantMessages: { used: assistantMsgs, limit: limits.monthlyAssistantMessages, percentage: pct(assistantMsgs, limits.monthlyAssistantMessages) },
            reportExports: { used: reportExports, limit: limits.monthlyReportExports, percentage: pct(reportExports, limits.monthlyReportExports) },
          },
          recentActivity,
        };
      } catch (err) {
        logger.warn('Supabase usage stats failed, using in-memory', {
          error: err instanceof Error ? err.message : 'Unknown',
        });
      }
    }

    // In-memory fallback
    const counter = getOrCreateMemCounter(userId);
    const userEvents = memEvents.filter((e) => e.userId === userId).slice(-20);

    return {
      tier,
      tierName: limits.name,
      period: counter.periodStart,
      usage: {
        apiCalls: { used: counter.apiCalls, limit: limits.monthlyApiCalls, percentage: pct(counter.apiCalls, limits.monthlyApiCalls) },
        assistantMessages: { used: counter.assistantMessages, limit: limits.monthlyAssistantMessages, percentage: pct(counter.assistantMessages, limits.monthlyAssistantMessages) },
        reportExports: { used: counter.reportExports, limit: limits.monthlyReportExports, percentage: pct(counter.reportExports, limits.monthlyReportExports) },
      },
      recentActivity: userEvents,
    };
  },

  async getPlatformStats(): Promise<{
    totalUsers: number;
    tierDistribution: Record<string, number>;
    totalApiCalls: number;
    totalEvents: number;
  }> {
    const sb = getSupabaseClient();

    if (sb) {
      try {
        const periodDate = getCurrentPeriodDate();

        const { data: counters } = await sb
          .from('usage_counters')
          .select('tier, api_calls')
          .eq('period_start', periodDate);

        const tierDist: Record<string, number> = {};
        let totalApiCalls = 0;

        for (const row of counters || []) {
          tierDist[row.tier] = (tierDist[row.tier] || 0) + 1;
          totalApiCalls += row.api_calls;
        }

        const { count: eventCount } = await sb
          .from('usage_events')
          .select('id', { count: 'exact', head: true });

        return {
          totalUsers: (counters || []).length,
          tierDistribution: tierDist,
          totalApiCalls,
          totalEvents: eventCount ?? 0,
        };
      } catch (err) {
        logger.warn('Supabase platform stats failed, using in-memory', {
          error: err instanceof Error ? err.message : 'Unknown',
        });
      }
    }

    // In-memory fallback
    const tierDist: Record<string, number> = {};
    let totalApiCalls = 0;
    for (const [, tier] of memTiers) {
      tierDist[tier] = (tierDist[tier] || 0) + 1;
    }
    for (const counter of memCounters.values()) {
      totalApiCalls += counter.apiCalls;
    }

    return {
      totalUsers: memTiers.size,
      tierDistribution: tierDist,
      totalApiCalls,
      totalEvents: memEvents.length,
    };
  },
};

export default UsageMeteringService;
