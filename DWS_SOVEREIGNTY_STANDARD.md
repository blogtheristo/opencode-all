# DWS Sovereignty Standard

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/nordic-sales-strategy-1p5VB | Date: 15.02.2026 | Changes: Alkuperäinen DWS Sovereignty Standard — EU-datan suvereniteetti, NIS2/EU AI Act/GDPR/Cybersecurity Act -vaatimustenmukaisuus, MVP (Supabase) → V1 (EU-suvereeni) migraatiopolku, TK4-tutkimuskysymyksen vastaus
- Version: 1.1 | Tool: Claude Code | Session: claude/amazon-ses-google-drive | Date: 10.03.2026 | Changes: V1 Aiven plan decision — Developer + Startup; pricing update
- Version: 1.2 | Tool: Claude Code (Opus 4.7) | Session: claude/deployment-strategies-comparison-T5gcw | Date: 12.05.2026 | Changes: Added back-reference to `DWS_DEPLOYMENT_STANDARD.md` v1.0 in Related Documents. The Deployment Standard defines the Cloud Jurisdiction ontology (US Public / EU Development / Aegis Sovereign) and cross-references the Sovereignty Tier Map in §3.6 of `DWS_STANDARDS_LIBRARY.md`. No substantive content change here.

Session Links & References:

- Claude Code (claude/nordic-sales-strategy-1p5VB): https://github.com/blogtheristo/dws6/commits/claude/nordic-sales-strategy-1p5VB
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_SOVEREIGNTY_STANDARD.md

Document Status:

- Created: 15.02.2026
- Last Modified: 12.05.2026
- Language: English & Finnish (bilingual)
- Languages Available: English, Suomi
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Sovereignty & Compliance Standard

Related Documents:

- DWS_SECURITY_STANDARD.md (v1.0 — Internal Security Framework)
- DWS_DEPLOYMENT_STANDARD.md (v1.0 — per-Surface deploy ontology; defines Cloud Jurisdiction US Public / EU Development / Aegis Sovereign and binds them to the Sovereignty Tier Map in `DWS_STANDARDS_LIBRARY.md` §3.6)
- Admin/SECURITY_COMPLIANCE.md (Enterprise Security & Compliance — external-facing)
- DWS_DOCUMENT_STANDARD.md (v1.4 — document metadata, naming, versioning)
- DWS_PRODUCT_STANDARD.md (v1.0 — product definitions and pricing)
- DWS_BRAND_STANDARD.md (v1.1 — brand guidelines and UI standards)
- docs/metropolia/master-thesis/fi/V3Thesis_FI.md (v3.4 — TK4 vaatimustenmukaisuus)
- docs/metropolia/master-thesis/en/V3Thesis_EN.md (v3.4 — RQ4 compliance)
- docs/metropolia/master-thesis/RESEARCH_QUESTIONS_EVIDENCE.md (RQ4 evidence)

---

**Version:** 1.0
**Effective Date:** 2026-02-15
**Last Updated:** 2026-02-15
**Status:** Active
**Thesis Reference:** TK4 / RQ4 — "Miten varmistetaan NIS 2, EU AI Act, GDPR ja Cybersecurity Act -vaatimustenmukaisuus?"

---

## Sisällysluettelo / Table of Contents

