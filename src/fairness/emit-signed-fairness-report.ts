/**
 * Emit Signed Counterfactual-Fairness Report
 *
 * Code-Version: 1.0
 * Branch: claude/mutatis-fairness-pilot-3jmbb5
 * Date: 2026-06-23
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Wires the fairness artifact into the existing DWS evidence rails:
 *   1. Build the deterministic artifact (JSON + Markdown + content hash).
 *   2. Write an Article-12 audit entry — locally as append-only JSONL (always,
 *      so the evidence is reproducible offline) and to Supabase via
 *      Article12Logger when SUPABASE_* env is present.
 *   3. Send the Markdown artifact for eSignature through the Firehorse
 *      SignedReportService (DocuSign) when DocuSign env + signers are present.
 *
 * Fail loud (Rule 12): a measurement error throws; a configured-but-failing
 * external rail throws — it never silently degrades to "completed".
 * The reproducible deliverable (artifact + contentHash + local Article-12
 * entry) is produced with zero external dependencies.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

import {
  type FairnessConfig,
  type FairnessResult,
  measureCounterfactualFairness,
} from './counterfactual-fairness.js';
import {
  artifactToMarkdown,
  buildFairnessArtifact,
  type FairnessArtifact,
} from './fairness-artifact.js';
import { hashDataset, type LendingApplicant } from '../synthetic-data/lending-applicants.js';
import { Article12Logger } from '../agents/article12-logger.js';
import { type ReportSigner, SignedReportService } from '../firehorse/signed-reports.js';

const AGENT_ID = 'financed-decision-fairness';
const REGULATION_IDS = ['EU-AI-ACT-ART-10', 'EU-AI-ACT-ANNEX-III'];
const DECISION_PATH = 'src/fairness/financed-decision.ts#decideLoan';

// ============ TYPES ============

export interface EmitOptions {
  applicants: ReadonlyArray<LendingApplicant>;
  fairnessConfig?: FairnessConfig;
  /** Directory for the artifact + audit evidence. */
  outputDir: string;
  /** Run label used in the artifact title. */
  title?: string;
  /** Signers for DocuSign eSignature. When omitted, the eSignature step is skipped. */
  signers?: ReportSigner[];
  /** Fixed emission timestamp (tests pass this to keep output stable). */
  emittedAt?: string;
}

/** Local Article-12 evidence row — mirrors the Supabase article12_audit_log shape. */
export interface Article12LocalEntry {
  trace_id: string;
  agent_id: string;
  input_hash: string;
  model: string;
  regulation_ids: string[];
  pii_scrubbed: boolean;
  pii_types_found: string[];
  pii_replacement_count: number;
  risk_classification: 'high' | 'limited' | 'minimal';
  decision_summary: string;
  artifact_content_hash: string;
  created_at: string;
}

export interface EmitResult {
  artifact: FairnessArtifact;
  contentHash: string;
  artifactJsonPath: string;
  artifactMarkdownPath: string;
  article12Entry: Article12LocalEntry;
  article12LogPath: string;
  /** Set when the DocuSign eSignature step ran. */
  envelopeId?: string;
  /** Set when the Supabase Article-12 logger ran. */
  supabaseTraceId?: string;
}

// ============ HELPERS ============

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

function buildDecisionSummary(result: FairnessResult): string {
  const verdict = result.passed ? 'PASS' : 'FAIL';
  return (
    `Counterfactual fairness ${verdict}: protected='${result.protectedGroupValue}', n=${result.n}, ` +
    `approvalRateGap=${result.approvalRateGap}, flipRate=${result.flipRate}, meanScoreDelta=${result.meanScoreDelta}.`
  ).slice(0, 500);
}

// ============ EMIT ============

/**
 * Resolve and validate the output directory. Rejects empty input, null bytes,
 * and any path containing a parent-traversal ('..') segment so a caller cannot
 * escape the intended evidence location and overwrite arbitrary files (CWE-22).
 */
