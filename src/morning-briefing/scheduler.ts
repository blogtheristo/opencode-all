/**
 * Morning Briefing — CEO Cockpit
 *
 * Delivery: GitHub Actions workflow (.github/workflows/morning-briefing.yml)
 * fires Mon-Sat at 06:00 Helsinki via dual UTC crons (DST-safe).
 *
 * This module provides the send logic used by both the standalone script
 * (scripts/send-morning-briefing.ts) and the Express manual-trigger endpoint.
 *
 * Email delivery priority:
 *   1. SMTP via nodemailer (primary — Hetzner Helsinki when provisioned)
 *   2. Resend SDK (fallback — until SMTP server is live)
 *   3. Console print (dev / no credentials)
 *
 * SMTP env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE
 * Resend env var: RESEND_API_KEY
 */

import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import logger from '../utils/logger.js';
import { collectCockpitData } from './data-collectors.js';
import { buildCockpitHtml, buildCockpitPlainText } from './briefing-template.js';

// ============================================================================
// SMTP TRANSPORT
// ============================================================================

function createSmtpTransport(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true'; // true = port 465 (SSL), false = STARTTLS

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

// ============================================================================
// SEND BRIEFING
// ============================================================================

async function sendMorningBriefing(): Promise<void> {
  const recipient = process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';

  const data = await collectCockpitData();
  const html = buildCockpitHtml(data);
  const text = buildCockpitPlainText(data);

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const subject = `CEO Cockpit ${dateStr}`;

  // --- Primary: SMTP (Hetzner Helsinki) ---
  const smtpTransport = createSmtpTransport();
  if (smtpTransport) {
    try {
      const info = await smtpTransport.sendMail({
        from: fromAddress,
        to: recipient,
        subject,
        html,
        text,
      });
      logger.info('CEO Cockpit sent via SMTP', { to: recipient, messageId: info.messageId });
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('SMTP send failed, falling back to Resend', { error: msg });
      // fall through to Resend
    }
  }

  // --- Fallback: Resend ---
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    try {
      const { data: result, error } = await resend.emails.send({
        from: fromAddress,
        to: [recipient],
        subject,
        html,
        text,
      });

      if (error) {
        logger.error('Resend CEO Cockpit failed', { error: error.message });
        return;
      }

      logger.info('CEO Cockpit sent via Resend', { to: recipient, id: result?.id });
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Resend CEO Cockpit error', { error: msg });
      return;
    }
  }

  // --- Last resort: console ---
  logger.warn('No email transport configured (SMTP_HOST or RESEND_API_KEY). Printing to console.');
  console.log('\n' + text);
}

// ============================================================================
// PUBLIC API (used by Express manual-trigger endpoint)
// ============================================================================

/**
 * Send the CEO Cockpit briefing immediately.
 * Called from the POST /api/v1/morning-briefing/send endpoint.
 */
export async function sendBriefingNow(): Promise<void> {
  logger.info('Running CEO Cockpit manually');
  await sendMorningBriefing();
}
