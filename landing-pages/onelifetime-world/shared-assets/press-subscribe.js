/**
 * DWS Press Subscribe Widget v1.0
 * Introduced-In: PR-TBD (iceye-jgi-deforestation)
 * Code-Version: 1.0
 * Branch: claude/iceye-jgi-deforestation-PSzCd
 * Date: 2026-04-23
 * Owner: Lifetime Oy
 *
 * Drop-in subscribe form for press-release and blog pages.
 * Calls Supabase RPC `subscribe_press` (migration 062).
 * Falls back to mailto if the RPC is not yet deployed.
 *
 * Usage:
 *   <div data-dws-press-subscribe data-site="dws10.com"></div>
 *   <script src="/shared-assets/press-subscribe.js" defer></script>
 *
 * Required window globals (set on page before widget loads):
 *   window.SUPABASE_URL         = 'https://<project>.supabase.co';
 *   window.SUPABASE_ANON_KEY    = '<anon-key>';
 * If either is missing, the widget renders in mailto-fallback mode.
 */
(function () {
  'use strict';

  if (window.__dwsPressSubscribeLoaded) return;
  window.__dwsPressSubscribeLoaded = true;

  var CSS = [
    '.dws-ps-wrap {',
    '  background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9));',
    '  border: 1px solid rgba(96,165,250,0.25);',
    '  border-radius: 14px;',
    '  padding: 28px 32px;',
    '  margin: 40px auto;',
    '  max-width: 720px;',
    '  color: #e2e8f0;',
    '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
    '}',
    '.dws-ps-title {',
    '  font-size: 1.15rem;',
    '  font-weight: 700;',
    '  margin: 0 0 6px;',
    '  color: #f8fafc;',
    '}',
    '.dws-ps-sub {',
    '  font-size: 0.92rem;',
    '  color: #94a3b8;',
    '  line-height: 1.55;',
    '  margin: 0 0 16px;',
    '}',
    '.dws-ps-form {',
    '  display: flex;',
    '  gap: 8px;',
    '  flex-wrap: wrap;',
    '}',
    '.dws-ps-input {',
    '  flex: 1 1 240px;',
    '  min-width: 0;',
    '  padding: 12px 14px;',
    '  background: rgba(15,23,42,0.7);',
    '  border: 1px solid rgba(148,163,184,0.3);',
    '  border-radius: 8px;',
    '  color: #f1f5f9;',
    '  font-size: 0.95rem;',
    '  font-family: inherit;',
    '  transition: border-color 0.15s;',
    '}',
    '.dws-ps-input:focus {',
    '  outline: none;',
    '  border-color: #60a5fa;',
    '}',
    '.dws-ps-btn {',
    '  padding: 12px 22px;',
    '  background: linear-gradient(135deg, #2563eb, #1d4ed8);',
    '  color: #fff;',
    '  border: none;',
    '  border-radius: 8px;',
    '  font-size: 0.95rem;',
    '  font-weight: 600;',
    '  cursor: pointer;',
    '  transition: filter 0.15s, transform 0.15s;',
    '  font-family: inherit;',
    '}',
    '.dws-ps-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }',
    '.dws-ps-btn:disabled { opacity: 0.6; cursor: wait; transform: none; }',
    '.dws-ps-note {',
    '  font-size: 0.78rem;',
    '  color: #64748b;',
    '  margin: 12px 0 0;',
    '  line-height: 1.5;',
    '}',
    '.dws-ps-note a { color: #60a5fa; text-decoration: none; }',
    '.dws-ps-note a:hover { text-decoration: underline; }',
    '.dws-ps-msg {',
    '  margin-top: 12px;',
    '  padding: 10px 14px;',
    '  border-radius: 8px;',
    '  font-size: 0.9rem;',
    '  display: none;',
    '}',
    '.dws-ps-msg.ok {',
    '  display: block;',
    '  background: rgba(16,185,129,0.12);',
    '  color: #4ade80;',
    '  border: 1px solid rgba(74,222,128,0.3);',
    '}',
    '.dws-ps-msg.err {',
    '  display: block;',
    '  background: rgba(239,68,68,0.12);',
    '  color: #fca5a5;',
    '  border: 1px solid rgba(248,113,113,0.3);',
    '}',
    '@media (max-width: 480px) {',
    '  .dws-ps-wrap { padding: 22px 18px; }',
    '  .dws-ps-form { flex-direction: column; }',
    '  .dws-ps-btn { width: 100%; }',
    '}',
  ].join('\n');

  function injectCSS() {
    if (document.getElementById('dws-ps-style')) return;
    var s = document.createElement('style');
    s.id = 'dws-ps-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function buildWidget(host) {
    var site = host.getAttribute('data-site') || 'dws10.com';
    var title = host.getAttribute('data-title') || 'Subscribe to DWS press releases';
    var sub =
      host.getAttribute('data-sub') ||
      "Get the latest announcements from Lifetime Oy directly to your inbox. Follow us on LinkedIn for updates. For press inquiries see our <a href='/press-releases/'>Press section</a>.";

    host.innerHTML =
      '<div class="dws-ps-wrap" role="form" aria-label="Press release subscribe">' +
      '<h3 class="dws-ps-title">' +
      title +
      '</h3>' +
      '<p class="dws-ps-sub">' +
      sub +
      '</p>' +
      '<form class="dws-ps-form" novalidate>' +
      '<input class="dws-ps-input" type="email" name="email" required placeholder="you@company.com" autocomplete="email" aria-label="Email address">' +
      '<button class="dws-ps-btn" type="submit">Subscribe</button>' +
      '</form>' +
      '<p class="dws-ps-msg" role="status" aria-live="polite"></p>' +
      '<p class="dws-ps-note">By submitting, you agree to Lifetime Oy’s <a href="https://dws10.com/privacy-policy/">Privacy Policy</a>. Double opt-in. Unsubscribe any time.</p>' +
      '</div>';

    var form = host.querySelector('.dws-ps-form');
    var input = host.querySelector('.dws-ps-input');
    var btn = host.querySelector('.dws-ps-btn');
    var msg = host.querySelector('.dws-ps-msg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input.value || '').trim();
      msg.className = 'dws-ps-msg';
      msg.textContent = '';
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        msg.className = 'dws-ps-msg err';
        msg.textContent = 'Please enter a valid email address.';
        return;
      }
      btn.disabled = true;
      submit(email, site)
        .then(function (r) {
          if (r && r.ok) {
            msg.className = 'dws-ps-msg ok';
            msg.textContent = r.confirmed
              ? 'You are subscribed. Thank you.'
              : 'Thanks — check your inbox to confirm your subscription.';
            input.value = '';
          } else {
            msg.className = 'dws-ps-msg err';
            msg.textContent = (r && r.error) || 'Subscription temporarily unavailable.';
          }
        })
        .catch(function () {
          // Fallback: mailto handoff
          msg.className = 'dws-ps-msg ok';
          msg.innerHTML =
            'Opening your email client as a fallback — <a href="mailto:press@onelifetime.world?subject=Subscribe%20' +
            encodeURIComponent(site) +
            '&body=Please%20add%20' +
            encodeURIComponent(email) +
            '%20to%20the%20list." style="color:#60a5fa;">tap here if nothing opens</a>.';
        })
        .finally(function () {
          btn.disabled = false;
        });
    });
  }

  function submit(email, site) {
    var url = window.SUPABASE_URL;
    var key = window.SUPABASE_ANON_KEY;
    var lang = localStorage.getItem('dws-lang') || 'en';

    if (!url || !key) {
      return Promise.reject(new Error('supabase-not-configured'));
    }

    return fetch(url.replace(/\/$/, '') + '/rest/v1/rpc/subscribe_press', {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_email: email,
        p_site: site,
        p_source_page: window.location.pathname,
        p_language: ['en', 'fi', 'sv', 'de', 'fr'].indexOf(lang) >= 0 ? lang : 'en',
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('rpc-http-' + res.status);
        return res.json();
      })
      .then(function (data) {
        // Supabase wraps jsonb return in an array sometimes; normalise
        if (Array.isArray(data)) data = data[0];
        return data;
      });
  }

  function init() {
    injectCSS();
    var hosts = document.querySelectorAll('[data-dws-press-subscribe]');
    hosts.forEach(buildWidget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
