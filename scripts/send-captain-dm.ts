/**
 * Interactive Captain DM sender — asks personalization fields in Finnish/English,
 * fills the template in the target language, shows preview, sends on confirm.
 *
 * No test headers (🇫🇮 FINNISH TEMPLATE etc.) — clean production output.
 * Captain/SAFE pitch excluded from opener (moved to follow-up per Risto's feedback).
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD
 * Branch: claude/improve-sales-call-script-xg1zO
 * Date: 2026-03-21
 * Owner: Claude Code (Opus 4.6)
 *
 * Usage: npx tsx scripts/send-captain-dm.ts
 */

import 'dotenv/config';
import * as readline from 'readline';
import { sendEmail } from '../src/utils/send-email.js';

const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const PREVIEW_TO = 'risto@lifetime.fi';

// ---------------------------------------------------------------------------
// Translations of the DM template per language
// Placeholders: {{name}}, {{company}}, {{reference}}
// ---------------------------------------------------------------------------

interface LangTemplate {
  flag: string;
  label: string;
  greeting: string;
  line1: string; // "Your work at {{company}} caught my attention — particularly {{reference}}."
  line2: string; // compliance question
  line3: string; // DWS IQ 6 intro (no Captain pitch)
  cta: string;   // demo CTA
  signoff: string;
  subject: (name: string, company: string) => string;
}

const templates: Record<string, LangTemplate> = {
  FI: {
    flag: '🇫🇮',
    label: 'Suomi',
    greeting: 'Hei {{name}},',
    line1: 'Huomasin työsi {{company}}:ssä — erityisesti {{reference}}.',
    line2: 'Nopea kysymys: miten tiimisi hoitaa Fit for 55 -raportoinnin tällä hetkellä — CSRD, EPBD, EN 15978 hiilijalanjäljen elinkaariarviointi? Manuaaliset taulukot, konsultit vai jokin muu?',
    line3: 'Rakennan <strong>DWS IQ 6</strong>:ta — teollista ilmastoälyalustaa joka kattaa 20 EU-säänneltyä toimialaa. Olemme tuotannossa EUR 7k+ MRR:lla ja rakennussektorin asiakkailla.',
    cta: 'Sopiiko 30 minuutin demo? Livedataa, ei slidejä.',
    signoff: '— Risto',
    subject: (name, company) => `${name}, nopea kysymys Fit for 55 -raportoinnista (${company})`,
  },
  SV: {
    flag: '🇸🇪',
    label: 'Svenska',
    greeting: 'Hej {{name}},',
    line1: 'Ert arbete på {{company}} fångade min uppmärksamhet — särskilt {{reference}}.',
    line2: 'En snabb fråga: hur automatiserar ert team EPBD/EN 15978-efterlevnad idag? Vi ser att de flesta bygg-företag fortfarande kör detta via konsulter och kalkylark till sexsiffriga årskostnader.',
    line3: 'Jag bygger <strong>DWS IQ 6</strong> — en klimatintelligensplattform som automatiserar Fit for 55-efterlevnad över 20 EU-reglerade branscher. Vi har EUR 7k+ MRR, 100% retention och aktiva kunder inom bygg.',
    cta: 'Passar en 30-minuters demo? Livedata, inga slides.',
    signoff: '— Risto',
    subject: (name, company) => `${name}, snabb fråga om Fit for 55-rapportering (${company})`,
  },
  DE: {
    flag: '🇩🇪',
    label: 'Deutsch',
    greeting: 'Hallo {{name}},',
    line1: 'Ihre Arbeit bei {{company}} hat meine Aufmerksamkeit erregt — insbesondere {{reference}}.',
    line2: 'Eine kurze Frage: Wie automatisiert Ihr Team die EPBD/EN 15978-Compliance derzeit? Wir sehen, dass die meisten Bau-Unternehmen dies noch über Berater und Tabellenkalkulationen abwickeln — zu sechsstelligen Jahreskosten.',
    line3: 'Ich baue <strong>DWS IQ 6</strong> — eine Klimaintelligenz-Plattform, die Fit-for-55-Compliance über 20 EU-regulierte Branchen automatisiert. Wir haben EUR 7k+ MRR, 100% Retention und aktive Kunden im Baubereich.',
    cta: 'Passt eine 30-Minuten-Demo? Live-Daten, keine Slides.',
    signoff: '— Risto',
    subject: (name, company) => `${name}, kurze Frage zur Fit-for-55-Berichterstattung (${company})`,
  },
  FR: {
    flag: '🇫🇷',
    label: 'Français',
    greeting: 'Bonjour {{name}},',
    line1: 'Votre travail chez {{company}} a retenu mon attention — en particulier {{reference}}.',
    line2: 'Une question rapide : comment votre équipe gère-t-elle le reporting Fit for 55 aujourd\'hui — CSRD, EPBD, cycle de vie carbone EN 15978 ? Tableurs manuels, consultants, ou autre chose ?',
    line3: 'Je développe <strong>DWS IQ 6</strong> — une plateforme d\'intelligence climatique industrielle couvrant 20 secteurs réglementés de l\'UE. Nous sommes en production avec EUR 7k+ de MRR et des clients dans le secteur construction.',
    cta: 'Un démo de 30 minutes, ça vous dit ? Données en direct, pas de slides.',
    signoff: '— Risto',
    subject: (name, company) => `${name}, question rapide sur le reporting Fit for 55 (${company})`,
  },
  EN: {
    flag: '🇬🇧',
    label: 'English',
    greeting: 'Hi {{name}},',
    line1: 'I noticed your work at {{company}} — particularly {{reference}}.',
    line2: 'Quick question: how is your team handling Fit for 55 reporting right now — CSRD, EPBD, EN 15978 carbon lifecycle? Manual spreadsheets, consultants, or something else?',
    line3: 'I\'m building <strong>DWS IQ 6</strong> — an industrial climate intelligence platform covering 20 EU regulated industries. We\'re live in production with EUR 7k+ MRR and construction sector customers.',
    cta: 'Would a 30-minute demo make sense? Live data, not slides.',
    signoff: '— Risto',
    subject: (name, company) => `${name}, quick question about Fit for 55 reporting (${company})`,
  },
};

