#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude-opus-5 Agent=Claude Code Date=2026-09-24
// Audit trail: git log -- scripts/fix-learn-links.mjs

/**
 * Repoints relative links in rendered Learn/ HTML at the files they mean.
 *
 * render-doc.sh runs pandoc with --embed-resources, which inlines *images* but
 * passes link hrefs through untouched. A thesis written in
 * docs/metropolia/master-thesis/en/ links to ../../../Admin/ADMIN_MANUAL.md —
 * correct there, three levels above the repo once the render lands in Learn/.
 * Every relative link in every rendered doc breaks by construction.
 *
 *   node scripts/fix-learn-links.mjs            # report only
 *   node scripts/fix-learn-links.mjs --apply    # rewrite in place
 *
 * Only rewrites a link when the intended target is found on disk. Links whose
 * target no longer exists anywhere are left alone and reported: those are
 * deleted documents, not path bugs, and guessing a replacement would be worse
 * than a visible dead link.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, basename, dirname } from 'node:path';

const REPO = process.cwd();
const LEARN = join(REPO, 'Learn');

/**
 * Pandoc was invoked with a --css pointing at the render host's temp dir, so
 * every doc rendered that way carries a <link> to a path that exists on nobody's
 * machine (and embeds a local username). It is a build artifact, not content.
 */
const DEAD_CSS = /\s*<link[^>]+href="[A-Za-z]:\/[^"]*liite_style\.css"[^>]*\/?>\s*/g;

function decode(href) {
  try {
    return decodeURIComponent(href);
  } catch {
    return href;
  }
}

/** Every file in the repo that a link could plausibly mean, by basename. */
function buildBasenameMap() {
  const map = new Map();
  const skip = new Set(['node_modules', '.git', 'dist', 'build', '.venv']);

  (function walk(dir) {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (skip.has(e.name)) continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else {
        const key = e.name;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(full);
      }
    }
  })(REPO);

  return map;
}

/**
 * Candidate real paths for a dead href, most trustworthy first. A link is only
 * rewritten when one of these exists — never on a basename guess alone when the
 * structural reading already resolved.
 */
function candidates(href, byBasename) {
  const clean = decode(href).split('?')[0];
  const out = [];

  // "../../../Admin/FOO.md" — strip the climb, read the rest from repo root.
  const climbed = clean.replace(/^(\.\.\/)+/, '');
  if (climbed !== clean) out.push(join(REPO, climbed));

  // "/docs/Document-index.md" — root-absolute in the source, not on disk.
  if (clean.startsWith('/')) out.push(join(REPO, clean.slice(1)));

  // ".claude/settings.json", "src/agents/BaseAgent.ts" — written relative to the
  // repo root by a doc that lived there.
  if (!clean.startsWith('/')) out.push(join(REPO, clean));

  // "ADMIN_MANUAL_AUDIT.md" from a doc whose source lived in Admin/.
  if (!clean.startsWith('.') && !clean.startsWith('/')) {
    out.push(join(REPO, 'Admin', clean));
  }

  // "../fi/V3Thesis_FI.md" — siblings in the source tree render flat into Learn/.
  const base = basename(clean);
  out.push(join(LEARN, base));

  // Last resort: a unique file of that name anywhere in the repo.
  const matches = byBasename.get(base) ?? [];
  if (matches.length === 1) out.push(matches[0]);

  return out;
}

const apply = process.argv.includes('--apply');
const byBasename = buildBasenameMap();

const pages = readdirSync(LEARN)
  .filter((f) => f.endsWith('.html'))
  .map((f) => join(LEARN, f));

let fixed = 0;
let stripped = 0;
const unresolved = new Map();

for (const page of pages) {
  let html = readFileSync(page, 'utf8');
  const before = html;
  const pageDir = dirname(page);

  const cssHits = html.match(DEAD_CSS);
  if (cssHits) {
    html = html.replace(DEAD_CSS, '\n');
    stripped += cssHits.length;
  }

  for (const href of new Set([...html.matchAll(/href="([^"#]+)"/g)].map((m) => m[1]))) {
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(href)) continue;
    if (/^[A-Za-z]:\//.test(href)) continue; // absolute Windows path, handled above
    if (existsSync(resolve(pageDir, decode(href)))) continue;

    const hit = candidates(href, byBasename).find((c) => {
      try {
        return existsSync(c) && statSync(c).isFile();
      } catch {
        return false;
      }
    });

    if (!hit) {
      if (!unresolved.has(href)) unresolved.set(href, new Set());
      unresolved.get(href).add(relative(REPO, page));
      continue;
    }

    const corrected = relative(pageDir, hit).split('\\').join('/');
    html = html.split(`href="${href}"`).join(`href="${corrected}"`);
    fixed += 1;
  }

  if (apply && html !== before) writeFileSync(page, html);
}

console.log(
  `${apply ? 'Rewrote' : 'Would rewrite'} ${fixed} link(s) across ${pages.length} page(s).`,
);
if (stripped > 0) {
  console.log(
    `${apply ? 'Stripped' : 'Would strip'} ${stripped} dead stylesheet link(s) to a render-host temp path.`,
  );
}

if (unresolved.size > 0) {
  console.log(
    `\n${unresolved.size} link target(s) not found anywhere — deleted documents, left as-is:`,
  );
  for (const [href, pagesSet] of [...unresolved].sort()) {
    console.log(`  ✗ ${href}  (${pagesSet.size} page(s))`);
  }
}

if (!apply) console.log('\nDry run. Re-run with --apply to write.');
