#!/usr/bin/env node
// firehorse-memory-write.mjs — Dual-write a Firehorse Dreaming memory note to
// the canonical Firehorse CMS (internal Postgres firehorse_memory table, DGX
// Spark — dws-postgres) after the local .md file has been written by
// /promote-proposal.
//
// Insert-only / immutable: if the topic already exists, this script inserts a
// new row with version = previous + 1. The local file is the always-available
// mirror; this table is the queryable source-of-truth for downstream agents.
//
// Usage:
//   node scripts/firehorse-memory-write.mjs \
//     --topic <kebab-case> \
//     --title "<title>" \
//     --body-file .claude/clawdbot/memory/<topic>.md \
//     [--source clawdbot-dream-curate] \
//     [--source-session <session-uuid>] \
//     [--source-proposal .claude/clawdbot/proposals/curate-<date>.md] \
//     [--dry-run]
//
// Env (required unless --dry-run):
//   INTERNAL_DB_URL       Postgres connection string for dws-postgres (DGX Spark)
//
// Exit codes: 0 ok, 2 bad args, 3 missing env, 4 query failure, 5 schema mismatch.
//
// This script does NOT touch the on-disk .md file. /promote-proposal writes
// that first; this is the second leg of the dual write. Idempotency: the
// (topic, version) UNIQUE constraint in the table prevents duplicate inserts
// for the same logical update.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';

const { Pool } = pg;

function parseArgs(argv) {
  const args = { dryRun: false, source: 'clawdbot-dream-curate' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--topic') args.topic = argv[++i];
    else if (a === '--title') args.title = argv[++i];
    else if (a === '--body-file') args.bodyFile = argv[++i];
    else if (a === '--source') args.source = argv[++i];
    else if (a === '--source-session') args.sourceSession = argv[++i];
    else if (a === '--source-proposal') args.sourceProposal = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function fail(code, payload) {
  console.log(JSON.stringify({ ok: false, ...payload }, null, 2));
  process.exit(code);
}

const args = parseArgs(process.argv);

if (args.help) {
  console.log(
    'firehorse-memory-write — POST a memory note to Supabase firehorse_memory.\n' +
      'Required: --topic, --title, --body-file. See script header for full usage.',
  );
  process.exit(0);
}

if (!args.topic || !args.title || !args.bodyFile) {
  fail(2, { error: 'Missing required arg', need: ['--topic', '--title', '--body-file'] });
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(args.topic)) {
  fail(2, { error: 'Topic must be kebab-case', got: args.topic });
}
if (!existsSync(args.bodyFile)) {
  fail(2, { error: 'body-file not found', path: args.bodyFile });
}

const body = readFileSync(resolve(args.bodyFile), 'utf8');
const payload = {
  topic: args.topic,
  title: args.title,
  body,
  source: args.source,
  source_session_id: args.sourceSession ?? null,
  source_proposal_path: args.sourceProposal ?? null,
  // version is NOT set here — derived server-side via:
  //   INSERT ... version = (SELECT COALESCE(MAX(version), 0) + 1
  //                         FROM firehorse_memory WHERE topic = $1)
  // For now we let the DEFAULT 1 apply on first insert and bump on subsequent.
  // The unique (topic, version) constraint guarantees no clobbering.
};

if (args.dryRun) {
  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: true,
        endpoint: '(INTERNAL_DB_URL)/firehorse_memory',
        payloadKeys: Object.keys(payload),
        topic: payload.topic,
        title: payload.title,
        bodyChars: payload.body.length,
        source: payload.source,
        sourceSession: payload.source_session_id,
        sourceProposal: payload.source_proposal_path,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const { INTERNAL_DB_URL } = process.env;
if (!INTERNAL_DB_URL) {
  fail(3, {
    error: 'Missing env',
    need: ['INTERNAL_DB_URL'],
    hint: 'Use --dry-run to test without env. If running production: ensure INTERNAL_DB_URL is set in the environment that invokes /promote-proposal.',
  });
}

const pool = new Pool({ connectionString: INTERNAL_DB_URL });

// Compute next version: SELECT max(version) for this topic, +1.
async function nextVersion(topic) {
  const result = await pool.query(
    'SELECT version FROM firehorse_memory WHERE topic = $1 ORDER BY version DESC LIMIT 1',
    [topic],
  );
  return result.rows.length === 0 ? 1 : result.rows[0].version + 1;
}

async function insertRow(row) {
  const result = await pool.query(
    `INSERT INTO firehorse_memory (
       topic, title, body, source, source_session_id, source_proposal_path, version
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, topic, version, created_at`,
    [
      row.topic,
      row.title,
      row.body,
      row.source,
      row.source_session_id,
      row.source_proposal_path,
      row.version,
    ],
  );
  return result.rows[0];
}

try {
  const version = await nextVersion(args.topic);
  const row = await insertRow({ ...payload, version });
  console.log(
    JSON.stringify(
      {
        ok: true,
        id: row?.id,
        topic: row?.topic,
        version: row?.version,
        created_at: row?.created_at,
      },
      null,
      2,
    ),
  );
  await pool.end();
} catch (err) {
  await pool.end().catch(() => {});
  // Postgres error code 42P01 = undefined_table
  if (err.code === '42P01') {
    fail(5, {
      error: 'firehorse_memory table not found',
      hint: 'Apply the ported 065_firehorse_memory migration on dws-postgres first. See .claude/clawdbot/proposals/migration-065-firehorse-memory.md for the SQL.',
      detail: err.message,
    });
  }
  fail(4, { error: err.message });
}
