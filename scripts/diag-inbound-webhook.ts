/**
 * Inbound Webhook Diagnostic
 *
 * Prints the last N rows of `inbound_emails` plus a 7-day rollup of parse_ok vs failed.
 * Use this when the morning brief looks stale to verify that T:XXXX reply commands
 * are actually landing — if `inbound_emails` is empty (or all rows are 7+ days old),
 * SES inbound routing is broken and the brief will appear stuck.
 *
 * Schema (supabase/migrations/026_security_fixes.sql:309):
 *   id, provider, provider_message_id, received_at, from_email, subject,
 *   thread_token, command_line, parse_ok, error, raw_payload.
 *
 * Usage:
 *   npx tsx scripts/diag-inbound-webhook.ts            # last 20 rows + 7-day stats
 *   LIMIT=50 npx tsx scripts/diag-inbound-webhook.ts   # custom row count
 *   DAYS=14 npx tsx scripts/diag-inbound-webhook.ts    # custom stats window
 *
 * Environment:
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY (required)
 *
 * Exits non-zero only on connection / query failure. An empty result is healthy
 * to print (it IS the diagnosis); the script tells you so explicitly.
 *
 * Code-Version: 1.0
 * Owner: Lifetime Oy
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

interface InboundEmail {
  id: string;
  provider: string | null;
  provider_message_id: string;
  received_at: string;
  from_email: string | null;
  subject: string | null;
  thread_token: string | null;
  command_line: string | null;
  parse_ok: boolean | null;
  error: string | null;
}

const LIMIT = Number(process.env.LIMIT || 20);
const DAYS = Number(process.env.DAYS || 7);

function shortId(s: string | null | undefined, n = 8): string {
  if (!s) return '—';
  return s.length <= n ? s : `…${s.slice(-n)}`;
}

function fmtTimestamp(iso: string): string {
  return iso.replace('T', ' ').replace(/\.\d+Z$/, 'Z');
}

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY required');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const sinceISO = new Date(Date.now() - DAYS * 86_400_000).toISOString();

  // ---- Recent rows -------------------------------------------------------
  const { data: recent, error: recentErr } = await supabase
    .from('inbound_emails')
    .select(
      'id, provider, provider_message_id, received_at, from_email, subject, thread_token, command_line, parse_ok, error',
    )
    .order('received_at', { ascending: false })
    .limit(LIMIT);

  if (recentErr) {
    console.error('Query failed (recent rows):', recentErr.message);
    process.exit(1);
  }

  const rows = (recent || []) as InboundEmail[];

  console.log(`Inbound Webhook Diagnostic — ${new Date().toISOString()}`);
  console.log('='.repeat(70));
  console.log(`Last ${LIMIT} rows from inbound_emails:`);
  console.log('-'.repeat(70));

  if (rows.length === 0) {
    console.log('  (empty) — no inbound_emails rows at all.');
    console.log('  Likely cause: SES inbound routing not delivering, or webhook endpoint unreachable.');
  } else {
    for (const r of rows) {
      const status = r.parse_ok === true ? 'OK ' : r.parse_ok === false ? 'FAIL' : ' ?  ';
      const tok = r.thread_token ? `T:${r.thread_token}` : '       —      ';
      const cmd = (r.command_line || r.error || '').replace(/\s+/g, ' ').slice(0, 50);
      console.log(
        `  ${fmtTimestamp(r.received_at)} [${status}] ${tok}  ${shortId(r.provider_message_id, 10)}  ${cmd}`,
      );
    }
  }

  // ---- 7-day rollup ------------------------------------------------------
  const { data: window, error: windowErr } = await supabase
    .from('inbound_emails')
    .select('parse_ok, received_at')
    .gte('received_at', sinceISO);

  if (windowErr) {
    console.error('Query failed (window stats):', windowErr.message);
    process.exit(1);
  }

  const winRows = (window || []) as Array<{ parse_ok: boolean | null; received_at: string }>;
  const ok = winRows.filter((r) => r.parse_ok === true).length;
  const fail = winRows.filter((r) => r.parse_ok === false).length;
  const unknown = winRows.length - ok - fail;

  console.log('');
  console.log(`Last ${DAYS} days (since ${sinceISO}):`);
  console.log('-'.repeat(70));
  console.log(`  Total received:   ${winRows.length}`);
  console.log(`  Parse OK:         ${ok}`);
  console.log(`  Parse FAIL:       ${fail}`);
  console.log(`  Parse unknown:    ${unknown}`);

  // ---- Health verdict ----------------------------------------------------
  console.log('');
  console.log('Verdict:');
  console.log('-'.repeat(70));
  if (rows.length === 0) {
    console.log('  RED — no inbound rows ever. Check SES MX records + /webhooks/inbound route.');
  } else if (winRows.length === 0) {
    const last = rows[0]?.received_at;
    console.log(
      `  RED — no inbound in the last ${DAYS}d. Latest row was ${last}. SES routing likely broken.`,
    );
  } else if (fail > ok) {
    console.log(`  YELLOW — more FAIL (${fail}) than OK (${ok}) in last ${DAYS}d. Parser regression?`);
  } else {
    console.log(`  GREEN — ${ok} parsed OK in last ${DAYS}d. Webhook is alive.`);
    console.log('  If brief still looks stale, the problem is upstream of the parser:');
    console.log('  threads aren\'t being progressed via T:XXXX replies, period.');
  }
}

main().catch((err) => {
  console.error('[diag-inbound-webhook] fatal:', err);
  process.exit(1);
});
