/**
 * DWS Store — Bundle Cart with Tiered Discount
 *
 * Sales mechanic: encourage multi-product orders via volume discount.
 *   1 product   = 0 % off
 *   2 products  = 10 % off
 *   3 products  = 20 % off
 *   4+ products = 30 % off
 *
 * Discount applies to the subtotal in the buyer's current locale (FI / EU / US).
 * VAT is recomputed by vat-locale.js on the discounted subtotal so Finnish
 * consumer law (incl-VAT display) and EU reverse charge (excl-VAT) both stay
 * correct.
 *
 * Persistence: localStorage key `dws-bundle-cart` keeps the cart alive across
 * navigation to detail pages so buyers don't lose their selection by clicking
 * Details ↗. Cart is per-domain (not shared with onelifetime.world).
 *
 * Checkout: clicking "Order Bundle" opens a mailto: with the SKU list, the
 * applied discount %, and the computed total. Risto reviews and sends a single
 * Revolut payment link covering the bundle. Single-product Buy buttons remain
 * the fast path; the bundle is the upsell path.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR- (TBD)
 * Branch: claude/propagate-vat-locale-rPfdD
 * Date: 2026-04-16
 * Owner: DWS Team
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'dws-bundle-cart';
  var FI_VAT_RATE = 0.255;
  var DISCOUNT_TIERS = [
    { count: 1, pct: 0, label: 'Add 1 more for 10 % off' },
    { count: 2, pct: 0.1, label: 'Bundle saving: 10 % \u00b7 add 1 more for 20 %' },
    { count: 3, pct: 0.2, label: 'Bundle saving: 20 % \u00b7 add 1 more for 30 %' },
    { count: 4, pct: 0.3, label: 'Bundle saving: 30 % \u00b7 maximum tier reached' },
  ];

  function getDiscountTier(itemCount) {
    if (itemCount <= 0) return DISCOUNT_TIERS[0];
    var idx = Math.min(itemCount, 4) - 1;
    return DISCOUNT_TIERS[idx];
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      /* quota or disabled — silently ignore */
    }
  }

  function inCart(productId) {
    return loadCart().some(function (item) {
      return item.id === productId;
    });
  }

  function addToCart(product) {
    var cart = loadCart();
    if (
      cart.some(function (i) {
        return i.id === product.id;
      })
    )
      return cart;
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      currency: product.currency || 'EUR',
    });
    saveCart(cart);
    renderBar();
    refreshAllButtons();
    return cart;
  }

  function removeFromCart(productId) {
    var cart = loadCart().filter(function (i) {
      return i.id !== productId;
    });
    saveCart(cart);
    renderBar();
    refreshAllButtons();
    return cart;
  }

  function clearCart() {
    saveCart([]);
    renderBar();
    refreshAllButtons();
  }

  function getLocale() {
    try {
      return localStorage.getItem('dws-locale') || 'fi';
    } catch (e) {
      return 'fi';
    }
  }

  function getFxUsd() {
    try {
      var raw = localStorage.getItem('dws-fx-rates');
      if (!raw) return 1.1;
      var fx = JSON.parse(raw);
      return Number(fx && fx.USD) || 1.1;
    } catch (e) {
      return 1.1;
    }
  }

  function formatMoney(amount, currency) {
    if (currency === 'USD') {
      return '$' + Math.round(amount).toLocaleString('en-US');
    }
    var euros = Math.round(amount)
      .toLocaleString('fi-FI')
      .replace(/\u00a0/g, '\u00a0');
    return euros + '\u00a0\u20ac';
  }

  function computeTotals(cart) {
    var locale = getLocale();
    var subtotalEur = cart.reduce(function (sum, i) {
      return sum + (Number(i.price) || 0);
    }, 0);
    var tier = getDiscountTier(cart.length);
    var discountEur = subtotalEur * tier.pct;
    var netEur = subtotalEur - discountEur;
    var displayCurrency = 'EUR';
    var displayNet = netEur;
    var displayDiscount = discountEur;
    var displaySubtotal = subtotalEur;
    var vatLine = null;

    if (locale === 'fi') {
      // Finnish consumer: incl 25.5 % VAT
      displaySubtotal = subtotalEur * (1 + FI_VAT_RATE);
      displayDiscount = discountEur * (1 + FI_VAT_RATE);
      displayNet = netEur * (1 + FI_VAT_RATE);
      vatLine = 'Sis. ALV 25,5 %';
    } else if (locale === 'eu') {
      vatLine = 'VAT 0 % \u00b7 EU reverse charge (Arvonlisäverolaki §65)';
    } else if (locale === 'us') {
      displayCurrency = 'USD';
      var fx = getFxUsd();
      displaySubtotal = subtotalEur * fx;
      displayDiscount = discountEur * fx;
      displayNet = netEur * fx;
      vatLine = 'Export of service \u00b7 VAT 0 %';
    }

    return {
      count: cart.length,
      tier: tier,
      currency: displayCurrency,
      subtotal: displaySubtotal,
      discount: displayDiscount,
      net: displayNet,
      vatLine: vatLine,
      subtotalEur: subtotalEur,
      netEur: netEur,
    };
  }

  function buildMailto(cart, totals) {
    var lines = [];
    lines.push('Bundle order \u2014 DWS Store');
    lines.push('=====================================');
    lines.push('');
    cart.forEach(function (i, idx) {
      lines.push(
        idx + 1 + '. ' + i.name + '  (' + i.id + ')  \u2014  ' + formatMoney(i.price, 'EUR'),
      );
    });
    lines.push('');
    lines.push('Subtotal:        ' + formatMoney(totals.subtotalEur, 'EUR'));
    if (totals.tier.pct > 0) {
      lines.push(
        'Bundle discount: -' +
          Math.round(totals.tier.pct * 100) +
          ' %  (-' +
          formatMoney(totals.subtotalEur * totals.tier.pct, 'EUR') +
          ')',
      );
    }
    lines.push('Net (excl. VAT): ' + formatMoney(totals.netEur, 'EUR'));
    if (totals.vatLine) {
      lines.push('VAT note:        ' + totals.vatLine);
    }
    lines.push('');
    lines.push('Please confirm and send a single Revolut payment link for the bundle total.');
    lines.push('');
    lines.push('Buyer details:');
    lines.push('  Company:    ');
    lines.push('  VAT ID:     ');
    lines.push('  Country:    ');
    lines.push('  Contact:    ');
    var subject =
      'DWS Bundle order \u2014 ' +
      cart.length +
      ' products \u2014 ' +
      formatMoney(totals.netEur, 'EUR') +
      ' net';
    return (
      'mailto:risto@lifetime.fi?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(lines.join('\n'))
    );
  }

  function ensureBarEl() {
    var bar = document.getElementById('dws-bundle-bar');
    if (bar) return bar;
    bar = document.createElement('div');
    bar.id = 'dws-bundle-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Bundle cart');
    bar.innerHTML = [
      '<div class="dws-bundle-bar-inner">',
      '  <div class="dws-bundle-summary">',
      '    <span class="dws-bundle-count" id="dwsBundleCount">0</span>',
      '    <span class="dws-bundle-tier" id="dwsBundleTier">Add 1 more for 10 % off</span>',
      '  </div>',
      '  <div class="dws-bundle-totals" id="dwsBundleTotals"></div>',
      '  <div class="dws-bundle-coupon" id="dwsBundleCoupon">',
      '    <input type="text" class="dws-bundle-coupon-input" data-coupon-input',
      '           placeholder="Coupon code" aria-label="Coupon code" maxlength="32" />',
      '    <button type="button" class="dws-bundle-coupon-apply" data-coupon-apply>Apply</button>',
      '  </div>',
      '  <div class="dws-bundle-actions">',
      '    <button type="button" class="dws-bundle-clear" id="dwsBundleClear">Clear</button>',
      '    <a class="dws-bundle-order" id="dwsBundleOrder" data-action="confirm-order" href="#">Order bundle</a>',
      '  </div>',
      '</div>',
      '<div class="dws-bundle-list" id="dwsBundleList"></div>',
    ].join('');
    document.body.appendChild(bar);
    bar.querySelector('#dwsBundleClear').addEventListener('click', function () {
      if (confirm('Clear bundle?')) clearCart();
    });
    return bar;
  }

  function injectStyles() {
    if (document.getElementById('dws-bundle-styles')) return;
    var s = document.createElement('style');
    s.id = 'dws-bundle-styles';
    s.textContent = [
      '#dws-bundle-bar{position:fixed;left:0;right:0;bottom:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid #f97316;color:#e2e8f0;z-index:9999;box-shadow:0 -8px 32px rgba(0,0,0,0.5);transform:translateY(110%);transition:transform .25s ease;font-family:system-ui,-apple-system,sans-serif}',
      '#dws-bundle-bar.is-visible{transform:translateY(0)}',
      '#dws-bundle-bar.is-expanded .dws-bundle-list{max-height:280px}',
      '.dws-bundle-bar-inner{display:flex;align-items:center;gap:24px;padding:14px 24px;max-width:1280px;margin:0 auto;flex-wrap:wrap}',
      '.dws-bundle-summary{display:flex;align-items:center;gap:14px;flex:0 0 auto}',
      '.dws-bundle-count{display:inline-flex;align-items:center;justify-content:center;min-width:36px;height:36px;border-radius:50%;background:#f97316;color:#0f172a;font-weight:800;font-size:1rem}',
      '.dws-bundle-tier{font-size:.92rem;color:#fcd34d;font-weight:600}',
      '.dws-bundle-totals{flex:1;min-width:200px;display:flex;gap:18px;flex-wrap:wrap;font-size:.9rem}',
      '.dws-bundle-totals .lbl{color:#94a3b8;margin-right:6px}',
      '.dws-bundle-totals .val{color:#e2e8f0;font-weight:700}',
      '.dws-bundle-totals .saving{color:#4ade80}',
      '.dws-bundle-coupon{display:flex;align-items:center;gap:6px;flex:0 0 auto}',
      '.dws-bundle-coupon-input{background:rgba(255,255,255,.07);border:1px solid rgba(148,163,184,.3);color:#e2e8f0;padding:7px 10px;border-radius:6px;font-size:.85rem;width:120px;outline:none}',
      '.dws-bundle-coupon-input:focus{border-color:#60a5fa}',
      '.dws-bundle-coupon-apply{background:rgba(96,165,250,.15);border:1px solid rgba(96,165,250,.4);color:#93c5fd;padding:7px 12px;border-radius:6px;font-size:.85rem;cursor:pointer;font-weight:600}',
      '.dws-bundle-coupon-apply:hover{background:rgba(96,165,250,.25);color:#bfdbfe}',
      '.dws-bundle-actions{display:flex;gap:10px;flex:0 0 auto}',
      '.dws-bundle-clear{background:transparent;border:1px solid rgba(148,163,184,.4);color:#cbd5e1;padding:9px 16px;border-radius:8px;cursor:pointer;font-weight:600;font-size:.9rem}',
      '.dws-bundle-clear:hover{border-color:#ef4444;color:#ef4444}',
      '.dws-bundle-order{background:linear-gradient(135deg,#f97316,#ea580c);color:#0f172a;padding:10px 22px;border-radius:8px;text-decoration:none;font-weight:800;font-size:.95rem;box-shadow:0 4px 14px rgba(249,115,22,.4)}',
      '.dws-bundle-order:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(249,115,22,.55)}',
      '.dws-bundle-list{max-height:0;overflow:auto;transition:max-height .25s ease;border-top:1px solid rgba(148,163,184,.15)}',
      '.dws-bundle-list .row{display:flex;justify-content:space-between;align-items:center;padding:10px 24px;font-size:.88rem;border-bottom:1px solid rgba(148,163,184,.08)}',
      '.dws-bundle-list .row .name{color:#e2e8f0}',
      '.dws-bundle-list .row .price{color:#94a3b8;margin-left:auto;margin-right:14px}',
      '.dws-bundle-list .row .rm{background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:1.1rem;padding:0 4px}',
      '.btn-bundle{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:rgba(249,115,22,.12);color:#fdba74;border:1px solid rgba(249,115,22,.4);padding:8px 14px;border-radius:8px;font-weight:600;font-size:.85rem;cursor:pointer;text-decoration:none;transition:all .2s;width:100%;margin-top:8px}',
      '.btn-bundle:hover{background:rgba(249,115,22,.22);color:#fed7aa;border-color:#f97316}',
      '.btn-bundle.is-in-cart{background:rgba(74,222,128,.15);color:#4ade80;border-color:rgba(74,222,128,.45)}',
      '.btn-bundle.is-in-cart:hover{background:rgba(239,68,68,.15);color:#ef4444;border-color:rgba(239,68,68,.4)}',
      '.btn-bundle.is-in-cart .lbl-add{display:none}',
      '.btn-bundle:not(.is-in-cart) .lbl-rm,.btn-bundle:not(.is-in-cart) .lbl-in{display:none}',
      '.btn-bundle.is-in-cart .lbl-rm{display:inline}',
      '.btn-bundle.is-in-cart:not(:hover) .lbl-rm{display:none}',
      '.btn-bundle.is-in-cart:not(:hover) .lbl-in{display:inline}',
      '.dws-bundle-tease{display:inline-flex;align-items:center;gap:6px;background:rgba(249,115,22,.08);border:1px dashed rgba(249,115,22,.35);color:#fdba74;padding:6px 10px;border-radius:6px;font-size:.78rem;font-weight:600;letter-spacing:.2px;margin-bottom:10px}',
      '@media(max-width:640px){.dws-bundle-bar-inner{padding:12px 14px;gap:12px}.dws-bundle-tier{font-size:.82rem}.dws-bundle-totals{font-size:.82rem;gap:10px}.dws-bundle-order{padding:9px 16px;font-size:.88rem}}',
      'body.has-bundle-bar{padding-bottom:96px}',
    ].join('\n');
    document.head.appendChild(s);
  }

  function refreshAllButtons() {
    var btns = document.querySelectorAll('.btn-bundle[data-bundle-id]');
    Array.prototype.forEach.call(btns, function (b) {
      var id = b.getAttribute('data-bundle-id');
      if (inCart(id)) b.classList.add('is-in-cart');
      else b.classList.remove('is-in-cart');
    });
  }

  function renderBar() {
    var cart = loadCart();
    var bar = ensureBarEl();
    document.body.classList.toggle('has-bundle-bar', cart.length > 0);
    if (cart.length === 0) {
      bar.classList.remove('is-visible');
      return;
    }
    bar.classList.add('is-visible');
    var totals = computeTotals(cart);
    bar.querySelector('#dwsBundleCount').textContent = String(totals.count);
    bar.querySelector('#dwsBundleTier').textContent = totals.tier.label;
    var totalsEl = bar.querySelector('#dwsBundleTotals');
    var pieces = [];
    pieces.push(
      '<span><span class="lbl">Subtotal</span><span class="val">' +
        formatMoney(totals.subtotal, totals.currency) +
        '</span></span>',
    );
    if (totals.tier.pct > 0) {
      pieces.push(
        '<span><span class="lbl">Saving</span><span class="val saving">-' +
          Math.round(totals.tier.pct * 100) +
          ' % \u00b7 ' +
          formatMoney(totals.discount, totals.currency) +
          '</span></span>',
      );
    }
    pieces.push(
      '<span><span class="lbl">Total</span><span class="val">' +
        formatMoney(totals.net, totals.currency) +
        '</span></span>',
    );
    if (totals.vatLine) {
      pieces.push(
        '<span style="opacity:.65;font-size:.8rem;width:100%">' + totals.vatLine + '</span>',
      );
    }
    totalsEl.innerHTML = pieces.join('');
    var listEl = bar.querySelector('#dwsBundleList');
    listEl.innerHTML = cart
      .map(function (i) {
        return (
          '<div class="row"><span class="name">' +
          i.name +
          '</span><span class="price">' +
          formatMoney(i.price, 'EUR') +
          '</span><button type="button" class="rm" data-rm="' +
          i.id +
          '" aria-label="Remove ' +
          i.name +
          '">\u00d7</button></div>'
        );
      })
      .join('');
    Array.prototype.forEach.call(listEl.querySelectorAll('button[data-rm]'), function (b) {
      b.addEventListener('click', function () {
        removeFromCart(b.getAttribute('data-rm'));
      });
    });
    var orderBtn = bar.querySelector('#dwsBundleOrder');
    orderBtn.setAttribute('href', buildMailto(cart, totals));
    bar.classList.toggle('is-expanded', cart.length >= 2);
  }

  function attachCardButton(btn, product) {
    btn.setAttribute('data-bundle-id', product.id);
    btn.innerHTML =
      '<span class="lbl-add">+ Add to bundle</span><span class="lbl-in">\u2713 In bundle</span><span class="lbl-rm">Remove</span>';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (inCart(product.id)) removeFromCart(product.id);
      else addToCart(product);
    });
    if (inCart(product.id)) btn.classList.add('is-in-cart');
  }

  // Public API
  window.dwsBundleCart = {
    add: addToCart,
    remove: removeFromCart,
    clear: clearCart,
    has: inCart,
    list: loadCart,
    attach: attachCardButton,
    render: renderBar,
    refreshButtons: refreshAllButtons,
  };

  // Re-render bar when locale changes (vat-locale.js dispatches this)
  window.addEventListener('storage', function (e) {
    if (e.key === 'dws-locale' || e.key === STORAGE_KEY) renderBar();
  });
  window.addEventListener('dws-locale-change', renderBar);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectStyles();
      renderBar();
    });
  } else {
    injectStyles();
    renderBar();
  }
})();
