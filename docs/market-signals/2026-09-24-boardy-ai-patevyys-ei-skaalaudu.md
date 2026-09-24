---
signal_id: MS-2026-09-002
reality: HIC on käyttänyt Boardy.ai:ta sivutoimisena neuvonantajana; 6 kk sitten Boardy tuotti ylivoimaisia SQL-määrittelyjä, joihin Clauden mallit eivät taipuneet. Tänään HIC ei vie Workflow v2 -ajattelua Boardyyn.
observation: Boardy ei kykene johtamaan näin laajaa asiakokonaisuutta sivutoimisesti niin, että tulos olisi vielä 20 % parempi. Se alkaa oikoa; tekee liian nopeita ja lyhyitä reittejä, jotka tuhoavat pipelinen alkupään HIC-toiveet. "Tulos vain ja ulos" on destruktiivista.
signal: null
insight: null
source: customer conversation
date: 2026-09-24
observed_at: 2026-09-24
observer: HIC
confidence: medium
occurrences: 2
affected: [offering, workflows, onelifetime.world]
status: observed
hypothesis: null
refuting_evidence: null
decision: null
decisions_detail: []
dispatched_runs: []
impact: []
evaluation: null
---

## Reality → Observation (kirjattu CAPTURE-solmussa, ei vielä yleistetty)

- **Reality:** tekoälyyn perustuvaa pätevyyttä on vaikea myydä; sen arvo vaihtelee kuukausissa.
  Boardy oli 6 kk sitten SQL-määrittelyissä Claudea parempi. Nyt HIC ei enää anna sille Workflow
  v2 -kokonaisuutta.
- **Observation (HIC, omin sanoin):** laajassa, pitkäkestoisessa kokonaisuudessa neuvonantaja-AI
  alkaa oikaista. Lyhyet reitit ja "tulos vain ja ulos" tuhoavat sen, mitä HIC on pipelinen
  alkupäähän (Observation, Insight, päätöksen perustelut) tarkoittanut. Tuloksen pitäisi olla
  20 % parempi, jotta sivutoiminen johtaminen kannattaisi; ei ole.

## Aiempi esiintymä

- `docs/field-notes/…` (branch history: "HIC advisory workflow moves from Boardy.ai to Gemini
  App thinking", a824bc0) – sama suunta: neuvonantajan vaihto, kun kokonaisuus kasvoi.

## Miksi tämä kuuluu rekisteriin eikä vain muistiinpanoihin

Havainto koskee kolmea asiaa, joita myymme tai käytämme: (1) _tarjonta_ – "AI-pätevyys"
myyntiväitteenä on hauras, koska paremmuus on hetkellistä; (2) _workflow_ – oikova agentti on
juuri se vika, jota HIC_APPROVAL_GATE, GUARDRAIL ja "retry palaa porttiin" estävät; tämä havainto
on niiden peruste; (3) _ymmärrys_ – Journal-teksti toimittajariippuvuudesta (ai-vendor-dependency
1–3, luonnoksina) saa tästä konkreettisen esimerkin.

Seuraava solmu: CLASSIFY → FORMULATE_SIGNAL. Ehdotus signaaliksi HIC:n päätettäväksi, ei vielä
kirjattu: "Pitkäkestoisessa kokonaisuudessa myydään prosessin pitävyyttä, ei mallin
hetkellistä älykkyyttä."
