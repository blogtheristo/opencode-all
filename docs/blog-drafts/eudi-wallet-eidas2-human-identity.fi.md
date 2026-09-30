---
slug: eudi-wallet-eidas2-human-identity.fi
title: "Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0: Ihmisen perusidentiteetti tekoälyagentin valtuuttajana"
series: "KYA-S1 -blogisarja"
part: 11
parts_total: 12
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
hero_image: ../static/images/blog/kya-s1-series-01-hero-fi.png
hero_image_alt: "Sarjakartta: KYA-S1 -blogisarjan 12 osaa"
Status: REAPPROVAL_NEEDED
reapproval_note: text corrected 30.09.2026 by external sourcing (BLOG_STANDARD §17); previously APPROVED. The published page is unchanged.
approved_by: HIC (Risto Anton Päärni), 09.08.2026 — kanoninen Ground Truth -teksti
source: HIC-kirjoittama Ground Truth. Teksti tallennettu sanatarkasti; ei agentin uudelleenkirjoitusta.
note: >-
  Sarjan päätösosa 11/12. Korvaa aiemman luonnoksen
  docs/blog-drafts/eudi-wallet-eidas2-idv-ankkurointi.md, joka on eri teksti (se käsitteli
  wallet-ankkuroidun IDV:n ja KYA-AL3:n 60 s -vaatimuksen aitoa yhteensopivuusongelmaa)
  ja jää talteen (Rule 12). Se avoin kysymys ei sisälly tähän julkaistavaan versioon.
typos_corrected: >-
  Korjattu HIC:n päätöksellä 09.08.2026 ("korjaa typot"). Nämä ovat alkuperäinen →
  korjattu -parit; alkuperäinen Ground Truth -muotoilu säilyy tässä tietueessa (Rule 12).
typos_corrected_list:
  - "pätövien sähköisten attribuuttitodistusten → pätevien (EUDI-luku)"
  - "Niistä muuttuu → Niistä tulee (Yhteenveto)"
  - "tismalleen → täsmälleen (PRV-2-kohta)"
claims_checked: 2026-09-30
sources:
  - title: "European Digital Identity Wallet — Architecture and Reference Framework (ARF)"
    authors: "European Commission and European Digital Identity Cooperation Group"
    year: 2026
    venue: "eu-digital-identity-wallet (GitHub)"
    url: https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework
    type: standard
  - title: "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act)"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union"
    url: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
    type: regulation
  - title: "Assessment List for Trustworthy Artificial Intelligence (ALTAI) for self-assessment"
    authors: "High-Level Expert Group on Artificial Intelligence"
    year: 2020
    venue: "European Commission"
    url: https://digital-strategy.ec.europa.eu/en/library/assessment-list-trustworthy-artificial-intelligence-altai-self-assessment
    type: standard
  - title: "Interoperable Architecture for Digital Identity Delegation for AI Agents with Blockchain Integration"
    authors: "Saavedra, D. R."
    year: 2026
    venue: "arXiv"
    url: https://arxiv.org/abs/2601.14982
    type: academic
  - title: "AIP: Agent Identity Protocol for Verifiable Delegation Across MCP and A2A"
    authors: "Prakash, S."
    year: 2026
    venue: "arXiv"
    url: https://arxiv.org/abs/2603.24775
    type: academic
---

# Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0: Ihmisen perusidentiteetti tekoälyagentin valtuuttajana

Blogi 11/12 · DWS IQ & Lifetime World Model · 8. elokuuta 2026 · Risto Anton Päärni

## Johdanto: Sisäisestä SSO-kirjautumisesta EU-tason juridiseen identiteettiin

Sarjan edellisissä osissa määrittelimme, miten tekoälyagentteja hallitaan KYA-S1 v1.3 -turvallisuusstandardilla, atomisilla Lease Tokeneilla (TRS-4), BPMN 2.0 -prosessimoottorilla sekä autonomisilla Agentic Commerce -maksusopimuksilla.

Koko tämän arkkitehtuurin kriittisin liitoskohta palautuu kuitenkin aina samaan peruskysymykseen: kuka ihminen on oikeudellisesti vastuussa tekoälyagentin teoista? Todennettava delegointi ihmiseltä agentille on tutkimuksessakin yhä ratkaisematon kysymys [4].

Teollisuudessa ja julkishallinnossa ei riitä, että agentin taustahenkilö todennetaan yrityksen sisäisellä Active Directory- tai SSO-kirjautumisella. Kun tekoälyagentti tekee juridisesti sitovia sopimuksia, tilauksia, viranomaisilmoituksia tai teollisuuden turvallisuuspäätöksiä organisaatiorajojen yli, sen valtuuttavan ihmisen identiteetin on oltava EU-tasoisesti todennettu ja juridisesti sitova.

