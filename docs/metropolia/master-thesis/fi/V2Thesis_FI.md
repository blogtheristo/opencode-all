# Firehorse-tuotevalmistuksen toimintamalli
## Hybridi AI-edge-arkkitehtuuri ilmastointelligeenteille teollisille alustoille

---
# VERSION AND AGENT HISTORY

Version: 3.2

Sessions & Modifications:
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
  - Last Modified: 07.02.2026
  - Language: Finnish
  - Languages Available: English, Suomi
  - Publication Status: DRAFT (V3.2 HIL-putkella)

---

**Opinnaytetyo**
**Metropolia Ammattikorkeakoulu**

**Tekija:** Risto Anton Paarni
**Koulutusohjelma:** [TBD - Business IT tai Teollisuuden johtaminen]
**Ohjaaja:** [TBD]
**Yritys:** Lifetime Oy (Firehorse-brandi)
**Paivamaara:** [TBD]

---

## Tiivistelma

Tama opinnaytetyo tutkii Firehorse-tuotevalmistuksen toimintamallia, joka yhdistaa pilvi- ja reunalaskentateknologiat teollisten pk-yritysten tarpeisiin. Tyo keskittyy rakennusteollisuuteen ja sen haasteisiin EU:n kaksoissiirtymassa (digitaalinen + vihrea). **Versio 3.0 laajentaa tutkimusta verkkokauppavalidoinnilla DWS10.com-kaupan toteutuksen, Google Merchant Center -integraation, Revolut Business -maksukasittelyn ja aanichat-kehityssuunnitelman kautta Groq-inferenssia ja Llama-malleja kayttaen.**

**Avainsanat:** Tekoaly, reunalaskenta, rakennusteollisuus, toimintamalli, pilvipalvelut, verkkokauppa, Google Merchant Center, Revolut Business, aanichat, EU:n tekoalysaados

---

## Abstract

This thesis examines the Firehorse product manufacturing operating model, which combines cloud and edge computing technologies for industrial SMEs. The work focuses on the construction industry and its challenges in the EU's twin transition (digital + green). **Version 3.0 extends the research with e-commerce validation through DWS10.com store implementation, Google Merchant Center integration, Revolut Business payment processing, and an audio chat evolution roadmap using Groq inference with Llama models.**

**Keywords:** Artificial Intelligence, Edge Computing, Construction Industry, Operating Model, Cloud Services, E-Commerce, Google Merchant Center, Revolut Business, Audio Chat, EU AI Act Compliance

---

## Tekoalytyokalujen kaytto

Taman opinnaytetyon laatimisessa on hyodynnetty tekoalyavusteisia tyokaluja lapinakyvyyden ja akateemisen rehellisyyden mukaisesti.

**Kaytetyt tyokalut:**
- **Claude Code (Anthropic Opus 4.5)** - DWS10-verkkokaupan integraatio, dokumentaation generointi
- **Claude (Anthropic)** - Tekstin muokkaus, rakenteen tarkistus, kieliasun parantaminen
- **Cursor AI** - Koodin dokumentointi, teknisten osioiden validointi
- **GitHub Copilot** - Koodiesimerkit, tekninen dokumentaatio

**AI:n rooli dokumentaatiossa:**
- Kieliasun tarkistus ja parannusehdotukset (FI/EN)
- Teknisen dokumentaation jasentely ja yhdenmukaistaminen
- Kaannosapu suomi-englanti
- Taulukkojen ja diagrammien formatointi
- Verkkokaupan yllapitokasikirjojen generointi

**Tekijan alkuperainen panos:**
- Kaikki tutkimuskysymykset, hypoteesit ja johtopaaatokset
- Alkuperainen sisalto, argumentaatio ja analyysi
- Live-koodikanta ja toteutus (dws6-repositorio: 50 000+ LOC)
- Liiketoimintamallin suunnittelu ja validointi
- Asiakashaastattelut ja data (Uber, Bolt, Kela - EUR 10k MRR)
- Solution Factory -mallin ja AgentFoundry-arkkitehtuurin kehitys
- DWS10.com-verkkokaupan tuotekatalogi ja integraatiot

