#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=knowledge-drift-audit Date=2026-09-30
// Audit trail: git log -- scripts/weekly/knowledge-drift-audit.mjs
/**
 * knowledge-drift-audit — BLOG_STANDARD §17.5, weekly (DGX day-runner, Sundays).
 *
 *   node scripts/weekly/knowledge-drift-audit.mjs [--days 7] [--json]
 *
 * Reports, for the knowledge pillars (blog drafts, whitepapers):
 *   1. texts changed in the window without customer_value, without the §17.2 source minimum
 *      (≥3 sources, ≥1 academic), or without routes;
 *   2. scope creep: loop branches merged in the window whose files fall outside the prefixes
 *      their task spec names (`scope:` in .claude/done/<branch>.json), or that touch > 4 top-level
 *      areas when no scope is declared;
 *   3. routing gaps: `routes` naming roadmap/sales/ontology/truth when the window's commits did
 *      not touch that destination.
 * Public-claim drift is scripts/weekly/public-truth-drift-audit.sh — linked, not repeated.
 * Exit 0 = nothing found, 1 = findings (the .sh wrapper opens or updates one GitHub issue).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const DAYS = Number(argv[argv.indexOf('--days') + 1]) || 7;
const JSON_OUT = argv.includes('--json');
const git = (...a) => {
  try {
    return execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
  } catch {
    return '';
  }
};
const since = `${DAYS} days ago`;

const ACADEMIC =
  /doi\.org|arxiv\.org|dl\.acm\.org|ieeexplore|springer|sciencedirect|elsevier|wiley|nature\.com|jstor|ssrn|semanticscholar|\.edu\/|aalto\.fi|helsinki\.fi|lut\.fi|kth\.se|repository|urn\.fi/i;

// Front matter: a leading `---` block, or the older leading `Key: value` lines.
function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/) ?? text.match(/^((?:[A-Za-z_]+:[^\n]*\n)+)/);
  return m ? m[1] : '';
}
function field(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
}
function sourcesOf(fm, body) {
  const block = fm.match(/^sources:\s*\n((?:\s+-[\s\S]*?)(?=^\S|$(?![\s\S])))/m)?.[1] ?? '';
  const entries = block.split(/\n\s+-\s/).filter((e) => e.trim());
  const urls = [
    ...(
      block +
      '\n' +
      (body.match(/##\s*(Sources|Lähteet|Källor|Quellen)[\s\S]*$/i)?.[0] ?? '')
    ).matchAll(/https?:\/\/\S+/g),
  ].map((x) => x[0]);
  const academic =
    entries.filter((e) => /type:\s*academic/.test(e)).length +
    urls.filter((u) => ACADEMIC.test(u)).length;
  return { count: Math.max(entries.length, urls.length), academic };
}

const findings = { texts: [], scope: [], routes: [] };

// 1. Texts changed in the window.
const changed = git(
  'log',
  `--since=${since}`,
  '--name-only',
  '--format=',
  '--',
  'docs/blog-drafts',
  'docs/whitepapers',
)
  .split('\n')
  .filter(
    (f) =>
      /\.md$/.test(f) &&
      !/\/[A-Z0-9_]+\.md$/.test(f) && // index / numbering files, not posts
      !/\/_retired\//.test(f) &&
      !/README\.md$/.test(f) &&
      existsSync(f),
  );
for (const f of [...new Set(changed)]) {
  const text = readFileSync(f, 'utf8');
  if (field(frontMatter(text), 'translation_of')) continue; // judged on the master
  const fm = frontMatter(text);
  const body = text.slice(fm.length);
  const gaps = [];
  if (!field(fm, 'customer_value')) gaps.push('no customer_value (§17.1)');
  const s = sourcesOf(fm, body);
  if (s.count < 3 || s.academic < 1)
    gaps.push(`sources ${s.count}, academic ${s.academic} (§17.2 needs ≥3, ≥1 academic)`);
  if (!field(fm, 'routes')) gaps.push('no routes (§17.3)');
  if (gaps.length) findings.texts.push({ file: f, gaps });
}

// 2. Scope creep on loop merges.
const merges = git(
  'log',
  `--since=${since}`,
  '--merges',
  '--first-parent',
  'origin/main',
  '--format=%H %s',
)
  .split('\n')
  .filter(Boolean);
const squashed = git(
  'log',
  `--since=${since}`,
  '--no-merges',
  '--first-parent',
  'origin/main',
  '--format=%H %s',
)
  .split('\n')
  .filter((l) => /\bloop\b|opencode\//i.test(l));
for (const line of [...merges, ...squashed]) {
  const [sha, ...rest] = line.split(' ');
  const subject = rest.join(' ');
  const branch =
    subject.match(/from blogtheristo\/(\S+)/)?.[1] ?? subject.match(/opencode\/[\w.-]+/)?.[0];
  if (!branch || !/^opencode\//.test(branch)) continue;
  const files = git('diff', '--name-only', `${sha}^1`, sha).split('\n').filter(Boolean);
  const specPath = `.claude/done/${branch}.json`;
  const spec = existsSync(specPath) ? JSON.parse(readFileSync(specPath, 'utf8')) : null;
  const scope = spec?.scope ?? null;
  const own = (f) => f.startsWith('.claude/') || f === 'CHANGELOG.md';
  if (Array.isArray(scope)) {
    const out = files.filter((f) => !own(f) && !scope.some((p) => f.startsWith(p)));
    if (out.length)
      findings.scope.push({ branch, commit: sha.slice(0, 9), outside: out.slice(0, 12) });
  } else {
    const areas = new Set(files.filter((f) => !own(f)).map((f) => f.split('/')[0]));
    if (areas.size > 4) findings.scope.push({ branch, commit: sha.slice(0, 9), areas: [...areas] });
  }
}

// 3. Routing gaps.
const touched = git('log', `--since=${since}`, '--name-only', '--format=', 'origin/main').split(
  '\n',
);
const DEST = {
  roadmap: (f) => f.startsWith('docs/plans/') || /ROADMAP/i.test(f),
  sales: (f) => f.startsWith('docs/sales/'),
  ontology: (f) => f === 'ONTOLOGY.md' || f.startsWith('docs/localization/') || f.startsWith('kb/'),
  truth: (f) => /TRUTH_STANDARD|_STANDARD\.md$/.test(f),
};
for (const f of [...new Set(changed)]) {
  const routes = field(frontMatter(readFileSync(f, 'utf8')), 'routes')
    .replace(/[\[\]]/g, '')
    .split(/[,\s]+/)
    .filter((r) => DEST[r]);
  const missing = routes.filter((r) => !touched.some(DEST[r]));
  if (missing.length) findings.routes.push({ file: f, missing });
}

const total = findings.texts.length + findings.scope.length + findings.routes.length;
if (JSON_OUT) console.log(JSON.stringify({ days: DAYS, total, ...findings }, null, 2));
else {
  console.log(`# Knowledge drift & scope audit — last ${DAYS} days (BLOG_STANDARD §17.5)\n`);
  console.log(`## 1. Texts without value, sources or routes (${findings.texts.length})`);
  for (const t of findings.texts) console.log(`- \`${t.file}\` — ${t.gaps.join('; ')}`);
  console.log(`\n## 2. Scope creep on loop merges (${findings.scope.length})`);
  for (const s of findings.scope)
    console.log(
      `- \`${s.branch}\` @ ${s.commit} — ${s.outside ? `outside its scope: ${s.outside.join(', ')}` : `touches ${s.areas.length} areas with no declared scope: ${s.areas.join(', ')}`}`,
    );
  console.log(`\n## 3. Routing gaps (${findings.routes.length})`);
  for (const r of findings.routes)
    console.log(
      `- \`${r.file}\` routes to ${r.missing.join(', ')} but nothing there changed this week`,
    );
  console.log(
    '\nPublic-claim drift: see the "Weekly public truth, technology & partner drift" issue.',
  );
}
process.exit(total ? 1 : 0);