1. [Tarkoitus ja soveltamisala / Purpose and Scope](#1-tarkoitus-ja-soveltamisala)
2. [V3 toteutussuunnitelman kriittinen arviointi / V3 Critical Assessment](#2-v3-toteutussuunnitelman-kriittinen-arviointi)
3. [EU-suvereniteetin oikeudellinen viitekehys / Legal Framework](#3-eu-suvereniteetin-oikeudellinen-viitekehys)
4. [Kaksivaiheinen arkkitehtuuri: MVP → V1 / Two-Phase Architecture](#4-kaksivaiheinen-arkkitehtuuri-mvp--v1)
5. [Tietokanta-arviointi / Database Assessment](#5-tietokanta-arviointi)
6. [EU-suvereenien vaihtoehtojen arviointi / EU-Sovereign Alternatives](#6-eu-suvereenien-vaihtoehtojen-arviointi)
7. [V4 TK4 -toteutusvaatimukset / V4 TK4 Implementation Requirements](#7-v4-tk4--toteutusvaatimukset)
8. [Migraatiopolku MVP → V1 / Migration Path](#8-migraatiopolku-mvp--v1)
9. [Vaatimustenmukaisuusmatriisi / Compliance Matrix](#9-vaatimustenmukaisuusmatriisi)
10. [Mittarit ja auditointi / Metrics and Auditing](#10-mittarit-ja-auditointi)

---

## 1. Tarkoitus ja soveltamisala

### Purpose / Tarkoitus

Tämä standardi määrittelee DWS IQ 6 -alustan EU-datan suvereniteetti- ja vaatimustenmukaisuusvaatimukset. Se vastaa tutkimuskysymykseen TK4: **"Miten varmistetaan NIS 2, EU AI Act, GDPR ja Cybersecurity Act -vaatimustenmukaisuus?"**

This standard defines the EU data sovereignty and compliance requirements for the DWS IQ 6 platform. It answers research question RQ4: **"How to ensure NIS 2, EU AI Act, GDPR, and Cybersecurity Act compliance?"**

### Scope / Soveltamisala

| Komponentti / Component | Kattavuus / Coverage                                                              |
| ----------------------- | --------------------------------------------------------------------------------- |
| DWS IQ 6 Platform       | Kaikki tietokannat, AI-mallit, audit-lokit / All databases, AI models, audit logs |
| Firehorse Suite         | Omnichannel, Report, Automation, ContentMS                                        |
| Lifetime Fleet          | IoT, ajoneuvot, robotit / IoT, vehicles, robots                                   |
| DWS10.com verkkokauppa  | Maksutiedot, asiakasdata / Payment data, customer data                            |

### Keskeiset periaatteet / Core Principles

1. **Oikeudellinen suvereniteetti > fyysinen sijainti** — Palvelimen EU-sijainti ei riitä, jos yritys on US-lainsäädännön alainen
2. **MVP sallii kompromissit, V1 ei** — Kehitysvaiheessa Supabase on hyväksyttävä, tuotannossa ei
3. **Standardit kilpailuetuna** — EU-suvereniteetti on myyntiargumentti, ei kustannus
4. **Automaattinen todentaminen** — Vaatimustenmukaisuus on mitattava, ei itsearvioitu

---

## 2. V3 toteutussuunnitelman kriittinen arviointi

### Mikä V3:ssa on oikein

V3Thesis (osiot 8.5.4 ja 4.7) tunnistaa oikeat sääntelykehykset ja antaa niille oikean painoarvon:

| Vahvuus                                       | V3 Viite       |
| --------------------------------------------- | -------------- |
| NIS2-riskinhallinta on aktiivinen             | Osio 8.5.4 TK4 |
| EU AI Act artikla 50 läpinäkyvyys tunnistettu | Osio 4.7.3     |
| GDPR-datan sijainti europe-north1             | Osio 8.5.4     |
| ISO 27001 sertifiointitavoite Q3 2026         | Osio 8.3       |

### Kriittiset puutteet V3:ssa

**PUUTE 1: Supabase-riippuvuuden oikeudellinen riski tunnistamatta**

V3 ilmoittaa GDPR-tilan "Yhteensopiva" perustuen Supabase RLS -käytäntöihin ja europe-north1-alueeseen. Tämä on **teknisesti totta mutta juridisesti riittämätöntä.**

Supabase Inc. on yhdysvaltalainen yritys. Se on alistettuna:

- **CLOUD Act** (2018) — USA:n viranomaiset voivat vaatia dataa palvelimen fyysisestä sijainnista riippumatta
- **FISA Section 702** — Jatkettu syyskuuhun 2027, laajennettu 2024 kattamaan laajemman joukon "sähköisen viestinnän palveluntarjoajia"

Microsoftin Ranskan johtaja todisti Ranskan senaatissa kesäkuussa 2025, ettei voi taata ranskalaisen datan koskemattomuutta US-viranomaisten vaatimuksilta. Supabase — huomattavasti pienempi yritys — ei myöskään voi.

**PUUTE 2: EU AI Act artikla 12 (automaattinen kirjaus) aliarvioitu**

V3 mainitsee "matalan riskin luokitus" EU AI Act -riskiarviointina. Tämä on **liian optimistinen arvio.** DWS IQ 6 käsittelee:

- Sääntelyvaatimustenmukaisuuden automaatiota (Fit for 55, CBAM, CSRD)
- Yrityksen päästöraporttien generointia
- Teollista prosessinohjausta edge-laitteilla

Liite III määrittelee korkean riskin järjestelmiksi ne, jotka vaikuttavat merkittävästi "ympäristöön, terveyteen ja turvallisuuteen". Ilmastopäästöjen raportoinnin automatisointi osuu tähän. Artikla 12 vaatii:

- Automaattinen, muuttumaton lokitus
- Vähintään 6 kuukauden säilytys
- Jäljitettävyys syötteestä päätökseen (reasoning lineage)

Nämä lokit **eivät saa** sijaita US-yrityksen hallinnoimalla infrastruktuurilla.

**PUUTE 3: NIS2-valmiusarvio liian korkea**

V3 osio 8.3 arvioi NIS2-valmiuden 75 %:iin. Tämä on linjassa Security Agent -toteutuksen kanssa, mutta jättää huomioimatta:

- Toimitusketjun turvallisuusarviointi puuttuu (Supabase = US-toimittaja)
- ISO 27001 -sertifiointi on vasta suunniteltu, ei toteutettu
- Suomen kyberturvallisuuslaki (124/2025) — NIS2-transpositio — edellyttää kriittisten toimijoiden toimitusketjun todennettavuutta

**PUUTE 4: Cybersecurity Act -valmiusarvio "Suunniteltu" ei riitä**

ISO 27001 tavoite Q3 2026 on oikea, mutta Cybersecurity Act edellyttää myös:

- ENISA:n kyberturvallisuussertifiointikehyksen (EUCC) mukaista arviointia
- Tuotteiden ja palvelujen sertifiointia, ei vain organisaation turvallisuushallintajärjestelmää

### V3:n kokonaisarvosana

| Kriteeri                   | V3 Arvio    | Todellisuus                         | Ero   |
| -------------------------- | ----------- | ----------------------------------- | ----- |
| GDPR-valmius               | 95 %        | 70 % (Supabase juridinen riski)     | -25 % |
| NIS2-valmius               | 75 %        | 55 % (toimitusketju + sertifiointi) | -20 % |
| EU AI Act -valmius         | 80 %        | 50 % (artikla 12 + riskiarvio)      | -30 % |
| Cybersecurity Act -valmius | Suunniteltu | Aliarvioitu (EUCC puuttuu)          | —     |

**Johtopäätös:** V3 tunnistaa oikeat kehykset mutta aliarvioi systemaattisesti oikeudellisen suvereniteetin vaatimukset. V4:n on korjattava tämä.

---

## 3. EU-suvereniteetin oikeudellinen viitekehys

### Sovellettava sääntely / Applicable Regulations

| Sääntely              | Tunniste           | Voimaantulo               | DWS-relevanssi                                              |
| --------------------- | ------------------ | ------------------------- | ----------------------------------------------------------- |
| **GDPR**              | EU 2016/679        | 25.05.2018                | Kaikki tuotteet — datan käsittely, siirto, säilytys         |
| **NIS2-direktiivi**   | EU 2022/2555       | 17.10.2024 (transpositio) | Kriittisten toimialojen asiakkaat (rakentaminen, valmistus) |
| **EU AI Act**         | EU 2024/1689       | 02.08.2026 (korkea riski) | AI-päätöksenteon läpinäkyvyys, lokitus, riskiarviointi      |
| **Cybersecurity Act** | EU 2019/881        | 27.06.2019                | ENISA-sertifiointi, tuotteiden kyberturvallisuus            |
| **Data Act**          | EU 2023/2854       | 12.09.2025                | IoT-datan jakaminen (Lifetime Fleet)                        |
| **CLOUD Act**         | US 2018            | 23.03.2018                | **UHKA** — US-yritysten datan luovutusvelvollisuus          |
| **FISA 702**          | US (jatkettu 2027) | Jatkuva                   | **UHKA** — US-tiedusteluviranomaisten pääsy                 |

### Oikeudellinen suvereniteetin hierarkia

```
TASO 1: EU-yritys + EU-infra + EU-lainsäädäntö         → SUVEREENI ✅
TASO 2: EU-yritys + US-infra (AWS/GCP) + EU-sijainti    → OSITTAINEN ⚠️
TASO 3: US-yritys + EU-infra + EU-sijainti              → RIITTÄMÄTÖN ❌
TASO 4: US-yritys + US-infra + EU-sijainti              → EI SUVEREENI ❌

Supabase (hallinnoitu) = TASO 3 ❌
Aiven (EU-infra)       = TASO 1 ✅
Supabase (itse-hostattu EU-infralla) = TASO 2 ⚠️
```

### Schrems II -vaikutus

EU-tuomioistuimen Schrems II -päätös (C-311/18) kumosi Privacy Shield -sopimuksen ja asetti lisävelvoitteita EU–US-datasiirroille. EU–US Data Privacy Framework (DPF) korvasi Privacy Shieldin, mutta:

- DPF:n jatkuvuus on epävarma Trumpin hallinnon jälkeen
- PCLOB:n (Privacy and Civil Liberties Oversight Board) demokraattijäsenet irtisanottiin tammikuussa 2025
- Euroopan tietosuojavaltuutettu (EDPS) on nostanut huolenaiheita DPF:n kestävyydestä

**DWS:n kanta:** Emme voi rakentaa tuotantoa oikeudellisen perustan varaan, joka voi kumoutua milloin tahansa. V1 vaatii Tason 1 suvereniteetin.

---

## 4. Kaksivaiheinen arkkitehtuuri: MVP → V1

### Vaihe MVP: Supabase (hyväksyttävä nyt)

**Aikataulu:** Nyt → Q2 2026
**Perustelu:** Nopea kehitys, alhainen kustannus, rikas BaaS-ominaisuusjoukko

| Komponentti         | Ratkaisu                        | Rajoitus                        |
| ------------------- | ------------------------------- | ------------------------------- |
| Tietokanta          | Supabase PostgreSQL (eu-west-1) | US-yritys, CLOUD Act            |
| Autentikointi       | Supabase Auth                   | Sidottu Supabasen ekosysteemiin |
| Tiedostotallennus   | Supabase Storage                | Sidottu Supabasen ekosysteemiin |
| Reaaliaikainen data | Supabase Realtime               | Sidottu Supabasen ekosysteemiin |
| API-kerros          | Supabase Auto-API (PostgREST)   | Sidottu Supabasen ekosysteemiin |
| Vektoritietokanta   | pgvector (Supabasessa)          | Ei erillistä hallintaa          |

**MVP:ssä hyväksyttävät kompromissit:**

- Kehitys- ja testausympäristö voi käyttää Supabase-hallittua palvelua
- Ei käsitellä oikeita asiakastietoja
- Ei tehdä EU AI Act artikla 12 -lokitusta Supabaseen
- Demo- ja pilottiympäristöihin sovelletaan Supabasen DPA:ta

**MVP:ssä EI hyväksyttävää:**

- Tuotantodatan tallentaminen
- Asiakkaiden henkilötietojen käsittely
- AI-päätöslokien pysyvä tallennus
- Myyntimateriaalissa "GDPR-yhteensopiva" -väite perustuen pelkästään Supabaseen

### Vaihe V1: EU-suvereeni tuotanto (pakollinen)

**Aikataulu:** Q3 2026 → (EU AI Act -deadline 02.08.2026)
**Perustelu:** TK4-vaatimustenmukaisuus, asiakasluottamus, sääntelyn noudattaminen

| Komponentti          | V1 Ratkaisu                                              | Perustelu                                   |
| -------------------- | -------------------------------------------------------- | ------------------------------------------- |
| Tietokanta           | **Aiven PostgreSQL** (Helsinki/Frankfurt)                | Suomalainen yritys, ISO 27001, SOC 2 Type 2 |
| Autentikointi        | **Keycloak** (itse-hostattu EU-infralla)                 | Avoin lähdekoodi, täysi hallinta, SAML/OIDC |
| Tiedostotallennus    | **MinIO** (itse-hostattu) tai **UpCloud Object Storage** | EU-suvereeni S3-yhteensopiva                |
| Reaaliaikainen data  | **WebSocket-palvelu** (Express/Node.js)                  | Jo olemassa src/app.ts:ssä                  |
| API-kerros           | **Express REST API** (olemassa) + PostgREST              | Jo olemassa, laajennetaan                   |
| Vektoritietokanta    | **pgvector** (Aiven PostgreSQL:ssä)                      | Suora yhteensopivuus                        |
| AI-lokitus (Art. 12) | **Muuttumaton lokipalvelu** (EU-infra)                   | Erillinen, auditoitava                      |
| Edge AI              | **NVIDIA Jetson** (paikallinen)                          | Ei pilvi-riippuvuutta                       |

---

## 5. Tietokanta-arviointi

### Supabase: yksityiskohtainen analyysi

| Arviointikriteeri              | Tila                | Selitys                                                  |
| ------------------------------ | ------------------- | -------------------------------------------------------- |
| **Tekninen soveltuvuus**       | ✅ Erinomainen      | PostgreSQL, pgvector, RLS, Realtime, Edge Functions      |
| **Kehittäjäkokemus**           | ✅ Erinomainen      | BaaS-malli nopeuttaa MVP-kehitystä merkittävästi         |
| **SOC 2 Type 2**               | ✅ Sertifioitu      | Riittävä perusturvallisuuteen                            |
| **ISO 27001**                  | ❌ Puuttuu          | Keskusteltu GitHub:ssa, ei sertifiointia                 |
| **NIS2-yhteensopivuus**        | ❌ Ei dokumentoitu  | Ei NIS2-spesifistä vaatimustenmukaisuusdokumentaatiota   |
| **GDPR Art. 28 (käsittelijä)** | ⚠️ DPA olemassa     | DPA rakenteellisesti riittävä, mutta Schrems II -jännite |
| **CLOUD Act -altistuminen**    | ❌ KORKEA           | US-yritys, ei voi taata immuniteettiä US-viranomaisilta  |
| **FISA 702 -altistuminen**     | ❌ KORKEA           | Laajennettu 2024, voimassa 2027 asti                     |
| **EU-dataresudenssitakuu**     | ❌ Ei oikeudellista | Fyysinen sijainti ≠ oikeudellinen suvereniteetti         |
| **Hinta**                      | ✅ Kilpailukykyinen | Pro $25/kk, Team $599/kk                                 |

**Tuomio:** MVP-kelpoinen, V1-kelvoton.

### Aiven: yksityiskohtainen analyysi

| Arviointikriteeri           | Tila                          | Selitys                                                   |
| --------------------------- | ----------------------------- | --------------------------------------------------------- |
| **Tekninen soveltuvuus**    | ✅ Hyvä                       | Hallinnoitu PostgreSQL, pgvector tuettu                   |
| **ISO 27001**               | ✅ Sertifioitu (kesäkuu 2018) | Pitkäaikainen sertifiointi                                |
| **SOC 2 Type 2**            | ✅ Sertifioitu (lokakuu 2019) | Pitkäaikainen sertifiointi                                |
| **HIPAA**                   | ✅ Yhteensopiva               | Osoittaa kypsyyttä                                        |
| **PCI-DSS**                 | ✅ Yhteensopiva               | Maksudataan soveltuva                                     |
| **NIS2-yhteensopivuus**     | ✅ Rakenteellisesti vahva     | Suomalainen yritys, Suomen kyberturvallisuuslaki soveltuu |
| **GDPR Art. 28**            | ✅ Täysi yhteensopivuus       | EU-pääkonttori, DPA saatavilla                            |
| **CLOUD Act -altistuminen** | ✅ EI ALTISTUMISTA            | Suomalainen yritys, ei US-lainsäädännön alainen           |
| **FISA 702 -altistuminen**  | ✅ EI ALTISTUMISTA            | Ei US-yritys                                              |
| **EU-dataresudenssitakuu**  | ✅ Oikeudellisesti pätevä     | ETA-hosting, siirrot vaativat asiakkaan hyväksynnän       |
| **Multi-cloud**             | ✅ AWS, GCP, Azure, UpCloud   | Joustavuus infra-valinnassa                               |
| **Hinta**                   | ✅ Kilpailukykyinen           | Developer $5/kk, Startup $75/kk                           |
| **BaaS-ominaisuudet**       | ❌ Puuttuu                    | Ei Auth, Storage, Realtime, auto-API                      |

**Tuomio:** V1-suositus tietokantakerrokselle. Vaatii lisäkomponentteja (Keycloak, MinIO, WebSocket).

**V1 plan decision (10.03.2026):** Aiven **Developer** ($5/mo) + **Startup** ($75/mo). Developer for dev/staging or lighter workloads; Startup for production (99.99% SLA, HA options). Total ~$80/mo for V1 database layer.

---

## 6. EU-suvereenien vaihtoehtojen arviointi

### Vertailutaulukko

| Palveluntarjoaja | Pääkonttori              | Hallinnoitu PostgreSQL | Sertifioinnit                    | Suvereniteettitaso | DWS-soveltuvuus                         |
| ---------------- | ------------------------ | ---------------------- | -------------------------------- | ------------------ | --------------------------------------- |
| **Aiven**        | Helsinki, Suomi          | ✅                     | ISO 27001, SOC 2, HIPAA, PCI-DSS | Taso 1 ✅          | **Ensisijainen suositus**               |
| **UpCloud**      | Helsinki, Suomi          | ✅ (Managed DB)        | EU-suvereeni                     | Taso 1 ✅          | Vahva vaihtoehto, Aiven-kumppani        |
| **OVHcloud**     | Roubaix, Ranska          | ✅                     | SecNumCloud, ISO 27001           | Taso 1 ✅          | Laajin EU-palveluvalikoima              |
| **Scaleway**     | Pariisi, Ranska          | ✅                     | SecNumCloud-kelpoinen            | Taso 1 ✅          | Vahva serverless, kehittäjäystävällinen |
| **Exoscale**     | Wien, Itävalta / Sveitsi | ✅ (DBaaS)             | EU-suvereeni                     | Taso 1 ✅          | Vahva Kafka, OpenSearch                 |
| **Hetzner**      | Gunzenhausen, Saksa      | ❌ (IaaS)              | GDPR-yhteensopiva                | Taso 1 ✅          | Halvin, itse-hallittava PostgreSQL      |

### Suositus: primääri ja varasuunnitelma

**V1 Aiven plans:** Developer ($5/mo) + Startup ($75/mo) — decision 10.03.2026.

```
PRIMÄÄRI:     Aiven PostgreSQL (Helsinki, europe-north1)
              → Developer (dev/staging) + Startup (production)
              → Suomalainen yritys, ISO 27001, pgvector, multi-cloud

VARASUUNN.:   UpCloud Managed DB (Helsinki)
              → Suomalainen yritys, Aiven-kumppani, edullisempi

EDGE:         NVIDIA Jetson (paikallinen, ei pilvi)
              → Ilmainen, täysi hallinta, offline-kykyinen

SELF-HOSTED:  Hetzner Cloud (Falkenstein/Helsinki)
              → Supabase self-hosted Kuberneteksella, edullisin vaihtoehto
```

### Erityistapaus: Supabase self-hosted EU-infralla

Supabase on avointa lähdekoodia. Self-hosted-asennus EU-suvereenilla infrastruktuurilla (Hetzner, UpCloud) on **Taso 2** — hyväksyttävä, jos:

1. Kaikki infra on EU-yrityksen hallinnoimaa
2. Ei Supabase Inc. -hallittua palvelua (ei US-yrityksen käsittelyä)
3. Päivitykset ja tietoturva ovat oman tiimin vastuulla
4. ISO 27001 -auditointi kattaa self-hosted-asennuksen

**Arvio:** Mahdollinen mutta operationaalisesti raskaampi kuin Aiven + Keycloak + MinIO.

---

## 7. V4 TK4 -toteutusvaatimukset

### V4:n on korjattava V3:n puutteet

V4 opinnäytetyöversion on päivitettävä TK4-vastaus seuraavasti:

### 7.1 GDPR — korjaus: oikeudellinen suvereniteetti

**V3 väite:** "Yhteensopiva — europe-north1, Supabase RLS"
**V4 korjaus:**

| Vaatimus                              | MVP (Supabase)                     | V1 (EU-suvereeni)                   |
| ------------------------------------- | ---------------------------------- | ----------------------------------- |
| Art. 5 — Käsittelyn periaatteet       | ✅ Teknisesti                      | ✅ Juridisesti                      |
| Art. 25 — Sisäänrakennettu tietosuoja | ⚠️ Supabase RLS                    | ✅ Keycloak + Aiven RLS             |
| Art. 28 — Käsittelijäsopimus          | ⚠️ DPA olemassa, Schrems II -riski | ✅ EU-yritys, ei Schrems II -riskiä |
| Art. 44-49 — Kansainväliset siirrot   | ❌ CLOUD Act -uhka                 | ✅ Ei siirtoja EU:n ulkopuolelle    |
| Art. 33 — Tietoturvaloukkausilmoitus  | ✅ 72h                             | ✅ 72h + NIS2 24h                   |

### 7.2 NIS2-direktiivi — korjaus: toimitusketjun turvallisuus

**V3 väite:** "Aktiivinen — Security Agent + Snyk MCP"
**V4 korjaus:**

| NIS2 Art.     | Vaatimus                    | MVP                         | V1                                     |
| ------------- | --------------------------- | --------------------------- | -------------------------------------- |
| Art. 21(1)    | Riskinhallinta              | ✅ Security Agent           | ✅ Security Agent + ISMS               |
| Art. 21(2)(d) | Toimitusketjun turvallisuus | ❌ Supabase = US-toimittaja | ✅ Aiven = EU-toimittaja               |
| Art. 21(2)(e) | Haavoittuvuuksien hallinta  | ✅ Snyk MCP                 | ✅ Snyk MCP + Dependabot               |
| Art. 23       | Poikkeamailmoitus 24h       | ⚠️ Slack-ilmoitukset        | ✅ CERT-FI + automaattinen raportointi |
| Art. 28       | Rekisteröityminen           | ⚠️ Ei tehty                 | ✅ Rekisteröinti CERT-FI:hin           |

**Suomen kyberturvallisuuslaki (124/2025):** DWS IQ 6:n asiakkaat (rakentaminen, valmistus) ovat NIS2:n mukaisia olennaisia tai tärkeitä toimijoita. DWS:n on osoitettava toimitusketjun turvallisuus — US-toimittaja on puute.

### 7.3 EU AI Act — korjaus: riskiarvio ja artikla 12

**V3 väite:** "Matalan riskin luokitus, Vaihe 2 hyväksyntä"
**V4 korjaus:**

| Vaatimus                           | V3 Arvio             | V4 Arvio                               | Perustelu                                       |
| ---------------------------------- | -------------------- | -------------------------------------- | ----------------------------------------------- |
| Riskiluokitus                      | Matala riski         | **Korkea riski (todennäköinen)**       | Liite III: ympäristö, terveys, turvallisuus     |
| Art. 9 — Riskinhallintajärjestelmä | Ei toteutettu        | ✅ Pakollinen V1:ssä                   | Jatkuva riskiarviointi                          |
| Art. 11 — Tekninen dokumentaatio   | Osittainen           | ✅ Täydellinen                         | Reasoning lineage                               |
| Art. 12 — Automaattinen lokitus    | Ei toteutettu        | ✅ Muuttumaton lokipalvelu EU-infralla | 6kk+ säilytys                                   |
| Art. 13 — Läpinäkyvyys             | Osittainen (Art. 50) | ✅ Täysi läpinäkyvyys                  | Käyttäjäinfo + viranomaisdokumentaatio          |
| Art. 14 — Ihmisen valvonta         | Vaihe 2 hyväksyntä   | ✅ Systemaattinen HIL                  | Human-in-Loop kaikissa kriittisissä päätöksissä |
| Art. 15 — Tarkkuus ja kestävyys    | Ei mitattu           | ✅ Mitattavat KPI:t                    | Tarkkuus, harhaisuus, kestävyys                 |

**Seuraamukset:** Enintään **35 miljoonaa euroa tai 7 % maailmanlaajuisesta liikevaihdosta**.

### 7.4 Cybersecurity Act — korjaus: EUCC-sertifiointi

**V3 väite:** "Suunniteltu — ISO 27001 tavoite Q3 2026"
**V4 korjaus:**

| Vaatimus                  | V3                  | V4                                              |
| ------------------------- | ------------------- | ----------------------------------------------- |
| ISO 27001                 | Suunniteltu Q3 2026 | ✅ Aikataulutettu, TÜV Rheinland                |
| SOC 2 Type 2              | Suunniteltu Q4 2026 | ✅ Aikataulutettu, Lifetime Fleet -prioriteetti |
| EUCC (EU Common Criteria) | Ei tunnistettu      | ✅ Arviointi Q1 2027                            |
| ENISA-sertifiointikehys   | Ei tunnistettu      | ✅ Seurantalistalle                             |

---

## 8. Migraatiopolku MVP → V1

### Aikataulu

```
2026 Q1                Q2                  Q3                  Q4
──────────────────────────────────────────────────────────────────
MVP (Supabase)          │                   │                   │
├─ Kehitys & demo       │                   │                   │
├─ Pilotit (ei oikea data) │                │                   │
└─ DPA allekirjoitettu  │                   │                   │
                        │                   │                   │
                    MIGRAATIO               │                   │
                    ├─ Aiven PostgreSQL     │                   │
                    │  provisiointi         │                   │
                    ├─ Keycloak-asennus     │                   │
                    ├─ MinIO-asennus        │                   │
                    ├─ Data-migraatio       │                   │
                    └─ Testaus              │                   │
                                            │                   │
                                        V1 TUOTANTO            │
                                        02.08.2026 EU AI Act   │
                                        ├─ ISO 27001 sert.     │
                                        ├─ Art. 12 lokitus     │
                                        └─ CERT-FI rekist.     │
                                                                │
                                                            V1.1│
                                                            ├─ SOC 2 Type 2
                                                            ├─ IEC 62443 arviointi
                                                            └─ EUCC-arviointi aloitus
```

### Migraation komponentit

| #   | Komponentti          | MVP → V1 Muutos                             | Työmäärä                 | Prioriteetti |
| --- | -------------------- | ------------------------------------------- | ------------------------ | ------------ |
| 1   | PostgreSQL           | Supabase → Aiven                            | `pg_dump` + `pg_restore` | KRIITTINEN   |
| 2   | pgvector-embeddings  | Supabase → Aiven                            | Sisältyy #1:een          | KRIITTINEN   |
| 3   | Autentikointi        | Supabase Auth → Keycloak                    | Uusi komponentti         | KRIITTINEN   |
| 4   | Tiedostotallennus    | Supabase Storage → MinIO/UpCloud            | Uusi komponentti         | KORKEA       |
| 5   | Reaaliaikainen data  | Supabase Realtime → WebSocket (Express)     | Olemassa osittain        | KESKITASO    |
| 6   | API-kerros           | Supabase auto-API → Express REST (olemassa) | Laajennus                | KESKITASO    |
| 7   | AI-lokitus (Art. 12) | Ei ole → Uusi lokipalvelu                   | Uusi komponentti         | KRIITTINEN   |
| 8   | Row Level Security   | Supabase RLS → PostgreSQL RLS (natiivi)     | Siirto                   | KORKEA       |

### Koodikantavaikutus

Supabase JS SDK:n käyttöpaikat, jotka on päivitettävä:

```
src/integrations/     → Supabase-client korvattava Aiven-yhteydellä
dws6.com/dashboard/   → Supabase Auth → Keycloak OIDC
dws6.com/admin/       → Supabase Auth → Keycloak OIDC
Firehorse/            → Supabase Storage → MinIO S3 API
```

### Migraation riskienhallinta

| Riski                                        | Todennäköisyys | Vaikutus  | Lieventäminen                         |
| -------------------------------------------- | -------------- | --------- | ------------------------------------- |
| Data-häviö migraatiossa                      | Matala         | Korkea    | Kaksoisajo 2 viikkoa, varmuuskopiot   |
| Keycloak-konfiguraatiovirhe                  | Keskitaso      | Korkea    | Staging-ympäristö ensin               |
| Suorituskykyregressio                        | Matala         | Keskitaso | Kuormitustestaus ennen siirtoa        |
| Aikataulu venyminen                          | Keskitaso      | Korkea    | Aloitus Q2 alussa, ei Q2 lopussa      |
| Supabase-ominaisuuksien korvaamatta jääminen | Keskitaso      | Korkea    | Ominaisuuskartoitus ennen migraatiota |

---

## 9. Vaatimustenmukaisuusmatriisi

### Kokonaismatriisi: MVP vs. V1

| Sääntely       | Artikla       | Vaatimus                       | MVP (Supabase)    | V1 (EU-suvereeni)     |
| -------------- | ------------- | ------------------------------ | ----------------- | --------------------- |
| **GDPR**       | Art. 5        | Käsittelyn periaatteet         | ✅                | ✅                    |
| **GDPR**       | Art. 25       | Sisäänrakennettu tietosuoja    | ⚠️                | ✅                    |
| **GDPR**       | Art. 28       | Käsittelijäsopimus             | ⚠️ Schrems II     | ✅                    |
| **GDPR**       | Art. 33       | Tietoturvaloukkausilmoitus 72h | ✅                | ✅                    |
| **GDPR**       | Art. 44-49    | Kansainväliset siirrot         | ❌ CLOUD Act      | ✅ Ei siirtoja        |
| **NIS2**       | Art. 21(1)    | Riskinhallinta                 | ✅                | ✅                    |
| **NIS2**       | Art. 21(2)(d) | Toimitusketjun turvallisuus    | ❌ US-toimittaja  | ✅ EU-toimittaja      |
| **NIS2**       | Art. 23       | Poikkeamailmoitus 24h          | ⚠️                | ✅ CERT-FI            |
| **NIS2**       | Art. 28       | Rekisteröityminen              | ❌                | ✅                    |
| **EU AI Act**  | Art. 9        | Riskinhallintajärjestelmä      | ❌                | ✅                    |
| **EU AI Act**  | Art. 11       | Tekninen dokumentaatio         | ⚠️ Osittainen     | ✅ Täydellinen        |
| **EU AI Act**  | Art. 12       | Automaattinen lokitus          | ❌                | ✅ Muuttumaton        |
| **EU AI Act**  | Art. 13       | Läpinäkyvyys                   | ⚠️ Art. 50        | ✅ Täysi              |
| **EU AI Act**  | Art. 14       | Ihmisen valvonta               | ⚠️ Osittainen     | ✅ Systemaattinen HIL |
| **EU AI Act**  | Art. 15       | Tarkkuus ja kestävyys          | ❌ Ei mitattu     | ✅ KPI-seuranta       |
| **Cyber. Act** | —             | ISO 27001                      | ❌ Suunniteltu    | ✅ Sertifioitu Q3     |
| **Cyber. Act** | —             | EUCC                           | ❌ Ei tunnistettu | ✅ Arviointi Q1/27    |

### MVP:n hyväksyntäehdot

MVP voi käyttää Supabasea **vain jos:**

1. ✅ Ei käsitellä oikeita asiakkaiden henkilötietoja
2. ✅ Ei tallenneta AI-päätöslokeja pysyvästi
3. ✅ Supabase DPA on allekirjoitettu
4. ✅ Kaikki projektit käyttävät EU-aluetta (eu-west-1 tai eu-north-1)
5. ✅ Myyntimateriaalissa ei väitetä täyttä GDPR-vaatimustenmukaisuutta
6. ✅ Migraatiosuunnitelma V1:een on dokumentoitu ja aikataulutettu
7. ✅ Supabase-riippuvuudet on abstrahoitu repository-patternilla koodissa

### V1:n hyväksyntäehdot (PAKOLLINEN elokuu 2026)

V1 EI saa mennä tuotantoon ennen kuin:

1. ✅ Tietokanta on EU-suvereenilla infrastruktuurilla (Aiven/UpCloud/self-hosted)
2. ✅ Autentikointi on EU-hallittu (Keycloak tai vastaava)
3. ✅ EU AI Act artikla 12 -lokitus on toteutettu ja testattu
4. ✅ ISO 27001 -sertifiointi on saatu tai Stage 1 -auditointi läpäisty
5. ✅ CERT-FI -rekisteröinti on tehty (NIS2 Art. 28)
6. ✅ Riskiarviointidokumentaatio on valmis (EU AI Act Art. 9)
7. ✅ Tekninen dokumentaatio on valmis (EU AI Act Art. 11)
8. ✅ Human-in-Loop -prosessi on dokumentoitu ja testattu
9. ✅ Penetraatiotestaus on suoritettu kolmannen osapuolen toimesta
10. ✅ Tietosuojavaikutusten arviointi (DPIA) on suoritettu

---

## 10. Mittarit ja auditointi

### Neljännesvuosittaiset KPI:t

| Mittari                                 | Q2 2026      | Q3 2026         | Q4 2026  | 2027           |
| --------------------------------------- | ------------ | --------------- | -------- | -------------- |
| EU-suvereniteettitaso                   | Taso 3 (MVP) | **Taso 1** (V1) | Taso 1   | Taso 1         |
| GDPR-vaatimustenmukaisuus               | 70 %         | 95 %            | 98 %     | 99 %           |
| NIS2-vaatimustenmukaisuus               | 55 %         | 80 %            | 90 %     | 95 %           |
| EU AI Act -vaatimustenmukaisuus         | 40 %         | 85 %            | 90 %     | 95 %           |
| ISO 27001 -eteneminen                   | Gap-analyysi | Sertifioitu     | Ylläpito | Resertifiointi |
| Art. 12 -lokien kattavuus               | 0 %          | 90 %            | 99 %     | 100 %          |
| US-yritysriippuvuudet datankäsittelyssä | 1 (Supabase) | 0               | 0        | 0              |

### Auditointitiheys

| Auditointi                               | Tiheys              | Vastuullinen                   | Ensimmäinen |
| ---------------------------------------- | ------------------- | ------------------------------ | ----------- |
| Sisäinen tietoturva-auditointi           | Neljännesvuosittain | CISO / Security Agent          | Q2 2026     |
| ISO 27001 -valvonta-auditointi           | Vuosittain          | TÜV Rheinland                  | Q3 2026     |
| Penetraatiotestaus                       | Vuosittain          | Ulkoinen kolmas osapuoli       | Q2 2026     |
| EU AI Act -vaatimustenmukaisuusarviointi | Puolivuosittain     | Sisäinen + ulkoinen            | Q3 2026     |
| NIS2-poikkeamavalmius                    | Neljännesvuosittain | Sisäinen (CERT-FI-raportointi) | Q2 2026     |
| Toimitusketjun turvallisuusarviointi     | Puolivuosittain     | Sisäinen                       | Q2 2026     |

---

## Liitteet / Appendices

### Liite A: Lähteet ja viitteet

**EU-sääntely:**

- GDPR (EU 2016/679): https://eur-lex.europa.eu/eli/reg/2016/679/oj
- NIS2-direktiivi (EU 2022/2555): https://eur-lex.europa.eu/eli/dir/2022/2555
- EU AI Act (EU 2024/1689): https://artificialintelligenceact.eu/
- Cybersecurity Act (EU 2019/881): https://eur-lex.europa.eu/eli/reg/2019/881/oj
- Data Act (EU 2023/2854): https://eur-lex.europa.eu/eli/reg/2023/2854
- Suomen kyberturvallisuuslaki (124/2025)

**Oikeuskäytäntö:**

- Schrems II (C-311/18): EU-tuomioistuimen päätös 16.07.2020
- EU–US Data Privacy Framework: Komission riittävyyspäätös 10.07.2023

**US-lainsäädäntö (uhat):**

- CLOUD Act (2018): Clarifying Lawful Overseas Use of Data Act
- FISA Section 702: Foreign Intelligence Surveillance Act (jatkettu 2027)

**Palveluntarjoajien dokumentaatio:**

- Supabase DPA: https://supabase.com/legal/dpa
- Supabase TIA: https://supabase.com/downloads/docs/Supabase+TIA+250314.pdf
- Supabase SOC 2: https://supabase.com/docs/guides/security/soc-2-compliance
- Aiven Security: https://aiven.io/security-compliance
- Aiven DPA: https://aiven.io/dpa
- Aiven ISO 27001: https://aiven.io/press/aiven-commits-to-information-security-with-iso27001-certification

**Analyysi ja tutkimus:**

- Microsoftin Ranskan johtajan todistus Ranskan senaatissa (kesäkuu 2025)
- Wire: Risks of US Cloud Providers: https://wire.com/en/blog/risks-of-us-cloud-providers-european-digital-sovereignty
- EU AI Act artikla 12 lokitusvaatimukset: https://artificialintelligenceact.eu/article/12/
- EU AI Act seuraamukset: https://secureprivacy.ai/blog/eu-ai-act-2026-compliance

### Liite B: Sanasto / Glossary

| Termi             | Suomeksi                                | Englanniksi                            |
| ----------------- | --------------------------------------- | -------------------------------------- |
| Suvereniteetti    | Data-suvereniteetti                     | Data sovereignty                       |
| Käsittelijä       | Henkilötietojen käsittelijä             | Data processor                         |
| Rekisterinpitäjä  | Henkilötietojen rekisterinpitäjä        | Data controller                        |
| Poikkeamailmoitus | Tietoturvapoikkeamailmoitus             | Incident notification                  |
| Toimitusketju     | Toimitusketjun turvallisuus             | Supply chain security                  |
| Riskinhallinta    | Kyberturvallisuuden riskinhallinta      | Cybersecurity risk management          |
| Muuttumaton loki  | Muuttumaton tapahtumaloki               | Immutable audit log                    |
| Reasoning lineage | Päättelyketjun jäljitettävyys           | Reasoning lineage                      |
| ISMS              | Tietoturvallisuuden hallintajärjestelmä | Information Security Management System |
| HIL               | Ihminen silmukassa                      | Human-in-Loop                          |
| DPIA              | Tietosuojavaikutusten arviointi         | Data Protection Impact Assessment      |
| EUCC              | EU:n yhteisten kriteerien sertifiointi  | EU Common Criteria Certification       |

---

_Tämä standardi on DWS IQ 6 -projektin sisäinen dokumentti. Se noudattaa DWS Document Standard v1.4 -muotovaatimuksia._
