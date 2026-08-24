/**
 * Verify Amazon SES SMTP (nodemailer.verify) using the same transport as send-email.ts.
 * Loads .env / .env.local — no need to export vars manually.
 *
 * If you see "Cannot find module ... tsx/dist/cli.mjs", dependencies are missing:
 *   npm install
 * On Windows, if install fails on @xdevplatform/xurl (unzip missing), use:
 *   npm install --ignore-scripts
 *
 * Run:
 *   npm run diag:ses
 *
 * Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (see .env.example)
 * Optional: SMTP_FORCE_IPV4=true if SES fails with IPv6 on Windows
 */

import dotenv from 'dotenv';
import { createSmtpTransportFromEnv } from '../src/utils/send-email.js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const smtp = createSmtpTransportFromEnv();
if (!smtp) {
  console.error(
    'Missing SMTP_* in environment. Ensure repo root .env has SMTP_HOST, SMTP_USER, SMTP_PASS.\n' +
      'Note: Cursor "Boot env terminal" loads .env.mcp and merges .env.',
  );
  process.exit(1);
}

try {
  await smtp.verify();
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || '587';
  const secure = process.env.SMTP_SECURE === 'true';
  console.log(`SES SMTP OK: ${host}:${port} (secure=${secure})`);
  process.exit(0);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error('SES SMTP verify failed:', msg);

  if (msg.includes('535') || msg.toLowerCase().includes('invalid login') || msg.toLowerCase().includes('authentication credentials')) {
    console.error(`
AWS rejected SMTP username/password (535). Checklist (not a code bug):
  1) Use SES "SMTP credentials" from the SAME region as SMTP_HOST
     (e.g. eu-north-1 → email-smtp.eu-north-1.amazonaws.com).
     IAM access keys are NOT the same as SES SMTP username/password — create SMTP creds in:
     SES console → Account dashboard → SMTP settings → Create SMTP credentials.
  2) .env: no extra spaces or quotes; SMTP_USER + SMTP_PASS must be the pair from that dialog.
  3) Port 587 → SMTP_SECURE=false. Port 465 → SMTP_SECURE=true.
`);
  } else {
    console.error(
      'Tip: For port 587 use SMTP_SECURE=false. If connection fails on Windows, try SMTP_FORCE_IPV4=true in .env',
    );
  }
  process.exit(1);
}
