/**
 * Synthetic Data Pipeline — DWS IQ 6 Nervous System
 *
 * Code-Version: 1.0
 * Branch: claude/synthetic-data-pipeline-TK1Lp
 * Date: 2026-04-06
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Orchestrates the full synthetic data generation pipeline:
 *   1. Schema definition (cbam-schema.ts) — NeMo DataDesigner config
 *   2. Seed ground truth (seed-dataset.ts) — 55 CBAM filings (50 clean + 5 Red Team negatives)
 *   3. LLM-as-Judge validation (llm-judge.ts) — quality gate
 *   4. Compute strategy (compute-strategy.ts) — NVIDIA infrastructure
 *
 * Integration with existing DWS IQ agents:
 *   - Feeds: src/compliance/cbam-calculator.ts (calculateCBAM)
 *   - Tests: src/agents/compliance.agent.ts (ComplianceAgent)
 *   - Exposed via: src/agents/synthetic-data.agent.ts (Agent 19)
 *   - MCP tool: dws_synthetic_data (via agent-server.ts)
 */

// Re-export all pipeline components
export {
  buildCBAMStressTestSchema,
  CBAM_CN_CODES,
  SEED_INSTALLATIONS,
  getInstallationEmissionBounds,
  isEmissionWithinBounds,
  type NeMoDatasetSchema,
  type InstallationProfile,
  type ColumnConfig,
  type SamplerColumnConfig,
  type ExpressionColumnConfig,
  type LLMTextColumnConfig,
  type LookupColumnConfig,
  type ValidationConfig,
} from './cbam-schema.js';

export {
  SEED_FILINGS,
  getSeedSectorDistribution,
  getSeedRiskDistribution,
  getSeedEmissionAverages,
  validateSeedFilings,
  type SeedFiling,
} from './seed-dataset.js';

export {
  validateDeterministic,
  validateAgainstCalculator,
  syntheticRecordToDeclaration,
  buildJudgePrompt,
  runValidationBatch,
  computeSimulationMatrix,
  type JudgeScore,
  type ValidationResult,
  type ValidationBatchResult,
  type PipelineConfig,
} from './llm-judge.js';

export {
  COMPUTE_STRATEGY,
  getActiveNodes,
  getEUInferenceRoutes,
  getInfrastructureSummary,
  type ComputeStrategy,
  type ComputeNode,
  type InferenceRoute,
  type GenerationPipeline,
} from './compute-strategy.js';

// ============ PIPELINE RUNNER ============

import { buildCBAMStressTestSchema } from './cbam-schema.js';
import { getSeedEmissionAverages, SEED_FILINGS } from './seed-dataset.js';
import {
  computeSimulationMatrix,
  type PipelineConfig,
  runValidationBatch,
  validateAgainstCalculator,
  type ValidationBatchResult,
} from './llm-judge.js';
import { COMPUTE_STRATEGY, getInfrastructureSummary } from './compute-strategy.js';

/**
 * Run the full pipeline in deterministic mode (no LLM calls).
 * This validates all 55 seed filings against the real CBAM calculator
 * and produces a DD-ready summary.
 */
