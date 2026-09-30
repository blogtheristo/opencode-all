---
slug: kya-kyc-seven-questions.fi
title: "KYC:n vastine tekoälylle — Seitsemän kriittistä KYA-kysymystä"
series: "KYA-S1 -blogisarja"
part: 2
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
  Sarjan osa 2/12. Tämä FI-teksti on käännöspohja (Ground Truth) EN/SV/DE/FR-versioille.
  Kirjoitusvirheitä EI ole korjattu ilman HIC:n lupaa (Rule 12) — ks. typos-kenttä.
typos_corrected: >-
  Korjattu HIC:n päätöksellä 09.08.2026 ("korjaa typot"). Nämä ovat alkuperäinen →
  korjattu -parit; alkuperäinen Ground Truth -muotoilu säilyy tässä tietueessa (Rule 12).
typos_corrected_list:
  - "Pankkimailmasta → Pankkimaailmasta (Johdanto-otsikko)"
  - "eikä passiakansiota → eikä passia (Johdanto)"
  - "7. Voidaanko replayed? → sekakielinen; jätetty HIC:n muotoiluun, ei korjattu (taulukko)"
claims_checked: 2026-09-30
sources:
  - title: "International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation — The FATF Recommendations (updated February 2025)"
    authors: "Financial Action Task Force (FATF)"
    year: 2025
    venue: "FATF"
    url: https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html
    type: standard
  - title: "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection"
    authors: "Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., Fritz, M."
    year: 2023
    venue: "arXiv"
    url: https://arxiv.org/abs/2302.12173
    type: academic
  - title: "MCPTox: A Benchmark for Tool Poisoning Attack on Real-World MCP Servers"
    authors: "Wang, Z., Gao, Y., Wang, Y., Liu, S., Sun, H., Cheng, H., Shi, G., Du, H., Li, X."
    year: 2025
    venue: "arXiv"
    url: https://arxiv.org/abs/2508.14925
    type: academic
  - title: "Why Do Multi-Agent LLM Systems Fail?"
    authors: "Cemri, M., Pan, M. Z., Yang, S., et al."
    year: 2025
    venue: "arXiv"
    url: https://arxiv.org/abs/2503.13657
    type: academic
  - title: "Which Agent Causes Task Failures and When? On Automated Failure Attribution of LLM Multi-Agent Systems"
    authors: "Zhang, S., Yin, M., Zhang, J., et al."
    year: 2025
    venue: "ICML 2025 (PMLR 267); arXiv"
    url: https://arxiv.org/abs/2505.00212
    type: academic
  - title: "The Balkanization of Execution-Security Research for AI Coding Agents: Isolation, Access Control, and Time-of-Check-to-Time-of-Use Vulnerabilities"
    authors: "Rashidi, M."
    year: 2026
    venue: "arXiv"
    url: https://arxiv.org/abs/2607.05743
    type: academic
---

# KYC:n vastine tekoälylle — Seitsemän kriittistä KYA-kysymystä

Blogi 2/12 · DWS IQ & Lifetime World Model · 8. elokuuta 2026 · Risto Anton Päärni

## Johdanto: Pankkimaailmasta tekoälyautomaatioon

Rahoitusalalla tunnettu KYC-periaate (Know Your Customer) luotiin estämään väärinkäytökset, rahanpesu ja anonyymi toiminta finanssijärjestelmässä [1]. Kun tekoälyagentit astuvat teollisuusprosessien, tietokantojen ja transaktioiden suorittajiksi, yritykset kohtaavat saman haasteen kuin pankit aikoinaan:

> Miten voit luottaa toimijaan, jolla ei ole fyysistä kasvoa eikä passia?

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
Miten järjestelmä reagoi, jos agentti kaapataan käskynsiirrolla (prompt injection) [2] tai MCP-työkalumyrkytyksellä [3]? BHM-kontrolli vertaa agentin kutsuja historialliseen perustasoon ja leikkaa poikkeavat suorituspolut välittömästi.

**4. Miten koko agenttiketju pysäytetään sekunnissa? (TC4)**
Kun moniagenttijärjestelmässä tapahtuu poikkeama, virhe voi monistua sekunnin murto-osassa downstream-agenteille [4]. TC4-kontrolli (leash snap) katkaisee koko suoritusketjun ja mitätöi kaikki aktiiviset Lease Tokenit atomisesti.

**5. Kuka kantaa vastuun virhetilanteessa? (FLT)**
Sopimusriidoissa kulut syntyvät eipäs-juupas-väittelystä [5]. FLT-kontrolli (FLT-4) edellyttää allekirjoitettua virheattribuutiota 72 tunnissa tapauksen sulkemisesta viiteen kategoriaan: kielimallivirhe, sovelluslogiikkavirhe, integraatiovirhe, ihmisen syötevirhe vai konfiguraatiovirhe.

**6. Onko suorituslupa atomisesti voimassa juuri nyt? (TRS)**
Perinteinen luottamustarkistus tekee tarkistuksen hetkellä T1 ja ajaa koodin hetkellä T2, mikä jättää auki race condition -aukon (TOCTOU) [6]. KYA-S1 TRS-4 edellyttää, että valtuutus siirretään kertakäyttöisessä Lease Tokenissa, joka kulutetaan atomisesti suorituksen alussa.

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

## Lähteet

[1] Financial Action Task Force (FATF) (2025). International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation — The FATF Recommendations (updated February 2025). FATF. https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html

[2] Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., Fritz, M. (2023). Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection. arXiv. https://arxiv.org/abs/2302.12173

[3] Wang, Z., Gao, Y., Wang, Y., Liu, S., Sun, H., Cheng, H., Shi, G., Du, H., Li, X. (2025). MCPTox: A Benchmark for Tool Poisoning Attack on Real-World MCP Servers. arXiv. https://arxiv.org/abs/2508.14925

[4] Cemri, M., Pan, M. Z., Yang, S., et al. (2025). Why Do Multi-Agent LLM Systems Fail?. arXiv. https://arxiv.org/abs/2503.13657

[5] Zhang, S., Yin, M., Zhang, J., et al. (2025). Which Agent Causes Task Failures and When? On Automated Failure Attribution of LLM Multi-Agent Systems. ICML 2025 (PMLR 267); arXiv. https://arxiv.org/abs/2505.00212

[6] Rashidi, M. (2026). The Balkanization of Execution-Security Research for AI Coding Agents: Isolation, Access Control, and Time-of-Check-to-Time-of-Use Vulnerabilities. arXiv. https://arxiv.org/abs/2607.05743
