#!/usr/bin/env node
/**
 * gen-doc-html.cjs — Generic Markdown → branded HTML generator (2024 Lifetime design).
 *
 * Usage: node scripts/gen-doc-html.cjs <input.md> <output.html> ["Title"]
 *
 * Reuses the same elegant 2024 stylesheet as the handbook. Renders headings, lists,
 * blockquotes, bold/italic/code, links, hr. The VERSION AND AGENT HISTORY block is kept.
 */
const fs = require('fs');
const path = require('path');

const [, , inPath, outPath, titleArg] = process.argv;
if (!inPath || !outPath) {
  console.error('Usage: node scripts/gen-doc-html.cjs <input.md> <output.html> ["Title"]');
  process.exit(1);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(text) {
  let t = esc(text);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, l, u) => `<a href="${u}">${l}</a>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/(^|[\s(])_([^_]+)_/g, '$1<em>$2</em>');
  return t;
}
function slug(t) {
  return t
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
function mdToBody(md) {
  const lines = md.split('\n');
  const out = [];
  let para = [],
    list = null,
    inQ = [];
  const fP = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(' '))}</p>`);
      para = [];
    }
  };
  const fL = () => {
    if (list) {
      out.push(`<${list.type}>`);
      for (const it of list.items) out.push(`<li>${inline(it)}</li>`);
      out.push(`</${list.type}>`);
      list = null;
    }
  };
  const fQ = () => {
    if (inQ.length) {
      out.push(`<blockquote>${inQ.map(inline).join('<br />')}</blockquote>`);
      inQ = [];
    }
  };
  const fA = () => {
    fP();
    fL();
    fQ();
  };
  for (const line of lines) {
    const raw = line.replace(/\s+$/, '');
    if (/^#{1,6}\s/.test(raw)) {
      fA();
      const lv = raw.match(/^#+/)[0].length;
      const tx = raw.replace(/^#+\s/, '');
      if (lv === 1) out.push(`<h1>${inline(tx)}</h1>`);
      else out.push(`<h${lv} id="${slug(tx)}">${inline(tx)}</h${lv}>`);
      continue;
    }
    if (/^\s*[-*]{3,}\s*$/.test(raw)) {
      fA();
      out.push('<hr />');
      continue;
    }
    if (/^>\s?/.test(raw)) {
      fP();
      fL();
      inQ.push(raw.replace(/^>\s?/, ''));
      continue;
    }
    if (/^\s*[-*]\s+/.test(raw)) {
      fP();
      fQ();
      if (!list || list.type !== 'ul') {
        fL();
        list = { type: 'ul', items: [] };
      }
      list.items.push(raw.replace(/^\s*[-*]\s+/, ''));
      continue;
    }
    if (/^\s*\d+\.\s+/.test(raw)) {
      fP();
      fQ();
      if (!list || list.type !== 'ol') {
        fL();
        list = { type: 'ol', items: [] };
      }
      list.items.push(raw.replace(/^\s*\d+\.\s+/, ''));
      continue;
    }
    if (raw.trim() === '') {
      fA();
      continue;
    }
    fL();
    fQ();
    para.push(raw.trim());
  }
  fA();
  return out.join('\n    ');
}

const STYLE = `<style>
      body { font-family: 'Inter','Segoe UI',Tahoma,Geneva,Verdana,sans-serif; max-width: 900px; margin: 0 auto; padding: 0 20px 60px; line-height: 1.7; color: #1a1a2e; background: #fafafa; }
      h1 { color: #0f172a; border-bottom: 3px solid #fbbf24; padding-bottom: 10px; }
      h2 { color: #1e3a5f; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 40px; }
      h3 { color: #334155; margin-top: 28px; } h4 { color: #475569; }
      code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
      table { border-collapse: collapse; width: 100%; margin: 20px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background: #1e3a5f; color: white; } tr:nth-child(even) { background: #f8fafc; }
      blockquote { border-left: 4px solid #fbbf24; margin: 20px 0; padding: 10px 20px; background: #fffbeb; color: #334155; }
      a { color: #2563eb; } strong { color: #0f172a; } li { margin: 4px 0; }
      hr { border: none; border-top: 1px solid #e2e8f0; margin: 32px 0; }
      .dws-version-banner { background: #1e293b; color: #e2e8f0; padding: 14px 24px; margin: 0 -20px 36px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 0.85rem; }
      .dws-version-badge { background: #fbbf24; color: #0f172a; font-weight: 700; padding: 4px 14px; border-radius: 20px; font-size: 0.9rem; letter-spacing: 0.04em; }
      .dws-version-meta { color: #94a3b8; font-size: 0.8rem; } .dws-version-title { color: #e2e8f0; font-weight: 600; }
    </style>`;

const md = fs.readFileSync(path.resolve(inPath), 'utf8');
const ver = (md.match(/^Version:\s*([\d.]+)/m) || [, '1.0'])[1];
const h1 = (md.match(/^#\s+(.+)$/m) || [, titleArg || 'Lifetime Oy'])[1];
const body = mdToBody(md);
const doc = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(titleArg || h1)} — Lifetime Oy</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    ${STYLE}
  </head>
  <body>
    <div class="dws-version-banner">
      <span class="dws-version-title">${esc(titleArg || h1)}</span>
      <span class="dws-version-badge">v${ver}</span>
      <span class="dws-version-meta">Lifetime Oy · whitepaper</span>
    </div>
    ${body}
  </body>
</html>
`;
fs.writeFileSync(path.resolve(outPath), doc, 'utf8');
console.log(`Generated ${outPath} from ${inPath} (v${ver}).`);
