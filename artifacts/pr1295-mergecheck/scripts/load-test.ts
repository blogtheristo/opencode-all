#!/usr/bin/env npx tsx
/**
 * DWS IQ 6 - Production Load Test
 *
 * Lightweight load test using Node.js native fetch (no external dependencies).
 * Tests critical API endpoints under concurrent load.
 *
 * Usage:
 *   npx tsx scripts/load-test.ts                    # Default: 50 concurrent, localhost:8080
 *   npx tsx scripts/load-test.ts --url https://api.dws6.com --concurrency 100
 *   npx tsx scripts/load-test.ts --duration 60      # Run for 60 seconds
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (final MVP items)
 * Date: 2026-03-22
 */

// ============ CONFIG ============

const args = process.argv.slice(2);
function getArg(name: string, defaultValue: string): string {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

const BASE_URL = getArg('url', 'http://localhost:8080');
const CONCURRENCY = parseInt(getArg('concurrency', '50'), 10);
const DURATION_S = parseInt(getArg('duration', '30'), 10);

// ============ TYPES ============

interface EndpointConfig {
  name: string;
  method: 'GET' | 'POST';
  path: string;
  body?: Record<string, unknown>;
  weight: number; // Relative frequency (higher = more requests)
}

interface RequestResult {
  endpoint: string;
  status: number;
  latencyMs: number;
  error?: string;
}

interface EndpointStats {
  count: number;
  errors: number;
  latencies: number[];
}

// ============ ENDPOINTS ============

const ENDPOINTS: EndpointConfig[] = [
  {
    name: 'Health',
    method: 'GET',
    path: '/health',
    weight: 3,
  },
  {
    name: 'ESRS Registry',
    method: 'GET',
    path: '/api/v1/compliance/registry',
    weight: 2,
  },
  {
    name: 'Sector Benchmark',
    method: 'GET',
    path: '/api/v1/compliance/benchmarks/steel',
    weight: 2,
  },
  {
    name: 'Compliance Assess',
    method: 'POST',
    path: '/api/v1/compliance/assess',
    body: {
      companyName: 'Load Test Corp',
      industry: 'steel',
      country: 'FI',
      annualEmissions: 50000,
      importValue: 100000,
      hasTransitionPlan: true,
      hasEmissionsMonitoring: true,
      hasSupplyChainDD: false,
      dataPoints: [
        { disclosureId: 'E1-1', provided: true },
        { disclosureId: 'E1-6', provided: true },
      ],
    },
    weight: 3,
  },
  {
    name: 'Cost Estimate',
    method: 'POST',
    path: '/api/v1/compliance/cost-estimate',
    body: {
      annualEmissions: 75000,
      importQuantity: 5000,
      sector: 'steel',
      originCountry: 'CN',
    },
    weight: 2,
  },
  {
    name: 'Agent Discovery',
    method: 'GET',
    path: '/api/agents',
    weight: 1,
  },
];

// ============ WEIGHTED RANDOM SELECTION ============

function selectEndpoint(): EndpointConfig {
  const totalWeight = ENDPOINTS.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;
  for (const endpoint of ENDPOINTS) {
    random -= endpoint.weight;
    if (random <= 0) return endpoint;
  }
  return ENDPOINTS[0];
}

// ============ REQUEST EXECUTION ============

async function executeRequest(endpoint: EndpointConfig): Promise<RequestResult> {
  const url = `${BASE_URL}${endpoint.path}`;
  const start = performance.now();

  try {
    const options: RequestInit = {
      method: endpoint.method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }

    const res = await fetch(url, options);
    const latencyMs = Math.round(performance.now() - start);

    // Consume body to free connection
    await res.text();

    return {
      endpoint: endpoint.name,
      status: res.status,
      latencyMs,
      error: res.status >= 500 ? `HTTP ${res.status}` : undefined,
    };
  } catch (err) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      endpoint: endpoint.name,
      status: 0,
      latencyMs,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ============ WORKER ============

async function worker(results: RequestResult[], stopAt: number): Promise<void> {
  while (Date.now() < stopAt) {
    const endpoint = selectEndpoint();
    const result = await executeRequest(endpoint);
    results.push(result);
  }
}

// ============ STATS ============

function percentile(sorted: number[], p: number): number {
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function printStats(results: RequestResult[], durationMs: number): void {
  const byEndpoint = new Map<string, EndpointStats>();

  for (const r of results) {
    const stats = byEndpoint.get(r.endpoint) || { count: 0, errors: 0, latencies: [] };
    stats.count++;
    if (r.error || r.status >= 500) stats.errors++;
    stats.latencies.push(r.latencyMs);
    byEndpoint.set(r.endpoint, stats);
  }

  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║                   DWS IQ 6 Load Test Results                    ║');
  console.log('╠══════════════════════════════════════════════════════════════════╣');
  console.log(`║ Target:      ${BASE_URL.padEnd(49)}║`);
  console.log(`║ Concurrency: ${String(CONCURRENCY).padEnd(49)}║`);
  console.log(`║ Duration:    ${(durationMs / 1000).toFixed(1).padEnd(46)}sec ║`);
  console.log(`║ Total Reqs:  ${String(results.length).padEnd(49)}║`);
  console.log(`║ RPS:         ${(results.length / (durationMs / 1000)).toFixed(1).padEnd(49)}║`);
  console.log('╠══════════════════════════════════════════════════════════════════╣');
  console.log('║ Endpoint           │ Reqs │ Errs │ p50ms │ p95ms │ p99ms │ Max  ║');
  console.log('╟────────────────────┼──────┼──────┼───────┼───────┼───────┼──────╢');

  let totalErrors = 0;

  for (const [name, stats] of byEndpoint) {
    stats.latencies.sort((a, b) => a - b);
    totalErrors += stats.errors;

    const p50 = percentile(stats.latencies, 50);
    const p95 = percentile(stats.latencies, 95);
    const p99 = percentile(stats.latencies, 99);
    const max = stats.latencies[stats.latencies.length - 1];

    console.log(
      `║ ${name.padEnd(19)}│ ${String(stats.count).padStart(4)} │ ${String(stats.errors).padStart(4)} │ ${String(p50).padStart(5)} │ ${String(p95).padStart(5)} │ ${String(p99).padStart(5)} │ ${String(max).padStart(4)} ║`
    );
  }

  console.log('╠══════════════════════════════════════════════════════════════════╣');

  const allLatencies = results.map((r) => r.latencyMs).sort((a, b) => a - b);
  const errorRate = ((totalErrors / results.length) * 100).toFixed(2);

  console.log(`║ Overall p50: ${String(percentile(allLatencies, 50)).padEnd(5)}ms  p95: ${String(percentile(allLatencies, 95)).padEnd(5)}ms  p99: ${String(percentile(allLatencies, 99)).padEnd(5)}ms    ║`);
  console.log(`║ Error rate:  ${errorRate.padEnd(5)}%${' '.repeat(44)}║`);

  // Pass/fail based on SLO
  const p95 = percentile(allLatencies, 95);
  const pass = p95 < 2000 && parseFloat(errorRate) < 5;
  console.log('╠══════════════════════════════════════════════════════════════════╣');
  console.log(`║ SLO Check: p95 < 2000ms ${p95 < 2000 ? 'PASS' : 'FAIL'}  |  Errors < 5% ${parseFloat(errorRate) < 5 ? 'PASS' : 'FAIL'}  |  ${pass ? '✅ PASS' : '❌ FAIL'}      ║`);
  console.log('╚══════════════════════════════════════════════════════════════════╝');

  if (!pass) process.exit(1);
}

// ============ MAIN ============

async function main(): Promise<void> {
  console.log(`\nDWS IQ 6 Load Test — ${CONCURRENCY} concurrent workers, ${DURATION_S}s duration`);
  console.log(`Target: ${BASE_URL}\n`);

  // Warm up
  console.log('Warming up...');
  try {
    await fetch(`${BASE_URL}/health`);
    console.log('Server is reachable.\n');
  } catch {
    console.error(`ERROR: Cannot reach ${BASE_URL}/health — is the server running?`);
    process.exit(1);
  }

  const results: RequestResult[] = [];
  const stopAt = Date.now() + DURATION_S * 1000;
  const startTime = Date.now();

  // Progress reporter
  const progress = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const errors = results.filter((r) => r.error).length;
    process.stdout.write(`\r  ${elapsed}s elapsed | ${results.length} requests | ${errors} errors`);
  }, 1000);

  // Launch workers
  const workers = Array.from({ length: CONCURRENCY }, () => worker(results, stopAt));
  await Promise.all(workers);

  clearInterval(progress);
  console.log(''); // New line after progress

  const durationMs = Date.now() - startTime;
  printStats(results, durationMs);
}

main().catch((err) => {
  console.error('Load test failed:', err);
  process.exit(1);
});
