#!/usr/bin/env node
// Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- scripts/evidence-stamp.mjs
// Update engine: stamps code + doc artifacts with the CLAUDE.md Code Evidence Layer
// header (EU AI Act Art. 12-14 provenance). Thesis files are refused unless
// --force-thesis (structural RED zone per Thesis Autonomy Boundary).
import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { resolve } from "node:path";

const args = process.argv.slice(2);
const getOpt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const TOOL = getOpt('--tool') ?? 'OpenCode';
const MODEL = getOpt('--model') ?? 'opencode/x-preview-f-free';
const AGENT = getOpt('--agent') ?? 'ox-alpha';
const DATE = new Date().toISOString().slice(0, 10);
const FORCE_THESIS = args.includes('--force-thesis');
const OPTS_WITH_VALUES = new Set(['--tool', '--model', '--agent']);
const targets = args.filter((a, i) => !a.startsWith('--') && !OPTS_WITH_VALUES.has(args[i - 1]));

if (targets.length === 0) {
  console.error('usage: evidence-stamp.mjs [--tool T] [--model M] [--agent A] [--force-thesis] <file-or-dir>…');
  process.exit(2);
}

const CODE_EXT = /\.(ts|tsx|js|mjs|cjs|py|sh|bash|ps1)$/;
const DOC_EXT = /\.(md|mdx)$/;
const HTML_EXT = /\.html?$/;
const THESIS = /V3Thesis_(EN|FI)\.md|PHD_FIREHORSE_(EN|FI)\.md$/;

let stamped = 0;
let skipped = 0;

const evidenceLine = (comment) =>
  `${comment} Evidence: Tool=${TOOL} (${process.env.EVIDENCE_TOOL_VERSION ?? 'version-unrecorded'}) Model=${MODEL} Agent=${AGENT} Date=${DATE}`;

function stampFile(rel) {
  const abs = resolve(rel);
  if (THESIS.test(rel) && !FORCE_THESIS) {
    console.log(`  REFUSED (thesis RED zone, use --force-thesis): ${rel}`);
    skipped++;
    return;
  }
  let src;
  try {
    src = readFileSync(abs, 'utf8');
  } catch {
    return;
  }
  const re = /\/\/ Evidence: .*|^<!-- Evidence: .*-->$/m;
  const line =
    CODE_EXT.test(rel) || rel.endsWith('.py') || rel.endsWith('.sh')
      ? evidenceLine('//')
      : DOC_EXT.test(rel)
        ? evidenceLine('<!--').replace(/^<!--/, '<!--') + ' -->'
        : HTML_EXT.test(rel)
          ? evidenceLine('<!--') + ' -->'
          : null;
  if (!line) {
    skipped++;
    return;
  }
  let out;
  if (re.test(src)) {
    out = src.replace(re, line.replace(/ -->$/, ' -->'));
  } else if (CODE_EXT.test(rel)) {
    const lines = src.split('\n');
    const shebang = lines[0]?.startsWith('#!') ? 1 : 0;
    lines.splice(shebang, 0, line);
    out = lines.join('\n');
  } else if (DOC_EXT.test(rel)) {
    out = line + '\n\n' + src;
  } else {
    out = src.includes('<head>')
      ? src.replace('<head>', `<head>\n  ${line}`)
      : line + '\n' + src;
  }
  if (out !== src) {
    writeFileSync(abs, out);
    stamped++;
    console.log(`  stamped ${rel}`);
  }
}

for (const t of targets) {
  const abs = resolve(t);
  if (statSync(abs).isDirectory()) {
    for (const f of readdirSync(abs, { recursive: true })) stampFile(`${t}/${f}`);
  } else {
    stampFile(t);
  }
}
console.log(`stamped=${stamped} skipped/refused=${skipped}`);
