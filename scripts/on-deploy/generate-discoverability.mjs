#!/usr/bin/env node
/**
 * generate-discoverability.mjs — SEO + AEO discoverability layer for the DWS public sites.
 *
 * Generates, per site, the three files that let search crawlers and AI answer
 * engines (ChatGPT, Claude, Perplexity, Google AI) find, index, and cite the
 * sites. Without these, the rest of the growth funnel (CRM, campaigns,
 * store/booking) is starved of organic traffic.
 *
 *   robots.txt   — crawl directives; explicitly welcomes AI crawlers; points to sitemap.
 *   sitemap.xml  — every indexable page with git-derived <lastmod>.
 *   llms.txt     — curated, annotated index for AI answer engines (AEO, llmstxt.org).
 *
 * Lead-gen sites get all three. The internal auth/admin portal (dws6.com) gets a
 * restrictive robots.txt only (no sitemap/llms — auth pages must not be indexed).
 *
 * Source folder is canonical; the landing-pages mirror is written in the same run
 * to honor the CLAUDE.md Dual Folder Sync Rule. Idempotent and re-runnable; wired
 * into scripts/on-deploy so it tracks pages as they are added (Script Automation Rule).
 *
 * Usage:
 *   node scripts/on-deploy/generate-discoverability.mjs           write files
 *   node scripts/on-deploy/generate-discoverability.mjs --check   report only, no writes
 *
 * Exit code: 0 on success; 1 if --check finds files that would change.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const CHECK_ONLY = process.argv.includes('--check');
const TODAY = new Date().toISOString().slice(0, 10);

// AI answer-engine crawlers we explicitly welcome (AEO). User confirmed: allow + llms.txt.
const AI_CRAWLERS = [
  'GPTBot', // OpenAI / ChatGPT
  'OAI-SearchBot', // OpenAI search
  'ChatGPT-User', // ChatGPT browsing
  'ClaudeBot', // Anthropic crawler
  'Claude-Web', // Anthropic browsing
  'anthropic-ai', // Anthropic (legacy token)
  'PerplexityBot', // Perplexity
  'Perplexity-User', // Perplexity browsing
  'Google-Extended', // Google Gemini / AI Overviews
  'Applebot-Extended', // Apple Intelligence
  'Bingbot', // Bing / Copilot
  'Amazonbot', // Amazon
  'cohere-ai', // Cohere
];

/**
 * Site config.
 *   mode "lead-gen" -> robots.txt (open) + sitemap.xml + llms.txt
 *   mode "internal" -> restrictive robots.txt only
 *   disallow: paths excluded from crawling AND from sitemap/llms (sensitive/internal/transient)
 */
const SITES = [
  {
    domain: 'dws10.com',
    src: 'dws10.com',
    mirror: 'landing-pages/dws10-com',
    mode: 'lead-gen',
    name: 'DWS IQ 6 — Nordic Industrial AI',
    summary:
      'Sovereign, EU-built industrial AI for compliance automation (CSRD, CBAM, EU ETS, EU AI Act) across construction, logistics, energy, manufacturing, and other heavy industries. By Lifetime Oy, Finland.',
    disallow: ['/checkout/', '/dashboard/', '/assistant/', '/gamma/', '/designs/', '/dpa_OLD/'],
  },
  {
    domain: 'onelifetime.world',
    src: 'onelifetime.world',
    mirror: 'landing-pages/onelifetime-world',
    mode: 'lead-gen',
    name: 'One Lifetime — Lifetime Scope Journal',
    summary:
      'Editorial and ecosystem hub of Lifetime Oy: the Lifetime Scope Journal blog on industrial AI, EU regulation, agentic systems, and digital sovereignty. Routes buyers to the DWS IQ store.',
    disallow: ['/community-login/', '/assistant/', '/out (', '/upsell-map/'],
  },
  {
    domain: 'lifetime.fi',
    src: 'lifetime.fi',
    mirror: 'landing-pages/lifetime-fi',
    mode: 'lead-gen',
    name: 'Lifetime Oy — The Agent Outcome Company',
    summary:
      'Finnish B2B hub for AI agents, loops and workflows, IT support for SMEs, the Firehorse production engine, and Lifetime Fleet driver recruitment.',
    disallow: ['/arena/'],
  },
  {
    domain: 'dws6.com',
    src: 'dws6.com',
    mirror: 'landing-pages/dws6-com',
    mode: 'internal',
    // Internal auth/admin portal — keep search engines out of sensitive areas.
    disallow: [
      '/admin/',
      '/dashboard/',
      '/dasboard/',
      '/login/',
      '/register/',
      '/forgot-password/',
      '/reset-password/',
      '/mfa-setup/',
      '/mfa-verify/',
      '/verify-email/',
      '/auth-debug/',
      '/test-login/',
      '/assistant/',
      '/meet/',
    ],
  },
];

