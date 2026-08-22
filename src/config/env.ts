/**
 * Centralized, validated environment configuration.
 *
 * Loads .env at module top (side effect) so any module that imports this file
 * — directly or transitively — is guaranteed to see dotenv-populated variables
 * before reading `process.env` at module-load time. This fixes the historical
 * ES-module import-ordering bug where statically imported services (e.g.
 * auth.service.ts) evaluated before `dotenv.config()` ran in app.ts.
 *
 * Usage:
 *   import { getEnv } from '../config/env.js';
 *   const { JWT_SECRET } = getEnv();
 *
 * The vault bootstrap (secret-loader.ts) runs later in app.ts and may inject
 * additional secrets into process.env; call `refreshEnv()` after mutating
 * process.env to re-validate the snapshot.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// Idempotent: existing process.env values are never overridden by .env.
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().optional(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).optional(),

  // Validated for presence/shape here; fail-fast on missing required values
  // stays in the consuming service (auth.service.ts) to preserve exact
  // startup-error semantics.
  JWT_SECRET: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | null = null;

export function refreshEnv(): AppEnv {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    throw new Error(`Invalid environment configuration:\n${issues.join('\n')}`);
  }
  cached = parsed.data;
  return cached;
}

export function getEnv(): AppEnv {
  return cached ?? refreshEnv();
}
