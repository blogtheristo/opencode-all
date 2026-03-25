<!-- VERSION AND AGENT HISTORY
Document: Defence Startup Fund Application — Lifetime Oy
Version: 1.0
Date: 2026-03-25
Owner: Risto Päärni
Agent: Claude (Opus 4.6)
Branch: claude/defence-startup-fund-qsJBJ
-->

# Defence Startup Fund — Hakemus

**Hakija:** Lifetime Oy
**Tuote:** DWS IQ Aegis — Dual-Use AI Platform
**Rahasto:** Defence Startup Fund (Riihimäen Tilat ja Kehitys Oy / Riihimäen kaupunki)
**Deadline:** 31.3.2026
**Hakusivusto:** https://defencestartupfund.com

---

## 1. Yrityksen perustiedot

| Kenttä | Tieto |
|--------|-------|
| **Yrityksen nimi** | Lifetime Oy |
| **Y-tunnus** | 0772407-9 |
| **ALV-tunnus** | FI07724079 |
| **Osoite** | Laidunmaanraitti 2 A 25, 02330 Espoo, Finland |
| **Toimitusjohtaja** | Risto Anton Päärni |
| **Sähköposti** | risto.paarni@lifetime.fi |
| **Verkkosivut** | https://dws10.com |
| **Perustusvuosi** | Rekisteröity Suomessa |
| **NATO-maa** | Kyllä (Suomi, NATO-jäsen 2023) |

---

## 2. Tiivistelmä (Executive Summary)

Lifetime Oy hakee Defence Startup Fundin 20 000 euron rahoitusta ja 20 000 euron in-kind-tukea **DWS IQ Aegis** -alustan markkinavalmiuden vahvistamiseen puolustus- ja kaksoiskäyttösektorilla.

**DWS IQ Aegis** on EU-suvereeni tekoälyalusta, joka palvelee puolustus- ja kaksoiskäyttöyritysten tarpeita autonomisten AI-agenttien avulla. Alusta yhdistää:

- **Satelliittitiedustelun** (ICEYE SAR -integraatio)
- **EU-suvereeniuden valvonnan** (CLOUD Act -altistumisen tunnistus)
- **AI-agenttien hallintamallin** (KYA — Know Your Agent)
- **EU AI Act -vaatimustenmukaisuuden** (Artikla 12 -lokitus)

Yhtäkään muuta eurooppalaista alustaa ei ole suunniteltu palvelemaan puolustusalan toimitusketjujen kaksoisvaatimuksia: sekä puolustusalan sääntely (kaksoiskäyttöasetus 2021/821) että ilmastosääntely (CSRD, CBAM, ETS) samasta järjestelmästä.

---

## 3. Ongelma

Puolustusalan toimitusketjut kohtaavat kolminkertaisen sääntelypaineen:

1. **Kaksoiskäyttöasetus** (EU 2021/821) — vientivalvonta ja compliance
2. **Ilmastosääntely** (CSRD, CBAM, ETS) — päästöraportointi ja hiilirajamekanismi
3. **Datasuvereenisuus** (EU AI Act, NIS2, GDPR) — tietojenkäsittelyn sijainti ja hallinta

**Nykytilan ongelmat:**

| Ongelma | Seuraus |
|---------|---------|
| US-pohjaiset AI-alustat (Palantir, C3.ai) altistuvat CLOUD Actille | EU-puolustusdata ei ole suvereenia |
| Compliance tehdään manuaalisesti konsulttityönä | Kallis, hidas, ei skaalaudu |
| Ei yhtä alustaa kaksoisvaatimuksille | Puolustus ja ilmasto erillisiä siiloja |
| AI-päätösten jäljitettävyys puuttuu | EU AI Act -rikkomusriski |

---

## 4. Ratkaisu: DWS IQ Aegis

### 4.1 Alustan kuvaus

DWS IQ Aegis on **autonominen AI-agenttialusta** joka tuottaa auditoitavia tuloksia — ei dashboardeja tai raportteja. Agentit havainnoivat, analysoivat ja toimivat itsenäisesti tuottaen valmiita, tarkastettuja deliverableja.

### 4.2 AI-agentit

| Agentti | Kyvykkyys | Käyttötapaus |
|---------|-----------|-------------|
| **ArgusAgent** | ICEYE SAR -satelliittidatan AI-analysointi | Infrastruktuurin valvonta, toimitusketjun näkyvyys, muutostunnistus |
| **SovereigntyMonitor** | CLOUD Act -altistumisen pisteytys | Datasuvereniteetti, NIS2-yhteensopivuus |
| **Article12Logger** | EU AI Act -auditointiketju | Kaikki AI-päätökset lokitetaan riskiluokituksineen |
| **KYA Engine** | Know Your Agent — agentin identiteetti ja hallinta | Agenttien eristys, kill authority, forensiikka |
| **ComplianceAgent** | Kaksoiskäyttö + ilmastocompliance | Vientivalvonta, CSRD, CBAM, ETS |
| **SiteSenseAgent** | Puolustusrakentamisen turvallisuus | Kenttäoperaatiot, logistiikka, nosturiturvallisuus |

