/**
 * DWS Reveal — scroll-in fade for brand pages. v1.0
 *
 * Single source of truth: dws10.com/shared-assets/motion/reveal.js
 * Synced to lifetime.fi and onelifetime.world alongside ironclad-nav.js
 * (scripts/on-deploy/sync-ironclad-nav.sh).
 *
 * Usage — one line, anywhere before </body>:
 *   <script src="/shared-assets/motion/reveal.js" defer></script>
 *
 * Adapted from the cari.fi implementation (github.com/blogtheristo/cari,
 * public/index.html), which is the reference for how this should feel.
 *
 * Three properties carried over from that build deliberately:
 *
 *  1. THE BACKSTOP IS NOT OPTIONAL. An effect must never leave content
 *     invisible. If IntersectionObserver never fires — bfcache restore, a
 *     zero-height container, an observer that silently fails — a timer forces
 *     everything visible. A page that renders blank is infinitely worse than a
 *     page with no animation.
 *  2. prefers-reduced-motion is honoured by showing content immediately, not by
 *     shortening the transition.
 *  3. The opacity rules are scoped under .js, which this file sets itself. With
 *     JavaScript off or broken, the CSS never applies and everything is visible
 *     at full opacity — no-JS is the safe state, not a degraded one.
 *
 * Opt out per element with data-no-reveal, or per page by not loading the file.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  if (root.getAttribute('data-reveal-init')) return; // double-include guard
  root.setAttribute('data-reveal-init', '1');

  // Mark that JS is live. Every opacity:0 rule below is scoped under .js, so a
  // failure to reach this line leaves the page fully visible.
  root.classList.add('js');

  var CSS = [
    '.js .reveal{opacity:0;transition:opacity 2.5s ease-out}',
    '.js .reveal.is-visible{opacity:1}',
    '.js .reveal-slow{transition-duration:3.5s}',
    '.js .reveal-fast{transition-duration:.6s}',
    // Backstop state: appear NOW, with no transition. A 2.5s fade started by the
    // backstop would mean up to 5s from load before content is readable on the
    // failure path — so the rescue must be instant, not another slow fade.
    '.js .reveal.reveal-now{opacity:1!important;transition:none!important}',
    // Siblings arrive in sequence rather than as one block.
    '.js .reveal-stagger>*:nth-child(2){transition-delay:80ms}',
    '.js .reveal-stagger>*:nth-child(3){transition-delay:160ms}',
    '.js .reveal-stagger>*:nth-child(4){transition-delay:240ms}',
    '.js .reveal-stagger>*:nth-child(5){transition-delay:320ms}',
    '.js .reveal-stagger>*:nth-child(6){transition-delay:400ms}',
    '@media (prefers-reduced-motion: reduce){.js .reveal{opacity:1!important;transition:none!important}}',
    '@media print{.js .reveal{opacity:1!important;transition:none!important}}',
  ].join('');

  var style = document.createElement('style');
  style.setAttribute('data-reveal', '');
  style.appendChild(document.createTextNode(CSS));
  (document.head || root).appendChild(style);

  function start() {
    // Auto-tag content blocks so a page gets the effect without hand-editing
    // every element. Deliberately conservative: only block-level content
    // containers, never nav/footer/header chrome (which must not flicker) and
    // never anything already positioned or already tagged.
    var AUTO = [
      'main > section',
      'main > div > section',
      'section > h1',
      'section > h2',
      '.card',
      '.role',
      '.ptr',
      '.pillar-card',
      '.image-card',
      '[data-reveal]',
    ].join(',');

    var candidates;
    try {
      candidates = document.querySelectorAll(AUTO);
    } catch (e) {
      candidates = [];
    }

    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      if (el.hasAttribute('data-no-reveal')) continue;
      if (el.closest('nav,header,footer,.ironclad-header')) continue;
      el.classList.add('reveal');
    }

    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Used by the reduced-motion path and by bfcache restore — both want content
    // present immediately, not fading.
    function showAll() {
      for (var j = 0; j < els.length; j++) els[j].classList.add('reveal-now', 'is-visible');
    }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    for (var k = 0; k < els.length; k++) io.observe(els[k]);

    // Backstop — see header comment. Anything still hidden after this is forced
    // visible regardless of why the observer did not reach it.
    setTimeout(function () {
      for (var m = 0; m < els.length; m++) {
        if (!els[m].classList.contains('is-visible')) {
          // reveal-now, not just is-visible: the rescue must be instant. Adding
          // is-visible alone would start the full 2.5s fade from here.
          els[m].classList.add('reveal-now', 'is-visible');
        }
      }
      io.disconnect();
      // 6s, not 2.5s. The backstop must sit clear of the fade itself: when the
      // two were both 2.5s, any page that took ~2.5s to fire `load` had its
      // animation cancelled by its own safety net — every element arrived via
      // reveal-now with no fade at all. The backstop is for genuine observer
      // failure, not for slow-but-working pages.
    }, 6000);

    // Restoring from bfcache does not re-run the script; make sure a restored
    // page is never left mid-fade.
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) showAll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
