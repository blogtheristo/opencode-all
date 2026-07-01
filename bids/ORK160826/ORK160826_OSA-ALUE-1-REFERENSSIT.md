# Osa-alue 1 — Agentti- ja tekoälyratkaisujen kehitys

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

## Vaatimuskartoitus — Osa-alue 1

| Vaatimus                                                  | Referenssi                                              | HTP      |
| --------------------------------------------------------- | ------------------------------------------------------- | -------- |
| LLM tuotannossa + RAG-ratkaisu, ≥20 htp                   | Referenssi 1 — DWS IQ 6 RAG-tuotantojärjestelmä         | ~300 htp |
| AWS-ympäristön tekoälyratkaisu, ≥20 htp                   | Referenssi 2 — AWS IoT Greengrass Edge AI               | ~30 htp  |
| On-prem AI-agenttiratkaisu, ≥20 htp                       | Referenssi 3 — NVIDIA DGX Spark on-prem agenttituotanto | ~40 htp  |
| Tuotantokäyttöön viety agenttipohjainen ratkaisu, ≥20 htp | Referenssi 1 — DWS IQ 6 (sama projekti kattaa)          | ~300 htp |

---

## Referenssi 1 — DWS IQ 6: LLM-tuotantojärjestelmä RAG-arkkitehtuurilla

**Kattaa vaatimukset:** LLM tuotannossa + RAG-ratkaisu ≥20 htp; Tuotantokäyttöön viety agenttipohjainen ratkaisu ≥20 htp

**Asiakas / tilaaja:** Lifetime Oy (tuotantokäyttö); loppuasiakkaat: pohjoismaiset teollisuusyritykset (energia, rakennus, logistiikka)
**Ajanjakso:** 2023–2026 (jatkuva)
**Laajuus:** n. 300 htp (Risto Päärni pääkehittäjä 100 %)
**Laskutettu asiakkaille:** Q1/2026 pilottisopimukset 59 900 €; 6 maksavaa asiakasta, MRR 7 000 € (huhtikuu 2026)

**Kuvaus — RAG-ratkaisu tuotannossa:**

15 000+ EU-sääntelydokumentin RAG-hakujärjestelmä on tuotantokäytössä. Kokonaisarkkitehtuuri:

- **RAG-pipeline:** pgvector-semanttinen haku + metadata-suodatus → LLM-yhteenveto → lähdeviitteet; latenssi < 800 ms päästä päähän
- **Vektoritietokanta:** Supabase PostgreSQL + pgvector; 25 toimialaontologiaa kontekstin mallintamiseen
- **LLM-integraatiot:** Claude (Anthropic API, tool calling, streaming), Google Gemini, Groq LPU, LlamaStack, Ollama (paikalliset mallit)
- **Moniagentti-orkestrointi:** 58 agenttia (88 kyvykkyyttä), Model Context Protocol (MCP), deterministinen pisteytys, Zod-validointi
- **Tietoturva:** EU AI Act Article 12 immutable audit trail tuotannossa, RLS, JWT, AES-256-GCM
- **Infra:** Google Cloud Run, Cloudflare Workers, GitHub Actions CI/CD (15 työnkulkua), Docker

**Referenssihenkilö:** Risto Anton Päärni, risto.paarni@lifetime.fi
**Asiakasreferenssi:** Saatavilla pyydettäessä (NDA-suojattu)
**Ulkopuolinen validointi:** Euroopan komissio InvestEU-portaali ×3 (INPO-20254383); NVIDIA Inception Program; Microsoft Founders Hub L1–L4

---

## Referenssi 2 — AWS IoT Greengrass Edge AI -agenttijärjestelmä (on-prem + AWS)

**Kattaa vaatimukset:** AWS-ympäristön tekoälyratkaisu ≥20 htp; On-prem AI-agenttiratkaisu ≥20 htp

**Asiakas / tilaaja:** Lifetime Oy / NVIDIA Inception -ohjelma (hyväksytty kumppaniksi)
**Ajanjakso:** 2024–2026
**Laajuus:** n. 30 htp (Risto Päärni 100 %)

**Kuvaus — AWS + on-prem tekoälyagenttijärjestelmä:**

Kehitetty off-grid tekoälypäättelyjärjestelmä suljettuihin verkkoihin, joka yhdistää AWS-orkestrointikerroksen ja paikallisen laitteistopäättelyn:

