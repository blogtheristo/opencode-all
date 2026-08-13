#!/usr/bin/env node
// One-off build script: renders the 5 approved arvonluonnin-ajurit-2026 blog drafts
// (docs/blog-drafts/) into onelifetime.world/posts/ HTML, dual-folder synced.
import fs from 'node:fs';
import path from 'node:path';

const REPO = '/home/user/dws6';
const DRAFTS_DIR = path.join(REPO, 'docs/blog-drafts');
const OUT_DIRS = [
  path.join(REPO, 'onelifetime.world/posts'),
  path.join(REPO, 'landing-pages/onelifetime-world/posts'),
];

const LANGS = ['', '.fi', '.sv', '.de', '.fr']; // "" = en (base filename)
const DRAFT_FILES = {
  '': 'arvonluonnin-ajurit-2026.md',
  '.fi': 'arvonluonnin-ajurit-2026.fi.md',
  '.sv': 'arvonluonnin-ajurit-2026.sv.md',
  '.de': 'arvonluonnin-ajurit-2026.de.md',
  '.fr': 'arvonluonnin-ajurit-2026.fr.md',
};
const HREFLANG = { '': 'en', '.fi': 'fi', '.sv': 'sv', '.de': 'de', '.fr': 'fr' };
const OG_LOCALE = { '': 'en_US', '.fi': 'fi_FI', '.sv': 'sv_SE', '.de': 'de_DE', '.fr': 'fr_FR' };
const CATEGORY_LABEL = {
  '': 'Field Note',
  '.fi': 'Field Note',
  '.sv': 'Field Note',
  '.de': 'Field Note',
  '.fr': 'Field Note',
};
// EU AI Act Article 50(4) — DWS_BLOG_STANDARD §3.2.1. Every AI-drafted page on a
// regulatory/compliance topic carries this notice unless a named human reviewer is
// credited on the page. None of these 5 pages has that credit recorded, so all 5 carry it.
const AI_NOTICE = {
  '': {
    label: 'AI-generated content',
    body: 'This page was drafted with AI assistance from Lifetime Oy&rsquo;s internal materials (Konsultoinnin k&auml;sikirja &sect;2.1/&sect;2.2) and has not had a named human reviewer&rsquo;s sign-off recorded.',
  },
  '.fi': {
    label: 'Teko&auml;lyn tuottamaa sis&auml;lt&ouml;&auml;',
    body: 'T&auml;m&auml; sivu on laadittu teko&auml;lyavusteisesti Lifetime Oy:n sis&auml;isen materiaalin pohjalta, eik&auml; nimetty ihmisarvioija ole viel&auml; hyv&auml;ksynyt sit&auml;.',
    seeAlso: {
      href: '/posts/arvonluonnin-ajurit-2026.html',
      hreflang: 'en',
      lang: 'en',
      text: 'Read the English version &rarr;',
    },
  },
  '.sv': {
    label: 'AI-genererat inneh&aring;ll',
    body: 'Den h&auml;r sidan &auml;r skriven med AI-assistans utifr&aring;n HIC-tillhandah&aring;llet k&auml;llmaterial och har inte f&aring;tt en namngiven m&auml;nsklig granskares godk&auml;nnande registrerat.',
    seeAlso: {
      href: '/posts/arvonluonnin-ajurit-2026.html',
      hreflang: 'en',
      lang: 'en',
      text: 'Read the English version &rarr;',
    },
  },
  '.de': {
    label: 'KI-generierte Inhalte',
    body: 'Diese Seite wurde mit KI-Unterst&uuml;tzung auf Basis von HIC-bereitgestelltem Quellmaterial verfasst und hat noch keine dokumentierte Freigabe durch einen namentlich genannten menschlichen Pr&uuml;fer.',
    seeAlso: {
      href: '/posts/arvonluonnin-ajurit-2026.html',
      hreflang: 'en',
      lang: 'en',
      text: 'Read the English version &rarr;',
    },
  },
  '.fr': {
    label: 'Contenu g&eacute;n&eacute;r&eacute; par IA',
    body: 'Cette page a &eacute;t&eacute; r&eacute;dig&eacute;e avec l&rsquo;assistance de l&rsquo;IA &agrave; partir d&rsquo;un texte source fourni par le HIC, et n&rsquo;a pas encore fait l&rsquo;objet d&rsquo;une validation enregistr&eacute;e par un relecteur humain nomm&eacute;ment identifi&eacute;.',
    seeAlso: {
      href: '/posts/arvonluonnin-ajurit-2026.html',
      hreflang: 'en',
      lang: 'en',
      text: 'Read the English version &rarr;',
    },
  },
};

