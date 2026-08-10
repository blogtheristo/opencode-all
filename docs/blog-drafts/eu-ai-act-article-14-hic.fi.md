---
slug: eu-ai-act-article-14-hic.fi
title: "EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita"
series: "KYA-S1 -blogisarja"
part: 3
parts_total: 12
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
hero_image: ../static/images/blog/kya-s1-series-01-hero-fi.png
hero_image_alt: "Sarjakartta: KYA-S1 -blogisarjan 12 osaa"
Status: APPROVED
approved_by: HIC (Risto Anton Päärni), 09.08.2026 — kanoninen Ground Truth -teksti; osan 3 nimi lukittu
source: HIC-kirjoittama Ground Truth. Teksti tallennettu sanatarkasti; ei agentin uudelleenkirjoitusta.
note: >-
  Sarjan osa 3/12. Pohjautuu HIC-hallintamalliin, päivitetty kytkeytymään suoraan
  artiklaan 14, Lease Tokeniin ja KYA-S1-spesifikaatioon. Aiempi luonnos
  docs/blog-drafts/hic-hallintamalli-ja-dws-iq-agentit.md on eri aihe ja jää talteen (Rule 12).
typos_flagged:
  - "Heti kun poikkeama havaitaan → Heti kun (Yhteenveto)"
---

# EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita

Blogi 3/12 · DWS IQ & Lifetime World Model · 8. elokuuta 2026 · Risto Anton Päärni

## Johdanto: Autonomia vs. lakisääteinen valvonta

EU AI Act asettaa korkean riskin tekoälyjärjestelmille ja autonomisille agenteille yhden tiukan ehdon: **Artikla 14** edellyttää vaikuttavaa ihmisen valvontaa (Human-in-Command, HIC). Ihmisellä on oltava kyky ymmärtää järjestelmän tila, valvoa sen toimintaa ja tarvittaessa kumota tai keskeyttää päätös reaaliaikaisesti.

Tästä syntyy arkkitehtuurinen ristiriita. Tekoälyagenttien suurin hyöty perustuu niiden kykyyn toimittaa monivaiheisia prosessiketjuja millisekuntiluokassa ilman ihmisen manuaalista väliintuloa. Jos ihminen joutuu kuittaamaan jokaisen API-kutsun, automaatioaste romahtaa nollaan ja järjestelmästä tulee käyttökelvoton.

> Miten yhdistetään korkea autonomian suorituskyky ja lain edellyttämä Human-in-Command -johtajuus ilman, että ihmisestä tulee prosessin pullonkaula?

## Ratkaisu: Dynamiikka ja KYA-S1 TRS-reititys

Kiertämällä kiinteät käyttöoikeudet dynaamisella luottamustasolla (TRS) ristiriita ratkeaa ohjelmistoarkkitehtuurin tasolla. Prosessimoottorissa (kuten BPMN 2.0) agentille ei anneta sokeaa 100 % valtuutusta, vaan jokainen työvaihe reititetään ajonaikaisen luottamustason perusteella.

```
[ BPMN Service Task ] ──(1. Pre-check)──> [ KYA-S1 Trust Engine ]
                                                   │
                                          (2. Laskee TRS & myöntää Tokenin)
                                                   │
[ BPMN XOR Gateway ] <──(3. Palauttaa TRS: 0-100)──┘
   │
   ├── (JOS TRS >= TRS_req & Token validi) ──> [ Automaattisuoritus ]
   │
   └── (JOS TRS < TRS_req tai Timeout)     ──> [ User Task: HIC Dashboard ]
```

**1. Automaattinen vihreä kaista (TRS >= TRS_req)**
Kun agentin taustahenkilön tunnistus (IDV) on voimassa, käyttäytyminen noudattaa perustasoa (BHM) ja järjestelmätoiminnot ovat normaaleja, TRS ylittää tehtäväkohtaisen riskikynnyksen (TRS_req). BPMN-moottori myöntää atomisen Lease Tokenin, ja DWS IQ -agentti ajaa tehtävän läpi millisekunnissa.

**2. Pehmeä siirto ihmiselle (TRS < TRS_req / fail-closed)**
Jos agentin luottamustaso laskee poikkeaman vuoksi, tai jos Trust Engine lakkaa vastaamasta (timeout > 500 ms), prosessi ei kaadu eikä aja väkisin. Se siirtyy pehmeästi ja turvallisesti ihmisoperaattorin hyväksyttäväksi (User Task) HIC Dashboardille (Single Pane of Glass).

## Näennäisen valvonnan estäminen (PRV-4)

EU AI Act kieltää näennäisen ihmisvalvonnan ("rubber-stamping"), jossa ihminen kuittaa varoituksen lukematta sitä. KYA-S1 v1.3 -spesifikaation PRV-4-kontrolli takaa valvonnan aitouden:

- **Pakollinen perustelu:** Ihmisoperaattorin kuittaessa poikkeaman hänen on annettava päätökselle tekstimuotoinen perustelu.
- **Henkilösidonnainen auditointijälki:** Ihmisen tekemä hyväksyntä, perustelu, aikaleima ja päätöksen hetkellä vallinnut TRS-tila tallennetaan kryptografisesti World Modeliin.
- **Aito Replay (PRV-2):** Auditor voi vuosien kuluttua tarkistaa, miksi ihminen ohitti automaatiovaroituksen ja kuka käskyyn antoi luvan.

## Yhteenveto

Artikla 14 ja agenttien autonomia eivät ole vastakohtia. KYA-S1 v1.3 -arkkitehtuurissa ihminen johtaa prosessia päällikkönä: kun olosuhteet ovat vihreällä, automaatio pyörii täydellä teholla. Heti kun poikkeama havaitaan, järjestelmä luovuttaa ohjauskapulan pehmeästi ihmiselle.

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
