#!/usr/bin/env node
/**
 * Evidence: Tool=Claude Code Model=claude-sonnet-5 Agent=Claude Code Date=2026-09-18
 * Audit trail: git log -- scripts/calibrate-kya-jev.mjs
 *
 * Calibration harness for kya-jev (src/agents/kya-jev.ts).
 *
 * Rule 12 (fail loud): this script computes expected calibration error (ECE)
 * against a REAL labeled dataset you provide — it never fabricates or
 * assumes ground truth. Until you run it against actual DWS data (e.g. a
 * batch of past seo-audit `kya_jev_calls` rows with a human-assigned
 * correct label), kya-jev's confidence must be treated as
 * 'self-reported-uncalibrated', per docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md.
 *
 * Input: a JSON file (--input path.json) of records:
 *   [{ "decision": "high", "confidence": 0.82, "correct": true }, ...]
 * where `correct` is a HUMAN-verified label (was `decision` the right call),
 * not another model's opinion.
 *
 * Output: per-bin accuracy vs. confidence table + overall ECE.
 *
 * Usage:
 *   node scripts/calibrate-kya-jev.mjs --input path/to/labeled-decisions.json [--bins 10]
 */

import { readFileSync } from 'node:fs';

function parseArgs(argv) {
  const args = { bins: 10 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--input') args.input = argv[++i];
    else if (argv[i] === '--bins') args.bins = parseInt(argv[++i], 10);
  }
  return args;
}

function computeECE(records, numBins) {
  const bins = Array.from({ length: numBins }, () => ({
    count: 0,
    confidenceSum: 0,
    correctSum: 0,
  }));

  for (const r of records) {
    if (typeof r.confidence !== 'number' || typeof r.correct !== 'boolean') {
      throw new Error(
        `Invalid record (needs numeric "confidence" and boolean "correct"): ${JSON.stringify(r)}`,
      );
    }
    const binIndex = Math.min(numBins - 1, Math.floor(r.confidence * numBins));
    bins[binIndex].count += 1;
    bins[binIndex].confidenceSum += r.confidence;
    bins[binIndex].correctSum += r.correct ? 1 : 0;
  }

  const n = records.length;
  let ece = 0;
  const rows = bins.map((b, i) => {
    if (b.count === 0) {
      return {
        bin: i,
        range: `${(i / numBins).toFixed(2)}-${((i + 1) / numBins).toFixed(2)}`,
        count: 0,
        avgConfidence: null,
        accuracy: null,
      };
    }
    const avgConfidence = b.confidenceSum / b.count;
    const accuracy = b.correctSum / b.count;
    ece += (b.count / n) * Math.abs(avgConfidence - accuracy);
    return {
      bin: i,
      range: `${(i / numBins).toFixed(2)}-${((i + 1) / numBins).toFixed(2)}`,
      count: b.count,
      avgConfidence: Number(avgConfidence.toFixed(4)),
      accuracy: Number(accuracy.toFixed(4)),
    };
  });

  return { ece: Number(ece.toFixed(4)), n, rows };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) {
    console.error(
      'Usage: node scripts/calibrate-kya-jev.mjs --input path/to/labeled-decisions.json [--bins 10]\n' +
        'Each record needs: { "decision": string, "confidence": number 0-1, "correct": boolean (human-verified) }',
    );
    process.exit(1);
  }

  let records;
  try {
    records = JSON.parse(readFileSync(args.input, 'utf8'));
  } catch (err) {
    console.error(`Failed to read/parse --input ${args.input}: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(records) || records.length === 0) {
    console.error('Input must be a non-empty JSON array of labeled decision records.');
    process.exit(1);
  }

  const { ece, n, rows } = computeECE(records, args.bins);

  console.log(`\nkya-jev calibration report (n=${n})\n`);
  console.table(rows.filter((r) => r.count > 0));
  console.log(`\nExpected Calibration Error (ECE): ${ece}`);
  console.log(
    ece < 0.05
      ? 'Well-calibrated by common ECE thresholds (<0.05). Still confirm on a larger/held-out set before gating any auto-execute decision.'
      : 'NOT well-calibrated (ECE >= 0.05). Do not gate auto-execute actions on this confidence yet — see field note "Never without further approval".',
  );
}

main();
