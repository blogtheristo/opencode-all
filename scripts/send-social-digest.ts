#!/usr/bin/env npx tsx
/**
 * Social Scheduler — Daily Digest Sender
 *
 * Two modes:
 *   1. Generate + send:  npx tsx scripts/send-social-digest.ts
 *      Generates today's draft, enqueues it, sends approval digest.
 *   2. Digest only:      npx tsx scripts/send-social-digest.ts --digest-only
 *      Sends approval digest for existing pending posts.
 *
 * Required env vars:
 *   RESEND_API_KEY
 *   SUPABASE_URL + SUPABASE_SERVICE_KEY
 *
 * Optional env vars:
 *   SOCIAL_DIGEST_EMAIL (default: risto@lifetime.fi)
 *   EMAIL_FROM (default: risto@onelifetime.world)
 */

import dotenv from 'dotenv';
dotenv.config();

import { generateTodaysDraft } from '../src/social-scheduler/content-generator.js';
import { enqueueDraft, getPendingDrafts } from '../src/social-scheduler/queue.js';
import {
  buildApprovalDigestHtml,
  buildApprovalDigestPlainText,
} from '../src/social-scheduler/approval-digest.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const digestOnly = args.includes('--digest-only');

  // Step 1: Generate today's draft (unless digest-only mode)
  if (!digestOnly) {
    console.log('Generating today\'s LinkedIn draft...');
    const draft = generateTodaysDraft();

    if (draft) {
      console.log(`Category: ${draft.category}`);
      console.log(`Scheduled: ${draft.scheduled_at}`);

      const postId = await enqueueDraft(draft);
      if (postId) {
        console.log(`Enqueued draft: ${postId}`);
      } else {
        console.log('Note: Could not enqueue to Supabase (table may not exist yet). Continuing with digest...');
      }
    } else {
      console.log('Weekend — no draft generated.');
    }
  }

  // Step 2: Get all pending drafts
  console.log('\nFetching pending drafts...');
  const pending = await getPendingDrafts();
  console.log(`Found ${pending.length} pending post(s)`);

  // Step 3: Build and send approval digest
  const html = buildApprovalDigestHtml(pending);
  const text = buildApprovalDigestPlainText(pending);

  const recipient = process.env.SOCIAL_DIGEST_EMAIL || process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.log('\n--- No RESEND_API_KEY, printing to console ---\n');
    console.log(text);
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const subject = `LinkedIn Queue ${dateStr} — ${pending.length} post${pending.length === 1 ? '' : 's'} for review`;

  console.log(`\nSending: "${subject}" → ${recipient}`);

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
      headers: {
        'X-DWS-Email-Type': 'social-digest',
      },
    }),
  });

  if (response.ok) {
    const result = (await response.json()) as { id: string };
    console.log(`Social digest sent (id: ${result.id})`);
  } else {
    const errorBody = await response.text();
    console.error('Failed to send social digest:', response.status, errorBody);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Social digest error:', err);
  process.exit(1);
});
