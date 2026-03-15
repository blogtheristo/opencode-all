/**
 * Test Veriton-hosted Ollama connectivity.
 *
 * Requires: OLLAMA_HOST
 * Run: npm run diag:ollama
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
  const host = process.env.OLLAMA_HOST;

  if (!host) {
    console.error('Missing OLLAMA_HOST.');
    process.exit(1);
  }

  const url = `${host.replace(/\/$/, '')}/api/tags`;
  console.log(`Testing Ollama endpoint: ${url}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const body = await response.text();

  console.log(`Status: ${response.status} ${response.statusText}`);
  console.log(body.slice(0, 1000));

  if (!response.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Ollama connectivity test failed:', error);
  process.exit(1);
});
