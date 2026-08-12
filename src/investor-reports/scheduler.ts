/**
 * Investor Reporting - Scheduler
 * Automated monthly report generation and delivery
 *
 * Schedule:
 * - Monthly reports: Last day of month at 18:00
 * - Quarterly reports: Last day of quarter at 18:00
 * - Revenue recognition calculation: 1st day of month at 02:00
 */

import * as cron from 'node-cron';
import { reportService } from './report-service';
import { metricsService } from './metrics-calculation';
import { createClient } from '@supabase/supabase-js';
import emailService from '../services/email.service.js';

// ============================================================================
// SCHEDULER
// ============================================================================

export class InvestorReportsScheduler {
  private monthlyReportJob: cron.ScheduledTask | null = null;
  private revenueCalculationJob: cron.ScheduledTask | null = null;
  private supabase: any;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  /**
   * Start the scheduler
   */
  start(): void {
    console.log('🚀 Starting Investor Reports Scheduler...');

    // Revenue recognition calculation - 1st of month at 02:00
    this.revenueCalculationJob = cron.schedule('0 2 1 * *', async () => {
      console.log('⏰ Running monthly revenue recognition calculation...');
      try {
        await this.calculateMonthlyMetrics();
      } catch (error) {
        console.error('Error in revenue calculation job:', error);
      }
    });

    // Monthly report generation - Last day of month at 18:00
    // Cron: 0 18 28-31 * * (runs on days 28-31, checks if it's the last day)
    this.monthlyReportJob = cron.schedule('0 18 28-31 * *', async () => {
      if (!this.isLastDayOfMonth()) {
        console.log('⏭️  Not last day of month, skipping monthly report');
        return;
      }

      console.log('⏰ Running monthly investor report job...');
      try {
        await this.generateAndSendMonthlyReport();
      } catch (error) {
        console.error('Error in monthly report job:', error);
      }
    });

    console.log('✅ Investor Reports Scheduler started');
    console.log('  - Revenue calculation: 1st of month at 02:00');
    console.log('  - Monthly reports: Last day of month at 18:00');
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    console.log('🛑 Stopping Investor Reports Scheduler...');

    if (this.revenueCalculationJob) {
      this.revenueCalculationJob.stop();
    }

    if (this.monthlyReportJob) {
      this.monthlyReportJob.stop();
    }

    console.log('✅ Investor Reports Scheduler stopped');
  }

  /**
   * Run jobs manually (for testing)
   */
  async runManually(job: 'monthly-report' | 'revenue-calculation' | 'all'): Promise<void> {
    console.log(`🔧 Running manual job: ${job}`);

    try {
      switch (job) {
        case 'monthly-report':
          await this.generateAndSendMonthlyReport();
          break;
        case 'revenue-calculation':
          await this.calculateMonthlyMetrics();
          break;
        case 'all':
          await this.calculateMonthlyMetrics();
          await this.generateAndSendMonthlyReport();
          break;
      }
      console.log('✅ Manual job completed');
    } catch (error) {
      console.error('❌ Manual job failed:', error);
      throw error;
    }
  }

  // ==========================================================================
  // JOB IMPLEMENTATIONS
  // ==========================================================================

  /**
   * Calculate monthly revenue recognition metrics
   * Runs on 1st of each month to calculate previous month's metrics
   */
  private async calculateMonthlyMetrics(): Promise<void> {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    console.log(
      `📊 Calculating revenue metrics for ${previousMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}...`,
    );

    if (!this.supabase) {
      console.warn('⚠️  Supabase not configured, skipping revenue calculation');
      return;
    }

    try {
      // Call database function to calculate metrics
      const { error } = await this.supabase.rpc('calculate_monthly_metrics', {
        target_month: previousMonth.toISOString().split('T')[0],
      });

      if (error) {
        throw error;
      }

      console.log('✅ Revenue metrics calculated successfully');
    } catch (error) {
      console.error('❌ Error calculating revenue metrics:', error);
      throw error;
    }
  }

