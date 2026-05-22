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
  // Critical — server won't function without these
  { name: 'PORT', required: false, description: 'HTTP port (default: 8080)' },
  { name: 'NODE_ENV', required: false, description: 'Environment (default: development)' },

  // Supabase — core database
  { name: 'SUPABASE_URL', required: true, description: 'Supabase project URL' },
  { name: 'SUPABASE_SERVICE_KEY', required: true, description: 'Supabase service role key' },
  { name: 'SUPABASE_ANON_KEY', required: false, description: 'Supabase anon key (for client auth)' },

  // Auth
  { name: 'JWT_SECRET', required: true, description: 'JWT signing secret' },

  // LLM Providers (at least one should be set)
  { name: 'GROQ_API_KEY', required: false, description: 'Groq API key (Climate Assistant)' },
  { name: 'ANTHROPIC_API_KEY', required: false, description: 'Anthropic API key' },
  { name: 'GOOGLE_GEMINI_API_KEY', required: false, description: 'Google Gemini API key' },

  // Email (SES SMTP)
  { name: 'SMTP_HOST', required: false, description: 'Amazon SES SMTP host' },
  { name: 'SMTP_PORT', required: false, description: 'Amazon SES SMTP port (e.g. 587)' },
  { name: 'SMTP_SECURE', required: false, description: 'Amazon SES SMTP secure mode (true/false)' },
  { name: 'SMTP_USER', required: false, description: 'Amazon SES SMTP username' },
  { name: 'SMTP_PASS', required: false, description: 'Amazon SES SMTP password' },
  { name: 'EMAIL_FROM', required: false, description: 'Sender email address' },

  // Security
  { name: 'ADMIN_API_KEY', required: false, description: 'Admin endpoint auth key' },

  // Secret loader / vault
  { name: 'VAULT_PROVIDER', required: false, description: 'Vault provider: aiven (EU-sovereign) or gcp' },
  { name: 'GCP_SECRET_LOADER', required: false, description: 'Legacy: GCP Secret Manager (use VAULT_PROVIDER=gcp instead)' },
  { name: 'GCP_PROJECT_ID', required: false, description: 'GCP project ID for Secret Manager' },
];

export function validateEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const v of envSchema) {
    const value = process.env[v.name];
    if (!value || value.trim() === '') {
      if (v.required) {
        missing.push(`${v.name} — ${v.description}`);
      } else {
        warnings.push(`${v.name} not set — ${v.description}`);
      }
    }
  }

  // Check at least one LLM provider
  const hasLlm = !!(
    process.env.GROQ_API_KEY ||
    process.env.ANTHROPIC_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY
  );
  if (!hasLlm) {
    warnings.push('No LLM provider configured (GROQ_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_GEMINI_API_KEY)');
  }

  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpAvailable = Boolean(smtpHost && smtpUser && smtpPass);
  if (smtpHost && !smtpAvailable) {
    warnings.push('SMTP configured partially — set SMTP_HOST + SMTP_USER + SMTP_PASS for SES transport');
  }

  // Log results
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