// ---------------------------------------------------------------------------
// Reference translation map — common personalization hooks
// Key: English phrase (lowercase). Value: { sv, de, fi, fr }
// Add new entries as you discover reusable hooks.
// ---------------------------------------------------------------------------

const referenceTranslations: Record<string, Record<string, string>> = {
  'net-zero 2045 target': {
    SV: 'netto-noll 2045-målet',
    DE: 'das Netto-Null-Ziel 2045',
    FI: 'nettanollitavoite 2045',
    FR: 'l\'objectif zéro net 2045',
  },
  'climate 2030 roadmap': {
    SV: 'Climate 2030-färdplanen',
    DE: 'die Climate 2030-Roadmap',
    FI: 'Climate 2030 -tiekartta',
    FR: 'la feuille de route Climate 2030',
  },
  'digital transformation': {
    SV: 'den digitala omställningen',
    DE: 'die digitale Transformation',
    FI: 'digitaalinen transformaatio',
    FR: 'la transformation digitale',
  },
  'sustainability report': {
    SV: 'hållbarhetsrapporten',
    DE: 'den Nachhaltigkeitsbericht',
    FI: 'vastuullisuusraportti',
    FR: 'le rapport de développement durable',
  },
  'scope 3 reporting': {
    SV: 'Scope 3-rapporteringen',
    DE: 'die Scope-3-Berichterstattung',
    FI: 'Scope 3 -raportointi',
    FR: 'le reporting Scope 3',
  },
  'green transformation': {
    SV: 'den gröna omställningen',
    DE: 'die grüne Transformation',
    FI: 'vihreä siirtymä',
    FR: 'la transformation verte',
  },
  'sustainable concrete': {
    SV: 'hållbart betong',
    DE: 'nachhaltiger Beton',
    FI: 'kestävä betoni',
    FR: 'le béton durable',
  },
  'ecovadis gold rating': {
    SV: 'EcoVadis Gold-betyget',
    DE: 'das EcoVadis Gold-Rating',
    FI: 'EcoVadis Gold -luokitus',
    FR: 'la certification EcoVadis Gold',
  },
};

/**
 * Attempt to translate a reference phrase to target language.
 * Tries exact match (lowercase), then substring match.
 * Returns original if no translation found + a warning.
 */
function translateReference(ref: string, lang: string): { text: string; autoTranslated: boolean } {
  if (lang === 'EN') return { text: ref, autoTranslated: false };

  // Check if the ref is already in the target language (user typed it directly)
  // Heuristic: if it contains non-ASCII chars typical of the target lang, assume it's already translated
  const lowerRef = ref.toLowerCase();

  // Exact match
  if (referenceTranslations[lowerRef]?.[lang]) {
    return { text: referenceTranslations[lowerRef][lang], autoTranslated: true };
  }

  // Substring match — find the longest matching key
  let bestMatch = '';
  let bestTranslation = '';
  for (const [key, translations] of Object.entries(referenceTranslations)) {
    if (lowerRef.includes(key) && key.length > bestMatch.length && translations[lang]) {
      bestMatch = key;
      bestTranslation = translations[lang];
    }
  }
  if (bestMatch) {
    // Replace the matched part, keep the rest (company names etc. don't need translation)
    const translated = ref.replace(new RegExp(bestMatch, 'i'), bestTranslation);
    return { text: translated, autoTranslated: true };
  }

  // No translation found — return as-is (company names, proper nouns often work)
  return { text: ref, autoTranslated: false };
}

// ---------------------------------------------------------------------------
// Interactive prompts
// ---------------------------------------------------------------------------

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function askChoice(question: string, options: string[]): Promise<string> {
  return new Promise((resolve) => {
    console.log(`\n${question}`);
    options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));
    rl.question('> ', (answer) => {
      const idx = parseInt(answer, 10) - 1;
      if (idx >= 0 && idx < options.length) {
        resolve(options[idx]);
      } else {
        resolve(answer.trim());
      }
    });
  });
}

