#!/usr/bin/env node
/**
 * Coach + Learn Curate / Sync — weekly maintenance.
 *
 * What it does (idempotent; NEVER deletes — only moves):
 *   1. Renders pinned external sources (cover letter, brochure) → Learn/ HTML.
 *   2. Coach/: per-customer version archiving + renders newest offers → Learn/ HTML,
 *      reading the machine-readable COACH-META block (Customer/Product/ProductTier/
 *      ServiceTier/Version/Status) for the index.
 *   3. Learn/: moves superseded versioned files (and *_OLD) → Learn/Archive/, then
 *      renders any newest *.md that has no HTML rendering yet.
 *   4. Builds Learn/start.html — one index linking all current Learn material, with a
 *      Coach offers table (customer × product version × tier × service tier).
 *
 * Versioning rule: filenames end with _vX.Y(.Z) before the extension. Highest version is
 * kept in place; older versions move to Archive/. Thesis HTML is preserved (moved, not deleted),
 * honouring CLAUDE.md's "never delete old thesis HTML versions".
 *
 * Run: node scripts/weekly/coach-learn-curate.cjs   (wrapper: scripts/weekly/coach-learn-curate.sh)
 */

const fs = require('fs');
const path = require('path');

const REPO = process.env.REPO_ROOT
  ? path.resolve(process.env.REPO_ROOT)
  : path.resolve(__dirname, '../..');
const LEARN = path.join(REPO, 'Learn');
const COACH = path.join(REPO, 'Coach');
const BIDS = path.join(REPO, 'bids');
const LEARN_ARCHIVE = path.join(LEARN, 'Archive');

const CSS = `
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:1000px;margin:0 auto;padding:0 20px 40px;line-height:1.7;color:#1a1a2e;background:#fafafa}
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
.dws-version-banner{background:#1e293b;color:#e2e8f0;padding:12px 20px;margin:0 -20px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:.85rem}
.dws-version-badge{background:#fbbf24;color:#0f172a;font-weight:700;padding:4px 12px;border-radius:20px;font-size:.9rem;letter-spacing:.04em}
.dws-version-meta{color:#94a3b8;font-size:.8rem}
.dws-version-title{color:#e2e8f0;font-weight:600}
.col2{column-count:2;column-gap:32px}
.col2 li{break-inside:avoid}
.status-DRAFT{color:#b45309;font-weight:600}.status-ACTIVE{color:#15803d;font-weight:600}
`.trim();

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function extractVersion(md) {
  const m = md.match(/^\s*>?\s*\*{0,2}Version:?\*{0,2}\s*(\S+)/m);
  return m ? m[1] : 'unknown';
}

