---
slug: kya-kyc-seven-questions.fi
title: "KYC:n vastine tekoälylle — Seitsemän kriittistä KYA-kysymystä"
series: "KYA-S1 -blogisarja"
part: 2
parts_total: 11
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
Status: APPROVED
approved_by: HIC (Risto Anton Päärni), 09.08.2026 — kanoninen Ground Truth -teksti
source: HIC-kirjoittama Ground Truth. Teksti tallennettu sanatarkasti; ei agentin uudelleenkirjoitusta.
note: >-
  Sarjan osa 2/11. Tämä FI-teksti on käännöspohja (Ground Truth) EN/SV/DE/FR-versioille.
  Kirjoitusvirheitä EI ole korjattu ilman HIC:n lupaa (Rule 12) — ks. typos-kenttä.
typos_flagged:
  - "Pankkimailmasta → Pankkimaailmasta (Johdanto-otsikko)"
  - "eikä passiakansiota → eikä passia kansiossa? (Johdanto)"
  - "7. Voidaanko replayed? → sekakielinen; esim. 'Voiko päätöksen toistaa?' (taulukko)"
---

# KYC:n vastine tekoälylle — Seitsemän kriittistä KYA-kysymystä

Blogi 2/11 · DWS IQ & Lifetime World Model · 8. elokuuta 2026 · Risto Anton Päärni

## Johdanto: Pankkimailmasta tekoälyautomaatioon

Rahoitusalalla tunnettu KYC-periaate (Know Your Customer) luotiin estämään väärinkäytökset, rahanpesu ja anonyymi toiminta finanssijärjestelmässä. Kun tekoälyagentit astuvat teollisuusprosessien, tietokantojen ja transaktioiden suorittajiksi, yritykset kohtaavat saman haasteen kuin pankit aikoinaan:

> Miten voit luottaa toimijaan, jolla ei ole fyysistä kasvoa eikä passiakansiota?

KYA-S1 Specification v1.3 siirtää KYC-periaatteen tekoälymaailmaan. Se esittää seitsemän kriittistä KYA-kysymystä, joihin jokaisen organisaation tietoturva- ja hankintajohdon on saatava todennettu vastaus ennen kuin agentti päästetään ajoon.

## Seitsemän KYA-kysymystä ja KYA-S1-kontrollit

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      SEITSEMÄN KYA-KYSYMYSTÄ                            │
├──────────────────────────┬──────────────────────────────────────────────┤
│ Kysymys                  │ KYA-S1 v1.3 -kontrolli                       │
├──────────────────────────┼──────────────────────────────────────────────┤
│ 1. Kuka vastaa?          │ IDV — Verified Human Principal Binding       │
│ 2. Mitkä ovat rajat?     │ REG — Capability Manifest                    │
│ 3. Miten se käyttäytyy?  │ BHM — Behavioral Modeling & Guardrails       │
│ 4. Miten se pysäytetään? │ TC4 — Chain Termination (Leash Snap)         │
│ 5. Kuka maksaa virheen?  │ FLT — Bounded Fault Attribution (72h)        │
│ 6. Onko lupa voimassa?   │ TRS — Atomic Lease Token (TRS-4)             │
│ 7. Voidaanko replayed?   │ PRV — Decision & Human Provenance (PRV-4)    │
└──────────────────────────┴──────────────────────────────────────────────┘
```

**1. Kuka kantaa lopullisen oikeudellisen vastuun? (IDV)**
Agentti ei ole oikeushenkilö. Jokainen agenttisessio ja työkaluvaatimus on sidottava kryptografisesti todennettuun ihmisjohtajaan (IDV-1/2). Jos agentti tekee virheen, auditointijälki osoittaa välittömästi sen ihmisen, jonka mandaatilla agentti toimi.

**2. Onko agentin toimivalta määritelty ennen ajoa? (REG)**
Agentti ei saa toimia "katsoakseen mitä tapahtuu". Sille on ilmoitettava ennen aktivointia laadittu kyvykkyysmanifesti (REG-2), joka määrittelee sallitut työkalut, API-osoitteet ja lukuoikeudet. Kaikki manifestin ulkopuoliset kutsut estetään ajonaikaisesti.

**3. Miten agentin poikkeava käyttäytyminen tunnistetaan? (BHM)**
Miten järjestelmä reagoi, jos agentti kaapataan käskynsiirrolla (prompt injection) tai MCP-työkalumyrkytyksellä? BHM-kontrolli vertaa agentin kutsuja historialliseen perustasoon ja leikkaa poikkeavat suorituspolut välittömästi.

**4. Miten koko agenttiketju pysäytetään sekunnissa? (TC4)**
Kun moniagenttijärjestelmässä tapahtuu poikkeama, virhe voi monistua sekunnin murto-osassa downstream-agenteille. TC4-kontrolli (leash snap) katkaisee koko suoritusketjun ja mitätöi kaikki aktiiviset Lease Tokenit atomisesti.

**5. Kuka kantaa vastuun virhetilanteessa? (FLT)**
Sopimusriidoissa kulut syntyvät eipäs-juupas-väittelystä. FLT-kontrolli (FLT-4) edellyttää allekirjoitettua virheattribuutiota 72 tunnissa tapauksen sulkemisesta viiteen kategoriaan: kielimallivirhe, sovelluslogiikkavirhe, integraatiovirhe, ihmisen syötevirhe vai konfiguraatiovirhe.

**6. Onko suorituslupa atomisesti voimassa juuri nyt? (TRS)**
Perinteinen luottamustarkistus tekee tarkistuksen hetkellä T1 ja ajaa koodin hetkellä T2, mikä jättää auki race condition -aukon. KYA-S1 TRS-4 edellyttää, että valtuutus siirretään kertakäyttöisessä Lease Tokenissa, joka kulutetaan atomisesti suorituksen alussa.

**7. Voidaanko päätös rekonstruoida kahden vuoden kuluttua? (PRV)**
Auditoijan pyytäessä selvitystä järjestelmän on pystyttävä toistamaan päätöksentekoketju (PRV-2/4) täsmälleen samoilla syötteillä, malliversioilla ja ihmisohjauksen kuittauksilla kuin suoritushetkellä.

## Yhteenveto

Kyselemällä nämä seitsemän kysymystä organisaatio siirtyy sokeasta luottamuksesta todennettuun turvallisuusarkkitehtuuriin. KYA-S1 v1.3 muuttaa KYA-kysymykset laadullisista toiveista teknisiksi, auditoitaviksi suoritusrajoiksi.

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
