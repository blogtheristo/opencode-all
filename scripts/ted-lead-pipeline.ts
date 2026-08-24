/**
 * TED Lead Pipeline — Daily Automated Construction Lead Ingestion
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD
 * Branch: claude/improve-sales-call-script-xg1zO
 * Date: 2026-03-21
 * Owner: Lifetime Oy
 *
 * Pipeline: fetch → filter (CPV + country) → deduplicate → enrich → Supabase → DM draft
 *
 * Usage:
 *   npx tsx scripts/ted-lead-pipeline.ts                     # Run once (default: yesterday, all target countries)
 *   npx tsx scripts/ted-lead-pipeline.ts --days=7            # Backfill last 7 days
 *   npx tsx scripts/ted-lead-pipeline.ts --country=FIN       # Single country
 *   npx tsx scripts/ted-lead-pipeline.ts --dry-run           # Preview without Supabase insert
 *   npx tsx scripts/ted-lead-pipeline.ts --cron              # Start as daily cron (06:00 UTC)
 *   npx tsx scripts/ted-lead-pipeline.ts --validate=196127-2026  # Validate known tender surfaces
 *
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_KEY in .env
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { generateSectorDM, cpvToSector, sectorLabel } from './ted-sector-hooks.js';

// ── Types ──────────────────────────────────────────────────────────────

interface TEDSearchRequest {
  query: string;
  fields: string[];
  limit: number;
  scope: 'ALL' | 'ACTIVE' | 'LATEST';
  checkQuerySyntax: boolean;
  paginationMode: 'PAGE_NUMBER' | 'ITERATION';
  pageNumber?: number;
  iterationNextToken?: string;
}

interface TEDSearchResponse {
  total: number;
  iterationNextToken?: string;
  results: TEDNotice[];
}

interface TEDNotice {
  [key: string]: string | undefined;
}

interface TedLeadRow {
  publication_number: string;
  title: string | null;
  buyer_name: string | null;
  buyer_country: string | null;
  notice_type: string | null;
  cpv: string | null;
  estimated_value: number | null;
  place_of_performance: string | null;
  publication_date: string | null;
  deadline_date: string | null;
  ted_url: string;
  dm_language: string;
  dm_personalization: string;
  erp_qualifier: string | null;
  outreach_status: string;
}

interface PipelineResult {
  fetched: number;
  newLeads: number;
  duplicates: number;
  inserted: number;
  errors: string[];
}

// ── Configuration ──────────────────────────────────────────────────────

const TED_API_BASE = 'https://api.ted.europa.eu/v3/notices/search';
const TED_FIELDS = [
  'publication-number',
  'notice-title',
  'buyer-name',
  'buyer-country',
  'notice-type',
  'cpv',
  'estimated-total-value',
  'place-of-performance',
  'publication-date',
  'deadline-receipt-tenders',
];

// Target countries for DWS construction vertical
const TARGET_COUNTRIES = ['FIN', 'SWE', 'DEU', 'FRA', 'GBR', 'NOR', 'DNK', 'AUT', 'NLD', 'POL'];

const COUNTRY_TO_DM_LANG: Record<string, string> = {
  SWE: 'SV', DNK: 'SV', NOR: 'SV',
  DEU: 'DE', AUT: 'DE', CHE: 'DE',
  FIN: 'FI', EST: 'FI',
  FRA: 'FR', BEL: 'FR', LUX: 'FR',
  GBR: 'EN', IRL: 'EN', NLD: 'EN', POL: 'EN', ITA: 'EN', ESP: 'EN',
};

// Known ERP systems per company — extend as we learn more
// Source: annual reports, LinkedIn job postings, company IT pages
const KNOWN_ERP: Record<string, string> = {
  'skanska': 'SAP',
  'ncc': 'SAP',
  'peab': 'IFS',
  'porr': 'SAP',
  'strabag': 'SAP',
  'hochtief': 'SAP',
  'vinci': 'SAP',
  'bouygues': 'SAP',
  'eiffage': 'SAP',
  'balfour beatty': 'SAP',
  'yit': 'SAP',
  'srv': 'Visma',
  'fira': 'Visma',
  'hartela': 'Monitor',
  'lehto': 'Visma',
  'sweco': 'IFS',
};

// ── DM Personalization ─────────────────────────────────────────────────
// Sector-aware DM generation via ted-sector-hooks.ts
// CPV code → sector → regulation-specific hook → localized DM with referral handoff

// ── CLI Args ───────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (key: string, fallback: string): string => {
    const arg = args.find(a => a.startsWith(`--${key}=`));
    return arg ? arg.split('=')[1] : fallback;
  };
  const has = (key: string): boolean => args.includes(`--${key}`);

  return {
    country: get('country', ''),
    days: parseInt(get('days', '1'), 10),
    dryRun: has('dry-run'),
    cron: has('cron'),
    validate: get('validate', ''),
    cpv: get('cpv', '45000000'),
  };
}

// ── Step 1: Fetch from TED API ─────────────────────────────────────────

async function fetchTED(query: string, limit = 250): Promise<TEDNotice[]> {
  const allResults: TEDNotice[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const request: TEDSearchRequest = {
      query,
      fields: TED_FIELDS,
      limit,
      scope: 'ALL',
      checkQuerySyntax: false,
      paginationMode: 'PAGE_NUMBER',
      pageNumber: page,
    };

    const response = await fetch(TED_API_BASE, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`TED API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as TEDSearchResponse;
    allResults.push(...data.results);

    // PAGE_NUMBER mode: max 15k results, 250 per page
    const totalPages = Math.ceil(data.total / limit);
    hasMore = page < totalPages && page < 60; // Safety cap: 60 pages = 15k
    page++;

    // Rate limit: 700 req/min
    if (hasMore) await sleep(100);
  }

  return allResults;
}

function buildQueries(opts: ReturnType<typeof parseArgs>): string[] {
  const since = new Date();
  since.setDate(since.getDate() - opts.days);
  const dateStr = since.toISOString().slice(0, 10).replace(/-/g, '');

  const countries = opts.country ? [opts.country] : TARGET_COUNTRIES;

  // Build one query per country (cleaner results, easier debugging)
  return countries.map(country =>
    `cpv=${opts.cpv} AND buyer-country=${country} AND publication-date>=${dateStr}`
  );
}

// ── Step 2: Filter (ERP match + country) ───────────────────────────────

function matchERP(buyerName: string): string | null {
  const normalized = buyerName.toLowerCase();
  for (const [company, erp] of Object.entries(KNOWN_ERP)) {
    if (normalized.includes(company)) return erp;
  }
  return null;
}

function enrichNotice(notice: TEDNotice): TedLeadRow {
  const country = notice['buyer-country'] || '';
  const pubNumber = notice['publication-number'] || '';
  const buyerName = notice['buyer-name'] || '';
  const title = notice['notice-title'] || '';
  const dmLang = COUNTRY_TO_DM_LANG[country] || 'EN';
  const erp = matchERP(buyerName);

  const cpv = notice['cpv'] || null;
  const dmText = generateSectorDM(buyerName, title, cpv, dmLang);

  const rawValue = notice['estimated-total-value'];
  const estimatedValue = rawValue ? parseFloat(rawValue.replace(/[^0-9.]/g, '')) || null : null;

  return {
    publication_number: pubNumber,
    title: title || null,
    buyer_name: buyerName || null,
    buyer_country: country || null,
    notice_type: notice['notice-type'] || null,
    cpv: notice['cpv'] || null,
    estimated_value: estimatedValue,
    place_of_performance: notice['place-of-performance'] || null,
    publication_date: notice['publication-date'] || null,
    deadline_date: notice['deadline-receipt-tenders'] || null,
    ted_url: `https://ted.europa.eu/en/notice/-/detail/${pubNumber}`,
    dm_language: dmLang,
    dm_personalization: dmText,
    erp_qualifier: erp,
    outreach_status: 'new',
  };
}

// ── Step 3: Deduplicate against Supabase ───────────────────────────────

async function getExistingPubNumbers(
  supabase: SupabaseClient,
  pubNumbers: string[]
): Promise<Set<string>> {
  if (pubNumbers.length === 0) return new Set();

  // Batch in chunks of 500 to avoid query size limits
  const existing = new Set<string>();
  for (let i = 0; i < pubNumbers.length; i += 500) {
    const chunk = pubNumbers.slice(i, i + 500);
    const { data, error } = await supabase
      .from('ted_leads')
      .select('publication_number')
      .in('publication_number', chunk);

    if (error) throw new Error(`Supabase dedup query failed: ${error.message}`);
    if (data) data.forEach(row => existing.add(row.publication_number));
  }

  return existing;
}

// ── Step 4: Insert into Supabase ───────────────────────────────────────

async function insertLeads(
  supabase: SupabaseClient,
  leads: TedLeadRow[]
): Promise<number> {
  if (leads.length === 0) return 0;

  let inserted = 0;
  // Insert in batches of 100
  for (let i = 0; i < leads.length; i += 100) {
    const batch = leads.slice(i, i + 100);
    const { error, count } = await supabase
      .from('ted_leads')
      .insert(batch, { count: 'exact' });

    if (error) {
      // On conflict (duplicate pub number), skip silently
      if (error.code === '23505') continue;
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
    inserted += count || batch.length;
  }

  return inserted;
}

// ── Step 5: Generate DM Drafts Summary ─────────────────────────────────

function printDmDrafts(leads: TedLeadRow[]): void {
  const withErp = leads.filter(l => l.erp_qualifier);
  const withoutErp = leads.filter(l => !l.erp_qualifier);

  if (withErp.length > 0) {
    console.log('\n=== HIGH-PRIORITY LEADS (ERP match — native integration angle) ===\n');
    for (const lead of withErp) {
      console.log(`  ${lead.publication_number} | ${lead.buyer_name} (${lead.buyer_country})`);
      console.log(`  ERP: ${lead.erp_qualifier} | Lang: ${lead.dm_language}`);
      console.log(`  DM: "${lead.dm_personalization}"`);
      console.log(`  ERP angle: "We connect directly to your ${lead.erp_qualifier} — no manual data entry"`);
      console.log(`  URL: ${lead.ted_url}`);
      console.log('');
    }
  }

  if (withoutErp.length > 0) {
    console.log(`\n=== STANDARD LEADS (${withoutErp.length} — no ERP match yet, check manually) ===\n`);
    for (const lead of withoutErp.slice(0, 10)) {
      console.log(`  ${lead.publication_number} | ${lead.buyer_name} (${lead.buyer_country}) | ${lead.dm_language}`);
      console.log(`  DM: "${lead.dm_personalization}"`);
      console.log('');
    }
    if (withoutErp.length > 10) {
      console.log(`  ... and ${withoutErp.length - 10} more (see Supabase ted_leads table)\n`);
    }
  }
}

// ── Validate Mode ──────────────────────────────────────────────────────

async function validateTender(pubNumber: string): Promise<void> {
  console.log(`\nValidating tender ${pubNumber} surfaces in pipeline...\n`);

  const query = `publication-number=${pubNumber}`;
  const results = await fetchTED(query, 10);

  if (results.length === 0) {
    console.log('FAIL: Tender not found. Check the publication number.');
    process.exit(1);
  }

  const notice = results[0];
  const lead = enrichNotice(notice);

  console.log('PASS: Tender found and enriched successfully.\n');
  console.log(`  Publication: ${lead.publication_number}`);
  console.log(`  Title:       ${lead.title}`);
  console.log(`  Buyer:       ${lead.buyer_name} (${lead.buyer_country})`);
  console.log(`  CPV:         ${lead.cpv} → ${sectorLabel(cpvToSector(lead.cpv))}`);
  console.log(`  Value:       ${lead.estimated_value ? `EUR ${lead.estimated_value.toLocaleString()}` : '(not disclosed)'}`);
  console.log(`  DM Lang:     ${lead.dm_language}`);
  console.log(`  ERP:         ${lead.erp_qualifier || '(not in known list — check manually)'}`);
  console.log(`  DM opener:   "${lead.dm_personalization}"`);
  console.log(`  TED URL:     ${lead.ted_url}`);

  // Validate ERP check against known companies
  console.log('\n--- ERP Qualifier Test ---');
  for (const [company, expectedErp] of Object.entries(KNOWN_ERP).slice(0, 5)) {
    const result = matchERP(company);
    const status = result === expectedErp ? 'PASS' : 'FAIL';
    console.log(`  ${status}: matchERP("${company}") → ${result} (expected: ${expectedErp})`);
  }
}

// ── Pipeline Orchestrator ──────────────────────────────────────────────

async function runPipeline(opts: ReturnType<typeof parseArgs>): Promise<PipelineResult> {
  const result: PipelineResult = { fetched: 0, newLeads: 0, duplicates: 0, inserted: 0, errors: [] };

  // Step 1: Fetch
  console.log('Step 1/5: Fetching from TED API...');
  const queries = buildQueries(opts);
  const allNotices: TEDNotice[] = [];

  for (const query of queries) {
    const country = query.match(/buyer-country=(\w+)/)?.[1] || '?';
    try {
      const notices = await fetchTED(query);
      console.log(`  ${country}: ${notices.length} notices`);
      allNotices.push(...notices);
    } catch (err) {
      const msg = `${country}: ${err instanceof Error ? err.message : String(err)}`;
      console.error(`  ${country}: ERROR — ${msg}`);
      result.errors.push(msg);
    }
  }
  result.fetched = allNotices.length;
  console.log(`  Total fetched: ${result.fetched}\n`);

  if (result.fetched === 0) {
    console.log('No notices found. Pipeline complete.');
    return result;
  }

  // Step 2: Enrich (filter + ERP + DM)
  console.log('Step 2/5: Enriching leads (ERP qualifier + DM personalization)...');
  const leads = allNotices.map(enrichNotice);
  const withErp = leads.filter(l => l.erp_qualifier);
  console.log(`  Total leads: ${leads.length}`);
  console.log(`  With ERP match: ${withErp.length} (high priority)\n`);

  if (opts.dryRun) {
    console.log('--- DRY RUN — skipping Supabase steps ---');
    printDmDrafts(leads);
    result.newLeads = leads.length;
    return result;
  }

  // Step 3: Deduplicate
  console.log('Step 3/5: Deduplicating against Supabase...');
  const supabase = getSupabase();
  if (!supabase) {
    console.error('ERROR: SUPABASE_URL or SUPABASE_SERVICE_KEY not set. Use --dry-run for preview.');
    result.errors.push('Missing Supabase credentials');
    return result;
  }

  const pubNumbers = leads.map(l => l.publication_number);
  const existing = await getExistingPubNumbers(supabase, pubNumbers);
  const newLeads = leads.filter(l => !existing.has(l.publication_number));
  result.duplicates = leads.length - newLeads.length;
  result.newLeads = newLeads.length;
  console.log(`  Existing (skip): ${result.duplicates}`);
  console.log(`  New leads: ${result.newLeads}\n`);

  if (result.newLeads === 0) {
    console.log('No new leads. Pipeline complete.');
    return result;
  }

  // Step 4: Insert
  console.log('Step 4/5: Inserting into Supabase ted_leads...');
  result.inserted = await insertLeads(supabase, newLeads);
  console.log(`  Inserted: ${result.inserted}\n`);

  // Step 5: DM drafts
  console.log('Step 5/5: Generating DM drafts...');
  printDmDrafts(newLeads);

  return result;
}

// ── Cron Mode ──────────────────────────────────────────────────────────

async function startCron(): Promise<void> {
  // Dynamic import — node-cron may not be installed
  let cron: typeof import('node-cron');
  try {
    cron = await import('node-cron');
  } catch {
    console.error('node-cron not installed. Run: npm install node-cron');
    console.error('Or use --days=1 for manual daily runs.');
    process.exit(1);
  }

  console.log('TED Lead Pipeline — Cron Mode');
  console.log('Running daily at 06:00 UTC\n');

  // Run immediately on startup
  await runPipeline({ country: '', days: 1, dryRun: false, cron: false, validate: '', cpv: '45000000' });

  // Schedule daily at 06:00 UTC
  cron.schedule('0 6 * * *', async () => {
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] Daily TED pipeline run starting...\n`);
    try {
      const result = await runPipeline({ country: '', days: 1, dryRun: false, cron: false, validate: '', cpv: '45000000' });
      console.log(`[${timestamp}] Complete: ${result.inserted} new leads, ${result.duplicates} skipped, ${result.errors.length} errors`);
    } catch (err) {
      console.error(`[${timestamp}] Pipeline failed:`, err);
    }
  }, { timezone: 'UTC' });

  // Keep process alive
  console.log('Cron scheduled. Process will run until stopped (Ctrl+C).');
}

// ── Helpers ────────────────────────────────────────────────────────────

function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Main ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const opts = parseArgs();

  console.log('TED Lead Pipeline — DWS IQ 6');
  console.log('=============================');
  console.log(`Date:    ${new Date().toISOString()}`);
  console.log(`CPV:     ${opts.cpv}`);
  console.log(`Country: ${opts.country || TARGET_COUNTRIES.join(', ')}`);
  console.log(`Days:    ${opts.days}`);
  console.log(`Mode:    ${opts.dryRun ? 'DRY RUN' : opts.cron ? 'CRON' : 'SINGLE RUN'}`);
  console.log('');

  // Validate mode
  if (opts.validate) {
    await validateTender(opts.validate);
    return;
  }

  // Cron mode
  if (opts.cron) {
    await startCron();
    return;
  }

  // Single run
  const result = await runPipeline(opts);

  console.log('\n=============================');
  console.log('Pipeline Summary');
  console.log(`  Fetched:    ${result.fetched}`);
  console.log(`  New leads:  ${result.newLeads}`);
  console.log(`  Duplicates: ${result.duplicates}`);
  console.log(`  Inserted:   ${result.inserted}`);
  if (result.errors.length > 0) {
    console.log(`  Errors:     ${result.errors.length}`);
    result.errors.forEach(e => console.log(`    - ${e}`));
  }
  console.log('=============================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
