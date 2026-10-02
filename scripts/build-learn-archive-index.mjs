#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude-opus-5 Agent=Claude Code Date=2026-09-24
// Audit trail: git log -- scripts/build-learn-archive-index.mjs

/**
 * Rebuilds the "Arkistoidut versiot" section of Learn/start.html.
 *
 * Superseded theses move into Learn/Arkisto/ and Learn/Archive/ on every
 * version bump — 222 files that the hub page listed only as two bare folder
 * links, so an older version was reachable only by guessing its filename.
 * CLAUDE.md forbids deleting old renders; this makes them findable.
 *
 * Regenerate after any version bump:  npm run learn:archive-index
 * Content between the markers is generated — edit this script, not the HTML.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const LEARN = join(process.cwd(), 'Learn');
const START = join(LEARN, 'start.html');
const BEGIN = '<!-- ARCHIVE_INDEX_START -->';
const END = '<!-- ARCHIVE_INDEX_END -->';

const ARCHIVE_DIRS = [
  { dir: 'Arkisto', label: 'Arkisto', note: 'Theses superseded by a newer version' },
  { dir: 'Archive', label: 'Archive', note: 'Earlier renders and retired documents' },
];

/** "V3Thesis_EN_v3.70.html" → family "V3Thesis_EN", version "3.70". */
function parseName(file) {
  const stem = file.replace(/\.[^.]+$/, '');
  const m = /^(.*?)_v([\d.]+)$/.exec(stem);
  return m ? { family: m[1], version: m[2] } : { family: stem, version: null };
}

/** Newest first, comparing version numbers segment by segment. */
function byVersionDesc(a, b) {
  const pa = (a.version ?? '0').split('.').map(Number);
  const pb = (b.version ?? '0').split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const d = (pb[i] ?? 0) - (pa[i] ?? 0);
    if (d !== 0) return d;
  }
  return a.file.localeCompare(b.file);
}

function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const blocks = [];
let total = 0;

for (const { dir, label, note } of ARCHIVE_DIRS) {
  const full = join(LEARN, dir);
  if (!existsSync(full)) continue;

  const files = readdirSync(full).filter((f) => !f.startsWith('.'));
  total += files.length;

  const families = new Map();
  for (const file of files) {
    const { family, version } = parseName(file);
    if (!families.has(family)) families.set(family, []);
    families.get(family).push({ file, version });
  }

  const famHtml = [...families.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([family, entries]) => {
      entries.sort(byVersionDesc);
      const items = entries
        .map(
          (e) =>
            `          <li><a href="${dir}/${encodeURI(e.file)}">${esc(e.version ? `v${e.version}` : e.file)}</a></li>`,
        )
        .join('\n');
      return [
        `      <details>`,
        `        <summary><strong>${esc(family)}</strong> — ${entries.length} version(s)</summary>`,
        `        <ul>`,
        items,
        `        </ul>`,
        `      </details>`,
      ].join('\n');
    })
    .join('\n');

  blocks.push(
    [
      `    <h3><a href="${dir}/">${esc(label)}/</a> — ${files.length} tiedostoa</h3>`,
      `    <p class="muted">${esc(note)}.</p>`,
      famHtml,
    ].join('\n'),
  );
}

const section = [
  BEGIN,
  `    <h2>🗄️ Arkistoidut versiot — Archived Versions (${total} kpl)</h2>`,
  `    <p>`,
  `      Every superseded render is kept, never deleted. Newest version first within each`,
  `      document. The current version of each document is listed further up this page.`,
  `    </p>`,
  ...blocks,
  END,
].join('\n');

let html = readFileSync(START, 'utf8');

if (html.includes(BEGIN) && html.includes(END)) {
  const head = html.slice(0, html.indexOf(BEGIN));
  const tail = html.slice(html.indexOf(END) + END.length);
  html = head + section + tail;
} else {
  // First run: place it before the closing body so it reads as a trailing appendix.
  html = html.replace(/(\s*)<\/body>/, `\n\n${section}\n$1</body>`);
}

writeFileSync(START, html);
console.log(
  `Archive index rebuilt — ${total} archived file(s) across ${ARCHIVE_DIRS.length} folder(s).`,
);
