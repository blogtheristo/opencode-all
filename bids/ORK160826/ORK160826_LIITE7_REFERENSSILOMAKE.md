# Liite 7 — Referenssilomake | ORK/1462/2026

## Tekoälyn asiantuntijapalvelut — Lifetime Oy

---

VERSION AND AGENT HISTORY
Version: 1.0 | 2026-06-27 | Claude Sonnet 4.6 | Luotu tarjouspyynnön Liite 7 -pohjan mukaiseksi

---

---

**Tarjoaja:** Lifetime Oy | Y-tunnus: 0772407-9
**Yhteyshenkilö:** Risto Anton Päärni | risto.paarni@lifetime.fi
**Päiväys:** 27.6.2026

---

## OSA-ALUE 1 — Agentti- ja tekoälyratkaisujen kehitys

### Referenssi 1A — LLM tuotannossa + RAG-ratkaisu ≥20 htp

| Kenttä                              | Tieto                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Projektin / toimeksiannon nimi**  | DWS IQ 6 — LLM-tuotantojärjestelmä RAG-arkkitehtuurilla                                                                                                                                                                                                                                                                                                                                   |
| **Tilaaja / asiakas**               | Lifetime Oy (tuotantokäyttö); loppuasiakkaat: pohjoismaiset teollisuusyritykset                                                                                                                                                                                                                                                                                                           |
| **Tilaajan yhteyshenkilö**          | Risto Anton Päärni, risto.paarni@lifetime.fi                                                                                                                                                                                                                                                                                                                                              |
| **Toimeksiannon arvo (ALV 0 %)**    | 59 900 € (Q1/2026 pilottisopimukset; MRR 7 000 €/kk)                                                                                                                                                                                                                                                                                                                                      |
| **Laajuus (htp)**                   | n. 300 htp                                                                                                                                                                                                                                                                                                                                                                                |
| **Ajanjakso**                       | 2023–2026 (jatkuva)                                                                                                                                                                                                                                                                                                                                                                       |
| **Tarjoajan rooli**                 | Pää-arkkitehti ja pääkehittäjä (100 %)                                                                                                                                                                                                                                                                                                                                                    |
| **Kuvaus**                          | 15 000+ EU-sääntelydokumentin RAG-hakujärjestelmä tuotannossa. pgvector-semanttinen haku + metadata-suodatus + LLM-yhteenveto alle 800 ms. 58 agenttia (88 kyvykkyyttä), MCP-protokolla, Claude API (tool calling, streaming). EU AI Act Article 12 immutable audit trail. Supabase PostgreSQL + pgvector, Google Cloud Run, Cloudflare Workers, GitHub Actions CI/CD (15 työnkulkua), Docker. |
| **Vaatimus jota referenssi kattaa** | LLM tuotantoympäristössä + RAG-ratkaisu ≥20 htp                                                                                                                                                                                                                                                                                                                                           |

---

### Referenssi 1B — AWS-ympäristön tekoälyratkaisu ≥20 htp

| Kenttä                              | Tieto                                                                                                                                                                                                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Projektin / toimeksiannon nimi**  | AWS IoT Greengrass Edge AI -agenttijärjestelmä                                                                                                                                                                                                                               |
| **Tilaaja / asiakas**               | Lifetime Oy / NVIDIA Inception -ohjelma                                                                                                                                                                                                                                      |
| **Tilaajan yhteyshenkilö**          | Risto Anton Päärni, risto.paarni@lifetime.fi                                                                                                                                                                                                                                 |
| **Toimeksiannon arvo (ALV 0 %)**    | 15 000 € (kehityskustannus)                                                                                                                                                                                                                                                  |
| **Laajuus (htp)**                   | n. 30 htp                                                                                                                                                                                                                                                                    |
| **Ajanjakso**                       | 2024–2026                                                                                                                                                                                                                                                                    |
| **Tarjoajan rooli**                 | Pää-arkkitehti ja -kehittäjä (100 %)                                                                                                                                                                                                                                         |
| **Kuvaus**                          | AWS IoT Greengrass v2 -pohjainen edge AI -agenttijärjestelmä suljettuihin verkkoihin. AWS Lambda -orkestraattori, OTA-päivitykset, pilvi-edge-synkronointi. Paikallinen inference: LlamaStack + Ollama NVIDIA Jetson Orin Nano -laitteistolla, alle 100 ms latenssi, 7–15 W. |
| **Vaatimus jota referenssi kattaa** | AWS-ympäristön tekoälyratkaisu ≥20 htp                                                                                                                                                                                                                                       |

