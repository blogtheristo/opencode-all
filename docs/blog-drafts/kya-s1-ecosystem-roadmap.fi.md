---
slug: kya-s1-ecosystem-roadmap.fi
title: "KYA-S1 Ekosysteemi & Tuotanto-Roadmap"
series: "KYA-S1 -blogisarja"
part: 8
parts_total: 12
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
Status: APPROVED
approved_by: HIC (Risto Anton Päärni), 09.08.2026 — kanoninen Ground Truth -teksti
source: HIC-kirjoittama Ground Truth. Teksti tallennettu sanatarkasti; ei agentin uudelleenkirjoitusta.
note: >-
  Sarjan osa 8/12. Tämä FI-teksti on käännöspohja (Ground Truth) EN/SV/DE/FR-versioille.
  Laajennusalueiden tasokohtaiset vaatimukset vastaavat Legal/KYA_S1.md v1.5 §8:n
  laajennusaluetaulukkoa (PRV-replay 30 pv / 7 pv / 24 h; FLT-4 30 pv / 10 pv / 72 h).
typos_flagged:
  - "ostajan työkalu → ostajan työkalu? (Johdanto)"
---

# KYA-S1 Ekosysteemi & Tuotanto-Roadmap

Blogi 8/12 · DWS IQ & Lifetime World Model · 8. elokuuta 2026 · Risto Anton Päärni

## Johdanto: Koodista organisaation arkeen

Sarjan edellisissä osissa rakensimme teknisen ja ohjelmistotason pohjan tekoälyagenttien hallinnalle: kytkimme KYA-S1 v1.3 -spesifikaation atomisilla Lease Tokeneilla (TRS-4) ja fail-closed-pakkosuojauksella (TRS-5) suoraan BPMN 2.0 -prosessimoottoriin ja HIC-dashboardiin.

Kysymys kuuluu nyt: miten tämä malli tuodaan kooditasolta osaksi organisaation hankintaa, toimittajahallintaa ja tuotanto-roadmapia?

KYA-S1 v1.3 ei ole vain tekninen protokolla, vaan se on ostajan työkalu toimittajahallintaan. Tässä osassa kuvaamme, miten KYA-S1 Specification v1.3 otetaan käyttöön vaiheittain teollisuuden virallisilla KYA-AL-varmuustasoilla.

## Teollisuuden KYA-AL-varmuustasot (Assurance Levels)

Tekoälyagenttien hallintaa ei tarvitse — eikä voi — rakentaa hetkessä täydelliseksi. KYA-S1 §8 määrittelee kolme KYA-AL-varmuustasoa (KYA-AL1 Standard, KYA-AL2 Enhanced ja KYA-AL3 Critical), jotka muodostavat luontevan roadmapin organisaatiotasoiselle käyttöönotolle:

| Varmuustaso            | Auditointitiheys       | Todisteiden vaadittu syvyys                                          | SLA-reagointi (IDV & TC4) | PRV-replay saatavuus |
| ---------------------- | ---------------------- | -------------------------------------------------------------------- | ------------------------- | -------------------- |
| **KYA-AL1 (Standard)** | Vuotuinen auditointi   | 3. osapuolen auditointi min. 1 alueella + allekirjoitettu telemetria | max 15 minuuttia          | 30 päivää            |
| **KYA-AL2 (Enhanced)** | Neljännesvuosittainen  | Auditointi IDV- ja BHM-alueilla + 12 kk allekirjoitettu telemetria   | max 5 minuuttia           | 7 päivää             |
| **KYA-AL3 (Critical)** | Jatkuva reaaliaikainen | Ulkopuolinen arvioija kaikilla 7 alueella + allekirjoitettu SLA      | max 60 sekuntia           | 24 tuntia            |

### Laajennusalueiden (TRS, PRV, FLT) tasokohtaiset vaatimukset

- **PRV-replay-saatavuus (päätöksen toistettavuus):** KYA-AL1 30 päivää, KYA-AL2 7 päivää, KYA-AL3 24 tuntia.
- **FLT-alustava virheattribuutio (FLT-4):** KYA-AL1 30 päivää havaitsemisesta, KYA-AL2 10 päivää, KYA-AL3 72 tuntia.
- **TRS-pisteen voimassaoloaika ja timeout (TRS-1/5):** Dokumentoitava ja riippumattoman arvioijan vahvistama jokaisella tasolla.

## Itsearvioinnin täysikielto (§3 Evidence Meta-Rule)

Toimittajahallinnassa suurin heikkous on itsearviointi (self-attestation). KYA-S1-spesifikaation §3 kieltää itsearvioinnin ehdottomasti:

> **Ehdoton sääntö (§3):** Itsearviointi ei ole hyväksyttävä todiste KYA-S1-yhteensopivuudesta. Paperi on täsmälleen niin arvokas kuin sen toisella allekirjoitusrivillä oleva nimi.

Hyväksyttäväksi todisteeksi kelpaa ainoastaan akkreditoidun kolmannen osapuolen auditointiraportti tai kryptografisesti varmennettu alustatelemetria, jota säilytetään muuttamattomassa lokirekisterissä.

Tämä sääntö sitoo yhtäläisesti myös spesifikaation laatijaa: Lifetime Oy ei myönnä KYA-S1-sertifikaattia omalle DWS IQ -alustalleen ennen kuin riippumaton, ulkopuolinen arvioija on sen allekirjoittanut.

## KYA-S1 osana yrityksen tietoturvakansiota

Sijoittuessaan yrityksen hankintaprosessiin KYA-S1 ei korvaa olemassa olevia standardeja, vaan täyttää aukon, jota muut järjestelmät eivät kata:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ORGANISAATION HANKINTAKANSIO                    │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Taso                     │ Standardit ja dokumentit                    │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Organisaatio             │ SOC 2 Type 2, ISO/IEC 27001                 │
│ AI-hallintajärjestelmä   │ ISO/IEC 42001                               │
│ Alusta / Infrastruktuuri │ FedRAMP, DISA IL5/IL6                       │
│ Data                     │ GDPR, CSRD-todisteet, ISO/IEC 27701         │
│ Ohjelmistoketju (Supply) │ SBOM-regiimit, MA-S2                        │
├──────────────────────────┼─────────────────────────────────────────────┤
│ AUTONOMINEN AGENTTI      │ KYA-S1 v1.3 (IDV, BHM, REG, TC4, FLT, TRS, PRV) │
└──────────────────────────┴─────────────────────────────────────────────┘
```

Standardit kuten SOC 2 tai ISO 27001 varmentavat organisaation prosessit. GDPR ja ISO 27701 varmentavat datan käsittelyn. KYA-S1 v1.3 on ainoa dokumentti, joka varmentaa autonomisen agentin ajonaikaisen identiteetin, toimintavaltuudet ja pika-ajoisen pysäyttämisen.

## Yhteenveto

- **Vaiheittainen roadmap:** Varmuustasot (KYA-AL1, KYA-AL2, KYA-AL3) mahdollistavat järjestelmän tuotantoonviennin asteittain kiristyvillä SLA-rajoilla.
- **Ei itsearviointia (§3):** KYA-S1-todistus edellyttää aina riippumattoman kolmannen osapuolen arviointia ja allekirjoitusta.
- **Tietoturvakansion uusi sivu:** KYA-S1 täyttää aukon, jota SOC 2 tai ISO 27001 eivät kata — autonomisen agentin ajonaikaisen käyttäytymisen.
- **Suora HIC-kytkentä:** Jokainen taso takaa aikarajoitetun reagoinnin (IDV/TC4) poikkeamatilanteissa.

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
