#!/usr/bin/env node
// Evidence: Tool=Claude Code Agent=claude Date=2026-09-24
// Audit trail: git log -- scripts/build-lifetime-fi-front.mjs
/**
 * Builds the One Lifetime front page (WHY layer) for lifetime.fi in five languages
 * from one content source, and syncs the landing-pages mirror in the same run.
 *
 *   node scripts/build-lifetime-fi-front.mjs          # write all pages
 *   node scripts/build-lifetime-fi-front.mjs --check  # exit 1 if any page is stale
 *
 * Source of truth: lifetime.fi/config/front-page.i18n.json (fi is the master).
 * Layout: lifetime.fi/shared-assets/front-page.css (unchanged palette/typography).
 * Decision: docs/proposals/2026-09-24-lifetime-fi-tulossivu-ehdotus.md §13 (HIC v2.0).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = JSON.parse(readFileSync(join(ROOT, 'lifetime.fi/config/front-page.i18n.json'), 'utf8'));
const LANGS = ['en', 'fi', 'sv', 'de', 'fr'];
const CHECK = process.argv.includes('--check');

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function cards(items, linkLabel, hrefFor) {
  return items
    .map(([title, text, href]) => {
      const link = hrefFor
        ? `\n          <a href="${hrefFor(href)}" class="card-link">${esc(linkLabel)}</a>`
        : '';
      return `        <div class="platform-card">\n          <h3>${esc(title)}</h3>\n          <p>${esc(text)}</p>${link}\n        </div>`;
    })
    .join('\n');
}

function page(t) {
  const hreflang = LANGS.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="https://lifetime.fi${SRC[l].path}" />`,
  ).join('\n');
  const langs = LANGS.map(
    (l) =>
      `        <a href="${SRC[l].path}" lang="${l}"${l === t.lang ? ' aria-current="page"' : ''}>${l}</a>`,
  ).join('\n');
  return `<!doctype html>
<html lang="${t.lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(t.title)}</title>
    <meta name="description" content="${esc(t.description)}" />
    <meta name="author" content="Lifetime Oy" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#0f172a" />
    <meta property="og:title" content="${esc(t.title)}" />
    <meta property="og:description" content="${esc(t.ogDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://lifetime.fi${t.path}" />
    <meta property="og:image" content="https://lifetime.fi/static/images/OneLifetime_Logo_Final.png" />
    <meta property="og:site_name" content="One Lifetime" />
    <link rel="canonical" href="https://lifetime.fi${t.path}" />
${hreflang}
    <link rel="alternate" hreflang="x-default" href="https://lifetime.fi/" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/shared-assets/front-page.css" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Lifetime Oy",
        "alternateName": "One Lifetime",
        "url": "https://lifetime.fi${t.path}",
        "slogan": ${JSON.stringify(t.brandLine)},
        "telephone": "+358400319010",
        "email": "risto.paarni@lifetime.fi",
        "vatID": "FI07724079",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Laidunmaanraitti 2 A 25",
          "postalCode": "02330",
          "addressLocality": "Espoo",
          "addressCountry": "FI"
        },
        "founder": { "@type": "Person", "name": "Risto Anton Päärni" }
      }
    </script>
  </head>
  <body>
    <nav class="ol-nav" aria-label="One Lifetime">
      <a class="ol-nav-brand" href="${t.path}">One Lifetime</a>
      <div class="ol-nav-links">
        <a href="#mita-uskomme">${esc(t.nav.beliefs)}</a>
        <a href="#mihin-maailma-on-menossa">${esc(t.nav.directions)}</a>
        <a href="#toimialat">${esc(t.nav.industries)}</a>
        <a href="#ihminen">${esc(t.nav.person)}</a>
        <a href="https://onelifetime.world/blog/">${esc(t.nav.understand)}</a>
        <a href="https://dws10.com/">${esc(t.nav.implement)}</a>
      </div>
      <div class="ol-nav-langs" aria-label="Language">
${langs}
      </div>
    </nav>
    <script src="/shared-assets/vertical-lang-bar.js"></script>

    <!-- Hero D (HIC decision v2.0, 24.09.2026) -->
    <section class="hero">
      <div class="hero-grid"></div>
      <div class="hero-inner">
        <div class="hero-overline">${esc(t.overline)}</div>
        <h1>${esc(t.h1a)}<br /><span class="hero-accent">${esc(t.h1b)}</span></h1>
        <p class="hero-tagline">
          ${esc(t.tagline1)}
          <strong>${esc(t.tagline1strong)}</strong>
        </p>
        <p class="hero-tagline">
          <strong>${esc(t.triad)}</strong>
          ${esc(t.claim)}
        </p>
        <div class="hero-actions">
          <a href="#mita-uskomme" class="btn-gold">${esc(t.cta1)}</a>
          <a href="#kaksi-ovea" class="btn-outline">${esc(t.cta2)}</a>
        </div>
      </div>
    </section>

    <hr class="section-divider" />

    <section class="section" id="mita-uskomme">
      <div class="section-label">${esc(t.beliefsLabel)}</div>
      <h2 class="section-title">${esc(t.beliefsTitle)}</h2>
      <div class="section-body"><p>${esc(t.beliefsLead)}</p></div>
      <div class="platform-grid">
${cards(t.beliefs, t.beliefLink, () => 'https://onelifetime.world/blog/')}
      </div>
    </section>

    <hr class="section-divider" />

    <section class="section" id="mihin-maailma-on-menossa">
      <div class="section-label">${esc(t.directionsLabel)}</div>
      <h2 class="section-title">${esc(t.directionsTitle)}</h2>
      <div class="section-body"><p>${esc(t.directionsLead)}</p></div>
      <div class="platform-grid">
${cards(t.directions)}
      </div>
    </section>

    <hr class="section-divider" />

    <section class="section" id="toimialat">
      <div class="section-label">${esc(t.industriesLabel)}</div>
      <h2 class="section-title">${esc(t.industriesTitle)}</h2>
      <div class="platform-grid">
${cards(t.industries, t.industryLink, (h) => h)}
      </div>
    </section>

    <hr class="section-divider" />

    <section class="section" id="kaksi-ovea">
      <div class="section-label">${esc(t.doorsLabel)}</div>
      <h2 class="section-title">${esc(t.doorsTitle)}</h2>
      <div class="platform-grid">
        <div class="platform-card">
          <h3>${esc(t.door1Title)}</h3>
          <p>${esc(t.door1Text)}</p>
          <a href="https://onelifetime.world/blog/" class="card-link">onelifetime.world &rarr;</a>
        </div>
        <div class="platform-card">
          <h3>${esc(t.door2Title)}</h3>
          <p>${esc(t.door2Text)}</p>
          <a href="https://dws10.com/" class="card-link">dws10.com &rarr;</a>
        </div>
      </div>
    </section>

    <hr class="section-divider" />

    <section class="section" id="ihminen">
      <div class="section-label">${esc(t.personLabel)}</div>
      <h2 class="section-title">Risto Anton Päärni</h2>
      <div class="section-body">
        <p>${esc(t.person1)}</p>
        <p>${esc(t.person2)}</p>
        <p>
          <strong>+358 400 319 010</strong> &middot; risto.paarni@lifetime.fi &middot;
          <a href="https://wa.me/358400319010" class="card-link">WhatsApp &rarr;</a>
        </p>
      </div>
    </section>

    <footer class="corp-footer">
      <div class="footer-inner">
        <div class="footer-col">
          <h4>One Lifetime</h4>
          <p>${esc(t.brandLine)}</p>
          <p style="margin-top: 12px">
            <strong style="color: var(--text-primary)">Risto Anton Päärni</strong><br />
            ${esc(t.role)}<br />
            risto.paarni@lifetime.fi &middot; +358 400 319 010
          </p>
        </div>
        <div class="footer-col">
          <h4>${esc(t.footerDoors)}</h4>
          <a href="https://onelifetime.world/blog/">${esc(t.footerUnderstand)}</a>
          <a href="https://dws10.com/">${esc(t.footerImplement)}</a>
        </div>
        <div class="footer-col">
          <h4>${esc(t.footerLegal)}</h4>
          <a href="https://dws10.com/terms/">${esc(t.terms)}</a>
          <a href="https://dws10.com/privacy-policy/">${esc(t.privacy)}</a>
          <a href="https://dws10.com/legal/">${esc(t.legalHub)}</a>
        </div>
      </div>
      <div class="footer-legal">
        <p>&copy; 2026 Lifetime Oy &middot; ${esc(t.businessId)} 0772407-9 &middot; ${esc(t.vat)} FI07724079</p>
        <p>Laidunmaanraitti 2 A 25, 02330 Espoo, ${esc(t.country)}</p>
      </div>
    </footer>

    <script src="/shared-assets/motion/reveal.js" defer></script>
  </body>
</html>
`;
}

let stale = 0;
for (const lang of LANGS) {
  const html = page(SRC[lang]);
  const rel = lang === 'en' ? 'index.html' : `${lang}/index.html`;
  for (const base of ['lifetime.fi', 'landing-pages/lifetime-fi']) {
    const out = join(ROOT, base, rel);
    let current = '';
    try {
      current = readFileSync(out, 'utf8');
    } catch {
      /* new file */
    }
    if (current === html) continue;
    if (CHECK) {
      console.error(`stale: ${base}/${rel}`);
      stale++;
      continue;
    }
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
    console.log(`wrote ${base}/${rel}`);
  }
}
// Keep the mirror's stylesheet in lockstep too.
const css = readFileSync(join(ROOT, 'lifetime.fi/shared-assets/front-page.css'), 'utf8');
const cssOut = join(ROOT, 'landing-pages/lifetime-fi/shared-assets/front-page.css');
let cssCur = '';
try {
  cssCur = readFileSync(cssOut, 'utf8');
} catch {
  /* new */
}
if (cssCur !== css) {
  if (CHECK) {
    console.error('stale: mirror front-page.css');
    stale++;
  } else {
    writeFileSync(cssOut, css);
    console.log('wrote mirror front-page.css');
  }
}
if (CHECK && stale) process.exit(1);
if (CHECK) console.log('front pages up to date');
