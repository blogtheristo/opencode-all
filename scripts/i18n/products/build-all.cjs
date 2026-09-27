#!/usr/bin/env node
/**
 * Build five-language product pages via scripts/i18n/build-i18n-pages.cjs.
 * Translation is data; markup is deterministic. Dual-folder outDirs.
 *
 * Usage: node scripts/i18n/products/build-all.cjs
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { translateList, AI_NOTICE, translateString } = require('./translate.cjs');

const BASE = path.resolve(__dirname, '../../..');
const BUILDER = path.join(BASE, 'scripts/i18n/build-i18n-pages.cjs');
const SRC = path.join(BASE, 'dws10.com/products');
const WORK = path.join(BASE, 'scripts/i18n/products/_generated');
const LANGS = ['fi', 'sv', 'de', 'fr'];
const SKIP = new Set([
  'claude-code-coaching.html',
  'claude-code-coaching-fi.html',
  'claude-code-coaching-sv.html',
  'claude-code-coaching-de.html',
  'claude-code-coaching-fr.html',
  // Hand-translated FI pages (HIC 2026-09-23); machine output would overwrite them.
  'lifetime-web-starter.html',
  'lifetime-webstore-mini.html',
]);

function listMasters() {
  return fs
    .readdirSync(SRC)
    .filter((f) => f.endsWith('.html'))
    .filter((f) => !f.includes('RETIRED'))
    .filter((f) => !/\.(fi|sv|de|fr)\.html$/.test(f))
    .filter((f) => !SKIP.has(f))
    .sort();
}

function pickAnchor(html) {
  if (html.includes('</header>')) return '</header>';
  if (html.includes('<div class="container">')) return '<div class="container">';
  return '<body>';
}

function metaFor(html, strings, lang) {
  const title = strings.find((s) => s.includes('Lifetime')) || strings[0] || '';
  const share = translateString(title.replace(/\s+/g, ' ').trim(), lang);
  const m = { ...AI_NOTICE[lang], shareTitle: share };
  if (/<meta[^>]*name="description"/.test(html) && /content="/.test(html)) {
    const d = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/);
    if (d) m.description = translateString(d[1], lang);
  }
  if (/property="og:title"/.test(html)) {
    const d =
      html.match(/property="og:title"[^>]*content="([^"]*)"/) ||
      html.match(/content="([^"]*)"[^>]*property="og:title"/);
    if (d) m['og:title'] = translateString(d[1], lang);
  }
  if (/property="og:description"/.test(html)) {
    const d =
      html.match(/property="og:description"[^>]*content="([^"]*)"/) ||
      html.match(/content="([^"]*)"[^>]*property="og:description"/);
    if (d) m['og:description'] = translateString(d[1], lang);
  }
  return m;
}

function extractViaBuilderLogic(html) {
  const { tokenize, translatable } = (() => {
    function tokenize(h) {
      const masks = [];
      const masked = h.replace(/<(script|style)[\s\S]*?<\/\1>/g, (m) => {
        masks.push(m);
        return ` MASK${masks.length - 1} `;
      });
      return { parts: masked.split(/(<[^>]+>)/), masks };
    }
    const translatable = (p) =>
      !!p &&
      !p.startsWith('<') &&
      !p.includes(' MASK') &&
      p.trim().length > 1 &&
      !/^[\W\d\s&;]+$/.test(p.trim());
    return { tokenize, translatable };
  })();
  const { parts } = tokenize(html);
  return parts.filter(translatable).map((p) => p.trim());
}

function normalizeLikeBuilder(html) {
  return html
    .replace(/<aside class="ai-notice"[\s\S]*?<\/aside>\s*/g, '')
    .replace(/<nav class="i18n-links"[\s\S]*?<\/nav>\s*/g, '')
    .replace(
      / {4}<link\n {6}rel="alternate"\n {6}hreflang="[^"]*"\n {6}href="[^"]*"\n {4}\/>\n/g,
      '',
    )
    .replace(/\n\s*<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/>/g, '');
}

function buildOne(file) {
  const stem = file.replace(/\.html$/, '');
  const id = `product-${stem}`;
  const dir = path.join(WORK, stem);
  fs.mkdirSync(dir, { recursive: true });
  const masterRel = `dws10.com/products/${file}`;
  const html = fs.readFileSync(path.join(BASE, masterRel), 'utf8');
  const strings = extractViaBuilderLogic(normalizeLikeBuilder(html));
  const cfg = {
    id,
    master: masterRel,
    masterLang: 'en',
    stringsDir: path.relative(BASE, dir).replace(/\\/g, '/'),
    outDirs: ['dws10.com/products', 'landing-pages/dws10-com/products'],
    urlBase: 'https://dws10.com/products/',
    files: {
      en: file,
      fi: `${stem}.fi.html`,
      sv: `${stem}.sv.html`,
      de: `${stem}.de.html`,
      fr: `${stem}.fr.html`,
    },
    aiNotice: { langs: LANGS, after: pickAnchor(html) },
  };
  const meta = {};
  for (const lang of LANGS) {
    fs.writeFileSync(
      path.join(dir, `${lang}-strings.json`),
      JSON.stringify(translateList(strings, lang), null, 2),
    );
    meta[lang] = metaFor(html, strings, lang);
  }
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2));
  const cfgPath = path.join(dir, 'config.json');
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
  const r = spawnSync(process.execPath, [BUILDER, path.relative(BASE, cfgPath)], {
    cwd: BASE,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    const err = (r.stderr || r.stdout || '').slice(0, 2000);
    throw new Error(`${file}: builder failed\n${err}`);
  }
  return { file, strings: strings.length, log: (r.stdout || '').trim() };
}

function main() {
  const only = process.argv[2];
  const masters = only ? [only] : listMasters();
  const failed = [];
  let ok = 0;
  for (const f of masters) {
    try {
      const res = buildOne(f);
      ok += 1;
      console.log(`[ok] ${f} (${res.strings} strings)`);
    } catch (e) {
      failed.push({ f, e: e.message });
      console.error(`[fail] ${f}: ${e.message.split('\n')[0]}`);
    }
  }
  console.log(`[product-i18n] ok=${ok} fail=${failed.length} of ${masters.length}`);
  if (failed.length) {
    failed.slice(0, 15).forEach((x) => console.error(x.f, x.e.slice(0, 300)));
    process.exit(1);
  }
}

main();
