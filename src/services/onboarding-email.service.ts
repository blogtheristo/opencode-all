/**
 * Onboarding Email Sequence Service
 *
 * Sends a 3-step welcome drip sequence to new customers:
 *   Day 0: Welcome + first steps
 *   Day 3: "Run your first assessment" nudge
 *   Day 7: Check-in + feature highlights
 *
 * Uses the existing email service (SES primary, Resend fallback).
 * Emails are queued via the email queue (Redis Streams) when available.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (P1-RC5 onboarding retention)
 * Date: 2026-03-21
 */

import emailService from './email.service.js';
import logger from '../utils/logger.js';

// ============ SECURITY ============

/** HTML-escape user-controlled strings before embedding in email markup. */
function esc(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (c) => map[c]);
}

// ============ TEMPLATES ============

function day0WelcomeHtml(name: string, industry: string): string {
  const safeName = esc(name);
  const safeIndustry = esc(industry);
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1e293b;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:32px 16px;">
<tr><td>
  <div style="background:#0f172a;border-radius:12px;padding:32px;color:#f1f5f9;margin-bottom:24px;">
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;">Welcome to DWS IQ, ${safeName}</h1>
    <p style="margin:0;font-size:14px;color:#94a3b8;">Your EU compliance intelligence platform is ready.</p>
  </div>
  <div style="background:#ffffff;border-radius:12px;padding:24px;border:1px solid #e2e8f0;">
    <p style="font-size:15px;line-height:1.6;">You've set up your account for the <strong>${safeIndustry}</strong> industry. Here's what to do next:</p>
    <ol style="font-size:14px;line-height:1.8;padding-left:20px;color:#334155;">
      <li><strong>Run your first compliance assessment</strong> — Open the dashboard, click "AI Assistant", and ask: <em>"Run a CSRD assessment for my company"</em></li>
      <li><strong>Review your gaps</strong> — The assessment shows exactly which ESRS disclosures you need to provide</li>
      <li><strong>Connect your data</strong> — Settings > ERP Connection to pull emissions data automatically</li>
    </ol>
    <p style="font-size:14px;color:#64748b;margin-top:16px;">Your first assessment takes about 2 minutes. Real scores, real gaps, real deadlines.</p>
  </div>
  <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:24px;">DWS IQ 6 · Climate Intelligence Platform · Lifetime Oy</p>
</td></tr>
</table>
</body>
</html>`;
}

function day3NudgeHtml(name: string): string {
  const safeName = esc(name);
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1e293b;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:32px 16px;">
<tr><td>
  <div style="background:#ffffff;border-radius:12px;padding:24px;border:1px solid #e2e8f0;">
    <h2 style="margin:0 0 12px;font-size:20px;">Ready for your first assessment, ${safeName}?</h2>
    <p style="font-size:14px;line-height:1.6;color:#475569;">
      Companies in your industry are preparing for <strong>CSRD Phase 1</strong> (deadline: June 2026).
      Run a baseline assessment now to see where you stand.
    </p>
    <div style="margin:20px 0;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
      <p style="margin:0;font-size:14px;color:#166534;">
        <strong>Quick start:</strong> Open your dashboard and ask the AI Assistant:
        <br><em>"What's my CSRD readiness score?"</em>
      </p>
    </div>
    <p style="font-size:13px;color:#94a3b8;">
      The assessment uses real EU regulation data (ESRS 2023, EU ETS Phase 4, CBAM Reg. 2023/956).
      No mock scores — real gap analysis in 2 minutes.
    </p>
  </div>
  <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:24px;">DWS IQ 6 · Lifetime Oy</p>
</td></tr>
</table>
</body>
</html>`;
}

function day7CheckInHtml(name: string): string {
  const safeName = esc(name);
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1e293b;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:32px 16px;">
<tr><td>
  <div style="background:#ffffff;border-radius:12px;padding:24px;border:1px solid #e2e8f0;">
    <h2 style="margin:0 0 12px;font-size:20px;">How's it going, ${safeName}?</h2>
    <p style="font-size:14px;line-height:1.6;color:#475569;">
      You've been with DWS IQ for a week. Here are features you might not have tried yet:
    </p>
    <ul style="font-size:14px;line-height:1.8;padding-left:20px;color:#334155;">
      <li><strong>Carbon Tracking</strong> — EN 15978 lifecycle breakdown with ETS/CBAM cost estimates</li>
      <li><strong>Report Export</strong> — Download compliance reports (CSV/JSON) for auditor submissions</li>
      <li><strong>API Keys</strong> — Integrate compliance checks into your CI/CD pipeline</li>
      <li><strong>Sector Benchmarks</strong> — Compare your performance against EU industry averages</li>
    </ul>
    <p style="font-size:13px;color:#94a3b8;margin-top:16px;">
      Questions? Reply to this email — it reaches a real person, not a bot.
    </p>
  </div>
  <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:24px;">DWS IQ 6 · Lifetime Oy</p>
</td></tr>
</table>
</body>
</html>`;
}

// ============ SERVICE ============

export const onboardingEmailService = {
  /**
   * Send Day 0 welcome email immediately after onboarding completes.
   */
  async sendWelcome(to: string, name: string, industry: string): Promise<void> {
    try {
      await emailService.sendRawEmail({
        to,
        subject: `Welcome to DWS IQ, ${esc(name)} — Your compliance dashboard is ready`,
        html: day0WelcomeHtml(name, industry),
        templateType: 'onboarding_day0',
        metadata: { industry, step: 0 },
      });
      logger.info('Onboarding Day 0 email sent', { to, industry });
    } catch (err) {
      logger.warn('Failed to send onboarding Day 0 email', {
        to,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  /**
   * Send Day 3 nudge email (schedule this via cron or queue).
   */
  async sendDay3Nudge(to: string, name: string): Promise<void> {
    try {
      await emailService.sendRawEmail({
        to,
        subject: `${esc(name)}, your first CSRD assessment is one click away`,
        html: day3NudgeHtml(name),
        templateType: 'onboarding_day3',
        metadata: { step: 3 },
      });
      logger.info('Onboarding Day 3 email sent', { to });
    } catch (err) {
      logger.warn('Failed to send onboarding Day 3 email', {
        to,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  /**
   * Send Day 7 check-in email.
   */
  async sendDay7CheckIn(to: string, name: string): Promise<void> {
    try {
      await emailService.sendRawEmail({
        to,
        subject: `Week 1 with DWS IQ — features to explore`,
        html: day7CheckInHtml(name),
        templateType: 'onboarding_day7',
        metadata: { step: 7 },
      });
      logger.info('Onboarding Day 7 email sent', { to });
    } catch (err) {
      logger.warn('Failed to send onboarding Day 7 email', {
        to,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },
};
