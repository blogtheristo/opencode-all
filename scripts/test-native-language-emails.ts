/**
 * Test script: Send 5 native-language Captain DM emails (SV, DE, FI, FR, EN)
 * Uses Resend API directly (no nodemailer dependency needed).
 * All sent to risto@lifetime.fi for review before real outreach.
 *
 * Usage: npx tsx scripts/test-native-language-emails.ts
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const TO = 'risto@lifetime.fi';

if (!RESEND_API_KEY) {
  console.error('ERROR: RESEND_API_KEY not set. Check .env');
  process.exit(1);
}

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
<p style="color: #666; font-size: 12px;">🇸🇪 SWEDISH TEMPLATE — For NCC (8), Skanska (7), Sweco (7) = ~22 contacts</p>
<hr style="border: 1px solid #eee;">
<p>Hej [Förnamn],</p>
<p>Ert arbete på [Företag] fångade min uppmärksamhet — särskilt [specifik referens: LinkedIn-inlägg, företagsinitiativ eller nyhet].</p>
<p>En snabb fråga: hur automatiserar ert team EPBD/EN 15978-efterlevnad idag? Vi ser att de flesta bygg-företag fortfarande kör detta via konsulter och kalkylark till sexsiffriga årskostnader.</p>
<p>Jag bygger <strong>DWS IQ 6</strong> — en klimatintelligensplattform som automatiserar Fit for 55-efterlevnad över 16 EU-reglerade branscher. Vi har EUR 7k+ MRR, 100% retention och aktiva piloter inom bygg.</p>
<p>Vi öppnar 8 Platinum Captain-platser (EUR 50k SAFE) för operatörer som vill äga en branschvertikal på plattformen. En plats per bransch. <strong>Bygg är tillgängligt.</strong></p>
<p>Passar en 30-minuters demo? Livedata, inga slides.</p>
<p>— Risto</p>
<hr style="border: 1px solid #eee;">
<p style="color: #999; font-size: 11px;">Targets: Tomas Carlsson (NCC CEO), Helena Hed (NCC ESG), Anders Danielsson (Skanska CEO), Lena Hök (Skanska ESG), Åsa Bergman (Sweco CEO)</p>
</div>`,
  },
  {
    lang: 'DE',
    subject: 'TEST DE: Captain DM — Deutsche Vorlage (PORR/STRABAG/HOCHTIEF)',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<p style="color: #666; font-size: 12px;">🇩🇪 GERMAN TEMPLATE — For PORR (8), STRABAG (8), HOCHTIEF (8) = ~24 contacts</p>
<hr style="border: 1px solid #eee;">
<p>Hallo [Vorname],</p>
<p>Ihre Arbeit bei [Unternehmen] hat meine Aufmerksamkeit erregt — insbesondere [spezifische Referenz: LinkedIn-Post, Unternehmensinitiative oder Nachricht].</p>
<p>Eine kurze Frage: Wie automatisiert Ihr Team die EPBD/EN 15978-Compliance derzeit? Wir sehen, dass die meisten Bau-Unternehmen dies noch über Berater und Tabellenkalkulationen abwickeln — zu sechsstelligen Jahreskosten.</p>
<p>Ich baue <strong>DWS IQ 6</strong> — eine Klimaintelligenz-Plattform, die Fit-for-55-Compliance über 16 EU-regulierte Branchen automatisiert. Wir haben EUR 7k+ MRR, 100% Retention und aktive Piloten im Baubereich.</p>
<p>Wir vergeben 8 Platinum Captain-Sitze (EUR 50k SAFE) an Operatoren, die eine Branchenvertikale auf der Plattform besitzen möchten. Ein Sitz pro Branche. <strong>Bau ist verfügbar.</strong></p>
<p>Passt eine 30-Minuten-Demo? Live-Daten, keine Slides.</p>
<p>— Risto</p>
<hr style="border: 1px solid #eee;">
<p style="color: #999; font-size: 11px;">Targets: Karl-Heinz Strauss (PORR CEO), Stefan Kratochwill (STRABAG CEO), Jens Hoffmann (STRABAG CDO), Martina Steffen (HOCHTIEF CSO)</p>
</div>`,
  },
  {
    lang: 'FI',
    subject: 'TEST FI: Captain DM — Suomenkielinen malli (Petri Kasari / Sweco)',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<p style="color: #666; font-size: 12px;">🇫🇮 FINNISH TEMPLATE — For Petri Kasari (Sweco) + future Finnish contacts</p>
<hr style="border: 1px solid #eee;">
<p>Hei [Etunimi],</p>
<p>Huomasin työsi [Yritys]:ssä — erityisesti [tarkka viite: LinkedIn-postaus, yritysaloite tai uutinen].</p>
<p>Nopea kysymys: miten tiimisi hoitaa Fit for 55 -raportoinnin tällä hetkellä — CSRD, EPBD, EN 15978 hiilijalanjäljen elinkaariarviointi? Manuaaliset taulukot, konsultit vai jokin muu?</p>
<p>Rakennan <strong>DWS IQ 6</strong>:ta — teollista ilmastoälyalustaa joka kattaa 16 EU-säänneltyä toimialaa. Meillä on jo rakennuspilotit käynnissä ja EUR 7k+ MRR.</p>
<p>Avaamme 8 Platinum Industry Captain -paikkaa (EUR 50k SAFE, EUR 3,8M cap) operaattoreille jotka haluavat omistaa vertikaalin alustalla. <strong>Rakentaminen on auki.</strong></p>
<p>Sopiiko 30 minuutin Situation Room -demo rakentamiselle? Voin näyttää mitä seuraamme EPBD:n ja EN 15978:n osalta konkreettisesti.</p>
<p>— Risto</p>
<hr style="border: 1px solid #eee;">
<p style="color: #999; font-size: 11px;">Primary target: Petri Kasari (Sweco AI/Digital Innovation) — knowledgeable on multi-agent systems, MCP Hub</p>
</div>`,
  },
  {
    lang: 'FR',
    subject: 'TEST FR: Captain DM — Modèle français (Vinci/Bouygues/Eiffage)',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<p style="color: #666; font-size: 12px;">🇫🇷 FRENCH TEMPLATE — For Vinci (8), Bouygues (8), Eiffage (8) = ~24 contacts</p>
<hr style="border: 1px solid #eee;">
<p>Bonjour [Prénom],</p>
<p>J'ai remarqué votre travail chez [Entreprise] — en particulier [référence spécifique : post LinkedIn, initiative d'entreprise ou actualité].</p>
<p>Une question rapide : comment votre équipe gère-t-elle le reporting Fit for 55 aujourd'hui — CSRD, EPBD, cycle de vie carbone EN 15978 ? Tableurs manuels, consultants, ou autre chose ?</p>
<p>Je développe <strong>DWS IQ 6</strong> — une plateforme d'intelligence climatique industrielle couvrant 16 secteurs réglementés de l'UE. Nous avons déjà des pilotes construction en cours et EUR 7k+ de MRR.</p>
<p>Nous ouvrons 8 sièges Platinum Industry Captain (EUR 50k SAFE, cap EUR 3,8M) pour des opérateurs qui souhaitent détenir une verticale sur la plateforme. <strong>Construction est disponible.</strong></p>
<p>Un démo Situation Room de 30 minutes pour la construction, ça vous dit ?</p>
<p>— Risto</p>
<hr style="border: 1px solid #eee;">
<p style="color: #999; font-size: 11px;">Targets: Pierre Anjolras (Vinci CEO), Gilles Godard (Vinci CDO), Pierre-Éric Saint-André (Bouygues CEO), Benoît de Ruffray (Eiffage CEO)</p>
</div>`,
  },
  {
    lang: 'EN',
    subject: 'TEST EN: Captain DM — English template (Balfour Beatty)',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<p style="color: #666; font-size: 12px;">🇬🇧 ENGLISH TEMPLATE — For Balfour Beatty (8) + Skanska UK (Katy Dowding) = ~9 contacts</p>
<hr style="border: 1px solid #eee;">
<p>Hi [First Name],</p>
<p>I noticed your work at [Company] — particularly [specific reference: LinkedIn post, company initiative, or news].</p>
<p>Quick question: how is your team handling Fit for 55 reporting right now — CSRD, EPBD, EN 15978 carbon lifecycle? Manual spreadsheets, consultants, or something else?</p>
<p>I'm building <strong>DWS IQ 6</strong> — an industrial climate intelligence platform covering 16 EU regulated industries. We already have construction pilots running and EUR 7k+ MRR.</p>
<p>We're opening 8 Platinum Industry Captain seats (EUR 50k SAFE, EUR 3.8M cap) for operators who want to own a vertical on the platform. <strong>Construction is available.</strong></p>
<p>Would a 30-minute Situation Room demo for construction make sense? I can show you what we're tracking for EPBD and EN 15978 specifically.</p>
<p>— Risto</p>
<hr style="border: 1px solid #eee;">
<p style="color: #999; font-size: 11px;">Targets: Philip Hoare (Balfour Beatty CEO), Jo Gilroy (BB ESG), Katy Dowding (Skanska UK CEO), Marco Bonelli (Vinci UK Digital)</p>
</div>`,
  },
];

async function sendViaResend(email: TestEmail): Promise<{ ok: boolean; id?: string; error?: string }> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: email.subject,
      html: email.body,
      reply_to: FROM,
    }),
  });

  if (response.ok) {
    const data = await response.json() as { id: string };
    return { ok: true, id: data.id };
  }
  const errBody = await response.text();
  return { ok: false, error: `${response.status}: ${errBody}` };
}

async function main() {
  console.log('=== Native Language Captain DM Test Emails ===\n');
  console.log(`From: ${FROM}`);
  console.log(`To:   ${TO}\n`);

  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    process.stdout.write(`  ${email.lang}... `);
    const result = await sendViaResend(email);
    if (result.ok) {
      console.log(`OK (id: ${result.id})`);
      sent++;
    } else {
      console.log(`FAIL: ${result.error}`);
      failed++;
    }
  }

  console.log(`\n=== Summary: ${sent}/5 sent, ${failed}/5 failed ===`);
}

main().catch(console.error);
