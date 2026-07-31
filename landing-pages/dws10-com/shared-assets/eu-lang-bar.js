/**
 * DWS10.com European Language Bar v1.1
 * Introduced-In: PR-TBD (propagate VAT locale)
 * Code-Version: 1.1
 * Branch: claude/propagate-vat-locale-rPfdD
 * Date: 2026-04-16
 * Owner: Lifetime Oy
 *
 * European-first language selector with EU flag.
 * Order: Suomi | Svenska | Deutsch | Francais | English + EU flag
 * Signals: "This is a European brand and product line."
 *
 * Usage: Add to homepage and landing pages only (not global via ironclad-nav.js):
 * <script src="/shared-assets/eu-lang-bar.js"></script>
 *
 * Shares localStorage key 'dws-lang' with ironclad-nav.js
 * Auto-injects a thin language bar below the ironclad header
 *
 * v1.0 — Initial release: FI | SV | DE | FR | EN + EU flag
 * v1.1 — Fix silent render failure when ironclad-nav.js injects this script
 *        after DOMContentLoaded. Now runs immediately if parsing is done.
 */

(function () {
  'use strict';

  // Idempotency: skip if another copy already rendered the bar (e.g. ironclad-nav
  // auto-loads us AND a page still has the manual <script> tag).
  if (window.__dwsEuLangBarLoaded) return;
  window.__dwsEuLangBarLoaded = true;

  // Pages that are not language-indexed (store, product pages, checkout) set
  // <meta name="dws-lang-stay" content="true"> to prevent the click from
  // redirecting to /fi/, /sv/, etc. The language+VAT still switch in-place.
  function staysOnPage() {
    var m = document.querySelector('meta[name="dws-lang-stay"]');
    return !!(m && m.getAttribute('content') === 'true');
  }

  // European language order — local languages first, English last
  var languages = [
    { code: 'fi', label: 'Suomi', flag: '&#x1F1EB;&#x1F1EE;' },
    { code: 'sv', label: 'Svenska', flag: '&#x1F1F8;&#x1F1EA;' },
    { code: 'de', label: 'Deutsch', flag: '&#x1F1E9;&#x1F1EA;' },
    { code: 'fr', label: 'Fran\u00e7ais', flag: '&#x1F1EB;&#x1F1F7;' },
    { code: 'en', label: 'English', flag: '&#x1F1EC;&#x1F1E7;' },
  ];

  var currentLang = localStorage.getItem('dws-lang') || 'en';

  // Language subdirectory mapping (only languages with pages get redirects)
  var langPaths = { fi: '/fi/', sv: '/sv/', de: '/de/', fr: '/fr/', en: '/' };

  var barCSS =
    '/* === DWS10.com European Language Bar v1.0 === */\n' +
    '.eu-lang-bar {\n' +
    '    background: linear-gradient(90deg, #0A2463 0%, #0e3080 50%, #0A2463 100%);\n' +
    '    border-bottom: 1px solid rgba(255,255,255,0.08);\n' +
    '    padding: 7px 0;\n' +
    '    text-align: center;\n' +
    "    font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;\n" +
    '    font-size: 0.8rem;\n' +
    '    position: sticky;\n' +
    '    top: 68px;\n' +
    '    z-index: 49;\n' +
    '}\n' +
    '.eu-lang-bar-inner {\n' +
    '    display: flex;\n' +
    '    justify-content: center;\n' +
    '    align-items: center;\n' +
    '    gap: 2px;\n' +
    '    max-width: 1200px;\n' +
    '    margin: 0 auto;\n' +
    '    padding: 0 16px;\n' +
    '}\n' +
    '.eu-lang-btn {\n' +
    '    background: none;\n' +
    '    border: 1px solid transparent;\n' +
    '    color: rgba(226, 232, 240, 0.7);\n' +
    '    padding: 3px 10px;\n' +
    '    border-radius: 4px;\n' +
    '    cursor: pointer;\n' +
    '    font-size: 0.8rem;\n' +
    '    font-family: inherit;\n' +
    '    transition: all 0.2s;\n' +
    '    white-space: nowrap;\n' +
    '}\n' +
    '.eu-lang-btn:hover {\n' +
    '    color: #e2e8f0;\n' +
    '    border-color: rgba(255,255,255,0.2);\n' +
    '}\n' +
    '.eu-lang-btn.active {\n' +
    '    color: #FFD166;\n' +
    '    font-weight: 600;\n' +
    '    border-color: rgba(255, 209, 102, 0.3);\n' +
    '    background: rgba(255, 209, 102, 0.08);\n' +
    '}\n' +
    '.eu-lang-sep {\n' +
    '    color: rgba(100, 116, 139, 0.5);\n' +
    '    font-size: 0.7rem;\n' +
    '    margin: 0 1px;\n' +
    '}\n' +
    '.eu-lang-flag {\n' +
    '    display: inline-flex;\n' +
    '    align-items: center;\n' +
    '    margin-left: 10px;\n' +
    '    padding-left: 10px;\n' +
    '    border-left: 1px solid rgba(255,255,255,0.12);\n' +
    '    gap: 6px;\n' +
    '    color: rgba(226, 232, 240, 0.6);\n' +
    '    font-size: 0.75rem;\n' +
    '    font-weight: 600;\n' +
    '    letter-spacing: 0.04em;\n' +
    '}\n' +
    '@media (max-width: 480px) {\n' +
    '    .eu-lang-btn { padding: 3px 6px; font-size: 0.75rem; }\n' +
    '    .eu-lang-flag { font-size: 0.7rem; margin-left: 6px; padding-left: 6px; }\n' +
    '}\n';

  // Inject CSS
  var style = document.createElement('style');
  style.textContent = barCSS;
  document.head.appendChild(style);

  function setup() {
    // Build language buttons
    var btns = languages
      .map(function (l) {
        return (
          '<button class="eu-lang-btn' +
          (l.code === currentLang ? ' active' : '') +
          '" data-lang="' +
          l.code +
          '">' +
          l.label +
          '</button>'
        );
      })
      .join('<span class="eu-lang-sep">|</span>');

    // EU flag SVG (12-star circle on blue)
    var euFlag =
      '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 810 540" aria-label="European Union">' +
      '<rect width="810" height="540" fill="#003399"/>' +
      '<g fill="#FC0" transform="translate(405,270)">' +
      '<g id="s12"><g id="s6"><g id="s3"><g id="s1"><path d="M0-120l11.3 34.7h36.5l-29.5 21.4 11.3 34.7L0-50.7l-29.5 21.4 11.3-34.7-29.5-21.4h36.5z"/></g>' +
      '<use href="#s1" transform="rotate(60)"/></g>' +
      '<use href="#s3" transform="rotate(120)"/></g>' +
      '<use href="#s6" transform="rotate(180)"/></g></g></svg>';

    var barHTML =
      '<div class="eu-lang-bar"><div class="eu-lang-bar-inner">' +
      btns +
      '<span class="eu-lang-flag">' +
      euFlag +
      ' European Union</span>' +
      '</div></div>';

    // Insert after the ironclad header
    var header = document.querySelector('.ironclad-header');
    if (header) {
      var barEl = document.createElement('div');
      barEl.innerHTML = barHTML;
      header.parentNode.insertBefore(barEl.firstElementChild, header.nextSibling);
    }

    // Handle clicks
    document.querySelectorAll('.eu-lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        localStorage.setItem('dws-lang', lang);

        // Update active state
        document.querySelectorAll('.eu-lang-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        // Update ironclad-nav.js language code if present
        var navCode = document.querySelector('.ironclad-lang-code');
        if (navCode) navCode.textContent = lang.toUpperCase();

        // Dispatch event
        window.dispatchEvent(new CustomEvent('dws-lang-change', { detail: { lang: lang } }));

        // Redirect to language subdirectory unless page opted out.
        if (!staysOnPage() && langPaths[lang]) {
          var target = langPaths[lang];
          var current = window.location.pathname;
          if (current !== target && current !== target + 'index.html') {
            window.location.href = target;
            return;
          }
        }
        // All 5 languages now have pages — no "coming soon" toast needed
      });
    });
  }

  // Run on DOMContentLoaded if parsing still in progress; otherwise fire
  // immediately. ironclad-nav.js injects this script in its own DOMContentLoaded
  // callback, so by the time we arrive here the event has usually already
  // fired — guarding with readyState prevents the bar from silently failing
  // to render on dynamically-injected load paths.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
