/**
 * Investor Reporting - Report Generation Service
 * Aggregates metrics, generates reports, handles PDF/email delivery
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { metricsService } from './metrics-calculation';
import { InvestorReportData, ReportPeriod, KeyEvent } from './types';

// ============================================================================
// REPORT SERVICE
// ============================================================================

export class ReportService {
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
  // REPORT GENERATION
  // ==========================================================================

  /**
   * Generate complete monthly investor report
   */
  async generateMonthlyReport(targetMonth: Date): Promise<InvestorReportData> {
    const reportPeriod = this.getFirstDayOfMonth(targetMonth);

    // Fetch all metrics in parallel
    const [
      mrrMetrics,
      arrMetrics,
      customerMetrics,
      pipelineMetrics,
      cashMetrics,
      unitEconomics,
      historicalMRR,
      historicalARR,
      historicalCustomers,
      historicalCash,
      keyWins,
      keyLosses,
      keyMilestones,
    ] = await Promise.all([
      metricsService.getMRRMetrics(targetMonth),
      metricsService.getARRMetrics(targetMonth),
      metricsService.getCustomerMetrics(targetMonth),
      metricsService.getPipelineMetrics(),
      metricsService.getCashMetrics(targetMonth),
      metricsService.getUnitEconomics(),
      metricsService.getHistoricalMRR(12),
      metricsService.getHistoricalARR(12),
      metricsService.getHistoricalCustomers(12),
      metricsService.getHistoricalCash(12),
      this.getKeyWins(targetMonth),
      this.getKeyLosses(targetMonth),
      this.getKeyMilestones(targetMonth),
    ]);

    // Generate narrative content
    const founderLetter = this.generateFounderLetter({
      mrrMetrics,
      arrMetrics,
      customerMetrics,
      pipelineMetrics,
      cashMetrics,
      keyWins,
    });

    const executiveSummary = this.generateExecutiveSummary({
      mrrMetrics,
      arrMetrics,
      customerMetrics,
      cashMetrics,
    });

    const outlook = this.generateOutlook({
      pipelineMetrics,
      cashMetrics,
    });

    const reportData: InvestorReportData = {
      report_period: reportPeriod,
      report_type: ReportPeriod.Monthly,
      generated_at: new Date(),
      mrr_metrics: mrrMetrics,
      arr_metrics: arrMetrics,
      customer_metrics: customerMetrics,
      pipeline_metrics: pipelineMetrics,
      cash_metrics: cashMetrics,
      unit_economics: unitEconomics,
      historical_mrr: historicalMRR,
      historical_arr: historicalARR,
      historical_customers: historicalCustomers,
      historical_cash: historicalCash,
      key_wins: keyWins,
      key_losses: keyLosses,
      key_milestones: keyMilestones,
      founder_letter: founderLetter,
      executive_summary: executiveSummary,
      outlook: outlook,
    };

    return reportData;
  }

  /**
   * Generate quarterly investor report (aggregates 3 months)
   */
  async generateQuarterlyReport(quarterStart: Date): Promise<InvestorReportData> {
    // For now, use the last month of the quarter
    const quarterEnd = new Date(quarterStart);
    quarterEnd.setMonth(quarterEnd.getMonth() + 2);

    const reportData = await this.generateMonthlyReport(quarterEnd);
    reportData.report_type = ReportPeriod.Quarterly;

    return reportData;
  }

  // ==========================================================================
  // KEY EVENTS (Wins, Losses, Milestones)
  // ==========================================================================

  /**
   * Get key wins for the month (new customers, deals closed)
   */
  async getKeyWins(targetMonth: Date): Promise<KeyEvent[]> {
    const monthStart = this.getFirstDayOfMonth(targetMonth);
    const monthEnd = this.getLastDayOfMonth(targetMonth);

    // Get new customers signed this month
    const { data: newCustomers } = await this.supabase
      .from('customers')
      .select('name, current_mrr, contract_start_date')
      .gte('contract_start_date', monthStart.toISOString().split('T')[0])
      .lte('contract_start_date', monthEnd.toISOString().split('T')[0])
      .order('current_mrr', { ascending: false });

    const wins: KeyEvent[] = (newCustomers || []).map((customer) => ({
      date: new Date(customer.contract_start_date),
      title: `New customer: ${customer.name}`,
      description: `Signed contract worth €${customer.current_mrr}/month`,
      impact: `+€${customer.current_mrr} MRR`,
      category: 'customer' as const,
    }));

    // Get signed contracts this month
    const { data: signedContracts } = await this.supabase
      .from('contracts')
      .select('title, total_value, signed_date, customer_id, customers(name)')
      .gte('signed_date', monthStart.toISOString().split('T')[0])
      .lte('signed_date', monthEnd.toISOString().split('T')[0])
      .order('total_value', { ascending: false });

    const contractWins: KeyEvent[] = (signedContracts || []).map((contract) => ({
      date: new Date(contract.signed_date),
      title: `Contract signed: ${contract.title}`,
      description: `${(contract.customers as any)?.name || 'Customer'} signed for €${contract.total_value}`,
      impact: `€${contract.total_value} TCV`,
      category: 'customer' as const,
    }));

    return [...wins, ...contractWins].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Get key losses for the month (churned customers)
   */
  async getKeyLosses(targetMonth: Date): Promise<KeyEvent[]> {
    const monthStart = this.getFirstDayOfMonth(targetMonth);
    const monthEnd = this.getLastDayOfMonth(targetMonth);

    const { data: churnedCustomers } = await this.supabase
      .from('customers')
      .select('name, current_mrr, churned_at, notes')
      .gte('churned_at', monthStart.toISOString())
      .lte('churned_at', monthEnd.toISOString())
      .order('current_mrr', { ascending: false });

    const losses: KeyEvent[] = (churnedCustomers || []).map((customer) => ({
      date: new Date(customer.churned_at),
      title: `Customer churned: ${customer.name}`,
      description: customer.notes || 'No reason provided',
      impact: `-€${customer.current_mrr} MRR`,
      category: 'customer' as const,
    }));

    return losses;
  }

  /**
   * Get key milestones for the month (product launches, team hires, etc.)
   */
  async getKeyMilestones(targetMonth: Date): Promise<KeyEvent[]> {
    const milestones: KeyEvent[] = [];

    // Fetch milestones from key_events table if available
    try {
      const monthStart = this.getFirstDayOfMonth(targetMonth);
      const nextMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
      const { data: events } = await this.supabase
        .from('key_events')
        .select('*')
        .gte('event_date', monthStart.toISOString().split('T')[0])
        .lt('event_date', nextMonth.toISOString().split('T')[0])
        .order('event_date', { ascending: true });

      if (events) {
        milestones.push(
          ...events.map((e: any) => ({
            date: new Date(e.event_date),
            title: e.title || e.description,
            description: e.description,
            category: e.category || 'product',
            impact: e.impact,
          })),
        );
      }
    } catch {
      // key_events table may not exist yet — continue with auto-detected milestones
    }

    // Check if we crossed €10k MRR this month
    const monthStart = this.getFirstDayOfMonth(targetMonth);
    const { data: currentMonthRevenue } = await this.supabase
      .from('revenue_recognition')
      .select('mrr')
      .eq('month', monthStart.toISOString().split('T')[0])
      .single();

    const previousMonth = this.getPreviousMonth(monthStart);
    const { data: previousMonthRevenue } = await this.supabase
      .from('revenue_recognition')
      .select('mrr')
      .eq('month', previousMonth.toISOString().split('T')[0])
      .single();

    const currentMRR = currentMonthRevenue?.mrr || 0;
    const previousMRR = previousMonthRevenue?.mrr || 0;

    // €10k MRR milestone
    if (previousMRR < 10000 && currentMRR >= 10000) {
      milestones.push({
        date: monthStart,
        title: '€10k MRR milestone reached',
        description: 'Crossed €10k MRR for the first time',
        impact: '€10k MRR',
        category: 'product',
      });
    }

    // €20k MRR milestone
    if (previousMRR < 20000 && currentMRR >= 20000) {
      milestones.push({
        date: monthStart,
        title: '€20k MRR milestone reached',
        description: 'Crossed €20k MRR',
        impact: '€20k MRR',
        category: 'product',
      });
    }

    return milestones;
  }

  // ==========================================================================
  // NARRATIVE GENERATION
  // ==========================================================================

  /**
   * Generate founder letter (3-4 bullet points)
   */
  private generateFounderLetter(data: {
    mrrMetrics: any;
    arrMetrics: any;
    customerMetrics: any;
    pipelineMetrics: any;
    cashMetrics: any;
    keyWins: KeyEvent[];
  }): string {
    const { mrrMetrics, customerMetrics, pipelineMetrics, keyWins } = data;

    const sections: string[] = [];

    // MRR growth
    const mrrGrowthPct = mrrMetrics.mrr_growth_rate.toFixed(1);
    const mrrGrowthSign = mrrMetrics.mrr_growth >= 0 ? '+' : '';
    sections.push(
      `**Revenue:** MRR grew ${mrrGrowthSign}${mrrGrowthPct}% to €${mrrMetrics.current_mrr.toLocaleString()} (${mrrGrowthSign}€${Math.abs(mrrMetrics.mrr_growth).toLocaleString()} MoM)`,
    );

    // Customer growth
    if (customerMetrics.active_customers > 0) {
      sections.push(
        `**Customers:** ${customerMetrics.active_customers} active customers, ${customerMetrics.monthly_churn_rate.toFixed(1)}% churn rate, ${customerMetrics.retention_rate.toFixed(1)}% retention`,
      );
    }

    // Pipeline
    if (pipelineMetrics.total_pipeline_value > 0) {
      sections.push(
        `**Pipeline:** €${(pipelineMetrics.weighted_pipeline_value / 1000).toFixed(0)}k weighted pipeline value, ${pipelineMetrics.meetings_count} active meetings, ${pipelineMetrics.proposals_count} proposals out`,
      );
    }

    // Key wins
    if (keyWins.length > 0) {
      const topWin = keyWins[0];
      sections.push(`**Key Win:** ${topWin.title} - ${topWin.description}`);
    }

    return sections.join('\n\n');
  }

  /**
   * Generate executive summary (1-2 sentences)
   */
  private generateExecutiveSummary(data: {
    mrrMetrics: any;
    arrMetrics: any;
    customerMetrics: any;
    cashMetrics: any;
  }): string {
    const { mrrMetrics, customerMetrics, cashMetrics } = data;

    const mrrGrowth = mrrMetrics.mrr_growth >= 0 ? 'up' : 'down';
    const summary = `MRR is ${mrrGrowth} ${Math.abs(mrrMetrics.mrr_growth_rate).toFixed(1)}% MoM to €${mrrMetrics.current_mrr.toLocaleString()}, with ${customerMetrics.active_customers} active customers and ${cashMetrics.runway_months.toFixed(1)} months runway.`;

    return summary;
  }

  /**
   * Generate outlook (next 1-3 months)
   */
  private generateOutlook(data: { pipelineMetrics: any; cashMetrics: any }): string {
    const { pipelineMetrics, cashMetrics } = data;

    const sections: string[] = [];

    // Pipeline outlook
    if (pipelineMetrics.weighted_pipeline_value > 0) {
      const expectedClosingValue = pipelineMetrics.weighted_pipeline_value / 1000;
      sections.push(
        `Expected to close €${expectedClosingValue.toFixed(0)}k from current pipeline (weighted).`,
      );
    }

    // Runway outlook
    if (cashMetrics.runway_months < 12) {
      const runwayDate = cashMetrics.runway_date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      sections.push(
        `Current runway extends to ${runwayDate} (${cashMetrics.runway_months.toFixed(1)} months).`,
      );
    }

    return sections.join(' ');
  }

  // ==========================================================================
  // PDF GENERATION (stub - integration with existing Reports/ scripts)
  // ==========================================================================

  /**
   * Generate PDF from report data
   * Returns path to generated PDF
   */
  async generatePDF(reportData: InvestorReportData): Promise<string> {
    const { integrationWrapper } = await import('./integration-wrapper');
    return await integrationWrapper.generatePDF(reportData);
  }

  /**
   * Send report email to recipients
   */
  async sendReportEmail(
    reportData: InvestorReportData,
    pdfPath: string,
    recipients: string[],
  ): Promise<void> {
    const { integrationWrapper } = await import('./integration-wrapper');
    await integrationWrapper.sendEmail(reportData, pdfPath, recipients);
  }

  /**
   * Upload report to Google Drive
   */
  async uploadToDrive(pdfPath: string): Promise<string> {
    const { integrationWrapper } = await import('./integration-wrapper');
    return await integrationWrapper.uploadToDrive(pdfPath);
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  private getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  private getPreviousMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  }
}

// Export singleton instance
export const reportService = new ReportService();
