/**
 * DWS IQ 6 - Email Service
 *
 * Production-ready email delivery service using Resend as the sole provider.
 *
 * Features:
 *   - Resend REST API for outbound email
 *   - Structured logging via project logger
 *   - Supabase email_logs persistence (when configured)
 *   - HTML templates for all transactional email types
 *
 * Environment variables:
 *   RESEND_API_KEY       - Resend API key (required)
 *   EMAIL_FROM           - Sender address (default: risto@onelifetime.world)
 *   SUPABASE_URL         - Supabase project URL (for email logging)
 *   SUPABASE_SERVICE_KEY - Supabase service role key (for email logging)
 */

import logger from '../utils/logger.js';
import {
  welcomeTemplate,
  passwordResetTemplate,
  reportDeliveryTemplate,
  notificationTemplate,
  invoiceTemplate,
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

type EmailStatus = 'sent' | 'failed' | 'pending';

interface EmailLogEntry {
  to_email: string;
  from_email: string;
  subject: string;
  template_type: string | null;
  status: EmailStatus;
  sent_at: string | null;
  error: string | null;
  metadata: Record<string, unknown> | null;
}

// ============================================================
// EMAIL SERVICE
// ============================================================

class EmailService {
  private readonly fromAddress: string;
  private readonly resendApiKey: string | undefined;
  private readonly supabaseUrl: string | undefined;
  private readonly supabaseServiceKey: string | undefined;

  constructor() {
    this.fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
    this.resendApiKey = process.env.RESEND_API_KEY;
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!this.resendApiKey) {
      logger.warn(
        'RESEND_API_KEY not configured. Emails will be logged but not delivered.'
      );
    }
  }

  // ----------------------------------------------------------
  // PUBLIC METHODS
  // ----------------------------------------------------------

  /**
   * Send a welcome email to a newly registered user.
   */
  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Welcome to DWS IQ 6',
      html: welcomeTemplate(name),
      templateType: 'welcome',
      metadata: { name },
    });
  }

  /**
   * Send a password reset email with a one-time link.
   */
  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Reset Your Password - DWS IQ 6',
      html: passwordResetTemplate(resetLink),
      templateType: 'password_reset',
    });
  }

  /**
   * Notify a user that a report is ready for download.
   */
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

  /**
   * Send a generic notification email with custom subject and body text.
   */
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

  /**
   * Send an invoice email with payment details.
   */
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

  // ----------------------------------------------------------
  // CORE SEND LOGIC (PRIVATE)
  // ----------------------------------------------------------

  /**
   * Send an email through Resend.
   * Logs every attempt to Supabase when configured.
   */
  private async sendEmail(options: EmailOptions): Promise<void> {
    const { to, subject, html, templateType, metadata } = options;

    logger.info('Sending email', {
      to,
      subject,
      templateType: templateType || 'custom',
    });

    if (!this.resendApiKey) {
      logger.warn('RESEND_API_KEY not configured - email not delivered', {
        to,
        subject,
      });
      await this.logEmail({
        to_email: to,
        from_email: this.fromAddress,
        subject,
        template_type: templateType || null,
        status: 'failed',
        sent_at: null,
        error: 'RESEND_API_KEY not configured',
        metadata: metadata || null,
      });
      return;
    }

    try {
      await this.sendViaResend(to, subject, html);
      logger.info('Email sent via Resend', { to, subject });
      await this.logEmail({
        to_email: to,
        from_email: this.fromAddress,
        subject,
        template_type: templateType || null,
        status: 'sent',
        sent_at: new Date().toISOString(),
        error: null,
        metadata: metadata || null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown Resend error';
      logger.error('Resend send failed', { to, error: errorMessage });

      await this.logEmail({
        to_email: to,
        from_email: this.fromAddress,
        subject,
        template_type: templateType || null,
        status: 'failed',
        sent_at: null,
        error: errorMessage,
        metadata: metadata || null,
      });

      throw new Error(`Email delivery failed: ${errorMessage}`);
    }
  }

  // ----------------------------------------------------------
  // PROVIDER IMPLEMENTATIONS
  // ----------------------------------------------------------

  /**
   * Send email via Resend REST API.
   * @see https://resend.com/docs/api-reference/emails/send-email
   */
  private async sendViaResend(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.resendApiKey}`,
      },
      body: JSON.stringify({
        from: this.fromAddress,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Resend API error (${response.status}): ${errorBody}`
      );
    }
  }

  // ----------------------------------------------------------
  // EMAIL LOGGING (SUPABASE)
  // ----------------------------------------------------------

  /**
   * Persist an email log entry to the Supabase email_logs table.
   * Failures are logged but never propagated to the caller - email
   * delivery should not fail because of a logging issue.
   */
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

// Export singleton instance (consistent with auth.service.ts pattern)
export default new EmailService();