Tässä päätösosassa ankkuroimme KYA-S1 v1.3 -spesifikaation EU:n digitaaliseen identiteettikehykseen (eIDAS 2.0 / EUDI Wallet).

## EUDI Wallet ja eIDAS 2.0: Virallinen identiteetti tekoälymaailmaan

EU:n digitaalisen identiteetin asetuksen (eIDAS 2.0) myötä jokaisen jäsenvaltion on tarjottava virallinen EUDI Wallet (European Digital Identity Wallet) jokaiselle sitä haluavalle EU-kansalaiselle, asukkaalle ja yritykselle [1]. Lompakko ei tarjoa ainoastaan vahvaa tunnistautumista, vaan se mahdollistaa pätevien sähköisten attribuuttitodistusten (QEAA, Qualified Electronic Attestations of Attributes) [1] esittämisen.

EUDI Walletin avulla ihmisjohtaja voi todentaa kiistattomasti:

- Virallisen henkilöllisyytensä ja kansalaisuutensa (eIDAS High -taso).
- Nimenkirjoitusoikeutensa tai edustusvastuunsa yrityksessä (kaupparekisteriasema).
- Viranomaismandaattinsa tai teollisen turvallisuussertifikaattinsa (esim. tietyn tehtaan pääkäyttöoikeus).

KYA-S1 v1.3 -standardi kytkee tämän ihmisen perusidentiteetin suoraan tekoälyagentin ajonaikaiseen suorituskykyyn.

## KYA-S1 IDV-1/2 -kytkentä EUDI Walletiin

```
[ Ihmisjohtaja (EUDI Wallet) ] ──(1. eIDAS 2.0 QEAA Allekirjoitus)──> [ KYA-S1 IDV Engine ]
                                                                             │
                                                                   (2. Generoi IDV-2 Sidoksen)
                                                                             │
[ DWS IQ Agenttisessio ] <──(3. Kryptografinen valtuutusmandaatti)───────────┘
   │
   ├── (Suorittaa tehtävän Lease Tokenilla TRS-4)
   │
   └── (Tallentaa eIDAS-varmennetun PRV-4-päätösjäljen World Modeliin)
```

**1. Reaaliaikainen tunnistus (IDV-1)**
Sessiota käynnistettäessä tai valtuutuksia nostettaessa KYA-S1 IDV Engine edellyttää ihmisjohtajalta EUDI Wallet -vahvistusta. Spesifikaation tavoite on, että tunnistautuminen kestää alle 30 sekuntia biometrinen elollisuustarkistus mukaan lukien.

**2. Kryptografinen sidos agenttiin (IDV-2)**
EUDI Walletin tuottama allekirjoitus ja QEAA-attribuuttitodistus sidotaan kryptografisesti agenttisessioon (IDV-2). Tämä sidos säilyy muuttumattomana, vaikka tehtävä ketjuuntuisi useiden tausta-agenttien välillä (agent-to-agent handoff). Agenttien väliset protokollat eivät itse todenna agentin identiteettiä, joten sidos on kannettava mukana [5].

**3. Välitön peruutuksen leviäminen (IDV-4)**
Jos ihmisjohtajan edustus- tai nimenkirjoitusoikeus peruutetaan viranomaisrekisterissä tai EUDI Walletissa, peruutus leviää KYA-AL-varmuustason puitteissa (KYA-AL3-tasolla alle 60 sekunnissa). KYA-S1 hätäjarru (TC4) mitätöi välittömästi kaikki kyseiseen ihmiseen sidotut aktiiviset Lease Tokenit (TRS-4).

## EU AI Act Artikla 14 (HIC) viranomaistasolla

EU AI Actin artikla 14 edellyttää, että ihmiset voivat valvoa korkean riskin tekoälyjärjestelmiä tehokkaasti [2]. Kutsumme tätä ihmisen johtamisvallaksi (Human-in-Command), EU:n tekoälyn korkean tason asiantuntijaryhmän termillä [3].

Ennen eIDAS 2.0 -integraatiota ihmisvalvonta oli usein vain sovellustason lokimerkintä (esim. "Käyttäjä Admin kuittasi varoituksen"). Tällainen loki on helppo kiistää oikeudessa.

Kytkemällä KYA-S1 ja EUDI Wallet toisiinsa artiklan 14 mukaisen valvonnan näytöstä tulee viranomaistasoisesti pitävää:

