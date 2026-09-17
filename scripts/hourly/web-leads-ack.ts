/**
 * Web Leads Acknowledgement (Hourly)
 *
 * Auto-discovered by DGX Spark day-runner.sh (scripts/hourly/*.ts convention).
 * Sends a one-time, branded acknowledgement email (via Amazon SES — SES-only per
 * CLAUDE.md, never Resend, never noreply@) to people who submitted the footer
 * newsletter, the /free-audit/ form, or a contact form on the public sites.
 *
 * Closes the loop the morning brief opened: leads land in web_leads, the brief
 * surfaces them to sales, and this gives the lead instant confirmation.
 *
 * SAFETY (this is RED-zone outbound email):
 *   - DRY-RUN BY DEFAULT. It only sends when WEB_LEADS_ACK_ENABLED=true
 *     (or --send is passed). Otherwise it logs what it WOULD send and exits.
 *   - Requires migration 071_web_leads_ack.sql applied (ack_sent_at column).
 *   - ack_sent_at is stamped only after a successful send, so no lead is ever
 *     acknowledged twice.
 *   - Missing Supabase/SMTP config → logs and exits 0 (never throws into the runner).
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_KEY, EMAIL_FROM (default
 *   risto@onelifetime.world), ACK_REPLY_TO (default sales@lifetime.fi),
 *   WEB_LEADS_ACK_ENABLED.
 *
 * Code-Version: 1.0
 * Date: 2026-06-23
 * Owner: Lifetime Oy
 */

import 'dotenv/config';
import { escapeHtml, sendEmail } from '../../src/utils/send-email.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const REPLY_TO = process.env.ACK_REPLY_TO || 'sales@lifetime.fi';
const SEND = process.env.WEB_LEADS_ACK_ENABLED === 'true' || process.argv.includes('--send');
const LIMIT = 50;

interface WebLead {
  id: string;
  source: string;
  email: string;
  name: string | null;
  company: string | null;
  industry: string | null;
}

/** Source-specific subject + body. Plain, branded, no noreply. */
function composeAck(lead: WebLead): { subject: string; html: string; text: string } {
  const name = (lead.name || '').trim();
  const hi = name ? `Hi ${escapeHtml(name)},` : 'Hi,';
  const sign =
    'Lifetime Oy &middot; Espoo, Finland &middot; <a href="https://dws10.com/">dws10.com</a>';

  const bodies: Record<string, { subject: string; lead: string }> = {
    newsletter: {
      subject: "You're on the list — Lifetime Scope",
      lead: "Thanks for subscribing. You'll get the signal on CSRD, CBAM, EU ETS and the EU AI Act — what changes, when, and what to do about it. No spam, unsubscribe anytime.",
    },
    free_audit: {
      subject: 'We received your free EU compliance audit request',
      lead: 'Thanks for requesting a free EU compliance readiness audit. Our team will review your details and get back to you within two business days with where you stand and the next moves worth making.',
    },
    contact: {
      subject: 'We received your message',
      lead: "Thanks for reaching out to Lifetime Oy. We've received your message and will be in touch shortly.",
    },
  };

  const b = bodies[lead.source] || bodies.contact;
  const ctx = [lead.company, lead.industry]
    .filter(Boolean)
    .map((s) => escapeHtml(String(s)))
    .join(' · ');
  const ctxLine = ctx ? `<p style="color:#64748b;font-size:13px;">On file: ${ctx}</p>` : '';

  const html = `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#1e293b;max-width:560px;">
  <p>${hi}</p>
  <p>${b.lead}</p>
  ${ctxLine}
  <p>In the meantime, you can request a <a href="https://dws10.com/free-audit/">free audit</a>, <a href="https://dws10.com/book/">book a consultation</a>, or explore the <a href="https://dws10.com/buy/">store</a>.</p>
  <p style="margin-top:24px;color:#64748b;font-size:13px;">${sign}</p>
</div>`;

  const text = `${name ? `Hi ${name},` : 'Hi,'}\n\n${b.lead}\n\nFree audit: https://dws10.com/free-audit/\nBook: https://dws10.com/book/\nStore: https://dws10.com/buy/\n\nLifetime Oy · Espoo, Finland · https://dws10.com/`;

  return { subject: b.subject, html, text };
}

async function supabase(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_KEY as string,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      ...(init?.headers || {}),
    },
  });
}

async function main(): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.log('[web-leads-ack] SUPABASE_URL/SUPABASE_SERVICE_KEY not set — skipping (no-op).');
    return;
  }

  const res = await supabase(
    `web_leads?ack_sent_at=is.null&order=created_at.asc&limit=${LIMIT}&select=id,source,email,name,company,industry`,
  );
  if (!res.ok) {
    // Likely migration 071 not applied yet (no ack_sent_at column). Fail loud, don't throw.
    console.error(
      `[web-leads-ack] query failed: ${res.status} ${res.statusText}. Is migration 071_web_leads_ack.sql applied?`,
    );
    return;
  }
  const leads = (await res.json()) as WebLead[];
  if (leads.length === 0) {
    console.log('[web-leads-ack] no pending leads.');
    return;
  }

  console.log(
    `[web-leads-ack] ${leads.length} pending lead(s); mode=${SEND ? 'SEND' : 'DRY-RUN'}.`,
  );
  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const { subject, html, text } = composeAck(lead);
    if (!SEND) {
      console.log(`  [dry-run] -> ${lead.email} (${lead.source}) "${subject}"`);
      continue;
    }

    const result = await sendEmail({
      from: EMAIL_FROM,
      to: lead.email,
      subject,
      html,
      text,
      replyTo: REPLY_TO,
      source: 'platform',
      templateType: `web_lead_ack_${lead.source}`,
      metadata: { lead_id: lead.id, source: lead.source },
    });

    if (!result.ok) {
      failed++;
      console.error(`  [fail] ${lead.email}: ${result.error}`);
      continue; // leave ack_sent_at null so it retries next hour
    }

    const patch = await supabase(`web_leads?id=eq.${lead.id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ ack_sent_at: new Date().toISOString() }),
    });
    if (!patch.ok) {
      // Email sent but mark failed — log loudly; manual reconcile beats silent double-send risk.
      console.error(
        `  [warn] sent to ${lead.email} but failed to stamp ack_sent_at (${patch.status}).`,
      );
    }
    sent++;
    console.log(`  [sent] ${lead.email} (${lead.source})`);
  }

  console.log(
    `[web-leads-ack] done. ${SEND ? `sent=${sent} failed=${failed}` : `would-send=${leads.length}`}`,
  );
}

main().catch((err) => {
  console.error('[web-leads-ack] unexpected error:', err instanceof Error ? err.message : err);
  process.exitCode = 0; // never break the hourly runner
});
