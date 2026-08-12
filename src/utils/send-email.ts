/**
 * Send Email — Amazon SES (SMTP) ONLY
 *
 * All DWS emails use risto@onelifetime.world (verified in SES).
 * Priority: SMTP (SES) only. Delivery failures are persisted locally in
 * Supabase email_queue for manual retry.
 *
 * EVERY outgoing email is logged to Supabase email_queue regardless of
 * delivery outcome — provides a local audit trail and enables failover
 * replay if SES becomes unavailable.
 *
 * Env vars:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (Amazon SES eu-north-1)
 *   EMAIL_FROM (default: risto@onelifetime.world)
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY (for local audit logging)
 */

import dns from 'node:dns';
import nodemailer from 'nodemailer';

// ============================================================================
// EMAIL AUDIT LOGGER — Local JSONL log of every outbound email
// Catches shadow sends by rogue agents. No body content (privacy).
// Async I/O to avoid blocking the event loop under bursty volume.
// ============================================================================

// const auditLogPath = join(process.cwd(), 'logs', 'email-audit.jsonl');
// let logDirReady = false;

// Unused stub for audit logging - audit trail now handled by sendEmail
// async function auditLogEmail(entry: {
//   from: string;
//   to: string;
//   subject: string;
//   transport: string;
//   contentLength: number;
//   callerStack: string;
// }): Promise<void> {
//   try {
//     if (!logDirReady) {
//       await mkdir(join(process.cwd(), 'logs'), { recursive: true });
//       logDirReady = true;
//     }
//     const record = {
//       timestamp: new Date().toISOString(),
//       pid: process.pid,
//       ...entry,
//     };
//     await appendFile(auditLogPath, JSON.stringify(record) + '\n');
//   } catch {
//     // Audit logging must never break email delivery
//   }
// }

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

let smtpIpv4PreferenceApplied = false;

function applySmtpIpv4PreferenceIfRequested(): void {
  if (process.env.SMTP_FORCE_IPV4 !== 'true' || smtpIpv4PreferenceApplied) {
    return;
  }
  smtpIpv4PreferenceApplied = true;
  dns.setDefaultResultOrder('ipv4first');
}

/** Trim .env values — trailing spaces after copy-paste cause SES 535 Invalid login. */
function trimEnv(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const t = value.trim();
  return t.length > 0 ? t : undefined;
}

/**
 * Amazon SES SMTP (STARTTLS on 587/2587, TLS on 465). Exported so diagnostics
 * use the same options as production sends.
 */
export function createSmtpTransportFromEnv(): nodemailer.Transporter | null {
  const host = trimEnv(process.env.SMTP_HOST);
  if (!host) return null;

  applySmtpIpv4PreferenceIfRequested();

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';

  const useStartTls = !secure && (port === 587 || port === 2587);

  const smtpUser = trimEnv(process.env.SMTP_USER);
  const smtpPass = trimEnv(process.env.SMTP_PASS);
  if (!smtpUser || !smtpPass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    requireTLS: useStartTls,
    tls: {
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
  });
}

function createSmtpTransport(): nodemailer.Transporter | null {
  return createSmtpTransportFromEnv();
}

export interface SendEmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
  /** Source system for audit trail (default: 'platform') */
  source?: 'platform' | 'firehorse' | 'outreach' | 'admin';
  /** Template type identifier for tracking */
  templateType?: string;
  /** Arbitrary metadata stored with the audit log */
  metadata?: Record<string, unknown>;
}

export interface SendEmailResult {
  ok: boolean;
  transport?: string;
  error?: string;
  /** Supabase email_queue row ID — proof of local persistence */
  auditId?: string;
}

/**
 * Persist email to Supabase email_queue for audit trail.
 * Never throws — failures are logged silently so email delivery isn't blocked.
 */
async function persistToAuditLog(
  options: SendEmailOptions,
  status: 'queued' | 'sent' | 'failed',
  transport?: string,
  error?: string,
): Promise<string | undefined> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) return undefined;

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/email_queue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        to_email: options.to,
        subject: options.subject,
        template_type: options.templateType || null,
        source: options.source || 'platform',
        status,
        attempts: status === 'failed' ? 1 : status === 'sent' ? 1 : 0,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
        error: error || null,
        metadata: {
          ...options.metadata,
          from: options.from,
          transport: transport || null,
          html_length: options.html.length,
        },
      }),
    });

    if (response.ok) {
      const rows = (await response.json()) as Array<{ id: string }>;
      return rows?.[0]?.id;
    }
  } catch {
    // Silent — audit logging must never block email delivery
  }

  return undefined;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { from, to, subject, html, text, replyTo, headers } = options;

  const smtp = createSmtpTransport();
  if (!smtp) {
    const error = 'SMTP transport unavailable (missing SMTP_HOST/SMTP_USER/SMTP_PASS)';
    const auditId = await persistToAuditLog(options, 'failed', 'ses', error);
    return { ok: false, error, auditId };
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
    const auditId = await persistToAuditLog(options, 'sent', 'ses');
    return { ok: true, transport: 'ses', auditId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const auditId = await persistToAuditLog(options, 'failed', 'ses', msg);
    return { ok: false, error: msg, auditId };
  }
}
