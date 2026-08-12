#!/usr/bin/env node
/**
 * extract-post-draft.cjs — recover a reviewable plain-text draft from a post
 * that was published without one.
 *
 * WHY THIS EXISTS
 * Non-Negotiable Rule 13 requires every published post to have a draft in
 * docs/blog-drafts/ that the HIC can read. Posts written by generators or by
 * cron bypass the PreToolUse gate (it only sees Edit/Write), so a handful went
 * live with no draft at all. This reconstructs the artefact from the live HTML
 * so the text is reviewable in the repo and in the diff.
 *
 * WHAT IT DOES NOT DO
 * It does not mark anything APPROVED, and it must never be taught to. The
 * output is Status: PENDING-HIC-REVIEW. Approval is the HIC reading the text
 * and saying so — a script asserting it would defeat the whole gate.
 *
 * The output is an EXTRACTION of what is already live, not the original
 * authored source. Treat divergence from the post as a bug in this script.
 *
 * Usage: node scripts/extract-post-draft.cjs <post.html> [...]
 *
 * Code-Version: 1.0
 * Date: 2026-08-12
 * Owner: Lifetime Oy
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  apos: "'",
  nbsp: ' ',
  middot: '·',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  ldquo: '"',
  rdquo: '"',
  lsquo: "'",
  rsquo: "'",
  copy: '©',
  eacute: 'é',
  auml: 'ä',
  ouml: 'ö',
  aring: 'å',
  Auml: 'Ä',
  Ouml: 'Ö',
};

function decode(s) {
  return s.replace(/&(#?\w+);/g, (m, e) => (e in ENTITIES ? ENTITIES[e] : m));
}

/** Strip tags from an inline fragment, keeping the text. */
function inline(html) {
  return decode(html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n /g, '\n')
    .trim();
}

function extract(file) {
  const html = fs.readFileSync(file, 'utf8');

  const article = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (!article) throw new Error(`no <article> element in ${file}`);
  const body = article[1];

  const title = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const date = body.match(/<time[^>]*datetime="([^"]+)"/i);

  // Walk block-level elements in document order.
  const blocks = [];
  const re = /<(h[1-6]|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(body)) !== null) {
    const tag = m[1].toLowerCase();
    const text = inline(m[2]);
    if (!text) continue;
    if (tag === 'h1') continue; // already captured as the title
    if (/^©\s*\d{4}\s+Lifetime Oy/.test(text)) continue; // footer bleed

    if (tag[0] === 'h') blocks.push('#'.repeat(Number(tag[1])) + ' ' + text);
    else if (tag === 'li') blocks.push('- ' + text);
    else if (tag === 'blockquote') blocks.push('> ' + text.replace(/\n/g, '\n> '));
    else blocks.push(text);
  }

  return {
    title: title ? inline(title[1]) : path.basename(file, '.html'),
    date: date ? date[1] : '',
    blocks,
  };
}

function draftFor(file) {
  const { title, date, blocks } = extract(file);
  const rel = file.replace(/\\/g, '/');
  return (
    [
      `# ${title}`,
      '',
      'Status: PENDING-HIC-REVIEW',
      `Extracted-From: ${rel}`,
      `Extracted-On: 2026-08-12`,
      date ? `Published: ${date}` : '',
      '',
      '> This draft was reconstructed from the already-published page, because the',
      '> post went live without one (Rule 13). It is here so the text is reviewable,',
      '> NOT as evidence that it was reviewed. Read it, then either set',
      '> `Status: APPROVED` or change the post.',
      '',
      '---',
      '',
      ...blocks.flatMap((b) => [b, '']),
    ]
      .filter((l, i, a) => !(l === '' && a[i - 1] === ''))
      .join('\n')
      .trimEnd() + '\n'
  );
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: node scripts/extract-post-draft.cjs <post.html> [...]');
  process.exit(1);
}

for (const f of files) {
  const slug = path.basename(f, '.html');
  const out = path.join('docs', 'blog-drafts', `${slug}.md`);
  if (fs.existsSync(out)) {
    console.log(`skip   ${out} (already exists — not overwriting)`);
    continue;
  }
  fs.writeFileSync(out, draftFor(f), 'utf8');
  console.log(`wrote  ${out}`);
}
