#!/usr/bin/env -S npx tsx
/**
 * One-shot send: SIRA / Arctic Startup Innovation Awards reply to Nilüfer Çomak.
 *
 * Transport: Amazon SES SMTP only (per CLAUDE.md non-negotiable rule #4 — never Resend).
 * Sender is the SES-verified risto@onelifetime.world (never a noreply@ address, rule #3).
 * Uses src/utils/send-email.ts (nodemailer against SES SMTP), so every send is also
 * persisted to the Supabase email_queue audit trail.
 *
 * IMPORTANT: Run from a host with prod env vars loaded — your local dev box or the
 * production server — NOT inside the Claude Code remote container (outbound email is
 * a blocked RED-zone action there):
 *   SMTP_HOST=email-smtp.eu-north-1.amazonaws.com
 *   SMTP_PORT=587
 *   SMTP_USER=<SES SMTP credential>
 *   SMTP_PASS=<SES SMTP credential>
 *   EMAIL_FROM=risto@onelifetime.world
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY  (for audit log to email_queue)
 *
 * Dry-run (validates env + renders, does NOT send):
 *   DRY_RUN=1 npx tsx docs/sira-innovation-awards/email/send-reply-nilufer.ts
 *
 * Real send:
 *   npx tsx docs/sira-innovation-awards/email/send-reply-nilufer.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sendEmail } from '../../../src/utils/send-email.js';

const TO = 'nilufer.comak@arcticstartup.com';
const REPLY_TO = 'risto.paarni@lifetime.fi';
const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const SUBJECT = 'Re: Innovation Awards — thank you (and a note on timing)';
const HTML_PATH = resolve(process.cwd(), 'docs/sira-innovation-awards/email/REPLY_NILUFER.html');

async function main(): Promise<void> {
  const html = readFileSync(HTML_PATH, 'utf-8');

  console.log('SIRA Innovation Awards — reply to Nilüfer Çomak');
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
    templateType: 'awards_reply',
    metadata: {
      programme: 'Arctic Startup Innovation Awards 2026 (SIRA)',
      contact: 'Nilüfer Çomak',
      branch: 'claude/sira-nilufer-email-send',
    },
  });

  if (result.ok) {
    console.log(
      `OK — sent via ${result.transport}. Audit row: ${result.auditId || '(no Supabase)'}`,
    );
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
