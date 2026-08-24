/**
 * Test Supabase REST connectivity separately from direct Postgres.
 *
 * Requires: SUPABASE_URL and SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY
 * Run: npm run diag:supabase-rest
 */

import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd());
for (const f of ['.env', '100326.env', '.env.local']) {
  const p = resolve(root, f);
  if (existsSync(p)) dotenv.config({ path: p, override: true });
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const apiKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !apiKey) {
    console.error('Missing SUPABASE_URL and SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY.');
    process.exit(1);
  }

  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/`;
  console.log(`Testing Supabase REST: ${url}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  });

  const body = await response.text();

  console.log(`Status: ${response.status} ${response.statusText}`);
  console.log(body.slice(0, 500));

  if (response.status >= 500) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Supabase REST connectivity test failed:', error);
  process.exit(1);
});
