/**
 * provision-secrets-aiven.ts — Push .env secrets to Aiven PostgreSQL vault
 *
 * Code-Version: 1.0.0
 * Date: 2026-03-29
 * Owner: Claude Code
 *
 * Usage:
 *   npx tsx scripts/provision-secrets-aiven.ts                  # reads .env
 *   npx tsx scripts/provision-secrets-aiven.ts --dry-run        # preview only
 *   npx tsx scripts/provision-secrets-aiven.ts --env .env.prod  # specific file
 *
 * Requires: AIVEN_DATABASE_URL in environment or .env file.
 * Creates `app_secrets` table if it doesn't exist.
 *
 * Naming convention (matches secret-loader.ts):
 *   SUPABASE_SERVICE_KEY → supabase-service-key
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import pg from 'pg';

// Keys to SKIP (config, not secrets)
const SKIP_KEYS = new Set([
  'NODE_ENV', 'PORT', 'CORS_ORIGIN', 'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS', 'FIREHORSE_SCHEDULER_ENABLED',
  'FIREHORSE_DAILY_JOB_TIME', 'FIREHORSE_FOLLOWUP_JOB_INTERVAL',
  'FIREHORSE_MAX_DAILY_LEADS', 'ERP_SCHEDULER_ENABLED',
  'ERP_APPROVAL_GATE_ENABLED', 'ERP_AUTO_APPROVE_LOW_RISK',
  'ERP_APPROVAL_TIMEOUT_MINUTES', 'ERP_REQUIRE_DUAL_APPROVAL',
  'MONITOR_ERP_ENABLED', 'IFS_ENABLED', 'DYNAMICS_365_ENABLED',
  'SAP_ENABLED', 'VISMA_ENABLED', 'JEEVES_ENABLED',
  'WORLDFAVOR_ENABLED', 'POSITION_GREEN_ENABLED',
  'EMAIL_SERVICE', 'FROM_NAME', 'LOG_LEVEL', 'ENV_SCHEMA_VERSION',
  'AIVEN_ENABLED', 'AIVEN_DB_SSLMODE', 'AIVEN_DATABASE_URL', 'AIVEN_VAULT_KEY',
  'AIVEN_DB_HOST', 'AIVEN_DB_PORT', 'AIVEN_DB_NAME',
  'AIVEN_DB_USER', 'AIVEN_DB_PASSWORD',
  'VAULT_PROVIDER', 'GCP_SECRET_LOADER', 'GCP_PROJECT_ID',
]);

function toSecretKey(envVar: string): string {
  return envVar.toLowerCase().replace(/_/g, '-');
}

function isPlaceholder(val: string): boolean {
  if (!val) return true;
  if (val.startsWith('your-') || val.startsWith('YOUR-')) return true;
  if (val.endsWith('-here') || val.endsWith('-HERE')) return true;
  if (val === 'false' || val === 'true') return true;
  return false;
}

function parseEnvFile(filePath: string): Map<string, string> {
  const entries = new Map<string, string>();
  const content = readFileSync(filePath, 'utf-8');

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 1) continue;

    const key = trimmed.slice(0, eqIdx);
    let value = trimmed.slice(eqIdx + 1);

    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (SKIP_KEYS.has(key)) continue;
    if (isPlaceholder(value)) continue;

    entries.set(key, value);
  }

  return entries;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const envIdx = args.indexOf('--env');
  const envFile = envIdx >= 0 ? args[envIdx + 1] : '.env';
  const envPath = resolve(envFile);

  // Load .env for AIVEN_DATABASE_URL if not already set
  if (!process.env.AIVEN_DATABASE_URL) {
    const { config } = await import('dotenv');
    config({ path: envPath });
  }

  const connUrl = process.env.AIVEN_DATABASE_URL;
  if (!connUrl) {
    console.error('ERROR: AIVEN_DATABASE_URL not set. Set it in .env or environment.');
    process.exit(1);
  }

  const vaultKey = process.env.AIVEN_VAULT_KEY;
  if (!vaultKey) {
    console.error('ERROR: AIVEN_VAULT_KEY not set. This is the encryption passphrase for secrets.');
    console.error('Generate one: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
    process.exit(1);
  }

  console.log('=== DWS Secret Provisioning → Aiven PostgreSQL (encrypted) ===');
  console.log(`File:    ${envPath}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  const secrets = parseEnvFile(envPath);
  console.log(`Parsed ${secrets.size} secrets from ${envFile}\n`);

  if (dryRun) {
    for (const [key, val] of secrets) {
      const secretKey = toSecretKey(key);
      console.log(`  WOULD UPSERT: ${secretKey} ← ${key} (${val.length} chars)`);
    }
    console.log(`\nDry run complete. ${secrets.size} secrets would be provisioned.`);
    return;
  }

  const client = new pg.Client({
    connectionString: connUrl,
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('Connected to Aiven PostgreSQL\n');

    // Create pgcrypto + table (idempotent)
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_secrets (
        key TEXT PRIMARY KEY,
        value BYTEA NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    let created = 0;
    let updated = 0;

    for (const [envVar, value] of secrets) {
      const secretKey = toSecretKey(envVar);

      // Encrypt with pgp_sym_encrypt (AES-256)
      const result = await client.query(
        `INSERT INTO app_secrets (key, value, updated_at)
         VALUES ($1, pgp_sym_encrypt($2, $3), NOW())
         ON CONFLICT (key) DO UPDATE SET value = pgp_sym_encrypt($2, $3), updated_at = NOW()
         RETURNING (xmax = 0) AS is_insert`,
        [secretKey, value, vaultKey],
      );

      const isNew = result.rows[0]?.is_insert;
      if (isNew) {
        console.log(`  CREATED: ${secretKey} ← ${envVar}`);
        created++;
      } else {
        console.log(`  UPDATED: ${secretKey} ← ${envVar}`);
        updated++;
      }
    }

    // Also store by env var name (for direct lookup)
    for (const [envVar, value] of secrets) {
      await client.query(
        `INSERT INTO app_secrets (key, value, updated_at)
         VALUES ($1, pgp_sym_encrypt($2, $3), NOW())
         ON CONFLICT (key) DO UPDATE SET value = pgp_sym_encrypt($2, $3), updated_at = NOW()`,
        [envVar, value, vaultKey],
      );
    }

    console.log(`\n=== Summary ===`);
    console.log(`Created: ${created}`);
    console.log(`Updated: ${updated}`);
    console.log(`Total:   ${secrets.size} secrets (stored by both key formats)`);
    console.log(`\nSecrets accessible via: VAULT_PROVIDER=aiven + AIVEN_DATABASE_URL`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('FATAL:', err.message || err);
  process.exit(1);
});