---

### Referenssi 1C — On-prem AI-agenttiratkaisu ≥20 htp

| Kenttä                              | Tieto                                                                                                                                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Projektin / toimeksiannon nimi**  | NVIDIA DGX Spark — on-prem agenttituotantoympäristö                                                                                                                                                                            |
| **Tilaaja / asiakas**               | Lifetime Oy (sisäinen tuotantoympäristö, 24/7-käyttö)                                                                                                                                                                          |
| **Tilaajan yhteyshenkilö**          | Risto Anton Päärni, risto.paarni@lifetime.fi                                                                                                                                                                                   |
| **Toimeksiannon arvo (ALV 0 %)**    | 8 000 € (laitteisto + käyttöönotto + kehitys)                                                                                                                                                                                  |
| **Laajuus (htp)**                   | n. 40 htp                                                                                                                                                                                                                      |
| **Ajanjakso**                       | 2025–2026 (jatkuva)                                                                                                                                                                                                            |
| **Tarjoajan rooli**                 | Pää-arkkitehti ja -kehittäjä (100 %)                                                                                                                                                                                           |
| **Kuvaus**                          | NVIDIA DGX Spark primääripalvelimena 15 tuotantotyönkululle 24/7. Ollama + paikalliset LLM-mallit (Llama 3.3 70B, Qwen 2.5). Docker Compose. GitHub Actions failover. 100 % on-prem, data ei poistu organisaation hallinnasta. |
| **Vaatimus jota referenssi kattaa** | On-prem AI-agenttiratkaisu ≥20 htp; Tuotantokäyttöön viety agenttipohjainen ratkaisu ≥20 htp                                                                                                                                   |

---

## OSA-ALUE 2 — Asiakasratkaisujen ja -prosessien kehityksen tuki

### Referenssi 2A — Tekoälyn hallintamalli asiakasorganisaatiolle ≥20 htp

| Kenttä                              | Tieto                                                                                                                                                                                                                                                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Projektin / toimeksiannon nimi**  | Claude Code -valmennusohjelma: EU AI Act 4 artiklan mukainen AI-hallintamalli                                                                                                                                                                                                                              |
| **Tilaaja / asiakas**               | EU-organisaatiot (useita toimeksiantoja; yksityiskohtaisemmat tiedot NDA-suojattu)                                                                                                                                                                                                                         |
| **Tilaajan yhteyshenkilö**          | Saatavilla pyydettäessä                                                                                                                                                                                                                                                                                    |
| **Toimeksiannon arvo (ALV 0 %)**    | 5 000 € / toimeksianto (useita)                                                                                                                                                                                                                                                                            |
| **Laajuus (htp)**                   | n. 25 htp / toimeksianto                                                                                                                                                                                                                                                                                   |
| **Ajanjakso**                       | 2025–2026                                                                                                                                                                                                                                                                                                  |
| **Tarjoajan rooli**                 | Ohjelman suunnittelija, kouluttaja ja toimittaja (100 %)                                                                                                                                                                                                                                                   |
| **Kuvaus**                          | Claude Code -valmennusohjelma tuottaa asiakasorganisaatiolle kirjallisen AI-käyttöpolitiikan, EU AI Act 4 artiklan mukaisen tekoälylukutaitonäytön ja GREEN/YELLOW/RED -luottamusraja-dokumentaation. 1 pv luento + 2 pv työpaja + valinnainen 2–6 vk ohjattu projektijakso. Max 10–12 osallistujaa/ryhmä. |
| **Vaatimus jota referenssi kattaa** | Tekoälyn hallintamallin tuottaminen asiakasorganisaatiolle ≥20 htp                                                                                                                                                                                                                                         |

---

### Referenssi 2B — Asiakaskonsultointi AI-pohjainen prosessikehitys ≥20 htp

