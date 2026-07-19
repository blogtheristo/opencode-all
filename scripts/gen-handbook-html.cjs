#!/usr/bin/env node
/**
 * gen-handbook-html.cjs — Regenerate the branded handbook HTML from the canonical Markdown.
 *
 * Source of truth: docs/KONSULTOINNIN_KASIKIRJA_2026.md
 * Output:          docs/Konsultoinnin_kasikirja_2026.html
 *
 * Reuses the existing <style> brand shell from the current HTML so the look stays identical;
 * the body is regenerated from the Markdown so content can never drift again.
 *
 * Usage: node scripts/gen-handbook-html.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MD = path.join(ROOT, 'docs/KONSULTOINNIN_KASIKIRJA_2026.md');
const HTML = path.join(ROOT, 'docs/Konsultoinnin_kasikirja_2026.html');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Inline: **bold**, _italic_, `code`, [text](url) — applied after escaping.
function inline(text) {
  let t = esc(text);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => `<a href="${url}">${label}</a>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/(^|[\s(])_([^_]+)_/g, '$1<em>$2</em>');
  return t;
}

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function mdToBody(md) {
  // Strip the VERSION AND AGENT HISTORY block + leading title; render the rest.
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  let para = [];
  let list = null; // {type:'ul'|'ol', items:[]}
  let inQuote = [];

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(' '))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      out.push(`<${list.type}>`);
      for (const it of list.items) out.push(`<li>${inline(it)}</li>`);
      out.push(`</${list.type}>`);
      list = null;
    }
  };
  const flushQuote = () => {
    if (inQuote.length) {
      out.push(`<blockquote>${inQuote.map((l) => inline(l)).join('<br />')}</blockquote>`);
      inQuote = [];
    }
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushQuote();
  };

  for (; i < lines.length; i++) {
    const line = lines[i];
    const raw = line.replace(/\s+$/, '');

    if (/^#{1,6}\s/.test(raw)) {
      flushAll();
      const level = raw.match(/^#+/)[0].length;
      const text = raw.replace(/^#+\s/, '');
      if (level === 1) {
        out.push(`<h1>${inline(text)}</h1>`);
        continue;
      }
      const id = slug(text);
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      continue;
    }
    if (/^\s*[-*]{3,}\s*$/.test(raw)) {
      flushAll();
      out.push('<hr />');
      continue;
    }
    if (/^>\s?/.test(raw)) {
      flushPara();
      flushList();
      inQuote.push(raw.replace(/^>\s?/, ''));
      continue;
    }
    if (/^\s*[-*]\s+/.test(raw)) {
      flushPara();
      flushQuote();
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(raw.replace(/^\s*[-*]\s+/, ''));
      continue;
    }
    if (/^\s*\d+\.\s+/.test(raw)) {
      flushPara();
      flushQuote();
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(raw.replace(/^\s*\d+\.\s+/, ''));
      continue;
    }
    if (raw.trim() === '') {
      flushAll();
      continue;
    }
    // plain paragraph line (also handles **key:** value lines)
    flushList();
    flushQuote();
    para.push(raw.trim());
  }
  flushAll();
  return out.join('\n      ');
}

// Elegant 2024 Konsultin käsikirja stylesheet (from Learn/D_Konsultin_Kasikirja.html),
// extended for the 2026 edition: gold accents, navy headers, styled tables/blockquotes.
const STYLE_2024 = `<style>
      body {
        font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px 60px;
        line-height: 1.7;
        color: #1a1a2e;
        background: #fafafa;
      }
      h1 { color: #0f172a; border-bottom: 3px solid #fbbf24; padding-bottom: 10px; }
      h2 { color: #1e3a5f; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 44px; }
      h3 { color: #334155; margin-top: 28px; }
      h4 { color: #475569; }
      code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
      pre { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; }
      pre code { background: none; color: inherit; }
      table { border-collapse: collapse; width: 100%; margin: 20px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background: #1e3a5f; color: white; }
      tr:nth-child(even) { background: #f8fafc; }
      blockquote {
        border-left: 4px solid #fbbf24;
        margin: 20px 0;
        padding: 10px 20px;
        background: #fffbeb;
        color: #334155;
      }
      a { color: #2563eb; }
      strong { color: #0f172a; }
      li { margin: 4px 0; }
      hr { border: none; border-top: 1px solid #e2e8f0; margin: 32px 0; }
      .dws-version-banner {
        background: #1e293b;
        color: #e2e8f0;
        padding: 14px 24px;
        margin: 0 -20px 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 0.85rem;
      }
      .dws-version-badge {
        background: #fbbf24;
        color: #0f172a;
        font-weight: 700;
        padding: 4px 14px;
        border-radius: 20px;
        font-size: 0.9rem;
        letter-spacing: 0.04em;
      }
      .dws-version-meta { color: #94a3b8; font-size: 0.8rem; }
      .dws-version-title { color: #e2e8f0; font-weight: 600; }
      .doc-subtitle { color: #64748b; font-size: 1.05rem; margin: -4px 0 24px; font-weight: 500; }
    </style>`;

function main() {
  const md = fs.readFileSync(MD, 'utf8');

  // Pull current version from the MD header.
  const ver = (md.match(/^Version:\s*([\d.]+)/m) || [, '1.71'])[1];

  // Drop the title + VERSION block from the body source: start rendering at "## Sisällysluettelo".
  const tocIdx = md.indexOf('## Sisällysluettelo');
  const bodyMd = tocIdx >= 0 ? md.slice(tocIdx) : md;
  const body = mdToBody(bodyMd);

  const doc = `<!doctype html>
<html lang="fi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Konsultoinnin käsikirja 2026 — Lifetime Oy</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    ${STYLE_2024}
  </head>
  <body>
    <div class="dws-version-banner">
      <span class="dws-version-title">Konsultoinnin käsikirja 2026 — Consultancy Excellence Handbook</span>
      <span class="dws-version-badge">v${ver}</span>
      <span class="dws-version-meta">Lifetime Oy · Risto Anton Päärni · 28.06.2026</span>
    </div>
    <h1>Konsultoinnin käsikirja 2026</h1>
    <div class="doc-subtitle">Consultancy Excellence Handbook 2026</div>
    ${body}
  </body>
</html>
`;

  fs.writeFileSync(HTML, doc, 'utf8');
  console.log(`Regenerated ${path.relative(ROOT, HTML)} from v${ver} Markdown (2024 design).`);
}

main();
