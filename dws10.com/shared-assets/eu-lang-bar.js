/**
 * EU Language Bar — DWS10.com
 * Code-Version: 1.0
 * Date: 2026-04-07
 * Owner: Lifetime Oy
 *
 * Injects a compact language switcher bar at the top of every page.
 * Supports: EN, DE, FR (extensible to FI, SV later).
 */
(function () {
  'use strict';

  const LANGUAGES = [
    { code: 'en', label: 'EN', path: '/' },
    { code: 'de', label: 'DE', path: '/de/' },
    { code: 'fr', label: 'FR', path: '/fr/' },
  ];

  // Detect current language from <html lang> or URL path
  function detectCurrentLang() {
    var htmlLang = document.documentElement.lang || 'en';
    var shortLang = htmlLang.split('-')[0].toLowerCase();
    var match = LANGUAGES.find(function (l) {
      return l.code === shortLang;
    });
    if (match) return match.code;
    // Fallback: check URL path
    var path = window.location.pathname;
    for (var i = 0; i < LANGUAGES.length; i++) {
      if (LANGUAGES[i].path !== '/' && path.startsWith(LANGUAGES[i].path)) {
        return LANGUAGES[i].code;
      }
    }
    return 'en';
  }

  function createBar() {
    var currentLang = detectCurrentLang();

    var bar = document.createElement('div');
    bar.id = 'eu-lang-bar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Language selection');
    bar.style.cssText =
      'background:#1e293b;border-bottom:1px solid rgba(255,255,255,0.08);' +
      'padding:6px 0;text-align:center;font-family:-apple-system,BlinkMacSystemFont,' +
      '"Segoe UI",Roboto,sans-serif;font-size:0.85rem;position:relative;z-index:1000;';

    var inner = document.createElement('div');
    inner.style.cssText =
      'max-width:1200px;margin:0 auto;display:flex;align-items:center;' +
      'justify-content:center;gap:6px;padding:0 16px;';

    // EU flag icon (text fallback)
    var flag = document.createElement('span');
    flag.textContent = '\uD83C\uDDEA\uD83C\uDDFA';
    flag.style.cssText = 'margin-right:6px;font-size:1rem;';
    inner.appendChild(flag);

    LANGUAGES.forEach(function (lang) {
      var isActive = lang.code === currentLang;
      var el = document.createElement(isActive ? 'span' : 'a');

      el.textContent = lang.label;
      if (!isActive) {
        el.href = lang.path;
        el.hreflang = lang.code;
      }
      el.style.cssText =
        'padding:4px 10px;border-radius:4px;text-decoration:none;font-weight:' +
        (isActive ? '700' : '400') +
        ';color:' +
        (isActive ? '#fff' : '#94a3b8') +
        ';background:' +
        (isActive ? 'rgba(59,130,246,0.3)' : 'transparent') +
        ';transition:all 0.2s;display:inline-block;';

      if (!isActive) {
        el.addEventListener('mouseenter', function () {
          this.style.color = '#e2e8f0';
          this.style.background = 'rgba(255,255,255,0.08)';
        });
        el.addEventListener('mouseleave', function () {
          this.style.color = '#94a3b8';
          this.style.background = 'transparent';
        });
      }

      inner.appendChild(el);
    });

    bar.appendChild(inner);
    return bar;
  }

  // Insert at the very top of <body>
  function inject() {
    if (document.getElementById('eu-lang-bar')) return;
    var bar = createBar();
    document.body.insertBefore(bar, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
