/**
 * DWS Store — VAT & Currency Locale Switcher
 *
 * Finnish VAT law (Arvonlisäverolaki §65, §71):
 *   FI   — Finnish consumer (B2C) or domestic business: price incl. ALV 25.5 %.
 *          Default because Finnish consumer protection requires incl.-VAT display.
 *   EU   — EU business outside Finland WITH a valid VAT number: 0 % reverse charge.
 *          Buyer self-accounts VAT in their own country. Landing-page JS toggle
 *          trusts the buyer's declaration; actual invoice validates via VIES at
 *          checkout/contact-sales time.
 *   US   — Non-EU / export of service: 0 % VAT, price displayed in USD.
 *          Dollar prefix per US convention ($27,489), FX rate from ECB daily.
 *
 * Google Merchant safety:
 *   - Default page render = feed price (`.product-price` text matches feed).
 *   - Toggle is user-initiated JS only. Googlebot's canonical render stays EUR.
 *   - <meta property="product:price:*"> / JSON-LD / og:price are never rewritten.
 *   - Do NOT auto-detect visitor country server-side — breaks feed/page parity.
 *
 * Product-level overrides (on the closest .product-card or the price element):
 *   data-vat-type="b2b"   (default) — base price is excl. VAT
 *   data-vat-type="b2c"   — base price already includes VAT, shown as-is
 *   data-revolut-usd="…"  — alternate Revolut USD checkout href
 *
 * Usage: add <script src="/shared-assets/vat-locale.js"></script> to any store
 * page, plus .locale-btn buttons (data-locale="fi|eu|us"), an #vatNotice bar,
 * and .product-price elements. Optional: #vatIdInput for EU-business VAT ID.
 *
 * Code-Version: 2.1.0
 * Introduced-In: PR- (TBD)
 * Branch: claude/propagate-vat-locale-rPfdD
 * Date: 2026-04-16
 * Owner: DWS Team
 *
 * v2.1.0 — Support <meta name="dws-default-locale" content="eu|us|fi"> per
 *          page for B2B stores that should default to EU 0 % reverse charge
 *          instead of the Finnish consumer default.
 */
