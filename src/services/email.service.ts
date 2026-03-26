/**
 * DWS IQ 6 - Email Service
 *
 * SECURITY: Resend SDK removed 2026-03-26 due to suspected account compromise.
 * All emails now use Amazon SES via SMTP only (src/utils/send-email.ts).
 *
 * Features:
 *   - SES via SMTP as the sole transport (nodemailer)
 *   - Structured logging via project logger
 *   - Supabase email_logs persistence (when configured)
 *   - HTML templates for all transactional email types
 *
 * Environment variables:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (for Amazon SES)
 *   EMAIL_FROM           - Sender address (default: risto@onelifetime.world)
 *   SUPABASE_URL         - Supabase project URL (for email logging)
 *   SUPABASE_SERVICE_KEY - Supabase service role key (for email logging)
 */

import { sendEmail as sendEmailUtil } from '../utils/send-email.js';
import logger from '../utils/logger.js';
import {
  welcomeTemplate,
  passwordResetTemplate,
  reportDeliveryTemplate,
  notificationTemplate,
  invoiceTemplate,
  captainPreBriefingTemplate,
  investorOutreachTemplate,
} from './email-templates.js';

// ============================================================
// TYPES
// ============================================================

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  /** Template type identifier for logging/tracking */
  templateType?: string;
  /** Arbitrary metadata stored alongside the email log */
  metadata?: Record<string, unknown>;
}

export interface BatchEmailItem {
  to: string;
  subject: string;
  html: string;
  templateType?: string;
}

type EmailStatus = 'sent' | 'failed' | 'pending' | 'delivered' | 'bounced' | 'complained';

interface EmailLogEntry {
  to_email: string;
  from_email: string;
  subject: string;
  template_type: string | null;
  status: EmailStatus;
  sent_at: string | null;
  error: string | null;
  metadata: Record<string, unknown> | null;
  transport?: string | null;
}

// ============================================================
// EMAIL SERVICE
// ============================================================

class EmailService {
  private readonly fromAddress: string;
  private readonly supabaseUrl: string | undefined;
  private readonly supabaseServiceKey: string | undefined;

  constructor() {
    this.fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    const hasSmtp = !!process.env.SMTP_HOST;
    if (!hasSmtp) {
      logger.warn(
        'No SMTP transport configured (SMTP_HOST). Emails will be logged but not delivered.'
      );
    } else {
      logger.info('Email service initialized', { transport: 'SES (SMTP)' });
    }
  }

  // ----------------------------------------------------------
  // PUBLIC METHODS
  // ----------------------------------------------------------

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Welcome to DWS IQ 6',
      html: welcomeTemplate(name),
      templateType: 'welcome',
      metadata: { name },
    });
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Reset Your Password - DWS IQ 6',
      html: passwordResetTemplate(resetLink),
      templateType: 'password_reset',
    });
  }

  async sendReportDeliveryEmail(
    to: string,
    reportName: string,
    downloadUrl: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Your Report Is Ready: ${reportName}`,
      html: reportDeliveryTemplate(reportName, downloadUrl),
      templateType: 'report_delivery',
      metadata: { reportName },
    });
  }

  async sendNotificationEmail(
    to: string,
    subject: string,
    body: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject,
      html: notificationTemplate(subject, body),
      templateType: 'notification',
    });
  }

  async sendCaptainPreBriefing(
    to: string,
    name: string,
    industry: string,
    seatLevel: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Your Captain Briefing Is Confirmed — ${industry}`,
      html: captainPreBriefingTemplate(name, industry, seatLevel),
      templateType: 'captain_pre_briefing',
      metadata: { name, industry, seatLevel },
    });
  }

  async sendInvestorOutreach(
    to: string,
    name: string,
    investorType: 'vc' | 'angel' | 'family_office' | 'operator',
    industry?: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'DWS IQ 6 — AI Compliance Platform for EU Industries',
      html: investorOutreachTemplate(name, investorType, industry),
      templateType: 'investor_outreach',
      metadata: { name, investorType, industry },
    });
  }

  async sendInvoiceEmail(
    to: string,
    invoiceId: string,
    amount: number,
    currency: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Invoice ${invoiceId} - DWS IQ 6`,
      html: invoiceTemplate(invoiceId, amount, currency),
      templateType: 'invoice',
      metadata: { invoiceId, amount, currency },
    });
  }

  /**
   * Send multiple emails sequentially via SES SMTP.
   * Returns empty array (batch IDs were Resend-specific, now removed).
   */
  async sendBatch(emails: BatchEmailItem[]): Promise<string[]> {
    for (const e of emails) {
      await this.sendEmail({ to: e.to, subject: e.subject, html: e.html, templateType: e.templateType });
    }
    return [];
  }

  // ----------------------------------------------------------
  // CORE SEND LOGIC (PRIVATE)
  // ----------------------------------------------------------

  private async sendEmail(options: EmailOptions): Promise<void> {
    const { to, subject, html, templateType, metadata } = options;

    logger.info('Sending email', {
      to,
      subject,
      templateType: templateType || 'custom',
    });

    try {
      const result = await sendEmailUtil({
        from: this.fromAddress,
        to,
        subject,
        html,
      });

      if (!result.ok) {
        throw new Error(result.error || 'Email delivery failed');
      }

      logger.info('Email sent', { to, subject, transport: result.transport });
      await this.logEmail({
        to_email: to,
        from_email: this.fromAddress,
        subject,
        template_type: templateType || null,
        status: 'sent',
        sent_at: new Date().toISOString(),
        error: null,
        metadata: metadata || null,
        transport: result.transport || null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';
      logger.error('Email send failed', { to, error: errorMessage });

      await this.logEmail({
        to_email: to,
        from_email: this.fromAddress,
        subject,
        template_type: templateType || null,
        status: 'failed',
        sent_at: null,
        error: errorMessage,
        metadata: metadata || null,
        transport: null,
      });

      throw new Error(`Email delivery failed: ${errorMessage}`);
    }
  }

  // ----------------------------------------------------------
  // EMAIL LOGGING (SUPABASE)
  // ----------------------------------------------------------

  private async logEmail(entry: EmailLogEntry): Promise<void> {
    if (!this.supabaseUrl || !this.supabaseServiceKey) {
      logger.debug('Supabase not configured - skipping email log persistence', {
        to: entry.to_email,
        status: entry.status,
      });
      return;
    }

    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/email_logs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: this.supabaseServiceKey,
            Authorization: `Bearer ${this.supabaseServiceKey}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify(entry),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        logger.warn('Failed to persist email log', {
          status: response.status,
          error: errorBody,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';
      logger.warn('Email log persistence error', { error: errorMessage });
    }
  }
}

// Export singleton instance
export default new EmailService();
