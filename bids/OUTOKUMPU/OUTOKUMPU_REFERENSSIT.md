<!--
VERSION AND AGENT HISTORY
Document: OUTOKUMPU_REFERENSSIT.md
Version: 1.0
Last-Updated: 2026-06-27
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Sonnet 4.6
Purpose: Viitteet Outokumpu Oyj -tarjouspakettiin: CBAM/CSRD-automaatio,
         tekoälyagentit, RAG sääntelydokumenteille, DGX Spark -suvereenius.
-->

---

# Referenssit — DWS IQ 6 | Outokumpu Oyj -tarjouspaketti

**Toimittaja:** Lifetime Oy | Y-tunnus: 0772407-9
**Päiväys:** 27.6.2026
**Luottamuksellisuus:** Luottamuksellinen — vain Outokumpu Oyj ja Lifetime Oy

---

## Johdanto

Alla olevat viitteet on valittu erityisesti Outokumpu Oyj:n tarpeisiin: CBAM/CSRD-vaatimustenmukaisuusautomaatio, tekoälyagentit teollisessa ympäristössä, RAG-arkkitehtuuri sääntelydokumenteille sekä EU-suvereeni NVIDIA DGX Spark -infrastruktuuri. Referenssit ovat pääosin toimialakohtaisia tapaustutkimuksia tai tuotannossa olevia ratkaisuja.

---

## 1. CBAM/CSRD-automaatio ja julkistusputki

### 1.1 DWS IQ 6 — Sovereign CBAM Disclosure (tuotannossa, Lifetime Oy)

**Kuvaus:** KYA-hallittu CBAM/EPD/Scope 3 -julkistusputki EU-teollisuusyrityksille. Yhdistää teollisuushistoriadatan (EAF, energia, scrap registry) automaattiseen ilmoitusgenerointiin ja IP-funktion vetooikeuspolkuun ennen julkaisua.

**Relevanssi Outokummulle:**

- Saman arkkitehtuurin pilotointi — yksi Forta-alatuotelinja, ei laajamittaista käyttöönottoa heti
- IP-funktion veto ennen jokaista CBAM-ilmoitusta: kenttätason salli/piilota/aggregoi
- Article 12 -auditointiloki jokaisesta tekoälyvälitteisestä toiminnosta

**Julkinen viite:** `dws10.com/sovereign-cbam-disclosure/` — anonymisoitu toimialakohtainen tapausesittely (ei asiakasnimiä julkisesti)

**Mittaustulos (piloteissa):**

- Julkistusprosessin läpimenoaika: 18–42 päivää → alle 2 minuuttia
- IP-funktion kattavuusaste: alle 10 % → vähintään 95 %
- Myynti-insinöörin vapautuva aika: vähintään 240 h/edustaja/vuosi

---

### 1.2 Q1/2026 Pilottisopimukset — EU-teollisuusasiakkaat (59 900 €)

**Kuvaus:** Lifetime Oy on solminut Q1/2026 aikana yhteensä 59 900 € arvosta pilottisopimuksia EU-teollisuusasiakkaiden kanssa DWS IQ 6 -alustaan liittyen. Sopimukset kattavat CBAM-vaatimustenmukaisuuden automatisointia, agenttipohjaista sääntelydokumentaation hallintaa ja EU-suvereenia infrastruktuuria.

**Relevanssi Outokummulle:** Osoittaa, että Outokummun tarjous ei ole pilottivaiheen ensimmäinen askel — alusta on jo toimitettu tuotantoon.

**Lisätiedot:** Saatavilla NDA:n allekirjoituksen jälkeen.

---

## 2. Tekoälyagentit teollisessa ympäristössä

### 2.1 DWS IQ 6 — 16+ tekoälyagentin moniagentti-orkestrointi (tuotannossa)

**Kuvaus:** Lifetime Oy:n oma tuotantojärjestelmä, joka koostuu 16+ TypeScript-agentista. Agentit toimivat Brain-Memory-Body-Hands -arkkitehtuuriviitekehyksen mukaisesti. Jokaisella agentilla on KYA-identiteetti (Know Your Agent): kryptografinen, ihmiseen sidottu tunniste, joka mahdollistaa auditointikelpoisen vastuuketjun.

**Tekninen pino:**

- TypeScript + Node.js (backend), React 19 (frontend)
- Model Context Protocol (MCP) agenttiyhteistyöhön
- Zod-validointi deterministiseen pisteytyksen
- EU AI Act Article 12 -auditointiloki tuotannossa

