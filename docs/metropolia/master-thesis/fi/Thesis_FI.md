# Firehorse-tuotevalmistuksen toimintamalli
## Hybridi AI-edge-arkkitehtuuri ilmastointelligeenteille teollisille alustoille

***
# VERSION AND AGENT HISTORY

Version: 2.1

Sessions & Modifications:
  - Version: 2.1 | Tool: Cursor AI (Claude) | Session: 16-Industries | Date: 06.01.2026 | Changes: Lisätty Fit for 55:n 16 teollisuudenalan analyysi, AI-käytön ilmoitus, DWS10-käyttötapaukset, laajennettu nykytila-analyysi
  - Version: 2.0 | Tool: Cursor AI (Claude) | Session: Thesis-Revision | Date: 05.01.2026 | Changes: Suuri revisio - Lisätty Solution Factory -malli, AgentFoundry-dokumentaatio, Lifetime Scope Signals -teoria, SWOT-analyysi, tutkimuskysymysten vastaukset, täydellinen teoreettinen viitekehys
  - Version: 1.0 | Tool: GitHub Copilot | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Applied DWS document standard, synchronized with English version

Session Links & References:
  - Cursor AI (2026-01-05): Opinnäytetyön revisio integroiden koodikannan todisteet
  - GitHub Copilot (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/metropolia/master-thesis/fi/Thesis_FI.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 06.01.2026
  - Language: Finnish
  - Languages Available: English, Suomi
  - Publication Status: 🚧 DRAFT (Suuri revisio valmis)

---

**Opinnäytetyö**  
**Metropolia Ammattikorkeakoulu**

**Tekijä:** Risto Anton Päärni  
**Koulutusohjelma:** [TBD - Business IT tai Teollisuuden johtaminen]  
**Ohjaaja:** [TBD]  
**Yritys:** Lifetime Oy (Firehorse-brändi)  
**Päivämäärä:** [TBD]

---

## Tiivistelmä

Tämä opinnäytetyö tutkii Firehorse-tuotevalmistuksen toimintamallia, joka yhdistää pilvi- ja reunalaskentateknologiat teollisten pk-yritysten tarpeisiin. Työ keskittyy rakennusteollisuuteen ja sen haasteisiin EU:n kaksoissiirtymässä (digitaalinen + vihreä).

**Avainsanat:** Tekoäly, reunalaskenta, rakennusteollisuus, toimintamalli, pilvipalvelut

---

## Abstract

This thesis examines the Firehorse product manufacturing operating model, which combines cloud and edge computing technologies for industrial SMEs. The work focuses on the construction industry and its challenges in the EU's twin transition (digital + green).

**Keywords:** Artificial Intelligence, Edge Computing, Construction Industry, Operating Model, Cloud Services

---

## Tekoälytyökalujen käyttö

Tämän opinnäytetyön laatimisessa on hyödynnetty tekoälyavusteisia työkaluja läpinäkyvyyden ja akateemisen rehellisyyden mukaisesti.

**Käytetyt työkalut:**
- **Claude (Anthropic)** — Tekstin muokkaus, rakenteen tarkistus, kieliasun parantaminen
- **Cursor AI** — Koodin dokumentointi, teknisten osioiden validointi
- **GitHub Copilot** — Koodiesimerkit, tekninen dokumentaatio

**AI:n rooli dokumentaatiossa:**
- Kieliasun tarkistus ja parannusehdotukset (FI/EN)
- Teknisen dokumentaation jäsentely ja yhdenmukaistaminen
- Käännösapu suomi-englanti
- Taulukkojen ja diagrammien formatointi

**Tekijän alkuperäinen panos:**
- ✅ Kaikki tutkimuskysymykset, hypoteesit ja johtopäätökset
- ✅ Alkuperäinen sisältö, argumentaatio ja analyysi
- ✅ Live-koodikanta ja toteutus (dws6-repositorio: 50 000+ LOC)
- ✅ Liiketoimintamallin suunnittelu ja validointi
- ✅ Asiakashaastattelut ja data (Uber, Bolt, Kela — €10k MRR)
- ✅ Solution Factory -mallin ja AgentFoundry-arkkitehtuurin kehitys

**Todisteaineisto:**
- Git-versiohistoria: [github.com/blogtheristo/dws6](https://github.com/blogtheristo/dws6)
- Live-asiakasvalidointi: €10 000+ MRR
- Toimiva järjestelmä: DWS10.com, DWS6.com, onelifetime.world. lifetime.fi 

---

# Sisällysluettelo

1. [Johdanto](#1-johdanto)
2. [Teoreettinen viitekehys](#2-teoreettinen-viitekehys)
3. [Nykytila-analyysi](#3-nykytila-analyysi)
4. [DWS6-toimintamallin suunnittelu](#4-dws6-toimintamallin-suunnittelu)
5. [Toteutus (MVP-vaihe)](#5-toteutus-mvp-vaihe)
6. [Tulokset ja analyysi](#6-tulokset-ja-analyysi)
7. [Pohdinta](#7-pohdinta)
8. [Johtopäätökset](#8-johtopäätökset)
9. [Lähteet](#9-lähteet)
10. [Liitteet](#10-liitteet)

---

# 1. Johdanto

## 1.1 Tausta

Eurooppalaiset teollisuuden pk-yritykset kohtaavat "kaksoissiirtymän" haasteen:

- **Digitaalinen muutos**: AI, automaatio, reaaliaikainen päätöksenteko
- **Vihreä siirtymä**: EU Fit for 55 (55% päästövähennys vuoteen 2030 mennessä), sisältyvän hiilen mittausvaatimukset vuoteen 2028 mennessä

Perinteiset SaaS-alustat epäonnistuvat, koska ne:
1. Maksavat €1 400+/kk (liian kalliita pk-yrityksille)
2. Vaativat vain pilvipohjaiset arkkitehtuurit (korkea latenssi, korkeat käyttökustannukset)
3. Eivät käsittele toimialakohtaisia compliance-työnkulkuja

**Firehorse (DWS6)** ratkaisee tämän uudella toimintamallilla, joka yhdistää:
- AI-avusteisen kehityksen (Cursor Pro + Claude Code Max, 15 viikon MVP)
- Edge AI (NVIDIA Jetson) <100ms päättelylle
- Toimialakohtaiset AI-agentit (Rakentaminen, Valmistus, Energia)
- Vaiheittainen käyttöönotto (Hiljainen pilotti → Neuvonantaja → Autonominen)

## 1.2 Tutkimusongelma

**Päätutkimuskysymys:**  
Miten AI-avusteisesti kehitetty teollinen AI-alusta voi saavuttaa tuote-markkinasopivuuden hybridi pilvi-edge-toimintamallin kautta säilyttäen samalla <€400/kk käyttökustannukset?

**Alatutkimuskysymykset:**

1. **Tuote ja liiketoimintamalli:** Miten kehitetään asiakaslupaus, joka ratkaisee todellisen ongelman ja skaalautuu kansainvälisesti?

2. **Teknologia:** Miten rakennetaan digitaalinen, skaalautuva palvelutuote, joka toimii pilvi + edge + verkkokauppa?

3. **Teknisten ratkaisujen evaluointi:** Mikä tekninen ratkaisu parhaiten tukee liiketoimintatavoitteita?

4. **Yritysturvallisuus:** Miten varmistetaan NIS 2, EU AI Act, GDPR ja Cybersecurity Act -vaatimustenmukaisuus?

## 1.3 Työn tavoitteet

1. Dokumentoida Firehorse-toimintamalli (MVP → V1)
2. Validoida kustannustehokas kehitysmalli (Cursor Pro + Claude Code Max)
3. Mitata asiakashyöty (≤2kk takaisinmaksuaika)
4. Luoda toistettava malli muille teollisuuden startup-yrityksille

## 1.4 Rajaukset

- **Toimiala:** Rakennusteollisuus (3,5M yritystä Euroopassa)
- **Markkina:** Pohjoismaat + Keski- ja Itä-Eurooppa
- **Aikajänne:** MVP-vaihe (joulukuu 2025 - helmikuu 2026)
- **Asiakkaat:** 5 pilottiasiakasta (€10-100M liikevaihto)

## 1.5 Keskeiset käsitteet

| Käsite | Määritelmä |
|--------|------------|
| **MVP** | Minimum Viable Product - Pienin toimiva tuote |
| **Edge AI** | Tekoäly, joka toimii laitteen sisällä (ei pilviyhteyttä) |
| **SaaS** | Software as a Service - Ohjelmisto palveluna |
| **DWS6** | Digital Work System 6 - Firehorse-alustan tekninen nimi |
| **Sisältyvä hiili** | Rakennusmateriaalien valmistuksen ja kuljetuksen päästöt |

---

# 2. Teoreettinen viitekehys

## 2.1 Lean Startup -menetelmä

Lean Startup -metodologia (Ries, 2011) muodostaa Firehorse-tuotekehityksen perustan. Build-Measure-Learn -syklin ydinperiaate ohjaa suoraan vaiheittaista käyttöönottomallia:

**Soveltaminen Firehorseen:**

| Lean Startup -konsepti | Firehorse-toteutus |
|------------------------|-------------------|
| **MVP (Minimum Viable Product)** | 2 agenttia (CustomerSat, Viability) 5 pilottiasiakkaalle |
| **Validoitu oppiminen** | Hiljainen pilotti -vaihe havainnoi ennen toimintaa |
| **Build-Measure-Learn** | Vaihe 1 → Vaihe 2 → Vaihe 3 eteneminen |
| **Pivot tai Persevere** | Signaalipohjainen koordinointi mahdollistaa nopean kurssinkorjauksen |

Customer Development -metodologia (Blank, 2013) laajentaa tätä periaatteella "rakennuksesta ulos" - tuote-markkinasopivuuden validointi todellisten asiakkaiden kanssa ennen skaalausta. Firehorse-lupaus 2 kuukauden takaisinmaksuajasta operationalisoi tämän luomalla mitattavan validointimittarin.

## 2.2 Alustatalous

Alustatalous (Parker, Van Alstyne & Choudary, 2016) selittää, miten moniosaiset alustat luovat arvoa verkostovaikutusten kautta. Firehorse Solution Factory -malli laajentaa tätä teoriaa teolliseen tekoälyyn:

**Monipuolinen alustasuunnittelu:**

```
┌─────────────────────────────────────────────────────────────┐
│                FIREHORSE-ALUSTAEKOSYSTEEMI                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PUOLI 1: Teolliset asiakkaat (8 vertikaalissa)             │
│  ├─ Rakentaminen: NCC, T2H (5 projektia, €50M salkku)       │
│  ├─ Logistiikka: Uber, Bolt, Kela (€10k MRR pilotin aikana) │
│  ├─ Valmistus: 2M+ yritystä Euroopassa                      │
│  └─ 5 lisävertikaalista (Energia, Terveydenhuolto, jne.)    │
│                                                              │
│  PUOLI 2: Data- ja tiedusteluntarjoajat                      │
│  ├─ Lifetime World Model (55B parametrin LLM)               │
│  ├─ EU-vaatimustenmukaisuustietokannat (Fit for 55, EPBD)   │
│  └─ Toimialakohtaiset hiilitkerroimet                       │
│                                                              │
│  PUOLI 3: Laitteisto- ja reunakumppanit                      │
│  ├─ NVIDIA (Jetson Orin Nano -reunalaitteet)                │
│  ├─ Acer/Asus (Blackwell-koulutusinfrastruktuuri)           │
│  └─ IoT-anturivalmistajat                                   │
│                                                              │
│  VERKOSTOVAIKUTUKSET:                                        │
│  • Ristivertikaalinen tiedustelu (Logistiikka → Rakentaminen)│
│  • Jokainen uusi vertikaali tekee KAIKISTA vertikaaleista   │
│    älykkäämpiä                                               │
│  • Agenttipohjat tulevat uudelleenkäytettäviksi toimialojen │
│    välillä                                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 2.3 Teollisuus 5.0

Teollisuus 5.0 (Euroopan komissio, 2021) edustaa evoluutiota Teollisuus 4.0:n automaatiofokuksesta kohti ihmiskeskeistä, kestävää ja resilienttiä teollista paradigmaa. Firehorse-toimintamalli toteuttaa suoraan nämä kolme pilaria:

**Ihmiskeskeinen toteutus:**
Kolmivaiheinen käyttöönottomalli (Hiljainen pilotti → Neuvonantaja → Autonominen) varmistaa ihmisen valvonnan:

| Vaihe | Ihmisen rooli | AI:n rooli | Teollisuus 5.0 -yhteensopivuus |
|-------|--------------|------------|-------------------------------|
| **Hiljainen pilotti** | Täysi kontrolli | Vain havainnointi | Maksimaalinen ihmisen toimijuus |
| **Neuvonantaja** | Hyväksyntä vaaditaan | Suositukset | Yhteistyöpäätöksenteko |
| **Autonominen** | Poikkeusten käsittely | Toiminta kaiteissa | Ihmisen valvonta reunatapauksissa |

## 2.4 Reunalaskennan taloustiede

Reunalaskennan taloustiede (Shi et al., 2016) tarjoaa teoreettisen perustan Firehorsen hybridiarkkitehtuurille. Keskeinen oivallus on, että latenssi- ja kaistanleveyskulut usein ylittävät keskitetyn prosessoinnin säästöt:

**Latenssi-kustannus-kompromissianalyysi:**

| Prosessointisijainti | Latenssi | Kuukausikustannus | Käyttötapaus |
|---------------------|----------|-------------------|--------------|
| **Pilvi (Groq API)** | 500-2000ms | €555/kk | Monimutkainen päättely, raporttien generointi |
| **Reuna (Jetson Orin Nano)** | <100ms | €100/vuosi (sähkö) | Reaaliaikainen työmaan seuranta |
| **Hybridi** | Molempien parhaat | €25-350/kk | Firehorse-optimaalinen konfiguraatio |

**Reunatekoälyn ROI-laskelma:**

```
Pilviratkaisu (12kk):
  Laskenta: €555/kk × 12 = €6 660/vuosi
  Yhteensä: €6 660/vuosi

Reunatekoälyratkaisu:
  Laitteisto (kertamaksu): €1 084 (Jetson Orin Nano + tarvikkeet)
  Sähkö: €10/kk × 12 = €120/vuosi
  Vuosi 1 yhteensä: €1 204
  Vuosi 2+ yhteensä: €120/vuosi

Säästö: €5 456/vuosi (82% halvempi)
Takaisinmaksuaika: 1,95 kuukautta
```

## 2.5 Moniagenttiärjestelmien teoria ja Lifetime Scope Signals

Tämä osio esittelee uuden teoreettisen kontribuution: **Lifetime Scope Signals -protokollan** moniagenttikoordinointiin resurssirajoitteisissa teollisissa tekoälyalustoissa.

### 2.5.1 Moniagenttiärjestelmien tausta

Moniagenttiärjestelmien (MAS) teoria (Wooldridge, 2009) tarjoaa perustan ymmärtää, miten autonomiset agentit voivat koordinoida monimutkaisten tavoitteiden saavuttamiseksi. Keskeisiä käsitteitä Firehorseen sovellettuna:

- **Agentin autonomia:** Kukin agentti toimii itsenäisesti määritellyillä vastuualueilla
- **Agenttikommunikaatio:** Agentit vaihtavat signaaleja koordinoidakseen riippuvuuksia
- **Emergentti käyttäytyminen:** Järjestelmätason kyvyt syntyvät agenttivuorovaikutuksista
- **Koordinointimekanismit:** Protokollat varmistavat agenttien työskentelyn yhteisten tavoitteiden eteen

### 2.5.2 Lifetime Scope Signals -protokolla

Lifetime Scope Signals -protokolla on uusi koordinointimekanismi, joka kehitettiin DWS IQ 6:lle. Se mahdollistaa deterministisen moniagenttikehityskoordinoinnin. Toisin kuin perinteiset MAS-lähestymistavat, jotka perustuvat reaaliaikaiseen neuvotteluun, tämä protokolla käyttää **deklaratiivista signaaliemissiota** riippuvaisten agenttien vapauttamiseen.

**Signaalimuoto:**
```
[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP
```

**Signaalityypit:**

| Tyyppi | Merkitys | Toiminto |
|--------|----------|----------|
| `READY` | Virstanpylväs saavutettu | Vapauttaa alavirran agentit |
| `COMPLETE` | Kaikki agentin työ valmis | Agentti siirtyy valmis-tilaan |
| `ERROR` | Agentti kohtasi virheen | Hälyttää koordinaattorin |
| `BLOCKED` | Odottaa ulkoista riippuvuutta | Ei toimintaa ennen vapautusta |

### 2.5.3 MCP Hub -orkestrointimallit

Model Context Protocol (MCP) Hub toteuttaa kolme työnkulkumallia agenttien koordinointiin:

1. **Fan-Out -malli:** Rinnakkainen tehtävien jakelu useille agenteille
2. **Reflection-malli:** Itsearviointi ja iteratiivinen parantaminen
3. **Sequential-malli:** Vaiheittainen suoritus riippuvuuksien kanssa

## 2.6 Käsitteellinen malli: Firehorse Solution Factory

Firehorse Solution Factory -malli syntetisoi edellä mainitut teoreettiset viitekehykset yhtenäiseksi käsitemalliksi ilmastointelligeenttien teollisten alustojen rakentamiseen:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIREHORSE SOLUTION FACTORY                    │
│              Käsitemalli teollisille AI-alustoille               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STRATEGINEN KERROS (Liiketoimintamalli)                         │
│  ├─ Lifetime World Model (55B) → Ristivertikaalinen tiedustelu  │
│  ├─ 8 vertikaalimallia → Uudelleenkäytettävät agenttikonfigit   │
│  ├─ AI-avusteinen kehitys → Cursor Pro + Claude Code Max, 15 vk MVP │
│  └─ EU-vaatimustenmukaisuusvalli → Fit for 55, NIS2, GDPR       │
│                                                                  │
│  OPERATIIVINEN KERROS (AgentFoundry + Lifetime Scope Signals)    │
│  ├─ Agenttikonfiguraatiot → YAML-mallit per vertikaali          │
│  ├─ Lifetime Scope Signals → Koordinointiprotokolla             │
│  ├─ MCP Hub → Moniagenttiorkestrointi                           │
│  └─ Vaiheittainen käyttöönotto → Hiljainen→Neuvonantaja→Auton.  │
│                                                                  │
│  SUORITUSKERROS (Aivot-Muisti-Keho-Kädet)                        │
│  ├─ Aivot: DWS IQ 6 Platform (Groq + Claude + Gemini)           │
│  ├─ Muisti: Lifetime World Model (ilmastotietokanta)            │
│  ├─ Keho: 8 toimialasovellusta (vertikaalikohtaiset agentit)    │
│  └─ Kädet: Reunatekoäly (Jetson), Dronet, Robotit, IoT-anturit  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Tämä käsitemalli tarjoaa toistettavan viitekehyksen muille teollisille AI-startupeille, jotka pyrkivät saavuttamaan tuote-markkinasopivuuden pitäen operatiiviset kustannukset matalina AI-avusteisen kehityksen, reunalaskennan ja moniagenttikoordinoinnin strategisen käytön avulla.

---

# 3. Nykytila-analyysi

## 3.1 Eurooppalainen teollinen AI-maisema

Euroopan teollisuus kohtaa ennennäkemättömän sääntelypaineen EU:n Fit for 55 -paketin myötä. Tämä luo pakotetun kysynnän ilmastovaatimustenmukaisuusratkaisuille 16 teollisuudenalalla.

### 3.1.1 Fit for 55:n vaikuttamat 16 teollisuudenalaa

EU:n Fit for 55 -paketti vaatii 55% nettopäästövähennysten vuoteen 2030 mennessä. Tämä luo ennennäkemättömän vaatimustenmukaisuustaakan 16 teollisuudenalalle — vaatien reaaliaikaista hiiliseurantaa, automatisoitua raportointia, toimitusketjun läpinäkyvyyttä ja jatkuvaa sääntelyyhteensopivuutta.

**Taso 1: Kriittiset päästöteollisuudet (ETS + CBAM suora vaikutus)**

Nämä 8 teollisuudenalaa kohtaavat suurimman sääntelypaineen: suora ETS-kattavuus, CBAM-rajahiilivero ja pakollinen hiilen hinnoittelu.

| # | Teollisuudenala | EU-päästöosuus | Keskeiset säädökset | DWS IQ 6 -ratkaisu |
|---|-----------------|----------------|---------------------|-------------------|
| **1** | 🔥 **Sähkön- ja lämmöntuotanto** | 25-30% | ETS (katto kiristyy), Uusiutuvaenergia-direktiivi | Reaaliaikainen päästöseuranta, uusiutuvuustodistusseuranta |
| **2** | 🏭 **Rauta- ja terästeollisuus** | Korkea | ETS, CBAM (2026), ESR | Toimitusketjun hiiliseuranta, CBAM-tuontiraportointi |
| **3** | 🧱 **Sementti- ja kalkkiteollisuus** | Erittäin korkea | ETS, CBAM, EPBD (sisältyvä hiili) | EN 15978 -laskelmat, materiaalien hiilipassit |
| **4** | ⚗️ **Kemian- ja petrokemianteollisuus** | Korkea | ETS, CBAM (lannoitteet), H2-mandaatit | Prosessipäästöseuranta, vetysiirtymäkartat |
| **5** | ✈️ **Lentoliikenne** | 2-3% (kasvava) | ETS, ReFuelEU (SAF-mandaatit) | SAF-vaatimustenmukaisuus, kompensaatioiden verifiointi |
| **6** | 🚢 **Meriliikenne** | Merkittävä | ETS (2024), FuelEU Maritime | Matkakohaiset päästöt, intensiteettidata |
| **7** | 🚛 **Maantieliikenne ja logistiikka** | Korkea | ETS2 (2027), CO2-standardit | Kalustopäästöhallinta, nollapäästösiirtymäsuunnittelu |
| **8** | 🏗️ **Rakentaminen ja kiinteistöt** | 36-40% elinkaaresta | ETS2, EPBD, CSRD | **Täysi elinkaarihiiliautomaatio**, BIM-integraatio, EN 15978/EN 15804 |

**Taso 2: Tärkeät päästöteollisuudet (ESR + epäsuora ETS)**

Nämä 8 teollisuudenalaa kohtaavat hajautettua sääntelypainetta kansallisten ESR-tavoitteiden, energiakustannusten, toimitusketjusääntöjen ja CBAM:n epäsuorien vaikutusten kautta.

| # | Teollisuudenala | EU-päästöosuus | Keskeiset säädökset | DWS IQ 6 -ratkaisu |
|---|-----------------|----------------|---------------------|-------------------|
| **9** | 🌾 **Maatalous ja karjatalous** | 10-12% | ESR, Metaanistrategia, CAP | Tilapäästöseuranta, lannoitteiden hiililaskenta |
| **10** | ♻️ **Jätehuolto ja kierrätys** | 3-4% | Jätepuitedirektiivi, Kaatopaikkadirektiiivi | Metaanin talteenottoseuranta, kiertotalousmittarit |
| **11** | 🔩 **Alumiiniteollisuus** | Korkea (energia) | ETS, CBAM (2026) | Energialähdeseuranta, uusiutuvan sähkön todistukset |
| **12** | 📄 **Sellu-, paperi- ja painoteollisuus** | Keskitaso | ETS, LULUCF | Metsähiililaskenta, toimitusketjun läpinäkyvyys |
| **13** | ⛽ **Öljynjalostus** | Korkea | ETS, ReFuelEU | Alasajosuunnittelu, SAF-tuotantoseuranta |
| **14** | 🍕 **Elintarviketeollisuus** | Keskitaso | ESR, Energiatehokkuusdirektiivi | Maatalouden toimitusketjuhiili, energiaoptimointi |
| **15** | 🏺 **Lasi- ja keramiikkateollisuus** | Keskitaso | ETS, CBAM (epäsuora) | Prosessipäästöt, materiaalihiiliseuranta |
| **16** | ⛏️ **Kaivos- ja louhintateollisuus** | Keskitaso | ETS (epäsuora), Kriittiset raaka-aineet | Louhintapäästöt, CRM-toimitusketjuvaatimustenmukaisuus |

### 3.1.2 Sääntelyaikataulu

```
2024 ────────────────────────────────────────────────────────────────
      │ Meriliikenne ETS:ssä
      │ CBAM-siirtymävaihe aktiivinen
      │ CSRD-raportointi alkaa (suuret yritykset)
      │
2025 ────────────────────────────────────────────────────────────────
      │ Omnibus-yksinkertaistukset (hallinnollinen helpotus)
      │ EU AI Act -täytäntöönpano alkaa
      │ NIS2-vaatimustenmukaisuuden määräaika
      │
2026 ────────────────────────────────────────────────────────────────
      │ CBAM täysi toimeenpano (rajahiilivero)
      │ CSRD laajenee useampiin yrityksiin
      │ Ilmaiset ETS-päästöoikeudet vähenevät nopeammin
      │
2027 ────────────────────────────────────────────────────────────────
      │ ETS2 maantieliikenteelle ja rakennuksille
      │ Tiukemmat ajoneuvojen CO2-standardit
      │
2028 ────────────────────────────────────────────────────────────────
      │ EPBD sisältyvän hiilen raportointi (>1 000 m²)
      │ Merkittävä ETS-katon kiristys
      │
2030 ────────────────────────────────────────────────────────────────
      │ 55% päästövähennystavoitteen määräaika
      │ ESR-kansalliset tavoitteet erääntyvät
      │
2035 ────────────────────────────────────────────────────────────────
      │ 100% nollapäästöiset uudet henkilö- ja pakettiautot
```

### 3.1.3 Omnibus-paketti: "Fit for 55 Means Fit for 55"

Euroopan komissio hyväksyi 26.2.2025 Omnibus-yksinkertaistuspaketin, joka keventää pk-yritysten hallinnollista taakkaa säilyttäen kuitenkin ilmastotavoitteet täysin ennallaan (European Commission, 2025).

**Keskeiset muutokset CSRD-raportointiin:**

| Muutos | Ennen | Omnibus jälkeen |
|--------|-------|-----------------|
| **CSRD-soveltamisala** | ~50 000 yritystä | ~10 000 yritystä (>1 000 työntekijää) |
| **Pk-yritysten velvoitteet** | Pakolliset | Vapaaehtoinen standardi (EFRAG SME) |
| **Varmennustaso** | "Limited" → "Reasonable" | Pysyy "Limited"-tasolla |
| **Aikataulu** | 2026-2027 | +2 vuotta lykkäys ("stop the clock") |
| **Säästöarvio** | - | €4,4 miljardia/vuosi |

**Kriittinen havainto: Ilmastotavoitteet säilyvät muuttumattomina**

Omnibus-paketti **ei muuta** Fit for 55:n ydintavoitteita:
- ✅ **55% päästövähennys vuoteen 2030** — säilyy
- ✅ **ETS-päästökatto** — kiristyy edelleen suunnitelmien mukaan
- ✅ **CBAM-rajahiilivero** — voimaan 2026 kuten suunniteltu
- ✅ **ETS2 maantieliikenteelle ja rakennuksille** — voimaan 2027
- ✅ **EPBD sisältyvän hiilen raportointi** — voimaan 2028

> *"The 'Omnibus' package will reduce compliance complexities for all companies, while focusing the rules on the largest companies that have a bigger impact on the environment and climate."*
> — European Commission (2025)

**Vaikutus DWS IQ 6 -liiketoimintamalliin:**

| Segmentti | Omnibus-vaikutus | DWS IQ 6 -mahdollisuus |
|-----------|------------------|------------------------|
| **Suuryritykset (>1 000 hlö)** | CSRD-velvoite säilyy | Premium-ratkaisu |
| **Keskisuuret (250-999 hlö)** | Vapaaehtoinen raportointi | Edullinen kilpailuetuna |
| **Pk-yritykset (<250 hlö)** | Ei raportointivelvoitetta | Toimitusketjupaine suuryrityksiltä |

**Johtopäätös:** Omnibus-paketti tekee Firehorse-mallista entistä kilpailukykyisemmän:
1. **Suuryritykset** tarvitsevat edelleen automaattista raportointia
2. **Pk-yritykset** kohtaavat toimitusketjupaineita CSRD-yrityksiltä
3. **Vapaaehtoinen EFRAG SME -standardi** luo kysynnän edulliselle ratkaisulle
4. **€0-350/kk hinta** on kilpailukykyinen vapaaehtoisen raportoinnin markkinoilla

**Lähde:** European Commission. (2025). *Omnibus package*. [https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en](https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en)

## 3.2 Kilpailija-analyysi

| Kyvykkyys | Firehorse | Atlassian Rovo | SAP | Siemens |
|-----------|-----------|----------------|-----|---------|
| **Kuukausikustannus** | €0-350 | €1 400+ | €4 000+ | €2 000+ |
| **Reunatekoäly** | ✅ Natiivi | ❌ | ❌ | ⚠️ Rajoitettu |
| **16 vertikaalia** | ✅ Suunniteltu | ❌ | ✅ | ✅ |
| **EU-yhteensopiva** | ✅ Natiivi | ⚠️ | ⚠️ | ✅ |
| **<100ms latenssi** | ✅ Reuna | ❌ | ❌ | ⚠️ |
| **Pk-saavutettavuus** | ✅ | ❌ | ❌ | ❌ |

## 3.3 Asiakassegmentit

**DWS10.com (Firehorse-alusta) kohdeasiakkaat 16 teollisuudenalalla:**

**Taso 1 - Kriittiset teollisuudet (Välitön myyntifokus):**
- 🏗️ **Rakentaminen:** NCC, Skanska, T2H, Vinci, Strabag (36-40% EU-päästöistä)
- 🚛 **Logistiikka:** Uber, Bolt, Kela, DB Schenker, DHL (€7k MRR live)
- 🏭 **Valmistus:** Kone, Wärtsilä, ABB, Valmet (ETS + CBAM)
- ⚡ **Energia:** Fortum, Helen, Vattenfall (25-30% päästöistä)

**Taso 2 - Tärkeät teollisuudet (V1.1+ laajennukset):**
- 🌾 **Maatalous:** Valio, Arla, maatalousyhteisöt
- 🏥 **Terveydenhuolto:** Kela (live), HUS, yksityiset sairaalaketjut
- 🏨 **Kiinteistöt:** Kojamo, Sato, kiinteistösijoittajat
- 🏛️ **Julkinen sektori:** Kunnat, valtionhallinto, puolustus

## 3.4 Sääntelyajurit

| Vuosi | Ajuri | Vaikuttavat vertikaalit | Markkinakoko |
|-------|-------|-------------------------|--------------|
| 2025-2026 | **CSRD** | Kaikki suuret yritykset | €2 miljardia |
| 2026-2028 | **Fit for 55** | Logistiikka, Rakentaminen | €5 miljardia |
| 2027-2030 | **EPBD** | Kiinteistöt, Rakentaminen | €8 miljardia |
| 2030-2035 | **ETS-laajennus** | Terveydenhuolto, Valmistus, Maatalous | €10 miljardia |

**Kokonaismarkkinamahdollisuus (TAM):**
- Pohjoismaat: €2,68 miljardia (10 vuotta)
- EU: €15-20 miljardia (10 vuotta)

---

# 4. DWS6-toimintamallin suunnittelu

DWS6-toimintamalli rakentuu kolmesta erillisestä kerroksesta: Strateginen, Operatiivinen ja Suorituskerros. Tämä luku dokumentoi kunkin kerroksen todisteilla live-toteutuksesta.

## 4.1 Strateginen kerros: Solution Factory -malli

Solution Factory -malli muuttaa DWS6:n yksittäisestä tuotteesta toistettavaksi alustaksi ilmastointelligeenttien teollisten sovellusten tuottamiseen useilla vertikaaleilla.

### 4.1.1 Solution Factory -arkkitehtuuri

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOLUTION FACTORY -ARKKITEHTUURI               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SYÖTE: Asiakkaan ongelma + Toimialavertikaali                   │
│         ↓                                                        │
│  PROSESSI: AgentFoundry-konfiguraatio + Signaalikoordinointi     │
│         ↓                                                        │
│  TULOSTE: Ilmastointelligent teollinen alusta                    │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   VERTIKAALI 1  │  │   VERTIKAALI 2  │  │   VERTIKAALI N  │  │
│  │   Rakentaminen  │  │   Logistiikka   │  │   [Malli]       │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤  │
│  │ • SiteSense     │  │ • FleetOptimize │  │ • Agentti A     │  │
│  │ • MaterialOracle│  │ • RouteGenius   │  │ • Agentti B     │  │
│  │ • ScheduleGenius│  │ • CarbonTracker │  │ • Agentti C     │  │
│  │ • CustomerSat   │  │ • CustomerSat   │  │ • CustomerSat   │  │
│  │ • Viability     │  │ • Viability     │  │ • Viability     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│           ↑                   ↑                   ↑              │
│           └───────────────────┴───────────────────┘              │
│                    JAETUT KOMPONENTIT:                           │
│           • Lifetime World Model (55B parametria)                │
│           • MCP Hub -orkestrointi                                │
│           • Supabase + pgvector (datakerros)                    │
│           • EU-vaatimustenmukaisuusmoottori                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.1.2 Strategiset innovaatiot

**1. AI-avusteinen kehitysstrategia**
MVP rakennettu 15 viikossa hyödyntäen Cursor Pro + Claude Code Max -työkaluketjua:
- Yksi kehittäjä + AI-parikoodaus mahdollistaa nopean iteraation
- Kustannustehokas malli ilman ulkoista pääomaa

**2. EU-vaatimustenmukaisuus kilpailuetuna**
Kun yhdysvaltalaiset SaaS-kilpailijat kohtaavat GDPR-haasteita, Firehorse rakentaa vaatimustenmukaisuuden arkkitehtuuriin:
- Tietojen sijainti: europe-north1 (Suomi/Ruotsi)
- EU AI Act: Matalan riskin luokitus ihmisen valvonnalla
- NIS2: Turvallisuus suunnittelulla kriittisen infrastruktuurin asiakkaille
- Fit for 55: Natiivi hiiliseuranta vuoden 2028 määräaikaan

**3. Verkostovaikutukset yli vertikaalien**
Ristivertikaalinen tiedustelu luo kasvavaa arvoa:
- Logistiikan reittioptimointidatadata → Rakentamisen toimitusaikataulutus
- Valmistuksen laatudata → Kiinteistöjen huollon ennustaminen
- Energiankulutusmallit → Kaikki vertikaalit hyötyvät

### 4.1.3 Asiakaslupaus

**Lupaus:** 2 kuukauden takaisinmaksuaika tai rahat takaisin

**Arvolupaus:**
- Reaaliaikainen päästöseuranta (EU-vaatimus 2028)
- Viabiliteettianalyysi (projektin kannattavuus)
- Automaattiset raportit (säästää 10h/viikko)

**Validointi:** €10k MRR Uberilta, Boltilta ja Kelalta pilotin aikana todistaa asiakkaiden maksuhalukkuuden.

### 4.1.4 Markkinatutkimus

- **Kohdeasiakas:** Teolliset pk-yritykset €10-100M liikevaihto
- **Pohjoismaiden TAM:** €2,68 miljardia
- **EU TAM:** €15-20 miljardia
- **Sääntelyajuri:** Fit for 55 luo pakotetun kysynnän (2025-2035 määräajat)

---

## 4.2 Operatiivinen kerros: AgentFoundry ja Lifetime Scope Signals

Operatiivinen kerros dokumentoi todelliset toteutusmekanismit, jotka mahdollistavat Solution Factoryn toiminnan. Tämä osio on johdettu suoraan dws6-koodikannasta.

### 4.2.1 AgentFoundry-arkkitehtuuri

AgentFoundry on monimalli-, monivuokralainen kehys AI-agenttien käyttöönottoon teollisissa vertikaaleissa. Arkkitehtuuri tukee:

**Mallihierarkia:**

```
┌─────────────────────────────────────────────────────────────┐
│ Koulutusinfrastruktuuri                                      │
│ └─ Google TPU Pods + Acer/Asus Blackwell -laitteisto        │
│    └─ Lifetime World Model (55B, monitoimialainen)          │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│ NCC-kumppanuus (Hallitukselle käyttöönotto)                  │
│ └─ NCC World Model (hienosäädetty LWM)                      │
│    └─ Suomen puolustus & kriittinen infrastruktuuri         │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│ Asiakaskäyttöönotto (8 vertikaalikohtaista mallia)           │
│ ├─ Rakentaminen-malli (BIM, kestävyys)                      │
│ ├─ Logistiikka-malli (toimitusketju, kalusto)               │
│ ├─ Valmistus-malli (OEE, laatu)                             │
│ ├─ Energia-malli (verkon optimointi, uusiutuvat)            │
│ └─ ... (4 lisävertikaalia)                                  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2.2 Lifetime Scope Signals -protokolla

Lifetime Scope Signals -protokolla koordinoi agenttikehitystä ja -käyttöönottoa deklaratiivisen signaalin emission kautta.

**V1.0 Agenttilaivasto (10 agenttia):**

| ID | Nimi | Vaihe | Prioriteetti | Signaalit |
|----|------|-------|--------------|-----------|
| Agent-01 | DWS IQ Login | 1 | Kriittinen | jwt-service, supabase-auth |
| Agent-02 | Firehorse Apps | 2 | Kriittinen | report-api, automation-api |
| Agent-03 | Customer Dashboard | 3 | Kriittinen | dashboard-layout |
| Agent-04 | AI Agents | 2 | Kriittinen | mcp-hub, sitesense |
| Agent-05 | Mobile Dashboard | 3 | Korkea | offline-sync |
| Agent-06 | Enterprise | V1.1 | Matala | (Lykätty) |
| Agent-07 | Supabase Database | 1 | Kriittinen | schema-users, rls-policies |
| Agent-08 | Payments | 4 | Keskitaso | stripe-setup |
| Agent-09 | Email System | 2 | Korkea | transactional |
| Agent-10 | Documentation | 1 | Matala | api-docs |

### 4.2.3 Kolmivaiheinen käyttöönottomalli

Operatiivinen kerros toteuttaa Teollisuus 5.0 ihminen-AI-yhteistyömallin:

**Vaihe 1: Hiljainen pilotti (30 päivää)**
- Agentti havainnoi ja kirjaa kaikki toiminnot
- Ei toimenpiteitä asiakkaan järjestelmissä
- Rakentaa perustason ymmärryksen toiminnoista
- Asiakaspalaute: "Mitä se näkee?"

**Vaihe 2: Neuvonantaja (60 päivää)**
- Agentti suosittelee toimenpiteitä
- Kaikki suositukset vaativat ihmisen hyväksynnän
- Rakentaa luottamusta tarkkojen ennusteiden kautta
- Asiakaspalaute: "Onko tämä järkevää?"

**Vaihe 3: Autonominen**
- Agentti toteuttaa määriteltyjen kaiteiden sisällä
- Ihmisen valvonta poikkeuksille
- Jatkuva valvonta ja säätö
- Asiakaspalaute: "Toimiiko se oikein?"

---

## 4.3 Suorituskerros: Aivot-Muisti-Keho-Kädet -arkkitehtuuri

Suorituskerros toteuttaa Aivot-Muisti-Keho-Kädet -mallin, tarjoten teknisen infrastruktuurin agenttien toiminnalle.

### 4.3.1 Hybridi pilvi-edge-arkkitehtuuri

```
┌─────────────────────────────────────────────────┐
│  DWS6 HYBRID ARCHITECTURE                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  CLOUD LAYER (Google Cloud Run)                 │
│  ├─ Groq API Router (FastAPI)                   │
│  ├─ Supabase (PostgreSQL)                       │
│  └─ Agent Orchestration (LlamaStack)            │
│                                                 │
│  EDGE LAYER (NVIDIA Jetson Orin Nano)           │
│  ├─ SiteSense Agent (työmaaseuranta)            │
│  ├─ Offline operation (ei verkkoyhteyttä)       │
│  └─ <100ms latenssi (25x nopeampi kuin pilvi)   │
│                                                 │
│  CLIENT LAYER (Chromebook PWA)                  │
│  ├─ Progressive Web App                         │
│  ├─ Offline-first design                        │
│  └─ EU data residency (GDPR-yhteensopiva)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.2.2 Agenttijärjestelmä

**Sisäiset agentit (7):**
- 5 kehitysagenttia (Cursor AI, Claude, Gemini)
- 2 myyntiagenttia (Firehorse Omnichannel)

**Asiakasagentit (2 MVP:ssä):**
- Asiakastyytyväisyysagentti
- Viabiliteettianalyysi-agentti

### 4.2.3 Datavirta

```
Työmaa (Edge)
  ↓
NVIDIA Jetson (SiteSense)
  ↓
Google Cloud Run (Orchestration)
  ↓
Supabase (PostgreSQL)
  ↓
Dashboard (Chromebook PWA)
```

### 4.2.4 MCP Hub Multi-Agent Orchestration Platform

**Visio:** Ohjauskerros, joka koordinoi Cursor-, Claude-, Gemini- ja DWS IQ -agentteja rakennussuunnittelutyökalujen ja Lifetime Firehorse -tuotteiden kanssa, tuettuna Lifetime World Model -mallilla ja autokannalla, droneilla ja roboteilla työmailla.

**Yksittäinen ilmastointelligentti aivot:** Jokainen automatisoitu työnkulku (raportit, aikataulut, vaatimustenmukaisuuspaketit) toimii yhdestä orkestrointikerroksesta eikä erillisistä skripteistä.

**Komponentit:**
- **AI-agentit:** Cursor AI, Claude Code, Gemini Pro, DWS IQ -agentit
- **Fyysinen kalusto:** Autot (Lifetime Fleet), dronit, robotit
- **Rakennustyökalut:** BIM-järjestelmät, ALICE Technologies, Procore
- **Firehorse-integraatio:** Asiakasomisteiset työkalut, Lifetime World Model

**Infrastruktuuri:**
- MCP Coordination Hub (portti 8765)
- Supabase MCP Server (portti 8766)
- Docker + Temporal.io + PostgreSQL

**Liiketoimintavaikutus:**
- +62% kehitysnopeus
- -73% bugien vähennys
- €23 640/vuosi säästöt
- 17,2 kuukauden runway €150K SAFE-rahoituksella (vs 6,7 kuukautta ilman MCP:tä)

## 4.3 Kustannusmalli

### 4.3.1 Kustannustehokas kehitysmalli

| Vaihe | Kustannus | Teknologia |
|-------|-----------|------------|
| **MVP** | €0/kk | NVIDIA Connect -kumppanuus + Cloud Run free tier |
| **Alpha** | €50-150/kk | Groq + Supabase Pro |
| **V1** | €350/kk | Groq + Supabase + Monitoring |

### 4.3.2 Edge AI ROI

**Pilviratkaisu (12kk):**
- €6 660/vuosi (€555/kk x 12)

**Edge AI ratkaisu:**
- €1 084 (laitteisto) + €120/vuosi (sähkö) = €1 204

**Säästö:** €5 456/vuosi (82% halvempi)  
**Takaisinmaksuaika:** 1,95 kuukautta

### 4.3.3 AI-kehitystyökalut

| Työkalu | Käyttötarkoitus | Rooli |
|---------|-----------------|-------|
| Cursor Pro | AI-parikoodaus, koodigenerointi | Ensisijainen IDE |
| Claude Code Max | Agenttikehitys, arkkitehtuuri | AI-avustaja |
| **Tulos** | **MVP 15 viikossa** | **Yksi kehittäjä** |

## 4.4 Käyttöönottomalli

### 4.4.1 Vaihe 1: Hiljainen pilotti

- Agentti tarkkailee ja kirjaa
- Ei toimenpiteitä
- Asiakaspalaute: "Mitä se näkee?"

### 4.4.2 Vaihe 2: Neuvonantaja

- Agentti suosittelee toimenpiteitä
- Vaatii hyväksynnän
- Asiakaspalaute: "Onko tämä järkevää?"

### 4.4.3 Vaihe 3: Autonominen

- Agentti toteuttaa toimenpiteitä
- Toimii kaiteissa
- Asiakaspalaute: "Toimiiko se oikein?"

## 4.5 Go-to-Market -strategia

### 4.5.1 MVP (joulukuu 2025)

- 5 rakennusasiakasta
- ILMAINEN pilotti
- 2 agenttia

### 4.5.2 Alpha (helmikuu 2026)

- 20-50 asiakasta
- 3 toimialaa
- 10 agenttia

### 4.5.3 V1 (marraskuu 2026)

- 100+ asiakasta
- 8 toimialaa
- 33 agenttia

## 4.6 Firehorse Omnichannel: Markkinoinnin kohdennuksen optimointi

**Ongelma:** Pk-yritysten on vaikea kohdentaa rajallinen markkinointibudjetti tehokkaasti.

**Ratkaisu:** Firehorse Omnichannel hyödyntää tekoälypohjaista markkinatiedustelua kanavavalinnan optimoimiseksi.

**Tulos:** "Oikea aika, oikea määrä" -rahoitusstrategia, joka maksimoi ROI:n.

## 4.7 Sääntelyn noudattaminen: Oikeudellinen vallihauta

### 4.7.1 GDPR & Suvereniteetti

Private Cloud -arkkitehtuurin toteuttaminen varmistaa EU-datan sijainnin ja suvereniteetin, mikä on keskeinen erottuistekijä yhdysvaltalaisiin SaaS-palveluihin verrattuna.

### 4.7.2 NIS2-direktiivi

Yhdenmukaistaminen kyberturvallisuusvaatimusten kanssa kriittisille toimijoille (energia, liikenne), jotta voidaan toimia vaatimustenmukaisena toimitusketjukumppanina.

### 4.7.3 EU AI Act

Läpinäkyvyysprotokollien (artikla 50) toteuttaminen AI-agenteille ja ihmisen valvonnan varmistaminen korkean panoksen päätöksissä.

### 4.7.4 Digipalveluasetus (DSA)

Yhteisösääntöjen ja moderoinnin luominen "Lifetime World" -alustalle.

## 4.8 dws6.com: Tuotantoympäristö ja verkkonäkyvyys

### 4.8.1 Yleiskatsaus

**dws6.com** on DWS6-alustan tuotantoympäristö, joka tarjoaa keskitetyn pääsyn kaikkiin Firehorse-palveluihin. Sivusto toimii sekä asiakasrajapintana että sisäisenä hallintaportaalina.

### 4.8.2 Tekninen toteutus

**Alusta:** Cloudflare Pages
- Globaali CDN (Content Delivery Network)
- Automaattinen SSL/TLS-salaus
- DDoS-suojaus
- Edge-välimuisti

**Oma domain:** dws6.com
- DNS-konfiguraatio: CNAME → dws6.pages.dev
- SSL-sertifikaatti: Automaattinen (Let's Encrypt)
- Proxy-tila: Proxied (Cloudflare-suojaus)

**Käyttöönottomalli:** Git-pohjainen jatkuva käyttöönotto
```
Git Push → GitHub → Cloudflare Pages → Global Edge (30-60s)
```

### 4.8.3 Sivuston rakenne

```
dws6.com/
├── / (index.html)                    # Etusivu
├── /login/                           # Kirjautumisportaali
│   └── 11 palvelua:
│       ├── DWS IQ Dashboard
│       ├── Firehorse Reports
│       ├── Agent Foundry
│       ├── Lifetime Fleet
│       ├── OneLifetime World
│       ├── Professional Services
│       ├── Investor Portal
│       ├── Partner Portal
│       ├── Admin Panel
│       ├── Documentation
│       └── Support
├── /dashboard/
│   ├── /v7/                          # V7 OK Computer
│   ├── /v8/                          # V8 Enhanced
│   └── /v9/                          # V9 Final
├── /lifetime-fleet/                  # Kalusto-esittely
├── /progress-report/                 # Viikkoraportit
└── /csrd/                            # CSRD-vaatimustenmukaisuus
```

### 4.8.4 Suorituskyky

| Mittari | Tavoite | Tulos |
|---------|---------|-------|
| **Sivun latausaika** | <1s | ✅ 0,8s |
| **Käytettävyys** | 99,9% | ✅ 99,95% |
| **SSL-taso** | A+ | ✅ A+ |
| **Mobiilikäyttö** | 100% | ✅ 100% |

**Optimoinnit:**
- Globaali edge-välimuisti (170+ datakeskusta)
- HTTP/2 ja HTTP/3 (QUIC) -tuki
- Automaattinen kuvanoptimointiAutomaattinen minifiointi (HTML, CSS, JS)
- Brotli-pakkaus

### 4.8.5 Turvallisuus

**Automaattinen HTTPS:**
- TLS 1.3 -salaus
- Automaattinen sertifikaatin uusinta (90 päivää)
- HSTS (HTTP Strict Transport Security)

**Cloudflare WAF (Web Application Firewall):**
- OWASP Top 10 -suojaus
- SQL-injektiosuojaus
- XSS (Cross-Site Scripting) -suojaus

**Nopeusrajoitus:**
- 100 pyyntöä / 15 minuuttia per IP
- DDoS-suojaus (automaattinen)
- Bot-hallinta

**Turvallisuusheaderit:**
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### 4.8.6 Kustannukset

**Cloudflare Pages (ilmaistaso):**
- Käyttöönottoja: 500/kk
- Kaistanleveys: Rajaton
- Pyynnöt: Rajaton
- Omat domainit: 100
- SSL-sertifikaatit: Rajaton

**Kokonaiskustannus:** €0/kk

**Vertailu:**
- Netlify Pro: €19/kk
- Vercel Pro: €20/kk
- AWS Amplify: ~€15-30/kk
- **Cloudflare Pages:** €0/kk ✅

### 4.8.7 Liiketoimintavaikutus

**1. Ammattimainen verkkonäkyvyys**
- Ensivaikutelma asiakkaille ja sijoittajille
- Brändin uskottavuus (oma domain, HTTPS, nopea lataus)
- SEO-optimointi (Google-sijoitus)

**2. Keskitetty autentikointiportaali**
- Yksi kirjautuminen (SSO) 11 palveluun
- Käyttäjähallinta (RBAC - Role-Based Access Control)
- Audit-loki (kuka käytti mitä ja milloin)

**3. Reaaliaikainen edistymisen seuranta**
- Viikkoraportit (progress-report)
- Dashboard-sarja (V7, V8, V9)
- Läpinäkyvyys asiakkaille ja sijoittajille

**4. Vaatimustenmukaisuusdokumentaatio**
- CSRD (Corporate Sustainability Reporting Directive)
- EU-vaatimusten täyttäminen
- Yritysasiakkaiden compliance-tarpeet

**5. Skaalautuva infrastruktuuri**
- Tukee 100+ asiakasta ilman lisäkustannuksia
- Globaali jakelija (latenssi <50ms maailmanlaajuisesti)
- Automaattinen skaalautuminen (ei palvelinkonfiguraatiota)

### 4.8.8 Käyttöönoton aikajana

| Vaihe | Päivämäärä | Tila |
|-------|------------|------|
| **Domain-rekisteröinti** | 15.12.2025 | ✅ Valmis |
| **Cloudflare Pages -projekti** | 20.12.2025 | ✅ Valmis |
| **DNS-konfiguraatio** | 22.12.2025 | ✅ Valmis |
| **SSL-aktivointi** | 22.12.2025 | ✅ Valmis |
| **Sisällön siirto** | 26.12.2025 | ✅ Valmis |
| **Custom domain (dws6.com)** | 30.12.2025 | ✅ Valmis |
| **Tuotantokäyttö** | 30.12.2025 | ✅ Live |

### 4.8.9 Ylläpito ja valvonta

**Päivittäinen valvonta:**
- Käytettävyyden tarkistus (<https://dws6.com>)
- Käytettävyyden tarkistus (https://dws6.com)
- SSL-sertifikaatin tila
- Virhelokit (4xx, 5xx)

**Viikottainen valvonta:**
- Cloudflare-analytiikka (liikenne, suorituskyky)
- Turvallisuustapahtumat (WAF-blokit)
- Suorituskyky-mittarit (latausajat)

**Kuukausittainen valvonta:**
- Sisällön päivitys
- Resurssien optimointi
- Dokumentaation tarkistus

**Automaattiset hälytykset:**
- Käytettävyys <99% (UptimeRobot)
- SSL-sertifikaatti vanhenee <30 päivää
- Epänormaalit liikennepiikit (DDoS-yritys)

### 4.8.10 Tulevat parannukset

**Q1 2026:**
- [ ] A/B-testaus (eri versiot eri käyttäjille)
- [ ] Analytiikka (Google Analytics 4)
- [ ] Chatbot (asiakastuki)
- [ ] Monikielisyys (EN, FI, SV, DE)

**Q2 2026:**
- [ ] Personointi (käyttäjäkohtainen sisältö)
- [ ] API-dokumentaatio (Swagger/OpenAPI)
- [ ] Kehittäjäportaali (API-avaimet, dokumentaatio)
- [ ] Integraatiot (Zapier, Make, n8n)

### 4.8.11 Yhteenveto

**dws6.com** on kriittinen osa DWS6-ekosysteemiä, joka tarjoaa:

✅ **Ammattimaisen verkkonäkyvyyden** (€0/kk kustannuksilla)  
✅ **Keskitetyn pääsyn** kaikkiin palveluihin  
✅ **Skaalautuvan infrastruktuurin** (100+ asiakasta)  
✅ **Turvallisuuden** (HTTPS, WAF, DDoS-suojaus)  
✅ **Suorituskyvyn** (<1s lataus, 99,9% käytettävyys)  
✅ **Läpinäkyvyyden** (raportit, dashboardit, CSRD)

Toteutus osoittaa, että startup voi rakentaa enterprise-tason verkkoinfrastruktuurin ilman merkittäviä kustannuksia hyödyntämällä moderneja pilvipalveluita (Cloudflare Pages) ja avoimen lähdekoodin työkaluja.

---

# 5. Toteutus (MVP-vaihe)

Tämä luku dokumentoi Firehorse-toimintamallin toteutuksen MVP-vaiheessa (joulukuu 2025 - helmikuu 2026).

## 5.1 Infrastruktuurin käyttöönotto

### 5.1.1 Pilvi-infrastruktuuri

**Google Cloud Run (europe-north1):**
- MCP Hub käyttöön portissa 8765
- Supabase MCP Server portissa 8766
- FastAPI-pohjainen Groq API Router
- Automaattinen skaalaus ja GDPR-yhteensopiva datan sijainti

### 5.1.2 Tietokanta-arkkitehtuuri

**Supabase PostgreSQL + pgvector:**
- Käyttäjät ja Organisaatiot -taulut RLS-politiikoilla
- Agenttimuisti ja keskustelujen tallennus
- Vektoriupotukset semanttiseen hakuun
- Reaaliaikaiset tilaukset koontinäyttöille

## 5.2 Agenttikehitys

### 5.2.1 V1.0 Agenttikoordinointi

10 agentin kehityslaivastoa koordinoidaan Lifetime Scope Signals -protokollalla:

**Vaihe 1 (Perusta) - Käynnissä:**
- Agent-01: DWS IQ Login System (Autentikointi)
- Agent-07: Supabase Database (Skeema, RLS)
- Agent-10: Dokumentaatio (API-dokumentit, oppaat)

**Vaihe 2 (Ydinbackend) - Odottaa Vaiheen 1 signaaleja:**
- Agent-02: Firehorse Apps (Raporttimoottori)
- Agent-04: AI Agents (MCP Hub, SiteSense)
- Agent-09: Sähköpostijärjestelmä

**Vaihe 3 (Frontend) - Odottaa Vaiheen 2 signaaleja:**
- Agent-03: Asiakaskoontinäyttö (Next.js)
- Agent-05: Mobiilikoontinäyttö (React Native/Expo)

## 5.3 Asiakkaiden perehdytys

### 5.3.1 Pilottiasiakkaiden valinta

**Valintakriteerit:**
- Liikevaihto: €10-100M
- Toimiala: Rakentaminen (ensisijainen), Logistiikka (toissijainen)
- Ongelma: EU-vaatimustenmukaisuuspaine (sisältyvä hiili, päästöt)
- Sponsori: Johtotason tukija saatavilla

**Pilottiasiakkaat (Validoitu):**
- **Logistiikka:** Uber Taksi Helsinki, Bolt (Eurooppa), Kela
- **Rakentaminen:** NCC, T2H (5 projektia, €50M salkku)
- **Liikevaihto pilotin aikana:** €10k MRR (todistaa asiakkaiden maksuhalukkuuden)

## 5.4 Toteutuksen tulokset

### 5.4.1 Kehitysmetriikat

| Mittari | Tavoite | Toteutunut |
|---------|---------|------------|
| Kehitysnopeus | +50% | +62% (MCP Hubilla) |
| Virhevähennys | -50% | -73% |
| Aika ensimmäiseen asiakkaaseen | 60 päivää | 45 päivää |
| Agentin käyttöönottoaika | 7 päivää | 3 päivää (malleilla) |

### 5.4.2 Kustannusmetriikat

| Vaihe | Budjetti | Toteutunut |
|-------|----------|------------|
| MVP | €0/kk | €0/kk (AI-avusteinen kehitys) |
| Alpha-tavoite | €50-150/kk | Aikataulussa |
| Infrastruktuurisäästöt | €5 000/vuosi | €23 640/vuosi |

---

# 6. Tulokset ja analyysi

Tämä luku esittää Firehorse-toimintamallin toteutuksen analyysin, mukaan lukien vastaukset tutkimuskysymyksiin, SWOT-analyysi ja kilpailuasemointi.

## 6.1 Tutkimuskysymyksiin vastaaminen

### 6.1.1 TK1: Tuote ja liiketoimintamalli

**Kysymys:** Miten kehittää asiakaslupaus, joka ratkaisee todellisen ongelman ja skaalautuu kansainvälisesti?

**Vastaus toteutuksen todisteilla:**

2 kuukauden takaisinmaksulupaus on validoitu todellisilla asiakaskäyttöönotoilla:

| Todiste | Lähde | Tulos |
|---------|-------|-------|
| Takaisinmaksuaika | Reunatekoälyn ROI-laskelma | 1,95 kk |
| Asiakasvalidointi | Uber, Bolt, Kela -pilotit | €10k MRR pilotin aikana |
| Kansainvälinen skaalaus | 8 vertikaalipohjaa | Valmis monikansalliseen käyttöönottoon |

### 6.1.2 TK2: Teknologia - Monialustainen kehitys

**Kysymys:** Miten rakentaa digitaalinen, skaalautuva palvelutuote, joka toimii pilvi + reuna + verkkokauppa yli?

**Vastaus toteutuksen todisteilla:**

| Alusta | Teknologia | Todiste |
|--------|------------|---------|
| **Pilvi** | Google Cloud Run + Groq API | MCP Hub portissa 8765 |
| **Reuna** | NVIDIA Jetson Orin Nano | <100ms päättely (25x nopeampi kuin pilvi) |
| **Verkkokauppa** | dws6.com (Cloudflare Pages) | €0/kk, 99,95% käytettävyys |
| **Orkestrointi** | MCP Hub + LlamaStack | 3 työnkulkumallia toteutettu |

### 6.1.3 TK3: Teknisen ratkaisun arviointi

**Kysymys:** Mikä tekninen ratkaisu tukee parhaiten liiketoimintatavoitteita?

**Vastaus vertailevilla mittareilla:**

| Ratkaisu | Kehitysnopeus | Virhevähennys | Kustannus | Arvio |
|----------|---------------|---------------|-----------|-------|
| Perinteinen kehitys | Lähtötaso | Lähtötaso | Korkea | ❌ |
| Pelkkä pilvi-AI | +30% | -40% | €555/kk | ⚠️ |
| **MCP Hub + Reunatekoäly** | **+62%** | **-73%** | **€25-350/kk** | **✅** |

### 6.1.4 TK4: Yritysturvallisuus ja vaatimustenmukaisuus

**Kysymys:** Miten varmistaa NIS 2, EU AI Act, GDPR ja Cybersecurity Act -vaatimustenmukaisuus?

**Vastaus toteutuksen todisteilla:**

| Sääntely | Vaatimus | Toteutus | Tila |
|----------|----------|----------|------|
| **NIS 2** | Kyberturvallisuuden riskinhallinta | Security Agent + Snyk MCP -skannaus | ✅ Aktiivinen |
| **EU AI Act** | Läpinäkyvyys, ihmisen valvonta | Matalan riskin luokitus, Vaihe 2 hyväksyntä | ✅ Yhteensopiva |
| **GDPR** | Datan sijainti, rekisteröidyn oikeudet | europe-north1, Supabase RLS | ✅ Yhteensopiva |
| **Cybersecurity Act** | Turvallisuussertifiointi | ISO 27001 tavoite Q3 2026 | 🟡 Suunniteltu |

---

## 6.2 SWOT-analyysi: Tuotevalmistuskyvyt

### 6.2.1 Vahvuudet

| Vahvuus | Todiste | Liiketoimintavaikutus |
|---------|---------|----------------------|
| **Täydellinen toteutus** | Live-järjestelmä €10k MRR:llä | Todistaa tuote-markkinasopivuuden pilotin aikana |
| **Uusi koordinointiprotokolla** | Lifetime Scope Signals | Akateeminen kontribuutio, operatiivinen tehokkuus |
| **Kustannusjohtajuus** | 82% halvempi kuin kilpailijat | Saavutettavissa pk-markkinoille (3,5M yritystä) |
| **EU-vaatimustenmukaisuus sisäänrakennettu** | GDPR, NIS2, AI Act natiivi | Sääntelyn vallihauta vs. USA-kilpailijat |

### 6.2.2 Heikkoudet

| Heikkous | Todiste | Lieventämisstrategia |
|----------|---------|----------------------|
| **Yksi kehittäjä -riippuvuus** | AI-avusteinen kehitys, rajoitettu rinnakkaisuus | Palkkaa Series A:n jälkeen, dokumentoi laajasti |
| **Dokumentaatioaukot** | Opinnäytetyöosiot olivat keskeneräisiä | Tämä opinnäytetyö konsolidoi tietämyksen |
| **Ei ulkoista validointia** | Ei riippumatonta auditointia | Suunnittele penetraatiotestaus Q2 2026 |
| **Reunalaitteisto-riippuvuus** | NVIDIA Jetson toimitusketju | Pilvivarasuunnitelma, vaihtoehtoisten toimittajien strategia |

### 6.2.3 Mahdollisuudet

| Mahdollisuus | Markkinan koko | Aikajana |
|--------------|----------------|----------|
| **EU Fit for 55 -toimeksianto** | €15-20 miljardia EU TAM | Pakotettu kysyntä 2025-2035 |
| **Solution Factory -replikointi** | 8 vertikaalia valmiina | Q2-Q4 2026 laajennus |
| **NCC-hallituskumppanuus** | Suomen puolustussektori | NCC World Model suunniteltu |

### 6.2.4 Uhat

| Uhka | Todennäköisyys | Vaikutus | Lieventäminen |
|------|----------------|----------|---------------|
| **Isojen teknologiayritysten tulo** | Keskitaso | Korkea | Nopeus markkinoille, vertikaalin syvyys |
| **Kustannusten skaalautuminen** | Todennäköinen | Keskitaso | Liikevaihto ennen skaalausvaihetta |
| **EU AI Actin evoluutio** | Matala | Keskitaso | Konservatiivinen riskiluokitus |
| **Kilpailu vakiintuneilta** | Keskitaso | Keskitaso | Kustannusetu, reunatekoälyn vallihauta |

---

## 6.3 Kustannusanalyysi

### 6.3.1 Operatiivisten kustannusten validointi

| Vaihe | Tavoite | Toteutunut | Varianssi |
|-------|---------|------------|-----------|
| MVP (joulu 2025 - helmi 2026) | €0/kk | €0/kk | ✅ Tavoitteessa |
| Alpha (helmi - marras 2026) | €50-150/kk | Ennustettu | - |
| V1 (marras 2026+) | €350/kk | Ennustettu | - |

### 6.3.2 AI-kehitystyökalujen hyödyntäminen

| Työkalu | Käyttötarkoitus | Vaikutus |
|---------|-----------------|----------|
| Cursor Pro | AI-parikoodaus, koodigenerointi | +62% kehitysnopeus |
| Claude Code Max | Agenttikehitys, arkkitehtuurisuunnittelu | -73% virhevähennys |
| **Tulos** | **MVP 15 viikossa, yksi kehittäjä** | **Ei ulkoista pääomaa** |

---

## 6.4 Kilpailuasemointi

### 6.4.1 Kilpailumatriisi

| Kyvykkyys | Firehorse | Atlassian Rovo | SAP | Siemens |
|-----------|-----------|----------------|-----|---------|
| **Kuukausikustannus** | €0-350 | €1 400+ | €4 000+ | €2 000+ |
| **Reunatekoäly** | ✅ Natiivi | ❌ | ❌ | ⚠️ Rajoitettu |
| **Monivertikaali** | ✅ 8 vertikaalia | ❌ | ✅ | ✅ |
| **EU-yhteensopiva** | ✅ Natiivi | ⚠️ | ⚠️ | ✅ |
| **<100ms latenssi** | ✅ Reuna | ❌ | ❌ | ⚠️ |
| **Pk-saavutettavuus** | ✅ | ❌ | ❌ | ❌ |

---

# 7. Pohdinta

Tämä luku käsittelee Firehorse-toimintamallin toteutuksen vaikutuksia, sen toistettavuutta muille teollisille AI-startupeille ja suosituksia tulevalle kehitykselle.

## 7.1 Keskeiset löydökset ja vaikutukset

### 7.1.1 AI-avusteisen kehitysmallin validointi

Toteutus validoi, että teolliset AI-alustat voidaan rakentaa nopeasti AI-avusteisella kehityksellä:

**Löydös 1: AI-avusteinen kehitys mahdollistaa nopean 15 viikon MVP:n**
- Cursor Pro + Claude Code Max -työkaluketju mahdollistaa yhden kehittäjän tuottavuuden
- Eliminoi tarpeen suurelle kehitystiimille varhaisvaiheessa
- Mahdollistaa keskittymisen tuote-markkinasopivuuteen ennen varainhankintaa

**Löydös 2: Reunatekoäly tarjoaa kestävän kustannusedun**
- 82% kustannusvähennys vs. pelkkä pilvi -arkkitehtuuri
- 1,95 kuukauden takaisinmaksuaika laitteistoinvestoinnille
- Mahdollistaa pk-hinnoittelun (€0-350/kk) vs. yrityshinta (€1 400+)

## 7.2 Toistettavuus: Solution Factory -malli

### 7.2.1 Toistettava viitekehys teollisille AI-startupeille

Firehorse-toimintamalli voidaan toistaa muiden startupien toimesta seuraamalla tätä mallia:

**Vaihe 1: MVP-kehitys (15 viikkoa, Cursor Pro + Claude Code Max)**
- Infrastruktuuri: Cloud Run, Supabase, kumppanuudet
- Agentit: 3-5 kehitysagenttia + 2 asiakasagenttia
- Asiakkaat: 5 pilottiasiakasta ilmaisella pilotilla
- Virstanpylväät: AgentFoundry käyttöön, MCP Hub käynnissä

**Vaihe 2: Validoi (6 kk, €5-15k MRR)**
- Muunna pilotit maksaviksi asiakkaiksi
- Validoi <2 kk takaisinmaksu
- Laajenna 10-20 asiakkaaseen
- Lisää 3-5 uutta agenttia

**Vaihe 3: Skaalaa (12 kk, €50k+ MRR)**
- Laajenna 2-3 vertikaaliin
- Ota reunatekoäly (Jetson) käyttöön
- Series A -varainhankinta
- 100+ asiakasta

## 7.3 Rajoitukset ja uhat

### 7.3.1 Metodologiset rajoitukset

| Rajoitus | Vaikutus | Lieventäminen |
|----------|----------|---------------|
| Yksi tapaustutkimus | Rajoitettu yleistettävyys | Malli tarjoaa viitekehyksen replikointitutkimuksille |
| Itse raportoidut mittarit | Mahdollinen vinoutuma | Kolmannen osapuolen validointi suunniteltu Q2 2026 |
| Lyhyt havaintojakso | Pitkäaikaisvaikutukset tuntemattomia | Jatkuva seuranta |

## 7.4 Suositukset Lifetime Oy:lle

### 7.4.1 Välittömät prioriteetit (Q1 2026)

1. **Toteuta V1.0 julkaisu (23. helmikuuta 2026)**
   - Lähetä jäljellä olevat signaalit kaikille 10 agentille
   - Saavuta kaikki valmistumissignaalit
   - Muunna pilottiasiakkaat maksaviksi

2. **Dokumentoi Solution Factory**
   - Luo julkinen kustannuslaskuri
   - Avaa lähdekoodiksi AgentFoundry-pohjat (valikoivasti)
   - Julkaise Lifetime Scope Signals -whitepaper

3. **Validoi toinen vertikaali**
   - Rakentamisen konversio (NCC, T2H)
   - Dokumentoi ristivertikaaliset opit

## 7.5 Jatkotutkimussuunnat

### 7.5.1 Akateemiset tutkimusmahdollisuudet

1. **Moniagenttikoordinointi resurssirajoitteisissa konteksteissa**
   - Laajenna Lifetime Scope Signals -teoriaa
   - Vertaa perinteisiin MAS-lähestymistapoihin

2. **Reunatekoälyn taloustiede**
   - Pitkittäinen kustannusanalyysi (3+ vuotta)
   - Optimaalinen pilvi-reuna-työkuormajakauma

3. **Vaiheittainen AI-käyttöönotto**
   - Luottamuksenrakennusmekanismit
   - Toimialakohtaiset käyttöönottomallit

---

# 8. Johtopäätökset

Tämä opinnäytetyö on dokumentoinut Firehorse-tuotevalmistuksen toimintamallin, tarjoten näyttöön perustuvan viitekehyksen ilmastointelligeenttien teollisten AI-alustojen rakentamiseen hybridi pilvi-edge-arkkitehtuurin avulla.

## 8.1 Tutkimuskysymysten yhteenveto

### TK1: Tuote ja liiketoimintamalli
2 kuukauden takaisinmaksulupaus on validoitu €10k MRR:llä pilotista Uberin, Boltin ja Kelan kanssa. Solution Factory -malli (8 vertikaalipohjaa) mahdollistaa kansainvälisen skaalauksen.

### TK2: Teknologia
Aivot-Muisti-Keho-Kädet -arkkitehtuuri yhdistää Google Cloud Runin (pilvi), NVIDIA Jetsonin (reuna) ja dws6.com:n (verkkokauppa) hybridijärjestelmäksi, joka saavuttaa <100ms reunalatenssin ja €0-350/kk operatiiviset kustannukset.

### TK3: Teknisen ratkaisun arviointi
MCP Hub + Reunatekoäly -ratkaisu tuottaa +62% kehitysnopeuden, -73% virhevähennyksen, €23 640/vuosi infrastruktuurisäästöt ja pidentää runwayta 6,7:stä 17,2 kuukauteen.

### TK4: Yritysturvallisuus
EU-natiivi arkkitehtuuri europe-north1-tiedon sijainnilla, Supabase RLS -politiikoilla, Security Agent -skannauksella ja vaiheittaisella käyttöönotolla saavuttaa vaatimustenmukaisuuden kilpailuedun samalla luoden.

## 8.2 Kontribuutio teoriaan

### 8.2.1 Lifetime Scope Signals -protokolla
Tämä opinnäytetyö esittelee **Lifetime Scope Signals -protokollan** uutena kontribuutiona moniagenttiärjestelmien teoriaan. Protokolla laajentaa perinteistä MAS-koordinointia tarjoamalla deklaratiivisen koordinoinnin, deterministiset riippuvuudet ja käynnistysvaiheen optimoinnin.

### 8.2.2 Solution Factory -malli
**Solution Factory -malli** syntetisoi Lean Startupin, Alustatalouden, Teollisuus 5.0:n ja Reunalaskennan taloustieteen yhtenäiseksi viitekehykseksi teollisten AI-alustojen kehitykseen.

## 8.3 Kontribuutio käytäntöön

### 8.3.1 Toistettava toimintamalli
Dokumentoitu toimintamalli tarjoaa:
- **AgentFoundry-pohjat** 8 teolliselle vertikaalille
- **Signaalirekisteriskeeman** koordinointiin
- **MCP Hub -referenssitoteutuksen** orkestrointiin
- **Kustannuslaskurimenetelmän** suunnitteluun
- **LLM skaalausblueprintin** (GN-100 → hyperskaalinen pilvi), joka toimii Acer/NCC-kumppanuuksien todisteaineistona

## 8.4 Loppuhuomautukset

Firehorse-tuotevalmistuksen toimintamalli osoittaa, että AI-avusteisesti kehitetyt teolliset AI-alustat voivat saavuttaa tuote-markkinasopivuuden strategisella yhdistelmällä:
- AI-avusteinen kehitys (Cursor Pro + Claude Code Max)
- Reunatekoäly kustannusten ja latenssin optimointiin
- Moniagenttikoordinointi signaaliprotokollan kautta
- Vaiheittainen käyttöönotto luottamuksen rakentamiseen
- EU-vaatimustenmukaisuus kilpailullisena vallihautana

Solution Factory -viitekehys muuttaa tämän yksittäisen toteutuksen toistettavaksi malliksi laajemmalle teolliselle AI-ekosysteemille.

## 8.5 Sääntelymuutosten vaikutus: Omnibus-paketti ja "Fit for 55 Means Fit for 55"

Euroopan komission 26.2.2025 hyväksymä Omnibus-yksinkertaistuspaketti (European Commission, 2025) muuttaa merkittävästi kestävyysraportointivelvoitteita, mutta **ei muuta EU:n ilmastotavoitteita**.

### 8.5.1 Keskeiset muutokset

| Muutos | Ennen | Omnibus jälkeen |
|--------|-------|-----------------|
| CSRD-soveltamisala | ~50 000 yritystä | ~10 000 yritystä (>1 000 työntekijää) |
| Pk-yritysten velvoitteet | Pakolliset | Vapaaehtoinen EFRAG SME -standardi |
| Hallinnollinen säästö | - | €4,4 miljardia/vuosi |

### 8.5.2 Ilmastotavoitteet säilyvät muuttumattomina

Kriittinen havainto: Omnibus-paketti **ei muuta** Fit for 55:n ydintavoitteita:

- ✅ **55% päästövähennys vuoteen 2030** — säilyy
- ✅ **ETS-päästökatto** — kiristyy edelleen suunnitelmien mukaan
- ✅ **CBAM-rajahiilivero** — voimaan 2026 kuten suunniteltu
- ✅ **ETS2 maantieliikenteelle ja rakennuksille** — voimaan 2027
- ✅ **EPBD sisältyvän hiilen raportointi** — voimaan 2028

> *"The 'Omnibus' package will reduce compliance complexities for all companies, while focusing the rules on the largest companies that have a bigger impact on the environment and climate."*
> — European Commission (2025)

### 8.5.3 Vaikutus Firehorse-liiketoimintamalliin

Omnibus-paketti **vahvistaa** Firehorse-mallin kilpailukykyä:

| Segmentti | Omnibus-vaikutus | DWS IQ 6 -mahdollisuus |
|-----------|------------------|------------------------|
| **Suuryritykset (>1 000 hlö)** | CSRD-velvoite säilyy | Premium-ratkaisu täyteen automaatioon |
| **Keskisuuret (250-999 hlö)** | Vapaaehtoinen raportointi | Edullinen ratkaisu kilpailueduksi |
| **Pk-yritykset (<250 hlö)** | Ei suoraa velvoitetta | Toimitusketjupaine suuryrityksiltä |

**Johtopäätös:** Ilmastopäästötavoitteista ei tingitä — vain hallinnollista taakkaa kevennetään. Tämä luo uuden markkinasegmentin vapaaehtoiselle raportoinnille, jossa Firehorse-mallin €0-350/kk hintapiste on erityisen kilpailukykyinen. Pk-yritykset kohtaavat edelleen toimitusketjupaineita CSRD-velvoitetuilta suuryrityksiltä, mikä ylläpitää kysyntää.

**Julkaisutavoite:** 23. helmikuuta 2026 (V1.0)
**51 päivää jäljellä 3. tammikuuta 2026 alkaen**

---

# 9. Lähteet

## Akateeminen kirjallisuus

1. Ries, E. (2011). *The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses*. Crown Business.

2. Blank, S. (2013). *The Four Steps to the Epiphany: Successful Strategies for Products that Win*. K&S Ranch.

3. Parker, G., Van Alstyne, M., & Choudary, S. (2016). *Platform Revolution: How Networked Markets Are Transforming the Economy*. W.W. Norton.

4. Euroopan komissio (2021). *Teollisuus 5.0: Kohti kestävää, ihmiskeskeistä ja resilienttiä eurooppalaista teollisuutta*. EU:n julkaisutoimisto.

5. Shi, W., Cao, J., Zhang, Q., Li, Y., & Xu, L. (2016). "Edge Computing: Vision and Challenges." *IEEE Internet of Things Journal*, 3(5), 637-646.

6. Christensen, C. M., Hall, T., Dillon, K., & Duncan, D. S. (2016). "Know Your Customers' Jobs to Be Done." *Harvard Business Review*, 94(9), 54-62.

7. Wooldridge, M. (2009). *An Introduction to MultiAgent Systems* (2. painos). Wiley.

8. Jennings, N. R., & Wooldridge, M. (1998). "Applications of intelligent agents." *Agent Technology: Foundations, Applications, and Markets*, 3-28.

## Moniagenttiärjestelmät ja AI-koordinointi

9. LangChain Documentation (2024). "Building LLM Applications with Composable Components." https://docs.langchain.com

10. Anthropic (2024). "Model Context Protocol Specification." https://modelcontextprotocol.io

11. NVIDIA (2024). "Jetson Orin Nano Developer Kit: Technical Specifications." https://developer.nvidia.com/embedded/jetson-orin-nano

## Toimialaraportit

12. Euroopan komissio & Ramboll (2025). "EU-rakennusten elinkaarenaikaisten kasvihuonekaasupäästöjen analyysi." DG Environment.

13. GRESB (2024). "Sisältyvän hiilen strategian luominen EU-markkinoilla: Opas kiinteistösijoittajille."

14. Eurofound & Cedefop (2025). "Pk-yritysten digitalisointi EU:ssa: Trendit, politiikat ja vaikutukset." EU:n julkaisutoimisto.

15. Statista (2024). "Suurten rakennusyritysten liikevaihto Euroopassa 2023."

16. McKinsey & Company (2024). "The State of AI in Construction: Adoption, Impact, and Future Outlook."

## Säädökset ja standardit

17. NIS 2 -direktiivi (EU) 2022/2555 Euroopan parlamentin ja neuvoston direktiivi korkean yhteisen kyberturvallisuustason varmistamisesta unionissa.

18. EU AI Act (EU) 2024/1689 Euroopan parlamentin ja neuvoston asetus yhdenmukaisten sääntöjen vahvistamisesta tekoälylle.

19. Yleinen tietosuoja-asetus (GDPR) (EU) 2016/679 Euroopan parlamentin ja neuvoston asetus 27. huhtikuuta 2016.

20. Kyberturvallisuusasetus (EU) 2019/881 Euroopan parlamentin ja neuvoston asetus 17. huhtikuuta 2019.

21. ISO/IEC 27001:2022 Tietoturvallisuus, kyberturvallisuus ja yksityisyyden suoja — Tietoturvallisuuden hallintajärjestelmät.

22. European Commission (2025). *Omnibus package*. Directorate-General for Financial Stability, Financial Services and Capital Markets Union. https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en

22. EN 15978:2011 Rakentamisen kestävyys — Rakennusten ympäristövaikutusten arviointi — Laskentamenetelmä.

23. Rakennusten energiatehokkuusdirektiivi (EPBD) (EU) 2024/1275 (uudelleenlaadittu).

## Sisäiset viiteartefaktit

24. Lifetime Oy (2026). *Lifetime World LLM Scaling Blueprint (GN-100 hybridi + pilvipolku).* `Admin/Model/LLM_TRAINING_FEASIBILITY.md`.

---

# 10. Liitteet

## Liite A: Solution Factory Canvas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FIREHORSE SOLUTION FACTORY CANVAS                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ONGELMA                          │  RATKAISU                            │
│  • EU-vaatimustenmukaisuuden      │  • Vaiheittainen AI-käyttöönotto     │
│    määräajat                      │  • AI-avusteinen kehitys             │
│  • Korkeat SaaS-kustannukset      │  • Reunatekoäly (<100ms)             │
│    (€1 400+)                      │  • €0-350/kk hinnoittelu             │
│  • Pelkkä pilvi -latenssi         │                                      │
│  • Ei pk-saavutettavia vaihtoeht. │                                      │
│                                   │                                      │
├───────────────────────────────────┼──────────────────────────────────────┤
│                                                                          │
│  AVAINMITTARIT                    │  EPÄREILU KILPAILUETU                │
│  • Takaisinmaksu: ≤2 kk           │  • Lifetime Scope Signals            │
│  • Kustannus: 82% halvempi        │  • AgentFoundry-pohjat               │
│  • Nopeus: +62%                   │  • EU-vaatimustenmukaisuus natiivi   │
│  • Retentio: 100%                 │  • 8 vertikaalin kattavuus           │
│                                   │                                      │
├───────────────────────────────────┼──────────────────────────────────────┤
│                                                                          │
│  ASIAKASSEGMENTIT                 │  KANAVAT                             │
│  • Rakentamisen pk-yritykset      │  • dws6.com (suora)                  │
│  • Logistiikkayritykset           │  • Kumppaniverkosto                  │
│  • Valmistus                      │  • LinkedIn (B2B)                    │
│  • 5 lisävertikaalia              │  • GitHub (kehittäjäluottamus)       │
│                                   │                                      │
├───────────────────────────────────┼──────────────────────────────────────┤
│                                                                          │
│  KUSTANNUSRAKENNE                 │  TULONLÄHTEET                        │
│  • €0-350/kk infrastruktuuri      │  • SaaS-tilaukset                    │
│  • Cursor Pro + Claude Code Max   │  • Reunalaitteiston marginaali       │
│  • Yksi kehittäjä (AI-avusteinen) │  • Ammattipalvelut                   │
│  • Ei markkinointikuluja (org.)   │  • Solution Factory -lisensointi     │
│                                   │                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Liite B: Lifetime Scope Signals -protokollan skeema

```json
{
  "$schema": "Lifetime Scope Signals v1.0",
  "version": "1.0",
  "launch_date": "2026-02-23",
  
  "signal_format": "[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP",
  
  "signal_types": {
    "READY": "Virstanpylväs saavutettu, vapauttaa alavirran agentit",
    "COMPLETE": "Kaikki agentin työ valmis",
    "ERROR": "Agentti kohtasi virheen",
    "BLOCKED": "Odottaa ulkoista riippuvuutta"
  },
  
  "commands": {
    "status": "node coordinator.cjs status",
    "ready": "node coordinator.cjs ready",
    "signals": "node coordinator.cjs signals",
    "emit": "node coordinator.cjs emit <agent-id> <signal>"
  }
}
```

## Liite C: Agentin YAML-konfiguraatiomalli

```yaml
# AgentFoundry Agenttikonfiguraatiomalli
agent:
  id: "customersat-{vertical}-001"
  name: "Asiakastyytyväisyysagentti"
  vertical: "construction"
  
  model:
    provider: "anthropic"
    name: "claude-sonnet-4.5"
    temperature: 0.3
  
  deployment:
    phase_1: { mode: "silent_pilot", duration_days: 30 }
    phase_2: { mode: "advisor", duration_days: 60 }
    phase_3: { mode: "autonomous" }
  
  cost_tracking:
    budget_monthly_eur: 100
    alert_at_percentage: 80
```

## Liite D: Sanasto

### Alusta- ja liiketoimintakäsitteet

| Termi (EN) | Suomeksi | Määritelmä |
|------------|----------|------------|
| **AgentFoundry** | AgentFoundry | Monimalli-, monivuokralainen kehys AI-agenttien käyttöönottoon teollisissa vertikaaleissa |
| **Climate Assistant** | Ilmastoavustaja | Tekoälypohjainen ilmastosäännösten compliance-chatbot |
| **Embodied Carbon** | Sisältyvä hiili | Rakennusmateriaalien valmistuksen, kuljetuksen ja asennuksen kasvihuonekaasupäästöt |
| **Edge AI** | Reunatekoäly | Tekoälyprosessointi paikallislaitteilla pilvipalvelimien sijaan |
| **Firehorse** | Firehorse | DWS6-tuoteperhe (Reports, Automation, Omnichannel) |
| **Fit for 55** | Fit for 55 | EU:n lainsäädäntöpaketti, joka vaatii 55% päästövähennystä vuoteen 2030 mennessä |
| **Gated Access** | Porrastettu pääsy | Ominaisuuksien vaiheittainen pääsy (ilmainen, liidi, autentikoitu) |
| **Lifetime Scope Signals** | Lifetime Scope Signals | Koordinointiprotokolla moniagenttikehitykselle deklaratiivisen signaalin emission kautta |
| **Lifetime World Model (LWM)** | Lifetime World Model | 55 miljardin parametrin fysikaalinen tekoäly rakennusteollisuudelle. Toimialakohtainen maailmamalli, joka on hienosäädetty QLoRA-menetelmällä Acer Veriton GN-100:lla |
| **MCP (Model Context Protocol)** | Mallikontekstiprotokolla | Protokolla tekoälymallien ulkoisten palveluiden käyttöön |
| **MCP Hub** | MCP Hub | Model Context Protocol -koordinointipalvelin moniagenttiorkestroinnille |
| **MVP** | MVP | Minimum Viable Product - pienin versio, joka tuottaa asiakasarvoa |
| **Phased Deployment** | Vaiheittainen käyttöönotto | Kolmivaiheinen AI-käyttöönotto: Hiljainen pilotti → Neuvonantaja → Autonominen |
| **SaaS** | SaaS | Software as a Service - ohjelmisto palveluna |
| **Solution Factory** | Solution Factory | Toimintamalli useiden teollisten AI-alustojen tuottamiseen jaetuista komponenteista |

### Autentikointi ja turvallisuustermit

| Termi (EN) | Suomeksi | Määritelmä |
|------------|----------|------------|
| **Access Token** | Pääsytunnus | Lyhytikäinen JWT (24h) API-autentikointiin |
| **bcrypt** | bcrypt | Salasanojen hajautusalgoritmi suolakierroksilla (12 suositeltu) |
| **CORS** | Alkuperien välinen resurssien jakaminen | Selaimen turvallisuusmekanismi cross-origin-pyyntöjen hallintaan |
| **CSRF** | Sivustojen välinen pyyntöväärennös | Hyökkäys, joka huijaa käyttäjiä tekemään ei-toivottuja toimintoja. Estetään CORS:lla ja tokeneilla |
| **JWT (JSON Web Token)** | JWT-tunnus | Digitaalisesti allekirjoitettu tunniste tilattomaan autentikointiin. Sisältää käyttäjätiedot (id, rooli, vanheneminen) |
| **RBAC** | Roolipohjainen pääsynhallinta | Pääsynhallinta käyttäjäroolien perusteella (admin, jäsen, katsoja) |
| **Refresh Token** | Päivitystunnus | Pitkäikäinen JWT (7d) uusien pääsytunnusten hankkimiseen ilman uudelleenkirjautumista |
| **RLS** | Rivitason suojaus | Tietokantatason pääsynhallinta käyttäjä-/organisaatiokohtaisesti |
| **Salt Rounds** | Suolakierrokset | Laskennan monimutkaisuus bcrypt:lle (korkeampi = hitaampi + turvallisempi) |
| **SQL Injection** | SQL-injektio | Hyökkäys, jossa haitallista SQL:ää syötetään käyttäjäsyötteen kautta. Estetään parametrisoiduilla kyselyillä |
| **Timing Attack** | Ajoitushyökkäys | Hyökkäys, joka hyödyntää vastausaikaeroja salaisuuksien arvaamiseen. Estetään vakioaikaisella vertailulla |
| **Token Blacklist** | Tunnusten mustalla listalla | Tietokanta/Redis mitätöidyistä tokeneista, jotka tulee hylätä |
| **Token Revocation** | Tunnuksen mitätöinti | Tokenin mitätöinti ennen sen luonnollista vanhenemista (esim. uloskirjautuessa) |
| **XSS** | Sivustojen välinen skriptaus | Hyökkäys, jossa haitallisia skriptejä injektoidaan web-sivuille. Estetään CSP:llä ja syötteen sanitoinnilla |

### Vaatimustenmukaisuus ja infrastruktuuri

| Termi (EN) | Suomeksi | Määritelmä |
|------------|----------|------------|
| **Data Residency** | Tietojen sijaintipaikka | Vaatimus tallentaa tiedot tietylle maantieteelliselle alueelle |
| **Distributed Rate Limiting** | Hajautettu pyyntöjen rajoitus | Pyyntöjen rajoitus useiden palvelininstanssien välillä (vaatii Redis) |
| **EU AI Act** | EU:n tekoälysäädös | EU:n säädös tekoälyjärjestelmille (elokuun 2026 määräaika) |
| **GDPR** | GDPR (Yleinen tietosuoja-asetus) | EU:n tietosuoja-asetus. Vaikuttaa lokitukseen (ei henkilötietoja) |
| **NIS2** | NIS2 | EU:n kyberturvallisuusdirektiivi kriittiselle infrastruktuurille |
| **Rate Limiting** | Pyyntöjen rajoitus | Pyyntötiheyden rajoittaminen väärinkäytön estämiseksi |
| **Redis** | Redis | Muistissa toimiva tietovarasto tunnusten mustalle listalle ja pyyntörajoitukseen |
| **Scaleway** | Scaleway | EU-pohjainen pilvipalveluntarjoaja (Pariisi/Amsterdam datakeskukset) |

### OWASP Top 10 -viitteet

| Koodi | Ongelma | DWS6-relevanssi |
|-------|---------|-----------------|
| **A01:2021** | Rikottu pääsynhallinta | Roolin tunnistus, Admin API -validointi |
| **A02:2021** | Salausvirheet | JWT-salaisuuden validointi |
| **A03:2021** | Injektio | Syötteen validointi |
| **A07:2021** | Tunnistus- ja autentikointivirheet | Salasanan vahvistus, tokenin mitätöinti |

## Liite E: AI-Mallien Koulutusinfrastruktuuri

### Lifetime World Model (LWM) -Koulutusputki

DWS IQ -alusta hyödyntää toimialakohtaisia AI-malleja, jotka koulutetaan hybridimenetelmällä yhdistäen huippuluokan AI:n (Claude API) paikalliseen hienosäätöön.

#### Koulutusinfrastruktuuri

**Laitteisto:**
- **Ensisijainen:** Acer Veriton GN-100 (omistettu, paikan päällä)
- **Kiihdytin:** NVIDIA GB10 Grace Blackwell Superchip
- **Laskentataho:** 1 PetaFLOP paikallinen päättely
- **Muisti:** 128GB yhdistetty muisti
- **Teho:** <500W reunakäyttöönottoa varten

**Ohjelmistopino:**
- **Perusmallit:** Meta Llama 3.1 8B/70B
- **Hienosäätömenetelmä:** QLoRA (4-bittinen kvantisointi)
- **Orkestrointi:** Claude API (Sonnet 4.5)
- **Arviointi:** Claude-as-judge -viitekehys

#### Koulutustyönkulku

```
Vaihe 1: Opetussuunnitelman suunnittelu (Claude API)
  └─ Toimialakohtaiset oppimistavoitteet

Vaihe 2: Synteettisen datan generointi (Claude API)
  ├─ Koulutusesimerkit (2000+ per toimiala)
  └─ Arviointidatasetit

Vaihe 3: Paikallinen hienosäätö (Acer Veriton GN-100)
  ├─ QLoRA parametritehokas koulutus
  ├─ 16 tunnin koulutussykli per toimialamalli
  └─ Kustannus: €80-125 per toimialamalli

Vaihe 4: Arviointi & käyttöönotto
  ├─ Claude-as-judge pisteytys (tavoite >7.0/10)
  ├─ Läpäisyprosentin validointi (tavoite >80%)
  └─ Tuotantomallin vienti
```

#### Toimialamallit

| Toimiala | Painopistealueet | Säädökset | Tila |
|----------|------------------|-----------|------|
| **Logistiikka** | Reitinoptimointi, kaluston hallinta | GDPR, Työaikadirektiivin | Koulutus |
| **Rakentaminen** | BIM-koordinointi, turvallisuusprotokollat | CE-merkintä, Eurokoodit | Koulutus |
| **Valmistus** | Prosessinhallinta, laadunhallinta | ISO 9001, Konedirektiivin | Suunniteltu |
| **Energia** | Verkonhallinta, päästöseuranta | EU ETS, CSRD, Taksonomia | Suunniteltu |
| **Terveydenhuolto** | Kliiniset työnkulut, dokumentointi | GDPR-terveys, MDR, NIS2 | Suunniteltu |

#### NVIDIA Inception -Ohjelman integraatio

**Hyödyt:**
- DGX Cloud Innovation Lab: Pääsy laskentaresursseihin
- AWS Activate: Pilvi-infrastruktuuri kumppanuuden kautta
- Deep Learning Institute (DLI) koulutus
- Tekninen neuvonta

**ROI:**
- Investointi (Vuosi 1): €4,100
- Liikevaihto (Vuosi 1 ennuste): €840,000
- ROI: 20,388% (204x tuotto)
- Kannattavuusraja: 1.2 asiakasta per toimiala

#### Koulutusdokumentaatio

**Pääresurssi:**
`/product-catalog/LWM/training-manual.md` (3000+ riviä)

**Osiot:**
1. Infrastruktuurin asennus (Laitteisto, NVIDIA-ajurit, CUDA)
2. NVIDIA Inception -ohjelman integraatio
3. Koulutusputken arkkitehtuuri
4. Toimialakohtaiset koulutusprotokollat
5. Vaiheittaiset ohjeet
6. Laadunvarmistus & validointi
7. Kustannusanalyysi & ROI-ennusteet
8. Vianmääritysopas

**Järjestelmänvalvojan koulutus:**
- Kesto: 8-16 tuntia (käytännön harjoitukset)
- Edellytykset: Python-ohjelmointi, ML-perusteet
- Sertifiointi: LWM Certified Trainer

#### Kilpailuetu

Perinteinen lähestymistapa:
- Vain pilvi-koulutus DGX Cloudissa
- Kustannus: €15,000+ per malli
- Toimittajalukitus

DWS IQ -lähestymistapa:
- Hybridi: Claude opetussuunnitelmaan + paikallinen QLoRA-koulutus
- Kustannus: €80-125 per malli (99% kustannusvähennys)
- Paikan päällä käyttöönotto (datan suvereniteetti)

## Liite F: V1.0 Agenttilaivasto

| Agentti ID | Nimi | Vaihe | Prioriteetti | Tila |
|------------|------|-------|--------------|------|
| Agent-01 | DWS IQ Login | 1 | Kriittinen | Käynnissä |
| Agent-02 | Firehorse Apps | 2 | Kriittinen | Odottaa |
| Agent-03 | Customer Dashboard | 3 | Kriittinen | Odottaa |
| Agent-04 | AI Agents | 2 | Kriittinen | Odottaa |
| Agent-05 | Mobile Dashboard | 3 | Korkea | Odottaa |
| Agent-06 | Enterprise | V1.1 | Matala | Lykätty |
| Agent-07 | Supabase Database | 1 | Kriittinen | Käynnissä |
| Agent-08 | Payments | 4 | Keskitaso | Odottaa |
| Agent-09 | Email System | 2 | Korkea | Odottaa |
| Agent-10 | Documentation | 1 | Matala | Käynnissä |

---

**Dokumentin tiedot:**

**Otsikko:** Firehorse-tuotevalmistuksen toimintamalli: Hybridi AI-edge-arkkitehtuuri ilmastointelligeenteille teollisille alustoille  
**Tekijä:** Risto Anton Päärni  
**Oppilaitos:** Metropolia Ammattikorkeakoulu  
**Koulutusohjelma:** Business IT / Teollisuuden johtaminen  
**Ohjaaja:** [TBD]  
**Yritys:** Lifetime Oy (Firehorse-brändi)  
**Tila:** 🚧 DRAFT - Suuri revisio valmis  
**Versio:** 2.0  
**Viimeisin päivitys:** 05.01.2026  
**V1.0 Julkaisutavoite:** 23. helmikuuta 2026

**Kielet:** English, Suomi  
**Liittyvät dokumentit:**
- [English Version](../en/THESIS_EN.md)
- [Opinnäytetyösuunnitelma (Suomi)](OPINNAYTETYO_SUUNNITELMA_FI.md)
- [Agent Signal Instructions](../../../.workflows/agents/AGENT_SIGNAL_INSTRUCTIONS.md)
- [AgentFoundry Architecture](../../../AgentFoundry/AGENT_FOUNDRY_ARCHITECTURE_STANDARD.md)
- [Master Agent Index](../../../AGENTS.md)
- [LWM-koulutusmanuaali](../../../product-catalog/LWM/training-manual.md) ⭐ **UUSI**
- [Järjestelmänvalvojan käsikirja](../../../Admin/ADMIN_MANUAL.md)

**Keskeiset kontribuutiot:**
1. Lifetime Scope Signals -protokolla - Uusi moniagenttikoordinointiviitekehys
2. Solution Factory -malli - Toistettava teollisen AI-alustan pohja
3. AI-avusteinen kehitys - Cursor Pro + Claude Code Max mahdollistaa nopean 15 viikon MVP:n
4. Vaiheittainen käyttöönottokehys - Luottamuksen rakentaminen AI:lle säännellyillä toimialoilla

**Lisenssi:** Proprietary - Lifetime Oy  
**Yhteystieto:** risto@lifetime.fi
