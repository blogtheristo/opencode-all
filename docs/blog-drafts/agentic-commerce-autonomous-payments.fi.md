---
slug: agentic-commerce-autonomous-payments.fi
title: "Agentic Commerce -protokollat & Autonomiset Maksut"
series: "KYA-S1 -blogisarja"
part: 10
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
  Sarjan osa 10/12. Tämä FI-teksti on käännöspohja (Ground Truth) EN/SV/DE/FR-versioille.
typos_corrected: >-
  Korjattu HIC:n päätöksellä 09.08.2026 ("korjaa typot"). Nämä ovat alkuperäinen →
  korjattu -parit; alkuperäinen Ground Truth -muotoilu säilyy tässä tietueessa (Rule 12).
typos_corrected_list:
  - "Agentic Commergesta → Agentic Commercesta (Yhteenveto)"
claims_checked: 2026-09-30
sources:
  - title: "Agent Payments Protocol (AP2) — documentation and specification v0.2"
    authors: "Google Agentic Commerce / AP2 contributors"
    year: 2026
    venue: "GitHub (google-agentic-commerce/AP2)"
    url: "https://github.com/google-agentic-commerce/AP2"
    type: standard
  - title: "Agentic Commerce Protocol (ACP)"
    authors: "OpenAI; Stripe (maintainers)"
    year: 2026
    venue: "GitHub (agentic-commerce-protocol/agentic-commerce-protocol)"
    url: "https://github.com/agentic-commerce-protocol/agentic-commerce-protocol"
    type: standard
  - title: "API v2 overview — Idempotency"
    authors: "Stripe"
    year: 2026
    venue: "Stripe Docs"
    url: "https://docs.stripe.com/api-v2-overview"
    type: industry
  - title: "Zero-Trust Runtime Verification for Agentic Payment Protocols: Mitigating Replay and Context-Binding Failures in AP2"
    authors: "Lan, Q.; Kaul, A.; Jones, S.; Westrum, S."
    year: 2026
    venue: "arXiv:2602.06345"
    url: "https://arxiv.org/abs/2602.06345"
    type: academic
---

# Agentic Commerce -protokollat & Autonomiset Maksut

Blogi 10/12 · DWS IQ & Lifetime World Model · 8. elokuuta 2026 · Risto Anton Päärni

## Johdanto: Koodista taloudelliseen toimivaltaan

Sitä mukaa kun tekoälyagentit automatisoivat teollisuuden toimitusketjuja, ne siirtyvät tiedon lukemisesta ja analysoinnista taloudellisiin transaktioihin: ne tilaavat raaka-aine-eriä, varaavat rahtikapasiteettia, ostavat päästöoikeuksia ja maksavat pilvilaskennasta toisille agenteille (Agent-to-Agent Commerce).

Tämä avaa uuden riskiluokan. Jos agentti pääsee tekemään maksutransaktioita ilman atomista suojausta, seurauksena voi olla tuplaveloituksia, luvattomia hankintoja tai pahimmillaan agenttiketjun kaappaus rahavirtojen ohjaamiseksi ulkopuolisille tileille. Tutkimus AP2-protokollan mandaattien elinkaaresta osoittaa, että juuri uudelleenyritykset, rinnakkaisuus ja orkestrointi avaavat toisto- ja uudelleenohjaushyökkäyksille aukon, jota pelkkä allekirjoitus ja vanhenemisaika eivät sulje [4].

Agentic Commerce edellyttää protokollaa, joka yhdistää finanssivalvonnan, maksukynnykset ja KYA-S1 v1.3 -turvallisuusstandardin.

## Miten KYA-S1 suojaa autonomisen maksuliikenteen?

Finanssitransaktiot kuuluvat korkeimpaan vaikuttavuusluokkaan. KYA-S1 v1.3 -spesifikaatio suojaa Agentic Commerce -maksut neljällä atomisella mekanismilla:

