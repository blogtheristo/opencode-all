#!/usr/bin/env node
/**
 * compute-mgd.mjs — Monthly Governed Decisions (MGD) computation.
 *
 * Recipe step 6 (INSTRUMENT) of the dominant-game recipe
 * (docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md).
 * Canonical metric definition: DWS_TRUTH_STANDARD.md §2 row 32 +
 * dws10.com/config/metrics-northstar.json.
 *
 * DETERMINISTIC. No LLM calls, no heuristics (CLAUDE.md Rule 5). MGD is a
 * counted fact, not a judgment. A decision counts as one Governed Decision
 * ONLY when it satisfies all three field-note §3 criteria:
 *   (a) governed_outcome_layer === true   — flows through the governed outcome layer
 *   (b) article12_lineage is a full lineage object — sources[] + reasoning + signed_by
 *   (c) audit_grade === true               — would survive regulator/internal-audit scrutiny
 * and is a completed execution (status === 'completed'). Pilots, demos, and
 * ungoverned agent runs do not count.
 *
 * FAIL LOUD (CLAUDE.md Rule 12). The current `agent_executions` schema
 * (supabase/migrations/030_agent_logging_tables.sql) has NONE of the three
 * fields above. If the input log set carries none of them, this script does
 * NOT invent a proxy — it exits 2 with a named-gap report pointing at the
 * proposed (un-applied) migration that would add them.
 *
 * Usage:
 *   node scripts/compute-mgd.mjs --logs <file.json|dir> [--customer <org_id>]
 *        [--from <ISO>] [--to <ISO>] [--now <ISO>] [--pretty]
 *
 * Exit codes: 0 = computed OK · 2 = schema gap (fail loud) · 1 = usage/IO error.
 */
import fs from 'node:fs';
import path from 'node:path';

// ---- Canonical MGD criteria (verbatim field-note §3 field mapping) ----------
export const REQUIRED_FIELDS = [
  {
    key: 'governed_outcome_layer',
    criterion: 'a',
    text: 'flows through the governed outcome layer',
  },
  { key: 'article12_lineage', criterion: 'b', text: 'carries full Article 12 reasoning lineage' },
  {
    key: 'audit_grade',
    criterion: 'c',
    text: 'is audit-grade (would survive regulator or internal-audit scrutiny)',
  },
];

export const PROPOSED_MIGRATION = 'supabase/migrations/081_agent_executions_governance_fields.sql';

/** Thrown when the log schema cannot express governance — fail loud, no proxy. */
export class SchemaGapError extends Error {
  constructor(report) {
    super(report.message);
    this.name = 'SchemaGapError';
    this.report = report;
  }
}

// ---- Predicates -------------------------------------------------------------
const hasGovernanceField = (r) =>
  REQUIRED_FIELDS.some((f) => Object.prototype.hasOwnProperty.call(r, f.key));

/** Full Article 12 lineage: non-empty sources[] + reasoning + signed_by. */
export function isValidLineage(l) {
  if (!l || typeof l !== 'object' || Array.isArray(l)) return false;
  const sources = l.sources;
  const reasoning = l.reasoning;
  const signedBy = l.signed_by ?? l.signedBy;
  return (
    Array.isArray(sources) &&
    sources.length > 0 &&
    typeof reasoning === 'string' &&
    reasoning.trim().length > 0 &&
    typeof signedBy === 'string' &&
    signedBy.trim().length > 0
  );
}

/** Classify a single record: 'counted' or an exclusion reason. */
export function classify(r) {
  if (r.status !== 'completed') return 'not-completed';
  if (r.governed_outcome_layer !== true) return 'not-governed-layer';
  if (!isValidLineage(r.article12_lineage)) return 'missing-article12-lineage';
  if (r.audit_grade !== true) return 'not-audit-grade';
  return 'counted';
}

/** The named-gap report used by every fail-loud path (file + Supabase). */
export function schemaGapReport(recordsInspected) {
  return {
    message:
      'Cannot compute MGD: agent_executions carries none of the three governance fields ' +
      'required by field-note §3. Not counting a proxy (Rule 12).',
    missingFields: REQUIRED_FIELDS.map((f) => ({
      field: f.key,
      criterion: f.criterion,
      requirement: f.text,
    })),
    currentSchema: 'supabase/migrations/030_agent_logging_tables.sql (agent_executions)',
    proposedMigration: PROPOSED_MIGRATION,
    populateSite:
      'src/agents/base.agent.ts logExecution() (extend to persist governance fields from the AgentResponse / LedgerNativeAgentOutput lineage — AI_AGENT_GUIDELINES.md §Ledger-Native Output Contract)',
    recordsInspected,
  };
}

