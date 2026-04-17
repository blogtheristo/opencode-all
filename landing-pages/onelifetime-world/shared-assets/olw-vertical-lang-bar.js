/**
 * OneLifetime.World Vertical Language Bar v1.0
 * Introduced-In: PR-TBD (restore-language-bar)
 * Code-Version: 1.0
 * Branch: claude/restore-language-bar-xH99X
 * Date: 2026-04-17
 * Owner: Lifetime Oy
 *
 * PAGE ELEMENT — not a menu/nav element.
 * Vertical 3-language showcase (EN | FI | SV) with hero text and flag on the right.
 * onelifetime.world does not have language subdirectories, so the bar updates
 * the localStorage preference in-place without redirecting.
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
      flag: '\uD83C\uDDEB\uD83C\uDDEE',
      text: 'Siirry nopeammin vanhoista toiminnoista \u00e4lykk\u00e4\u00e4seen p\u00e4\u00e4t\u00f6ksentekoon.',
    },
    {
      code: 'sv',
      name: 'Svenska',
      flag: '\uD83C\uDDF8\uD83C\uDDEA',
      text: 'G\u00e5 snabbare fr\u00e5n \u00e4ldre processer till intelligent beslutsfattande.',
    },
    {
      code: 'en',
      name: 'English',
      flag: '\uD83C\uDDEC\uD83C\uDDE7',
      text: 'Move faster from legacy operations to intelligent decisioning.',
    },
  ];

  var currentLang = localStorage.getItem('dws-lang') || 'en';

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
    el.setAttribute('aria-label', '3 languages');

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
        l.text +
        '</span>' +
        '<span class="olw-vlb-flag">' +
        l.flag +
        '</span>' +
        '</div>'
      );
    }).join('');

    el.innerHTML = '<div class="olw-vlb-heading">\uD83C\uDF0D 3 Languages</div>' + rows;

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
