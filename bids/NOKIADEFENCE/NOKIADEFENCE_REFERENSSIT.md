# Referenssit | Nokia Defence

## EU Sovereign AI, Edge AI, NIS2/EU AI Act, Agenttijärjestelmät tuotannossa

---

VERSION AND AGENT HISTORY
Version: 1.0 | 2026-06-27 | Claude Sonnet 4.6 | Luotu Nokia Defence -tarjousta varten

---

**Tarjoaja:** Lifetime Oy | Y-tunnus: 0772407-9
**Vastaanottaja:** Nokia Defence (Nokia Corporation) | Tommi Haapala, Senior Advisor
**Päiväys:** 27.6.2026

---

## Referenssikartoitus — Nokia Defencen prioriteetit

| Nokia Defencen prioriteetti                     | Referenssi                                                  |
| ----------------------------------------------- | ----------------------------------------------------------- |
| EU Sovereign AI — ei CLOUD Act -altistusta      | Referenssi 1 — DWS IQ 6 EU-suvereeni arkkitehtuuri          |
| Edge AI, offline-päättely suljetuissa verkoissa | Referenssi 2 — NVIDIA Jetson Orin Nano + AWS Greengrass     |
| NVIDIA-laitteisto on-prem tuotannossa           | Referenssi 3 — NVIDIA DGX Spark 24/7 -tuotanto              |
| NIS2 / EU AI Act -vaatimustenmukaisuus          | Referenssi 4 — EU AI Act Article 12 audit trail tuotannossa |
| Agenttijärjestelmät kriittisissä ympäristöissä  | Referenssi 1 — 16+ agentin moniagentti-orkestrointi         |

---

## Referenssi 1 — DWS IQ 6: EU-suvereeni moniagentti-tuotantojärjestelmä

**Relevanssi Nokia Defencelle:** EU Sovereign AI, CLOUD Act -riskien välttäminen, agenttijärjestelmät tuotannossa

**Asiakas / tilaaja:** Lifetime Oy (tuotantokäyttö); loppuasiakkaat: pohjoismaiset teollisuusyritykset
**Ajanjakso:** 2023–2026 (jatkuva)
**Laajuus:** n. 300 htp (Risto Päärni pääkehittäjä 100 %)
**Liikevaihto Q1/2026:** Pilottisopimukset 59 900 €; 6 maksavaa asiakasta, MRR 7 000 €

**Kuvaus — EU-suvereeni agenttiarkkitehtuuri:**

DWS IQ 6 on rakennettu alusta alkaen EU-suvereenille perustalle. Tämä vastaa suoraan Nokia Defencen vaatimusta CLOUD Act -riskien välttämisestä:

- **Ei US-pilvipalveluja kriittisessä datapolussa:** NVIDIA DGX Spark on-prem primääripalvelimena, paikalliset LLM-mallit (Llama 3.3 70B, Qwen 2.5 72B)
- **Moniagentti-orkestrointi:** 16+ TypeScript-agenttia, Model Context Protocol (MCP), Brain-Memory-Body-Hands -arkkitehtuuri
- **Deterministinen pisteytys ja Zod-validointi** — luotettava toiminta kriittisissä prosesseissa
- **Tietoturva:** AES-256-GCM, TLS 1.3, BYOK/CMEK, Row-Level Security, JWT
- **RAG-tiedonhaku:** 15 000+ EU-sääntelydokumenttia, pgvector, latenssi < 800 ms
- **Infra:** Google Cloud Run (EU-alue), Cloudflare Workers, GitHub Actions CI/CD

**Relevanssi Nokia Defencen EU Sovereign AI -strategiaan:**
Sama arkkitehtuuri, jolla Nokia Defence voi varmistaa, että agenttipäätökset, doktriiniasiakirjat ja operatiivinen data pysyvät EU-lainkäyttöalueen sisällä ilman altistusta US CLOUD Act:ille.

**Referenssihenkilö:** Risto Anton Päärni, risto.paarni@lifetime.fi
**Ulkopuolinen validointi:** Euroopan komissio InvestEU ×3 (INPO-20254383); NVIDIA Inception Program; Microsoft Founders Hub L1–L4