### 4.3 Tekninen arkkitehtuuri

- **Deployment:** Vain eurooppalainen pilvi (europe-north1, Suomi) tai yrityksen oma private cloud
- **Eristys:** Firecracker MicroVM per agentti — ei jaettua tenanttia
- **Compliance:** EU AI Act Art. 12, NIS2, GDPR, kaksoiskäyttöasetus 2021/821
- **Sertifiointipolku:** ISO 27001 (Q3 2026), SOC 2 Type II (Q4 2026)

---

## 5. Kaksoiskäyttö (Dual-Use) -perustelu

### 5.1 Siviili- ja puolustuskäyttö

| Ominaisuus | Siviili (DWS IQ Climate Intelligence) | Puolustus (DWS IQ Aegis) |
|-----------|----------------------------------------|--------------------------|
| Päästölaskenta | CSRD-raportointi teollisuudelle | Puolustushankintojen hiilijalanjälki |
| Satelliittikuvat | Teollisuuskohteiden valvonta | Tiedustelu ja infrastruktuurin muutostunnistus |
| Suvereenisuus | GDPR-vaatimustenmukaisuus | Puolustustiedon datasuvereenisuus |
| Agentinhallinta | Yritysten AI governance | Puolustusluokiteltu agenttihallinta |
| Paikkakohtainen turvallisuus | Rakennustyömaiden turvallisuus | Puolustusrakentamisen ja logistiikan turvallisuus |

### 5.2 Miksi tämä on relevanttia puolustukselle

1. **NATO-yhteistyö** — Suomi NATO-jäsen 2023; puolustusala tarvitsee EU-suvereenia AI-alustaa
2. **Puolustushankintojen ilmastosääntely** — EU:n Green Defence Framework edellyttää päästöraportointia
3. **ICEYE-yhteistyö** — Suomalainen SAR-satelliittiyhtiö (Espoo), maailman suurin SAR-konstellaatio
4. **EU AI Act** — Puolustusalan AI-järjestelmät tarvitsevat jäljitettävyyden (Art. 12)

---

## 6. Markkinat

### 6.1 Kohdemarkkinat

| Segmentti | Koko (EU) | DWS IQ Aegis -tarve |
|-----------|-----------|---------------------|
| Puolustusurakoitsijat | ~4 000 yritystä EU:ssa | Compliance, suvereenisuus, agenttihallinta |
| Kaksoiskäyttövalmistajat | ~15 000 yritystä EU:ssa | Vientivalvonta + ilmastocompliance |
| Puolustusministeriöt | 27 EU-jäsenvaltiota | Suvereeni AI, tiedustelu, auditointi |

### 6.2 Kilpailuasemointi

| Kilpailija | Puute jonka DWS IQ Aegis täyttää |
|-----------|----------------------------------|
| Palantir AIP | US-pohjainen → CLOUD Act -altistuminen. Ei EU-suvereeni. |
| Anduril Lattice | Laitteistokeskeinen. Ei compliance-agentteja. Vain US. |
| C3.ai Defence | Dashboard-alusta — ei autonomisia agenttituloksia. US-hosting. |
| Big 4 -konsultointi | Vain neuvontaa. Ei autonomisia agentteja. Ei satelliittitiedustelua. |

**Kilpailuetumme:** EU-suvereeni suunnittelultaan, KYA-agenttihallinta (ainoa alusta), ICEYE-integraatio (naapuri Espoossa), EU AI Act natiivinä (Art. 12 sisäänrakennettu), kaksois-compliance (puolustus + ilmasto yhdestä alustasta).

---

## 7. Tiimi

| Henkilö | Rooli | Tausta |
|---------|-------|--------|
| **Risto Anton Päärni** | CEO & perustaja | Full-stack arkkitehti, 20+ vuotta teollisuuden digitalisaatio, EU-sääntelyasiantuntemus |

*Tiimi laajenee DEFINE-ekosysteemin ja rahoituksen myötä.*

---

## 8. Rahoituksen käyttösuunnitelma

### 8.1 Defence Startup Fund (€20 000 + €20 000 in-kind)

