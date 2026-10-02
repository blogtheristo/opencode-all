/**
 * DWS Product Actions Bar v1.1
 * Injects a 7-button action bar plus a concise delivery/spec panel on every
 * product detail page.
 * Buttons: Card | Details (active) | Buy | Book Meeting | Email | Store | Price List
 * Auto-detects product from products.json, matching current URL filename
 * against detailsUrl first, then falling back to the lowercase SKU (id) —
 * so pages whose filename simply IS the lowercase SKU are recognised even
 * without a matching detailsUrl entry.
 * Localisation: <html lang="fi"> (or data-pa-lang) switches labels and targets.
 *
 * HIC 27.09.2026 (product-readiness-portfolio, tranche 2 part B): "Buy button
 * to /checkout/?product=<SKU>" and "concise delivery/spec panel from
 * products.json"; matching "must fall back from filename to lowercase SKU,
 * not only detailsUrl."
 */
(function () {
  'use strict';

  if (window.__productActionsLoaded) return;
  window.__productActionsLoaded = true;

  var STYLES = [
    '/* product-actions */',
    '.pa-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;',
    'padding:10px 16px;background:rgba(15,23,42,0.92);border-bottom:1px solid rgba(71,85,105,0.4);',
    'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}',
    '.pa-bar a,.pa-bar span{display:inline-block;font-size:0.72rem;font-weight:600;',
    'padding:4px 12px;border-radius:999px;border:1px solid;text-decoration:none;',
    'white-space:nowrap;cursor:pointer;transition:opacity .15s;}',
    '.pa-bar a:hover{opacity:0.8;text-decoration:none;}',
    '.pa-card{border-color:rgba(148,163,184,0.35)!important;color:#cbd5e1!important;}',
    '.pa-detail{border-color:rgba(59,130,246,0.6)!important;color:#93c5fd!important;',
    'background:rgba(59,130,246,0.12)!important;}',
    '.pa-detail.pa-active{opacity:1;cursor:default;pointer-events:none;',
    'border-color:rgba(59,130,246,0.9)!important;color:#bfdbfe!important;',
    'background:rgba(59,130,246,0.22)!important;}',
    '.pa-book{border-color:rgba(16,185,129,0.5)!important;color:#6ee7b7!important;}',
    '.pa-email{border-color:rgba(251,191,36,0.4)!important;color:#fcd34d!important;}',
    '.pa-store{border-color:rgba(148,163,184,0.3)!important;color:#94a3b8!important;}',
    '.pa-pricelist{border-color:rgba(148,163,184,0.3)!important;color:#94a3b8!important;}',
    '.pa-buy{border-color:rgba(74,222,128,0.6)!important;color:#4ade80!important;',
    'background:rgba(74,222,128,0.12)!important;}',
    '@media(max-width:600px){.pa-bar{padding:8px 12px;gap:6px;}',
    '.pa-bar a,.pa-bar span{font-size:0.68rem;padding:3px 9px;}}',
    '.pa-spec{margin:0 0 16px;padding:14px 18px;border:1px solid rgba(71,85,105,0.4);',
    'border-radius:8px;background:rgba(15,23,42,0.6);font-family:system-ui,-apple-system,',
    '"Segoe UI",Roboto,sans-serif;color:#cbd5e1;font-size:0.85rem;line-height:1.6;}',
    '.pa-spec h3{margin:0 0 8px;font-size:0.78rem;text-transform:uppercase;',
    'letter-spacing:0.04em;color:#94a3b8;}',
    '.pa-spec ul{margin:6px 0 0;padding-left:18px;}',
    '.pa-spec li{margin-bottom:4px;}',
  ].join('');

  var PA_LANG =
    document.documentElement.getAttribute('data-pa-lang') ||
    (document.documentElement.lang === 'fi' ? 'fi' : 'en');
  var LABELS = {
    en: { card: 'Card', details: 'Details', buy: 'Buy&nbsp;now', book: 'Book&nbsp;Meeting', email: 'Email',
      store: 'Store', pricelist: 'Price&nbsp;List', enquiry: 'Enquiry: ', priceHref: '/price-list/',
      specTitle: 'Delivery & spec', specOwner: 'Delivered by', specSla: 'Acknowledged within',
      specVia: 'via', specExclusions: 'Not included' },
    fi: { card: 'Kortti', details: 'Tuotetiedot', buy: 'Osta&nbsp;nyt', book: 'Varaa&nbsp;tapaaminen', email: 'Sähköposti',
      store: 'Kauppa', pricelist: 'Hinnasto', enquiry: 'Tiedustelu: ', priceHref: '/price-list/fi/',
      specTitle: 'Toimitus ja tiedot', specOwner: 'Toimittaja', specSla: 'Vahvistus viimeistään',
      specVia: 'kanava', specExclusions: 'Ei sisällä' },
  };
  var L = LABELS[PA_LANG] || LABELS.en;

  function injectStyle() {
    var s = document.createElement('style');
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  function buildBar(productId, productName, checkoutUrl) {
    var pid = productId || '';
    var pname = productName || document.title || 'Product';
    var subject = encodeURIComponent(L.enquiry + pname);
    var cardHref = pid ? '/buy/#product-' + encodeURIComponent(pid) : '/buy/';
    var detailHref = window.location.pathname;

    var bar = document.createElement('div');
    bar.className = 'pa-bar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Product actions');

    bar.innerHTML =
      '<a class="pa-card" href="' +
      cardHref +
      '" title="Product card on Store">' + L.card + '</a>' +
      (PA_LANG !== 'en'
        ? '<a class="pa-detail" href="' +
          detailHref.replace('.' + PA_LANG + '.html', '.html') +
          '" hreflang="en" title="Product details (English)">Details</a>'
        : '') +
      '<span class="pa-detail pa-active" title="You are here — product detail page">' + L.details + '</span>' +
      (checkoutUrl
        ? '<a class="pa-buy" href="' + escapeHtml(checkoutUrl) + '" title="Buy now">' + L.buy + '</a>'
        : '') +
      '<a class="pa-book" href="/book/?service=demo&amp;product=' +
      encodeURIComponent(pid) +
      '" title="Book a meeting">' + L.book + '</a>' +
      '<a class="pa-email" href="https://dws10.com/contact/?subject=' +
      subject +
      '" title="Email sales">' + L.email + '</a>' +
      '<a class="pa-store" href="/buy/" title="Browse the store">' + L.store + '</a>' +
      '<a class="pa-pricelist" href="' + L.priceHref + '" title="Full price list">' + L.pricelist + '</a>';

    return bar;
  }

  function inject(bar) {
    var header = document.querySelector('.ironclad-header');
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(bar, header.nextSibling);
    } else if (header) {
      header.parentNode.appendChild(bar);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }

  function currentFilename() {
    var path = window.location.pathname;
    var file = path.replace(/\/$/, '').split('/').pop() || '';
    return PA_LANG !== 'en' ? file.replace('.' + PA_LANG + '.html', '.html') : file;
  }

  function findProduct(products) {
    var file = currentFilename();
    if (!file) return null;
    var slug = file.replace(/\.html$/, '');
    // Pass 1: match by detailsUrl filename (works for hand-authored pages
    // whose slug differs from the catalogue id, e.g. dgx-spark.html).
    for (var id in products) {
      var p = products[id];
      var url = p.detailsUrl || '';
      var fname = url.replace(/^.*\//, '').replace(/\?.*$/, '');
      if (fname === file) return p;
    }
    // Pass 2: fall back to lowercase SKU == filename (works for every
    // generated page, whose slug is always id.toLowerCase()).
    for (var id2 in products) {
      if (id2.toLowerCase() === slug) return products[id2];
    }
    return null;
  }

  function buildSpecPanel(product, lang) {
    if (!product) return null;
    var L2 = LABELS[lang] || LABELS.en;
    var panel = document.createElement('div');
    panel.className = 'pa-spec';
    var html = '<h3>' + L2.specTitle + '</h3><ul>';
    if (product.fulfilment && product.fulfilment.owner) {
      html += '<li>' + L2.specOwner + ': ' + escapeHtml(product.fulfilment.owner) + '</li>';
    }
    if (product.fulfilment && product.fulfilment.acknowledgementSla) {
      html += '<li>' + L2.specSla + ': ' + escapeHtml(product.fulfilment.acknowledgementSla) +
        (product.fulfilment.route ? ' (' + L2.specVia + ' ' + escapeHtml(product.fulfilment.route) + ')' : '') +
        '</li>';
    }
    if (Array.isArray(product.exclusions) && product.exclusions.length) {
      html += '<li>' + L2.specExclusions + ': ' + escapeHtml(product.exclusions.slice(0, 3).join('; ')) + '</li>';
    }
    html += '</ul>';
    panel.innerHTML = html;
    return panel;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function run() {
    injectStyle();

    fetch('/config/products.json', { cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        var product = data && data.products ? findProduct(data.products) : null;
        var bar = buildBar(
          product ? product.id : '',
          product ? product.name : '',
          product ? product.checkoutUrl : ''
        );
        inject(bar);
        var panel = buildSpecPanel(product, PA_LANG);
        if (panel) {
          bar.parentNode.insertBefore(panel, bar.nextSibling);
        }
      })
      .catch(function () {
        var bar = buildBar('', '', '');
        inject(bar);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
