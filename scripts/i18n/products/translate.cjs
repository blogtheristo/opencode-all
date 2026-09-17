#!/usr/bin/env node
/**
 * Phrase + chrome translator for product-page i18n.
 * Exact chrome.json wins; then longest-first phrase map; else identity (AI notice covers MT).
 */
const fs = require('fs');
const path = require('path');

const chrome = JSON.parse(fs.readFileSync(path.join(__dirname, 'chrome.json'), 'utf8'));

const PHRASES = [
  [
    'designed to reduce CLOUD Act exposure',
    {
      fi: 'suunniteltu vähentämään CLOUD Act -altistusta',
      sv: 'utformad för att minska CLOUD Act-exponering',
      de: 'darauf ausgelegt, CLOUD-Act-Exposition zu verringern',
      fr: 'conçu pour réduire l’exposition au CLOUD Act',
    },
  ],
  [
    'Lifetime Firehorse™Store',
    {
      fi: 'Lifetime Firehorse™-kauppa',
      sv: 'Lifetime Firehorse™-butik',
      de: 'Lifetime Firehorse™Store',
      fr: 'Boutique Lifetime Firehorse™',
    },
  ],
  [
    'EU AI Act Article 12',
    {
      fi: 'EU:n tekoälyasetuksen 12 artikla',
      sv: 'EU:s AI-förordning artikel 12',
      de: 'Artikel 12 der EU-KI-Verordnung',
      fr: 'article 12 du règlement européen sur l’IA',
    },
  ],
  [
    'EU AI Act Article 4',
    {
      fi: 'EU:n tekoälyasetuksen 4 artikla',
      sv: 'EU:s AI-förordning artikel 4',
      de: 'Artikel 4 der EU-KI-Verordnung',
      fr: 'article 4 du règlement européen sur l’IA',
    },
  ],
  [
    'one-time setup',
    {
      fi: 'kertaluonteinen käyttöönotto',
      sv: 'engångsinstallation',
      de: 'einmaliges Setup',
      fr: 'mise en service unique',
    },
  ],
  [
    'internal sign-off required before quoting',
    {
      fi: 'sisäinen hyväksyntä ennen tarjousta',
      sv: 'intern godkännande krävs före offert',
      de: 'interne Freigabe vor dem Angebot erforderlich',
      fr: 'validation interne requise avant devis',
    },
  ],
  [
    'former NVIDIA Connect programme member (programme closed; NVIDIA programme applications via NVIDIA)',
    {
      fi: 'entinen NVIDIA Connect -ohjelman jäsen (ohjelma päättynyt; NVIDIA-ohjelmahaut NVIDIAn kautta)',
      sv: 'tidigare medlem i NVIDIA Connect (programmet stängt; NVIDIA-ansökningar via NVIDIA)',
      de: 'ehemaliges NVIDIA-Connect-Mitglied (Programm beendet; NVIDIA-Anträge über NVIDIA)',
      fr: 'ancien membre NVIDIA Connect (programme clos ; candidatures NVIDIA via NVIDIA)',
    },
  ],
  [
    'NVIDIA Developer',
    {
      fi: 'NVIDIA Developer',
      sv: 'NVIDIA Developer',
      de: 'NVIDIA Developer',
      fr: 'NVIDIA Developer',
    },
  ],
  ['Tier T0', { fi: 'Taso T0', sv: 'Nivå T0', de: 'Stufe T0', fr: 'Niveau T0' }],
  ['Tier T1', { fi: 'Taso T1', sv: 'Nivå T1', de: 'Stufe T1', fr: 'Niveau T1' }],
  ['Tier T2', { fi: 'Taso T2', sv: 'Nivå T2', de: 'Stufe T2', fr: 'Niveau T2' }],
  ['Tier T3', { fi: 'Taso T3', sv: 'Nivå T3', de: 'Stufe T3', fr: 'Niveau T3' }],
  ['Tier meter', { fi: 'Mittaritaso', sv: 'Mätarnivå', de: 'Meter-Stufe', fr: 'Niveau meter' }],
  [
    '1. Construction',
    { fi: '1. Rakentaminen', sv: '1. Bygg', de: '1. Bau', fr: '1. Construction' },
  ],
  ['2. Cement', { fi: '2. Sementti', sv: '2. Cement', de: '2. Zement', fr: '2. Ciment' }],
  ['3. Steel', { fi: '3. Teräs', sv: '3. Stål', de: '3. Stahl', fr: '3. Acier' }],
  [
    '4. Aluminium',
    { fi: '4. Alumiini', sv: '4. Aluminium', de: '4. Aluminium', fr: '4. Aluminium' },
  ],
  ['5. Chemicals', { fi: '5. Kemikaalit', sv: '5. Kemi', de: '5. Chemie', fr: '5. Chimie' }],
];

function keepAsIs(s) {
  const t = s.replace(/\s+/g, ' ').trim();
  if (/^€[\d,.\s/—–-]+/.test(t)) return true;
  if (/^Y\d/.test(t)) return true;
  if (/per-month|per-year|per-site|per-hour|per-outcome/i.test(t) && t.length < 80) return false;
  if (/^[A-Z0-9][A-Z0-9:_-]{4,}$/.test(t)) return true;
  return false;
}

function translateString(s, lang) {
  if (lang === 'en') return s;
  const table = chrome[lang] || {};
  if (Object.prototype.hasOwnProperty.call(table, s)) return table[s];
  if (keepAsIs(s)) return s;
  let out = s;
  for (const [en, map] of PHRASES) {
    if (!map[lang]) continue;
    if (out.includes(en)) out = out.split(en).join(map[lang]);
  }
  return out;
}

function translateList(list, lang) {
  return list.map((s) => translateString(s, lang));
}

const AI_NOTICE = {
  fi: {
    aiNoticeLabel: 'Tekoälyn tuottama sisältö',
    aiNoticeBody:
      'Tämä sivu on konekäännös englanninkielisestä alkuperäistekstistä eikä sitä ole tarkistanut ihmiskääntäjä. Englanninkielinen versio on sitova.',
    aiNoticeLink: 'Lue englanninkielinen alkuperäinen',
  },
  sv: {
    aiNoticeLabel: 'AI-genererat innehåll',
    aiNoticeBody:
      'Den här sidan är en maskinöversättning av det engelska originalet och har inte granskats av en mänsklig översättare. Den engelska versionen är den gällande texten.',
    aiNoticeLink: 'Läs det engelska originalet',
  },
  de: {
    aiNoticeLabel: 'Von künstlicher Intelligenz (KI) generierter Inhalt',
    aiNoticeBody:
      'Diese Seite ist eine maschinelle Übersetzung des englischen Originals und wurde nicht von einem menschlichen Übersetzer geprüft. Die englische Fassung ist der verbindliche Text.',
    aiNoticeLink: 'Das englische Original lesen',
  },
  fr: {
    aiNoticeLabel: 'Contenu généré par intelligence artificielle (IA)',
    aiNoticeBody:
      'Cette page est une traduction automatique de l’original anglais et n’a pas été révisée par un traducteur humain. La version anglaise fait foi.',
    aiNoticeLink: 'Lire l’original anglais',
  },
};

module.exports = { translateString, translateList, AI_NOTICE };
