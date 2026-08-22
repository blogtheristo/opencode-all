#!/usr/bin/env node
/**
 * Generate the Finnish / Swedish / German / French price-list pages from the
 * English source at dws10.com/price-list/index.html.
 *
 * Prices are NOT translated or copied — every localized page fetches
 * /config/products.json exactly as the English page does, so
 * `dws10.com/config/products.json` remains the single source of truth
 * (CLAUDE.md § Store/Product Pricing). Only the static chrome is localized.
 *
 * Re-run after any edit to the English page:
 *   node scripts/generate-price-list-i18n.mjs
 *
 * Writes dws10.com/price-list/<lang>/index.html and mirrors to
 * landing-pages/dws10-com/price-list/<lang>/index.html.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SRC = 'dws10.com/price-list/index.html';
const OUT_ROOTS = ['dws10.com/price-list', 'landing-pages/dws10-com/price-list'];
const LANGS = ['fi', 'sv', 'de', 'fr'];

/** key = English text node, verbatim after whitespace collapse. */
const T = {
  fi: {
    'DWS IQ Platform · EU Sovereign AI': 'DWS IQ -alusta · EU-suvereeni tekoäly',
    Store: 'Kauppa',
    'DWS IQ 6 · from €4,999 · live in 30 days': 'DWS IQ 6 · alkaen 4 999 € · käytössä 30 päivässä',
    'US-Cloud posture (from €299/mo)': 'US-pilviasento (alkaen 299 €/kk)',
    Home: 'Etusivu',
    Print: 'Tulosta',
    'Sovereign intelligence and compliance.': 'Suvereeni äly ja vaatimustenmukaisuus.',
    'Our products help your company succeed by making EU compliance, sovereign AI, and on-premise hardware boring — predictable line items instead of executive risk. Official DWS Skilled Agents price list. Single source of truth, reviewed quarterly.':
      'Tuotteemme auttavat yritystäsi onnistumaan tekemällä EU-vaatimustenmukaisuudesta, suvereenista tekoälystä ja omissa tiloissa toimivasta laitteistosta tylsää — ennakoitavia rivejä laskulla johtoriskin sijaan. Virallinen DWS Skilled Agents -hinnasto. Yksi totuuden lähde, tarkistetaan neljännesvuosittain.',
    Version: 'Versio',
    Effective: 'Voimassa',
    'Next review': 'Seuraava tarkistus',
    Currency: 'Valuutta',
    VAT: 'ALV',
    'B2B · 0%': 'B2B · 0 %',
    'Payment terms': 'Maksuehto',
    'Net 14': '14 pv netto',
    'B2B Pricing · VAT 0% (reverse charge).': 'B2B-hinnoittelu · ALV 0 % (käännetty verovelvollisuus).',
    'All prices in EUR, excluding VAT. Finnish VAT (25.5%) is added at checkout for FI-billed customers. EU intra-community supplies are reverse-charged against a valid EU VAT number. Quote valid':
      'Kaikki hinnat euroina, ilman arvonlisäveroa. Suomen ALV (25,5 %) lisätään kassalla Suomeen laskutettaville asiakkaille. EU:n yhteisömyynnissä sovelletaan käännettyä verovelvollisuutta voimassa olevaa EU-ALV-tunnusta vastaan. Tarjous voimassa',
    '30 days': '30 päivää',
    'Choose your deployment — one platform, three ways':
      'Valitse käyttöönottotapa — yksi alusta, kolme tapaa',
    'DWS IQ 6 is a single agent platform delivered in three ways. You pick by':
      'DWS IQ 6 on yksi agenttialusta, joka toimitetaan kolmella tavalla. Valinta tehdään',
    'sovereignty posture': 'suvereniteettiasennon',
    ', not by feature set — the same 50-production-agent brain runs in every model; only the jurisdiction, infrastructure, and ownership change. Two of the three are':
      'perusteella, ei ominaisuuksien — sama 50 tuotantoagentin aivo pyörii jokaisessa mallissa; vain lainkäyttöalue, infrastruktuuri ja omistus vaihtuvat. Kaksi kolmesta on',
    'cloud versions we host for you': 'pilviversioita, jotka isännöimme puolestasi',
    '; the third is a': '; kolmas on',
    'sovereign NVIDIA DGX solution you own and run on your own premises':
      'suvereeni NVIDIA DGX -ratkaisu, jonka omistat ja jota ajat omissa tiloissasi',
    'Cloud · Multi-tenant SaaS': 'Pilvi · Monen asiakkaan SaaS',
    'EU-Sovereign Cloud': 'EU-suvereeni pilvi',
    'Scaleway serverless (Paris / Amsterdam), French-owned (Iliad Group)':
      'Scaleway serverless (Pariisi / Amsterdam), ranskalaisomisteinen (Iliad Group)',
    'Zero US CLOUD Act exposure · EU-only Managed PostgreSQL + pgvector':
      'Ei lainkaan US CLOUD Act -altistusta · vain EU:ssa hallinnoitu PostgreSQL + pgvector',
    'Scale-to-zero, pay-per-request; nothing to operate':
      'Skaalautuu nollaan, maksat pyynnöistä; ei ylläpidettävää',
    'EU AI Act Article 12 logging built in': 'EU:n tekoälyasetuksen 12 artiklan lokitus sisäänrakennettuna',
    'Best for:': 'Parhaiten sopii:',
    'EU/UK-regulated mid-market and enterprise — construction, logistics, energy, manufacturing. A cost-sensitive':
      'EU:n ja UK:n sääntelemä keskisuuri ja suuryritys — rakentaminen, logistiikka, energia, valmistava teollisuus. Saatavilla on myös kustannusherkkä',
    'is also available for non-EU-regulated workloads.':
      'EU-sääntelyn ulkopuolisille työkuormille.',
    'Cloud · Single-tenant': 'Pilvi · Yhden asiakkaan',
    'Dedicated Sovereign Cloud — Aegis': 'Oma suvereeni pilvi — Aegis',
    'UpCloud (Helsinki) / Hetzner — Finnish jurisdiction, zero CLOUD Act':
      'UpCloud (Helsinki) / Hetzner — Suomen lainkäyttöalue, ei CLOUD Act -altistusta',
    'Aiven managed PostgreSQL (no US-incorporated vendor in the data path)':
      'Aivenin hallinnoima PostgreSQL (ei yhdysvaltalaista toimittajaa datapolulla)',
    'Themis control plane · Article 12 pipeline · EUDI Wallet auth':
      'Themis-ohjaustaso · 12 artiklan lokiputki · EUDI-lompakkotunnistus',
    'Dedicated instance, not shared tenancy': 'Oma instanssi, ei jaettua ympäristöä',
    'defence, government, critical infrastructure — sovereignty mandated but a physical air-gap is not.':
      'puolustus, julkishallinto, kriittinen infrastruktuuri — suvereniteetti on vaatimus, fyysinen ilmarako ei.',
    'Aegis details →': 'Aegis-tiedot →',
    'On-premise · Air-gapped': 'Omissa tiloissa · Ilmaraollinen',
    'Sovereign On-Premise — NVIDIA DGX': 'Suvereeni on-premise — NVIDIA DGX',
    'Your hardware · you own the weights': 'Sinun laitteistosi · omistat painot',
    'Data never leaves your network · you own 100% of model weights':
      'Data ei poistu verkostasi · omistat mallin painot 100-prosenttisesti',
    'steel, construction, nuclear, dual-use, classified — where a physical air-gap or weight ownership is a hard requirement.':
      'teräs, rakentaminen, ydinvoima, kaksikäyttö, turvaluokiteltu — kun fyysinen ilmarako tai painojen omistus on ehdoton vaatimus.',
    'DGX Spark →': 'DGX Spark →',
    'Cloud vs sovereign NVIDIA DGX — the honest comparison':
      'Pilvi vai suvereeni NVIDIA DGX — rehellinen vertailu',
    'Both paths are sovereign and both close the CLOUD Act. The real decision is capex vs opex, elasticity vs ownership, and whether a physical air-gap is mandated.':
      'Molemmat polut ovat suvereeneja ja molemmat sulkevat CLOUD Actin. Todellinen valinta on investointi vai käyttökulu, joustavuus vai omistus — ja vaaditaanko fyysinen ilmarako.',
    Dimension: 'Ulottuvuus',
    'EU-Sovereign Cloud (SaaS / Aegis)': 'EU-suvereeni pilvi (SaaS / Aegis)',
    'Sovereign On-Premise (NVIDIA DGX)': 'Suvereeni on-premise (NVIDIA DGX)',
    'Capital outlay': 'Investointi',
    'None — you rent capacity': 'Ei lainkaan — vuokraat kapasiteetin',
    'Running cost': 'Käyttökustannus',
    'Data residency': 'Datan sijainti',
    'EU cloud (Paris / Amsterdam / Helsinki)': 'EU-pilvi (Pariisi / Amsterdam / Helsinki)',
    'Never leaves your premises': 'Ei poistu tiloistasi',
    'Model ownership': 'Mallin omistus',
    'Platform-hosted (dedicated instance on Aegis)': 'Alustan isännöimä (oma instanssi Aegisissä)',
    'You own 100% of the model weights': 'Omistat mallin painot 100-prosenttisesti',
    'Network dependency': 'Verkkoriippuvuus',
    'Requires EU-cloud connectivity': 'Vaatii yhteyden EU-pilveen',
    'Fully air-gap capable — runs offline': 'Täysin ilmarakokykyinen — toimii verkotta',
    'Time to value': 'Aika hyötyyn',
    '30 days (SaaS); provisioned for you': '30 päivää (SaaS); provisioidaan puolestasi',
    'Hardware lead time + on-site install': 'Laitteiston toimitusaika + asennus paikan päällä',
    Scaling: 'Skaalaus',
    'Elastic — scale-to-zero, burst on demand': 'Joustava — skaalautuu nollaan, purskeet tarvittaessa',
    'Fixed to installed nodes; add boxes to grow':
      'Sidottu asennettuihin solmuihin; kasvu lisäämällä laatikoita',
    'CLOUD Act exposure': 'CLOUD Act -altistus',
    'Zero — EU-incorporated providers': 'Ei lainkaan — EU:hun rekisteröidyt toimittajat',
    'Zero — no cloud in the path at all': 'Ei lainkaan — ei pilveä polulla ollenkaan',
    'Best economic fit': 'Taloudellisesti paras',
    'Bursty / variable load, fast start, low ops':
      'Purskeinen / vaihteleva kuorma, nopea aloitus, vähän ylläpitoa',
    'Steady 24/7 high utilisation; air-gap required':
      'Tasainen 24/7 korkea käyttöaste; ilmarako vaaditaan',
    'Rule of thumb.': 'Nyrkkisääntö.',
    'Start on': 'Aloita',
    '— it is the fastest, lowest-risk path and closes the CLOUD Act on day one. Move to':
      '-mallista — se on nopein ja vähäriskisin polku ja sulkee CLOUD Actin heti ensimmäisenä päivänä. Siirry',
    Aegis: 'Aegisiin',
    'when you need single-tenant isolation and a full Article 12 control plane. Choose the':
      'kun tarvitset yhden asiakkaan eristyksen ja täyden 12 artiklan ohjaustason. Valitse',
    'sovereign NVIDIA DGX': 'suvereeni NVIDIA DGX',
    'solution when a physical air-gap or 100% model-weight ownership is non-negotiable, or when a steady, high-utilisation workload makes owned hardware cheaper than metered cloud over a 2–3 year horizon. Many customers run both: DGX at the regulated edge, cloud for elastic burst.':
      '-ratkaisu, kun fyysinen ilmarako tai mallin painojen täysi omistus ei ole neuvoteltavissa, tai kun tasainen, korkean käyttöasteen kuorma tekee omasta laitteistosta mitattua pilveä halvemman 2–3 vuoden aikajänteellä. Moni asiakas ajaa molempia: DGX säännellyllä reunalla, pilvi joustavaan purskeeseen.',
    'Compare cloud tiers →': 'Vertaa pilvitasoja →',
    'Loading price list…': 'Ladataan hinnastoa…',
    'Legal entity': 'Oikeushenkilö',
    'Laidunmaanraitti 2 A 25, 02330 Espoo, Finland': 'Laidunmaanraitti 2 A 25, 02330 Espoo, Suomi',
    'Business ID:': 'Y-tunnus:',
    'VAT ID:': 'ALV-tunnus:',
    'Price list governance': 'Hinnaston hallinta',
    'Owner:': 'Omistaja:',
    'Cadence: Reviewed every calendar quarter': 'Rytmi: tarkistetaan joka kalenterineljännes',
    'DWS Document Standard version:': 'DWS-dokumenttistandardin versio:',
    '· Effective': '· Voimassa',
    'Market:': 'Markkina:',
    'Finnish / EU B2B · VAT 0 % (reverse charge)':
      'Suomi / EU B2B · ALV 0 % (käännetty verovelvollisuus)',
    '. Hardware costs reflect verified EU distributor and EMEA launch prices — not converted from US list. NVIDIA / Acer EU sources documented in':
      '. Laitteistokustannukset perustuvat vahvistettuihin EU-jakelijoiden ja EMEA-julkaisun hintoihin — ei muunnettu Yhdysvaltain listahinnoista. NVIDIAn / Acerin EU-lähteet on dokumentoitu kentässä',
    'Source of truth:': 'Totuuden lähde:',
    Contact: 'Yhteystiedot',
    'Sales:': 'Myynti:',
    'Phone requests via email.': 'Puhelinpyynnöt sähköpostitse.',
    'For a signed quote on this price list, email sales with the product IDs in the leftmost column.':
      'Allekirjoitettua tarjousta varten lähetä myyntiin sähköpostia ja mainitse vasemmanpuoleisen sarakkeen tuotetunnukset.',
  },
  sv: {
    'DWS IQ Platform · EU Sovereign AI': 'DWS IQ-plattformen · EU-suverän AI',
    Store: 'Butik',
    'DWS IQ 6 · from €4,999 · live in 30 days': 'DWS IQ 6 · från 4 999 € · i drift på 30 dagar',
    'US-Cloud posture (from €299/mo)': 'US-molnläge (från 299 €/mån)',
    Home: 'Hem',
    Print: 'Skriv ut',
    'Sovereign intelligence and compliance.': 'Suverän intelligens och regelefterlevnad.',
    'Our products help your company succeed by making EU compliance, sovereign AI, and on-premise hardware boring — predictable line items instead of executive risk. Official DWS Skilled Agents price list. Single source of truth, reviewed quarterly.':
      'Våra produkter hjälper ditt företag att lyckas genom att göra EU-regelefterlevnad, suverän AI och lokal hårdvara tråkig — förutsägbara poster på fakturan i stället för ledningsrisk. Officiell prislista för DWS Skilled Agents. En enda sanningskälla, granskad varje kvartal.',
    Version: 'Version',
    Effective: 'Gäller från',
    'Next review': 'Nästa granskning',
    Currency: 'Valuta',
    VAT: 'Moms',
    'B2B · 0%': 'B2B · 0 %',
    'Payment terms': 'Betalningsvillkor',
    'Net 14': '14 dagar netto',
    'B2B Pricing · VAT 0% (reverse charge).': 'B2B-prissättning · moms 0 % (omvänd skattskyldighet).',
    'All prices in EUR, excluding VAT. Finnish VAT (25.5%) is added at checkout for FI-billed customers. EU intra-community supplies are reverse-charged against a valid EU VAT number. Quote valid':
      'Alla priser i EUR, exklusive moms. Finsk moms (25,5 %) läggs till i kassan för kunder som faktureras i Finland. EU-interna leveranser omfattas av omvänd skattskyldighet mot ett giltigt EU-momsnummer. Offerten gäller',
    '30 days': '30 dagar',
    'Choose your deployment — one platform, three ways':
      'Välj din driftsform — en plattform, tre vägar',
    'DWS IQ 6 is a single agent platform delivered in three ways. You pick by':
      'DWS IQ 6 är en enda agentplattform som levereras på tre sätt. Du väljer utifrån',
    'sovereignty posture': 'suveränitetsläge',
    ', not by feature set — the same 50-production-agent brain runs in every model; only the jurisdiction, infrastructure, and ownership change. Two of the three are':
      ', inte utifrån funktioner — samma hjärna med 50 produktionsagenter körs i varje modell; bara jurisdiktion, infrastruktur och ägande ändras. Två av de tre är',
    'cloud versions we host for you': 'molnversioner som vi driftar åt dig',
    '; the third is a': '; den tredje är en',
    'sovereign NVIDIA DGX solution you own and run on your own premises':
      'suverän NVIDIA DGX-lösning som du äger och kör i egna lokaler',
    'Cloud · Multi-tenant SaaS': 'Moln · SaaS med flera kunder',
    'EU-Sovereign Cloud': 'EU-suveränt moln',
    'Scaleway serverless (Paris / Amsterdam), French-owned (Iliad Group)':
      'Scaleway serverless (Paris / Amsterdam), franskägt (Iliad Group)',
    'Zero US CLOUD Act exposure · EU-only Managed PostgreSQL + pgvector':
      'Noll exponering mot US CLOUD Act · hanterad PostgreSQL + pgvector enbart i EU',
    'Scale-to-zero, pay-per-request; nothing to operate':
      'Skalar till noll, betala per anrop; inget att drifta',
    'EU AI Act Article 12 logging built in': 'Loggning enligt EU:s AI-förordning artikel 12 inbyggd',
    'Best for:': 'Passar bäst för:',
    'EU/UK-regulated mid-market and enterprise — construction, logistics, energy, manufacturing. A cost-sensitive':
      'EU-/UK-reglerade medelstora och stora företag — bygg, logistik, energi, tillverkning. Ett kostnadskänsligt',
    'is also available for non-EU-regulated workloads.':
      'finns också för arbetslaster utanför EU-regleringen.',
    'Cloud · Single-tenant': 'Moln · En kund',
    'Dedicated Sovereign Cloud — Aegis': 'Dedikerat suveränt moln — Aegis',
    'UpCloud (Helsinki) / Hetzner — Finnish jurisdiction, zero CLOUD Act':
      'UpCloud (Helsingfors) / Hetzner — finsk jurisdiktion, noll CLOUD Act',
    'Aiven managed PostgreSQL (no US-incorporated vendor in the data path)':
      'Aiven-hanterad PostgreSQL (ingen USA-registrerad leverantör i datavägen)',
    'Themis control plane · Article 12 pipeline · EUDI Wallet auth':
      'Themis styrplan · artikel 12-pipeline · EUDI-plånboksinloggning',
    'Dedicated instance, not shared tenancy': 'Dedikerad instans, inte delad miljö',
    'defence, government, critical infrastructure — sovereignty mandated but a physical air-gap is not.':
      'försvar, offentlig sektor, kritisk infrastruktur — suveränitet krävs men inte fysisk luftgap.',
    'Aegis details →': 'Aegis-detaljer →',
    'On-premise · Air-gapped': 'Lokalt · Luftgap',
    'Sovereign On-Premise — NVIDIA DGX': 'Suverän lokal drift — NVIDIA DGX',
    'Your hardware · you own the weights': 'Din hårdvara · du äger vikterna',
    'Data never leaves your network · you own 100% of model weights':
      'Data lämnar aldrig ditt nätverk · du äger 100 % av modellvikterna',
    'steel, construction, nuclear, dual-use, classified — where a physical air-gap or weight ownership is a hard requirement.':
      'stål, bygg, kärnkraft, dual-use, säkerhetsklassat — där fysiskt luftgap eller ägande av vikterna är ett hårt krav.',
    'DGX Spark →': 'DGX Spark →',
    'Cloud vs sovereign NVIDIA DGX — the honest comparison':
      'Moln eller suverän NVIDIA DGX — den ärliga jämförelsen',
    'Both paths are sovereign and both close the CLOUD Act. The real decision is capex vs opex, elasticity vs ownership, and whether a physical air-gap is mandated.':
      'Båda vägarna är suveräna och båda stänger CLOUD Act. Det verkliga valet står mellan investering och driftkostnad, elasticitet och ägande — och om fysiskt luftgap krävs.',
    Dimension: 'Dimension',
    'EU-Sovereign Cloud (SaaS / Aegis)': 'EU-suveränt moln (SaaS / Aegis)',
    'Sovereign On-Premise (NVIDIA DGX)': 'Suverän lokal drift (NVIDIA DGX)',
    'Capital outlay': 'Investering',
    'None — you rent capacity': 'Ingen — du hyr kapacitet',
    'Running cost': 'Driftkostnad',
    'Data residency': 'Datalagringsplats',
    'EU cloud (Paris / Amsterdam / Helsinki)': 'EU-moln (Paris / Amsterdam / Helsingfors)',
    'Never leaves your premises': 'Lämnar aldrig dina lokaler',
    'Model ownership': 'Ägande av modellen',
    'Platform-hosted (dedicated instance on Aegis)': 'Plattformsdriftad (dedikerad instans på Aegis)',
    'You own 100% of the model weights': 'Du äger 100 % av modellvikterna',
    'Network dependency': 'Nätverksberoende',
    'Requires EU-cloud connectivity': 'Kräver anslutning till EU-molnet',
    'Fully air-gap capable — runs offline': 'Fullt luftgapsdugligt — kör offline',
    'Time to value': 'Tid till nytta',
    '30 days (SaaS); provisioned for you': '30 dagar (SaaS); provisioneras åt dig',
    'Hardware lead time + on-site install': 'Ledtid för hårdvara + installation på plats',
    Scaling: 'Skalning',
    'Elastic — scale-to-zero, burst on demand': 'Elastisk — skalar till noll, burst vid behov',
    'Fixed to installed nodes; add boxes to grow':
      'Bunden till installerade noder; väx genom att lägga till lådor',
    'CLOUD Act exposure': 'CLOUD Act-exponering',
    'Zero — EU-incorporated providers': 'Noll — EU-registrerade leverantörer',
    'Zero — no cloud in the path at all': 'Noll — inget moln alls i vägen',
    'Best economic fit': 'Bäst ekonomisk passform',
    'Bursty / variable load, fast start, low ops':
      'Ojämn / varierande last, snabb start, lite drift',
    'Steady 24/7 high utilisation; air-gap required':
      'Jämn 24/7 hög nyttjandegrad; luftgap krävs',
    'Rule of thumb.': 'Tumregel.',
    'Start on': 'Börja med',
    '— it is the fastest, lowest-risk path and closes the CLOUD Act on day one. Move to':
      '— det är den snabbaste vägen med lägst risk och stänger CLOUD Act redan dag ett. Gå över till',
    Aegis: 'Aegis',
    'when you need single-tenant isolation and a full Article 12 control plane. Choose the':
      'när du behöver isolering för en enda kund och en fullständig styrplan enligt artikel 12. Välj',
    'sovereign NVIDIA DGX': 'suverän NVIDIA DGX',
    'solution when a physical air-gap or 100% model-weight ownership is non-negotiable, or when a steady, high-utilisation workload makes owned hardware cheaper than metered cloud over a 2–3 year horizon. Many customers run both: DGX at the regulated edge, cloud for elastic burst.':
      '-lösningen när fysiskt luftgap eller fullt ägande av modellvikterna inte är förhandlingsbart, eller när en jämn arbetslast med hög nyttjandegrad gör egen hårdvara billigare än mätt moln över 2–3 år. Många kunder kör båda: DGX i den reglerade kanten, moln för elastisk burst.',
    'Compare cloud tiers →': 'Jämför molnnivåer →',
    'Loading price list…': 'Laddar prislistan…',
    'Legal entity': 'Juridisk person',
    'Laidunmaanraitti 2 A 25, 02330 Espoo, Finland': 'Laidunmaanraitti 2 A 25, 02330 Esbo, Finland',
    'Business ID:': 'Organisationsnummer:',
    'VAT ID:': 'Momsnummer:',
    'Price list governance': 'Styrning av prislistan',
    'Owner:': 'Ägare:',
    'Cadence: Reviewed every calendar quarter': 'Kadens: granskas varje kalenderkvartal',
    'DWS Document Standard version:': 'DWS-dokumentstandardens version:',
    '· Effective': '· Gäller från',
    'Market:': 'Marknad:',
    'Finnish / EU B2B · VAT 0 % (reverse charge)':
      'Finland / EU B2B · moms 0 % (omvänd skattskyldighet)',
    '. Hardware costs reflect verified EU distributor and EMEA launch prices — not converted from US list. NVIDIA / Acer EU sources documented in':
      '. Hårdvarukostnaderna bygger på verifierade EU-distributörs- och EMEA-lanseringspriser — inte omräknade från USA:s listpris. NVIDIA:s / Acers EU-källor dokumenteras i',
    'Source of truth:': 'Sanningskälla:',
    Contact: 'Kontakt',
    'Sales:': 'Försäljning:',
    'Phone requests via email.': 'Telefonförfrågningar via e-post.',
    'For a signed quote on this price list, email sales with the product IDs in the leftmost column.':
      'För en signerad offert på denna prislista, mejla försäljningen med produkt-ID:na i kolumnen längst till vänster.',
  },
  de: {
    'DWS IQ Platform · EU Sovereign AI': 'DWS IQ-Plattform · EU-souveräne KI',
    Store: 'Shop',
    'DWS IQ 6 · from €4,999 · live in 30 days': 'DWS IQ 6 · ab 4.999 € · in 30 Tagen live',
    'US-Cloud posture (from €299/mo)': 'US-Cloud-Profil (ab 299 €/Monat)',
    Home: 'Startseite',
    Print: 'Drucken',
    'Sovereign intelligence and compliance.': 'Souveräne Intelligenz und Compliance.',
    'Our products help your company succeed by making EU compliance, sovereign AI, and on-premise hardware boring — predictable line items instead of executive risk. Official DWS Skilled Agents price list. Single source of truth, reviewed quarterly.':
      'Unsere Produkte machen EU-Compliance, souveräne KI und On-Premise-Hardware langweilig — planbare Positionen statt Vorstandsrisiko. Offizielle Preisliste für DWS Skilled Agents. Eine einzige Quelle der Wahrheit, quartalsweise geprüft.',
    Version: 'Version',
    Effective: 'Gültig ab',
    'Next review': 'Nächste Prüfung',
    Currency: 'Währung',
    VAT: 'USt.',
    'B2B · 0%': 'B2B · 0 %',
    'Payment terms': 'Zahlungsziel',
    'Net 14': '14 Tage netto',
    'B2B Pricing · VAT 0% (reverse charge).': 'B2B-Preise · USt. 0 % (Reverse Charge).',
    'All prices in EUR, excluding VAT. Finnish VAT (25.5%) is added at checkout for FI-billed customers. EU intra-community supplies are reverse-charged against a valid EU VAT number. Quote valid':
      'Alle Preise in EUR, zzgl. USt. Für in Finnland fakturierte Kunden wird die finnische USt. (25,5 %) beim Checkout ergänzt. Innergemeinschaftliche Lieferungen werden gegen eine gültige EU-USt-IdNr. im Reverse-Charge-Verfahren abgerechnet. Angebot gültig',
    '30 days': '30 Tage',
    'Choose your deployment — one platform, three ways':
      'Wählen Sie Ihr Deployment — eine Plattform, drei Wege',
    'DWS IQ 6 is a single agent platform delivered in three ways. You pick by':
      'DWS IQ 6 ist eine einzige Agentenplattform, die auf drei Arten geliefert wird. Sie wählen nach',
    'sovereignty posture': 'Souveränitätsprofil',
    ', not by feature set — the same 50-production-agent brain runs in every model; only the jurisdiction, infrastructure, and ownership change. Two of the three are':
      ', nicht nach Funktionsumfang — dasselbe Gehirn aus 50 Produktionsagenten läuft in jedem Modell; nur Rechtsraum, Infrastruktur und Eigentum ändern sich. Zwei der drei sind',
    'cloud versions we host for you': 'Cloud-Versionen, die wir für Sie betreiben',
    '; the third is a': '; die dritte ist eine',
    'sovereign NVIDIA DGX solution you own and run on your own premises':
      'souveräne NVIDIA-DGX-Lösung, die Sie besitzen und in eigenen Räumen betreiben',
    'Cloud · Multi-tenant SaaS': 'Cloud · Mandantenfähiges SaaS',
    'EU-Sovereign Cloud': 'EU-souveräne Cloud',
    'Scaleway serverless (Paris / Amsterdam), French-owned (Iliad Group)':
      'Scaleway serverless (Paris / Amsterdam), in französischem Besitz (Iliad Group)',
    'Zero US CLOUD Act exposure · EU-only Managed PostgreSQL + pgvector':
      'Keine Exposition gegenüber dem US CLOUD Act · Managed PostgreSQL + pgvector ausschließlich in der EU',
    'Scale-to-zero, pay-per-request; nothing to operate':
      'Scale-to-Zero, Abrechnung pro Anfrage; kein Betriebsaufwand',
    'EU AI Act Article 12 logging built in': 'Protokollierung nach Artikel 12 EU-KI-Verordnung integriert',
    'Best for:': 'Am besten geeignet für:',
    'EU/UK-regulated mid-market and enterprise — construction, logistics, energy, manufacturing. A cost-sensitive':
      'EU-/UK-regulierter Mittelstand und Konzerne — Bau, Logistik, Energie, Fertigung. Eine kostensensible',
    'is also available for non-EU-regulated workloads.':
      'steht auch für nicht EU-regulierte Workloads zur Verfügung.',
    'Cloud · Single-tenant': 'Cloud · Ein Mandant',
    'Dedicated Sovereign Cloud — Aegis': 'Dedizierte souveräne Cloud — Aegis',
    'UpCloud (Helsinki) / Hetzner — Finnish jurisdiction, zero CLOUD Act':
      'UpCloud (Helsinki) / Hetzner — finnischer Rechtsraum, kein CLOUD Act',
    'Aiven managed PostgreSQL (no US-incorporated vendor in the data path)':
      'Von Aiven verwaltetes PostgreSQL (kein US-registrierter Anbieter im Datenpfad)',
    'Themis control plane · Article 12 pipeline · EUDI Wallet auth':
      'Themis-Steuerungsebene · Artikel-12-Pipeline · EUDI-Wallet-Authentifizierung',
    'Dedicated instance, not shared tenancy': 'Dedizierte Instanz, keine geteilte Umgebung',
    'defence, government, critical infrastructure — sovereignty mandated but a physical air-gap is not.':
      'Verteidigung, Behörden, kritische Infrastruktur — Souveränität ist vorgeschrieben, ein physisches Air-Gap nicht.',
    'Aegis details →': 'Aegis-Details →',
    'On-premise · Air-gapped': 'On-Premise · Air-Gap',
    'Sovereign On-Premise — NVIDIA DGX': 'Souveränes On-Premise — NVIDIA DGX',
    'Your hardware · you own the weights': 'Ihre Hardware · Ihnen gehören die Gewichte',
    'Data never leaves your network · you own 100% of model weights':
      'Daten verlassen Ihr Netz nie · Ihnen gehören 100 % der Modellgewichte',
    'steel, construction, nuclear, dual-use, classified — where a physical air-gap or weight ownership is a hard requirement.':
      'Stahl, Bau, Kernkraft, Dual-Use, Verschlusssachen — wo ein physisches Air-Gap oder das Eigentum an den Gewichten harte Anforderung ist.',
    'DGX Spark →': 'DGX Spark →',
    'Cloud vs sovereign NVIDIA DGX — the honest comparison':
      'Cloud oder souveräne NVIDIA DGX — der ehrliche Vergleich',
    'Both paths are sovereign and both close the CLOUD Act. The real decision is capex vs opex, elasticity vs ownership, and whether a physical air-gap is mandated.':
      'Beide Wege sind souverän und beide schließen den CLOUD Act. Die eigentliche Entscheidung lautet Investition gegen Betriebskosten, Elastizität gegen Eigentum — und ob ein physisches Air-Gap vorgeschrieben ist.',
    Dimension: 'Dimension',
    'EU-Sovereign Cloud (SaaS / Aegis)': 'EU-souveräne Cloud (SaaS / Aegis)',
    'Sovereign On-Premise (NVIDIA DGX)': 'Souveränes On-Premise (NVIDIA DGX)',
    'Capital outlay': 'Investitionsaufwand',
    'None — you rent capacity': 'Keiner — Sie mieten Kapazität',
    'Running cost': 'Laufende Kosten',
    'Data residency': 'Datenstandort',
    'EU cloud (Paris / Amsterdam / Helsinki)': 'EU-Cloud (Paris / Amsterdam / Helsinki)',
    'Never leaves your premises': 'Verlässt Ihre Räume nie',
    'Model ownership': 'Eigentum am Modell',
    'Platform-hosted (dedicated instance on Aegis)': 'Plattformbetrieben (dedizierte Instanz auf Aegis)',
    'You own 100% of the model weights': 'Ihnen gehören 100 % der Modellgewichte',
    'Network dependency': 'Netzabhängigkeit',
    'Requires EU-cloud connectivity': 'Erfordert Anbindung an die EU-Cloud',
    'Fully air-gap capable — runs offline': 'Vollständig air-gap-fähig — läuft offline',
    'Time to value': 'Zeit bis zum Nutzen',
    '30 days (SaaS); provisioned for you': '30 Tage (SaaS); für Sie bereitgestellt',
    'Hardware lead time + on-site install': 'Hardware-Lieferzeit + Installation vor Ort',
    Scaling: 'Skalierung',
    'Elastic — scale-to-zero, burst on demand': 'Elastisch — Scale-to-Zero, Burst bei Bedarf',
    'Fixed to installed nodes; add boxes to grow':
      'An installierte Knoten gebunden; Wachstum durch zusätzliche Geräte',
    'CLOUD Act exposure': 'CLOUD-Act-Exposition',
    'Zero — EU-incorporated providers': 'Keine — in der EU ansässige Anbieter',
    'Zero — no cloud in the path at all': 'Keine — überhaupt keine Cloud im Pfad',
    'Best economic fit': 'Wirtschaftlich am besten geeignet',
    'Bursty / variable load, fast start, low ops':
      'Stoßweise / variable Last, schneller Start, wenig Betrieb',
    'Steady 24/7 high utilisation; air-gap required':
      'Gleichmäßige 24/7-Auslastung; Air-Gap erforderlich',
    'Rule of thumb.': 'Faustregel.',
    'Start on': 'Beginnen Sie mit',
    '— it is the fastest, lowest-risk path and closes the CLOUD Act on day one. Move to':
      '— das ist der schnellste und risikoärmste Weg und schließt den CLOUD Act am ersten Tag. Wechseln Sie zu',
    Aegis: 'Aegis',
    'when you need single-tenant isolation and a full Article 12 control plane. Choose the':
      ', wenn Sie Einzelmandanten-Isolierung und eine vollständige Artikel-12-Steuerungsebene brauchen. Wählen Sie die',
    'sovereign NVIDIA DGX': 'souveräne NVIDIA DGX',
    'solution when a physical air-gap or 100% model-weight ownership is non-negotiable, or when a steady, high-utilisation workload makes owned hardware cheaper than metered cloud over a 2–3 year horizon. Many customers run both: DGX at the regulated edge, cloud for elastic burst.':
      '-Lösung, wenn ein physisches Air-Gap oder das vollständige Eigentum an den Modellgewichten nicht verhandelbar ist, oder wenn eine gleichmäßige, hoch ausgelastete Last eigene Hardware über 2–3 Jahre günstiger macht als getaktete Cloud. Viele Kunden betreiben beides: DGX an der regulierten Kante, Cloud für elastische Spitzen.',
    'Compare cloud tiers →': 'Cloud-Stufen vergleichen →',
    'Loading price list…': 'Preisliste wird geladen …',
    'Legal entity': 'Rechtsträger',
    'Laidunmaanraitti 2 A 25, 02330 Espoo, Finland': 'Laidunmaanraitti 2 A 25, 02330 Espoo, Finnland',
    'Business ID:': 'Handelsregisternummer:',
    'VAT ID:': 'USt-IdNr.:',
    'Price list governance': 'Governance der Preisliste',
    'Owner:': 'Verantwortlich:',
    'Cadence: Reviewed every calendar quarter': 'Rhythmus: Prüfung in jedem Kalenderquartal',
    'DWS Document Standard version:': 'Version des DWS-Dokumentenstandards:',
    '· Effective': '· Gültig ab',
    'Market:': 'Markt:',
    'Finnish / EU B2B · VAT 0 % (reverse charge)':
      'Finnland / EU B2B · USt. 0 % (Reverse Charge)',
    '. Hardware costs reflect verified EU distributor and EMEA launch prices — not converted from US list. NVIDIA / Acer EU sources documented in':
      '. Die Hardwarekosten beruhen auf geprüften EU-Distributoren- und EMEA-Einführungspreisen — nicht aus US-Listenpreisen umgerechnet. Die EU-Quellen von NVIDIA / Acer sind dokumentiert in',
    'Source of truth:': 'Quelle der Wahrheit:',
    Contact: 'Kontakt',
    'Sales:': 'Vertrieb:',
    'Phone requests via email.': 'Telefonanfragen per E-Mail.',
    'For a signed quote on this price list, email sales with the product IDs in the leftmost column.':
      'Für ein unterzeichnetes Angebot zu dieser Preisliste senden Sie dem Vertrieb eine E-Mail mit den Produkt-IDs aus der linken Spalte.',
  },
  fr: {
    'DWS IQ Platform · EU Sovereign AI': 'Plateforme DWS IQ · IA souveraine européenne',
    Store: 'Boutique',
    'DWS IQ 6 · from €4,999 · live in 30 days': 'DWS IQ 6 · à partir de 4 999 € · en service en 30 jours',
    'US-Cloud posture (from €299/mo)': 'posture US-Cloud (à partir de 299 €/mois)',
    Home: 'Accueil',
    Print: 'Imprimer',
    'Sovereign intelligence and compliance.': 'Intelligence souveraine et conformité.',
    'Our products help your company succeed by making EU compliance, sovereign AI, and on-premise hardware boring — predictable line items instead of executive risk. Official DWS Skilled Agents price list. Single source of truth, reviewed quarterly.':
      'Nos produits aident votre entreprise à réussir en rendant ennuyeux la conformité européenne, l’IA souveraine et le matériel sur site — des lignes de facture prévisibles au lieu d’un risque de direction. Tarifs officiels des DWS Skilled Agents. Source unique de vérité, revue chaque trimestre.',
    Version: 'Version',
    Effective: 'En vigueur',
    'Next review': 'Prochaine revue',
    Currency: 'Devise',
    VAT: 'TVA',
    'B2B · 0%': 'B2B · 0 %',
    'Payment terms': 'Conditions de paiement',
    'Net 14': 'Net 14 jours',
    'B2B Pricing · VAT 0% (reverse charge).': 'Tarifs B2B · TVA 0 % (autoliquidation).',
    'All prices in EUR, excluding VAT. Finnish VAT (25.5%) is added at checkout for FI-billed customers. EU intra-community supplies are reverse-charged against a valid EU VAT number. Quote valid':
      'Tous les prix en EUR, hors TVA. La TVA finlandaise (25,5 %) est ajoutée au paiement pour les clients facturés en Finlande. Les livraisons intracommunautaires sont autoliquidées sur présentation d’un numéro de TVA européen valide. Offre valable',
    '30 days': '30 jours',
    'Choose your deployment — one platform, three ways':
      'Choisissez votre déploiement — une plateforme, trois voies',
    'DWS IQ 6 is a single agent platform delivered in three ways. You pick by':
      'DWS IQ 6 est une seule plateforme d’agents livrée de trois façons. Le choix se fait selon',
    'sovereignty posture': 'la posture de souveraineté',
    ', not by feature set — the same 50-production-agent brain runs in every model; only the jurisdiction, infrastructure, and ownership change. Two of the three are':
      ', et non selon les fonctionnalités — le même cerveau de 50 agents de production tourne dans chaque modèle ; seuls la juridiction, l’infrastructure et la propriété changent. Deux des trois sont',
    'cloud versions we host for you': 'des versions cloud que nous hébergeons pour vous',
    '; the third is a': '; la troisième est une',
    'sovereign NVIDIA DGX solution you own and run on your own premises':
      'solution NVIDIA DGX souveraine que vous possédez et exploitez dans vos propres locaux',
    'Cloud · Multi-tenant SaaS': 'Cloud · SaaS multi-locataire',
    'EU-Sovereign Cloud': 'Cloud souverain européen',
    'Scaleway serverless (Paris / Amsterdam), French-owned (Iliad Group)':
      'Scaleway serverless (Paris / Amsterdam), capital français (groupe Iliad)',
    'Zero US CLOUD Act exposure · EU-only Managed PostgreSQL + pgvector':
      'Aucune exposition au CLOUD Act américain · PostgreSQL managé + pgvector exclusivement dans l’UE',
    'Scale-to-zero, pay-per-request; nothing to operate':
      'Mise à l’échelle jusqu’à zéro, facturation à la requête ; rien à exploiter',
    'EU AI Act Article 12 logging built in': 'Journalisation article 12 du règlement IA intégrée',
    'Best for:': 'Convient surtout à :',
    'EU/UK-regulated mid-market and enterprise — construction, logistics, energy, manufacturing. A cost-sensitive':
      'ETI et grands comptes régulés UE/Royaume-Uni — construction, logistique, énergie, industrie. Une',
    'is also available for non-EU-regulated workloads.':
      'sensible aux coûts est également disponible pour les charges non régulées par l’UE.',
    'Cloud · Single-tenant': 'Cloud · Locataire unique',
    'Dedicated Sovereign Cloud — Aegis': 'Cloud souverain dédié — Aegis',
    'UpCloud (Helsinki) / Hetzner — Finnish jurisdiction, zero CLOUD Act':
      'UpCloud (Helsinki) / Hetzner — juridiction finlandaise, aucun CLOUD Act',
    'Aiven managed PostgreSQL (no US-incorporated vendor in the data path)':
      'PostgreSQL managé par Aiven (aucun fournisseur de droit américain sur le chemin des données)',
    'Themis control plane · Article 12 pipeline · EUDI Wallet auth':
      'Plan de contrôle Themis · pipeline article 12 · authentification par portefeuille EUDI',
    'Dedicated instance, not shared tenancy': 'Instance dédiée, pas de mutualisation',
    'defence, government, critical infrastructure — sovereignty mandated but a physical air-gap is not.':
      'défense, administrations, infrastructures critiques — souveraineté imposée, mais pas l’isolation physique.',
    'Aegis details →': 'Détails Aegis →',
    'On-premise · Air-gapped': 'Sur site · Isolé du réseau',
    'Sovereign On-Premise — NVIDIA DGX': 'Sur site souverain — NVIDIA DGX',
    'Your hardware · you own the weights': 'Votre matériel · vous possédez les poids',
    'Data never leaves your network · you own 100% of model weights':
      'Les données ne quittent jamais votre réseau · vous possédez 100 % des poids du modèle',
    'steel, construction, nuclear, dual-use, classified — where a physical air-gap or weight ownership is a hard requirement.':
      'acier, construction, nucléaire, double usage, classifié — là où l’isolation physique ou la propriété des poids est une exigence ferme.',
    'DGX Spark →': 'DGX Spark →',
    'Cloud vs sovereign NVIDIA DGX — the honest comparison':
      'Cloud ou NVIDIA DGX souverain — la comparaison honnête',
    'Both paths are sovereign and both close the CLOUD Act. The real decision is capex vs opex, elasticity vs ownership, and whether a physical air-gap is mandated.':
      'Les deux voies sont souveraines et ferment toutes deux le CLOUD Act. La vraie décision porte sur investissement contre charges d’exploitation, élasticité contre propriété, et sur l’obligation ou non d’une isolation physique.',
    Dimension: 'Dimension',
    'EU-Sovereign Cloud (SaaS / Aegis)': 'Cloud souverain européen (SaaS / Aegis)',
    'Sovereign On-Premise (NVIDIA DGX)': 'Sur site souverain (NVIDIA DGX)',
    'Capital outlay': 'Investissement',
    'None — you rent capacity': 'Aucun — vous louez la capacité',
    'Running cost': 'Coût d’exploitation',
    'Data residency': 'Localisation des données',
    'EU cloud (Paris / Amsterdam / Helsinki)': 'Cloud européen (Paris / Amsterdam / Helsinki)',
    'Never leaves your premises': 'Ne quitte jamais vos locaux',
    'Model ownership': 'Propriété du modèle',
    'Platform-hosted (dedicated instance on Aegis)': 'Hébergé par la plateforme (instance dédiée sur Aegis)',
    'You own 100% of the model weights': 'Vous possédez 100 % des poids du modèle',
    'Network dependency': 'Dépendance réseau',
    'Requires EU-cloud connectivity': 'Nécessite une connexion au cloud européen',
    'Fully air-gap capable — runs offline': 'Pleinement isolable — fonctionne hors ligne',
    'Time to value': 'Délai de mise en valeur',
    '30 days (SaaS); provisioned for you': '30 jours (SaaS) ; provisionné pour vous',
    'Hardware lead time + on-site install': 'Délai matériel + installation sur site',
    Scaling: 'Mise à l’échelle',
    'Elastic — scale-to-zero, burst on demand': 'Élastique — jusqu’à zéro, pics à la demande',
    'Fixed to installed nodes; add boxes to grow':
      'Limitée aux nœuds installés ; croissance par ajout de machines',
    'CLOUD Act exposure': 'Exposition au CLOUD Act',
    'Zero — EU-incorporated providers': 'Nulle — fournisseurs de droit européen',
    'Zero — no cloud in the path at all': 'Nulle — aucun cloud sur le chemin',
    'Best economic fit': 'Meilleur profil économique',
    'Bursty / variable load, fast start, low ops':
      'Charge irrégulière / variable, démarrage rapide, exploitation légère',
    'Steady 24/7 high utilisation; air-gap required':
      'Utilisation soutenue 24/7 ; isolation physique requise',
    'Rule of thumb.': 'Règle empirique.',
    'Start on': 'Commencez par',
    '— it is the fastest, lowest-risk path and closes the CLOUD Act on day one. Move to':
      '— c’est la voie la plus rapide et la moins risquée, et elle ferme le CLOUD Act dès le premier jour. Passez à',
    Aegis: 'Aegis',
    'when you need single-tenant isolation and a full Article 12 control plane. Choose the':
      'lorsque vous avez besoin d’une isolation mono-locataire et d’un plan de contrôle article 12 complet. Choisissez la solution',
    'sovereign NVIDIA DGX': 'NVIDIA DGX souveraine',
    'solution when a physical air-gap or 100% model-weight ownership is non-negotiable, or when a steady, high-utilisation workload makes owned hardware cheaper than metered cloud over a 2–3 year horizon. Many customers run both: DGX at the regulated edge, cloud for elastic burst.':
      'lorsque l’isolation physique ou la pleine propriété des poids du modèle n’est pas négociable, ou lorsqu’une charge soutenue et fortement utilisée rend le matériel possédé moins cher que le cloud facturé à l’usage sur 2 à 3 ans. Beaucoup de clients font les deux : DGX à la périphérie régulée, cloud pour les pics élastiques.',
    'Compare cloud tiers →': 'Comparer les offres cloud →',
    'Loading price list…': 'Chargement des tarifs…',
    'Legal entity': 'Entité juridique',
    'Laidunmaanraitti 2 A 25, 02330 Espoo, Finland': 'Laidunmaanraitti 2 A 25, 02330 Espoo, Finlande',
    'Business ID:': 'Numéro d’entreprise :',
    'VAT ID:': 'Numéro de TVA :',
    'Price list governance': 'Gouvernance des tarifs',
    'Owner:': 'Responsable :',
    'Cadence: Reviewed every calendar quarter': 'Cadence : revue à chaque trimestre civil',
    'DWS Document Standard version:': 'Version du standard documentaire DWS :',
    '· Effective': '· En vigueur',
    'Market:': 'Marché :',
    'Finnish / EU B2B · VAT 0 % (reverse charge)':
      'Finlande / UE B2B · TVA 0 % (autoliquidation)',
    '. Hardware costs reflect verified EU distributor and EMEA launch prices — not converted from US list. NVIDIA / Acer EU sources documented in':
      '. Les coûts matériels reflètent des prix vérifiés de distributeurs européens et de lancement EMEA — non convertis depuis les tarifs américains. Les sources européennes NVIDIA / Acer sont documentées dans',
    'Source of truth:': 'Source de vérité :',
    Contact: 'Contact',
    'Sales:': 'Ventes :',
    'Phone requests via email.': 'Demandes téléphoniques par e-mail.',
    'For a signed quote on this price list, email sales with the product IDs in the leftmost column.':
      'Pour un devis signé sur ces tarifs, écrivez au service commercial en indiquant les identifiants produits de la colonne de gauche.',
  },
};

