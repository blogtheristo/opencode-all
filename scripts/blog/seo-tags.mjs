#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=blog-drafts-review Date=2026-09-23
// Audit trail: git log -- scripts/blog/seo-tags.mjs
//
// Dictionary-driven SEO tags for blog posts.
// Source of terms: docs/localization/dws-dictionary.json (shared entries with seo: true).
// For each post, finds the dictionary terms the post actually uses (in the post's language,
// or by KYA-S1 code such as TRS / PRV / TC4) and writes:
//   - <meta name="keywords">                (existing keywords kept, new ones appended)
//   - <meta property="article:tag"> block   (between <!-- seo-tags --> markers, idempotent)
//   - JSON-LD "keywords" on the Article / BlogPosting object
// It also reports JSON-LD headlines that do not match the page <title> (copy-paste drift).
//
// Usage:
//   node scripts/blog/seo-tags.mjs --check            # report only, exit 1 if changes pending
//   node scripts/blog/seo-tags.mjs --write            # apply to both post folders
//   node scripts/blog/seo-tags.mjs --json             # machine-readable report
//   node scripts/blog/seo-tags.mjs --write <files…>   # limit to given files

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const POST_DIRS = ['onelifetime.world/posts', 'landing-pages/onelifetime-world/posts'];
const LANGS = ['en', 'fi', 'sv', 'de', 'fr'];
const MAX_TAGS = 20;
const MAX_ARTICLE_TAGS = 8;

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const JSON_OUT = args.includes('--json');
const fileArgs = args.filter((a) => !a.startsWith('--'));

const dict = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'docs/localization/dws-dictionary.json'), 'utf8'),
);

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const unJson = (x) => {
  try {
    return JSON.parse(`"${x}"`);
  } catch {
    return x;
  }
};
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");

// Primary name: first segment before " / ", parenthetical dropped for matching.
const matchName = (s) =>
  s
    .split(' / ')[0]
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .trim();
const CODE_OK = (c) => c && /^[A-Z][A-Z0-9-]{2,}$/.test(c);

const TERMS = Object.entries(dict.shared)
  .filter(([, v]) => v.seo)
  .map(([key, v]) => ({ key, v, code: CODE_OK(v.code) ? v.code : null }));

function tagFor(term, lang) {
  const name = term.v[lang] || term.v.en;
  const primary = name.split(' / ')[0].trim();
  if (term.code && !primary.includes(term.code)) return `${primary} (${term.code})`;
  return primary;
}

