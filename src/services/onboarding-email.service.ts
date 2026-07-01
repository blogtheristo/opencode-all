/**
 * Onboarding Email Sequence Service
 *
 * MVP Feature 5.3 — Automated welcome email drip:
 *   Day 0: Welcome + first steps
 *   Day 3: "Run your first compliance assessment"
 *   Day 7: Check-in + feature highlights
 *
 * Uses the existing sendEmail utility (src/utils/send-email.ts) which routes
 * through Amazon SES (SMTP).
 * Sequence state tracked in Supabase onboarding_email_sequences table.
 */

import { sendEmail } from '../utils/send-email.js';
import logger from '../utils/logger.js';

const EMAIL_FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const APP_URL = process.env.APP_URL || 'https://dws6.com';

interface OnboardingSequenceConfig {
  email: string;
  firstName: string;
  companyName: string;
  industry: string;
}

// ============ EMAIL TEMPLATES ============

function welcomeEmailHtml(firstName: string, companyName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0a0a0a; color: #e5e5e5;">
  <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to DWS IQ</h1>
    <p style="color: #9ca3af; font-size: 14px; margin: 4px 0 0;">EU Compliance Intelligence Platform</p>
  </div>

  <p>Hi ${firstName},</p>
  <p>Welcome aboard! <strong>${companyName}</strong> is now set up on DWS IQ.</p>

  <h2 style="color: #3b82f6; font-size: 18px;">Your First Steps</h2>
  <ol style="line-height: 1.8;">
    <li><strong>Complete your company profile</strong> in Settings</li>
    <li><strong>Run your first CSRD readiness assessment</strong> to see your compliance score</li>
    <li><strong>Review the gap analysis</strong> to identify priority actions</li>
  </ol>

  <div style="margin: 24px 0; text-align: center;">
    <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 32px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Open Dashboard</a>
  </div>

  <p style="color: #9ca3af; font-size: 13px;">Questions? Reply to this email — it goes directly to our team.</p>

  <div style="border-top: 1px solid #1f2937; margin-top: 32px; padding-top: 16px; color: #6b7280; font-size: 12px;">
    <p>Lifetime Oy — DWS IQ Platform<br>Helsinki, Finland | EU Sovereign Cloud</p>
  </div>
</body>
</html>`;
}

function day3EmailHtml(firstName: string, industry: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0a0a0a; color: #e5e5e5;">
  <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Run Your First Assessment</h1>
  </div>

  <p>Hi ${firstName},</p>
  <p>Have you run your first CSRD readiness assessment yet? Most ${industry} companies discover 15-30 compliance gaps in their first scan.</p>

  <h2 style="color: #3b82f6; font-size: 18px;">What You'll Get</h2>
  <ul style="line-height: 1.8;">
    <li>Overall CSRD readiness score (0-100)</li>
    <li>Gap analysis with specific ESRS disclosure requirements</li>
    <li>ETS cost estimate based on your emissions</li>
    <li>CBAM exposure assessment for imports</li>
    <li>Downloadable compliance report for your team</li>
  </ul>

  <div style="margin: 24px 0; text-align: center;">
    <a href="${APP_URL}/dashboard/compliance" style="display: inline-block; padding: 12px 32px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Start Assessment</a>
  </div>

  <p style="color: #9ca3af; font-size: 13px;">Takes about 5 minutes. No data leaves EU sovereign infrastructure.</p>

  <div style="border-top: 1px solid #1f2937; margin-top: 32px; padding-top: 16px; color: #6b7280; font-size: 12px;">
    <p>Lifetime Oy — DWS IQ Platform</p>
  </div>
</body>
</html>`;
}

