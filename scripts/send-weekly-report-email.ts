#!/usr/bin/env npx tsx
/**
 * Weekly Report — Email Sender
 *
 * Sends the generated report.md to risto@lifetime.fi from risto@onelifetime.world.
 * Uses Amazon SES (SMTP) primary, Resend fallback.
 *
 * Usage:
 *   npx tsx scripts/send-weekly-report-email.ts [report.md]
 *
 * Env (from GitHub Actions):
 *   SMTP_HOST, SMTP_USER, SMTP_PASS (Amazon SES)
 *   RESEND_API_KEY (fallback)
 *   EMAIL_FROM (default: risto@onelifetime.world)
 *   OUTREACH_DIGEST_EMAIL (default: risto@lifetime.fi)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { sendEmail } from '../src/utils/send-email.js';

const reportPath = process.argv[2] || 'report.md';
const absPath = resolve(process.cwd(), reportPath);

if (!existsSync(absPath)) {
  console.error(`Report file not found: ${absPath}`);
  process.exit(1);
}

const content = readFileSync(absPath, 'utf-8');
const recipient = process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const hasTransport = !!(process.env.SMTP_HOST || process.env.RESEND_API_KEY);

if (!hasTransport) {
  console.log('No SMTP or RESEND_API_KEY — skipping weekly report email');
  process.exit(0);
}

const lines = content.split('\n');
const firstLine = lines[0] || '';
const weekMatch = firstLine.match(/## Weekly Report — (.+)/);
const week = weekMatch ? weekMatch[1] : new Date().toISOString().slice(0, 10);
const subject = `Weekly Report — ${week}`;

// Simple HTML wrap for markdown (basic)
const html = `<pre style="font-family: sans-serif; white-space: pre-wrap;">${content
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')}</pre>`;

const result = await sendEmail({
  from: fromAddress,
  to: recipient,
  subject,
  html,
  text: content,
});

if (result.ok) {
  console.log(`Weekly report email sent via ${result.transport}`);
} else {
  console.error('Failed to send weekly report:', result.error);
  process.exit(1);
}
