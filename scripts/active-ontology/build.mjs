#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=active-ontology Date=2026-09-30
// Audit trail: git log -- scripts/active-ontology/build.mjs
/**
 * Active Ontology — the graph of the four knowledge pillars against the ontology, and how far
 * each piece of work has come (HIC 30.09.2026).
 *
 *   node scripts/active-ontology/build.mjs <out-dir>
 *
 * Writes <out-dir>/index.html (from page.html) and <out-dir>/graph.json:
 *   concepts  dictionary terms (docs/localization/dws-dictionary.json `shared`) with their
 *             ontologyId cluster — the active ontology's vocabulary;
 *   work      the four pillars (BLOG_STANDARD §17):
 *               blog        masters in docs/blog-drafts (variants are counted, not drawn)
 *               learn       Learn/ documents the access policy allows (newest version each)
 *               whitepaper  docs/whitepapers/*.md and Learn whitepapers
 *               thesis      the master's thesis (operational) and the PhD (strategic), EN masters
 *   centres   investor, customer, partner, materials, legal and compliance hubs: live dws10.com
 *             pages (scripts/knowledge-centres.mjs); internal folders are counted, not drawn;
 *   edges     work → concept: a blog master's seo_tags, otherwise the terms its text mentions
 *             (English term, whole word; top 10 by count);
 *   progress  per item: blog = §16 contract + §17 value/sources/routes, others = sources found.
 * No model, no network: every number is counted from the repository.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collectCentres } from '../knowledge-centres.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = process.argv[2] && resolve(process.argv[2]);
if (!out) {
  console.error('usage: node scripts/active-ontology/build.mjs <out-dir>');
  process.exit(2);
}
mkdirSync(out, { recursive: true });
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const git = (...a) => {
  try {
    return execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};

// ---------- concepts ----------
const dict = JSON.parse(read('docs/localization/dws-dictionary.json')).shared ?? {};
const concepts = Object.entries(dict)
  .filter(([, v]) => v && v.en)
  .map(([key, v]) => ({
    id: `c:${key}`,
    key,
    label: v.en,
    fi: v.fi ?? '',
    cluster: v.ontologyId ?? 'none',
    seo: !!v.seo,
  }));
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matchers = concepts
  .filter((c) => c.label.length >= 3)
  .map((c) => ({ id: c.id, re: new RegExp(`\\b${escapeRe(c.label)}\\b`, 'gi') }));
function mentions(text, limit = 10) {
  return matchers
    .map((m) => ({ id: m.id, n: (text.match(m.re) ?? []).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, limit);
}

// ---------- helpers ----------
function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/) ?? text.match(/^((?:[A-Za-z_]+:[^\n]*\n)+)/);
  return m ? m[1] : '';
}
const field = (fm, k) =>
  (fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1] ?? '').trim().replace(/^["']|["']$/g, '');
const ACADEMIC =
  /doi\.org|arxiv\.org|dl\.acm\.org|ieeexplore|springer|sciencedirect|wiley|nature\.com|jstor|ssrn|semanticscholar|\.edu\/|urn\.fi/i;
function sourceStats(text) {
  const urls = [...text.matchAll(/https?:\/\/[^\s)"'<>\]]+/g)].map((m) => m[0]);
  const external = urls.filter(
    (u) =>
      !/onelifetime\.world|dws10\.com|dws6\.com|lifetime\.fi|github\.com\/blogtheristo/.test(u),
  );
  return {
    external: new Set(external).size,
    academic: new Set(external.filter((u) => ACADEMIC.test(u))).size,
  };
}
const work = [];
const edges = [];
const addEdges = (id, list) =>
  list.forEach((m) => edges.push({ source: id, target: m.id, w: m.n ?? 1 }));

// ---------- blog ----------
const draftDir = 'docs/blog-drafts';
const drafts = readdirSync(join(ROOT, draftDir)).filter(
  (n) => /^[a-z0-9][a-z0-9.-]*\.md$/.test(n) && !n.startsWith('_'),
);
const published = new Set(
  readdirSync(join(ROOT, 'onelifetime.world/posts')).filter((f) => f.endsWith('.html')),
);
const baseOf = (n) => n.replace(/(\.(fi|sv|de|fr))?\.md$/, '');
const variants = {};
for (const n of drafts)
  (variants[baseOf(n)] ??= new Set()).add(n.match(/\.(fi|sv|de|fr)\.md$/)?.[1] ?? 'en');
const masters = drafts.filter(
  (n) => !field(frontMatter(read(`${draftDir}/${n}`)), 'translation_of'),
);
const seenBase = new Set();
for (const n of masters) {
  const base = baseOf(n);
  if (seenBase.has(base)) continue; // one node per post
  seenBase.add(base);
  const text = read(`${draftDir}/${n}`);
  const fm = frontMatter(text);
  const tags = field(fm, 'seo_tags')
    .replace(/[[\]"']/g, '')
    .split(/[,\s]+/)
    .filter((t) => dict[t]);
  const langs = [
    ...new Set([
      ...(variants[base] ?? []),
      ...[...published]
        .filter((f) => f.startsWith(`${base}.`))
        .map((f) => f.match(/\.(fi|sv|de|fr)\.html$/)?.[1] ?? 'en'),
    ]),
  ];
  const src = sourceStats(text);
  const checks = {
    hero: !!field(fm, 'hero') || !!field(fm, 'subtitle'),
    languages: langs.length >= 5,
    visual:
      !!(field(fm, 'visual_src') || field(fm, 'hero_image')) &&
      existsSync(join(ROOT, field(fm, 'visual_src') || field(fm, 'hero_image') || '/nonexistent')),
    seo: tags.length >= 3,
    value: !!field(fm, 'customer_value'),
    sources: src.external >= 3 && src.academic >= 1,
    routes: !!field(fm, 'routes'),
  };
  const status =
    (field(fm, 'Status') || field(fm, 'status') || 'DRAFT').match(/^[A-Z_-]+/)?.[0] ?? 'DRAFT';
  const id = `w:blog:${base}`;
  work.push({
    id,
    pillar: 'blog',
    label: field(fm, 'title') || field(fm, 'Title') || base,
    file: `${draftDir}/${n}`,
    status: [...published].some((f) => f.startsWith(`${base}.`) || f === `${base}.html`)
      ? 'PUBLISHED'
      : status,
    langs,
    checks,
    score: Object.values(checks).filter(Boolean).length,
    of: Object.keys(checks).length,
    sources: src,
  });
  addEdges(id, tags.length ? tags.map((t) => ({ id: `c:${t}`, n: 3 })) : mentions(text));
}

// ---------- learn / whitepapers / thesis ----------
const version = (f) =>
  (f.match(/[_-]v(\d+(?:\.\d+)*)\.(html|md)$/i)?.[1] ?? '0').split('.').map(Number);
const newer = (a, b) => {
  const x = version(a);
  const y = version(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++)
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) > (y[i] ?? 0);
  return false;
};
let classify = () => 'internal';
try {
  ({ classifyDocument: classify } = await import('../../src/services/document-access.ts').then(
    (m) => ({
      classifyDocument: (p) => m.classifyDocument(p).class,
    }),
  ));
} catch {
  /* run under tsx for the access policy; plain node treats every Learn doc as internal */
}
const ALLOWED = new Set(['public', 'user', 'customer', 'internal']);
const latest = new Map();
for (const f of readdirSync(join(ROOT, 'Learn')).filter((f) => f.endsWith('.html'))) {
  const base = f.replace(/[_-]v\d+(\.\d+)*\.html$/i, '').replace(/\.html$/, '');
  if (!latest.has(base) || newer(f, latest.get(base))) latest.set(base, f);
}
const stripHtml = (h) =>
  h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
