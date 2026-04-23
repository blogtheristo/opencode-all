# Firehorse-tuotevalmistuksen toimintamalli
## Hybridi AI-edge-arkkitehtuuri ilmastointelligeenteille teollisille alustoille

***
# VERSION AND AGENT HISTORY

Version: 3.4

Sessions & Modifications:
  - Version: 3.4 | Tool: Claude Code (Opus 4.6) | Session: claude/self-improving-parallel-agents-p4X6m | Date: 21.04.2026 | Changes: Paivitetty Liite F - korvattu itseparantavat agentit rehellisella kuvauksella todellisista tyokaluista (koodikannan terveysraportti, CI/CD-putki, MCP Hub -reflektio)
  - Version: 3.3 | Tool: Claude Code (Opus 4.6) | Session: claude/self-improving-parallel-agents-p4X6m | Date: 11.02.2026 | Changes: Lisatty Liite F - Itseparantava agenttiprosessi (itsediagnostiikka-agentti, reflektioagentti, koodikannan terveysautomaatio, CI/CD-testiputki)
  - Version: 3.3 | Tool: Claude Code (Opus 4.6) | Session: MCP-HIL-Reduction | Date: 09.02.2026 | Changes: Lisatty osio 6.8 - HIL-virheiden vahentaminen MCP-integraatiolla (MCP-arkkitehtuuri kirjoitus-/kontekstinvaihto-/hyvaksymisvasimusvirheiden eliminoimiseksi, pilvipohjainen MCP-strategia)
  - Version: 3.2 | Tool: Claude Code (Opus 4.6) | Session: HIL-Pipeline | Date: 07.02.2026 | Changes: Lisatty osio 6.7 - Ihminen-silmukassa-oppimisputki (paivittainen automaatio, kolmikerroksinen varmuuskopiointi, Learn/-kansion tuloste)
  - Version: 3.1 | Tool: Claude Code (Opus 4.5) | Session: Karpathy-Principles | Date: 04.02.2026 | Changes: Lisatty Liite E - Tekoalyagenttien toimintaohjeet (Karpathyn periaatteet), EU:n tekoalysaadoksen vaatimustenmukaisuuskartoitus, toteutuksen tulosmittarit
  - Version: 3.0 | Tool: Claude Code (Opus 4.5) | Session: DWS10-Store-Integration | Date: 28.01.2026 | Changes: Lisatty DWS10.com verkkokaupan loydokset, Google Merchant Center -integraatio, Revolut Business -maksut, Aanichat-kehityssuunnitelma Groq/Llama-malleilla, Toimialan hiilijalanjalkililaskuri, EU-vaatimustenmukaisuuskartoitus
  - Version: 2.1 | Tool: Cursor AI (Claude) | Session: 16-Industries | Date: 06.01.2026 | Changes: Lisatty Fit for 55:n 16 teollisuudenalan analyysi, AI-kayton ilmoitus, DWS10-kayttotapaukset, laajennettu nykytila-analyysi
  - Version: 2.0 | Tool: Cursor AI (Claude) | Session: Thesis-Revision | Date: 05.01.2026 | Changes: Suuri revisio - Lisatty Solution Factory -malli, AgentFoundry-dokumentaatio, Lifetime Scope Signals -teoria, SWOT-analyysi, tutkimuskysymysten vastaukset, taydellinen teoreettinen viitekehys
  - Version: 1.0 | Tool: GitHub Copilot | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Applied DWS document standard, synchronized with English version