function day7EmailHtml(firstName: string, companyName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0a0a0a; color: #e5e5e5;">
  <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Your First Week with DWS IQ</h1>
  </div>

  <p>Hi ${firstName},</p>
  <p>It's been a week since ${companyName} joined DWS IQ. Here's what's available to help you stay ahead of EU compliance:</p>

  <h2 style="color: #3b82f6; font-size: 18px;">Key Features</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #1f2937;">
      <td style="padding: 12px 0; color: #3b82f6; font-weight: 600; width: 40%;">Compliance Dashboard</td>
      <td style="padding: 12px 0; color: #d1d5db;">Real-time CSRD, ETS, CBAM scores</td>
    </tr>
    <tr style="border-bottom: 1px solid #1f2937;">
      <td style="padding: 12px 0; color: #3b82f6; font-weight: 600;">Carbon Tracking</td>
      <td style="padding: 12px 0; color: #d1d5db;">Scope 1/2/3 emissions monitoring</td>
    </tr>
    <tr style="border-bottom: 1px solid #1f2937;">
      <td style="padding: 12px 0; color: #3b82f6; font-weight: 600;">Report Export</td>
      <td style="padding: 12px 0; color: #d1d5db;">Auditor-ready PDF/CSV reports</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; color: #3b82f6; font-weight: 600;">AI Assistant</td>
      <td style="padding: 12px 0; color: #d1d5db;">Ask regulatory questions in natural language</td>
    </tr>
  </table>

  <div style="margin: 24px 0; text-align: center;">
    <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 32px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Go to Dashboard</a>
  </div>

  <p style="color: #9ca3af; font-size: 13px;">Need help? Reply to this email or book a 15-minute onboarding call.</p>

  <div style="border-top: 1px solid #1f2937; margin-top: 32px; padding-top: 16px; color: #6b7280; font-size: 12px;">
    <p>Lifetime Oy — DWS IQ Platform<br>Helsinki, Finland | EU Sovereign Cloud</p>
  </div>
</body>
</html>`;
}

// ============ SEQUENCE LOGIC ============

export interface OnboardingEmailResult {
  success: boolean;
  transport?: string;
  error?: string;
}

/**
 * Send Day 0 welcome email immediately after onboarding completes.
 * Routes through Amazon SES (SMTP).
 */
export async function sendWelcomeSequenceEmail(
  config: OnboardingSequenceConfig,
): Promise<OnboardingEmailResult> {
  const result = await sendEmail({
    from: EMAIL_FROM,
    to: config.email,
    subject: `Welcome to DWS IQ — Let's get ${config.companyName} compliant`,
    html: welcomeEmailHtml(config.firstName, config.companyName),
  });

  if (result.ok) {
    logger.info('Onboarding Day 0 email sent', {
      to: config.email,
      transport: result.transport,
    });
  } else {
    logger.error('Onboarding Day 0 email failed', {
      to: config.email,
      error: result.error,
    });
  }

  return {
    success: result.ok,
    transport: result.transport,
    error: result.error,
  };
}

/**
 * Send Day 3 "run your first assessment" nudge.
 * Routes through Amazon SES (SMTP).
 */
export async function sendDay3NudgeEmail(
  config: OnboardingSequenceConfig,
): Promise<OnboardingEmailResult> {
  const result = await sendEmail({
    from: EMAIL_FROM,
    to: config.email,
    subject: 'Run your first compliance assessment',
    html: day3EmailHtml(config.firstName, config.industry),
  });

  if (result.ok) {
    logger.info('Onboarding Day 3 email sent', {
      to: config.email,
      transport: result.transport,
    });
  } else {
    logger.error('Onboarding Day 3 email failed', {
      to: config.email,
      error: result.error,
    });
  }

  return {
    success: result.ok,
    transport: result.transport,
    error: result.error,
  };
}

/**
 * Send Day 7 check-in with feature highlights.
 * Routes through Amazon SES (SMTP).
 */
export async function sendDay7CheckinEmail(
  config: OnboardingSequenceConfig,
): Promise<OnboardingEmailResult> {
  const result = await sendEmail({
    from: EMAIL_FROM,
    to: config.email,
    subject: `Your first week with DWS IQ — ${config.companyName}`,
    html: day7EmailHtml(config.firstName, config.companyName),
  });

  if (result.ok) {
    logger.info('Onboarding Day 7 email sent', {
      to: config.email,
      transport: result.transport,
    });
  } else {
    logger.error('Onboarding Day 7 email failed', {
      to: config.email,
      error: result.error,
    });
  }

  return {
    success: result.ok,
    transport: result.transport,
    error: result.error,
  };
}

/**
 * Trigger the full onboarding email sequence for a new user.
 * Day 0 is sent immediately via Amazon SES; Day 3 and Day 7 are scheduled.
 *
 * In production, scheduling would use node-cron or a job queue.
 * For MVP, we log the schedule and rely on a daily cron job to check
 * which users need their Day 3/7 emails.
 */
export async function startOnboardingSequence(
  config: OnboardingSequenceConfig,
): Promise<{ day0: OnboardingEmailResult; scheduled: { day3: string; day7: string } }> {
  // Send Day 0 immediately
  const day0 = await sendWelcomeSequenceEmail(config);

  // Calculate scheduled dates
  const now = new Date();
  const day3Date = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const day7Date = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  logger.info('Onboarding sequence started', {
    email: config.email,
    company: config.companyName,
    day0Sent: day0.success,
    day0Transport: day0.transport,
    day3Scheduled: day3Date.toISOString(),
    day7Scheduled: day7Date.toISOString(),
  });

  return {
    day0,
    scheduled: {
      day3: day3Date.toISOString(),
      day7: day7Date.toISOString(),
    },
  };
}

export default {
  sendWelcomeSequenceEmail,
  sendDay3NudgeEmail,
  sendDay7CheckinEmail,
  startOnboardingSequence,
};
