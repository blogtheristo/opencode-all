#!/usr/bin/env node
// Evidence: Tool=Claude Code Agent=claude Date=2026-09-24
// Audit trail: git log -- scripts/blog/build-post-from-draft.mjs
/**
 * Builds a Lifetime Scope Journal post (root-level onelifetime.world/posts/<slug>.<lang>.html)
 * from an HIC-approved draft in docs/blog-drafts/<slug>.<lang>.md, using an existing house
 * post as the layout template, and syncs the landing-pages mirror.
 *
 *   node scripts/blog/build-post-from-draft.mjs docs/blog-drafts/<slug>.fi.md
 *
 * Refuses unless the draft front matter says `Status: APPROVED` (Rule 13). Registry (§3),
 * latestPosts and the injector array are separate, deliberate edits.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const draftPath = process.argv[2];
if (!draftPath) {
  console.error('usage: build-post-from-draft.mjs <draft.md>');
  process.exit(2);
}
const md = readFileSync(draftPath, 'utf8');
const fm = Object.fromEntries(
  [...md.split('---')[1].matchAll(/^([A-Za-z_]+):\s*"?(.*?)"?\s*$/gm)].map((m) => [m[1], m[2]]),
);
if (fm.Status !== 'APPROVED') {
  console.error(`refused: ${draftPath} is ${fm.Status}, not APPROVED (Rule 13)`);
  process.exit(1);
}
const lang = fm.lang || 'fi';
const slug = `${fm.slug}.${lang}`;
const title = fm.title,
  subtitle = fm.subtitle || '';
const desc = (fm.description || `${subtitle}. ${fm.series || ''}`).trim();
const date = fm.date;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/→ ([a-z0-9.]+\.(?:fi|com)\b)/g, (m, d) => `→ <a href="https://${d}/">${d}</a>`);

const body = md.split('---').slice(2).join('---').trim().split('\n');
const out = [];
let buf = [];
const flush = () => {
  const t = buf.join(' ').trim();
  if (t)
    out.push(
      t.startsWith('_') && t.endsWith('_')
        ? `<p><em>${inline(t.slice(1, -1))}</em></p>`
        : `<p>${inline(t)}</p>`,
    );
  buf = [];
};
for (const l of body) {
  if (l.startsWith('# ') || l.startsWith('### ')) continue;
  if (l.startsWith('## ')) {
    flush();
    out.push(`<h2>${esc(l.slice(3).trim())}</h2>`);
    continue;
  }
  if (l.trim() === '---' || !l.trim()) {
    flush();
    continue;
  }
  buf.push(l.trim());
}
flush();

const tpl = readFileSync('onelifetime.world/posts/dws-iq-resilience-on-build.fi.html', 'utf8');
let s = tpl;
s = s.replace(
  /<!--[\s\S]*?-->/,
  `<!--\n  ${title}\n  Language: ${lang}\n  Slug: ${slug}\n  Date: ${date}\n  Owner: Lifetime Oy\n  Note: ${fm.series || 'Lifetime Scope Journal'}. HIC-approved ${fm.approved_at || date} (blog-draft gate).\n-->`,
);
s = s.split('DWS IQ 6 — Jatkuvuus rakennusvaiheessa').join(title);
s = s.replace(
  /<meta name="description" content="[^"]*" \/>/,
  `<meta name="description" content="${esc(desc)}" />`,
);
s = s.replace(
  /<meta property="og:description" content="[^"]*" \/>/,
  `<meta property="og:description" content="${esc(desc)}" />`,
);
s = s.replace(
  /<meta name="twitter:description" content="[^"]*" \/>/,
  `<meta name="twitter:description" content="${esc(desc)}" />`,
);
s = s.replace(
  /<meta name="keywords" content="[^"]*" \/>/,
  '<meta name="keywords" content="One Lifetime, Ihmisen johtamisvalta (HIC), Lifetime World Model (LWM)" />',
);
s = s.replace(
  /<!-- seo-tags -->[\s\S]*?<!-- \/seo-tags -->/,
  '<!-- seo-tags -->\n    <meta property="article:tag" content="One Lifetime" />\n    <meta property="article:tag" content="Ihmisen johtamisvalta (HIC)" />\n    <meta property="article:tag" content="Lifetime World Model (LWM)" />\n    <!-- /seo-tags -->',
);
s = s
  .split('content="2026-08-20"')
  .join(`content="${date}"`)
  .split('"datePublished":"2026-08-20"')
  .join(`"datePublished":"${date}"`);
s = s
  .split('Risto Päärni')
  .join('Risto Anton Päärni')
  .split('Risto P&auml;&auml;rni')
  .join('Risto Anton P&auml;&auml;rni');
s = s.replace('content="Suvereeni teknologia"', 'content="One Lifetime"');
s = s.split('dws-iq-resilience-on-build.fi.html').join(`${slug}.html`);
s = s.replace(/ {4}<link rel="alternate" hreflang="(en|sv|de|fr)" href="[^"]*" \/>\n/g, '');
s = s.replace(
  /<link rel="alternate" hreflang="x-default" href="[^"]*" \/>/,
  `<link rel="alternate" hreflang="x-default" href="https://onelifetime.world/posts/${slug}.html" />`,
);
s = s.replace(
  /<script type="application\/ld\+json">\{[\s\S]*?\}<\/script>/,
  '<script type="application/ld+json">' +
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      keywords: ['One Lifetime', 'Ihmisen johtamisvalta (HIC)', 'Lifetime World Model (LWM)'],
      inLanguage: lang,
      description: desc,
      author: { '@type': 'Person', name: 'Risto Anton Päärni' },
      datePublished: date,
      mainEntityOfPage: `https://onelifetime.world/posts/${slug}.html`,
      publisher: { '@type': 'Organization', name: 'OneLifetime.World' },
    }) +
    '</script>',
);
s = s.replace(
  '<span class="version-chip">Kenttämuistio</span>',
  `<span class="version-chip">${esc(fm.series || 'Lifetime Scope Journal')}</span>`,
);
s = s.replace('20.08.2026 &middot;', `${date.split('-').reverse().join('.')} &middot;`);
s = s.replace(
  '<strong style="color:#f1f5f9">HIC-hyväksytty kenttämuistio</strong>',
  '<strong style="color:#f1f5f9">HIC-hyväksytty teksti</strong>',
);
s = s.replace(/\s*<figure class="hero-fig">[\s\S]*?<\/figure>\n/, '\n');
const a = s.indexOf('<h2>Ydin</h2>');
const b = s.indexOf('        <p style="margin-top:40px;"><em>Risto');
s =
  s.slice(0, a) +
  (subtitle ? `<p class="mt-2 text-lg" style="color:#94a3b8">${esc(subtitle)}</p>\n` : '') +
  out.join('\n') +
  '\n\n' +
  s.slice(b);
s = s.replace(
  'Perustaja &amp; toimitusjohtaja, Lifetime Oy.',
  'Founder, CEO &middot; Lifetime Oy &middot; risto.paarni@lifetime.fi &middot; +358 400 319 010',
);
for (const base of ['onelifetime.world', 'landing-pages/onelifetime-world'])
  writeFileSync(`${base}/posts/${slug}.html`, s);
console.log(`wrote posts/${slug}.html (${out.length} blocks) to both folders`);