(function () {
  'use strict';

  var FI_VAT_RATE = 0.255; // Finland 25.5 % standard rate (2024+)
  var FX_URL = '/shared-assets/fx-rates.json';
  var FX_FALLBACK = { USD: 1.1 }; // static floor if fetch fails

  var LOCALES = {
    fi: {
      currency: 'EUR',
      inclVat: true,
      notice: 'Hinnat sis. ALV 25,5 % \u00b7 Kuluttajahinnat (B2C/FI)',
    },
    eu: {
      currency: 'EUR',
      inclVat: false,
      notice:
        'Prices VAT 0 % \u00b7 EU reverse charge (Arvonlisäverolaki §65) \u00b7 Valid non-FI EU VAT ID required at checkout',
    },
    us: {
      currency: 'USD',
      inclVat: false,
      notice: 'Prices in USD \u00b7 VAT 0 % \u00b7 Export of service (non-EU)',
    },
  };

  var fxRates = Object.assign({}, FX_FALLBACK);
  var fxFetched = false;

  function getDefaultLocale() {
    // Per-page override via <meta name="dws-default-locale" content="eu|us|fi">.
    // B2B store pages use "eu" (0 % reverse charge) so that Finnish business
    // buyers don't see 25.5 % VAT pre-applied to products that are always
    // invoiced excl. VAT. Individual product pages can stay on "fi" to satisfy
    // Finnish B2C consumer protection.
    var meta = document.querySelector('meta[name="dws-default-locale"]');
    var val = meta ? meta.getAttribute('content') : null;
    return LOCALES[val] ? val : 'fi';
  }

  function getLocale() {
    var stored = localStorage.getItem('dws-locale');
    return LOCALES[stored] ? stored : getDefaultLocale();
  }

  function setLocale(locale) {
    if (!LOCALES[locale]) return;
    localStorage.setItem('dws-locale', locale);
    applyLocale(locale);
    // Notify in-page listeners (bundle-cart, custom widgets) on same-tab change.
    try {
      window.dispatchEvent(new CustomEvent('dws-locale-change', { detail: { locale: locale } }));
    } catch (e) {
      /* CustomEvent unsupported in legacy IE — ignore */
    }
  }

  /** Parse numeric price from text like "€2,500", "24 990 €", "€0.99", "€699/mo" */
  function parsePrice(text) {
    var m = text
      .replace(/\u00a0/g, ' ')
      .match(/([\d]{1,3}(?:[\s,.]\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)/);
    if (!m) return NaN;
    // Strip thousand separators (space, comma) while preserving decimal point.
    var raw = m[1];
    // If the last separator is a comma and the substring after is 1–2 digits, treat as decimal.
    var lastComma = raw.lastIndexOf(',');
    var lastDot = raw.lastIndexOf('.');
    var cleaned;
    if (lastComma > lastDot && raw.length - lastComma <= 3) {
      cleaned = raw.replace(/[.\s]/g, '').replace(',', '.');
    } else {
      cleaned = raw.replace(/[\s,]/g, '');
    }
    return parseFloat(cleaned);
  }

  /** Format amount per currency convention (EUR suffix, USD prefix). */
  function formatPrice(amount, currency) {
    currency = currency || 'EUR';
    var hasFraction = Math.abs(amount - Math.round(amount)) > 0.005 || amount < 1;
    var opts = hasFraction
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { maximumFractionDigits: 0 };

    if (currency === 'USD') {
      // US convention: "$1,234" or "$1,234.56"
      return '$' + amount.toLocaleString('en-US', opts);
    }
    // EUR convention (FI/EU): "1 234 €" or "1 234,56 €" with non-breaking space.
    return amount.toLocaleString('fi-FI', opts) + '\u00a0\u20ac';
  }

  /** Snapshot base prices + suffix (e.g. "/mo", "/h") on first run. */
  function initPrices() {
    var els = document.querySelectorAll('.product-price');
    for (var i = 0; i < els.length; i++) {
      if (els[i].getAttribute('data-base-price')) continue;
      var text = els[i].textContent.trim();
      var price = parsePrice(text);
      if (!isNaN(price)) {
        els[i].setAttribute('data-base-price', price);
        var sm = text.match(/\/(\w+)/);
        els[i].setAttribute('data-price-suffix', sm ? '/' + sm[1] : '');
      }
    }
  }

  function vatTypeFor(el) {
    if (el.getAttribute('data-vat-type')) return el.getAttribute('data-vat-type');
    var card = el.closest('.product-card');
    return card ? card.getAttribute('data-vat-type') || 'b2b' : 'b2b';
  }

  function computeDisplayAmount(base, cfg, vatType) {
    var amount = base;
    if (vatType === 'b2b') {
      // base stored excl. VAT; only add VAT when locale says incl.
      amount = cfg.inclVat ? base * (1 + FI_VAT_RATE) : base;
    }
    // B2C: base already includes VAT — same in every mode (we don't strip VAT).
    if (cfg.currency === 'USD') {
      amount = amount * (fxRates.USD || FX_FALLBACK.USD);
    }
    return amount;
  }

  function updatePrices(locale) {
    var cfg = LOCALES[locale];

    // 1) Text prices
    var els = document.querySelectorAll('.product-price');
    for (var i = 0; i < els.length; i++) {
      var base = parseFloat(els[i].getAttribute('data-base-price'));
      if (isNaN(base)) continue;
      var suffix = els[i].getAttribute('data-price-suffix') || '';
      var vatType = vatTypeFor(els[i]);
      var display = computeDisplayAmount(base, cfg, vatType);
      els[i].textContent = formatPrice(display, cfg.currency) + suffix;
    }

    // 2) Revolut links — rewrite amount + currency. USD uses data-revolut-usd if present.
    var revolLinks = document.querySelectorAll('a.btn-revolut');
    for (var j = 0; j < revolLinks.length; j++) {
      var link = revolLinks[j];
      if (!link.getAttribute('data-base-href')) {
        link.setAttribute('data-base-href', link.getAttribute('href') || '');
      }
      var baseHref = link.getAttribute('data-base-href') || '';
      var usdHref = link.getAttribute('data-revolut-usd') || '';
      var vatType = vatTypeFor(link);

      if (cfg.currency === 'USD') {
        link.setAttribute('href', usdHref || baseHref);
        continue;
      }
      var m = baseHref.match(/(revolut\.me\/lifetimeoy\/)([\d.]+)(EUR)/);
      if (m && vatType !== 'b2c') {
        var baseAmt = parseFloat(m[2]);
        var newAmt = cfg.inclVat ? Math.round(baseAmt * (1 + FI_VAT_RATE)) : baseAmt;
        link.setAttribute(
          'href',
          baseHref.replace(/(revolut\.me\/lifetimeoy\/)([\d.]+)(EUR)/, '$1' + newAmt + '$3'),
        );
      } else {
        link.setAttribute('href', baseHref);
      }
    }

    // 3) PayPal links — EUR only; US locale keeps base href.
    var payLinks = document.querySelectorAll('a.btn-paypal');
    for (var k = 0; k < payLinks.length; k++) {
      var pLink = payLinks[k];
      if (!pLink.getAttribute('data-base-href')) {
        pLink.setAttribute('data-base-href', pLink.getAttribute('href') || '');
      }
      var pBase = pLink.getAttribute('data-base-href') || '';
      var pVatType = vatTypeFor(pLink);
      if (cfg.currency === 'USD' || pVatType === 'b2c') {
        pLink.setAttribute('href', pBase);
        continue;
      }
      try {
        var url = new URL(pBase, window.location.origin);
        var amt = parseFloat(url.searchParams.get('amount'));
        if (!isNaN(amt)) {
          var out = cfg.inclVat ? (amt * (1 + FI_VAT_RATE)).toFixed(2) : amt;
          url.searchParams.set('amount', out);
          pLink.setAttribute('href', url.toString());
        }
      } catch (e) {
        /* skip invalid URLs */
      }
    }
  }

  function applyLocale(locale) {
    var cfg = LOCALES[locale];
    if (!cfg) return;

    var buttons = document.querySelectorAll('.locale-btn');
    for (var i = 0; i < buttons.length; i++) {
      var isActive = buttons[i].getAttribute('data-locale') === locale;
      buttons[i].classList.toggle('active', isActive);
    }

    var notice = document.getElementById('vatNotice');
    if (notice) notice.textContent = cfg.notice;

    var vatIdWrap = document.getElementById('vatIdWrap');
    if (vatIdWrap) vatIdWrap.style.display = locale === 'eu' ? '' : 'none';

    var rateStamp = document.getElementById('fxAsOf');
    if (rateStamp) {
      rateStamp.style.display = cfg.currency === 'USD' ? '' : 'none';
    }

    updatePrices(locale);
  }

  function fetchFx() {
    if (fxFetched || typeof fetch !== 'function') return Promise.resolve();
    fxFetched = true;
    return fetch(FX_URL, { cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        if (data && data.rates && data.rates.USD) {
          fxRates = data.rates;
          // Cache for cross-script access (bundle-cart reads from localStorage).
          try {
            localStorage.setItem('dws-fx-rates', JSON.stringify(data.rates));
          } catch (e) {
            /* quota or disabled */
          }
          var stamp = document.getElementById('fxAsOf');
          if (stamp && data.ratesAsOf) {
            stamp.textContent =
              'USD rate as of ' +
              data.ratesAsOf +
              ' (ECB reference) \u00b7 1 EUR = $' +
              Number(data.rates.USD).toFixed(4);
          }
          // Re-apply if a USD view is currently on screen.
          if (getLocale() === 'us') applyLocale('us');
        }
      })
      .catch(function () {
        /* keep fallback rate */
      });
  }

  function bindVatIdInput() {
    var input = document.getElementById('vatIdInput');
    if (!input) return;
    var status = document.getElementById('vatIdStatus');
    input.addEventListener('input', function () {
      var v = input.value.trim().toUpperCase().replace(/\s/g, '');
      // Basic EU VAT format: 2-letter country code + 2-12 alphanumerics.
      // Reject FI — Finnish VAT ID cannot use reverse charge on Lifetime Oy's own invoice.
      var m = v.match(/^([A-Z]{2})([A-Z0-9]{2,12})$/);
      if (!m) {
        if (status) status.textContent = v ? 'Invalid format' : '';
        input.setCustomValidity(v ? 'Invalid EU VAT ID format' : '');
        return;
      }
      if (m[1] === 'FI') {
        if (status) status.textContent = 'Finnish VAT ID — 25.5 % VAT applies. Switch to FI view.';
        input.setCustomValidity('FI VAT ID — reverse charge not applicable.');
        return;
      }
      if (status)
        status.textContent = 'Looks valid (' + m[1] + '). VIES validation happens at checkout.';
      input.setCustomValidity('');
    });
  }

  // Language → VAT locale mapping used when the 5-language bar fires
  // dws-lang-change. Finnish visitors default to FI/25.5 %; other EU
  // languages default to EU B2B reverse charge (they still need to supply
  // a VAT ID for the charge to be valid). English stays on whatever the
  // visitor previously chose, since "en" is ambiguous (EU or US).
  var LANG_TO_LOCALE = {
    fi: 'fi',
    sv: 'eu',
    de: 'eu',
    fr: 'eu',
    en: null,
  };

  function init() {
    initPrices();
    bindVatIdInput();
    applyLocale(getLocale());
    var buttons = document.querySelectorAll('.locale-btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        setLocale(this.getAttribute('data-locale'));
      });
    }
    // React to the 5-language bar switching.
    window.addEventListener('dws-lang-change', function (e) {
      var lang = e && e.detail && e.detail.lang;
      var target = LANG_TO_LOCALE[lang];
      if (target && target !== getLocale()) setLocale(target);
    });
    fetchFx();
  }

  // Allow dynamic pages (e.g. /buy/ JS-rendered cards) to refresh after render.
  window.dwsVatRefresh = function () {
    initPrices();
    applyLocale(getLocale());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
