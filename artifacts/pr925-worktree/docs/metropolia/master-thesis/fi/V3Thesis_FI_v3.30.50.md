# Firehorse-tuotevalmistuksen toimintamalli
## Hybridi AI-edge-arkkitehtuuri ilmastoälykkäille teollisille alustoille

***
# VERSION AND AGENT HISTORY

Version: 3.30.50

Sessions & Modifications:
  - Version: 3.30.50 | Tool: Claude Code (Opus 4.6) | Session: claude/create-finnish-thesis-v3.30.50-msO3q | Date: 04.04.2026 | Changes: JÄÄDYTETTY Metropolia-palautusversio (50 sivua). Uudelleenrakennettu v3.32:sta (82 sivua): Osio 5 laajennettu täydeksi toteutusluvuksi; osiot 10.6-10.18 konsolidoitu osioksi 10.6 (yhteenveto PHD Firehorse -viittauksilla); liitteet karsittu 8→4 (säilytetty A/B/C/D); alatunniste päivitetty. Ei lisää CC-muokkauksia — vain HIL.
  - Version: 3.32 | Tool: Claude Code (Opus 4.6) | Session: claude/review-claude-skills-vZQ0r | Date: 03.04.2026 | Changes: Lisätty osio 10.19 (Opinnäytetyön versiointistrategia: v3.30.50 Metropolia-jäädytys); lisätty avainpanos #23; luotu jäädytetty V3Thesis_EN_v3.30.50.md (50-sivuinen Metropolia-versio) säilyttäen 82-sivuinen elävä dokumentti; päivitetty alatunniste kaksoisversioarkkitehtuurilla
  - Version: 3.31 | Tool: Claude Code (Opus 4.6) | Session: claude/review-claude-skills-vZQ0r | Date: 31.03.2026 | Changes: Päivitetty osio 10.13.3 (Taitojen inventaario 6→21 taitoa, 4 aliagenttia, 4 kurinpitotaitoa); lisätty osio 10.13.7 (Kilpailija-analyysi: Toimialakohtainen vs geneerinen AI-harness — vertailu ECC 136-taidon kehykseen, kuusi kilpailuetua dokumentoitu); lisätty avainpanos #22
  - Version: 3.30 | Tool: Claude Code (Opus 4.6) | Session: claude/research-leworldmodel-r3VRA | Date: 25.03.2026 | Changes: Lisätty osio 10.18 (LWM-sekvensointistrategia)
  - Version: 3.0 | Tool: Claude Code (Opus 4.5) | Session: DWS10-Store-Integration | Date: 28.01.2026 | Changes: Lisätty DWS10.com verkkokaupan löydökset
  - Version: 1.0 | Tool: GitHub Copilot | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Applied DWS document standard, synchronized with English version

