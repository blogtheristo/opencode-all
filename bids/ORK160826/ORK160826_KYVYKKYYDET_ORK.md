# Pysyvät kyvykkyydet ORK:lle

## DWS IQ -kyvykkyyskerros koko puiteajan ajan | ORK/1462/2026

**Liite tarjoukseen:** ORK160826_TARJOUSKIRJE
**Asiakas:** Oikeusrekisterikeskus (ORK), Helsinki
**Sopimuskausi:** 2 + 1 + 1 vuotta (optioineen)

---

Version: 1.0 | 2026-06-28 | Claude Code (Opus 4.8) | Luonnos

---

**Tarjoaja:** Lifetime Oy · Y-tunnus 0772407-9 · Risto Paarni · risto.paarni@lifetime.fi · +358 400 319 010

---

## Periaate: pysyvä kyvykkyyskerros, ei kertaprojekti

Tarjoamme ORK:lle pääsyn DWS IQ -alustan **pysyvään kyvykkyyskerrokseen** koko puiteajan ajan. Tämä
tarkoittaa, että ORK:lla on käytettävissään **58 agenttia ja 88 kyvykkyyttä 25 toimialalla** — aina
saatavilla, aina ajan tasalla. Kun EU-sääntely muuttuu (CBAM, CSRD, NIS2, EU AI Act), kyvykkyydet
päivittyvät automaattisesti, koska taustalla oleva Lifetime World Model -ontologia koulutetaan jatkuvasti
uudelleen. ORK ei osta yksittäistä toimitusta vaan jatkuvan valmiuden muutokseen.

**Eettinen periaate:** Tekoäly augmentoi, ei korvaa. Emme pyri vähentämään ORK:n henkilöstöä;
henkilöstöstä päättää ORK:n johto. Tuomme kyvykkyydet ORK:n asiantuntijoiden rinnalle, ihmisen
valvonnassa (human-in-the-loop).

## Pysyvät kyvykkyydet osa-alueittain

**Osa-alue 1 — Agentti- ja tekoälyratkaisujen kehitys**

- AI Scoping Consultant, GenAI Solution Architect — ratkaisujen kartoitus ja arkkitehtuuri
- Daedalus (MCP Bridge), Agora (moniagenttikonsensus), Atlas (orkestrointi) — moniagenttityönkulut
- Compliance Agent, Themis (oikeudellinen äly), Auditor — sääntely- ja oikeudellinen automaatio
- Synthetic Data, Panacea (optimoija) — testidata ja agenttien suorituskyvyn viritys

**Osa-alue 2 — Asiakasratkaisujen ja -prosessien kehityksen tuki**

- AI Consultant / Coach, Training & Enablement Agent — koulutus ja muutostuki
- Business Analyst, Change Management Agent — prosessikartoitus, adoptiostrategia
- Minerva (tiedonsiirto, XAI-selitykset), Knowledge Base — perehdytys ja selitettävyys
- Sisältää Claude Code Coaching -ohjelman ja EU AI Act Article 4 -lukutaitovalmennuksen ORK:n tiimeille

**Osa-alue 3 — Agenttipohjainen järjestelmäkehitys**

- DWS Deployment Engineer, Integration Architect — järjestelmäintegraatiot, API-suunnittelu
- DevOps Engineer, Quality Gate — CI/CD, käyttöönottovalmius (tietoturvaskannaus, testikattavuus)
- Test Automation Agent, Database Architect Agent — laadunvarmistus, skeema ja suorituskyky
- Designer — GenAI-käyttöliittymät

## Pysyvät läpileikkaavat kyvykkyydet (kaikki osa-alueet)

Nämä ovat aina mukana, riippumatta tilatusta osa-alueesta:

- **Suvereniteetti** — data pysyy EU/ETA-alueella, nolla CLOUD Act -altistusta; lokaali toteutus
  NVIDIA-laitteistolla (Control Room / Situation Room, ks. ORK160826_SUVEREENINEN_TOTEUTUS)
