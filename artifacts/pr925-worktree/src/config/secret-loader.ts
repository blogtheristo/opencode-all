/**
 * Secret Loader — Multi-Provider Vault → process.env
 *
 * Code-Version: 2.0.0
 * Branch: claude/fix-config-dependencies-7npjf
 * Date: 2026-03-29
 * Owner: Claude Code
 *
 * Resolves the laptop-.env dependency by loading secrets from a vault at startup.
 *
 * Supported providers:
 *   - "aiven"  — EU-sovereign (Finnish company, no CLOUD Act). Secrets stored
 *                in Aiven PostgreSQL `app_secrets` table. RECOMMENDED.
 *   - "gcp"    — Google Cloud Secret Manager (US company, CLOUD Act applies).
 *
 * Priority order (highest wins):
 *   1. process.env values that already exist at startup
 *      (Cloud Run/host env + dotenv values loaded before loadSecrets())
 *   2. Vault provider (fills only missing keys)
 *
 * Usage:
 *   await loadSecrets();  // call before validateEnv()
 *
 * Bootstrap (minimum env vars needed per provider):
 *   Aiven: VAULT_PROVIDER=aiven + AIVEN_DATABASE_URL + AIVEN_VAULT_KEY (2 secrets)
 *   GCP:   VAULT_PROVIDER=gcp   + GCP_PROJECT_ID (+ ADC credentials)
 *
 * Aiven encryption: secrets encrypted with pgcrypto pgp_sym_encrypt (AES-256).
 * AIVEN_VAULT_KEY is a symmetric passphrase — store it separately from the DB URL.
 *
 * Naming convention (env var → secret key):
 *   SUPABASE_SERVICE_KEY → supabase-service-key (lowercase, underscores to hyphens)
 */

import logger from '../utils/logger.js';

// ---------------------------------------------------------------------------
// Secret map — env vars we want from the vault
// ---------------------------------------------------------------------------
const SECRET_MAP: Record<string, string> = {
  // Supabase
  SUPABASE_URL: 'supabase-url',
  SUPABASE_ANON_KEY: 'supabase-anon-key',
  SUPABASE_SERVICE_KEY: 'supabase-service-key',

  // Auth
  JWT_SECRET: 'jwt-secret',

  // Email (SES SMTP)
  SMTP_HOST: 'smtp-host',
  SMTP_USER: 'smtp-user',
  SMTP_PASS: 'smtp-pass',

  // AI
  ANTHROPIC_API_KEY: 'anthropic-api-key',
  GROQ_API_KEY: 'groq-api-key',

  // Redis
  REDIS_URL: 'redis-url',

  // Admin
  ADMIN_API_KEY: 'admin-api-key',
};

// ---------------------------------------------------------------------------
// Provider: Aiven PostgreSQL (EU-sovereign)
// ---------------------------------------------------------------------------
// Stores secrets in a simple `app_secrets` table in your Aiven PostgreSQL.
// Finnish company, ISO 27001, SOC 2, no CLOUD Act exposure.
// Bootstrap: only AIVEN_DATABASE_URL needed — everything else comes from the table.