---

## Referenssi 2 — Edge AI suljetuissa verkoissa: NVIDIA Jetson Orin Nano + AWS IoT Greengrass

**Relevanssi Nokia Defencelle:** Edge AI kenttäkäyttöön, offline-päättely, suljetut verkot, kaksikäyttö

**Asiakas / tilaaja:** Lifetime Oy / NVIDIA Inception Program
**Ajanjakso:** 2024–2026
**Laajuus:** n. 30 htp (Risto Päärni 100 %)

**Kuvaus — Off-grid tekoälypäättelyjärjestelmä:**

Kehitetty tekoälypäättelyjärjestelmä, joka toimii täysin ilman verkkoyhteyttä — suunniteltu turvallisuuskriittisiin ja suljettuihin ympäristöihin:

- **Laitteisto:** NVIDIA Jetson Orin Nano (7–15 W tehonkulutus, alle 100 ms latenssi ensimmäiseen tokeniin)
- **Paikalliset mallit:** LlamaStack + Ollama, täysin offline
- **Orkestraatio:** AWS IoT Greengrass v2 — agentin elinkaarihallinta, OTA-päivitykset, pilvi-edge-synkronointi kun yhteys saatavilla
- **Agenttilogiikka:** Python-pohjainen MCP-agentti, AWS Lambda -orkestraattori
- **Käyttötapaukset:** turvallisuuskriittiset ympäristöt, suljetut teollisuusverkot, verkkoyhteydettömät tilanteet

**Soveltuvuus Nokia Defencelle:**
NVIDIA Jetson Orin Nano soveltuu kenttäkäyttöisiin edge-solmuihin, joissa verkkoyhteys ei ole taattu. Sama arkkitehtuuri on skaalattavissa puolustus- ja kaksikäyttösovelluksiin: paikalliset päätökset ilman pilviyhteyttä, mutta synkronointi keskusjärjestelmään kun yhteys saatavilla.

**Teknologia:** NVIDIA Jetson Orin Nano, LlamaStack, Ollama, AWS IoT Greengrass, Python, MCP, Docker

---

## Referenssi 3 — NVIDIA DGX Spark: Sovereign on-prem agenttituotantoympäristö

**Relevanssi Nokia Defencelle:** Sovereign AI -laitteisto, on-prem tuotantokäyttö, ei CLOUD Act -altistusta

**Asiakas / tilaaja:** Lifetime Oy (sisäinen tuotantoympäristö, 24/7-käyttö)
**Ajanjakso:** 2025–2026 (jatkuva)
**Laajuus:** n. 40 htp (asennus, konfigurointi, tuotantokäyttö, kehitys)

**Kuvaus — NVIDIA DGX Spark primääripalvelimena:**

Lifetime Oy käyttää NVIDIA DGX Spark -laitteistoa omana tuotantoprimääriserverinä — käytännön kokemus, jonka voi replikoida Nokia Defencen ympäristöön:

- **Laitteisto:** NVIDIA DGX Spark, 128 GB yhtenäinen muisti, ~250 W
- **Rooli:** Primääri cron-ajastinpalvelin 15 tuotantotyönkululle (24/7)
- **Mallit:** Ollama + paikalliset LLM-mallit (Llama 3.3 70B, Qwen 2.5 72B)
- **Tietosuoja:** 100 % paikallinen — data ei poistu organisaation hallinnasta missään tilanteessa
- **Failover:** GitHub Actions aktivoituu automaattisesti vain DGX Sparkin vikatilanteessa
- **Kehitysympäristö:** Claude Code CLI päivittäisessä tuotantokäytössä

**Soveltuvuus Nokia Defencelle:**
DGX Spark -referenssi osoittaa, että Lifetime Oy:llä on käytännön kokemus sovereign AI -laitteiston asentamisesta, konfiguroinnista ja 24/7-tuotantokäytöstä. Nokia Defence voi saada saman osaamisen käyttöön ilman oppimiskäyrää.

**Teknologia:** NVIDIA DGX Spark, Ollama, Docker Compose, GitHub Actions, Ubuntu/DGX OS

---

