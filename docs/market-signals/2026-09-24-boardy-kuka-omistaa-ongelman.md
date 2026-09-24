---
signal_id: MS-2026-09-007
reality: "Kemira-case (HIC 24.09.2026): havainto 'Emme tiedä tuotantoerien hiilijalanjälkeä.' Sustainability on käyttäjä, Production omistaa datan, Digitalisation omistaa järjestelmät, COO:lla on päätösoikeus, CFO:lla investointihyväksyntä. Ostoprosessi pysähtyy, koska yksikään heistä ei omista ongelmaa kokonaan."
observation: "Boardy kysyi: 'Kuka omistaa ongelman?' Useimmat järjestelmät (ERP: mitä tapahtui; BI: mitä data näyttää) pysähtyvät havaintoon. Ongelman omistaja ei ole aina näkyvissä; 'yksi ongelma' on todellisuudessa organisaatiokartta."
signal: "Lähes kaikki isot ongelmat ovat lopulta tunnettu ongelma + epäselvä omistajuus. Ilman omistajaa ei ole päätöstä; ilman päätöstä ei ole muutosta."
insight: "DWS IQ ei rakenna vain organisaation ymmärrysjärjestelmää vaan tarkemmin organisaation päätösoikeuksien ja vastuiden karttaa. Active Ontologian diagnoosivaiheeseen kuuluu omistajuusketju: Kuka kärsii? → Kuka voi päättää? → Kuka omistaa budjetin? → Kuka tuottaa datan? → Kuka vastaa lopputuloksesta? Tarkennus (HIC 24.09.2026, 2. kierros): tietää ei ole passiivinen tila; arvo syntyy, kun ongelma + päättäjä + toimintaoikeus + ajoitus yhdistetään. Johtamisketju: Havainto → Ymmärrys → Vastuu → Toiminta → Vaikutus. Tämä on sama objekti kuin Chapter 14:n jalostusketju (Observation → Insight → Decision → Action → Outcome): markkinointiketju ja työnkulkuketju ovat yksi ja sama."
source: HIC + Boardy
date: 2026-09-24
observed_at: 2026-09-24
signal_at: 2026-09-24
insight_at: 2026-09-24
observer: HIC (Boardy-keskustelu, Kemira-case)
confidence: high
occurrences: 1
evidence:
  {
    kemira_roles: 5,
    boardy_question: "Kuka omistaa ongelman?",
    prior_chain_steps: 4,
    proposed_chain_steps: 6,
  }
