<!-- VERSION AND AGENT HISTORY
Document: Defence Startup Fund Application — Lifetime Oy
Version: 2.0
Date: 2026-03-25
Owner: Risto Päärni
Agent: Claude (Opus 4.6)
Branch: claude/defence-startup-fund-qsJBJ
-->

# Defence Startup Fund — Hakemus

**Hakija:** Lifetime Oy
**Tuote:** DWS IQ Aegis — Dual-Use AI Platform + Lifetime Fleet IoT
**Rahasto:** Defence Startup Fund (Riihimäen Tilat ja Kehitys Oy / Riihimäen kaupunki)
**Deadline:** 31.3.2026
**Hakusivusto:** https://investinriihimaki.com/defence/ (virallinen) | https://defencestartupfund.com (promootio)
**DEFINE:** https://www.definefinland.fi/en/
**Rahoitusmalli:** €20 000 avustus + startupin oma €20 000 omarahoitusosuus (matching)
**Yhteyshenkilöt:** Henrietta Hirvonen (hirvonen@redstone.vc), Teemu Seppälä (seppala@riihimaki.fi), Laura Manner-Raappana (RTOY)

---

## 1. Yrityksen perustiedot

| Kenttä | Tieto |
|--------|-------|
| **Yrityksen nimi** | Lifetime Oy |
| **Y-tunnus** | 0772407-9 |
| **ALV-tunnus** | FI07724079 |
| **Osoite** | Laidunmaanraitti 2 A 25, 02330 Espoo, Finland |
| **Toimitusjohtaja** | Risto Anton Päärni |
| **Puhelin** | 0400319010 |
| **Sähköposti** | risto.paarni@lifetime.fi |
| **Verkkosivut** | https://dws10.com |
| **Rahoitusmalli** | Tulorahoitus (liikevaihtorahoitteinen, ei ulkoista pääomaa) |
| **NATO-maa** | Kyllä (Suomi, NATO-jäsen 2023) |
| **Tiimi** | Risto Anton Päärni (CEO, yrittäjä), Lucille Päärni (liiketoiminnan kehitys) |

---

## 2. Tiivistelmä (Executive Summary)

Lifetime Oy hakee Defence Startup Fundin **20 000 euron avustusta** (matching-mallilla: startup sijoittaa vastaavat 20 000 €) **DWS IQ Aegis** -alustan markkinavalmiuden vahvistamiseen puolustus- ja kaksoiskäyttösektorilla.

**DWS IQ Aegis** on EU-suvereeni tekoälyalusta, joka palvelee puolustus- ja kaksoiskäyttöyritysten tarpeita autonomisten AI-agenttien avulla. Alusta yhdistää:

- **Satelliittitiedustelun** (ICEYE SAR -integraatio)
- **EU-suvereeniuden valvonnan** (CLOUD Act -altistumisen tunnistus)
- **AI-agenttien hallintamallin** (KYA — Know Your Agent)
- **EU AI Act -vaatimustenmukaisuuden** (Artikla 12 -lokitus)
- **Lifetime Fleet IoT** — mobiilisensorit ja reunalaskenta (NVIDIA Jetson Orin Nano + Acer Veriton GN100)

Lifetime Oy toimii **tulorahoituksella**. Nykyisiä logistiikka-asiakkaitamme ovat **Kela, Uber, Bolt ja Taksi Helsinki** (MRR €10K, 100% retentio, 17 vuoden operaattorisuhteet). Dual-use-alustamme rakentuu tälle vahvalle logistiikkaosaamiselle.

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

### 4.3 Lifetime Fleet IoT — Mobiilisensorit ja reunalaskenta

Lifetime Fleet on DWS IQ Aegisin fyysinen toteutuskerros ("Hands"):

| Komponentti | Kuvaus |
|-------------|--------|
| **NVIDIA Jetson Orin Nano** | Reunalaskenta kentällä — kaikki AI-inferenssi paikallisesti |
| **Acer Veriton GN100** | Edge-palvelin: ARM 10-ydin 3.9GHz, 120GB RAM, NVIDIA GB10 GPU |
| **Mobiilisensorit** | Lämpötila, kosteus, tuuli, paine, melu, pöly, tärinä, valo |
| **OpenSandbox v1.5** | Agenttien eristys efemeerisissä Docker-kontteja |
| **TimescaleDB** | Aikasarjadata reunalaitteilla — ei pilviviivettä |
| **Kill-switch** | Sub-5ms kryptografinen pysäytys per agentti, <50ms koko laivastolle |

**4-kumppanin laitteistoekosysteemi:**
- **NVIDIA** — Laskentaperusta (Jetson Orin Nano, Grace Blackwell, CUDA 12.8+)
- **Acer** — Laitteisto (Veriton GN100, 20 ydintä, 120GB RAM)
- **Siemens** — Data (Xcelerator PLC -telemetria, reaaliaikainen teollisuusdata)
- **ABB** — Energia (ABB Ability -energiarajapinta, Fit for 55 -raportointi)

