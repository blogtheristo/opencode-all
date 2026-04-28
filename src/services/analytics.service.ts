/**
 * Analytics Service — DWS IQ 6/7 (GTM Machine Phase 2b + 3 extension)
 *
 * Funnel analysis, conversion tracking, and cohort aggregation.
 * Queries gtm_event_log table for funnel visualization + drop-off analysis.
 *
 * Funnel surface: 14 steps
 *   ENTRY → [1] Bundle → [2] Discount → [3] €1 Pay → [4] Enterprise Form
 *         → [5] Upsell → [6] Accept → [7] Stripe → [8] Risto Alert
 *         → [9] Accounting → [10] Gaps Handled → [11] Onboarding
 *         → [12] Welcome + Portal → [13] ERP Connect
 *         → [14] Admin Role Designation
 *
 * Steps 2, 6, 8, 9, 10 are wired but their event emitters do not yet exist
 * in the codebase — they will return `completes: 0` until the corresponding
 * frontend / pipeline events are emitted. See PR description for the TODO list.
 *
 * Code-Version: 1.1
 * Introduced-In: PR-TBD (GTM Machine Phase 3 — funnel completion to 14 steps)
 * Branch: claude/charming-brown-6cd96f
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
  vertical?: string;
  company_size?: string;
  region?: string;
  days?: number;
}

/**
 * Step descriptor — drives the supabase query for each funnel stage.
 *
 * `eventTypes` matches gtm_event_log.event_type via .in() (one or more event names).
 * `propertyMatch` is an optional JSON-path LIKE filter applied to the `properties` column.
 *   shape: { path: 'template', op: 'like', value: 'license%' }
 * `notImplemented` flags steps whose emitter does not exist yet — they return 0.
 */
interface StepDescriptor {
  step: number;
  label: string;
  eventTypes?: string[];
  propertyMatch?: { path: string; op: 'eq' | 'like'; value: string };
  notImplemented?: boolean;
}

const FUNNEL_STEPS: StepDescriptor[] = [
  {
    step: 1,
    label: 'Bundle',
    eventTypes: ['page_view'],
    propertyMatch: { path: 'page_type', op: 'eq', value: 'store' },
  },
  {
    step: 2,
    label: 'Discount',
    eventTypes: ['discount_applied'],
  },
  {
    step: 3,
    label: '€1 Pay',
    eventTypes: ['begin_checkout'],
  },
  {
    step: 4,
    label: 'Enterprise Form',
    eventTypes: ['form_submitted'],
  },
  {
    step: 5,
    label: 'Upsell',
    eventTypes: ['upsell_recommendation_shown'],
  },
  {
    step: 6,
    label: 'Accept',
    eventTypes: ['order_accepted'],
  },
  {
    step: 7,
    label: 'Stripe',
    eventTypes: ['purchase'],
  },
  {
    step: 8,
    label: 'Risto Alert',
    eventTypes: ['risto_alert_sent'],
  },
  {
    step: 9,
    label: 'Accounting',
    eventTypes: ['accounting_handover'],
  },
  {
    step: 10,
    label: 'Gaps Handled',
    eventTypes: ['gap_resolved'],
  },
  {
    step: 11,
    label: 'Onboarding',
    eventTypes: ['email_sent', 'sent'],
    propertyMatch: { path: 'template', op: 'like', value: 'license%' },
  },
  {
    step: 12,
    label: 'Welcome + Portal',
    eventTypes: ['email_opened', 'opened'],
    propertyMatch: { path: 'template', op: 'like', value: 'welcome%' },
  },
  {
    step: 13,
    label: 'ERP Connect',
    eventTypes: ['erp_sync_activated'],
  },
  {
    step: 14,
    label: 'Admin Role Designation',
    eventTypes: ['admin_role_admin_designated', 'admin_role_admin_auto_promoted'],
  },
];