const SUBSCRIBE_LABEL = {
  '': {
    h: 'Subscribe to Lifetime Scope Journal',
    p: 'Weekly insights on EU compliance, AI agents, and industrial transformation.',
    cta: 'Subscribe',
  },
  '.fi': {
    h: 'Tilaa Lifetime Scope Journal',
    p: 'Viikoittaisia oivalluksia EU-compliancesta, AI-agenteista ja teollisuuden muutoksesta.',
    cta: 'Tilaa',
  },
  '.sv': {
    h: 'Prenumerera på Lifetime Scope Journal',
    p: 'Veckovisa insikter om EU-efterlevnad, AI-agenter och industriell transformation.',
    cta: 'Prenumerera',
  },
  '.de': {
    h: 'Lifetime Scope Journal abonnieren',
    p: 'Wöchentliche Einblicke zu EU-Compliance, KI-Agenten und industriellem Wandel.',
    cta: 'Abonnieren',
  },
  '.fr': {
    h: 'Abonnez-vous à Lifetime Scope Journal',
    p: 'Analyses hebdomadaires sur la conformité européenne, les agents IA et la transformation industrielle.',
    cta: "S'abonner",
  },
};

const SLUG = 'arvonluonnin-ajurit-2026';
const CANONICAL_BASE = 'https://onelifetime.world/posts/';
const DATE_ISO = '2026-08-06';

function parseFrontmatter(raw) {
  const lines = raw.split('\n');
  const fm = {};
  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      i++;
      break;
    }
    const m = line.match(/^([A-Za-z ]+):\s?(.*)$/);
    if (m) fm[m[1].trim()] = m[2].trim();
  }
  const body = lines.slice(i).join('\n');
  return { fm, body };
}

function attrEscape(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Minimal markdown -> HTML for our controlled draft body syntax.
function mdInline(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;br&gt;/g, '<br>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
}

function isBylineLine(line) {
  // Matches the closing italic byline paragraph (founder/CEO signoff), any language.
  return line.startsWith('_') && line.endsWith('_') && /rni|CEO|vd |toimitusjohtaja/.test(line);
}

function mdToHtml(body) {
  const lines = body.split('\n');
  let html = '';
  let inList = false;
  let inQuote = false;
  let skipNextByline = false;

  function closeList() {
    if (inList) {
      html += '</ul>\n';
      inList = false;
    }
  }
  function closeQuote() {
    if (inQuote) {
      html += '</blockquote>\n';
      inQuote = false;
    }
  }

  for (let raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === '') {
      continue;
    }

    if (line.startsWith('# ')) {
      // First H1 is the post title, already rendered separately — skip it,
      // and skip the "Field Note · date · byline" line right after it too
      // (rendered separately in the page header).
      skipNextByline = true;
      continue;
    }
    if (skipNextByline) {
      skipNextByline = false;
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      closeQuote();
      html += `<h3>${mdInline(line.slice(4))}</h3>\n`;
      continue;
    }
    if (line.startsWith('## ')) {
      closeList();
      closeQuote();
      html += `<h2>${mdInline(line.slice(3))}</h2>\n`;
      continue;
    }
    if (line.startsWith('- ')) {
      closeQuote();
      if (!inList) {
        html += '<ul>\n';
        inList = true;
      }
      html += `  <li>${mdInline(line.slice(2))}</li>\n`;
      continue;
    }
    if (line.startsWith('  - ')) {
      html += `  <li style="margin-left:20px;">${mdInline(line.slice(4))}</li>\n`;
      continue;
    }
    if (line.startsWith('> ')) {
      closeList();
      if (!inQuote) {
        html += '<blockquote class="pull">\n';
        inQuote = true;
      }
      html += `<p>${mdInline(line.slice(2))}</p>\n`;
      continue;
    }
    if (line.trim() === '---') {
      closeList();
      closeQuote();
      continue; // separator before byline, skip — byline rendered separately
    }
    if (isBylineLine(line)) {
      continue; // byline handled separately below
    }
    closeList();
    closeQuote();
    html += `<p>${mdInline(line)}</p>\n`;
  }
  closeList();
  closeQuote();
  return html;
}

