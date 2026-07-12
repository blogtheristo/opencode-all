/**
 * One-off / manual: send a plain summary email (Amazon SES SMTP).
 * Usage: npx tsx scripts/send-summary-email.ts
 */
import dotenv from 'dotenv';
import { sendEmail } from '../src/utils/send-email.js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const SUBJECT = 'DWS6 session summary — TED dedup, SES, cron';

const HTML = `
<pre style="font-family: ui-sans-serif, system-ui, sans-serif; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">
TED / construction leads
- DB dedup (migration 047): UNIQUE (company_name, tender_id); trigger keeps keys in sync with buyer_name + ted_notice_id; upsert on_conflict=company_name,tender_id; tender_id follows TED notice id.
- Compliance keywords + ERP hints; ted_leads view; outreach batch, 50/day UTC cap (RPC ted_outreach_reserve_send + release on SES failure), follow-ups, weekly learning_log.
- npm: ted:fetch, ted:daily, ted:outreach, ted:followup, ted:learning. Workflows: ted-pipeline (06:00 UTC), ted-followup, ted-learning-weekly.

SES / email
- send-email: requireTLS, TLS 1.2, trim SMTP_*, createSmtpTransportFromEnv; Open-EnvTerminal.ps1 merges .env over .env.mcp.
- diag:ses, morning:briefing scripts; GitHub secrets for SMTP in Actions.

Other
- Morning briefing: npm run morning:briefing; Run-MorningBriefing.ps1 for Task Scheduler; ADMIN_MANUAL Appendix A updated.

Apply Supabase migration 047 before production dedup.
</pre>
`;

async function main(): Promise<void> {
  const to = process.argv[2] || 'risto.anton@proton.me';
  const from = process.env.EMAIL_FROM || 'risto@onelifetime.world';

  if (!process.env.SMTP_HOST) {
    console.error('No SMTP_HOST (Amazon SES) — cannot send.');
    process.exit(1);
  }

  const result = await sendEmail({
    from,
    to,
    subject: SUBJECT,
    html: HTML,
    text: HTML.replace(/<[^>]+>/g, ''),
  });

  if (!result.ok) {
    console.error('Send failed:', result.error);
    process.exit(1);
  }
  console.log('Sent via', result.transport, '→', to);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
