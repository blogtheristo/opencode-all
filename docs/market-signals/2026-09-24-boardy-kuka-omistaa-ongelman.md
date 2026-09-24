---
signal_id: MS-2026-09-007
reality: "Kemira-case (HIC 24.09.2026): havainto 'Emme tiedä tuotantoerien hiilijalanjälkeä.' Sustainability on käyttäjä, Production omistaa datan, Digitalisation omistaa järjestelmät, COO:lla on päätösoikeus, CFO:lla investointihyväksyntä. Ostoprosessi pysähtyy, koska yksikään heistä ei omista ongelmaa kokonaan."
observation: "Boardy kysyi: 'Kuka omistaa ongelman?' Useimmat järjestelmät (ERP: mitä tapahtui; BI: mitä data näyttää) pysähtyvät havaintoon. Ongelman omistaja ei ole aina näkyvissä; 'yksi ongelma' on todellisuudessa organisaatiokartta."
signal: "Lähes kaikki isot ongelmat ovat lopulta tunnettu ongelma + epäselvä omistajuus. Ilman omistajaa ei ole päätöstä; ilman päätöstä ei ole muutosta."
insight: "DWS IQ ei rakenna vain organisaation ymmärrysjärjestelmää vaan tarkemmin organisaation päätösoikeuksien ja vastuiden karttaa. Active Ontologian diagnoosivaiheeseen kuuluu omistajuusketju: Kuka kärsii? → Kuka voi päättää? → Kuka omistaa budjetin? → Kuka tuottaa datan? → Kuka vastaa lopputuloksesta? Positiointiketjuun tulee kaksi uutta porrasta: Tilannetietoisuus → Ymmärrys → Omistajuus → Johtaminen → Muutoskyky → Kilpailukyky."
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
status: proposed
hypothesis: "Kun Active Ontologian diagnoosi tuottaa havainnon lisäksi omistajuuskartan (roolit × kärsii/päättää/budjetti/data/vastuu), kävijä osaa viedä asian oikealle henkilölle ja myyntikeskustelu alkaa päätöksentekijästä eikä käyttäjästä. Mittari: konsultaatiovarauksissa päätösoikeudellinen rooli (COO/CFO/BU-johtaja) ≥ 30 % 90 päivässä."
refuting_evidence: "Jos kävijät eivät osaa tai halua nimetä rooleja (tyhjät omistajuuskentät > 70 %), omistajuuskartta kuuluu myyntikeskusteluun, ei itsepalveluun."
learning_delta:
  id: LD-2026-09-007
  old_assumption: "Ketju Tilannetietoisuus → Johtaminen → Muutoskyky → Kilpailukyky riittää; havainto johtaa suoraan päätökseen."
  new_learning: "Havainnon ja päätöksen välissä on kaksi porrasta: ymmärrys (mitä tämä tarkoittaa) ja omistajuus (kenellä on vastuu ja päätösoikeus). Tuote, joka pysähtyy havaintoon, on dashboard; tuote, joka nimeää omistajan, on johtamisjärjestelmä."
  ontology_change: "Observation-entiteettiin lisätään ownership_map: { suffers, decides, budget, data, accountable } roolitasolla (ei henkilöitä, ei PII). Active Ontology -polkuihin (config/active-ontology.json) lisätään roolit per polku."
  hic_decision: PENDING
  decision_reasoning: null
  applied_to: []
  excluded: []
  approved_by: null
  approved_at: null
  effective_from: null
  world_model_version: 1.7.0-proposed
decision: null
comprehension: "HIC 24.09.2026: 'Tässä kohtaa Active Ontology muuttuu teoriasta tuotteeksi.' Boardyn ERP/BI-kategoriahuoli katoaa, kun DWS IQ vastaa: mitä tämä tarkoittaa, kenen pitäisi välittää, kenellä on päätösoikeus, mitä seuraavaksi."
application_decision:
  applies_to: []
  does_not_apply_to: []
  basis: [MS-2026-09-002, MS-2026-09-004, MS-2026-09-006, Kemira-case]
  valid_until: null
  affects: [dws10.com hero, DISCOVER-diagnoosi, website_observations-skeema, Chapter 14 CLASSIFY]
dispatched_runs:
  - "PROPOSED: dws10.com hero v3 (organisaation ymmärrysjärjestelmä, kuusiporrasketju) — odottaa APPLY"
  - "PROPOSED: Active Ontology diagnose-vaiheeseen omistajuuskysymys 'Kenellä tämä on pöydällä?' (roolivalinta, ei nimiä) → ownership_map"
  - "PROPOSED: migration 090 website_observations.ownership_map jsonb (additive)"
  - "PROPOSED: Chapter 14 CLASSIFY lisää owner_role-kentän signaaliin"
impact:
  - { target: positioning, status: proposed, note: kuusiporrasketju }
  - { target: dws10.com, status: proposed, note: hero v3 + omistajuuskysymys }
  - { target: active-ontology, status: proposed, note: ownership_map per polku }
  - { target: workflows, status: proposed, note: Chapter 14 owner_role }
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

## Seuraava solmu

SHOW_TO_HIC → HIC_APPROVAL_GATE → APPLY_LEARNING_GATE (LD-007). Kysymys HIC:lle: APPLY
kokonaisuutena (positiointi + tuote), PARTIAL (vain tuote: omistajuuskysymys diagnoosiin, hero
ennallaan) vai DEFER.