function fillTemplate({ lang, fm, articleHtml, heroSrc, subtitleLine }) {
  const filename = lang === '' ? `${SLUG}.html` : `${SLUG}${lang}.html`;
  const canonical = CANONICAL_BASE + filename;
  const titleRaw = fm['Title'];
  const descriptionRaw = subtitleLine;
  const title = attrEscape(titleRaw);
  const description = attrEscape(descriptionRaw);
  const htmlLang = HREFLANG[lang];
  const dateDisplay = fm['Date'];

  const hreflangTags = LANGS.map((l) => {
    const f = l === '' ? `${SLUG}.html` : `${SLUG}${l}.html`;
    return `    <link rel="alternate" hreflang="${HREFLANG[l]}" href="${CANONICAL_BASE}${f}" />`;
  }).join('\n');
  const xDefault = `    <link rel="alternate" hreflang="x-default" href="${CANONICAL_BASE}${SLUG}.html" />`;

  const sub = SUBSCRIBE_LABEL[lang];
  const category = CATEGORY_LABEL[lang];
  const byline = `${dateDisplay.split('-').reverse().join('.')} &middot; Risto Anton P&auml;&auml;rni &middot; Espoo, Finland`;

  const notice = AI_NOTICE[lang];
  const seeAlsoHtml = notice.seeAlso
    ? ` <a href="${notice.seeAlso.href}" hreflang="${notice.seeAlso.hreflang}" lang="${notice.seeAlso.lang}" style="color:#22d3ee;text-decoration:underline">${notice.seeAlso.text}</a>`
    : '';
  const aiNoticeHtml = `<aside class="ai-notice" role="note" aria-label="${notice.label}" style="margin:0 0 1.75rem;padding:0.85rem 1.1rem;border-left:3px solid #94a3b8;background:rgba(30,41,59,0.55);color:#cbd5e1;font-size:0.85rem;line-height:1.6">
          <strong style="color:#f1f5f9">${notice.label}</strong> &middot; ${notice.body}${seeAlsoHtml}
        </aside>`;

  return `<!doctype html>
<!--
  ${title}
  Language: ${htmlLang}
  Slug: ${SLUG}
  Date: ${DATE_ISO}
  Owner: Lifetime Oy
  Note: Multi-language field note on Lifetime Oy's value-creation drivers
  (docs/KONSULTOINNIN_KASIKIRJA_2026.md sections 2.1/2.2). HIC-approved 2026-08-06.
-->
<html lang="${htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="author" content="Risto Anton Päärni" />
    <meta name="date" content="${DATE_ISO}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="${OG_LOCALE[lang]}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="Lifetime Scope Journal" />
    <meta property="og:image" content="https://${heroSrc}" />
    <meta property="article:published_time" content="${DATE_ISO}" />
    <meta property="article:author" content="Risto Anton Päärni" />
    <meta property="article:section" content="Value Creation" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
${hreflangTags}
${xDefault}
    <link rel="stylesheet" href="../static/css/style.css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="/shared-assets/olw-vertical-lang-bar.js" defer></script>
    <style>
      .version-chip {
        display: inline-block;
        padding: 4px 12px;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #60a5fa;
        background: rgba(96, 165, 250, 0.08);
        border: 1px solid rgba(96, 165, 250, 0.25);
        border-radius: 9999px;
      }
      .hero-fig {
        margin: 8px 0 32px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(96, 165, 250, 0.2);
      }
      .hero-fig img { width: 100%; height: auto; display: block; }
      .prose-light h2 {
        font-size: 1.6rem;
        font-weight: 700;
        color: #f1f5f9;
        margin-top: 40px;
        margin-bottom: 14px;
      }
      .prose-light h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #e2e8f0;
        margin-top: 28px;
        margin-bottom: 10px;
      }
      .prose-light p {
        font-size: 1.02rem;
        line-height: 1.75;
        color: #cbd5e1;
        margin-bottom: 18px;
      }
      .prose-light ul {
        margin-bottom: 20px;
        list-style: disc;
        padding-left: 22px;
      }
      .prose-light li {
        color: #cbd5e1;
        padding-left: 4px;
        margin-bottom: 8px;
      }
      .prose-light strong { color: #f1f5f9; }
      .prose-light a { color: #60a5fa; }
      .prose-light a:hover { text-decoration: underline; }
      blockquote.pull {
        border-left: 4px solid #60a5fa;
        background: rgba(96, 165, 250, 0.06);
        border-radius: 0 8px 8px 0;
        padding: 20px 24px;
        margin: 28px 0;
        font-style: italic;
        color: #e2e8f0;
      }
    </style>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": ${JSON.stringify(titleRaw)},
        "description": ${JSON.stringify(descriptionRaw)},
        "author": { "@type": "Person", "name": "Risto Anton Päärni", "url": "https://onelifetime.world" },
        "publisher": { "@type": "Organization", "name": "Lifetime Oy", "url": "https://dws10.com" },
        "datePublished": "${DATE_ISO}",
        "mainEntityOfPage": "${canonical}",
        "articleSection": "Value Creation",
        "inLanguage": "${htmlLang}"
      }
    </script>
  </head>
  <body
    class="font-sans antialiased flex flex-col min-h-screen"
    style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%); color: #f1f5f9;"
  >
    <script>
      function toggleMobileMenu() {
        var menu = document.getElementById("mobileMenu");
        menu.classList.toggle("hidden");
      }
    </script>

    <nav style="background: #1e293b; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3)" class="sticky top-0 z-50 border-b border-gray-700">
      <div class="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto w-full">
        <button onclick="toggleMobileMenu()" class="flex flex-col gap-1.5" aria-label="Menu">
          <span class="w-6 h-0.5 bg-gray-400 block"></span>
          <span class="w-6 h-0.5 bg-gray-400 block"></span>
          <span class="w-6 h-0.5 bg-gray-400 block"></span>
        </button>
        <a href="/" class="flex items-center">
          <img src="../OneLifetime+Logo.png" alt="OneLifetime.World" class="h-8 w-auto" style="filter: brightness(1.1)" />
        </a>
        <a href="https://dws10.com/buy" class="text-xs font-bold px-3 py-1 rounded" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a">Store</a>
      </div>
      <div id="mobileMenu" class="hidden bg-slate-800 border-t border-gray-700 px-4 py-3 space-y-2">
        <a href="/blog/" class="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">Lifetime Scope Journal</a>
        <a href="/press/" class="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">Press</a>
        <a href="https://dws10.com" target="_blank" class="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">DWS IQ Platform</a>
        <a href="https://dws10.com/buy" target="_blank" class="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">Store</a>
      </div>
    </nav>

    <main class="flex-1">
      <article class="max-w-3xl mx-auto px-4 py-12 prose-light">
        <header class="mb-8">
          <span class="version-chip">${category}</span>
          <h1 class="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style="color: #f8fafc">
            ${title}
          </h1>
          <p class="mt-4 text-base text-gray-400">${byline}</p>
        </header>

        ${aiNoticeHtml}

        <figure class="hero-fig">
          <img src="../${heroSrc.replace('onelifetime.world/', '')}" alt="${title}" loading="lazy" />
        </figure>

        ${articleHtml}

        <p style="margin-top:40px;"><em>Risto Anton P&auml;&auml;rni &mdash; Founder, CEO, Lifetime Oy.</em></p>

        <div class="mt-16 p-8 rounded-lg" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(96, 165, 250, 0.2);">
          <h3 class="text-xl font-bold mb-2" style="color: #e2e8f0;">${sub.h}</h3>
          <p class="text-sm text-gray-400 mb-4">${sub.p}</p>
          <a href="https://dws10.com/contact/" class="inline-block px-6 py-2 rounded text-sm font-bold" style="background: linear-gradient(135deg, #0066cc, #2563eb); color: #fff;">${sub.cta}</a>
        </div>
      </article>
    </main>

    <script src="/shared-assets/footer/ironclad-footer.js" defer></script>
  </body>
</html>
`;
}

for (const lang of LANGS) {
  const draftPath = path.join(DRAFTS_DIR, DRAFT_FILES[lang]);
  const raw = fs.readFileSync(draftPath, 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  if (fm['Status'] !== 'APPROVED') {
    throw new Error(`Refusing to build ${draftPath}: Status is "${fm['Status']}", not APPROVED`);
  }
  const heroSrc = fm['Hero image'];
  const articleHtml = mdToHtml(body);
  // Subtitle/description: first <p> content, stripped of tags, truncated.
  const firstP = (articleHtml.match(/<p>(.*?)<\/p>/) || ['', ''])[1].replace(/<[^>]+>/g, '');
  const subtitleLine = firstP.slice(0, 250);

  const html = fillTemplate({ lang, fm, articleHtml, heroSrc, subtitleLine });
  const filename = lang === '' ? `${SLUG}.html` : `${SLUG}${lang}.html`;
  for (const dir of OUT_DIRS) {
    fs.writeFileSync(path.join(dir, filename), html, 'utf8');
  }
  console.log(`Built ${filename}`);
}
