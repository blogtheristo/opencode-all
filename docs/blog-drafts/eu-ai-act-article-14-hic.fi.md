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
Status: REAPPROVAL_NEEDED
reapproval_note: text corrected 30.09.2026 by external sourcing (BLOG_STANDARD §17); previously APPROVED. The published page is unchanged.
approved_by: HIC (Risto Anton Päärni), 09.08.2026 — kanoninen Ground Truth -teksti; osan 3 nimi lukittu
source: HIC-kirjoittama Ground Truth. Teksti tallennettu sanatarkasti; ei agentin uudelleenkirjoitusta.
note: >-
  Sarjan osa 3/12. Pohjautuu HIC-hallintamalliin, päivitetty kytkeytymään suoraan
  artiklaan 14, Lease Tokeniin ja KYA-S1-spesifikaatioon. Aiempi luonnos
  docs/blog-drafts/hic-hallintamalli-ja-dws-iq-agentit.md on eri aihe ja jää talteen (Rule 12).
typos_corrected: >-
  Korjattu HIC:n päätöksellä 09.08.2026 ("korjaa typot"). Nämä ovat alkuperäinen →
  korjattu -parit; alkuperäinen Ground Truth -muotoilu säilyy tässä tietueessa (Rule 12).
typos_corrected_list:
  - "Hti kun poikkeama havaitaan → Heti kun poikkeama havaitaan (Yhteenveto)"
claims_checked: 2026-09-30
claims_corrected: >-
  Lähdetarkistus 30.09.2026 (BLOG_STANDARD §17.2). Kolme väitettä korjattu minimaalisesti asetuksen
  (EU) 2024/1689 tekstin mukaan; alkuperäinen Ground Truth -muotoilu säilyy tässä tietueessa (Rule 12).
claims_corrected_list:
  - "EU AI Act asettaa korkean riskin tekoälyjärjestelmille ja autonomisille agenteille yhden tiukan ehdon → agenteille vain silloin, kun ne ovat korkean riskin järjestelmiä (Gardhouse ym. 2026)"
  - "tarvittaessa kumota tai keskeyttää päätös reaaliaikaisesti → ohittaa tai kumota päätös tai keskeyttää järjestelmä kesken toiminnan turvalliseen tilaan (art. 14(4)(d)–(e))"
  - "EU AI Act kieltää näennäisen ihmisvalvonnan → ei tyydy näennäiseen ihmisvalvontaan; asetus ei kiellä sitä sanatarkasti, vaan art. 14(4)(b) automaatiovinouma ja art. 26(2) pätevyys ja valtuudet"
sources:
  - title: "Regulation (EU) 2024/1689 (Artificial Intelligence Act), Articles 14 and 26"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union, L 2024/1689"
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
    type: regulation
  - title: "Regulating AI Agents"
    authors: "Gardhouse, K., Oueslati, A., Kolt, N."
    year: 2026
    venue: "arXiv"
    url: "https://arxiv.org/abs/2603.23471"
    type: academic
  - title: "The Off-Switch Game"
    authors: "Hadfield-Menell, D., Dragan, A., Abbeel, P., Russell, S."
    year: 2016
    venue: "arXiv (IJCAI 2017)"
    url: "https://arxiv.org/abs/1611.08219"
    type: academic
---

# EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita

Blogi 3/12 · DWS IQ & Lifetime World Model · 8. elokuuta 2026 · Risto Anton Päärni

## Johdanto: Autonomia vs. lakisääteinen valvonta

EU AI Act asettaa korkean riskin tekoälyjärjestelmille — ja autonomisille agenteille silloin, kun ne ovat korkean riskin järjestelmiä [2] — yhden tiukan ehdon: **Artikla 14** edellyttää vaikuttavaa ihmisen valvontaa (Human-in-Command, HIC). Ihmisellä on oltava kyky ymmärtää järjestelmän tila, valvoa sen toimintaa ja tarvittaessa ohittaa tai kumota päätös tai keskeyttää järjestelmä kesken toiminnan turvalliseen tilaan [1][3].

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

EU AI Act ei tyydy näennäiseen ihmisvalvontaan ("rubber-stamping"), jossa ihminen kuittaa varoituksen lukematta sitä: valvojan on pysyttävä tietoisena taipumuksesta luottaa järjestelmän tuotokseen liikaa (automaatiovinouma), ja valvonta on annettava henkilöille, joilla on tarvittava pätevyys, koulutus ja valtuudet [1]. KYA-S1 v1.3 -spesifikaation PRV-4-kontrolli takaa valvonnan aitouden:

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

## Lähteet

[1] Euroopan parlamentti ja neuvosto (2024). Asetus (EU) 2024/1689 (tekoälysäädös), artiklat 14 ja 26. Euroopan unionin virallinen lehti. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

[2] Gardhouse, K., Oueslati, A., Kolt, N. (2026). Regulating AI Agents. arXiv. https://arxiv.org/abs/2603.23471

[3] Hadfield-Menell, D., Dragan, A., Abbeel, P., Russell, S. (2016). The Off-Switch Game. arXiv (IJCAI 2017). https://arxiv.org/abs/1611.08219

---

Risto Anton Päärni

Perustaja & toimitusjohtaja, Lifetime Oy

Päätoimittaja, Lifetime Scope Journal