affected: [dws10.com, dws10.com/buy, active-ontology, positioning, workflows]
status: accepted
hypothesis: "Kun Active Ontologian diagnoosi tuottaa havainnon lisäksi omistajuuskartan (roolit × kärsii/päättää/budjetti/data/vastuu), kävijä osaa viedä asian oikealle henkilölle ja myyntikeskustelu alkaa päätöksentekijästä eikä käyttäjästä. Mittari: konsultaatiovarauksissa päätösoikeudellinen rooli (COO/CFO/BU-johtaja) ≥ 30 % 90 päivässä."
refuting_evidence: "Jos kävijät eivät osaa tai halua nimetä rooleja (tyhjät omistajuuskentät > 70 %), omistajuuskartta kuuluu myyntikeskusteluun, ei itsepalveluun."
learning_delta:
  id: LD-2026-09-007
  old_assumption: "Ketju Tilannetietoisuus → Johtaminen → Muutoskyky → Kilpailukyky riittää; havainto johtaa suoraan päätökseen."
  new_learning: "Havainnon ja vaikutuksen välissä on kolme porrasta: ymmärrys (mitä tämä tarkoittaa), vastuu (ketä koskee, kenellä on oikeus toimia) ja toiminta (mitä seuraavaksi). Tuote, joka pysähtyy havaintoon, on dashboard; tuote, joka yhdistää ongelman päättäjään, toimintaoikeuteen ja ajoitukseen, on johtamisjärjestelmä. Kategoriamääritelmä: organisaation ymmärrysjärjestelmä, jonka tehtävä on yhdistää havainto, vastuu ja toiminta yhdeksi jatkuvaksi ketjuksi."
  ontology_change: "Observation-entiteettiin lisätään ownership_map: { suffers, decides, budget, data, accountable } roolitasolla (ei henkilöitä, ei PII). Active Ontology -polkuihin (config/active-ontology.json) lisätään roolit per polku."
  hic_decision: APPLY
  decision_reasoning: "HIC 24.09.2026: APPLY kokonaisuutena — mutta ei heroon. Omistajuus ei ole copy-muutos eikä UX-ominaisuus vaan DWS IQ:n ydinkyvykkyys ja ontologinen vaihe: Observation → Meaning → Ownership → Decision → Action → Outcome. Boardyn 'who owns the problem?' korjataan muotoon 'who can make the problem move?': Owner ≠ Decision Rights ≠ Budget ≠ Data Owner ≠ Impact Owner; tehtävä ei ole löytää yhtä omistajaa vaan yhdistää Problem → Impact → Decision Rights → Action Rights → Outcome Ownership samaan malliin. Ensimmäinen kysymys ei ole 'kuka omistaa' vaan 'onko omistajuus tiedossa': ei → Ownership Discovery, kyllä → Decision Mapping. 'Päätösoikeuksien kartta' on poliittinen väite, joten sitä ei myydä, se löydetään diagnostiikassa (ongelma ei ole data, raportointi eikä järjestelmä vaan epäselvä omistajuus). Kategoria: ERP = mitä tapahtui; BI = mitä data näyttää; DWS IQ = mitä tämä tarkoittaa, ketä tämä koskee, kenellä on päätösvalta, mitä seuraavaksi pitäisi tehdä — ja miten ongelma yhdistetään päättäjään, joka kykenee saamaan muutoksen aikaan. Kilpailukyvyn määritelmä: Menestyvät organisaatiot tunnistavat muutokset aikaisemmin, ymmärtävät niiden vaikutukset nopeammin, yhdistävät ongelmat oikeisiin päättäjiin nopeammin ja toimivat ennen kilpailijoitaan. Ei datasta, ei dashboardista, ei compliance-raportista, vaan nopeammasta oppimisesta ja toiminnasta. Hero pysyy ('Tilannetietoisuudesta kilpailukykyyn.' + kolmirivinen ketju); hero muuttuu vasta jos oppiminen kestää aikaa. Kemira-vastaus Boardylle: emme vielä tiedä, ja juuri se on löydös — tehtävä on ensin selvittää, kuka voi saada ongelman liikkumaan."
  applied_to:
    [active-ontology, dws10.com DISCOVER-diagnostiikka, data-pipeline, workflows, strategy, journal]
  excluded: [dws10.com hero, positiointi, markkinointiotsikot, lifetime.fi, investor-centre]
  approved_by: HIC
  approved_at: 2026-09-24
  effective_from: 2026-09-24
  world_model_version: 1.7.0
decision: ownership_stage_v1
comprehension: "HIC 24.09.2026: 'Tässä kohtaa Active Ontology muuttuu teoriasta tuotteeksi.' Boardyn ERP/BI-kategoriahuoli katoaa, kun DWS IQ vastaa: mitä tämä tarkoittaa, kenen pitäisi välittää, kenellä on päätösoikeus, mitä seuraavaksi."
application_decision:
  applies_to: [active-ontology, dws10.com DISCOVER, data-pipeline, workflows, strategy, journal]
  does_not_apply_to: [dws10.com hero, positiointi, lifetime.fi, investor-centre]
  basis: [MS-2026-09-002, MS-2026-09-004, MS-2026-09-006, Kemira-case]
  valid_until: 2026-12-31 tai kun 100 omistajuusvastausta on kertynyt
  affects: [dws10.com hero, DISCOVER-diagnoosi, website_observations-skeema, Chapter 14 CLASSIFY]
dispatched_runs:
  - "EXCLUDED (HIC): hero v3 — hero ja positiointi ennallaan"
  - "DONE: Active Ontology 1.1.0 ownership-vaihe diagnose → ownership → path: 'Onko tiedossa, kuka voi saada tämän liikkeelle?' → Ei = Ownership Discovery, Kyllä/Osittain = Decision Mapping (5 ulottuvuutta × roolit, ei nimiä) → ownership_map (config/active-ontology.json, shared-assets/discover/active-ontology.js, functions/api/observations.js)"
  - "DONE: migration 090_240926_website_observations_ownership.sql (additive; ajo RED)"
  - "TODO: Chapter 14 CLASSIFY lisää ownership_known + owner_roles signaaliin (PR #2059 mergen jälkeen)"
  - "DONE: Active Ontology 1.2.0 — neljä eri asiaa + Ownership Verdict (kierros 3)"
  - "DONE: Active Ontology 1.3.0 — verdict-reititetty ensimmäinen kauppa (Captain Day) ennen alustatuotteita (kierros 4)"
  - "DONE: Active Ontology 1.4.0 — evidenssipaneeli show-me (migration 091 + /api/observations/summary) (kierros 5)"
  - "CANDIDATE: tuote 'Ownership Evidence' — selvitys, jonka tulos on omistajuuslöydös, ei tekninen ratkaisu (odottaa tuoteperhepäätöstä)"
  - "TODO: Journal-teksti 'Kaikki tietävät ongelman, kukaan ei omista sitä' (sarja 0, teksti 2; Rule 13)"
