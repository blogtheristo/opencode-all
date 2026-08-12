/**
 * Secret Loader — Multi-Provider Vault → process.env
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
 *   2. Vault provider (fills only missing keys — never overwrites)
 *
 * Usage:
 *   await loadSecrets();  // call before validateEnv()
 *
 * Bootstrap (minimum env vars needed per provider):
 *   Aiven: VAULT_PROVIDER=aiven + AIVEN_DATABASE_URL + AIVEN_VAULT_KEY
 *   GCP:   VAULT_PROVIDER=gcp   + GCP_PROJECT_ID (+ ADC credentials)
 *
 * Naming convention (env var → secret key):
 *   SUPABASE_SERVICE_KEY → supabase-service-key (lowercase, underscores to hyphens)
 */

import logger from '../utils/logger.js';

interface PgClientConfig {
  connectionString: string;
  ssl?: { rejectUnauthorized: boolean };
  connectionTimeoutMillis?: number;
}

interface PgRow {
  key: string;
  value: string;
}

interface PgQueryResult<T> {
  rows: T[];
}

interface PgClient {
  connect(): Promise<void>;
  query<T>(text: string, values?: unknown[]): Promise<PgQueryResult<T>>;
  end(): Promise<void>;
}

interface PgClientConstructor {
  new (config: PgClientConfig): PgClient;
}

const SECRET_MAP: Record<string, string> = {
  SUPABASE_URL: 'supabase-url',
  SUPABASE_ANON_KEY: 'supabase-anon-key',
  SUPABASE_SERVICE_KEY: 'supabase-service-key',

  JWT_SECRET: 'jwt-secret',

  SMTP_HOST: 'smtp-host',
  SMTP_USER: 'smtp-user',
  SMTP_PASS: 'smtp-pass',

  ANTHROPIC_API_KEY: 'anthropic-api-key',
  GROQ_API_KEY: 'groq-api-key',
  OPENROUTER_API_KEY: 'openrouter-api-key',
  TELEGRAM_BOT_TOKEN: 'telegram-bot-token',
  GMAIL_ACCESS_TOKEN: 'gmail-access-token',

  REDIS_URL: 'redis-url',

  ADMIN_API_KEY: 'admin-api-key',
  BROKER_SIGNING_KEY: 'broker-signing-key',
  BROKER_AGENT_TOKENS: 'broker-agent-tokens',

  NEMOCLAW_ENDPOINT: 'nemoclaw-endpoint',
  NEMOCLAW_API_KEY: 'nemoclaw-api-key',
  NEMOCLAW_NGC_KEY: 'nemoclaw-ngc-key', // NIM/Nemotron pull token

  EXA_API_KEY: 'exa-api-key',
};

async function loadFromAiven(connectionUrl: string): Promise<Record<string, string>> {
  const secrets: Record<string, string> = {};

  let Client: PgClientConstructor;
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    ({ Client } = require('pg') as { Client: PgClientConstructor });
  } catch {
    logger.warn('Aiven provider: `pg` package not installed — run `npm install pg`');
    return secrets;
  }
  const client = new Client({
    connectionString: connectionUrl,
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();

    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_secrets (
        key TEXT PRIMARY KEY,
        value BYTEA NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const vaultKey = process.env.AIVEN_VAULT_KEY;
    if (!vaultKey) {
      logger.warn('Aiven provider: AIVEN_VAULT_KEY not set — cannot decrypt secrets');
      return secrets;
    }

    const { rows } = await client.query<PgRow>(
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

async function getGcpAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      {
        headers: { 'Metadata-Flavor': 'Google' },
        signal: AbortSignal.timeout(2000),
      },
    );
    if (res.ok) {
      const data = (await res.json()) as { access_token?: string };
      if (data.access_token) {
        return data.access_token;
      }
    }
  } catch {
    // Not on GCP — fall through to gcloud CLI.
  }

  try {
    const { execFile } = await import('child_process');
    const { promisify } = await import('util');
    const execFileAsync = promisify(execFile);
    const gcloudOverride = process.env.GCLOUD_BIN?.trim();
    const gcloudCandidates = [
      ...(gcloudOverride ? [gcloudOverride] : []),
      ...(process.platform === 'win32'
        ? [
            'gcloud.cmd',
            'gcloud',
            'C:\\Program Files\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd',
            'C:\\Program Files (x86)\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd',
          ]
        : ['gcloud']),
    ].filter((candidate, index, candidates) => candidate && candidates.indexOf(candidate) === index);

    for (const gcloudBin of gcloudCandidates) {
      try {
        const { stdout } = await execFileAsync(gcloudBin, [
          'auth', 'application-default', 'print-access-token',
        ]);
        const token = stdout.trim();
        if (token) {
          return token;
        }
      } catch {
        // Try next candidate.
      }
    }

    return null;
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
      const body = (await res.json()) as { payload?: { data?: string } };
      const b64 = body?.payload?.data;
      if (b64) {
        secrets[envVar] = Buffer.from(b64, 'base64').toString('utf-8');
      }
    } catch {
      // Individual secret fetch failure — skip.
    }
  });

  await Promise.allSettled(fetches);
  return secrets;
}

export async function loadSecrets(): Promise<void> {
  let provider = process.env.VAULT_PROVIDER?.toLowerCase();

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

  let loaded = 0;
  let skipped = 0;

  for (const [envVar, secretKey] of Object.entries(SECRET_MAP)) {
    if (process.env[envVar]) {
      skipped++;
      continue;
    }

    const value = vaultSecrets[envVar] || vaultSecrets[secretKey];
    if (value) {
      process.env[envVar] = value;
      loaded++;
    }
  }

  const total = Object.keys(SECRET_MAP).length;
  logger.info(
    `Secret loader: ${loaded} loaded, ${skipped} already set, ${total - loaded - skipped} not found`,
  );
}