const TITLES = {
  fi: 'Hinnasto · DWS IQ -alusta · Lifetime Oy',
  sv: 'Prislista · DWS IQ-plattformen · Lifetime Oy',
  de: 'Preisliste · DWS IQ-Plattform · Lifetime Oy',
  fr: 'Tarifs · Plateforme DWS IQ · Lifetime Oy',
};

const collapse = (s) => s.replace(/\s+/g, ' ').trim();

function localize(html, lang) {
  const dict = T[lang];
  const parts = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)/g);
  let hits = 0;
  const out = parts.map((part, i) => {
    if (i % 2 !== 0) return part;
    const key = collapse(part);
    if (!key || !(key in dict)) return part;
    hits++;
    // keep the original leading/trailing whitespace so the markup stays readable
    const lead = part.match(/^\s*/)[0];
    const tail = part.match(/\s*$/)[0];
    return lead + dict[key] + tail;
  });
  return { html: out.join(''), hits };
}

const ALTERNATES = [
  '    <link rel="alternate" hreflang="en" href="https://dws10.com/price-list/">',
  ...LANGS.map((l) => `    <link rel="alternate" hreflang="${l}" href="https://dws10.com/price-list/${l}/">`),
  '    <link rel="alternate" hreflang="x-default" href="https://dws10.com/price-list/">',
].join('\n');