impact:
  - { target: positioning, status: accepted, note: kuusiporrasketju }
  - { target: dws10.com, status: accepted, note: hero v3 + omistajuuskysymys }
  - { target: active-ontology, status: accepted, note: ownership_map per polku }
  - { target: workflows, status: accepted, note: Chapter 14 owner_role }
evaluation: null
---

## Kemira-case omistajuuskarttana

| Kysymys                      | Rooli                                                   |
| ---------------------------- | ------------------------------------------------------- |
| Kuka kärsii ongelmasta?      | Sustainability                                          |
| Kuka tuottaa datan?          | Production                                              |
| Kuka omistaa järjestelmät?   | Digitalisation                                          |
| Kuka voi tehdä päätöksen?    | COO                                                     |
| Kuka omistaa budjetin?       | CFO                                                     |
| Kuka vastaa lopputuloksesta? | (avoin — tämä on myyntikeskustelun ensimmäinen kysymys) |

ERP kertoo mitä tapahtui. BI kertoo mitä data näyttää. DWS IQ vastaa: mitä tämä tarkoittaa,
kenen pitäisi välittää, kenellä on päätösoikeus ja mitä seuraavaksi pitäisi tehdä.

## Kierros 3 (HIC 24.09.2026): neljä eri asiaa ja omistajuuslöydös

| Asia                | Ulkoistettavissa | Esimerkki (Kemira)                                                                              |
| ------------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| Ongelman omistajuus | osittain         | Sustainability kokee ongelman                                                                   |
| Päätösoikeus        | ei               | COO / CFO (investointi)                                                                         |
| Toimintavastuu      | kyllä            | DWS IQ, konsultti tai kumppani selvittää ja mallintaa                                           |
| Seurausvastuu       | ei               | Kun regulaattori, hallitus tai asiakas kysyy "miten tämä laskettiin", vastaus jää talon sisälle |

Insight: organisaatiot eivät aina osta ratkaisua ongelmaan. Joskus ne ostavat evidenssin siitä,
kuka ongelman omistaa. Suuri osa yritysten "ratkaisemattomista ongelmista" ei ole teknisiä
ongelmia vaan omistajuusongelmia. Arvokkain vastaus voi olla: _"Tämä ei ole sinun ongelmasi
ratkaista. Tämä on sinun ongelmasi siirtää oikealle omistajalle."_ Se vähentää epävarmuutta
välittömästi ja vapauttaa johdon niihin asioihin, jotka kuuluvat sen pöydälle.

Tuotteeseen (Active Ontology 1.2.0): kuusi ulottuvuutta (kärsii, omistaa, päätösoikeus,
toimintavastuu, seurausvastuu, data); rooli "ulkoinen kumppani" sallittu vain toimintavastuuseen;
Ownership Verdict näytetään DISCOVERissa: `discovery` / `transfer` / `outsourced_accountability`
/ `aligned`, ja tallennetaan havaintoon. Tämä on ensimmäinen DISCOVER-tulos, josta asiakas voi
olla valmis maksamaan ilman teknistä ratkaisua → tuotekandidaatti "Ownership Evidence".

## Kierros 4 (HIC 24.09.2026): 137 tuotetta → 137 ratkaisupolkua

Perinteinen myynti: Ongelma → DWS IQ → Kauppa. DISCOVER: Ongelma → Omistajuus → Päätös → useita
etenemispolkuja. Kemira: havainto "erätason hiilijalanjälkeä ei tunneta"; löydös "ongelma ei ole
laskenta vaan datan omistajuus" (Production data, Digitalisation integraatiot, Sustainability
raportti, COO päätös). Polut: A omistajuus epäselvä → Captain Day (1200 €, ei alustaa); B
omistajuus löytyi → Climate Intelligence; C integraatio → DWS IQ Starter / integraatiosprintti;
D compliance → Compliance Agent / CSRD / gap; E osaaminen → AI Literacy Bridge / coaching /
Captain Day; F näkyvyys → SEO Audit / Website Starter / Firehorse.

