#!/usr/bin/env node
// hilma-watch — parameterized tender scanner for hankintailmoitukset.fi (Hilma).
//
// Deterministic: keyword + CPV overlap drives scoring, no model in the loop (Rule 5).
// Drives a real browser via Playwright/Chromium through the agent proxy.
//
// Usage:
//   node hilma-watch.mjs [--config <path>] [--out <dir>] [--top N] [--headful]
//
// Config JSON (defaults to ./profile.json next to this script):
//   {
//     "keywords":  ["tekoäly", "julkisen hallinnon tekoäly", ...],
//     "cpvCodes":  ["80531000", "80533100", ...],
//     "regions":   ["Helsinki-Uusimaa", ...],          // optional, informational
//     "searchTerms": ["Tekoäly", "tekoälyn käyttöönotto"] // terms actually queried; defaults to keywords
//   }
//
// Output: <out>/hilma-results.json  and  <out>/hilma-results.md
// Exit non-zero on hard failure (network/egress); prints the blocked host so the
// caller can report it rather than silently returning zero notices (Rule 12).

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const hasFlag = (f) => process.argv.includes(f);

const CONFIG_PATH = resolve(arg('--config', join(__dirname, 'profile.json')));
const OUT_DIR = resolve(arg('--out', join(__dirname, 'out')));
const TOP = parseInt(arg('--top', '75'), 10);
const HEADLESS = !hasFlag('--headful');

if (!existsSync(CONFIG_PATH)) {
  console.error(`[hilma-watch] config not found: ${CONFIG_PATH}`);
  process.exit(2);
}
const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const keywords = (cfg.keywords || []).map((k) => k.toLowerCase().replace(/\*+$/, ''));
const cpvCodes = (cfg.cpvCodes || []).map(String);
const searchTerms =
  cfg.searchTerms && cfg.searchTerms.length ? cfg.searchTerms : (cfg.keywords || []).slice(0, 8);
mkdirSync(OUT_DIR, { recursive: true });

const BASE = 'https://www.hankintailmoitukset.fi/fi/search';
function searchUrl(term) {
  const p = new URLSearchParams({
    q: term,
    top: String(TOP),
    type: 'ContractNotices',
    of: 'datePublished',
    od: 'desc',
  });
  return `${BASE}?${p.toString()}`;
}

// Deterministic relevance score: keyword hits in title/context + CPV hits, normalised 0–100.
function score(notice) {
  const hay = `${notice.title} ${notice.ctx}`.toLowerCase();
  const kwHits = keywords.filter((k) => k && hay.includes(k));
  const cpvHits = cpvCodes.filter((c) => hay.includes(c));
  const raw = kwHits.length * 10 + cpvHits.length * 15;
  return {
    score: Math.min(100, raw),
    keywordHits: kwHits,
    cpvHits,
  };
}

const launchOpts = { headless: HEADLESS };
if (process.env.HTTPS_PROXY) launchOpts.proxy = { server: process.env.HTTPS_PROXY };

const browser = await chromium.launch(launchOpts).catch((e) => {
  console.error('[hilma-watch] chromium launch failed:', e.message);
  process.exit(2);
});
const ctx = await browser.newContext({
  locale: 'fi-FI',
  userAgent:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
});
const page = await ctx.newPage();

const byUrl = new Map();
let hardFail = null;

for (const term of searchTerms) {
  const url = searchUrl(term);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    try {
      await page.waitForLoadState('networkidle', { timeout: 25000 });
    } catch {}
    await page.waitForTimeout(3500);
    const found = await page.evaluate(() => {
      const out = [];
      const seen = new Set();
      document.querySelectorAll('a[href*="/public/procedure/"]').forEach((a) => {
        const href = a.href;
        if (seen.has(href)) return;
        seen.add(href);
        let c = a;
        for (let i = 0; i < 4 && c.parentElement; i++) c = c.parentElement;
        out.push({
          title: (a.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 200),
          href,
          ctx: (c.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 400),
        });
      });
      return out;
    });
    for (const n of found) {
      if (!byUrl.has(n.href)) byUrl.set(n.href, { ...n, matchedTerms: new Set() });
      byUrl.get(n.href).matchedTerms.add(term);
    }
    console.error(
      `[hilma-watch] "${term}" -> ${found.length} notices (total unique ${byUrl.size})`,
    );
  } catch (e) {
    if (/ERR_TUNNEL_CONNECTION_FAILED|net::ERR|403/.test(e.message)) {
      hardFail = `egress/network blocked for hankintailmoitukset.fi: ${e.message}`;
      break;
    }
    console.error(`[hilma-watch] "${term}" failed (skipped): ${e.message}`);
  }
}

await browser.close();

if (hardFail && byUrl.size === 0) {
  console.error(`[hilma-watch] HARD FAILURE — ${hardFail}`);
  console.error('[hilma-watch] Report the blocked host; do not treat as "0 tenders found".');
  process.exit(3);
}

const notices = [...byUrl.values()]
  .map((n) => {
    const s = score(n);
    return { title: n.title, href: n.href, ctx: n.ctx, terms: [...n.matchedTerms], ...s };
  })
  .sort((a, b) => b.score - a.score);

const summary = {
  generatedFromConfig: CONFIG_PATH,
  searchTerms,
  cpvCodes,
  regions: cfg.regions || [],
  totalNotices: notices.length,
  highRelevance: notices.filter((n) => n.score >= 40).length,
  partialRun: Boolean(hardFail),
  notices,
};

writeFileSync(join(OUT_DIR, 'hilma-results.json'), JSON.stringify(summary, null, 2));

const md = [
  `# Hilma tender-watch results`,
  ``,
  `- Config: \`${CONFIG_PATH}\``,
  `- Search terms: ${searchTerms.map((t) => `\`${t}\``).join(', ')}`,
  `- Unique notices: **${notices.length}** (high-relevance ≥40: **${summary.highRelevance}**)`,
  summary.partialRun
    ? `- ⚠️ PARTIAL RUN — some terms were network-blocked; results incomplete.`
    : ``,
  ``,
  `| Score | Title | Matched keywords | CPV | Link |`,
  `|------:|-------|------------------|-----|------|`,
  ...notices
    .slice(0, 50)
    .map(
      (n) =>
        `| ${n.score} | ${n.title.replace(/\|/g, '\\|').slice(0, 90)} | ${n.keywordHits.join(', ').slice(0, 60) || '—'} | ${n.cpvHits.join(', ') || '—'} | ${n.href} |`,
    ),
  ``,
].join('\n');
writeFileSync(join(OUT_DIR, 'hilma-results.md'), md);

console.error(
  `[hilma-watch] wrote ${notices.length} notices to ${OUT_DIR}/hilma-results.{json,md}`,
);
if (hardFail) console.error(`[hilma-watch] NOTE: partial run — ${hardFail}`);
