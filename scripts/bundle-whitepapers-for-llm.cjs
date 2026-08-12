#!/usr/bin/env node
/*
  bundle-whitepapers-for-llm
  ---------------------------
  Concatenates the DWS6 whitepaper inventory (as listed in
  prompts/gemini-sovereignty-showcase.md "Canonical sources") into a single
  Markdown bundle suitable for upload to LLMs with large context windows
  (Gemini 2.0 Pro: 2M tokens; Claude Opus 4.7: 200k+).

  Output: out/whitepaper-bundle-YYYY-MM-DD.md

  Behaviour:
    - Manifest lives at the top of this file (single source of truth here so
      operators don't need a second YAML file in the repo).
    - Each file is appended after an H1 separator: # === <filename> ===
    - Missing files are skipped with a stderr warning (the script keeps going).
    - Warns to stderr if the bundle exceeds 1_000_000 characters.

  Usage:
    node scripts/bundle-whitepapers-for-llm.cjs
    node scripts/bundle-whitepapers-for-llm.cjs --out path/to/bundle.md
*/

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const MANIFEST = [
  // PhD thesis (Firehorse / LUT) — scientific framing
  'docs/PHD_FIREHORSE_EN.md',

  // Master's thesis (Metropolia) — product / implementation focus
  'docs/metropolia/master-thesis/en/V3Thesis_EN.md',
  'docs/metropolia/master-thesis/RESEARCH_QUESTIONS_EVIDENCE.md',
  'docs/metropolia/master-thesis/SOLUTION_FACTORY_CANVAS.md',
  'docs/metropolia/master-thesis/SWOT_ANALYSIS.md',

  // Field notes — sovereignty arc
  'docs/field-notes/2026-01-28-eu-tech-stack-sovereignty-positioning.md',
  'docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md',
  'docs/field-notes/2026-03-17-shufti-kya-whitepaper.md',
  'docs/field-notes/2026-04-23-sovereign-cloud-providers-aegis-partner-research.md',
  'docs/field-notes/2026-04-23-eu-ai-act-compliance-layer-research.md',
  'docs/field-notes/2026-04-25-cohere-aleph-alpha-sovereign-ai-merger.md',
  'docs/field-notes/2026-05-25-tier1-sovereignty-pilot-outokumpu-dgx-t5000.md',

  // Briefs and partnership proposals
  'docs/briefs/construction-compliance-brief.md',
  'docs/2026-02-26-xai-grok-partnership-proposal.md',
  'docs/sales/xAI-Optimus-Partnership-Proposal-v2.0.md',
  'docs/sales/2026-05-28-rightful-oy-partnership-proposal.md',
  'partners-outreach/Shufti/SHUFTI_PARTNERSHIP_APPROVAL_2026-05-28.md',

  // DWS standards (canonical reference layer)
  'DWS_DEPLOYMENT_STANDARD.md',
  'DWS_SOVEREIGNTY_STANDARD.md',
  'DWS_STANDARDS_LIBRARY.md',
  'DWS_TRUTH_STANDARD.md',
];

const WARN_CHARS = 1_000_000;

function parseArgs(argv) {
  const args = { out: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--out' || argv[i] === '-o') {
      args.out = argv[++i];
    } else if (argv[i] === '--help' || argv[i] === '-h') {
      args.help = true;
    }
  }
  return args;
}

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    process.stderr.write(
      'Usage: node scripts/bundle-whitepapers-for-llm.cjs [--out path]\n' +
        'Default output: out/whitepaper-bundle-YYYY-MM-DD.md\n',
    );
    return;
  }

  const repoRoot = path.resolve(__dirname, '..');
  const outPath =
    args.out || path.join(repoRoot, 'out', `whitepaper-bundle-${todayIso()}.md`);

  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const parts = [];
  const included = [];
  const skipped = [];

  parts.push('# DWS6 Whitepaper Bundle');
  parts.push('');
  parts.push(`Generated: ${new Date().toISOString()}`);
  parts.push(`Manifest source: scripts/bundle-whitepapers-for-llm.cjs`);
  parts.push(`Manifest entries: ${MANIFEST.length}`);
  parts.push('');
  parts.push(
    'Use this single Markdown file as a context bundle for LLMs with large context windows ' +
      '(Gemini 2.0 Pro: 2M tokens; Claude Opus 4.7: 200k+). ' +
      'Each source file is separated by an H1 `# === <filename> ===` heading.',
  );
  parts.push('');
  parts.push('---');
  parts.push('');

  for (const rel of MANIFEST) {
    const abs = path.join(repoRoot, rel);
    if (!fs.existsSync(abs)) {
      process.stderr.write(`WARN: missing manifest file, skipping: ${rel}\n`);
      skipped.push(rel);
      continue;
    }
    let content;
    try {
      content = fs.readFileSync(abs, 'utf8');
    } catch (e) {
      process.stderr.write(`WARN: cannot read ${rel}: ${e.message}\n`);
      skipped.push(rel);
      continue;
    }
    parts.push(`# === ${rel} ===`);
    parts.push('');
    parts.push(content.replace(/\r\n/g, '\n').trimEnd());
    parts.push('');
    parts.push('---');
    parts.push('');
    included.push(rel);
  }

  parts.push('# === bundle manifest ===');
  parts.push('');
  parts.push(`Included (${included.length}):`);
  for (const f of included) parts.push(`- ${f}`);
  if (skipped.length) {
    parts.push('');
    parts.push(`Skipped (${skipped.length}):`);
    for (const f of skipped) parts.push(`- ${f}`);
  }
  parts.push('');

  const bundle = parts.join('\n');
  fs.writeFileSync(outPath, bundle, 'utf8');

  const chars = bundle.length;
  const lines = bundle.split('\n').length;
  process.stderr.write(
    `Bundle written: ${outPath}\n` +
      `  Files included: ${included.length}\n` +
      `  Files skipped:  ${skipped.length}\n` +
      `  Characters:     ${chars.toLocaleString('en-US')}\n` +
      `  Lines:          ${lines.toLocaleString('en-US')}\n`,
  );

  if (chars > WARN_CHARS) {
    process.stderr.write(
      `WARN: bundle exceeds ${WARN_CHARS.toLocaleString('en-US')} characters. ` +
        `Some context windows (e.g. Claude Opus 4.7 200k tokens ~= 800k chars) may truncate.\n`,
    );
  }

  process.stdout.write(outPath + '\n');
}

if (require.main === module) {
  main();
}

module.exports = { MANIFEST };
