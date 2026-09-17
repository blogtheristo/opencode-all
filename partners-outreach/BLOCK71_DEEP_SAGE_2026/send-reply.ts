#!/usr/bin/env -S npx tsx
/**
 * One-shot send: BLOCK71 Deep SAGE 2026 reply to Steve Leong.
 *
 * Transport: Amazon SES SMTP only (per CLAUDE.md non-negotiable rule #4).
 * Uses src/utils/send-email.ts which uses nodemailer against SES SMTP.
 *
 * Run from a host with prod env vars loaded (your local dev box or the
 * production server — NOT inside the Claude Code remote container):
 *   SMTP_HOST=email-smtp.eu-north-1.amazonaws.com
 *   SMTP_PORT=587
 *   SMTP_USER=<SES SMTP credential>
 *   SMTP_PASS=<SES SMTP credential>
 *   EMAIL_FROM=risto@onelifetime.world
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY  (for audit log to email_queue)
 *
 * Usage:
 *   npx tsx partners-outreach/BLOCK71_DEEP_SAGE_2026/send-reply.ts
 *
 * Dry-run (validates env + renders without sending):
 *   DRY_RUN=1 npx tsx partners-outreach/BLOCK71_DEEP_SAGE_2026/send-reply.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sendEmail } from '../../src/utils/send-email.js';

const TO = 'steveleonghw@nus.edu.sg';
const REPLY_TO = 'risto.paarni@lifetime.fi';
const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const SUBJECT = 'Re: BLOCK71 Deep SAGE 2026 — Lifetime Oy is in, and we\'d like to apply too';
const HTML_PATH = resolve(
  process.cwd(),
  'partners-outreach/BLOCK71_DEEP_SAGE_2026/REPLY_STEVE_LEONG.html',
);

async function main(): Promise<void> {
  const html = readFileSync(HTML_PATH, 'utf-8');

  console.log('BLOCK71 Deep SAGE 2026 — reply to Steve Leong');
  console.log(`  to:       ${TO}`);
  console.log(`  reply-to: ${REPLY_TO}`);
  console.log(`  from:     ${FROM}`);
  console.log(`  subject:  ${SUBJECT}`);
  console.log(`  html:     ${HTML_PATH} (${html.length} chars)`);
  console.log(`  smtp:     ${process.env.SMTP_HOST || '(unset — send will fail)'}`);

  if (process.env.DRY_RUN) {
    console.log('\n[DRY_RUN] Skipping send.');
    return;
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error(
      '\nFAIL: SMTP_HOST / SMTP_USER / SMTP_PASS not set. Load prod env before running.',
    );
    process.exit(2);
  }

  console.log('\nSending via SES SMTP ...');
  const result = await sendEmail({
    from: FROM,
    to: TO,
    subject: SUBJECT,
    html,
    replyTo: REPLY_TO,
    source: 'outreach',
    templateType: 'partner_outreach_reply',
    metadata: {
      programme: 'BLOCK71 Deep SAGE 2026',
      partner: 'BLOCK71 Singapore / NUS Enterprise',
      contact: 'Steve Leong',
      branch: 'claude/block71-deep-sage-2026-xNiom',
    },
  });

  if (result.ok) {
    console.log(`OK — sent via ${result.transport}. Audit row: ${result.auditId || '(no Supabase)'}`);
  } else {
    console.error(`FAIL: ${result.error}`);
    console.error(`Audit row (failed): ${result.auditId || '(no Supabase)'}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