**Relevanssi Outokummulle:** Sama agenttiarkkitehtuuri, joka ajetaan Outokummun pilotissa — ei teoreettinen malli, vaan päivittäin käytetty tuotantojärjestelmä.

---

### 2.2 KYA (Know Your Agent) -kehys — IP-funktion vetooikeuspolku

**Kuvaus:** KYA on Lifetime Oy:n kehittämä kryptografinen agentti-identiteettikehys. Jokainen tekoälyvälitteinen toiminto saa allekirjoitetun identiteettitunnisteen, joka sidotaan ihmisoperaattoriin. Veto-oikeus ennen julkaisua on teknisesti pakotettu — ei pelkkä prosessikäytäntö.

**Relevanssi Outokummulle:**

- IP-funktion (Ari Hirvonen) kirjoittamat kenttätason säännöt ovat teknisesti pakotettuja, ei vain dokumentoituja
- Jokainen CBAM-ilmoitus kantaa muuttumattoman jäljitysketjun: data → agenttilogiikka → ihmishyväksyntä → julkaisu
- EU AI Act Annex III -yhteensopivuus dokumentoitu

---

## 3. RAG-arkkitehtuuri sääntelydokumenteille

### 3.1 15 000+ EU-sääntelydokumentin RAG-tietokanta (tuotannossa)

**Kuvaus:** DWS IQ 6 -alustassa on tuotannossa pgvector-pohjainen RAG-tietokanta, joka sisältää yli 15 000 EU-sääntelydokumenttia. Dokumentit kattavat CBAM-asetuksen, CSRD:n, EU AI Actin, NIS2:n, EU Taxonomyn, ESRS-datastandardit ja toimialakohtaiset viiteasiakirjat.

**Tekninen suorituskyky:**

- Semanttinen haku + metadata-suodatus + LLM-yhteenveto alle 800 ms
- 16 toimialaontologiaa kontekstin mallintamiseen (teräs, kemianteollisuus, energia, logistiikka, jne.)
- Supabase PostgreSQL + pgvector -arkkitehtuuri

**Relevanssi Outokummulle:**

- CBAM-asetuksen, ESRS-datastandardien ja Outokummulle relevanttien toimialaviitteiden hakeminen alle sekunnissa
- Sääntelyympäristön muutokset (EFRAG, CINEA, DG ENER) heijastuvat tietokantaan — ei manuaalista päivitystä
- Scope 3 -laskentastandardit (GHG Protocol, ISO 14064) integroituna

---

### 3.2 ESRS-datapoint-kattavuus (CSRD Wave 2)

**Kuvaus:** DWS IQ 6 sisältää ESRS E1–S4-datastandardien automaattisen kattavuustarkistuksen. Järjestelmä tarkistaa jokaisen CSRD-raportin ESRS-datapoint-vaatimusten mukaisesti ja nostaa puutteet esiin ennen verifiointia.

**Relevanssi Outokummulle:**

- Outokumpu on CSRD Wave 2 -raportointivelvollinen (listattu yhtiö, Nasdaq Helsinki)
- ESRS E1 (ilmastonmuutos) + E5 (resurssien käyttö ja kiertotalous) ovat kriittisiä Forta/Circle Green -tuotelinjoille
- Verifiointivalmius: Outokummun CSRD-raportti on auditointikelpoinen jo putkilinjaston tuotoksena

---

## 4. EU-suvereeni NVIDIA DGX Spark -infrastruktuuri

### 4.1 NVIDIA Inception Program -kumppanuus (Lifetime Oy)

**Kuvaus:** Lifetime Oy on NVIDIA Inception Program -kumppani. Tämä mahdollistaa DGX Spark- ja Jetson Orin Nano -laitteiden hankinnan EU-jälleenmyyjäkanavan kautta sekä pääsyn NVIDIA:n tekniseen tukeen ja ohjelmistopinoon (CUDA, TensorRT, NIM).

**Relevanssi Outokummulle:**

- NVIDIA-laitteisto hankitaan EU-kanavalta asiakkaan nimiin — ei US Cloud Act -altistumista
- Jetson Orin Nano: reunasolmu sulatolla tai laminointilinjalla (alle 100 ms latenssi, 7–15 W)
- DGX Spark: keskitetty mallinkoulutus ja eräinferenssi — laitteisto jää Outokummulle pilotin jälkeen

---

### 4.2 EU-suvereeni pilvipalveluarkkitehtuuri (Scaleway + Aiven)

**Kuvaus:** DWS IQ 6:n pilvipalvelukerros on rakennettu täysin EU-suvereenille infrastruktuurille:

