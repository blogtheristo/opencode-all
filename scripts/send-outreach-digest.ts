#!/usr/bin/env npx tsx
/**
 * Standalone Outreach Digest Sender
 *
 * Sends the daily outreach digest email outside of the Express server.
 * Designed for GitHub Actions cron, manual execution, or any CI/CD trigger.
 *
 * Usage:
 *   npx tsx scripts/send-outreach-digest.ts
 *
 * Required env vars:
 *   RESEND_API_KEY
 *   SUPABASE_URL + SUPABASE_SERVICE_KEY (for live data)
 *
 * Optional env vars:
 *   OUTREACH_DIGEST_EMAIL (default: risto@lifetime.fi)
 *   EMAIL_FROM (default: risto@onelifetime.world)
 *   OUTREACH_REPLY_TO_EMAIL (reply-to address)
 *   SKIP_TIME_CHECK (bypass Helsinki time guard)
 */

import dotenv from 'dotenv';
dotenv.config();

import { generateDailyDigest } from '../src/outreach/daily-digest.js';

async function main(): Promise<void> {
  // Helsinki time guard: only send when Helsinki hour is 6.
  // Two GitHub Actions cron entries (03:00 and 04:00 UTC) cover both DST
  // offsets; the "wrong" one silently exits here.
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
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.error('ERROR: RESEND_API_KEY not configured.');
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

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [recipient],
      reply_to: replyToAddress,
      subject,
      html,
      text: plainText,
    }),
  });

  if (response.ok) {
    const result = await response.json();
    console.log(`Sent via Resend. ID: ${(result as any).id}`);
    return;
  }

  const errorBody = await response.text();
  console.error(`Resend failed (${response.status}): ${errorBody}`);
  process.exit(1);
}

main().catch((err) => {
  console.error('Outreach digest failed:', err);
  process.exit(1);
});
