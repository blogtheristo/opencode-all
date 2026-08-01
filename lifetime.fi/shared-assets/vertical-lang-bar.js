/**
 * lifetime.fi Vertical Language Bar v1.0
 * Introduced-In: claude/lifetime-agents-loops-workflows-t3448v (2026-06-20)
 * Code-Version: 1.0
 * Owner: Lifetime Oy
 *
 * PAGE ELEMENT — not a menu/nav element.
 * Vertical 5-language showcase showing the "Agents. Loops. Workflows." milestone tagline.
 * Order: Suomi | Svenska | Deutsch | Français | English
 *
 * Usage: <script src="/shared-assets/vertical-lang-bar.js"></script>
 *
 * Shares localStorage key 'dws-lang' with ironclad-nav.js.
 * Themed to lifetime.fi palette: navy #0f172a / gold #b8860b.
 * Validates dws-lang against allowlist before use (DWS_SECURITY_STANDARD §coding-rules).
 *
 * Ported from dws10.com/shared-assets/vertical-lang-bar.js v1.1.
 * Registered as reusable productized component in docs/DWS_SKILLS_GUIDE.md.
 */
(function () {
  'use strict';

  var ALLOWED_LANGS = ['fi', 'sv', 'de', 'fr', 'en'];

  var LANGS = [
    {
      code: 'fi',
      name: 'Suomi',
      flag: '🇫🇮',
      href: '/fi/',
      text: 'Agentit. Silmukat. Työnkulut.',
    },
    {
      code: 'sv',
      name: 'Svenska',
      flag: '🇸🇪',
      href: '/sv/',
      text: 'Agenter. Loopar. Arbetsflöden.',
    },
    {
      code: 'de',
      name: 'Deutsch',
      flag: '🇩🇪',
      href: '/de/',
      text: 'Agenten. Schleifen. Workflows.',
    },
    {
      code: 'fr',
      name: 'Français',
      flag: '🇫🇷',
      href: '/fr/',
      text: 'Agents. Boucles. Flux de travail.',
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇬🇧',
      href: '/',
      text: 'Agents. Loops. Workflows.',
    },
  ];

  // Idempotency guard
  if (window.__lifetimeVlbLoaded) return;
  window.__lifetimeVlbLoaded = true;

  // Validate stored lang against allowlist (security: no arbitrary values written to DOM)
  var rawLang = localStorage.getItem('dws-lang');
  var currentLang = ALLOWED_LANGS.indexOf(rawLang) !== -1 ? rawLang : 'en';

  // Inject CSS once
  if (!document.getElementById('lifetime-vlb-style')) {
    var css = [
      '.lifetime-vlb {',
      '  background: linear-gradient(180deg, #0a1628 0%, #0f172a 100%);',
      '  border-bottom: 2px solid rgba(184,134,11,0.22);',
      '  font-family: "IBM Plex Sans", system-ui, -apple-system, sans-serif;',
      '}',
      '.lifetime-vlb-heading {',
      '  text-align: center;',
      '  padding: 14px 20px 8px;',
      '  font-size: 0.67rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.16em;',
      '  text-transform: uppercase;',
      '  color: rgba(184,134,11,0.55);',
      '}',
      'a.lifetime-vlb-row {',
      '  display: flex;',
      '  align-items: center;',
      '  padding: 13px 28px;',
      '  border-top: 1px solid rgba(255,255,255,0.06);',
      '  text-decoration: none;',
      '  cursor: pointer;',
      '  transition: background 0.16s;',
      '  color: inherit;',
      '}',
      'a.lifetime-vlb-row:hover {',
      '  background: rgba(255,255,255,0.05);',
      '}',
      '.lifetime-vlb-row.lifetime-vlb-active {',
      '  background: rgba(184,134,11,0.07);',
      '  border-left: 3px solid rgba(184,134,11,0.5);',
      '  padding-left: 25px;',
      '}',
      '.lifetime-vlb-lang {',
      '  font-size: 0.75rem;',
      '  font-weight: 700;',
      '  color: rgba(226,232,240,0.5);',
      '  min-width: 80px;',
      '  flex-shrink: 0;',
      '  letter-spacing: 0.03em;',
      '}',
      '.lifetime-vlb-row.lifetime-vlb-active .lifetime-vlb-lang {',
      '  color: #b8860b;',
      '}',
      '.lifetime-vlb-text {',
      '  flex: 1;',
      '  font-size: 0.9rem;',
      '  color: rgba(226,232,240,0.72);',
      '  line-height: 1.35;',
      '  padding: 0 18px;',
      '}',
      '.lifetime-vlb-row.lifetime-vlb-active .lifetime-vlb-text {',
      '  color: #e2e8f0;',
      '}',
      '.lifetime-vlb-flag {',
      '  font-size: 1.55rem;',
      '  flex-shrink: 0;',
      '  line-height: 1;',
      '}',
      '@media (max-width: 640px) {',
      '  a.lifetime-vlb-row { padding: 11px 16px; }',
      '  .lifetime-vlb-row.lifetime-vlb-active { padding-left: 13px; }',
      '  .lifetime-vlb-text { font-size: 0.82rem; padding: 0 10px; }',
      '  .lifetime-vlb-lang { min-width: 66px; font-size: 0.7rem; }',
      '  .lifetime-vlb-flag { font-size: 1.28rem; }',
      '}',
    ].join('\n');

    var style = document.createElement('style');
    style.id = 'lifetime-vlb-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildSection() {
    var el = document.createElement('div');
    el.className = 'lifetime-vlb';
    el.setAttribute('role', 'navigation');
    el.setAttribute('aria-label', '5 European languages');

    var rows = LANGS.map(function (l) {
      var isActive = l.code === currentLang;
      var activeCls = isActive ? ' lifetime-vlb-active' : '';
      return (
        '<a class="lifetime-vlb-row' +
        activeCls +
        '" href="' +
        l.href +
        '" lang="' +
        l.code +
        '" tabindex="0">' +
        '<span class="lifetime-vlb-lang">' +
        l.name +
        '</span>' +
        '<span class="lifetime-vlb-text">' +
        l.text +
        '</span>' +
        '<span class="lifetime-vlb-flag">' +
        l.flag +
        '</span>' +
        '</a>'
      );
    }).join('');

    el.innerHTML =
      '<div class="lifetime-vlb-heading">🌍 Sovereign by Design. Global by Choice.</div>' + rows;

    el.querySelectorAll('.lifetime-vlb-row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        var lang = row.getAttribute('lang');
        if (ALLOWED_LANGS.indexOf(lang) === -1) return;

        // Pages with their own in-page i18n (data-i18n) translate in place.
        // Only en/fi/sv have dedicated homepage subdirectories; de/fr do not,
        // so navigating their href would 404 — translate in place instead.
        var hasInPageI18n = !!document.querySelector('[data-i18n]');
        var LANGS_WITH_SUBDIRS = ['fi', 'sv', 'en'];
        var willNavigate = !hasInPageI18n && LANGS_WITH_SUBDIRS.indexOf(lang) !== -1;

        localStorage.setItem('dws-lang', lang);

        if (willNavigate) {
          // Let the anchor navigate to the language subdirectory; the target
          // page renders in the stored language. No event dispatch — avoids a
          // flash of translated nav/footer before the page unloads.
          return;
        }

        // Translate in place: suppress navigation and notify nav/footer/page.
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('dws-lang-change', { detail: { lang: lang } }));
        var navCode = document.querySelector('.ironclad-lang-code');
        if (navCode) navCode.textContent = lang.toUpperCase();
        el.querySelectorAll('.lifetime-vlb-row').forEach(function (r) {
          r.classList.remove('lifetime-vlb-active');
        });
        row.classList.add('lifetime-vlb-active');
      });
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          row.click();
        }
      });
    });

    return el;
  }

  function init() {
    var section = buildSection();
    // Place before the first <section> element (the hero)
    var firstSection = document.querySelector('section');
    if (firstSection && firstSection.parentNode) {
      firstSection.parentNode.insertBefore(section, firstSection);
      return;
    }
    document.body.insertBefore(section, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