function titleFromMd(md, fallback) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].replace(/[*`]/g, '').trim() : fallback;
}

function parseMeta(md) {
  const m = md.match(/<!--\s*COACH-META([\s\S]*?)-->/);
  const meta = {};
  if (m) {
    m[1].split('\n').forEach((line) => {
      const mm = line.match(/^\s*([A-Za-z]+):\s*(.+?)\s*$/);
      if (mm) meta[mm[1]] = mm[2];
    });
  }
  return meta;
}

function mdToHtml(mdRaw, titleBase, lang, version, metaText) {
  let md = mdRaw.replace(/<!--[\s\S]*?-->/g, ''); // strip HTML comments (e.g. COACH-META)
  let html = md;
  const codeBlocks = [];
  html = html.replace(/```([\s\S]*?)```/g, (_, inner) => {
    const idx = codeBlocks.length;
    const stripped = inner.replace(/^[a-z]*\n/, '');
    codeBlocks.push('<pre><code>' + escHtml(stripped) + '</code></pre>');
    return '___CODE' + idx + '___';
  });
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
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^[-*]{3,}$/gm, '<hr />');
  codeBlocks.forEach((cb, i) => {
    html = html.replace('___CODE' + i + '___', cb);
  });
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html
    .split('\n\n')
    .map((p) => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<')) return p;
      return '<p>' + p.replace(/\n/g, ' ') + '</p>';
    })
    .join('\n');

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
    '<title>' + escHtml(titleBase + ' v' + version) + '</title>',
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

// base_vX.Y(.Z).ext  →  {base, version, ext}
function parseVersioned(name) {
  const m = name.match(/^(.*)_v(\d+(?:\.\d+){0,2})\.([A-Za-z0-9]+)$/);
  return m ? { base: m[1], version: m[2], ext: m[3].toLowerCase() } : null;
}

function cmpVer(a, b) {
  const pa = a.split('.').map(Number),
    pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d;
  }
  return 0;
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function moveToArchive(absFile, archiveDir) {
  ensureDir(archiveDir);
  fs.renameSync(absFile, path.join(archiveDir, path.basename(absFile)));
}

const summary = {
  external: [],
  coachRendered: [],
  coachArchived: [],
  bidsRendered: [],
  learnRendered: [],
  learnArchived: [],
  errors: [],
};

// ── 1. Pinned external sources → Learn HTML ──────────────────────────────────
const EXTERNAL = [
  {
    src: 'docs/coaching/SAATE_JULKISHALLINTO_FI.md',
    out: 'SAATE_JULKISHALLINTO_FI.html',
    lang: 'fi',
  },
  {
    src: 'docs/coaching/ESITE_JULKISHALLINTO_FI.md',
    out: 'ESITE_JULKISHALLINTO_FI.html',
    lang: 'fi',
  },
  {
    src: 'Coach/_reference/BID_EXCELLENCE_FI.md',
    out: 'BID_EXCELLENCE_FI.html',
    lang: 'fi',
  },
];
for (const f of EXTERNAL) {
  const srcAbs = path.join(REPO, f.src);
  if (!fs.existsSync(srcAbs)) {
    summary.errors.push('Missing external source: ' + f.src);
    continue;
  }
  const md = fs.readFileSync(srcAbs, 'utf8');
  const html = mdToHtml(
    md,
    titleFromMd(md, f.out),
    f.lang,
    extractVersion(md),
    'Lifetime Oy · Learn/ (private)',
  );
  fs.writeFileSync(path.join(LEARN, f.out), html);
  summary.external.push(f.out);
}

// ── 2. Coach: version-archive + render newest → Learn HTML ────────────────────
const coachOffers = [];
if (fs.existsSync(COACH)) {
  for (const cust of fs.readdirSync(COACH)) {
    const custDir = path.join(COACH, cust);
    if (!fs.statSync(custDir).isDirectory() || cust.startsWith('_') || cust === 'Archive') continue;
    const custArchive = path.join(custDir, 'Archive');

    const mdFiles = fs.readdirSync(custDir).filter((n) => n.endsWith('.md'));
    // Group versioned families; keep newest, archive the rest.
    const families = {};
    for (const n of mdFiles) {
      const pv = parseVersioned(n);
      if (!pv) continue;
      const key = pv.base + '|' + pv.ext;
      (families[key] = families[key] || []).push({ name: n, version: pv.version });
    }
    const keep = new Set(mdFiles.filter((n) => !parseVersioned(n))); // unversioned md kept as-is
    for (const key of Object.keys(families)) {
      const sorted = families[key].sort((a, b) => cmpVer(b.version, a.version));
      keep.add(sorted[0].name);
      for (const old of sorted.slice(1)) {
        moveToArchive(path.join(custDir, old.name), custArchive);
        summary.coachArchived.push(cust + '/' + old.name);
      }
    }
    // Render the kept newest offers.
    for (const n of [...keep].sort()) {
      const md = fs.readFileSync(path.join(custDir, n), 'utf8');
      const meta = parseMeta(md);
      const version = meta.Version || extractVersion(md);
      const title = titleFromMd(md, n);
      const outName = 'Coach_' + cust + '_' + n.replace(/\.md$/, '') + '.html';
      const metaText =
        [meta.Customer, meta.Product, meta.ProductTier].filter(Boolean).join(' · ') ||
        'Lifetime Oy';
      fs.writeFileSync(path.join(LEARN, outName), mdToHtml(md, title, 'fi', version, metaText));
      summary.coachRendered.push(outName);
      coachOffers.push({
        customer: meta.Customer || cust,
        product: meta.Product || '—',
        productTier: meta.ProductTier || '—',
        serviceTier: meta.ServiceTier || '—',
        version: version,
        status: meta.Status || '—',
        href: outName,
      });
    }
  }
}

// ── 2b. Bids: render each tender's documents → Learn HTML; collect attachments ─
// Each bids/<REF>/ is a competitive tender response (distinct from Coach training
// offers). Filenames are stable (no _vX.Y), so nothing is archived here — md is
// rendered for easy viewing and non-md files (PDF etc.) are linked as attachments.
const bidGroups = [];
if (fs.existsSync(BIDS)) {
  for (const ref of fs.readdirSync(BIDS).sort()) {
    const refDir = path.join(BIDS, ref);
    if (!fs.statSync(refDir).isDirectory() || ref.startsWith('_') || ref === 'Archive') continue;
    const docs = [];
    const attachments = [];
    for (const n of fs.readdirSync(refDir).sort()) {
      const abs = path.join(refDir, n);
      if (!fs.statSync(abs).isFile()) continue;
      if (n.endsWith('.md')) {
        const md = fs.readFileSync(abs, 'utf8');
        const outName = 'Bid_' + ref + '_' + n.replace(/\.md$/, '') + '.html';
        fs.writeFileSync(
          path.join(LEARN, outName),
          mdToHtml(
            md,
            titleFromMd(md, n),
            'fi',
            extractVersion(md),
            'Lifetime Oy · tarjous ' + ref,
          ),
        );
        docs.push({ name: n.replace(/\.md$/, ''), href: outName });
        summary.bidsRendered.push(outName);
      } else {
        // Attachment (PDF, pptx, …) — link relative to Learn/.
        attachments.push({ name: n, href: '../bids/' + ref + '/' + n });
      }
    }
    bidGroups.push({ ref, docs, attachments });
  }
}

// ── 3. Learn: archive superseded versions + *_OLD ────────────────────────────
const learnFiles = fs.readdirSync(LEARN).filter((n) => fs.statSync(path.join(LEARN, n)).isFile());
const learnFamilies = {};
for (const n of learnFiles) {
  if (n.endsWith('_OLD') || /\.(html|md)_OLD$/.test(n)) {
    moveToArchive(path.join(LEARN, n), LEARN_ARCHIVE);
    summary.learnArchived.push(n);
    continue;
  }
  const pv = parseVersioned(n);
  if (!pv) continue;
  const key = pv.base + '|' + pv.ext;
  (learnFamilies[key] = learnFamilies[key] || []).push({ name: n, version: pv.version });
}
for (const key of Object.keys(learnFamilies)) {
  const [base, ext] = key.split('|');
  // For Markdown, an unversioned `<base>.md` is the LIVE source and every versioned
  // `<base>_vX.Y.md` is a superseded snapshot → archive all of them. For HTML (and
  // everything else) the versioned file is the canonical output (e.g. thesis renders),
  // so keep the newest version and archive only the older ones.
  const mdSnapshots = ext === 'md' && learnFiles.includes(base + '.md');
  const sorted = learnFamilies[key].sort((a, b) => cmpVer(b.version, a.version));
  const toArchive = mdSnapshots ? sorted : sorted.slice(1);
  for (const old of toArchive) {
    moveToArchive(path.join(LEARN, old.name), LEARN_ARCHIVE);
    summary.learnArchived.push(old.name);
  }
}

// ── 3b. Render newest Learn *.md that have no HTML rendering yet ──────────────
const current = fs.readdirSync(LEARN).filter((n) => fs.statSync(path.join(LEARN, n)).isFile());
const htmlSet = current.filter((n) => n.endsWith('.html'));
for (const n of current) {
  if (!n.endsWith('.md')) continue;
  if (parseVersioned(n)) continue; // versioned .md are snapshots; never render them
  const baseNoExt = n.replace(/\.md$/, '');
  const hasHtml = htmlSet.some((h) => h === baseNoExt + '.html' || h.startsWith(baseNoExt + '_v'));
  if (hasHtml) continue;
  const md = fs.readFileSync(path.join(LEARN, n), 'utf8');
  const out = baseNoExt + '.html';
  fs.writeFileSync(
    path.join(LEARN, out),
    mdToHtml(
      md,
      titleFromMd(md, baseNoExt),
      'en',
      extractVersion(md),
      'Lifetime Oy · Learn/ (private)',
    ),
  );
  summary.learnRendered.push(out);
}

// ── 4. Build Learn/start.html ────────────────────────────────────────────────
const final = fs
  .readdirSync(LEARN)
  .filter((n) => fs.statSync(path.join(LEARN, n)).isFile() && n !== 'start.html');
const htmlDocs = final
  .filter((n) => n.endsWith('.html'))
  .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
const mdDocs = final.filter((n) => n.endsWith('.md')).sort();
const otherDocs = final.filter((n) => !n.endsWith('.html') && !n.endsWith('.md')).sort();
const subdirs = fs
  .readdirSync(LEARN)
  .filter((n) => fs.statSync(path.join(LEARN, n)).isDirectory())
  .sort();

const today = new Date().toISOString().slice(0, 10);
const li = (n) => '<li><a href="' + encodeURI(n) + '">' + escHtml(n) + '</a></li>';

const coachRows = coachOffers.length
  ? coachOffers
      .sort((a, b) => a.customer.localeCompare(b.customer))
      .map(
        (o) =>
          '<tr><td><a href="' +
          encodeURI(o.href) +
          '">' +
          escHtml(o.customer) +
          '</a></td><td>' +
          escHtml(o.product) +
          '</td><td>' +
          escHtml(o.productTier) +
          '</td><td>' +
          escHtml(o.serviceTier) +
          '</td><td>v' +
          escHtml(o.version) +
          '</td><td class="status-' +
          escHtml(o.status) +
          '">' +
          escHtml(o.status) +
          '</td></tr>',
      )
      .join('\n')
  : '<tr><td colspan="6">Ei Coach-tarjouksia.</td></tr>';

const bidsSection = bidGroups.length
  ? bidGroups
      .map((g) => {
        const docLinks = g.docs
          .map((d) => '<a href="' + encodeURI(d.href) + '">' + escHtml(d.name) + '</a>')
          .join(' · ');
        const attLinks = g.attachments.length
          ? '<br><strong>Liitteet:</strong> ' +
            g.attachments
              .map((a) => '<a href="' + encodeURI(a.href) + '">' + escHtml(a.name) + '</a>')
              .join(' · ')
          : '';
        return (
          '<li><strong>' +
          escHtml(g.ref) +
          '</strong> — ' +
          g.docs.length +
          ' dokumenttia, ' +
          g.attachments.length +
          ' liitettä<br>' +
          docLinks +
          attLinks +
          '</li>'
        );
      })
      .join('\n')
  : '<li>Ei tarjouksia.</li>';

const start = [
  '<!DOCTYPE html>',
  '<html lang="fi">',
  '<head>',
  '<meta charset="UTF-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '<title>Learn — hakemisto</title>',
  '<style>',
  CSS,
  '</style>',
  '</head>',
  '<body>',
  '<div class="dws-version-banner"><span class="dws-version-title">Learn — hakemisto</span>' +
    '<span class="dws-version-badge">START</span><span class="dws-version-meta">Lifetime Oy · luotu automaattisesti ' +
    today +
    ' · privaatti</span></div>',
  '<h1>Learn-aineisto</h1>',
  '<p>Tämä sivu on luotu automaattisesti viikoittaisella cronilla (<code>scripts/weekly/coach-learn-curate.sh</code>). ' +
    'Uusimmat versiot pidetään täällä; vanhentuneet on siirretty kansioon <a href="Archive/">Archive/</a>.</p>',
  '<h2>Coach — koulutustarjoukset</h2>',
  '<table><thead><tr><th>Asiakas</th><th>Tuoteversio</th><th>Tuotetaso</th><th>Palvelutaso</th><th>Versio</th><th>Tila</th></tr></thead><tbody>',
  coachRows,
  '</tbody></table>',
  '<h2>Tarjoukset (bids) — ' + bidGroups.length + ' kpl</h2>',
  '<ul>',
  bidsSection,
  '</ul>',
  '<h2>Dokumentit (HTML) — ' + htmlDocs.length + ' kpl</h2>',
  '<ul class="col2">',
  htmlDocs.map(li).join('\n'),
  '</ul>',
  '<h2>Lähteet (Markdown) — ' + mdDocs.length + ' kpl</h2>',
  '<ul class="col2">',
  mdDocs.map(li).join('\n'),
  '</ul>',
  otherDocs.length
    ? '<h2>Muut tiedostot — ' +
      otherDocs.length +
      ' kpl</h2><ul class="col2">' +
      otherDocs.map(li).join('\n') +
      '</ul>'
    : '',
  '<h2>Kansiot</h2>',
  '<ul>',
  subdirs.map((d) => '<li><a href="' + encodeURI(d) + '/">' + escHtml(d) + '/</a></li>').join('\n'),
  '</ul>',
  '</body>',
  '</html>',
].join('\n');

fs.writeFileSync(path.join(LEARN, 'start.html'), start);

// ── Summary (fail loud) ──────────────────────────────────────────────────────
console.log('Coach+Learn curate complete (' + today + ')');
console.log('  External rendered : ' + summary.external.length);
console.log(
  '  Coach rendered    : ' +
    summary.coachRendered.length +
    ' | Coach archived: ' +
    summary.coachArchived.length,
);
console.log(
  '  Learn rendered    : ' +
    summary.learnRendered.length +
    ' | Learn archived: ' +
    summary.learnArchived.length,
);
console.log(
  '  Bids rendered     : ' + summary.bidsRendered.length + ' | bid groups: ' + bidGroups.length,
);
console.log('  Coach offers indexed: ' + coachOffers.length);
console.log('  start.html docs: ' + htmlDocs.length + ' html, ' + mdDocs.length + ' md');
if (summary.errors.length) {
  console.error('ERRORS:\n  ' + summary.errors.join('\n  '));
  process.exit(1);
}