| Kenttä                              | Tieto                                                                                                                                                                                                                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Projektin / toimeksiannon nimi**  | EU-sääntelyautomatisoinnin asiakaskonsultointi (prosessikehitys AI:n avulla)                                                                                                                                                                                                                 |
| **Tilaaja / asiakas**               | Pohjoismaiset teollisuusyritykset (energia, rakennus, logistiikka) — NDA-suojattu                                                                                                                                                                                                            |
| **Tilaajan yhteyshenkilö**          | Saatavilla pyydettäessä (asiakasreferenssikirje toimitettavissa)                                                                                                                                                                                                                             |
| **Toimeksiannon arvo (ALV 0 %)**    | 59 900 € (Q1/2026 pilottisopimukset)                                                                                                                                                                                                                                                         |
| **Laajuus (htp)**                   | n. 60 htp                                                                                                                                                                                                                                                                                    |
| **Ajanjakso**                       | Q4/2025–Q2/2026                                                                                                                                                                                                                                                                              |
| **Tarjoajan rooli**                 | Pää-konsultti ja arkkitehti (100 %)                                                                                                                                                                                                                                                          |
| **Kuvaus**                          | Tekoälypohjainen prosessikehityskonsultointi: nykytila-analyysi → toimintamallin suunnittelu → pilottitoteutus → koulutus ja käyttöönotto. Asiakaskohtainen EU-sääntelyanalyysiagentin räätälöinti. Manuaalisen työn vähenemä 70–80 % raportoinnissa. MRR-pohjainen jatkuva tuki 7 000 €/kk. |
| **Vaatimus jota referenssi kattaa** | Asiakaskonsultointi AI-pohjainen prosessikehitys ≥20 htp; Tuotantoon viety agenttipohjainen ratkaisu, toimittaja suunnitellut kokonaisuuden                                                                                                                                                  |

---

### Referenssi 2C — Tuotantoon viety agenttipohjainen ratkaisu (palvelukokonaisuus)

| Kenttä                              | Tieto                                                                                                                                                                                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Projektin / toimeksiannon nimi**  | DWS IQ 6 asiakasportaali — agenttipohjainen palvelukokonaisuus                                                                                                                                                                                                                 |
| **Tilaaja / asiakas**               | DWS IQ 6 SaaS-asiakkaat (pohjoismaiset teollisuusyritykset)                                                                                                                                                                                                                    |
| **Tilaajan yhteyshenkilö**          | Risto Anton Päärni, risto.paarni@lifetime.fi                                                                                                                                                                                                                                   |
| **Toimeksiannon arvo (ALV 0 %)**    | 59 900 € + MRR 7 000 €/kk                                                                                                                                                                                                                                                      |
| **Laajuus (htp)**                   | n. 120 htp                                                                                                                                                                                                                                                                     |
| **Ajanjakso**                       | 2024–2026 (jatkuva)                                                                                                                                                                                                                                                            |
| **Tarjoajan rooli**                 | Palvelukokonaisuuden suunnittelija, arkkitehti ja pääkehittäjä (100 %)                                                                                                                                                                                                         |
| **Kuvaus**                          | Suunniteltu alusta loppuun: KYA-profilointi → automatisoitu nykytila-analyysi → agenttikohtainen toimenpidesuositus → raportointi. Onboarding-automaatti alle 24 h tilauksesta. React 19 -portaali, Supabase-backend, RLS, Google Cloud Run. 6 maksavaa asiakasta tuotannossa. |
| **Vaatimus jota referenssi kattaa** | Tuotantoon viety agenttipohjainen ratkaisu, toimittaja suunnitellut palvelukokonaisuuden                                                                                                                                                                                       |

---

## OSA-ALUE 3 — Agenttipohjainen järjestelmäkehitys

### Referenssi 3A — AI-avusteinen kehitys + merkittävä nopeutuminen

| Kenttä                              | Tieto                                                                                                                                                                                                                                                             |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Projektin / toimeksiannon nimi**  | DWS IQ 6 — AI-avusteinen agenttijärjestelmäkehitys (Claude Code + MCP Hub, +62 % velocity)                                                                                                                                                                        |
| **Tilaaja / asiakas**               | Lifetime Oy / pohjoismaiset teollisuusasiakkaat                                                                                                                                                                                                                   |
| **Tilaajan yhteyshenkilö**          | Risto Anton Päärni, risto.paarni@lifetime.fi                                                                                                                                                                                                                      |
| **Toimeksiannon arvo (ALV 0 %)**    | 59 900 € (Q1/2026)                                                                                                                                                                                                                                                |
| **Laajuus (htp)**                   | n. 300 htp                                                                                                                                                                                                                                                        |
| **Ajanjakso**                       | 2023–2026 (jatkuva)                                                                                                                                                                                                                                               |
| **Tarjoajan rooli**                 | Pää-arkkitehti ja -kehittäjä (100 %)                                                                                                                                                                                                                              |
| **Kuvaus**                          | Kehitetty Claude Code CLI:llä päivittäin. YAMK-tutkimus (Metropolia 2026): +62 % kehitysnopeus MCP Hub -käyttöönoton jälkeen. 1 500+ suljettua PR:ää, 15 GitHub Actions -työnkulkua. 58 agenttia (88 kyvykkyyttä) tuotannossa. Brain-Memory-Body-Hands -arkkitehtuuri. |
| **Vaatimus jota referenssi kattaa** | AI-avusteinen ohjelmistokehitys + merkittävä kehitysnopeuden tehostaminen; Tuotantoohjelmisto pääsääntöisesti tekoälyllä                                                                                                                                          |

