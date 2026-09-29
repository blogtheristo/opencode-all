#!/usr/bin/env node
// Evidence: Tool=Claude Code Agent=blog-editor Date=2026-09-28
// Audit trail: git log -- scripts/blog/contract-check.mjs
/**
 * BLOG_STANDARD §16 Post Completeness Contract — checker for every post, drafts and published.
 *
 *   node scripts/blog/contract-check.mjs                 # table of gaps, exit 1 if any post fails
 *   node scripts/blog/contract-check.mjs --json          # machine-readable
 *   node scripts/blog/contract-check.mjs --only header   # hero, naming, visual fields, seo tags
 *   node scripts/blog/contract-check.mjs --only languages
 *   node scripts/blog/contract-check.mjs --only visual   # visual file exists on disk
 *
 * A post is one base slug. Its master is docs/blog-drafts/<slug>.md (or the published
 * onelifetime.world/posts/<slug>.html when no draft exists yet, which fails "header").
 * The same rules as the Blog editor (scripts/blog-editor/page.html) — keep them in step.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const LANGS = ['en', 'fi', 'sv', 'de', 'fr'];
const VISUALS = ['infographic', 'illustration', 'photo', 'video'];
const GROUPS = {
  header: ['draft', 'hero', 'naming', 'visual_fields', 'seo_tags'],
  languages: ['languages'],
  visual: ['visual_file'],
};

const dict = JSON.parse(
  readFileSync(join(ROOT, 'docs/localization/dws-dictionary.json'), 'utf8'),
).shared;
const baseOf = (n) => n.replace(/(\.(fi|sv|de|fr))?\.(md|html)$/, '');
const langOf = (n) => n.match(/\.(fi|sv|de|fr)\.(md|html)$/)?.[1] || 'en';

// Header: a `---` block, or the older leading `Key: value` lines up to the first blank line.
function header(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const body = m ? m[1] : (text.match(/^(?:[A-Za-z_]+:[^\n]*(?:\n|$))+/)?.[0] ?? '');
  const fm = {};
  for (const line of body.split('\n')) {
    const kv = line.match(/^([A-Za-z_]+):\s*"?(.*?)"?\s*$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return fm;
}

const draftDir = join(ROOT, 'docs/blog-drafts');
const postDir = join(ROOT, 'onelifetime.world/posts');
const drafts = readdirSync(draftDir).filter((n) => /^[A-Za-z0-9._-]+\.md$/.test(n));
const posts = readdirSync(postDir).filter((n) => n.endsWith('.html') && !n.startsWith('_'));

const units = new Map(); // base -> { langs:Set, draft?, post? }
const unit = (b) => units.get(b) ?? units.set(b, { langs: new Set() }).get(b);
for (const n of drafts) {
  const u = unit(baseOf(n));
  u.langs.add(langOf(n));
  if (!u.draft || langOf(n) === 'en') u.draft = n;
}
for (const n of posts) {
  const u = unit(baseOf(n));
  u.langs.add(langOf(n));
  if (!u.post || langOf(n) === 'en') u.post = n;
}

const results = [];
for (const [base, u] of [...units].sort()) {
  const fm = u.draft ? header(readFileSync(join(draftDir, u.draft), 'utf8')) : {};
  const pick = (...k) => k.map((x) => fm[x]).find((v) => v && v.trim()) || '';
  if (/^RETIRED/.test(pick('Status'))) continue; // HIC-retired posts are not brought up to level
  const gaps = [];
  if (!u.draft) gaps.push('draft');
  const hero = pick('hero', 'subtitle');
  if (!hero || hero.length > 160) gaps.push('hero');
  const slug = pick('slug', 'Slug');
  if (
    !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ||
    slug.length > 60 ||
    /\d{4}-\d{2}/.test(slug) ||
    slug !== base
  )
    gaps.push('naming');
  const vSrc = pick('visual_src', 'hero_image');
  if (!VISUALS.includes(pick('visual')) || !vSrc || !pick('visual_alt', 'hero_image_alt'))
    gaps.push('visual_fields');
  if (!vSrc || (!/^https?:/.test(vSrc) && !existsSync(join(ROOT, vSrc)))) gaps.push('visual_file');
  const tags = pick('seo_tags')
    .replace(/[[\]"']/g, '')
    .split(/[,\s]+/)
    .filter(Boolean);
  const bound = tags.filter((t) => dict[t]?.seo && dict[t].ontologyId !== 'none');
  if (bound.length < 3 || tags.length > 8 || tags.some((t) => !dict[t]?.seo)) gaps.push('seo_tags');
  if (LANGS.some((l) => !u.langs.has(l))) gaps.push('languages');
  const counted = ONLY ? gaps.filter((g) => GROUPS[ONLY]?.includes(g)) : gaps;
  results.push({
    base,
    draft: u.draft ?? null,
    post: u.post ?? null,
    langs: LANGS.filter((l) => u.langs.has(l)),
    gaps: counted,
  });
}

const failing = results.filter((r) => r.gaps.length);
if (JSON_OUT)
  console.log(
    JSON.stringify(
      { only: ONLY, total: results.length, failing: failing.length, results },
      null,
      1,
    ),
  );
else {
  for (const r of failing) console.log(`${r.base.padEnd(52)} ${r.gaps.join(', ')}`);
  console.log(
    `\n§16${ONLY ? ' ' + ONLY : ''}: ${results.length - failing.length}/${results.length} posts complete`,
  );
}
process.exit(failing.length ? 1 : 0);
