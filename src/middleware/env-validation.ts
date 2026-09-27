/**
 * Startup Environment Validation
 *
 * Validates required and optional env vars at boot.
 * Fails fast with clear error messages instead of cryptic runtime crashes.
 */

import logger from '../utils/logger.js';

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

const envSchema: EnvVar[] = [
  { name: 'PORT', required: false, description: 'HTTP port (default: 8080)' },
  { name: 'NODE_ENV', required: false, description: 'Environment (default: development)' },

  { name: 'SUPABASE_URL', required: true, description: 'Supabase project URL' },
  { name: 'SUPABASE_SERVICE_KEY', required: true, description: 'Supabase service role key' },
  {
    name: 'SUPABASE_ANON_KEY',
    required: false,
    description: 'Supabase anon key (for client auth)',
  },

  { name: 'JWT_SECRET', required: true, description: 'JWT signing secret' },

  { name: 'GROQ_API_KEY', required: false, description: 'Groq API key (Climate Assistant)' },
  { name: 'ANTHROPIC_API_KEY', required: false, description: 'Anthropic API key' },
  { name: 'GOOGLE_GEMINI_API_KEY', required: false, description: 'Google Gemini API key' },
  { name: 'BASETEN_API_KEY', required: false, description: 'Baseten API key (EU-resident cloud)' },
  {
    name: 'OLLAMA_BASE_URL',
    required: false,
    description: 'Self-hosted Ollama endpoint (Acer Veriton GN100 / DGX Spark), no API key needed',
  },
  {
    name: 'VLLM_BASE_URL',
    required: false,
    description: 'Self-hosted vLLM endpoint (Acer Veriton GN100 / DGX Spark)',
  },
  { name: 'OPENAI_API_KEY', required: false, description: 'OpenAI-compatible API key (fallback)' },

  // Email (SES SMTP — Resend banned per security policy)
  { name: 'SMTP_HOST', required: false, description: 'Amazon SES SMTP host' },
  { name: 'SMTP_PORT', required: false, description: 'Amazon SES SMTP port (e.g. 587)' },
  { name: 'SMTP_SECURE', required: false, description: 'Amazon SES SMTP secure mode (true/false)' },
  { name: 'SMTP_USER', required: false, description: 'Amazon SES SMTP username' },
  { name: 'SMTP_PASS', required: false, description: 'Amazon SES SMTP password' },
  { name: 'EMAIL_FROM', required: false, description: 'Sender email address' },

  { name: 'ADMIN_API_KEY', required: false, description: 'Admin endpoint auth key' },

  // NemoClaw (OpenShell-sandboxed) runtime — see docs/migrations/2026-06-25-openclaw-to-nemoclaw.md.
  { name: 'NEMOCLAW_ENDPOINT', required: false, description: 'NemoClaw runtime endpoint' },
  { name: 'NEMOCLAW_API_KEY', required: false, description: 'NemoClaw runtime bearer token' },
  {
    name: 'NEMOCLAW_ALLOWED_SKILLS',
    required: false,
    description: 'Comma-separated NemoClaw skill whitelist',
  },
  {
    name: 'NEMOCLAW_TIMEOUT_MS',
    required: false,
    description: 'NemoClaw invocation timeout in milliseconds',
  },
  {
    name: 'NEMOCLAW_MAX_RESPONSE_BYTES',
    required: false,
    description: 'NemoClaw response size cap in bytes',
  },
  { name: 'NEMOCLAW_LOG_BASE_PATH', required: false, description: 'NemoClaw audit log base path' },

  {
    name: 'LINKEDIN_ACCESS_TOKEN',
    required: false,
    description: 'LinkedIn OAuth access token (vault: linkedin-access-token)',
  },
  {
    name: 'LINKEDIN_AUTHOR_URN',
    required: false,
    description: 'LinkedIn author URN urn:li:person:… or urn:li:organization:… (vault: linkedin-author-urn)',
  },
  {
    name: 'LINKEDIN_ORGANIZATION_ID',
    required: false,
    description: 'Optional org id when LINKEDIN_AUTHOR_URN unset (vault: linkedin-organization-id)',
  },
  {
    name: 'FACEBOOK_PAGE_TOKEN',
    required: false,
    description: 'Meta Graph API page token (vault: facebook-page-token)',
  },
  {
    name: 'FACEBOOK_PAGE_ID',
    required: false,
    description: 'Meta Graph API page id (vault: facebook-page-id)',
  },

  {
    name: 'VAULT_PROVIDER',
    required: false,
    description: 'Vault provider: aiven (EU-sovereign) or gcp',
  },
  {
    name: 'GCP_SECRET_LOADER',
    required: false,
    description: 'Legacy: GCP Secret Manager (use VAULT_PROVIDER=gcp instead)',
  },
  { name: 'GCP_PROJECT_ID', required: false, description: 'GCP project ID for Secret Manager' },
  {
    name: 'AIVEN_DATABASE_URL',
    required: false,
    description: 'Aiven PostgreSQL connection URL for app_secrets table',
  },
  {
    name: 'AIVEN_VAULT_KEY',
    required: false,
    description: 'Aiven AES-256 symmetric key for pgcrypto secret encryption',
  },

  {
    name: 'BROKER_AGENT_TOKENS',
    required: false,
    description: 'JSON map of agent -> {tokenSha256, scopes} for broker auth',
  },
  {
    name: 'BROKER_SIGNING_KEY',
    required: false,
    description: 'HMAC key for signing/verifying broker capability tokens',
  },
];

export function validateEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const envVar of envSchema) {
    const value = process.env[envVar.name];
    if (!value || value.trim() === '') {
      if (envVar.required) {
        missing.push(`${envVar.name} — ${envVar.description}`);
      } else {
        warnings.push(`${envVar.name} not set — ${envVar.description}`);
      }
    }
  }

  // Must mirror the provider precedence in src/agents/llm-client.ts's
  // resolveProvider() — a self-hosted Ollama/vLLM endpoint is a fully valid
  // configuration and previously produced a false "no LLM provider" warning.
  const hasLlm = !!(
    process.env.ANTHROPIC_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.BASETEN_API_KEY ||
    process.env.OLLAMA_BASE_URL ||
    process.env.VLLM_BASE_URL ||
    process.env.OPENAI_API_KEY
  );
  if (!hasLlm) {
    warnings.push(
      'No LLM provider configured (ANTHROPIC_API_KEY, GROQ_API_KEY, GOOGLE_GEMINI_API_KEY, ' +
        'BASETEN_API_KEY, OLLAMA_BASE_URL, VLLM_BASE_URL, or OPENAI_API_KEY)',
    );
  }

  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpAvailable = Boolean(smtpHost && smtpUser && smtpPass);
  if (smtpHost && !smtpAvailable) {
    warnings.push(
      'SMTP configured partially — set SMTP_HOST + SMTP_USER + SMTP_PASS for SES transport',
    );
  }

  if (missing.length > 0) {
    logger.error('Missing required environment variables', { missing });
  }
  if (warnings.length > 0) {
    logger.warn('Missing optional environment variables', {
      count: warnings.length,
      vars: warnings,
    });
  }
  if (missing.length === 0) {
    logger.info('Environment validation passed', { smtpAvailable });
  }

  return { valid: missing.length === 0, missing, warnings };
}
