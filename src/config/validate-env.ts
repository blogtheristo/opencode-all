/**
 * Startup Environment Validation
 *
 * Validates all required env vars on boot using Zod.
 * Fails fast with a clear message instead of cryptic runtime errors.
 */

import { z } from 'zod';
import logger from '../utils/logger.js';

/** Required env vars for the backend to function */
const EnvSchema = z.object({
  // Server
  PORT: z.string().default('8080'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase (required for auth + data)
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),

  // JWT (required for auth)
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),

  // Optional but logged
  GROQ_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  // RESEND_API_KEY removed — Resend banned per security policy (2026-03-26 incident)
  ADMIN_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

/**
 * Validate environment variables. Call at startup before starting the server.
 * Throws with a clear message listing all missing/invalid vars.
 */
export function validateEnv(): Env {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues.map(
      (i) => `  - ${i.path.join('.')}: ${i.message}`,
    );
    const msg = `Environment validation failed:\n${issues.join('\n')}`;
    logger.error(msg);
    throw new Error(msg);
  }

  // Log optional service availability
  const env = result.data;
  const services = [
    { name: 'Groq LLM', available: !!env.GROQ_API_KEY },
    { name: 'Anthropic LLM', available: !!env.ANTHROPIC_API_KEY },
    // Resend removed — banned per security policy (2026-03-26 incident). Using Amazon SES.
    { name: 'Redis', available: !!env.REDIS_URL },
  ];

  for (const s of services) {
    if (s.available) {
      logger.info(`Service available: ${s.name}`);
    } else {
      logger.warn(`Service unavailable: ${s.name} (key not set)`);
    }
  }

  return env;
}
