#!/usr/bin/env node
/**
 * lint-truth-claims.mjs — DWS Truth Standard §5 lint.
 *
 * Iterates every structured mirror (config JSON carrying phrase lists),
 * then checks text / files / changed-files for:
 *   - deprecatedDisplayPhrases            -> FAIL
 *   - ambiguousDisplayPhrasesNeedingContext (without a disambiguator) -> WARN
 *   - approvedDisplayPhrases              -> allow-list / suggestion source
 *
 * See DWS_TRUTH_STANDARD.md §5/§7/§8 and dws10.com/config/industries.json.
 *
 * Usage:
 *   node scripts/lint-truth-claims.mjs <path...>      scan files/dirs
 *   node scripts/lint-truth-claims.mjs --check "text" lint an inline claim
 *   node scripts/lint-truth-claims.mjs --changed       scan files changed vs base
 *   flags: --base <ref> (default origin/main) --json --strict --no-fail
 *
 * Exit code: 1 if any FAIL (or WARN under --strict), else 0. --no-fail forces 0.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const args = process.argv.slice(2);

const opt = {
  json: take('--json'),
  strict: take('--strict'),
  noFail: take('--no-fail'),
  changed: take('--changed'),
  base: takeVal('--base') || 'origin/main',
  check: takeVal('--check') ?? takeVal('--text'),
};
const positional = args.filter((a) => !a.startsWith('--'));

function take(flag) {
  const i = args.indexOf(flag);
  if (i >= 0) {
    args.splice(i, 1);
    return true;
  }
  return false;
}
function takeVal(flag) {
  const i = args.indexOf(flag);
  if (i >= 0) {
    const v = args[i + 1];
    args.splice(i, 2);
    return v;
  }
  return undefined;
}

// Canonical mirrors and registry docs hold the phrases as DATA — never scan them.
const EXCLUDE_RE = /(^|\/)(node_modules|\.git|backups|dist|\.next|coverage)\//;
const EXCLUDE_FILE_RE =
  /(\/config\/[^/]+\.json$|DWS_TRUTH_STANDARD\.md$|CLAUDE\.md$|INDUSTRIES\.md$|16-INDUSTRIES\.md$|STORE_PROFILE_DESCRIPTION\.md$|2026-07-05-groq-ross-dominant-game-recipe\.md$|_OLD\.|\.min\.)/;
const SCAN_EXT = new Set(['.md', '.html', '.htm', '.txt']);

// ---- 1. Load ruleset from structured mirrors -----------------------------
function loadRules() {
  const dirs = ['dws10.com/config', 'landing-pages/dws10-com/config', 'src/agents', 'config/truth'];
  const deprecated = new Map(); // phrase(lc) -> {phrase, mirror, approved[]}
  const ambiguous = new Map(); // phrase(lc) -> {phrase, disambiguators[], mirror, ...}
  for (const d of dirs) {
    const abs = path.join(ROOT, d);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (!f.endsWith('.json')) continue;
      let j;
      try {
        j = JSON.parse(fs.readFileSync(path.join(abs, f), 'utf8'));
      } catch {
        continue;
      }
      if (!j.deprecatedDisplayPhrases && !j.ambiguousDisplayPhrasesNeedingContext) continue;
      const mirror = `${d}/${f}`;
      const approved = j.approvedDisplayPhrases || [];
      for (const p of j.deprecatedDisplayPhrases || [])
        if (!deprecated.has(p.toLowerCase()))
          deprecated.set(p.toLowerCase(), { phrase: p, mirror, approved });
      for (const a of j.ambiguousDisplayPhrasesNeedingContext || []) {
        const phrase = typeof a === 'string' ? a : a.phrase;
        if (!phrase) continue;
        const validIf = (typeof a === 'object' && a.validIf) || '';
        const disambiguators = (validIf.match(/'([^']+)'/g) || [])
          .join(' ')
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(
            (w) => w.length >= 4 && !['tier', 'only', 'context', 'must', 'paired'].includes(w),
          );
        if (!ambiguous.has(phrase.toLowerCase()))
          ambiguous.set(phrase.toLowerCase(), {
            phrase,
            disambiguators,
            validIf,
            mirror,
            approved,
          });
      }
    }
  }
  return { deprecated: [...deprecated.values()], ambiguous: [...ambiguous.values()] };
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const boundary = (p) => new RegExp(`(?<![\\w-])${esc(p)}(?![\\w-])`, 'gi');

// ---- Historical-context escape -------------------------------------------
// A deprecation check that cannot tell "we renamed X to Y" from a live use of X
// makes it impossible to WRITE the history of a rename: the changelog entry that
// records a deprecation trips the very rule it documents, and so does any field
// note explaining the drift. Explicitly historical lines are therefore downgraded
// FAIL -> WARN rather than blocking. This mirrors the disambiguator design the
// ambiguous rules already use, and keeps live primary copy blocking.
const HISTORICAL_MARKERS = [
  'formerly',
  'historical',
  'deprecat', // deprecated / deprecation
  'renamed',
  'superseded',
  'replaced by',
  'no longer',
  'retired',
];
const isHistoricalLine = (lcLine, inHistoryBlock) =>
  inHistoryBlock || HISTORICAL_MARKERS.some((m) => lcLine.includes(m));

// Use vs. mention: a deprecated term wrapped in quotes is being TALKED ABOUT,
// not asserted — `From "GodAgent" to a Three-Tier Naming System` is the sentence
// that documents the rename. Quoting is the standard way to mention a term, so a
// quoted hit is a mention and does not block. An unquoted hit is a live use and
// still fails.
const QUOTE_PAIRS = [
  ['"', '"'],
  ["'", "'"],
  ['`', '`'],
  ['“', '”'], // curly double
  ['‘', '’'], // curly single
  ['«', '»'], // guillemets
];
const isQuotedMention = (line, start, end) => {
  const before = line[start - 1];
  const after = line[end];
  return QUOTE_PAIRS.some(([o, c]) => before === o && after === c);
};

// ---- 2. Lint a single block of text --------------------------------------
function lintText(text, rules, where = '<text>') {
  const findings = [];
  const lines = text.split(/\r?\n/);
  // VERSION AND AGENT HISTORY blocks are historical records by definition; the
  // block ends at the next heading.
  let inHistoryBlock = false;
  lines.forEach((line, li) => {
    const lcLine = line.toLowerCase();
    // Markdown heading or its pandoc-rendered HTML form — a rendered history
    // block (Learn/ output) is the same historical record as its source.
    if (
      /^#{0,6}\s*version and agent history\b/i.test(line.trim()) ||
      /<h[1-6][^>]*>\s*version and agent history\b/i.test(line)
    )
      inHistoryBlock = true;
    else if (inHistoryBlock && (/^#{1,6}\s+\S/.test(line) || /<h[1-6][\s>]/i.test(line)))
      inHistoryBlock = false;
    const historical = isHistoricalLine(lcLine, inHistoryBlock);
    for (const rule of rules.deprecated) {
      for (const m of line.matchAll(boundary(rule.phrase))) {
        const mention = isQuotedMention(line, m.index, m.index + m[0].length);
        const excused = historical || mention;
        findings.push({
          severity: excused ? 'WARN' : 'FAIL',
          file: where,
          line: li + 1,
          col: m.index + 1,
          phrase: m[0],
          reason: excused
            ? mention
              ? 'deprecated phrase quoted as a mention, not asserted — allowed, not blocking'
              : 'deprecated phrase in historical/changelog context — allowed, not blocking'
            : 'deprecated phrase',
          suggest: rule.approved.slice(0, 2),
        });
      }
    }
    for (const rule of rules.ambiguous) {
      const hasMatch = boundary(rule.phrase).test(line);
      if (!hasMatch) continue;
      const ok = rule.disambiguators.some((d) => lcLine.includes(d));
      if (!ok) {
        const m = [...line.matchAll(boundary(rule.phrase))][0];
        findings.push({
          severity: 'WARN',
          file: where,
          line: li + 1,
          col: (m?.index ?? 0) + 1,
          phrase: rule.phrase,
          reason: `ambiguous — needs context (${rule.validIf})`,
          suggest: rule.disambiguators,
        });
      }
    }
  });
  return findings;
}

// ---- 3. Collect target files ---------------------------------------------
function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const rel = path.relative(ROOT, full);
    if (EXCLUDE_RE.test('/' + rel + '/')) continue;
    if (e.isDirectory()) walk(full, out);
    else if (SCAN_EXT.has(path.extname(e.name)) && !EXCLUDE_FILE_RE.test(full)) out.push(rel);
  }
}
function changedFiles(base) {
  try {
    const merge = execSync(`git merge-base ${base} HEAD`, { encoding: 'utf8' }).trim();
    return execSync(`git diff --name-only ${merge} HEAD`, { encoding: 'utf8' })
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  } catch (e) {
    console.error(`! could not diff against ${base}: ${e.message}`);
    return [];
  }
}
function defaultScope() {
  return [
    'dws10.com',
    'dws6.com',
    'onelifetime.world',
    'lifetime.fi',
    'landing-pages',
    'docs/marketing',
    'Store',
  ].filter((d) => fs.existsSync(path.join(ROOT, d)));
}

// ---- 4. Run --------------------------------------------------------------
const rules = loadRules();
let findings = [];

if (opt.check != null) {
  findings = lintText(opt.check, rules, '--check');
} else {
  let targets;
  if (opt.changed) targets = changedFiles(opt.base);
  else if (positional.length) targets = positional;
  else targets = defaultScope();

  const files = [];
  for (const t of targets) {
    const abs = path.join(ROOT, t);
    if (!fs.existsSync(abs)) continue;
    if (fs.statSync(abs).isDirectory()) walk(abs, files);
    else {
      const rel = path.relative(ROOT, abs);
      if (
        SCAN_EXT.has(path.extname(rel)) &&
        !EXCLUDE_FILE_RE.test(abs) &&
        !EXCLUDE_RE.test('/' + rel + '/')
      )
        files.push(rel);
    }
  }
  for (const f of [...new Set(files)]) {
    try {
      findings.push(...lintText(fs.readFileSync(path.join(ROOT, f), 'utf8'), rules, f));
    } catch {}
  }
}

const fails = findings.filter((f) => f.severity === 'FAIL');
const warns = findings.filter((f) => f.severity === 'WARN');

if (opt.json) {
  console.log(
    JSON.stringify(
      {
        ok: fails.length === 0,
        fails: fails.length,
        warns: warns.length,
        rules: { deprecated: rules.deprecated.length, ambiguous: rules.ambiguous.length },
        findings,
      },
      null,
      2,
    ),
  );
} else {
  for (const f of findings) {
    const tag = f.severity === 'FAIL' ? '✖ FAIL' : '⚠ WARN';
    const sug =
      f.suggest && f.suggest.length ? `  → use: ${f.suggest.map((s) => `"${s}"`).join(' / ')}` : '';
    console.log(`${tag}  ${f.file}:${f.line}:${f.col}  "${f.phrase}" — ${f.reason}${sug}`);
  }
  console.log(
    `\nlint-truth-claims: ${fails.length} fail, ${warns.length} warn ` +
      `(${rules.deprecated.length} deprecated + ${rules.ambiguous.length} ambiguous phrases loaded)`,
  );
  if (!findings.length) console.log('✔ no truth-claim drift found.');
}

const failing = fails.length > 0 || (opt.strict && warns.length > 0);
process.exit(opt.noFail ? 0 : failing ? 1 : 0);