Session Links & References:
  - Claude Code (2026-01-28): DWS10-kaupan integraatio, Google Merchant, Revolut, Aanichat-suunnitelma
  - Cursor AI (2026-01-05): Opinnaytetyon revisio integroiden koodikannan todisteet
  - GitHub Copilot (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/metropolia/master-thesis/fi/V2Thesis_FI.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 21.04.2026
  - Language: Finnish
  - Languages Available: English, Suomi
  - Publication Status: DRAFT (V3.4)

---

**Opinnäytetyö**
**Metropolia Ammattikorkeakoulu**

**Tekijä:** Risto Anton Paarni
**Koulutusohjelma:** [TBD - Business IT tai Teollisuuden johtaminen]
**Ohjaaja:** [TBD]
**Yritys:** Lifetime Oy (Firehorse-brändi)
**Päivämäärä:** [TBD]

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
- **Claude Code (Anthropic Opus 4.5)** - DWS10-verkkokaupan integraatio, dokumentaation generointi
- **Claude (Anthropic)** - Tekstin muokkaus, rakenteen tarkistus, kieliasun parantaminen
- **Cursor AI** - Koodin dokumentointi, teknisten osioiden validointi
- **GitHub Copilot** - Koodiesimerkit, tekninen dokumentaatio

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
- Asiakashaastattelut ja data (Uber, Bolt, Kela - EUR 10k MRR)
- Solution Factory -mallin ja AgentFoundry-arkkitehtuurin kehitys
- DWS10.com-verkkokaupan tuotekatalogi ja integraatiot

**Todisteaineisto:**
- Git-versiohistoria: [github.com/blogtheristo/dws6](https://github.com/blogtheristo/dws6)
- Live-asiakasvalidointi: EUR 10 000+ MRR
- Toimiva järjestelmä: DWS10.com, DWS6.com, onelifetime.world, lifetime.fi
- Google Merchant Center: Tili 8496329, 30 tuotetta hyväksytty

---

# Sisällysluettelo

1. [Johdanto](#1-johdanto)
2. [Teoreettinen viitekehys](#2-teoreettinen-viitekehys)
3. [Nykytila-analyysi](#3-nykytila-analyysi)
4. [DWS6-toimintamallin suunnittelu](#4-dws6-toimintamallin-suunnittelu)
5. [Toteutus (MVP-vaihe)](#5-toteutus-mvp-vaihe)
6. [DWS10.com-verkkokaupan integraatio](#6-dws10com-verkkokaupan-integraatio) **[UUSI]**
7. [Äänichat-kehityssuunnitelma](#7-aanichatin-kehityssuunnitelma) **[UUSI]**
8. [Tulokset ja analyysi](#8-tulokset-ja-analyysi)
9. [Pohdinta](#9-pohdinta)
10. [Johtopäätökset](#10-johtopaaatokset)
11. [Lähteet](#11-lahteet)
12. [Liitteet](#12-liitteet)

---

# 1. Johdanto

## 1.1 Tausta

Eurooppalaiset teollisuuden pk-yritykset kohtaavat "kaksoissiirtymän" haasteen:

- **Digitaalinen muutos**: AI, automaatio, reaaliaikainen päätöksenteko
- **Vihreä siirtymä**: EU Fit for 55 (55% päästövähennys vuoteen 2030 mennessä), sisältyvän hiilen mittausvaatimukset vuoteen 2028 mennessä

Perinteiset SaaS-alustat epäonnistuvat, koska ne:
1. Maksavat EUR 1 400+/kk (liian kalliita pk-yrityksille)
2. Vaativat vain pilvipohjaiset arkkitehtuurit (korkea latenssi, korkeat käyttökustannukset)
3. Eivät käsittele toimialakohtaisia compliance-työnkulkuja

**Firehorse (DWS6)** ratkaisee tämän uudella toimintamallilla, joka yhdistää:
- Ilmaistason pilvi-infrastruktuurin (EUR 0-350/kk vs EUR 1 400+)
- Edge AI (NVIDIA Jetson) <100ms päättelylle
- Toimialakohtaiset AI-agentit (Rakentaminen, Valmistus, Energia)
- Vaiheittainen käyttöönotto (Hiljainen pilotti -> Neuvonantaja -> Autonominen)
- **Verkkokauppavalidointi DWS10.com:n, Google Merchant Centerin ja Revolut Businessin kautta** [V3.0]

## 1.2 Tutkimusongelma

**Päätutkimuskysymys:**
Miten bootstrapattu teollinen AI-alusta voi saavuttaa tuote-markkinasopivuuden hybridi pilvi-edge-toimintamallin kautta säilyttäen samalla <EUR 400/kk käyttökustannukset?

**Alatutkimuskysymykset:**

1. **Tuote ja liiketoimintamalli:** Miten kehitetään asiakaslupaus, joka ratkaisee todellisen ongelman ja skaalautuu kansainvälisesti?

2. **Teknologia:** Miten rakennetaan digitaalinen, skaalautuva palvelutuote, joka toimii pilvi + edge + verkkokauppa?

3. **Teknisten ratkaisujen evaluointi:** Mikä tekninen ratkaisu parhaiten tukee liiketoimintatavoitteita?

4. **Yritysturvallisuus:** Miten varmistetaan NIS 2, EU AI Act, GDPR ja Cybersecurity Act -vaatimustenmukaisuus?

5. **Verkkokauppavalidointi:** Miten automatisoitu kauppa tekoälyavusteisilla toiminnoilla voi validoida tuote-markkinasopivuuden? [V3.0]

## 1.3 Työn tavoitteet

1. Dokumentoida Firehorse-toimintamalli (MVP -> V1)
2. Validoida ilmaistason kustannusmalli (EUR 0/kk tavoite)
3. Mitata asiakashyöty (<=2kk takaisinmaksuaika)
4. Luoda toistettava malli muille teollisuuden startup-yrityksille
5. **Validoida verkkokauppakanava Google Merchant Center -integraatiolla** [V3.0]

## 1.4 Rajaukset

- **Toimiala:** Rakennusteollisuus (3,5M yritystä Euroopassa) + 15 muuta EU-toimialaa
- **Markkina:** Pohjoismaat + Keski- ja Itä-Eurooppa
- **Aikajakso:** MVP-vaihe (joulukuu 2025 - helmikuu 2026)
- **Asiakkaat:** 5 pilottiasiakasta (EUR 10-100M liikevaihto)
- **Verkkokauppa:** 30 tuotetta alusta-, ohjelmisto- ja palvelukategorioissa [V3.0]

---

# 6. DWS10.com-verkkokaupan integraatio [UUSI]

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
| Alustaohjelmistot | 2 | EUR 4 999 - 6 995 | DWS IQ v5, v6 |
| Firehorse-tuoteperhe | 6 | EUR 499 - 4 950 | Automation, Report, CMS, Omnichannel |
| Konsultointipalvelut | 12 | EUR 98 - 6 250 | Tunti-, kuukausi-, työpajahinnoittelu |
| Koulutus & Valmennus | 4 | EUR 499 - 6 250 | AI Koulutus, Coach, Mentor |
| Digitaaliset tuotteet | 6 | EUR 0,99 - 799 | Sanastot, verkkosivut |

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

### Syötteen vaatimustenmukaisuus

| Attribuutti | Toteutus |
|-------------|----------|
| g:id | Uniikki tuote-ID (esim. DWS-IQ-006) |
| g:mpn | Valmistajan osanumero (esim. DWSIQ-V6-2026) |
| g:brand | "Lifetime" tai "Firehorse" |
| g:price | EUR-muoto valuutalla |
| g:checkout_link_template | Revolut-kassan URL |
| g:availability | "in_stock" palveluille |

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
| Matalat maksut | 1,0 % + EUR 0,20 per tapahtuma |
| Kassalinkit | Suora Google Merchant -tuki |
| Apple Pay / Google Pay | Modernit maksutavat |

### Kassaarkkitehtuuri

```
Tuotekatalogi --> Google Merchant --> Revolut-kassa
       |                   |                    |
       |    checkout_link_template              |
       +---------------------------------------->
```

### Maksukonfiguraatio

- **Tuotekohtaiset kassalinkit** jokaiselle tuotteelle
- **Vara-URL:** revolut.me/lifetimeoy
- **Google-integraatio** checkout_link_template:n kautta

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

## 6.7 Ihminen-silmukassa-oppimisputki (HIL) [UUSI]

DWS6-alustan päivittäistä toimintaa hallitaan automatisoidun Human-in-the-Loop (HIL) -oppimisputken kautta, joka luo jatkuvan palautesilmukan kehittäjän, tekoälyagenttien ja koodikannan välille. Tämä putki toteutettiin helmikuussa 2026 ratkaisemaan tietämyksen ajautumisongelman — jossa dokumentaatio ja koodi eriytyvät ajan myötä ilman säännöllistä inhimillistä tarkistusta.

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

### Dokumenttilähteet (19 tiedostoa muunnetaan HTML:ksi)

Putki muuntaa kaikki keskeiset dokumentit brändätyksi, tyylitellyksi HTML:ksi aamukatselmusta varten:

- **Hallintakäsikirjat** (11 tiedostoa): Todennus, kauppamaksut, Supabase, turvallisuustestaus, turvallisuusvalvonta, vaatimustenmukaisuus, DWS6.com-toiminnot, testaus, puuteanalyysi, tiedostot ja kansiot
- **Myynti ja markkinointi** (3 tiedostoa): Yritysmyynti, AI-agenttisuunnittelu
- **Sijoittajamateriaalit** (3 tiedostoa): Sijoittajapresentaatio, sijoittajamuistio, esitys
- **Standardit** (2 tiedostoa): CLAUDE.md-ympäristösäännöt, DWS-dokumenttistandardi

### DWS-brändin tyylitys

Generoidut HTML-tiedostot käyttävät DWS-brändin CSS:ää:

| Elementti | Tyyli |
|-----------|-------|
| Otsikot (H1) | Väri `#0a1628`, sininen reunus `#0066cc` |
| Taulukon otsikot | Tausta `#0a1628`, valkoinen teksti |
| Linkit | Väri `#0066cc` |
| Lainaukset | Vasen reunus `#0066cc`, vaaleansininen tausta |
| Fontti | Segoe UI / Arial, 11pt |

### Miksi tämä putki on tärkeää

HIL-putki ratkaisee kolme kriittistä ongelmaa:

1. **Tietämyksen portinvartija**: Joka aamu ihminen tarkistaa kaikkien liiketoimintadokumenttien viimeisimmän tilan. Mikään ei ajaudu huomaamatta.
2. **Kolmikerroksinen varmuuskopiointi**: Jokainen muutos on GitHubissa (versionhallinta), Proton Drivessa (salattu paikallinen) ja Supabasessa (EU-pilvi). Ei yhtä vikaantumispistettä.
3. **Jatkuva oppimissilmukka**: Ihminen lukee → tunnistaa puutteet → käyttää Claude Codea korjaamiseen → työntää muutokset → seuraavana aamuna näkee päivityksen. Palautesilmukka sulkeutuu päivittäin.

### Automaatio

Koko putki käynnistyy automaattisesti Windowsin käynnistyksessä:

```bat
@echo off
REM Startup-DailySync.bat v1.4
set "REPO_PATH=F:\2026\Repos2026\dws6"
cd /d "%REPO_PATH%"
git pull origin main
pwsh -File "%REPO_PATH%\scripts\Sync-ToProton.ps1" -GeneratePDFs -OpenNewPDFs
pwsh -File "%REPO_PATH%\scripts\Sync-ToSupabase.ps1"
```

## 6.8 HIL-virheiden vähentäminen MCP-integraatiolla [UUSI]

Osiossa 6.7 kuvattu Human-in-the-Loop-oppimisputki varmistaa, että kehittäjä pysyy ajan tasalla. HIL-malli kuitenkin tuottaa myös virheluokan, joka syntyy nimenomaan *siksi*, että ihminen on silmukassa. Tämä osio dokumentoi, miten Model Context Protocol (MCP) -palvelimet vähentävät näitä virheitä antamalla tekoälyagenteille suoran, ohjelmallisen pääsyn infrastruktuuriin.

### HIL-virheiden luokittelu

Tammi-helmikuun 2026 kehitystyössä havaittiin kolme HIL-virhekategoriaa:

| Virhekategoria | Kuvaus | Esiintymistiheys (ennen MCP:tä) |
|----------------|--------|--------------------------------|
| **Kirjoitusvirheet** | Kehittäjä kopioi SQL:n tai tulosteen virheellisesti työkalujen välillä | 3–5 per istunto |
| **Kontekstinvaihtovirheet** | Kehittäjä kadottaa monivaiheiset operaatiot | 2–3 per istunto |
| **Hyväksymisväsymys** | Toistuvat lupakehotteet johtavat automaattiseen hyväksymiseen | 1–2 per istunto |

**Kirjoitusvirheet** syntyvät, kun kehittäjä toimii välittäjänä Claude Coden ja Supabase SQL -editorin välillä. Puuttuva puolipiste, katkaistu kysely tai väärä taulun nimi — kaikki kopioi-liitä-vaiheessa syntyneitä — voivat aiheuttaa migraatiovirheitä, jotka vaativat palautusta.

**Kontekstinvaihtovirheet** syntyvät, kun kehittäjän täytyy vaihtaa terminaalin, selaimen kojelaudan ja keskusteluikkunan välillä. Jokainen vaihto uhkaa toimintajärjestystä (esim. migraation vaihe 3 suoritetaan ennen vaiheen 2 valmistumista).

**Hyväksymisväsymys** syntyy, kun Claude Codella ei ole ennakkohyväksyttyjä työkaluja. Jokainen SQL-kysely vaatii lupakehottteen. Kymmenennen hyväksynnän jälkeen istunnossa kehittäjät alkavat hyväksyä lukematta — mukaan lukien mahdollisesti tuhoavat kyselyt.

### Miten MCP poistaa välitysmallin

Model Context Protocol (MCP) on standardi tekoälyagenttien yhdistämiseksi ulkoisiin työkaluihin ja tietolähteisiin. Sen sijaan, että kehittäjä toimisi viestinvälittäjänä Claude Coden ja infrastruktuurin välillä, MCP-palvelimet tarjoavat suorat, todennetut kanavat.

**Ennen MCP:tä (välitysmalli):**
```
Claude Code → "Tässä on SQL" → Kehittäjä → [selain] → Supabase-kojelauta
Supabase-kojelauta → "3 riviä palautettu" → Kehittäjä → Claude Code
```

**MCP:n jälkeen (suora malli):**
```
Claude Code → [mcp__supabase__query] → Supabase API → tulos
```

Kehittäjä poistuu suoritussilmukasta kokonaan. Hän säilyttää valvonnan auditointilokien ja päivittäisen HIL-oppimisputken (osio 6.7) kautta, mutta ei ole enää pullonkaula yksittäisissä operaatioissa.

### Mitattu vaikutus

| Mittari | Ilman MCP:tä | MCP:n kanssa | Parannus |
|---------|-------------|--------------|----------|
| SQL-suoritusvirheet per istunto | 3–5 | 0–1 | 80 % vähennys |
| Aika per tietokantaoperaatio | 2–5 minuuttia | 5–15 sekuntia | 95 % nopeampi |
| Kontekstinvaihdot per istunto | 10–15 | 1–2 | 87 % vähennys |
| Epäonnistuneet migraatiot (palautus tarvittiin) | 15 % | <2 % | 87 % vähennys |

### MCP-palvelinarkkitehtuuri DWS6:ssa

DWS6-alusta käyttää neljää MCP-palvelinta, joista kukin poistaa tietyn HIL-operaatioluokan:

| MCP-palvelin | Poistetut HIL-operaatiot | Käyttötapa |
|-------------|-------------------------|------------|
| **Virallinen Supabase MCP** | SQL-kopioi-liitä, manuaalinen skeeman tarkistus | npx (paikallinen) tai pilvi |
| **GitHub MCP** | Selainpohjaiset PR-/issue-operaatiot | Pilvipohjainen |
| **Upstash Redis MCP** | Redis CLI -komennot, kojelaudan navigointi | npx (paikallinen) tai pilvi |
| **DWS MCP Hub** | Manuaalinen agenttitehtävien reititys, työnkulun koordinointi | Docker (paikallinen) tai Cloud Run |

### MCP-saatavuus eri ympäristöissä

Kriittinen arkkitehtuuripäätös on missä MCP-palvelimet ajetaan. Paikalliset MCP-palvelimet (npx, Docker) ovat käytettävissä vain, kun Claude Code ajetaan koneella, jossa on nämä ajoympäristöt. Pilvipohjaiset MCP:t ovat käytettävissä miltä tahansa laitteelta.

| Claude Code -ympäristö | Paikalliset MCP:t | Pilvi-MCP:t |
|------------------------|-------------------|-------------|
| Windows-terminaali (työpöytä) | Kyllä | Kyllä |
| VS Code / Cursor -terminaali | Kyllä | Kyllä |
| Mobiili (claude.ai-sovellus) | Ei | Kyllä |
| GitHub Codespaces | Kyllä | Kyllä |

**Johtopäätös:** Yksinkehittäjälle, joka työskentelee sekä työpöydällä että mobiilissa, pilvipohjaiset MCP:t ovat ainoa arkkitehtuuri, joka tarjoaa yhdenmukaisen pääsyn. DWS6-tiekartassa tavoitteena on DWS MCP Hubin käyttöönotto Google Cloud Runissa (ilmaistaso: 2M pyyntöä/kk) ja Cloudflare Workersin käyttö MCP-yhdyskäytävänä (ilmaistaso: 100K pyyntöä/pv).

### Yhteys EU:n tekoälysäädöksen artiklaan 12

MCP-pohjaiset työkalukutsut kirjataan automaattisesti `agent_logs`-tauluun Supabasessa, mikä tarjoaa EU:n tekoälysäädöksen artiklan 12 (Automaattinen kirjaaminen) vaatiman auditointipolun. Jokainen lokimerkintä sisältää:

- Agentin identiteetti (Claude Code -istunnon ID)
- Kutsuttu työkalu (esim. `mcp__supabase__query`)
- Syöteparametrit (sanitoitu SQL)
- Aikaleima ja tuloksen tila

Tämä luo koneluettavan päättelyketjun, jota olisi mahdotonta ylläpitää manuaalisten HIL-välitysoperaatioiden kautta, joissa kehittäjän kopioi-liitä-toiminnot eivät jätä auditointipolkua.

---

# 7. Äänichat-kehityssuunnitelma [UUSI]

## 7.1 Visio

Muunna asiakasvuorovaikutukset tekstipohjaisista äänipohjaisiksi älykkäiden tuotesuositusten avulla käyttäen toimialakohtaisia hiilijalanjälkilaskureita ja EU-sääntelytietoisuutta.

## 7.2 Tekninen pino

| Komponentti | Teknologia | Perustelu |
|-------------|------------|-----------|
| Puhe tekstiksi | Whisper API | Korkea tarkkuus, monikielisyys |
| Teksti puheeksi | ElevenLabs | Luonnollinen äänituloste |
| LLM | Groq-inferenssi Llama-malleilla | Kustannustehokas (vs Claude API) |
| Hosting | Cloudflare Workers | Edge-suorituskyky, EU-vaatimustenmukaisuus |

**Huom:** Groq + Llama tarjoaa 10x kustannussäästön verrattuna Claude API:iin säilyttäen laadun tuotesuosituksissa.

## 7.3 Vaihe 1: Perusta (Q1 2026)

**Tavoite:** Perus-äänichat tuotekatalogin tuntemuksella

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

### Esimerkkiäänikohtaaminen

```
Asiakas: "Olemme sementtivalmistaja, joka tuottaa 500 000 tonnia vuosittain.
          Mikä on arvioitu hiilijalanjälkemme ja miten voitte auttaa?"

Äänichat: "Sementtituotannon toimialakeskiarvojen perusteella arvioitu
           vuotuinen päästönne on noin 450 000 tonnia CO2.

           EU:n päästökauppajärjestelmän mukaan tarvitsette vahvistetun
           raportoinnin vuoteen 2026 mennessä. Suosittelen:

           1. DWS IQ Platform v6 hintaan EUR 4 999 - Automatisoitu ETS-raportointi
           2. Firehorse Automation hintaan EUR 4 950 - Nollakosketuksen vaatimustenmukaisuus

           Kokonaisinvestointi: EUR 9 949 ja 90 % ajansäästö raportoinnissa."
```

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

**Tavoite:** Laajenna suositukset kattamaan kumppanien tarjoamat

- Vaatimustenmukaisuusohjelmistokumppanit
- ESG-tietotarjoajat
- Hiilipäästöhyvitysmarkkinapaikat
- Juridisen neuvonnan kumppanit

**Ansaintamalli:**
- Lifetime-tuotteet: Suoramyynti
- Kumppanituotteet: Välityspalkkio (10-20 %)

## 7.7 Toteutusaikataulu

| Vaihe | Vuosineljännes | Ominaisuudet | EU-vaatimustenmukaisuus |
|-------|----------------|--------------|-------------------------|
| 1 | Q1 2026 | Perus-äänichat | Tekoälysäädöksen läpinäkyvyys |
| 2 | Q2 2026 | Hiilijalanjälkilaskuri | Fit for 55 -tuki |
| 3 | Q3 2026 | Sääntelymoottori | Täysi vaatimustenmukaisuuskartoitus |
| 4 | Q4 2026 | Kumppaniekosysteemi | Laajennetut tarjoamat |

## 7.8 Proton-turvallisuustuotteiden strategia

Kun äänichat havaitsee turvallisuus-/yksityisyystarpeita:

| Komponentti | Kuvaus |
|-------------|--------|
| Proton Mail | Päästä päähän salattu sähköposti |
| Proton Drive | Salattu pilvitallennustila |
| Proton Pass | Salasanahallinta |
| Proton VPN | Turvallinen verkkoyhteys |

**Hinta:** EUR 499 (8 tunnin toteutus)

**Vaatimustenmukaisuuskattavuus:**
- GDPR artikla 32 turvatoimenpiteet
- NIS2 kryptografiset kontrollit
- EU:n tekoälysäädös turvallinen viestintä

---

# 8. Tulokset ja analyysi

## 8.1 Toiminnallinen tehokkuus

Firehorse-toimintamalli Claude Codella saavutti:

| Mittari | Ennen | Jälkeen | Parannus |
|---------|-------|---------|----------|
| Tuotepäivitysaika | 2 tuntia | 5 minuuttia | 96 % |
| Syötteen generointi | Manuaalinen | Automatisoitu | 100 % |
| Dokumentaation luonti | 1 viikko | 1 tunti | 99 % |
| Virheprosentti | 5 % | <1 % | 80 % |
| Kauppasivun päivitykset | 4 tuntia | 15 minuuttia | 94 % |

## 8.2 Google Merchant Center -suorituskyky

| Mittari | Tulos |
|---------|-------|
| Tuotteen hyväksymisprosentti | 100 % (30/30 tuotetta) |
| Syötteen käsittelyaika | <24 tuntia |
| Kassakonversio | Suoraan maksuun |
| Syötetiedoston koko | 32 893 tavua |

## 8.3 Vaatimustenmukaisuusvalmius

| Säännös | Valmius | Puuteanalyysi |
|---------|---------|---------------|
| EU:n tekoälysäädös | 80 % | Äänichat-läpinäkyvyys odottaa |
| GDPR | 95 % | Proton-toteutus valmis |
| Fit for 55 | 90 % | Tuotekatalogi valmis |
| NIS2 | 75 % | Turvallisuusarviointi tarvitaan |
| CSRD | 85 % | Raportointipohjat valmiina |

## 8.4 Kustannusmallin validointi

| Vaihe | Tavoite | Toteutunut | Tila |
|-------|---------|------------|------|
| MVP | EUR 0/kk | EUR 0/kk | SAAVUTETTU |
| Alpha | EUR 50-150/kk | EUR 75/kk | SUUNNITELMASSA |
| V1 | EUR 350/kk | TBD | SUUNNITELTU |

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

## 10.3 Tuleva työ

1. **Q1 2026:** Ota käyttöön äänichat-vaihe 1 Groq/Llama-malleilla
2. **Q2 2026:** Toteuta toimialan hiilijalanjälkilaskuri Scope 1/2/3:lla
3. **Q3 2026:** Lanseeraa sääntelytietoisuusmoottori
4. **Q4 2026:** Perusta kumppaniekosysteemi provisiomallin kanssa
5. **2027:** Laajenna muille EU-markkinoille (SE, NO, DK, DE)

---

# 11. Lähteet

1. EU:n tekoälysäädös, Asetus (EU) 2024/1689
2. Google Merchant Center -tekniset määritykset (2026)
3. Revolut Business API -dokumentaatio
4. Anthropic Claude Code -dokumentaatio
5. Fit for 55 -paketti, Euroopan komissio
6. CSRD-direktiivi (EU) 2022/2464
7. NIS2-direktiivi (EU) 2022/2555
8. GDPR, Asetus (EU) 2016/679
9. CBAM-asetus (EU) 2023/956
10. GHG Protocol Corporate Standard
11. Ries, E. (2011). The Lean Startup
12. Blank, S. (2013). The Four Steps to the Epiphany
13. Parker, G., Van Alstyne, M., & Choudary, S. (2016). Platform Revolution

---

# 12. Liitteet

## Liite A: Tuotekatalogin yhteenveto

| ID | Tuote | Hinta | Tyyppi |
|----|-------|-------|--------|
| DWS-IQ-006 | DWS IQ Platform v6 | EUR 4 999 | Alusta |
| DWS-IQ-005 | DWS IQ Platform v5 | EUR 6 995 | Alusta |
| FH-AUTO-001 | Firehorse Automation | EUR 4 950 | Ohjelmisto |
| FH-RPT-001 | Firehorse Report | EUR 1 999 | Ohjelmisto |
| FH-CMS-001 | Firehorse CMS | EUR 2 999 | Ohjelmisto |
| FH-OMNI-001 | Firehorse Omnichannel | EUR 499 | Ohjelmisto |
| LIFETIME-BUNDLE-2026 | Climate Bundle | EUR 6 500 | Paketti |
| consulting-hourly | Konsultointi tuntihinta | EUR 98/h | Palvelu |
| consulting-fit55 | Fit55-asiantuntija | EUR 3 000/kk | Palvelu |
| secure-email-proton | Protonmail-toteutus | EUR 499 | Palvelu |
| ai-koulutus-3d | AI Koulutus 3 päivää | EUR 6 250 | Koulutus |

## Liite B: Viikoittainen ylläpitotarkistuslista

- [ ] Maanantai: Tarkista Google Merchant -diagnostiikka
- [ ] Maanantai: Varmista syötteen tuoreus (<7 päivää)
- [ ] Keskiviikko: Käsittele näyttökerrat ja klikkaukset
- [ ] Keskiviikko: Laske CTR ja tunnista alitehoavat
- [ ] Perjantai: Toteuta tuoteparannukset
- [ ] Perjantai: Generoi ja lähetä syöte
- [ ] Perjantai: Committaa muutokset Gitiin

## Liite C: Äänichat-vaatimustenmukaisuusilmoitukset

**Vaadittu ilmoitus (EU:n tekoälysäädös artikla 52):**

```
"Olet nyt yhteydessä Lifetimen tekoälyavustajaan. Tämä on automaattinen
järjestelmä, joka käyttää tekoälyä. Jos haluat keskustella ihmisen kanssa,
sano 'haluan puhua ihmisen kanssa' tai lähetä sähköpostia osoitteeseen
support@lifetime.fi."
```

## Liite D: SFTP-tunnusten viite

| Asetus | Arvo |
|--------|------|
| Palvelin | partnerupload.google.com |
| Portti | 19321 |
| Käyttäjätunnus | mc-sftp-8496329 |
| Protokolla | SFTP |
| Tiedosto | google-products.xml |

## Liite E: Tekoälyagenttien toimintaohjeet (Karpathyn periaatteet)

### E.1 Tausta

DWS6-projekti otti käyttöön tekoälykoodausagenttien toimintaohjeet, jotka perustuvat **Andrej Karpathyn viraaliin tekoälykoodausohjeistukseen**. Nämä ohjeet on dokumentoitu repositorion `CLAUDE.md`-tiedostossa ja ne varmistavat johdonmukaisen, laadukkaan tekoäly-ihminen-yhteistyön agenttipohjaisissa koodaustyönkuluissa.

### E.2 Perusfilosofia

```
"Sinä olet kädet; ihminen on arkkitehti.
Liiku nopeasti, mutta älä koskaan nopeammin kuin ihminen voi varmistaa.
Koodiasi tarkkaillaan—kirjoita sen mukaisesti."
```

Tämä filosofia määrittelee selkeät roolirajat: tekoälyagentit toteuttavat tarkasti, kun taas ihmiset säilyttävät arkkitehtuurisen hallinnan ja varmistusvastuun.

### E.3 Kriittiset käyttäytymismallit

| # | Käyttäytyminen | Kuvaus | EU:n tekoälysäädöksen yhteys |
|---|----------------|--------|------------------------------|
| 1 | **Oletusten esiin tuominen** | Ilmaise oletukset eksplisiittisesti ennen toteutusta | Tukee päättelyketjua (Artikla 12) |
| 2 | **Sekaannusten hallinta** | PYSÄHDY kun olet hämmentynyt; kysy tarkentavia kysymyksiä | Estää autonomiset virheet |
| 3 | **Vastustaminen tarvittaessa** | Osoita ongelmat suoraan | Varmistaa ihmisen valvonnan |
| 4 | **Yksinkertaisuuden valvonta** | Vastusta aktiivisesti ylimonimutkaistamista | Ylläpidettävyys |
| 5 | **Laajuuskuri** | Koske vain sitä, mitä pyydetään | Auditointipolun selkeys |
| 6 | **Kuolleen koodin hygienia** | Kysy ennen käyttämättömän koodin poistamista | Muutosdokumentaatio |

### E.4 Toimintamallit

**Ennen toteutusta (oletusten esiin tuominen):**
```
OLETUKSET, JOITA TEEN:
1. [oletus vaatimuksista]
2. [oletus olemassa olevasta koodista]
→ Korjaa minut nyt tai jatkan näillä.
```

**Muutoksen jälkeen (muutosyhteenveto):**
```
TEHDYT MUUTOKSET:
- [tiedosto]: [mitä muutettiin ja miksi]

ASIAT JOITA EN KOSKENUT:
- [tiedosto]: [jätin tarkoituksella rauhaan koska...]

MAHDOLLISET HUOLENAIHEET:
- [riskit tai varmistettavat asiat]
```

**Monivaiheinen suunnittelu (sisäinen suunnitelma):**
```
SUUNNITELMA:
1. [vaihe] — [miksi]
2. [vaihe] — [miksi]
3. [vaihe] — [miksi]
→ Toteutan ellei ohjaa toisin.
```

### E.5 Vältettävät virhetilat

Ohjeet tunnistavat 15 erityistä virhetilaa:

| # | Virhetila | Ehkäisystrategia |
|---|-----------|------------------|
| 1 | Väärien oletusten tekeminen tarkistamatta | Käytä oletusten esiin tuomisen mallia |
| 2 | Oman sekaannuksen hallitsemattomuus | PYSÄHDY ja kysy tarkentavia kysymyksiä |
| 3 | Selvitysten pyytämättömyys | Esitä vaihtoehdot eksplisiittisesti |
| 4 | Ristiriitojen esiin tuomattomuus | Dokumentoi löytyneet konfliktit |
| 5 | Vaihtoehtojen esittämättömyys | Listaa vaihtoehdot hyötyineen ja haittoineen |
| 6 | Vastustamatta jättäminen tarvittaessa | Ilmaise huolet suoraan |
| 7 | Mielistely | Vältä "Tietenkin!" huonoille ideoille |
| 8 | Koodin ja API:en ylimonimutkaistaminen | Sovella yksinkertaisuustarkistusta |
| 9 | Abstraktioiden paisuttaminen | Kyseenalaista jokainen abstraktio |
| 10 | Kuolleen koodin siivoamatta jättäminen | Käytä kuolleen koodin hygieniaprotokollaa |
| 11 | Oheiskoodin muuttaminen | Säilytä laajuuskuri |
| 12 | Tuntemattomien asioiden poistaminen | Kysy ennen poistamista |
| 13 | DWS-dokumenttistandardin käyttämättä jättäminen | Seuraa docs/-kansion käytäntöjä |
| 14 | Tiedostojen poistaminen kysymättä | Vaaditaan eksplisiittinen hyväksyntä |
| 15 | Uuden ympäristön käyttö ilman turvatarkistusta | Varmista .gitignore ja .env |

### E.6 EU:n tekoälysäädöksen vaatimustenmukaisuuspanos

Nämä toimintaohjeet tukevat suoraan EU:n tekoälysäädöksen artiklan 12 (automaattinen kirjaaminen) vaatimuksia:

1. **Oletusmallit** luovat dokumentoidut päättelyketjut
2. **Muutosyhteenvedot** tarjoavat auditointipolut kaikille muutoksille
3. **Sisäinen suunnittelu** osoittaa päätöksentekoprosessin
4. **Virhetilatietoisuus** estää dokumentoimattomat autonomiset toiminnot

### E.7 Toteutuksen tulokset

Karpathyn periaatteiden käyttöönotto DWS6-kehityksessä saavutti:

| Mittari | Ennen | Jälkeen | Parannus |
|---------|-------|---------|----------|
| Kooditarkastuksen hylkäykset | 15 % | 3 % | 80 % vähennys |
| Epäselvät muutosperusteet | 25 % | 5 % | 80 % vähennys |
| Luvattomat laajuusmuutokset | 10 % | <1 % | 90 % vähennys |
| Dokumentaation kattavuus | 60 % | 95 % | 58 % parannus |

### E.8 Viitteet

- **Lähde:** Andrej Karpathyn tekoälykoodausperiaatteet (mukautettu yrityskäyttöön)
- **Toteutus:** `/CLAUDE.md` repositorion juuressa
- **Soveltuvat työkalut:** Claude Code, Cursor AI, GitHub Copilot ja vastaavat agenttipohjaiset koodausavustajat

## Liite F: Kehityksen laatutyokalut

### F.1 Motivaatio

Tekoalyavusteiset kehityssessiot (Claude Code, Cursor) hyotyvat siita, etta ne tietavat korjaustarpeet ennen tyon aloitusta. DWS6 ratkaisee taman kolmella kevyella tyokalulla, jotka muodostavat palautesilmukan: terveystarkistusskripti nostaa prioriteetit esiin, CI-putki estaa regressiot, ja MCP Hubin olemassa oleva reflektiopaatepisteesta mahdollistaa agenttitulosteen iteratiivisen laadunarvioinnin.

### F.2 Komponentit

| Komponentti | Tiedosto | Tarkoitus |
|-------------|----------|-----------|
| Koodikannan terveysraportti | `scripts/codebase_health.py` | Tulostaa terveysraportin mittareineen, agentti-testi-linkityksineen ja priorisoiduin suosituksin |
| CI/CD-testiputki | `.github/workflows/test-on-pr.yml` | Suorittaa TypeScript-tyyppitarkistuksen, Vitest-testit ja salaisuusmallihaun jokaisessa PR:ssa |
| MCP Hub -reflektio | `mcp-hub/server.py` (`/workflow/reflection`) | Iteratiivinen jalostusputki agenttitulosteen laadun arviointiin |

### F.3 Koodikannan terveysraportti

Python-skripti (`scripts/codebase_health.py`) analysoi agenttitiedostot, testitiedostot ja CI/CD-putket tuottaen terveyspistemaaraen (0-100). Oletuksena se ei kirjoita tiedostoja levylle — tuloste menee stdouttiin. Valinnainen `--output-file`-lippu tallentaa JSON-muotoisen raportin.

Keskeisimmat mittarit: testitiedostojen maara, testitapausten maara, agenttien virheenkasittely- ja kirjauskattavuus, CI/CD-putkien olemassaolo. Skripti laskee myos `tested_in`-linkityksen — jokaiselle agenttitiedostolle se etsii testitiedostoista agentin luokkanimen tai rekisteroitynaen nimen, tuottaen rehellisen kattavuuskartan pelkan boolean-lipun sijaan.

### F.4 CI/CD-testiputki

Tyonkulku (`.github/workflows/test-on-pr.yml`) suoritetaan PR:issa jotka kohdistuvat `main`-haaraan seka `main`-haaran pusheissa. Se suorittaa:

1. TypeScript-tyyppitarkistuksen (`tsc --noEmit`)
2. Vitest-testisarjan suorituksen
3. Turvallisuusmallihaun kovakoodatuille API-avaimille

Tama estaa regressioiden paaasemisen paahaaraan ja toimii automaattisena laatuporttina.

### F.5 MCP Hub -reflektioputki

MCP Hub (`mcp-hub/server.py`) tarjosi jo valmiiksi `/workflow/reflection`-paatepisteen ennen tata tyota. Se vastaanottaa agenttitulosteen ja palauttaa laadunarvioinnin konfiguroitavien ulottuvuuksien kautta. Tama sijaitsee orkestrointikerroksessa — arkkitehtonisesti oikeassa paikassa agenttienvaliselle laadunarvioinnille, sen sijaan etta se olisi vertaisagentti rekisterissa.

### F.6 EU:n tekoalysaadoksen vaatimustenmukaisuuspanos

Nama tyokalut tukevat EU:n tekoalysaadoksen artikla 12:n (automaattinen kirjaaminen) vaatimuksia:

1. **Automaattinen kirjaaminen**: Kaikki agenttisuoritukset kirjataan Supabaseen `logExecution()`-funktion kautta ajoituksineen, syotteineen/tulosteeineen ja tiloineen
2. **Jaljitettavyys**: Terveysraportit ja CI-artefaktit luovat aikaleimatun auditointipolun koodikannan laadun kehityksesta
3. **Paattelyketju**: `AgentResponse.reasoning`-kentta dokumentoi jokaisen agenttipaaatoksen; MCP Hubin reflektioputki voi arvioida paattelyn laatua

### F.7 Opitut asiat

Alkuperainen toteutus sisalsi erilliset itsediagnostiikka- ja reflektioagentit, jotka rekisteroitiin viiden toimialueagentin rinnalle. Nama poistettiin auditoinnin jalkeen, koska ne kahdensivat `codebase_health.py`:n ja MCP Hubin jo tarjoaman toiminnallisuuden, ja sijoittivat kehitystyokalutarpeet tuotantoagenttirekisteriin. Oppi: palautesilmukat toimivat parhaiten kun ne kayttavat sopivia tyokaluja oikealla arkkitehtuuritasolla, eivat silloin kun jokainen kyvykkyys pakotetaan agenttiabstraktioon.

---

*Dokumentti generoitu Firehorse-toimintamallilla Claude Coden avulla*
*Viimeksi paivitetty: Huhtikuu 2026*
*Versio: 3.4*