/** Detect a Postgres/PostgREST "column does not exist" error (pre-migration-080). */
export function isUndefinedColumnError(error) {
  if (!error) return false;
  return (
    error.code === '42703' || /column.*does not exist|does not exist/i.test(error.message || '')
  );
}

// ---- Core computation (pure) -----------------------------------------------
/**
 * @param {Array<object>} records  agent_executions rows
 * @param {{from?:string,to?:string,customer?:string,now?:string}} opts
 * @returns {object} structured MGD result
 * @throws {SchemaGapError} when no record carries any governance field
 */
export function computeMgd(records, opts = {}) {
  if (!Array.isArray(records)) throw new TypeError('records must be an array');

  // Schema-gap detection is a property of the data SOURCE, not the window:
  // check the full input before filtering.
  if (records.length > 0 && !records.some(hasGovernanceField)) {
    throw new SchemaGapError(schemaGapReport(records.length));
  }

  const inWindow = (r) => {
    const t = r.created_at;
    if (opts.from && !(t >= opts.from)) return false;
    if (opts.to && !(t <= opts.to)) return false;
    if (opts.customer && r.org_id !== opts.customer) return false;
    return true;
  };
  const windowed = records.filter(inWindow);

  const emptyExcl = () => ({
    'not-completed': 0,
    'not-governed-layer': 0,
    'missing-article12-lineage': 0,
    'not-audit-grade': 0,
  });

  const perCustomer = new Map(); // org_id -> { governedDecisions, evaluated, excluded{} }
  let counted = 0;
  const excluded = emptyExcl();
  let minTs = null;
  let maxTs = null;

  for (const r of windowed) {
    const org = r.org_id ?? '(unknown)';
    if (!perCustomer.has(org)) {
      perCustomer.set(org, {
        orgId: org,
        governedDecisions: 0,
        evaluated: 0,
        excluded: emptyExcl(),
      });
    }
    const bucket = perCustomer.get(org);
    bucket.evaluated += 1;

    const verdict = classify(r);
    if (verdict === 'counted') {
      counted += 1;
      bucket.governedDecisions += 1;
    } else {
      excluded[verdict] += 1;
      bucket.excluded[verdict] += 1;
    }

    if (typeof r.created_at === 'string') {
      if (minTs === null || r.created_at < minTs) minTs = r.created_at;
      if (maxTs === null || r.created_at > maxTs) maxTs = r.created_at;
    }
  }

  return {
    metric: 'MGD',
    definition:
      'Monthly Governed Decisions — decisions through the governed outcome layer, under Article 12 lineage, that are audit-grade (field-note §3).',
    canonicalSource: 'DWS_TRUTH_STANDARD.md §2 row 32 / dws10.com/config/metrics-northstar.json',
    generatedAt: opts.now ?? new Date().toISOString(),
    window: {
      from: opts.from ?? minTs,
      to: opts.to ?? maxTs,
      customer: opts.customer ?? null,
    },
    totals: {
      governedDecisions: counted,
      evaluated: windowed.length,
      excluded: windowed.length - counted,
      excludedBreakdown: excluded,
    },
    perCustomer: [...perCustomer.values()].sort(
      (a, b) =>
        b.governedDecisions - a.governedDecisions || String(a.orgId).localeCompare(String(b.orgId)),
    ),
    crc: {
      // CRC is NOT derivable from execution logs — it is the 4P assets the
      // customer owns after the engagement (field-note §3). Reported honestly
      // rather than proxied. The /mgd-report skill joins the 4P inventory.
      metric: 'Customer-Retained Capital',
      computableFromExecutionLogs: false,
      reason:
        'CRC = retained 4P assets (ontology, skills, calibrated Control Room thresholds, evaluated datasets), not an execution-log event.',
      canonicalSource:
        'field-note §3 / dws10.com/config/metrics-northstar.json (metrics.secondary)',
    },
    schema: { status: 'ok', requiredFields: REQUIRED_FIELDS.map((f) => f.key) },
  };
}

// ---- Log loading ------------------------------------------------------------
export function loadLogs(target) {
  const abs = path.resolve(target);
  const stat = fs.statSync(abs); // throws if missing — surfaced by CLI
  const files = stat.isDirectory()
    ? fs
        .readdirSync(abs)
        .filter((f) => f.endsWith('.json'))
        .map((f) => path.join(abs, f))
    : [abs];
  const out = [];
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    const rows = Array.isArray(j) ? j : Array.isArray(j.records) ? j.records : null;
    if (!rows) throw new Error(`${f}: expected a JSON array or { "records": [...] }`);
    out.push(...rows);
  }
  return out;
}

