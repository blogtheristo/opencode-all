#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude-opus-5-5 Agent=aegis-fi-copy-buyer-definition Date=2026-10-01
// Audit trail: git log -- scripts/i18n/build-wp13-request-pages.cjs
// Builds the WP13 whitepaper request page in five languages (Truth Standard §2J):
// public abstract + contents, full paper sent on request via /api/contact (whitepaper: WP13).
// Writes dws10.com/whitepapers/wp13-when-the-link-drops/ and the landing-pages mirror.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DIRS = ['dws10.com', 'landing-pages/dws10-com'].map((d) =>
  path.join(ROOT, d, 'whitepapers', 'wp13-when-the-link-drops'),
);

const S = {
  en: {
    title: 'When the Link Drops — Aegis acceptance and evidence',
    desc: 'Whitepaper WP13: how DWS IQ 7 Aegis proves offline continuity, stop authority and an audit record the customer can check without the vendor.',
    kicker: 'Whitepaper WP13 · Lifetime Oy · 2026',
    h1: 'When the Link Drops',
    sub: 'Acceptance and evidence for an industrial AI agent — DWS IQ 7 Aegis',
    abstract:
      'An AI agent in a production control room must keep working when the network goes down, stop when an operator says so, and leave a record that someone other than the vendor can check years later. This paper explains how the DWS IQ 7 Aegis pilot proves all three on the customer’s own hardware, with a test the customer runs, and states plainly what the evidence proves and what it does not.',
    forWho: 'Written for the CIO, the CISO and the people who audit the trail.',
    toc: [
      'The acceptance test',
      'The record',
      'Copies the box cannot change',
      'Verifying without Lifetime Oy',
      'What the evidence proves, and what it does not',
      'Phase 0 checklist',
    ],
    tocH: 'Contents',
    formH: 'Request the whitepaper',
    formIntro: 'The paper is sent by email on request. Risto Anton Päärni sends it personally.',
    name: 'Name',
    email: 'Work email',
    company: 'Company',
    phone: 'Phone',
    message: 'Your role or question (optional)',
    trap: 'Leave this field empty',
    button: 'Request WP13',
    sending: 'Sending…',
    sent: 'Request received. The whitepaper will be sent to your email.',
    fail: 'The request could not be sent.',
    product: 'Product page: DWS IQ 7 Aegis Pilot',
    mt: '',
  },
  fi: {
    title: 'Kun yhteys katkeaa — Aegisin hyväksymistesti ja todisteet',
    desc: 'Whitepaper WP13: miten DWS IQ 7 Aegis todentaa toiminnan ilman verkkoa, pysäytysvallan ja lokin, jonka asiakas voi tarkistaa ilman toimittajaa.',
    kicker: 'Whitepaper WP13 · Lifetime Oy · 2026',
    h1: 'Kun yhteys katkeaa',
    sub: 'Teollisen tekoälyagentin hyväksymistesti ja todisteet — DWS IQ 7 Aegis',
    abstract:
      'Tuotantohuoneessa toimivan tekoälyagentin on jatkettava työtä verkon katkettua, pysähdyttävä operaattorin käskystä ja jätettävä jälki, jonka joku muu kuin toimittaja voi tarkistaa vuosienkin päästä. Tämä julkaisu kertoo, miten DWS IQ 7 Aegis -pilotti todentaa kaikki kolme asiakkaan omalla laitteistolla asiakkaan itse ajamalla testillä, ja sanoo suoraan, mitä todisteet todistavat ja mitä eivät.',
    forWho: 'Kirjoitettu CIO:lle, CISO:lle ja niille, jotka tarkastavat jäljen.',
    toc: [
      'Hyväksymistesti',
      'Loki',
      'Kopiot, joita laatikko ei voi muuttaa',
      'Tarkistus ilman Lifetime Oy:tä',
      'Mitä todisteet todistavat ja mitä eivät',
      'Vaiheen 0 tarkistuslista',
    ],
    tocH: 'Sisältö',
    formH: 'Tilaa whitepaper',
    formIntro:
      'Julkaisu lähetetään pyynnöstä sähköpostilla. Risto Anton Päärni lähettää sen henkilökohtaisesti.',
    name: 'Nimi',
    email: 'Työsähköposti',
    company: 'Yritys',
    phone: 'Puhelin',
    message: 'Roolisi tai kysymyksesi (valinnainen)',
    trap: 'Jätä tämä kenttä tyhjäksi',
    button: 'Tilaa WP13',
    sending: 'Lähetetään…',
    sent: 'Pyyntö vastaanotettu. Whitepaper lähetetään sähköpostiisi.',
    fail: 'Pyyntöä ei voitu lähettää.',
    product: 'Tuotesivu: DWS IQ 7 Aegis -pilotti',
    mt: '',
  },
  sv: {
    title: 'När länken bryts — Aegis acceptanstest och bevis',
    desc: 'Whitepaper WP13: hur DWS IQ 7 Aegis visar drift utan nätverk, stoppbefogenhet och en logg som kunden kan kontrollera utan leverantören.',
    kicker: 'Whitepaper WP13 · Lifetime Oy · 2026',
    h1: 'När länken bryts',
    sub: 'Acceptanstest och bevis för en industriell AI-agent — DWS IQ 7 Aegis',
    abstract:
      'En AI-agent i ett kontrollrum måste fortsätta arbeta när nätverket går ner, stanna när en operatör säger till och lämna ett spår som någon annan än leverantören kan kontrollera flera år senare. Den här rapporten förklarar hur DWS IQ 7 Aegis-piloten visar alla tre på kundens egen hårdvara, med ett test som kunden själv kör, och säger tydligt vad bevisen visar och vad de inte visar.',
    forWho: 'Skriven för CIO, CISO och dem som granskar spåret.',
    toc: [
      'Acceptanstestet',
      'Loggen',
      'Kopior som lådan inte kan ändra',
      'Kontroll utan Lifetime Oy',
      'Vad bevisen visar, och vad de inte visar',
      'Checklista för fas 0',
    ],
    tocH: 'Innehåll',
    formH: 'Beställ rapporten',
    formIntro:
      'Rapporten skickas per e-post på begäran. Risto Anton Päärni skickar den personligen.',
    name: 'Namn',
    email: 'Arbetsmejl',
    company: 'Företag',
    phone: 'Telefon',
    message: 'Din roll eller fråga (valfritt)',
    trap: 'Lämna detta fält tomt',
    button: 'Beställ WP13',
    sending: 'Skickar…',
    sent: 'Begäran mottagen. Rapporten skickas till din e-post.',
    fail: 'Begäran kunde inte skickas.',
    product: 'Produktsida: DWS IQ 7 Aegis Pilot',
    mt: 'Maskinassisterad översättning, granskas av en namngiven person.',
  },
  de: {
    title: 'Wenn die Verbindung abbricht — Aegis Abnahmetest und Nachweis',
    desc: 'Whitepaper WP13: wie DWS IQ 7 Aegis Betrieb ohne Netz, Stoppbefugnis und ein Protokoll nachweist, das der Kunde ohne den Anbieter prüfen kann.',
    kicker: 'Whitepaper WP13 · Lifetime Oy · 2026',
    h1: 'Wenn die Verbindung abbricht',
    sub: 'Abnahmetest und Nachweis für einen industriellen KI-Agenten — DWS IQ 7 Aegis',
    abstract:
      'Ein KI-Agent in einer Leitwarte muss weiterarbeiten, wenn das Netz ausfällt, anhalten, wenn ein Operator es sagt, und eine Spur hinterlassen, die jemand anderes als der Anbieter noch Jahre später prüfen kann. Dieses Papier erklärt, wie der DWS IQ 7 Aegis-Pilot alle drei Punkte auf der eigenen Hardware des Kunden nachweist, mit einem Test, den der Kunde selbst durchführt, und sagt klar, was der Nachweis belegt und was nicht.',
    forWho: 'Geschrieben für CIO, CISO und alle, die die Spur prüfen.',
    toc: [
      'Der Abnahmetest',
      'Das Protokoll',
      'Kopien, die die Box nicht ändern kann',
      'Prüfung ohne Lifetime Oy',
      'Was der Nachweis belegt und was nicht',
      'Checkliste Phase 0',
    ],
    tocH: 'Inhalt',
    formH: 'Whitepaper anfordern',
    formIntro:
      'Das Papier wird auf Anfrage per E-Mail versandt. Risto Anton Päärni sendet es persönlich.',
    name: 'Name',
    email: 'Geschäftliche E-Mail',
    company: 'Unternehmen',
    phone: 'Telefon',
    message: 'Ihre Rolle oder Frage (optional)',
    trap: 'Dieses Feld leer lassen',
    button: 'WP13 anfordern',
    sending: 'Wird gesendet…',
    sent: 'Anfrage erhalten. Das Whitepaper wird an Ihre E-Mail gesendet.',
    fail: 'Die Anfrage konnte nicht gesendet werden.',
    product: 'Produktseite: DWS IQ 7 Aegis Pilot',
    mt: 'Maschinell unterstützte Übersetzung, Prüfung durch eine benannte Person ausstehend.',
  },
  fr: {
    title: 'Quand le lien tombe — test de réception et preuves Aegis',
    desc: 'Livre blanc WP13 : comment DWS IQ 7 Aegis prouve la continuité hors réseau, l’autorité d’arrêt et un journal que le client peut vérifier sans le fournisseur.',
    kicker: 'Livre blanc WP13 · Lifetime Oy · 2026',
    h1: 'Quand le lien tombe',
    sub: 'Test de réception et preuves pour un agent IA industriel — DWS IQ 7 Aegis',
    abstract:
      'Un agent IA dans une salle de contrôle doit continuer à travailler quand le réseau tombe, s’arrêter quand un opérateur le demande et laisser une trace que quelqu’un d’autre que le fournisseur peut vérifier des années plus tard. Ce document explique comment le pilote DWS IQ 7 Aegis prouve les trois sur le matériel du client, avec un test que le client exécute lui-même, et dit clairement ce que la preuve établit et ce qu’elle n’établit pas.',
    forWho: 'Écrit pour le DSI, le RSSI et ceux qui auditent la trace.',
    toc: [
      'Le test de réception',
      'Le journal',
      'Des copies que le boîtier ne peut pas modifier',
      'Vérifier sans Lifetime Oy',
      'Ce que la preuve établit, et ce qu’elle n’établit pas',
      'Liste de contrôle de la phase 0',
    ],
    tocH: 'Sommaire',
    formH: 'Demander le livre blanc',
    formIntro:
      'Le document est envoyé par e-mail sur demande. Risto Anton Päärni l’envoie personnellement.',
    name: 'Nom',
    email: 'E-mail professionnel',
    company: 'Entreprise',
    phone: 'Téléphone',
    message: 'Votre rôle ou question (facultatif)',
    trap: 'Laissez ce champ vide',
    button: 'Demander le WP13',
    sending: 'Envoi…',
    sent: 'Demande reçue. Le livre blanc sera envoyé à votre e-mail.',
    fail: 'La demande n’a pas pu être envoyée.',
    product: 'Page produit : DWS IQ 7 Aegis Pilot',
    mt: 'Traduction assistée par machine, relecture par une personne nommée en attente.',
  },
};