async function loadFromAiven(connectionUrl: string): Promise<Record<string, string>> {
  const secrets: Record<string, string> = {};

  const { Client } = await import('pg');
  const client = new Client({
    connectionString: connectionUrl,
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();

    // Ensure pgcrypto + table exist (idempotent)
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_secrets (
        key TEXT PRIMARY KEY,
        value BYTEA NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Decrypt at read time using AIVEN_VAULT_KEY (symmetric AES-256)
    const vaultKey = process.env.AIVEN_VAULT_KEY;
    if (!vaultKey) {
      logger.warn('Aiven provider: AIVEN_VAULT_KEY not set — cannot decrypt secrets');
      return secrets;
    }

    const { rows } = await client.query<{ key: string; value: string }>(
      `SELECT key, pgp_sym_decrypt(value, $1) AS value FROM app_secrets`,
      [vaultKey],
    );

    for (const row of rows) {
      secrets[row.key] = row.value;
    }
  } finally {
    await client.end();
  }

  return secrets;
}

// ---------------------------------------------------------------------------
// Provider: GCP Secret Manager
// ---------------------------------------------------------------------------

async function getGcpAccessToken(): Promise<string | null> {
  // Try metadata server first (Cloud Run / GCE / GKE)
  try {
    const res = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      {
        headers: { 'Metadata-Flavor': 'Google' },
        signal: AbortSignal.timeout(2000),
      },
    );
    if (res.ok) {
      const data = await res.json() as { access_token?: string };
      if (data.access_token) return data.access_token;
    }
  } catch {
    // Not on GCP — fall through to gcloud CLI
  }

  // Try gcloud CLI (local development)
  try {
    const { execFile } = await import('child_process');
    const { promisify } = await import('util');
    const execFileAsync = promisify(execFile);
    const { stdout } = await execFileAsync('gcloud', [
      'auth', 'application-default', 'print-access-token',
    ]);
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function loadFromGcp(projectId: string): Promise<Record<string, string>> {
  const secrets: Record<string, string> = {};

  const accessToken = await getGcpAccessToken();
  if (!accessToken) {
    logger.warn('GCP provider: no credentials available');
    return secrets;
  }

  const fetches = Object.entries(SECRET_MAP).map(async ([envVar, secretName]) => {
    const url =
      `https://secretmanager.googleapis.com/v1/projects/${projectId}/secrets/${secretName}/versions/latest:access`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        logger.debug('GCP provider: secret fetch returned non-OK status', {
          projectId,
          secretName,
          status: res.status,
        });
        return;
      }
      const body = await res.json() as { payload?: { data?: string } };
      const b64 = body?.payload?.data;
      if (b64) {
        secrets[envVar] = Buffer.from(b64, 'base64').toString('utf-8');
      }
    } catch {
      // Individual secret fetch failure — skip
    }
  });

  await Promise.allSettled(fetches);
  return secrets;
}

// ---------------------------------------------------------------------------
// Main loader
// ---------------------------------------------------------------------------

/**
 * Load secrets from configured vault provider into process.env.
 *
 * Set VAULT_PROVIDER to enable:
 *   - "aiven" (recommended, EU-sovereign) — needs AIVEN_DATABASE_URL
 *   - "gcp" — needs GCP_PROJECT_ID
 *
 * Legacy: GCP_SECRET_LOADER=true still works (maps to VAULT_PROVIDER=gcp).
 * Never overwrites already-set env vars.
 */
export async function loadSecrets(): Promise<void> {
  // Determine provider
  let provider = process.env.VAULT_PROVIDER?.toLowerCase();

  // Legacy compat: GCP_SECRET_LOADER=true → provider=gcp
  if (!provider && process.env.GCP_SECRET_LOADER === 'true') {
    provider = 'gcp';
  }

  if (!provider) {
    logger.info('Secret loader: disabled (set VAULT_PROVIDER=aiven or gcp to enable)');
    return;
  }

  logger.info(`Secret loader: provider=${provider}`);

  let vaultSecrets: Record<string, string> = {};

  try {
    if (provider === 'aiven') {
      const connUrl = process.env.AIVEN_DATABASE_URL;
      if (!connUrl) {
        logger.warn('Secret loader: AIVEN_DATABASE_URL not set — skipping');
        return;
      }
      vaultSecrets = await loadFromAiven(connUrl);
    } else if (provider === 'gcp') {
      const projectId = process.env.GCP_PROJECT_ID;
      if (!projectId) {
        logger.warn('Secret loader: GCP_PROJECT_ID not set — skipping');
        return;
      }
      vaultSecrets = await loadFromGcp(projectId);
    } else {
      logger.warn(`Secret loader: unknown provider "${provider}" — skipping`);
      return;
    }
  } catch (err) {
    logger.error(`Secret loader failed: ${err instanceof Error ? err.message : err}`);
    return;
  }

  // Apply to process.env (never overwrite existing)
  let loaded = 0;
  let skipped = 0;

  for (const [envVar, secretKey] of Object.entries(SECRET_MAP)) {
    if (process.env[envVar]) {
      skipped++;
      continue;
    }

    // Aiven stores by secret key (supabase-service-key), try both formats
    const value = vaultSecrets[envVar] || vaultSecrets[secretKey];
    if (value) {
      process.env[envVar] = value;
      loaded++;
    }
  }

  const total = Object.keys(SECRET_MAP).length;
  logger.info(`Secret loader: ${loaded} loaded, ${skipped} already set, ${total - loaded - skipped} not found`);
}
