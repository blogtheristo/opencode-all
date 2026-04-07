#!/usr/bin/env npx tsx
/**
 * Standalone Outreach Digest Sender
 *
 * Sends the daily outreach digest email outside of the Express server.
 * Designed for local cron, manual execution, or any CI/CD trigger.
 *
 * Usage:
 *   npx tsx scripts/send-outreach-digest.ts
 *
 * Required env vars:
 *   SMTP_HOST + SMTP_USER + SMTP_PASS (Amazon SES)
 *   SUPABASE_URL + SUPABASE_SERVICE_KEY (for live data)
 *
 * Optional env vars:
 *   OUTREACH_DIGEST_EMAIL (default: risto@lifetime.fi)
 *   EMAIL_FROM (default: risto@onelifetime.world)
 *   OUTREACH_REPLY_TO_EMAIL (reply-to address)
 *   SKIP_TIME_CHECK (bypass Helsinki time guard)
 *
 * SECURITY: Resend SDK removed 2026-03-26 (suspected account compromise). SES only.
 */

import dotenv from 'dotenv';
dotenv.config();

import { generateDailyDigest } from '../src/outreach/daily-digest.js';
import { sendEmail } from '../src/utils/send-email.js';

async function main(): Promise<void> {
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
  const replyToAddress = process.env.OUTREACH_REPLY_TO_EMAIL || fromAddress;

  if (!process.env.SMTP_HOST) {
    console.error('ERROR: SMTP_HOST not configured. Amazon SES (SMTP) is required.');
    process.exit(1);
  }

  console.log('Generating outreach digest...');
  const { plainText, html, buckets } = await generateDailyDigest();

  const totalThreads = buckets.overdue.length + buckets.today.length +
    buckets.waiting.length + buckets.active_deals.length + buckets.upcoming.length;
  console.log(`Digest: ${totalThreads} threads (${buckets.overdue.length} overdue, ${buckets.today.length} today, ${buckets.active_deals.length} active)`);

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const subject = `Outreach ${dateStr}`;

  console.log(`Sending: "${subject}" → ${recipient}`);

  const result = await sendEmail({
    from: fromAddress,
    to: recipient,
    subject,
    html,
    text: plainText,
    replyTo: replyToAddress,
    headers: { 'X-DWS-Email-Type': 'outreach-digest' },
  });

  if (result.ok) {
    console.log(`Sent via ${result.transport}. Outreach digest delivered to ${recipient}`);
    return;
  }

  console.error(`Email delivery failed: ${result.error}`);
  process.exit(1);
}

main().catch((err) => {
  console.error('Outreach digest failed:', err);
  process.exit(1);
});
