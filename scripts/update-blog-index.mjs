#!/usr/bin/env node
/**
 * update-blog-index.mjs — Add newly published posts to the blog index
 *
 * Reads `latestPosts` from onelifetime.world/blog/index.html, scans the
 * posts directory, and prepends any post that is not yet listed (one
 * language version per post family, fi preferred, then en). Templates,
 * drafts and retired posts are skipped. The list is kept sorted newest
 * first. Writes both the canonical site and the landing-pages mirror.
 *
 * Curated entries already in the list are preserved verbatim.
 *
 * Usage:
 *   node scripts/update-blog-index.mjs [--dry-run]
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const SITES = [
  path.join(REPO_ROOT, 'onelifetime.world', 'blog', 'index.html'),
  path.join(REPO_ROOT, 'landing-pages', 'onelifetime-world', 'blog', 'index.html'),
];
const POSTS_DIR = path.join(REPO_ROOT, 'onelifetime.world', 'posts');

const LANG_ORDER = ['fi', 'en', 'sv', 'de', 'fr'];
const LANG_SUFFIX_RE = /\.(fi|sv|de|fr)$/;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DRY_RUN = process.argv.includes('--dry-run');

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function parseListDate(str) {
  const m = String(str).match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  if (!m) return null;
  const monthIndex = MONTHS.findIndex((abbr) => m[2].toLowerCase().startsWith(abbr.toLowerCase()));
  if (monthIndex < 0) return null;
  return `${m[3]}-${String(monthIndex + 1).padStart(2, '0')}-${String(m[1]).padStart(2, '0')}`;
}

function parsePublishedTime(html) {
  const m = html.match(/article:published_time"\s+content="(\d{4}-\d{2}-\d{2})"/);
  return m ? m[1] : null;
}

function parseTitle(html) {
  const og = html.match(/property="og:title"\s+content="([^"]*)"/);
  if (og) return og[1];
  const t = html.match(/<title>([^<]*)<\/title>/);
  return t ? t[1].trim() : null;
}

function baseSlug(slug) {
  return slug.replace(LANG_SUFFIX_RE, '');
}

async function scanPosts() {
  const files = await readdir(POSTS_DIR);
  const posts = [];
  for (const f of files) {
    if (!f.endsWith('.html')) continue;
    if (f.startsWith('_template') || /_DRAFT|_RETIRED/i.test(f)) continue;
    const abs = path.join(POSTS_DIR, f);
    const html = await readFile(abs, 'utf8');
    const slug = f.replace(/\.html$/, '');
    const title = parseTitle(html);
    const iso = parsePublishedTime(html);
    if (!title || !iso) continue;
    const lang = LANG_SUFFIX_RE.test(slug) ? slug.match(LANG_SUFFIX_RE)[1] : 'en';
    posts.push({ slug, base: baseSlug(slug), lang, title, iso });
  }
  return posts;
}

async function main() {
  const posts = await scanPosts();

  // Group by post family (base slug), keep preferred language version.
  const families = new Map();
  for (const p of posts) {
    const cur = families.get(p.base);
    if (!cur) {
      families.set(p.base, p);
    } else {
      const curRank = LANG_ORDER.indexOf(cur.lang);
      const newRank = LANG_ORDER.indexOf(p.lang);
      if (newRank < curRank) families.set(p.base, p);
    }
  }
  const indexed = [...families.values()];

  let changed = false;
  for (const site of SITES) {
    const html = await readFile(site, 'utf8');
    const blockMatch = html.match(/var latestPosts = \[([\s\S]*?)\n(\s*)\];/);
    if (!blockMatch) {
      console.error(`[update-blog-index] latestPosts block not found in ${site}`);
      process.exitCode = 1;
      continue;
    }
    const existingRaw = blockMatch[1];
    const existingUrls = new Set(
      [...existingRaw.matchAll(/url: "(\/posts\/[^"]+)"/g)].map((m) => m[1]),
    );

    // Only add posts newer than (or equal to) the newest post already listed —
    // never resurrect old curated-out posts.
    let newestIso = '0000-00-00';
    for (const m of existingRaw.matchAll(/date: "([^"]+)"/g)) {
      const iso = parseListDate(m[1]);
      if (iso && iso > newestIso) newestIso = iso;
    }

    const missing = indexed
      .filter((p) => !existingUrls.has(`/posts/${p.slug}.html`))
      .filter((p) => p.iso >= newestIso)
      .sort((a, b) => (a.iso < b.iso ? 1 : a.iso > b.iso ? -1 : 0));

    if (missing.length === 0) {
      console.log(`[update-blog-index] ${site}: no new posts to add`);
      continue;
    }

    const added = missing
      .map((p) => {
        const date = formatDate(p.iso);
        return `            {\n              url: "/posts/${p.slug}.html",\n              title: ${JSON.stringify(p.title)},\n              date: "${date}",\n            },`;
      })
      .join('\n');

    const newBlock = `${added}\n${existingRaw}`;
    const newHtml = html.replace(blockMatch[0], `var latestPosts = [${newBlock}\n${blockMatch[2]}];`);

    if (!DRY_RUN) {
      await writeFile(site, newHtml, 'utf8');
    }
    changed = true;
    console.log(
      `[update-blog-index] ${DRY_RUN ? '[dry-run] would add' : 'added'} ${missing.length} post(s) to ${site}: ${missing.map((p) => p.slug).join(', ')}`,
    );
  }

  if (changed && !DRY_RUN) {
    console.log('[update-blog-index] done. Run again to confirm list is stable.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});