```
[ DWS IQ Agent ] ──(Maksupyyntö $10,000)──> [ KYA-S1 Trust Engine ]
                                                   │
                                          (1. Tarkistaa Mandate Bandin)
                                          (2. Generoi Lease Tokenin)
                                                   │
[ Stripe / Bank API ] <──(3. consumeAndExecute)────┘
   │
   ├── (JOS Token Valid & Single-Use) ──> [ Transaktio Suoritettu ]
   │
   └── (JOS Token Expired / Re-used)  ──> [ HYLKÄYS & TC4 Alert ]
```

**1. Mandate Bands & maksurajat (TRS-1)**
Jokaiselle agentille määritellään valtuutusrajat toimivaltamanifestissa (REG-2). Esimerkiksi laadunvalvonta-agentti voi suorittaa itsenäisesti maksuja $5,000 asti, kun taas suuremmat maksut nostavat tehtävän vaatimustason kynnykselle TRS_req = 95, mikä edellyttää ihmisjohtajan kuittausta (HIC / Four-Eyes Principle).

**2. Kertakäyttöinen Lease Token (TRS-4)**
Kaksoisveloituksen (double-spending) ja kilpailutilanteiden (race condition) estämiseksi maksulupa myönnetään kryptografisesti allekirjoitettuna Lease Tokenina. KYA-S1-portti kuluttaa tokenin atomisella `consumeAndExecute`-operaatiolla juuri ennen kuin kutsu välitetään maksurajapintaan (esim. Stripe / pankki-API); maksurajapinnat itse eivät tunne KYA-tokeneita, vaan niiden oma suoja saman pyynnön toistumista vastaan on idempotenssiavain [3]. Token vanhenee 2 sekunnissa, eikä sitä voi käyttää kahdesti — sama kuluta-kerran-periaate, jota tutkimus pitää välttämättömänä toistohyökkäysten torjunnassa [4].

**3. Viiveetön mitätöinti hätäjarrulla (TC4)**
Jos agentin käyttäytymisessä havaitaan poikkeama kesken kaupankäynnin, KYA-S1 hätäjarru (TC4 leash snap) mitätöi välittömästi kaikki aktiiviset Lease Tokenit ennen kuin ne ehtivät maksurajapintaan. Yksikään kesken oleva transaktio ei pääse läpi.

**4. 72 tunnin kaupallinen virheattribuutio (FLT-4)**
Jos maksuprosessissa tapahtuu virhe (esim. virheellinen summa tai väärä toimittaja), KYA-S1 FLT-4-kontrolli tuottaa 72 tunnissa sitovan virheattribuution: oliko kyseessä toimittaja-agentin syöttämä virheellinen hinta (Integration Fault), DWS-agentin koodivirhe (Logic Fault) vai ihmisen antama virheellinen hankintamandaatti (Operator Fault).

## Yhteenveto

Autonominen kaupankäynti ei voi perustua luottokorttinumeron syöttämiseen agentin kontekstiin — myös alan omat protokollat kuljettavat allekirjoitettuja maksumandaatteja ja suojattuja maksutokeneita eivätkä kortin tietoja [1][2]. KYA-S1 v1.3 -standardi tekee Agentic Commercesta turvallista ja auditoitavaa muuttamalla jokaisen maksun atomisesti kulutettavaksi valtuutustapahtumaksi.

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

[1] Google Agentic Commerce / AP2 contributors (2026). Agent Payments Protocol (AP2) — documentation and specification v0.2. GitHub. https://github.com/google-agentic-commerce/AP2

[2] OpenAI & Stripe (2026). Agentic Commerce Protocol (ACP). GitHub. https://github.com/agentic-commerce-protocol/agentic-commerce-protocol

[3] Stripe (2026). API v2 overview — Idempotency. Stripe Docs. https://docs.stripe.com/api-v2-overview

[4] Lan, Q., Kaul, A., Jones, S. & Westrum, S. (2026). Zero-Trust Runtime Verification for Agentic Payment Protocols: Mitigating Replay and Context-Binding Failures in AP2. arXiv:2602.06345. https://arxiv.org/abs/2602.06345

---

Risto Anton Päärni

Perustaja & toimitusjohtaja, Lifetime Oy

Päätoimittaja, Lifetime Scope Journal
