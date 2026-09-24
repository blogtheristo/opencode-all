---
signal_id: MS-2026-09-005
reality: Lähes kaikki sivustot (myös dws10.com) käsittelevät hakukentän hakuna. Käyttäjä kirjoittaa "emme tiedä tuotantoerien hiilijalanjälkeä", saa hakutuloksia, ja lause katoaa.
observation: Hakukenttä ei ole UX-elementti vaan Observation Sensor. Se on suorin mittari sille, mitä asiakkaat yrittävät saada aikaan; ei SEO-dataa, ei kyselyä, ei pyydettyä palautetta, vaan todellisuutta.
signal: Jokainen etusivulle kirjoitettu lause on Chapter 14:n CAPTURE-havainto; Chapter 14 alkaa etusivulta, ei rekisteristä.
insight: Kun hakukenttä muutetaan Observation Intakeksi ("Mikä päätös on tällä hetkellä vaikea tehdä?") ja siitä kerätään query + industry + page + ontology_guess + recommended_path + selected_path + result, syntyy Learning Delta -aineistoa automaattisesti. Aktiivinen ontologia ei vain auta asiakasta; asiakas opettaa ontologiaa jokaisella lauseella.
source: customer conversation
date: 2026-09-24
observed_at: 2026-09-24
signal_at: 2026-09-24
insight_at: 2026-09-24
observer: HIC
confidence: high
occurrences: 1
evidence: {related: [MS-2026-09-003, MS-2026-09-004], example_counts: "10 hiilijalanjälki · 7 raportointi · 25 copilot · 15 nis2 (havainnollistus, ei mitattu)"}
affected: [dws10.com, dws10.com/buy, workflows, onelifetime.world, lifetime.fi]
status: signal
hypothesis: Kun dws10.com:n etusivun kenttä kerää havainnon (teksti + toimiala + sivu) ja ontologia vastaa "Ymmärsinkö oikein? … Mikä näistä kuvaa parhaiten?" tuotteiden sijaan, (a) kenttää käytetään useammin kuin hakua, (b) kirjatut havainnot tuottavat kuukaudessa vähintään yhden HIC:n hyväksymän Learning Deltan ja (c) suositellun ja valitun polun ero paljastaa ontologian virheet ilman erillistä tutkimusta.
refuting_evidence: 60 pv: jos kentän käyttöaste jää alle nykyisen haun, tai kirjatuista havainnoista ei synny yhtään CLASSIFY-vaiheen läpäissyttä signaalia, sensori on väärin muotoiltu tai sijoitettu. Tietosuoja: jos vapaatekstiin kirjoitetaan PII:tä yli 5 %:ssa, kenttä tarvitsee anonymisoinnin ennen tallennusta.
learning_delta:
  id: LD-2026-09-005
  old_assumption: "Hakukenttä on haku; search_term riittää analytiikkaan."
  new_learning: "Hakukenttä on maailman suurin anturi sille, mitä asiakkaat yrittävät saada aikaan. Kerätään query + industry + page + ontology_guess + recommended_path + selected_path + result; jokainen rivi on Observation → Signal → Insight → Learning Delta -aineistoa."
  ontology_change: "Lisätään käsite Observation Intake (verkkosivun sensori) Chapter 14:n automaattisiin havainnoijiin; hakutermi korvataan Havainto-oliolla, jolla on toimiala, konteksti, ontologia-arvaus (confidence), suositus, valinta ja tulos."
  hic_decision: PENDING
  applied_to: []
  excluded: []
decision: null
comprehension: null
dispatched_runs: []
impact: []
evaluation: null
---

## Observation Intake käytännössä (spec-liite: docs/specs/active-ontology-ux-v2.md §0b)

Etusivulla: **"Mikä päätös on tällä hetkellä vaikea tehdä?"** + vapaa kenttä, esimerkkeinä
"Emme tiedä tuotantoerien hiilijalanjälkeä · Tarjouksiin menee liikaa aikaa · NIS2
huolestuttaa · Verkkokauppa ei kasva". Enter →

1. Observation syntyy: `{text, source: website, industry, page, status: observed}`.
2. Ontologia luokittelee: `{industry: industrial, topics: [carbon, lca, csrd], confidence: 0.82}`.
3. Asiakkaalle ei näytetä tuotteita vaan **"Ymmärsinkö oikein? Vaikuttaa siltä, että ongelma
   liittyy: ✓ tuotantoeriin ✓ hiilijalanjälkeen ✓ raportointiin. Mikä näistä kuvaa parhaiten?"**
   → jatkuu UX v2:n diagnostiseen polkuun.
4. Samalla syntyy markkinadataa: mitä ihmiset yrittävät ratkaista, toimialoittain.

Learning Delta -rivi: `{query, ontology_guess, recommended, selected, result}` — esim.
"emme tiedä tuotantoerien hiilijalanjälkeä" → industrial → climate_intelligence →
climate_intelligence → workshop_booked. Suositellun ja valitun ero on ontologian virhesignaali.

Ei PII:tä rekisteriin: vapaateksti anonymisoidaan (nimet, sähköpostit, puhelinnumerot)
ennen tallennusta; alkuperäinen ei säily.
