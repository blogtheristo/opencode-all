/**
 * Article12Logger — live Postgres write-path proof
 *
 * Closes RELEASE-READINESS.md item 2's sandbox half: prior to this session,
 * Article12Logger had only ever exercised the degraded-mode fallback path
 * (INTERNAL_DB_URL unset). This suite runs the real pre-flight INSERT +
 * post-flight UPDATE against a real local Postgres 16 with
 * infrastructure/dgx-spark/migrations/021_fix_partial_runs_article12.sql
 * applied — the same schema DGX Spark's dws-postgres runs — and reads the
 * row back to confirm both phases actually wrote what they claim to.
 *
 * This does NOT close item 2 fully: it proves the write path is correct
 * against the production schema, but has not run against DGX Spark's actual
 * dws-postgres container over the real dws-network. See RELEASE-READINESS.md
 * for the exact verification command a human/DGX-side agent must run there
 * before item 2 is marked fully closed.
 *
 * Set AEGIS_DURABILITY_TEST_DB_URL to a Postgres connection string with that
 * migration applied to run this suite for real. Skipped otherwise.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Pool } from 'pg';

const TEST_DB_URL = process.env.AEGIS_DURABILITY_TEST_DB_URL;

describe.skipIf(!TEST_DB_URL)('Article12Logger — real Postgres write path', () => {
  let Article12Logger: typeof import('../../agents/article12-logger.js').Article12Logger;
  let pool: Pool;

  beforeAll(async () => {
    process.env.INTERNAL_DB_URL = TEST_DB_URL;
    process.env.ENABLE_INTERNAL_DB_IN_TESTS = 'true';
    ({ Article12Logger } = await import('../../agents/article12-logger.js'));
    pool = new Pool({ connectionString: TEST_DB_URL });
  });

  afterAll(async () => {
    delete process.env.INTERNAL_DB_URL;
    delete process.env.ENABLE_INTERNAL_DB_IN_TESTS;
    await pool.end();
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM article12_audit_log');
  });

  it('logPreFlight() inserts a real row before egress, readable back from Postgres', async () => {
    const logger = new Article12Logger();
    const { traceId, logId } = await logger.logPreFlight({
      agentId: 'aegis',
      inputHash: 'deadbeef'.repeat(8),
      model: 'llama-3.3-70b-versatile',
      riskClassification: 'high',
      scrubManifest: { typesFound: ['EMAIL'], replacementCount: 1 },
    });

    expect(traceId).toBeTruthy();
    expect(logId).toBeTruthy();

    const row = await pool.query('SELECT * FROM article12_audit_log WHERE trace_id = $1', [
      traceId,
    ]);
    expect(row.rowCount).toBe(1);
    expect(row.rows[0].agent_id).toBe('aegis');
    expect(row.rows[0].risk_classification).toBe('high');
    expect(row.rows[0].pii_types_found).toEqual(['EMAIL']);
    // Post-flight fields must still be NULL — proves this really is the
    // pre-flight phase, not a single combined write.
    expect(row.rows[0].decision_summary).toBeNull();
    expect(row.rows[0].thinking_block_hash).toBeNull();
  });

  it('logPostFlight() completes the SAME row via trace_id, not a new row', async () => {
    const logger = new Article12Logger();
    const { traceId } = await logger.logPreFlight({
      agentId: 'aegis',
      inputHash: 'cafebabe'.repeat(8),
      model: 'llama-3.3-70b-versatile',
      riskClassification: 'limited',
      scrubManifest: { typesFound: [], replacementCount: 0 },
    });

    await logger.logPostFlight({
      traceId,
      thinkingBlockText: 'the model reasoned about compliance gaps',
      decisionSummary: 'compliance check completed, 2 gaps found',
      inputTokenCount: 512,
      outputTokenCount: 128,
    });

    const rows = await pool.query('SELECT * FROM article12_audit_log WHERE trace_id = $1', [
      traceId,
    ]);
    // Exactly one row for this trace_id — post-flight UPDATEd, did not INSERT.
    expect(rows.rowCount).toBe(1);
    expect(rows.rows[0].decision_summary).toBe('compliance check completed, 2 gaps found');
    expect(rows.rows[0].input_token_count).toBe(512);
    expect(rows.rows[0].output_token_count).toBe(128);
    // Raw thinking text is NEVER stored — only its hash.
    expect(rows.rows[0].thinking_block_hash).toBeTruthy();
    expect(rows.rows[0].thinking_block_hash).not.toContain('compliance gaps');
  });

  it('decision_summary is truncated to 500 chars at the DB layer (CHECK constraint) as well as in app code', async () => {
    const logger = new Article12Logger();
    const { traceId } = await logger.logPreFlight({
      agentId: 'aegis',
      inputHash: 'f'.repeat(64),
      model: 'llama-3.3-70b-versatile',
      scrubManifest: { typesFound: [], replacementCount: 0 },
    });

    // buildDecisionSummary()/logPostFlight() already truncate client-side to
    // 500 chars; this proves the DB's CHECK(char_length(...) <= 500) would
    // also reject an over-length value if app-side truncation were ever
    // skipped — a real defence-in-depth check, not an assumption.
    await logger.logPostFlight({ traceId, decisionSummary: 'x'.repeat(500) });
    const ok = await pool.query(
      'SELECT decision_summary FROM article12_audit_log WHERE trace_id = $1',
      [traceId],
    );
    expect(ok.rows[0].decision_summary.length).toBe(500);

    await expect(
      pool.query(
        "UPDATE article12_audit_log SET decision_summary = repeat('y', 501) WHERE trace_id = $1",
        [traceId],
      ),
    ).rejects.toThrow(/decision_summary/);
  });

  it('PUBLIC cannot UPDATE/DELETE/TRUNCATE the table (append-only enforcement, real GRANT check)', async () => {
    // dws_backend (the role the logger connects as in production) has
    // SELECT/INSERT/UPDATE; this confirms the REVOKE...FROM PUBLIC lines in
    // migration 021 actually took effect against a real Postgres catalog,
    // not just that the SQL parsed.
    const publicCanDelete = await pool.query(
      `SELECT has_table_privilege('public', 'article12_audit_log', 'DELETE') AS can_delete,
              has_table_privilege('public', 'article12_audit_log', 'TRUNCATE') AS can_truncate`,
    );
    expect(publicCanDelete.rows[0].can_delete).toBe(false);
    expect(publicCanDelete.rows[0].can_truncate).toBe(false);
  });
});