/**
 * Read agent_executions rows straight from the live Supabase table.
 * Needs SUPABASE_URL + SUPABASE_SERVICE_KEY (same env as base.agent.ts).
 * Selects only the columns MGD needs; filters push down to Postgres, and the
 * MGD partial index (migration 081) serves the governed+audit-grade slice.
 * If the governance columns do not exist yet (migration 081 un-applied), the
 * SELECT errors with an undefined-column error, which we translate into the
 * same fail-loud SchemaGapError as the file path (Rule 12 — no proxy).
 */
export async function loadLogsFromSupabase(opts = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error(
      '--supabase mode needs SUPABASE_URL and SUPABASE_SERVICE_KEY in the environment',
    );
  }
  // Dynamic import so the file/CLI path stays dependency-free.
  const { createClient } = await import('@supabase/supabase-js');
  const client = createClient(url, key);
  const cols = 'org_id, status, created_at, governed_outcome_layer, article12_lineage, audit_grade';
  const PAGE = 1000;
  const rows = [];
  for (let offset = 0; ; offset += PAGE) {
    let q = client
      .from('agent_executions')
      .select(cols)
      .order('created_at', { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (opts.from) q = q.gte('created_at', opts.from);
    if (opts.to) q = q.lte('created_at', opts.to);
    if (opts.customer) q = q.eq('org_id', opts.customer);
    const { data, error } = await q;
    if (error) {
      if (isUndefinedColumnError(error)) throw new SchemaGapError(schemaGapReport(0));
      throw new Error(`Supabase query failed: ${error.message}`);
    }
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  return rows;
}

// ---- CLI --------------------------------------------------------------------
function parseArgs(argv) {
  const o = { pretty: false, supabase: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--pretty') o.pretty = true;
    else if (a === '--supabase') o.supabase = true;
    else if (a === '--logs') o.logs = argv[++i];
    else if (a === '--customer') o.customer = argv[++i];
    else if (a === '--from') o.from = argv[++i];
    else if (a === '--to') o.to = argv[++i];
    else if (a === '--now') o.now = argv[++i];
    else throw new Error(`unknown argument: ${a}`);
  }
  return o;
}

async function main(argv) {
  let opts;
  try {
    opts = parseArgs(argv);
    if (!opts.supabase && !opts.logs)
      throw new Error('one of --logs <file.json|dir> or --supabase is required');
    if (opts.supabase && opts.logs) throw new Error('--logs and --supabase are mutually exclusive');
  } catch (e) {
    process.stderr.write(`compute-mgd: ${e.message}\n`);
    process.stderr.write(
      'usage: node scripts/compute-mgd.mjs (--logs <file|dir> | --supabase) [--customer <org>] [--from <ISO>] [--to <ISO>] [--now <ISO>] [--pretty]\n',
    );
    process.exit(1);
  }

  let records;
  try {
    records = opts.supabase ? await loadLogsFromSupabase(opts) : loadLogs(opts.logs);
  } catch (e) {
    // A SchemaGapError from the Supabase reader (columns missing) is fail-loud,
    // not an IO error — hand it to the schema-gap branch below.
    if (!(e instanceof SchemaGapError)) {
      process.stderr.write(`compute-mgd: cannot read logs: ${e.message}\n`);
      process.exit(1);
    }
    records = e; // sentinel; rethrown in the compute try-block
  }

  try {
    if (records instanceof SchemaGapError) throw records;
    const result = computeMgd(records, opts);
    process.stdout.write(JSON.stringify(result, null, opts.pretty ? 2 : 0) + '\n');
    process.exit(0);
  } catch (e) {
    if (e instanceof SchemaGapError) {
      // Fail loud: machine-readable error to stdout, human summary to stderr.
      process.stdout.write(
        JSON.stringify({ error: 'schema-gap', ...e.report }, null, opts.pretty ? 2 : 0) + '\n',
      );
      process.stderr.write(`\ncompute-mgd: SCHEMA GAP — MGD not computed.\n  ${e.message}\n`);
      for (const m of e.report.missingFields) {
        process.stderr.write(`  missing (${m.criterion}): ${m.field} — ${m.requirement}\n`);
      }
      process.stderr.write(`  propose (do not apply): ${e.report.proposedMigration}\n`);
      process.exit(2);
    }
    process.stderr.write(`compute-mgd: ${e.message}\n`);
    process.exit(1);
  }
}

// Run only when invoked directly (not when imported by tests).
const invokedDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (invokedDirectly) {
  main(process.argv.slice(2)).catch((e) => {
    process.stderr.write(`compute-mgd: ${e?.message ?? e}\n`);
    process.exit(1);
  });
}
