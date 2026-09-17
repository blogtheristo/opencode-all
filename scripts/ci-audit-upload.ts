#!/usr/bin/env tsx
/**
 * ci-audit-upload.ts — Upload a single CI audit record JSON file to Supabase.
 *
 * Usage:  npx tsx scripts/ci-audit-upload.ts <path-to-record.json>
 *
 * Environment:
 *   SUPABASE_URL                  — Supabase project URL (europe-north1)
 *   SUPABASE_SERVICE_ROLE_KEY     — service role key (INSERT-only per RLS policy)
 *
 * Behaviour:
 *   - No-op (exit 0 with a warning) if env vars unset or table missing.
 *     That lets local runs succeed before migration 062 is applied.
 *   - Exit 1 only on hard errors (network down, auth rejected).
 *
 * Record shape: see scripts/local-ci.sh finalize_and_exit().
 */

import { readFileSync } from 'node:fs';
import process from 'node:process';

interface CiAuditRecord {
  schema: 'ci-audit/v1';
  ts: string;
  commit_sha: string;
  branch: string;
  repo: string;
  runner: string;
  runner_kind: 'local' | 'dgx-spark' | 'github-actions' | 'other';
  trigger_kind: string;
  overall_pass: boolean;
  checks_total: number;
  checks_passed: number;
  checks_failed: number;
  duration_ms: number;
  checks: Array<{
    name: string;
    pass: boolean;
    duration_ms: number;
    output_sha256: string;
    notes?: string;
  }>;
  prev_record_hash: string | null;
  this_record_hash: string;
}

async function main(): Promise<number> {
  const [, , filePath] = process.argv;
  if (!filePath) {
    console.error('usage: ci-audit-upload.ts <record.json>');
    return 2;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn('SUPABASE_URL / SUPABASE_SERVICE_KEY not set — skip (local mirror only)');
    return 0;
  }

  let record: CiAuditRecord;
  try {
    record = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error('cannot read record:', (e as Error).message);
    return 1;
  }

  const row = {
    commit_sha: record.commit_sha,
    branch: record.branch,
    repo: record.repo,
    runner: record.runner,
    runner_kind: record.runner_kind,
    overall_pass: record.overall_pass,
    checks_total: record.checks_total,
    checks_passed: record.checks_passed,
    checks_failed: record.checks_failed,
    duration_ms: record.duration_ms,
    checks: record.checks,
    prev_record_hash: record.prev_record_hash,
    this_record_hash: record.this_record_hash,
    trigger_kind: record.trigger_kind,
  };

  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/ci_audit_log`;
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });

  if (resp.ok) {
    console.log(`ci_audit_log row inserted (${record.this_record_hash.slice(0, 12)}...)`);
    return 0;
  }

  const body = await resp.text();
  if (resp.status === 404 || /relation .+ does not exist/i.test(body)) {
    console.warn(
      'ci_audit_log table not found — copy/paste the SQL block from docs/CI_AUDIT.md to enable legal record-of-truth',
    );
    return 0;
  }
  console.error(`Supabase upload failed: ${resp.status} ${resp.statusText}\n${body}`);
  return 1;
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    console.error('uncaught:', e);
    process.exit(1);
  });