- **Kiistämätön hyväksyntä (PRV-4):** Kun ihminen kuittaa poikkeaman HIC Dashboardilta, hyväksyntä allekirjoitetaan eIDAS 2.0 -pätevällä sähköisellä allekirjoituksella (QES) [1].
- **Aukoton auditointijälki (PRV-2):** Lifetime World Modeliin kirjaantuu ihmisen virallinen eIDAS-identiteetti, annettu sanallinen perustelu, täsmälleen se näkymä, jonka ihminen näki kuitatessaan, sekä järjestelmän TRS-luottamustaso suoritushetkellä.

Oikeudellisessa tarkastelussa ei tarvitse arvailla, kuka nappia painoi: auditointiloki osoittaa täsmällisen luonnollisen henkilön virallisella EU-identiteetillä.

## Yhteenveto: Sarjan päätössynteesi

Tähän päättyy 12-osainen katsauksemme KYA-S1-spesifikaatioon, EU AI Actiin, BPMN 2.0 -prosessinohjaukseen ja DWS IQ -agentteihin.

Koko arkkitehtuuri muodostaa aukottoman ketjun:

1. **EUDI Wallet & eIDAS 2.0:** Ihmisen virallinen perusidentiteetti ja mandaatti.
2. **KYA-S1 v1.3 Specification:** Agentin ajonaikainen identiteetti (IDV), käyttäytymisrajat (BHM/REG), atomiset Lease Tokenit (TRS-4), fail-closed-suojaus (TRS-5) ja 72h virheattribuutio (FLT-4).
3. **BPMN 2.0 & HIC Dashboard:** Prosessin dynaaminen reititys luottamuspisteen mukaan automaatille tai ihmiselle.
4. **Lifetime World Model (LWM):** Muuttumaton tilarekisteri ja päätösten toistettavuus (PRV-2/4).
5. **Agentic Commerce:** Turvallinen, KYA-S1-suojattu autonominen maksuliikenne ja kaupankäynti.

Kun tämä kokonaisuus on paikoillaan, tekoälyagentit lakkaavat olemasta anonyymeja tietoturvariskejä. Niistä tulee Euroopan teollisuuden luotettava, suvereeni ja täysin ohjattavissa oleva suoritusporras.

## Katso sarjan muut osat

- **Osa 1:** Tunne agenttisi (KYA-S1) — Yksi allekirjoitettu sivu tekoälystä tietoturvakansiossa, joka koskee dataasi
- **Osa 2:** KYC:n vastine tekoälylle — Seitsemän kriittistä KYA-kysymystä
- **Osa 3:** EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita
- **Osa 4:** Agenttiluokat: Kehittäjän GitHub Copilot vs. teollisuuden DWS IQ -tausta-agentit
- **Osa 5:** KYA-S1 ja BPMN 2.0: Miten tekoälyagentin luottamustaso ohjaa teollisuusprosessia käytännössä?
- **Osa 6:** KYA-S1 v1.3 × BPMN 2.0: Atominen Lease Token, fail-closed ja rehellinen TRS-laskenta
- **Osa 7:** Kun jotain menee pieleen: 72 tunnin virheluokittelu (FLT) ja päätöksen toistaminen (PRV) käytännössä
- **Osa 8:** KYA-S1 Ekosysteemi & Tuotanto-Roadmap
- **Osa 9:** Lifetime World Model (LWM) — Globaali tilarekisteri ja muisti
- **Osa 10:** Agentic Commerce -protokollat & Autonomiset Maksut
- **Osa 11:** Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0

---

Risto Anton Päärni

Perustaja & toimitusjohtaja, Lifetime Oy

Päätoimittaja, Lifetime Scope Journal

## Lähteet

[1] European Commission and European Digital Identity Cooperation Group (2026). European Digital Identity Wallet — Architecture and Reference Framework (ARF). eu-digital-identity-wallet (GitHub). https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework

[2] European Parliament and Council of the European Union (2024). Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

[3] High-Level Expert Group on Artificial Intelligence (2020). Assessment List for Trustworthy Artificial Intelligence (ALTAI) for self-assessment. European Commission. https://digital-strategy.ec.europa.eu/en/library/assessment-list-trustworthy-artificial-intelligence-altai-self-assessment

[4] Saavedra, D. R. (2026). Interoperable Architecture for Digital Identity Delegation for AI Agents with Blockchain Integration. arXiv. https://arxiv.org/abs/2601.14982

[5] Prakash, S. (2026). AIP: Agent Identity Protocol for Verifiable Delegation Across MCP and A2A. arXiv. https://arxiv.org/abs/2603.24775