function fillTemplate(t: LangTemplate, name: string, company: string, reference: string): string {
  const fill = (s: string) => s
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{company\}\}/g, company)
    .replace(/\{\{reference\}\}/g, reference);

  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<p>${fill(t.greeting)}</p>
<p>${fill(t.line1)}</p>
<p>${fill(t.line2)}</p>
<p>${fill(t.line3)}</p>
<p>${fill(t.cta)}</p>
<p>${t.signoff}</p>
</div>`;
}

function plainTextPreview(t: LangTemplate, name: string, company: string, reference: string): string {
  const fill = (s: string) => s
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{company\}\}/g, company)
    .replace(/\{\{reference\}\}/g, reference)
    .replace(/<\/?strong>/g, '');

  return [
    fill(t.greeting),
    '',
    fill(t.line1),
    '',
    fill(t.line2),
    '',
    fill(t.line3),
    '',
    fill(t.cta),
    '',
    t.signoff,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   Captain DM — Interactive Sender        ║');
  console.log('║   Vastaa kysymyksiin / Answer questions   ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const hasSmtp = !!process.env.SMTP_HOST;
  if (!hasSmtp) {
    console.error('ERROR: No email transport. Set SMTP_HOST (Amazon SES) in .env');
    process.exit(1);
  }

  // 1. Contact details
  const firstName = await ask('Etunimi / First name: ');
  const company = await ask('Yritys / Company: ');

  // 2. Language
  const langOptions = Object.entries(templates).map(([code, t]) => `${t.flag} ${t.label} (${code})`);
  const langChoice = await askChoice('Kohteen kieli / Target language:', langOptions);
  const langCode = langChoice.match(/\((\w+)\)/)?.[1] || 'EN';
  const template = templates[langCode] || templates.EN;

  // 3. Personalization — ask in Finnish + English
  console.log('\n--- Personointi / Personalization ---');
  console.log('Kirjoita englanniksi tai suomeksi, käännetään automaattisesti.');
  console.log('Write in English or Finnish — auto-translated to target language.\n');
  console.log('Esim / Example:');
  console.log('  "NCC\'s Climate 2030 roadmap and net-zero targets"');
  console.log('  "Swecon digitaalinen innovaatiohub"');
  console.log('  "your EcoVadis Gold rating"\n');

  const referenceRaw = await ask('Mikä kiinnitti huomiosi? / What caught your attention?\n> ');

  // 4. Translate reference
  const { text: translatedRef, autoTranslated } = translateReference(referenceRaw, langCode);

  if (autoTranslated && langCode !== 'FI' && langCode !== 'EN') {
    console.log(`\n  Auto-translated reference (${langCode}): "${translatedRef}"`);
  } else if (!autoTranslated && langCode !== 'FI' && langCode !== 'EN') {
    console.log(`\n  ⚠ No auto-translation available. Using as-is: "${translatedRef}"`);
    console.log('  Company names and proper nouns usually work. Check if it reads well.');
  }

  // 5. Preview
  console.log('\n═══════════════════════ PREVIEW ═══════════════════════\n');
  console.log(plainTextPreview(template, firstName, company, translatedRef));
  console.log('\n═══════════════════════════════════════════════════════\n');

  // 6. Bracket check
  const preview = plainTextPreview(template, firstName, company, translatedRef);
  const bracketMatch = preview.match(/\[[^\]]*\]/g);
  if (bracketMatch) {
    console.log('⚠ BRACKET WARNING — unfilled placeholders detected:');
    bracketMatch.forEach((m) => console.log(`  ${m}`));
    console.log('Fix before sending!\n');
  }

  // 7. Send options
  const sendChoice = await askChoice('Lähetä / Send:', [
    `Esikatselu itselleen (${PREVIEW_TO}) / Preview to self`,
    'Kopioi leikepöydälle / Copy text (no send)',
    'Peruuta / Cancel',
  ]);

  if (sendChoice.includes('Peruuta') || sendChoice.includes('Cancel')) {
    console.log('Cancelled.');
    rl.close();
    return;
  }

  if (sendChoice.includes('Kopioi') || sendChoice.includes('Copy')) {
    console.log('\n--- COPY THIS TEXT ---\n');
    console.log(plainTextPreview(template, firstName, company, translatedRef));
    console.log('\n--- END COPY ---\n');
    console.log('Paste into LinkedIn DM. No email sent.');
    rl.close();
    return;
  }

  // Send preview to self
  const html = fillTemplate(template, firstName, company, translatedRef);
  const subject = template.subject(firstName, company);

  console.log(`\nSending preview to ${PREVIEW_TO}...`);
  const result = await sendEmail({
    from: FROM,
    to: PREVIEW_TO,
    subject: `[PREVIEW ${template.flag}] ${subject}`,
    html,
    replyTo: FROM,
  });

  if (result.ok) {
    console.log(`Sent via ${result.transport}. Check ${PREVIEW_TO}.`);
  } else {
    console.log(`FAILED: ${result.error}`);
  }

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