**Puolustuskäyttö:** Kenttäoperaatioiden tilannekuva, logistiikan optimointi, autonomisten järjestelmien hallinta rajatulla autonomialla (KYA 11% -sääntö: <11% automaattisesti, 11-25% ihmisen katselmointi, >25% automaattinen palautus).

### 4.4 Tekninen arkkitehtuuri

- **Deployment:** Vain eurooppalainen pilvi (europe-north1, Suomi) tai yrityksen oma private cloud
- **Eristys:** Firecracker MicroVM per agentti — ei jaettua tenanttia
- **Compliance:** EU AI Act Art. 12, NIS2, GDPR, kaksoiskäyttöasetus 2021/821
- **Sertifiointipolku:** ISO 27001 (Q3 2026), SOC 2 Type II (Q4 2026)
- **KYA Trust Scoring:** ≥80 Full Agency / 50-79 Restricted / <50 Suspended / 0 Quarantine

---

## 5. Kaksoiskäyttö (Dual-Use) -perustelu

### 5.1 Siviili- ja puolustuskäyttö

| Ominaisuus | Siviili (DWS IQ Climate Intelligence) | Puolustus (DWS IQ Aegis) |
|-----------|----------------------------------------|--------------------------|
| Päästölaskenta | CSRD-raportointi teollisuudelle | Puolustushankintojen hiilijalanjälki |
| Satelliittikuvat | Teollisuuskohteiden valvonta | Tiedustelu ja infrastruktuurin muutostunnistus |
| Suvereenisuus | GDPR-vaatimustenmukaisuus | Puolustustiedon datasuvereenisuus |
| Agentinhallinta | Yritysten AI governance | Puolustusluokiteltu agenttihallinta |
| IoT/sensorit | Logistiikan seuranta (Kela, Uber, Bolt, Taksi Helsinki) | Kenttäoperaatioiden tilannekuva ja kaluston seuranta |
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
| **Risto Anton Päärni** | CEO & perustaja, yrittäjä | Full-stack arkkitehti, 20+ vuotta teollisuuden digitalisaatio, EU-sääntelyasiantuntemus, logistiikka-alan kokemus (Kela, Uber, Bolt, Taksi Helsinki) |
| **Lucille Päärni** | Liiketoiminnan kehitys | Kansainväliset verkostot, asiakassuhteet, markkinoiden kehittäminen |

*Tiimi laajenee DEFINE-ekosysteemin ja rahoituksen myötä.*

---

## 7b. Logistiikkaosaaminen ja nykyiset asiakkaat

Lifetime Oy:llä on vahva logistiikka-alan kokemus, joka toimii perustana puolustuslogistiikan ratkaisuille:

**Nykyiset logistiikka-asiakkaat:**
- **Kela** — Suomen sosiaalivakuutuslaitos, KELA-kuljetuslogistiikka (17 vuoden operaattorisuhteet)
- **Uber** — Kansainvälinen liikkuvuusalusta
- **Bolt** — Eurooppalainen liikkuvuusalusta
- **Taksi Helsinki** — Pääkaupunkiseudun taksiliikenne

**Liiketoiminnan tunnusluvut:**
- MRR: €10K (kuukausittainen toistuva liikevaihto)
- Retentio: 100%, nolla churn
- Rahoitusmalli: Tulorahoitus — liiketoiminta on kannattavaa ilman ulkoista rahoitusta

**Puolustuslogistiikkaan skaalautuminen:**
- Reaaliaikainen kaluston seuranta ja optimointi → puolustuslogistiikan tilannekuva
- Mobiilisensorit ja IoT-laitteet kenttäolosuhteissa → kenttäoperaatioiden monitorointi
- Skaalautuva alusta tuhansille samanaikaisille kuljetuksille → huoltovarmuuslogistiikka
- Toimintavarmuus kriittisissa operaatioissa → puolustusvalmiuden tuki

---

## 8. Rahoituksen käyttösuunnitelma

### 8.1 Defence Startup Fund -avustus (€20 000)

| Käyttökohde | Summa | Aikataulu |
|-------------|-------|-----------|
| **ICEYE SAR -integraation validointi** | €8 000 | Q2 2026 |
| **EU AI Act Art. 12 -lokituksen sertifiointivalmistelu** | €5 000 | Q2–Q3 2026 |
| **Puolustusalan asiakasvalidointi (pilot)** | €4 000 | Q3 2026 |
| **DEFINE-ekosysteemitapahtumat ja -verkostoituminen** | €3 000 | Q2–Q4 2026 |
| **Yhteensä avustus** | **€20 000** | |

### 8.2 Lifetime Oy:n omarahoitusosuus (€20 000 matching)

| Käyttökohde | Summa | Aikataulu |
|-------------|-------|-----------|
| **DWS IQ Aegis -kehitys (puolustusominaisuudet)** | €10 000 | Q2 2026 |
| **Infrastruktuuri (EU-suvereeni hosting, Firecracker MicroVM)** | €5 000 | Q2 2026 |
| **Riihimäen toimipisteen perustaminen** | €3 000 | Q2 2026 |
| **ISO 27001 -esivalmistelutyö** | €2 000 | Q3 2026 |
| **Yhteensä omarahoitus** | **€20 000** | |

