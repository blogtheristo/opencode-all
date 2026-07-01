#!/usr/bin/env npx tsx
/**
 * EU Regulation Monitor — Daily Digest Sender
 *
 * Fetches regulatory news from EU sources, classifies by regulation,
 * and sends a digest email. Runs at 05:30 Helsinki (before morning briefing).
 *
 * Usage:
 *   npx tsx scripts/send-regulation-digest.ts
 *
 * Email: risto@onelifetime.world (Amazon SES)
 * Required: SMTP_* (Amazon SES)
 * Optional: REGULATION_DIGEST_EMAIL, EMAIL_FROM, SKIP_TIME_CHECK
 */

import dotenv from 'dotenv';
dotenv.config();

import { fetchRegulationNews } from '../src/regulation-monitor/fetcher.js';
import {
  buildRegulationDigestHtml,
  buildRegulationDigestPlainText,
} from '../src/regulation-monitor/digest-template.js';
import { sendEmail } from '../src/utils/send-email.js';

async function main(): Promise<void> {
  // Helsinki time guard (same pattern as morning briefing)
  if (process.env.SKIP_TIME_CHECK !== 'true') {
    const helsinkiHour = parseInt(
      new Date().toLocaleString('en-US', {
        timeZone: 'Europe/Helsinki',
        hour: 'numeric',
        hour12: false,
      }),
      10
    );
    // Allow 5:00-6:00 window (runs at 05:30 before morning briefing)
    if (helsinkiHour < 5 || helsinkiHour > 6) {
      console.log(
        `Skipping: Helsinki hour is ${helsinkiHour}, expected 5-6. Set SKIP_TIME_CHECK=true to override.`
      );
      process.exit(0);
    }
  } else {
    console.log('SKIP_TIME_CHECK=true, bypassing Helsinki time guard');
  }

  const recipient = process.env.REGULATION_DIGEST_EMAIL || process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const hasTransport = !!process.env.SMTP_HOST;

  // Step 1: Fetch regulatory news
  console.log('Fetching regulatory news from EU sources...');
  const digest = await fetchRegulationNews();

  console.log(`Found ${digest.items.length} items (${digest.urgentItems.length} urgent)`);
  for (const [reg, items] of Object.entries(digest.byRegulation)) {
    console.log(`  ${reg}: ${items.length} items`);
  }

  // Skip email if no items
  if (digest.items.length === 0) {
    console.log('No regulatory news found. Skipping email.');
    process.exit(0);
  }

  // Step 2: Build email
  const html = buildRegulationDigestHtml(digest);
  const text = buildRegulationDigestPlainText(digest);

  if (!hasTransport) {
    console.log('\n--- No SMTP (Amazon SES), printing to console ---\n');
    console.log(text);
    return;
  }

  // Step 3: Send via Amazon SES (SMTP)
  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const urgentTag = digest.urgentItems.length > 0 ? ` [${digest.urgentItems.length} URGENT]` : '';
  const subject = `EU Regulation Monitor ${dateStr}${urgentTag}`;

  console.log(`\nSending: "${subject}" → ${recipient}`);

  const result = await sendEmail({
    from: fromAddress,
    to: recipient,
    subject,
    html,
    text,
    headers: {
      'X-DWS-Email-Type': 'regulation-monitor',
      'X-DWS-Urgent-Count': String(digest.urgentItems.length),
    },
  });

  if (result.ok) {
    console.log(`Regulation digest sent via ${result.transport}`);
  } else {
    console.error('Failed to send:', result.error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Regulation digest error:', err);
  process.exit(1);
});
