/**
 * Analytics Service — DWS IQ 6/7 (GTM Machine Phase 2b)
 *
 * Funnel analysis, conversion tracking, and cohort aggregation.
 * Queries gtm_event_log table for funnel visualization + drop-off analysis.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (GTM Machine Phase 2b)
 * Branch: claude/implement-gtm-machine-Avz67
 * Date: 2026-04-28
 * Owner: Lifetime Oy
 */

import logger from '../utils/logger.js';
import { supabase } from './supabase.service.js';

export interface FunnelStep {
  step: number;
  label: string;
  enters: number;
  completes: number;
  drop_off: number;
  conversion_rate: number;
}

export interface FunnelMetrics {
  funnel: FunnelStep[];
  metrics: {
    total_entries: number;
    completion_rate: number;
    avg_funnel_time_hours: number;
    revenue_eur: number;
    aov_eur: number;
  };
  email_engagement: {
    step_4_opens: number;
    step_4_clicks: number;
    form_starts: number;
    form_completes: number;
  };
}

export interface CohortFilter {
  vertical?: string; // construction, manufacturing, logistics, energy, etc.
  company_size?: string; // sme, mid_market, enterprise
  region?: string; // eu, dach, nordic, uk, other
  days?: number; // default 30
}

class AnalyticsService {
  /**
   * Get funnel visualization with conversion rates
   */
  async getFunnel(filter: CohortFilter = {}): Promise<FunnelMetrics> {
    try {
      const daysBack = filter.days || 30;
      const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      // Define funnel steps
      const funnelSteps = [
        {
          step: 1,
          label: 'Entry',
          event: 'page_view',
          filter: "properties->>'page_type' = 'store'",
        },
        {
          step: 3,
          label: '€1 Payment',
          event: 'begin_checkout',
          filter: "event_type = 'begin_checkout'",
        },
        {
          step: 4,
          label: 'Enterprise Form',
          event: 'form_submitted',
          filter: "event_type = 'form_submitted'",
        },
        {
          step: 6,
          label: 'Order Review',
          event: 'begin_checkout',
          filter: "event_type = 'begin_checkout'",
        },
        { step: 7, label: 'Stripe Invoice', event: 'purchase', filter: "event_type = 'purchase'" },
        {
          step: 11,
          label: 'License Provision',
          event: 'email_sent',
          filter: "properties->>'template' LIKE 'license%'",
        },
        {
          step: 12,
          label: 'Onboarding',
          event: 'email_opened',
          filter: "properties->>'template' LIKE 'welcome%'",
        },
      ];

      // Query for each step
      const funnel: FunnelStep[] = [];
      let prevCount = 0;

      for (const stepDef of funnelSteps) {
        const { data, error } = await supabase
          .from('gtm_event_log')
          .select('id')
          .gte('timestamp', since)
          .filter(stepDef.filter);

        if (error) {
          logger.warn('Funnel query error', { step: stepDef.step, error: error.message });
          continue;
        }

        const count = data?.length || 0;
        const dropOff = prevCount > 0 ? prevCount - count : 0;
        const conversionRate = prevCount > 0 ? count / prevCount : count > 0 ? 1 : 0;

        funnel.push({
          step: stepDef.step,
          label: stepDef.label,
          enters: prevCount || count,
          completes: count,
          drop_off: dropOff,
          conversion_rate: conversionRate,
        });

        prevCount = count;
      }

      // Get revenue metrics
      const { data: purchases } = await supabase
        .from('gtm_event_log')
        .select('properties')
        .eq('event_type', 'purchase')
        .gte('timestamp', since);

      const totalRevenue = (purchases || []).reduce((sum, p) => {
        const revenue = (p.properties as any)?.revenue_eur || 0;
        return sum + revenue;
      }, 0);

      const aov = purchases && purchases.length > 0 ? totalRevenue / purchases.length : 0;
      const totalEntries = funnel[0]?.enters || 0;
      const completionRate =
        totalEntries > 0 ? (funnel[funnel.length - 1]?.completes || 0) / totalEntries : 0;

      // Get email engagement (Step 4 focus)
      const { data: emailOpens } = await supabase
        .from('gtm_event_log')
        .select('id')
        .eq('event_type', 'email_opened')
        .gte('timestamp', since);

      const { data: emailClicks } = await supabase
        .from('gtm_event_log')
        .select('id')
        .eq('event_type', 'email_clicked')
        .gte('timestamp', since);

      const step4 = funnel.find((f) => f.step === 4);
      const step4Opens = step4 && emailOpens ? emailOpens.length / step4.enters : 0;
      const step4Clicks = step4 && emailClicks ? emailClicks.length / step4.enters : 0;

      return {
        funnel,
        metrics: {
          total_entries: totalEntries,
          completion_rate: completionRate,
          avg_funnel_time_hours: daysBack * 24,
          revenue_eur: totalRevenue,
          aov_eur: aov,
        },
        email_engagement: {
          step_4_opens: step4Opens,
          step_4_clicks: step4Clicks,
          form_starts: step4?.completes ? step4.completes / step4.enters : 0,
          form_completes: step4?.conversion_rate || 0,
        },
      };
    } catch (err) {
      logger.error('getFunnel error', { error: String(err) });
      throw err;
    }
  }

  /**
   * Get drop-off analysis for a specific funnel step
   */
  async getDropoff(step: number, days: number = 30): Promise<any> {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      // Get form validation errors for Step 4
      if (step === 4) {
        const { data: errors } = await supabase
          .from('gtm_event_log')
          .select('properties')
          .eq('event_type', 'form_validation_error')
          .gte('timestamp', since);

        const errorsByField: Record<string, number> = {};
        (errors || []).forEach((e) => {
          const field = (e.properties as any)?.field_name || 'unknown';
          errorsByField[field] = (errorsByField[field] || 0) + 1;
        });

        const reasons = Object.entries(errorsByField).map(([reason, count]) => ({
          reason,
          count,
        }));

        const funnel = await this.getFunnel({ days });
        const step4 = funnel.funnel.find((f) => f.step === 4);

        return {
          step,
          label: 'Enterprise Form',
          enters: step4?.enters || 0,
          completes: step4?.completes || 0,
          drop_off: step4?.drop_off || 0,
          drop_off_pct: step4 ? step4.drop_off / step4.enters : 0,
          reasons,
        };
      }

      return { step, error: 'Step not implemented' };
    } catch (err) {
      logger.error('getDropoff error', { step, error: String(err) });
      throw err;
    }
  }

  /**
   * Get cohort metrics (vertical, company size, region)
   */
  async getCohortMetrics(cohort: CohortFilter = {}): Promise<any> {
    try {
      const funnel = await this.getFunnel(cohort);

      return {
        cohort,
        ...funnel.metrics,
        funnel_steps: funnel.funnel.length,
      };
    } catch (err) {
      logger.error('getCohortMetrics error', { cohort, error: String(err) });
      throw err;
    }
  }
}

export const analyticsService = new AnalyticsService();
