#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude-opus-5 Agent=Claude Code Date=2026-09-24
// Audit trail: git log -- scripts/check-learn-links.mjs

/**
 * Fails when a Learn/ hub page links to a file that isn't there.
 *
 * The weekly housekeeping audit counts Learn/ files but never opens them, so
 * link rot was invisible: on 24.09.2026 `Learn/start.html` had 8 dead links
 * (theses archived into Arkisto/, a renamed research plan, two never-rendered
 * PHD exports) while the audit reported the folder healthy.
 *
 *   node scripts/check-learn-links.mjs            # hub pages
 *   node scripts/check-learn-links.mjs --all      # every Learn/*.html
 *
 * Exit 0 = all links resolve, 1 = dead links found.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const REPO = process.cwd();
const LEARN = join(REPO, 'Learn');

/** Entry points a human actually opens. Checked by default. */
const HUB_PAGES = ['index.html', 'start.html', 'start-hic-hub.html'];

function linksIn(file) {
  const html = readFileSync(file, 'utf8');
  return [...html.matchAll(/href="([^"#]+)"/g)]
    .map((m) => m[1])
    .filter((h) => !/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(h));
}

/**
 * Browsers percent-decode before hitting the filesystem, so a href written as
 * `Oppimisp%C3%A4iv%C3%A4kirja.html` resolves to a literal-ä filename on disk.
 * Decoding here keeps the check from reporting working links as broken.
 */
function decode(href) {
  try {
    return decodeURIComponent(href);
  } catch {
    return href;
  }
}

function checkFile(file) {
  const base = dirname(file);
  const dead = [];
  for (const href of new Set(linksIn(file))) {
    const target = resolve(base, decode(href));
    if (!existsSync(target)) dead.push(href);
  }
  return dead;
}

const all = process.argv.includes('--all');
const pages = all
  ? readdirSync(LEARN)
      .filter((f) => f.endsWith('.html'))
      .map((f) => join(LEARN, f))
  : HUB_PAGES.map((f) => join(LEARN, f)).filter(existsSync);

let deadTotal = 0;
let checked = 0;

for (const page of pages) {
  const dead = checkFile(page);
  checked += 1;
  if (dead.length > 0) {
    deadTotal += dead.length;
    console.log(`\n${relative(REPO, page)} — ${dead.length} dead link(s):`);
    for (const d of dead) console.log(`  ✗ ${d}`);
  }
}

if (deadTotal === 0) {
  console.log(`Learn/ links OK — ${checked} page(s), no dead links.`);
  process.exit(0);
}

console.log(`\n${deadTotal} dead link(s) across ${checked} page(s).`);
console.log('Theses are archived into Learn/Arkisto/ on version bump — check there first.');
process.exit(1);
