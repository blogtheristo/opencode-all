/**
 * Test DWS backend HTTPS/API connectivity.
 *
 * Requires: DWS_API_URL or DWS_API_HEALTH_URL
 * Run: npm run diag:dws-api
 */

import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd());
for (const f of ['.env', '100326.env', '.env.local']) {
  const p = resolve(root, f);
  if (existsSync(p)) dotenv.config({ path: p, override: true });
}

function buildUrl(): string {
  if (process.env.DWS_API_HEALTH_URL) {
    return process.env.DWS_API_HEALTH_URL;
  }

  const base = process.env.DWS_API_URL;
  if (!base) {
    console.error('Missing DWS_API_URL or DWS_API_HEALTH_URL.');
    process.exit(1);
  }

  return `${base.replace(/\/$/, '')}/health`;
}

async function main() {
  const url = buildUrl();
  console.log(`Testing DWS API: ${url}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json, text/plain, */*' },
  });

  const body = await response.text();

  console.log(`Status: ${response.status} ${response.statusText}`);
  console.log(body.slice(0, 500));

  if (!response.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('DWS API connectivity test failed:', error);
  process.exit(1);
});
