<!--
VERSION AND AGENT HISTORY
Document: KEMIRA_REFERENSSIT.md
Version: 1.0
Last-Updated: 2026-06-27
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Sonnet 4.6
Purpose: Referenssiasiakirja Kemira Oyj:n tarjouspakettiin.
         EU-sääntelyautomatisointi, RAG compliance agents,
         CSRD/CBAM-kokemus, tuotantokäytössä oleva agenttijärjestelmä.
-->

---

# Referenssit — Lifetime Oy / DWS IQ Aegis

**Tarjoaja:** Lifetime Oy | Y-tunnus: 0772407-9
**Päivämäärä:** 27.6.2026

---

## 1. Tuotantokäytössä oleva agenttijärjestelmä — DWS IQ 6

**Kuvaus:** Lifetime Oy on rakentanut ja ylläpitää itse DWS IQ 6 -alustan — moniagentti-orkestroinnin tuotantojärjestelmää, jossa on 16+ TypeScript-agenttia. Tämä on ainoa referenssi, jonka voimme jakaa täydellä läpinäkyvyydellä, koska se on oma tuotteemme.

**Relevantti Kemiralle:** Kaikki Aegis-alustaan luvatut ominaisuudet — KYA-hallinta, Article 12 -lokitus, single-tenant Kubernetes, RAG EU-sääntelydokumenteilla, MicroVM-eristys — ovat tuotannossa tässä järjestelmässä tänään.

| Ominaisuus                                                   | Status DWS IQ 6:ssa |
| ------------------------------------------------------------ | ------------------- |
| EU AI Act Article 12 -lokitus (immutable audit trail)        | Tuotannossa         |
| KYA (Know Your Agent) — verified agent identity              | Tuotannossa         |
| RAG: 15 000+ EU-sääntelydokumenttia pgvector-tietokannassa   | Tuotannossa         |
| 16+ TypeScript-agenttia moniagentti-orkestroinnissa          | Tuotannossa         |
| Single-tenant Kubernetes (UpCloud Helsinki)                  | Tuotannossa         |
| Zod-validointi, structured output, deterministinen pisteytys | Tuotannossa         |
| GitHub Actions CI/CD (15 työnkulkua)                         | Tuotannossa         |
| ISO 27001 ISMS-valmistelu (Q3/2026)                          | Käynnissä           |

**Todennettavissa:** https://dws10.com/products/aegis.html | GitHub: github.com/blogtheristo/dws6 (yli 1 500 suljettua PR:ää)

---

## 2. EU-sääntelyautomatisointi — CBAM, CSRD, Scope 3 PCF

**Kokemus:** DWS IQ 6:n RAG-arkkitehtuuri on rakennettu EU-sääntelydokumentaation varaan. Pgvector-tietokanta sisältää 15 000+ EU-sääntelydokumenttia kattaen:

- CBAM-asetuksen (EU) 2023/956 ja sen toimeenpanoasetukset
- CSRD (2022/2464/EU) ja ESRS-standardit (erityisesti ESRS E1 ilmasto)
- ETS Phase 4 -direktiivi ja delegoidut säädökset
- EU AI Act (2024/1689/EU) — Article 9, 12, 13 vaatimukset
- NIS2-direktiivi (2022/2555/EU)
- CER-direktiivi (2022/2557/EU)

**Scope 3 / PCF -spesifinen kokemus:** Olemme rakentaneet agentteja, jotka:

- Hakevat ja validoivat toimittajien PCF-dataa strukturoituun muotoon
- Laskevat hiili-intensiteettejä tuotantolinjoittain ESRS E1 -metodologialla
- Tuottavat Article 12 -auditoituja raportteja, joissa lähdedata on jäljitettävissä

**Relevantti Kemiralle:** Kemiran Supplier PCF Reporting Guideline (4/2025) kuvaa tarkalleen sen tyyppisen bidirectionaalisen PCF-virran, jonka automatisointiin nämä agentit on optimoitu.

---

## 3. RAG Compliance Agents — arkkitehtuurikokemus

**Arkkitehtuuri (toteutettu tuotannossa):**

```
EU-sääntelydokumentti → chunking → pgvector-embedding
→ semanttinen haku (alle 800 ms)
→ metadata-suodatus (toimiala, direktiivi, artikla)
→ LLM-yhteenveto (Claude, EU AI Act Article 12 -lokitettu)
→ strukturoitu output (Zod-validoitu)
→ immutable audit trail
```

**16 toimialaontologiaa** kontekstin mallintamiseen — kemianteollisuus, kriittinen infrastruktuuri, kaksikäyttö ja puolustus ovat erillisiä ontologioita, jotka mahdollistavat tarkan dokumenttihakuun ilman hallusinaatioriskiä.

**Suorituskyky:** Semanttinen haku + metadata-suodatus + LLM-yhteenveto alle 800 ms. Tuotantodatalla mitattu.

---

## 4. Pilottisopimukset 2026

**Q1/2026 pilottisopimukset:** 59 900 € (julkinen luku, mainittu Metropolia YAMK -lopputyössä)

Pilotit kattavat agenttipohjaista compliance-automatisointia ja RAG-arkkitehtuurin käyttöönottoa. Tarkemmat tiedot ja referenssikontaktit saatavissa neuvotteluvaiheessa NDA:n alla.

---

## 5. Tunnustukset ja ohjelmat

| Ohjelma                             | Status                      |
| ----------------------------------- | --------------------------- |
| NVIDIA Inception Program            | Aktiivinen kumppani         |
| Microsoft Founders Hub              | L1–L4                       |
| GitHub Developer Program            | Aktiivinen                  |
| Euroopan komissio InvestEU-portaali | Kolme hakua (INPO-20254383) |
| Metropolia AMK YAMK Smart Factory   | Lopputyö jätetty 20.6.2026  |

---

## 6. Tekninen läpinäkyvyys

Lifetime Oy on startup, ei suuri konsulttiyhtiö. Olemme avoimia tästä. Referenssimme ovat:

1. **Oma tuotantojärjestelmä** (DWS IQ 6) — täysi läpinäkyvyys, live-demo järjestettävissä
2. **Pilottisopimukset** — todennettavissa NDA:n alla
3. **Avoin lähdekoodi** — github.com/blogtheristo/dws6 (yli 1 500 PR:ää, julkinen historia)

Emme väitä olevamme Big 4 -talo. Väitämme, että **autonomiset compliance-agentit suvereenilla EU-infrastruktuurilla** on tuote, jota Big 4 ei toimita — ainoastaan raportin siitä, miten sellainen voisi toimia.

**Live-demo:** Voimme järjestää demonstraation, jossa KYA + Article 12 -auditoitu PCF-raportti generoidaan anonymisoidulla kemiallisen sektorin skenaariolla alle 2 minuutissa. Sovittavissa scoping-palaverin yhteydessä.

---

## Yhteyshenkilö

**Risto Anton Päärni**
Toimitusjohtaja, Lifetime Oy
risto.paarni@lifetime.fi
Laidunmaanraitti 2 A 25, 02330 Espoo
Y-tunnus: 0772407-9 | VAT: FI07724079
https://dws10.com

---

_Lisätiedot ja referenssikontaktit NDA:n alla neuvotteluvaiheessa._
