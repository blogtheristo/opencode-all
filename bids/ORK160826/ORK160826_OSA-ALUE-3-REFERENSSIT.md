# Osa-alue 3 — Agenttipohjainen järjestelmäkehitys

## Referenssilomake | ORK/1462/2026

---

VERSION AND AGENT HISTORY
Version: 2.0 | 2026-06-27 | Claude Sonnet 4.6 | Päivitetty osa-aluekohtaisten vaatimusten mukaiseksi

---

---

## Tarjoajan tiedot

Yritys: Lifetime Oy
Y-tunnus: 0772407-9
Yhteyshenkilö: Risto Anton Päärni
Sähköposti: risto.paarni@lifetime.fi

---

## Vaatimuskartoitus — Osa-alue 3

| Vaatimus                                                                  | Referenssi                                                          | HTP      |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------- |
| AI-avusteinen ohjelmistokehitys + merkittävä kehitysnopeuden tehostaminen | Referenssi 1 — DWS IQ 6: Claude Code + MCP Hub kehitysympäristö     | ~300 htp |
| AWS/Azure tai on-prem -ohjelmisto, toteutettu tekoälypohjaisesti          | Referenssi 2 — AWS IoT Greengrass + DGX Spark on-prem AI-ohjelmisto | ~30 htp  |
| Tuotantoohjelmisto, tehty pääsääntöisesti tekoälyn avulla                 | Referenssi 1 — DWS IQ 6 (1 500+ PR Claude Code -avusteisesti)       | ~300 htp |
| Konttiteknologiaa hyödyntävä tuotanto-ohjelmisto, ≥50 htp                 | Referenssi 3 — DWS IQ 6 Docker-tuotantojärjestelmä + CI/CD          | ~120 htp |

---

## Referenssi 1 — DWS IQ 6: AI-avusteinen agenttijärjestelmäkehitys (Claude Code + MCP Hub)

**Kattaa vaatimukset:** AI-avusteinen kehitys + merkittävä nopeutuminen; Tuotantoohjelmisto pääsääntöisesti tekoälyllä

**Asiakas / tilaaja:** Lifetime Oy (tuotantokäyttö, pohjoismaiset teollisuusasiakkaat)
**Ajanjakso:** 2023–2026 (jatkuva)
**Laajuus:** n. 300 htp (Risto Päärni 100 %, Claude Code päivittäisessä käytössä koko projektin ajan)
**Tuotantostatus:** Tuotannossa, 6 maksavaa asiakasta, MRR 7 000 €

**Kuvaus — Tekoälyavusteinen kehitys ja sen mitattava vaikutus:**

DWS IQ 6 on kehitetty alusta loppuun käyttäen Claude Code CLI -kehitysympäristöä päivittäisenä työnkulkuna. Kehitysnopeus on mitattu ja dokumentoitu YAMK-lopputyössä (Metropolia AMK, 2026):

**Mitattu kehitysnopeuden tehostaminen (YAMK-tutkimus 2026):**

| Mittari                                      | Tulos                                                      |
| -------------------------------------------- | ---------------------------------------------------------- |
| Kehitysnopeus (MCP Hub käyttöönotto)         | +62 % verrattuna perinteiseen kehitykseen                  |
| GitHub: suljettuja PR:iä dws6-repositoriossa | 1 500+ (2024–2026)                                         |
| GitHub Actions -työnkulkuja                  | 15 (CI/CD, tietoturkatarkistukset, automaattiset deployit) |
| Agentit tuotannossa                          | 58 agenttia (88 kyvykkyyttä)                                    |

**MCP Hub -arkkitehtuurin rooli kehitysnopeudessa:**

- Model Context Protocol (MCP) Hub: agenttiyhteistyön standardiprotokolla, joka mahdollistaa Claude Code -agentin suoran pääsyn kaikkiin järjestelmän osiin
- Branch-strategia: feature-branch-workflow, suojatut päähaarat, automatisoidut tarkistukset jokaisessa PR:ssä
- Agenttipohjainen kehitys: plan → implement → review → ship -sykli Claude Code CLI:llä
- Cloudflare Pages -integraatio: automaattinen julkaisu main-haaraan

**Järjestelmän rakenne (tuotannossa):**

- **Arkkitehtuuri:** Brain-Memory-Body-Hands -viitekehys (deterministinen agenttivastuujako)
- **Agentit:** 58 agenttia (88 kyvykkyyttä), kukin rajatulla vastuualueella
- **Tietokanta:** Supabase PostgreSQL + pgvector (vektorimuisti)
- **RAG:** 15 000+ EU-sääntelydokumenttia, semanttinen haku < 800 ms
- **Tietoturva:** EU AI Act Article 12, RLS, JWT, AES-256-GCM, immutable audit trail
- **Protokollat:** MCP, JSON-RPC 2.0, RESTful API

**Teknologia:** TypeScript, Python, React 19, Node.js, Supabase, PostgreSQL, pgvector, Google Cloud Run, Cloudflare Workers, Docker, GitHub Actions, Claude Code CLI

**Rooli:** Pää-arkkitehti ja -kehittäjä (100 %)

---

## Referenssi 2 — AWS IoT Greengrass + NVIDIA DGX Spark: on-prem AI-ohjelmisto

**Kattaa vaatimuksen:** AWS tai on-prem -ohjelmisto, toteutettu tekoälypohjaisesti

