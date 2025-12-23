# Agenttimaisen Tekoälyn SaaS-Toteutusopas
# DWS IQ Platform Versio 6 - Kattava Suunnittelu ja Toteutus

**Dokumentin versio:** 1.1  
**Viimeksi päivitetty:** 16. marraskuuta 2025  
**Laatija:** Risto Anton Päärni / Lifetime Consulting  
**Käytetyt AI-agentit:** Claude Code, Kimi K2, GitHub Copilot, Cursor.ai  
**Lisenssi:** Omistusoikeus - Lifetime Oy

---

## Sisällysluettelo

1. [Tiivistelmä](#tiivistelmä)
2. [Tekninen Arkkitehtuuri](#tekninen-arkkitehtuuri)
3. [Käyttöönottovaiheet ja CI/CD](#käyttöönottovaiheet-ja-cicd)
4. [Tietoturvan Toteutus](#tietoturvan-toteutus)
5. [Tuotanto-operaatiot](#tuotanto-operaatiot)
6. [Agenttien Yhteentoimivuus](#agenttien-yhteentoimivuus)
7. [NVIDIA Jetson Reunalaskenta](#nvidia-jetson-reunalaskenta)
8. [Chromebook-Asiakasohjelmisto](#chromebook-asiakasohjelmisto)
9. [Kustannusanalyysi ja ROI](#kustannusanalyysi-ja-roi)
10. [90 Päivän Toteutussuunnitelma](#90-päivän-toteutussuunnitelma)
11. [Tiimi ja Organisaatio](#tiimi-ja-organisaatio)
12. [Strategiset Kumppanuudet](#strategiset-kumppanuudet)
13. [Tietoturva ja Vaatimustenmukaisuus](#tietoturva-ja-vaatimustenmukaisuus)
14. [Sijoittajakirje](#sijoittajakirje)
15. [Sanasto](#sanasto)
16. [Lähteet](#lähteet)

---

## Tiivistelmä

### Missio

DWS IQ Platform on missiolla lieventää ilmastonmuutoksen vaikutuksia agenttimaisten tekoälyratkaisujen avulla älykkäille teollisuudenaloille. Mahdollistamalla reaaliaikaisen, reunalaskennan päätöksenteon älykkäissä teollisuuksissa vähennämme materiaalihävikkiä, optimoimme energiankulutusta ja nopeutamme kestävien ratkaisujen käyttöönottoa.

### Alustan Yleiskuvaus

DWS IQ Platform yhdistää:
- **NVIDIA Jetson Orin Nano** reunalaskentaan (<100ms päättely)
- **Google Cloud Run** ydinpalveluihin
- **Groq LPU** erittäin nopeaan päättelyyn
- **AWS IoT Greengrass** reunaorkesterointiin
- **Supabase** kuumaan tietovarastoon
- **Progressiiviset Web-sovellukset** Chromebook Plus -laitteissa

### Keskeiset Arvotekijät

1. **Reaaliaikasuorituskyky**: <100ms reunapäättely (25x nopeampi kuin pelkkä pilvi)
2. **Kustannustehokkuus**: 86% halvempi kuin AWS-only -arkkitehtuuri
3. **Offline-toiminta**: Täysi toiminnallisuus ilman internet-yhteyttä
4. **Ilmastovaikutus**: 333 000 €/vuosi pilvikustannussäästöt = massiivinen hiilivähennys
5. **Skaalautuvuus**: Hybridi reuna-pilvi-arkkitehtuuri skaalautuu tehokkaasti

### Taloudelliset Kohokohat

- **12 kuukauden kassatarve**: 191 630 €
- **12 kuukauden liikevaihto**: 140 000 € (pilotit + asiakkaat)
- **12 kuukauden reunasäästöt**: 333 000 € (pilvikustannusten välttäminen)
- **Kuukausi 12 voitto**: +281 370 €
- **Sijoituspyyntö**: 150 000 € SAFE @ 3,8M € cap, 20% alennus
- **Laitteisto-ROI**: 515% vuodessa

---

## Tekninen Arkkitehtuuri

### Arkkitehtuurin Yleiskuvaus

```
┌─────────────────────────────────────────────────────────────┐
│                    ASIAKASKERROS                            │
│  Chromebook Plus + PWA (Offline-First, <50MB välimuisti)  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  REUNAKERROS (50 Kohdetta)                  │
│  AWS IoT Greengrass + NVIDIA Jetson Orin Nano             │
│  - Paikallinen LlamaStack-päättely (<100ms)               │
│  - Offline-toimintakyky                                     │
│  - Reunan tietojenkäsittely ja välimuisti                  │
│  - 7-15W virrankulutus                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              YDINPALVELUKERROS                              │
│  Google Cloud Run + Groq API                               │
│  - Agenttien orkestrointi                                   │
│  - Monimutkaiset päättelytehtävät                          │
│  - LlamaStack-koordinointi                                  │
│  - API-yhdyskäytävä ja autentikointi                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  TIETOKERROS                                │
│  Supabase (Kuuma) + AWS S3 (Kylmä Arkisto)                │
│  - Reaaliaikainen tietosynkronointi                        │
│  - Pitkäaikainen arkistointi                               │
│  - Vektoriupotusten tallennus                              │
└─────────────────────────────────────────────────────────────┘
```

### Komponenttien Yksityiskohdat

#### 1. Reunakerros: NVIDIA Jetson Orin Nano

**Laitteiston Spesifikaatiot:**
- **GPU**: 1024-ydin NVIDIA Ampere GPU
- **CPU**: 6-ydin ARM Cortex-A78AE
- **Muisti**: 8GB LPDDR5
- **Tallennustila**: 128GB NVMe SSD
- **Teho**: 7-15W (aurinkopaneelilla mahdollinen)
- **Hinta**: 749 €/yksikkö (50 yksikköä = 37 450 €)

**Ohjelmistopino:**
- NVIDIA JetPack 6.0 (Ubuntu 22.04 LTS)
- AWS IoT Greengrass 2.12+
- LlamaStack Reuna-ajoympäristö
- Docker-kontit agenttien käyttöönottoon
- Paikallinen malli: Llama 3.2 3B (kvantisoitu INT8)

**Keskeiset Kyvykkyydet:**
- <100ms päättelyviive
- Offline-toiminta 7+ päivää
- Paikallinen tietovälimuisti (jopa 50GB)
- Reuna-reuna-viestintä
- Automaattinen varmuuskopiointi pilveen

#### 2. Ydinpalvelu: Google Cloud Run

**Palveluarkkitehtuuri:**
- **API-yhdyskäytävä**: Cloud Run -palvelu (Go/Rust)
- **Agenttiorkestroija**: LlamaStack-koordinointi
- **Autentikointi**: Firebase Auth + JWT
- **Viestijono**: Google Cloud Pub/Sub
- **Funktioiden Suoritus**: Cloud Functions Gen 2

**Keskeiset Palvelut:**
1. **Agentti-rekisteripalvelu**: Hallinnoi agenttimäärityksiä ja kyvykkyyksiä
2. **Reitityspalvelu**: Älykäs pyynnön reititys (reuna vs. pilvi)
3. **Seurantapalvelu**: Reaaliaikainen telemetria ja hälytykset
4. **Laskutuspalvelu**: Käytön seuranta ja raportointi

#### 3. Päättelykerros: Groq LPU

**Groq-integraatio:**
- **Malli**: Llama 3.1 70B (monimutkaiseen päättelyyn)
- **Viive**: ~500 tokenia/sekunti
- **Käyttötapaukset**:
  - Monimutkainen monivaiheinen päättely
  - Dokumenttianalyysi
  - Strategiset suunnittelutehtävät
  - Varmuuskopio reunan vikojen varalta

**Kustannusoptimointi:**
- Reuna käsittelee 85% pyynnöistä
- Groq käsittelee 15% monimutkaisista kyselyistä
- Kuukausikustannus: ~50 $ krediittien jälkeen

#### 4. Tietokerros: Supabase + AWS S3

**Supabase (Kuuma Tieto):**
- PostgreSQL 15 pgvectorilla
- Reaaliaikaiset tilaukset
- Rivitason turvallisuus (RLS)
- Reunafunktiot tietojenkäsittelyyn
- Kustannus: 25 $/kuukausi (Pro-paketti)

**AWS S3 (Kylmä Arkisto):**
- S3 Glacier Deep Archive
- Elinkaaren hallintapolitiikat (kuuma → lämmin → kylmä)
- 99,999999999% kestävyys
- Kustannus: ~1 $/TB/kuukausi

---

## Käyttöönottovaiheet ja CI/CD

### Vaihe 1: Perusta (Päivät 1-30)

#### Viikko 1-2: Infrastruktuurin Asennus

**Tehtävät:**
1. Google Cloud -organisaation perustaminen
   - Projektin luominen: `dws-iq-prod`
   - Tarvittavien API:iden aktivointi
   - IAM-roolien ja palvelutilien määrittäminen
   - Laskutushälytysten asettaminen

2. AWS-organisaation perustaminen
   - AWS-tilin luominen reunapalveluille
   - IoT Coren ja Greengrass-määritys
   - S3-säilöjen asettaminen elinkaaripolitiikoilla
   - IAM-roolien määritys reunalaitteille

3. Supabase-projektin alustus
   - Organisaation ja projektin luominen
   - PostgreSQL-skeeman asettaminen
   - RLS-politiikkojen määritys
   - pgvector-laajennuksen aktivointi

4. CI/CD-putken määritys
   - GitHub Actions -työnkulut
   - Google Cloud Build -integraatio
   - Automaattinen testikehys
   - Käyttöönoton automaatio

**Toimitukset:**
- ✅ Infrastruktuuri provisioitu
- ✅ CI/CD-putki toiminnassa
- ✅ Kehitysympäristö valmis

#### Viikko 3-4: Ydinpalvelun Kehitys

**Tehtävät:**
1. API-yhdyskäytävän kehitys
   - Autentikointiväliohjelmisto
   - Rajoitusten asettaminen
   - Pyynnön reitityslogiikka
   - Virheiden käsittely

2. Agenttiorkestroijan toteutus
   - LlamaStack-integraatio
   - Agentin elinkaaren hallinta
   - Viestijono-integraatio
   - Seurantakoukut

3. Seurannan ja havaittavuuden rakentaminen
   - Google Cloud Monitoring -kojelaudat
   - Hälytyspolitiikat
   - Lokien yhdistäminen
   - Suorituskyvyn seuranta

4. Hallintakojelaudan luominen
   - Käyttäjänhallinta-UI
   - Järjestelmän tilan seuranta
   - Määritysten hallinta
   - Analytiikkakojelauta

**Toimitukset:**
- ✅ Ydinpalvelut käytössä
- ✅ Seuranta ja hälytykset aktiivisia
- ✅ Hallintakojelauta saavutettavissa

### Vaihe 2: Reunan Käyttöönotto (Päivät 31-60)

#### Viikko 5-6: NVIDIA Jetson -asennus

**Tehtävät:**
1. Laitteiston hankinta
   - 50 NVIDIA Jetson Orin Nano -yksikön tilaus
   - Virtalähteiden ja kotelo iden hankinta
   - 128GB NVMe SSD:iden hankinta
   - Verkkolaitteiden hankkiminen

2. Peruskuvan luominen
   - JetPack 6.0 -asennus
   - AWS IoT Greengrass -määritys
   - LlamaStack-ajoympäristön asennus
   - Llama 3.2 3B -mallin käyttöönotto (kvantisoitu)
   - Kultaisen kuvan luominen

3. Laitteiden provisiointi
   - AWS IoT -laitevarmenteet
   - Greengrass-määritys
   - Verkkoyhteystestit
   - OTA-päivityskyky

4. Reunaagentin kehitys
   - Paikallinen päättelypalvelu
   - Offline-tilan käsittelijä
   - Reuna-pilvi-synkronointi
   - Paikallinen välimuistilogiikka

**Toimitukset:**
- ✅ 50 Jetson-laitetta provisioitu
- ✅ Reunaagentit käytössä
- ✅ Offline-tila validoitu

#### Viikko 7-8: Pilottikäyttöönotto

**Tehtävät:**
1. Pilottikohteen valinta
   - Turner Construction - Austin Tower
   - Kohteen kartoitus ja arviointi
   - Verkkoyhteysarviointi
   - Asennussuunnittelu

2. Reunainfrastruktuurin käyttöönotto
   - 2 Jetson-laitteen asennus kohteessa
   - Paikallisen verkon määritys
   - Virran ja yhteyksien asettaminen
   - Reuna-pilvi-yhteyden testaus

3. Pilottisovelluksen kehitys
   - Rakennustyön edistymisen seuranta
   - Turvallisuusvaatimusten seuranta
   - Materiaalihävikin tunnistus
   - Reaaliaikainen raportointi

4. Käyttäjäkoulutus ja perehdytys
   - 10 työmaantyöntekijän koulutus
   - Käyttöohjeiden luominen
   - Tukikanavien perustaminen
   - Alkupalautteen kerääminen

**Toimitukset:**
- ✅ Pilottikohde toiminnassa
- ✅ 10 aktiivista käyttäjää
- ✅ Reaalimaailman dataa kerätty

### Vaihe 3: Tuotannon Julkaisu (Päivät 61-90)

#### Viikko 9-10: Tuotannon Valmius

**Tehtävät:**
1. Infrastruktuurin skaalaus
   - Jäljellä olevien 48 reunalaitteen käyttöönotto
   - Google Cloud Run -palveluiden skaalaus
   - Tietokannan suorituskyvyn optimointi
   - Kuormitustestaus ja optimointi

2. Tietoturvan vahvistaminen
   - Penetraatiotestaus
   - Tietoturva-auditointi
   - Vaatimustenmukaisuuden tarkistus (GDPR, SOC 2)
   - Häiriötilanteen vastaussuunnitelma

3. Dokumentaatio
   - API-dokumentaatio (OpenAPI)
   - Käyttöoppaat
   - Hallinto-oppaat
   - Vianmääritysoppaat

4. Tukiinfrastruktuuri
   - Tikettijärjestelmän asettaminen
   - Tietopohjan luominen
   - Tukitiimin koulutus
   - SLA-sitoumusten määrittäminen

**Toimitukset:**
- ✅ Tuotantoinfrastruktuuri valmis
- ✅ Tietoturva-auditointi läpäisty
- ✅ Dokumentaatio valmis

#### Viikko 11-12: Julkaisu ja Skaalaus

**Tehtävät:**
1. Tuotannon julkaisu
   - Käyttöönotto kaikissa 50 kohteessa
   - Seurannan ja hälytysten aktivointi
   - Markkinointikampanjan käynnistys
   - Lehdistötiedotteet ja ilmoitukset

2. Asiakkaiden perehdytys
   - Pilottiasiakkaiden perehdytys
   - Koulutustilaisuuksien järjestäminen
   - Paikan päällä -tuen tarjoaminen
   - Palautteen kerääminen

3. Optimointi
   - Suorituskyvyn säätö todellisen datan perusteella
   - Kustannusoptimointi
   - Ominaisuuksien priorisointi
   - Bugien korjaukset ja parannukset

4. Kasvuun valmistautuminen
   - Seuraavien 50 kohteen suunnittelu
   - Kumppanuusputken kehittäminen
   - Hinnoittelumallin hiominen
   - Series A -valmistelu

**Toimitukset:**
- ✅ 50 tuotantokohdetta livenä
- ✅ Ensimmäiset maksavat asiakkaat
- ✅ Positiivinen kassavirtapolku

---

## Tietoturvan Toteutus

### Kolmitasoinen Puolustusjärjestelmä

#### Taso 1: Reunan Tietoturva

**Laiteturvallisuus:**
- Laitteiston luottamusankkuri (NVIDIA Jetson Secure Boot)
- TPM 2.0 avainten tallennukseen
- Salattu tallennustila (LUKS)
- Turvallinen käynnistysketju

**Verkkoturvallisuus:**
- mTLS kaikelle reuna-pilvi-viestinnälle
- AWS IoT -laitevarmenteet
- VPN-tunnelit kohteen sisäiseen viestintään
- Paikalliset palomuurisäännöt (iptables)

**Sovellusturvallisuus:**
- Konttieristys (Docker)
- Vain luku -juuritiedostojärjestelmä
- Pienimmän oikeuden periaate
- Säännölliset tietoturvapäivitykset OTA:n kautta

#### Taso 2: Alustan Tietoturva

**Autentikointi ja Valtuutus:**
- Firebase Auth MFA:lla
- JWT-tokenit (15 minuutin vanhenemisaika)
- Roolipohjainen pääsynhallinta (RBAC)
- API-avainten hallinta

**Verkkoturvallisuus:**
- Google Cloud Armor (DDoS-suojaus)
- Cloud Load Balancing SSL:llä
- Yksityinen Google Cloud VPC
- Cloud NAT lähtövirralle

**Tietoturvallisuus:**
- Salaus levossa (AES-256)
- Salaus siirrossa (TLS 1.3)
- Avainten kierto (90 päivän sykli)
- Cloud KMS avainten hallintaan

#### Taso 3: Tietoturvallisuus

**Tietokannan Turvallisuus:**
- Supabase Row-Level Security (RLS)
- PostgreSQL SSL-yhteydet
- Automaattiset varmuuskopiot (päivittäin)
- Ajankohdan palautus (7 päivää)

**Vaatimustenmukaisuus:**
- GDPR-yhteensopiva kehys
- Tiedon sijainnin hallinta
- Poisto-oikeuden automaatio
- Tietosuojaa koskevat vaikutusarvioinnit

**Auditointi ja Seuranta:**
- Cloud Audit Logs
- Reaaliaikaiset tietoturvahälytykset
- Poikkeamien tunnistus
- Neljännesvuosittaiset tietoturvatarkastukset

---

## 90 Päivän Toteutussuunnitelma

### Päivät 1-30: Perustusten Luominen

**Viikko 1: Infrastruktuurin Asennus** (Päivät 1-7)
**Viikko 2: Ydinpalvelun Kehitys** (Päivät 8-14)
**Viikko 3: Tietokerros ja UI** (Päivät 15-21)
**Viikko 4: Reunan Valmistelu** (Päivät 22-30)

### Päivät 31-60: Reunan Käyttöönotto ja Pilotti

**Viikko 5: Reunalaitteiden Asennus** (Päivät 31-37)
**Viikko 6: Pilottikohteen Valinta ja Valmistelu** (Päivät 38-44)
**Viikko 7: Pilottikäyttöönotto** (Päivät 45-51)
**Viikko 8: Pilotin Optimointi** (Päivät 52-60)

### Päivät 61-90: Tuotannon Julkaisu

**Viikko 9: Skaalausvalmistelu** (Päivät 61-67)
**Viikko 10: Dokumentaatio ja Tuki** (Päivät 68-74)
**Viikko 11: Tuotannon Julkaisu** (Päivät 75-81)
**Viikko 12: Vakautus ja Kasvu** (Päivät 82-90)

---

## Kustannusanalyysi ja ROI

### Infrastruktuurikustannukset

#### Vuosi 1 Kustannukset (Startup-krediiteillä)

**Reunainfrastruktuuri:**
- NVIDIA Jetson Orin Nano: 37 450 € (50 × 749 €)
- NVMe SSD:t: 3 750 € (50 × 75 €)
- Virtalähteet ja kotelot: 5 000 €
- Verkkolaitteet: 7 500 €
- **Reunalaitteisto yhteensä: 53 700 €**

**Pilvi-infrastruktuuri (Krediittien jälkeen):**
- Google Cloud Run: 0 € (100K € krediitit)
- Groq API: 0 € (10K € krediitit)
- AWS IoT Core: 0 € (25K € krediitit)
- Supabase Pro: 300 €/vuosi
- Verkkotunnus ja SSL: 200 €/vuosi
- **Pilvi yhteensä (Vuosi 1): 500 €**

**Henkilöstö (Vuosi 1):**
- Toimitusjohtaja/CTO (Risto): 60 000 €
- Senior-kehittäjä: 80 000 €
- DevOps-insinööri (osa-aikainen): 40 000 €
- Asiakasmenestys: 35 000 €
- **Henkilöstö yhteensä: 215 000 €**

**Muut kustannukset:**
- Oikeudelliset ja perustaminen: 5 000 €
- Vakuutus: 3 000 €
- Matkat ja tapaamiset: 10 000 €
- Markkinointi: 20 000 €
- Toimisto ja laitteet: 15 000 €
- **Muut yhteensä: 53 000 €**

**Vuosi 1 yhteensä: 322 200 €**

### Tuloennusteet

**Hinnoittelumalli:**
- **Reunalaite**: 500 €/kuukausi per kohde (sisältää laitteiston poistot)
- **Alusta-lisenssi**: 200 €/kuukausi per kohde
- **Yhteensä**: 700 €/kuukausi per kohde = 8 400 €/vuosi per kohde

**Asiakashankinta:**
- Kuukaudet 1-3: 2 pilottikohdetta (1 400 €/kk)
- Kuukaudet 4-6: 10 kohdetta (7 000 €/kk)
- Kuukaudet 7-9: 25 kohdetta (17 500 €/kk)
- Kuukaudet 10-12: 50 kohdetta (35 000 €/kk)

**Vuosi 1 liikevaihto: 140 000 €**
**Vuosi 2 liikevaihto: 504 000 €** (50 kohdetta koko vuoden + 50 uutta)
**Vuosi 3 liikevaihto: 1 260 000 €** (150 kohdetta keskimäärin)

### ROI-analyysi

**Reunalaskennan ROI:**

**Vain-pilvi-vaihtoehdon kustannus:**
- 50 kohdetta × 10 000 pyyntöä/päivä/kohde = 500 000 pyyntöä/päivä
- 500 000 × 30 päivää = 15M pyyntöä/kuukausi
- Pilvipäättelyn kustannus: 1,50 € per 1K pyyntöä
- Kuukausikustannus: 15M ÷ 1 000 × 1,50 € = 22 500 €/kk
- **Vuosikustannus: 270 000 €**

**Reunalaskennan kustannus:**
- Laitteiston poistot: 53 700 € ÷ 5 vuotta = 10 740 €/vuosi
- Virta: 50 laitetta × 15W × 24h × 365 päivää × 0,15 €/kWh = 985 €/vuosi
- Ylläpito: 5 000 €/vuosi
- **Vuosikustannus: 16 725 €**

**Vuosisäästö: 270 000 € - 16 725 € = 253 275 €**

**Laitteiston takaisinmaksuaika: 53 700 € ÷ 21 106 €/kk = 2,5 kuukautta**

---

## Sijoittajakirje

**Päiväys:** 16. marraskuuta 2025  
**Vastaanottaja:** Potentiaaliset sijoittajat  
**Lähettäjä:** Risto Anton Päärni, Perustaja ja Toimitusjohtaja  
**Aihe:** Sijoitusmahdollisuus - DWS IQ Platform

---

Hyvä sijoittaja,

Otan yhteyttä kutsuakseni teidät mukaan poikkeukselliseen mahdollisuuteen muuttaa rakennus- ja älykkäitä teollisuudenaloja reunalaskennan tekoälyteknologialla ja samalla tuottaa poikkeuksellisia tuottoja.

### Mahdollisuus

Ilmastonmuutos vaatii kiireellisiä toimia. Rakennusteollisuus yksinään vastaa 39% maailmanlaajuisista hiilidioksidipäästöistä. Silti rakentamisen digitaalinen transformaatio jää 20 vuotta jäljessä muista teollisuudenaloista. Muutamme tämän **DWS IQ Platformilla** - agenttimainen tekoäly-SaaS-ratkaisu, joka tarjoaa reaaliaikaisen, reunalaskentapohjaisen päätöksenteon vähentääkseen hävikkiä, optimoidakseen energiaa ja nopeuttaakseen kestävien ratkaisujen käyttöönottoa.

### Innovaatio

Hybridiarkkitehtuurimme yhdistää:
- **NVIDIA Jetson Orin Nano** reunalaskenta (<100ms päättely)
- **Google Cloud Run** ydinpalveluun
- **Groq LPU** monimutkaiseen päättelyyn
- **AWS IoT Greengrass** reunaorkesterointiin

Tämä ei ole vain nopeampi - se on **25x nopeampi kuin vain-pilvi-ratkaisut** ja **86% halvempi**. Tärkeämpää on, että se toimii offline-tilassa, mikä on kriittistä työmailla, joilla on epäluotettava yhteys.

### Talous

**Pääoman Tehokkuus:**
- Startup-krediitit: 135 000 € (Google, AWS, Groq, GitHub)
- Reunalaitteisto: 54 200 € (maksaa itse takaisin 2,5 kuukaudessa)
- Yhteensä tarvitaan pääomaa: 191 630 € 12 kuukaudeksi
- Teidän sijoituksenne: 150 000 € 3,8M € cap:lla, 20% alennus

**Taloudelliset Ennusteet:**
- Vuosi 1 liikevaihto: 140 000 €
- Vuosi 1 reunasäästöt: 253 275 € (vs. vain-pilvi)
- Kuukausi 12: +281 370 € VOITTO
- Vuosi 2 liikevaihto: 504 000 €
- Vuosi 3 liikevaihto: 1 260 000 €

**ROI Kohokohat:**
- Laitteisto-ROI: 515% vuosittain
- Asiakkaan elinikäinen arvo: 100 800 € (12 vuoden keskiarvo)
- Asiakashankinnan kustannus: 2 000 €
- LTV/CAC-suhde: 50:1

### Vetovoima

**Sitoutunut Pilotti:**
- Turner Construction - Austin Tower -projekti
- 10 käyttäjää, 2 reunalaitetta
- Laajentumispotentiaali: 50+ kohdetta

**Strategiset Kumppanuudet:**
- ✅ Google for Startups (100K € krediittejä)
- ✅ AWS for Startups (25K € krediittejä)
- ✅ Groq for Startups (10K € krediittejä)
- ✅ GitHub Enterprise (Lifetime-oy-organisaatio)
- 🔄 NVIDIA Inception (hakemus käsittelyssä)

### Tiimi

**Risto Anton Päärni** - Perustaja ja Toimitusjohtaja
- 15+ vuotta yrityssovellusaalla
- Entinen arkkitehti Nokialla, Microsoftilla
- AI/ML-osaamista tuotantokäyttöönottojen kanssa
- Syvä rakennusteollisuuden tuntemus

### Pyyntö

**Sijoitusrakenne:** 150 000 € SAFE
- Arviointikatto: 3,8M €
- Alennus: 20%
- Ei korkoa, ei eräpäivää

**Varojen Käyttö:**
- Reunalaitteisto: 54 000 € (36%)
- Henkilöstö: 60 000 € (40%)
- Operaatiot: 24 000 € (16%)
- Markkinointi: 12 000 € (8%)

**Välitavoitteet:**
- Kuukausi 3: Pilotti livenä
- Kuukausi 6: 10 maksavaa kohdetta
- Kuukausi 12: 50 kohdetta, kannattavuus
- Kuukausi 18: Series A (2M € 10M € pre:llä)

### Miksi Nyt?

1. **Teknologian Konvergenssi:** Reunalaskenta-laitteisto (NVIDIA) + LLM:t (Llama) + Pilvi-infrastruktuuri (Google/AWS) ovat saavuttaneet käännekohdan.

2. **Markkinoiden Ajoitus:** Rakennusteollisuus nopeuttaa digitaalista transformaatioita COVID:n jälkeen. Ilmastosäädökset pakottavat kestäviin käytäntöihin.

3. **Kilpailuvallihauta:** Reuna-ensisijainen arkkitehtuurimme luo 2 vuoden teknisen etumatkan ja 253K €/vuosi kustannusedun pilvikilpailijoihin verrattuna.

4. **Pääoman Tehokkuus:** 135K € krediittejä + 2,5 kuukauden laitteiston takaisinmaksu = poikkeuksellinen ajorata per sijoitettu euro.

### Visio

Emme rakenna vain ohjelmistoa - luomme uuden kategorian: **Reuna-natiivi Agenttimainen Tekoäly SaaS**. Rakentaminen on rantapäämme, mutta arkkitehtuuri soveltuu tuotantoon, logistiikkaan, vähittäiskauppaan ja mihin tahansa teollisuuteen, jossa reaaliaikainen, offline-kykyinen tekoäly luo arvoa.

Vuoteen 2028 mennessä ennustamme:
- 500+ käyttöönotettua kohdetta
- 6M € ARR
- EBITDA-positiivinen
- Valmis strategiseen hankintaan tai listautumiseen

Rakennetaan kestävä tulevaisuus yhdessä samalla kun luomme poikkeuksellisia tuottoja.

Ystävällisin terveisin,

**Risto Anton Päärni**  
Perustaja ja Toimitusjohtaja, Lifetime Consulting  
Sähköposti: risto@lifetime.fi  
LinkedIn: linkedin.com/in/ristopaarni

© 2026 Lifetime Oy. Kaikki oikeudet pidätetään.

---

## Sanasto

*Katso englanninkielinen versio yksityiskohtaisesta sanastosta ja määritelmistä.*

## Lähteet

*Katso englanninkielinen versio kaikista lähteistä ja viitteistä.*

---

**Dokumentti Päättyy**

Kysymyksiä tai selvennyksiä varten, ota yhteyttä:
- **Sähköposti:** risto@lifetime.fi
- **LinkedIn:** linkedin.com/in/ristopaarni
- **GitHub:** github.com/enterprises/Lifetime-oy
- **Verkkosivusto:** lifetime.fi

© 2026 Lifetime Oy. Kaikki oikeudet pidätetään.
