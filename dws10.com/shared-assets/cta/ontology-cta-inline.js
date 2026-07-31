/**
 * Ontology CTA Inline v1.0
 * Form logic only — for pages that already have the CTA HTML inline (e.g. product page).
 * Handles email validation, free-domain rejection, and WhatsApp lead submission.
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

  function isFreeDomain(email) {
    var domain = (email.split('@')[1] || '').toLowerCase().trim();
    return FREE_DOMAINS.indexOf(domain) !== -1;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

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

  if (!toggleBtn || !form) return;

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

  if (consentInput && consentErr) {
    consentInput.addEventListener('change', function () {
      consentErr.classList.remove('visible');
    });
  }

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

    if (consentInput && !consentInput.checked) {
      if (consentErr) consentErr.classList.add('visible');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var pageTitle = document.title || 'LWM Ontology product page';
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

    window.open(WHATSAPP_BASE + '?text=' + encodeURIComponent(waText), '_blank');

    form.classList.remove('visible');
    successDiv.classList.add('visible');
    toggleBtn.style.display = 'none';
  });
})();