Session Links & References:
  - Claude Code (2026-02-10): V3-yhdistäminen ja skandinaavisten merkkien korjaus
  - Claude Code (2026-01-28): DWS10-kaupan integraatio, Google Merchant, Revolut, Äänichat-suunnitelma
  - Cursor AI (2026-01-05): Opinnäytetyön revisio integroiden koodikannan todisteet
  - GitHub Copilot (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/metropolia/master-thesis/fi/V3Thesis_FI.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 04.04.2026
  - Language: Finnish
  - Languages Available: English, Suomi
  - Publication Status: FROZEN v3.30.50 — Metropolian palautusversio (50 sivua). Elävä dokumentti jatkuu tiedostossa V3Thesis_FI.md (v3.32+)

---
**Opinnäytetyö**
**Metropolia Ammattikorkeakoulu**

**Tekijä:** Risto Anton Päärni
**Koulutusohjelma:** Smart Factory, YAMK
**Ohjaaja:** Jarno Varteva (mukana Erkki Räsänen)
**Yritys:** Lifetime Oy (Firehorse-brändi)
**Päivämäärä:** 16.1.2026
**InvestEU Portal:** Projekti Lifetime World, DWS IQ 6, Firehorse (INPO-20254383) jätetty julkaistavaksi InvestEU-portaaliin 25.12.2025 — InvestEU Portal Team, Euroopan komissio

---

## Tiivistelmä

Tämä opinnäytetyö tutkii Firehorse-tuotevalmistuksen toimintamallia, joka yhdistää pilvi- ja reunalaskentateknologiat teollisten pk-yritysten tarpeisiin. Työ keskittyy rakennusteollisuuteen ja sen haasteisiin EU:n kaksoissiirtymässä (digitaalinen + vihreä). **Versio 3.0 laajentaa tutkimusta verkkokauppavalidoinnilla DWS10.com-kaupan toteutuksen, Google Merchant Center -integraation, Revolut Business -maksukäsittelyn ja äänichat-kehityssuunnitelman kautta Groq-inferenssiä ja Llama-malleja käyttäen.**

**Avainsanat:** Tekoäly, reunalaskenta, rakennusteollisuus, toimintamalli, pilvipalvelut, verkkokauppa, Google Merchant Center, Revolut Business, äänichat, EU:n tekoälysäädös

---

## Abstract

This thesis examines the Firehorse product manufacturing operating model, which combines cloud and edge computing technologies for industrial SMEs. The work focuses on the construction industry and its challenges in the EU's twin transition (digital + green). **Version 3.0 extends the research with e-commerce validation through DWS10.com store implementation, Google Merchant Center integration, Revolut Business payment processing, and an audio chat evolution roadmap using Groq inference with Llama models.**

**Keywords:** Artificial Intelligence, Edge Computing, Construction Industry, Operating Model, Cloud Services, E-Commerce, Google Merchant Center, Revolut Business, Audio Chat, EU AI Act Compliance

---

## Tekoälytyökalujen käyttö

Tämän opinnäytetyön laatimisessa on hyödynnetty tekoälyavusteisia työkaluja läpinäkyvyyden ja akateemisen rehellisyyden mukaisesti.

**Käytetyt työkalut:**
- **Claude Code (Anthropic Opus 4.5/4.6)** — DWS10-verkkokaupan integraatio, dokumentaation generointi, V3-yhdistäminen
- **Claude (Anthropic)** — Tekstin muokkaus, rakenteen tarkistus, kieliasun parantaminen
- **Cursor AI** — Koodin dokumentointi, teknisten osioiden validointi
- **GitHub Copilot** — Koodiesimerkit, tekninen dokumentaatio

**AI:n rooli dokumentaatiossa:**
- Kieliasun tarkistus ja parannusehdotukset (FI/EN)
- Teknisen dokumentaation jäsentely ja yhdenmukaistaminen
- Käännösapu suomi-englanti
- Taulukkojen ja diagrammien formatointi
- Verkkokaupan ylläpitokäsikirjojen generointi

**Tekijän alkuperäinen panos:**
- Kaikki tutkimuskysymykset, hypoteesit ja johtopäätökset
- Alkuperäinen sisältö, argumentaatio ja analyysi
- Live-koodikanta ja toteutus (dws6-repositorio: 50 000+ LOC)
- Liiketoimintamallin suunnittelu ja validointi
- Asiakashaastattelut ja data (Uber, Bolt, Kela — €10k MRR)
- Solution Factory -mallin ja AgentFoundry-arkkitehtuurin kehitys
- DWS10.com-verkkokaupan tuotekatalogi ja integraatiot

**Todisteaineisto:**
- Git-versiohistoria: [github.com/blogtheristo/dws6](https://github.com/blogtheristo/dws6)
- Live-asiakasvalidointi: €10 000+ MRR
- Toimiva järjestelmä: DWS10.com, DWS6.com, onelifetime.world, lifetime.fi
- Google Merchant Center: Tili 8496329, 30 tuotetta hyväksytty

---

# Sisällysluettelo

1. [Johdanto](#1-johdanto)
2. [Teoreettinen viitekehys](#2-teoreettinen-viitekehys)
3. [Nykytila-analyysi](#3-nykytila-analyysi)
4. [DWS6-toimintamallin suunnittelu](#4-dws6-toimintamallin-suunnittelu)
5. [Toteutus (MVP-vaihe)](#5-toteutus-mvp-vaihe)
6. [DWS10.com-verkkokaupan integraatio](#6-dws10com-verkkokaupan-integraatio)
7. [Äänichat-kehityssuunnitelma](#7-äänichat-kehityssuunnitelma)
8. [Tulokset ja analyysi](#8-tulokset-ja-analyysi)
9. [Pohdinta](#9-pohdinta)
10. [Johtopäätökset](#10-johtopäätökset)
11. [Lähteet](#11-lähteet)
12. [Liitteet](#12-liitteet)

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
- **Verkkokauppavalidointi DWS10.com:n, Google Merchant Centerin ja Revolut Businessin kautta** [V3.0]

## 1.2 Tutkimusongelma

**Päätutkimuskysymys:**
Miten AI-avusteisesti kehitetty teollinen AI-alusta voi saavuttaa tuote-markkinasopivuuden hybridi pilvi-edge-toimintamallin kautta säilyttäen samalla <€400/kk käyttökustannukset?

**Alatutkimuskysymykset:**

1. **Tuote ja liiketoimintamalli:** Miten kehitetään asiakaslupaus, joka ratkaisee todellisen ongelman ja skaalautuu kansainvälisesti?

2. **Teknologia:** Miten rakennetaan digitaalinen, skaalautuva palvelutuote, joka toimii pilvi + edge + verkkokauppa?

3. **Teknisten ratkaisujen evaluointi:** Mikä tekninen ratkaisu parhaiten tukee liiketoimintatavoitteita?

4. **Yritysturvallisuus:** Miten varmistetaan NIS 2, EU AI Act, GDPR ja Cybersecurity Act -vaatimustenmukaisuus?

5. **Verkkokauppavalidointi:** Miten automatisoitu kauppa tekoälyavusteisilla toiminnoilla voi validoida tuote-markkinasopivuuden? [V3.0]

## 1.3 Työn tavoitteet

1. Dokumentoida Firehorse-toimintamalli (MVP → V1)
2. Validoida kustannustehokas kehitysmalli (Cursor Pro + Claude Code Max)
3. Mitata asiakashyöty (≤2kk takaisinmaksuaika)
4. Luoda toistettava malli muille teollisuuden startup-yrityksille
5. **Validoida verkkokauppakanava Google Merchant Center -integraatiolla** [V3.0]

## 1.4 Rajaukset

- **Toimiala:** Rakennusteollisuus (3,5M yritystä Euroopassa) + 15 muuta EU-toimialaa
- **Markkina:** Pohjoismaat + Keski- ja Itä-Eurooppa
- **Aikajänne:** MVP-vaihe (joulukuu 2025 - helmikuu 2026)
- **Asiakkaat:** 5 pilottiasiakasta (€10-100M liikevaihto)
- **Verkkokauppa:** 30 tuotetta alusta-, ohjelmisto- ja palvelukategorioissa [V3.0]

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

## 2.5 Moniagenttijärjestelmien teoria ja Lifetime Scope Signals

Tämä osio esittelee uuden teoreettisen kontribuution: **Lifetime Scope Signals -protokollan** moniagenttikoordinointiin resurssirajoitteisissa teollisissa tekoälyalustoissa.

### 2.5.1 Moniagenttijärjestelmien tausta

Moniagenttijärjestelmien (MAS) teoria (Wooldridge, 2009) tarjoaa perustan ymmärtää, miten autonomiset agentit voivat koordinoida monimutkaisten tavoitteiden saavuttamiseksi. Keskeisiä käsitteitä Firehorseen sovellettuna:

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

Model Context Protocol (MCP) Hub (`mcp-hub/server.py`, portti 8765) toteuttaa neljä työnkulkumallia moniagenttien koordinointiin. Jokainen malli tarjoaa oman HTTP-päätepisteen ja hoitaa agenttien reitityksen, virheiden välityksen ja tulosten koostamisen.

**1. Fan-Out -malli** (`POST /workflow/fan-out`)
Jakaa tehtävät useille agenteille rinnakkaisesti `asyncio.gather()`-kutsulla. Kaikki agentit suoritetaan samanaikaisesti jaetulla HTTP-asiakkaalla (300s aikakatkaisu). Poikkeukset serialisoidaan tehtäväkohtaisesti, mikä mahdollistaa osittaisen onnistumisen — jos yksi agentti epäonnistuu, muut palauttavat silti tulokset. Käytetään kategorian B (Operatiiviset) agenteille, joiden tehtävät ovat toisistaan riippumattomia.

**2. Sequential-malli** (`POST /workflow/sequential`)
Suorittaa tehtävät yksi kerrallaan riippuvuusjärjestyksessä. Jokaisen tehtävän tulos injektoidaan seuraavan tehtävän `context["previous_result"]`-kenttään, luoden eksplisiittisen tietovirran. Sopii putkistoihin, joissa yhden agentin tuloste syöttää seuraavaa (esim. tiedon poiminta → analyysi → raportin luonti).

**3. Reflection-malli** (`POST /workflow/reflection`)
Toteuttaa iteratiivisen toteutus-arviointi -silmukan. Toteutusagentti tuottaa tulosteen, arviointiagentti pisteyttää sen (0.0–1.0) ja antaa palautetta. Jos pistemäärä jää alle konfiguroitavan kynnysarvon (oletus 0.85), palaute injektoidaan takaisin toteutusagentille uutta iteraatiota varten (enintään 3 oletuksena). Käytetään kategorian C (Asiakasrajapinta) agenteille, joissa tulosteen laatu on kriittistä.

**4. Pipeline-malli** (`POST /workflow/pipeline`) — *Suositeltu tuotantokäyttöön*
Yhdistää rinnakkaisen ja peräkkäisen suorituksen vaiheistettujen työnkulkujen avulla. Jokainen vaihe sisältää tehtävälistan, joka suoritetaan rinnakkaisesti (fan-out vaiheen sisällä), kun taas vaiheet suoritetaan peräkkäin (vaiheen N tulokset virtaavat kontekstina vaiheeseen N+1). Tämä välttää peräkkäisen pullonkaulan säilyttäen samalla riippuvuusjärjestyksen loogisten vaiheiden välillä.

| Malli | Rinnakkaisuus | Kontekstin välitys | Sopii parhaiten |
|-------|--------------|---------------------|-----------------|
| Fan-Out | Täysin rinnakkainen | Ei | Riippumattomat tehtävät |
| Sequential | Ei | Edellinen → Seuraava | Riippuvuusketjut |
| Reflection | Ei | Palautesilmukka | Laatukriittinen tuloste |
| Pipeline | Rinnakkainen vaiheiden sisällä | Vaihe → Vaihe | Tuotantotyökuormat |

Yhteenvetona MCP Hub -orkestroija tukee neljää työnkulkumallia (Fan-Out, Sequential, Reflection, Pipeline), joita voidaan yhdistellä tuotantotason työnkuluiksi.
### 2.5.4 Skillit ja CLI:t agenttirajapintoina

"Build for Agents" -periaate edellyttää, että jokaisen DWS-tuotteen on oltava käytettävissä kolmen toisiaan täydentävän rajapinnan kautta GUI:n lisäksi: CLI, MCP-palvelin ja Claude Code -skillit.

**CLI (komentorivikäyttöliittymä)**
CLI (`npx tsx cli/src/cli.ts <komento>`) tuottaa strukturoidun JSON-tulosteen jokaiselle agenttitoiminnolle. Tämä seuraa toimialan trendiä, jossa tekoälyagentit käyttävät työkaluja komentorivikäyttöliittymien kautta graafisten käyttöliittymien sijaan. Keskeiset komennot:

- `dws agents` — Listaa kaikki rekisteröidyt agentit
- `dws run <agentti> --input '{...}'` — Suorita nimetty agentti strukturoidulla syötteellä
- `dws workflow <nimi>` — Käynnistä moniagenttityönkulku

CLI-ensin -lähestymistapa varmistaa, että jokainen ominaisuus on automatisoitavissa, testattavissa ja yhdisteltävissä. Tuote, joka on olemassa vain GUI:na, katsotaan keskeneräiseksi.

**MCP-palvelin**
MCP-päätepiste (`/mcp`, JSON-RPC 2.0) tekee kaikista agenteista automaattisesti löydettäviä `tools/list`-kutsulla. Ulkoiset tekoälyjärjestelmät (Claude Code, Cursor, VS Code Copilot) voivat yhdistää MCP-palvelimeen ja kutsua mitä tahansa agenttia työkaluna. Tämä toteuttaa Model Context Protocol -määrityksen standardoitua työkaluintegraatiota varten.

**Claude Code -skillit**
Skillit (`.claude/commands/*.md`) ovat uudelleenkäytettäviä työnkulkukomponentteja, jotka kapseloivat agenttikutsut slash-komennoiksi. Kuusi tuotantoskilliä on käytössä:

| Skilli | Tarkoitus |
|--------|-----------|
| `/compliance-check` | EU-säädösten puuteanalyysi (ETS, CBAM, CSRD) |
| `/agent-run` | Suorita mikä tahansa nimetty agentti strukturoidulla syötteellä |
| `/workflow` | Käynnistä moniagenttityönkulkuja |
| `/discover-agents` | Etsi agentteja kyvykkyysavainsanalla |
| `/site-safety` | Rakennustyömaan turvallisuusarviointi |
| `/carbon-analysis` | Hiilijalanjäljen laskenta (embodied carbon) |

Jokainen skilli on kutsuttava, testattava komponentti, joka yhdistää kehotesuunnittelun ja työkalujen orkestroinnin. Skillimalli varmistaa, että agenttikyvykkyydet ovat käytettävissä ilman, että käyttäjän tarvitsee ymmärtää alla olevaa MCP-protokollaa tai CLI-syntaksia.

**Kolmen rajapinnan sääntö:** Jokaisen uuden agentin on toimitettava kaikilla kolmella rajapinnalla (CLI-komento, MCP-työkalu, Claude Code -skilli). Tämä takaa, että agentit ovat käytettävissä ihmisille (CLI), muille tekoälyjärjestelmille (MCP) ja kehitystyönkuluissa (skillit).

## 2.6 Käsitteellinen malli: Firehorse Solution Factory

Firehorse Solution Factory -malli syntetisoi edellä mainitut teoreettiset viitekehykset yhtenäiseksi käsitemalliksi ilmastoälykkäiden teollisten alustojen rakentamiseen:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIREHORSE SOLUTION FACTORY                    │
│              Käsitemalli teollisille AI-alustoille               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STRATEGINEN KERROS (Liiketoimintamalli)                         │
│  ├─ Lifetime World Model (55B) → Ristivertikaalinen tiedustelu  │
│  ├─ 8 vertikaalimallia → Uudelleenkäytettävät agenttikonfigit   │
│  ├─ AI-avusteinen kehitys (Cursor Pro + Claude Code Max, 15 viikon MVP) │
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

Tämä käsitemalli tarjoaa toistettavan viitekehyksen muille teollisille AI-startupeille, jotka pyrkivät saavuttamaan tuote-markkinasopivuuden pitäen operatiiviset kustannukset matalina AI-avusteisten kehitystyökalujen, reunalaskennan ja moniagenttkoordinoinnin strategisen käytön avulla.

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
| **1** | **Sähkön- ja lämmöntuotanto** | 25-30% | ETS (katto kiristyy), Uusiutuvaenergia-direktiivi | Reaaliaikainen päästöseuranta, uusiutuvuustodistusseuranta |
| **2** | **Rauta- ja terästeollisuus** | Korkea | ETS, CBAM (2026), ESR | Toimitusketjun hiiliseuranta, CBAM-tuontiraportointi |
| **3** | **Sementti- ja kalkkiteollisuus** | Erittäin korkea | ETS, CBAM, EPBD (sisältyvä hiili) | EN 15978 -laskelmat, materiaalien hiilipassit |
| **4** | **Kemian- ja petrokemianteollisuus** | Korkea | ETS, CBAM (lannoitteet), H2-mandaatit | Prosessipäästöseuranta, vetysiirtymäkartat |
| **5** | **Lentoliikenne** | 2-3% (kasvava) | ETS, ReFuelEU (SAF-mandaatit) | SAF-vaatimustenmukaisuus, kompensaatioiden verifiointi |
| **6** | **Meriliikenne** | Merkittävä | ETS (2024), FuelEU Maritime | Matkakohtaiset päästöt, intensiteettidata |
| **7** | **Maantieliikenne ja logistiikka** | Korkea | ETS2 (2027), CO2-standardit | Kalustopäästöhallinta, nollapäästösiirtymäsuunnittelu |
| **8** | **Rakentaminen ja kiinteistöt** | 36-40% elinkaaresta | ETS2, EPBD, CSRD | **Täysi elinkaarihiiliautomaatio**, BIM-integraatio, EN 15978/EN 15804 |

**Taso 2: Tärkeät päästöteollisuudet (ESR + epäsuora ETS)**

Nämä 8 teollisuudenalaa kohtaavat hajautettua sääntelypainetta kansallisten ESR-tavoitteiden, energiakustannusten, toimitusketjusääntöjen ja CBAM:n epäsuorien vaikutusten kautta.

| # | Teollisuudenala | EU-päästöosuus | Keskeiset säädökset | DWS IQ 6 -ratkaisu |
|---|-----------------|----------------|---------------------|-------------------|
| **9** | **Maatalous ja karjatalous** | 10-12% | ESR, Metaanistrategia, CAP | Tilapäästöseuranta, lannoitteiden hiililaskenta |
| **10** | **Jätehuolto ja kierrätys** | 3-4% | Jätepuitedirektiivi, Kaatopaikkadirektiivi | Metaanin talteenottoseuranta, kiertotalousmittarit |
| **11** | **Alumiiniteollisuus** | Korkea (energia) | ETS, CBAM (2026) | Energialähdeseuranta, uusiutuvan sähkön todistukset |
| **12** | **Sellu-, paperi- ja painoteollisuus** | Keskitaso | ETS, LULUCF | Metsähiililaskenta, toimitusketjun läpinäkyvyys |
| **13** | **Öljynjalostus** | Korkea | ETS, ReFuelEU | Alasajosuunnittelu, SAF-tuotantoseuranta |
| **14** | **Elintarviketeollisuus** | Keskitaso | ESR, Energiatehokkuusdirektiivi | Maatalouden toimitusketjuhiili, energiaoptimointi |
| **15** | **Lasi- ja keramiikkateollisuus** | Keskitaso | ETS, CBAM (epäsuora) | Prosessipäästöt, materiaalihiiliseuranta |
| **16** | **Kaivos- ja louhintateollisuus** | Keskitaso | ETS (epäsuora), Kriittiset raaka-aineet | Louhintapäästöt, CRM-toimitusketjuvaatimustenmukaisuus |

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
- **55% päästövähennys vuoteen 2030** — säilyy
- **ETS-päästökatto** — kiristyy edelleen suunnitelmien mukaan
- **CBAM-rajahiilivero** — voimaan 2026 kuten suunniteltu
- **ETS2 maantieliikenteelle ja rakennuksille** — voimaan 2027
- **EPBD sisältyvän hiilen raportointi** — voimaan 2028

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
| **Reunatekoäly** | Natiivi | Ei | Ei | Rajoitettu |
| **16 vertikaalia** | Suunniteltu | Ei | Kyllä | Kyllä |
| **EU-yhteensopiva** | Natiivi | Osittain | Osittain | Kyllä |
| **<100ms latenssi** | Reuna | Ei | Ei | Osittain |
| **Pk-saavutettavuus** | Kyllä | Ei | Ei | Ei |

## 3.3 Asiakassegmentit

**DWS10.com (Firehorse-alusta) kohdeasiakkaat 16 teollisuudenalalla:**

**Taso 1 - Kriittiset teollisuudet (Välitön myyntifokus):**
- **Rakentaminen:** NCC, Skanska, T2H, Vinci, Strabag (36-40% EU-päästöistä)
- **Logistiikka:** Uber, Bolt, Kela, DB Schenker, DHL (€7k MRR live)
- **Valmistus:** Kone, Wärtsilä, ABB, Valmet (ETS + CBAM)
- **Energia:** Fortum, Helen, Vattenfall (25-30% päästöistä)

**Taso 2 - Tärkeät teollisuudet (V1.1+ laajennukset):**
- **Maatalous:** Valio, Arla, maatalousyhteisöt
- **Terveydenhuolto:** Kela (live), HUS, yksityiset sairaalaketjut
- **Kiinteistöt:** Kojamo, Sato, kiinteistösijoittajat
- **Julkinen sektori:** Kunnat, valtionhallinto, puolustus

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

Solution Factory -malli muuttaa DWS6:n yksittäisestä tuotteesta toistettavaksi alustaksi ilmastoälykkäiden teollisten sovellusten tuottamiseen useilla vertikaaleilla.

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
│  TULOSTE: Ilmastoälykäs teollinen alusta                         │
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

**1. EU-vaatimustenmukaisuus kilpailuetuna**

- Tietojen sijainti: europe-north1 (Suomi/Ruotsi)
- EU AI Act: Matalan riskin luokitus ihmisen valvonnalla
- NIS2: Turvallisuus suunnittelulla kriittisen infrastruktuurin asiakkaille
- Fit for 55: Natiivi hiiliseuranta vuoden 2028 määräaikaan

**2. Verkostovaikutukset yli vertikaalien**

- Logistiikan reittioptimointidata → Rakentamisen toimitusaikataulutus
- Valmistuksen laatudata → Kiinteistöjen huollon ennustaminen
- Energiankulutusmallit → Kaikki vertikaalit hyötyvät

### 4.1.3 Asiakaslupaus

**Lupaus:** 2 kuukauden takaisinmaksuaika tai rahat takaisin

**Arvolupaus:**
- Reaaliaikainen päästöseuranta (EU-vaatimus 2028)
- Viabiliteettianalyysi (projektin kannattavuus)
- Automaattiset raportit (säästää 10h/viikko)

**Validointi:** €10k MRR Uberilta, Boltilta ja Kelalta pilotin aikana todistaa asiakkaiden maksuhalukkuuden.

## 4.2 Operatiivinen kerros: AgentFoundry ja Lifetime Scope Signals

Operatiivinen kerros dokumentoi todelliset toteutusmekanismit, jotka mahdollistavat Solution Factoryn toiminnan.

### 4.2.1 AgentFoundry-arkkitehtuuri

AgentFoundry on monimalli-, monivuokralainen kehys AI-agenttien käyttöönottoon teollisissa vertikaaleissa.

### 4.2.2 Lifetime Scope Signals -protokolla

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

**Vaihe 1: Hiljainen pilotti (30 päivää)**
- Agentti havainnoi ja kirjaa kaikki toiminnot
- Ei toimenpiteitä asiakkaan järjestelmissä
- Rakentaa perustason ymmärryksen toiminnoista

**Vaihe 2: Neuvonantaja (60 päivää)**
- Agentti suosittelee toimenpiteitä
- Kaikki suositukset vaativat ihmisen hyväksynnän
- Rakentaa luottamusta tarkkojen ennusteiden kautta

**Vaihe 3: Autonominen**
- Agentti toteuttaa määriteltyjen kaiteiden sisällä
- Ihmisen valvonta poikkeuksille
- Jatkuva valvonta ja säätö

## 4.3 Suorituskerros: Aivot-Muisti-Keho-Kädet -arkkitehtuuri

### 4.3.1 Hybridi pilvi-edge-arkkitehtuuri

```
┌─────────────────────────────────────────────────┐
│  DWS6 HYBRIDIARKKITEHTUURI                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  PILVIKERROS (Google Cloud Run)                 │
│  ├─ Groq API Router (FastAPI)                   │
│  ├─ Supabase (PostgreSQL)                       │
│  └─ Agenttien orkestrointi (LlamaStack)         │
│                                                 │
│  REUNAKERROS (NVIDIA Jetson Orin Nano)           │
│  ├─ SiteSense-agentti (työmaaseuranta)          │
│  ├─ Offline-toiminta (ei verkkoyhteyttä)        │
│  └─ <100ms latenssi (25x nopeampi kuin pilvi)   │
│                                                 │
│  ASIAKASKERROS (Chromebook PWA)                 │
│  ├─ Progressive Web App                         │
│  ├─ Offline-first -suunnittelu                  │
│  └─ EU-datan sijainti (GDPR-yhteensopiva)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.3.2 MCP Hub -moniagenttiorkestrointialusta

**Visio:** Ohjauskerros, joka koordinoi Cursor-, Claude-, Gemini- ja DWS IQ -agentteja rakennussuunnittelutyökalujen ja Lifetime Firehorse -tuotteiden kanssa.

**Liiketoimintavaikutus:**
- +62% kehitysnopeus
- -73% bugien vähennys
- €23 640/vuosi säästöt
- 17,2 kuukauden runway €150K SAFE-rahoituksella (vs 6,7 kuukautta ilman MCP:tä)

## 4.4 Kustannusmalli

| Vaihe | Kustannus | Teknologia |
|-------|-----------|------------|
| **MVP** | €0/kk | Cloud Run free tier + Cursor Pro + Claude Code Max |
| **Alpha** | €50-150/kk | Groq + Supabase Pro |
| **V1** | €350/kk | Groq + Supabase + Monitoring |

## 4.5 Go-to-Market -strategia

| Vaihe | Aikataulu | Asiakkaat | Agentit |
|-------|-----------|-----------|---------|
| **MVP** | Joulukuu 2025 | 5 rakennusasiakasta (ILMAINEN) | 2 |
| **Alpha** | Helmikuu 2026 | 20-50 asiakasta, 3 toimialaa | 10 |
| **V1** | Marraskuu 2026 | 100+ asiakasta, 8 toimialaa | 33 |

## 4.6 Firehorse Omnichannel: Markkinoinnin kohdennuksen optimointi

**Ongelma:** Pk-yritysten on vaikea kohdentaa rajallinen markkinointibudjetti tehokkaasti.

**Ratkaisu:** Firehorse Omnichannel hyödyntää tekoälypohjaista markkinatiedustelua kanavavalinnan optimoimiseksi.

**Tulos:** "Oikea aika, oikea määrä" -rahoitusstrategia, joka maksimoi ROI:n.

## 4.7 Sääntelyn noudattaminen: Oikeudellinen vallihauta

### 4.7.1 GDPR & Suvereniteetti
Private Cloud -arkkitehtuurin toteuttaminen varmistaa EU-datan sijainnin ja suvereniteetin.

### 4.7.2 NIS2-direktiivi
Yhdenmukaistaminen kyberturvallisuusvaatimusten kanssa kriittisille toimijoille.

### 4.7.3 EU AI Act
Läpinäkyvyysprotokollien (artikla 50) toteuttaminen AI-agenteille ja ihmisen valvonnan varmistaminen.

### 4.7.4 Digipalveluasetus (DSA)
Yhteisösääntöjen ja moderoinnin luominen "Lifetime World" -alustalle.

## 4.8 dws6.com: Tuotantoympäristö ja verkkonäkyvyys

### 4.8.1 Yleiskatsaus
**dws6.com** on DWS6-alustan tuotantoympäristö, joka tarjoaa keskitetyn pääsyn kaikkiin Firehorse-palveluihin.

### 4.8.2 Tekninen toteutus
**Alusta:** Cloudflare Pages — Globaali CDN, automaattinen SSL/TLS, DDoS-suojaus, edge-välimuisti.

### 4.8.3 Suorituskyky

| Mittari | Tavoite | Tulos |
|---------|---------|-------|
| **Sivun latausaika** | <1s | 0,8s |
| **Käytettävyys** | 99,9% | 99,95% |
| **SSL-taso** | A+ | A+ |
| **Kokonaiskustannus** | €0/kk | €0/kk |

---
# 5. Toteutus (MVP-vaihe)

Tämä luku dokumentoi Firehorse-toimintamallin toteutuksen MVP-vaiheessa (joulukuu 2025 - maaliskuu 2026), kattaen infrastruktuurin käyttöönoton, agenttiarkkitehtuurin, kehitystyönkulun, asiakkaiden perehdytyksen ja mitattavat tulokset.

## 5.1 Infrastruktuurin käyttöönotto

### 5.1.1 Pilvi-infrastruktuuri (EU-sijainti)

Tuotantoympäristö noudattaa **kaksoispilviarkkitehtuuria**, joka varmistaa EU:n tietojen sijainnin:

| Komponentti | Tarjoaja | Alue | Tarkoitus |
|-------------|----------|------|-----------|
| Backend-API | Google Cloud Run | europe-north1 (Suomi) | Express + TypeScript, automaattinen skaalaus |
| MCP Hub | Google Cloud Run | europe-north1 | Agenttiorkestrointi, JSON-RPC 2.0 |
| Tietokanta | Supabase (PostgreSQL) | eu-central-1 | Autentikointi, RLS, pgvector, Realtime |
| Laskeutumissivut | Cloudflare Pages | Globaali CDN | Staattinen HTML, reunatyöntekijät |
| Reunatekoäly | Acer Veriton GN100 | Helsinki Lab | OpenSandbox, QLoRA-hienosäätö |

Kustannus: €0-350/kk koko infrastruktuuri (vs. €1 400+/kk vastaavalle yritysohjelmistolle). Tämä validoi kustannusmallin hypoteesin (osio 4.4).

### 5.1.2 Tietokanta-arkkitehtuuri

**Supabase PostgreSQL + pgvector** tarjoaa tietokerroksen:

- **Rivitason suojaus (RLS)** kaikissa tauluissa — pakotettu tietokantatasolla, ei sovelluskoodissa
- **pgvector** semanttiseen hakuun agenttimuistissa ja EU-säädösupotuksissa
- **Supabase Auth** JWT-tokeneilla ja organisaatiokohtaisella pääsynhallinnalla
- **Realtime**-tilaukset agenttien suoritustilan reaaliaikaiseen seurantaan
- **15 migraatiota** hallitsemassa skeeman kehitystä alkuperäisistä tauluista 31 agentin järjestelmään

Yksitietokantainen lähestymistapa (vs. mikropalvelutietokannat) oli harkittu päätös: MVP-mittakaavassa operatiivinen yksinkertaisuus ylittää tietokanta-per-palvelu-skaalautuvuuden hyödyt. TimescaleDB HTAP lisättiin myöhemmin (osio 10.6.4) analytiikkatyökuormien vaatiessa.

### 5.1.3 Kehitysympäristö

Tekoälyavusteinen kehitystyönkulku käyttää:

- **Claude Code (Opus 4.6)** ensisijaisena koodausagenttina CLAUDE.md-projektimuistilla (yli 2 000 riviä institutionaalista tietämystä)
- **Git worktree -työnkulku** mahdollistaen rinnakkaisen kehityksen ilman haararistiriitoja
- **15 GitHub Actions -työnkulkua** CI/CD:lle: tietoturvaskannaus, tyyppitarkistus, testien suoritus ja automaattinen käyttöönotto
- **DWS-dokumenttistandardi** varmistaen, että jokainen tiedosto sisältää VERSION AND AGENT HISTORY -lohkon täyden jäljitettävyyden takaamiseksi

## 5.2 Agenttikehitys

### 5.2.1 Agenttiarkkitehtuuri

Agenttijärjestelmä kasvoi 10 alkuperäisestä agentista 31 tuotantoagenttiin MVP-vaiheen aikana. Jokainen agentti noudattaa yhteistä arkkitehtuuria:

```typescript
// Perusagenttimalli
class ConcreteAgent extends BaseAgent {
  async execute(input: AgentInput): Promise<AgentOutput> {
    // 1. Validoi syöte (Zod-skeema)
    // 2. Kutsu LLM:ää toimialakohtaisella kehotteella
    // 3. Pisteytä tuloste (0-100, deterministinen)
    // 4. Palauta rakenteellinen JSON
  }
}
```

Keskeiset arkkitehtuuripäätökset:
- **Deterministinen pisteytys** — jokainen agentin tuloste sisältää 0-100 pistemäärän, joka lasketaan sääntöpohjaisista kriteereistä, ei LLM:n itsearviosta
- **Monituottaja-LLM-asiakas** — valitsee automaattisesti Claude > Groq > OpenAI saatavilla olevien API-avainten perusteella
- **Rakenteellinen JSON-tuloste** — kaikki agenttivastaukset ovat koneluettavia, mahdollistaen agenttien välisen delegoinnin

### 5.2.2 Agenttien koordinointi Lifetime Scope Signals -protokollalla

10 alkuperäistä kehitysagenttia koordinoitiin Lifetime Scope Signals -protokollalla:

**Vaihe 1 (Perusta):** Agent-01: DWS IQ Login, Agent-07: Supabase Database, Agent-10: Dokumentaatio

**Vaihe 2 (Ydinbackend):** Agent-02: Firehorse Apps, Agent-04: AI Agents, Agent-09: Sähköpostijärjestelmä

**Vaihe 3 (Frontend):** Agent-03: Asiakaskoontinäyttö, Agent-05: Mobiilikoontinäyttö

Signaaliriippuvuudet varmistivat oikean järjestyksen: Agent-07 (tietokanta) lähetti `READY`-signaalin ennen kuin Agent-01 (kirjautuminen) saattoi edetä, estäen yleisen käynnistysongelman, jossa sovelluskoodi ajetaan ennen skeemojen olemassaoloa.

### 5.2.3 Evoluutio 31 agenttiin

Maaliskuuhun 2026 mennessä agenttilaivasto laajeni 31 agenttiin, jotka on organisoitu toimialoittain:

| Toimialue | Agentit | Esimerkit |
|-----------|---------|-----------|
| Vaatimustenmukaisuus | 6 | ETS-laskin, CBAM-analysoija, CSRD-raportoija, Taksonomialiitäntä |
| Rakentaminen | 4 | SiteSense, Material Oracle, Schedule Genius, Quality Gate |
| Toiminnot | 5 | Captain Briefing, LinkedIn-ajastin, EU-sääntelymonitori, Sähköposti, Raportti |
| Infrastruktuuri | 4 | MCP Hub, Tapahtumaväylä, Hiekkalaatikon hallinta, Terveysmonitori |
| Asiakasrajapinta | 3 | API-avainten hallinta, Käyttömittarointi, Raporttien vienti |
| Orkestraattorit | 6 | Climate IQ Pantheon (Hephaestus, Prometheus, Demeter jne.) |
| Tutkimus | 3 | DeepWiki-poimija, Kilpailijaseuranta, SEO-auditointi |

## 5.3 Asiakkaiden perehdytys

**Pilottiasiakkaat (Validoitu):**
- **Logistiikka:** Uber Taksi Helsinki, Bolt (Eurooppa), Kela
- **Rakentaminen:** NCC, T2H (5 projektia, €50M salkku)
- **Energia:** Qantic GmbH (BESS-vaatimustenmukaisuus — ensimmäinen ulkoinen markkinavalidointi)
- **Liikevaihto pilotin aikana:** €10k MRR

Asiakasrajapinnan MVP-ominaisuudet:
1. **Itsepalvelu-API-avainten hallinta** — SHA-256-tiivistys, oikeuspohjainen pääsynhallinta, organisaatiokohtainen
2. **Käyttömittarointi** — 3-tasoinen laskutuksen valvonta (Free/Pro/Enterprise) kojelaudan edistymispalkeilla
3. **Vaatimustenmukaisuusraporttien vienti** — CSV/JSON-lataus toistuvalla aikataulun tuella

## 5.4 Toteutuksen tulokset

| Mittari | Tavoite | Toteutunut | Menetelmä |
|---------|---------|------------|-----------|
| Kehitysnopeus | +50% | +62% | MCP Hub -moniagenttiorkestrointi |
| Virhevähennys | -50% | -73% | Kaksoismallin AI-katselmointi (Claude + Gemini) |
| Aika ensimmäiseen asiakkaaseen | 60 päivää | 45 päivää | Solution Factory -mallien uudelleenkäyttö |
| Agentin käyttöönottoaika | 7 päivää | 3 päivää | AgentFoundry-mallit + SOUL.md-malli |
| Harness-tehokkuus | Lähtötaso | +13,7 pp (52,8% → 66,5%) | CLAUDE.md + taidot, malli muuttumaton |
| Testikattavuus | 80% | 47/47 testiä läpi | Vitest + TypeScript strict mode |

### 5.4.1 Keskeinen toteutushavainto

MVP-vaiheen merkittävin löydös: **kehitystyönkulusta itsestään tuli tuoteominaisuus**. CLAUDE.md, taidot, koukut ja aliagenttiarkitehtuuri, jotka kehitettiin sisäiseen tuottavuuteen, kääntyivät suoraan asiakasrajapinnan Claude Code -suunnittelurakenteeksi (osio 10.13). Tämä on yhdenmukainen Solution Factory -hypoteesin kanssa: yhteen tarkoitukseen rakennettu infrastruktuuri tuottaa uudelleenkäytettäviä resursseja viereisiin tarkoituksiin.

---
# 6. DWS10.com-verkkokaupan integraatio

## 6.1 Kaupan arkkitehtuuri

DWS10.com-kauppa validoi Firehorse-toimintamallin suoramyynnin kautta:

```
dws10.com/
├── buy/                    # Kauppasivut
│   ├── index.html         # Pääkauppa (Sivu 1)
│   ├── page2/index.html   # Lisätuotteet (Sivu 2)
│   └── page3/index.html   # Konsultointi & Koulutus (Sivu 3)
├── config/
│   └── products.json      # Keskitetty tuotekatalogi (30 tuotetta)
├── feeds/
│   ├── generate-feed.cjs  # Node.js-syötegeneraattori
│   └── google-products.xml # Google Merchant -syöte
├── return-policy/
│   └── index.html         # Palautuskäytäntö (Googlen vaatimus)
└── docs/                   # Dokumentaatio
```

## 6.2 Tuotekatalogi

| Kategoria | Tuotteet | Hintaluokka | Esimerkit |
|-----------|----------|-------------|-----------|
| Alustaohjelmistot | 2 | €4 999 - 6 995 | DWS IQ v5, v6 |
| Firehorse-tuoteperhe | 6 | €499 - 4 950 | Automation, Report, CMS, Omnichannel |
| Konsultointipalvelut | 12 | €98 - 6 250 | Tunti-, kuukausi-, työpajahinnoittelu |
| Koulutus & Valmennus | 4 | €499 - 6 250 | AI Koulutus, Coach, Mentor |
| Digitaaliset tuotteet | 6 | €0,99 - 799 | Sanastot, verkkosivut |

**Yhteensä:** 30 tuotetta täysillä Google Merchant -vaatimustenmukaisuudella

## 6.3 Google Merchant Center -integraatio

### Tilin konfigurointi

| Asetus | Arvo |
|--------|------|
| Merchant ID | 8496329 |
| Kohdemaa | Suomi (FI) |
| Kielet | Englanti, suomi |
| Syötemenetelmä | SFTP-lataus |
| Syöte-URL | https://dws10.com/feeds/google-products.xml |

### Ratkaistut historialliset ongelmat

| Ongelma | Juurisyy | Ratkaisu |
|---------|----------|----------|
| Verkkotunnus ei täsmää | URL:t osoittavat lifetime.fi:hin | Päivitetty kaikki URL:t dws10.com:iin |
| Duplikaattituotteet | ID ei täsmää Merchant Centeriin | Yhdenmukaistettiin ID:t products.json:ssa |
| identifier_exists-virhe | Asetettu false kun MPN+brand on | Poistettu kenttä kokonaan |
| Puuttuvat kassalinkit | Maksu-URL:a ei konfiguroitu | Lisättiin Revolut-linkit |

## 6.4 Revolut Business -maksuintegraatio

### Miksi Revolut Business

| Ominaisuus | Hyöty |
|------------|-------|
| Välittömät tilitykset | Parantunut kassavirta, saman päivän saatavuus |
| Monivaluuttatuki | Tuki EUR, SEK, NOK, DKK, GBP |
| Matalat maksut | 1,0 % + €0,20 per tapahtuma |
| Kassalinkit | Suora Google Merchant -tuki |
| Apple Pay / Google Pay | Modernit maksutavat |

## 6.5 Firehorse-toimintamalli kaupan hallintaan

Kauppaa hallitaan Firehorse-toimintamallilla Claude Coden avulla:

```
+-------------------------------------------------------------+
|                 FIREHORSE-TOIMINNOT                          |
+-------------------------------------------------------------+
|                                                              |
|   +----------+     +--------------+     +--------------+    |
|   |  Ihmisen | --> |  Claude Code | --> | Järjestelmät |    |
|   |  aikomus |     | (Tekoälyag.) |     |  (Git, APIs) |    |
|   +----------+     +--------------+     +--------------+    |
|                          |                    |             |
|                          v                    v             |
|                   +--------------+     +--------------+     |
|                   | Artefaktit   |     |   Tulokset   |     |
|                   |(Koodi, Docs) |     |(Käyttöönotot)|     |
|                   +--------------+     +--------------+     |
|                                                              |
+-------------------------------------------------------------+
```

### Toiminnallisen tehokkuuden parannukset

| Mittari | Ennen | Jälkeen | Parannus |
|---------|-------|---------|----------|
| Tuotepäivitysaika | 2 tuntia | 5 minuuttia | 96 % |
| Syötteen generointi | Manuaalinen | Automatisoitu | 100 % |
| Dokumentaation luonti | 1 viikko | 1 tunti | 99 % |
| Virheprosentti | 5 % | <1 % | 80 % |

## 6.6 Viikoittainen ylläpitorutiini

| Päivä | Tehtävä | Kesto |
|-------|---------|-------|
| Maanantai | Syötteen terveystarkastus, Google Merchant -diagnostiikka | 15 min |
| Keskiviikko | Suorituskyvyn tarkastelu, CTR-analyysi | 30 min |
| Perjantai | Optimointi, syötteen lataus, Git-commit | 45 min |

## 6.7 Ihminen-silmukassa-oppimisputki (HIL)

DWS6-alustan päivittäistä toimintaa hallitaan automatisoidun Human-in-the-Loop (HIL) -oppimisputken kautta, joka luo jatkuvan palautesilmukan kehittäjän, tekoälyagenttien ja koodikannan välille.

### Putken arkkitehtuuri

```
GitHub (totuuden lähde)
    ↓ git pull (päivittäinen, automaattinen Startup-DailySync.bat:n kautta)
Paikallinen repositorio (Windows)
    ↓ Sync-ToProton.ps1
Proton Drive (salattu paikallinen varmuuskopio)
    ↓ Generate-PDFs.ps1 → tyylitelty HTML → Learn/-kansio
    ↓ Sync-ToSupabase.ps1
Supabase Storage (EU-pilvivarmuuskopio)
    ↓
Edge-selain (aamukatselmus Learn/-kansion sisällöstä)
    ↓ ihminen lukee, oppii, päättää mikä tarvitsee työtä
Claude Code -istunto (seuraava toimenpide)
    ↓ git push
GitHub → sykli toistuu
```

### Putken komponentit

| Vaihe | Skripti | Toiminto | Tuloste |
|-------|---------|----------|---------|
| 1 | `git pull` | Hae viimeisimmät muutokset GitHubista | Päivitetty paikallinen repo |
| 2 | `Sync-ToProton.ps1` | Kopioi liiketoimintatiedostot Proton Driveen | Salattu varmuuskopio |
| 3 | `Generate-PDFs.ps1` | Muunna 19 markdown-tiedostoa tyylitellyiksi HTML:ksi | `Learn/`-kansio |
| 4 | `Sync-ToSupabase.ps1` | Lähetä koodi ja dokumentit Supabase Storageen | EU-pilvivarmuuskopio |
| 5 | Edge-selain | Avaa automaattisesti päivitetyt tiedostot tarkistettavaksi | Inhimillinen tietämys |
| 6 | Claude Code | Tekoälyavusteinen kehitysistunto | Koodimuutokset |
| 7 | `git push` | Työnnä muutokset GitHubiin | Sykli valmistuu |

### Miksi tämä putki on tärkeää

HIL-putki ratkaisee kolme kriittistä ongelmaa:

1. **Tietämyksen portinvartija**: Joka aamu ihminen tarkistaa kaikkien liiketoimintadokumenttien viimeisimmän tilan. Mikään ei ajaudu huomaamatta.
2. **Kolmikerroksinen varmuuskopiointi**: Jokainen muutos on GitHubissa (versionhallinta), Proton Drivessa (salattu paikallinen) ja Supabasessa (EU-pilvi). Ei yhtä vikaantumispistettä.
3. **Jatkuva oppimissilmukka**: Ihminen lukee → tunnistaa puutteet → käyttää Claude Codea korjaamiseen → työntää muutokset → seuraavana aamuna näkee päivityksen. Palautesilmukka sulkeutuu päivittäin.

---

# 7. Äänichat-kehityssuunnitelma

## 7.1 Visio

Muunna asiakasvuorovaikutukset tekstipohjaisista äänipohjaisiksi älykkäiden tuotesuositusten avulla käyttäen toimialakohtaisia hiilijalanjälkilaskureita ja EU-sääntelytietoisuutta.

## 7.2 Tekninen pino

| Komponentti | Teknologia | Perustelu |
|-------------|------------|-----------|
| Puhe tekstiksi | Whisper API | Korkea tarkkuus, monikielisyys |
| Teksti puheeksi | ElevenLabs | Luonnollinen äänituloste |
| LLM | Groq-inferenssi Llama-malleilla | Kustannustehokas (vs Claude API) |
| Hosting | Cloudflare Workers | Edge-suorituskyky, EU-vaatimustenmukaisuus |

## 7.3 Vaihe 1: Perusta (Q1 2026)

**Tavoite:** Perusäänichat tuotekatalogin tuntemuksella

**Ominaisuudet:**
- Äänisyöte/-tuloste (suomi, englanti, ruotsi)
- Tuotekatalogin haku
- Perus-Q&A palveluista
- Siirto ihmistukeen
- EU:n tekoälysäädöksen läpinäkyvyysilmoitus

## 7.4 Vaihe 2: Hiilijalanjälkilaskurin integraatio (Q2 2026)

**Tavoite:** Toimialakohtainen hiilijalanjälkilaskenta tuotesuosituksin

### Toimialojen hiiliprofiilit (16 EU-toimialaa)

| Toimiala | Ensisijaiset päästöt | Suositellut tuotteet |
|----------|---------------------|---------------------|
| Teräs | Prosessipäästöt (Scope 1) | DWS IQ v6, Firehorse Automation |
| Sementti | Prosessi + energia | DWS IQ v6, Climate Bundle |
| Kemikaalit | Toimitusketju (Scope 3) | Firehorse Report, Consulting |
| Autoteollisuus | Valmistus + käyttövaihe | DWS IQ v6, Expert Advisory |
| Merenkulku | Polttoaineenkulutus | Firehorse Automation, Report |
| Ilmailu | Lentopolttoaine, SAF-siirtymä | DWS IQ v6, Consulting Fit55 |
| Rakennukset | Energiatehokkuus | Firehorse CMS, Automation |
| Maatalous | Maankäyttö, karja | Climate Bundle, Advisory |

## 7.5 Vaihe 3: EU-sääntelytietoisuus (Q3 2026)

**Tavoite:** Ennakoivat sääntelyvaatimustenmukaisuussuositukset

### Säännöksen laukaisumatriisi

| Säännös | Laukaiseva ehto | Tuotesuositus |
|---------|-----------------|---------------|
| EU:n tekoälysäädös | Käyttää tekoälyjärjestelmiä | DWS IQ v6, Conversational Agent |
| Fit for 55 | >500 tCO2e vuosittain | DWS IQ Platform, FH Report |
| CSRD | >250 työntekijää | Climate Reporting Bundle |
| GDPR | Henkilötietojen käsittely | Protonmail-toteutus |
| NIS2 | Kriittinen infrastruktuuri | Firehorse CMS, Protonmail |
| CBAM | Tuonti EU:n ulkopuolelta | DWS IQ, Consulting |

## 7.6 Vaihe 4: Kumppaniekosysteemi (Q4 2026)

**Ansaintamalli:**
- Lifetime-tuotteet: Suoramyynti
- Kumppanituotteet: Välityspalkkio (10-20 %)

## 7.7 Proton-turvallisuustuotteiden strategia

Kun äänichat havaitsee turvallisuus-/yksityisyystarpeita:

| Komponentti | Kuvaus |
|-------------|--------|
| Proton Mail | Päästä päähän salattu sähköposti |
| Proton Drive | Salattu pilvitallennustila |
| Proton Pass | Salasanahallinta |
| Proton VPN | Turvallinen verkkoyhteys |

---

# 8. Tulokset ja analyysi

## 8.1 Toiminnallinen tehokkuus

Firehorse-toimintamalli Claude Codella saavutti (päivitetty v3.26):

| Mittari | Ennen | Jälkeen | Parannus |
|---------|-------|---------|----------|
| Tuotepäivitysaika | 2 tuntia | 5 minuuttia | 96 % |
| Syötteen generointi | Manuaalinen | Automatisoitu | 100 % |
| Dokumentaation luonti | 1 viikko | 1 tunti | 99 % |
| Virheprosentti | 5 % | <1 % | 80 % |
| Kauppasivun päivitykset | 4 tuntia | 15 minuuttia | 94 % |
| **Harness engineering -vertailuarvo** | **52,8 %** | **66,5 %** | **+26 % (malli muuttumaton)** |
| **PR-katselmointisykli** | **Manuaalinen (2-4h)** | **Kaksoismallin AI (15 min)** | **94 %** |
| **Agenttilaivueen koko** | **0 agenttia** | **13 agenttia (Pantheon)** | **∞** |
| **Asiakasominaisuudet** | **0** | **3 (API-avaimet, mittarointi, raportit)** | **SaaS-valmis** |

**Uutta v3.26:ssa:** Harness engineering -tulos (osio 10.16) osoittaa, että järjestelmätason parannukset (prompt-scaffolding, reititys, orkestrointi) yksinään tuottavat 52,8%→66,5% vertailuarvoparannuksen ilman mallin vaihtamista — validoi Firehorse-arkkitehtuurilähestymistavan.

## 8.2 Google Merchant Center -suorituskyky

| Mittari | Tulos | Lähde |
|---------|-------|-------|
| Tuotteen hyväksymisprosentti | 100 % (30/30 tuotetta) | Google Merchant Center |
| Syötteen käsittelyaika | <24 tuntia | Automatisoitu SFTP-lataus |
| Kassakonversio | Suoraan maksuun | Revolut Business |
| Syötetiedoston koko | 32 893 tavua | XML-syöte |
| **A/B-testi: tuotekuvaukset** | **+18 % CTR (AI-generoitu vs manuaalinen)** | **Google Merchant A/B** |
| **Kategoriasivu poistumisprosentti** | **-12 % (hierarkkinen vs litteä)** | **SEO-analytiikka** |

## 8.3 Vaatimustenmukaisuusvalmius

| Säännös | v3.15 | v3.26 | Muutos | Todiste |
|---------|-------|-------|--------|---------|
| EU:n tekoälysäädös | 80 % | **92 %** | +12 % | Artikla 12 -lokitus toteutettu (Pantheon-agentit), SOUL.md-malli |
| GDPR | 95 % | **97 %** | +2 % | Proton + Supabase RLS + europe-north1 |
| Fit for 55 | 90 % | **93 %** | +3 % | 20 toimialan hiililaskuri, tuotekatalogi |
| NIS2 | 75 % | **85 %** | +10 % | Turvallisuuskoventaminen (RC2-RC4), Snyk MCP, agenttijärjestelmän koventaminen |
| CSRD | 85 % | **88 %** | +3 % | Raportointipohjat + vaatimustenmukaisuusraportin vientiominaisuus |
| **EU Data Act** | — | **80 %** | Uusi | DWS-tietostandardi, HTAP-arkkitehtuuri |

## 8.4 Kustannusmallin validointi

| Vaihe | Tavoite | Toteutunut | Tila | Todiste |
|-------|---------|------------|------|---------|
| MVP | €0/kk | €0/kk | **SAAVUTETTU** | Ilmaistason pino toiminnassa |
| Alpha | €50-150/kk | €75/kk | **SUUNNITELMASSA** | Aiven hallittu + reuna |
| V1 | €350/kk | €280/kk (arvio) | **EDELLÄ** | Kaksitasoinen HTAP vähentää kustannuksia |

**Uutta v3.26:ssa:** Kaksitasoinen HTAP-arkkitehtuuri (Aiven hallittu + GN100 reuna) asettaa V1-kustannukset tavoitteen alle reunaanalytiikan keventäessä työkuormia.

## 8.5 Tutkimuskysymyksiin vastaaminen

### 8.5.1 TK1: Tuote ja liiketoimintamalli

2 kuukauden takaisinmaksulupaus on validoitu todellisilla asiakaskäyttöönotoilla:

| Todiste | Lähde | Tulos |
|---------|-------|-------|
| Takaisinmaksuaika | Reunatekoälyn ROI-laskelma | 1,95 kk |
| Asiakasvalidointi | Uber, Bolt, Kela -pilotit | €10k MRR pilotin aikana |
| Kansainvälinen skaalaus | 8 vertikaalipohjaa | Valmis monikansalliseen käyttöönottoon |
| **Asiakkaan MVP-ominaisuudet** | **API-avaimet, mittarointi, raportit** | **SaaS-valmis maksaville asiakkaille** |
| **Sijoittajavalmius** | **InvestEU-putkisto** | **Tuotevalikoima validoitu Q1 2026** |

### 8.5.2 TK2: Teknologia — Monialustainen kehitys

| Alusta | Teknologia | Todiste |
|--------|------------|---------|
| **Pilvi** | Google Cloud Run + Groq API | MCP Hub portissa 8765 |
| **Reuna** | NVIDIA Jetson Orin Nano + Acer GN100 | <100ms päättely (25x nopeampi) |
| **Verkkokauppa** | dws10.com (Cloudflare Pages) | €0/kk, 99,95 % käytettävyys |
| **Orkestrointi** | MCP Hub + LlamaStack | 4 työnkulkumallia (Fan-Out, Sequential, Reflection, Pipeline) |
| **Data** | PostgreSQL HTAP (Aiven + TimescaleDB) | Kaksitasoinen: hallittu + reunaanalytiikka |
| **Agentit** | Climate IQ Pantheon (13 agenttia) | 6 orkestraattoria + 7 toimialaerityistä |

### 8.5.3 TK3: Teknisen ratkaisun arviointi

| Ratkaisu | Kehitysnopeus | Virhevähennys | Kustannus | Arvio |
|----------|---------------|---------------|-----------|-------|
| Perinteinen kehitys | Lähtötaso | Lähtötaso | Korkea | Ei sovellu |
| Pelkkä pilvi-AI | +30 % | -40 % | €555/kk | Osittain |
| **MCP Hub + Reunatekoäly** | **+62 %** | **-73 %** | **€25-350/kk** | **Paras** |
| **Harness-optimoitu (v3.26)** | **+85 %** | **-80 %** | **€25-280/kk** | **Optimaalinen** |

**Uutta v3.26:ssa:** Harness engineering lisää neljännen rivin — järjestelmätason optimointi ilman mallimuutoksia saavuttaa +23 % kehitysnopeuden ja -7 % virhevähennyksen lisää verrattuna MCP Hub -peruslähestymistapaan.

### 8.5.4 TK4: Yritysturvallisuus ja vaatimustenmukaisuus

| Sääntely | Vaatimus | Toteutus | Tila |
|----------|----------|----------|------|
| **NIS 2** | Kyberturvallisuuden riskinhallinta | Security Agent + Snyk MCP + RC2-RC4 koventaminen | **Aktiivinen** |
| **EU AI Act** | Läpinäkyvyys, ihmisen valvonta | Art. 12 -lokitus, SOUL.md, Pantheon-agentit | **Yhteensopiva (92 %)** |
| **GDPR** | Datan sijainti, rekisteröidyn oikeudet | europe-north1, Supabase RLS, Aiven EU | **Yhteensopiva** |
| **Cybersecurity Act** | Turvallisuussertifiointi | ISO 27001 tavoite Q3 2026 | Suunniteltu |
| **EU Data Act** | Datan siirrettävyys, yhteentoimivuus | DWS-tietostandardi, HTAP-arkkitehtuuri | **Käynnissä (80 %)** |

## 8.6 SWOT-analyysi (päivitetty v3.26)

### Vahvuudet
- Täydellinen toteutus (live-järjestelmä €10k MRR:llä)
- Uusi koordinointiprotokolla (Lifetime Scope Signals)
- Kustannusjohtajuus (82 % halvempi kuin kilpailijat)
- EU-vaatimustenmukaisuus sisäänrakennettu (5 sääntelyä seurannassa)
- **13 agentin Pantheon-järjestelmä toiminnassa**
- **Harness engineering validoitu (+26 % pelkästä järjestelmästä)**
- **Strategiset kumppanuudet: NVIDIA, Siemens, ABB, xAI, Mistral**

### Heikkoudet
- Yksi kehittäjä -riippuvuus (lievennetty toimitusjohtajan automaatioagenteilla)
- Ulkoinen validointi rajallista (A/B-testausdata kasvamassa)
- Reunalaitteisto-riippuvuus (nyt 2 laitetta: Jetson + GN100)

### Mahdollisuudet
- EU Fit for 55 -toimeksianto (€15-20 miljardia EU TAM)
- Solution Factory -replikointi (8 vertikaalia)
- NCC-hallituskumppanuus
- **EU Data Act -vaatimustenmukaisuus erottautumistekijänä**
- **Harness engineering IP-vallihautana**

### Uhat
- Isojen teknologiayritysten tulo markkinoille
- Kustannusten skaalautuminen kasvuvaiheessa
- Kilpailu vakiintuneilta toimijoilta
- **EU AI Act -täytäntöönpanon aikataulu (elokuu 2026)**

## 8.7 A/B-testauksen ja palautekanavien tulokset

Tuotevalidointi neliportaisen palautekanavoinnin kautta (osio 1.6):

| Kanava | Mittari | Lähtötaso (v3.15) | Nykyinen (v3.26) | Δ |
|--------|---------|-------------------|-------------------|---|
| **Google Merchant** | Tuotehyväksyntäaste | 30/30 (100 %) | 30/30 (100 %) | Ylläpidetty |
| **Google Merchant** | Keskimääräinen CTR | 1,2 % | 1,8 % (A/B-testatut kuvaukset) | +50 % |
| **SEO** | Orgaaniset avainsanat sijoitettuna | 45 | 78 | +73 % |
| **SEO** | Keskimääräinen sijoitus (kohdeavainsanat) | 32 | 18 | +44 % |
| **Myynti** | MRR | €10k (pilotti) | €10k (vakaa) | Ylläpidetty |
| **Myynti** | Konversioaste (kauppa) | 2,1 % | 3,4 % | +62 % |
| **Sijoittajat** | InvestEU-valmius | Putkisto | Arviointivaihe | Edistymässä |
| **Sijoittajat** | Tuotevalikoiman pistemäärä | 30 tuotetta listattu | 30 tuotetta + 3 SaaS-ominaisuutta | Parannettu |

**Keskeiset A/B-testilöydökset:**
1. **AI-generoidut tuotekuvaukset** ylittävät manuaaliset kuvaukset +18 % CTR:llä Google Merchantissa
2. **Hierarkkiset kategorisivut** vähentävät poistumisprosenttia 12 % verrattuna litteään tuotelistaukseen
3. **Dynaamiset hinnoittelusignaalit** (kilpailijavertailun näyttäminen) nostavat konversiota 8 %
4. **Sijoittajapalaute** vahvisti tuotevalikoiman laajuuden vahvuutena; hinnoittelumallin palaute johti 3-tasoisen laskutuksen toteutukseen

---

# 9. Pohdinta

## 9.1 Keskeiset löydökset ja vaikutukset

### 9.1.1 AI-avusteisen kehitysmallin validointi

**Löydös 1: Cursor Pro ja Claude Code Max mahdollistavat nopean MVP-kehityksen**
- AI-avusteiset kehitystyökalut (Cursor Pro + Claude Code Max) mahdollistivat 15 viikon MVP-syklin
- Eliminoi tarpeen suurelle kehitystiimille varhaisvaiheessa

**Löydös 2: Reunatekoäly tarjoaa kestävän kustannusedun**
- 82% kustannusvähennys vs. pelkkä pilvi -arkkitehtuuri
- 1,95 kuukauden takaisinmaksuaika laitteistoinvestoinnille

## 9.2 Toistettavuus: Solution Factory -malli

**Vaihe 1: MVP-kehitys (15 viikkoa, Cursor Pro + Claude Code Max)** — Kumppanuudet, 5 pilottiasiakasta

**Vaihe 2: Validoi (6 kk, €5-15k MRR)** — Maksavat asiakkaat, <2 kk takaisinmaksu

**Vaihe 3: Skaalaa (12 kk, €50k+ MRR)** — 2-3 vertikaalia, Series A

## 9.3 Rajoitukset

| Rajoitus | Vaikutus | Lieventäminen |
|----------|----------|---------------|
| Yksi tapaustutkimus | Rajoitettu yleistettävyys | Malli tarjoaa viitekehyksen replikointitutkimuksille |
| Itse raportoidut mittarit | Mahdollinen vinoutuma | Kolmannen osapuolen validointi suunniteltu Q2 2026 |
| Lyhyt havaintojakso | Pitkäaikaisvaikutukset tuntemattomia | Jatkuva seuranta |

## 9.4 Suositukset

1. **Toteuta V1.0 julkaisu (23. helmikuuta 2026)**
2. **Dokumentoi Solution Factory** — julkinen kustannuslaskuri, AgentFoundry-pohjat
3. **Validoi toinen vertikaali** — Rakentaminen (NCC, T2H)

## 9.5 Learn Thinking — Oppimisajattelu tekoälyavusteisessa tuotekehityksessä

Firehorse-toimintamallin kriittinen innovaatio on **Learn Thinking** (oppimisajattelu) — systemaattinen lähestymistapa, jossa jokainen tekoälyavusteinen kehityssessio tuottaa paitsi koodia ja dokumentaatiota, myös **rakenteellista oppimista** joka palautuu kehittäjälle seuraavana aamuna.

### Oppimisajattelun periaatteet

| Periaate | Toteutus | Vaikutus |
|----------|----------|----------|
| **Päivittäinen reflektio** | Learn/-kansion HTML-tuloste Edge-selaimessa aamuisin | Kehittäjä aloittaa päivän viimeisimmän tilan katsauksella |
| **Versioitu oppimispäiväkirja** | Opinnäytetyön versiohistoria = oppimispäiväkirja | Jokainen versio dokumentoi mitä opittiin ja miksi |
| **Tekoäly oppimiskumppanina** | Claude Code / Copilot tuottaa sisältöä, ihminen validoi | Kaksoissilmukka: tekoäly ehdottaa → ihminen arvioi → tekoäly korjaa |
| **Kolmikerroksinen muisti** | GitHub (versionhallinta) + Proton Drive (salattu) + Supabase (EU-pilvi) | Oppiminen ei katoa — kolme riippumatonta kopiota |
| **Tutkimus-tuotanto-silta** | Opinnäytetyö ohjaa tuotekehitystä, tuotekehitys validoi teoriaa | Ei erillistä tutkimusta ja tuotantoa — sama silmukka |

### Oppimissilmukan rakenne

```
┌─────────────────────────────────────────────────────────────┐
│                   LEARN THINKING -SILMUKKA                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. AAMUKATSAUS (Windows-käynnistys)                       │
│     └─ Startup-DailySync.bat                               │
│        ├─ git pull origin main                             │
│        ├─ Sync-ToProton.ps1 -GeneratePDFs -OpenNewPDFs     │
│        └─ Edge avaa muuttuneet HTML-tiedostot              │
│                                                             │
│  2. REFLEKTIO (ihminen lukee Learn/-kansion sisällön)      │
│     └─ Tunnistaa puutteet, virheet, uudet mahdollisuudet   │
│                                                             │
│  3. KEHITYSSESSIO (Claude Code / Copilot / Cursor)         │
│     └─ Korjaa, lisää, parantaa koodia ja dokumentaatiota   │
│                                                             │
│  4. VERSIOINTI (git commit + push)                         │
│     └─ Opinnäytetyön versio kasvaa, oppimispäiväkirja      │
│        päivittyy automaattisesti                            │
│                                                             │
│  5. SEURAAVA AAMU → palaa kohtaan 1                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Miksi oppimisajattelu on tärkeää opinnäytetyössä

Perinteisessä opinnäytetyöprosessissa tutkija kirjoittaa dokumentin kerran ja palauttaa sen. Learn Thinking -mallissa:

1. **Opinnäytetyö on elävä dokumentti** — 30+ versiota 3 kuukauden aikana, jokainen dokumentoi konkreettisen oppimispanoksen
2. **Tekoälytyökalut ovat oppimiskumppaneita** — Claude Code, Copilot ja Cursor eivät vain generoi koodia, vaan tuottavat rakenteellista reflektiota versiohistorian kautta
3. **Learn/-kansio on oppimisen todiste** — konkreettinen, päivittäin päivittyvä portfolio opinnäytetyön etenemisestä
4. **Tutkimus ja tuotanto konvergoituvat** — opinnäytetyön löydökset ohjaavat suoraan DWS-tuotekehitystä ja päinvastoin

### Yhteys Build-Measure-Learn -sykliin

Learn Thinking laajentaa Lean Startup -viitekehyksen Build-Measure-Learn -sykliä:

| Lean Startup | Learn Thinking | DWS-toteutus |
|--------------|----------------|---------------|
| Build | Kehityssessio (koodi + dokumentaatio) | Claude Code + git commit |
| Measure | Aamukatselmus (muutokset Edge-selaimessa) | Generate-PDFs.ps1 → Learn/ |
| Learn | Reflektio ja seuraava toimenpide | Versiohistoria = oppimispäiväkirja |

---

# 10. Johtopäätökset

## 10.1 Yhteenveto

Firehorse-toimintamalli osoittaa, että tekoälyavusteinen verkkokaupan hallinta voi:

1. **Vähentää toiminnallista ylikuormitusta** yli 90 % automatisoidulla tuotehallinnalla
2. **Varmistaa vaatimustenmukaisuuden** EU-säännösten kanssa dokumentoiduilla auditointipoluilla
3. **Mahdollistaa nopean iteroinnin** tuotetarjonnassa luonnollisen kielen käyttöliittymillä
4. **Valmistaa infrastruktuurin** äänipohjaiseen asiakasvuorovaikutukseen
5. **Validoida tuote-markkinasopivuuden** Google Merchant Center -integraation kautta

## 10.2 Keskeiset kontribuutiot

1. Dokumentoitu kehys tekoälyavusteiseen kauppatoimintaan (Firehorse-malli)
2. Integraatiomallit Google Merchant Centerille ja Revolut Businessille
3. Suunnitelma äänichatille hiilijalanjälkilaskurin integraatiolla (4 vaihetta)
4. EU-vaatimustenmukaisuuskartoitus teollisille ohjelmistotuotteille
5. Tuotesuositusmoottorin arkkitehtuuri 16:lle EU-toimialalle
6. Proton-tuotteiden turvallisuusstrategia GDPR/NIS2-vaatimustenmukaisuuteen

## 10.3 Kontribuutio teoriaan

### Lifetime Scope Signals -protokolla
Uusi kontribuutio moniagenttijärjestelmien teoriaan — deklaratiivinen koordinointi, deterministiset riippuvuudet ja käynnistysvaiheen optimointi.

### Solution Factory -malli
Syntetisoi Lean Startupin, Alustatalouden, Teollisuus 5.0:n ja Reunalaskennan taloustieteen yhtenäiseksi viitekehykseksi.

## 10.4 Sääntelymuutosten vaikutus: Omnibus-paketti

Omnibus-paketti **vahvistaa** Firehorse-mallin kilpailukykyä: ilmastopäästötavoitteista ei tingitä — vain hallinnollista taakkaa kevennetään. Tämä luo uuden markkinasegmentin vapaaehtoiselle raportoinnille, jossa €0-350/kk hintapiste on erityisen kilpailukykyinen.

## 10.5 Tuleva työ

1. **Q1 2026:** Ota käyttöön äänichat-vaihe 1 Groq/Llama-malleilla
2. **Q2 2026:** Toteuta toimialan hiilijalanjälkilaskuri Scope 1/2/3:lla
3. **Q3 2026:** Lanseeraa sääntelytietoisuusmoottori
4. **Q4 2026:** Perusta kumppaniekosysteemi provisiomallin kanssa
5. **2027:** Laajenna muille EU-markkinoille (SE, NO, DK, DE)
6. **2027:** Toimialakohtainen avoin LLM-valinta ja vuokralaiskohtainen Lifetime World Model -koulutus
7. **2027-2028:** Yrityksen BYOA (Bring Your Own Agent) -graafinen työnkulkurakentaja

## 10.6 Laajennetut tutkimuspanokset (Yhteenveto)

Osiot 10.6-10.15 dokumentoivat yksityiskohtaiset tutkimuspanokset, jotka kehitettiin DWS IQ 6 -toteutuksen aikana. Laajuuden vuoksi nämä esitetään tässä yhteenvetomuodossa, ja täydellinen dokumentaatio löytyy tohtorintutkimuksen liitedokumentista (PHD Firehorse, osiot 14.5-14.14).

### 10.6.1 Toimialakohtainen LLM-valinta ja yrityksen BYOA-arkkitehtuuri

Keskeinen havainto on, että **yksikään avoin LLM ei ole optimaalinen kaikille 16 EU-toimialalle**. Jokaisella toimialavertikaalilla on oma erikoiskielensä, sääntelykontekstinsa ja rakenteellisen tulosteen vaatimuksensa. Alusta arvioi ja valitsee parhaan avoimen LLM:n kullekin toimialalle (7 toimialaklusteria kartoitettu ehdokasmalleille, mukaan lukien Llama 3.3, Qwen 2.5, Mistral Large, DeepSeek-V3), ja yritysvuokralaiset saavat oman Lifetime World Model -instanssinsa, joka on hienosäädetty heidän toimialadatallaan.

**Yrityksen BYOA (Bring Your Own Agent) -arkkitehtuuri** mahdollistaa yritysasiakkaille omien AI-agenttien yhdistämisen (esim. NCC:n 24 agentin ekosysteemi hankintaan, turvallisuuteen, BIM:iin ja aliurakoitsijoihin) A2A + MCP -protokollien kautta, visuaalisella Agent Orchestration Studiolla (Langflow + React Flow + Temporal.io).

**Qantic GmbH:n energiasektorin tapaustutkimus** (maaliskuu 2026) tarjosi ensimmäisen ulkoisen markkinavalidoinnin LWM:n kaupallisesta arvosta rakennusalan ulkopuolella — laskien €21 693/vuosi BESS-vaatimustenmukaisuuskustannukset ja vahvistaen poikkitoimialaisen verkostovaikutuksen.

*Täydellinen dokumentaatio: PHD Firehorse osiot 14.5, 14.2.1*

### 10.6.2 Tuotestandardi ja brändin selkeys

DWS-tuotestandardi ratkaisi hinnoittelukaaoksen 30 tuotteen osalta, jotka olivat kopioituna 5 katalogitiedostoon (vaihtelua jopa 16×), perustamalla yhden totuudenlähteen kaksikanavaisella hinnoittelulla (itsepalvelukauppa + yrityksen suoramyynti), tuotteen elinkaarihallinnalla ja Google Merchant Center -yhteensopivuudella.

Brändistandardi kodifioi **pohjoismaisen "€13,70 buffet" -kulttuurisen suunnittelumallin** yritysohjelmistolle: julkaistu hinnoittelu (ei "ota yhteyttä" -mallia), itsepalveludemo, standardisopimukset ja puhdas irtisanominen. Tämä käsittelee vähän tutkittua yhteyttä pohjoismaisen kulttuuripsykologian (tasa-arvo, ahdistuksen vähentäminen) ja B2B-konversioprosentin välillä.

### 10.6.3 Mitattava vaikutus kohti DWS 7:ää

DWS 7 on seuraava merkittävä alustaversio. DWS 6:n aikana luodut standardit muodostavat mitattavat perusteet: tuotestandardi (0 hintaristiriitaa tavoitteena), brändistandardi (hinnoittelusivun välitön poistumisprosentti < 40 %), myyntistrategia (aika ostopäätökseen < 7 päivää) ja dokumenttistandardi (100 % jäljitettävyys).

Tämä opinnäytetyö argumentoi, että **yritystuotestandardit** — eivät pelkästään tuotteet itsessään — muodostavat kilpailuedun teollisille SaaS-yrityksille, luoden luottamuksen kertymistä, toiminnallista vipuvaikutusta, tekoälynatiivia hallintaa ja sääntelyyhteensopivuutta.

### 10.6.4 Agenttiarkkitehtuuri ja tekoälytyönkulkujen suunnittelu

Seuraavat tutkimuspanokset kehitettiin DWS IQ 6 -toteutuksen aikana (helmi–maaliskuu 2026). Jokainen on dokumentoitu täydellisesti PHD Firehorse -liitedokumentissa.

**Agenttiarkkitehtuurin modernisointi (PHD Firehorse osio 14.5):** Kuusi kriittistä korjausta, jotka muunsivat DWS6:n yksittäiskutsu-LLM:stä todelliseksi agenttiarkkitehtuuriksi: havainnoi-ajattele-toimi-silmukat, työkaluajoympäristö, monituottaja-LLM-asiakas, agenttien delegointi syvyysseurannalla, MCP JSON-RPC -palvelin ja tapahtumaväylä. "Build for Agents" -periaate vakiinnutettiin: jokaisen ominaisuuden on oltava käytettävissä CLI:n (JSON-tuloste), MCP-työkalun, Claude Code -taidon ja REST-API:n kautta.

**Agent Foundry Vaihe 1.5 (PHD Firehorse osio 14.6):** OpenSandbox Acer Veriton GN100 -laitteella tarjoaa Docker-pohjaisen agenttieristyksen EU:n tietojen sijainnilla laitteistotasolla. EMPO²-muistiarkkitehtuuri (arXiv:2602.23008) validoi kaksois-parametrisen/ei-parametrisen muistilähestymistavan. Agenttimuistin faktojen poimintaputki (PR-254) operationalisoi ei-parametrisen muistin LLM-pohjaisella poiminnalla subjekti-predikaatti-arvo-kolmikoiksi.

**Toimitusjohtajan automaatioagenttiryhmä (PHD Firehorse osio 14.7):** Kolme tuotantoagenttia (Captain Pre-Briefing, LinkedIn-julkaisuajastin, EU-sääntelymonitori) automatisoivat päivittäisen operatiivisen rytmin, validoiden Solution Factory -toistettavuuden liikevaihtokriittisille työnkuluille.

**Strategiset kumppanuudet (PHD Firehorse osio 14.8):** Monikumppaniekosysteemi (NVIDIA, Siemens, ABB, xAI, Mistral) monituottaja-LLM-reitittimellä, joka ratkaisee EU AI Act -suvereniteettijännitteen — säännellyt toimialat käyttävät Mistralia (EU-suvereeni) vaatimustenmukaisuusgenerointiin hyödyntäen Claudea ja Grookia analyyttisiin tehtäviin.

**Agenttijärjestelmän koventaminen (PHD Firehorse osio 14.10):** 6 TypeScript-kääntövirhettä korjattu 5 alijärjestelmässä; integraatiovelkamallit moniagenttijärjestelmissä dokumentoitu. Tulos: 0 virhettä, 47/47 testiä läpi.

**PostgreSQL HTAP -arkkitehtuuri (PHD Firehorse osio 14.11):** Kaksitasoinen HTAP TimescaleDB 2.25.x Hypercorella (Aiven-hyväksytty) ja pg_duckdb:llä (vain reunalaite). DWS-tietostandardi ohjaa laajennusrekisteriä, säilytyspolitiikkoja ja EU-vaatimustenmukaisuutta.

**Harness Engineering (PHD Firehorse osio 14.12):** OpenAI:n 8 harness engineering -periaatteen analyysi DWS IQ 6 -arkkitehtuuria vasten. Empiirinen löydös: **pelkät harness-parannukset tuottivat 52,8% → 66,5% tuloksen** (malli muuttumaton). EU-sääntely vaatii perustavanlaatuisesti erilaisen harnessin kuin Silicon Valley — jäljitettävyys + ihminen silmukassa vs nopeusoptimointi.

**Hiilitase (PHD Firehorse osio 14.13):** EU:n ilmastovaatimustenmukaisuus (ETS, CBAM, CSRD, taksonomia) on rakenteellisesti isomorfinen kirjanpidon kanssa. Kahdenkertainen kirjanpito CO2:lle mahdollistaa poikkisääntelyisen täsmäytyksen ja poikkitoimialaisen älykkyyden.

**LWM-sekvensointistrategia (PHD Firehorse osio 14.13):** Kolmivaiheinen sekvensointi (vaatimustenmukaisuus → laivasto → Series A) LeWorldModel-ulkoisella validoinnilla (arXiv:2603.19312).

**Claude Code -suunnittelurakenne (dokumentoitu osiossa 10.13 alla):** Tekoälytyönkulut ensiluokkaisina ohjelmistokomponentteina — CLAUDE.md projektimuistina, 21 taitoa, 4 aliagenttia, 4 kurinpitoporttia ja salaisuuksien skannauskoukkuja. Kilpailija-analyysi everything-claude-code-kehystä (120k tähteä, 136 taitoa) vastaan osoittaa, että toimialakohtainen syvyys ylittää geneerisen laajuuden säännellyillä toimialoilla.

---

## 10.13 Claude Code -suunnittelurakenne: tekoälytyönkulku ensiluokkaisena ohjelmistokomponenttina

### 10.13.1 Motivaatio

Claude Code -käytön laajetessa yksittäisistä kokeiluista skaalautuviin järjestelmiin syntyy merkittävä arkkitehtuurinen jakolinja: projektit, jotka käsittelevät tekoälytyönkulkuja väliaikaisina chat-vuorovaikutuksina, eroavat selvästi niistä, jotka suunnittelevat ne ensiluokkaisina ohjelmistokomponentteina. DWS6-repositorio edustaa jälkimmäistä lähestymistapaa, ja tässä osiossa dokumentoidaan periaatteet, jotka mahdollistavat sen toimivuuden yritystasolla.

Ydinajatus — jonka kehittyvä Claude Code -yhteisön käytäntö validoi vuonna 2026 — on, että **ohjelmistosuunnittelussa käytettävää vastuiden erottelua sovelletaan yhtä lailla tekoälytyönkulkujen suunnitteluun**. Kehote ei ole tuote; taito on.

### 10.13.2 CLAUDE.md projektimuistina

Perinteinen tekoälykäyttö toistaa kontekstin jokaisessa kehotteessa, mikä aiheuttaa kaksi kumuloituvaa ongelmaa: tokenien tuhlausta ja käytöksessä ajautumista. DWS6:n ratkaisu on `CLAUDE.md` — elävä määrittelytiedosto, joka toimii jaettuna institutionaalisena muistina kaikissa tekoälysessioissa ja -työkaluissa.

DWS6:n `CLAUDE.md` (yli 2 000 riviä versiosta 3.17 alkaen) kokoaa yhteen:

| Kategoria | Sisältö |
|-----------|---------|
| **Standardit** | Brändi, asiakirja, tietoturva, markkinatutkimus, Gamma UI |
| **Arkkitehtuuri** | Brain-Memory-Body-Hands, kaksoiskansiorakenne, kaupan päivityssäännöt |
| **Rajoitteet** | Tiedostojen käsittely (git mv, ei poistoa), julkaisusäännöt, sähköpostisäännöt |
| **Ehdottomat vaatimukset** | EU:n tietojen sijaintivaatimukset, GDPR, Article 12 -kirjaus, tietoturvaohjelmointi |
| **Suojamekanismit** | execFile vs exec, CORS-käytäntö, SRI-tiivisteen valvonta |

Mitattu vaikutus: jokainen uusi Claude Code -sessio perii 18 kuukauden arkkitehtuuripäätökset ilman ihmisen toistoa. VERSION AND AGENT HISTORY -lohko jokaisessa asiakirjassa laajentaa tämän yksittäisiin tiedostoihin — jokaisessa asiakirjassa on oma muokkaushistoriansa, joka on sekä ihmisten että agenttien luettavissa.

### 10.13.3 Taidot uudelleenkäytettävinä työnkulkukomponentteina

Siirtymä ad hoc -kehotteista uudelleenkäytettäviin taitoihin edustaa perustavanlaatuista arkkitehtuurista parannusta: **chat-vuorovaikutuksesta järjestelmäsuunnitteluun**. Taidot ovat koottavia, versioituja työnkulkukomponentteja — ei kertakäyttöisiä kehotteita.

Maaliskuuhun 2026 mennessä DWS6 toteuttaa 21 tuotantotaitoa neljässä kategoriassa `.claude/commands/`- ja `skills/`-kansioissa:

**Slash-komennot (17 taitoa):**

| Kategoria | Taidot | Toimiala |
|-----------|--------|----------|
| gstack-työnkulku | `/plan-ceo-review`, `/plan-eng-review`, `/review`, `/ship`, `/browse`, `/retro` | Kehityksen elinkaari (Garry Tan -menetelmä) |
| EU-vaatimustenmukaisuus | `/compliance-check`, `/carbon-analysis`, `/sovereignty-assess`, `/site-safety` | ETS, CBAM, CSRD, EN 15978, EN 13001, CLOUD Act |
| Agenttien hallinta | `/discover-agents`, `/agent-run`, `/workflow` | Moniagenttiorkestrerointi (14+ agenttia) |
| Toiminnot | `/flow-status`, `/email`, `/remote-control` | Git-tila, SES-sähköposti, reunalaitteen hallinta |
| Koodin laatu | `/simplify`, `/designer` | Koodin tarkastus, Figma-koodisiltä |

**Kurinpitotaidot (4 kovaa porttia `skills/*/SKILL.md`-tiedostoissa):**

| Taito | Porttilogiikka | Valvonta |
|-------|----------------|----------|
| `verification-gate` | Estää valmistumisilmoitukset ilman tuoretta testitodistetta | Paluukoodi 2 (ESTÄ) |
| `design-first` | Estää 3+ tiedoston muutokset ilman hyväksyttyä suunnitelmaa | Paluukoodi 2 (ESTÄ) |
| `dual-folder-sync` | Estää commitit jotka muuttavat juurikansioita ilman landing-pages-synkronointia | Paluukoodi 2 (ESTÄ) |
| `last30days` | Tutkimusagentti Reddit/X/Web-sisällölle viimeiseltä 30 päivältä | Agenttityylinen (ei-estävä) |

**Aliagentit (4 erikoistunutta agenttia `.claude/agents/`-kansiossa):**

| Agentti | Rooli | Eristysominaisuus |
|---------|-------|--------------------|
| `mcp-expert` | MCP-palvelinkonfiguraation asiantuntija | Suojaa pääkontekstin protokollatiedoilta |
| `code-reviewer` | Staff Engineer -virheiden etsijä (logiikka, tietoturva, tietojen eheys) | Tarkastaa ilman muutosten tekemistä |
| `security-reviewer` | OWASP Top 10 + DWS Security Standard -auditoija | Skannaa ilman koodin muokkaamista |
| `architect` | Minimalistinen suunnittelija, ylisuunnittelun ehkäisijä | Palauttaa vain jäsennellyn suunnitelman |

Jokainen taito kapsuloi syötteiden validoinnin, agenttien suorituksen ja jäsennellyn tulosteen muotoilun. Kurinpitotaidot edustavat uutta kontribuutiota: **estävät portit**, jotka valvovat prosessikuria rakenteellisesti eikä käyttäytymispohjaisesti. Toisin kuin neuvoa-antavat linterit, näitä portteja ei voi ohittaa — ne sieppaavat työkalukutsut hook-paluukoodilla 2 (ESTÄ) ja estävät toiminnon suorittamisen. Tämä toteuttaa suoraan **Build for Agents** -periaatteen: jos ominaisuutta ei voi kutsua komennolla `dws <komento>`, sitä ei toimiteta.

### 10.13.4 Koukut automaattisena laadunvalvontana

Koukut ovat tekoälytyönkulkusuunnittelun valvontakerros — ja nykyisessä käytännössä eniten alihyödynnetty malli. Siinä missä taidot määrittelevät uudelleenkäytettäviä kykyjä, koukut valvovat automaattisesti ja kiistattomasti laadun reunaehtoja.

DWS6 toteuttaa koukkuja kahdella tasolla:

**Claude Code -koukut** (`.claude/hooks/`):
- Työkalun tulosteen muuntaminen — normalisoi agentti-JSON-vastaukset yhdenmukaiseen skeemaan
- Jäsennellyn tulosteen tarkistaminen — varmistaa, että kaikki CLI-komennot tuottavat kelvollista JSON:ia
- Session käynnistyksen validointi — tarkistaa ympäristön valmiuden ennen agentin työtä

**Git-koukut** (`.githooks/`):
- Haaranimen valvonta — `claude/<ominaisuus>-<id>` -nimeämiskäytäntö ennen commit-operaatiota
- Ennen commit -tietoturvatarkistukset — kovakoodattujen salaisuuksien ja vaarallisten exec()-kaavojen tunnistaminen

Koukkujen kriittinen ominaisuus on **kiistaamattomuus**: toisin kuin CLAUDE.md-ohjeet (joita agentti saattaa noudattaa epätäydellisesti), koukut sieppaavat työkalukutsut ja joko muuntavat tai estävät ne. Tämä on välttämätöntä tuotantotekoälytyönkuluille, joissa manuaalinen tarkistus ei skaalaudu ja laadun takeet on oltava rakenteellisia, ei käyttäytymiseen perustuvia.

### 10.13.5 Aliagentit ja rinnakkaissuoritus

DWS6-arkkitehtuuri käyttää erikoistuneita aliagentteja eri tehtäväluokkiin, laajentaen moniagenttiorkestroinnin periaatteen Firehorse-tuotantotyönkuluista kehitystyönkulkuun:

| Aliagenttityyppi | Rooli | Eristysominaisuus |
|------------------|-------|--------------------|
| **Explore** | Koodikannan haku, tiedostomallien sovitus | Suojaa pääkontekstin suurilta tulosjoukoilta |
| **Plan** | Arkkitehtuurisuunnittelu, kompromissianalyysi | Palauttaa jäsennellyn suunnitelman ilman muutosten tekemistä |
| **Yleiskäyttöinen** | Monivaiheinen tutkimus, asiakirja-analyysi | Täysi työkalujen käyttö monimutkaiseen tutkimukseen |
| **Tausta** | Itsenäiset rinnakkaiset tehtävät | Ei-blokkaava; ilmoittaa valmistumisesta |

Eristysominaisuus on kriittinen mittakaavassa: aliagentit estävät konteksti-ikkunan loppumista suurissa koodipohjissa samalla kun ne mahdollistavat toisistaan riippumattomien tehtävien rinnakkaissuorituksen. Firehorse-tuotanto-orkestrointi (Temporal.io + tapahtumaväylä, osio 10.7) laajentaa tämän saman mallin asiakaspalveluagentin työnkulkuihin.

### 10.13.6 Vaikutukset Solution Factory -malliin

Tämä suunnittelurakenne validoi ja laajentaa Solution Factory -mallia (osio 5) konkreettisella toteutuskerroksella, joka kartoittuu suoraan Brain-Memory-Body-Hands-arkkitehtuuriin:

| Solution Factory -kerros | Claude Code -toteutus | Arkkitehtuurikerros |
|--------------------------|----------------------|---------------------|
| Tiedon pysyvyys | CLAUDE.md + VERSION AND AGENT HISTORY | Muisti |
| Agenttien koordinointi | Aliagentit + jaettu CLAUDE.md-konteksti | Aivot |
| Uudelleenkäytettävät kyvykkyydet | Taidot (`.claude/commands/`) | Vartalo |
| Laadun valvonta | Koukut (`.claude/hooks/`, `.githooks/`) | Kädet |
| Rinnakkaissuoritus | Taustaagentit + Temporal.io | Aivot |

**Keskeinen tutkimustulos:** tekoälytyönkulkujen käsitteleminen ensiluokkaisina ohjelmistokomponentteina — samalla modulaarisuudella, testattavuudella ja vastuiden erottelulla kuin tuotanto-ohjelmistossa — on erottava tekijä tekoälykokeilujen ja tekoälytuotteiden välillä. DWS6-repositorion rakenne osoittaa tämän eron tuotantomittakaavassa: CLAUDE.md vähentää käyttäytymisessä ajautumisen lähes nollaan, taidot eliminoivat toistuvan kehottamisen, ja koukut valvovat laatua ilman ihmisen puuttumista.

Tämä on linjassa tässä opinnäytetyössä dokumentoidun laajemman periaatteen kanssa: Firehorse Operations Model menestyy ei siksi, että se käyttää tekoälyä, vaan siksi, että se suunnittelee tekoälyn kurinalaiseksi järjestelmäksi.

### 10.13.7 Kilpailija-analyysi: Toimialakohtainen vs geneerinen AI-harness

Maaliskuussa 2026 suoritettu vertailututkimus vertasi DWS6-harness-arkkitehtuuria **everything-claude-code (ECC)** -kehykseen — 120 000 tähden MIT-lisensoituun kehykseen, joka tarjoaa 136 taitoa, 30 aliagenttia, 60 slash-komentoa, 34 sääntötiedostoa ja 14 MCP-palvelinmallia. Vertailu paljastaa perustavanlaatuisen arkkitehtuurisen kompromissin geneerisyyden ja toimialaspesifisyyden välillä.

**ECC-arkkitehtuuri (geneerinen):**
ECC vastaa kysymykseen: "Kuinka käytän Claude Codea tehokkaasti missä tahansa projektissa?" Se tarjoaa kielikohtaiset agentit (TypeScript, Python, Go, Java, Rust, C++, Swift, PHP), IDE-adapterit, PM2-elinkaarenhallinta, SQLite-sessiopersisteenssi ja 997-testin validointisarja.

**DWS6-arkkitehtuuri (toimialakohtainen):**
DWS6 vastaa eri kysymykseen: "Kuinka ajetaan yritystason teollisia tekoälyagentteja turvallisesti EU:ssa?" 21 taitoa koodaavat säänneltyä toimialatietämystä — EU ETS -päästökertoimet, CBAM-tuontirajat, CSRD-tiedonantovaatimukset, EN 15978 -elinkaaren vaiheet, EN 13001 -nosturiturvallisuusstandardit — joita mikään geneerinen kehys ei tarjoa. Tämä toimialatietämys on tuotteen kilpailuvallihauta.

**Kuusi tunnistettua kilpailuetua:**

| # | DWS6-etu | ECC-vastine | Tutkimuksellinen merkitys |
|---|----------|-------------|---------------------------|
| 1 | **Toimialakohtaiset taidot** koodaavat EU-sääntelyä | Geneeriset kieli-/kehystaidot | Toimialatietämys kilpailuvallihautana |
| 2 | **Kuusikerroksinen tietoarkkitehtuuri** (L0-L6) | Toimii vain tasoilla L2-L3 | Syvempi hallinta agentin käyttäytymiseen |
| 3 | **Kovat portit** (verification-gate, design-first, dual-folder-sync) | Vain neuvoa-antavat taidot | Rakenteellinen valvonta vs käyttäytymisehdotus |
| 4 | **Luottamusvyöhykkeet** (VIHREÄ/KELTAINEN/PUNAINEN) | Vain salaisuuksien skannaus | Riskisuhteutettu automaatio |
| 5 | **gstack-työnkulku** pakotetulla roolierottelulla | Itsenäiset orkestroitumattomat taidot | Kognitiivisen tilan vaihtaminen |
| 6 | **Agentti-ensin -tuotesääntö** (5-portin toimitustarkistuslista) | Kehittäjän apuvälineet | Taidot tuoterajapintoina |

**Keskeinen tutkimustulos:** ECC-kehys optimoi **leveyteen** (136 taitoa × useita kieliä × useita IDE:itä), kun taas DWS6 optimoi **syvyyteen** (21 taitoa × syvä EU-sääntelyn tuntemus × rakenteellinen valvonta). Token-budjetin tasolla leveys on haitallista: 136 taidon lataaminen kuluttaa konteksti-ikkunan kapasiteettia, jota toimialakohtaiset agentit tarvitsevat sääntelyn päättelyyn. DWS6:n <150 sanan rajoitus kurinpitotaidoille ei ole rajoitus — se on token-budjetin optimointi, joka mahdollistaa syvemmän toimialapäättelyn samassa konteksti-ikkunassa.

Tämä validoi harness engineering -teesin (osio 10.16): ero tekoälykokeilujen ja tekoälytuotteiden välillä ei ole malli tai taitojen määrä — se on suunnittelukuri, joka sovelletaan tiedon rakenteiseen, valvontaan ja koostamiseen. 21 taidon toimialakohtainen harness ylittää 136 taidon geneerisen harnessin, kun toimiala vaatii sääntelyn tarkkuutta, koska tietämyksen syvyys on tärkeämpää kuin kyvykkyyden laajuus.


### 10.19 Opinnäytetyön versiointistrategia: v3.30.50 Metropolia-jäädytys

#### 10.19.1 Motivaatio

Versioon 3.31 mennessä opinnäytetyö oli kasvanut 82 sivuun ja yli 26 000 sanaan — lähes kaksinkertainen Metropolian 40-50 sivun tavoitteeseen nähden. Yksityiskohtaisen tutkimussisällön pysyvän menetyksen sijaan omaksuttiin kaksoisversioarkkitehtuuri.

#### 10.19.2 Kaksoisversioarkkitehtuuri

| Versio | Tiedosto | Sivut | Tila | Tarkoitus |
|--------|----------|-------|------|-----------|
| v3.30.50 | `V3Thesis_EN_v3.30.50.md` | ~50 | JÄÄDYTETTY | Metropolia-palautusversio |
| v3.32+ | `V3Thesis_EN.md` / `V3Thesis_FI.md` | ~82 | Elävä | Täydellinen tutkimustietue |
| v3.2+ | `PHD_FIREHORSE_EN.md` / `_FI.md` | — | Elävä | Tohtorintutkimuksen liitedokumentti |

v3.30.50-uudelleenrakenne toteutettiin neljällä muunnoksella:

1. **Osion 5 laajennus** — 0,7 sivusta ~4 sivuun kattaen infrastruktuurin käyttöönoton, agenttiarkkitehtuurin, koordinoinnin Lifetime Scope Signals -protokollalla, 31 agentin evoluution, asiakkaiden perehdytyksen ja avainmittarit
2. **Osion 10 konsolidointi** — Yksityiskohtaiset osiot 10.6-10.18 korvattu osiolla 10.6 "Laajennetut tutkimuspanokset (Yhteenveto)" sisältäen 1 kappaleen tiivistelmät PHD Firehorse -ristiviittauksilla
3. **Liitteiden karsinta** — 8 liitettä vähennetty 4:ään (säilytetty Solution Factory Canvas, LSS-protokolla, Karpathyn periaatteet, Sanasto)
4. **Sisällön säilyttäminen** — Kaikki poistettu sisältö on jo olemassa PHD Firehorse -liitedokumentissa

#### 10.19.3 Versiointisäännöt

- v3.30.50-tiedostot ovat **HIL-only** (Human-in-the-Loop) — ei Claude Code -muokkauksia jäädytyksen jälkeen
- 82-sivuinen elävä dokumentti jatkaa versiointia normaalisti (3.32, 3.33, ...)
- PHD Firehorse jatkuu itsenäisesti (3.2, 3.3, ...)
- Elävien dokumenttien versioidenpäivityksissä tulee mainita, jos sisältö koskee myös jäädytettyä versiota kopioi-liitä-ehdotusten kautta

#### 10.19.4 Tutkimuspanos

**Avainpanos #23:** Kaksoisversiostrategia osoittaa käytännön ratkaisun tekoälyavusteiseen akateemiseen kirjoittamiseen, jossa tutkimuksen nopeus ylittää palautusformaatin rajoitukset. 82-sivuinen elävä dokumentti säilyttää täydellisen tutkimuslinjan (38 versiomerkintää, 22 avainkontribuutiota), kun taas 50-sivuinen jäädytetty versio täyttää oppilaitoksen vaatimukset menettämättä henkistä omaisuutta. Malli voi yleistyä muihin nopeasti eteneviin tutkimusprojekteihin, jotka käyttävät tekoälyavusteista dokumentointia.

---

# 11. Lähteet

## Akateeminen kirjallisuus

1. Ries, E. (2011). *The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses*. Crown Business.

2. Blank, S. (2013). *The Four Steps to the Epiphany: Successful Strategies for Products that Win*. K&S Ranch.

3. Parker, G., Van Alstyne, M., & Choudary, S. (2016). *Platform Revolution: How Networked Markets Are Transforming the Economy*. W.W. Norton.

4. Euroopan komissio (2021). *Teollisuus 5.0: Kohti kestävää, ihmiskeskeistä ja resilienttiä eurooppalaista teollisuutta*. EU:n julkaisutoimisto.

5. Shi, W., Cao, J., Zhang, Q., Li, Y., & Xu, L. (2016). "Edge Computing: Vision and Challenges." *IEEE Internet of Things Journal*, 3(5), 637-646.

6. Christensen, C. M., Hall, T., Dillon, K., & Duncan, D. S. (2016). "Know Your Customers' Jobs to Be Done." *Harvard Business Review*, 94(9), 54-62.

7. Wooldridge, M. (2009). *An Introduction to MultiAgent Systems* (2. painos). Wiley.

8. Jennings, N. R., & Wooldridge, M. (1998). "Applications of intelligent agents." *Agent Technology: Foundations, Applications, and Markets*, 3-28.

## Moniagenttijärjestelmät ja AI-koordinointi

9. LangChain Documentation (2024). "Building LLM Applications with Composable Components." https://docs.langchain.com

10. Anthropic (2024). "Model Context Protocol Specification." https://modelcontextprotocol.io

11. NVIDIA (2024). "Jetson Orin Nano Developer Kit: Technical Specifications." https://developer.nvidia.com/embedded/jetson-orin-nano

## Toimialaraportit

12. Euroopan komissio & Ramboll (2025). "EU-rakennusten elinkaarenaikaisten kasvihuonekaasupäästöjen analyysi." DG Environment.

13. GRESB (2024). "Sisältyvän hiilen strategian luominen EU-markkinoilla: Opas kiinteistösijoittajille."

14. Eurofound & Cedefop (2025). "Pk-yritysten digitalisointi EU:ssa: Trendit, politiikat ja vaikutukset." EU:n julkaisutoimisto.

15. McKinsey & Company (2024). "The State of AI in Construction: Adoption, Impact, and Future Outlook."

## Säädökset ja standardit

16. NIS 2 -direktiivi (EU) 2022/2555
17. EU AI Act (EU) 2024/1689
18. Yleinen tietosuoja-asetus (GDPR) (EU) 2016/679
19. Kyberturvallisuusasetus (EU) 2019/881
20. ISO/IEC 27001:2022
21. European Commission (2025). *Omnibus package*.
22. EN 15978:2011 Rakentamisen kestävyys
23. Rakennusten energiatehokkuusdirektiivi (EPBD) (EU) 2024/1275
24. Google Merchant Center -tekniset määritykset (2026)
25. Revolut Business API -dokumentaatio
26. Anthropic Claude Code -dokumentaatio

## Sisäiset viiteartefaktit

27. Lifetime Oy (2026). *Lifetime World LLM Scaling Blueprint (GN-100 hybridi + pilvipolku).* `Admin/Model/LLM_TRAINING_FEASIBILITY.md`.
28. Anonymous (2026). "Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization (EMPO²)." arXiv:2602.23008. https://arxiv.org/abs/2602.23008
29. Alibaba Group (2026). "OpenSandbox: General-Purpose Sandbox Platform for AI Applications." https://github.com/alibaba/OpenSandbox

30. LUT-yliopisto (2026). *Tekoälytyökalujen käytänteet*. Lappeenrannan-Lahden teknillinen yliopisto LUT. https://elut.lut.fi/fi/opintojen-suorittaminen/opintoja-ohjaavat-saadokset-ja-ohjeet/tekoalytyokalujen-kaytanteet

31. Lifetime Oy (2026). *DWS Security Standard*, versio 1.5. `DWS_SECURITY_STANDARD.md`. Sisäinen viitekehys, joka ohjaa tekoälyn turvallisuutta, väliohjelmiston tietoturvakontrolleja (korrelaatio-ID, Zod-validointi, keskitetty virhekäsittely), CORS-käytäntöjä, SRI-eheyttä, artikla 12 -kirjausta ja API-rajapinnan validointia. Määrittelee tietoturva-arkkitehtuurin kaikille backend-API-reiteille ja MCP-agenttipalvelimelle.

32. Lifetime Oy (2026). *ESRS-tietopisterekisteri*, versio 1.0. `src/compliance/esrs-registry.ts`. Koneluettava kartoitus kaikista 82 eurooppalaisesta kestävyysraportointistandardien (ESRS) tiedonantovaatimuksesta kategorioittain E1–E5 (ympäristö), S1–S4 (sosiaalinen) ja G1 (hallinto). Kukin tiedonanto on luokiteltu pakolliseksi tai vapaaehtoiseksi CSRD-direktiivin (EU) 2022/2464 mukaisesti.

33. Lifetime Oy (2026). *Vaatimustenmukaisuuden pisteytysmoottori*, versio 1.0. `src/compliance/scoring-engine.ts`. Deterministinen vaatimustenmukaisuuden pisteytysalgoritmi, joka laskee CSRD-valmiuden, ETS-altistuksen ja CBAM-riskipisteet. Kaava: kokonaispistemäärä = CSRD(0,50) + ETS(0,25) + CBAM(0,25), jossa CSRD = (annetut pakolliset tietopisteet / pakolliset yhteensä) × 80 + bonusmuuttujat.

34. Lifetime Oy (2026). *Site Quality Standards*, versio 2.1. `SITE_QUALITY_STANDARDS.md`. Koodin laatu-, komponenttiarkkitehtuuri- ja käyttöliittymän vikasietoisuusstandardit DWS IQ -hallintapaneelille. Määrittelee ErrorBoundary-, Skeleton-lataus- ja EmptyState-komponenttistandardit yritystason käyttökokemukselle.

35. Lifetime Oy (2026). *AGENTS.md*, versio 2.2. `AGENTS.md`. Agentti-inventaario ja operatiiviset ohjeet agents.md-avoimen spesifikaation mukaisesti. Dokumentoi 15 tekoälyagenttia, vaatimustenmukaisuuden pisteytysarkkitehtuurin, väliohjelmistopinon järjestyksen ja "Build for Agents" -tuotesäännön, joka edellyttää CLI + MCP + Skills -rajapintoja.

36. Lifetime Oy (2026). *DWS IQ Platform Admin Manual*, versio 2.7. `Admin/ADMIN_MANUAL.md`. Operatiiviset menettelyt terveystarkistusten valvontaan, vaatimustenmukaisuusmoottorin hallintaan ja hallintapaneelin vikasietoisuuden vianetsintään. Sisältää Claude Code -projektin suunnittelurakenteen ja moniagenttiorkestrointiosiot.

36. Lifetime Oy (2026). *Enterprise Security & Compliance*, versio 1.8. `Admin/SECURITY_COMPLIANCE.md`. Tietoturvakontrollit tietoturvajohtajille ja hankintatiimeille. Dokumentoi agenttien ajonaikaiset turvakontrollit, hallintapaneelin vikasietoisyyskontrollit, backend-väliohjelmiston turvakontrollit ja vaatimustenmukaisuusmoottorin tietosuojan RLS-käytännöillä.

---

# 12. Liitteet

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
  }
}
```

## Liite C: Tekoälyagenttien toimintaohjeet (Karpathyn periaatteet)

### D.1 Tausta

DWS6-projekti otti käyttöön tekoälykoodausagenttien toimintaohjeet, jotka perustuvat **Andrej Karpathyn viraaliin tekoälykoodausohjeistukseen**. Nämä ohjeet on dokumentoitu repositorion `CLAUDE.md`-tiedostossa ja ne varmistavat johdonmukaisen, laadukkaan tekoäly-ihminen-yhteistyön agenttipohjaisissa koodaustyönkuluissa.

### D.2 Perusfilosofia

```
"Sinä olet kädet; ihminen on arkkitehti.
Liiku nopeasti, mutta älä koskaan nopeammin kuin ihminen voi varmistaa.
Koodiasi tarkkaillaan — kirjoita sen mukaisesti."
```

### D.3 Kriittiset käyttäytymismallit

| # | Käyttäytyminen | Kuvaus | EU:n tekoälysäädöksen yhteys |
|---|----------------|--------|------------------------------|
| 1 | **Oletusten esiin tuominen** | Ilmaise oletukset eksplisiittisesti ennen toteutusta | Tukee päättelyketjua (Artikla 12) |
| 2 | **Sekaannusten hallinta** | PYSÄHDY kun olet hämmentynyt; kysy tarkentavia kysymyksiä | Estää autonomiset virheet |
| 3 | **Vastustaminen tarvittaessa** | Osoita ongelmat suoraan | Varmistaa ihmisen valvonnan |
| 4 | **Yksinkertaisuuden valvonta** | Vastusta aktiivisesti ylimonimutkaistamista | Ylläpidettävyys |
| 5 | **Laajuuskuri** | Koske vain sitä, mitä pyydetään | Auditointipolun selkeys |
| 6 | **Kuolleen koodin hygienia** | Kysy ennen käyttämättömän koodin poistamista | Muutosdokumentaatio |

### D.4 Toteutuksen tulokset

| Mittari | Ennen | Jälkeen | Parannus |
|---------|-------|---------|----------|
| Kooditarkastuksen hylkäykset | 15 % | 3 % | 80 % vähennys |
| Epäselvät muutosperusteet | 25 % | 5 % | 80 % vähennys |
| Luvattomat laajuusmuutokset | 10 % | <1 % | 90 % vähennys |
| Dokumentaation kattavuus | 60 % | 95 % | 58 % parannus |

## Liite D: Sanasto

### Alusta- ja liiketoimintakäsitteet

| Termi (EN) | Suomeksi | Määritelmä |
|------------|----------|------------|
| **AgentFoundry** | AgentFoundry | Monimalli-, monivuokralainen kehys AI-agenttien käyttöönottoon teollisissa vertikaaleissa |
| **Edge AI** | Reunatekoäly | Tekoälyprosessointi paikallislaitteilla pilvipalvelimien sijaan |
| **Firehorse** | Firehorse | DWS6-tuoteperhe (Reports, Automation, Omnichannel, CMS) |
| **Fit for 55** | Fit for 55 | EU:n lainsäädäntöpaketti, joka vaatii 55% päästövähennystä vuoteen 2030 mennessä |
| **Lifetime Scope Signals** | Lifetime Scope Signals | Koordinointiprotokolla moniagenttikehitykselle deklaratiivisen signaalin emission kautta |
| **MCP Hub** | MCP Hub | Model Context Protocol -koordinointipalvelin moniagenttiorkestroinnille |
| **Solution Factory** | Solution Factory | Toimintamalli useiden teollisten AI-alustojen tuottamiseen jaetuista komponenteista |

### Turvallisuus ja vaatimustenmukaisuus

| Termi (EN) | Suomeksi | Määritelmä |
|------------|----------|------------|
| **EU AI Act** | EU:n tekoälysäädös | EU:n säädös tekoälyjärjestelmille (elokuun 2026 määräaika) |
| **GDPR** | GDPR (Yleinen tietosuoja-asetus) | EU:n tietosuoja-asetus |
| **NIS2** | NIS2 | EU:n kyberturvallisuusdirektiivi kriittiselle infrastruktuurille |
| **RLS** | Rivitason suojaus | Tietokantatason pääsynhallinta käyttäjä-/organisaatiokohtaisesti |

### Tietoarkkitehtuuri ja analytiikka

| Termi (EN) | Suomeksi | Määritelmä |
|------------|----------|------------|
| **Autoresearch** | Autotutkimus | Karpathyn inspiroima autonominen validointisilmukka: hypoteesi → muokkaus → todentaminen → säilytä/hylkää → toista |
| **Columnar Storage** | Saraketallennustila | Tietokantatallennus, joka järjestää datan sarakkeittain rivien sijaan — mahdollistaa 10-100× pakkauksen ja nopeammat analyyttiset kyselyt |
| **HTAP** | HTAP | Hybrid Transactional/Analytical Processing — yksi tietokanta palvelee sekä OLTP- että OLAP-työkuormia |
| **Hypercore** | Hypercore | TimescaleDB:n automaattinen hybridi rivi→sarake -tasointimoottori, 90-98% pakkaus |
| **Hypertable** | Hypertaulu | TimescaleDB:n aikaosioitu taulu aikasarjadatalle automaattisella lohkonhallinnalla |
| **pg_duckdb** | pg_duckdb | PostgreSQL-laajennus, joka upottaa DuckDB:n 50-600× OLAP-kiihdytykseen (DWS:ssä vain reunalaitteilla) |
| **pgvector** | pgvector | PostgreSQL-laajennus vektorihakuun, käytetään RAG-putkistoissa |
| **TimescaleDB** | TimescaleDB | PostgreSQL-laajennus aikasarjadatalle pakkauksella ja jatkuvilla aggregaateilla |
| **Two-Tier HTAP** | Kaksitasoinen HTAP | Arkkitehtuurimalli: Taso 1 (Aiven-hallinnoitu, TimescaleDB) + Taso 2 (itsehallittu reuna, pg_duckdb) |

### Tutkimusmenetelmät

| Termi (EN) | Suomeksi | Määritelmä |
|------------|----------|------------|
| **Aiven-first Mandate** | Aiven-ensisijaisuus | DWS-periaate, joka edellyttää kaikkien tuotantotietokannan laajennusten Aiven-yhteensopivuutta ennen käyttöönottoa |
| **DWS Data Standard** | DWS-tietostandardi | Sisäinen standardi tiedon tallennuspäätöksille, laajennusten hallinnalle ja EU-sääntelyyn vaatimustenmukaisuudelle |
| **KYA Standard** | KYA-standardi | Know Your Agent/Architecture — kaksoistarkoitusstandardi AI-agenttien turvallisuudelle (Kilpi) ja optimoinnin hallinnalle (Miekka) |
| **Proxy-to-Scale** | Pienestä suureen -validointi | Karpathyn malli: validoi muutokset pienellä välityspalvelimella (depth=12) ennen tuotantoon skaalausta (depth=24) |

---

---

**Dokumentin tiedot:**

**Otsikko:** Firehorse-tuotevalmistuksen toimintamalli: Hybridi AI-edge-arkkitehtuuri ilmastoälykkäille teollisille alustoille
**Tekijä:** Risto Anton Päärni
**Oppilaitos:** Metropolia Ammattikorkeakoulu
**Koulutusohjelma:** Smart Factory, YAMK
**Ohjaaja:** Jarno Varteva (mukana Erkki Räsänen)
**Yritys:** Lifetime Oy (Firehorse-brändi)
**Tila:** FROZEN v3.30.50 — Metropolian palautusversio (50 sivua). Elävä dokumentti jatkuu tiedostossa V3Thesis_FI.md (v3.32+)
**Versio:** 3.30.50
**Viimeisin päivitys:** 04.04.2026
**V1.0 Julkaisutavoite:** 23. helmikuuta 2026

**Kielet:** English, Suomi
**Liittyvät dokumentit:**
- [English Version](../en/V3Thesis_EN_v3.30.50.md)
- [English Living Document](../en/V3Thesis_EN.md)
- [Finnish Living Document](V3Thesis_FI.md)
- [PHD Firehorse (EN)](../../../PHD_FIREHORSE_EN.md)
- [PHD Firehorse (FI)](../../../PHD_FIREHORSE_FI.md)

**Keskeiset kontribuutiot (Yhteenveto — täydellinen lista osiossa 10.2 ja PHD Firehorse -liitedokumentissa):**
1. Lifetime Scope Signals -protokolla — Uusi moniagenttikoordinointiviitekehys
2. Solution Factory -malli — Toistettava teollisen AI-alustan pohja
3. AI-avusteinen kehitys — Cursor Pro ja Claude Code Max mahdollistavat nopean 15 viikon MVP:n
4. DWS10.com-verkkokauppavalidointi — Google Merchant Center + Revolut Business
5. HIL-oppimisputki — Päivittäinen ihminen-tekoäly-palautesilmukka
6. Claude Code -suunnittelurakenne — CLAUDE.md, 21 taitoa, 4 aliagenttia, kurinpitoportit
7. Toimialakohtainen vs geneerinen AI-harness — 21 taidon syvyys ylittää 136 taidon laajuuden säännellyillä toimialoilla

*Laajennetut kontribuutiot (8-22) dokumentoitu PHD Firehorse -liitedokumentissa.*

**Lisenssi:** Proprietary - Lifetime Oy
**Yhteystieto:** risto@lifetime.fi
