/**
 * scripts/send-price-list-email.ts
 *
 * Manual operator utility to email the quarterly price-list snapshot to a
 * reviewed recipient list.
 *
 * RED-ZONE: emails are BLOCKED under the Auto-Mode Trust Boundary
 * (CLAUDE.md). This script must be invoked explicitly by an operator;
 * it is intentionally NOT wired into any cron, GitHub Actions workflow,
 * or DGX Spark day-runner.
 *
 * Safety defaults:
 *   - Dry-run unless --send is passed.
 *   - Recipients must come from an explicit --recipients CSV file.
 *   - Stops after the first error; no retries in bulk.
 *   - Every send is captured in logs/email-audit.jsonl by src/utils/send-email.ts.
 *
 * Usage:
 *   npx tsx scripts/send-price-list-email.ts \
 *     --version 2026.Q2 \
 *     --recipients ./Partners/price-list-recipients.csv \
 *     [--from risto@onelifetime.world] \
 *     [--send]               # actually send; default is dry-run
 *
 * Recipients CSV format (header required):
 *   email,name,company
 *   jane@acme.com,Jane Doe,Acme Oy
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { sendEmail } from '../src/utils/send-email.js';

interface Recipient {
  email: string;
  name?: string;
  company?: string;
}

interface Args {
  version?: string;
  recipients?: string;
  from: string;
  send: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { from: process.env.EMAIL_FROM || 'risto@onelifetime.world', send: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === '--version') {
      args.version = next;
      i++;
    } else if (a === '--recipients') {
      args.recipients = next;
      i++;
    } else if (a === '--from') {
      args.from = next;
      i++;
    } else if (a === '--send') {
      args.send = true;
    }
  }
  return args;
}

function parseRecipientsCsv(path: string): Recipient[] {
  const text = readFileSync(path, 'utf8').trim();
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) throw new Error(`${path}: need header + at least one row`);
  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const emailIdx = header.indexOf('email');
  if (emailIdx === -1) throw new Error(`${path}: missing 'email' column in header`);
  const nameIdx = header.indexOf('name');
  const companyIdx = header.indexOf('company');
  const out: Recipient[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map((c) => c.trim());
    const email = row[emailIdx];
    if (!email || !email.includes('@')) continue;
    out.push({
      email,
      name: nameIdx >= 0 ? row[nameIdx] : undefined,
      company: companyIdx >= 0 ? row[companyIdx] : undefined,
    });
  }
  return out;
}

function renderEmail(
  version: string,
  snapshotHtml: string,
  r: Recipient,
): { subject: string; html: string } {
  const subject = `DWS IQ Price List ${version} — valid for 90 days`;
  const greeting = r.name ? `Hi ${escapeHtml(r.name)},` : 'Hello,';
  const companyLine = r.company ? `<p>For ${escapeHtml(r.company)}.</p>` : '';
  const html = `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;color:#111;max-width:680px;margin:0 auto;padding:24px">
  <p>${greeting}</p>
  ${companyLine}
  <p>The <strong>DWS IQ Price List (${escapeHtml(version)})</strong> has been stamped and is valid for 90 days from the stamp date.</p>
  <p>Live page: <a href="https://dws10.com/price-list/">https://dws10.com/price-list/</a><br/>
  Stamped snapshot (this version): <a href="https://dws10.com/price-list/versions/price-list-v${escapeHtml(version)}.html">price-list-v${escapeHtml(version)}.html</a></p>
  <p>All prices are B2B, EUR, VAT 0% (reverse charge). Country-specific VAT added at checkout if applicable — see the 5-language VAT reference on the page.</p>
  <p>For a signed quote, reply to this email with the product IDs you are interested in.</p>
  <p>— Risto Anton Päärni<br/>Lifetime Oy (BUID 0772407-9 · VAT FI07724079)</p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0"/>
  <details style="font-size:0.85rem;color:#64748b">
    <summary style="cursor:pointer">Embedded snapshot (inline)</summary>
    ${snapshotHtml}
  </details>
</body></html>`;
  return { subject, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.version) {
    console.error('ERROR: --version <e.g. 2026.Q2> is required.');
    process.exit(2);
  }
  if (!args.recipients) {
    console.error('ERROR: --recipients <path-to-csv> is required.');
    process.exit(2);
  }
  const repoRoot = resolve(__dirname, '..');
  const snapshotPath = join(
    repoRoot,
    'dws10.com/price-list/versions',
    `price-list-v${args.version}.html`,
  );
  if (!existsSync(snapshotPath)) {
    console.error(`ERROR: snapshot not found: ${snapshotPath}`);
    console.error('Run `node scripts/gen-price-list-html.cjs` first.');
    process.exit(2);
  }
  const snapshotHtml = readFileSync(snapshotPath, 'utf8');
  const recipientsPath = resolve(args.recipients);
  if (!existsSync(recipientsPath)) {
    console.error(`ERROR: recipients file not found: ${recipientsPath}`);
    process.exit(2);
  }
  const recipients = parseRecipientsCsv(recipientsPath);
  console.log(
    `[send-price-list] version=${args.version} recipients=${recipients.length} mode=${args.send ? 'SEND' : 'DRY-RUN'}`,
  );
  if (!args.send) {
    console.log('Dry-run only. Re-run with --send to dispatch. First 3 recipients:');
    recipients
      .slice(0, 3)
      .forEach((r) => console.log(`  ${r.email} (${r.name || '—'}, ${r.company || '—'})`));
    return;
  }

  let ok = 0;
  let fail = 0;
  for (const r of recipients) {
    const { subject, html } = renderEmail(args.version, snapshotHtml, r);
    const res = await sendEmail({
      from: args.from,
      to: r.email,
      subject,
      html,
      source: 'platform',
      templateType: 'price-list-quarterly',
      metadata: { priceListVersion: args.version, recipientCompany: r.company || null },
    });
    if (res.ok) {
      ok++;
      console.log(`  OK   ${r.email} (transport=${res.transport || '?'})`);
    } else {
      fail++;
      console.error(`  FAIL ${r.email}: ${res.error || 'unknown'}`);
      break;
    }
  }
  console.log(`[send-price-list] done: ok=${ok} fail=${fail}`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
