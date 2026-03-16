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

  // Email
  { name: 'EMAIL_FROM', required: false, description: 'Sender email address' },

  // Security
  { name: 'ADMIN_API_KEY', required: false, description: 'Admin endpoint auth key' },
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
    logger.info('Environment validation passed');
  }

  return { valid: missing.length === 0, missing, warnings };
}