for (const [base, f] of latest) {
  if (/^(V3Thesis|PHD_FIREHORSE)/.test(base)) continue; // thesis below, from the .md masters
  if (!ALLOWED.has(classify(`Learn/${f}`))) continue;
  const html = read(`Learn/${f}`);
  const pillar = /whitepaper/i.test(f) ? 'whitepaper' : 'learn';
  const id = `w:${pillar}:${base}`;
  const text = stripHtml(html);
  work.push({
    id,
    pillar,
    label: (html.match(/<title>([^<]{1,160})<\/title>/i)?.[1] ?? base).trim(),
    file: `Learn/${f}`,
    status: 'PUBLISHED',
    sources: sourceStats(html),
  });
  addEdges(id, mentions(text));
}
for (const f of readdirSync(join(ROOT, 'docs/whitepapers')).filter((f) =>
  /^WP\d+.*\.md$/.test(f),
)) {
  const text = read(`docs/whitepapers/${f}`);
  const id = `w:whitepaper:${f.replace(/\.md$/, '')}`;
  work.push({
    id,
    pillar: 'whitepaper',
    label: text.match(/^#\s+(.+)$/m)?.[1] ?? f,
    file: `docs/whitepapers/${f}`,
    status: existsSync(join(ROOT, `docs/whitepapers/${f.replace(/\.md$/, '.html')}`))
      ? 'BUILT'
      : 'DRAFT',
    sources: sourceStats(text),
  });
  addEdges(id, mentions(text));
}
const theses = [
  [
    'docs/metropolia/master-thesis/en/V3Thesis_EN.md',
    "Master's thesis — operational",
    'operational',
  ],
  ['docs/PHD_FIREHORSE_EN.md', 'PhD — strategic', 'strategic'],
];
for (const [p, label, track] of theses) {
  if (!existsSync(join(ROOT, p))) continue;
  const text = read(p);
  const id = `w:thesis:${track}`;
  work.push({
    id,
    pillar: 'thesis',
    track,
    label,
    file: p,
    status: `v${text.match(/^Version:\s*([\d.]+)/m)?.[1] ?? '?'}`,
    sections: (text.match(/^#{2,3}\s+(§?\d+(\.\d+)+)/gm) ?? []).length,
    sources: sourceStats(text),
  });
  addEdges(id, mentions(text, 24));
}

// ---------- centres and hubs ----------
const centres = collectCentres(ROOT);
for (const d of centres.docs) {
  const id = `w:${d.centre}:${d.file}`;
  work.push({
    id,
    pillar: d.centre,
    label: d.title,
    file: d.file,
    url: d.url,
    status: 'LIVE',
    sources: sourceStats(d.html),
  });
  addEdges(id, mentions(stripHtml(d.html)));
}

// ---------- coverage ----------
const used = new Map();
for (const e of edges) used.set(e.target, (used.get(e.target) ?? 0) + 1);
const drawn = concepts.filter((c) => used.has(c.id) || c.seo);
const byPillar = {};
for (const w of work) {
  const p = (byPillar[w.pillar] ??= { items: 0, sourced: 0, complete: 0 });
  p.items++;
  if (w.sources?.academic >= 1 && w.sources?.external >= 3) p.sourced++;
  // Blog: the full §16 + §17 contract. Other pillars: externally sourced (§17.2).
  if (w.pillar === 'blog' ? w.score === w.of : w.sources?.academic >= 1 && w.sources?.external >= 3)
    p.complete++;
}
const clusters = {};
for (const c of drawn) {
  const k = (clusters[c.cluster] ??= { concepts: 0, covered: 0 });
  k.concepts++;
  if (used.has(c.id)) k.covered++;
}
const graph = {
  built: new Date().toISOString(),
  commit: git('rev-parse', '--short', 'HEAD'),
  concepts: drawn.map((c) => ({ ...c, degree: used.get(c.id) ?? 0 })),
  work,
  edges,
  summary: { byPillar, clusters, centres: { withheld: centres.withheld } },
};
writeFileSync(join(out, 'graph.json'), JSON.stringify(graph));
copyFileSync(join(ROOT, 'scripts/active-ontology/page.html'), join(out, 'index.html'));
console.log(
  `active-ontology build: ${drawn.length} concepts, ${work.length} work items (${Object.entries(
    byPillar,
  )
    .map(([k, v]) => `${k} ${v.items}`)
    .join(', ')}), ${edges.length} links → ${out}`,
);