const source = readFileSync(SRC, 'utf8');

// The English page links its own alternates once.
let en = source;
if (!en.includes('hreflang="fi" href="https://dws10.com/price-list/')) {
  en = en.replace(/(<title>[\s\S]*?<\/title>)/, `$1\n${ALTERNATES}`);
  for (const root of OUT_ROOTS) writeFileSync(join(root, 'index.html'), en);
  console.log('en   : added hreflang alternates');
}
// The 18+ agent claim is deprecated (canonical: 50 production agents).
en = en.replace(/the same 18\+ agent brain/g, 'the same 50-production-agent brain');
for (const root of OUT_ROOTS) writeFileSync(join(root, 'index.html'), en);

for (const lang of LANGS) {
  let { html, hits } = localize(en, lang);
  const missing = Object.keys(T[lang]).length - hits;
  html = html.replace(/<html([^>]*)lang="en"/, `<html$1lang="${lang}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${TITLES[lang]}</title>`);
  // asset and data paths move one level deeper
  html = html.replace(/(src|href)="\.\.\/([^"]*)"/g, '$1="../../$2"');
  html = html.replace(/fetch\("\.\.\/config\/products\.json"/g, 'fetch("../../config/products.json"');
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="https://dws10.com/price-list/${lang}/">`
  );
  if (!html.includes('rel="canonical"')) {
    html = html.replace(
      /(<title>[\s\S]*?<\/title>)/,
      `$1\n    <link rel="canonical" href="https://dws10.com/price-list/${lang}/">`
    );
  }
  for (const root of OUT_ROOTS) {
    const out = join(root, lang, 'index.html');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
  }
  console.log(`${lang}   : ${hits} strings localized${missing ? `, ${missing} dictionary entries unused` : ''}`);
}
