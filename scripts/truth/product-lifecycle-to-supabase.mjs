#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=price-list-a5-campaign Date=2026-09-25
// Audit trail: git log -- scripts/truth/product-lifecycle-to-supabase.mjs
//
// Loads config/truth/product-lifecycle.json (TRUTH row 43) into the Supabase tables
// product_lifecycle and product_lifecycle_evidence (migration 092_250926_product_lifecycle.sql).
// The repo JSON stays the source; the tables are its queryable copy. Upserts only: IDs are never
// deleted (retired IDs stay with state removed/archived/discontinued), evidence is deduplicated
// by evidence_hash.
//
// Usage:
//   node scripts/truth/product-lifecycle-to-supabase.mjs           # dry run: print what would load
//   node scripts/truth/product-lifecycle-to-supabase.mjs --apply   # upsert (needs env below)
// Env (never commit values): SUPABASE_URL, SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'config/truth/product-lifecycle.json');
const BATCH = 200;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function toTableRows({ summary, rows }) {
  const lifecycle = rows.map((r) => ({
    product_id: r.id,
    name: r.name || '',
    state: r.state,
    state_source: r.stateSource || '',
    record_version: r.recordVersion ?? null,
    record_last_changed: r.recordLastChanged || null,
    record_last_commit: r.recordLastCommit || null,
    page: r.page || null,
    page_versions: r.pageVersions ?? null,
    catalog_version: summary.catalogVersion || null,
  }));
  const evidence = rows.flatMap((r) =>
    r.evidence.map((e) => ({
      product_id: r.id,
      kind: e.kind,
      evidence_date: DATE.test(e.date || '') ? e.date : null,
      ref: e.ref || '',
      text: e.text || '',
    })),
  );
  // One row per (product, kind, ref, text): the table's evidence_hash is unique, and a batch
  // may not upsert the same row twice.
  const seen = new Set();
  const unique = evidence.filter((e) => {
    const k = `${e.product_id}|${e.kind}|${e.ref}|${e.text}`;
    return seen.has(k) ? false : (seen.add(k), true);
  });
  return { lifecycle, evidence: unique };
}

async function upsert(base, key, table, conflict, rows) {
  for (let i = 0; i < rows.length; i += BATCH) {
    const res = await fetch(`${base}/rest/v1/${table}?on_conflict=${conflict}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(rows.slice(i, i + BATCH)),
    });
    if (!res.ok)
      throw new Error(`${table}: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
  }
}

async function main() {
  const reg = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const { lifecycle, evidence } = toTableRows(reg);
  console.log(
    `[product-lifecycle-to-supabase] ${lifecycle.length} product_lifecycle rows, ${evidence.length} evidence rows (catalogue ${reg.summary.catalogVersion})`,
  );
  if (!process.argv.includes('--apply')) {
    console.log('Dry run. Pass --apply to upsert.');
    return;
  }
  const base = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
  await upsert(base, key, 'product_lifecycle', 'product_id', lifecycle);
  await upsert(base, key, 'product_lifecycle_evidence', 'evidence_hash', evidence);
  console.log('[product-lifecycle-to-supabase] loaded');
}

if (import.meta.url === `file://${process.argv[1]}`)
  main().catch((e) => {
    console.error(`[product-lifecycle-to-supabase] FAIL — ${e.message}`);
    process.exitCode = 1;
  });
