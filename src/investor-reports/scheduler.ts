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
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import emailService from '../services/email.service.js';
import logger from '../utils/logger.js';

// ============================================================================
// SCHEDULER
// ============================================================================

export class InvestorReportsScheduler {
  private monthlyReportJob: cron.ScheduledTask | null = null;
  private revenueCalculationJob: cron.ScheduledTask | null = null;
  private supabase: SupabaseClient | null = null;

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
    logger.info('🚀 Starting Investor Reports Scheduler...');

    // Revenue recognition calculation - 1st of month at 02:00
    this.revenueCalculationJob = cron.schedule('0 2 1 * *', async () => {
      logger.info('⏰ Running monthly revenue recognition calculation...');
      try {
        await this.calculateMonthlyMetrics();
      } catch (error) {
        logger.error('Error in revenue calculation job:', error);
      }
    });

    // Monthly report generation - Last day of month at 18:00
    // Cron: 0 18 28-31 * * (runs on days 28-31, checks if it's the last day)
    this.monthlyReportJob = cron.schedule('0 18 28-31 * *', async () => {
      if (!this.isLastDayOfMonth()) {
        logger.info('⏭️  Not last day of month, skipping monthly report');
        return;
      }

      logger.info('⏰ Running monthly investor report job...');
      try {
        await this.generateAndSendMonthlyReport();
      } catch (error) {
        logger.error('Error in monthly report job:', error);
      }
    });

    logger.info('✅ Investor Reports Scheduler started');
    logger.info('  - Revenue calculation: 1st of month at 02:00');
    logger.info('  - Monthly reports: Last day of month at 18:00');
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    logger.info('🛑 Stopping Investor Reports Scheduler...');

    if (this.revenueCalculationJob) {
      this.revenueCalculationJob.stop();
    }

    if (this.monthlyReportJob) {
      this.monthlyReportJob.stop();
    }

    logger.info('✅ Investor Reports Scheduler stopped');
  }

  /**
   * Run jobs manually (for testing)
   */
  async runManually(job: 'monthly-report' | 'revenue-calculation' | 'all'): Promise<void> {
    logger.info(`🔧 Running manual job: ${job}`);

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
      logger.info('✅ Manual job completed');
    } catch (error) {
      logger.error('❌ Manual job failed:', error);
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

    logger.info(
      `📊 Calculating revenue metrics for ${previousMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}...`,
    );

    if (!this.supabase) {
      logger.warn('⚠️  Supabase not configured, skipping revenue calculation');
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

      logger.info('✅ Revenue metrics calculated successfully');
    } catch (error) {
      logger.error('❌ Error calculating revenue metrics:', error);
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

    logger.info(
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
        logger.warn('⚠️  No recipients configured (INVESTOR_REPORT_RECIPIENTS env var)');
        logger.info(`📄 Report generated: ${pdfPath}`);
        return;
      }

      // Send email
      await reportService.sendReportEmail(reportData, pdfPath, recipients);

      // Upload to Google Drive (optional)
      try {
        const driveUrl = await reportService.uploadToDrive(pdfPath);
        if (driveUrl) {
          logger.info(`☁️  Uploaded to Google Drive: ${driveUrl}`);
        }
      } catch (driveError) {
        logger.warn('⚠️  Failed to upload to Google Drive:', driveError);
      }

      logger.info('✅ Monthly investor report sent successfully');
      logger.info(`   Recipients: ${recipients.join(', ')}`);
      logger.info(`   PDF: ${pdfPath}`);
    } catch (error) {
      logger.error('❌ Error generating/sending monthly report:', error);
      throw error;
    }
  }

  /**
   * Generate quarterly report (manual trigger only)
   */
  async generateQuarterlyReport(quarterStart: Date): Promise<void> {
    logger.info(`📧 Generating quarterly investor report...`);

    try {
      const reportData = await reportService.generateQuarterlyReport(quarterStart);
      const pdfPath = await reportService.generatePDF(reportData);

      const recipients = this.getReportRecipients();

      if (recipients.length > 0) {
        await reportService.sendReportEmail(reportData, pdfPath, recipients);
      }

      logger.info('✅ Quarterly investor report generated');
      logger.info(`   PDF: ${pdfPath}`);
    } catch (error) {
      logger.error('❌ Error generating quarterly report:', error);
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
      logger.warn(
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
      logger.warn(
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
