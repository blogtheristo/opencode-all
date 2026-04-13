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
import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';

// ============================================================================
// EMAIL AUDIT LOGGER — Local JSONL log of every outbound email
// Catches shadow sends by rogue agents. No body content (privacy).
// Async I/O to avoid blocking the event loop under bursty volume.
// ============================================================================

const auditLogPath = join(process.cwd(), 'logs', 'email-audit.jsonl');
let logDirReady = false;

async function auditLogEmail(entry: {
  from: string;
  to: string;
  subject: string;
  transport: string;
  contentLength: number;
  callerStack: string;
}): Promise<void> {
  try {
    if (!logDirReady) {
      await mkdir(join(process.cwd(), 'logs'), { recursive: true });
      logDirReady = true;
    }
    const record = {
      timestamp: new Date().toISOString(),
      pid: process.pid,
      ...entry,
    };
    await appendFile(auditLogPath, JSON.stringify(record) + '\n');
  } catch {
    // Audit logging must never break email delivery
  }
}

/**
 * Escape HTML-unsafe characters (&, <, >) in a plain-text string so it can be
 * safely embedded inside an HTML template (e.g. `<pre>${escapeHtml(text)}</pre>`).
 *
 * Without this, any `<foo>` or `<id>` substring in the text is interpreted by
 * the recipient's email client as an unknown HTML tag and silently stripped —
 * which is why e.g. the morning-brief HIL checklist lost `<id>` from the
 * `mark-task-done.ts <id> --snooze 1d` example.
 *
 * Order matters: escape `&` first, then `<` and `>`, otherwise the replaced
 * ampersands double-escape.
 */
export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

export async function sendEmail(
  options: SendEmailOptions,
): Promise<{ ok: boolean; transport?: string; error?: string }> {
  const { from, to, subject, html, text, replyTo, headers } = options;
  const callerStack = new Error().stack?.split('\n').slice(2, 5).join(' <- ') || 'unknown';
  const contentLength = (html?.length || 0) + (text?.length || 0);

  const smtp = createSmtpTransport();
  if (!smtp) {
    return {
      ok: false,
      error: 'No SMTP transport configured (SMTP_HOST required). Resend removed for security.',
    };
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
    await auditLogEmail({ from, to, subject, transport: 'ses-smtp', contentLength, callerStack });
    return { ok: true, transport: 'ses-smtp' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `SES SMTP failed: ${msg}` };
  }
}
