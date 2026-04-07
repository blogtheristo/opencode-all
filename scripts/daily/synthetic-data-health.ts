/**
 * Daily Synthetic Data Pipeline Health Check
 *
 * Auto-discovered by DGX Spark day-runner.sh (scripts/daily/*.ts convention).
 * Validates that all 50 seed CBAM filings still pass the CBAM calculator.
 * Alerts if emission factors drift or calculator interface changes break seeds.
 *
 * Code-Version: 1.0
 * Date: 2026-04-06
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 */

import { runDeterministicPipeline, healthCheck } from '../../src/synthetic-data/index.js';

async function main() {
  console.log('[synthetic-data-health] Starting daily pipeline validation...');

  // Quick health check first
  const quick = healthCheck();
  if (!quick.ok) {
    console.error(`[synthetic-data-health] CRITICAL: Pipeline broken — ${quick.message}`);
    process.exit(1);
  }

  // Full deterministic pipeline run
  const result = runDeterministicPipeline();
  const passRate = result.seedValidation.passed / result.seedValidation.totalRecords;

  console.log(
    `[synthetic-data-health] Seed validation: ${result.seedValidation.passed}/${result.seedValidation.totalRecords} passed (${Math.round(passRate * 100)}%)`,
  );
  console.log(`[synthetic-data-health] Average score: ${result.seedValidation.averageScore}`);
  console.log(`[synthetic-data-health] Duration: ${result.seedValidation.durationMs}ms`);
  console.log(
    `[synthetic-data-health] Simulation matrix: ${result.simulationMatrix.totalCombinations} combinations`,
  );

  // Emission averages per sector
  for (const [sector, data] of Object.entries(result.emissionAverages)) {
    console.log(
      `[synthetic-data-health] ${sector}: avg=${data.avg} min=${data.min} max=${data.max} (${data.count} seeds)`,
    );
  }

  if (result.seedValidation.failed > 0) {
    console.warn(
      `[synthetic-data-health] WARNING: ${result.seedValidation.failed} seed filings failed validation`,
    );
    for (const failed of result.seedValidation.failedRecords) {
      console.warn(`  - ${failed.recordId}: ${failed.score.reasoning}`);
    }
  }

  if (passRate < 0.9) {
    console.error(
      `[synthetic-data-health] CRITICAL: Pass rate ${Math.round(passRate * 100)}% below 90% threshold`,
    );
    process.exit(1);
  }

  console.log(
    '[synthetic-data-health] Pipeline healthy. All seed filings validated against CBAM calculator.',
  );

  // Output JSON summary for day-runner log parsing
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      check: 'synthetic-data-pipeline',
      status: 'healthy',
      seedsPassed: result.seedValidation.passed,
      seedsTotal: result.seedValidation.totalRecords,
      passRate: Math.round(passRate * 100),
      durationMs: result.seedValidation.durationMs,
    }),
  );
}

main().catch((err) => {
  console.error(`[synthetic-data-health] FATAL: ${err.message}`);
  process.exit(1);
});
