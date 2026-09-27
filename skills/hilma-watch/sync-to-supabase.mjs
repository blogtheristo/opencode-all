#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude-opus-5 Agent=sales-outreach Date=2026-09-22
// Audit trail: git log -- skills/hilma-watch/sync-to-supabase.mjs
//
// Upsert hilma-watch results into public.hilma_tenders so Sales Mission Control
// (dashboard/mission-control, gated to risto.paarni2024@lifetime.fi) shows them as a lane.
//
// Run on a host that can reach hankintailmoitukset.fi (DGX Spark or local):
//   node hilma-watch.mjs --top 40 && node sync-to-supabase.mjs
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY. Never hardcode; never log the key.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const RESULTS = resolve(arg('--in', join(__dirname, 'out', 'hilma-results.json')));
const DRY_RUN = process.argv.includes('--dry-run');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!existsSync(RESULTS)) {
  console.error(`[hilma-sync] no results at ${RESULTS} — run hilma-watch.mjs first.`);
  process.exit(2);
}

const summary = JSON.parse(readFileSync(RESULTS, 'utf8'));
const notices = summary.notices || [];

// Rule 12 — fail loud. A blocked/partial scan must not look like "no tenders today",
// and must never overwrite a good prior sync with a truncated one.
if (summary.partialRun) {
  console.error('[hilma-sync] REFUSING: results are from a PARTIAL RUN (some search terms were');
  console.error('[hilma-sync] blocked). Syncing would understate the pipeline. Re-run the scan');
  console.error('[hilma-sync] from a host with full access to hankintailmoitukset.fi.');
  process.exit(3);
}
if (notices.length === 0) {
  console.error('[hilma-sync] REFUSING: zero notices in results. Nothing to sync.');
  process.exit(3);
}

/** Hilma notice URLs look like …/public/procedure/<id>/… — pull <id> for display/joins. */
function procedureId(href) {
  const m = String(href || '').match(/\/public\/procedure\/(\d+)/);
  return m ? m[1] : null;
}

/**
 * Hilma renders deadlines in the result card text as "Määräaika: 15.10.2026 12:00"
 * (also "Tarjousten jättämisen määräaika"). Parsed here so Mission Control can rank by
 * urgency. No match => null; the lane then ranks the row on fit alone.
 */
function parseDeadline(ctx) {
  const m = String(ctx || '').match(
    /m[äa][äa]r[äa]aika[^0-9]{0,40}(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\D{1,5}(\d{1,2})[:.](\d{2}))?/i,
  );
  if (!m) return null;
  const [, d, mo, y, hh = '23', mm = '59'] = m;
  const iso = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(hh).padStart(2, '0')}:${mm}:00+03:00`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

const rows = notices.map((n) => ({
  notice_url: n.href,
  procedure_id: procedureId(n.href),
  title: n.title || '(untitled notice)',
  context: n.ctx || null,
  deadline_date: parseDeadline(n.ctx),
  relevance_score: n.score ?? 0,
  keyword_hits: n.keywordHits || [],
  cpv_hits: n.cpvHits || [],
  matched_terms: n.terms || [],
  source: 'hilma_watch',
  created_by: 'hilma_watch_sync',
  updated_at: new Date().toISOString(),
}));

console.error(
  `[hilma-sync] ${rows.length} notices (${rows.filter((r) => r.relevance_score >= 40).length} at score >= 40, ` +
    `${rows.filter((r) => r.deadline_date).length} with a parsed deadline)`,
);

if (DRY_RUN) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    '[hilma-sync] SUPABASE_URL and SUPABASE_SERVICE_KEY required (use --dry-run to inspect).',
  );
  process.exit(2);
}

// Upsert on notice_url (the table's unique key, same key hilma-watch dedupes on).
// `status` and `notes` are deliberately NOT in the payload: a re-scan must never
// reset an HIC triage decision back to 'new'.
const res = await fetch(`${SUPABASE_URL}/rest/v1/hilma_tenders?on_conflict=notice_url`, {
  method: 'POST',
  headers: {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=representation',
  },
  body: JSON.stringify(rows),
});

if (!res.ok) {
  // Body may echo the request; print status + message only, never the key.
  const text = await res.text();
  console.error(`[hilma-sync] upsert failed HTTP ${res.status}: ${text.slice(0, 500)}`);
  process.exit(4);
}

const saved = await res.json();
console.error(`[hilma-sync] upserted ${saved.length} rows into hilma_tenders.`);
console.error('[hilma-sync] Open Mission Control → Sales Centre to triage.');