const LANGS = Object.keys(S);
const file = (l) => (l === 'en' ? 'index.html' : `index.${l}.html`);
const productHref = (l) => `/products/dws-aegis-pilot-001${l === 'en' ? '' : '.' + l}.html`;
const esc = (t) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:#0f172a;color:#e2e8f0}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at top,#1e3a5f,#0f172a 55%)}main{width:min(100% - 32px,720px);margin:0 auto;padding:56px 0}.card{padding:32px;border:1px solid rgba(148,163,184,.25);border-radius:16px;background:rgba(15,23,42,.9);margin-bottom:24px}.kicker{color:#60a5fa;font-size:.85rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase}h1{margin:6px 0 4px;color:#f8fafc;font-size:clamp(1.8rem,5vw,2.5rem)}h2{color:#f8fafc;font-size:1.2rem;margin:0 0 12px}.sub{margin:0 0 20px;color:#94a3b8}p{line-height:1.6}ol{line-height:1.8;color:#cbd5e1}.langs{font-size:.85rem;color:#94a3b8}.langs a{color:#93c5fd;margin-right:10px}form{display:grid;gap:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}label{display:grid;gap:6px;color:#cbd5e1;font-size:.9rem;font-weight:600}input,textarea{width:100%;border:1px solid #334155;border-radius:8px;padding:11px 12px;color:#f8fafc;background:#111c30;font:inherit}textarea{min-height:100px;resize:vertical}input:focus,textarea:focus{outline:2px solid #60a5fa;outline-offset:1px}.trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}button{border:0;border-radius:8px;padding:13px 20px;color:#0f172a;background:#60a5fa;font:inherit;font-weight:700;cursor:pointer}button:disabled{cursor:wait;opacity:.65}.status{min-height:1.5em;margin:0;color:#94a3b8}.status.success{color:#4ade80}.status.error{color:#f87171}.small{font-size:.85rem;color:#94a3b8}.small a{color:#93c5fd}@media(max-width:560px){main{padding:32px 0}.card{padding:24px}.grid{grid-template-columns:1fr}}`;

