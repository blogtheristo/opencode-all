# Comparison: external DGX / Independent Ontology sketch vs the repository

---

VERSION AND AGENT HISTORY

- Version: 1.3
- Status: DRAFT — comparison only; decisions only where the HIC has made them
- Document type: Gap analysis
- Author: Claude Code (standby runtime) + risto.paarni2024@lifetime.fi
- Date: 2026-09-24
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/blissful-davinci-8782wy

Sessions & Modifications:

- Version: 1.3 [Latest] | Tool: Claude Code | Date: 27.09.2026 | Changes: HIC decision: H9 DGX Runtime Bundle and H10 Air-gapped Sovereign Runtime move from Taso 3 to Taso 2 (approved to the roadmap). H10 Päätös Avoin → Backlog. §3 updated.
- Version: 1.2 [not latest] | Tool: Claude Code | Date: 27.09.2026 | Changes: H3 Connector Marketplace: HIC decision recorded — stays Taso 3, architecture draft only, not on the roadmap.
- Version: 1.1 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: The HIC's method is applied: every observation is recorded as Luonnos ehdottaa / Repossa / Mahdollinen täydennys / Päätös, with a level (Taso 1 implemented in the repo, Taso 2 approved to the roadmap, Taso 3 architecture sketch). Only the HIC's own decisions are filled in; the rest are Avoin (HIC). §6 truth check unchanged.
- Version: 1.0 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: The HIC shared two sketches written outside the repo: the DGX reference architecture (four layers, connectors, PWA, air-gapped bundle) and the Aegis + Independent Ontology layering. Per the HIC they are assisting drafts, not a new architecture, and they do not replace the current Aegis implementation. This document compares them with the repository and lists possible complements.

Related Documents:

- `docs/specs/2026-09-24-independent-ontology-sovereignty-requirement.md` — the decided sovereignty principle (air-gapped, customer-owned model)
- `docs/plans/2026-09-24-decision-journey-outcome-evidence.md` — Decision Journey (migrations 092/093)
- `docs/DEPLOYMENT_ARCHITECTURE_ENTERPRISE.md`, `Store/PRODUCT_AEGIS.md`

---

## 1. Menetelmä (HIC, 24.09.2026)

- **Repository = totuuden lähde. Arkkitehtuuriluonnokset = ajattelun ja kehityksen lähde.** Luonnoksesta ei tule vaatimusta vahingossa: se pysyy hypoteesina, kunnes siitä tehdään tietoinen päätös.
- Jokainen havainto kirjataan muodossa: **Luonnos ehdottaa** / **Repossa** / **Mahdollinen täydennys** / **Päätös** (Ei muutosta / Backlog / Toteutetaan / Suljettu / Avoin).
- Jokaisella havainnolla on taso:
  - **Taso 1:** toteutettu repossa
  - **Taso 2:** hyväksytty roadmapiin
  - **Taso 3:** arkkitehtuuriluonnos
- Päätöskenttään kirjataan vain HIC:n tekemät päätökset. Muut ovat "Avoin (HIC)".

## 2. Havainnot

