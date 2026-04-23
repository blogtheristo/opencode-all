/**
 * OneLifetime.World Vertical Language Bar v1.1
 * Introduced-In: PR-TBD (iceye-jgi-deforestation)
 * Code-Version: 1.1
 * Branch: claude/iceye-jgi-deforestation-PSzCd
 * Date: 2026-04-23
 * Owner: Lifetime Oy
 *
 * v1.1 — Matched dws10.com quality: 5 European languages (FI | SV | DE | FR | EN),
 *        per-page-type one-liners (home | blog | press). Each string is a single
 *        tight sentence aligned with the DWS Skilled Taxonomy brand tier.
 * v1.0 — 2026-04-17: Initial release. 3 languages (EN | FI | SV), single text per language.
 *
 * PAGE ELEMENT — not a menu/nav element.
 * onelifetime.world does not have language subdirectories, so the bar updates
 * the localStorage preference in-place. If a hreflang alternate link exists for
 * the current page (e.g. a translated blog post), clicking redirects to it.
 * Shares localStorage key 'dws-lang' with dws10.com ironclad-nav.js.
 *
 * Usage: <script src="/shared-assets/olw-vertical-lang-bar.js"></script>
 */
(function () {
  'use strict';

  if (window.__olwVlbLoaded) return;
  window.__olwVlbLoaded = true;

  var LANGS = [
    {
      code: 'fi',
      name: 'Suomi',
      flag: '🇫🇮',
      home: 'Suvereenit AI-agentit Euroopan teollisuudelle. Rakennettu Suomessa.',
      blog: 'Lifetime Scope — kentältä teollisen AI:n eturintamalta, joka toinen viikko.',
      press: 'Viralliset tiedotteet Lifetime Oy:ltä — DWS IQ, KYA ja Sovereign Stack.',
    },
    {
      code: 'sv',
      name: 'Svenska',
      flag: '🇸🇪',
      home: 'Suveräna AI-agenter för europeisk industri. Byggda i Finland.',
      blog: 'Lifetime Scope — fältrapporter från industriell AI, varannan vecka.',
      press: 'Officiella pressmeddelanden från Lifetime Oy — DWS IQ, KYA, sovereign stack.',
    },
    {
      code: 'de',
      name: 'Deutsch',
      flag: '🇩🇪',
      home: 'Souveräne KI-Agenten für Europas Industrie. Entwickelt in Finnland.',
      blog: 'Lifetime Scope — Feldberichte von der industriellen KI-Front, alle zwei Wochen.',
      press: 'Offizielle Pressemitteilungen von Lifetime Oy — DWS IQ, KYA, Sovereign Stack.',
    },
    {
      code: 'fr',
      name: 'Français',
      flag: '🇫🇷',
      home: 'Agents IA souverains pour l’industrie européenne. Conçus en Finlande.',
      blog: 'Lifetime Scope — chroniques du terrain de l’IA industrielle, toutes les deux semaines.',
      press: 'Communiqués de presse officiels de Lifetime Oy — DWS IQ, KYA, sovereign stack.',
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇬🇧',
      home: 'Sovereign AI agents for European industry. Built in Finland.',
      blog: 'Lifetime Scope — field notes from the industrial AI frontier, every other week.',
      press: 'Official press releases from Lifetime Oy — DWS IQ, KYA, and the sovereign stack.',
    },
  ];

  var storedLang = localStorage.getItem('dws-lang');
  var currentLang = LANGS.some(function (l) {
    return l.code === storedLang;
  })
    ? storedLang
    : 'en';
  if (storedLang !== currentLang) localStorage.setItem('dws-lang', currentLang);

  // Detect page type from path for one-liner selection
  var path = window.location.pathname;
  var pageType = 'home';
  if (path.indexOf('/press') !== -1) pageType = 'press';
  else if (path.indexOf('/blog') !== -1 || path.indexOf('/posts') !== -1) pageType = 'blog';

  if (!document.getElementById('olw-vlb-style')) {
    var css = [
      '.olw-vlb {',
      '  background: rgba(15, 23, 42, 0.97);',
      '  border-bottom: 1px solid rgba(96,165,250,0.18);',
      '  font-family: system-ui, -apple-system, sans-serif;',
      '}',
      '.olw-vlb-heading {',
      '  text-align: center;',
      '  padding: 12px 20px 6px;',
      '  font-size: 0.65rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.16em;',
      '  text-transform: uppercase;',
      '  color: rgba(96,165,250,0.55);',
      '}',
      'div.olw-vlb-row {',
      '  display: flex;',
      '  align-items: center;',
      '  padding: 12px 28px;',
      '  border-top: 1px solid rgba(255,255,255,0.05);',
      '  cursor: pointer;',
      '  transition: background 0.16s;',
      '}',
      'div.olw-vlb-row:hover {',
      '  background: rgba(255,255,255,0.04);',
      '}',
      '.olw-vlb-row.olw-vlb-active {',
      '  background: rgba(96,165,250,0.07);',
      '  border-left: 3px solid rgba(96,165,250,0.5);',
      '  padding-left: 25px;',
      '}',
      '.olw-vlb-lang {',
      '  font-size: 0.74rem;',
      '  font-weight: 700;',
      '  color: rgba(148,163,184,0.7);',
      '  min-width: 74px;',
      '  flex-shrink: 0;',
      '  letter-spacing: 0.03em;',
      '}',
      '.olw-vlb-row.olw-vlb-active .olw-vlb-lang {',
      '  color: #60a5fa;',
      '}',
      '.olw-vlb-text {',
      '  flex: 1;',
      '  font-size: 0.88rem;',
      '  color: rgba(203,213,225,0.7);',
      '  line-height: 1.35;',
      '  padding: 0 16px;',
      '}',
      '.olw-vlb-row.olw-vlb-active .olw-vlb-text {',
      '  color: #cbd5e1;',
      '}',
      '.olw-vlb-flag {',
      '  font-size: 1.45rem;',
      '  flex-shrink: 0;',
      '  line-height: 1;',
      '}',
      '@media (max-width: 640px) {',
      '  div.olw-vlb-row { padding: 10px 14px; }',
      '  .olw-vlb-row.olw-vlb-active { padding-left: 11px; }',
      '  .olw-vlb-text { font-size: 0.8rem; padding: 0 10px; }',
      '  .olw-vlb-lang { min-width: 62px; font-size: 0.7rem; }',
      '  .olw-vlb-flag { font-size: 1.2rem; }',
      '}',
    ].join('\n');

    var style = document.createElement('style');
    style.id = 'olw-vlb-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function build() {
    var el = document.createElement('div');
    el.className = 'olw-vlb';
    el.setAttribute('role', 'navigation');
    el.setAttribute('aria-label', '5 European languages');

    var rows = LANGS.map(function (l) {
      var activeCls = l.code === currentLang ? ' olw-vlb-active' : '';
      return (
        '<div class="olw-vlb-row' +
        activeCls +
        '" lang="' +
        l.code +
        '" tabindex="0">' +
        '<span class="olw-vlb-lang">' +
        l.name +
        '</span>' +
        '<span class="olw-vlb-text">' +
        (l[pageType] || l.home) +
        '</span>' +
        '<span class="olw-vlb-flag">' +
        l.flag +
        '</span>' +
        '</div>'
      );
    }).join('');

    el.innerHTML = '<div class="olw-vlb-heading">🌍 5 European Languages</div>' + rows;

    el.querySelectorAll('.olw-vlb-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var lang = row.getAttribute('lang');
        localStorage.setItem('dws-lang', lang);
        currentLang = lang;
        el.querySelectorAll('.olw-vlb-row').forEach(function (r) {
          r.classList.remove('olw-vlb-active');
        });
        row.classList.add('olw-vlb-active');
        window.dispatchEvent(new CustomEvent('dws-lang-change', { detail: { lang: lang } }));
        // Navigate to alternate language version if hreflang link exists (blog posts)
        var alt = document.querySelector('link[hreflang="' + lang + '"]');
        if (alt && alt.href && alt.href !== window.location.href) {
          window.location.href = alt.href;
        }
      });
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          row.click();
        }
      });
    });

    // Insert before main content (after nav)
    var nav = document.querySelector('nav');
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(el, nav.nextSibling);
      return;
    }
    var main = document.querySelector('main');
    if (main && main.parentNode) {
      main.parentNode.insertBefore(el, main);
      return;
    }
    document.body.insertBefore(el, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
