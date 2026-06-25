/**
 * Claude Code Coaching — registration form + general Revolut pay button.
 * Injects into #coaching-register. Localised by <html lang>. Submitting builds a
 * mailto to risto.paarni@lifetime.fi (no backend). The Revolut button uses the
 * general Lifetime Oy link where the customer sets the amount.
 *
 * Usage: <div id="coaching-register"></div>
 *        <script src="../shared-assets/coaching-register.js"></script>
 */
(function () {
  'use strict';
  var REVOLUT = 'https://revolut.me/lifetimeoy';
  var TO = 'risto.paarni@lifetime.fi';

  var T = {
    en: {
      h: 'Register your team',
      sub: 'Send your details and pay the amount for your chosen option with Revolut.',
      name: 'Full name',
      company: 'Company',
      email: 'Email',
      phone: 'Phone (optional)',
      course: 'Option',
      participants: 'Participants',
      notes: 'Notes (optional)',
      send: 'Send registration',
      pay: 'Pay with Revolut (you set the amount)',
      courses: [
        '1-Day Lecture',
        '2-Day Workshop',
        'Lecture + Workshop (3 days)',
        'Client Project Work',
      ],
      subject: 'Claude Code Coaching registration',
    },
    fi: {
      h: 'Ilmoita tiimisi',
      sub: 'Lähetä tietosi ja maksa valitsemasi vaihtoehdon summa Revolutilla.',
      name: 'Koko nimi',
      company: 'Yritys',
      email: 'Sähköposti',
      phone: 'Puhelin (valinnainen)',
      course: 'Vaihtoehto',
      participants: 'Osallistujat',
      notes: 'Lisätiedot (valinnainen)',
      send: 'Lähetä ilmoittautuminen',
      pay: 'Maksa Revolutilla (asetat summan)',
      courses: [
        '1 päivän luento',
        '2 päivän työpaja',
        'Luento + työpaja (3 päivää)',
        'Asiakasprojektityö',
      ],
      subject: 'Claude Code -valmennus ilmoittautuminen',
    },
    sv: {
      h: 'Anmäl ert team',
      sub: 'Skicka era uppgifter och betala beloppet för ert valda alternativ med Revolut.',
      name: 'Fullständigt namn',
      company: 'Företag',
      email: 'E-post',
      phone: 'Telefon (valfritt)',
      course: 'Alternativ',
      participants: 'Deltagare',
      notes: 'Anteckningar (valfritt)',
      send: 'Skicka anmälan',
      pay: 'Betala med Revolut (du anger beloppet)',
      courses: [
        '1 dags föreläsning',
        '2 dagars workshop',
        'Föreläsning + workshop (3 dagar)',
        'Kundprojekt',
      ],
      subject: 'Claude Code-coaching anmälan',
    },
    de: {
      h: 'Melden Sie Ihr Team an',
      sub: 'Senden Sie Ihre Angaben und zahlen Sie den Betrag für Ihre Option mit Revolut.',
      name: 'Vollständiger Name',
      company: 'Unternehmen',
      email: 'E-Mail',
      phone: 'Telefon (optional)',
      course: 'Option',
      participants: 'Teilnehmer',
      notes: 'Anmerkungen (optional)',
      send: 'Anmeldung senden',
      pay: 'Mit Revolut zahlen (Sie legen den Betrag fest)',
      courses: [
        '1-Tages-Vortrag',
        '2-Tages-Workshop',
        'Vortrag + Workshop (3 Tage)',
        'Kundenprojekt',
      ],
      subject: 'Claude Code Coaching Anmeldung',
    },
    fr: {
      h: 'Inscrivez votre équipe',
      sub: 'Envoyez vos coordonnées et payez le montant de votre option avec Revolut.',
      name: 'Nom complet',
      company: 'Entreprise',
      email: 'E-mail',
      phone: 'Téléphone (facultatif)',
      course: 'Option',
      participants: 'Participants',
      notes: 'Remarques (facultatif)',
      send: "Envoyer l'inscription",
      pay: 'Payer avec Revolut (vous fixez le montant)',
      courses: [
        "Conférence d'1 jour",
        'Atelier de 2 jours',
        'Conférence + atelier (3 jours)',
        'Projet client',
      ],
      subject: 'Coaching Claude Code inscription',
    },
  };

  var lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  var t = T[lang] || T.en;
  var host = document.getElementById('coaching-register');
  if (!host) return;

  // Scoped styles (once)
  if (!document.getElementById('ccr-style')) {
    var css = [
      '#coaching-register{margin-top:8px}',
      '.ccr-form{display:grid;grid-template-columns:1fr 1fr;gap:14px;background:rgba(30,41,59,.6);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:24px}',
      '.ccr-form .full{grid-column:1 / -1}',
      '.ccr-form label{display:block;font-size:.8rem;color:#94a3b8;margin-bottom:4px}',
      '.ccr-form input,.ccr-form select,.ccr-form textarea{width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;border-radius:6px;color:#e2e8f0;padding:9px 11px;font:inherit;font-size:.92rem}',
      '.ccr-form textarea{min-height:70px;resize:vertical}',
      '.ccr-actions{grid-column:1 / -1;display:flex;gap:12px;flex-wrap:wrap;margin-top:4px}',
      '.ccr-send{background:#2563eb;color:#fff;border:0;font-weight:700;padding:12px 22px;border-radius:6px;cursor:pointer;font-size:.95rem}',
      '.ccr-send:hover{background:#1d4ed8}',
      '.ccr-pay{display:inline-flex;align-items:center;background:#0075eb;color:#fff;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:6px;font-size:.95rem}',
      '.ccr-pay:hover{background:#0061c4}',
      '@media(max-width:560px){.ccr-form{grid-template-columns:1fr}}',
    ].join('');
    var s = document.createElement('style');
    s.id = 'ccr-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function opt(v) {
    return '<option>' + v + '</option>';
  }
  host.innerHTML =
    '<h2>' +
    t.h +
    '</h2>' +
    '<p class="vat-note">' +
    t.sub +
    '</p>' +
    '<form class="ccr-form" id="ccr-form">' +
    '<div><label>' +
    t.name +
    '</label><input name="name" required></div>' +
    '<div><label>' +
    t.company +
    '</label><input name="company"></div>' +
    '<div><label>' +
    t.email +
    '</label><input name="email" type="email" required></div>' +
    '<div><label>' +
    t.phone +
    '</label><input name="phone"></div>' +
    '<div><label>' +
    t.course +
    '</label><select name="course">' +
    t.courses.map(opt).join('') +
    '</select></div>' +
    '<div><label>' +
    t.participants +
    '</label><input name="participants" type="number" min="1" value="1"></div>' +
    '<div class="full"><label>' +
    t.notes +
    '</label><textarea name="notes"></textarea></div>' +
    '<div class="ccr-actions">' +
    '<button type="submit" class="ccr-send">' +
    t.send +
    '</button>' +
    '<a class="ccr-pay" href="' +
    REVOLUT +
    '" target="_blank" rel="noopener">' +
    t.pay +
    '</a>' +
    '</div>' +
    '</form>';

  document.getElementById('ccr-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    function g(n) {
      return ((f.elements[n] && f.elements[n].value) || '').trim();
    }
    var body =
      t.name +
      ': ' +
      g('name') +
      '\n' +
      t.company +
      ': ' +
      g('company') +
      '\n' +
      t.email +
      ': ' +
      g('email') +
      '\n' +
      t.phone +
      ': ' +
      g('phone') +
      '\n' +
      t.course +
      ': ' +
      g('course') +
      '\n' +
      t.participants +
      ': ' +
      g('participants') +
      '\n' +
      t.notes +
      ': ' +
      g('notes') +
      '\n';
    window.location.href =
      'mailto:' +
      TO +
      '?subject=' +
      encodeURIComponent(t.subject) +
      '&body=' +
      encodeURIComponent(body);
  });
})();