| #   | Luonnos ehdottaa                                                                     | Repossa                                                                                                                                                                                                                                                                                                           | Mahdollinen täydennys                                                             | Päätös                                          | Taso                                 |
| --- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------ |
| H1  | **Ontology Core:** käsitteet, suhteet, taksonomiat, versiot                          | `ontology/README.md` kuvaa 25 toimialan tiedostot (`ontology/industries/`), mutta niitä **ei ole repossa**; vain yritysrekisteri (`ontology/enterprises/`).                                                                                                                                                       | Tiedostot repoon versioluettelon kanssa, tai viittaus niiden sijaintiin (ks. §3). | Avoin (HIC)                                     | 1 osittain                           |
| H2  | **Import/export ja offline-päivityspaketti**                                         | Ei työkalua. Suvereniteettispeksi vaatii offline-tuotavat päivitykset ja listaa paketoinnin, eheystarkistuksen ja allekirjoituksen avoimeksi.                                                                                                                                                                     | Allekirjoitettu päivityspaketti.                                                  | Avoin (HIC)                                     | 2                                    |
| H3  | **Connector API ja erilliset connector-paketit ("Connector Marketplace")**           | ERP-liittimet (SAP, IFS, Dynamics 365, Visma, Jeeves, Monitor) ovat `src/integrations/erp/`-hakemistossa sovelluksen sisällä ja riippuvat Supabasesta. M365-, ServiceNow-, Snowflake- ja MQTT-koodia ei löytynyt.                                                                                                 | Liittimet paketeiksi API:n taakse ilman Supabase-riippuvuutta.                    | **Ei muutosta** — vain luonnos (HIC 27.09.2026) | 3                                    |
| H4  | **Decision Journey Bridge**                                                          | 092 + 093 toteutettu, 32 + 20 PASS paikallisesti, ei ajettu Supabaseen.                                                                                                                                                                                                                                           | Ei tarvetta.                                                                      | **Suljettu** (HIC)                              | 1                                    |
| H5  | **Decision Flight Recorder** (päätöskerros)                                          | Toteutettu migraatioina 092/093; odottaa ajoa testiprojektiin (P1) ja M1:tä.                                                                                                                                                                                                                                      | Ei luonnoksen kautta; etenee M1–M3-polulla.                                       | Siirtymässä tasolta 2 tasolle 1 (HIC)           | 2 → 1                                |
| H6  | **Päätöskerros tavallisella Postgresilla** (air-gapped)                              | 092/093 vaativat Supabasen auth- ja roolikorvikkeet, neljä viitattua taulua ja pg_cron-ajon.                                                                                                                                                                                                                      | Plain-Postgres-profiili 080/092/093:lle.                                          | Avoin (HIC)                                     | 3                                    |
| H7  | **Valinnainen AI-kerros** (paikallinen LLM, OpenAI, Azure OpenAI, Foundry)           | Paikalliset mallit Ollamalla DGX:llä (`ollama-spark`, DGX-first). Azure OpenAI:lle ja Foundrylle ei ole omaa provideria; vain OpenAI-yhteensopiva reitti.                                                                                                                                                         | Provider-merkintä tarvittaessa.                                                   | Avoin (HIC)                                     | 1 (paikallinen) / 3 (Azure, Foundry) |
| H8  | **Responsiivinen web-UI ja PWA**                                                     | PWA vain Firehorse-dashboardille; ontologian selaus- tai muokkausnäkymää ei löytynyt.                                                                                                                                                                                                                             | Ontologianäkymä PWA:na.                                                           | Avoin (HIC)                                     | 3                                    |
| H9  | **Air-gapped Delivery Bundle / DGX Runtime Bundle** (Docker, Podman, Kubernetes, VM) | Docker Compose DGX:lle on olemassa. Kubernetes/Helm-tiedostoja ei löytynyt; `Store/PRODUCT_AEGIS.md` kuvaa Aegis Helm -chartin, jota ei ole repossa. Self-hosted Supabase -overlayta ei ole ajettu laitteistolla.                                                                                                 | Deployment target tulevaan releaseen.                                             | **Backlog** (HIC); tasolle 2 (HIC 27.09.2026)   | 3 → 2                                |
| H10 | **Air-gapped Sovereign Runtime**                                                     | Estävät pilviriippuvuudet on listattu kohdassa 2.1.                                                                                                                                                                                                                                                               | Offline-vastine tai "ei käytössä air-gapped-tilassa" -lippu per riippuvuus.       | **Backlog** — tasolle 2 (HIC 27.09.2026)        | 3 → 2                                |
| H11 | **Aegis tuottaa havaintoja ontologiaan**                                             | Aegis tuottaa compliance-, suvereniteetti- ja orbital-tuloksia sekä audit-merkintöjä, ei "havaintoja". "Observations" tarkoittaa repossa DISCOVER-verkkosivutaulua. Aegis kirjaa DGX:n omaan Postgresiin, Decision Journey Supabaseen: kaksi eri tamper-evidence-mallia. Aegis kattaa 21 toimialaa, ontologia 25. | Adapteri Aegisin tuloksista ontologian käsitteisiin, **Aegisia muuttamatta**.     | Avoin (HIC). Tuotteet pysyvät erillisinä (HIC). | 3                                    |

### 2.1 Pilviriippuvuudet, jotka estävät air-gapped-toimituksen tänään (Repossa, H10)

- Supabase Cloud, joka on oletustietokanta.
- Cloudflare: DGX-tunneli ja DISCOVER-vastaanoton Pages Function.
- Claude API, jolla ontologia generoidaan; Groq ja Gemini mallitarjoajina.
- Scaleway- ja UpCloud-hosting.
- Konttikuvat ghcr.io:sta, mcr.microsoft.comista ja Docker Hubista; käyttöönotto SSH:lla ja git pullilla.
- ICEYE, Shufti Pro ja Resend.

## 3. Tasot yhteenvetona

| Taso                    | Havainnot                                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Toteutettu repossa    | H4 Decision Journey Bridge; H7 paikallinen LLM; H1 osittain (vain yritysrekisteri)                                                                                        |
| 2 Hyväksytty roadmapiin | H5 Decision Flight Recorder (siirtymässä tasolle 1); H2 offline-päivitys (suvereniteettispeksi); H9 DGX Runtime Bundle, H10 Air-gapped Sovereign Runtime (HIC 27.09.2026) |
| 3 Arkkitehtuuriluonnos  | H3 Connector Marketplace, H6, H7 Azure/Foundry, H8, H11                                                                                                                   |

## 4. Johdonmukaisuus tehtyjen päätösten kanssa

- **Suvereniteettiperiaate** (speksi 24.09.2026) on päätetty periaate. Sen toteutusosat (H2, H9, H10) eivät silti ole toteutettuja, vaan tasolla 2 tai 3.
- **Ei uusia ominaisuuksia ennen M1:tä** (HIC 24.09.2026). Tasolta 3 ei nosteta mitään toteutukseen ennen M1:tä ilman HIC:n päätöstä.
- **Aegis pysyy ennallaan**, ja tuotteet pysyvät erillisinä ("Tässä kohtaa en yhdistäisi Aegista Independent Ontologyyn tuotteena").

## 6. Truth check on live copy (24.09.2026)

The live product page says the ontology "is delivered as versioned artefacts". The industry files the ontology README describes (`ontology/industries/01-…25-…json`) are **not in the repository**, and neither is a script that generates them (checked: not gitignored, no generator in `scripts/` or `Firehorse/`). If the files exist elsewhere (for example on the DGX or in Drive), they should be committed or referenced by a manifest with versions. That is the evidence behind the published claim. If they do not exist yet, the claim should be worded as future ("toimitetaan") or held.
