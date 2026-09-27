#!/usr/bin/env node
// Evidence: Tool=Cursor Grok 4.6 Model=Cursor Grok 4.6 Agent=cursor Date=2026-09-19
// Audit trail: git log -- scripts/i18n/stamp-generated-html-provenance.mjs
/**
 * CODE VERSIONING NOTE
 * Version: 1.0
 * Tool: Cursor Grok 4.6
 * Session: cursor/supabase-advisor-warnings-3f7a
 * Date: 19.09.2026
 * Changes: Stamp Document Standard §2.1 generated-i18n HTML comments on existing
 *          product language siblings (dws10.com + landing-pages mirror).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MARK = 'DWS_DOC_PROVENANCE generated-i18n';
const DIRS = ['dws10.com/products', 'landing-pages/dws10-com/products'];
const LANG_RE = /\.(fi|sv|de|fr)\.html$/i;

function comment(filename, lang) {
  const master = filename.replace(LANG_RE, '.html');
  return `<!--
  ${MARK}
  Standard: DWS_DOCUMENT_STANDARD.md §2.1
  lang: ${lang}
  file: ${filename}
  master: ${master}
  builder: scripts/i18n/build-i18n-pages.cjs
  date: 19.09.2026
  session: cursor/supabase-advisor-warnings-3f7a
  Note: public HTML — markdown VERSION AND AGENT HISTORY is forbidden (CLAUDE.md Rule 5).
-->
`;
}

function stamp(filePath) {
  const filename = path.basename(filePath);
  const m = filename.match(LANG_RE);
  if (!m) return false;
  const lang = m[1].toLowerCase();
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes(MARK)) return false;
  const block = comment(filename, lang);
  if (/^<!doctype html>/i.test(html)) {
    html = html.replace(/^(<!doctype html>\s*)/i, `$1${block}`);
  } else {
    html = block + html;
  }
  fs.writeFileSync(filePath, html);
  return true;
}

let n = 0;
for (const dir of DIRS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const name of fs.readdirSync(abs)) {
    if (!LANG_RE.test(name)) continue;
    if (stamp(path.join(abs, name))) n += 1;
  }
}
console.log(`stamped ${n} generated i18n product HTML files`);