class AnalyticsService {
  /**
   * Count gtm_event_log rows matching a step descriptor since `since`.
   * Returns 0 for `notImplemented` steps so the funnel surface stays complete.
   */
  private async countStep(step: StepDescriptor, since: string): Promise<number> {
    if (step.notImplemented) return 0;
    if (!step.eventTypes || step.eventTypes.length === 0) return 0;

    let query = supabase
      .from('gtm_event_log')
      .select('id', { count: 'exact', head: true })
      .gte('timestamp', since)
      .in('event_type', step.eventTypes);

    if (step.propertyMatch) {
      const jsonPath = `properties->>${step.propertyMatch.path}`;
      if (step.propertyMatch.op === 'eq') {
        query = query.eq(jsonPath, step.propertyMatch.value);
      } else {
        query = query.like(jsonPath, step.propertyMatch.value);
      }
    }

    const { count, error } = await query;
    if (error) {
      logger.warn('Funnel count error', { step: step.step, error: error.message });
      return 0;
    }
    return count ?? 0;
  }

  /**
   * Get full 14-step funnel with conversion rates.
   *
   * `enters` = previous step's `completes` (or this step's count for step 1).
   * `conversion_rate` = completes / enters.
   */
  async getFunnel(filter: CohortFilter = {}): Promise<FunnelMetrics> {
    try {
      const daysBack = filter.days || 30;
      const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      const counts = await Promise.all(FUNNEL_STEPS.map((s) => this.countStep(s, since)));

      const funnel: FunnelStep[] = FUNNEL_STEPS.map((stepDef, idx) => {
        const completes = counts[idx];
        const enters = idx === 0 ? completes : counts[idx - 1];
        const dropOff = Math.max(0, enters - completes);
        const conversionRate = enters > 0 ? completes / enters : 0;
        return {
          step: stepDef.step,
          label: stepDef.label,
          enters,
          completes,
          drop_off: dropOff,
          conversion_rate: conversionRate,
        };
      });

      // Revenue metrics — sum of `revenue_eur` property on `purchase` events
      const { data: purchases } = await supabase
        .from('gtm_event_log')
        .select('properties')
        .eq('event_type', 'purchase')
        .gte('timestamp', since);

      const totalRevenue = (purchases || []).reduce((sum, p) => {
        const revenue = (p.properties as { revenue_eur?: number } | null)?.revenue_eur || 0;
        return sum + revenue;
      }, 0);

      const aov = purchases && purchases.length > 0 ? totalRevenue / purchases.length : 0;
      const totalEntries = funnel[0]?.enters || 0;
      const lastStep = funnel[funnel.length - 1];
      const completionRate = totalEntries > 0 ? (lastStep?.completes || 0) / totalEntries : 0;

      // Email engagement (Step 4 focus)
      const [opensRes, clicksRes] = await Promise.all([
        supabase
          .from('gtm_event_log')
          .select('id', { count: 'exact', head: true })
          .in('event_type', ['email_opened', 'opened'])
          .gte('timestamp', since),
        supabase
          .from('gtm_event_log')
          .select('id', { count: 'exact', head: true })
          .in('event_type', ['email_clicked', 'clicked'])
          .gte('timestamp', since),
      ]);

      const step4 = funnel.find((f) => f.step === 4);
      const step4Enters = step4?.enters || 0;
      const step4Opens = step4Enters > 0 ? (opensRes.count ?? 0) / step4Enters : 0;
      const step4Clicks = step4Enters > 0 ? (clicksRes.count ?? 0) / step4Enters : 0;

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
          form_starts: step4Enters > 0 ? (step4?.completes || 0) / step4Enters : 0,
          form_completes: step4?.conversion_rate || 0,
        },
      };
    } catch (err) {
      logger.error('getFunnel error', { error: String(err) });
      throw err;
    }
  }

  /**
   * Get drop-off analysis for a specific funnel step (Step 4 form errors today).
   */
  async getDropoff(step: number, days: number = 30): Promise<unknown> {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      if (step === 4) {
        const { data: errors } = await supabase
          .from('gtm_event_log')
          .select('properties')
          .eq('event_type', 'form_validation_error')
          .gte('timestamp', since);

        const errorsByField: Record<string, number> = {};
        (errors || []).forEach((e) => {
          const field = (e.properties as { field_name?: string } | null)?.field_name || 'unknown';
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
          drop_off_pct: step4 && step4.enters > 0 ? step4.drop_off / step4.enters : 0,
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
   * Get cohort metrics (vertical, company size, region).
   */
  async getCohortMetrics(cohort: CohortFilter = {}): Promise<unknown> {
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