## Referenssi 4 — EU AI Act Article 12: Immutable Audit Trail tuotannossa

**Relevanssi Nokia Defencelle:** EU AI Act -vaatimustenmukaisuus, NIS2, audit trail kriittisissä järjestelmissä

**Asiakas / tilaaja:** Lifetime Oy (DWS IQ 6 -tuotantojärjestelmä)
**Ajanjakso:** 2024–2026 (jatkuva)
**Laajuus:** integroitu osa DWS IQ 6 -alustaa (Risto Päärni 100 %)

**Kuvaus — EU AI Act Article 12 -lokitus tuotannossa:**

DWS IQ 6 on ensimmäinen tunnettava suomalainen tekoälyalusta, jossa EU AI Act Article 12 -vaatimusten mukainen immutable audit trail on tuotantokäytössä:

- **Jokainen agenttipäätös lokitetaan:** aikaleima, päätöspolku (reasoning lineage), käytetty malli, syöte, tuloste
- **Immutable:** lokimerkintöjä ei voi muuttaa tai poistaa jälkikäteen
- **Sovereignty audit -kehys:** kuka, milloin, millä mallilla, missä (EU vai ei)
- **Article 9 riskienhallinta:** riskiluokittelu integroitu agenttipäätösprosessiin
- **NIS2-yhteensopivuus:** SOC-prosessit, auditointivalmius, kriittisten toimijoiden vaatimukset
- **GDPR:** RLS, tietojenkäsittelysopimukset, DPIA-valmius

**Soveltuvuus Nokia Defencelle:**
Nokia Defence tarvitsee EU AI Act- ja NIS2-vaatimusten mukaisen audit trail -järjestelmän. Lifetime Oy:llä on tämä jo tuotannossa — ei prototyyppi, vaan toimiva järjestelmä, joka on skaalattavissa Nokia Defencen tarpeisiin.

**Teknologia:** Supabase PostgreSQL, immutable logging, RLS, JWT, AES-256-GCM, TLS 1.3

---

## Avainasiantuntija: Risto Anton Päärni

| Kenttä         | Tieto                                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| Nimi           | Risto Anton Päärni                                                           |
| Titteli        | Toimitusjohtaja & Pää-arkkitehti, Lifetime Oy                                |
| Kokemusvuodet  | 35+ vuotta teollisuuden IT-järjestelmistä                                    |
| Tekoälykokemus | 3+ vuotta tuotantotason agenttijärjestelmistä (kirjoittaa koodia päivittäin) |
| Sovereign AI   | NVIDIA DGX Spark + Jetson Orin Nano tuotannossa                              |
| Compliance     | EU AI Act Article 12, NIS2, GDPR, ISO 27001 (Q3/2026)                        |
| Koulutus       | YAMK, Smart Factory — Metropolia AMK (lopputyö jätetty 20.6.2026)            |
| Kielet         | Suomi (äidinkieli), englanti (C2), ruotsi (B2)                               |
| Sijainti       | Espoo, Finland                                                               |
| Kumppanuudet   | NVIDIA Inception Program, Microsoft Founders Hub L1–L4                       |
| GitHub         | 1 500+ suljettua PR:ää dws6-repositoriossa (2024–2026)                       |

### Tekninen osaaminen Nokia Defencen kannalta

- **EU Sovereign AI:** NVIDIA DGX Spark on-prem, paikalliset LLM-mallit, nolla CLOUD Act -altistusta
- **Edge AI:** NVIDIA Jetson Orin Nano, offline-päättely < 100 ms, 7–15 W, suljetut verkot
- **Agenttijärjestelmät:** 16+ agentin moniagentti-orkestrointi, MCP-protokolla, Brain-Memory-Body-Hands
- **Compliance:** EU AI Act Article 12 tuotannossa, NIS2, GDPR, Zero Trust
- **Tietoturva:** AES-256-GCM, TLS 1.3, BYOK/CMEK, immutable audit logging, RLS

---

_Lifetime Oy | Y-tunnus: 0772407-9 | VAT: FI07724079_
_Laidunmaanraitti 2 A 25, 02330 Espoo, Finland_
_risto.paarni@lifetime.fi_
