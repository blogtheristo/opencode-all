/**
 * Apply migration 043 (report_templates table) directly via pg.
 * Use when supabase db push fails due to migration history mismatch.
 *
 * Requires: DATABASE_URL in .env (Supabase DB connection string from Project Settings > Database)
 * Run: npm run db:migrate:043
 */

import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd());
for (const f of ['.env', '100326.env', '.env.local']) {
  const p = resolve(root, f);
  if (existsSync(p)) dotenv.config({ path: p, override: true });
}

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  getConnectionDebugInfo,
  getInsecureSslConfig,
  sanitizePostgresConnectionString,
} from './lib/pg-connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error('Missing DATABASE_URL or SUPABASE_DB_URL. Add to .env.local from Supabase Dashboard > Project Settings > Database.');
    process.exit(1);
  }
  if (dbUrl.includes('your-project')) {
    console.error('DATABASE_URL has placeholder "your-project". Replace with your real Supabase project ref.');
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
    console.log(`Connecting to ${connectionInfo.host}:${connectionInfo.port} with sanitized SSL settings...`);
    await client.connect();
    const sql = readFileSync(
      join(__dirname, '..', 'supabase', 'migrations', '043_report_templates.sql'),
      'utf-8'
    );
    await client.query(sql);
    console.log('Migration 043 applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
