/**
 * Send Email — Amazon SES (SMTP) ONLY
 *
 * SECURITY: Resend SDK removed 2026-03-26 due to suspected account compromise.
 * All DWS emails use Amazon SES via SMTP only.
 *
 * Env vars:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (Amazon SES eu-north-1)
 *   EMAIL_FROM (default: risto@onelifetime.world)
 */

import nodemailer from 'nodemailer';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// EMAIL AUDIT LOGGER — Local JSONL log of every outbound email
// Catches shadow sends by rogue agents. No body content (privacy).
// ============================================================================

function auditLogEmail(entry: {
  from: string;
  to: string;
  subject: string;
  transport: string;
  contentLength: number;
  callerStack: string;
}): void {
  try {
    const logsDir = join(process.cwd(), 'logs');
    mkdirSync(logsDir, { recursive: true });
    const record = {
      timestamp: new Date().toISOString(),
      pid: process.pid,
      ...entry,
    };
    appendFileSync(
      join(logsDir, 'email-audit.jsonl'),
      JSON.stringify(record) + '\n'
    );
  } catch {
    // Audit logging must never break email delivery
  }
}

function createSmtpTransport(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export interface SendEmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ ok: boolean; transport?: string; error?: string }> {
  const { from, to, subject, html, text, replyTo, headers } = options;
  const callerStack = new Error().stack?.split('\n').slice(2, 5).join(' <- ') || 'unknown';
  const contentLength = (html?.length || 0) + (text?.length || 0);

  const smtp = createSmtpTransport();
  if (!smtp) {
    return { ok: false, error: 'No SMTP transport configured (SMTP_HOST required). Resend removed for security.' };
  }

  try {
    await smtp.sendMail({
      from,
      to,
      subject,
      html,
      text: text ?? undefined,
      replyTo: replyTo ?? undefined,
      headers: headers as Record<string, string> | undefined,
    });
    auditLogEmail({ from, to, subject, transport: 'ses-smtp', contentLength, callerStack });
    return { ok: true, transport: 'ses-smtp' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `SES SMTP failed: ${msg}` };
  }
}
