/**
 * Investor Reporting - Metrics Calculation Engine
 * MRR, ARR, Runway, Churn, Pipeline Analytics
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  MRRMetrics,
  ARRMetrics,
  CustomerMetrics,
  PipelineMetrics,
  CashMetrics,
  UnitEconomics,
  MonthlyMetricsSummary,
  CurrentMRRByCustomer,
} from './types';

// ============================================================================
// METRICS SERVICE
// ============================================================================

export class MetricsCalculationService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ==========================================================================
  // MRR METRICS
  // ==========================================================================

  async getMRRMetrics(targetMonth?: Date): Promise<MRRMetrics> {
    const month = targetMonth || this.getFirstDayOfMonth(new Date());
    const previousMonth = this.getPreviousMonth(month);

    // Get current month metrics
    const { data: currentData, error: currentError } = await this.supabase
      .from('revenue_recognition')
      .select('*')
      .eq('month', month.toISOString().split('T')[0])
      .single();

    if (currentError && currentError.code !== 'PGRST116') {
      console.error('Error fetching current MRR:', currentError);
    }

    // Get previous month metrics
    const { data: previousData, error: previousError } = await this.supabase
      .from('revenue_recognition')
      .select('*')
      .eq('month', previousMonth.toISOString().split('T')[0])
      .single();

    if (previousError && previousError.code !== 'PGRST116') {
      console.error('Error fetching previous MRR:', previousError);
    }

    const currentMRR = currentData?.mrr || 0;
    const previousMRR = previousData?.mrr || 0;
    const mrrGrowth = currentMRR - previousMRR;
    const mrrGrowthRate = previousMRR > 0 ? (mrrGrowth / previousMRR) * 100 : 0;

    return {
      current_mrr: currentMRR,
      previous_month_mrr: previousMRR,
      mrr_growth: mrrGrowth,
      mrr_growth_rate: mrrGrowthRate,
      new_mrr: currentData?.new_mrr || 0,
      expansion_mrr: currentData?.expansion_mrr || 0,
      contraction_mrr: currentData?.contraction_mrr || 0,
      churned_mrr: currentData?.churned_mrr || 0,
      net_new_mrr:
        (currentData?.new_mrr || 0) +
        (currentData?.expansion_mrr || 0) -
        (currentData?.churned_mrr || 0),
    };
  }

  // ==========================================================================
  // ARR METRICS
  // ==========================================================================

  async getARRMetrics(targetMonth?: Date): Promise<ARRMetrics> {
    const month = targetMonth || this.getFirstDayOfMonth(new Date());
    const previousQuarterMonth = this.getPreviousQuarter(month);

    // Get current month ARR
    const { data: currentData } = await this.supabase
      .from('revenue_recognition')
      .select('arr')
      .eq('month', month.toISOString().split('T')[0])
      .single();

    // Get previous quarter ARR
    const { data: previousData } = await this.supabase
      .from('revenue_recognition')
      .select('arr')
      .eq('month', previousQuarterMonth.toISOString().split('T')[0])
      .single();

    const currentARR = currentData?.arr || 0;
    const previousARR = previousData?.arr || 0;
    const arrGrowth = currentARR - previousARR;
    const arrGrowthRate = previousARR > 0 ? (arrGrowth / previousARR) * 100 : 0;

    return {
      current_arr: currentARR,
      previous_quarter_arr: previousARR,
      arr_growth: arrGrowth,
      arr_growth_rate: arrGrowthRate,
    };
  }

  // ==========================================================================
  // CUSTOMER METRICS
  // ==========================================================================

  async getCustomerMetrics(targetMonth?: Date): Promise<CustomerMetrics> {
    const month = targetMonth || this.getFirstDayOfMonth(new Date());

    // Get current month customer data
    const { data: revenueData } = await this.supabase
      .from('revenue_recognition')
      .select('*')
      .eq('month', month.toISOString().split('T')[0])
      .single();

    // Get total customers by status
    const { data: statusCounts } = await this.supabase.from('customers').select('status');

    const total = statusCounts?.length || 0;
    const active =
      statusCounts?.filter((c) => ['active', 'trial', 'expansion'].includes(c.status)).length || 0;
    const trial = statusCounts?.filter((c) => c.status === 'trial').length || 0;
    const churned = statusCounts?.filter((c) => c.status === 'churned').length || 0;

    const monthlyChurnCount = revenueData?.churned_customers || 0;
    const churnRate = revenueData?.churn_rate || 0;
    const retentionRate = 100 - churnRate;

    // Calculate average customer lifetime (simplified)
    const avgLifetime = churnRate > 0 ? 1 / (churnRate / 100) : 0;

    return {
      total_customers: total,
      active_customers: active,
      trial_customers: trial,
      churned_customers: churned,
      monthly_churn_count: monthlyChurnCount,
      monthly_churn_rate: churnRate,
      retention_rate: retentionRate,
      customer_lifetime_months: avgLifetime,
    };
  }

  // ==========================================================================
  // PIPELINE METRICS (from Firehorse)
  // ==========================================================================

  async getPipelineMetrics(): Promise<PipelineMetrics> {
    // Get sales pipeline data from Firehorse
    const { data: pipelineData } = await this.supabase.from('firehorse_sales_pipeline').select('*');

    if (!pipelineData) {
      return this.getEmptyPipelineMetrics();
    }

    const leadsCount = pipelineData.filter((l) =>
      [
        'New',
        'Cold_1_Sent',
        'Cold_1_Opened',
        'Cold_1_Clicked',
        'Cold_2_Sent',
        'Cold_3_Sent',
      ].includes(l.lead_state),
    ).length;

    const meetingsCount = pipelineData.filter(
      (l) => l.lead_state === 'Meeting_Booked' || l.meetings_count > 0,
    ).length;

    const proposalsCount = pipelineData.filter((l) => l.proposals_count > 0).length;

    // Closed won = customers that came from Firehorse
    const { data: closedWon } = await this.supabase
      .from('customers')
      .select('*')
      .not('firehorse_lead_id', 'is', null);

    const closedWonCount = closedWon?.length || 0;

    // Calculate pipeline value (simplified - using revenue_eur_million from leads)
    const totalPipelineValue = pipelineData.reduce((sum, lead) => {
      return sum + (lead.revenue_eur_million || 0) * 1000000; // Convert to EUR
    }, 0);

    const qualifiedPipelineValue = pipelineData
      .filter((l) => ['Engaged', 'Meeting_Booked'].includes(l.lead_state) || l.meetings_count > 0)
      .reduce((sum, lead) => sum + (lead.revenue_eur_million || 0) * 1000000, 0);

    // Weighted pipeline (20% for engaged, 40% for meeting, 70% for proposal)
    const weightedPipelineValue = pipelineData.reduce((sum, lead) => {
      const value = (lead.revenue_eur_million || 0) * 1000000;
      let weight = 0.1;
      if (lead.proposals_count > 0) weight = 0.7;
      else if (lead.meetings_count > 0) weight = 0.4;
      else if (lead.lead_state === 'Engaged') weight = 0.2;
      return sum + value * weight;
    }, 0);

    // Conversion rates
    const meetingConversionRate = leadsCount > 0 ? (meetingsCount / leadsCount) * 100 : 0;
    const proposalConversionRate = meetingsCount > 0 ? (proposalsCount / meetingsCount) * 100 : 0;
    const winRate = proposalsCount > 0 ? (closedWonCount / proposalsCount) * 100 : 0;

    return {
      total_pipeline_value: totalPipelineValue,
      qualified_pipeline_value: qualifiedPipelineValue,
      weighted_pipeline_value: weightedPipelineValue,
      leads_count: leadsCount,
      meetings_count: meetingsCount,
      proposals_count: proposalsCount,
      closed_won_count: closedWonCount,
      meeting_conversion_rate: meetingConversionRate,
      proposal_conversion_rate: proposalConversionRate,
      win_rate: winRate,
    };
  }

  // ==========================================================================
  // CASH & RUNWAY METRICS
  // ==========================================================================

  async getCashMetrics(targetMonth?: Date): Promise<CashMetrics> {
    const month = targetMonth || this.getFirstDayOfMonth(new Date());
    const previousMonth = this.getPreviousMonth(month);

    // Get current month runway data
    const { data: currentData } = await this.supabase
      .from('runway_tracking')
      .select('*')
      .eq('month', month.toISOString().split('T')[0])
      .single();

    // Get previous month
    const { data: previousData } = await this.supabase
      .from('runway_tracking')
      .select('*')
      .eq('month', previousMonth.toISOString().split('T')[0])
      .single();

    const currentCash = currentData?.cash_balance || 0;
    const previousCash = previousData?.cash_balance || 0;
    const cashChange = currentCash - previousCash;

    // Get 3-month and 6-month average burn
    const threeMonthsAgo = this.getMonthsAgo(month, 3);
    const sixMonthsAgo = this.getMonthsAgo(month, 6);

    const { data: last3Months } = await this.supabase
      .from('runway_tracking')
      .select('net_burn')
      .gte('month', threeMonthsAgo.toISOString().split('T')[0])
      .lte('month', month.toISOString().split('T')[0]);

    const { data: last6Months } = await this.supabase
      .from('runway_tracking')
      .select('net_burn')
      .gte('month', sixMonthsAgo.toISOString().split('T')[0])
      .lte('month', month.toISOString().split('T')[0]);

    const avg3mBurn =
      last3Months && last3Months.length > 0
        ? last3Months.reduce((sum, m) => sum + (m.net_burn || 0), 0) / last3Months.length
        : currentData?.net_burn || 0;

    const avg6mBurn =
      last6Months && last6Months.length > 0
        ? last6Months.reduce((sum, m) => sum + (m.net_burn || 0), 0) / last6Months.length
        : currentData?.net_burn || 0;

    const runwayMonths = currentData?.runway_months || 0;
    const runwayDate = this.addMonths(month, runwayMonths);

    return {
      current_cash: currentCash,
      previous_month_cash: previousCash,
      cash_change: cashChange,
      monthly_burn_rate: currentData?.net_burn || 0,
      average_burn_rate_3m: avg3mBurn,
      average_burn_rate_6m: avg6mBurn,
      runway_months: runwayMonths,
      runway_date: runwayDate,
    };
  }

  // ==========================================================================
  // UNIT ECONOMICS
  // ==========================================================================

  async getUnitEconomics(): Promise<UnitEconomics> {
    // Get active customers with LTV
    const { data: customers } = await this.supabase
      .from('customers')
      .select('current_mrr, lifetime_value, created_at')
      .in('status', ['active', 'trial', 'expansion']);

    if (!customers || customers.length === 0) {
      return {
        cac: 0,
        ltv: 0,
        ltv_cac_ratio: 0,
        payback_months: 0,
        arpu: 0,
        arpa: 0,
      };
    }

    // Calculate ARPU and ARPA
    const totalMRR = customers.reduce((sum, c) => sum + (c.current_mrr || 0), 0);
    const arpu = totalMRR / customers.length;
    const arpa = arpu; // Same for now (no differentiation between users/accounts)

    // Calculate average LTV
    const avgLTV =
      customers.reduce((sum, c) => sum + (c.lifetime_value || 0), 0) / customers.length;

    // CAC estimation — attempt to fetch marketing/sales expenses from transactions
    let estimatedCAC = 1000; // Fallback if no transaction data available
    try {
      const { data: expenses } = await this.supabase
        .from('transactions')
        .select('amount')
        .in('category', ['marketing', 'sales', 'advertising'])
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      if (expenses && expenses.length > 0) {
        const totalSpend = expenses.reduce(
          (sum: number, e: any) => sum + Math.abs(e.amount || 0),
          0,
        );
        const monthlySpend = totalSpend / 3; // 90-day window → monthly average
        const newCustomersPerMonth =
          customers.filter(
            (c) => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          ).length || 1;
        estimatedCAC = Math.round(monthlySpend / newCustomersPerMonth);
      }
    } catch {
      // Transactions table may not exist yet — use fallback
    }

    const ltvCacRatio = estimatedCAC > 0 ? avgLTV / estimatedCAC : 0;
    const paybackMonths = arpu > 0 ? estimatedCAC / arpu : 0;

    return {
      cac: estimatedCAC,
      ltv: avgLTV,
      ltv_cac_ratio: ltvCacRatio,
      payback_months: paybackMonths,
      arpu: arpu,
      arpa: arpa,
    };
  }

  // ==========================================================================
  // HISTORICAL DATA
  // ==========================================================================

  async getHistoricalMRR(months: number = 12): Promise<Array<{ month: Date; value: number }>> {
    const startMonth = this.getMonthsAgo(new Date(), months);

    const { data } = await this.supabase
      .from('revenue_recognition')
      .select('month, mrr')
      .gte('month', startMonth.toISOString().split('T')[0])
      .order('month', { ascending: true });

    return (data || []).map((d) => ({
      month: new Date(d.month),
      value: d.mrr,
    }));
  }

  async getHistoricalARR(months: number = 12): Promise<Array<{ month: Date; value: number }>> {
    const startMonth = this.getMonthsAgo(new Date(), months);

    const { data } = await this.supabase
      .from('revenue_recognition')
      .select('month, arr')
      .gte('month', startMonth.toISOString().split('T')[0])
      .order('month', { ascending: true });

    return (data || []).map((d) => ({
      month: new Date(d.month),
      value: d.arr,
    }));
  }

  async getHistoricalCustomers(
    months: number = 12,
  ): Promise<Array<{ month: Date; count: number }>> {
    const startMonth = this.getMonthsAgo(new Date(), months);

    const { data } = await this.supabase
      .from('revenue_recognition')
      .select('month, active_customers')
      .gte('month', startMonth.toISOString().split('T')[0])
      .order('month', { ascending: true });

    return (data || []).map((d) => ({
      month: new Date(d.month),
      count: d.active_customers,
    }));
  }

  async getHistoricalCash(months: number = 12): Promise<Array<{ month: Date; balance: number }>> {
    const startMonth = this.getMonthsAgo(new Date(), months);

    const { data } = await this.supabase
      .from('runway_tracking')
      .select('month, cash_balance')
      .gte('month', startMonth.toISOString().split('T')[0])
      .order('month', { ascending: true });

    return (data || []).map((d) => ({
      month: new Date(d.month),
      balance: d.cash_balance,
    }));
  }

  // ==========================================================================
  // VIEWS (Database Views)
  // ==========================================================================

  async getCurrentMRRByCustomer(): Promise<CurrentMRRByCustomer[]> {
    const { data, error } = await this.supabase
      .from('current_mrr_by_customer')
      .select('*')
      .order('current_mrr', { ascending: false });

    if (error) {
      console.error('Error fetching MRR by customer:', error);
      return [];
    }

    return data as CurrentMRRByCustomer[];
  }

  async getMonthlyMetricsSummary(limit: number = 12): Promise<MonthlyMetricsSummary[]> {
    const { data, error } = await this.supabase
      .from('monthly_metrics_summary')
      .select('*')
      .limit(limit);

    if (error) {
      console.error('Error fetching monthly metrics summary:', error);
      return [];
    }

    return data as MonthlyMetricsSummary[];
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  private getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private getPreviousMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  }

  private getPreviousQuarter(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() - 3, 1);
  }

  private getMonthsAgo(date: Date, months: number): Date {
    return new Date(date.getFullYear(), date.getMonth() - months, 1);
  }

  private addMonths(date: Date, months: number): Date {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
  }

  private getEmptyPipelineMetrics(): PipelineMetrics {
    return {
      total_pipeline_value: 0,
      qualified_pipeline_value: 0,
      weighted_pipeline_value: 0,
      leads_count: 0,
      meetings_count: 0,
      proposals_count: 0,
      closed_won_count: 0,
      meeting_conversion_rate: 0,
      proposal_conversion_rate: 0,
      win_rate: 0,
    };
  }
}

// Export singleton instance
export const metricsService = new MetricsCalculationService();
