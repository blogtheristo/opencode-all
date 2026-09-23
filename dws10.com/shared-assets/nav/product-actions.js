/**
 * DWS Product Actions Bar v1.0
 * Injects a 6-button action bar on every product detail page.
 * Buttons: Card | Details (active) | Book Meeting | Email | Store | Price List
 * Auto-detects product from products.json by matching current URL filename.
 * Opt-in localisation: <html data-pa-lang="fi"> switches labels and targets.
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
    '@media(max-width:600px){.pa-bar{padding:8px 12px;gap:6px;}',
    '.pa-bar a,.pa-bar span{font-size:0.68rem;padding:3px 9px;}}',
  ].join('');

  var PA_LANG = document.documentElement.getAttribute('data-pa-lang') || 'en';
  var LABELS = {
    en: { card: 'Card', details: 'Details', book: 'Book&nbsp;Meeting', email: 'Email',
      store: 'Store', pricelist: 'Price&nbsp;List', enquiry: 'Enquiry: ', priceHref: '/price-list/' },
    fi: { card: 'Kortti', details: 'Tuotetiedot', book: 'Varaa&nbsp;tapaaminen', email: 'Sähköposti',
      store: 'Kauppa', pricelist: 'Hinnasto', enquiry: 'Tiedustelu: ', priceHref: '/price-list/fi/' },
  };
  var L = LABELS[PA_LANG] || LABELS.en;

  function injectStyle() {
    var s = document.createElement('style');
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  function buildBar(productId, productName) {
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
    for (var id in products) {
      var p = products[id];
      var url = p.detailsUrl || '';
      var fname = url.replace(/^.*\//, '').replace(/\?.*$/, '');
      if (fname === file) return p;
    }
    return null;
  }

  function run() {
    injectStyle();

    fetch('/config/products.json', { cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        var product = data && data.products ? findProduct(data.products) : null;
        var bar = buildBar(product ? product.id : '', product ? product.name : '');
        inject(bar);
      })
      .catch(function () {
        var bar = buildBar('', '');
        inject(bar);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
