/**
 * RLS contract tests for `agent_nudges` (migration 069) — runnable anywhere
 * valid DIRECT Postgres credentials exist.
 *
 * Contract under test (multi-tenant safety):
 *   1. RLS is enabled on agent_nudges.
 *   2. The service_role policy grants FOR ALL (USING/WITH CHECK true).
 *   3. anon / authenticated are default-denied: no SELECT visibility,
 *      no INSERT.
 *   4. The pending-dedup unique index rejects a second pending nudge for
 *      the same (org_id, signal_key, entity_id).
 *
 * Everything runs inside ONE transaction that is always rolled back — the
 * test never leaves state behind. Expected-error statements are wrapped in
 * SAVEPOINTs so an abort doesn't poison subsequent assertions.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npm run db:test:rls
 *   (reads .env.local when present)
 *
 * Exit codes: 0 = pass, 1 = assertion/config failure,
 *             2 = could not authenticate to Postgres (creds invalid/rotated)
 */

import { existsSync } from 'node:fs';
import dotenv from 'dotenv';
import pg from 'pg';

// Prefer .env.local (where direct-Postgres creds live in this repo), fall back to .env.
for (const f of ['.env.local', '.env']) {
  if (existsSync(f)) dotenv.config({ path: f });
}

let failures = 0;
function ok(cond: boolean, label: string): void {
  console.log(`${cond ? 'ok' : 'not ok'} - ${label}`);
  if (!cond) failures++;
}

/** Run stmt under a savepoint; return {threw, result} without poisoning the txn. */
async function attempted(
  client: pg.Client,
  stmt: string,
  params?: unknown[],
): Promise<{ threw: boolean; result?: pg.QueryResult }> {
  const sp = `sp_${Math.random().toString(36).slice(2)}`;
  await client.query(`SAVEPOINT ${sp}`);
  try {
    const result = await client.query(stmt, params);
    await client.query(`RELEASE ${sp}`);
    return { threw: false, result };
  } catch {
    await client.query(`ROLLBACK TO ${sp}`);
    await client.query(`RELEASE ${sp}`);
    return { threw: true };
  }
}

const SEED = `INSERT INTO agent_nudges
  (id, org_id, signal_key, entity_id, agent_name, recipient_role,
   tier, gate_decision, subject, body, escalate_at)
VALUES (gen_random_uuid(), $1, 'test-signal', 'test-entity', 'rls-test-agent',
        'owner', 'threshold', 'flag_for_review', 'RLS test', 'RLS test body',
        now() + interval '4 hours')`;

async function seedBothOrgs(client: pg.Client): Promise<void> {
  for (const org of ['rls-test-org-a', 'rls-test-org-b']) {
    await client.query(SEED, [org]);
  }
}

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error(
      '# FAIL LOUD: DATABASE_URL is not set. Direct-Postgres RLS tests need\n' +
        '# real credentials (the app itself uses the REST API and does not need them).\n' +
        '# Provide DATABASE_URL pointing at the target Supabase/Aiven Postgres.',
    );
    process.exit(1);
  }

  const client = new pg.Client({
    connectionString: url,
    ssl: url.includes('sslmode=disable') ? undefined : { rejectUnauthorized: false },
  });

  try {
    await client.connect();
  } catch (err) {
    console.error(
      `# FAIL LOUD: cannot connect/authenticate to Postgres (${(err as Error).message}).\n` +
        '# Direct credentials are likely invalid or rotated. Do NOT guess secrets —\n' +
        '# provision fresh creds for the target database and re-run.',
    );
    process.exit(2);
  }

  try {
    await client.query('BEGIN');

    // ── Schema-level contract ────────────────────────────────────────────
    const rls = await client.query(
      `SELECT relrowsecurity FROM pg_class WHERE relname = 'agent_nudges'`,
    );
    ok(rls.rows[0]?.relrowsecurity === true, 'RLS is enabled on agent_nudges');

    const policies = await client.query(
      `SELECT policy_name, cmd, array_agg(DISTINCT r::text) AS roles
         FROM pg_policies p
         CROSS JOIN LATERAL unnest(p.roles) r
        WHERE schemaname = 'public' AND tablename = 'agent_nudges'
        GROUP BY policy_name, cmd`,
    );
    const svcAll = policies.rows.find((p) => p.policy_name === 'agent_nudges_service_all');
    ok(
      !!svcAll &&
        svcAll.cmd === 'ALL' &&
        (svcAll.roles as string[]).includes('service_role') &&
        (svcAll.roles as string[]).length === 1,
      'service_role policy grants FOR ALL (and only to service_role)',
    );

    // ── Pending-dedup unique index ───────────────────────────────────────
    await seedBothOrgs(client);
    const dup = await attempted(client, SEED, ['rls-test-org-a']); // same signal+entity
    ok(dup.threw, 'duplicate pending nudge rejected by unique index');

    // ── Role-based access: anon / authenticated are default-denied ──────
    for (const role of ['anon', 'authenticated']) {
      const sw = await attempted(client, `SET LOCAL ROLE ${role}`);
      if (!sw.threw) {
        const read = await attempted(client, `SELECT count(*)::int AS n FROM agent_nudges`);
        ok(
          !read.threw && Number(read.result?.rows[0]?.n) === 0,
          `${role} sees zero nudges (default-deny read)`,
        );

        const write = await attempted(
          client,
          `INSERT INTO agent_nudges
             (id, org_id, signal_key, entity_id, agent_name, recipient_role,
              tier, gate_decision, subject, body, escalate_at)
           VALUES (gen_random_uuid(), 'rls-test-org-a', 'w-s', 'w-e', 'a', 'r',
                   'threshold', 'digest', 'x', 'y', now())`,
        );
        ok(write.threw, `${role} cannot INSERT nudges`);

        await client.query('RESET ROLE');
      } else {
        ok(false, `${role}: could not SET ROLE (needs membership grant to connector)`);
        ok(false, `${role}: INSERT test skipped`);
      }
    }

    await client.query('ROLLBACK');
    console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'}: ${failures} failure(s)`);
    process.exitCode = failures === 0 ? 0 : 1;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('# FAIL LOUD: unexpected runner error:', (err as Error).message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