DISCOVER ei myy DWS IQ:ta eikä tuotetta vaan vastauksen: mikä on ongelma, kuka omistaa sen,
kenellä on päätösvalta, mikä on seuraava järkevä askel. Asiakas saattaa ostaa ensimmäisenä
vastauksen kysymykseen "kuuluuko tämän ratkaiseminen minulle vai jollekin toiselle". DWS IQ ei ole
tuote vaan mekanismi, joka yhdistää ongelman, omistajuuden ja oikean ratkaisupolun; siksi suuri
katalogi on etu.

Tuotteeseen (Active Ontology 1.3.0): omistajuuslöydös ohjaa ratkaisusivun. `discovery` ja
`transfer` → ensimmäinen kauppa Captain Day (sku `ai-consultant-day`, olemassa products.jsonissa)
otsikolla Ownership Discovery / Ownership Evidence, alustatuotteet vasta sen alla "kun omistajuus
on selvä"; `outsourced_accountability` → vastuuhuomautus ennen polun tuotteita; `aligned` → polun
tuotteet suoraan. `recommended_sku` tallentuu havaintoon, joten polkujen A–F toteutuma on
mitattavissa. Polut C–F ohjautuvat jo diagnoosin syiden kautta; niiden erillinen verdict-reititys
on seuraava askel, kun ensimmäiset 100 havaintoa näyttävät jakauman.

## Kierros 5 (HIC 24.09.2026): "trust me" → "show me"

Konsultti sanoo "jokainen asiakastyö tekee seuraavasta paremman"; asiakas ajattelee "niin sanoo
jokainen konsultti". Active Ontology mahdollistaa ensimmäistä kertaa todistamisen: ei "olemme
nähneet tämän ennen" vaan "näin organisaatiot yleensä ratkaisevat tämän". Tärkein assetti ei ole
137 tuotetta eikä 256 polkua vaan todistetut omistajuuslöydökset + todistetut päätöspolut +
todistetut seuraavat askeleet, näytettynä reaaliajassa: mitä ontologia tietää, mitä se ei tiedä,
mitä pitäisi selvittää seuraavaksi.

Tuotteeseen (Active Ontology 1.4.0): evidenssipaneeli omistajuus- ja ratkaisuvaiheessa —
samankaltaisia tapauksia, tyypilliset omistajuusmallit (omistaja + päättäjä, %), tyypilliset
seuraavat askeleet, DISCOVER-laskurit (havaitut ongelmat / omistajuus epäselvä / päättäjä
tunnistettu / polku tunnistettu). Lähde: SQL-funktio `website_observation_summary` (migration
091), Pages Function `GET /api/observations/summary` (5 min välimuisti). Totuussääntö: alle 5
tapausta → paneeli sanoo "ontologia ei vielä tiedä tästä riittävästi", ei koskaan keksittyjä
lukuja. Ilman ympäristömuuttujia paneeli ilmoittaa, ettei se ole käytössä.

## Kategoriamääritelmä (HIC 24.09.2026)

| Järjestelmä | Vastaa kysymykseen                                                                                                                                                                                        |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ERP         | Mitä tapahtui.                                                                                                                                                                                            |
| BI          | Mitä data näyttää.                                                                                                                                                                                        |
| DWS IQ      | Mitä tämä tarkoittaa. Ketä tämä koskee. Kenellä on päätösvalta. Kenellä on toimintavastuu. Kuka kantaa seuraukset. Mitä seuraavaksi — ja miten ongelma yhdistetään päättäjään, joka saa muutoksen aikaan. |

Kemira: "Emme tiedä tuotantoerien hiilijalanjälkeä" ei ole vielä hyödyllinen. Ongelma → Vaikutus →
Omistaja → Päätösoikeus → Toimenpide on hyödyllinen, koska vasta silloin syntyy toiminta.

> Menestyvät organisaatiot eivät voita siksi, että niillä on enemmän tietoa. Ne voittavat siksi,
> että ne yhdistävät ongelmat oikeisiin päättäjiin nopeammin ja toimivat ennen kilpailijoitaan.

Sama ketju kolmessa kerroksessa (yksi objekti, kolme nimeä):

| Markkinointi | Havainto    | Ymmärrys | Vastuu                  | Toiminta   | Vaikutus |
| ------------ | ----------- | -------- | ----------------------- | ---------- | -------- |
| Chapter 14   | Observation | Insight  | Decision                | Action     | Outcome  |
| Kemira       | Ongelma     | Vaikutus | Omistaja + päätösoikeus | Toimenpide | Tulos    |

## Seuraava solmu

APPLY_LEARNING_GATE läpäisty 24.09.2026 (APPLY, hero ja positiointi poissuljettu). Seuraava:
Chapter 14 CLASSIFY ownership-kentät; Journal-teksti; evaluointi kun 100 omistajuusvastausta.