function bodyText(html) {
  // Article content only: nav, header, footer and scripts would tag every post alike.
  const scope =
    (html.match(/<article[\s\S]*<\/article>/i) || html.match(/<main[\s\S]*<\/main>/i) || [])[0] ||
    html.split(/<body[^>]*>/i)[1] ||
    html;
  return decode(
    scope
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<(nav|header|footer|aside)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ');
}

function termsInPost(text, lang) {
  const mentionsKya = /\bKYA\b/.test(text);
  const count = (re) => (text.match(re) || []).length;
  const found = [];
  for (const t of TERMS) {
    const names = new Set(
      [matchName(t.v[lang] || ''), matchName(t.v.en)].filter((n) => n.length >= 3),
    );
    let hits = 0;
    for (const n of names) hits += count(new RegExp(`(?<![\\p{L}])${escRe(n)}(?![\\p{L}])`, 'giu'));
    if (t.code) {
      const codeHits = count(new RegExp(`\\b${escRe(t.code)}\\b`, 'g'));
      // Bare three-letter codes (TRS, PRV, REG…) count only in posts that are about KYA.
      if (t.code.startsWith('KYA') || t.code === 'HIC' || mentionsKya) hits += codeHits;
    }
    if (hits) found.push({ tag: tagFor(t, lang), hits, code: t.code });
  }
  // Most-mentioned terms first: the cap keeps what the post is actually about.
  // One tag per KYA code (TC4 has two dictionary names; FLT and FLT-4 share a Finnish name).
  found.sort((a, b) => b.hits - a.hits);
  const codes = new Set();
  const tags = [];
  for (const f of found) {
    const base = f.code ? f.code.replace(/-\d+$/, '') : null;
    if (base && codes.has(base)) continue;
    if (base) codes.add(base);
    tags.push(f.tag);
  }
  return [...new Set(tags)];
}

function mergeKeywords(existing, add) {
  const out = [];
  const seen = new Set();
  for (const k of [...existing, ...add]) {
    const n = k.trim();
    if (!n || seen.has(n.toLowerCase())) continue;
    seen.add(n.toLowerCase());
    out.push(n);
  }
  return out.slice(0, MAX_TAGS);
}

function processFile(file) {
  const html = fs.readFileSync(file, 'utf8');
  const lang = ((html.match(/<html[^>]*\blang="([a-z]{2})/i) || [])[1] || 'en').toLowerCase();
  const L = LANGS.includes(lang) ? lang : 'en';
  const found = termsInPost(bodyText(html), L);
  const report = { file: path.relative(ROOT, file), lang: L, added: [], headlineMismatch: null };

  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '').trim();
  const headline = decode(
    unJson((html.match(/"headline"\s*:\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || ''),
  ).trim();
  if (title && headline) {
    const norm = (s) =>
      s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim();
    const [a, b] = [norm(title), norm(headline)];
    if (!a.includes(b.slice(0, 25)) && !b.includes(a.slice(0, 25))) {
      report.headlineMismatch = { title, headline };
    }
  }
  let out = html;
  // A JSON-LD headline copied from another post (same headline, different title) is replaced
  // with this post's <h1>; search engines would otherwise show the other post's headline.
  if (report.headlineMismatch && DUP_HEADLINES.has(headline)) {
    const h1 = decode(
      ((out.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '').replace(/<[^>]+>/g, ''),
    )
      .replace(/\s+/g, ' ')
      .trim();
    if (h1) {
      out = out.replace(
        /("headline"\s*:\s*")(?:[^"\\]|\\.)*(")/,
        `$1${h1.replace(/["\\]/g, '\\$&')}$2`,
      );
      report.headlineFixed = h1;
    }
  }
  // Same drift for the JSON-LD description: a copied one is replaced with this post's meta description.
  const ldDesc = decode(
    unJson((out.match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || ''),
  ).trim();
  const metaDesc = decode(
    (out.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || '',
  ).trim();
  if (ldDesc && metaDesc && ldDesc !== metaDesc && DUP_DESCRIPTIONS.has(ldDesc)) {
    out = out.replace(
      /("description"\s*:\s*")(?:[^"\\]|\\.)*(")/,
      `$1${metaDesc.replace(/["\\]/g, '\\$&')}$2`,
    );
    report.descriptionFixed = true;
  }
  if (!found.length) {
    const changed = out !== html;
    if (changed && WRITE) fs.writeFileSync(file, out);
    return { report, changed };
  }

  const kwRe = /(<meta\s+name="keywords"\s+content=")([^"]*)("[^>]*>)/i;
  const m = out.match(kwRe);
  const existing = m ? decode(m[2]).split(',') : [];
  const merged = mergeKeywords(existing, found);
  report.added = merged.filter(
    (k) => !existing.map((e) => e.trim().toLowerCase()).includes(k.toLowerCase()),
  );
  if (m) {
    out = out.replace(kwRe, `$1${escAttr(merged.join(', '))}$3`);
  } else {
    const descRe = /(\n([ \t]*)<meta\s+name="description"[\s\S]*?\/?>)/i;
    const d = out.match(descRe);
    const indent = d ? d[2] : '    ';
    const tag = `\n${indent}<meta name="keywords" content="${escAttr(merged.join(', '))}" />`;
    out = d ? out.replace(descRe, `$1${tag}`) : out.replace(/<\/title>/i, `</title>${tag}`);
  }

  // article:tag block — replaced wholesale between markers. Dictionary terms found in the post
  // come first; hand-written keywords only fill the remaining slots.
  const tags = mergeKeywords(found, existing).slice(0, MAX_ARTICLE_TAGS);
  out = out.replace(/\n[ \t]*<!-- seo-tags -->[\s\S]*?<!-- \/seo-tags -->/, '');
  const kwLine = out.match(/\n([ \t]*)<meta\s+name="keywords"[^>]*>/i);
  const ind = kwLine ? kwLine[1] : '    ';
  const block =
    `\n${ind}<!-- seo-tags -->` +
    tags.map((t) => `\n${ind}<meta property="article:tag" content="${escAttr(t)}" />`).join('') +
    `\n${ind}<!-- /seo-tags -->`;
  out = out.replace(/(\n[ \t]*<meta\s+name="keywords"[^>]*>)/i, `$1${block}`);

  // JSON-LD keywords on the Article object (single-line array; headline line is the anchor).
  const ldKw = JSON.stringify(merged);
  if (!/"@type"\s*:\s*"(Article|BlogPosting)"/.test(out)) {
    // No Article JSON-LD yet: create a minimal one from what the page already states.
    const meta = (re) => decode((out.match(re) || [])[1] || '').trim();
    const h1 = decode(
      ((out.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '').replace(/<[^>]+>/g, ''),
    )
      .replace(/\s+/g, ' ')
      .trim();
    if (h1) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: h1,
        keywords: merged,
        inLanguage: L,
      };
      const desc = meta(/<meta\s+name="description"\s+content="([^"]*)"/i);
      const author = meta(/<meta\s+name="author"\s+content="([^"]*)"/i);
      const date =
        meta(/<meta\s+property="article:published_time"\s+content="([^"]*)"/i) ||
        meta(/<meta\s+name="date"\s+content="([^"]*)"/i);
      const canonical = meta(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
      if (desc) ld.description = desc;
      if (author) ld.author = { '@type': 'Person', name: author };
      if (date) ld.datePublished = date;
      if (canonical) ld.mainEntityOfPage = canonical;
      ld.publisher = { '@type': 'Organization', name: 'OneLifetime.World' };
      const json = JSON.stringify(ld).replace(/</g, '\\u003c');
      out = out.replace(
        /(\n?[ \t]*)<\/head>/i,
        `\n    <script type="application/ld+json">${json}</script>$1</head>`,
      );
      report.ldCreated = true;
    } else {
      report.ldMissing = true;
    }
  } else {
    if (/"keywords"\s*:\s*\[[^\]]*\]/.test(out)) {
      out = out.replace(/("keywords"\s*:\s*)\[[^\]]*\]/, (_, k) => k + ldKw);
    } else if (/"keywords"\s*:\s*"[^"]*"/.test(out)) {
      out = out.replace(/"keywords"\s*:\s*"[^"]*"/, `"keywords": ${ldKw}`);
    } else {
      out = out.replace(
        /(\n([ \t]*)"headline"\s*:\s*"(?:[^"\\]|\\.)*",)/,
        `$1\n$2"keywords": ${ldKw},`,
      );
    }
  }

  const changed = out !== html;
  if (changed && WRITE) fs.writeFileSync(file, out);
  return { report, changed };
}

