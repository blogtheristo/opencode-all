/**
 * Ontology Series CTA Block v1.0
 * Self-injecting 3-button CTA with email-gated whitepaper download.
 *
 * Usage: Add to any ontology-related page:
 *   <div id="ontology-cta"></div>
 *   <script src="/shared-assets/cta/ontology-cta.js" defer></script>
 *
 * Or on onelifetime.world (cross-origin):
 *   <div id="ontology-cta"></div>
 *   <script src="https://dws10.com/shared-assets/cta/ontology-cta.js" defer></script>
 *
 * The whitepaper button opens an inline form requiring enterprise email.
 * Free email providers (gmail, yahoo, hotmail, outlook, etc.) are rejected.
 */

(function () {
  'use strict';

  var FREE_DOMAINS = [
    'gmail.com',
    'googlemail.com',
    'yahoo.com',
    'yahoo.co.uk',
    'yahoo.fi',
    'hotmail.com',
    'hotmail.fi',
    'outlook.com',
    'outlook.fi',
    'live.com',
    'live.fi',
    'aol.com',
    'icloud.com',
    'me.com',
    'mac.com',
    'mail.com',
    'protonmail.com',
    'proton.me',
    'tutanota.com',
    'tuta.com',
    'zoho.com',
    'yandex.com',
    'yandex.ru',
    'gmx.com',
    'gmx.de',
    'web.de',
    'mail.ru',
    'inbox.com',
    'fastmail.com',
    'hey.com',
    'pm.me',
    'duck.com',
    'msn.com',
  ];

  var WHATSAPP_BASE = 'https://wa.me/358400319010';
  var EMAIL_TO = 'risto.paarni@lifetime.fi';
  var WHITEPAPER_URL = 'https://dws10.com/products/lwm-ontology.html';

  function isFreeDomain(email) {
    var domain = (email.split('@')[1] || '').toLowerCase().trim();
    return FREE_DOMAINS.indexOf(domain) !== -1;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  var css =
    '\
    .ont-cta-wrap{text-align:center;padding:48px 24px 56px;border-top:1px solid rgba(255,255,255,0.08);margin-top:48px}\
    .ont-cta-wrap h2{font-size:1.6rem;font-weight:700;color:#f1f5f9;margin-bottom:8px;line-height:1.3}\
    .ont-cta-wrap h2 .accent{color:#60a5fa}\
    .ont-cta-sub{color:#94a3b8;font-size:1rem;margin-bottom:28px}\
    .ont-cta-buttons{display:flex;flex-direction:column;gap:12px;max-width:520px;margin:0 auto}\
    .ont-cta-btn{display:block;background:#60a5fa;color:#0f172a;padding:16px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:1rem;transition:opacity .2s;border:none;cursor:pointer;font-family:inherit}\
    .ont-cta-btn:hover{opacity:.9}\
    .ont-cta-outline{display:block;color:#60a5fa;border:2px solid #60a5fa;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:.95rem;transition:background .2s;background:transparent;cursor:pointer;font-family:inherit}\
    .ont-cta-outline:hover{background:rgba(96,165,250,.1)}\
    .ont-cta-ghost{display:block;color:#4ade80;border:1px solid rgba(74,222,128,.3);padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:.9rem;transition:background .2s;background:transparent;cursor:pointer;font-family:inherit}\
    .ont-cta-ghost:hover{background:rgba(74,222,128,.08)}\
    .ont-cta-small{display:block;font-size:.78rem;color:#94a3b8;margin-top:3px;font-weight:400}\
    .ont-cta-contact{margin-top:18px;font-size:.82rem;color:#64748b}\
    .ont-wp-form{display:none;background:rgba(30,41,59,.95);border:1px solid rgba(74,222,128,.25);border-radius:10px;padding:24px;margin-top:14px;max-width:520px;margin-left:auto;margin-right:auto;text-align:left}\
    .ont-wp-form.visible{display:block}\
    .ont-wp-form label{display:block;font-size:.82rem;font-weight:600;color:#cbd5e1;margin-bottom:4px;margin-top:12px}\
    .ont-wp-form label:first-child{margin-top:0}\
    .ont-wp-form input{width:100%;padding:10px 12px;border-radius:6px;border:1px solid rgba(255,255,255,.12);background:rgba(15,23,42,.8);color:#e2e8f0;font-size:.9rem;font-family:inherit;outline:none;transition:border-color .2s}\
    .ont-wp-form input:focus{border-color:#60a5fa}\
    .ont-wp-form input.error{border-color:#f87171}\
    .ont-wp-form .ont-wp-error{color:#f87171;font-size:.78rem;margin-top:4px;display:none}\
    .ont-wp-form .ont-wp-error.visible{display:block}\
    .ont-wp-consent{display:flex;align-items:flex-start;gap:8px;margin-top:14px;font-size:.8rem;color:#cbd5e1;line-height:1.4;cursor:pointer}\
    .ont-wp-consent input[type=checkbox]{width:auto;margin-top:2px;flex-shrink:0;accent-color:#4ade80}\
    .ont-wp-consent a{color:#60a5fa;text-decoration:underline}\
    .ont-wp-submit{width:100%;margin-top:16px;padding:12px;border-radius:8px;background:#4ade80;color:#0f172a;font-weight:700;font-size:.95rem;border:none;cursor:pointer;font-family:inherit;transition:opacity .2s}\
    .ont-wp-submit:hover{opacity:.9}\
    .ont-wp-submit:disabled{opacity:.5;cursor:not-allowed}\
    .ont-wp-note{font-size:.72rem;color:#64748b;margin-top:8px;text-align:center}\
    .ont-wp-success{display:none;text-align:center;padding:20px}\
    .ont-wp-success.visible{display:block}\
    .ont-wp-success p{color:#4ade80;font-weight:600;font-size:.95rem;margin-bottom:8px}\
    .ont-wp-success .ont-wp-detail{color:#94a3b8;font-size:.82rem;font-weight:400}\
  ';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var pageTitle = document.title || 'ontology post';

  var html =
    '\
    <div class="ont-cta-wrap">\
      <h2>Ground Your AI on <span class="accent">Governed Knowledge</span></h2>\
      <p class="ont-cta-sub">One conversation. We assess your industry, regulatory exposure, and deployment timeline.</p>\
      <div class="ont-cta-buttons">\
        <a href="' +
    WHATSAPP_BASE +
    '?text=' +
    encodeURIComponent(
      'I read "' + pageTitle + '" and I’m interested in the LWM Sovereign Ontology. Industry: ',
    ) +
    '" class="ont-cta-btn" target="_blank">\
          Start a Pilot Conversation\
          <span class="ont-cta-small">Teams · WhatsApp · Jitsi — your choice</span>\
        </a>\
        <a href="https://dws10.com/contact/?subject=' +
    encodeURIComponent('Request: LWM Sovereign Ontology Pilot Delivery Plan') +
    '&body=' +
    encodeURIComponent(
      'I read "' +
        pageTitle +
        '".\nPlease send the Ontology Pilot Delivery Plan for our review.\n\nCompany: \nIndustry: \nKey regulatory exposure: \n',
    ) +
    '" class="ont-cta-outline">\
          Request Pilot Delivery Plan\
          <span class="ont-cta-small">Customized pilot scope, timeline, and NVIDIA hardware specification</span>\
        </a>\
        <button type="button" class="ont-cta-ghost" id="ont-wp-toggle">\
          Request the Whitepaper\
          <span class="ont-cta-small">LWM Sovereign Ontology — full thesis, architecture, and 25-industry ontology library</span>\
        </button>\
      </div>\
      <div class="ont-wp-form" id="ont-wp-form">\
        <label for="ont-wp-name">Full Name</label>\
        <input type="text" id="ont-wp-name" placeholder="e.g. Matti Virtanen" autocomplete="name" required />\
        <label for="ont-wp-email">Work Email</label>\
        <input type="email" id="ont-wp-email" placeholder="matti.virtanen@company.com" autocomplete="email" required />\
        <div class="ont-wp-error" id="ont-wp-email-err">Enterprise email required. Free providers (Gmail, Outlook, Yahoo, etc.) are not accepted.</div>\
        <label for="ont-wp-company">Company Name</label>\
        <input type="text" id="ont-wp-company" placeholder="e.g. Outokumpu Oyj" autocomplete="organization" required />\
        <label class="ont-wp-consent" for="ont-wp-consent">\
          <input type="checkbox" id="ont-wp-consent" required />\
          <span>I agree to the <a href="/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a> and consent to being contacted about this request.</span>\
        </label>\
        <div class="ont-wp-error" id="ont-wp-consent-err">Please agree to the Privacy Policy to continue.</div>\
        <button type="button" class="ont-wp-submit" id="ont-wp-submit">Send Me the Whitepaper</button>\
        <p class="ont-wp-note">We will send the whitepaper to your work email within one business day. No spam, no sequences.</p>\
      </div>\
      <div class="ont-wp-success" id="ont-wp-success">\
        <p>Request received.</p>\
        <span class="ont-wp-detail">The LWM Sovereign Ontology whitepaper will be sent to your work email within one business day.</span>\
      </div>\
      <p class="ont-cta-contact">risto.paarni@lifetime.fi · Lifetime Oy · Helsinki, Finland</p>\
    </div>\
  ';

  var target = document.getElementById('ontology-cta');
  if (!target) {
    target = document.createElement('div');
    target.id = 'ontology-cta';
    var main = document.querySelector('main') || document.querySelector('article') || document.body;
    var footer = document.querySelector('footer');
    if (footer) {
      footer.parentNode.insertBefore(target, footer);
    } else {
      main.appendChild(target);
    }
  }
  target.innerHTML = html;

  var toggleBtn = document.getElementById('ont-wp-toggle');
  var form = document.getElementById('ont-wp-form');
  var nameInput = document.getElementById('ont-wp-name');
  var emailInput = document.getElementById('ont-wp-email');
  var emailErr = document.getElementById('ont-wp-email-err');
  var companyInput = document.getElementById('ont-wp-company');
  var consentInput = document.getElementById('ont-wp-consent');
  var consentErr = document.getElementById('ont-wp-consent-err');
  var submitBtn = document.getElementById('ont-wp-submit');
  var successDiv = document.getElementById('ont-wp-success');

  toggleBtn.addEventListener('click', function () {
    form.classList.toggle('visible');
    if (form.classList.contains('visible')) {
      nameInput.focus();
    }
  });

  emailInput.addEventListener('input', function () {
    emailErr.classList.remove('visible');
    emailInput.classList.remove('error');
  });

  consentInput.addEventListener('change', function () {
    consentErr.classList.remove('visible');
  });

  submitBtn.addEventListener('click', function () {
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var company = companyInput.value.trim();

    if (!name || !email || !company) {
      if (!name) nameInput.classList.add('error');
      if (!email) emailInput.classList.add('error');
      if (!company) companyInput.classList.add('error');
      return;
    }

    if (!isValidEmail(email)) {
      emailInput.classList.add('error');
      emailErr.textContent = 'Please enter a valid email address.';
      emailErr.classList.add('visible');
      return;
    }

    if (isFreeDomain(email)) {
      emailInput.classList.add('error');
      emailErr.textContent =
        'Enterprise email required. Free providers (Gmail, Outlook, Yahoo, etc.) are not accepted.';
      emailErr.classList.add('visible');
      return;
    }

    if (!consentInput.checked) {
      consentErr.classList.add('visible');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var waText =
      'Whitepaper request (LWM Sovereign Ontology):\n' +
      'Name: ' +
      name +
      '\n' +
      'Email: ' +
      email +
      '\n' +
      'Company: ' +
      company +
      '\n' +
      'Source: ' +
      pageTitle;

    var waUrl = WHATSAPP_BASE + '?text=' + encodeURIComponent(waText);

    window.open(waUrl, '_blank');

    form.classList.remove('visible');
    successDiv.classList.add('visible');
    toggleBtn.style.display = 'none';
  });
})();