**Asiakas / tilaaja:** Lifetime Oy / NVIDIA Inception -ohjelma
**Ajanjakso:** 2024–2026
**Laajuus:** n. 30 htp

**Kuvaus — AWS-integroitu on-prem AI-ohjelmisto:**

Kehitetty tekoälypohjainen hybridijärjestelmä, joka yhdistää AWS-orkestrointikerroksen ja paikallisen AI-päättelyn:

**AWS-komponentti:**

- AWS IoT Greengrass v2: agentin elinkaarihallinta, OTA-päivitykset
- AWS Lambda: reunakomponenttien orkestrointi
- AWS IoT Core: laitehallinta ja telemetria

**On-prem-komponentti (NVIDIA DGX Spark):**

- 24/7 primääripalvelin 15 tuotantotyönkululle
- Ollama + paikalliset LLM-mallit (Llama 3.3 70B, Qwen 2.5)
- Docker Compose -palveluarkkitehtuuri
- GitHub Actions failover (aktivoituu vain DGX Sparkin vikatilanteessa)

**Edge AI (NVIDIA Jetson Orin Nano):**

- Python-agentti + LlamaStack suljetussa verkossa
- < 100 ms latenssi, 7–15 W tehonkulutus

**Teknologia:** AWS IoT Greengrass, AWS Lambda, Python, LlamaStack, Ollama, NVIDIA DGX Spark, NVIDIA Jetson Orin Nano, Docker Compose

**Rooli:** Pää-arkkitehti ja -kehittäjä

---

## Referenssi 3 — DWS IQ 6 Docker-tuotantojärjestelmä (konttiteknologia ≥50 htp)

**Kattaa vaatimuksen:** Konttiteknologiaa hyödyntävä tuotantoohjelmisto ≥50 htp

**Asiakas / tilaaja:** Lifetime Oy (tuotantokäyttö) / pohjoismaiset teollisuusasiakkaat
**Ajanjakso:** 2024–2026
**Laajuus:** n. 120 htp (Docker-arkkitehtuuri, CI/CD-putkisto, tuotantokäyttöönotto ja ylläpito)
**Tuotantostatus:** Käytössä 24/7, 6 maksavaa asiakasta

**Kuvaus — Docker-pohjainen tuotantojärjestelmä:**

DWS IQ 6 -tuotantojärjestelmä on rakennettu täysin konttiteknologian varaan kaikilla tasoilla:

**Docker-arkkitehtuuri tuotannossa:**

- Google Cloud Run: kontitetut backend-palvelut, automaattinen skaalaus
- NVIDIA DGX Spark: Docker Compose, paikalliset AI-palvelut
- Cloudflare Workers: edge-funktiot kontitetussa ympäristössä
- Kehitysympäristö: Docker Compose -pohjainen paikallinen kehitys

**GitHub Actions CI/CD -putkisto (15 työnkulkua):**

- Automaattinen konttirakentaminen jokaisen PR:n yhteydessä
- Tietoturkatarkistukset: Trivy-haavoittuvuusskannaus konttikuville
- Automaattinen deploy: main-haara → Cloudflare Pages / Google Cloud Run
- Rollback: edelliseen konttiversioon < 2 min

**Konttipohjaisen kehityksen laajuus:**

- 1 500+ suljettua PR:ää — jokainen CI/CD-putkiston läpi
- 15 automatisoidut työnkulkua konttipohjaisten deployien hallintaan
- Multi-stage Dockerfile: kehitys / testaus / tuotanto eroteltu

**Teknologia:** Docker, Docker Compose, Google Cloud Run, GitHub Actions, Cloudflare Workers, Trivy

**Rooli:** Pää-arkkitehti, DevOps-insinööri (100 %)

---

## Avainasiantuntija: Risto Anton Päärni

| Kenttä        | Tieto                                                                       |
| ------------- | --------------------------------------------------------------------------- |
| Nimi          | Risto Anton Päärni                                                          |
| Titteli       | Toimitusjohtaja & Pää-arkkitehti, Lifetime Oy                               |
| Kokemusvuodet | 35+ vuotta teollisuuden IT-järjestelmistä                                   |
| AI-kehitys    | 3+ vuotta tuotantotason agenttijärjestelmistä; kirjoittaa koodia päivittäin |
| Koulutus      | YAMK, Smart Factory — Metropolia AMK (lopputyö jätetty 20.6.2026)           |
| Kielet        | Suomi (äidinkieli), englanti (C2), ruotsi (B2)                              |
| GitHub        | 1 500+ suljettua PR:ää dws6-repositoriossa (2024–2026)                      |
| Ohjelmat      | NVIDIA Inception Program, Microsoft Founders Hub L1–L4                      |

### Tekninen osaaminen tähän osa-alueeseen

- AI-avusteinen ohjelmistokehitys: Claude Code CLI päivittäisessä tuotantokäytössä
- +62 % kehitysnopeutuminen MCP Hub -arkkitehtuurilla (YAMK-tutkimus 2026)
- Konttiteknologia: Docker, Docker Compose, Google Cloud Run, GitHub Actions CI/CD
- AWS: IoT Greengrass, Lambda, IoT Core, edge-cloud-hybridiarkkitehtuuri
- On-prem: NVIDIA DGX Spark, Jetson Orin Nano, Ollama
- Tietoturva: RLS, JWT, AES-256-GCM, EU AI Act Article 12, NIS2, GDPR
- TypeScript, Python, React 19, Node.js — tuotantotason arkkitehtuuri
