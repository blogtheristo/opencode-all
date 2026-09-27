#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude-opus-5 Agent=Claude Code Date=2026-09-24
// Audit trail: git log -- scripts/ontology-admin-index.mjs

/**
 * Binds DWS ontology vocabulary to the admin documentation that explains it.
 *
 * Stores pointers (file + line + heading), never copied prose: Admin/ is
 * source-of-truth per CLAUDE.md, and duplicated manuals go stale silently.
 *
 *   node scripts/ontology-admin-index.mjs build
 *   node scripts/ontology-admin-index.mjs lookup channel
 *   node scripts/ontology-admin-index.mjs lookup channel --json
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, basename } from 'node:path';

const REPO = process.cwd();
const INDEX_PATH = join(REPO, 'docs/ontology/admin-term-index.json');

/** Docs whose headings become addressable sections. */
const SOURCE_DIRS = ['Admin'];
const SOURCE_FILES = ['ONTOLOGY.md', 'CLAUDE.md'];

/** Terms too common to be useful as index keys. */
const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'that',
  'this',
  'are',
  'was',
  'not',
  'but',
  'all',
  'new',
  'use',
  'used',
  'using',
  'via',
  'per',
  'see',
  'via',
  'how',
  'why',
  'what',
  'when',
  'admin',
  'manual',
  'version',
  'overview',
  'status',
  'note',
  'notes',
  'table',
  'contents',
  'setup',
  'config',
  'configuration',
  'step',
  'steps',
  'run',
  'add',
  'set',
  'get',
  'you',
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full, out);
    } else if (entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function collectSourceFiles() {
  const files = [];
  for (const dir of SOURCE_DIRS) {
    const full = join(REPO, dir);
    if (existsSync(full)) walk(full, files);
  }
  for (const f of SOURCE_FILES) {
    const full = join(REPO, f);
    if (existsSync(full)) files.push(full);
  }
  return files;
}

/**
 * Splits a markdown file into sections keyed by heading, carrying the line
 * number so a lookup can point at file:line rather than "somewhere in here".
 */
function parseSections(path) {
  const lines = readFileSync(path, 'utf8').split('\n');
  const sections = [];
  let current = null;
  let inFence = false;

  lines.forEach((line, i) => {
    if (line.trimStart().startsWith('```')) inFence = !inFence;
    const heading = !inFence && /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      if (current) sections.push(current);
      current = {
        heading: heading[2].trim(),
        level: heading[1].length,
        line: i + 1,
        body: [],
      };
      return;
    }
    if (current) current.body.push(line);
  });
  if (current) sections.push(current);

  return sections.map((s) => ({ ...s, body: s.body.join('\n') }));
}

/**
 * Access class per file, from the same policy the API enforces
 * (docs/access/document-access-policy.json), so a lookup can say what clearance
 * a hit needs instead of implying everything is readable by everyone. Mirrors
 * classifyDocument() in src/services/document-access.ts, including its
 * default-deny: an unmatched path reads as confidential.
 */
function loadAccessRules() {
  const policyPath = join(REPO, 'docs/access/document-access-policy.json');
  if (!existsSync(policyPath)) return null;
  const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
  return policy.rules.flatMap((rule) =>
    rule.patterns.map((p) => ({ cls: rule.class, re: new RegExp(p, 'i') })),
  );
}

function classifyPath(rules, relPath) {
  if (!rules) return null;
  const hit = rules.find((r) => r.re.test(relPath.replace(/\\/g, '/')));
  return hit ? hit.cls : 'confidential';
}

/** Ontology vocabulary: CCP seed preferred terms + compiled wiki concept names. */
function collectOntologyTerms() {
  const terms = new Set();

  const ontologyPath = join(REPO, 'ONTOLOGY.md');
  if (existsSync(ontologyPath)) {
    const src = readFileSync(ontologyPath, 'utf8');
    const start = src.indexOf('<!-- CCP_SEED_START -->');
    const end = src.indexOf('<!-- CCP_SEED_END -->');
    if (start !== -1 && end !== -1) {
      const block = src.slice(start, end);
      for (const m of block.matchAll(/"preferred_term"\s*:\s*"([^"]+)"/g)) {
        terms.add(m[1].toLowerCase());
      }
    }
  }

  const conceptsDir = join(REPO, 'kb/wiki/concepts');
  if (existsSync(conceptsDir)) {
    for (const f of readdirSync(conceptsDir)) {
      if (!f.endsWith('.md')) continue;
      terms.add(basename(f, '.md').replace(/-/g, ' ').toLowerCase());
    }
  }

  return terms;
}