| Käyttökohde | Summa | Aikataulu |
|-------------|-------|-----------|
| **ICEYE SAR -integraation validointi** | €8 000 | Q2 2026 |
| **EU AI Act Art. 12 -lokituksen sertifiointivalmistelu** | €5 000 | Q2–Q3 2026 |
| **Puolustusalan asiakasvalidointi (pilot)** | €4 000 | Q3 2026 |
| **DEFINE-ekosysteemitapahtumat ja -verkostoituminen** | €3 000 | Q2–Q4 2026 |
| **Yhteensä** | **€20 000** | |

### 8.2 In-kind-tuen hyödyntäminen

| Resurssi | Tarve |
|---------|-------|
| Toimitilat Riihimäellä | Tukikohta DEFINE-ekosysteemin ytimessä |
| Mentorointi | Go-to-market puolustuskanavissa |
| Testausmahdollisuudet | Agenttien validointi puolustuskontekstissa |
| Verkostointituki | Yhteydet loppukäyttäjiin ja sijoittajiin |

---

## 9. Riihimäki-sitoumus

Lifetime Oy sitoutuu perustamaan toimipisteen Riihimäelle osana DEFINE-ekosysteemiä:

- **Riihimäen sijainti** palvelee yhteyksiä Panssariprikaatiin ja puolustusalan toimijoihin
- **DEFINE Innovation Hub** tarjoaa infrastruktuurin (3D-tulostus, AI GPU, coworking)
- **Espoon pääkonttori** (nykyinen) + **Riihimäen DEFINE-toimipiste** = kaksi solmupistettä

---

## 10. Tiekartta

| Virstanpylväs | Aika | Status |
|---------------|------|--------|
| DWS IQ 6 -alusta live (18+ AI-agenttia) | Q1 2026 | ✅ Valmis |
| ICEYE SAR -integraatio (Argus-agentti) | Q2 2026 | 🔧 Kehityksessä |
| Defence Startup Fund -hakemus | 03/2026 | 📋 Tämä hakemus |
| DEFINE-ekosysteemi — tukikohta Riihimäellä | Q2 2026 | Suunnitelma |
| EU AI Act Art. 12 -sertifiointi | Q3 2026 | Suunnitelma |
| ISO 27001 | Q3 2026 | Suunnitelma |
| DEFINE Accelerator Autumn 2026 -hakemus | Q2 2026 | Suunnitelma |
| Ensimmäinen puolustusalan pilot-asiakas | Q3 2026 | Tavoite |
| SOC 2 Type II | Q4 2026 | Suunnitelma |

---

## 11. Strategiset kumppanuudet

| Kumppani | Integraatio | Status |
|---------|-------------|--------|
| **ICEYE** (Espoo) | SAR-satelliittidata Argus-agentille | Aktiivinen |
| **NVIDIA** | Jetson Orin Nano edge-AI | ISV-kumppani (vahvistettu) |
| **VTT** | Tutkimusyhteistyö, DIANA-ohjelma | Ekosysteemikumppani |
| **Shufti** | Agentti-identiteetin verifiointi (KYA) | Kumppanuus käynnissä |

---

## 12. Miksi Lifetime Oy?

1. **Tuote on olemassa** — DWS IQ 6 on live-alusta 18+ AI-agentilla, ei pelkkä idea
2. **EU-suvereeni suunnittelultaan** — Suomalainen hosting (europe-north1), ei CLOUD Act -altistumista
3. **Ainoa dual-compliance-alusta** — Puolustus + ilmasto yhdestä järjestelmästä
4. **ICEYE-naapuri** — Espoo-Espoo yhteistyö SAR-tiedustelussa
5. **Skaalautuva** — Agenttialusta palvelee kaikkia 20 EU:n säänneltyä toimialaa
6. **KYA — Know Your Agent** — Ainoa agenttihallintamalli markkinoilla
7. **Suomalainen NATO-yhtiö** — Luotettava alkuperä puolustusekosysteemissä

---

## 13. Yhteystiedot

| | |
|-|-|
| **Yritys** | Lifetime Oy |
| **Y-tunnus** | 0772407-9 |
| **CEO** | Risto Anton Päärni |
| **Sähköposti** | risto.paarni@lifetime.fi |
| **Puhelin** | *lisää* |
| **Osoite** | Laidunmaanraitti 2 A 25, 02330 Espoo |
| **Tuotesivu** | https://dws10.com |

---

## 14. Liitteet

1. `Store/PRODUCT_AEGIS.md` — DWS IQ Aegis -tuotekortti
2. `docs/DEFINE_APPLICATION_GUIDE.md` — DEFINE-ekosysteemiopas
3. `docs/DEFINE_FUNDRAISING_STUDY_NOTE.md` — Rahoitusstrategia
4. DWS IQ 6 demo — saatavilla pyynnöstä

---

*Lifetime Oy (Y-tunnus 0772407-9) · Luottamuksellinen · 2026-03-25*
