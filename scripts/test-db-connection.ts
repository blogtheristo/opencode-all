/**
 * Test direct Postgres connectivity to Supabase.
 *
 * Requires: DATABASE_URL or SUPABASE_DB_URL in .env / .env.local
 * Run: npm run db:test
 */

import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import {
  getConnectionDebugInfo,
  getInsecureSslConfig,
  sanitizePostgresConnectionString,
} from './lib/pg-connection.js';

const root = resolve(process.cwd());
for (const f of ['.env', '100326.env', '.env.local']) {
  const p = resolve(root, f);
  if (existsSync(p)) dotenv.config({ path: p, override: true });
}

async function main() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

  if (!dbUrl) {
    console.error('Missing DATABASE_URL or SUPABASE_DB_URL.');
    process.exit(1);
  }

  if (dbUrl.includes('[YOUR-PASSWORD]') || dbUrl.includes('your-project')) {
    console.error('DATABASE_URL still contains a placeholder. Replace it with the real DB connection string.');
    process.exit(1);
  }

  const sanitizedDbUrl = sanitizePostgresConnectionString(dbUrl);
  const connectionInfo = getConnectionDebugInfo(sanitizedDbUrl);

  const pg = await import('pg');
  const client = new pg.default.Client({
    connectionString: sanitizedDbUrl,
    ssl: getInsecureSslConfig(),
  });

  try {
    console.log(`Testing connection to ${connectionInfo.host}:${connectionInfo.port}...`);
    await client.connect();

    const result = await client.query(`
      select
        1 as ok,
        now() as db_time,
        current_database() as database_name,
        current_user as db_user,
        inet_server_addr() as server_ip,
        inet_client_addr() as client_ip
    `);

    console.table(result.rows);
    console.log('Direct Postgres connection works.');
  } catch (err) {
    console.error('DB test failed:', err);
    process.exit(1);
  } finally {
    await client.end().catch(() => undefined);
  }
}

main();
