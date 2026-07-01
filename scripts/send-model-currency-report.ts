/**
 * send-model-currency-report.ts
 *
 * Emails a real report to the HIC (risto@onelifetime.world) covering:
 *   1. LLM model drift  — deprecated/suspended models still referenced in
 *      src/agents/*, plus candidate models not yet adopted (from the weekly
 *      llm-currency-check task + config/llm-registry.json).
 *   2. Cron health       — failing/stale scheduled jobs from
 *      logs/day-runner-state.json.
 *
 * Transport: Amazon SES (SMTP) ONLY, via src/utils/send-email.ts. NEVER Resend.
 * Sender/recipient default to the named human (never noreply@).
 *
 * Run standalone:   npx tsx scripts/send-model-currency-report.ts
 * Called weekly by: scripts/weekly/llm-currency-check.sh (after the scan)
 *
 * Fails loud: prints the SendEmailResult and exits non-zero if the send fails,
 * so a silent "no report ever arrived" can't happen unnoticed.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendEmail, escapeHtml } from '../src/utils/send-email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(ROOT, 'config', 'llm-registry.json');
const AGENTS_DIR = path.join(ROOT, 'src', 'agents');
const DAY_RUNNER_STATE = path.join(ROOT, 'logs', 'day-runner-state.json');

const RECIPIENT = process.env.EMAIL_RECIPIENT?.trim() || 'risto@onelifetime.world';
const SENDER = process.env.EMAIL_FROM?.trim() || 'risto@onelifetime.world';

interface RegistryModel {
  id: string;
  provider: string;
  tier?: string;
  status: 'current' | 'candidate' | 'deprecated' | 'suspended' | 'retired';
  replacement?: string;
  notes?: string;
}

function walkTs(dir: string): string[] {
  let out: string[] = [];
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walkTs(p));
    else if (e.isFile() && p.endsWith('.ts')) out.push(p);
  }
  return out;
}

function scanDrift() {
  const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8')) as {
    version?: string;
    models: RegistryModel[];
  };
  const files = walkTs(AGENTS_DIR).map((f) => ({
    rel: path.relative(AGENTS_DIR, f),
    text: fs.readFileSync(f, 'utf8'),
  }));
  const usedIn = (id: string) => files.filter((f) => f.text.includes(id)).map((f) => f.rel);

  const flags: Array<{
    id: string;
    status: string;
    replacement?: string;
    files: string[];
    notes?: string;
  }> = [];
  const candidates: Array<{ id: string; provider: string; tier?: string; notes?: string }> = [];

  for (const m of registry.models) {
    const hits = usedIn(m.id);
    if (['deprecated', 'suspended', 'retired'].includes(m.status) && hits.length) {
      flags.push({
        id: m.id,
        status: m.status,
        replacement: m.replacement,
        files: hits,
        notes: m.notes,
      });
    }
    if (m.status === 'candidate' && hits.length === 0) {
      candidates.push({ id: m.id, provider: m.provider, tier: m.tier, notes: m.notes });
    }
  }
  return { version: registry.version, scanned: files.length, flags, candidates };
}

function scanCronHealth(): { issues: string[]; note: string } {
  if (!fs.existsSync(DAY_RUNNER_STATE)) {
    return {
      issues: [],
      note: 'no day-runner-state.json found (scheduler may not have run in this environment)',
    };
  }
  try {
    const state = JSON.parse(fs.readFileSync(DAY_RUNNER_STATE, 'utf8')) as Record<string, unknown>;
    const issues: string[] = [];
    // Best-effort: surface any entry whose value/status looks like a failure.
    for (const [job, val] of Object.entries(state)) {
      const s = JSON.stringify(val).toLowerCase();
      if (s.includes('fail') || s.includes('error')) issues.push(`${job}: ${JSON.stringify(val)}`);
    }
    return { issues, note: `parsed ${Object.keys(state).length} job entries` };
  } catch (e) {
    return { issues: [], note: `could not parse day-runner-state.json: ${(e as Error).message}` };
  }
}

function buildReport() {
  const drift = scanDrift();
  const cron = scanCronHealth();
  const stamp = new Date().toISOString();

  const textLines: string[] = [];
  textLines.push(`DWS — LLM model-drift & cron health report`);
  textLines.push(`Generated: ${stamp}`);
  textLines.push(
    `Registry: config/llm-registry.json v${drift.version ?? '?'} — scanned ${drift.scanned} agent files`,
  );
  textLines.push('');
  textLines.push(`== MODEL DRIFT (${drift.flags.length} to fix) ==`);
  if (!drift.flags.length) textLines.push('  none — all referenced models current');
  for (const f of drift.flags) {
    const to = f.replacement ? ` -> migrate to ${f.replacement}` : '';
    textLines.push(`  - ${f.id} [${f.status}]${to}`);
    textLines.push(`      in: ${f.files.join(', ')}`);
    if (f.notes) textLines.push(`      ${f.notes}`);
  }
  textLines.push('');
  textLines.push(`== CANDIDATES TO EVALUATE (${drift.candidates.length}) ==`);
  if (!drift.candidates.length) textLines.push('  none');
  for (const c of drift.candidates)
    textLines.push(
      `  - ${c.id} (${c.provider}${c.tier ? ', ' + c.tier : ''})${c.notes ? ' — ' + c.notes : ''}`,
    );
  textLines.push('');
  textLines.push(`== CRON HEALTH ==`);
  textLines.push(`  ${cron.note}`);
  if (cron.issues.length) for (const i of cron.issues) textLines.push(`  ! ${i}`);
  else textLines.push('  no failing/stale jobs detected');
  textLines.push('');
  textLines.push(`To apply the model migrations (HIC-gated):`);
  textLines.push(`  npx tsx scripts/apply-model-updates.ts            # dry-run`);
  textLines.push(`  npx tsx scripts/apply-model-updates.ts --apply    # write changes`);

  const text = textLines.join('\n');
  const html = `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:13px;line-height:1.5">${escapeHtml(text)}</pre>`;
  const subject = `DWS model-drift report — ${drift.flags.length} to fix, ${drift.candidates.length} candidate(s)`;
  return { subject, text, html, drift, cron };
}

async function main() {
  const { subject, text, html } = buildReport();

  // Print the report to stdout so the cron log always has it, even if SES fails.
  console.log(text);
  console.log('');

  const res = await sendEmail({
    from: SENDER,
    to: RECIPIENT,
    subject,
    html,
    text,
    source: 'platform',
    templateType: 'llm-currency-report',
  });

  if (res.ok) {
    console.log(
      `[report] SENT to ${RECIPIENT} via ${res.transport} (audit ${res.auditId ?? 'n/a'})`,
    );
    process.exit(0);
  } else {
    console.error(`[report] SEND FAILED to ${RECIPIENT}: ${res.error}`);
    console.error(
      `[report] The report above was NOT delivered. Ensure SMTP_HOST/SMTP_USER/SMTP_PASS (Amazon SES) are set on the host that runs this cron.`,
    );
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`[report] fatal: ${(e as Error).message}`);
  process.exit(1);
});
