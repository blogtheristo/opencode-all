/**
 * Test MCP HTTP connectivity.
 *
 * Requires one of:
 *   - MCP_HUB_URL / MCP_HUB_HEALTH_URL (DGX-hosted orchestration hub)
 *   - MCP_GATEWAY_URL (remote/mobile gateway)
 *   - DWS_MCP_AGENT_URL (DWS backend agent MCP)
 * Run: npm run diag:mcp
 */

import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd());
for (const f of ['.env', '.env.mcp', '100326.env', '.env.local']) {
  const p = resolve(root, f);
  if (existsSync(p)) dotenv.config({ path: p, override: true });
}

interface Target {
  name: string;
  url: string;
}

function normalizeHealthUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim().replace(/\/$/, '');
  if (trimmed.endsWith('/health')) {
    return trimmed;
  }

  if (trimmed.endsWith('/mcp')) {
    return `${trimmed}/health`;
  }

  return `${trimmed}/health`;
}

function buildTargets(): Target[] {
  const candidates: Array<[string, string | undefined]> = [
    ['MCP_HUB_HEALTH_URL', process.env.MCP_HUB_HEALTH_URL],
    ['MCP_HUB_URL', process.env.MCP_HUB_URL],
    ['MCP_GATEWAY_URL', process.env.MCP_GATEWAY_URL],
    ['DWS_MCP_AGENT_URL', process.env.DWS_MCP_AGENT_URL],
  ];

  return candidates
    .filter(([, value]): value is string => Boolean(value?.trim()))
    .map(([name, value]) => ({
      name,
      url: normalizeHealthUrl(value),
    }));
}

async function main() {
  const targets = buildTargets();
  if (targets.length === 0) {
    console.error(
      'Missing MCP endpoint configuration. Set MCP_HUB_URL for the DGX hub, or MCP_GATEWAY_URL / DWS_MCP_AGENT_URL for remote MCP endpoints.',
    );
    process.exit(1);
  }

  let hasFailure = false;

  for (const target of targets) {
    console.log(`Testing ${target.name}: ${target.url}`);

    try {
      const response = await fetch(target.url, {
        method: 'GET',
        headers: { Accept: 'application/json, text/plain, */*' },
      });
      const body = await response.text();

      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(body.slice(0, 500));

      if (!response.ok) {
        hasFailure = true;
      }
    } catch (error) {
      hasFailure = true;
      console.error(
        `${target.name} connectivity test failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  if (hasFailure) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('MCP connectivity test failed:', error);
  process.exit(1);
});
