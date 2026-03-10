/**
 * Send Email — SMTP (Amazon SES) primary, Resend fallback
 *
 * All DWS emails use risto@onelifetime.world (verified in SES and Resend.com).
 * Priority: SMTP (SES) → Resend → console
 *
 * Env vars:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (for Amazon SES)
 *   RESEND_API_KEY (fallback)
 *   EMAIL_FROM (default: risto@onelifetime.world)
 */

import nodemailer from 'nodemailer';

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
      if (response.ok) return { ok: true, transport: 'resend' };
      const errBody = await response.text();
      return { ok: false, error: `Resend ${response.status}: ${errBody}` };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, error: msg };
    }
  }

  return { ok: false, error: 'No email transport (SMTP_HOST or RESEND_API_KEY)' };
}
