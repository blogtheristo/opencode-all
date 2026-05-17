/* DWS Sovereign Playbooks — email-gate client.
 *
 * Two-step flow:
 *   1) POST {email, industry, language, consent_*}  → request code
 *   2) POST {email, industry, code}                  → receive signed URL
 *
 * The Supabase function URL is supplied via window.PB_CONFIG.
 * No third-party trackers; vanilla fetch only.
 */
(function () {
  'use strict';

  const cfg = window.PB_CONFIG || {};
  const BASE = (cfg.supabaseUrl || '').replace(/\/+$/, '');
  const ANON = cfg.supabaseAnonKey || '';
  const INDUSTRY = cfg.industry;
  const LANG = cfg.language || 'en';
  const CONSENT_TEXT =
    'I consent to Lifetime Oy contacting me about the DWS sovereign-stack ' +
    'playbook I requested, and to storing my email for that purpose. I can ' +
    'withdraw consent at any time by replying to any DWS email.';

  function $(sel) { return document.querySelector(sel); }

  function setStatus(kind, msg) {
    const el = $('#pb-status');
    if (!el) return;
    el.className = 'pb-status-msg show ' + (kind === 'ok' ? 'ok' : 'err');
    el.textContent = msg;
  }

  function showStep(name) {
    document.querySelectorAll('[data-pb-step]').forEach((el) => {
      el.style.display = el.dataset.pbStep === name ? '' : 'none';
    });
  }

  async function postJson(path, body) {
    if (!BASE) throw new Error('config-missing');
    const res = await fetch(BASE + path, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'apikey': ANON,
        'authorization': 'Bearer ' + ANON,
      },
      body: JSON.stringify(body),
    });
    let data = null;
    try { data = await res.json(); } catch (_) { /* tolerate empty */ }
    return { status: res.status, data };
  }

  function readUtm() {
    const u = new URL(window.location.href);
    const get = (k) => u.searchParams.get(k) || undefined;
    return {
      source: get('utm_source'),
      medium: get('utm_medium'),
      campaign: get('utm_campaign'),
      term: get('utm_term'),
      content: get('utm_content'),
    };
  }

  async function handleRequest(ev) {
    ev.preventDefault();
    const email = ($('#pb-email').value || '').trim();
    const consent = $('#pb-consent').checked;
    const marketing = $('#pb-marketing') ? $('#pb-marketing').checked : false;
    if (!email) { setStatus('err', 'Enter your work email.'); return; }
    if (!consent) { setStatus('err', 'Please confirm the consent box.'); return; }

    const btn = $('#pb-submit'); btn.disabled = true;
    setStatus('ok', 'Sending code…');

    try {
      const r = await postJson('/functions/v1/playbook-request', {
        email,
        industry: INDUSTRY,
        language: LANG,
        consent_marketing: marketing,
        consent_text: CONSENT_TEXT,
        utm: readUtm(),
      });
      if (r.status === 200 && r.data && r.data.ok) {
        if (r.data.mode === 'waitlist') {
          setStatus('ok', 'You are on the wait-list. Check your inbox for confirmation.');
          showStep('waitlist');
        } else {
          setStatus('ok', 'Code sent. Check your inbox (it expires in 15 minutes).');
          showStep('verify');
        }
      } else if (r.status === 429) {
        setStatus('err', 'Too many requests — please wait an hour and try again.');
      } else if (r.status === 400) {
        setStatus('err', 'That email did not pass validation. Try a different address.');
      } else {
        setStatus('err', 'Something went wrong sending the code. Please retry.');
      }
    } catch (e) {
      setStatus('err', 'Network error — please retry.');
    } finally {
      btn.disabled = false;
    }
  }

  async function handleVerify(ev) {
    ev.preventDefault();
    const email = ($('#pb-email').value || '').trim();
    const code = ($('#pb-code').value || '').trim().toUpperCase();
    if (code.length !== 6) { setStatus('err', 'The code is 6 characters.'); return; }

    const btn = $('#pb-verify'); btn.disabled = true;
    setStatus('ok', 'Verifying…');

    try {
      const r = await postJson('/functions/v1/playbook-verify', {
        email, industry: INDUSTRY, code,
      });
      if (r.status === 200 && r.data && r.data.signed_url) {
        setStatus('ok', 'Verified. Your download is opening in a new tab.');
        window.open(r.data.signed_url, '_blank', 'noopener,noreferrer');
        showStep('done');
      } else if (r.status === 401) {
        setStatus('err', 'That code is not valid. Check the email and try again.');
      } else if (r.status === 410) {
        setStatus('err', 'That code has expired. Request a new one.');
        showStep('request');
      } else if (r.status === 423) {
        setStatus('err', 'Too many wrong attempts. Request a new code.');
        showStep('request');
      } else {
        setStatus('err', 'Verification failed. Please retry.');
      }
    } catch (e) {
      setStatus('err', 'Network error — please retry.');
    } finally {
      btn.disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const reqForm = $('#pb-request-form');
    const verForm = $('#pb-verify-form');
    if (reqForm) reqForm.addEventListener('submit', handleRequest);
    if (verForm) verForm.addEventListener('submit', handleVerify);
    showStep('request');
  });
})();
