---
slug: agent-classes-copilot-vs-dws-iq.fi
title: "Agenttiluokat: Kehittäjän GitHub Copilot vs. teollisuuden DWS IQ -tausta-agentit"
series: "KYA-S1 -blogisarja"
part: 4
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
  Sarjan osa 4/12. Tämä FI-teksti on käännöspohja (Ground Truth) EN/SV/DE/FR-versioille.
claims_checked: 2026-09-30
sources:
  - title: "About GitHub Copilot cloud agent"
    authors: "GitHub"
    year: 2026
    venue: "GitHub Docs"
    url: "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent"
    type: industry
  - title: "About Copilot automations"
    authors: "GitHub"
    year: 2026
    venue: "GitHub Docs"
    url: "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-automations"
    type: industry
  - title: "Application card: GitHub Copilot Agents"
    authors: "GitHub"
    year: 2026
    venue: "GitHub Docs (Responsible use)"
    url: "https://docs.github.com/en/copilot/responsible-use/agents"
    type: industry
  - title: "AI Agents vs. Agentic AI: A Conceptual Taxonomy, Applications and Challenges"
    authors: "Sapkota, R.; Roumeliotis, K. I.; Karkee, M."
    year: 2025
    venue: "arXiv:2505.10468"
    url: "https://arxiv.org/abs/2505.10468"
    type: academic
  - title: "Regulating AI Agents"
    authors: "Gardhouse, K.; Oueslati, A.; Kolt, N."
    year: 2026
    venue: "arXiv:2603.23471"
    url: "https://arxiv.org/abs/2603.23471"
    type: academic
  - title: "Regulation (EU) 2024/1689 (Artificial Intelligence Act), Articles 12, 14 and 50"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union"
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
    type: regulation
---

# Agenttiluokat: Kehittäjän GitHub Copilot vs. teollisuuden DWS IQ -tausta-agentit

Blogi 4/12 · DWS IQ & Lifetime World Model · 8. elokuuta 2026 · Risto Anton Päärni

## Johdanto: Kaksi täysin eri tekoälymaailmaa

Sanaa "tekoälyagentti" käytetään nykyisin kaikesta mahdollisesta koodin täydennyksestä autonomisiin robottitehtaisiin [4][5]. Tämä hämärtää tietoturvan, johdon ja hankinnan tilannekuvaa.

Tekoälyagentit jakautuvat kahteen perustavanlaatuiseen agenttiluokkaan, joiden valvontatarve, ajoympäristö ja tietoturvariskit eroavat toisistaan täysin:

- **Kehittäjän avustaja** (Interactive Coding Agent): kuten GitHub Copilot tai Claude Code.
- **Teollisuuden tausta-agentti** (Industrial Background Agent): kuten DWS IQ Skilled Agents.

## Agenttiluokkien syvävertailu

| Ulottuvuus               | Kehittäjän avustaja (esim. Copilot)                                                                            | Teollisuuden tausta-agentti (DWS IQ)                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Ensisijainen rooli**   | Kehittäjän interaktiivinen pari IDE-ympäristössä                                                               | Teollisuuden & tietovarastojen taustasuorittaja            |
| **Toiminnan mittakaava** | Mikrotaso: ehdottaa koodia, ajaa paikallisia testejä                                                           | Makrotaso: suorittaa monivaiheisia liiketoimintaprosesseja |
| **Käynnistysmekanismi**  | Käyttäjän syöte (prompt/chat/PR/issue); pilviagentilla myös ajastetut ja tapahtumapohjaiset automaatiot [1][2] | Automaattinen työnkulku, cron, webhook, teollisuussignaali |
| **Ajoalusta**            | Ephemeral Action -sandbox, kehittäjän kone [1][3]                                                              | Suvereeni K8s (UpCloud / DGX Spark), Edge-laitteet         |
| **Ulostulo & artefakti** | Koodiehdotus, Draft PR, diffi                                                                                  | Ledger-Native: allekirjoitettu sääntelyartefakti + journal |
| **HIC-valvonta**         | IDE:ssä ihminen jokaisessa painalluksessa; pilviagentilla PR-katselmointi ennen mergeä [3]                     | KYA-S1-hallintakerros (Single Pane of Glass Dashboard)     |
| **Auditointitaso**       | Git-historia & commit-loki (allekirjoitetut commitit, linkki sessiolokiin) [3]                                 | EU AI Act Art. 12/14/50 [6] + KYA-AL3-telemetria           |

## Copilot-hallintamallin kopiointi DWS IQ -ympäristöön

GitHub Copilotin suurin arvo ei ole itse kielimallissa, vaan sen rakenneviitekehyksessä:

1. Työ syntyy näkyvänä työkorttina jonoon.
2. Työn tila ja välivaiheet ovat julkisia koko ajon ajan [1].
3. Mitään ei mergetä tuotantoon ilman ihmisen hyväksyntäporttia: agentti ei voi pushata suoraan päähaaraan, ja sen pull requestin käynnistämät Actions-työnkulut odottavat ihmisen hyväksyntää [3].

DWS IQ -alusta tuo tämän saman hallintamallin teollisuuden tausta-agentteihin. Ihminen toimii prosessin johtajana Single Pane of Glass -dashboardilla. Kun liiketoimintaprosessi käynnistyy, orkestroija-agentti (Atlas) reitittää työn erikoistuneille Skilled Agenteille (esim. Compliance Specialist, Material Oracle, SiteSense).

Sillä välillä kun agentit suorittavat tausta-ajoa, tilannekuva päivittyy livenä valvomoon. Kun prosessi kohtaa kriittisen tarkastuspisteen, se ei kirjoita tulosta tietokantaan ennen kuin ihminen kuittaa sen HIC Dashboardilta.

## Yhteenveto: Orkestroija ja soittimet

Kehittäjän avustaja ja teollisuusagentti eivät kilpaile keskenään. Kehittäjän avustaja auttaa ihmistä kirjoittamaan parempaa koodia ja ohjelmistoja. DWS IQ Skilled Agentit taas ovat niitä soittimia, jotka pyörittävät teollisuuden ja sääntelyn rutiineja taustalla 24/7 — KYA-S1-standardin aukottomassa valvonnassa.

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

[1] GitHub (2026). About GitHub Copilot cloud agent. GitHub Docs. https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent

[2] GitHub (2026). About Copilot automations. GitHub Docs. https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-automations

[3] GitHub (2026). Application card: GitHub Copilot Agents. GitHub Docs (Responsible use). https://docs.github.com/en/copilot/responsible-use/agents

[4] Sapkota, R., Roumeliotis, K. I. & Karkee, M. (2025). AI Agents vs. Agentic AI: A Conceptual Taxonomy, Applications and Challenges. arXiv:2505.10468. https://arxiv.org/abs/2505.10468

[5] Gardhouse, K., Oueslati, A. & Kolt, N. (2026). Regulating AI Agents. arXiv:2603.23471. https://arxiv.org/abs/2603.23471

[6] Euroopan parlamentti ja neuvosto (2024). Regulation (EU) 2024/1689 (Artificial Intelligence Act), artiklat 12, 14 ja 50. Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

---

Risto Anton Päärni

Perustaja & toimitusjohtaja, Lifetime Oy

Päätoimittaja, Lifetime Scope Journal