// Directory name fragments that are never indexable regardless of site.
const GLOBAL_SKIP_DIR = ['_OLD', '_old', '# Name clash', '(#', 'backup', '.backup'];

const enc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Last git commit date for a file (YYYY-MM-DD), or file mtime, or today. */
function lastmod(absPath) {
  try {
    const out = execSync(`git log -1 --format=%cd --date=short -- "${absPath}"`, {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (out) return out;
  } catch {
    /* not committed yet */
  }
  try {
    return fs.statSync(absPath).mtime.toISOString().slice(0, 10);
  } catch {
    return TODAY;
  }
}

/** Extract <title> and meta description from an HTML file. */
function metaOf(absPath) {
  let html = '';
  try {
    html = fs.readFileSync(absPath, 'utf8');
  } catch {
    return { title: '', description: '' };
  }
  const head = html.slice(0, 8000);
  const t = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const d = head.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i);
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
  return { title: clean(t && t[1]), description: clean(d && d[1]) };
}

/** Is this URL path excluded for the given site? */
function isDisallowed(urlPath, site) {
  return (site.disallow || []).some((d) => urlPath.startsWith(d));
}

/** Walk a site folder and collect indexable pages: root html files plus first-level index.html. */
function collectPages(site) {
  const base = path.join(ROOT, site.src);
  if (!fs.existsSync(base)) return [];
  const pages = [];

  const skipDir = (name) => GLOBAL_SKIP_DIR.some((frag) => name.includes(frag));

  // Root index + root-level standalone .html files
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      const urlPath = entry.name === 'index.html' ? '/' : `/${entry.name}`;
      pages.push({ urlPath, abs: path.join(base, entry.name) });
    }
  }
  // One level of subdirectories containing index.html
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory() || skipDir(entry.name)) continue;
    const idx = path.join(base, entry.name, 'index.html');
    if (fs.existsSync(idx)) pages.push({ urlPath: `/${entry.name}/`, abs: idx });
  }

  return pages
    .filter((p) => !isDisallowed(p.urlPath, site))
    .sort((a, b) =>
      a.urlPath === '/' ? -1 : b.urlPath === '/' ? 1 : a.urlPath.localeCompare(b.urlPath),
    );
}

function buildRobots(site, hasSitemap) {
  const L = [];
  L.push(`# robots.txt — ${site.domain}`);
  L.push(`# Generated by scripts/on-deploy/generate-discoverability.mjs — do not edit by hand.`);
  L.push('');
  if (site.mode === 'internal') {
    L.push(`# Internal auth/admin portal: keep crawlers out of sensitive areas.`);
    L.push(`User-agent: *`);
    for (const d of site.disallow) L.push(`Disallow: ${d}`);
    L.push('');
    return L.join('\n') + '\n';
  }
  // Lead-gen: open to everyone, sensitive paths disallowed, AI crawlers welcomed.
  L.push(`User-agent: *`);
  for (const d of site.disallow) L.push(`Disallow: ${d}`);
  L.push(`Allow: /`);
  L.push('');
  L.push(`# AI answer engines explicitly welcomed (AEO).`);
  for (const ua of AI_CRAWLERS) {
    L.push(`User-agent: ${ua}`);
    L.push(`Allow: /`);
  }
  L.push('');
  if (hasSitemap) L.push(`Sitemap: https://${site.domain}/sitemap.xml`);
  L.push('');
  return L.join('\n') + '\n';
}

