/**
 * DWS IQ 6 - Email Service
 *
 * Production email delivery. Transport is Amazon SES (SMTP) ONLY — per CLAUDE.md
 * Non-Negotiable Rule 4 (never Resend/SendGrid) — via src/utils/send-email.ts,
 * which also persists an audit trail to the Supabase email_queue.
 *
 * Features:
 *   - Amazon SES (SMTP) transport
 *   - Structured logging via project logger
 *   - Supabase email_logs persistence (when configured)
 *   - HTML templates for all transactional email types
 *
 * Environment variables:
 *   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS - Amazon SES SMTP credentials
 *   EMAIL_FROM       - Sender address (default: risto@onelifetime.world)
 *   SUPABASE_URL     - Supabase project URL (for email logging)
 *   SUPABASE_SERVICE_KEY - Supabase service role key (for email logging)
 */

import logger from '../utils/logger.js';
import { sendEmail as sesSendEmail } from '../utils/send-email.js';
import {
  welcomeTemplate,
  passwordResetTemplate,
  reportDeliveryTemplate,
  notificationTemplate,
  invoiceTemplate,
  bookingConfirmationTemplate,
  bookingAdminNotificationTemplate,
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
  private readonly supabaseUrl: string | undefined;
  private readonly supabaseServiceKey: string | undefined;

  constructor() {
    this.fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn(
        'No SES SMTP transport configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS. Emails will be logged but not delivered.',
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
    downloadUrl: string,
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
  async sendNotificationEmail(to: string, subject: string, body: string): Promise<void> {
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
    currency: string,
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
   * Send a custom email with template and variables.
   * Supports 'booking_confirmation' and 'booking_admin_notification' templates.
   */
  async send(options: {
    to: string;
    template: string;
    variables: Record<string, unknown>;
  }): Promise<void> {
    const { to, template, variables } = options;

    let subject = '';
    let html = '';

    if (template === 'booking_confirmation') {
      subject = 'Varaus vahvistettu — Risto Anton Päärni';
      html = bookingConfirmationTemplate(
        variables as Parameters<typeof bookingConfirmationTemplate>[0],
      );
    } else if (template === 'booking_admin_notification') {
      subject = `Uusi varaus — ${(variables.serviceName as string) || 'Demo/Konsultaatio'}`;
      html = bookingAdminNotificationTemplate(
        variables as Parameters<typeof bookingAdminNotificationTemplate>[0],
      );
    } else {
      throw new Error(`Unknown template: ${template}`);
    }

    await this.sendEmail({
      to,
      subject,
      html,
      templateType: template,
      metadata: variables,
    });
  }

  // ----------------------------------------------------------
  // CORE SEND LOGIC (PRIVATE)
  // ----------------------------------------------------------

  /**
   * Send an email through Amazon SES (SMTP). Logs every attempt to the
   * Supabase email_logs table when configured.
   */
  private async sendEmail(options: EmailOptions): Promise<void> {
    const { to, subject, html, templateType, metadata } = options;

    logger.info('Sending email', { templateType: templateType || 'custom' });

    const result = await sesSendEmail({
      from: this.fromAddress,
      to,
      subject,
      html,
      source: 'platform',
      templateType,
      metadata,
    });

    if (result.ok) {
      logger.info('Email sent via SES', {
        templateType: templateType || 'custom',
        transport: result.transport || 'ses',
      });
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
      return;
    }

    const errorMessage = result.error || 'Unknown SES error';
    const notConfigured = /SMTP transport unavailable/i.test(errorMessage);

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

    if (notConfigured) {
      // No transport configured (e.g. local/dev) — log only, do not throw.
      logger.warn('No SES transport configured - email not delivered', { to, subject });
      return;
    }

    logger.error('SES send failed', { error: errorMessage });
    throw new Error(`Email delivery failed: ${errorMessage}`);
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
      const response = await fetch(`${this.supabaseUrl}/rest/v1/email_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.supabaseServiceKey,
          Authorization: `Bearer ${this.supabaseServiceKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        logger.warn('Failed to persist email log', {
          status: response.status,
          error: errorBody,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.warn('Email log persistence error', { error: errorMessage });
    }
  }

  /**
   * Send captain pre-briefing email (stub)
   */
  async sendCaptainPreBriefing(
    email: string,
    name: string,
    industry: string,
    seatLevel: string,
  ): Promise<void> {
    logger.debug('Stub: sendCaptainPreBriefing', { email, name, industry, seatLevel });
  }

  /**
   * Send raw email with custom options (stub)
   */
  async sendRawEmail(options: any): Promise<void> {
    logger.debug('Stub: sendRawEmail', options);
  }
}

// Export singleton instance (consistent with auth.service.ts pattern)
export default new EmailService();