- **AWS IoT Greengrass v2:** agentin elinkaarihallinta, OTA-päivitykset, pilvi-edge-synkronointi
- **Paikallinen inference:** LlamaStack + Ollama NVIDIA Jetson Orin Nano -laitteistolla
- **Suorituskyky:** < 100 ms latenssi ensimmäinen token, 7–15 W tehonkulutus
- **Käyttötapaus:** turvallisuuskriittiset ympäristöt, suljetut teollisuusverkot, verkkoyhteydettömät käyttötilanteet
- **Agenttilogiikka:** Python-pohjainen MCP-agentti, AWS Lambda -orkestraattori

**Teknologia:** AWS IoT Greengrass, Python, LlamaStack, Ollama, NVIDIA Jetson Orin Nano, MCP-protokolla, Docker

**Huomio:** Tämä referenssi kattaa sekä AWS-ympäristön (Greengrass orkestraattori) että on-prem -ympäristön (Jetson Orin Nano paikallinen päättely) vaatimukset.

---

## Referenssi 3 — NVIDIA DGX Spark: on-prem agenttituotantoympäristö

**Kattaa vaatimukset:** On-prem AI-agenttiratkaisu ≥20 htp

**Asiakas / tilaaja:** Lifetime Oy (sisäinen tuotantoympäristö, 24/7-käyttö)
**Ajanjakso:** 2025–2026 (jatkuva)
**Laajuus:** n. 40 htp (asennus, konfigurointi, tuotantokäyttö, kehitys)

**Kuvaus — Täysin suvereenin on-prem AI-agenttituotantoympäristö:**

NVIDIA DGX Spark toimii Lifetime Oy:n tuotantoympäristön primääripalvelimena täysin ilman pilviyhteyttä:

- **Laitteisto:** NVIDIA DGX Spark, 128 GB yhtenäinen muisti, ~250 W
- **Tehtävä:** Primääri cron-ajastinpalvelin 15 tuotantotyönkululle (24/7)
- **Mallit:** Ollama + paikalliset LLM-mallit (Llama 3.3 70B, Qwen 2.5)
- **Failover:** GitHub Actions aktivoituu automaattisesti vain DGX Sparkin vikatilanteessa
- **Agenttikehitys:** Claude Code CLI päivittäisessä tuotantokäytössä kehitystyöhön
- **Tietosuoja:** 100 % paikallinen — data ei poistu organisaation hallinnasta

**Teknologia:** NVIDIA DGX Spark, Ollama, Docker Compose, GitHub Actions, Ubuntu/DGX OS

---

## Avainasiantuntija: Risto Anton Päärni

| Kenttä         | Tieto                                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| Nimi           | Risto Anton Päärni                                                           |
| Titteli        | Toimitusjohtaja & Pää-arkkitehti, Lifetime Oy                                |
| Kokemusvuodet  | 35+ vuotta teollisuuden IT-järjestelmistä                                    |
| Tekoälykokemus | 3+ vuotta tuotantotason agenttijärjestelmistä (kirjoittaa koodia päivittäin) |
| Koulutus       | YAMK, Smart Factory — Metropolia AMK (lopputyö jätetty 20.6.2026)            |
| Kielet         | Suomi (äidinkieli), englanti (C2), ruotsi (B2)                               |
| Sijainti       | Espoo, Finland                                                               |
| Ohjelmat       | NVIDIA Inception Program, Microsoft Founders Hub L1–L4                       |
| GitHub         | 1 500+ suljettua PR:ää dws6-repositoriossa (2024–2026)                       |

### Tekninen osaaminen tähän osa-alueeseen

- Moniagentti-orkestrointi: MCP-protokolla, TypeScript/Python, 58 agentin tuotantojärjestelmä
- RAG-arkkitehtuuri: pgvector, semanttinen haku, < 800 ms latenssi, 15 000+ dokumenttia
- LLM-integraatiot: Claude API, Gemini, Groq, LlamaStack, Ollama
- AWS: IoT Greengrass, Lambda, edge-cloud-hybridiarkkitehtuuri
- On-prem: NVIDIA DGX Spark + Jetson Orin Nano, Ollama, suljetut verkot
- EU AI Act Article 12 lokitus, NIS2, GDPR tietoturva-arkkitehtuuri