export function runDeterministicPipeline(): {
  schema: ReturnType<typeof buildCBAMStressTestSchema>;
  seedValidation: ValidationBatchResult;
  simulationMatrix: ReturnType<typeof computeSimulationMatrix>;
  emissionAverages: ReturnType<typeof getSeedEmissionAverages>;
  infrastructure: ReturnType<typeof getInfrastructureSummary>;
  ddSummary: Record<string, unknown>;
} {
  const schema = buildCBAMStressTestSchema();

  // Convert seed filings to flat records for validation
  const seedRecords = SEED_FILINGS.map((filing) => ({
    declaration_id: filing.id,
    declarant_eori: filing.declaration.eoriNumber,
    reporting_period: filing.declaration.reportingPeriod,
    installation_id: filing.installation.id,
    origin_country: filing.installation.country,
    production_method: filing.installation.productionRoute,
    sector: filing.declaration.imports[0].sector,
    cn_code: filing.cnCode,
    import_quantity_tonnes: filing.declaration.imports[0].quantity,
    embedded_emissions_direct: filing.expectedEmissionFactor,
    embedded_emissions_indirect: 0,
    uses_default_values: 'false',
    carbon_price_paid_origin: filing.declaration.imports[0].carbonPricePaid || 0,
    energy_source_primary: filing.installation.energySources[0],
    precursor_materials: 'seed data',
    mtc_narrative: `Ground truth seed filing ${filing.id}`,
    verifier_accreditation: 'TUV SUD (DE-V-0012)',
    verification_methodology: 'ISO 14064-3:2019 (reasonable assurance)',
    anomaly_type: 'none',
    anomaly_severity: 'none',
  }));

  const config: PipelineConfig = {
    schema,
    batchSize: 50,
    targetValidRecords: 50,
    minScore: 0.8,
    maxRetries: 1,
    generatorModel: 'seed-ground-truth',
    judgeModel: 'deterministic',
    deterministicMode: true,
  };

  const seedValidation = runValidationBatch(seedRecords, config);
  const simulationMatrix = computeSimulationMatrix();
  const emissionAverages = getSeedEmissionAverages();
  const infrastructure = getInfrastructureSummary();

  // DD summary for investor data room
  const ddSummary = {
    pipelineName: 'DWS IQ Synthetic Data Pipeline v1.0',
    status: 'Phase 1 — Seed & Deterministic',
    partner: COMPUTE_STRATEGY.partner,
    seedFilings: {
      total: SEED_FILINGS.length,
      validated: seedValidation.passed,
      passRate: `${Math.round((seedValidation.passed / SEED_FILINGS.length) * 100)}%`,
      averageScore: Math.round(seedValidation.averageScore * 100) / 100,
      sectors: Object.keys(emissionAverages),
      sectorBreakdown: emissionAverages,
    },
    simulationCapacity: {
      totalCombinations: simulationMatrix.totalCombinations,
      installations: simulationMatrix.matrix.length,
      anomalyTypes: 8,
      targetRecords: schema.target_rows,
      description: '10,000-year stress test across all origin × material × anomaly combinations',
    },
    computeInfrastructure: {
      ...infrastructure,
      inferenceRoutes: COMPUTE_STRATEGY.inferenceRoutes.length,
      generationPipelines: COMPUTE_STRATEGY.generationPipelines.length,
    },
    regulatoryBasis: schema.metadata.regulation,
    sourceCitations: schema.metadata.source_citations.length,
    integrationPoints: {
      cbamCalculator: 'src/compliance/cbam-calculator.ts',
      emissionFactors: 'src/compliance/emission-factors.ts',
      complianceAgent: 'src/agents/compliance.agent.ts',
      scoringEngine: 'src/compliance/scoring-engine.ts',
    },
    nextMilestone: 'V1 demo for NCC by June 15, 2026',
  };

  return {
    schema,
    seedValidation,
    simulationMatrix,
    emissionAverages,
    infrastructure,
    ddSummary,
  };
}

/**
 * Quick health check — validates a single seed filing against the calculator.
 * Use this to verify the pipeline integration is working.
 */
export function healthCheck(): { ok: boolean; message: string } {
  try {
    const filing = SEED_FILINGS[0];
    const result = validateAgainstCalculator({
      declaration_id: filing.id,
      sector: filing.declaration.imports[0].sector,
      import_quantity_tonnes: filing.declaration.imports[0].quantity,
      origin_country: filing.installation.country,
      embedded_emissions_direct: filing.expectedEmissionFactor,
      uses_default_values: 'false',
    });

    if (result.valid) {
      return {
        ok: true,
        message: `Pipeline healthy — seed ${filing.id} validated against CBAM calculator (${JSON.stringify(result.calculationResult)})`,
      };
    }
    return {
      ok: false,
      message: `Pipeline error — seed ${filing.id} failed: ${result.error}`,
    };
  } catch (err) {
    return {
      ok: false,
      message: `Pipeline crash: ${(err as Error).message}`,
    };
  }
}
