#!/usr/bin/env node
/**
 * Minimal Markdown → HTML converter for DWS thesis files.
 * Generates versioned HTML into Learn/ directory.
 */

const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname, '..');

const CSS = `
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;line-height:1.7;color:#1a1a2e;background:#fafafa}
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
`.trim();

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function mdToHtml(md, title, lang) {
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

  return [
    '<!DOCTYPE html>',
    '<html lang="' + lang + '">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>' + escHtml(title) + '</title>',
    '<style>',
    CSS,
    '</style>',
    '</head>',
    '<body>',
    html,
    '</body>',
    '</html>',
  ].join('\n');
}

const FILES = [
  {
    src:  'Learn/V3Thesis_EN.md',
    out:  'Learn/V3Thesis_EN_v3.17.html',
    title: 'Firehorse Product Manufacturing Operating Model — V3 Thesis (EN) v3.17',
    lang:  'en',
  },
  {
    src:  'Learn/V3Thesis_FI.md',
    out:  'Learn/V3Thesis_FI_v3.17.html',
    title: 'Firehorse-tuotevalmistuksen toimintamalli — V3 Opinnäytetyö (FI) v3.17',
    lang:  'fi',
  },
  {
    src:  'Learn/PHD_FIREHORSE_EN.md',
    out:  'Learn/PHD_FIREHORSE_EN_v1.7.html',
    title: 'PHD Firehorse — Doctoral Research (EN) v1.7',
    lang:  'en',
  },
  {
    src:  'Learn/PHD_FIREHORSE_FI.md',
    out:  'Learn/PHD_FIREHORSE_FI_v1.7.html',
    title: 'PHD Firehorse — Väitöstutkimus (FI) v1.7',
    lang:  'fi',
  },
];

FILES.forEach(f => {
  const md  = fs.readFileSync(path.join(BASE, f.src), 'utf8');
  const htm = mdToHtml(md, f.title, f.lang);
  fs.writeFileSync(path.join(BASE, f.out), htm);
  console.log('Generated:', f.out, '(' + htm.length + ' bytes)');
});