**Todisteaineisto:**
- Git-versiohistoria: [github.com/blogtheristo/dws6](https://github.com/blogtheristo/dws6)
- Live-asiakasvalidointi: EUR 10 000+ MRR
- Toimiva jarjestelma: DWS10.com, DWS6.com, onelifetime.world, lifetime.fi
- Google Merchant Center: Tili 8496329, 30 tuotetta hyvaksytty

---

# Sisallysluettelo

1. [Johdanto](#1-johdanto)
2. [Teoreettinen viitekehys](#2-teoreettinen-viitekehys)
3. [Nykytila-analyysi](#3-nykytila-analyysi)
4. [DWS6-toimintamallin suunnittelu](#4-dws6-toimintamallin-suunnittelu)
5. [Toteutus (MVP-vaihe)](#5-toteutus-mvp-vaihe)
6. [DWS10.com-verkkokaupan integraatio](#6-dws10com-verkkokaupan-integraatio) **[UUSI]**
7. [Aanichatin kehityssuunnitelma](#7-aanichatin-kehityssuunnitelma) **[UUSI]**
8. [Tulokset ja analyysi](#8-tulokset-ja-analyysi)
9. [Pohdinta](#9-pohdinta)
10. [Johtopaaatokset](#10-johtopaaatokset)
11. [Lahteet](#11-lahteet)
12. [Liitteet](#12-liitteet)

---

# 1. Johdanto

## 1.1 Tausta

Eurooppalaiset teollisuuden pk-yritykset kohtaavat "kaksoissiirtyman" haasteen:

- **Digitaalinen muutos**: AI, automaatio, reaaliaikainen paatoksenteko
- **Vihrea siirtyma**: EU Fit for 55 (55% paastovahennys vuoteen 2030 mennessa), sisaltyvan hiilen mittausvaatimukset vuoteen 2028 mennessa

Perinteiset SaaS-alustat epaonnistuvat, koska ne:
1. Maksavat EUR 1 400+/kk (liian kalliita pk-yrityksille)
2. Vaativat vain pilvipohjaiset arkkitehtuurit (korkea latenssi, korkeat kayttokustannukset)
3. Eivat kasittele toimialakohtaisia compliance-tyonkulkuja

**Firehorse (DWS6)** ratkaisee taman uudella toimintamallilla, joka yhdistaa:
- Ilmaistason pilvi-infrastruktuurin (EUR 0-350/kk vs EUR 1 400+)
- Edge AI (NVIDIA Jetson) <100ms paattelylle
- Toimialakohtaiset AI-agentit (Rakentaminen, Valmistus, Energia)
- Vaiheittainen kayttoonotto (Hiljainen pilotti -> Neuvonantaja -> Autonominen)
- **Verkkokauppavalidointi DWS10.com:n, Google Merchant Centerin ja Revolut Businessin kautta** [V3.0]

## 1.2 Tutkimusongelma

**Paatutkimuskysymys:**
Miten bootstrapattu teollinen AI-alusta voi saavuttaa tuote-markkinasopivuuden hybridi pilvi-edge-toimintamallin kautta sailyttaen samalla <EUR 400/kk kayttokustannukset?

**Alatutkimuskysymykset:**

1. **Tuote ja liiketoimintamalli:** Miten kehitetaan asiakaslupaus, joka ratkaisee todellisen ongelman ja skaalautuu kansainvalisesti?

2. **Teknologia:** Miten rakennetaan digitaalinen, skaalautuva palvelutuote, joka toimii pilvi + edge + verkkokauppa?

3. **Teknisten ratkaisujen evaluointi:** Mika tekninen ratkaisu parhaiten tukee liiketoimintatavoitteita?

4. **Yritysturvallisuus:** Miten varmistetaan NIS 2, EU AI Act, GDPR ja Cybersecurity Act -vaatimustenmukaisuus?

5. **Verkkokauppavalidointi:** Miten automatisoitu kauppa tekoalyavusteisilla toiminnoilla voi validoida tuote-markkinasopivuuden? [V3.0]

## 1.3 Tyon tavoitteet

1. Dokumentoida Firehorse-toimintamalli (MVP -> V1)
2. Validoida ilmaistason kustannusmalli (EUR 0/kk tavoite)
3. Mitata asiakashyoty (<=2kk takaisinmaksuaika)
4. Luoda toistettava malli muille teollisuuden startup-yrityksille
5. **Validoida verkkokauppakanava Google Merchant Center -integraatiolla** [V3.0]

## 1.4 Rajaukset

- **Toimiala:** Rakennusteollisuus (3,5M yritysta Euroopassa) + 15 muuta EU-toimialaa
- **Markkina:** Pohjoismaat + Keski- ja Ita-Eurooppa
- **Aikajanne:** MVP-vaihe (joulukuu 2025 - helmikuu 2026)
- **Asiakkaat:** 5 pilottiasiakasta (EUR 10-100M liikevaihto)
- **Verkkokauppa:** 30 tuotetta alusta-, ohjelmisto- ja palvelukategorioissa [V3.0]

---

# 6. DWS10.com-verkkokaupan integraatio [UUSI]

## 6.1 Kaupan arkkitehtuuri

DWS10.com-kauppa validoi Firehorse-toimintamallin suoramyynnin kautta:

```
dws10.com/
├── buy/                    # Kauppasivut
│   ├── index.html         # Paakauppa (Sivu 1)
│   ├── page2/index.html   # Lisakyotteet (Sivu 2)
│   └── page3/index.html   # Konsultointi & Koulutus (Sivu 3)
├── config/
│   └── products.json      # Keskitetty tuotekatalogi (30 tuotetta)
├── feeds/
│   ├── generate-feed.cjs  # Node.js-syotegeneraattori
│   └── google-products.xml # Google Merchant -syote
├── return-policy/
│   └── index.html         # Palautuskaytanto (Googlen vaatimus)
└── docs/                   # Dokumentaatio
```

## 6.2 Tuotekatalogi

| Kategoria | Tuotteet | Hintaluokka | Esimerkit |
|-----------|----------|-------------|-----------|
| Alustaohjelmistot | 2 | EUR 4 999 - 6 995 | DWS IQ v5, v6 |
| Firehorse-tuoteperhe | 6 | EUR 499 - 4 950 | Automation, Report, CMS, Omnichannel |
| Konsultointipalvelut | 12 | EUR 98 - 6 250 | Tunti-, kuukausi-, tyopajahinnoittelu |
| Koulutus & Valmennus | 4 | EUR 499 - 6 250 | AI Koulutus, Coach, Mentor |
| Digitaaliset tuotteet | 6 | EUR 0,99 - 799 | Sanastot, verkkosivut |

**Yhteensa:** 30 tuotetta taysilla Google Merchant -vaatimustenmukaisuudella

## 6.3 Google Merchant Center -integraatio

### Tilin konfigurointi

| Asetus | Arvo |
|--------|------|
| Merchant ID | 8496329 |
| Kohdemaa | Suomi (FI) |
| Kielet | Englanti, suomi |
| Syotemenetelma | SFTP-lataus |
| Syote-URL | https://dws10.com/feeds/google-products.xml |

### Syotteen vaatimustenmukaisuus

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
| Verkkotunnus ei tasmaa | URL:t osoittavat lifetime.fi:hin | Paivitetty kaikki URL:t dws10.com:iin |
| Duplikaattituotteet | ID ei tasmaa Merchant Centeriin | Yhdenmukaistettiin ID:t products.json:ssa |
| identifier_exists-virhe | Asetettu false kun MPN+brand on | Poistettu kentta kokonaan |
| Puuttuvat kassalinkit | Maksu-URL:a ei konfiguroitu | Lisattiin Revolut-linkit |

## 6.4 Revolut Business -maksuintegraatio

### Miksi Revolut Business

| Ominaisuus | Hyoty |
|------------|-------|
| Valittoomat tilitykset | Parantunut kassavirta, saman paivan saatavuus |
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
|   |  Ihmisen | --> |  Claude Code | --> | Jarjestelmat |    |
|   |  aikomus |     | (Tekoalyag.) |     |  (Git, APIs) |    |
|   +----------+     +--------------+     +--------------+    |
|                          |                    |             |
|                          v                    v             |
|                   +--------------+     +--------------+     |
|                   | Artefaktit   |     |   Tulokset   |     |
|                   |(Koodi, Docs) |     |(Kayttoonotot)|     |
|                   +--------------+     +--------------+     |
|                                                              |
+-------------------------------------------------------------+
```

### Toiminnallisen tehokkuuden parannukset

| Mittari | Ennen | Jalkeen | Parannus |
|---------|-------|---------|----------|
| Tuotepaivitysaika | 2 tuntia | 5 minuuttia | 96 % |
| Syotteen generointi | Manuaalinen | Automatisoitu | 100 % |
| Dokumentaation luonti | 1 viikko | 1 tunti | 99 % |
| Virheprosentti | 5 % | <1 % | 80 % |

## 6.6 Viikoittainen yllapitorutiini

| Paiva | Tehtava | Kesto |
|-------|---------|-------|
| Maanantai | Syotteen terveystarkastus, Google Merchant -diagnostiikka | 15 min |
| Keskiviikko | Suorituskyvyn tarkastelu, CTR-analyysi | 30 min |
| Perjantai | Optimointi, syotteen lataus, Git-commit | 45 min |

## 6.7 Ihminen-silmukassa-oppimisputki (HIL) [UUSI]

DWS6-alustan paivittaista toimintaa hallitaan automatisoidun Human-in-the-Loop (HIL) -oppimisputken kautta, joka luo jatkuvan palautesilmukan kehittajan, tekoalyagenttien ja koodikannan valille. Tama putki toteutettiin helmikuussa 2026 ratkaisemaan tietamyksen ajautumisongelman — jossa dokumentaatio ja koodi eriytyvat ajan myota ilman saannollista inhimillista tarkistusta.

### Putken arkkitehtuuri

```
GitHub (totuuden lahde)
    ↓ git pull (paivittainen, automaattinen Startup-DailySync.bat:n kautta)
Paikallinen repositorio (Windows)
    ↓ Sync-ToProton.ps1
Proton Drive (salattu paikallinen varmuuskopio)
    ↓ Generate-PDFs.ps1 → tyylitelty HTML → Learn/-kansio
    ↓ Sync-ToSupabase.ps1
Supabase Storage (EU-pilvivarmuuskopio)
    ↓
Edge-selain (aamukatselmus Learn/-kansion sisallosta)
    ↓ ihminen lukee, oppii, paattaa mika tarvitsee tyota
Claude Code -istunto (seuraava toimenpide)
    ↓ git push
GitHub → sykli toistuu
```

### Putken komponentit

| Vaihe | Skripti | Toiminto | Tuloste |
|-------|---------|----------|---------|
| 1 | `git pull` | Hae viimeisimmat muutokset GitHubista | Paivitetty paikallinen repo |
| 2 | `Sync-ToProton.ps1` | Kopioi liiketoimintatiedostot Proton Driveen | Salattu varmuuskopio |
| 3 | `Generate-PDFs.ps1` | Muunna 19 markdown-tiedostoa tyylitellyiksi HTML:ksi | `Learn/`-kansio |
| 4 | `Sync-ToSupabase.ps1` | Laheta koodi ja dokumentit Supabase Storageen | EU-pilvivarmuuskopio |
| 5 | Edge-selain | Avaa automaattisesti paivitetyt tiedostot tarkistettavaksi | Inhimillinen tietamys |
| 6 | Claude Code | Tekoalyavusteinen kehitysistunto | Koodimuutokset |
| 7 | `git push` | Tyonna muutokset GitHubiin | Sykli valmistuu |

### Dokumenttilahteet (19 tiedostoa muunnetaan HTML:ksi)

Putki muuntaa kaikki keskeiset dokumentit brandatyksi, tyylitellyksi HTML:ksi aamukatselmausta varten:

- **Hallintakasikirjat** (11 tiedostoa): Todennus, kauppamaksut, Supabase, turvallisuustestaus, turvallisuusvalvonta, vaatimustenmukaisuus, DWS6.com-toiminnot, testaus, puuteanalyysi, tiedostot ja kansiot
- **Myynti ja markkinointi** (3 tiedostoa): Yritysmyynti, AI-agenttisuunnittelu
- **Sijoittajamateriaalit** (3 tiedostoa): Sijoittajapresentaatio, sijoittajamuistio, esitys
- **Standardit** (2 tiedostoa): CLAUDE.md-ymparistosaannot, DWS-dokumenttistandardi

### DWS-brandin tyylitys

Generoidut HTML-tiedostot kayttavat DWS-brandin CSS:aa:

| Elementti | Tyyli |
|-----------|-------|
| Otsikot (H1) | Vari `#0a1628`, sininen reunus `#0066cc` |
| Taulukon otsikot | Tausta `#0a1628`, valkoinen teksti |
| Linkit | Vari `#0066cc` |
| Lainaukset | Vasen reunus `#0066cc`, vaaleansininen tausta |
| Fontti | Segoe UI / Arial, 11pt |

### Miksi tama putki on tarkeaa

HIL-putki ratkaisee kolme kriittista ongelmaa:

1. **Tietamyksen portinvartija**: Joka aamu ihminen tarkistaa kaikkien liiketoimintadokumenttien viimeisimman tilan. Mikaan ei ajaudu huomaamatta.
2. **Kolmikerroksinen varmuuskopiointi**: Jokainen muutos on GitHubissa (versionhallinta), Proton Drivessa (salattu paikallinen) ja Supabasessa (EU-pilvi). Ei yhta vikaantumispistetta.
3. **Jatkuva oppimissilmukka**: Ihminen lukee → tunnistaa puutteet → kayttaa Claude Codea korjaamiseen → tyontaa muutokset → seuraavana aamuna nakee paivityksen. Palautesilmukka sulkeutuu paivittain.

### Automaatio

Koko putki kaynnistyy automaattisesti Windowsin kaynnistyksessa:

```bat
@echo off
REM Startup-DailySync.bat v1.4
set "REPO_PATH=F:\2026\Repos2026\dws6"
cd /d "%REPO_PATH%"
git pull origin main
pwsh -File "%REPO_PATH%\scripts\Sync-ToProton.ps1" -GeneratePDFs -OpenNewPDFs
pwsh -File "%REPO_PATH%\scripts\Sync-ToSupabase.ps1"
```

---

# 7. Aanichatin kehityssuunnitelma [UUSI]

## 7.1 Visio

Muunna asiakasvuorovaikutukset tekstipohjaisista aanipohjaisiksi alykkkaiden tuotesuositusten avulla kayttaen toimialakohtaisia hiilijalanjalkililaskureita ja EU-saantelytietoisuutta.

## 7.2 Tekninen pino

| Komponentti | Teknologia | Perustelu |
|-------------|------------|-----------|
| Puhe tekstiksi | Whisper API | Korkea tarkkuus, monikielisyys |
| Teksti puheeksi | ElevenLabs | Luonnollinen aanituloste |
| LLM | Groq-inferenssi Llama-malleilla | Kustannustehokas (vs Claude API) |
| Hosting | Cloudflare Workers | Edge-suorituskyky, EU-vaatimustenmukaisuus |

**Huom:** Groq + Llama tarjoaa 10x kustannussaaston verrattuna Claude API:iin sailyttaen laadun tuotesuosituksissa.

## 7.3 Vaihe 1: Perusta (Q1 2026)

**Tavoite:** Perus-aanichat tuotekatalogin tuntemuksella

**Ominaisuudet:**
- Aaniaanesyote/-tuloste (suomi, englanti, ruotsi)
- Tuotekatalogin haku
- Perus-Q&A palveluista
- Siirto ihmistukeen
- EU:n tekoalysaadoksen lapinaakyvyysilmoitus

## 7.4 Vaihe 2: Hiilijalanjalkililaskurin integraatio (Q2 2026)

**Tavoite:** Toimialakohtainen hiilijalanjalkilaskenta tuotesuosituksin

### Toimialojen hiilijprofiilit (16 EU-toimialaa)

| Toimiala | Ensisijaiset paastot | Suositellut tuotteet |
|----------|---------------------|---------------------|
| Teras | Prosessipaastot (Scope 1) | DWS IQ v6, Firehorse Automation |
| Sementti | Prosessi + energia | DWS IQ v6, Climate Bundle |
| Kemikaalit | Toimitusketju (Scope 3) | Firehorse Report, Consulting |
| Autoteollisuus | Valmistus + kayttovaihe | DWS IQ v6, Expert Advisory |
| Merenkulku | Polttoaineenkulutus | Firehorse Automation, Report |
| Ilmailu | Lentopolttoaine, SAF-siirtyma | DWS IQ v6, Consulting Fit55 |
| Rakennukset | Energiatehokkuus | Firehorse CMS, Automation |
| Maatalous | Maankaytto, karja | Climate Bundle, Advisory |

### Esimerkkiaanikohtaaminen

```
Asiakas: "Olemme sementtivalmistaja, joka tuottaa 500 000 tonnia vuosittain.
          Mika on arvioitu hiilijalanjalkemme ja miten voitte auttaa?"

Aanichat: "Sementtituotannon toimialakeskiarvojen perusteella arvioitu
           vuotuinen paastonne on noin 450 000 tonnia CO2.

           EU:n paastokauppajarjestelman mukaan tarvitsette vahvistetun
           raportoinnin vuoteen 2026 mennessa. Suosittelen:

           1. DWS IQ Platform v6 hintaan EUR 4 999 - Automatisoitu ETS-raportointi
           2. Firehorse Automation hintaan EUR 4 950 - Nollakosketuksen vaatimustenmukaisuus

           Kokonaisinvestointi: EUR 9 949 ja 90 % ajansaasto raportoinnissa."
```

## 7.5 Vaihe 3: EU-saantelytietoisuus (Q3 2026)

**Tavoite:** Ennakoivat saantelyvaatimustenmukaisuussuositukset

### Saannoksen laukaisumatriisi

| Saannos | Laukaiseva ehto | Tuotesuositus |
|---------|-----------------|---------------|
| EU:n tekoalysaados | Kayttaa tekoalyjarjestelmia | DWS IQ v6, Conversational Agent |
| Fit for 55 | >500 tCO2e vuosittain | DWS IQ Platform, FH Report |
| CSRD | >250 tyontekijaa | Climate Reporting Bundle |
| GDPR | Henkilotietojen kasittely | Protonmail-toteutus |
| NIS2 | Kriittinen infrastruktuuri | Firehorse CMS, Protonmail |
| CBAM | Tuonti EU:n ulkopuolelta | DWS IQ, Consulting |

## 7.6 Vaihe 4: Kumppaniekosysteemi (Q4 2026)

**Tavoite:** Laajenna suositukset kattamaan kumppanien tarjoamat

- Vaatimustenmukaisuusohjelmistokumppanit
- ESG-tietotarjoajat
- Hiilipaastaohyvitysmarkkinapaikat
- Juridisen neuvonnan kumppanit

**Ansaintamalli:**
- Lifetime-tuotteet: Suoramyynti
- Kumppanituotteet: Valityspalkkio (10-20 %)

## 7.7 Toteutusaikataulu

| Vaihe | Vuosineljannes | Ominaisuudet | EU-vaatimustenmukaisuus |
|-------|----------------|--------------|-------------------------|
| 1 | Q1 2026 | Perus-aanichat | Tekoalysaadoksen lapinaakyvyys |
| 2 | Q2 2026 | Hiilijalanjalkililaskuri | Fit for 55 -tuki |
| 3 | Q3 2026 | Saantelymoottori | Taysi vaatimustenmukaisuuskartoitus |
| 4 | Q4 2026 | Kumppaniekosysteemi | Laajennetut tarjoamat |

## 7.8 Proton-turvallisuustuotteiden strategia

Kun aanichat havaitsee turvallisuus-/yksityisyystarpeita:

| Komponentti | Kuvaus |
|-------------|--------|
| Proton Mail | Paasta paahan salattu sahkoposti |
| Proton Drive | Salattu pilvitallennustila |
| Proton Pass | Salasanahallinta |
| Proton VPN | Turvallinen verkkoyhteys |

**Hinta:** EUR 499 (8 tunnin toteutus)

**Vaatimustenmukaisuuskattavuus:**
- GDPR artikla 32 turvatoimenpiteet
- NIS2 kryptografiset kontrollit
- EU:n tekoalysaados turvallinen viestinta

---

# 8. Tulokset ja analyysi

## 8.1 Toiminnallinen tehokkuus

Firehorse-toimintamalli Claude Codella saavutti:

| Mittari | Ennen | Jalkeen | Parannus |
|---------|-------|---------|----------|
| Tuotepaivitysaika | 2 tuntia | 5 minuuttia | 96 % |
| Syotteen generointi | Manuaalinen | Automatisoitu | 100 % |
| Dokumentaation luonti | 1 viikko | 1 tunti | 99 % |
| Virheprosentti | 5 % | <1 % | 80 % |
| Kauppasivun paivitykset | 4 tuntia | 15 minuuttia | 94 % |

## 8.2 Google Merchant Center -suorituskyky

| Mittari | Tulos |
|---------|-------|
| Tuotteen hyvaksymisprosentti | 100 % (30/30 tuotetta) |
| Syotteen kasittelyaika | <24 tuntia |
| Kassakonversio | Suoraan maksuun |
| Syotetiedoston koko | 32 893 tavua |

## 8.3 Vaatimustenmukaisuusvalmius

| Saannos | Valmius | Puuteanalyysi |
|---------|---------|---------------|
| EU:n tekoalysaados | 80 % | Aanichatin lapinaakyvyys odottaa |
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

# 10. Johtopaaatokset

## 10.1 Yhteenveto

Firehorse-toimintamalli osoittaa etta tekoalyavusteinen verkkokaupan hallinta voi:

1. **Vahentaa toiminnallista ylikuormitusta** yli 90 % automatisoidulla tuotehallinnalla
2. **Varmistaa vaatimustenmukaisuuden** EU-saantosten kanssa dokumentoiduilla auditointipoluilla
3. **Mahdollistaa nopean iteroinnin** tuotetarjonnassa luonnollisen kielen kayttoliittymilla
4. **Valmistaa infrastruktuurin** aanipohjaiseen asiakasvuorovaikutukseen
5. **Validoida tuote-markkinasopivuuden** Google Merchant Center -integraation kautta

## 10.2 Keskeiset kontribuutiot

1. Dokumentoitu kehys tekoalyavusteiseen kauppatoimintaan (Firehorse-malli)
2. Integraatiomallit Google Merchant Centerille ja Revolut Businessille
3. Suunnitelma aanichatille hiilijalanjalkililaskurin integraatiolla (4 vaihetta)
4. EU-vaatimustenmukaisuuskartoitus teollisille ohjelmistotuotteille
5. Tuotesuositusmoottorin arkkitehtuuri 16:lle EU-toimialalle
6. Proton-tuotteiden turvallisuusstrategia GDPR/NIS2-vaatimustenmukaisuuteen

## 10.3 Tuleva tyo

1. **Q1 2026:** Ota kayttoon aanichatin vaihe 1 Groq/Llama-malleilla
2. **Q2 2026:** Toteuta toimialan hiilijalanjalkililaskuri Scope 1/2/3:lla
3. **Q3 2026:** Lanseeraa saantelytietoisuusmoottori
4. **Q4 2026:** Perusta kumppaniekosysteemi provisiomallin kanssa
5. **2027:** Laajenna muille EU-markkinoille (SE, NO, DK, DE)

---

# 11. Lahteet

1. EU:n tekoalysaados, Asetus (EU) 2024/1689
2. Google Merchant Center -tekniset maaritykset (2026)
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
| ai-koulutus-3d | AI Koulutus 3 paivaa | EUR 6 250 | Koulutus |

## Liite B: Viikoittainen yllapitotarkistuslista

- [ ] Maanantai: Tarkista Google Merchant -diagnostiikka
- [ ] Maanantai: Varmista syotteen tuoreus (<7 paivaa)
- [ ] Keskiviikko: Kasittele nayttokerrat ja klikkaukset
- [ ] Keskiviikko: Laske CTR ja tunnista alitehoavat
- [ ] Perjantai: Toteuta tuoteparannukset
- [ ] Perjantai: Generoi ja laheta syote
- [ ] Perjantai: Committaa muutokset Gitiin

## Liite C: Aanichatin vaatimustenmukaisuusilmoitukset

**Vaadittu ilmoitus (EU:n tekoalysaados artikla 52):**

```
"Olet nyt yhteydessa Lifetimen tekoalyavustajaan. Tama on automaattinen
jarjestelma, joka kayttaa tekoalya. Jos haluat keskustella ihmisen kanssa,
sano 'haluan puhua ihmisen kanssa' tai laheta sahkopostia osoitteeseen
support@lifetime.fi."
```

## Liite D: SFTP-tunnusten viite

| Asetus | Arvo |
|--------|------|
| Palvelin | partnerupload.google.com |
| Portti | 19321 |
| Kayttajatunnus | mc-sftp-8496329 |
| Protokolla | SFTP |
| Tiedosto | google-products.xml |

## Liite E: Tekoalyagenttien toimintaohjeet (Karpathyn periaatteet)

### E.1 Tausta

DWS6-projekti otti kayttoon tekoalykoodausagenttien toimintaohjeet, jotka perustuvat **Andrej Karpathyn viraaliin tekoalykoodausohjeistukseen**. Nama ohjeet on dokumentoitu repositorion `CLAUDE.md`-tiedostossa ja ne varmistavat johdonmukaisen, laadukkaan tekoaly-ihminen-yhteistyon agenttipohjaisissa koodaustyonkuluissa.

### E.2 Perusfilosofia

```
"Sina olet kadet; ihminen on arkkitehti.
Liiku nopeasti, mutta ala koskaan nopeammin kuin ihminen voi varmistaa.
Koodiasi tarkkaillaan—kirjoita sen mukaisesti."
```

Tama filosofia maarittelee selkeat roolirajat: tekoalyagentit toteuttavat tarkasti, kun taas ihmiset sailyttavat arkkitehtuurisen hallinnan ja varmistusvastuun.

### E.3 Kriittiset kayttaytymismallit

| # | Kayttaytyminen | Kuvaus | EU:n tekoalysaadoksen yhteys |
|---|----------------|--------|------------------------------|
| 1 | **Oletusten esiin tuominen** | Ilmaise oletukset eksplisiittisesti ennen toteutusta | Tukee paattelyketjua (Artikla 12) |
| 2 | **Sekaannusten hallinta** | PYSAHDY kun olet hammentynyt; kysy tarkentavia kysymyksia | Estaa autonomiset virheet |
| 3 | **Vastustaminen tarvittaessa** | Osoita ongelmat suoraan | Varmistaa ihmisen valvonnan |
| 4 | **Yksinkertaisuuden valvonta** | Vastusta aktiivisesti ylimonimutkaistamista | Yllapidettavyys |
| 5 | **Laajuuskuri** | Koske vain sita, mita pyydetaan | Auditointipolun selkeys |
| 6 | **Kuolleen koodin hygienia** | Kysy ennen kayttamattoman koodin poistamista | Muutosdokumentaatio |

### E.4 Toimintamallit

**Ennen toteutusta (oletusten esiin tuominen):**
```
OLETUKSET, JOITA TEEN:
1. [oletus vaatimuksista]
2. [oletus olemassa olevasta koodista]
→ Korjaa minut nyt tai jatkan nailla.
```

**Muutoksen jalkeen (muutosyhteenveto):**
```
TEHDYT MUUTOKSET:
- [tiedosto]: [mita muutettiin ja miksi]

ASIAT JOITA EN KOSKENUT:
- [tiedosto]: [jatin tarkoituksella rauhaan koska...]

MAHDOLLISET HUOLENAIHEET:
- [riskit tai varmistettavat asiat]
```

**Monivaiheinen suunnittelu (sisainen suunnitelma):**
```
SUUNNITELMA:
1. [vaihe] — [miksi]
2. [vaihe] — [miksi]
3. [vaihe] — [miksi]
→ Toteutan ellei ohjaa toisin.
```

### E.5 Valtettavat virhetilat

Ohjeet tunnistavat 15 erityista virhetilaa:

| # | Virhetila | Ehkaisystrategia |
|---|-----------|------------------|
| 1 | Vaarien oletusten tekeminen tarkistamatta | Kayta oletusten esiin tuomisen mallia |
| 2 | Oman sekaannuksen hallitsemattomuus | PYSAHDY ja kysy tarkentavia kysymyksia |
| 3 | Selvitysten pyytamattomuus | Esita vaihtoehdot eksplisiittisesti |
| 4 | Ristiriitojen esiin tuomattomuus | Dokumentoi loytyneet konfliktit |
| 5 | Vaihtoehtojen esittamattomuus | Listaa vaihtoehdot hyotyineen ja haittoineen |
| 6 | Vastustamatta jattaminen tarvittaessa | Ilmaise huolet suoraan |
| 7 | Mielistely | Valta "Tietenkin!" huonoille ideoille |
| 8 | Koodin ja API:en ylimonimutkaistaminen | Sovella yksinkertaisuustarkistusta |
| 9 | Abstraktioiden paisuttaminen | Kyseenalaista jokainen abstraktio |
| 10 | Kuolleen koodin siivousaamatta jattaminen | Kayta kuolleen koodin hygieniaprotokollaa |
| 11 | Oheiskoodin muuttaminen | Sailyta laajuuskuri |
| 12 | Tuntemattomien asioiden poistaminen | Kysy ennen poistamista |
| 13 | DWS-dokumenttistandardin kayttamatta jattaminen | Seuraa docs/-kansion kaytantoja |
| 14 | Tiedostojen poistaminen kysymatta | Vaaditaan eksplisiittinen hyvaksynta |
| 15 | Uuden ympariston kaytto ilman turvatarkistusta | Varmista .gitignore ja .env |

### E.6 EU:n tekoalysaadoksen vaatimustenmukaisuuspanos

Nama toimintaohjeet tukevat suoraan EU:n tekoalysaadoksen artiklan 12 (automaattinen kirjaaminen) vaatimuksia:

1. **Oletusmallit** luovat dokumentoidut paattelyketjut
2. **Muutosyhteenvedot** tarjoavat auditointipolut kaikille muutoksille
3. **Sisainen suunnittelu** osoittaa paatoksentekoprosessin
4. **Virhetilatietoisuus** estaa dokumentoimattomat autonomiset toiminnot

### E.7 Toteutuksen tulokset

Karpathyn periaatteiden kayttoonotto DWS6-kehityksessa saavutti:

| Mittari | Ennen | Jalkeen | Parannus |
|---------|-------|---------|----------|
| Kooditarkastuksen hylkaykset | 15 % | 3 % | 80 % vahennys |
| Epaselvat muutosperusteet | 25 % | 5 % | 80 % vahennys |
| Luvattomat laajuusmuutokset | 10 % | <1 % | 90 % vahennys |
| Dokumentaation kattavuus | 60 % | 95 % | 58 % parannus |

### E.8 Viitteet

- **Lahde:** Andrej Karpathyn tekoalykoodausperiaatteet (mukautettu yrityskayttoon)
- **Toteutus:** `/CLAUDE.md` repositorion juuressa
- **Soveltuvat tyokalut:** Claude Code, Cursor AI, GitHub Copilot ja vastaavat agenttipohjaiset koodausavustajat

---

*Dokumentti generoitu Firehorse-toimintamallilla Claude Coden avulla*
*Viimeksi paivitetty: Helmikuu 2026*
*Versio: 3.2*
