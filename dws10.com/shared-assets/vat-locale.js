/**
 * DWS Store — VAT Locale Switcher
 *
 * Rules (Finnish law):
 *   EU mode (B2B):  All prices excl. VAT. Business-to-business, reverse charge.
 *   FI mode (B2C):  Prices incl. ALV 25.5%. Consumer protection requires incl. VAT.
 *
 * Product-level override:
 *   data-vat-type="b2b"  (default) — Base price is excl. VAT
 *   data-vat-type="b2c"  — Base price already includes VAT, shown as-is in both modes
 *
 * Usage: Add <script src="/shared-assets/vat-locale.js"></script> to any store page.
 * Requires: .locale-btn[data-locale], #vatNotice, .product-price elements.
 */
(function () {
    'use strict';

    var FI_VAT_RATE = 0.255; // Finland 25.5% (2024+)

    var LOCALES = {
        eu: {
            notice: 'All prices excl. VAT \u00b7 EU Business (B2B)',
            priceLabel: 'excl. VAT',
            inclVat: false
        },
        fi: {
            notice: 'Hinnat sis. ALV 25,5 % \u00b7 Kuluttajahinnat (B2C)',
            priceLabel: 'sis. ALV',
            inclVat: true
        }
    };

    function getLocale() {
        return localStorage.getItem('dws-locale') || 'eu';
    }

    function setLocale(locale) {
        localStorage.setItem('dws-locale', locale);
        applyLocale(locale);
    }

    function applyLocale(locale) {
        var cfg = LOCALES[locale];
        if (!cfg) return;

        // Toggle active button
        var buttons = document.querySelectorAll('.locale-btn');
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute('data-locale') === locale) {
                buttons[i].classList.add('active');
            } else {
                buttons[i].classList.remove('active');
            }
        }

        // Update VAT notice
        var notice = document.getElementById('vatNotice');
        if (notice) notice.textContent = cfg.notice;

        // Update prices
        updatePrices(cfg.inclVat);
    }

    /** Parse a numeric price from text like "€2,500", "€699/mo", "€0.99" */
    function parsePrice(text) {
        var match = text.match(/([\d,]+(?:\.\d+)?)/);
        if (!match) return NaN;
        return parseFloat(match[1].replace(/,/g, ''));
    }

    /** Format price for display */
    function formatPrice(amount) {
        if (amount < 1 && amount > 0) {
            return '\u20ac' + amount.toFixed(2);
        }
        // Round to nearest integer for clean display, keep decimals if present
        if (Math.abs(amount - Math.round(amount)) < 0.01) {
            return '\u20ac' + Math.round(amount).toLocaleString('en-IE');
        }
        return '\u20ac' + amount.toLocaleString('en-IE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    /** Store base prices on first run */
    function initPrices() {
        var els = document.querySelectorAll('.product-price');
        for (var i = 0; i < els.length; i++) {
            if (els[i].getAttribute('data-base-price')) continue; // already init
            var text = els[i].textContent.trim();
            var price = parsePrice(text);
            if (!isNaN(price)) {
                els[i].setAttribute('data-base-price', price);
                // Capture suffix like /mo, /hr
                var suffixMatch = text.match(/\/\w+/);
                els[i].setAttribute('data-price-suffix', suffixMatch ? suffixMatch[0] : '');
            }
        }
    }

    function updatePrices(inclVat) {
        var els = document.querySelectorAll('.product-price');
        for (var i = 0; i < els.length; i++) {
            var base = parseFloat(els[i].getAttribute('data-base-price'));
            if (isNaN(base)) continue;

            var suffix = els[i].getAttribute('data-price-suffix') || '';

            // Check product-level VAT type
            var card = els[i].closest('.product-card');
            var vatType = card ? (card.getAttribute('data-vat-type') || 'b2b') : 'b2b';

            var displayPrice;
            if (vatType === 'b2c') {
                // B2C: price already includes VAT, show as-is
                displayPrice = base;
            } else {
                // B2B: base is excl. VAT
                displayPrice = inclVat ? base * (1 + FI_VAT_RATE) : base;
            }

            els[i].textContent = formatPrice(displayPrice) + suffix;
        }

        // Update Revolut links
        var revolLinks = document.querySelectorAll('a.btn-revolut');
        for (var j = 0; j < revolLinks.length; j++) {
            var link = revolLinks[j];
            if (!link.getAttribute('data-base-href')) {
                link.setAttribute('data-base-href', link.getAttribute('href'));
            }
            var baseHref = link.getAttribute('data-base-href');

            // Check product VAT type
            var linkCard = link.closest('.product-card');
            var linkVatType = linkCard ? (linkCard.getAttribute('data-vat-type') || 'b2b') : 'b2b';
            if (linkVatType === 'b2c') continue; // Don't modify B2C links

            // Update revolut.me/lifetimeoy/{price}EUR pattern
            var revolMatch = baseHref.match(/(revolut\.me\/lifetimeoy\/)([\d.]+)(EUR)/);
            if (revolMatch) {
                var baseAmt = parseFloat(revolMatch[2]);
                var newAmt = inclVat ? Math.round(baseAmt * (1 + FI_VAT_RATE)) : baseAmt;
                link.setAttribute('href', baseHref.replace(
                    /(revolut\.me\/lifetimeoy\/)([\d.]+)(EUR)/,
                    '$1' + newAmt + '$3'
                ));
            }
            // Dedicated checkout links (checkout.revolut.com) are not modified
        }

        // Update PayPal links
        var payLinks = document.querySelectorAll('a.btn-paypal');
        for (var k = 0; k < payLinks.length; k++) {
            var pLink = payLinks[k];
            if (!pLink.getAttribute('data-base-href')) {
                pLink.setAttribute('data-base-href', pLink.getAttribute('href'));
            }
            var pBaseHref = pLink.getAttribute('data-base-href');

            var pCard = pLink.closest('.product-card');
            var pVatType = pCard ? (pCard.getAttribute('data-vat-type') || 'b2b') : 'b2b';
            if (pVatType === 'b2c') continue;

            try {
                var url = new URL(pBaseHref);
                var pBaseAmt = parseFloat(url.searchParams.get('amount'));
                if (!isNaN(pBaseAmt)) {
                    var pNewAmt = inclVat ? (pBaseAmt * (1 + FI_VAT_RATE)).toFixed(2) : pBaseAmt;
                    url.searchParams.set('amount', pNewAmt);
                    pLink.setAttribute('href', url.toString());
                }
            } catch (e) { /* skip invalid URLs */ }
        }
    }

    function init() {
        initPrices();
        var locale = getLocale();
        applyLocale(locale);

        // Bind locale buttons
        var buttons = document.querySelectorAll('.locale-btn');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function () {
                setLocale(this.getAttribute('data-locale'));
            });
        }
    }

    // Expose refresh for dynamic pages (page 1 calls this after rendering)
    window.dwsVatRefresh = function () {
        initPrices();
        var locale = getLocale();
        applyLocale(locale);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