  /**
   * Generate and send monthly investor report
   * Runs on last day of each month
   */
  private async generateAndSendMonthlyReport(): Promise<void> {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    console.log(
      `📧 Generating monthly investor report for ${currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}...`,
    );

    try {
      // Generate report data
      const reportData = await reportService.generateMonthlyReport(currentMonth);

      // Generate PDF
      const pdfPath = await reportService.generatePDF(reportData);

      // Get recipients from environment variable
      const recipients = this.getReportRecipients();

      if (recipients.length === 0) {
        console.warn('⚠️  No recipients configured (INVESTOR_REPORT_RECIPIENTS env var)');
        console.log(`📄 Report generated: ${pdfPath}`);
        return;
      }

      // Send email
      await reportService.sendReportEmail(reportData, pdfPath, recipients);

      // Upload to Google Drive (optional)
      try {
        const driveUrl = await reportService.uploadToDrive(pdfPath);
        if (driveUrl) {
          console.log(`☁️  Uploaded to Google Drive: ${driveUrl}`);
        }
      } catch (driveError) {
        console.warn('⚠️  Failed to upload to Google Drive:', driveError);
      }

      console.log('✅ Monthly investor report sent successfully');
      console.log(`   Recipients: ${recipients.join(', ')}`);
      console.log(`   PDF: ${pdfPath}`);
    } catch (error) {
      console.error('❌ Error generating/sending monthly report:', error);
      throw error;
    }
  }

  /**
   * Generate quarterly report (manual trigger only)
   */
  async generateQuarterlyReport(quarterStart: Date): Promise<void> {
    console.log(`📧 Generating quarterly investor report...`);

    try {
      const reportData = await reportService.generateQuarterlyReport(quarterStart);
      const pdfPath = await reportService.generatePDF(reportData);

      const recipients = this.getReportRecipients();

      if (recipients.length > 0) {
        await reportService.sendReportEmail(reportData, pdfPath, recipients);
      }

      console.log('✅ Quarterly investor report generated');
      console.log(`   PDF: ${pdfPath}`);
    } catch (error) {
      console.error('❌ Error generating quarterly report:', error);
      throw error;
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Check if today is the last day of the month
   */
  private isLastDayOfMonth(): boolean {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow.getMonth() !== today.getMonth();
  }

  /**
   * Get report recipients from environment variable
   */
  private getReportRecipients(): string[] {
    const recipientsEnv = process.env.INVESTOR_REPORT_RECIPIENTS;

    if (!recipientsEnv) {
      return [];
    }

    return recipientsEnv
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
  }

  /**
   * Send alert if runway is low
   */
  async checkRunwayAlert(): Promise<void> {
    const cashMetrics = await metricsService.getCashMetrics();

    const thresholdMonths = parseFloat(process.env.RUNWAY_ALERT_THRESHOLD || '9');

    if (cashMetrics.runway_months < thresholdMonths) {
      console.warn(
        `⚠️  RUNWAY ALERT: ${cashMetrics.runway_months.toFixed(1)} months remaining (threshold: ${thresholdMonths})`,
      );

      const alertRecipient = process.env.ALERT_EMAIL_RECIPIENT || 'risto@lifetime.fi';
      await emailService.sendNotificationEmail(
        alertRecipient,
        `RUNWAY ALERT: ${cashMetrics.runway_months.toFixed(1)} months remaining`,
        `Cash runway is below the ${thresholdMonths}-month threshold. Current runway: ${cashMetrics.runway_months.toFixed(1)} months. Immediate attention required.`,
      );
    }
  }

  /**
   * Send alert if churn rate is high
   */
  async checkChurnAlert(): Promise<void> {
    const customerMetrics = await metricsService.getCustomerMetrics();

    const thresholdPct = parseFloat(process.env.CHURN_ALERT_THRESHOLD || '10');

    if (customerMetrics.monthly_churn_rate > thresholdPct) {
      console.warn(
        `⚠️  CHURN ALERT: ${customerMetrics.monthly_churn_rate.toFixed(1)}% churn rate (threshold: ${thresholdPct}%)`,
      );

      const alertRecipient = process.env.ALERT_EMAIL_RECIPIENT || 'risto@lifetime.fi';
      await emailService.sendNotificationEmail(
        alertRecipient,
        `CHURN ALERT: ${customerMetrics.monthly_churn_rate.toFixed(1)}% monthly churn`,
        `Monthly churn rate has exceeded the ${thresholdPct}% threshold. Current rate: ${customerMetrics.monthly_churn_rate.toFixed(1)}%. Review customer retention strategy.`,
      );
    }
  }
}

// Export singleton instance
export const investorReportsScheduler = new InvestorReportsScheduler();
