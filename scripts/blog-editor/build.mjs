#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic Agent=blog-editor Date=2026-09-28
// Audit trail: git log -- scripts/blog-editor/build.mjs
/**
 * Build the Blog editor artifact (a private claude.ai page the HIC opens on the iPhone).
 *
 *   npx tsx scripts/blog-editor/build.mjs <out-dir>
 *
 * Writes <out-dir>/index.html (from page.html), <out-dir>/learn/ (latest version of each Learn/
 * document the access policy classes public / user / customer / internal — confidential and
 * unclassified documents are never copied) and <out-dir>/drafts-seed.json (docs/blog-drafts/*.md
 * as rows for the page's `drafts` collection, each with the git hash it was seeded from),
 * <out-dir>/dictionary-seo.json and <out-dir>/posts-index.json (for the BLOG_STANDARD §16 checks).
 * Claude publishes the directory and seeds the rows; edits come back with apply-edits.mjs.
 */
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyDocument } from '../../src/services/document-access.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = resolve(process.argv[2] ?? '');
if (!process.argv[2]) {
  console.error('usage: npx tsx scripts/blog-editor/build.mjs <out-dir>');
  process.exit(2);
}
const ALLOWED = new Set(['public', 'user', 'customer', 'internal']);
const sha = (s) => createHash('sha256').update(s).digest('hex');

mkdirSync(join(out, 'learn'), { recursive: true });
copyFileSync(join(ROOT, 'scripts/blog-editor/page.html'), join(out, 'index.html'));

// Learn: newest version of each document, allowed classes only.
const version = (f) => (f.match(/_v(\d+(?:\.\d+)*)\.html$/)?.[1] ?? '0').split('.').map(Number);
const newer = (a, b) => {
  const x = version(a);
  const y = version(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++)
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) > (y[i] ?? 0);
  return false;
};
const latest = new Map();
for (const f of readdirSync(join(ROOT, 'Learn')).filter((f) => f.endsWith('.html'))) {
  const base = f.replace(/_v\d+(\.\d+)*\.html$/, '').replace(/\.html$/, '');
  if (!latest.has(base) || newer(f, latest.get(base))) latest.set(base, f);
}
const docs = [];
let withheld = 0;
for (const f of latest.values()) {
  const cls = classifyDocument(`Learn/${f}`).class;
  if (!ALLOWED.has(cls)) {
    withheld++;
    continue;
  }
  const html = readFileSync(join(ROOT, 'Learn', f), 'utf8');
  const title = (html.match(/<title>([^<]{1,200})<\/title>/i)?.[1] ?? f).trim();
  copyFileSync(join(ROOT, 'Learn', f), join(out, 'learn', f));
  docs.push({
    file: f,
    title,
    class: cls,
    kb: Math.round(statSync(join(ROOT, 'Learn', f)).size / 1024),
  });
}
docs.sort((a, b) => a.title.localeCompare(b.title));
writeFileSync(
  join(out, 'learn', 'manifest.json'),
  JSON.stringify({ built: new Date().toISOString().slice(0, 10), withheld, docs }, null, 1),
);

// Drafts: rows for the page's `drafts` collection.
const frontMatter = (text) => {
  const fm = {};
  for (const line of (text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '').split('\n')) {
    const kv = line.match(/^([A-Za-z_]+):\s*"?(.*?)"?\s*$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return fm;
};
const draftDir = join(ROOT, 'docs/blog-drafts');
const rows = readdirSync(draftDir)
  .filter((n) => /^[A-Za-z0-9._-]+\.md$/.test(n))
  .map((name) => {
    const content = readFileSync(join(draftDir, name), 'utf8');
    const fm = frontMatter(content);
    return {
      id: name,
      data: {
        name,
        title: fm.title || name,
        lang: fm.lang || '',
        date: fm.date || '',
        content,
        baseHash: sha(content),
        rev: 0,
        edited: false,
      },
    };
  });
writeFileSync(join(out, 'drafts-seed.json'), JSON.stringify(rows));

// BLOG_STANDARD §16 checks in the page: the SEO vocabulary (dictionary terms with seo: true and
// their ontology binding) and the published post file names (which language variants exist).
const dict = JSON.parse(readFileSync(join(ROOT, 'docs/localization/dws-dictionary.json'), 'utf8'));
const seo = {};
for (const [key, e] of Object.entries(dict.shared ?? {}))
  if (e?.seo)
    seo[key] = {
      en: e.en,
      fi: e.fi,
      sv: e.sv,
      de: e.de,
      fr: e.fr,
      ontologyId: e.ontologyId ?? 'none',
    };
writeFileSync(join(out, 'dictionary-seo.json'), JSON.stringify(seo));
const posts = readdirSync(join(ROOT, 'onelifetime.world/posts')).filter(
  (f) => f.endsWith('.html') && !f.startsWith('_'),
);
writeFileSync(join(out, 'posts-index.json'), JSON.stringify(posts));

console.log(
  `blog-editor build: ${docs.length} Learn documents (${withheld} withheld by the access policy), ${rows.length} drafts → ${out}`,
);
