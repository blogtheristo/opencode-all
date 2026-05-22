/**
 * DWS10.com Vertical Language Bar v1.1
 * Introduced-In: PR-TBD (restore-language-bar) / updated: claude/add-hardware-products-MY7X7
 * Code-Version: 1.1
 * Branch: claude/add-hardware-products-MY7X7
 * Date: 2026-05-17
 * Owner: Lifetime Oy
 *
 * PAGE ELEMENT — not a menu/nav element.
 * Vertical 5-language showcase with hero text and country flag on the right.
 * Shows all 5 EU languages simultaneously. No pulldown. No redirect on store/product pages.
 * Order: Suomi | Svenska | Deutsch | Français | English
 *
 * Usage: <script src="/shared-assets/vertical-lang-bar.js"></script>
 *
 * Also exports window.dwsVlbCardHTML() for use inside product cards (buy/index.html).
 * Shares localStorage key 'dws-lang' with ironclad-nav.js.
 *
 * v1.1 — Added product version line (Control Room / Situation Room hardware bundles).
 */
(function () {
  'use strict';

  var LANGS = [
    {
      code: 'fi',
      name: 'Suomi',
      flag: '\uD83C\uDDEB\uD83C\uDDEE',
      href: '/fi/',
      home: 'Pohjoismainen teollisuus-AI. Rakennettu Suomessa, Pohjoismaille.',
      store: 'Suvereeneja AI-tuotteita eurooppalaisille yrityksille.',
      product: 'Kultainen br\u00e4ndistandardisi, teko\u00e4lyagentit ja tuotantokone.',
      versions: 'Control Room (1\u00d7 GN100) 4\u00a0994\u00a0\u20ac \u00b7 Situation Room (2\u00d7 sillattu) 8\u00a0993\u00a0\u20ac',
    },
    {
      code: 'sv',
      name: 'Svenska',
      flag: '\uD83C\uDDF8\uD83C\uDDEA',
      href: '/sv/',
      home: 'Nordisk industri-AI. Byggd i Finland, f\u00f6r Norden.',
      store: 'Suvern\u00e4na AI-produkter f\u00f6r europeiska f\u00f6retag.',
      product: 'Din guldstandard f\u00f6r varum\u00e4rke, AI-agenter och produktionsmotor.',
      versions: 'Control Room (1\u00d7 GN100) 4 994 \u20ac \u00b7 Situation Room (2\u00d7 bryggad) 8 993 \u20ac',
    },
    {
      code: 'de',
      name: 'Deutsch',
      flag: '\uD83C\uDDE9\uD83C\uDDEA',
      href: '/de/',
      home: 'Gestalte, wie Europas Industrial IQ Compliance-Schwungrad sich dreht.',
      store: 'Souver\u00e4ne KI-Produkte f\u00fcr europ\u00e4ische Unternehmen.',
      product: 'Ihr Goldstandard f\u00fcr Marke, KI-Agenten und Produktions-Engine.',
      versions: 'Control Room (1\u00d7 GN100) 4.994 \u20ac \u00b7 Situation Room (2\u00d7 gebr\u00fcckt) 8.993 \u20ac',
    },
    {
      code: 'fr',
      name: 'Fran\u00e7ais',
      flag: '\uD83C\uDDEB\uD83C\uDDF7',
      href: '/fr/',
      home: 'Fa\u00e7onnez la dynamique du volant d\u2019inertie Industrial IQ Compliance en Europe.',
      store: 'Produits IA souverains pour les entreprises europ\u00e9ennes.',
      product: 'Votre standard d\u2019or pour la marque, les agents IA et le moteur de production.',
      versions: 'Control Room (1\u00d7 GN100) 4 994 \u20ac \u00b7 Situation Room (2\u00d7 pont\u00e9e) 8 993 \u20ac',
    },
    {
      code: 'en',
      name: 'English',
      flag: '\uD83C\uDDEC\uD83C\uDDE7',
      href: '/',
      home: 'Nordic Industrial AI. Built in Finland, for the Nordics.',
      store: 'Sovereign AI products for European enterprises.',
      product: 'Your brand Gold Standards, AI agents and Firehorse production engine.',
      versions: 'Control Room (1× GN100) €4,994 · Situation Room (2× bridged) €8,993',
    },
  ];

  // Compact strip for product cards — set up immediately so createProductCard() can use it
  window.dwsVlbCardHTML = function () {
    return (
      '<div class="dws-vlb-card">' +
      LANGS.map(function (l) {
        return (
          '<div class="dws-vlb-card-row">' +
          '<span class="dws-vlb-card-lang">' +
          l.name +
          '</span>' +
          '<span class="dws-vlb-card-text">' +
          l.store +
          '</span>' +
          '<span class="dws-vlb-card-flag">' +
          l.flag +
          '</span>' +
          '</div>'
        );
      }).join('') +
      '</div>'
    );
  };

  // Idempotency guard — section injection only once per page load
  if (window.__dwsVlbLoaded) return;
  window.__dwsVlbLoaded = true;

  var stays = !!document.querySelector('meta[name="dws-lang-stay"]');
  var storedLang = localStorage.getItem('dws-lang');
  var currentLang = LANGS.some(function (l) {
    return l.code === storedLang;
  })
    ? storedLang
    : 'en';

  // Detect page type from path
  var path = window.location.pathname;
  var pageType = 'home';
  if (path.indexOf('/buy') !== -1) pageType = 'store';
  else if (path.indexOf('/products/') !== -1) pageType = 'product';

  // Inject CSS once
  if (!document.getElementById('dws-vlb-style')) {
    var css = [
      '.dws-vlb {',
      '  background: linear-gradient(180deg, #091e53 0%, #071a4a 100%);',
      '  border-bottom: 2px solid rgba(255,209,102,0.18);',
      '  font-family: "IBM Plex Sans", system-ui, -apple-system, sans-serif;',
      '}',
      '.dws-vlb-heading {',
      '  text-align: center;',
      '  padding: 14px 20px 8px;',
      '  font-size: 0.67rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.16em;',
      '  text-transform: uppercase;',
      '  color: rgba(255,209,102,0.55);',
      '}',
      'a.dws-vlb-row, div.dws-vlb-row {',
      '  display: flex;',
      '  align-items: center;',
      '  padding: 13px 28px;',
      '  border-top: 1px solid rgba(255,255,255,0.06);',
      '  text-decoration: none;',
      '  cursor: pointer;',
      '  transition: background 0.16s;',
      '  color: inherit;',
      '}',
      'a.dws-vlb-row:hover, div.dws-vlb-row:hover {',
      '  background: rgba(255,255,255,0.05);',
      '}',
      '.dws-vlb-row.dws-vlb-active {',
      '  background: rgba(255,209,102,0.07);',
      '  border-left: 3px solid rgba(255,209,102,0.5);',
      '  padding-left: 25px;',
      '}',
      '.dws-vlb-lang {',
      '  font-size: 0.75rem;',
      '  font-weight: 700;',
      '  color: rgba(226,232,240,0.5);',
      '  min-width: 80px;',
      '  flex-shrink: 0;',
      '  letter-spacing: 0.03em;',
      '}',
      '.dws-vlb-row.dws-vlb-active .dws-vlb-lang {',
      '  color: #FFD166;',
      '}',
      '.dws-vlb-text {',
      '  flex: 1;',
      '  font-size: 0.9rem;',
      '  color: rgba(226,232,240,0.72);',
      '  line-height: 1.35;',
      '  padding: 0 18px;',
      '}',
      '.dws-vlb-row.dws-vlb-active .dws-vlb-text {',
      '  color: #e2e8f0;',
      '}',
      '.dws-vlb-text-main { display: block; }',
      '.dws-vlb-versions {',
      '  display: block;',
      '  font-size: 0.7rem;',
      '  color: rgba(255,209,102,0.55);',
      '  margin-top: 3px;',
      '  letter-spacing: 0.01em;',
      '}',
      '.dws-vlb-row.dws-vlb-active .dws-vlb-versions {',
      '  color: rgba(255,209,102,0.85);',
      '}',
      '.dws-vlb-flag {',
      '  font-size: 1.55rem;',
      '  flex-shrink: 0;',
      '  line-height: 1;',
      '}',
      // Compact card strip
      '.dws-vlb-card {',
      '  border-top: 1px solid rgba(255,255,255,0.07);',
      '  margin-top: 14px;',
      '  padding-top: 10px;',
      '}',
      '.dws-vlb-card-row {',
      '  display: flex;',
      '  align-items: center;',
      '  padding: 2px 0;',
      '}',
      '.dws-vlb-card-lang {',
      '  font-size: 0.63rem;',
      '  font-weight: 700;',
      '  color: rgba(226,232,240,0.32);',
      '  min-width: 52px;',
      '  flex-shrink: 0;',
      '}',
      '.dws-vlb-card-text {',
      '  flex: 1;',
      '  font-size: 0.63rem;',
      '  color: rgba(226,232,240,0.38);',
      '  line-height: 1.3;',
      '  padding: 0 6px;',
      '}',
      '.dws-vlb-card-flag {',
      '  font-size: 0.82rem;',
      '  flex-shrink: 0;',
      '}',
      '@media (max-width: 640px) {',
      '  a.dws-vlb-row, div.dws-vlb-row { padding: 11px 16px; }',
      '  .dws-vlb-row.dws-vlb-active { padding-left: 13px; }',
      '  .dws-vlb-text { font-size: 0.82rem; padding: 0 10px; }',
      '  .dws-vlb-lang { min-width: 66px; font-size: 0.7rem; }',
      '  .dws-vlb-flag { font-size: 1.28rem; }',
      '}',
    ].join('\n');

    var style = document.createElement('style');
    style.id = 'dws-vlb-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildSection(textKey) {
    var el = document.createElement('div');
    el.className = 'dws-vlb';
    el.setAttribute('role', 'navigation');
    el.setAttribute('aria-label', '5 European languages');

    var rows = LANGS.map(function (l) {
      var isActive = l.code === currentLang;
      var tag = stays ? 'div' : 'a';
      var hrefAttr = stays ? '' : ' href="' + l.href + '"';
      var activeCls = isActive ? ' dws-vlb-active' : '';
      return (
        '<' +
        tag +
        ' class="dws-vlb-row' +
        activeCls +
        '"' +
        hrefAttr +
        ' lang="' +
        l.code +
        '" tabindex="0">' +
        '<span class="dws-vlb-lang">' +
        l.name +
        '</span>' +
        '<span class="dws-vlb-text">' +
        '<span class="dws-vlb-text-main">' + l[textKey] + '</span>' +
        '<span class="dws-vlb-versions">' + l.versions + '</span>' +
        '</span>' +
        '<span class="dws-vlb-flag">' +
        l.flag +
        '</span>' +
        '</' +
        tag +
        '>'
      );
    }).join('');

    el.innerHTML = '<div class="dws-vlb-heading">\uD83C\uDF0D 5 European Languages</div>' + rows;

    // On stay pages (store/product): clicking switches active language in-place
    if (stays) {
      el.querySelectorAll('.dws-vlb-row').forEach(function (row) {
        row.addEventListener('click', function () {
          var lang = row.getAttribute('lang');
          localStorage.setItem('dws-lang', lang);
          currentLang = lang;
          el.querySelectorAll('.dws-vlb-row').forEach(function (r) {
            r.classList.remove('dws-vlb-active');
          });
          row.classList.add('dws-vlb-active');
          window.dispatchEvent(new CustomEvent('dws-lang-change', { detail: { lang: lang } }));
          var navCode = document.querySelector('.ironclad-lang-code');
          if (navCode) navCode.textContent = lang.toUpperCase();
        });
        row.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            row.click();
          }
        });
      });
    }

    return el;
  }

  function init() {
    var section = buildSection(pageType);

    if (pageType === 'home') {
      // Place just before the campaign-hero section
      var hero = document.querySelector('.campaign-hero');
      if (hero && hero.parentNode) {
        hero.parentNode.insertBefore(section, hero);
        return;
      }
      // Fallback: first section on the page
      var firstSection = document.querySelector('section');
      if (firstSection && firstSection.parentNode) {
        firstSection.parentNode.insertBefore(section, firstSection);
        return;
      }
    } else {
      // Store and product pages: before the main .container
      var container = document.querySelector('.container');
      if (container && container.parentNode) {
        container.parentNode.insertBefore(section, container);
        return;
      }
    }

    // Ultimate fallback
    document.body.insertBefore(section, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