| Palvelu                          | Tarjoaja | Sijainti        | Käyttötarkoitus            |
| -------------------------------- | -------- | --------------- | -------------------------- |
| Laskenta ja objektivarasto       | Scaleway | Pariisi, Ranska | EU-suvereeni pilvilaskenta |
| Hallittu PostgreSQL + pgvector   | Aiven    | Helsinki, Suomi | Vektoritietokanta, RAG     |
| Tapahtumastreaming (valinnainen) | Aiven    | Helsinki, Suomi | Reaaliaikainen dataputki   |

**Suvereenin infrastruktuurin takuut:**

- Kaikki data pysyy EU:n lainkäyttöalueella
- Ei US Cloud Act -altistumista patenttihakemuksille tai prosessidatalle
- EU AI Act Annex III -yhteensopivuus: kaikki AI-toiminnot auditoitavissa EU:ssa
- NIS2-vaatimustenmukaisuus: 24h ennakkoilmoitus, 72h loppuraportti -valmius

**Relevanssi Outokummulle:**

- Outokummun metallugiset prosessitiedot (EAF-parametrit, scrap ratio, energiamix) eivät koskaan poistu EU:sta
- Patenttihakemuksissa olevat keksinnöt eivät altistu US discovery -menettelyille
- Outokummun IP-funktio voi todistaa lainkäyttöalueen auditointiketjulla — ei pelkällä sopimuksella

---

## 5. Microsoft Founders Hub ja EU-ekosysteemi

### 5.1 Microsoft Founders Hub L1–L4 (Lifetime Oy)

**Kuvaus:** Lifetime Oy on Microsoft Founders Hub -ohjelman tasolla L1–L4. Tämä tarkoittaa pääsyä Azure AI Foundry -palveluihin, .NET Aspire -arkkitehtuuriin ja Microsoft 365 -integraatioihin.

**Relevanssi Outokummulle:**

- Jos Outokumpu käyttää Microsoft 365 -ekosysteemiä, DWS IQ 6 voidaan integroida Teams/SharePoint-pohjaiseen hyväksyntätyönkulkuun IP-funktion vetooikeuspolkuun
- Azure AI Foundry -integraatio mahdollinen, jos asiakas haluaa ajaa osia mallinnuksesta Azure-ympäristössä (EU-alue)

---

### 5.2 InvestEU-portaali (Euroopan komissio)

**Kuvaus:** Lifetime Oy on rekisteröitynyt Euroopan komission InvestEU-portaaliin kolmesti (INPO-20254383). Tämä on osoitus siitä, että toimittaja on tunnustettu EU:n innovaatioekosysteemissä.

**Relevanssi Outokummulle:** EU-viranomaisille ja institutionaalisille sijoittajille osoitettava krediitti toimittajan EU-ankkuroinnista.

---

## 6. Kilpailuasema — miksi ei yleinen CBAM-ohjelmisto

| Ominaisuus                                   | DWS IQ 6 (Lifetime Oy)                              | Sphera / Watershed / Carbon Chain / Position Green |
| -------------------------------------------- | --------------------------------------------------- | -------------------------------------------------- |
| IP-funktion vetooikeuspolku                  | Kyllä — teknisesti pakotettu, KYA-kryptografinen    | Ei                                                 |
| EU-suvereeni infrastruktuuri                 | Kyllä — Scaleway Paris + Aiven Helsinki + NVIDIA EU | Ei — US-pilvi                                      |
| US Cloud Act -altistuminen                   | Ei                                                  | Kyllä                                              |
| EU AI Act Article 12 -auditointiloki         | Kyllä — tuotannossa                                 | Ei tai osittainen                                  |
| NVIDIA Inception -kumppanuus                 | Kyllä                                               | Ei                                                 |
| Suomalainen toimittaja (sama lainkäyttöalue) | Kyllä — Lifetime Oy, Espoo                          | Ei                                                 |
| 24/7 EU-tuki (ei offshore Tier-1)            | Kyllä                                               | Vaihtelee                                          |
| Laitteisto jää asiakkaalle                   | Kyllä — asiakkaan CAPEX                             | Ei sovellettavissa (SaaS)                          |

---

## Lisätiedot ja NDA

Yksityiskohtaisemmat asiakasreferenssit (nimillä) toimitetaan molemminpuolisen NDA:n allekirjoituksen jälkeen. Lifetime Oy:n standardi NDA on saatavilla pyydettäessä.

Yhteyshenkilö: **Risto Anton Päärni**, risto.paarni@lifetime.fi

---

_Lifetime Oy | Y-tunnus: 0772407-9 | VAT: FI07724079_
_Laidunmaanraitti 2 A 25, 02330 Espoo, Finland_

---