### 8.3 DEFINE-ekosysteemin hyödyntäminen

| Resurssi | Tarve |
|---------|-------|
| Toimitilat Riihimäellä | Tukikohta DEFINE Innovation Hubissa |
| Mentorointi | Go-to-market puolustuskanavissa (Redstone VC) |
| Testausmahdollisuudet | Agenttien validointi puolustuskontekstissa (3D-tulostus, AI GPU) |
| Verkostointituki | Yhteydet PV:n loppukäyttäjiin, sijoittajiin, ICEYE:hen |
| NATO DIANA | VTT-operoimat testiympäristöt Otaniemessä ja Oulussa |

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
| **NVIDIA** | Jetson Orin Nano + Grace Blackwell edge-AI, Lifetime Fleet IoT | ISV-kumppani (vahvistettu) |
| **Acer** | Veriton GN100 edge-palvelin (120GB RAM, NVIDIA GB10) | Laitteistokumppani |
| **Siemens** | Xcelerator PLC -telemetria, reaaliaikainen teollisuusdata | Datakumppani |
| **ABB** | ABB Ability -energiarajapinta, Fit for 55 -raportointi | Energiakumppani |
| **VTT** | Tutkimusyhteistyö, DIANA-ohjelma | Ekosysteemikumppani |
| **Shufti** | Agentti-identiteetin verifiointi (KYA) | Kumppanuus käynnissä |

---

## 12. Miksi Lifetime Oy?

1. **Tuote on olemassa** — DWS IQ 6 on live-alusta 18+ AI-agentilla, ei pelkkä idea
2. **Todistettu liiketoiminta** — Logistiikka-asiakkaat Kela, Uber, Bolt, Taksi Helsinki; tulorahoituksella toimiva yhtiö (MRR €10K, 100% retentio)
3. **EU-suvereeni suunnittelultaan** — Suomalainen hosting (europe-north1), ei CLOUD Act -altistumista
4. **Ainoa dual-compliance-alusta** — Puolustus + ilmasto yhdestä järjestelmästä
5. **Lifetime Fleet IoT** — Mobiilisensorit ja reunalaskenta kentälle (NVIDIA Jetson + Acer Veriton GN100)
6. **ICEYE-naapuri** — Espoo-Espoo yhteistyö SAR-tiedustelussa
7. **KYA — Know Your Agent** — Ainoa agenttihallintamalli markkinoilla (sub-5ms kill-switch)
8. **4 teknologiakumppania** — NVIDIA, Acer, Siemens, ABB
9. **Suomalainen NATO-yhtiö** — Luotettava alkuperä puolustusekosysteemissä

---

## 13. Yhteystiedot

| | |
|-|-|
| **Yritys** | Lifetime Oy |
| **Y-tunnus** | 0772407-9 |
| **CEO** | Risto Anton Päärni |
| **Sähköposti** | risto.paarni@lifetime.fi |
| **Puhelin** | 0400319010 |
| **Osoite** | Laidunmaanraitti 2 A 25, 02330 Espoo |
| **Tuotesivu** | https://dws10.com |

---

## 14. Rahaston taustatiedot

| Tieto | Arvo |
|-------|------|
| **Rahaston kokonaispääoma** | 500 000 € (250 000 € Riihimäen kaupunki + 250 000 € RTOY) |
| **Yksittäinen tuki** | Enintään 20 000 € per yritys |
| **DEFINE kokonaisbudjetti** | ~2 milj. € (Sitra 800K€ + kumppanit 510K€ + kaupunki + RTOY) |
| **Rahoittajat** | EU (osarahoitus), Sitra, OP Häme, Riihimäen kaupunki, RTOY |
| **Hallinnoija** | Riihimäen Tilat ja Kehitys Oy (RTOY) |
| **Dealflow Manager** | Henrietta Hirvonen, Redstone VC (hirvonen@redstone.vc) |
| **Teknologia- ja innovaatiojohtaja** | Teemu Seppälä, Riihimäen kaupunki (seppala@riihimaki.fi) |

**Huom:** DEFINE Accelerator Spring 2026 -haku sulkeutui 2.3.2026. Autumn 2026 -haku avautuu arviolta huhtikuu–toukokuu 2026. Defence Startup Fund (tukirahasto) on erillinen instrumentti kiihdyttämöstä.

## 15. Liitteet

1. `Store/PRODUCT_AEGIS.md` — DWS IQ Aegis -tuotekortti
2. `docs/DEFINE_APPLICATION_GUIDE.md` — DEFINE-ekosysteemiopas
3. `docs/DEFINE_FUNDRAISING_STUDY_NOTE.md` — Rahoitusstrategia
4. DWS IQ 6 demo — saatavilla pyynnöstä

---

*Lifetime Oy (Y-tunnus 0772407-9) · Luottamuksellinen · 2026-03-25*
