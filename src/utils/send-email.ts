/**
 * Send Email — SMTP (Amazon SES) primary, Resend fallback
 *
 * All DWS emails use risto@onelifetime.world (verified in SES and Resend.com).
 * Priority: SMTP (SES) → Resend. If both transports are unavailable or fail,
 * the function returns { ok: false, error } for the caller to handle (e.g. logging).
 *
 * Env vars:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (for Amazon SES)
 *   RESEND_API_KEY (fallback)
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

  // 1. Try SMTP (Amazon SES)
  const smtp = createSmtpTransport();
  if (smtp) {
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
      auditLogEmail({ from, to, subject, transport: 'smtp', contentLength, callerStack });
      return { ok: true, transport: 'smtp' };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('SMTP send failed, falling back to Resend:', msg);
    }
  }

  // 2. Try Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resBody: Record<string, unknown> = {
        from,
        to: [to],
        subject,
        html,
        text: text ?? undefined,
        reply_to: replyTo ?? undefined,
      };
      if (headers && Object.keys(headers).length > 0) {
        resBody.headers = headers;
      }
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify(resBody),
      });
      if (response.ok) {
        auditLogEmail({ from, to, subject, transport: 'resend', contentLength, callerStack });
        return { ok: true, transport: 'resend' };
      }
      const errBody = await response.text();
      return { ok: false, error: `Resend ${response.status}: ${errBody}` };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, error: msg };
    }
  }

  return { ok: false, error: 'No email transport (SMTP_HOST or RESEND_API_KEY)' };
}