function page(l) {
  const s = S[l];
  const alt = LANGS.map(
    (x) =>
      `<link rel="alternate" hreflang="${x}" href="https://dws10.com/whitepapers/wp13-when-the-link-drops/${file(x) === 'index.html' ? '' : file(x)}">`,
  ).join('');
  const langs = LANGS.map((x) => `<a href="./${file(x)}" lang="${x}">${x.toUpperCase()}</a>`).join(
    '',
  );
  return `<!doctype html>
<!-- Generated by scripts/i18n/build-wp13-request-pages.cjs — edit the script, not this file. -->
<html lang="${l}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(s.title)} | Lifetime Oy</title>
<meta name="description" content="${esc(s.desc)}">
${alt}
<style>${CSS}</style>
</head>
<body><main>
<section class="card"><div class="kicker">${esc(s.kicker)}</div><h1>${esc(s.h1)}</h1><p class="sub">${esc(s.sub)}</p><p>${esc(s.abstract)}</p><p>${esc(s.forWho)}</p><p class="langs">${langs}</p>${s.mt ? `<p class="small">${esc(s.mt)}</p>` : ''}</section>
<section class="card"><h2>${esc(s.tocH)}</h2><ol>${s.toc.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></section>
<section class="card" aria-labelledby="wp-form-title"><h2 id="wp-form-title">${esc(s.formH)}</h2><p class="small">${esc(s.formIntro)}</p>
<form id="wp-form"><input type="hidden" name="whitepaper" value="WP13"><div class="grid"><label>${esc(s.name)}<input name="name" autocomplete="name" maxlength="120" required></label><label>${esc(s.email)}<input name="email" type="email" autocomplete="email" maxlength="254" required></label></div><div class="grid"><label>${esc(s.company)}<input name="company" autocomplete="organization" maxlength="160" required></label><label>${esc(s.phone)}<input name="phone" type="tel" autocomplete="tel" maxlength="40" required></label></div><label>${esc(s.message)}<textarea name="message" maxlength="4000"></textarea></label><label class="trap" aria-hidden="true">${esc(s.trap)}<input name="website" tabindex="-1" autocomplete="off"></label><button type="submit">${esc(s.button)}</button><p class="status" id="wp-status" role="status" aria-live="polite"></p></form>
<p class="small"><a href="${productHref(l)}">${esc(s.product)}</a></p>
<p class="small">Risto Anton Päärni · Founder, CEO · Lifetime Oy · risto.paarni@lifetime.fi · +358 400 319 010</p></section>
</main>
<script>
const form=document.getElementById("wp-form"),status=document.getElementById("wp-status"),submit=form.querySelector("button");
form.addEventListener("submit",async event=>{event.preventDefault();status.className="status";status.textContent=${JSON.stringify(s.sending)};submit.disabled=true;try{const response=await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(form)))});const result=await response.json();if(!response.ok)throw new Error(result.error||${JSON.stringify(s.fail)});form.reset();status.className="status success";status.textContent=${JSON.stringify(s.sent)};}catch(error){status.className="status error";status.textContent=error.message;}finally{submit.disabled=false;}});
</script></body></html>
`;
}

for (const dir of DIRS) {
  fs.mkdirSync(dir, { recursive: true });
  for (const l of LANGS) fs.writeFileSync(path.join(dir, file(l)), page(l));
}
console.log(`WP13 request pages: ${LANGS.length} languages × ${DIRS.length} folders`);