function safeOutputDir(outputDir: string): string {
  if (typeof outputDir !== 'string' || outputDir.trim().length === 0) {
    throw new Error('emitSignedFairnessReport: outputDir is required');
  }
  if (outputDir.includes('\0')) {
    throw new Error('emitSignedFairnessReport: outputDir must not contain null bytes');
  }
  if (outputDir.split(/[\\/]/).includes('..')) {
    throw new Error('emitSignedFairnessReport: outputDir must not contain ".." path segments');
  }
  return path.resolve(outputDir);
}

export async function emitSignedFairnessReport(options: EmitOptions): Promise<EmitResult> {
  const { applicants, fairnessConfig = {}, signers } = options;
  const outputDir = safeOutputDir(options.outputDir);
  const emittedAt = options.emittedAt ?? new Date().toISOString();
  const title = options.title ?? 'Counterfactual Fairness Pilot — Lending Decision (held-out set)';

  // 1. Measure (throws loud on empty/invalid dataset).
  const result = measureCounterfactualFairness(applicants, fairnessConfig);
  const datasetHash = hashDataset(applicants);

  // 2. Build the deterministic artifact.
  const artifact = buildFairnessArtifact(
    result,
    { decisionPath: DECISION_PATH, datasetHash, title },
    emittedAt,
  );
  const markdown = artifactToMarkdown(artifact);

  // 3. Persist artifact (JSON + Markdown).
  fs.mkdirSync(outputDir, { recursive: true });
  const artifactJsonPath = path.join(outputDir, 'fairness-artifact.json');
  const artifactMarkdownPath = path.join(outputDir, 'fairness-artifact.md');
  fs.writeFileSync(artifactJsonPath, JSON.stringify(artifact, null, 2));
  fs.writeFileSync(artifactMarkdownPath, markdown);

  // 4. Article-12 evidence. input_hash binds dataset + config (reproducible).
  const inputHash = sha256(JSON.stringify({ datasetHash, fairnessConfig }));
  const article12Entry: Article12LocalEntry = {
    trace_id: sha256(`${inputHash}:${artifact.contentHash}`).slice(0, 32),
    agent_id: AGENT_ID,
    input_hash: inputHash,
    model: 'deterministic/no-llm',
    regulation_ids: REGULATION_IDS,
    pii_scrubbed: true,
    pii_types_found: [], // synthetic dataset — no PII present
    pii_replacement_count: 0,
    risk_classification: 'high',
    decision_summary: buildDecisionSummary(result),
    artifact_content_hash: artifact.contentHash,
    created_at: emittedAt,
  };
  const article12LogPath = path.join(outputDir, 'article12-audit.jsonl');
  fs.appendFileSync(article12LogPath, `${JSON.stringify(article12Entry)}\n`);

  const out: EmitResult = {
    artifact,
    contentHash: artifact.contentHash,
    artifactJsonPath,
    artifactMarkdownPath,
    article12Entry,
    article12LogPath,
  };

  // 5. Optional: push Article-12 entry to Supabase (when configured).
  //    Trim env values so a whitespace-only key is treated as absent.
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (supabaseUrl && supabaseKey) {
    const logger = new Article12Logger();
    const { traceId } = await logger.logPreFlight({
      agentId: AGENT_ID,
      inputHash,
      model: 'deterministic/no-llm',
      regulationIds: REGULATION_IDS,
      scrubManifest: { typesFound: [], replacementCount: 0, originalHash: datasetHash },
      riskClassification: 'high',
    });
    await logger.logPostFlight({ traceId, decisionSummary: article12Entry.decision_summary });
    out.supabaseTraceId = traceId;
  }

  // 6. Optional: send the Markdown artifact for eSignature via Firehorse.
  if (signers && signers.length > 0) {
    const envelope = await SignedReportService.sendForSignature({
      reportPath: artifactMarkdownPath,
      reportName: title,
      reportType: 'compliance',
      signers,
      reference: `fairness:${artifact.contentHash.slice(0, 12)}`,
    });
    out.envelopeId = envelope.envelopeId;
  }

  return out;
}