const files = fileArgs.length
  ? fileArgs.map((f) => path.resolve(ROOT, f))
  : POST_DIRS.flatMap((d) =>
      fs
        .readdirSync(path.join(ROOT, d))
        .filter((f) => f.endsWith('.html') && f !== 'index.html')
        .map((f) => path.join(ROOT, d, f)),
    );

// Headlines used by several posts with different titles = copy-paste drift.
const headlineTitles = new Map();
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const hl = decode(
    unJson((h.match(/"headline"\s*:\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || ''),
  ).trim();
  const ti = decode((h.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '').trim();
  if (hl) headlineTitles.set(hl, (headlineTitles.get(hl) || new Set()).add(ti));
}
const DUP_HEADLINES = new Set(
  [...headlineTitles].filter(([, titles]) => titles.size > 1).map(([hl]) => hl),
);

const descMetas = new Map();
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const ld = decode(
    unJson((h.match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || ''),
  ).trim();
  const md = decode(
    (h.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || '',
  ).trim();
  if (ld) descMetas.set(ld, (descMetas.get(ld) || new Set()).add(md));
}
const DUP_DESCRIPTIONS = new Set(
  [...descMetas].filter(([, metas]) => metas.size > 1).map(([ld]) => ld),
);

const results = files.map(processFile);
const changed = results.filter((r) => r.changed);
const mismatches = results.filter((r) => r.report.headlineMismatch);

if (JSON_OUT) {
  console.log(
    JSON.stringify(
      {
        files: results.length,
        changed: changed.length,
        results: results.map((r) => ({ ...r.report, changed: r.changed })),
      },
      null,
      2,
    ),
  );
} else {
  for (const r of changed)
    console.log(
      `${WRITE ? 'updated' : 'pending'} ${r.report.file} +[${r.report.added.join(', ')}]`,
    );
  for (const r of results.filter((x) => x.report.headlineFixed))
    console.log(`headline fixed ${r.report.file} -> ${r.report.headlineFixed}`);
  for (const r of mismatches.filter((x) => !x.report.headlineFixed))
    console.log(
      `headline≠title ${r.report.file}\n  title:    ${r.report.headlineMismatch.title}\n  headline: ${r.report.headlineMismatch.headline}`,
    );
  console.log(
    `${results.length} posts, ${changed.length} ${WRITE ? 'updated' : 'pending'}, ${mismatches.length} headline mismatches`,
  );
}
if (!WRITE && changed.length) process.exitCode = 1;
