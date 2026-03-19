#!/usr/bin/env node
/**
 * DWS Thesis HTML Generator v2.0
 *
 * Converts thesis Markdown → versioned HTML in Learn/
 *
 * RULE: Every generated HTML MUST display the version number visibly
 * as a badge at the top of the document. Version is auto-extracted
 * from the "Version: X.X" line in the VERSION AND AGENT HISTORY block.
 *
 * Output filename is auto-derived from the version so no manual updates
 * are needed when the version number increments.
 *
 * Usage:
 *   node scripts/gen-thesis-html.cjs
 *
 * v1.0 — Initial release
 * v2.0 — 2026-03-02: Auto-detect version from markdown; visible version
 *         badge injected at top of every HTML output; auto-derived filenames
 */

const fs   = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname, '..');

const CSS = `
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:900px;margin:0 auto;padding:0 20px 40px;line-height:1.7;color:#1a1a2e;background:#fafafa}
h1{color:#0f172a;border-bottom:3px solid #fbbf24;padding-bottom:10px}
h2{color:#1e3a5f;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:40px}
h3{color:#334155}h4{color:#475569}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:.9em}
pre{background:#1e293b;color:#e2e8f0;padding:16px;border-radius:8px;overflow-x:auto}
pre code{background:none;color:inherit}
table{border-collapse:collapse;width:100%;margin:20px 0}
th,td{border:1px solid #cbd5e1;padding:10px 14px;text-align:left}
th{background:#1e3a5f;color:white}tr:nth-child(even){background:#f8fafc}
blockquote{border-left:4px solid #fbbf24;margin:20px 0;padding:10px 20px;background:#fffbeb}
a{color:#2563eb}strong{color:#0f172a}li{margin:4px 0}
/* Version badge header */
.dws-version-banner{background:#1e293b;color:#e2e8f0;padding:12px 20px;margin:-0px -20px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:.85rem}
.dws-version-badge{background:#fbbf24;color:#0f172a;font-weight:700;padding:4px 12px;border-radius:20px;font-size:.9rem;letter-spacing:.04em}
.dws-version-meta{color:#94a3b8;font-size:.8rem}
.dws-version-title{color:#e2e8f0;font-weight:600}
`.trim();

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/**
 * Extract version string from "Version: X.X" line in VERSION AND AGENT HISTORY block.
 * Returns e.g. "3.17" or "1.7"
 */
function extractVersion(md) {
  // Match "Version: X.X" with optional markdown formatting (bold, blockquote prefix)
  const m = md.match(/^\s*>?\s*\*{0,2}Version:?\*{0,2}\s*(\S+)/m);
  return m ? m[1] : 'unknown';
}

/**
 * Extract the latest session date from the first "- Version: X.X | ... | Date: DD.MM.YYYY" line.
 */
function extractDate(md) {
  const m = md.match(/Date:\s*(\d{2}\.\d{2}\.\d{4})/);
  return m ? m[1] : '';
}

function mdToHtml(md, titleBase, lang, version, date) {
  let html = md;
  // Stash fenced code blocks
  const codeBlocks = [];
  html = html.replace(/```([\s\S]*?)```/g, (_, inner) => {
    const idx = codeBlocks.length;
    const stripped = inner.replace(/^[a-z]*\n/, '');
    codeBlocks.push('<pre><code>' + escHtml(stripped) + '</code></pre>');
    return '___CODE' + idx + '___';
  });
  // Tables
  html = html.replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/g, (_, header, rows) => {
    const th = header.split('|').filter(c => c.trim()).map(c => '<th>' + c.trim() + '</th>').join('');
    const trs = rows.trim().split('\n').map(r =>
      '<tr>' + r.split('|').filter(c => c.trim()).map(c => '<td>' + c.trim() + '</td>').join('') + '</tr>'
    ).join('');
    return '<table><thead><tr>' + th + '</tr></thead><tbody>' + trs + '</tbody></table>\n';
  });
  // Headings
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  // Bold, italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Lists
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  // HR
  html = html.replace(/^---+$/gm, '<hr />');
  // Restore code blocks
  codeBlocks.forEach((cb, i) => { html = html.replace('___CODE' + i + '___', cb); });
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Paragraphs (double newline)
  html = html.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<')) return p;
    return '<p>' + p.replace(/\n/g, ' ') + '</p>';
  }).join('\n');

  const fullTitle = titleBase + ' v' + version;

  // Visible version badge banner — RULE: every Learn/ HTML must show this
  const banner = [
    '<div class="dws-version-banner">',
    '  <span class="dws-version-title">' + escHtml(titleBase) + '</span>',
    '  <span class="dws-version-badge">v' + escHtml(version) + '</span>',
    '  <span class="dws-version-meta">Lifetime Oy · ' + (date || '') + ' · Learn/ (private)</span>',
    '</div>',
  ].join('\n');

  return [
    '<!DOCTYPE html>',
    '<html lang="' + lang + '">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>' + escHtml(fullTitle) + '</title>',
    '<style>',
    CSS,
    '</style>',
    '</head>',
    '<body>',
    banner,
    html,
    '</body>',
    '</html>',
  ].join('\n');
}

// Source files — version and output filename are auto-derived from the markdown
const SOURCES = [
  {
    src:       'Learn/V3Thesis_EN.md',
    titleBase: 'Firehorse Product Manufacturing Operating Model — V3 Thesis (EN)',
    outPrefix: 'Learn/V3Thesis_EN_v',
    lang:      'en',
  },
  {
    src:       'Learn/V3Thesis_FI.md',
    titleBase: 'Firehorse-tuotevalmistuksen toimintamalli — V3 Opinnäytetyö (FI)',
    outPrefix: 'Learn/V3Thesis_FI_v',
    lang:      'fi',
  },
  {
    src:       'Learn/PHD_FIREHORSE_EN.md',
    titleBase: 'PHD Firehorse — Doctoral Research (EN)',
    outPrefix: 'Learn/PHD_FIREHORSE_EN_v',
    lang:      'en',
  },
  {
    src:       'Learn/PHD_FIREHORSE_FI.md',
    titleBase: 'PHD Firehorse — Väitöstutkimus (FI)',
    outPrefix: 'Learn/PHD_FIREHORSE_FI_v',
    lang:      'fi',
  },
  {
    src:       'Learn/DWS7_ROADMAP.md',
    titleBase: 'DWS7 Roadmap — From Pilot to 16 Paying Industrial Customers',
    outPrefix: 'Learn/DWS7_ROADMAP_v',
    lang:      'en',
  },
];

SOURCES.forEach(f => {
  const md      = fs.readFileSync(path.join(BASE, f.src), 'utf8');
  const version = extractVersion(md);
  const date    = extractDate(md);
  const outFile = f.outPrefix + version + '.html';
  const htm     = mdToHtml(md, f.titleBase, f.lang, version, date);
  fs.writeFileSync(path.join(BASE, outFile), htm);
  console.log('Generated:', outFile, '(v' + version + ', ' + htm.length + ' bytes)');
});
