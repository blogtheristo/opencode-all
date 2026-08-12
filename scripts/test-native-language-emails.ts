/**
 * Test script: Send 5 native-language Captain DM emails (SV, DE, FI, FR, EN)
 * Uses the production transport: Amazon SES (SMTP).
 * All sent to risto@lifetime.fi for review before real outreach.
 *
 * Requires: SMTP_HOST + SMTP_USER + SMTP_PASS (SES primary)
 *
 * Usage: npx tsx scripts/test-native-language-emails.ts
 */

import 'dotenv/config';
import { sendEmail } from '../src/utils/send-email.js';

const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const TO = 'risto@lifetime.fi';

const hasSmtp = !!process.env.SMTP_HOST;

if (!hasSmtp) {
  console.error('ERROR: No email transport configured.');
  console.error('  Primary: SMTP_HOST, SMTP_USER, SMTP_PASS (Amazon SES)');
  process.exit(1);
}

console.log(`Transport: ${hasSmtp ? 'Amazon SES (SMTP)' : 'SES not configured'}`);

interface TestEmail {
  lang: string;
  subject: string;
  body: string;
}

const emails: TestEmail[] = [
  {
    lang: 'SV',
    subject: 'TEST SV: Captain DM — Svenska mall (NCC/Skanska/Sweco)',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<p>Hej [Förnamn],</p>
<p>Ert arbete på [Företag] fångade min uppmärksamhet — särskilt [FYLL I: specifik LinkedIn-inlägg, initiativ eller nyhet].</p>
<p>En snabb fråga: hur automatiserar ert team EPBD/EN 15978-efterlevnad idag? Vi ser att de flesta bygg-företag fortfarande kör detta via konsulter och kalkylark till sexsiffriga årskostnader.</p>
<p>Jag bygger <strong>DWS IQ 6</strong> — en klimatintelligensplattform som automatiserar Fit for 55-efterlevnad över 20 EU-reglerade branscher. Vi är i produktion med EUR 7k+ MRR och byggkunder.</p>
<p>Passar en 30-minuters demo? Livedata, inga slides.</p>
<p>— Risto</p>
</div>`,
  },
  {
    lang: 'DE',
    subject: 'TEST DE: Captain DM — Deutsche Vorlage (PORR/STRABAG/HOCHTIEF)',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<p>Hallo [Vorname],</p>
<p>Ihre Arbeit bei [Unternehmen] hat meine Aufmerksamkeit erregt — insbesondere [AUSFÜLLEN: spezifischer LinkedIn-Post, Initiative oder Nachricht].</p>
<p>Eine kurze Frage: Wie automatisiert Ihr Team die EPBD/EN 15978-Compliance derzeit? Wir sehen, dass die meisten Bau-Unternehmen dies noch über Berater und Tabellenkalkulationen abwickeln — zu sechsstelligen Jahreskosten.</p>
<p>Ich baue <strong>DWS IQ 6</strong> — eine Klimaintelligenz-Plattform, die Fit-for-55-Compliance über 20 EU-regulierte Branchen automatisiert. Wir sind in Produktion mit EUR 7k+ MRR und Baukunden.</p>
<p>Passt eine 30-Minuten-Demo? Live-Daten, keine Slides.</p>
<p>— Risto</p>
</div>`,
  },
  {
    lang: 'FI',
    subject: 'TEST FI: Captain DM — Suomenkielinen malli (Petri Kasari / Sweco)',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<p>Hei [Etunimi],</p>
<p>Työsi [Yritys]:ssä kiinnitti huomioni — erityisesti [TÄYTÄ: tarkka LinkedIn-postaus, aloite tai uutinen].</p>
<p>Nopea kysymys: miten tiimisi hoitaa Fit for 55 -raportoinnin tällä hetkellä — CSRD, EPBD, EN 15978 hiilijalanjäljen elinkaariarviointi? Manuaaliset taulukot, konsultit vai jokin muu?</p>
<p>Rakennan <strong>DWS IQ 6</strong>:ta — teollista ilmastoälyalustaa joka kattaa 20 EU-säänneltyä toimialaa. Olemme tuotannossa EUR 7k+ MRR:lla ja rakennussektorin asiakkailla.</p>
<p>Sopiiko 30 minuutin demo? Livedataa, ei slidejä.</p>
<p>— Risto</p>
</div>`,
  },
  {
    lang: 'FR',
    subject: 'TEST FR: Captain DM — Modèle français (Vinci/Bouygues/Eiffage)',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<p>Bonjour [Prénom],</p>
<p>Votre travail chez [Entreprise] a retenu mon attention — en particulier [À REMPLIR : post LinkedIn spécifique, initiative ou actualité].</p>
<p>Une question rapide : comment votre équipe gère-t-elle le reporting Fit for 55 aujourd'hui — CSRD, EPBD, cycle de vie carbone EN 15978 ? Tableurs manuels, consultants, ou autre chose ?</p>
<p>Je développe <strong>DWS IQ 6</strong> — une plateforme d'intelligence climatique industrielle couvrant 20 secteurs réglementés de l'UE. Nous sommes en production avec EUR 7k+ de MRR et des clients construction.</p>
<p>Un démo de 30 minutes, ça vous dit ? Données en direct, pas de slides.</p>
<p>— Risto</p>
</div>`,
  },
  {
    lang: 'EN',
    subject: 'TEST EN: Captain DM — English template (Balfour Beatty)',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<p>Hi [First Name],</p>
<p>I noticed your work at [Company] — particularly [FILL IN: specific LinkedIn post, initiative, or news].</p>
<p>Quick question: how is your team handling Fit for 55 reporting right now — CSRD, EPBD, EN 15978 carbon lifecycle? Manual spreadsheets, consultants, or something else?</p>
<p>I'm building <strong>DWS IQ 6</strong> — an industrial climate intelligence platform covering 20 EU regulated industries. We're live in production with EUR 7k+ MRR and construction sector customers.</p>
<p>Would a 30-minute demo make sense? Live data, not slides.</p>
<p>— Risto</p>
</div>`,
  },
];

async function main() {
  console.log('=== Native Language Captain DM Test Emails ===\n');
  console.log(`From: ${FROM}`);
  console.log(`To:   ${TO}\n`);

  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    process.stdout.write(`  ${email.lang}... `);
    const result = await sendEmail({
      from: FROM,
      to: TO,
      subject: email.subject,
      html: email.body,
      replyTo: FROM,
    });
    if (result.ok) {
      console.log(`OK via ${result.transport}`);
      sent++;
    } else {
      console.log(`FAIL: ${result.error}`);
      failed++;
    }
  }

  console.log(`\n=== Summary: ${sent}/5 sent, ${failed}/5 failed ===`);
}

main().catch(console.error);
