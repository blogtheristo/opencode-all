/*!
 * lsj-ads.js — Lifetime Scope Journal Ad Slot Widget
 * Code-Version: 1.0
 * Introduced-In: PR-blog-v2-polls-ads
 * Branch: claude/blog-polls-ads-features-spdD1
 * Date: 2026-05-07
 * Owner: Lifetime Oy
 *
 * Usage: add <div class="lsj-ad-slot" data-slot="sponsor|mid|footer"> to any post.
 * Ad content is loaded from /shared-assets/lsj-ads-config.json.
 * If no active ad exists for a slot, the element is silently removed.
 *
 * Slot types:
 *   sponsor  — top-of-article "Sponsored by" brand card
 *   mid      — mid-article context card (after 3rd paragraph or explicit placement)
 *   footer   — end-of-article partner CTA
 */
(function () {
  'use strict';

  var CONFIG_URL = '/shared-assets/lsj-ads-config.json';

  function buildSponsorCard(ad) {
    return (
      '<div style="' +
      'border:1px solid rgba(212,168,67,0.25);border-radius:8px;padding:14px 18px;' +
      'background:rgba(212,168,67,0.04);display:flex;align-items:center;gap:14px;' +
      'margin:24px 0;">' +
      '<span style="font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;' +
      'color:#d4a843;white-space:nowrap;">Sponsored by</span>' +
      '<div style="flex:1;border-left:1px solid rgba(212,168,67,0.2);padding-left:14px;">' +
      '<a href="' +
      ad.url +
      '" target="_blank" rel="noopener sponsored" ' +
      'style="font-weight:700;color:#f1f5f9;text-decoration:none;font-size:0.9rem;">' +
      ad.name +
      '</a>' +
      '<p style="margin:3px 0 0;font-size:0.78rem;color:#94a3b8;">' +
      ad.tagline +
      '</p>' +
      '</div>' +
      (ad.cta
        ? '<a href="' +
          ad.url +
          '" target="_blank" rel="noopener sponsored" ' +
          'style="font-size:0.75rem;font-weight:600;color:#d4a843;white-space:nowrap;text-decoration:none;">' +
          ad.cta +
          ' &rarr;</a>'
        : '') +
      '</div>'
    );
  }

  function buildMidCard(ad) {
    return (
      '<div style="' +
      'border:1px solid rgba(96,165,250,0.2);border-radius:8px;padding:20px 22px;' +
      'background:rgba(15,23,42,0.8);margin:36px 0;">' +
      '<p style="font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;' +
      'color:#60a5fa;margin-bottom:8px;">Partner Content</p>' +
      '<h4 style="font-size:1rem;font-weight:700;color:#f1f5f9;margin-bottom:6px;">' +
      ad.headline +
      '</h4>' +
      '<p style="font-size:0.85rem;color:#94a3b8;margin-bottom:12px;">' +
      ad.body +
      '</p>' +
      '<a href="' +
      ad.url +
      '" target="_blank" rel="noopener sponsored" ' +
      'style="font-size:0.8rem;font-weight:700;color:#60a5fa;text-decoration:none;">' +
      (ad.cta || 'Learn more') +
      ' &rarr;</a>' +
      '</div>'
    );
  }

  function buildFooterCard(ad) {
    return (
      '<div style="' +
      'border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;margin-top:24px;' +
      'display:flex;flex-direction:column;gap:6px;">' +
      '<p style="font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;' +
      'color:#475569;">Partner</p>' +
      '<a href="' +
      ad.url +
      '" target="_blank" rel="noopener sponsored" ' +
      'style="font-weight:700;color:#f1f5f9;font-size:0.9rem;text-decoration:none;">' +
      ad.name +
      '</a>' +
      '<p style="font-size:0.78rem;color:#64748b;">' +
      ad.tagline +
      '</p>' +
      '</div>'
    );
  }

  function renderSlot(el, config) {
    var slotType = el.getAttribute('data-slot') || 'sponsor';
    var category = el.getAttribute('data-category') || null;

    var ads = (config.ads || []).filter(function (ad) {
      if (!ad.active) return false;
      if (ad.slots && ad.slots.indexOf(slotType) === -1) return false;
      if (category && ad.categories && ad.categories.indexOf(category) === -1) return false;
      return true;
    });

    if (!ads.length) {
      el.style.display = 'none';
      return;
    }

    /* rotate: pick by day-of-year mod ads.length */
    var idx = Math.floor(Date.now() / 86400000) % ads.length;
    var ad = ads[idx];

    var html = '';
    if (slotType === 'sponsor') html = buildSponsorCard(ad);
    else if (slotType === 'mid') html = buildMidCard(ad);
    else if (slotType === 'footer') html = buildFooterCard(ad);

    el.innerHTML = html;
  }

  function init() {
    var slots = document.querySelectorAll('.lsj-ad-slot');
    if (!slots.length) return;

    fetch(CONFIG_URL)
      .then(function (r) {
        return r.json();
      })
      .then(function (config) {
        slots.forEach(function (el) {
          renderSlot(el, config);
        });
      })
      .catch(function () {
        slots.forEach(function (el) {
          el.style.display = 'none';
        });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
