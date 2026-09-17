/**
 * Counterfactual Fairness Artifact — Signed, Reproducible Art. 10 Evidence
 *
 * Code-Version: 1.0
 * Branch: claude/mutatis-fairness-pilot-3jmbb5
 * Date: 2026-06-23
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Turns a FairnessResult into a deterministic artifact (JSON + Markdown) that
 * carries its own integrity hash. The content hash excludes wall-clock fields,
 * so re-running the pilot on the same dataset + config produces an IDENTICAL
 * sealed result (the reproducibility acceptance check). The Markdown form is
 * what flows into the Firehorse signed-report path; the JSON + hash are the
 * machine-verifiable evidence.
 */

import { createHash } from 'node:crypto';
import type { FairnessResult } from './counterfactual-fairness.js';

// ============ METHODOLOGY CITATION ============

/**
 * Paper-backed methodology provenance (Rule 9 — not a hand-rolled metric).
 * Reimplemented from the paper; no source files vendored, so Apache-2.0 NOTICE
 * retention is carried here as attribution rather than as a copied NOTICE file.
 */
export const METHODOLOGY = Object.freeze({
  name: 'Counterfactual situation testing (mutatis-mutandis comparator)',
  paper: 'Mutatis Mutandis: Revisiting the Comparator in Discrimination Testing',
  venue: 'Computational Intelligence (forthcoming)',
  referenceImplementation: 'https://github.com/SantanderAI/mutatis-mutandis',
  originalResearchRepo: 'https://github.com/cc-jalvarez/revisiting-the-comparator',
  license: 'Apache-2.0',
  adoption: 'reimplemented-from-paper (no code vendored)',
  comparatorUsedInPilot: 'ceteris-paribus-flip',
  comparatorFutureWork:
    'causal-model comparator (true mutatis mutandis) — out of scope for this pilot',
});

export const EU_AI_ACT_BASIS = Object.freeze({
  regulation: 'Regulation (EU) 2024/1689',
  articles: ['Article 10 (data governance / bias)', 'Annex III (credit scoring — high-risk)'],
});

// ============ ARTIFACT TYPES ============

export interface FairnessArtifactMeta {
  /** Identifier of the financed-decision path under test. */
  decisionPath: string;
  /** SHA-256 fingerprint of the evaluated dataset (reproducibility anchor). */
  datasetHash: string;
  /** Human label for the run (e.g. "Lending fairness pilot — held-out set"). */
  title: string;
}

export interface FairnessArtifact {
  artifactType: 'counterfactual-fairness';
  schemaVersion: '1.0';
  title: string;
  decisionPath: string;
  datasetHash: string;
  methodology: typeof METHODOLOGY;
  euAiActBasis: typeof EU_AI_ACT_BASIS;
  result: FairnessResult;
  verdict: 'PASS' | 'FAIL';
  /** SHA-256 over the canonical, timestamp-free artifact body. */
  contentHash: string;
  /** Wall-clock emission time. EXCLUDED from contentHash for reproducibility. */
  emittedAt: string;
}

// ============ BUILD ============

/** Stable JSON: object keys sorted recursively so the hash is order-independent. */
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = canonicalize((value as Record<string, unknown>)[k]);
        return acc;
      }, {});
  }
  return value;
}

/** Compute the reproducible content hash over the timestamp-free artifact body. */
export function artifactContentHash(body: {
  title: string;
  decisionPath: string;
  datasetHash: string;
  methodology: typeof METHODOLOGY;
  euAiActBasis: typeof EU_AI_ACT_BASIS;
  result: FairnessResult;
  verdict: 'PASS' | 'FAIL';
}): string {
  return createHash('sha256')
    .update(JSON.stringify(canonicalize(body)))
    .digest('hex');
}

/** Build the signed-ready artifact from a measured result. */
export function buildFairnessArtifact(
  result: FairnessResult,
  meta: FairnessArtifactMeta,
  emittedAt: string = new Date().toISOString(),
): FairnessArtifact {
  const verdict: 'PASS' | 'FAIL' = result.passed ? 'PASS' : 'FAIL';
  const body = {
    title: meta.title,
    decisionPath: meta.decisionPath,
    datasetHash: meta.datasetHash,
    methodology: METHODOLOGY,
    euAiActBasis: EU_AI_ACT_BASIS,
    result,
    verdict,
  };
  return {
    artifactType: 'counterfactual-fairness',
    schemaVersion: '1.0',
    ...body,
    contentHash: artifactContentHash(body),
    emittedAt,
  };
}

// ============ RENDER ============

/** Render the artifact as Markdown for the Firehorse signed-report path. */
export function artifactToMarkdown(artifact: FairnessArtifact): string {
  const r = artifact.result;
  const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
  const lines: string[] = [
    `# ${artifact.title}`,
    '',
    `**Artifact type:** counterfactual-fairness (schema v${artifact.schemaVersion})`,
    `**Verdict:** ${artifact.verdict}`,
    `**Decision path:** \`${artifact.decisionPath}\``,
    `**Dataset fingerprint (SHA-256):** \`${artifact.datasetHash}\``,
    `**Content hash (SHA-256):** \`${artifact.contentHash}\``,
    `**Emitted:** ${artifact.emittedAt}`,
    '',
    '## Regulatory basis',
    `- ${artifact.euAiActBasis.regulation}`,
    ...artifact.euAiActBasis.articles.map((a) => `- ${a}`),
    '',
    '## Methodology',
    `- **Method:** ${artifact.methodology.name}`,
    `- **Paper:** ${artifact.methodology.paper} — ${artifact.methodology.venue}`,
    `- **Reference implementation:** ${artifact.methodology.referenceImplementation} (${artifact.methodology.license})`,
    `- **Adoption:** ${artifact.methodology.adoption}`,
    `- **Comparator (pilot):** ${artifact.methodology.comparatorUsedInPilot}`,
    `- **Comparator (future work):** ${artifact.methodology.comparatorFutureWork}`,
    '',
    '## Measured deltas',
    `- **Protected attribute:** ${r.protectedAttribute} (protected group: ${r.protectedGroupValue})`,
    `- **Records evaluated (n):** ${r.n}`,
    `- **Protected approval rate:** ${pct(r.protectedApprovalRate)}`,
    `- **Comparator approval rate:** ${pct(r.comparatorApprovalRate)}`,
    `- **Approval-rate gap:** ${pct(r.approvalRateGap)} (negative ⇒ adverse treatment of protected group)`,
    `- **Mean score delta (factual − comparator):** ${r.meanScoreDelta}`,
    `- **Decision flip rate:** ${pct(r.flipRate)}`,
    `- **Thresholds:** approval-gap ≤ ${pct(r.thresholds.approvalGapThreshold)}, flip-rate ≤ ${pct(r.thresholds.flipRateThreshold)}`,
    '',
    `## Per-record evidence (first 10 of ${r.pairs.length})`,
    '',
    '| Applicant | Factual | Comparator | Factual score | Comparator score | Score Δ | Decision flipped |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...r.pairs
      .slice(0, 10)
      .map(
        (p) =>
          `| ${p.applicantId} | ${p.factualGender} | ${p.comparatorGender} | ${p.factualScore} | ${p.comparatorScore} | ${p.scoreDelta} | ${p.decisionFlipped ? 'yes' : 'no'} |`,
      ),
    '',
    '> Full per-record evidence is in the JSON artifact alongside this document.',
    '',
  ];
  return lines.join('\n');
}
