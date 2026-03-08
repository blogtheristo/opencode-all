/**
 * Usage Metering Service
 *
 * Tracks API calls per user, enforces tier limits, and provides usage statistics.
 * In-memory for MVP — production would use Supabase + Redis for real-time counters.
 *
 * MVP Feature 2 — Usage Dashboard & Billing Metering
 */

import logger from '../utils/logger.js';

// Tier definitions with monthly limits
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
  periodStart: string;     // ISO date of current billing period start
}

interface UsageEvent {
  userId: string;
  type: 'api_call' | 'assistant_message' | 'report_export';
  endpoint: string;
  timestamp: string;
  tokens?: number;
}

// In-memory stores (production: Supabase tables)
const userTiers = new Map<string, string>();          // userId -> tier name
const monthlyUsage = new Map<string, UsageCounter>(); // userId -> current month counters
const recentEvents: UsageEvent[] = [];                // Ring buffer of recent events
const MAX_RECENT_EVENTS = 1000;

function getCurrentPeriodStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function getOrCreateCounter(userId: string): UsageCounter {
  const periodStart = getCurrentPeriodStart();
  const existing = monthlyUsage.get(userId);

  if (existing && existing.periodStart === periodStart) {
    return existing;
  }

  // New period — reset counters
  const counter: UsageCounter = {
    apiCalls: 0,
    assistantMessages: 0,
    reportExports: 0,
    periodStart,
  };
  monthlyUsage.set(userId, counter);
  return counter;
}

export const UsageMeteringService = {
  /**
   * Set a user's tier (called during registration or upgrade).
   */
  setTier(userId: string, tier: string): void {
    if (!TIERS[tier]) {
      throw new Error(`Invalid tier: ${tier}. Valid tiers: ${Object.keys(TIERS).join(', ')}`);
    }
    userTiers.set(userId, tier);
    logger.info('User tier set', { userId, tier });
  },

  /**
   * Get a user's current tier.
   */
  getTier(userId: string): string {
    return userTiers.get(userId) || 'free';
  },

  /**
   * Record a usage event. Returns false if the user has exceeded their tier limits.
   */
  async recordUsage(
    userId: string,
    type: 'api_call' | 'assistant_message' | 'report_export',
    endpoint: string,
    tokens?: number,
  ): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    const tier = this.getTier(userId);
    const limits = TIERS[tier];
    const counter = getOrCreateCounter(userId);

    // Map event type to counter field and limit
    const fieldMap: Record<string, { field: keyof UsageCounter; limitField: keyof TierLimits }> = {
      api_call: { field: 'apiCalls', limitField: 'monthlyApiCalls' },
      assistant_message: { field: 'assistantMessages', limitField: 'monthlyAssistantMessages' },
      report_export: { field: 'reportExports', limitField: 'monthlyReportExports' },
    };

    const mapping = fieldMap[type];
    const currentCount = counter[mapping.field] as number;
    const limit = limits[mapping.limitField] as number;

    if (currentCount >= limit) {
      logger.warn('Usage limit exceeded', { userId, tier, type, currentCount, limit });
      return { allowed: false, remaining: 0, limit };
    }

    // Increment counter
    (counter[mapping.field] as number)++;

    // Record event
    const event: UsageEvent = {
      userId,
      type,
      endpoint,
      timestamp: new Date().toISOString(),
      tokens,
    };
    recentEvents.push(event);
    if (recentEvents.length > MAX_RECENT_EVENTS) {
      recentEvents.shift();
    }

    const remaining = limit - (currentCount + 1);
    return { allowed: true, remaining, limit };
  },

  /**
   * Get usage statistics for a user.
   */
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
    const counter = getOrCreateCounter(userId);

    const pct = (used: number, limit: number) => Math.round((used / limit) * 100);

    const userEvents = recentEvents
      .filter((e) => e.userId === userId)
      .slice(-20); // Last 20 events

    return {
      tier,
      tierName: limits.name,
      period: counter.periodStart,
      usage: {
        apiCalls: {
          used: counter.apiCalls,
          limit: limits.monthlyApiCalls,
          percentage: pct(counter.apiCalls, limits.monthlyApiCalls),
        },
        assistantMessages: {
          used: counter.assistantMessages,
          limit: limits.monthlyAssistantMessages,
          percentage: pct(counter.assistantMessages, limits.monthlyAssistantMessages),
        },
        reportExports: {
          used: counter.reportExports,
          limit: limits.monthlyReportExports,
          percentage: pct(counter.reportExports, limits.monthlyReportExports),
        },
      },
      recentActivity: userEvents,
    };
  },

  /**
   * Get aggregate platform usage (admin endpoint).
   */
  async getPlatformStats(): Promise<{
    totalUsers: number;
    tierDistribution: Record<string, number>;
    totalApiCalls: number;
    totalEvents: number;
  }> {
    const tierDist: Record<string, number> = {};
    let totalApiCalls = 0;

    for (const [_userId, tier] of userTiers) {
      tierDist[tier] = (tierDist[tier] || 0) + 1;
    }

    for (const counter of monthlyUsage.values()) {
      totalApiCalls += counter.apiCalls;
    }

    return {
      totalUsers: userTiers.size,
      tierDistribution: tierDist,
      totalApiCalls,
      totalEvents: recentEvents.length,
    };
  },
};

export default UsageMeteringService;
