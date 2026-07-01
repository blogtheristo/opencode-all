#!/usr/bin/env npx tsx
/**
 * Standalone Morning Briefing Sender
 *
 * Runs the CEO Cockpit morning briefing outside of the Express server.
 * Designed for GitHub Actions cron, manual execution, or any CI/CD trigger.
 *
 * Usage:
 *   npm run morning:briefing
 *   node --import tsx scripts/send-morning-briefing.ts
 *   node --import tsx scripts/send-morning-briefing.ts --force   # bypass Helsinki 06:00 guard (local test)
 *
 * Required env vars:
 *   SMTP_HOST + SMTP_USER + SMTP_PASS (Amazon SES)
 *   SUPABASE_URL + SUPABASE_SERVICE_KEY (for live data)
 *
 * Optional env vars:
 *   OUTREACH_DIGEST_EMAIL (default: risto@lifetime.fi)
 *   EMAIL_FROM (default: risto@onelifetime.world)
 *   MRR_EUR, WEEKLY_COMMITS, MVP_ETA
 */

const dotenv = (await import('dotenv')).default;
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const { collectCockpitData } = await import('../src/morning-briefing/data-collectors.js');
const { buildCockpitHtml, buildCockpitPlainText } = await import('../src/morning-briefing/briefing-template.js');
const { sendEmail } = await import('../src/utils/send-email.js');

async function main(): Promise<void> {
  if (process.argv.includes('--force')) {
    process.env.SKIP_TIME_CHECK = 'true';
  }

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

  if (!process.env.SMTP_HOST) {
    console.error('ERROR: SMTP_HOST not configured. Amazon SES (SMTP) is required.');
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

  const result = await sendEmail({ from: fromAddress, to: recipient, subject, html, text });

  if (result.ok) {
    console.log(`Sent via ${result.transport}. Morning briefing delivered to ${recipient}`);
    return;
  }

  console.error(`Email delivery failed: ${result.error}`);
  process.exit(1);
}

main().catch((err) => {
  console.error('Morning briefing failed:', err);
  process.exit(1);
});
