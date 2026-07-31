/**
 * OneLifetime.World Language Bar v1.1
 * Standalone language selector for blog pages
 *
 * Usage: Add this script to any blog page:
 * <script src="/shared-assets/lang-bar.js"></script>
 *
 * Shares localStorage key 'dws-lang' with dws10.com ironclad-nav.js
 * Auto-injects a thin language bar below the page nav
 *
 * v1.1 — 2026-04-17: Expanded to 5 languages (EN | FI | SV | DE | FR)
 *                    to match dws10.com ironclad-nav.js language standard.
 * v1.0 — Initial release: EN | FI | SV selector with localStorage persistence
 */

(function () {
  'use strict';

  // Language configuration (5 languages — matches dws10.com ironclad-nav.js standard)
  var languages = [
    { code: 'en', label: 'English' },
    { code: 'fi', label: 'Suomeksi' },
    { code: 'sv', label: 'Svenska' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
  ];

  var currentLang = localStorage.getItem('dws-lang') || 'en';

  var barCSS =
    '\
/* === OneLifetime Language Bar v1.0 === */\n\
.olw-lang-bar {\n\
    background: rgba(30, 41, 59, 0.95);\n\
    border-bottom: 1px solid rgba(255,255,255,0.08);\n\
    padding: 6px 0;\n\
    text-align: center;\n\
    font-family: system-ui, -apple-system, sans-serif;\n\
    font-size: 0.8rem;\n\
    position: sticky;\n\
    top: 52px;\n\
    z-index: 49;\n\
}\n\
.olw-lang-bar-inner {\n\
    display: flex;\n\
    justify-content: center;\n\
    align-items: center;\n\
    gap: 4px;\n\
    max-width: 1200px;\n\
    margin: 0 auto;\n\
    padding: 0 16px;\n\
}\n\
.olw-lang-icon {\n\
    color: #94a3b8;\n\
    margin-right: 6px;\n\
    font-size: 0.85rem;\n\
}\n\
.olw-lang-btn {\n\
    background: none;\n\
    border: 1px solid transparent;\n\
    color: #94a3b8;\n\
    padding: 3px 10px;\n\
    border-radius: 4px;\n\
    cursor: pointer;\n\
    font-size: 0.8rem;\n\
    font-family: inherit;\n\
    transition: all 0.2s;\n\
}\n\
.olw-lang-btn:hover {\n\
    color: #e2e8f0;\n\
    border-color: rgba(255,255,255,0.2);\n\
}\n\
.olw-lang-btn.active {\n\
    color: #60a5fa;\n\
    font-weight: 600;\n\
    border-color: rgba(96, 165, 250, 0.3);\n\
    background: rgba(96, 165, 250, 0.08);\n\
}\n\
.olw-lang-sep {\n\
    color: #475569;\n\
    font-size: 0.7rem;\n\
}\n\
';

  // Inject CSS
  var style = document.createElement('style');
  style.textContent = barCSS;
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', function () {
    // Build language buttons HTML
    var btns = languages
      .map(function (l) {
        return (
          '<button class="olw-lang-btn' +
          (l.code === currentLang ? ' active' : '') +
          '" data-lang="' +
          l.code +
          '">' +
          l.label +
          '</button>'
        );
      })
      .join('<span class="olw-lang-sep">|</span>');

    var barHTML =
      '<div class="olw-lang-bar"><div class="olw-lang-bar-inner">' +
      '<span class="olw-lang-icon">&#127760;</span>' +
      btns +
      '</div></div>';

    // Find the nav element and insert after it
    var nav = document.querySelector('nav');
    if (nav) {
      var barEl = document.createElement('div');
      barEl.innerHTML = barHTML;
      nav.parentNode.insertBefore(barEl.firstElementChild, nav.nextSibling);
    }

    // Handle clicks
    document.querySelectorAll('.olw-lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        localStorage.setItem('dws-lang', lang);

        // Update active state
        document.querySelectorAll('.olw-lang-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        // Dispatch event
        window.dispatchEvent(new CustomEvent('dws-lang-change', { detail: { lang: lang } }));

        // If on a blog post with hreflang, navigate to alternate language version
        var altLink = document.querySelector('link[hreflang="' + lang + '"]');
        if (altLink && altLink.href && altLink.href !== window.location.href) {
          window.location.href = altLink.href;
        }
      });
    });
  });
})();