- **KYA — Know Your Agent** — jokainen agentti-istunto kryptografisesti sidottu varmennettuun
  henkilöön, Firecracker MicroVM -eristys, <125 ms kill-auktoriteetti, täysi jäljitettävyys
- **EU AI Act Article 12 -auditointi** — jokainen AI-toiminto hash-ketjutettu, muuttumaton, 7 vuoden
  retentio; valmis viranomaisauditointiin
- **NIS2- ja GDPR-valmius** — 24h insidenttirekonstruktio, tietojenkäsittelysopimukset (DPA)

## Kyvykkyydet tuotteen elinkaaressa — pysyvä tuki

ORK saa kyvykkyydet koko elinkaaren ajaksi, ei vain kehitysvaiheeseen:

- **Kehitys** → GenAI Solution Architect, Integration Architect, Test Automation, Designer
- **Käyttöönotto** → DWS Deployment Engineer, DevOps Engineer, Quality Gate
- **Ylläpito** → Network Security, Sovereignty Monitor, Auditor, Service Desk (EU-pohjaiset resurssit)
- **Päivitys & kasvu** → Cassandra (ennusteet), Change Management, Disruption Response; LWM-ontologian
  jatkuva uudelleenkoulutus sääntelyn muuttuessa

## Kehitystyön jatkuvuus — kyvykkyydet pitävät työn liikkeessä

Kehitystyön suurin piilokustannus on **keskeytys**: kontekstin uudelleenrakentaminen, momentumin menetys
ja avainhenkilöriski. DWS:n kyvykkyydet on suunniteltu pitämään kehitystyö liikkeessä — agentit eivät
keskeydy, eivät unohda kontekstia eivätkä jää lomalle:

- **Konteksti säilyy** — Mnemosyne (pitkäkestomuisti) pitää istuntojen välisen kontekstin tallessa;
  kehitys jatkuu siitä mihin jäätiin, ei nollasta.
- **Häiriöt ennakoidaan** — Disruption Response -kyvykkyys seuraa riskisignaaleja ja varoittaa ennen
  kuin keskeytys tapahtuu; Project Manager -kyvykkyys pitää aikataulut ja työnkulut ajan tasalla.
- **Suvereeni paikallinen toteutus poistaa pilviriippuvuuden** — inferenssi ORK:n omalla
  NVIDIA-laitteistolla ei katkea pilvipalvelun käyttökatkoon, SLA-rajoitukseen eikä nettiyhteyden
  pätkimiseen. Kehitys jatkuu myös suljetussa verkossa.
- **Token-kulujen välttäminen poistaa kustannusperusteisen jarrutuksen** — pilvi-LLM:ien per-token-lasku
  pakottaa usein rajoittamaan käyttöä budjetin vuoksi, mikä hidastaa kehitystä. Lokaali päättely on
  kiinteä kustannus → rajaton inferenssi → kehitys ei jarrutu kustannussyistä.

_Osa näistä jatkuvuuskyvykkyyksistä on aktiivisessa kehitysvaiheessa (varhainen versio); ne kypsyvät
toimituskauden aikana ja ovat osa jatkuvaa kyvykkyyskerrosta._

## Mitä pysyvyys tarkoittaa ORK:lle

- **Aina käytettävissä** — kyvykkyys ei lähde lomalle eikä irtisanoudu; ei avainhenkilöriskiä
- **Aina ajan tasalla** — sääntelymuutos päivittää kyvykkyydet automaattisesti
- **Aina auditoitavissa** — Article 12 -jälki jokaisesta päätöksestä, viranomaisvalmis
- **Skaalautuu tarpeen mukaan** — puitesopimus, tilaukset tarpeen mukaan (€/henkilötyöpäivä),
  ei volyymipakkoa

---

**Lifetime Oy** · Y-tunnus 0772407-9 · Laidunmaanraitti 2 A 25, 02330 Espoo
risto.paarni@lifetime.fi · Suomalainen, EU-suvereeni toimittaja.
