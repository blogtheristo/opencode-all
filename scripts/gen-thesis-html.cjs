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

const fs = require('fs');
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
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

function mdToHtml(md, titleBase, lang, version, date, bannerMeta) {
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
    const th = header
      .split('|')
      .filter((c) => c.trim())
      .map((c) => '<th>' + c.trim() + '</th>')
      .join('');
    const trs = rows
      .trim()
      .split('\n')
      .map(
        (r) =>
          '<tr>' +
          r
            .split('|')
            .filter((c) => c.trim())
            .map((c) => '<td>' + c.trim() + '</td>')
            .join('') +
          '</tr>',
      )
      .join('');
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
  codeBlocks.forEach((cb, i) => {
    html = html.replace('___CODE' + i + '___', cb);
  });
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Paragraphs (double newline)
  html = html
    .split('\n\n')
    .map((p) => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<')) return p;
      return '<p>' + p.replace(/\n/g, ' ') + '</p>';
    })
    .join('\n');

  const fullTitle = titleBase + ' v' + version;

  // Visible version badge banner — RULE: every Learn/ HTML must show this
  const metaText = bannerMeta || 'Lifetime Oy · ' + (date || '') + ' · Learn/ (private)';
  const banner = [
    '<div class="dws-version-banner">',
    '  <span class="dws-version-title">' + escHtml(titleBase) + '</span>',
    '  <span class="dws-version-badge">v' + escHtml(version) + '</span>',
    '  <span class="dws-version-meta">' + escHtml(metaText) + '</span>',
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

/**
 * Extract a date string from the markdown.
 *
 * Supports:
 *   - "Date: DD.MM.YYYY" (original thesis format)
 *   - ISO dates "YYYY-MM-DD" in:
 *       - Top-level header lines (e.g. "# Title — 2026-03-01")
 *       - "Updated:" / "Created:" metadata lines
 *       - Anywhere in the document as a final fallback
 *
 * @param {string} md
 * @returns {string}
 */
function extractDate(md) {
  if (typeof md !== 'string') {
    return '';
  }

  // 1) Original format: "Date: DD.MM.YYYY"
  const euDateMatch = md.match(/^Date:\s*([0-3]\d\.[0-1]\d\.\d{4})/im);
  if (euDateMatch && euDateMatch[1]) {
    return euDateMatch[1];
  }

  // 2) ISO date in top-level header, e.g. "# DWS7 Roadmap — 2026-03-01"
  const headerIsoMatch = md.match(/^#.*?\b(\d{4}-\d{2}-\d{2})\b/m);
  if (headerIsoMatch && headerIsoMatch[1]) {
    return headerIsoMatch[1];
  }

  // 3) ISO date in metadata lines like "Updated: 2026-03-01" or "Created: 2026-03-01"
  const metaIsoMatch = md.match(/^(Updated|Created)\s*:\s*(\d{4}-\d{2}-\d{2})/im);
  if (metaIsoMatch && metaIsoMatch[2]) {
    return metaIsoMatch[2];
  }

  // 4) Fallback: first ISO date anywhere in the document
  const anyIsoMatch = md.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (anyIsoMatch && anyIsoMatch[1]) {
    return anyIsoMatch[1];
  }

  return '';
}

// Source files — version and output filename are auto-derived from the markdown
// NOTE (30.07.2026): the four thesis entries below now read the CANONICAL sources in
// docs/ (the paths named by the CLAUDE.md Thesis Rule). They previously read duplicate
// copies under Learn/*.md which had drifted to v3.83 while docs/ was at v3.91 — which is
// why every regeneration silently re-emitted stale v3.83 filenames. The Learn/*.md copies
// are now orphaned and should be retired; they are left in place rather than deleted.
const SOURCES = [
  {
    src: 'docs/metropolia/master-thesis/en/V3Thesis_EN.md',
    titleBase: 'Firehorse Product Manufacturing Operating Model — V3 Thesis (EN)',
    outPrefix: 'Learn/V3Thesis_EN_v',
    lang: 'en',
  },
  {
    src: 'docs/metropolia/master-thesis/fi/V3Thesis_FI.md',
    titleBase: 'Firehorse-tuotevalmistuksen toimintamalli — V3 Opinnäytetyö (FI)',
    outPrefix: 'Learn/V3Thesis_FI_v',
    lang: 'fi',
  },
  {
    src: 'docs/PHD_FIREHORSE_EN.md',
    titleBase: 'PHD Firehorse — Doctoral Research (EN)',
    outPrefix: 'Learn/PHD_FIREHORSE_EN_v',
    lang: 'en',
  },
  {
    src: 'docs/PHD_FIREHORSE_FI.md',
    titleBase: 'PHD Firehorse — Väitöstutkimus (FI)',
    outPrefix: 'Learn/PHD_FIREHORSE_FI_v',
    lang: 'fi',
  },
  {
    src: 'Learn/Tutkimussuunnitelma_3.51.md',
    titleBase: 'Tutkimussuunnitelma 3.51 — AI-Native Compliance Infrastructure',
    outPrefix: 'Learn/Tutkimussuunnitelma_3.51_v',
    lang: 'en',
  },
  {
    src: 'docs/ASPIRE_SENSOR_MANAGEMENT_PLAN.md',
    titleBase: 'Aspire Sensor Management Plan',
    outPrefix: 'Learn/ASPIRE_SENSOR_MANAGEMENT_PLAN_v',
    lang: 'en',
  },
  {
    src: 'partners-outreach/Shufti/DPA_ADDENDUM_EU_ONLY_2026.md',
    titleBase: 'DPA Addendum — Shufti Pro (EU-Only Processing)',
    outPrefix: 'Learn/DPA_ADDENDUM_SHUFTI_EU_ONLY_2026_v',
    lang: 'en',
  },
  {
    src: 'partners-outreach/Shufti/DPA_ADDENDUM_EU_ONLY_2026.md',
    titleBase: 'DPA Addendum — Shufti Pro (EU-Only Processing)',
    outPrefix: 'partners-outreach/Shufti/DPA_ADDENDUM_EU_ONLY_2026_v',
    lang: 'en',
    bannerMeta: 'Lifetime Oy · For Shufti Pro Limited · Ready for Signature',
  },
];

SOURCES.forEach((f) => {
  const md = fs.readFileSync(path.join(BASE, f.src), 'utf8');
  const version = extractVersion(md);
  const date = extractDate(md);
  const outFile = f.outPrefix + version + '.html';
  const htm = mdToHtml(md, f.titleBase, f.lang, version, date);
  fs.writeFileSync(path.join(BASE, outFile), htm);
  console.log('Generated:', outFile, '(v' + version + ', ' + htm.length + ' bytes)');
});
