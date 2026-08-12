# Tarjouskirje

## DWS IQ Aegis Defence -alusta ja tekoälyn asiantuntijapalvelut — Nokia Defence

***

VERSION AND AGENT HISTORY
Version: 1.0 | 2026-06-27 | Claude Sonnet 4.6 | Luotu Nokia Defence -tarjousta varten

***

**Vastaanottaja:**
Nokia Defence (Nokia Corporation)
Yhteyshenkilö: Tommi Haapala, Senior Advisor
tommi.haapala@nokia.com

> **LUOTTAMUKSELLISUUS (NDA).** Tämä tarjouspaketti on osoitettu vastaanottajalle itselleen. Vastaanottajaa **ei saa nimetä puolustusalan vastapuolena** missään kolmannelle osapuolelle menevässä aineistossa — sijoittaja-, myynti-, rahoitus- tai julkisessa materiaalissa käytetään ilmaisua **"puolustusalan päähankkija"**. NDA kattaa neuvottelut ja kumppanuuden ja sisältää 100 000 euron sopimussakon. Ks. `docs/TRACTION_CANONICAL.md` §3.

**Viite:** NDA Nokia / Lifetime Oy — Partners/NDA_NOKIA_2026.md
**Päiväys:** 27.6.2026

**Tarjoaja:**
Lifetime Oy
Y-tunnus: 0772407-9
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland
VAT: FI07724079
Yhteyshenkilö: Risto Anton Päärni, toimitusjohtaja
Sähköposti: risto.paarni@lifetime.fi

---

## Tarjouksen kohde

Lifetime Oy tarjoaa Nokia Defencelle **DWS IQ Aegis Defence -alustan** ja siihen liittyvät **tekoälyn asiantuntijapalvelut**. Palvelut kattavat EU-suvereenin tekoälytoteutuksen puolustus- ja kaksikäyttösovelluksiin, NIS2- ja EU AI Act -vaatimustenmukaisuuden sekä CLOUD Act -riskien välttämisen avoimen lähdekoodin ja paikallisen laitteiston avulla.

Tämä tarjous perustuu olemassa olevaan NDA-sopimukseen Lifetime Oy:n ja Nokian välillä (Partners/NDA_NOKIA_2026.md).

---

## Tarjoajan esittely

Lifetime Oy on suomalainen tekoäly- ja ohjelmistoyritys, jonka toimitusjohtaja ja pää-arkkitehti Risto Anton Päärni on rakentanut **DWS IQ 6 -alustan** — 16+ tekoälyagentin tuotantojärjestelmän EU-suvereenilla arkkitehtuurilla. Yrityksen ydinosaaminen vastaa Nokia Defencen strategisia prioriteetteja:

**EU-suvereenin tekoälyn toteutus**

- NVIDIA DGX Spark on-prem tuotannossa 24/7 — data ei poistu organisaation hallinnasta
- 100 % EU-lainmukaisuus: GDPR, NIS2, EU AI Act Article 12
- Nolla CLOUD Act -altistusta: ei US-pilvipalveluja kriittisessä datapolussa

**Puolustus- ja kaksikäyttökyvykkyydet**

- Edge AI: NVIDIA Jetson Orin Nano, offline-päättely alle 100 ms, 7–15 W, suljetut verkot
- Immutable audit trail (Article 12) tuotannossa — kriittisten järjestelmien vaatimusten mukainen
- Zero Trust -arkkitehtuuri, AES-256-GCM, TLS 1.3, BYOK/CMEK
- Brain-Memory-Body-Hands -agenttiarkkitehtuuri soveltuu C2-järjestelmiin ja tiedustelun automatisointiin

**Vaatimustenmukaisuus**

- EU AI Act Article 12: lokivaatimukset tuotannossa
- NIS2: kriittisten toimijoiden tietoturva-arkkitehtuuri
- GDPR: tietojenkäsittelysopimukset, DPIA, RLS
- ISO 27001: ISMS-suunnittelu, sertifiointivalmistelu Q3/2026

**Kumppanuudet ja validointi**

- NVIDIA Inception Program -kumppani
- Microsoft Founders Hub L1–L4
- Euroopan komissio InvestEU-portaali ×3 (INPO-20254383)

---

## DWS IQ Aegis Defence -alusta

DWS IQ Aegis Defence on Lifetime Oy:n puolustus- ja kaksikäyttösovelluksiin sopeutettu versio DWS IQ 6 -alustasta. Keskeisiä ominaisuuksia Nokia Defencen kannalta:

**Agenttinen orkestrointi (16+ agentit tuotannossa)**

- Model Context Protocol (MCP) — avoin standardi agenttiyhteistyölle
- Deterministinen pisteytys ja Zod-validointi — luotettava toiminta kriittisissä ympäristöissä
- Structured output, tool calling, reasoning lineage

**Sovereign AI -arkkitehtuuri**

- NVIDIA DGX Spark primääripalvelimena — ei pilviyhteyttä tarvita
- Paikalliset LLM-mallit: Llama 3.3 70B, Qwen 2.5 72B
- Edge-solmut: NVIDIA Jetson Orin Nano suljetuissa verkoissa

**RAG-tiedonhaku**

- Semanttinen haku + metadata-suodatus pgvector-kannasta
- Latenssi < 800 ms päästä päähän
- Soveltuu doktriini-, sääntely- ja teknisten asiakirjojen hakuun

**Audit ja compliance**

- Immutable audit trail (EU AI Act Article 12) — jokaisesta agenttipäätöksestä lokimerkintä
- Reasoning lineage: päätöspolun jäljitettävyys
- Sovereignty audit -kirjanpitokehys

---

## Ehdotettu yhteistyömalli

Lifetime Oy ehdottaa seuraavia yhteistyömalleja Nokia Defencelle:

1. **Pilottiprojekti** — 20–40 h: Sovereign AI -arkkitehtuurin arviointi ja proof-of-concept Nokia Defencen valitsemassa käyttötapauksessa
2. **Asiantuntijapalvelut** — tuntipohjaisesti: EU AI Act / NIS2 -vaatimustenmukaisuuden arkkitehtipalvelut
3. **Alustalisensointi + integraatio** — DWS IQ Aegis Defence -alustan räätälöinti ja käyttöönotto Nokia Defencen ympäristössä
4. **Edge AI -käyttöönotto** — NVIDIA Jetson Orin Nano -pohjainen offline-päättelyjärjestelmä kenttäkäyttöön

---

## Sitoumus

Lifetime Oy sitoutuu:

- Toimimaan NDA-sopimuksen (Partners/NDA_NOKIA_2026.md) mukaisesti täydellä luottamuksellisuudella
- Toimittamaan kaikki materiaalit EU-suvereenisti — ei US-lainkäyttöalueen pilvipalveluja
- Pitämään datan 100 % Nokian tai Lifetime Oy:n hallinnassa
- Noudattamaan Nokia Defencen tietoturva- ja auditointivaatimuksia
- Raportoimaan läpinäkyvästi kaikki AI-päätökset audit trail -järjestelmän kautta

## Tarjouksen voimassaolo

Tarjous on voimassa 31.12.2026 saakka.

---

Kunnioittavasti,

**Risto Anton Päärni**
Toimitusjohtaja, Lifetime Oy
risto.paarni@lifetime.fi
Y-tunnus: 0772407-9
Puh: pyydettäessä