function buildSitemap(site, pages) {
  const L = [];
  L.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  L.push(`<!-- Generated by scripts/on-deploy/generate-discoverability.mjs -->`);
  L.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
  for (const p of pages) {
    const loc = `https://${site.domain}${p.urlPath}`;
    const priority =
      p.urlPath === '/' ? '1.0' : p.urlPath.split('/').filter(Boolean).length <= 1 ? '0.8' : '0.6';
    L.push(`  <url>`);
    L.push(`    <loc>${enc(loc)}</loc>`);
    L.push(`    <lastmod>${lastmod(p.abs)}</lastmod>`);
    L.push(`    <changefreq>weekly</changefreq>`);
    L.push(`    <priority>${priority}</priority>`);
    L.push(`  </url>`);
  }
  L.push(`</urlset>`);
  return L.join('\n') + '\n';
}

function buildLlms(site, pages) {
  const L = [];
  L.push(`# ${site.name}`);
  L.push('');
  L.push(`> ${site.summary}`);
  L.push('');
  L.push(
    `Operated by Lifetime Oy (Business ID 0772407-9), Espoo, Finland. Canonical domain: https://${site.domain}/`,
  );
  L.push('');
  L.push(`## Pages`);
  L.push('');
  for (const p of pages) {
    const { title, description } = metaOf(p.abs);
    const loc = `https://${site.domain}${p.urlPath}`;
    const label = title || p.urlPath;
    const note = description ? `: ${description}` : '';
    L.push(`- [${label}](${loc})${note}`);
  }
  L.push('');
  return L.join('\n') + '\n';
}

function writeOut(relPath, content, results) {
  const abs = path.join(ROOT, relPath);
  const prev = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  const changed = prev !== content;
  if (changed && !CHECK_ONLY) {
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
  }
  results.push({
    relPath,
    changed,
    status: changed ? (CHECK_ONLY ? 'WOULD-WRITE' : 'WROTE') : 'unchanged',
  });
}

function main() {
  const results = [];
  for (const site of SITES) {
    if (!fs.existsSync(path.join(ROOT, site.src))) {
      console.warn(`! skip ${site.domain}: source folder missing`);
      continue;
    }
    const pages = site.mode === 'lead-gen' ? collectPages(site) : [];
    const files = {};
    files['robots.txt'] = buildRobots(site, site.mode === 'lead-gen');
    if (site.mode === 'lead-gen') {
      files['sitemap.xml'] = buildSitemap(site, pages);
      files['llms.txt'] = buildLlms(site, pages);
    }
    for (const [name, content] of Object.entries(files)) {
      writeOut(path.join(site.src, name), content, results);
      if (fs.existsSync(path.join(ROOT, site.mirror))) {
        writeOut(path.join(site.mirror, name), content, results); // Dual Folder Sync Rule
      }
    }
    const noun = site.mode === 'lead-gen' ? `${pages.length} pages` : 'internal (robots only)';
    console.log(`• ${site.domain}: ${noun}`);
  }

  const changed = results.filter((r) => r.changed);
  for (const r of results) console.log(`  [${r.status}] ${r.relPath}`);
  console.log(
    `\n${changed.length} file(s) ${CHECK_ONLY ? 'would change' : 'written'}, ${results.length} total.`,
  );

  if (CHECK_ONLY && changed.length) process.exit(1);
}

main();
