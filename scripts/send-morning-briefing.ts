#!/usr/bin/env npx tsx
/**
 * Standalone Morning Briefing Sender
 *
 * Runs the CEO Cockpit morning briefing outside of the Express server.
 * Designed for GitHub Actions cron, manual execution, or any CI/CD trigger.
 *
 * Usage:
 *   npx tsx scripts/send-morning-briefing.ts
 *
 * Required env vars (at least one):
 *   RESEND_API_KEY      — primary provider
 *   SENDGRID_API_KEY    — fallback provider
 *   SUPABASE_URL + SUPABASE_SERVICE_KEY (for live data)
 *
 * Optional env vars:
 *   OUTREACH_DIGEST_EMAIL (default: risto@lifetime.fi)
 *   EMAIL_FROM (default: risto@onelifetime.world)
 *   MRR_EUR, WEEKLY_COMMITS, MVP_ETA
 */

import dotenv from 'dotenv';
dotenv.config();

import { collectCockpitData } from '../src/morning-briefing/data-collectors.js';
import { buildCockpitHtml, buildCockpitPlainText } from '../src/morning-briefing/briefing-template.js';

async function main(): Promise<void> {
  // Helsinki time guard: only send when Helsinki hour is 6.
  // Two GitHub Actions cron entries (03:00 and 04:00 UTC) cover both DST
  // offsets; the "wrong" one silently exits here. Manual triggers and
  // workflow_dispatch set SKIP_TIME_CHECK=true to bypass.
  if (process.env.SKIP_TIME_CHECK !== 'true') {
    const helsinkiHour = parseInt(
      new Date().toLocaleString('en-US', {
        timeZone: 'Europe/Helsinki',
        hour: 'numeric',
        hour12: false,
      }),
      10
    );
    if (helsinkiHour !== 6) {
      console.log(
        `Skipping: Helsinki hour is ${helsinkiHour}, not 6. Set SKIP_TIME_CHECK=true to override.`
      );
      process.exit(0);
    }
  } else {
    console.log('SKIP_TIME_CHECK=true, bypassing Helsinki time guard');
  }

  const recipient = process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;

  if (!resendKey && !sendgridKey) {
    console.error('ERROR: No email provider configured. Set RESEND_API_KEY or SENDGRID_API_KEY.');
    process.exit(1);
  }

  console.log(`Collecting CEO Cockpit data...`);
  const data = await collectCockpitData();

  const html = buildCockpitHtml(data);
  const text = buildCockpitPlainText(data);

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const subject = `CEO Cockpit ${dateStr}`;

  console.log(`Sending: "${subject}" → ${recipient}`);

  if (resendKey) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [recipient],
      subject,
      html,
      text,
    }),
  });

    if (response.ok) {
      const result = await response.json();
      console.log(`Sent via Resend. ID: ${(result as any).id}`);
      console.log(`✅ Morning briefing sent successfully to ${recipient} from ${fromAddress}`);
      return;
    }

    const errorBody = await response.text();
    console.warn(`Resend failed (${response.status}): ${errorBody}`);

    if (!sendgridKey) {
      console.error('No fallback provider. Exiting.');
      process.exit(1);
    }
    console.log('Falling back to SendGrid...');
  }

  // Fallback to SendGrid
  if (sendgridKey) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sendgridKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipient }] }],
        from: { email: fromAddress },
        subject,
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html },
        ],
      }),
    });

    if (response.ok || response.status === 202) {
      console.log('Sent via SendGrid.');
      console.log(`✅ Morning briefing sent successfully to ${recipient} from ${fromAddress}`);
      return;
    }

    const errorBody = await response.text();
    console.error(`SendGrid failed (${response.status}): ${errorBody}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Morning briefing failed:', err);
  process.exit(1);
});