---

### Referenssi 3B — AWS/on-prem ohjelmisto tekoälypohjaisesti

| Kenttä                              | Tieto                                                                                                                                                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Projektin / toimeksiannon nimi**  | AWS IoT Greengrass + NVIDIA DGX Spark — on-prem AI-ohjelmisto                                                                                                                                                                              |
| **Tilaaja / asiakas**               | Lifetime Oy / NVIDIA Inception -ohjelma                                                                                                                                                                                                    |
| **Tilaajan yhteyshenkilö**          | Risto Anton Päärni, risto.paarni@lifetime.fi                                                                                                                                                                                               |
| **Toimeksiannon arvo (ALV 0 %)**    | 15 000 €                                                                                                                                                                                                                                   |
| **Laajuus (htp)**                   | n. 30 htp                                                                                                                                                                                                                                  |
| **Ajanjakso**                       | 2024–2026                                                                                                                                                                                                                                  |
| **Tarjoajan rooli**                 | Pää-arkkitehti ja -kehittäjä (100 %)                                                                                                                                                                                                       |
| **Kuvaus**                          | AWS IoT Greengrass v2 + AWS Lambda + NVIDIA DGX Spark (on-prem) + NVIDIA Jetson Orin Nano. Tekoälypohjainen hybridijärjestelmä: pilvi-orkestraattori + paikallinen LLM-inference. Kaikki ohjelmistokomponentit toteutettu AI-avusteisesti. |
| **Vaatimus jota referenssi kattaa** | AWS tai on-prem ohjelmisto tekoälypohjaisesti                                                                                                                                                                                              |

---

### Referenssi 3C — Konttiteknologia tuotannossa ≥50 htp

| Kenttä                              | Tieto                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Projektin / toimeksiannon nimi**  | DWS IQ 6 Docker-tuotantojärjestelmä (konttiteknologia)                                                                                                                                                                                                                                                                                                          |
| **Tilaaja / asiakas**               | Lifetime Oy / pohjoismaiset teollisuusasiakkaat                                                                                                                                                                                                                                                                                                                 |
| **Tilaajan yhteyshenkilö**          | Risto Anton Päärni, risto.paarni@lifetime.fi                                                                                                                                                                                                                                                                                                                    |
| **Toimeksiannon arvo (ALV 0 %)**    | 59 900 € (osa kokonaisarkkitehtuurista)                                                                                                                                                                                                                                                                                                                         |
| **Laajuus (htp)**                   | n. 120 htp                                                                                                                                                                                                                                                                                                                                                      |
| **Ajanjakso**                       | 2024–2026 (jatkuva)                                                                                                                                                                                                                                                                                                                                             |
| **Tarjoajan rooli**                 | Pää-arkkitehti ja DevOps-insinööri (100 %)                                                                                                                                                                                                                                                                                                                      |
| **Kuvaus**                          | Docker-pohjainen tuotantojärjestelmä: Google Cloud Run (kontitetut backend-palvelut, automaattinen skaalaus), NVIDIA DGX Spark (Docker Compose, paikalliset AI-palvelut), Cloudflare Workers (edge). 15 GitHub Actions -työnkulkua: automaattinen konttirakentaminen, Trivy-haavoittuvuusskannaus, automaattinen deploy. 1 500+ PR kaikki CI/CD-putkiston läpi. |
| **Vaatimus jota referenssi kattaa** | Konttiteknologiaa hyödyntävä tuotantoohjelmisto ≥50 htp                                                                                                                                                                                                                                                                                                         |

---

_Lifetime Oy | Y-tunnus: 0772407-9 | VAT: FI07724079_
_Laidunmaanraitti 2 A 25, 02330 Espoo, Finland_
_risto.paarni@lifetime.fi_