/** Significant words in a heading — these become lookup keys. */
function headingKeys(heading) {
  return heading
    .toLowerCase()
    .replace(/[`*_(){}[\]<>|#:,.]/g, ' ')
    .split(/[\s/\\-]+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
}

function build() {
  const ontologyTerms = collectOntologyTerms();
  const accessRules = loadAccessRules();
  const index = {};
  let sectionCount = 0;

  for (const path of collectSourceFiles()) {
    const rel = relative(REPO, path);
    const access = classifyPath(accessRules, rel);
    for (const section of parseSections(path)) {
      sectionCount += 1;
      const entry = { file: rel, heading: section.heading, line: section.line, access };
      const bodyLower = section.body.toLowerCase();
      const headLower = section.heading.toLowerCase();

      // A heading word is a strong key: the section is *about* it.
      for (const key of headingKeys(section.heading)) {
        (index[key] ||= []).push({ ...entry, match: 'heading' });
      }

      // An ontology term appearing in the body is a weaker but real signal.
      for (const term of ontologyTerms) {
        if (headLower.includes(term)) continue; // already captured above
        if (bodyLower.includes(term)) {
          (index[term] ||= []).push({ ...entry, match: 'body' });
        }
      }
    }
  }

  // Heading matches first, then by file for stable output.
  for (const key of Object.keys(index)) {
    index[key].sort(
      (a, b) =>
        (a.match === 'heading' ? 0 : 1) - (b.match === 'heading' ? 0 : 1) ||
        a.file.localeCompare(b.file) ||
        a.line - b.line,
    );
  }

  const payload = {
    generated: new Date().toISOString().slice(0, 10),
    generator: 'scripts/ontology-admin-index.mjs',
    sources: [...SOURCE_DIRS, ...SOURCE_FILES],
    sections_scanned: sectionCount,
    ontology_terms: ontologyTerms.size,
    terms: Object.keys(index).length,
    index,
  };

  mkdirSync(join(REPO, 'docs/ontology'), { recursive: true });
  writeFileSync(INDEX_PATH, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(
    `Indexed ${sectionCount} sections from ${collectSourceFiles().length} files ` +
      `→ ${Object.keys(index).length} terms (${ontologyTerms.size} from ontology)`,
  );
  console.log(`Wrote ${relative(REPO, INDEX_PATH)}`);
}

function lookup(term, asJson) {
  // The index is generated and gitignored (1MB+, churns on every doc edit), so
  // a cold checkout builds it on first use rather than failing.
  if (!existsSync(INDEX_PATH)) build();
  const { index, generated } = JSON.parse(readFileSync(INDEX_PATH, 'utf8'));
  const q = term.toLowerCase();

  const exact = index[q] ?? [];
  const partial = Object.entries(index)
    .filter(([k]) => k !== q && k.includes(q))
    .flatMap(([k, v]) => v.map((e) => ({ ...e, via: k })));

  const hits = [...exact, ...partial];

  if (asJson) {
    console.log(JSON.stringify({ term: q, generated, hits }, null, 2));
    return;
  }

  if (hits.length === 0) {
    console.log(`No admin documentation indexed for "${term}".`);
    console.log(
      'Related terms:',
      Object.keys(index)
        .filter((k) => k.startsWith(q[0]))
        .slice(0, 8)
        .join(', ') || '(none)',
    );
    process.exit(2);
  }

  console.log(
    `"${term}" — ${hits.length} section(s) in admin documentation (index ${generated}):\n`,
  );
  for (const h of hits.slice(0, 25)) {
    const tag = h.match === 'heading' ? '●' : '○';
    const via = h.via ? ` [via "${h.via}"]` : '';
    const acc = h.access ? ` {${h.access}}` : '';
    console.log(`  ${tag} ${h.file}:${h.line}${via}${acc}`);
    console.log(`     ${h.heading}`);
  }
  if (hits.length > 25) console.log(`\n  … ${hits.length - 25} more (use --json for all)`);
  console.log('\n  ● heading match (section is about this)   ○ body mention');
  console.log(
    '  {class} = access class — who may open it (docs/access/document-access-policy.json)',
  );
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === 'build') {
  build();
} else if (cmd === 'lookup' && rest.length > 0) {
  lookup(rest.filter((a) => !a.startsWith('--')).join(' '), rest.includes('--json'));
} else {
  console.error(
    'Usage:\n  ontology-admin-index.mjs build\n  ontology-admin-index.mjs lookup <term> [--json]',
  );
  process.exit(1);
}
